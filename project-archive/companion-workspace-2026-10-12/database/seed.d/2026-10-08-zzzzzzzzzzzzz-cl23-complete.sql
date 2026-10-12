-- Central Lodge CL-23 C1 completion
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_catalog_version','2026-10-07.cl23-complete-v1'),
 ('central_lodge_region_behavior_count','83'),
 ('central_lodge_current_gate','CL-24 C2 Read-Only Preflight'),
 ('central_lodge_current_gate_status','PENDING'),
 ('central_lodge_current_phase','CL-24'),
 ('central_lodge_current_scene','C2'),
 ('central_lodge_current_status','PREFLIGHT_PENDING'),
 ('central_lodge_next_installer','CL-24'),
 ('central_lodge_next_scene','C2');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-CL23-COMPLETE','Central Lodge CL-23 C1 APPLY and FINAL VERIFY receipts','campaign','Central Lodge C1','Playwright live APPLY plus independent FINAL VERIFY','active','work/foundry-playwright-harness/c1-apply-v001.page.js + c1-final-verify-v001.page.js','2026-10-07','202 Regions / 83 behaviors / C1 10/6','Two Notices, two ritual sockets, shrine completion gate, and devil-worship interpretation certified; C2 door remains closed before gameplay.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CENTRAL-LODGE-CL23-COMPLETE','campaign.central-lodge.c1',NULL,'CL-23 C1 gameplay installation certified','CL-23 APPLY installed six managed behaviors and FINAL VERIFY passed. Canonical live baseline is 21 Scenes / 202 Regions / 83 RegionBehaviors / 33 Items. C1 is 10 Regions / 6 behaviors. The exact C2 threshold remains closed before gameplay; lighting and transition Regions remain deferred.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-CL23-COMPLETE',NULL,'central lodge cl23 c1 202 83');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CENTRAL-LODGE-CL23-COMPLETE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
