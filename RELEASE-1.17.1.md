# Wayreth: The Black Master — 1.17.1

## Fixed: the tracker board was unreadable

The board's stylesheet assumed a 320px panel, but docking forces it to 100% of the player-list
column — around 200px — and it then split that into two columns. Each of the six cards had
roughly 99px to hold a label, a value, two buttons, a 5px-tall range slider and a status line,
at 0.5–0.58rem type. Hence the thin unreadable strip.

**Rebuilt as one row per tracker.** Each row now carries:

- a **colour stripe** in that tracker's own accent — gold for Trust, crimson for Control,
  violet for Fistandantilus, silver for the White Robe Bond, teal for the Wayreth Accord,
  ember for the War State
- a **symbol** — handshake, chain, hourglass, dove, tower, shield
- the **name**, at 0.7rem rather than 0.58rem
- a **named band** rather than a bare number: Instrument, Dominion, Ascendant, Heeded,
  Complicit, Fortified, and so on
- a **meter** coloured by where the value sits, not by which tracker it is — green for good,
  stone for neutral, amber for warning, crimson for bad
- the **value** at 0.86rem with ▲ / ▼ nudges above and below it

Colour therefore does two independent jobs: the stripe says *which* tracker, the meter and
numeral say *how it is going*. Either alone is enough to read the row.

The range sliders are gone. They were unusable at that width and the ▲/▼ buttons are more
precise anyway — plain click ±1, shift ±2, alt ±3, as before.

**Collapsed view** is now a chip per tracker — accent stripe, symbol and value — instead of a
plain text run, so a glance still tells you where everything stands.

## Also fixed

A `@container (max-width: 215px)` rule had been written with no ancestor declaring
`container-type`, so it would never have matched. Removed; the band label fits at docked width
and ellipsises if a theme narrows the column.

## Validator

Fourteen assertions added, covering the row layout, all six accent colours, symbols and band
tables, the four tone colours, the accent stripe, the collapsed chips, and guards against the
card grid, the sliders and container queries returning.

One of them initially failed to catch its own bug: the count of `accent:` was also matching
`--wy-accent:` in the render template, so a missing definition still passed. The three
definition guards now match their declaration form specifically, and each was confirmed by
deleting a single tracker's entry.
