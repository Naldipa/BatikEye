import cv2
import numpy as np
from PIL import Image
import io

TARGET_SIZE = (150, 150)
SUPPORTED_IMAGE_FORMATS = {
    "JPEG": "image/jpeg",
    "PNG": "image/png",
}


def detect_image_content_type(image_bytes: bytes) -> str:
    """Validasi isi file dan return MIME type dari format gambar sebenarnya."""
    try:
        with Image.open(io.BytesIO(image_bytes)) as image:
            image.verify()
            image_format = image.format
    except Exception as exc:
        raise ValueError("File gambar tidak valid atau corrupt") from exc

    content_type = SUPPORTED_IMAGE_FORMATS.get(image_format)
    if not content_type:
        raise ValueError("Format file tidak valid. Gunakan JPG, JPEG, atau PNG")

    return content_type

def preprocess_image(image_bytes: bytes):
    """
    Preprocessing gambar sesuai dengan yang dilakukan saat training:
    - Resize ke (150,150)
    - Konversi ke array
    - Rescale 1/255
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(TARGET_SIZE)
    image_array = np.array(image) / 255.0   # rescale
    image_array = np.expand_dims(image_array, axis=0)  # batch dimension
    return image_array
