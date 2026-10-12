-- Central Lodge CL-30 N1 completion
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_catalog_version','2026-10-07.cl30-complete-v1'),
 ('central_lodge_region_behavior_count','97'),
 ('central_lodge_current_gate','CL-31 N2 Read-Only Preflight'),
 ('central_lodge_current_gate_status','PENDING'),
 ('central_lodge_current_phase','CL-31'),
 ('central_lodge_current_scene','N2'),
 ('central_lodge_current_status','PREFLIGHT_PENDING'),
 ('central_lodge_next_installer','CL-31'),
 ('central_lodge_next_scene','N2');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-CL30-COMPLETE','Central Lodge CL-30 N1 APPLY and FINAL VERIFY receipts','campaign','Central Lodge N1','Playwright live APPLY plus independent FINAL VERIFY','active','work/foundry-playwright-harness/n1-apply-v001.page.js + n1-final-verify-v001.page.js','2026-10-07','202 Regions / 97 behaviors / N1 11/7','Two Notices, three Proof sockets, three-Proof station power gate, and estate-railway interpretation certified. Rail-car system Region remains deferred.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CENTRAL-LODGE-CL30-COMPLETE','campaign.central-lodge.n1',NULL,'CL-30 N1 railway authorization certified','CL-30 APPLY installed seven managed behaviors and FINAL VERIFY passed. Canonical live baseline is 21 Scenes / 202 Regions / 97 RegionBehaviors / 33 Items. N1 is 11 Regions / 7 behaviors. Estate Rail Car system Region plus three transitions remain behavior-free/deferred; no railCarActivated state was invented.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-CL30-COMPLETE',NULL,'central lodge cl30 n1 202 97 railway power');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CENTRAL-LODGE-CL30-COMPLETE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
