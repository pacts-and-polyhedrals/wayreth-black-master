/**
 * Checks on the scene layer.
 *
 * The failure modes here are quiet ones. A pin that points at a journal page
 * whose name has drifted opens nothing and says nothing about why. A token
 * naming an actor that is not in the bestiary vanishes at install. A handout
 * that quotes GM prose leaks the answer key into the players' chat log and
 * nobody notices until it has happened.
 *
 * So each of those is asserted rather than trusted.
 */

import fs from "node:fs";
import path from "node:path";
import { SCENES } from "./lib/scene-plan.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, "content", f), "utf8"));

const scenes = read("scenes.json");
const handouts = read("handouts.json").handouts;
const creatures = new Set(read("creatures.json").actors.map(a => a.name));

const problems = [];
const assert = (ok, message) => { if (!ok) problems.push(message); };

// Journal pages, by arc, so a pin can be checked against a real page name.
const pagesByArc = {};
for (const arc of ["arc-one", "arc-two", "arc-three", "arc-four", "arc-five", "arc-six",
                   "vingard-road"]) {
  const file = path.join(ROOT, "content", `${arc}.json`);
  if (!fs.existsSync(file)) continue;
  pagesByArc[arc] = new Map(
    JSON.parse(fs.readFileSync(file, "utf8")).pages.map(p => [p.name, p])
  );
}

// --- every pin resolves ----------------------------------------------------
let pinCount = 0;
for (const scene of scenes.scenes) {
  const plan = SCENES.find(s => s.id === scene.key);
  assert(Boolean(plan), `${scene.key}: in scenes.json but not in the plan`);
  for (const [i, note] of scene.notes.entries()) {
    pinCount += 1;
    const { journalKey, pageName } = note.flags["wayreth-black-master"];
    const pages = pagesByArc[journalKey];
    assert(Boolean(pages), `${scene.key} pin ${i + 1}: unknown journal "${journalKey}"`);
    assert(pages?.has(pageName),
      `${scene.key} pin ${i + 1}: no page named "${pageName}" in ${journalKey}.json`);
    assert(note.x >= 0 && note.x <= scene.width && note.y >= 0 && note.y <= scene.height,
      `${scene.key} pin ${i + 1} ("${note.text}") sits off the map at ${note.x},${note.y}`);
    assert(Boolean(note.text), `${scene.key} pin ${i + 1} has no label`);
  }
}

// --- every token is a real creature ---------------------------------------
let tokenCount = 0;
for (const scene of scenes.scenes) {
  for (const token of scene.tokens) {
    tokenCount += 1;
    assert(creatures.has(token.actorName),
      `${scene.key}: token "${token.actorName}" is not in the bestiary`);
    assert(token.x >= 0 && token.x <= scene.width && token.y >= 0 && token.y <= scene.height,
      `${scene.key}: token "${token.actorName}" sits off the map`);
    assert(token.hidden === true,
      `${scene.key}: token "${token.actorName}" is visible; tokens arrive hidden so a `
      + "GM reveals them rather than a player seeing the encounter on load");
  }
}

// --- the map art exists and matches the scene -----------------------------
for (const scene of scenes.scenes) {
  const img = path.join(ROOT, scene.img);
  assert(fs.existsSync(img), `${scene.key}: map image missing at ${scene.img}`);
  assert(scene.width % 100 === 0 && scene.height % 100 === 0,
    `${scene.key}: ${scene.width}x${scene.height} is not a whole number of grid squares`);
  assert(scene.grid.size === 100 && scene.grid.distance === 5,
    `${scene.key}: grid must be 100px to 5 feet`);
}

// --- walls are real segments ----------------------------------------------
for (const scene of scenes.scenes) {
  for (const w of scene.walls) {
    if (w.c[0] === w.c[2] && w.c[1] === w.c[3]) {
      problems.push(`${scene.key}: a wall segment has zero length`);
      break;
    }
  }
  const doors = scene.walls.filter(w => w.door === 1).length;
  const plan = SCENES.find(s => s.id === scene.key);
  if (plan?.archetype && ["tower-hall", "tower-chamber", "interior", "library", "fortress"]
      .includes(plan.archetype)) {
    assert(doors > 0, `${scene.key} is an enclosed ${plan.archetype} with no door; `
      + "the party cannot get in");
  }
}

