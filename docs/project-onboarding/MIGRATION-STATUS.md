# Migration status — 2026-10-12

**Source:** [GitHub pull request #16](https://github.com/Dicebox20/dicebox-campaign-helper/pull/16)

**PR state at inspection:** open, draft, unmerged, head `sync/project-data-2026-10-12`, base `main`. The handoff includes 1,335 changed paths; the companion archive preserves 1,157 source files and a SHA-256 manifest under `project-archive/companion-workspace-2026-10-12/`.

## What this onboarding change does
- Adds navigational documentation for the new ChatGPT project.
- Maps established folders and sources without relocating or rewriting existing source data.
- Preserves the snapshot, manifests, canonical files, and failed-test evidence.
- Creates an explicit review boundary before any project-rule revisions.

## Migration validation still outstanding
PR #16 reports a passing build but a failing `npm run check`: 298 passing test files, 5 failing test files, and 6 individual failing tests (of 1,284). Reported failure areas: M1259 artifact hashes, Regionwright staged fixture hashes, served-worker parity, KB summary expectation, and tooling-lane contract. These are inherited from the handoff and **not resolved by adding this directory**.

Do not merge the PR or claim product acceptance until these failures and data-parity questions are reconciled. No live Foundry world was accessed during the original archive operation or this navigation work.

## Next governance step
Review AGENTS.md and the current workflow against the desired behavior of this ChatGPT project. Record accepted changes through the established roadmap, active-card and KB process. Do not replace existing rules merely because the ChatGPT conversation changed.
