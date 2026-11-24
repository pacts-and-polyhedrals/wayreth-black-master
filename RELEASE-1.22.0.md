# 1.22.0 — Player reference journals for the legacy items

One journal per legacy item, written for the player who carries it, generated from the same definitions the items are built from.

## What's new

Six new journals, each **6 pages**:

| Journal | For |
|---|---|
| **Alice — The Crown of Little Wonders** | Alice |
| **Solanthis — Ispin's Promise** | Solanthis |
| **Jinx — The Coin That Lands Sideways** | Jinx |
| **Sylas — The Shepherd's Lantern** | Sylas |
| **Clipper — The Wayfarer's Knot** | Clipper |
| **Kattal — Ispin's Unmoving Nail** | Kattal |

Each one carries:

1. **Quick Reference** — the charge table by level, the Legacy Save DC spelled out, a level-by-level list of what unlocks when, anything on that particular item that is not automatic, and a note on how advancement actually works.
2. **Levels 3–5 — Dormant**, **6–9 — Awakened**, **10–14 — Exalted**, **15+ — Legendary** — one page per state, each opening with its rarity, charge count, recovery and the moment that wakes the item, then every feature with a stat line above the rules text.
3. **Playing It Well** — five practical tips and five rulings per item, written for the questions each one will actually raise at the table.

## Generated, not transcribed

The point of doing it this way is that a reference sheet cannot drift from the item it describes.

- Every cost line — action type, charges, rest limit, duration, concentration, save DC — is **read back off the built activity**, not written out a second time. Change an item and rebuild, and the journal follows.
- Where a feature's heading is not what the activity is called on the sheet, the journal prints the activity's real name too, so a player can match the page to the buttons in front of them.
- Roll-data references are spelled out for readers: `(@prof)d6` prints as "1d6 necrotic per proficiency bonus", `2 * @classes.sorcerer.levels` as "temporary hit points equal to twice your sorcerer level".
- Damage riders state their damage rather than "no cost", so Jinx's *Push Your Luck — The Bill* reads "No action — 2d6 psychic".

The validator enforces all of it. The build fails if a feature on an item is missing from its journal, if a feature appears on the wrong state's page, if the charge table disagrees with the real one, if a page is too short to be useful, or if a raw `@` reference leaks into player-facing prose.

## Ownership

The six install **visible to the whole party**, because a module cannot know which of your players is which Crow. If you would rather each player saw only their own, open each journal's ownership and set that one player to Observer with Default at None — nothing else changes. **The Crow Legacies** GM journal now says so, and points at the six.

## Under the hood

- Each `scripts/lib/legacy-*.mjs` now exports its definition as well as the finished item, so the journal builder reads the same object the item is built from.
- Every feature heading in those files is now explicitly either backed by named activities or marked passive — `true`, `conditional`, `effect` or `manual`. The build refuses to run if a heading matches no activity, or if an activity belongs to no heading, which is what would otherwise let a feature quietly vanish from the reference.
- New `scripts/build-legacy-journals.mjs`; `statLine`, `costLabels` and the block renderer moved into the shared library.
- `IMPORT_VERSION` 20 → 21. Journal totals: 25 → **31 managed journals**, 316 → **352 pages**.
- Validator at **298 written assertions**, most of them inside per-item and per-activity loops.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update the module and load the world as GM; the six journals install themselves and appear for players immediately. GM-edited pages are still never overwritten.
