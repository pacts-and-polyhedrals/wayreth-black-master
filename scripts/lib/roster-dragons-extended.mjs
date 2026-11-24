import { npc } from "./statblock.mjs";
import { dragonMagic } from "./dragon-magic.mjs";

const A = (str, dex, con, int, wis, cha) => ({ str, dex, con, int, wis, cha });

/* ================================================================== *
 *  DRAGONS OF KRYNN — the full ladder.
 *
 *  Chromatic dragons serve Takhisis; metallics were bound by oath after
 *  the Cataclysm and are only now returning to the war. Every dragon on
 *  Krynn is a person with a grudge, a rank and a name — statistics are
 *  the least interesting thing about them, which is why each entry
 *  carries a note on how it fights rather than only what it hits for.
 * ================================================================== */

const breath = (name, dc, dice, type, shape) => ({
  name: `Breath Weapon: ${name}`,
  text: `<em>Recharge 5&ndash;6.</em> The dragon exhales ${shape}. Each creature in the area must make a DC ${dc} ${type === "acid" || type === "poison" ? "Constitution" : "Dexterity"} saving throw, taking ${dice} ${type} damage on a failed save, or half as much on a success.`
});

const frightful = (dc, range = 120) => ({
  name: "Frightful Presence",
  text: `Each creature of the dragon's choice within ${range} feet and aware of it must succeed on a DC ${dc} Wisdom saving throw or be frightened for 1 minute, repeating the save at the end of each of its turns. On a success, or when the effect ends, the creature is immune to this dragon's Frightful Presence for 24 hours.`
});

const legendaryTrio = (dc, name, str) => {
  if (typeof str !== "number") throw new Error(`legendaryTrio(${name}): needs the dragon's Strength`);
  const mod = Math.floor((str - 10) / 2);
  // 2d6 plus the Strength modifier; 2d6 averages 7.
  const wing = `${7 + mod} (2d6 + ${mod})`;
  return [
    { name: "Detect", text: "The dragon makes a Wisdom (Perception) check." },
    { name: "Tail Attack", text: "The dragon makes one tail attack." },
    { name: `Wing Attack (Costs 2 Actions)`, text: `The dragon beats its wings. Each creature within 15 feet must succeed on a DC ${dc} Dexterity saving throw or take ${wing} bludgeoning damage and be knocked prone. The dragon can then fly up to half its speed.` }
  ];
};

/* ---------------------------- WYRMLINGS ---------------------------- */

