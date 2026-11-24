import { npc } from "./statblock.mjs";

const A = (str, dex, con, int, wis, cha) => ({ str, dex, con, int, wis, cha });

/* ================================================================== *
 *  THE ABYSS AND THE NIGHTMARE
 *
 *  Arc V puts these on Raistlin's leash. Arc VI takes the leash off.
 *  Every bound entity here has a true name, a contract, and an opinion
 *  about being owned — play all three, because the campaign's central
 *  question is whether any of it was permissible.
 * ================================================================== */

const abyssal = [
  npc({
    name: "Chained Tormentor", group: "Abyssal", cr: 5, type: "fiend", subtype: "Demon",
    alignment: "Chaotic Evil", ac: 15, hp: 82, hpFormula: "11d8 + 33", size: "med",
    abilities: A(17, 15, 17, 11, 12, 13), saves: ["dex", "con"],
    senses: { darkvision: 120 }, di: ["poison"], dr: ["cold", "fire", "lightning"],
    drCustom: "bludgeoning, piercing, and slashing from nonmagical attacks",
    ci: ["poisoned"], languages: ["abyssal"], langCustom: "telepathy 120 ft.",
    environment: "The Abyss", speed: { walk: 30 },
    bio: "<p>The commonest thing Raistlin pulls through the Portal. It answers to a true name, it does what it is told, and it counts.</p>",
    traits: [
      { name: "Bound Service", text: "While bound by a true name, the tormentor cannot willingly disobey a direct instruction from its binder, and cannot attack the binder. It obeys the letter of every instruction and never the intent." },
      { name: "Magic Resistance", text: "The tormentor has advantage on saving throws against spells and other magical effects." },
      { name: "It Remembers", text: "The tormentor knows exactly how many days it has been bound, who bound it, and every instruction it has been given. If ever released, it acts on all of this." }
    ],
    actions: [
      { name: "Multiattack", text: "The tormentor makes two claw attacks and one bite." },
      { name: "Claw", dice: [2, 6], type: "slashing", bonus: "3", ability: "str" },
      { name: "Bite", dice: [2, 8], type: "piercing", bonus: "3", ability: "str", text: "Plus 7 (2d6) necrotic damage." }
    ]
  }),
  npc({
    name: "Abyssal Siegebreaker", group: "Abyssal", cr: 11, type: "fiend", subtype: "Demon",
    alignment: "Chaotic Evil", ac: 17, hp: 189, hpFormula: "18d10 + 90", size: "huge",
    abilities: A(24, 10, 21, 8, 13, 14), saves: ["str", "con", "wis"],
    senses: { darkvision: 120 }, di: ["poison"], dr: ["cold", "fire", "lightning"],
    ci: ["poisoned"], languages: ["abyssal"], langCustom: "telepathy 120 ft.",
    environment: "The Abyss", speed: { walk: 40, climb: 30 },
    bio: "<p>What Raistlin sends at fortifications. It was doing this work long before anyone summoned it and shows every sign of having missed it.</p>",
    traits: [
      { name: "Siege Monster", text: "The siegebreaker deals double damage to objects and structures." },
      { name: "Magic Resistance", text: "Advantage on saving throws against spells and other magical effects." },
      { name: "Bound Service", text: "While bound, it cannot attack its binder or disobey a direct instruction. It will interpret 'clear the wall' as broadly as the wording allows." }
    ],
    actions: [
      { name: "Multiattack", text: "The siegebreaker makes two slam attacks." },
      { name: "Slam", dice: [4, 10], type: "bludgeoning", bonus: "7", ability: "str", reach: 10, text: "The target must succeed on a DC 18 Strength saving throw or be knocked prone." }
    ]
  }),
  npc({
    name: "Warden of the Palace of Chains", group: "Abyssal", cr: 15, type: "fiend", subtype: "Demon",
    alignment: "Lawful Evil", ac: 19, hp: 232, hpFormula: "21d10 + 117", size: "huge",
    abilities: A(23, 14, 22, 19, 18, 21), saves: ["dex", "con", "int", "wis"],
    skills: { ins: 2, per: 2 }, senses: { truesight: 120 },
    di: ["poison"], dr: ["cold", "fire", "lightning"], ci: ["charmed", "poisoned"],
    languages: ["abyssal", "common"], langCustom: "telepathy 120 ft.",
    environment: "The Abyss", speed: { walk: 40, fly: 60 },
    legendaryUses: 3, legres: 3,
    bio: "<p>Keeper of the mechanism through which dominion resurrection functions. It did not build the Palace. It maintains it, meticulously, and can explain exactly what the party will break.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If the Warden fails a saving throw, it can choose to succeed instead." },
      { name: "Every Chain a Name", text: "The Warden knows the true name of every soul bound in the Palace, including any the party is trying to free. It will trade one, honestly, for something it wants." },
      { name: "Magic Resistance", text: "Advantage on saving throws against spells and other magical effects." }
    ],
    actions: [
      { name: "Multiattack", text: "The Warden makes two chain attacks and uses Bind." },
      { name: "Chain", dice: [3, 10], type: "force", bonus: "7", ability: "str", reach: 20, text: "The target is grappled (escape DC 19) if it is Large or smaller." },
      { name: "Bind", text: "One creature the Warden can see within 60 feet must succeed on a DC 19 Charisma saving throw or be restrained by spectral chains for 1 minute. While restrained this way, the creature cannot take reactions and its speed is 0. It repeats the save at the end of each of its turns." }
    ],
    legendary: [
      { name: "Tighten", text: "Each creature restrained by the Warden takes 10 (3d6) force damage." },
      { name: "Recite", text: "The Warden speaks one true name. That creature has disadvantage on saving throws against the Warden until the end of its next turn." },
      { name: "Reposition (Costs 2 Actions)", text: "The Warden teleports up to 60 feet and makes one chain attack." }
    ]
  }),
  npc({
    name: "Herald of the Dark Queen", group: "Abyssal", cr: 18, type: "fiend", subtype: "Demon",
    alignment: "Lawful Evil", ac: 20, hp: 297, hpFormula: "22d12 + 154", size: "huge",
    abilities: A(26, 16, 25, 20, 20, 24), saves: ["str", "con", "wis", "cha"],
    skills: { ins: 2, per: 2 }, senses: { truesight: 120 },
    di: ["fire", "poison"], dr: ["cold", "lightning"],
    drCustom: "bludgeoning, piercing, and slashing from nonmagical attacks",
    ci: ["charmed", "frightened", "poisoned"], languages: ["abyssal", "common", "draconic"],
    langCustom: "telepathy 120 ft.", environment: "The Abyss",
    speed: { walk: 40, fly: 80 }, legendaryUses: 3, legres: 3,
    bio: "<p>Takhisis does not come herself until the end. She sends this, and it speaks with her voice, and it is authorised to offer terms.</p>",
    traits: [
      { name: "Legendary Resistance (3/Day)", text: "If the Herald fails a saving throw, it can choose to succeed instead." },
      { name: "Magic Resistance", text: "Advantage on saving throws against spells and other magical effects." },
      { name: "Her Voice", text: "The Herald can speak as Takhisis. Once per encounter it may make an offer to a named creature; the offer is genuine and will be honoured, and the DM should make it genuinely tempting." },
      { name: "Five Heads", text: "The Herald cannot be surprised, has advantage on saves against being blinded, deafened, stunned or knocked unconscious, and can take one extra reaction per round." }
    ],
    actions: [
      { name: "Multiattack", text: "The Herald makes one bite and two claw attacks, or uses Chromatic Breath." },
      { name: "Bite", dice: [3, 12], type: "piercing", bonus: "8", ability: "str", reach: 15 },
      { name: "Claw", dice: [2, 10], type: "slashing", bonus: "8", ability: "str", reach: 10 },
      { name: "Chromatic Breath", text: "<em>Recharge 5&ndash;6.</em> The Herald exhales in a 90-foot cone. Choose acid, cold, fire, lightning or poison. Each creature makes a DC 22 Dexterity saving throw, taking 66 (12d10) damage of the chosen type on a failure, or half on a success." }
    ],
    legendary: [
      { name: "Detect", text: "The Herald makes a Wisdom (Perception) check." },
      { name: "Claw Attack", text: "The Herald makes one claw attack." },
      { name: "Command (Costs 2 Actions)", text: "One creature the Herald can see within 60 feet must succeed on a DC 22 Wisdom saving throw or use its reaction to move up to its speed and make one weapon attack against a target the Herald chooses." }
    ]
  })
];

