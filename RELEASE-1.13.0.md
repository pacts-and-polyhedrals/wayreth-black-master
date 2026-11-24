# Wayreth: The Black Master — 1.13.0

Route consistency pass. No route was added, removed or re-pathed; the three roads are
unchanged. What changed is that the numbers now agree with each other.

## The problem

The route overview tables mixed two different bases. Intermediate rows gave *normal* arrival
windows, but the final Wayreth row gave a *fastest-to-worst* span. Reading down a table, the
last row appeared to contradict the ones above it, and it disagreed with the stop pages and
the finale tables as well.

Route I was the clearest case: the overview put Gilthanost at 14–22 Frostkolt while the
Gilthanost stop page said 17–22, and the Wayreth row said 18–27 while the finale said 21–24.

## Fixed

**Every window is now a normal-journey arrival window** and says so. Each overview gained a
*Reading These Windows* note and a totals table giving fast / normal / bad journeys as both
day counts and arrival dates, measured against the 26 Frostkolt deadline.

| Route | Normal arrival | Fast | Bad |
|---|---|---|---|
| I — Sailor's Road | 21–24 Frostkolt | 18 | 26–28 |
| II — Heartland Road | 17–22 Frostkolt | 16–17 | 23–27 on foot |
| III — Wild Road | 20–25 Frostkolt | 16–20 | 25–28 |

Route II's Zaradene branch stays at 20–25 Frostkolt and is now labelled as branch B
everywhere rather than being folded into the main figure.

The three finale tables were carrying their own numbers and now match the overviews. The
master guide's *Three Roads at a Glance* gained an arrival column, so the comparison and the
route journals cannot drift apart.

**The deadline is stated once, consistently.** The guide previously said the desired arrival
window was 25–27 Frostkolt in one table and called 27 "late" in another. Ispin's own wording
is now used throughout: 26 Frostkolt is the practical deadline, 27 is the absolute latest,
28 is late.

## Fixed: the update could not reach an existing world

Two things were blocking it.

`IMPORT_VERSION` was still 10, so a world already at 10 would never refresh its journal
pages no matter how much the route content changed. It is now 11.

More seriously, 1.10.1's edit-preservation treated any page without a content fingerprint as
edited, and pages installed before 1.10.1 have no fingerprint. That froze them permanently
and would have blocked this fix and every future one. Un-fingerprinted pages are now
refreshed, which is exactly the behaviour they were installed under before 1.10.1, and the
count is logged to console. Pages you have genuinely edited since 1.10.1 are still preserved.

## Validator

Nine assertions added: each route's normal arrival window must appear in both its own journal
and the master guide, every overview must carry the arrival-basis note, the four retired
routes must not reappear in any journal, and both deadline dates must be present.
