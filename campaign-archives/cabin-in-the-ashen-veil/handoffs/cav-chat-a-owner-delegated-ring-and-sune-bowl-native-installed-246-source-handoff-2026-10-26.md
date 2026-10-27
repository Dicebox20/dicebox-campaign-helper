# Cabin in the Ashen Veil — Chat A owner-delegated Rosewater + Sune Bowl installation handoff

**Pacific date:** October 26, 2026 (~23:22–23:39; UTC 2026-10-27 ~06:22–06:39). **Workstream:** Chat A early/midgame. **Owner authorization:** “approved, you have approval authority for the cabin in the ashen campaign creative and technical decisions”.

## Binding owner decision

Owner has delegated campaign-specific creative and technical approval authority to the coordinator for **Cabin in the Ashen Veil**. The coordinator may resolve previously undecided creative/technical decisions within that campaign and record the rationale. This **does not** imply that the owner personally selected specific coordinates, nor does it authorize synthesizing genuine gameplay completions, altering unrelated campaigns, or silently disrupting Chat B in the same world. Established Dicebox workflows and preservation of prior canon remain defaults. The owner separately directed full integrated compatibility and non-GM player acceptance **only after all installations are finished**.

## Regionwright source and native checkpoint

- Regionwright `Dicebox20/regionwright`, branch `codex/cav-sune-integration-20261026`.
- Verified remote source HEAD **`f3c1bfccf077ec9d3b4d97573889289dd6b598f0`**, parent `054fd0593fbf9087742793993efe8aa4d9e7597f`.
- **246/246 source regression tests PASS**, zero failures across 44 Cabin test files (four new tests).
- Actual authenticated Foundry 14.367 `cabin-in-the-ashen-veil`, elected Gamemaster 1; independent GM postread **PASS**: **47 Scenes, 240 Regions, 128 RegionBehaviors**. Changed exactly one new Bowl native Region with one Behavior, the existing Rosewater commissioning metadata, and enabling its one original native Behavior; independent Chat B concurrent regions untouched.
- Full source report and machine metadata: [Regionwright technical report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-owner-delegated-bowl-ring-native-install-2026-10-26.md).

## Original approved single-map Bathhouse creative placement

Original owner-approved background: `Maps/cabin-in-the-ashen-veil/bathhouse_unified_surface_drained_owner-approved_2026-10-26.png`, physical PNG 1536×1024 scaled to actual Scene 2160×1440, grid size 120, `Scene.8yLMRDvxyw58dydh`.

**Rosewater rings:** Kept original `CAVBROSEWATER001` rectangle (x=976,y=826,width=108,height=115) over the central drained pool. This is nested inside existing Screwdriver Region (870,710,360,330), **but** pre-existing installed original Screwdriver source `studio-cav-drained-pickups.js` ignores clicks inside the Rosewater Region, proven by native five-point read-only classification and source hash. Coordinator approved existing ring art/hitbox under owner's delegation; ring geometry approval stored separately with accurate provenance. Did not move Screwdriver.

**Sune’s Scrying Bowl:** New original pickup Region `Scene.8yLMRDvxyw58dydh.Region.CAVROSEBOWLREG01` located on the **northern ceremonial rug** (x=977,y=375,width=108,height=88; center 1031,419). Original map visually inspected and Region.testPoint verified no prior Region at target; a 120px snapped token center (1020,420) can stand in the fixture. It is separate from ring/Screwdriver. This is a coordinator-chosen location, not an earlier owner-specified plinth. No discarded standalone BATH-03/04 scene was reintroduced.

The new Region has exactly one **ENABLED** native `executeScript` Behavior with the Foundry-safe 16-character ID `CAVROSEBOWLPICK1`, dispatching `rosewaterBowl.handleRegionEvent`. The previously drafted 18-character source constant was corrected to this new exact ID. Source/installed module Bowl file SHA256 `25E589ADD4E9A4C80F943E91AAFC5EF7FFCF426D6698E03700A1BB956BD825F5`. Previous installed file preserved under `utility-harness/artifacts/cav-owner-bowl-before-native-id-update-20261027.js.txt`. No Bowl decorative Tile was installed; the original World Item's generic clay-bowl icon is not approved top-down map art.

Original ring `CAVROSEWATERSCR1` remains byte-identical, was enabled, and original puzzle binding moved from `STAGED_DISABLED` to `ENABLED`, phase `COMMISSIONED`. Owner geometry review marked complete with explicit delegated-approval provenance. Its original puzzle solution `[1,3,2]` and owner-approved `rose,sun,moth,thorn` remain unchanged.

## Native receipts and strict gameplay gates

Installer: `utility-harness/artifacts/cav-owner-delegated-rosewater-ring-bowl-fixture-native-install-20261027.json`; seven guarded exact-GM changes and same-call readback, status **installed-native-gm-readback-pass**.

Independent second GM readback: `utility-harness/artifacts/cav-owner-delegated-ring-bowl-native-independent-postread-20261027.json`, **PASS**. New original Bowl native Behavior READY, original Ring native source READY, owner-delegated fixture approval exact, original unique world Item `Item.1n5LONw3nYIy61O9` intact. **Original Crank, original Pond/Bath water transaction, ring session and Bowl award are all NULL; zero player Bowl copies.** No gameplay progress faked and no non-GM test performed.

**Critical cached module distinction:** Fresh URL import of installed latest Bowl file correctly returns `nativeReady:true`, `ringNativeReady:true`, `status:original-rosewater-rings-not-solved`, `sluiceReady:false`; the original Rosewater ring GM service returns `ready` but drainage false (Crank not acquired). The *already-running* `regionwright.api.campaign.cabin.rosewaterBowl.describe()` still holds an older cached import expecting the 18-character draft Behavior ID, reporting `original-pickup-behavior-not-installed`. **Coordinate a safe module reload with Chat B, then verify the actual active API.** Do not claim current active Bowl interaction works until then, and do not force-reload another workstream's active GM session without coordination.

## Continuing workflow

Finish other approved campaign installations, using owner's new delegated decision authority within Cabin and recording all adopted decisions clearly. **Do not** invent Crank acquisition or ring completion to make progress appear finished. Installation source/native GM checks remain permissible; campaign-wide compatibility and real non-GM acceptance follow only when all installation is done. Maintain separate Chat A/Chat B source and source-of-truth evidence, and the chronological transcript + handoff after each working turn.

**End of turn:** new native Bowl fixture + one script **INSTALLED**; existing Rosewater **COMMISSIONED**; 246 tests PASS, second GM postread PASS; active Bowl API **RELOAD PENDING**, player acceptance outstanding.
