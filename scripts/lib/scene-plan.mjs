/**
 * Where the campaign happens.
 *
 * The arc journals describe 71 sessions and 280 beats, but a beat is not a
 * place — "Refusal" and "Correction" happen in the same room as "The Request".
 * Four beats in the Shoikan Grove are four pins in one grove, not four groves.
 *
 * So this file maps the campaign onto *locations*: one scene per place the
 * party stands in, each carrying a journal pin for every beat that happens
 * there. A GM drops the party on the scene, and the beats are book icons on
 * the map in the order they come up.
 *
 * Each scene declares:
 *   id         file and lookup key; also seeds the map generator, so an id is
 *              not safe to rename once a GM has placed tokens on the scene
 *   archetype  which builder in tools/archetypes.py draws it
 *   cols/rows  size in 5-foot squares
 *   pins       [{ session, beat, at }] — `at` is a named region of the map
 *   tokens     bestiary actors to place, resolved by name at install time
 *   next       the scene this one normally leads to, for navigation
 *
 * Arc I and Arc II are complete here. Arcs III to VI follow the same shape and
 * are added arc by arc.
 */

export const ARC_FOLDERS = [
  { key: "arc-one", name: "Arc I · The Road to Wayreth", journal: "arc-one" },
  { key: "arc-two", name: "Arc II · The Black Master's Errand", journal: "arc-two" },
  { key: "arc-three", name: "Arc III · The Spire of Lore and Doom", journal: "arc-three" },
  { key: "arc-four", name: "Arc IV · The Long Return", journal: "arc-four" },
  { key: "arc-five", name: "Arc V · The Black Host", journal: "arc-five" },
  { key: "arc-six", name: "Arc VI · The Abyss", journal: "arc-six" },
  // The road the Crows are actually on, rather than the arc that abstracts it.
  { key: "vingard", name: "The Vingard Road · Central Solamnia", journal: "vingard-road" }
];

/** Darkness levels, so a night scene arrives dark rather than needing setting. */
const DAY = 0;
const DUSK = 0.4;
const NIGHT = 0.75;
const UNLIT = 0.9;


// ---------------------------------------------------------------------------
// The Vingard Road — Ispin's second route, through the centre of Solamnia
//
// Arc II treats the journey as three interchangeable "route thresholds",
// which is the right level for a book and the wrong one for a table that is
// actually on the river. These are the places the Crows have passed through
// and are about to, drawn from the campaign so far: Vogler to the Vingard, the
// dwarf-road to Maelgoth, the ambush country beyond it, and the river south.
//
// They hang off their own journal rather than an arc page, because this is a
// record of a specific journey and not a session plan.
// ---------------------------------------------------------------------------
const VINGARD = [
  {
    id: "vingard-funeral-reach",
    arc: "vingard",
    name: "The Vingard · Funeral Reach",
    archetype: "river", cols: 40, rows: 26, darkness: 0.3,
    summary: "The slow water below Vogler where Ispin's boat was burned and set adrift. Wide, shallow at the bars, and the first water the company travelled together.",
    pins: [
      { session: "Funeral Reach", at: "south", label: "The launching" },
      { session: "Funeral Reach", at: "channel", label: "The boat goes downstream" },
      { session: "Funeral Reach", at: "sandbar", label: "The bar where the crows gathered" }
    ],
    next: "vingard-wilds-crossing"
  },
  {
    id: "vingard-wilds-crossing",
    arc: "vingard",
    name: "Solamnic Plain · The Open Crossing",
    archetype: "moor", cols: 40, rows: 30, darkness: 0,
    summary: "Open country between the river and the dwarf-road. Nothing to hide behind for a mile in any direction, which cuts both ways.",
    pins: [
      { session: "The Open Crossing", at: "stones", label: "The standing stones" },
      { session: "The Open Crossing", at: "open", label: "Carriage ground" },
      { session: "The Open Crossing", at: "east", label: "On toward the hills" }
    ],
    next: "vingard-defile"
  },
  {
    id: "vingard-defile",
    arc: "vingard",
    name: "The Dwarf-Road · The Defile",
    archetype: "hills", cols: 42, rows: 28, darkness: 0,
    summary: "The pass down to Maelgoth. Good ambush country, and everyone who uses it knows that, including the people who use it for ambushes.",
    pins: [
      { session: "The Defile", at: "pass", label: "The narrow" },
      { session: "The Defile", at: "high", label: "The high ground" },
      { session: "The Defile", at: "east", label: "The gate road" }
    ],
    next: "maelgoth-gate"
  },
  {
    id: "maelgoth-gate",
    arc: "vingard",
    name: "Maelgoth · The Gate Hall",
    archetype: "dwarfhall", cols: 34, rows: 26, darkness: 0.55,
    summary: "The underground city's outer hall: forge-channel down the middle, stalls along the walls, and the boatwrights who built the folding boat.",
    pins: [
      { session: "Maelgoth", at: "gate", label: "Arrival and the gate toll" },
      { session: "Maelgoth", at: "stalls", label: "Supplies and the commission" },
      { session: "Maelgoth", at: "forge", label: "The folding boat" },
      { session: "Maelgoth", at: "hall", label: "The lizards, and Nigel" }
    ],
    next: "vingard-toll-station"
  },
  {
    id: "vingard-toll-station",
    arc: "vingard",
    name: "The Toll Station",
    archetype: "road", cols: 40, rows: 24, darkness: 0.35,
    summary: "A bar across the road, a hut behind it, and a family locked in the back of it. The toll is real; the collectors are not.",
    tokens: [
      { actor: "Hill Brigand", at: "roadside" },
      { actor: "Hill Brigand", at: "roadside", offset: [1, 1] },
      { actor: "Hill Brigand", at: "middle", offset: [-1, 0] }
    ],
    pins: [
      { session: "The Toll Station", at: "west", label: "The bar across the road" },
      { session: "The Toll Station", at: "roadside", label: "The hut" },
      { session: "The Toll Station", at: "middle", label: "The captives" },
      { session: "The Toll Station", at: "east", label: "What the ledger shows" }
    ],
    next: "vingard-ambush-camp"
  },
  {
    id: "vingard-ambush-camp",
    arc: "vingard",
    name: "The Ambush Camp",
    archetype: "camp", cols: 32, rows: 28, darkness: 0.7,
    summary: "Where the red-robed mage and the elves came back. Open ground, three fires, and no cover worth the name once the Fireball lands.",
    pins: [
      { session: "The Ambush", at: "centre", label: "The trade" },
      { session: "The Ambush", at: "perimeter", label: "Where they came back from" },
      { session: "The Ambush", at: "fire", label: "The Fireball" }
    ],
    next: "vingard-scarecrow-fields"
  },
  {
    id: "vingard-scarecrow-fields",
    arc: "vingard",
    name: "The Scarecrow Fields",
    archetype: "farmland", cols: 38, rows: 28, darkness: 0,
    summary: "A farmer, a crop, and too many crows. The company is named for this going wrong once already.",
    pins: [
      { session: "The Scarecrow Fields", at: "gate", label: "The farmer's problem" },
      { session: "The Scarecrow Fields", at: "scarecrow", label: "Standing in the field" },
      { session: "The Scarecrow Fields", at: "barn", label: "The barn" },
      { session: "The Scarecrow Fields", at: "track", label: "The crow that stayed" }
    ],
    next: "vingard-mudflats"
  },
  {
    id: "vingard-mudflats",
    arc: "vingard",
    name: "The Mudflats",
    archetype: "marsh", cols: 34, rows: 28, darkness: 0.2,
    summary: "Reed, standing water and mud that holds. Where a wild surge put a halfling waist-deep and shouting.",
    pins: [
      { session: "The Mudflats", at: "firm", label: "Firm ground" },
      { session: "The Mudflats", at: "mire", label: "Sinking" },
      { session: "The Mudflats", at: "reeds", label: "What was following" }
    ],
    next: "vingard-fishing-platform"
  },
  {
    id: "vingard-fishing-platform",
    arc: "vingard",
    name: "The Fishing Platform",
    archetype: "riverbank", cols: 34, rows: 26, darkness: 0.25,
    summary: "A collapsing stage out over the water with an old knight on the wrong end of it, and crows in the nets below.",
    pins: [
      { session: "The Fishing Platform", at: "water", label: "The platform" },
      { session: "The Fishing Platform", at: "landing", label: "Getting a line to him" },
      { session: "The Fishing Platform", at: "camp", label: "Banthar" },
      { session: "The Fishing Platform", at: "treeline", label: "The blue thread" }
    ],
    next: "vingard-aqueduct"
  },
  {
    id: "vingard-aqueduct",
    arc: "vingard",
    name: "The Broken Aqueduct",
    archetype: "aqueduct", cols: 44, rows: 22, darkness: 0.85,
    summary: "A Solamnic water-channel with two spans fallen in. Dark enough inside that the darkmantles do not need to make their own.",
    pins: [
      { session: "The Broken Aqueduct", at: "west", label: "Going in" },
      { session: "The Broken Aqueduct", at: "breach", label: "The first breach" },
      { session: "The Broken Aqueduct", at: "channel", label: "Darkness, and what is in it" },
      { session: "The Broken Aqueduct", at: "east", label: "Harmony" }
    ],
    next: "vingard-south-bank"
  },
  {
    id: "vingard-south-bank",
    arc: "vingard",
    name: "The Vingard · South Bank",
    archetype: "riverbank", cols: 36, rows: 26, darkness: 0.8,
    summary: "Where the Crows are now. Night camp on the southern bank, the folding boat drawn up, and a wyvern in the cloud above it.",
    pins: [
      { session: "South Bank", at: "camp", label: "The camp" },
      { session: "South Bank", at: "landing", label: "The boat" },
      { session: "South Bank", at: "water", label: "It comes out of the cloud" },
      { session: "South Bank", at: "treeline", label: "Cover, such as it is" }
    ],
    next: "vingard-river-south"
  },
  {
    id: "vingard-river-south",
    arc: "vingard",
    name: "The Vingard · The Run South",
    archetype: "river", cols: 44, rows: 24, darkness: 0.2,
    summary: "Open river below the camp, running toward the Wayreth country. Boat travel, with boulders in the channel and no bank worth landing on.",
    pins: [
      { session: "The Run South", at: "upstream", label: "Casting off" },
      { session: "The Run South", at: "channel", label: "The main channel" },
      { session: "The Run South", at: "sandbar", label: "The bar" },
      { session: "The Run South", at: "downstream", label: "Toward the forest" }
    ],
    next: "vingard-waystation"
  },
  {
    id: "vingard-waystation",
    arc: "vingard",
    name: "The Waystation",
    archetype: "interior", cols: 24, rows: 20, darkness: 0.45,
    summary: "A river inn on the south road: one long room, a hearth, and whoever else is going the same way.",
    pins: [
      { session: "The Waystation", at: "entrance", label: "Coming in off the water" },
      { session: "The Waystation", at: "table", label: "The other travellers" },
      { session: "The Waystation", at: "hearth", label: "News from the south" },
      { session: "The Waystation", at: "corner", label: "The quiet conversation" }
    ],
    next: "vingard-river-town"
  },
  {
    id: "vingard-river-town",
    arc: "vingard",
    name: "Riverlanding",
    archetype: "village", cols: 36, rows: 28, darkness: 0,
    summary: "The last town of any size before the forest country. Wharf, market, and a militia that has started asking where people are going.",
    pins: [
      { session: "Riverlanding", at: "gate", label: "The wharf" },
      { session: "Riverlanding", at: "green", label: "Market" },
      { session: "Riverlanding", at: "road", label: "The militia question" },
      { session: "Riverlanding", at: "far", label: "The road to the forest" }
    ],
    next: "wayreth-forest"
  }
];


