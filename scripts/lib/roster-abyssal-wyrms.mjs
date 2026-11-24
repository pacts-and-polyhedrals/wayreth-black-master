import fs from "node:fs";
import path from "node:path";
import { id } from "./statblock.mjs";

/* ================================================================== *
 *  THE ABYSSAL WYRMS
 *
 *  Three things older than the Dragonarmies, bound beneath places that
 *  no longer remember they are there. They sit above the ancient dragons
 *  at CR 25, 26 and 27, and are the only creatures in the bestiary with
 *  lair actions.
 *
 *  Unlike the rest of the roster these are not built from compact
 *  definitions: they arrived as finished Foundry exports, and those
 *  exports are better than anything this builder would produce — damage
 *  and saves are written with dnd5e's own roll enrichers, the saving
 *  throws already carry matching activities, and the lair actions are
 *  real activities rather than prose. Rewriting them into roster shape
 *  would be a downgrade.
 *
 *  So the exports are kept verbatim in ./wyrms and normalised here
 *  instead. What the normalisation does, and why, is set out below; the
 *  statistics, text and activities are left exactly as they arrived.
 * ================================================================== */

const HERE = path.join(import.meta.dirname, "wyrms");
const MODULE = "wayreth-black-master";
const MODULE_PATH = `modules/${MODULE}`;

/**
 * The art each wyrm was supplied with, by actor name. Filenames follow the
 * bestiary's convention: type folder, CR prefix, then the creature's own name.
 */
const ART = {
  "Vaelzhar, the Unremembered": "Dragon/CR25.00_79_Vaelzhar_the_Unremembered.webp",
  "Nythravel, the Upward Shadow": "Dragon/CR26.00_80_Nythravel_the_Upward_Shadow.webp",
  "Kharzoryx, the Blue Pyre": "Dragon/CR27.00_81_Kharzoryx_the_Blue_Pyre.webp"
};

/** The species each one belongs to, which the exports carry only in prose. */
const SPECIES = {
  "Vaelzhar, the Unremembered": "Rauwend Nullwyrm",
  "Nythravel, the Upward Shadow": "Shadowsky Spirewyrm",
  "Kharzoryx, the Blue Pyre": "Voorz'zt Coldfire Wyrm"
};

const SOURCE = {
  custom: "Wayreth: The Black Master",
  book: "", page: "", license: "", rules: "2014", revision: 1
};

/**
 * Two features describe a saving throw that their activity never rolled.
 *
 * Both were exported as plain utility activities, so the text promised a DC
 * and the sheet offered a button that did nothing. The DC, ability, dice and
 * damage type below are taken from each feature's own written rules, not
 * invented, and the build refuses to apply a repair whose text has changed.
 */
