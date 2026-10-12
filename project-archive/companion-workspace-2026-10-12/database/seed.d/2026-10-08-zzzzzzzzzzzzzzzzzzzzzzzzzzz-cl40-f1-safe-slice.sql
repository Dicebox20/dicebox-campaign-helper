-- CL-40 F1 Cicada Assembly canonical stable ID selection guarded APPLY and independently verified.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CL40-F1-CANONICAL-ASSEMBLY','CL-40 F1 Infernal Cicada Assembly canonical identity fix','verification','Central Lodge F1','No-write PREVIEW + guarded in-place APPLY + separate read-only FINAL VERIFY','active','work/foundry-playwright-harness/cl40-f1-canonical-assembly-preview-v001.page.js; cl40-f1-canonical-assembly-apply-v001.page.js; cl40-f1-canonical-assembly-final-verify-v001.page.js','2026-10-07','202 regions/113 behaviors; F1 6/4; source SHA 830030f02434d2654346d0cfde4a2e73bdb600a3b98412ca1e433b46fc99f2b7','Replaced only F1 Assembly name-regex inventory selector with canonical stableId or canonicalStableId membership for Cicada Body, Wings I-IV. Exact target VP... F1 geometry unchanged; ward, resonant observation and F2 transition source hashes unchanged. No gameplay canary.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL40-F1-CANONICAL-ASSEMBLY','campaign.central-lodge.endgame',NULL,'F1 Cicada Assembly requires five authentic canonical component items','Guarded CL-40 APPLY updated existing F1 Cicada Assembly behavior VPsFO5t8IhCzf5wn to exact source SHA 830030f02434d2654346d0cfde4a2e73bdb600a3b98412ca1e433b46fc99f2b7; no RegionBehavior was added. New selector uses flags.world.dicebox.canonicalStableId or stableId equal to five required canonical Item identities: infernal-cicada-body; cicada-wing-i; cicada-wing-ii; cicada-wing-iii; cicada-wing-iv. Name-only spoof matches rejected in read-only selector simulation. F1 6 Regions/4 Behaviors geometry SHA 6aa46295e7c4ba743246763116772ab67051de2ad7e9444012413922ffe714b5, ward/observation/transition sources unchanged, central ledger revision 0, no live gameplay canary.','campaign','full_function','locked','S-2026-10-07-CL40-F1-CANONICAL-ASSEMBLY',NULL,'central lodge cl40 f1 cicada canonical stable items source verified');
INSERT INTO facts_fts(fact_id,title,statement,tags) SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CL40-F1-CANONICAL-ASSEMBLY'
AND NOT EXISTS(SELECT 1 FROM facts_fts x WHERE x.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review) VALUES
('D-452','F1 Cicada Assembly uses canonical Item stable IDs, not names','Accept assembly only when actors actually carry embedded items with the exact five DiceBox stable IDs/canonicalStableIds, never matching item display names or accepting arbitrary renamed counterfeit Items. Preserve existing GM-confirmed assembly, Scene flag, Measure adjudication, wall/lights controls, and F1-to-F2 transition while deferring interaction canary.','Existing F1 assembly matched Item name fragments and allowed false completion by unrelated renamed Item. Exact progression Items are now available through the CL-33 canonical recovery kernel.','campaign','locked','Foreman','S-2026-10-07-CL40-F1-CANONICAL-ASSEMBLY',NULL);
INSERT INTO decisions_fts(decision_id,topic,decision,rationale) SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id='D-452'
AND NOT EXISTS(SELECT 1 FROM decisions_fts f WHERE f.decision_id=kb_decisions.decision_id);

INSERT OR REPLACE INTO kb_open_items(item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id) VALUES
('O-2026-10-07-CL40-F1-GAMEPLAY-CANARY','certification','CL-40 F1 canonical Cicada Assembly gameplay canary pending','F1 Actor inventory selector has passed deterministic static tests and source FINAL VERIFY; full player event to GM confirmation and Scene flag effects remain untested. Ward source and transition remain legacy but unchanged.','Run separately approved, rollback-safe real player/GM canary after CL-33 Item recovery canary; verify complete five canonical parts grant, refusal, install and ward stage, then restore campaign state according to documented canary plan.','Authoritative character inventories, GM confirmation result, persisted F1 Scene flag, ward/transition state, reversible canary data and independent reread.','P1','open','Foreman','S-2026-10-07-CL40-F1-CANONICAL-ASSEMBLY');
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed) SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-07-CL40-F1-GAMEPLAY-CANARY'
AND NOT EXISTS(SELECT 1 FROM open_items_fts f WHERE f.item_id=kb_open_items.item_id);

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_catalog_version','2026-10-07.cl40-f1-safe-slice-complete-v001'),
('central_lodge_current_gate','CL-41 F2 Runtime Contract PREVIEW'),
('central_lodge_current_gate_status','PENDING'),
('central_lodge_current_phase','CL-41'),
('central_lodge_current_scene','F2'),
('central_lodge_current_status','PREFLIGHT_PENDING'),
('central_lodge_next_installer','CL-41'),
('central_lodge_next_scene','F2'),
('central_lodge_cl40_safe_slice_status','F1 Cicada identity binding APPLY PASS and independent FINAL VERIFY PASS; F1 canary pending'),
('central_lodge_f1_cicada_assembly_source_sha256','830030f02434d2654346d0cfde4a2e73bdb600a3b98412ca1e433b46fc99f2b7');
