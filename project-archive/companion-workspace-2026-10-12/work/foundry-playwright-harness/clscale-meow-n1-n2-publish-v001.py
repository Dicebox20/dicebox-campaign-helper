from pathlib import Path
import hashlib,sqlite3
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/clscale-meow-n1-n2-kb-v001.sql'
dest=r/'database/seed.d/zzzzzzzzzzzzzzzzzzzzzzzz-2026-10-09-clscale-meow-n1-n2-verified.sql'
backup=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-clscale-meow-n1-n2-v001'
if backup.exists() or dest.exists():raise SystemExit('STOP existing KB source or backup')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP database integrity')
 for fact in ('F-2026-10-09-MEOW-LEDGER-RECONCILED','F-2026-10-09-CL-SCALE-N1-GRID150-INSTALLED','F-2026-10-09-CL-SCALE-N2-GRID160-INSTALLED'):
  if c.execute('select count(*) from kb_facts where fact_id=?',(fact,)).fetchone()!=(0,):raise SystemExit('STOP fact already exists: '+fact)
 if c.execute("select status from kb_open_items where item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'").fetchone()!=('in_progress',):raise SystemExit('STOP open item drift')
with sqlite3.connect(db) as old:
 with sqlite3.connect(':memory:') as test:
  old.backup(test)
  test.executescript(src.read_text(encoding='utf8'))
  if test.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP proposed SQL integrity')
 with sqlite3.connect(backup) as saved:old.backup(saved)
dest.write_bytes(src.read_bytes())
print('KB_STAGED_VERIFIED',dest.name,hashlib.sha256(dest.read_bytes()).hexdigest(),'DB_BACKUP',backup.name)
