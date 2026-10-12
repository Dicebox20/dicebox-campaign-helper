-- CL-41 F2 read-only existing behavior PREVIEW PASS; no F2 gameplay write.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CL41-F2-READONLY-PREVIEW','CL-41 F2 four-observer read-only runtime PREVIEW','verification','Central Lodge F2','Read-only Playwright live Scene/RegionBehavior authority inspection','active','work/foundry-playwright-harness/cl41-f2-readonly-runtime-preview-v001.page.js','2026-10-07','F2 8 Regions / 4 behaviors / SHA b2001545ca35276b6a34799945e55f03648e326bd119f2f741619d9e5f6e2eca','Existing four observation behaviors source-hash-certified, ritual baseline active and unresolved, F1 F2 destination retained. No F2 gameplay write or canary.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL41-F2-READONLY-PREVIEW','campaign.central-lodge.endgame',NULL,'CL-41 F2 existing four-observer PREVIEW PASS, further design pending','F2 has 8 Regions, 4 enabled observer behaviors, geometry SHA b2001545ca35276b6a34799945e55f03648e326bd119f2f741619d9e5f6e2eca. The east anchor, west anchor, northern focus and active summoning revelations have their original source hashes. Scene ritualActive true, ritualStage ACTIVE_RITUAL_BASELINE, arrivalStage 0 and resolution UNRESOLVED. F1-to-F2 destination remains bound. No edits to lighting, transition, escalation or encounter state. Progression requires a separate authored CL-41 design reconciliation and canary.','campaign','static','locked','S-2026-10-07-CL41-F2-READONLY-PREVIEW',NULL,'central lodge cl41 f2 four observers source preview pass');
INSERT INTO facts_fts(fact_id,title,statement,tags) SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CL41-F2-READONLY-PREVIEW'
AND NOT EXISTS(SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_catalog_version','2026-10-07.cl41-f2-preview-complete-v001'),
('central_lodge_current_gate','CL-41 F2 Runtime Design RECONCILIATION'),
('central_lodge_current_gate_status','PENDING'),
('central_lodge_current_phase','CL-41'),
('central_lodge_current_scene','F2'),
('central_lodge_current_status','READ_ONLY_PREVIEW_PASS'),
('central_lodge_cl41_preflight_status','F2 8/4 source PREVIEW PASS; no write, gameplay canary pending');