// ---------------------------------------------------------------------------
// Arcs III to VI — the Tower, the Nightmare, the drowned city and the Abyss
//
// Fifty-one locations carrying all 224 beats the arc journals describe. One
// scene per session, except where a session plainly moves between two places;
// the beat count of every entry here is checked against its journal page, so a
// session that gains or loses a beat fails the build rather than losing a pin.
// ---------------------------------------------------------------------------
const ARCS_THREE_TO_SIX = [
  {
    id: "palanthas-dead-wizard",
    arc: "arc-three",
    name: "Palanthas · The Dead Wizard's Rooms",
    archetype: "interior", cols: 24, rows: 20, darkness: 0.4,
    summary: "A Conclave-sanctioned wizard dead in his own locked study. The scene is wrong in ways the city watch has not noticed.",
    pins: [
      { session: "Session 1: The Dead Wizard", beat: 1, at: "table" },
      { session: "Session 1: The Dead Wizard", beat: 2, at: "entrance" },
      { session: "Session 1: The Dead Wizard", beat: 3, at: "corner" },
      { session: "Session 1: The Dead Wizard", beat: 4, at: "hearth" }
    ],
    next: "palanthas-record-houses"
  },
  {
    id: "palanthas-record-houses",
    arc: "arc-three",
    name: "Palanthas · The Record Houses",
    archetype: "library", cols: 28, rows: 24, darkness: 0.35,
    summary: "Guild registers, Conclave filings and the University's copies. Three records of the same year and none of them agree.",
    pins: [
      { session: "Session 2: The Lost Records", beat: 1, at: "desk" },
      { session: "Session 2: The Lost Records", beat: 2, at: "stacks" },
      { session: "Session 2: The Lost Records", beat: 3, at: "reading" },
      { session: "Session 2: The Lost Records", beat: 4, at: "entrance" }
    ],
    next: "palanthas-undercity"
  },
  {
    id: "palanthas-undercity",
    arc: "arc-three",
    name: "Under the Old City",
    archetype: "cavern", cols: 36, rows: 30, darkness: 0.9,
    summary: "Pre-Cataclysm Palanthas, still down there under the new streets. A hidden residence, and whoever is guarding it.",
    pins: [
      { session: "Session 3: Under the Old City", beat: 1, at: "chamber1" },
      { session: "Session 3: Under the Old City", beat: 2, at: "chamber2" },
      { session: "Session 3: Under the Old City", beat: 3, at: "chamber3" },
      { session: "Session 3: Under the Old City", beat: 4, at: "entrance" }
    ],
    next: "shoikan-four-fears"
  },
  {
    id: "shoikan-four-fears",
    arc: "arc-three",
    name: "Shoikan Grove · The Four Fears",
    archetype: "grove", cols: 30, rows: 34, darkness: 0.92,
    summary: "The Grove as a psychological dungeon: terror, regret, the dead who failed, and one still point to rest in.",
    pins: [
      { session: "Session 4: Gate of Terror", beat: 1, at: "gate" },
      { session: "Session 4: Gate of Terror", beat: 2, at: "path" },
      { session: "Session 4: Gate of Terror", beat: 3, at: "clearing" },
      { session: "Session 4: Gate of Terror", beat: 4, at: "far" }
    ],
    next: "tower-servants-gate"
  },
  {
    id: "tower-servants-gate",
    arc: "arc-three",
    name: "Tower of Palanthas · The Servants' Gate",
    archetype: "fortress", cols: 28, rows: 26, darkness: 0.8,
    summary: "Three ways in. The Master's road, the subordinate route, and the one nobody has used since the Kingpriest.",
    pins: [
      { session: "Session 5: The Servants’ Gate", beat: 1, at: "gate" },
      { session: "Session 5: The Servants’ Gate", beat: 2, at: "keep" },
      { session: "Session 5: The Servants’ Gate", beat: 3, at: "wall" },
      { session: "Session 5: The Servants’ Gate", beat: 4, at: "yard" }
    ],
    next: "tower-hall-of-silence"
  },
  {
    id: "tower-hall-of-silence",
    arc: "arc-three",
    name: "Tower of Palanthas · Hall of Silence",
    archetype: "tower-hall", cols: 32, rows: 26, darkness: 0.85,
    summary: "Sound does not cross this floor. Beyond it, the Hall of Three Moons answers something nobody asked it.",
    pins: [
      { session: "Session 6: Hall of Silence & Three Moons", beat: 1, at: "entrance" },
      { session: "Session 6: Hall of Silence & Three Moons", beat: 2, at: "floor" },
      { session: "Session 6: Hall of Silence & Three Moons", beat: 3, at: "dais" },
      { session: "Session 6: Hall of Silence & Three Moons", beat: 4, at: "gallery" }
    ],
    next: "tower-abandoned-conclave"
  },
  {
    id: "tower-abandoned-conclave",
    arc: "arc-three",
    name: "Tower of Palanthas · The Abandoned Conclave",
    archetype: "tower-hall", cols: 34, rows: 26, darkness: 0.8,
    summary: "A Conclave session still running three centuries after it ended, debating a war that is already lost.",
    pins: [
      { session: "Session 7: The Abandoned Conclave", beat: 1, at: "dais" },
      { session: "Session 7: The Abandoned Conclave", beat: 2, at: "gallery" },
      { session: "Session 7: The Abandoned Conclave", beat: 3, at: "floor" },
      { session: "Session 7: The Abandoned Conclave", beat: 4, at: "entrance" }
    ],
    next: "tower-apprentice-quarters"
  },
  {
    id: "tower-apprentice-quarters",
    arc: "arc-three",
    name: "Tower of Palanthas · The Apprentice Quarters",
    archetype: "tower-chamber", cols: 26, rows: 22, darkness: 0.75,
    summary: "A dormitory running the same morning over and over, and one student who is late in a way that matters.",
    pins: [
      { session: "Session 8: The Apprentice Quarters", beat: 1, at: "centre" },
      { session: "Session 8: The Apprentice Quarters", beat: 2, at: "desk" },
      { session: "Session 8: The Apprentice Quarters", beat: 3, at: "window" },
      { session: "Session 8: The Apprentice Quarters", beat: 4, at: "entrance" }
    ],
    next: "tower-forbidden-library"
  },
  {
    id: "tower-forbidden-library",
    arc: "arc-three",
    name: "Tower of Palanthas · The Forbidden Library",
    archetype: "library", cols: 30, rows: 28, darkness: 0.8,
    summary: "Classified by ward rather than subject. The Long Return is in here, and so is somebody else.",
    pins: [
      { session: "Session 9: The Forbidden Library", beat: 1, at: "entrance" },
      { session: "Session 9: The Forbidden Library", beat: 2, at: "stacks" },
      { session: "Session 9: The Forbidden Library", beat: 3, at: "desk" },
      { session: "Session 9: The Forbidden Library", beat: 4, at: "reading" }
    ],
    next: "tower-chamber-of-echoes"
  },
  {
    id: "tower-chamber-of-echoes",
    arc: "arc-three",
    name: "Tower of Palanthas · The Chamber of Echoes",
    archetype: "void", cols: 30, rows: 30, darkness: 0.88,
    summary: "Rooms that replay what was done in them. Silvanesti is in here, and so is the night a Red Robe turned Black.",
    pins: [
      { session: "Session 10: The Chamber of Echoes", beat: 1, at: "knowledge" },
      { session: "Session 10: The Chamber of Echoes", beat: 2, at: "fear" },
      { session: "Session 10: The Chamber of Echoes", beat: 3, at: "law" },
      { session: "Session 10: The Chamber of Echoes", beat: 4, at: "mercy" },
      { session: "Session 10: The Chamber of Echoes", beat: 5, at: "centre" }
    ],
    next: "tower-rannoch-sanctum"
  },
  {
    id: "tower-rannoch-sanctum",
    arc: "arc-three",
    name: "Tower of Palanthas · Rannoch's Sanctum",
    archetype: "tower-chamber", cols: 26, rows: 22, darkness: 0.85,
    summary: "The wizard whose curse weaponised the Grove. He is still here, and he would like to explain himself.",
    pins: [
      { session: "Session 11: Rannoch’s Sanctum", beat: 1, at: "entrance" },
      { session: "Session 11: Rannoch’s Sanctum", beat: 2, at: "desk" },
      { session: "Session 11: Rannoch’s Sanctum", beat: 3, at: "centre" },
      { session: "Session 11: Rannoch’s Sanctum", beat: 4, at: "window" }
    ],
    next: "tower-fistandantilus-lab"
  },
  {
    id: "tower-fistandantilus-lab",
    arc: "arc-three",
    name: "Tower of Palanthas · Fistandantilus's Laboratory",
    archetype: "tower-chamber", cols: 28, rows: 24, darkness: 0.85,
    summary: "Documents in a hand that should not exist, dated after the man who wrote them died.",
    pins: [
      { session: "Session 12: Fistandantilus’s Laboratory", beat: 1, at: "desk" },
      { session: "Session 12: Fistandantilus’s Laboratory", beat: 2, at: "centre" },
      { session: "Session 12: Fistandantilus’s Laboratory", beat: 3, at: "window" },
      { session: "Session 12: Fistandantilus’s Laboratory", beat: 4, at: "entrance" }
    ],
    next: "tower-observatory"
  },
  {
    id: "tower-observatory",
    arc: "arc-three",
    name: "Tower of Palanthas · Observatory of Time",
    archetype: "void", cols: 32, rows: 32, darkness: 0.9,
    summary: "Six futures, shown without comment. The Tower is not warning anyone; it is filing.",
    pins: [
      { session: "Session 13: Observatory of Time", beat: 1, at: "knowledge" },
      { session: "Session 13: Observatory of Time", beat: 2, at: "fear" },
      { session: "Session 13: Observatory of Time", beat: 3, at: "law" },
      { session: "Session 13: Observatory of Time", beat: 4, at: "mercy" },
      { session: "Session 13: Observatory of Time", beat: 5, at: "centre" },
      { session: "Session 13: Observatory of Time", beat: 6, at: "knowledge" }
    ],
    next: "tower-necromantic-vault"
  },
  {
    id: "tower-necromantic-vault",
    arc: "arc-three",
    name: "Tower of Palanthas · The Necromantic Vault",
    archetype: "cavern", cols: 30, rows: 26, darkness: 0.92,
    summary: "The dead kept working. They answer a command reflex nobody in the party gave them.",
    pins: [
      { session: "Session 14: The Necromantic Vault", beat: 1, at: "chamber1" },
      { session: "Session 14: The Necromantic Vault", beat: 2, at: "chamber2" },
      { session: "Session 14: The Necromantic Vault", beat: 3, at: "chamber3" },
      { session: "Session 14: The Necromantic Vault", beat: 4, at: "entrance" }
    ],
    next: "tower-lower-seals"
  },
  {
    id: "tower-lower-seals",
    arc: "arc-three",
    name: "Tower of Palanthas · The Lower Seals",
    archetype: "cavern", cols: 34, rows: 28, darkness: 0.92,
    summary: "The breach map, the thing on the other side of it, and Veyrath arriving at the worst possible moment.",
    pins: [
      { session: "Session 15: The Lower Seals", beat: 1, at: "entrance" },
      { session: "Session 15: The Lower Seals", beat: 2, at: "chamber1" },
      { session: "Session 15: The Lower Seals", beat: 3, at: "chamber2" },
      { session: "Session 15: The Lower Seals", beat: 4, at: "chamber3" }
    ],
    next: "tower-master-arrives"
  },
  {
    id: "tower-master-arrives",
    arc: "arc-three",
    name: "Tower of Palanthas · The Master Arrives",
    archetype: "tower-hall", cols: 34, rows: 28, darkness: 0.85,
    summary: "Raistlin walks in through the Shoikan Grove without slowing down, and the Tower opens for him.",
    pins: [
      { session: "Session 16: The Master Arrives", beat: 1, at: "entrance" },
      { session: "Session 16: The Master Arrives", beat: 2, at: "gallery" },
      { session: "Session 16: The Master Arrives", beat: 3, at: "dais" },
      { session: "Session 16: The Master Arrives", beat: 4, at: "floor" },
      { session: "Session 16: The Master Arrives", beat: 5, at: "dais" },
      { session: "Session 16: The Master Arrives", beat: 6, at: "entrance" }
    ],
    next: "palanthas-three-expeditions"
  },
  {
    id: "palanthas-three-expeditions",
    arc: "arc-four",
    name: "Palanthas · Three Empty Spaces",
    archetype: "tower-chamber", cols: 28, rows: 22, darkness: 0.8,
    summary: "Three components, three expeditions, and a Master who will not open the Portal without proof.",
    pins: [
      { session: "Session 1: Proof, Not Resurrection", beat: 1, at: "desk" },
      { session: "Session 1: Proof, Not Resurrection", beat: 2, at: "centre" },
      { session: "Session 1: Proof, Not Resurrection", beat: 3, at: "window" },
      { session: "Session 1: Proof, Not Resurrection", beat: 4, at: "entrance" }
    ],
    next: "silvanesti-approach"
  },
  {
    id: "silvanesti-approach",
    arc: "arc-four",
    name: "The Road to the Nightmare",
    archetype: "road", cols: 42, rows: 24, darkness: 0.35,
    summary: "The approach to Silvanesti, through grief and displaced people, before anything supernatural starts.",
    pins: [
      { session: "Session 2: Road to the Nightmare", beat: 1, at: "west" },
      { session: "Session 2: Road to the Nightmare", beat: 2, at: "middle" },
      { session: "Session 2: Road to the Nightmare", beat: 3, at: "roadside" },
      { session: "Session 2: Road to the Nightmare", beat: 4, at: "east" }
    ],
    next: "silvanesti-nightmare"
  },
  {
    id: "silvanesti-nightmare",
    arc: "arc-four",
    name: "Silvanesti · The Nightmare Remembers",
    archetype: "nightmare", cols: 34, rows: 32, darkness: 0.7,
    summary: "Ruined villages where memory has become a physical residue, and a survivor living the same hour again.",
    pins: [
      { session: "Session 3: The Nightmare Remembers", beat: 1, at: "village" },
      { session: "Session 3: The Nightmare Remembers", beat: 2, at: "clearing" },
      { session: "Session 3: The Nightmare Remembers", beat: 3, at: "deep" },
      { session: "Session 3: The Nightmare Remembers", beat: 4, at: "edge" }
    ],
    next: "silvanesti-dream-palace"
  },
  {
    id: "silvanesti-dream-palace",
    arc: "arc-four",
    name: "Silvanesti · The Dream Palace",
    archetype: "dreampalace", cols: 32, rows: 32, darkness: 0.75,
    summary: "Lorac's dream given architecture. Caramon's last path runs through it, and so does his death.",
    pins: [
      { session: "Session 4: The Dream Palace", beat: 1, at: "entry" },
      { session: "Session 4: The Dream Palace", beat: 2, at: "outer" },
      { session: "Session 4: The Dream Palace", beat: 3, at: "inner" },
      { session: "Session 4: The Dream Palace", beat: 4, at: "heart" }
    ],
    next: "silvanesti-heart"
  },
  {
    id: "silvanesti-heart",
    arc: "arc-four",
    name: "Silvanesti · Cyan's Rehearsal",
    archetype: "dreampalace", cols: 30, rows: 30, darkness: 0.8,
    summary: "The nightmare's guardian, rehearsing futures that have not happened, and the Heart of Memory behind him.",
    tokens: [
      { actor: "Cyan Bloodbane", at: "heart" }
    ],
    pins: [
      { session: "Session 5: Cyan’s Rehearsal", beat: 1, at: "outer" },
      { session: "Session 5: Cyan’s Rehearsal", beat: 2, at: "inner" },
      { session: "Session 5: Cyan’s Rehearsal", beat: 3, at: "heart" },
      { session: "Session 5: Cyan’s Rehearsal", beat: 4, at: "entry" }
    ],
    next: "plains-of-death"
  },
  {
    id: "plains-of-death",
    arc: "arc-four",
    name: "The Plains of Death",
    archetype: "moor", cols: 40, rows: 30, darkness: 0.3,
    summary: "Open country under Pax Tharkas's shadow, and the stump of Skullcap on the horizon.",
    pins: [
      { session: "Session 6: To the Plains of Death", beat: 1, at: "west" },
      { session: "Session 6: To the Plains of Death", beat: 2, at: "open" },
      { session: "Session 6: To the Plains of Death", beat: 3, at: "stones" },
      { session: "Session 6: To the Plains of Death", beat: 4, at: "east" }
    ],
    next: "zhaman-crystal-maze"
  },
  {
    id: "zhaman-crystal-maze",
    arc: "arc-four",
    name: "Zhaman · The Crystal Maze",
    archetype: "crystal", cols: 38, rows: 30, darkness: 0.75,
    summary: "A maze that changes behind you because the hour it is in keeps changing. Navigation is a temporal problem.",
    pins: [
      { session: "Session 7: The Crystal Maze", beat: 1, at: "entry" },
      { session: "Session 7: The Crystal Maze", beat: 2, at: "laboratory" },
      { session: "Session 7: The Crystal Maze", beat: 3, at: "middle" },
      { session: "Session 7: The Crystal Maze", beat: 4, at: "far" }
    ],
    next: "zhaman-unbroken-hour"
  },
  {
    id: "zhaman-unbroken-hour",
    arc: "arc-four",
    name: "Zhaman · The Unbroken Hour",
    archetype: "crystal", cols: 34, rows: 28, darkness: 0.8,
    summary: "Fistandantilus's anchor experiment, still running, and the cost of it visible in the walls.",
    pins: [
      { session: "Session 8: The Unbroken Hour", beat: 1, at: "entry" },
      { session: "Session 8: The Unbroken Hour", beat: 2, at: "laboratory" },
      { session: "Session 8: The Unbroken Hour", beat: 3, at: "middle" },
      { session: "Session 8: The Unbroken Hour", beat: 4, at: "far" }
    ],
    next: "skullcap-future-servant"
  },
  {
    id: "skullcap-future-servant",
    arc: "arc-four",
    name: "Skullcap · The Future Servant",
    archetype: "ruin", cols: 34, rows: 28, darkness: 0.6,
    summary: "A possible version of one of the party, three decades on, holding the Chronicle of the Unbroken Hour.",
    pins: [
      { session: "Session 9: The Future Servant", beat: 1, at: "gate" },
      { session: "Session 9: The Future Servant", beat: 2, at: "court" },
      { session: "Session 9: The Future Servant", beat: 3, at: "deep" },
      { session: "Session 9: The Future Servant", beat: 4, at: "corner" }
    ],
    next: "blood-sea-passage"
  },
  {
    id: "blood-sea-passage",
    arc: "arc-four",
    name: "The Blood Sea · Passage",
    archetype: "ship", cols: 38, rows: 26, darkness: 0.45,
    summary: "A deck, a crew with its own politics, a rival wreck already on the site, and the descent to come.",
    pins: [
      { session: "Session 10: Blood Sea Passage", beat: 1, at: "stern" },
      { session: "Session 10: Blood Sea Passage", beat: 2, at: "bow" },
      { session: "Session 10: Blood Sea Passage", beat: 3, at: "rail" },
      { session: "Session 10: Blood Sea Passage", beat: 4, at: "deck" }
    ],
    next: "istar-chamber-of-eyes"
  },
  {
    id: "istar-chamber-of-eyes",
    arc: "arc-four",
    name: "Istar · The Chamber of Eyes",
    archetype: "drowned", cols: 32, rows: 28, darkness: 0.85,
    summary: "A divination chamber under the Blood Sea. Three visions, and the difference between knowing a name and owning it.",
    pins: [
      { session: "Session 11: The Chamber of Eyes", beat: 1, at: "entrance" },
      { session: "Session 11: The Chamber of Eyes", beat: 2, at: "nave" },
      { session: "Session 11: The Chamber of Eyes", beat: 3, at: "altar" },
      { session: "Session 11: The Chamber of Eyes", beat: 4, at: "vault" }
    ],
    next: "istar-drowned-temple"
  },
  {
    id: "istar-drowned-temple",
    arc: "arc-four",
    name: "Istar · The Drowned Temple",
    archetype: "drowned", cols: 34, rows: 30, darkness: 0.88,
    summary: "A soul-call where refusing is the successful outcome, and a vault that only opens for someone who refused.",
    pins: [
      { session: "Session 12: The Drowned Temple", beat: 1, at: "nave" },
      { session: "Session 12: The Drowned Temple", beat: 2, at: "altar" },
      { session: "Session 12: The Drowned Temple", beat: 3, at: "vault" },
      { session: "Session 12: The Drowned Temple", beat: 4, at: "entrance" }
    ],
    next: "istar-bell"
  },
  {
    id: "istar-bell",
    arc: "arc-four",
    name: "Istar · The Bell of True Names",
    archetype: "drowned", cols: 32, rows: 28, darkness: 0.85,
    summary: "Claim it and get out. The sea does not want it moved, and Palanthas is a long way up.",
    pins: [
      { session: "Session 13: The Bell of True Names", beat: 1, at: "altar" },
      { session: "Session 13: The Bell of True Names", beat: 2, at: "nave" },
      { session: "Session 13: The Bell of True Names", beat: 3, at: "entrance" },
      { session: "Session 13: The Bell of True Names", beat: 4, at: "vault" },
      { session: "Session 13: The Bell of True Names", beat: 5, at: "entrance" }
    ],
    next: "palanthas-portal-chamber"
  },
  {
    id: "palanthas-portal-chamber",
    arc: "arc-five",
    name: "Tower of Palanthas · The Portal Chamber",
    archetype: "tower-chamber", cols: 30, rows: 26, darkness: 0.85,
    summary: "The first controlled opening. A safety circle, contact, terms, and something coming through on them.",
    pins: [
      { session: "Session 1: The First Opening", beat: 1, at: "centre" },
      { session: "Session 1: The First Opening", beat: 2, at: "desk" },
      { session: "Session 1: The First Opening", beat: 3, at: "window" },
      { session: "Session 1: The First Opening", beat: 4, at: "entrance" }
    ],
    next: "palanthas-black-saviour"
  },
  {
    id: "palanthas-black-saviour",
    arc: "arc-five",
    name: "Palanthas · The Black Saviour",
    archetype: "city", cols: 36, rows: 32, darkness: 0.2,
    summary: "The war turns, the city notices who turned it, and the contract develops a loophole in public.",
    pins: [
      { session: "Session 2: The Black Saviour", beat: 1, at: "plaza" },
      { session: "Session 2: The Black Saviour", beat: 2, at: "north" },
      { session: "Session 2: The Black Saviour", beat: 3, at: "east" },
      { session: "Session 2: The Black Saviour", beat: 4, at: "west" }
    ],
    next: "palanthas-first-returned"
  },
  {
    id: "palanthas-first-returned",
    arc: "arc-five",
    name: "Tower of Palanthas · The First Returned",
    archetype: "tower-chamber", cols: 28, rows: 24, darkness: 0.8,
    summary: "Consent taken before death, a ritual that works, and a command channel nobody admits to building.",
    pins: [
      { session: "Session 3: The First Returned", beat: 1, at: "centre" },
      { session: "Session 3: The First Returned", beat: 2, at: "desk" },
      { session: "Session 3: The First Returned", beat: 3, at: "window" },
      { session: "Session 3: The First Returned", beat: 4, at: "entrance" },
      { session: "Session 3: The First Returned", beat: 5, at: "centre" }
    ],
    next: "palanthas-the-returned"
  },
  {
    id: "palanthas-the-returned",
    arc: "arc-five",
    name: "Palanthas · People Who Came Back",
    archetype: "city", cols: 36, rows: 30, darkness: 0.25,
    summary: "The Returned in the street rather than the laboratory. A civil question, an accident, and then an attack.",
    pins: [
      { session: "Session 4: People Who Came Back", beat: 1, at: "plaza" },
      { session: "Session 4: People Who Came Back", beat: 2, at: "west" },
      { session: "Session 4: People Who Came Back", beat: 3, at: "east" },
      { session: "Session 4: People Who Came Back", beat: 4, at: "north" }
    ],
    next: "wayreth-forest-assault"
  },
  {
    id: "wayreth-forest-assault",
    arc: "arc-five",
    name: "Wayreth · The Forest Swallows an Army",
    archetype: "forest", cols: 40, rows: 34, darkness: 0.5,
    summary: "Multiple contact points against a forest that moves its own paths and has stopped being neutral.",
    pins: [
      { session: "Session 5: The Forest Swallows an Army", beat: 1, at: "edge" },
      { session: "Session 5: The Forest Swallows an Army", beat: 2, at: "clearing" },
      { session: "Session 5: The Forest Swallows an Army", beat: 3, at: "deep" },
      { session: "Session 5: The Forest Swallows an Army", beat: 4, at: "edge" }
    ],
    next: "wayreth-tower-survival"
  },
  {
    id: "wayreth-tower-survival",
    arc: "arc-five",
    name: "Tower of Wayreth · The Tower Chooses Survival",
    archetype: "tower-hall", cols: 32, rows: 26, darkness: 0.8,
    summary: "A proposal that saves the Tower by spending allies, argued in front of the people who would be spent.",
    pins: [
      { session: "Session 6: The Tower Chooses Survival", beat: 1, at: "dais" },
      { session: "Session 6: The Tower Chooses Survival", beat: 2, at: "floor" },
      { session: "Session 6: The Tower Chooses Survival", beat: 3, at: "gallery" },
      { session: "Session 6: The Tower Chooses Survival", beat: 4, at: "entrance" }
    ],
    next: "high-clerist-return"
  },
  {
    id: "high-clerist-return",
    arc: "arc-five",
    name: "The High Clerist's Tower · Return",
    archetype: "fortress", cols: 34, rows: 30, darkness: 0.3,
    summary: "The Arc II location under full battle conditions, and the party given actual strategic authority.",
    pins: [
      { session: "Session 7: Return to the High Clerist", beat: 1, at: "gate" },
      { session: "Session 7: Return to the High Clerist", beat: 2, at: "keep" },
      { session: "Session 7: Return to the High Clerist", beat: 3, at: "yard" },
      { session: "Session 7: Return to the High Clerist", beat: 4, at: "wall" }
    ],
    next: "high-clerist-black-host"
  },
  {
    id: "high-clerist-black-host",
    arc: "arc-five",
    name: "The High Clerist's Tower · The Black Host",
    archetype: "battlefield", cols: 42, rows: 32, darkness: 0.55,
    summary: "The major battlefield. The Host does what it was contracted to do, and the safeguards get tested in public.",
    pins: [
      { session: "Session 8: The Black Host at High Clerist", beat: 1, at: "line" },
      { session: "Session 8: The Black Host at High Clerist", beat: 2, at: "advance" },
      { session: "Session 8: The Black Host at High Clerist", beat: 3, at: "flank" },
      { session: "Session 8: The Black Host at High Clerist", beat: 4, at: "line" },
      { session: "Session 8: The Black Host at High Clerist", beat: 5, at: "rear" }
    ],
    next: "palanthas-blue-lady"
  },
  {
    id: "palanthas-blue-lady",
    arc: "arc-five",
    name: "Palanthas · The Blue Lady Moves",
    archetype: "city", cols: 36, rows: 32, darkness: 0.45,
    summary: "Kitiara's demand, the Council's crisis, and a conversation between a Majere and the woman besieging him.",
    tokens: [
      { actor: "Kitiara uth Matar", at: "north" }
    ],
    pins: [
      { session: "Session 9: The Blue Lady Moves", beat: 1, at: "plaza" },
      { session: "Session 9: The Blue Lady Moves", beat: 2, at: "west" },
      { session: "Session 9: The Blue Lady Moves", beat: 3, at: "north" },
      { session: "Session 9: The Blue Lady Moves", beat: 4, at: "east" }
    ],
    next: "palanthas-soth"
  },
  {
    id: "palanthas-soth",
    arc: "arc-five",
    name: "Palanthas · Kitiara and Lord Soth",
    archetype: "city", cols: 38, rows: 34, darkness: 0.7,
    summary: "The city assault as objectives rather than a line, and a death knight at a threshold he need not cross.",
    tokens: [
      { actor: "Lord Soth, Knight of the Black Rose", at: "east" },
      { actor: "Kitiara uth Matar", at: "north" }
    ],
    pins: [
      { session: "Session 10: Kitiara and Lord Soth", beat: 1, at: "plaza" },
      { session: "Session 10: Kitiara and Lord Soth", beat: 2, at: "north" },
      { session: "Session 10: Kitiara and Lord Soth", beat: 3, at: "east" },
      { session: "Session 10: Kitiara and Lord Soth", beat: 4, at: "west" },
      { session: "Session 10: Kitiara and Lord Soth", beat: 5, at: "south" }
    ],
    next: "palanthas-long-return"
  },
  {
    id: "palanthas-long-return",
    arc: "arc-five",
    name: "Tower of Palanthas · The Long Return Begins",
    archetype: "tower-chamber", cols: 30, rows: 26, darkness: 0.85,
    summary: "Memory, Time and Name, with every safeguard the party insisted on, and a window in which to refuse.",
    pins: [
      { session: "Session 11: The Long Return Begins", beat: 1, at: "centre" },
      { session: "Session 11: The Long Return Begins", beat: 2, at: "desk" },
      { session: "Session 11: The Long Return Begins", beat: 3, at: "window" },
      { session: "Session 11: The Long Return Begins", beat: 4, at: "entrance" },
      { session: "Session 11: The Long Return Begins", beat: 5, at: "centre" }
    ],
    next: "palanthas-give-me-the-sword"
  },
  {
    id: "palanthas-give-me-the-sword",
    arc: "arc-five",
    name: "Tower of Palanthas · Give Me the Sword",
    archetype: "tower-chamber", cols: 28, rows: 24, darkness: 0.8,
    summary: "Caramon is a person again. The command channel reveals itself in the most personal way available.",
    pins: [
      { session: "Session 12: Give Me the Sword", beat: 1, at: "centre" },
      { session: "Session 12: Give Me the Sword", beat: 2, at: "desk" },
      { session: "Session 12: Give Me the Sword", beat: 3, at: "entrance" },
      { session: "Session 12: Give Me the Sword", beat: 4, at: "window" },
      { session: "Session 12: Give Me the Sword", beat: 5, at: "centre" }
    ],
    next: "abyss-fistandantilus-speaks"
  },
  {
    id: "abyss-fistandantilus-speaks",
    arc: "arc-six",
    name: "Tower of Palanthas · Fistandantilus Speaks",
    archetype: "tower-chamber", cols: 30, rows: 26, darkness: 0.88,
    summary: "The Dark One manifests and claims the whole research trail, including the soul they just brought back.",
    tokens: [
      { actor: "Fistandantilus", at: "desk" }
    ],
    pins: [
      { session: "Session 1: Fistandantilus Speaks", beat: 1, at: "centre" },
      { session: "Session 1: Fistandantilus Speaks", beat: 2, at: "desk" },
      { session: "Session 1: Fistandantilus Speaks", beat: 3, at: "window" },
      { session: "Session 1: Fistandantilus Speaks", beat: 4, at: "entrance" },
      { session: "Session 1: Fistandantilus Speaks", beat: 5, at: "centre" }
    ],
    next: "wayreth-archive-of-futures"
  },
  {
    id: "wayreth-archive-of-futures",
    arc: "arc-six",
    name: "Tower of Wayreth · The Archive of Futures",
    archetype: "void", cols: 32, rows: 32, darkness: 0.85,
    summary: "Why Wayreth chose Raistlin, in the Tower's own filing, including the part it cannot see.",
    pins: [
      { session: "Session 2: Wayreth’s Confession", beat: 1, at: "knowledge" },
      { session: "Session 2: Wayreth’s Confession", beat: 2, at: "fear" },
      { session: "Session 2: Wayreth’s Confession", beat: 3, at: "law" },
      { session: "Session 2: Wayreth’s Confession", beat: 4, at: "mercy" },
      { session: "Session 2: Wayreth’s Confession", beat: 5, at: "centre" }
    ],
    next: "siege-two-towers-one"
  },
  {
    id: "siege-two-towers-one",
    arc: "arc-six",
    name: "The Siege of Two Towers · Allocation",
    archetype: "fortress", cols: 36, rows: 32, darkness: 0.5,
    summary: "Two sieges at once and one set of people, artifacts and spells to divide between them.",
    pins: [
      { session: "Session 3: The Siege of Two Towers I", beat: 1, at: "gate" },
      { session: "Session 3: The Siege of Two Towers I", beat: 2, at: "yard" },
      { session: "Session 3: The Siege of Two Towers I", beat: 3, at: "keep" },
      { session: "Session 3: The Siege of Two Towers I", beat: 4, at: "wall" },
      { session: "Session 3: The Siege of Two Towers I", beat: 5, at: "keep" }
    ],
    next: "siege-two-towers-two"
  },
  {
    id: "siege-two-towers-two",
    arc: "arc-six",
    name: "The Siege of Two Towers · The Breach",
    archetype: "battlefield", cols: 42, rows: 32, darkness: 0.6,
    summary: "Both walls go. One Tower can be held properly and the other cannot, and the Portal surges while you choose.",
    pins: [
      { session: "Session 4: The Siege of Two Towers II", beat: 1, at: "line" },
      { session: "Session 4: The Siege of Two Towers II", beat: 2, at: "advance" },
      { session: "Session 4: The Siege of Two Towers II", beat: 3, at: "flank" },
      { session: "Session 4: The Siege of Two Towers II", beat: 4, at: "rear" },
      { session: "Session 4: The Siege of Two Towers II", beat: 5, at: "line" }
    ],
    next: "caramon-will"
  },
  {
    id: "caramon-will",
    arc: "arc-six",
    name: "Caramon's Will",
    archetype: "interior", cols: 24, rows: 20, darkness: 0.5,
    summary: "A private room, a brother who is not in it, and the first chance Caramon has had to want something himself.",
    pins: [
      { session: "Session 5: Caramon’s Will", beat: 1, at: "hearth" },
      { session: "Session 5: Caramon’s Will", beat: 2, at: "table" },
      { session: "Session 5: Caramon’s Will", beat: 3, at: "corner" },
      { session: "Session 5: Caramon’s Will", beat: 4, at: "entrance" }
    ],
    next: "abyss-crossing"
  },
  {
    id: "abyss-crossing",
    arc: "arc-six",
    name: "Into the Abyss",
    archetype: "abyss", cols: 36, rows: 32, darkness: 0.8,
    summary: "Last preparations, the crossing, and cutting the line behind you because leaving it is worse.",
    pins: [
      { session: "Session 6: Into the Abyss", beat: 1, at: "arrival" },
      { session: "Session 6: Into the Abyss", beat: 2, at: "centre" },
      { session: "Session 6: Into the Abyss", beat: 3, at: "island2" },
      { session: "Session 6: Into the Abyss", beat: 4, at: "island3" }
    ],
    next: "abyss-field-of-lost-names"
  },
  {
    id: "abyss-field-of-lost-names",
    arc: "arc-six",
    name: "The Field of Lost Names",
    archetype: "abyss", cols: 38, rows: 32, darkness: 0.85,
    summary: "Everything here has had its name taken. The Bell is the only thing that can give one back.",
    pins: [
      { session: "Session 7: The Field of Lost Names", beat: 1, at: "arrival" },
      { session: "Session 7: The Field of Lost Names", beat: 2, at: "centre" },
      { session: "Session 7: The Field of Lost Names", beat: 3, at: "island2" },
      { session: "Session 7: The Field of Lost Names", beat: 4, at: "throne" }
    ],
    next: "abyss-palace-of-chains"
  },
  {
    id: "abyss-palace-of-chains",
    arc: "arc-six",
    name: "The Palace of Chains",
    archetype: "abyss", cols: 38, rows: 34, darkness: 0.85,
    summary: "A mechanism for holding souls, which can be mapped, used, redesigned or broken — and all four are offered.",
    pins: [
      { session: "Session 8: The Palace of Chains", beat: 1, at: "arrival" },
      { session: "Session 8: The Palace of Chains", beat: 2, at: "centre" },
      { session: "Session 8: The Palace of Chains", beat: 3, at: "island2" },
      { session: "Session 8: The Palace of Chains", beat: 4, at: "island3" },
      { session: "Session 8: The Palace of Chains", beat: 5, at: "throne" }
    ],
    next: "abyss-past-and-present"
  },
  {
    id: "abyss-past-and-present",
    arc: "arc-six",
    name: "The Past and the Present",
    archetype: "abyss", cols: 36, rows: 32, darkness: 0.88,
    summary: "No possession, an offer, a price, and the argument the party has in front of both of them.",
    tokens: [
      { actor: "Fistandantilus", at: "centre" }
    ],
    pins: [
      { session: "Session 9: The Past and Present", beat: 1, at: "arrival" },
      { session: "Session 9: The Past and Present", beat: 2, at: "island2" },
      { session: "Session 9: The Past and Present", beat: 3, at: "centre" },
      { session: "Session 9: The Past and Present", beat: 4, at: "island3" },
      { session: "Session 9: The Past and Present", beat: 5, at: "throne" },
      { session: "Session 9: The Past and Present", beat: 6, at: "centre" }
    ],
    next: "abyss-queen-of-darkness"
  },
  {
    id: "abyss-queen-of-darkness",
    arc: "arc-six",
    name: "The Queen of Darkness",
    archetype: "abyss", cols: 42, rows: 36, darkness: 0.9,
    summary: "Takhisis makes her claim on three fronts at once, and the Portal is still open behind you.",
    tokens: [
      { actor: "Raistlin Majere, Master of Wayreth", at: "throne" }
    ],
    pins: [
      { session: "Session 10: The Queen of Darkness", beat: 1, at: "arrival" },
      { session: "Session 10: The Queen of Darkness", beat: 2, at: "island2" },
      { session: "Session 10: The Queen of Darkness", beat: 3, at: "centre" },
      { session: "Session 10: The Queen of Darkness", beat: 4, at: "island3" },
      { session: "Session 10: The Queen of Darkness", beat: 5, at: "throne" },
      { session: "Session 10: The Queen of Darkness", beat: 6, at: "arrival" }
    ],
    next: null
  }
];

