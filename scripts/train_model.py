"""
CLI Script: Train TomatoCare AI EfficientNetB0 Deep Learning Model.
"""

import argparse
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.ml.training.trainer import train_tomato_model
from backend.ml.evaluation.evaluator import evaluate_model_on_test_items
import keras


def main():
    parser = argparse.ArgumentParser(description="Train TomatoCare AI EfficientNetB0 Model.")
    parser.add_argument(
        "--data_dir",
        type=str,
        default="backend/data/plantvillage_tomato",
        help="Path to root dataset folder."
    )
    parser.add_argument(
        "--output_dir",
        type=str,
        default="backend/artifacts",
        help="Directory to save trained model artifacts."
    )
    parser.add_argument(
        "--batch_size",
        type=int,
        default=32,
        help="Batch size for training."
    )
    parser.add_argument(
        "--initial_epochs",
        type=int,
        default=15,
        help="Number of epochs for Phase 1 (frozen backbone)."
    )
    parser.add_argument(
        "--fine_tune_epochs",
        type=int,
        default=10,
        help="Number of epochs for Phase 2 fine-tuning."
    )
    parser.add_argument(
        "--initial_lr",
        type=float,
        default=1e-4,
        help="Initial learning rate for head training."
    )
    parser.add_argument(
        "--fine_tune_lr",
        type=float,
        default=1e-5,
        help="Fine-tuning learning rate."
    )
    parser.add_argument(
        "--evaluate_after_train",
        action="store_true",
        default=True,
        help="Run evaluation on test split immediately after training."
    )
    args = parser.parse_args()

    print("=" * 60)
    print(" TomatoCare AI — EfficientNetB0 Model Training Pipeline")
    print("=" * 60)
    print(f"Data Directory     : {args.data_dir}")
    print(f"Output Directory   : {args.output_dir}")
    print(f"Batch Size         : {args.batch_size}")
    print(f"Initial Epochs     : {args.initial_epochs}")
    print(f"Fine-tune Epochs   : {args.fine_tune_epochs}")
    print(f"Initial LR         : {args.initial_lr}")
    print(f"Fine-tune LR       : {args.fine_tune_lr}\n")

    try:
        results = train_tomato_model(
            data_dir=args.data_dir,
            output_dir=args.output_dir,
            batch_size=args.batch_size,
            initial_epochs=args.initial_epochs,
            fine_tune_epochs=args.fine_tune_epochs,
            initial_lr=args.initial_lr,
            fine_tune_lr=args.fine_tune_lr
        )
        print("\n[+] Model training finished successfully!")
        print(f"[+] Saved model to: {results['model_path']}")

        if args.evaluate_after_train and results.get("test_items"):
            print("\n[*] Running final evaluation on held-out test split...")
            best_model = keras.models.load_model(results["model_path"])
            eval_metrics = evaluate_model_on_test_items(
                model=best_model,
                test_items=results["test_items"],
                output_dir=args.output_dir
            )
            print(f"[+] Final Test Accuracy: {eval_metrics['overall']['test_accuracy'] * 100:.2f}%")
            print(f"[+] Final Macro F1-Score: {eval_metrics['overall']['macro_f1']:.4f}")

    except Exception as e:
        print(f"\n[!] Training failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
