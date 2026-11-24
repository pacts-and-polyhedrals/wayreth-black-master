import { npc } from "./statblock.mjs";
import { dragonMagic } from "./dragon-magic.mjs";

const A = (str, dex, con, int, wis, cha) => ({ str, dex, con, int, wis, cha });

/**
 * Dragons are built from 5e's own chromatic/metallic chassis rather than
 * transcribed from any sourcebook: AC, hp, saves and breath scale on the
 * standard CR curve, and the Dragonlance flavour sits in the traits.
 */
function dragon(o) {
  const breathName = `${o.breathType[0].toUpperCase()}${o.breathType.slice(1)} Breath`;
  return npc({
    name: o.name, group: o.group ?? "Dragon", cr: o.cr,
    type: "dragon", subtype: o.subtype ?? "",
    alignment: o.alignment, ac: o.ac, hp: o.hp, hpFormula: o.hpFormula,
    size: o.size, abilities: o.abilities, saves: ["dex", "con", "wis", "cha"],
    skills: { prc: 2, ste: 1, ...(o.skills ?? {}) },
    senses: { blindsight: o.blindsight ?? 30, darkvision: o.darkvision ?? 120 },
    languages: ["common", "draconic"], environment: o.environment ?? "Any",
    speed: { walk: o.walk ?? 40, fly: o.fly ?? 80, swim: o.swim ?? 0 },
    di: [o.breathType], ci: o.ci ?? [], bio: o.bio,
    // Adult and older dragons cast innately under the Monster Manual variant,
    // and Charisma is what sets the DC.
    spellcasting: o.spellcasting ?? "",
    legendaryUses: o.legendaryUses ?? 3, legres: o.legres ?? 3,
    traits: [
      { name: "Legendary Resistance", text: `If the dragon fails a saving throw, it can choose to succeed instead. ${o.legres ?? 3}/day.` },
      ...(o.traits ?? [])
    ],
    actions: [
      { name: "Multiattack", text: "The dragon makes one bite attack and two claw attacks.", section: "action" },
      { name: "Bite", dice: o.bite, type: "piercing", bonus: o.atkBonus, reach: o.reach ?? 10, ability: "str", extra: o.biteExtra },
      { name: "Claw", dice: o.claw, type: "slashing", bonus: o.atkBonus, reach: o.reach ?? 5, ability: "str" },
      { name: breathName, text: o.breathText, section: "action", uses: { max: 1, per: "sr" } },
      ...(o.actions ?? [])
    ],
    legendary: [
      { name: "Detect", text: "The dragon makes a Wisdom (Perception) check." },
      { name: "Tail Attack", text: `The dragon makes a tail attack: +${o.atkBonus} to hit, reach ${(o.reach ?? 10) + 5} ft., ${o.tailAvg} bludgeoning damage.` },
      { name: "Wing Attack (Costs 2 Actions)", text: `Each creature within ${o.wingRange ?? 10} feet must succeed on a DC ${o.wingDC} Dexterity saving throw or take ${o.wingAvg} bludgeoning damage and be knocked prone. The dragon can then fly up to half its speed.` }
    ]
  });
}

/* ================================================================== *
 *  CHROMATIC — Takhisis's five. These are the war.
 * ================================================================== */

