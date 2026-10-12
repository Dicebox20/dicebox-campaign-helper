from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/cl-scale-audit-kb-v001.sql'
target=r/'database/seed.d/zzzzzzzzzzzzzz-2026-10-08-interior-map-scale-audit.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-cl-scale-audit-v001'
if target.exists() or bak.exists():raise SystemExit('STOP prior KB publish may already exist')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP original DB integrity')
 if c.execute("select value from kb_metadata where key='central_lodge_region_behavior_count'").fetchone()!=('119',):raise SystemExit('STOP ledger roster mismatch')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-CL-SCALE-INTERIOR-BASELINE-AUDITED'").fetchone()!=(0,):raise SystemExit('STOP scale fact exists')
with sqlite3.connect(db) as orig:
 with sqlite3.connect(bak) as backup:orig.backup(backup)
target.write_bytes(src.read_bytes())
print('CALIBRATION_KB_AUDIT_STAGED',target.name,'SHA',hashlib.sha256(target.read_bytes()).hexdigest())
print('BACKUP',bak.name)
