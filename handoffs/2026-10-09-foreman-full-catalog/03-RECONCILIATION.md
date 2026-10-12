# Reconciliation notes and unresolved comparisons

## Proven resolved: interrupted N3 -> N1 test
Source proof: `work/clscale-central-lodge-migration-v001/clscale-pause-reconciliation-readonly-v001.json`, `clscale-depot-native-transfer-v001-final.json`, and later cleanup receipts.

An N3 disposable test Token with intent `10ea6dfd271bbba3` teleported through native Foundry Region API and arrived in N1 at top-left (2300,1395), elevation0. Source Token was absent and original character was unchanged. The source test reported a **ledger mismatch** only because entering the railway Regions legitimately triggered notice/observation behaviors: two walkable-railway notices, N1 estate-railway observed, and `puzzles.n1.estateRailwayInterpreted` became true; ledger revision advanced 0 to 2. **This was not evidence of an incomplete teleport or Codex contamination.**

A pre-test cold fixture backup and a separate post-test snapshot were used to isolate cleanup. The test-only Token and ledger changes were removed. An additional orphan `scenes.tokens.delta` and N1 parent Scene token reference were later found and repaired. The latest accepted fixture integrity check was **16/16 PASS** and nine suites **141/141 PASS** in companion checkpoint at 19:54:02Z.

## Preserved evidence
- `work/clscale-central-lodge-migration-v001/pre-depot-native-teleport-test-v001/` — cold backup before test.
- `work/clscale-central-lodge-migration-v001/post-depot-native-teleport-test-before-cleanup-v001/` — independent after-test snapshot.
- `work/clscale-central-lodge-migration-v001/clscale-orphan-scene-refs-cleanup-v001.json` — repair evidence.
- `work/clscale-central-lodge-migration-v001/clscale-live-intent-flag-smoke-receipt-v001.json` — later per-intent Journal durability smoke.
- `docs/CL50-DEPOT-HUB-FAST-TRAVEL-DESIGN-2026-10-09.md` — full narrative.
- Latest companion checkpoint — authoritative status of what was tested vs only planned.

## Outstanding *current* metadata discrepancy
A fresh Windows Task Scheduler read during cataloguing found `DiceBox-Offline-Preflight-15m = Disabled` whereas the older 19:54Z checkpoint says it had been `Ready`. It last returned result 0. Another worker may have paused it for legitimate reasons. **Do not auto-reenable while other activity or a live world writer may exist**. Confirm current port 30005 listener and current process ownership independently.

The source Git working tree is heavily modified and untracked. The inventory is **non-atomic**; some hashes/timestamps may change if Codex works concurrently. Do not assume all indexed files form a single synchronized source revision; verify individual required files before applying patches or running tests.

## Product-wide versus campaign-specific gates
Project charter and roadmap have independent product release gates. Static contract, local bridge prototype, or Central Lodge fixture test passes are not product-ready certifications. `docs/ACTIVE-TRAM-SLICE.json` marks the older Ascendancy Tram lane retired historically, not an active Central Lodge path. Do not revive it accidentally.

## Pending user request not proven fulfilled
Earlier request: create a **second Gamemaster account on the Foundry VTT test server**, provide the port, and continue development. This handoff has not created or verified a second GM. Identify existing users safely first to prevent duplication, and use normal Foundry user management for credentials and permissions. Port **30005** is local-only and generally stopped; `http://127.0.0.1:30005/` is not a public external URL.

No production world, Foundry user, scheduled task or Bridge identity was changed by this handoff.
