# Wayreth: The Black Master — 1.14.1

## Fixed: the docked calendar could not be clicked

1.14.0 docked the widget above the player list, where it rendered correctly and then
ignored every click — buttons, the clock scrub, the cog, all inert.

Foundry sets `pointer-events: none` on its UI regions so the canvas underneath stays
clickable, and each panel re-enables it for itself. Docking put the widget inside one of
those regions and it never opted back in. Floating mode was unaffected because the widget
sits on `document.body` there, which is why dragging it out "fixed" it.

Docked mode now re-enables pointer events on the widget and on every interactive part, and
`dock()` also sets it on the element directly so a theme or another module cannot take it
away again.

**Added a self-check.** After docking, the widget reads its own computed style. If it still
cannot receive clicks, it says so and switches itself to floating rather than leaving you
with nothing to press. There is also a console escape hatch:
`WayrethCalendar.setDock("float")`.

## Also fixed

Switching from docked to floating left the docked class, margin and inline pointer-events
behind. The floating path now clears all three, which is what made the switch feel sluggish
and inconsistent.

The resize grip was being wired twice when docked — once by `render()` and once by `mount()`
— so every drag ran two handlers. Now wired once.

## Fixed: 28 validator assertions were never reported

The validator's report-and-exit block sat in the middle of the file, so every assertion added
after it — all of the 1.13.0 route-consistency checks and the 1.14.0 docking checks — ran,
recorded failures, and exited before printing them. The suite reported a pass regardless.

The report now runs last. All 28 are live, and each fix in this release was confirmed by
deliberately reintroducing its bug and checking the validator fails.
