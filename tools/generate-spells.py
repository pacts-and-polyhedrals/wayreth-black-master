import json, re, hashlib, html
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
MODULE='wayreth-black-master'
SCHOOL_CODES={'Abjuration':'abj','Conjuration':'con','Divination':'div','Enchantment':'enc','Evocation':'evo','Illusion':'ill','Necromancy':'nec','Transmutation':'trs'}
ORDER_COLOR={'White':'#d8d8e8','Red':'#8b1a1a','Black':'#16131a'}
ORDER_ICON={
 'White':'icons/magic/light/explosion-star-glow-silhouette.webp',
 'Red':'icons/magic/symbols/runes-star-pentagon-magenta.webp',
 'Black':'icons/magic/unholy/orb-glowing-purple.webp'
}

def slug(s):
    return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')

def aid(seed):
    return hashlib.sha256(seed.encode()).hexdigest()[:16]

def S(name,order,level,school,text,*,legacy=False,rarity='Order spell',casting='1 action',range_='60 feet',target='One creature',duration='Instantaneous',components='V, S',material='',ritual=False,concentration=False,activity='utility',save='',damage='',dtype='',onsave='none',attack='',healing='',scale='',chat=''):
    return dict(name=name,order=order,level=level,school=school,text=text,legacy=legacy,rarity=rarity,casting=casting,range=range_,target=target,duration=duration,components=components,material=material,ritual=ritual,concentration=concentration,activity=activity,save=save,damage=damage,dtype=dtype,onsave=onsave,attack=attack,healing=healing,scale=scale,chat=chat)

sp=[]

