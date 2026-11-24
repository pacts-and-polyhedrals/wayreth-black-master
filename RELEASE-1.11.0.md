# Wayreth: The Black Master — 1.11.0

## Changed

**The calendar resizes by dragging its bottom-right corner.**

The −/%/+ button cluster is gone. A grip now sits on the bottom-right corner of the
calendar bar, appearing on hover and using the standard diagonal resize cursor. Drag it
to resize; the corner tracks your pointer. Double-click resets to 100%.

Size is still per-user and still persists — the setting is unchanged, only the control
is different. Range remains 70%–160%.

The grip is anchored to the bar rather than the widget root, so opening the GM controls
panel no longer pushes it down the screen. It is keyboard accessible: focus it and use the
arrow keys to adjust, Home to reset.

## Implementation note

The widget scales with `transform: scale()` from a `top left` origin, so its top-left
corner stays fixed while resizing. The new scale is the ratio of the pointer's distance
from that corner, before and after — measured on the diagonal, so the grip stays under the
cursor whichever direction you drag. Scale is written to settings once on pointer release
rather than on every move.

Validator gained eight assertions covering the grip, including that the old percentage
buttons are gone from both the script and the stylesheet.
