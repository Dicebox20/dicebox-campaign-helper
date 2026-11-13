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
