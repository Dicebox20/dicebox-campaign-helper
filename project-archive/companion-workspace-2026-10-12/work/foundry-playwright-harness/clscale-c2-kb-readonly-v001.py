from pathlib import Path
import sqlite3,json
p=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database\dicebox_campaign_helper_knowledge.sqlite')
c=sqlite3.connect('file:'+p.as_posix()+'?mode=ro',uri=True)
c.row_factory=sqlite3.Row
r={}
r['integrity']=c.execute('PRAGMA integrity_check').fetchone()[0]
r['decisions']=[dict(x) for x in c.execute("SELECT decision_id,topic,decision,status,source_id FROM kb_decisions WHERE decision_id LIKE '%CL-SCALE%'")]
r['open_items']=[dict(x) for x in c.execute("SELECT item_id,status,problem,next_action FROM kb_open_items WHERE item_id LIKE '%CL-SCALE%'")]
r['facts']=[dict(x) for x in c.execute("SELECT fact_id,title,statement,status,source_id FROM kb_facts WHERE fact_id LIKE '%CL-SCALE%' ORDER BY fact_id")]
r['trials']=[dict(x) for x in c.execute("SELECT trial_id,area,symptom,evidence_status FROM kb_trials WHERE area LIKE '%CL-SCALE%' LIMIT 20")]
print(json.dumps(r,ensure_ascii=True))
