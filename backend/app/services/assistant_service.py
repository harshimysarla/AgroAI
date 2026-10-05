"""
Intelligent Plant Health Assistant & Methodology Knowledge Engine.
Provides domain-grounded responses on tomato pathology, crop management, and deep learning explainability.
"""

from typing import Dict, List, Any
from backend.app.services.disease_service import DISEASE_PROFILES


def answer_assistant_query(query: str) -> Dict[str, Any]:
    """
    Analyzes user queries related to tomato pathology, model methodology, or crop care
    and returns a structured, factual response based on curated agronomic knowledge.
    """
    q = query.lower().strip()
    
    # 1. Methodology / EfficientNetB0 queries
    if any(k in q for k in ["efficientnet", "architecture", "cnn", "backbone", "model work", "how does the model"]):
        return {
            "query": query,
            "category": "Methodology",
            "title": "EfficientNetB0 Architecture & Deep Learning Workflow",
            "content": (
                "TomatoCare AI employs the **EfficientNetB0** convolutional neural network architecture. "
                "EfficientNet uses a principled compound scaling method that balances network depth, width, and image resolution "
                "using a compound coefficient. The backbone utilizes Mobile Inverted Bottleneck convolutions (MBConv) with Squeeze-and-Excitation "
                "optimization blocks. The preprocessed 224×224×3 RGB leaf image passes through the feature extraction backbone, followed by "
                "Global Average Pooling, Batch Normalization, Dropout regularization (0.3), and a 10-node Dense Softmax classifier."
            ),
            "suggested_questions": [
                "How does Grad-CAM explainability work?",
                "What are the limitations of the deep learning model?",
                "How was the model trained and evaluated?"
            ],
            "disclaimer": "The model is an assistive diagnostic tool; field decisions should be corroborated with agricultural extension guidance."
        }

    # 2. Grad-CAM / Explainability queries
    if any(k in q for k in ["gradcam", "grad-cam", "heatmap", "explainability", "xai", "interpret"]):
        return {
            "query": query,
            "category": "Explainability",
            "title": "Grad-CAM (Gradient-Weighted Class Activation Mapping)",
            "content": (
                "**Grad-CAM** provides visual transparency into deep learning predictions by highlighting the specific spatial regions "
                "in the leaf image that influenced the EfficientNetB0 classification decision. It calculates the gradients of the target class "
                "score with respect to the feature activation maps of the final convolutional layer (`top_conv`). The pooled gradients act as "
                "importance weights to produce a 2D localization heatmap, overlaid with transparency over the original leaf."
            ),
            "suggested_questions": [
                "What does red or yellow color signify in the Grad-CAM heatmap?",
                "Why is Grad-CAM important for agricultural AI?",
                "What happens if the model focuses on background soil or fingers?"
            ],
            "disclaimer": "Grad-CAM visualizes model attention but does not verify pathogen biology. If attention is on background artifacts, review image quality."
        }

    # 3. Disease comparisons / Differences
    if any(k in q for k in ["difference", "compare", "vs", "versus", "distinguish", "lookalike"]):
        if "early" in q and "late" in q:
            return {
                "query": query,
                "category": "Disease Comparison",
                "title": "Early Blight vs Late Blight Comparison",
                "content": (
                    "• **Early Blight (Alternaria solani)**: Characterized by dark brown circular lesions with distinct **concentric rings** "
                    "(target-board pattern) and yellow chlorotic halos. Progresses slowly from older bottom foliage upwards.\n\n"
                    "• **Late Blight (Phytophthora infestans)**: Characterized by large, irregular **water-soaked pale-green to dark brown patches** "
                    "that expand rapidly across leaves and stems within 24-48 hours. Under humid conditions, a **white downy fungal growth** "
                    "appears on the underside of leaves. It thrives in cool, wet weather and can destroy plants in days."
                ),
                "suggested_questions": [
                    "How do I prevent Late Blight spread?",
                    "What fungicides are effective for Early Blight?",
                    "How to distinguish Septoria Leaf Spot from Early Blight?"
                ],
                "disclaimer": "When in doubt between blight types, isolate suspect leaves immediately as Late Blight requires urgent action."
            }
        elif "septoria" in q and ("early" in q or "bacterial" in q):
            return {
                "query": query,
                "category": "Disease Comparison",
                "title": "Septoria Leaf Spot vs Early Blight vs Bacterial Spot",
                "content": (
                    "• **Septoria Leaf Spot**: Small circular lesions (2-3 mm) with dark brown borders and **light gray/tan centers** containing **tiny black speckles (pycnidia)**.\n\n"
                    "• **Early Blight**: Much larger lesions (5-15 mm) featuring **concentric target rings** and pronounced yellowing.\n\n"
                    "• **Bacterial Spot**: Small, dark brown-to-black angular spots that appear water-soaked underneath and lack pycnidia speckles."
                ),
                "suggested_questions": [
                    "How to manage Septoria Leaf Spot?",
                    "What environmental conditions cause Bacterial Spot?",
                    "Can mulch prevent fungal leaf spots?"
                ],
                "disclaimer": "Use a 10x hand lens in the field to inspect lesion centers for black pycnidia to confirm Septoria."
            }
        elif "yellow leaf curl" in q or "tylcv" in q or "mosaic" in q:
            return {
                "query": query,
                "category": "Disease Comparison",
                "title": "Yellow Leaf Curl Virus (TYLCV) vs Tomato Mosaic Virus (ToMV)",
                "content": (
                    "• **Tomato Yellow Leaf Curl Virus (TYLCV)**: Causes leaves to **cup or curl upwards like spoons**, with bright yellow margins, severe stunting, and bushy upright growth. Vector: Whiteflies.\n\n"
                    "• **Tomato Mosaic Virus (ToMV)**: Causes **mottled light and dark green mosaic patterns**, strap-like distorted leaves, and uneven fruit ripening. Vector: Mechanical transmission and tobacco contact."
                ),
                "suggested_questions": [
                    "How to control whiteflies for TYLCV prevention?",
                    "Can Tomato Mosaic Virus survive on tools and hands?",
                    "Are there virus-resistant tomato varieties?"
                ],
                "disclaimer": "Neither virus can be cured once infected; rogue and destroy infected plants promptly."
            }

    # 4. Check for individual disease keywords
    for disease_id, profile in DISEASE_PROFILES.items():
        disease_name = profile["name"].lower()
        key_terms = disease_name.replace("tomato", "").strip().split()
        if any(term in q for term in key_terms if len(term) > 3):
            return {
                "query": query,
                "category": profile["category"],
                "title": f"Agronomic Overview: {profile['name']}",
                "content": (
                    f"**Pathogen / Cause**: {profile['scientific_name']}\n\n"
                    f"**Overview**: {profile['overview']}\n\n"
                    f"**Key Symptoms**:\n" + "\n".join([f"• {s}" for s in profile["symptoms"][:3]]) + "\n\n"
                    f"**Prevention & Care**:\n" + "\n".join([f"• {p}" for p in profile["prevention"][:3]])
                ),
                "suggested_questions": [
                    f"What weather triggers {profile['name']}?",
                    f"How to manage {profile['name']} organically?",
                    "What diseases look similar to this?"
                ],
                "disclaimer": "Always confirm field diagnosis with local agricultural extension services before applying chemical treatments."
            }

    # 5. General crop care / watering / spacing
    if any(k in q for k in ["water", "irrigation", "spacing", "prun", "soil", "care", "general"]):
        return {
            "query": query,
            "category": "Crop Care",
            "title": "Best Management Practices for Tomato Foliage Health",
            "content": (
                "1. **Drip Irrigation**: Always water at the base of the plant rather than using overhead sprinklers to prevent prolonged leaf wetness.\n"
                "2. **Plant Spacing**: Maintain 24 to 36 inches between plants in rows to maximize sun exposure and airflow.\n"
                "3. **Bottom Pruning**: Remove the lowest 12-18 inches of foliage once vines are established to stop soil-borne fungal spores from splashing.\n"
                "4. **Mulching**: Apply a 2-3 inch layer of clean straw, bark, or plastic mulch to create a clean physical barrier.\n"
                "5. **Sanitation**: Disinfect pruning shears between plants using 70% isopropyl alcohol or 10% trisodium phosphate."
            ),
            "suggested_questions": [
                "Why does wet foliage cause tomato fungal diseases?",
                "How does crop rotation help tomato health?",
                "What is the ideal soil pH for tomatoes?"
            ],
            "disclaimer": "Agricultural best practices reduce disease pressure but do not eliminate airborne pathogen spores."
        }

    # Default general response
    return {
        "query": query,
        "category": "General Advisory",
        "title": "TomatoCare AI Plant Health Assistant",
        "content": (
            "I can assist you with:\n"
            "• Identifying symptoms and management strategies for the **10 supported tomato leaf conditions** (Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria, Spider Mites, Target Spot, TYLCV, Mosaic Virus, Healthy).\n"
            "• Comparing lookalike diseases and identifying key differentiating markers.\n"
            "• Explaining the **EfficientNetB0 architecture**, inference pipeline, and **Grad-CAM explainability heatmaps**.\n"
            "• Providing preventive crop care guidelines including drip irrigation, spacing, and pruning."
        ),
        "suggested_questions": [
            "How do I distinguish Early Blight from Septoria Leaf Spot?",
            "How does EfficientNetB0 classify tomato leaf images?",
            "What should I do if my tomato plant has Late Blight?"
        ],
        "disclaimer": "TomatoCare AI provides educational agronomic insights and AI diagnostic support."
    }
