-- Central Lodge CL-22 B2 completion
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_catalog_version','2026-10-07.cl22-complete-v1'),
 ('central_lodge_region_behavior_count','77'),
 ('central_lodge_current_gate','CL-23 C1 Read-Only Preflight'),
 ('central_lodge_current_gate_status','PENDING'),
 ('central_lodge_current_phase','CL-23'),
 ('central_lodge_current_scene','C1'),
 ('central_lodge_current_status','PREFLIGHT_PENDING'),
 ('central_lodge_next_installer','CL-23'),
 ('central_lodge_next_scene','C1');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-CL22-COMPLETE','Central Lodge CL-22 B2 APPLY and FINAL VERIFY receipts','campaign','Central Lodge B2','Playwright live APPLY plus independent FINAL VERIFY','active','work/foundry-playwright-harness/b2-apply-v001.page.js + b2-final-verify-v001.page.js','2026-10-07','202 Regions / 77 behaviors / B2 10/5','Wing I, two Notices, sacrifice evidence, and recent-use observation certified; lighting/transitions deferred.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CENTRAL-LODGE-CL22-COMPLETE','campaign.central-lodge.b2',NULL,'CL-22 B2 gameplay installation certified','CL-22 APPLY installed five managed behaviors and FINAL VERIFY passed. Canonical live baseline is 21 Scenes / 202 Regions / 77 RegionBehaviors / 33 Items. B2 is 10 Regions / 5 behaviors. Three lighting Regions and two transitions remain deferred.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-CL22-COMPLETE',NULL,'central lodge cl22 b2 202 77');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CENTRAL-LODGE-CL22-COMPLETE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
