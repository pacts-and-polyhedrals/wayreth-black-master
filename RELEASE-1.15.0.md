# Wayreth: The Black Master — 1.15.0

## Master of the Black Tower

The module is now a full levels 1–20 campaign. Six new journals, 40 new pages, 217 pages total.

| Journal | Covers |
|---|---|
| **Campaign Bible** | Premise, why Wayreth chose Raistlin, the Garden Incident, his seven-stage descent, themes, the White Robe PC |
| **Campaign Timeline and Trackers** | 348–351 AC chronology; the six hidden trackers with thresholds |
| **Arc I: The Road to Wayreth** | Ispin, the Kingfisher Festival, the Forest, the Three Orders, the Night of the Eye, the four-movement White Robe Test |
| **Arc II: The Black Master's Errand** | The three objectives, war roads, Solace, Haven, Veyrath, Dargaard, Solanthus, Palanthas, Astinus, the Grove |
| **Arc III: The Spire of Lore and Doom** | Palanthas sandbox, nine factions, the Shoikan Grove in six areas, the Tower in twelve levels |
| **Arcs IV–VI** | Three expeditions, the complete Long Return, the war beneath the war, Caramon, the Abyss, five endings |

Everything already in the module is retained. The arc journals reference the route guides, the Test,
the Tower gazetteer and the stat blocks rather than repeating them.

## Reconciled with existing content

The new campaign plan contradicted several things already written. Resolved as follows.

**The Garden Incident replaces the Concession of Wayreth.** The module previously had a political
concession with the Tower's rejection of Par-Salian as a hidden secret. The Tower's choice is now
overt: Par-Salian was locked out of the gardens, the wards named Raistlin Master, and the Conclave
vote merely ratified it.

**Raistlin has one motivation, not three.** The old "pick an agenda" note is gone. He is trying to
bring Caramon back, from the first session to the last, and the seven-stage escalation is documented.

**The campaign now opens in 350 AC**, crossing into 351 on the Night of the Eye. Every year reference
was audited; the calendar default and the Road to Wayreth setup control both set 350.

**The Krell arc is now "Arc I Finale: The Errand of the Vessel."** It previously shared both its name
and its level band with Arc II. It fits Arc I far better — and it now foreshadows the Long Return
deliberately: the party watches Raistlin draw a working out of a living man and into a vessel,
three arcs before he does the same thing to his brother.

## Validator

Sixteen assertions added covering journal registration, the campaign premise, the retired framings,
the year boundary and the arc naming. One older guard was checking the whole installer file rather
than the CONTENT_FILES array, so a journal could be unregistered without failing; it now parses the
array directly. Every guard was confirmed by reintroducing its bug.
