from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/cl91-m2-single-writer-final-kb-v001.sql'
dest=r/'database/seed.d/zzzzzzzzzz-2026-10-08-cl91-m2-single-writer-installed.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-cl91-m2-single-writer-final-v001'
if dest.exists() or bak.exists():raise SystemExit('STOP prior source/backup, reconcile before retry')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP KB not intact')
 if c.execute("select value from kb_metadata where key='central_lodge_region_behavior_count'").fetchone()!=('118',):raise SystemExit('STOP roster metadata')
 if c.execute("select status from kb_open_items where item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES'").fetchone()!=('open',):raise SystemExit('STOP issue changed')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-CL91-M2-SINGLE-WRITER-INSTALLED'").fetchone()!=(0,):raise SystemExit('STOP previously installed fact')
with sqlite3.connect(db) as conn:
 with sqlite3.connect(bak) as copy:conn.backup(copy)
dest.write_bytes(src.read_bytes())
print('KB_FINAL_SOURCE_STAGED',dest.name,'SHA',hashlib.sha256(dest.read_bytes()).hexdigest(),'BACKUP',bak.name)