const ACTIVITY_REPAIRS = {
  "Forgotten Assault": {
    expect: /\[\[\/save wis 24/,
    save: { ability: ["wis"], dc: 24 },
    onSave: "none",
    damage: []
  },
  "Blueflame Step": {
    expect: /\[\[\/save dex 25[\s\S]*\[\[\/damage 3d10 type=cold/,
    save: { ability: ["dex"], dc: 25 },
    onSave: "none",
    damage: [{ number: 3, denomination: 10, types: ["cold"] }]
  }
};

function applyRepair(actor, item) {
  const repair = ACTIVITY_REPAIRS[item.name];
  if (!repair) return false;
  const text = item.system?.description?.value ?? "";
  if (!repair.expect.test(text)) {
    problems.push(`${actor.name} / ${item.name}: rules changed, repair no longer matches`);
    return false;
  }
  const activities = Object.values(item.system.activities ?? {});
  if (activities.some(a => a.type === "save")) return false;
  const activity = activities[0];
  if (!activity) {
    problems.push(`${actor.name} / ${item.name}: nothing to repair`);
    return false;
  }
  activity.type = "save";
  activity.save = { ability: repair.save.ability, dc: { calculation: "", formula: String(repair.save.dc) } };
  activity.damage = {
    onSave: repair.onSave,
    parts: repair.damage.map(d => ({
      number: d.number, denomination: d.denomination, bonus: "", types: d.types,
      custom: { enabled: false, formula: "" },
      scaling: { mode: "", number: null, formula: "" }
    }))
  };
  delete activity.roll;
  return true;
}

const problems = [];

function load(file) {
  const actor = JSON.parse(fs.readFileSync(path.join(HERE, file), "utf8"));

  // --- the blocking defect -----------------------------------------
  // Every activity in the exports carries a 12-character id. Foundry's
  // DocumentIdField accepts exactly 16 alphanumeric characters and nothing
  // else, so these would have failed validation on import and taken their
  // activities with them. Ids are regenerated from the activity's own
  // identity so they are stable across rebuilds.
  let renamed = 0;
  let repaired = 0;
  for (const item of actor.items) {
    const activities = item.system?.activities;
    if (!activities) continue;
    const rebuilt = {};
    for (const [key, activity] of Object.entries(activities)) {
      const valid = /^[A-Za-z0-9]{16}$/.test(key);
      const next = valid ? key : id(`wyrm-act:${actor.name}:${item.name}:${activity.type}:${key}`);
      if (!valid) renamed += 1;
      rebuilt[next] = { ...activity, _id: next };
    }
    item.system.activities = rebuilt;

    // `spent: null` where the schema wants a number. Harmless on a good day,
    // but it is the sort of thing that turns into NaN on a bad one.
    if (item.system.uses && item.system.uses.spent == null) item.system.uses.spent = 0;

    item.flags = { ...(item.flags ?? {}), [MODULE]: { managed: true } };
    if (applyRepair(actor, item)) repaired += 1;
  }

  // --- joining the bestiary ----------------------------------------
  const art = ART[actor.name];
  if (!art) problems.push(`${actor.name}: no art mapped`);
  const species = SPECIES[actor.name];
  if (!species) problems.push(`${actor.name}: no species recorded`);

  actor._id = id(`actor:${actor.name}`);
  actor.img = `${MODULE_PATH}/assets/bestiary/${art}`;
  actor.prototypeToken = {
    ...(actor.prototypeToken ?? {}),
    name: actor.name,
    texture: {
      ...(actor.prototypeToken?.texture ?? {}),
      src: `${MODULE_PATH}/assets/tokens/${art}`
    }
  };
  actor.folder = null;
  actor.sort = 0;
  actor.ownership = { default: 0 };
  actor.system.details.source = { ...SOURCE };
  actor.system.source = { ...SOURCE };
  actor.flags = {
    ...(actor.flags ?? {}),
    [MODULE]: { managed: true, group: "Abyssal Wyrm", species }
  };

  // The exports are configured for a wyrm met inside its lair, which is how
  // the campaign uses them. Their own text says to drop the maxima by one
  // outside, and that stays a GM decision rather than a second stat block.
  if (actor.system.resources?.legact?.max !== 4) {
    problems.push(`${actor.name}: expected 4 legendary actions in lair`);
  }
  if (actor.system.resources?.legres?.max !== 5) {
    problems.push(`${actor.name}: expected 5 legendary resistances in lair`);
  }

  return { actor, renamed, repaired };
}

const loaded = [
  "fvtt-Actor-vaelzhar-the-unremembered.json",
  "fvtt-Actor-nythravel-the-upward-shadow.json",
  "fvtt-Actor-kharzoryx-the-blue-pyre.json"
].map(load);

if (problems.length) {
  throw new Error(`Abyssal wyrm import failed:\n- ${problems.join("\n- ")}`);
}

/** How many activity ids had to be repaired, reported by the build. */
export const repairedActivityIds = loaded.reduce((n, l) => n + l.renamed, 0);

/** How many activities had a described saving throw that never rolled. */
export const repairedSaveActivities = loaded.reduce((n, l) => n + l.repaired, 0);

export default loaded.map(l => l.actor);
