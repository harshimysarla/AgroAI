"""
CLI Script: Evaluate Trained EfficientNetB0 Model on Test Dataset.
"""

import argparse
import sys
from pathlib import Path
import keras

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.ml.data.dataset_loader import scan_and_validate_dataset, create_stratified_splits
from backend.ml.evaluation.evaluator import evaluate_model_on_test_items


def main():
    parser = argparse.ArgumentParser(description="Evaluate TomatoCare AI Model.")
    parser.add_argument(
        "--model_path",
        type=str,
        default="backend/artifacts/best_model.keras",
        help="Path to trained model artifact."
    )
    parser.add_argument(
        "--data_dir",
        type=str,
        default="backend/data/plantvillage_tomato",
        help="Path to dataset directory."
    )
    parser.add_argument(
        "--output_dir",
        type=str,
        default="backend/artifacts",
        help="Directory to save evaluation results."
    )
    args = parser.parse_args()

    print("=" * 60)
    print(" TomatoCare AI — Held-Out Model Evaluation Suite")
    print("=" * 60)
    print(f"Model Path  : {args.model_path}")
    print(f"Dataset Dir : {args.data_dir}\n")

    if not Path(args.model_path).exists():
        print(f"[!] Model file '{args.model_path}' does not exist.")
        sys.exit(1)

    scan_res = scan_and_validate_dataset(args.data_dir)
    if not scan_res["is_valid"]:
        print(f"[!] Dataset is invalid: {scan_res['message']}")
        sys.exit(1)

    _, _, test_items = create_stratified_splits(scan_res["file_paths_by_class"])
    print(f"[+] Loaded {len(test_items)} held-out test samples across 10 classes.")

    print("[*] Loading model...")
    model = keras.models.load_model(args.model_path)

    print("[*] Computing predictions, precision, recall, F1, and confusion matrix...")
    results = evaluate_model_on_test_items(model, test_items, output_dir=args.output_dir)

    print("\n" + "=" * 60)
    print(" EVALUATION SUMMARY")
    print("=" * 60)
    print(f" Test Accuracy     : {results['overall']['test_accuracy'] * 100:.2f}%")
    print(f" Macro Precision   : {results['overall']['macro_precision']:.4f}")
    print(f" Macro Recall      : {results['overall']['macro_recall']:.4f}")
    print(f" Macro F1-Score    : {results['overall']['macro_f1']:.4f}")
    print(f" Weighted F1-Score : {results['overall']['weighted_f1']:.4f}")
    print(f" Total Test Images : {results['overall']['total_test_samples']}")
    print("=" * 60)
    print(f"Results saved to '{args.output_dir}/evaluation_metrics.json'.")


if __name__ == "__main__":
    main()
