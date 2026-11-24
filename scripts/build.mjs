import { compilePack } from "@foundryvtt/foundryvtt-cli";
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
  "campaign-bible.json", "campaign-timeline.json", "arc-one.json",
  "arc-two.json", "arc-three.json", "arcs-four-five-six.json",
  "arc-four.json", "arc-five.json", "arc-six.json",
  "history.json", "master.json", "test.json", "tower.json",
  "moons.json", "items.json", "npcs.json", "adventure.json",
  "road-guide.json", "route-solamnic.json", "route-lemish.json", "route-elven.json",
  "session-zero.json", "session-zero-player.json", "spells-guide.json",
  "bestiary-gallery.json",
  "legacy-guide.json",
  "legacy-player-alice.json", "legacy-player-solanthis.json", "legacy-player-jinx.json",
  "legacy-player-sylas.json", "legacy-player-clipper.json", "legacy-player-kattal.json"
];

const slug = s => s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();

fs.rmSync(SOURCE, { recursive: true, force: true });
fs.mkdirSync(SOURCE, { recursive: true });

let pageTotal = 0;

FILES.forEach((file, journalIndex) => {
  const raw = JSON.parse(fs.readFileSync(path.join(CONTENT, file), "utf8"));
  const journalId = makeId(`journal:${raw.name}`);

  const pages = raw.pages.map((page, pageIndex) => {
    const pageId = makeId(`page:${raw.name}:${page.name}`);
    return {
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
      _stats: {},
      // The CLI reads _key off every document in the hierarchy, parent and
      // embedded alike. Embedded keys are !<parent>.<collection>!<parentId>.<childId>
      _key: `!journal.pages!${journalId}.${pageId}`
    };
  });

  const journal = {
    _id: journalId,
    name: raw.name,
    // compilePack maps this down to an array of page IDs in the stored value,
    // but it must be present — a journal packed without it renders blank.
    pages,
    folder: null,
    sort: (journalIndex + 1) * 100000,
    // Player-facing reference journals mirror the runtime installer; campaign and GM runbooks remain GM-only.
    ownership: { default: ["history.json", "spells-guide.json", "session-zero-player.json"].includes(file) ? 2 : 0 },
    flags: {},
    _stats: {},
    _key: `!journal!${journalId}`
  };

  fs.writeFileSync(path.join(SOURCE, `${slug(raw.name)}.json`), JSON.stringify(journal, null, 2));
  pageTotal += pages.length;
});

fs.rmSync(PACK, { recursive: true, force: true });
await compilePack(SOURCE, PACK, { recursive: false, log: false });

// Strip LevelDB runtime artifacts before release.
for (const f of ["LOCK", "LOG", "LOG.old"]) fs.rmSync(path.join(PACK, f), { force: true });

console.log(`Packed ${FILES.length} journals / ${pageTotal} pages -> packs/wayreth-journals`);
