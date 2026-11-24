import { npc } from "./statblock.mjs";
import { dragonMagic } from "./dragon-magic.mjs";
import { spellFeatures } from "./caster-loadouts.mjs";

const A = (str, dex, con, int, wis, cha) => ({ str, dex, con, int, wis, cha });

/* ================================================================== *
 *  THE NAMED
 *
 *  Most of these should never be fought. They are statted so you know
 *  what happens if the party tries, and so the Tower's court can be
 *  dropped onto a scene without you inventing numbers at the table.
 *
 *  Journal write-ups for the Conclave are in "The Court of Wayreth".
 * ================================================================== */

const conclave = [
  npc({
    name: "Raistlin Majere, Master of Wayreth", group: "Named", cr: 21, type: "humanoid", subtype: "Human",
    alignment: "Lawful Evil", ac: 18, hp: 190, hpFormula: "28d8 + 64", size: "med",
    abilities: A(7, 14, 10, 24, 18, 16), saves: ["int", "wis", "cha"],
    skills: { arc: 2, his: 1, ins: 1, per: 1 }, senses: { truesight: 60 },
    dr: ["psychic"], drCustom: "bludgeoning, piercing, and slashing from nonmagical attacks",
    ci: ["charmed", "frightened"], languages: ["common", "elvish", "draconic", "abyssal"], langCustom: "Solamnic",
    environment: "Any", speed: { walk: 25 }, spellcasting: "int", spellLevel: 20,
    legendaryUses: 3, legres: 3,
    bio: "<p>Twenty-six years old and prematurely ruined. Golden skin, hourglass pupils, and a cough he manages with a draught he permits no one else to touch. This block exists so you know what happens if the party attacks him. They lose.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If Raistlin fails a saving throw, he can choose to succeed instead." },
      { name: "The Hourglass Eyes", text: "Raistlin sees all living things as they will be. He automatically knows the current hit points, conditions and remaining lifespan of any creature he can see, and cannot be surprised. He has disadvantage on Charisma (Persuasion) checks against living creatures — he cannot stop seeing them die." },
      { name: "Failing Body", text: "At the start of each of his turns, roll a d20. On a 1, the cough takes him: he cannot take reactions and cannot cast spells with verbal components until the end of his next turn. He does not conceal this." },
      { name: "Unsanctioned", text: "Raistlin does not suffer low sanction and gains high sanction benefits regardless of the black moon's phase. Nobody has established why." },
      { name: "Master of the Tower", text: "Inside Wayreth, Raistlin knows the location of every creature in the building, cannot be surprised or teleported against his will, and any creature attacking him has disadvantage on its first attack roll each turn." },
      ...spellFeatures("Raistlin Majere, Master of Wayreth")
    ],
    actions: [
      { name: "Staff of Magius", dice: [2, 6], type: "force", bonus: "-2", ability: "str" },
      { name: "Time Stop (1/Day)", text: "Raistlin stops time for 1d4 + 1 turns. He uses this to leave, not to win — he does not fight people he has already beaten." }
    ],
    legendary: [
      { name: "Cantrip", text: "Raistlin casts a cantrip." },
      { name: "Withdraw (Costs 2 Actions)", text: "Raistlin teleports up to 60 feet to a space he can see." },
      { name: "Observe (Costs 2 Actions)", text: "One creature Raistlin can see makes a DC 22 Wisdom saving throw, taking 18 (4d8) psychic damage and suffering disadvantage on its next attack roll on a failure, or half damage on a success. He does not appear to do anything." }
    ]
  }),
  npc({
    name: "Par-Salian of the White Robes", group: "Named", cr: 15, type: "humanoid", subtype: "Human",
    alignment: "Lawful Neutral", ac: 15, hp: 135, hpFormula: "18d8 + 54", size: "med",
    abilities: A(9, 14, 16, 21, 18, 15), saves: ["int", "wis"],
    skills: { arc: 2, his: 1, ins: 1 }, languages: ["common", "elvish", "draconic"], langCustom: "Solamnic",
    environment: "Any", speed: { walk: 30 }, spellcasting: "int", spellLevel: 17,
    bio: "<p>Head of the Conclave. Former Master of Wayreth, declined by a building he had served for thirty years. He believes he did the right thing and cannot stop testing that belief.</p>",
    traits: [
      { name: "Head of the Conclave", text: "Once per long rest Par-Salian may declare the Conclave's writ. Each Wizard of High Sorcery of his choice within 60 feet must succeed on a DC 19 Charisma saving throw or be unable to cast spells against him for 1 minute." },
      ...spellFeatures("Par-Salian of the White Robes"),
      { name: "Does Not Want This", text: "Par-Salian spends the first three rounds of any combat attempting to end it. He is very good at ending them." }
    ],
    actions: [{ name: "Staff", dice: [1, 6], type: "bludgeoning", bonus: "-1", ability: "str" }]
  }),
  npc({
    name: "Ladonna of the Black Robes", group: "Named", cr: 14, type: "humanoid", subtype: "Human",
    alignment: "Neutral Evil", ac: 16, hp: 120, hpFormula: "16d8 + 48", size: "med",
    abilities: A(10, 16, 16, 20, 15, 18), saves: ["int", "cha"],
    skills: { arc: 2, dec: 2, ins: 1 }, languages: ["common", "abyssal", "draconic"], langCustom: "Solamnic",
    environment: "Any", speed: { walk: 30 }, spellcasting: "int", spellLevel: 16,
    bio: "<p>Senior Black Robe, and until Raistlin the most powerful on Ansalon. She is not plotting against him. She is waiting, which is worse.</p>",
    traits: [
      { name: "Perfectly Frank", text: "Ladonna has advantage on Charisma checks made while telling the complete truth about her own motives, which is most of the time and disarms people far more effectively than lying." },
      ...spellFeatures("Ladonna of the Black Robes")
    ],
    actions: [{ name: "Dagger", dice: [1, 4], type: "piercing", bonus: "3", ability: "dex" }]
  }),
  npc({
    name: "Justarius of the Red Robes", group: "Named", cr: 13, type: "humanoid", subtype: "Human",
    alignment: "Neutral", ac: 15, hp: 110, hpFormula: "15d8 + 45", size: "med",
    abilities: A(11, 12, 17, 20, 16, 17), saves: ["int", "wis"],
    skills: { arc: 2, ins: 1 }, languages: ["common", "elvish", "dwarvish", "draconic"], langCustom: "Solamnic",
    environment: "Any", speed: { walk: 20 }, spellcasting: "int", spellLevel: 15,
    bio: "<p>Head of the Red Robes, lame in the left leg from his own Test and cheerfully unembarrassed about it. The only Conclave member who treats Raistlin as a colleague, and therefore the most suspected man in the Tower.</p>",
    traits: [
      { name: "The Balance", text: "When a creature within 30 feet casts a spell, Justarius may use his reaction to grant that spell advantage or impose disadvantage on its first attack roll or saving throw. He decides after seeing the target." },
      ...spellFeatures("Justarius of the Red Robes")
    ],
    actions: [{ name: "Staff", dice: [1, 6], type: "bludgeoning", bonus: "0", ability: "str" }]
  }),
  npc({
    name: "Dalamar Argent", group: "Named", cr: 8, type: "humanoid", subtype: "Elf",
    alignment: "Neutral Evil", ac: 14, hp: 78, hpFormula: "12d8 + 24", size: "med",
    abilities: A(9, 15, 14, 18, 14, 16), saves: ["int", "wis"],
    skills: { arc: 2, dec: 2, ste: 1 }, senses: { darkvision: 60 },
    languages: ["common", "elvish", "draconic"], langCustom: "Solamnic", environment: "Any",
    speed: { walk: 30 }, spellcasting: "int", spellLevel: 12,
    bio: "<p>A dark elf of Silvanesti, exiled for worshipping Nuitari, newly apprenticed at Wayreth. He is spying on Raistlin for the Conclave. Raistlin knows and permitted it.</p>",
    traits: [
      { name: "Two Masters", text: "Dalamar has advantage on saving throws against effects that would compel him to reveal information, and on Deception checks made to conceal his loyalties. He is not certain himself which way he would jump." },
      ...spellFeatures("Dalamar Argent")
    ],
    actions: [{ name: "Dagger", dice: [1, 4], type: "piercing", bonus: "2", ability: "dex" }]
  })
];

