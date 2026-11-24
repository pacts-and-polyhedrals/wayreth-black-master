import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const FILE = path.join(ROOT, "content", "spells.json");
const MODULE = "wayreth-black-master";
const ORDERS = {
  White: new Set(["abj", "div", "enc"]),
  Red: new Set(["con", "ill", "trs"]),
  Black: new Set(["enc", "evo", "nec"])
};

/**
 * Spells whose text describes rolls one activity cannot make.
 *
 * Chain of Embers strikes a second creature with a different roll and a
 * different ability. Transfer Essence costs the donor 2d6 per level of the
 * slot handed over, and the slot is chosen at the table rather than derived
 * from the casting slot, so there is one activity per level.
 */
const MULTI_ACTIVITY = {
  "Chain of Embers": 2,
  "Transfer Essence": 5
};

const raw = JSON.parse(fs.readFileSync(FILE, "utf8"));
const spells = raw.items;
if (!Array.isArray(spells)) throw new Error("content/spells.json must expose an items array");
if (spells.length !== 90) throw new Error(`Expected 90 spells, found ${spells.length}`);

const names = new Set();
const identifiers = new Set();
const keys = new Set();
const counts = Object.fromEntries(Object.keys(ORDERS).map(order => [order, 0]));
const levels = Object.fromEntries(Object.keys(ORDERS).map(order => [order, new Set()]));
let legacy = 0;

for (const spell of spells) {
  if (spell.type !== "spell") throw new Error(`${spell.name}: Item type must be spell`);
  if (!spell.name?.trim()) throw new Error("Every spell needs a name");
  if (names.has(spell.name)) throw new Error(`Duplicate spell name: ${spell.name}`);
  names.add(spell.name);

  const flags = spell.flags?.[MODULE];
  const order = flags?.order;
  if (!(order in ORDERS)) throw new Error(`${spell.name}: invalid robe order ${order}`);
  counts[order] += 1;

  const level = Number(spell.system?.level);
  if (!Number.isInteger(level) || level < 0 || level > 9) throw new Error(`${spell.name}: invalid level ${spell.system?.level}`);
  levels[order].add(level);

  const school = spell.system?.school;
  if (!ORDERS[order].has(school)) throw new Error(`${spell.name}: ${school} is outside the ${order} school matrix`);

  const identifier = spell.system?.identifier;
  if (!identifier || identifiers.has(identifier)) throw new Error(`${spell.name}: missing or duplicate identifier ${identifier}`);
  identifiers.add(identifier);

  const key = flags?.spellKey;
  if (!key || keys.has(key)) throw new Error(`${spell.name}: missing or duplicate spellKey ${key}`);
  keys.add(key);

  if (flags?.managedSpell !== true) throw new Error(`${spell.name}: managedSpell must be true`);
  if (flags?.legacyConversion) legacy += 1;

  if (!spell.system?.description?.value?.trim()) throw new Error(`${spell.name}: missing description`);
  if (!spell.system?.activation?.type) throw new Error(`${spell.name}: missing activation type`);
  // One activity is the rule. A spell gets more only where its own text
  // describes separate rolls that a single activity cannot make, and the
  // count is pinned here so an accidental duplicate still fails.
  const activityCount = Object.keys(spell.system?.activities ?? {}).length;
  const expected = MULTI_ACTIVITY[spell.name] ?? 1;
  if (activityCount !== expected) {
    throw new Error(`${spell.name}: expected ${expected} Foundry ${expected === 1 ? "activity" : "activities"}, found ${activityCount}`);
  }

  const material = spell.system?.materials;
  if (material?.consumed && /not consumed/i.test(material.value ?? "")) {
    throw new Error(`${spell.name}: material marked consumed despite saying not consumed`);
  }
}

for (const order of Object.keys(ORDERS)) {
  if (counts[order] !== 30) throw new Error(`${order}: expected 30 spells, found ${counts[order]}`);
  for (let level = 0; level <= 9; level += 1) {
    if (!levels[order].has(level)) throw new Error(`${order}: no spell at level ${level}`);
  }
}
if (legacy !== 31) throw new Error(`Expected 31 legacy conversions, found ${legacy}`);

// --- damage floor (1.28.0) -------------------------------------------------
//
// Nineteen spells were retuned after profiling all 90 against the damage every
// offensive spell in dnd5e's SRD pack actually deals. This keeps that work
// from rotting: a spell written or edited later cannot quietly land below the
// bottom quartile of its published peers.
//
// The floor is the SRD lower quartile at each level, carried forward so it
// never falls. Carrying it forward matters: most published 8th- and 9th-level
// spells do not deal damage at all, so their raw quartiles collapse to figures
// a 3rd-level spell beats.
const FLOOR = { 0: 4.5, 1: 4.5, 2: 7, 3: 13.5, 4: 13.5, 5: 21, 6: 31.5, 7: 38.5, 8: 38.5, 9: 38.5 };

// A spell whose damage repeats every round while you concentrate is measured
// over three rounds, which is about how long a concentration spell survives.
const SUSTAINED = new Set([
  "Tyrant's Brand", "Curse the Magi", "Death's Due",
  "Raistlin's Wheel of Flame", "Mindspin", "Mindspin, Greater"
]);

// Activities that are alternatives to one another rather than parts of one
// casting, so the largest counts rather than the sum.
const ALTERNATIVES = new Set(["Transfer Essence"]);

