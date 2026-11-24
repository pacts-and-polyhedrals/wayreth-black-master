/**
 * What every caster in the bestiary actually has, as data.
 *
 * Fourteen stat blocks used to name a handful of representative spells each.
 * A 20th-level archmage listed fourteen; a wizard of that level prepares
 * twenty-seven and keeps a spellbook of forty-four. The lists below are full
 * 2014-style loadouts: caster level + ability modifier prepared leveled
 * spells, the cantrips the class gets, and — for wizards — the spellbook
 * reserve they own but have not prepared today.
 *
 * The Spellcasting prose in the rosters is RENDERED from this file by
 * spellcastingText(), so the stat block a GM reads and the spells that land on
 * the sheet are the same list by construction. Nothing here is parsed back out
 * of prose that somebody might edit on one side only.
 *
 * Generated once from the 1.28.0 caster audit and maintained here since.
 */

/** Full-caster slots per spell level, indexed by caster level. */
export const SLOTS = {
  1:  [2],
  2:  [3],
  3:  [4, 2],
  4:  [4, 3],
  5:  [4, 3, 2],
  6:  [4, 3, 3],
  7:  [4, 3, 3, 1],
  8:  [4, 3, 3, 2],
  9:  [4, 3, 3, 3, 1],
  10: [4, 3, 3, 3, 2],
  11: [4, 3, 3, 3, 2, 1],
  12: [4, 3, 3, 3, 2, 1],
  13: [4, 3, 3, 3, 2, 1, 1],
  14: [4, 3, 3, 3, 2, 1, 1],
  15: [4, 3, 3, 3, 2, 1, 1, 1],
  16: [4, 3, 3, 3, 2, 1, 1, 1],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
};

/** The highest spell level a full caster of this level can cast. */
export const ceiling = casterLevel => SLOTS[casterLevel].length;

/** How many leveled spells a caster of this level and ability prepares. */
export const preparedTarget = (casterLevel, abilityScore) =>
  Math.max(1, casterLevel + Math.floor((abilityScore - 10) / 2));

