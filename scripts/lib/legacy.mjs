import crypto from "node:crypto";

/**
 * Builders for the six Crow legacy items.
 *
 * A legacy item is a single dnd5e Item whose features become usable as the
 * character levels. Nothing is swapped out and there are no sibling documents:
 * every feature is an Activity carrying `visibility.level`, which dnd5e checks
 * in `Activity#canUse` against the owning character's level. A feature below
 * its band is hidden on the sheet; a feature a later tier replaces carries a
 * `max` so the old and new versions never both appear.
 *
 * Verified against dnd5e 5.3.3:
 *   module/data/activity/base-activity.mjs   visibility.level.{min,max}
 *   module/documents/activity/mixin.mjs      canUse() level comparison
 *   module/data/shared/uses-field.mjs        dawn/dusk recovery, clamp to max
 *   module/data/activity/save-data.mjs       dc.calculation ability resolution
 *   module/config.mjs                        rarity + equipment type enums
 */

const AB = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Deterministic 16-character document id, so rebuilds keep stable ids. */
export function id(seed) {
  const h = crypto.createHash("sha256").update(seed).digest();
  let out = "";
  for (let i = 0; i < 16; i++) out += AB[h[i] % AB.length];
  return out;
}

/* ------------------------------------------------------------------ *
 *  Tiers
 * ------------------------------------------------------------------ */

export const TIERS = {
  dormant: { key: "dormant", label: "Dormant", rarity: "uncommon", min: 3, max: 5, charges: 3,
    regain: "all of them" },
  awakened: { key: "awakened", label: "Awakened", rarity: "rare", min: 6, max: 9, charges: 5,
    regain: "all of them" },
  exalted: { key: "exalted", label: "Exalted", rarity: "veryRare", min: 10, max: 14, charges: 7,
    regain: "1d6 + 1" },
  legendary: { key: "legendary", label: "Legendary", rarity: "legendary", min: 15, max: null, charges: 9,
    regain: "1d8 + 1" }
};

export const TIER_ORDER = ["dormant", "awakened", "exalted", "legendary"];

function tier(key) {
  const t = TIERS[key];
  if (!t) throw new Error(`Unknown legacy tier: ${key}`);
  return t;
}

/** Level band label, e.g. "levels 6–9" or "level 15+". */
export function bandLabel(key) {
  const t = tier(key);
  return t.max === null ? `level ${t.min}+` : `levels ${t.min}–${t.max}`;
}

/**
 * `visibility.level` for a feature that appears at `from` and, when
 * `until` is given, stops being offered once that later tier arrives.
 */
export function gate(from, until = null) {
  const level = { min: tier(from).min };
  if (until) level.max = tier(until).min - 1;
  return level;
}

/* ------------------------------------------------------------------ *
 *  Level-scaling formulas
 * ------------------------------------------------------------------ */

/**
 * 1 once the character reaches `level`, otherwise 0.
 *
 * Deliberately built from min/max rather than a ternary: dnd5e's own
 * migration strips any `uses.max` containing " ? "
 * (module/data/item/templates/activities.mjs), and `min`/`max` are the
 * idiom the shipped SRD packs use.
 */
function step(level) {
  return `min(1, max(0, @details.level - ${level - 1}))`;
}

const S_AWAKENED = step(TIERS.awakened.min);
const S_EXALTED = step(TIERS.exalted.min);
const S_LEGENDARY = step(TIERS.legendary.min);

/**
 * The charge pool: 3 at Dormant, 5 at Awakened, 7 at Exalted, 9 at Legendary.
 * Deterministic, as `uses.max` requires.
 */
export const CHARGE_MAX = `3 + 2 * ${S_AWAKENED} + 2 * ${S_EXALTED} + 2 * ${S_LEGENDARY}`;

/**
 * Charges regained each dawn (or dusk, for Sylas).
 *
 * Dormant and Awakened return every spent charge; Exalted regains 1d6 + 1 and
 * Legendary 1d8 + 1, so a bigger pool refills more slowly. Only one recovery
 * profile per period is ever applied, so the tier switch lives inside the
 * formula: the two dice are multiplied by their own tier's step and the
 * low-tier branch pays out the full pool exactly.
 *
 *   levels 3-5    0 + 0 + 0 + 3   = 3   (full)
 *   levels 6-9    0 + 0 + 0 + 5   = 5   (full)
 *   levels 10-14  1d6 + 0 + 1 + 0 = 1d6 + 1
 *   level 15+     0 + 1d8 + 1 + 0 = 1d8 + 1
 */
