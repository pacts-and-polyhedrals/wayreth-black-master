/**
 * Wayreth: The Black Master — Krynn Calendar & Moon Tracker
 *
 * Deliberately built with plain DOM rather than the Application framework.
 * ApplicationV2 landed in v12 but shifted between v12/v13/v14, and V1 is on its
 * way out — injecting our own element sidesteps the whole question and keeps a
 * single codebase working from v12 through v14.
 */

const MODULE = "wayreth-black-master";

/* ------------------------------------------------------------------ *
 *  Calendar constants
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 *  Calendar systems
 *
 *  Each world defines its own months, week and moons. Festival days are
 *  modelled as short months (Harptos's Midwinter is a 1-day month; Greyhawk's
 *  Needfest is a 7-day one), which keeps the date maths uniform.
 * ------------------------------------------------------------------ */

const KRYNN_MONTHS = {
  solamnic: ["Newkolt", "Deepkolt", "Brookgreen", "Yurthgreen", "Fleurgreen", "Holmswelt",
             "Fierswelt", "Paleswelt", "Reapember", "Gildember", "Darkember", "Frostkolt"],
  ergothi:  ["Aelmont", "Rannmont", "Mishamont", "Chislmont", "Bran", "Corij",
             "Argon", "Sirrimont", "Reorxmont", "Hiddumont", "H'rarmont", "Phoenix"],
  elven:    ["Winter Night", "Winter Deep", "Spring Dawning", "Spring Rising", "Spring Blossom",
             "Summer Home", "Summer Run", "Summer End", "Autumn Harvest", "Autumn Twilight",
             "Autumn Dark", "Winter Come"]
};

const m28 = names => names.map(name => ({ name, days: 28 }));

/** Krynn: 336 days, twelve 28-day months, three moons. */
function krynn(culture) {
  return {
    label: `Krynn — ${culture[0].toUpperCase()}${culture.slice(1)}`,
    world: "krynn",
    yearSuffix: "AC",
    months: m28(KRYNN_MONTHS[culture]),
    weekdays: ["Linaris", "Majetag", "Bakukal", "Misham", "Kirinor", "Sothkal", "Bracha"],
    // Night of the Eye = LCM(36, 28, 8) = 504 days.
    moons: {
      solinari: { label: "Solinari", order: "White Robes", period: 36, base: 0, colour: "#dfe4ea" },
      lunitari: { label: "Lunitari", order: "Red Robes",   period: 28, base: 0, colour: "#c0392b" },
      nuitari:  { label: "Nuitari",  order: "Black Robes", period: 8,  base: 0, colour: "#2b2b33" }
    },
    sanction: { high: "High Sanction", low: "Low Sanction" },
    alignment: "The Night of the Eye"
  };
}

const CALENDARS = {
  solamnic: krynn("solamnic"),
  ergothi:  krynn("ergothi"),
  elven:    krynn("elven"),

  /** Toril, Calendar of Harptos: 365 days — twelve 30-day months and five festival days. */
  toril: {
    label: "Toril — Calendar of Harptos",
    world: "toril",
    yearSuffix: "DR",
    months: [
      { name: "Hammer", days: 30 },
      { name: "Midwinter", days: 1, festival: true },
      { name: "Alturiak", days: 30 },
      { name: "Ches", days: 30 },
      { name: "Tarsakh", days: 30 },
      { name: "Greengrass", days: 1, festival: true },
      { name: "Mirtul", days: 30 },
      { name: "Kythorn", days: 30 },
      { name: "Flamerule", days: 30 },
      { name: "Midsummer", days: 1, festival: true },
      { name: "Eleasis", days: 30 },
      { name: "Eleint", days: 30 },
      { name: "Highharvestide", days: 1, festival: true },
      { name: "Marpenoth", days: 30 },
      { name: "Uktar", days: 30 },
      { name: "The Feast of the Moon", days: 1, festival: true },
      { name: "Nightal", days: 30 }
    ],
    // Harptos reckons in tendays rather than weeks.
    weekdays: ["First-day", "Second-day", "Third-day", "Fourth-day", "Fifth-day",
               "Sixth-day", "Seventh-day", "Eighth-day", "Ninth-day", "Tenth-day"],
    moons: {
      selune: { label: "Selûne", order: "the Moonmaiden", period: 30, base: 0, colour: "#e8e4d0" }
    },
    sanction: { high: "Full", low: "New" },
    alignment: null // a single moon has nothing to align with
  },

  /** Oerth, Common Year: 364 days — twelve 28-day months and four 7-day festivals. */
  oerth: {
    label: "Oerth — Greyhawk Common Year",
    world: "oerth",
    yearSuffix: "CY",
    months: [
      { name: "Needfest", days: 7, festival: true },
      { name: "Fireseek", days: 28 },
      { name: "Readying", days: 28 },
      { name: "Coldeven", days: 28 },
      { name: "Growfest", days: 7, festival: true },
      { name: "Planting", days: 28 },
      { name: "Flocktime", days: 28 },
      { name: "Wealsun", days: 28 },
      { name: "Richfest", days: 7, festival: true },
      { name: "Reaping", days: 28 },
      { name: "Goodmonth", days: 28 },
      { name: "Harvester", days: 28 },
      { name: "Brewfest", days: 7, festival: true },
      { name: "Patchwall", days: 28 },
      { name: "Ready'reat", days: 28 },
      { name: "Sunsebb", days: 28 }
    ],
    weekdays: ["Starday", "Sunday", "Moonday", "Godsday", "Waterday", "Earthday", "Freeday"],
    // Luna full on Fireseek 11 (day 17); Celene full on the 4th of each festival
    // week (day 3). Both full on Richfest 4 — LCM(28, 91) = 364, so once a year.
    moons: {
      luna:   { label: "Luna",   order: "the Greater Moon", period: 28, base: 11, colour: "#e6e2cf" },
      celene: { label: "Celene", order: "the Handmaiden",   period: 91, base: 88, colour: "#a8d8c0" }
    },
    sanction: { high: "Full", low: "New" },
    alignment: "The Conjunction of Luna and Celene"
  }
};

function calendar() {
  return CALENDARS[get("calendarSystem")] ?? CALENDARS.solamnic;
}

function daysPerYear(cal = calendar()) {
  return cal.months.reduce((total, month) => total + month.days, 0);
}

/** Lowest common multiple of the moon periods — how often they all come full. */
function alignmentCycle(cal = calendar()) {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  return Object.values(cal.moons).reduce((acc, m) => (acc * m.period) / gcd(acc, m.period), 1);
}

const MOONS = CALENDARS.solamnic.moons; // retained for the Krynn sanction API

const MINUTES_PER_DAY = 1440;

/**
 * Darkness curve anchors, in minutes from midnight. Darkness eases between
 * these points, so dawn and dusk are gradual rather than a hard switch.
 */
const DEFAULT_DAWN = 6 * 60;   // 06:00 — darkness has fallen to 0 by sunrise end
const DEFAULT_DUSK = 18 * 60;  // 18:00 — darkness begins climbing at sunset start
const TWILIGHT = 60;           // minutes of transition either side

const TIME_STEPS = [
  { label: "1m", minutes: 1 },
  { label: "10m", minutes: 10 },
  { label: "1h", minutes: 60 },
  { label: "8h", minutes: 480 }
];

const MIN_WIDGET_SCALE = 0.70;
const MAX_WIDGET_SCALE = 1.60;
const WIDGET_SCALE_STEP = 0.10;

const PHASES = [
  { name: "Full",            sanction: "high" },
  { name: "Waning Gibbous",  sanction: null   },
  { name: "Waning",          sanction: null   },
  { name: "Waning Crescent", sanction: null   },
  { name: "New",             sanction: "low"  },
  { name: "Waxing Crescent", sanction: null   },
  { name: "Waxing",          sanction: null   },
  { name: "Waxing Gibbous",  sanction: null   }
];

