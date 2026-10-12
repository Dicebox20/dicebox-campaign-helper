-- Central Lodge CL-30 N1 prewrite reconciliation
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_current_gate','CL-30 N1 Behavior PREVIEW'),
 ('central_lodge_current_gate_status','PREFLIGHT_PASS'),
 ('central_lodge_current_status','READ_ONLY_PREFLIGHT_PASS'),
 ('central_lodge_n1_geometry_sha256','07db85982fb80f1447b320caeff0ff9089e8ff7b18b0f1fea3ab1ac2bba83ce6');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-N1-PREFLIGHT','Central Lodge N1 live preflight and catalog authority','campaign','Central Lodge N1','Live Foundry Region/state manifest plus canonical CL-30 plan/proof registry','active','work/foundry-playwright-harness/n1-readonly-preflight.page.js + Central Lodge catalogue','2026-10-07','N1 MAbLfBqG7qIVVuLN / 11 Regions / 0 behaviors / geometry 07db8598…','Earlier N1 installed/locked fact refers scene/build injection. Live Scene implementationPending explicitly preserves gameplay behavior binding as pending; do not rerun scene build.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-N1-BEHAVIOR-SCOPE','campaign.central-lodge.n1',NULL,'N1 railway authorization gameplay scope','N1 scene/build is locked, but its gameplay Regions remain behavior-free and explicitly pending. CL-30 may bind Walkable Railway Notice, Station Power Notice, House/Garden/Rail Proof sockets, a three-Proof power gate, and Estate Railway interpretation without rerunning scene injection. The three Proof Items are canonical from U1, E3, and B1. Railway power is the runtime gate; tunnel/lodge transitions and station lighting remain deferred.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-N1-PREFLIGHT',NULL,'central lodge n1 cl30 proof railway power scene build locked behavior pending');

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-07-N1-BEHAVIOR-SCOPE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
