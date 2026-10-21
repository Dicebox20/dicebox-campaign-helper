# Cabin in the Ashen Veil — Accepted Canon Addendum

**Date:** 2026-10-19  
**Authority:** Explicit user acceptance: “lets preverse all we discussed as canon” following the Ruining / Crimson Veil lore reconciliation.  
**Scope:** Consolidates the accepted story and design choices from this conversation. Supersedes contradictory older campaign notes; does not claim a GitHub/main, reproducible-KB, Foundry, or runtime update. Existing technical workflows continue to govern implementation.  
**Classification:** Campaign-design canon, with deliberate distinctions between published Forgotten Realms background and original campaign interpretation.

## 1. Historical origin — 1451 DR

- Published Forgotten Realms background, as discussed: Maegera's awakening and Mount Hotenow's eruption devastate Neverwinter in 1451 DR; the catastrophe empowers the Dread Ring in Neverwinter Wood. This does **not** establish that the Ring activated *prematurely*, nor prove an exact-second synchronization of these events.
- **Campaign canon:** The Ash Zombie attack destroys the family's homestead during the 1451 DR catastrophe. The father dies defending the family, his blood spilling upon the home he built. His final emotional imprint is desperate protection, failure, and refusal to abandon his family.
- **Campaign interpretation:** The supernatural surge associated with the Dread Ring and the Ruining imbues the father's protective will into the handcrafted house, creating **the House That Loves**. It is not a separate father-ghost speaking through architecture. The Dread Ring supplies/amplifies supernatural force; the father's will gives it purpose. The specific reach of this magic to the homestead is original campaign lore.
- The precise physical death locations and the final moments of mother and Donovan remain to be placed consistently with Sophia and Donovan's remains in the undercroft. Do not inadvertently relocate Donovan's established remains.
- Earlier wording that the Dread Ring **activated prematurely at the exact instant of the father's death** is superseded. Coincidence with the wider 1451 catastrophe is campaign canon, not a claimed precisely documented lore timestamp.

## 2. House, family, and sanctuary

- The father built the homestead himself; his craftsmanship reflects Gond's invention/craft ideals. The mother is a half-elven artist and cleric of Sune Firehair. They raised Sophia, who became blind following a serious childhood illness. The possible pond-rescue illness connection is a **developing story hypothesis**, not established medical causality or a locked timeline.
- Sune's Grove is a wooded sanctuary built by the father in harmony with nature: central statue and circular masonry, winding dirt paths, four outer masonry resting areas, integrated trees, branches, vines, roots, and fifty years of natural overgrowth.
- **Correction to the earlier “no graves” declaration:** There is one grave in Sune's Grove for the miscarried unborn child (the Null Child's associated burial); no ancestral cemetery or other graves are assumed. Grave inscription/name not decided.
- Main statue's hands are reserved for the **late Scrying Bowl**. Separate rear/base relief interaction; neither a framed painted portrait nor an exposed standalone plaque. One approved overview render and user sketch are visual planning references; five later generated scene images were rejected and must not be used. No new map generation is authorized by this document.
- The mother's art studio is accessible early; Study locked by Brass Key; Sophia bedroom by Old Iron Key in parents' coat; basement by Weathered Key from drained pond. Player-facing item names stay neutral and never disclose puzzle function.

## 3. Four vault requirements and progression dependencies

Final reward is access to Sune's Scrying Bowl, which is returned to the statue; the early three-digit lockbox `027` contains the water-filled Dust of Dryness pellet used in the bowl. The bowl-and-pellet mechanism releases measured water to open the concealed Undercroft access. No extra unapproved puzzle should be inserted between charging and using the power source.

Four major requirements are:
1. **Basement access** via Weathered Key retrieved from the drained pond.
2. **Charged Gondian power source**, recovered uncharged from Rufus, then taken to a charging station in an aqueduct side chamber. Charging is straightforward: place device, charge; **no extra puzzle, repair, activation stage, or special item**.
3. First half of a circular two-piece mechanism.
4. Second half of the same mechanism.

The two halves interlock into a round, non-weapon mechanical actuator with a **Gond-and-Sune arm-in-arm image**: one half uses engineering motifs, the other floral/beauty motifs. Combined device operates the final security system. Whether separate electrical/mechanical activation is needed is **not** an approved fifth major chain.

