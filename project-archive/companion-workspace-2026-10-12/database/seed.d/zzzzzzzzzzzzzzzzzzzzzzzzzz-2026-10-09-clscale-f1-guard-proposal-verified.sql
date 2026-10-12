-- 2026-10-09 F1 read-only/ephemeral proposal, not an authorized live migration.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-09-F1-GUARDED-ARRIVAL-STAGED','F1 240px arrival read-only contract and 19/19 offline fixtures',
'verification','campaign','Authorized GM read-only T3/F1/F2 source capture and isolated ephemeral Foundry v14 placement probe','active',
'docs/CL-SCALE-F1-240-GUARDED-ARRIVAL-DESIGN-2026-10-09.md',
'2026-10-09','clscale-f1-proposed-guard-7ece3085',
'Explicitly proposed and NOT installed, safe design is 1x1 centered only; 2x2 fails closed, GM manual fallback. No committed teleport or player canary accepted.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-09-F1-240-ARRIVAL-GUARD-STAGED-19PASS','central-lodge',NULL,
'F1 240px guarded 1x1 arrival only source-stage: 19/19 offline tests, no live promotion',
'Live T3→F1 GM-confirmed installed handler source SHA c179ae83855e6eb136a1225bfbb882ab9c6b7bcd3f0773df3654f82b2b23d6cb uses random unsnapped teleport and lacks token-size or occupancy guard. F1 Scene La9krMOMBhAhDLi6 still grid120, SHA85ec24e6da7e5b849099fbe5b7a568693ccc71fc55842f7fefb4e584a045c235, inbound Region originally rectangle x2111 y2357 width840 height520 and script-free. F1 candidate320 1x1 impossible by solid Wall y2640. Hypothetical 240px with moved arrival Region x2390 y1860 width280 height280, a Foundry v14 ephemeral model produced 1x1 center placement token top-left x2410 y1880; its 240 square clears all 27 F1 Walls, scripted story Regions, and measuring token x2524 y2151. The proposed T3 script preserved consent and stable destination IDs, adds fail-closed 1x1-only check, post-modal revalidation of token dimensions, owner Actor and active GM, target Scene/Region, occupancy and Walls; 2x2 requires GM manual fallback. Staged proposal file work/foundry-playwright-harness/clscale-f1-t3-guard-proposed-v001.js SHA7ece308589200ede62acc7a8034b25db5d8e1201914f4463b9152ecf3fd10358, contract clscale-f1-arrival-contract-v001.json, fixtures clscale-f1-t3-guard-fixtures-v001.test.mjs 19/19 PASS. Earlier test failures arose from incorrect array instead of Foundry size-bearing Wall collection, corrected in offline harness; no Foundry modifications. Fresh live read-only T3/F1/F2 SHA check PASS, sovereign ledger revision13 SHAec3f1a02887b80a342653681d217d357f7bb7f5b44fa436555d57bf12c44cfd4 unchanged, CL90 v014 PASS_WITH_KNOWN_BLOCKERS zero failures. Before live migration disable existing T3→F1 handler to avoid unsafe random landing while F1 grid/Region differs, back up and guard each resource, prove committed placement (ephemeral alone not sufficient), inspect F1→F2 route, stage handler while disabled, independently verify and only then consider enable. No game playtest or install.',
'campaign','local','active','SRC-2026-10-09-F1-GUARDED-ARRIVAL-STAGED',
'clscale,f1,grid240,proposed,guarded-arrival,19-pass,not-installed')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items SET
problem='11 interior Scenes independently calibrated, N1 150 N2 160 F2 240; source hashes and sovereign ledger revision13 preserved. Remaining F1 grid120 candidate320 impossible at original arrival Region due y2640 Wall; candidate240 new one-square-only centered arrival contract staged NOT installed. Offline 19/19 guard fixtures PASS, ephemeral center x2410 y1880, 2x2 fail-closed GM fallback. Needs committed teleport and migration source gates. CL50 installers quarantined, final real-player tests deferred.',
next_action='Review docs/CL-SCALE-F1-240-GUARDED-ARRIVAL-DESIGN-2026-10-09.md. Before any live change, verify exact source hashes and no non-GM, back up T3/F1 sources, first disable old T3→F1 random teleport handler, then independently stage/verify F1 grid240 and destination Region x2390 y1860 width280 height280. Stage guarded T3 script while disabled and prove committed 1x1 destination versus auto-region semantics; enforce 2x2 fail-closed manual GM and separate F1→F2 route review. Do not activate CL50 R1–R4. Keep F1 grid120 until entire safety proof passes; preserve Ret/Meow and sovereign ledger.',
source_id='SRC-2026-10-09-F1-GUARDED-ARRIVAL-STAGED'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='in_progress';

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-09-F1-240-ARRIVAL-GUARD-STAGED-19PASS'
AND NOT EXISTS (SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-09-F1-240-ARRIVAL-GUARD-STAGED-19PASS');
UPDATE open_items_fts SET
problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
