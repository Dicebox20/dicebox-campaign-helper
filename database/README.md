# Read-only knowledge-base source

This directory is the bundled, reproducible snapshot of the DiceBox Campaign Helper foundation knowledge base. It contains the SQLite schema, seed, queries, deterministic builder, verifier, and database artifact.

The original authoritative source remains at `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database`; compare or refresh this snapshot deliberately when the foundation changes. Runtime code has no database write path. Any future editing capability requires a migration and FTS consistency design first.


Supplemental accepted project changes may be recorded as small, reviewable SQL deltas in `database/seed.d/*.sql`. `build_database.py` applies the monolithic `seed.sql` first, then applies those deltas in lexical order before integrity checks. This avoids rewriting the large canonical seed for narrow workflow/campaign metadata updates while preserving deterministic rebuilds.
