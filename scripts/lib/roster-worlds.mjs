import { npc } from "./statblock.mjs";
import { spellFeatures } from "./caster-loadouts.mjs";

const A = (str, dex, con, int, wis, cha) => ({ str, dex, con, int, wis, cha });

/* ================================================================== *
 *  THE ABYSS — Arcs V and VI. What Raistlin binds through the Portal.
 * ================================================================== */

const abyssal = [
  npc({
    name: "Bound Abyssal Lesser", group: "Abyssal", cr: 4, type: "fiend", subtype: "Demon",
    alignment: "Chaotic Evil", ac: 15, hp: 68, hpFormula: "8d8 + 32", size: "med",
    abilities: A(17, 15, 18, 7, 11, 9), senses: { darkvision: 120 },
    languages: ["abyssal"], langCustom: "telepathy 60 ft.", environment: "Abyss",
    dr: ["cold", "fire", "lightning"], di: ["poison"], ci: ["poisoned"],
    bio: "<p>The first things through the Portal. They obey, and they count the days.</p>",
    traits: [
      { name: "Bound by True Name", text: "While the binding holds, the creature cannot attack, harm, or knowingly permit harm to come to the wizard whose seal it bears. It will obey the letter of an instruction and nothing more." },
      { name: "Magic Resistance", text: "Advantage on saving throws against spells and other magical effects." }
    ],
    actions: [
      { name: "Multiattack", text: "The demon makes two claw attacks.", section: "action" },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "3", ability: "str" }
    ]
  }),
  npc({
    name: "Abyssal Warbeast", group: "Abyssal", cr: 8, type: "fiend", subtype: "Demon",
    alignment: "Chaotic Evil", ac: 17, hp: 133, hpFormula: "14d10 + 56", size: "lg",
    abilities: A(20, 14, 19, 6, 12, 10), saves: ["str", "con"], senses: { darkvision: 120 },
    languages: ["abyssal"], langCustom: "Solamnic", environment: "Abyss", speed: { walk: 50 },
    dr: ["cold", "fire", "lightning"], di: ["poison"], ci: ["poisoned", "frightened"],
    bio: "<p>What the Black Host actually looks like on a battlefield. Dragonarmy formations break rather than receive a charge from these.</p>",
    traits: [
      { name: "Charge", text: "If the warbeast moves at least 20 feet straight toward a target and hits it with a gore attack on the same turn, the target takes an extra 10 (3d6) piercing damage and must succeed on a DC 16 Strength saving throw or be knocked prone." },
      { name: "Siege Monster", text: "The warbeast deals double damage to objects and structures." }
    ],
    actions: [
      { name: "Multiattack", text: "The warbeast makes one gore attack and two claw attacks.", section: "action" },
      { name: "Gore", dice: [2, 10], type: "piercing", bonus: "5", ability: "str" },
      { name: "Claw", dice: [2, 8], type: "slashing", bonus: "5", ability: "str" }
    ]
  }),
  npc({
    name: "Nameless One of the Field", group: "Abyssal", cr: 11, type: "fiend", subtype: "Demon",
    alignment: "Chaotic Evil", ac: 18, hp: 172, hpFormula: "15d10 + 90", size: "lg",
    abilities: A(21, 17, 22, 15, 16, 18), saves: ["dex", "con", "wis"],
    senses: { darkvision: 120, truesight: 60 }, languages: ["abyssal"], langCustom: "telepathy 120 ft.",
    environment: "Abyss", speed: { walk: 40, fly: 60 },
    dr: ["cold", "fire", "lightning"], di: ["poison"], ci: ["poisoned", "charmed", "frightened"],
    bio: "<p>From the Field of Lost Names. It has forgotten its own name and wants yours &mdash; not to use, simply to have.</p>",
    traits: [
      { name: "Magic Resistance", text: "Advantage on saving throws against spells and other magical effects." },
      { name: "Nameless", text: "The demon cannot be targeted by any effect that requires knowing a creature's name, including binding rituals and the Bell of True Names. It is aware of this and it is why it is still free." }
    ],
    actions: [
      { name: "Multiattack", text: "The demon makes three claw attacks, or two and uses Take the Name.", section: "action" },
      { name: "Claw", dice: [2, 8], type: "slashing", bonus: "5", extra: [[2, 6, "necrotic"]], ability: "str" },
      { name: "Take the Name", text: "One creature within 30 feet must succeed on a DC 17 Charisma saving throw or forget its own name for 1 hour. While it does, it cannot be the target of any spell that names it, cannot be raised from the dead, and has disadvantage on Charisma checks. A <em>greater restoration</em> or the Bell of True Names ends this early.", section: "action" }
    ],
    reactions: [{ name: "Refuse the Seal", text: "When a creature attempts to bind the demon, it may force the caster to make a DC 17 Charisma saving throw. On a failure, the binding fails and the caster takes 22 (5d8) psychic damage." }]
  })
];