export const CHARGE_RECOVERY =
  `1d6 * (${S_EXALTED} - ${S_LEGENDARY}) + 1d8 * ${S_LEGENDARY}`
  + ` + ${S_EXALTED} + (3 + 2 * ${S_AWAKENED}) * (1 - ${S_EXALTED})`;

/* ------------------------------------------------------------------ *
 *  Activity scaffolding
 * ------------------------------------------------------------------ */

function template() {
  return {
    count: "", contiguous: false, type: "", size: "",
    width: "", height: "", units: "ft", stationary: false
  };
}

function affects(o = {}) {
  return {
    count: o.count ?? "",
    type: o.type ?? "",
    choice: o.choice ?? false,
    special: o.special ?? ""
  };
}

function rangeBlock(o = {}) {
  // `override: true` throughout: equipment carries no item-level range for an
  // activity to inherit, and this keeps what is written here from being merged
  // away if that ever changes.
  if (o.self) return { units: "self", value: "", special: "", override: true };
  if (o.touch) return { units: "touch", value: "", special: "", override: true };
  if (o.feet != null) return { units: "ft", value: String(o.feet), special: "", override: true };
  return { units: "", value: "", special: o.special ?? "", override: true };
}

function durationBlock(o) {
  if (!o) return { units: "inst", value: "", special: "", concentration: false, override: false };
  return {
    units: o.units ?? "inst",
    value: o.value != null ? String(o.value) : "",
    special: o.special ?? "",
    concentration: Boolean(o.concentration),
    override: true
  };
}

function consumptionBlock(o) {
  const targets = [];
  if (o.charges) {
    targets.push({ type: "itemUses", target: "", value: String(o.charges), scaling: { mode: "" } });
  }
  if (o.perRest) {
    targets.push({ type: "activityUses", target: "", value: "1", scaling: { mode: "" } });
  }
  for (const extra of o.consumes ?? []) {
    targets.push({ type: extra.type, target: extra.target ?? "", value: String(extra.value), scaling: { mode: "" } });
  }
  return { scaling: { allowed: false, max: "" }, spellSlot: false, targets };
}

const REST_PERIODS = { short: "sr", long: "lr", day: "day" };

function usesBlock(o) {
  if (!o.perRest) return { spent: 0, max: "", recovery: [] };
  const max = String(o.perRestUses ?? 1);
  // A feature that recharges on something dnd5e has no period for — Sylas' Not
  // Yet waits seven days — gets a pool with no recovery profile, so it stays
  // spent until somebody clears it deliberately. That is honest; a "day" period
  // would quietly hand it back six days early.
  if (o.perRest === "manual") return { spent: 0, max, recovery: [] };
  const period = REST_PERIODS[o.perRest];
  if (!period) throw new Error(`Unknown perRest value: ${o.perRest}`);
  // "sr" recovers on a short rest and again on a long one, which is how dnd5e
  // feeds recovery periods during a long rest.
  return { spent: 0, max, recovery: [{ period, type: "recoverAll", formula: "" }] };
}

/**
 * One activity. `o.tier` sets the level gate; `o.until` closes it when a later
 * tier supersedes the feature.
 */
export function activity(o) {
  const activityId = id(`legacy:${o.owner}:${o.name}:${o.tier}`);
  const base = {
    _id: activityId,
    type: o.type,
    name: o.name,
    img: o.img ?? "",
    sort: o.sort ?? 0,
    activation: {
      type: o.activation ?? "special",
      value: o.activationValue ?? null,
      override: true,
      condition: o.condition ?? ""
    },
    consumption: consumptionBlock(o),
    description: { chatFlavor: o.flavor ?? "" },
    duration: durationBlock(o.duration),
    effects: [],
    range: rangeBlock(o.range ?? {}),
    target: {
      template: template(),
      affects: affects(o.affects),
      override: true,
      prompt: o.prompt ?? true
    },
    uses: usesBlock(o),
    flags: {},
    // Level is the only gate. dnd5e derives `requireAttunement` from
    // `requireMagic` on an attunement-required item
    // (base-activity.mjs prepareFinalData), so leaving both false keeps a
    // feature visible the moment its level band opens rather than hiding it
    // behind an unticked attunement box — which is how the bearer's other
    // relics already behave.
    visibility: {
      level: gate(o.tier, o.until),
      requireAttunement: false,
      requireIdentification: false,
      requireMagic: false
    }
  };

  if (o.type === "utility") {
    base.roll = {
      formula: o.formula ?? "",
      name: o.rollName ?? "",
      prompt: Boolean(o.formula) && (o.rollPrompt ?? false),
      visible: Boolean(o.formula)
    };
  }

  if (o.type === "save") {
    base.save = {
      ability: Array.isArray(o.save) ? o.save : [o.save],
      dc: { calculation: o.dc, formula: "" }
    };
    base.damage = { onSave: o.onSave ?? "half", parts: o.damage ?? [] };
  }

  if (o.type === "check") {
    base.check = {
      ability: o.ability ?? "",
      associated: o.associated ?? [],
      dc: { calculation: o.dc ?? "", formula: o.dcFormula ?? "" }
    };
  }

  if (o.type === "heal") {
    base.healing = o.healing;
  }

  if (o.type === "damage") {
    base.damage = { critical: { allow: false, bonus: "" }, parts: o.damage ?? [] };
  }

  if (o.type === "attack") {
    base.attack = {
      ability: o.attackAbility ?? "",
      bonus: "",
      critical: { threshold: null },
      flat: false,
      type: { value: o.attackType ?? "melee", classification: "weapon" }
    };
    base.damage = { critical: { bonus: "" }, includeBase: true, parts: o.damage ?? [] };
  }

  return base;
}

