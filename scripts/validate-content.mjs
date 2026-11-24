import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MODULE = "wayreth-black-master";
const read = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

const manifest = read("module.json");
const pkg = read("package.json");
const items = read("content/magic-items.json").items;
const spells = read("content/spells.json").items;
const catalogue = read("content/items.json");
const npcs = read("content/npcs.json");
const installer = fs.readFileSync(path.join(ROOT, "scripts", "wayreth-journals.mjs"), "utf8");

assert(manifest.version === "1.34.1", `module.json version is ${manifest.version}`);
assert(pkg.version === "1.34.1", `package.json version is ${pkg.version}`);
assert(items.length === 30, `expected 30 magic items, found ${items.length}`);
assert(spells.length === 90, `expected 90 spells, found ${spells.length}`);

const itemKeys = new Set();
for (const item of items) {
  const key = item.flags?.[MODULE]?.itemKey;
  assert(Boolean(key), `${item.name}: missing itemKey`);
  assert(!itemKeys.has(key), `${item.name}: duplicate itemKey ${key}`);
  itemKeys.add(key);
  for (const [activityId, activity] of Object.entries(item.system?.activities ?? {})) {
    assert(/^[A-Za-z0-9]{16}$/.test(activityId), `${item.name}: activity id ${activityId} is not a 16-character Foundry ID`);
    assert(activity._id === activityId, `${item.name}: activity key/_id mismatch for ${activityId}`);
  }
}

const staff = items.find(i => i.flags?.[MODULE]?.itemKey === "staff-of-magius");
assert(Boolean(staff), "Staff of Magius is missing");
if (staff) {
  assert(staff.type === "weapon", "Staff of Magius must be a weapon Item");
  assert(staff.system?.rarity === "artifact", "Staff of Magius must be artifact rarity");
  assert(staff.system?.magicalBonus === 2, "Staff of Magius must be a +2 weapon");
  assert(staff.system?.uses?.max === "10", "Staff of Magius should have 10 charges");
  const names = new Set(Object.values(staff.system?.activities ?? {}).map(a => a.name));
  for (const required of [
    "Staff of Magius Strike", "Awakened Strike — Raistlin", "Shirak — Kindle the Crystal",
    "Pveathrfall — Feather Fall", "Shirak — Daylight", "Melt the Lock", "Part the Waters",
    "Road of Magius", "Magius's Shaping", "Call the Staff"
  ]) assert(names.has(required), `Staff of Magius missing activity: ${required}`);
}

assert(catalogue.pages.some(p => p.html.includes("<h3>Staff of Magius</h3>")), "Vault journal does not catalogue Staff of Magius");
const raistlin = npcs.pages.find(p => p.name.startsWith("Raistlin Majere"));
assert(Boolean(raistlin), "Raistlin journal page missing");
if (raistlin) {
  assert(raistlin.html.includes("6 (1d6 + 2) bludgeoning damage plus 3 (1d6) force damage"), "Raistlin Staff of Magius action is not aligned with the Item");
}

for (const label of [
  "Wayreth — White Robe Spells", "Wayreth — Red Robe Spells", "Wayreth — Black Robe Spells", "Wayreth — Magic Items"
]) assert(installer.includes(label), `installer missing visible compendium label: ${label}`);
assert(installer.includes("syncSpellCompendia"), "installer missing spell compendium sync");
assert(installer.includes("Spells install before magic items"), "reinstall order safety guard missing");


const routeFiles = ["road-guide.json", "route-solamnic.json", "route-lemish.json", "route-elven.json"];
for (const file of routeFiles) {
  const route = read(`content/${file}`);
  assert(route.pages.length >= 10, `${file}: expected at least 10 detailed pages, found ${route.pages.length}`);
  assert(route.pages.every(p => p.html.includes("wy-lead") || p.name.includes("d12") || p.name.includes("Optional")), `${file}: one or more pages are missing Wayreth presentation structure`);
}
assert(installer.includes("route-solamnic.json"), "installer missing Sailor’s Road journal");
assert(installer.includes("route-lemish.json"), "installer missing River and Heartland Road journal");
assert(installer.includes("route-elven.json"), "installer missing Wild Road journal");

