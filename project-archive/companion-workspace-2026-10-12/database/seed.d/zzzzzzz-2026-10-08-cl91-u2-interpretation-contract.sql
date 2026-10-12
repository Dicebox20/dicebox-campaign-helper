-- 2026-10-08 CL91 follow-on story authoring; control plane before runtime code.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL91-U2-FOLLOWON-CONTRACT',
 'CL91 U2 evidence-based interpretation and M2 Signet collision review',
 'verification','campaign','Authorized Foreman authored design derived from installed Foundry source and runtime Notice behavior','active',
 'docs/CL91-M2-U2-FOLLOWON-STAGES-2026-10-08.md','2026-10-08',
 'CL91-U2-authored-interpretation-v001',
 'Author-created narrative event selection, not recovered PREPARE history; no gameplay claim. Notice roll failure must not softlock story.')
ON CONFLICT(source_id) DO NOTHING;
INSERT INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES('D-2026-10-08-CL91-U2-INTERPRETATION-THREE-EVIDENCES',
'central-lodge-u2-story-interpretation',
'Add one distinct U2 Servant History tokenMoveIn interpretation writer, with movement completion, exact Region ownership, primary-GM kernel authority, and Actor ownership checks. Gate only on servantHistoryObserved=true and attempted Notice records for servant-room-absence plus nursery-contradiction by any Actor (including failed 1d20 Notices). Set servantHistoryInterpreted=true via canonical observe kernel once, without Item grants or edits to existing RegionBehaviors. The conclusion is deliberately limited to deliberate clearance and later arrangement of nursery items; do not ascribe cause, dates or culprit. On first simultaneous move-in/observation race fail closed and allow return visit. M2 portrait observed must remain separate from opened; defer overlapping event installation until serialized GM-trigger design verified.',
'Installed one-time Notice attempts are persisted even on failed silent rolls. Requiring Notice success would lock out physical interpretation. Additional M2 automatic writer may race existing Signet pickup against global ledger.',
'campaign','locked','DiceBox Campaign Helper Foreman','SRC-2026-10-08-CL91-U2-FOLLOWON-CONTRACT','After source tests and user end-only gameplay canary')
ON CONFLICT(decision_id) DO NOTHING;
INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL91-U2-M2-LIVE-EVIDENCE-BEFORE-FOLLOWON',
'central-lodge',NULL,'U2 three stage evidence and M2 overlapping Signet Region',
'Exact Foundry v14.367 source: U2 Servant History Region qa4n4o834OZTKPoV contains observation writer J11ZvQh4lqzEsvRi for servantHistoryObserved. Servant Room Absence Notice Region UsCSlj3KWoPGpT5L and Nursery Contradiction Notice Region UXQMAhtVpmZVrwsR each persist their one-time Notice attempts in ledger.notices keyed by Notice name and Actor ID, including silent failure. M2 Founder Portrait Region FRY091GwobgD2M5i already contains physical Signet/Old Estate Survey pickup IdriZEGhxUY9whcV; independent automatic observation is deferred to avoid concurrent writes.',
'campaign','local','active','SRC-2026-10-08-CL91-U2-FOLLOWON-CONTRACT',
'CL91,M2,U2,events,notice,history,party-shared,collision')
ON CONFLICT(fact_id) DO NOTHING;
UPDATE kb_open_items SET next_action='Implement only source-accepted U2 interpretive RegionBehavior after exact source, ledger and Notice evidence offline tests + no-write preview; preserve original physical-history observation, no mandatory successful Notice rolls, no Items or geometry changes. Defer automatic M2 Founder Portrait observation until serialized/explicit event policy eliminates Signet pickup overlap. Final real-player acceptance remains end-only.',
 source_id='SRC-2026-10-08-CL91-U2-FOLLOWON-CONTRACT'
 WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES' AND status='open';
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-08-CL91-U2-M2-LIVE-EVIDENCE-BEFORE-FOLLOWON'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL91-U2-M2-LIVE-EVIDENCE-BEFORE-FOLLOWON');
INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id='D-2026-10-08-CL91-U2-INTERPRETATION-THREE-EVIDENCES'
AND NOT EXISTS(SELECT 1 FROM decisions_fts WHERE decision_id='D-2026-10-08-CL91-U2-INTERPRETATION-THREE-EVIDENCES');
UPDATE open_items_fts SET
next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES')
WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES';
