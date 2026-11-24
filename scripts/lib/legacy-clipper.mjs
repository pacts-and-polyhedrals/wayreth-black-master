import { MODE, activity, effect, legacyItem } from "./legacy.mjs";

const owner = "Clipper";

/**
 * The Wayfarer's Knot.
 *
 * Quieter than the rest, and deliberately so: nothing here asks Clipper to
 * perform. His legendary power is not killing something. It is knowing where his
 * people are.
 */
export const definition = {
  order: 5,
  name: "The Wayfarer's Knot",
  identifier: "wayfarers-knot",
  img: "icons/sundries/survival/rope-coiled-tan.webp",
  equipmentType: "wondrous",
  bearer: owner,
  chargeName: "Trail Charges",
  dc: "wis",
  dcLabel: "his Wisdom",
  recoveryPeriod: "dawn",
  weight: 1,

  subtitle: "Wondrous item, legacy item (requires attunement by Clipper)",
  lead: "A short length of road-rope tied in a knot nobody has managed to copy. It never frays, "
    + "and it pulls very slightly towards wherever he slept last.",
  quote: "Roads are not for leaving. They are the part of leaving that lets you come back.",
  origin: "Tied by somebody who expected him to return, and said so.",

  player: {
    summary: "None of the Knot is about killing anything. All of it is about people arriving, and "
      + "about Clipper being the reason they did.",
    tips: [
      "**Never Lost costs nothing and never switches off.** In any wilderness, underground or "
        + "unfamiliar scene, say out loud that he knows north and the way back to camp. It "
        + "changes what the party is willing to risk.",
      "**Get Them Through is the workhorse.** One bonus action and one charge frees an ally from "
        + "difficult terrain, halves the cost of standing up, and lets them leave a melee "
        + "safely.",
      "**Find the Missing needs something of theirs.** Collect a keepsake from each party member "
        + "now, while nobody is missing.",
      "**Waymarks are permanent and scarce.** There are only proficiency-bonus many. Spend them "
        + "on places worth returning to, not on wherever he happens to be standing.",
      "**There Is Always a Road is not teleportation**, so wards against teleporting do not stop "
        + "it \u2014 but it takes ten real minutes and nobody can touch the world on the way."
    ],
    rulings: [
      { q: "Does Follow Me move Clipper?",
        a: "No. He takes the Dash action himself; the others spend their reactions moving toward "
          + "him." },
      { q: "Can Sure Footing be used before 6th level?",
        a: "No. It ships switched off on the item, and the DM enables it when the Knot "
          + "awakens." },
      { q: "Does Find the Missing reach across planes?",
        a: "No. Same plane, five miles, direction only \u2014 no distance and no obstacles." },
      { q: "Can There Is Always a Road reach a Waymark he did not walk to?",
        a: "Any Waymark on the same plane within 100 miles, however it was made." },
      { q: "What happens if he makes one Waymark too many?",
        a: "One of his existing Waymarks is erased, and he chooses which." }
    ]
  },

  tiers: {
    dormant: {
      recovery: "all of them restored at dawn",
      blocks: [
        { h: "Never Lost", passive: true },
        "Clipper always knows north, and the direction and approximate distance to the place "
          + "where he most recently completed a long rest, provided it is on the same plane. He "
          + "has advantage on Survival checks to navigate and to follow tracks.",
        { h: "Rope Remembers" },
        "Clipper can touch the Knot to a location for 1 minute. For 24 hours he knows its "
          + "direction and approximate distance while on the same plane. Only one location can be "
          + "remembered at a time.",
        { h: "Get Them Through" },
        "As a bonus action, Clipper can expend 1 charge and choose himself or one creature within "
          + "30 feet. Until the end of its next turn, difficult terrain costs it no additional "
          + "movement, standing costs only 5 feet, and it does not provoke opportunity attacks "
          + "from one creature Clipper chooses."
      ]
    },

    awakened: {
      trigger: "Clipper willingly gives up progress toward an important objective to return for "
        + "someone or something that would otherwise be left behind.",
      recovery: "all of them restored at dawn",
      blocks: [
        { h: "Follow Me" },
        "When Clipper takes the Dash action, he can expend 1 charge. Up to a number of willing "
          + "creatures equal to his proficiency bonus, within 30 feet, can use their reactions to "
          + "move up to half their speeds toward Clipper without provoking opportunity attacks.",
        { h: "Find the Missing" },
        "Clipper can hold an object belonging to a creature, concentrate for 1 minute and expend "
          + "2 charges. For 1 hour he knows the general direction of that creature while it is "
          + "within 5 miles on the same plane. If it is dead, he senses its remains instead. This "
          + "does not reveal distance or obstacles.",
        { h: "Sure Footing", passive: "manual" },
        "Clipper gains a climbing speed equal to his walking speed. *This one passive is shipped "
          + "as a switched-off effect on the item — enable **Sure Footing** in the item's "
          + "Effects tab when the Knot awakens.*"
      ]
    },

    exalted: {
      trigger: "Clipper successfully guides others through a journey from which he personally has "
        + "compelling reason not to return.",
      recovery: "regaining 1d6 + 1 at dawn",
      blocks: [
        { h: "Waymarks" },
        "Clipper can establish a number of permanent Waymarks equal to his proficiency bonus. "
          + "Establishing one requires 10 minutes at the location. He always knows the direction "
          + "and approximate distance to every Waymark while on the same plane. Creating one "
          + "beyond his maximum erases one of his choice.",
        { h: "Walk My Road" },
        "As an action, Clipper can expend 3 charges and choose up to his proficiency bonus in "
          + "willing creatures within 30 feet. For 1 hour their walking speeds increase by 10 "
          + "feet, nonmagical difficult terrain costs them no extra movement, they have advantage "
          + "on checks and saves against environmental hazards caused by travel, and they cannot "
          + "become lost except through powerful magical interference.",
        { h: "I'm Coming Back" },
        "When a creature affected by Find the Missing is reduced to 0 hit points, Clipper "
          + "immediately knows. For the remaining duration his speed increases by 10 feet "
          + "whenever he moves directly toward that creature, and opportunity attacks against him "
          + "have disadvantage."
      ]
    },

    legendary: {
      trigger: "Clipper must choose between completing an extraordinary journey and returning for "
        + "someone who needs him — and chooses to return, knowing the opportunity may never "
        + "come again.",
      recovery: "regaining 1d8 + 1 at dawn",
      blocks: [
        { h: "There Is Always a Road" },
        "Once per long rest, Clipper can spend 1 minute holding the Knot and expend 5 charges. "
          + "Choose one of his Waymarks on the same plane within 100 miles. A shimmering trail "
          + "appears; Clipper and up to eight willing creatures who follow it travel through an "
          + "impossible shortcut and emerge at the Waymark after 10 minutes. This is not "
          + "teleportation for mechanical purposes — the travellers physically traverse a "
          + "supernatural road, and cannot interact with the outside world during the journey.",
        { h: "Nobody Gets Lost", passive: true },
        "All willing creatures within 30 feet of Clipper cannot become magically lost, know the "
          + "direction to Clipper, and have advantage on saving throws against magical effects "
          + "that would teleport or banish them against their will.",
        { h: "Bring Them Home" },
        "Once per long rest, Clipper can designate up to six willing creatures he can see. For 8 "
          + "hours he always knows their direction and approximate distance while they remain on "
          + "the same plane. If one becomes unconscious, dies, changes planes or is forcibly "
          + "teleported, Clipper knows immediately."
      ]
    }
  },

  effects: [
    effect({
      owner,
      name: "Sure Footing (Awakened — switch on at level 6)",
      img: "icons/sundries/survival/rope-coiled-tan.webp",
      description: "Climbing speed equal to Clipper's walking speed. Shipped disabled because a "
        + "movement effect cannot gate itself on level the way the charge pool does; enable it "
        + "when the Knot awakens.",
      changes: [{
        key: "system.attributes.movement.climb",
        mode: MODE.UPGRADE,
        value: "@attributes.movement.walk"
      }],
      disabled: true
    })
  ],

  activities: [
    activity({
      owner, tier: "dormant", type: "utility", name: "Rope Remembers",
      activation: "minute", activationValue: 1, range: { touch: true },
      duration: { units: "hour", value: 24 },
      affects: { count: "1", type: "space" },
      flavor: "<p>For 24 hours Clipper knows this location's direction and approximate distance "
        + "while on the same plane. Only one remembered location at a time.</p>"
    }),
    activity({
      owner, tier: "dormant", type: "utility", name: "Get Them Through",
      activation: "bonus", charges: 1, range: { feet: 30 },
      affects: { count: "1", type: "creature" },
      flavor: "<p>Until the end of its next turn, that creature ignores the extra cost of "
        + "difficult terrain, stands for 5 feet, and does not provoke opportunity attacks from "
        + "one creature Clipper names.</p>"
    }),

    activity({
      owner, tier: "awakened", type: "utility", name: "Follow Me",
      activation: "special", charges: 1, range: { feet: 30 },
      affects: { count: "@prof", type: "willing" },
      condition: "Clipper takes the Dash action",
      flavor: "<p>Each chosen creature may use its reaction to move up to half its speed toward "
        + "Clipper without provoking opportunity attacks.</p>"
    }),
    activity({
      owner, tier: "awakened", type: "utility", name: "Find the Missing",
      activation: "minute", activationValue: 1, charges: 2, range: { touch: true },
      duration: { units: "hour", value: 1, concentration: true },
      affects: { count: "1", type: "creature" },
      flavor: "<p>Holding an object belonging to the creature, Clipper learns its general "
        + "direction for 1 hour while it is within 5 miles on the same plane — or senses its "
        + "remains if it is dead. No distance, no obstacles.</p>"
    }),

    activity({
      owner, tier: "exalted", type: "utility", name: "Waymarks",
      activation: "minute", activationValue: 10, range: { touch: true },
      affects: { count: "1", type: "space" },
      flavor: "<p>Establish a permanent Waymark here. Clipper always knows the direction and "
        + "approximate distance to each of his Waymarks on the same plane, up to his proficiency "
        + "bonus; creating one past that erases a Waymark of his choice.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "utility", name: "Walk My Road",
      activation: "action", charges: 3, range: { feet: 30 },
      duration: { units: "hour", value: 1 },
      affects: { count: "@prof", type: "willing" },
      flavor: "<p>For 1 hour each chosen creature gains 10 feet of walking speed, ignores the "
        + "extra cost of nonmagical difficult terrain, has advantage on checks and saves against "
        + "travel hazards, and cannot become lost short of powerful magical interference.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "utility", name: "I'm Coming Back",
      activation: "special", range: { special: "any distance within 5 miles" },
      affects: { count: "1", type: "creature" },
      condition: "A creature affected by Find the Missing drops to 0 hit points",
      flavor: "<p>Clipper knows at once. For the rest of the duration his speed increases by 10 "
        + "feet whenever he moves directly toward that creature, and opportunity attacks against "
        + "him have disadvantage.</p>"
    }),

    activity({
      owner, tier: "legendary", type: "utility", name: "There Is Always a Road",
      activation: "minute", activationValue: 1, charges: 5, perRest: "long",
      range: { special: "a Waymark within 100 miles" },
      duration: { units: "minute", value: 10 },
      affects: { count: "9", type: "willing" },
      flavor: "<p>A shimmering trail opens to one of Clipper's Waymarks on the same plane within "
        + "100 miles. He and up to eight willing creatures emerge there after 10 minutes. Not "
        + "teleportation — they walk it, and cannot touch the outside world on the way.</p>"
    }),
    activity({
      owner, tier: "legendary", type: "utility", name: "Bring Them Home",
      activation: "action", perRest: "long", range: { special: "sight" },
      duration: { units: "hour", value: 8 },
      affects: { count: "6", type: "willing" },
      flavor: "<p>For 8 hours Clipper knows each designated creature's direction and approximate "
        + "distance on the same plane, and knows immediately if one falls unconscious, dies, "
        + "changes planes or is forcibly teleported.</p>"
    })
  ]
};

export default legacyItem(definition);