/** A damage or healing part in the shape dnd5e's DamageField expects. */
export function part(number, denomination, types, bonus = "") {
  return {
    number,
    denomination,
    bonus,
    types: Array.isArray(types) ? types : [types],
    custom: { enabled: false, formula: "" },
    scaling: { mode: "", number: null, formula: "" }
  };
}

/**
 * A damage or healing part whose whole amount is a formula, which dnd5e
 * expresses through `custom.enabled` rather than `bonus`
 * (see packs/_source/classfeatures/.../dark-ones-blessing.yml).
 */
export function customPart(formula, types) {
  return {
    number: null,
    denomination: null,
    bonus: "",
    types: Array.isArray(types) ? types : [types],
    custom: { enabled: true, formula },
    scaling: { mode: "", number: null, formula: "" }
  };
}

/* ------------------------------------------------------------------ *
 *  Active effects
 * ------------------------------------------------------------------ */

export const MODE = { MULTIPLY: 1, ADD: 2, DOWNGRADE: 3, UPGRADE: 4, OVERRIDE: 5 };

/**
 * A transferred ActiveEffect. Because dnd5e suppresses effects carried by
 * equipment that is not equipped and attuned, these only bite once the bearer
 * is actually wearing the thing.
 *
 * Changes whose target is one of dnd5e's formula fields — encumbrance
 * multipliers among them — are resolved later against the actor's roll data
 * (data/actor/templates/attributes.mjs), so a change written as a level
 * expression gates itself without anyone toggling the effect.
 */
export function effect(o) {
  return {
    _id: id(`legacy-effect:${o.owner}:${o.name}`),
    name: o.name,
    img: o.img ?? "icons/magic/symbols/runes-star-blue.webp",
    type: "base",
    system: {},
    changes: o.changes.map(c => ({
      key: c.key,
      mode: c.mode,
      value: String(c.value),
      priority: c.priority ?? null
    })),
    disabled: Boolean(o.disabled),
    duration: {
      startTime: null, combat: null, seconds: null,
      rounds: null, turns: null, startRound: null, startTurn: null
    },
    description: o.description ?? "",
    origin: null,
    tint: "#ffffff",
    transfer: true,
    statuses: [],
    sort: o.sort ?? 0,
    flags: { dnd5e: { riders: { statuses: [] } } },
    _stats: {}
  };
}

