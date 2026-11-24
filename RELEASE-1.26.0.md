# 1.26.0 — The casters have their spells

Fourteen creatures described a spell list and had none assigned. A Wizard of High Sorcery arrived with slots on the sheet and nothing to put in them.

## What was wrong

Spell slots were never the problem — dnd5e derives those from the caster level the module already set. What was missing was the spells themselves: not one spell Item on any of the 81 creatures.

| Caster | Level | Spells |
|---|---:|---:|
| Raistlin Majere, Master of Wayreth | 20 | 14 |
| Fistandantilus | 20 | 8 |
| Par-Salian of the White Robes | 17 | 9 |
| Ladonna of the Black Robes | 16 | 8 |
| Justarius of the Red Robes | 15 | 7 |
| Dalamar Argent | 12 | 7 |
| Mereth Sorn, Renegade | 10 | 7 |
| Knight of the Rose | 9 | 8 |
| Dragonarmy Battle Mage | 9 | 15 |
| Renegade Hunter | 9 | 6 |
| Aurak Draconian | 9 | 8 |
| Bozak Draconian | 5 | 9 |
| Knight of the Sword | 5 | 9 |
| Ossian Krell | 5 | 9 |

**124 spell references, 64 distinct spells.**

## Read from the stat block, resolved from the system

The lists were already written out in prose, so that prose is where they come from — the same approach the saving throws and breath weapons use. `scripts/lib/spellcasting.mjs` reads each list and records it on the actor; the installer resolves the names against **dnd5e's own spell compendium** at install time and embeds real spells.

That means complete, system-maintained spells with working attack rolls, saves and scaling, and no reason for this module to own 64 spell descriptions it did not write.

Three list shapes appear in the bestiary and all three are handled:

- **Prepared with slots** — *"Prepared: guidance, sacred flame; 1st (4 slots) bless, cure wounds; 2nd (3) aid"*
- **Innate** — *"At will: misty step. 3/day each: fear. 1/day each: wall of fire"*, which becomes at-will and per-day uses
- **Notable** — a selection with no slot breakdown, as the archmages use

The parser matches **"Notable"** before **"prepared"** deliberately. Raistlin's list opens *"Notable prepared spells:"*, and read the other way round it would have filed *time stop* and *wish* as cantrips.

Two paladin spells — **Crusader's Mantle** and **Holy Weapon** — are not in the SRD, so the module carries its own, written for this campaign and resolved before the system packs.

## Checkable before it ships

The installer reports any name it cannot resolve, with a notification rather than a silent skip, because a missing spell is invisible on a stat block that still describes it.

That is the last line of defence, not the first. `scripts/lib/srd-spell-names.json` records the 329 spell names dnd5e's SRD pack ships, so **the build fails on a name nothing can supply** — a typo in a roster is caught here rather than discovered at the table. It also asserts that every `<em>` spell name in a stat block came through the parser, that a caster level never exists without a list, and that a list never exists without a spellcasting ability.

## Two findings along the way

**Ossian Krell was a 5th-level caster with no spells.** The ability and caster level were set, so his sheet showed 5th-level slots he could not fill. He is Dracart's former apprentice with expertise in Arcana, so the casting was clearly intended — he now has a list built entirely around getting away: *disguise self*, *invisibility*, *misty step*, *nondetection*, *shield*. Nothing offensive, which is what the rest of his stat block already says about him. **This is content I added rather than found; change it freely.**

**Lord Soth's Multiattack offered a spell he could not cast** — *"three longsword attacks, or two and casts a spell"*, with no spellcasting anywhere on him. Rather than invent a spell list for a death knight who does not have one, the line now reads *"or two and uses Hellfire Orb or Banshee Wail"*, which are the magical actions he does have.

## Also

- `IMPORT_VERSION` 26 → 27, so existing worlds pick the spells up on the next GM load.
- Attached spells are tagged, so a reinstall replaces them rather than stacking duplicates.
- Validator at **423 written assertions**.
- No creature's statistics changed. Krell's spell list and Soth's Multiattack wording are the only content edits.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update and load the world as GM. The spells come from `dnd5e.spells`, which ships with the system; if a future system build drops it the lookup falls back to the 2024 pack, and anything still unresolved is named in a notification.