const chromatic = [
  dragon({
    name: "Red Dragon, Young", subtype: "Chromatic", cr: 10, alignment: "Chaotic Evil",
    ac: 18, hp: 178, hpFormula: "17d10 + 85", size: "lg",
    abilities: A(23, 10, 21, 14, 11, 19), breathType: "fire", atkBonus: "6",
    bite: [2, 10], biteExtra: [[1, 6, "fire"]], claw: [2, 6], tailAvg: "15 (2d8 + 6)",
    wingDC: 17, wingAvg: "13 (2d6 + 6)", environment: "Mountain",
    breathText: "The dragon exhales fire in a 30-foot cone. Each creature in the area must make a DC 17 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much on a success.",
    bio: "<p>The Red Dragonarmy's mounts and the Highlords' chosen. Verminaard's forces ride these.</p>"
  }),
  dragon({
    name: "Red Dragon, Adult", subtype: "Chromatic", spellcasting: "cha", cr: 17, alignment: "Chaotic Evil",
    ac: 19, hp: 256, hpFormula: "19d12 + 133", size: "huge",
    abilities: A(27, 10, 25, 16, 13, 21), breathType: "fire", atkBonus: "9", legres: 3,
    bite: [2, 10], biteExtra: [[2, 6, "fire"]], claw: [2, 6], tailAvg: "17 (2d8 + 8)",
    wingDC: 22, wingAvg: "15 (2d6 + 8)", environment: "Mountain", blindsight: 60,
    breathText: "The dragon exhales fire in a 60-foot cone. Each creature in the area must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage on a failed save, or half as much on a success.",
    traits: [{ name: "Frightful Presence", text: "Each creature of the dragon's choice within 120 feet and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute, repeating the save at the end of each of its turns." },
      dragonMagic('Red Dragon, Adult')
    ],
    bio: "<p>A Highlord's personal mount. If one of these is in a scene, the scene is about the dragon.</p>"
  }),
  dragon({
    name: "Blue Dragon, Young", subtype: "Chromatic", cr: 9, alignment: "Lawful Evil",
    ac: 18, hp: 152, hpFormula: "16d10 + 64", size: "lg",
    abilities: A(21, 10, 19, 14, 13, 17), breathType: "lightning", atkBonus: "5",
    bite: [2, 10], biteExtra: [[1, 10, "lightning"]], claw: [2, 6], tailAvg: "13 (2d8 + 5)",
    wingDC: 16, wingAvg: "12 (2d6 + 5)", environment: "Desert", walk: 40, fly: 80,
    breathText: "The dragon exhales lightning in a 60-foot line 5 feet wide. Each creature in the line must make a DC 16 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much on a success.",
    bio: "<p>Kitiara's arm of the war. Disciplined, patient, and considerably more dangerous as a commander than as a beast.</p>"
  }),
  dragon({
    name: "Blue Dragon, Adult", subtype: "Chromatic", spellcasting: "cha", cr: 16, alignment: "Lawful Evil",
    ac: 19, hp: 225, hpFormula: "18d12 + 108", size: "huge",
    abilities: A(25, 10, 23, 16, 15, 19), breathType: "lightning", atkBonus: "8",
    bite: [2, 10], biteExtra: [[2, 10, "lightning"]], claw: [2, 6], tailAvg: "15 (2d8 + 7)",
    wingDC: 20, wingAvg: "14 (2d6 + 7)", environment: "Desert", blindsight: 60,
    breathText: "The dragon exhales lightning in a 90-foot line 10 feet wide. Each creature in the line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much on a success.",
    traits: [{ name: "Frightful Presence", text: "Each creature of the dragon's choice within 120 feet and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute." },
      dragonMagic('Blue Dragon, Adult')
    ],
    bio: "<p>Skie and his kind. A blue will negotiate, and mean it, and honour the terms exactly as written.</p>"
  }),
  dragon({
    name: "Green Dragon, Young", subtype: "Chromatic", cr: 8, alignment: "Lawful Evil",
    ac: 18, hp: 136, hpFormula: "16d10 + 48", size: "lg",
    abilities: A(19, 12, 17, 16, 13, 15), breathType: "poison", atkBonus: "6",
    bite: [2, 10], biteExtra: [[2, 6, "poison"]], claw: [2, 6], tailAvg: "13 (2d8 + 4)",
    wingDC: 15, wingAvg: "11 (2d6 + 4)", environment: "Forest", swim: 40,
    skills: { dec: 2, ins: 1, per: 2 },
    breathText: "The dragon exhales poisonous gas in a 30-foot cone. Each creature in the area must make a DC 14 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much on a success.",
    bio: "<p>Cyan Bloodrane's kin. Greens do not besiege; they persuade, and they are extremely good at it.</p>"
  }),
  dragon({
    name: "Black Dragon, Young", subtype: "Chromatic", cr: 7, alignment: "Chaotic Evil",
    ac: 18, hp: 127, hpFormula: "15d10 + 45", size: "lg",
    abilities: A(19, 14, 17, 12, 11, 15), breathType: "acid", atkBonus: "6",
    bite: [2, 10], biteExtra: [[1, 8, "acid"]], claw: [2, 6], tailAvg: "13 (2d8 + 4)",
    wingDC: 14, wingAvg: "11 (2d6 + 4)", environment: "Swamp", swim: 40,
    breathText: "The dragon exhales acid in a 30-foot line 5 feet wide. Each creature in the line must make a DC 14 Dexterity saving throw, taking 49 (11d8) acid damage on a failed save, or half as much on a success.",
    bio: "<p>Swamp and ruin. Blacks take the assignments nobody else wants and hold grudges for centuries.</p>"
  }),
  dragon({
    name: "White Dragon, Young", subtype: "Chromatic", cr: 6, alignment: "Chaotic Evil",
    ac: 17, hp: 133, hpFormula: "14d10 + 56", size: "lg",
    abilities: A(18, 10, 18, 6, 11, 12), breathType: "cold", atkBonus: "7",
    bite: [2, 10], biteExtra: [[1, 8, "cold"]], claw: [2, 6], tailAvg: "13 (2d8 + 4)",
    wingDC: 15, wingAvg: "11 (2d6 + 4)", environment: "Arctic", swim: 40, walk: 40,
    breathText: "The dragon exhales an icy blast in a 30-foot cone. Each creature in the area must make a DC 15 Constitution saving throw, taking 45 (10d8) cold damage on a failed save, or half as much on a success.",
    traits: [{ name: "Ice Walk", text: "The dragon can move across and climb icy surfaces without an ability check. Difficult terrain composed of ice or snow does not cost it extra movement." }],
    bio: "<p>Icewall. The least cunning of the five and the least interested in being reasoned with.</p>"
  })
];