/* ================================================================== *
 *  UNDEAD — Soth's retinue, the Returned, and what the vaults hold.
 * ================================================================== */

const undead = [
  npc({
    name: "Skeletal Knight of Dargaard", group: "Undead", cr: 5, type: "undead",
    alignment: "Lawful Evil", ac: 18, hp: 84, hpFormula: "13d8 + 26", size: "med",
    abilities: A(18, 12, 15, 10, 12, 14), saves: ["wis"], senses: { darkvision: 60 },
    languages: ["common"], langCustom: "Solamnic", environment: "Any",
    dv: ["bludgeoning"], di: ["poison"], ci: ["exhaustion", "poisoned"],
    bio: "<p>They followed Soth into the fire and they have not been permitted to stop following him.</p>",
    traits: [{ name: "Oathbound", text: "The knight cannot flee while its lord is on the field, and has advantage on saving throws against being turned while it can see him." }],
    actions: [
      { name: "Multiattack", text: "The knight makes two longsword attacks.", section: "action" },
      { name: "Longsword", dice: [1, 8], type: "slashing", bonus: "4", extra: [[2, 6, "necrotic"]], ability: "str" }
    ]
  }),
  npc({
    name: "Banshee of the Keep", group: "Undead", cr: 6, type: "undead",
    alignment: "Chaotic Evil", ac: 14, hp: 78, hpFormula: "12d8 + 24", size: "med",
    abilities: A(1, 18, 14, 12, 11, 17), saves: ["wis", "cha"], senses: { darkvision: 60 },
    languages: ["common", "elvish"], langCustom: "Solamnic", environment: "Ruins", speed: { walk: 0, fly: 40, hover: true },
    dr: ["acid", "fire", "lightning", "thunder"], di: ["cold", "necrotic", "poison"],
    ci: ["charmed", "exhaustion", "frightened", "grappled", "paralyzed", "petrified", "poisoned", "prone", "restrained"],
    bio: "<p>The women who sang Soth's warning and were not heard. They are still singing.</p>",
    traits: [
      { name: "Incorporeal Movement", text: "The banshee can move through creatures and objects as difficult terrain, taking 5 (1d10) force damage if it ends its turn inside an object." },
      { name: "Detect Life", text: "The banshee can magically sense the presence of living creatures up to 5 miles away and knows the general direction, though not their number or identity." }
    ],
    actions: [
      { name: "Corrupting Touch", dice: [3, 6], type: "necrotic", bonus: "4", ability: "dex" },
      { name: "Wail", text: "Each creature within 30 feet that can hear the banshee and is not undead must make a DC 14 Constitution saving throw. On a failure a creature drops to 0 hit points; on a success it takes 10 (3d6) psychic damage. 1/day.", section: "action", uses: { max: 1, per: "day" } }
    ]
  }),
  npc({
    name: "The Returned", group: "Undead", cr: 4, type: "undead",
    alignment: "Any", ac: 16, hp: 65, hpFormula: "10d8 + 20", size: "med",
    abilities: A(16, 13, 15, 11, 12, 13), saves: ["con"], senses: { darkvision: 60 },
    languages: ["common"], langCustom: "Solamnic", environment: "Any", ci: ["exhaustion", "poisoned", "frightened"],
    bio: "<p>Not zombies. Not skeletons. People &mdash; with names, families, training, and grief about what happened to them. Arc V.</p>",
    traits: [
      { name: "Restored, Not Whole", text: "The Returned has all the memories, skills and personality it had in life. It also obeys Raistlin Majere instinctively and immediately, and it knows that it does. Ask the player running one how that feels." },
      { name: "Undying", text: "When the Returned drops to 0 hit points, it drops to 1 instead unless the damage was radiant or from a critical hit. Once per long rest." }
    ],
    actions: [
      { name: "Multiattack", text: "The Returned makes two weapon attacks.", section: "action" },
      { name: "Longsword", dice: [1, 8], type: "slashing", bonus: "3", ability: "str" }
    ]
  }),
  npc({
    name: "Vault Experiment", group: "Undead", cr: 9, type: "undead",
    alignment: "Neutral Evil", ac: 17, hp: 138, hpFormula: "16d8 + 66", size: "med",
    abilities: A(18, 15, 19, 16, 14, 12), saves: ["con", "int", "wis"],
    senses: { darkvision: 120, truesight: 30 }, languages: ["common", "draconic"],
    langCustom: "and four languages nobody has been able to identify",
    environment: "Underdark", di: ["necrotic", "poison"], dr: ["cold"],
    ci: ["charmed", "exhaustion", "frightened", "poisoned"],
    bio: "<p>Level Ten of the Palanthas Tower. Fistandantilus restored these, and most of them obeyed him permanently, and they knew that they did. One will explain this calmly and ask not to be freed.</p>",
    traits: [
      { name: "Aware of Its Condition", text: "The experiment can converse, reason and negotiate. It knows precisely what was done to it and can describe the ritual in technical detail, which is the most valuable thing in the room." },
      { name: "Compelled", text: "If a creature speaks Fistandantilus's true binding phrase, the experiment must obey it for 1 hour and cannot warn anyone that this has happened." }
    ],
    actions: [
      { name: "Multiattack", text: "The experiment makes two withering touch attacks.", section: "action" },
      { name: "Withering Touch", dice: [3, 8], type: "necrotic", bonus: "4", ability: "str" },
      { name: "Unmake", text: "One creature within 30 feet must make a DC 16 Constitution saving throw, taking 36 (8d8) necrotic damage on a failure and having its hit point maximum reduced by the same amount until it finishes a long rest. Recharge 5-6.", section: "action" }
    ]
  })
];

