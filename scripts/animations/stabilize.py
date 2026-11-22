"""Temporal stabilizer for GIF frames.

Keeps a pixel from the previous frame unless it changed by more than a
threshold. Bloom halos and soft lighting flicker by a few levels every frame;
freezing those pixels lets GIF frame-diffing skip them, which cuts file size a
lot without visible change. Small but lasting changes (a halo fading out) are
refreshed after a few frames, so slow gradients never go stale. Runs two passes
so the loop wraps without a seam.

usage: python3 stabilize.py <in_dir> <out_dir> [threshold] [max_age]
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def main() -> None:
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    thr = int(sys.argv[3]) if len(sys.argv) > 3 else 10
    max_age = int(sys.argv[4]) if len(sys.argv) > 4 else 8
    low = 2
    files = sorted(src.glob("*.png"))
    frames = [np.asarray(Image.open(f).convert("RGB"), dtype=np.int16) for f in files]
    dst.mkdir(parents=True, exist_ok=True)
    ref = frames[0].copy()
    age = np.zeros(ref.shape[:2], dtype=np.int32)
    for pass_no in (0, 1):
        for i, frame in enumerate(frames):
            diff = np.abs(frame - ref).max(axis=2)
            changed = (diff > thr) | ((diff > low) & (age >= max_age))
            ref[changed] = frame[changed]
            age[changed] = 0
            age[~changed] += 1
            if pass_no == 1:
                Image.fromarray(ref.astype(np.uint8)).save(dst / files[i].name)


if __name__ == "__main__":
    main()
