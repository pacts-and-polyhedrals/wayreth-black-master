# Wayreth: The Black Master — 1.16.0

## Docked calendars no longer resize

The width of a docked widget is set by the player list, so the grip is gone in that mode and
docked always renders 1:1. Floating mode is unchanged — drag the corner as before.

This removed a chunk of code rather than adding any: the layout compensation written in 1.14.0
existed only to stop a scaled docked widget overlapping the sidebar, and is now unnecessary.

## Toril and Oerth calendars

**Calendar System** in module settings now switches the whole date engine, not just month names.

| System | Year | Week | Moons |
|---|---|---|---|
| Krynn (Solamnic / Ergothi / Elven) | 336 days — twelve 28-day months | 7 days | Solinari 36 · Lunitari 28 · Nuitari 8 |
| Toril — Calendar of Harptos | 365 days — twelve 30-day months + 5 festival days | 10-day tenday | Selûne, 30 days |
| Oerth — Greyhawk Common Year | 364 days — twelve 28-day months + four 7-day festivals | 7 days | Luna 28 · Celene 91 |

Festival days are modelled as short months, so Harptos's Midwinter (1 day) and Greyhawk's
Needfest (7 days) appear in the month picker and round-trip correctly. Year suffix follows the
world: AC, DR or CY.

**Sanction stays Krynn-only.** On Toril and Oerth the rings still mark full and new moons but
are labelled Full and New, and the sanction mechanics do not apply. Moon offset settings affect
only the Krynn moons; Selûne, Luna and Celene are pre-set to canonical positions.

**Alignments.** Krynn keeps the Night of the Eye every 504 days. Oerth gains the conjunction of
Luna and Celene on Richfest 4 — once every 364 days, so once a year. Toril has one moon and
therefore no alignment, and the banner and chat announcement are disabled there.

The alignment interval is now computed as the lowest common multiple of the moon periods rather
than hardcoded, so it is correct for any calendar.

## Verified against canon

Every Greyhawk moon date in the sources checks out in the implementation: Celene full on
Needfest 4, Luna new the same day, Luna full on Fireseek 11, Celene full on the fourth day of
each festival week, and both moons full together on Richfest 4. Dates round-trip correctly for
every day of all five calendars.

## Validator

Sixteen assertions added. Two 1.14.0 guards were removed as obsolete — they required the docked
scale-compensation code that this release deletes.