const wyrmlings = [
  npc({
    name: "White Dragon, Wyrmling", group: "Dragon (Chromatic)", cr: 2, type: "dragon", subtype: "Chromatic",
    alignment: "Chaotic Evil", ac: 16, hp: 32, hpFormula: "5d8 + 10", size: "med",
    abilities: A(14, 10, 14, 5, 10, 11), saves: ["dex", "con", "wis", "cha"],
    skills: { per: 1, ste: 1 }, senses: { blindsight: 10, darkvision: 60 },
    di: ["cold"], languages: ["draconic"], environment: "Arctic",
    speed: { walk: 30, burrow: 15, fly: 60, swim: 30 },
    bio: "<p>Icewall and the Northern Wastes. Whites are the least cunning of the chromatics and the most reliably vicious, which the Dragonarmies find useful in exactly one role: terror.</p>",
    traits: [breath("Cold", 12, "22 (5d8)", "cold", "an icy blast in a 15-foot cone")],
    actions: [{ name: "Bite", dice: [1, 10], type: "piercing", bonus: "2", ability: "str", text: "Plus 2 (1d4) cold damage." }]
  }),
  npc({
    name: "Black Dragon, Wyrmling", group: "Dragon (Chromatic)", cr: 2, type: "dragon", subtype: "Chromatic",
    alignment: "Chaotic Evil", ac: 17, hp: 33, hpFormula: "6d8 + 6", size: "med",
    abilities: A(15, 14, 13, 10, 11, 13), saves: ["dex", "con", "wis", "cha"],
    skills: { per: 1, ste: 1 }, senses: { blindsight: 10, darkvision: 60 },
    di: ["acid"], languages: ["draconic"], environment: "Swamp",
    speed: { walk: 30, fly: 60, swim: 30 },
    bio: "<p>Swamp and ruin. Blacks take a personal interest in the ruin of beautiful things and will delay a military objective to accomplish it.</p>",
    traits: [breath("Acid", 11, "22 (5d8)", "acid", "acid in a 15-foot line, 5 feet wide")],
    actions: [{ name: "Bite", dice: [1, 10], type: "piercing", bonus: "2", ability: "str", text: "Plus 2 (1d4) acid damage." }]
  }),
  npc({
    name: "Green Dragon, Wyrmling", group: "Dragon (Chromatic)", cr: 2, type: "dragon", subtype: "Chromatic",
    alignment: "Lawful Evil", ac: 17, hp: 38, hpFormula: "7d8 + 7", size: "med",
    abilities: A(15, 12, 13, 14, 11, 13), saves: ["dex", "con", "wis", "cha"],
    skills: { per: 1, ste: 1 }, senses: { blindsight: 10, darkvision: 60 },
    di: ["poison"], ci: ["poisoned"], languages: ["draconic"], environment: "Forest",
    speed: { walk: 30, fly: 60, swim: 20 },
    bio: "<p>The schemers. A green would rather turn a village against itself than burn it, and considers the latter an admission of failure.</p>",
    traits: [breath("Poison", 11, "21 (6d6)", "poison", "poisonous gas in a 15-foot cone")],
    actions: [{ name: "Bite", dice: [1, 10], type: "piercing", bonus: "2", ability: "str", text: "Plus 3 (1d6) poison damage." }]
  }),
  npc({
    name: "Blue Dragon, Wyrmling", group: "Dragon (Chromatic)", cr: 3, type: "dragon", subtype: "Chromatic",
    alignment: "Lawful Evil", ac: 17, hp: 52, hpFormula: "8d8 + 16", size: "med",
    abilities: A(17, 10, 15, 12, 11, 15), saves: ["dex", "con", "wis", "cha"],
    skills: { per: 1, ste: 1 }, senses: { blindsight: 10, darkvision: 60 },
    di: ["lightning"], languages: ["draconic"], environment: "Desert",
    speed: { walk: 30, burrow: 15, fly: 60 },
    bio: "<p>The Dragonarmies' most disciplined chromatic. Blues keep formation, follow orders, and remember slights for centuries.</p>",
    traits: [breath("Lightning", 12, "22 (4d10)", "lightning", "lightning in a 30-foot line, 5 feet wide")],
    actions: [{ name: "Bite", dice: [1, 10], type: "piercing", bonus: "3", ability: "str", text: "Plus 3 (1d6) lightning damage." }]
  }),
  npc({
    name: "Red Dragon, Wyrmling", group: "Dragon (Chromatic)", cr: 4, type: "dragon", subtype: "Chromatic",
    alignment: "Chaotic Evil", ac: 17, hp: 75, hpFormula: "10d8 + 30", size: "med",
    abilities: A(19, 10, 17, 12, 11, 15), saves: ["dex", "con", "wis", "cha"],
    skills: { per: 1, ste: 1 }, senses: { blindsight: 10, darkvision: 60 },
    di: ["fire"], languages: ["draconic"], environment: "Mountain",
    speed: { walk: 30, climb: 30, fly: 60 },
    bio: "<p>Even newly hatched, a red expects deference. The Highlords indulge this because reds are the most destructive thing they own.</p>",
    traits: [breath("Fire", 13, "24 (7d6)", "fire", "fire in a 15-foot cone")],
    actions: [{ name: "Bite", dice: [1, 10], type: "piercing", bonus: "4", ability: "str", text: "Plus 3 (1d6) fire damage." }]
  })
];

/* ------------------------- CHROMATIC ADULTS ------------------------ */

