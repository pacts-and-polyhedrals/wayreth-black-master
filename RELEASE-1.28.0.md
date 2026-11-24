# 1.28.0 — The robe spells, measured

Ninety spells written for this campaign, never checked against the game they sit in. Nineteen of them were weaker than published spells of a *lower* level.

## How they were judged

Not from memory. Every offensive spell in dnd5e's SRD compendium was read and its average damage computed, then the robe spells were ranked inside their own level band:

| | L0 | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **SRD lower quartile** | 4.5 | 3.5 | 7.0 | 13.5 | 10.5 | 21.0 | 31.5 | 38.5 | 14.0 | 7.0 |
| **SRD median** | 4.5 | 10.5 | 8.0 | 21.5 | 18.0 | 22.5 | 35.0 | 42.0 | 42.0 | 22.0 |

Damage only settles the spells that deal damage. The rest were held to one falsifiable test:

> **A spell is underpowered if a published SRD spell of equal or lower level does the same job as well or better.**

That test is what every change below is keyed to. It also decided what to leave alone — a spell that merely looked unusual, or whose value is narrative rather than numeric, stayed as written.

## Changed

**Two cantrips were describing the wrong dice.** Cinder Lash and Grave Whisper both roll d8s and both said the damage "increases by 1d8 at 5th level **(2d6)**, 11th level **(3d6)**, and 17th level **(4d6)**". Now (2d8), (3d8), (4d8).

| Spell | Lvl | Was | Now | Measured against |
|---|---:|---|---|---|
| **Borrowed Vitality** | 1 | 2d6, temp HP half the damage | **3d6**, temp HP equal to the damage | *inflict wounds* — 3d10 at the same touch range |
| **Kindled Resolve** | 1 | advantage vs frightened, 1d6+mod temp HP once | **immunity** to frightened, **2d6+mod** temp HP that **refreshes** when spent, +1 target per slot | *heroism* — immunity plus temp HP every turn |
| **Harvest the Fallen** | 3 | 3d8+mod temp HP | **4d8+mod** | *false life* upcast to 3rd — ~16.5 with no kill to wait for |
| **Death's Due** | 6 | 3d8 **costing your reaction** each round | **4d8**, **no reaction**, still once per round | *spirit guardians* — 3d8 a turn to a whole radius, at 3rd |
| **Raistlin's Wheel of Flame** | 6 | 4d6 rising to 8d6 | **6d6 rising to 12d6** | *wall of fire* — 5d8 from round one, at 4th |
| **Silence the Defiant** | 6 | save again every turn | save again **only on a turn it took damage** | *silence* — 2nd level, no save at all |
| **Mindspin** | 7 | 4d8; damage gave an **advantaged** escape save | **6d8**; the escape save loses advantage | *hold monster* — paralysis at 5th with no damage-triggered save |
| **Edict of the Black Moon** | 7 | 6 creatures, **one** action | **8 creatures**, obeying **for the duration**; recommand as a bonus action | *mass suggestion* — 12 creatures, 24 hours, no concentration, at 6th |
| **Soul Chain** | 7 | no damage; target cannot heal | **9d8 necrotic**, half on a save; binding unchanged | *Grave Whisper* — this module's own **cantrip** stops healing |
| **Exsanguinate Memory** | 8 | 8d8 | **10d8** | *finger of death* — 61 average at 7th |
| **Palace Between Moments** | 8 | 8 hours, 50 occupants | **24 hours, 100**, furnished and provisioned | *magnificent mansion* — 24 hours, 100 people, staffed, at 7th |
| **Mindspin, Greater** | 9 | 6d8 | **8d8** | its own 7th-level form, which now hits for 6d8 |
| **Convergence of Three Roads** | 9 | three doors, **same plane** | three doors, **any planes you have visited** | *teleportation circle* at 5th, *teleport* at 7th |
| **Reverse Death** | 9 | dead ≤ **1 hour**, 1 hp, 3 exhaustion, willing souls only | dead ≤ **10 days**, **10d8+mod hp**, **2** exhaustion, **unwilling souls compelled** on a failed Charisma save, poison and nonmagical disease neutralised | *raise dead* at 5th did nearly all of this; *resurrection* at 7th reaches back a century |

**Lunitari's Exchange moved from 7th level to 4th.** It swaps six willing creatures around the battlefield, which is a 4th-level job done well rather than a 7th-level job done badly — *dimension door*, at 4th, teleports two creatures 500 feet. Repricing it is the honest fix; inflating a repositioning trick would not have been. The Red Robe spellbook page moved with it, and Justarius still prepares it.

## Two spells that read correctly and did nothing

These are the worst kind of bug: the sheet is right, the table is wrong.

- **Chain of Embers** described a second creature taking 2d8 on a Dexterity save. No activity existed to roll it, so 9 of its 27 average damage was decoration. It now has an **Ember Leap** activity.
- **Transfer Essence** stated the donor takes "2d6 necrotic per level of the slot" and its activity carried **no damage at all**. The transferred slot is chosen at the table, not derived from the casting slot, so no single formula can see the choice — it now has **one activity per slot level**, 2d6 through 10d6, named for the slot being handed over.

## Left alone, on purpose

- **Nuitari's Hook** (cantrip, 3.5) sits under the quartile and should. *Vicious mockery* charges a cantrip for 1d4 and disadvantage on one attack; the hook deals 1d6 and stops the target backing away.
- **Tyrant's Brand, Curse the Magi** and the other concentration spells measure low per instance because they fire every round. Over three rounds — about how long concentration survives — all clear their level's floor comfortably.
- **The seven ward spells at 7th level** — *Song of Day's Clarity*, *Vision of Dusk's Eye*, *Whisper of Dawn's Song*, *Touch of Guiding Light*, *Kiss of Night's Guardian*, and alongside them *Consensus* and *Perfect Witness* — are narrow for their level by design. They are keys to specific places and specific scenes, and being expensive is what stops a 9th-level party walking into the Shoikan Grove on a whim. **If your table reaches those groves before 13th level, say so and I will drop the wards to 3rd or 4th** — they are gates, not power, and the level is doing narrative work rather than mechanical work.

## Guarding it

Two standing assertions, both confirmed by breaking them:

**A damage floor.** The SRD lower quartile at each level, carried forward so it never falls — most published 8th- and 9th-level spells deal no damage at all, so their raw quartiles collapse to figures a 3rd-level spell beats. A spell below its floor fails the build by name:

```
Sable Cataclysm deals 13.5 average damage, below the 38.5 floor
for a level 8 spell
```

Concentration spells are measured over three rounds, and a spell claiming that allowance must actually require concentration.

**Text and activities must agree.** Every saving throw and every damage expression a spell's description names is checked against what its activities can roll:

```
Chain of Embers describes 2d8 fire damage that no activity rolls
```

Two saves are excused by name, both rolled by somebody other than the activity's target: Curse the Magi's Constitution save belongs to the cursed creature each time it tries to cast, and Reverse Death's Charisma save is made for a soul that is not on the board.

## Also

- `IMPORT_VERSION` 28 → 29, so existing worlds pick the retuned spells up on the next GM load.
- The multi-activity count is pinned per spell, so an accidental duplicate still fails.
- No creature's statistics changed, and no caster's prepared list changed.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update and load the world as GM.

Spells already on a sheet are **updated in place, not duplicated** — character and NPC copies are matched by key, replaced with the retuned version, and keep both their prepared state and any flags other modules wrote on them. Lunitari's Exchange will move from the 7th-level section of a spellbook to the 4th.
