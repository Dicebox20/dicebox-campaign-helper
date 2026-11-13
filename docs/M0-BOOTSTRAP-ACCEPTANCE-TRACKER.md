# M0 ChatGPT Bootstrap — Acceptance Evidence Register

Governing authority: docs/DCH-ROADMAP-v2-LIBRARY-CANONICAL.md, Priority 0, lines 45–48 and checklist lines 379–390.

**Product status: NOT ACCEPTED.** This register is a review aid, not an automated promotion tool. Passing its integrity check means the register is structurally trustworthy; it does not prove a live ChatGPT-driven edit/build/install.

## Evidence needed

| Requirement | Concrete proof expected | Current state |
| --- | --- | --- |
| Authenticated ChatGPT control | ChatGPT-origin identity, approved tool scope and authenticated DCH app session | Missing |
| Environment enumeration | Source tree and capability discovery with exact checkout version | Missing |
| Isolated dev branch | Unique clean source baseline and reversible change boundary | Missing |
| ChatGPT-initiated edit and build | Exact user-directed edit, before/after content, build command/exit receipt | Missing |
| Automated build and install | Build output plus DCH module installed in disposable Foundry; verified by readback | Missing |
| Automated tests | Targeted test command, results and independent verification | Missing |
| Diagnose and repair | Controlled recoverable failure, diagnosis, repair and re-verification receipt | Missing |
| Self-contained provenance | Commit/hash chain, timestamps, tool identities and linked receipts | Missing |

Environment enumeration evidence is now **collecting** in `docs/evidence/m0-bootstrap/environment-enumeration-20261113-0933.json`. This is a content-addressed observation of the clean source baseline and toolchain, not independently accepted app-control proof. The integrity self-test exercises intact, tampered and missing receipt files.

Worker A's first M0 preflight was blocked before mutation in an unclean checkout. Worker B's first routing audit was read-only. Neither constitutes bootstrap acceptance. Prior Stage 12 engineering gates and older ADR-0002 “M0” packaging terminology do not certify the Roadmap v2 product M0.

## Commands

- node tools/check-m0-bootstrap-evidence.mjs
- node tools/check-m0-bootstrap-evidence-self-test.mjs

The checker validates the canonical roadmap hash, active M0 priority, pending acceptance, criteria order, receipt path containment and receipt content hashes. It always reports milestoneAcceptance NOT_ACCEPTED; complete receipts are eligible only for independent review. Actual host actions, native transcripts and installed runtime state must be reviewed before any acceptance decision.

Evidence receipts, when available, belong under docs/evidence/m0-bootstrap and must be SHA-256-attested in the JSON register. An inbox-staged message cannot substitute for a verified live delivery.
