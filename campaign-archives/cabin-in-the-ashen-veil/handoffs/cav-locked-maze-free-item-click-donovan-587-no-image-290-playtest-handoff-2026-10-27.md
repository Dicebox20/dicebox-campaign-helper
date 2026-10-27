# Cabin in the Ashen Veil — owner-directed three-region issue fixes (playtest handoff)

**Date:** October 27, 2026 Pacific. **Explicit owner operating rule:** When owner identifies a puzzle problem, fix that exact issue without requiring new approval, but **ASK before any unrelated additional repair**. Owner and assistant test one Region at a time; owner reports activated/missing/failed. Continue this workflow.

## Owner's current request and implemented state

1. **Yard→Maze locked-message:** Original `Scene.CAVEXT01Yard0001.Region.CAV01R0000000002` remains disabled teleport `GRC83AT3emhbNVUL` until the genuine inside-maze original `Scene.CAVFM01Scene0001.Region.t9MFbLLnSR173tGH` unlock. Added original Region ExecuteScript `CAVMAZELOCKMSG01`, enabled `tokenMoveIn` event, sends an actual player-owned entering character a private clue-safe description: “The old iron gate will not budge. Its heavy locking mechanism remains firmly engaged.” The notice is silent after the teleport is enabled. Original two-way route unchanged. First attempted fixed ID was over 16 chars and rejected before a new Behavior was created; corrected and installed once. Exact GM source/native readbacks PASS; real nonGM event not yet tested.
2. **Donovan 587 combination UI:** Original `Scene.CAVEXT03Scene001.Region.CAVEXT03BOXREG01.RegionBehavior.CAVEXT03BOXBEH01` updated IN PLACE, with the revealing map-crop closeup **removed from the dialog** and the existing First Chest (024) three stacked digit-wheel/arrow UI pattern substituted for 587 dropdowns. Mousewheel, arrow-up/down key, event teardown implemented. The underlying original `donovan-lockbox-try` GM source, real 587 Study note prerequisite, 587 solution, Sluice Crank award/ledger, Item custody and reward proof are UNCHANGED. Updated original native source SHA256 `5f921f26ef3b4c074d313ac201e91b51fedfeb6877961cffe5d512e0636bdda9`. Same-call and independent GM source readbacks PASS; real nonGM digit-wheel click not yet tested.
3. **Six free-loot click-to-Collect Regions:** Added explicit player-click interaction to the SIX existing actual native pickup Behaviors, preserving original movement-based Item grants and all original one-time ledgers:
   - **Wooden Oars** (original historical DONE already on Skaal Tel): `Scene.CAVEXT03Scene001.Region.TWKOyz83JjJu94E7`, original `CAVOARSBEHAV0001`. Already DONE, so Collect cannot grant a duplicate; should display Close.
   - **Lamp Oil:** `Scene.CAVEXT03Scene001.Region.CAVEXT03OILREG01`, `CAVEXT03OILBEH01`.
   - **Old Iron Key:** `Scene.CAVHU04Scene0001.Region.CAVHU04COATREG01`, `CAVHU04COATBEH01`.
   - **Clockwork Winder:** `Scene.KwpmPrYgEC7KQVCZ.Region.82gAoSwyIPu8EdQs`, `SuECFpdFlDtFf3j0`. Keep authentic attic ladder/teleport access gate.
   - **Attic Minute Hand:** `Scene.nyF5EX0JiEu23C3p.Region.UtXhS68vd1czWfTG`, `whiZBUmM3mbZEOwF`. Keep same attic gate.
   - **Sophia first Glass Eye:** `Scene.CAVHU05Scene0001.Region.CAVB0FDF8543F6D9`, `aZlQOQfF6gPrMaye`. Keep genuine locked Sophia door gate.

## Bounded, established native item-creation workflow