export const SCENES = [
  // -----------------------------------------------------------------------
  // Arc I — Vogler, the road, and the Tower that chooses who reaches it
  // -----------------------------------------------------------------------
  {
    id: "ansalon-three-roads",
    arc: "arc-one",
    name: "Ansalon · The Three Roads",
    image: "assets/ansalon-three-routes.webp",   // the campaign map already ships
    grid: false,
    cols: 60, rows: 44,
    darkness: DAY,
    summary: "The continent, with the three roads to Wayreth drawn on it. Start here and come back to it whenever the party chooses a route.",
    pins: [
      { session: "Arc I Overview", section: "Chapter Map", at: "centre",
        label: "Arc I at a glance" }
    ],
    next: "vogler-ispin-house"
  },
  {
    id: "vogler-ispin-house",
    arc: "arc-one",
    name: "Vogler · Ispin's House",
    archetype: "interior", cols: 22, rows: 18, darkness: DUSK,
    summary: "The house of a dead man who knew more than he said. The funeral is downstairs; what matters is upstairs.",
    pins: [
      { session: "Chapter 1: Ispin Greenshield", section: "What He Leaves Behind", at: "table" },
      { session: "Chapter 1: Ispin Greenshield", section: "Running the Funeral", at: "hearth" }
    ],
    next: "vogler-green"
  },
  {
    id: "vogler-green",
    arc: "arc-one",
    name: "Vogler · The Kingfisher Festival",
    archetype: "village", cols: 36, rows: 28, darkness: DAY,
    summary: "The village green on festival day. Everything the party is about to lose is standing on this map.",
    pins: [
      { session: "Chapter 2: The Kingfisher Festival", section: "The Day", at: "green" },
      { session: "Chapter 2: The Kingfisher Festival", section: "Give Everyone Something to Lose", at: "road" },
      { session: "Chapter 2: The Kingfisher Festival", section: "The First War News", at: "gate" }
    ],
    next: "wayreth-forest"
  },
  {
    id: "wayreth-forest",
    arc: "arc-one",
    name: "The Forest of Wayreth",
    archetype: "forest", cols: 34, rows: 34, darkness: DUSK,
    summary: "The forest is not navigated; it decides. Ordinary pathfinding fails here and that is the point.",
    pins: [
      { session: "Chapter 5: The Forest of Wayreth", section: "Ordinary Navigation Fails", at: "edge" },
      { session: "Chapter 5: The Forest of Wayreth", section: "The Structure", at: "deep" },
      { session: "Chapter 5: The Forest of Wayreth", section: "The Candidate's Question", at: "clearing" },
      { session: "Chapter 5: The Forest of Wayreth", section: "The Ending", at: "clearing" }
    ],
    next: "wayreth-hall-of-mages"
  },
  {
    id: "wayreth-hall-of-mages",
    arc: "arc-one",
    name: "Tower of Wayreth · Hall of Mages",
    archetype: "tower-hall", cols: 34, rows: 26, darkness: UNLIT,
    summary: "Where the three Orders sit. The Tower behaves strangely around Raistlin here and the party should notice before anyone says so.",
    tokens: [
      { actor: "Par-Salian of the White Robes", at: "dais", offset: [-2, 0] },
      { actor: "Justarius of the Red Robes", at: "dais" },
      { actor: "Ladonna of the Black Robes", at: "dais", offset: [2, 0] }
    ],
    pins: [
      { session: "Chapter 6: The Three Orders", section: "The Tower Behaves Strangely Around Raistlin", at: "floor" },
      { session: "Chapter 6: The Three Orders", section: "The Four Conversations", at: "gallery" },
      { session: "Chapter 6: The Three Orders", section: "Raistlin's First Appearance", at: "dais" }
    ],
    next: "wayreth-night-of-the-eye"
  },
  {
    id: "wayreth-night-of-the-eye",
    arc: "arc-one",
    name: "Tower of Wayreth · The Night of the Eye",
    archetype: "tower-hall", cols: 30, rows: 24, darkness: NIGHT,
    palette: "tower",
    summary: "All three moons full. The Tower is at its strongest and so is everything that wants in.",
    tokens: [{ actor: "Raistlin Majere, Master of Wayreth", at: "dais" }],
    pins: [
      { session: "Chapter 7: The Night of the Eye", section: "The Tower on the Night", at: "floor" },
      { session: "Chapter 7: The Night of the Eye", section: "Before the Test", at: "entrance" },
      { session: "Chapter 7: The Night of the Eye", section: "The Address", at: "dais" }
    ],
    next: "test-of-high-sorcery"
  },
  {
    id: "test-of-high-sorcery",
    arc: "arc-one",
    name: "The Test of High Sorcery",
    archetype: "void", cols: 32, rows: 32, darkness: UNLIT,
    summary: "Four trials on four platforms over nothing. Knowledge, Fear, Law, Mercy — and the Test is allowed to kill.",
    pins: [
      { session: "The White Robe Test: Four Movements", section: "Trial One", at: "knowledge" },
      { session: "The White Robe Test: Four Movements", section: "Trial Two", at: "fear" },
      { session: "The White Robe Test: Four Movements", section: "Trial Three", at: "law" },
      { session: "The White Robe Test: Four Movements", section: "Trial Four", at: "mercy" }
    ],
    next: "wayreth-masters-chamber"
  },

  // -----------------------------------------------------------------------
  // Arc II — the errand, the road, Palanthas, and the Grove
  // -----------------------------------------------------------------------
  {
    id: "wayreth-masters-chamber",
    arc: "arc-two",
    name: "Tower of Wayreth · The Master's Chamber",
    archetype: "tower-chamber", cols: 24, rows: 20, darkness: UNLIT,
    summary: "Raistlin gives the errand here, in public, without ceremony, and the lack of ceremony is the message.",
    tokens: [{ actor: "Raistlin Majere, Master of Wayreth", at: "desk" }],
    pins: [
      { session: "Session 1: The Master’s Chamber", beat: 1, at: "entrance" },
      { session: "Session 1: The Master’s Chamber", beat: 2, at: "centre" },
      { session: "Session 1: The Master’s Chamber", beat: 3, at: "desk" },
      { session: "Session 1: The Master’s Chamber", beat: 4, at: "window" }
    ],
    next: "war-road-ash"
  },
  {
    id: "war-road-ash",
    arc: "arc-two",
    name: "The Road of Ash",
    archetype: "road", cols: 44, rows: 24, darkness: DAY,
    summary: "Whichever road they chose, it looks like this for the first day: ruts, ash, and people going the other way.",
    pins: [
      { session: "Session 2: The Road of Ash", beat: 1, at: "west" },
      { session: "Session 2: The Road of Ash", beat: 2, at: "middle" },
      { session: "Session 2: The Road of Ash", beat: 3, at: "east" }
    ],
    next: "war-road-night-camp"
  },
  {
    id: "war-road-night-camp",
    arc: "arc-two",
    name: "The Road of Ash · Night Camp",
    archetype: "camp", cols: 28, rows: 28, darkness: NIGHT,
    summary: "First night on the road. Watches, firelight, and the first honest conversation about what they have been sent to do.",
    pins: [
      { session: "Session 2: The Road of Ash", beat: 4, at: "fire" }
    ],
    next: "route-threshold-first"
  },
  {
    id: "route-threshold-first",
    arc: "arc-two",
    name: "First Route Threshold",
    archetype: "village", cols: 32, rows: 26, darkness: DAY,
    summary: "Fangoth, Lemish Core or Ergoth Waters depending on the road taken. The same four beats land in any of them.",
    pins: [
      { session: "Session 3: First Route Threshold", beat: 1, at: "gate" },
      { session: "Session 3: First Route Threshold", beat: 2, at: "green" },
      { session: "Session 3: First Route Threshold", beat: 3, at: "road" },
      { session: "Session 3: First Route Threshold", beat: 4, at: "far" }
    ],
    next: "route-threshold-second"
  },
  {
    id: "route-threshold-second",
    arc: "arc-two",
    name: "Second Route Threshold",
    archetype: "interior", cols: 24, rows: 20, darkness: DUSK,
    summary: "The comfortable room where the offer gets made. Gilthanost or Mirivale, or wherever the road put them.",
    tokens: [{ actor: "Commander Veyrath", at: "table" }],
    pins: [
      { session: "Session 4: Second Route Threshold", beat: 1, at: "hearth" },
      { session: "Session 4: Second Route Threshold", beat: 2, at: "table" },
      { session: "Session 4: Second Route Threshold", beat: 3, at: "corner" },
      { session: "Session 4: Second Route Threshold", beat: 4, at: "entrance" }
    ],
    next: "veyraths-net"
  },
  {
    id: "veyraths-net",
    arc: "arc-two",
    name: "Veyrath's Net",
    archetype: "camp", cols: 30, rows: 26, darkness: DUSK,
    summary: "Veyrath's command camp. He invites, he is courteous, and he is recording every answer.",
    tokens: [{ actor: "Commander Veyrath", at: "centre" }],
    pins: [
      { session: "Session 5: Veyrath’s Net", beat: 1, at: "perimeter" },
      { session: "Session 5: Veyrath’s Net", beat: 2, at: "centre" },
      { session: "Session 5: Veyrath’s Net", beat: 3, at: "centre" },
      { session: "Session 5: Veyrath’s Net", beat: 4, at: "fire" }
    ],
    next: "mid-route-crisis"
  },
  {
    id: "mid-route-crisis",
    arc: "arc-two",
    name: "Mid-Route Crisis",
    archetype: "road", cols: 40, rows: 24, darkness: DAY,
    summary: "Something has happened on the road ahead and the party has to decide whose problem it is.",
    pins: [
      { session: "Session 6: Mid-Route Crisis", beat: 1, at: "middle" },
      { session: "Session 6: Mid-Route Crisis", beat: 2, at: "roadside" },
      { session: "Session 6: Mid-Route Crisis", beat: 3, at: "east" },
      { session: "Session 6: Mid-Route Crisis", beat: 4, at: "west" }
    ],
    next: "northern-convergence"
  },
  {
    id: "northern-convergence",
    arc: "arc-two",
    name: "Northern Convergence",
    archetype: "camp", cols: 32, rows: 28, darkness: DAY,
    summary: "A Solamnic staging camp. Resupply, a war briefing, and the first White Robe who will talk to them properly.",
    pins: [
      { session: "Session 7: Northern Convergence", beat: 1, at: "perimeter" },
      { session: "Session 7: Northern Convergence", beat: 2, at: "centre" },
      { session: "Session 7: Northern Convergence", beat: 3, at: "fire" },
      { session: "Session 7: Northern Convergence", beat: 4, at: "centre" }
    ],
    next: "high-clerist-shadow"
  },
  {
    id: "high-clerist-shadow",
    arc: "arc-two",
    name: "The High Clerist's Shadow",
    archetype: "fortress", cols: 34, rows: 30, darkness: NIGHT,
    summary: "The raid everyone is watching, and the theft nobody is. Veyrath is here for the second one.",
    tokens: [
      { actor: "Commander Veyrath", at: "keep" },
      { actor: "Knight of the Rose", at: "gate" },
      { actor: "Knight of the Sword", at: "gate", offset: [2, 0] }
    ],
    pins: [
      { session: "Session 8: The High Clerist’s Shadow", beat: 1, at: "wall" },
      { session: "Session 8: The High Clerist’s Shadow", beat: 2, at: "yard" },
      { session: "Session 8: The High Clerist’s Shadow", beat: 3, at: "keep" },
      { session: "Session 8: The High Clerist’s Shadow", beat: 4, at: "gate" }
    ],
    next: "palanthas-gates"
  },
  {
    id: "palanthas-gates",
    arc: "arc-two",
    name: "Palanthas · Arrival",
    archetype: "city", cols: 34, rows: 34, darkness: DAY,
    summary: "The white city. Entry, orientation, and the one direction nobody walks in.",
    pins: [
      { session: "Session 9: Palanthas", beat: 1, at: "south" },
      { session: "Session 9: Palanthas", beat: 2, at: "plaza" },
      { session: "Session 9: Palanthas", beat: 3, at: "east" },
      { session: "Session 9: Palanthas", beat: 4, at: "west" }
    ],
    next: "palanthas-districts"
  },
  {
    id: "palanthas-districts",
    arc: "arc-two",
    name: "Palanthas · White Stone, Black Shadow",
    archetype: "city", cols: 38, rows: 34, darkness: DAY,
    summary: "Three invitations and three districts. The party cannot be in all of them and the choice is the session.",
    pins: [
      { session: "Session 10: City of White Stone, Black Shadow", beat: 1, at: "plaza" },
      { session: "Session 10: City of White Stone, Black Shadow", beat: 2, at: "north" },
      { session: "Session 10: City of White Stone, Black Shadow", beat: 3, at: "west" },
      { session: "Session 10: City of White Stone, Black Shadow", beat: 4, at: "east" }
    ],
    next: "great-library"
  },
  {
    id: "great-library",
    arc: "arc-two",
    name: "Palanthas · The Great Library",
    archetype: "library", cols: 30, rows: 28, darkness: DUSK,
    summary: "Astinus will see them, refuse them, correct them, and teach them something none of them asked for.",
    tokens: [{ actor: "Astinus of Palanthas", at: "desk" }],
    pins: [
      { session: "Session 11: Astinus", beat: 1, at: "desk" },
      { session: "Session 11: Astinus", beat: 2, at: "desk" },
      { session: "Session 11: Astinus", beat: 3, at: "reading" },
      { session: "Session 11: Astinus", beat: 4, at: "stacks" }
    ],
    next: "library-archive"
  },
  {
    id: "library-archive",
    arc: "arc-two",
    name: "The Great Library · The Missing Record",
    archetype: "library", cols: 28, rows: 26, darkness: DUSK,
    summary: "An audit of what is not there. The gap in the Chronicle is the clue, and the harbour is where it leads.",
    pins: [
      { session: "Session 12: The Missing Record", beat: 1, at: "stacks" },
      { session: "Session 12: The Missing Record", beat: 2, at: "desk" },
      { session: "Session 12: The Missing Record", beat: 3, at: "entrance" },
      { session: "Session 12: The Missing Record", beat: 4, at: "reading" }
    ],
    next: "shoikan-perimeter"
  },
  {
    id: "shoikan-perimeter",
    arc: "arc-two",
    name: "Shoikan Grove · The Perimeter",
    archetype: "grove", cols: 28, rows: 30, darkness: NIGHT,
    summary: "The boundary. Everything up to the first trees, and the moment the token comes out.",
    pins: [
      { session: "Session 13: Shoikan Perimeter", beat: 1, at: "gate" },
      { session: "Session 13: Shoikan Perimeter", beat: 2, at: "gate" },
      { session: "Session 13: Shoikan Perimeter", beat: 3, at: "path" },
      { session: "Session 13: Shoikan Perimeter", beat: 4, at: "clearing" }
    ],
    next: "shoikan-interior"
  },
  {
    id: "shoikan-interior",
    arc: "arc-two",
    name: "Shoikan Grove · The Grove Answers",
    archetype: "grove", cols: 30, rows: 36, darkness: UNLIT,
    summary: "Inside. The Grove responds to who they are rather than what they carry, and at the far end it lets them through.",
    pins: [
      { session: "Session 14: The Grove Answers", beat: 1, at: "path" },
      { session: "Session 14: The Grove Answers", beat: 2, at: "clearing" },
      { session: "Session 14: The Grove Answers", beat: 3, at: "far" },
      { session: "Session 14: The Grove Answers", beat: 4, at: "far" }
    ],
    next: "palanthas-dead-wizard"
  },
  ...VINGARD,
  ...ARCS_THREE_TO_SIX
];

/** Every scene that needs a map generated, as the generator's plan format. */
export function generatorPlan() {
  return {
    scenes: SCENES.filter(s => s.archetype).map(s => ({
      id: s.id,
      archetype: s.archetype,
      cols: s.cols,
      rows: s.rows,
      ...(s.palette ? { palette: s.palette } : {})
    }))
  };
}