// --- scene chaining --------------------------------------------------------
const keys = new Set(scenes.scenes.map(s => s.key));
let terminal = 0;
for (const scene of scenes.scenes) {
  const next = scene.flags["wayreth-black-master"].next;
  if (next === null) { terminal += 1; continue; }
  assert(keys.has(next), `${scene.key}: chains to "${next}", which does not exist`);
}
assert(terminal === 1,
  `exactly one scene should end the chain, found ${terminal}`);

// --- handouts: complete coverage, and no GM material ----------------------
const wanted = new Set();
for (const scene of scenes.scenes) {
  scene.notes.forEach((_, i) => wanted.add(`${scene.key}#${i + 1}`));
}
const have = new Set(handouts.map(h => `${h.scene}#${h.pin}`));
for (const key of wanted) {
  assert(have.has(key), `no player handout for pin ${key}`);
}
for (const key of have) {
  assert(wanted.has(key), `handout ${key} has no pin to hang on`);
}

/**
 * The hard guarantee the GM asked for: nothing a player receives may come from
 * the GM-only sections of a journal page. Rather than trust that, every
 * handout is checked against the actual GM prose — a sentence of eight words
 * or more appearing in both is a leak.
 */
const gmProse = [];
for (const [arc, pages] of Object.entries(pagesByArc)) {
  for (const page of pages.values()) {
    const html = page.html ?? page.text?.content ?? "";
    for (const section of ["Tracker Guidance", "What Can Be Learned", "Narrative Thread",
                           "DM Note", "People in Play"]) {
      const found = new RegExp(`<h3>${section}[^<]*</h3>([\\s\\S]*?)(?=<h3>|$)`).exec(html);
      if (found) gmProse.push(found[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase());
    }
  }
}
const gmBlob = gmProse.join(" \u0000 ");
for (const h of handouts) {
  const body = [h.read, ...(h.players_know ?? [])].join(" ");
  for (const sentence of body.split(/[.!?]\s+/)) {
    const words = sentence.trim().toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/);
    if (words.length < 8) continue;
    for (let i = 0; i + 8 <= words.length; i += 1) {
      const run = words.slice(i, i + 8).join(" ");
      if (gmBlob.includes(run)) {
        problems.push(`handout ${h.scene}#${h.pin} repeats GM text: "${run}"`);
        break;
      }
    }
  }
  assert(Boolean(h.title && h.read), `handout ${h.scene}#${h.pin} is missing a title or read-aloud`);
  assert(!/\bDC\s*\d|\bTracker\b|\bGM\b|\bDM\b/i.test(body),
    `handout ${h.scene}#${h.pin} mentions GM machinery; players should not see DCs or tracker talk`);
}

// --- the installer actually installs them ---------------------------------
const installer = fs.readFileSync(path.join(ROOT, "scripts", "wayreth-journals.mjs"), "utf8");
const sceneCode = fs.readFileSync(path.join(ROOT, "scripts", "wayreth-scenes.mjs"), "utf8");
assert(installer.includes("installScenes"),
  "the reinstall must install scenes");
assert(sceneCode.includes("scenes.json") && sceneCode.includes("handouts.json"),
  "the scene installer must load both scenes.json and handouts.json");
// The guarantee, enforced in code rather than in prose: the thing that builds
// a player chat card may not read a journal.
const sendRegion = /function handoutCard\([\s\S]*?export async function sendHandout[\s\S]*?\n\}/.exec(sceneCode)?.[0] ?? "";
assert(sendRegion && !/game\.journal|JournalEntry|\.pages\b/.test(sendRegion),
  "sendHandout must build cards from handouts.json alone and never touch a journal");

if (problems.length) {
  console.error(`Scene validation failed (${problems.length}):\n- ` + problems.join("\n- "));
  process.exit(1);
}

console.log(`Scene validation passed. ${scenes.scenes.length} scenes, ${pinCount} pins, `
  + `${tokenCount} tokens, ${handouts.length} player handouts, `
  + `${scenes.scenes.reduce((n, s) => n + s.walls.length, 0)} walls.`);
