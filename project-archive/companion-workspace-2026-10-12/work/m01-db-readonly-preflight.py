import sqlite3
db="file:C:/Users/rujie/Documents/Codex/DiceBox Campaign Helper/database/dicebox_campaign_helper_knowledge.sqlite?mode=ro"
c=sqlite3.connect(db,uri=True);c.row_factory=sqlite3.Row
for table in ("kb_facts","kb_decisions","kb_open_items"):
 print("SCHEMA",table,[r[1] for r in c.execute("PRAGMA table_info("+table+")")])
 cols={"kb_facts":("fact_id","title","statement"),"kb_decisions":("decision_id","topic","decision"),"kb_open_items":("item_id","title","description")}
try:
 for table in ("kb_facts","kb_decisions"):
  fields={"kb_facts":("fact_id","title","statement"),"kb_decisions":("decision_id","topic","decision")}[table]
  sql=f"SELECT {','.join(fields)} FROM {table} WHERE lower({fields[1]}) LIKE '%map%' OR lower({fields[2]}) LIKE '%wall%' OR lower({fields[2]}) LIKE '%spatial blueprint%' OR lower({fields[2]}) LIKE '%playwright%' ORDER BY {fields[0]} DESC LIMIT 15"
  for row in c.execute(sql):print("MATCH",table,*[str(x)[:250] for x in row],sep=" | ")
 print("INTEGRITY",c.execute("PRAGMA integrity_check").fetchone()[0])
except Exception as e: print("QUERY_ERR",repr(e))
