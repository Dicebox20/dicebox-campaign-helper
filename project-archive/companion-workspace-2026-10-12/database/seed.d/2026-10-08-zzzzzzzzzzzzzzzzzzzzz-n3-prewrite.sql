-- Central Lodge CL-32 N3 safe-scope reconciliation
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_current_gate','CL-32 N3 Behavior PREVIEW'),
 ('central_lodge_current_gate_status','PREFLIGHT_PASS'),
 ('central_lodge_current_status','READ_ONLY_PREFLIGHT_PASS'),
 ('central_lodge_n3_geometry_sha256','43bcb471640053e7000a8b37c6cd5243179295f5fe80f0537077646b62df1fd3');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-N3-PREFLIGHT','Central Lodge N3 live preflight and state reconciliation','campaign','Central Lodge N3','Live Foundry Region/state manifest plus canonical item registry and kernel contracts','active','work/foundry-playwright-harness/n3-readonly-preflight.page.js + n3-kernel-contract-inspect.page.js','2026-10-07','N3 pHQvDUDlyWZFuNrX / 12 Regions / 0 behaviors / geometry 43bcb471…','Canonical ledger differs from legacy build-state names. Safe slice avoids legacy railCarAvailable and defers t3BranchUnlocked until tunnel/transition reconciliation.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-N3-SAFE-SCOPE','campaign.central-lodge.n3',NULL,'N3 depot safe gameplay scope','CL-32 safe scope: Walkable Railway Notice; Baggage Locker observation; Brass Baggage Token socket that, on successful acceptance, recovers canonical Station Route Plate and sets canonical stationRoutePlateResolved; Station Route Plate socket at the Departure Board setting departureBoardResolved; Railway Switch Wheel socket setting switchWheelInstalled; Cicada Wing IV pickup; Recent Use observation; three Cartography Table sockets for Old Estate Survey, Cult Passage Diagram, and Recent Route Fragment; and a cartography gate that sets routeOverlay.resolved when all three are placed. Do not set t3BranchUnlocked yet, because the exact relationship among departure-board resolution, switch alignment, cartography, and T3 transition remains unresolved. Do not create legacy n3.railCarAvailable. Depot lighting, rail-car system, and all transitions remain deferred.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-N3-PREFLIGHT',NULL,'central lodge n3 cl32 depot baggage route plate switch wing iv cartography t3 deferred');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-N3-SAFE-SCOPE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
