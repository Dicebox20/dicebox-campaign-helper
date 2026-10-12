# DiceBox Campaign Helper

Central project foundation for the DiceBox Campaign Helper program and its associated Foundry VTT module.

This directory is the first Codex-ready project handoff. It contains:

- `PROJECT_CHARTER.md` — product identity, scope, boundaries, and initial success definition.
- `AGENTS.md` — implementation rules inherited from the Campaign Assistant contracts and adapted for DiceBox.
- `FOUNDATION_PLAN.md` — creation plan, vertical slices, gates, and first implementation task.
- `GAP_RESEARCH.md` — focused research pass for missing knowledge-base and module concerns.
- `STATUS.md` — current state and blockers.
- `database/dicebox_campaign_helper_knowledge.sqlite` — queryable normalized knowledge base.
- `database/schema.sql` — database schema.
- `database/seed.sql` — reproducible knowledge seed.
- `database/queries.sql` — example searches and views.
- `database/build_database.py` — deterministic database builder.
- `docs/` — supporting project documentation.

## Quick start

Use any SQLite client, DB Browser for SQLite, or Python:

```python
import sqlite3
db = sqlite3.connect("database/dicebox_campaign_helper_knowledge.sqlite")
print(db.execute("SELECT * FROM v_active_blockers").fetchall())
print(db.execute("SELECT * FROM facts_fts WHERE facts_fts MATCH ?", ("activity",)).fetchall())
```

The database is intentionally local-first. It stores normalized facts, decisions, provenance, evidence status, research subjects, open work, trial history, and milestones. It does not contain secrets, live Foundry credentials, or raw production world data.

## Naming

- Program: `DiceBox Campaign Helper`
- Foundry module ID: `dicebox-campaign-helper`
- Foundry target: `14.367 Stable 9`
- D&D5e target: `5.3.3`

The module ID is provisional until the first manifest and package-availability check. The public product name and the package identifier are deliberately separate.
