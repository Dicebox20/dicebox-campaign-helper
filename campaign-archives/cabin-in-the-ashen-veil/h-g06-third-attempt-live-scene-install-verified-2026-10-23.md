# H-G06 Great Room — Third installation attempt: LIVE FOUNDRY SCENE CREATED

**Date:** 2026-10-23 Pacific / verified on October 24 UTC
**Owner instruction:** Third attempt to install the approved Great Room. Owner previously locked interior shell scope to necessary walls and named inert Regions only, postponing puzzles.
**Final status:** `READY_WITH_WARNINGS` — Scene exists and is visible to GM; not a complete gameplay/architectural certification.

## Deterministic inputs
- Exact author-accepted background: `Maps/cabin-in-the-ashen-veil/h-g06-great-room-owner-approved.png`.
- PNG SHA-256: `c7e5305718d5aea1ddbcd374d0374f51b714bf6d860adf0cc0aabb3a29a4f0ee`, native 1173x1341, 2,800,071 bytes.
- One Markdown / one JS macro BUILD: `campaign-archives/cabin-in-the-ashen-veil/builds/H-G06-great-room-structural-shell-build-v001.md`.
- Exact staged BUILD artifact SHA-256: `dac09f1548126ada4017c8cddad82e2ad29c8e1b007d9bf253060e13bb41a645`.
- `tools/validate-dicebox-build.mjs` outcome: **PASS**, no violations. Contract `dicebox-scene-injector-build/v2`, Gridless `battlemap-120`, 7x8 logical spaces = 840x960 Foundry pixels, 5ft per 120px, 0 discoveries.
- Site: exact `http://127.0.0.1:30000/game`, world `cabin-in-the-ashen-veil`, Foundry `14.367`, D&D5e `5.3.3`.
- Elected active-GM gate **PASS**: browser user `Gamemaster 2` exactly matched `game.users.activeGM.id`, authorized GM true at execution.
- Scene creation was performed through the browser Foundry native `CONFIG.Scene.documentClass.create` with exact ID checks, live same-origin fetched asset digest, unsaved native schema-validation, preserved existing state and authoritative post-commit reread.
- The single build used native `Level`, `Wall` and `Region` docs and no RegionBehavior or scripts.
- Bridge execution id: `cav-hg06-single-macro-native-install-20261023-v001`; completed successfully; single console receipt `READY_WITH_WARNINGS`.

## Live Foundry readback
- World Scene count: **1**.
- Name: **H-G06 - Great Room**.
- ID: `CAVHG06GreatRoom`; UUID: `Scene.CAVHG06GreatRoom`.
- One Ground Floor Level `defaultLevel0000` with exact approved background.
- Grid `0` / size `120` / distance `5` / units `ft`; bounds `840x960`, padding 0.
- **Five Level-bound inert Regions, zero RegionBehaviors**, stable IDs:
  - `CAV06R0000000001`: H-G06 - Foyer Doorway
  - `CAV06R0000000002`: H-G06 - Dining Room Doorway
  - `CAV06R0000000003`: H-G06 - Allen Study Doorway
  - `CAV06R0000000004`: H-G06 - Rear Family Room Doorway
  - `CAV06R0000000005`: H-G06 - Upstairs Staircase
- **Eight Walls inserted by this exact validated injector**, IDs `CAV06W0000000001` through `CAV06W0000000008`, all Level-bound and provenance flagged.
- **Four additional normal native door Walls** were found **after Scene viewing**; the injector did not include these IDs and they carry no Dicebox ownership flag. Unknown author/automation; **do not infer who created them**. They span the north, south, west, east portal gaps:
  - East: `OQLT5iJSa5NcnYwA`
  - South: `l1og6l02BStNP7i7`
  - West: `bGo1k1MucHATvEOh`
  - North: `ZRq0Rj6nxSFhEtdf`.
- Later independent readback: **12 total Walls (8 managed + 4 unowned door Walls)**, all Level-bound; 5 Regions, 0 RegionBehaviors. The four unowned door documents were **preserved unmodified**.
- GM canvas `canvas.ready=true`, currently viewing `CAVHG06GreatRoom`; scene asset `foundry.utils.srcExists` returned true.
- The initial native post-create receipt correctly observed 8 Walls; the extra four doors appeared before the later independent verification. The first receipt's wall count was accurate at time of receipt, not a final-count guarantee.

## Known caveats and future gates
1. **Physical scale is a reversible TEST**, based on owner-accepted portrait artwork and formerly **unapproved** Candidate B 35x40-foot study. This action **does not promote Candidate B into the canonical whole-house spatial blueprint**. Preserve Foyer source scale/geometry.
2. Named doorway Regions do **not** transition scenes. No teleport, lock/key puzzle, discovery, loot, timing, actor, item or RegionBehavior installed. The unrelated/unattributed native door Walls are structural documents, not implemented puzzle state.
3. Wall art alignment and 5-ft opening estimates are based on candidate spatial reconciliation/native dry-run, not independent full token collision playtest. Door states, cross-scene arrivals, upper Landing and neighbor scale remain future test tasks.
4. Four native door Walls have unverified provenance and should be audited before Regionwright/Compiler reconciliation, to prevent duplicates or accidental deletion of foreign state.
5. Scene was **viewed** on the GM2 canvas but **not activated for players** by the installer.

## Durable local artifacts and chronology
- BUILD file: `C:\Users\rujie\AppData\Local\FoundryVTT\Data\dicebox-campaign-helper\h-g06-build-v001\H-G06-build.md`.
- Validator: colocated `validate-dicebox-build.mjs`.
- Completion receipt: colocated `verification-receipt.json`.
- Automation state: colocated `state.json`, `COMPLETE / READY_WITH_WARNINGS`; compiled art and build hashes recorded.
- Readback request `cav-hg06-post-install-authoritative-verification-20261023-v2` confirmed 1 Scene, 1 Level, all bound, asset exists, GM canvas ready.
- A first post-view verifier mistakenly called JavaScript array `.includes` on native Foundry Level collection, then a subsequent local receipt erroneously expected only the initial 8 Walls. Both diagnostic failures were corrected **read-only**; **no additional Scene installation was replayed**. The final receipt is `cav-hg06-durable-verified-receipt-write-20261023-v002`, completed successfully, documenting 12 Walls and five inert Regions.
- Gameplay staging next step: independently inspect the map, wall endpoints and four door states with player-token movement canary; finalize house-scale blueprint before permanent geometry promotion; begin later puzzle pass only when owner authorizes.

**Separation of evidence:** Accepted artwork and created Scene are verified; full puzzle and player-interaction gameplay is NOT verified. 
