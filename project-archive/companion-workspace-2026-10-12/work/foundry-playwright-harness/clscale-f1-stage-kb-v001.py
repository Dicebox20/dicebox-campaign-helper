from pathlib import Path
import sqlite3,hashlib
root=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=root/'database/dicebox_campaign_helper_knowledge.sqlite'
src=root/'work/foundry-playwright-harness/clscale-f1-staged-kb-v001.sql'
dest=root/'database/seed.d/zzzzzzzzzzzzzzzzzzzzzzzzzz-2026-10-09-clscale-f1-guard-proposal-verified.sql'
backup=root/'database/dicebox_campaign_helper_knowledge.sqlite.pre-clscale-f1-design-v001'
if dest.exists() or backup.exists():raise SystemExit('STOP EXISTING_SOURCE_OR_BACKUP')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP DB_CORRUPT')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-09-F1-240-ARRIVAL-GUARD-STAGED-19PASS'").fetchone()!=(0,):raise SystemExit('STOP EXISTING_FACT')
 if c.execute("select status from kb_open_items where item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'").fetchone()!=('in_progress',):raise SystemExit('STOP ITEM_DRIFT')
with sqlite3.connect(db) as old:
 with sqlite3.connect(':memory:') as tmp:
  old.backup(tmp)
  tmp.executescript(src.read_text(encoding='utf8'))
  if tmp.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP SQL_DRYRUN_INTEGRITY')
 with sqlite3.connect(backup) as safe:old.backup(safe)
dest.write_bytes(src.read_bytes())
print('F1_PROPOSED_KB_STAGED',dest.name,hashlib.sha256(dest.read_bytes()).hexdigest(),'BACKUP',backup.name)
