from pathlib import Path
import hashlib,sqlite3
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
src=r/'work/foundry-playwright-harness/cl91-u2-final-kb-v001.sql'
out=r/'database/seed.d/zzzzzzzz-2026-10-08-cl91-u2-interpretation-installed.sql'
db=r/'database/dicebox_campaign_helper_knowledge.sqlite'
bak=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-cl91-u2-interpreted-installed-v001'
if out.exists() or bak.exists():raise SystemExit('STOP: existing patch or backup')
with sqlite3.connect('file:'+db.as_posix()+'?mode=ro',uri=True) as c:
 cnt=c.execute("select value from kb_metadata where key='central_lodge_region_behavior_count'").fetchone()
 fact=c.execute("select count(*) from kb_facts where fact_id='F-2026-10-08-CL91-U2-INTERPRETATION-INSTALLED'").fetchone()
 if cnt!=('117',) or fact!=(0,):raise SystemExit('STOP: DB baseline drift')
with sqlite3.connect(db) as source:
 with sqlite3.connect(bak) as target:source.backup(target)
out.write_bytes(src.read_bytes())
print('KB_SOURCE_STAGED',out.name,'SHA',hashlib.sha256(out.read_bytes()).hexdigest(),'BACKUP',bak.name)
