import fs from "node:fs";
import { definition as alice } from "./lib/legacy-alice.mjs";
import { definition as solanthis } from "./lib/legacy-solanthis.mjs";
import { definition as jinx } from "./lib/legacy-jinx.mjs";
import { definition as sylas } from "./lib/legacy-sylas.mjs";
import { definition as clipper } from "./lib/legacy-clipper.mjs";
import { definition as kattal } from "./lib/legacy-kattal.mjs";
import {
  TIERS, TIER_ORDER, activity, bandLabel, costLabels, inline, renderBlocks, statLine
} from "./lib/legacy.mjs";

/**
 * Player reference journals, one per legacy item.
 *
 * These are rendered from the same definitions the items are built from, so a
 * feature cannot be changed on the item and left stale on the reference sheet.
 * Everything a player reads here — the level bands, the charge table, what each
 * feature costs and which action it takes — is read back off the built
 * activities rather than written out a second time by hand.
 */

const DEFINITIONS = [alice, solanthis, jinx, sylas, clipper, kattal];

const DC_LABELS = {
  spellcasting: "8 + proficiency bonus + spellcasting ability modifier",
  str: "8 + proficiency bonus + Strength modifier",
  dex: "8 + proficiency bonus + Dexterity modifier",
  con: "8 + proficiency bonus + Constitution modifier",
  int: "8 + proficiency bonus + Intelligence modifier",
  wis: "8 + proficiency bonus + Wisdom modifier",
  cha: "8 + proficiency bonus + Charisma modifier"
};

const RARITY_LABELS = {
  uncommon: "Uncommon", rare: "Rare", veryRare: "Very Rare", legendary: "Legendary"
};

const problems = [];

/** Rebuilds the activity list for a definition, keyed by name. */
function activitiesByName(def) {
  const map = new Map();
  for (const act of def.activities) {
    if (map.has(act.name)) problems.push(`${def.name}: two activities called ${act.name}`);
    map.set(act.name, act);
  }
  return map;
}

/** Splits a tier's blocks into { header, body } groups. */
function features(def, tierKey) {
  const blocks = def.tiers[tierKey].blocks;
  const groups = [];
  for (const block of blocks) {
    if (block && typeof block === "object" && block.h) {
      groups.push({ head: block, body: [] });
    } else if (groups.length) {
      groups.at(-1).body.push(block);
    } else {
      problems.push(`${def.name} / ${tierKey}: prose appears before any feature heading`);
    }
  }
  return groups;
}

const PASSIVE_NOTES = {
  true: "Always on. Nothing to click and nothing to spend.",
  effect: "Always on, handled by an effect on the item. Nothing to click.",
  conditional: "Always on while the conditions below are met. Nothing to spend.",
  manual: "Always on <em>once the item awakens</em> — but it ships switched off, because a "
    + "passive like this cannot read your level the way the charge pool does. Ask your DM to "
    + "enable it in the item's Effects tab."
};

function renderFeature(def, group, acts) {
  const { head, body } = group;
  const html = [`<h4>${inline(head.h)}</h4>`];

  if (head.passive) {
    const note = PASSIVE_NOTES[String(head.passive)];
    if (!note) problems.push(`${def.name} / ${head.h}: unknown passive kind ${head.passive}`);
    html.push(`<p class="wy-cost"><strong>Passive.</strong> ${note ?? ""}</p>`);
  } else if (head.act) {
    const names = Array.isArray(head.act) ? head.act : [head.act];
    for (const name of names) {
      const act = acts.get(name);
      if (!act) {
        problems.push(`${def.name} / ${head.h}: no activity called "${name}"`);
        continue;
      }
      // Name the activity whenever it is not called what the heading is called,
      // so a player can match this page to the buttons on their sheet.
      const label = (names.length > 1) || (act.name !== head.h)
        ? `<strong>${inline(act.name)}.</strong> ` : "";
      html.push(`<p class="wy-cost">${label}${statLine(act, { dcLabel: null })}</p>`);
    }
  } else {
    // Unmarked headings fall back to an activity of the same name, which is the
    // common case; anything else is a drift bug and is reported.
    const act = acts.get(head.h);
    if (!act) problems.push(`${def.name} / ${head.h}: heading is neither passive nor an activity`);
    else html.push(`<p class="wy-cost">${statLine(act, { dcLabel: null })}</p>`);
  }

  html.push(renderBlocks(body));
  return html.join("\n");
}

