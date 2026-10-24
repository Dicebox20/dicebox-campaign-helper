# EXT-01 Carriage Yard / Cabin Front — First live Foundry structural Scene build

**Date:** 2026-10-23 Pacific / 2026-10-24 UTC
**Owner command:** “Alright, build the Cabin map out front.”
**Owner inspection policy:** Owner will personally inspect map presentation and gameplay. Implementation is limited to structural Walls/doors and inert named Regions; puzzle/portal scripting stays deferred.
**State:** **READY_WITH_WARNINGS** — live Scene exists and GM canvas loaded; no owner visual INSPECT PASS or player playtest yet.

## Source resolution / caveat
The front-of-cabin approach was resolved to owner-catalogued **EXT-01 — Carriage Yard / Front Estate**, adjacent to H-G02 Foyer, Grove trail, north forest maze gate, Pond, Shack, Privy and the southern arrival road.

The exact locally available source is the owner-accepted **v10 playable-archive visual-pass** image:
- Foundry path: `Maps/cabin-in-the-ashen-veil/ext-01_carriage-yard_visual-pass.png`.
- SHA-256: `d957783eeedfe640da78c8f1eeadda5135c66da05c0f3f04c9eb952f9ab34d1c`.
- 1536 × 1024 pixels; 4,312,224 bytes.
- **IMPORTANT:** A **later separately owner-accepted fresh Carriage Yard render**, generation `e5fb9677-a8f9-4fc2-b2a5-df1f83088950`, SHA-256 `5284a039c2e990f65bb116e1167e0d9bc918a9a1eb895e9c2be95a33ed6cf4f8`, was documented but its binary was not among the transferred 20-file archive and was not found in local Foundry Data. The injector does **not** claim to have deployed that newer art. The earlier accepted version is available for owner-scoped technical Scene test.
- Published EXT-01 projection plan for newer image is 300×200 ft, but anchor locations are **not** unconditionally portable between image versions. This build used visually derived anchor candidates from the installed earlier image, explicitly marked provisional.

## Canonical BUILD/STAGE
- One Markdown with exactly one self-contained JavaScript native Scene injection macro: `builds/EXT-01-front-estate-structural-shell-build-v001.md`.
- Local SHA-256 of BUILD: `20ce2d7147102e9646ea77440a9153c5b07eab583f43937fa71184c53a9eec96`.
- `validate-dicebox-build.mjs`: **PASS**, zero violations.
- `dicebox-scene-injector-build/v2`; scale `battlemap-120`, Gridless, 120 pixels/5ft, 60×40 logical spaces, 7200×4800 Scene pixels, no Scene padding, 0 discoveries.
- The image was served through the exact Foundry same-origin path and checked by native JS for byte count, PNG signature, intrinsic 1536×1024 dimensions and exact SHA-256 **before any writes**.
- The native Foundry `Scene`, one `Level`, 21 `Wall` and 8 `Region` documents passed unsaved `validate({strict:true})` including empty Region behaviors and level bindings.
- Exact world/origin/version/system/elected GM all passed: `http://127.0.0.1:30000/game`, `cabin-in-the-ashen-veil`, Foundry `14.367`, dnd5e `5.3.3`, elected **Gamemaster 2**.
- Once-only installer request: `cav-ext01-first-native-scene-install-20261023-v001`, success `READY_WITH_WARNINGS`. No duplicate or foreign Scene overwritten.

## Authoritative persisted readback
- World Scene count after build: **2** (existing H-G06 Great Room plus EXT-01).
- Scene: **EXT-01 - Carriage Yard and Cabin Front**.
- Scene ID: `CAVEXT01Yard0001`; UUID: `Scene.CAVEXT01Yard0001`.
- Level: one `defaultLevel0000` (Estate Ground), exact approved archived source background.
- **21 Level-bound Walls**, including 2 normal native door Walls: `CAV01W0000000006` (closed Foyer entrance), `CAV01W0000000016` (locked north iron maze gate), rest fixed walls. The 21 candidate source-art matched footprint/fence line segments await owner visual inspection and wall collision checks.
- **Eight Level-bound, inert named Regions** (zero RegionBehaviors):
  1. `EXT-01 - Cabin Front Porch`
  2. `EXT-01 - Iron Maze Gate`
  3. `EXT-01 - West Grove Trail`
  4. `EXT-01 - South Arrival Road`
  5. `EXT-01 - Pond and Dock Approach`
  6. `EXT-01 - Donovan Shack Approach`
  7. `EXT-01 - Privy Approach`
  8. `EXT-01 - Family Carriage`.
- `canvas.ready = true`, `canvas.scene.id = CAVEXT01Yard0001` after Scene.view(). `foundry.utils.srcExists` = true for the Level background.
- User-manually-created `H-G06 - Grandfather Clock` Region in the existing Great Room remained untouched and present.
- **No** teleport/RegionBehavior, gate-unlock puzzle script, carriage-loot state, lighting effects, ambient sounds, actors/tokens, journal/gameplay rolls, or Scene activation for players.

## Durable local artifacts
Directory: `C:\Users\rujie\AppData\Local\FoundryVTT\Data\dicebox-campaign-helper\ext-01-build-v001`:
- `EXT-01-build.md` (validated single-macro source)
- `verification-receipt.json`, `READY_WITH_WARNINGS`
- `state.json`, `COMPLETE / READY_WITH_WARNINGS`.
Receipt write request: `cav-ext01-durable-install-verification-receipt-20261023-v1`; completed and immediately reread. Technical canvas verification: `cav-ext01-scene-canvas-native-readback-20261023-v1`; completed successfully.

## Owner inspection and future work
- **Owner responsible for visual/gameplay inspection**, not assistant-auto-PASS.
- Geometry and image edition remain explicitly provisional. Owner may approve the archive visual-pass image for use, request the newer already-approved image be recovered and swapped, or request structural Wall corrections. Do not claim newer source delivered or currently installed.
- Verify visual wall alignment at cabin roof/front porch, north gate, west road, shack, privy and southern approach; adjust if owner reports issues. Native untested door click, player-token line of sight, movement, reciprocal named Regions and scale still need later tests.
- Do not silently promote staging/geometry to permanent canonical architecture or start puzzle mechanics until authorized.

**Result:** A second campaign Scene was successfully installed; not a final physical/playtest certificate.
