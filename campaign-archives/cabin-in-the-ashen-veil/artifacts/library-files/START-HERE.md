# Cabin in the Ashen Veil — Durable Campaign Continuity Handoff

**Compiled:** 2026-10-18  
**Purpose:** Resume creative planning and subsequent implementation for the DiceBox Campaign Helper and Foundry VTT ecosystem without accidentally promoting assistant speculation to canon.  
**Status:** Working campaign specification; user-approved decisions distinguished from candidate details. This file is a local continuity artifact, **not** a claimed canonical repository/database commit or a Foundry runtime receipt.

## 0. Read first: creative governance

- **Exact title:** *Cabin in the Ashen Veil*. Do not prefix with “The.”
- **User controls canon.** Never silently approve or canonize suggestions, speculative lore, puzzle structures, art variants, scene geometry, implementation, or encounters.
- Work collaboratively **one decision at a time**. The user is moving quickly, but that does not permit inventing a complete puzzle network before agreement.
- Preserve separation between **what players know**, **GM-only underlying truth**, and **assistant proposals**.
- The family connection is **never explicitly narrated/explained during play**. The players must infer it from hints, props, and haunt behavior. Do not write lore-dump exposition.
- The haunts are **sentient, misunderstood sources of dread**, not automatically friendly or harmless.
- All project work furthers the unified DiceBox Campaign Helper application; for implementation defer to repository `main`, AGENTS.md, ADRs, accepted workflows, authoritative knowledge database, and actual Foundry runtime evidence. No claims of install/readiness without verification.

## 1. Campaign concept — approved

- Halloween-themed one-shot in the **Forgotten Realms, Neverwinter Wood**, planned for roughly one stormy night, with strangers converging upon an old cabin for varied personal reasons. Player character identities and entry scenarios remain undecided.
- Inspired by **Resident Evil** and **Devil May Cry** exploration/puzzles; **Castle of Dreams** is the established reference for interconnected puzzle chains, item acquisition, locked pathways, backtracking, and discoveries.
- **Two parallel mysteries:**
  1. **The active summoning** — the urgent adventure objective and eventual showdown.
  2. **The house and its grounds** — an older, separate haunting and family tragedy, optionally pieced together by player inference.
- The players initially have reason to attribute the supernatural experiences to the Summoner, but the five haunts **predate and are independent of** the ritual. Stopping the ritual does **not** end the haunting.
- Theme: **what appears malicious or predatory is driven by private motives that the party misunderstands**. Understanding the family is not a prerequisite to finishing the summoning objective.
- An ending may reveal lingering haunts after the party assumes it succeeded; precise staging is not fixed.

## 2. Summoning objective and final site — approved

**Final objective:** Interrupt **Maldrath Voss**'s attempt to summon **Vharzagul**, an original **yagnoloth** (a yugoloth, not a demon in Forgotten Realms taxonomy), before it can fully enter the mortal world.

**Approved final site:** A concealed **underground ritual chamber beneath the Old Memorial Clearing (E06)**, entered by discovering/opening an old grave or memorial-associated entrance.

**Established planned turn:** Vharzagul betrays/kills the Summoner, becoming the climactic danger. Its exact entry timing, combat design, victory condition, and whether interruption succeeds before or during manifestation have **not** been specified. A grave-marker riddle and exact locking mechanisms were **suggested, not approved**.

**Unresolved continuity point:** Old 29-map inventory lists **B06 Concealed Thayan Laboratory/Ritual Chamber** inside basement; the later approval places the **final ritual chamber beneath E06**. Do **not** presume B06 was deleted or silently reassign B06. Reconcile its role, distinctness, and scene IDs when creating the route topology.

## 3. Central hub and guidance — approved

**Central hub:** **G02 Great Room / Living Room**. The party returns here to orient, plan, connect clues, and unlock future progress. It is a relative place of familiarity, **not guaranteed supernatural safety**.

**Two approved central guidance objects:**

1. **Estate Map:** A reusable navigational reference for the grounds and outbuildings.
2. **House Blueprint:** A reusable interior architectural reference with deliberately **missing and/or erased portions**, indicating unknown or concealed features.

