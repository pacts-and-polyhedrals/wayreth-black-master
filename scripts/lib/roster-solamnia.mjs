import { npc } from "./statblock.mjs";
import { spellFeatures } from "./caster-loadouts.mjs";

const A = (str, dex, con, int, wis, cha) => ({ str, dex, con, int, wis, cha });

/* ================================================================== *
 *  SOLAMNIA — Solanthus, the High Clerist's Tower, Palanthas.
 *
 *  The party meets these as allies, as obstacles, and eventually as
 *  casualties. Statting the defenders matters because Arc V asks the
 *  players to spend them, and a number on a page is easier to spend
 *  than a person. Give every Knight a name before the first fight.
 * ================================================================== */

const knights = [
  npc({
    name: "Knight of the Crown", group: "Solamnia", cr: 3, type: "humanoid", subtype: "Human",
    alignment: "Lawful Good", ac: 18, hp: 52, hpFormula: "8d8 + 16", size: "med",
    abilities: A(16, 11, 14, 11, 13, 14), saves: ["con", "wis"],
    skills: { ath: 1 }, languages: ["common"], langCustom: "Solamnic", environment: "Urban",
    speed: { walk: 30 },
    bio: "<p>The first Order of the Knighthood: loyalty and obedience. Crowns are the youngest Knights and the ones most likely to die proving something.</p>",
    traits: [
      { name: "Oath of Loyalty", text: "The Knight has advantage on saving throws against being frightened or charmed while an ally it has sworn to protect is within 30 feet." },
      { name: "Est Sularus oth Mithas", text: "When reduced to 0 hit points but not killed outright, the Knight may choose to drop to 1 hit point instead. Once per long rest, and only while defending a position it has been ordered to hold." }
    ],
    actions: [
      { name: "Multiattack", text: "The Knight makes two longsword attacks.", section: "action" },
      { name: "Longsword", dice: [1, 8], type: "slashing", bonus: "3", ability: "str" },
      { name: "Heavy Crossbow", dice: [1, 10], type: "piercing", bonus: "0", range: [100, 400] }
    ]
  }),
  npc({
    name: "Knight of the Sword", group: "Solamnia", cr: 6, type: "humanoid", subtype: "Human",
    alignment: "Lawful Good", ac: 19, hp: 97, hpFormula: "13d8 + 39", size: "med",
    abilities: A(18, 11, 16, 12, 16, 15), saves: ["con", "wis", "cha"],
    skills: { ath: 1, ins: 1, rel: 1 }, languages: ["common"], langCustom: "Solamnic", environment: "Urban",
    speed: { walk: 30 }, spellcasting: "wis", spellLevel: 5,
    bio: "<p>The second Order: courage and faith. Swords carry the Knighthood's religious authority, which after the Cataclysm was an awkward thing to carry and is suddenly not.</p>",
    traits: [
      ...spellFeatures("Knight of the Sword"),
      { name: "Unyielding", text: "The Knight has advantage on saving throws against being frightened, and cannot be forced to move against its will while it holds ground it has been ordered to defend." }
    ],
    actions: [
      { name: "Multiattack", text: "The Knight makes two longsword attacks and one shield bash.", section: "action" },
      { name: "Longsword", dice: [1, 8], type: "slashing", bonus: "4", ability: "str", text: "Plus 7 (2d6) radiant damage against fiends and undead." },
      { name: "Shield Bash", dice: [1, 6], type: "bludgeoning", bonus: "4", ability: "str" }
    ],
    reactions: [
      { name: "Interpose", text: "When a creature the Knight can see within 5 feet is hit by an attack, the Knight may take the hit instead." }
    ]
  }),
  npc({
    name: "Knight of the Rose", group: "Solamnia", cr: 10, type: "humanoid", subtype: "Human",
    alignment: "Lawful Good", ac: 20, hp: 157, hpFormula: "18d8 + 72", size: "med",
    abilities: A(20, 12, 18, 14, 17, 18), saves: ["str", "con", "wis", "cha"],
    skills: { ath: 1, ins: 1, per: 1 }, languages: ["common"], langCustom: "Solamnic", environment: "Urban",
    speed: { walk: 30 }, spellcasting: "cha", spellLevel: 9,
    bio: "<p>The third Order: wisdom and justice. A Rose commands, and the whole apparatus of the Knighthood is arranged so that the Rose is the one who has to decide.</p>",
    traits: [
      { name: "Legendary Command", text: "Allies within 30 feet that can see and hear the Knight add +2 to saving throws and cannot be frightened." },
      { name: "Aura of Courage", text: "The Knight and allies within 10 feet are immune to the frightened condition." },
      ...spellFeatures("Knight of the Rose")
    ],
    actions: [
      { name: "Multiattack", text: "The Knight makes three longsword attacks." },
      { name: "Longsword", dice: [2, 8], type: "slashing", bonus: "5", ability: "str", text: "Plus 10 (3d6) radiant damage against fiends and undead." }
    ],
    reactions: [
      { name: "Rally", text: "When an ally within 30 feet drops to 0 hit points, the Knight may allow it to make a death saving throw immediately with advantage." }
    ],
    legendaryUses: 0
  }),
  npc({
    name: "Solamnic Foot Soldier", group: "Solamnia", cr: 0.5, type: "humanoid", subtype: "Human",
    alignment: "Lawful Neutral", ac: 16, hp: 22, hpFormula: "4d8 + 4", size: "med",
    abilities: A(14, 12, 13, 10, 11, 10), languages: ["common"], langCustom: "Solamnic", environment: "Urban",
    speed: { walk: 30 },
    bio: "<p>Not a Knight. A levy from Solanthus or Kalaman with three weeks of drill and a spear, standing where they were told to stand.</p>",
    traits: [{ name: "Formation Fighting", text: "The soldier has advantage on attack rolls against a creature if at least one other Solamnic soldier is within 5 feet of it and not incapacitated." }],
    actions: [
      { name: "Spear", dice: [1, 6], type: "piercing", bonus: "2", ability: "str", reach: 10 },
      { name: "Light Crossbow", dice: [1, 8], type: "piercing", bonus: "1", range: [80, 320] }
    ]
  }),
  npc({
    name: "Solanthus Watch Captain", group: "Solamnia", cr: 4, type: "humanoid", subtype: "Human",
    alignment: "Lawful Neutral", ac: 17, hp: 71, hpFormula: "11d8 + 22", size: "med",
    abilities: A(16, 14, 14, 12, 14, 13), saves: ["str", "wis"],
    skills: { ins: 1, inv: 1, per: 1 }, languages: ["common"], langCustom: "Solamnic", environment: "Urban",
    speed: { walk: 30 },
    bio: "<p>Runs the gate the party has to get through. Not corrupt, not stupid, and extremely tired of people with sealed letters from wizards.</p>",
    traits: [{ name: "Reads People", text: "The captain has advantage on Wisdom (Insight) checks made to determine whether someone is lying about their business in the city." }],
    actions: [
      { name: "Multiattack", text: "The captain makes two longsword attacks." },
      { name: "Longsword", dice: [1, 8], type: "slashing", bonus: "3", ability: "str" }
    ]
  }),
  npc({
    name: "High Clerist Siege Engineer", group: "Solamnia", cr: 2, type: "humanoid", subtype: "Human",
    alignment: "Lawful Neutral", ac: 14, hp: 39, hpFormula: "6d8 + 12", size: "med",
    abilities: A(13, 13, 15, 16, 12, 10), skills: { inv: 1 },
    languages: ["common", "dwarvish"], langCustom: "Solamnic", environment: "Urban", speed: { walk: 30 },
    bio: "<p>The reason the Tower holds as long as it does. Knows the walls better than the Knights commanding them and says so.</p>",
    traits: [
      { name: "Fortify", text: "Over 10 minutes the engineer can reinforce a 20-foot section of wall or a gate, granting it +5 AC and 50 temporary hit points until the end of the siege." },
      { name: "Ballista Crew", text: "While directing a siege weapon, the engineer's attacks with it gain a +4 bonus to hit and deal an additional 10 (3d6) damage." }
    ],
    actions: [{ name: "Hand Axe", dice: [1, 6], type: "slashing", bonus: "1", ability: "str" }]
  }),
  npc({
    name: "Palanthas City Guard", group: "Solamnia", cr: 1, type: "humanoid", subtype: "Human",
    alignment: "Lawful Neutral", ac: 16, hp: 32, hpFormula: "5d8 + 10", size: "med",
    abilities: A(14, 12, 14, 10, 12, 11), skills: { per: 1 },
    languages: ["common"], langCustom: "Solamnic", environment: "Urban", speed: { walk: 30 },
    bio: "<p>Palanthas has not been attacked in living memory and its guard reflects that. Polite, well-equipped, and entirely unprepared for what is coming.</p>",
    traits: [{ name: "Civil Authority", text: "Within Palanthas, the guard can call for reinforcements as an action. 1d4 more guards arrive in 1d6 rounds." }],
    actions: [
      { name: "Halberd", dice: [1, 10], type: "slashing", bonus: "2", ability: "str", reach: 10 },
      { name: "Light Crossbow", dice: [1, 8], type: "piercing", bonus: "1", range: [80, 320] }
    ]
  }),
  npc({
    name: "Aesthetic of the Great Library", group: "Solamnia", cr: 1, type: "humanoid", subtype: "Human",
    alignment: "Neutral", ac: 11, hp: 27, hpFormula: "6d8", size: "med",
    abilities: A(9, 12, 10, 18, 15, 12), skills: { arc: 1, his: 2, inv: 1 },
    languages: ["common", "elvish", "draconic"], langCustom: "Solamnic", environment: "Urban", speed: { walk: 30 },
    bio: "<p>Astinus's order of scholars. They do not intervene in history. They record it, and several of them find this harder than they will admit.</p>",
    traits: [
      { name: "Perfect Recall", text: "The Aesthetic can recall any passage it has read. It has advantage on Intelligence (History) checks and automatically succeeds on any check to remember something recorded in the Great Library." },
      { name: "Does Not Intervene", text: "The Aesthetic will not take a hostile action, even in self-defence, unless the Library itself is threatened. It will help the wounded, and considers that a different category." }
    ],
    actions: [{ name: "Quarterstaff", dice: [1, 6], type: "bludgeoning", bonus: "-1", ability: "str" }]
  })
];

export default knights;
