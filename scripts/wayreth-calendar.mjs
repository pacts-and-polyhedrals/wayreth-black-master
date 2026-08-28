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

const DAYS_PER_MONTH = 28;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = DAYS_PER_MONTH * MONTHS_PER_YEAR; // 336

const MONTH_NAMES = {
  solamnic: ["Newkolt", "Deepkolt", "Brookgreen", "Yurthgreen", "Fleurgreen", "Holmswelt",
             "Fierswelt", "Paleswelt", "Reapember", "Gildember", "Darkember", "Frostkolt"],
  ergothi:  ["Aelmont", "Rannmont", "Mishamont", "Chislmont", "Bran", "Corij",
             "Argon", "Sirrimont", "Reorxmont", "Hiddumont", "H'rarmont", "Phoenix"],
  elven:    ["Winter Night", "Winter Deep", "Spring Dawning", "Spring Rising", "Spring Blossom",
             "Summer Home", "Summer Run", "Summer End", "Autumn Harvest", "Autumn Twilight",
             "Autumn Dark", "Winter Come"]
};

const WEEKDAYS = ["Linaris", "Majetag", "Bakukal", "Misham", "Kirinor", "Sothkal", "Bracha"];

/** Cycle length in days. Night of the Eye = LCM(36, 28, 8) = 504. */
const MOONS = {
  solinari: { label: "Solinari", order: "White Robes", period: 36, colour: "#dfe4ea" },
  lunitari: { label: "Lunitari", order: "Red Robes",   period: 28, colour: "#c0392b" },
  nuitari:  { label: "Nuitari",  order: "Black Robes", period: 8,  colour: "#2b2b33" }
};

const EYE_CYCLE = 504;

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

/* ------------------------------------------------------------------ *
 *  Date maths
 * ------------------------------------------------------------------ */

function get(key) { return game.settings.get(MODULE, key); }

/** Absolute day index -> { year, month, day, monthName, weekday } */
function toDate(dayIndex) {
  const epoch = get("epochYear");
  const y = Math.floor(dayIndex / DAYS_PER_YEAR);
  const rem = ((dayIndex % DAYS_PER_YEAR) + DAYS_PER_YEAR) % DAYS_PER_YEAR;
  const month = Math.floor(rem / DAYS_PER_MONTH);
  const day = rem % DAYS_PER_MONTH;
  const names = MONTH_NAMES[get("calendarSystem")] ?? MONTH_NAMES.solamnic;
  return {
    year: epoch + y,
    month: month + 1,
    day: day + 1,
    monthName: names[month],
    weekday: WEEKDAYS[rem % 7]
  };
}

function fromDate(year, month, day) {
  const epoch = get("epochYear");
  return (year - epoch) * DAYS_PER_YEAR + (month - 1) * DAYS_PER_MONTH + (day - 1);
}

/** Phase bucket 0-7 for one moon. 0 = full (high sanction), 4 = new (low). */
function moonPhase(key, dayIndex) {
  const { period } = MOONS[key];
  const offset = get(`offset${key[0].toUpperCase()}${key.slice(1)}`) ?? 0;
  const pos = (((dayIndex + offset) % period) + period) % period;
  const bucket = Math.round((pos / period) * 8) % 8;
  return {
    key,
    ...MOONS[key],
    position: pos,
    fraction: pos / period,
    bucket,
    ...PHASES[bucket]
  };
}

function allMoons(dayIndex) {
  return Object.keys(MOONS).map(k => moonPhase(k, dayIndex));
}

function isNightOfTheEye(dayIndex) {
  return allMoons(dayIndex).every(m => m.bucket === 0);
}

