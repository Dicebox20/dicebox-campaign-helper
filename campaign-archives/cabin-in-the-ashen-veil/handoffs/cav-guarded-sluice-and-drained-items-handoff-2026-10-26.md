# Cabin in the Ashen Veil — Paired Sluice and Drained Pickup Installation Handoff
**Record:** 2026-10-26, America/Los_Angeles. Bounded ~25-minute owner-approved installation turn.
**Status:** Regionwright source INSTALLED and live Foundry STRUCTURALLY VERIFIED. Gameplay tests DEFERRED until all puzzle chains installed. No water action, crank claim, or actor pickup simulated.

## Prerequisite progression
Study Key (Sune) → Study 587 note → Donovan Lockbox original Sluice Crank → physical install Crank at EXT-02 Pond gate → explicit OPEN sluice changes pond and bath together → Weathered Key on exposed Pond stair + Screwdriver at central Bathhouse pool floor → Weathered Key admits basement; Screwdriver repairs Parents' Bedroom nightstand, revealing Aqueduct Gate Handle; paired with roof Replacement Gear to open Aqueduct. Next build those two successors, then first chase, then Regionwright Rosewater rings.

## Live exact Foundry state verified 2026-10-26
World `cabin-in-the-ashen-veil` Foundry 14.367, exact active Gamemaster 1; Regionwright Studio registered/active, Puzzles & Locks active. Existing `Scene.CAVEXT02Scene001.Region.CAVEXT02SLUICE01` preserved.
- `cavSluiceInstallController.drainEnabled=true`, `noDrainActivation=false`; GM hook `__CAV_SLUICE_WATER_GM_SERVICE_v001` active version 1.
- New player **Open/Close** options are available only after authentic Crank is fitted. Sluice remains **physically closed**, Pond `ext-02_pond_full_owner-approved.png`; Trail Region `13g6uK1QrR9PFOzA` Behavior `ZbrhX0nnaLvLA5Zh` still targets full Bathhouse `Scene.CAVBATHScene0001.Region.R2Pg9eHODtb1C1Yk`.
- The approved drained Bathhouse `Scene.8yLMRDvxyw58dydh` remains unchanged and separately available. Both Bathhouses share same Arrival `R2Pg9eHODtb1C1Yk` and Return `SLovYxFAWVAMFzXg` Regions/teleport targets. No tokens in either Bathhouse or Pond at installation. All four map PNGs HTTP 200.
- The one authoritative water state `cavPondBathWaterState` and the physical crank ledger `cavSluiceCrankInstall` remain NULL/unclaimed (expected until the player actually works the gate).
- New scoped transaction mechanism `cavSluiceStageTransaction`: `reserved` before touching Pond Ground Level source or Trail teleport destination, then synchronized committed water state `closed/full/full` vs `open/drained/drained` and final `done`. Partial errors leave a visible reserved transaction; **never blindly retry**. The elected GM checks the actual player-controlled token at Sluice, original Crank install, all artworks and return-route geometry, **zero tokens in both Bathhouses**, and **all Pond tokens standing at the exterior Sluice control**. No token auto-teleported or item consumed by stage switch. Refill must later add explicit BATH-04 Rosewater Reliquary occupancy/egress checks before that scene opens for play.
- Source and installed module copies match SHA-256. Installed source: `modules/regionwright/scripts/studio-cav-water-controller.js`, plus updated `studio-cav-sluice.js` and `studio-campaign.js`.

## Two explicit drained pickups (installed, unclaimed)
1. `Scene.CAVEXT02Scene001.Region.CAVPONDWEATHER01` bounds `x=2575,y=1030,w=590,h=600` at exposed pond steps, behavior `CAVPONDWEATHB001`. Reuses original `Item.CAVWEATHERKEY001` Weathered Key source.
2. `Scene.8yLMRDvxyw58dydh.Region.CAVBATHSCRDRY001` bounds `x=870,y=710,w=360,h=330` at exposed central pool drain, behavior `CAVBATHSCRBEH001`. New original `Item.CAVBATHSCREW0001` Screwdriver, GM library `loot` with native steel screwdriver icon.
- Both behaviors enabled with **behaviorViewed/behaviorUnviewed/behaviorDeactivated only**, explicit player pointer click, not token entry. Regionwright source `studio-cav-drained-pickups.js`; GM service `__CAV_DRAINED_PICKUPS_GM_SERVICE_v001` active. Requirements: elected GM, authentic sender+owned nearby token, actual committed drained water state, dry Pond art and Trail destination to dry Bathhouse, exact source UUID, reservation/done dedup ledger `cavDrainedPickupClaim`. Items remain hidden if water full; no actor granted an item during installation.
- Approved map crops used for static hints, no interactive art duplication: `worlds/cabin-in-the-ashen-veil/assets/puzzle-closeups/cav-pond-drained-weathered-stairs-crop-20261026.png` SHA256 `5C3DDE4EA819881D07F047C88BB0F26EFBC647D91492329A3BBCEB687BC94474`; `cav-bath-drained-floor-screwdriver-crop-20261026.png` SHA256 `B6C20B7F2E8364E44D01758BB1B56CA0921166870A9C6E4BEE3D3C8353512827`.
- Current Scene Region totals: Pond 6; drained Bathhouse 3. The full-water original Bathhouse retains its original 2 Regions without modification.

## Evidence and tests
- Regionwright source branch `codex/cav-sune-integration-20261026` pushed and verified by `git ls-remote`: commit `b37bd5a0b5debbf8bce5d9a884cf30bd5efb51e6`, [source](https://github.com/Dicebox20/regionwright/tree/codex/cav-sune-integration-20261026), [change log](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/regionwright-puzzle-update-log-2026-10-26.md).
- 13/13 source-level tests PASSED: Crank prerequisites, water-stage model, Bathhouse occupancy and Pond position safety, stage idempotency, individual pickup conditions/ledger. Native Foundry exact active-GM readback passed after client reload: all three services active, 2 Region behaviors, original Weathered Item, new Screwdriver Item, stage enabled but no actual water transition and no grant.
- Local receipts `utility-harness/artifacts/cav-sluice-water-controller-enable-receipt-20261026.json`, `cav-drained-weathered-and-screwdriver-install-receipt-20261026.json` and read-only route/artwork preflights. Regionwright installed source backups at `Documents/Region Editor/docs/cabin-ashen-veil/backups/water-transition-20261026`.
- No non-GM player click, route traversal, Pond texture switch or token transfer simulated under owner gameplay deferral. These source/structural passes are NOT gameplay acceptance.

## Next player-order unit
1. Verify and install Weathered Key's authentic Basement door gate from EXT/H-G scene and its one-time unlocked native teleport, without inventing a direct shortcut or duplicating the source key.
2. Wire Screwdriver-only Parents' Bedroom nightstand repair, one unique Gate Handle pickup, then Roof Replacement Gear + Handle at Aqueduct entrance.
3. Integrate Regionwright Rosewater exact ring solution 90/270/180 after drained Bath, Scrying Bowl explicit one-time collection and BATH-04 dry Boiler exit; **before exposing Reliquary to players** add BATH-04 occupancy to sluice refill safety.
4. Continue first chase, Waterworks and Boiler in player dependency order. Reconcile distinct Great Room 024/027 chest issue at its proper stage.
5. On each future <=25-minute turn, log Regionwright source changes and commit a new campaign handoff, machine-readable metadata and **available-message reconstruction** (never claim lossless export).
