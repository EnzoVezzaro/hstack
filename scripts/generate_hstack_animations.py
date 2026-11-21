"""Render the HSTACK voxel animations used in README.md.

Same look as the banner (assets/h-stack-loop.gif): camo voxel blocks in green
and cream, dark panels with pixel icons, and gold nodes joined by a glowing
line. Run from the repo root:

    python3 scripts/generate_hstack_animations.py

Requires Pillow. Writes looping GIFs into assets/animations/.
"""

from __future__ import annotations

import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

CANVAS = (3000, 1600)
ORIGIN = (1500, 700)
CW, CH, ZH = 64, 32, 38  # sub-cube tile width, tile height, vertical unit (px)

BG = (14, 20, 19)
TILE = (28, 42, 30)
CAMO = [(59, 83, 54), (86, 118, 72), (40, 58, 38), (226, 205, 171), (30, 40, 30), (72, 100, 62)]
PANEL = (13, 21, 15)
CREAM = (240, 214, 150)
GOLD = (255, 196, 74)
GLOW = (255, 170, 40)

ICONS = {
    "code": ["......X....", "..X...X.X..", ".X...X...X.", "X....X....X", ".X..X....X.", "..X.X...X..", "....X......"],
    "brain": [".XXX.XXX.", "X..X.X..X", "X.XX.XX.X", "X..X.X..X", "XX.X.X.XX", "X..X.X..X", ".XXX.XXX.", "....X...."],
    "invader": ["..X...X..", "...X.X...", "..XXXXX..", ".XX.X.XX.", "XXXXXXXXX", "X.XXXXX.X", "X.X...X.X"],
    "leaf": ["....X....", "...XXX...", "X..XXX..X", "XX.XXX.XX", ".XXXXXXX.", "..XXXXX..", "....X....", "....X...."],
    "lines": ["XXXXXXX..", ".........", "XXXXX.XX.", ".........", "XXXXXXXX.", ".........", "XXX.XXXX."],
    "bot": ["....X....", "..XXXXX..", ".X.....X.", ".X.X.X.X.", ".X.....X.", "..XXXXX..", "..X...X.."],
    "node": ["....X....", "...X.X...", "X.X...X.X", ".X..X..X.", "X.X...X.X", "...X.X...", "....X...."],
    "target": ["..XXXXX..", ".X.....X.", "X..XXX..X", "X..X.X..X", "X..XXX..X", ".X.....X.", "..XXXXX.."],
    "bars": ["XXXXXXXXX", ".........", "XXXXXX...", ".........", "XXXXXXXX.", ".........", "XXXX....."],
    "window": ["XXXXXXXXX", "X.X.X...X", "XXXXXXXXX", "X.......X", "X..XXX..X", "X.......X", "XXXXXXXXX"],
    "monitor": ["XXXXXXXXX", "X.......X", "X.XX....X", "X.......X", "XXXXXXXXX", "...XXX...", "..XXXXX.."],
    "rocket": ["....X....", "...XXX...", "...X.X...", "...XXX...", "..XXXXX..", ".X.XXX.X.", "...X.X..."],
}


def proj(x, y, z):
    return ORIGIN[0] + (x - y) * CW / 2, ORIGIN[1] + (x + y) * CH / 2 - z * ZH


def shade(c, k):
    return tuple(max(0, min(255, int(v * k))) for v in c)


