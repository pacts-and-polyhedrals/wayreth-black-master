# Wayreth: The Black Master — 1.18.0

## Overreaching: the Orders spend themselves

A Wizard of High Sorcery who has **passed the Test** may cast a spell as though using a slot up
to three levels higher, by paying their Order's Price. Renegades and apprentices cannot — this
is now the largest mechanical reward for taking the Test.

Declared before rolling. Paid immediately whether the spell works or not. Cannot be prevented,
reduced, redirected or negated by anything, including the caster's own magic. No daily limit —
the limit is what it costs.

| Order | Price | Cost per additional level |
|---|---|---|
| **White** | The Silver Toll | 2d10 force to yourself; hit point maximum reduced by the same until a long rest |
| **Red** | Lunitari's Ledger | Spell slots totalling twice the levels gained; any shortfall costs a level of exhaustion each |
| **Black** | Nuitari's Due | 3d10 necrotic — yours, **or** taken from a willing, restrained, or bound creature within 30 feet |

Each Price behaves like its Order. The White Robe can always overreach, even unconscious and
out of slots, which is why they die doing it. The Red Robe pays nothing personally while they
are rich in slots and becomes fragile once they are not. The Black Robe chooses whose it is.

**Nuitari's Due is tied to the Control tracker.** Every use on an unwilling creature raises
Raistlin Control by 1, whether or not he learns of it. Using it on yourself when a bound
prisoner was available lowers it. Adjust silently.

The costs are deliberately not worth paying for damage — overreaching a 5th-level slot to 8th
adds about 10 points to a *fireball* and costs a White Robe 33. It is worth it for a level that
changes what is possible: reaching a spell level you have no slot for, a *banishment* that
catches a tougher creature, a *counterspell* that must not fail, an upcast healing at the wrong
moment.

## Spell audit against 2014 baselines

Six spells were measurably under their equivalents and have been corrected.

| Spell | Was | Now | Compared against |
|---|---|---|---|
| Cinder Lash | 1d6 | **1d8** | *fire bolt* 1d10 with no rider |
| Grave Whisper | 1d6 | **1d8** | *sacred flame* 1d8 with no rider |
| Blackflame Dart | 2d8 | **3d8** | *chromatic orb* 3d8 |
| Umbral Burst | 3d6 | **3d8** | *shatter* 3d8 in the same radius |
| Black Moon Detonation | 6d6 | **9d6** | was weaker than a 3rd-level *fireball* in the same radius |
| Starless Lance | 8d6 | **10d6** | was identical to a 3rd-level *lightning bolt*, at 5th |

**Cleaning** was the clearest case and is rebuilt. It covered a 5-foot cube and did one thing,
against *prestidigitation*'s eight. It now cleanses a **20-foot cube** and offers six effects in
any combination: filth removal from surfaces, objects and willing creatures; drying and clearing
standing water; removing one stain, tarnish, rust or corrosion however old; suppressing or
replacing odour for an hour; purifying food and drink for ten; and laundering worn clothing.

Several spells I expected to be undertuned turned out not to be, once read properly. Mindspin at
4d8 looked weak for 7th level until the unconsciousness, the subjective-hour nightmare and the
rider menu are counted. Death's Due and the Mindspin pair are unchanged.

## Note

All six corrected spells had a stale damage figure in their `chatFlavor` as well as the
description and activity data. The validator's cross-check caught it; it now asserts that the
audited values agree everywhere in the document, not only in the description.
