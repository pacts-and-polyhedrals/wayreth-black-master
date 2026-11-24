/**
 * Wayreth journal installer for Foundry v14.
 *
 * World journals are created through Foundry's document API so every page is
 * validated and hydrated by the running Foundry version.
 */

import { installScenes, registerSceneControls, sendHandout } from "./wayreth-scenes.mjs";

const MODULE = "wayreth-black-master";
const IMPORT_VERSION = 32;
const FOLDER_NAME = "Wayreth: The Black Master";
const ITEM_FOLDER_NAME = "Wayreth: Magic Items";
const SPELL_FOLDER_NAME = "Wayreth: Robe Spells";
const SPELL_ORDERS = ["White", "Red", "Black"];
const WORLD_ITEM_PACKS = {
  White: { name: "wayreth-white-robe-spells", label: "Wayreth — White Robe Spells" },
  Red: { name: "wayreth-red-robe-spells", label: "Wayreth — Red Robe Spells" },
  Black: { name: "wayreth-black-robe-spells", label: "Wayreth — Black Robe Spells" },
  MagicItems: { name: "wayreth-magic-items", label: "Wayreth — Magic Items" },
  Feats: { name: "wayreth-feats", label: "Wayreth — Orders & Feats" },
  Legacy: { name: "wayreth-legacy-items", label: "Wayreth — Crow Legacy Items" }
};
const LEGACY_ITEM_COUNT = 6;
const CONTENT_FILES = [
  "campaign-bible.json",
  "campaign-timeline.json",
  "arc-one.json",
  "arc-two.json",
  "arc-three.json",
  "arcs-four-five-six.json",
  "arc-four.json",
  "arc-five.json",
  "arc-six.json",
  "vingard-road.json",
  "history.json",
  "master.json",
  "test.json",
  "tower.json",
  "moons.json",
  "items.json",
  "bestiary-gallery.json",
  "legacy-guide.json",
  "legacy-player-alice.json",
  "legacy-player-solanthis.json",
  "legacy-player-jinx.json",
  "legacy-player-sylas.json",
  "legacy-player-clipper.json",
  "legacy-player-kattal.json",
  "npcs.json",
  "adventure.json",
  "road-guide.json",
  "route-solamnic.json",
  "route-lemish.json",
  "route-elven.json",
  "session-zero.json",
  "session-zero-player.json",
  "spells-guide.json"
];
const SOURCE_FILE_BY_NAME = new Map([
  ["Campaign Bible: Master of the Black Tower", "campaign-bible.json"],
  ["Campaign Timeline and Trackers", "campaign-timeline.json"],
  ["Arc I: The Road to Wayreth", "arc-one.json"],
  ["Arc II: The Black Master's Errand", "arc-two.json"],
  ["Arc III: The Spire of Lore and Doom", "arc-three.json"],
  ["Arcs IV–VI: Strategic Master Index", "arcs-four-five-six.json"],
  ["Arc IV: The Long Return", "arc-four.json"],
  ["Arc V: The War Beneath the War", "arc-five.json"],
  ["Arc VI: Master of Past and Present", "arc-six.json"],
  ["A History of High Sorcery", "history.json"],
  ["The Black Master of Wayreth", "master.json"],
  ["The Test of High Sorcery", "test.json"],
  ["The Forest and Tower of Wayreth", "tower.json"],
  ["Moons and Sanction", "moons.json"],
  ["The Vaults: Objects of High Sorcery", "items.json"],
  ["The Wayreth Bestiary: Illustrated", "bestiary-gallery.json"],
  ["The Crow Legacies", "legacy-guide.json"],
  ["Alice — The Crown of Little Wonders", "legacy-player-alice.json"],
  ["Solanthis — Ispin's Promise", "legacy-player-solanthis.json"],
  ["Jinx — The Coin That Lands Sideways", "legacy-player-jinx.json"],
  ["Sylas — The Shepherd's Lantern", "legacy-player-sylas.json"],
  ["Clipper — The Wayfarer's Knot", "legacy-player-clipper.json"],
  ["Kattal — Ispin's Unmoving Nail", "legacy-player-kattal.json"],
  ["The Court of Wayreth: Stat Blocks", "npcs.json"],
  ["Arc I Finale: The Errand of the Vessel", "adventure.json"],
  ["The Road to Wayreth: Thirty-Nine Days", "road-guide.json"],
  ["Route I: The Sailor’s Road", "route-solamnic.json"],
  ["Route II: The River and Heartland Road", "route-lemish.json"],
  ["Route III: The Wild Road", "route-elven.json"],
  ["Session 0: Old Friends, One Last Road", "session-zero.json"],
  ["Session 0 Player Guide & Table Rules", "session-zero-player.json"],
  ["The Robe Spellbooks of High Sorcery", "spells-guide.json"]
]);

/**
 * Stable, synchronous 32-bit string hash (FNV-1a). Used to fingerprint the
 * content this module installed, so a later update can tell the difference
 * between an untouched page and one the GM has edited.
 */
function contentHash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

function pageContent(page) {
  return `<div class="wayreth-journal">\n${page.html}\n</div>`;
}

function pageData(page, index) {
  return {
    name: page.name,
    type: "text",
    title: { show: true, level: 1 },
    text: {
      format: CONST.JOURNAL_ENTRY_PAGE_FORMATS?.HTML ?? 1,
      content: pageContent(page),
      markdown: ""
    },
    sort: (index + 1) * 100000,
    ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT },
    flags: { [MODULE]: { managed: true, contentHash: contentHash(pageContent(page)) } }
  };
}

