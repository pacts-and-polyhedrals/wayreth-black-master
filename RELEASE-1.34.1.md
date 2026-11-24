# 1.34.1 — The scenes actually install

1.34.0 shipped 87 scenes that never appeared, and that was my mistake in a way worth naming precisely.

## What was wrong

The call that installs them sat **after the `return`**:

```js
  return { journals, items, spells, version };
  // Scenes last: their pins point at the journals…
  try {
    await installScenes({ notify: false, force });
  } catch (error) { … }
}
```

Dead code. I patched the installer with a regex that inserted the call before the function's closing brace, and the function had already returned several lines above. Reinstalling content did everything it has always done and silently skipped the scenes.

Every validator passed, because every validator checked the **content** — that the scene data was correct, the pins resolved, the handouts were clean. Nothing checked that the installer would run. Correct data, never installed, and the build was perfectly happy.

## What stops it happening again

`scripts/test-install.mjs` runs the real `installScenes()` against the real shipped files, outside Foundry, with the parts of Foundry it touches stubbed — fetch, the journals, the bestiary pack, `Scene.create`, `Folder.create`. It then checks what came out:

- 87 scenes in 7 folders, with maps, dimensions and walls
- all 351 pins resolved to **real journal page ids**, each verified to be in the journal the pin names
- all 21 tokens resolved to **real bestiary actor ids**, and all hidden
- a handout reaching chat with no journal anywhere in the path
- **a second install refreshing rather than duplicating**, with tokens the GM moved left alone

And the trap for this specific bug:

```
installScenes is called after reinstallContent returns — it is dead code,
which is exactly how 1.34.0 shipped with no scenes
```

Confirmed by putting the bug back and watching it fail.

## It caught a second bug on the way

The refresh path identified its own pins with `n.getFlag?.(MODULE, "order")`. Optional chaining on a missing `getFlag` returns `undefined` silently, so no old pin was ever recognised as stale and **a reinstall doubled every pin on every scene** — 702 book icons on the second pass. It now reads the flags object directly as well, and the test asserts the pin count after a refresh.

## The button you were looking for

There is now **Install Wayreth Scenes** in the Scene Directory footer, next to where Reinstall Wayreth Content sits in the Journal and Item directories.

It does the scene layer only. Rebuilding ninety spells and eighty-one creatures to get your maps back is not a reasonable thing to ask of a module this size, and compiling this package already takes longer than anything else you run.

- **Default click**: scenes you already have are refreshed — pins rebuilt against the current journals, tokens you moved and drawings you made untouched.
- **Shift-click**: rebuild from scratch and lose those changes.
- Journals and the bestiary must exist first, because the pins and tokens point at them. The full reinstall still does everything in the right order.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. `IMPORT_VERSION` 32 — unchanged from 1.34.0, so if you already loaded that build the automatic pass will not re-fire. **Use the Install Wayreth Scenes button**, or reinstall content, and the scenes will appear.

No content changed. This is the install path and the test around it.