The user specifically instructed: **design multiple puzzles both leading from and returning to the Great Room; only after establishing puzzles decide which set pieces go there**. Do not add miniature-house, family memorial display, specific wall layout, or exact puzzle objects as accepted features.

**Undecided:** What the erased/missing blueprint reveals or mechanically unlocks (hidden rooms, puzzle links, final route, etc.). The previous assistant proposed choices but the user did not select one. Whether blueprints are repairable/collectible is also undecided.

## 4. Puzzle campaign workflow — accepted direction, contents not yet designed

- Design **backwards** from the objective and final location.
- Resident Evil / Devil May Cry / Castle of Dreams style **interwoven dependencies**: outbound branches from G02, returning items/information toward G02, revisiting known spaces with new capabilities, item combinations, observation, environmental manipulation, and logical deduction.
- Avoid a monotonous line of keys and doors; avoid hard-locking the campaign on solving the optional family-history mystery.
- A **four-branch** network was proposed by the assistant (and previously drafted with named seals) but **the user never confirmed exact branch count, themes, or dependencies**. Names such as Ember/Mourning/Iron/Grave Seals are noncanonical.
- **Next design task:** Determine how the Estate Map and erased Blueprint interface with the puzzle graph, then define puzzle dependencies beginning/ending at G02, leading to E06. Do not invent room set dressing first.

## 5. Five haunts — user-established concepts and motivations

### H01 — The Eyeless Girl

- Visual: uncanny young girl; exceptionally pale smooth skin, long jet-black hair, empty black eye sockets/void eyes, thin sickly form, filthy old-fashioned nightgown; understated, silently unsettling. User approved an earlier generated rendition, but this handoff cannot unambiguously match it to a unique local image file.
- Player interpretation: An eyeless ghost staring at or stalking them.
- **True motive:** She simply wants to **see** again: people, colors, shapes, forms. She once had sight; her stare comes from longing, not hatred.
- **Approved environmental hint:** Old coloring books demonstrating that she could once see and engage with colors.

### H02 — The Crooked Man (The Groundskeeper)

- Visual: extraordinarily tall, gaunt, elongated humanoid (Siren Head-like proportions, Cronenberg body horror); extended legs, impossibly long bent arms with recognizable human hands, narrow torso, rope-like elongated neck bent so a grinning eyeless face looks through a window. Later user-approved **pale blue-gray** coloration and character concept turnaround. Do not copy Siren Head anatomy literally. Distinctly humanoid, physically connected two arms/two legs, one head.
- Player interpretation: Pursuer/kidnapper, chasing/grabbing/carrying people.
- **True motive:** He was a **cheerful groundskeeper**, charged with **keeping the children safe**; what looks like stalking or abduction is him trying to **wrangle/retrieve children and return them to safety**. His current perception of who needs wrangling or what is safe may be flawed; exact behavior remains to be designed.
- **Approved environmental hint:** Picture of a cheerful-looking man tending the gardens.
- Visual references supplied in `assets/crooked_man_window_reference.png` and `assets/crooked_man_pale_blue_turnaround.png`. An earlier mesh/GLB was a simplified prototype and **not** adopted as final artwork; the user chose ordinary images thereafter.

### H03 — The Shadow That Sees

- Visual: **literal flat shadow cast on a wall** with **no physical or light source**. Elegant, beautiful elf-maiden outline/silhouette; it is **not** a solid standing shadow monster. When noticed, a **single lidless bloodshot non-shadow eye** opens within the flat silhouette and watches. The revised wall-shadow image was user accepted.
- Player interpretation: A source-less sentient shadow watching them malevolently; existential dread from being observed.
- **True motive:** In life the maiden spent everything making herself attractive, taking **“beauty is in the eye of the beholder”** painfully literally. She appears in every room **to display her beauty and be admired**, but all that remains is a flat black shape on a wall.
- **Implementation idea accepted at concept level:** A reusable Tile appearing across maps, hide/show via GM macro, with an eye-reveal state. Specific Foundry API, player exposure, macro behavior, images with transparency, and verification are **not yet implemented/approved**.
- Approved visual reference: `assets/shadow_that_sees.png`.

### H04 — The Null Child