const PLAYER_VISIBLE = [
  "history.json",
  "spells-guide.json",
  "session-zero-player.json",
  // One reference sheet per legacy item. These are visible to the whole party
  // rather than to one player each, because a module cannot know which user
  // plays which Crow. A GM who wants each of them private can set per-user
  // ownership on the individual journals after install.
  ...["alice", "solanthis", "jinx", "sylas", "clipper", "kattal"]
    .map(bearer => `legacy-player-${bearer}.json`)
];

function ownershipFor(source) {
  return PLAYER_VISIBLE.includes(source.sourceFile)
    ? CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER
    : CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE;
}

async function loadSources() {
  const sources = [];
  for (const file of CONTENT_FILES) {
    const response = await fetch(`modules/${MODULE}/content/${file}`);
    if (!response.ok) throw new Error(`Could not load ${file} (${response.status})`);
    const source = await response.json();
    if (!source?.name || !Array.isArray(source.pages) || !source.pages.length) {
      throw new Error(`${file} does not contain a valid journal with pages`);
    }
    sources.push({ ...source, sourceFile: file });
  }
  return sources;
}

async function loadItemSources() {
  const response = await fetch(`modules/${MODULE}/content/magic-items.json`);
  if (!response.ok) throw new Error(`Could not load magic-items.json (${response.status})`);
  const source = await response.json();
  if (!Array.isArray(source?.items) || source.items.length !== 30) {
    throw new Error("magic-items.json does not contain the expected 30 items");
  }
  return source.items;
}


const CREATURE_PACK = { name: "wayreth-creatures", label: "Wayreth — Bestiary" };

async function getOrCreateWorldActorPack() {
  const collection = `world.${CREATURE_PACK.name}`;
  let pack = game.packs.get(collection);
  if (pack) return pack;
  // v13 moved CompendiumCollection under foundry.documents.collections; the
  // global still works on v12. Resolve both, as the item packs do.
  const CompendiumClass = foundry.documents?.collections?.CompendiumCollection ?? globalThis.CompendiumCollection;
  if (!CompendiumClass?.createCompendium) throw new Error("Foundry CompendiumCollection API is unavailable");
  pack = await CompendiumClass.createCompendium({
    name: CREATURE_PACK.name,
    label: CREATURE_PACK.label,
    type: "Actor",
    system: "dnd5e",
    package: "world"
  });
  return pack;
}

async function loadCreatureSources() {
  const response = await fetch(`modules/${MODULE}/content/creatures.json`);
  if (!response.ok) throw new Error(`Could not load creatures.json (${response.status})`);
  const source = await response.json();
  if (!Array.isArray(source?.actors) || !source.actors.length) {
    throw new Error("creatures.json does not contain any actors");
  }
  return source.actors;
}

/**
 * Rebuilds the type folders inside the bestiary pack and returns their ids.
 *
 * Compendium folders landed in Foundry v11; on anything older this returns an
 * empty map and the actors simply sit at the pack root, sorted but unfoldered,
 * which is a cosmetic loss rather than a failure.
 */
/**
 * Gives every caster in the bestiary the spells its stat block describes.
 *
 * The lists were written in prose and nothing was assigned, so a Wizard of
 * High Sorcery arrived with slots and no spells in them. Rather than ship 64
 * spell descriptions this module has no reason to own, the names recorded on
 * each actor are resolved against dnd5e's own spell compendium at install
 * time; the two that are not in the SRD are carried in content/npc-spells.json.
 *
 * A name that cannot be resolved is reported rather than skipped silently —
 * a missing spell is invisible on a stat block that still describes it.
 */
async function loadSpellLibrary() {
  const library = new Map();

  // The module's own spells first, so they win over anything with the same
  // name and work even if the system packs are unavailable. The 90 robe
  // spells belong here as much as the two paladin spells do: a Wizard of High
  // Sorcery preparing an Order spell must resolve to the module's version of
  // it, not to nothing.
  for (const file of ["npc-spells.json", "spells.json"]) {
    try {
      const response = await fetch(`modules/${MODULE}/content/${file}`);
      if (!response.ok) continue;
      const source = await response.json();
      for (const spell of source.spells ?? source.items ?? []) {
        const name = spell.name?.toLowerCase();
        if (name && !library.has(name)) library.set(name, { local: spell });
      }
    } catch (error) {
      console.warn(`${MODULE} | Could not load ${file}`, error);
    }
  }

  // dnd5e ships the SRD spells as "dnd5e.spells"; the 2024 pack is the
  // fallback for a system build that no longer carries the 2014 one.
  for (const key of ["dnd5e.spells", "dnd5e.spells24"]) {
    const pack = game.packs.get(key);
    if (!pack) continue;
    const index = await pack.getIndex({ fields: ["name", "type"] });
    for (const entry of index) {
      if (entry.type && entry.type !== "spell") continue;
      const name = entry.name.toLowerCase();
      if (!library.has(name)) library.set(name, { pack: key, id: entry._id });
    }
  }
  return library;
}

