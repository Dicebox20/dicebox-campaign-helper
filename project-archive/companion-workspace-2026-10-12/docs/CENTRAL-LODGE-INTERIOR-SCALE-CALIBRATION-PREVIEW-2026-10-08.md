# Central Lodge Interior Map Scale Calibration — PREVIEW only
**2026-10-08 | CL-SCALE work unit | No live Scene changes | Author method/visual acceptance pending**

## Current exact Foundry baseline
- All 21 Central Lodge Scenes: gridless (`grid.type=0`), original `grid.size=120`, distance `5 ft`, canvas image and Scene size `4320×2880`, no padding. The current 21 Scenes/202 Regions/119 RegionBehaviors/33 Items, ledger revision 2 must be preserved.
- Canonical authoring contract from `DiceBox_Central_Lodge_Workstream_Handoff.md`: `battlemap-120` means 120 pixels per 5-foot logical square and `Scene pixels = logical columns × 120, logical rows × 120`. The default 36×24 footprint belongs to the forest map family; lodge interiors may use different logical footprints if PREPARE authorizes them. Token actor/system size is authoritative; token visual scale is **not** a legitimate map-scale repair.
- Present problem: all interiors inherited 36×24 (180×120 ft) regardless of visual architectural size. With Medium tokens 1×1, their 120px footprint may be tiny against doors/furniture, especially M1/M2/F1.
- Measurements are **wall-door line spans and smallest Region shape dimensions**, not calibrated distances of artwork features. A long portal may be a double door or arch; exact final values require art inspection and user visual acceptance.

## Candidate alternatives
**A. Per-Scene grid overrides, preferred safe technical pilot:** retain original high-resolution `4320×2880` artwork and every absolute-pixel Wall, Region, Tile, AmbientLight, sound, token, and route footprint. Change only `Scene.grid.size` from 120px to the approved grid size (while retaining `type=0` gridless, `distance=5`, `units=ft`). This is a deliberate, documented exception to the `battlemap-120` source profile; the 5-foot actor token becomes larger relative to architecture. Pre-existing token top-left positions do not automatically preserve visual center; handle M1 Ret separately with exact authorized token reprojection, not silently.
**B. Strict `battlemap-120` preservation:** retain `Scene.grid.size=120`, but resize each Scene image to the derived width/height shown below. Every absolute-pixel Wall endpoint, Region shape, Tile, light, sound, annotation, token, scene edge/crop and travel anchor must be scaled **with the exact same factor**. Preserve an original Scene/image snapshot and use a deterministic geometry transform; do not merely change image width or resolution alone. Source artwork detail decreases. This requires more exhaustive testing and a separate user-approved migration.

## Proposed conservative starting points — NOT approved or installed
| Scene | Interior | Narrowest wall door (px) | Smallest Region span (px) | Candidate grid px/5ft | Visual token-size gain | Option B resized image (px) | Placed tokens |
|---|---|---:|---:|---:|---:|---:|---:|
| B1 | Cellar & Utility Basement | 181 | 330 | 150 | 1.25× | 3456×2304 | 0 |
| B2 | Hidden Annex | 300 | 540 | 240 | 2.00× | 2160×1440 | 0 |
| C1 | Hidden Chapel | 300 | 360 | 240 | 2.00× | 2160×1440 | 0 |
| C2 | Cult Undercroft | 200 | 450 | 160 | 1.33× | 3240×2160 | 0 |
| M1 | Entrance Hall & Great Room | 720 | 520 | 360 | 3.00× | 1440×960 | 1 |
| M2 | Study, Parlor & Formal Rooms | 530 | 430 | 320 | 2.67× | 1620×1080 | 0 |
| M3 | Kitchen & Service Wing | 320 | 430 | 240 | 2.00× | 2160×1440 | 0 |
| N1 | Underworks Railway Station | 180 | 300 | 150 | 1.25× | 3456×2304 | 0 |
| N2 | Grotto Garden Station | 200 | 430 | 160 | 1.33× | 3240×2160 | 0 |
| N3 | Collection Vaults / Depot | 160 | 470 | 120 | 1.00× | 4320×2880 | 0 |
| U1 | Family & Guest Rooms | 240 | 340 | 180 | 1.50× | 2880×1920 | 0 |
| U2 | Servants, Nursery & Attic | 210 | 420 | 160 | 1.33× | 3240×2160 | 0 |
| F1 | Infernal Threshold | 480 | 430 | 320 | 2.67× | 1620×1080 | 0 |
| F2 | Final Summoning Chamber | not measured | 500 | TBD | unknown | art review required | 0 |

