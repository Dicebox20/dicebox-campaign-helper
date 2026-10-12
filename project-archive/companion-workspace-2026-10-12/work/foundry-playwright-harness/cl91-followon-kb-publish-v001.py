from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/cl91-followon-u2-contract-kb-v001.sql'
dest=r/'database/seed.d/zzzzzzz-2026-10-08-cl91-u2-interpretation-contract.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-cl91-u2-contract-v001'
if bak.exists() or dest.exists():raise SystemExit('STOP KB evidence may already be staged')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute("select count(*) from kb_decisions where decision_id='D-2026-10-08-CL91-U2-INTERPRETATION-THREE-EVIDENCES'").fetchone()!=(0,):
  raise SystemExit('STOP prior decision already present')
with sqlite3.connect(db) as original:
 with sqlite3.connect(bak) as copy: original.backup(copy)
dest.write_bytes(src.read_bytes())
print('STAGED_SEED.D',dest.name,'SHA',hashlib.sha256(dest.read_bytes()).hexdigest())
print('BACKUP',bak.name)
