-- Central Lodge CL-24 C2 prewrite reconciliation
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_current_gate','CL-24 C2 Behavior PREVIEW'),
 ('central_lodge_current_gate_status','PREFLIGHT_PASS'),
 ('central_lodge_current_status','READ_ONLY_PREFLIGHT_PASS'),
 ('central_lodge_c2_geometry_sha256','34bb530f622671eaa6eaf3bf9987f394a6c018d2c2240773e3f5c6c2839f66de');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-C2-PREFLIGHT','Central Lodge C2 live preflight and catalog authority','campaign','Central Lodge C2','Live Foundry Region/state manifest plus canonical CL-24 plan/item registry','active','work/foundry-playwright-harness/c2-readonly-preflight.page.js + Central Lodge catalogue','2026-10-07','C2 UNySMm7YkyYfh41x / 11 Regions / 0 behaviors / geometry 34bb530f…','Safe gameplay slice: two Notices, Child Bracelet pedestal socket, Cult Passage Diagram pickup, Infernal Cicada Body pickup, Cult Records interpretation, Measure/Ritual Rhythm interpretation.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-C2-SAFE-SCOPE','campaign.central-lodge.c2',NULL,'C2 safe gameplay scope','Live C2 has dedicated Regions for Record Recency Notice, Concealed Record Category Notice, Cult Passage Diagram, Infernal Cicada Body, Firstborn Pedestal, Cult Records Interpretation, and Measure/Ritual Rhythm. CL-24 may bind exactly these seven mechanics. Child Bracelet from E4 fits the Firstborn pedestal and sets puzzles.c2.firstbornPedestalResolved without consumption. Diagram and Cicada Body are canonical recoveries; cultRecordsInterpreted and measureRhythmInterpreted are story/progression states. Two lighting Regions and two transitions remain deferred.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-C2-PREFLIGHT',NULL,'central lodge c2 cl24 firstborn child bracelet cult passage diagram cicada body measure rhythm records');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-C2-SAFE-SCOPE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
