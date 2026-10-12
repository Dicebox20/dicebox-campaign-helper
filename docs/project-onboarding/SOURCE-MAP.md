# Project source map

Organizational guide for the existing repository tree, based on PR #16. Links point to existing ownership boundaries; this document makes no new authority claims.

| Domain | Primary repository location | Purpose |
| --- | --- | --- |
| Governance | [AGENTS.md](../../AGENTS.md), [PROJECT_CHARTER.md](../../PROJECT_CHARTER.md), [FOUNDATION_PLAN.md](../../FOUNDATION_PLAN.md) | Project contract, mission and foundation |
| Program management | [docs/](../), [active program slice](../ACTIVE-PROGRAM-SLICE.json), [Foreman workflow](../FOREMAN-WORKFLOW-CURRENT.md) | Roadmap, accepted change gates, execution continuity |
| Knowledge base | [database/](../../database/) | Reproducible schema, seeds, scripts, SQLite knowledge |
| Applications | [apps/](../../apps/) | Desktop/user-facing application |
| Core packages | [packages/](../../packages/) | Compiler, Foundry, bridge and shared program libraries |
| Runtime/deployment | [deploy/](../../deploy/) | Relay and deployment infrastructure |
| Automation | [scripts/](../../scripts/) and [tools/](../../tools/) | Checks, operational scripts, recovery and harnesses |
| Campaign dossiers | [docs/campaigns/](../campaigns/) | Campaign-specific creative canon, continuity and verification |
| Evidence and receipts | [outputs/](../../outputs/) | Historical checkpoints, test and closure evidence |
| Handoffs | [handoffs/](../../handoffs/) | Previous work-unit and chat transfer packets |
| Companion archive | [project-archive/companion-workspace-2026-10-12/](../../project-archive/companion-workspace-2026-10-12/) | Historical local companion snapshot; not the canonical source |
| ChatGPT migration notes | [docs/project-onboarding/](./) | This navigation and migration review layer |

## Recommended reading order by work type

- **Programming:** root AGENTS → Foreman workflow → active slice → roadmap → database read-only query → scoped code.
- **Campaign continuation:** campaign START-HERE → creative canon → campaign state → independent verifier → approved runtime evidence.
- **Foundry action:** authority and active-GM gate → exact target → KB/adapter contracts → preview → authoritative reread → receipt.
- **Historical investigation:** companion archive README → SHA-256 manifest → dated handoff or receipt. Never automatically promote historical documents into current rules.

## Do not conflate
- GitHub source with live Foundry state.
- Program-level active slice with campaign-only continuation state.
- A transport success with successful runtime mutation.
- Archive snapshots with approved current governance.
- Passing local/fixture tests with live or player-accepted evidence.
