# Wayreth: The Black Master — v1.10.0

## Shared, resizable Krynn moon calendar

This release makes the on-screen Krynn calendar a true shared table display while keeping world time under GM control.

### Player view

- The calendar now mounts for every connected player as well as the GM.
- Players can drag the widget to their preferred location.
- Players can resize it locally with **− / percentage / +** controls.
- Supported scale range is **70%–160%**; clicking the percentage resets the widget to **100%**.
- Position and size are client-scoped, so one user's layout never changes another user's.
- Players can open the moon-power key and inspect visible moon phases/sanctions.
- Nuitari remains hidden from players by default unless the GM enables it.

### GM authority

Only the GM receives:

- previous/next day buttons;
- calendar control cog;
- direct date setting;
- week/month jumps;
- jump to the Night of the Eye;
- Road to Wayreth clock reset;
- world calendar naming, moon-offset, Nuitari-visibility and Night-of-the-Eye announcement settings.

All code paths that mutate world calendar state now use explicit GM permission guards, including the public module API. Non-GM clients can no longer use the API to alter the date or reset the campaign clock.

### Compatibility

No campaign journals, spells, magic items, routes, or Session 0 content were replaced in this update. v1.10.0 is a calendar/UI/permissions release layered over v1.9.0.
