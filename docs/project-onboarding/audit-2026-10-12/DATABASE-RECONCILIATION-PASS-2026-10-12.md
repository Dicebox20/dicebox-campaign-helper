# Deep audit, Pass 1 — Database chronology and source promotion

**Audit date:** 2026-10-12. **Evidence class:** read-only repository/source inspection. **Promotion:** none. 
**Baseline:** main tree `1137241a7df431a5cc4bc775ab56dcd283e1db29`. **Migration:** draft PR #16. Do not infer live state from old SQL or a checkpoint.

## How the reproducible KB is supposed to work

The accepted `main:AGENTS.md`, `docs/PROJECT-DATA-ARCHITECTURE-2026-10-07.md`, `docs/NEW-DATA-IMPLEMENTATION-RULE-2026-10-07.md`, and `docs/DATABASE-FIRST-PIPELINE-RULE.md` govern source chronology. Canonical rebuild order is `database/schema.sql` + `database/seed.sql` + lexical `database/seed.d/*.sql`; use `database/build_database.py` and `database/verify_database.py`. The committed generated SQLite is an artifact, not inherently stronger than reproducible SQL. Dated SQL entries preserve provenance, decisions, facts, trials, blockers and relationships. A local workspace or archive is evidence until explicitly reconciled into accepted repository sources.

## Pass A: main's dated SQL migrations (17 tracked)

| Source effective date | Files | Reconciled area | Meaning |
|---|---:|---|---|
| 2026-10-06 | 4 | Scene automation and Central Lodge handoffs | General scene workflow recorded alongside campaign-local installation context; not every Central Lodge detail is a global process rule |
| 2026-10-07 | 5 | Project data authority, data validation, rule conflict resolution, semantic rendering, historical Foundry evidence ingest | Existing accepted project-wide governance and provenance layers |
| 2026-10-09 | 8 | Geometry tolerance, clean-restart image prompts, M02 grayscale inspections v001–v003, 20-minute cap and handoff metadata | Accepted global overlays plus narrowly scoped M02 evidence |

Exact files are found under `database/seed.d/`. Representative stable decision IDs confirmed in SQL:
- `D-2026-10-06-INSPECT-PASS-APPROVES`;
- `D-2026-10-07-PROJECT-DATA-AUTHORITY`, `D-2026-10-07-NEW-DATA-IMPLEMENTATION-RULE`, `D-2026-10-07-RULE-CONFLICT-PRECEDENCE-V2`, `D-2026-10-07-SCENE-SEMANTIC-RENDER-V2`;
- `D-2026-10-09-GEOMETRY-TOLERANCE-V01`, `D-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART`, `D-2026-10-09-DICEBOX-20MIN-TURN-CAP`.

**Interpretation:** The accepted semantic graybox→inspect→manifest/blueprint→paint→inspect workflow is in the October 7 reconciled KB, and October 9 tolerance/image rules are additive—not replacement workflows.

## Pass B: companion archived dated SQL migrations (82 tracked)

Directory: `project-archive/companion-workspace-2026-10-12/database/seed.d/`.

| Embedded date | File count | Primary topics |
|---|---:|---|
| 2026-10-06 | 4 | Historical Central Lodge and scene flow; duplicated lineage |
| 2026-10-08 | 74 | Central Lodge Scene/Region/puzzle implementation, CL50 railway routes, CL91 events, CL-scale Scene settings, handoffs, receipts and Foreman continuity |
| 2026-10-09 | 4 | **General map PREPARE text-layout rule** plus campaign-specific scale/guard verification |

The archived SQL contains an explicit accepted project-level decision `D-2026-10-09-PREPARE-TEXT-LAYOUT` in `2026-10-09-prepare-text-layout.sql`. The companion document `docs/DICEBOX-PREPARE-TEXT-LAYOUT-RULE-2026-10-09.md` requires an ASCII/Unicode, top-down monospaced map layout with cardinal directions, edges/paths/obstacles, legend and location table, reviewed in PREPARE before art. The diagram is schematic, not actual Foundry geometry. **The same source explicitly says the larger experimental v3.1 render workflow was NOT promoted.** This decision is not currently in accepted main's `seed.d` or `AGENTS.md` and must be reconciled for cross-chat canonical enforcement. Call it **locally accepted, repository promotion pending**, not merged.

