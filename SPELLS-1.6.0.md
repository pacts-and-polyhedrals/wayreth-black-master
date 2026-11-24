# Robe Spellbooks — v1.6.0

Version 1.6.0 adds **90 complete dnd5e spells**, 30 for each Order of High Sorcery, covering cantrips through 9th level. Thirty-one are 5e conversions of the legacy Krynn spells supplied with the project; the other fifty-nine are original spells written to complete the three identities and level progressions.

## School identities

| Order | Primary schools | Magical identity |
|---|---|---|
| White Robes | Abjuration, Divination, Enchantment | protect, reveal, strengthen willing minds |
| Red Robes | Conjuration, Illusion, Transmutation | adapt, exchange, transform, redirect |
| Black Robes | Enchantment, Evocation, Necromancy | dominate, destroy, drain, bind |

Enchantment is deliberately shared. White Robe enchantment reinforces courage, clarity, consent, and freedom of action; Black Robe enchantment removes or exploits those same freedoms.

## White Robe roster

- **Cantrips:** Silver Ward; Steady Hand; Guiding Sigil
- **1st:** Detect Familiar; Moonward; Kindled Resolve
- **2nd:** Truth-Testing; Silver Reprieve; Concordant Courage
- **3rd:** Spellward Relay; Unclouded Sight; Oath of Clarity
- **4th:** Suppress Magic; Lantern of Unasked Truths; Sanctuary of Consent
- **5th:** Aegis of Solinari; Witness Chain; Silver Covenant
- **6th:** Displace Memory; Prism of Spellturning; Starless Answer
- **7th:** Greater Arcane Eye; Song of Day's Clarity; Vision of Dusk's Eye; Whisper of Dawn's Song
- **8th:** Solinari's Interdiction; Perfect Witness
- **9th:** Consensus; Aegis of the Three Moons; Crown of Free Will

## Red Robe roster

- **Cantrips:** Cleaning; Conjurer's Chalk; Borrowed Hue
- **1st:** Veil of the Ordinary; Balanced Implement
- **2nd:** Mirror Passage; Equal Exchange
- **3rd:** Arcane Staff, Lesser; Shape of the Beasts; Stone Guardian
- **4th:** Awaken the Mind; Equilibrium Gate; Phantom Architecture
- **5th:** Arcane Staff; Giant's Guise; Conjure Counterpart
- **6th:** Wayreth's Moving Door; Mirror Labyrinth; Balanced Transformation
- **7th:** Arcane Staff, Greater; Mindspin; Timeheal; Touch of Guiding Light; Lunitari's Exchange
- **8th:** Palace Between Moments; Mirror of Possible Selves
- **9th:** Mindspin, Greater; Timereaver; Travel the Paths of the Mind; Convergence of Three Roads

## Black Robe roster

- **Cantrips:** Nuitari's Hook; Cinder Lash; Grave Whisper
- **1st:** Obedient Step; Blackflame Dart; Borrowed Vitality
- **2nd:** Disarm; Feign Life; Umbral Burst; Blood Scent
- **3rd:** Sable Edict; Chain of Embers; Harvest the Fallen
- **4th:** Life Transfer; Tyrant's Brand; Black Moon Detonation
- **5th:** Curse the Magi; Transfer Essence; Crown of Submission; Starless Lance
- **6th:** Raistlin's Wheel of Flame; Death's Due; Silence the Defiant
- **7th:** Kiss of Night's Guardian; Soul Chain; Edict of the Black Moon
- **8th:** Sable Cataclysm; Exsanguinate Memory
- **9th:** Reverse Death; Final Dominion

## Foundry integration

- `content/spells.json` is the single source for all 90 spell Item documents.
- World install creates `Wayreth: Robe Spells` with White, Red, and Black child folders.
- Existing actor copies managed by the module are refreshed on update while retaining their preparation state.
- `The Robe Spellbooks of High Sorcery` is an in-world player-readable journal explaining the school philosophy, complete level lists, and legacy conversion policy.
- `npm run validate` checks counts, levels, school restrictions, identifiers, management flags, legacy count, and component-consumption metadata before release.
