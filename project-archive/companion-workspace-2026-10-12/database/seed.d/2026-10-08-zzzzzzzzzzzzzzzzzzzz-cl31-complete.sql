-- Central Lodge CL-31 N2 completion
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_catalog_version','2026-10-07.cl31-complete-v1'),
 ('central_lodge_region_behavior_count','101'),
 ('central_lodge_current_gate','CL-32 N3 Read-Only Preflight'),
 ('central_lodge_current_gate_status','PENDING'),
 ('central_lodge_current_phase','CL-32'),
 ('central_lodge_current_scene','N3'),
 ('central_lodge_current_status','PREFLIGHT_PENDING'),
 ('central_lodge_next_installer','CL-32'),
 ('central_lodge_next_scene','N3');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-CL31-COMPLETE','Central Lodge CL-31 N2 APPLY and FINAL VERIFY receipts','campaign','Central Lodge N2','Playwright live APPLY plus independent FINAL VERIFY','active','work/foundry-playwright-harness/n2-apply-v001.page.js + n2-final-verify-v001.page.js','2026-10-07','202 Regions / 101 behaviors / N2 9/4','Two Notices, grotto interpretation, and railway-power-to-fast-travel gate certified. Flood mirror, lighting, and transitions remain deferred.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CENTRAL-LODGE-CL31-COMPLETE','campaign.central-lodge.n2',NULL,'CL-31 N2 safe gameplay installation certified','CL-31 APPLY installed four managed behaviors and FINAL VERIFY passed. Canonical live baseline is 21 Scenes / 202 Regions / 101 RegionBehaviors / 33 Items. N2 is 9 Regions / 4 behaviors. Flood mirroring remains deferred because B1 flood semantics are unresolved; platform lighting and all three transitions remain deferred.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-CL31-COMPLETE',NULL,'central lodge cl31 n2 202 101 fast travel flood deferred');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CENTRAL-LODGE-CL31-COMPLETE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