export const LOADOUTS = {
  "Bozak Draconian": {
    feature: "Spellcasting",
    lead: "The bozak is a 5th-level spellcaster.",
    dc: 12, attack: 4, attackSuffix: " with spell attacks",
    casterLevel: 5, ability: "INT", score: 15,
    robe: null,
    cantrips: [
      { name: "Fire Bolt", level: 0 },
      { name: "Mage Hand", level: 0 },
      { name: "Shocking Grasp", level: 0 },
      { name: "Minor Illusion", level: 0 }
    ],
    prepared: [
      { name: "Magic Missile", level: 1 },
      { name: "Shield", level: 1 },
      { name: "Mirror Image", level: 2 },
      { name: "Scorching Ray", level: 2 },
      { name: "Web", level: 2 },
      { name: "Fireball", level: 3 },
      { name: "Counterspell", level: 3 }
    ],
    order: [],
    reserve: [
      { name: "Burning Hands", level: 1 },
      { name: "Mage Armor", level: 1 },
      { name: "Detect Magic", level: 1 },
      { name: "Feather Fall", level: 1 },
      { name: "Invisibility", level: 2 },
      { name: "Gust of Wind", level: 2 },
      { name: "Shatter", level: 2 }
    ]
  },
  "Ossian Krell": {
    feature: "Spellcasting",
    lead: "Krell is a 5th-level spellcaster.",
    dc: 13, attack: 5,
    casterLevel: 5, ability: "INT", score: 17,
    robe: "Black",
    tail: "Exhaustion and four months of running have left him with nothing offensive prepared, and he will spend every slot on getting away.",
    cantrips: [
      { name: "Mage Hand", level: 0 },
      { name: "Minor Illusion", level: 0 },
      { name: "Prestidigitation", level: 0 },
      { name: "Grave Whisper", level: 0, wayreth: true }
    ],
    prepared: [
      { name: "Shield", level: 1 },
      { name: "Disguise Self", level: 1 },
      { name: "Comprehend Languages", level: 1 },
      { name: "Invisibility", level: 2 },
      { name: "Misty Step", level: 2 },
      { name: "Nondetection", level: 3 }
    ],
    order: [
      { name: "Blood Scent", level: 2, wayreth: true },
      { name: "Feign Life", level: 2, wayreth: true }
    ],
    reserve: [
      { name: "Alarm", level: 1 },
      { name: "Detect Magic", level: 1 },
      { name: "Identify", level: 1 },
      { name: "Feather Fall", level: 1 },
      { name: "Find Familiar", level: 1 },
      { name: "Floating Disk", level: 1 }
    ]
  },
  "Knight of the Sword": {
    feature: "Divine Spellcasting",
    lead: "The Knight is a 5th-level spellcaster.",
    dc: 14, attack: 6,
    casterLevel: 5, ability: "WIS", score: 16,
    robe: null,
    cantrips: [
      { name: "Guidance", level: 0 },
      { name: "Sacred Flame", level: 0 },
      { name: "Thaumaturgy", level: 0 },
      { name: "Resistance", level: 0 }
    ],
    prepared: [
      { name: "Bless", level: 1 },
      { name: "Cure Wounds", level: 1 },
      { name: "Shield of Faith", level: 1 },
      { name: "Sanctuary", level: 1 },
      { name: "Aid", level: 2 },
      { name: "Lesser Restoration", level: 2 },
      { name: "Beacon of Hope", level: 3 },
      { name: "Dispel Magic", level: 3 }
    ],
    order: [],
    reserve: []
  },
  "Dragonarmy Battle Mage": {
    feature: "Spellcasting",
    lead: "9th-level spellcaster.",
    dc: 15, attack: 7,
    casterLevel: 9, ability: "INT", score: 18,
    robe: null,
    cantrips: [
      { name: "Fire Bolt", level: 0 },
      { name: "Mage Hand", level: 0 },
      { name: "Minor Illusion", level: 0 },
      { name: "Prestidigitation", level: 0 }
    ],
    prepared: [
      { name: "Mage Armor", level: 1 },
      { name: "Magic Missile", level: 1 },
      { name: "Shield", level: 1 },
      { name: "Misty Step", level: 2 },
      { name: "Scorching Ray", level: 2 },
      { name: "Counterspell", level: 3 },
      { name: "Fireball", level: 3 },
      { name: "Fly", level: 3 },
      { name: "Dispel Magic", level: 3 },
      { name: "Greater Invisibility", level: 4 },
      { name: "Wall of Fire", level: 4 },
      { name: "Dimension Door", level: 4 },
      { name: "Cone of Cold", level: 5 }
    ],
    order: [],
    reserve: [
      { name: "Burning Hands", level: 1 },
      { name: "Feather Fall", level: 1 },
      { name: "Detect Magic", level: 1 },
      { name: "Web", level: 2 },
      { name: "Haste", level: 3 },
      { name: "Lightning Bolt", level: 3 },
      { name: "Hypnotic Pattern", level: 3 },
      { name: "Animate Objects", level: 5 },
      { name: "Scrying", level: 5 }
    ]
  },
  "Dalamar Argent": {
    feature: "Spellcasting",
    lead: "12th-level wizard.",
    dc: 16, attack: 8,
    casterLevel: 12, ability: "INT", score: 18,
    robe: "Black",
    cantrips: [
      { name: "Grave Whisper", level: 0, wayreth: true },
      { name: "Cinder Lash", level: 0, wayreth: true },
      { name: "Mage Hand", level: 0 },
      { name: "Minor Illusion", level: 0 },
      { name: "Prestidigitation", level: 0 }
    ],
    prepared: [
      { name: "Charm Person", level: 1 },
      { name: "Shield", level: 1 },
      { name: "Mage Armor", level: 1 },
      { name: "Invisibility", level: 2 },
      { name: "Misty Step", level: 2 },
      { name: "Counterspell", level: 3 },
      { name: "Fear", level: 3 },
      { name: "Dispel Magic", level: 3 },
      { name: "Greater Invisibility", level: 4 },
      { name: "Dimension Door", level: 4 },
      { name: "Dominate Person", level: 5 },
      { name: "Disintegrate", level: 6 }
    ],
    order: [
      { name: "Umbral Burst", level: 2, wayreth: true },
      { name: "Sable Edict", level: 3, wayreth: true },
      { name: "Tyrant's Brand", level: 4, wayreth: true },
      { name: "Death's Due", level: 6, wayreth: true }
    ],
    reserve: [
      { name: "Comprehend Languages", level: 1 },
      { name: "Detect Magic", level: 1 },
      { name: "Identify", level: 1 },
      { name: "Blackflame Dart", level: 1, wayreth: true },
      { name: "Obedient Step", level: 1, wayreth: true },
      { name: "Blood Scent", level: 2, wayreth: true },
      { name: "Feign Life", level: 2, wayreth: true },
      { name: "Bestow Curse", level: 3 },
      { name: "Animate Dead", level: 3 },
      { name: "Life Transfer", level: 4, wayreth: true },
      { name: "Transfer Essence", level: 5, wayreth: true },
      { name: "Crown of Submission", level: 5, wayreth: true }
    ]
  },
  "Mereth Sorn, Renegade": {
    feature: "Spellcasting",
    lead: "10th-level spellcaster.",
    dc: 16, attack: 8,
    casterLevel: 10, ability: "INT", score: 18,
    robe: "Black",
    tail: "Losing the Conclave's sanction cost her its protection, not the magic she had already learned.",
    cantrips: [
      { name: "Fire Bolt", level: 0 },
      { name: "Mage Hand", level: 0 },
      { name: "Minor Illusion", level: 0 },
      { name: "Grave Whisper", level: 0, wayreth: true },
      { name: "Nuitari's Hook", level: 0, wayreth: true }
    ],
    prepared: [
      { name: "Shield", level: 1 },
      { name: "Mage Armor", level: 1 },
      { name: "Magic Missile", level: 1 },
      { name: "Misty Step", level: 2 },
      { name: "Counterspell", level: 3 },
      { name: "Fireball", level: 3 },
      { name: "Dispel Magic", level: 3 },
      { name: "Greater Invisibility", level: 4 },
      { name: "Blight", level: 4 },
      { name: "Cone of Cold", level: 5 }
    ],
    order: [
      { name: "Blackflame Dart", level: 1, wayreth: true },
      { name: "Blood Scent", level: 2, wayreth: true },
      { name: "Harvest the Fallen", level: 3, wayreth: true },
      { name: "Starless Lance", level: 5, wayreth: true }
    ],
    reserve: [
      { name: "Detect Magic", level: 1 },
      { name: "Disguise Self", level: 1 },
      { name: "Borrowed Vitality", level: 1, wayreth: true },
      { name: "Obedient Step", level: 1, wayreth: true },
      { name: "Feign Life", level: 2, wayreth: true },
      { name: "Umbral Burst", level: 2, wayreth: true },
      { name: "Sable Edict", level: 3, wayreth: true },
      { name: "Dimension Door", level: 4 },
      { name: "Life Transfer", level: 4, wayreth: true },
      { name: "Curse the Magi", level: 5, wayreth: true }
    ]
  },
  "Renegade Hunter": {
    feature: "Spellcasting",
    lead: "9th-level spellcaster.",
    dc: 15, attack: 7,
    casterLevel: 9, ability: "INT", score: 17,
    robe: null,
    cantrips: [
      { name: "Mage Hand", level: 0 },
      { name: "Minor Illusion", level: 0 },
      { name: "Ray of Frost", level: 0 },
      { name: "Message", level: 0 }
    ],
    prepared: [
      { name: "Shield", level: 1 },
      { name: "Detect Magic", level: 1 },
      { name: "Magic Missile", level: 1 },
      { name: "Misty Step", level: 2 },
      { name: "Hold Person", level: 2 },
      { name: "Detect Thoughts", level: 2 },
      { name: "See Invisibility", level: 2 },
      { name: "Counterspell", level: 3 },
      { name: "Hypnotic Pattern", level: 3 },
      { name: "Dispel Magic", level: 3 },
      { name: "Dimension Door", level: 4 },
      { name: "Hold Monster", level: 5 }
    ],
    order: [],
    reserve: [
      { name: "Alarm", level: 1 },
      { name: "Comprehend Languages", level: 1 },
      { name: "Identify", level: 1 },
      { name: "Protection from Evil and Good", level: 1 },
      { name: "Locate Object", level: 2 },
      { name: "Nondetection", level: 3 },
      { name: "Clairvoyance", level: 3 },
      { name: "Fly", level: 3 },
      { name: "Arcane Eye", level: 4 },
      { name: "Scrying", level: 5 }
    ]
  },
  "Knight of the Rose": {
    feature: "Spellcasting",
    lead: "The Knight is a 9th-level spellcaster.",
    dc: 16, attack: 8,
    casterLevel: 9, ability: "CHA", score: 18,
    robe: null,
    tail: "A Charisma caster of the ninth order, by the Measure's reckoning rather than any oath's.",
    cantrips: [],
    prepared: [
      { name: "Bless", level: 1 },
      { name: "Heroism", level: 1 },
      { name: "Command", level: 1 },
      { name: "Cure Wounds", level: 1 },
      { name: "Shield of Faith", level: 1 },
      { name: "Aid", level: 2 },
      { name: "Warding Bond", level: 2 },
      { name: "Lesser Restoration", level: 2 },
      { name: "Crusader's Mantle", level: 3 },
      { name: "Revivify", level: 3 },
      { name: "Banishment", level: 4 },
      { name: "Death Ward", level: 4 },
      { name: "Holy Weapon", level: 5 }
    ],
    order: [],
    reserve: []
  },
  "Justarius of the Red Robes": {
    feature: "Spellcasting",
    lead: "15th-level wizard.",
    dc: 18, attack: 10,
    casterLevel: 15, ability: "INT", score: 20,
    robe: "Red",
    cantrips: [
      { name: "Cleaning", level: 0, wayreth: true },
      { name: "Borrowed Hue", level: 0, wayreth: true },
      { name: "Conjurer's Chalk", level: 0, wayreth: true },
      { name: "Mage Hand", level: 0 },
      { name: "Ray of Frost", level: 0 }
    ],
    prepared: [
      { name: "Shield", level: 1 },
      { name: "Mage Armor", level: 1 },
      { name: "Misty Step", level: 2 },
      { name: "Mirror Image", level: 2 },
      { name: "Counterspell", level: 3 },
      { name: "Dispel Magic", level: 3 },
      { name: "Fire Shield", level: 4 },
      { name: "Dimension Door", level: 4 },
      { name: "Polymorph", level: 4 },
      { name: "Telekinesis", level: 5 },
      { name: "Chain Lightning", level: 6 },
      { name: "Globe of Invulnerability", level: 6 },
      { name: "Reverse Gravity", level: 7 },
      { name: "Teleport", level: 7 }
    ],
    order: [
      { name: "Mirror Passage", level: 2, wayreth: true },
      { name: "Equal Exchange", level: 2, wayreth: true },
      { name: "Equilibrium Gate", level: 4, wayreth: true },
      { name: "Lunitari's Exchange", level: 4, wayreth: true },
      { name: "Wayreth's Moving Door", level: 6, wayreth: true },
      { name: "Mirror of Possible Selves", level: 8, wayreth: true }
    ],
    reserve: [
      { name: "Detect Magic", level: 1 },
      { name: "Comprehend Languages", level: 1 },
      { name: "Identify", level: 1 },
      { name: "Balanced Implement", level: 1, wayreth: true },
      { name: "Veil of the Ordinary", level: 1, wayreth: true },
      { name: "Stone Guardian", level: 3, wayreth: true },
      { name: "Arcane Staff, Lesser", level: 3, wayreth: true },
      { name: "Awaken the Mind", level: 4, wayreth: true },
      { name: "Phantom Architecture", level: 4, wayreth: true },
      { name: "Conjure Counterpart", level: 5, wayreth: true },
      { name: "Balanced Transformation", level: 6, wayreth: true },
      { name: "Mirror Labyrinth", level: 6, wayreth: true },
      { name: "Mindspin", level: 7, wayreth: true },
      { name: "Palace Between Moments", level: 8, wayreth: true }
    ]
  },
  "Ladonna of the Black Robes": {
    feature: "Spellcasting",
    lead: "16th-level wizard.",
    dc: 18, attack: 10,
    casterLevel: 16, ability: "INT", score: 20,
    robe: "Black",
    cantrips: [
      { name: "Cinder Lash", level: 0, wayreth: true },
      { name: "Nuitari's Hook", level: 0, wayreth: true },
      { name: "Grave Whisper", level: 0, wayreth: true },
      { name: "Mage Hand", level: 0 },
      { name: "Minor Illusion", level: 0 }
    ],
    prepared: [
      { name: "Shield", level: 1 },
      { name: "Mage Armor", level: 1 },
      { name: "Hold Person", level: 2 },
      { name: "Suggestion", level: 2 },
      { name: "Misty Step", level: 2 },
      { name: "Fear", level: 3 },
      { name: "Counterspell", level: 3 },
      { name: "Dispel Magic", level: 3 },
      { name: "Greater Invisibility", level: 4 },
      { name: "Blight", level: 4 },
      { name: "Dimension Door", level: 4 },
      { name: "Dominate Person", level: 5 },
      { name: "Contact Other Plane", level: 5 },
      { name: "Finger of Death", level: 7 },
      { name: "Feeblemind", level: 8 }
    ],
    order: [
      { name: "Sable Edict", level: 3, wayreth: true },
      { name: "Tyrant's Brand", level: 4, wayreth: true },
      { name: "Curse the Magi", level: 5, wayreth: true },
      { name: "Death's Due", level: 6, wayreth: true },
      { name: "Edict of the Black Moon", level: 7, wayreth: true },
      { name: "Exsanguinate Memory", level: 8, wayreth: true }
    ],
    reserve: [
      { name: "Detect Magic", level: 1 },
      { name: "False Life", level: 1 },
      { name: "Borrowed Vitality", level: 1, wayreth: true },
      { name: "Obedient Step", level: 1, wayreth: true },
      { name: "Blackflame Dart", level: 1, wayreth: true },
      { name: "Blood Scent", level: 2, wayreth: true },
      { name: "Disarm", level: 2, wayreth: true },
      { name: "Feign Life", level: 2, wayreth: true },
      { name: "Harvest the Fallen", level: 3, wayreth: true },
      { name: "Black Moon Detonation", level: 4, wayreth: true },
      { name: "Life Transfer", level: 4, wayreth: true },
      { name: "Crown of Submission", level: 5, wayreth: true },
      { name: "Transfer Essence", level: 5, wayreth: true },
      { name: "Raistlin's Wheel of Flame", level: 6, wayreth: true },
      { name: "Soul Chain", level: 7, wayreth: true }
    ]
  },
  "Par-Salian of the White Robes": {
    feature: "Spellcasting",
    lead: "17th-level wizard.",
    dc: 19, attack: 11,
    casterLevel: 17, ability: "INT", score: 21,
    robe: "White",
    cantrips: [
      { name: "Guiding Sigil", level: 0, wayreth: true },
      { name: "Silver Ward", level: 0, wayreth: true },
      { name: "Steady Hand", level: 0, wayreth: true },
      { name: "Light", level: 0 },
      { name: "Mage Hand", level: 0 }
    ],
    prepared: [
      { name: "Shield", level: 1 },
      { name: "Mage Armor", level: 1 },
      { name: "Detect Magic", level: 1 },
      { name: "Mirror Image", level: 2 },
      { name: "Misty Step", level: 2 },
      { name: "Counterspell", level: 3 },
      { name: "Dispel Magic", level: 3 },
      { name: "Banishment", level: 4 },
      { name: "Dimension Door", level: 4 },
      { name: "Wall of Force", level: 5 },
      { name: "Scrying", level: 5 },
      { name: "True Seeing", level: 6 },
      { name: "Forcecage", level: 7 },
      { name: "Teleport", level: 7 },
      { name: "Antimagic Field", level: 8 },
      { name: "Foresight", level: 9 }
    ],
    order: [
      { name: "Moonward", level: 1, wayreth: true },
      { name: "Oath of Clarity", level: 3, wayreth: true },
      { name: "Suppress Magic", level: 4, wayreth: true },
      { name: "Prism of Spellturning", level: 6, wayreth: true },
      { name: "Perfect Witness", level: 8, wayreth: true },
      { name: "Aegis of the Three Moons", level: 9, wayreth: true }
    ],
    reserve: [
      { name: "Identify", level: 1 },
      { name: "Protection from Evil and Good", level: 1 },
      { name: "Comprehend Languages", level: 1 },
      { name: "Detect Familiar", level: 1, wayreth: true },
      { name: "Kindled Resolve", level: 1, wayreth: true },
      { name: "Silver Reprieve", level: 2, wayreth: true },
      { name: "Truth-Testing", level: 2, wayreth: true },
      { name: "Concordant Courage", level: 2, wayreth: true },
      { name: "Spellward Relay", level: 3, wayreth: true },
      { name: "Unclouded Sight", level: 3, wayreth: true },
      { name: "Lantern of Unasked Truths", level: 4, wayreth: true },
      { name: "Sanctuary of Consent", level: 4, wayreth: true },
      { name: "Aegis of Solinari", level: 5, wayreth: true },
      { name: "Witness Chain", level: 5, wayreth: true },
      { name: "Greater Arcane Eye", level: 7, wayreth: true },
      { name: "Solinari's Interdiction", level: 8, wayreth: true }
    ]
  },
  "Raistlin Majere, Master of Wayreth": {
    feature: "Spellcasting",
    lead: "20th-level wizard.",
    dc: 22, attack: 14,
    casterLevel: 20, ability: "INT", score: 24,
    robe: "Black",
    tail: "Reverse Death is in no spellbook of his. Whether it ever will be is the question the Tower is asking.",
    cantrips: [
      { name: "Cinder Lash", level: 0, wayreth: true },
      { name: "Grave Whisper", level: 0, wayreth: true },
      { name: "Nuitari's Hook", level: 0, wayreth: true },
      { name: "Mage Hand", level: 0 },
      { name: "Prestidigitation", level: 0 }
    ],
    prepared: [
      { name: "Shield", level: 1 },
      { name: "Mage Armor", level: 1 },
      { name: "Mirror Image", level: 2 },
      { name: "Misty Step", level: 2 },
      { name: "Counterspell", level: 3 },
      { name: "Dispel Magic", level: 3 },
      { name: "Banishment", level: 4 },
      { name: "Greater Invisibility", level: 4 },
      { name: "Wall of Force", level: 5 },
      { name: "Chain Lightning", level: 6 },
      { name: "Globe of Invulnerability", level: 6 },
      { name: "Disintegrate", level: 6 },
      { name: "Forcecage", level: 7 },
      { name: "Plane Shift", level: 7 },
      { name: "Teleport", level: 7 },
      { name: "Maze", level: 8 },
      { name: "Mind Blank", level: 8 },
      { name: "Time Stop", level: 9 }
    ],
    order: [
      { name: "Blackflame Dart", level: 1, wayreth: true },
      { name: "Borrowed Vitality", level: 1, wayreth: true },
      { name: "Curse the Magi", level: 5, wayreth: true },
      { name: "Raistlin's Wheel of Flame", level: 6, wayreth: true },
      { name: "Death's Due", level: 6, wayreth: true },
      { name: "Silence the Defiant", level: 6, wayreth: true },
      { name: "Soul Chain", level: 7, wayreth: true },
      { name: "Sable Cataclysm", level: 8, wayreth: true },
      { name: "Final Dominion", level: 9, wayreth: true }
    ],
    reserve: [
      { name: "Alarm", level: 1 },
      { name: "Comprehend Languages", level: 1 },
      { name: "Detect Magic", level: 1 },
      { name: "Identify", level: 1 },
      { name: "Find Familiar", level: 1 },
      { name: "Magic Missile", level: 1 },
      { name: "Detect Thoughts", level: 2 },
      { name: "Invisibility", level: 2 },
      { name: "Suggestion", level: 2 },
      { name: "Blood Scent", level: 2, wayreth: true },
      { name: "Umbral Burst", level: 2, wayreth: true },
      { name: "Fireball", level: 3 },
      { name: "Fly", level: 3 },
      { name: "Sable Edict", level: 3, wayreth: true },
      { name: "Blight", level: 4 },
      { name: "Tyrant's Brand", level: 4, wayreth: true },
      { name: "Crown of Submission", level: 5, wayreth: true }
    ]
  },
  "Fistandantilus": {
    feature: "Spellcasting",
    lead: "20th-level wizard.",
    dc: 22, attack: 14,
    casterLevel: 20, ability: "INT", score: 25,
    robe: "Black",
    cantrips: [
      { name: "Chill Touch", level: 0 },
      { name: "Grave Whisper", level: 0, wayreth: true },
      { name: "Nuitari's Hook", level: 0, wayreth: true },
      { name: "Mage Hand", level: 0 },
      { name: "Minor Illusion", level: 0 }
    ],
    prepared: [
      { name: "Shield", level: 1 },
      { name: "Mage Armor", level: 1 },
      { name: "Mirror Image", level: 2 },
      { name: "Misty Step", level: 2 },
      { name: "Counterspell", level: 3 },
      { name: "Dispel Magic", level: 3 },
      { name: "Animate Dead", level: 3 },
      { name: "Blight", level: 4 },
      { name: "Dimension Door", level: 4 },
      { name: "Dominate Person", level: 5 },
      { name: "Contingency", level: 6 },
      { name: "Create Undead", level: 6 },
      { name: "Globe of Invulnerability", level: 6 },
      { name: "Forcecage", level: 7 },
      { name: "Finger of Death", level: 7 },
      { name: "Power Word Stun", level: 8 },
      { name: "Time Stop", level: 9 },
      { name: "Wish", level: 9 }
    ],
    order: [
      { name: "Feign Life", level: 2, wayreth: true },
      { name: "Harvest the Fallen", level: 3, wayreth: true },
      { name: "Life Transfer", level: 4, wayreth: true },
      { name: "Transfer Essence", level: 5, wayreth: true },
      { name: "Curse the Magi", level: 5, wayreth: true },
      { name: "Death's Due", level: 6, wayreth: true },
      { name: "Soul Chain", level: 7, wayreth: true },
      { name: "Exsanguinate Memory", level: 8, wayreth: true },
      { name: "Reverse Death", level: 9, wayreth: true }
    ],
    reserve: [
      { name: "Identify", level: 1 },
      { name: "Detect Magic", level: 1 },
      { name: "Comprehend Languages", level: 1 },
      { name: "Alarm", level: 1 },
      { name: "Find Familiar", level: 1 },
      { name: "False Life", level: 1 },
      { name: "Blood Scent", level: 2, wayreth: true },
      { name: "Disarm", level: 2, wayreth: true },
      { name: "Umbral Burst", level: 2, wayreth: true },
      { name: "Suggestion", level: 2 },
      { name: "Hold Person", level: 2 },
      { name: "Fireball", level: 3 },
      { name: "Sable Edict", level: 3, wayreth: true },
      { name: "Bestow Curse", level: 3 },
      { name: "Contact Other Plane", level: 5 },
      { name: "Magic Jar", level: 6 },
      { name: "Clone", level: 8 }
    ]
  },
};

