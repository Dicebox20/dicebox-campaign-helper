import sqlite3,pathlib
p=pathlib.Path(r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database\dicebox_campaign_helper_knowledge.sqlite")
c=sqlite3.connect(f"file:{p.as_posix()}?mode=ro",uri=True);c.row_factory=sqlite3.Row
queries=[
("kb_facts","fact_id",["title","statement","tags"],["inject","scene","macro","map","L3-","L2-"]),
("kb_decisions","decision_id",["topic","decision","rationale"],["inject","scene","macro","map","L3-","L2-"]),
("kb_sources","source_id",["title","location","notes"],["inject","scene","prototype","btr"]),
("kb_open_items","item_id",["title","problem","next_action"],["inject","scene","L2-","L3-"]),
("kb_trials","trial_id",["area","symptom","attempted_approach","failure_cause","correction"],["inject","macro","map"])
]
for table,idcol,fields,words in queries:
 selected=[]
 for row in c.execute("SELECT * FROM "+table):
  hay=" ".join(str(row[f] or "") for f in fields).lower()
  if any(x.lower() in hay for x in words):
   score=sum(2 if k in ["inject","macro"] else 1 for k in words if k.lower() in hay)
   if any(k in hay for k in ["successful","injection","single-macro","scene injector","name-based","by name","sequence"]):score+=8
   selected.append((score,row))
 print("TABLE",table,"TOTAL",len(selected))
 for _,row in sorted(selected,key=lambda x:(-x[0],str(x[1][idcol])))[:75]:
  blob=" ".join(str(row[f] or "") for f in fields)
  print(row[idcol],"|",str(blob).replace("\n"," ")[:950].encode("ascii","backslashreplace").decode("ascii"),"| status=",row["status"] if "status" in row.keys() else "", "| source=",row["source_id"] if "source_id" in row.keys() else "")
