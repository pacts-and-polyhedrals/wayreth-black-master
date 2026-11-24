"""
The places this campaign actually visits.

Each builder declares geometry into a Scene and hands it to maplib.render.
Nothing here paints pixels directly: a builder that starts drawing is a
builder whose walls will stop matching its picture.
"""

from __future__ import annotations

import math
import random

from maplib import PX, Scene, PALETTES, render


# ---------------------------------------------------------------------------
# Tower of High Sorcery
# ---------------------------------------------------------------------------

def tower_hall(s: Scene):
    """A great hall: colonnade, dais, cold wizardlight. Somebody speaks here."""
    w, h, m = s.w, s.h, int(PX * 1.6)
    t = int(PX * 0.85)
    s.rect_floor(m - t // 2, m - t // 2, w - m + t // 2, h - m + t // 2)

    door = int(PX * 1.6)
    s.band(m, m, w - m, m, t)                      # far wall
    s.band(w - m, m, w - m, h - m, t)
    s.band(m, m, m, h - m, t)
    s.band(m, h - m, w // 2 - door, h - m, t)      # near wall, split for the door
    s.band(w // 2 + door, h - m, w - m, h - m, t)
    s.door(w // 2 - door, h - m, w // 2 + door, h - m)

    # Colonnade down the long axis.
    inset = int(PX * 4.0)
    span = w - 2 * inset
    count = max(3, span // (PX * 5))
    for i in range(count):
        x = inset + int(span * i / max(1, count - 1))
        for y in (m + int(PX * 2.6), h - m - int(PX * 2.6)):
            s.solid_circle(x, y, int(PX * 0.70), h=2.2)
            s.decal("ellipse", (x - int(PX * 0.9), y - int(PX * 0.9),
                                x + int(PX * 0.9), y + int(PX * 0.9)),
                    s.palette.accent, alpha=26, blur=PX * 0.3)
            s.light(x, y - int(PX * 0.95), bright=3, dim=7, colour="#8f5fd0", alpha=0.30)

    # The dais, raised but not blocking, and a runner leading to it. Both are
    # here to give the eye somewhere to go: a hall of identical slabs has no
    # focal point and reads as wallpaper.
    dw = int(PX * 5.5)
    s.decal("rect", (w // 2 - dw, m + t // 2, w // 2 + dw, m + int(PX * 3.2)),
            s.palette.floor_light, alpha=190)
    s.decal("rect", (w // 2 - dw, m + int(PX * 3.0), w // 2 + dw, m + int(PX * 3.2)),
            s.palette.accent, alpha=210)
    rw = int(PX * 1.9)
    s.decal("rect", (w // 2 - rw, m + int(PX * 3.2), w // 2 + rw, h - m),
            (44, 20, 58), alpha=150)
    s.decal("rect", (w // 2 - rw, m + int(PX * 3.2), w // 2 - rw + 10, h - m),
            s.palette.accent, alpha=150)
    s.decal("rect", (w // 2 + rw - 10, m + int(PX * 3.2), w // 2 + rw, h - m),
            s.palette.accent, alpha=150)

    s.regions.update(dais={"x": w // 2, "y": m + int(PX * 1.8)},
                     floor={"x": w // 2, "y": h // 2},
                     entrance={"x": w // 2, "y": h - m - int(PX * 1.1)},
                     gallery={"x": inset, "y": h // 2})
    for i in range(5):
        s.spawn.append({"x": w // 2 - PX * 2 + i * PX, "y": h - m - int(PX * 2.4)})
    return render(s, stone=int(PX * 1.5))


def tower_chamber(s: Scene):
    """A working room: a study, a laboratory, a sanctum."""
    w, h, m = s.w, s.h, int(PX * 0.9)
    t = int(PX * 0.7)
    s.rect_floor(m - t // 2, m - t // 2, w - m + t // 2, h - m + t // 2)
    cx = w // 2
    door = int(PX * 1.1)
    s.band(m, m, w - m, m, t)
    s.band(w - m, m, w - m, h - m, t)
    s.band(m, m, m, h - m, t)
    s.band(m, h - m, cx - door, h - m, t)
    s.band(cx + door, h - m, w - m, h - m, t)
    s.door(cx - door, h - m, cx + door, h - m)

    shelf = int(PX * 0.75)
    s.solid_rect(m, m + int(PX * 1.6), m + shelf, h - m - int(PX * 1.6), h=1.8)
    s.solid_rect(w - m - shelf, m + int(PX * 2.0), w - m, h - m - int(PX * 2.2), h=1.8)

    dw, dh = int(PX * 3.4), int(PX * 1.3)
    s.solid_rect(cx - dw // 2, m + int(PX * 2.0), cx + dw // 2, m + int(PX * 2.0) + dh, h=0.8)
    s.decal("rect", (cx - dw // 2 + 8, m + int(PX * 2.0) + 8, cx + dw // 2 - 8,
                     m + int(PX * 2.0) + dh - 8), s.palette.accent, alpha=50)

    for bx in (m + int(PX * 2.6), w - m - int(PX * 2.6)):
        by = h - m - int(PX * 2.1)
        s.solid_circle(bx, by, int(PX * 0.46), h=0.9)
        s.light(bx, by, bright=4, dim=9, colour="#b57ae0", alpha=0.52)

    s.regions.update(desk={"x": cx, "y": m + int(PX * 3.8)},
                     centre={"x": cx, "y": h // 2},
                     entrance={"x": cx, "y": h - m - int(PX * 0.8)},
                     window={"x": w - m - int(PX * 1.6), "y": m + int(PX * 1.3)})
    for i in range(4):
        s.spawn.append({"x": cx - int(PX * 1.5) + i * PX, "y": h - m - int(PX * 3.2)})
    return render(s, stone=int(PX * 1.1))


# ---------------------------------------------------------------------------
# Wood
# ---------------------------------------------------------------------------

def _trees(s, r2, want, keep_clear, rmin, rmax, spacing, canopy=2.7):
    placed = []
    tries = 0
    while len(placed) < want and tries < want * 40:
        tries += 1
        x, y = r2.randrange(s.w), r2.randrange(s.h)
        if keep_clear(x, y):
            continue
        if any((x - px) ** 2 + (y - py) ** 2 < spacing ** 2 for px, py, _ in placed):
            continue
        rr = r2.randint(rmin, rmax)
        placed.append((x, y, rr))
    for x, y, rr in placed:
        cr = int(rr * canopy)
        s.decal("ellipse", (x - cr, y - cr, x + cr, y + cr), s.palette.void, alpha=62,
                blur=PX * 0.25)
    for x, y, rr in placed:
        s.solid_circle(x, y, rr, h=2.6, facets=7)
    return placed


def grove(s: Scene):
    """Shoikan Grove. Black oak, root, mist, and everyone who failed here."""
    w, h = s.w, s.h
    r2 = random.Random(s.seed)

    path = []
    x = w // 2
    for i in range(s.rows + 1):
        x = max(int(PX * 3), min(w - int(PX * 3), x + r2.randint(-PX, PX)))
        path.append((x, h - i * PX))
    for i in range(len(path) - 1):
        s.decal("line", (*path[i], *path[i + 1], int(PX * 2.3)),
                (116, 120, 104), alpha=210, blur=PX * 0.16)
        s.decal("line", (*path[i], *path[i + 1], int(PX * 1.5)),
                (134, 136, 118), alpha=170, blur=PX * 0.10)

    def near_path(px, py):
        return min(abs(px - a) + abs(py - b) * 0.45 for a, b in path) < PX * 1.7

    trees = _trees(s, r2, s.cols * s.rows // 14, near_path,
                   int(PX * 0.52), int(PX * 0.95), int(PX * 2.3), canopy=3.0)

    # Roots crawling out of each trunk.
    for x, y, rr in trees:
        for _ in range(r2.randint(3, 6)):
            a = r2.uniform(0, math.tau)
            ln = rr * r2.uniform(1.7, 3.2)
            s.decal("line", (x, y, x + math.cos(a) * ln, y + math.sin(a) * ln,
                             max(4, rr // 4)), s.palette.solid, alpha=190)

    # Grave markers, off the path.
    for _ in range(s.cols * s.rows // 26):
        gx, gy = r2.randrange(w), r2.randrange(h)
        if near_path(gx, gy):
            continue
        s.decal("rect", (gx, gy, gx + int(PX * 0.34), gy + int(PX * 0.60)),
                s.palette.accent, alpha=205)

    s.regions.update(gate={"x": path[0][0], "y": h - int(PX * 0.9)},
                     path={"x": path[len(path) // 3][0], "y": path[len(path) // 3][1]},
                     clearing={"x": path[len(path) * 2 // 3][0], "y": path[len(path) * 2 // 3][1]},
                     far={"x": path[-1][0], "y": int(PX * 0.9)})
    for p in path[1::4]:
        s.spawn.append({"x": p[0], "y": p[1]})
    return render(s, mist=0.34)


def forest(s: Scene):
    """Wayreth's wood: dense, shifting, and not an enemy."""
    w, h = s.w, s.h
    r2 = random.Random(s.seed)
    cx, cy = w // 2, h // 2
    cr = int(min(w, h) * 0.19)
    s.decal("ellipse", (cx - cr, cy - cr, cx + cr, cy + cr), s.palette.floor_light,
            alpha=85, blur=PX * 0.3)

    _trees(s, r2, s.cols * s.rows // 7,
           lambda x, y: (x - cx) ** 2 + (y - cy) ** 2 < cr ** 2,
           int(PX * 0.34), int(PX * 0.62), int(PX * 1.5), canopy=3.1)

    for _ in range(s.cols * s.rows // 14):
        bx, by = r2.randrange(w), r2.randrange(h)
        rr = r2.randint(int(PX * 0.8), int(PX * 2.0))
        s.decal("ellipse", (bx - rr, by - rr, bx + rr, by + rr),
                s.palette.accent, alpha=20, blur=PX * 0.4)

    s.regions.update(clearing={"x": cx, "y": cy},
                     edge={"x": cx, "y": h - int(PX * 1.2)},
                     deep={"x": cx, "y": int(PX * 1.2)})
    for i in range(6):
        a = math.tau * i / 6
        s.spawn.append({"x": int(cx + math.cos(a) * cr * 0.6),
                        "y": int(cy + math.sin(a) * cr * 0.6)})
    return render(s)


# ---------------------------------------------------------------------------
# Open country
# ---------------------------------------------------------------------------

def road(s: Scene):
    """A war road through ash country, along the long axis."""
    w, h = s.w, s.h
    r2 = random.Random(s.seed)
    mid = h // 2
    band = int(PX * 3.2)
    spine = [(x, mid + int(math.sin(x / (PX * 7.5)) * PX * 1.3) + r2.randint(-10, 10))
             for x in range(0, w + PX, PX)]
    for i in range(len(spine) - 1):
        s.decal("line", (*spine[i], *spine[i + 1], band), s.palette.floor_light,
                alpha=120, blur=PX * 0.1)
    for off in (-band // 4, band // 4):
        for i in range(len(spine) - 1):
            a = (spine[i][0], spine[i][1] + off)
            b = (spine[i + 1][0], spine[i + 1][1] + off)
            s.decal("line", (*a, *b, max(4, PX // 11)), s.palette.void, alpha=95)

    for _ in range(s.cols * s.rows // 20):
        x = r2.randrange(w)
        side = r2.choice([-1, 1])
        y = mid + side * r2.randint(band, max(band + 1, h // 2 - PX // 2))
        if not (PX // 2 < y < h - PX // 2):
            continue
        rr = r2.randint(int(PX * 0.3), int(PX * 0.72))
        s.solid_circle(x, y, rr, h=1.1, facets=6)

    s.regions.update(west={"x": int(PX * 1.3), "y": spine[1][1]},
                     middle={"x": w // 2, "y": spine[len(spine) // 2][1]},
                     east={"x": w - int(PX * 1.3), "y": spine[-2][1]},
                     roadside={"x": w // 3, "y": mid - band - int(PX * 1.2)})
    for x, y in spine[2::4]:
        s.spawn.append({"x": x, "y": y})
    return render(s)


def camp(s: Scene):
    """Tents in a ring, fires, churned ground."""
    w, h = s.w, s.h
    r2 = random.Random(s.seed)
    cx, cy = w // 2, h // 2
    ring = int(min(w, h) * 0.30)
    s.decal("ellipse", (cx - ring, cy - ring, cx + ring, cy + ring),
            s.palette.floor_light, alpha=55, blur=PX * 0.4)

    n = max(5, (s.cols + s.rows) // 6)
    for i in range(n):
        a = math.tau * i / n + r2.uniform(-0.09, 0.09)
        tx = cx + int(math.cos(a) * ring * 1.25)
        ty = cy + int(math.sin(a) * ring * 1.25)
        tw = int(PX * 1.45)
        s.solid_poly([(tx, ty - tw), (tx + tw, ty + tw * 0.8), (tx - tw, ty + tw * 0.8)], h=1.7)

    for i in range(3):
        a = math.tau * i / 3 + 0.4
        fx = cx + int(math.cos(a) * ring * 0.46)
        fy = cy + int(math.sin(a) * ring * 0.46)
        s.solid_circle(fx, fy, int(PX * 0.34), h=0.4)
        s.light(fx, fy, bright=4, dim=10, colour="#ff9a46", alpha=0.62)

    for _ in range(s.cols * s.rows // 16):
        px, py = r2.randrange(w), r2.randrange(h)
        rr = r2.randint(PX // 8, PX // 3)
        s.decal("ellipse", (px - rr, py - rr, px + rr, py + rr), s.palette.void, alpha=55)

    s.regions.update(centre={"x": cx, "y": cy},
                     perimeter={"x": cx, "y": cy - ring - int(PX * 1.8)},
                     fire={"x": cx + int(ring * 0.46), "y": cy + int(PX * 0.9)})
    for i in range(8):
        a = math.tau * i / 8
        s.spawn.append({"x": int(cx + math.cos(a) * ring * 0.72),
                        "y": int(cy + math.sin(a) * ring * 0.72)})
    return render(s)


def village(s: Scene):
    """Vogler: a green, a road through, cottages, room for a festival."""
    w, h = s.w, s.h
    r2 = random.Random(s.seed)
    mid = int(h * 0.62)
    for x in range(0, w, PX):
        s.decal("line", (x, mid + r2.randint(-8, 8), x + PX, mid + r2.randint(-8, 8),
                         int(PX * 2.1)), s.palette.accent, alpha=52)

    gx, gy = w // 2, int(h * 0.34)
    gr = int(min(w, h) * 0.19)
    s.decal("ellipse", (gx - gr, gy - gr, gx + gr, gy + gr), (74, 102, 58), alpha=96,
            blur=PX * 0.3)

    for fx, fy in [(0.12, 0.14), (0.35, 0.07), (0.63, 0.08), (0.87, 0.16),
                   (0.10, 0.84), (0.33, 0.90), (0.65, 0.88), (0.89, 0.81)]:
        bw = int(PX * r2.uniform(2.4, 3.6))
        bh = int(PX * r2.uniform(1.9, 2.7))
        x0, y0 = int(w * fx) - bw // 2, int(h * fy) - bh // 2
        s.solid_rect(x0, y0, x0 + bw, y0 + bh, h=2.4)
        s.decal("poly", [(x0, y0), (x0 + bw, y0), (x0 + bw // 2, y0 - int(bh * 0.3))],
                (104, 64, 44), alpha=215)
        s.light(x0 + bw // 2, y0 + bh + int(PX * 0.5), bright=2, dim=5,
                colour="#ffb45e", alpha=0.34)

    s.regions.update(green={"x": gx, "y": gy}, road={"x": w // 2, "y": mid},
                     gate={"x": int(PX * 1.0), "y": mid},
                     far={"x": w - int(PX * 1.0), "y": mid})
    for i in range(8):
        a = math.tau * i / 8
        s.spawn.append({"x": int(gx + math.cos(a) * gr * 0.7),
                        "y": int(gy + math.sin(a) * gr * 0.7)})
    return render(s)


# ---------------------------------------------------------------------------
# Built places
# ---------------------------------------------------------------------------

def city(s: Scene):
    """Palanthas: a plaza, buildings around it, four street mouths."""
    w, h = s.w, s.h
    cx, cy = w // 2, h // 2
    for x0, y0, x1, y1 in [
        (0, 0, int(w * 0.30), int(h * 0.30)),
        (int(w * 0.70), 0, w, int(h * 0.32)),
        (0, int(h * 0.70), int(w * 0.28), h),
        (int(w * 0.72), int(h * 0.68), w, h),
        (int(w * 0.40), 0, int(w * 0.60), int(h * 0.15)),
        (int(w * 0.42), int(h * 0.87), int(w * 0.62), h),
    ]:
        s.solid_rect(x0, y0, x1, y1, h=3.0)
        for wy in range(y0 + int(PX * 0.9), y1 - int(PX * 0.6), int(PX * 1.3)):
            for wx in range(x0 + int(PX * 0.9), x1 - int(PX * 0.6), int(PX * 1.5)):
                s.decal("rect", (wx, wy, wx + PX // 4, wy + PX // 3),
                        s.palette.accent, alpha=135)

    fr = int(PX * 1.6)
    s.decal("ellipse", (cx - fr - 10, cy - fr - 10, cx + fr + 10, cy + fr + 10),
            s.palette.floor_light, alpha=60)
    s.solid_circle(cx, cy, fr, h=0.6, facets=12)
    s.decal("ellipse", (cx - fr + 14, cy - fr + 14, cx + fr - 14, cy + fr - 14),
            (70, 96, 118), alpha=215)

    for i in range(4):
        a = math.tau * i / 4 + math.pi / 4
        s.light(cx + math.cos(a) * PX * 5.5, cy + math.sin(a) * PX * 5.5,
                bright=3, dim=8, colour="#ffd9a0", alpha=0.38)

    s.regions.update(plaza={"x": cx, "y": cy + int(PX * 2.6)},
                     north={"x": cx, "y": int(PX * 1.0)},
                     south={"x": cx, "y": h - int(PX * 1.0)},
                     east={"x": w - int(PX * 1.0), "y": cy},
                     west={"x": int(PX * 1.0), "y": cy})
    for i in range(8):
        a = math.tau * i / 8
        s.spawn.append({"x": int(cx + math.cos(a) * PX * 3.4),
                        "y": int(cy + math.sin(a) * PX * 3.4)})
    return render(s, stone=int(PX * 0.85))


def interior(s: Scene):
    """An inn, a residence, a council room. Boards, a table, a hearth."""
    w, h = s.w, s.h
    m = int(PX * 0.7)
    t = int(PX * 0.6)
    cx, cy = w // 2, h // 2
    s.rect_floor(m - t // 2, m - t // 2, w - m + t // 2, h - m + t // 2)
    door = int(PX * 0.95)
    s.band(m, m, w - m, m, t)
    s.band(w - m, m, w - m, h - m, t)
    s.band(m, m, m, h - m, t)
    s.band(m, h - m, cx - door, h - m, t)
    s.band(cx + door, h - m, w - m, h - m, t)
    s.door(cx - door, h - m, cx + door, h - m)

    tw, th = int(w * 0.36), int(PX * 1.4)
    s.solid_rect(cx - tw // 2, cy - th // 2, cx + tw // 2, cy + th // 2, h=0.7)
    hw = int(PX * 2.3)
    s.solid_rect(cx - hw, m, cx + hw, m + int(PX * 0.65), h=1.6)
    s.light(cx, m + int(PX * 1.0), bright=4, dim=10, colour="#ffa355", alpha=0.6)
    for sx in (m + int(PX * 1.1), w - m - int(PX * 1.1)):
        s.light(sx, cy, bright=2, dim=6, colour="#ffc98a", alpha=0.34)

    s.regions.update(table={"x": cx, "y": cy - th}, hearth={"x": cx, "y": m + int(PX * 1.8)},
                     entrance={"x": cx, "y": h - m - int(PX * 0.7)},
                     corner={"x": m + int(PX * 1.5), "y": h - m - int(PX * 1.5)})
    for i in range(5):
        s.spawn.append({"x": cx - tw // 2 + i * (tw // 4), "y": cy + th})
    return render(s, boards=True)


def library(s: Scene):
    """The Great Library: stack aisles, reading floor, a desk at the top."""
    w, h = s.w, s.h
    m = int(PX * 0.8)
    t = int(PX * 0.7)
    s.rect_floor(m - t // 2, m - t // 2, w - m + t // 2, h - m + t // 2)
    door = int(PX * 1.0)
    s.band(m, m, w - m, m, t)
    s.band(w - m, m, w - m, h - m, t)
    s.band(m, m, m, h - m, t)
    s.band(m, h - m, w // 2 - door, h - m, t)
    s.band(w // 2 + door, h - m, w - m, h - m, t)
    s.door(w // 2 - door, h - m, w // 2 + door, h - m)

    aisle, shelf = int(PX * 1.7), int(PX * 0.95)
    y = m + int(PX * 2.6)
    while y + shelf < h - m - int(PX * 3.2):
        for x0, x1 in [(m + int(PX * 1.2), w // 2 - aisle), (w // 2 + aisle, w - m - int(PX * 1.2))]:
            s.solid_rect(x0, y, x1, y + shelf, h=2.6)
            for bx in range(x0 + 10, x1 - 10, 16):
                s.decal("line", (bx, y + 6, bx, y + shelf - 6, 4), s.palette.accent, alpha=85)
        y += shelf + aisle

    rd = h - m - int(PX * 2.8)
    s.decal("rect", (m, rd, w - m, h - m), s.palette.floor_light, alpha=48)
    for i in range(3):
        s.light(m + int((w - 2 * m) * (i + 1) / 4), rd + int(PX * 1.3),
                bright=3, dim=8, colour="#ffd59a", alpha=0.5)

    s.regions.update(reading={"x": w // 2, "y": rd + int(PX * 1.3)},
                     stacks={"x": w // 2, "y": h // 2 - int(PX * 1.2)},
                     desk={"x": w // 2, "y": m + int(PX * 1.3)},
                     entrance={"x": w // 2, "y": h - m - int(PX * 0.7)})
    for i in range(5):
        s.spawn.append({"x": m + int((w - 2 * m) * (i + 1) / 6), "y": rd + int(PX * 2.0)})
    return render(s, stone=int(PX * 1.05))


def fortress(s: Scene):
    """The High Clerist's Tower: curtain wall, corner towers, keep, gatehouse."""
    w, h = s.w, s.h
    m = int(PX * 1.1)
    t = int(PX * 0.95)
    cx = w // 2
    s.rect_floor(m - t, m - t, w - m + t, h - m + t)
    door = int(PX * 1.6)
    s.band(m, m, w - m, m, t)
    s.band(w - m, m, w - m, h - m, t)
    s.band(m, m, m, h - m, t)
    s.band(m, h - m, cx - door, h - m, t)
    s.band(cx + door, h - m, w - m, h - m, t)
    s.door(cx - door, h - m, cx + door, h - m)

    for tx, ty in [(m, m), (w - m, m), (m, h - m), (w - m, h - m)]:
        s.solid_circle(tx, ty, int(PX * 1.55), h=3.4, facets=10)

    kw, kh = int(w * 0.28), int(h * 0.26)
    ky = int(h * 0.36)
    s.solid_rect(cx - kw // 2, ky - kh // 2, cx + kw // 2, ky + kh // 2, h=3.2)

    for lx, ly in [(m + PX * 2, h // 2), (w - m - PX * 2, h // 2), (cx, h - m - int(PX * 2.0))]:
        s.light(lx, ly, bright=3, dim=8, colour="#ffcf96", alpha=0.42)

    s.regions.update(gate={"x": cx, "y": h - m - int(PX * 1.2)},
                     yard={"x": cx, "y": int(h * 0.68)}, keep={"x": cx, "y": ky},
                     wall={"x": m + int(PX * 1.6), "y": h // 2})
    for i in range(6):
        s.spawn.append({"x": cx - PX * 2 + i * PX, "y": int(h * 0.74)})
    return render(s, stone=int(PX * 1.3))


# ---------------------------------------------------------------------------
# Unreal places
# ---------------------------------------------------------------------------

def void(s: Scene):
    """The Test, the Abyss, a dream: four platforms over nothing, bridged."""
    w, h = s.w, s.h
    s.open_floor = False
    r2 = random.Random(s.seed)
    quads = [(0.27, 0.27, "knowledge"), (0.73, 0.27, "fear"),
             (0.27, 0.73, "law"), (0.73, 0.73, "mercy")]
    centres = []
    rr = int(min(w, h) * 0.165)
    for fx, fy, name in quads:
        cx, cy = int(w * fx), int(h * fy)
        n = 10
        pts = [(cx + math.cos(math.tau * i / n + 0.3) * rr,
                cy + math.sin(math.tau * i / n + 0.3) * rr) for i in range(n)]
        s.floor.append(("poly", pts))
        centres.append((cx, cy))
        s.regions[name] = {"x": cx, "y": cy}
        s.light(cx, cy, bright=4, dim=10, colour="#9c9cff", alpha=0.42)
        s.spawn.append({"x": cx, "y": cy + rr // 2})
        for i in range(n):
            a, b = pts[i], pts[(i + 1) % n]
            s.walls.append([int(a[0]), int(a[1]), int(b[0]), int(b[1])])

    for i, j in [(0, 1), (0, 2), (1, 3), (2, 3)]:
        ax, ay = centres[i]
        bx, by = centres[j]
        dx, dy = bx - ax, by - ay
        ln = math.hypot(dx, dy)
        nx, ny = -dy / ln * PX * 0.55, dx / ln * PX * 0.55
        s.floor.append(("poly", [(ax + nx, ay + ny), (bx + nx, by + ny),
                                 (bx - nx, by - ny), (ax - nx, ay - ny)]))

    s.regions["centre"] = {"x": w // 2, "y": h // 2}
    img = render(s, stone=int(PX * 0.9))
    # Stars, painted last so they sit in the void rather than under the grade.
    from PIL import ImageDraw as _D
    d = _D.Draw(img, "RGBA")
    for _ in range(s.cols * s.rows * 4):
        x, y = r2.randrange(w), r2.randrange(h)
        k = r2.randint(70, 210)
        sz = r2.choice([1, 1, 1, 2, 2, 3])
        d.ellipse([x, y, x + sz, y + sz], fill=(k, k, min(255, int(k * 1.2)), 150))
    return img


def cavern(s: Scene):
    """Undercity, Zhaman, tunnels. Chambers carved out of solid rock."""
    w, h = s.w, s.h
    s.open_floor = False
    r2 = random.Random(s.seed)
    chambers = []
    n = max(3, (s.cols + s.rows) // 9)
    for _ in range(n):
        cx = r2.randrange(int(w * 0.20), int(w * 0.80))
        cy = r2.randrange(int(h * 0.20), int(h * 0.80))
        rr = r2.randint(int(PX * 2.0), int(PX * 3.8))
        chambers.append((cx, cy, rr))
        s.blob_floor(cx, cy, rr, lobes=9, rng=r2)
    for i in range(len(chambers) - 1):
        ax, ay, _ = chambers[i]
        bx, by, _ = chambers[i + 1]
        dx, dy = bx - ax, by - ay
        ln = math.hypot(dx, dy) or 1
        nx, ny = -dy / ln * PX * 0.8, dx / ln * PX * 0.8
        s.floor.append(("poly", [(ax + nx, ay + ny), (bx + nx, by + ny),
                                 (bx - nx, by - ny), (ax - nx, ay - ny)]))

    for i, (cx, cy, rr) in enumerate(chambers):
        s.regions[f"chamber{i + 1}"] = {"x": cx, "y": cy}
        s.spawn.append({"x": cx, "y": cy})
        if i % 2 == 0:
            s.light(cx, cy, bright=2, dim=6, colour="#79e0c8", alpha=0.34)
        for _ in range(3):
            sx = cx + r2.randint(-rr // 2, rr // 2)
            sy = cy + r2.randint(-rr // 2, rr // 2)
            s.solid_circle(sx, sy, r2.randint(int(PX * 0.3), int(PX * 0.6)), h=1.4, facets=6)
    s.regions["entrance"] = {"x": chambers[0][0], "y": chambers[0][1]}
    return render(s)


BUILDERS = {
    "tower-hall": (tower_hall, "tower-wayreth"),
    "tower-chamber": (tower_chamber, "tower"),
    "grove": (grove, "grove"),
    "forest": (forest, "forest"),
    "road": (road, "road"),
    "camp": (camp, "camp"),
    "city": (city, "city"),
    "interior": (interior, "interior"),
    "library": (library, "library"),
    "village": (village, "village"),
    "fortress": (fortress, "fortress"),
    "void": (void, "void"),
    "cavern": (cavern, "cavern"),
}


# ---------------------------------------------------------------------------
# The Vingard route — river, wilds and towns of central Solamnia
#
# Ispin's second road. The Crows are travelling it now, by folding boat and on
# foot, so these are the maps that get used at the table rather than the ones
# that illustrate an arc.
# ---------------------------------------------------------------------------

def river(s: Scene):
    """The Vingard: open water down the long axis, a bank on each side."""
    w, h = s.w, s.h
    s.open_floor = False
    r2 = random.Random(s.seed)

    # Banks, drawn as wandering strips so the channel is not a corridor.
    top, bot = [], []
    ty, by = int(h * 0.20), int(h * 0.80)
    for x in range(-PX, w + PX * 2, PX):
        ty = max(int(h * 0.10), min(int(h * 0.34), ty + r2.randint(-22, 22)))
        by = max(int(h * 0.66), min(int(h * 0.92), by + r2.randint(-22, 22)))
        top.append((x, ty)); bot.append((x, by))
    s.floor.append(("poly", [(-PX, -PX)] + top + [(w + PX, -PX)]))
    s.floor.append(("poly", [(-PX, h + PX)] + bot + [(w + PX, h + PX)]))

    # A sandbar or two, which is where a fight in a river actually happens.
    for _ in range(2):
        bx = r2.randrange(int(w * 0.25), int(w * 0.75))
        by2 = r2.randrange(int(h * 0.42), int(h * 0.58))
        s.blob_floor(bx, by2, int(PX * 2.2), lobes=6, rng=r2)
        s.regions.setdefault("sandbar", {"x": bx, "y": by2})

    # Boulders and a dead tree in the channel: cover, and things to steer round.
    for _ in range(5):
        x = r2.randrange(int(PX), w - int(PX))
        y = r2.randrange(int(h * 0.38), int(h * 0.62))
        s.solid_circle(x, y, r2.randint(int(PX * 0.35), int(PX * 0.7)), h=1.2, facets=6)

    for pts, name in ((top, "north bank"), (bot, "south bank")):
        for _ in range(s.cols // 5):
            i = r2.randrange(2, len(pts) - 2)
            off = int(PX * 0.9) * (-1 if name.startswith("north") else 1)
            s.solid_circle(pts[i][0], pts[i][1] + off,
                           r2.randint(int(PX * 0.3), int(PX * 0.55)), h=1.6, facets=6)

    mid = len(top) // 2
    s.regions.update({
        "north": {"x": top[mid][0], "y": top[mid][1] - int(PX * 1.4)},
        "south": {"x": bot[mid][0], "y": bot[mid][1] + int(PX * 1.4)},
        "channel": {"x": w // 2, "y": h // 2},
        "upstream": {"x": int(PX * 1.5), "y": h // 2},
        "downstream": {"x": w - int(PX * 1.5), "y": h // 2},
    })
    for i in range(5):
        s.spawn.append({"x": int(w * (i + 1) / 6), "y": bot[int(len(bot) * (i + 1) / 6)][1] + int(PX)})
    return render(s, water="river")


def riverbank(s: Scene):
    """One bank, the water along a single edge. Camps, landings, ambushes."""
    w, h = s.w, s.h
    s.open_floor = False
    r2 = random.Random(s.seed)

    line = []
    y = int(h * 0.26)
    for x in range(-PX, w + PX * 2, PX):
        y = max(int(h * 0.14), min(int(h * 0.40), y + r2.randint(-24, 24)))
        line.append((x, y))
    # Bottom-left, bottom-right, then the waterline back right-to-left. Listing
    # the corners either side of the reversed line crosses the polygon over
    # itself and paints the bank as a bow tie.
    s.floor.append(("poly", [(-PX, h + PX), (w + PX, h + PX)] + line[::-1]))

    # A shingle beach where the folding boat comes in.
    lx = int(w * 0.32)
    s.decal("ellipse", (lx - int(PX * 3), line[len(line) // 3][1] - int(PX * 0.4),
                        lx + int(PX * 3), line[len(line) // 3][1] + int(PX * 2.2)),
            (150, 138, 110), alpha=150, blur=PX * 0.3)

    # Scrub and driftwood up the bank.
    for _ in range(s.cols * s.rows // 24):
        x = r2.randrange(w)
        y = r2.randrange(int(h * 0.42), h - PX // 2)
        s.solid_circle(x, y, r2.randint(int(PX * 0.28), int(PX * 0.6)), h=1.4, facets=6)
    for _ in range(6):
        x, y = r2.randrange(w), r2.randrange(int(h * 0.40), h - PX)
        ln = r2.randint(int(PX), int(PX * 2.4))
        a = r2.uniform(0, math.pi)
        s.decal("line", (x, y, x + math.cos(a) * ln, y + math.sin(a) * ln, int(PX * 0.22)),
                (86, 72, 54), alpha=220)

    fx, fy = int(w * 0.62), int(h * 0.68)
    s.solid_circle(fx, fy, int(PX * 0.34), h=0.4)
    s.light(fx, fy, bright=4, dim=10, colour="#ff9a46", alpha=0.58)

    s.regions.update({
        "water": {"x": w // 2, "y": int(h * 0.10)},
        "landing": {"x": lx, "y": line[len(line) // 3][1] + int(PX * 1.4)},
        "camp": {"x": fx, "y": fy + int(PX * 1.4)},
        "treeline": {"x": w // 2, "y": h - int(PX * 1.2)},
        "upstream": {"x": int(PX * 1.4), "y": int(h * 0.55)},
        "downstream": {"x": w - int(PX * 1.4), "y": int(h * 0.55)},
    })
    for i in range(6):
        s.spawn.append({"x": int(w * (i + 1) / 7), "y": int(h * 0.60)})
    return render(s, water="river")


def aqueduct(s: Scene):
    """A Solamnic aqueduct, broken open. Stone channel, dark arches, a drop."""
    w, h = s.w, s.h
    s.open_floor = False
    r2 = random.Random(s.seed)
    chan = int(h * 0.34)
    y0, y1 = (h - chan) // 2, (h + chan) // 2
    s.floor.append(("rect", (-PX, y0, w + PX, y1)))

    t = int(PX * 0.8)
    s.band(-PX, y0, w + PX, y0, t)
    s.band(-PX, y1, w + PX, y1, t)

    # Collapsed spans: gaps in the channel floor with rubble either side.
    for frac in (0.34, 0.68):
        gx = int(w * frac)
        gw = int(PX * r2.uniform(1.8, 3.0))
        s.floor.append(("rect", (gx - gw, y0 - PX, gx + gw, y0 + 4)))  # keeps the wall line
        s.decal("rect", (gx - gw, y0 + t // 2, gx + gw, y1 - t // 2), (10, 10, 12), alpha=235)
        for side in (-1, 1):
            s.solid_circle(gx + side * (gw + int(PX * 0.6)), (y0 + y1) // 2,
                           int(PX * 0.5), h=1.3, facets=6)
        s.regions.setdefault("breach", {"x": gx, "y": (y0 + y1) // 2 - int(PX * 1.2)})

    for i in range(4):
        s.light(int(w * (i + 1) / 5), (y0 + y1) // 2, bright=1, dim=4,
                colour="#9fc8d8", alpha=0.26)

    s.regions.update({
        "west": {"x": int(PX * 1.4), "y": (y0 + y1) // 2},
        "east": {"x": w - int(PX * 1.4), "y": (y0 + y1) // 2},
        "channel": {"x": w // 2, "y": (y0 + y1) // 2},
    })
    for i in range(5):
        s.spawn.append({"x": int(w * (i + 1) / 8), "y": (y0 + y1) // 2})
    return render(s, stone=int(PX * 1.0))


def farmland(s: Scene):
    """Crop fields, hedgerows, a barn — and scarecrows, which the Crows owe."""
    w, h = s.w, s.h
    r2 = random.Random(s.seed)

    # Fields as alternating tonal blocks, hedges between them as low cover.
    rows = 4
    for i in range(rows):
        y0 = int(h * i / rows)
        y1 = int(h * (i + 1) / rows)
        tone = (168, 150, 92) if i % 2 == 0 else (120, 118, 72)
        s.decal("rect", (0, y0, w, y1), tone, alpha=90)
        for x in range(0, w, int(PX * 0.6)):
            s.decal("line", (x, y0 + 8, x, y1 - 8, 3), (90, 80, 48), alpha=70)
        if i < rows - 1:
            for x in range(0, w, int(PX * 1.1)):
                s.solid_circle(x, y1, int(PX * 0.34), h=1.0, facets=5)

    # A track across the fields.
    s.decal("line", (0, int(h * 0.52), w, int(h * 0.46), int(PX * 1.6)),
            (158, 142, 108), alpha=175, blur=PX * 0.12)

    bw, bh = int(PX * 4.5), int(PX * 3.2)
    bx, by = int(w * 0.78), int(h * 0.20)
    s.solid_rect(bx - bw // 2, by - bh // 2, bx + bw // 2, by + bh // 2, h=2.8)
    s.light(bx, by + bh // 2 + int(PX * 0.5), bright=2, dim=5, colour="#ffb45e", alpha=0.32)

    # Scarecrows. Four of them, which is the joke the company is named for.
    crows = []
    for fx, fy in [(0.18, 0.30), (0.42, 0.66), (0.62, 0.34), (0.30, 0.84)]:
        cx, cy = int(w * fx), int(h * fy)
        s.solid_circle(cx, cy, int(PX * 0.30), h=1.6, facets=5)
        s.decal("line", (cx - int(PX * 0.7), cy - int(PX * 0.1),
                         cx + int(PX * 0.7), cy - int(PX * 0.1), int(PX * 0.14)),
                (96, 78, 48), alpha=235)
        crows.append((cx, cy))
    s.regions["scarecrow"] = {"x": crows[0][0], "y": crows[0][1] + int(PX * 1.1)}

    s.regions.update({
        "track": {"x": w // 2, "y": int(h * 0.49)},
        "barn": {"x": bx, "y": by + bh // 2 + int(PX * 1.4)},
        "field": {"x": int(w * 0.25), "y": int(h * 0.62)},
        "gate": {"x": int(PX * 0.8), "y": int(h * 0.52)},
    })
    for i in range(6):
        s.spawn.append({"x": int(w * (i + 1) / 7), "y": int(h * 0.50)})
    return render(s)


def moor(s: Scene):
    """Open Solamnic plain: scrub, standing stones, nowhere to hide."""
    w, h = s.w, s.h
    r2 = random.Random(s.seed)
    for _ in range(s.cols * s.rows // 10):
        x, y = r2.randrange(w), r2.randrange(h)
        rr = r2.randint(int(PX * 0.5), int(PX * 1.8))
        s.decal("ellipse", (x - rr, y - rr, x + rr, y + rr), (92, 96, 66), alpha=40,
                blur=PX * 0.3)
    # Scattered rock, and a line of standing stones that gives the map a spine.
    for _ in range(s.cols * s.rows // 30):
        x, y = r2.randrange(w), r2.randrange(h)
        s.solid_circle(x, y, r2.randint(int(PX * 0.25), int(PX * 0.5)), h=1.0, facets=5)
    sy = int(h * 0.42)
    for i in range(5):
        sx = int(w * (i + 1) / 6)
        s.solid_rect(sx - int(PX * 0.3), sy - int(PX * 0.55),
                     sx + int(PX * 0.3), sy + int(PX * 0.55), h=2.6)
    s.regions.update({
        "stones": {"x": w // 2, "y": sy + int(PX * 1.5)},
        "open": {"x": int(w * 0.28), "y": int(h * 0.74)},
        "west": {"x": int(PX * 1.2), "y": h // 2},
        "east": {"x": w - int(PX * 1.2), "y": h // 2},
    })
    for i in range(6):
        s.spawn.append({"x": int(w * (i + 1) / 7), "y": int(h * 0.66)})
    return render(s)


def marsh(s: Scene):
    """Reed beds and standing water. Where Fizzwick went into the mud."""
    w, h = s.w, s.h
    s.open_floor = False
    r2 = random.Random(s.seed)
    # Islands of firm ground in a field of water.
    for _ in range(max(6, s.cols * s.rows // 90)):
        cx = r2.randrange(int(PX), w - int(PX))
        cy = r2.randrange(int(PX), h - int(PX))
        s.blob_floor(cx, cy, r2.randint(int(PX * 1.6), int(PX * 3.2)), lobes=7, rng=r2)
    s.floor.append(("poly", [(0, h), (w, h), (w, int(h * 0.86)), (0, int(h * 0.90))]))

    for _ in range(s.cols * s.rows // 18):
        x, y = r2.randrange(w), r2.randrange(h)
        s.decal("line", (x, y, x + r2.randint(-8, 8), y - r2.randint(int(PX * 0.4), int(PX * 0.9)), 4),
                (118, 124, 82), alpha=180)
    for _ in range(5):
        x, y = r2.randrange(w), r2.randrange(h)
        s.solid_circle(x, y, r2.randint(int(PX * 0.3), int(PX * 0.55)), h=1.3, facets=5)

    s.regions.update({
        "firm": {"x": w // 2, "y": int(h * 0.90)},
        "mire": {"x": int(w * 0.44), "y": int(h * 0.46)},
        "reeds": {"x": int(w * 0.72), "y": int(h * 0.30)},
    })
    for i in range(5):
        s.spawn.append({"x": int(w * (i + 1) / 6), "y": int(h * 0.91)})
    return render(s, water="marsh", mist=0.16)


def hills(s: Scene):
    """Rocky upland and a defile. Good ambush country, which is the point."""
    w, h = s.w, s.h
    r2 = random.Random(s.seed)
    # A pass running the long axis, walled by rock on both sides.
    spine = []
    y = h // 2
    for x in range(0, w + PX, PX):
        y = max(int(h * 0.34), min(int(h * 0.66), y + r2.randint(-28, 28)))
        spine.append((x, y))
    for i in range(len(spine) - 1):
        s.decal("line", (*spine[i], *spine[i + 1], int(PX * 3.0)),
                s.palette.floor_light, alpha=130, blur=PX * 0.15)
    for i, (x, y) in enumerate(spine):
        if i % 2:
            continue
        for side in (-1, 1):
            oy = y + side * r2.randint(int(PX * 2.0), int(PX * 3.0))
            if PX // 2 < oy < h - PX // 2:
                s.solid_circle(x, oy, r2.randint(int(PX * 0.6), int(PX * 1.25)), h=2.4, facets=7)
    s.regions.update({
        "pass": {"x": w // 2, "y": spine[len(spine) // 2][1]},
        "high": {"x": int(w * 0.3), "y": int(PX * 1.5)},
        "west": {"x": int(PX * 1.2), "y": spine[1][1]},
        "east": {"x": w - int(PX * 1.2), "y": spine[-2][1]},
    })
    for x, y in spine[2::4]:
        s.spawn.append({"x": x, "y": y})
    return render(s)


def dwarfhall(s: Scene):
    """Maelgoth: a dwarven hall cut square out of the rock, lit by forge-light."""
    w, h, m = s.w, s.h, int(PX * 1.4)
    t = int(PX * 1.0)
    s.rect_floor(m - t, m - t, w - m + t, h - m + t)
    cx = w // 2
    door = int(PX * 1.8)
    s.band(m, m, w - m, m, t)
    s.band(w - m, m, w - m, h - m, t)
    s.band(m, m, m, h - m, t)
    s.band(m, h - m, cx - door, h - m, t)
    s.band(cx + door, h - m, w - m, h - m, t)
    s.door(cx - door, h - m, cx + door, h - m)

    # Square piers, dwarven rather than the Tower's round columns.
    for i in range(4):
        x = int(w * (i + 1) / 5)
        for y in (m + int(PX * 2.8), h - m - int(PX * 2.8)):
            s.solid_rect(x - int(PX * 0.65), y - int(PX * 0.65),
                         x + int(PX * 0.65), y + int(PX * 0.65), h=3.0)
            s.light(x, y - int(PX * 1.0), bright=3, dim=7, colour="#ff9c4a", alpha=0.42)
    # A forge channel down the middle.
    s.decal("rect", (cx - int(PX * 1.1), m + t, cx + int(PX * 1.1), h - m - t),
            (182, 92, 36), alpha=120)
    s.light(cx, h // 2, bright=5, dim=12, colour="#ff7a2a", alpha=0.5)

    s.regions.update({
        "gate": {"x": cx, "y": h - m - int(PX * 1.3)},
        "hall": {"x": cx, "y": h // 2},
        "forge": {"x": cx, "y": m + int(PX * 2.6)},
        "stalls": {"x": m + int(PX * 2.2), "y": h // 2},
    })
    for i in range(5):
        s.spawn.append({"x": cx - PX * 2 + i * PX, "y": h - m - int(PX * 2.6)})
    return render(s, stone=int(PX * 1.4))


BUILDERS.update({
    "river": (river, "river"),
    "riverbank": (riverbank, "river"),
    "aqueduct": (aqueduct, "fortress"),
    "farmland": (farmland, "farmland"),
    "moor": (moor, "moor"),
    "marsh": (marsh, "marsh"),
    "hills": (hills, "hills"),
    "dwarfhall": (dwarfhall, "dwarf"),
})


# ---------------------------------------------------------------------------
# Arcs III to VI — the Tower, the Nightmare, the drowned city and the Abyss
# ---------------------------------------------------------------------------

def nightmare(s: Scene):
    """Silvanesti. A forest remembering being killed, in the wrong colours."""
    w, h = s.w, s.h
    r2 = random.Random(s.seed)
    # Residue pools: memory lying on the ground as a physical thing.
    for _ in range(s.cols * s.rows // 12):
        x, y = r2.randrange(w), r2.randrange(h)
        rr = r2.randint(int(PX * 0.8), int(PX * 2.4))
        s.decal("ellipse", (x - rr, y - rr, x + rr, y + rr), (150, 60, 96), alpha=34,
                blur=PX * 0.35)
    cx, cy = w // 2, h // 2
    cr = int(min(w, h) * 0.15)
    s.decal("ellipse", (cx - cr, cy - cr, cx + cr, cy + cr), s.palette.floor_light,
            alpha=90, blur=PX * 0.3)

    trees = _trees(s, r2, s.cols * s.rows // 10,
                   lambda x, y: (x - cx) ** 2 + (y - cy) ** 2 < cr ** 2,
                   int(PX * 0.4), int(PX * 0.78), int(PX * 1.9), canopy=2.8)
    # Trunks grown through each other, which is what the dream did to them.
    for x, y, rr in trees:
        for _ in range(r2.randint(2, 4)):
            a = r2.uniform(0, math.tau)
            ln = rr * r2.uniform(1.4, 2.6)
            s.decal("line", (x, y, x + math.cos(a) * ln, y + math.sin(a) * ln,
                             max(4, rr // 3)), (72, 40, 70), alpha=200)
    for _ in range(6):
        x, y = r2.randrange(w), r2.randrange(h)
        s.light(x, y, bright=1, dim=4, colour="#c060a0", alpha=0.3)
    s.regions.update(clearing={"x": cx, "y": cy}, edge={"x": cx, "y": h - int(PX * 1.2)},
                     deep={"x": cx, "y": int(PX * 1.2)},
                     village={"x": int(w * 0.26), "y": int(h * 0.3)})
    for i in range(6):
        a = math.tau * i / 6
        s.spawn.append({"x": int(cx + math.cos(a) * cr * 0.6), "y": int(cy + math.sin(a) * cr * 0.6)})
    return render(s, mist=0.22)


def dreampalace(s: Scene):
    """Lorac's dream, built as architecture: nested halls that do not close."""
    w, h = s.w, s.h
    s.open_floor = False
    r2 = random.Random(s.seed)
    cx, cy = w // 2, h // 2
    # Three concentric rings of floor, bridged, none of them quite aligned.
    for i, frac in enumerate((0.44, 0.30, 0.16)):
        rr = int(min(w, h) * frac)
        n = 12
        off = r2.uniform(0, 0.5)
        pts = [(cx + math.cos(math.tau * k / n + off) * rr,
                cy + math.sin(math.tau * k / n + off) * rr) for k in range(n)]
        s.floor.append(("poly", pts))
        if i:
            for k in range(0, n, 3):
                a, b = pts[k], pts[(k + 1) % n]
                s.walls.append([int(a[0]), int(a[1]), int(b[0]), int(b[1])])
    for i in range(6):
        a = math.tau * i / 6
        s.light(cx + math.cos(a) * min(w, h) * 0.22, cy + math.sin(a) * min(w, h) * 0.22,
                bright=3, dim=8, colour="#b0a8ff", alpha=0.4)
    s.regions.update(entry={"x": cx, "y": cy + int(min(w, h) * 0.40)},
                     outer={"x": cx - int(min(w, h) * 0.36), "y": cy},
                     inner={"x": cx, "y": cy - int(min(w, h) * 0.24)},
                     heart={"x": cx, "y": cy})
    for i in range(5):
        s.spawn.append({"x": cx - PX * 2 + i * PX, "y": cy + int(min(w, h) * 0.34)})
    return render(s, stone=int(PX * 1.1))


def crystal(s: Scene):
    """Zhaman's maze: crystal walls that change the route behind you."""
    w, h = s.w, s.h
    s.open_floor = False
    r2 = random.Random(s.seed)
    # A grid of chambers with most, not all, of the links open.
    gx, gy = 5, 4
    cwi, chi = w // gx, h // gy
    cells = []
    for j in range(gy):
        for i in range(gx):
            x0, y0 = i * cwi + int(PX * 0.5), j * chi + int(PX * 0.5)
            x1, y1 = (i + 1) * cwi - int(PX * 0.5), (j + 1) * chi - int(PX * 0.5)
            s.floor.append(("rect", (x0, y0, x1, y1)))
            cells.append(((x0 + x1) // 2, (y0 + y1) // 2))
            for (ax, ay, bx, by) in ((x0, y0, x1, y0), (x1, y0, x1, y1),
                                     (x1, y1, x0, y1), (x0, y1, x0, y0)):
                s.walls.append([ax, ay, bx, by])
    # Open some links, as corridors of floor between neighbours.
    for j in range(gy):
        for i in range(gx):
            k = j * gx + i
            if i + 1 < gx and r2.random() < 0.62:
                a, b = cells[k], cells[k + 1]
                s.floor.append(("rect", (a[0], a[1] - int(PX * 0.7), b[0], a[1] + int(PX * 0.7))))
            if j + 1 < gy and r2.random() < 0.55:
                a, b = cells[k], cells[k + gx]
                s.floor.append(("rect", (a[0] - int(PX * 0.7), a[1], a[0] + int(PX * 0.7), b[1])))
    for k, (x, y) in enumerate(cells):
        if k % 3 == 0:
            s.light(x, y, bright=2, dim=6, colour="#9fe4ff", alpha=0.34)
        if k % 4 == 1:
            s.solid_circle(x, y, int(PX * 0.5), h=2.0, facets=6)
    s.regions.update(entry={"x": cells[0][0], "y": cells[0][1]},
                     middle={"x": cells[len(cells) // 2][0], "y": cells[len(cells) // 2][1]},
                     far={"x": cells[-1][0], "y": cells[-1][1]},
                     laboratory={"x": cells[gx + 1][0], "y": cells[gx + 1][1]})
    for x, y in cells[::4]:
        s.spawn.append({"x": x, "y": y})
    return render(s, stone=int(PX * 0.95))


def ruin(s: Scene):
    """Skullcap: broken halls open to the sky, with the plan still legible."""
    w, h = s.w, s.h
    r2 = random.Random(s.seed)
    t = int(PX * 0.75)
    # Wall runs with gaps: a floor plan that has lost most of its walls.
    for j in range(3):
        y = int(h * (j + 1) / 4)
        x = 0
        while x < w:
            run = r2.randint(int(PX * 2), int(PX * 6))
            if r2.random() < 0.68:
                s.band(x, y, min(x + run, w), y, t, h=2.2)
            x += run + r2.randint(int(PX), int(PX * 2.5))
    for i in range(4):
        x = int(w * (i + 1) / 5)
        y = 0
        while y < h:
            run = r2.randint(int(PX * 2), int(PX * 5))
            if r2.random() < 0.6:
                s.band(x, y, x, min(y + run, h), t, h=2.2)
            y += run + r2.randint(int(PX), int(PX * 2.5))
    for _ in range(s.cols * s.rows // 18):
        x, y = r2.randrange(w), r2.randrange(h)
        s.solid_circle(x, y, r2.randint(int(PX * 0.22), int(PX * 0.5)), h=0.9, facets=5)
    s.regions.update(gate={"x": w // 2, "y": h - int(PX * 1.2)},
                     court={"x": w // 2, "y": h // 2},
                     deep={"x": w // 2, "y": int(PX * 1.4)},
                     corner={"x": int(PX * 1.6), "y": int(PX * 1.6)})
    for i in range(6):
        s.spawn.append({"x": int(w * (i + 1) / 7), "y": h - int(PX * 2.2)})
    return render(s, stone=int(PX * 1.2))


def ship(s: Scene):
    """A deck on the Blood Sea. Planking, masts, rail, and red water beyond."""
    w, h = s.w, s.h
    s.open_floor = False
    r2 = random.Random(s.seed)
    # Hull outline: a long ellipse-ish deck down the middle of the map.
    cx, cy = w // 2, h // 2
    hw, hh = int(w * 0.34), int(h * 0.40)
    n = 28
    pts = []
    for i in range(n):
        a = math.tau * i / n
        taper = 1.0 - 0.45 * abs(math.cos(a)) ** 3
        pts.append((cx + math.cos(a) * hw, cy + math.sin(a) * hh * taper))
    s.floor.append(("poly", pts))
    for i in range(n):
        a, b = pts[i], pts[(i + 1) % n]
        s.walls.append([int(a[0]), int(a[1]), int(b[0]), int(b[1])])

    for mx in (cx - int(hw * 0.4), cx + int(hw * 0.25)):
        s.solid_circle(mx, cy, int(PX * 0.45), h=3.0, facets=7)
    s.solid_rect(cx + int(hw * 0.55), cy - int(PX * 1.6),
                 cx + int(hw * 0.85), cy + int(PX * 1.6), h=1.8)
    for i in range(3):
        s.light(cx - int(hw * 0.6) + i * int(hw * 0.6), cy, bright=2, dim=6,
                colour="#ffb067", alpha=0.4)
    s.regions.update(deck={"x": cx, "y": cy}, bow={"x": cx - int(hw * 0.78), "y": cy},
                     stern={"x": cx + int(hw * 0.7), "y": cy},
                     rail={"x": cx, "y": cy - int(hh * 0.62)})
    for i in range(6):
        s.spawn.append({"x": cx - int(hw * 0.5) + i * int(hw * 0.2), "y": cy + int(PX * 0.8)})
    return render(s, boards=True, water="blood")


def drowned(s: Scene):
    """Istar under the Blood Sea: temple floor, red water, no surface."""
    w, h = s.w, s.h
    s.open_floor = False
    r2 = random.Random(s.seed)
    m = int(PX * 2.0)
    s.floor.append(("rect", (m, m, w - m, h - m)))
    # Collapsed sections open to the water.
    for _ in range(4):
        bx = r2.randrange(m, w - m)
        by = r2.randrange(m, h - m)
        rr = r2.randint(int(PX * 1.2), int(PX * 2.4))
        s.decal("ellipse", (bx - rr, by - rr, bx + rr, by + rr), (46, 14, 20), alpha=225,
                blur=PX * 0.2)
    t = int(PX * 0.8)
    s.band(m, m, w - m, m, t); s.band(w - m, m, w - m, h - m, t)
    s.band(m, h - m, w - m, h - m, t); s.band(m, m, m, h - m, t)
    for i in range(4):
        for j in range(2):
            x = int(w * (i + 1) / 5)
            y = m + int(PX * 2.6) + j * (h - 2 * m - int(PX * 5.2))
            s.solid_circle(x, y, int(PX * 0.62), h=2.6)
            s.light(x, y - int(PX * 0.9), bright=2, dim=6, colour="#ff7a7a", alpha=0.3)
    s.regions.update(nave={"x": w // 2, "y": h // 2},
                     altar={"x": w // 2, "y": m + int(PX * 1.8)},
                     entrance={"x": w // 2, "y": h - m - int(PX * 1.2)},
                     vault={"x": int(w * 0.24), "y": int(h * 0.7)})
    for i in range(5):
        s.spawn.append({"x": int(w * (i + 1) / 6), "y": h - m - int(PX * 2.0)})
    return render(s, stone=int(PX * 1.25), water="blood")


def battlefield(s: Scene):
    """A field being fought over: churned ground, earthworks, fire, bodies."""
    w, h = s.w, s.h
    r2 = random.Random(s.seed)
    # Earthworks across the middle, with gaps the fighting flows through.
    y = int(h * 0.44)
    x = 0
    while x < w:
        run = r2.randint(int(PX * 3), int(PX * 7))
        if r2.random() < 0.72:
            s.band(x, y + r2.randint(-30, 30), min(x + run, w), y + r2.randint(-30, 30),
                   int(PX * 0.9), h=1.8)
        x += run + r2.randint(int(PX * 1.2), int(PX * 3))
    for _ in range(s.cols * s.rows // 10):
        px, py = r2.randrange(w), r2.randrange(h)
        rr = r2.randint(PX // 6, int(PX * 0.9))
        s.decal("ellipse", (px - rr, py - rr, px + rr, py + rr), (34, 28, 22), alpha=70)
    for _ in range(6):
        fx, fy = r2.randrange(w), r2.randrange(h)
        s.solid_circle(fx, fy, int(PX * 0.4), h=0.5)
        s.light(fx, fy, bright=4, dim=10, colour="#ff7a32", alpha=0.55)
    for _ in range(s.cols * s.rows // 24):
        px, py = r2.randrange(w), r2.randrange(h)
        s.decal("line", (px, py, px + r2.randint(-40, 40), py + r2.randint(-40, 40), 6),
                (120, 40, 34), alpha=130)
    s.regions.update(line={"x": w // 2, "y": y}, rear={"x": w // 2, "y": h - int(PX * 1.5)},
                     advance={"x": w // 2, "y": int(PX * 1.5)},
                     flank={"x": int(PX * 1.5), "y": h // 2})
    for i in range(7):
        s.spawn.append({"x": int(w * (i + 1) / 8), "y": h - int(PX * 2.5)})
    return render(s)


def abyss(s: Scene):
    """The Abyss. Not dark — wrong. Ground that is almost ground."""
    w, h = s.w, s.h
    s.open_floor = False
    r2 = random.Random(s.seed)
    # Islands of something like rock, at no consistent scale.
    isles = []
    for _ in range(max(5, s.cols * s.rows // 110)):
        cx = r2.randrange(int(w * 0.14), int(w * 0.86))
        cy = r2.randrange(int(h * 0.14), int(h * 0.86))
        rr = r2.randint(int(PX * 1.8), int(PX * 4.0))
        s.blob_floor(cx, cy, rr, lobes=8, rng=r2)
        isles.append((cx, cy))
    for i in range(len(isles) - 1):
        ax, ay = isles[i]; bx, by = isles[i + 1]
        dx, dy = bx - ax, by - ay
        ln = math.hypot(dx, dy) or 1
        nx, ny = -dy / ln * PX * 0.7, dx / ln * PX * 0.7
        s.floor.append(("poly", [(ax + nx, ay + ny), (bx + nx, by + ny),
                                 (bx - nx, by - ny), (ax - nx, ay - ny)]))
    for i, (x, y) in enumerate(isles):
        s.regions[f"island{i + 1}"] = {"x": x, "y": y}
        s.spawn.append({"x": x, "y": y})
        s.light(x, y, bright=2, dim=7, colour="#ff6a4a", alpha=0.36)
        for _ in range(2):
            s.solid_circle(x + r2.randint(-PX, PX), y + r2.randint(-PX, PX),
                           r2.randint(int(PX * 0.35), int(PX * 0.7)), h=2.2, facets=6)
    s.regions.update(arrival={"x": isles[0][0], "y": isles[0][1]},
                     centre={"x": w // 2, "y": h // 2},
                     throne={"x": isles[-1][0], "y": isles[-1][1]})
    return render(s, mist=0.2)


BUILDERS.update({
    "nightmare": (nightmare, "nightmare"),
    "dreampalace": (dreampalace, "dream"),
    "crystal": (crystal, "crystal"),
    "ruin": (ruin, "ruin"),
    "ship": (ship, "ship"),
    "drowned": (drowned, "drowned"),
    "battlefield": (battlefield, "battlefield"),
    "abyss": (abyss, "abyss"),
})