const SANCTION_KEY = `
  <div class="wy-key-heading">Moon Power Key</div>
  <div class="wy-key-orders">
    <span><i class="wy-key-dot wy-key-solinari"></i><strong>Solinari</strong> · White Robes</span>
    <span><i class="wy-key-dot wy-key-lunitari"></i><strong>Lunitari</strong> · Red Robes</span>
    <span><i class="wy-key-dot wy-key-nuitari"></i><strong>Nuitari</strong> · Black Robes</span>
  </div>
  <div class="wy-key-rule wy-key-high">
    <strong>Gold ring · High Sanction (full)</strong>
    <span>Once per turn add proficiency bonus to one spell's damage; once per long rest cast one spell as one slot level higher; advantage on Arcana and saves against counterspell or dispel magic.</span>
  </div>
  <div class="wy-key-rule wy-key-low">
    <strong>Crimson ring · Low Sanction (new)</strong>
    <span>−2 to spell save DC and spell attacks; highest-level spell slot is unavailable; disadvantage on concentration saves.</span>
  </div>
  <div class="wy-key-rule wy-key-eye-rule">
    <strong>Night of the Eye · all three full</strong>
    <span>Every Order gains High Sanction. See the <em>Moons and Sanction</em> journal for the additional ritual and cross-Order magic rules.</span>
  </div>`;

/* ------------------------------------------------------------------ *
 *  Date maths
 * ------------------------------------------------------------------ */

function get(key) { return game.settings.get(MODULE, key); }

/** Absolute day index -> { year, month, day, monthName, weekday } */
function toDate(dayIndex) {
  const cal = calendar();
  const epoch = get("epochYear");
  const yearLength = daysPerYear(cal);
  const y = Math.floor(dayIndex / yearLength);
  let rem = ((dayIndex % yearLength) + yearLength) % yearLength;

  let index = 0;
  while (index < cal.months.length - 1 && rem >= cal.months[index].days) {
    rem -= cal.months[index].days;
    index++;
  }
  const month = cal.months[index];
  const week = cal.weekdays;
  return {
    year: epoch + y,
    month: index + 1,
    day: rem + 1,
    monthName: month.name,
    festival: Boolean(month.festival),
    // Festival days sit outside the ordinary week in several of these
    // calendars, but a continuous count keeps the widget honest.
    weekday: week[(((dayIndex % week.length) + week.length) % week.length)],
    yearSuffix: cal.yearSuffix
  };
}

function fromDate(year, month, day) {
  const cal = calendar();
  const epoch = get("epochYear");
  const clampedMonth = Math.min(Math.max(1, Math.round(month)), cal.months.length);
  let offset = 0;
  for (let i = 0; i < clampedMonth - 1; i++) offset += cal.months[i].days;
  const maxDay = cal.months[clampedMonth - 1].days;
  const clampedDay = Math.min(Math.max(1, Math.round(day)), maxDay);
  return (year - epoch) * daysPerYear(cal) + offset + (clampedDay - 1);
}


/** Phase bucket 0-7 for one moon. 0 = full (high sanction), 4 = new (low). */
function moonPhase(key, dayIndex) {
  const cal = calendar();
  const moon = cal.moons[key];
  if (!moon) return null;
  // A moon's built-in offset places it correctly for its own world; the three
  // Krynn offset settings then let a GM dial in a specific alignment.
  const settingKey = `offset${key[0].toUpperCase()}${key.slice(1)}`;
  const tuned = cal.world === "krynn" ? (get(settingKey) ?? 0) : 0;
  const offset = (moon.base ?? 0) + tuned;
  const pos = (((dayIndex + offset) % moon.period) + moon.period) % moon.period;
  const bucket = Math.round((pos / moon.period) * 8) % 8;
  const phase = PHASES[bucket];
  return {
    key,
    ...moon,
    position: pos,
    fraction: pos / moon.period,
    bucket,
    ...phase,
    sanctionLabel: phase.sanction ? cal.sanction[phase.sanction] : phase.name
  };
}


/* ------------------------------------------------------------------ *
 *  Time of day
 * ------------------------------------------------------------------ */

