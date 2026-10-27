# Cabin in the Ashen Veil — Chat A Bathhouse click masking: owner geometry decision narrowed

**October 26, 2026 Pacific, ~23:11–23:21.** User directed: “lets continue”. Installation-first process authoritative: finish content before combined compatibility diagnostic/non-GM acceptance. Earlier Chat A checkpoint 238/238, Regionwright `3d17007137bdc0a52f133c083737d5bc020ad1b2`.

## Current verified source checkpoint

- Regionwright repo: `Dicebox20/regionwright`, branch `codex/cav-sune-integration-20261026`.
- New verified remote HEAD **`054fd0593fbf9087742793993efe8aa4d9e7597f`**.
- **242/242 full Cabin source regressions PASS, zero failures**, 43 test files. Four new tests in the existing original Bathhouse click separation suite (focused 6/6).
- No source runtime Behavior alteration. No Foundry Region, actor, player Item, water, staged puzzle, token, native world flag or Chat B late-game object modified.
- Shared-world latest observed: **47 Scenes, 239 Regions, 126 Behaviors** at read-only current elected-GM source/geometry classification. Counts differ from earlier 47/234/123 due concurrent independent work; don't revert it.

## Correction to prior handoff

Previous Chat A note said overlapping original Screwdriver and Rosewater Region rectangles *cannot reliably operate as independent click targets*. That was **overstated**. The original existing installed Regionwright module already includes a precise **source-level click-priority mask** which prevents its Screwdriver client handler from responding if the native pointer position is inside the Rosewater ring. It was already on disk and source prior to this turn, SHA256 `305D50CDD6EFBEA963C30EFB8A2DBA0FEB82BE48E203B1ABDB1E88D5AE7BCC7E`.

Original native drained Bathhouse `Scene.8yLMRDvxyw58dydh` is 2160×1440:
- Screwdriver original pickup `CAVBATHSCRDRY001`, rectangle **(870,710,360,330)**, original script Behavior `CAVBATHSCRBEH001` enabled.
- Staged Rosewater ring `CAVBROSEWATER001`, rectangle **(976,826,108,115)**, original native ring Behavior `CAVROSEWATERSCR1` disabled; `ownerReviewRequired=true`.
- The ring is geometrically nested inside Screwdriver; **client behavior** already excludes the ring area from Screwdriver hit handling.

Actual authenticated elected-GM **READ-ONLY** native scene `Region.testPoint` plus source `shouldHandleDrainedPickupClick`:
- `(1030,883)`: both native Regions contain the point; Screwdriver click **suppressed**.
- `(900,750)`, `(1200,750)`, `(900,1000)`, `(1200,1000)`: inside Screwdriver, outside Rosewater; Screwdriver click **permitted**.
- Receipt `utility-harness/artifacts/cav-chat-a-bath-click-separation-native-point-proof-20261026.json` **PASS**. This is NOT a real non-GM pointertap/playtest and the Rosewater Behavior is still disabled.

## Owner decisions still required — no silent approval

1. **Ring exact hitbox location:** It is technically viable to preserve existing Rosewater rectangle under the already installed click-priority mask. However native `ownerReviewRequired` remains true and the exact alignment to approved background artwork was *not* approved by owner. Explicit owner visual/location approval is still required before native Rosewater commissioning.
2. **Original Sune's Scrying Bowl pickup:** Original unique source World Item `Item.1n5LONw3nYIy61O9` exists, but no approved distinct Bowl pickup rectangle / plinth location exists in the unified drained Bathhouse. Old standalone BATH-04 draft showing a plinth was NOT owner approved and is not authority for a new Scene or transplant onto the unified map. Do not invent exact Bowl coordinates.
3. Genuine original Crank and committed Pond/Bath drain and solved ring are necessary before gameplay activation. Keep ring disabled until owner approval + original puzzle stage proof.
4. New Sune Bowl source is disk deployed and passed a fresh GM ESM import after prior `3d17007` fix; the already-loaded `rosewaterBowl.describe` API is cached on an older version and requires a coordinated refresh. **Do not force a reload during Chat B's same-world work.**
5. First Crooked Man NPC/first chase gameplay remains owner-deferred. The Aqueduct portal/water synchronisation and Sophia confinement/rescue features are **already installed as gated source/native mechanics**; don't create duplicate routes or falsely count intentional disabled portals as missing.

## Evidence

[Regionwright owner placement and click priority packet](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-bath-click-priority-owner-placement-2026-10-26.md), adjacent machine metadata, existing `tests/cav-unified-bath-pickup-ring-click-separation.test.mjs` four-new-test expansion, and append-only Regionwright chronological log.

**Next operational step:** Capture explicit owner approval of ring hitbox and Bowl fixture position on the original approved drained Bathhouse art; then install the Bowl's original native pickup Behavior in one guarded GM batch *without* forcing reward/water stages. Coordinate later module reload with Chat B. Full integration compatibility + real player tests remain deferred until installed.

**Status:** Source/native point classification VERIFIED, 242 tests PASS, **no new gameplay content installed this turn**; owner geometry decisions remain required.
