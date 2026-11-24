# 1.34.0 — All six arcs

**87 scenes.** Every beat the module describes now has a map, a pin and a player card.

| | 1.32.0 | 1.34.0 |
|---|---:|---:|
| Scenes | 22 | **87** |
| Generated maps | 21 | **86** |
| Journal pins | 76 | **351** |
| Player handout cards | 76 | **351** |
| Wall segments | 3,978 | **11,922** |
| Lights | 72 | **341** |
| Map archetypes | 13 | **29** |

It chains end to end: Vogler → the festival → the forest → the Hall of Mages → the Test → the Master's Chamber → the war road → Palanthas → the Shoikan Grove → the Tower of High Sorcery → Silvanesti → Zhaman → Istar → the Portal → the two sieges → the Abyss. Plus the Vingard Road running alongside it.

## What arcs III to VI got

**Arc III — the Tower (16 scenes, 69 pins).** The dead wizard's study, three archives that disagree about the same year, the old city underneath the new one, the Grove as four fears, the servants' gate, the Hall of Silence, a Conclave still in session after three centuries, a dormitory running the same morning on a loop, the forbidden library, the chamber of echoes, Rannoch's sanctum, Fistandantilus's laboratory, an observatory that files six futures without comment, the necromantic vault, the lower seals, and Raistlin walking in through the Grove without slowing down.

**Arc IV — the three components (13 scenes, 53 pins).** The road into Silvanesti, the Nightmare, Lorac's dream palace, Cyan's rehearsal, the Plains of Death, Zhaman's crystal maze, the Unbroken Hour, Skullcap, the Blood Sea crossing, the Chamber of Eyes, the drowned temple, and the Bell.

**Arc V — the Black Host (12 scenes, 53 pins).** The portal chamber, the city deciding how it feels about a Black Robe saving it, the first Returned, the Returned in the street, Wayreth under assault, the High Clerist twice, Kitiara's demand, Soth at a threshold he need not cross, and Caramon asking for his sword.

**Arc VI — the Abyss (10 scenes, 49 pins).** Fistandantilus's claim, Wayreth's Archive of Futures and its blind spot, two simultaneous sieges, Caramon's own voice at last, the crossing, the Field of Lost Names, the Palace of Chains, the Past and Present, and Takhisis.

## Sixteen new archetypes

Eight for the Vingard Road in 1.33.0 — **river, riverbank, marsh, aqueduct, farmland, moor, hills, dwarfhall** — and eight more here:

- **nightmare** — Silvanesti, in the wrong green, with memory lying on the ground
- **dreampalace** — nested rings that do not close, bridged, none quite aligned
- **crystal** — Zhaman's maze as a grid where most links are open and the rest are not
- **ruin** — Skullcap: wall runs with gaps, a floor plan that has lost most of its walls
- **ship** — a tapered deck on the Blood Sea, masts, rail, red water beyond
- **drowned** — Istar's temple floor with sections collapsed open to the sea
- **battlefield** — earthworks with gaps, churned ground, fires, and what fires leave
- **abyss** — islands of almost-ground over nothing, bridged, lit wrong

## How the pins stay honest

Every scene's beat count is **checked against its journal page**. A session that gains or loses a beat fails the build rather than quietly dropping a pin:

```
zhaman-crystal-maze / Session 7: The Crystal Maze: journal has 4 beats,
plan pins 3
```

All 351 cards are authored, not extracted, and all 351 are checked against the GM prose — a run of eight or more words appearing in both fails the build, as does a card mentioning a DC or a tracker. `sendHandout()` still cannot read a journal, and the validator still asserts it.

## Also fixed

**`--geometry-only`.** Walls and pin anchors come out of the map builders, and the build directory holding them is deleted before packaging, so rebuilding scenes meant re-rendering 86 maps. A builder declares its geometry before it draws anything, so stubbing the renderer recovers all of it in seconds.

**Arc II no longer ends the campaign.** The Grove chained to nothing; it now chains into Arc III, and the only terminal scene is the return from the Abyss.

## Still honest about

- **No wyvern.** Your current fight is against a creature the module has no stat block for. The South Bank scene ships with an empty map until you want one.
- **The maps are good to run, not beautiful.** Scale, walls and light are correct everywhere. Boulders and trunks are uniform circles, and the Abyss and the open-country maps are flatter than the interiors. Name the ones that bother you at the table and I will rework those archetypes rather than polishing twenty-nine blind.
- **20.8 MB of maps**, which is less than one photographic battle map would have cost.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. `IMPORT_VERSION` 32. Scenes install after the journals and the bestiary. Scenes you have already edited keep your tokens and drawings.