/** One embedded spell, prepared the way the stat block says it is cast. */
function prepareSpellCopy(data, group) {
  const spell = foundry.utils.deepClone(data);
  delete spell._id;
  spell.folder = null;
  spell.ownership = { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE };
  spell.system ??= {};

  // dnd5e 5.x reads system.method; 3.x and 4.x read system.preparation.mode.
  // Writing both keeps the module working across the range it claims.
  const method = group.kind === "atwill" ? "atwill"
    : group.kind === "innate" ? "innate"
    : "spell";
  // A spellbook reserve is owned and not prepared: it belongs on the sheet so
  // the wizard can swap to it after a long rest, but it must not read as
  // something they can cast right now. A cantrip is always available, whatever
  // group it arrived in.
  // dnd5e 5.x grades preparation 0 unprepared / 1 prepared / 2 always. A
  // cantrip is always available, so it takes 2 whatever group carried it.
  const cantrip = Number(spell.system.level) === 0;
  const prepared = cantrip ? 2 : group.kind === "reserve" ? 0 : 1;
  spell.system.method = method;
  spell.system.prepared = prepared;
  spell.system.preparation = {
    mode: method === "spell" ? "prepared" : method,
    prepared: prepared > 0
  };

  if (group.kind === "innate" && group.perDay) {
    spell.system.uses = {
      max: String(group.perDay), spent: 0,
      recovery: [{ period: "day", type: "recoverAll", formula: "" }]
    };
  }
  spell.flags = {
    ...(spell.flags ?? {}),
    [MODULE]: { ...(spell.flags?.[MODULE] ?? {}), managed: true, fromStatBlock: true }
  };
  return spell;
}

async function attachCreatureSpells(sources) {
  const needed = sources.some(a => a.flags?.[MODULE]?.spellcasting?.length);
  if (!needed) return { attached: 0, missing: [] };

  const library = await loadSpellLibrary();
  const cache = new Map();
  const missing = new Set();
  let attached = 0;

  for (const actor of sources) {
    const lists = actor.flags?.[MODULE]?.spellcasting;
    if (!lists?.length) continue;
    // Rebuilt from the list every install, so an edited stat block cannot
    // leave a stale spell behind.
    actor.items = actor.items.filter(i => !i.flags?.[MODULE]?.fromStatBlock);

    for (const list of lists) {
      for (const group of list.groups ?? []) {
        for (const name of group.spells ?? []) {
          const entry = library.get(name);
          if (!entry) { missing.add(name); continue; }
          let data = cache.get(name);
          if (!data) {
            if (entry.local) data = entry.local;
            else {
              const pack = game.packs.get(entry.pack);
              const document = await pack?.getDocument(entry.id);
              data = document?.toObject();
            }
            if (!data) { missing.add(name); continue; }
            cache.set(name, data);
          }
          actor.items.push(prepareSpellCopy(data, group));
          attached += 1;
        }
      }
    }
  }
  return { attached, missing: [...missing] };
}

async function rebuildCreatureFolders(pack, sources) {
  const names = [...new Set(sources.map(a => a.flags?.[MODULE]?.typeFolder).filter(Boolean))].sort();
  const ids = new Map();
  const FolderClass = Folder.implementation ?? Folder;
  if (!names.length) return ids;

  try {
    const existing = pack.folders?.contents ?? [];
    if (existing.length) {
      await FolderClass.deleteDocuments(existing.map(f => f.id), { pack: pack.collection });
    }
    const created = await FolderClass.createDocuments(
      names.map((name, index) => ({
        name,
        type: "Actor",
        // Manual sorting is the whole point: it is what makes the pack obey
        // ascending CR instead of re-alphabetising the contents.
        sorting: "m",
        sort: (index + 1) * 100000,
        color: "#6a4b7c"
      })),
      { pack: pack.collection }
    );
    for (const folder of created) ids.set(folder.name, folder.id);
  } catch (error) {
    console.warn(`${MODULE} | Could not create bestiary type folders; the creatures will `
      + `still install, sorted but at the pack root.`, error);
    return new Map();
  }
  return ids;
}

async function syncCreatureCompendium(actors = null) {
  const raw = actors ?? await loadCreatureSources();
  const pack = await getOrCreateWorldActorPack();
  const wasLocked = pack.locked;
  if (wasLocked) await pack.configure({ locked: false });
  try {
    const ActorClass = Actor.implementation ?? Actor;
    const existing = await pack.getDocuments();
    if (existing.length) {
      await ActorClass.deleteDocuments(existing.map(doc => doc.id), { pack: pack.collection });
    }
    // The bestiary reads by creature type, then by ascending challenge. Each
    // type gets a folder inside the pack, set to manual sorting so the sort
    // values the build assigned are the ones the browser obeys — alphabetical
    // would put an ancient dragon next to an apprentice.
    const folderIds = await rebuildCreatureFolders(pack, raw);

    const spells = await attachCreatureSpells(raw);
    if (spells.missing.length) {
      console.warn(`${MODULE} | Could not resolve ${spells.missing.length} spell(s): `
        + spells.missing.join(", "));
      ui.notifications.warn(`Wayreth: ${spells.missing.length} NPC spell(s) could not be found in `
        + `the dnd5e spell compendium and were skipped. See the console (F12) for the list.`);
    }
    if (spells.attached) {
      console.log(`${MODULE} | Attached ${spells.attached} spells to bestiary casters.`);
    }

    const entries = raw.map(source => {
      const actor = foundry.utils.deepClone(source);
      delete actor._id;
      actor.folder = folderIds.get(actor.flags?.[MODULE]?.typeFolder) ?? null;
      actor.ownership = { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE };
      return actor;
    });
    if (entries.length) await ActorClass.createDocuments(entries, { pack: pack.collection });
    await pack.getIndex({ fields: ["name", "img", "type", "system.details.cr", "system.details.type.value"] });
  } finally {
    if (!pack.locked) await pack.configure({ locked: true });
  }
  pack.render?.(true);
  return pack.collection;
}

