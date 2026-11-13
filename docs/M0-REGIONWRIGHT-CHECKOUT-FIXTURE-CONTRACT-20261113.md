# M0 Regionwright fixture source route and LF checkout proof

Date: 2026-11-13. Baseline DCH main 134810a90442701a94e6a8963a0842ef686b9a78. Scope: test-only paths and exact-byte checkout policy, NOT runtime promotion.

## Source layout provenance

- Region Editor Git HEAD 7a3e116c6377dbeb7dfb20512e6f89fd5291dbe6, current tracked source modules/regionwright/scripts/ascendancy-live-installer.js (module manifest 0.2.0), SHA256 8bb2860875a04de6f20ab087921046dafbc68e0f0c4e1e6cd0757c11a187fb92.
- Root-level Region Editor premium/scripts was archived on 2026-10-18, and no longer exists. The former root installer exists in the retired archive with exactly the same SHA256 as the currently tracked installer. The v4 staged installer CRLF working copy normalizes to the exact same historical bytes.
- Prior DCH handoff audit and preview tests used the now-missing root path. Two tests only now read the verifiable current tracked Region Editor module installer instead, retaining every existing semantic assertion.
- v5 disposable Regionwright installer was 29,776 checkout bytes with 359 CRLF sequences; its immutable sidecar expects 29,417 LF bytes and SHA256 F41BB7395D338E8C4CBF8D73A98100011EFCDDC7EB6095BB172E068D5E57F4D4. A new clean checkout with narrow .gitattributes eol=lf matches the sidecar without modifying it.
- v4 premium wrapper and both v5 entrypoint wrappers also had CRLF instead of the literal LF pinned by test assertions. Four exact tracked fixture paths are now configured text eol=lf; no other module or fixture policy changed.

## Clean checkout verification

- New detached proof worktree at local commit 647dfd0ecf937c18027ef3d6d62f7b0f1c432bfc, distinct from branch source and original dirty checkout; git status clean before build.
- npm ci --no-audit --no-fund PASS: dch-foreman-regionwright-proof-npm-ci-20261113-v001.
- Four focused Regionwright test files: 8 PASS, 2 FAIL; the two remaining failures require retired external premium-module source not available in active module 0.2.0. Receipt dch-foreman-regionwright-proof-four-targeted-test-files-20261113-v001.
- npm run build PASS: dch-foreman-regionwright-proof-desktop-build-20261113-v001.
- Full test suite: 1,315 PASS / 7 FAIL out of 1,322 across four failing files; previous baseline 1,309 PASS / 13 FAIL. Receipt dch-foreman-regionwright-eol-path-full-suite-20261113-v001, completed 2026-11-13T21:00:59Z.
- Full-suite private structured JSON SHA256: 15CEA8CD1C071CA99C2645FFCF6926E4C6FB17A894E7CDDC21DDDD0551A188B0. Temporary output remains local and is not committed.

## Remaining blockers and boundaries

- Map Lab two test failures are 29 CRLF versus LF pinned byte discrepancies, with strict UNKNOWN current issue ID and complete fix-attempt ledger; no test/repro/repair authorized on that slice.
- Regionwright handoff state readback: 3 assertions refer to old external root installer and module source. The current active module 0.2.0 differs from older v4 0.1.5 control block; do not replace tests with archived source and call that current.
- Regionwright staged fixture entrypoint: 2 assertions still depend on an external root-level premium-module.js that was archived. No supported active equivalent established, so no blanket path rewrite.
- Regionwright v5 has different installer content/version from v4; this work does not copy or overwrite either fixture, alter loaded GM identity gates, start Foundry, or install anything.
- M0 product status remains NOT_ACCEPTED, 0/8 independently verified. Remaining 7 assertions across four test files require separate source/provenance evidence.
