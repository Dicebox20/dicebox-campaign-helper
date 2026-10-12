from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/cl91-n3-three-proof-approval-kb-v001.sql'
out=r/'database/seed.d/zzzzzzzzzzzz-2026-10-08-cl91-n3-three-proof-approved.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-cl91-n3-three-proof-approved-v001'
if out.exists() or bak.exists():raise SystemExit('STOP previous stage exists')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute("select status from kb_open_items where item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN'").fetchone()!=('blocked',):raise SystemExit('STOP DB open item changed')
 if c.execute("select count(*) from kb_decisions where decision_id='D-2026-10-08-CL91-N3-T3-THREE-PROOF-APPROVED'").fetchone()!=(0,):raise SystemExit('STOP approval already published')
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP integrity failed')
with sqlite3.connect(db) as existing:
 with sqlite3.connect(bak) as copy:existing.backup(copy)
out.write_bytes(src.read_bytes())
print('N3_APPROVAL_SQL_STAGED',out.name,'SHA',hashlib.sha256(out.read_bytes()).hexdigest(),'BACKUP',bak.name)
