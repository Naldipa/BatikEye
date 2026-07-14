from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "public"
SOURCE = PUBLIC_DIR / "favicon.png"

BACKGROUND_COLOR = (93, 64, 55, 255)


def save_contain_icon(filename: str, size: int, padding_ratio: float = 0.08) -> None:
    source = Image.open(SOURCE).convert("RGBA")
    bounds = source.getbbox()
    if bounds:
        source = source.crop(bounds)

    padding = round(size * padding_ratio)
    max_width = size - (padding * 2)
    max_height = size - (padding * 2)
    scale = min(max_width / source.width, max_height / source.height)
    target_size = (
        max(1, round(source.width * scale)),
        max(1, round(source.height * scale)),
    )
    source = source.resize(target_size, Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(
        source,
        ((size - source.width) // 2, (size - source.height) // 2),
    )
    canvas.save(PUBLIC_DIR / filename, optimize=True)


def save_maskable_icon(filename: str, size: int) -> None:
    source = Image.open(SOURCE).convert("RGBA")
    bounds = source.getbbox()
    if bounds:
        source = source.crop(bounds)

    # Maskable icons need a safe zone around the logo because launchers can
    # crop the icon into circles, squircles, or other platform shapes.
    safe_size = round(size * 0.7)
    scale = min(safe_size / source.width, safe_size / source.height)
    target_size = (
        max(1, round(source.width * scale)),
        max(1, round(source.height * scale)),
    )
    source = source.resize(target_size, Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), BACKGROUND_COLOR)
    canvas.alpha_composite(
        source,
        ((size - source.width) // 2, (size - source.height) // 2),
    )
    canvas.save(PUBLIC_DIR / filename, optimize=True)


save_contain_icon("pwa-192x192.png", 192)
save_contain_icon("pwa-512x512.png", 512)
save_contain_icon("apple-touch-icon.png", 180, padding_ratio=0.06)
save_maskable_icon("pwa-maskable-512x512.png", 512)

print("PWA icons generated in", PUBLIC_DIR)
