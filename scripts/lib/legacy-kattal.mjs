import { MODE, activity, effect, legacyItem } from "./legacy.mjs";

const owner = "Kattal";

/**
 * Ispin's Unmoving Nail.
 *
 * The base object stays a working Immovable Rod. Everything built on top of it
 * moves deliberately away from "big minotaur hits harder" and toward the only
 * thing his Strength is finally for: other people surviving because Kattal
 * refuses to move.
 *
 * Carry the Impossible and The Unmoving both land on
 * `system.attributes.encumbrance.multipliers.overall`, which is one of dnd5e's
 * formula fields, so a single effect can carry the whole progression and gate
 * itself on level without anyone toggling anything.
 */
export const definition = {
  order: 6,
  name: "Ispin's Unmoving Nail",
  identifier: "ispins-unmoving-nail",
  img: "icons/weapons/polearms/spear-flared-iron.webp",
  equipmentType: "rod",
  bearer: owner,
  chargeName: "Bastion Charges",
  dc: "str",
  dcLabel: "his Strength",
  recoveryPeriod: "dawn",
  weight: 2,

  subtitle: "Rod, legacy item (requires attunement by Kattal)",
  lead: "A black iron spike the length of a forearm, with a flattened head that has been struck "
    + "a great many times. It is the second thing of Ispin Greenshield's to leave his hands, and "
    + "the only one he never explained.",
  quote: "A nail's whole purpose is to stay where it was put. Everything else about it is "
    + "decoration.",
  quoteBy: "Ispin Greenshield",
  origin: "Ispin Greenshield's, given to the largest person who ever asked him for nothing.",

  player: {
    summary: "The Nail is not a weapon and it never becomes one. Its whole progression is about "
      + "turning Kattal's Strength into other people's survival.",
    tips: [
      "**Catch Them has no save against a willing creature.** Standing next to whoever is about "
        + "to be thrown, dropped or knocked down is the entire build.",
      "**Brace only works while the Rod is activated.** Press the button first; it is an action, "
        + "and forgetting it is the most common way to lose the feature.",
      "**Hold It! is free against anything Huge or smaller.** No charge, repeatable, contested "
        + "check \u2014 it is the best crowd control he has and it costs nothing.",
      "**Living Rampart means taking the hit on purpose.** Check his own hit points before "
        + "offering the three-quarters cover.",
      "**The Last Wall sets his speed to 0.** Choose the square before he uses it, because he is "
        + "not leaving it for a minute."
    ],
    rulings: [
      { q: "Does Carry the Impossible need switching on?",
        a: "No. It reads his level by itself \u2014 four times capacity from 6th and eight times "
          + "from 15th." },
      { q: "Can Catch Them stop a falling ally taking damage?",
        a: "It stops the fall if he can support the weight, so the rest of the fall does no "
          + "damage. Anything already fallen has already happened." },
      { q: "Does The Unmoving actually make him Gargantuan?",
        a: "Only for carrying, pushing, dragging, lifting and deciding what he can grapple or "
          + "physically block. Not reach, not weapon damage, not the space he occupies." },
      { q: "Can he use Hold It! and an opportunity attack in the same round?",
        a: "Not normally \u2014 that is one reaction. During The Last Wall he gets a second "
          + "reaction for exactly these." },
      { q: "Is the Nail a magic weapon he can hit people with?",
        a: "No. It is a rod. Nothing on it improves an attack, and that is deliberate." }
    ]
  },

  tiers: {
    dormant: {
      recovery: "all of them restored at dawn",
      blocks: [
        { h: "Immovable Rod", act: "Press the Button" },
        "The Nail retains the normal properties of an *immovable rod*. You can use an action to "
          + "press the button, fixing the Nail in place until you or another creature uses an "
          + "action to press the button again. It can hold up to 8,000 pounds; more weight causes "
          + "it to deactivate and fall. A creature can use an action to make a DC 30 Strength "
          + "check, moving the fixed Nail up to 10 feet on a success.",
        { h: "Brace", passive: "conditional" },
        "While Kattal is holding the activated Rod, he has advantage on checks and saves against "
          + "being knocked prone, reduces forced movement against himself by 10 feet, and has "
          + "advantage on Strength checks made to lift, hold, push or prevent something from "
          + "moving.",
        { h: "Catch Them" },
        "When a creature within Kattal's reach falls, is knocked prone or is forcibly moved, he "
          + "can use his reaction and expend 1 charge. A willing creature is automatically caught. "
          + "An unwilling creature makes a Strength or Dexterity saving throw against Kattal's "
          + "Legacy Save DC; on a failure he catches it. A falling creature stops falling if "
          + "Kattal is capable of supporting its weight."
      ]
    },

    awakened: {
      trigger: "Kattal holds something dangerous back, or supports something failing, when "
        + "releasing it would be safer for him.",
      recovery: "all of them restored at dawn",
      blocks: [
        { h: "Behind Me" },
        "As a bonus action, Kattal expends 1 charge and designates a creature within 5 feet. Until "
          + "the beginning of his next turn, that creature gains **half cover** while it remains "
          + "within 5 feet of him.",
        { h: "No." },
        "When Kattal fails a Strength check or Strength saving throw, he can expend 2 charges to "
          + "treat the d20 as a **15**.",
        { h: "Carry the Impossible", passive: "effect" },
        "Kattal counts as **two sizes larger** when determining carrying capacity and how much "
          + "weight he can push, drag or lift."
      ]
    },

    exalted: {
      trigger: "Kattal deliberately makes himself the barrier between overwhelming danger and "
        + "creatures unable to withstand it.",
      recovery: "regaining 1d6 + 1 at dawn",
      blocks: [
        { h: "You Go Through Me" },
        "As a bonus action, Kattal can expend 3 charges to enter Bastion Stance for 1 minute. While "
          + "in this stance:",
        {
          list: [
            "Kattal cannot be forcibly moved or knocked prone while conscious unless he chooses;",
            "allies within 5 feet gain half cover;",
            "hostile creatures treat the area within 10 feet of Kattal as difficult terrain;",
            "when a creature within Kattal's reach attacks an ally, Kattal can use his reaction to "
              + "make one melee weapon attack against that creature."
          ]
        },
        "The stance ends early if Kattal becomes incapacitated.",
        { h: "Hold It!", act: ["Hold It!", "Hold It! (Gargantuan)"] },
        "When a Huge or smaller creature attempts to move through Kattal's reach, he can use his "
          + "reaction to make an Athletics check contested by its Athletics or Acrobatics. On a "
          + "success its speed becomes **0 for the remainder of the turn**. He may attempt this "
          + "against a Gargantuan creature by expending 1 Bastion Charge.",
        { h: "Living Rampart" },
        "When Kattal would provide half cover to an ally, he may choose to provide "
          + "**three-quarters cover** instead. Until the beginning of his next turn, attacks that "
          + "miss that ally specifically because of this cover bonus hit Kattal instead if the "
          + "attack roll would hit his AC."
      ]
    },

    legendary: {
      trigger: "Kattal stands against something he cannot reasonably overpower because someone "
        + "behind him needs him to remain standing.",
      recovery: "regaining 1d8 + 1 at dawn",
      blocks: [
        { h: "The Unmoving", passive: true },
        "While conscious and touching the ground, Kattal cannot be forcibly moved or knocked prone "
          + "unless he chooses, has advantage on Strength checks and Strength saving throws, and "
          + "counts as **Gargantuan** solely for carrying, pushing, dragging, lifting and "
          + "determining what creatures he can grapple or physically impede. He does **not** gain "
          + "Gargantuan reach, weapon damage or occupied space.",
        { h: "I Said No" },
        "Once per short or long rest, when Kattal fails a Strength saving throw or Strength check, "
          + "he can choose to succeed instead. If the effect would move, crush, drag or physically "
          + "overwhelm him, he may additionally prevent that effect from moving through his space "
          + "until the beginning of his next turn.",
        { h: "The Last Wall" },
        "Once per long rest, as a bonus action, Kattal activates the Nail for 1 minute. He gains "
          + "resistance to all damage, a 10-foot aura granting allies half cover, immunity to "
          + "forced movement and prone, and one additional reaction each round that can only be "
          + "used for Catch Them, Hold It!, Living Rampart or an opportunity attack. However, "
          + "**Kattal's speed becomes 0.** He may end the effect at the beginning of any of his "
          + "turns. He becomes exactly what the Nail has been teaching him to become since level "
          + "3: not the strongest creature on the battlefield, but the thing the battlefield "
          + "cannot move."
      ]
    }
  },

  effects: [
    effect({
      owner,
      name: "Carry the Impossible",
      img: "icons/weapons/polearms/spear-flared-iron.webp",
      description: "Two sizes larger for carrying, pushing, dragging and lifting from level 6 "
        + "(x4), and Gargantuan from level 15 (x8). The multiplier is a dnd5e formula field, so "
        + "this gates itself on Kattal's level and needs no switching on.",
      changes: [{
        key: "system.attributes.encumbrance.multipliers.overall",
        mode: MODE.OVERRIDE,
        value: "1 + 3 * min(1, max(0, @details.level - 5)) + 4 * min(1, max(0, @details.level - 14))"
      }]
    })
  ],

  activities: [
    activity({
      owner, tier: "dormant", type: "utility", name: "Press the Button",
      activation: "action", range: { touch: true },
      affects: { count: "1", type: "self" },
      flavor: "<p>The Nail fixes in place, or releases. It holds up to 8,000 pounds; more weight "
        + "deactivates it. A creature can spend an action on a DC 30 Strength check to shift the "
        + "fixed Nail up to 10 feet.</p><p>While Kattal holds it activated, <strong>Brace</strong> "
        + "applies: advantage against being knocked prone, forced movement against him reduced by "
        + "10 feet, and advantage on Strength checks to lift, hold, push or hold something "
        + "still.</p>"
    }),
    activity({
      owner, tier: "dormant", type: "save", name: "Catch Them",
      activation: "reaction", charges: 1, range: { special: "Kattal's reach" },
      affects: { count: "1", type: "creature" },
      save: ["str", "dex"], dc: "str", onSave: "none",
      condition: "A creature within Kattal's reach falls, is knocked prone or is forcibly moved",
      flavor: "<p>A willing creature is caught automatically — no save needed. An unwilling "
        + "creature is caught on a failed save. A falling creature stops falling if Kattal can "
        + "support its weight.</p>"
    }),

    activity({
      owner, tier: "awakened", type: "utility", name: "Behind Me",
      activation: "bonus", charges: 1, range: { feet: 5 },
      affects: { count: "1", type: "creature" },
      flavor: "<p>Until the beginning of Kattal's next turn, that creature has half cover while it "
        + "stays within 5 feet of him.</p>"
    }),
    activity({
      owner, tier: "awakened", type: "utility", name: "No.",
      activation: "special", charges: 2, range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "Kattal fails a Strength check or Strength saving throw",
      flavor: "<p>Treat the d20 as a <strong>15</strong>.</p>"
    }),

    activity({
      owner, tier: "exalted", type: "utility", name: "You Go Through Me",
      activation: "bonus", charges: 3, range: { self: true },
      duration: { units: "minute", value: 1 },
      affects: { count: "1", type: "self" },
      flavor: "<p>Bastion Stance for 1 minute: Kattal cannot be forcibly moved or knocked prone "
        + "while conscious unless he chooses; allies within 5 feet gain half cover; hostiles treat "
        + "the area within 10 feet as difficult terrain; and when a creature within his reach "
        + "attacks an ally he can use his reaction to make one melee weapon attack against it. "
        + "Ends early if he is incapacitated.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "check", name: "Hold It!",
      activation: "reaction", range: { special: "Kattal's reach" },
      affects: { count: "1", type: "creature" },
      ability: "str", associated: ["ath"],
      condition: "A Huge or smaller creature tries to move through Kattal's reach",
      flavor: "<p>Contested by the creature's Athletics or Acrobatics. On a success its speed "
        + "becomes 0 for the remainder of the turn.</p><p><em>Against a Gargantuan creature, spend "
        + "1 Bastion Charge to attempt it at all — deduct it from the item by hand, or use "
        + "the Gargantuan version below.</em></p>"
    }),
    activity({
      owner, tier: "exalted", type: "check", name: "Hold It! (Gargantuan)",
      activation: "reaction", charges: 1, range: { special: "Kattal's reach" },
      affects: { count: "1", type: "creature" },
      ability: "str", associated: ["ath"],
      condition: "A Gargantuan creature tries to move through Kattal's reach",
      flavor: "<p>Contested by the creature's Athletics or Acrobatics. On a success its speed "
        + "becomes 0 for the remainder of the turn.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "utility", name: "Living Rampart",
      activation: "special", range: { feet: 5 },
      affects: { count: "1", type: "ally" },
      condition: "Kattal would provide half cover to an ally",
      flavor: "<p>Provide three-quarters cover instead. Until the beginning of his next turn, an "
        + "attack that misses that ally only because of this extra cover hits Kattal instead if it "
        + "would beat his AC.</p>"
    }),

    activity({
      owner, tier: "legendary", type: "utility", name: "I Said No",
      activation: "special", perRest: "short", range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "Kattal fails a Strength saving throw or Strength check",
      flavor: "<p>He succeeds instead. If the effect would move, crush, drag or physically "
        + "overwhelm him, he may also stop it moving through his space until the beginning of his "
        + "next turn.</p>"
    }),
    activity({
      owner, tier: "legendary", type: "utility", name: "The Last Wall",
      activation: "bonus", perRest: "long", range: { self: true },
      duration: { units: "minute", value: 1 },
      affects: { count: "1", type: "self" },
      flavor: "<p>For 1 minute Kattal gains resistance to all damage, a 10-foot aura granting "
        + "allies half cover, immunity to forced movement and to being knocked prone, and one "
        + "extra reaction each round usable only for Catch Them, Hold It!, Living Rampart or an "
        + "opportunity attack.</p><p><strong>His speed becomes 0.</strong> He may end it at the "
        + "beginning of any of his turns.</p>"
    })
  ]
};

export default legacyItem(definition);