# ---------------- WHITE ROBES ----------------
sp += [
S('Silver Ward','White',0,'Abjuration',
'''You trace a silver crescent before yourself. Until the start of your next turn, you gain a +1 bonus to AC. The first time before then that you make a saving throw against a spell or magical effect, you may roll a d4 and add it to the save after seeing the d20 but before the outcome is declared. The spell then ends.''',
range_='Self',target='Self',duration='1 round',activity='utility',chat='Gain +1 AC until your next turn and a single d4 bonus against a spell or magical effect.'),
S('Steady Hand','White',0,'Enchantment',
'''You speak a measured phrase to one willing creature in range. The creature may add 1d4 to one ability check of its choice made before the spell ends. It may roll the die after the d20 is rolled but before the result is declared. The spell then ends.''',
range_='30 feet',target='One willing creature',duration='Concentration, up to 1 minute',concentration=True,activity='utility',chat='One willing creature gains 1d4 on one ability check before the spell ends.'),
S('Guiding Sigil','White',0,'Divination',
'''You touch an object no larger than 5 feet in any dimension and place a faint silver sigil upon it for 1 hour. While the object is within 300 feet of you and on the same plane, you know the direction to it. You can maintain only one guiding sigil at a time; casting this spell again ends the previous sigil.''',
range_='Touch',target='One object',duration='1 hour',activity='utility',chat='Know the direction to the marked object while it remains within 300 feet.'),

S('Detect Familiar','White',1,'Divination',
'''For the duration, you sense magical bonds between creatures in a 60-foot cone and familiars, bonded companions, magically summoned steeds, or similar creatures bound to another being. On the first round you learn whether such a bond is present. On the second, you learn how many bonded creatures are present and the direction of the strongest bond. On the third and subsequent rounds, you learn the location of each bonded creature you can sense and whether its bond originates from a creature you can see. The spell does not reveal the identity of the bonded master and does not penetrate total cover.''',
legacy=True,casting='1 action',range_='Self (60-foot cone)',target='60-foot cone',duration='Concentration, up to 10 minutes',concentration=True,ritual=True,activity='utility',chat='Sense familiars and similar magically bonded companions in a 60-foot cone.'),
S('Moonward','White',1,'Abjuration',
'''When a creature you can see within range is hit by an attack, you throw a momentary ward between attacker and target. The protected creature gains a +3 bonus to AC against the triggering attack, potentially causing it to miss. If the attack still hits and deals damage from a spell or magical effect, reduce that damage by 1d6.''',
casting='1 reaction, which you take when a creature you can see is hit by an attack',range_='30 feet',target='The creature hit by the triggering attack',duration='Instantaneous',activity='utility',chat='+3 AC against the triggering attack; if it still hits with magical damage, reduce that damage by 1d6.'),
S('Kindled Resolve','White',1,'Enchantment',
'''Choose one willing creature in range. Until the spell ends, the target has advantage on saving throws against being frightened. When it succeeds on a saving throw against being frightened, or when the spell is cast while it is already frightened, it may immediately repeat one saving throw against that effect. In addition, it gains temporary hit points equal to 1d6 + your spellcasting ability modifier when you cast the spell.''',
range_='30 feet',target='One willing creature',duration='Concentration, up to 1 minute',concentration=True,activity='heal',healing='1d6 + @mod',chat='Bolster a willing creature against fear and grant 1d6 + spellcasting modifier temporary hit points.'),

S('Truth-Testing','White',2,'Divination',
'''Choose one creature you can see within range. It must make a Wisdom saving throw. On a failed save, for the duration you know whenever the creature deliberately and knowingly speaks a lie while you can hear it. The spell does not reveal the truth, detect mistaken statements, or force the creature to answer. A creature that succeeds on the save is immune to your truth-testing until you finish a long rest.''',
legacy=True,range_='30 feet',target='One creature',duration='Concentration, up to 1 minute',concentration=True,activity='save',save='wis',chat='On a failed Wisdom save, you know when the target knowingly speaks a lie.'),
S('Silver Reprieve','White',2,'Abjuration',
'''When a creature you can see within range fails a saving throw against a spell or magical effect, you may cast this spell before the effect is resolved. The creature rerolls the saving throw and adds 1d4 to the new roll, using the new result. A creature can benefit from only one silver reprieve against a single effect.''',
casting='1 reaction, taken when a creature fails a saving throw against magic',range_='30 feet',target='One creature',duration='Instantaneous',activity='utility',chat='The target rerolls the failed save against magic and adds 1d4.'),
S('Concordant Courage','White',2,'Enchantment',
'''Up to three willing creatures you can see in range are bound by a calm silver cadence. Until the spell ends, each target has advantage on saving throws against being charmed or frightened. The first time a target succeeds on such a saving throw during the spell, it gains 1d6 temporary hit points.''',
range_='30 feet',target='Up to three willing creatures',duration='Concentration, up to 10 minutes',concentration=True,activity='utility',chat='Up to three creatures gain advantage against charm and fear; the first successful such save grants 1d6 temp HP.'),

S('Spellward Relay','White',3,'Abjuration',
'''When a spell targets only one creature you can see within 30 feet of you and that creature is willing, you may become the spell's target instead, provided you are a legal target for it. The spell's range is measured to the original target. If the spell calls for a saving throw, you make it with advantage. This spell cannot redirect an area spell or a spell that targets an object.''',
casting='1 reaction, taken when a spell targets a willing creature you can see',range_='30 feet',target='One willing creature targeted by a spell',duration='Instantaneous',activity='utility',chat='Redirect a single-target spell from a willing ally to yourself and gain advantage on its save.'),
S('Unclouded Sight','White',3,'Divination',
'''For the duration, you can see invisible creatures and objects within 30 feet of you as faint silver outlines, and you can see into the Ethereal Plane within the same range. You also have advantage on Intelligence (Investigation) checks made to disbelieve visual illusions. When you first see a creature or object concealed by illusion, you may immediately make the relevant check even if you would not normally receive one.''',
range_='Self',target='Self',duration='1 hour',activity='utility',chat='See invisible and ethereal creatures within 30 feet and gain advantage to pierce visual illusions.'),
S('Oath of Clarity','White',3,'Enchantment',
'''One willing creature you touch becomes anchored to a truth it speaks as part of the casting: a name, purpose, allegiance, or promise no longer than one sentence. For the duration, the target is immune to magical sleep and has advantage on saving throws against being charmed. If an effect would alter or erase a memory directly related to the spoken truth, the target automatically knows that its mind is being altered and may immediately repeat any saving throw against the effect.''',
range_='Touch',target='One willing creature',duration='8 hours',activity='utility',chat='Anchor a willing creature to a spoken truth, warding it against charm, magical sleep, and memory tampering.'),

S('Suppress Magic','White',4,'Abjuration',
'''Choose a point you can see within range. A 20-foot-radius sphere of dull silver interference appears there. While a magic item is in the sphere, its magical properties are suppressed unless it is an artifact. A creature carrying or wearing a magic item may make a Charisma saving throw for that item when it first enters the sphere or when the sphere appears around it; on a success, that item functions until the start of the creature's next turn, when it must save again. A suppressed magic weapon becomes nonmagical, charges cannot be spent, and passive bonuses cease, but no charges or attunements are lost. Sentient items have advantage on the save.''',
legacy=True,range_='90 feet',target='20-foot-radius sphere',duration='Concentration, up to 1 minute',concentration=True,activity='save',save='cha',chat='Temporarily suppress nonartifact magic items inside a 20-foot-radius sphere.'),
S('Lantern of Unasked Truths','White',4,'Divination',
'''For the duration, creatures you can see within 30 feet are limned by signs only you perceive. You know whether each creature is currently charmed, frightened, possessed, shapechanged by magic, or under an effect that directly alters its memory. You do not learn the source or exact nature of an effect. A creature protected by mind blank or a comparable 8th-level or higher effect appears unreadable.''',
range_='Self',target='Self (30-foot radius)',duration='Concentration, up to 10 minutes',concentration=True,activity='utility',chat='Read visible signs of charm, fear, possession, magical shapechanging, and memory alteration within 30 feet.'),
S('Sanctuary of Consent','White',4,'Enchantment',
'''You create a 15-foot-radius aura centered on yourself. A willing creature in the aura has advantage on saving throws against being charmed, frightened, possessed, or magically compelled to take an action. When such a creature enters the aura for the first time on a turn or starts its turn there, it may repeat one saving throw against one of those effects, ending that effect on a success. A creature that willingly accepted a magical charm or compulsion receives no benefit against that specific effect.''',
range_='Self (15-foot radius)',target='Willing creatures in the aura',duration='Concentration, up to 10 minutes',concentration=True,activity='utility',chat='Aura grants advantage and repeat saves against charm, fear, possession, and magical compulsion.'),

S('Aegis of Solinari','White',5,'Abjuration',
'''One creature you touch is wrapped in pale moonlight. For the duration it has advantage on saving throws against spells and resistance to damage caused by spells. The aegis ends early after it has prevented a total amount of damage equal to 40 + five times your spellcasting ability modifier.''',
range_='Touch',target='One creature',duration='Concentration, up to 10 minutes',concentration=True,activity='utility',chat='Target gains advantage on saves against spells and resistance to spell damage until the ward absorbs its limit.'),
S('Witness Chain','White',5,'Divination',
'''Choose up to six willing creatures you can see within range. For the duration, each target can use a bonus action to share its sight and hearing with any other target until the start of its next turn. While sharing senses this way, the observer is blind and deaf to its own surroundings. All targets also know the direction and approximate distance to every other target on the same plane while they are within 1 mile of one another.''',
range_='60 feet',target='Up to six willing creatures',duration='1 hour',components='V, S, M',material='six links of a silver chain worth at least 50 gp, not consumed',activity='utility',chat='Link up to six willing witnesses so they can share senses and track one another within 1 mile.'),
S('Silver Covenant','White',5,'Enchantment',
'''Up to six willing creatures join you in stating a single clear covenant no longer than twenty-five words. The covenant must describe conduct each participant can freely choose to follow and cannot require self-harm. For 8 hours, a creature that remains faithful to the covenant has advantage on Wisdom saving throws and gains 10 temporary hit points whenever it finishes a short rest. A participant that knowingly breaks the covenant loses these benefits for the remainder of the spell. No creature is compelled to obey.''',
casting='1 minute',range_='30 feet',target='Up to six willing creatures and yourself',duration='8 hours',components='V, S, M',material='a silver thread knotted once by each participant',activity='utility',chat='A voluntary covenant grants Wisdom-save advantage and restorative temporary hit points while each participant honors it.'),

S('Displace Memory','White',6,'Enchantment',
'''You touch two creatures, one of which must be willing to receive a memory. Choose a continuous memory of up to 1 hour from the other creature that was formed within the last ten years and that you can identify with reasonable specificity. An unwilling source makes a Wisdom saving throw. On a failure, the chosen memory is suppressed in the source and reproduced with perfect subjective detail in the recipient. For 24 hours, the source cannot consciously recall the displaced memory, while the recipient remembers it as something experienced by another mind. Remove curse, greater restoration, or comparable magic restores the source's access to the memory immediately. When the spell ends naturally, the source's memory returns and the recipient retains only an ordinary recollection of having experienced it.''',
legacy=True,casting='1 minute',range_='Touch',target='Two creatures',duration='24 hours',components='V, S, M',material='two clear quartz crystals worth 50 gp each, not consumed',activity='save',save='wis',chat='Temporarily move up to an hour of memory from one creature into a willing recipient.'),
S('Prism of Spellturning','White',6,'Abjuration',
'''When a spell targets only you, you raise a crystalline prism between yourself and the magic. If the triggering spell is 4th level or lower, it has no effect on you and instead targets its caster if the caster is a legal target and is within the spell's original range. If the spell is 5th level or higher, make an ability check using your spellcasting ability; the DC equals 10 + the spell's level. On a success, the spell is turned as above. On a failure, you still have advantage on any saving throw the triggering spell requires.''',
casting='1 reaction, taken when a spell targets only you',range_='Self',target='Self',duration='Instantaneous',components='V, S, M',material='a faceted quartz prism worth 250 gp, not consumed',activity='utility',chat='Reflect a single-target spell back at its caster; high-level spells require a spellcasting ability check.'),
S('Starless Answer','White',6,'Divination',
'''You meditate on one magical phenomenon, curse, artifact, planar breach, or spell effect that you have personally observed. Ask the GM up to three questions about its origin, governing rules, immediate danger, or a means by which it could be ended. The answers are truthful but may be symbolic when the requested fact is concealed from mortal knowledge. This spell cannot predict a creature's future choices and gives no answer about events hidden by a deity or an artifact specifically designed to defeat divination.''',
casting='1 minute',range_='Self',target='Self',duration='Instantaneous',components='V, S, M',material='a bowl of still water reflecting no direct light',ritual=True,activity='utility',chat='Ask up to three truthful questions about a magical phenomenon you have personally observed.'),

S('Greater Arcane Eye','White',7,'Divination',
'''You create an invisible magical sensor at a point on the same plane that you have seen before or can describe with enough precision to identify. The sensor has 60-foot truesight and can see into the Ethereal Plane within the same range. As a bonus action, you may move the sensor up to 60 feet. It can pass through an opening as small as 1 inch but not through solid matter. Distance from you does not end the spell, but the sensor cannot cross planar boundaries. A creature that can see invisible objects perceives the eye as a mote of silver crystal.''',
legacy=True,casting='10 minutes',range_='Same plane',target='One magical sensor',duration='Concentration, up to 1 hour',components='V, S, M',material='a crystal bat figurine worth 250 gp, not consumed',activity='utility',chat='Create a same-plane mobile sensor with 60-foot truesight and ethereal vision.'),
S("Song of Day's Clarity",'White',7,'Abjuration',
'''You touch a creature and place a clear, resonant ward upon its emotions. Until it completes one traversal of a magically warded grove, maze, or sanctuary, or until 24 hours pass, the creature is immune to magical effects that directly inflame passion, rage, despair, or euphoria. It also has advantage on saving throws against being charmed or frightened. Within the ancient grove of Losarcum, this protection automatically defeats the grove's supernatural manipulation of passion. The spell ends after the protected creature enters or leaves that grove once.''',
legacy=True,rarity='Tower Master secret',range_='Touch',target='One creature',duration='Up to 24 hours; special',activity='utility',chat='Protect one creature from magical emotional manipulation; automatically counters Losarcum\'s grove once.'),
S("Vision of Dusk's Eye",'White',7,'Abjuration',
'''You touch a creature and ward its continuity of memory. For 24 hours, the creature has advantage on saving throws against effects that erase, rewrite, or suppress memory, and it immediately knows when such an effect fails against it. Within the ancient grove of Istar, the ward automatically defeats the grove's supernatural command of forgetfulness. The spell ends after the protected creature enters or leaves that grove once.''',
legacy=True,rarity='Tower Master secret',range_='Touch',target='One creature',duration='Up to 24 hours; special',activity='utility',chat='Protect memory against magical alteration; automatically counters Istar\'s grove once.'),
S("Whisper of Dawn's Song",'White',7,'Abjuration',
'''You touch a creature and seal wakefulness behind its eyes. For 24 hours, the creature is immune to magical sleep and has advantage on saving throws against effects that would render it unconscious without reducing it to 0 hit points. Within the ancient grove of Daltigoth, the ward automatically defeats the grove's supernatural sleep. The spell ends after the protected creature enters or leaves that grove once.''',
legacy=True,rarity='Tower Master secret',range_='Touch',target='One creature',duration='Up to 24 hours; special',activity='utility',chat='Ward one creature against magical sleep; automatically counters Daltigoth\'s grove once.'),

S("Solinari's Interdiction",'White',8,'Abjuration',
'''A stationary 30-foot-radius sphere of silver law appears around a point you can see in range. When a hostile creature inside the sphere attempts to cast a spell of 5th level or lower, it must first succeed on an ability check using its spellcasting ability against your spell save DC. On a failure, the spell is not cast and no spell slot is expended, but the action, bonus action, or reaction used to cast it is lost. Spells of 6th level or higher are unaffected. Your spells and the spells of creatures you designate when you cast this spell are not impeded.''',
range_='120 feet',target='30-foot-radius sphere',duration='Concentration, up to 10 minutes',components='V, S, M',material='a silver disk engraved with Solinari worth 500 gp, not consumed',activity='utility',chat='A 30-foot zone forces hostile casters to pass a spellcasting check before casting spells of 5th level or lower.'),
S('Perfect Witness','White',8,'Divination',
'''Choose a point you can see within range. You and up to five willing creatures see and hear an exact sensory reconstruction of events that occurred within 30 feet of that point during any continuous 10-minute period within the last 30 days. The vision presents events as they physically occurred, not as witnesses remember them, but cannot reveal anything that was itself hidden from all ordinary senses at the time. Effects of 8th level or higher that ward against divination appear as blank intervals. The reconstruction lasts 10 minutes and cannot be altered or interacted with.''',
casting='1 minute',range_='60 feet',target='30-foot-radius area',duration='10 minutes',components='V, S, M',material='a flawless silver mirror worth 1,000 gp, not consumed',activity='utility',chat='Reconstruct an exact 10-minute sensory record from the last 30 days in a 30-foot area.'),

S('Consensus','White',9,'Divination',
'''You send a telepathic message of no more than twenty-five words to every non-renegade Wizard of High Sorcery on the same plane, either across all three Orders or only one Order you name. Each recipient immediately knows that the message comes through the authority of High Sorcery and may answer with one word. For 1 minute, you receive no individual replies; instead the magic continually summarizes the responses as counts grouped by identical answer. Sleeping recipients wake as the message arrives. Unconscious creatures and creatures outside the plane do not receive it. Ordinary wards against telepathy do not stop consensus, but a deity, artifact, or 9th-level spell specifically barring contact can do so.''',
legacy=True,rarity='Conclave secret',range_='Same plane',target='All qualifying Wizards of High Sorcery',duration='1 minute',activity='utility',chat='Send an Order-wide or Conclave-wide message and receive one-word responses as an aggregate tally.'),
S('Aegis of the Three Moons','White',9,'Abjuration',
'''Choose up to six creatures you can see in range. For 1 minute, each target has advantage on saving throws against spells, resistance to damage from spells, and cannot have its form, memories, or allegiance changed by magic unless it is willing. When a target succeeds on a saving throw against a spell that would deal half damage on a success, it instead takes no damage. The spell ends on a target that willingly accepts a contradictory magical transformation or compulsion.''',
range_='60 feet',target='Up to six creatures',duration='Concentration, up to 1 minute',components='V, S, M',material='three moonstones worth 500 gp each, not consumed',activity='utility',chat='Ward up to six creatures with broad spell resistance and protection from forced transformation, memory change, and allegiance change.'),
S('Crown of Free Will','White',9,'Enchantment',
'''One willing creature you touch becomes sovereign within its own mind for 24 hours. It is immune to being charmed, frightened, possessed, magically put to sleep, or compelled to act against its will. Its memories cannot be erased, implanted, or rewritten by magic. At the start of each of its turns, it may end one effect already affecting it that any of these immunities would have prevented. Crown of free will does not protect the target from ordinary persuasion, deception, pain, or consequences of choices it freely makes.''',
range_='Touch',target='One willing creature',duration='24 hours',components='V, S, M',material='a silver circlet worth 5,000 gp, not consumed',activity='utility',chat='For 24 hours, a willing creature becomes immune to magical coercion, possession, fear, sleep, and memory alteration.'),
]

