# Wayreth: The Black Master — 1.12.0

## Added

**Time of day, in the same bar.** The calendar now shows a clock beside the date, with the
period of day beneath it — Dawn, Morning, Midday, Afternoon, Dusk, Night, Deep night. One
bar carries date, time and all three moon phases; no second widget needed.

GM controls, all on the clock itself:

- **Drag sideways** to scrub. The display tracks your pointer and writes once on release.
- **Scroll** over it to nudge ten minutes.
- **Double-click** to jump to midday.
- The cog panel gains an hour/minute field, Dawn / Noon / Dusk / Midnight presets, and
  ±1m / 10m / 1h / 8h steps.

Crossing midnight rolls the date in either direction, including multi-day jumps.

**Per-scene darkness syncing.** Scene Config gains a *Link to Krynn Calendar* checkbox
beside the scene's own darkness slider. Linked scenes follow the clock: darkness eases
through a one-hour twilight either side of 06:00 and 18:00 rather than switching abruptly,
and transitions are animated. Linked scenes also resync when first viewed.

**Moons lighten the night.** New setting, on by default. A full moon lifts the darkness of
a linked scene; all three full lift it substantially. It only ever affects night — it never
brightens the day. On the Night of the Eye your linked scenes will barely darken at all,
which is the correct behaviour for Krynn and makes the event visible without a word.

The bar itself tints toward cold blue as darkness rises, and the clock shifts from warm gold
at noon to pale blue at midnight.

## API

`WayrethCalendar` gains `getTime()`, `setTime(h, m)`, `advanceMinutes(n)`, `getDayPart()`,
`getDarkness()`, `isNight()`, `linkedScenes()` and `syncLinkedScenes()`. The
`wayrethCalendarChanged` hook payload now carries `time`, `dayPart` and `darkness`.

## Notes

Scene darkness is written through `environment.darknessLevel` on v12+ and falls back to the
legacy top-level field on older data.

Existing worlds start at 08:00 on their current date; nothing else changes.
