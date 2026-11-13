# M0 Regression Triage - Full Test Baseline, November 13 2026

Status: TRIAGED, NOT RESOLVED. Governing product roadmap: DCH Roadmap v2, priority M0.

## Exact test run

- Command: npm test -- --reporter=json --outputFile=(local temporary JSON report)
- Durable PowerShell request ID: dch-foreman-m0-next20-full-test-structured-classification-v2
- Run window: 2026-11-13 17:53:48Z to 17:57:36Z
- Source: earlier isolated M0 evidence worktree at commit 51dfd6633622882b623ef872c0a85c4cb0ae580c plus uncommitted image-prompt type repair, before PR 26 integration
- Source report SHA256: 17C61CB81CD48F26820DB2F491005F0D3396193BBA42316883B60FB918E7EC34 (private local JSON retained separately; not checked into GitHub)
- Result: 1302 passed, 20 failed, 1322 total tests; 289 passing files, 12 failing files, 301 files total
- Successful independent production build and 19 image-prompt targeted tests were verified in a fresh isolated worktree before PR 26 merged (main commit 24ceafa2db787e117a58cde5a5ab9ad4977fdd0a)

## Failure classification (observed symptoms, not certified root causes)

| Failure class | Failing tests |
| --- | ---: |
| Assertion/contract drift | 10 |
| External Regionwright installer missing | 5 |
| Regionwright staged fixture mixed failures | 3 |
| Bridge-host module parse failure | 2 |

| Failing test file | Failed assertions | Observed failure class |
| --- | ---: | --- |
| campaign-helper-map-lab-desktop-preview.test.ts | 1 | Assertion/contract drift |
| campaign-helper-map-lab.test.ts | 1 | Assertion/contract drift |
| current-foundry-artifact-spec-m1259.test.ts | 1 | Assertion/contract drift |
| dicebox-foundry-live-bridge-host.test.ts | 2 | Bridge-host module parse failure |
| foundry-package.test.ts | 1 | Assertion/contract drift |
| foundry-served-worker.test.ts | 2 | Assertion/contract drift |
| knowledge-base-query.test.ts | 1 | Assertion/contract drift |
| regionwright-handoff-audit-contract.test.ts | 1 | External Regionwright installer missing |
| regionwright-handoff-preview-contract.test.ts | 1 | External Regionwright installer missing |
| regionwright-handoff-state-readback-contract.test.ts | 3 | External Regionwright installer missing |
| regionwright-loaded-identity-attestation.test.ts | 3 | Assertion/contract drift |
| regionwright-staged-fixture-entrypoint-contract.test.ts | 3 | Regionwright staged fixture mixed failures |

## Evidence interpretation and next action

- External Regionwright handoff test files depend on an installer script in a separate local Region Editor premium folder; that file was absent. Preserve the legitimate dependency or isolate the provenance contract before rerunning; do not fabricate the script.
- Regionwright staged fixture entrypoint failures include both an observed assertion mismatch and an absent external premium-module script. Investigate independently.
- Bridge-host test imports a Node CLI module with an executable shebang; the Vitest loader reported SyntaxError (unexpected token). Reproduce with exact native Node and Vitest loaders before changing code.
- Map lab, M1259 artifact hash, Foundry package/served-worker, knowledge-base query, and loaded-identity tests show assertion or contract drift. Inspect expected versus actual source/checkpoint; a failing assertion is not proof which side is correct.
- This 20-failure suite is not green, nor is a successful desktop build an installation into a disposable Foundry world.
- The evidence register remains M0 NOT_ACCEPTED and 0 independently verified criteria. Preserve the exact source and required world/owner controls.

Recorded by ChatGPT Foreman in isolated source worktree from merged main. No external Regionwright or Foundry world files were edited for this triage.

## Native Node loader follow-up (November 13, 2026)

The two baseline failures in tests/dicebox-foundry-live-bridge-host.test.ts reproduced under Vitest as a SyntaxError at the dynamic import of the shebang-bearing executable entrypoint. A separate native Node ES module import succeeded (8 allowed operations, expected loopback allow/remote deny). The production bridge source remained unchanged.

The test was adjusted in an isolated worktree to import the executable through native Node child-process execution, preserving all original assertions for operations, origin restrictions, argument validation, and WebSocket frame behavior.

- Clean starting main commit: 29a8f95b812b05279fc18348e41ab8aaecbb2afe
- Native Node read-only import probe: dch-foreman-m0-bridge-host-native-import-probe-file-20261113-v001, PASS
- Baseline focused test: dch-foreman-m0-native-host-test-baseline-20261113-v001, FAIL 2/2
- Corrected focused test: dch-foreman-m0-native-host-test-targeted-after-fix-20261113-v001, PASS 2/2
- Desktop npm run build: dch-foreman-m0-native-host-test-full-build-20261113-v001, PASS
- Full-suite run: dch-foreman-m0-native-host-postfix-full-suite-20261113-v001, 1304 PASS, 18 FAIL, 1322 total, 301 test files, completed 2026-11-13 18:28:01Z
- Full-suite structured output SHA256: 49D11E28144E831BBBD563DF57ADE5002082014D06D4C2821269080D9CE72329 (local temporary report kept outside repository)
- Remaining 11 failing test files correspond to the prior baseline excluding the now-passing bridge-host test file.
- No production Bridge/DCH host logic, live Foundry world, or external Regionwright fixture was modified by this patch.
- Full suite remains failing; M0 product acceptance remains NOT_ACCEPTED and must not be inferred from two fixed test-loader failures.
## Committed knowledge-base count reconciliation (November 13, 2026)

A single knowledge-base summary expectation was stale relative to the committed read-only database. The original test expected sources 2083, facts 1658, decisions 1678, trials 1260, research subjects 41 and milestones 117. Direct immutable-mode read-only SQLite counts independently confirmed the committed database actually contains sources 2092, facts 1670, decisions 1687, trials 1269, research subjects 45 and milestones 117.

- Database: database/dicebox_campaign_helper_knowledge.sqlite (SHA256 BB1884D58CDA8FA603B3DF72C3E94A19D479D493F2E061001CFD0B08B5041A88)
- Repair scope: only tests/knowledge-base-query.test.ts, summary expected counts and pinned database hash comment; no database or query implementation writes
- Canonical starting main: a8821437d4ef2b5b7c448ecb9d45863acaf07513
- Immutable read-only query receipt: dch-foreman-m0-1102-knowledge-db-independent-counts-v002
- Focused baseline: dch-foreman-m0-1105-knowledge-base-query-baseline-v001, 95 PASS / 1 FAIL
- Updated focused suite: dch-foreman-m0-1104-knowledge-test-targeted-v001, all 96 PASS
- Desktop npm run build: dch-foreman-m0-1104-knowledge-build-after-count-update-v001, PASS
- Full npm test: dch-foreman-m0-1105-knowledge-full-suite-regression-v002, 1305 PASS / 17 FAIL / 1322 total across 301 files; ten files still failing
- Full-suite local JSON report SHA256: 59120411FF3D9DD2EB0401C93B41F21184518D1E49C1BEEB4F0DF018EFF163D2 (local untracked report, not published)
- This fixes exactly one additional baseline failure after PR 28; no full-suite or M0 acceptance claim is implied.

The remaining 17 tests still fail, and native-GM module activation as well as authenticated caller-thread proof require separate evidence. M0 product status remains NOT_ACCEPTED.