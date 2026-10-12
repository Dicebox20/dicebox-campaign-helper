from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/cl91-n3-three-proof-final-kb-v001.sql'
out=r/'database/seed.d/zzzzzzzzzzzzz-2026-10-08-cl91-n3-three-proof-installed.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-cl91-n3-installed-v001'
if out.exists() or bak.exists():raise SystemExit('STOP previous SQL or backup already exists')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP KB integrity drift')
 if c.execute("select value from kb_metadata where key='central_lodge_region_behavior_count'").fetchone()!=('118',):raise SystemExit('STOP KB count drift')
 if c.execute("select status from kb_open_items where item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN'").fetchone()!=('in_progress',):raise SystemExit('STOP N3 item drift')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-CL91-N3-THREE-PROOF-LOGICAL-GATE-INSTALLED'").fetchone()!=(0,):raise SystemExit('STOP fact already published')
with sqlite3.connect(db) as existing:
 with sqlite3.connect(bak) as copy:existing.backup(copy)
out.write_bytes(src.read_bytes())
print('KB_N3_INSTALLED_SEED_STAGED',out.name,'SHA',hashlib.sha256(out.read_bytes()).hexdigest(),'BACKUP',bak.name)
