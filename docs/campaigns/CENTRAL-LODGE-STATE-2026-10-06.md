# Central Lodge Campaign State — 2026-10-06

**Project:** Dicebox Campaign Helper  
**Campaign:** Central Lodge  
**Status:** reviewed campaign source snapshot for handoff and knowledge-base reconciliation

## Continuation point

N3 — **Collection Vaults / Underground Depot** is rendered, inspected, and BUILT. Its Foundry IMPLEMENT step is still pending.

After a confirmed APPLY PASS with `evidenceClass: created_document`, continue:

**T1 → T2 → T3 → F1 → F2 → campaign-wide VERIFY**

Do not infer installation state for E1, E3, or B1. Audit them explicitly during final VERIFY.

## Campaign canon

- Iggwilv pulled the party into the Feywild during a failed attempt to trap Graz'zt. Graz'zt took her castle; time dilation means the same night is still unfolding on Toril.
- The lodge estate contains an ancient cult passage to the Hells. The cult created and used it. Fiend Machine did not create it.
- The cultists in the deepest chamber are still alive, impossibly preserved or sustained, and are summoning Fiend Machine.
- The lodge should appear long-abandoned, rotted, damp, and overgrown, with subtle evidence of recent use.
- Horror progression: **Abandoned → Haunted → Sacrificial → Active → Summoning**.
- Cult sacrifice history is revealed through absence first. Established euphemisms include “the guest,” “the willing hand,” “the household tithe,” “the firstborn gift,” and “the unnamed traveler.”
- The party initially believes the cult died decades ago. Later evidence shows active use through warm candles, cleared chairs, sharpened knives, greased railway switches, repaired timber, new ink, and similar details.
- The underground railway explains how living cultists move through the estate.
- Sparse pale childlike apparitions may appear around servants, children, and victims, remaining ambiguous early.
- Mystery ladder: old cult-adjacent human activity → devil worship and sacrifice → rhythm/music-associated devils → Fiend Machine shadow → active cult and infernal threshold.
- Black triangular objects are later recognized as guitar picks. Blood-written “invocations” are later recognized as lyrics. Rhythmic machinery and a band sigil become explicit only late.
- Fiend Machine is incoming in the finale, not already traversing the lodge tunnels.

## Mandatory map workflow

**PREPARE → RENDER → INSPECT → BUILD → IMPLEMENT → VERIFY**

REDO loops occur inside RENDER/INSPECT.

Every REDO abandons the previous image prompt completely. The replacement prompt contains only what should physically appear on the current map. Do not mention prior failures, unwanted content, adjacent map names, exit destinations, future or secret rooms, story interpretation, puzzle solutions, puzzle state, campaign lore that is not visible architecture, or time of day.

Permanent/runtime division:

- **BACKGROUND:** permanent architecture, geography, terrain.
- **TILE / STATEFUL:** puzzle objects, movable/revealed items, state changes.
- **FOUNDRY EFFECT:** lighting, weather, fog, sound, Regions, apparitions, animation, powered/unpowered states.

Indoor/base renders are time-neutral with soft diffuse neutral illumination. Active fixtures, flooding, ritual effects, and other stateful conditions belong in Foundry unless truly permanent.

**Never use Python for image work.** Use ImageMagick for mechanical image processing.

## Foundry standards

- Foundry VTT 14.367
- D&D5e 5.3.3
- World runtime: `the-lost-mine-of-phandalin`
- World ID is not campaign identity; use Central Lodge flags/stable IDs.
- Gridless Scene.
- Logical scale: 120 px = 5 ft.
- Typical render size: 4320×2880, 36×24 five-foot spaces.
- No baked grid, text, icons, tokens, UI, or visible Region markers.
- One `.md` containing one self-contained JavaScript injection macro.
- Exact world/version/system/GM gate.
- Asset attestation before mutation.
- PREVIEW PASS before APPLY.
- Explicit confirmation, create-only behavior, authoritative reread, no blind retry.
- Initial renderer 404 before upload is expected.
- After APPLY PASS with `evidenceClass: created_document`, do not rerun the installer.
- Build validator contract: `dicebox-scene-injector-build/v2`.