async function loadLegacySources() {
  const response = await fetch(`modules/${MODULE}/content/legacy-items.json`);
  if (!response.ok) throw new Error(`Could not load legacy-items.json (${response.status})`);
  const source = await response.json();
  if (!Array.isArray(source?.items) || source.items.length !== LEGACY_ITEM_COUNT) {
    throw new Error(`legacy-items.json does not contain the expected ${LEGACY_ITEM_COUNT} legacy items`);
  }
  for (const item of source.items) {
    if (!item.flags?.[MODULE]?.legacy) {
      throw new Error(`${item.name} is not marked as a legacy item`);
    }
    // Every legacy feature is gated on character level. An item that arrived
    // without gates would silently hand a level 3 character its Legendary
    // powers, so refuse it rather than install it.
    for (const [id, act] of Object.entries(item.system?.activities ?? {})) {
      if (typeof act?.visibility?.level?.min !== "number") {
        throw new Error(`${item.name}: activity ${act?.name ?? id} has no level gate`);
      }
    }
  }
  return source.items;
}

/**
 * The legacy items are bound to named characters, so unlike the robe spells they
 * are not dropped loose into the Item Directory — they live in their own
 * compendium for the GM to hand out when each Crow earns one.
 */
async function syncLegacyCompendium(items = null) {
  const raw = items ?? await loadLegacySources();
  const pack = await getOrCreateWorldItemPack(WORLD_ITEM_PACKS.Legacy);
  await replacePackContents(pack, raw);
  return pack.collection;
}

async function loadFeatSources() {
  const response = await fetch(`modules/${MODULE}/content/feats.json`);
  if (!response.ok) throw new Error(`Could not load feats.json (${response.status})`);
  const source = await response.json();
  if (!Array.isArray(source?.feats) || !source.feats.length) {
    throw new Error("feats.json does not contain any feats");
  }
  return source.feats;
}

async function syncFeatCompendium(feats = null) {
  const raw = feats ?? await loadFeatSources();
  const pack = await getOrCreateWorldItemPack(WORLD_ITEM_PACKS.Feats);
  await replacePackContents(pack, raw);
  return pack.collection;
}

async function loadSpellSources() {
  const response = await fetch(`modules/${MODULE}/content/spells.json`);
  if (!response.ok) throw new Error(`Could not load spells.json (${response.status})`);
  const source = await response.json();
  if (!Array.isArray(source?.items) || source.items.length !== 90) {
    throw new Error("spells.json does not contain the expected 90 robe spells");
  }
  const counts = Object.fromEntries(SPELL_ORDERS.map(order => [order, 0]));
  for (const item of source.items) {
    const order = item.flags?.[MODULE]?.order;
    if (!(order in counts)) throw new Error(`Spell ${item.name} has invalid robe order: ${order}`);
    counts[order] += 1;
  }
  if (SPELL_ORDERS.some(order => counts[order] !== 30)) {
    throw new Error(`Robe spell counts are invalid: ${JSON.stringify(counts)}`);
  }
  return source.items;
}

async function getOrCreateWorldItemPack(definition) {
  const collection = `world.${definition.name}`;
  let pack = game.packs.get(collection);
  if (pack) return pack;
  const CompendiumClass = foundry.documents?.collections?.CompendiumCollection ?? globalThis.CompendiumCollection;
  if (!CompendiumClass?.createCompendium) throw new Error("Foundry CompendiumCollection API is unavailable");
  pack = await CompendiumClass.createCompendium({
    name: definition.name,
    label: definition.label,
    type: "Item",
    system: "dnd5e",
    package: "world"
  });
  return pack;
}

async function replacePackContents(pack, sources) {
  const wasLocked = Boolean(pack.locked);
  if (wasLocked) await pack.configure({ locked: false });
  try {
    const existing = await pack.getDocuments();
    const ItemClass = Item.implementation ?? Item;
    if (existing.length) {
      await ItemClass.deleteDocuments(existing.map(doc => doc.id), { pack: pack.collection });
    }
    const entries = sources.map(source => {
      const item = foundry.utils.deepClone(source);
      delete item._id;
      item.folder = null;
      item.ownership = { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE };
      return item;
    });
    if (entries.length) await ItemClass.createDocuments(entries, { pack: pack.collection });
    await pack.getIndex({ fields: ["name", "img", "type", "system.level", "system.school", "system.rarity"] });
  } finally {
    // These packs are generated from module source. Lock them after refresh so
    // users do not accidentally edit content that will be replaced next update.
    if (!pack.locked) await pack.configure({ locked: true });
  }
  pack.render?.(true);
  return pack;
}

async function syncSpellCompendia(spells = null) {
  const raw = spells ?? await loadSpellSources();
  const refreshed = [];
  for (const order of SPELL_ORDERS) {
    const pack = await getOrCreateWorldItemPack(WORLD_ITEM_PACKS[order]);
    await replacePackContents(pack, raw.filter(item => item.flags?.[MODULE]?.order === order));
    refreshed.push(pack.collection);
  }
  return refreshed;
}

