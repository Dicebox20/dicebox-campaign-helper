-- Central Lodge CL-21 E1 completion
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_catalog_version','2026-10-07.cl21-complete-v1'),
 ('central_lodge_region_behavior_count','72'),
 ('central_lodge_current_gate','CL-22 B2 Read-Only Preflight'),
 ('central_lodge_current_gate_status','PENDING'),
 ('central_lodge_current_phase','CL-22'),
 ('central_lodge_current_scene','B2'),
 ('central_lodge_current_status','PREFLIGHT_PENDING'),
 ('central_lodge_next_installer','CL-22'),
 ('central_lodge_next_scene','B2');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-CL21-COMPLETE','Central Lodge CL-21 E1 APPLY and FINAL VERIFY receipts','campaign','Central Lodge E1','Playwright live APPLY plus independent FINAL VERIFY','active','work/foundry-playwright-harness/e1-apply-v001.page.js + e1-final-verify-v001.page.js','2026-10-07','202 Regions / 72 behaviors / E1 6/3','Hound Notice, recent-use observation, and Black Garnet Eye socket installed; stateful Hound Tile remains missing-eye before gameplay.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CENTRAL-LODGE-CL21-COMPLETE','campaign.central-lodge.e1',NULL,'CL-21 E1 backtrack certified','CL-21 APPLY installed three managed behaviors and FINAL VERIFY passed. Canonical live baseline is 21 Scenes / 202 Regions / 72 RegionBehaviors / 33 Items. E1 is 6 Regions / 3 behaviors. The Hound Tile remains in missing-eye state before gameplay; the socket wrapper will swap only that exact Tile after a successful Black Garnet Eye installation. All five transitions remain deferred.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-CL21-COMPLETE',NULL,'central lodge cl21 e1 202 72');

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CENTRAL-LODGE-CL21-COMPLETE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
