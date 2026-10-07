# Project Data Inventory and Reconciliation — 2026-10-07

This is a navigational catalogue, not a competing authority source.

## Canonical repository

`Dicebox20/dicebox-campaign-helper`: 10,949 files, 907 directories, about 966.6 MB of Git blobs at inspection time.

- Governance/control: root governance files and `docs/`.
- Reproducible KB: `database/schema.sql`, `seed.sql`, `seed.d/*.sql`, builders/verifiers/queries.
- Desktop app: `apps/campaign-helper-desktop/`.
- Product packages: `packages/`.
- Verification: `tests/` and `tools/`.
- Campaign records: `docs/campaigns/`, `docs/scene-state/`, campaign KB entries, reviewed handoffs.
- Assets: `assets/`.
- Evidence/output: `outputs/`.
- Work/fixtures: `work/`.
- Legacy integration lineage: `beyond-the-realms-bridge/`.

## Largest data concentration

Most repository bulk is duplicated Foundry fixture data:

- `work/foundry-fixture-data-v2/`: ~167.9 MB
- `work/foundry-fixture-data-v4/`: ~166.6 MB
- `work/foundry-fixture-data-v3/`: ~162.3 MB
- `work/foundry-fixture-data-v5/`: ~155.3 MB
- `work/foundry-fixture-data/`: ~20.1 MB

These are replaceable test/runtime evidence, not product or campaign authority.

## Local legacy workspace

Inspected: `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper`.

Notable local/legacy material includes older SQLite/seed backups, Blingdenstone runtime records, Regionwright hunting/gathering/mining roadmaps and snapshots, Central Lodge and Underdark handoffs, integrated-project state, Foreman checkpoints, map workspaces, recovery scripts, and a thin-client Foundry fixture.

Treat these as migration sources until reconciled individually. Do not wholesale-copy them into canonical authority.

## Reconciliation findings

1. Older database documentation conflicts with the later GitHub-canonical unification rule; GitHub wins and the local path becomes legacy/migration provenance.
2. Multiple SQLite filenames are generated/legacy derivatives; reproducible SQL sources govern.
3. Fixture multiplication explains most repository size and must remain clearly non-authoritative.
4. The receipt history is valuable but too large to use as a linear current-state mechanism; current claims should be indexed through the KB.
5. Some development history exists only in the legacy Windows workspace and requires staged chronological migration.
6. Campaign implementations can be mistaken for global application rules; the new intake rule adds a scope firewall.
7. Recent scene-art refinements are project-level Scene Creation work and must be catalogued, not left only in chat context.

Existing paths are intentionally preserved. The logical taxonomy is canonical now; physical cleanup is a later validated migration.