Other archived 2026-10-08 SQL exhibits different *campaign-scoped* stages. For example:
- `...cl91-n3-three-proof-approved.sql` records user approval for exactly three prerequisites for an N3 logical branch flag—**not** teleport permission.
- `...cl91-n3-three-proof-installed.sql` claims one source-verified RegionBehavior and explicitly leaves gameplay and teleport unverified.
- `...clscale-m2-320-verified.sql` describes **campaign-specific M2 grid.size 320** while preserving artwork/geometry. This does **not** replace global `battlemap-120` for new maps.

These records must be read as scoped evidence, with independent runtime reread needed for current-world claims.

## Pass C: October 12 local accepted rule, preserved in archive

`project-archive/companion-workspace-2026-10-12/outputs/foreman-checkpoints/20261012T073826829Z-region-macro-execution-contract-20261012.json` reports:
- Work unit `region-macro-execution-contract-20261012`, status `PARTIAL`, evidence `local`, `STOP`.
- A permanent **Region-triggered Macro execution permission** rule added to the **local foundation** `AGENTS.md`, local Foreman workflow, roadmap/checklist and local reproducible KB.
- Local DB rebuild/integrity and source/fact/decision/trial/FTS reread reportedly passed, but no Foundry runtime was changed by this work unit.
- Communication mirror was blocked in that session.
- Archived Foreman workflow contains the rule: before installing/enabling a player-triggerable RegionBehavior, verify RegionBehavior event/ID, referenced Macro ID, actor accounts, runtime target, ownership and `canUserExecute` equivalence. An `everyone=true` Region flag **does not grant Macro execution permission**. Broad player permissions should not be escalated to OWNER/edit simply for execution; if a Macro is privileged, keep GM-only/approved adapter boundary. Reread after installation **and fresh reload**.

This is compelling **local accepted-and-catalogued evidence**, but the general rule is absent from inspected `main:AGENTS.md` and the draft branch root `AGENTS.md`; the supporting 2026-10-12 database update is in the companion local seed baseline rather than a new `main:seed.d` delta. **Do not claim GitHub-wide promotion or independently verified live permission behavior from this checkpoint.**

A separate migration-branch fixture checkpoint at `outputs/foreman-checkpoints/20261012T044238958Z-mysterious-lodge-all-world-macro-limited-access-20261011.json` reports five world Macros executable for two test players after reload with `LIMITED` defaults; explicitly **gameplay retest pending**. This does not extend permission to production worlds.

## Verified Git PR chronology

GitHub PRs #2–#6 were merged on October 7 (governance/rule reconciliation/evidence). PRs #8–#15 were merged October 10 UTC (image rule, geometry, M02 evidence, work-turn limit). **PR #7 remains open/draft** scene-injector reconciliation; **PR #16 remains open/draft** companion migration. Later appearance in a snapshot is not a merge/acceptance event.

## Critical limits

- Full baseline `database/seed.sql` is ~30.6 MB; compiled SQLite ~21.4 MB; `ACTIVE-PROGRAM-SLICE.json` ~2.67 MB and roadmap ~1.60 MB. The GitHub text connector did not return full contents for these large files in this audit. **No end-to-end SQL replay, DB integrity rerun, large-file semantic diff, or active-slice workflow test was performed here.**
- This register is based on the 17 readable `main:seed.d` files, 82 archived seed paths, targeted archived SQL, accepted documentation and archived receipts. It is **not a complete row-by-row independent verification of all archival database history**.
- The companion archive digest manifest remains unvalidated against all archived bytes.
- Do not replace main `AGENTS.md` with PR #16's older Windows-foundation precedence. Promote accepted local rules only via current accepted roadmap/active-card, dated KB migration, validation, code/tests and reviewed PR.
