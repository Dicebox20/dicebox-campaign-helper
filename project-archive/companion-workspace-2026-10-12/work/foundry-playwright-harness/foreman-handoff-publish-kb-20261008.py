from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
src=r/'work/foundry-playwright-harness/foreman-handoff-kb-20261008-v001.sql'
out=r/'database/seed.d/zzzzzzzzzzzzzzzzzzzzz-2026-10-08-foreman-handoff-c1-reconciled.sql'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-foreman-handoff-20261008-v001'
hand=r/'handoffs/FOREMAN-NEXT-CHAT-COMPLETE-CATALOG-2026-10-08.md'
if out.exists() or bak.exists():raise SystemExit('STOP prior handoff KB source or backup')
if not hand.is_file() or hand.stat().st_size<9000:raise SystemExit('STOP handoff text missing/incomplete')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute('pragma integrity_check').fetchone()!=('ok',):raise SystemExit('STOP KB integrity drift')
 if c.execute("select status from kb_open_items where item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'").fetchone()!=('in_progress',):raise SystemExit('STOP calibration item drift')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-FOREMAN-HANDOFF-C1-CURRENT-LIVE'").fetchone()!=(0,):raise SystemExit('STOP already imported')
with sqlite3.connect(db) as c:
 with sqlite3.connect(bak) as backup:c.backup(backup)
out.write_bytes(src.read_bytes())
print('HANDOFF_KB_SEED_STAGED',out.name,'SHA256',hashlib.sha256(out.read_bytes()).hexdigest(),'DB_BACKUP',bak.name)
