from pathlib import Path
import sqlite3, shutil
root=Path(r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper")
db=root/"database"/"dicebox_campaign_helper_knowledge.sqlite"
delta=root/"database"/"seed.d"/"2026-10-09-prepare-text-layout.sql"
assert db.exists() and delta.exists()
conn=sqlite3.connect(str(db),timeout=20)
before=conn.execute("PRAGMA integrity_check").fetchone()[0]
assert before=="ok",before
backup=root/"database"/"dicebox_campaign_helper_knowledge.sqlite.pre-prepare-text-layout-20261009"
with sqlite3.connect(str(backup)) as dest:
    conn.backup(dest)
try:
    conn.executescript(delta.read_text(encoding="utf-8"))
    assert conn.execute("PRAGMA integrity_check").fetchone()[0]=="ok"
    assert conn.execute("SELECT status FROM kb_decisions WHERE decision_id=?",("D-2026-10-09-PREPARE-TEXT-LAYOUT",)).fetchone()==("locked",)
    assert conn.execute("SELECT count(*) FROM facts_fts WHERE facts_fts MATCH 'textual'").fetchone()[0]>=1
    print("PASS decision and fact installed; integrity ok; backup:",backup)
finally:
    conn.close()