async function syncMagicItemCompendium(items = null) {
  const raw = items ?? await loadItemSources();
  const prepared = await prepareItemSources(raw, null);
  const pack = await getOrCreateWorldItemPack(WORLD_ITEM_PACKS.MagicItems);
  await replacePackContents(pack, prepared);
  return pack.collection;
}

async function getOrCreateSpellFolders() {
  let root = game.folders.find(f => f.type === "Item" && f.name === SPELL_FOLDER_NAME && !f.folder);
  if (!root) root = await Folder.create({ name: SPELL_FOLDER_NAME, type: "Item", sorting: "m", color: "#6a4b7c" });
  const colors = { White: "#d8d8e8", Red: "#8b1a1a", Black: "#16131a" };
  const folders = {};
  for (const order of SPELL_ORDERS) {
    const name = `${order} Robe Spells`;
    let folder = game.folders.find(f => f.type === "Item" && f.name === name && (f.folder?.id ?? f.folder) === root.id);
    if (!folder) folder = await Folder.create({ name, type: "Item", folder: root.id, sorting: "m", color: colors[order] });
    folders[order] = folder;
  }
  return folders;
}

async function refreshOwnedSpells(sources) {
  const byKey = new Map(sources.map(source => [source.flags?.[MODULE]?.spellKey, source]));
  let updated = 0;
  for (const actor of game.actors) {
    const changes = [];
    for (const owned of actor.items) {
      const key = owned.getFlag(MODULE, "spellKey");
      const source = byKey.get(key);
      if (!source) continue;
      const replacement = foundry.utils.deepClone(source);
      replacement._id = owned.id;
      replacement.folder = null;
      if (owned.system?.preparation) replacement.system.preparation = foundry.utils.deepClone(owned.system.preparation);
      // Keep flags written by other modules (Midi-QOL, Automated Animations,
      // Times Up, ...). Ours win on conflict; everything else survives.
      replacement.flags = foundry.utils.mergeObject(
        foundry.utils.deepClone(owned.toObject().flags ?? {}),
        replacement.flags ?? {},
        { inplace: false }
      );
      changes.push(replacement);
    }
    if (changes.length) {
      await actor.updateEmbeddedDocuments("Item", changes, { diff: false, recursive: false });
      updated += changes.length;
    }
  }
  return updated;
}

async function installSpells({ notify = true } = {}) {
  if (!game.user.isGM) {
    ui.notifications.warn("Only a GM can install the Wayreth robe spells.");
    return { created: 0, replaced: 0, ownedUpdated: 0 };
  }
  const raw = await loadSpellSources();
  const folders = await getOrCreateSpellFolders();
  const sources = raw.map(source => {
    const item = foundry.utils.deepClone(source);
    const order = item.flags?.[MODULE]?.order;
    item.folder = folders[order].id;
    return item;
  });
  const existing = game.items.filter(item => item.getFlag(MODULE, "managedSpell") === true);
  if (existing.length) await Item.deleteDocuments(existing.map(item => item.id));
  await Item.createDocuments(sources);
  const ownedUpdated = await refreshOwnedSpells(sources);
  let packs = [];
  try {
    packs = await syncSpellCompendia(raw);
  } catch (error) {
    console.error(`${MODULE} | Spell compendium refresh failed; world spell Items are still installed`, error);
    if (notify) ui.notifications.warn("Wayreth spells were installed in the Item Directory, but the Compendium copies could not be refreshed.");
  }
  const result = { created: sources.length, replaced: existing.length, ownedUpdated, packs };
  if (notify && packs.length === 3) {
    ui.notifications.info(`Wayreth robe spells ready: ${result.created} installed, ${result.ownedUpdated} actor copies updated, and 3 spell compendia refreshed.`);
  }
  return result;
}

async function getOrCreateFolder() {
  let folder = game.folders.find(f => f.type === "JournalEntry" && f.name === FOLDER_NAME);
  if (folder) return folder;
  return Folder.create({ name: FOLDER_NAME, type: "JournalEntry", sorting: "m", color: "#8b1a1a" });
}

async function getOrCreateItemFolder() {
  let folder = game.folders.find(f => f.type === "Item" && f.name === ITEM_FOLDER_NAME);
  if (folder) return folder;
  return Folder.create({ name: ITEM_FOLDER_NAME, type: "Item", sorting: "m", color: "#8b1a1a" });
}

async function prepareItemSources(sources, folderId) {
  const pack = game.packs.get("dnd5e.spells");
  const index = pack ? await pack.getIndex({ fields: ["name"] }) : [];
  return sources.map(source => {
    const item = foundry.utils.deepClone(source);
    item.folder = folderId;
    for (const activity of Object.values(item.system.activities ?? {})) {
      if (activity.type !== "cast" || !activity.spell?.name) continue;
      const spell = index.find(entry => entry.name === activity.spell.name);
      if (spell) {
        activity.spell.uuid = spell.uuid ?? `Compendium.${pack.collection}.Item.${spell._id}`;
      } else {
        console.warn(`${MODULE} | Could not resolve spell activity: ${activity.spell.name}`);
      }
      delete activity.spell.name;
    }
    return item;
  });
}

