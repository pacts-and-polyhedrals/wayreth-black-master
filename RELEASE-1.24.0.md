# 1.24.0 — The stat blocks work

Every saving throw, damage roll and recharge written into a creature's rules is now a real activity on its sheet. The bestiary is organised by creature type and ascending challenge.

## The problem

Every creature's rules were written out in its text, and that was all they were. A dragon's breath weapon described a DC and 12d6 of fire; the sheet offered nothing to click, the ability never recharged, and nothing rolled. Of 439 items across the bestiary, only the weapons had working mechanics.

Measured before the fix:

| Gap | Count |
|---|---:|
| Saving throws written in text with no save activity | 88 |
| Recharge abilities that never recharged | 27 |
| Damage expressions that rolled nothing | 62 |
| Creatures affected | 46 of 78 |

## The fix

The mechanics are now derived from the text that already states them, in `scripts/lib/statblock.mjs`. A feature that says *"must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage on a failed save, or half as much on a success"* produces a save activity at DC 21 against Dexterity, 18d6 fire, half on a success — because that is what the sentence says.

**Nothing here invents a number.** Every DC, die and damage type comes from the sentence a GM would read aloud, so no creature's capabilities changed; they just became usable.

Also derived:

- **Recharge.** `Recharge 5–6` gives the item a single use and a recharge roll, and the activity spends it. Breath weapons now behave like breath weapons.
- **Templates.** A 90-foot cone, a 60-foot line 5 feet wide, or "within 15 feet" becomes a placeable measured template, so a breath weapon drops its own cone.
- **Activation.** A feature's section decides how it is used — legendary actions cost the right number of actions, reactions are reactions, and a trait that recharges is an action rather than a passive, which also puts breath weapons under Actions on the sheet where they belong.
- **Riders on attacks.** A slam that knocks prone keeps its attack *and* gains the save, as two activities on one weapon.

The result: **223 working activities**, up from the weapons alone.

## Two real content bugs found on the way

**Eight dragons dealt no damage with their wings.** The adult and ancient Wing Attack read *"or take bludgeoning damage"* with no dice at all — the save fired and the damage was zero. It is invisible unless you go looking. All eight now deal 2d6 plus the dragon's own Strength modifier, derived from the stat block rather than typed in, which matches the Monster Manual and the young dragons that were already correct.

**Thirteen creatures had no Multiattack.** Eleven dragons from the extended roster — every adult, every ancient, and the young brass, bronze and copper — plus the Knights of the Crown and Sword, while their own siblings all had one. Their action economy was simply wrong. The five low-CR troops that still have none keep it: a CR 1/2 guard with a spear and a crossbow chooses, it does not do both.

## Organised by type, then challenge

The bestiary now reads as a ladder:

| Type | Creatures | CR | Weakest → strongest |
|---|---:|---|---|
| Aberration | 2 | 9–13 | Dream of the Fallen → Lorac's Remnant |
| Beast | 1 | 1 | Forest Wolf Pack Leader |
| Dragon | 32 | 1–24 | Baaz Draconian → Red Dragon, Ancient |
| Fiend | 7 | 4–18 | — |
| Humanoid | 26 | 0–21 | — |
| Plant | 2 | 6–7 | — |
| Undead | 8 | 4–22 | — |

- **The compendium** gets a folder per creature type, set to manual sorting so ascending CR is what the browser actually obeys rather than re-alphabetising the contents. On Foundry v10 the folders are skipped and the creatures install sorted at the pack root.
- **The illustrated bestiary** is rebuilt as seven plates, one per type, each running weakest to strongest.
- **The stat-block journal's** table is regenerated to match.

Draconians sit on the Dragon ladder, which is correct for Krynn: they are what became of stolen dragon eggs.

## Guarding it

The validator now checks **agreement** rather than mere presence, because a derived DC that drifts from the written one is worse than no DC at all — nobody would notice. For every creature it asserts that each written saving throw exists as an activity with the same DC and ability, each recharge has a matching pool that something spends, each damage expression rolls the same dice and type, damage promised in prose is never left unquantified, multi-attack creatures have Multiattack or are on the documented exception list, and the type-then-CR order holds in the compendium and on every plate.

Each of those was confirmed by breaking it deliberately and watching the build fail.

## Also

- `IMPORT_VERSION` 24 → 25, so existing worlds pick up the working stat blocks and the folders on the next GM load.
- Journal totals: **32 managed journals / 360 pages** (the illustrated bestiary went from 13 plates to 8).
- No campaign prose, spell, item, tracker, calendar or adventure content changed.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update the module and load the world as GM. Creatures already placed in scenes keep the stat block they were dropped with — re-drag them from the compendium to pick up the working version.
