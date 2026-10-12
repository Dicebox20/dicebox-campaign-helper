import sqlite3,pathlib,os
p=pathlib.Path(r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\database\dicebox_campaign_helper_knowledge.sqlite")
c=sqlite3.connect(f"file:{p.as_posix()}?mode=ro",uri=True)
print('DB_PATH',p,'BYTES',p.stat().st_size)
for name,ddl in c.execute("SELECT name,sql FROM sqlite_master WHERE type='table' ORDER BY name"):
 cols=[x[1] for x in c.execute(f"PRAGMA table_info({name})")]
 print("TABLE",name,"COLUMNS",cols)
