# Cabin in the Ashen Veil — Separate drained Pond scene creation (partial, safe)

**Date:** 2026-10-27 Pacific. **Owner explicitly approved:** locate existing drained Pond artwork, clone the filled Pond scene, rename the clone, change its Regions as needed for the drained map. Standing owner rule: fix reported issue, do not make unrelated changes without asking.

## Completed in actual Foundry

On exact elected GM Foundry 14.367 world `cabin-in-the-ashen-veil`, cloned the approved filled scene `CAVEXT02Scene001` to new **`CAVPONDDRAIN0001`**, name **Grounds — Pond (Drained)**. Used owner-approved existing image `Maps/cabin-in-the-ashen-veil/ext-02_pond_drained_owner-approved.png`. In Foundry v14 the default Level background owns the effective scene art; updating only Scene.background did not change the displayed image. Correctly set original cloned Level `defaultLevel0000.background.src` to the drained asset; Scene background now resolves to the drained image.

The new scene currently has exactly five copied original Region geometries, original IDs **within the new scene**, and the copied original scripts **disabled to prevent duplicate awards/teleports**:
- Yard return `5RJkabcJJbVAI4WY` (cloned teleport disabled)
- Yard arrival `wwls4eQRInzw8RxS`
- Weathered Key drained stairs `CAVPONDWEATHER01` (pickup Behavior disabled)
- Aqueduct Gear/Handle sockets `CAVPONDAQGATE001` (one native script and one native teleport, both disabled)
- Aqueduct arrival `CAVPONDAQARRV001`

Original scene **remains exactly unchanged** with the approved filled artwork and its original 8 Regions, including original Aqueduct/Key gate Regions pending careful relocation. No player characters, tokens or item receipts modified; new Scene has zero tokens. Exact original snapshot and rollback evidence:
`utility-harness/artifacts/cav-drained-pond-owner-approved-clone-source-20261027.json`;
native create receipt
`utility-harness/artifacts/cav-owner-approved-drained-pond-separate-native-scene-build-20261027.json`;
background correction readback and independent GM proof
`utility-harness/artifacts/cav-drained-pond-independent-gm-clone-postread-20261027.json`.
**Independent read-only actual GM verification PASS**, 48 world scenes now (47 before).

## Blocking integration (DO NOT claim scene playable)

Existing Regionwright `studio-cav-water-controller.js`, `studio-cav-aqueduct-routing.js` and drained-pickup handlers are bound to original Pond Scene `CAVEXT02Scene001`, where water changes currently replace **Level artwork in-place**, while Aqueduct gate and Weathered Key Behaviors use hard-coded scene IDs and original route flags. Simply moving/deleting original Regions or enabling cloned Behaviors would break the original sluice transaction, authentic item claims, and Aqueduct return. No code/controller rewrite or portal rewiring was completed in this task, and there was no module reload. The original owner defect—Aqueduct gate Regions visible in the filled scene—**remains unresolved** pending route/controller migration.

Next authorized work is within the owner's explicit scene-clone-and-adapt request: update the stage controller to use separate filled/drained Scene IDs safely and update all original provenance and teleport destinations, commission the gated Behaviors only on the drained scene, delete/migrate the original filled scene’s drained-only Regions when tested, then actual non-GM travel / one-time item playtest. Workstream Chat B shares the live world; coordinate any module reload and preserve ongoing game tokens and original puzzle state. Do not claim the integration is complete just because both Scenes now exist.
