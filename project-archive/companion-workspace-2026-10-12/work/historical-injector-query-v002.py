import sqlite3,pathlib
p=pathlib.Path(r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database\dicebox_campaign_helper_knowledge.sqlite")
db=sqlite3.connect(f"file:{p.as_posix()}?mode=ro",uri=True);db.row_factory=sqlite3.Row
tables={
"kb_trials":("trial_id","area",["symptom","attempted_approach","failure_cause","correction"]),
"kb_facts":("fact_id","title",["statement","tags"]),
"kb_decisions":("decision_id","topic",["decision","rationale"]),
"kb_sources":("source_id","title",["location","notes"]),
"kb_tools":("tool_id","tool_name",["invocation","capability","location","evidence_status"]),
"kb_open_items":("item_id","title",["problem","next_action"])
}
needles=("inject","macro","sequenc","uuid","name-based","name based","scene import","foundry upload","level-bound")
for table,(idcol,titlecol,columns) in tables.items():
 fieldnames=[titlecol,*columns]
 terms=" OR ".join(f"LOWER(COALESCE({c},'')) LIKE ?" for c in fieldnames for needle in needles)
 values=tuple("%"+needle+"%" for c in fieldnames for needle in needles)
 rows=db.execute(f"SELECT * FROM {table} WHERE {terms}",values).fetchall()
 scores=[]
 for r in rows:
  title=str(r[titlecol])
  blob=" ".join(str(r[c]) for c in columns if r[c] is not None)
  hay=(title+" "+blob).lower()
  score=sum((20 if needle in ["inject","macro"] else 6) for needle in needles if needle in title.lower())+sum((8 if needle in ["inject","macro"] else 2) for needle in needles if needle in blob.lower())
  score+=sum(n*3 for t,n in [("pass",1),("success",1),("single",1),("name",1),("sequence",2)] if t in hay)
  scores.append((score,r,title,blob))
 scores.sort(key=lambda x:(-x[0],str(x[1][idcol])))
 print("\n==",table,"MATCHES",len(rows),"==")
 for score,r,title,blob in scores[:(50 if table in ("kb_trials","kb_facts","kb_decisions") else 15)]:
  print(f"[{r[idcol]}] score={score} {title[:120]} :: {' '.join(blob.split())[:630]}")