The proposed values preserve at least **15% clearance** (smallest door and smallest Region span relative to a 1-square token) in a simple size check; this does not prove geometric/path collision free. The smallest Region may be a nontraversal narrative trigger; actual corridors and 2×2/3×3 large actors need separate collision tests. N3 is left at 120px because of its narrow doors. F2 has no measured door and needs map-art visual inspection before selecting a grid.
Outdoor E1–E4 and long tunnel T1–T3 are excluded from the interior pilot; their current 120px grid is unchanged.

## Pilot recommendation
**M2 first**: `JZkxX6lUQe8Nc8xJ`, 0 placed tokens, door spans 530px and 900px, smallest Region 430px; candidate grid `320px per 5 ft` (gridless). M2 has a new serialized Founder Portrait behavior and many narrative Regions, so acceptance must include exact no-write source/flags and a recheck of available Region footprints. Preview at 320 only; no live change until user chooses grid exception vs canonical 120px art+geometry resizing.
**M1 next, not part of pilot**: candidate 360px grid, but contains Ret at token x2256/y1655 with 120px square. Preserve its center explicitly in any later accepted Scene change and independently verify against nearby walls, puzzle Regions, and route anchors.

## Strict safety gates
1. User selects approach A or B and approves exact first-pilot scale. No silent, mass 21-Scene updates.
2. Record accepted per-Scene scale plan in roadmap/checklist and canonical KB, with old/new source fingerprints and versioned rollback.
3. For grid-only option, exact Foundry read-only PREVIEW and one guarded single-Scene `grid.size` mutation, independent readback; preserve `grid.type=0`, distance5ft, scene size and all original geometry/IDs/Items, Actor ownership and current puzzle ledger.
4. For resized-art option, stage transformed image/scene geometry entirely offline, verify wall/Region alignment and scene origin; **do not** overwrite original assets or reuse old Scene build installers.
5. Re-evaluate CL50 route token footprints and destination clearances after **any** grid change in a route Scene. Freeze the existing CL50 installers and prior landing PASS receipts until recalibrated.
6. Never change token texture ratios as a substitute for fixing map scale. No player canaries until the final campaign playtest; visual calibration approval may use a no-write visual comparison only.

**Status: BLOCKED ON METHOD / PILOT APPROVAL**. The audit and table are informative candidates, not recovered per-room PREPARE decisions or gameplay certification.


## Live baseline drift observed during calibration review (2026-10-08)
- Last verified Foreman checkpoint was revision2. Read-only Foundry audit later observed ledger **revision3** at `2026-10-08T19:07:46.521Z`, SHA256 `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9`.
- Ledger Notice keys are now `observation:e1`, `e1`, and added `m1`. Existing E1 recent-use evidence remains true; M1 clock, M2 portrait observation and N3 branch completion flags remain false.
- CL90 v008 read-only source regression **FAIL** only on the former revision2 and exact 2-notice baseline assumptions (`Kernel/ledger drift`, `E1 notice keys drift`), not on missing Scenes/Regions/behaviors/Items. This is an external live-state change relative to the last verified checkpoint, **not evidence that calibration modified Foundry**. Preserve it; do not reset or revise unrelated puzzle state, and don't certify a new baseline without fresh revalidation.
- No Scene grid or image changed. All 21 Scene grid sizes remained 120 during the drift readback. The future M2 grid pilot must use an exact fresh ledger/Scene fingerprint and keep runtime/GM-owned state intact. User-authorized visual map-scale method remains pending.