function quickReference(def, acts) {
  const dcLabel = DC_LABELS[def.dc];
  if (!dcLabel) problems.push(`${def.name}: no DC label for ${def.dc}`);
  const period = def.recoveryPeriod ?? "dawn";

  const html = [`<p class="wy-lead">${inline(def.player.summary)}</p>`];
  html.push(`<p><em>${inline(def.subtitle)}</em></p>`);

  html.push(`<h3>Your Charges</h3>`);
  html.push(`<p>The ${inline(def.chargeName)} pool grows on its own at 6th, 10th and 15th level. `
    + `You never have to update the sheet — the number just changes.</p>`);
  html.push(`<table class="wy-table"><tr><th>State</th><th>Your level</th>`
    + `<th>${inline(def.chargeName)}</th><th>Back at ${period}</th></tr>`
    + TIER_ORDER.map(key => {
      const t = TIERS[key];
      return `<tr><td>${t.label}</td><td>${bandLabel(key)}</td><td>${t.charges}</td>`
        + `<td>${t.regain}</td></tr>`;
    }).join("")
    + `</table>`);
  html.push(`<p>At Dormant and Awakened every spent charge comes back. From 10th level it stops `
    + `refilling completely: the pool is bigger, and a heavy day stays expensive into the next `
    + `one.</p>`);

  html.push(`<h3>Legacy Save DC</h3>`);
  html.push(`<p>Where a feature makes something roll a saving throw, the DC is `
    + `<strong>${dcLabel}</strong>. It comes off your sheet, so it rises as you do.</p>`);

  html.push(`<h3>What Unlocks When</h3>`);
  html.push(`<p>Features arrive on their own. Below its level a feature is not on the item at `
    + `all, so anything you can see on the sheet is something you can use. Where a later state `
    + `improves an earlier feature, the old version disappears and the new one takes its `
    + `place.</p>`);
  for (const key of TIER_ORDER) {
    const t = TIERS[key];
    const names = features(def, key).map(g => g.head.h);
    html.push(`<p><strong>${t.label} — ${bandLabel(key)}`
      + ` (${RARITY_LABELS[t.rarity]}):</strong> ${names.map(n => inline(n)).join("; ")}.</p>`);
  }

  const manualPassive = TIER_ORDER.flatMap(key => features(def, key))
    .filter(g => g.head.passive === "manual").map(g => g.head.h);
  const manualUses = def.activities
    .filter(a => a.uses.max && !a.uses.recovery.length)
    .map(a => a.name);
  if (manualPassive.length || manualUses.length) {
    html.push(`<h3>The Part That Is Not Automatic</h3>`);
    if (manualPassive.length) {
      html.push(`<p><strong>${manualPassive.map(n => inline(n)).join(", ")}</strong> ships `
        + `switched off on the item. When the item awakens, ask your DM to enable it in the `
        + `Effects tab — a passive like this cannot read your level the way the charge pool `
        + `can.</p>`);
    }
    if (manualUses.length) {
      html.push(`<p><strong>${manualUses.map(n => inline(n)).join(", ")}</strong> has no `
        + `automatic recharge at all, because it does not come back on a rest. Once it is spent `
        + `it stays spent until your DM clears it.</p>`);
    }
  }

  html.push(`<h3>Advancing</h3>`);
  html.push(`<p>Reaching the level makes the next state <em>possible</em>. What actually wakes `
    + `the item is the moment named at the top of each state below — a choice, not an `
    + `achievement, and never something you can win in a fight. You do not need to chase it. `
    + `When it happens, you will know, and so will the item.</p>`);
  return html.join("\n");
}

function tierPage(def, key, acts) {
  const t = TIERS[key];
  const section = def.tiers[key];
  const html = [];
  html.push(`<p class="wy-lead">${RARITY_LABELS[t.rarity]} · ${bandLabel(key)} · `
    + `${t.charges} ${inline(def.chargeName)}, ${inline(section.recovery)}</p>`);
  if (section.trigger) {
    html.push(`<p><strong>What wakes it.</strong> ${inline(section.trigger)}</p>`);
  } else {
    html.push(`<p><strong>Where it starts.</strong> This is the item as you first receive it. `
      + `Everything below is yours from the moment you attune.</p>`);
  }
  html.push(`<p>Everything from earlier states still works unless a feature here says it `
    + `replaces one.</p>`);
  for (const group of features(def, key)) html.push(renderFeature(def, group, acts));
  return html.join("\n");
}

function playingItWell(def) {
  const html = [`<p class="wy-lead">${inline(def.player.summary)}</p>`];
  html.push(`<h3>At the Table</h3><ul>`
    + def.player.tips.map(tip => `<li>${inline(tip)}</li>`).join("")
    + `</ul>`);
  html.push(`<h3>Questions That Come Up</h3>`);
  for (const { q, a } of def.player.rulings) {
    html.push(`<p><strong>${inline(q)}</strong><br>${inline(a)}</p>`);
  }
  html.push(`<h3>If Something Here Disagrees With the Item</h3>`);
  html.push(`<p>The item on your sheet is the rules. This journal is generated from the same `
    + `source, so the two should never differ — but if they do, the item wins and your DM `
    + `should know.</p>`);
  return html.join("\n");
}

const written = [];
for (const def of DEFINITIONS) {
  const acts = activitiesByName(def);
  const claimed = new Set();
  for (const key of TIER_ORDER) {
    for (const group of features(def, key)) {
      const names = group.head.passive ? []
        : Array.isArray(group.head.act) ? group.head.act
        : [group.head.act ?? group.head.h];
      for (const n of names) claimed.add(n);
    }
  }
  // Every activity must be reachable from the prose, or a player reading this
  // journal would never learn a feature exists.
  for (const name of acts.keys()) {
    if (!claimed.has(name)) problems.push(`${def.name}: activity "${name}" is in no journal section`);
  }

  const pages = [{ name: "Quick Reference", html: quickReference(def, acts) }];
  for (const key of TIER_ORDER) {
    pages.push({
      name: `${bandLabel(key).replace(/^level/, "Level")} — ${TIERS[key].label}`,
      html: tierPage(def, key, acts)
    });
  }
  pages.push({ name: "Playing It Well", html: playingItWell(def) });

  const journal = { name: `${def.bearer} — ${def.name}`, pages };
  const file = `legacy-player-${def.bearer.toLowerCase()}.json`;
  fs.writeFileSync(`content/${file}`, `${JSON.stringify(journal, null, 2)}\n`);
  written.push({ file, name: journal.name, pages: pages.length });
}

if (problems.length) {
  console.error(`Legacy journal build failed with ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`Wrote ${written.length} player reference journals `
  + `(${written.reduce((n, w) => n + w.pages, 0)} pages):`);
for (const w of written) console.log(`  ${w.file.padEnd(30)} ${w.name} (${w.pages} pages)`);
console.log("\nRegister these in CONTENT_FILES, SOURCE_FILE_BY_NAME and ownershipFor:");
console.log(written.map(w => `  "${w.file}",`).join("\n"));
