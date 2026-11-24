import { activity, legacyItem, part } from "./legacy.mjs";

const owner = "Jinx";

/**
 * The Coin That Lands Sideways.
 *
 * The dangerous one. Every tier gives Jinx a better reason to push a success he
 * has already earned, and the psychic bill is a real activity rather than a line
 * of text, so the table sees what pushing costs.
 */
export const definition = {
  order: 3,
  name: "The Coin That Lands Sideways",
  identifier: "coin-that-lands-sideways",
  img: "icons/commodities/currency/coin-embossed-unicorn-silver.webp",
  equipmentType: "wondrous",
  bearer: owner,
  chargeName: "Luck Charges",
  dc: "spellcasting",
  dcLabel: "his spellcasting ability",
  recoveryPeriod: "dawn",
  weight: 0,

  subtitle: "Wondrous item, legacy item (requires attunement by Jinx)",
  lead: "A steel coin with no face and no crown, worn smooth on both sides. Flipped, it lands "
    + "on its edge often enough that Jinx has stopped finding it funny and started finding it "
    + "useful.",
  quote: "Every coin has two answers. This one has been holding a third in reserve.",
  origin: "Won, allegedly fairly, from somebody who was very keen to be rid of it.",

  player: {
    summary: "Every tier of the Coin asks the same question in a louder voice: you have already "
      + "succeeded, so are you going to push it again? The item is generous to Jinx and "
      + "completely honest about the bill.",
    tips: [
      "**Spend Double or Nothing on failed saves before failed attacks.** A missed attack costs "
        + "one attack. A failed save often costs the fight.",
      "**Push Your Luck is a second, separate decision.** Half the time (1\u20133) it holds the "
        + "success and hurts him, and the psychic damage ignores resistance, so nothing he owns "
        + "reduces it.",
      "**All In replaces the one-charge spend.** Two charges total, not three.",
      "**I Meant To Do That is insurance against being Jinx.** Hold it for the trap he did not "
        + "mean to set off rather than spending it on a fight.",
      "**The Impossible Bet is a genuine loan.** Call it when the roll in front of him matters "
        + "more than any roll he will make before his next long rest."
    ],
    rulings: [
      { q: "Can Push Your Luck follow All In?",
        a: "Yes. Push Your Luck triggers when Double or Nothing turns a failure into a success, "
          + "and All In is a way of spending Double or Nothing." },
      { q: "When does a refunded charge come back?",
        a: "Immediately, on a 4\u20135. He can spend it again the same turn." },
      { q: "Can That's Not How That Spell Works change damage to necrotic or radiant?",
        a: "No. Acid, cold, fire, lightning and thunder only, and only into one another." },
      { q: "What happens if the DM never uses the Debt Die?",
        a: "It expires at his next long rest, and so does the debt." },
      { q: "Why would he ever turn a natural 20 into a 1?",
        a: "Because a critical success is not always the outcome he wants. That is the whole "
          + "reason the feature is written both ways." }
    ]
  },

  tiers: {
    dormant: {
      recovery: "all of them returning at dawn",
      blocks: [
        { h: "Double or Nothing" },
        "After Jinx fails an attack roll, ability check or saving throw, he may expend 1 charge "
          + "and roll 1d6. On a **1–2** the original roll stands. On a **3–6** he "
          + "rerolls the d20 and adds 1d4. He must use the new result.",
        { h: "Liar's Coin" },
        "Jinx learns *minor illusion*. Once per short or long rest, when making a Deception, "
          + "Performance or Sleight of Hand check, he may treat a d20 result of **9 or lower as "
          + "10**.",
        { h: "Surely Magic Is Relevant" },
        "Jinx can expend 1 charge before making an ability check to use Intelligence in place of "
          + "its normal ability. He must provide some remotely plausible magical explanation."
      ]
    },

    awakened: {
      trigger: "Jinx has a genuine opportunity to escape serious danger and deliberately stays "
        + "because something or someone matters more.",
      recovery: "all of them returning at dawn",
      blocks: [
        { h: "Push Your Luck", act: ["Push Your Luck", "Push Your Luck \u2014 The Bill"] },
        "After Double or Nothing turns a failure into a success, Jinx may Push. Roll 1d6:",
        {
          list: [
            "**1–3:** the success remains, but Jinx takes 2d6 psychic damage;",
            "**4–5:** the success remains and the Luck Charge is refunded;",
            "**6:** the success becomes extraordinary — an attack becomes a critical hit, "
              + "and an ability check or saving throw is treated as though the d20 rolled 20."
          ]
        },
        "The psychic damage ignores resistance.",
        { h: "That's Not How That Spell Works" },
        "Once per long rest when casting a spell, Jinx may choose one:",
        {
          list: [
            "change acid, cold, fire, lightning or thunder damage into another type on that list;",
            "double the spell's range, to a maximum of 300 feet;",
            "remove its verbal component;",
            "remove its somatic component."
          ]
        }
      ]
    },

    exalted: {
      trigger: "Jinx knowingly takes a dangerous magical risk for something more important than "
        + "proving that he can.",
      recovery: "regaining 1d6 + 1 at dawn",
      blocks: [
        { h: "That's DEFINITELY Not How That Spell Works" },
        "That's Not How That Spell Works can now be used a number of times per long rest equal "
          + "to Jinx's proficiency bonus, but only once per spell. It also gains:",
        {
          list: [
            "**Bend.** If a spell affects a line, cone, cube or sphere, Jinx can exclude a "
              + "number of creatures equal to his Intelligence modifier, minimum one.",
            "**Stretch.** A spell with a duration of 1 minute or longer and no concentration "
              + "requirement has its duration doubled, to a maximum of 24 hours."
          ]
        },
        "This replaces the Awakened version.",
        { h: "All In", act: ["All In", "All In \u2014 The Bill"] },
        "When Jinx uses Double or Nothing, he may spend **2 charges instead of 1**. He "
          + "immediately rerolls the d20 with advantage and adds 1d4. If both advantage dice "
          + "would fail the original DC or AC, Jinx suffers 3d6 psychic damage and cannot use "
          + "Double or Nothing again until the end of his next turn.",
        { h: "I Meant To Do That" },
        "Once per short or long rest, after Jinx triggers a trap, activates an unknown magical "
          + "effect or causes an unintended magical consequence, he may gain resistance to all "
          + "damage caused by that **initial triggering effect** and advantage on its first "
          + "saving throw. The accident still happens. Jinx is simply astonishingly good at "
          + "surviving Jinx."
      ]
    },

    legendary: {
      trigger: "Jinx reaches a moment where chance, magic and bravado could give him "
        + "extraordinary personal power, and deliberately gambles it for somebody else.",
      recovery: "regaining 1d8 + 1 at dawn",
      blocks: [
        { h: "The Impossible Bet" },
        "Once per long rest, before rolling a d20, Jinx can announce an Impossible Bet, naming "
          + "the specific action and intended outcome. Roll **two d20s**. Jinx chooses one; the "
          + "other becomes a **Debt Die**. Before Jinx's next long rest the DM may replace one "
          + "d20 Jinx rolls with the Debt Die, after Jinx rolls but before the outcome is "
          + "determined. If the unused Debt Die was a natural 20, the DM cannot use it and the "
          + "debt disappears. Jinx literally borrows luck from his future.",
        { h: "Rewrite the Rules" },
        "Once per long rest, when Jinx casts a spell of 5th level or lower, he can apply **two "
          + "different** That's Not How That Spell Works modifications to it.",
        { h: "The Coin Lands Sideways" },
        "Once per long rest, when Jinx rolls a natural 1 or a natural 20, he can flip the "
          + "result: **1 becomes 20**, or **20 becomes 1**. Why would he voluntarily turn a 20 "
          + "into a 1? Because there will eventually be a reason."
      ]
    }
  },

  activities: [
    activity({
      owner, tier: "dormant", type: "utility", name: "Double or Nothing",
      activation: "special", charges: 1, range: { self: true },
      affects: { count: "1", type: "self" }, formula: "1d6", rollPrompt: true,
      condition: "Jinx fails an attack roll, ability check or saving throw",
      flavor: "<p><strong>1–2:</strong> the original roll stands.</p>"
        + "<p><strong>3–6:</strong> reroll the d20 and add 1d4. The new result must be "
        + "used.</p>"
    }),
    activity({
      owner, tier: "dormant", type: "utility", name: "Liar's Coin",
      activation: "special", perRest: "short", range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "Jinx makes a Deception, Performance or Sleight of Hand check",
      flavor: "<p>Treat a d20 result of 9 or lower as a 10.</p>"
    }),
    activity({
      owner, tier: "dormant", type: "utility", name: "Surely Magic Is Relevant",
      activation: "special", charges: 1, range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "Before Jinx makes an ability check",
      flavor: "<p>Use Intelligence in place of the check's normal ability. A remotely plausible "
        + "magical explanation is required.</p>"
    }),

    activity({
      owner, tier: "awakened", type: "utility", name: "Push Your Luck",
      activation: "special", range: { self: true },
      affects: { count: "1", type: "self" }, formula: "1d6", rollPrompt: true,
      condition: "Double or Nothing has just turned a failure into a success",
      flavor: "<p><strong>1–3:</strong> the success remains; Jinx takes 2d6 psychic damage "
        + "that ignores resistance.</p>"
        + "<p><strong>4–5:</strong> the success remains and the Luck Charge is "
        + "refunded.</p>"
        + "<p><strong>6:</strong> an attack becomes a critical hit; a check or save counts as a "
        + "natural 20.</p>"
    }),
    activity({
      owner, tier: "awakened", type: "damage", name: "Push Your Luck — The Bill",
      activation: "special", range: { self: true },
      affects: { count: "1", type: "self" },
      damage: [part(2, 6, ["psychic"])],
      condition: "Push Your Luck rolled a 1–3",
      flavor: "<p>This psychic damage ignores resistance.</p>"
    }),
    activity({
      owner, tier: "awakened", until: "exalted", type: "utility",
      name: "That's Not How That Spell Works",
      activation: "special", perRest: "long", range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "Jinx casts a spell",
      flavor: "<p>Choose one: change acid, cold, fire, lightning or thunder damage into another "
        + "type on that list; double the range to a maximum of 300 feet; remove the verbal "
        + "component; or remove the somatic component.</p>"
    }),

    activity({
      owner, tier: "exalted", type: "utility",
      name: "That's DEFINITELY Not How That Spell Works",
      activation: "special", perRest: "long", perRestUses: "@prof", range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "Jinx casts a spell he has not already bent this rest",
      flavor: "<p>Choose one: change acid, cold, fire, lightning or thunder damage into another "
        + "type on that list; double the range to a maximum of 300 feet; remove the verbal "
        + "component; remove the somatic component; <strong>Bend</strong> — exclude "
        + "creatures up to his Intelligence modifier (minimum one) from a line, cone, cube or "
        + "sphere; or <strong>Stretch</strong> — double a non-concentration duration of 1 "
        + "minute or more, to a maximum of 24 hours.</p><p><em>Once per spell.</em></p>"
    }),
    activity({
      owner, tier: "exalted", type: "utility", name: "All In",
      activation: "special", charges: 2, range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "Instead of spending 1 charge on Double or Nothing",
      flavor: "<p>Reroll the d20 with advantage and add 1d4. If both advantage dice would fail "
        + "the original DC or AC, Jinx suffers 3d6 psychic damage and cannot use Double or "
        + "Nothing again until the end of his next turn.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "damage", name: "All In — The Bill",
      activation: "special", range: { self: true },
      affects: { count: "1", type: "self" },
      damage: [part(3, 6, ["psychic"])],
      condition: "Both All In advantage dice failed",
      flavor: "<p>Jinx also cannot use Double or Nothing again until the end of his next "
        + "turn.</p>"
    }),
    activity({
      owner, tier: "exalted", type: "utility", name: "I Meant To Do That",
      activation: "special", perRest: "short", range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "Jinx triggers a trap, activates an unknown magical effect or causes an "
        + "unintended magical consequence",
      flavor: "<p>Resistance to all damage from that initial triggering effect, and advantage "
        + "on its first saving throw. The accident still happens.</p>"
    }),

    activity({
      owner, tier: "legendary", type: "utility", name: "The Impossible Bet",
      activation: "special", perRest: "long", range: { self: true },
      affects: { count: "1", type: "self" }, formula: "2d20", rollPrompt: true,
      condition: "Before Jinx rolls a d20, having named the action and intended outcome",
      flavor: "<p>Jinx keeps one die. The other becomes a <strong>Debt Die</strong> the DM may "
        + "substitute for one of his d20s before his next long rest, after the roll but before "
        + "the outcome. A natural 20 left unused cancels the debt.</p>"
    }),
    activity({
      owner, tier: "legendary", type: "utility", name: "Rewrite the Rules",
      activation: "special", perRest: "long", range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "Jinx casts a spell of 5th level or lower",
      flavor: "<p>Apply two different That's Not How That Spell Works modifications to that "
        + "spell.</p>"
    }),
    activity({
      owner, tier: "legendary", type: "utility", name: "The Coin Lands Sideways",
      activation: "special", perRest: "long", range: { self: true },
      affects: { count: "1", type: "self" },
      condition: "Jinx rolls a natural 1 or a natural 20",
      flavor: "<p>Flip it. <strong>1 becomes 20</strong>, or <strong>20 becomes 1</strong>.</p>"
    })
  ]
};

export default legacyItem(definition);