# ---------------- RED ROBES ----------------
sp += [
S('Cleaning','Red',0,'Transmutation',
'''You remove ordinary dirt, grime, soot, dust, cobwebs, and similar filth from a 5-foot cube of solid surfaces within range. The spell does not purify poisoned food or water, remove disease, erase writing or paint, or repair permanent staining or damage.''',
legacy=True,range_='30 feet',target='One 5-foot cube of solid surfaces',duration='Instantaneous',activity='utility',chat='Instantly clean ordinary filth from a 5-foot cube of solid surfaces.'),
S("Conjurer's Chalk",'Red',0,'Conjuration',
'''You conjure a small stick of chalk, a charcoal nub, a quill with ordinary ink, or a similar simple marking tool in your empty hand. It lasts for 1 hour. Marks made by the tool are real but fade harmlessly when the spell ends. The conjured tool has no sale value and cannot be used as a material component.''',
range_='Self',target='One conjured marking tool',duration='1 hour',activity='utility',chat='Conjure a simple marking tool whose marks last for the spell\'s duration.'),
S('Borrowed Hue','Red',0,'Illusion',
'''Choose one willing creature or object no larger than a 5-foot cube within range. You alter its visible colors, patterns, and surface sheen for 1 hour. You cannot change its apparent shape, size, texture, or transparency, and the effect provides no bonus to checks made to impersonate a specific creature. A creature that touches the target automatically realizes the coloration is illusory if the illusion contradicts the physical surface.''',
range_='30 feet',target='One willing creature or object',duration='1 hour',activity='utility',chat='Alter colors and patterns on a willing creature or object for 1 hour.'),

S('Veil of the Ordinary','Red',1,'Illusion',
'''Choose up to three creatures or objects within range. For 1 hour, each target appears unremarkable and appropriate to its surroundings: fine clothing may seem workmanlike, a visible weapon may look like a tool of similar size, and a distinctive face becomes forgettably average without taking another person's identity. Physical interaction reveals the truth. A creature examining a target may use its action to make an Intelligence (Investigation) check against your spell save DC, seeing through the veil on a success.''',
range_='30 feet',target='Up to three creatures or objects',duration='1 hour',activity='utility',chat='Make up to three targets seem forgettably ordinary without impersonating specific people or objects.'),
S('Balanced Implement','Red',1,'Conjuration',
'''You conjure one nonmagical handheld tool, instrument, simple weapon, or piece of adventuring gear worth no more than 10 gp in an empty space within reach. It must fit within a 3-foot cube and cannot be ammunition, food, liquid, poison, a spell component with a listed cost, or an item normally consumed by use. It lasts for 1 hour, then vanishes. The object also vanishes if it is more than 100 feet from you for 1 minute.''',
range_='Self',target='One conjured object',duration='1 hour',activity='utility',chat='Conjure a mundane handheld tool or inexpensive piece of gear for 1 hour.'),

S('Mirror Passage','Red',2,'Illusion',
'''As a bonus action, you teleport up to 30 feet to an unoccupied space you can see and leave an illusory duplicate in the space you departed. The duplicate lasts until the start of your next turn. Until then, the first attack roll made against you is made with disadvantage as the attacker briefly confuses you with the duplicate; whether that attack hits or misses, the duplicate then disappears.''',
casting='1 bonus action',range_='Self',target='Self',duration='Until the start of your next turn',activity='utility',chat='Teleport 30 feet and leave a duplicate that imposes disadvantage on the first attack against you.'),
S('Equal Exchange','Red',2,'Transmutation',
'''Touch two willing creatures. Choose one condition affecting the first creature from blinded, deafened, or poisoned. That condition ends on the first creature and begins on the second for the remaining duration of the original effect, to a maximum of 1 minute. If the original condition was permanent, the transferred condition lasts 1 minute. This spell cannot transfer a condition caused by a creature being at 0 hit points, petrification, exhaustion, or disease.''',
range_='Touch',target='Two willing creatures',duration='Instantaneous; transferred condition up to 1 minute',activity='utility',chat='Transfer blinded, deafened, or poisoned from one willing creature to another.'),

S('Arcane Staff, Lesser','Red',3,'Transmutation',
'''You prepare a nonmagical quarterstaff to hold a small reserve of structured magic. During the casting, you may cast one 1st- or 2nd-level spell into the staff, expending its spell slot and material components as normal. The stored spell has no immediate effect. Until you finish your next long rest, you may cast the stored spell from the staff without expending another spell slot, using your spellcasting ability and the spell's normal casting time. Only you can release the stored spell. You can have only one arcane staff of any kind at a time; creating another ends the previous storage.''',
legacy=True,casting='10 minutes',range_='Touch',target='One nonmagical quarterstaff',duration='Until your next long rest or discharged',components='V, S, M',material='the quarterstaff that stores the spell',ritual=True,activity='utility',chat='Bank one 1st- or 2nd-level spell in a quarterstaff until your next long rest.'),
S('Shape of the Beasts','Red',3,'Transmutation',
'''You transform one willing humanoid you touch into a Beast of challenge rating 1 or lower that you have seen. The target retains its Intelligence, Wisdom, Charisma, alignment, personality, and memories, but otherwise uses the beast's game statistics. It cannot cast spells or speak unless the form can speak. When the form is reduced to 0 hit points, the spell ends and excess damage carries over. The spell also ends if you lose concentration. Unlike polymorph, the target does not gain the beast's mental ability scores.''',
legacy=True,range_='Touch',target='One willing humanoid',duration='Concentration, up to 1 hour',components='V, S, M',material='fur, a feather, or a scale from the chosen kind of beast',concentration=True,activity='utility',chat='Transform a willing humanoid into a CR 1 or lower Beast while retaining its mental abilities.'),
S('Stone Guardian','Red',3,'Conjuration',
'''You create a Medium stone guardian in an unoccupied space on the ground within range. It has AC 16, 30 hit points, speed 25 feet, immunity to poison and psychic damage, and uses your saving throw bonuses when it makes a save. It acts immediately after your turn. On your turn you may use a bonus action to command it to move and make one Stone Fist attack against a creature within 5 feet, using your spell attack modifier to hit and dealing 1d8 + your spellcasting ability modifier bludgeoning damage. If not commanded, it takes the Dodge action. The guardian crumbles when reduced to 0 hit points or when the spell ends.''',
legacy=True,casting='1 action',range_='60 feet',target='One Medium stone guardian',duration='Concentration, up to 1 hour',components='V, S, M',material='a small clay warrior',concentration=True,activity='utility',chat='Create a commandable AC 16, 30 HP stone guardian with a spell-attack Stone Fist.'),

S('Awaken the Mind','Red',4,'Transmutation',
'''You touch a Beast with Intelligence 3 or lower. For 1 hour, its Intelligence becomes 10 if lower, it can speak one language you know, and it gains a +2 bonus to Wisdom and Charisma checks and saving throws. The creature is not charmed, but it begins the spell friendly toward you unless you or your allies have harmed it within the last 24 hours. The spell grants no class features, spellcasting, or special knowledge beyond what the creature has experienced.''',
legacy=True,range_='Touch',target='One Beast with Intelligence 3 or lower',duration='1 hour',components='V, S, M',material='a diamond worth 250 gp, not consumed',activity='utility',chat='Temporarily raise a Beast\'s intellect, speech, and social awareness without charming it.'),
S('Equilibrium Gate','Red',4,'Conjuration',
'''Create two linked, vertical portals on solid surfaces you can see within 90 feet of you. Each portal is a 5-foot-diameter circle. A creature or object entering one exits the other in the nearest unoccupied space, preserving direction and momentum. The portals are two-way and can be used by any creature. If either portal's surface is destroyed or moved more than 90 feet from the other, the spell ends.''',
range_='90 feet',target='Two linked 5-foot portals',duration='Concentration, up to 1 minute',concentration=True,activity='utility',chat='Create two public, two-way portals up to 90 feet apart for 1 minute.'),
S('Phantom Architecture','Red',4,'Illusion',
'''You create illusory architecture occupying up to six contiguous 10-foot cubes within range: walls, stairs, platforms, bridges, arches, doors, or similar structures. The construction appears real and can conceal creatures, but it cannot support weight or block physical movement. A creature that uses its action to examine the architecture may make an Intelligence (Investigation) check against your spell save DC, seeing through it on a success. A creature that physically passes through a solid-looking part of the illusion automatically sees through that part thereafter.''',
range_='120 feet',target='Up to six contiguous 10-foot cubes',duration='Concentration, up to 1 hour',concentration=True,activity='utility',chat='Build a large, convincing but intangible illusory structure.'),

S('Arcane Staff','Red',5,'Transmutation',
'''You prepare a nonmagical quarterstaff as a reservoir. During the casting, you may cast spells of 4th level or lower into the staff, expending slots and material components normally, until the total levels stored equal 5. Cantrips count as 1 level for this purpose. The stored spells have no immediate effect. Until your next long rest, you may cast any stored spell from the staff without spending another slot, using your spellcasting ability and the spell's normal casting time; each stored spell disappears after use. Only you can release the spells. You can have only one arcane staff of any kind at a time.''',
legacy=True,casting='10 minutes',range_='Touch',target='One nonmagical quarterstaff',duration='Until your next long rest or discharged',components='V, S, M',material='the quarterstaff that stores the spells',ritual=True,activity='utility',chat='Bank up to 5 total spell levels, each spell 4th level or lower, in a quarterstaff until your next long rest.'),
S("Giant's Guise",'Red',5,'Illusion',
'''One creature in range appears to swell into a towering giant of the same general form, filling a Huge visual space without actually changing size or reach. The target has advantage on Charisma (Intimidation) checks. The first time each turn the target damages a creature that can see the guise, that creature must make a Wisdom saving throw. On a failed save it is frightened of the target until the end of its next turn. A creature that succeeds on this save sees through the guise and is immune to its fear for the rest of the spell.''',
legacy=True,range_='60 feet',target='One creature',duration='Concentration, up to 1 minute',components='V, S, M',material='a braid of giant or ogre hair',concentration=True,activity='save',save='wis',chat='Make one creature appear Huge; its attacks can frighten observers that fail Wisdom saves.'),
S('Conjure Counterpart','Red',5,'Conjuration',
'''Choose one nonmagical object you can see within range that fits inside a 10-foot cube. A perfect duplicate appears in an unoccupied space within 10 feet of the original. The duplicate has the same mundane properties, weight, and apparent wear, but no magical value and no market value. It cannot serve as a costly material component, be consumed to create another permanent object, or duplicate a living creature. The duplicate vanishes when the spell ends.''',
range_='60 feet',target='One nonmagical object',duration='1 hour',components='V, S, M',material='a red wax seal worth 25 gp, not consumed',activity='utility',chat='Create a temporary mundane duplicate of one nonmagical object that fits inside a 10-foot cube.'),

S("Wayreth's Moving Door",'Red',6,'Conjuration',
'''You create two linked doorways on solid surfaces you have seen within the last 24 hours, both on the same plane and no more than 1 mile apart. Each doorway is up to 8 feet tall and 4 feet wide. A creature can pass through either doorway to emerge from the other by spending 5 feet of movement. The doors are visible from both sides and can be used by any creature. If either endpoint is warded against teleportation, the spell fails.''',
casting='1 minute',range_='1 mile',target='Two linked doorways',duration='Concentration, up to 10 minutes',components='V, S, M',material='two matching brass keys worth 100 gp each, not consumed',concentration=True,activity='utility',chat='Create two public doorways linking locations up to 1 mile apart on the same plane.'),
S('Mirror Labyrinth','Red',6,'Illusion',
'''A 30-foot cube you can see becomes an impossible maze of reflections. Each creature of your choice that enters the cube for the first time on a turn or starts its turn there must make an Intelligence saving throw. On a failed save, its speed is halved, it cannot take reactions, and attacks it makes against creatures more than 5 feet away are made with disadvantage until the start of its next turn. A creature that fails by 5 or more also cannot distinguish exits and must spend 10 feet of movement for every 5 feet it moves inside the cube that turn. Truesight ignores these effects.''',
range_='120 feet',target='30-foot cube',duration='Concentration, up to 10 minutes',concentration=True,activity='save',save='int',chat='Create a 30-foot illusion maze that slows, disorients, and isolates creatures failing Intelligence saves.'),
S('Balanced Transformation','Red',6,'Transmutation',
'''Choose up to six willing creatures in range. For each target choose one adaptation: a flying speed of 40 feet; a swimming speed of 60 feet and the ability to breathe water; a climbing speed equal to walking speed plus advantage on checks to climb; or +10 feet to walking speed and advantage on Dexterity saving throws. A target may change its chosen adaptation as a bonus action on its turn. The spell makes only functional changes—wings, gills, gripping pads, or altered musculature as appropriate—and ends if you lose concentration.''',
range_='60 feet',target='Up to six willing creatures',duration='Concentration, up to 1 hour',concentration=True,activity='utility',chat='Adapt up to six allies with flight, swimming, climbing, or enhanced land movement.'),

S('Arcane Staff, Greater','Red',7,'Transmutation',
'''You prepare a nonmagical quarterstaff as a major reservoir. During the casting, you may cast spells of 6th level or lower into the staff, expending slots and material components normally, until the total levels stored equal 9. Cantrips count as 1 level. The stored spells have no immediate effect. For 7 days, you may cast any stored spell from the staff without spending another slot, using your spellcasting ability and the spell's normal casting time; each stored spell disappears after use. Only you can release the spells. You can have only one arcane staff of any kind at a time, and a staff cannot retain spells across a long rest if you no longer possess it.''',
legacy=True,casting='10 minutes',range_='Touch',target='One nonmagical quarterstaff',duration='7 days or until discharged',components='V, S, M',material='a masterwork quarterstaff inlaid with 500 gp of silver and moonstone, not consumed',ritual=True,activity='utility',chat='Bank up to 9 total spell levels, each spell 6th level or lower, in a quarterstaff for up to 7 days.'),
S('Mindspin','Red',7,'Illusion',
'''Choose one creature you can see within range. It must make a Wisdom saving throw. On a failure, it falls unconscious and enters a waking nightmare only you can shape. While you maintain concentration, the target experiences a subjective hour for every minute that passes outside. At the end of each of its turns it repeats the save, waking on a success. Each time it fails a repeat save, choose one: the target takes 4d8 psychic damage; it becomes frightened of one creature you name for 1 minute after waking; or it loses its reaction until the end of its first turn after waking. Damage taken from this spell cannot reduce the target below 1 hit point. If the target takes damage from another source, it immediately repeats the saving throw with advantage.''',
legacy=True,casting='1 action',range_='60 feet',target='One creature',duration='Concentration, up to 1 minute',components='V, S, M',material='a polished crystal sphere worth 500 gp in purple cloth, not consumed',concentration=True,activity='save',save='wis',damage='4d8',dtype='psychic',onsave='none',chat='Trap one creature in a waking nightmare; failed repeat saves can inflict psychic harm or lingering fear.'),
S('Timeheal','Red',7,'Transmutation',
'''Touch one willing living creature and restore its body to the state it was in at the end of its previous turn. Its hit points, physical position, and nonmagical bodily conditions return to what they were then, ending conditions or injuries gained since that moment and restoring hit points lost since then. This spell does not restore expended spell slots, charges, class features, Hit Dice, consumed items, or concentration, and it cannot return a dead creature to life. A creature can benefit from timeheal only once between long rests.''',
legacy=True,casting='1 action',range_='Touch',target='One willing living creature',duration='Instantaneous',components='V, S, M',material='an hourglass containing powdered black pearl worth 500 gp, consumed',activity='utility',chat='Restore a willing living creature\'s body and hit points to their state at the end of its previous turn.'),
S('Touch of Guiding Light','Red',7,'Transmutation',
'''You touch one creature and attune it to the living geometry of the Forest of Wayreth. For 24 hours, while on the same plane as the Tower, the target always knows the direction of the nearest path by which the Forest is willing to admit it. The sense works through the grove's ordinary misdirection and moving geography but cannot overcome a deliberate refusal by the Tower or Forest. Once the target enters or leaves the Forest of Wayreth using this guidance, the spell ends.''',
legacy=True,rarity='Tower Master secret',range_='Touch',target='One creature',duration='Up to 24 hours; special',activity='utility',chat='Attune a creature to the Forest of Wayreth so it can find an admitted path to or from the Tower once.'),
S("Lunitari's Exchange",'Red',7,'Conjuration',
'''Choose up to six willing creatures you can see within 120 feet. Each target may exchange places with another willing target of the same size category or one size category different. All exchanges occur simultaneously, and each creature appears in the other's space without provoking opportunity attacks. After the exchange, each target may immediately move up to 10 feet without provoking opportunity attacks. A creature cannot be exchanged into a space it could not physically occupy.''',
range_='120 feet',target='Up to six willing creatures',duration='Instantaneous',activity='utility',chat='Simultaneously swap the positions of up to three pairs of willing creatures, then let each shift 10 feet safely.'),

S('Palace Between Moments','Red',8,'Conjuration',
'''You open a door into a furnished extradimensional refuge containing up to ten rooms arranged as you choose when you cast the spell. The palace can hold up to fifty Medium creatures. Time inside passes at half the rate of time outside: for every 2 minutes spent inside, only 1 minute passes on the plane from which the door was opened. A creature that finishes a short rest inside still requires the full normal rest duration as measured inside. Time dilation never reduces the time required on the originating plane for a long rest or for any feature, item, or spell to recharge. The door remains at its original location, can be opened or closed from either side, and is visible to creatures that can see invisible objects. When the spell ends, occupants are expelled harmlessly into the nearest open spaces.''',
casting='1 minute',range_='10 feet',target='One extradimensional doorway',duration='8 hours',components='V, S, M',material='a red crystal key worth 1,000 gp, not consumed',activity='utility',chat='Create a ten-room extradimensional refuge where subjective time passes twice as fast as outside.'),
S('Mirror of Possible Selves','Red',8,'Illusion',
'''Three illusory versions of you appear in unoccupied spaces within 30 feet. They move when you move and can each move up to 30 feet as a bonus action you take, passing through creatures but not solid objects. Until the spell ends, when you cast a spell with a range other than Self, you may measure its range and determine line of sight from your space or from one duplicate. When a creature targets you with an attack, roll a d4: on a 2–4, it targets a duplicate instead and the duplicate vanishes. A creature with truesight ignores the duplicates. The spell ends when all duplicates are gone.''',
range_='Self',target='Self',duration='Concentration, up to 1 minute',concentration=True,activity='utility',chat='Create three mobile possible selves that can originate your spells and absorb attacks.'),

S('Mindspin, Greater','Red',9,'Illusion',
'''Choose up to six creatures you can see within range. Each must make a Wisdom saving throw. A creature that fails falls unconscious and joins a shared nightmare shaped by you. While you concentrate, each affected creature repeats the save at the end of its turn. On a failed repeat save it takes 6d8 psychic damage and you may make it perceive any other affected creature as an enemy until the end of its next turn after waking. This damage cannot reduce a creature below 1 hit point. A creature wakes on a successful save, if you release it, or if it takes damage from a source other than this spell, in which case it immediately repeats the save with advantage. Creatures that remain trapped for the full minute are frightened of you for 1 hour after waking.''',
legacy=True,range_='90 feet',target='Up to six creatures',duration='Concentration, up to 1 minute',components='V, S, M',material='a crystal sphere worth 2,500 gp in purple velvet, not consumed',concentration=True,activity='save',save='wis',damage='6d8',dtype='psychic',onsave='none',chat='Trap up to six creatures in one shared nightmare; repeated failures deal psychic damage and distort friend from foe.'),
S('Timereaver','Red',9,'Transmutation',
'''You open a one-way portal through the River of Time. Choose a destination on the same plane and a point in time no more than 100 years per caster level into the past or 10 years per caster level into the future. Up to six willing creatures may pass through before the portal closes. The spell cannot by itself create a return route. Before casting, the GM determines whether the chosen era is reachable in the campaign's cosmology and may require an Intelligence (Arcana) check to arrive precisely when the destination is uncertain. The High God's prohibition against altering fixed history remains in force in Krynn; creatures touched by Chaos may create exceptions at the GM's discretion. Because this spell can restructure a campaign, it is normally known only to a Master of a Tower.''',
legacy=True,rarity='Tower Master secret',casting='1 hour',range_='30 feet',target='One one-way temporal portal',duration='1 minute',components='V, S, M',material='a runic circle of rare reagents worth at least 25,000 gp, consumed, and a major magical focus approved by the GM',activity='utility',chat='Open a one-way portal to another time on the same plane for up to six willing travelers.'),
S('Travel the Paths of the Mind','Red',9,'Transmutation',
'''You touch one creature and open its remembered past as an explorable demiplane. An unwilling target makes a Wisdom saving throw. On a failure, you and up to five willing creatures within 30 feet may enter one continuous memory chosen by the target or identified by you. The memory may be up to 1 hour long and no more than 100 years old. Inside it, travelers can observe and move through events, but cannot change what actually happened. Creatures and hazards remembered by the target can harm travelers; damage and expended resources remain when they leave. A traveler reduced to 0 hit points is immediately ejected, unconscious and stable. Nothing can normally be removed from a memory, though wish may create an exception. Outside the memory, only 1 minute passes for each hour experienced within.''',
legacy=True,casting='10 minutes',range_='Touch',target='One creature plus up to five travelers',duration='Up to 1 hour experienced time',components='V, S, M',material='a silver mirror inlaid with diamond dust worth 5,000 gp, not consumed',activity='save',save='wis',chat='Enter and explore one creature\'s remembered past as a dangerous but non-alterable demiplane.'),
S('Convergence of Three Roads','Red',9,'Conjuration',
'''Choose three locations on the same plane that you have personally visited. A 10-foot-high, 5-foot-wide doorway appears at each location for 10 minutes. Each doorway shows the other two destinations as separate shimmering panels; a creature entering chooses which destination it exits. The network transports creatures and carried objects but not unattended objects larger than a 10-foot cube. A location protected against teleportation cannot serve as an endpoint, and the spell fails before any door opens if one endpoint is invalid.''',
casting='1 minute',range_='Same plane',target='Three linked doorways',duration='10 minutes',components='V, S, M',material='three matched red-gold keys worth 1,000 gp each, not consumed',activity='utility',chat='Create a three-way same-plane portal network among three locations you have personally visited.'),
]

