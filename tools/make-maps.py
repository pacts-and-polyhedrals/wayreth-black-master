#!/usr/bin/env python3
"""
Battle map generation for Wayreth: The Black Master.

Roughly a hundred scenes need a map. Hand-painting that is not on the table and
licensing art for a private module is not either, so the maps are generated —
but generated as *places*, not as textures with shapes stamped on them.

The division of labour:

    archetypes.py   declares geometry for each kind of place this campaign
                    visits: where the floor is, what is solid, where light
                    comes from. It never paints a pixel.
    maplib.py       rasterises a declaration — floor, ambient occlusion, cast
                    shadow, bevelled masses, light pools, grade.
    this file       walks the scene plan, renders each one, and writes the
                    geometry back out for scripts/build-scenes.mjs.

Walls come out of the same declaration that produced the picture, so what a
token collides with is what a player can see. Walls traced over a finished
image always drift from it.

Every map is seeded from its scene id, so rebuilding the module reproduces the
same room rather than reshuffling one the GM has already placed tokens on.

Usage:
    python3 tools/make-maps.py --plan build/scene-plan.json --out assets/maps
    python3 tools/make-maps.py --one shoikan-grove-interior
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import asdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from maplib import PX, Scene, PALETTES          # noqa: E402
from archetypes import BUILDERS                  # noqa: E402


def stable_seed(text: str) -> int:
    """A seed that survives process restarts, which hash() does not."""
    h = 2166136261
    for ch in text:
        h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return h


def render_scene(entry: dict, *, geometry_only=False):
    arch = entry["archetype"]
    if arch not in BUILDERS:
        raise SystemExit(f"{entry['id']}: unknown archetype {arch!r}")
    build, default_palette = BUILDERS[arch]
    palette = PALETTES[entry.get("palette", default_palette)]
    scene = Scene(cols=entry["cols"], rows=entry["rows"], palette=palette,
                  seed=stable_seed(entry["id"]))
    if geometry_only:
        # A builder declares its geometry into the Scene and only then calls
        # render, so stubbing render out recovers walls, lights and regions
        # without paying for the pixels. Needed whenever the maps are already
        # on disk and only the geometry has been lost.
        import archetypes as _arch
        from PIL import Image as _Image
        real = _arch.render
        # A one-pixel stand-in rather than None: a couple of builders keep
        # drawing on the returned image (the Test's starfield), and they must
        # still run so the geometry they declare afterwards is captured.
        _arch.render = lambda s, **kw: _Image.new("RGB", (s.w, s.h), (0, 0, 0))
        try:
            build(scene)
        finally:
            _arch.render = real
        image = None
    else:
        image = build(scene)
    geometry = {
        "cols": scene.cols, "rows": scene.rows,
        "walls": [[int(v) for v in seg] for seg in scene.walls],
        "doors": [[int(v) for v in seg] for seg in scene.doors],
        "lights": scene.lights,
        "regions": scene.regions,
        "spawn": scene.spawn,
    }
    return image, geometry


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plan", default="build/scene-plan.json")
    ap.add_argument("--out", default="assets/maps")
    ap.add_argument("--geometry", default="build/map-geometry.json")
    ap.add_argument("--one")
    ap.add_argument("--quality", type=int, default=78)
    ap.add_argument("--geometry-only", action="store_true",
                    help="recover walls and regions without redrawing the maps")
    args = ap.parse_args()

    with open(args.plan, encoding="utf-8") as fh:
        plan = json.load(fh)
    scenes = plan["scenes"]
    if args.one:
        scenes = [s for s in scenes if s["id"] == args.one]
        if not scenes:
            raise SystemExit(f"no scene with id {args.one!r}")

    os.makedirs(args.out, exist_ok=True)
    geometry, total = {}, 0
    for entry in scenes:
        image, geo = render_scene(entry, geometry_only=args.geometry_only)
        path = os.path.join(args.out, f"{entry['id']}.webp")
        if image is not None:
            image.save(path, "WEBP", quality=args.quality, method=5)
        size = os.path.getsize(path) if os.path.exists(path) else 0
        total += size
        geometry[entry["id"]] = geo
        print(f"  {entry['id']:<40} {entry['cols']:>3}x{entry['rows']:<3} "
              f"{len(geo['walls']):>5} walls {len(geo['lights']):>3} lights "
              f"{size / 1024:>7.0f} KB")

    if not args.one:
        os.makedirs(os.path.dirname(args.geometry) or ".", exist_ok=True)
        with open(args.geometry, "w", encoding="utf-8") as fh:
            json.dump(geometry, fh)
        print(f"\n{len(scenes)} maps, {total / 1024 / 1024:.1f} MB "
              f"-> {args.out}, geometry -> {args.geometry}")


if __name__ == "__main__":
    main()
