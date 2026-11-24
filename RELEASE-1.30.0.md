# 1.30.0 — The dragons cast

Not one true dragon in the bestiary could cast a spell. Cyan Bloodbane, whose whole place in Dragonlance is that he poisoned the dreams of a nation, could not cast *dream*.

## Why they didn't

This was defensible, not an oversight: the 2014 Monster Manual's printed dragon stat blocks have no spellcasting. It is also the wrong reading for this setting. Takhisis's dragons are officers and schemers who command armies; Paladine's are guardians who walk among people. A dragon that can only bite is a different creature from the one the novels are about.

So the module now uses the Monster Manual's own variant, applied as written:

> *A dragon of adult or older age category can innately cast a number of spells equal to its Charisma modifier. Each spell can be cast once per day, requiring no material components, and the spell's level can be no higher than one-third the dragon's challenge rating (rounded down).*

That makes the **number** of spells and their **ceiling** arithmetic rather than taste, derived from the Charisma and CR already on each stat block. Which spells is a judgement call; how many is not.

## What they got

| Dragon | CR | CHA | Spells | Ceiling | DC | Chosen |
|---|---:|---:|---:|---:|---:|---|
| **White, Adult** | 13 | 12 | 1 | 4th | 14 | sleet storm |
| **Black, Adult** | 14 | 17 | 3 | 4th | 16 | fear · stinking cloud · blight |
| **Green, Adult** | 15 | 17 | 3 | 5th | 16 | detect thoughts · suggestion · hallucinatory terrain |
| **Blue, Adult** | 16 | 19 | 4 | 5th | 17 | blur · haste · dimension door · dominate person |
| **Silver, Adult** | 16 | 21 | 5 | 5th | 18 | bless · calm emotions · dispel magic · death ward · greater restoration |
| **Red, Adult** | 17 | 21 | 5 | 5th | 19 | command · suggestion · fear · wall of fire · dominate person |
| **Cyan Bloodbane** | 19 | 21 | 5 | 6th | 19 | detect thoughts · suggestion · hallucinatory terrain · **dream** · mass suggestion |
| **Blue, Ancient** | 23 | 21 | 5 | 7th | 20 | blur · haste · dimension door · dominate person · teleport |
| **Silver, Ancient** | 23 | 23 | 6 | 7th | 21 | bless · calm emotions · dispel magic · death ward · greater restoration · heal |
| **Gold, Ancient** | 24 | 28 | 9 | 8th | 24 | bless · calm emotions · dispel magic · banishment · geas · true seeing · heal · holy aura · sunburst |
| **Red, Ancient** | 24 | 23 | 6 | 8th | 21 | command · suggestion · fear · wall of fire · dominate person · incendiary cloud |

**52 innate spells across 11 dragons**, each 1/day, each Charisma-based. With the caster loadouts from 1.29.0 the bestiary now carries **456 spell Items**, up from 124 two releases ago.

## How the lists were chosen

Each dragon's magic does something its claws cannot, rather than adding a second way to deal the damage it already deals. No red dragon got *fireball*; it got *wall of fire*, which changes the ground, and *dominate person*, which changes who is fighting whom.

- **Chromatics scheme.** The blues are the Highlords' cavalry, so their magic moves themselves and their officers and takes an enemy's officer away. The greens lie — a forest that deceives, a mind read before a word is spoken. The blacks make their prey come apart before they have to land. The reds are about who gives orders.
- **Metallics protect.** Every spell on a silver keeps somebody else alive. The ancient gold, at Charisma 28, has the largest allowance in the bestiary and spends it the way Paladine's hand on a battlefield would.
- **Cyan Bloodbane is the one dragon who needed this.** *Dream* and *mass suggestion* are not flavour on him; they are the mechanism of the Silvanesti nightmare. He also keeps *hallucinatory terrain*, which is the Nightmare in miniature.
- **The white gets one spell** and it is *sleet storm*. A white dragon is the least cunning of its kin, and its Charisma says so.

## Who deliberately got nothing

- **Young dragons and wyrmlings.** The variant starts at adult, and the build fails if one of them gains a spell. A wyrmling that teleports is a different monster.
- **The draconians.** They are dragon-*type* and are not dragons. The aurak's innate magic is its own trait and stays exactly as it was; the bozak is a prepared caster with a loadout from 1.29.0.
- **The three abyssal wyrms** — Vaelzhar, Nythravel and Kharzoryx — are imported verbatim from your own exports and left as they arrived, as they have been since 1.25.0. By the variant they would be entitled to 8, 8 and 9 spells at ceilings of 8th, 8th and 9th level. **Say the word and they get them**; I did not want to edit stat blocks that are deliberately yours.

## Guarding it

`scripts/lib/dragon-magic.mjs` holds the lists and refuses to render one that breaks the variant, so the build dies at the source:

```
White Dragon, Adult: CR 13 caps spells at level 4, but incendiary cloud is level 8
Black Dragon, Adult: Charisma 17 allows 3 spells, 2 are listed
```

The validator then checks the finished bestiary independently — spell count against Charisma, every spell's real level against the CR ceiling, 1/day each, the DC against CR and Charisma, Charisma set as the casting ability, and that no dragon younger than adult casts anything. The totals are pinned at 11 casters and 52 spells, and one assertion exists purely because the content demands it:

```
Cyan Bloodbane must be able to cast dream; it is the thing he is famous for
```

Both layers were confirmed by breaking them.

## Also

- `IMPORT_VERSION` 30 → 31, so existing worlds pick the dragons' magic up on the next GM load.
- No dragon's hit points, AC, attacks, breath, legendary actions or CR changed. Each gained one **Innate Spellcasting** trait and a Charisma casting ability so the DC derives on the sheet.
- The eleven dragons previously had no casting ability set at all; the two built through the shared `dragon()` factory needed the factory to pass one through.

## Install

Foundry v12–v14, dnd5e 3.0.0–5.3.3. Update and load the world as GM. Innate spells arrive as real spell Items with 1/day uses that recover on a long rest, resolved from dnd5e's SRD pack at install time.
