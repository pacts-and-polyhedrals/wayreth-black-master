import fs from "node:fs";
import crypto from "node:crypto";

/**
 * Builds dnd5e 5.x NPC actor documents from compact definitions.
 *
 * Written against the shipped dnd5e monster schema rather than from memory:
 * every field here appears in packs/_source/monsters of the system itself.
 */

const AB = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export function id(seed) {
  const h = crypto.createHash("sha256").update(seed).digest();
  let out = "";
  for (let i = 0; i < 16; i++) out += AB[h[i] % AB.length];
  return out;
}

/** Proficiency bonus by challenge rating, per the 2014 DMG table. */
export function profFor(cr) {
  if (cr < 5) return 2;
  return Math.min(9, 2 + Math.floor((cr - 1) / 4));
}

const mod = score => Math.floor((score - 10) / 2);

/** Average of NdX + bonus, rounded down — how 5e prints damage. */
const avg = (n, d, b = 0) => Math.floor(n * (d + 1) / 2) + b;

function scalingBlock() {
  return { mode: "", number: null, formula: "" };
}

function damagePart(number, denomination, types, bonus = "") {
  return {
    number, denomination, bonus,
    types: Array.isArray(types) ? types : [types],
    custom: { enabled: false, formula: "" },
    scaling: scalingBlock()
  };
}

/* ------------------------------------------------------------------ *
 *  Items carried by the actor
 * ------------------------------------------------------------------ */

export function weapon(o) {
  const actId = "wyact" + id(o.name + o.owner).slice(0, 11);
  const ranged = Boolean(o.range);
  // An attack can also force a save — a slam that knocks prone. That rider is
  // written in the weapon's text, so it becomes a second activity beside the
  // attack rather than being lost.
  const rider = readMechanics(o.text, o.name);
  const riderSave = rider.dc !== null ? activityFor({ ...o, section: "rider" }, rider) : null;
  return {
    _id: id("item:" + o.owner + ":" + o.name),
    name: o.name,
    type: "weapon",
    img: o.img ?? (ranged ? "icons/weapons/bows/shortbow-recurve.webp" : "icons/weapons/swords/sword-broad-steel.webp"),
    system: {
      description: { value: o.text ?? "", chat: "" },
      source: { custom: "Wayreth: The Black Master", book: "", page: "", license: "", rules: "2014", revision: 1 },
      quantity: 1,
      weight: { value: 3, units: "lb" },
      price: { value: 0, denomination: "gp" },
      attunement: "", attuned: false, equipped: true, rarity: "", identified: true, cover: null,
      ammunition: { type: "" },
      magicalBonus: null,
      identifier: o.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      range: ranged
        ? { value: o.range[0], long: o.range[1] ?? null, units: "ft", reach: null }
        : { value: null, long: null, units: "ft", reach: o.reach ?? 5 },
      uses: { max: "", recovery: [], spent: 0 },
      damage: { versatile: damagePart(0, 0, []), base: damagePart(o.dice[0], o.dice[1], o.type, o.bonus ?? "") },
      armor: { value: 10 },
      hp: { value: 0, max: 0, dt: null, conditions: "" },
      properties: ranged ? ["amm"] : [],
      proficient: 1,
      unidentified: { description: "" },
      type: { value: ranged ? "martialR" : "martialM", baseItem: "" },
      container: null,
      crewed: false,
      activities: {
        [actId]: {
          _id: actId,
          type: "attack",
          activation: { type: "action", value: 1, condition: "", override: false },
          consumption: { targets: [], scaling: { allowed: false, max: "" }, spellSlot: true },
          description: { chatFlavor: "" },
          duration: { units: "inst", concentration: false, override: false },
          effects: [],
          range: { override: false },
          target: { template: { contiguous: false, units: "ft" }, affects: { choice: false, count: "1", type: "creature" }, override: false, prompt: true },
          uses: { spent: 0, recovery: [], max: "" },
          attack: {
            ability: o.ability ?? (ranged ? "dex" : "str"),
            bonus: "", critical: { threshold: null }, flat: false,
            type: { value: ranged ? "ranged" : "melee", classification: "weapon" }
          },
          damage: { critical: { bonus: "" }, includeBase: true, parts: (o.extra ?? []).map(e => damagePart(e[0], e[1], e[2])) },
          sort: 0
        },
        ...(riderSave ? { [riderSave._id]: { ...riderSave, sort: 100000 } } : {})
      }
    },
    effects: [], folder: null, sort: 0, ownership: { default: 0 },
    flags: { "wayreth-black-master": { managed: true } },
    _stats: {}
  };
}

