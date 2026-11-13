# M0 ChatGPT Bootstrap — Acceptance Evidence Register

Governing authority: docs/DCH-ROADMAP-v2-LIBRARY-CANONICAL.md, Priority 0, lines 45–48 and checklist lines 379–390.

**Product status: NOT ACCEPTED.** This register is a review aid, not an automated promotion tool. Passing its integrity check means the register is structurally trustworthy; it does not prove a live ChatGPT-driven edit/build/install.

## Evidence needed

| Requirement | Concrete proof expected | Current state |
| --- | --- | --- |
| Authenticated ChatGPT control | ChatGPT-origin identity, approved tool scope and authenticated DCH app session | Missing |
| Environment enumeration | Source tree and capability discovery with exact checkout version | Collecting |
| Isolated dev branch | Unique clean source baseline and reversible change boundary | Collecting |
| ChatGPT-initiated edit and build | Exact user-directed edit, before/after content, build command/exit receipt | Collecting |
| Automated build and install | Build output plus DCH module installed in disposable Foundry; verified by readback | Collecting |
| Automated tests | Targeted test command, results and independent verification | Collecting |
| Diagnose and repair | Controlled recoverable failure, diagnosis, repair and re-verification receipt | Missing |
| Self-contained provenance | Commit/hash chain, timestamps, tool identities and linked receipts | Collecting |

Environment enumeration evidence is now **collecting** in `docs/evidence/m0-bootstrap/environment-enumeration-20261113-0933.json`. This is a content-addressed observation of the clean source baseline and toolchain, not independently accepted app-control proof. The integrity self-test exercises intact, tampered and missing receipt files.

A separate isolated build-repair observation is now **collecting** in docs/evidence/m0-bootstrap/chatgpt-edit-build-repair-20261113-1001.json: strict TypeScript test fixture correction, production desktop build PASS, 19 focused tests PASS, but the full suite had 20 failures out of 1,322 tests across 12 files. This does not establish successful Foundry installation, DCH desktop authentication, green full regression or M0 acceptance.

The M0 disposable fixture v3 build-and-install evidence is now **collecting** in docs/evidence/m0-bootstrap/foundry-v3-module-install-20261113-1045.json: current GitHub-main source built successfully; 35 required module files staged and SHA256-verified; prior 29-file fixture module kept as a rollback directory; supervised stop/start bound the update to dbx-test-world on port 30002; four installed module files were served by Foundry over loopback HTTP 200 with hashes matching the installed bytes. This verifies package staging and HTTP served-file integrity, but not active-GM identity, module activation in the running world, game.version, gameplay behavior, or M0 owner acceptance. The evidence register remains NOT_ACCEPTED with 0 of 8 criteria independently verified.

Worker A's first M0 preflight was blocked before mutation in an unclean checkout. Worker B's first routing audit was read-only. Neither constitutes bootstrap acceptance. Prior Stage 12 engineering gates and older ADR-0002 “M0” packaging terminology do not certify the Roadmap v2 product M0.

## Commands

- node tools/check-m0-bootstrap-evidence.mjs
- node tools/check-m0-bootstrap-evidence-self-test.mjs

The checker validates the canonical roadmap hash, active M0 priority, pending acceptance, criteria order, receipt path containment and receipt content hashes. It always reports milestoneAcceptance NOT_ACCEPTED; complete receipts are eligible only for independent review. Actual host actions, native transcripts and installed runtime state must be reviewed before any acceptance decision.

Evidence receipts, when available, belong under docs/evidence/m0-bootstrap and must be SHA-256-attested in the JSON register. An inbox-staged message cannot substitute for a verified live delivery.
