from pathlib import Path
import sqlite3

root = Path(__file__).resolve().parent
database_path = root / "dicebox_campaign_helper_knowledge.sqlite"
schema = (root / "schema.sql").read_text(encoding="utf-8")
seed = (root / "seed.sql").read_text(encoding="utf-8")

if database_path.exists():
    database_path.unlink()

with sqlite3.connect(database_path) as connection:
    connection.executescript(schema)
    connection.executescript(seed)
    integrity = connection.execute("PRAGMA integrity_check").fetchone()[0]
    if integrity != "ok":
        raise SystemExit(f"SQLite integrity check failed: {integrity}")
    counts = {
        "sources": connection.execute("SELECT COUNT(*) FROM kb_sources").fetchone()[0],
        "facts": connection.execute("SELECT COUNT(*) FROM kb_facts").fetchone()[0],
        "decisions": connection.execute("SELECT COUNT(*) FROM kb_decisions").fetchone()[0],
        "open_items": connection.execute("SELECT COUNT(*) FROM kb_open_items").fetchone()[0],
        "trials": connection.execute("SELECT COUNT(*) FROM kb_trials").fetchone()[0],
        "subjects": connection.execute("SELECT COUNT(*) FROM kb_research_subjects").fetchone()[0],
        "milestones": connection.execute("SELECT COUNT(*) FROM kb_milestones").fetchone()[0],
    }
    print({"integrity": integrity, **counts})
