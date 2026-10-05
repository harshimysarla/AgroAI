"""
Dataset Helper: Prepares dataset folders and creates representative benchmark sample images
for all 10 tomato leaf classes if full dataset is being downloaded.
"""

import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.ml.data.constants import CLASS_NAMES, CLASS_DISPLAY_NAMES


def create_botanical_sample_leaf(class_name: str, index: int) -> Image.Image:
    """Generates a realistic synthetic tomato leaf image with characteristic disease signatures."""
    np.random.seed(hash(f"{class_name}_{index}") % (2**31))
    
    # Base background (neutral indoor or workbench background)
    bg_color = (
        int(np.random.randint(180, 220)),
        int(np.random.randint(180, 215)),
        int(np.random.randint(170, 205))
    )
    img = Image.new("RGB", (256, 256), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Leaf base polygon (compound tomato leaflet silhouette)
    leaf_color = (
        int(np.random.randint(40, 70)),
        int(np.random.randint(120, 160)),
        int(np.random.randint(40, 70))
    )
    
    # Draw leaf shape
    points = [
        (128, 30),
        (160, 70), (190, 110), (175, 160), (145, 210),
        (128, 230),
        (111, 210), (81, 160), (66, 110), (96, 70)
    ]
    draw.polygon(points, fill=leaf_color, outline=(30, 90, 30))
    
    # Draw central vein and lateral veins
    draw.line([(128, 35), (128, 225)], fill=(80, 180, 80), width=3)
    for y in range(60, 200, 25):
        draw.line([(128, y), (128 + np.random.randint(25, 45), y - 10)], fill=(70, 160, 70), width=2)
        draw.line([(128, y), (128 - np.random.randint(25, 45), y - 10)], fill=(70, 160, 70), width=2)

    # Add disease visual signatures
    if "Bacterial_spot" in class_name:
        # Small dark spots with yellow halos
        for _ in range(15):
            sx = int(np.random.randint(90, 165))
            sy = int(np.random.randint(60, 190))
            r = int(np.random.randint(3, 7))
            draw.ellipse([sx-r-2, sy-r-2, sx+r+2, sy+r+2], fill=(200, 200, 50))
            draw.ellipse([sx-r, sy-r, sx+r, sy+r], fill=(30, 20, 10))
            
    elif "Early_blight" in class_name:
        # Large spots with concentric target rings
        for _ in range(4):
            sx = int(np.random.randint(100, 155))
            sy = int(np.random.randint(80, 170))
            r = int(np.random.randint(14, 24))
            draw.ellipse([sx-r-3, sy-r-3, sx+r+3, sy+r+3], fill=(190, 180, 40))
            draw.ellipse([sx-r, sy-r, sx+r, sy+r], fill=(60, 40, 20))
            draw.ellipse([sx-r+4, sy-r+4, sx+r-4, sy+r-4], fill=(90, 60, 30))
            draw.ellipse([sx-r+8, sy-r+8, sx+r-8, sy+r-8], fill=(45, 30, 15))

    elif "Late_blight" in class_name:
        # Large irregular water-soaked dark patches
        for _ in range(3):
            sx = int(np.random.randint(95, 160))
            sy = int(np.random.randint(70, 180))
            r = int(np.random.randint(20, 35))
            draw.ellipse([sx-r, sy-r, sx+r, sy+r], fill=(40, 45, 30))
            # Delicate light margins
            draw.arc([sx-r, sy-r, sx+r, sy+r], 0, 360, fill=(210, 210, 200), width=2)

    elif "Leaf_Mold" in class_name:
        # Pale yellow chlorotic patches
        for _ in range(6):
            sx = int(np.random.randint(95, 160))
            sy = int(np.random.randint(70, 180))
            r = int(np.random.randint(10, 20))
            draw.ellipse([sx-r, sy-r, sx+r, sy+r], fill=(175, 185, 60))

    elif "Septoria" in class_name:
        # Tiny circular spots with dark brown margin and gray center with black specks
        for _ in range(20):
            sx = int(np.random.randint(90, 165))
            sy = int(np.random.randint(60, 195))
            r = int(np.random.randint(3, 6))
            draw.ellipse([sx-r, sy-r, sx+r, sy+r], fill=(50, 35, 20))
            draw.ellipse([sx-r+1, sy-r+1, sx+r-1, sy+r-1], fill=(180, 175, 160))
            draw.point((sx, sy), fill=(10, 10, 10))

    elif "Spider_mites" in class_name:
        # Fine yellow stippling across leaf
        for _ in range(120):
            sx = int(np.random.randint(80, 175))
            sy = int(np.random.randint(50, 200))
            draw.point((sx, sy), fill=(230, 230, 120))

    elif "Target_Spot" in class_name:
        # Circular brown target spots with distinct rings
        for _ in range(6):
            sx = int(np.random.randint(95, 160))
            sy = int(np.random.randint(70, 180))
            r = int(np.random.randint(8, 16))
            draw.ellipse([sx-r, sy-r, sx+r, sy+r], fill=(70, 45, 25))
            draw.ellipse([sx-r+3, sy-r+3, sx+r-3, sy+r-3], fill=(120, 90, 50))
            draw.ellipse([sx-r+6, sy-r+6, sx+r-6, sy+r-6], fill=(50, 30, 15))

    elif "Yellow_Leaf_Curl" in class_name:
        # Yellowing leaf margins and curling appearance
        for y in range(40, 220, 8):
            draw.line([(85, y), (105, y)], fill=(225, 220, 50), width=3)
            draw.line([(150, y), (170, y)], fill=(225, 220, 50), width=3)

    elif "mosaic" in class_name:
        # Mottled light and dark green mosaic
        for _ in range(30):
            sx = int(np.random.randint(85, 170))
            sy = int(np.random.randint(50, 205))
            r = int(np.random.randint(6, 14))
            draw.ellipse([sx-r, sy-r, sx+r, sy+r], fill=(120, 190, 70))

    # Apply subtle blur to blend patterns naturally
    img = img.filter(ImageFilter.SMOOTH_MORE)
    return img


def setup_sample_dataset(target_dir: str = "backend/data/plantvillage_tomato", samples_per_class: int = 15):
    """Sets up dataset folders and populates benchmark samples."""
    target_path = Path(target_dir)
    target_path.mkdir(parents=True, exist_ok=True)

    print(f"[*] Setting up benchmark sample dataset in: {target_path.resolve()}")
    
    total_created = 0
    for class_name in CLASS_NAMES:
        class_folder = target_path / class_name
        class_folder.mkdir(parents=True, exist_ok=True)
        
        # Check existing images
        existing = [f for f in class_folder.iterdir() if f.suffix.lower() in [".jpg", ".jpeg", ".png"]]
        if len(existing) < samples_per_class:
            needed = samples_per_class - len(existing)
            for i in range(needed):
                img = create_botanical_sample_leaf(class_name, len(existing) + i)
                filename = class_folder / f"sample_{len(existing) + i + 1:04d}.jpg"
                img.save(filename, format="JPEG", quality=92)
                total_created += 1

    print(f"[+] Successfully ensured {samples_per_class} sample images per class across all 10 classes.")
    print(f"[+] Total sample images created: {total_created}")
    print("[+] You can now run 'python scripts/train_model.py' to test the full pipeline.")


if __name__ == "__main__":
    setup_sample_dataset()
