/**
 * Dragons as Innate Spellcasters.
 *
 * Not one true dragon in the bestiary cast a spell, which is a defensible
 * reading of the 2014 Monster Manual — the printed dragon stat blocks have no
 * spellcasting — and the wrong one for Dragonlance. Takhisis's dragons are
 * officers and schemers, Paladine's are guardians, and Cyan Bloodbane's entire
 * place in the setting is that he poisoned the dreams of Silvanesti. A dragon
 * that can only bite is not that dragon.
 *
 * So the Monster Manual's own variant is used, verbatim:
 *
 *   "A dragon of adult or older age category can innately cast a number of
 *    spells equal to its Charisma modifier. Each spell can be cast once per
 *    day, requiring no material components, and the spell's level can be no
 *    higher than one-third the dragon's challenge rating (rounded down)."
 *
 * That gives an allowance per dragon rather than a judgement call, and the
 * allowance is derived here from the Charisma and CR already on the stat
 * block. The choice of WHICH spells is mine; the number of them and their
 * ceiling are not, and allowance() is what the validator checks against.
 *
 * Young dragons and wyrmlings get nothing: the variant starts at adult, and
 * a wyrmling that teleports is a different monster.
 */

/** Proficiency bonus by challenge rating, as the stat block builder uses it. */
const PROFICIENCY = cr => cr >= 29 ? 9 : cr >= 25 ? 8 : cr >= 21 ? 7 : cr >= 17 ? 6
  : cr >= 13 ? 5 : cr >= 9 ? 4 : cr >= 5 ? 3 : 2;

const modifier = score => Math.floor((score - 10) / 2);

/**
 * What the variant allows a dragon of this CR and Charisma.
 * @returns {{spells: number, maxLevel: number, dc: number}}
 */
export function allowance(cr, charisma) {
  return {
    spells: modifier(charisma),
    maxLevel: Math.floor(cr / 3),
    dc: 8 + PROFICIENCY(cr) + modifier(charisma)
  };
}

/**
 * Each dragon's chosen spells, with the level of each so the ceiling can be
 * checked without a spell compendium to hand. `note` is the one line of
 * reasoning that belongs with the stat block rather than in a release.
 */
export const DRAGON_MAGIC = {
  "White Dragon, Adult": {
    cr: 13, charisma: 12,
    note: "A white dragon is the least cunning of its kin and gets the one spell its Charisma allows. It uses it to make the ground as hostile as the air.",
    spells: [["sleet storm", 3]]
  },
  "Black Dragon, Adult": {
    cr: 14, charisma: 17,
    note: "Swamp, rot and ambush. A black dragon would rather its prey came apart before it has to land.",
    spells: [["fear", 3], ["stinking cloud", 3], ["blight", 4]]
  },
  "Green Dragon, Adult": {
    cr: 15, charisma: 17,
    note: "Green dragons lie first and fight second. The forest it rules is as much a lie as anything it says.",
    spells: [["detect thoughts", 2], ["suggestion", 2], ["hallucinatory terrain", 4]]
  },
  "Blue Dragon, Adult": {
    cr: 16, charisma: 19,
    note: "A Highlord's blue is a cavalry commander with wings. Its magic moves itself and its officers, and takes an enemy's officer away.",
    spells: [["blur", 2], ["haste", 3], ["dimension door", 4], ["dominate person", 5]]
  },
  "Silver Dragon, Adult": {
    cr: 16, charisma: 21,
    note: "Silvers live among people and come back for them. Every spell here keeps somebody else alive.",
    spells: [["bless", 1], ["calm emotions", 2], ["dispel magic", 3], ["death ward", 4], ["greater restoration", 5]]
  },
  "Red Dragon, Adult": {
    cr: 17, charisma: 21,
    note: "Pride, fire and obedience. A red dragon's magic is about who gives orders.",
    spells: [["command", 1], ["suggestion", 2], ["fear", 3], ["wall of fire", 4], ["dominate person", 5]]
  },
  "Cyan Bloodbane": {
    cr: 19, charisma: 21,
    note: "Cyan does not need to be in the room. He took Silvanesti apart from inside its sleep, and he will work on a party the same way the moment one of them closes their eyes.",
    spells: [["detect thoughts", 2], ["suggestion", 2], ["hallucinatory terrain", 4], ["dream", 5], ["mass suggestion", 6]]
  },
  "Blue Dragon, Ancient": {
    cr: 23, charisma: 21,
    note: "The same commander, centuries on, now able to put itself anywhere on the field it likes.",
    spells: [["blur", 2], ["haste", 3], ["dimension door", 4], ["dominate person", 5], ["teleport", 7]]
  },
  "Silver Dragon, Ancient": {
    cr: 23, charisma: 23,
    note: "Old enough to mend what it could only ward against before.",
    spells: [["bless", 1], ["calm emotions", 2], ["dispel magic", 3], ["death ward", 4], ["greater restoration", 5], ["heal", 6]]
  },
  "Gold Dragon, Ancient": {
    cr: 24, charisma: 28,
    note: "Nine spells, more than anything else in the bestiary casts innately. An ancient gold fights like something that expects the world to be put right, not merely to win.",
    spells: [["bless", 1], ["calm emotions", 2], ["dispel magic", 3], ["banishment", 4], ["geas", 5],
             ["true seeing", 6], ["heal", 6], ["holy aura", 8], ["sunburst", 8]]
  },
  "Red Dragon, Ancient": {
    cr: 24, charisma: 23,
    note: "Tyranny with eight levels of headroom. The cloud is what it leaves behind when it has finished being obeyed.",
    spells: [["command", 1], ["suggestion", 2], ["fear", 3], ["wall of fire", 4], ["dominate person", 5], ["incendiary cloud", 8]]
  }
};

/**
 * Renders a dragon's Innate Spellcasting trait, checking the variant's own
 * limits as it goes so an edit here cannot quietly exceed them.
 */
export function dragonMagic(name) {
  const entry = DRAGON_MAGIC[name];
  if (!entry) throw new Error(`no dragon magic for ${name}`);
  const { spells, maxLevel, dc } = allowance(entry.cr, entry.charisma);
  if (entry.spells.length !== spells) {
    throw new Error(`${name}: Charisma ${entry.charisma} allows ${spells} spells, ${entry.spells.length} are listed`);
  }
  for (const [spell, level] of entry.spells) {
    if (level > maxLevel) {
      throw new Error(`${name}: CR ${entry.cr} caps spells at level ${maxLevel}, but ${spell} is level ${level}`);
    }
  }
  const named = entry.spells.map(([spell]) => `<em>${spell}</em>`).join(", ");
  return {
    name: "Innate Spellcasting",
    text: `The dragon's innate spellcasting ability is Charisma (spell save DC ${dc}). `
      + `It can innately cast the following spells, requiring no material components. `
      + `1/day each: ${named}. ${entry.note}`
  };
}