function clampMinutes(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 0;
  return ((n % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

function toClock(minutes) {
  const m = clampMinutes(minutes);
  const hours = Math.floor(m / 60);
  const mins = m % 60;
  return {
    minutes: m,
    hours,
    mins,
    hh: String(hours).padStart(2, "0"),
    mm: String(mins).padStart(2, "0"),
    label: `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
  };
}

/** Coarse period name, used for the widget's secondary line. */
function dayPart(minutes) {
  const m = clampMinutes(minutes);
  if (m < 4 * 60) return "Deep night";
  if (m < DEFAULT_DAWN + TWILIGHT) return "Dawn";
  if (m < 11 * 60) return "Morning";
  if (m < 14 * 60) return "Midday";
  if (m < DEFAULT_DUSK - TWILIGHT) return "Afternoon";
  if (m < DEFAULT_DUSK + TWILIGHT) return "Dusk";
  return "Night";
}

function smoothstep(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/**
 * Scene darkness for a given time of day, 0 (full day) to 1 (full night).
 *
 * On Krynn the moons matter: when a moon stands full the night is measurably
 * less dark, and on the Night of the Eye it barely gets dark at all. That
 * lightening only applies after dusk — it never brightens the daytime.
 */
function darknessFor(minutes, dayIndex) {
  const m = clampMinutes(minutes);
  let darkness;
  if (m <= DEFAULT_DAWN - TWILIGHT) darkness = 1;
  else if (m < DEFAULT_DAWN + TWILIGHT) darkness = 1 - smoothstep((m - (DEFAULT_DAWN - TWILIGHT)) / (TWILIGHT * 2));
  else if (m <= DEFAULT_DUSK - TWILIGHT) darkness = 0;
  else if (m < DEFAULT_DUSK + TWILIGHT) darkness = smoothstep((m - (DEFAULT_DUSK - TWILIGHT)) / (TWILIGHT * 2));
  else darkness = 1;

  if (darkness > 0 && get("moonlight")) {
    // Each full moon lifts the night a little; all three lift it a lot.
    const full = allMoons(dayIndex).filter(moon => moon.sanction === "high").length;
    const lift = full >= 3 ? 0.45 : full * 0.10;
    darkness = Math.max(0, darkness - lift * darkness);
  }
  return Math.round(darkness * 1000) / 1000;
}

function allMoons(dayIndex) {
  return Object.keys(calendar().moons).map(k => moonPhase(k, dayIndex)).filter(Boolean);
}

function isNightOfTheEye(dayIndex) {
  const cal = calendar();
  if (!cal.alignment) return false;
  const moons = allMoons(dayIndex);
  return moons.length > 1 && moons.every(m => m.bucket === 0);
}

/** Days until the next Night of the Eye, or null if none within one full cycle. */
function daysToEye(dayIndex) {
  if (!calendar().alignment) return null;
  const limit = alignmentCycle();
  for (let i = 0; i <= limit; i++) if (isNightOfTheEye(dayIndex + i)) return i;
  return null;
}

/* ------------------------------------------------------------------ *
 *  Moon rendering
 * ------------------------------------------------------------------ */

/**
 * SVG path for the illuminated portion of a disc of radius r.
 * fraction: 0 = full, 0.5 = new. Waxing (fraction > 0.5) lights the right side.
 */
function litPath(r, fraction) {
  const w = Math.cos(2 * Math.PI * fraction); // 1 full, -1 new, 0 at quarters
  if (Math.abs(w) > 0.995) {
    return w > 0 ? `M 0 ${-r} A ${r} ${r} 0 1 1 0 ${r} A ${r} ${r} 0 1 1 0 ${-r} Z` : "";
  }
  const rx = Math.abs(w) * r;
  const waxing = fraction > 0.5;
  // Semicircle on the lit side, then an ellipse back along the terminator.
  const semiSweep = waxing ? 1 : 0;
  const ellipseSweep = w > 0 ? semiSweep : (waxing ? 0 : 1);
  return `M 0 ${-r} A ${r} ${r} 0 0 ${semiSweep} 0 ${r} ` +
         `A ${rx} ${r} 0 0 ${ellipseSweep} 0 ${-r} Z`;
}

function moonSvg(moon, size = 20) {
  const r = size / 2 - 1;
  const path = litPath(r, moon.fraction);
  const dark = moon.key === "nuitari" ? "#0b0b0f" : "#1a1611";
  return `
    <svg class="wy-moon-svg" viewBox="${-size / 2} ${-size / 2} ${size} ${size}" width="${size}" height="${size}">
      <circle r="${r}" fill="${dark}" stroke="${moon.colour}" stroke-opacity="0.45" stroke-width="0.75"/>
      ${path ? `<path d="${path}" fill="${moon.colour}"/>` : ""}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 *  Widget
 * ------------------------------------------------------------------ */

let root = null;
let trackerRoot = null;

const TRACKERS = {
  raistlinTrust: {
    setting: "trackerRaistlinTrust", label: "Raistlin Trust", short: "Trust",
    min: -10, max: 10, start: 0, icon: "fa-handshake", accent: "#c9a227",
    hint: "Whether Raistlin sees the party as tools, confidants, or eventual enemies.\nUp: completing missions, honesty, protecting his secrets, arguing well.\nDown: betrayal, leaks, manipulation, moralising.",
    bands: [
      { at: 8, name: "Confidant", tone: "good" },
      { at: 5, name: "Explains himself", tone: "good" },
      { at: -4, name: "Instrument", tone: "neutral" },
      { at: -10, name: "Security risk", tone: "bad" }
    ]
  },
  raistlinControl: {
    setting: "trackerRaistlinControl", label: "Raistlin Control", short: "Control",
    min: -10, max: 10, start: 0, icon: "fa-link", accent: "#b52626",
    hint: "How strongly Raistlin embraces domination as the answer to loss. This gates the endings.\nUp: forced resurrection, mind control, permanent binding.\nDown: consent, voluntary sacrifice, compassionate alternatives that work.",
    bands: [
      { at: 4, name: "Dominion", tone: "bad" },
      { at: -3, name: "Undecided", tone: "neutral" },
      { at: -10, name: "Restraint", tone: "good" }
    ]
  },
  fistandantilusInfluence: {
    setting: "trackerFistandantilusInfluence", label: "Fistandantilus Influence", short: "Fistandantilus",
    min: -10, max: 10, start: 0, icon: "fa-hourglass-half", accent: "#7d5ba6",
    hint: "How deeply Fistandantilus's philosophy has entered Raistlin's thinking.\nRises with every Long Return fragment and every dominion working tolerated.\nAt 7 his handwriting begins to resemble Fistandantilus's.",
    bands: [
      { at: 7, name: "Ascendant", tone: "bad" },
      { at: 4, name: "Growing", tone: "warn" },
      { at: -10, name: "Faint", tone: "neutral" }
    ]
  },
  whiteRobeBond: {
    setting: "trackerWhiteRobeBond", label: "White Robe Bond", short: "White Bond",
    min: -10, max: 10, start: 0, icon: "fa-dove", accent: "#dfe4ea",
    hint: "The most important number in the finale.\nUp: difficult compassion with the consequence accepted; defying him and being right.\nDown: hiding behind the Order's rules; condemning without an alternative.\nAt +6 he listens in the Abyss when he will listen to nobody else.",
    bands: [
      { at: 9, name: "Asks their view", tone: "good" },
      { at: 6, name: "Heeded", tone: "good" },
      { at: -2, name: "Watched", tone: "neutral" },
      { at: -10, name: "Dismissed", tone: "bad" }
    ]
  },
  wayrethAccord: {
    setting: "trackerWayrethAccord", label: "Wayreth Accord", short: "Wayreth",
    min: -10, max: 10, start: 0, icon: "fa-chess-rook", accent: "#4a9d7f",
    hint: "Whether the Tower itself recognises and assists the party.\nAt +5 doors open that should not. At +8 it will act against Raistlin's stated instructions to help them.",
    bands: [
      { at: 8, name: "Complicit", tone: "good" },
      { at: 5, name: "Responsive", tone: "good" },
      { at: -10, name: "Indifferent", tone: "neutral" }
    ]
  },
  warState: {
    setting: "trackerWarState", label: "War State", short: "War",
    min: 0, max: 10, start: 2, icon: "fa-shield-halved", accent: "#cc7722",
    hint: "Dragonarmy progress across Ansalon. Starts at 2.\nRises by 1 at each arc boundary, and again when the party's choices cost the defenders materially.\nSide quests that help can hold it down.",
    bands: [
      { at: 9, name: "Siege", tone: "bad" },
      { at: 7, name: "Occupied", tone: "bad" },
      { at: 5, name: "Fortified", tone: "warn" },
      { at: 3, name: "Refugees", tone: "warn" },
      { at: 0, name: "Rumour", tone: "neutral" }
    ]
  }
};

/** Bands are listed high to low; the first the value reaches wins. */
function trackerBand(key, value = trackerValue(key)) {
  const def = TRACKERS[key];
  return def.bands.find(b => value >= b.at) ?? def.bands[def.bands.length - 1];
}

function trackerSigned(key, value = trackerValue(key)) {
  return TRACKERS[key].min < 0 && value > 0 ? `+${value}` : String(value);
}


function canSee() {
  // The Krynn calendar is a shared table display. Every connected user sees it.
  return true;
}

function visibleMoons(dayIndex) {
  const moons = allMoons(dayIndex);
  if (game.user.isGM || get("showNuitariToPlayers")) return moons;
  // Nuitari is invisible to all but those who serve him.
  return moons.filter(m => m.key !== "nuitari");
}

function trackerValue(key) {
  const def = TRACKERS[key];
  if (!def) return 0;
  const n = Number(get(def.setting));
  if (!Number.isFinite(n)) return def.start;
  return Math.max(def.min, Math.min(def.max, Math.round(n)));
}

function trackerState(key, value = trackerValue(key)) {
  if (key === "raistlinTrust") {
    if (value <= -6) return "Security risk";
    if (value >= 9) return "Rare personal confidence";
    if (value >= 6) return "Trusted confidants";
    return "Useful instruments";
  }
  if (key === "raistlinControl") {
    if (value <= -4) return "Consent over dominion";
    if (value >= 4) return "Dominion solution";
    return "Unsettled";
  }
  if (key === "fistandantilusInfluence") {
    if (value >= 7) return "The Dark One is showing through";
    if (value >= 4) return "Philosophy taking root";
    if (value <= -4) return "Actively resisted";
    return "Latent influence";
  }
  if (key === "whiteRobeBond") {
    if (value >= 9) return "He asks before acting";
    if (value >= 6) return "He will listen in the Abyss";
    if (value <= -5) return "Par-Salian's shadow";
    return "Testing each other";
  }
  if (key === "wayrethAccord") {
    if (value >= 8) return "Tower may defy its Master for them";
    if (value >= 5) return "Wayreth opens for them";
    if (value <= -5) return "Tower keeps its distance";
    return "Observed by the Tower";
  }
  if (key === "warState") {
    if (value <= 2) return "War is still distant";
    if (value <= 4) return "Refugees & checkpoints";
    if (value <= 6) return "Fortified roads & lost villages";
    if (value <= 8) return "Regions under Dragonarmy control";
    return "Palanthas / High Clerist line";
  }
  return "";
}

async function setTracker(key, value) {
  const def = TRACKERS[key];
  if (!def || !requireGM("change campaign trackers")) return false;
  const clamped = Math.max(def.min, Math.min(def.max, Math.round(Number(value) || 0)));
  await game.settings.set(MODULE, def.setting, clamped);
  return true;
}

async function adjustTracker(key, delta) {
  return setTracker(key, trackerValue(key) + Math.round(Number(delta) || 0));
}

function openTrackerGuide() {
  if (!game.user.isGM) return;
  const journal = game.journal?.find(j => j.getFlag?.(MODULE, "sourceFile") === "campaign-timeline.json")
    ?? game.journal?.getName?.("Campaign Timeline and Trackers");
  if (!journal) return ui.notifications?.warn?.("Campaign Timeline and Trackers journal is not installed.");
  journal.sheet?.render?.(true);
}

function renderTrackers() {
  if (!trackerRoot || !game.user?.isGM) return;
  const collapsed = Boolean(get("trackersCollapsed"));

  // One row per tracker. Two columns of six cards was unreadable in a docked
  // player-list column, so each tracker gets the full width: accent stripe and
  // icon to identify it at a glance, tone colour for where the value sits.
  const rows = Object.entries(TRACKERS).map(([key, def]) => {
    const value = trackerValue(key);
    const band = trackerBand(key, value);
    const pct = Math.round(((value - def.min) / (def.max - def.min)) * 100);
    return `<div class="wy-tracker-row wy-tone-${band.tone}" data-tracker="${key}"
                 style="--wy-accent:${def.accent}" data-tooltip="${def.label}&#10;&#10;${def.hint}">
      <span class="wy-tracker-icon"><i class="fa-solid ${def.icon}"></i></span>
      <div class="wy-tracker-main">
        <div class="wy-tracker-line">
          <span class="wy-tracker-name">${def.short}</span>
          <span class="wy-tracker-band">${band.name}</span>
        </div>
        <div class="wy-tracker-meter"><span style="width:${pct}%"></span></div>
      </div>
      <div class="wy-tracker-nudge">
        <button type="button" data-adjust="1" aria-label="Raise ${def.label}" data-tooltip="Raise &mdash; shift +2, alt +3">&#9650;</button>
        <strong class="wy-tracker-value">${trackerSigned(key, value)}</strong>
        <button type="button" data-adjust="-1" aria-label="Lower ${def.label}" data-tooltip="Lower &mdash; shift &minus;2, alt &minus;3">&#9660;</button>
      </div>
    </div>`;
  }).join("");

  const chips = Object.entries(TRACKERS).map(([key, def]) => {
    const band = trackerBand(key);
    return `<span class="wy-tracker-chip wy-tone-${band.tone}" style="--wy-accent:${def.accent}"
                  data-tooltip="${def.label} &mdash; ${band.name}"><i class="fa-solid ${def.icon}"></i>${trackerSigned(key)}</span>`;
  }).join("");

  trackerRoot.innerHTML = `<div class="wy-tracker-board${collapsed ? " is-collapsed" : ""}">
    <div class="wy-tracker-header">
      <div class="wy-tracker-heading">
        <span class="wy-tracker-kicker">Game Master</span>
        <strong>Campaign Trackers</strong>
      </div>
      <div class="wy-tracker-actions">
        <button type="button" class="wy-tracker-guide" data-tooltip="Open the tracker guide"><i class="fa-solid fa-book-open"></i></button>
        <button type="button" class="wy-tracker-collapse" aria-expanded="${!collapsed}" data-tooltip="${collapsed ? "Expand" : "Collapse"} campaign trackers">${collapsed ? "&#9650;" : "&#9660;"}</button>
      </div>
    </div>
    ${collapsed ? `<div class="wy-tracker-chips">${chips}</div>` : `<div class="wy-tracker-rows">${rows}</div>`}
  </div>`;

  trackerRoot.querySelector(".wy-tracker-collapse")?.addEventListener("click", async () => {
    await game.settings.set(MODULE, "trackersCollapsed", !collapsed);
  });
  trackerRoot.querySelector(".wy-tracker-guide")?.addEventListener("click", openTrackerGuide);
  trackerRoot.querySelectorAll(".wy-tracker-row").forEach(row => {
    const key = row.dataset.tracker;
    row.querySelectorAll("[data-adjust]").forEach(button => button.addEventListener("click", ev => {
      ev.stopPropagation();
      const mult = ev.shiftKey ? 2 : (ev.altKey ? 3 : 1);
      adjustTracker(key, Number(button.dataset.adjust) * mult);
    }));
  });
}

function render() {
  if (!root) return;
  const dayIndex = get("dayIndex");
  const date = toDate(dayIndex);
  const moons = visibleMoons(dayIndex);
  const eye = isNightOfTheEye(dayIndex);
  const isGM = game.user.isGM;
  const scale = clampWidgetScale(get("widgetScale"));
  const minuteOfDay = get("minuteOfDay");
  const clock = toClock(minuteOfDay);

  const moonHtml = moons.map(m => {
    const sanction = m.sanctionLabel;
    const cls = m.sanction ? ` wy-sanction-${m.sanction}` : "";
    return `<div class="wy-moon${cls}" data-tooltip="${m.label} — ${m.name} (${m.order})&#10;${sanction}">
              ${moonSvg(m)}
            </div>`;
  }).join("");

  root.innerHTML = `
    <div class="wy-cal-bar${eye ? " wy-eye" : ""}" style="--wy-darkness:${darknessFor(minuteOfDay, dayIndex)}">
      <div class="wy-cal-date">
        <div class="wy-cal-line1">${date.day} ${date.monthName}</div>
        <div class="wy-cal-line2">${date.weekday} &middot; ${date.year} ${date.yearSuffix}</div>
      </div>
      <div class="wy-clock${isGM ? " wy-clock-live" : ""}"
           data-tooltip="${dayPart(minuteOfDay)}${isGM ? "&#10;Drag sideways to scrub &middot; scroll to nudge &middot; double-click for noon" : ""}">
        <div class="wy-clock-time">${clock.label}</div>
        <div class="wy-clock-part">${dayPart(minuteOfDay)}</div>
      </div>
      <div class="wy-strip">
        <div class="wy-moons">${moonHtml}</div>
        <div class="wy-controls">
          ${isGM ? `<button type="button" class="wy-step" data-step="-1" data-tooltip="Back one day">&#9664;</button>` : ""}
          ${isGM ? `<button type="button" class="wy-step" data-step="1" data-tooltip="Forward one day">&#9654;</button>` : ""}
          <button type="button" class="wy-key-toggle" aria-expanded="false" data-tooltip="Moon power key">?</button>
          ${isGM ? `<button type="button" class="wy-cog" data-tooltip="GM calendar controls">&#9881;</button>` : ""}
        </div>
      </div>
      ${isDocked() ? "" : `<div class="wy-resize-handle" role="slider" tabindex="0"
           aria-label="Resize calendar" aria-valuemin="${Math.round(MIN_WIDGET_SCALE * 100)}"
           aria-valuemax="${Math.round(MAX_WIDGET_SCALE * 100)}" aria-valuenow="${Math.round(scale * 100)}"
           data-tooltip="Drag to resize &mdash; double-click to reset"></div>`}
    </div>
    ${eye ? `<div class="wy-eye-banner">${calendar().alignment ?? "Alignment"}</div>` : ""}
    <div class="wy-sanction-key" hidden>${SANCTION_KEY}</div>
    <div class="wy-cal-panel" hidden></div>`;

  if (isGM) {
    root.querySelectorAll(".wy-step").forEach(b =>
      b.addEventListener("click", () => advance(Number(b.dataset.step))));
    root.querySelector(".wy-cog")?.addEventListener("click", togglePanel);
  }
  root.querySelector(".wy-key-toggle")?.addEventListener("click", toggleSanctionKey);
  // Docked width is dictated by the player list, so resizing is disabled there.
  if (!isDocked()) attachResizeHandle();
  if (isGM) attachClockScrub();
  if (isDocked()) root.classList.add("wy-docked");
}

function toggleSanctionKey() {
  const key = root?.querySelector(".wy-sanction-key");
  const button = root?.querySelector(".wy-key-toggle");
  if (!key || !button) return;
  key.hidden = !key.hidden;
  button.setAttribute("aria-expanded", String(!key.hidden));
}

function togglePanel() {
  if (!game.user.isGM) return;
  const panel = root.querySelector(".wy-cal-panel");
  if (!panel.hidden) { panel.hidden = true; return; }

  const dayIndex = get("dayIndex");
  const d = toDate(dayIndex);
  const eyeIn = daysToEye(dayIndex);
  const cal = calendar();
  const monthLength = cal.months[d.month - 1].days;
  const clock = toClock(get("minuteOfDay"));
  const linked = game.scenes.filter(isSceneLinked);

  panel.innerHTML = `
    <div class="wy-panel-row">
      <label>Day</label><input type="number" class="wy-in-day" value="${d.day}" min="1" max="${monthLength}">
      <label>Month</label>
      <select class="wy-in-month">
        ${cal.months.map((m, i) => `<option value="${i + 1}"${i + 1 === d.month ? " selected" : ""}>${m.name}${m.festival ? " \u00b7 festival" : ""}</option>`).join("")}
      </select>
      <label>Year</label><input type="number" class="wy-in-year" value="${d.year}">
      <button type="button" class="wy-set">Set</button>
    </div>
    <div class="wy-panel-row">
      <label>Time</label>
      <input type="number" class="wy-in-hour" value="${clock.hours}" min="0" max="23">
      <span class="wy-colon">:</span>
      <input type="number" class="wy-in-min" value="${clock.mins}" min="0" max="59" step="5">
      <button type="button" class="wy-set-time">Set</button>
      <button type="button" data-time="360">Dawn</button>
      <button type="button" data-time="720">Noon</button>
      <button type="button" data-time="1080">Dusk</button>
      <button type="button" data-time="0">Midnight</button>
    </div>
    <div class="wy-panel-row wy-panel-jump">
      ${TIME_STEPS.map(st => `<button type="button" data-minutes="-${st.minutes}">&minus;${st.label}</button>`).join("")}
      ${TIME_STEPS.map(st => `<button type="button" data-minutes="${st.minutes}">+${st.label}</button>`).join("")}
    </div>
    <div class="wy-panel-row wy-panel-jump">
      <button type="button" data-jump="7">+1 week</button>
      <button type="button" data-jump="${monthLength}">+1 month</button>
      <button type="button" data-jump="-7">&minus;1 week</button>
      <button type="button" data-jump="-${monthLength}">&minus;1 month</button>
      <button type="button" class="wy-goto-eye">Jump to Night of the Eye</button>
      <button type="button" class="wy-road-start">Road to Wayreth · 18 Darkember</button>
    </div>
    <div class="wy-panel-note">
      ${eyeIn === 0 ? "All three moons are full tonight."
        : eyeIn === null ? "No alignment within one full cycle — check your moon offsets."
        : `Next ${cal.alignment ?? "alignment"} in <strong>${eyeIn}</strong> day${eyeIn === 1 ? "" : "s"}.`}
      <br>Moon offsets are in module settings if you need to dial in a specific alignment.
      <br>${linked.length
        ? `Darkness synced to <strong>${linked.length}</strong> scene${linked.length === 1 ? "" : "s"}: ${linked.map(sc => sc.name).join(", ")}.`
        : "No scenes linked. Tick <em>Link to Krynn Calendar</em> in a scene's configuration to sync its darkness."}
    </div>`;
  panel.hidden = false;

  panel.querySelector(".wy-set").addEventListener("click", () => {
    const day = Number(panel.querySelector(".wy-in-day").value);
    const month = Number(panel.querySelector(".wy-in-month").value);
    const year = Number(panel.querySelector(".wy-in-year").value);
    setDayIndex(fromDate(year, month, day));
    panel.hidden = true;
  });
  panel.querySelectorAll("[data-jump]").forEach(b =>
    b.addEventListener("click", () => advance(Number(b.dataset.jump))));
  panel.querySelectorAll("[data-minutes]").forEach(b =>
    b.addEventListener("click", () => advanceMinutes(Number(b.dataset.minutes))));
  panel.querySelectorAll("[data-time]").forEach(b =>
    b.addEventListener("click", () => setMinuteOfDay(Number(b.dataset.time))));
  panel.querySelector(".wy-set-time").addEventListener("click", () => {
    setTime(Number(panel.querySelector(".wy-in-hour").value),
            Number(panel.querySelector(".wy-in-min").value));
  });
  panel.querySelector(".wy-goto-eye").addEventListener("click", () => {
    const n = daysToEye(get("dayIndex"));
    if (n === null) return ui.notifications.warn("No alignment found within one full cycle.");
    advance(n === 0 ? alignmentCycle() : n);
    panel.hidden = true;
  });
  panel.querySelector(".wy-road-start")?.addEventListener("click", async () => {
    await setRoadToWayrethClock();
    panel.hidden = true;
  });
}

/* ------------------------------------------------------------------ *
 *  Positioning and local size
 * ------------------------------------------------------------------ */

function clampWidgetScale(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_WIDGET_SCALE, Math.max(MIN_WIDGET_SCALE, n));
}

function applyScale() {
  if (!root) return;
  // Docked mode always renders 1:1 — the player list sets the width.
  const scale = isDocked() ? 1 : clampWidgetScale(get("widgetScale"));
  root.style.setProperty("--wy-widget-scale", String(scale));
  const handle = root.querySelector(".wy-resize-handle");
  handle?.setAttribute("aria-valuenow", String(Math.round(scale * 100)));
}

/**
 * Bottom-right corner resize.
 *
 * The widget scales with `transform: scale()` from a `top left` origin, so the
 * widget's top-left stays put while dragging and the new scale is simply the
 * ratio of the pointer's distance from that corner, then and now. Using the
 * diagonal rather than one axis keeps the grip under the cursor whichever way
 * the pointer moves.
 */
/**
 * SmallTime-style time scrubbing on the clock readout.
 *
 * Horizontal drag scrubs, and the widget updates optimistically at every step
 * so the display tracks the pointer; the setting is written on release so a
 * long drag is one world write rather than hundreds. The wheel nudges by ten
 * minutes, and double-click jumps to midday.
 */
function attachClockScrub() {
  const clock = root?.querySelector(".wy-clock");
  if (!clock || !game.user.isGM) return;

  const PIXELS_PER_MINUTE = 0.6; // ~24 px per 10 minutes at scale 1
  let startX = 0;
  let startMinutes = 0;
  let live = null;

  clock.addEventListener("pointerdown", ev => {
    if (ev.button !== 0) return;
    ev.preventDefault();
    ev.stopPropagation(); // do not start a widget move
    startX = ev.clientX;
    startMinutes = get("minuteOfDay");
    live = startMinutes;
    clock.setPointerCapture(ev.pointerId);
    root.classList.add("wy-scrubbing");
  });

  clock.addEventListener("pointermove", ev => {
    if (live === null) return;
    live = startMinutes + Math.round((ev.clientX - startX) / PIXELS_PER_MINUTE);
    paintClock(live);
  });

  const finish = async ev => {
    if (live === null) return;
    const total = live;
    live = null;
    clock.releasePointerCapture?.(ev.pointerId);
    root.classList.remove("wy-scrubbing");
    await advanceMinutes(total - startMinutes);
  };
  clock.addEventListener("pointerup", finish);
  clock.addEventListener("pointercancel", finish);

  clock.addEventListener("wheel", ev => {
    ev.preventDefault();
    ev.stopPropagation();
    advanceMinutes(ev.deltaY < 0 ? 10 : -10);
  }, { passive: false });

  clock.addEventListener("dblclick", ev => {
    ev.preventDefault();
    ev.stopPropagation();
    setMinuteOfDay(12 * 60);
  });
}

/** Repaint just the clock during a scrub, without a settings round-trip. */
function paintClock(totalMinutes) {
  if (!root) return;
  const clock = toClock(totalMinutes);
  const part = dayPart(clock.minutes);
  const timeEl = root.querySelector(".wy-clock-time");
  const partEl = root.querySelector(".wy-clock-part");
  if (timeEl) timeEl.textContent = clock.label;
  if (partEl) partEl.textContent = part;
  const bar = root.querySelector(".wy-cal-bar");
  const dayShift = Math.floor(totalMinutes / MINUTES_PER_DAY);
  bar?.style.setProperty("--wy-darkness", String(darknessFor(clock.minutes, get("dayIndex") + dayShift)));
}

function attachResizeHandle() {
  const handle = root?.querySelector(".wy-resize-handle");
  if (!handle) return;

  let startScale = 1;
  let startDistance = 0;
  let originX = 0;
  let originY = 0;
  let live = null;

  const distance = ev => Math.hypot(ev.clientX - originX, ev.clientY - originY);

  handle.addEventListener("pointerdown", ev => {
    ev.preventDefault();
    ev.stopPropagation(); // never start a widget move
    const rect = root.getBoundingClientRect();
    originX = rect.left;
    originY = rect.top;
    startScale = clampWidgetScale(get("widgetScale"));
    startDistance = distance(ev);
    if (startDistance < 8) return; // degenerate grab, ignore
    live = startScale;
    handle.setPointerCapture(ev.pointerId);
    root.classList.add("wy-resizing");
  });

  handle.addEventListener("pointermove", ev => {
    if (live === null) return;
    live = clampWidgetScale(startScale * (distance(ev) / startDistance));
    root.style.setProperty("--wy-widget-scale", String(live));
    handle.setAttribute("aria-valuenow", String(Math.round(live * 100)));
    requestAnimationFrame(positionTrackers);
  });

  const finish = async ev => {
    if (live === null) return;
    const final = live;
    live = null;
    handle.releasePointerCapture?.(ev.pointerId);
    root.classList.remove("wy-resizing");
    // Persist once, on release, rather than on every pointermove.
    await setWidgetScale(final);
      if (!isDocked()) { keepInViewport(); positionTrackers(); }
  };
  handle.addEventListener("pointerup", finish);
  handle.addEventListener("pointercancel", finish);

  handle.addEventListener("dblclick", ev => {
    ev.preventDefault();
    ev.stopPropagation();
    setWidgetScale(1);
  });

  // Keyboard parity for the drag grip.
  handle.addEventListener("keydown", ev => {
    const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[ev.key];
    if (step === undefined) {
      if (ev.key === "Home") { ev.preventDefault(); setWidgetScale(1); }
      return;
    }
    ev.preventDefault();
    adjustWidgetScale(step * WIDGET_SCALE_STEP);
  });
}

async function setWidgetScale(value) {
  const scale = Math.round(clampWidgetScale(value) * 100) / 100;
  await game.settings.set(MODULE, "widgetScale", scale);
}

async function adjustWidgetScale(delta) {
  return setWidgetScale(clampWidgetScale(get("widgetScale")) + delta);
}

function positionTrackers() {
  if (!trackerRoot || !root || !game.user?.isGM) return;
  if (isDocked()) {
    trackerRoot.classList.add("wy-docked");
    trackerRoot.style.left = trackerRoot.style.top = trackerRoot.style.right = trackerRoot.style.bottom = "";
    trackerRoot.style.width = "";
    return;
  }
  trackerRoot.classList.remove("wy-docked");
  const rect = root.getBoundingClientRect();
  const width = Math.max(280, Math.min(420, rect.width));
  trackerRoot.style.width = `${width}px`;
  const trackerRect = trackerRoot.getBoundingClientRect();
  const gap = 6;
  let left = Math.max(4, Math.min(window.innerWidth - width - 4, rect.left));
  let top = rect.top - trackerRect.height - gap;
  if (top < 4) top = Math.min(window.innerHeight - trackerRect.height - 4, rect.bottom + gap);
  trackerRoot.style.left = `${left}px`;
  trackerRoot.style.top = `${Math.max(4, top)}px`;
  trackerRoot.style.right = "auto";
  trackerRoot.style.bottom = "auto";
}

function keepInViewport() {
  if (!root) return;
  const rect = root.getBoundingClientRect();
  let left = rect.left;
  let top = rect.top;
  if (rect.right > window.innerWidth) left -= rect.right - window.innerWidth;
  if (rect.bottom > window.innerHeight) top -= rect.bottom - window.innerHeight;
  left = Math.max(0, left);
  top = Math.max(0, top);
  root.style.left = `${left}px`;
  root.style.top = `${top}px`;
  root.style.right = "auto";
  root.style.bottom = "auto";
  positionTrackers();
}

function applyPosition() {
  const pos = get("widgetPosition") ?? {};
  if (Number.isFinite(pos.left) && Number.isFinite(pos.top)) {
    root.style.left = `${pos.left}px`;
    root.style.top = `${pos.top}px`;
    root.style.right = "auto";
    root.style.bottom = "auto";
    requestAnimationFrame(positionTrackers);
    return;
  }

  // Convert the default bottom-left placement into explicit coordinates before
  // scaling so resize operations stay anchored and dragging never jumps.
  const rect = root.getBoundingClientRect();
  root.style.left = `${rect.left}px`;
  root.style.top = `${rect.top}px`;
  root.style.right = "auto";
  root.style.bottom = "auto";
  requestAnimationFrame(positionTrackers);
}

function makeDraggable() {
  let dragging = false, startX = 0, startY = 0, originLeft = 0, originTop = 0;
  let visualWidth = 0, visualHeight = 0;

  root.addEventListener("pointerdown", ev => {
    if (ev.target.closest("button, input, select")) return;
    dragging = true;
    const rect = root.getBoundingClientRect();
    originLeft = rect.left; originTop = rect.top;
    visualWidth = rect.width; visualHeight = rect.height;
    startX = ev.clientX; startY = ev.clientY;
    root.setPointerCapture(ev.pointerId);
    root.classList.add("wy-dragging");
  });

  root.addEventListener("pointermove", ev => {
    if (!dragging) return;
    const maxLeft = Math.max(0, window.innerWidth - visualWidth);
    const maxTop = Math.max(0, window.innerHeight - visualHeight);
    const left = Math.max(0, Math.min(maxLeft, originLeft + ev.clientX - startX));
    const top = Math.max(0, Math.min(maxTop, originTop + ev.clientY - startY));
    root.style.left = `${left}px`;
    root.style.top = `${top}px`;
    root.style.right = "auto";
    root.style.bottom = "auto";
    requestAnimationFrame(positionTrackers);
  });

  root.addEventListener("pointerup", ev => {
    if (!dragging) return;
    dragging = false;
    root.releasePointerCapture(ev.pointerId);
    root.classList.remove("wy-dragging");
    const rect = root.getBoundingClientRect();
    game.settings.set(MODULE, "widgetPosition", { left: rect.left, top: rect.top });
    positionTrackers();
  });
}

/* ------------------------------------------------------------------ *
 *  State changes
 * ------------------------------------------------------------------ */

function requireGM(action = "change the Krynn calendar") {
  if (game.user.isGM) return true;
  ui.notifications?.warn?.(`Only the GM can ${action}.`);
  return false;
}

async function setDayIndex(value) {
  if (!requireGM("change the date")) return false;
  await game.settings.set(MODULE, "dayIndex", Math.round(value));
  return true;
}

async function advance(days) {
  if (!requireGM("advance the date")) return false;
  return setDayIndex(get("dayIndex") + days);
}

async function setMinuteOfDay(value) {
  if (!requireGM("change the time")) return false;
  await game.settings.set(MODULE, "minuteOfDay", clampMinutes(value));
  return true;
}

/**
 * Advance the clock, rolling the date over at midnight in either direction.
 * Both settings are written before either onChange re-renders, so the widget
 * never shows a half-applied state.
 */
async function advanceMinutes(delta) {
  if (!requireGM("advance the time")) return false;
  const total = get("minuteOfDay") + Math.round(Number(delta) || 0);
  const dayShift = Math.floor(total / MINUTES_PER_DAY);
  const minute = ((total % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  if (dayShift !== 0) await game.settings.set(MODULE, "dayIndex", get("dayIndex") + dayShift);
  await game.settings.set(MODULE, "minuteOfDay", minute);
  return true;
}

async function setTime(hours, mins = 0) {
  return setMinuteOfDay((Number(hours) || 0) * 60 + (Number(mins) || 0));
}

async function setRoadToWayrethClock() {
  if (!requireGM("reset the Road to Wayreth clock")) return false;
  await game.settings.set(MODULE, "epochYear", 350);
  await game.settings.set(MODULE, "calendarSystem", "solamnic");
  await game.settings.set(MODULE, "offsetSolinari", 24);
  await game.settings.set(MODULE, "offsetLunitari", 0);
  await game.settings.set(MODULE, "offsetNuitari", 0);
  await setDayIndex(fromDate(350, 11, 18));
  ui.notifications.info("Road to Wayreth clock set: 18 Darkember, 39 days to the Night of the Eye.");
  return true;
}

/* ------------------------------------------------------------------ *
 *  Scene darkness sync
 * ------------------------------------------------------------------ */

/**
 * Foundry v12 moved scene darkness under `environment`; older data keeps it at
 * the top level. Build whichever update payload this scene actually uses.
 */
function darknessUpdate(scene, darkness) {
  if (scene.environment !== undefined) return { environment: { darknessLevel: darkness } };
  return { darkness };
}

function sceneDarkness(scene) {
  return scene.environment?.darknessLevel ?? scene.darkness ?? 0;
}

function isSceneLinked(scene) {
  return scene?.getFlag?.(MODULE, "syncDarkness") === true;
}

/**
 * Push the current time's darkness to every linked scene. Only the GM writes;
 * players receive the change through the normal document update broadcast.
 */
async function syncLinkedScenes({ animate = true } = {}) {
  if (!game.user.isGM) return 0;
  const darkness = darknessFor(get("minuteOfDay"), get("dayIndex"));
  const updates = [];
  for (const scene of game.scenes) {
    if (!isSceneLinked(scene)) continue;
    if (Math.abs(sceneDarkness(scene) - darkness) < 0.001) continue;
    updates.push({ _id: scene.id, ...darknessUpdate(scene, darkness) });
  }
  if (!updates.length) return 0;
  await Scene.updateDocuments(updates, { animateDarkness: animate ? 4000 : 0 });
  return updates.length;
}

/** Checkbox injected into Scene Config so a GM can link a scene to the clock. */
function addSceneConfigToggle(app, html) {
  const root = html?.querySelector ? html : html?.[0];
  const scene = app.document ?? app.object;
  if (!root || !scene || root.querySelector(".wayreth-scene-sync")) return;

  // Sit next to the scene's own darkness control wherever it lives in this version.
  const anchor = root.querySelector('[name="environment.darknessLevel"], [name="darkness"]')
    ?.closest(".form-group");
  if (!anchor) return;

  const group = document.createElement("div");
  group.className = "form-group wayreth-scene-sync";
  group.innerHTML = `
    <label>Link to Krynn Calendar</label>
    <div class="form-fields">
      <input type="checkbox" name="flags.${MODULE}.syncDarkness" ${isSceneLinked(scene) ? "checked" : ""}>
    </div>
    <p class="notes">Darkness follows the Wayreth calendar's time of day. Manual darkness changes are overwritten on the next time change.</p>`;
  anchor.after(group);
}

function onDateChanged() {
  render();
  const dayIndex = get("dayIndex");
  const minuteOfDay = get("minuteOfDay");
  const state = {
    dayIndex,
    date: toDate(dayIndex),
    time: toClock(minuteOfDay),
    dayPart: dayPart(minuteOfDay),
    darkness: darknessFor(minuteOfDay, dayIndex),
    moons: allMoons(dayIndex),
    nightOfTheEye: isNightOfTheEye(dayIndex)
  };
  Hooks.callAll("wayrethCalendarChanged", state);
  syncLinkedScenes().catch(err => console.error(`${MODULE} | scene darkness sync failed`, err));

  if (game.user.isGM && get("announceEye") && state.nightOfTheEye) {
    ChatMessage.create({
      content: `<div class="wayreth-journal"><h3>The Night of the Eye</h3>
        <p>All three moons stand full. Every Wizard of High Sorcery is in high sanction,
        and workings otherwise impossible will hold tonight.</p></div>`,
      whisper: []
    });
  }
}

/* ------------------------------------------------------------------ *
 *  Settings
 * ------------------------------------------------------------------ */

Hooks.once("init", () => {
  const reg = (key, data) => game.settings.register(MODULE, key, data);
  // NOTE: game.user does not exist during "init" — world collections are built
  // at "setup". Gating `config` on game.user?.isGM therefore evaluated to false
  // for everyone, hiding every setting below from the GM as well. World-scope
  // settings are already GM-only, so no gate is needed.

  reg("dayIndex", {
    scope: "world", config: false, type: Number, default: 0,
    onChange: onDateChanged
  });

  reg("minuteOfDay", {
    scope: "world", config: false, type: Number, default: 8 * 60,
    onChange: onDateChanged
  });

  reg("moonlight", {
    name: "Moons Lighten the Night",
    hint: "Linked scenes get less dark when a moon stands full, and much less dark on the Night of the Eye.",
    scope: "world", config: true, type: Boolean, default: true,
    onChange: () => { render(); syncLinkedScenes(); }
  });

  reg("epochYear", {
    name: "Starting Year (AC)",
    hint: "The year the calendar begins at. The campaign opens 18 Darkember 350 AC and crosses into 351 on the Night of the Eye.",
    scope: "world", config: true, type: Number, default: 350,
    onChange: onDateChanged
  });

  reg("calendarSystem", {
    name: "Calendar System",
    hint: "Which world's calendar and moons to track. Krynn has three moons and sanction; Toril has Selune; Oerth has Luna and Celene.",
    scope: "world", config: true, type: String, default: "solamnic",
    choices: Object.fromEntries(Object.entries(CALENDARS).map(([k, c]) => [k, c.label])),
    onChange: onDateChanged
  });

  for (const [key, moon] of Object.entries(MOONS)) {
    reg(`offset${key[0].toUpperCase()}${key.slice(1)}`, {
      name: `${moon.label} Offset`,
      hint: `Shifts ${moon.label}'s phase by this many days (cycle: ${moon.period}). Use these to dial in a specific alignment.`,
      scope: "world", config: true, type: Number, default: 0,
      onChange: onDateChanged
    });
  }

  reg("showToPlayers", {
    name: "Show Calendar to Players",
    hint: "Deprecated in v1.10.0: the shared Krynn calendar is always visible to players.",
    scope: "world", config: false, type: Boolean, default: true
  });

  reg("showNuitariToPlayers", {
    name: "Show Nuitari to Players",
    hint: "The black moon is invisible to all but those who serve it. Leave off unless your table has earned it.",
    scope: "world", config: true, type: Boolean, default: false,
    onChange: render
  });

  reg("announceEye", {
    name: "Announce the Night of the Eye",
    hint: "Post a chat message when all three moons come full.",
    scope: "world", config: true, type: Boolean, default: true
  });

  for (const [key, def] of Object.entries(TRACKERS)) {
    reg(def.setting, {
      scope: "world", config: false, type: Number, default: def.start,
      onChange: renderTrackers
    });
  }

  reg("trackersCollapsed", {
    scope: "client", config: false, type: Boolean, default: false,
    onChange: renderTrackers
  });

  reg("widgetDock", {
    name: "Calendar Position",
    hint: "Dock above the player list in the bottom-left corner, or float freely so you can drag it anywhere.",
    scope: "client", config: true, type: String, default: "players",
    choices: { players: "Docked above the player list", float: "Floating (draggable)" },
    onChange: mount
  });

  reg("widgetPosition", { scope: "client", config: false, type: Object, default: {} });

  reg("widgetScale", {
    scope: "client", config: false, type: Number, default: 1,
    onChange: () => {
      applyScale();
      requestAnimationFrame(() => { keepInViewport(); positionTrackers(); });
    }
  });

  reg("widgetVisible", {
    name: "Show the Calendar Widget",
    hint: "Hide the on-screen widget for yourself without disabling the module.",
    scope: "client", config: true, type: Boolean, default: true,
    onChange: mount
  });
});

/* ------------------------------------------------------------------ *
 *  Mount
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 *  Docking to the player list
 * ------------------------------------------------------------------ */

/**
 * The player list moved between v12 and v13, so try the known homes in order
 * rather than assuming one. Returns the element the widget should sit above.
 */
function findPlayerList() {
  const selectors = [
    "#players",            // v12 and most of v13
    "aside#players",
    "#players-active",
    "#ui-left #players",
    "#ui-bottom-left #players"
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

function isDocked() {
  return get("widgetDock") === "players";
}

/**
 * Place the widget immediately above the player list, in normal flow, so it
 * behaves the way SmallTime does: bottom-left, stacked, moving with the list
 * as it grows. Falls back to floating if the list cannot be found.
 */
function dock() {
  const players = findPlayerList();
  if (!players || !root) return false;
  if (root.parentElement === players.parentElement && players.previousElementSibling === root
      && (!trackerRoot || !game.user?.isGM || root.previousElementSibling === trackerRoot)) return true; // already in place
  players.parentElement.insertBefore(root, players);
  if (trackerRoot && game.user?.isGM) players.parentElement.insertBefore(trackerRoot, root);
  root.classList.add("wy-docked");
  trackerRoot?.classList.add("wy-docked");
  root.style.left = root.style.top = root.style.right = root.style.bottom = "";
  // Belt and braces: the stylesheet re-enables pointer events for docked mode,
  // but a theme or another module can still override it, and an inert widget
  // is indistinguishable from a broken one. Force it on the element itself.
  root.style.pointerEvents = "auto";
  return true;
}

/** Foundry re-renders the player list often; re-dock when it does. */
function redock() {
  if (!root || !isDocked()) return;
  const trackersMisplaced = Boolean(trackerRoot && game.user?.isGM && trackerRoot.nextElementSibling !== root);
  if (!root.isConnected || root.nextElementSibling !== findPlayerList() || trackersMisplaced) dock();
}

/**
 * After docking, confirm the widget can actually receive clicks. Foundry's UI
 * regions disable pointer events, and a theme or another module can re-disable
 * them on our element despite the stylesheet. A silently inert widget looks
 * identical to a working one, so check and fall back to floating rather than
 * leaving the GM with nothing to click.
 */
function verifyInteractive() {
  if (!root?.classList.contains("wy-docked")) return;
  if (getComputedStyle(root).pointerEvents !== "none"
      && (!trackerRoot || getComputedStyle(trackerRoot).pointerEvents !== "none")) return;
  console.warn(`${MODULE} | Docked calendar cannot receive pointer events; falling back to floating.`);
  ui.notifications?.warn("The Wayreth calendar could not be clicked while docked, so it has been switched to floating. You can drag it where you like.");
  game.settings.set(MODULE, "widgetDock", "float");
}

function mount() {
  root?.remove();
  trackerRoot?.remove();
  root = null;
  trackerRoot = null;
  if (!canSee()) return;
  // widgetVisible is client-scoped: every user may hide it for themselves.
  if (!get("widgetVisible")) return;

  root = document.createElement("div");
  root.id = "wayreth-calendar";
  root.classList.add("wayreth-journal");
  document.body.appendChild(root);

  if (game.user?.isGM) {
    trackerRoot = document.createElement("section");
    trackerRoot.id = "wayreth-campaign-trackers";
    trackerRoot.classList.add("wayreth-journal");
    trackerRoot.setAttribute("aria-label", "Wayreth campaign trackers");
    document.body.insertBefore(trackerRoot, root);
  }

  render();
  renderTrackers();
  applyScale();

  if (isDocked() && dock()) {
    // render() has already wired the resize grip and clock; only the docked
    // layout compensation is left to do.
      requestAnimationFrame(verifyInteractive);
    return;
  }

  // Floating: strip any docked state so a mode switch leaves nothing behind.
  root.classList.remove("wy-docked");
  trackerRoot?.classList.remove("wy-docked");
  root.style.marginTop = "";
  root.style.pointerEvents = "";
  applyPosition();
  requestAnimationFrame(() => { keepInViewport(); positionTrackers(); });
  makeDraggable();
  window.removeEventListener("resize", keepInViewport);
  window.addEventListener("resize", keepInViewport, { passive: true });
}

Hooks.on("renderSceneConfig", addSceneConfigToggle);

// The player list is re-rendered on login, logout, activity and sidebar
// collapse; re-dock after each so the widget never gets orphaned.
for (const hook of ["renderPlayerList", "renderPlayers", "collapseSidebar", "expandSidebar"]) {
  Hooks.on(hook, () => requestAnimationFrame(redock));
}

// A newly viewed linked scene should match the clock immediately.
Hooks.on("canvasReady", () => {
  if (game.user.isGM && isSceneLinked(canvas?.scene)) {
    syncLinkedScenes({ animate: false }).catch(() => {});
  }
});

Hooks.once("ready", () => {
  mount();
  if (game.user.isGM) syncLinkedScenes({ animate: false }).catch(() => {});

  const api = {
    getDayIndex: () => get("dayIndex"),
    getDate: () => toDate(get("dayIndex")),
    getMoons: () => allMoons(get("dayIndex")),
    isNightOfTheEye: () => isNightOfTheEye(get("dayIndex")),
    daysToNightOfTheEye: () => daysToEye(get("dayIndex")),
    sanctionFor: order => {
      const key = { white: "solinari", red: "lunitari", black: "nuitari" }[String(order).toLowerCase()];
      return key ? moonPhase(key, get("dayIndex")).sanction : null;
    },
    advance,
    setDate: (year, month, day) => setDayIndex(fromDate(year, month, day)),
    /** Escape hatch: WayrethCalendar.setDock("float") from the console. */
    setDock: mode => game.settings.set(MODULE, "widgetDock", mode === "float" ? "float" : "players"),
    remount: mount,
    getTime: () => toClock(get("minuteOfDay")),
    getDayPart: () => dayPart(get("minuteOfDay")),
    getDarkness: () => darknessFor(get("minuteOfDay"), get("dayIndex")),
    setTime,
    advanceMinutes,
    isNight: () => darknessFor(get("minuteOfDay"), get("dayIndex")) > 0.5,
    linkedScenes: () => game.scenes.filter(isSceneLinked).map(sc => sc.name),
    syncLinkedScenes,
    setRoadToWayrethClock,
    getWidgetScale: () => clampWidgetScale(get("widgetScale")),
    setWidgetScale,
    getTrackers: () => game.user?.isGM ? Object.fromEntries(Object.entries(TRACKERS).map(([key, def]) => [key, {
      label: def.label, value: trackerValue(key), min: def.min, max: def.max, state: trackerState(key)
    }])) : null,
    setTracker,
    adjustTracker,
    resetTrackers: async () => {
      if (!requireGM("reset campaign trackers")) return false;
      for (const [key, def] of Object.entries(TRACKERS)) await setTracker(key, def.start);
      return true;
    },
    getCalendar: () => {
      const cal = calendar();
      return {
        key: get("calendarSystem"),
        label: cal.label,
        world: cal.world,
        yearSuffix: cal.yearSuffix,
        months: cal.months.map(m => ({ ...m })),
        weekdays: [...cal.weekdays],
        daysPerYear: daysPerYear(cal),
        alignment: cal.alignment,
        alignmentCycle: alignmentCycle(cal)
      };
    },
    listCalendars: () => Object.entries(CALENDARS).map(([key, c]) => ({ key, label: c.label })),
    constants: { MINUTES_PER_DAY, MIN_WIDGET_SCALE, MAX_WIDGET_SCALE }
  };

  const mod = game.modules.get(MODULE);
  mod.api = api;
  globalThis.WayrethCalendar = api;
});
