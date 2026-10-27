# Cabin in the Ashen Veil — Chat A Sune Bowl null-fixture readback, live geometry and deferred reload

**Date:** 2026-10-26 Pacific (~23:01–23:09; UTC 2026-10-27 ~06:01–06:09).
**Owner:** “continue”. Prior owner instruction: finish campaign installation before final integrated compatibility diagnostic/non-GM playtesting. All local activity through Dicebox Bridge only.

## Latest verified state

- Regionwright repo/branch `Dicebox20/regionwright` / `codex/cav-sune-integration-20261026`, **new remote-verified HEAD `3d17007137bdc0a52f133c083737d5bc020ad1b2`**; parent `0b4a30f0efe69642e95d81be221ad688ed54859d`.
- Source regressions **238/238 PASS**, 0 failed, 43 Cabin test files, including 21 Bowl-specific tests (2 new).
- Exact installed Foundry 14.367, `cabin-in-the-ashen-veil`, authenticated elected Gamemaster 1, **47 Scenes, 234 Regions, 123 native RegionBehaviors** at readback, 54 ChatMessages. These counts include Chat B concurrent additions; do not revert to older baselines.
- Latest local and installed module Bowl file SHA256 **`180BF7800E3AC5395257373E40BABA9A6DB60479A0E5AD203D93EBBEF0D25AB0`**. Exact prior bytes `70732E8FD211AC2BC6887EBE2EA9EEC572BBE807BDADC47F68F909F92D758C65` archived in `utility-harness/artifacts/cav-chat-a-bowl-pre-null-guard-original-20261026.js.txt`.
- **Source and disk installation PASS; fresh in-browser import of the patched module PASS. The already-initialized Regionwright `rosewaterBowl.describe` API is still cached at the older module version and throws. Do not assert active runtime repaired until a coordinated reload/reinitialization.** No user/browser reload was attempted this turn.

## Confirmed defect and safe correction

Elected GM in existing Foundry `/game` performed read-only actual module `describeOriginalCavBowlPickupGM()` for unapproved Bowl fixture. Prior implementation evaluated `fixture?.uuid===approval?.regionUuid`; since both were `undefined` under no owner approval, the equality was true and subsequent `fixture.id` threw `TypeError: Cannot read properties of null (reading 'id')`.

The exact small correction in `modules/regionwright/scripts/studio-cav-rosewater-bowl.js` requires `!!fixture && !!approval && !!ring` before checking fixture identity and native Behavior readiness. Two tests now invoke the *real GM exported function* against missing and approved-but-absent pickup fixture without any writes. The existing original Bowl template, strict ring DONE proof, drain receipts and once-only reserved→DONE grant remain intact.

Read-only **fresh ESM import** in the real elected-GM browser (distinct module URL, no world write) returned:
`{status:"owner-fixture-approval-missing",approvedFixture:false,nativeReady:false,ringNativeReady:false,ringStatus:null,sluiceReady:false,sourceItemReady:true,claimStatus:null}`.
No Bowl actor copies, no fixture approval, native ring still disabled, no staged Crank or water success. Exact local receipts:
- `utility-harness/artifacts/cav-chat-a-bowl-runtime-import-installed-scope-readonly-20261026.json` (revealed defect).
- `utility-harness/artifacts/cav-chat-a-bowl-absent-owner-fixture-live-gm-readback-20261026.json` (corrected source PASS).

## New exact owner geometry evidence

Owner-approved drained unified Bathhouse Scene `8yLMRDvxyw58dydh`, 2160 × 1440 pixels, background `Maps/cabin-in-the-ashen-veil/bathhouse_unified_surface_drained_owner-approved_2026-10-26.png`.

- Original drained Screwdriver pickup Region `CAVBATHSCRDRY001`: rectangle **(x=870, y=710, width=360, height=330)**, one enabled native Behavior.
- Original staged Rosewater ring Region `CAVBROSEWATER001`: rectangle **(x=976, y=826, width=108, height=115)**, one disabled native Behavior.
- **The complete Rosewater hit area is inside the Screwdriver Region hit area.** Actual click separation cannot be inferred from the existing native geometry. Owner approval remains required before changing existing pickup/solved lock regions.
- No original on-map Sune Bowl pickup Region exists with approved fixture identity/shape. Unique source World Item `Item.1n5LONw3nYIy61O9` exists. No on-map fixture was invented.

Raw read-only geometry receipt: `utility-harness/artifacts/cav-chat-a-rosewater-screwdriver-owner-geometry-readonly-20261026.json`. Source report and structured metadata: [Regionwright detail](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-bowl-native-readback-nullfixture-fix-2026-10-26.md).

## Next approved workflow

1. **Do not force restart** while Chat B might be executing in the shared elected-GM world. At an agreed safe module reload point, verify the real active module API now returns `owner-fixture-approval-missing` without throwing (fresh import alone does not satisfy that step).
2. Next owner geometry review: show original approved Bathhouse art with both live hit rectangles and identify a separate exact Rosewater clickable area and Bowl pickup shape; obtain **explicit owner approval** before editing native Regions or attaching Bowl pickup Behavior. Do not infer owner approval from approved glyph IDs or existing drained background art.
3. Continue any already-approved non-geometric missing installations in Chat A only; do not override intentional original Study, Sluice, Roof, Rosewater or Aqueduct puzzle gates, and do not touch Chat B late-game Regions.
4. Keep per-turn conversation transcript, technical handoff and reproducible receipt metadata; defer owner-requested full combined compatibility diagnostic and real player acceptance until entire campaign installation is finished.

**Classification:** BOWL SOURCE/ON-DISK DEPLOY/FRESH-GM-IMPORT VERIFIED; CURRENT ACTIVE SERVICE STILL OLD/CACHED; ORIGINAL BOWL FIXTURE NOT INSTALLED; FULL COMPATIBILITY NOT TESTED.