/* -------------------- SILVANESTI: LORAC'S NIGHTMARE ----------------- */

const nightmare = [
  npc({
    name: "Nightmare Tree", group: "Nightmare", cr: 6, type: "plant", subtype: "",
    alignment: "Neutral Evil", ac: 15, hp: 114, hpFormula: "12d10 + 48", size: "huge",
    abilities: A(20, 8, 18, 6, 12, 9), senses: { blindsight: 60 },
    dv: ["fire"], drCustom: "bludgeoning and piercing", languages: [],
    environment: "Forest", speed: { walk: 10 },
    bio: "<p>The trees of Silvanesti bleed and scream. This one has been doing it for a year and has stopped being a tree in any useful sense.</p>",
    traits: [
      { name: "Bleeding Bark", text: "A creature that hits the tree with a melee attack is sprayed with blood and must succeed on a DC 14 Wisdom saving throw or be frightened until the end of its next turn." },
      { name: "Rooted Horror", text: "The tree cannot be moved from its space by any means short of destroying it. It does not need to see a target to attack it." }
    ],
    actions: [
      { name: "Multiattack", text: "The tree makes two branch attacks." },
      { name: "Branch", dice: [3, 8], type: "bludgeoning", bonus: "5", ability: "str", reach: 20 }
    ]
  }),
  npc({
    name: "Dream of the Fallen", group: "Nightmare", cr: 9, type: "aberration", subtype: "",
    alignment: "Neutral Evil", ac: 16, hp: 136, hpFormula: "16d8 + 64", size: "med",
    abilities: A(14, 18, 18, 16, 16, 20), saves: ["dex", "wis", "cha"],
    skills: { dec: 2, ins: 1 }, senses: { truesight: 60 },
    di: ["psychic"], ci: ["charmed", "frightened", "prone"],
    languages: [], langCustom: "speaks with the voice of whoever it is wearing",
    environment: "Forest", speed: { walk: 30, fly: 30, hover: true },
    bio: "<p>The Nightmare wears the dead. It will appear as someone the party lost and it will know things only that person knew, because the Nightmare took those too.</p>",
    traits: [
      { name: "Borrowed Face", text: "The Dream appears as a dead person known to a creature that can see it, chosen by the DM. It has all that person's memories up to the moment of death. A creature must succeed on a DC 17 Wisdom saving throw to attack it; on a failure it cannot attack the Dream this turn." },
      { name: "Not a Lie", text: "The Dream does not know it is not the person. Divination that detects deception reports it as truthful, because it is." }
    ],
    actions: [
      { name: "Grief", text: "One creature within 60 feet must make a DC 17 Wisdom saving throw, taking 36 (8d8) psychic damage on a failure, or half on a success. A creature that fails also has disadvantage on attack rolls against the Dream until the end of its next turn." },
      { name: "Touch of the Lost", dice: [3, 10], type: "necrotic", bonus: "4", ability: "dex" }
    ]
  }),
  npc({
    name: "Lorac's Remnant", group: "Nightmare", cr: 13, type: "aberration", subtype: "",
    alignment: "Neutral", ac: 17, hp: 189, hpFormula: "18d10 + 90", size: "lg",
    abilities: A(12, 14, 20, 22, 10, 18), saves: ["int", "wis", "cha"],
    skills: { arc: 2, his: 1 }, senses: { truesight: 120 },
    di: ["psychic"], dr: ["cold", "fire", "lightning"],
    ci: ["charmed", "frightened", "paralyzed", "stunned"],
    languages: ["common", "elvish"], langCustom: "telepathy 120 ft.",
    environment: "Forest", speed: { walk: 0, fly: 40, hover: true },
    legres: 2,
    bio: "<p>Not Lorac. What is left where Lorac was, still holding the shape of a king who looked into a Dragon Orb and did not look away in time. It is not hostile. It cannot stop.</p>",
    traits: [
      { name: "Legendary Resistance (2/Day)", text: "If the Remnant fails a saving throw, it can choose to succeed instead." },
      { name: "The Dream Continues", text: "Within Silvanesti, the Remnant reshapes terrain at will. Any square within 120 feet can become difficult terrain, a wall, or a pit at the start of its turn." },
      { name: "Cannot Wake", text: "The Remnant cannot be killed while the Nightmare persists. Reduced to 0 hit points, it reforms in 24 hours. Ending the Nightmare is a story problem, not a combat one." }
    ],
    actions: [
      { name: "Multiattack", text: "The Remnant uses Unmake Memory twice." },
      { name: "Unmake Memory", text: "One creature within 120 feet must make a DC 18 Intelligence saving throw, taking 45 (10d8) psychic damage on a failure, or half on a success. A creature that fails forgets the last hour until it finishes a long rest." },
      { name: "Show Them (Recharge 6)", text: "Each creature within 60 feet must make a DC 18 Wisdom saving throw. On a failure, a creature relives the fall of Silvanesti and is incapacitated for 1 minute, repeating the save at the end of each of its turns." }
    ]
  })
];

export default [...abyssal, ...nightmare];
