import { activity, customPart, legacyItem, part } from "./legacy.mjs";

const owner = "Sylas";

/**
 * The Shepherd's Lantern.
 *
 * Knowledge at a price, and the price is always his. The Lantern is the one item
 * in the set that refills at dusk rather than dawn, and the one whose best
 * features cost hit points or Hit Dice rather than charges.
 */
export const definition = {
  order: 4,
  name: "The Shepherd's Lantern",
  identifier: "shepherds-lantern",
  img: "icons/sundries/lights/lantern-iron-yellow.webp",
  equipmentType: "wondrous",
  bearer: owner,
  chargeName: "Vigil Charges",
  dc: "spellcasting",
  dcLabel: "his spellcasting ability",
  recoveryPeriod: "dusk",
  weight: 2,

  subtitle: "Wondrous item, legacy item (requires attunement by Sylas)",
  lead: "An iron lantern whose flame gives almost no heat and throws the wrong shadows. It "
    + "brightens near the recently dead, which is a property nobody asked it to have.",
  quote: "Everyone else sees a cursed altar and says don't. He sees an experiment that hasn't "
    + "been run yet. The Lantern was made for the second kind of person.",
  origin: "Found lit, in a room that had been sealed for a very long time.",

  player: {
    summary: "Everything the Lantern gives Sylas, he pays for, usually in hit points, Hit Dice or "
      + "something he will regret knowing. It is the only item in the set that refills at dusk.",
    tips: [
      "**Charges return at dusk, not dawn.** A night's long rest refills nothing. His day starts "
        + "full and empties as it goes, so the hard question is always whether tonight is the "
        + "night.",
      "**Knowledge Has a Price gets worse as he gets better.** It is 1d6 per proficiency bonus "
        + "and it cannot be reduced or prevented \u2014 no resistance, no absorption, no "
        + "temporary hit points spared.",
      "**Hold the Door is the best two charges on the item** and the most dangerous. Read his "
        + "own hit points before offering, because the 2d8 cannot be mitigated either.",
      "**Hit Dice spent on knowledge stay spent.** Forbidden Inquiry and Let Me Understand cost "
        + "him hit points he will not be able to recover that night.",
      "**Autopsy of the Impossible before a boss is worth more than anything he can cast.** "
        + "Highest and lowest saving throw tells the entire party what to aim."
    ],
    rulings: [
      { q: "Does Not Yet come back on a rest?",
        a: "No. Seven days, tracked by hand \u2014 the item deliberately has no automatic "
          + "recovery on that one, so it cannot hand the use back early." },
      { q: "Can Take Their Burden move a condition he is immune to?",
        a: "He takes it on for its remaining duration; if he is immune it ends at once. He still "
          + "spends the charges, and the original target is still freed." },
      { q: "Can Hold the Door be used on himself?",
        a: "He is a creature within 30 feet of himself, so yes \u2014 but he then takes 2d8 he "
          + "cannot prevent, which may not leave him better off. Do the arithmetic first." },
      { q: "Does The Soul Waits bring anyone back?",
        a: "No. It protects a soul and a body for a minute and makes somebody else's "
          + "resurrection cheaper." },
      { q: "Does Mortuary Light cost a charge?",
        a: "No. Touching a corpse for a minute is free, and it is the feature he should be using "
          + "most often." }
    ]
  },

  tiers: {
    dormant: {
      recovery: "all of them restored at dusk",
      blocks: [
        { h: "Mortuary Light" },
        "By touching a corpse for 1 minute, Sylas learns its approximate time of death, whether "
          + "death primarily resulted from violence, disease, poison, magic or natural causes, "
          + "and whether necromancy affected it after death.",
        { h: "Shepherd's Questions" },
        "Sylas can expend 1 charge to gain advantage on one Arcana, Investigation, Medicine, "
          + "Nature or Religion check concerning a corpse, an undead creature, a curse, a planar "
          + "phenomenon, a supernatural disease or a ritual.",
        { h: "Knowledge Has a Price" },
        "After failing such a check, Sylas can take **1d6 necrotic damage per proficiency "
          + "bonus** to reroll it. This damage cannot be reduced or prevented. Once used, this "
          + "feature cannot be used again until he finishes a short or long rest."
      ]
    },

    awakened: {
      trigger: "Sylas knowingly accepts a meaningful personal consequence in exchange for "
        + "knowledge capable of protecting another person.",
      recovery: "all of them restored at dusk",
      blocks: [
        { h: "Ask the Dead" },
        "Sylas can expend 3 charges to cast *speak with dead*.",
        { h: "Hold the Door", act: ["Hold the Door", "Hold the Door \u2014 The Price"] },
        "When a creature within 30 feet would drop to 0 hit points, Sylas can use his reaction "
          + "and expend 2 charges. It instead drops to 1. Sylas takes **2d8 necrotic damage** "
          + "that cannot be reduced or prevented.",
        { h: "Forbidden Inquiry" },
        "Once per long rest, Sylas can spend one Hit Die while examining a creature, corpse, "
          + "object or supernatural phenomenon for 1 minute. He may ask the DM one factual "
          + "question concerning its nature, origin, condition, vulnerabilities or magical "
          + "properties. The answer must be truthful but need not reveal information that no "
          + "available divinatory magic could reasonably determine. The Hit Die remains spent "
          + "normally."
      ]
    },

    exalted: {
      trigger: "Sylas encounters something that fundamentally challenges his understanding of "
        + "death or cosmic order and chooses understanding over denial without surrendering his "
        + "principles.",
      recovery: "regaining 1d6 + 1 at dusk",
      blocks: [
        { h: "Take Their Burden" },
        "As an action, Sylas can touch a willing creature and expend 3 charges to transfer one "
          + "of the following from it to himself: blinded, charmed, deafened, frightened, "
          + "poisoned, one disease, or one curse affecting only that creature. The original "
          + "target is freed. Sylas receives the condition, disease or curse for its remaining "
          + "duration and receives no saving throw against the initial transfer. If the effect "
          + "requires ongoing saves, Sylas makes them normally.",
        { h: "The Soul Waits" },
        "When a creature dies within 30 feet, Sylas can use his reaction and expend 3 charges. "
          + "For 1 minute its soul cannot be unwillingly transformed, trapped or consumed, its "
          + "corpse cannot become undead, and resurrection magic cast upon it requires no "
          + "material component worth 300 gp or less. This does not resurrect the creature.",
        { h: "Autopsy of the Impossible" },
        "After observing a creature for 1 minute, Sylas may expend 2 charges to learn **two** "
          + "of the following:",
        {
          list: [
            "damage immunities;",
            "damage resistances;",
            "damage vulnerabilities;",
            "condition immunities;",
            "highest saving throw;",
            "lowest saving throw;",
            "whether it has Legendary Resistance;",
            "creature type;",
            "one special trait chosen by the DM that materially defines the creature."
          ]
        },
        "A creature cannot be examined this way again until Sylas finishes a long rest."
      ]
    },

    legendary: {
      trigger: "Sylas is given the opportunity to violate the natural boundary of death for "
        + "something he desperately wants, and consciously defines where **his** line lies.",
      recovery: "regaining 1d8 + 1 at dusk",
      blocks: [
        { h: "Shepherd Between Worlds", passive: true },
        "Sylas constantly sees 30 feet into the Ethereal Plane, and can perceive invisible "
          + "undead within 30 feet even if he cannot otherwise see invisible creatures.",
        { h: "Not Yet" },
        "When a creature within 60 feet dies, Sylas can use his reaction and expend 5 charges. "
          + "Its body falls dead normally, but its soul remains beside him as a visible spectral "
          + "presence until the end of his next turn. Before then, Sylas may use an action to "
          + "return the soul. The creature returns to life with 1 hit point, 2 levels of "
          + "exhaustion, and no benefit from healing until the end of its next turn. Once Sylas "
          + "successfully restores a creature this way, he cannot use Not Yet again until **7 "
          + "days have passed**. This cannot restore a creature that died of old age or whose "
          + "soul is unwilling or unavailable.",
        { h: "Let Me Understand" },
        "Once per long rest, Sylas can spend **3 Hit Dice** and spend 1 minute studying a "
          + "creature, artifact, corpse, curse or supernatural phenomenon. The DM must reveal "
          + "**three materially useful truths** concerning it. At least one must concern a "
          + "weakness, limitation, cost, method of destruction, method of cure or means by which "
          + "it can be opposed, if such information exists. Sylas' ultimate weapon is not death. "
          + "It is knowing what everyone else was afraid to examine."
      ]
    }
  },

  activities: [
    activity({
      owner, tier: "dormant", type: "utility", name: "Mortuary Light",
      activation: "minute", activationValue: 1, range: { touch: true },
      affects: { count: "1", type: "creature" },
      flavor: "<p>Learn the corpse's approximate time of death, whether it died primarily by "
        + "violence, disease, poison, magic or natural causes, and whether necromancy touched it "
        + "afterwards.</p>"
    }),
    activity({
      owner, tier: "dormant", type: "utility", name: "Shepherd's Questions",
      activation: "special", charges: 1, range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "An Arcana, Investigation, Medicine, Nature or Religion check about a corpse, "
        + "undead, curse, planar phenomenon, supernatural disease or ritual",
      flavor: "<p>Advantage on that check.</p>"
    }),
    activity({
      owner, tier: "dormant", type: "damage", name: "Knowledge Has a Price",
      activation: "special", perRest: "short", range: { self: true },
      affects: { count: "1", type: "self" },
      // 1d6 per proficiency bonus. A parenthetical dice count is dnd5e's own
      // idiom — `(@abilities.wis.mod)d8` ships in the SRD packs.
      damage: [customPart("(@prof)d6", ["necrotic"])],
      condition: "Sylas fails a Shepherd's Questions check",
      flavor: "<p>Reroll the failed check. This necrotic damage cannot be reduced or "
        + "prevented.</p>"
    }),

    activity({
      owner, tier: "awakened", type: "utility", name: "Ask the Dead",
      activation: "action", charges: 3, range: { feet: 10 },
      duration: { units: "minute", value: 10 },
      affects: { count: "1", type: "creature" },
      flavor: "<p>Cast <em>speak with dead</em>.</p>"
    }),
    activity({
      owner, tier: "awakened", type: "utility", name: "Hold the Door",
      activation: "reaction", charges: 2, range: { feet: 30 },
      affects: { count: "1", type: "creature" },
      condition: "A creature within 30 feet would drop to 0 hit points",
      flavor: "<p>It drops to 1 instead. Sylas takes 2d8 necrotic damage that cannot be reduced "
        + "or prevented.</p>"
    }),
    activity({
      owner, tier: "awakened", type: "damage", name: "Hold the Door — The Price",
      activation: "special", range: { self: true },
      affects: { count: "1", type: "self" },
      damage: [part(2, 8, ["necrotic"])],
      flavor: "<p>This damage cannot be reduced or prevented.</p>"
    }),
    activity({
      owner, tier: "awakened", type: "utility", name: "Forbidden Inquiry",
      activation: "minute", activationValue: 1, perRest: "long",
      range: { touch: true }, affects: { count: "1", type: "creatureOrObject" },
      consumes: [{ type: "hitDice", value: 1, target: "smallest" }],
      flavor: "<p>Ask the DM one factual question about the subject's nature, origin, condition, "
        + "vulnerabilities or magical properties. The answer must be truthful, though it need "
        + "not exceed what divinatory magic could reach.</p>"
    }),

    activity({
      owner, tier: "exalted", type: "utility", name: "Take Their Burden",
      activation: "action", charges: 3, range: { touch: true },
      affects: { count: "1", type: "willing" },
      flavor: "<p>Transfer one of blinded, charmed, deafened, frightened, poisoned, one disease "
        + "or one curse affecting only that creature onto Sylas for its remaining duration. He "
        + "gets no save against the transfer, and makes any ongoing saves normally.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "utility", name: "The Soul Waits",
      activation: "reaction", charges: 3, range: { feet: 30 },
      duration: { units: "minute", value: 1 },
      affects: { count: "1", type: "creature" },
      condition: "A creature dies within 30 feet",
      flavor: "<p>For 1 minute its soul cannot be transformed, trapped or consumed against its "
        + "will, its corpse cannot be raised as undead, and resurrection magic on it needs no "
        + "material component worth 300 gp or less. It is not resurrected.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "utility", name: "Autopsy of the Impossible",
      activation: "minute", activationValue: 1, charges: 2, range: { special: "sight" },
      affects: { count: "1", type: "creature" },
      flavor: "<p>Learn two of: damage immunities, resistances or vulnerabilities; condition "
        + "immunities; highest or lowest saving throw; whether it has Legendary Resistance; "
        + "creature type; or one defining trait the DM chooses.</p><p><em>One creature per long "
        + "rest.</em></p>"
    }),

    activity({
      owner, tier: "legendary", type: "utility", name: "Not Yet",
      activation: "reaction", charges: 5, perRest: "manual", range: { feet: 60 },
      affects: { count: "1", type: "creature" },
      condition: "A creature within 60 feet dies",
      flavor: "<p>Its soul stays beside Sylas until the end of his next turn; he may use an "
        + "action to return it. The creature revives with 1 hit point, 2 levels of exhaustion "
        + "and no benefit from healing until the end of its next turn.</p><p><strong>This use "
        + "does not come back on a rest.</strong> Once a creature has actually been restored, "
        + "clear it by hand after 7 days. It cannot restore anyone who died of old age, or whose "
        + "soul is unwilling or unavailable.</p>"
    }),
    activity({
      owner, tier: "legendary", type: "utility", name: "Let Me Understand",
      activation: "minute", activationValue: 1, perRest: "long",
      range: { special: "sight" }, affects: { count: "1", type: "creatureOrObject" },
      consumes: [{ type: "hitDice", value: 3, target: "smallest" }],
      flavor: "<p>The DM reveals three materially useful truths about the subject. At least one "
        + "must concern a weakness, limitation, cost, method of destruction, method of cure or "
        + "means of opposing it, if such a thing exists.</p>"
    })
  ]
};

export default legacyItem(definition);