async function refreshOwnedItems(sources) {
  const byKey = new Map(sources.map(source => [source.flags?.[MODULE]?.itemKey, source]));
  let updated = 0;
  for (const actor of game.actors) {
    const changes = [];
    for (const owned of actor.items) {
      const key = owned.getFlag(MODULE, "itemKey");
      const source = byKey.get(key);
      if (!source) continue;
      const replacement = foundry.utils.deepClone(source);
      replacement._id = owned.id;
      replacement.folder = null;
      replacement.system.quantity = owned.system.quantity;
      replacement.system.equipped = owned.system.equipped;
      replacement.system.attuned = owned.system.attuned;
      replacement.system.uses.spent = Math.min(owned.system.uses.spent ?? 0, Number(replacement.system.uses.max) || 0);
      replacement.flags = foundry.utils.mergeObject(
        foundry.utils.deepClone(owned.toObject().flags ?? {}),
        replacement.flags ?? {},
        { inplace: false }
      );
      changes.push(replacement);
    }
    if (changes.length) {
      await actor.updateEmbeddedDocuments("Item", changes, { diff: false, recursive: false });
      updated += changes.length;
    }
  }
  return updated;
}

async function installMagicItems({ notify = true } = {}) {
  if (!game.user.isGM) {
    ui.notifications.warn("Only a GM can install the Wayreth magic items.");
    return { created: 0, replaced: 0, ownedUpdated: 0 };
  }
  const raw = await loadItemSources();
  const folder = await getOrCreateItemFolder();
  const sources = await prepareItemSources(raw, folder.id);
  const existing = game.items.filter(item => item.getFlag(MODULE, "managed") === true);
  if (existing.length) await Item.deleteDocuments(existing.map(item => item.id));
  await Item.createDocuments(sources);
  const ownedUpdated = await refreshOwnedItems(sources);
  let pack = null;
  try {
    pack = await syncMagicItemCompendium(raw);
  } catch (error) {
    console.error(`${MODULE} | Magic-item compendium refresh failed; world magic Items are still installed`, error);
    if (notify) ui.notifications.warn("Wayreth magic items were installed in the Item Directory, but the Compendium copy could not be refreshed.");
  }
  const result = { created: sources.length, replaced: existing.length, ownedUpdated, pack };
  if (notify && pack) {
    ui.notifications.info(`Wayreth magic items ready: ${result.created} installed, ${result.ownedUpdated} actor copies updated, and the magic-item compendium refreshed.`);
  }
  return result;
}

function findManagedJournal(source) {
  return game.journal.find(j => j.getFlag(MODULE, "sourceFile") === source.sourceFile)
    ?? game.journal.find(j => j.name === source.name);
}

function journalHasReadablePages(journal) {
  return journal.pages.size > 0
    && journal.pages.contents.every(page => page.type !== "text" || Boolean(page.text?.content?.trim()));
}

/**
 * Replace a journal's pages with the module's current source.
 *
 * Pages the GM has edited since install are preserved. A page counts as edited
 * when its current content no longer matches the hash recorded when this module
 * wrote it.
 *
 * Pages with no recorded hash predate 1.10.1. These are REPLACED, not kept.
 * 1.10.1 kept them, which turned out to be wrong: a page installed before
 * fingerprinting existed can never be proven edited, so keeping it silently
 * froze that page forever and blocked every future content fix from landing.
 * Replacing matches the pre-1.10.1 behaviour those pages were installed under.
 * They are counted and logged so the GM can see exactly what was refreshed.
 *
 * @returns {{replaced: number, preserved: string[]}}
 */
async function replacePages(journal, source, { overwriteEdits = false } = {}) {
  const preserved = [];
  const keepIds = [];

  const unfingerprinted = [];
  if (!overwriteEdits) {
    for (const page of journal.pages.contents) {
      if (page.type !== "text") continue;
      const stored = page.getFlag(MODULE, "contentHash");
      if (!stored) { unfingerprinted.push(page.name); continue; } // pre-1.10.1: refresh
      if (stored !== contentHash(page.text?.content ?? "")) {
        preserved.push(page.name);
        keepIds.push(page.id);
      }
    }
  }
  if (unfingerprinted.length) {
    console.log(`${MODULE} | Refreshed ${unfingerprinted.length} un-fingerprinted page(s) in "${journal.name}"`);
  }

  const preservedNames = new Set(preserved);
  const removeIds = journal.pages.contents.filter(p => !keepIds.includes(p.id)).map(p => p.id);
  if (removeIds.length) await journal.deleteEmbeddedDocuments("JournalEntryPage", removeIds);

  // Only reinstall pages that were not kept, so an edited page is not duplicated.
  const incoming = source.pages
    .map((page, index) => ({ page, index }))
    .filter(({ page }) => !preservedNames.has(page.name))
    .map(({ page, index }) => pageData(page, index));

  if (incoming.length) {
    await journal.createEmbeddedDocuments("JournalEntryPage", incoming, { keepId: false });
  }
  return { replaced: incoming.length, preserved };
}

