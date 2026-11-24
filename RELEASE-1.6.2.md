# Wayreth: The Black Master — v1.6.2

## Original presentation restored

This release restores the original Wayreth visual language while retaining the v1.6.1 spell-library and Staff of Magius functionality.

- `styles/wayreth.css` is restored byte-for-byte from the original module.
- The added robe-specific `wy-white`, `wy-red`, `wy-black`, `wy-spell`, and `wy-muted` presentation layer has been removed.
- All 90 spell Item descriptions now use only the original Wayreth classes: `wayreth-journal`, `wy-lead`, `wy-table`, `wy-quote`, and the original heading hierarchy.
- Spell descriptions are spaced like the original magic items: lead text, **Spell Details**, **Effect**, and an inset archive note rather than a compressed stat block.
- White, Red, and Black spellbook journal pages are separated into level sections, each with its own original-style table, instead of one crowded ten-level catalogue table.
- Original Cinzel / EB Garamond typography, dark parchment background, gold text hierarchy, crimson section headings, quotations, tables, paragraph spacing, and DM-secret treatment are unchanged.

## Functionality retained

- 90 robe spells: 30 White, 30 Red, 30 Black.
- Cantrip through 9th-level coverage for all three Orders.
- 31 converted legacy High Sorcery spells.
- Item Directory spell folders plus three visible robe spell compendia.
- Visible Wayreth magic-item compendium.
- Full artifact-grade Staff of Magius with 10 activities and Raistlin's awakened properties.
- v1.6.2 increments the journal import version so an existing world refreshes its managed pages to the restored presentation automatically.

## Validation

Static validation passes for all 90 spells and 30 magic items. The release also verifies that `styles/wayreth.css` is byte-identical to the original uploaded module stylesheet.
