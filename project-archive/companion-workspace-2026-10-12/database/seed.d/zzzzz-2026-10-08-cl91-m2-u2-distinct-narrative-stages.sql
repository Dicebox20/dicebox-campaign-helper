-- 2026-10-08 CL91; no live Foundry changes. Authoritative semantics and guarded migration scope.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES ('SRC-2026-10-08-CL91-M2-U2-SEMANTIC-RECONCILIATION',
 'CL91 M2 Founder Portrait and U2 Servant History distinct narrative stages',
 'verification','campaign','Live read-only installed sources, canonical ledger and accepted project roadmap','active',
 'docs/CENTRAL-LODGE-ROADMAP.md','2026-10-08','CL91-M2-U2-stage-schema-v001',
 'M2 physical Signet opening differs from portrait observation. U2 physical servant-trace observation differs from full history interpretation. Source-only analysis; no actual-player state change or gameplay certification.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES ('D-2026-10-08-CL91-M2-U2-ADDITIVE-STATE',
 'central-lodge-m2-u2-narrative-state',
 'Keep M2 founderPortraitOpened separate from founderPortraitObserved; keep U2 servantHistoryObserved separate from servantHistoryInterpreted. Predeclare two missing boolean fields initialized to false in the existing ledger without renaming existing fields or changing either installed script. M2 physical Signet interaction can reveal Old Estate Survey while mere observation cannot; U2 evidence observation cannot automatically mark history interpreted. Before one state migration require exact ledger revision and snapshot, unchanged kernel and installed source hashes, zero player activity, authorized Assistant Gamemaster, one bounded mutation, independent reread; never auto-set four narrative stages true.',
 'Existing installed actions express distinct causal narrative stages; shared runtime dynamic setPath accepts the two newly introduced paths, so aliasing would mislabel progression and source edits are unnecessary.',
 'campaign','locked','DiceBox Campaign Helper Foreman','SRC-2026-10-08-CL91-M2-U2-SEMANTIC-RECONCILIATION',
 'After schema migration source-verification; full story interpretation remains separately deferred')
ON CONFLICT(decision_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES ('F-2026-10-08-CL91-M2-U2-DYNAMIC-WRITER-SEMANTICS',
 'central-lodge',NULL,'CL91 M2 and U2 runtime dynamic state fields',
 'Foundry v14.367 read-only: M2 Founder Portrait Signet Behavior IdriZEGhxUY9whcV grants Old Estate Survey only after Actor Founders Signet possession and requests puzzles.m2.founderPortraitOpened. U2 Servant History Behavior J11ZvQh4lqzEsvRi describes observable servant traces and requests puzzles.u2.servantHistoryObserved. Existing ledger predeclares puzzles.m2.founderPortraitObserved and puzzles.u2.servantHistoryInterpreted, but neither counterpart. Kernel uses setPath to create nested request.statePath dynamically. Do not collapse semantics; additive false booleans preserve source logic; separate interpretation stage still unauthored.',
 'campaign','local','active','SRC-2026-10-08-CL91-M2-U2-SEMANTIC-RECONCILIATION',
 'CL91,M2,U2,ledger,founderPortraitOpened,servantHistoryObserved')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items SET
 problem='Source/ledger schema discrepancy reconciled as two independent narrative stages. Live kernel dynamically accepts both request paths, and installed M2 Signet/Survey pickup and U2 physical-observation sources must remain unchanged. Governed ledger addition of founderPortraitOpened=false and servantHistoryObserved=false still needs exact snapshot PREVIEW/APPLY/VERIFY, and separate founder portrait observed / history interpreted authoring remains open.',
 next_action='Use approved additive schema decision D-2026-10-08-CL91-M2-U2-ADDITIVE-STATE. Verify exact ledger baseline and GM authority, add only two missing false booleans to state in one controlled migration, then independent readback; preserve all unrelated play state and scripts. Separately author any later interpretive milestones; defer real-player canary.',
 evidence_needed='Read-only entire existing ledger hash/revision, M2/U2 source hashes, one controlled final ledger diff and revision, CL90 117 Region baseline, offline state-preservation fixture and deferred player test.',
 source_id='SRC-2026-10-08-CL91-M2-U2-SEMANTIC-RECONCILIATION'
WHERE item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS' AND status='blocked';

UPDATE kb_open_items SET status='in_progress'
WHERE item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS' AND status='blocked';

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-CL91-M2-U2-DYNAMIC-WRITER-SEMANTICS'
AND NOT EXISTS (SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL91-M2-U2-DYNAMIC-WRITER-SEMANTICS');
INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions
WHERE decision_id='D-2026-10-08-CL91-M2-U2-ADDITIVE-STATE'
AND NOT EXISTS (SELECT 1 FROM decisions_fts WHERE decision_id='D-2026-10-08-CL91-M2-U2-ADDITIVE-STATE');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS'),
 evidence_needed=(SELECT evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS')
WHERE item_id='O-2026-10-07-CL91-M2-U2-STATE-SEMANTICS';
