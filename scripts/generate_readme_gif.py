"""Regenerate the small, looping pixel-voxel animation used in README.md."""

from pathlib import Path

from PIL import Image, ImageDraw


WIDTH, HEIGHT, SCALE = 96, 60, 4
PALETTE = {
    "ink": "#101a32",
    "night": "#182746",
    "panel": "#243b5c",
    "paper": "#f6edcf",
    "cream": "#fff7df",
    "mint": "#7ee0be",
    "teal": "#42a891",
    "coral": "#fa866d",
    "gold": "#f4c66b",
    "blue": "#79a9ed",
    "shade": "#526b89",
}


def draw_cube(draw: ImageDraw.ImageDraw, x: int, y: int, size: int, side: str) -> None:
    half = size // 2
    draw.polygon(
        [(x, y + half), (x + half, y), (x + size, y + half), (x + half, y + 2 * half)],
        fill=PALETTE["cream"],
    )
    draw.polygon(
        [(x, y + half), (x + half, y + 2 * half), (x + half, y + 2 * half + size), (x, y + half + size)],
        fill=PALETTE["teal"],
    )
    draw.polygon(
        [
            (x + size, y + half),
            (x + half, y + 2 * half),
            (x + half, y + 2 * half + size),
            (x + size, y + half + size),
        ],
        fill=PALETTE[side],
    )
    draw.line([(x + half, y + 2 * half), (x + half, y + 2 * half + size)], fill=PALETTE["ink"])


def make_frame(index: int) -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT), PALETTE["ink"])
    draw = ImageDraw.Draw(image)

    for x, y, color in [(7, 9, "mint"), (84, 8, "gold"), (10, 43, "blue"), (88, 40, "coral")]:
        draw.point((x, y), fill=PALETTE[color])
    draw.rectangle((3, 4, 92, 55), outline=PALETTE["panel"])
    for x in range(9, 90, 12):
        draw.line((x, 46, x, 53), fill=PALETTE["night"])
    draw.line((6, 47, 90, 47), fill=PALETTE["shade"])

    # Seven cubes make an H-shaped stack.
    blocks = [
        (27, 21, "coral"), (39, 32, "blue"), (51, 21, "mint"),
        (27, 32, "gold"), (51, 32, "coral"), (27, 43, "blue"), (51, 43, "gold"),
    ]
    for x, y, color in blocks:
        draw_cube(draw, x, y, 6, color)

    # The helper bot bobs beside the stack while the meter fills and resets.
    hop = [0, 1, 2, 1, 0, -1, -2, -1][index % 8]
    x, y = 64 + index % 3, 18 + hop
    draw.rectangle((x, y + 3, x + 7, y + 10), fill=PALETTE["mint"], outline=PALETTE["ink"])
    draw.rectangle((x + 1, y, x + 6, y + 4), fill=PALETTE["cream"], outline=PALETTE["ink"])
    draw.point((x + 2, y + 2), fill=PALETTE["ink"])
    draw.point((x + 5, y + 2), fill=PALETTE["ink"])
    draw.rectangle((x + 2, y + 10, x + 3, y + 12), fill=PALETTE["gold"])
    draw.rectangle((x + 5, y + 10, x + 6, y + 12), fill=PALETTE["gold"])

    spark_x = [22, 23, 24, 25, 55, 56, 57, 58][index % 8]
    spark_y = [22, 20, 22, 24, 22, 20, 22, 24][index % 8]
    draw.point((spark_x, spark_y), fill=PALETTE["gold"])
    draw.point((spark_x + 1, spark_y), fill=PALETTE["gold"])
    draw.rectangle((71, 38, 87, 43), fill=PALETTE["night"], outline=PALETTE["shade"])
    for meter in range(1 + index % 4):
        draw.rectangle((73 + meter * 3, 40, 74 + meter * 3, 41), fill=PALETTE["mint"])

    return image.resize((WIDTH * SCALE, HEIGHT * SCALE), Image.Resampling.NEAREST).convert(
        "P", palette=Image.Palette.ADAPTIVE, colors=64
    )


def main() -> None:
    frames = [make_frame(index) for index in range(8)]
    output = Path(__file__).resolve().parents[1] / "assets" / "hstack-loop.gif"
    output.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        output,
        save_all=True,
        append_images=frames[1:],
        duration=140,
        loop=0,
        optimize=True,
        disposal=2,
    )
    print(f"Wrote {output.relative_to(output.parents[1])} ({output.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
