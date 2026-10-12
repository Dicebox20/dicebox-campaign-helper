from pathlib import Path
import sqlite3,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
old=r/'database/dicebox_campaign_helper_knowledge.sqlite'
backup=r/'database/dicebox_campaign_helper_knowledge.sqlite.pre-cl91-m2-u2-additive-v001'
source=r/'work/foundry-playwright-harness/cl91-m2-u2-additive-schema-kb-v001.sql'
target=r/'database/seed.d/zzzzz-2026-10-08-cl91-m2-u2-distinct-narrative-stages.sql'
if backup.exists() or target.exists():raise SystemExit('STOP: prior KB source or backup exists; reconcile before replay')
with sqlite3.connect('file:'+old.as_posix()+'?mode=ro',uri=True) as c:
 row=c.execute("select status from kb_open_items where item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS'").fetchone()
 exists=c.execute("select count(*) from kb_decisions where decision_id='D-2026-10-08-CL91-M2-U2-ADDITIVE-STATE'").fetchone()
 if row!=('blocked',) or exists!=(0,):raise SystemExit('STOP: KB preconditions drift')
with sqlite3.connect(old) as original,sqlite3.connect(backup) as copy:original.backup(copy)
target.write_bytes(source.read_bytes())
print('SEEDED',target.name,'SHA',hashlib.sha256(target.read_bytes()).hexdigest(),'BACKUP_CREATED',backup.name)