# ---------------- BLACK ROBES ----------------
sp += [
S("Nuitari's Hook",'Black',0,'Enchantment',
'''One creature you can see within range must make a Wisdom saving throw. On a failed save, it takes 1d6 psychic damage and cannot willingly move farther away from you until the start of your next turn. This restriction does not prevent forced movement. The damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).''',
range_='60 feet',target='One creature',duration='Until the start of your next turn',activity='save',save='wis',damage='1d6',dtype='psychic',onsave='none',scale='1d6',chat='Psychic damage and, on a failed Wisdom save, the target cannot willingly move farther from you for one round.'),
S('Cinder Lash','Black',0,'Evocation',
'''A black-red filament of flame lashes at one creature in range. Make a ranged spell attack. On a hit, the target takes 1d6 fire damage, and if it is Large or smaller you may pull it up to 5 feet toward you. The damage increases by 1d6 at 5th level (2d6), 11th level (3d6), and 17th level (4d6).''',
range_='60 feet',target='One creature',duration='Instantaneous',activity='attack',attack='ranged',damage='1d6',dtype='fire',scale='1d6',chat='Ranged spell attack for fire damage; may pull a Large or smaller target 5 feet.'),
S('Grave Whisper','Black',0,'Necromancy',
'''One creature you can see within range must make a Constitution saving throw. On a failed save it takes 1d6 necrotic damage and cannot regain hit points until the start of your next turn. The damage increases by 1d6 at 5th level (2d6), 11th level (3d6), and 17th level (4d6).''',
range_='60 feet',target='One creature',duration='Until the start of your next turn',activity='save',save='con',damage='1d6',dtype='necrotic',onsave='none',scale='1d6',chat='Necrotic damage and prevent healing until the start of your next turn on a failed Constitution save.'),

S('Obedient Step','Black',1,'Enchantment',
'''One creature you can see within range must make a Wisdom saving throw. On a failed save, it must immediately use its reaction, if available, to move up to half its speed toward a point you choose that it can see. This movement cannot force the creature into obviously lethal terrain, but it can provoke opportunity attacks. A creature immune to being charmed has advantage on the save.''',
range_='60 feet',target='One creature',duration='Instantaneous',activity='save',save='wis',chat='Force a failed target to spend its reaction moving up to half speed toward a point you choose.'),
S('Blackflame Dart','Black',1,'Evocation',
'''Make a ranged spell attack against one creature in range. On a hit, the target takes 2d8 fire damage and cannot regain hit points until the start of your next turn. Black flame gives off dim violet light but does not ignite unattended objects. At Higher Levels: the damage increases by 1d8 for each slot level above 1st.''',
range_='90 feet',target='One creature',duration='Instantaneous',activity='attack',attack='ranged',damage='2d8',dtype='fire',scale='1d8',chat='Ranged spell attack for 2d8 fire damage and briefly block healing.'),
S('Borrowed Vitality','Black',1,'Necromancy',
'''One creature you touch must make a Constitution saving throw. On a failed save it takes 2d6 necrotic damage, or half as much on a success. You gain temporary hit points equal to half the necrotic damage actually dealt. At Higher Levels: the damage increases by 1d6 for each slot level above 1st.''',
range_='Touch',target='One creature',duration='Instantaneous',activity='save',save='con',damage='2d6',dtype='necrotic',onsave='half',scale='1d6',chat='Drain 2d6 necrotic damage and gain temporary hit points equal to half the damage dealt.'),

S('Disarm','Black',2,'Enchantment',
'''Choose one creature you can see within range. It must make a Wisdom saving throw. On a failed save, it immediately drops one object it is holding of your choice. Until the spell ends, whenever it attempts to pick up or draw a weapon, it must repeat the saving throw; on a failure it cannot take hold of that weapon during the current turn. The target repeats the saving throw at the end of each of its turns, ending the spell on a success.''',
legacy=True,range_='60 feet',target='One creature',duration='Concentration, up to 1 minute',concentration=True,activity='save',save='wis',chat='Make a creature drop a held object and resist taking hold of weapons until it saves.'),
S('Feign Life','Black',2,'Necromancy',
'''You touch a corpse or a corporeal undead creature. For 24 hours, the target displays convincing signs of ordinary life: warmth, breath, pulse, eye moisture, and healthy circulation. This does not heal damage, halt decay, restore missing tissue, change creature type, or suppress an undead creature's traits. A creature physically examining the target may make a Wisdom (Medicine) check against your spell save DC; on a success it realizes the signs of life are magically false. The spell does not fool magic that specifically detects undead.''',
legacy=True,range_='Touch',target='One corpse or corporeal undead creature',duration='24 hours',activity='utility',chat='Give a corpse or corporeal undead convincing signs of ordinary life for 24 hours.'),
S('Umbral Burst','Black',2,'Evocation',
'''A knot of starless heat erupts at a point you can see within range. Each creature in a 10-foot-radius sphere must make a Dexterity saving throw, taking 3d6 fire damage on a failed save, or half as much on a success. Until the start of your next turn, the sphere is filled with dim, smoky darkness that lightly obscures the area. At Higher Levels: the damage increases by 1d6 for each slot level above 2nd.''',
range_='90 feet',target='10-foot-radius sphere',duration='Instantaneous; smoke until your next turn',activity='save',save='dex',damage='3d6',dtype='fire',onsave='half',scale='1d6',chat='10-foot burst for 3d6 fire damage, leaving brief smoky dimness.'),
S('Blood Scent','Black',2,'Necromancy',
'''For the duration, you know the direction of every living creature within 60 feet that is missing any hit points, provided it is not behind 1 foot of stone, 1 inch of common metal, or a thin sheet of lead. You do not learn identity, exact distance, or current hit points. A creature without blood or a comparable vital fluid is not detected. As an action, you may focus on one direction and learn whether the nearest wounded creature that way is above or below half its hit point maximum.''',
range_='Self (60-foot radius)',target='Self',duration='Concentration, up to 10 minutes',concentration=True,activity='utility',chat='Sense the direction of wounded living creatures within 60 feet and estimate whether the nearest is below half health.'),

S('Sable Edict','Black',3,'Enchantment',
'''Choose one creature you can see within range and speak a one-word edict: Approach, Flee, Kneel, Release, or Silence. The target must make a Wisdom saving throw. On a failed save, it follows the edict on its next turn as completely as it safely can and cannot take reactions until that turn ends. At the end of that turn it repeats the save; on a failure it obeys again on its next turn. The spell ends on a success. The edict cannot require the target to move into obviously lethal terrain or directly harm itself.''',
range_='60 feet',target='One creature',duration='Concentration, up to 1 minute',concentration=True,activity='save',save='wis',chat='Issue a repeating one-word command; the target saves each turn to break free.'),
S('Chain of Embers','Black',3,'Evocation',
'''Make a ranged spell attack against one creature in range. On a hit, it takes 4d8 fire damage. You may then choose a second creature within 20 feet of the first; that creature must make a Dexterity saving throw, taking 2d8 fire damage on a failed save, or half as much on a success. At Higher Levels: both damage amounts increase by 1d8 for each slot level above 3rd.''',
range_='120 feet',target='One creature, then a second within 20 feet',duration='Instantaneous',activity='attack',attack='ranged',damage='4d8',dtype='fire',scale='1d8',chat='Strike one target for 4d8 fire and leap lesser flame to a nearby second target.'),
S('Harvest the Fallen','Black',3,'Necromancy',
'''When a creature you can see within range is reduced to 0 hit points, you draw off the departing vitality. You gain 3d8 + your spellcasting ability modifier temporary hit points. If the creature died rather than merely fell unconscious, you may instead regain hit points equal to half that amount. Undead and constructs cannot trigger this spell. At Higher Levels: the temporary hit points increase by 1d8 for each slot level above 3rd.''',
casting='1 reaction, taken when a creature within range is reduced to 0 hit points',range_='30 feet',target='Self',duration='Instantaneous',activity='heal',healing='3d8 + @mod',scale='1d8',chat='Harvest a falling living creature to gain 3d8 + spellcasting modifier temporary hit points.'),

S('Life Transfer','Black',4,'Necromancy',
'''Make a melee spell attack against one living creature. On a hit, the target takes 6d6 necrotic damage and you gain temporary hit points equal to the damage dealt. Before the end of your next turn, you may use a bonus action to touch another living creature and expend any number of these temporary hit points, causing that creature to regain the same number of hit points. Temporary hit points from this spell vanish at the end of your next turn. If you transfer none, you may instead regain hit points equal to half the temporary hit points that vanish. At Higher Levels: the damage increases by 1d6 for each slot level above 4th.''',
legacy=True,range_='Touch',target='One living creature; then optionally another',duration='Instantaneous; reserve until end of next turn',activity='attack',attack='melee',damage='6d6',dtype='necrotic',scale='1d6',chat='Drain 6d6 life into a temporary reserve, then transfer that reserve as healing to another creature.'),
S("Tyrant's Brand",'Black',4,'Enchantment',
'''One creature you can see within range must make a Wisdom saving throw. On a failure, a black sigil appears above it for the duration. The branded creature has disadvantage on attack rolls against creatures other than you while it can see you. The first time on each of its turns it deals damage to another creature, it takes 3d6 psychic damage. It repeats the saving throw at the end of each turn, ending the spell on a success.''',
range_='60 feet',target='One creature',duration='Concentration, up to 1 minute',concentration=True,activity='save',save='wis',damage='3d6',dtype='psychic',onsave='none',chat='Brand a creature so attacks against others are hindered and harming them causes psychic backlash.'),
S('Black Moon Detonation','Black',4,'Evocation',
'''Choose a point you can see within range. A silent black flare bursts in a 20-foot-radius sphere. Each creature in the area must make a Constitution saving throw, taking 6d6 necrotic damage on a failed save, or half as much on a success. Nonmagical bright light in the area is extinguished, and magical light created by a spell of 3rd level or lower is dispelled. At Higher Levels: the damage increases by 1d6 for each slot level above 4th.''',
range_='120 feet',target='20-foot-radius sphere',duration='Instantaneous',activity='save',save='con',damage='6d6',dtype='necrotic',onsave='half',scale='1d6',chat='20-foot burst for 6d6 necrotic damage that snuffs weak magical and mundane light.'),

S('Curse the Magi','Black',5,'Necromancy',
'''Choose one creature you can see within range that can cast at least one spell. It must make an Intelligence saving throw. On a failure, it is cursed for the duration. Whenever it attempts to cast a spell, it must first make a Constitution saving throw against your spell save DC. On a failure, the spell fails, its spell slot is expended, and the creature takes 3d6 necrotic damage. On a success, the spell is cast normally. The target repeats the Intelligence saving throw at the end of each of its turns, ending the curse on a success. Remove curse also ends the spell.''',
legacy=True,range_='60 feet',target='One spellcasting creature',duration='Concentration, up to 1 minute',components='V, S, M',material='a small iron mask with a closed mouth',concentration=True,activity='save',save='int',damage='3d6',dtype='necrotic',onsave='none',chat='Curse a spellcaster so every spell risks failure, slot loss, and necrotic backlash.'),
S('Transfer Essence','Black',5,'Necromancy',
'''Choose two creatures in range that possess spell slots. One is the donor and one the recipient. An unwilling donor makes a Constitution saving throw. On a failure, choose one unexpended spell slot the donor possesses of 5th level or lower; the donor expends it and takes 2d6 necrotic damage per level of the slot. The recipient regains one expended spell slot of the same level or lower. A creature cannot lose or regain a spell slot from transfer essence again until it finishes a long rest. The spell fails if the donor has no suitable unexpended slot or the recipient has no suitable expended slot.''',
legacy=True,range_='30 feet',target='Two spellcasting creatures',duration='Instantaneous',components='V, S, M',material='a quartz prism on a silver chain worth 100 gp, not consumed',activity='save',save='con',chat='Move one expended spell slot of 5th level or lower from a donor to a recipient, harming an unwilling donor.'),
S('Crown of Submission','Black',5,'Enchantment',
'''One humanoid you can see within range must make a Wisdom saving throw. On a failed save it is charmed by you for the duration. While charmed, you may use a bonus action on each of your turns to issue a simple verbal command that it follows on its next turn to the best of its ability. If the creature takes damage from you or your allies, it repeats the saving throw, ending the spell on a success. A command that is directly suicidal instead allows an immediate repeat save before the creature acts.''',
range_='60 feet',target='One humanoid',duration='Concentration, up to 1 minute',concentration=True,activity='save',save='wis',chat='Dominate a humanoid through repeated commands, with new saves when it is harmed or ordered to self-destruction.'),
S('Starless Lance','Black',5,'Evocation',
'''A line of compressed black fire 100 feet long and 5 feet wide erupts from you. Each creature in the line must make a Dexterity saving throw, taking 8d6 fire damage on a failed save, or half as much on a success. A creature that fails the save cannot regain hit points until the start of your next turn. At Higher Levels: the damage increases by 1d6 for each slot level above 5th.''',
range_='Self (100-foot line)',target='100-foot-long, 5-foot-wide line',duration='Instantaneous',activity='save',save='dex',damage='8d6',dtype='fire',onsave='half',scale='1d6',chat='100-foot line for 8d6 fire damage; failed saves briefly prevent healing.'),

S("Raistlin's Wheel of Flame",'Black',6,'Evocation',
'''A stationary wheel of multihued flame blooms in a 30-foot-radius, 20-foot-high cylinder centered on a point you can see. When a creature other than you enters the area for the first time on a turn or starts its turn there, it makes a Dexterity saving throw. It takes 4d6 fire damage on a failed save, or half as much on a success. At the start of each of your turns while you maintain concentration, the damage increases by 1d6, to a maximum of 8d6. You are immune to the wheel's damage. A creature can take this damage only once per turn.''',
legacy=True,range_='120 feet',target='30-foot-radius, 20-foot-high cylinder',duration='Concentration, up to 1 minute',components='V, S, M',material='a fire opal set in a gold ring worth 250 gp, not consumed',concentration=True,activity='save',save='dex',damage='4d6',dtype='fire',onsave='half',chat='A stationary 30-foot wheel starts at 4d6 fire and grows each round to 8d6; you are immune.'),
S("Death's Due",'Black',6,'Necromancy',
'''Choose one creature you can see within range. It must make a Constitution saving throw. On a failed save, it is marked for the duration. Once per round when the marked creature takes damage, you may use your reaction to deal an additional 3d8 necrotic damage to it and regain hit points equal to half the extra damage dealt. The target repeats the saving throw at the end of each of its turns, ending the spell on a success.''',
range_='90 feet',target='One creature',duration='Concentration, up to 1 minute',concentration=True,activity='save',save='con',damage='3d8',dtype='necrotic',onsave='none',chat='Mark a creature so once per round you can react to its wounds with 3d8 extra necrotic damage and life drain.'),
S('Silence the Defiant','Black',6,'Enchantment',
'''Choose up to six creatures you can see within range. Each must make a Wisdom saving throw. On a failed save, a creature cannot speak above a whisper and cannot provide verbal components for spells for the duration. An affected creature repeats the saving throw at the end of each of its turns, ending the effect on itself on a success. A creature that cannot speak is unaffected.''',
range_='60 feet',target='Up to six creatures',duration='Concentration, up to 1 minute',concentration=True,activity='save',save='wis',chat='Up to six failed targets cannot speak or provide verbal spell components until they save.'),

S("Kiss of Night's Guardian",'Black',7,'Necromancy',
'''You touch one living creature and mark its brow with an invisible seal recognized by the undead guardians of the Shoikan Grove. For 24 hours, the creature has advantage on saving throws against fear caused by undead. Within the Shoikan Grove, undead bound to the Grove treat the bearer as protected by the Master and will not willingly attack it unless it attacks them first or the Master revokes the protection. The spell ends after the bearer completes one passage through the Grove, entering or leaving.''',
legacy=True,rarity='Tower Master secret',range_='Touch',target='One living creature',duration='Up to 24 hours; special',activity='utility',chat='Mark one creature for a single protected passage through the Shoikan Grove and bolster it against undead fear.'),
S('Soul Chain','Black',7,'Necromancy',
'''One creature you can see within range must make a Charisma saving throw. On a failed save, a black chain visible only in magical light binds its spirit for the duration. The target cannot regain hit points. If it dies while bound, its soul is trapped in a black gem that appears in your hand, provided you are on the same plane. While trapped, the creature cannot be returned to life. The gem lasts for 24 hours, until destroyed (AC 20, 20 hit points, immune poison and psychic), or until you release the soul as an action, after which normal resurrection is possible.''',
range_='60 feet',target='One creature',duration='Concentration, up to 1 minute; soul gem up to 24 hours',components='V, S, M',material='a black sapphire worth 1,000 gp, not consumed unless it traps a soul; then consumed when the gem ends',concentration=True,activity='save',save='cha',chat='Prevent healing and temporarily trap the soul if the target dies while the chain is maintained.'),
S('Edict of the Black Moon','Black',7,'Enchantment',
'''Choose up to six creatures you can see within range and give one command of no more than five words. Each target makes a Wisdom saving throw. On a failure, it must use its action on its next turn to obey the command as completely as it can. At the end of that turn it repeats the save, ending the effect on a success. A target automatically succeeds on any save made immediately before obeying a command that would directly kill or permanently maim it. The spell ends on a target when it succeeds on a save.''',
range_='90 feet',target='Up to six creatures',duration='Concentration, up to 1 minute',concentration=True,activity='save',save='wis',chat='Issue a short repeating order to up to six creatures; each saves after obeying and before direct self-destruction.'),

S('Sable Cataclysm','Black',8,'Evocation',
'''A sphere of collapsing black fire erupts at a point you can see within range. Each creature in a 30-foot-radius sphere must make a Constitution saving throw, taking 10d8 necrotic damage on a failed save, or half as much on a success. The area becomes magical darkness until the end of your next turn. You can see through this darkness. A creature reduced to 0 hit points by the spell sheds no light and cannot regain hit points until the darkness ends.''',
range_='150 feet',target='30-foot-radius sphere',duration='Instantaneous; darkness until end of your next turn',activity='save',save='con',damage='10d8',dtype='necrotic',onsave='half',chat='30-foot cataclysm for 10d8 necrotic damage followed by one round of magical darkness you can see through.'),
S('Exsanguinate Memory','Black',8,'Necromancy',
'''Choose one creature you can see within range. It must make an Intelligence saving throw. On a failed save it takes 8d8 psychic damage and loses access to one prepared or known spell of your choice that you have seen it cast, or, if it does not cast spells, one proficiency you choose that you have observed it use. The loss lasts until the creature finishes a long rest or receives greater restoration. On a successful save, it takes half damage and loses nothing. You cannot remove a creature's ability to cast all spells, use weapon attacks, or understand language with this spell.''',
range_='60 feet',target='One creature',duration='Instantaneous; memory loss until long rest',activity='save',save='int',damage='8d8',dtype='psychic',onsave='half',chat='Deal 8d8 psychic damage and, on a failed save, temporarily strip one observed spell or proficiency.'),

S('Reverse Death','Black',9,'Necromancy',
'''You touch the corpse of a creature that has been dead no longer than 1 hour and forcibly draw its soul back into the body, provided the soul is free and willing or the GM determines it can be compelled by the cosmology. The creature returns to life with 1 hit point and three levels of exhaustion. This spell does not restore missing body parts, cure poison or disease, or remove a condition that caused the death; if the body cannot survive, the creature may die again. The black pearl is consumed. A creature returned by reverse death cannot be targeted by it again for 30 days. Unlike divine resurrection, this working leaves a detectable necromantic scar on the soul until the creature next dies.''',
legacy=True,range_='Touch',target='One corpse dead no longer than 1 hour',duration='Instantaneous',components='V, S, M',material='a black pearl worth 5,000 gp, consumed',activity='heal',healing='1',chat='Forcibly return a recently dead creature at 1 HP with severe exhaustion and a lasting necromantic scar.'),
S('Final Dominion','Black',9,'Enchantment',
'''One creature you can see within range must make a Wisdom saving throw. On a failed save, it is charmed by you for 24 hours without concentration. While charmed, it regards your spoken commands as overriding imperatives and obeys them on its turn to the best of its ability. Whenever you order it to take an action that would obviously cause its own death or permanent mutilation, it repeats the saving throw before acting, ending the spell on a success. Whenever it takes damage from you or a creature it knows to be your ally, it also repeats the saving throw. A creature that succeeds on any save against final dominion is immune to this spell from you for 30 days.''',
range_='60 feet',target='One creature',duration='24 hours',components='V, S, M',material='a black crown-shaped onyx worth 2,500 gp, not consumed',activity='save',save='wis',chat='Dominate one creature for 24 hours without concentration, with new saves for betrayal or self-destructive orders.'),
]

