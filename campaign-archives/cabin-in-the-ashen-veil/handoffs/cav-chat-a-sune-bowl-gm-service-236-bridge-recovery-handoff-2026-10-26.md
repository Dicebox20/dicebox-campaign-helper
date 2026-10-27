# Cabin in the Ashen Veil — Chat A Sune Bowl GM service: Bridge recovery and staged source

**Date:** October 26, 2026 Pacific (UTC records October 27 05:39–05:50).
**Owner's latest instruction:** “the bridge is back up.” Preceding explicit owner requirement: use Dicebox Bridge for local access and finish installation before integrated compatibility tests.

## Verified checkpoint

- Exact GitHub Regionwright repository `Dicebox20/regionwright`, branch `codex/cav-sune-integration-20261026`.
- **New verified remote HEAD:** `0b4a30f0efe69642e95d81be221ad688ed54859d` from base `b1f926418facb5d1e483fadf7bb7fd7c166743d1`.
- **Full Cabin Node source regression 236/236 PASS**, zero failures, 43 test files. Bowl-specific focused test suite 19/19 PASS (previous 17).
- Exact source document: [Regionwright technical report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-bowl-bridge-recovery-commissioning-proof-2026-10-26.md), adjacent JSON and chronological log.
- New Sune Bowl GM-only service `modules/regionwright/scripts/studio-cav-rosewater-bowl.js` with preexisting Studio Campaign registration `studio-campaign.js`, previously prepared during failed Bridge session.
- Corrected Bowl service **deployed to installed module disk** `C:\Users\rujie\AppData\Local\FoundryVTT\Data\modules\regionwright\scripts\studio-cav-rosewater-bowl.js`, SHA256 `70732E8FD211AC2BC6887EBE2EA9EEC572BBE807BDADC47F68F909F92D758C65`, equals local source. Original installed file SHA `CE9E9E08D61396FACA1366E5D16C2DF18DCCEF7E78830D761BD458CE4BC3BCB3` preserved in separate CFT Utility Harness artifact `cav-chat-a-bowl-original-before-ring-receipt-hardening-20261027.js.txt`.
- **No Foundry browser/world reload; no authenticated GM runtime import/readback.** Dev Chrome CDP 9224 unavailable, Foundry 30000 reachable. The last observed browser was Join Game; do not open another competing GM session without coordination.

## Bridge recovery evidence

Bridge 0.1.26 `bridge_doctor`: local journal/runtime/tunnel/PowerShell ready. Exact current ChatGPT identity was missing and unverified (`currentChat.status=missing`), so do not claim any Foreman/native partner-chat roundtrip. Direct persistent Bridge `powershell_execute` worked. Older uncertain source-hardening request `cav-chat-a-bowl-native-ring-receipt-proof-hardening-v2` returned `not-recorded`. Direct on-disk comparison proved its prior edit never applied. Do not replay uncertain writes; this turn deliberately recovered from original recorded byte hashes.

## Exact new original-proof improvement

Read the authoritative existing `studio-cav-rosewater-rings.js` and `studio-cav-rosewater-state.js` source. The ring GM service records RESERVED then DONE, with an actual committed `cavRosewaterRingSession` bearing version 1, positive revision, canonical ring positions `[1,3,2]`, player/Actor and request ChatMessage IDs.

The prior Bowl service accepted only a bare ring `status=done`. The corrected Bowl GM service also requires **original native Rosewater RegionBehavior commissioned**: proper unified Bathhouse fixture key and ENABLED binding/puzzle type, original enabled script source, and all original three events. It then validates the full completed ring claim record, original owner approval for future Bowl fixture, original unique World Bowl `Item.1n5LONw3nYIy61O9`, committed original Crank and two-scene drain, authorized player/token at fixture, and no earlier Bowl actor award. One reserved→done GM-only creation contract retained.

No made-up approval, source Item, puzzle state, Crank, water flag or token change.

## What is NOT complete

- Bowl source is **source + installed disk VERIFIED**, not yet active in a reloaded Foundry runtime.
- **Original native Bowl pickup RegionBehavior NOT created or enabled**: owner has yet to approve the exact location/shape in unified drained Bathhouse artwork. Rosewater geometry remains provisional and overlaps original drained Screwdriver click region. Existing Rosewater behavior remains intentionally DISABLED pending genuine drainage and owner geometry review.
- Real non-GM player acceptance, full-campaign compatibility, cross-Chat-B merge/integration and GM runtime postread are NOT performed; per owner, do full compatibility diagnostic **after all campaign installation**, not now.

## Next safe continuation

1. Continue remaining **already-approved** Chat A installation items without touching Chat B. Do not fabricate puzzle ledger state or relabel an intentional gated teleport as uninstalled.
2. When appropriate with Chat B, use Dicebox Bridge to restore a single authenticated elected-GM browser/module session, perform read-only GM API import/readback, and verify the new Bowl service reports owner fixture missing and no actor Bowl copies.
3. Request/obtain explicit owner's actual Bowl fixture geometry and separate Rosewater/Screwdriver click separation before native Bowl/Region creation or ring enablement.
4. Preserve chronological transcript and technical receipts; only after all content is installed run owner-requested combined compatibility diagnostic and real player vertical-slice acceptance.

**Status:** 236 source PASS, commit/push verified, installed module disk byte-verified; actual Bowl pickup remains **not installed / not player-playtested**.
