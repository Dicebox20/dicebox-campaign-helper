-- CL91 M2/U2 additive ledger migration verified 2026-10-08, source/ledger only.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES ('SRC-2026-10-08-CL91-M2-U2-ADDITIVE-FINAL-READBACK',
 'CL91 additive M2/U2 ledger schema migration independent Foundry readback',
 'verification','campaign','Foundry v14.367 Assistant Gamemaster exact no-write final ledger/source proof','active',
 'work/foundry-playwright-harness/cl91-m2-u2-additive-final-readonly-v001.page.js','2026-10-08',
 'CL91-ledger-r2-7feef0b3823ed64e',
 'One guarded ledger update created exactly two false state fields. Full ledger SHA verified; no player canary or material storyline completion.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES ('F-2026-10-08-CL91-M2-U2-LEDGER-STAGE-ADD-FINAL',
 'central-lodge',NULL,'M2/U2 separate-stage ledger migration source verified',
 'A single guarded live Assistant Gamemaster ledger update appended false puzzles.m2.founderPortraitOpened and false puzzles.u2.servantHistoryObserved without touching their separate existing counterpart flags. Exact prior source state revision 1 sha 8ea18562658ee2a255f2f17401424af160ad62de5ec5ff44f997b570a8a2cec7, resulting revision 2 SHA 7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7, independently verified. Installed M2/U2 source hashes bb f7 etc: M2 bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2 and U2 f815c0920579b163800a7bf5548d252dad398aeb245e90c48ce5363b0defd372; M1 clock source unchanged. World 21 Scenes, 202 Regions, 117 enabled RegionBehaviors and 33 Items; no play progress changed; CL90 v005 PASS_WITH_KNOWN_BLOCKERS. This does not certify actual player interactions.',
 'campaign','local','active','SRC-2026-10-08-CL91-M2-U2-ADDITIVE-FINAL-READBACK',
 'M2,U2,CL91,ledger,source-verified,not-playtested')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items
SET status='closed',
 problem='Resolved schema-only mismatch: M2 founderPortraitOpened and U2 servantHistoryObserved are separately predeclared as false. Original M2 and U2 RegionBehavior source identities and hashes unchanged, and existing portrait-observed/servant-interpreted stages preserved.',
 next_action='No further schema or source migration required for these two paths. See separate open narrative-stage item O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES for missing authored interpretation/observation semantics and final player acceptance.',
 evidence_needed='Independent CL91 final verifier and CL90 v005 baseline PASS_WITH_KNOWN_BLOCKERS.',
 source_id='SRC-2026-10-08-CL91-M2-U2-ADDITIVE-FINAL-READBACK'
WHERE item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS' AND status='in_progress';

INSERT INTO kb_open_items(item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id)
VALUES ('O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES','implementation',
 'Author separate M2 portrait observation and U2 servant-history interpretation stages',
 'M2 founderPortraitOpened and U2 servantHistoryObserved now have independent initialized ledger flags. Existing separate founderPortraitObserved and servantHistoryInterpreted flags remain false and their exact player-facing producer/adjudication policy is not yet verified in canonical source; do not collapse or assume either progressed when a Token enters a Region.',
 'Review source story evidence for which M2 clue qualifies observing the portrait and what U2 clue combination makes history interpreted. Specify authoritative action/event and dedicated independent writer if justified, then no-write preview and offline tests. Preserve Signet physical pickup, household trace observation and downstream dependencies; defer real player canary until campaign acceptance.',
 'Original PREPARE story source/provenance, explicit event/authority, exact source hashes, new stage transition tests, independent Foundry verifier and future real-player test.',
 'P2','open','DiceBox Campaign Helper Foreman','SRC-2026-10-08-CL91-M2-U2-ADDITIVE-FINAL-READBACK')
ON CONFLICT(item_id) DO NOTHING;

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-08-CL91-M2-U2-LEDGER-STAGE-ADD-FINAL'
AND NOT EXISTS (SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL91-M2-U2-LEDGER-STAGE-ADD-FINAL');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS'),
 evidence_needed=(SELECT evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS')
WHERE item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS';
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES'
AND NOT EXISTS (SELECT 1 FROM open_items_fts WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES');
