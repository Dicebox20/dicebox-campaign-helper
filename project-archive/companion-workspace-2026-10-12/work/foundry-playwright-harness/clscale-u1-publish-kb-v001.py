from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/clscale-u1-kb-v001.sql'
dest=r/'database/seed.d/zzzzzzzzzzzzzzzzzzzzzz-2026-10-08-clscale-u1-grid180-verified.sql'
backup=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-clscale-u1-v001'
if dest.exists() or backup.exists():raise SystemExit('STOP U1 KB seed or backup already exists')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP SQLite integrity')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-CL-SCALE-U1-GRID180-INSTALLED'").fetchone()!=(0,):raise SystemExit('STOP U1 fact already recorded')
 if c.execute("select status from kb_open_items where item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'").fetchone()!=('in_progress',):raise SystemExit('STOP open item drift')
 if c.execute("select status from kb_decisions where decision_id='D-2026-10-08-CL-SCALE-INTERIOR-GRID-PROGRAM'").fetchone()!=('locked',):raise SystemExit('STOP decision drift')
with sqlite3.connect(db) as old:
 with sqlite3.connect(':memory:') as test:
  old.backup(test)
  test.executescript(src.read_text(encoding='utf-8'))
  if test.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP staged SQL integrity')
 with sqlite3.connect(backup) as saved:old.backup(saved)
dest.write_bytes(src.read_bytes())
print('U1_KB_SEED_STAGED',dest.name,hashlib.sha256(dest.read_bytes()).hexdigest(),'DB_BACKUP',backup.name)