## Hint Region model

1. **Hidden Notice:** invisible Region, secret flat d20 + Perception. Failure gives a vague private sensory nudge; success gives directed observation. Critical progression never disappears on failure.
2. **Interpretation / Search:** player-chosen actions and skills produce genuinely different information.
3. **Recovery / Interaction:** roll only when physically meaningful. Failure produces consequence or alternate approach, not a softlock.

Rule: **Personal text whispers. Chat cards interrupt.**

## Railway canon

Rail cars provide fast travel between N1, N2, and N3. The tunnels are also physically walkable.

Cars use private-estate luxury railway language: dark wood, brass, upholstered interiors, restrained family-crest motifs.

Rail geometry is an inspection blocker. Rails must align with tunnel mouths, carriages must sit on tracks, tracks must not run into stairs or walls, pedestrian routes must stay separate, trackside walking margins must be readable, turnouts must be coherent, and intended portal counts must be exact.

Strong late clue: **“The railway map ends here, but the tunnel doesn’t.”**

## Map roster and current state

| ID | Map | State |
|---|---|---|
| E1 | Arrival Clearing & Front Grounds | Audit required; older build/asset complications, VERIFY deferred |
| E2 | Rear Service Yard & Outbuildings | IMPLEMENT PASS confirmed |
| E3 | Formal Garden & Greenhouse | Audit required; PREVIEW PASS observed, no APPLY PASS confirmed |
| E4 | Family Graveyard & Crypt | IMPLEMENT PASS confirmed |
| M1 | Entrance Hall & Great Room | IMPLEMENT PASS confirmed |
| M2 | Study, Parlor & Formal Rooms | IMPLEMENT PASS confirmed |
| M3 | Kitchen & Service Wing | IMPLEMENT PASS confirmed |
| U1 | Family & Guest Rooms | IMPLEMENT PASS confirmed |
| U2 | Servants’ Quarters, Nursery & Attic | IMPLEMENT PASS confirmed |
| B1 | Cellar & Utility Basement | Audit required; BUILD PASS, no APPLY receipt confirmed |
| B2 | Hidden Annex & Sacrificial Preparation Area | IMPLEMENT PASS confirmed |
| C1 | Hidden Chapel / Shrine of Asmodeus | IMPLEMENT PASS confirmed |
| C2 | Cult Records & Ritual Undercroft | IMPLEMENT PASS confirmed |
| N1 | Underworks Hub / Lodge Railway Station | IMPLEMENT PASS confirmed |
| N2 | Underground Grotto / Garden Station | IMPLEMENT PASS confirmed |
| N3 | Collection Vaults / Underground Depot | RENDER/INSPECT/BUILD PASS; IMPLEMENT pending |
| T1 | Lodge ↔ Grotto Walkable Railway Tunnel | Remaining |
| T2 | Grotto ↔ Depot Walkable Railway Tunnel | Remaining |
| T3 | Abandoned Spur / Cult Railway Extension | Remaining |
| F1 | Ancient Infernal Threshold | Remaining |
| F2 | Final Summoning Chamber | Remaining |

## Late-game puzzle routing

- N1: House Proof + Garden Proof + Rail Proof power the railway.
- N2: flooded until B1 is resolved; teaches tunnel walking.
- N3: Brass Baggage Token → baggage locker → Station Route Plate. Route Plate + departure board expose abandoned-spur routing. Railway Switch Wheel comes from T2. Cicada Wing IV is here. Cartography Table requires Old Estate Survey + Cult Passage Diagram + Recent Route Fragment to expose the F1 route. The branch portal is T3; exact main-line orientation toward T2 remains intentionally unresolved.
- T1: Cicada Wing III and the clearest physical lesson that tunnels are walkable.
- T2: Railway Switch Wheel for N3, black triangular objects, recent-passage evidence.
- T3: Recent Route Fragment, invocation fragments, Measure/rhythm material, and the transition from estate engineering into older cult/ancient construction.
- F1: completed Infernal Cicada body + Wings I–IV enable the ancient threshold; Measure/Ritual Rhythm resolves the inner ward.
- F2: no conventional puzzle lock; living cultists, active ritual, incoming Fiend Machine.