class Frame:
    """One frame: a base image, a glow layer, and a record of where content was drawn."""

    def __init__(self, seed=7):
        self.img = Image.new("RGB", CANVAS, BG)
        self.d = ImageDraw.Draw(self.img)
        self.glow = Image.new("RGB", CANVAS, (0, 0, 0))
        self.g = ImageDraw.Draw(self.glow)
        self.pts = []
        self.floor(seed)

    def poly(self, pts, fill, glow=None):
        p = [(round(a), round(b)) for a, b in pts]
        self.d.polygon(p, fill=fill)
        self.pts.extend(p)
        if glow:
            self.g.polygon(p, fill=glow)

    def floor(self, seed):
        rnd = random.Random(seed)
        for i in range(-30, 31, 2):
            self.d.line([proj(i, -30, 0), proj(i, 30, 0)], fill=(20, 28, 24), width=1)
            self.d.line([proj(-30, i, 0), proj(30, i, 0)], fill=(20, 28, 24), width=1)
        for _ in range(26):
            x, y = rnd.randint(-24, 24), rnd.randint(-24, 24)
            dia = [proj(x, y, 0), proj(x + 2, y, 0), proj(x + 2, y + 2, 0), proj(x, y + 2, 0)]
            self.d.polygon([(round(a), round(b)) for a, b in dia], fill=TILE)

    def cube(self, x, y, z, top, s=1.0, glow=None):
        t = [proj(x, y, z + s), proj(x + s, y, z + s), proj(x + s, y + s, z + s), proj(x, y + s, z + s)]
        left = [proj(x, y + s, z + s), proj(x + s, y + s, z + s), proj(x + s, y + s, z), proj(x, y + s, z)]
        right = [proj(x + s, y, z + s), proj(x + s, y + s, z + s), proj(x + s, y + s, z), proj(x + s, y, z)]
        self.poly(left, shade(top, 0.62), glow)
        self.poly(right, shade(top, 0.42), glow)
        self.poly(t, top, glow)

    def panel(self, x0, y_face, z0, w, h, icon, lit=False):
        """Dark slab on a left (y = y_face) face, with a pixel icon."""
        y = y_face + 0.06
        self.poly([proj(x0, y, z0 + h), proj(x0 + w, y, z0 + h), proj(x0 + w, y, z0), proj(x0, y, z0)], PANEL)
        grid = ICONS[icon]
        rows, cols = len(grid), len(grid[0])
        pad_u, pad_v = w * 0.16, h * 0.18
        cu = (w - 2 * pad_u) / cols
        cv = (h - 2 * pad_v) / rows
        color = GOLD if lit else CREAM
        for r, row in enumerate(grid):
            for c, ch in enumerate(row):
                if ch != "X":
                    continue
                u0 = x0 + pad_u + c * cu
                v0 = z0 + h - pad_v - r * cv
                quad = [proj(u0, y, v0), proj(u0 + cu, y, v0), proj(u0 + cu, y, v0 - cv), proj(u0, y, v0 - cv)]
                self.poly(quad, color, GLOW if lit else None)

    def node(self, x, y, z, lit=False):
        self.cube(x - 0.2, y - 0.2, z - 0.2, GOLD, s=0.4, glow=GLOW if lit else (90, 60, 10))

    def line(self, a, b, width=4):
        pa, pb = proj(*a), proj(*b)
        self.d.line([pa, pb], fill=GOLD, width=width)
        self.g.line([pa, pb], fill=(110, 70, 10), width=width * 3)

    def pulse(self, a, b, t, r=16):
        pa, pb = proj(*a), proj(*b)
        x, y = pa[0] + (pb[0] - pa[0]) * t, pa[1] + (pb[1] - pa[1]) * t
        self.d.ellipse([x - r / 2, y - r / 2, x + r / 2, y + r / 2], fill=(255, 245, 190))
        self.g.ellipse([x - r * 2, y - r * 2, x + r * 2, y + r * 2], fill=GLOW)

    def ground_glow(self, x, y, w, h):
        cx, cy = proj(x + w / 2, y + h / 2, 0)
        self.g.ellipse([cx - w * 30, cy - h * 10, cx + w * 30, cy + h * 10], fill=(70, 45, 8))

    def render(self):
        bloom = self.glow.filter(ImageFilter.GaussianBlur(18))
        from PIL import ImageChops
        return ImageChops.add(self.img, bloom)


def camo(seed):
    rnd = random.Random(seed)
    return lambda: CAMO[rnd.randrange(len(CAMO))]


def column(f, x, y, w, dpt, h, seed, z0=0, skip_top=0):
    """A w x dpt x h stack of camo sub-cubes, drawn back to front."""
    pick = camo(seed)
    colors = {(i, j, k): pick() for i in range(w) for j in range(dpt) for k in range(h)}
    for (i, j, k) in sorted(colors, key=lambda c: (c[0] + c[1], c[2])):
        if k >= h - skip_top:
            continue
        f.cube(x + i, y + j, z0 + k, colors[(i, j, k)])


