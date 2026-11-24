# 1.25.0 — The abyssal wyrms

Three things older than the Dragonarmies, at CR 25, 26 and 27. The first creatures in the bestiary with lair actions.

| Wyrm | Species | CR | AC | HP |
|---|---|---:|---:|---:|
| **Vaelzhar, the Unremembered** | Rauwend Nullwyrm | 25 | 22 | 546 |
| **Nythravel, the Upward Shadow** | Shadowsky Spirewyrm | 26 | 23 | 585 |
| **Kharzoryx, the Blue Pyre** | Voorz'zt Coldfire Wyrm | 27 | 23 | 615 |

They sit at the top of the Dragon folder above the ancient dragons, each with its own art, a six-square token, three lair actions on initiative 20, four legendary actions and five Legendary Resistances. Those last two are the in-lair figures, as the exports intend; met outside its lair, drop a wyrm to three and four.

The bestiary is now **81 creatures**.

## The audit

The exports are good. Saves and damage are written with dnd5e's own roll enrichers, every described DC already had a matching save activity with the right ability, recharges were wired, and the hit points sit exactly in band for their challenge (21.8–22.8 hp per CR, against 20.9–22.8 for the module's ancient dragons). Four findings, two of them real:

**Every activity ID was 12 characters.** All 40 of them. Foundry's `DocumentIdField` accepts exactly 16 alphanumeric characters and nothing else, so these would have failed validation on import and taken their activities with them — a wyrm with no breath weapon and no lair actions. IDs are regenerated deterministically from each activity's own identity, so they stay stable across rebuilds.

**Two features described a saving throw that never rolled one.** *Forgotten Assault* and *Blueflame Step* were exported as plain utility activities: the text promised a DC and the sheet offered a button that did nothing. Both are now save activities, with the DC, ability, dice and damage type taken from each feature's own written rules. The repair refuses to apply if that text ever changes, rather than silently papering over a different feature.

**`uses.spent` was null** in several places where the schema wants a number. Harmless on a good day.

**No module metadata** — no source, no flags, placeholder art. They would have been invisible to the type ordering, the illustrated bestiary and the art checks.

Not defects, worth recording: the exports use the modern nested `senses.ranges` shape while the rest of the bestiary uses the flat one that dnd5e migrates on load, and `ac.calc: "natural"` against the module's `"flat"`. Both pairs work.

## Kept as exports, not rewritten

The three are the only creatures not built from compact roster definitions, deliberately. Their damage and saves use dnd5e's roll enrichers, their lair actions are real activities rather than prose, and rewriting them into roster shape would have been a downgrade. The exports live verbatim in `scripts/lib/wyrms/`; `scripts/lib/roster-abyssal-wyrms.mjs` normalises them and says why, line by line. Their statistics, text and activities are untouched.

Their six-square tokens are kept too. Size now sets the floor rather than the exact figure, because a creature can be drawn larger on purpose — and these are meant to dwarf the ancient dragons sharing their folder.

## The validator learned to read enrichers

The stat-block checks added in 1.24.0 only understood prose, so a statblock written as `[[/save wis 25 format=long]]` slipped past them entirely. They now expand dnd5e's roll enrichers to the sentence they render before checking, which means a stat block written either way is held to the same standard — and that is what caught both non-rolling saves.

The "damage promised with no dice" check now also judges a phrase in context, so *"the wyrm **would** take Fire or Cold damage"* reads as the trigger it is while *"or take bludgeoning damage"* still fails.

New assertions cover the wyrms specifically: three lair actions each, the lair resource on initiative 20, the in-lair legendary figures, 2014 source, the Dragon folder, and that no 12-character activity ID ever creeps back in on a re-export. Confirmed by breaking each one.

**`assets/bestiary/INDEX.csv` is now generated** from the actors. It was a static file, which meant it went stale the moment a creature was added — it had been describing a 78-creature bestiary.

## Also

- `IMPORT_VERSION` 25 → 26.
- The AC sanity band was 10–22, which was right while ancient dragons were the ceiling. It is 10–24 now.
- The illustrated bestiary's Dragon plate runs to 35 entries, ending on Kharzoryx.
- Validator at **399 written assertions**.
- No campaign prose, spell, item, tracker or calendar content changed.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update and load the world as GM. Lair actions need the GM to run them on initiative 20; dnd5e tracks the resource but does not take the turn for you.
