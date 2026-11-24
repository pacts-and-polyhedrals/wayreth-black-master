import fs from "node:fs";
import path from "node:path";
import dragonarmy from "./lib/roster-dragonarmy.mjs";
import dragons from "./lib/roster-dragons.mjs";
import dragonsExtended from "./lib/roster-dragons-extended.mjs";
import solamnia from "./lib/roster-solamnia.mjs";
import abyss from "./lib/roster-abyss.mjs";
import named from "./lib/roster-named.mjs";
import worlds from "./lib/roster-worlds.mjs";
import abyssalWyrms, { repairedActivityIds, repairedSaveActivities } from "./lib/roster-abyssal-wyrms.mjs";
import { profFor } from "./lib/statblock.mjs";
import { readSpellcasting, spellNames } from "./lib/spellcasting.mjs";

// CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER and CONST.TOKEN_DISPOSITIONS.HOSTILE.
// Spelled out because this runs in Node, not in Foundry.
const CONST_TOKEN_DISPLAY_OWNER_HOVER = 20;
const DISPOSITION_HOSTILE = -1;

const actors = [...dragonarmy, ...dragons, ...dragonsExtended, ...solamnia, ...abyss,
                ...named, ...worlds, ...abyssalWyrms];

/* ------------------------------------------------------------------ *
 *  Art
 *
 *  Each creature gets its portrait as the actor image and a square token.
 *  The portraits are 1024x1536 full-body figures, which Foundry would squash
 *  into a grid cell, so tools/make-tokens.py pads each one out to a square and
 *  assets/tokens holds the result.
 *
 *  Files are matched to creatures by name rather than by the number in the
 *  filename, and a creature with no art — or art with no creature — fails the
 *  build, so the set cannot quietly drift out of step with the bestiary.
 * ------------------------------------------------------------------ */

const ART_DIR = "assets/bestiary";
const TOKEN_DIR = "assets/tokens";
const MODULE_PATH = "modules/wayreth-black-master";

const normalise = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function listWebpRecursive(dir) {
  const files = [];
  const walk = (base, relative = "") => {
    for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
      const rel = relative ? `${relative}/${entry.name}` : entry.name;
      const full = path.join(base, entry.name);
      if (entry.isDirectory()) walk(full, rel);
      else if (entry.isFile() && entry.name.endsWith(".webp")) files.push(rel);
    }
  };
  walk(dir);
  return files.sort();
}

const artKey = relativeFile => normalise(
  path.basename(relativeFile)
    .replace(/^CR\d+(?:\.\d+)?_\d+_/i, "")
    .replace(/^\d+_/, "")
    .replace(/\.webp$/i, "")
);

// Foundry measures a token in grid squares; dnd5e sizes map straight onto it.
const TOKEN_SQUARES = { tiny: 0.5, sm: 1, med: 1, lg: 2, huge: 3, grg: 4 };

const artByName = new Map();
for (const file of listWebpRecursive(ART_DIR)) {
  const key = artKey(file);
  if (artByName.has(key)) throw new Error(`Two art files resolve to "${key}"`);
  artByName.set(key, file);
}

