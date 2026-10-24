# H-G06 Great Room — measured PREPARE candidates (2026-10-23)

**State:** PREPARE STUDY / UNAPPROVED GEOMETRY / NO RENDER / NO FOUNDRY WRITE. Campaign: Cabin in the Ashen Veil (independent side campaign). This records the user-requested PREPARE, not acceptance of replacement house dimensions. Visual approval remains 18/45.

## Authority and verification boundaries

Sources reread on `codex/cabin-ashen-veil-recovery`: `AGENTS.md`; `all-scene-preparation-register-v2-2026-10-22.json` (blob SHA `534e66c7088c365e29130b3debf404a79ca20b1e`), especially current `H-G06`; `blueprints/house-layout-revision-v2-2026-10-22.md`; `great-room-scale-and-inclusion-only-prompt-audit-2026-10-23.md`; `community-ai-battlemap-and-tom-cartos-library-workflow-audit-2026-10-23.md`; universal representative-wall, clean-restart and map/token scale standards; `database/seed.d/2026-10-23-ashen-veil-map-chat-handoff.sql` (source-level KB review, **not** a certified SQLite rebuild); and the 2026-10-23 continuation handoff.

Latest approved Gondian BWE-027 source identifies Great Room **14×16 ft**, Foyer **6×6 ft**, Family **14×8 ft**. That Great Room offers 224 ft² ≈8.96 nominal Medium-token spaces before stairs and furnishings. The owner rejected two Great Room art renders. No revised physically measured house blueprint has been owner-approved. The approved Foyer artifact's exact source pixels **must not** be replaced or silently physically rescaled.

## Protected adjacency and puzzle anchors

**Five paired routes:** South to H-G02 Foyer; west to H-G01 Dining (Kitchen only reached through Dining); east to H-G05 Allen Study (Brass Study Key); north to separate H-G09 Rear Family Room; eastern upstairs main stair to H-U02 Upper Landing. The Study also has its own north locked door to rear exterior (same Brass Study Key), not into Family. Foyer independently encloses an east Weathered-Key door and stair **down**, not the main upstairs stair.

**Fixed visible anchors:** broad stair; masonry hearth; grandfather clock housing; separate illustrated architectural blueprint display table; separate `027` lockbox housing; family seating. **Separate Foundry-managed states:** removable clock Hour Hand after Brass Tiny Key; `027` pellet/lid; study locks; inspectable blueprint handout; lighting/effects; Walls, Regions, portals and vision. Clock placement follows current H-G06 register, although full architectural coordinates remain provisional.

## Two independently authored candidate coordinate sets

Coordinates are local FEET, Great Room southwest corner (0,0), north=+Y; rectangles `x0,y0,x1,y1`. Neighbor shells are **placeholders for reconciliation**, not approved master-house polygons.

| Property | A: compact grand hub | B: larger grand hub |
|---|---|---|
| Great Room bounds | (0,0,30,35) | (0,0,35,40) |
| Stairs UP | (21,16,29,33) = 8×17ft | (26,20,34,38) = 8×18ft |
| S Foyer portal center | (15,0), nominal 5ft | (17.5,0), nominal 5ft |
| W Dining portal center | (0,12), nominal 6ft | (0,14), nominal 6ft |
| E locked Study portal center | (30,11), nominal 6ft | (35,14), nominal 6ft |
| N Family portal center | (15,35), nominal 6ft | (17.5,40), nominal 6ft |
| Upstairs stair foot approach | (25,13.4) | (30,17.5) |
| Hearth | (3,33,11,35) | (3,38,13,40) |
| Clock | (2,25,5.5,29) | (2,29,5.5,34) |
| Blueprint table | (7,16.5,13,21) | (8,19,15,24) |
| 027 box | (2,5,5,8) | (3,5,6,8) |
| Family sofa | (7,25,13,27.5) | (7,28,14,31) |
| Armchair | (15,6,18,9) | (17,8,20,11) |
| Dining study wing stub | W (-24,5,0,35); E (30,5,54,35) | W (-25,6,0,40); E (35,6,60,40) |
| Rear Family wing stub | (4,35,26,47) | (5,40,30,55) |
| Foyer stub | (12,-6,18,0) | (14.5,-6,20.5,0) |
| Foyer east stairwell study stub | (18,-6,24,0) | (20.5,-6,26.5,0) |
| Kitchen stub (west of Dining) | (-44,9,-24,31) | (-47,10,-25,35) |
| Gross Great Room | 1,050 ft² = 42 nominal 5ft spaces | 1,400 ft² = 56 nominal 5ft spaces |
| Level-floor area, excluding fixtures and stair | 824 ft² | 1,144.5 ft² |
| Expected Great Room pixels if scale approved | 720×840 | 840×960 |

These are **design-space portal coordinates**, not final Foundry Walls/Region teleports or BWE-027 image coordinate assertions.

## Deterministic local token proof

Read-only Python/Shapely graybox fixture study with a **0.5-ft lattice of token center positions**, a mechanical **5-ft token diameter**, permanent obstacles expanded by **2.5ft**, walkable Great Room perimeter inset 2.5ft, and four-way connected BFS from the Foyer approach. Initial furniture arrangements FAILED the north Family route; rearranged candidates shown above reran.

- **A: 5/5 ground/stair approach destinations reachable; 6/6 fixture footprints accessible from reachable 5ft Medium-token center within 5ft of feature; 100% of valid sampled center points connected**.
- **B: same 5/5, 6/6, 100%**.
- Study's north exterior door is indicated as a distinct north opening in Study wing stub, with exact rear-grounds alignment **pending**.
- This is a limited *planar Great Room* route/clearance proof, **not** global house/upper-level safety, construction compliance, portal matching to existing accepted images or live Foundry certification.

Remaining hard gates: study/Family/front porch shell and paired reciprocal door anchors; Foyer source art at 1448×1086 including east enclosed stairwell vs nominal room 6×6ft (not a verified mapping to canonical grid); true upper Landing/gallery/roof alignment, stair rise/run/headroom and upper landing; scene background extent; actual Foundry Wall/vision/Region test. Keep Foyer art SHA256 `34c5e7dab1193893ef6e557745e85821362f76741464567a73120a689cb6b1e8` immutable.

## Recommendation and production stop

**B (35×40 ft)** supplies 320.5 ft² more unoccupied floor than A and is the better *visual/physical grand hub candidate*. A minimizes new house envelope impact. Both need an owner decision; neither overrides BWE-027. Before PAINT RENDER: approve one coherent whole-house geometric revision or quantified alternative, verify all reciprocal portals including immutable Foyer art, lock a semantic Spatial Blueprint and independently prepare a single inclusion-only fresh painting prompt. Rejected Great Room images/prompts remain evidence only.

**No new map art generation; no Foundry world or accepted existing art changes; no product stage promotion.** Full SQLite knowledge-base rebuild and Foundry/runtime verification are not claimed by this PREPARE.
