-- CL91 U2 Servant History interpretation installed and source verified, not gameplay certified.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL91-U2-INTERPRETATION-FINAL-READBACK',
 'CL91 U2 Household History Interpretation source installation readback',
 'verification','campaign','Exact Foundry 14.367 independent source hash and ledger/scene roster readback','active',
 'work/foundry-playwright-harness/cl91-u2-history-final-readonly-v001.page.js','2026-10-08',
 'CL91-U2-interpreted-source-11bbc0837bf1a4c',
 'One U2 tokenMoveIn RegionBehavior installed; original observe, two Notice writers, M2 Signet and M1 clock remain unaltered; no real player canary.')
ON CONFLICT(source_id) DO NOTHING;
INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL91-U2-INTERPRETATION-INSTALLED',
'central-lodge',NULL,'U2 household evidence-based interpretation handler source-installed',
'Exact Foundry v14.367 U2 Region qa4n4o834OZTKPoV contains newly installed enabled RegionBehavior WOiGF1WlGZM3fO8I, stable dbx:central-lodge:u2:behavior:servant-history-interpretation-v001, event tokenMoveIn, stored source SHA-256 11bbc0837bf1a4ccc20c62b523f8b9acc1061078a585a1f7e36de5cc303c4b32. Authored logic requires completed valid token movement, physical servant history observed, both Servant Room Absence and Nursery Contradiction Notice attempted by at least one party member, ignoring one-time roll success, before canonical observe sets servantHistoryInterpreted. No Item granting or destination change. Offline tests 19/19 PASS. Independent no-write Foundry source readback PASS: 21 Scenes, 202 Regions, 118 behaviors, 33 Items, ledger revision2 unchanged; original U2 observation, M2 Founder Portrait pickup, M1 clock and kernel hashes unchanged. No actual-player delivery or completion certified.',
'campaign','local','active','SRC-2026-10-08-CL91-U2-INTERPRETATION-FINAL-READBACK',
'U2,CL91,history,interpretation,source-only,player-test-deferred')
ON CONFLICT(fact_id) DO NOTHING;
UPDATE kb_metadata SET value='118'
 WHERE key='central_lodge_region_behavior_count' AND value='117';
UPDATE kb_open_items SET
 problem='U2 physical evidence interpretation now has one separately enabled source-verified behavior; source-only tests 19/19 and independent installed hash pass, but no player canary. M2 portraitObserved remains without independent verified player-facing producer. M2 Signet pickup source unchanged; two simultaneous Region event writers must not race the canonical ledger.',
 next_action='Design M2 portrait observation with an independent, serialized, player-understandable trigger that cannot race the existing Signet-triggered Old Estate Survey pickup. Preserve U2 installed behavior, and test U2 later in end-only campaign acceptance. Do not install any overlapping M2 writer without safe event sequencing.',
 evidence_needed='M2 original narrative clue provenance, exact portrait interaction trigger and nonoverlap guarantee, source hashes, negative-order race tests, independent Foundry readback and final real-player canary.',
 source_id='SRC-2026-10-08-CL91-U2-INTERPRETATION-FINAL-READBACK'
WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES' AND status='open';
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-08-CL91-U2-INTERPRETATION-INSTALLED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL91-U2-INTERPRETATION-INSTALLED');
UPDATE open_items_fts SET
problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES'),
next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES'),
evidence_needed=(SELECT evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES')
WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES';
