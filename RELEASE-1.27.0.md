# 1.27.0 — The Orders cast their own magic

The module ships 90 robe spells across the three Orders. Until now not one of them reached a single caster.

## What was wrong

1.26.0 resolved every NPC spell list against dnd5e's SRD compendium and the two paladin spells the module carries. It never looked at `content/spells.json`. Two consequences, and the second is worse than the first:

- **No wizard prepared a single Order spell.** The Conclave cast *counterspell* and *fireball* like anybody else, in a campaign whose entire premise is that the three Orders have distinctive magic.
- **The lookup would have failed on one.** Had a stat block named *Raistlin's Wheel of Flame*, the installer would have reported it unresolvable and skipped it — the module's own spell, invisible to the module's own resolver.

The resolver now loads `content/spells.json` alongside `npc-spells.json`, both ahead of the system packs, so an Order spell resolves to the module's version of it.

## Who prepares what

Seven Wizards of High Sorcery, each with four spells from their own Order, at levels their caster level reaches. These sit alongside the standard spells their stat blocks already named — Order magic is what they have *as well*, not instead.

| Wizard | Order | Prepared |
|---|---|---|
| **Raistlin Majere** | Black | Raistlin's Wheel of Flame · Soul Chain · Sable Cataclysm · Final Dominion |
| **Fistandantilus** | Black | Transfer Essence · Soul Chain · Exsanguinate Memory · Reverse Death |
| **Par-Salian** | White | Oath of Clarity · Prism of Spellturning · Perfect Witness · Aegis of the Three Moons |
| **Ladonna** | Black | Curse the Magi · Death's Due · Edict of the Black Moon · Exsanguinate Memory |
| **Justarius** | Red | Equilibrium Gate · Wayreth's Moving Door · Lunitari's Exchange · Mirror of Possible Selves |
| **Dalamar Argent** | Black | Grave Whisper · Umbral Burst · Sable Edict · Death's Due |
| **Mereth Sorn** | Black | Blackflame Dart · Blood Scent · Harvest the Fallen · Starless Lance |

**180 spell references across 14 casters**, up from 124.

Two choices worth naming, both easy to reverse:

**Raistlin does not prepare *Reverse Death*.** He is a 20th-level wizard who could, and the campaign is about whether he will. Making it a slot he has filled answers the question the campaign exists to ask. **Fistandantilus does** prepare it — he is the one who already cheated death, and he is offering.

**Mereth Sorn keeps her Order's spells though she is renegade.** Losing sanction costs a Wizard of High Sorcery the Conclave's protection and the moons' favour, not the spells they learned. Her list is her Order's, at a renegade's level.

## Three casters deliberately left alone

- **Renegade Hunter** — a Conclave agent whose Order the stat block never states. Tell me which and they can have it.
- **Dragonarmy Battle Mage** — *"Renegades, mostly"*, by their own description. Outside the Orders is the point of them.
- **Ossian Krell** — Dracart's apprentice, so Black-Robe-trained, but a fugitive who has not cast anything ambitious in four months. His evasion list stands unless you want the training showing.

## Guarding it

The parser records which Order a group belongs to, and the validator asserts **every Order spell belongs to that wizard's Order** — a White Robe holding a Black Robe spell now fails the build, by name:

```
Par-Salian of the White Robes is a White Robe but prepares "death's due",
which is a Black Robe spell
```

It also checks that each of the seven has an Order group, that nobody outside the seven has one, that every Order spell is genuinely one of the module's 90, and that the installer loads them. Confirmed by breaking it.

## Also

- `IMPORT_VERSION` 27 → 28, so existing worlds pick the Order spells up on the next GM load.
- No creature's statistics changed; this is spell assignment only.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update and load the world as GM. Order spells come from the module itself, so they resolve whether or not the SRD packs are present.
