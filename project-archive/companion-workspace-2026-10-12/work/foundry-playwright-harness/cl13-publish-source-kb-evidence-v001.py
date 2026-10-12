from pathlib import Path
import sqlite3,subprocess,hashlib
root=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
dbdir=root/'database';source=root/'work/foundry-playwright-harness/cl13-source-installed-kb-delta-v001.sql'
destination=dbdir/'seed.d/zzzz-2026-10-08-cl13-clock-installed-source-verified.sql'
db=dbdir/'dicebox_campaign_helper_knowledge.sqlite'
backup=dbdir/'dicebox_campaign_helper_knowledge.sqlite.pre-cl13-clock-source-verified-v001'
if destination.exists() or backup.exists():raise SystemExit('STOP: refuse overwrite/resume uncertain KB mutation')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 if c.execute("select value from kb_metadata where key='central_lodge_region_behavior_count'").fetchone()!=('116',):
  raise SystemExit('STOP: metadata precondition drift')
 if c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-CL13-CLOCK-INSTALLED-SOURCE-VERIFIED'").fetchone()!=(0,):
  raise SystemExit('STOP: evidence already applied')
with sqlite3.connect(db) as conn,sqlite3.connect(backup) as safe:conn.backup(safe)
destination.write_bytes(source.read_bytes())
print('INSTALLED_DETERMINISTIC_KB_DELTA',destination.name,'SHA',hashlib.sha256(destination.read_bytes()).hexdigest())
p=subprocess.run(['python',str(dbdir/'build_database.py')],capture_output=True,text=True,timeout=95)
print('BUILDER_EXIT',p.returncode,'OUT',p.stdout.strip()[:1500],'ERR',p.stderr.strip()[:1000])
if p.returncode:raise SystemExit('STOP: DB builder failure, preserve backup/patch for manual reconciliation')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 integrity=c.execute('pragma integrity_check').fetchone()[0]
 count=c.execute("select value from kb_metadata where key='central_lodge_region_behavior_count'").fetchone()
 fact=c.execute("select status from kb_facts where fact_id='F-2026-10-08-CL13-CLOCK-INSTALLED-SOURCE-VERIFIED'").fetchone()
 item=c.execute("select status,substr(problem,1,110) from kb_open_items where item_id='O-2026-10-08-CL13-CLOCK-RUNTIME-PREVIEW'").fetchone()
 print('VERIFY_INTEGRITY',integrity,'BEHAVIORS',count,'FACT',fact,'OPEN',item)
 if not(integrity=='ok' and count==('117',) and fact==('active',) and item and item[0]=='in_progress'):
  raise SystemExit('STOP: post-rebuild readback mismatch; do not replay')
print('KB_SOURCE_INSTALLED_REBUILD_PASS')
