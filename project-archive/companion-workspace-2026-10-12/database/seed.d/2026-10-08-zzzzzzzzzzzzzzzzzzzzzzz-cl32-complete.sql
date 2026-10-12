-- CL-32 verified live completion plus hard Foreman execution-on-continuation rule.
-- Chronology: live N3 APPLY 2026-10-07T16:53 PDT; FINAL VERIFY 2026-10-07.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-CL32-COMPLETE','Central Lodge CL-32 N3 11-behavior APPLY plus independent FINAL VERIFY','verification','Central Lodge N3','Playwright read/write receipts plus independent read-only verifier','active','work/foundry-playwright-harness/n3-apply-v001.page.js; work/foundry-playwright-harness/n3-final-verify-v001.page.js','2026-10-07','Foundry 14.367/dnd5e 5.3.3/202 regions/112 behaviors','CL-32 APPLY installed eleven planned exact-source-hash behaviors, independent read-only FINAL VERIFY PASS. N3 has 12 regions and 11 behaviors. Scene geometry SHA 43bcb471640053e7000a8b37c6cd5243179295f5fe80f0537077646b62df1fd3 and kernel SHA 6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814 unchanged. Ledger revision 0; no gameplay canary. Lighting, rail-car state, branch unlock, transitions deferred.'),
('S-2026-10-07-FOREMAN-EXECUTION-RULE','User-mandated execution upon authenticated roadmap continuation','conversation','DiceBox Campaign Helper governance','Direct user instruction','active','AGENTS.md / current project continuation discussion','2026-10-07','Foreman mandatory continuation executes work v001','An authorized continuation is never completed by receipt-only response; work must advance to the next governed checkpoint, subject to safety, tool, and relay envelope restrictions.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CENTRAL-LODGE-CL32-COMPLETE','campaign.central-lodge.n3',NULL,'CL-32 N3 gameplay behavior installation independently certified','CL-32 N3 guarded APPLY PASS installed the 11 approved behaviors and independent no-write FINAL VERIFY PASS certified the exact behavior IDs, source hashes, and 21 Scenes / 202 Regions / 112 RegionBehaviors / 33 Items live baseline. N3 is 12 Regions / 11 behaviors. Kernel and N3 geometry unchanged, ledger revision 0 with empty notices. Runtime interaction not yet canary-tested. T3 branch unlock, rail-car state, lighting, and transitions explicitly deferred.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-CL32-COMPLETE',NULL,'central lodge cl32 n3 final verify 112 behaviors');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CENTRAL-LODGE-CL32-COMPLETE'
AND NOT EXISTS(SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review) VALUES
('D-449','Foreman continuation is execution, never receipt-only','For direct user or authenticated permitted Codex continuation directives, immediately begin the next 15-minute governed roadmap work window from the last verified checkpoint, produce substantive evidence-backed work, document a new checkpoint and use mandated native live-injection relay. Receipt-only acknowledgments, passive waiting, or simple status summaries do not satisfy a continuation. Higher-priority tool safety restrictions and explicit bounded-relay prohibitions remain binding; document blockers without claiming completion.','Direct user corrected repeated acknowledgement-only responses that prevented project progress.','project','locked','Foreman','S-2026-10-07-FOREMAN-EXECUTION-RULE',NULL);
INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id='D-449'
AND NOT EXISTS(SELECT 1 FROM decisions_fts d WHERE d.decision_id=kb_decisions.decision_id);

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_catalog_version','2026-10-07.cl32-complete-v001'),
('central_lodge_region_behavior_count','112'),
('central_lodge_current_gate','CL-33 T1/T2/T3 Read-Only Preflight'),
('central_lodge_current_gate_status','PENDING'),
('central_lodge_current_phase','CL-33'),
('central_lodge_current_scene','T1/T2/T3'),
('central_lodge_current_status','PREFLIGHT_PENDING'),
('central_lodge_next_installer','CL-33'),
('central_lodge_next_scene','T1');
