import uuid

from app.config import settings
from app.services.supabase_client import supabase

UPLOAD_BUCKET = settings.SUPABASE_UPLOAD_BUCKET
ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"]


def normalize_image_content_type(content_type: str) -> str:
    content_type = (content_type or "").split(";", 1)[0].strip().lower()
    if content_type == "image/jpg":
        return "image/jpeg"
    return content_type


def extension_from_content_type(content_type: str) -> str:
    extensions = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
    }
    return extensions.get(content_type, "jpg")


def upload_image_to_storage(file_bytes: bytes, filename: str, content_type: str) -> str:
    """Upload gambar ke bucket Supabase dan return public URL."""
    bucket = supabase.storage.from_(UPLOAD_BUCKET)
    content_type = normalize_image_content_type(content_type)
    file_ext = extension_from_content_type(content_type)
    new_name = f"{uuid.uuid4()}.{file_ext}"
    try:
        bucket.upload(new_name, file_bytes, {"content-type": content_type})
        return bucket.get_public_url(new_name)
    except Exception as exc:
        raise RuntimeError(
            f"Gagal upload gambar ke bucket Storage '{UPLOAD_BUCKET}'. "
            "Pastikan bucket ada dan policy Storage mengizinkan upload."
        ) from exc