**Sune → Study → Waterworks:** Obtain clockwork winder (location OPEN) → activate the four exterior Sune busts in the correct order (order/clue OPEN), each winding into its pedestal → reveals embossed sliding-stone Sune relief on central statue base → solve it → opens family-stash vault containing a bag of **1,000 gp** with **Brass Key hidden accidentally under the fabric**. Preferred discovery: “As you take the bag of gold, you discover a small key beneath it hidden by the fabric. It doesn't seem like this was left intentionally.” Brass Key unlocks Study → father's `587` note → Donovan's Shack lockbox reveals sluice crank → drain pond → Weathered Key → basement workshop. **Never gate Sune relief behind pond drainage**; it creates a hard cycle.

**Clock & aqueduct:** Study tinkering basket has Tiny Key → grandfather clock face and oversized hour hand; attic contains minute hand; roof accessible through upstairs windows → roof chimney clock set to 12:00 with both hands, central button → replacement gear → install in drained-pond aqueduct door → use handle from basement workshop to open it. Aqueduct leads to a Gondian charging chamber (exact floorplan open), a forest well, and the maze/Gazebo route. Charging station must remain revisitable.

**Rufus:** Taxidermied dog in Study lacks **both eyes**. First eye is sewn with mismatched threads into Sophia's torn stuffed bear (accessible through Old Iron Key). Second eye is **unplaced but should be obtainable late**, timing activation of the Crimson Veil. Once both are returned, Rufus's jaw opens exposing button; button opens body to reveal **uncharged Gondian power source**. Its item label should describe appearance only. Players return to aqueduct chamber to charge. Neither the charging chamber nor acquiring second eye can require the already-charged item.

**Childhood:** Six-volume Miss Lulubug's Wondrous Tales shelf in Sophia bedroom, two books already present; remaining books in pond hollow log, attic, chimney flue (not clock), and Forgotten Gazebo. All six titles previously approved; publication order, individual textual chronology hints, and hidden-room contents remain OPEN. A Gazebo storybook means completing Spine Mosaic must come **after** aqueduct/maze access. Inscription is exactly: “A tidy shelf is a happy shelf! Put your stories in the order they came, from the oldest tale to the newest name!” Forgotten Gazebo main independent puzzle/reward also OPEN. Both final mechanical halves remain unplaced, candidates (not canon) being Gazebo and Spine Mosaic.

## 4. The Crimson Veil — final-act milestone

- **Named and accepted:** **The Crimson Veil**, a major atmospheric transition at approximately **75% of campaign progression**, signifying the final act. This is a narrative target, **not a timer or computed completion percentage**.
- **Exact event trigger:** Players charge the Gondian power source using stored magical energy in the aqueduct's charging station. That energy had been helping the House That Loves suppress the **Abyssal breach**. Depletion weakens the house, allowing Voss's ritual and the breach to surge.
- Estate-wide consequences: lighting becomes darker and sinister, moonlight disturbing/dark crimson, red fiendish fog across property, music changes to ominous/sinister, pressure from demons intensifies, the house becomes desperate. **Campaign explanation:** lingering Dread Ring energy expressing as crimson mist, intensified by Voss's new Abyssal breach; this fog phenomenon is original campaign lore, not a published source assertion.
- **Implementation design intent only:** one-shot persistent Region-triggered state transition applying appropriate lighting/weather/audio per scene. Multi-scene coordination, exact Foundry scene behaviors, permissions, APIs, and runtime validity remain UNVERIFIED; avoid claims of implementation or easy guaranteed feasibility.
- The house's depleted energy is distinct from its surviving will; it can still intervene heroically in the final confrontation.

## 5. Five haunts — Crimson Veil behavior and boundaries

- **The House That Loves:** largest/most violent defender. The father's overwhelming protective will and residual Dread Ring magic crush lesser demons with moving architecture, squeeze rifts shut, hurl obstacles and brutally block greater fiends. It acts ever more desperately, not necessarily more strongly. Never talks, explicitly identifies motives, or labels feelings in words; protection is communicated by visceral memory/image/overwhelming intent. Final protective effect **The House That Loves** retained; mechanics OPEN.
- **The Crooked Man (Donovan):** before Veil can chase/capture a maximum of one player, subject to established Sophia-bedroom release protocol. AFTER Veil, stops pursuing/capturing players, despite appearances; actively attacks and drags invading demons away, easing encounter burden. Its appearance/motion remain terrifying.
- **The Shadow That Sees (mother):** manifests openly after Veil and bestows protective **Faithful of Sune** buff against the Abyssal breach and the house's overwhelming presence. Exact rules/duration/application OPEN. It is distinct from *The House That Loves* finale effect. Neither effect should negate family-protective characterization.
- **Eyeless Girl (Sophia):** not a meaningful combat ally. Appears sometimes hiding behind mother's leg and **sometimes holding/cradling the Null Child**. She was **not an older sister during life**: the pregnancy ended before birth; after death, she recognizes the Null Child as family. She does not control his powers. Keep her blind characterization consistent.
- **Null Child:** incomplete consciousness of miscarried unborn child, a disturbing nontraditional cosmic-horror manifestation; anomalous mouth is a cosmic-horror feature, not symbolism proving miscarriage. Instinctively projects consciousness onto more intelligent demonic intruders in response to perceived danger. It **does not understand the ritual, the demons' agenda, strategy, or why others suffer**; not a deliberately tactical anti-demon ally and not guaranteed harmless to players. Cosmic horror collides with demonic terror. Its ordinary newborn aspect may appear in the family's final vision.

