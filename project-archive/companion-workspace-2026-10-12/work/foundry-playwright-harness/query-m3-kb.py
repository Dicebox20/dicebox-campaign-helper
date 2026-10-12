import sqlite3, json
from pathlib import Path
db=Path(r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database\dicebox_campaign_helper_knowledge.sqlite")
c=sqlite3.connect(db)
c.row_factory=sqlite3.Row

def q(sql, params=()):
    return [dict(r) for r in c.execute(sql, params).fetchall()]

terms = ["m3","bell board","servant bell pull","bell crest","kitchen","service wing","pantry","servant"]
out = {
  "metadata": q("SELECT key,value FROM kb_metadata WHERE key LIKE 'central_lodge_%' ORDER BY key"),
  "facts": [],
  "decisions": [],
  "open_items": [],
  "tools": []
}
seen=set()
for term in terms:
    for r in q("SELECT fact_id,title,statement,evidence_class,status,source_id,tags FROM kb_facts WHERE lower(title) LIKE ? OR lower(statement) LIKE ? OR lower(tags) LIKE ? ORDER BY fact_id LIMIT 100", tuple([f"%{term}%"]*3)):
        if r["fact_id"] not in seen:
            seen.add(r["fact_id"]); out["facts"].append(r)
seen=set()
for term in terms:
    for r in q("SELECT decision_id,topic,decision,rationale,status,source_id FROM kb_decisions WHERE lower(topic) LIKE ? OR lower(decision) LIKE ? OR lower(rationale) LIKE ? ORDER BY decision_id LIMIT 80", tuple([f"%{term}%"]*3)):
        if r["decision_id"] not in seen:
            seen.add(r["decision_id"]); out["decisions"].append(r)
seen=set()
for term in terms:
    for r in q("SELECT item_id,title,problem,next_action,evidence_needed,status,source_id FROM kb_open_items WHERE lower(title) LIKE ? OR lower(problem) LIKE ? OR lower(next_action) LIKE ? ORDER BY item_id LIMIT 80", tuple([f"%{term}%"]*3)):
        if r["item_id"] not in seen:
            seen.add(r["item_id"]); out["open_items"].append(r)
for term in terms:
    for r in q("SELECT tool_id,tool_name,capability,authority,evidence_status,source_id FROM kb_tools WHERE lower(tool_name) LIKE ? OR lower(capability) LIKE ? OR lower(authority) LIKE ? ORDER BY tool_id LIMIT 80", tuple([f"%{term}%"]*3)):
        out["tools"].append(r)
print(json.dumps(out, ensure_ascii=False, indent=2))
