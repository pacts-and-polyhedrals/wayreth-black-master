# Wayreth: The Black Master — v1.17.0

## Campaign Trackers + Complete Later Arcs

Version 1.17.0 takes the user's v1.16.0 module as the source of truth and preserves the multi-world calendar, docked-player-list behaviour, scene darkness syncing, fingerprinted journal updates, spell/item compendia, corrected Road to Wayreth routes and Session 0 work.

### GM Campaign Tracker Board

A new GM-only **Campaign Trackers** section is rendered immediately above the calendar.

It contains six world-state trackers:

- Raistlin Trust
- Raistlin Control
- Fistandantilus Influence
- White Robe Bond
- Wayreth Accord
- War State

The board has compact two-column cards, range sliders, −/+ adjustment buttons, Shift-click ±2, Alt-click ±3, a collapse/summary mode, and a direct button to open **Campaign Timeline and Trackers**.

The tracker panel is never rendered for players. Mutation methods are explicitly GM-guarded and `getTrackers()` returns no tracker state to a non-GM. When the calendar is docked, the tracker board is its own normal-flow panel above the calendar and player list. When floating, it follows the calendar position.

### Calendar continuity fix

The **Road to Wayreth · 18 Darkember** preset now explicitly sets **18 Darkember 350 AC** rather than accidentally placing the campaign in 351. This keeps the opening chronology aligned with the campaign bible and allows the Night of the Eye to occur after the year turns to 351.

All v1.16.0 calendar upgrades remain intact:

- Krynn, Toril and Oerth calendar systems;
- world date and time;
- Krynn moon phases and sanction;
- per-scene darkness syncing;
- player-visible / GM-controlled world state;
- docked mode sized to the Foundry player list;
- floating per-user drag and corner resize;
- hidden Nuitari option;
- calculated alignments.

### Arcs II–VI rebuilt as runnable campaigns

The later campaign was previously represented by strong narrative summaries but not by session-level material equal to Arc I's travel content. v1.17.0 expands the module to **24 managed journals and 309 journal pages**.

#### Arc II — The Black Master's Errand

Expanded to **22 pages**, including 14 default sessions:

- the Master's chamber and Caramon's sword;
- wartime travel framework;
- three northbound route variants;
- Commander Veyrath's intelligence campaign;
- Solace/Haven/Fangoth/Gilthanost/Mirivale/Solanthus route variants;
- High Clerist's Tower foreshadowing;
- full Palanthas gazetteer and sandbox opening;
- Astinus and the missing record;
- Shoikan Grove perimeter and recognition;
- “The Master comes.”

#### Arc III — The Spire of Lore and Doom

Expanded to **23 pages**, including 16 default sessions:

- Palanthas faction/sandbox rules;
- Long Return clue matrix;
- detailed Shoikan psychological dungeon;
- 33-floor Palanthas Tower adapted into twelve major adventure zones;
- the Dead Wizard and lost records;
- Gate of Terror / Servants' Gate;
- Hall of Silence / Three Moons;
- Abandoned Conclave and Apprentice Quarters;
- Forbidden Library;
- Chamber of Echoes revealing Caramon's death, Raistlin's failed search, the White Robe restrictions, Red-to-Black transition and Garden Incident;
- Rannoch's Sanctum;
- Fistandantilus's impossible laboratory;
- Observatory of Time;
- Necromantic Vault;
- Lower Seals;
- Raistlin's arrival and recognition as Master of Past and Present.

#### Arc IV — The Long Return

New dedicated **22-page** journal with 13 default sessions plus expedition event tables:

- high-level travel framework;
- Silvanesti gazetteer and Nightmare expedition;
- Zhaman/Skullcap historical and adventure structure;
- submerged Istar / Chamber of Eyes framework;
- Heart of Memory;
- Chronicle of the Unbroken Hour;
- Bell of True Names;
- invitation versus dominion as an explicit mechanical/moral distinction.

#### Arc V — The War Beneath the War

New dedicated **21-page** journal with 12 default sessions plus war-front/Returned complication tables:

- war-front rules;
- Black Host binding standards;
- full Returned guidance;
- transdimensional attack on Wayreth;
- return to High Clerist's Tower as a battlefield;
- Kitiara and Lord Soth at Palanthas;
- the Long Return ritual;
- Caramon's resurrection and the visible command-channel problem.

#### Arc VI — Master of Past and Present

New dedicated **18-page** journal with 10 default finale sessions plus Abyss manifestation and final-consequence tools:

- tracker-driven finale resolution;
- Abyss metaphysical rules;
- Fistandantilus reveals he intercepted Caramon;
- Wayreth's survival confession;
- simultaneous siege of Wayreth and Palanthas;
- Caramon's independent will;
- Field of Lost Names;
- Palace of Chains / Dominion engine;
- Raistlin versus Fistandantilus;
- Takhisis and final campaign resolution;
- five ending families plus epilogue questions.

### Narrative continuity

Every new Arc II–VI session page contains:

- level and expected runtime;
- purpose;
- opening image;
- people in play;
- scene-by-scene running order;
- knowledge available to the players;
- tracker guidance;
- ending beat;
- a hidden narrative-thread note.

The complete later campaign is anchored to one through-line: **Raistlin is trying to bring Caramon back.** The progression from Palanthas research to the Portal, Long Return, Black Host, Returned and Abyss grows from that motive, while the theme shifts from grief toward the danger of converting love into possession.

### Sources used for expansion

The new location/Tower material was grounded in the supplied *Towers of High Sorcery* and *The Last Tower: The Legacy of Raistlin* references, particularly their material on Wayreth's transdimensional forest, the Lore/Doom-spire of Palanthas, Shoikan Grove, Rannoch's curse, Zhaman/Skullcap and the submerged Tower of Istar. Published later-history events are adapted to the campaign's deliberate alternate 350–351 AC chronology rather than overriding the user's timeline.

### Validation target

v1.17.0 validates:

- 90 spells / 30 per robe;
- 30 magic items including Staff of Magius;
- corrected three-road Arc I material;
- Session 0 and player guide;
- fingerprint-preserving journal updater;
- v1.16 multi-world calendar regressions;
- GM-only tracker board and API permissions;
- 24 campaign journals / 309 pages;
- minimum detailed page counts and runnable session counts for Arcs II–VI;
- installer registration for the new Arc IV, V and VI journals.
