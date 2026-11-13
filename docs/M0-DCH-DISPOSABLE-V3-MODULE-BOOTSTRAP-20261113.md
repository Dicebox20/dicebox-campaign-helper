# DCH M0: disposable Foundry v3 canonical module staging and MCP negative proof

Date: 2026-11-13. Scope: DCH Desktop plus its accompanying DCH Foundry module ONLY. Regionwright is a different project and out of scope.

## What was proved

- GitHub main at stage preflight: 0bd8c328fd66fb1fa691b373f73dc5bfd306f0e9; canonical DCH Foundry package was staged from clean isolated source commit cdb7602e13dcce8888eb839d9097256ae4ebee3f (same tracked DCH runtime files as main).
- Disposable fixture: work/foundry-fixture-data-v3, exact world dbx-test-world, Foundry 14.367 and D&D5e 5.3.3, DCH module ID dicebox-campaign-helper v0.1.15. No production or Regionwright world was touched.
- On first supervised start, Foundry 30002 responded GET /join HTTP 200, but this established only process and login-page readiness. No authenticated User collection or elected GM was observed.
- Read-only source-versus-installed comparison across the DCH module: 35 expected files, 30 raw SHA-256 exact matches, five CRLF-only mismatches, zero other drifts, missing files or extras. The five mismatches were module.js, foundry-live-bridge.js, ascendancy-installer.js, program-scene-vertical-slice.js, and ascendancy-campaign-package.json.
- The active module.js in the original fixture was 117022 bytes with 2235 CRLF line endings, versus the pinned LF source 114787 bytes. In-memory LF normalization exactly matched the existing saved SHA-256 cee29eb17aac6b53da42e2f35aaca4b521dc4f2338e24f4252f79b62891eee1f; no pin was rewritten.
- Canonical source staging used existing tools/stage-foundry-module.mjs into a fresh OUTSIDE-fixture directory, PASS 35 files, no world writes. The old fixture was stopped with the existing exact-owned supervisor, and the 35-file canonical DCH module was atomically swapped into the disposable Data/modules directory. The old module was moved intact to dch-m0-v3-module-original-backup-20261113 outside the fixture for rollback. No world database was edited.
- Post-swap 35/35 installed module hashes matched the canonical stage. module.js matched its unchanged module-byte-attestation.json sidecar: 114787 bytes, SHA-256 cee29eb17aac6b53da42e2f35aaca4b521dc4f2338e24f4252f79b62891eee1f. Supervisor restarted v3 successfully on port 30002.
- Actual Foundry static GET requests returned HTTP 200 for /modules/dicebox-campaign-helper/src/module.js (114787 bytes), module-byte-attestation.json (523 bytes), and foundry-live-bridge.js (12288 bytes), each with a SHA-256 equal to the installed file. This is SERVER-SERVED byte identity, not browser-executed loaded-byte attestation or GM authentication.
- A bounded real Node MCP stdio child test of the tracked tools/dicebox-foundry-live-bridge.mjs initialized, listed eight reviewed tools, exposed no arbitrary eval/shell/script operation, and correctly refused the read-only bridge.status operation without an elected active-GM browser client. No mutation was requested. The reusable negative test is tools/run-m0-dch-local-mcp-no-gm-smoke.mjs; its WebSocket port is ephemeral and exact disposable world ID dbx-test-world is passed only to its child process.

## Durable PowerShell receipts

- Exact supervisor preflight: dch-foreman-2137-disposable-v3-supervisor-exact-status-v001 (STOPPED).
- Process start / HTTP join: dch-foreman-2138-disposable-v3-supervisor-start-v001, dch-foreman-2138-v3-http-routing-and-process-readonly-v002.
- Staging/source comparison: dch-foreman-2141-clean-canonical-module-side-stage-v001, dch-foreman-2142-canonical-vs-installed-35-file-comparison-v001.
- Owned stop and validated replacement: dch-foreman-2142-disposable-v3-supervisor-stop-before-module-swap-v001, dch-foreman-2143-v3-prepared-canonical-module-copy-and-preconditions-v001, dch-foreman-2144-v3-atomic-reversible-canonical-module-stage-v001.
- Restart / served bytes: dch-foreman-2144-disposable-v3-supervisor-restart-after-stage-v001 and dch-foreman-2145-v3-foundry-served-module-byte-hashes-v002.
- Real MCP stdio no-GM negative proof: dch-foreman-2147-tracked-local-mcp-host-stdio-no-gm-proof-v001; repeatable script proof dch-foreman-2149-reusable-local-stdio-negative-smoke-v001.

## Bounded next acceptance gate and rollback

- The fixture may currently be running as a supervised disposable process; verify exact supervisor status before any subsequent changes. A healthy HTTP listener or statically served module is not an authenticated GM session.
- To revert the disposable module swap if needed, first stop v3 through the existing exact-owned supervisor, independently verify no listener and original backup integrity, then restore the saved original module directory into Data/modules/dicebox-campaign-helper. The original backup has not been overwritten.
- Only an authenticated current active-GM session with authoritative User id/name/role observation can establish live authority. It must use the supported Foundry login/UI; no database edits, guessed User ids or bypass.
- Configure exact disposable world binding dbx-test-world for both DCH in-world opt-in and the local bridge. Then collect live bridge.status/harness.status/helper.readiness, loaded-byte attestation within the authenticated GM runtime, and an actual DCH change/build/install/reread evidence receipt.
- Current M0 product acceptance remains NOT_ACCEPTED, 0/8 independently verified. No logged-in GM, current User collection, or complete self-development vertical slice was proven.
