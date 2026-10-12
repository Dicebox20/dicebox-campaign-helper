from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/clscale-approved-grid-kb-v001.sql'
dst=r/'database/seed.d/zzzzzzzzzzzzzzz-2026-10-08-clscale-grid-authorization.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-clscale-grid-approval-v001'
if dst.exists() or bak.exists():raise SystemExit('STOP decision already staged')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 assert c.execute("select status from kb_open_items where item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'").fetchone()==('blocked',)
 assert c.execute('pragma integrity_check').fetchone()==('ok',)
 assert c.execute("select count(*) from kb_decisions where decision_id='D-2026-10-08-CL-SCALE-INTERIOR-GRID-PROGRAM'").fetchone()==(0,)
with sqlite3.connect(db) as old:
 with sqlite3.connect(bak) as new:old.backup(new)
dst.write_bytes(src.read_bytes())
print('APPROVAL_SOURCE',dst.name,'SHA256',hashlib.sha256(dst.read_bytes()).hexdigest())