assert len(sp)==90, len(sp)
assert all(s['school'] in SCHOOL_CODES for s in sp)
assert {o:sum(1 for s in sp if s['order']==o) for o in ['White','Red','Black']} == {'White':30,'Red':30,'Black':30}
for o in ['White','Red','Black']:
    levels={s['level'] for s in sp if s['order']==o}
    assert levels==set(range(10)),(o,levels)

# Ensure schools obey intended matrix.
allowed={
 'White':{'Abjuration','Divination','Enchantment'},
 'Red':{'Conjuration','Illusion','Transmutation'},
 'Black':{'Enchantment','Evocation','Necromancy'}
}
for s in sp:
    assert s['school'] in allowed[s['order']], (s['name'],s['order'],s['school'])

# Legacy conversion count from supplied source chapter.
assert sum(1 for s in sp if s['legacy'])==31, sum(1 for s in sp if s['legacy'])


def parse_casting(casting):
    c=casting.lower()
    if 'reaction' in c: return ('reaction',1)
    if 'bonus action' in c: return ('bonus',1)
    if '10 minutes' in c: return ('minute',10)
    if '1 minute' in c: return ('minute',1)
    if '1 hour' in c: return ('hour',1)
    return ('action',1)

def parse_range(r):
    rl=r.lower()
    if rl.startswith('self'): return {'value':'','units':'self','special':r if '(' in r else '','override':False}
    if rl=='touch': return {'value':'','units':'touch','special':'','override':False}
    if rl=='same plane': return {'value':'','units':'spec','special':'Same plane','override':False}
    m=re.match(r'(\d+)\s+feet',rl)
    if m: return {'value':m.group(1),'units':'ft','special':'','override':False}
    m=re.match(r'(\d+)\s+mile',rl)
    if m: return {'value':m.group(1),'units':'mi','special':'','override':False}
    return {'value':'','units':'spec','special':r,'override':False}