const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];
const em = list => list.map(s => `<em>${s.name}</em>`).join(", ");

/**
 * Renders a caster's Spellcasting feature text: what it can cast today.
 *
 * The shape is what scripts/lib/spellcasting.mjs reads back — a Cantrips
 * group, one group per spell level carrying its slot count, and an Order
 * spells group for a Wizard of High Sorcery.
 */
export function spellcastingText(name) {
  const c = LOADOUTS[name];
  if (!c) throw new Error(`no loadout for ${name}`);
  const slots = SLOTS[c.casterLevel];
  const out = [`${c.lead} Spell save DC ${c.dc}, +${c.attack} to hit${c.attackSuffix ?? ""}.`];

  if (c.cantrips.length) out.push(`Cantrips: ${em(c.cantrips)}.`);

  for (let level = 1; level <= 9; level += 1) {
    const atLevel = c.prepared.filter(s => s.level === level);
    if (!atLevel.length) continue;
    const count = slots[level - 1];
    out.push(`${ORDINAL[level]} (${count}${level === 1 ? " slots" : ""}): ${em(atLevel)}.`);
  }

  if (c.order.length) out.push(`Order spells (${c.robe} Robes): ${em(c.order)}.`);
  if (c.tail) out.push(c.tail);
  return out.join(" ");
}

/**
 * Renders the Spellbook feature: scribed, owned, not prepared today.
 *
 * This is a trait of its own rather than a fourth paragraph of Spellcasting.
 * Fistandantilus knows forty-nine spells; printed as one block they are a wall
 * a GM has to read past mid-combat to find what he can actually cast.
 */
export function spellbookText(name) {
  const c = LOADOUTS[name];
  if (!c) throw new Error(`no loadout for ${name}`);
  if (!c.reserve.length) return null;
  return `Scribed and owned, and not among today's preparations; any of these can be `
    + `prepared after a long rest. Spellbook (unprepared): ${em(c.reserve)}.`;
}

/** Both spell features for a caster, ready to spread into a traits array. */
export function spellFeatures(name) {
  const c = LOADOUTS[name];
  if (!c) throw new Error(`no loadout for ${name}`);
  const features = [{ name: c.feature, text: spellcastingText(name) }];
  const book = spellbookText(name);
  if (book) features.push({ name: "Spellbook", text: book });
  return features;
}
