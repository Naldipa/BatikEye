import logging
from fastapi import APIRouter, Depends, UploadFile, File
from app.models.schemas import PredictionResponse, MotifInfo
from app.models.prediction import classifier   # <-- gunakan model asli
from app.services.profiles import ensure_profile_exists
from app.services.supabase_client import supabase
from app.services.storage import (
    ALLOWED_IMAGE_MIME_TYPES,
    normalize_image_content_type,
    upload_image_to_storage,
)
from app.utils.auth import get_current_user
from app.utils.errors import api_error
from app.utils.image_utils import detect_image_content_type
from app.utils.motifs import canonical_motif_key

CONFIDENCE_THRESHOLD = 0.75
MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024
MAX_UPLOAD_SIZE_MB = MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)
ALLOWED_UPLOAD_CONTENT_TYPES = {
    normalize_image_content_type(content_type)
    for content_type in ALLOWED_IMAGE_MIME_TYPES
}

router = APIRouter()
logger = logging.getLogger(__name__)


def raise_predict_error(message: str, error: Exception, code: str = "PREDICT_FAILED") -> None:
    detail = f"{message}: {str(error)}"
    logger.exception(message)
    raise api_error(500, code, detail)


def format_history_error(message: str, error: Exception) -> str:
    detail = f"{message}: {str(error)}"
    logger.exception(message)
    return detail


def validate_upload_content_type(content_type: str) -> str:
    normalized_content_type = normalize_image_content_type(content_type)
    if not normalized_content_type or not normalized_content_type.startswith("image/"):
        raise api_error(400, "NOT_IMAGE", "File harus berupa gambar.")
    if normalized_content_type not in ALLOWED_UPLOAD_CONTENT_TYPES:
        raise api_error(
            400,
            "INVALID_FILE_FORMAT",
            "Format file tidak valid. Gunakan JPG, JPEG, atau PNG.",
        )
    return normalized_content_type

@router.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    # 1. Validasi file
    submitted_content_type = validate_upload_content_type(file.content_type)
    
    # 2. Baca konten gambar dengan batas ukuran.
    contents = await file.read(MAX_UPLOAD_SIZE_BYTES + 1)
    if not contents:
        raise api_error(400, "EMPTY_FILE", "File gambar wajib diunggah.")
    if len(contents) > MAX_UPLOAD_SIZE_BYTES:
        raise api_error(
            413,
            "FILE_TOO_LARGE",
            f"Ukuran file maksimal {MAX_UPLOAD_SIZE_MB}MB.",
        )

    try:
        actual_content_type = detect_image_content_type(contents)
    except ValueError as e:
        code = "CORRUPT_IMAGE" if "corrupt" in str(e).lower() else "INVALID_FILE_FORMAT"
        raise api_error(400, code, str(e))

    if actual_content_type != submitted_content_type:
        raise api_error(
            400,
            "MIME_MISMATCH",
            "Tipe file tidak sesuai dengan isi gambar.",
        )
    
    # 3. Prediksi menggunakan model TensorFlow
    try:
        predicted_class, confidence = classifier.predict(contents)
        # predicted_class: string misal "Parang", "Mega-Mendung", "Kawung" dll.
        # confidence: float 0..1
    except Exception as e:
        code = "MODEL_NOT_READY" if not classifier._model_loaded else "PREDICT_FAILED"
        raise api_error(500, code, f"Prediksi gagal: {str(e)}")
    
        # 4a. Cek apakah confidence di atas threshold
    if confidence < CONFIDENCE_THRESHOLD:
        logger.info(
            "Prediction skipped history due to low confidence user_id=%s prediction=%s confidence=%s",
            user_id,
            predicted_class,
            confidence,
        )
        return PredictionResponse(
            is_batik=False,
            prediction="Tidak dikenal",
            motif_key=None,
            confidence=confidence,
            info=None,
            code="NOT_BATIK",
            history_saved=False,
            message="Gambar yang diunggah tidak dikenali sebagai motif batik. Pastikan gambar berfokus pada motif batik yang jelas."
        )
    
    # 4. Ambil informasi motif dari database Supabase berdasarkan nama
    try:
        result = supabase.table("motifs").select("*").eq("name", predicted_class).execute()
        if not result.data:
            result = supabase.table("motifs").select("*").ilike("name", predicted_class).execute()
        if not result.data:
            result = supabase.table("motifs").select("*").ilike("name", f"%{predicted_class}%").execute()
    except Exception as e:
        logger.exception("Gagal mengambil motif dari Supabase")
        raise_predict_error("Prediksi berhasil, tetapi gagal mengambil data motif", e)
    
    if not result.data:
        # Jika motif tidak ditemukan di database, kembalikan info minimal
        info = MotifInfo(
            name=predicted_class,
            origin="Tidak diketahui",
            philosophy="Informasi motif belum tersedia di database",
            history="",
            usage="",
            colors=[],
            image_url=""
        )
    else:
        motif_db = result.data[0]
        info = MotifInfo(
            name=motif_db["name"],
            origin=motif_db.get("origin", ""),
            philosophy=motif_db.get("philosophy", ""),
            history=motif_db.get("history", ""),
            usage=motif_db.get("usage", ""),
            colors=motif_db.get("colors", []),
            image_url=motif_db.get("image_url", "")
        )
    
    # 5. Upload gambar dan simpan riwayat prediksi untuk user dari token login.
    history_saved = False
    history_error = None
    image_url = None
    motif_key = canonical_motif_key(info.name or predicted_class)

    try:
        motif_id = result.data[0]["id"] if result.data else None
        try:
            image_url = upload_image_to_storage(
                contents,
                file.filename or "prediction.jpg",
                actual_content_type,
            )
        except Exception as e:
            logger.exception("Gagal upload gambar ke Supabase Storage")
            history_error = format_history_error(
                "Prediksi berhasil, tetapi gagal upload gambar ke Storage",
                e,
            )

        history_payload = {
            "user_id": user_id,
            "motif_id": motif_id,
            "confidence": confidence,
            "image_url": image_url or "",
        }
        try:
            ensure_profile_exists(user_id)
            history_result = supabase.table("upload_history").insert(history_payload).execute()
            logger.info("upload_history insert result: %s", history_result)
            history_saved = True
            logger.info(
                "Prediction history saved user_id=%s motif_id=%s confidence=%s",
                user_id,
                motif_id,
                confidence,
            )
        except Exception as e:
            logger.exception("Gagal insert upload_history ke Supabase")
            history_error = format_history_error(
                f"Prediksi berhasil, tetapi gagal insert upload_history. Payload={history_payload}",
                e,
            )
    except Exception as e:
        logger.exception("Gagal menyimpan upload_history ke Supabase")
        history_error = format_history_error("Prediksi berhasil, tetapi gagal menyimpan riwayat", e)
    
    logger.debug(
        "Prediction response user_id=%s prediction=%s confidence=%s history_saved=%s",
        user_id,
        predicted_class,
        confidence,
        history_saved,
    )

    # 6. Kembalikan response
    return PredictionResponse(
        prediction=predicted_class,
        motif_key=motif_key,
        confidence=confidence,
        image_url=image_url,
        info=info,
        history_saved=history_saved,
        history_error=history_error,
        uploaded_image_url=image_url,
        history_user_id=user_id,
    )