def parse_duration(s):
    sl=s.lower()
    conc='concentration' in sl
    if 'instantaneous' in sl and ';' not in sl: return {'concentration':conc,'value':'','units':'inst','special':'','override':False}
    for unit in ['round','minute','hour','day']:
        m=re.search(r'(\d+)\s+'+unit,sl)
        if m:
            units={'round':'round','minute':'minute','hour':'hour','day':'day'}[unit]
            special='' if sl.strip()==f'{m.group(1)} {unit}' or sl.startswith('concentration') else s
            return {'concentration':conc,'value':m.group(1),'units':units,'special':special,'override':False}
    return {'concentration':conc,'value':'','units':'spec','special':s,'override':False}

def target_data(target):
    t=target.lower()
    affects='creature'; count='1'; special=''
    if target=='Self' or t.startswith('self'): affects='self'; count=''
    elif 'object' in t and 'creature' not in t: affects='object'
    elif 'up to six' in t: count='6'
    elif 'up to five' in t: count='5'
    elif 'up to three' in t: count='3'
    elif 'two creature' in t: count='2'
    elif 'sphere' in t or 'cube' in t or 'line' in t or 'cone' in t or 'cylinder' in t or 'door' in t or 'portal' in t or 'sensor' in t or 'area' in t:
        affects=''; count=''; special=target
    return {
      'template':{'count':'','contiguous':False,'type':'','size':'','width':'','height':'','units':''},
      'affects':{'count':count,'type':affects,'choice':False,'special':special},
      'prompt':True,'override':False
    }

