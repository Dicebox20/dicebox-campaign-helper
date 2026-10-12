-- CL-50 R1 exact approved topology: source staged, live no-write preview PASS, NOT installed.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('S-2026-10-07-CL50-R1-STAGED-READONLY-PREVIEW',
'R1 N1 East to T1 Mouth A controlled bidirectional source stage and live no-write preview',
'verification','central-lodge CL50 R1 only',
'Direct user-approved route decision D-2026-10-07-CL50-FOUR-BIDIRECTIONAL-RAILWAY-PAIRS; exact Foundry 14.367 Region and ephemeral placement API readback; offline source static verification',
'active',
'docs/CL50-R1-BIDIRECTIONAL-GUARDED-PREVIEW-2026-10-07.md; work/foundry-playwright-harness/cl50-r1-staged-sources-v001.manifest.json; work/foundry-playwright-harness/cl50-r1-guarded-preview-v001.page.js',
'2026-10-07',
'21/202/116/33/134 ledgerRev1; 38 static checks PASS; 2 exact source SHAs; PASS_STAGED_FOR_GUARDED_APPLY',
'No live route installation or player travel. Future guarded APPLY must reread exact state; staging is evidence, not gameplay acceptance.');
INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL50-R1-PREVIEW-PASS',
'campaign.central-lodge.routes',NULL,
'Approved R1 has two source-SHA frozen handlers and ephemeral 1-square arrival preview PASS',
'CL50 R1 N1 East Region xsitdXO94BHJkYKX to T1 Mouth A ewIAYppRLvgIV1b7 and reverse scripts are staged only, hashes 0d804443760c05410678b6e1a6149da0a214758a43e8efe4ef3144b6056d2fd7 and a03569e8b8bfcc2c1b3fedc969e84b10a30b1186c680f9fa9aad46623a34124b. Foundry RegionDocument ephemeral non-persisted landing Region spawnTokens create:false preview PASS for both one-square destinations outside reverse-mouth Regions; N1 landing does not enter Three-Proof Station Power gate, but does overlap existing informational railway notice. Both scripts include elected GM, confirmation dialog, stable source/destination guards, 1x1 token size, 20-second suppression and manual fallback, no persistent destination Regions. Offline static tests 38 checks PASS. Exact campaign count 21 scenes/202 Regions/116 behaviors/33 Items/134 Macros ledger revision1. No RegionBehavior installed and no real-player canary occurred. Larger tokens require GM manual handling under staged v001.',
'campaign','staged','active','S-2026-10-07-CL50-R1-STAGED-READONLY-PREVIEW',NULL,
'central lodge CL50 R1 bidirectional staged noWrite preview landing no-bounce');
INSERT INTO facts_fts(fact_id,title,statement,tags) SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CL50-R1-PREVIEW-PASS' AND NOT EXISTS(SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_trials(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id)
VALUES('TR-2026-10-07-CL50-R1-WHOLEWORLD-COUNT-VERIFIER',
'central-lodge.CL50',
'Initial R1 no-write verifier reported 183 Scenes / 510 Regions / 400 behaviors and BLOCKED despite canonical smoke PASS.',
'First PREVIEW counted entire game.scenes rather than the 21 known Central Lodge Scene IDs.',
'World contains 162 additional Scenes outside the campaign; scope/count contract incorrectly included unrelated state.',
'Use the exact 21-Scene frozen CL90 roster to count only governed campaign Regions/behaviors; rerun returned PASS_STAGED_FOR_GUARDED_APPLY, no source or live changes.',
'PREVIEW_SCOPING_DEFECT_FIXED_READONLY_PASS',
'S-2026-10-07-CL50-R1-STAGED-READONLY-PREVIEW');
INSERT INTO trials_fts(trial_id,area,symptom,attempted_approach,failure_cause,correction)
SELECT trial_id,area,symptom,attempted_approach,failure_cause,correction FROM kb_trials
WHERE trial_id='TR-2026-10-07-CL50-R1-WHOLEWORLD-COUNT-VERIFIER'
AND NOT EXISTS(SELECT 1 FROM trials_fts t WHERE t.trial_id=kb_trials.trial_id);
INSERT OR REPLACE INTO kb_tools(tool_id,project_id,project_name,tool_name,tool_kind,invocation,location,capability,authority,evidence_status,source_id,tags)
VALUES('TOOL-2026-10-07-CL50-R1-STAGED-PREVIEW',
'dicebox-campaign-helper','DiceBox Campaign Helper','CL-50 R1 dual source static and live no-write preview','verifier',
'cd work/foundry-playwright-harness; node cl50-r1-static-validate-v001.cjs; node exec-page.mjs read cl50-r1-guarded-preview-v001.page.js',
'work/foundry-playwright-harness/',
'Checks exact source SHA, syntactic correctness, endpoint stable IDs, ephemeral placement and campaign-only baseline without installation.',
'Local stage and authorized exact Foundry read-only GM adapter; no live write or canary certified.',
'PASS_STATIC_38_AND_PASS_LIVE_NO_WRITE',
'S-2026-10-07-CL50-R1-STAGED-READONLY-PREVIEW','CL50 R1 preview QA no-write');
INSERT INTO tools_fts(tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags)
SELECT tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags FROM kb_tools
WHERE tool_id='TOOL-2026-10-07-CL50-R1-STAGED-PREVIEW'
AND NOT EXISTS(SELECT 1 FROM tools_fts f WHERE f.tool_id=kb_tools.tool_id);
UPDATE kb_open_items SET
 next_action='R1 source and ephemeral 1x1 arrival preview passed. Next write: independently review approved R1 frozen source and build one rollback-capable guarded install and separate final verifier for two behaviors with partial T1 scene metadata; do not install R2-R4 or claim player acceptance. After installation recheck canonical 21/202/118/33/134, ledger revision1 and no bounce on controlled player canary.',
 evidence_needed='Frozen R1 behavior source SHA values and source/target stable IDs; exact runtime/roster/current flag and token snapshot; reversible guarded APPLY and independent final readback; primary-GM and real-player movement canary when available.',
 source_id='S-2026-10-07-CL50-R1-STAGED-READONLY-PREVIEW'
 WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';
DELETE FROM open_items_fts WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_cl50_r1_source_stage','PASS_STATIC_38_AND_LIVE_PREVIEW_PASS; NOT_INSTALLED; only 1x1 token proposed'),
('central_lodge_cl50_r1_preview_receipt','docs/CL50-R1-BIDIRECTIONAL-GUARDED-PREVIEW-2026-10-07.md');
