import sqlite3,pathlib
db=sqlite3.connect(f"file:{pathlib.Path(r'C:/Users/rujie/Documents/Codex/DiceBox Campaign Helper/database/dicebox_campaign_helper_knowledge.sqlite').as_posix()}?mode=ro",uri=True);db.row_factory=sqlite3.Row
for table,idcol,fields in [
("kb_facts","fact_id",["title","statement","scope","status","source_id"]),
("kb_decisions","decision_id",["topic","decision","rationale","status","source_id"]),
("kb_open_items","item_id",["title","problem","next_action","status","source_id"]),
("kb_sources","source_id",["title","location","notes","status"])]:
 where=" OR ".join([f"lower(coalesce({col},'')) LIKE '%scene injector%'" for col in fields[:2]]+[f"lower(coalesce({col},'')) LIKE '%single%macro%'" for col in fields[:2]]+[f"lower(coalesce({col},'')) LIKE '%injection sequence%'" for col in fields[:2]])
 rows=db.execute(f"SELECT * FROM {table} WHERE {where} ORDER BY {idcol}").fetchall()
 print("\nTABLE",table,"N",len(rows))
 for row in rows:
  print(row[idcol]," | "," | ".join(f"{k}={str(row[k]).replace(chr(10),' ')[:1650]}" for k in fields).encode('ascii','backslashreplace').decode('ascii'))
print("\nSOURCE LOOKUP")
for sid in ("S-2026-10-06-AUTOMATED-SCENE-WORKFLOW","S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF","SRC-INJECTOR-V2-165","SRC-CHAT-COMPILER","S-2026-10-07-COMPLETE-SUCCESSOR-HANDOFF-CATALOG"):
 row=db.execute("SELECT * FROM kb_sources WHERE source_id=?",(sid,)).fetchone()
 if row:print(sid,dict(row))
