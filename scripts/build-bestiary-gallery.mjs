import fs from "node:fs";

/**
 * The illustrated bestiary journal.
 *
 * Generated from content/creatures.json and the art in assets/, so the plates
 * can never list a creature the compendium does not have, or miss one it does.
 * One page per group, each creature shown at its own art with the numbers a GM
 * needs before deciding to drop it on a map.
 *
 * Run after build-creatures.mjs, which is what assigns the art in the first
 * place.
 */

const MODULE_PATH = "modules/wayreth-black-master";
const actors = JSON.parse(fs.readFileSync("content/creatures.json", "utf8")).actors;

const problems = [];

/** How 5e prints a fractional challenge rating. */
function cr(value) {
  if (value === 0.125) return "1/8";
  if (value === 0.25) return "1/4";
  if (value === 0.5) return "1/2";
  return String(value);
}

const SIZES = {
  tiny: "Tiny", sm: "Small", med: "Medium", lg: "Large", huge: "Huge", grg: "Gargantuan"
};

/**
 * What each creature type means in this campaign, in the GM's terms. A type
 * with no note here fails the build rather than shipping an unlabelled plate.
 */
const TYPE_NOTES = {
  "Aberration": {
    blurb: "Silvanesti's nightmare given shape. These are not creatures so much as the "
      + "dream's own furniture, and they behave by dream logic: they are real while the party "
      + "believes them.",
    when: "Arc IV, the Silvanesti expedition."
  },
  "Beast": {
    blurb: "The road's ordinary dangers. Nothing here is a plot, and that is the point \u2014 "
      + "it exists to make the journey feel long.",
    when: "Arc I, the thirty-nine days."
  },
  "Dragon": {
    blurb: "The largest group in the bestiary, and the war itself. It runs from a Baaz "
      + "draconian up to the ancients, because on Krynn the draconians are what became of "
      + "stolen dragon eggs and belong on the same ladder.",
    when: "Draconians from Arc I. Wyrmlings and young from Arc II. Ancients are Arcs V and VI."
  },
  "Fiend": {
    blurb: "What comes through when the boundary is thin \u2014 and, in Arc VI, what is waiting "
      + "on the other side of it. The Herald speaks for Takhisis and should never be fought "
      + "before it has been listened to.",
    when: "Arc III in ones and twos. Arc VI in earnest."
  },
  "Humanoid": {
    blurb: "Everyone the war is being fought by and over: Dragonarmy soldiers, Solamnic "
      + "knights, the Conclave, and the people the campaign is actually about. Most of the "
      + "named stat blocks exist so you know what happens if the party attacks them, not "
      + "because they are meant to be fought.",
    when: "Throughout."
  },
  "Plant": {
    blurb: "Wayreth's forest and Silvanesti's. Both are aware, neither is friendly, and "
      + "neither can be reasoned with by anything the party is carrying.",
    when: "Arc I at the forest edge; Arc IV in the dream."
  },
  "Undead": {
    blurb: "Dargaard's dead, the Returned, and the things in the vaults that did not stay "
      + "where they were put.",
    when: "Arc III onward; the Returned define Arc V."
  }
};

/** Plates run in the order the compendium folders do. */
const TYPE_ORDER = [
  "Aberration", "Beast", "Dragon", "Fiend", "Humanoid", "Plant", "Undead"
];