/* ================================================================== *
 *  METALLIC — the good dragons, absent for most of the war because
 *  of the Oath, and because their eggs are what draconians are made of.
 * ================================================================== */

const metallic = [
  dragon({
    name: "Silver Dragon, Young", group: "Dragon (Metallic)", subtype: "Metallic", cr: 9,
    alignment: "Lawful Good", ac: 18, hp: 168, hpFormula: "16d10 + 80", size: "lg",
    abilities: A(23, 10, 21, 14, 11, 19), breathType: "cold", atkBonus: "6",
    bite: [2, 10], claw: [2, 6], tailAvg: "15 (2d8 + 6)", wingDC: 17, wingAvg: "13 (2d6 + 6)",
    environment: "Mountain",
    breathText: "The dragon uses one of the following. <strong>Cold Breath.</strong> A 30-foot cone; DC 17 Constitution save, 54 (12d8) cold damage on a failure, half on a success. <strong>Paralyzing Breath.</strong> A 30-foot cone; DC 17 Constitution save or be paralyzed for 1 minute, repeating the save at the end of each turn.",
    traits: [{ name: "Bound by the Oath", text: "Silver dragons of this era will not act openly against the Dragonarmies. A silver that breaks the Oath does so knowing what was done to its eggs, and it does not stop." }],
    bio: "<p>Sivak draconians are made from these eggs. A silver that learns this in the party's presence is a scene, not an encounter.</p>"
  }),
  dragon({
    name: "Gold Dragon, Young", group: "Dragon (Metallic)", subtype: "Metallic", cr: 10,
    alignment: "Lawful Good", ac: 18, hp: 178, hpFormula: "17d10 + 85", size: "lg",
    abilities: A(23, 14, 21, 16, 13, 20), breathType: "fire", atkBonus: "6",
    bite: [2, 10], claw: [2, 6], tailAvg: "15 (2d8 + 6)", wingDC: 17, wingAvg: "13 (2d6 + 6)",
    environment: "Any", swim: 40, skills: { ins: 2, per: 2 },
    breathText: "The dragon uses one of the following. <strong>Fire Breath.</strong> A 30-foot cone; DC 17 Dexterity save, 55 (10d10) fire damage on a failure, half on a success. <strong>Weakening Breath.</strong> A 30-foot cone; DC 17 Strength save or have disadvantage on Strength-based attacks, checks and saves for 1 minute.",
    traits: [{ name: "Bound by the Oath", text: "As the silver dragon. Auraks are made from gold eggs." }],
    bio: "<p>The rarest sight in the war, and the one the Whitestone forces keep asking for.</p>"
  })
];

export default [...chromatic, ...metallic];
