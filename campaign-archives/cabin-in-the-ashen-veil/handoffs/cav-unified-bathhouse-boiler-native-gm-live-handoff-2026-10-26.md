# Cabin in the Ashen Veil — Unified Bathhouse Boiler Puzzle LIVE Native Installation Handoff
**Date:** 2026-10-26 Pacific, approx. 12:05–12:25. **Owner:** "continue". **Status: Implemented and native enabled; structural/script/UI readback passed; actual non-GM gameplay interactions NOT tested.** Original owner directive defers Crooked Man Actor and full PC gameplay tests.
## Canon and corrected architecture
Keep the existing single unified Bathhouse artwork/Scenes, NOT the superseded separate BATH-03 Boiler/BATH-04 Reliquary scene plans. The filled Bathhouse is `Scene.CAVBATHScene0001`, drained is `Scene.8yLMRDvxyw58dydh`. Existing region `CAVBBOILERCTRL01` exists on BOTH maps in the southwest pressure controls. Boiler target is **left 2/right 1**, while Puzzles & Locks generic standalone Boiler demo target is 2/4. The Boiler does not unlock a fictional onward estate exit or drive the Pond Sluice; dry pathways and Bowl pickup are separate owner map decisions.

## Implemented source and exact commit
Regionwright `Dicebox20/regionwright`, branch `codex/cav-sune-integration-20261026`, commit **`d9f4e73d5c4cc16404d6ff51c1a648ba9326fe48`**, pushed to origin and checked via exact `git ls-remote`.
1. `modules/regionwright/scripts/studio-cav-boiler-state.js`: pure reducer, initial [0,0], left/right ±1 bounded 0–5, reset/submit, GM-only exact **2/1**, revision and reserved/replayed/already-completed blockers, arbitrary client `success:true` ignored. 3 unit tests.
2. `modules/regionwright/scripts/studio-cav-boiler-puzzle.js`: elected active-GM `createChatMessage` service, validates message sender-author, live non-GM user, viewed Scene, visible OWNED PC token CENTER inside exact Region, allowed operations and expected revision. Enforces correct Puzzles & Locks 2/1 API and the actual native RegionBehavior ID, source string and three event types on BOTH paired water Scenes. Shared session flag `cavUnifiedBoilerPressureSession` has canonical full Region and drained mirror; reserve-before-write transaction, exact revision, stored message ID, stops upon reserved/mismatched state. No actor/item/token/Scene/water/door grant or teleport.
3. `modules/regionwright-puzzles-locks/scripts/waterworks-pressure.js`: adds `openCavBoilerCampaignPuzzle` reusing existing approved Boiler image, pressure board, valves and style. UI draws actual GM Region session positions, sends narrow GM requests only, refreshes on `updateRegion` and unsubscribes on closing. Generic standalone two-valve demo remains untouched. `modules/regionwright-puzzles-locks/scripts/api.js` adds `boilerCampaign.open`.
4. `modules/regionwright/scripts/studio-campaign.js` installs GM service and exposes `campaign.cabin.boiler.handleRegionEvent` + `describe`.
5. Details in Regionwright `docs/cabin-ashen-veil/unified-bathhouse-boiler-live-install-2026-10-26.md` and `docs/cabin-ashen-veil/unified-boiler-live-install-metadata-2026-10-26.json`, chronology appended to `regionwright-puzzle-update-log-2026-10-26.md`. Full related source suite **73/73 PASS**, module scripts copied to installed Foundry modules with exact SHA matches; local untracked before-script backups preserved under `docs/cabin-ashen-veil/backups/cav-boiler-native-gm-20261026`.

