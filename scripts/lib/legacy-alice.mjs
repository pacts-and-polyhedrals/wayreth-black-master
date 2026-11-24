import { activity, customPart, legacyItem } from "./legacy.mjs";

const owner = "Alice";

/**
 * The Crown of Little Wonders.
 *
 * Alice's mechanical identity is creative problem-solving, so the Crown buys
 * reliability for improvisation rather than raw output. Nothing here scales her
 * attacks or spell DCs; it scales what she is allowed to try.
 */
export const definition = {
  order: 1,
  name: "The Crown of Little Wonders",
  identifier: "crown-of-little-wonders",
  img: "icons/equipment/head/crown-gold-blue.webp",
  equipmentType: "wondrous",
  bearer: owner,
  chargeName: "Wonder Charges",
  dc: "spellcasting",
  dcLabel: "her spellcasting ability",
  recoveryPeriod: "dawn",
  weight: 1,

  subtitle: "Wondrous item, legacy item (requires attunement by Alice)",
  lead: "A circlet of bent wire, ribbon and things that were probably never jewellery, "
    + "which somehow looks deliberate on her and ridiculous on everyone else. It is warm "
    + "when she is delighted and warmer when she is about to do something unwise.",
  quote: "It is not a crown because somebody crowned her. It is a crown because she "
    + "decided it was one, and the world has so far declined to argue.",
  quoteBy: "Marginal note, Wayreth Deep Catalogue",
  origin: "A gift kept long past the point where keeping it made sense.",

  player: {
    summary: "The Crown does not make Alice's spells hit harder. It makes \"what if I try this\" "
      + "into something the rules will actually let her do, and then keeps widening what counts "
      + "as a reasonable idea.",
    tips: [
      "**Oops works on anybody.** It is a reaction on any ability check made by Alice *or* a "
        + "creature she can see within 30 feet. One charge to rescue somebody else's failed "
        + "check is the cheapest good thing the Crown does.",
      "**Improvised Solution only burns its rest use when it works.** A failed improvisation "
        + "costs the charge and nothing else, so there is no reason not to try.",
      "**Hop is an escape, not a step.** It ignores opportunity attacks, so it pulls an ally out "
        + "of a bad square without spending their Disengage.",
      "**From 10th level the Crown stops refilling completely.** Two Rabbit Holes in a day is "
        + "four of seven charges. Past that point plan the day rather than the round.",
      "**Make-Believe is at its best structurally** \u2014 a ladder, a bridge section, a door, a "
        + "cage, a rowboat, a wheelbarrow. Reach for architecture before you reach for objects."
    ],
    rulings: [
      { q: "Can Make-Believe create a weapon?",
        a: "A mundane one under the value cap, yes \u2014 it is an ordinary nonmagical object. "
          + "Not a firearm, not a siege weapon, and never a magic item." },
      { q: "Does Rabbit Hole prevent the damage that triggered it?",
        a: "No. Explicitly not, even if the teleport carries her out of the effect's range." },
      { q: "Can Follow the Kender carry someone who does not want to go?",
        a: "No. Willing creatures only." },
      { q: "Does Happily Ever After save someone killed outright?",
        a: "No. It triggers on being reduced to 0 hit points. An effect that kills outright "
          + "never produces that moment to catch." },
      { q: "Which ability do the Crown's cantrips use?",
        a: "They count as sorcerer spells for her, so her sorcerer spellcasting ability." }
    ]
  },

  tiers: {
    dormant: {
      recovery: "all of them returning at dawn",
      blocks: [
        { h: "Borrowed Cantrips", passive: true },
        "Alice learns *druidcraft* and *minor illusion*. They count as sorcerer spells for "
          + "her and do not count against her cantrips known. If she already knows either, "
          + "she may replace that cantrip with another non-damaging bard, druid or sorcerer cantrip.",
        { h: "Pocketful of Nonsense" },
        "As a bonus action, expend 1 Wonder Charge to produce one effect:",
        {
          list: [
            "**Hop.** Alice or a willing creature within 30 feet moves up to 15 feet to an "
              + "unoccupied space Alice can see. This movement does not provoke opportunity "
              + "attacks but cannot pass through solid objects.",
            "**Fetch.** One unattended object Alice can see within 30 feet weighing no more "
              + "than 10 pounds flies into her hand. An object being worn, carried, secured "
              + "or magically anchored cannot be affected.",
            "**Distract.** One creature Alice can see within 30 feet has disadvantage on its "
              + "next opportunity attack or Wisdom (Perception) check before the start of "
              + "Alice's next turn."
          ]
        },
        { h: "Oops" },
        "When Alice or a creature she can see within 30 feet makes an ability check, Alice "
          + "can use her reaction and expend 1 charge to add 1d4 after seeing the roll but "
          + "before the outcome is declared.",
        { h: "Little Places", passive: true },
        "Alice can move through the space of any creature larger than herself, and squeezing "
          + "costs her no additional movement."
      ]
    },

    awakened: {
      trigger: "Alice openly acknowledges something genuinely important to her rather than "
        + "hiding it behind humour, bravado or performance, and then acts upon it.",
      recovery: "all of them returning at dawn",
      blocks: [
        { h: "Rabbit Hole" },
        "When Alice takes damage, she can use her reaction and expend 2 charges to teleport "
          + "up to 30 feet to an unoccupied space she can see. If this takes her outside the "
          + "triggering effect's range, it does **not** prevent the triggering damage. After "
          + "teleporting, Alice can become invisible until the beginning of her next turn or "
          + "until she attacks, deals damage or casts a spell.",
        { h: "Improvised Solution" },
        "When Alice attempts an unconventional but physically or magically plausible use of "
          + "an object, spell or environmental feature, she can expend 1 charge to gain "
          + "advantage on one associated ability check or spellcasting ability check. If the "
          + "improvised action instead immediately forces exactly one creature to make a "
          + "saving throw, Alice can impose disadvantage on that save. Once this feature "
          + "**succeeds**, it cannot be used again until she finishes a short or long rest.",
        { h: "That's Mine Now" },
        "Alice can expend 1 charge to cast *mage hand*, except that the hand can carry 30 "
          + "pounds, its range is 60 feet, and Alice can make it appear as any Tiny hand, "
          + "paw, claw or similarly shaped appendage. It lasts 10 minutes and requires no "
          + "concentration."
      ]
    },

    exalted: {
      trigger: "Alice deliberately risks something she values because another person's "
        + "happiness, safety or sense of wonder matters more to her than avoiding hurt herself.",
      recovery: "regaining 1d6 + 1 at dawn rather than all expended charges",
      blocks: [
        { h: "Make-Believe", act: "Make-Believe" },
        "As an action, Alice expends 3 charges and describes a mundane object she can see or "
          + "has personally encountered before. The created object appears in an unoccupied "
          + "space within 30 feet and lasts 10 minutes, functioning as a normal nonmagical "
          + "object of its type. It:",
        {
          list: [
            "must fit within a 10-foot cube;",
            "can weigh no more than 500 pounds;",
            "cannot have a market value above 100 gp;",
            "cannot contain poison, explosives, alchemical substances or other consumable compounds;",
            "cannot be a spell component with a listed monetary value;",
            "cannot be a firearm or siege weapon;",
            "cannot duplicate a magic item;",
            "cannot be a functioning complex mechanism requiring more than five independently "
              + "moving components."
          ]
        },
        "A created object cannot be sold and vanishes if broken into separate components. "
          + "A ladder, rowboat, door, table, bridge section, mattress, cage, giant umbrella, "
          + "wheelbarrow or ridiculous throne are all fair game.",
        { h: "It Was Worth a Try" },
        "Once per short or long rest, when Alice fails an ability check by 5 or less, she can "
          + "decide that the attempt succeeds instead — in the messiest reasonable way. "
          + "The DM may introduce a complication, but the complication cannot negate the "
          + "success. This is not usable on attack rolls or saving throws.",
        { h: "Follow the Kender" },
        "When Alice uses Rabbit Hole, she may expend 1 additional charge to take one willing "
          + "creature within 5 feet with her. Both creatures arrive in unoccupied spaces "
          + "within 5 feet of one another."
      ]
    },

    legendary: {
      trigger: "Alice willingly chooses genuine belonging despite knowing that loving people "
        + "gives the world something it can take from her.",
      recovery: "regaining 1d8 + 1 at dawn",
      blocks: [
        { h: "The World Is More Interesting This Way", act: "Make-Believe (The World Is More Interesting This Way)" },
        "Make-Believe improves: the maximum dimensions become a 20-foot cube, the maximum "
          + "weight becomes 2,000 pounds, the maximum mundane value becomes 500 gp, and the "
          + "duration becomes 1 hour. Alice can also create a simple structure composed of "
          + "connected mundane parts, such as a small cottage, bridge, stage, wagon or sailing "
          + "boat. It still cannot create valuable materials, creatures, food with magical "
          + "effects, siege weapons, spell components, magic items or advanced machinery.",
        { h: "You Can't Take This From Me" },
        "When Alice or a creature she can see within 30 feet fails a saving throw against "
          + "being charmed, frightened, possessed or magically controlled, Alice can use her "
          + "reaction and expend 3 charges. The creature rerolls the saving throw with "
          + "advantage. On a success, it also gains immunity to that specific creature's "
          + "charm, fear, possession and control effects until the next dawn.",
        { h: "Happily Ever After" },
        "Once per long rest, when Alice or an ally within 30 feet would be reduced to 0 hit "
          + "points, Alice can declare **\"That's not how this story ends.\"** The creature "
          + "instead drops to 1 hit point, immediately gains temporary hit points equal to "
          + "twice Alice's sorcerer level, and may use its reaction to move up to its speed "
          + "without provoking opportunity attacks. This is not resurrection. Alice cannot "
          + "stop death forever. She can occasionally insist that this is not the page where "
          + "it happens."
      ]
    }
  },

  activities: [
    activity({
      owner, tier: "dormant", type: "utility", name: "Pocketful of Nonsense",
      activation: "bonus", charges: 1, range: { feet: 30 },
      affects: { count: "1", type: "creature" },
      flavor: "<p><strong>Hop.</strong> Alice or a willing creature within 30 feet moves up "
        + "to 15 feet to an unoccupied space she can see, without provoking opportunity "
        + "attacks and not through solid objects.</p>"
        + "<p><strong>Fetch.</strong> One unattended object within 30 feet weighing 10 pounds "
        + "or less flies into her hand.</p>"
        + "<p><strong>Distract.</strong> One creature within 30 feet has disadvantage on its "
        + "next opportunity attack or Wisdom (Perception) check before the start of Alice's "
        + "next turn.</p>"
    }),
    activity({
      owner, tier: "dormant", type: "utility", name: "Oops",
      activation: "reaction", charges: 1, range: { feet: 30 }, formula: "1d4",
      affects: { count: "1", type: "creature" },
      condition: "Alice or a creature she can see within 30 feet makes an ability check",
      flavor: "<p>Add the rolled 1d4 to that ability check, after seeing the roll but before "
        + "the outcome is declared.</p>"
    }),

    activity({
      owner, tier: "awakened", type: "utility", name: "Rabbit Hole",
      activation: "reaction", charges: 2, range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "Alice takes damage",
      flavor: "<p>Teleport up to 30 feet to an unoccupied space Alice can see. This does not "
        + "prevent the triggering damage. She can then become invisible until the beginning "
        + "of her next turn, or until she attacks, deals damage or casts a spell.</p>"
    }),
    activity({
      owner, tier: "awakened", type: "utility", name: "Improvised Solution",
      activation: "special", charges: 1, perRest: "short",
      range: { self: true }, affects: { count: "1", type: "self" },
      condition: "Alice attempts an unconventional but plausible use of an object, spell or "
        + "environmental feature",
      flavor: "<p>Advantage on one associated ability check or spellcasting ability check. If "
        + "the improvised action instead forces exactly one creature to make a saving throw, "
        + "impose disadvantage on that save instead.</p><p><em>Spend this only once the "
        + "attempt has succeeded — a failed improvisation does not consume the rest "
        + "use.</em></p>"
    }),
    activity({
      owner, tier: "awakened", type: "utility", name: "That's Mine Now",
      activation: "action", charges: 1, range: { feet: 60 },
      duration: { units: "minute", value: 10 },
      affects: { count: "1", type: "self" },
      flavor: "<p><em>Mage hand</em> that carries 30 pounds at 60 feet, shaped as any Tiny "
        + "hand, paw or claw. Lasts 10 minutes and needs no concentration.</p>"
    }),

    activity({
      owner, tier: "exalted", until: "legendary", type: "utility", name: "Make-Believe",
      activation: "action", charges: 3, range: { feet: 30 },
      duration: { units: "minute", value: 10 },
      affects: { count: "1", type: "space" },
      flavor: "<p>Create a mundane object within 30 feet for 10 minutes: up to a 10-foot "
        + "cube, 500 pounds, 100 gp, no consumables, no costed spell components, no firearms "
        + "or siege weapons, no magic items, and no mechanism with more than five "
        + "independently moving parts.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "utility", name: "It Was Worth a Try",
      activation: "special", perRest: "short",
      range: { self: true }, affects: { count: "1", type: "self" },
      condition: "Alice fails an ability check by 5 or less",
      flavor: "<p>The attempt succeeds instead, in the messiest reasonable way. The DM may "
        + "add a complication, but not one that negates the success. Not usable on attack "
        + "rolls or saving throws.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "utility", name: "Follow the Kender",
      activation: "reaction", charges: 1, range: { feet: 5 },
      affects: { count: "1", type: "ally" },
      condition: "Alice uses Rabbit Hole",
      flavor: "<p>One willing creature within 5 feet travels with her. Both arrive in "
        + "unoccupied spaces within 5 feet of one another.</p>"
    }),

    activity({
      owner, tier: "legendary", type: "utility",
      name: "Make-Believe (The World Is More Interesting This Way)",
      activation: "action", charges: 3, range: { feet: 30 },
      duration: { units: "hour", value: 1 },
      affects: { count: "1", type: "space" },
      flavor: "<p>Create a mundane object or a simple structure of connected mundane parts "
        + "within 30 feet for 1 hour: up to a 20-foot cube, 2,000 pounds and 500 gp. Still no "
        + "valuable materials, creatures, magical food, siege weapons, costed spell "
        + "components, magic items or advanced machinery.</p>"
    }),
    activity({
      owner, tier: "legendary", type: "utility", name: "You Can't Take This From Me",
      activation: "reaction", charges: 3, range: { feet: 30 },
      affects: { count: "1", type: "creature" },
      condition: "Alice or a creature within 30 feet fails a save against being charmed, "
        + "frightened, possessed or magically controlled",
      flavor: "<p>The creature rerolls that saving throw with advantage. On a success it also "
        + "becomes immune to that specific creature's charm, fear, possession and control "
        + "effects until the next dawn.</p>"
    }),
    activity({
      owner, tier: "legendary", type: "heal", name: "Happily Ever After",
      activation: "reaction", perRest: "long", range: { feet: 30 },
      affects: { count: "1", type: "creature" },
      condition: "Alice or an ally within 30 feet would be reduced to 0 hit points",
      // Twice her sorcerer level, as the design specifies. A warning appears on
      // her sheet if she ever has no sorcerer levels, which is the signal to
      // retarget this at whichever class her legend ends up belonging to.
      healing: customPart("2 * @classes.sorcerer.levels", ["temphp"]),
      flavor: "<p><strong>\"That's not how this story ends.\"</strong></p><p>The creature "
        + "drops to 1 hit point instead, gains these temporary hit points, and may use its "
        + "reaction to move up to its speed without provoking opportunity attacks.</p>"
    })
  ]
};

export default legacyItem(definition);
