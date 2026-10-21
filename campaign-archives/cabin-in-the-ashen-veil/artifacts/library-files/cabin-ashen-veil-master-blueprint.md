# Cabin in the Ashen Veil — Master Scene Blueprint v1

**Status:** Proposed architectural adjacency blueprint (PREPARE, not approved geometry). 2026-10-17. No scene artwork or live Foundry edits.  
**Application purpose:** Bulk Scene Injector and Puzzle Matrix fixture for DiceBox Campaign Helper.  
**Location:** Neverwinter Wood.  
**Fixed brief:** 90 × 60 ft lodge exterior footprint; ground, upstairs, attic, basement; exactly three bedrooms (master, child, guest). Old and dusty, but structurally sound. Each of the 29 inventory locations receives its own individual scene in the bulk batch (including passages, small closets, and exterior locations), unless later explicitly changed.

## Visual connection blueprint

See `cabin-ashen-veil-master-blueprint.svg` and `.png` for the complete connected-room diagram. This is an **adjacency graph**, not a measured wall plan or map render. Black/gray lines are proposed accessible links, dashed lines indicate gated/secret links. Their direction and door geometry are not yet locked.

## Scene registry

| Level | ID | Scene name | Direct proposed connections |
|---|---|---|---|
| Exterior | `E07` | Forest Approach | `E01`, `E06`, `E03`, `E04`, `E05`, `E02` |
| Exterior | `E01` | Front Porch | `E07`, `G01` |
| Exterior | `E02` | Rear Porch | `E07`, `G07`, `E05`, `E04`, `E03` |
| Exterior | `E03` | Privy | `E07`, `E02` |
| Exterior | `E04` | Woodshed | `E07`, `E02` |
| Exterior | `E05` | Well & Pump | `E07`, `E02`, `E06` |
| Exterior | `E06` | Memorial Clearing | `E07`, `E05` |
| Ground | `G01` | Entrance Foyer | `E01`, `G02`, `G08` |
| Ground | `G02` | Great Room | `G01`, `G03`, `G06`, `G08` |
| Ground | `G03` | Dining Room | `G02`, `G04` |
| Ground | `G04` | Kitchen | `G03`, `G05`, `G07` |
| Ground | `G05` | Pantry | `G04` |
| Ground | `G06` | Study / Library | `G02` |
| Ground | `G07` | Mudroom | `G04`, `E02` |
| Ground | `G08` | Main Hall / Stair | `G01`, `G02`, `U05`, `B01` |
| Upper | `U01` | Master Bedroom | `U05` |
| Upper | `U02` | Child Bedroom | `U05` |
| Upper | `U03` | Guest Bedroom | `U05` |
| Upper | `U04` | Washroom | `U05` |
| Upper | `U05` | Upper Hall / Landing | `G08`, `U01`, `U02`, `U03`, `U04`, `U06`, `A01` |
| Upper | `U06` | Linen Closet | `U05` |
| Attic | `A01` | Attic Storage | `U05`, `A02` |
| Attic | `A02` | Sealed Storage | `A01` |
| Basement | `B01` | Basement Landing | `G08`, `B02`, `B03`, `B04`, `B05` |
| Basement | `B02` | Root Cellar | `B01` |
| Basement | `B03` | Workshop | `B01` |
| Basement | `B04` | Fuel / Furnace | `B01` |
| Basement | `B05` | Old Storage | `B01`, `B06` |
| Basement | `B06` | Hidden Thayan Lab | `B05` |

## Architectural circulation principles

1. **Primary circulation:** Forest E07 → front porch E01 → foyer G01 → Great Room G02. The internal ground hub G08 serves both the upstairs U05 and basement B01. No level is reachable only through a bedroom.
2. **Service circulation:** Kitchen G04 → mudroom G07 → rear porch E02 → well E05 / woodshed E04 / privy E03. The grounds are walkable via E07, so no exterior puzzle can permanently trap the party.
3. **Private level:** U05 gives independent access to master U01, child U02, guest U03, washroom U04, linen U06, and attic stairs to A01.
4. **Attic:** A01 accesses sealed room A02 through a lock that can be solved later. An ordinary floor stair is proposed rather than a magical teleport.
5. **Basement:** B01 connects independently to root cellar B02, workshop B03, furnace B04 and storage B05. The hidden laboratory B06 has a gated entrance from B05; the central hearth puzzle may operate that gate remotely, but the physical entrance is in B05 in this proposal.
6. **Puzzle chain compatibility:** Great Room G02 is the central puzzle hub; study G06, memorial E06, and workshop B03 / grounds E04 can host parallel branches. Puzzles must not override the door topology, and recovery must remain possible after failed checks.
7. **Material appearance:** dry but dusty timbers, intact floors/roof/windows, forgotten belongings; no default structural collapse. Danger and transformations are runtime states, not baked artwork.

## Geometry gates to resolve before room rendering

- 90 × 60 ft includes exterior wall envelope; determine which floor areas use the full envelope versus pitched attic and subdivided cellar. Do **not** infer that all four levels have 5,400 ft² of usable space.
- Create dimensioned, non-overlapping floor rectangles and corridors; validate thicknesses, scale, stair rise/runs, and room area. This file does not yet supply those measured rectangles.
- Assign each doorway a stable anchor key such as `dbx:ashen-veil:portal:G01:G02`, paired on both scene maps with reciprocal landing footprints.
- Establish exterior coordinates for E01/E02 door positions and the E03-E07 clearing connections. Grounds do not share the 90 × 60 ft footprint.
- Resolve whether hidden B06 fits the 90 × 60 ft envelope or occupies a separately excavated attached annex, and document that openly in geometry authority before any render.
- Register each Scene and connection in the Campaign Helper content manifest with map source hashes; generation should not fabricate Foundry UUIDs or assume successful installation.
- Validate 29 Scene IDs, symmetry of every reciprocal link, connected traversal graph, one master/child/guest bedroom each, no implicit room duplication, and no critical progression softlocks.

## Bulk creation sequence (future, not executed)

`PREPARE room-geometry manifests → STRUCTURAL_RENDER per room → STRUCTURAL_INSPECT adjacency & door anchors → FEATURE_MANIFEST / Spatial Blueprint → PAINT_RENDER → FINAL_INSPECT → BUILD 29 canonical single-Markdown macro deliverables or an explicitly accepted safe batch format → STAGE → INJECT only with runtime authority → VERIFY reciprocal transitions, walls, lighting & puzzle states → RECEIPT`.

**Source governance:** This plan is a user-requested proposal informed by repository `AGENTS.md`. Canonical database query/reconciliation and current active-stage checks still gate implementation. User approval of the concept does not itself authorize live Foundry modification.
