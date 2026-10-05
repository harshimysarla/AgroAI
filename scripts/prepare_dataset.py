"""
CLI Script: Scan, Validate, and Summarize the PlantVillage Tomato Leaf Dataset.
"""

import argparse
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.ml.data.constants import CLASS_NAMES, CLASS_DISPLAY_NAMES
from backend.ml.data.dataset_loader import scan_and_validate_dataset, create_stratified_splits


def main():
    parser = argparse.ArgumentParser(description="Prepare and validate Tomato Leaf Disease Dataset.")
    parser.add_argument(
        "--data_dir",
        type=str,
        default="backend/data/plantvillage_tomato",
        help="Path to root dataset folder containing the 10 class subdirectories."
    )
    args = parser.parse_args()

    print("=" * 60)
    print(" TomatoCare AI — Dataset Preparation & Validation Suite")
    print("=" * 60)
    print(f"Target Directory: {args.data_dir}\n")

    result = scan_and_validate_dataset(args.data_dir)

    print(f"Status: {'VALID' if result['is_valid'] else 'INVALID / INCOMPLETE'}")
    print(f"Message: {result['message']}\n")
    print("Class Distribution Breakdown:")
    print("-" * 60)
    for cls in CLASS_NAMES:
        count = result["class_counts"].get(cls, 0)
        display = CLASS_DISPLAY_NAMES.get(cls, cls)
        print(f" • {display:<35}: {count:>5} images")
    print("-" * 60)
    print(f" Total Images Verified: {result['total_images']}\n")

    if result["missing_classes"]:
        print("Missing or Unmatched Classes:")
        for m in result["missing_classes"]:
            print(f" [!] {m}")
        print("\nPlease ensure your folder names match standard PlantVillage conventions.")
        sys.exit(1)

    # Preview stratified splits
    train, val, test = create_stratified_splits(result["file_paths_by_class"])
    print(f"Proposed Stratified Splits (70% Train / 15% Val / 15% Test):")
    print(f" • Training Set   : {len(train):>5} images")
    print(f" • Validation Set : {len(val):>5} images")
    print(f" • Test Set       : {len(test):>5} images")
    print("\nDataset is ready for model training!")


if __name__ == "__main__":
    main()