def save(frames, name, size=(960, 320), duration=110, pad=60):
    xs = [p[0] for fr in frames for p in fr.pts]
    ys = [p[1] for fr in frames for p in fr.pts]
    x0, x1, y0, y1 = min(xs) - pad, max(xs) + pad, min(ys) - pad, max(ys) + pad
    tw, th = size
    want = tw / th
    w, h = x1 - x0, y1 - y0
    if w / h < want:
        extra = h * want - w
        x0, x1 = x0 - extra / 2, x1 + extra / 2
    else:
        extra = w / want - h
        y0, y1 = y0 - extra / 2, y1 + extra / 2
    box = tuple(int(v) for v in (x0, y0, x1, y1))
    out_frames = [fr.render().crop(box).resize(size, Image.Resampling.LANCZOS)
                  .convert("P", palette=Image.Palette.ADAPTIVE, colors=64) for fr in frames]
    out = Path(__file__).resolve().parents[1] / "assets" / "animations" / name
    out.parent.mkdir(parents=True, exist_ok=True)
    out_frames[0].save(out, save_all=True, append_images=out_frames[1:], duration=duration,
                       loop=0, optimize=True, disposal=2)
    still = out.with_suffix(".png")
    frames[-1].render().crop(box).resize(size, Image.Resampling.LANCZOS).save(still, optimize=True)
    print(f"Wrote {out.relative_to(out.parents[2])} ({out.stat().st_size // 1024} KB, {len(frames)} frames) and {still.name}")


def scene_flow():
    """Six towers for the V5 layers. A gold pulse runs from the assistant to the operators."""
    icons = ["brain", "node", "target", "bars", "window", "monitor"]
    heights = [6, 5, 6, 4, 5, 5]
    pos = [(i * 3, -i * 3) for i in range(6)]
    nodes = [(x + 1, y + 2.4, h + 0.8) for (x, y), h in zip(pos, heights)]
    steps, frames = 5, []
    for f in range(len(icons) * steps):
        fr = Frame()
        active, t = f // steps, (f % steps) / steps
        for i, ((x, y), h) in enumerate(zip(pos, heights)):
            fr.ground_glow(x, y, 2, 2)
            column(fr, x, y, 2, 2, h, seed=11 + i)
            fr.panel(x + 0.15, y + 2, h - 3.2, 1.7, 2.4, icons[i], lit=i == active)
        for a, b in zip(nodes, nodes[1:]):
            fr.line(a, b)
        for i, n in enumerate(nodes):
            fr.node(*n, lit=i == active)
        if active < len(nodes) - 1:
            fr.pulse(nodes[active], nodes[active + 1], t)
        frames.append(fr)
    save(frames, "flow-v5.gif", size=(960, 320), duration=120, pad=70)


