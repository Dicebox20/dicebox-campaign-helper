import sqlite3, pathlib, json
original=pathlib.Path(r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database\dicebox_campaign_helper_knowledge.sqlite")
delta=pathlib.Path(r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\image-clean-restart-validation\image-prompt-clean-restart.sql")
read=sqlite3.connect('file:'+original.as_posix()+'?mode=ro',uri=True)
mem=sqlite3.connect(':memory:')
read.backup(mem);read.close()
mem.execute('PRAGMA foreign_keys=ON')
try:
 mem.executescript(delta.read_text(encoding='utf-8'))
 integrity=mem.execute('PRAGMA integrity_check').fetchone()[0]
 fk=list(mem.execute('PRAGMA foreign_key_check'))
 rows={}
 for table,column,key in [
 ('kb_sources','source_id','S-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART'),
 ('kb_decisions','decision_id','D-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART'),
 ('kb_facts','fact_id','F-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART'),
 ('kb_open_items','item_id','O-2026-10-09-CHATGPT-PROJECT-INSTRUCTIONS-IMAGE-RULE'),
 ('kb_open_items','item_id','O-2026-10-09-IMAGE-PROVIDER-GUARD-INTEGRATION')]:
  rows[key]=mem.execute('SELECT COUNT(*) FROM '+table+' WHERE '+column+'=?',(key,)).fetchone()[0]
 result={'operation':'dicebox.clean-restart.kb-migration-memory-smoke','status':'PASS' if integrity=='ok' and not fk and all(v==1 for v in rows.values()) else 'FAIL','integrity':integrity,'foreignKeyErrors':len(fk),'expectedRecords':rows,'persistentDbChanged':False}
 print(json.dumps(result))
except Exception as e:
 print(json.dumps({'status':'FAIL','error':str(e),'persistentDbChanged':False}))
 raise
