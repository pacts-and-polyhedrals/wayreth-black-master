#!/usr/bin/env python3
"""Derive square token art from the bestiary portraits.

The portraits are 1024x1536 full-body figures on a transparent background.
Foundry draws a token into a square grid cell, so a portrait used directly is
squashed horizontally. Cropping is wrong too: these are whole creatures, and a
square crop cuts them off at the waist.

So each token is the portrait padded out to a square on transparent pixels and
scaled down. The figure keeps its proportions, fills the cell vertically and
sits centred, which is how a token is meant to look.

    python3 tools/make-tokens.py <portrait-dir> [--size 512]

Writes to assets/tokens/ while preserving the portrait subfolders.  The
bestiary is organised first by creature type, then by CR-prefixed filename.
"""

import argparse
import pathlib
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required: pip install --break-system-packages Pillow")

ROOT = pathlib.Path(__file__).resolve().parent.parent


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", help="directory of portrait .webp files")
    parser.add_argument("--size", type=int, default=512, help="token edge in pixels")
    parser.add_argument("--quality", type=int, default=88)
    # method 6 costs ~5s per image to save about 2KB on a 80KB file. Not worth
    # seven minutes of build time for 78 tokens.
    parser.add_argument("--method", type=int, default=4, help="webp effort, 0-6")
    args = parser.parse_args()

    source = pathlib.Path(args.source)
    out = ROOT / "assets" / "tokens"
    out.mkdir(parents=True, exist_ok=True)

    portraits = sorted(source.rglob("*.webp"))
    if not portraits:
        sys.exit(f"no .webp portraits in {source}")

    written = 0
    for path in portraits:
        image = Image.open(path)
        if image.mode != "RGBA":
            image = image.convert("RGBA")

        edge = max(image.size)
        canvas = Image.new("RGBA", (edge, edge), (0, 0, 0, 0))
        canvas.paste(image, ((edge - image.width) // 2, (edge - image.height) // 2))
        canvas = canvas.resize((args.size, args.size), Image.LANCZOS)
        relative = path.relative_to(source)
        destination = out / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(destination, "WEBP", quality=args.quality, method=args.method)
        written += 1

    total = sum(f.stat().st_size for f in out.rglob("*.webp"))
    print(f"wrote {written} tokens to {out.relative_to(ROOT)} "
          f"({args.size}x{args.size}, {total / 1048576:.1f} MB)")


if __name__ == "__main__":
    main()
