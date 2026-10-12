-- Research-only CL91 N3 candidate; explicitly not a locked approval and no Foundry change.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL91-N3-THREE-PROOF-CANDIDATE',
 'N3 to T3 branch three-proof candidate and current live state inventory',
 'verification','campaign','Read-only exact Foundry RegionBehaviors and canonical ledger; human author choice still pending','active',
 'docs/CL91-N3-T3-BRANCH-UNLOCK-CANDIDATE-2026-10-08.md',
 '2026-10-08','CL91-N3-CANDIDATE-NOT-APPROVED-v001',
 'A design candidate only: Departure Board AND Switch Wheel AND Cartography Overlay. No explicit author decision yet; no installation or transfer permitted. Original N3/T3 PREPARE unavailable at indexed local paths.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL91-N3-THREE-PROOF-POLICY-UNAPPROVED',
 'central-lodge',NULL,'N3 branch unlock three-proof candidate remains unapproved',
 'Read-only Foundry 14.367 N3 scene pHQvDUDlyWZFuNrX has 12 Regions and 11 behaviors. Empty Branch Railway Region RP1jYOH738xl9hks (rect x2310 y2380 w620 h500) has zero RegionBehaviors. Separate Departure Board plate socket writes puzzles.n3.departureBoardResolved, Switch Wheel socket writes puzzles.n3.switchWheelInstalled, and Cartography Table gate writes puzzles.n3.routeOverlay.resolved after three clue layer sockets. Ledger revision2 has all these flags and t3BranchUnlocked=false. T3 to N3 return behavior exists, N3 to T3 outgoing travel is neither approved nor installed. Possible author choice is strict AND of board/wheel/overlay (only), gate state separate from scene travel. All 17 pure-state candidate tests passed; CL90 v007 read-only regression PASS_WITH_KNOWN_BLOCKERS at 21 Scenes/202 Regions/118 behaviors (one disabled)/33 Items, ledger revision2. This does NOT indicate approval or certify gameplay. The explicit N3 prerequisite open item stays blocked pending author decision.',
 'campaign','local','active','SRC-2026-10-08-CL91-N3-THREE-PROOF-CANDIDATE',
 'CL91,N3,T3,branch,proposed-only,not-approved,source-readonly')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items SET
 next_action='AUTHOR CHOICE REQUIRED: approve or revise proposed N3-to-T3 AND gate: departureBoardResolved=true, switchWheelInstalled=true, routeOverlay.resolved=true; no additional Notice/Item-possession flags. The proposed gate only sets t3BranchUnlocked after returning to Branch Railway, never teleports. Source evidence and 17/17 pure-case tests in docs/CL91-N3-T3-BRANCH-UNLOCK-CANDIDATE-2026-10-08.md. If author approves, update roadmap/checklist and lock a distinct KB decision, rebuild, perform guarded preview/install and independent verification. CL50 N3-to-T3 travel remains separate quarantined work.',
 source_id='SRC-2026-10-08-CL91-N3-THREE-PROOF-CANDIDATE'
WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN' AND status='blocked';

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-CL91-N3-THREE-PROOF-POLICY-UNAPPROVED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL91-N3-THREE-PROOF-POLICY-UNAPPROVED');
UPDATE open_items_fts
SET next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN')
WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN';