## User authorization: per-Scene grid calibration, 2026-10-08
The campaign author explicitly approved the grid-size method for interiors and delegated selection of the remaining Scene grid sizes to the Foreman, without separate approvals for each one. This supersedes the pending method-choice requirement; it does NOT waive exact technical preflight/coordinate checks or justify changes to scenes without defensible scale evidence. Gridless mode, original 4320×2880 pixel art, walls, Region shapes, scenery, lights, Items and token/Actor ownership stay unchanged. 
**First accepted pilot:** M2 Scene JZkxX6lUQe8Nc8xJ, grid.size 120 → 320, distance 5 ft, type gridless (0), no placed tokens. Exact pre-write Scene source SHA c96c3026a7b5ae152871ceb5191770f3474fd9410958a1701bcff4c3c34d72d5, geometry SHA e6790e102c446d20f277723855465145d588190efb16f8f5bd56bb3ca9f302e0; ledger revision3 SHA e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9 observed with new m1 Notice. The ledger remains sovereign; do not change or revert it.
**Subsequent interiors:** allow sequential bounded Scene-only corrections after each independent readback and checkpoint using measured candidate clearances; no bulk mutation. N3 conservatively stays 120 due narrow 160px door and route safety; F2 remains uncalibrated until visual measurements are credible. Other users' live tokens require their own center/clearance safeguard.
**Transport safety:** Existing CL50 route landing receipts are stale for any regridded Scene; CL50 live route installations remain quarantined until a new complete footprint/pathing review.


## M2 live grid-size pilot installed and independently verified
- User-authorized grid-only correction of M2 Scene `JZkxX6lUQe8Nc8xJ`, gridless `grid.size 120→320`, distance 5ft, dimensions 4320×2880. Exactly one Foundry Scene.update using `autoReposition:false` committed through authorized Assistant Gamemaster. M2 was inactive and had no placed Tokens.
- Before write: full `Scene.toObject()` backup `outputs/foreman-checkpoints/clscale-m2-before-grid320-v001.json`, original full source SHA `c96c3026a7b5ae152871ceb5191770f3474fd9410958a1701bcff4c3c34d72d5`, geometry SHA `e6790e102c446d20f277723855465145d588190efb16f8f5bd56bb3ca9f302e0`.
- No-write PREVIEW PASS 21 Scenes/202 Regions/119 behaviors/33 Items, ledger revision 3. One authorized APPLY PASS, new M2 scene SHA `e9663751ca317c5922b4ce9ae97d2c4cda1b84f79fa23599b7a56d6140f3d305`; normalized copy restoring just grid size and expected Scene modifiedTime/lastModifiedBy exactly reproduces original scene SHA. Independent read-only FINAL PASS: all 12 Wall endpoints, 15 Region shape geometries, 6 lights and other placed documents pixel-identical; source, Scene dimensions, puzzle scripts, Items, ledger revision3 SHA `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9` preserved. All 20 other Scene grids still 120.
- This is *source-verified* pixel geometry conservation, not yet game-screen visual fit or player pathing acceptance. Keep CL50 route installers quarantined and re-test landing clearance after new grid sizes.

## M3 automation transport blocker (post-M2 checkpoint)
- M2 320px grid was already applied, independently verified and checkpointed in work unit `central-lodge-clscale-m2-grid320-verified-v001`.
- During next token-free M3 Scene (candidate 120→240px) baseline-source read via `exec-page.mjs read`, two bounded reads failed before returning Foundry state. Playwright reported `browserType.connectOverCDP: Timeout 30000ms exceeded` after WebSocket establishment at `127.0.0.1:9223`. Port 9223 was still listening (owning process 30548), but CDP session attach did not complete.
- **No M3 Scene write, backup, or grid change was attempted**. Only a read-only baseline script `clscale-m3-baseline-readonly-v001.page.js` was staged; no generated apply script and no replay.
- Under Foreman repeated-same-class failure rule, stop all live Scene grid updates and preserve the M2 backup/source receipt. Recovery must inspect CDP ownership and active browser state read-only, reconcile pending operations before any restart or reconnection, obtain a new exact M3 baseline, and continue only after reliable source read succeeds.
- The user already delegated calibration authority for all interiors; no per-room approval prompt is needed. M1 Ret token needs separate center-preservation, F2 unresolved scale, N3 remains120px; CL50 route installers quarantined.

