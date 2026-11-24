import { MODE, activity, effect, legacyItem } from "./legacy.mjs";

const owner = "Solanthis";

/**
 * Ispin's Promise.
 *
 * Solanthis' identity is responsibility, not caution, so the compass pays for
 * preparation and protection. Two features are deliberately reissued at a later
 * tier rather than stacked: the Awakened Not Them absorbs Calculated
 * Intervention, and Grand Contingency replaces Contingency outright, so the
 * sheet never shows two versions of the same reaction.
 */
export const definition = {
  order: 2,
  name: "Ispin's Promise",
  identifier: "ispins-promise",
  img: "icons/tools/navigation/compass-brass-blue.webp",
  equipmentType: "wondrous",
  bearer: owner,
  chargeName: "Promise Charges",
  dc: "spellcasting",
  dcLabel: "his spellcasting ability",
  recoveryPeriod: "dawn",
  weight: 1,

  subtitle: "Wondrous item and arcane focus, legacy item (requires attunement by Solanthis)",
  lead: "A brass compass with a needle that has never once pointed north. Ispin Greenshield "
    + "carried it, and the only instruction that came with it was that it should be given to "
    + "somebody who would worry about the answer.",
  quote: "It does not tell you where you are going. It tells you who is about to need you.",
  quoteBy: "Ispin Greenshield, to a young man who asked the wrong question",
  origin: "Ispin Greenshield's own, handed on rather than inherited.",

  player: {
    summary: "The compass pays Solanthis for having thought about it beforehand. Almost nothing on "
      + "it improves his own turn; nearly all of it spends his reaction on somebody else's.",
    tips: [
      "**Ask for the attack total before spending Not Them.** It is +2 AC against an attack that "
        + "has already been rolled, and a hit that misses by one is the entire point of the "
        + "feature.",
      "**Prepared Mind is free.** It costs no charge and resets every long rest, so choosing a "
        + "damage type is pure profit. Never skip it \u2014 pick whatever the party expects to "
        + "walk into.",
      "**He cannot run two auras.** No One Gets Left Behind and The Promise both need "
        + "concentration, and so does any concentration spell. Decide before initiative which "
        + "job he has this fight.",
      "**The Promise deliberately excludes him.** That is not an oversight, and it is most of "
        + "why it is worth an action.",
      "**Contingency is declared in advance, after a long rest.** Endure on whoever stands in "
        + "front is almost always right; Brace or Mind on whoever has the worst save."
    ],
    rulings: [
      { q: "Does Not Them stack with the Shield spell?",
        a: "Yes. They are separate bonuses to the same AC against the same attack, and both "
          + "apply." },
      { q: "Can I Planned for This be used on an enemy's failed save?",
        a: "It says any creature he can see, so yes \u2014 if he can think of a reason he would "
          + "want to." },
      { q: "Can Contingency Pocket produce a healing potion?",
        a: "No. It is mundane gear worth 25 gp or less; a potion is a magic item." },
      { q: "Can one creature hold two contingencies?",
        a: "No. One at a time, and it vanishes once it triggers." },
      { q: "Does Forewarned mean he cannot be ambushed at all?",
        a: "He cannot be surprised while conscious, which means he acts normally in the first "
          + "round. The ambush still happens." }
    ]
  },

  tiers: {
    dormant: {
      recovery: "all of them returning at dawn",
      blocks: [
        { h: "The Compass", passive: true },
        "The brass compass serves as an arcane focus. Its needle points toward whichever "
          + "creature within 60 feet Solanthis sincerely believes is in the greatest immediate "
          + "physical danger. This gives no supernatural knowledge of hidden creatures.",
        { h: "Forewarned", passive: "effect" },
        "Solanthis gains a **+1 bonus to initiative** and cannot be surprised while conscious.",
        { h: "Not Them" },
        "When a creature Solanthis can see within 30 feet is hit by an attack, he can use his "
          + "reaction and expend 1 charge to grant it **+2 AC against the triggering attack**, "
          + "potentially turning the hit into a miss.",
        { h: "Prepared Mind" },
        "At the end of each long rest, choose acid, cold, fire, lightning, necrotic, psychic, "
          + "radiant or thunder. Once before Solanthis' next long rest, when he or a creature "
          + "within 30 feet takes the selected damage type, he can use his reaction to grant "
          + "that creature resistance to the triggering damage."
      ]
    },

    awakened: {
      trigger: "Solanthis possesses the means to force someone to follow what he believes is "
        + "the correct course, and deliberately allows that person to make the decision "
        + "themselves.",
      recovery: "all of them returning at dawn",
      blocks: [
        { h: "I Planned for This" },
        "When a creature Solanthis can see within 30 feet fails a saving throw, he can use his "
          + "reaction and expend 2 charges to allow it to reroll. The new roll must be used.",
        { h: "Contingency Pocket" },
        "Once per long rest, Solanthis may produce a mundane object he could reasonably have "
          + "acquired. It must cost no more than 25 gp, weigh no more than 10 pounds, fit "
          + "inside a backpack, and not be a weapon, armour, poison or spell component with a "
          + "listed cost. It disappears at the next dawn if not consumed or destroyed. "
          + "Narratively, he prepared it earlier.",
        { h: "Calculated Intervention", act: "Not Them (Calculated Intervention)" },
        "Not Them improves: when it turns the attack into a miss, the protected creature may "
          + "immediately move **5 feet without provoking opportunity attacks**. This replaces "
          + "the Dormant version of Not Them."
      ]
    },

    exalted: {
      trigger: "Solanthis accepts a serious personal risk because his preparation can protect "
        + "others, despite having a safer option available to him.",
      recovery: "regaining 1d6 + 1 at dawn",
      blocks: [
        { h: "Contingency" },
        "After a long rest, Solanthis may designate **two willing creatures**, including "
          + "himself, that he can see. For each, choose one contingency:",
        {
          list: [
            "**Escape.** When reduced below half hit points, the creature may immediately move "
              + "up to half its speed without provoking opportunity attacks.",
            "**Brace.** When it fails a Strength, Dexterity or Constitution saving throw, it "
              + "adds 1d6, potentially succeeding.",
            "**Mind.** When it fails an Intelligence, Wisdom or Charisma saving throw, it adds "
              + "1d6, potentially succeeding.",
            "**Endure.** When reduced to 0 hit points without being killed outright, it drops "
              + "to 1 hit point instead."
          ]
        },
        "Each contingency triggers once and then disappears. A creature can have only one at a "
          + "time.",
        { h: "No One Gets Left Behind" },
        "As an action, Solanthis can expend 3 charges. For 1 minute a 20-foot-radius protective "
          + "field moves with him, and while inside it his allies ignore nonmagical difficult "
          + "terrain, have advantage on death saving throws, cannot have their speed reduced "
          + "below 10 feet unless incapacitated, and gain **+1 AC**. He must concentrate on "
          + "this as though concentrating on a spell.",
        { h: "There Was Another Way" },
        "When Solanthis casts a spell that deals damage, he may choose any number of creatures "
          + "he can see to automatically succeed on their saving throws against that spell and "
          + "take **no damage** if they would normally take half. Once used, this cannot be "
          + "used again until a short or long rest."
      ]
    },

    legendary: {
      trigger: "Solanthis faces a situation in which imposing his will would genuinely be "
        + "easier and possibly safer, but finds a way to protect people **without taking their "
        + "agency from them**.",
      recovery: "regaining 1d8 + 1 at dawn",
      blocks: [
        { h: "Grand Contingency" },
        "Solanthis can maintain contingencies on a number of creatures equal to his proficiency "
          + "bonus rather than two. This replaces Contingency.",
        { h: "I Accounted for That" },
        "Once per long rest, after a creature Solanthis can see within 60 feet rolls a natural "
          + "1, suffers a critical hit, fails a saving throw or is reduced to 0 hit points, he "
          + "can use his reaction and declare that he prepared for precisely this possibility. "
          + "Choose one:",
        {
          list: [
            "the natural 1 becomes a 10;",
            "the critical hit becomes a normal hit;",
            "the failed save is rerolled with advantage;",
            "the creature drops to 1 hit point."
          ]
        },
        { h: "The Promise" },
        "Once per long rest, as an action, Solanthis chooses up to six willing creatures within "
          + "30 feet. For 1 minute each gains resistance to one damage type chosen individually "
          + "when this begins, +2 AC, advantage on death saving throws, and immunity to being "
          + "frightened. **Solanthis gains none of these benefits.** The effect requires "
          + "concentration. At his absolute strongest, his greatest magic is still about "
          + "everyone else getting home."
      ]
    }
  },

  effects: [
    effect({
      owner,
      name: "Forewarned",
      img: "icons/tools/navigation/compass-brass-blue.webp",
      description: "+1 to initiative. Solanthis also cannot be surprised while conscious, "
        + "which is adjudicated at the table rather than by this effect.",
      changes: [{ key: "system.attributes.init.bonus", mode: MODE.ADD, value: "1" }]
    })
  ],

  activities: [
    activity({
      owner, tier: "dormant", until: "awakened", type: "utility", name: "Not Them",
      activation: "reaction", charges: 1, range: { feet: 30 },
      affects: { count: "1", type: "creature" },
      condition: "A creature Solanthis can see within 30 feet is hit by an attack",
      flavor: "<p>That creature gains <strong>+2 AC against the triggering attack</strong>, "
        + "which may turn the hit into a miss.</p>"
    }),
    activity({
      owner, tier: "dormant", type: "utility", name: "Prepared Mind",
      activation: "reaction", perRest: "long", range: { feet: 30 },
      affects: { count: "1", type: "creature" },
      condition: "Solanthis or a creature within 30 feet takes the damage type chosen at the "
        + "end of his last long rest",
      flavor: "<p>That creature gains resistance to the triggering damage.</p><p><em>Choose "
        + "the damage type — acid, cold, fire, lightning, necrotic, psychic, radiant or "
        + "thunder — at the end of each long rest.</em></p>"
    }),

    activity({
      owner, tier: "awakened", type: "utility", name: "Not Them (Calculated Intervention)",
      activation: "reaction", charges: 1, range: { feet: 30 },
      affects: { count: "1", type: "creature" },
      condition: "A creature Solanthis can see within 30 feet is hit by an attack",
      flavor: "<p>That creature gains <strong>+2 AC against the triggering attack</strong>. If "
        + "this turns the hit into a miss, it may immediately move 5 feet without provoking "
        + "opportunity attacks.</p>"
    }),
    activity({
      owner, tier: "awakened", type: "utility", name: "I Planned for This",
      activation: "reaction", charges: 2, range: { feet: 30 },
      affects: { count: "1", type: "creature" },
      condition: "A creature Solanthis can see within 30 feet fails a saving throw",
      flavor: "<p>That creature rerolls the saving throw. The new roll must be used.</p>"
    }),
    activity({
      owner, tier: "awakened", type: "utility", name: "Contingency Pocket",
      activation: "action", perRest: "long", range: { self: true },
      affects: { count: "1", type: "self" },
      flavor: "<p>Produce a mundane object he could reasonably have acquired: 25 gp or less, "
        + "10 pounds or less, backpack-sized, and not a weapon, armour, poison or costed spell "
        + "component. It disappears at the next dawn if unused.</p>"
    }),

    activity({
      owner, tier: "exalted", until: "legendary", type: "utility", name: "Contingency",
      activation: "special", perRest: "long", range: { special: "sight" },
      affects: { count: "2", type: "willing" },
      condition: "After a long rest",
      flavor: "<p>Designate two willing creatures he can see, himself included, and give each "
        + "one contingency: <strong>Escape</strong>, <strong>Brace</strong>, "
        + "<strong>Mind</strong> or <strong>Endure</strong>. Each triggers once, then "
        + "disappears; a creature can hold only one at a time.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "utility", name: "No One Gets Left Behind",
      activation: "action", charges: 3, range: { self: true },
      duration: { units: "minute", value: 1, concentration: true },
      affects: { count: "", type: "ally", special: "within 20 feet of Solanthis" },
      flavor: "<p>A 20-foot-radius field moves with him for 1 minute. Allies inside it ignore "
        + "nonmagical difficult terrain, have advantage on death saving throws, cannot be "
        + "slowed below 10 feet unless incapacitated, and gain +1 AC. Requires "
        + "concentration.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "utility", name: "There Was Another Way",
      activation: "special", perRest: "short", range: { special: "sight" },
      affects: { count: "", type: "creature" },
      condition: "Solanthis casts a spell that deals damage",
      flavor: "<p>Any number of creatures he can see automatically succeed on their saving "
        + "throws against that spell, and take no damage where they would normally take "
        + "half.</p>"
    }),

    activity({
      owner, tier: "legendary", type: "utility", name: "Grand Contingency",
      activation: "special", perRest: "long", range: { special: "sight" },
      affects: { count: "@prof", type: "willing" },
      condition: "After a long rest",
      flavor: "<p>Designate willing creatures up to his proficiency bonus and give each one "
        + "contingency: <strong>Escape</strong>, <strong>Brace</strong>, <strong>Mind</strong> "
        + "or <strong>Endure</strong>. Each triggers once, then disappears.</p>"
    }),
    activity({
      owner, tier: "legendary", type: "utility", name: "I Accounted for That",
      activation: "reaction", perRest: "long", range: { feet: 60 },
      affects: { count: "1", type: "creature" },
      condition: "A creature within 60 feet rolls a natural 1, suffers a critical hit, fails a "
        + "saving throw or is reduced to 0 hit points",
      flavor: "<p>Choose one: the natural 1 becomes a 10; the critical hit becomes a normal "
        + "hit; the failed save is rerolled with advantage; or the creature drops to 1 hit "
        + "point.</p>"
    }),
    activity({
      owner, tier: "legendary", type: "utility", name: "The Promise",
      activation: "action", perRest: "long", range: { feet: 30 },
      duration: { units: "minute", value: 1, concentration: true },
      affects: { count: "6", type: "willing" },
      flavor: "<p>For 1 minute each chosen creature gains resistance to one damage type chosen "
        + "individually, +2 AC, advantage on death saving throws and immunity to being "
        + "frightened. <strong>Solanthis gains none of it.</strong> Requires "
        + "concentration.</p>"
    })
  ]
};

export default legacyItem(definition);