- **Clarification about numbering:** User explicitly called the Null Child the **fifth creature** at first, then, after deciding the final haunt is the house, said "so that's four" and positioned the house as the **fifth/final haunt**. Thus the effective five-haunt roster is **Eyeless Girl, Crooked Man, Shadow That Sees, Null Child, House That Loves**, with **Null Child as H04 / House as H05**, regardless of earlier provisional numbers. Preserve that chronological nuance.
- Visual: small, ancient mummified/embalmed-looking fetal/infant-like, desiccated leathery figure, now standing upright; enormous **black void-like open mouth**. User requested and received upright turnaround sheet. Inspired by an image described as a prehistoric frozen mummy; **its claimed real-world provenance/age was not verified** and must not be repeated as fact.
- **Current user clarification (2026-10-19; supersedes the earlier “Truth” interpretation):** The Null Child is the **incomplete consciousness of a fetus lost through miscarriage**, projected onto a victim in a cosmic-horror form. The enormous black void-like mouth is a **visual feature only**; it is not the source or carrier of a separate “Truth” effect. It is not intentionally cruel, but do not assume it is harmless.
- **Still unresolved:** The projection's trigger, exact victim experience and effects, whether the figure is purely projected or tied to physical remains, and SCP-specific containment/classification details. Do not treat these as established campaign canon.
- **Approved environmental hint:** An **unused, pristine but dusty nursery**, prepared long ago and left alone.
- Approved upright appearance reference: `assets/null_child_standing_turnaround.png`.

### H05 — The House That Loves

- The **building is itself sentient**, not inhabited by the father's ghost.
- Player interpretation: Malicious, trapping/tormenting building.
- **True motives (both essential):** (a) **Refuses to let new arrivals leave its “family” of haunts**, and (b) **protects them from the Summoner**. Actions look hostile even when intended as protection.
- **Origin, established core:** The **father built the house with tremendous love, duty, and devotion**, putting his wish to protect his family into every nail. He died in an event linked to **Szass Tam's Thayans and/or the Netherese**, in which **botched necromancy interacting with Netherese magic transferred/imprinted his will into the house**. **Father is not the house; will was passed into work**. The specific responsible faction, death scene, mechanism, and timing remain **undecided**.
- The house preserves the father's protective objective but lacks a full human understanding of consent, mortality, and leaving. Exact manifestations (locking doors, rerouting stairs, etc.) are **ideas**, not approved scripted encounters.

## 6. Forgotten Realms / disaster connection

- Historical backdrop discussed: Neverwinter Wood, **Mount Hotenow eruption (1451 DR)**, **ash zombies**, **Szass Tam / Red Wizards and Dread Ring**, and **Netherese/Shadovar** conflict/influence.
- **User-established direction:** Tie the family and house's sentience to the catastrophe and the Thayan/Netherese interplay. Father died as a result of either Szass Tam's forces or Netherese; botched necromancy combined with Netherese magic is central to transfer of will.
- **Not established:** which faction killed him; precise spell/ritual/cause; who else died when; whether the family all died simultaneously; whether the house itself was a magical project; whether Voss took part in the original catastrophe. The assistant's narrative of a specific collision of magical forces is an **unapproved proposal**.
- Historical lore facts should be checked against authoritative Forgotten Realms sources before they are represented as hard setting canon in an implementation.

## 7. Environmental narrative — approved clues and constraints

Three explicit user-selected clues:

1. **Cheerful portrait/picture of the garden-tending groundskeeper** — reevaluated after meeting Crooked Man.
2. **Girl's coloring books** — suggests Eyeless Girl formerly had sight.
3. **Unused baby room, pristine but dusty after a long time** — points toward the unborn Null Child.

The sequence of encountering clues versus haunts should be flexible. These are **hints only**, never a mandatory exposition sequence; players may or may not piece together the family.

**Not yet chosen:** hints about mother's former beauty fixation, father's craftsmanship and protective wishes, identity/name plaques, books/letters/diaries, exact placement of clues, or whether the house can communicate indirectly. Do not introduce any of those as established.

## 8. Canonical scene / area registry (29 locations)

