# Tram Scene Playability Checklist

Status: `active goal` — this checklist is the delivery definition for the
Ascendancy Tram Depot Scene. It does not authorize a fixture or Ballad write.

Execution is controlled by the machine-readable
[ACTIVE-TRAM-SLICE.json](ACTIVE-TRAM-SLICE.json). Run `npm run workflow:check`
before selecting work. The long checklist below remains the complete delivery
definition, but only the checker's single current stage may advance.

## Change card

| Field | Delivery definition |
| --- | --- |
| Outcome | One playable Ascendancy Tram Depot Foundry Scene: players see a blocked depot and can repair, route, and release the eastbound rail to Core. |
| Acceptance observation | A GM and a separate player-compatible client can see the correct Tram Scene; the board cannot be walked around; the Rush Hour board opens and completes the known legal route; the named Regions/puzzles work; and the released route corresponds to the Core west entry. |
| Owner | DiceBox Campaign Helper Foreman. |
| Target / authority | `dbx-test-world` fixture first; Ballad only after fixture acceptance and a fresh current active-GM gate. |
| Allowed scope | Reviewed Tram renderer, helper-owned Walls/doors, Background Objects, six dynamic car Tiles, fixed named Regions, narrow Dalton/Andrew and Rush Hour puzzle access, and owned navigation binding. |
| Deterministic check | Source/stage parity; 1536x1024 hash; locked coordinates; canonical six-car model and six-move route; exact owned-ID preview; focused tests. |
| Live check | Before visual or coordinate checks, maximize the actual browser window, clear temporary viewport emulation, and reread its native usable dimensions. Then run one fixture GM visual smoke test per slice, followed by a target-bound Ballad preview/apply/reread and a separate player-compatible visual check. |
| Stop / recovery | On a second failure in the same runtime class, capture it, query the KB, reduce it to a narrow reproduction, validate one fix locally, then retry only after reread. |

## Locked contract

- The Scene is `Ascendancy Tram Depot`; the Spatial Blueprint owns all geometry.
- Renderer art is 1536x1024, contains fixed depot architecture and an **empty**
  Rush Hour lattice, and never contains movable tram cars.
- The six-by-six board is `x=420..1080`, `y=210..780`; each cell is `110x95`.
- Tram is west of Core. Its outer east door is `(1512,447.5)` and corresponds
  only to Core's west entry `(24,447.5)`.
- There are 11 fixed Walls including the three door openings. The eastbound
  rail exit is not walkable until the routing puzzle is solved.
- Six movable native Foundry Tiles use `dbx:tile:tram-x/o/q/b/c/r`; optional
  footprint Regions mirror their Tile bounds exactly. They never replace the
  36 fixed controller Regions.
- Dalton remains the repair-puzzle identity. Andrew McConaughey is an
  additional authorized controller for that repair; Andrew owns the routing
  puzzle identity.

## Delivery checklist

### 1. Renderer and fixed depot presentation

- [ ] **Reviewed renderer:** use the neutral Tram v6 candidate only after its
  current absolute path, SHA-256, 1536x1024 dimensions, and measured overlay
  are recorded. Candidate art remains unbound until this check passes.
- [ ] **Visible blocked board:** show the empty 6x6 rail lattice,
  fixed barriers/gates, the upper-right Dalton repair bay, and the eastbound
  rail corridor. Players must not be able to visually or physically walk
  around the routing board.
- [ ] **Background Objects:** place the rail-grid, eastbound rail, and three
  fixed gate visuals at the Blueprint coordinates. These are visual-only;
  create native Foundry Tiles only if the object needs independent runtime
  state.

### 2. Native Scene geometry

- [ ] **Walls and doors:** preview then install only helper-owned Walls.
  Reread 11 fixed Walls and three door anchors: ingress `(420,447.5)`, yard
  exit `(1080,447.5)`, and outer east `(1512,447.5)`.
