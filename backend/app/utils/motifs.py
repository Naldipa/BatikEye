CANONICAL_MOTIF_KEYS = {
    "bokor kencono": "Bokor Kencono",
    "bokor-kencono": "Bokor Kencono",
    "jumputan": "Jumputan",
    "kawung": "Kawung",
    "mega mendung": "Mega Mendung",
    "mega-mendung": "Mega Mendung",
    "parang": "Parang",
    "sekar jagad": "Sekar Jagad",
    "sekar-jagad": "Sekar Jagad",
    "sidoluhur": "SidoLuhur",
    "sido luhur": "SidoLuhur",
    "sido-luhur": "SidoLuhur",
    "sidomukti": "Sidomukti",
    "sido mukti": "Sidomukti",
    "sido-mukti": "Sidomukti",
    "sidomulyo": "Sidomulyo",
    "sido mulyo": "Sidomulyo",
    "sido-mulyo": "Sidomulyo",
    "srikaton": "Srikaton",
    "tribusono": "Tribusono",
    "truntum": "Truntum",
    "wahyu tumurun": "Wahyu Tumurun",
    "wahyu-tumurun": "Wahyu Tumurun",
    "wirasat": "Wirasat",
}


def canonical_motif_key(value: str | None) -> str:
    raw_value = (value or "").strip()
    if not raw_value:
        return "Tidak diketahui"

    normalized = " ".join(raw_value.replace("_", " ").replace("-", " ").split())
    return CANONICAL_MOTIF_KEYS.get(normalized.lower(), normalized)
