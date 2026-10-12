# CL-50 E1→M1 and CL-52 M1 footsteps — governed installation receipt

**Date:** 2026-10-07 PDT. **Foundry:** 14.367, dnd5e 5.3.3, world `the-lost-mine-of-phandalin`.

## Live baseline, verification and scope

After both guarded writes, whole Central Lodge has **21 Scenes / 202 Regions / 116 RegionBehaviors / 33 canonical Items**. Macro count **133**. Shared kernel `FHQiFYx6OntZVo9d` hash `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`; canonical journal ledger revision **0**, notices empty. No gameplay canary, teleport, or audio playback occurred during this work.

Read-only cross-feature `cl90-progress-safety-smoke-v002.page.js` **PASS_WITH_KNOWN_BLOCKERS**, zero drift: 116/116 behavior stable IDs unique and enabled, 33 Items, M1 Footsteps cue unconsumed. Earlier Regions deletion request remains canceled; all 202 Regions preserved.

## CL-50: E1 to M1 front entrance

- Source E1 `Zq8iXByDVhHRbA7w`, Region `QS7OpvIilyyDpmLc`, stableId `dbx:central-lodge:e1:region:e1-lodge-entrance`.
- Target M1 `U8S5ZrTjaPIkTUIL`, Region `4b8vfvKAKXBS6kfW`, stableId `dbx:central-lodge:m1:region:m1-transition-main-door`.
- Source baseline geometry SHA `0b39046a2eb2bae365417a98b22f39611bcbfeb71c24f8a78864adf0dec9ed2e`; M1 SHA `03418a0e99c659fc76d109e5c061ccaf5244448504d0f4d03238416032dcd158`.
- Created RegionBehavior ID `HBtxj5OwVSOJdqnC`, stableId `dbx:central-lodge:e1:behavior:main-entrance-to-m1`, source SHA `f144c80ca7789ea0ca246a43529bea56b53776d965b1c6471670a89abf236b0f`.
- Region metadata `bindingStatus=BOUND_CL50_E1_TO_M1`, `destinationStableSceneId=dbx:central-lodge:m1`.
- One-way `tokenEnter`, GM-confirmed player intent, per-character concurrent-lock/decline-cooldown. Existing six E1 tokens (one overlapping doorway rectangle) were inspected before and reread unchanged after APPLY. M1 still has no return behavior, avoiding automatic bounce.
- Offline tests **8/8 PASS**; no-write PREVIEW PASS; first installer invocation stopped at parse before mutation due missing outer object brace; corrected source generator, syntactic tests PASS; guarded APPLY PASS; **separate** `cl50-e1m1-final-verify-v001.page.js` PASS at 202/116. Real player cross-Scene teleport remains a canary.
- Rollback recipe, **not executed**: only if behavior source SHA and exact stableId match, delete RegionBehavior `HBtxj5OwVSOJdqnC`; unset the two CL-50 Region metadata keys; expect 202/115 and ledger still rev0. Original full 202-Region snapshot in `work/foundry-playwright-harness/receipts/region-cleanup-2026-10-07/` also contains the unmodified E1 original Region. Do not delete the Region itself.

## CL-52: first original horror audio cue

- Original synthesizer `work/foundry-playwright-harness/generate-m1-footsteps-audio-v001.cjs`, project master `assets/cl52/audio/m1-distant-footsteps-v001.wav` and original SHA manifest `assets/cl52/audio/m1-distant-footsteps-v001.manifest.json`.
- 5.5s stereo PCM16 48kHz, 1,056,044 bytes, subtle muted steps and wooden creaks, no third-party samples, peak target 0.36, no harsh/sudden impact.
- Foundry Data world asset `worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52/m1-distant-footsteps-v001.wav`, SHA256 **`3e29666ae6a5a5819fcb7d2f58f5060c43cd18d23af0123918c758bb340ee3b5`**. Copied once; Windows SHA check matches. Foundry FilePicker exact file match and authenticated static HTTP HEAD `200 audio/wav` with correct size.
- World Script Macro: **DiceBox CL-52 — M1 Distant Footsteps (GM One-Shot)**, ID `P7mgEkmAUiJXYdUD`, stableId `dbx:central-lodge:cl52:macro:m1-distant-footsteps-one-shot`, source SHA **`4ff5a82aa5d57f8831f47063fab893eaea4d315942d59b9fbda99a0a1a9a42b6`**.
- Macro visible/executable by dedicated GM accounts only (`ownership.default=0`, `Gamemaster=3`, `Assistant Gamemaster=3`), runtime **primary active GM only**. GM must be viewing M1 and at least one active non-GM player must currently view M1; dialog requires affirmative manual GM confirmation. AudioHelper broadcasts only to player recipients viewing M1, moderate playback volume 0.32, no automatic Region trigger.
- Uses persistent **Scene-owned** one-shot `flags.world.dicebox.cl52.m1DistantFootstepsPlayed`; it is absent/unconsumed at install. Flag set before socket broadcast to avoid uncertain delivery causing automatic repeat; if broadcast outcome is uncertain, it remains consumed pending controlled GM review. Macro has per-primary-GM pending guard.
- Offline mock contracts **9 cases PASS** (nonprimary denial, wrong scene, zero audience, consumed, cancel, targeted success, uncertain broadcast, concurrent suppression). Foundry synthetic Macro document model/no-write PREVIEW PASS. Guarded `cl52-m1-macro-guarded-apply-v001.page.js` PASS and independent `cl52-m1-macro-final-verify-v001.page.js` PASS. **No Macro.execute/audio playback**; no players active in M1 during installation.
- Rollback recipe, **not executed**: verify exact macro ID/stableId/hash before `Macro.deleteDocuments(["P7mgEkmAUiJXYdUD"])`; delete original audio asset from Foundry Data only if no other project object uses it and file hash matches expected. Project master remains; no Scene flag to reset unless GM later plays the cue. Never reset consumption blindly after uncertain broadcast.

## How the GM uses it when ready

Open M1 in Foundry while players are viewing M1. As the primary Gamemaster, open the Macro directory and run **DiceBox CL-52 — M1 Distant Footsteps (GM One-Shot)** at the desired narrative beat; confirm the dialog. It plays once to the current M1 audience and marks that cue consumed. This is not tied to global night and requires no Region crossing. Player/GM listening and one-shot persistence should be separately canaried at a controlled session.

## Outstanding work

CL-50 remaining T1/T2 orientations, M1 numeric grandfather clock solution and N3→T3 branch unlock remain authored blockers. CL-51 global event-driven night requires GM chosen specific story event; approval of CL-52 effects did **not** silently choose that event. CL-52 other 11 cue candidates require individually sourced assets/triggers, separate install and player canaries. CL-90/91/92 full gameplay QA remains pending.