/* ================================================================== *
 *  WAYRETH AND THE TOWERS
 * ================================================================== */

const towers = [
  npc({
    name: "Guardian of the Tower", group: "Wayreth", cr: 12, type: "undead",
    alignment: "Lawful Neutral", ac: 18, hp: 149, hpFormula: "18d8 + 68", size: "med",
    abilities: A(18, 14, 18, 16, 18, 15), saves: ["con", "wis"],
    senses: { truesight: 60, darkvision: 60 }, languages: ["common", "draconic", "elvish"], langCustom: "Solamnic",
    environment: "Any", speed: { walk: 30, fly: 30, hover: true },
    di: ["cold", "necrotic", "poison"], ci: ["charmed", "exhaustion", "frightened", "paralyzed", "poisoned"],
    dr: ["bludgeoning", "piercing", "slashing"], drCustom: "from nonmagical attacks",
    bio: "<p>Wizards of High Sorcery who petitioned to remain. They volunteered, they remember being people, and they will explain the rules before they act.</p>",
    traits: [
      { name: "Bound to the Stone", text: "The Guardian cannot leave its Tower and cannot be permanently destroyed within it. Reduced to 0 hit points, it reforms at the door it was set to guard after 24 hours. It is fully aware of this, and it makes them very calm." },
      { name: "Duty", text: "The Guardian attacks only creatures violating the Tower's rules of conduct, and stops the instant the violation stops. It will accept a surrender. It explains the rules first, in a voice that is politely apologetic." }
    ],
    actions: [
      { name: "Multiattack", text: "The Guardian makes two chill touch attacks.", section: "action" },
      { name: "Chill Touch", dice: [4, 8], type: "necrotic", bonus: "3", reach: 10, ability: "str" },
      { name: "Gaze of the Departed", text: "One creature within 30 feet must make a DC 17 Wisdom saving throw. On a failure it is frightened for 1 minute and sees, clearly, the moment of its own death. It may repeat the save at the end of each of its turns. Recharge 5-6.", section: "action" }
    ]
  }),
  npc({
    name: "Renegade Hunter", group: "Wayreth", cr: 9, type: "humanoid", subtype: "any race",
    alignment: "Any", ac: 16, hp: 91, hpFormula: "14d8 + 28", size: "med",
    abilities: A(12, 18, 14, 17, 15, 12), saves: ["dex", "int"],
    skills: { arc: 2, inv: 2, prc: 1, ste: 2 }, languages: ["common"], langCustom: "Solamnic", environment: "Any",
    spellcasting: "int", spellLevel: 9,
    bio: "<p>The best recurring antagonist in the campaign precisely because they are right. They will negotiate, and they will stop if the target agrees to take the Test.</p>",
    traits: [
      { name: "Writ of the Conclave", text: "Advantage on attack rolls and saving throws against any creature it has formally declared renegade. It always declares first; it considers this a matter of professional pride." },
      { name: "Counterspelling Reflex", text: "The hunter may cast <em>counterspell</em> twice per long rest without expending a slot." },
      ...spellFeatures("Renegade Hunter")
    ],
    actions: [
      { name: "Multiattack", text: "The hunter makes two shortsword attacks.", section: "action" },
      { name: "Shortsword", dice: [1, 6], type: "piercing", bonus: "4", ability: "dex", extra: [[3, 6, "force"]] },
      { name: "Hunter's Rod", text: "One creature within 60 feet must succeed on a DC 16 Charisma saving throw. On a failure, for 1 minute, whenever it casts a spell it must first succeed on a DC 16 Constitution saving throw or the spell fails and the slot is expended. 3/day.", section: "action", uses: { max: 3, per: "day" } }
    ]
  }),
  npc({
    name: "Shoikan Grove Sentinel", group: "Wayreth", cr: 7, type: "plant",
    alignment: "Neutral Evil", ac: 16, hp: 115, hpFormula: "11d12 + 44", size: "huge",
    abilities: A(20, 8, 18, 6, 14, 16), saves: ["wis"], senses: { blindsight: 60, tremorsense: 60 },
    languages: [], langCustom: "understands Common but does not speak", environment: "Urban",
    speed: { walk: 0 }, dr: ["bludgeoning", "piercing"], dv: ["fire"],
    ci: ["blinded", "deafened", "exhaustion", "frightened", "prone"],
    bio: "<p>The trees around the Palanthas Tower. They do not pursue. They do not need to.</p>",
    traits: [
      { name: "Aura of Terror", text: "Any creature that starts its turn within 30 feet must succeed on a DC 16 Wisdom saving throw or be frightened until the start of its next turn. A frightened creature must spend its movement retreating if it can." },
      { name: "Knows Its Master", text: "The sentinel does not attack any creature bearing the magical signature of the Tower's Master, and will bow its branches away from such a creature's path." }
    ],
    actions: [
      { name: "Grasping Root", dice: [3, 8], type: "bludgeoning", bonus: "5", reach: 15, ability: "str" },
      { name: "Drag Under", text: "One creature grappled by the sentinel must succeed on a DC 16 Strength saving throw or be pulled beneath the soil, becoming restrained and unable to breathe. It takes 18 (4d8) necrotic damage at the start of each of its turns.", section: "action" }
    ]
  })
];

