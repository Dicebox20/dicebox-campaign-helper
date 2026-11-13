# DCH M0: exact source/served module-byte preflight

Date: 2026-11-13. Source main 81416f732086aaa721576d18ce0120a199ecfadc, clean isolated owner/dch-m0-served-module-preflight-20261113 worktree.

## Product scope

DCH Desktop and its dicebox-campaign-helper Foundry module, and ChatGPT self-development bootstrap ONLY. Regionwright is an entirely separate project and out of scope.

PR #37 left a 35-file canonical DCH module in disposable v3, world dbx-test-world, with the original kept for rollback. It validated static server-served files manually. This change makes static verification repeatable, with negative tests and no promotion of GM authority. It neither changes the fixture nor broadens its security permissions.

## Repeatable preflight

Run: node tools/check-m0-dch-served-module.mjs

- Reads the committed DCH package files src/module-byte-attestation.json, src/module.js, and src/foundry-live-bridge.js from the clean DCH source.
- Checks source module byte length and SHA-256 against the existing immutable package-owned sidecar: 114787 bytes, cee29eb17aac6b53da42e2f35aaca4b521dc4f2338e24f4252f79b62891eee1f.
- Makes exactly three allowlisted loopback HTTP GET requests to http://127.0.0.1:30002/modules/dicebox-campaign-helper/. Does not follow redirects. Timeouts and byte bounds apply, and no cookies/auth headers are supplied.
- Checks HTTP 200, full served byte SHA against source for all three, and module versus saved pinned sidecar. Produces per-file statuses, sizes, SHA hashes and blockers.
- Returns PASS_STATIC_BYTES_ONLY only for equal static bytes, otherwise BLOCKED. Even PASS reports authenticatedCurrentGm=NOT_OBSERVED, loadedModuleExecution=NOT_OBSERVED, authenticatedChatGptCaller=NOT_OBSERVED and m0Acceptance=NOT_ACCEPTED.
- Fixed target is disposable v3 local port 30002, no arbitrary endpoints or Foundry world writes.

## Verified local evidence

- Disposable Foundry v3 last observed listening on port 30002, PID 26860.
- Actual checker PASS_STATIC_BYTES_ONLY, three HTTP 200 responses with 523, 114787, 12288 bytes, source/served parity true for all, pinned source and served module verified. Receipt dch-foreman-1422-static-served-module-real-probe-v001.
- Seven self-tests PASS, including changed served module, changed sidecar, redirects, oversized body, offline fixture, external URL denial. Receipt dch-foreman-1424-dch-served-module-selftest-7-v001.
- npm ci --no-audit --no-fund PASS, receipt dch-foreman-1424-dch-served-module-preflight-npmci-v001.
- Eleven focused DCH tests PASS (host 2, module client 4, desktop port UI 5), npm run build PASS, M0 evidence integrity PASS but NOT_ACCEPTED 0 of 8 independently verified, M0 checker self-tests 10 PASS. Receipt dch-foreman-1425-served-module-dch-test-build-m0-gates-v001.
- Existing tools/audit-foundry-served-worker.mjs audits a different historical worker artifact against an older canonical receipt; it does not validate the package-owned module.js pin and cannot prove browser execution. This preflight does not modify that tool.

## Remaining gate

Matching HTTP static bytes is not browser-executed loaded module attestation, authenticated active elected GM/User collection, current exact-world role, ChatGPT caller authentication, DCH Desktop module-operation readback, or a complete DCH self-development cycle. The host-side self-declared isGM issue is still subject to provenance/fix-attempt stop gates, and no security guard was weakened. No M0 acceptance is promoted.

M0 remains NOT_ACCEPTED, 0/8 independently verified.
