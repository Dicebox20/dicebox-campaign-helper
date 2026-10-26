# Cabin in the Ashen Veil — Rosewater Canon and Dry Boiler Source Handoff
Date: 2026-10-26 Pacific. User: continue. STATUS: Source-only completed and disk-deployed; no live Foundry Rosewater Region installation or gameplay test.

## Canon / workflow
Rosewater rings: outer 90 degrees, middle 270 degrees, inner 180 degrees, equivalent to four-quarter-turn indices [1,3,2]. Six-sector [1,3,5] belongs only to the Oct 24 standalone demo. Regionwright Puzzles & Locks owns all interactive art, movable ring UI, engine and symbols. No artwork or symbol selections were invented. Latest owner decision: Scrying Bowl is recovered in BATH-04 under the drained Bathhouse; final four-input Vault yields Keystone instead. BATH-04 east passage to BATH-03 Boiler stays dry and usable after Bathhouse refilling, independently of Boiler pressure. Original Bowl item and later Bowl+027 pellet Undercroft progression preserved. Crooked Man NPC/first chase gameplay testing remain deferred.

## Committed source and verified tests
Regionwright branch codex/cav-sune-integration-20261026, commit 4942bf7cb77e65e1847b6ef7f98e9205f6b5b2f8, pushed and exact remote SHA verified.
New Puzzles & Locks: modules/regionwright-puzzles-locks/scripts/rosewater-campaign-preset.js, exposed through scripts/api.js as api.rosewater. Uses existing three-ring engine, requires FOUR explicitly supplied unique approved art symbols, rejects demo/changed solution, models 90-degree increments. Demo unchanged.
New Regionwright Studio: modules/regionwright/scripts/studio-cav-rosewater-safety.js, exported through studio-campaign.js as campaign.cabin.rosewaterSafety. Pure/read-only gate policy for paired drained Pond/Bath hatch, exact solved puzzle, verified permanent pressure-independent Boiler exit, lower-room occupancy on refill, and once-only original Bowl item claim. No native world writes or automatic reward/teleport.
39 of 39 source and related regression tests PASS across 11 test files. Source/installed module JS SHA hashes matched after final normalization. Detailed dated source checkpoint: docs/cabin-ashen-veil/rosewater-canonical-ring-and-dry-egress-source-2026-10-26.md; existing chronology log updated. Precise files staged only; unrelated local files preserved.

## Foundry outage and non-claims
At turn start neither Foundry 30000 nor Dev Chrome CDP 9224 listened. After bounded process/runbook checks, started one installed Foundry 14.367 app and one documented Dev Chrome utility harness; both ports briefly became available and correct Cabin in the Ashen Veil join page appeared. Subsequent bounded browser inspection timed out; durable receipt was checked rather than replayed, and both listeners became unavailable again. Cause unknown, low memory may contribute. No authenticated active GM reload/readback after source deployment; no Foundry Scene, Region, Item, token or water-stage writes. Running module adoption UNVERIFIED.
Existing nine-Scene snapshot is FILTERED, NOT the full 47-Scene world registry; it cannot establish BATH-03/BATH-04 absence. Local Bathhouse surface assets are approved; specific BATH-03/04 Scene IDs, interior images, owner-approved four ring symbols and original Bowl world Item UUID are unverified. Google Drive title searches for Rosewater/Reliquary/Boiler did not surface matching approved files. Never invent/recreate existing geometry or duplicate item.

## Next player-order work
1. Diagnose repeated Foundry/Dev Chrome process failure; obtain stable active GM, exact world cabin-in-the-ashen-veil, full unfiltered Scene roster and item provenance, module API readback.
2. Reconcile BATH-03/BATH-04 approved map art, their actual landing/egress Regions and owner-approved ring visual symbols. Do not assume the rooms absent.
3. Integrate existing Puzzles & Locks Rosewater player UI with elected-GM-authoritative solve proof; open drained-only Bath pool hatch after both room routes verified; permanently unbolt dry east service door with safe return; make Sluice refill guard inspect lower rooms; one-time Bowl pickup from original item UUID with reservation/done ledger.
4. Continue Waterworks and Boiler in player order, retaining deferred Crooked Man actor/testing and 25-minute handoff cadence.

Not gameplay tested; not live-region installed.