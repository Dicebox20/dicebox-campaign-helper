# M0 Foundry artifact pin drift: restored snapshot reconciliation

Date: 2026-11-13. Status: BLOCKED, not resolved. DCH Roadmap v2 M0 remains NOT_ACCEPTED.

## Scope and reproducible read-only audit

- Canonical checkout: GitHub main aa9c1abcac809fae655080029e5d9e6f2d30d0a4 in isolated branch owner/dch-m0-artifact-pin-drift-audit-20261113.
- Tool: node tools/check-m0-foundry-pin-consistency.mjs. It performs only local readFile and SHA-256 operations; no source, world, module or receipt mutation.
- Focused tests: node --test tools/check-m0-foundry-pin-consistency-self-test.mjs: 5 pass, 0 fail.
- Real audit: exit code 2, status BLOCKED, 6 drift checks and 4 matching consistency checks, readyClaim false, milestoneAcceptance NOT_ACCEPTED.
- Historical Git evidence: the affected source and sidecar files enter Git history at restoration commit 6da5a9e0f9d8483289740ec88e97b789938b203a on October 1, 2026; repository history does not reveal intervening pre-restoration revisions.

## Actual source versus pinned historical receipts

| Check | Stored expected value | Current source value | Result |
| --- | --- | --- | --- |
| Adapter SHA256 | 3a063c2dec5a4bf7ad7b6b13ce602ff4edcf32071c419e3ad7c5d265274113ab | d01267a40ec9ec0d0fe6cc9df4ee065f74baef596e5f798ca5adf879b04c8525 | DRIFT |
| Installer SHA256 | 579f96e4948bbfc7b508f29cbde57e2dd331ddee89c6be1f0464f9eaffbfe731 | a3511b5d809b28a16f4aba788a06102d011b41e9bfad8b5d9cb9b1604e890272 | DRIFT |
| Package SHA256 | 1dd01cd3391a9c0687e64e5d2f7311efe09d1e614ac9b5737355f3b42135dbe5 | 2595e75fc2f3bdc678561d32b6dea3b93790c571f582b0001db9f46433c1928b | DRIFT |
| Worker SHA256 | 2b4f79997cab9c963c7f3826bfd2baf2b3dec256f630970a8d7cdd983743aa87 | 6d7f278fa76eec67786fd1f10c9e20af8673bc7b2996d36c66bf2be22a3019a6 | DRIFT |
| Module SHA256 | cee29eb17aac6b53da42e2f35aaca4b521dc4f2338e24f4252f79b62891eee1f | d8fc92676d5a0d275df442125bcc8e45b44fedf45b999e1424da634f25d1a8f6 | DRIFT |
| Module bytes | 114787 | 117022 | DRIFT |

The saved M1217 and M1259 receipts agree that the campaign package hash did not change between those historical milestones. The M1259 installer pin differs from the M1217 installer pin as historically intended. The sidecar spec ID and verifier ID match the M1259 receipt. These four historical relationships PASS, but do not establish the correctness of the restored current bytes.

## Impact and decisions pending

- The M1259 current-artifact-spec test currently fails on an M1217 package-hash continuity guard; that failure is consistent with actual package drift.
- The GM-only loaded-byte attestation test currently returns BLOCKED because the current module hash and byte length do not match the package-owned sidecar; this is the correct fail-closed response.
- The previously served disposable Foundry fixture v3 module bytes were independently verified to match installed source bytes. That does not establish which historical version is authoritative or prove a GM-active loaded module.
- Preserve immutable historical receipts, the existing sidecar, and all guards until source-of-truth provenance is recovered from original pre-restoration source/release or the owner explicitly authorizes a new versioned artifact specification and independent matching acceptance evidence.
- Do not interpret current-byte hash computation as authority to silently rewrite prior M1217/M1259 pins. M0 product acceptance remains 0/8 independently verified.

No production module, artifact pin, Foundry world, or existing checkout file was changed by this diagnostic slice.

## Regressions checked against this diagnostic

