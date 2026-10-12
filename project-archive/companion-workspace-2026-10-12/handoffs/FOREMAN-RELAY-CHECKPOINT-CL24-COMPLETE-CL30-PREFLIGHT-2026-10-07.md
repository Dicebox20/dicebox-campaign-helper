# Foreman Relay Checkpoint — CL-24 Complete / CL-30 Preflight Reconciled — 2026-10-07

**Turn window:** began 14:02:17 PT; checkpoint phase began 14:15 PT.
**ChatGPT conversation:** `6ac5de56-fd64-83e8-9053-8df1a6ec4d8d`
**Bridge session:** `ses-2acc6c95-33e0-470e-84fa-aa87a84196dd`
**Codex project/conversation:** `01a02313-4304-77f2-9a7c-1cee833d9832` / `01a1169f-92bb-7e31-9d9f-a57fdb35826f`

## Certified live baseline
- Foundry 14.367 / dnd5e 5.3.3 / world `the-lost-mine-of-phandalin`.
- **21 Scenes / 202 Regions / 90 RegionBehaviors / 33 Items**.
- Kernel `FHQiFYx6OntZVo9d` SHA-256 `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`.
- Ledger `xhlXv6CCH34HVga3`: revision 0, notices empty before gameplay.
- KB rebuild/verify PASS at **202 / 90**.
- Current canonical gate: **CL-30 N1 Behavior PREVIEW**.
- No outcome-unknown write exists.

## CL-23 C1 completed this turn
- Scene `EDdktL7VUihbpKe9`; geometry `8d4ce4f6319acd5836ac8cf4fdbb4919a483b89d6da1c315dcdfec7f79c12f9d`.
- PREVIEW PASS → APPLY PASS → FINAL VERIFY PASS.
- C1 = **10 Regions / 6 behaviors**.
- C2 threshold Wall `oVJ6kFkHMxu4EKF8` remains closed before gameplay.
- Installed behaviors:
  - Shrine Incompleteness Notice `kjNImu4Jk0vRBwPH`.
  - Historical Use Notice `QGerMXwNayL2juM0`.
  - Covenant Seal socket `wuoQIgWq0JEezFWs`.
  - Ceremonial Censer socket `w4USynLRaeNCujg3`.
  - Shrine completion gate `gejvhtep5PqwBPqX`.
  - Devil Worship interpretation `vUO5NSyC1SZSD4XF`.
- Lighting/transitions deferred.

## CL-24 C2 completed this turn
- Scene `UNySMm7YkyYfh41x`; geometry `34bb530f622671eaa6eaf3bf9987f394a6c018d2c2240773e3f5c6c2839f66de`.
- PREVIEW PASS → APPLY PASS → FINAL VERIFY PASS.
- C2 = **11 Regions / 7 behaviors**.
- Installed behaviors:
  - Record Recency Notice `dJVzBs6JV210tNVX`.
  - Concealed Record Category Notice `Z8qPtpqZh6YrlP1O`.
  - Cult Passage Diagram recovery `pFDGC9s7nqTF0gV7`.
  - Infernal Cicada Body recovery `ZZDWUmvvKeKlGYL8`.
  - Firstborn pedestal / Child Bracelet socket `vjKg8AIbS4jXS0T9`.
  - Cult Records interpretation `ogKZIG4IOnBZvVJv`.
  - Measure / Ritual Rhythm interpretation `iCoG6HBUKE3BcxN1`.
- Lighting/transitions deferred.

## CL-30 N1 read-only preflight reconciled
- Scene `MAbLfBqG7qIVVuLN`: **11 Regions / 0 behaviors**.
- Geometry SHA-256 `07db85982fb80f1447b320caeff0ff9089e8ff7b18b0f1fea3ab1ac2bba83ce6`.
- Canonical proof Items:
  - House Proof `mszo9eSqFhAW3w1A` from U1.
  - Garden Proof `epEmys76We97Adnt` from E3.
  - Rail Proof `26fLgiWHkz8i2mzw` from B1.
- Runtime N1 state:
  - walkableRailwayNoticeResolved false
  - stationPowerNoticeResolved false
  - proofs.house/garden/rail false
  - railwayPowered false
  - estateRailwayInterpreted false
- Safe CL-30 behavior scope is **7 behaviors**:
  1. Walkable Railway Notice.
  2. Station Power Notice.
  3. House Proof socket.
  4. Garden Proof socket.
  5. Rail Proof socket.
  6. Three-Proof Station Power gate → `puzzles.n1.railwayPowered`.
  7. Estate Railway interpretation.
- N1 Estate Rail Car Region remains deferred. Scene build flags mention `railCarActivated`, but the canonical ledger has no such key, repository search found no authoritative downstream use, and N2 owns `fastTravelEnabled` plus its own Estate Rail Car State Region. Do not invent `puzzles.n1.railCarActivated`.
- Earlier “N1/N2 installed and locked” fact is now reconciled as **scene/build injection locked**, not gameplay-behavior completion. Do not rerun scene builders.

## Exact resume
1. Build CL-30 N1 PREVIEW for the seven safe behaviors above.
2. Preserve N1 Estate Rail Car system Region, all transitions, and lighting at zero behaviors.
3. If PREVIEW passes, guarded APPLY → independent FINAL VERIFY.
4. Continue CL-31 N2 afterward.
