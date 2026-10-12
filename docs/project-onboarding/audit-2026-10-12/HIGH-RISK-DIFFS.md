# Reconciliation priority — all 22 modified files in migration draft

**Source comparison:** `main` tree 1137241a... vs frozen migration head 912ae844... (2026-10-12). These files differ by Git blob SHA; classification describes review risk, **not** the conclusion that a change is wrong.

## Tier 1: control-plane and policy — block silent adoption

| Path | Review |
|---|---|
| `AGENTS.md` | Main GitHub-first contract conflicts with draft's local-Windows foundation precedence. Retain main until explicit policy reconciliation. |
| `docs/ACTIVE-PROGRAM-SLICE.json` | Machine-enforced active program selection changed. File reader returned no content in this pass; verify JSON and workflow check before any gate-changing work. |
| `docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md` | Program roadmap differs. Oversized file not fully readable through connector; inspect through a verified local checkout before claiming stage status. |
| `docs/CODEX-WORKFLOW-RULES-2026-08-22.md` | Acceptance version/source precedence may differ. Reconcile newer main workflow v2026-08-26.3 with draft. |
| `docs/DICEBOX-CAMPAIGN-HELPER-UNIFICATION-2026-10-01.md` | Main explicitly prioritizes canonical GitHub repository; draft uses older local wording. Preserve accepted main scope. |

## Tier 2: knowledge-base source and verification — do not auto-promote

| Path | Review |
|---|---|
| `database/build_database.py` | Rebuild behavior drift |
| `database/dicebox_campaign_helper_knowledge.sqlite` | Generated DB differs; do not assign authority over reproducible seeds |
| `database/seed.sql` | Reconcile decisions/chronology; migrate narrow additions via dated seed deltas when appropriate |
| `database/verify_database.py` | Verification implementation drift |
| `tests/knowledge-base-query.test.ts` | KB query contract drift |
| `tests/active-slice-workflow.test.ts` | Program active-gate regression risk |

## Tier 3: runtime/code/tooling — verify with tests and exact target

| Path | Review |
|---|---|
| `apps/campaign-helper-desktop/src/CampaignHelperMapLabPreview.tsx` | Desktop scene preview |
| `packages/dicebox-compiler/src/index.ts` | Compiler export/API contract |
| `packages/dicebox-foundry/src/foundry-live-bridge.js` | Foundry-facing behavior; no implicit live authority |
| `tests/dicebox-foundry-live-bridge-host.test.ts` | Runtime bridge testing |
| `tests/foundry-live-bridge.test.ts` | Runtime bridge testing |
| `tools/dicebox-foundry-live-bridge.mjs` | Host transport tooling |
| `tools/harness-manifest.json` | Harness identities/parity |
| `tools/validate-dicebox-build.mjs` | Scene BUILD hard safety contract |
| `package.json` | Scripts/test dependencies |
| `package-lock.json` | Dependency lock consistency |
| `outputs/foundry-fixture-supervisor-last-receipt.json` | Historical fixture receipt, not current live authority |

## Draft-only material

1,321 paths are new in the frozen migration snapshot: archive 1,159, outputs 79, docs 36, tools 23, handoffs 10, deploy 7, tests 5, scripts 2. The companion archive's 1,159 paths include its README and manifest. All are classified as *unmerged inputs* even when the content documents previous acceptance. Main's contract still governs.

## Blocking open issues

PR #16 remains draft; reported six tests failing across five test files. PR #7 remains a separate draft Injector reconciliation proposal. Correctness, reproducibility, exact-stack evidence, and accepted approvals remain independent gates.

**Next review:** obtain and validate unreadable active slice and roadmap; compare semantic diffs, verify KB rebuild and hashes, then evaluate discrete promotion candidates through accepted changes. No mass-copy override from draft into main.
