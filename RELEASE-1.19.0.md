# Wayreth: The Black Master — 1.19.0

## Seven feats, drag-and-drop

New compendium: **Wayreth — Orders & Feats**. Drag one onto a character sheet and it carries
its own rules text.

### The three Order feats

**Wizard of High Sorcery (White Robe / Red Robe / Black Robe)** — what passing the Test grants.
All three give the same package, differing only in moon and Price:

- **Order spell access** — the thirty spells of that Order, cantrips through 9th, as wizard spells
- **Half the usual time and half the usual cost** to scribe spells of your own Order. Other
  Orders' spells cost the ordinary amount.
- **Moon sanction** under Solinari, Lunitari or Nuitari
- **Overreaching**, paying the Silver Toll, Lunitari's Ledger or Nuitari's Due
- The robe: +1 spell save DC while worn

These are awarded, not chosen. Do not let a player pick one at an ability score improvement.

### The four supporting feats

**Conclave Standing** — Second Library access, one vault requisition per downtime, the Conclave's
writ once per long rest, and renegade hunters who parley before acting.

**Marked by the Test** — +1 Int/Wis/Cha; your Mark's boon *and* cost both deepen; once per long
rest turn a failed save into a success for 4d10 psychic and the Mark's cost again.

**Moon-Sworn** — always know your moon's phase and the days to sanction; a free upcast per long
rest during high sanction; keep your top slot during low sanction; a free 5th-level spell on the
night the moons align, on whichever calendar you are running.

**Renegade Arcanist** — for the character who refuses the Test. +1 Int, scribe any wizard spell
regardless of interdiction, resistance to divination that hunts you, and recast a countered spell
once per long rest. **Cannot Overreach**, and gets no sanction either way.

Those four are ordinary feat choices and can be taken at an ability score improvement.

Renegade Arcanist is deliberately not a punishment. Unrestricted scribing is a real advantage
across twenty levels. What the character loses is Overreaching, sanction, and the whole social
apparatus — a genuine trade, and the player should see both halves before choosing.

## Notes

The feat items were built against the actual dnd5e 5.3.3 feat schema rather than from memory —
system keys match the shipped `feat` documents exactly, with no missing or extra fields.

Fifteen validator assertions added: every feat must be a real feat item with a unique
16-character id and an identifier, each Order feat must grant spell access, halved scribing and
Overreaching, each Price must appear on exactly one robe, Renegade Arcanist must stay barred from
Overreaching, and the compendium must be registered in the installer.
