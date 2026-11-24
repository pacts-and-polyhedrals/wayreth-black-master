# Wayreth: The Black Master — 1.14.0

## Changed

**The calendar docks above the player list, bottom-left, like SmallTime.** This is now the
default. It sits in normal flow directly above the player list, matches its width, and moves
with it as players connect and disconnect.

Because the column is narrow, the bar restacks when docked:

- Date and weekday on top
- Time and period of day beneath it
- All three moon phases along the bottom, with the day arrows, key and cog beside them

Floating mode is still available — *Calendar Position* in module settings switches between
**Docked above the player list** and **Floating (draggable)**. The setting is per user, so a
player can float it even if you dock it.

## Notes

The player list moved between Foundry v12 and v13, so the widget tries five known locations
in order and falls back to floating if it finds none. It re-docks whenever Foundry re-renders
the player list — on login, logout, activity, and sidebar collapse — so it cannot be orphaned.

Resizing still works when docked. A CSS transform does not reserve layout space, so a scaled
widget would have overlapped the sidebar above it; the widget now measures its own unscaled
height and reserves the difference. It also scales upward out of the corner rather than down
through the player list.

The GM controls panel and the moon key open upward when docked, so opening them never pushes
the player list around.