/** Days until the next Night of the Eye, or null if none within one full cycle. */
function daysToEye(dayIndex) {
  for (let i = 0; i <= EYE_CYCLE; i++) if (isNightOfTheEye(dayIndex + i)) return i;
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

function canSee() {
  return game.user.isGM || get("showToPlayers");
}

function visibleMoons(dayIndex) {
  const moons = allMoons(dayIndex);
  if (game.user.isGM || get("showNuitariToPlayers")) return moons;
  // Nuitari is invisible to all but those who serve him.
  return moons.filter(m => m.key !== "nuitari");
}

function render() {
  if (!root) return;
  const dayIndex = get("dayIndex");
  const date = toDate(dayIndex);
  const moons = visibleMoons(dayIndex);
  const eye = isNightOfTheEye(dayIndex);
  const isGM = game.user.isGM;

  const moonHtml = moons.map(m => {
    const sanction = m.sanction === "high" ? "High Sanction"
                   : m.sanction === "low" ? "Low Sanction" : m.name;
    const cls = m.sanction ? ` wy-sanction-${m.sanction}` : "";
    return `<div class="wy-moon${cls}" data-tooltip="${m.label} — ${m.name} (${m.order})&#10;${sanction}">
              ${moonSvg(m)}
            </div>`;
  }).join("");

  root.innerHTML = `
    <div class="wy-cal-bar${eye ? " wy-eye" : ""}">
      ${isGM ? `<button type="button" class="wy-step" data-step="-1" data-tooltip="Back one day">&#9664;</button>` : ""}
      <div class="wy-cal-date">
        <div class="wy-cal-line1">${date.day} ${date.monthName}</div>
        <div class="wy-cal-line2">${date.weekday} &middot; ${date.year} AC</div>
      </div>
      <div class="wy-moons">${moonHtml}</div>
      ${isGM ? `<button type="button" class="wy-step" data-step="1" data-tooltip="Forward one day">&#9654;</button>` : ""}
      ${isGM ? `<button type="button" class="wy-cog" data-tooltip="Calendar controls">&#9881;</button>` : ""}
    </div>
    ${eye ? `<div class="wy-eye-banner">The Night of the Eye</div>` : ""}
    <div class="wy-cal-panel" hidden></div>`;

  if (isGM) {
    root.querySelectorAll(".wy-step").forEach(b =>
      b.addEventListener("click", () => advance(Number(b.dataset.step))));
    root.querySelector(".wy-cog")?.addEventListener("click", togglePanel);
  }
}

function togglePanel() {
  const panel = root.querySelector(".wy-cal-panel");
  if (!panel.hidden) { panel.hidden = true; return; }

  const dayIndex = get("dayIndex");
  const d = toDate(dayIndex);
  const eyeIn = daysToEye(dayIndex);
  const names = MONTH_NAMES[get("calendarSystem")] ?? MONTH_NAMES.solamnic;

  panel.innerHTML = `
    <div class="wy-panel-row">
      <label>Day</label><input type="number" class="wy-in-day" value="${d.day}" min="1" max="28">
      <label>Month</label>
      <select class="wy-in-month">
        ${names.map((n, i) => `<option value="${i + 1}"${i + 1 === d.month ? " selected" : ""}>${n}</option>`).join("")}
      </select>
      <label>Year</label><input type="number" class="wy-in-year" value="${d.year}">
      <button type="button" class="wy-set">Set</button>
    </div>
    <div class="wy-panel-row wy-panel-jump">
      <button type="button" data-jump="7">+1 week</button>
      <button type="button" data-jump="28">+1 month</button>
      <button type="button" data-jump="-7">&minus;1 week</button>
      <button type="button" data-jump="-28">&minus;1 month</button>
      <button type="button" class="wy-goto-eye">Jump to Night of the Eye</button>
    </div>
    <div class="wy-panel-note">
      ${eyeIn === 0 ? "All three moons are full tonight."
        : eyeIn === null ? "No alignment within one full cycle — check your moon offsets."
        : `Next Night of the Eye in <strong>${eyeIn}</strong> day${eyeIn === 1 ? "" : "s"}.`}
      <br>Moon offsets are in module settings if you need to dial in a specific alignment.
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
  panel.querySelector(".wy-goto-eye").addEventListener("click", () => {
    const n = daysToEye(get("dayIndex"));
    if (n === null) return ui.notifications.warn("No alignment found within one full cycle.");
    advance(n === 0 ? EYE_CYCLE : n);
    panel.hidden = true;
  });
}

/* ------------------------------------------------------------------ *
 *  Positioning
 * ------------------------------------------------------------------ */

function applyPosition() {
  const pos = get("widgetPosition") ?? {};
  if (Number.isFinite(pos.left) && Number.isFinite(pos.top)) {
    root.style.left = `${pos.left}px`;
    root.style.top = `${pos.top}px`;
    root.style.right = "auto";
    root.style.bottom = "auto";
  }
}

function makeDraggable() {
  let dragging = false, startX = 0, startY = 0, originLeft = 0, originTop = 0;

  root.addEventListener("pointerdown", ev => {
    if (ev.target.closest("button, input, select")) return;
    dragging = true;
    const rect = root.getBoundingClientRect();
    originLeft = rect.left; originTop = rect.top;
    startX = ev.clientX; startY = ev.clientY;
    root.setPointerCapture(ev.pointerId);
    root.classList.add("wy-dragging");
  });

  root.addEventListener("pointermove", ev => {
    if (!dragging) return;
    const left = Math.max(0, Math.min(window.innerWidth - 80, originLeft + ev.clientX - startX));
    const top = Math.max(0, Math.min(window.innerHeight - 40, originTop + ev.clientY - startY));
    root.style.left = `${left}px`;
    root.style.top = `${top}px`;
    root.style.right = "auto";
    root.style.bottom = "auto";
  });

  root.addEventListener("pointerup", ev => {
    if (!dragging) return;
    dragging = false;
    root.releasePointerCapture(ev.pointerId);
    root.classList.remove("wy-dragging");
    const rect = root.getBoundingClientRect();
    game.settings.set(MODULE, "widgetPosition", { left: rect.left, top: rect.top });
  });
}

/* ------------------------------------------------------------------ *
 *  State changes
 * ------------------------------------------------------------------ */

async function setDayIndex(value) {
  if (!game.user.isGM) return;
  await game.settings.set(MODULE, "dayIndex", Math.round(value));
}

async function advance(days) {
  await setDayIndex(get("dayIndex") + days);
}

function onDateChanged() {
  render();
  const dayIndex = get("dayIndex");
  const state = { dayIndex, date: toDate(dayIndex), moons: allMoons(dayIndex), nightOfTheEye: isNightOfTheEye(dayIndex) };
  Hooks.callAll("wayrethCalendarChanged", state);

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

  reg("dayIndex", {
    scope: "world", config: false, type: Number, default: 0,
    onChange: onDateChanged
  });

  reg("epochYear", {
    name: "Starting Year (AC)",
    hint: "The year the calendar begins at. Shadow of the Dragon Queen opens in 351 AC.",
    scope: "world", config: true, type: Number, default: 351,
    onChange: onDateChanged
  });

  reg("calendarSystem", {
    name: "Calendar Names",
    hint: "Which culture's month names to display.",
    scope: "world", config: true, type: String, default: "solamnic",
    choices: { solamnic: "Solamnic", ergothi: "Ergothi", elven: "Elven" },
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
    hint: "Players see the date and moons. The GM always sees it.",
    scope: "world", config: true, type: Boolean, default: true,
    onChange: mount
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

  reg("widgetPosition", { scope: "client", config: false, type: Object, default: {} });

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

function mount() {
  root?.remove();
  root = null;
  if (!canSee() || !get("widgetVisible")) return;

  root = document.createElement("div");
  root.id = "wayreth-calendar";
  root.classList.add("wayreth-journal");
  document.body.appendChild(root);

  render();
  applyPosition();
  makeDraggable();
}

Hooks.once("ready", () => {
  mount();

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
    constants: { DAYS_PER_MONTH, MONTHS_PER_YEAR, DAYS_PER_YEAR, EYE_CYCLE, MOONS, MONTH_NAMES }
  };

  const mod = game.modules.get(MODULE);
  mod.api = api;
  globalThis.WayrethCalendar = api;
});
