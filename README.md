# Wayreth: The Black Master

A private campaign supplement for **Dragonlance: Shadow of the Dragon Queen**, D&D 5e (2014 rules), Foundry VTT v12–v13.

It is 351 AC. The Dragonarmies are moving, Takhisis has returned, and Raistlin Majere holds the Mastership of the Tower of Wayreth — the last Tower of High Sorcery on Krynn.

## Contents

**Compendium: Wayreth: The Black Master** — 8 journals, 44 pages, 23 DM-only sections.

| # | Journal | Pages |
|---|---|---|
| 1 | **A History of High Sorcery** | The three moons; founding of the Five Towers; the Kingpriest and the Age of Might; the Lost Battles; the fall of the Towers; the Curse of Palanthas; Wayreth alone; the Orders and the Conclave |
| 2 | **The Black Master of Wayreth** | The Concession of Wayreth; what actually happened; the Master in residence; the court of the Tower; what he wants from the party |
| 3 | **The Test of High Sorcery** | Doctrine; petition and summons; structure; running it at the table; bespoke Test generator; the Mark; failure rules; a Test written by Raistlin |
| 4 | **The Forest and Tower of Wayreth** | The forest; the refused; the approach and the gate; the public Tower; the working Tower and the vaults |
| 5 | **Moons and Sanction** | The three cycles; high and low sanction mechanics; the Night of the Eye; the calendar widget |
| 6 | **The Vaults: Objects of High Sorcery** | Using the catalogue; alchemical mixtures; magical writings; rings, rods and wands; staves and artifacts |
| 7 | **The Court of Wayreth: Stat Blocks** | Raistlin (CR 21); Par-Salian, Ladonna, Justarius, Dalamar; Guardian of the Tower; Renegade Hunter |
| 8 | **Adventure: The Errand of the Black Master** | Four-act arc for levels 5–8, hooking into Kalaman |

## Where to start

Read **2** first — the whole supplement hangs off the Concession of Wayreth and the secret underneath it. Then pick Raistlin's agenda (end of journal 2, *What He Wants From the Party*) and commit before session one. It changes what's in the vaults, what the adventure's climax means, and how you play every scene in the Tower.

If you only run one thing from this, run the Test.

## Threads that cross journals

Deliberately wired together — if you cut one, check the others.

- **The forest decides, not the Conclave.** Seeded in journal 1 (*Wayreth Alone*), paid off in 2 (*What Actually Happened*), reinforced in 4 (*The Forest*), load-bearing in the adventure's Act II.
- **The Night of the Eye** (journal 5) is the adventure's deadline — eleven days after the Conclave convenes.
- **The Mark table** (journal 3) is also the cost table for the Grey Staff (journal 6).
- **The Hourglass of Fistandantilus** (journal 6) is what Raistlin is doing in the vaults under the Survival agenda, and it's the vessel in the adventure's Act IV.
- **The Sealed Library** (journal 4) holds the unedited Kingpriest negotiation — the reason Raistlin's argument to the Conclave landed at all.

## Install

Unzip into `Data/modules/wayreth-black-master/` and enable in your world. `module.json` must sit at the root of that folder.

DM-only material is in Foundry `section.secret` blocks. Pack ownership is **OBSERVER** for players, so journals are readable and secrets stay dark.

## Rebuilding after edits

1. **In Foundry** — import the journals into your world and edit normally. Nothing needs rebuilding.
2. **In source** — edit `content/*.json` (page HTML lives there), then:

```bash
npm install classic-level
node scripts/build.mjs
```

Regenerates `packs/wayreth-journals/` (the LevelDB pack Foundry reads) and `packs/_source/*.json` (readable, for diffing in git). Compendium order follows the `FILES` array in `scripts/build.mjs`.

Document IDs are derived deterministically from journal and page names, so rebuilds keep stable IDs and updates won't duplicate entries. Renaming a page changes its ID — re-import rather than updating in place if you rename.

## Releasing

New GitHub release, attach `module.zip` and `module.json` as assets with names matching the manifest download URLs, mark it Latest. Zip contents at the root, no wrapper folder.

Manifest points at `pacts-and-polyhedrals/wayreth-black-master`. Update `url`, `manifest`, and `download` if the repo lands elsewhere. Current version **1.2.0**.

## The Krynn calendar widget

An on-screen widget tracking the date and all three moons — drag it anywhere, position saves per user.

- **336-day Krynn year** — twelve 28-day months, four 7-day weeks each. Month names switch between Solamnic, Ergothi, and Elven. Defaults to 351 AC.
- **True moon phases** — Solinari on a 36-day cycle, Lunitari 28, Nuitari 8, drawn as actual phase discs. High sanction rings gold, low sanction rings crimson.
- **Nuitari is hidden from players by default.** The black moon is invisible to all but those who serve it. There's a setting to reveal it.
- **Night of the Eye** — computed, not hardcoded. The widget lights up and optionally posts to chat. There's a "jump to next alignment" button in the GM controls.
- **API** at `game.modules.get("wayreth-black-master").api` (aliased `WayrethCalendar`): `getDate()`, `getMoons()`, `sanctionFor("black")`, `isNightOfTheEye()`, `daysToNightOfTheEye()`, `advance(days)`, `setDate(y, m, d)`. The `wayrethCalendarChanged` hook fires on every change.

The widget is plain injected DOM rather than an Application subclass. ApplicationV2 arrived in v12 but shifted across v12/v13/v14 while V1 is being retired — building the element directly keeps one codebase working across the whole supported range. Date state lives in a world setting, so changes propagate to players without a socket.

### The 504-day question

Some sources give the Night of the Eye as every 420 days. The three cycles are 36, 28, and 8 days, whose lowest common multiple is **504** — which is what the 3.5 Campaign Setting states and what the widget computes. If you need the alignment on a specific date anyway, shift it with the moon offset settings rather than fighting the arithmetic.

## Styling

`styles/wayreth.css` and `styles/calendar.css` — Cinzel headings, EB Garamond body, dark ground with gold and crimson, DM sections in bordered crimson panels. Content is wrapped in `.wayreth-journal`, so styling holds in compendium view, journal sheets, and popped-out pages without a JS hook. Fonts load from Google Fonts, falling back to Palatino/Georgia offline.

## Not included

Original text written for this campaign. This does not reproduce *Towers of High Sorcery* (Sovereign Press, 2004) or *The Last Tower: The Legacy of Raistlin* (TSR, 1996). Where you want specific passages, boxed text, or chapter quotes from books you own, add them yourself — the journals are structured to take them.

Private campaign material. Not for distribution.
