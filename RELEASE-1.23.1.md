# 1.23.1 — Bestiary organised by type and CR

The complete illustrated bestiary is now organised consistently in the full module.

## Asset structure

Portraits and tokens are grouped by D&D creature type:

- Aberration
- Beast
- Dragon
- Fiend
- Humanoid
- Plant
- Undead

Within each folder, filenames begin with a fixed-width CR value, so normal filename sorting places the creatures in ascending challenge order. Example:

```text
assets/bestiary/Dragon/CR01.00_01_Baaz_Draconian.webp
assets/bestiary/Dragon/CR02.00_20_White_Dragon_Wyrmling.webp
assets/bestiary/Dragon/CR24.00_31_Gold_Dragon_Ancient.webp
```

`assets/tokens/` mirrors the same directory structure exactly.

## Module integration

- All 78 Actor portrait paths were updated.
- All 78 prototype-token paths were updated.
- Journal portrait references and the illustrated bestiary were updated.
- `build-creatures.mjs` now discovers portrait art recursively.
- `make-tokens.py` now preserves the type folders when rebuilding tokens.
- Content validation now verifies creature type folders, CR filename prefixes, portrait/token path parity, and all 156 bestiary assets.
- Import version increased to 24 so existing worlds refresh managed journals that contain portrait paths.

No creature statistics, campaign prose, spells, items, tracker logic, calendar behavior, or adventure content changed in this release.