Multipart chains:

1. Funeral Crests → E4.
2. House + Garden + Rail Proofs → N1.
3. Shrine Seal + Censer → C1/C2.
4. Infernal Cicada Body + Wings I–IV → F1.
5. Old Estate Survey + Cult Passage Diagram + Recent Route Fragment → N3/F1 route.
6. Measure clues → F1 and late reveal.

Cicada parts: Wing I B2; Wing II E4; Wing III T1; Wing IV N3; Body C2.

## Recent implementation/build evidence

- **B2:** 22 Walls, 10 Regions, 3 disabled local sconces; Cicada Wing I, sacrifice/preparation evidence; APPLY PASS / created_document confirmed.
- **C1:** 21 Walls, 10 Regions, 3 disabled chapel/shrine lights; Seal/Censer state and C2 threshold; APPLY PASS / created_document confirmed.
- **C2:** 30 Walls, 11 Regions, 3 disabled archive lights; Firstborn pedestal, Cult Passage Diagram, Infernal Cicada Body, Measure/Rhythm clues; APPLY PASS / created_document confirmed.
- **N1:** 28 Walls, 11 Regions, 5 disabled station-power lights; three-proof railway activation and rail-car state; APPLY PASS / created_document confirmed.
- **N2:** 36 Walls, 9 Regions, 4 disabled grotto-station lights; B1 flood dependency, N1 power dependency, rail-car state and walking transitions; APPLY PASS / created_document confirmed.
- **N3:** 34 Walls, 12 Regions, 5 disabled depot lights; Brass Token locker chain, Station Route Plate, switch-wheel state, Cicada Wing IV, cartography overlay, recent-use evidence, walkable-rail discovery, rail-car state, railway-power staging. IMPLEMENT pending.

## Handoff/style artifact fingerprints

Style-guide images in the handoff bundle:

- N1 private-estate station: `595b0a67ee047815e462c9ef6349127190433fe8b25de668c08db34ca15b9442`
- N2 grotto garden station: `90c0bcb979b7621d5635e712ff9abf08aceca7dc89c0919cbf5f7701954e27ad`
- N3 collection depot: `ff7abec412a3f21573ae808ae9db6960a7be0607c1212e6755fe06f675ba0762`

N3 handoff artifacts:

- `central-lodge-n3-build-v001.md`: `4fe72e4a824ed8a78400c18b721a7ed0da5bdfb8adbbd966cc40ce2224f21bdd`
- `N3-INSPECT-v001.json`: `1c2aea268fb512e78dd2d7db754433c541feeaab7787dd23edc2c55ebd447963`
- `N3-BUILD-v001.json`: `ea2bb17be1477e6ef9305c70f782706e9712bdd26922506a1e4557ed5064ce0b`

## Open reconciliation items

1. N3 IMPLEMENT receipt is pending.
2. E1 installation/verification state must be audited.
3. E3 APPLY state must be audited.
4. B1 APPLY state must be audited.
5. N3 main-line orientation toward T2 remains intentionally unresolved until established physically.
6. T1, T2, T3, F1, and F2 remain to be built.
7. Campaign-wide VERIFY remains deferred until construction is complete.
8. Desktop Commander was offline during the latest construction phase; do not claim Windows workspace synchronization until the device is reachable and reread.

## User operating preferences

- Standard D&D 5e, not a Resident Evil inventory replacement.
- Environmental blockers, later-found physical/symbolic objects, backtracking, and Foundry state changes.
- Physical, intuitive, varied puzzles.
- Not every room needs a puzzle or scare.
- Oxford commas; avoid em dashes in authored campaign text.
- Save/checkpoint regularly.
- Unknown means unknown.
- Never replay unresolved state-changing commands.
- User alone grants authority.
- Do not bypass authorization or rate limits.

This document is the reviewed Central Lodge campaign source record for future handoff and KB reconciliation.