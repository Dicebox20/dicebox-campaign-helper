from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/clscale-b2-kb-v001.sql'
dst=r/'database/seed.d/zzzzzzzzzzzzzzzzzz-2026-10-08-clscale-b2-grid240-verified.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-clscale-b2-v001'
if dst.exists() or bak.exists():raise SystemExit('STOP prior source or backup exists')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP DB drift')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-CL-SCALE-B2-GRID240-INSTALLED'").fetchone()!=(0,):raise SystemExit('STOP fact exists')
with sqlite3.connect(db) as c:
 with sqlite3.connect(bak) as b:c.backup(b)
dst.write_bytes(src.read_bytes())
print('B2_KB_SEED_STAGED',dst.name,hashlib.sha256(dst.read_bytes()).hexdigest())
