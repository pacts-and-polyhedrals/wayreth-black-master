/**
 * Compiles content/scenes.json from the scene plan and the generated map
 * geometry.
 *
 * The maps and their walls come out of the same declaration (tools/make-maps.py
 * writes build/map-geometry.json as it renders), so a wall a token collides
 * with is a wall a player can see. Nothing here traces geometry over a finished
 * image.
 *
 * What this cannot do is resolve IDs. A scene's tokens point at bestiary actors
 * and its notes point at journal pages, and neither exists until the module
 * installs into a world. So those are emitted as names and resolved by
 * scripts/wayreth-journals.mjs at install time — the same way creature spells
 * already resolve.
 *
 *     node scripts/build-scenes.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { SCENES, ARC_FOLDERS, generatorPlan } from "./lib/scene-plan.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const GEOMETRY = path.join(ROOT, "build", "map-geometry.json");
const OUT = path.join(ROOT, "content", "scenes.json");
const PX = 100;

const geometry = fs.existsSync(GEOMETRY)
  ? JSON.parse(fs.readFileSync(GEOMETRY, "utf8"))
  : {};

/** A 16-character alphanumeric id, which is what DocumentIdField demands. */
function docId(seed) {
  let h = 0x811c9dc5;
  let out = "";
  for (const ch of seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  let x = h;
  while (out.length < 16) {
    x = Math.imul(x ^ (x >>> 15), 0x2545f491) >>> 0;
    out += x.toString(36).replace(/[^a-z0-9]/g, "");
  }
  return out.slice(0, 16);
}

/**
 * Foundry moved wall sense flags around between v10 and v12 but kept the
 * numeric values, so plain numbers travel across the whole supported range.
 */
function wall(seg, { door = 0 } = {}) {
  return {
    c: seg.map(Math.round),
    move: 20,        // CONST.WALL_MOVEMENT_TYPES.NORMAL
    sight: 20,
    sound: 20,
    light: 20,
    dir: 0,
    door,            // 0 none, 1 door
    ds: 0,           // closed
    threshold: { light: null, sight: null, sound: null, attenuation: false }
  };
}

function lightDoc(L) {
  return {
    x: Math.round(L.x),
    y: Math.round(L.y),
    rotation: 0,
    walls: true,
    vision: false,
    config: {
      negative: false,
      priority: 0,
      alpha: Math.min(0.9, L.alpha ?? 0.4),
      angle: 360,
      bright: L.bright ?? 3,
      color: L.colour ?? "#ffd9a0",
      coloration: 1,
      dim: L.dim ?? 8,
      attenuation: 0.6,
      luminosity: 0.5,
      saturation: 0,
      contrast: 0,
      shadows: 0,
      animation: { type: null, speed: 5, intensity: 5, reverse: false },
      darkness: { min: 0, max: 1 }
    },
    hidden: false
  };
}

/**
 * A map pin. Foundry v12 renamed the note icon to a texture, so both shapes
 * are written and whichever the running version reads finds what it needs.
 */
function note(id, { x, y, text, journalKey, pageName, order }) {
  return {
    _id: id,
    entryId: null,              // resolved at install
    pageId: null,               // resolved at install
    x: Math.round(x),
    y: Math.round(y),
    texture: { src: "icons/svg/book.svg", tint: "#c9a227", scaleX: 1, scaleY: 1 },
    icon: "icons/svg/book.svg",
    iconSize: 48,
    iconTint: "#c9a227",
    text,
    fontFamily: "Signika",
    fontSize: 28,
    textAnchor: 1,
    textColor: "#f0e6d2",
    global: false,
    flags: {
      "wayreth-black-master": { journalKey, pageName, order }
    }
  };
}

function tokenDoc(id, { actor, x, y }) {
  return {
    _id: id,
    name: actor,
    actorName: actor,           // resolved at install
    actorId: null,
    actorLink: false,
    x: Math.round(x),
    y: Math.round(y),
    hidden: true,               // the GM reveals; nobody wants a spoiled map
    disposition: -1,
    displayName: 20,
    displayBars: 40,
    flags: { "wayreth-black-master": { placed: true } }
  };
}

const problems = [];
const scenes = [];
let pinTotal = 0;
let tokenTotal = 0;

for (const [index, plan] of SCENES.entries()) {
  const geo = geometry[plan.id];
  if (plan.archetype && !geo) {
    problems.push(`${plan.id}: no generated geometry — run tools/make-maps.py first`);
    continue;
  }
  const cols = geo?.cols ?? plan.cols;
  const rows = geo?.rows ?? plan.rows;
  const regions = geo?.regions ?? {};
  const image = plan.image ?? `assets/maps/${plan.id}.webp`;
  if (!fs.existsSync(path.join(ROOT, image))) {
    problems.push(`${plan.id}: map image missing at ${image}`);
  }

  // Pins, placed on the named region of the map they belong to.
  const notes = plan.pins.map((pin, i) => {
    const anchor = regions[pin.at];
    if (!anchor && plan.archetype) {
      problems.push(`${plan.id}: pin ${i + 1} wants region "${pin.at}", which this `
        + `${plan.archetype} map does not have (${Object.keys(regions).join(", ") || "none"})`);
    }
    // Fan pins that share an anchor so they do not stack into one icon.
    const sharing = plan.pins.filter(p => p.at === pin.at);
    const slot = sharing.indexOf(pin);
    const spread = sharing.length > 1 ? (slot - (sharing.length - 1) / 2) * PX * 1.1 : 0;
    const base = anchor ?? { x: (cols * PX) / 2, y: (rows * PX) / 2 };
    const label = pin.label ?? (pin.beat ? `${pin.beat}. ${pin.section ?? ""}`.trim() : pin.section);
    pinTotal += 1;
    return note(docId(`${plan.id}-pin-${i}`), {
      x: base.x + spread,
      y: base.y,
      text: label || `Beat ${i + 1}`,
      journalKey: plan.arc === "vingard" ? "vingard-road" : plan.arc,
      pageName: pin.session,
      order: i + 1
    });
  });

  // Tokens, dropped on their region with any declared offset in squares.
  const tokens = (plan.tokens ?? []).map((t, i) => {
    const anchor = regions[t.at] ?? { x: (cols * PX) / 2, y: (rows * PX) / 2 };
    if (!regions[t.at] && plan.archetype) {
      problems.push(`${plan.id}: token "${t.actor}" wants region "${t.at}", which does not exist`);
    }
    const [ox, oy] = t.offset ?? [0, 0];
    tokenTotal += 1;
    return tokenDoc(docId(`${plan.id}-token-${i}`), {
      actor: t.actor,
      x: anchor.x + ox * PX - PX / 2,
      y: anchor.y + oy * PX - PX / 2
    });
  });

  scenes.push({
    _id: docId(`scene-${plan.id}`),
    key: plan.id,
    name: plan.name,
    arc: plan.arc,
    navigation: true,
    navOrder: index * 10,
    navName: plan.name.split("·").pop().trim(),
    background: { src: image },
    img: image,
    width: cols * PX,
    height: rows * PX,
    padding: 0.08,
    initial: null,
    backgroundColor: "#0b0a0d",
    grid: {
      type: plan.grid === false ? 0 : 1,
      size: PX,
      distance: 5,
      units: "ft",
      alpha: 0.18,
      color: "#000000"
    },
    tokenVision: plan.grid !== false,
    fogExploration: plan.grid !== false,
    globalLight: plan.darkness < 0.5,
    darkness: plan.darkness ?? 0,
    environment: { darknessLevel: plan.darkness ?? 0, globalLight: { enabled: plan.darkness < 0.5 } },
    walls: [
      ...(geo?.walls ?? []).map(seg => wall(seg)),
      ...(geo?.doors ?? []).map(seg => wall(seg, { door: 1 }))
    ],
    lights: (geo?.lights ?? []).map(lightDoc),
    notes,
    tokens,
    flags: {
      "wayreth-black-master": {
        sceneKey: plan.id,
        arc: plan.arc,
        summary: plan.summary,
        next: plan.next ?? null,
        spawn: geo?.spawn ?? [],
        linkCalendar: true
      }
    }
  });
}

// Chaining must actually chain: a scene cannot point at a sibling that is not
// in the plan, and only the last scene of the sequence may point at nothing.
const keys = new Set(SCENES.map(s => s.id));
for (const plan of SCENES) {
  if (plan.next && !keys.has(plan.next)) {
    problems.push(`${plan.id}: next scene "${plan.next}" is not in the plan`);
  }
}

if (problems.length) {
  console.error("Scene build failed:\n- " + problems.join("\n- "));
  process.exit(1);
}

const doc = {
  name: "Wayreth Scenes",
  folders: ARC_FOLDERS,
  scenes
};
fs.writeFileSync(OUT, `${JSON.stringify(doc, null, 1)}\n`);

const walls = scenes.reduce((n, s) => n + s.walls.length, 0);
const lights = scenes.reduce((n, s) => n + s.lights.length, 0);
console.log(`${scenes.length} scenes: ${pinTotal} pins, ${tokenTotal} tokens, `
  + `${walls} walls, ${lights} lights -> content/scenes.json`);
