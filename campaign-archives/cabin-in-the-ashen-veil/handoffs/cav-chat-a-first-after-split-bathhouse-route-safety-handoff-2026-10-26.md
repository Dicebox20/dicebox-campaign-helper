# Cabin in the Ashen Veil — Chat A Paired Bathhouse/Pond/Aqueduct Safety Handoff

**2026-10-26 Pacific, 15:30–15:44. Owner direction:** “get started on your tasks, I sent [the late-game handoff to Chat B].”
**Chat role:** A — campaign coordinator, early/midgame source/GM integration; Chat B — independent late-game source-only workstream. No unverified direct Chat B acknowledgement or native message dispatch is claimed.

## Outcome — FIRST CHAT A POST-SPLIT BATCH COMPLETE
- An authenticated **live elected-GM Foundry read-only audit** confirmed current Pond full artwork and level, paired unified filled/drained Bathhouse map dimensions and Region geometry, original Trail→Bathhouse entry, **both enabled Bathhouse return portals**, exact four shared Boiler/Basin Regions, drained-only disabled Rosewater Region and approved `rose/sun/moth/thorn` symbols. Four pre-existing native Aqueduct/Forest Well teleports remain correctly disabled.
- Actual direct Regionwright routing API `checkAqueductRouteForWater("closed")` returned `{status:"ready",commissioned:false}`, and `describeAqueductRouting().status="verified-topology"` with all five protected Aqueduct/Forest Well/chase behaviors disabled.
- **Safety defect fixed** in existing `modules/regionwright/scripts/studio-cav-water-controller.js`: its paired `geometryEqual()` could dereference a missing return teleport or accept a disabled/retargeted return. It now returns FALSE when either filled/dry return RegionBehavior is missing, disabled, malformed, different ID, different geometry or not targeted to the original Trail `Scene.CAVTRAILScene001.Region.N5LomZ7TrVBMoExk`. The original return Behavior stable ID on both Scenes is `EK3UbdrVWwe28PmW`. Sluice preflight requires this verification before changing water.
- Four new Node regression tests `tests/cav-bathhouse-return-route-failclosed.test.mjs` cover valid dual returns, missing/disabled/malformed Behaviors, wrong destinations/IDs/shapes/grid, and absent scene/region fail-closed. Full Cabin source suite **87 PASS, 0 FAIL** (up from 83).
- Source deployed to installed `regionwright` module with exact matching **SHA256 `331E4685418718E88E19D25C72020D6049BD7FF57185BE0D8A1A53CEB56F6551`**; one correctly guarded live Foundry GM page reload SUCCEEDED. Post-reload native elected-GM source readback confirmed `geometryEqual(full,dry)===true`, `inspectUnifiedBathFixtureWaterSafety().ok===true`, and original strict Rosewater sluice blockers unchanged. No client gameplay, forced Crank, water operation, token, Item, world Region or Scene write.
- Regionwright source commit **`54faf5c29b75cd8ef4b3ea26eda6d3ed0f2db9a8`** pushed to **`Dicebox20/regionwright`** branch `codex/cav-sune-integration-20261026`, exact `git ls-remote` HEAD VERIFIED. Scope exactly five files: updated water controller JS, one new test, source report, JSON manifest, chronological source log. Unrelated repo files untouched.

## Read-only LIVE verification evidence (owner machine)
- `C:\Users\rujie\AppData\Local\Programs\Chrome for Testing Dev\utility-harness\artifacts\cav-chat-a-unified-bath-pond-trail-aqueduct-geometry-audit-20261026.json`
- `...\cav-chat-a-aqueduct-live-pregame-routing-ready-20261026.json`
- `...\cav-chat-a-safe-bath-return-postreload-gm-receipt-20261026.json`

Summary: full/dry Bathhouse both **2160×1440 / grid 120** and original native return geometry/target identical. Pond full background `ext-02_pond_full_owner-approved.png` matches its one native level; Trail portal is currently enabled and targets full Bathhouse `Scene.CAVBATHScene0001.Region.R2Pg9eHODtb1C1Yk`, not dry until the authentic player Sluice action. Aqueduct entry/return and Forest Well exit/reentry destinations exist with original disabled stage. Ring Region `CAVBROSEWATER001` at drained map x976,y826,w108,h115 is still disabled; ring session NULL.

## Story dependency preserved — not yet user-playable end-to-end
Original Study→587 → **Crank** `Item.g3VYdgc1qkgkHGvn` → player fits it at native `CAVEXT02SLUICE01` → elected GM synchronized Pond/Bath `open/drained` and committed transaction remains WAITING, not bypassed. `cavPondBathWaterState`, `cavSluiceStageTransaction`, fitted Crank remain NULL. Boiler 2/1 native setup ready for future player QA; original screwdriver and Weathered Key pickups preserved. Rosewater Ring four symbols owner-approved but native `CAVROSEWATERSCR1` deliberately DISABLED pending legitimate drain; original Sune Bowl world Item remains unique, final pickup fixture location undecided. Aqueduct first chase and Crooked Man Actor/token/full actual player acceptance remain owner-DEFERRED.

## Architectural + Git boundary for Chat B
Chat A owns `studio-cav-water-controller.js`, shared `studio-campaign.js`, Regionwright puzzle API registration, live Foundry module folder, first chase, Sluice, Bathhouse and original Crank. Chat B must keep isolated branch/worktree and source-only late work, no edits of these shared files or installed module. **New Chat A Regionwright integration HEAD is `54faf5c29b75cd8ef4b3ea26eda6d3ed0f2db9a8`;** if Chat B branched earlier, use an explicit reviewed merge/rebase plan rather than changing its branch under it.

## Next Chat A bounded stage
Read-only map/route verification is now **COMPLETE/PASSED**; avoid repeat audits unless live evidence changes. Next source/fixture task can inspect original Sluice click/overlap and design targeted player acceptance checklist, preserving owner-deferral on actual tests. When real source Crank and water transaction are accomplished, validate enabled controls, session safety and commission Rosewater, and later authenticate Aqueduct first chase only with approved NPC/token. No new BATH-03/BATH-04 Scenes or invented Boiler egress.

## Timeline and fidelity
This is a direct evidence-backed handoff after a bounded Chat A turn. Earlier draft read-only audit helper and reload helper had JS syntax errors caught/fixed; they never changed campaign state. Only **one actual live GM page reload** was performed, successful. Report and metadata are committed in Regionwright:
- `docs/cabin-ashen-veil/chat-a-unified-water-route-geometry-live-audit-2026-10-26.md`
- `docs/cabin-ashen-veil/chat-a-unified-water-route-geometry-live-audit-2026-10-26.json`
- `docs/cabin-ashen-veil/regionwright-puzzle-update-log-2026-10-26.md`.

**Classification:** Chat A source change DEPLOYED / GM RUNTIME VERIFIED; structural route and art geometry PASS; actual non-GM story progress NOT PLAYTESTED; downstream gates intact.