const byGroup = new Map();
for (const actor of actors) {
  const group = actor.flags["wayreth-black-master"]?.typeFolder;
  if (!group) problems.push(`${actor.name}: no type folder — run build-creatures.mjs first`);
  if (!byGroup.has(group)) byGroup.set(group, []);
  byGroup.get(group).push(actor);
}
for (const [group, members] of byGroup) {
  if (!TYPE_ORDER.includes(group)) problems.push(`type "${group}" has no plate in TYPE_ORDER`);
  if (!TYPE_NOTES[group]) problems.push(`type "${group}" has no description`);
  // Ascending challenge within the plate, matching the compendium folder.
  members.sort((a, b) => {
    const delta = a.system.details.cr - b.system.details.cr;
    return delta !== 0 ? delta : a.name.localeCompare(b.name);
  });
  for (let i = 1; i < members.length; i++) {
    if (members[i].system.details.cr < members[i - 1].system.details.cr) {
      problems.push(`${group}: plate is not in ascending CR order`);
    }
  }
}
for (const group of TYPE_ORDER) {
  if (!byGroup.has(group)) problems.push(`TYPE_ORDER lists "${group}", which has no creatures`);
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** One illustrated entry. */
function plate(actor) {
  const system = actor.system;
  const size = SIZES[system.traits.size] ?? system.traits.size;
  const type = system.details.type.value;
  const hp = system.attributes.hp.max;
  const ac = system.attributes.ac.flat;
  if (!actor.img?.startsWith(`${MODULE_PATH}/assets/`)) {
    problems.push(`${actor.name}: portrait is not module art (${actor.img})`);
  }
  return `<figure class="wy-plate">`
    + `<img src="${esc(actor.img)}" alt="${esc(actor.name)}">`
    + `<figcaption><strong>${esc(actor.name)}</strong>`
    + `<span class="wy-plate-stats">CR ${cr(system.details.cr)} &middot; AC ${ac} &middot; `
    + `${hp} hp &middot; ${esc(size)} ${esc(type)}</span>`
    + `</figcaption></figure>`;
}

function groupPage(group) {
  const members = byGroup.get(group);
  const note = TYPE_NOTES[group];
  const crs = members.map(a => a.system.details.cr);
  const html = [];
  html.push(`<p class="wy-lead">${note.blurb}</p>`);
  html.push(`<p><strong>${members.length} creature${members.length === 1 ? "" : "s"}</strong> `
    + `&middot; CR ${cr(Math.min(...crs))}&ndash;${cr(Math.max(...crs))} &middot; `
    + `<strong>When:</strong> ${note.when}</p>`);
  html.push(`<p>Every one of these is a real Actor in <strong>Wayreth — Bestiary</strong>. `
    + `Drag it onto a scene and it arrives with this art, a token scaled to its size, and its `
    + `attacks ready to roll.</p>`);
  html.push(`<div class="wy-gallery">${members.map(plate).join("")}</div>`);
  return { name: group, html: html.join("\n") };
}

const index = [];
index.push(`<p class="wy-lead">Every creature in the bestiary, with its art, so you can show `
  + `the table what they are looking at instead of describing it.</p>`);
index.push(`<p>${actors.length} creatures across ${TYPE_ORDER.length} creature types, each plate `
  + `running from the weakest to the strongest. Each entry carries the numbers worth `
  + `knowing before you commit to an encounter &mdash; challenge `
  + `rating, armour class, hit points, size and type. The full stat block lives on the Actor `
  + `itself in <strong>Wayreth — Bestiary</strong>.</p>`);
index.push(`<table class="wy-table"><thead><tr><th>Plate</th><th>Creatures</th>`
  + `<th>CR</th><th>When</th></tr></thead><tbody>`
  + TYPE_ORDER.map(group => {
    const members = byGroup.get(group);
    const crs = members.map(a => a.system.details.cr);
    return `<tr><td><strong>${esc(group)}</strong></td><td>${members.length}</td>`
      + `<td>${cr(Math.min(...crs))}&ndash;${cr(Math.max(...crs))}</td>`
      + `<td>${esc(TYPE_NOTES[group].when)}</td></tr>`;
  }).join("")
  + `</tbody></table>`);
index.push(`<h3>Showing These to Players</h3>`);
index.push(`<p>The plates are ordinary journal images, so right-clicking one and choosing to `
  + `show it to players works as it does anywhere else. The art has a transparent background, `
  + `which is why the tokens sit cleanly on a map rather than arriving in a box.</p>`);
index.push(`<p>Nothing here spoils anything by itself, but the <strong>Humanoid</strong> plate `
  + `runs from a Dragonarmy recruit up through the Conclave to Raistlin, which makes it the `
  + `cast list for the whole campaign. It is the one page worth keeping to yourself.</p>`);

const journal = {
  name: "The Wayreth Bestiary: Illustrated",
  pages: [{ name: "The Plates", html: index.join("\n") }, ...TYPE_ORDER.map(groupPage)]
};

if (problems.length) {
  console.error(`Bestiary gallery build failed with ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

fs.writeFileSync("content/bestiary-gallery.json", `${JSON.stringify(journal, null, 2)}\n`);
console.log(`Wrote content/bestiary-gallery.json`);
console.log(`  ${journal.pages.length} pages, ${actors.length} illustrated entries`);
for (const group of TYPE_ORDER) {
  console.log(`  ${group.padEnd(20)} ${String(byGroup.get(group).length).padStart(2)}`);
}