- Node dependency install: npm ci --no-audit --no-fund PASS (request dch-foreman-m0-1127-artifact-audit-npm-ci-v001).
- Production desktop build: npm run build PASS (request dch-foreman-m0-1128-pin-audit-main-build-v001).
- New pin-audit 5/5 self-tests PASS; existing M0 evidence-integrity check PASS, its 10/10 tests PASS, active-slice 5/5 tests PASS (request dch-foreman-m0-1129-pin-audit-all-focused-gates-v001).
- Whole source regression: npm test, 1,305 passed and 17 failed, 10 failing files of 301, 1,322 tests total (durable receipt dch-foreman-m0-1129-pin-audit-full-suite-regression-v001).
- Full-suite local structured JSON SHA256: 504AA03637A90262DA8EA5A924CA5601E6CBE281D24B06C4F4C129EAE5D3EE2F (file in local temporary directory, not uploaded or committed).
- The exact 17 failures were unchanged from the preceding accepted GitHub main baseline. In particular, M1259 and module loaded-byte contract failures remain BLOCKED as diagnosed rather than asserted to pass.

## Additional read-only candidate recovery (November 13, 2026)

A second local source checkout was found at C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper. This checkout is NOT the clean GitHub main branch and contains extensive preexisting uncommitted changes. Comparing exact read-only SHA-256 bytes from that checkout to the historical M1259 receipt identifies four matching artifact candidates; the worker remains different.

| Artifact | Older checkout bytes | SHA256 observed in older checkout | M1259 match | Git state in older checkout |
| --- | ---: | --- | --- | --- |
| adapter | 51394 | 3a063c2dec5a4bf7ad7b6b13ce602ff4edcf32071c419e3ad7c5d265274113ab | MATCH | tracked, unchanged |
| installer | 81788 | 579f96e4948bbfc7b508f29cbde57e2dd331ddee89c6be1f0464f9eaffbfe731 | MATCH | tracked, modified (unstaged) |
| package | 159683 | 1dd01cd3391a9c0687e64e5d2f7311efe09d1e614ac9b5737355f3b42135dbe5 | MATCH | tracked, modified (unstaged) |
| worker | 18841 | c4f84edcf4f0be32d16d3e88592f2a6fb4a3b15bfa0c0f3992a611f7f400d724 | DRIFT | tracked, modified (unstaged) |
| module | 114787 | cee29eb17aac6b53da42e2f35aaca4b521dc4f2338e24f4252f79b62891eee1f | MATCH | tracked, modified (unstaged) |

The module candidate is exactly 114787 bytes, matching the sidecar byte count as well as its SHA256. The older checkout HEAD is eb222b98342e17eaf6830182fac5d193be9e3784. Three matching candidate files (installer, package, module) are uncommitted modifications relative to that checkout HEAD; the matching adapter is tracked and unchanged. Their presence is strong evidence that historical exact bytes are locally available, NOT authority to overwrite current committed sources or approve any M1259 release.

Next action: use a disposable copy or separate clean worktree to compare the exact candidate source semantics and document the provenance bridge between the M1259 saved receipts, the restore snapshot and current GitHub main. Resolve the remaining worker mismatch separately. Require explicit owner acceptance of any restored version or a fresh versioned spec, and re-run all coupled fixed-byte/installer/loaded-identity tests before claiming a release. The original dirty checkout was not modified or staged by this investigation.

## Correction: pinned Git blobs were intact (November 13, 2026)

This report's initial six mismatches described *CRLF working-copy bytes*, not lost historical content. The canonical Git blobs for **all five** M1259 hash-pinned artifacts match the historical SHA256 pins. Windows core.autocrlf=true converted those files to CRLF on checkout, introducing exactly one extra byte per line ending. A narrow five-file .gitattributes text eol=lf policy produces a fresh clean checkout matching all saved hashes with zero differences. See docs/M0-FOUNDRY-PINNED-LF-CHECKOUT-20261113.md and associated focused/full test receipts. Do not use the earlier DRIFT status as justification to rewrite historical pins or restore the dirty original checkout.