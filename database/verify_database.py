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
        "central_lodge_scenes": connection.execute("SELECT value FROM kb_metadata WHERE key='central_lodge_scene_count'").fetchone()[0],
        "central_lodge_regions": connection.execute("SELECT value FROM kb_metadata WHERE key='central_lodge_region_count'").fetchone()[0],
        "central_lodge_behaviors": connection.execute("SELECT value FROM kb_metadata WHERE key='central_lodge_region_behavior_count'").fetchone()[0],
        "central_lodge_items": connection.execute("SELECT value FROM kb_metadata WHERE key='central_lodge_canonical_item_count'").fetchone()[0],
        "central_lodge_gate": connection.execute("SELECT value FROM kb_metadata WHERE key='central_lodge_current_gate'").fetchone()[0],
    }
    if checks["integrity"] != "ok":
        raise SystemExit(checks)
    if checks["research_subjects"] < 40 or checks["tools"] < 1:
        raise SystemExit(checks)
    if (checks["central_lodge_scenes"], checks["central_lodge_regions"], checks["central_lodge_behaviors"], checks["central_lodge_items"]) != ("21","201","21","33"):
        raise SystemExit(checks)
    print(checks)
