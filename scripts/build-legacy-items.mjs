import fs from "node:fs";
import alice from "./lib/legacy-alice.mjs";
import solanthis from "./lib/legacy-solanthis.mjs";
import jinx from "./lib/legacy-jinx.mjs";
import sylas from "./lib/legacy-sylas.mjs";
import clipper from "./lib/legacy-clipper.mjs";
import kattal from "./lib/legacy-kattal.mjs";
import { CHARGE_MAX, CHARGE_RECOVERY, TIERS, TIER_ORDER } from "./lib/legacy.mjs";

const items = [alice, solanthis, jinx, sylas, clipper, kattal];

const RARITIES = new Set(["common", "uncommon", "rare", "veryRare", "legendary", "artifact"]);
const EQUIPMENT = new Set(["clothing", "ring", "rod", "trinket", "vehicle", "wand", "wondrous"]);
const ACTIVITY_TYPES = new Set(["attack", "check", "damage", "heal", "save", "utility"]);
const ACTIVATIONS = new Set([
  "action", "bonus", "reaction", "minute", "hour", "day", "longRest", "shortRest",
  "encounter", "turnStart", "turnEnd", "legendary", "mythic", "lair", "crew", "special"
]);
const TARGET_TYPES = new Set([
  "self", "ally", "enemy", "creature", "object", "space", "creatureOrObject", "any", "willing"
]);
const ABILITIES = new Set(["str", "dex", "con", "int", "wis", "cha"]);
const RECOVERY_PERIODS = new Set(["lr", "sr", "day", "dawn", "dusk"]);
const DAMAGE_TYPES = new Set([
  "acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic",
  "piercing", "poison", "psychic", "radiant", "slashing", "thunder"
]);
const HEAL_TYPES = new Set(["healing", "temphp", "maximum"]);

const problems = [];
const seenIds = new Set();
const seenNames = new Set();

/**
 * Evaluates the deterministic parts of a formula for a given character level so
 * the charge table can be checked rather than assumed.
 */
