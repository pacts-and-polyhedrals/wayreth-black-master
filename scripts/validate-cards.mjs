import fs from "node:fs";
import path from "node:path";

/**
 * Regression test for the legacy chat cards.
 *
 * dnd5e builds an activity's usage card from the *item's* description, so a
 * legacy item — whose description carries all four states — printed its entire
 * self every time a single feature was used. `trimLegacyUsageCard` rebuilds the
 * card around the feature that was actually used, and this exercises it against
 * every activity on every legacy item.
 *
 * It needs a DOM. If one is not installed the check skips rather than fails, so
 * `npm run validate:all` still works on a bare checkout:
 *
 *     npm install --no-save linkedom
 */

const ROOT = path.resolve(import.meta.dirname, "..");
const MODULE = "wayreth-black-master";

let parseHTML;
try {
  ({ parseHTML } = await import("linkedom"));
} catch {
  console.log("Card validation skipped: linkedom is not installed.");
  console.log("  npm install --no-save linkedom && npm run validate:cards");
  process.exit(0);
}

class TestDOMParser {
  parseFromString(html) {
    // Foundry runs in a browser, where parseFromString wraps a fragment in a
    // full document. linkedom does not, so the shim supplies the wrapper.
    return parseHTML(`<!doctype html><html><head></head><body>${html}</body></html>`).document;
  }
}
globalThis.DOMParser = TestDOMParser;

// Load the real function out of the shipped module rather than a copy of it.
const installer = fs.readFileSync(path.join(ROOT, "scripts", "wayreth-journals.mjs"), "utf8");
const start = installer.indexOf("function trimLegacyUsageCard");
if (start < 0) {
  console.error("Card validation failed: trimLegacyUsageCard is not in the installer.");
  process.exit(1);
}
const end = installer.indexOf("\n}\n", start) + 3;
const { trimLegacyUsageCard } = await import("data:text/javascript," + encodeURIComponent(
  `const MODULE = ${JSON.stringify(MODULE)};\n`
  + installer.slice(start, end)
  + "\nexport { trimLegacyUsageCard };"));

/** The markup dnd5e 5.3.3 renders from templates/chat/activity-card.hbs. */
function renderCard(item, act) {
  return `<div class="chat-card activation-card">`
    + `<section class="card-header description collapsible">`
    + `<header class="summary"><img class="gold-icon" src="${item.img}" alt="${item.name}">`
    + `<div class="name-stacked border"><span class="title">${item.name}</span>`
    + `<span class="subtitle">${act.description.chatFlavor}</span></div>`
    + `<i class="fa-solid fa-chevron-down fa-fw" inert></i></header>`
    + `<section class="details collapsible-content card-content">`
    + `<div class="wrapper">${item.system.description.value}</div></section></section>`
    + `<div class="card-buttons"><button type="button"><span>Use</span></button></div>`
    + (act.activation.condition
      ? `<p class="supplement"><strong>Trigger</strong> ${act.activation.condition}</p>` : "")
    + `</div>`;
}

const items = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content", "legacy-items.json"), "utf8")).items;
const errors = [];
let checked = 0;
let largest = 0;
let fullest = 0;

for (const item of items) {
  for (const act of Object.values(item.system.activities)) {
    const where = `${item.name} / ${act.name}`;
    const before = renderCard(item, act);
    const config = { data: { content: before } };
    const activity = {
      name: act.name,
      description: { chatFlavor: act.description.chatFlavor },
      item: { name: item.name, getFlag: (m, k) => (m === MODULE ? item.flags[m]?.[k] : undefined) }
    };
    trimLegacyUsageCard(activity, config);
    const after = config.data.content;
    const doc = new TestDOMParser().parseFromString(after);

    if (doc.querySelector(".name-stacked .title")?.textContent !== act.name) {
      errors.push(`${where}: the card is not titled with the feature used`);
    }
    if (doc.querySelector(".name-stacked .subtitle")?.textContent !== item.name) {
      errors.push(`${where}: the subtitle is not the item it came from`);
    }
    if (!doc.querySelector(".card-buttons button")) errors.push(`${where}: buttons were lost`);
    if (act.activation.condition && !doc.querySelector(".supplement")) {
      errors.push(`${where}: the trigger line was lost`);
    }
    const body = doc.querySelector(".card-content .wrapper")?.innerHTML ?? "";
    if (body.trim() !== act.description.chatFlavor.trim()) {
      errors.push(`${where}: the body is not this feature's own text`);
    }
    if (/Vault Record|Legacy Save DC|How this item works/.test(after)) {
      errors.push(`${where}: the whole item is still on the card`);
    }
    if (after.length >= before.length) errors.push(`${where}: the card did not get smaller`);

    largest = Math.max(largest, after.length);
    fullest = Math.max(fullest, before.length);
    checked += 1;
  }
}

// A card from any other item must come back byte-for-byte unchanged.
const sample = items[0];
const sampleAct = Object.values(sample.system.activities)[0];
const untouched = renderCard(sample, sampleAct);
const passthrough = { data: { content: untouched } };
trimLegacyUsageCard({
  name: sampleAct.name,
  description: { chatFlavor: sampleAct.description.chatFlavor },
  item: { name: "An ordinary sword", getFlag: () => undefined }
}, passthrough);
if (passthrough.data.content !== untouched) {
  errors.push("a non-legacy item's card was modified");
}

// A malformed card must be left alone rather than throwing mid-activation.
for (const junk of ["", "<p>not a card</p>", "<div class='chat-card'></div>"]) {
  const broken = { data: { content: junk } };
  trimLegacyUsageCard({
    name: sampleAct.name,
    description: { chatFlavor: "<p>x</p>" },
    item: { name: sample.name, getFlag: (m, k) => (m === MODULE ? sample.flags[m]?.[k] : undefined) }
  }, broken);
  if (broken.data.content !== junk) errors.push(`unexpected card markup was rewritten: ${junk}`);
}

if (errors.length) {
  console.error("Card validation failed:");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log("Card validation passed.");
console.log(`${checked} legacy activities: every card carries only the feature used `
  + `(largest ${largest} chars, against ${fullest} for the untrimmed item).`);