/* ------------------------------------------------------------------ *
 *  Description rendering
 * ------------------------------------------------------------------ */

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Renders `**bold**` and `*italic*` only; everything else is escaped. */
export function inline(s) {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

export function renderBlocks(blocks) {
  const out = [];
  for (const b of blocks) {
    if (typeof b === "string") { out.push(`<p>${inline(b)}</p>`); continue; }
    if (b.h) { out.push(`<h4>${inline(b.h)}</h4>`); continue; }
    if (b.list) {
      out.push(`<ul>${b.list.map(li => `<li>${inline(li)}</li>`).join("")}</ul>`);
      continue;
    }
    throw new Error(`Unknown description block: ${JSON.stringify(b)}`);
  }
  return out.join("");
}

/**
 * The item description: the lead, then one section per tier carrying its
 * level band, rarity, awakening trigger and features.
 */
export function describe(o) {
  const html = [`<div class="wayreth-journal wy-legacy">`];
  html.push(`<p class="wy-lead">${inline(o.lead)}</p>`);
  html.push(`<p><em>${inline(o.subtitle)}</em></p>`);

  if (o.quote) {
    html.push(`<blockquote class="wy-quote"><p>${inline(o.quote)}</p>`
      + (o.quoteBy ? `<footer>${inline(o.quoteBy)}</footer>` : "") + `</blockquote>`);
  }

  html.push(`<h3>How this item works</h3>`);
  html.push(`<p>This is a <strong>legacy item</strong>. It keeps everything from earlier`
    + ` states unless a later feature says it replaces one, and its charge pool and each`
    + ` feature unlock on their own as ${esc(o.bearer)} gains levels — Foundry hides an`
    + ` activity until its level band is reached, so the sheet only ever shows what is`
    + ` currently available.</p>`);
  html.push(`<p><strong>Legacy Save DC:</strong> 8 + proficiency bonus + `
    + `${esc(o.dcLabel)} modifier.</p>`);

  for (const key of TIER_ORDER) {
    const t = TIERS[key];
    const section = o.tiers[key];
    if (!section) throw new Error(`${o.name}: missing tier ${key}`);
    html.push(`<h3>${t.label} — ${esc(rarityLabel(t.rarity))}, ${esc(bandLabel(key))}</h3>`);
    if (section.trigger) {
      html.push(`<p><strong>Awakening:</strong> ${inline(section.trigger)}</p>`);
    }
    html.push(`<p><strong>${esc(o.chargeName)}:</strong> ${t.charges}, `
      + `${esc(section.recovery)}.</p>`);
    html.push(renderBlocks(section.blocks));
  }

  html.push(`<h3>Vault Record</h3>`);
  html.push(`<p><strong>Classification:</strong> Legacy item, bound to ${esc(o.bearer)}. `
    + `<strong>Rules:</strong> D&amp;D 5e (2014). `
    + `<strong>Origin:</strong> ${inline(o.origin)}</p>`);
  html.push(`</div>`);
  return html.join("");
}

/* ------------------------------------------------------------------ *
 *  Reading an activity back as English
 *
 *  The player journals print what a feature costs, and they read it off the
 *  built activity rather than off a hand-written line, so a change to the item
 *  cannot leave the reference sheet describing the old version.
 * ------------------------------------------------------------------ */

const ACTIVATION_LABELS = {
  action: "Action",
  bonus: "Bonus action",
  reaction: "Reaction",
  special: "No action",
  minute: "minute",
  hour: "hour"
};

export function activationLabel(act) {
  const type = act.activation.type;
  if (type === "minute" || type === "hour") {
    const n = act.activation.value ?? 1;
    return `${n} ${ACTIVATION_LABELS[type]}${n === 1 ? "" : "s"}`;
  }
  return ACTIVATION_LABELS[type] ?? type;
}

const REST_LABELS = { sr: "short or long rest", lr: "long rest", day: "day" };

function usesLabel(act) {
  const max = act.uses.max;
  if (!max) return null;
  const period = act.uses.recovery[0]?.period;
  const times = max === "@prof" ? "proficiency bonus" : max;
  if (!period) return `once, then reset by hand — it does not return on a rest`;
  return `${times}× per ${REST_LABELS[period] ?? period}`;
}

/** Everything a feature costs, as short phrases. */
export function costLabels(act) {
  const out = [];
  for (const target of act.consumption.targets) {
    if (target.type === "itemUses") {
      const n = Number(target.value);
      out.push(`${n} charge${n === 1 ? "" : "s"}`);
    } else if (target.type === "hitDice") {
      const n = Number(target.value);
      out.push(`${n} Hit Di${n === 1 ? "e" : "ce"}`);
    }
  }
  const uses = usesLabel(act);
  if (uses) out.push(uses);
  if (!out.length) out.push("no cost");
  return out;
}

/** The one-line stat block a player reads before the prose. */
export function statLine(act, { dcLabel } = {}) {
  const bits = [activationLabel(act), costLabels(act).join(" \u00b7 ")];
  if (act.duration.units === "minute" || act.duration.units === "hour") {
    const n = act.duration.value || "1";
    bits.push(`${n} ${act.duration.units}${String(n) === "1" ? "" : "s"}`
      + (act.duration.concentration ? ", concentration" : ""));
  }
  if (act.type === "save") {
    const abilities = act.save.ability.map(a => a.toUpperCase()).join(" or ");
    bits.push(`${abilities} save vs Legacy DC${dcLabel ? ` (${dcLabel})` : ""}`);
  }
  if (act.type === "check") bits.push("contested check");
  if (act.type === "heal" && act.healing) {
    bits.push(`${amountTypes(act.healing)}`);
  }
  if (act.type === "damage") {
    const amounts = (act.damage?.parts ?? []).map(amountTypes);
    // What a rider costs is the damage it deals, so that replaces "no cost".
    if (amounts.length) return [activationLabel(act), amounts.join(" + ")].join(" \u2014 ");
  }
  return bits.join(" \u2014 ");
}

const TYPE_LABELS = { temphp: "temporary hit points", healing: "hit points healed" };

/**
 * A damage or healing amount as a player would say it. Roll-data references are
 * exactly right on the sheet and unreadable in prose, so they are spelled out.
 */
function amountTypes(part) {
  const types = part.types.map(t => TYPE_LABELS[t] ?? t).join("/");
  let amount = part.custom.enabled ? part.custom.formula
    : `${part.number}d${part.denomination}`;
  let suffix = "";
  const perProf = amount.match(/^\(@prof\)d(\d+)$/);
  if (perProf) {
    amount = `1d${perProf[1]}`;
    suffix = " per proficiency bonus";
  }
  amount = amount
    .replace(/^2 \* @classes\.([a-z]+)\.levels$/, "twice your $1 level")
    .replace(/@classes\.([a-z]+)\.levels/g, "your $1 level")
    .replaceAll("@prof", "your proficiency bonus");
  // "temporary hit points equal to twice your sorcerer level" reads; the other
  // order does not.
  if (/^[a-z]/.test(amount)) return `${types} equal to ${amount}${suffix}`;
  return `${amount} ${types}${suffix}`;
}

/**
 * The short line dnd5e puts on a chat card.
 *
 * Left empty, `getCardData` falls back to the item's whole description, which
 * on a legacy item is all four states at once. The module trims the card to the
 * feature actually used, and this is the fallback if that ever does not run.
 */
function chatBlurb(o) {
  return `<p><em>${inline(o.subtitle)}</em></p>`
    + `<p>A legacy item. Its features unlock as ${esc(o.bearer)} gains levels, and the`
    + ` reference journal <strong>${esc(o.bearer)} \u2014 ${esc(o.name)}</strong> carries the`
    + ` whole progression.</p>`;
}

function rarityLabel(rarity) {
  return { uncommon: "Uncommon", rare: "Rare", veryRare: "Very Rare", legendary: "Legendary" }[rarity]
    ?? rarity;
}

/* ------------------------------------------------------------------ *
 *  Item assembly
 * ------------------------------------------------------------------ */

/**
 * Builds the finished Item document. `o.activities` is a flat list of
 * `activity()` results; sort order follows the list.
 */
export function legacyItem(o) {
  const activities = {};
  o.activities.forEach((act, index) => {
    act.sort = index * 100000;
    if (activities[act._id]) {
      throw new Error(`${o.name}: duplicate activity id for ${act.name}`);
    }
    activities[act._id] = act;
  });

  return {
    _id: id(`legacy-item:${o.name}`),
    name: o.name,
    type: "equipment",
    img: o.img,
    effects: o.effects ?? [],
    folder: null,
    sort: o.order * 1000,
    ownership: { default: 0 },
    flags: {
      "wayreth-black-master": {
        managed: true,
        legacy: true,
        bearer: o.bearer,
        chargeName: o.chargeName,
        dc: o.dc
      }
    },
    _stats: {},
    system: {
      description: { value: describe(o), chat: chatBlurb(o) },
      source: {
        custom: "Wayreth: The Black Master",
        book: "Master of the Black Tower",
        page: "",
        license: "",
        revision: 1,
        rules: "2014"
      },
      identified: true,
      unidentified: { description: "", name: "Unidentified Legacy Relic" },
      quantity: 1,
      weight: { value: o.weight ?? 1, units: "lb" },
      price: { value: 0, denomination: "gp" },
      // The sheet shows one rarity; the item opens at its Dormant state and the
      // description carries the rarity of every later state.
      rarity: TIERS.dormant.rarity,
      attunement: "required",
      attuned: false,
      equipped: false,
      cover: null,
      identifier: o.identifier,
      container: null,
      crew: { value: [] },
      ammunition: {},
      armor: {},
      properties: ["mgc"],
      proficient: null,
      type: { value: o.equipmentType ?? "wondrous", baseItem: "" },
      uses: {
        spent: 0,
        max: CHARGE_MAX,
        recovery: [{ period: o.recoveryPeriod ?? "dawn", type: "formula", formula: CHARGE_RECOVERY }]
      },
      magicalBonus: null,
      activities
    }
  };
}