def scene_build():
    """The H is stacked layer by layer, then its panels and nodes light up."""
    left, right, bar_z, H = (0, 0), (6, 0), 3, 7
    frames = []
    for f in range(H * 2 + 14):
        fr = Frame()
        layers = min(H, f // 2 + 1)
        fr.ground_glow(0, 0, 8, 2)
        column(fr, *left, 2, 2, layers, seed=3)
        if layers > bar_z:
            column(fr, 2, 0, 4, 2, min(2, layers - bar_z), seed=5, z0=bar_z)
        column(fr, *right, 2, 2, layers, seed=4)
        if layers < H:
            fr.cube(0.5, 0.5, layers + 1.5 - (f % 2) * 0.6, CAMO[3])
            fr.cube(6.5, 0.5, layers + 1.5 - (f % 2) * 0.6, CAMO[1])
        else:
            k = f - H * 2
            fr.panel(0.15, 2, 4.3, 1.7, 2.2, "code", lit=k % 6 < 3)
            fr.panel(0.15, 2, 1.6, 1.7, 2.2, "lines")
            fr.panel(0.25, 2, 0.15, 0.9, 1.1, "leaf")
            fr.panel(6.15, 2, 4.3, 1.7, 2.2, "brain", lit=k % 6 >= 3)
            fr.panel(6.15, 2, 1.0, 1.7, 2.2, "invader")
            pts = [(2.3, 2.4, 3.5), (3.6, 2.4, 4.3), (5.0, 2.4, 4.8)]
            for a, b in zip(pts, pts[1:]):
                fr.line(a, b)
            for i, p in enumerate(pts):
                fr.node(*p, lit=(k // 2) % 3 == i)
        frames.append(fr)
    save(frames, "build-h.gif", size=(960, 540), duration=120, pad=50)


def scene_ship():
    """A gold rocket block lifts off a camo tower and leaves a trail of sparks."""
    frames = []
    for f in range(22):
        fr = Frame()
        fr.ground_glow(0, 0, 2, 2)
        column(fr, 0, 0, 2, 2, 5, seed=9)
        fr.panel(0.15, 2, 1.4, 1.7, 2.4, "rocket", lit=True)
        rise = f * 0.2
        for k in range(6):
            sz = 0.18 if k % 2 else 0.26
            zz = 5.4 + rise - k * 0.7
            if zz > 5.1:
                fr.cube(0.9 + (k % 3 - 1) * 0.25, 0.9, zz, GOLD, s=sz, glow=GLOW)
        fr.cube(0.3, 0.3, 5.6 + rise, CAMO[3], s=1.4, glow=(80, 55, 10))
        fr.node(1.0, 1.0, 7.4 + rise, lit=True)
        frames.append(fr)
    save(frames, "ship-launch.gif", size=(960, 540), duration=90, pad=50)


def scene_coordinate():
    """Three worker bots walk between stations; each station lights up when a bot arrives."""
    stations = [(0, 0), (6, 0), (6, 4), (0, 4), (3, 2)]
    routes = [[0, 1, 2, 3], [4, 1, 4, 3], [2, 4, 0, 4]]
    frames, total = [], 40
    for f in range(total):
        fr = Frame()
        column(fr, -1, -1, 9, 7, 1, seed=21)
        for i, (sx, sy) in enumerate(stations):
            for j in (i + 1,):
                pass
        tops = [(sx + 0.5, sy + 0.5, 1.25) for sx, sy in stations]
        for a in (0, 1, 2, 3):
            fr.line(tops[a], tops[4], width=3)
        lit_stations = set()
        bots = []
        for b, route in enumerate(routes):
            n = len(route)
            pos = (f / total) * n
            i, t = int(pos) % n, pos - int(pos)
            a, c = stations[route[i]], stations[route[(i + 1) % n]]
            if t > 0.85:
                lit_stations.add(route[(i + 1) % n])
            bots.append((a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t))
        for i, p in enumerate(tops):
            fr.node(*p, lit=i in lit_stations)
        for (bx, by) in sorted(bots, key=lambda p: p[0] + p[1]):
            fr.cube(bx + 0.1, by + 0.1, 1.0, CAMO[3], s=0.8)
            fr.cube(bx + 0.1, by + 0.1, 1.8, CAMO[1], s=0.8)
            fr.panel(bx + 0.18, by + 0.9, 2.0, 0.64, 0.5, "bot", lit=True)
        frames.append(fr)
    save(frames, "coordinate-bots.gif", size=(960, 540), duration=100, pad=50)


def scene_divider():
    """A low camo wall with a gold pulse running along its top. Used between README sections."""
    frames, steps = [], 24
    length = 20
    a, b = (0.5, 0.5, 1.15), (length - 0.5, -length + 1.5, 1.15)
    pick = camo(31)
    colors = [pick() for _ in range(length)]
    for f in range(steps):
        fr = Frame(seed=2)
        for i in range(length):
            fr.cube(i, -i, 0, colors[i])
        fr.line(a, b, width=3)
        fr.pulse(a, b, f / steps, r=14)
        frames.append(fr)
    save(frames, "divider.gif", size=(960, 80), duration=70, pad=20)


def main() -> None:
    scene_flow()
    scene_build()
    scene_ship()
    scene_coordinate()
    scene_divider()


if __name__ == "__main__":
    main()
