from pathlib import Path
import sqlite3

database_path = Path(__file__).resolve().parent / "dicebox_campaign_helper_knowledge.sqlite"
with sqlite3.connect(database_path) as connection:
    checks = {
        "integrity": connection.execute("PRAGMA integrity_check").fetchone()[0],
        "activity_hits": connection.execute("SELECT COUNT(*) FROM facts_fts WHERE facts_fts MATCH 'activity'").fetchone()[0],
        "active_work": connection.execute("SELECT COUNT(*) FROM v_active_blockers").fetchone()[0],
        "research_subjects": connection.execute("SELECT COUNT(*) FROM kb_research_subjects").fetchone()[0],
        "milestones": connection.execute("SELECT COUNT(*) FROM kb_milestones").fetchone()[0],
        "tools": connection.execute("SELECT COUNT(*) FROM kb_tools").fetchone()[0],
    }
    if checks["integrity"] != "ok" or checks["research_subjects"] != 41 or checks["tools"] < 1:
        raise SystemExit(checks)
    print(checks)
