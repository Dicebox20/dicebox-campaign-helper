from pathlib import Path
p=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness\cl91-m2-single-writer-final-kb-v001.sql')
s=p.read_text(encoding='utf-8')
a="'validation','End-only real-player M2 Founder Portrait"
b="'certification','End-only real-player M2 Founder Portrait"
if s.count(a)!=1:raise SystemExit('STOP item_class anchor drift')
s=s.replace(a,b,1)
a="UPDATE open_items_fts SET status=(SELECT status FROM kb_open_items WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES'),\n problem="
b="UPDATE open_items_fts SET problem="
if s.count(a)!=1:raise SystemExit('STOP FTS field anchor drift')
s=s.replace(a,b,1)
p.write_bytes(s.encode('utf-8'))
print('SEED_ENUM_AND_FTS_SCHEMA_REPAIRED')
