/**
 * Scenes, map pins and player handouts.
 *
 * The module ships maps with their walls, lights, journal pins and encounter
 * tokens already laid out, but none of those can be baked into the shipped
 * JSON: a pin points at a journal page and a token points at an actor, and
 * neither exists until the module installs into a world. So the content files
 * carry names, and this resolves them here, the same way creature spells
 * already resolve.
 *
 * The handouts are the other half. Every scene pin has a player-facing card,
 * and those cards live in their own file and their own documents — never in
 * the GM journal. A GM clicks a pin and reads the session page; a GM clicks
 * Send and the players get the card. There is no path by which the first
 * becomes the second, which is the point: the separation is structural rather
 * than a matter of being careful.
 */

const MODULE = "wayreth-black-master";
const FOLDER_COLOUR = "#4a2d5e";

/* -------------------------------------------------------------------------- */
/*  Loading                                                                     */
/* -------------------------------------------------------------------------- */

async function loadJson(file) {
  const response = await fetch(`modules/${MODULE}/content/${file}`);
  if (!response.ok) throw new Error(`Could not load ${file} (${response.status})`);
  return response.json();
}

let handoutIndex = null;

/** Player cards, keyed "sceneKey#pinOrder". */
async function loadHandouts() {
  if (handoutIndex) return handoutIndex;
  const { handouts } = await loadJson("handouts.json");
  handoutIndex = new Map(handouts.map(h => [`${h.scene}#${h.pin}`, h]));
  return handoutIndex;
}

/* -------------------------------------------------------------------------- */
/*  Folders                                                                     */
/* -------------------------------------------------------------------------- */

async function getOrCreateSceneFolder(name) {
  const existing = game.folders.find(f => f.type === "Scene" && f.name === name
    && f.getFlag(MODULE, "sceneFolder"));
  if (existing) return existing;
  return Folder.create({
    name, type: "Scene", color: FOLDER_COLOUR, sorting: "m",
    flags: { [MODULE]: { sceneFolder: true } }
  });
}

/* -------------------------------------------------------------------------- */
/*  Resolution                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Turn a shipped note into a real one by finding the journal page it names.
 * A pin whose page cannot be found is reported rather than dropped: a pin that
 * silently opens nothing is worse than one that is missing.
 */
function resolveNotes(scene, journalsByFile, unresolved) {
  return scene.notes.map(note => {
    const { journalKey, pageName } = note.flags[MODULE];
    const journal = journalsByFile.get(`${journalKey}.json`);
    const page = journal?.pages?.find(p => p.name === pageName);
    if (!page) {
      unresolved.push(`${scene.name}: pin "${note.text}" → ${journalKey} / ${pageName}`);
      return null;
    }
    const { _id, ...rest } = note;
    return { ...rest, entryId: journal.id, pageId: page.id };
  }).filter(Boolean);
}

