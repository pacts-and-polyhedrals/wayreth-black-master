"""
The rendering core behind tools/make-maps.py.

The first attempt at these maps painted decoration onto a flat floor and the
result looked exactly like what it was: a texture with shapes stamped on it.
Walls were invisible, columns read as dots, and every map had the same value
from corner to corner.

The fix is to stop drawing pictures and start rendering a room. An archetype
here does not draw — it *declares* geometry: where the floor is, what is solid,
where the light comes from. This module rasterises that declaration in the
order a real scene resolves:

    floor texture -> ambient occlusion -> cast shadows -> solid masses with
    bevelled tops -> light pools -> grade and vignette

Ambient occlusion is the single technique that does most of the work. Darkening
the floor wherever it meets something solid is what makes a map read as a place
with walls in it rather than a drawing of walls. Everything else is detail.

The same geometry that produces the picture is handed back to the scene builder
for Foundry's wall layer, so the walls a token collides with are the walls a
player can see. Tracing walls over a finished image always drifts.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass, field

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

PX = 100  # pixels per 5-foot square


# ---------------------------------------------------------------------------
# Palette
# ---------------------------------------------------------------------------

@dataclass
class Palette:
    floor_dark: tuple          # floor in shadow
    floor_light: tuple         # floor in light
    solid: tuple               # the mass of a wall, trunk, building
    solid_top: tuple           # its lit upper surface
    accent: tuple              # metal, glass, gilding, magic
    void: tuple = (8, 8, 10)   # what is beyond the floor
    ao: float = 0.80           # how hard contact shadows bite
    warm: bool = False


PALETTES = {
    "tower":        Palette((22, 19, 27), (54, 47, 66), (15, 13, 20), (72, 60, 92), (150, 104, 196)),
    "tower-wayreth":Palette((34, 32, 39), (86, 82, 96), (21, 20, 25), (104, 98, 120), (176, 150, 214)),
    "grove":        Palette((38, 44, 40), (86, 94, 84), (22, 26, 23), (96, 104, 92), (198, 204, 186), ao=0.78),
    "forest":       Palette((34, 46, 32), (96, 118, 76), (22, 32, 20), (86, 108, 66), (210, 188, 112)),
    "road":         Palette((42, 39, 35), (104, 95, 83), (30, 27, 24), (118, 108, 94), (158, 132, 92), warm=True),
    "city":         Palette((72, 72, 78), (168, 166, 158), (48, 48, 54), (198, 194, 182), (196, 162, 88)),
    "interior":     Palette((48, 37, 28), (126, 98, 70), (33, 25, 19), (116, 88, 60), (214, 164, 92), warm=True),
    "library":      Palette((38, 33, 29), (100, 88, 74), (26, 22, 19), (92, 78, 62), (184, 154, 100), warm=True),
    "village":      Palette((38, 43, 35), (108, 114, 88), (28, 30, 25), (118, 120, 96), (190, 152, 94), warm=True),
    "fortress":     Palette((54, 54, 58), (126, 126, 130), (36, 36, 40), (148, 148, 152), (164, 146, 104)),
    "camp":         Palette((40, 37, 30), (102, 92, 72), (28, 26, 21), (112, 100, 78), (186, 148, 86), warm=True),
    "void":         Palette((14, 14, 20), (44, 44, 62), (9, 9, 13), (62, 62, 88), (150, 150, 220), void=(3, 3, 6)),
    "cavern":       Palette((26, 25, 28), (66, 62, 68), (17, 16, 19), (58, 54, 62), (120, 196, 176), ao=0.95),
    # River country: the bank is what you stand on, the water is what you cross.
    "river":        Palette((62, 58, 46), (132, 122, 96), (44, 40, 32), (124, 114, 90), (176, 150, 100), warm=True),
    "marsh":        Palette((48, 52, 38), (104, 110, 80), (34, 37, 28), (96, 102, 74), (168, 172, 120)),
    "farmland":     Palette((58, 52, 36), (142, 128, 86), (40, 35, 25), (128, 112, 76), (198, 174, 108), warm=True),
    "moor":         Palette((54, 54, 44), (122, 122, 96), (38, 38, 31), (112, 112, 88), (166, 158, 116)),
    "hills":        Palette((58, 54, 50), (126, 118, 108), (40, 37, 34), (134, 124, 112), (170, 152, 118)),
    "dwarf":        Palette((46, 42, 40), (104, 94, 86), (30, 27, 25), (116, 104, 92), (214, 170, 92), warm=True),
    # Silvanesti: a forest remembering being killed. Green, but wrong green.
    "nightmare":    Palette((40, 32, 48), (96, 70, 92), (26, 20, 32), (88, 62, 86), (190, 96, 128), ao=0.9),
    "dream":        Palette((48, 44, 70), (118, 108, 156), (30, 28, 46), (128, 116, 170), (214, 196, 255)),
    # Zhaman's crystal, which bends time as well as light.
    "crystal":      Palette((44, 52, 60), (112, 132, 150), (28, 34, 40), (138, 160, 178), (190, 234, 255)),
    "ruin":         Palette((54, 50, 46), (118, 110, 100), (36, 33, 30), (112, 104, 94), (158, 142, 110)),
    "ship":         Palette((58, 44, 30), (132, 100, 66), (38, 29, 20), (120, 92, 62), (206, 172, 104), warm=True),
    # Istar under the Blood Sea: drowned stone, red water, no surface.
    "drowned":      Palette((44, 38, 46), (102, 88, 100), (28, 24, 30), (96, 82, 94), (196, 120, 120)),
    "battlefield":  Palette((50, 44, 38), (112, 100, 84), (34, 30, 26), (106, 94, 80), (190, 110, 70), warm=True),
    # The Abyss. Not dark — wrong.
    "abyss":        Palette((36, 16, 24), (92, 38, 50), (20, 9, 14), (108, 44, 56), (236, 132, 92), void=(10, 3, 6)),
}

# Water is drawn where the floor is not, for archetypes that ask for it.
WATER = {
    "river":  ((26, 46, 58), (62, 104, 118)),
    "marsh":  ((34, 44, 40), (72, 92, 78)),
    "sea":    ((16, 32, 48), (46, 82, 104)),
    "blood":  ((52, 16, 22), (116, 40, 44)),
}

# Light falls from the upper left, consistently, on every map in the module.
LIGHT_DX, LIGHT_DY = -0.55, -0.83


# ---------------------------------------------------------------------------
# Declarative scene description
# ---------------------------------------------------------------------------

@dataclass
class Scene:
    cols: int
    rows: int
    palette: Palette
    seed: int

    floor: list = field(default_factory=list)   # ("rect"|"ellipse"|"poly", pts)
    solids: list = field(default_factory=list)  # {shape, pts, h, role}
    decals: list = field(default_factory=list)  # {shape, pts, colour, alpha, blur}
    lights: list = field(default_factory=list)  # {x, y, bright, dim, colour, alpha, intensity}
    walls: list = field(default_factory=list)   # explicit [x0,y0,x1,y1]
    doors: list = field(default_factory=list)
    regions: dict = field(default_factory=dict)
    spawn: list = field(default_factory=list)
    open_floor: bool = True                     # floor everywhere unless stated

    @property
    def w(self):
        return self.cols * PX

    @property
    def h(self):
        return self.rows * PX

    # -- declaration helpers ------------------------------------------------

    def rect_floor(self, x0, y0, x1, y1):
        self.floor.append(("rect", (x0, y0, x1, y1)))

    def blob_floor(self, cx, cy, r, lobes=9, rng=None):
        rng = rng or random.Random(self.seed)
        for _ in range(lobes):
            ox, oy = rng.randint(-r // 2, r // 2), rng.randint(-r // 2, r // 2)
            rr = int(r * rng.uniform(0.55, 1.0))
            self.floor.append(("ellipse", (cx + ox - rr, cy + oy - rr, cx + ox + rr, cy + oy + rr)))

    def solid_rect(self, x0, y0, x1, y1, h=1.0, role="solid", wall=True):
        self.solids.append({"shape": "rect", "pts": (x0, y0, x1, y1), "h": h, "role": role})
        if wall:
            self.walls += [[x0, y0, x1, y0], [x1, y0, x1, y1], [x1, y1, x0, y1], [x0, y1, x0, y0]]

    def solid_circle(self, cx, cy, r, h=1.0, role="solid", wall=True, facets=8):
        self.solids.append({"shape": "ellipse", "pts": (cx - r, cy - r, cx + r, cy + r),
                            "h": h, "role": role})
        if wall:
            pts = [(cx + math.cos(math.tau * i / facets) * r,
                    cy + math.sin(math.tau * i / facets) * r) for i in range(facets)]
            for i in range(facets):
                a, b = pts[i], pts[(i + 1) % facets]
                self.walls.append([int(a[0]), int(a[1]), int(b[0]), int(b[1])])

    def solid_poly(self, pts, h=1.0, role="solid", wall=True):
        self.solids.append({"shape": "poly", "pts": pts, "h": h, "role": role})
        if wall:
            for i in range(len(pts)):
                a, b = pts[i], pts[(i + 1) % len(pts)]
                self.walls.append([int(a[0]), int(a[1]), int(b[0]), int(b[1])])

    def band(self, x0, y0, x1, y1, width, h=1.4, role="solid", wall=True):
        """A wall run of real thickness, declared by its centreline."""
        dx, dy = x1 - x0, y1 - y0
        ln = math.hypot(dx, dy) or 1
        nx, ny = -dy / ln * width / 2, dx / ln * width / 2
        pts = [(x0 + nx, y0 + ny), (x1 + nx, y1 + ny), (x1 - nx, y1 - ny), (x0 - nx, y0 - ny)]
        self.solids.append({"shape": "poly", "pts": pts, "h": h, "role": role})
        if wall:
            self.walls.append([int(x0), int(y0), int(x1), int(y1)])

    def decal(self, shape, pts, colour, alpha=90, blur=0):
        self.decals.append({"shape": shape, "pts": pts, "colour": colour,
                            "alpha": alpha, "blur": blur})

    def light(self, x, y, bright=3, dim=8, colour="#ffd9a0", alpha=0.4, intensity=1.0):
        self.lights.append({"x": int(x), "y": int(y), "bright": bright, "dim": dim,
                            "colour": colour, "alpha": alpha, "intensity": intensity})

    def door(self, x0, y0, x1, y1):
        self.doors.append([int(x0), int(y0), int(x1), int(y1)])

    def drop_wall(self, predicate):
        """Remove wall segments, e.g. to cut a doorway out of a run."""
        self.walls = [s for s in self.walls if not predicate(s)]


# ---------------------------------------------------------------------------
# Raster helpers
# ---------------------------------------------------------------------------

def _mask(size, shapes, feather=0):
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    for item in shapes:
        shape, pts = (item["shape"], item["pts"]) if isinstance(item, dict) else item
        if shape == "rect":
            d.rectangle(list(pts), fill=255)
        elif shape == "ellipse":
            d.ellipse(list(pts), fill=255)
        elif shape == "poly":
            d.polygon([tuple(p) for p in pts], fill=255)
        elif shape == "line":
            (x0, y0, x1, y1, wdt) = pts
            d.line([x0, y0, x1, y1], fill=255, width=wdt)
    if feather:
        m = soft(m, feather)
    return m


def fractal(w, h, rng, octaves=5, scale=10):
    acc = np.zeros((h, w), dtype=np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        sw = max(2, w // (scale * (2 ** o)) or 2)
        sh = max(2, h // (scale * (2 ** o)) or 2)
        layer = (rng.random((sh, sw)) * 255).astype("uint8")
        img = Image.fromarray(layer, "L").resize((w, h), Image.BICUBIC)
        acc += np.asarray(img, dtype=np.float32) / 255.0 * amp
        total += amp
        amp *= 0.52
    acc /= total
    lo, hi = float(acc.min()), float(acc.max())
    return (acc - lo) / (hi - lo + 1e-6)


def flagstones(size, rng, cell, jitter=7, seed=0):
    """A mortar-line mask plus a per-slab tone mask, so slabs vary."""
    w, h = size
    lines = Image.new("L", size, 0)
    tone = Image.new("L", size, 128)
    dl, dt = ImageDraw.Draw(lines), ImageDraw.Draw(tone)
    r2 = random.Random(seed)
    row = 0
    y = -cell
    while y < h + cell:
        off = (row % 2) * cell // 2
        x = -cell
        while x < w + cell:
            jx, jy = r2.randint(-jitter, jitter), r2.randint(-jitter, jitter)
            box = [x + off + jx, y + jy, x + off + cell + jx - 5, y + cell + jy - 5]
            dl.rounded_rectangle(box, radius=max(2, cell // 16), outline=255,
                                 width=max(2, cell // 34))
            dt.rounded_rectangle(box, radius=max(2, cell // 16),
                                 fill=r2.randint(96, 165))
            x += cell
        y += cell
        row += 1
    return lines.filter(ImageFilter.GaussianBlur(1.2)), tone.filter(ImageFilter.GaussianBlur(2.0))


def _hex(c):
    c = c.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def _blur_rgb(img, radius, shrink=4):
    """soft(), for a colour image."""
    if radius < 2:
        return img.filter(ImageFilter.GaussianBlur(radius))
    w, h = img.size
    small = img.resize((max(1, w // shrink), max(1, h // shrink)), Image.BILINEAR)
    small = small.filter(ImageFilter.GaussianBlur(max(0.6, radius / shrink)))
    return small.resize((w, h), Image.BILINEAR)


def soft(mask, radius, shrink=4):
    """
    A wide blur, done cheaply.

    Occlusion, cast shadow and light pools are all low-frequency — nothing in
    them survives a quarter-scale round trip. Blurring at full resolution made
    each map take the better part of a minute, which across a hundred maps is
    an hour of rebuild for detail no one can see.
    """
    if radius < 2:
        return mask.filter(ImageFilter.GaussianBlur(radius))
    w, h = mask.size
    sw, sh = max(1, w // shrink), max(1, h // shrink)
    small = mask.resize((sw, sh), Image.BILINEAR)
    small = small.filter(ImageFilter.GaussianBlur(max(0.6, radius / shrink)))
    return small.resize((w, h), Image.BILINEAR)


# ---------------------------------------------------------------------------
# The renderer
# ---------------------------------------------------------------------------

def render(scene: Scene, *, stone=None, boards=False, mist=0.0, water=None):
    """Rasterise a declared Scene. `stone` is a flagstone cell size in pixels."""
    w, h, pal = scene.w, scene.h, scene.palette
    rng = np.random.default_rng(scene.seed)
    r2 = random.Random(scene.seed)

    # --- floor extent --------------------------------------------------
    if scene.open_floor and not scene.floor:
        floor_mask = Image.new("L", (w, h), 255)
    else:
        floor_mask = _mask((w, h), scene.floor, feather=PX * 0.10)
        floor_mask = floor_mask.point(lambda v: 255 if v > 118 else 0)
    fm = np.asarray(floor_mask, dtype=np.float32) / 255.0

    # --- floor surface -------------------------------------------------
    n = fractal(w, h, rng, octaves=5, scale=9)
    n2 = fractal(w, h, rng, octaves=3, scale=30)
    zones = fractal(w, h, rng, octaves=2, scale=64)
    # The low-frequency layer carries most of the weight: it is what stops a
    # large floor reading as one flat value from corner to corner.
    blend = np.clip(n * 0.34 + n2 * 0.26 + zones * 0.40, 0, 1)
    blend = np.clip((blend - 0.5) * 1.5 + 0.5, 0, 1)
    dark = np.array(pal.floor_dark, dtype=np.float32)
    light = np.array(pal.floor_light, dtype=np.float32)
    base = dark + (light - dark) * blend[..., None]

    if stone:
        lines, tone = flagstones((w, h), rng, stone, seed=scene.seed)
        lmask = np.asarray(lines, dtype=np.float32) / 255.0
        tmask = np.asarray(tone, dtype=np.float32) / 255.0
        base *= (0.72 + 0.56 * tmask)[..., None]        # slab-to-slab variation
        base *= (1.0 - lmask * 0.55)[..., None]          # mortar lines cut in
    if boards:
        step = int(PX * 0.5)
        bd = Image.new("L", (w, h), 0)
        db = ImageDraw.Draw(bd)
        for y in range(0, h, step):
            db.line([0, y, w, y], fill=255, width=3)
            for x in range(r2.randrange(step), w, int(PX * 4.0)):
                db.line([x, y, x, y + step], fill=200, width=2)
        bm = np.asarray(bd.filter(ImageFilter.GaussianBlur(1.0)), dtype=np.float32) / 255.0
        base *= (1.0 - bm * 0.45)[..., None]

    base += (rng.random((h, w, 1)).astype(np.float32) - 0.5) * 11

    # --- decals, under the lighting ------------------------------------
    if scene.decals:
        dec = Image.fromarray(np.clip(base, 0, 255).astype("uint8"), "RGB")
        dd = ImageDraw.Draw(dec, "RGBA")
        for item in scene.decals:
            layer = item
            colour = (*layer["colour"], layer["alpha"])
            if layer["blur"]:
                tmp = Image.new("RGBA", (w, h), (0, 0, 0, 0))
                td = ImageDraw.Draw(tmp)
                _paint(td, layer["shape"], layer["pts"], colour)
                tmp = tmp.filter(ImageFilter.GaussianBlur(layer["blur"]))
                dec = Image.alpha_composite(dec.convert("RGBA"), tmp).convert("RGB")
                dd = ImageDraw.Draw(dec, "RGBA")
            else:
                _paint(dd, layer["shape"], layer["pts"], colour)
        base = np.asarray(dec, dtype=np.float32)

    # --- solids: masks, occlusion, cast shadow -------------------------
    solid_mask = _mask((w, h), scene.solids) if scene.solids else Image.new("L", (w, h), 0)
    sm = np.asarray(solid_mask, dtype=np.float32) / 255.0

    # Contact shadow: the floor darkens where it meets mass. This is the
    # single biggest contributor to a map reading as three-dimensional.
    ao = np.asarray(soft(solid_mask, PX * 0.55), dtype=np.float32) / 255.0
    ao = np.clip(ao * 1.9, 0, 1)
    base *= (1.0 - ao * pal.ao * 0.62)[..., None]

    # Cast shadow, offset away from the light.
    off = int(PX * 0.30)
    cast = soft(ImageChops.offset(solid_mask, int(-LIGHT_DX * off), int(-LIGHT_DY * off)),
                PX * 0.16)
    cs = np.asarray(cast, dtype=np.float32) / 255.0
    cs = np.clip(cs - sm, 0, 1)
    base *= (1.0 - cs * 0.5)[..., None]

    # Beyond the floor is void — or, on a river map, the river.
    if water:
        deep, shallow = (np.array(c, dtype=np.float32) for c in WATER[water])
        flow = fractal(w, h, rng, octaves=4, scale=7)
        ripple = fractal(w, h, rng, octaves=2, scale=3)
        surf = np.clip(flow * 0.72 + ripple * 0.28, 0, 1)
        # Shallows where the water meets land: the depth cue that makes a
        # river read as a river rather than a blue rectangle.
        edge = np.asarray(soft(floor_mask, PX * 1.3), dtype=np.float32) / 255.0
        body = deep + (shallow - deep) * surf[..., None]
        body = body + (shallow - deep) * (edge * 0.55)[..., None]
        # Specular glints along the flow.
        glint = np.clip((surf - 0.78) * 4.2, 0, 1)[..., None]
        body = body + np.array([150, 170, 180], dtype=np.float32) * glint * 0.5
        base = base * fm[..., None] + body * (1 - fm[..., None])
    else:
        voidc = np.array(pal.void, dtype=np.float32)
        base = base * fm[..., None] + voidc * (1 - fm[..., None])

    img = Image.fromarray(np.clip(base, 0, 255).astype("uint8"), "RGB")

    # --- paint the solids themselves ------------------------------------
    #
    # A mass is painted with its LIT top face, not its shadow colour. Looking
    # straight down at a column, most of what you see is the top of it — the
    # first pass filled them with the near-black wall tone and every column in
    # the module came out a hole in the floor.
    d = ImageDraw.Draw(img, "RGBA")
    for item in sorted(scene.solids, key=lambda s: s["h"]):
        _paint(d, item["shape"], item["pts"], (*pal.solid_top, 255))
    a = np.asarray(img, dtype=np.float32)

    # Give each top face its own grain so large masses are not flat colour.
    tex = fractal(w, h, rng, octaves=4, scale=14)
    a = a * (1 - sm[..., None]) + (a * (0.84 + 0.30 * tex[..., None])) * sm[..., None]

    rim = int(max(3, PX * 0.10))
    # A dark band inside the shadow-facing edge: this is the side of the mass.
    dk = ImageChops.offset(solid_mask, int(-LIGHT_DX * rim * 1.7), int(-LIGHT_DY * rim * 1.7))
    dk = soft(ImageChops.subtract(solid_mask, dk), rim * 0.55)
    dkm = np.asarray(dk, dtype=np.float32) / 255.0
    a = a * (1 - dkm[..., None] * 0.80) + np.array(pal.solid, dtype=np.float32) * (dkm[..., None] * 0.80)
    # A bright lip on the light-facing edge, so it catches.
    lt = ImageChops.offset(solid_mask, int(LIGHT_DX * rim * 1.2), int(LIGHT_DY * rim * 1.2))
    lt = soft(ImageChops.subtract(solid_mask, lt), rim * 0.4)
    ltm = np.asarray(lt, dtype=np.float32) / 255.0 * 0.55
    a = a * (1 - ltm[..., None]) + np.minimum(255.0, np.array(pal.solid_top, dtype=np.float32) * 1.7) * ltm[..., None]
    img = Image.fromarray(np.clip(a, 0, 255).astype("uint8"), "RGB")

    # --- light pools -----------------------------------------------------
    if scene.lights:
        pool = Image.new("RGB", (w, h), (0, 0, 0))
        pd = ImageDraw.Draw(pool)
        for L in scene.lights:
            r = int(L["dim"] * PX / 5 * 0.9)
            col = _hex(L["colour"])
            for step in range(7, 0, -1):
                rr = int(r * step / 7)
                k = (1 - step / 8) ** 1.7 * L["alpha"] * L["intensity"]
                pd.ellipse([L["x"] - rr, L["y"] - rr, L["x"] + rr, L["y"] + rr],
                           fill=tuple(int(c * k) for c in col))
        pool = soft(pool.convert("L"), PX * 0.22).convert("RGB") if False else _blur_rgb(pool, PX * 0.22)
        pa = np.asarray(pool, dtype=np.float32)
        # Light does not pass through mass.
        shade = 1.0 - np.clip(sm * 0.8, 0, 1)
        a = np.asarray(img, dtype=np.float32) + pa * shade[..., None] * 1.15
        img = Image.fromarray(np.clip(a, 0, 255).astype("uint8"), "RGB")

    # --- mist ------------------------------------------------------------
    # Shoikan is a place you cannot see across. Veiling the floor between the
    # trunks is what makes it read as a grove rather than a field of stumps.
    if mist:
        veil = fractal(w, h, rng, octaves=3, scale=26)
        k = (np.clip(veil * 1.5 - 0.35, 0, 1) * mist)[..., None]
        colour = np.array([196, 202, 194], dtype=np.float32)
        a = np.asarray(img, dtype=np.float32)
        img = Image.fromarray(np.clip(a * (1 - k) + colour * k, 0, 255).astype("uint8"), "RGB")

    # --- grade -----------------------------------------------------------
    a = np.asarray(img, dtype=np.float32) / 255.0
    a = np.clip((a - 0.5) * 1.14 + 0.5, 0, 1)        # contrast
    if pal.warm:
        a *= np.array([1.05, 1.0, 0.93], dtype=np.float32)
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    a *= np.clip(1.0 - (r - 0.62) * 0.52, 0.42, 1.0)[..., None]
    return Image.fromarray(np.clip(a * 255, 0, 255).astype("uint8"), "RGB")


def _paint(d, shape, pts, colour):
    if shape == "rect":
        d.rectangle(list(pts), fill=colour)
    elif shape == "ellipse":
        d.ellipse(list(pts), fill=colour)
    elif shape == "poly":
        d.polygon([tuple(p) for p in pts], fill=colour)
    elif shape == "line":
        x0, y0, x1, y1, wdt = pts
        d.line([x0, y0, x1, y1], fill=colour, width=wdt)
