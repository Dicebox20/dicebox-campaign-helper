# Current and candidate workflows — evidence-based register

**As of:** 2026-10-12. Order below is acceptance/effective date *where recorded*, most recent first. Source identity refers to `main` unless `migration branch` is explicitly stated.

## Accepted normative policy and workflows

| Effective/accepted | Scope | Governing source | Documented status | Current interpretation |
|---|---|---|---|---|
| 2026-10-09 | Global work units | [20-minute turn cap](../../DICEBOX-20-MINUTE-TURN-CAP-2026-10-09.md) | USER-ACCEPTED | Bounded turns, checkpoint and stop at cap; not background execution |
| 2026-10-09 | All DiceBox image attempts | [Image prompt clean restart](../../DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md) | USER-ACCEPTED / LOCKED | Rejected prompt is archived, never patched/reused for a generation retry; compose independently from accepted requirements |
| 2026-10-09 | Scene geometry/Inspector/Region | [Geometry tolerance standard v0.1](../../DICEBOX-GEOMETRY-TOLERANCE-STANDARD-2026-10-09.md) | USER-ACCEPTED / LOCKED | Walkable ground and functional creature clearance, not arbitrary road-paint width, govern acceptance |
| 2026-10-07 | All consequential project data | [Project data architecture](../../PROJECT-DATA-ARCHITECTURE-2026-10-07.md) and [new-data implementation rule](../../NEW-DATA-IMPLEMENTATION-RULE-2026-10-07.md) | Canonical / hard rule | CAPTURE → CLASSIFY → RECONCILE → CATALOGUE → VALIDATE INPUT → IMPLEMENT → REREAD/TEST → RECEIPT → CLOSE/CARRY FORWARD |
| 2026-10-07 | Scene art workflow | [Semantic render workflow v2026-10-07.2](../../DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md) | Current canonical | Structural graybox → structural inspection → Feature Manifest/Spatial Blueprint → paint → final inspection; no pixel-derived unreviewed Foundry geometry |
| 2026-10-05 | Scene automation | [Automated scene workflow](../../DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md) | Accepted overlay | PREPARE → RENDER → INSPECT (PASS automatically approves) → BUILD → STAGE → INJECT → VERIFY → RECEIPT; stage/execute only on proven authority |
| 2026-10-05 | Scene BUILD transport | [Injector hardening](../../DICEBOX-INJECTOR-WORKFLOW-HARDENING-2026-10-05.md), [skill](../../../.codex/skills/dicebox-injector-workflow/SKILL.md) and [contract](../../../.codex/skills/dicebox-injector-workflow/references/scene-injector-contract.md) | Accepted | One `.md` handoff with exactly one self-contained JavaScript macro; validate with the repository tool. Never improvise split macros or a ZIP |
| 2026-10-05 | Maps/token mechanics | [Map and token scale standard](../../DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md) | User-accepted | Default battlemap-120/gridless and 5ft logical spaces; no changing Token Scale Ratio to correct mismatched geometry |
| 2026-10-05 | Discovery Regions | [Exploration discovery standard](../../DICEBOX-EXPLORATION-DISCOVERY-STANDARD-2026-10-05.md) | User-accepted | Sparse justified discoveries; NOTICE → INTERPRET/SEARCH → RECOVER; no automatic awards on noticing |
| 2026-10-01 | Unified product | [Unification](../../DICEBOX-CAMPAIGN-HELPER-UNIFICATION-2026-10-01.md) and [mission](../../PROJECT-MISSION-AND-ORCHESTRATION.md) | Current main baseline | One Campaign Helper product and roadmap; Injector a subsystem, BTR campaign material |
| 2026-08-26.3 (later reconciled) | Product development/Foreman | [Development workflow](../../CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md), [Codex workflow](../../CODEX-WORKFLOW-RULES-2026-08-22.md), root [AGENTS](../../../AGENTS.md) | Accepted development workflow | Bounded outcome → KB consultation → planning/validation/approval → action → reread/receipt; single writer and distinct evidence levels |
| Undated normative | Data/Foundry safety | [Database-first rule](../../DATABASE-FIRST-PIPELINE-RULE.md), [Foundry API binding matrix](../../FOUNDRY-API-BINDING-MATRIX-2026-08-21.md) | Governing contract references | Query governed KB; use exact native API and target/active-GM gates; do not treat transport success as mutation proof |

**Precedence:** More recent accepted *scope-specific* overlays modify only their assigned stages. A newer archived file, unmerged PR, or "canonical" title from a former project does not supersede the root `main` contract. For example October 9 geometry and clean-restart rules extend October 7 semantic scene rendering and October 5 Injector automation; they do not abolish the core pipeline.

**Required grayscale stage:** The Scene Injector's RENDER/INSPECT is an obligatory two-pass pipeline: grayscale structural render → structural inspection → Feature Manifest/Spatial Blueprint reconciliation → painterly color render → final inspection. A structural PASS is **not** approval of the finished art. See [Scene grayscale pipeline audit](SCENE-GRAYSCALE-PIPELINE.md).

## New findings from multi-pass KB/PR/implementation audit

