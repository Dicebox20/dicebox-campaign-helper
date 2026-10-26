# Cabin in the Ashen Veil — Owner-Approved Drained Bathhouse Scene Handoff
**Record date:** 2026-10-26, America/Los_Angeles
**Owner request:** "approved, copy the other bathhouse scene settings exactly and use that map"
**Status:** COMPLETED — actual generated drained art copied to Foundry and new Scene created; source Scene not modified. Draining/transitions not activated.

## Authorized asset
- New approved drained-water Bathhouse PNG (derived from owner-provided full-water map), **1536×1024**, 3,328,028 bytes; SHA-256 **`337d84929ca93eaf29527124f33ffa26dad24082ffcf4659cca6c7932892c11e`**.
- Local installed map path `C:\Users\rujie\AppData\Local\FoundryVTT\Data\Maps\cabin-in-the-ashen-veil\bathhouse_unified_surface_drained_owner-approved_2026-10-26.png` and Foundry server asset path `Maps/cabin-in-the-ashen-veil/bathhouse_unified_surface_drained_owner-approved_2026-10-26.png`. Exact checksum verified source/installed and HTTP 200 image/png.
- Source transfer: user's approved generated file uploaded to connected Google Drive, then accessed using authenticated Drive for desktop on the computer at `D:\My Drive`. Stored in **Cabin in the Ashen Veil — Approved Map Art**, file ID `1fuBiXZGbzxC-U1DSn6EJz8qSBWgdVJ84`, URL https://drive.google.com/file/d/1fuBiXZGbzxC-U1DSn6EJz8qSBWgdVJ84/view?usp=drivesdk. Never made publicly shared.
- Pixel image-registration preflight comparing approved full and drained compositions returned near-identity affine transformation, appropriate for exact coordinate-setting copy.

## Original and new Scenes
- Original full-water Scene: `Scene.CAVBATHScene0001`, title `BATH - Unified Bathhouse Surface`, still using `bathhouse_unified_surface_owner-approved.png`. Original unchanged.
- **New drained-water Scene:** `Scene.8yLMRDvxyw58dydh`, title `BATH-DRAINED - Unified Bathhouse Surface`, background set to approved drained map.
- Current scene total 47 (previous 46); both Scenes inactive. New Scene originally copied using the original Foundry native `Scene.toObject()` with the same Ground Level and all embedded collections, changing only Scene identity/name, background level image path and variant metadata. No clone retried when initial verification reported Foundry's automatic creator-owner addition.
- **All 19 audited native scene config fields match original:** 2160×1440 canvas, no padding, grid type=0/no visible grid, grid size=120, scene level/camera, lighting/environment, tokenVision, weather, transition, folder, navigation, navOrder, initial, fog, audio/journal and sorting.
- Single `defaultLevel0000` Ground Level background texture properties, transforms, anchor, offsets and scale identical; only background image changes. Original 1536×1024 art and new art both scaled to 2160×1440.
- Exact embedded documents preserved: 2 Regions with same document IDs and shapes, original return-to-trail teleport `SLovYxFAWVAMFzXg` / `EK3UbdrVWwe28PmW` to `Scene.CAVTRAILScene001.Region.N5LomZ7TrVBMoExk`, arrival Region `R2Pg9eHODtb1C1Yk`. No native Walls, Tiles, Tokens, Lights, Drawings, Notes or Sounds, matching original. Region behavior timestamps are necessarily regenerated during native copy, but behavior semantics, flags and destination match.
- Foundry automatically added an ownership OWNER grant to **the creating active GM** (`4c2ow5laZtzUNigr`); other ownership entries preserved. One native attempt to remove the auto grant did not change that platform-owned metadata; kept as documented harmless exception instead of unsafe DB edits.
- Clone metadata updated to unique keys: `cavStructuralSceneKey=BATH-DRAINED`, `manifestId=BATH-DRAINED-01`, `approvedArtSha256=337d...`, `cavWaterVariant=drained`, `cavVariantOfSceneUuid=Scene.CAVBATHScene0001`, `cavWaterVariantStaged=true`.

## Safety / continuity
- NO water-state controller executed or Scene switched during gameplay; old `Scene.CAVEXT02Scene001.Region.CAVEXT02SLUICE01` Sluice flags `noDrainActivation=true`, `cavSluiceInstallController.drainEnabled=false` remain authoritative until token evacuation, safe arrival positions, reciprocal routes, and paired Pond/Bath stage transitions are completed.
- NO player interaction tests this turn under owner's gameplay-testing deferral. All verifications are preflight/source/file-hash/native-Foundry document readbacks.
- Local before-state backup `utility-harness/artifacts/cav-bath-original-scene-full-backup-20261026.json`; after-state comparison `utility-harness/artifacts/cav-bath-drained-clone-verified-20261026.json`; source and clone Region behavior data inspected.
- Regionwright source product: docs-only commit `e7559c11b9ab3cbb6835ad419073a9965a6c9f33` pushed on `codex/cav-sune-integration-20261026` to update `regionwright-puzzle-update-log-2026-10-26.md` and `sluice-water-stage-prep-2026-10-26.md`. No interactive Regionwright engine changes in this exact turn.

## Next player-order installation
1. Now that Pond full/drained AND Bathhouse full/drained static maps exist, audit paired Scene entrance/exit Region UUIDs and safe token relocation/egress; distinguish water-level changes from map-only changes.
2. Design exact active-GM transactional Sluice open/close: ledger reservation, both Pond and Bathhouse stage sync, single authority in EXT-02, safe staged routing, reverse travel and interrupted-write reconciliation. Preserve separate Sluice Crank fit.
3. Reconcile full-vs-drained scene swaps (or backgrounds) with owner-approved travel layout; do not activate while transitions can trap player tokens. Keep main Bathhouse original and new alternate until source-approved routing exists.
4. Continue to Weathered Key, Bath Screwdriver, Rosewater Reliquary and Aqueduct first chase, as documented. Full gameplay tests only at end. Continue <=25-minute turns with GitHub handoff + metadata + available-message transcript.

**Source-of-truth status:** Owner-approved artwork + native Scene created, structurally verified. Gameplay integration pending; don't label flood mechanism installed or playtested.
