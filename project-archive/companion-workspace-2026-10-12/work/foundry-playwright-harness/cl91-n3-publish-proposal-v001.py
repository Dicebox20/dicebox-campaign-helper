from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/cl91-n3-three-proof-proposal-evidence-v001.sql'
dst=r/'database/seed.d/zzzzzzzzzzz-2026-10-08-cl91-n3-three-proof-proposal-only.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-cl91-n3-proposed-only-v001'
if dst.exists() or bak.exists():raise SystemExit('STOP patch or backup already exists')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP corrupted DB')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-CL91-N3-THREE-PROOF-POLICY-UNAPPROVED'").fetchone()!=(0,):
  raise SystemExit('STOP prior research receipt')
 if c.execute("select status from kb_open_items where item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN'").fetchone()!=('blocked',):
  raise SystemExit('STOP N3 authoring blocker changed')
with sqlite3.connect(db) as conn:
 with sqlite3.connect(bak) as copy:conn.backup(copy)
dst.write_bytes(src.read_bytes())
print('N3_PROPOSAL_SEED_STAGED',dst.name,hashlib.sha256(dst.read_bytes()).hexdigest(),'BACKUP',bak.name)