const sessionZero = read("content/session-zero.json");
const sessionZeroPlayer = read("content/session-zero-player.json");
assert(sessionZero.pages.length >= 24, `Session 0 GM journal is too short: ${sessionZero.pages.length} pages`);
assert(sessionZeroPlayer.pages.length >= 8, `Session 0 player guide is too short: ${sessionZeroPlayer.pages.length} pages`);
for (const phrase of ["Powerful Criticals", "Critical Failures", "Potion Toxicity", "Blind Death Saves", "The Last Road to Vogler", "Ispin Greenshield"]) {
  assert(JSON.stringify(sessionZero).includes(phrase), `Session 0 is missing required content: ${phrase}`);
}
const correctedRouteChecks = [
  ["route-solamnic.json", "Route I: The Sailor’s Road", ["Kalaman", "Mirivale", "Hylo", "Gilthanost"]],
  ["route-lemish.json", "Route II: The River and Heartland Road", ["Dargaard", "Maelgoth", "Brasdel", "Solanthus", "Garnet", "Zaradene", "Gilthanost"]],
  ["route-elven.json", "Route III: The Wild Road", ["Cericas", "Fangoth", "Solace", "Haven", "Pax Tharkas"]]
];
for (const [file, expectedName, stops] of correctedRouteChecks) {
  const data = read(`content/${file}`);
  assert(data.name === expectedName, `${file}: incorrect route name ${data.name}`);
  assert(data.pages.length >= 18, `${file}: corrected route should have at least 18 pages, found ${data.pages.length}`);
  const blob = JSON.stringify(data);
  for (const stop of stops) assert(blob.includes(stop), `${file}: missing corrected stop ${stop}`);
}
assert(fs.existsSync(path.join(ROOT, "assets", "ansalon-three-routes.webp")), "corrected Ansalon route map asset is missing");
const allRouteText = routeFiles.map(f => JSON.stringify(read(`content/${f}`))).join("\n");
for (const oldName of ["Great Solamnic Road", "Lemish Shortcut", "Sea and Elven Road", "Port O'Call", "Vingaard Keep", "Thelgaard", "Caergoth"]) {
  assert(!allRouteText.includes(oldName), `old route material still present: ${oldName}`);
}
assert(installer.includes("session-zero.json"), "installer missing Session 0 GM journal");
assert(installer.includes("session-zero-player.json"), "installer missing Session 0 player guide");
const calendarScript = fs.readFileSync(path.join(ROOT, "scripts", "wayreth-calendar.mjs"), "utf8");
assert(calendarScript.includes("Road to Wayreth · 18 Darkember"), "calendar is missing Road to Wayreth setup control");
assert(calendarScript.includes('class="wy-resize-handle"'), "calendar is missing the per-user corner resize grip");
assert(calendarScript.includes('reg("widgetScale"'), "calendar is missing client-scoped widgetScale setting");
assert(calendarScript.includes('scope: "client", config: false, type: Number, default: 1'), "widgetScale must be a hidden client-only setting");
assert(calendarScript.includes('Only the GM can ${action}.'), "calendar world mutations are missing explicit GM guard messaging");
assert(calendarScript.includes('if (!requireGM("change the date")) return false;'), "date mutation is not GM guarded");
assert(calendarScript.includes('if (!requireGM("reset the Road to Wayreth clock")) return false;'), "Road to Wayreth reset is not GM guarded");
// game.user does not exist during "init", so gating `config` on it hid every
// calendar setting from the GM as well. World-scope settings are GM-only by
// default, so the gate must not come back.
assert(!calendarScript.includes("gmConfig"), "calendar settings must not gate `config` on game.user during init");
assert(!/config:\s*gmConfig/.test(calendarScript), "calendar settings still reference gmConfig");
assert(calendarScript.includes('if (!get("widgetVisible")) return;'), "widgetVisible must apply to every user, not only the GM");
assert(/reg\("widgetVisible", \{[\s\S]*?scope: "client", config: true/.test(calendarScript), "widgetVisible must be a visible client-scope setting");
for (const key of ["epochYear", "calendarSystem", "showNuitariToPlayers", "announceEye"]) {
  assert(new RegExp(`reg\\("${key}"[\\s\\S]*?config: true`).test(calendarScript), `calendar setting ${key} must be visible in the settings menu`);
}

// Regression guards for the 1.10.1 fixes.
assert(installer.includes("function contentHash("), "installer is missing page-edit fingerprinting");
assert(/replacePages\(journal, source, \{ overwriteEdits \}\)/.test(installer), "installJournals must pass the overwriteEdits flag through");
assert(installer.includes("reinstallContent({ force: false, overwriteEdits: false })"), "automatic version-bump reinstall must not force past GM edits");
assert(installer.includes("confirmDialog("), "manual reinstall must be behind a confirmation");
assert((installer.match(/foundry\.utils\.mergeObject\(/g) ?? []).length >= 2, "owned spell and item refresh must merge third-party flags rather than replace them");
assert(!installer.includes("15 journals"), "reinstall summary must not hardcode the journal count");

// Every `cast` activity must name a spell that exists in the dnd5e 2014 pack.
const RENAMED_IN_5X = ["Mordenkainen's Private Sanctum", "Mordenkainen's Sword", "Leomund's Tiny Hut", "Otiluke's Resilient Sphere"];
for (const item of items) {
  for (const activity of Object.values(item.system?.activities ?? {})) {
    if (activity.type !== "cast") continue;
    const name = activity.spell?.name;
    assert(Boolean(name), `${item.name}: cast activity has no spell name to resolve`);
    assert(!RENAMED_IN_5X.includes(name), `${item.name}: "${name}" was renamed in dnd5e 5.x and will silently fail to resolve`);
  }
}
const calendarCss = fs.readFileSync(path.join(ROOT, "styles", "calendar.css"), "utf8");
assert(calendarCss.includes("--wy-widget-scale"), "calendar CSS is missing the local scale transform");
assert(calendarCss.includes(".wy-resize-handle"), "calendar CSS is missing the corner resize grip");

// --- time of day + scene linking (1.12.0) ---
assert(calendarScript.includes('reg("minuteOfDay"'), "calendar is missing the time-of-day setting");
assert(calendarScript.includes("MINUTES_PER_DAY"), "calendar is missing minute-of-day constants");
assert(calendarScript.includes("function advanceMinutes("), "calendar is missing minute advancement with day rollover");
assert(/dayShift = Math\.floor\(total \/ MINUTES_PER_DAY\)/.test(calendarScript), "advanceMinutes must roll the date over at midnight");
assert(calendarScript.includes("function attachClockScrub("), "clock must be drag-scrubbable");
assert(calendarScript.includes("function darknessFor("), "calendar is missing the darkness curve");
assert(calendarScript.includes("function syncLinkedScenes("), "calendar is missing scene darkness sync");
assert(calendarScript.includes("function addSceneConfigToggle("), "Scene Config is missing the Krynn calendar link toggle");
assert(calendarScript.includes('Hooks.on("renderSceneConfig", addSceneConfigToggle)'), "Scene Config toggle is not hooked");
assert(calendarScript.includes('syncDarkness'), "scene link flag is missing");
assert(calendarScript.includes("environment: { darknessLevel: darkness }"), "scene darkness must use the v12+ environment path");
assert(calendarScript.includes("animateDarkness"), "scene darkness changes should animate");
assert(calendarCss.includes(".wy-clock-time"), "calendar CSS is missing clock styling");
assert(calendarCss.includes("--wy-darkness"), "calendar CSS is missing the day/night tint variable");
for (const fn of ["getTime", "setTime", "advanceMinutes", "getDarkness", "linkedScenes"]) {
  assert(calendarScript.includes(`${fn}`), `calendar API is missing ${fn}`);
}

assert(calendarCss.includes("nwse-resize"), "resize grip must use the diagonal resize cursor");
assert(calendarCss.includes("#wayreth-calendar .wy-cal-bar {\n  position: relative"), "the bar must be the grip's containing block");
assert(!calendarCss.includes("wy-size-controls"), "old percentage size buttons must be gone from CSS");
assert(!calendarScript.includes("wy-size-controls"), "old percentage size buttons must be gone from the widget");
assert(calendarScript.includes("function attachResizeHandle("), "calendar is missing drag-to-resize");
assert(calendarScript.includes("setPointerCapture"), "resize drag must capture the pointer");
assert(/handle\.addEventListener\("dblclick"/.test(calendarScript), "double-click must reset the calendar size");
assert(calendarScript.includes('ev.stopPropagation(); // never start a widget move'), "resize grip must not trigger a widget move");


// --- route consistency (1.13.0) ---
const routeArrivals = { "route-solamnic.json": "21–24", "route-lemish.json": "17–22", "route-elven.json": "20–25" };
const guideText = JSON.stringify(read("content/road-guide.json"));
for (const [file, normalWindow] of Object.entries(routeArrivals)) {
  const text = JSON.stringify(read(`content/${file}`));
  assert(text.includes(normalWindow), `${file}: normal arrival window ${normalWindow} Frostkolt is missing`);
  assert(guideText.includes(normalWindow), `master guide does not carry ${file}'s ${normalWindow} arrival window`);
  assert(text.includes("Reading These Windows"), `${file}: overview is missing the arrival-basis note`);
}
// Retired routes must not reappear.
for (const dead of ["Lemish Shortcut", "Sea &amp; Elven Road", "Sea and Elven Road", "Great Solamnic Road"]) {
  for (const f of ["road-guide.json", "adventure.json", "arc-one.json", "arc-two.json", ...Object.keys(routeArrivals)]) {
    assert(!JSON.stringify(read(`content/${f}`)).includes(dead), `${f} still references retired route "${dead}"`);
  }
}
assert(guideText.includes("27 Frostkolt"), "master guide must state Ispin's absolute-latest arrival");
assert(guideText.includes("25–26 Frostkolt"), "master guide must state the desired arrival window");
assert(!installer.includes("are treated as\n * edited, because we cannot prove otherwise"), "pre-fingerprint pages must refresh, not freeze");

// --- docked calendar (1.14.0) ---
assert(calendarScript.includes('reg("widgetDock"'), "calendar is missing the dock position setting");
assert(calendarScript.includes("function findPlayerList("), "calendar must locate the player list defensively");
assert(calendarScript.includes('"#players"') && calendarScript.includes('"aside#players"'), "player-list lookup must cover v12 and v13 selectors");
assert(calendarScript.includes("function dock("), "calendar is missing dock()");
assert(calendarScript.includes("function redock("), "calendar must re-dock when the player list re-renders");
assert(calendarScript.includes('"renderPlayerList"'), "re-dock must be hooked to player list renders");
assert(calendarScript.includes('<div class="wy-strip">'), "moons and controls must share a strip so the bar can stack");
assert(calendarScript.includes('<div class="wy-controls">'), "controls must be grouped for the stacked layout");
assert(calendarCss.includes("#wayreth-calendar.wy-docked"), "calendar CSS is missing docked mode");
assert(/\.wy-docked \.wy-cal-bar \{[^}]*flex-direction: column/.test(calendarCss), "docked bar must stack vertically");
assert(!calendarScript.includes("function undock("), "dead undock() should not return");

// --- docked interactivity (1.14.1) ---
// Foundry's UI regions set pointer-events:none; docking inside one made the
// widget render perfectly and ignore every click. These guard the fix.
assert(/#wayreth-calendar\.wy-docked \{[^}]*pointer-events: auto/s.test(calendarCss), "docked calendar must re-enable pointer events");
assert(/#wayreth-calendar\.wy-docked button/.test(calendarCss), "docked buttons must re-enable pointer events");
assert(calendarScript.includes('root.style.pointerEvents = "auto"'), "dock() must force pointer events on the element");
assert(calendarScript.includes('root.classList.remove("wy-docked")'), "switching to floating must strip docked state");
assert(calendarScript.includes("function verifyInteractive("), "docking must self-check that it can receive clicks");
assert(calendarScript.includes("requestAnimationFrame(verifyInteractive)"), "the interactivity self-check must run after docking");
assert(calendarScript.includes("setDock: mode =>"), "a console escape hatch must exist for an inert widget");
assert((calendarScript.match(/attachResizeHandle\(\)/g) || []).length === 2, "resize handle must be wired exactly once");


// --- campaign expansion (1.15.0) ---
const contentFileList = (installer.match(/const CONTENT_FILES = \[([\s\S]*?)\];/) ?? [, ""])[1];
const sourceNameMap = (installer.match(/const SOURCE_FILE_BY_NAME = new Map\(\[([\s\S]*?)\]\);/) ?? [, ""])[1];
assert(contentFileList.length > 0, "CONTENT_FILES could not be parsed");
assert(sourceNameMap.length > 0, "SOURCE_FILE_BY_NAME could not be parsed");

const CAMPAIGN_FILES = ["campaign-bible.json", "campaign-timeline.json", "arc-one.json",
                        "arc-two.json", "arc-three.json", "arcs-four-five-six.json",
                        "arc-four.json", "arc-five.json", "arc-six.json"];
for (const f of CAMPAIGN_FILES) {
  const j = read(`content/${f}`);
  assert(Array.isArray(j.pages) && j.pages.length >= 4, `${f}: campaign journal needs at least 4 pages`);
  assert(contentFileList.includes(f), `${f} is not registered in CONTENT_FILES`);
  assert(sourceNameMap.includes(`"${j.name}"`), `${f}: journal name "${j.name}" missing from SOURCE_FILE_BY_NAME`);
}

// The campaign premise must be consistent wherever it is stated.
const bible = JSON.stringify(read("content/campaign-bible.json"));
const masterJ = JSON.stringify(read("content/master.json"));
assert(bible.includes("Caramon"), "campaign bible must establish Caramon's death as the driver");
assert(masterJ.includes("Caramon"), "master journal must carry the Caramon motivation");
assert(masterJ.includes("Garden Incident"), "master journal must use the Garden Incident");
assert(!masterJ.includes("Concession of Wayreth"), "the retired Concession framing must not remain");
for (const f of ["master.json", "tower.json", "adventure.json"]) {
  assert(!JSON.stringify(read(`content/${f}`)).includes("agenda you selected"),
    `${f} still offers the retired three-agenda choice`);
}

// Campaign dates: opens 350 AC, Night of the Eye falls in 351 AC.
assert(JSON.stringify(read("content/campaign-timeline.json")).includes("1 Newkolt 351"),
  "the Night of the Eye must fall in 351 AC");
assert(JSON.stringify(read("content/session-zero.json")).includes("350 AC"),
  "Session 0 must open in 350 AC");
assert(calendarScript.includes('"epochYear", 350'), "the Road to Wayreth setup control must set year 350");
assert(/reg\("epochYear"[\s\S]*?default: 350/.test(calendarScript), "calendar must default to 350 AC");

// The Arc I finale was renamed to avoid colliding with Arc II.
assert(read("content/adventure.json").name.startsWith("Arc I Finale"),
  "the Krell arc must be labelled as the Arc I finale");
assert(!read("content/adventure.json").name.includes("Black Master's Errand"),
  "the Arc I finale must not share Arc II's name");
assert(installer.includes("const IMPORT_VERSION = 32"), "IMPORT_VERSION must be bumped so existing worlds pick up the scenes, the handouts and the corrected Astinus");




// --- GM tracker board + full Arc II-VI session runbooks (1.17.0) ---
for (const f of ["arc-four.json", "arc-five.json", "arc-six.json"]) {
  assert(contentFileList.includes(f), `${f} is not registered in CONTENT_FILES`);
}
const laterArcMinimums = {
  "arc-two.json": 22,
  "arc-three.json": 23,
  "arc-four.json": 19,
  "arc-five.json": 19,
  "arc-six.json": 16
};
for (const [f, minimum] of Object.entries(laterArcMinimums)) {
  const j = read(`content/${f}`);
  assert(j.pages.length >= minimum, `${f}: expected at least ${minimum} detailed pages, found ${j.pages.length}`);
  const sessions = j.pages.filter(p => /^Session \d+:/.test(p.name));
  assert(sessions.length >= (f === "arc-two.json" ? 14 : f === "arc-three.json" ? 16 : f === "arc-four.json" ? 13 : f === "arc-five.json" ? 12 : 10),
    `${f}: not enough runnable session pages (${sessions.length})`);
  for (const sp of sessions) {
    for (const marker of ["Opening Image", "Session Sequence", "What Can Be Learned", "Tracker Guidance", "End Beat", "Narrative Thread"])
      assert(sp.html.includes(marker), `${f} / ${sp.name}: missing ${marker}`);
  }
}
const LEGACY_BEARER_SLUGS = ["alice", "solanthis", "jinx", "sylas", "clipper", "kattal"];
const LEGACY_PLAYER_FILES = LEGACY_BEARER_SLUGS.map(b => `legacy-player-${b}.json`);
const managedJournalFiles = [...CAMPAIGN_FILES, "history.json", "master.json", "test.json", "tower.json", "moons.json", "items.json", "npcs.json", "adventure.json", "road-guide.json", "route-solamnic.json", "route-lemish.json", "route-elven.json", "session-zero.json", "session-zero-player.json", "spells-guide.json", "legacy-guide.json", "bestiary-gallery.json",
  ...LEGACY_PLAYER_FILES];
const managedPageTotal = [...new Set(managedJournalFiles)].reduce((sum, f) => sum + read(`content/${f}`).pages.length, 0);
assert(new Set(managedJournalFiles).size === 32, `expected 32 managed journal files, found ${new Set(managedJournalFiles).size}`);
const EXPECTED_PAGES = 360;
assert(managedPageTotal === EXPECTED_PAGES, `expected ${EXPECTED_PAGES} managed journal pages, found ${managedPageTotal}`);
const laterIndex = read("content/arcs-four-five-six.json");
assert(laterIndex.name === "Arcs IV–VI: Strategic Master Index", "later-arc index name is stale");
assert(laterIndex.pages.length >= 5, "later-arc strategic index is too short");
const timeline = read("content/campaign-timeline.json");
assert(timeline.pages.length >= 6, "campaign timeline must include the tracker-board guide");
assert(JSON.stringify(timeline).includes("Campaign Trackers"), "campaign timeline must explain the GM tracker board");
for (const label of ["Raistlin Trust", "Raistlin Control", "Fistandantilus Influence", "White Robe Bond", "Wayreth Accord", "War State"])
  assert(calendarScript.includes(label), `calendar tracker board is missing ${label}`);
assert(calendarScript.includes('trackerRoot.id = "wayreth-campaign-trackers"'), "tracker board must be a separate section");
assert(calendarScript.includes('players.parentElement.insertBefore(trackerRoot, root)'), "tracker board must dock immediately above the calendar");
assert(calendarScript.includes('if (game.user?.isGM)'), "tracker board must be GM-only");
assert(calendarScript.includes('getTrackers: () => game.user?.isGM ?'), "tracker API must not expose hidden values to players");
assert(calendarCss.includes("#wayreth-campaign-trackers.wy-docked"), "tracker board is missing docked layout CSS");
assert(calendarScript.includes("fromDate(350, 11, 18)"), "Road to Wayreth setup must start 18 Darkember 350 AC");

// --- multi-world calendars + docked resize lock (1.16.0) ---
assert(calendarScript.includes("const CALENDARS = {"), "calendar systems table is missing");
for (const world of ["toril", "oerth"]) {
  assert(new RegExp(`^\\s*${world}: \\{`, "m").test(calendarScript), `${world} calendar is missing`);
}
assert(calendarScript.includes("Calendar of Harptos"), "Toril calendar must be the Calendar of Harptos");
assert(calendarScript.includes("Greyhawk Common Year"), "Oerth calendar must be the Common Year");
assert(calendarScript.includes('name: "Needfest", days: 7'), "Greyhawk festival weeks must be 7 days");
assert(calendarScript.includes('name: "Midwinter", days: 1'), "Harptos festival days must be 1 day");
assert(calendarScript.includes("function daysPerYear("), "year length must be derived from the month table");
assert(calendarScript.includes("function alignmentCycle("), "moon alignment must be computed, not hardcoded");
assert(!calendarScript.includes("const DAYS_PER_YEAR"), "the hardcoded Krynn year length must be gone");
assert(calendarScript.includes("date.yearSuffix"), "the widget must show the calendar's own year suffix");
assert(calendarScript.includes("sanctionLabel"), "moon tooltips must use per-calendar sanction wording");
assert(/choices: Object\.fromEntries\(Object\.entries\(CALENDARS\)/.test(calendarScript), "the Calendar System setting must list every calendar");

// Resizing is disabled when docked.
assert(calendarScript.includes("if (!isDocked()) attachResizeHandle();"), "resize must not be wired when docked");
assert(calendarScript.includes("const scale = isDocked() ? 1 :"), "docked mode must render at 1:1");
assert(calendarCss.includes("#wayreth-calendar.wy-docked .wy-resize-handle { display: none; }"), "the grip must be hidden when docked");
assert(!calendarScript.includes("applyDockedSpacing"), "docked scale compensation should be gone with resizing");



// --- tracker legibility (1.17.1) ---
// The board previously rendered two columns of six cards inside a ~200px docked
// column at 0.5rem type, which was unreadable. One row per tracker now.
assert(calendarScript.includes('class="wy-tracker-row'), "trackers must render one row each, not a card grid");
assert(!calendarScript.includes('class="wy-tracker-card"'), "the unreadable two-column card grid must not return");
assert(!calendarScript.includes('type="range"'), "range sliders are illegible at docked width and must not return");
assert(calendarCss.includes(".wy-tracker-rows"), "tracker row layout CSS is missing");

// Every tracker must be identifiable by symbol AND colour, not text alone.
// Match the definition form only — "--wy-accent:" in the template would
// otherwise inflate the count and let a missing definition slip through.
for (const [field, pattern] of [["icon", /\bicon: "fa-/g], ["accent", /\baccent: "#/g], ["bands", /\bbands: \[/g]]) {
  assert((calendarScript.match(pattern) ?? []).length >= 6,
    `all six trackers need ${field} for at-a-glance identification`);
}
assert(calendarScript.includes("function trackerBand("), "trackers must resolve a named band");
for (const tone of ["good", "neutral", "warn", "bad"]) {
  assert(calendarCss.includes(`.wy-tone-${tone} .wy-tracker-value`), `tone colour ${tone} is missing`);
}
assert(calendarCss.includes("border-left: 3px solid var(--wy-accent"), "each row needs its tracker's accent stripe");
assert(calendarCss.includes(".wy-tracker-chip"), "collapsed chips are missing");

// A container query with no declared container silently never matches.
assert(!calendarCss.includes("@container"), "container queries need a container-type ancestor; do not reintroduce");



// --- spell audit + Overreaching (1.18.0) ---
const spellGuideText = JSON.stringify(read("content/spells-guide.json"));
for (const t of ["Overreaching", "Silver Toll", "Lunitari's Ledger", "Nuitari's Due"]) {
  assert(spellGuideText.includes(t), `the spell guide is missing ${t}`);
}
assert(spellGuideText.includes("passed the Test may Overreach"), "Overreaching must be gated behind the Test");
assert(spellGuideText.includes("Raistlin Control by 1"), "Nuitari's Due must tie to the Control tracker");

const spellList = read("content/spells.json").items;
const spellByName = Object.fromEntries(spellList.map(s => [s.name, s]));
const firstDamage = name => {
  for (const a of Object.values(spellByName[name]?.system?.activities ?? {})) {
    const part = (a.damage?.parts ?? [])[0];
    if (part) return `${part.number}d${part.denomination}`;
  }
  return null;
};
// Corrections from the 2014 baseline audit. Text and activity data must agree.
const AUDITED = {
  "Cinder Lash": "1d8", "Grave Whisper": "1d8", "Blackflame Dart": "3d8",
  "Umbral Burst": "3d8", "Black Moon Detonation": "9d6", "Starless Lance": "10d6"
};
for (const [name, dice] of Object.entries(AUDITED)) {
  assert(spellByName[name], `audited spell ${name} is missing`);
  assert(firstDamage(name) === dice, `${name} activity damage should be ${dice}, found ${firstDamage(name)}`);
  assert(JSON.stringify(spellByName[name]).includes(dice), `${name} description must state ${dice}`);
}
assert(!JSON.stringify(spellByName["Black Moon Detonation"]).includes("6d6 necrotic"),
  "Black Moon Detonation must not still describe the pre-audit 6d6");
assert(JSON.stringify(spellByName["Cleaning"]).includes("20-foot cube"),
  "Cleaning must cover a 20-foot cube, not 5 feet");
assert((JSON.stringify(spellByName["Cleaning"]).match(/<li>/g) ?? []).length >= 6,
  "Cleaning needs a prestidigitation-scale option list");



// --- Order feats (1.19.0) ---
const feats = read("content/feats.json").feats;
assert(Array.isArray(feats) && feats.length === 7, `expected 7 feats, found ${feats?.length}`);
const featIds = new Set();
for (const f of feats) {
  assert(f.type === "feat", `${f.name}: must be a feat item`);
  assert(f.system?.type?.value === "feat", `${f.name}: system.type.value must be "feat"`);
  assert(typeof f._id === "string" && f._id.length === 16, `${f.name}: needs a 16-character id`);
  assert(!featIds.has(f._id), `${f.name}: duplicate id`);
  featIds.add(f._id);
  assert(f.system?.identifier, `${f.name}: needs a system identifier`);
  assert((f.system?.description?.value ?? "").length > 200, `${f.name}: needs real rules text`);
}
// The three Order feats must each deliver what the Test grants.
const orderFeats = feats.filter(f => f.name.startsWith("Wizard of High Sorcery"));
assert(orderFeats.length === 3, "there must be one Order feat per robe");
for (const f of orderFeats) {
  const html = f.system.description.value;
  assert(html.includes("Robe spellbook"), `${f.name}: must grant Order spell access`);
  assert(html.includes("half the usual time"), `${f.name}: must halve scribing time and cost`);
  assert(html.includes("Overreaching"), `${f.name}: must grant Overreaching`);
  assert(f.flags?.["wayreth-black-master"]?.order, `${f.name}: needs an order flag`);
}
for (const price of ["Silver Toll", "Lunitari's Ledger", "Nuitari's Due"]) {
  assert(orderFeats.some(f => f.system.description.value.includes(price)), `no Order feat carries ${price}`);
}
assert(feats.some(f => f.name === "Renegade Arcanist" && f.system.description.value.includes("cannot Overreach")),
  "Renegade Arcanist must be barred from Overreaching");
assert(installer.includes("syncFeatCompendium"), "feats are not synced to a compendium");
assert(installer.includes('name: "wayreth-feats"'), "the feat compendium is not registered");
assert(spellGuideText.includes("The Order Feats"), "the spell guide must document the feats");



// --- bestiary (1.20.0) ---
const creatures = read("content/creatures.json").actors;
assert(Array.isArray(creatures) && creatures.length >= 30, `expected 30+ creatures, found ${creatures?.length}`);
assert(creatures.length >= 78, `the bestiary should now carry at least 78 creatures, found ${creatures.length}`);
// A levels 1-20 campaign ending in the Abyss needs an unbroken CR ladder.
const crSeen = new Set(creatures.map(a => Math.floor(a.system.details.cr)));
for (let cr = 0; cr <= 24; cr++) {
  assert(crSeen.has(cr), `no creature at CR ${cr} — the ladder has a gap`);
}
// Catch near-duplicates such as "Nameless of the Field" vs "Nameless One of the Field".
const creatureKeys = new Set();
for (const a of creatures) {
  const key = a.name.toLowerCase().replace(/[^a-z]/g, "").replace(/one/g, "");
  assert(!creatureKeys.has(key), `${a.name}: near-duplicate of another creature`);
  creatureKeys.add(key);
}
// Every enum field must use dnd5e's own keys. Invalid values fail document
// validation, which makes the whole createDocuments batch throw — that is how
// the bestiary sat empty for several releases while the pack existed.
const DND5E_SIZES = new Set(["grg", "huge", "lg", "med", "sm", "tiny"]);
const DND5E_TYPES = new Set(["aberration", "beast", "celestial", "construct", "dragon", "elemental",
  "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"]);
const DND5E_LANGS = new Set(["aarakocra", "abyssal", "cant", "celestial", "common", "deep", "draconic",
  "druidic", "dwarvish", "elvish", "giant", "gith", "gnoll", "gnomish", "goblin", "halfling",
  "infernal", "orc", "primordial", "sylvan", "undercommon", "sign", "children"]);
const DND5E_SKILLS = new Set(["acr", "ani", "arc", "ath", "dec", "his", "ins", "itm", "inv", "med",
  "nat", "prc", "prf", "per", "rel", "slt", "ste", "sur"]);
const DND5E_DAMAGE = new Set(["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic",
  "piercing", "poison", "psychic", "radiant", "slashing", "thunder"]);
const DND5E_CONDITIONS = new Set(["blinded", "charmed", "deafened", "diseased", "exhaustion", "frightened",
  "grappled", "incapacitated", "invisible", "paralyzed", "petrified", "poisoned", "prone", "restrained",
  "stunned", "unconscious"]);
for (const a of creatures) {
  const t = a.system.traits;
  assert(DND5E_SIZES.has(t.size), `${a.name}: invalid size "${t.size}" — dnd5e uses grg/huge/lg/med/sm/tiny`);
  assert(DND5E_TYPES.has(a.system.details.type.value), `${a.name}: invalid creature type "${a.system.details.type.value}"`);
  for (const l of t.languages.value) {
    assert(DND5E_LANGS.has(l), `${a.name}: "${l}" is not a dnd5e language key — use langCustom for setting languages`);
  }
  for (const k of Object.keys(a.system.skills)) {
    assert(DND5E_SKILLS.has(k), `${a.name}: invalid skill key "${k}"`);
  }
  for (const field of ["di", "dr", "dv"]) {
    for (const v of t[field].value) assert(DND5E_DAMAGE.has(v), `${a.name}: invalid ${field} damage type "${v}"`);
  }
  for (const c of t.ci.value) assert(DND5E_CONDITIONS.has(c), `${a.name}: invalid condition immunity "${c}"`);
}
// A swallowed sync error is indistinguishable from an empty compendium.
assert(installer.includes("the bestiary failed to populate"), "a failed creature sync must tell the GM, not only the console");

for (const group of ["Draconian", "Dragonarmy", "Dragon (Chromatic)", "Dragon (Metallic)",
                     "Solamnia", "Abyssal", "Nightmare", "Wayreth", "Named"]) {
  assert(creatures.some(a => a.flags["wayreth-black-master"].group === group), `no creatures in group ${group}`);
}
const creatureIds = new Set();
const groups = new Set();
for (const a of creatures) {
  assert(a.type === "npc", `${a.name}: must be an npc actor`);
  assert(typeof a._id === "string" && a._id.length === 16, `${a.name}: needs a 16-character id`);
  assert(!creatureIds.has(a._id), `${a.name}: duplicate actor id`);
  creatureIds.add(a._id);
  const cr = a.system?.details?.cr;
  assert(typeof cr === "number", `${a.name}: needs a numeric CR`);
  assert(a.system?.attributes?.hp?.max > 0, `${a.name}: needs hit points`);
  assert(a.system?.attributes?.ac?.flat >= 10, `${a.name}: needs an AC`);
  assert(Array.isArray(a.items) && a.items.length > 0, `${a.name}: needs at least one action`);
  const itemIds = new Set();
  for (const it of a.items) {
    assert(!itemIds.has(it._id), `${a.name}: duplicate item id ${it.name}`);
    itemIds.add(it._id);
  }
  for (const key of ["str", "dex", "con", "int", "wis", "cha"]) {
    assert(typeof a.system?.abilities?.[key]?.value === "number", `${a.name}: missing ${key}`);
  }
  groups.add(a.flags?.["wayreth-black-master"]?.group);
}
for (const g of ["Draconian", "Dragonarmy", "Dragon", "Abyssal", "Undead", "Wayreth", "The Road", "Named"]) {
  assert(groups.has(g), `bestiary is missing the ${g} group`);
}
// Every draconian must have its death throe — it is the defining fact about them.
for (const a of creatures.filter(c => c.flags?.["wayreth-black-master"]?.group === "Draconian")) {
  assert(a.items.some(i => i.name.startsWith("Death Throe")), `${a.name}: draconians need a death throe`);
}
assert(installer.includes("syncCreatureCompendium"), "creatures are not synced to a compendium");
assert(installer.includes('name: "wayreth-creatures"'), "the bestiary compendium is not registered");
assert(installer.includes('type: "Actor"'), "the bestiary must be created as an Actor compendium");



// --- Crow legacy items (1.21.0) ---
//
// These are the only items in the module whose features are gated on the
// bearer's level, so the checks below are about the gate rather than the prose:
// the pool must scale, the tiers must all be reachable, and nothing may be
// usable before its band.
const legacy = read("content/legacy-items.json").items;
const LEGACY_TIERS = [
  { key: "dormant", min: 3, max: 5, charges: 3 },
  { key: "awakened", min: 6, max: 9, charges: 5 },
  { key: "exalted", min: 10, max: 14, charges: 7 },
  { key: "legendary", min: 15, max: null, charges: 9 }
];
const LEGACY_BEARERS = ["Alice", "Solanthis", "Jinx", "Sylas", "Clipper", "Kattal"];

assert(legacy.length === 6, `expected 6 legacy items, found ${legacy.length}`);
assert(contentFileList.includes("legacy-guide.json"), "legacy-guide.json is not registered in CONTENT_FILES");
assert(sourceNameMap.includes('"The Crow Legacies"'), "The Crow Legacies is missing from SOURCE_FILE_BY_NAME");
assert(installer.includes("syncLegacyCompendium"), "legacy items are not synced to a compendium");
assert(installer.includes('name: "wayreth-legacy-items"'), "the legacy compendium is not registered");
assert(installer.includes("loadLegacySources"), "the installer does not load legacy-items.json");
assert(/legacyCount = legacy\.length/.test(installer), "reinstallContent does not report the legacy items");

// One shared charge table, checked by evaluating the formulas rather than
// trusting them. Dice are collapsed to their extremes so the branch taken at
// each level can be read off.
const evalFormula = (formula, level, edge) => {
  const replaced = formula.replaceAll("@details.level", String(level))
    .replace(/\bmin\(/g, "Math.min(").replace(/\bmax\(/g, "Math.max(")
    .replace(/(\d+)d(\d+)/g, (_, n, d) => `(${n} * ${edge === "min" ? 1 : d})`);
  return Function(`"use strict"; return (${replaced});`)();
};
const legacyMax = legacy[0].system.uses.max;
const legacyRecovery = legacy[0].system.uses.recovery[0].formula;
assert(!legacyMax.includes(" ? "), "the charge pool must not use a ternary — dnd5e strips those from uses.max");
for (const tier of LEGACY_TIERS) {
  for (const level of [tier.min, tier.max ?? 20]) {
    const pool = evalFormula(legacyMax, level, "min");
    assert(pool === tier.charges,
      `charge pool at level ${level} should be ${tier.charges} for ${tier.key}, formula gives ${pool}`);
    const low = evalFormula(legacyRecovery, level, "min");
    const high = evalFormula(legacyRecovery, level, "max");
    if (tier.key === "dormant" || tier.key === "awakened") {
      assert(low === tier.charges && high === tier.charges,
        `${tier.key} must refill its whole pool at level ${level}, got ${low}..${high}`);
    } else {
      const die = tier.key === "exalted" ? 6 : 8;
      assert(low === 2 && high === die + 1,
        `${tier.key} should recover 1d${die} + 1 at level ${level}, got ${low}..${high}`);
    }
  }
}

const legacyItemIds = new Set();
for (const item of legacy) {
  const flags = item.flags?.[MODULE] ?? {};
  assert(flags.legacy === true, `${item.name}: missing the legacy flag`);
  assert(LEGACY_BEARERS.includes(flags.bearer), `${item.name}: unknown bearer ${flags.bearer}`);
  assert(!legacyItemIds.has(item._id), `${item.name}: duplicate item id`);
  legacyItemIds.add(item._id);
  assert(item.type === "equipment", `${item.name}: must be an equipment Item, found ${item.type}`);
  assert(["wondrous", "rod"].includes(item.system.type.value),
    `${item.name}: unexpected equipment type ${item.system.type.value}`);
  assert(item.system.rarity === "uncommon", `${item.name}: must open at its Dormant rarity`);
  assert(item.system.attunement === "required", `${item.name}: must require attunement`);
  assert(item.system.properties.includes("mgc"), `${item.name}: must be flagged magical`);
  assert(item.system.identified === true, `${item.name}: should ship identified`);
  assert(item.system.unidentified?.name, `${item.name}: needs an unidentified name for GMs who hide it`);
  assert(item.system.uses.max === legacyMax, `${item.name}: does not use the shared charge pool`);
  assert(item.system.uses.recovery.length === 1, `${item.name}: needs exactly one recovery profile`);
  assert(["dawn", "dusk"].includes(item.system.uses.recovery[0].period),
    `${item.name}: charges must return at dawn or dusk`);
  assert(item.system.uses.recovery[0].formula === legacyRecovery,
    `${item.name}: does not use the shared tiered recovery`);
  assert(item.system.source?.rules === "2014", `${item.name}: must be 2014 rules`);

  const dc = flags.dc;
  assert(dc === "spellcasting" || ["str", "dex", "con", "int", "wis", "cha"].includes(dc),
    `${item.name}: invalid Legacy Save DC source ${dc}`);

  const acts = Object.entries(item.system.activities ?? {});
  assert(acts.length >= 8, `${item.name}: only ${acts.length} activities — the tiers cannot all be represented`);
  const perTier = Object.fromEntries(LEGACY_TIERS.map(t => [t.key, 0]));
  for (const [key, act] of acts) {
    const at = `${item.name} / ${act.name ?? key}`;
    assert(/^[A-Za-z0-9]{16}$/.test(key), `${at}: activity id is not a 16-character Foundry ID`);
    assert(act._id === key, `${at}: activity key/_id mismatch`);
    const min = act.visibility?.level?.min;
    const tier = LEGACY_TIERS.find(t => t.min === min);
    assert(Boolean(tier), `${at}: gate min ${min} is not a tier threshold`);
    if (tier) perTier[tier.key] += 1;
    if ("max" in (act.visibility?.level ?? {})) {
      const max = act.visibility.level.max;
      assert(LEGACY_TIERS.some(t => t.min === max + 1), `${at}: gate max ${max} is not a tier boundary`);
      assert(max >= min, `${at}: gate max below gate min`);
    }
    // Level is the gate, not attunement: dnd5e rewrites requireAttunement from
    // requireMagic on an attunement-required item, so both stay off.
    assert(act.visibility.requireAttunement === false, `${at}: must not gate on attunement`);
    assert(act.visibility.requireMagic === false, `${at}: must not gate on magic availability`);
    assert(Boolean(act.description?.chatFlavor), `${at}: no chat text`);
    for (const target of act.consumption?.targets ?? []) {
      assert(["itemUses", "activityUses", "hitDice"].includes(target.type),
        `${at}: unexpected consumption type ${target.type}`);
      if (target.type === "activityUses") {
        assert(Boolean(act.uses?.max), `${at}: spends its own uses but has no pool`);
      }
    }
    if (act.uses?.max) {
      assert((act.consumption?.targets ?? []).some(t => t.type === "activityUses"),
        `${at}: has a use pool nothing spends`);
    }
    if (act.type === "save") {
      assert(act.save.dc.calculation === dc, `${at}: save DC is not the item's Legacy DC`);
      assert(act.save.ability.length > 0, `${at}: save with no ability`);
    }
    // A formula written as "@profd6" is read as one @ reference and silently
    // becomes 0. Parenthesised dice counts are the dnd5e idiom.
    const amounts = act.type === "heal" ? [act.healing] : (act.damage?.parts ?? []);
    for (const amount of amounts) {
      if (!amount?.custom?.enabled) continue;
      assert(!/@[a-z.]*\bd\d/.test(amount.custom.formula),
        `${at}: "${amount.custom.formula}" needs its dice count parenthesised`);
    }
  }
  for (const tier of LEGACY_TIERS) {
    assert(perTier[tier.key] > 0, `${item.name}: nothing is gated to ${tier.key}`);
    const band = tier.max === null ? `level ${tier.min}+` : `levels ${tier.min}–${tier.max}`;
    assert(item.system.description.value.includes(band),
      `${item.name}: description never states the ${tier.key} band (${band})`);
  }
  assert(!/undefined|\[object |NaN/.test(item.system.description.value),
    `${item.name}: description contains a rendering artefact`);
  for (const eff of item.effects ?? []) {
    assert(eff.transfer === true, `${item.name}: effect ${eff.name} must transfer to the bearer`);
    assert(eff.changes.length > 0, `${item.name}: effect ${eff.name} changes nothing`);
    // A tier-gated effect that cannot gate itself must say so in its own name,
    // or a GM will never know it is waiting to be switched on.
    if (eff.disabled) {
      assert(/level \d/.test(eff.name), `${item.name}: disabled effect ${eff.name} must name the level to enable it at`);
    }
  }
}

// Each bearer gets exactly one item, and Ispin's two are both accounted for.
for (const bearer of LEGACY_BEARERS) {
  const owned = legacy.filter(i => i.flags[MODULE].bearer === bearer);
  assert(owned.length === 1, `${bearer} has ${owned.length} legacy items`);
}
assert(legacy.filter(i => i.name.startsWith("Ispin's")).length === 2,
  "both of Ispin Greenshield's items must keep his name");
assert(legacy.find(i => i.flags[MODULE].bearer === "Sylas").system.uses.recovery[0].period === "dusk",
  "the Shepherd's Lantern must recover at dusk");
assert(legacy.filter(i => i.system.uses.recovery[0].period === "dawn").length === 5,
  "the other five legacy items must recover at dawn");

const legacyGuide = read("content/legacy-guide.json");
assert(legacyGuide.pages.length === 3, `legacy guide should have 3 pages, found ${legacyGuide.pages.length}`);
const legacyGuideText = JSON.stringify(legacyGuide);
for (const bearer of LEGACY_BEARERS) {
  assert(legacyGuideText.includes(bearer), `legacy guide never mentions ${bearer}`);
}
assert(legacyGuideText.includes("8 + proficiency bonus"), "legacy guide must state the Legacy Save DC");
assert(legacyGuideText.includes("Sure Footing"), "legacy guide must flag Clipper's manual toggle");
assert(legacyGuideText.includes("seven days"), "legacy guide must flag Sylas' manual reset");
assert(fs.readFileSync(path.join(ROOT, "styles", "wayreth.css"), "utf8").includes(".wy-legacy"),
  "legacy item descriptions have no stylesheet support");


// --- per-item player reference journals (1.22.0) ---
//
// These are generated from the same definitions as the items, so the checks
// that matter are the ones that would catch the generator drifting: every
// feature on the item must be findable in its journal, the charge table must
// match the real one, and no roll-data reference may leak into player prose.
const legacyByBearer = new Map(legacy.map(i => [i.flags[MODULE].bearer, i]));
const TIER_BANDS = LEGACY_TIERS.map(t =>
  t.max === null ? `level ${t.min}+` : `levels ${t.min}–${t.max}`);

assert(LEGACY_PLAYER_FILES.length === 6, "expected 6 player reference journals");

for (const slug of LEGACY_BEARER_SLUGS) {
  const file = `legacy-player-${slug}.json`;
  const bearer = slug[0].toUpperCase() + slug.slice(1);
  const item = legacyByBearer.get(bearer);
  assert(Boolean(item), `${file}: no legacy item belongs to ${bearer}`);
  if (!item) continue;

  const journal = read(`content/${file}`);
  const text = JSON.stringify(journal);

  assert(contentFileList.includes(file), `${file} is not registered in CONTENT_FILES`);
  assert(sourceNameMap.includes(`"${journal.name}"`),
    `${file}: journal name "${journal.name}" missing from SOURCE_FILE_BY_NAME`);
  assert(installer.includes(`legacy-player-\${bearer}.json`)
    || installer.includes(`"${file}"`),
    `${file} is not in the player-visible list`);
  assert(journal.name === `${bearer} — ${item.name}`,
    `${file}: journal is named "${journal.name}"`);
  assert(journal.pages.length === 6, `${file}: expected 6 pages, found ${journal.pages.length}`);
  assert(journal.pages[0].name === "Quick Reference", `${file}: first page must be the summary`);
  assert(journal.pages.at(-1).name === "Playing It Well", `${file}: last page must be the play guide`);

  // One page per state, in order, each naming its own level band.
  for (const [index, tier] of LEGACY_TIERS.entries()) {
    const page = journal.pages[index + 1];
    const band = TIER_BANDS[index];
    assert(page.name.includes(tier.key[0].toUpperCase() + tier.key.slice(1)),
      `${file}: page ${index + 1} is "${page.name}", expected the ${tier.key} state`);
    assert(page.html.includes(band), `${file} / ${page.name}: does not state ${band}`);
    assert(page.html.includes(String(tier.charges)),
      `${file} / ${page.name}: does not state its ${tier.charges} charges`);
  }

  // The anti-drift check: every feature the item actually has must appear.
  for (const act of Object.values(item.system.activities)) {
    assert(text.includes(JSON.stringify(act.name).slice(1, -1)),
      `${file}: activity "${act.name}" never appears in the player reference`);
  }

  // Each activity must be described on the page for its own tier, not another.
  for (const act of Object.values(item.system.activities)) {
    const tierIndex = LEGACY_TIERS.findIndex(t => t.min === act.visibility.level.min);
    if (tierIndex < 0) continue;
    const page = journal.pages[tierIndex + 1];
    assert(page.html.includes(JSON.stringify(act.name).slice(1, -1)),
      `${file}: "${act.name}" is gated to ${LEGACY_TIERS[tierIndex].key} but is not on that page`);
  }

  const quick = journal.pages[0].html;
  for (const band of TIER_BANDS) {
    assert(quick.includes(band), `${file}: quick reference omits ${band}`);
  }
  for (const tier of LEGACY_TIERS) {
    assert(quick.includes(`<td>${tier.charges}</td>`),
      `${file}: charge table is missing the ${tier.key} figure of ${tier.charges}`);
  }
  assert(quick.includes("1d6 + 1") && quick.includes("1d8 + 1"),
    `${file}: charge table must show the Exalted and Legendary recovery dice`);
  const period = item.system.uses.recovery[0].period;
  assert(quick.includes(`Back at ${period}`),
    `${file}: charge table must say charges return at ${period}`);

  // Roll-data references belong on the sheet, not in player prose.
  assert(!/@(details|prof|classes|abilities|attributes)\b/.test(text),
    `${file}: a raw roll-data reference leaked into the player text`);
  assert(!/undefined|\[object |NaN|\bnull\b/.test(text),
    `${file}: contains a rendering artefact`);

  // Every page must carry real content rather than a bare heading.
  for (const page of journal.pages) {
    assert(page.html.length > 400, `${file} / ${page.name}: too short to be useful`);
  }

  const play = journal.pages.at(-1).html;
  assert((play.match(/<li>/g) ?? []).length >= 4, `${file}: play guide needs real tips`);
  assert((play.match(/<strong>/g) ?? []).length >= 4, `${file}: play guide needs rulings`);
}

// The two manual exceptions must be called out where the player will see them.
assert(read("content/legacy-player-clipper.json").pages[0].html.includes("switched off"),
  "Clipper's reference must warn that Sure Footing ships disabled");
assert(read("content/legacy-player-sylas.json").pages[0].html.includes("does not come back on a rest"),
  "Sylas' reference must warn that Not Yet has no automatic recharge");
assert(JSON.stringify(read("content/legacy-guide.json")).includes("Player Reference Sheets"),
  "the GM guide must point at the player reference journals");
assert(installer.includes("PLAYER_VISIBLE"), "player-visible journals are not configured");


// --- legacy chat cards (1.22.1) ---
//
// dnd5e renders an activity's usage card from the item's own description
// (ItemDataModel#getCardData falls back to system.description.value), so a
// legacy item printed all four of its states every time one feature was used.
// Two defences: the installer rebuilds the card around the feature used, and
// every item carries a short description.chat as the fallback if that ever
// does not run. scripts/validate-cards.mjs exercises the rebuild itself.
assert(installer.includes("dnd5e.preCreateUsageMessage"),
  "the legacy chat card fix is not hooked up");
assert(installer.includes("trimLegacyUsageCard"), "trimLegacyUsageCard is missing");
assert(/getFlag\?\.\(MODULE, "legacy"\)/.test(installer),
  "the chat card fix must only touch legacy items");
assert(installer.includes("card.outerHTML"),
  "the rebuilt card must be serialised from the card element, not the document body");
assert(/catch \(error\) \{[\s\S]{0,400}Could not trim the legacy usage card/.test(installer),
  "a failure to trim the card must never block using the feature");

for (const item of legacy) {
  const chat = item.system.description.chat;
  assert(Boolean(chat), `${item.name}: needs a short description.chat, or dnd5e falls back to the whole item`);
  assert(chat.length < 600,
    `${item.name}: description.chat is ${chat.length} characters — it is meant to be a fallback line`);
  assert(!/How this item works|Vault Record/.test(chat),
    `${item.name}: description.chat has picked up the full item text`);
  assert(chat.includes(item.flags[MODULE].bearer),
    `${item.name}: the fallback line should name its bearer`);
}
assert(fs.existsSync(path.join(ROOT, "scripts", "validate-cards.mjs")),
  "the chat card regression test is missing");
assert(JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"))
  .scripts["validate:all"].includes("validate-cards"),
  "validate:all must run the card check");


// --- release URLs (1.22.1) ---
//
// Two Forge installs have now failed with an opaque 500 because the manifest
// and the git tag disagreed: the download URL named a release that did not
// exist, GitHub answered 404, and the Forge reported it as a server error.
// These are the offline half of that check; scripts/check-release.mjs probes
// the live URLs.
const releaseTag = `v${manifest.version}`;
assert(manifest.download.includes(`/releases/download/${releaseTag}/`),
  `module.json download URL must point at tag ${releaseTag}, not ${manifest.download}`);
assert(manifest.download.endsWith("/module.zip"),
  "the release asset must be named module.zip exactly");
assert(manifest.manifest.endsWith("/releases/latest/download/module.json"),
  "the manifest URL must use the /releases/latest/ form so Foundry sees new releases");
assert(manifest.download.startsWith(`${manifest.url}/releases/download/`),
  "the download URL must live under the repository named in module.json");
assert(fs.existsSync(path.join(ROOT, "scripts", "check-release.mjs")),
  "the release preflight script is missing");
assert(JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"))
  .scripts["validate:all"].includes("check-release"),
  "validate:all must run the release preflight");
// The README must name the tag that is actually being shipped, since that is
// what gets copied into the GitHub release form.
const readme = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
assert(readme.includes(`tagged **${releaseTag}**`),
  `README release instructions must name ${releaseTag}`);
assert(!/tagged \*\*v(?!${manifest.version}\*\*)[0-9.]+\*\*/.test(readme.replace(/\$/g, ""))
  || readme.match(/tagged \*\*v[0-9.]+\*\*/g).every(m => m === `tagged **${releaseTag}**`),
  "README names a release tag that is not this version");


// --- bestiary art (1.23.1) ---
//
// Portraits and tokens are organised by D&D creature type. Inside each type
// directory, the CR-prefixed filenames sort naturally from lowest to highest.
// The checks below deliberately walk the tree so a moved or missing asset
// cannot silently break an installed Actor.
const ART_DIR = path.join(ROOT, "assets", "bestiary");
const TOKEN_DIR = path.join(ROOT, "assets", "tokens");
const MODULE_PATH = `modules/${MODULE}`;
const normaliseArt = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const listWebpRecursive = dir => {
  const files = [];
  const walk = (base, relative = "") => {
    for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
      const rel = relative ? `${relative}/${entry.name}` : entry.name;
      const full = path.join(base, entry.name);
      if (entry.isDirectory()) walk(full, rel);
      else if (entry.isFile() && entry.name.endsWith(".webp")) files.push(rel);
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  return files.sort();
};
const stripArtPrefix = file => path.basename(file)
  .replace(/^CR\d+(?:\.\d+)?_\d+_/i, "")
  .replace(/^\d+_/, "")
  .replace(/\.webp$/i, "");

assert(fs.existsSync(ART_DIR), "assets/bestiary is missing");
assert(fs.existsSync(TOKEN_DIR), "assets/tokens is missing");
const portraits = listWebpRecursive(ART_DIR);
const tokenFiles = listWebpRecursive(TOKEN_DIR);
assert(portraits.length === creatures.length,
  `expected one portrait per creature: ${portraits.length} art files, ${creatures.length} creatures`);
assert(tokenFiles.length === portraits.length,
  `every portrait needs a token: ${portraits.length} portraits, ${tokenFiles.length} tokens`);

const usedArt = new Set();
const TOKEN_SQUARES = { tiny: 0.5, sm: 1, med: 1, lg: 2, huge: 3, grg: 4 };
for (const actor of creatures) {
  const where = actor.name;
  assert(typeof actor.img === "string" && actor.img.startsWith(`${MODULE_PATH}/assets/bestiary/`),
    `${where}: portrait is not module art (${actor.img})`);
  assert(!actor.img.includes("mystery-man"), `${where}: still using the placeholder portrait`);
  const portraitRel = actor.img.slice(`${MODULE_PATH}/assets/bestiary/`.length);
  assert(fs.existsSync(path.join(ART_DIR, ...portraitRel.split("/"))),
    `${where}: portrait ${portraitRel} does not exist`);
  usedArt.add(portraitRel);

  const expectedType = actor.system.details.type.value.charAt(0).toUpperCase() + actor.system.details.type.value.slice(1);
  assert(portraitRel.startsWith(`${expectedType}/`),
    `${where}: portrait is in the wrong type folder (${portraitRel})`);
  const crPrefix = `CR${Number(actor.system.details.cr).toFixed(2).padStart(5, "0")}_`;
  assert(path.basename(portraitRel).startsWith(crPrefix),
    `${where}: portrait does not sort by CR (${portraitRel})`);
  assert(normaliseArt(stripArtPrefix(portraitRel)) === normaliseArt(actor.name),
    `${where}: portrait ${portraitRel} belongs to a different creature`);

  const token = actor.prototypeToken;
  assert(Boolean(token?.texture?.src), `${where}: no prototype token art`);
  assert(token.texture.src.startsWith(`${MODULE_PATH}/assets/tokens/`),
    `${where}: token art is not module art (${token.texture.src})`);
  const tokenRel = token.texture.src.slice(`${MODULE_PATH}/assets/tokens/`.length);
  assert(fs.existsSync(path.join(TOKEN_DIR, ...tokenRel.split("/"))),
    `${where}: token ${tokenRel} does not exist`);
  assert(tokenRel === portraitRel, `${where}: token and portrait use different organised paths`);

  // Size sets the floor, not the exact figure: a creature may be drawn larger
  // on purpose, as the abyssal wyrms are at six squares.
  const squares = TOKEN_SQUARES[actor.system.traits.size];
  assert(token.width === token.height,
    `${where}: token is ${token.width}x${token.height} and should be square`);
  assert(token.width >= squares,
    `${where}: ${actor.system.traits.size} token must be at least ${squares} squares, found ${token.width}`);
  assert(token.disposition === -1, `${where}: bestiary tokens should default to hostile`);
  assert(token.bar1?.attribute === "attributes.hp", `${where}: token has no hit point bar`);
}
for (const file of portraits) {
  assert(usedArt.has(file), `${file}: art for no creature in the bestiary`);
}

// The illustrated journal is generated from the same data, so it must cover
// every creature exactly once and reference only art that exists.
const gallery = read("content/bestiary-gallery.json");
assert(gallery.name === "The Wayreth Bestiary: Illustrated", "gallery journal is misnamed");
const galleryText = JSON.stringify(gallery);
for (const actor of creatures) {
  assert(galleryText.includes(JSON.stringify(actor.name).slice(1, -1)),
    `${actor.name} is missing from the illustrated bestiary`);
  assert(galleryText.includes(actor.img.split("/").pop()),
    `${actor.name}'s art is missing from the illustrated bestiary`);
}
const galleryImages = galleryText.match(/<img src=\\"[^"]+\\"/g) ?? [];
assert(galleryImages.length === creatures.length,
  `illustrated bestiary has ${galleryImages.length} images for ${creatures.length} creatures`);
const groupsInGallery = new Set(creatures.map(c => c.flags[MODULE].typeFolder));
assert(gallery.pages.length === groupsInGallery.size + 1,
  `expected one plate per creature type plus an index, found ${gallery.pages.length} pages`);
assert(contentFileList.includes("bestiary-gallery.json"),
  "bestiary-gallery.json is not registered in CONTENT_FILES");
assert(sourceNameMap.includes('"The Wayreth Bestiary: Illustrated"'),
  "the illustrated bestiary is missing from SOURCE_FILE_BY_NAME");

// Every image anywhere in the managed journals must point at a file that ships.
for (const file of [...new Set(managedJournalFiles)]) {
  const journal = read(`content/${file}`);
  for (const page of journal.pages) {
    for (const match of page.html.matchAll(/<img [^>]*src="([^"]+)"/g)) {
      const src = match[1];
      assert(src.startsWith(`${MODULE_PATH}/assets/`),
        `${file} / ${page.name}: image ${src} is not module art`);
      const onDisk = path.join(ROOT, src.slice(`${MODULE_PATH}/`.length));
      assert(fs.existsSync(onDisk), `${file} / ${page.name}: image ${src} does not exist`);
    }
  }
}

// The stat-block journal used to claim thirty-six creatures and list nine
// groups; it predated the expansion and was simply wrong.
const compendiumPage = read("content/npcs.json").pages.find(p => p.name === "The Bestiary Compendium");
assert(Boolean(compendiumPage), "the bestiary compendium page is missing");
assert(compendiumPage.html.includes(`All ${creatures.length} creatures`),
  `the compendium page must state the real creature count (${creatures.length})`);
assert(!/Thirty-six|thirty-six/.test(compendiumPage.html),
  "the compendium page still claims thirty-six creatures");
for (const group of groupsInGallery) {
  assert(compendiumPage.html.includes(group),
    `the compendium page does not list the ${group} group`);
}
assert(fs.existsSync(path.join(ROOT, "tools", "make-tokens.py")),
  "the token generator is missing");
assert(fs.readFileSync(path.join(ROOT, "styles", "wayreth.css"), "utf8").includes(".wy-gallery"),
  "the bestiary plates have no stylesheet support");


// --- working stat blocks (1.24.0) ---
//
// Every creature's rules are written out in its text. Until 1.24.0 that was
// all they were: a dragon's breath weapon described a DC and 12d6 of fire and
// the sheet offered nothing to click, never recharged and rolled nothing.
//
// The mechanics are now derived from that text, which means the check that
// matters is agreement: anything the prose states must exist as an activity,
// and with the same numbers. A derived DC that drifts from the written one is
// worse than no DC at all, because nobody would notice.
const SAVE_TEXT = /DC\s*(\d+)\s+(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving throw/i;
const DAMAGE_TEXT = /(?:\d+\s*\()?(\d+)d(\d+)(?:\s*\+\s*(\d+))?\)?\s+(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\s+damage/gi;
const RECHARGE_TEXT = /Recharge\s*(\d)/i;
const ABILITY_FROM_NAME = {
  strength: "str", dexterity: "dex", constitution: "con",
  intelligence: "int", wisdom: "wis", charisma: "cha"
};
const ABILITY_NAMES = {
  str: "Strength", dex: "Dexterity", con: "Constitution",
  int: "Intelligence", wis: "Wisdom", cha: "Charisma"
};

/**
 * Rewrites dnd5e's roll enrichers as the sentence they render to.
 *
 * The abyssal wyrms are written with `[[/save wis 25 format=long]]` and
 * `[[/damage 18d10 type=psychic average=true]]` rather than plain prose. Left
 * as-is these checks would read "take [[/damage 4d10 ...]] damage" as damage
 * promised with no dice, and would never verify an enricher save against its
 * activity. Expanding them first means a stat block written either way is held
 * to the same standard.
 */
function expandEnrichers(text) {
  return String(text ?? "")
    .replace(/\[\[\/save\s+([a-z]{3})\s+(\d+)[^\]]*\]\]/gi,
      (_, ability, dc) => `DC ${dc} ${ABILITY_NAMES[ability.toLowerCase()] ?? ability} saving throw`)
    .replace(/\[\[\/damage\s+(\d+)d(\d+)(?:\s*\+\s*[^\s\]]+)?[^\]]*?type=([a-z]+)[^\]]*\]\]/gi,
      (_, number, faces, type) => `${number}d${faces} ${type} damage`)
    .replace(/\[\[\/(?:attack|check|item|concentration)[^\]]*\]\]/gi, " ")
    .replace(/\[\[[^\]]*\]\]/g, " ");
}

const plain = h => expandEnrichers(String(h ?? "")
  .replace(/<[^>]+>/g, " "))
  .replace(/&ndash;|&mdash;/g, "-")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ")
  .trim();

let derivedSaves = 0;
let derivedRecharges = 0;
let derivedDamage = 0;
for (const actor of creatures) {
  for (const item of actor.items) {
    const where = `${actor.name} / ${plain(item.name)}`;
    const text = plain(item.system?.description?.value);
    const activities = Object.values(item.system?.activities ?? {});

    // "Legendary Actions" and "Lair Actions" are headers that restate what
    // their sibling items implement, so their text repeats DCs and damage
    // that live elsewhere.
    const isHeader = /^(Legendary|Lair|Mythic) Actions$/i.test(plain(item.name));
    if (isHeader) continue;

    const save = SAVE_TEXT.exec(text);
    if (save) {
      const saveActivities = activities.filter(a => a.type === "save");
      assert(saveActivities.length > 0,
        `${where}: text states a DC ${save[1]} ${save[2]} save but the item has no save activity`);
      if (saveActivities.length) {
        const dc = saveActivities[0].save?.dc;
        assert(dc?.formula === save[1],
          `${where}: save activity is DC ${dc?.formula}, the text says ${save[1]}`);
        assert(dc?.calculation === "",
          `${where}: a monster's DC is a flat number, not a calculation`);
        const ability = ABILITY_FROM_NAME[save[2].toLowerCase()];
        assert(JSON.stringify(saveActivities[0].save?.ability) === JSON.stringify([ability]),
          `${where}: save is against ${JSON.stringify(saveActivities[0].save?.ability)}, the text says ${ability}`);
        derivedSaves += 1;
      }
    }

    const recharge = RECHARGE_TEXT.exec(`${plain(item.name)} ${text}`);
    if (recharge) {
      const recovery = item.system.uses?.recovery ?? [];
      const profile = recovery.find(r => r.period === "recharge");
      assert(Boolean(profile),
        `${where}: text says Recharge ${recharge[1]} but the item never recharges`);
      if (profile) {
        assert(profile.formula === recharge[1],
          `${where}: recharges on ${profile.formula}, the text says ${recharge[1]}`);
        assert(item.system.uses.max === "1",
          `${where}: a recharging feature needs a single use to spend`);
        assert(activities.some(a => (a.consumption?.targets ?? []).some(t => t.type === "itemUses")),
          `${where}: recharging feature has nothing that spends the use`);
        derivedRecharges += 1;
      }
    }

    // Damage written into a feature must actually roll. Weapons carry their
    // damage on the attack itself, so only features are checked here.
    if (item.type === "feat") {
      DAMAGE_TEXT.lastIndex = 0;
      const written = [...text.matchAll(DAMAGE_TEXT)];
      if (written.length) {
        const parts = activities.flatMap(a => a.damage?.parts ?? []);
        assert(parts.length >= written.length,
          `${where}: text rolls ${written.length} damage expression(s), the activity has ${parts.length}`);
        written.forEach((match, index) => {
          const part = parts[index];
          if (!part) return;
          assert(part.number === Number(match[1]) && part.denomination === Number(match[2]),
            `${where}: damage is ${part.number}d${part.denomination}, the text says ${match[1]}d${match[2]}`);
          assert(JSON.stringify(part.types) === JSON.stringify([match[4].toLowerCase()]),
            `${where}: damage type is ${JSON.stringify(part.types)}, the text says ${match[4].toLowerCase()}`);
        });
        derivedDamage += written.length;
      }
    }

    for (const activity of activities) {
      assert(/^[A-Za-z0-9]{16}$/.test(activity._id),
        `${where}: activity id ${activity._id} is not a 16-character Foundry ID`);
      assert(["attack", "save", "damage", "heal", "utility", "check"].includes(activity.type),
        `${where}: invalid activity type ${activity.type}`);
      assert(Boolean(activity.activation?.type),
        `${where}: activity has no activation`);
    }
  }
}
assert(derivedSaves >= 88, `expected at least 88 working saving throws, found ${derivedSaves}`);
assert(derivedRecharges >= 27, `expected at least 27 recharging features, found ${derivedRecharges}`);
assert(derivedDamage >= 60, `expected at least 60 rolling damage expressions, found ${derivedDamage}`);

// Damage promised in prose but never quantified rolls nothing. Eight dragon
// wing attacks said "take bludgeoning damage" with no dice at all, which is
// invisible unless you go looking: the save fires and the damage is zero.
const DAMAGE_PHRASE = /\b(?:take|taking|takes|deal|deals|dealing)\b[^.]{0,40}?\bdamage\b/gi;
// Phrases that legitimately name no dice: a trigger, a rider, or a reference
// to damage from somewhere else entirely.
const UNQUANTIFIED_OK = [
  /falling damage/i, /takes? no damage/i, /deals? double damage/i,
  /takes? damage\b(?!\s*[,:]?\s*\d)/i, /half (?:as much|the) damage/i,
  /damage (?:from|of) /i, /resistance to/i, /immunity to/i,
  // Back-references to damage dealt elsewhere in the same feature, rather
  // than a new roll: "can take this damage only once per turn", "the
  // triggering attack still deals damage".
  /this damage/i, /still deals damage/i, /the damage\b/i,
  // Triggers and references rather than a roll of their own.
  /would take [^.]*damage/i, /whenever the \w+ deals/i, /instance to/i
];
for (const actor of creatures) {
  for (const item of actor.items) {
    const text = plain(item.system?.description?.value);
    DAMAGE_PHRASE.lastIndex = 0;
    for (const match of text.matchAll(DAMAGE_PHRASE)) {
      const phrase = match[0];
      if (/\d+d\d+/.test(phrase)) continue;
      // Judge the phrase in context: "or take bludgeoning damage" is a missing
      // roll, while "the wyrm would take Fire or Cold damage" is a trigger.
      const context = text.slice(Math.max(0, match.index - 34), match.index + phrase.length);
      if (UNQUANTIFIED_OK.some(allowed => allowed.test(context))) continue;
      assert(false,
        `${actor.name} / ${plain(item.name)}: "${phrase}" promises damage but names no dice`);
    }
  }
}

// A creature with more than one melee attack routine needs Multiattack, or its
// action economy is wrong. The low-CR troops with a melee and a ranged option
// are the documented exception: a CR 1/2 guard chooses, it does not do both.
const MULTIATTACK_EXEMPT = new Set([
  "Dragonarmy Recruit", "Solamnic Foot Soldier", "Baaz Draconian",
  "Palanthas City Guard", "Kapak Draconian"
]);
for (const actor of creatures) {
  const weapons = actor.items.filter(i => i.type === "weapon");
  const hasMultiattack = actor.items.some(i => plain(i.name).includes("Multiattack"));
  if (weapons.length >= 2 && !hasMultiattack) {
    assert(MULTIATTACK_EXEMPT.has(actor.name),
      `${actor.name}: ${weapons.length} attacks and no Multiattack`);
  }
}

// Order: creature type, then ascending challenge, in the compendium and in the
// illustrated journal alike.
const TYPE_FOLDER_NAMES = ["Aberration", "Beast", "Dragon", "Fiend", "Humanoid", "Plant", "Undead"];
const seenOrder = [];
for (const actor of creatures) {
  const folder = actor.flags[MODULE]?.typeFolder;
  assert(TYPE_FOLDER_NAMES.includes(folder),
    `${actor.name}: type folder "${folder}" is not one of the creature types`);
  assert(typeof actor.sort === "number" && actor.sort > 0,
    `${actor.name}: has no sort value, so the compendium cannot order it`);
  seenOrder.push([folder, actor.system.details.cr, actor.sort, actor.name]);
}
for (let i = 1; i < seenOrder.length; i++) {
  const [folder, cr, sort] = seenOrder[i];
  const [prevFolder, prevCr, prevSort, prevName] = seenOrder[i - 1];
  if (folder === prevFolder) {
    assert(cr >= prevCr,
      `${seenOrder[i][3]} (CR ${cr}) follows ${prevName} (CR ${prevCr}) in ${folder}`);
    assert(sort > prevSort, `${seenOrder[i][3]}: sort value does not advance`);
  } else {
    assert(folder.localeCompare(prevFolder) > 0,
      `creature types are out of order: ${folder} follows ${prevFolder}`);
  }
}
assert(installer.includes("rebuildCreatureFolders"),
  "the bestiary compendium does not build its type folders");
assert(/sorting: "m"/.test(installer),
  "the type folders must sort manually, or the pack re-alphabetises the contents");

// Each plate must run weakest to strongest, matching the compendium.
for (const page of gallery.pages.slice(1)) {
  assert(TYPE_FOLDER_NAMES.includes(page.name),
    `illustrated bestiary has a plate called "${page.name}"`);
  const listed = [...page.html.matchAll(/wy-plate-stats">CR ([0-9/]+)/g)]
    .map(m => (m[1].includes("/") ? eval(m[1]) : Number(m[1])));
  for (let i = 1; i < listed.length; i++) {
    assert(listed[i] >= listed[i - 1],
      `${page.name} plate: CR ${listed[i]} follows CR ${listed[i - 1]}`);
  }
}
assert(read("content/npcs.json").pages.find(p => p.name === "The Bestiary Compendium")
  .html.includes("folder per creature type"),
  "the compendium page must explain the type folders");


// --- the abyssal wyrms (1.25.0) ---
//
// Three CR 25-27 wyrms arrived as finished Foundry exports rather than roster
// definitions, and they are kept that way: their damage and saves are written
// with dnd5e's roll enrichers and their lair actions are real activities,
// which is better than this builder produces. What is checked here is that
// the normalisation did its job and that nothing about them is foreign to the
// rest of the bestiary.
const WYRMS = creatures.filter(c => c.flags[MODULE]?.group === "Abyssal Wyrm");
assert(WYRMS.length === 3, `expected 3 abyssal wyrms, found ${WYRMS.length}`);
const WYRM_CRS = WYRMS.map(w => w.system.details.cr).sort((a, b) => a - b);
assert(JSON.stringify(WYRM_CRS) === JSON.stringify([25, 26, 27]),
  `the wyrms should be CR 25, 26 and 27, found ${WYRM_CRS.join(", ")}`);

for (const wyrm of WYRMS) {
  const where = wyrm.name;
  assert(Boolean(wyrm.flags[MODULE]?.species), `${where}: no species recorded`);
  assert(wyrm.system.details.source?.rules === "2014",
    `${where}: must carry the module's 2014 source like every other creature`);
  assert(wyrm.flags[MODULE]?.typeFolder === "Dragon",
    `${where}: belongs in the Dragon folder`);
  assert(wyrm.system.details.cr > 24,
    `${where}: must sit above the ancient dragons`);

  // Every activity id in the exports was 12 characters, which Foundry's
  // DocumentIdField rejects outright. This is the check that they were all
  // repaired, and that none creeps back in on a re-export.
  for (const item of wyrm.items) {
    for (const [key, activity] of Object.entries(item.system?.activities ?? {})) {
      assert(/^[A-Za-z0-9]{16}$/.test(key),
        `${where} / ${item.name}: activity id "${key}" is ${key.length} characters, Foundry needs 16`);
      assert(activity._id === key, `${where} / ${item.name}: activity key/_id mismatch`);
    }
    if (item.system?.uses) {
      assert(item.system.uses.spent !== null,
        `${where} / ${item.name}: uses.spent is null where the schema wants a number`);
    }
  }

  // The wyrms are the only creatures with lair actions, and the reason the
  // lair resource exists at all.
  const lairActions = wyrm.items.filter(i =>
    Object.values(i.system?.activities ?? {}).some(a => a.activation?.type === "lair"));
  assert(lairActions.length === 3, `${where}: expected 3 lair actions, found ${lairActions.length}`);
  assert(wyrm.system.resources?.lair?.value === true, `${where}: lair resource is not enabled`);
  assert(wyrm.system.resources?.lair?.initiative === 20,
    `${where}: lair actions run on initiative 20`);
  assert(wyrm.system.resources?.legact?.max === 4,
    `${where}: configured for its lair, which is four legendary actions`);
  assert(wyrm.system.resources?.legres?.max === 5,
    `${where}: configured for its lair, which is five legendary resistances`);
}

// The art set grew with them, and INDEX.csv is now generated so it cannot
// describe a bestiary that no longer exists.
const indexCsv = fs.readFileSync(path.join(ROOT, "assets", "bestiary", "INDEX.csv"), "utf8")
  .trim().split("\n");
assert(indexCsv.length === creatures.length + 1,
  `INDEX.csv lists ${indexCsv.length - 1} creatures, the bestiary has ${creatures.length}`);
assert(indexCsv[0] === "type,cr,name,portrait,token", "INDEX.csv header has changed");
for (const creature of creatures) {
  assert(indexCsv.some(row => row.includes(creature.img.replace(`${MODULE_PATH}/`, ""))),
    `INDEX.csv is missing ${creature.name}`);
}
assert(fs.existsSync(path.join(ROOT, "scripts", "lib", "wyrms")),
  "the wyrm exports are not kept as source");
assert(installer.includes("rebuildCreatureFolders"), "type folders are not built");


// --- NPC spellcasting (1.26.0) ---
//
// Every caster described its spells in prose and had none assigned, so the
// sheet showed slots with nothing to put in them. The lists are read out of
// that prose at build time and resolved against dnd5e's spell compendium at
// install time, which means the thing worth checking here is that every name
// can actually be resolved: a name that resolves to nothing is invisible on a
// stat block that still describes it.
const srdSpells = read("scripts/lib/srd-spell-names.json");
const localSpells = read("content/npc-spells.json").spells;
// The module's own 90 robe spells resolve too — a Wizard of High Sorcery
// preparing an Order spell must find it.
const robeSpells = read("content/spells.json").items;
const resolvable = new Set([
  ...srdSpells.names.map(n => n.toLowerCase()),
  ...localSpells.map(s => s.name.toLowerCase()),
  ...robeSpells.map(s => s.name.toLowerCase())
]);
assert(srdSpells.names.length > 300,
  `the SRD spell name list looks truncated (${srdSpells.names.length} names)`);

let spellListCount = 0;
let spellRefCount = 0;
const unresolvable = new Set();
for (const actor of creatures) {
  const lists = actor.flags[MODULE]?.spellcasting;
  const ability = actor.system.attributes.spellcasting;
  const casterLevel = actor.system.details.spellLevel;

  // A caster level with no list means slots and nothing to cast; a list with
  // no ability means no save DC and no attack bonus.
  if (casterLevel) {
    assert(Boolean(lists?.length),
      `${actor.name}: ${casterLevel}th-level caster with no spell list`);
  }
  if (!lists?.length) continue;
  assert(Boolean(ability), `${actor.name}: has a spell list but no spellcasting ability`);
  spellListCount += 1;

  for (const list of lists) {
    assert(Array.isArray(list.groups) && list.groups.length,
      `${actor.name} / ${list.feature}: spell list has no groups`);
    for (const group of list.groups) {
      assert(["cantrip", "known", "level", "atwill", "innate", "order", "reserve"].includes(group.kind),
        `${actor.name} / ${list.feature}: unknown spell group "${group.kind}"`);
      if (group.kind === "level") {
        assert(group.level >= 1 && group.level <= 9,
          `${actor.name}: spell group at level ${group.level}`);
        assert(group.slots > 0, `${actor.name}: ${group.level}th level group has no slots`);
      }
      if (group.kind === "innate") {
        assert(group.perDay > 0, `${actor.name}: innate group with no uses per day`);
      }
      assert(group.spells.length > 0, `${actor.name} / ${list.feature}: empty spell group`);
      for (const name of group.spells) {
        spellRefCount += 1;
        if (!resolvable.has(name)) unresolvable.add(`${name} (${actor.name})`);
        assert(name === name.toLowerCase().trim(),
          `${actor.name}: spell name "${name}" is not normalised`);
      }
    }
  }

  // Everything the prose names in <em> must have come through the parser.
  for (const item of actor.items) {
    const raw = item.system?.description?.value ?? "";
    if (!/spellcaster|spell save dc|at will|prepared|cantrips|notable/i.test(raw)) continue;
    const named = (raw.match(/<em>/g) ?? []).length;
    const list = lists.find(l => l.feature === item.name);
    if (!list) continue;
    const captured = list.groups.reduce((n, g) => n + g.spells.length, 0);
    assert(named === captured,
      `${actor.name} / ${item.name}: stat block names ${named} spells, ${captured} were read`);
  }
}
// A Wizard of High Sorcery prepares their own Order's magic. The whole module
// turns on the three Orders having distinctive spells, so a White Robe holding
// a Black Robe spell is a content error, not a stylistic one.
const robeByName = new Map(robeSpells.map(s => [s.name.toLowerCase(), s.flags[MODULE].order]));
const ORDER_WIZARDS = {
  "Raistlin Majere, Master of Wayreth": "Black",
  "Par-Salian of the White Robes": "White",
  "Ladonna of the Black Robes": "Black",
  "Justarius of the Red Robes": "Red",
  "Dalamar Argent": "Black",
  "Fistandantilus": "Black",
  "Mereth Sorn, Renegade": "Black",
  // Dracart's apprentice, so Black-Robe-trained. He is no longer a caster
  // with the Order's schooling and none of its spells.
  "Ossian Krell": "Black"
};
let orderSpellCount = 0;
for (const [name, order] of Object.entries(ORDER_WIZARDS)) {
  const wizard = creatures.find(c => c.name === name);
  assert(Boolean(wizard), `${name} is missing from the bestiary`);
  if (!wizard) continue;
  const groups = (wizard.flags[MODULE]?.spellcasting ?? [])
    .flatMap(l => l.groups).filter(g => g.kind === "order");
  assert(groups.length === 1, `${name}: expected one Order spell group, found ${groups.length}`);
  for (const group of groups) {
    assert(group.order === order,
      `${name} is a ${order} Robe but prepares ${group.order} Robe spells`);
    assert(group.spells.length >= 2, `${name}: only ${group.spells.length} Order spells`);
    for (const spell of group.spells) {
      const belongs = robeByName.get(spell);
      assert(Boolean(belongs), `${name}: "${spell}" is not one of the module's robe spells`);
      assert(belongs === order,
        `${name} is a ${order} Robe but prepares "${spell}", which is a ${belongs} Robe spell`);
      orderSpellCount += 1;
    }
  }
}
assert(orderSpellCount >= 28,
  `expected at least 28 Order spells across the Wizards of High Sorcery, found ${orderSpellCount}`);

// Every caster that is not a Wizard of High Sorcery should have none: the
// Orders' magic is the Orders'.
for (const actor of creatures) {
  const groups = (actor.flags[MODULE]?.spellcasting ?? [])
    .flatMap(l => l.groups).filter(g => g.kind === "order");
  if (!groups.length) continue;
  assert(actor.name in ORDER_WIZARDS,
    `${actor.name} prepares Order spells but is not a Wizard of High Sorcery`);
}

// --- caster loadouts (1.29.0) ----------------------------------------------
//
// Fourteen stat blocks used to name a representative handful of spells each;
// a 20th-level archmage listed fourteen where a wizard of that level prepares
// twenty-seven. The lists are full now, and these four rules keep them full
// and legal rather than leaving the next edit to guess.
const MAX_SLOT_LEVEL = level => level >= 17 ? 9 : level >= 15 ? 8 : level >= 13 ? 7
  : level >= 11 ? 6 : level >= 9 ? 5 : level >= 7 ? 4 : level >= 5 ? 3 : level >= 3 ? 2 : 1;
const spellLevelByName = new Map([
  ...Object.entries(srdSpells.levels ?? {}),
  ...localSpells.map(s => [s.name.toLowerCase(), s.system.level]),
  ...robeSpells.map(s => [s.name.toLowerCase(), s.system.level])
]);
assert(Object.keys(srdSpells.levels ?? {}).length > 300,
  "the SRD level table looks truncated; the ceiling check would pass by default");

let preparedTotal = 0;
let reserveTotal = 0;
let cantripTotal = 0;
for (const actor of creatures) {
  const lists = actor.flags[MODULE]?.spellcasting;
  if (!lists?.length) continue;
  const leveled = lists.flatMap(l => l.groups).filter(g => ["level", "order", "reserve"].includes(g.kind));
  if (!leveled.length) continue; // innate-only, such as the aurak

  const casterLevel = actor.system.details.spellLevel;
  const ability = actor.system.attributes.spellcasting;
  const score = actor.system.abilities[ability]?.value ?? 10;

  // 1. The heading must still state the caster level. "17th-level wizard"
  //    used to read as no level at all, leaving the sheet to derive nothing.
  //    The Spellbook feature states no level of its own; what it must not do
  //    is state a different one.
  for (const list of lists) {
    if (list.casterLevel === null) continue;
    assert(list.casterLevel === casterLevel,
      `${actor.name} / ${list.feature}: the text states caster level ${list.casterLevel}, the sheet says ${casterLevel}`);
  }
  assert(lists.some(l => l.casterLevel === casterLevel),
    `${actor.name}: no spell feature states the ${casterLevel}th caster level the sheet uses`);

  // 2. A prepared caster prepares caster level + ability modifier.
  const prepared = leveled.filter(g => g.kind !== "reserve").reduce((n, g) => n + g.spells.length, 0);
  const target = Math.max(1, casterLevel + Math.floor((score - 10) / 2));
  assert(prepared === target,
    `${actor.name} prepares ${prepared} leveled spells; a ${casterLevel}th-level caster with ${ability.toUpperCase()} ${score} prepares ${target}`);
  preparedTotal += prepared;
  reserveTotal += leveled.filter(g => g.kind === "reserve").reduce((n, g) => n + g.spells.length, 0);
  cantripTotal += lists.flatMap(l => l.groups).filter(g => g.kind === "cantrip")
    .reduce((n, g) => n + g.spells.length, 0);

  // 3. Nothing above the caster's own ceiling. Mereth Sorn carried finger of
  //    death, a 7th-level spell, on a 10th-level wizard who tops out at 5th.
  const ceiling = MAX_SLOT_LEVEL(casterLevel);
  for (const group of leveled) {
    if (group.kind === "level") {
      assert(group.level <= ceiling,
        `${actor.name}: prepares ${group.level}th-level spells, above the ${ceiling}th-level ceiling of a ${casterLevel}th-level caster`);
    }
    for (const spell of group.spells) {
      const level = spellLevelByName.get(spell);
      if (level === undefined) continue; // an SRD name, checked for existence elsewhere
      assert(level <= ceiling,
        `${actor.name}: "${spell}" is a level ${level} spell, above the ${ceiling}th-level ceiling of a ${casterLevel}th-level caster`);
      if (group.kind === "level") {
        assert(level === group.level,
          `${actor.name}: "${spell}" is listed under ${group.level}th level but is a level ${level} spell`);
      }
    }
  }

  // 4. Order magic is the Order's, in the spellbook as much as in the day's
  //    preparations — a reserve is still a spell the wizard had to be taught.
  const robe = ORDER_WIZARDS[actor.name];
  for (const group of leveled.concat(lists.flatMap(l => l.groups).filter(g => g.kind === "cantrip"))) {
    for (const spell of group.spells) {
      const belongs = robeByName.get(spell);
      if (!belongs) continue;
      assert(Boolean(robe), `${actor.name} carries the Order spell "${spell}" but belongs to no Order`);
      assert(belongs === robe,
        `${actor.name} is a ${robe} Robe but carries "${spell}", which is a ${belongs} Robe spell`);
    }
  }
}
// --- stat blocks must agree with themselves (1.32.0) -----------------------
//
// Astinus of Palanthas claimed he "cannot be killed by any means available to
// the party" and carried AC 10 and 30 hit points, which a Dragonarmy Recruit
// gets through in three rounds, and his hit points were 130 off what his own
// hit dice roll. Two cheap checks across all 81 creatures catch both shapes.
for (const actor of creatures) {
  const formula = (actor.system.attributes.hp.formula ?? "").trim();
  const parsed = /^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/.exec(formula);
  assert(Boolean(parsed), `${actor.name}: hit point formula "${formula}" is not readable`);
  if (parsed) {
    const average = Number(parsed[1]) * ((Number(parsed[2]) + 1) / 2) + Number(parsed[3] ?? 0);
    const stated = actor.system.attributes.hp.max;
    assert(Math.abs(average - stated) <= 5,
      `${actor.name}: ${stated} hit points against a formula of ${formula}, which averages ${average}`);
  }
  const innateText = actor.items.find(i => i.name === "Innate Spellcasting")
    ?.system?.description?.value ?? "";
  const statedDC = /spell save DC (\d+)/.exec(innateText);
  const ability = actor.system.attributes.spellcasting;
  if (statedDC && ability) {
    const cr = actor.system.details.cr;
    const prof = cr >= 29 ? 9 : cr >= 25 ? 8 : cr >= 21 ? 7 : cr >= 17 ? 6
      : cr >= 13 ? 5 : cr >= 9 ? 4 : cr >= 5 ? 3 : 2;
    const expected = 8 + prof + Math.floor((actor.system.abilities[ability].value - 10) / 2);
    assert(Number(statedDC[1]) === expected,
      `${actor.name}: states innate spell save DC ${statedDC[1]}; CR ${cr} and `
      + `${ability.toUpperCase()} ${actor.system.abilities[ability].value} give DC ${expected}`);
  }
}

// Astinus says he cannot be killed, so he must actually be unkillable.
{
  const astinus = creatures.find(c => c.name === "Astinus of Palanthas");
  assert(Boolean(astinus), "Astinus of Palanthas is missing from the bestiary");
  const immune = new Set(astinus.system.traits.di.value);
  for (const type of ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic",
                      "piercing", "poison", "psychic", "radiant", "slashing", "thunder"]) {
    assert(immune.has(type), `Astinus claims he cannot be killed but takes ${type} damage`);
  }
  const text = astinus.items.map(i => i.system?.description?.value ?? "").join(" ");
  assert(/automatically succeeds on every saving throw/.test(text),
    "Astinus must automatically succeed on saving throws; immunity alone leaves him banishable");
  const his = (astinus.flags[MODULE]?.spellcasting ?? []).flatMap(l => l.groups).flatMap(g => g.spells);
  assert(his.length >= 8, `Astinus should carry at least 8 spells, found ${his.length}`);
  for (const forward of ["augury", "divination", "commune", "foresight", "contact other plane"]) {
    assert(!his.includes(forward),
      `Astinus carries ${forward}; he answers nothing about the future`);
  }
}

// --- dragons as innate spellcasters (1.30.0) -------------------------------
//
// The Monster Manual variant, enforced rather than trusted: a dragon of adult
// or older age casts a number of spells equal to its Charisma modifier, each
// once per day, none above one-third its CR rounded down. The allowance comes
// out of the stat block, so a Charisma or CR edit moves it and the build says
// so. Young dragons and wyrmlings must have none — the variant starts at
// adult, and a wyrmling that teleports is a different monster.
const DRAGON_PROFICIENCY = cr => cr >= 29 ? 9 : cr >= 25 ? 8 : cr >= 21 ? 7 : cr >= 17 ? 6
  : cr >= 13 ? 5 : cr >= 9 ? 4 : cr >= 5 ? 3 : 2;
// The three abyssal wyrms are imported verbatim from the GM's own exports and
// are deliberately left as they arrived; see roster-abyssal-wyrms.mjs.
const VERBATIM_DRAGONS = new Set(["Vaelzhar, the Unremembered", "Nythravel, the Upward Shadow", "Kharzoryx, the Blue Pyre"]);
let dragonSpellCount = 0;
let dragonCasters = 0;
for (const actor of creatures) {
  if (actor.system.details.type?.value !== "dragon") continue;
  // True dragons only. Draconians are dragon-type and are not dragons: an
  // aurak's magic is its own trait, not an age-category allowance.
  if (!["Chromatic", "Metallic"].includes(actor.system.details.type?.subtype)) continue;
  if (VERBATIM_DRAGONS.has(actor.name)) continue;
  const adult = /, Adult$|, Ancient$|^Cyan Bloodbane$/.test(actor.name);
  const innate = (actor.flags[MODULE]?.spellcasting ?? [])
    .flatMap(l => l.groups).filter(g => g.kind === "innate");
  const cast = innate.reduce((n, g) => n + g.spells.length, 0);

  if (!adult) {
    assert(cast === 0,
      `${actor.name} is younger than adult and casts ${cast} spells; the variant starts at adult`);
    continue;
  }

  const cr = actor.system.details.cr;
  const charisma = actor.system.abilities.cha.value;
  const allowed = Math.floor((charisma - 10) / 2);
  const maxLevel = Math.floor(cr / 3);
  const dc = 8 + DRAGON_PROFICIENCY(cr) + Math.floor((charisma - 10) / 2);

  assert(cast === allowed,
    `${actor.name}: Charisma ${charisma} allows ${allowed} innate spells, the stat block casts ${cast}`);
  for (const group of innate) {
    assert(group.perDay === 1, `${actor.name}: the variant is 1/day each, found ${group.perDay}/day`);
    for (const spell of group.spells) {
      const level = spellLevelByName.get(spell);
      assert(level !== undefined, `${actor.name}: "${spell}" is not a spell any compendium supplies`);
      assert(level <= maxLevel,
        `${actor.name}: CR ${cr} caps innate spells at level ${maxLevel}, but "${spell}" is level ${level}`);
    }
  }
  const text = actor.items.find(i => i.name === "Innate Spellcasting")?.system?.description?.value ?? "";
  assert(text.includes(`spell save DC ${dc}`),
    `${actor.name}: the innate DC should be ${dc} for CR ${cr} and Charisma ${charisma}`);
  assert(actor.system.attributes.spellcasting === "cha",
    `${actor.name}: innate dragon magic is Charisma-based, found "${actor.system.attributes.spellcasting}"`);
  dragonCasters += 1;
  dragonSpellCount += cast;
}
assert(dragonCasters === 11, `expected 11 adult-or-older dragons casting, found ${dragonCasters}`);
assert(dragonSpellCount === 52, `expected 52 innate dragon spells, found ${dragonSpellCount}`);
assert(creatures.find(c => c.name === "Cyan Bloodbane")?.items
  .some(i => i.system?.description?.value?.includes("<em>dream</em>")),
  "Cyan Bloodbane must be able to cast dream; it is the thing he is famous for");

assert(preparedTotal === 208, `expected 208 prepared leveled spells across the bestiary, found ${preparedTotal}`);
assert(reserveTotal === 133, `expected 133 unprepared spellbook reserves, found ${reserveTotal}`);
assert(cantripTotal === 55, `expected 55 cantrips, found ${cantripTotal}`);

// A reserve is owned, not prepared. Installing it prepared would hand every
// wizard their whole spellbook at once.
assert(installer.includes('group.kind === "reserve" ? 0 : 1'),
  "the installer must attach spellbook reserves unprepared");
assert(installer.includes("cantrip ? 2 :"),
  "cantrips must install as always prepared");

assert(installer.includes('"npc-spells.json", "spells.json"'),
  "the spell lookup must include the module's own robe spells");

assert(unresolvable.size === 0,
  `spells no compendium can supply: ${[...unresolvable].join("; ")}`);
assert(spellListCount >= 14, `expected at least 14 casters with spell lists, found ${spellListCount}`);
assert(spellRefCount >= 120, `expected at least 120 spell references, found ${spellRefCount}`);

// The two paladin spells the SRD does not carry are shipped by the module.
for (const name of ["Crusader's Mantle", "Holy Weapon"]) {
  const spell = localSpells.find(s => s.name === name);
  assert(Boolean(spell), `${name} is missing from content/npc-spells.json`);
  if (!spell) continue;
  assert(spell.type === "spell", `${name}: not a spell Item`);
  assert(!srdSpells.names.map(n => n.toLowerCase()).includes(name.toLowerCase()),
    `${name} is in the SRD after all — the module copy is redundant`);
  assert(spell.system.level >= 1 && spell.system.school,
    `${name}: needs a level and a school`);
  assert(Object.keys(spell.system.activities ?? {}).length > 0,
    `${name}: has nothing to cast`);
  assert(spell.system.source?.rules === "2014", `${name}: must be 2014 rules`);
  assert(/^[A-Za-z0-9]{16}$/.test(spell._id), `${name}: bad document id`);
}

assert(installer.includes("attachCreatureSpells"),
  "the installer does not attach spells to bestiary casters");
assert(installer.includes("dnd5e.spells24"),
  "the spell lookup should fall back to the 2024 pack");
assert(/fromStatBlock/.test(installer),
  "attached spells must be tagged so a reinstall can replace them");


if (errors.length) {
  console.error("Content validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Content validation passed.");
console.log(`${items.length} magic items; ${spells.length} spells; ${legacy.length} Crow legacy items (${legacy.reduce((n, i) => n + Object.keys(i.system.activities).length, 0)} level-gated activities); ${creatures.length} bestiary entries; 32 managed journals / ${EXPECTED_PAGES} pages; detailed Arc II-VI session runbooks; GM-only tracker board above the multi-world calendar; route, Session 0, calendar, compendium, legacy-item and legacy-regression checks passed.`);