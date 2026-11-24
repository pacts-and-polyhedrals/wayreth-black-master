# Wayreth: The Black Master — 1.20.0

## The bestiary more than doubles: 36 → 78 creatures

Built onto the existing `build-creatures.mjs` pipeline using the same `npc()` helper, so
everything remains a real dnd5e Actor with embedded weapon and feature items that roll from
the sheet.

**Unbroken CR ladder from 0 to 24.** The previous roster stopped at CR 17 with gaps at 13–15
and nothing above; a levels 1–20 campaign that ends in the Abyss cannot run on that.

### Dragons (16 new, 25 total)

Five chromatic wyrmlings (CR 2–4) for early arcs. Adult white, black and green (CR 13–15).
Ancient blue, red, silver and gold (CR 23–24). The missing metallics — brass, bronze and copper
young — plus adult silver.

Every dragon carries frightful presence, legendary actions and its full breath weapon set;
metallics get their second breath, which is the half most tables forget.

### Solamnia (8 new)

The user-requested Solanthus material and the defenders generally: Knights of the Crown, Sword
and Rose (CR 3/6/10), Solamnic foot soldiers, a Solanthus watch captain who is tired of people
with sealed letters from wizards, a High Clerist siege engineer, Palanthas city guard, and an
Aesthetic of the Great Library who will not raise a hand even in self-defence.

### The Abyss and the Nightmare (7 new)

Chained Tormentor, Abyssal Siegebreaker, Warden of the Palace of Chains (CR 15), Herald of the
Dark Queen (CR 18). Every bound entity has a true name, obeys the letter of an instruction and
never the intent, and remembers exactly how long it has been owned.

For Arc IV's Silvanesti expedition: Nightmare Tree, Dream of the Fallen — which wears a dead
person the party knew and reports as truthful under divination, because it is — and Lorac's
Remnant, which cannot be killed while the Nightmare persists.

### The Named (11 new)

Raistlin (CR 21), Fistandantilus (CR 20), Lord Soth (CR 22), Cyan Bloodbane (CR 19), Kitiara,
Par-Salian, Ladonna, Justarius, Dalamar, Skaith, and Astinus — statted, as his own entry says,
purely so you are not caught out. Most of these should never be fought; they exist so you know
what happens if the party tries.

## Notes

Your existing integrity check earned its keep twice: it caught the Herald of the Dark Queen
having "Claw" as both an action and a legendary action, which collided because item ids derive
from owner plus name.

It also surfaced a duplicate I introduced — "Nameless of the Field" against the existing
"Nameless One of the Field". Removed, and the validator now catches near-duplicates by
normalising names rather than comparing them exactly.

A page-count assertion had drifted so that it read `=== 312` while its own failure message said
313 — the result of an earlier blanket find-and-replace. The expected value is now a named
constant used by both, so the check and the message cannot disagree again.
