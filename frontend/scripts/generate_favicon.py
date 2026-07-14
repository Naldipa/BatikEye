from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "logo-icon.png"
OUTPUT = ROOT / "public" / "favicon.png"

canvas_size = 512
image = Image.open(SOURCE).convert("RGBA")
bounds = image.getbbox()

if bounds:
    image = image.crop(bounds)

# A favicon needs a compact silhouette because browsers commonly render it at
# only 16x16 pixels. The slight vertical emphasis keeps the eye legible.
target_width = 476
target_height = 374
image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)

rgb = Image.new("RGB", image.size, "black")
rgb.paste(image.convert("RGB"), mask=image.getchannel("A"))
rgb = ImageEnhance.Contrast(rgb).enhance(1.12)
rgb = ImageEnhance.Sharpness(rgb).enhance(1.35)
rgb = rgb.filter(ImageFilter.UnsharpMask(radius=1.2, percent=115, threshold=2))
image = rgb.convert("RGBA")
image.putalpha(Image.open(SOURCE).convert("RGBA").crop(bounds).resize(
    (target_width, target_height),
    Image.Resampling.LANCZOS,
).getchannel("A"))

canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
canvas.alpha_composite(
    image,
    ((canvas_size - target_width) // 2, (canvas_size - target_height) // 2),
)
canvas.save(OUTPUT, optimize=True)

print(OUTPUT)
