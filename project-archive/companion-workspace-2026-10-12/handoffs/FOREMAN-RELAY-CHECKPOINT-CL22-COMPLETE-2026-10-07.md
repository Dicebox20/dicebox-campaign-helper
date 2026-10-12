# Foreman Relay Checkpoint — CL-22 Complete — 2026-10-07

**Turn window:** began 13:33:25 PT; checkpoint phase began 13:46:37 PT.
**ChatGPT conversation:** `6ac5de56-fd64-83e8-9053-8df1a6ec4d8d`
**Bridge session:** `ses-2acc6c95-33e0-470e-84fa-aa87a84196dd`
**Codex project/conversation:** `01a02313-4304-77f2-9a7c-1cee833d9832` / `01a1169f-92bb-7e31-9d9f-a57fdb35826f`

## Relay rule correction
- D-445 / AGENTS.md now explicitly requires using as close to the full 15-minute turn as safely possible.
- Completing a milestone early is not a checkpoint trigger when another safe roadmap step is available.
- Checkpoint begins near the end with enough margin to resolve writes, save, and relay.

## Certified live state
- Foundry 14.367 / dnd5e 5.3.3 / world `the-lost-mine-of-phandalin`.
- Canonical baseline: **21 Scenes / 202 Regions / 77 RegionBehaviors / 33 Items**.
- Kernel `FHQiFYx6OntZVo9d` SHA-256 `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`.
- Ledger `xhlXv6CCH34HVga3`: revision 0, notices empty before gameplay.
- KB rebuild/verify PASS at **202 / 77**, current gate **CL-23 C1 Read-Only Preflight**.
- No outcome-unknown write exists.

## CL-21 E1 completed this turn
- E1 Scene `Zq8iXByDVhHRbA7w`; geometry `0b39046a2eb2bae365417a98b22f39611bcbfeb71c24f8a78864adf0dec9ed2e`.
- FINAL VERIFY PASS; E1 = **6 Regions / 3 behaviors**.
- Installed on Hound Region `vrJhFjH9RQyKoaXU`:
  - Hound Notice `iGynXhn2aIXnIJbD`, source `46511fa7c27b56ae161164d5f408f0666226e7c3aaa2554506f499804d1e472a`.
  - Recent-use observation `mCvwavNT6uCJgcog`, source `3d52a1ece3ee6d94d165f1eb39e981901ff9941d886b18da77f66afc653c3065`.
  - Black Garnet Eye socket `ZlJF3skaliouEPWl`, source `7f6c0618b02c2a455ae117c8e07a6cccfcdec4665100166888d19e58a4d8f541`.
- Stateful Hound Tile `VS2E5k2zKpk1U6ee` remains missing-eye pre-game; runtime wrapper swaps only that Tile after successful socket and sets blackGarnetEyeInstalled/houndResolved/estatePlanObserved.
- E1 transitions remain deferred.

## CL-22 B2 completed this turn
- B2 Scene `5K1uASAARnX8aZhP`; geometry `585f7c4612de8bffed40d7c3938bf1f65a5d85ae506bc90c2fc27a4eda841c81`.
- PREVIEW PASS → APPLY PASS → FINAL VERIFY PASS.
- B2 = **10 Regions / 5 behaviors**.
- Installed:
  - Cicada Wing I recovery `zo9jjn7taB5Qp504`, source `1c08d5697a3a4652a63c592c02285df933742414f08f686a7a06a05030f28dce`.
  - Victim History Notice `QWiSK65LNLHiVvT0`, source `213fd45f091fce662f46e19659b399d773d6ad7d23ed7fc65f5180784234f81b`.
  - Preparation Use Notice `Vhu3CUD1z1k0J0iz`, source `603edaa99f6d1ecc7cae307b3587d2a01dae8e09709ade33ef5c54b4715c948c`.
  - Sacrifice Evidence observation `vvOCMBTnB4Nyu1ja`, source `d199320ecc3b7f76b5a402ade06c429ec91d26c3c0176dd156dee18e0e30be13`.
  - Recent Use observation `ZVNqwsAUM0IOX9eq`, source `df2269c390e5e689673c4b99e7a8c032d8dbd9238072f4c1e130453fb9b30179`.
- Three B2 lighting Regions and two transitions remain behavior-free/deferred.

## Exact resume
1. Start **CL-23 C1 Read-Only Preflight** database-first.
2. Reconcile Asmodean Covenant Seal + Ceremonial Censer sockets, shrine gate, and C2 unlock.
3. Inspect C1 live Region manifest/geometry/state and exact blocker/door if present.
4. PREVIEW → guarded APPLY → independent FINAL VERIFY.
