import { ClassicLevel } from "classic-level";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT = path.join(ROOT, "content");
const SOURCE = path.join(ROOT, "packs", "_source");
const PACK = path.join(ROOT, "packs", "wayreth-journals");

// Foundry document IDs: 16 chars, alphanumeric. Deterministic from name so
// rebuilds keep stable IDs and don't duplicate entries on module update.
const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function makeId(seed) {
  const hash = crypto.createHash("sha256").update(seed).digest();
  let id = "";
  for (let i = 0; i < 16; i++) id += ALPHABET[hash[i] % ALPHABET.length];
  return id;
}

const FILES = [
  "history.json",
  "master.json",
  "test.json",
  "tower.json",
  "moons.json",
  "items.json",
  "npcs.json",
  "adventure.json"
];

const journals = [];
const pages = [];

FILES.forEach((file, journalIndex) => {
  const raw = JSON.parse(fs.readFileSync(path.join(CONTENT, file), "utf8"));
  const journalId = makeId(`journal:${raw.name}`);

  journals.push({
    _id: journalId,
    name: raw.name,
    folder: null,
    sort: (journalIndex + 1) * 100000,
    ownership: { default: 2 }, // OBSERVER: players can read, secrets stay hidden
    flags: {},
    _key: `!journal!${journalId}`
  });

  raw.pages.forEach((page, pageIndex) => {
    const pageId = makeId(`page:${raw.name}:${page.name}`);
    pages.push({
      _id: pageId,
      name: page.name,
      type: "text",
      title: { show: true, level: 1 },
      text: { format: 1, content: `<div class="wayreth-journal">\n${page.html}\n</div>` },
      image: {},
      video: { controls: true, volume: 0.5 },
      src: null,
      system: {},
      sort: (pageIndex + 1) * 100000,
      ownership: { default: -1 },
      flags: {},
      _key: `!journal.pages!${journalId}.${pageId}`
    });
  });
});

// Write human-editable source JSON alongside the built pack, so the module can
// be rebuilt or hand-edited later without going back through the content files.
fs.mkdirSync(SOURCE, { recursive: true });
for (const j of journals) {
  const own = pages.filter(p => p._key.includes(`!${j._id}.`));
  fs.writeFileSync(
    path.join(SOURCE, `${j.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`),
    JSON.stringify({ ...j, pages: own }, null, 2)
  );
}

// Build the LevelDB pack.
fs.rmSync(PACK, { recursive: true, force: true });
const db = new ClassicLevel(PACK, { valueEncoding: "json" });
await db.open();
const batch = db.batch();
for (const doc of [...journals, ...pages]) {
  const { _key, ...value } = doc;
  batch.put(_key, value);
}
await batch.write();
await db.close();

console.log(`Packed ${journals.length} journals / ${pages.length} pages -> packs/wayreth-journals`);
