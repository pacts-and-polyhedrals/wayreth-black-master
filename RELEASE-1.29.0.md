# 1.29.0 — Every caster's full loadout

A 20th-level archmage listed fourteen spells. A wizard of that level prepares twenty-seven and keeps a spellbook of forty-four.

Thirteen stat blocks named a representative handful each, which is a perfectly normal way to write an NPC — and the wrong one for a campaign where the Conclave is the antagonist and the party will fight the same archmage across two arcs. This release gives every defined caster a complete 2014-style loadout.

## What they have now

| Caster | Level / ability | Prepared was | Prepared now | Official + Wayreth | Cantrips | Spellbook |
|---|---|---:|---:|---:|---:|---:|
| **Bozak Draconian** | 5 / INT 15 | 6 | **7** | 7 + 0 | 3 → 4 | 14 |
| **Ossian Krell** | 5 / INT 17 | 6 | **8** | 6 + 2 | 3 → 4 | 14 |
| **Knight of the Sword** | 5 / WIS 16 | 7 | **8** | 8 + 0 | 2 → 4 | — |
| **Dragonarmy Battle Mage** | 9 / INT 18 | 11 | **13** | 13 + 0 | 4 → 4 | 22 |
| **Renegade Hunter** | 9 / INT 17 | 6 | **12** | 12 + 0 | 0 → 4 | 22 |
| **Knight of the Rose** | 9 / CHA 18 | 8 | **13** | 13 + 0 | 0 → 0 | — |
| **Mereth Sorn, Renegade** | 10 / INT 18 | 11 | **14** | 10 + 4 | 0 → 5 | 24 |
| **Dalamar Argent** | 12 / INT 18 | 10 | **16** | 12 + 4 | 1 → 5 | 28 |
| **Justarius of the Red Robes** | 15 / INT 20 | 11 | **20** | 14 + 6 | 0 → 5 | 34 |
| **Ladonna of the Black Robes** | 16 / INT 20 | 12 | **21** | 15 + 6 | 0 → 5 | 36 |
| **Par-Salian of the White Robes** | 17 / INT 21 | 13 | **22** | 16 + 6 | 0 → 5 | 38 |
| **Raistlin Majere** | 20 / INT 24 | 18 | **27** | 18 + 9 | 0 → 5 | 44 |
| **Fistandantilus** | 20 / INT 25 | 12 | **27** | 18 + 9 | 0 → 5 | 44 |
| **Total** | | 131 | **208** | 162 + 46 | 13 → **55** | 320 |

**404 spell Items** across the bestiary, up from 124. The Aurak Draconian is unchanged: its magic is innate, fixed by its trait rather than by a preparation budget.

## The rule, so it can be argued with

Every number above comes from one formula, applied to each Actor's own listed caster level and casting ability:

**Prepared leveled spells = caster level + ability modifier**, minimum 1. Cantrips are separate and come from the class. A wizard's spellbook benchmark is 6 at 1st level plus 2 per level after — what a wizard gains for free, before anything copied from a scroll.

An NPC is not a player character with every class feature, and shorter lists are a legitimate design choice. This release simply stops the defined casters being short by accident. No unstated domain, oath or Signature Spells trait is invented for anyone.

Two readings worth naming:

- **The Knight of the Rose is a 9th-level Charisma full caster**, as the stat block already said — not a 9th-level paladin, who would prepare 8 and could not touch 4th- or 5th-level magic at all. Its existing *holy weapon* is kept, and the 13-spell figure is the module's own level-plus-ability benchmark.
- **The Knight of the Sword uses the cleric budget**, 5 + 3 = 8, because the stat block already described a Wisdom full caster.

## Spellbooks are owned, not prepared

The 133 reserve spells install **unprepared**. They sit on the sheet so the wizard can swap to them after a long rest, and they do not read as something castable right now. Cantrips install as always prepared.

This is why Justarius has *mindspin* and *palace between moments* in his book and neither in his hands: he is a Red Robe who has studied them, on a day he chose mobility instead.

## Four corrections found on the way

- **Mereth Sorn prepared *finger of death*.** It is a 7th-level spell on a 10th-level wizard, who tops out at 5th — she could never have cast it. Replaced with *blight*.
- **"17th-level wizard" read as no caster level at all.** The parser only recognised "Nth-level spellcaster", so five of the archmages recorded no level, and nothing derived their slots. It now reads wizard, cleric and caster too.
- **The Aurak Draconian was a 9th-level caster with no leveled spells**, so the sheet offered nine levels of slots with nothing to put in them. Its caster level is 0 now; its innate list is untouched.
- **Ossian Krell's Black-Robe training was in the fiction and not on the sheet.** He is Dracart's apprentice, so he now has two Order spells — *blood scent* and *feign life*. His prepared magic stays non-offensive and built around getting away, which is what the rest of his stat block says about him.

## One source for prose and sheet

The Spellcasting text a GM reads used to be hand-written, and the spells on the sheet were parsed back out of it. Edit one side and the other silently disagreed.

`scripts/lib/caster-loadouts.mjs` now holds every loadout as data and **renders** the stat block text from it. The stat block and the attached spells are the same list by construction. Each caster also gets a **Spellbook** trait of its own rather than a fourth paragraph of Spellcasting — Fistandantilus knows forty-nine spells, and printed as one block they are a wall to read past mid-combat.

## Guarding it

Four standing assertions, each confirmed by breaking it:

```
Mereth Sorn, Renegade: "finger of death" is a level 7 spell, above the
5th-level ceiling of a 10th-level caster

Par-Salian of the White Robes prepares 21 leveled spells; a 17th-level
caster with INT 21 prepares 22

Par-Salian of the White Robes is a White Robe but carries "death's due",
which is a Black Robe spell
```

1. **The preparation budget** — every caster prepares exactly caster level + ability modifier, computed from the Actor's own ability score.
2. **The slot ceiling** — nothing prepared or scribed exceeds what the caster's level allows, checked against the real level of all 319 SRD spells and the module's own 90. `scripts/lib/srd-spell-names.json` now carries levels, not just names.
3. **Order magic is the Order's**, in the spellbook as much as in the day's preparations — a reserve is still a spell the wizard had to be taught.
4. **The caster level in the text matches the sheet**, so the "17th-level wizard" parse bug cannot return.

The totals are pinned too: 208 prepared, 133 reserves, 55 cantrips.

## Also

- `IMPORT_VERSION` 29 → 30, so existing worlds pick the loadouts up on the next GM load.
- No creature's hit points, AC, attacks or CR changed. This is spells only.
- Every spell still resolves at install time — Wayreth magic from the module's own 90, everything else from dnd5e's SRD pack, with anything unresolvable named in a notification rather than skipped silently.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update and load the world as GM. Spells attached from a stat block are rebuilt on each install, so nothing stacks up; spells on a player's sheet keep their prepared state and any flags other modules wrote on them.
