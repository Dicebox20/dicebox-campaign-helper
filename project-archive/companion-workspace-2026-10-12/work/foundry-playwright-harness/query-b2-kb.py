import sqlite3,json
db=r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database\dicebox_campaign_helper_knowledge.sqlite"
c=sqlite3.connect(db);c.row_factory=sqlite3.Row
terms=["B2","Hidden Annex","Cicada Wing I","victim","preparation","sacrificial","recent-use"]
out=[]
seen=set()
for term in terms:
 for r in c.execute("SELECT fact_id,title,statement,evidence_class,status,source_id,tags FROM kb_facts WHERE lower(title||' '||statement||' '||coalesce(tags,'')) LIKE ? ORDER BY fact_id",('%'+term.lower()+'%',)):
  d=dict(r)
  if d['fact_id'] not in seen: seen.add(d['fact_id']); out.append(d)
print(json.dumps(out,ensure_ascii=False,indent=2))