const adults = [
  npc({
    name: "White Dragon, Adult", group: "Dragon (Chromatic)", cr: 13, type: "dragon", subtype: "Chromatic",
    alignment: "Chaotic Evil", ac: 18, hp: 200, hpFormula: "16d12 + 96", size: "huge",
    abilities: A(22, 10, 22, 8, 12, 12), saves: ["dex", "con", "wis", "cha"],
    skills: { per: 2, ste: 1 }, senses: { blindsight: 60, darkvision: 120 },
    di: ["cold"], languages: ["common", "draconic"], environment: "Arctic",
    speed: { walk: 40, burrow: 30, fly: 80, swim: 40 },
    legendaryUses: 3, legres: 3,
    // Innate casting under the Monster Manual variant; Charisma sets the DC.
    spellcasting: "cha",
    bio: "<p>Icewall Glacier and the Northern Wastes. An adult white is a siege weapon with a grudge, and it does not negotiate because it does not see the point.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If the dragon fails a saving throw, it can choose to succeed instead." },
      { name: "Ice Walk", text: "The dragon can move across and climb icy surfaces without an ability check. Difficult terrain composed of ice or snow does not cost it extra movement." },
      breath("Cold", 19, "54 (12d8)", "cold", "an icy blast in a 60-foot cone"),
      frightful(14),
      dragonMagic('White Dragon, Adult')
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "6", ability: "str", reach: 10, text: "Plus 4 (1d8) cold damage." },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "6", ability: "str" },
      { name: "Tail", dice: [2, 8], type: "bludgeoning", bonus: "6", ability: "str", reach: 15 }
    ],
    legendary: legendaryTrio(19, "White", 22)
  }),
  npc({
    name: "Black Dragon, Adult", group: "Dragon (Chromatic)", cr: 14, type: "dragon", subtype: "Chromatic",
    alignment: "Chaotic Evil", ac: 19, hp: 195, hpFormula: "17d12 + 85", size: "huge",
    abilities: A(23, 14, 21, 14, 13, 17), saves: ["dex", "con", "wis", "cha"],
    skills: { per: 2, ste: 1 }, senses: { blindsight: 60, darkvision: 120 },
    di: ["acid"], languages: ["common", "draconic"], environment: "Swamp",
    speed: { walk: 40, fly: 80, swim: 40 },
    legendaryUses: 3, legres: 3,
    // Innate casting under the Monster Manual variant; Charisma sets the DC.
    spellcasting: "cha",
    bio: "<p>Blacks in the Dragonarmies are given the work nobody records: reprisals, examples, the villages that are not on any report.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If the dragon fails a saving throw, it can choose to succeed instead." },
      { name: "Amphibious", text: "The dragon can breathe air and water." },
      breath("Acid", 18, "54 (12d8)", "acid", "acid in a 60-foot line, 5 feet wide"),
      frightful(16),
      dragonMagic('Black Dragon, Adult')
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "6", ability: "str", reach: 10, text: "Plus 4 (1d8) acid damage." },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "6", ability: "str" },
      { name: "Tail", dice: [2, 8], type: "bludgeoning", bonus: "6", ability: "str", reach: 15 }
    ],
    legendary: legendaryTrio(21, "Black", 23)
  }),
  npc({
    name: "Green Dragon, Adult", group: "Dragon (Chromatic)", cr: 15, type: "dragon", subtype: "Chromatic",
    alignment: "Lawful Evil", ac: 19, hp: 207, hpFormula: "18d12 + 90", size: "huge",
    abilities: A(23, 12, 21, 18, 15, 17), saves: ["dex", "con", "wis", "cha"],
    skills: { dec: 2, ins: 1, per: 2, ste: 1 }, senses: { blindsight: 60, darkvision: 120 },
    di: ["poison"], ci: ["poisoned"], languages: ["common", "draconic"], environment: "Forest",
    speed: { walk: 40, fly: 80, swim: 40 },
    legendaryUses: 3, legres: 3,
    // Innate casting under the Monster Manual variant; Charisma sets the DC.
    spellcasting: "cha",
    bio: "<p>The most dangerous chromatic to a party that thinks it is winning. A green will talk, and mean some of it, and be several moves ahead the whole time.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If the dragon fails a saving throw, it can choose to succeed instead." },
      { name: "Amphibious", text: "The dragon can breathe air and water." },
      breath("Poison", 18, "56 (16d6)", "poison", "poisonous gas in a 60-foot cone"),
      frightful(16),
      dragonMagic('Green Dragon, Adult')
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "6", ability: "str", reach: 10, text: "Plus 7 (2d6) poison damage." },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "6", ability: "str" },
      { name: "Tail", dice: [2, 8], type: "bludgeoning", bonus: "6", ability: "str", reach: 15 }
    ],
    legendary: legendaryTrio(21, "Green", 23)
  })
];

/* ---------------------------- ANCIENTS ----------------------------- */

