# Read-only knowledge-base source

This directory contains the reproducible DiceBox Campaign Helper knowledge base: SQLite schema, monolithic seed, ordered supplemental seed deltas, queries, deterministic builder/verifier, and generated database artifacts.

## Authority

The canonical authority is the GitHub repository's reproducible knowledge sources: `database/schema.sql`, `database/seed.sql`, and lexical `database/seed.d/*.sql`, reconciled with current project governance and decisions.

The historical Windows directory `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database` remains valuable provenance and migration input, but it no longer outranks the GitHub repository. Generated `.db` and `.sqlite` files are build products or compatibility artifacts and do not outrank their reproducible SQL sources.

Runtime code has no general-purpose database write path. Editing authority requires the governed capture/reconcile/catalogue process plus deterministic rebuild and verification.

Supplemental accepted project changes should be recorded as small, reviewable SQL deltas in `database/seed.d/*.sql`. `build_database.py` applies `seed.sql` first, then deltas in lexical order before integrity checks. This preserves chronological additions without rewriting prior accepted history.

See `docs/PROJECT-DATA-ARCHITECTURE-2026-10-07.md` and `docs/NEW-DATA-IMPLEMENTATION-RULE-2026-10-07.md`.
