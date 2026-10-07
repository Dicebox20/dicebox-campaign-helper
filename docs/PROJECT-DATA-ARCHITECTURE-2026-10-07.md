# Dicebox Campaign Helper Project Data Architecture — 2026-10-07

**Status:** Canonical project data-organization standard

## Mission

Dicebox Campaign Helper must remain resumable from durable records without depending on a particular chat, workstation, model memory, or developer recollection. Project data is managed as a chronological, provenance-preserving knowledge system so future work can determine what is authoritative, what happened, why it happened, what evidence exists, what was superseded, and what comes next.

## Authority

The canonical repository is `Dicebox20/dicebox-campaign-helper`. Authority order is: current governance and locked decisions; reproducible KB sources (`database/schema.sql`, `database/seed.sql`, `database/seed.d/*.sql`); current docs/code/tests/schemas; exact runtime evidence; reviewed campaign state; historical/legacy evidence; then chat/model memory and unreviewed external material.

Generated SQLite files are build artifacts of reproducible SQL, not stronger authority. Local workspaces are execution and migration sources, not authority merely because they are older or contain more files. This supersedes the older `database/README.md` wording that called the Windows-local KB directory authoritative; the later project-unification decision makes GitHub canonical.

## Inventory snapshot

On 2026-10-07 the repository contained 10,949 files and about 966.6 MB of Git blob data. Major areas: `work/` 8,573 files; `outputs/` 1,437; `tests/` 304; `apps/` 216; `packages/` 185; `tools/` 76; `assets/` 53; `docs/` 52; `database/` 19; `beyond-the-realms-bridge/` 17.

Most repository bulk is duplicated Foundry fixture material under `work/foundry-fixture-data*`. It is test/evidence state, not project authority. The local legacy workspace at `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper` contains older KB backups, Regionwright mining snapshots, Underdark/Blingdenstone work, handoffs, checkpoints, and fixtures. Those records are migration inputs until individually reconciled into GitHub.

## Primary data classes

Every durable datum gets one primary class: governance, decision, knowledge, product source, verification, campaign state, asset, output/evidence, work/fixture, or historical/legacy.

`work/` and `outputs/` never become authority by themselves. Promotion into a canonical class must be explicit and provenance-preserving.

## Chronology

Every meaningful event records: stable ID; original/effective timestamp; capture/import timestamp when different; subsystem; data class; scope; source/provenance; authority/evidence level; lifecycle status; related IDs/artifacts; supersession links; validation; blockers; and next action.

Historical imports retain their original event date and receive a separate import date. History is appended and superseded, never silently rewritten.

## Physical organization

Do not bulk-move existing files merely to make folders look cleaner. Existing paths can be embedded in code, hashes, receipts, tests, and campaign state. Organize existing material logically first through catalogue/classification/cross-links. Physically migrate only after dependency audit, update plan, validation, and receipt.

## Hard project rule

No important fact, decision, workflow change, campaign-state change, failure lesson, or implementation result may exist only in conversation context. Future accepted data follows `docs/NEW-DATA-IMPLEMENTATION-RULE-2026-10-07.md`.