const ancients = [
  npc({
    name: "Blue Dragon, Ancient", group: "Dragon (Chromatic)", cr: 23, type: "dragon", subtype: "Chromatic",
    alignment: "Lawful Evil", ac: 22, hp: 481, hpFormula: "26d20 + 208", size: "grg",
    abilities: A(29, 10, 27, 18, 17, 21), saves: ["dex", "con", "wis", "cha"],
    skills: { per: 2, ste: 1 }, senses: { blindsight: 60, darkvision: 120 },
    di: ["lightning"], languages: ["common", "draconic"], environment: "Desert",
    speed: { walk: 40, burrow: 40, fly: 80 },
    legendaryUses: 3, legres: 3,
    // Innate casting under the Monster Manual variant; Charisma sets the DC.
    spellcasting: "cha",
    bio: "<p>An ancient blue is a Highlord's peer, not a Highlord's mount, and the distinction is enforced. Use one when the campaign needs the war to stop being winnable for an evening.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If the dragon fails a saving throw, it can choose to succeed instead." },
      breath("Lightning", 23, "88 (16d10)", "lightning", "lightning in a 120-foot line, 10 feet wide"),
      frightful(20),
      dragonMagic('Blue Dragon, Ancient')
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "9", ability: "str", reach: 15, text: "Plus 11 (2d10) lightning damage." },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "9", ability: "str", reach: 10 },
      { name: "Tail", dice: [2, 8], type: "bludgeoning", bonus: "9", ability: "str", reach: 20 }
    ],
    legendary: legendaryTrio(25, "Blue", 29)
  }),
  npc({
    name: "Red Dragon, Ancient", group: "Dragon (Chromatic)", cr: 24, type: "dragon", subtype: "Chromatic",
    alignment: "Chaotic Evil", ac: 22, hp: 546, hpFormula: "28d20 + 252", size: "grg",
    abilities: A(30, 10, 29, 18, 15, 23), saves: ["dex", "con", "wis", "cha"],
    skills: { per: 2, ste: 1 }, senses: { blindsight: 60, darkvision: 120 },
    di: ["fire"], languages: ["common", "draconic"], environment: "Mountain",
    speed: { walk: 40, climb: 40, fly: 80 },
    legendaryUses: 3, legres: 3,
    // Innate casting under the Monster Manual variant; Charisma sets the DC.
    spellcasting: "cha",
    bio: "<p>The largest thing the Dragonarmies can put in the sky. An ancient red does not serve Takhisis so much as agree with her, for now.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If the dragon fails a saving throw, it can choose to succeed instead." },
      breath("Fire", 24, "91 (26d6)", "fire", "fire in a 90-foot cone"),
      frightful(21),
      dragonMagic('Red Dragon, Ancient')
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "10", ability: "str", reach: 15, text: "Plus 14 (4d6) fire damage." },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "10", ability: "str", reach: 10 },
      { name: "Tail", dice: [2, 8], type: "bludgeoning", bonus: "10", ability: "str", reach: 20 }
    ],
    legendary: legendaryTrio(26, "Red", 30)
  }),
  npc({
    name: "Silver Dragon, Ancient", group: "Dragon (Metallic)", cr: 23, type: "dragon", subtype: "Metallic",
    alignment: "Lawful Good", ac: 22, hp: 487, hpFormula: "25d20 + 225", size: "grg",
    abilities: A(30, 10, 29, 18, 15, 23), saves: ["dex", "con", "wis", "cha"],
    skills: { arc: 1, his: 1, per: 2, ste: 1 }, senses: { blindsight: 60, darkvision: 120 },
    di: ["cold"], languages: ["common", "draconic"], environment: "Mountain",
    speed: { walk: 40, fly: 80 },
    legendaryUses: 3, legres: 3,
    // Innate casting under the Monster Manual variant; Charisma sets the DC.
    spellcasting: "cha",
    bio: "<p>Silvers took the Oath and kept it while their eggs were being stolen. An ancient silver returning to the war is the single best thing that can happen to Solamnia, and it arrives carrying three centuries of guilt.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If the dragon fails a saving throw, it can choose to succeed instead." },
      { name: "Change Shape", text: "The dragon magically polymorphs into a humanoid or beast of CR equal to or less than its own, or back. It retains its alignment, personality, Intelligence, Wisdom, Charisma, hit points and hit dice." },
      breath("Cold", 24, "67 (15d8)", "cold", "an icy blast in a 90-foot cone"),
      { name: "Breath Weapon: Paralyzing", text: "<em>Recharge 5&ndash;6.</em> The dragon exhales paralyzing gas in a 90-foot cone. Each creature must succeed on a DC 24 Constitution saving throw or be paralyzed for 1 minute, repeating the save at the end of each of its turns." },
      frightful(21),
      dragonMagic('Silver Dragon, Ancient')
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "10", ability: "str", reach: 15 },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "10", ability: "str", reach: 10 },
      { name: "Tail", dice: [2, 8], type: "bludgeoning", bonus: "10", ability: "str", reach: 20 }
    ],
    legendary: legendaryTrio(25, "Silver", 30)
  }),
  npc({
    name: "Gold Dragon, Ancient", group: "Dragon (Metallic)", cr: 24, type: "dragon", subtype: "Metallic",
    alignment: "Lawful Good", ac: 22, hp: 546, hpFormula: "28d20 + 252", size: "grg",
    abilities: A(30, 14, 29, 18, 17, 28), saves: ["dex", "con", "wis", "cha"],
    skills: { ins: 2, per: 2, ste: 1 }, senses: { blindsight: 60, darkvision: 120 },
    di: ["fire"], languages: ["common", "draconic"], environment: "Any",
    speed: { walk: 40, fly: 80, swim: 40 },
    legendaryUses: 3, legres: 3,
    // Innate casting under the Monster Manual variant; Charisma sets the DC.
    spellcasting: "cha",
    bio: "<p>Paladine's own. A gold will not fight a war it can end another way, and will keep looking for that way long past the point everyone else has stopped.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If the dragon fails a saving throw, it can choose to succeed instead." },
      { name: "Amphibious", text: "The dragon can breathe air and water." },
      { name: "Change Shape", text: "The dragon magically polymorphs into a humanoid or beast of CR equal to or less than its own, or back." },
      breath("Fire", 24, "71 (13d10)", "fire", "fire in a 90-foot cone"),
      { name: "Breath Weapon: Weakening", text: "<em>Recharge 5&ndash;6.</em> The dragon exhales weakening gas in a 90-foot cone. Each creature must succeed on a DC 24 Strength saving throw or have disadvantage on Strength-based attack rolls, checks and saves for 1 minute, repeating the save at the end of each of its turns." },
      frightful(21),
      dragonMagic('Gold Dragon, Ancient')
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "10", ability: "str", reach: 15 },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "10", ability: "str", reach: 10 },
      { name: "Tail", dice: [2, 8], type: "bludgeoning", bonus: "10", ability: "str", reach: 20 }
    ],
    legendary: legendaryTrio(26, "Gold", 30)
  })
];