## M3 Kitchen grid correction after CDP recovery (2026-10-08)
- Foundry developer Chrome reconnected and the game became ready; subsequent read-only source confirmed revision3 ledger SHA unchanged, but initial M3 baseline script incorrectly counted all 183 Foundry Scenes rather than only the 21 canonical Central Lodge Scenes. Fixed guard scope; no live write during those diagnostic failures.
- M3 Kitchen Scene `LXTA8mx1rJ2L6e2J` original gridless 120px/5ft, 4320×2880, no Tokens; saved exact full source backup `outputs/foreman-checkpoints/clscale-m3-before-grid240-v001.json`.
- No-write PREVIEW PASS, one authorized `Scene.update({'grid.size':240},{autoReposition:false})` PASS, independent full Scene normalized SHA PASS, preserving all 14 Walls/10 Regions/4 Lights, scene dimensions, art and other fields except authorized grid and audit timestamp.
- Original full Scene SHA `ffdbd64f0df881239e407c1d45fef68a655698546837a50f30b7fd6255efec8f`; final SHA `6604bdf528f9e6609f3fa2b53c94c1c49e5ba679f0dd90c0f2e9c32cf86eacc6`. Ledger revision3 and SHA unchanged; no player testing performed.

## B2 Hidden Annex 240px grid verification (2026-10-08)
- Scene `5K1uASAARnX8aZhP`, gridless `grid.size: 120→240`, retained 5ft distance, same 4320×2880 art.
- Full before `Scene.toObject()` backup in `outputs/foreman-checkpoints/clscale-b2-before-grid240-v001.json`; before source SHA `9302b0144902eff5223c0904451b72790c7a6864c81b7066e604155f22435db3`.
- No-write exact roster/ledger/source PREVIEW PASS, single guarded Assistant Gamemaster Scene.update with `autoReposition:false` PASS; independent final normalized full-source readback PASS, after SHA `53e20aceaa543608212bf5e33034a47ea47ddfd34f49d8cef8e0c456f203d581`. All 22 Walls, 10 Regions, 3 Lights, all other Scene metadata, original images and pixels preserved. B2 had zero Tokens.
- Current ledger revision3 SHA `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9` unchanged. No player gameplay acceptance, CL50 route installs remain quarantined.

## B1 Cellar 150px grid verification (2026-10-08)
- Scene `0CSBwzcszPKyaB8u`, gridless `grid.size:120→150`, retained 5ft distance and 4320×2880 source art.
- Complete `Scene.toObject()` backup `outputs/foreman-checkpoints/clscale-b1-before-grid150-v001.json`; SHA before `c23fd9e2736cd7dbde05ade5480d078f4b760756b6988dd1fd4d048bb9fb232c`.
- Exact canonical roster/ledger/source PREVIEW PASS, one Assistant Gamemaster Scene.update `grid.size:150` with `autoReposition:false` PASS; independent normalized full Scene source readback PASS, after SHA `ec8637a25258c1e3d207b0f4f4d31aa7d40da316599e0184618bcebb67c95c20`. All 24 Walls, 11 Regions, 3 Lights, other source metadata and images unchanged except grid and audit timestamp. No placed B1 Tokens.
- Ledger revision3 SHA `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9` unchanged. Actual player visual acceptance/pathing deferred. CL50 route installer still quarantined.


## C1 Hidden Chapel grid-size verification (2026-10-08)
- User-delegated grid-only correction of C1 Scene `EDdktL7VUihbpKe9`, gridless `grid.size: 120→240`, retained 5ft distance, original 4320×2880 artwork and all pixel geometry.
- Exact full `Scene.toObject()` backup `outputs/foreman-checkpoints/clscale-c1-before-grid240-v001.json`, original SHA `664816c5ff2c42521682f9bcdc5ec5ac7b1e52cc5760a75174f84d5c538d3fc1`.
- Fresh exact canonical roster/ledger/Scene source no-write PREVIEW PASS. One Assistant Gamemaster `Scene.update({'grid.size':240},{autoReposition:false})` PASS. Independent full Scene source reread PASS with updated SHA `80ce2a899ad5304103c6e14b8b84ad4b3fc6d9e8962534990890489df82d3c7a`; normalizing grid size and Scene update audit _stats exactly reproduces the original SHA. All 21 Walls, 10 Regions, 3 Lights and other source data unchanged, no placed Tokens.
- Ledger revision3 SHA `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9` unchanged. Final real-player/visual acceptance deferred and CL50 railway installers quarantined.