User previously accepted a **29-map inventory**. Here is the working ID/name registry to preserve for planning. The footprint of the cabin was discussed as approximately **90 × 60 feet**, old/dusty yet structurally intact with three bedrooms; exact GIS/grid scale/doorways/walls are not established by this handoff.

| Zone | ID | Area |
|---|---|---|
| Ground | G01 | Entrance Foyer |
| Ground | G02 | Great Room / Living Room — **hub** |
| Ground | G03 | Dining Room |
| Ground | G04 | Kitchen |
| Ground | G05 | Pantry |
| Ground | G06 | Study / Library |
| Ground | G07 | Mudroom |
| Ground | G08 | Main Hall / Stairwell |
| Upper | U01 | Master Bedroom |
| Upper | U02 | Child's Bedroom |
| Upper | U03 | Guest Bedroom |
| Upper | U04 | Washroom |
| Upper | U05 | Upper Hall / Landing |
| Upper | U06 | Linen Closet |
| Attic | A01 | Main Attic Storage |
| Attic | A02 | Sealed Storage Room |
| Basement | B01 | Basement Landing |
| Basement | B02 | Root Cellar |
| Basement | B03 | Workshop |
| Basement | B04 | Fuel / Furnace Room |
| Basement | B05 | Old Storage Room |
| Basement | B06 | Concealed Thayan Laboratory / Ritual Chamber — **role needs reconciliation with E06 ending** |
| Exterior | E01 | Front Porch |
| Exterior | E02 | Rear Porch |
| Exterior | E03 | Privy / Outhouse |
| Exterior | E04 | Woodshed / Tool Shed |
| Exterior | E05 | Well / Pump |
| Exterior | E06 | Old Memorial Clearing — **buried final ritual chamber** |
| Exterior | E07 | Forest Approach |

**Important:** Existing map names are a map-inventory baseline; exact room topologies and the addition of a hidden E06 subterranean destination require further design. Do not silently count a new map as within the already approved 29.

## 9. Work remaining and next conversation starting point

**Immediate next step (puzzle architecture):** In a single short design exchange, decide how the **erased/missing house blueprint and grounds map** relate to discoveries and puzzle gates. Then sketch an explicit dependency graph with multiple branches **leading out of and back to G02** and converging on access to the buried **E06** ritual chamber. Hold off on Great Room set pieces until the puzzle dependencies are approved.

**Other outstanding choices:** precise ritual defeat objective and encounter beats; B06 vs E06 distinction; individual map adjacency/doors; puzzle count and interdependencies; division between optional haunt lore and mandatory ritual clues; mother/father hints; ultimate cause of father's death; mechanics for eyes / shadow visibility / house manifestation.

**Implementation gate:** Design does not equal Foundry-ready. When moving to assets / injectors, follow repository authority, approved Spatial Blueprint / map INSPECT process, scene/map injector sequence, active runtime authorization, preview, test, authoritative reread, and receipt. Reuse the verified known-good project tooling and database rather than invent APIs or test claims.

## 10. Continuation prompt

> Continue designing **Cabin in the Ashen Veil** using this document as the working handoff. Respect only explicit user approvals as canon. The campaign has two parallel mysteries: Maldrath Voss's summoning of Vharzagul beneath E06, and a separate, older family/haunt mystery. G02 Great Room is the exploration hub with an Estate Map and an erased/incomplete House Blueprint. We are about to design interconnected Resident Evil / Devil May Cry / Castle of Dreams-style puzzle dependencies that run outward from and return to G02, ultimately unlocking the ritual chamber. Ask only the next necessary creative decision, do not write the full puzzle system without user direction, and do not reveal the family story directly to players.

## 11. Included asset index

- `assets/crooked_man_window_reference.png` — user-selected window silhouette image.
- `assets/crooked_man_pale_blue_turnaround.png` — pale-blue design turnaround.
- `assets/shadow_that_sees.png` — accepted source-less elf-shaped wall-shadow concept with bloodshot eye.
- `assets/null_child_standing_turnaround.png` — upright Null Child reference sheet.

**Missing asset:** Exact approved Eyeless Girl image not confidently identified in the available image corpus; do not substitute an unreviewed draft.
