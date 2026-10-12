-- CL-33 governed canonical pickup migration safe-slice installation and independent FINAL VERIFY, no gameplay canary.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CL33-CANONICAL-MIGRATION','CL-33 T1/T2/T3 canonical pickup migration APPLY plus independent FINAL VERIFY','verification','Central Lodge CL-33','Guarded Foundry Playwright APPLY and separate read-only FINAL VERIFY','active','work/foundry-playwright-harness/cl33-migration-apply-v001.page.js; cl33-migration-final-verify-v001.page.js','2026-10-07','21 scenes / 202 regions / 113 behaviors; ledger revision 0','GM-authorized player-decision confirmation, T1 supplemental Wing III pickup, T2 and T3 in-place legacy Script replacements. Source SHA and geometry/kernel locked. First APPLY rolled back on Foundry trimming trailing newline; normalized exact source then PREVIEW PASS, 24/24 mocked unit contracts PASS, APPLY PASS, independent FINAL VERIFY PASS. No gameplay canary.'),
('S-2026-10-07-CL33-TRAILING-LF','Foundry v14 RegionBehavior source trimming discovery','verification','Central Lodge CL-33','Read-only synthetic RegionBehavior schema normalization and rollback evidence','active','work/foundry-playwright-harness/cl33-model-difference-v001.page.js; cl33-synthetic-model-v001.page.js','2026-10-07','Source serialization trims one terminal LF','First APPLY correctly detected T1 source mismatch and rolled back all three operations. Read-only constructor revealed Foundry removes exactly one terminal LF on source. After canonical trimEnd normalization, all source lock hashes matched.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CENTRAL-LODGE-CL33-CANONICAL-MIGRATION','campaign.central-lodge.tunnels',NULL,'CL-33 tunnel canonical progression recovery bindings source-certified','Live canonical baseline has 21 Scenes / 202 Regions / 113 RegionBehaviors / 33 Items. Guarded CL-33 migration APPLY installed new T1 Wing III recovery RegionBehavior uslyOAlRE9Zzf87O (SHA 3a94336de7085861509386213400fc77fddb1159848b12c46d1449076421470a), updated T2 Wheel behavior 6s7f7pxMVLNNRBZR in place (SHA ed1b14b30ad8e91eb63c0ef3d249b6628e7f5d7dd9233e22e827e73847ef37d4), updated T3 Fragment behavior sY1XXM7Xz6Jj9gmR in place (SHA 59a275202cbc89f6ec974c12b5b0dd28a3b3e7f75428ba297dd46897c0ae9b38). Original T1 notice source SHA 2424223932f3f85f200909df4e5b8cf17576cd2e74723394e3e52b2457fe77f7 unchanged. 24/24 offline mocked contracts passed. Independent no-write FINAL VERIFY PASS and kernel/three geometry hashes unchanged. Ledger revision 0, no recovery flags changed. Script source certification does not prove live player interaction; GM-confirmed player decision required. Do not declare a live gameplay canary.','campaign','full_function','locked','S-2026-10-07-CL33-CANONICAL-MIGRATION',NULL,'central lodge cl33 t1 t2 t3 canonical recovery 113 apply verified canary pending');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CENTRAL-LODGE-CL33-CANONICAL-MIGRATION'
AND NOT EXISTS(SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review) VALUES
('D-451','CL-33 canonical Item pickup uses a single primary GM authoritative confirmer','RegionBehaviors dispatch to all clients. For T1 Wing III, T2 Switch Wheel and T3 Recent Route Fragment, only the sorted active primary GM presents a confirmation explicitly asking whether the player chose to take the Item. On affirmative response it invokes the existing primary-GM canonical kernel pickup, guarded with per-token pending lock and cooldown on cancellation. A refused or failed pickup remains recoverable. No physical item is auto-granted merely by entering the Region; older Actor flag-only progression was replaced for T2/T3. F1 Cicada Assembly and N3 item sockets continue to receive canonical embedded Item copies. All live gameplay interaction behavior remains canary pending.','Avoid uncontrolled Actor-flag-only recovery, duplicate client grants, and downstream inventory softlocks while preserving explicit player intent under GM adjudication. T1 hidden Notice remains unchanged.','campaign','locked','Foreman','S-2026-10-07-CL33-CANONICAL-MIGRATION',NULL);
INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id='D-451'
AND NOT EXISTS(SELECT 1 FROM decisions_fts f WHERE f.decision_id=kb_decisions.decision_id);

INSERT OR REPLACE INTO kb_trials(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id) VALUES
('TR-2026-10-07-CL33-REGION-SOURCE-TRAILING-LF','Foundry RegionBehavior script installation','First guarded migration APPLY returned FAIL_ROLLBACK_COMPLETE on T1 installed source hash','Create T1 RegionBehavior with source text ending in newline and compare raw string hash','Foundry v14 schema normalizes system.source by trimming trailing LF; code text otherwise identical. Guard detected mismatch.','Verify restoration to 202/112, reproduce one-byte trim in no-write synthetic model, trim source input, update frozen source hashes, rerun PREVIEW and 24/24 mocks, guarded APPLY and independent FINAL VERIFY PASS at 202/113.','recovered_verified','S-2026-10-07-CL33-TRAILING-LF');
INSERT INTO trials_fts(trial_id,area,symptom,attempted_approach,failure_cause,correction)
SELECT trial_id,area,symptom,attempted_approach,failure_cause,correction FROM kb_trials WHERE trial_id='TR-2026-10-07-CL33-REGION-SOURCE-TRAILING-LF'
AND NOT EXISTS(SELECT 1 FROM trials_fts f WHERE f.trial_id=kb_trials.trial_id);

UPDATE kb_open_items SET status='in_progress',
 problem='T1 Wing III, T2 Wheel and T3 Fragment canonical pickup scripts now installed and independent FINAL VERIFY passed at 202/113, but live player/GM interaction, recovery choice and actor inventory/ledger end-to-end canary remain untested.',
 next_action='Perform a separately approved controlled gameplay canary with rollback for one item; test both real player event.user and primary GM receipt, confirm Item grant, ledger, N3 socket and F1 compatibility; if canary passes, close CL-33 runtime certification. Do not reset campaign ledger without controlled rollback plan.',
 evidence_needed='Real player/primary GM token event + owned PC item embedded copy + revisioned ledger state + N3 socket/F1 interaction; certified rollback of canary data.'
WHERE item_id='O-2026-10-07-CL33-CANONICAL-PICKUP-MIGRATION';

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_catalog_version','2026-10-07.cl33-safe-slice-complete-v001'),
('central_lodge_region_behavior_count','113'),
('central_lodge_current_gate','CL-40 F1 Runtime Contract PREVIEW'),
('central_lodge_current_gate_status','PENDING'),
('central_lodge_current_phase','CL-40'),
('central_lodge_current_scene','F1'),
('central_lodge_current_status','PREFLIGHT_PENDING'),
('central_lodge_next_installer','CL-40'),
('central_lodge_next_scene','F1'),
('central_lodge_cl33_preflight_status','PASS; 113 behavior safe slice source-certified; live canary pending'),
('central_lodge_cl33_safe_slice_status','APPLY PASS and independent FINAL VERIFY PASS; no gameplay canary'),
('central_lodge_cl33_wing_iii_recovery_behavior_id','uslyOAlRE9Zzf87O');
