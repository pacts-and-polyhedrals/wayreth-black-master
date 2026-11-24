# 1.22.1 — Legacy chat cards show only the feature used

A fix. Using one feature on a legacy item printed the entire item to chat, all four states of it.

## The bug

dnd5e builds an activity's usage card from the **item's** description, not the activity's. `ItemDataModel#getCardData` uses `system.description.chat` and falls back to `system.description.value` when that is empty, and the activity's own `description.chatFlavor` is only used as the card's *subtitle*.

On an ordinary magic item that is fine — one item, one blurb. On a legacy item, whose description deliberately carries Dormant, Awakened, Exalted and Legendary all at once, pressing *Pocketful of Nonsense* printed roughly nine thousand characters: the whole progression, the Legacy Save DC, the Vault Record, every feature the character cannot use yet.

## The fix

Two layers.

**The card is rebuilt before it is posted.** The module now hooks `dnd5e.preCreateUsageMessage` and, for legacy items only, rewrites the rendered card: the feature's name becomes the title, the item's name drops to the subtitle, and the body becomes that feature's own text. The buttons, the trigger line and everything dnd5e attaches afterwards — rolls, damage, saves — are untouched.

Before and after, for the same press:

| | Card size |
|---|---|
| Was | 6,800–9,000 characters, the whole item |
| Now | 300–1,200 characters, one feature |

**Every legacy item now carries a short `description.chat`.** That is the field dnd5e reaches for first, so even if the rebuild never runs — another module interfering, a future dnd5e change — the fallback is two lines naming the item and pointing at its reference journal, not the full text.

## Guarding it

New `scripts/validate-cards.mjs`, wired into `npm run validate:all`. It loads the real function out of the shipped module and pushes **all 66 legacy activities** through it against dnd5e 5.3.3's actual card markup, checking for each one that the title is the feature, the subtitle is the item, the body is that feature's text and nothing else, the buttons and trigger survive, and no trace of the other states remains. It also checks that a non-legacy item's card comes back byte-for-byte unchanged, and that malformed markup is left alone rather than throwing in the middle of using a feature.

It needs a DOM, so it skips cleanly with a one-line instruction if `linkedom` is not installed rather than failing the build:

```
npm install --no-save linkedom
npm run validate:all
```

`scripts/validate-content.mjs` additionally asserts statically that the hook is registered, that it is scoped to legacy items, that it serialises from the card element rather than the document body, that a failure inside it is caught, and that every item's fallback line is short and names its bearer.

## Also

- `IMPORT_VERSION` 21 → 22, so existing worlds pick up the fallback lines on the next GM load.
- Nothing about the items' rules, levels, charges or gating changed. If you are already running 1.22.0 this is a drop-in replacement.

## Release preflight

New `scripts/check-release.mjs`, run with `npm run check:release`. It reads `module.json`, prints the tag and asset names the manifest requires, then probes the live URLs and says which half is wrong.

It exists because the Forge's install failure for a tag mismatch is a **500 Internal Server Error**, which sends you looking at the Forge rather than at the release. What actually happens is that Foundry reads the version out of the published manifest, asks GitHub for `/releases/download/v<version>/module.zip`, and GitHub returns 404. Attaching an updated `module.json` to an older release produces exactly this, because the manifest version and the tag no longer agree.

`npm run validate:all` now runs the offline half of it, which asserts the download URL names `v<version>`, the asset is called `module.zip`, the manifest URL uses the `/releases/latest/` form, the download URL sits under the repository named in the manifest, and the README's release instructions name the tag actually being shipped.

## Not a bug

Worth recording, since it looked like one: a legacy item with no usable options on a 3rd-level character is usually a 2nd-level character. The Dormant band starts at 3, and below it `Activity#canUse` hides every feature, which is exactly the intended behaviour.
