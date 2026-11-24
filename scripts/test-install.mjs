/**
 * Runs the scene installer against the real content, outside Foundry.
 *
 * 1.34.0 shipped with the scene install sitting after a `return` — dead code,
 * patched in by a regex that put it before the closing brace of a function
 * that had already returned. Everything validated, because every validator
 * checked the *content* and nothing checked that the installer would run.
 *
 * So this stubs out enough of Foundry to execute installScenes for real:
 * fetch, game.journal, the actor pack, Scene.create, Folder.create. It then
 * asserts the scenes that come out the other side are the scenes that should
 * — folders, pins resolved to page ids, tokens resolved to actor ids, walls
 * and lights carried through.
 *
 * It cannot prove the module loads in Foundry. It can prove the install path
 * executes end to end against the shipped files, which is where the last bug
 * was and where the next one is most likely to be.
 *
 *     node scripts/test-install.mjs
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MODULE = "wayreth-black-master";

let nextId = 0;
const id16 = () => `t${String(nextId++).padStart(15, "0")}`;

const problems = [];
const assert = (ok, message) => { if (!ok) problems.push(message); };

// --- the parts of Foundry the installer touches ---------------------------

globalThis.fetch = async url => {
  const file = path.join(ROOT, String(url).replace(`modules/${MODULE}/`, ""));
  if (!fs.existsSync(file)) return { ok: false, status: 404 };
  return { ok: true, status: 200, json: async () => JSON.parse(fs.readFileSync(file, "utf8")) };
};

const createdScenes = [];
const createdFolders = [];

class FakeScene {
  constructor(data) {
    Object.assign(this, data);
    this.id = id16();
    // Foundry turns create-data notes into documents with ids and getFlag;
    // the fake has to as well, or the refresh path is never really exercised.
    this.notes = (this.notes ?? []).map(n => ({ ...n, id: n._id ?? id16(),
      getFlag: (sc, k) => n.flags?.[sc]?.[k] }));
  }
  static async create(data) { const s = new FakeScene(data); createdScenes.push(s); return s; }
  getFlag(scope, key) { return this.flags?.[scope]?.[key]; }
  async update(data) { Object.assign(this, data); return this; }
  async delete() { return this; }
  async view() { return this; }
  async deleteEmbeddedDocuments(type, ids) {
    this.notes = (this.notes ?? []).filter(n => !ids.includes(n.id));
    return [];
  }
  async createEmbeddedDocuments(type, docs) {
    const made = docs.map(d => ({ ...d, id: id16(),
      getFlag: (s, k) => d.flags?.[s]?.[k] }));
    this.notes = (this.notes ?? []).concat(made);
    return made;
  }
}
globalThis.Scene = FakeScene;

globalThis.Folder = {
  async create(data) {
    const f = { ...data, id: id16(), getFlag: (s, k) => data.flags?.[s]?.[k] };
    createdFolders.push(f);
    // Foundry registers a created folder in game.folders, and the installer
    // looks there before making another. The fake has to do the same or a
    // second install appears to duplicate every folder.
    game.folders.push(f);
    return f;
  }
};

globalThis.ChatMessage = { async create(data) { return data; } };
globalThis.Dialog = class { constructor() {} render() {} };
globalThis.Hooks = { on() {}, once() {} };
globalThis.foundry = { utils: { escapeHTML: s => s } };
globalThis.ui = {
  notifications: {
    info: m => console.log(`  [info] ${m}`),
    warn: m => { console.log(`  [warn] ${m}`); problems.push(`installer warned: ${m}`); },
    error: m => { console.log(`  [error] ${m}`); problems.push(`installer errored: ${m}`); }
  }
};
globalThis.canvas = { scene: null };

// Journals, as the installer would find them after installJournals.
const journals = [];
for (const file of fs.readdirSync(path.join(ROOT, "content"))) {
  if (!file.endsWith(".json")) continue;
  let doc;
  try { doc = JSON.parse(fs.readFileSync(path.join(ROOT, "content", file), "utf8")); }
  catch { continue; }
  if (!Array.isArray(doc.pages)) continue;
  journals.push({
    id: id16(),
    name: doc.name,
    pages: doc.pages.map(p => ({ id: id16(), name: p.name })),
    getFlag: (scope, key) => (scope === MODULE && key === "sourceFile" ? file : undefined)
  });
}

// The bestiary, as the installer would find it in the world pack.
const actors = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "creatures.json"), "utf8"))
  .actors.map(a => ({ id: id16(), name: a.name, img: a.img, prototypeToken: a.prototypeToken ?? {} }));

globalThis.game = {
  user: { isGM: true },
  journal: journals,
  actors: [],
  scenes: [],
  folders: [],
  modules: new Map([[MODULE, { version: JSON.parse(fs.readFileSync(path.join(ROOT, "module.json"), "utf8")).version, api: {} }]]),
  packs: new Map([[`world.wayreth-creatures`, { getDocuments: async () => actors }]])
};
game.modules.get = k => (k === MODULE ? game.modules.values().next().value : undefined);

// --- run it ----------------------------------------------------------------

const { installScenes, sendHandout } = await import("./wayreth-scenes.mjs");

console.log("Running installScenes() against the shipped content…");
const count = await installScenes({ notify: true, force: true });

const plan = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "scenes.json"), "utf8"));
assert(createdScenes.length === plan.scenes.length,
  `installed ${createdScenes.length} scenes, the content file has ${plan.scenes.length}`);
assert(count === plan.scenes.length, `installScenes returned ${count}`);
assert(createdFolders.length === plan.folders.length,
  `created ${createdFolders.length} folders, expected ${plan.folders.length}`);

let pins = 0;
let tokens = 0;
for (const scene of createdScenes) {
  assert(Boolean(scene.folder), `${scene.name}: no folder`);
  assert(typeof scene.background?.src === "string"
    && scene.background.src.startsWith(`modules/${MODULE}/assets/maps/`)
    || scene.background?.src?.includes("assets/"),
    `${scene.name}: background is ${scene.background?.src}`);
  assert(scene.width > 0 && scene.height > 0, `${scene.name}: no dimensions`);
  assert(Array.isArray(scene.walls), `${scene.name}: walls missing`);
  for (const note of scene.notes ?? []) {
    pins += 1;
    assert(Boolean(note.entryId), `${scene.name}: a pin has no journal`);
    assert(Boolean(note.pageId), `${scene.name}: a pin has no page`);
    const journal = journals.find(j => j.id === note.entryId);
    assert(Boolean(journal?.pages.find(p => p.id === note.pageId)),
      `${scene.name}: a pin points at a page that is not in its journal`);
  }
  for (const token of scene.tokens ?? []) {
    tokens += 1;
    assert(Boolean(token.actorId), `${scene.name}: token "${token.name}" has no actor`);
    assert(actors.some(a => a.id === token.actorId),
      `${scene.name}: token "${token.name}" points at no bestiary actor`);
    assert(token.hidden === true, `${scene.name}: token "${token.name}" is not hidden`);
  }
}

const expectedPins = plan.scenes.reduce((n, s) => n + s.notes.length, 0);
const expectedTokens = plan.scenes.reduce((n, s) => n + s.tokens.length, 0);
assert(pins === expectedPins, `resolved ${pins} pins, expected ${expectedPins}`);
assert(tokens === expectedTokens, `resolved ${tokens} tokens, expected ${expectedTokens}`);

// A second install must refresh the scenes rather than stack a second copy,
// and must leave the GM's own tokens and drawings alone.
game.scenes = createdScenes;
const before = createdScenes.length;
for (const s of createdScenes) s.tokens = (s.tokens ?? []).concat([{ id: id16(), name: "GM's own token" }]);
await installScenes({ notify: false, force: false });
assert(createdScenes.length === before,
  `a second install created ${createdScenes.length - before} duplicate scene(s)`);
assert(createdScenes.every(s => (s.tokens ?? []).some(t => t.name === "GM's own token")),
  "a refresh discarded a token the GM had placed");
assert(createdScenes.every(s => (s.notes ?? []).length
  === plan.scenes.find(p => p.key === s.flags[MODULE].sceneKey).notes.length),
  "a refresh left the wrong number of pins on a scene");

// A handout must reach chat without any journal in the path.
const card = await sendHandout(plan.scenes[0].key, 1);
assert(Boolean(card?.content), "sendHandout produced no chat card");
assert(!/Tracker Guidance|What Can Be Learned|Narrative Thread/.test(card?.content ?? ""),
  "a handout card carried GM section text");

// --- the dead-code trap that shipped in 1.34.0 ----------------------------
const installer = fs.readFileSync(path.join(ROOT, "scripts", "wayreth-journals.mjs"), "utf8");
const body = /async function reinstallContent\([\s\S]*?\n\}/.exec(installer)?.[0] ?? "";
const callAt = body.indexOf("installScenes(");
const returnAt = body.indexOf("\n  return {");
assert(callAt > 0, "reinstallContent does not call installScenes");
assert(returnAt > callAt,
  "installScenes is called after reinstallContent returns — it is dead code, "
  + "which is exactly how 1.34.0 shipped with no scenes");

if (problems.length) {
  console.error(`\nInstall test failed (${problems.length}):\n- ` + problems.join("\n- "));
  process.exit(1);
}
console.log(`\nInstall test passed. ${createdScenes.length} scenes in ${createdFolders.length} folders, `
  + `${pins} pins resolved to real journal pages, ${tokens} tokens resolved to real actors, `
  + "and a handout reached chat without touching a journal.");