/* ------------------------ THE OTHER METALLICS ---------------------- */

const metallics = [
  npc({
    name: "Brass Dragon, Young", group: "Dragon (Metallic)", cr: 6, type: "dragon", subtype: "Metallic",
    alignment: "Chaotic Good", ac: 17, hp: 110, hpFormula: "13d10 + 39", size: "lg",
    abilities: A(19, 10, 17, 12, 11, 15), saves: ["dex", "con", "wis", "cha"],
    skills: { per: 2, ste: 1 }, senses: { blindsight: 30, darkvision: 120 },
    di: ["fire"], languages: ["common", "draconic"], environment: "Desert",
    speed: { walk: 40, burrow: 20, fly: 80 },
    bio: "<p>Brass dragons talk. Constantly. A young brass will trade genuinely valuable intelligence for an hour of conversation and consider the party to have got the worse end of it.</p>",
    traits: [
      breath("Fire", 14, "42 (12d6)", "fire", "fire in a 40-foot line, 5 feet wide"),
      { name: "Breath Weapon: Sleep", text: "<em>Recharge 5&ndash;6.</em> The dragon exhales sleep gas in a 30-foot cone. Each creature must succeed on a DC 14 Constitution saving throw or fall unconscious for 5 minutes, waking if it takes damage or someone uses an action to wake it." }
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "4", ability: "str", reach: 10 },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "4", ability: "str" }
    ]
  }),
  npc({
    name: "Bronze Dragon, Young", group: "Dragon (Metallic)", cr: 8, type: "dragon", subtype: "Metallic",
    alignment: "Lawful Good", ac: 18, hp: 142, hpFormula: "15d10 + 60", size: "lg",
    abilities: A(21, 10, 19, 14, 13, 17), saves: ["dex", "con", "wis", "cha"],
    skills: { ins: 1, per: 2, ste: 1 }, senses: { blindsight: 30, darkvision: 120 },
    di: ["lightning"], languages: ["common", "draconic"], environment: "Coast",
    speed: { walk: 40, fly: 80, swim: 40 },
    bio: "<p>Bronzes take an interest in wars fought for the right reasons and are notably willing to check which kind this is before committing.</p>",
    traits: [
      { name: "Amphibious", text: "The dragon can breathe air and water." },
      breath("Lightning", 15, "55 (10d10)", "lightning", "lightning in a 60-foot line, 5 feet wide"),
      { name: "Breath Weapon: Repulsion", text: "<em>Recharge 5&ndash;6.</em> The dragon exhales repulsion energy in a 30-foot cone. Each creature must succeed on a DC 15 Strength saving throw or be driven 40 feet away from the dragon." }
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "5", ability: "str", reach: 10 },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "5", ability: "str" }
    ]
  }),
  npc({
    name: "Copper Dragon, Young", group: "Dragon (Metallic)", cr: 7, type: "dragon", subtype: "Metallic",
    alignment: "Chaotic Good", ac: 17, hp: 119, hpFormula: "14d10 + 42", size: "lg",
    abilities: A(19, 12, 17, 16, 13, 15), saves: ["dex", "con", "wis", "cha"],
    skills: { dec: 1, per: 2, ste: 1 }, senses: { blindsight: 30, darkvision: 120 },
    di: ["acid"], languages: ["common", "draconic"], environment: "Hill",
    speed: { walk: 40, climb: 40, fly: 80 },
    bio: "<p>Coppers are the reason a serious meeting at Wayreth can be derailed by a practical joke. They are also, reliably, the ones who turn up.</p>",
    traits: [
      breath("Acid", 14, "40 (9d8)", "acid", "acid in a 40-foot line, 5 feet wide"),
      { name: "Breath Weapon: Slowing", text: "<em>Recharge 5&ndash;6.</em> The dragon exhales slowing gas in a 30-foot cone. Each creature must succeed on a DC 14 Constitution saving throw or have its speed halved and lose its reaction for 1 minute, repeating the save at the end of each of its turns." }
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "4", ability: "str", reach: 10 },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "4", ability: "str" }
    ]
  }),
  npc({
    name: "Silver Dragon, Adult", group: "Dragon (Metallic)", cr: 16, type: "dragon", subtype: "Metallic",
    alignment: "Lawful Good", ac: 19, hp: 243, hpFormula: "18d12 + 126", size: "huge",
    abilities: A(27, 10, 25, 16, 13, 21), saves: ["dex", "con", "wis", "cha"],
    skills: { arc: 1, his: 1, per: 2, ste: 1 }, senses: { blindsight: 60, darkvision: 120 },
    di: ["cold"], languages: ["common", "draconic"], environment: "Mountain",
    speed: { walk: 40, fly: 80 },
    legendaryUses: 3, legres: 3,
    // Innate casting under the Monster Manual variant; Charisma sets the DC.
    spellcasting: "cha",
    bio: "<p>The dragon most likely to arrive at the High Clerist's Tower when everything has gone wrong.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If the dragon fails a saving throw, it can choose to succeed instead." },
      { name: "Change Shape", text: "The dragon magically polymorphs into a humanoid or beast of CR equal to or less than its own, or back." },
      breath("Cold", 22, "58 (13d8)", "cold", "an icy blast in a 60-foot cone"),
      frightful(19),
      dragonMagic('Silver Dragon, Adult')
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "8", ability: "str", reach: 10 },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "8", ability: "str" },
      { name: "Tail", dice: [2, 8], type: "bludgeoning", bonus: "8", ability: "str", reach: 15 }
    ],
    legendary: legendaryTrio(23, "Silver", 27)
  })
];

export default [...wyrmlings, ...adults, ...ancients, ...metallics];