- [ ] **No bypass:** GM visual check and collision check confirm the board is
  enclosed except for the reviewed door/gate corridors.
- [ ] **Core correspondence:** reread both Scene anchors and confirm the
  Tram east door and Core west entry share the locked `y=447.5` centerline.

### 3. Rush Hour playboard

- [ ] **Static board anchors:** create/reread 36 controller Regions,
  `dbx:region:tram-slot-r1-c1` through `dbx:region:tram-slot-r6-c6`, each
  `110x95` at the locked grid coordinates.
- [ ] **Movable cars:** create/reread exactly six car Tiles using the canonical
  `x/o/q/b/c/r` mapping. Do not use stationary visibility variants or bake
  cars into the renderer.
- [ ] **Puzzle acceptance:** the GM opens the standalone Rush Hour dialog,
  sees only legal moves, performs one legal move, and can finish the known
  route `b -1, c -3, o +3, r -2, q +2, x +3`.
- [ ] **State update:** one reviewed operation moves the affected Tile(s) and
  any required mirrored footprint Region(s) together, followed by an
  authoritative reread. Timeout/partial outcome means reread before retry.

### 4. Named non-board Regions

- [ ] **Dalton tram repair station:** `dbx:region:tram-dalton-repair`,
  `(1120,120,300,220)`, over the upper-right repair machinery bay.
- [ ] **Physical tram troubleshooting station:**
  `dbx:region:tram-cooperative`, `(1120,640,300,220)`, over the lower-right
  two-person troubleshooting platform.
- [ ] **Tram rail to Core controls:** `dbx:region:tram-exit`,
  `(1080,400,390,95)`, over the eastbound rail corridor. It stays blocked
  until routing completion and asks **“Do you wish to proceed?”** before a
  teleport; cancel leaves the token in place.
- [ ] **Binding record:** each region retains its DiceBox stable ID and gets a
  separate observed Foundry UUID. The UUID never replaces the stable ID.

### 5. Puzzle access and authority

- [ ] **Dalton repair:** verify the actual repair dialog opens from the repair
  Region and completes as `dbx:puzzle:dalton-tram-repair`.
- [ ] **Andrew paired repair control:** verify Andrew McConaughey can open the
  same Dalton repair dialog without changing Dalton's canonical identity.
- [ ] **Andrew routing:** verify the canonical routing board is reachable as
  Andrew's puzzle without needing a scene-activation side effect.
- [ ] **Physical cooperation:** the lower-right cooperative Region must remain
  a Scene-owned physical interaction, not a duplicate Regionwright puzzle.
- [ ] **No surprise automation:** no player-facing Macro, foreign
  RegionBehavior, puzzle state, Regionwright behavior, or unrelated document
  is created or altered unless it is explicitly previewed and approved.

### 6. Fixture then Ballad acceptance

- [ ] **Fixture gate:** confirm exact data root/world/version/module hashes,
  an elected GM, module load, no relevant console error, and a visible dialog
  before any fixture Scene write.
- [ ] **Fixture Scene acceptance:** after preview/approval, reread the renderer
  through the initial Level/background surface; owned Walls, doors, Regions,
  car Tiles, and preserved foreign state must match the checklist.
- [ ] **Ballad gate:** reread the current Ballad Scene and active-GM authority
  immediately before each approved write. Mutate only reviewed Tram-owned
  renderer/geometry/Tile/Region bindings.
- [ ] **Ballad acceptance:** authoritative post-write reread plus separate GM
  and player-compatible visual audits prove the Scene is playable. This is the
  only condition that closes this goal.

## Explicitly parked

- The other three Ascendancy Scenes, Core final activation, and campaign-wide
  progression are outside this Tram delivery slice.
- Existing historical fixture/reset and broad installer receipts are context,
  not acceptance evidence for this checklist.
- No result here is a Ready-to-Play claim until the Ballad acceptance items
  above have current target-bound evidence.
