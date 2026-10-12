-- 2026-10-08 CL91 M2 source-only final evidence, gameplay not certified.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL91-M2-SINGLE-WRITER-VERIFIED',
'CL91 M2 portrait one-writer source installed independent final readback',
'verification','campaign','Foundry 14.367 exact independent RegionBehavior hashes and ledger/source readback','active',
'work/foundry-playwright-harness/cl91-m2-single-writer-final-readonly-v001.page.js',
'2026-10-08','CL91-m2-composite-4b341ee93374af01',
'Original Notice and Signet pickup source bodies preserved exactly within composite outer RegionBehavior; inner Notice disabled source unchanged. Source verification and 15 offline tests are not actual-player evidence.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL91-M2-SINGLE-WRITER-INSTALLED',
 'central-lodge',NULL,'M2 Founder Portrait distinct observation and opening source installed',
 'Exact live Foundry 14.367 M2 serialized outer Founder Portrait Signet Behavior IdriZEGhxUY9whcV remains active tokenEnter, with source SHA256 4b341ee93374af01b64b07061b4f509ea701d5cd2b1d02f8ee98562a17f98cf6. Existing Portrait Notice source body SHA 49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46 and Signet/Old Estate Survey pickup body SHA bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2 are embedded verbatim and independently extracted/hashed. Redundant overlapping inner Portrait Notice Behavior NxUruGwqnow13Krv is disabled with source, flags, IDs and Regions intact. Ordered one-client promise-queue runs Notice then observe setting puzzles.m2.founderPortraitObserved then original Signet-gated persistent pickup setting founderPortraitOpened and recovering Old Estate Survey; failed one-time Notice roll does not gate physical observation. Source offline tests 15/15 PASS; exact guarded PREVIEW and bounded APPLY PASS, independent read-only FINAL VERIFY PASS. Canonical world 21 Scenes, 202 Regions, 118 RegionBehaviors, exactly one disabled redundant Notice, 33 Items, ledger revision2 SHA 7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7, both portrait states false, no Item recovered, M1 clock/U2 interpretation/kernel unchanged. Player client/event delivery and global server CAS remain untested and not claimed.',
 'campaign','local','active','SRC-2026-10-08-CL91-M2-SINGLE-WRITER-VERIFIED',
 'CL91,M2,portrait,source-verified,serialized,signet,not-player-tested')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items SET
 status='closed',
 problem='M2 Founder Portrait observation and U2 Servant History interpretation now have separately source-verified authorized runtime behaviors, preserving the existing Signet/persistent Survey pickup and physical-servant-history observation. Exact M2 overlap was addressed with a single serialized outer RegionBehavior and disabled redundant inner Notice event. Neither has passed real-player gameplay acceptance.',
 next_action='No duplicate source installation. See O-2026-10-08-CL91-M2-U2-FINAL-PLAYER-CANARIES for real-player checks of M2 signet/no-signet and U2 evidence combinations at final campaign acceptance. N3 gate prerequisites remain a distinct unresolved authoring task.',
 evidence_needed='Independent CL91 M2 final source readback and CL90 v007 regression receipt; actual player canary remains open in separate item.',
 source_id='SRC-2026-10-08-CL91-M2-SINGLE-WRITER-VERIFIED'
WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES' AND status='open';

INSERT INTO kb_open_items(item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id)
VALUES('O-2026-10-08-CL91-M2-U2-FINAL-PLAYER-CANARIES',
 'certification','End-only real-player M2 Founder Portrait and U2 household interpretation acceptance',
 'M2 source-level one-client serialization and separate observation/Signet pickup is verified but unplayed. U2 three-evidence interpretive handler is source installed but unplayed. Whole-ledger writes from unrelated Regions and multiple GMs lack demonstrated server-side CAS. No real-player canary was run before end-of-campaign testing per user.',
 'At final campaign playtest, test M2 with no Signet (observation but no survey), failed Notice roll (no softlock), canonical Signet present (exactly one Survey pickup and portrait opened), repeated visits, and co-op concurrency; then test U2 combined Notice attempts including failed rolls, interpretation after observed traces, movement/reload, and ledger revision/Items. Stop and reconcile any outcome unknown; never replay a persistent pickup blindly.',
 'User-run Foundry GM/player action receipts, actor ownership, canonical Item/ledger authoritative readback, no global/foreign-state regressions and correct Source hash after final tests.',
 'P2','open','DiceBox Campaign Helper Foreman','SRC-2026-10-08-CL91-M2-SINGLE-WRITER-VERIFIED')
ON CONFLICT(item_id) DO NOTHING;

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-CL91-M2-SINGLE-WRITER-INSTALLED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL91-M2-SINGLE-WRITER-INSTALLED');
UPDATE open_items_fts SET problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES'),
 evidence_needed=(SELECT evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES')
WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES';
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
WHERE item_id='O-2026-10-08-CL91-M2-U2-FINAL-PLAYER-CANARIES'
AND NOT EXISTS(SELECT 1 FROM open_items_fts WHERE item_id='O-2026-10-08-CL91-M2-U2-FINAL-PLAYER-CANARIES');
