"""
Production Inference Engine for TomatoCare AI.
Performs model inference, top-k probability ranking, and latency benchmarking.
"""

import json
import time
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Union
import numpy as np
from PIL import Image
import keras

from backend.ml.data.constants import CLASS_NAMES, CLASS_DISPLAY_NAMES, CLASS_CATEGORIES, CLASS_SEVERITY
from backend.ml.data.preprocessor import preprocess_for_inference


class TomatoLeafPredictor:
    """
    Thread-safe inference wrapper for the trained EfficientNetB0 model.
    """
    def __init__(self, model_path: Optional[str] = None, class_indices_path: Optional[str] = None):
        self.model: Optional[keras.Model] = None
        self.model_path = model_path
        self.class_indices_path = class_indices_path
        self.class_mapping: Dict[int, str] = {i: name for i, name in enumerate(CLASS_NAMES)}
        self.is_loaded = False
        self.model_metadata: Dict[str, Any] = {}
        
        if model_path and Path(model_path).exists():
            self.load_model(model_path, class_indices_path)

    def load_model(self, model_path: str, class_indices_path: Optional[str] = None) -> bool:
        """Loads model weights/architecture and class mappings."""
        p = Path(model_path)
        if not p.exists():
            self.is_loaded = False
            return False

        try:
            print(f"[*] Loading model from '{model_path}'...")
            self.model = keras.models.load_model(model_path)
            self.model_path = model_path

            # Load custom class mapping if available
            if class_indices_path and Path(class_indices_path).exists():
                with open(class_indices_path, "r") as f:
                    raw_mapping = json.load(f)
                    self.class_mapping = {int(k): v for k, v in raw_mapping.items()}
            else:
                self.class_mapping = {i: name for i, name in enumerate(CLASS_NAMES)}

            # Load model metadata if available
            meta_path = p.parent / "model_metadata.json"
            if meta_path.exists():
                with open(meta_path, "r") as f:
                    self.model_metadata = json.load(f)
            else:
                self.model_metadata = {
                    "model_name": "TomatoCare_EfficientNetB0",
                    "architecture": "EfficientNetB0",
                    "version": "1.0.0"
                }

            # Warm-up inference
            dummy_input = np.zeros((1, 224, 224, 3), dtype=np.float32)
            self.model.predict(dummy_input, verbose=0)

            self.is_loaded = True
            print("[+] Model loaded and warmed up successfully.")
            return True
        except Exception as e:
            print(f"[!] Error loading model from '{model_path}': {e}")
            self.is_loaded = False
            self.model = None
            return False

    def predict(
        self,
        image_input: Union[bytes, Image.Image, str],
        top_k: int = 3
    ) -> Dict[str, Any]:
        """
        Executes real inference on leaf image.
        Returns prediction details with probabilities, top-k ranking, and execution timing.
        """
        if not self.is_loaded or self.model is None:
            raise RuntimeError(
                "Model is not loaded or ready for inference. Please ensure the model is trained and saved in 'backend/artifacts/best_model.keras'."
            )

        # 1. Preprocess
        batch_array, pil_img = preprocess_for_inference(image_input)

        # 2. Measure inference time
        t0 = time.perf_counter()
        raw_probs = self.model.predict(batch_array, verbose=0)[0]
        t1 = time.perf_counter()
        inference_time_ms = round((t1 - t0) * 1000, 2)

        # 3. Process probabilities
        probabilities = [float(p) for p in raw_probs]
        predicted_index = int(np.argmax(probabilities))
        predicted_confidence = float(probabilities[predicted_index])
        predicted_raw_class = self.class_mapping.get(predicted_index, CLASS_NAMES[predicted_index])

        # 4. Top-K ranking
        sorted_indices = np.argsort(probabilities)[::-1]
        top_k_indices = sorted_indices[:top_k]
        
        top_k_predictions = []
        for idx in top_k_indices:
            raw_c = self.class_mapping.get(int(idx), CLASS_NAMES[int(idx)])
            top_k_predictions.append({
                "class_index": int(idx),
                "raw_class_name": raw_c,
                "display_name": CLASS_DISPLAY_NAMES.get(raw_c, raw_c),
                "category": CLASS_CATEGORIES.get(raw_c, "Unknown"),
                "severity": CLASS_SEVERITY.get(raw_c, "None"),
                "confidence": round(float(probabilities[idx]), 4),
                "confidence_percent": round(float(probabilities[idx]) * 100, 2)
            })

        # All class probabilities
        all_class_probabilities = []
        for idx, p in enumerate(probabilities):
            raw_c = self.class_mapping.get(idx, CLASS_NAMES[idx])
            all_class_probabilities.append({
                "class_index": idx,
                "raw_class_name": raw_c,
                "display_name": CLASS_DISPLAY_NAMES.get(raw_c, raw_c),
                "confidence": round(float(p), 4),
                "confidence_percent": round(float(p) * 100, 2)
            })

        return {
            "predicted_class_index": predicted_index,
            "raw_class_name": predicted_raw_class,
            "display_name": CLASS_DISPLAY_NAMES.get(predicted_raw_class, predicted_raw_class),
            "category": CLASS_CATEGORIES.get(predicted_raw_class, "Unknown"),
            "severity": CLASS_SEVERITY.get(predicted_raw_class, "None"),
            "confidence": round(predicted_confidence, 4),
            "confidence_percent": round(predicted_confidence * 100, 2),
            "top_k_predictions": top_k_predictions,
            "all_class_probabilities": all_class_probabilities,
            "inference_time_ms": inference_time_ms,
            "model_name": self.model_metadata.get("model_name", "TomatoCare_EfficientNetB0"),
            "model_version": self.model_metadata.get("version", "1.0.0"),
            "image_size": [pil_img.width, pil_img.height]
        }