/* ------------------------------------------------------------------ *
 *  Turning written rules into working mechanics
 *
 *  Every feature's rules are written out in its text, and until now that was
 *  all they were: a dragon's breath weapon described a DC and 12d6 of fire and
 *  the sheet offered nothing to click, never recharged, and rolled nothing.
 *
 *  Rather than restate each one by hand in the roster — 88 saving throws and 27
 *  recharges, every one a chance to mistype a DC — the mechanics are read back
 *  out of the text that already states them. The build then checks the derived
 *  activity against the prose it came from, so the two cannot disagree: if a
 *  DC is written and no save is produced, the build fails.
 *
 *  Nothing here invents a number. Every DC, die and damage type comes from the
 *  sentence a GM would read aloud.
 * ------------------------------------------------------------------ */

const ABILITY_KEYS = {
  strength: "str", dexterity: "dex", constitution: "con",
  intelligence: "int", wisdom: "wis", charisma: "cha"
};

const SAVE_RE = /DC\s*(\d+)\s+(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving throw/i;
// "14 (4d6) force damage" and "13 (2d6 + 6) bludgeoning damage".
const DAMAGE_RE = /(?:\d+\s*\()?(\d+)d(\d+)(?:\s*\+\s*(\d+))?\)?\s+(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\s+damage/gi;
const RECHARGE_RE = /Recharge\s*(\d)(?:\s*[-–—]\s*\d)?/i;
const HALF_RE = /half as much|half damage|half the damage/i;
const CONE_RE = /(\d+)-foot cone/i;
const LINE_RE = /(\d+)-foot line(?:,\s*(\d+) feet wide)?/i;
const RADIUS_RE = /within (\d+) feet/i;

/** Strips the markup the roster writes so the rules can be read as a sentence. */
function plainText(html) {
  return String(html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Reads the mechanics a feature's text describes.
 * @returns {{dc, ability, damage, onSave, recharge, template}}
 */
export function readMechanics(text, name = "") {
  const body = plainText(text);
  const whole = `${plainText(name)} ${body}`;

  const save = SAVE_RE.exec(body);
  const damage = [];
  DAMAGE_RE.lastIndex = 0;
  for (const match of body.matchAll(DAMAGE_RE)) {
    damage.push({
      number: Number(match[1]),
      denomination: Number(match[2]),
      bonus: match[3] ? String(match[3]) : "",
      type: match[4].toLowerCase()
    });
  }
  const recharge = RECHARGE_RE.exec(whole);

  let template = null;
  const cone = CONE_RE.exec(body);
  const line = LINE_RE.exec(body);
  const radius = RADIUS_RE.exec(body);
  if (cone) template = { type: "cone", size: cone[1] };
  else if (line) template = { type: "line", size: line[1], width: line[2] ?? "5" };
  else if (radius) template = { type: "radius", size: radius[1] };

  return {
    dc: save ? Number(save[1]) : null,
    ability: save ? ABILITY_KEYS[save[2].toLowerCase()] : null,
    damage,
    onSave: HALF_RE.test(body) ? "half" : "none",
    recharge: recharge ? recharge[1] : null,
    template
  };
}

/** How a feature is used, from the part of the stat block it sits in. */
function activationFor(o, mechanics) {
  if (o.activation) return o.activation;
  const name = plainText(o.name);
  if (o.section === "legendary") {
    const costs = /Costs (\d+) Actions?/i.exec(name);
    return { type: "legendary", value: costs ? Number(costs[1]) : 1 };
  }
  if (o.section === "rider") return { type: "special", value: null };
  if (o.section === "reaction") return { type: "reaction", value: null };
  if (o.section === "action") return { type: "action", value: null };
  // A trait that recharges or is spent is something the creature does on its
  // turn, not a passive — a breath weapon is the obvious case.
  if (mechanics.recharge) return { type: "action", value: null };
  if (/^As a bonus action/i.test(plainText(o.text))) return { type: "bonus", value: null };
  return { type: "special", value: null };
}

function targetBlock(mechanics) {
  const template = {
    count: "", contiguous: false, type: "", size: "",
    width: "", height: "", units: "ft", stationary: false
  };
  if (mechanics.template) {
    template.type = mechanics.template.type;
    template.size = String(mechanics.template.size);
    if (mechanics.template.width) template.width = String(mechanics.template.width);
  }
  return {
    template,
    affects: {
      count: "", type: mechanics.template ? "creature" : "", choice: false, special: ""
    },
    override: true,
    prompt: true
  };
}

/**
 * Builds the activity a feature's written rules call for, or null when the
 * feature really is just a passive trait.
 */
function activityFor(o, mechanics) {
  const hasSave = mechanics.dc !== null;
  const hasDamage = mechanics.damage.length > 0;
  if (!hasSave && !hasDamage && !mechanics.recharge) return null;

  const activation = activationFor(o, mechanics);
  const parts = mechanics.damage.map(d =>
    damagePart(d.number, d.denomination, d.type, d.bonus));

  const base = {
    _id: id("act:" + o.owner + ":" + o.name),
    type: hasSave ? "save" : hasDamage ? "damage" : "utility",
    name: "",
    img: "",
    sort: 0,
    activation: { ...activation, override: true, condition: o.trigger ?? "" },
    consumption: {
      scaling: { allowed: false, max: "" },
      spellSlot: false,
      targets: mechanics.recharge
        ? [{ type: "itemUses", target: "", value: "1", scaling: { mode: "" } }]
        : []
    },
    description: { chatFlavor: "" },
    duration: { units: "inst", value: "", special: "", concentration: false, override: true },
    effects: [],
    range: { units: "", value: "", special: "", override: true },
    target: targetBlock(mechanics),
    uses: { spent: 0, max: "", recovery: [] },
    flags: {},
    visibility: {
      level: {}, requireAttunement: false, requireIdentification: false, requireMagic: false
    }
  };

  if (hasSave) {
    base.save = {
      ability: [mechanics.ability],
      // A monster's DC is a flat number written into the stat block, not a
      // calculation off its abilities, so it is stored as the formula.
      dc: { calculation: "", formula: String(mechanics.dc) }
    };
    base.damage = { onSave: mechanics.onSave, parts };
  } else if (hasDamage) {
    base.damage = { critical: { allow: false, bonus: "" }, parts };
  } else {
    base.roll = { formula: "", name: "", prompt: false, visible: false };
  }

  return base;
}

/** The use pool a feature needs: a recharge die, an explicit limit, or none. */
function usesFor(o, mechanics) {
  if (mechanics.recharge) {
    return {
      max: "1", spent: 0,
      recovery: [{ period: "recharge", type: "recoverAll", formula: mechanics.recharge }]
    };
  }
  if (o.uses) {
    return {
      max: String(o.uses.max), spent: 0,
      recovery: [{ period: o.uses.per ?? "lr", type: "recoverAll", formula: "" }]
    };
  }
  return { max: "", spent: 0, recovery: [] };
}

/** A trait, action, reaction or legendary action with no attack roll. */
export function feature(o) {
  const mechanics = readMechanics(o.text, o.name);
  const activity = activityFor(o, mechanics);
  return {
    _id: id("item:" + o.owner + ":" + o.name),
    name: o.name,
    type: "feat",
    img: o.img ?? "icons/skills/melee/strike-slashes-orange.webp",
    system: {
      description: { value: `<p>${o.text}</p>`, chat: "" },
      source: { custom: "Wayreth: The Black Master", book: "", page: "", license: "", rules: "2014", revision: 1 },
      uses: usesFor(o, mechanics),
      type: { value: o.kind ?? "monster", subtype: "" },
      prerequisites: { level: null, repeatable: false, items: [] },
      properties: [], requirements: o.requirements ?? "",
      activities: activity ? { [activity._id]: activity } : {},
      enchant: {},
      identifier: o.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    },
    effects: [], folder: null, sort: 0, ownership: { default: 0 },
    flags: { "wayreth-black-master": { managed: true, section: o.section ?? "trait" } },
    _stats: {}
  };
}

/* ------------------------------------------------------------------ *
 *  The actor
 * ------------------------------------------------------------------ */

export function npc(o) {
  const cr = o.cr;
  const prof = profFor(cr);
  const abilities = {};
  for (const key of ["str", "dex", "con", "int", "wis", "cha"]) {
    abilities[key] = {
      value: o.abilities[key],
      proficient: (o.saves ?? []).includes(key) ? 1 : 0,
      bonuses: { check: "", save: "" },
      max: null
    };
  }
  const skills = {};
  for (const [key, level] of Object.entries(o.skills ?? {})) {
    skills[key] = { value: level, ability: undefined, bonuses: { check: "", passive: "" }, roll: { min: null, max: null, mode: 0 } };
  }

  const items = [
    ...(o.traits ?? []).map(t => feature({ ...t, owner: o.name, section: "trait" })),
    ...(o.actions ?? []).map(a => (a.dice ? weapon({ ...a, owner: o.name }) : feature({ ...a, owner: o.name, section: "action" }))),
    ...(o.reactions ?? []).map(r => feature({ ...r, owner: o.name, section: "reaction" })),
    ...(o.legendary ?? []).map(l => feature({ ...l, owner: o.name, section: "legendary" }))
  ];

  return {
    _id: id("actor:" + o.name),
    name: o.name,
    type: "npc",
    img: o.img ?? "icons/svg/mystery-man.svg",
    system: {
      abilities,
      attributes: {
        ac: { flat: o.ac, calc: "flat", formula: "" },
        hp: { value: o.hp, max: o.hp, temp: 0, tempmax: 0, formula: o.hpFormula ?? "" },
        hd: { spent: 0 },
        init: { ability: "", bonus: "0", roll: { min: null, max: null, mode: 0 } },
        movement: { burrow: 0, climb: 0, fly: 0, swim: 0, walk: 30, units: "ft", hover: false, ...(o.speed ?? {}) },
        attunement: { max: 3 },
        senses: { darkvision: 0, blindsight: 0, tremorsense: 0, truesight: 0, units: "ft", special: "", ...(o.senses ?? {}) },
        spellcasting: o.spellcasting ?? "",
        exhaustion: 0,
        concentration: { ability: "", roll: { min: null, max: null, mode: 0 }, bonuses: { save: "" }, limit: 1 },
        death: { ability: "", roll: { min: null, max: null, mode: 0 }, success: 0, failure: 0 }
      },
      details: {
        biography: { value: o.bio ?? "", public: "" },
        alignment: o.alignment,
        race: null,
        type: { value: o.type, subtype: o.subtype ?? "", swarm: "", custom: "" },
        environment: o.environment ?? "",
        cr,
        spellLevel: o.spellLevel ?? 0,
        ideal: "", bond: "", flaw: "",
        source: { custom: "Wayreth: The Black Master", book: "", page: "", license: "", rules: "2014", revision: 1 }
      },
      resources: { legact: { value: o.legendaryUses ?? 0, max: o.legendaryUses ?? 0 }, legres: { value: o.legres ?? 0, max: o.legres ?? 0 }, lair: { value: false, initiative: null } },
      skills,
      source: { custom: "Wayreth: The Black Master", book: "", page: "", license: "", rules: "2014", revision: 1 },
      spells: {},
      tools: {},
      traits: {
        size: o.size ?? "med",
        di: { value: o.di ?? [], bypasses: [], custom: "" },
        dr: { value: o.dr ?? [], bypasses: o.drBypass ?? [], custom: o.drCustom ?? "" },
        dv: { value: o.dv ?? [], bypasses: [], custom: "" },
        dm: { amount: {}, bypasses: [] },
        ci: { value: o.ci ?? [], custom: "" },
        languages: { value: o.languages ?? [], custom: o.langCustom ?? "" }
      },
      bonuses: { mwak: { attack: "", damage: "" }, rwak: { attack: "", damage: "" }, msak: { attack: "", damage: "" }, rsak: { attack: "", damage: "" }, abilities: { check: "", save: "", skill: "" }, spell: { dc: "" } },
      currency: { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 }
    },
    items,
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: { "wayreth-black-master": { managed: true, group: o.group } },
    _stats: {}
  };
}

export { mod, avg };
