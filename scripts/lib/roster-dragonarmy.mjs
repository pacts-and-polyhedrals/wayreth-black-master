import { npc } from "./statblock.mjs";
import { spellFeatures } from "./caster-loadouts.mjs";

/* Shorthand */
const A = (str, dex, con, int, wis, cha) => ({ str, dex, con, int, wis, cha });

/* ================================================================== *
 *  DRACONIANS — the Dragonarmy's made soldiers.
 *  Every one has a death throe; that is the defining fact about them
 *  and the reason fighting them is a different problem to fighting men.
 * ================================================================== */

const draconians = [
  npc({
    name: "Baaz Draconian", group: "Draconian", cr: 1, type: "dragon", subtype: "Draconian",
    alignment: "Lawful Evil", ac: 14, hp: 22, hpFormula: "4d8 + 4", size: "med",
    abilities: A(14, 12, 13, 9, 10, 11), senses: { darkvision: 60 },
    languages: ["common", "draconic"], environment: "Any",
    speed: { walk: 30, fly: 20 },
    bio: "<p>Made from the corrupted egg of a brass dragon. The most numerous and least regarded of the draconians, which does not make them safe.</p>",
    traits: [
      { name: "Death Throe: Stone", text: "When a baaz drops to 0 hit points, its body turns to stone and any weapon embedded in it is caught fast. A creature that struck the killing blow with a melee weapon must succeed on a DC 11 Strength check or the weapon is stuck. Freeing it takes an action and a DC 11 Strength check. The body crumbles to dust after 1 minute." },
      { name: "Glide", text: "The baaz cannot truly fly, but it can glide, falling at 60 feet per round without taking falling damage and moving up to 20 feet horizontally for every 10 feet it descends." }
    ],
    actions: [
      { name: "Shortsword", dice: [1, 6], type: "slashing", bonus: "2", ability: "str" },
      { name: "Claw", dice: [1, 4], type: "slashing", bonus: "2", ability: "str" }
    ]
  }),

  npc({
    name: "Kapak Draconian", group: "Draconian", cr: 3, type: "dragon", subtype: "Draconian",
    alignment: "Lawful Evil", ac: 15, hp: 45, hpFormula: "7d8 + 14", size: "med",
    abilities: A(14, 16, 15, 10, 11, 10), saves: ["dex"], skills: { ste: 1 },
    senses: { darkvision: 60 }, languages: ["common", "draconic"], environment: "Any",
    speed: { walk: 30, fly: 20 },
    bio: "<p>Made from a copper dragon's egg. Assassins. Their saliva is a paralytic and they know exactly how to use it.</p>",
    traits: [
      { name: "Death Throe: Acid", text: "When a kapak drops to 0 hit points, it dissolves into a pool of acid filling its space for 1 minute. A creature that enters the pool or starts its turn there takes 11 (2d10) acid damage." },
      { name: "Venomous Saliva", text: "As a bonus action the kapak can lick its blade. The next creature it hits with that weapon before the end of its next turn must succeed on a DC 12 Constitution saving throw or be paralyzed for 1 minute, repeating the save at the end of each of its turns." }
    ],
    actions: [
      { name: "Scimitar", dice: [1, 6], type: "slashing", bonus: "3", ability: "dex" },
      { name: "Shortbow", dice: [1, 6], type: "piercing", bonus: "3", range: [80, 320] }
    ]
  }),

  npc({
    name: "Bozak Draconian", group: "Draconian", cr: 4, type: "dragon", subtype: "Draconian",
    alignment: "Lawful Evil", ac: 16, hp: 66, hpFormula: "12d8 + 12", size: "med",
    abilities: A(14, 14, 13, 15, 12, 13), saves: ["int"], skills: { arc: 1 },
    senses: { darkvision: 60 }, languages: ["common", "draconic"], environment: "Any",
    speed: { walk: 30, fly: 20 }, spellcasting: "int", spellLevel: 5,
    bio: "<p>Made from a bronze dragon's egg. The Dragonarmy's field spellcasters, and the reason a draconian patrol cannot simply be outmanoeuvred.</p>",
    traits: [
      { name: "Death Throe: Detonation", text: "When a bozak drops to 0 hit points, its flesh burns away and its skeleton explodes at the start of its next turn. Each creature within 10 feet must make a DC 13 Dexterity saving throw, taking 14 (4d6) force damage on a failure, or half as much on a success." },
      ...spellFeatures("Bozak Draconian")
    ],
    actions: [{ name: "Longsword", dice: [1, 8], type: "slashing", bonus: "2", ability: "str" }]
  }),

  npc({
    name: "Sivak Draconian", group: "Draconian", cr: 6, type: "dragon", subtype: "Draconian",
    alignment: "Lawful Evil", ac: 17, hp: 102, hpFormula: "12d10 + 36", size: "lg",
    abilities: A(18, 14, 17, 12, 13, 15), saves: ["dex", "con"], skills: { dec: 2, ste: 1 },
    senses: { darkvision: 60 }, languages: ["common", "draconic"], environment: "Any",
    speed: { walk: 40, fly: 60 },
    bio: "<p>Made from a silver dragon's egg. Officers, infiltrators, and the reason no Dragonarmy prisoner can be trusted to be who they appear.</p>",
    traits: [
      { name: "Death Throe: Shadow", text: "When a sivak drops to 0 hit points while it has taken the shape of a humanoid it has killed, it collapses into a black shadow of that form burned into the ground, which remains for a year. If it is in its own form, it bursts into flame instead: each creature within 5 feet takes 10 (3d6) fire damage." },
      { name: "Deathshape", text: "When the sivak kills a Medium or Small humanoid, it can use a bonus action to assume that creature's exact appearance for up to 24 hours, including its voice. Its statistics are unchanged. A creature that succeeds on a DC 18 Wisdom (Insight) check after a minute of conversation notices something wrong but cannot say what." }
    ],
    actions: [
      { name: "Multiattack", text: "The sivak makes two greatsword attacks, or one greatsword attack and one claw attack.", section: "action" },
      { name: "Greatsword", dice: [2, 6], type: "slashing", bonus: "4", ability: "str" },
      { name: "Claw", dice: [2, 4], type: "slashing", bonus: "4", ability: "str" }
    ]
  }),

  npc({
    name: "Aurak Draconian", group: "Draconian", cr: 9, type: "dragon", subtype: "Draconian",
    alignment: "Lawful Evil", ac: 18, hp: 133, hpFormula: "14d8 + 70", size: "med",
    abilities: A(16, 16, 20, 18, 15, 18), saves: ["con", "int", "cha"], skills: { arc: 2, dec: 2 },
    senses: { darkvision: 120, truesight: 30 }, languages: ["common", "draconic", "abyssal"],
    // Innate casting only: a caster level here would derive nine levels of
    // spell slots the aurak has no spells to put in.
    environment: "Any", speed: { walk: 40 }, spellcasting: "int", spellLevel: 0,
    dr: ["fire"], ci: ["charmed", "frightened"],
    bio: "<p>Made from a gold dragon's egg, and the rarest of them. Auraks do not serve in units. They are given objectives.</p>",
    traits: [
      { name: "Death Throe: Immolation", text: "When an aurak drops to 0 hit points, it does not die immediately. It becomes a being of raw energy for 1 round, during which it cannot be harmed and can move at double speed, and then detonates. Each creature within 20 feet must make a DC 17 Dexterity saving throw, taking 42 (12d6) fire damage on a failure, or half as much on a success." },
      { name: "Innate Spellcasting", text: "Spell save DC 16. At will: <em>invisibility</em> (self only), <em>misty step</em>, <em>suggestion</em>. 3/day each: <em>dispel magic</em>, <em>fear</em>, <em>lightning bolt</em>. 1/day each: <em>dominate person</em>, <em>wall of fire</em>." },
      { name: "Magic Resistance", text: "The aurak has advantage on saving throws against spells and other magical effects." }
    ],
    actions: [
      { name: "Multiattack", text: "The aurak makes two claw attacks and uses Withering Gaze if available.", section: "action" },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "3", extra: [[2, 6, "fire"]], ability: "str" },
      { name: "Withering Gaze", text: "One creature within 60 feet that the aurak can see must succeed on a DC 16 Wisdom saving throw or take 22 (5d8) psychic damage and be frightened until the end of its next turn.", section: "action" }
    ]
  })
];

