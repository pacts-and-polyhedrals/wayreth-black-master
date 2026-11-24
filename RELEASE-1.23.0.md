# 1.23.0 — The bestiary is illustrated

All 78 creatures now have their own art, on the sheet and on the canvas.

## What's new

**Every creature has a portrait and a token.** Each Actor in **Wayreth — Bestiary** carries a 1024×1536 portrait on its sheet and a 512×512 token on the map. Drag one onto a scene and it arrives looking like itself.

**Tokens are sized from the creature's own size entry**, in grid squares:

| Size | Squares | Count |
|---|---|---:|
| Medium and smaller | 1×1 | 47 |
| Large | 2×2 | 15 |
| Huge | 3×3 | 11 |
| Gargantuan | 4×4 | 5 |

So a Baaz draconian occupies one square and an ancient red dragon occupies sixteen, without anyone resizing anything. Tokens also default to hostile disposition with a hit-point bar.

**The Wayreth Bestiary: Illustrated** — a new journal of thirteen pages: an index, then one plate per group. Each entry shows the art with the numbers worth knowing before you commit to an encounter — CR, AC, hit points, size and type. Right-click any plate to show it to players.

| Plate | Creatures | Plate | Creatures |
|---|---:|---|---:|
| Draconian | 5 | Nightmare | 3 |
| Dragonarmy | 5 | Undead | 4 |
| Dragon | 7 | Wayreth | 3 |
| Dragon (Chromatic) | 10 | The Road | 3 |
| Dragon (Metallic) | 8 | Named | 15 |
| Solamnia | 8 | | |
| Abyssal | 7 | | |

Portraits also appear on the stat-block pages that are about specific creatures: Raistlin, the four Conclave leaders, the Guardian of the Tower and the Renegade Hunter, and Raistlin again on **The Master in Residence**.

## Tokens are padded, not cropped

The portraits are full-body figures on transparent backgrounds. Two obvious ways to make tokens from them are both wrong: using a portrait directly squashes the figure into the square grid cell, and cropping to a square cuts a standing figure off at the waist.

`tools/make-tokens.py` pads each portrait out to a square on transparent pixels instead, then scales it down. The figure keeps its proportions, fills the cell vertically, and sits centred — which is what a token is supposed to look like, and why these sit cleanly on a map rather than arriving in a box.

```bash
python3 tools/make-tokens.py assets/bestiary
```

## Matched by name, not by position

The art set is numbered 01–78 in bestiary order, but nothing relies on that. `scripts/build-creatures.mjs` matches each file to a creature by normalising both names, and refuses to write if any creature has no art or any art file has no creature. The numbering agreeing with the order was then checked separately, as confirmation rather than as the mechanism.

The validator goes further and checks that each portrait's filename still normalises to its creature's name, so a renamed or reordered art set cannot silently shuffle the portraits onto the wrong creatures. It also checks that every image referenced anywhere in any managed journal points at a file that actually ships.

## A stale page, fixed

**The Bestiary Compendium** page in the stat-block journal still said *"Thirty-six creatures ship as real Actor documents"* and listed nine groups. That was written before the bestiary grew to 78 across twelve groups, and had been wrong for several releases. Its table is now generated from `content/creatures.json`, and the validator asserts the stated count matches the real one and that every group appears.

## Size

The module is now about **41 MB**, up from 1 MB, which is the art. Portraits are 34 MB and tokens 6.6 MB, all WebP with transparency.

## Also

- `IMPORT_VERSION` 22 → 23, so existing worlds pick up the art and the new journal on the next GM load.
- Journal totals: 31 → **32 managed journals**, 352 → **365 pages**.
- New `npm run build:creatures` and `npm run build:gallery`.
- Nothing about any creature's stats changed — only art, tokens and the pages describing them.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update the module and load the world as GM. Existing Actors in the bestiary compendium are replaced on the version bump, so the art arrives automatically; Actors already placed in scenes keep whatever they had, and are easiest to re-drag.
