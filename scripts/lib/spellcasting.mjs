/**
 * Reading a stat block's spell list out of the sentence that states it.
 *
 * Every caster in the bestiary described its spells in prose and had none
 * assigned, so the sheet showed slots with nothing to put in them. Rather than
 * restating 41 spell lists by hand in the rosters, they are read back out of
 * the text that already names them — the same approach the saving throws and
 * breath weapons use.
 *
 * Spell names are written in <em> tags throughout the rosters, which is what
 * makes this reliable: the parser never has to guess where a name begins or
 * ends, only which group it falls in.
 *
 * Three shapes appear, and all three are supported:
 *
 *   "5th-level spellcaster. Spell save DC 14, +6 to hit. Prepared: <em>guidance</em>,
 *    <em>sacred flame</em>; 1st (4 slots) <em>bless</em>; 2nd (3) <em>aid</em>."
 *
 *   "Spell save DC 16. At will: <em>misty step</em>. 3/day each: <em>fear</em>.
 *    1/day each: <em>wall of fire</em>."
 *
 *   "9th-level spellcaster. Spell save DC 15, +7 to hit. Notable: <em>shield</em>."
 *
 *   "12th-level wizard. Spell save DC 16, +8 to hit. Cantrips: <em>mage hand</em>.
 *    1st (4 slots): <em>shield</em>. Order spells (Black Robes): <em>Sable Edict</em>.
 *    Spellbook (unprepared): <em>identify</em>, <em>animate dead</em>."
 *
 * The last shape is what scripts/lib/caster-loadouts.mjs renders, and it is
 * the one full loadouts use: cantrips, prepared spells by slot level, Order
 * magic, and the spellbook a wizard owns but has not prepared today.
 */

/**
 * Headers that open a group of spells, searched in this order.
 *
 * "Notable" is matched before "prepared" on purpose: Raistlin's list opens
 * "Notable prepared spells:", and reading that as a prepared-cantrip group
 * would file *time stop* and *wish* as cantrips. A notable list is a
 * selection from what the caster knows at its own level, with no slot
 * breakdown, so it gets a kind of its own.
 */
const GROUP_PATTERNS = [
  // What a wizard owns but has not prepared today. Claimed first so that the
  // word "prepared" inside "(unprepared)" can never be read as a group header
  // of its own.
  { re: /\bSpellbook \(unprepared\)\s*:/gi, kind: "reserve" },
  // A Wizard of High Sorcery's own Order magic, which the module supplies.
  // Captured before "notable" so the Order is recorded rather than folded
  // into the general list.
  { re: /\bOrder spells[^:]*\((White|Red|Black) Robes\)\s*:/gi, kind: "order" },
  { re: /\bnotable(?:\s+[a-z]+)*\s*:/gi, kind: "known" },
  { re: /(\d+)\s*\/\s*day each:/gi, kind: "innate" },
  { re: /\bat will:/gi, kind: "atwill" },
  { re: /\b(\d+)(?:st|nd|rd|th)\s*\((\d+)(?:\s*slots?)?\)\s*:?/gi, kind: "level" },
  { re: /\b(?:has prepared|prepared|cantrips)\s*:/gi, kind: "cantrip" }
];

const EM = /<em>([^<]+)<\/em>/gi;

function cleanName(raw) {
  return raw
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\(.*?\)/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.,;:]+$/, "")
    .toLowerCase();
}

/**
 * @param {string} html  The feature's description, markup intact.
 * @returns {{casterLevel: number|null, dc: number|null, attack: number|null,
 *            groups: Array<{kind: string, level: number, slots: number|null,
 *                           perDay: number|null, spells: string[]}>}|null}
 */
export function readSpellcasting(html) {
  if (!html) return null;
  const text = String(html);
  if (!/spellcaster|spell save dc|at will|prepared|cantrips|notable/i.test(text)) return null;

  // Find where each group starts, so the <em> names between two headers can be
  // attributed to the right one.
  const marks = [];
  const claimed = [];
  for (const { re, kind } of GROUP_PATTERNS) {
    re.lastIndex = 0;
    for (const match of text.matchAll(re)) {
      const at = match.index;
      const end = at + match[0].length;
      // An earlier, higher-priority header already owns this text.
      if (claimed.some(([from, to]) => at < to && end > from)) continue;
      claimed.push([at, end]);
      marks.push({
        kind,
        at,
        end,
        a: kind === "order" ? null : (match[1] ? Number(match[1]) : null),
        b: match[2] ? Number(match[2]) : null,
        order: kind === "order" ? match[1] : null
      });
    }
  }
  if (!marks.length) return null;
  marks.sort((x, y) => x.at - y.at);

  const groups = [];
  marks.forEach((mark, index) => {
    const until = marks[index + 1]?.at ?? text.length;
    const segment = text.slice(mark.end, until);
    const spells = [];
    EM.lastIndex = 0;
    for (const found of segment.matchAll(EM)) {
      const name = cleanName(found[1]);
      if (name) spells.push(name);
    }
    if (!spells.length) return;
    groups.push({
      kind: mark.kind,
      level: mark.kind === "level" ? mark.a : 0,
      slots: mark.kind === "level" ? mark.b : null,
      perDay: mark.kind === "innate" ? mark.a : null,
      order: mark.order ?? null,
      spells
    });
  });
  if (!groups.length) return null;

  // "17th-level wizard" and "5th-level spellcaster" both state a caster level.
  // Reading only the second spelling left the archmages with no recorded
  // level, so their sheets derived no spell slots from it.
  const level = /(\d+)(?:st|nd|rd|th)-level (?:spellcaster|wizard|cleric|caster)/i.exec(text);
  const dc = /Spell save DC\s*(\d+)/i.exec(text);
  const attack = /\+(\d+)\s*to hit/i.exec(text);

  return {
    casterLevel: level ? Number(level[1]) : null,
    dc: dc ? Number(dc[1]) : null,
    attack: attack ? Number(attack[1]) : null,
    groups
  };
}

/** Every spell named anywhere in a parsed list, deduplicated. */
export function spellNames(parsed) {
  if (!parsed) return [];
  return [...new Set(parsed.groups.flatMap(g => g.spells))];
}
