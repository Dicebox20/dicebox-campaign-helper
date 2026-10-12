from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/clscale-c1-kb-v001.sql'
dest=r/'database/seed.d/zzzzzzzzzzzzzzzzzzzz-2026-10-08-clscale-c1-grid240-verified.sql'
backup=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-clscale-c1-v001'
if dest.exists() or backup.exists():raise SystemExit('STOP prior C1 seed/backup exists')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP DB integrity')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-CL-SCALE-C1-GRID240-INSTALLED'").fetchone()!=(0,):raise SystemExit('STOP C1 fact already exists')
 if c.execute("select status from kb_open_items where item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'").fetchone()!=('in_progress',):raise SystemExit('STOP calibration state drift')
with sqlite3.connect(db) as old:
 with sqlite3.connect(backup) as new:old.backup(new)
dest.write_bytes(src.read_bytes())
print('C1_KB_SEED_STAGED',dest.name,hashlib.sha256(dest.read_bytes()).hexdigest())