## 6. Repeated memory/flashback motif

During the Crimson Veil, the house projects fragments conveying an unspoken urgent **impulse to protect**. Not exposition or labeled emotions. Four motifs:
- Father/Donovan fend off a bear to protect young Sophia, Rufus barking.
- Family rescues Sophia from drowning in the pond; **possible** illness-to-blindness causal link under consideration, not yet clinically/story-finalized. Who physically rescues her remains undecided.
- Mother keeping a **Sune healing vigil**, praying, soothing and attempting to heal Sophia; father may witness helplessly. This is a **proposed flashback staging**, not all staging particulars formally accepted.
- Family desperately repels Ash Zombies, father falls with blood spilled on house; dying intent imprinted during the 1451 DR catastrophe. The house's memory fragments give the players the emotional truth.

## 7. Voss and the invaders

- Maldrath Voss conducts the modern ritual in the Undercroft; primary combat side is demonic invaders, from psychological horror early to genuine terrors in the final act. The other haunts predate Voss, and the family's haunting is not caused by his ritual.
- Vharzagul is canonically an original **yagnoloth/yugoloth**, **not a demon**. His appearance and betrayal/killing of Voss remain intended climax. The connection between the Abyssal demonic breach and summoning a yugoloth remains an **unresolved cosmological/story mechanism**; do not conflate yugoloths and demons.
- The estate increasingly resists demons; protective events should recontextualize prior frightening haunt behavior rather than announce family relationships.

## 8. Study lore additions (proposed, not silently approved as exact readable text)

Books/notes about Gond as craft/invention deity, Sune as beauty/love deity; father's and mother's affectionate annotations emphasizing art and engineering. A possible illustration/statuette depicts Gond and Sune arm in arm, visually foreshadowing the interlocking final mechanism. The gods' depicted affectionate pose is **family-created symbolism**, not a claim they have a canonical romantic relationship. Exact writings and physical props still subject to selection.

## 9. Current OPEN design / implementation blockers

- Clockwork winder acquisition and four-bust activation order/clue; avoid basing them on Study, pond drainage, or later gate.
- Rufus second eye late-game placement; its availability must pace charging and the 75% Crimson Veil milestone.
- Gondian charging chamber physical placement, and verified implementation; no extra charging puzzle.
- Both final crescent-piece locations and rewards; Forgotten Gazebo independent puzzle; Spine Mosaic room contents and chronological publication metadata.
- Exact father vault footprint/activation behavior, Scrying Bowl hiding place, precise Undercroft entrance geometry.
- Story continuity: chronology and physical position of father, mother, Donovan, Sophia in the Ash Zombie assault; cause/extent of Sophia's blindness; relationship of Dread Ring magic to the chamber and ancient house magic.
- Voss ritual structure, why demons arrive while the target is a yugoloth, and combat encounters/triggers.
- No skill checks or DCs until location contents/puzzles complete. No new maps yet. Source-authoritative structural sketch and first approved grove overview retained; later five concept images rejected.
- GitHub roadmap/active card, reproducible-KB sync, Foundry staging/injection/verification intentionally deferred at user request until campaign design is ready; don't claim synced or production-ready.

## 10. Follow-up and reconciliation protocol

Use this addendum alongside the earlier `START-HERE-2026-10-19.md` and `CONFLICTS-AND-DEPENDENCY-AUDIT-2026-10-19.md`. This addendum is newer for overlapping accepted campaign facts. Older E06/Chauntea/grave/no-grave and 29-map references are historically preserved but not current design authority. Treat open decisions as OPEN. On completion of campaign design, follow repository accepted-change synchronization / database-first workflow to reconcile all changes before code or Foundry implementation.
