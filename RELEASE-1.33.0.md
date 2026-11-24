# 1.33.0 — The Vingard Road

You were right that 22 maps was thin. This adds the road the Crows are actually on.

**36 scenes now**: Arc I, Arc II, and fourteen locations along **Ispin's second route through central Solamnia** — the journey the campaign has been playing rather than the arc that abstracts it.

## The Vingard Road

Arc II describes the journey as three interchangeable "route thresholds". That is the right level for a book and the wrong one for a table that is on the water this week. These are the specific places, in travel order, chaining into *The Forest of Wayreth*:

| | |
|---|---|
| **The Vingard · Funeral Reach** | Where Ispin's boat was burned, and the crows first came down on the bar |
| **Solamnic Plain · The Open Crossing** | A mile of nothing and five standing stones. Where the carriage came apart |
| **The Dwarf-Road · The Defile** | The pass to Maelgoth. Bends twice, so nobody sees end to end |
| **Maelgoth · The Gate Hall** | Forge-channel, trade stalls, the boatwrights who built the folding boat |
| **The Toll Station** | A real toll, false collectors, a family behind a nailed door, and a ledger with a second column |
| **The Ambush Camp** | Open ground, three fires, no cover. Where Kattal died |
| **The Scarecrow Fields** | Four strips, a barn, and four useless scarecrows. The company is named for this |
| **The Mudflats** | Where a wild surge put Fizzwick waist-deep and shouting |
| **The Fishing Platform** | The collapsing stage, Banthar on the wrong end of it, crows in the nets |
| **The Broken Aqueduct** | Two fallen spans and darkmantles that do not need to make their own dark |
| **The Vingard · South Bank** | **Where you are now.** Night camp, the boat drawn up, the wyvern out of the cloud |
| **The Vingard · The Run South** | Fast water, boulders in the channel, the boat as the floor |
| **The Waystation** | A river inn. One long room and whoever else is going the same way |
| **Riverlanding** | Wharf, market, and a militia sergeant writing down where people are going |

Each gets its map, its pins, and its player cards. **51 new handouts**, written for these four characters at this point in the story — the bank they are camped on, the boat they had built in Maelgoth, the crow that followed Clipper out of the scarecrow fields.

They hang off a new journal, **The Vingard Road — Central Solamnia**, which records what happened at each place and keeps its DM notes where DM notes belong: the red-robed mage still unaccounted for, Harmony's reticence, the spared goblins' legitimate grievance, Kelrar's second offer.

## Eight new map archetypes

The engine had no water at all, which is awkward for a river route. It does now:

- **river** — banks both sides, gravel bars, boulders in the channel, shallows where the water meets land
- **riverbank** — water along one edge, shingle landing, scrub and driftwood
- **marsh** — islands of firm ground in standing water, reeds, mist
- **aqueduct** — stone channel, fallen spans, a drop
- **farmland** — crop strips, hedgerows, a barn, four scarecrows
- **moor** — open plain, scattered rock, a line of standing stones
- **hills** — a defile that bends, with climbable high ground either side
- **dwarfhall** — square piers and a forge channel, which is not how the Tower builds

Twenty-one archetypes in total.

## Two bugs worth naming

**The bank polygon was a bow tie.** `riverbank` listed its corners either side of the reversed waterline, which crosses the polygon over itself — both riverbank maps rendered as a blue X. Fixed and re-rendered.

**The geometry file was packaged away.** Walls and pin anchors come out of the map builders, and the build directory holding them is deleted before packaging, so rebuilding scenes without re-rendering was impossible. `tools/make-maps.py --geometry-only` now recovers walls, lights and regions in seconds by stubbing the renderer, since a builder declares its geometry before it draws anything.

## Honest about what is still missing

- **No wyvern in the bestiary.** Your current fight is against a creature the module does not have a stat block for, so the South Bank scene ships with no token on it. Say the word and it gets one, scarred and festival-decorated.
- **Arcs III to VI are still not here.** That is ~90 more scenes, and it is content rather than engineering now.
- **The maps are good to run, not beautiful.** Scale, walls and light are right; boulders and tree trunks are uniform circles. The grove and the open-country maps are the weakest. Name the ones that bother you at the table and I will rework those archetypes.

## Also

- `IMPORT_VERSION` 32, so an existing world picks the scenes up on the next GM load.
- Carries the Astinus rebuild from 1.31.0, which was never tagged.
- 8.9 MB of maps, 35 generated.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update and load the world as GM.