function evalAtLevel(formula, level, { prof = 3 } = {}) {
  const replaced = formula
    .replaceAll("@details.level", String(level))
    .replaceAll("@prof", String(prof));
  if (/@/.test(replaced)) throw new Error(`unresolved reference in: ${formula}`);
  const js = replaced.replace(/\bmin\(/g, "Math.min(").replace(/\bmax\(/g, "Math.max(");
  if (/[^0-9+\-*/(),.\sdMathinx]/.test(js.replace(/Math\.(min|max)/g, ""))) {
    throw new Error(`unexpected token in: ${formula}`);
  }
  // Dice terms are replaced by their own average so the branch can be checked.
  const noDice = js.replace(/(\d+)d(\d+)/g, (_, n, d) => String((Number(n) * (Number(d) + 1)) / 2));
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${noDice});`)();
}

// The charge pool must produce exactly the designed number at every level the
// items can be held at, and the dawn/dusk formula must at least cover the pool
// at the two tiers that recover everything.
for (const level of [3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 17, 20]) {
  const expected = [...TIER_ORDER].reverse()
    .map(key => TIERS[key])
    .find(t => level >= t.min).charges;
  let got;
  try {
    got = evalAtLevel(CHARGE_MAX, level);
  } catch (err) {
    problems.push(`CHARGE_MAX at level ${level}: ${err.message}`);
    continue;
  }
  if (got !== expected) {
    problems.push(`CHARGE_MAX at level ${level}: expected ${expected}, got ${got}`);
  }
  if (level <= 9) {
    const recovered = evalAtLevel(CHARGE_RECOVERY, level);
    if (recovered < expected) {
      problems.push(`CHARGE_RECOVERY at level ${level}: ${recovered} does not refill ${expected}`);
    }
  }
}
// Exalted and Legendary must NOT refill the whole pool — that tradeoff is the point.
for (const [level, pool] of [[12, 7], [20, 9]]) {
  const recovered = evalAtLevel(CHARGE_RECOVERY, level);
  if (recovered >= pool) {
    problems.push(`CHARGE_RECOVERY at level ${level}: ${recovered} should be below the ${pool} pool`);
  }
}

for (const item of items) {
  const where = item.name;

  if (item.type !== "equipment") problems.push(`${where}: type is ${item.type}, not equipment`);
  if (item._id.length !== 16) problems.push(`${where}: bad id length`);
  if (seenIds.has(item._id)) problems.push(`${where}: duplicate item id`);
  seenIds.add(item._id);
  if (seenNames.has(item.name)) problems.push(`${where}: duplicate name`);
  seenNames.add(item.name);

  const sys = item.system;
  if (!RARITIES.has(sys.rarity)) problems.push(`${where}: invalid rarity ${sys.rarity}`);
  if (!EQUIPMENT.has(sys.type.value)) problems.push(`${where}: invalid equipment type ${sys.type.value}`);
  if (sys.attunement !== "required") problems.push(`${where}: should require attunement`);
  if (!sys.properties.includes("mgc")) problems.push(`${where}: not flagged magical`);
  if (sys.uses.max !== CHARGE_MAX) problems.push(`${where}: charge pool is not the shared formula`);
  if (sys.uses.recovery.length !== 1) problems.push(`${where}: expected exactly one recovery profile`);
  const recovery = sys.uses.recovery[0];
  if (!RECOVERY_PERIODS.has(recovery.period)) {
    problems.push(`${where}: invalid recovery period ${recovery.period}`);
  }
  if (recovery.type !== "formula" || recovery.formula !== CHARGE_RECOVERY) {
    problems.push(`${where}: recovery is not the shared tiered formula`);
  }
  if (!item.flags["wayreth-black-master"]?.legacy) problems.push(`${where}: missing legacy flag`);

  const dc = item.flags["wayreth-black-master"].dc;
  if (dc !== "spellcasting" && !ABILITIES.has(dc)) problems.push(`${where}: invalid Legacy DC ${dc}`);

  // Every tier must be described, and its level band must appear in the text.
  for (const key of TIER_ORDER) {
    const t = TIERS[key];
    const band = t.max === null ? `level ${t.min}+` : `levels ${t.min}–${t.max}`;
    if (!sys.description.value.includes(band)) {
      problems.push(`${where}: description never states the ${key} band (${band})`);
    }
  }
  if (/undefined|\[object/.test(sys.description.value)) {
    problems.push(`${where}: description contains a rendering artefact`);
  }

  // Activities: valid enums, a real level gate, and at least one feature per tier.
  const perTier = Object.fromEntries(TIER_ORDER.map(k => [k, 0]));
  const activityIds = new Set();
  const activityNames = new Set();
  for (const act of Object.values(sys.activities)) {
    const at = `${where} / ${act.name}`;
    if (!ACTIVITY_TYPES.has(act.type)) problems.push(`${at}: invalid activity type ${act.type}`);
    if (!ACTIVATIONS.has(act.activation.type)) {
      problems.push(`${at}: invalid activation ${act.activation.type}`);
    }
    if (act._id.length !== 16) problems.push(`${at}: bad activity id`);
    if (activityIds.has(act._id)) problems.push(`${at}: duplicate activity id`);
    activityIds.add(act._id);
    if (activityNames.has(act.name)) problems.push(`${at}: duplicate activity name`);
    activityNames.add(act.name);

    if (act.target.affects.type && !TARGET_TYPES.has(act.target.affects.type)) {
      problems.push(`${at}: invalid target type ${act.target.affects.type}`);
    }

    const min = act.visibility.level.min;
    const matching = TIER_ORDER.filter(k => TIERS[k].min === min);
    if (!matching.length) problems.push(`${at}: gate min ${min} is not a tier threshold`);
    else perTier[matching[0]] += 1;
    if ("max" in act.visibility.level) {
      if (act.visibility.level.max < min) problems.push(`${at}: gate max below min`);
      if (!TIER_ORDER.some(k => TIERS[k].min === act.visibility.level.max + 1)) {
        problems.push(`${at}: gate max ${act.visibility.level.max} is not a tier boundary`);
      }
    }

    for (const target of act.consumption.targets) {
      if (!["itemUses", "activityUses", "hitDice", "material", "spellSlots", "attribute"]
        .includes(target.type)) {
        problems.push(`${at}: invalid consumption type ${target.type}`);
      }
      if (target.type === "activityUses" && !act.uses.max) {
        problems.push(`${at}: consumes its own uses but has no pool`);
      }
      if (target.type === "hitDice"
        && !["smallest", "largest", "d6", "d8", "d10", "d12"].includes(target.target)) {
        problems.push(`${at}: invalid hit dice target ${target.target}`);
      }
    }
    if (act.uses.max && !act.consumption.targets.some(t => t.type === "activityUses")) {
      problems.push(`${at}: has a use pool nothing spends`);
    }
    for (const profile of act.uses.recovery) {
      if (!RECOVERY_PERIODS.has(profile.period)) {
        problems.push(`${at}: invalid recovery period ${profile.period}`);
      }
    }

    if (act.type === "save") {
      if (!act.save.ability.length) problems.push(`${at}: save activity with no ability`);
      for (const ability of act.save.ability) {
        if (!ABILITIES.has(ability)) problems.push(`${at}: invalid save ability ${ability}`);
      }
      const calc = act.save.dc.calculation;
      if (calc !== dc) problems.push(`${at}: DC calculation ${calc} is not the item's Legacy DC`);
      if (!["none", "half", "full"].includes(act.damage.onSave)) {
        problems.push(`${at}: invalid onSave ${act.damage.onSave}`);
      }
    }

    if (act.type === "check" && act.check.ability && !ABILITIES.has(act.check.ability)) {
      problems.push(`${at}: invalid check ability ${act.check.ability}`);
    }

    for (const p of act.type === "heal" ? [act.healing] : (act.damage?.parts ?? [])) {
      if (!p) continue;
      const valid = act.type === "heal" ? HEAL_TYPES : DAMAGE_TYPES;
      for (const t of p.types) if (!valid.has(t)) problems.push(`${at}: invalid type ${t}`);
      const flat = p.custom.enabled ? p.custom.formula : null;
      if (!flat && (p.number == null || p.denomination == null)) {
        problems.push(`${at}: amount is neither dice nor a custom formula`);
      }
      if (flat && /@[a-z.]*\bd\d/.test(flat)) {
        problems.push(`${at}: "${flat}" would be read as one @ reference — parenthesise it`);
      }
    }

    if (act.type === "utility" && act.roll.formula && !act.roll.visible) {
      problems.push(`${at}: rolls a formula nobody sees`);
    }

    if (!act.description.chatFlavor) problems.push(`${at}: no chat text`);
  }

  for (const key of TIER_ORDER) {
    if (!perTier[key]) problems.push(`${where}: no usable activity gated to ${key}`);
  }

  for (const eff of item.effects) {
    if (!eff.changes.length) problems.push(`${where}: effect ${eff.name} changes nothing`);
    for (const change of eff.changes) {
      if (!change.key.startsWith("system.")) {
        problems.push(`${where}: effect ${eff.name} targets ${change.key}`);
      }
      if (![1, 2, 3, 4, 5].includes(change.mode)) {
        problems.push(`${where}: effect ${eff.name} has invalid mode ${change.mode}`);
      }
    }
    if (eff.transfer !== true) problems.push(`${where}: effect ${eff.name} does not transfer`);
  }
}

if (problems.length) {
  console.error(`Legacy item build failed with ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

const out = { schemaVersion: 1, items };
fs.writeFileSync("content/legacy-items.json", `${JSON.stringify(out, null, 2)}\n`);

const activityCount = items.reduce((n, i) => n + Object.keys(i.system.activities).length, 0);
const effectCount = items.reduce((n, i) => n + i.effects.length, 0);
console.log(`Wrote content/legacy-items.json`);
console.log(`  ${items.length} legacy items, ${activityCount} gated activities, ${effectCount} effects`);
for (const item of items) {
  const gates = Object.values(item.system.activities).reduce((acc, a) => {
    const key = TIER_ORDER.find(k => TIERS[k].min === a.visibility.level.min);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const summary = TIER_ORDER.map(k => `${k} ${gates[k] ?? 0}`).join(", ");
  console.log(`  ${item.name.padEnd(32)} ${summary}`);
}
