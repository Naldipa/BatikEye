import logging
import tensorflow as tf
import numpy as np
from app.config import settings
from app.utils.image_utils import preprocess_image
from app.utils.class_labels import CLASS_LABELS

logger = logging.getLogger(__name__)

class BatikClassifier:
    def __init__(self):
        self.model = None
        self.class_names = CLASS_LABELS
        self._model_loaded = False

    def _load_model(self):
        if self._model_loaded:
            return
        try:
            self.model = tf.keras.layers.TFSMLayer(
                settings.MODEL_PATH,
                call_endpoint='serving_default'
            )
            logger.info("Model loaded as TFSMLayer from %s", settings.MODEL_PATH)
            self._model_loaded = True
        except Exception as e:
            logger.exception("Error loading model")
            raise

    def predict(self, image_bytes: bytes):
        self._load_model()
        processed = preprocess_image(image_bytes)
        predictions = self.model(processed) 
        if isinstance(predictions, dict):
            pred_tensor = list(predictions.values())[0]
        else:
            pred_tensor = predictions
        idx = np.argmax(pred_tensor[0])
        confidence = float(pred_tensor[0][idx])
        predicted_class = self.class_names[idx]
        return predicted_class, confidence

classifier = BatikClassifier()
