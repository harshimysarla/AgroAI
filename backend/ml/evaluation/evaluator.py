"""
Model Evaluation and Performance Metrics Suite for TomatoCare AI.
Evaluates the trained EfficientNetB0 on a strictly held-out test dataset.
"""

import json
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
import numpy as np
from PIL import Image
import keras
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support, accuracy_score

from backend.ml.data.constants import CLASS_NAMES, CLASS_DISPLAY_NAMES
from backend.ml.data.preprocessor import preprocess_pil_image


def evaluate_model_on_test_items(
    model: keras.Model,
    test_items: List[Tuple[str, int]],
    output_dir: str = "backend/artifacts"
) -> Dict[str, Any]:
    """
    Evaluates model predictions on given (filepath, ground_truth_label) test items.
    """
    if not test_items:
        raise ValueError("Cannot evaluate model on an empty test set.")

    y_true: List[int] = []
    y_pred: List[int] = []
    y_probs: List[List[float]] = []

    print(f"[*] Evaluating model on {len(test_items)} held-out test samples...")

    for path_str, label in test_items:
        try:
            with Image.open(path_str) as img:
                arr = preprocess_pil_image(img)
                batch = np.expand_dims(arr, axis=0)
                preds = model.predict(batch, verbose=0)[0]
                pred_label = int(np.argmax(preds))
                
                y_true.append(int(label))
                y_pred.append(pred_label)
                y_probs.append([float(p) for p in preds])
        except Exception as e:
            print(f"[!] Warning: Failed to evaluate image '{path_str}': {e}")
            continue

    if not y_true:
        raise RuntimeError("No valid test images could be processed during evaluation.")

    # Calculate metrics
    y_true_np = np.array(y_true)
    y_pred_np = np.array(y_pred)

    overall_accuracy = float(accuracy_score(y_true_np, y_pred_np))
    precision_macro, recall_macro, f1_macro, _ = precision_recall_fscore_support(
        y_true_np, y_pred_np, average="macro", zero_division=0
    )
    precision_weighted, recall_weighted, f1_weighted, _ = precision_recall_fscore_support(
        y_true_np, y_pred_np, average="weighted", zero_division=0
    )

    # Per-class metrics
    present_classes = sorted(list(set(y_true + y_pred)))
    all_class_indices = list(range(len(CLASS_NAMES)))
    
    per_class_p, per_class_r, per_class_f1, per_class_supp = precision_recall_fscore_support(
        y_true_np, y_pred_np, labels=all_class_indices, zero_division=0
    )

    per_class_metrics: List[Dict[str, Any]] = []
    for idx, class_name in enumerate(CLASS_NAMES):
        per_class_metrics.append({
            "class_index": idx,
            "class_name": class_name,
            "display_name": CLASS_DISPLAY_NAMES.get(class_name, class_name),
            "precision": round(float(per_class_p[idx]), 4),
            "recall": round(float(per_class_r[idx]), 4),
            "f1_score": round(float(per_class_f1[idx]), 4),
            "support": int(per_class_supp[idx])
        })

    # Confusion matrix (10x10)
    cm = confusion_matrix(y_true_np, y_pred_np, labels=all_class_indices)
    cm_list = cm.tolist()
    
    # Normalized confusion matrix (percentages)
    cm_norm = np.zeros_like(cm, dtype=float)
    row_sums = cm.sum(axis=1)
    for i, s in enumerate(row_sums):
        if s > 0:
            cm_norm[i] = cm[i] / s
    cm_norm_list = np.round(cm_norm, 4).tolist()

    report_dict = classification_report(
        y_true_np, y_pred_np,
        labels=all_class_indices,
        target_names=[CLASS_DISPLAY_NAMES.get(c, c) for c in CLASS_NAMES],
        output_dict=True,
        zero_division=0
    )

    results = {
        "overall": {
            "test_accuracy": round(overall_accuracy, 4),
            "macro_precision": round(float(precision_macro), 4),
            "macro_recall": round(float(recall_macro), 4),
            "macro_f1": round(float(f1_macro), 4),
            "weighted_precision": round(float(precision_weighted), 4),
            "weighted_recall": round(float(recall_weighted), 4),
            "weighted_f1": round(float(f1_weighted), 4),
            "total_test_samples": len(y_true)
        },
        "per_class": per_class_metrics,
        "confusion_matrix": {
            "raw": cm_list,
            "normalized": cm_norm_list,
            "labels": [CLASS_DISPLAY_NAMES.get(c, c) for c in CLASS_NAMES]
        },
        "classification_report": report_dict
    }

    # Save to file
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)
    with open(out_path / "evaluation_metrics.json", "w") as f:
        json.dump(results, f, indent=2)

    print(f"[+] Evaluation completed. Test Accuracy: {overall_accuracy * 100:.2f}% | Macro F1: {f1_macro:.4f}")
    return results
