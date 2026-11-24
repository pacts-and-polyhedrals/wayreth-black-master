# 1.21.0 — The Crow Legacies

Six legacy items, one bound to each player character, built as real dnd5e Items whose features unlock as their bearer levels.

## What's new

**Six legacy items**, in a new compendium — **Wayreth — Crow Legacy Items**:

| Bearer | Item | Identity | Charges recover |
|---|---|---|---|
| Alice | The Crown of Little Wonders | Creative problem-solving | dawn |
| Solanthis | Ispin's Promise | Preparation and protection | dawn |
| Jinx | The Coin That Lands Sideways | Push-your-luck magic | dawn |
| Sylas | The Shepherd's Lantern | Knowledge at a price | **dusk** |
| Clipper | The Wayfarer's Knot | Navigation and rescue | dawn |
| Kattal | Ispin's Unmoving Nail | Physical protection | dawn |

Each carries all four states — Dormant (Uncommon, levels 3–5), Awakened (Rare, 6–9), Exalted (Very Rare, 10–14) and Legendary (15+) — as **66 level-gated activities** across the six items.

**The Crow Legacies** journal (3 pages): the four states and charge table, the Legacy Save DC, what Foundry handles automatically, the two manual exceptions, every awakening trigger, and per-item balance and interaction notes.

## How the levelling works

This is the part worth knowing, because it is not a macro and there is nothing to swap.

- **One Item per character.** No Dormant/Awakened/Exalted/Legendary duplicates to hand out and delete, and no `@UUID` chain between tiers. The item a Crow receives at 3rd level is the item they still have at 20th.
- **Features appear at the level they are earned.** Every activity carries `visibility.level.min`, which dnd5e checks against the owning character's level in `Activity#canUse`. Below its band a feature is not on the sheet at all, so a player is never looking at something they cannot use yet.
- **Superseded features disappear.** Where a later state replaces an earlier one — Solanthis' *Not Them* absorbing Calculated Intervention, Jinx's spell-bending becoming the proficiency-bonus version, Contingency becoming Grand Contingency, Alice's Make-Believe growing — the old version carries a `max` so the two never both show.
- **The charge pool resizes itself** at levels 6, 10 and 15: 3 → 5 → 7 → 9. It is one level expression in `uses.max`, built from `min`/`max` rather than a ternary, because dnd5e strips ternaries out of that field on migration.
- **Recovery changes with the pool.** Dormant and Awakened refill completely; Exalted regains 1d6 + 1 and Legendary 1d8 + 1. A bigger pool refills more slowly, which is the intended trade. dnd5e applies only one recovery profile per period, so the tier switch lives inside the formula.
- **The Legacy Save DC** — 8 + proficiency bonus + primary ability modifier — comes off the character sheet. For the four casters it resolves from whatever their spellcasting ability actually is; Clipper's is Wisdom and Kattal's is Strength.
- **Costs are real.** Jinx's Push Your Luck and All In each ship their psychic bill as a separate damage activity, and Sylas' Forbidden Inquiry and Let Me Understand consume Hit Dice directly.

## Two things you do by hand

Both are named in the journal and in the item text:

- **Clipper's Sure Footing** ships as a switched-off effect on the item. A climbing speed cannot gate itself on level the way a charge pool can, so enable it in the Effects tab when the Knot awakens. Its name says which level.
- **Sylas' Not Yet** has no automatic recovery at all, because it recharges after seven days rather than on a rest. Once he has actually brought someone back, clear the use a week later. A `day` period would have handed it back six days early, so it deliberately has none.

Kattal's carrying capacity does gate itself: it lands on one of dnd5e's formula fields, so a single effect carries ×4 from level 6 and ×8 from level 15.

## Also in this release

- `content/legacy-items.json`, built by `scripts/build-legacy-items.mjs` from one source file per character, with the shared chassis in `scripts/lib/legacy.mjs`.
- The build refuses to write unless the charge table evaluates correctly at every level a legacy item can be held at, every tier has at least one reachable feature, and every enum, gate boundary and consumption target is valid.
- `scripts/validate-content.mjs` grew to **271 assertions**, including a formula audit: every `@` reference in all 170 generated formulas is checked against dnd5e's own substitution regex, so nothing silently resolves to 0.
- The installer refuses to import a legacy item whose activities have no level gate, rather than quietly handing a 3rd-level character its Legendary powers.
- `IMPORT_VERSION` 19 → 20. Existing worlds pick up the new journal and compendium on the next GM load; GM-edited pages are still never overwritten.
- Journal totals: 24 → **25 managed journals**, 313 → **316 pages**.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update the module and load the world as GM; the legacy compendium and journal install themselves. If the compendium is ever empty, the GM now gets an error notification naming the reason rather than a silent console line.