/* ================================================================== *
 *  THE ROAD — what the party meets on the three routes.
 * ================================================================== */

const road = [
  npc({
    name: "Hill Brigand", group: "The Road", cr: 0.25, type: "humanoid", subtype: "any race",
    alignment: "Chaotic Neutral", ac: 13, hp: 13, hpFormula: "3d8", size: "med",
    abilities: A(12, 14, 11, 10, 10, 10), languages: ["common"], langCustom: "Solamnic", environment: "Hill",
    bio: "<p>Desperate rather than wicked. Refugees have made a great many of these this season.</p>",
    actions: [{ name: "Scimitar", dice: [1, 6], type: "slashing", bonus: "2", ability: "dex" }]
  }),
  npc({
    name: "Forest Wolf Pack Leader", group: "The Road", cr: 1, type: "beast",
    alignment: "Unaligned", ac: 13, hp: 37, hpFormula: "5d10 + 10", size: "med",
    abilities: A(15, 15, 15, 3, 12, 6), skills: { prc: 1, ste: 1 },
    languages: [], langCustom: "Solamnic", environment: "Forest", speed: { walk: 50 },
    bio: "<p>The winter is hard and the herds have moved. So have the wolves.</p>",
    traits: [{ name: "Pack Tactics", text: "Advantage on an attack roll against a creature if at least one ally is within 5 feet of it." }],
    actions: [{ name: "Bite", dice: [2, 6], type: "piercing", bonus: "2", ability: "str" }]
  }),
  npc({
    name: "Lost Wanderer of Wayreth", group: "The Road", cr: 5, type: "humanoid", subtype: "any race",
    alignment: "Neutral", ac: 12, hp: 66, hpFormula: "12d8 + 12", size: "med",
    abilities: A(10, 14, 13, 17, 14, 13), skills: { arc: 2, his: 2 },
    languages: ["common"], langCustom: "Solamnic", environment: "Forest", ci: ["frightened"],
    bio: "<p>Wizards from various centuries who came for the Tower and were neither admitted nor released. They are helpful, at length, and accurate as of whichever decade they entered.</p>",
    traits: [
      { name: "Out of Time", text: "The wanderer's knowledge is accurate for the century in which it entered the forest. Several do not know the Kingpriest is dead. None of them can be convinced of the current date." },
      { name: "Cannot Leave", text: "The wanderer cannot be removed from the Forest of Wayreth by any means, including <em>plane shift</em> and <em>wish</em>. Attempts simply return it to where it was." }
    ],
    actions: [{ name: "Arcane Bolt", dice: [3, 6], type: "force", bonus: "3", range: [60, 120], ability: "int" }]
  })
];

