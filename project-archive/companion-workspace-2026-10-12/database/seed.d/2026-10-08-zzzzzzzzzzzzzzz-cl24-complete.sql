-- Central Lodge CL-24 C2 completion
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_catalog_version','2026-10-07.cl24-complete-v1'),
 ('central_lodge_region_behavior_count','90'),
 ('central_lodge_current_gate','CL-30 N1 Read-Only Preflight'),
 ('central_lodge_current_gate_status','PENDING'),
 ('central_lodge_current_phase','CL-30'),
 ('central_lodge_current_scene','N1'),
 ('central_lodge_current_status','PREFLIGHT_PENDING'),
 ('central_lodge_next_installer','CL-30'),
 ('central_lodge_next_scene','N1');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-CL24-COMPLETE','Central Lodge CL-24 C2 APPLY and FINAL VERIFY receipts','campaign','Central Lodge C2','Playwright live APPLY plus independent FINAL VERIFY','active','work/foundry-playwright-harness/c2-apply-v001.page.js + c2-final-verify-v001.page.js','2026-10-07','202 Regions / 90 behaviors / C2 11/7','Two Notices, diagram/body recoveries, Firstborn pedestal, cult records, and measure/rhythm interpretation certified; lighting/transitions deferred.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CENTRAL-LODGE-CL24-COMPLETE','campaign.central-lodge.c2',NULL,'CL-24 C2 gameplay installation certified','CL-24 APPLY installed seven managed behaviors and FINAL VERIFY passed. Canonical live baseline is 21 Scenes / 202 Regions / 90 RegionBehaviors / 33 Items. C2 is 11 Regions / 7 behaviors. Two lighting Regions and two transitions remain deferred.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-CL24-COMPLETE',NULL,'central lodge cl24 c2 202 90');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CENTRAL-LODGE-CL24-COMPLETE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
