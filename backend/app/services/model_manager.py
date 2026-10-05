"""
Central Model Lifecycle and Inference Manager.
Ensures single-instance model loading, robust health status tracking, and graceful fallback handling.
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional, Tuple, Union
from PIL import Image

from backend.ml.inference.predictor import TomatoLeafPredictor
from backend.ml.explainability.gradcam import generate_gradcam_explanation


class ModelManager:
    _instance: Optional["ModelManager"] = None

    def __init__(self, artifacts_dir: str = "backend/artifacts"):
        self.artifacts_dir = Path(artifacts_dir)
        self.predictor: Optional[TomatoLeafPredictor] = None
        self.status = "uninitialized"  # "ready", "model_unavailable", "error"
        self.status_message = "Model manager initializing..."
        self.metrics: Optional[Dict[str, Any]] = None
        self.training_info: Optional[Dict[str, Any]] = None
        self.history: Optional[Dict[str, Any]] = None

    @classmethod
    def get_instance(cls, artifacts_dir: str = "backend/artifacts") -> "ModelManager":
        if cls._instance is None:
            cls._instance = ModelManager(artifacts_dir)
            cls._instance.initialize()
        elif cls._instance.status == "uninitialized":
            cls._instance.initialize()
        return cls._instance

    def initialize(self) -> None:
        """Attempts to discover and load trained model weights and evaluation metadata."""
        self.artifacts_dir.mkdir(parents=True, exist_ok=True)
        
        # Candidate model files
        best_model_path = self.artifacts_dir / "best_model.keras"
        final_model_path = self.artifacts_dir / "final_model.keras"
        class_indices_path = self.artifacts_dir / "class_indices.json"
        metrics_path = self.artifacts_dir / "evaluation_metrics.json"
        metadata_path = self.artifacts_dir / "model_metadata.json"
        history_path = self.artifacts_dir / "training_history.json"

        # Load metadata if exists
        if metadata_path.exists():
            try:
                with open(metadata_path, "r") as f:
                    self.training_info = json.load(f)
            except Exception as e:
                print(f"[!] Warning: Could not parse model_metadata.json: {e}")

        # Load metrics if exists
        if metrics_path.exists():
            try:
                with open(metrics_path, "r") as f:
                    self.metrics = json.load(f)
            except Exception as e:
                print(f"[!] Warning: Could not parse evaluation_metrics.json: {e}")

        # Load history if exists
        if history_path.exists():
            try:
                with open(history_path, "r") as f:
                    self.history = json.load(f)
            except Exception as e:
                print(f"[!] Warning: Could not parse training_history.json: {e}")

        # Choose model artifact
        target_model = None
        if best_model_path.exists():
            target_model = str(best_model_path)
        elif final_model_path.exists():
            target_model = str(final_model_path)

        if target_model is None:
            self.status = "model_unavailable"
            self.status_message = (
                "No trained EfficientNetB0 model found in 'backend/artifacts/'. "
                "Please run 'python scripts/train_model.py --data_dir <path_to_dataset>' to train the model, "
                "or place 'best_model.keras' into the artifacts directory."
            )
            print(f"[!] {self.status_message}")
            return

        try:
            self.predictor = TomatoLeafPredictor(
                model_path=target_model,
                class_indices_path=str(class_indices_path) if class_indices_path.exists() else None
            )
            if self.predictor.is_loaded:
                self.status = "ready"
                self.status_message = f"EfficientNetB0 model loaded and ready from '{target_model}'."
                print(f"[+] {self.status_message}")
            else:
                self.status = "error"
                self.status_message = f"Failed to load model weights from '{target_model}'."
        except Exception as e:
            self.status = "error"
            self.status_message = f"Exception during model load: {str(e)}"
            print(f"[!] {self.status_message}")

    def predict(self, image_input: Union[bytes, Image.Image, str], top_k: int = 3) -> Dict[str, Any]:
        """Runs prediction through loaded predictor."""
        if self.status != "ready" or self.predictor is None or not self.predictor.is_loaded:
            raise RuntimeError(self.status_message)
        return self.predictor.predict(image_input, top_k=top_k)

    def explain(self, pil_image: Image.Image, class_index: Optional[int] = None, alpha: float = 0.45) -> Dict[str, Any]:
        """Runs Grad-CAM explainability on the loaded model."""
        if self.status != "ready" or self.predictor is None or self.predictor.model is None:
            raise RuntimeError(self.status_message)
        return generate_gradcam_explanation(
            model=self.predictor.model,
            pil_image=pil_image,
            class_index=class_index,
            alpha=alpha
        )

    def get_status_summary(self) -> Dict[str, Any]:
        """Returns live system readiness status."""
        return {
            "status": self.status,
            "is_ready": self.status == "ready",
            "message": self.status_message,
            "architecture": "EfficientNetB0",
            "input_resolution": [224, 224, 3],
            "num_classes": 10,
            "has_evaluation_metrics": self.metrics is not None,
            "has_training_history": self.history is not None,
            "model_metadata": self.training_info
        }

    def get_metrics_summary(self) -> Optional[Dict[str, Any]]:
        return self.metrics

    def get_training_info_summary(self) -> Optional[Dict[str, Any]]:
        return {
            "metadata": self.training_info,
            "history": self.history
        }