const artProblems = [];
const claimed = new Set();
for (const actor of actors) {
  const file = artByName.get(normalise(actor.name));
  if (!file) {
    artProblems.push(`${actor.name}: no portrait in ${ART_DIR}`);
    continue;
  }
  const tokenDisk = path.join(TOKEN_DIR, ...file.split("/"));
  if (!fs.existsSync(tokenDisk)) {
    artProblems.push(`${actor.name}: ${file} has no token — run tools/make-tokens.py`);
    continue;
  }
  claimed.add(file);

  // Size sets the default, but a creature that arrived with a deliberately
  // larger token keeps it: the abyssal wyrms are drawn at 6 squares because
  // they are meant to dwarf the ancient dragons sharing their folder.
  const minimum = TOKEN_SQUARES[actor.system.traits.size] ?? 1;
  const declared = actor.prototypeToken?.width ?? 0;
  const squares = Math.max(minimum, declared);
  actor.img = `${MODULE_PATH}/${ART_DIR}/${file}`;
  actor.prototypeToken = {
    name: actor.name,
    displayName: CONST_TOKEN_DISPLAY_OWNER_HOVER,
    actorLink: false,
    width: squares,
    height: squares,
    texture: {
      src: `${MODULE_PATH}/${TOKEN_DIR}/${file}`,
      anchorX: 0.5, anchorY: 0.5, offsetX: 0, offsetY: 0,
      scaleX: 1, scaleY: 1, rotation: 0, tint: "#ffffff"
    },
    sight: { enabled: false },
    disposition: DISPOSITION_HOSTILE,
    displayBars: CONST_TOKEN_DISPLAY_OWNER_HOVER,
    bar1: { attribute: "attributes.hp" },
    bar2: { attribute: null },
    flags: {}
  };
}
for (const file of artByName.values()) {
  if (!claimed.has(file)) artProblems.push(`${file}: art for no creature in the bestiary`);
}
if (artProblems.length) {
  console.error("ART PROBLEMS:\n- " + artProblems.join("\n- "));
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 *  Spellcasting
 *
 *  Every caster described its spells in prose and had none assigned, so the
 *  sheet offered slots with nothing to put in them. The list is read out of
 *  the text that already names it and recorded on the actor; the installer
 *  resolves those names against dnd5e's own spell compendium at install time
 *  and embeds real spells, which is better than this module restating 64
 *  spell descriptions it does not need to own.
 * ------------------------------------------------------------------ */

const spellProblems = [];
let castersWithSpells = 0;
let spellReferences = 0;

for (const actor of actors) {
  const lists = [];
  for (const item of actor.items) {
    const parsed = readSpellcasting(item.system?.description?.value);
    if (!parsed) continue;
    const named = (item.system.description.value.match(/<em>/g) ?? []).length;
    const captured = parsed.groups.reduce((n, g) => n + g.spells.length, 0);
    if (named !== captured) {
      spellProblems.push(`${actor.name} / ${item.name}: names ${named} spells, read ${captured}`);
    }
    lists.push({ feature: item.name, ...parsed });
  }
  if (!lists.length) continue;
  actor.flags["wayreth-black-master"].spellcasting = lists;
  castersWithSpells += 1;
  spellReferences += lists.reduce((n, l) => n + spellNames(l).length, 0);
}

// A caster level with no spell list means slots on the sheet and nothing to
// cast; a spell list with no ability means the DC cannot be worked out.
for (const actor of actors) {
  const flags = actor.flags["wayreth-black-master"];
  const level = actor.system.details.spellLevel;
  const ability = actor.system.attributes.spellcasting;
  if (level && !flags.spellcasting) {
    spellProblems.push(`${actor.name}: ${level}th-level caster with no spell list`);
  }
  if (flags.spellcasting && !ability) {
    spellProblems.push(`${actor.name}: has a spell list but no spellcasting ability`);
  }
}

if (spellProblems.length) {
  console.error("SPELLCASTING PROBLEMS:\n- " + spellProblems.join("\n- "));
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 *  Order
 *
 *  The bestiary reads by creature type, and within a type by ascending
 *  challenge, so the compendium opens as a ladder rather than an alphabetical
 *  jumble with an ancient dragon next to an apprentice.
 *
 *  Each actor is tagged with its type folder and given a sort value; the
 *  installer creates the folders in the pack and sets them to manual sorting
 *  so these values are what the browser obeys.
 * ------------------------------------------------------------------ */

const TYPE_FOLDERS = {
  aberration: "Aberration", beast: "Beast", dragon: "Dragon", fiend: "Fiend",
  humanoid: "Humanoid", plant: "Plant", undead: "Undead"
};

const orderProblems = [];
const byType = new Map();
for (const actor of actors) {
  const key = actor.system.details.type.value;
  const folder = TYPE_FOLDERS[key];
  if (!folder) {
    orderProblems.push(`${actor.name}: creature type "${key}" has no folder`);
    continue;
  }
  if (!byType.has(folder)) byType.set(folder, []);
  byType.get(folder).push(actor);
}
for (const [folder, members] of byType) {
  members.sort((a, b) => {
    const delta = a.system.details.cr - b.system.details.cr;
    return delta !== 0 ? delta : a.name.localeCompare(b.name);
  });
  // Foundry spaces manual sort values out so a document can be dropped between
  // two others without renumbering the rest.
  members.forEach((actor, index) => {
    actor.sort = (index + 1) * 100000;
    actor.flags["wayreth-black-master"].typeFolder = folder;
    actor.flags["wayreth-black-master"].sortCR = actor.system.details.cr;
  });
}
if (orderProblems.length) {
  console.error("ORDER PROBLEMS:\n- " + orderProblems.join("\n- "));
  process.exit(1);
}

// Write the actors out in reading order too, so content/creatures.json and
// everything generated from it already run type-then-CR.
actors.sort((a, b) => {
  const fa = a.flags["wayreth-black-master"].typeFolder;
  const fb = b.flags["wayreth-black-master"].typeFolder;
  if (fa !== fb) return fa.localeCompare(fb);
  return a.sort - b.sort;
});

// --- integrity checks before writing ---
const problems = [];
const ids = new Set();
for (const a of actors) {
  if (a.type !== "npc") problems.push(`${a.name}: not an npc`);
  if (a._id.length !== 16) problems.push(`${a.name}: bad id`);
  if (ids.has(a._id)) problems.push(`${a.name}: duplicate id`);
  ids.add(a._id);
  if (!a.system.details.cr && a.system.details.cr !== 0) problems.push(`${a.name}: no CR`);
  if (!a.items.length) problems.push(`${a.name}: no actions`);
  const itemIds = new Set();
  for (const it of a.items) {
    if (itemIds.has(it._id)) problems.push(`${a.name}: duplicate item id on ${it.name}`);
    itemIds.add(it._id);
  }
  // Only catch gross errors. Published monsters vary widely around the DMG
  // band — a CR 1 dire wolf has 37 hp — so a tight check produces false hits.
  const cr = a.system.details.cr;
  const hp = a.system.attributes.hp.max;
  if (cr >= 2 && (hp < cr * 7 || hp > cr * 32)) problems.push(`${a.name}: hp ${hp} is far outside the band for CR ${cr}`);
  const ac = a.system.attributes.ac.flat;
  // 22 was the ceiling while the ancient dragons were the top of the bestiary.
  // The abyssal wyrms sit above them at CR 25-27, where AC 23 is in band.
  if (ac < 10 || ac > 24) problems.push(`${a.name}: AC ${ac} is out of range`);
  if (profFor(cr) < 2) problems.push(`${a.name}: bad proficiency for CR ${cr}`);
}
if (problems.length) { console.error("PROBLEMS:\n- " + problems.join("\n- ")); process.exit(1); }

fs.writeFileSync("content/creatures.json", JSON.stringify({ actors }, null, 2) + "\n");

// assets/bestiary/INDEX.csv is a human-readable map of the art set. It was a
// static file, which meant it silently went stale the moment a creature was
// added; it is written from the actors now so it cannot.
const csvCell = value => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
const indexRows = [["type", "cr", "name", "portrait", "token"].join(",")];
for (const actor of actors) {
  const flags = actor.flags["wayreth-black-master"];
  indexRows.push([
    flags.typeFolder,
    actor.system.details.cr,
    actor.name,
    actor.img.replace(`${MODULE_PATH}/`, ""),
    actor.prototypeToken.texture.src.replace(`${MODULE_PATH}/`, "")
  ].map(v => csvCell(String(v))).join(","));
}
fs.writeFileSync(`${ART_DIR}/INDEX.csv`, `${indexRows.join("\n")}\n`);

const groups = {};
for (const a of actors) {
  const g = a.flags["wayreth-black-master"].group;
  (groups[g] ??= []).push(`${a.name} (CR ${a.system.details.cr})`);
}
console.log(`Built ${actors.length} creatures -> content/creatures.json`);
console.log(`Every creature has a portrait and a square token.`);
console.log(`Ordered by creature type, then ascending CR.`);
if (repairedActivityIds) {
  console.log(`Repaired ${repairedActivityIds} imported activity ids that were not `
    + `16 characters and would have failed Foundry validation.`);
}
console.log(`${castersWithSpells} casters carry a spell list (${spellReferences} references), `
  + `resolved against dnd5e's spell compendium at install time.`);
if (repairedSaveActivities) {
  console.log(`Repaired ${repairedSaveActivities} imported activities that described a `
    + `saving throw but never rolled one.`);
}
console.log();
for (const [g, list] of Object.entries(groups)) {
  console.log(`${g} (${list.length})`);
  for (const n of list) console.log("   " + n);
}
