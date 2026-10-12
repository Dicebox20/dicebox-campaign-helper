-- User-approved (2026-10-08) N3 state-only branch unlock, no railway teleport authority.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL91-N3-THREE-PROOF-USER-APPROVAL',
 'User approval: N3-to-T3 three-proof logical branch unlock only',
 'conversation','campaign','Explicit user-authored instruction in this conversation, authorizes logical gate implementation only','active',
 'docs/CL91-N3-T3-BRANCH-UNLOCK-CANDIDATE-2026-10-08.md','2026-10-08','N3-three-proof-author-accepted-v001',
 'User approved exactly Departure Board AND Railway Switch Wheel AND Cartography Overlay. Explicitly requires railway teleport installation separate and preserves deferred final player acceptance.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES('D-2026-10-08-CL91-N3-T3-THREE-PROOF-APPROVED',
 'central-lodge-n3-t3-branch-unlock',
 'N3-to-T3 branch logical unlock requires exactly puzzles.n3.departureBoardResolved===true AND puzzles.n3.switchWheelInstalled===true AND puzzles.n3.routeOverlay.resolved===true. On authenticated token entry into existing N3 Branch Railway Region RP1jYOH738xl9hks, the canonical kernel gate sets only puzzles.n3.t3BranchUnlocked=true, idempotently, after those 3 source-authorized states pass. No additional Notice/Item/Actor flags, no Item award, no token transfer, no consume, no route binding, no geometry changes. Continue to use existing mapped board, wheel and overlay behaviors without rewriting them. Player can revisit the branch Region after missing evidence is completed; Cartography Table may need revisiting for last-layer gate event order. Explicitly do not install N3-to-T3 teleport or use quarantined CL50 route installer in this action. Source PREVIEW, exact source hash, one bounded live RegionBehavior creation, independent readback and checkpoint required. Actual in-game player tests deferred until final campaign.',
 'User explicitly approved strict three-proof AND rule. It models route identity, physical switch capability, and completed route interpretation without unapproved extra softlocks. Gate-state creation and cross-scene transport are separate authority boundaries.',
 'campaign','locked','DiceBox Campaign Helper Foreman','SRC-2026-10-08-CL91-N3-THREE-PROOF-USER-APPROVAL',
 'After one live install, source/ledger final verification and eventual player acceptance')
ON CONFLICT(decision_id) DO NOTHING;

UPDATE kb_open_items SET status='in_progress',
 problem='N3-to-T3 missing logical unlock writer: user explicitly approved three-proof AND rule (departureBoardResolved + switchWheelInstalled + routeOverlay.resolved) and authorized guarded source-only implementation. N3 Branch Region RP1jYOH738xl9hks remains untouched until bounded successful PREVIEW/APPLY/VERIFY; N3-to-T3 travel separately blocked by CL50 placement/consent/reentry.',
 next_action='Build source and offline tests for exact canonical kernel gate at N3 Branch Region RP1jYOH738xl9hks. Stage exact no-write preview, create exactly one new enabled tokenEnter RegionBehavior only when 21/202/118/33 and full ledger revision2 source hashes match, no non-GM players connected, authorized Assistant Gamemaster, stable IDs unchanged. Independently read back stored script, 119 behavior roster, ledger still revision2 flag false, Items and all geometry unchanged. Checkpoint before any further live write. Do not install N3-to-T3 travel.',
 evidence_needed='Strict truth table + kernel request field test, authorized exact preflight, one-action create receipt, independent installed source hash and state roster, no player canary until final.',
 source_id='SRC-2026-10-08-CL91-N3-THREE-PROOF-USER-APPROVAL'
WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN' AND status='blocked';

INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id='D-2026-10-08-CL91-N3-T3-THREE-PROOF-APPROVED'
AND NOT EXISTS(SELECT 1 FROM decisions_fts WHERE decision_id='D-2026-10-08-CL91-N3-T3-THREE-PROOF-APPROVED');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN'),
 evidence_needed=(SELECT evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN')
WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN';
