import sqlite3, pathlib, json
db=pathlib.Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database\dicebox_campaign_helper_knowledge.sqlite')
delta=pathlib.Path(r'C:\\Users\\rujie\\Documents\\Codex\\DiceBox Campaign Helper\\work\\official-validator-audit-20261009\\injector-2-scale-preflight-branch.sql')
source=sqlite3.connect(db.as_uri()+'?mode=ro',uri=True)
memory=sqlite3.connect(':memory:')
source.backup(memory)
source.close()
memory.execute('PRAGMA foreign_keys=ON')
before={t:memory.execute('select count(*) from '+t).fetchone()[0] for t in ['kb_sources','kb_decisions','kb_facts','kb_open_items','kb_relationships']}
try:
 memory.executescript(delta.read_text(encoding='utf8'))
 x=memory.execute("PRAGMA integrity_check").fetchone()[0]
 foreign=list(memory.execute('PRAGMA foreign_key_check'))
 after={t:memory.execute('select count(*) from '+t).fetchone()[0] for t in before}
 rows=[memory.execute("SELECT COUNT(*) FROM "+t+" WHERE "+c+"=?",(key,)).fetchone()[0] for t,c,key in [
 ('kb_sources','source_id','S-2026-10-09-INJECTOR-2-SCALE'),
 ('kb_decisions','decision_id','D-2026-10-09-INJECTOR-2-SCALE'),
 ('kb_facts','fact_id','F-2026-10-09-INJECTOR-2-PREVIEW'),
 ('kb_facts','fact_id','F-2026-10-09-M01-LIVE-READBACK'),
 ('kb_open_items','item_id','O-2026-10-09-M01-FOOTPRINT'),
 ('kb_open_items','item_id','O-2026-10-09-INJECTOR-2-CERTIFICATION')]]
 print(json.dumps({"kind":"READ_ONLY_BASE_PLUS_MEMORY_DELTA","status":"PASS" if x=="ok" and not foreign and all(q==1 for q in rows) else "FAIL","integrity":x,"foreign_key_errors":len(foreign),"expected_record_counts":rows,"counts_before":before,"counts_after":after,"persistent_db_changed":False}))
except Exception as e:print(json.dumps({"kind":"READ_ONLY_BASE_PLUS_MEMORY_DELTA","status":"FAIL","exception":str(e),"persistent_db_changed":False}))
