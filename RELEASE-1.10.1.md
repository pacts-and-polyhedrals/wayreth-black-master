# Wayreth: The Black Master — 1.10.1

Maintenance release. No content changes; five defects fixed.

## Fixed

**Every calendar setting was invisible, including to the GM.**
`wayreth-calendar.mjs` computed `const gmConfig = Boolean(game.user?.isGM)` inside the `init`
hook and used it as the `config` value for six settings. `game.user` does not exist during
`init` — world collections are built at `setup` — so `gmConfig` was always `false` and the
settings menu showed nothing. Starting year, calendar names, all three moon offsets, Show
Nuitari, and Announce the Night of the Eye are configurable again. World-scope settings are
already GM-only, so no gate was needed.

**Module updates destroyed GM annotations.**
The automatic reinstall on a version bump ran with `force: true`, deleting and recreating
all 177 journal pages. Any note added to a page was lost silently.

Installed pages now carry an FNV-1a fingerprint of their content. On update, a page whose
content still matches its fingerprint is replaced as before; a page you have edited is kept,
and you get a notification plus a console list naming what was preserved. The automatic run
no longer forces. The directory button now asks first, and holding **Shift** while clicking
Reinstall discards your edits deliberately.

Pages installed before 1.10.1 have no fingerprint and are treated as edited on the first
1.10.1 run. Use Shift+Reinstall once if you want a clean baseline.

**Actor-owned items lost other modules' data.**
`refreshOwnedSpells` and `refreshOwnedItems` replaced owned documents wholesale, so flags
written by Midi-QOL, Automated Animations, Times Up and similar were wiped on every update.
Flags are now merged, with this module's own flags winning on conflict.

**Staff of the Fallen Tower had a dead button.**
dnd5e 5.x renamed the spell to **Private Sanctum**. The cast activity searched for
"Mordenkainen's Private Sanctum", failed to resolve, and left an empty UUID — the button
rendered and did nothing. All ten cast-activity spell names are now verified against the
dnd5e 5.3.3 pack.

**Version maximums blocked patch releases.**
`compatibility.maximum: "14"` and dnd5e `maximum: "5.3.3"` are hard blocks, not warnings.
dnd5e 5.3.4 would have disabled the module. Both maximums removed; `verified` still records
what was tested.

## Validator

`validate-content.mjs` asserted the old buggy behaviour as a requirement, so it passed while
all of the above were live. Those two assertions were inverted and seven regression guards
added, including a check that every `cast` activity names a spell that still exists in dnd5e
5.x. Each guard was confirmed to fail when its bug is reintroduced.

The journal count in the reinstall summary is no longer hardcoded to 15.