// Nuitari's Hook deals 1d6 and stops the target backing away. Vicious mockery
// charges a cantrip for 1d4 and disadvantage on one attack, so the hook is
// correctly priced below the quartile rather than under it by accident.
const PRICED_LOW = new Set(["Nuitari's Hook"]);

const average = part => (part.number ?? 0) * ((part.denomination ?? 0) + 1) / 2;

for (const spell of spells) {
  const perActivity = Object.values(spell.system.activities ?? {})
    .map(a => (a.damage?.parts ?? []).reduce((total, p) => total + average(p), 0));
  const damage = ALTERNATIVES.has(spell.name)
    ? Math.max(0, ...perActivity)
    : perActivity.reduce((a, b) => a + b, 0);
  if (damage <= 0 || PRICED_LOW.has(spell.name)) continue;

  const rounds = SUSTAINED.has(spell.name) ? 3 : 1;
  const floor = FLOOR[spell.system.level];
  if (damage * rounds < floor) {
    throw new Error(
      `${spell.name} deals ${damage * rounds} average damage${rounds > 1 ? ` over ${rounds} rounds` : ""}, ` +
      `below the ${floor} floor for a level ${spell.system.level} spell`
    );
  }
  // A spell listed as sustained must actually sustain, or the allowance is a
  // way of hiding a weak spell rather than measuring a slow one.
  if (rounds > 1 && !spell.system.duration?.concentration) {
    throw new Error(`${spell.name} is measured over ${rounds} rounds but does not require concentration`);
  }
}

// --- text and activities must agree (1.28.0) -------------------------------
//
// Chain of Embers described a second target taking 2d8 and had no activity to
// roll it; Transfer Essence stated 2d6 per slot level and carried no damage at
// all. Both read correctly on the sheet and did nothing at the table, which is
// the worst way for a spell to be wrong. Every saving throw and every damage
// expression a spell's text names is now checked against what it can roll.
const ABILITY = {
  strength: "str", dexterity: "dex", constitution: "con",
  intelligence: "int", wisdom: "wis", charisma: "cha"
};

// Saves the spell describes but does not roll, because somebody other than the
// activity's target makes them: Curse the Magi's is rolled by the cursed
// creature each time it tries to cast, and Reverse Death's is rolled for a
// departed soul that is not on the board.
const SAVE_ROLLED_ELSEWHERE = { "Curse the Magi": ["con"], "Reverse Death": ["cha"] };

const prose = html => String(html)
  .replace(/<[^>]+>/g, " ")
  .replace(/&#x27;/g, "'")
  .replace(/&[a-z]+;/gi, " ")
  .replace(/\s+/g, " ");

for (const spell of spells) {
  const body = prose(spell.system.description.value);
  const activities = Object.values(spell.system.activities ?? {});
  const rolledSaves = new Set(activities.map(a => a.save?.ability).filter(Boolean));
  const rolledDamage = new Set(
    activities.flatMap(a => (a.damage?.parts ?? []).map(p => `${p.number}d${p.denomination}`))
  );
  const excused = new Set(SAVE_ROLLED_ELSEWHERE[spell.name] ?? []);

  for (const match of body.matchAll(/\b(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma) saving throw/gi)) {
    // "advantage on Wisdom saving throws" grants a save; it does not force one.
    const lead = body.slice(Math.max(0, match.index - 40), match.index);
    if (/advantage on|disadvantage on|advantage against|succeeds? on (any|all)/i.test(lead)) continue;
    const ability = ABILITY[match[1].toLowerCase()];
    if (!rolledSaves.has(ability) && !excused.has(ability)) {
      throw new Error(`${spell.name} describes a ${match[1]} saving throw that no activity rolls`);
    }
  }

  const damageWords = "acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder";
  for (const match of body.matchAll(new RegExp(`\\b(\\d+)d(\\d+)\\s+(${damageWords})`, "gi"))) {
    const dice = `${match[1]}d${match[2]}`;
    if (!rolledDamage.has(dice)) {
      throw new Error(`${spell.name} describes ${dice} ${match[3]} damage that no activity rolls`);
    }
  }

  // The summary table above a spell's rules text drifts out of agreement with
  // the rules text silently. Reverse Death's table still offered a corpse dead
  // "no longer than 1 hour" after the spell had been extended to ten days, and
  // Edict of the Black Moon targeted six creatures in its table and eight in
  // its text. Any count the table states must appear in the text as well.
  const targetRow = /<tr><th>Target<\/th><td>([^<]*)<\/td><\/tr>/.exec(spell.system.description.value);
  const effectBody = /<h3>Effect<\/h3>([\s\S]*?)(?=<div class="wy-quote">|<h3>|$)/
    .exec(spell.system.description.value);
  if (targetRow && effectBody) {
    const row = targetRow[1].toLowerCase();
    const effect = prose(effectBody[1]).toLowerCase();
    const counts = ["two", "three", "four", "five", "six", "seven", "eight", "nine",
                    "ten", "twelve", "twenty", "fifty", "hundred"];
    for (const count of counts) {
      const word = new RegExp(`\\b${count}\\b`);
      if (word.test(row) && !word.test(effect)) {
        throw new Error(`${spell.name}: the detail table says "${targetRow[1]}" but the rules text never mentions ${count}`);
      }
    }
  }
}

console.log("Spell validation passed.");
console.log(`90 spells: ${Object.entries(counts).map(([k,v]) => `${k} ${v}`).join(", ")}; 31 legacy conversions.`);
console.log("Every robe covers cantrips through 9th level and obeys its school matrix.");