def comp_props(s):
    p=[]
    c=s['components']
    if 'V' in c: p.append('vocal')
    if 'S' in c: p.append('somatic')
    if 'M' in c: p.append('material')
    if s['ritual']: p.append('ritual')
    if s['concentration'] or 'Concentration' in s['duration']: p.append('concentration')
    return p

def dice_obj(expr,dtype):
    # Supports NdM [+ @mod] and constants. Preserve custom otherwise.
    m=re.fullmatch(r'(\d+)d(\d+)(?:\s*\+\s*(.*))?',expr.strip()) if expr else None
    if m:
        return {'number':int(m.group(1)),'denomination':int(m.group(2)),'bonus':m.group(3) or '',
                'types':[dtype] if dtype else [],'custom':{'enabled':False,'formula':''},
                'scaling':{'mode':'whole','number':None,'formula':''}}
    return {'number':None,'denomination':None,'bonus':'','types':[dtype] if dtype else [],
            'custom':{'enabled':True,'formula':expr},'scaling':{'mode':'whole','number':None,'formula':''}}

def make_activity(s):
    id_=aid('activity:'+s['order']+':'+s['name'])
    typ=s['activity']
    act_type,val=parse_casting(s['casting'])
    a={
      '_id':id_,'type':typ,
      'activation':{'type':act_type,'value':val,'condition':s['casting'] if ',' in s['casting'] else '','override':False},
      'consumption':{'targets':[],'scaling':{'allowed':bool(s['scale']),'max':''},'spellSlot':True},
      'description':{'chatFlavor':s['chat'] or re.sub('<[^>]+>','',s['text'])[:220]},
      'duration':parse_duration(s['duration']),'effects':[],
      'range':parse_range(s['range']),'target':target_data(s['target']),
      'uses':{'spent':0,'recovery':[],'max':''},'sort':0,'name':s['name'],'img':'',
      'visibility':{'requireMagic':False,'requireIdentification':False,'level':{'min':None,'max':None},'identifier':''},
      'appliedEffects':[]
    }
    if typ=='save':
        a['damage']={'onSave':s['onsave'],'parts':[dice_obj(s['damage'],s['dtype'])] if s['damage'] else []}
        a['save']={'ability':s['save'],'dc':{'calculation':'','formula':'@attributes.spell.dc'}}
    elif typ=='attack':
        a['attack']={'ability':'','bonus':'','critical':{'threshold':None},'flat':False,'type':{'value':s['attack'] or 'ranged','classification':'spell'}}
        a['damage']={'critical':{'bonus':''},'includeBase':False,'parts':[dice_obj(s['damage'],s['dtype'])] if s['damage'] else []}
    elif typ=='heal':
        # Healing/temporary HP distinction remains in prose where needed.
        a['healing']=dice_obj(s['healing'],'healing')
    elif typ=='utility':
        a['roll']={'formula':'','name':'','prompt':False,'visible':False}
    return id_,a

