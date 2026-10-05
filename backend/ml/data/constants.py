"""
TomatoCare AI - Tomato Leaf Disease Classification Constants
Official 10 Classes conforming to the PlantVillage Tomato benchmark dataset.
"""

from typing import Dict, List

CLASS_NAMES: List[str] = [
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

# Normalization map for alternate folder name formats (e.g. spaces vs underscores)
FOLDER_ALIAS_MAP: Dict[str, str] = {
    "Tomato___Bacterial_spot": "Tomato___Bacterial_spot",
    "Tomato_Bacterial_spot": "Tomato___Bacterial_spot",
    "Bacterial_spot": "Tomato___Bacterial_spot",
    "Tomato___Early_blight": "Tomato___Early_blight",
    "Tomato_Early_blight": "Tomato___Early_blight",
    "Early_blight": "Tomato___Early_blight",
    "Tomato___Late_blight": "Tomato___Late_blight",
    "Tomato_Late_blight": "Tomato___Late_blight",
    "Late_blight": "Tomato___Late_blight",
    "Tomato___Leaf_Mold": "Tomato___Leaf_Mold",
    "Tomato_Leaf_Mold": "Tomato___Leaf_Mold",
    "Leaf_Mold": "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot": "Tomato___Septoria_leaf_spot",
    "Tomato_Septoria_leaf_spot": "Tomato___Septoria_leaf_spot",
    "Septoria_leaf_spot": "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite": "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Spider_mites_Two-spotted_spider_mite": "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato_Spider_mites_Two-spotted_spider_mite": "Tomato___Spider_mites Two-spotted_spider_mite",
    "Spider_mites_Two-spotted_spider_mite": "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot": "Tomato___Target_Spot",
    "Tomato_Target_Spot": "Tomato___Target_Spot",
    "Target_Spot": "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato_Tomato_Yellow_Leaf_Curl_Virus": "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato_Yellow_Leaf_Curl_Virus": "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus": "Tomato___Tomato_mosaic_virus",
    "Tomato_Tomato_mosaic_virus": "Tomato___Tomato_mosaic_virus",
    "Tomato_mosaic_virus": "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy": "Tomato___healthy",
    "Tomato_healthy": "Tomato___healthy",
    "healthy": "Tomato___healthy",
}

CLASS_DISPLAY_NAMES: Dict[str, str] = {
    "Tomato___Bacterial_spot": "Tomato Bacterial Spot",
    "Tomato___Early_blight": "Tomato Early Blight",
    "Tomato___Late_blight": "Tomato Late Blight",
    "Tomato___Leaf_Mold": "Tomato Leaf Mold",
    "Tomato___Septoria_leaf_spot": "Tomato Septoria Leaf Spot",
    "Tomato___Spider_mites Two-spotted_spider_mite": "Tomato Spider Mites",
    "Tomato___Target_Spot": "Tomato Target Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Tomato Yellow Leaf Curl Virus",
    "Tomato___Tomato_mosaic_virus": "Tomato Mosaic Virus",
    "Tomato___healthy": "Tomato Healthy"
}

CLASS_SEVERITY: Dict[str, str] = {
    "Tomato___Bacterial_spot": "High",
    "Tomato___Early_blight": "Moderate",
    "Tomato___Late_blight": "Severe",
    "Tomato___Leaf_Mold": "Moderate",
    "Tomato___Septoria_leaf_spot": "Moderate",
    "Tomato___Spider_mites Two-spotted_spider_mite": "Moderate",
    "Tomato___Target_Spot": "Moderate",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Severe",
    "Tomato___Tomato_mosaic_virus": "High",
    "Tomato___healthy": "None"
}

CLASS_CATEGORIES: Dict[str, str] = {
    "Tomato___Bacterial_spot": "Bacterial",
    "Tomato___Early_blight": "Fungal",
    "Tomato___Late_blight": "Oomycete / Fungal-like",
    "Tomato___Leaf_Mold": "Fungal",
    "Tomato___Septoria_leaf_spot": "Fungal",
    "Tomato___Spider_mites Two-spotted_spider_mite": "Pest",
    "Tomato___Target_Spot": "Fungal",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Viral",
    "Tomato___Tomato_mosaic_virus": "Viral",
    "Tomato___healthy": "Healthy"
}

IMAGE_SIZE = (224, 224)
INPUT_SHAPE = (224, 224, 3)
NUM_CLASSES = 10
