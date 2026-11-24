# Wayreth: The Black Master — 1.20.1

## Fixed: the bestiary was always empty

The compendium was created, registered and locked correctly — and then never filled. The fill
threw, the error went to the console inside a `try/catch`, and nothing told the GM. An empty
pack and a failed pack look identical.

**Cause: three enum values dnd5e rejects.**

| Field | Shipped | dnd5e expects |
|---|---|---|
| `traits.size` | `"lrg"` (10 creatures) | `"lg"` |
| `traits.size` | `"gargantuan"` (5 creatures) | `"grg"` |
| `traits.languages.value` | `"solamnic"` (14 creatures) | not a language key |

Any invalid enum fails document validation, and because the roster is created in a single
`createDocuments` batch, **one bad value empties the entire compendium.** Fifteen creatures with
a wrong size string took all 78 down with them.

This predates the 1.20.0 expansion — `Black Dragon, Young` and `Commander Veyrath` are from the
original roster, so the bestiary has never populated in any release.

Solamnic is preserved: it now sits in `langCustom`, which is the field dnd5e provides for
setting languages outside its list. It still displays on the sheet, on 31 creatures.

## Fixed: the failure was invisible

Creature and feat compendium sync failures now raise a `ui.notifications.error` naming the
problem, not just a console line. The install summary also reports the actual creature count
rather than asserting "4 compendia refreshed" regardless of what happened.

## Validator

Every enum field on every creature is now checked against dnd5e's own key sets — size, creature
type, languages, skills, the three damage-type lists, and condition immunities. There is also a
guard that a failed sync must notify the GM rather than only logging.

All five were confirmed by reintroducing their bug: a single `"lrg"`, a single `"gargantuan"`,
a single `"solamnic"`, a spelled-out skill key, and a downgraded error message each produce
exactly one validator failure.
