import sqlite3,pathlib
p=pathlib.Path(r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database\dicebox_campaign_helper_knowledge.sqlite")
db=sqlite3.connect(f"file:{p.as_posix()}?mode=ro",uri=True);db.row_factory=sqlite3.Row
for table in ['kb_milestones','kb_decisions','kb_facts','kb_sources']:
 rows=db.execute("SELECT * FROM "+table).fetchall()
 print("\n",table)
 filtered=[]
 for row in rows:
  text=" ".join(str(v or "") for v in row).lower()
  relevant=["injector","injection", "single-macro","btr prototype","prototype 3","prototype 4","bootstrap"]
  if any(t in text for t in relevant):
   title=row['title'] if 'title' in row.keys() else row['topic'] if 'topic' in row.keys() else row['milestone'] if 'milestone' in row.keys() else ""
   if any(t in str(title).lower() for t in ['injector','injection','single-macro','prototype','build']) or any(t in text for t in ['single-macro build','injection sequence','injector_build']):
    filtered.append(row)
 print("RELEVANT",len(filtered))
 for row in filtered[:60]:
  val={k:row[k] for k in row.keys() if k not in ('tags',)}
  out=' | '.join(f'{k}={str(v or "")[:450]}' for k,v in val.items())
  print(out.encode("ascii","backslashreplace").decode("ascii"))
