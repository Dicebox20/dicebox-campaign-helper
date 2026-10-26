# Cabin in the Ashen Veil — Unified Bathhouse Boiler and Rosewater Wiring Continuation
**Date:** 2026-10-26 Pacific. **Fidelity:** exact last owner message and grounded tool-operation summary, NOT a lossless native transcript.

## Owner
> Lets continue

## Standing owner decisions
A single unified Bathhouse map is the current canonical design; do not create separate BATH-03 or BATH-04 Scenes. Established DCH/Regionwright workflow applies; Chronological logs and GitHub handoffs required each bounded turn. Crooked Man Actor and full player gameplay testing remain deferred.

## Reconstructed actions
1. Bridge PowerShell verified both Foundry 30000 and Chrome Dev harness 9224 already live; checked current Regionwright source commit `3ba2510`, previous nine new passive Regions and current source/prototype APIs.
2. Audited existing Regionwright Puzzles & Locks three-ring engine/UI and two-valve Boiler pressure engine/UI; discovered generic Boiler demo defaults to [2,4] whereas approved campaign target is [2,1]. The generic demo is retained.
3. Live elected-GM Foundry read-only audit confirmed correct Cabin world, 47 Scenes, both modules active, filled six and drained eight native Regions, prior original screwdriver Region broad overlap with small drained-only Rosewater ring Region, water/sluice transaction NULL, original Bowl Item present. Wrote exact before receipt.
4. Built `studio-cav-unified-bath-interlock.js` plus tests; the native Sluice water controller now validates existing paired unified map fixtures and a drained-only ring, blocks incomplete/reserved fixtures before transitions, keeps old no-occupants checks, and retains old separate-room helper only as legacy safety if unexpected stray lower scenes exist.
5. Implemented pure click separation in `studio-cav-drained-pickups.js` to ignore original screwdriver pointer taps when click point is inside small Rosewater ring Region. Preserved existing screwdriver/Weathered Key claim logic; added tests.
6. Built canonical `cav-boiler-campaign-preset.js` and exposed it under Puzzles & Locks `boilerCampaign`; tests checked 2/1 succeeds and 2/4 fails, without touching the standalone 2/4 demo.
7. Added pure current single-map Rosewater and original Bowl activation/claim guards, preserving legacy helpers with superseded-design comments; owner four-symbol art and exact on-map Bowl pickup point still missing. Exposed read-only helpers in `studio-campaign.js`; added tests.
8. Source JS deployed with SHA256 matching installed module files, backed up installed prior scripts to local untracked docs backups. Full source/regression suite 70/70 PASS.
9. Performed one authenticated GM browser reload and readback: both modules loaded; boilerCampaign config returned [2,1]; existing six/eight Region counts and no new active Behaviors.
10. Elected GM captured native prestate and wrote `cavUnifiedBathPuzzleBinding` to exactly three new native fixture Regions (filled Boiler controls, drained Boiler controls, drained-only Rosewater), each status STAGED_DISABLED; no new Behavior. Saved receipts; no water, item, actor or token writes.
11. Added full single-map source checkpoint and JSON metadata to Regionwright, appended chronological Regionwright update log, precisely staged 14 relevant source/test/docs files with clean git diff --check. Committed/pushed exact SHA `98fdeff58e79de1c475c0946c1f2dd0d003d5bac` and verified remote branch.
12. Created DCH campaign GitHub handoff, machine-readable metadata and this honest available-message reconstruction.

## Next
Regionwright existing Boiler visual UI needs actual player-owned-token click + elected-GM server-side proof using campaign [2,1] rather than standalone demo. Rosewater rings need owner-approved four symbols and GM session, deferred until art approval. Original Scrying Bowl's exact on-map Region needs owner identification before once-only pickup. Leave both puzzle controls disabled until safe and owner ready; Crooked Man and full gameplay testing remain deferred.