New Regionwright source `modules/regionwright/scripts/studio-cav-free-pickup-click.js` declares a **fixed six-item allowlist**, unlike an unsafe generic arbitrary item picker. Player-side click requires one selected player-owned character. The player submits an authenticated `ChatMessage` with `cavFreePickupRequest` action, canonical Scene/Region/token UUID only. The elected-GM listener independently checks the true sender/user, active viewed scene, Region observation permission, actor ownership, actual token proximity, exact original world source Item, original attic or Sophia story access gates, reserved/DONE ledger, global absence of any previously-granted original Item, and a busy lock. The elected GM then follows original reserved → one Actor embedded Item → DONE native ledger, retaining exactly correct original provenance flags. No client may create Item directly; no synthetic awards performed.

Original installed `studio-campaign.js` was changed by **exactly 2 lines** to import and arm new helper on future standard module load. The new helper was installed into the authorized Foundry module folder with SHA-verified source copies; original installed bootstrap source parity was checked before its small update. **NO full Regionwright module/client reload** during concurrent Chat B Undercroft work. Instead a single GM dynamic import of the new standalone source module registered runtime `createChatMessage` listener **ID 659**, once, in elected Gamemaster session, with zero added ChatMessages or Actor items. The bootstrap guarantees listener registration on a future coordinated module restart.

One generated canonical source manifest stores exact old and new source scripts and hashes for all six: [six free-loot native behavior source manifest](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/cav-six-free-click-pickup-original-behavior-source-manifest-2026-10-27.json). Original Oars `tokenMoveIn` also gained `behaviorViewed/behaviorUnviewed/behaviorDeactivated` for click lifecycle; all other original Behavior events unchanged.

## Verification

- **290/290 full Cabin source tests PASS**, 0 failures across 54 files. Six new tests validate original source hashes / all six compiled behaviors / allowlist / real location & owner proof / original attic-Sophia gates / bootstrap re-registration.
- **Six of six actual original native Behavior updates PASS**, original Region flags and disabled states preserved; no Actor items, player token positions, reward claims or chat history changed during installation.
- **Independent second elected-GM live read-only check SIX of SIX PASS**, new hot GM service ID 659 still present, correct locked-gate message and gate disabled, Donovan 587 image-free source hash exact and originally enabled.
- **Regionwright remote-verified HEAD:** `fb3b3f3770628044d243ec4c8d34282fb998f893` on `codex/cav-sune-integration-20261026`, parent `74ee7cba7791e52dc3b691600f984a694271bdb0`.
- Full technical [Regionwright QA report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-owner-directed-locked-maze-clickable-free-pickups-donovan-587-wheel-2026-10-27.md).

Host machine receipts under `C:\Users\rujie\AppData\Local\Programs\Chrome for Testing Dev\utility-harness\artifacts`:
- `cav-locked-maze-gate-player-notice-20261027.json`
- `cav-donovan-587-lockbox-wheel-without-image-native-update-20261027.json`
- `cav-free-click-GM-service-hot-register-no-world-reload-20261027.json`
- `cav-six-free-pickup-player-click-native-original-behavior-updates-20261027.json`
- `cav-free-click-six-regions-gate-donovan-independent-elected-GM-proof-20261027.json`

## STOP HERE — owner tests one Region at a time

The actual clickable pickup, gated-maze notice and image-free 587 UI are **SOURCE/NATIVE VERIFIED, not yet non-GM click tested**. A currently-open player client may need to leave/re-enter the scene or locally refresh to rebind `behaviorViewed` pointer handlers; do **not** restart the shared GM/module while Chat B is active. Next appropriate **single player checkpoint** is Donovan Shack Lamp Oil `Scene.CAVEXT03Scene001.Region.CAVEXT03OILREG01`: select one genuine owned character nearby, click the worktable and choose **Collect**. Owner will report whether it activates, is missing or fails; investigate that finding before any other repair. **Never fabricate/duplicate the already-claimed Oars or reset a real ledger without a separate owner request.**