async function installJournals({ force = false, notify = true, overwriteEdits = false } = {}) {
  if (!game.user.isGM) {
    ui.notifications.warn("Only a GM can install the Wayreth journals.");
    return { created: 0, repaired: 0, kept: 0, preserved: [] };
  }

  const sources = await loadSources();
  const folder = await getOrCreateFolder();
  let created = 0;
  let repaired = 0;
  let kept = 0;
  const preserved = [];

  for (const source of sources) {
    const journal = findManagedJournal(source);
    const ownership = ownershipFor(source);
    if (!journal) {
      await JournalEntry.create({
        name: source.name,
        folder: folder.id,
        pages: source.pages.map(pageData),
        ownership: { default: ownership },
        flags: { [MODULE]: { managed: true, sourceFile: source.sourceFile, importVersion: IMPORT_VERSION } }
      });
      created += 1;
      continue;
    }

    const broken = !journalHasReadablePages(journal);
    const managed = journal.getFlag(MODULE, "managed") === true;
    const outdated = managed && (journal.getFlag(MODULE, "importVersion") ?? 0) < IMPORT_VERSION;
    const permissionsChanged = journal.ownership.default !== ownership;
    if (broken || outdated || force) {
      const result = await replacePages(journal, source, { overwriteEdits });
      for (const name of result.preserved) preserved.push(`${journal.name} — ${name}`);
    }
    if (broken || managed || permissionsChanged || force) {
      await journal.update({
        folder: folder.id,
        ownership: { default: ownership },
        [`flags.${MODULE}.managed`]: true,
        [`flags.${MODULE}.sourceFile`]: source.sourceFile,
        [`flags.${MODULE}.importVersion`]: IMPORT_VERSION
      });
      repaired += 1;
    } else {
      kept += 1;
    }
  }

  await game.settings.set(MODULE, "journalImportVersion", IMPORT_VERSION);
  if (notify) {
    ui.notifications.info(`Wayreth journals ready: ${created} created, ${repaired} repaired, ${kept} already available.`);
  }
  if (preserved.length) {
    console.warn(`${MODULE} | Kept ${preserved.length} edited page(s):\n  ${preserved.join("\n  ")}`);
    ui.notifications.warn(
      `Wayreth kept ${preserved.length} page(s) you had edited rather than overwriting them. ` +
      `See the console for the list, or use Reinstall and choose "Overwrite my edits" to replace them.`
    );
  }
  return { created, repaired, kept, preserved };
}

/**
 * Version-safe confirmation prompt. DialogV2 exists from v12; fall back to the
 * legacy Dialog on anything older, and to a plain confirm() as a last resort.
 */
async function confirmDialog({ title, content, yes = "Continue" }) {
  const V2 = foundry.applications?.api?.DialogV2;
  if (V2?.confirm) {
    return V2.confirm({
      window: { title },
      content,
      yes: { label: yes },
      no: { label: "Cancel", default: true },
      rejectClose: false
    });
  }
  if (globalThis.Dialog?.confirm) {
    return Dialog.confirm({ title, content, defaultYes: false });
  }
  return globalThis.confirm(`${title}\n\n${content.replace(/<[^>]+>/g, "")}`);
}

async function reinstallContent({ notify = true, force = false, overwriteEdits = false } = {}) {
  if (!game.user.isGM) return;
  const journals = await installJournals({ force, notify: false, overwriteEdits });
  // Spells install before magic items so an unrelated item validation problem
  // can never make the robe spell library disappear from the Item Directory.
  const spells = await installSpells({ notify: false });
  const items = await installMagicItems({ notify: false });
  let featPack = null;
  try {
    featPack = await syncFeatCompendium();
  } catch (error) {
    console.error(`${MODULE} | feat compendium sync failed`, error);
    ui.notifications.error(`Wayreth: the feat compendium failed to populate — ${error.message}. See the console (F12) for details.`);
  }
  let legacyCount = 0;
  try {
    const legacy = await loadLegacySources();
    legacyCount = legacy.length;
    await syncLegacyCompendium(legacy);
  } catch (error) {
    console.error(`${MODULE} | legacy item compendium sync failed`, error);
    ui.notifications.error(`Wayreth: the Crow legacy items failed to populate — ${error.message}. See the console (F12) for details.`);
  }
  let creatureCount = 0;
  try {
    creatureCount = (await loadCreatureSources()).length;
    await syncCreatureCompendium();
  } catch (error) {
    // A silent console error here is how the bestiary sat empty through
    // several releases: the pack is created, the fill throws, nothing tells
    // the GM. Surface it.
    console.error(`${MODULE} | creature compendium sync failed`, error);
    ui.notifications.error(`Wayreth: the bestiary failed to populate — ${error.message}. See the console (F12) for details.`);
  }
  const version = game.modules.get(MODULE).version;
  await game.settings.set(MODULE, "installedVersion", version);
  if (notify) {
    const kept = journals.preserved?.length
      ? `, ${journals.preserved.length} edited page(s) kept`
      : "";
    ui.notifications.info(
      `Wayreth ${version} installed: ${CONTENT_FILES.length} journals, ${spells.created} robe spells, ` +
      `${items.created} magic items, ${legacyCount} legacy items, ${creatureCount} creatures, ` +
      `and the drag-and-drop compendia refreshed${kept}.`
    );
  }
  return { journals, items, spells, version };
  // Scenes last: their pins point at the journals and their tokens at the
  // bestiary, so both have to exist before the references can resolve.
  try {
    await installScenes({ notify: false, force });
  } catch (error) {
    console.error(`${MODULE} | scene install failed`, error);
    ui.notifications.error(`Wayreth: the scenes failed to install — ${error.message}. See the console (F12) for details.`);
  }

}

