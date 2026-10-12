import sqlite3,pathlib
p=pathlib.Path(r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database\dicebox_campaign_helper_knowledge.sqlite")
db=sqlite3.connect(f"file:{p.as_posix()}?mode=ro",uri=True)
db.row_factory=sqlite3.Row
terms=['tallcap','forgotten road','underdark expedition','M02','M01','gathering maps','fungal forest']
for term in terms:
 print("\nTERM",term)
 found=0
 for table,idcol,columns in [
 ('kb_facts','fact_id',['title','statement']),
 ('kb_decisions','decision_id',['topic','decision','rationale']),
 ('kb_open_items','item_id',['title','problem','next_action']),
 ('kb_sources','source_id',['title','location','notes']),
 ('kb_trials','trial_id',['area','symptom','attempted_approach','correction'])]:
  cond=" OR ".join("LOWER(COALESCE("+c+",'')) LIKE ?" for c in columns)
  vals=["%"+term.lower()+"%"]*len(columns)
  rows=db.execute("SELECT * FROM "+table+" WHERE "+cond+" LIMIT 24",vals).fetchall()
  for r in rows:
   found+=1
   print(table,r[idcol],"|"," | ".join(str(r[c] or "")[:700].replace("\n"," ") for c in columns))
 print("COUNT",found)
