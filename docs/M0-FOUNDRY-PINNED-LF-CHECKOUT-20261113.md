# DCH M0 historical Foundry pin reconciliation: LF checkout integrity

Date: 2026-11-13. Base GitHub main: d5c77d4f49e22974080d0babc19602493d0a8c95. Branch commit eb1862fb2bdf15059c1d834c051790d85bcde895.

## Proven root cause

The historical M1259 artifact-pin integrity drift reported by PR #31 is a Windows working-tree byte conversion, not absent Git source artifacts. GitHub main Git blobs for adapter, installer, campaign package, worker and module exactly match all five historical SHA256 pins. Local core.autocrlf=true checks those text files out with CRLF, increasing each file byte length by its exact LF count; the source SHA then fails even though Git sees the working tree as clean.

The patch adds a narrow .gitattributes policy (text eol=lf) for precisely those five hash-pinned artifacts. It does not edit module code, historical M1217/M1259 receipts, module-byte-attestation.json, Foundry worlds, stored credentials or native caller-authentication logic. A second fresh checkout of the committed patch is essential: adding .gitattributes does not itself normalize the original already-checked-out files.

## Evidence from truly fresh Windows worktree

- New detached verification worktree: dch-m0-pinned-eol-fresh-verify-20261113 at commit eb1862fb2bdf15059c1d834c051790d85bcde895, confirmed clean with core.autocrlf=true.
- git check-attr text/eol for pinned module and package: text set, eol lf.
- Historical read-only pin audit: node tools/check-m0-foundry-pin-consistency.mjs returned exit 0, 10 consistency checks PASS, 0 DRIFT. This is not an M0 acceptance claim.
- npm ci --no-audit --no-fund: PASS (requestId dch-foreman-m0-1150-fresh-lf-npm-ci-v001).
- Focused affected Foundry tests: npm test -- tests/current-foundry-artifact-spec-m1259.test.ts tests/foundry-package.test.ts tests/foundry-served-worker.test.ts: all 23 PASS across 3 files (requestId dch-foreman-m0-1151-lf-pinned-foundry-targeted-tests-v001).
- Desktop npm run build: PASS (requestId dch-foreman-m0-1151-fresh-lf-full-build-v001).
- Full regression suite: 1,309 PASS / 13 FAIL of 1,322, seven files failing; previous baseline 1,305 PASS / 17 FAIL. Test requestId dch-foreman-m0-1152-pinned-lf-fresh-full-suite-v001; durable receipt completed 2026-11-13T19:58:27Z.
- Full regression private JSON report SHA256: 1D0321C4B06F275DEAE43F83D1588B79C9A30B50E2F8C6A4D94B1ECF36AF2A89. Raw report remains local and was not committed.

## Remaining test failures

- campaign-helper-map-lab-desktop-preview.test.ts: 1 failing assertions
- campaign-helper-map-lab.test.ts: 1 failing assertions
- regionwright-handoff-audit-contract.test.ts: 1 failing assertions
- regionwright-handoff-preview-contract.test.ts: 1 failing assertions
- regionwright-handoff-state-readback-contract.test.ts: 3 failing assertions
- regionwright-loaded-identity-attestation.test.ts: 3 failing assertions
- regionwright-staged-fixture-entrypoint-contract.test.ts: 3 failing assertions

Remaining 13 assertions are map-lab and Regionwright-related, unrelated to the now-reconciled Foundry pinned byte checks. PR #31 observations remain reproducible in older CRLF worktrees but are NOT evidence of content loss in canonical Git blobs. Prior recovery-candidate report in PR #32 retains value as evidence but is no longer needed to restore hash-pinned Git bytes.

## Acceptance boundary

M0 is NOT_ACCEPTED: no authenticated Foundry GM User collection / enabled-module behavior readback, no green full test suite, no complete owner approval, and 0 of 8 requirements independently verified. No in-place conversion or reset of the original dirty working tree is authorized by this change. Reproduce in a new clean checkout when validating byte-pinned artifacts.
