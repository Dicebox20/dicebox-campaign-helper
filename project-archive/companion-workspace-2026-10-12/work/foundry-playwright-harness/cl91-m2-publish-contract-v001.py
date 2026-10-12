from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/cl91-m2-serialized-contract-kb-v001.sql'
dest=r/'database/seed.d/zzzzzzzzz-2026-10-08-cl91-m2-single-portrait-writer-contract.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-cl91-m2-single-writer-contract-v001'
if dest.exists() or bak.exists():raise SystemExit('STOP existing durable patch or backup')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute("select count(*) from kb_decisions where decision_id='D-2026-10-08-CL91-M2-SERIAL-NOTICE-OBSERVE-SIGNET'").fetchone()!=(0,):
  raise SystemExit('STOP decision already published')
 if c.execute("select value from kb_metadata where key='central_lodge_region_behavior_count'").fetchone()!=('118',):
  raise SystemExit('STOP behavior-count baseline mismatch')
with sqlite3.connect(db) as source:
 with sqlite3.connect(bak) as target:source.backup(target)
dest.write_bytes(src.read_bytes())
print('STAGED',dest.name,'SHA',hashlib.sha256(dest.read_bytes()).hexdigest(),'BACKUP',bak.name)