## Actual Foundry native changes
Exact GM identity: `game.world.id==='cabin-in-the-ashen-veil'`, Foundry **14.367**, dnd5e 5.3.3, Gamemaster 1 active elected, 47 Scenes, full Bath regions 6, drained 8. Both modules active. One native `executeScript` RegionBehavior **`CAVBOILERSCRPT01`** enabled on:
- `Scene.CAVBATHScene0001.Region.CAVBBOILERCTRL01`
- `Scene.8yLMRDvxyw58dydh.Region.CAVBBOILERCTRL01`
Each Behavior has exactly `behaviorViewed`, `behaviorUnviewed`, `behaviorDeactivated`, source:
`await game.modules.get("regionwright")?.api?.campaign?.cabin?.boiler?.handleRegionEvent(region, event);`
Existing Region flag `cavUnifiedBathPuzzleBinding` changed `STAGED_DISABLED→ENABLED` only for these two Boiler Regions, with `playerAcceptanceTesting:DEFERRED`; all other bindings remain unchanged. Live `api.campaign.cabin.boiler.describe().status === 'ready'` after authenticated source reload. Both `cavUnifiedBoilerPressureSession` flags **NULL** (no puzzle interaction or solution recorded).

### Recovery / exact receipts
- The first Behavior creation used a 17-char ID; operation returned uncertain, so a **read-only** GM audit showed BOTH regions had ZERO new Behaviors; no blind replay. Corrected to the supported **16-char** `CAVBOILERSCRPT01` and installed DISABLED one Scene at a time, verifying each and only then enabling pair and binding flags.
- A first Python hardening patch asserted before writing due source spacing; inspected exact live source, corrected patch. GM service now validates native Behavior ID/source/events, not merely any enabled script.
- Native disabled pair receipt `utility-harness/artifacts/cav-boiler-both-native-disabled-behaviors-verified-20261026.json`.
- Enabled native/elected GM receipt `utility-harness/artifacts/cav-boiler-unified-pair-native-commissioned-structural-20261026.json`, `status:NATIVE_BOILER_PAIR_COMMISSIONED_STRUCTURAL_PASS`.
- Non-gameplay UI smoke `utility-harness/artifacts/cav-boiler-gm-nonplaying-panel-smoke-20261026.cjs`: dialog rendered approved `boiler-pressure-approved.png` artwork, two gauges at zero, click controls and submit. Closed without chat/item/world write or completed session.
- Final authenticated GM post-source reload readback `utility-harness/artifacts/cav-boiler-gm-service-enabled-after-final-reload-20261026.json`: BOTH Boiler Behavior/Region pairs enabled, two session flags NULL, source API [2,1], original screwdriver Behavior still enabled, original unique Bowl `Item.1n5LONw3nYIy61O9` exists, drained-only Rosewater Region has ZERO behaviors, Sluice water/transaction remain NULL, 47 Scenes, no PC moved. No actual non-GM click/valve/submit player playtest was run.
- No unrelated commits/files touched. Full source suite 73 tests, 0 failed.

## Next in player-order
1. **Rosewater**: identify owner-approved FOUR unique interactive ring symbols; attach Regionwright existing 3-ring UI using exact [1,3,2] / 90°,270°,180° to drained-only `CAVBROSEWATER001`, with elected-GM authoritative rotation/submit and once-only session. Previous screwdriver click-exclusion source installed; verify before player-side testing. Do NOT create a new BATH-04 scene.
2. **Sune Bowl:** identify and explicitly owner-approve exact pickup feature/Region on the existing unified Bathhouse map, then implement one-time original `Item.1n5LONw3nYIy61O9` source claim; no duplicate template or Vault reward swap.
3. Keep legitimate player Boiler panel use and GM request/mirror verification for final owner-directed gameplay testing. No fabricated success, Crooked Man Actor or chase testing now.
4. Continue owner-directed <=25-minute batches, source tests, GM/native receipts, chronological Regionwright + DCH handoff/metadata/available-message transcript.

**Success boundary:** Live Boiler native behavior and GUI are installed and structurally verified, but Boiler puzzle has NOT been solved or player-acceptance tested. Rosewater/Bowl remain pending.