- **2026-10-09, locally accepted but not promoted to main:** Required PREPARE monospaced text map/ASCII diagram, legend and location table, supported by archived `D-2026-10-09-PREPARE-TEXT-LAYOUT`. **The experimental v3.1 rendering workflow was explicitly NOT adopted.**
- **2026-10-12, locally accepted but not promoted to main:** Mandatory RegionBehavior→Macro permission preflight, postinstall and fresh-reload `canUserExecute` checks. Archived Foreman workflow/checkpoint records local DB rebuild and `PARTIAL`/STOP; it does not prove live safety, or repository-wide promotion.
- **2026-10-09 M02 grayscale QA:** modeled clearance PASS, but wall-ground precision remains unresolved; painting/BUILD/INJECT expressly not authorized by latest merged M02 KB metadata.
- **2026-09-19 NPC Injector:** Engine 1.0 three fresh-Actor create passes are **carried handoff evidence**, Engine 2.0 pending exact runtime; do not conflate with complete integrated Actor Injector.
- **Puzzle Matrix:** campaign puzzle actions and pure primitive engines exist, but global matrix design/test/desktop integration is still incomplete.

See [DB chronology pass](DATABASE-RECONCILIATION-PASS-2026-10-12.md) and [code/test evidence pass](IMPLEMENTATION-EVIDENCE-PASS-2026-10-12.md).

## Implementation surfaces and evidence levels

| Subsystem | Latest identified material | Evidence-based classification | Next verification |
|---|---|---|---|
| Scene/map Injector | October 9 overlays + October 7 render + October 5 automation/hardening | **Accepted procedure**; successful implementation must still pass artifact, exact-target, native/runtime and receipt gates | Inspect current compiler/validator and Foundry receipts, identify any unresolved proposals |
| Actor/NPC Injector | [BTR NPC Injector reconciliation, 2026-09-19](../../../beyond-the-realms-bridge/reference/Beyond_the_Realms_NPC_Injector_Reconciliation_Handoff_2026-09-19.md) | **Historical validated baseline**, not automatically current integrated actor-injector spec: document reports three new Actor creations; rerun/idempotence was planned | Check newer actor code, current D&D5e/Foundry schemas, image provenance and idempotence; define current canonical workflow only after review |
| Puzzle Matrix / puzzle tooling | [Mysterious Lodge puzzle directions, 2026-10-12](../../CENTRAL-LODGE-PUZZLE-DIRECTIONS-2026-10-12.md) (migration only), [puzzle routes](../../campaigns/mysterious-lodge/PUZZLE-ROUTES.md) (migration only), [in-scene puzzle code](../../../packages/dicebox-core/src/in-scene-puzzles.ts) | **In design/testing.** Distinguish campaign-specific puzzle scripts/examples from global reusable Puzzle Matrix; no verified complete design yet | Catalogue feature/state contracts, existing tests, unresolved puzzle outcomes and propose matrix schema without claiming implementation |
| Desktop app | [Desktop editor ADR](../../ADR-0004-desktop-editor-foundation.md), [AI integration ADR](../../ADR-0007-ai-and-codex-account-integration.md), [Map Lab plan](../../CAMPAIGN-HELPER-MAP-LAB-PLAN-2026-09-06.md), `apps/campaign-helper-desktop/` | **Accepted architecture with evolving implementation**, not a blanket readiness claim | Retrieve unreadable current roadmap/active-slice, check build/CI and app–module integration |
| Knowledge/campaign continuity | `database/`, October 7 data rules and scoped campaign sources | **Governed core with evidence and campaign scopes** | Verify `schema.sql`, `seed.sql` + lexical `seed.d`, build, integrity, read-only KB query |
| Foundry module/bridge | `packages/dicebox-foundry/`, `packages/dicebox-bridge/`, related dedicated Bridge repositories | **Source implementation subject to exact-stack gates** | Identify exact live/fixture versions, authorized adapter/role and current receipts |

## Proposals and noncanonical overlays

- **PR #7**, `workflow/scene-injector-reconciliation-20261009`, is documentation-only draft proposing Injector reconciliation. It does not supersede the accepted single-macro contract until accepted, migrated to KB and validated.
- **PR #16**, `sync/project-data-2026-10-12`, is an unmerged archive/synchronization proposal; its revised `AGENTS.md` incorrectly promotes a local Windows foundation as authority compared with `main`. The `main` contract wins until explicit acceptance.
- `docs/FOREMAN-WORKFLOW-CURRENT.md` exists only on migration branch at inspected path and describes local paths and historical Bridge session identity. Treat as **continuity candidate**, not a verified present-session identity. Its safer compatible process can be reviewed for promotion.
- `docs/proposals/*`, historic BTR/Injector names, companion workspace snapshots, dated handoffs and checkpoint receipts are evidence or proposals, **not replacement policy**.
- No source inspected establishes the Puzzle Matrix as a complete globally deployable system.

## Required "canonical" gate

A current workflow is canonical only when: it is under accepted source hierarchy; has scope and provenance; reconciles newer/older decisions; is recorded as accepted in governed documentation/KB where required; its contracts and tests are consistent; and no explicit hold or unresolved source conflict blocks use. Runtime ready/installed status requires independent runtime receipt.
