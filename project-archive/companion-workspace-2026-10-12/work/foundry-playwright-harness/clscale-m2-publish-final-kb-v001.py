from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/clscale-m2-verified-kb-v001.sql'
dest=r/'database/seed.d/zzzzzzzzzzzzzzzz-2026-10-08-clscale-m2-320-verified.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-clscale-m2-final-v001'
if dest.exists() or bak.exists():raise SystemExit('STOP prior KB source or backup exists')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP integrity failed')
 if c.execute("select status from kb_open_items where item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'").fetchone()!=('in_progress',):raise SystemExit('STOP state drift')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-CL-SCALE-M2-320-INSTALLED-VERIFIED'").fetchone()!=(0,):raise SystemExit('STOP fact exists')
with sqlite3.connect(db) as before:
 with sqlite3.connect(bak) as backup:before.backup(backup)
dest.write_bytes(src.read_bytes())
print('SOURCE_STAGED',dest.name,'SHA256',hashlib.sha256(dest.read_bytes()).hexdigest())
