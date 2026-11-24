# 1.32.0 — The campaign on maps

Arc I and Arc II are playable from the scene list. Twenty-two scenes, each with its map, its walls, its lighting, a journal pin on every beat, the right creatures already standing on it, and a player handout for each pin that sends to chat.

## What arrives

| | |
|---|---:|
| Scenes, in two arc folders | **22** |
| Generated battle maps | **21** (the Ansalon map you already had is the 22nd) |
| Journal pins, each opening its own beat | **76** |
| Wall segments, derived from the maps rather than traced | **3,978** |
| Light sources | **72** |
| Pre-placed bestiary tokens | **11** |
| Player handout cards | **76** |
| Added to the module | **5.0 MB** |

Scenes chain. Each one knows the one it leads to, and a button in the Notes toolbar walks you along: **Vogler → the festival → the forest → the Hall of Mages → the Night of the Eye → the Test → the Master's Chamber → the road → …** through to the Grove opening onto the Tower of Palanthas.

## Maps that are places, not textures

There are about a hundred scenes in the finished campaign. Hand-painting that is not realistic and licensing art for a private module is not either, so the maps are generated — but generated as rooms.

`tools/archetypes.py` declares geometry for each kind of place the campaign visits: where the floor is, what is solid, where light comes from. It never paints a pixel. `tools/maplib.py` rasterises that declaration in the order a scene actually resolves — floor, ambient occlusion, cast shadow, bevelled masses, light pools, grade. Thirteen archetypes so far: tower hall, tower chamber, grove, forest, road, camp, village, city, interior, library, fortress, cavern, and the void the Test of High Sorcery hangs over.

**The walls come out of the same declaration that drew the picture.** Nothing is traced over a finished image, because traced walls always drift from the art by a few pixels and a GM finds out mid-combat. Each map is seeded from its scene id, so rebuilding the module reproduces the same room rather than reshuffling one you have already put tokens on.

Two passes were thrown away getting here. The first painted decoration onto a flat floor: invisible walls, columns reading as dots, one value corner to corner. The second filled solid masses with their shadow colour, so every column in the Tower came out as a hole in the floor. What fixed it was occlusion — darkening the floor wherever it meets mass — and painting masses with their **lit top face**, which is most of what you see looking straight down at a column.

## Pins, and what a player is allowed to see

Every session page's beats are pins on the map they happen on. Click one and the session page opens at that beat. Four beats in the Shoikan Grove are four pins in one grove, which is what they always were.

The handouts are the other half, and they are **authored, not extracted**. Every session page has the same seven sections and three of them are the answer key — Tracker Guidance, What Can Be Learned, Narrative Thread. There is no way to generate a player card from GM prose without leaking the reasoning, so all 76 cards are written separately: what the Crows see, hear, and can act on.

The separation is structural rather than careful:

- GM text lives in the journals. Player text lives in `content/handouts.json`. They are different documents.
- `sendHandout()` reads the handout file and nothing else. The validator asserts that function never touches `game.journal`, a `JournalEntry`, or any `.pages` — if someone later makes it "helpfully" pull from the session page, the build fails.
- Every handout is checked **against the actual GM prose**: any run of eight or more words appearing in both fails the build. So does a card that mentions a DC, a tracker, or the GM.

In play: click the scroll icon in the Notes toolbar, pick a beat, players get the card.

## Also in this release: Astinus

**1.31.0 was never tagged.** Your tags stop at v1.30.0 and the live build still had Astinus of Palanthas at CR 0 with 30 hit points — while his own trait said he *"cannot be killed by any means available to the party."* A Dragonarmy Recruit kills him in three rounds with a shortbow.

He is now CR 26, AC 21, 335 hit points, immune to all thirteen damage types and all fourteen conditions, and he **automatically succeeds on every saving throw** — immunity alone left a 7th-level *banishment* able to remove him from his own library. He casts eight knowledge spells at will at DC 26, every one of which looks at the past or the present. He deliberately has no divination that reaches the future, and the build fails if one is ever added.

His portrait and token are renamed `CR26.00_60_Astinus_of_Palanthas.webp`. Two checks from that work run across all 81 creatures: hit points must match the hit dice that produce them (his were 130 out), and a stated innate save DC must be the one the sheet derives. The second re-derived all eleven dragon DCs from 1.30.0 independently and agreed with every one.

## Honest about where this is

- **Arcs III to VI are not here yet.** The machinery is generic — a scene is a row in `scripts/lib/scene-plan.mjs` plus its handouts — so the remaining four arcs are content rather than engineering. That is roughly 90 more scenes and 200 more cards, and it ships arc by arc.
- **The maps are good enough to run, not beautiful.** They have correct scale, real walls, working light and a focal point. They do not have hand-painted detail, and a few archetypes — the grove especially — are more legible than they are atmospheric. Say which ones bother you at the table and I will rework those archetypes rather than polishing all thirteen blind.
- **Tokens arrive hidden**, so loading a scene in front of the players does not show them the encounter. Reveal them yourself.
- **Your own work is never overwritten.** A reinstall refreshes pins and flags on a scene you already have; it does not touch tokens you moved or drawings you made. A full rebuild is available behind the directory button.

## Also

- `IMPORT_VERSION` 31 → 32, so existing worlds pick the scenes up on the next GM load.
- New: `npm run build:scenes`, `npm run validate:scenes`, and `tools/make-maps.py`.
- No spell, item or creature changed except Astinus.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update and load the world as GM. Scenes install after the journals and the bestiary, because their pins point at the first and their tokens at the second.
