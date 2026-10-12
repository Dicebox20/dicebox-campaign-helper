# Foreman Relay Checkpoint — CL-31 Complete / CL-32 PREVIEW PASS — 2026-10-07

**Turn window:** began 14:20:43 PT; checkpoint phase began 14:33 PT.
**ChatGPT conversation:** `6ac5de56-fd64-83e8-9053-8df1a6ec4d8d`
**Bridge session:** `ses-2acc6c95-33e0-470e-84fa-aa87a84196dd`
**Codex project/conversation:** `01a02313-4304-77f2-9a7c-1cee833d9832` / `01a1169f-92bb-7e31-9d9f-a57fdb35826f`

## Certified live baseline
- Foundry 14.367 / dnd5e 5.3.3 / world `the-lost-mine-of-phandalin`.
- **21 Scenes / 202 Regions / 101 RegionBehaviors / 33 Items**.
- Kernel `FHQiFYx6OntZVo9d` SHA-256 `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`.
- Ledger `xhlXv6CCH34HVga3`: revision 0, notices empty before gameplay.
- KB rebuild/verify PASS at **202 / 101**.
- Current canonical gate: **CL-32 N3 Behavior PREVIEW**.
- No outcome-unknown write exists.

## CL-30 N1 completed
- Scene `MAbLfBqG7qIVVuLN`; geometry `07db85982fb80f1447b320caeff0ff9089e8ff7b18b0f1fea3ab1ac2bba83ce6`.
- PREVIEW PASS → APPLY PASS → FINAL VERIFY PASS.
- N1 = **11 Regions / 7 behaviors**.
- Installed:
  - Walkable Railway Notice `g9OhfDhT1ooLMytV`.
  - Station Power Notice `hVHd0u0oGGs9RuTg`.
  - House Proof socket `Wkt3tjGMeTcbAp8z`.
  - Garden Proof socket `PrARTvhoOdP6Hw66`.
  - Rail Proof socket `DCiJSu6Fhgk99YsG`.
  - Three-Proof Station Power gate `KzJqBPzzR8nqyETR`.
  - Estate Railway interpretation `rE05s2DYz9o8Mfk1`.
- Canonical power state is `puzzles.n1.railwayPowered`.
- No `railCarActivated` state was invented.
- Estate Rail Car system Region and all transitions remain behavior-free/deferred.

## CL-31 N2 completed as safe partial
- Scene `4pc5akMBieHU7GvV`; geometry `39284bebfba282dc57fead4692426887e48e8ed3faead5bf06961d72b3ca2ed0`.
- PREVIEW PASS → APPLY PASS → FINAL VERIFY PASS.
- N2 = **9 Regions / 4 behaviors**.
- Installed:
  - Walkable Railway Margin Notice `vOB9uxkvWqmWwtLc`.
  - Flood/Drainage Evidence Notice `Q6HQifMiwmliZ6CN`.
  - Grotto Station interpretation `3U2E9roXN4fxNHba`.
  - N1-power → N2 fast-travel gate `RMsac2jW6Q64AmeU`.
- Canonical rail-car state is `puzzles.n2.fastTravelEnabled`; legacy `railCarAvailable` was not created.
- N2 Flood State remains behavior-free because B1 flood semantics are still deferred and no authoritative legacy `floodState` mapping was recovered.
- Platform lighting and all transitions remain deferred.

## CL-32 N3 preflight and PREVIEW
- Scene `pHQvDUDlyWZFuNrX`: **12 Regions / 0 behaviors** before APPLY.
- Geometry SHA-256 `43bcb471640053e7000a8b37c6cd5243179295f5fe80f0537077646b62df1fd3`.
- All seven relevant canonical Items resolved:
  - Brass Baggage Token `0kQdvlq6DxuNdw0n`
  - Station Route Plate `mmrZXHQTAFb43zcX`
  - Railway Switch Wheel `JrDy7pZP0QkLWaFy`
  - Cicada Wing IV `Oav2JovgXMOrrVsS`
  - Old Estate Survey `fc3iLVvzHbiaXGsB`
  - Cult Passage Diagram `zHP6ARf6vKV3RTt7`
  - Recent Route Fragment `pCRasmemswNMNrEX`
- Canonical N3 ledger states are:
  - baggageLockerObserved
  - baggageTokenAccepted
  - stationRoutePlateResolved
  - departureBoardResolved
  - switchWheelInstalled
  - recentUseObserved
  - walkableRailwayNoticeResolved
  - routeOverlay.oldEstateSurvey / cultPassageDiagram / recentRouteFragment / resolved
  - t3BranchUnlocked
- Legacy `n3.railCarAvailable` is not canonical and must not be invented.
- Exact relationship needed to set `t3BranchUnlocked` remains deferred to CL-33/CL-50.
- PREVIEW `central-lodge-cl32-n3-preview-v001`: **PASS**, read-only, 0 failures.
- Planned safe 11-behavior slice:
  1. baggage-locker-observation — hash `1a51cf2128f536f6daad8606594c0ff9eec16dbfa211bd6a730e26d998346187`
  2. baggage-token-route-plate — `7ad9e19ea12bff9d47e8ad94ce06ed0a1b905f2c3566e73daf68843d13d25602`
  3. departure-board-route-plate — `063b00971b8576c5c4d6dda2ae56171e2126b2ae527c0637cae0f1bcd466234c`
  4. railway-switch-wheel-install — `5210cb20045f8d93724dc14eebeb006f41a533298661d158cccabbff173d1c3b`
  5. cicada-wing-iv-recovery — `4abf9900e4446282a106237df8cae52b64b5794abda63c81cc59bbc771b98aff`
  6. recent-use-observation — `1b5586bd4a00e840373208abe21cddf2d107272410ff61fd0ae50cf1c2973669`
  7. walkable-railway-notice — `76cb323b5eab8336ff6cd433a07303c072f5394c82430ad991a570bbf67add99`
  8. cartography-old-estate-survey — `0451d6433608f009f771b3ca3bb4994947da1a221deb991a1a3dce87889a71a0`
  9. cartography-cult-passage-diagram — `79cd7480d47cc143338ab251a5dbb59e05aa207b4e9dc7f51f04fb9930205db2`
  10. cartography-recent-route-fragment — `f10e97b02fbe387ed95de2e230c5190e7a8c1af5d396aff024980218fd66b44f`
  11. cartography-route-overlay — `e55af15f2d7ac960e283519f4fae3ed97748d7fcd3f7e0f598843b7be05753c0`
- Expected post-APPLY total: **202 Regions / 112 behaviors**, N3 **12 / 11**.
- N3 Depot Lighting, Estate Rail Car State, Main Railway West/East, Branch Railway all remain behavior-free/deferred.

## Exact resume
1. Start at **CL-32 N3 APPLY v001** using the already-PASSed source hashes above.
2. Guard baseline 202/101, N3 12/0, geometry/kernel/ledger preservation.
3. APPLY the 11 planned behaviors only.
4. Run independent CL-32 FINAL VERIFY.
5. Reconcile KB to 202/112, then continue CL-33 T1/T2/T3 reconciliation.