function resolveTokens(scene, actorsByName, unresolved) {
  return scene.tokens.map(token => {
    const actor = actorsByName.get(token.actorName);
    if (!actor) {
      unresolved.push(`${scene.name}: token "${token.actorName}"`);
      return null;
    }
    const { _id, actorName, ...rest } = token;
    const proto = actor.prototypeToken ?? {};
    return {
      ...rest,
      name: actor.name,
      actorId: actor.id,
      texture: { src: actor.prototypeToken?.texture?.src ?? actor.img },
      width: proto.width ?? 1,
      height: proto.height ?? 1,
      sight: proto.sight ?? { enabled: false }
    };
  }).filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/*  Install                                                                     */
/* -------------------------------------------------------------------------- */

export async function installScenes({ notify = true, force = false } = {}) {
  if (!game.user.isGM) return 0;

  const source = await loadJson("scenes.json");
  await loadHandouts();

  // Journals and actors the pins and tokens point at.
  const journalsByFile = new Map();
  for (const journal of game.journal) {
    const file = journal.getFlag(MODULE, "sourceFile");
    if (file) journalsByFile.set(file, journal);
  }
  const actorsByName = new Map();
  const pack = game.packs.get(`world.wayreth-creatures`);
  if (pack) {
    const documents = await pack.getDocuments();
    for (const actor of documents) actorsByName.set(actor.name, actor);
  }
  for (const actor of game.actors) if (!actorsByName.has(actor.name)) actorsByName.set(actor.name, actor);

  const folders = new Map();
  for (const folder of source.folders) {
    folders.set(folder.key, await getOrCreateSceneFolder(folder.name));
  }

  const unresolved = [];
  const created = [];
  const updated = [];

  for (const entry of source.scenes) {
    const existing = game.scenes.find(s => s.getFlag(MODULE, "sceneKey") === entry.key);
    // A GM who has moved tokens or drawn on a scene keeps it unless they ask
    // for a rebuild. Pins are rebuilt because a journal's ids change on a
    // reinstall and a stale pin opens nothing; tokens, drawings and lighting
    // tweaks are left exactly as found.
    if (existing && !force) {
      const notes = resolveNotes(entry, journalsByFile, unresolved);
      // Our own pins, found by flag. Read the flags object directly as well as
      // through getFlag: optional-chaining a missing getFlag returns undefined
      // silently, which would leave every old pin in place and double them.
      const mine = n => (n.flags?.[MODULE]?.order ?? n.getFlag?.(MODULE, "order")) !== undefined;
      const stale = (existing.notes ?? []).filter(mine).map(n => n.id);
      if (stale.length) await existing.deleteEmbeddedDocuments("Note", stale);
      if (notes.length) await existing.createEmbeddedDocuments("Note", notes);
      await existing.update({ flags: { [MODULE]: { ...entry.flags[MODULE] } } });
      updated.push(existing.name);
      continue;
    }
    if (existing) await existing.delete();

    const { _id, key, arc, img, tokens, notes, ...rest } = entry;
    const data = {
      ...rest,
      folder: folders.get(arc)?.id ?? null,
      background: { src: `modules/${MODULE}/${img}` },
      notes: resolveNotes(entry, journalsByFile, unresolved),
      tokens: resolveTokens(entry, actorsByName, unresolved),
      flags: { [MODULE]: { ...entry.flags[MODULE] } }
    };
    // Scene walls arrive as plain objects; Foundry fills in the rest.
    created.push(await Scene.create(data));
  }

  if (notify) {
    const parts = [];
    if (created.length) parts.push(`${created.length} created`);
    if (updated.length) parts.push(`${updated.length} refreshed`);
    ui.notifications.info(`Wayreth scenes: ${parts.join(", ") || "nothing to do"}.`);
  }
  if (unresolved.length) {
    console.warn(`${MODULE} | unresolved scene references`, unresolved);
    ui.notifications.warn(`Wayreth: ${unresolved.length} scene reference(s) could not be `
      + "resolved. See the console (F12).");
  }
  return created.length + updated.length;
}

/* -------------------------------------------------------------------------- */
/*  Handouts                                                                    */
/* -------------------------------------------------------------------------- */

function handoutCard(handout) {
  const bullets = (handout.players_know ?? [])
    .map(line => `<li>${foundry.utils.escapeHTML?.(line) ?? line}</li>`).join("");
  return `
    <div class="wayreth-handout">
      <h3 class="wayreth-handout-title">${handout.title}</h3>
      <p class="wayreth-handout-read">${handout.read}</p>
      ${bullets ? `<ul class="wayreth-handout-know">${bullets}</ul>` : ""}
    </div>`;
}

/**
 * Post a player card to chat. Nothing GM-side is read here — the card is built
 * from content/handouts.json alone, so there is no code path by which a
 * session page's Tracker Guidance can reach a player's chat log.
 */
export async function sendHandout(sceneKey, pin) {
  const index = await loadHandouts();
  const handout = index.get(`${sceneKey}#${pin}`);
  if (!handout) {
    ui.notifications.warn(`Wayreth: no player handout for ${sceneKey} pin ${pin}.`);
    return null;
  }
  return ChatMessage.create({
    content: handoutCard(handout),
    speaker: { alias: "Wayreth" },
    flags: { [MODULE]: { handout: `${sceneKey}#${pin}` } }
  });
}

/** The dialog behind the scene-control button: this scene's cards, in order. */
async function openHandoutPicker() {
  const scene = canvas?.scene;
  const key = scene?.getFlag(MODULE, "sceneKey");
  if (!key) {
    ui.notifications.warn("Wayreth: this is not a Wayreth scene.");
    return;
  }
  const index = await loadHandouts();
  const mine = [...index.entries()]
    .filter(([id]) => id.startsWith(`${key}#`))
    .sort((a, b) => Number(a[0].split("#")[1]) - Number(b[0].split("#")[1]));
  if (!mine.length) {
    ui.notifications.warn(`Wayreth: no handouts for ${scene.name}.`);
    return;
  }
  const rows = mine.map(([id, h]) => `
    <li class="wayreth-handout-row">
      <button type="button" data-handout="${id}">${id.split("#")[1]}. ${h.title}</button>
      <span>${h.read.slice(0, 110)}…</span>
    </li>`).join("");

  const content = `<p>Send a card to the players. They see only what is written here.</p>
    <ul class="wayreth-handout-list">${rows}</ul>`;
  const dialog = new Dialog({
    title: `Handouts — ${scene.name}`,
    content,
    buttons: { close: { label: "Close" } },
    default: "close",
    render: html => {
      html.on("click", "[data-handout]", async event => {
        const [sceneKey, pin] = event.currentTarget.dataset.handout.split("#");
        await sendHandout(sceneKey, Number(pin));
      });
    }
  }, { width: 520, classes: ["wayreth", "wayreth-handouts"] });
  dialog.render(true);
}

/* -------------------------------------------------------------------------- */
/*  Navigation between scenes                                                   */
/* -------------------------------------------------------------------------- */

/** Walk the chain: open the scene this one leads to. */
async function goToNextScene() {
  const key = canvas?.scene?.getFlag(MODULE, "next");
  if (!key) {
    ui.notifications.info("Wayreth: this scene is the end of its chain.");
    return;
  }
  const next = game.scenes.find(s => s.getFlag(MODULE, "sceneKey") === key);
  if (!next) {
    ui.notifications.warn(`Wayreth: the next scene (${key}) is not installed.`);
    return;
  }
  await next.view();
}

/* -------------------------------------------------------------------------- */
/*  Controls                                                                    */
/* -------------------------------------------------------------------------- */

export function registerSceneControls() {
  Hooks.on("getSceneControlButtons", controls => {
    if (!game.user.isGM) return;
    // v13 made controls an object keyed by name; earlier versions used an array.
    const notes = Array.isArray(controls)
      ? controls.find(c => c.name === "notes")
      : controls.notes;
    if (!notes) return;
    const tools = [
      {
        name: "wayreth-handout",
        title: "Send a player handout",
        icon: "fa-solid fa-scroll",
        button: true,
        visible: true,
        onClick: () => openHandoutPicker(),
        onChange: () => openHandoutPicker()
      },
      {
        name: "wayreth-next",
        title: "Go to the next scene",
        icon: "fa-solid fa-forward",
        button: true,
        visible: true,
        onClick: () => goToNextScene(),
        onChange: () => goToNextScene()
      }
    ];
    if (Array.isArray(notes.tools)) notes.tools.push(...tools);
    else for (const tool of tools) notes.tools[tool.name] = tool;
  });
}
