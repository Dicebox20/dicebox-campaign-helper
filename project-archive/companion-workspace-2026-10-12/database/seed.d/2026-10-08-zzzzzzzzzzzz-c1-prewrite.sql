-- Central Lodge CL-23 C1 prewrite reconciliation
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_current_gate','CL-23 C1 Behavior PREVIEW'),
 ('central_lodge_current_gate_status','PREFLIGHT_PASS'),
 ('central_lodge_current_status','READ_ONLY_PREFLIGHT_PASS'),
 ('central_lodge_c1_geometry_sha256','8d4ce4f6319acd5836ac8cf4fdbb4919a483b89d6da1c315dcdfec7f79c12f9d');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-C1-PREFLIGHT','Central Lodge C1 live preflight and catalog authority','campaign','Central Lodge C1','Live Foundry Region/state/wall manifest plus canonical CL-23 plan/item registry','active','work/foundry-playwright-harness/c1-readonly-preflight.page.js + Central Lodge catalogue','2026-10-07','C1 EDdktL7VUihbpKe9 / 10 Regions / 0 behaviors / geometry 8d4ce4f6…','Safe gameplay slice: two Notices, Covenant Seal socket, Ceremonial Censer socket, combined shrine gate, Devil Worship interpretation. Exact C2 threshold Wall oVJ6kFkHMxu4EKF8 is closed pre-game.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-C1-SHRINE-CONTRACT','campaign.central-lodge.c1',NULL,'C1 shrine completion contract','C1 uses Asmodean Covenant Seal from E4 and Ceremonial Censer from M2. Dedicated socket Regions set puzzles.c1.covenantSealInstalled and puzzles.c1.ceremonialCenserInstalled without consumption unless later authority requires it. Shrine Completion requires both installed states, sets puzzles.c1.shrineResolved and puzzles.c1.c2Unlocked, and opens only Wall oVJ6kFkHMxu4EKF8 (stable dbx:central-lodge:c1:wall:door-c2-threshold). Two hidden Notices and a Devil Worship interpretation are independent clue/story behaviors. Lighting and transition Regions remain deferred.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-C1-PREFLIGHT',NULL,'central lodge c1 shrine covenant seal ceremonial censer c2 unlock');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-C1-SHRINE-CONTRACT'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