function addRepairButton(app, html) {
  const root = html?.querySelector ? html : html?.[0];
  if (!game.user.isGM || !root || root.querySelector(".wayreth-repair-journals")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "wayreth-repair-journals";
  let shiftHeld = false;
  button.addEventListener("pointerdown", ev => { shiftHeld = ev.shiftKey; });
  button.innerHTML = '<i class="fa-solid fa-rotate"></i> Reinstall Wayreth Content';
  button.addEventListener("click", async () => {
    const proceed = await confirmDialog({
      title: "Reinstall Wayreth Content",
      content: `<p>This rebuilds all Wayreth journals, spells, magic items, and compendia from the module source.</p>
        <p><strong>Pages you have edited will be kept.</strong> Everything else is replaced.</p>
        <p>To discard your edits as well, hold <strong>Shift</strong> while clicking Reinstall.</p>`,
      yes: "Reinstall"
    });
    if (!proceed) return;
    button.disabled = true;
    try {
      await reinstallContent({ force: true, overwriteEdits: shiftHeld });
    } catch (error) {
      console.error(`${MODULE} | Journal repair failed`, error);
      ui.notifications.error("Wayreth content reinstall failed. Check the console for details.");
    } finally {
      button.disabled = false;
    }
  });
  const footer = root.querySelector(".directory-footer") ?? root.querySelector("footer");
  footer?.append(button);
}

registerSceneControls();

Hooks.once("init", () => {
  game.settings.register(MODULE, "journalImportVersion", {
    scope: "world",
    config: false,
    type: Number,
    default: 0
  });
  game.settings.register(MODULE, "installedVersion", {
    scope: "world",
    config: false,
    type: String,
    default: ""
  });
});

/**
 * Keep a legacy item's chat card to the one feature that was used.
 *
 * dnd5e builds the usage card from the *item's* description
 * (`ItemDataModel#getCardData` falls back to `system.description.value` when
 * `system.description.chat` is empty) and uses the activity's own text only as
 * the subtitle. On an ordinary magic item that is fine. On a legacy item, whose
 * description carries all four states, it means pressing one feature prints the
 * entire item every time.
 *
 * So the card is rebuilt before it is created: the feature's name becomes the
 * title, the item's name drops to the subtitle, and the body becomes that
 * feature's text alone. The trigger line, buttons and roll results dnd5e added
 * are left exactly as they were.
 */
function trimLegacyUsageCard(activity, messageConfig) {
  try {
    const item = activity?.item;
    if (!item?.getFlag?.(MODULE, "legacy")) return;
    const flavor = activity.description?.chatFlavor;
    const content = messageConfig?.data?.content;
    if (!flavor || typeof content !== "string") return;

    const doc = new DOMParser().parseFromString(content, "text/html");
    // Serialise the card element itself rather than the document body, so the
    // result never depends on how the parser wrapped the fragment.
    const card = doc.querySelector(".chat-card") ?? doc.body?.firstElementChild;
    if (!card) return;
    const wrapper = card.querySelector(".card-content .wrapper") ?? card.querySelector(".wrapper");
    if (!wrapper) return;
    wrapper.innerHTML = flavor;

    const title = card.querySelector(".name-stacked .title");
    const subtitle = card.querySelector(".name-stacked .subtitle");
    if (title && activity.name) {
      title.textContent = activity.name;
      // The subtitle currently holds the flavor text that has just moved into
      // the body, so it becomes the item it came from.
      if (subtitle) subtitle.textContent = item.name;
      else title.insertAdjacentHTML("afterend", `<span class="subtitle">${item.name}</span>`);
    }

    messageConfig.data.content = card.outerHTML;
  } catch (error) {
    // A cosmetic failure must never stop the feature being used.
    console.error(`${MODULE} | Could not trim the legacy usage card`, error);
  }
}

Hooks.on("dnd5e.preCreateUsageMessage", trimLegacyUsageCard);

Hooks.on("renderJournalDirectory", addRepairButton);
Hooks.on("renderItemDirectory", addRepairButton);

// A matching journal created or imported manually receives the same access
// policy as the automatically installed world copy.
Hooks.on("createJournalEntry", async journal => {
  if (!game.user.isGM) return;
  const sourceFile = journal.getFlag(MODULE, "sourceFile") ?? SOURCE_FILE_BY_NAME.get(journal.name);
  if (!sourceFile) return;
  const ownership = ownershipFor({ sourceFile });
  if (journal.ownership.default === ownership) return;
  await journal.update({ ownership: { default: ownership } });
});

Hooks.once("ready", async () => {
  const mod = game.modules.get(MODULE);
  mod.api ??= {};
  mod.api.installJournals = installJournals;
  mod.api.installMagicItems = installMagicItems;
  mod.api.syncFeatCompendium = syncFeatCompendium;
  mod.api.syncLegacyCompendium = syncLegacyCompendium;
  mod.api.syncCreatureCompendium = syncCreatureCompendium;
  mod.api.installSpells = installSpells;
  mod.api.syncSpellCompendia = syncSpellCompendia;
  mod.api.syncMagicItemCompendium = syncMagicItemCompendium;
  mod.api.reinstallContent = reinstallContent;
  mod.api.installScenes = installScenes;
  mod.api.sendHandout = sendHandout;

  if (!game.user.isGM || game.settings.get(MODULE, "installedVersion") === mod.version) return;
  try {
    // Automatic run on a version bump: create what is missing, repair what is
    // broken, and refresh outdated content — but never force past a page the
    // GM has edited. A full forced rebuild is available from the directory
    // button, behind a confirmation.
    await reinstallContent({ force: false, overwriteEdits: false });
  } catch (error) {
    console.error(`${MODULE} | Automatic content reinstall failed`, error);
    ui.notifications.error("Wayreth could not reinstall its content. Use Reinstall Wayreth Content in the Journal or Item Directory.");
  }
});
