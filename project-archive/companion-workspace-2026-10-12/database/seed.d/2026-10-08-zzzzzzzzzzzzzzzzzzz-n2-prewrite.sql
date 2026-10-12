-- Central Lodge CL-31 N2 safe-scope reconciliation
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_current_gate','CL-31 N2 Behavior PREVIEW'),
 ('central_lodge_current_gate_status','PREFLIGHT_PASS'),
 ('central_lodge_current_status','READ_ONLY_PREFLIGHT_PASS'),
 ('central_lodge_n2_geometry_sha256','39284bebfba282dc57fead4692426887e48e8ed3faead5bf06961d72b3ca2ed0');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-N2-PREFLIGHT','Central Lodge N2 live preflight and state reconciliation','campaign','Central Lodge N2','Live Foundry Region/state manifest plus canonical ledger and recovered build metadata','active','work/foundry-playwright-harness/n2-readonly-preflight.page.js + live ledger','2026-10-07','N2 4pc5akMBieHU7GvV / 9 Regions / 0 behaviors / geometry 39284beb…','Legacy build metadata names floodState and railCarAvailable; canonical ledger instead owns B1 floodCleared and N2 fastTravelEnabled. No repository runtime authority for the legacy keys was recovered.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-N2-SAFE-SCOPE','campaign.central-lodge.n2',NULL,'N2 safe gameplay scope and deferred flood mirror','CL-31 may safely bind Walkable Railway Margin Notice, Flood/Drainage Evidence Notice, Grotto Station interpretation, and a rail-car availability gate that requires puzzles.n1.railwayPowered and sets canonical puzzles.n2.fastTravelEnabled. Do not create the legacy railCarAvailable state. N2 Grotto Flood State remains behavior-free because B1 flood semantics are explicitly deferred and no authoritative mapping from the legacy floodState key to canonical puzzles.b1.floodCleared has been recovered. Platform lighting and all three transitions remain deferred.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-N2-PREFLIGHT',NULL,'central lodge n2 cl31 fast travel railway power flood deferred canonical ledger');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-N2-SAFE-SCOPE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