const antagonists = [
  npc({
    name: "Lord Soth, Knight of the Black Rose", group: "Named", cr: 22, type: "undead", subtype: "",
    alignment: "Chaotic Evil", ac: 20, hp: 279, hpFormula: "27d8 + 158", size: "med",
    abilities: A(22, 14, 22, 16, 18, 20), saves: ["dex", "con", "wis", "cha"],
    skills: { ath: 1, ins: 1, per: 1 }, senses: { darkvision: 120 },
    di: ["necrotic", "poison"], dr: ["cold", "lightning"],
    drCustom: "bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered",
    ci: ["charmed", "exhaustion", "frightened", "paralyzed", "poisoned"],
    languages: ["common", "infernal"], langCustom: "Solamnic", environment: "Dargaard Keep",
    speed: { walk: 30 }, legendaryUses: 3, legres: 3,
    bio: "<p>Damned for a failure of courage he had every opportunity to correct. He does not serve Takhisis so much as tolerate her, and he recognises what Raistlin is becoming faster than anyone alive.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If Soth fails a saving throw, he can choose to succeed instead." },
      { name: "Turn Immunity", text: "Soth is immune to effects that turn undead." },
      { name: "Aura of Despair", text: "Any creature that starts its turn within 30 feet must succeed on a DC 19 Wisdom saving throw or be frightened for 1 minute. A frightened creature repeats the save at the end of each of its turns. On a success it is immune for 24 hours." },
      { name: "He Knows What He Did", text: "Soth cannot be deceived about his own history and has advantage on Insight checks against any creature attempting to justify a choice it regrets. He will say so, and it is worse than an attack." }
    ],
    actions: [
      { name: "Multiattack", text: "Soth makes three longsword attacks, or two and uses Hellfire Orb or Banshee Wail." },
      { name: "Flaming Longsword", dice: [2, 8], type: "slashing", bonus: "6", ability: "str", text: "Plus 13 (3d8) fire damage." },
      { name: "Hellfire Orb (1/Day)", text: "Soth hurls a magical ball of fire at a point within 120 feet. Each creature in a 20-foot radius makes a DC 20 Dexterity saving throw, taking 35 (10d6) fire and 35 (10d6) necrotic damage on a failure, or half on a success." },
      { name: "Banshee Wail", text: "Soth's attendant banshees wail. Each creature within 30 feet that can hear must make a DC 19 Constitution saving throw or drop to 0 hit points. On a success it takes 10 (3d6) psychic damage." }
    ],
    legendary: [
      { name: "Sword Attack", text: "Soth makes one longsword attack." },
      { name: "Frightful Command (Costs 2 Actions)", text: "Soth targets one frightened creature within 60 feet. It must succeed on a DC 19 Wisdom saving throw or use its reaction to move up to its speed away from Soth by the safest route." },
      { name: "Charge (Costs 3 Actions)", text: "Soth moves up to his speed and makes one longsword attack with advantage." }
    ]
  }),
  npc({
    name: "Kitiara uth Matar", group: "Named", cr: 12, type: "humanoid", subtype: "Human",
    alignment: "Lawful Evil", ac: 19, hp: 161, hpFormula: "19d8 + 76", size: "med",
    abilities: A(18, 17, 18, 15, 13, 17), saves: ["str", "dex", "con"],
    skills: { ath: 1, dec: 1, ins: 1, itm: 1 }, languages: ["common", "draconic"], langCustom: "Solamnic",
    environment: "Any", speed: { walk: 30 },
    bio: "<p>Highlord of the Blue Dragonarmy. The best field commander on either side of the war, and Raistlin's half-sister, and she has not decided what that is worth to her.</p>",
    traits: [
      { name: "Battlefield Command", text: "Allies within 30 feet that can hear Kitiara add +2 to attack rolls against any creature she has marked as a target on her turn." },
      { name: "Reads the Fight", text: "Kitiara has advantage on Insight checks made to determine an opponent's next move, and cannot be surprised while she has line of sight to the enemy." },
      { name: "Indomitable (2/Day)", text: "Kitiara may reroll a failed saving throw." }
    ],
    actions: [
      { name: "Multiattack", text: "Kitiara makes three longsword attacks." },
      { name: "Longsword", dice: [2, 8], type: "slashing", bonus: "5", ability: "str" },
      { name: "Dagger", dice: [1, 4], type: "piercing", bonus: "4", ability: "dex", range: [20, 60] }
    ],
    reactions: [
      { name: "Parry", text: "Kitiara adds 4 to her AC against one melee attack that would hit her. She must see the attacker and be wielding a melee weapon." }
    ]
  }),
  npc({
    name: "Fistandantilus", group: "Named", cr: 20, type: "undead", subtype: "",
    alignment: "Neutral Evil", ac: 19, hp: 225, hpFormula: "30d8 + 90", size: "med",
    abilities: A(10, 16, 16, 25, 20, 21), saves: ["con", "int", "wis", "cha"],
    skills: { arc: 2, his: 2, ins: 1 }, senses: { truesight: 120 },
    di: ["necrotic", "poison"], dr: ["cold", "lightning"],
    drCustom: "bludgeoning, piercing, and slashing from nonmagical attacks",
    ci: ["charmed", "exhaustion", "frightened", "paralyzed", "poisoned"],
    languages: ["common", "abyssal", "draconic", "infernal"], langCustom: "Solamnic", environment: "Any",
    speed: { walk: 30, fly: 30, hover: true }, spellcasting: "int", spellLevel: 20,
    legendaryUses: 3, legres: 3,
    bio: "<p>Two hundred years dead and entirely undeterred by it. He does not want to possess Raistlin. He expects Raistlin to finish the work voluntarily, and he has excellent evidence.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If Fistandantilus fails a saving throw, he can choose to succeed instead." },
      { name: "The Long Return", text: "Fistandantilus can restore a creature that has died within the last century as an action, provided he holds an anchor to it. The restored creature obeys him, knows that it obeys him, and cannot stop." },
      { name: "Courteous", text: "Fistandantilus opens every encounter by explaining precisely what he wants and what he will give for it. Everything he offers, he delivers." },
      ...spellFeatures("Fistandantilus")
    ],
    actions: [
      { name: "Withering Touch", dice: [5, 8], type: "necrotic", bonus: "3", ability: "dex", text: "The target's hit point maximum is reduced by the damage taken until it finishes a long rest." },
      { name: "Claim (Recharge 6)", text: "One creature within 60 feet must succeed on a DC 22 Charisma saving throw or be charmed for 1 minute. While charmed it must obey Fistandantilus's commands. It repeats the save if it takes damage or is ordered to harm someone it loves." }
    ],
    legendary: [
      { name: "Cantrip", text: "Fistandantilus casts a cantrip." },
      { name: "Drain (Costs 2 Actions)", text: "Fistandantilus makes one Withering Touch attack and regains hit points equal to the damage dealt." },
      { name: "Rewrite (Costs 3 Actions)", text: "Fistandantilus alters one thing that happened in the last round — an attack that hit now missed, a save that succeeded now failed. He may do this once per encounter regardless of remaining legendary actions." }
    ]
  }),
  npc({
    name: "Cyan Bloodbane", group: "Named", cr: 19, type: "dragon", subtype: "Chromatic",
    alignment: "Chaotic Evil", ac: 20, hp: 287, hpFormula: "23d12 + 138", size: "grg",
    abilities: A(27, 12, 23, 20, 17, 21), saves: ["dex", "con", "wis", "cha"],
    skills: { dec: 2, ins: 1, per: 2, ste: 2 }, senses: { blindsight: 60, darkvision: 120 },
    di: ["poison"], ci: ["poisoned"], languages: ["common", "draconic", "elvish"], langCustom: "Solamnic",
    environment: "Silvanesti", speed: { walk: 40, fly: 80, swim: 40 },
    legendaryUses: 3, legres: 3,
    // Innate casting under the Monster Manual variant; Charisma sets the DC.
    spellcasting: "cha",
    bio: "<p>The green who whispered into Lorac's Dragon Orb and turned a nation into a nightmare. Fighting him inside Silvanesti means fighting him on ground he has been rehearsing for a year.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If Cyan fails a saving throw, he can choose to succeed instead." },
      { name: "Whisperer", text: "Cyan can speak into the mind of any sleeping creature within 1 mile. A creature that completes a long rest within that range must succeed on a DC 20 Wisdom saving throw or gain no benefit from it and wake with an idea that is not its own." },
      { name: "Master of the Dream", text: "Within the Nightmare, Cyan can reshape terrain at the start of his turn, has advantage on all saving throws, and regains 20 hit points at the start of each of his turns." },
      { name: "Frightful Presence", text: "Each creature within 120 feet that is aware of Cyan must succeed on a DC 19 Wisdom saving throw or be frightened for 1 minute." },
      dragonMagic('Cyan Bloodbane')
    ],
    actions: [
      { name: "Multiattack", text: "Cyan uses Frightful Presence, then makes one bite and two claw attacks." },
      { name: "Bite", dice: [2, 10], type: "piercing", bonus: "8", ability: "str", reach: 15, text: "Plus 10 (3d6) poison damage." },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "8", ability: "str", reach: 10 },
      { name: "Poison Breath", text: "<em>Recharge 5&ndash;6.</em> Cyan exhales gas in a 90-foot cone. Each creature makes a DC 21 Constitution saving throw, taking 77 (22d6) poison damage on a failure, or half on a success." }
    ],
    legendary: [
      { name: "Detect", text: "Cyan makes a Wisdom (Perception) check." },
      { name: "Tail Attack", text: "Cyan makes one tail attack for 17 (2d8 + 8) bludgeoning damage, reach 20 feet." },
      { name: "Whisper (Costs 2 Actions)", text: "One creature Cyan can see within 60 feet must succeed on a DC 20 Wisdom saving throw or use its reaction to make one weapon attack against a creature of Cyan's choice." }
    ]
  }),
  npc({
    // The old block said he "cannot be killed by any means available to the
    // party" and then gave him AC 10 and 30 hit points, which a Dragonarmy
    // Recruit gets through in three rounds. Everything below is the same
    // intent with mechanics that hold it up. CR 26 is not an invitation; it is
    // the number that stops an encounter builder calling him trivial.
    name: "Astinus of Palanthas", group: "Named", cr: 26, type: "humanoid", subtype: "Human",
    alignment: "Neutral", ac: 21, hp: 335, hpFormula: "61d8 + 61", size: "med",
    abilities: A(10, 10, 12, 30, 25, 20), senses: { truesight: 120 },
    saves: ["int", "wis", "cha"], skills: { his: 4, arc: 3, ins: 3, inv: 3 },
    di: ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic",
         "piercing", "poison", "psychic", "radiant", "slashing", "thunder"],
    ci: ["blinded", "charmed", "deafened", "exhaustion", "frightened", "grappled",
         "incapacitated", "paralyzed", "petrified", "poisoned", "prone", "restrained",
         "stunned", "unconscious"],
    languages: [], langCustom: "every language that has ever been spoken",
    environment: "The Great Library", speed: { walk: 30 },
    spellcasting: "int",
    bio: "<p>He has been writing the history of Krynn since before there was a Palanthas to write it in. He records. He does not direct, and he will explain the difference at length if you mistake the two.</p>",
    traits: [
      { name: "The Chronicle", text: "Astinus knows everything that has happened. Not what will happen — what has. He answers factual questions about the past truthfully and completely, and refuses every question about the future." },
      { name: "Does Not Intervene", text: "Astinus will not lift a hand to prevent anything, and cannot be persuaded, threatened, charmed or bargained into it. He has watched worse than this and written it down." },
      { name: "Outside the Account", text: "Astinus is immune to all damage and to every condition. He automatically succeeds on every saving throw. He cannot be moved, banished, restrained, polymorphed, imprisoned or planeshifted against his will, and magic that would read or alter his mind fails without a roll. Effects that would kill him outright, including <em>power word kill</em> and a failed death saving throw, have no effect." },
      { name: "Innate Spellcasting", text: "Astinus&#x27;s spellcasting ability is Intelligence (spell save DC 26). He casts the following spells at will, requiring no components. At will: <em>comprehend languages</em>, <em>detect magic</em>, <em>detect thoughts</em>, <em>identify</em>, <em>zone of truth</em>, <em>legend lore</em>, <em>scrying</em>, <em>true seeing</em>. Every one of them looks backward or looks now. He has no divination that touches the future, and refuses to be asked." },
      { name: "Not a Combat Encounter", text: "This block exists so you are not caught out, not so it can be used. Nothing the party can do to Astinus will work, and any attempt simply gets recorded — in his hand, in the volume for this year, while they are still trying." }
    ],
    actions: [{ name: "Pen", dice: [1, 2], type: "piercing", bonus: "0", ability: "str", text: "He will not use it for this." }]
  }),
  npc({
    name: "Skaith, Sivak Infiltrator", group: "Named", cr: 9, type: "dragon", subtype: "Draconian",
    alignment: "Lawful Evil", ac: 17, hp: 123, hpFormula: "13d10 + 52", size: "lg",
    abilities: A(18, 16, 18, 14, 14, 13), saves: ["dex", "con"],
    skills: { dec: 2, ins: 1, ste: 2 }, senses: { darkvision: 60 },
    languages: ["common", "draconic"], langCustom: "Solamnic", environment: "Any",
    speed: { walk: 40, fly: 60 },
    bio: "<p>Dragonarmy intelligence, and the reason the party cannot trust their own eyes on the road to Palanthas. Professional, unhurried, and entirely without malice — which they find far more unsettling than cruelty.</p>",
    traits: [
      { name: "Death Throe: The Stolen Face", text: "When Skaith drops to 0 hit points, he takes the form of the creature that killed him and remains that way. The corpse is indistinguishable from that person, and Skaith has arranged for it to be found." },
      { name: "Wear the Slain", text: "As an action, Skaith assumes the exact form of any Medium or Large humanoid he has killed. He gains their voice and mannerisms. A creature that knew them well may make a DC 17 Insight check to notice something wrong, once per hour of interaction." },
      { name: "Patient", text: "Skaith does not attempt to capture the party. Capturing them is worth far less than discovering where they are going, and he has said so out loud." }
    ],
    actions: [
      { name: "Multiattack", text: "Skaith makes two longsword attacks and one claw attack." },
      { name: "Longsword", dice: [2, 8], type: "slashing", bonus: "4", ability: "str" },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "4", ability: "str" }
    ]
  })
];

export default [...conclave, ...antagonists];
