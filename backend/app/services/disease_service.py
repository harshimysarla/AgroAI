"""
Curated Plant Disease Knowledge Base for TomatoCare AI.
Provides domain-expert botanical descriptions, symptoms, prevention, cultural management, and lookalike comparisons.
"""

from typing import Dict, List, Any, Optional

DISEASE_PROFILES: Dict[str, Dict[str, Any]] = {
    "Tomato___Bacterial_spot": {
        "id": "Tomato___Bacterial_spot",
        "name": "Tomato Bacterial Spot",
        "scientific_name": "Xanthomonas perforans / Xanthomonas campestris pv. vesicatoria",
        "category": "Bacterial",
        "severity": "High",
        "overview": (
            "Bacterial spot is a widespread and destructive disease of tomato and pepper crops. "
            "It affects all aboveground plant parts including leaves, stems, flowers, and fruit, "
            "often leading to severe defoliation, sunscald on exposed fruit, and reduced marketable yield."
        ),
        "symptoms": [
            "Small, dark brown to black circular lesions (1-3 mm) on leaves, often surrounded by a faint yellow halo.",
            "Lesions may coalesce to form large irregular blighted areas, causing leaf yellowing and premature leaf drop.",
            "Water-soaked lesions on the underside of leaves during humid or rainy weather.",
            "Small raised scab-like or blister-like lesions on green fruit with a rough or cracked appearance."
        ],
        "environmental_conditions": {
            "optimal_temp": "24°C to 30°C (75°F to 86°F)",
            "humidity": "High relative humidity (>85%) and frequent rainfall or overhead sprinkler irrigation",
            "spread_mechanism": "Splashing water, contaminated seeds, tools, workers, and infected plant debris"
        },
        "prevention": [
            "Use certified disease-free, hot-water treated seeds and clean transplants.",
            "Avoid overhead irrigation; use drip irrigation to keep foliage dry.",
            "Implement a 2- to 3-year crop rotation with non-solanaceous crops.",
            "Sanitize trellising stakes, pruning shears, and greenhouse surfaces between seasons."
        ],
        "management": [
            "Promptly remove and destroy infected lower leaves and severe plant residues.",
            "Apply copper-based protectant sprays or biological control agents (e.g., Bacillus subtilis) preventively if recommended by local agricultural extension.",
            "Avoid handling plants when leaves are wet to limit mechanical pathogen dispersal."
        ],
        "lookalike_diseases": [
            "Tomato Septoria Leaf Spot (Septoria has distinct light tan centers with tiny black pycnidia speckles).",
            "Tomato Target Spot (Target spot lesions are larger with pronounced concentric rings)."
        ],
        "danger_to_crop": "High risk of total defoliation in warm, wet climates, exposing fruit to sunscald and commercial rejection."
    },
    "Tomato___Early_blight": {
        "id": "Tomato___Early_blight",
        "name": "Tomato Early Blight",
        "scientific_name": "Alternaria solani / Alternaria linariae",
        "category": "Fungal",
        "severity": "Moderate",
        "overview": (
            "Early blight is one of the most common fungal diseases affecting tomatoes worldwide. "
            "Despite its name, it can occur at any stage of plant growth, typically progressing from "
            "older bottom leaves upwards into the canopy."
        ),
        "symptoms": [
            "Dark brown to black circular lesions with characteristic concentric rings creating a distinctive 'target-board' pattern.",
            "Surrounding leaf tissue often turns yellow (chlorotic halo) and eventually withers and drops.",
            "Collar rot lesions at the soil line on seedlings and dark sunken cankers on mature stems.",
            "Dark, leathery sunken lesions with concentric rings near the stem end of ripe or green fruit."
        ],
        "environmental_conditions": {
            "optimal_temp": "24°C to 29°C (75°F to 84°F)",
            "humidity": "Alternating wet and dry periods with high moisture and heavy morning dew",
            "spread_mechanism": "Wind-borne conidia, rain splash from infested soil, and overwintering debris"
        },
        "prevention": [
            "Mulch soil around plants to prevent soil-borne spores from splashing onto lower leaves.",
            "Prune bottom foliage (lowest 12-18 inches) once plants are established to improve air circulation.",
            "Maintain optimal plant nutrition; plants stressed by low nitrogen are notably more susceptible.",
            "Practice 3-year crop rotation avoiding potatoes, eggplants, and peppers."
        ],
        "management": [
            "Remove affected lower leaves at the first sign of symptoms.",
            "Ensure proper plant staking and spacing to facilitate rapid drying of foliage.",
            "Consult local agricultural extension for registered preventative biofungicides or protective fungicides."
        ],
        "lookalike_diseases": [
            "Tomato Target Spot (Corynespora cassiicola produces similar concentric lesions but affects younger leaves higher in the canopy as well).",
            "Tomato Late Blight (Late blight lesions are rapid, water-soaked, and pale green-brown without concentric target rings)."
        ],
        "danger_to_crop": "Moderate to high. Uncontrolled early blight causes progressive defoliation, reducing photosynthesis and fruit size."
    },
    "Tomato___Late_blight": {
        "id": "Tomato___Late_blight",
        "name": "Tomato Late Blight",
        "scientific_name": "Phytophthora infestans",
        "category": "Oomycete / Fungal-like",
        "severity": "Severe",
        "overview": (
            "Late blight is an aggressive, fast-moving oomycete pathogen capable of completely devastating "
            "an entire tomato crop within days under cool, wet conditions. It is famous historically as the "
            "cause of the Irish Potato Famine."
        ),
        "symptoms": [
            "Large, irregular water-soaked pale-green to dark brown lesions that expand rapidly across leaves.",
            "In humid conditions, a delicate white downy/cottony fungal growth appears on the underside of infected leaves.",
            "Stems develop dark brown to purplish-black greasy lesions that quickly collapse and break.",
            "Fruit develops large, firm, greasy-looking golden-brown or bronze blotches with a bumpy texture."
        ],
        "environmental_conditions": {
            "optimal_temp": "15°C to 22°C (59°F to 72°F) cool temperatures",
            "humidity": "Relative humidity >90% with extended periods of leaf wetness (>10 hours)",
            "spread_mechanism": "Wind-blown sporangia carried over long distances (several miles), infected potato tubers, and live host plants"
        },
        "prevention": [
            "Plant resistant tomato cultivars with Ph-2 and Ph-3 resistance genes where available.",
            "Avoid planting tomatoes near potatoes or volunteer potato plants.",
            "Promote maximum air circulation and sunlight penetration through wider row spacing.",
            "Monitor local late blight forecasting alerts and weather conditions."
        ],
        "management": [
            "Act immediately upon detection; infected plants should be promptly bagged and removed from the field (do not compost).",
            "Apply approved protective or systemic fungicides at first regional alert before symptoms appear.",
            "Eliminate all cull piles and volunteer solanaceous weeds in nearby areas."
        ],
        "lookalike_diseases": [
            "Tomato Early Blight (Early blight has concentric rings and rarely exhibits white downy sporulation on undersides).",
            "Tomato Leaf Mold (Leaf mold produces velvety olive-green patches on leaf undersides rather than water-soaked brown rot)."
        ],
        "danger_to_crop": "Extremely high. Can cause 100% crop loss within 1-2 weeks under favorable cool and wet conditions."
    },
    "Tomato___Leaf_Mold": {
        "id": "Tomato___Leaf_Mold",
        "name": "Tomato Leaf Mold",
        "scientific_name": "Passalora fulva (formerly Cladosporium fulvum)",
        "category": "Fungal",
        "severity": "Moderate",
        "overview": (
            "Leaf mold primarily affects tomato crops grown in protected environments such as greenhouses, "
            "high tunnels, and unventilated polytunnels where humidity remains consistently high."
        ),
        "symptoms": [
            "Pale yellow to light green diffuse chlorotic patches on the upper surface of older leaves.",
            "Dense, velvety olive-green to grayish-brown spore growth directly beneath the yellow patches on the leaf underside.",
            "Infected leaves eventually turn brown, curl up, wither, and die, yet remain attached to the stem.",
            "Blossoms and fruit may rarely be infected, resulting in blossom drop or black leathery stem-end rot."
        ],
        "environmental_conditions": {
            "optimal_temp": "21°C to 24°C (70°F to 75°F)",
            "humidity": "High relative humidity (>85%), especially in humid greenhouse structures with poor ventilation",
            "spread_mechanism": "Airborne conidia, splashing water, insects, tools, and overwintering sclerotia"
        },
        "prevention": [
            "Ensure excellent greenhouse ventilation using exhaust fans, ridge vents, and horizontal airflow.",
            "Increase plant spacing and prune lower suckers to maximize canopy airflow.",
            "Use drip irrigation and heat greenhouses at dusk to prevent condensation on leaf surfaces.",
            "Select leaf mold-resistant tomato varieties (Cf resistance genes)."
        ],
        "management": [
            "Lower relative humidity below 80% through aggressive ventilation and air circulation.",
            "Prune infected foliage carefully to reduce inoculum loads without scattering spores.",
            "Apply protective bio-fungicides (e.g., copper or sulfur compounds) as permitted in high-tunnel production."
        ],
        "lookalike_diseases": [
            "Tomato Yellow Leaf Curl Virus (TYLCV leaves curl upwards with yellowing margins but without velvety underside sporulation).",
            "Tomato Spider Mites (Spider mites cause fine yellow stippling and webbing rather than distinct olive-velvet spore mats)."
        ],
        "danger_to_crop": "Moderate in field crops; high in enclosed greenhouses where rapid defoliation reduces fruit yield."
    },
    "Tomato___Septoria_leaf_spot": {
        "id": "Tomato___Septoria_leaf_spot",
        "name": "Tomato Septoria Leaf Spot",
        "scientific_name": "Septoria lycopersici",
        "category": "Fungal",
        "severity": "Moderate",
        "overview": (
            "Septoria leaf spot is one of the most destructive foliage diseases of field tomatoes. "
            "While it rarely infects fruit directly, severe leaf loss exposes fruit to severe sunscald and weakens vine vigor."
        ),
        "symptoms": [
            "Numerous small, circular lesions (2-3 mm) with dark brown margins and distinctive light gray or tan centers.",
            "Tiny, black pimple-like fruiting bodies (pycnidia) clearly visible inside the center of mature lesions (use hand lens).",
            "Heavily infected leaves turn completely yellow, wither, and drop, starting from bottom leaves and moving upwards.",
            "Unlike Early Blight, lesions rarely display concentric rings and remain smaller in diameter."
        ],
        "environmental_conditions": {
            "optimal_temp": "20°C to 25°C (68°F to 77°F)",
            "humidity": "Prolonged wet weather, heavy dew, and frequent overhead rainfall",
            "spread_mechanism": "Rain splash from soil, windblown water droplets, infested weed hosts (e.g., horsenettle), and workers"
        },
        "prevention": [
            "Apply a clean organic or plastic mulch beneath plants to create a barrier against soil splash.",
            "Eliminate nightshade family weeds around field perimeters that harbor Septoria pycnidia.",
            "Avoid working in tomato fields when foliage is wet from dew or rain.",
            "Rotate crops with non-solanaceous species for at least 2 years."
        ],
        "management": [
            "Remove infected lower leaves at the initial stage of outbreak.",
            "Stake and cage plants to elevate canopy foliage above ground moisture.",
            "Apply preventative copper or broad-spectrum fungicides recommended by local extension specialists."
        ],
        "lookalike_diseases": [
            "Tomato Bacterial Spot (Bacterial spot lacks the black pycnidia speckles in lesion centers).",
            "Tomato Early Blight (Early blight spots are significantly larger with concentric target rings)."
        ],
        "danger_to_crop": "High risk of premature defoliation, causing sunburned fruit and dramatic reduction in total harvest."
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "id": "Tomato___Spider_mites Two-spotted_spider_mite",
        "name": "Tomato Spider Mites",
        "scientific_name": "Tetranychus urticae (Two-spotted spider mite)",
        "category": "Pest",
        "severity": "Moderate",
        "overview": (
            "Two-spotted spider mites are microscopic arachnids that feed by piercing plant cells and sucking out "
            "chlorophyll contents. Outbreaks explode rapidly during hot, dry, and dusty weather."
        ),
        "symptoms": [
            "Fine yellow or white stippling (tiny speckles) on the upper surface of leaves.",
            "Leaves turn bronze, yellowish-brown, become brittle, and dry up with severe infestation.",
            "Fine, delicate silken webbing visible on leaf undersides, petiole junctions, and growing tips.",
            "Microscopic yellow-green to amber mites with two dark lateral spots visible on leaf undersides."
        ],
        "environmental_conditions": {
            "optimal_temp": "27°C to 35°C (80°F to 95°F) hot and dry",
            "humidity": "Low relative humidity and dusty drought conditions",
            "spread_mechanism": "Wind currents, dispersal along silk webbing lines (ballooning), infested planting stock, and clothing"
        },
        "prevention": [
            "Keep farm roads and paths watered or vegetated to minimize dust accumulation on leaves.",
            "Maintain adequate irrigation; water-stressed tomato vines are significantly more vulnerable.",
            "Encourage natural predators such as predatory mites (Phytoseiulus persimilis), lady beetles, and lacewings.",
            "Avoid broad-spectrum synthetic pyrethroids that eliminate beneficial predatory insects."
        ],
        "management": [
            "Spray leaf undersides with strong jets of water to dislodge mites and disrupt web colonies.",
            "Apply horticultural oils, insecticidal soaps, or neem-based formulations early in the morning or late evening.",
            "Release commercially reared biological predatory mites in greenhouse environments."
        ],
        "lookalike_diseases": [
            "Nutrient Chlorosis (Nutrient deficiencies lack silken webbing and distinct punctate stippling).",
            "Tomato Leaf Mold (Leaf mold has velvety olive underside patches, not fine yellow speckling with webbing)."
        ],
        "danger_to_crop": "Moderate to high in greenhouses and dry climates; uncontrolled populations cause severe leaf drop and stunted fruit."
    },
    "Tomato___Target_Spot": {
        "id": "Tomato___Target_Spot",
        "name": "Tomato Target Spot",
        "scientific_name": "Corynespora cassiicola",
        "category": "Fungal",
        "severity": "Moderate",
        "overview": (
            "Target spot is a fungal disease affecting tomatoes in warm, humid production regions. "
            "It affects leaves, stems, and fruit, often causing significant premature defoliation in dense canopies."
        ),
        "symptoms": [
            "Small, pinpoint brown spots on upper leaves that expand into circular lesions with light brown centers and dark brown margins.",
            "Zonate concentric rings develop within mature spots, resembling a target pattern.",
            "Lesions on fruit begin as small brown specks and develop into deep, cratered, dark brown sunken lesions.",
            "Unlike Early Blight, Target Spot frequently attacks both upper and lower canopy foliage simultaneously."
        ],
        "environmental_conditions": {
            "optimal_temp": "25°C to 32°C (77°F to 90°F)",
            "humidity": "High humidity (>80%) and prolonged leaf wetness periods",
            "spread_mechanism": "Airborne spores, rain splash, weed hosts (e.g., wild legumes and lantana), and infected crop residue"
        },
        "prevention": [
            "Maintain optimal row spacing and prune inner foliage to enhance air movement and light penetration.",
            "Avoid overhead irrigation, especially in late afternoon or evening.",
            "Eliminate broadleaf weed species around tomato production fields.",
            "Follow a rigorous 3-year solanaceous crop rotation program."
        ],
        "management": [
            "Prune infected plant tissue and dispose of debris away from cultivation zones.",
            "Apply targeted fungicides with proven efficacy against Corynespora as advised by local university extension.",
            "Ensure balanced fertilization to prevent excessive lush vegetative growth."
        ],
        "lookalike_diseases": [
            "Tomato Early Blight (Early blight lesions are typically larger and primarily initiate on older bottom leaves).",
            "Tomato Bacterial Spot (Bacterial spot lesions are smaller, water-soaked, and lack pronounced concentric target rings)."
        ],
        "danger_to_crop": "Moderate to severe in humid tropical/subtropical regions, leading to fruit culling and foliage loss."
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "id": "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
        "name": "Tomato Yellow Leaf Curl Virus",
        "scientific_name": "Tomato yellow leaf curl virus (TYLCV, Begomovirus)",
        "category": "Viral",
        "severity": "Severe",
        "overview": (
            "TYLCV is a devastating begomovirus transmitted exclusively by the sweetpotato whitefly (Bemisia tabaci). "
            "Infection of young tomato plants often leads to total crop failure and complete cessation of fruit production."
        ),
        "symptoms": [
            "Severe upward curling and cupping of leaf margins (leaves appear spoon-shaped).",
            "Prominent yellowing (interveinal chlorosis) on leaf margins and young terminal growth.",
            "Extreme plant stunting with shortened internodes, giving plants a compact, bushy or 'bonsai' appearance.",
            "Flower blossoms drop prematurely before fruit set; fruit already set remains small, pale, and unmarketable."
        ],
        "environmental_conditions": {
            "optimal_temp": "28°C to 35°C (82°F to 95°F) warm conditions favoring whitefly vectors",
            "humidity": "Dry to moderately humid climates where whitefly populations multiply rapidly",
            "spread_mechanism": "Transmission by adult whiteflies (Bemisia tabaci); not seed-borne and not mechanically transmitted by pruning tools"
        },
        "prevention": [
            "Plant TYLCV-resistant or tolerant hybrid tomato varieties (possessing Ty-1, Ty-2, or Ty-3 resistance genes).",
            "Install 50-mesh insect-exclusion netting in greenhouses and nursery structures.",
            "Use UV-reflective silver plastic mulches to repel incoming whitefly populations.",
            "Eradicate infected volunteer crops and weed hosts (e.g., Datura, Solanum weeds) before planting."
        ],
        "management": [
            "There is no cure once a plant is infected with TYLCV. Rogue out and bag infected plants immediately to prevent vector acquisition.",
            "Manage whitefly populations using yellow sticky traps, insecticidal soaps, or selective biorational insecticides.",
            "Establish a 2- to 3-month regional host-free period between consecutive tomato growing seasons."
        ],
        "lookalike_diseases": [
            "Tomato Mosaic Virus (Mosaic virus exhibits mottled green/yellow mosaic patterns and distorted straps rather than upward cupped yellow spoons).",
            "Herbicide Damage (Growth regulator herbicides can mimic stunting and curling; check whitefly vector presence)."
        ],
        "danger_to_crop": "Catastrophic. Infections occurring before flowering typically result in 90% to 100% loss of marketable yield."
    },
    "Tomato___Tomato_mosaic_virus": {
        "id": "Tomato___Tomato_mosaic_virus",
        "name": "Tomato Mosaic Virus",
        "scientific_name": "Tomato mosaic virus (ToMV, Tobamovirus)",
        "category": "Viral",
        "severity": "High",
        "overview": (
            "Tomato Mosaic Virus (ToMV) is an extremely stable and contagious tobamovirus. "
            "It can persist in dry seeds, crop residues, soil, and even tobacco products for years, "
            "spreading effortlessly through ordinary mechanical contact."
        ),
        "symptoms": [
            "Mottled light and dark green mosaic patterns on leaf surfaces.",
            "Leaf distortion including 'shoestring' or 'fern-like' narrowing and malformation of leaflets.",
            "General stunting of plant growth and reduced vigor.",
            "Fruit may show uneven ripening, internal brown rings (brown wall), or bronze necrotic patches."
        ],
        "environmental_conditions": {
            "optimal_temp": "20°C to 28°C (68°F to 82°F)",
            "humidity": "Independent of humidity; easily transmitted in any environment through contact",
            "spread_mechanism": "Mechanical transmission via workers' hands, tools, pruning shears, contaminated seed coats, and smoking tobacco residue"
        },
        "prevention": [
            "Select ToMV-resistant tomato varieties (e.g., Tm-2 or Tm-2^2 resistance gene cultivars).",
            "Disinfect pruning tools and trellising supplies in 10-20% non-fat dry milk solution or 10% trisodium phosphate (TSP).",
            "Enforce strict hand-washing protocols before entering greenhouses; prohibit smoking or tobacco handling near plants.",
            "Use certified disease-free seed treated with trisodium phosphate or heat treatment."
        ],
        "management": [
            "Immediately isolate and destroy infected plants upon confirmed diagnosis (do not compost).",
            "Avoid handling healthy crops after touching suspected infected plants.",
            "Steam-sterilize or solarize greenhouse soils between cropping cycles."
        ],
        "lookalike_diseases": [
            "Tomato Yellow Leaf Curl Virus (TYLCV causes upward leaf cupping with yellow margins without green mosaic mottling).",
            "2,4-D Herbicide Drift (Herbicide drift causes strap-like leaves but lacks the distinct dark and light green mosaic pattern)."
        ],
        "danger_to_crop": "High. Causes significant fruit blemishes, uneven ripening, and permanent reduction in plant yield."
    },
    "Tomato___healthy": {
        "id": "Tomato___healthy",
        "name": "Tomato Healthy",
        "scientific_name": "Solanum lycopersicum (Healthy Foliage)",
        "category": "Healthy",
        "severity": "None",
        "overview": (
            "The foliage exhibits normal morphological characteristics with vibrant green pigmentation, "
            "uniform turgor pressure, and no visible signs of pathogen infection, insect pest damage, or physiological stress."
        ),
        "symptoms": [
            "Uniform deep green leaf coloration across upper and lower surfaces.",
            "No necrotic lesions, yellowing halos, water-soaking, or concentric rings.",
            "Underside of leaves is clear of fungal sporulation, downy growth, or silken mite webbing.",
            "Stems and petioles are firm, upright, and free from dark cankers or vascular browning."
        ],
        "environmental_conditions": {
            "optimal_temp": "21°C to 27°C (70°F to 80°F) daytime, 16°C to 18°C night",
            "humidity": "Moderate relative humidity (50% to 70%) with good air circulation",
            "spread_mechanism": "N/A"
        },
        "prevention": [
            "Maintain balanced N-P-K soil fertilization and adequate calcium levels to prevent blossom end rot.",
            "Practice consistent drip irrigation to maintain uniform soil moisture.",
            "Perform weekly scouting to catch any emerging pest or pathogen early.",
            "Maintain 2-3 feet between plants for optimal sunlight exposure and air drying."
        ],
        "management": [
            "Continue standard agronomic best management practices.",
            "Scout foliage weekly during humid weather or post-rainfall.",
            "Keep records of planting dates, cultivar types, and crop inputs."
        ],
        "lookalike_diseases": [
            "Minor physiological edemas or temporary drought wilting may temporarily alter leaf posture without pathogen presence."
        ],
        "danger_to_crop": "Zero. Plant is in prime physiological health."
    }
}


def get_all_disease_profiles() -> List[Dict[str, Any]]:
    """Returns list of all curated disease profiles."""
    return list(DISEASE_PROFILES.values())


def get_disease_profile_by_id(disease_id: str) -> Optional[Dict[str, Any]]:
    """Returns specific disease profile or None."""
    return DISEASE_PROFILES.get(disease_id)