def description_html(s):
    provenance = ('Legacy conversion — adapted from the supplied 3.5e High Sorcery material into D&D 5e action economy, saves, durations, and bounded accuracy.'
                  if s['legacy'] else
                  'Wayreth original — a new High Sorcery spell written for this module.')
    level = 'Cantrip' if s['level']==0 else f"{s['level']}{'st' if s['level']==1 else 'nd' if s['level']==2 else 'rd' if s['level']==3 else 'th'}-level"
    parts=[]
    for para in s['text'].split('\n\n'):
        escaped=html.escape(para).replace('At Higher Levels:', '<strong>At Higher Levels.</strong>')
        parts.append('<p>'+escaped+'</p>')
    return f'''<div class="wayreth-journal">
<p class="wy-lead"><strong>{s['order']} Robe</strong> {s['school']} magic, preserved in the spellbooks of the Orders of High Sorcery.</p>
<h3>Spell Details</h3>
<table class="wy-table"><tbody>
<tr><th>Circle</th><td>{level}</td></tr>
<tr><th>Casting Time</th><td>{html.escape(s['casting'])}</td></tr>
<tr><th>Range</th><td>{html.escape(s['range'])}</td></tr>
<tr><th>Target</th><td>{html.escape(s['target'])}</td></tr>
<tr><th>Components</th><td>{html.escape(s['components'])}{(' ('+html.escape(s['material'])+')') if s['material'] else ''}</td></tr>
<tr><th>Duration</th><td>{html.escape(s['duration'])}</td></tr>
<tr><th>Access</th><td>{html.escape(s['rarity'])}</td></tr>
</tbody></table>
<h3>Effect</h3>
{''.join(parts)}
<div class="wy-quote"><p>{provenance}</p><footer>Wayreth spell archive</footer></div>
</div>'''

def spell_item(s,sort):
    act_id,act=make_activity(s)
    item_range=parse_range(s['range']); item_range.pop('override',None)
    dur=parse_duration(s['duration']); dur.pop('override',None)
    targ=target_data(s['target']); targ.pop('override',None)
    source_label='Towers of High Sorcery 3.5e conversion' if s['legacy'] else 'Wayreth: The Black Master'
    item={
      'name':s['name'],'type':'spell','img':ORDER_ICON[s['order']],
      'system':{
        'description':{'value':description_html(s),'chat':''},
        'source':{'custom':source_label,'book':'','page':'','license':'','rules':'2014'},
        'activation':{'type':parse_casting(s['casting'])[0],'value':parse_casting(s['casting'])[1],'condition':''},
        'duration':dur,'target':targ,'range':item_range,
        'uses':{'max':'','recovery':[],'spent':0},
        'level':s['level'],'school':SCHOOL_CODES[s['school']],
        'properties':comp_props(s),'materials':{'value':s['material'],'consumed':('consumed' in s['material'].lower() and 'not consumed' not in s['material'].lower()),'cost':0,'supply':0},
        'preparation':{'mode':'prepared','prepared':False},'activities':{act_id:act},
        'identifier':'wayreth-'+slug(s['order'])+'-'+slug(s['name']),
        'ability':'',
        'scaling':{'mode':'cantrip' if s['level']==0 and s['scale'] else ('level' if s['level']>0 and s['scale'] else 'none'),'formula':s['scale']}
      },
      'effects':[],'folder':None,'sort':sort,'ownership':{'default':2},
      'flags':{MODULE:{'managedSpell':True,'spellKey':s['order'].lower()+'-'+slug(s['name']),'order':s['order'],'school':s['school'],'legacyConversion':s['legacy'],'rarity':s['rarity']}},
      '_stats':{}
    }
    return item

items=[]
for order in ['White','Red','Black']:
    order_spells=sorted([s for s in sp if s['order']==order],key=lambda x:(x['level'],x['name']))
    for i,s in enumerate(order_spells):
        items.append(spell_item(s,(i+1)*100000))

out={'schemaVersion':1,'design':{
 'schoolMatrix':{
   'White':['Abjuration','Divination','Enchantment'],
   'Red':['Conjuration','Illusion','Transmutation'],
   'Black':['Enchantment','Evocation','Necromancy']
 },
 'sharedSchool':'Enchantment is intentionally contested between White and Black: White uses it to reinforce voluntary choice; Black uses it to override choice.',
 'spellCount':90,'legacyConversions':31,'rules':'D&D 5e 2014; Foundry dnd5e 5.3.3'
},'items':items}
(ROOT/'content'/'spells.json').write_text(json.dumps(out,indent=2,ensure_ascii=False),encoding='utf8')

# Spell guide journal: overview + one page per Order + legacy conversion page.
def level_name(n):
    return 'Cantrips' if n==0 else f'{n}{"st" if n==1 else "nd" if n==2 else "rd" if n==3 else "th"}-level Spells'

def order_sections(order):
    sections=[]
    for lvl in range(10):
        names=sorted([s for s in sp if s['order']==order and s['level']==lvl], key=lambda x:x['name'])
        rows=[]
        for spell in names:
            record='Legacy conversion' if spell['legacy'] else 'Wayreth original'
            rows.append(f'<tr><td><strong>{html.escape(spell["name"])}</strong></td><td>{html.escape(spell["school"])}</td><td>{record}</td></tr>')
        sections.append(
            f'<h3>{level_name(lvl)}</h3>'
            '<table class="wy-table"><thead><tr><th>Spell</th><th>School</th><th>Archive record</th></tr></thead>'
            f'<tbody>{"".join(rows)}</tbody></table>'
        )
    return ''.join(sections)

pages=[
 {'name':'Using the Robe Spellbooks','html':'''<p class="wy-lead">The Orders of High Sorcery do not merely disagree about ethics. They train the mind in different directions, and over centuries those habits have produced three recognisable magical traditions.</p>
<div class="wy-quote"><p>Magic is one art beneath three moons. The robe does not change the source of magic; it changes what the wizard is taught to seek within it.</p><footer>Wayreth teaching maxim</footer></div>
<h3>The School Matrix</h3>
<table class="wy-table"><thead><tr><th>Order</th><th>Favoured schools</th><th>Working principle</th></tr></thead><tbody>
<tr><td><strong>White Robes</strong></td><td>Abjuration, Divination, Enchantment</td><td>Protect, reveal, and strengthen voluntary choice.</td></tr>
<tr><td><strong>Red Robes</strong></td><td>Conjuration, Illusion, Transmutation</td><td>Change the terms of a problem rather than simply overpower it.</td></tr>
<tr><td><strong>Black Robes</strong></td><td>Enchantment, Evocation, Necromancy</td><td>Impose will, destroy resistance, and turn life or death into leverage.</td></tr>
</tbody></table>
<h3>The Contested School</h3>
<p><strong>Enchantment appears in both White and Black traditions by design.</strong> A White Robe asks whether magic can reinforce a choice without replacing it. A Black Robe asks how efficiently that choice can be replaced. The distinction is philosophical, but it is also mechanical: White Enchantments protect agency, courage, clarity, or agreement; Black Enchantments compel, suppress, or dominate.</p>
<h3>Learning These Spells</h3>
<p>These spells are intended primarily for Wizards of High Sorcery and characters taught directly by the Orders. Passing the Test opens the libraries of an Order; it does not place every spell in the wizard's spellbook. Individual spells are still learned, copied, awarded, stolen, discovered, or taught according to the normal rules of the campaign.</p>
<p>Entries identified as <strong>Tower Master secrets</strong> or <strong>Conclave secrets</strong> should normally be discoveries or plot rewards rather than routine level-up selections.</p>'''},
 {'name':'White Robe Spellbook','html':f'''<p class="wy-lead">Solinari's tradition is one of disciplined protection, truthful sight, and the defence of the mind's right to choose. White Robe magic is strongest when the wizard has something — or someone — to preserve.</p>
<div class="wy-quote"><p>See clearly. Stand between. Give strength without taking the choice away.</p><footer>Principle of the White Robes</footer></div>
{order_sections('White')}'''},
 {'name':'Red Robe Spellbook','html':f'''<p class="wy-lead">Lunitari's tradition teaches adaptation. Red Robes solve problems by changing position, form, circumstance, or perception until the conflict itself has different terms.</p>
<div class="wy-quote"><p>Balance is not stillness. Balance is knowing what must move.</p><footer>Principle of the Red Robes</footer></div>
{order_sections('Red')}'''},
 {'name':'Black Robe Spellbook','html':f'''<p class="wy-lead">Nuitari's tradition treats magic as leverage: concentrated force, compelled obedience, stolen vitality, and the mastery of death as a resource rather than a boundary.</p>
<div class="wy-quote"><p>Power unused is merely possibility. The Black Robe concerns himself with what power can be made to do.</p><footer>Principle of the Black Robes</footer></div>
{order_sections('Black')}'''},
 {'name':'Legacy Conversions','html':'''<p class="wy-lead">Thirty-one spells in this collection descend directly from the supplied 3.5e High Sorcery material. Their narrative identities remain intact, but the rules beneath them have been rebuilt for fifth edition.</p>
<div class="wy-quote"><p>The old spell is not preserved by copying every number. It is preserved when it creates the same decision, danger, or possibility at the table.</p><footer>Conversion principle</footer></div>
<h3>Caster-Level Arithmetic</h3><p>Ranges, durations, damage, and target counts based on caster level become fixed fifth-edition values or explicit spell-slot scaling.</p>
<h3>Saving Throws</h3><p>Will, Fortitude, and Reflex become Wisdom, Constitution, and Dexterity unless the fiction of the spell clearly attacks intellect or force of personality instead.</p>
<h3>Spell Resistance</h3><p>Spell Resistance is removed. Fifth edition's saving throws, attack rolls, concentration rules, legendary resistance, and bounded accuracy perform that balancing work.</p>
<h3>Experience Costs and Permanent Penalties</h3><p>XP expenditure becomes costly material components, once-per-rest restrictions, or explicit campaign limitations. Long-term ability drain and hard lockouts become repeat saves, long-rest recovery, <em>remove curse</em>, or <em>greater restoration</em> where appropriate.</p>
<h3>Tower and Grove Secrets</h3><p>The old Tower-grove protections remain intentionally specialised. Each has enough general utility to remain a legitimate spell while its original purpose remains the reason the Orders guard it.</p>'''}
]
(ROOT/'content'/'spells-guide.json').write_text(json.dumps({'name':'The Robe Spellbooks of High Sorcery','pages':pages},indent=2,ensure_ascii=False),encoding='utf8')

print('Wrote',len(items),'spells and',len(pages),'guide pages')
print('Legacy conversions:',sum(1 for s in sp if s['legacy']))
for o in ['White','Red','Black']:
    counts={lvl:sum(1 for s in sp if s['order']==o and s['level']==lvl) for lvl in range(10)}
    print(o,counts)
