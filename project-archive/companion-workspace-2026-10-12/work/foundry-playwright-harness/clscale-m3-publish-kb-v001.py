from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/clscale-m3-kb-v001.sql'
out=r/'database/seed.d/zzzzzzzzzzzzzzzzz-2026-10-08-clscale-m3-grid240-verified.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-clscale-m3-v001'
if out.exists() or bak.exists():raise SystemExit('STOP prior seed or backup exists')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP integrity failed')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-CL-SCALE-M3-GRID240-INSTALLED'").fetchone()!=(0,):raise SystemExit('STOP receipt already published')
with sqlite3.connect(db) as old:
 with sqlite3.connect(bak) as backup:old.backup(backup)
out.write_bytes(src.read_bytes())
print('M3_KB_SOURCE_STAGED',out.name,hashlib.sha256(out.read_bytes()).hexdigest())