/* ================================================================== *
 *  NAMED — the campaign's cast. Statted so you know what happens if
 *  someone attacks them, not because they are meant to be fought.
 * ================================================================== */

const named = [
  npc({
    name: "Commander Veyrath", group: "Named", cr: 8, type: "humanoid", subtype: "any race",
    alignment: "Lawful Evil", ac: 17, hp: 112, hpFormula: "15d8 + 45", size: "med",
    abilities: A(14, 17, 16, 18, 16, 17), saves: ["dex", "int", "wis"],
    skills: { dec: 3, ins: 3, inv: 3, prc: 2, ste: 2 }, languages: ["common", "draconic"], langCustom: "Solamnic",
    environment: "Any", senses: { special: "passive Perception 18" },
    bio: "<p>Senior Dragonarmy intelligence. He will buy the party dinner, be honest about who he is, ask good questions, and leave the conversation ahead. Fighting him means you have lost the character.</p>",
    traits: [
      { name: "Reads People", text: "Veyrath knows when a creature is lying to him unless it succeeds on a DC 18 Charisma (Deception) check. He rarely lets on." },
      { name: "Never the Objective", text: "Veyrath does not attempt to capture or kill the party while he believes following them is more informative. He is usually correct about that." }
    ],
    actions: [
      { name: "Multiattack", text: "Veyrath makes three rapier attacks.", section: "action" },
      { name: "Rapier", dice: [1, 8], type: "piercing", bonus: "5", ability: "dex" }
    ],
    reactions: [{ name: "Withdraw in Good Order", text: "When reduced below half hit points, Veyrath may disengage, move up to his speed, and issue an order allowing one ally to do the same." }]
  }),
  npc({
    name: "Mereth Sorn, Renegade", group: "Named", cr: 9, type: "humanoid", subtype: "any race",
    alignment: "Neutral Evil", ac: 16, hp: 95, hpFormula: "15d8 + 30", size: "med",
    abilities: A(11, 17, 14, 18, 14, 13), saves: ["dex", "int"], skills: { arc: 3, ste: 2 },
    languages: ["common", "draconic"], langCustom: "Solamnic", environment: "Any", spellcasting: "int", spellLevel: 10,
    bio: "<p>A renegade Black Robe in Dragonarmy service who wants Ossian Krell dead rather than recovered, and is exceeding her orders. She will explain her reasoning and the party may well agree with it.</p>",
    traits: [
      { name: "She Is Not Wrong", text: "Mereth's position is that the corruption ritual should not exist, that the Conclave will not destroy it, and that she is therefore going to. Play her as correct and let the party argue." },
      ...spellFeatures("Mereth Sorn, Renegade")
    ],
    actions: [{ name: "Dagger", dice: [1, 4], type: "piercing", bonus: "3", ability: "dex" }]
  }),
  npc({
    name: "Ossian Krell", group: "Named", cr: 2, type: "humanoid", subtype: "any race",
    alignment: "Neutral", ac: 12, hp: 38, hpFormula: "7d8 + 7", size: "med",
    abilities: A(9, 14, 12, 17, 12, 11), skills: { arc: 3, ste: 1 },
    languages: ["common", "draconic"], langCustom: "Solamnic", environment: "Any", spellcasting: "int", spellLevel: 5,
    bio: "<p>Dracart's former apprentice. He has run for four months and he is nearly finished.</p>",
    traits: [
      { name: "He Is the Document", text: "The draconian corruption ritual is scarified into Krell's body in eleven incomplete overlapping passes. It cannot be copied, transcribed, imaged or scried. Destroying the knowledge means killing him." },
      { name: "Four Months of Running", text: "Krell has three levels of exhaustion and cannot remove them while pursued. He will not mention this." },
      // He carried a caster level and a spell ability with no spells behind
      // them, which showed as 5th-level slots he could not fill. The list is
      // every spell a frightened apprentice would have kept practising and
      // nothing he would win a fight with.
      ...spellFeatures("Ossian Krell")
    ],
    actions: [{ name: "Dagger", dice: [1, 4], type: "piercing", bonus: "2", ability: "dex" }]
  }),
  npc({
    name: "Caramon Majere, Returned", group: "Named", cr: 12, type: "undead",
    alignment: "Neutral Good", ac: 18, hp: 187, hpFormula: "22d8 + 88", size: "med",
    abilities: A(20, 14, 18, 11, 13, 15), saves: ["str", "con"], skills: { ath: 2, ins: 1 },
    languages: ["common"], langCustom: "Solamnic", environment: "Any",
    ci: ["exhaustion", "frightened", "poisoned"],
    bio: "<p>Arc V. He is alive, warm, and himself. And when his brother gives him an instruction he obeys it faster than a brother should.</p>",
    traits: [
      { name: "Bound Will", text: "Caramon obeys any direct instruction from Raistlin Majere immediately and without hesitation. He is aware that he does. He has not told his brother how much this frightens him." },
      { name: "Dreams of Elsewhere", text: "Caramon dreams of somewhere beyond the world. He will tell the party, privately, that he does not know whether he came back because he wanted to." },
      { name: "Indomitable", text: "Caramon may reroll a failed saving throw once per long rest." }
    ],
    actions: [
      { name: "Multiattack", text: "Caramon makes three greatsword attacks.", section: "action" },
      { name: "Greatsword", dice: [2, 6], type: "slashing", bonus: "5", ability: "str" }
    ],
    reactions: [{ name: "Interpose", text: "When a creature Caramon can see attacks a target within 5 feet of him, he may make himself the target instead." }]
  })
];

export default [...abyssal, ...undead, ...towers, ...road, ...named];