/* ================================================================== *
 *  DRAGONARMY — the soldiers, officers and mages of the Highlords.
 * ================================================================== */

const dragonarmy = [
  npc({
    name: "Dragonarmy Recruit", group: "Dragonarmy", cr: 0.5, type: "humanoid", subtype: "any race",
    alignment: "Lawful Evil", ac: 15, hp: 16, hpFormula: "3d8 + 3", size: "med",
    abilities: A(14, 12, 13, 10, 10, 9), languages: ["common"], environment: "Any",
    bio: "<p>Conscripted, badly trained, and more frightened of their officers than of the party.</p>",
    traits: [{ name: "Pack Tactics", text: "The recruit has advantage on an attack roll against a creature if at least one of its allies is within 5 feet of the creature and the ally is not incapacitated." }],
    actions: [
      { name: "Spear", dice: [1, 6], type: "piercing", bonus: "2", ability: "str" },
      { name: "Light Crossbow", dice: [1, 8], type: "piercing", bonus: "1", range: [80, 320] }
    ]
  }),

  npc({
    name: "Dragonarmy Veteran", group: "Dragonarmy", cr: 3, type: "humanoid", subtype: "any race",
    alignment: "Lawful Evil", ac: 17, hp: 58, hpFormula: "9d8 + 18", size: "med",
    abilities: A(16, 13, 15, 11, 12, 12), skills: { ath: 1, itm: 1 },
    languages: ["common"], environment: "Any",
    bio: "<p>Career soldiers who have taken cities and expect to take more.</p>",
    traits: [{ name: "Disciplined", text: "The veteran has advantage on saving throws against being frightened while it can see an allied officer within 30 feet." }],
    actions: [
      { name: "Multiattack", text: "The veteran makes two longsword attacks.", section: "action" },
      { name: "Longsword", dice: [1, 8], type: "slashing", bonus: "3", ability: "str" },
      { name: "Heavy Crossbow", dice: [1, 10], type: "piercing", bonus: "1", range: [100, 400] }
    ]
  }),

  npc({
    name: "Dragonarmy Officer", group: "Dragonarmy", cr: 6, type: "humanoid", subtype: "any race",
    alignment: "Lawful Evil", ac: 18, hp: 97, hpFormula: "13d8 + 39", size: "med",
    abilities: A(18, 14, 16, 13, 13, 16), saves: ["str", "con"], skills: { ath: 2, itm: 2, prc: 1 },
    languages: ["common", "draconic"], environment: "Any",
    bio: "<p>They earned the rank and intend to keep it. Killing the officer is usually worth more than killing four soldiers.</p>",
    traits: [
      { name: "Command the Line", text: "Allied Dragonarmy creatures within 30 feet that can hear the officer have advantage on saving throws against being charmed or frightened." },
      { name: "Brutal Critical", text: "When the officer scores a critical hit with a melee weapon, it rolls one additional damage die." }
    ],
    actions: [
      { name: "Multiattack", text: "The officer makes three attacks with its glaive.", section: "action" },
      { name: "Glaive", dice: [1, 10], type: "slashing", bonus: "4", reach: 10, ability: "str" }
    ],
    reactions: [{ name: "Parry", text: "The officer adds 3 to its AC against one melee attack that would hit it. To do so, it must see the attacker and be wielding a melee weapon." }]
  }),

  npc({
    name: "Dragonarmy Battle Mage", group: "Dragonarmy", cr: 7, type: "humanoid", subtype: "any race",
    alignment: "Neutral Evil", ac: 15, hp: 82, hpFormula: "15d8 + 15", size: "med",
    abilities: A(9, 16, 13, 18, 13, 12), saves: ["int", "wis"], skills: { arc: 2, his: 1 },
    languages: ["common", "draconic"], environment: "Any", spellcasting: "int", spellLevel: 9,
    bio: "<p>Renegades, mostly. The Conclave keeps a list and the list gets longer every season.</p>",
    traits: [
      ...spellFeatures("Dragonarmy Battle Mage"),
      { name: "Unlicensed", text: "The battle mage has never taken the Test of High Sorcery and cannot Overreach. It has disadvantage on saving throws against spells cast by a Wizard of High Sorcery who names it renegade aloud." }
    ],
    actions: [{ name: "Quarterstaff", dice: [1, 6], type: "bludgeoning", bonus: "-1", ability: "str" }]
  }),

  npc({
    name: "Dragonarmy Intelligence Agent", group: "Dragonarmy", cr: 5, type: "humanoid", subtype: "any race",
    alignment: "Lawful Evil", ac: 15, hp: 71, hpFormula: "13d8 + 13", size: "med",
    abilities: A(11, 18, 12, 16, 15, 16), saves: ["dex", "int"],
    skills: { dec: 2, ins: 2, inv: 2, prc: 2, ste: 2 },
    languages: ["common", "draconic", "elvish"], environment: "Any", senses: { special: "passive Perception 17" },
    bio: "<p>Commander Veyrath's people. They are not trying to capture the party. They are trying to find out where the party is going.</p>",
    traits: [
      { name: "Reads the Room", text: "The agent has advantage on Wisdom (Insight) checks made to determine whether a creature is lying, and on Charisma (Deception) checks made to maintain a cover identity it has held for at least a day." },
      { name: "Evasion", text: "When subjected to an effect allowing a Dexterity save for half damage, the agent takes no damage on a success and half on a failure." }
    ],
    actions: [
      { name: "Multiattack", text: "The agent makes two rapier attacks.", section: "action" },
      { name: "Rapier", dice: [1, 8], type: "piercing", bonus: "4", ability: "dex", extra: [[2, 6, "poison"]] }
    ],
    reactions: [{ name: "Vanish", text: "When a creature the agent can see ends its turn within 30 feet, the agent moves up to its speed without provoking opportunity attacks and attempts to hide." }]
  })
];

export default [...draconians, ...dragonarmy];
