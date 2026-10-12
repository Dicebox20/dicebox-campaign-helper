-- N3 author-approved logical unlock source-installed, real player acceptance and teleport not done.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL91-N3-THREE-PROOF-INSTALLED-FINAL',
 'N3 three-proof hidden spur logical gate final Foundry source reread',
 'verification','campaign','Independent exact Foundry v14.367 post-install source/ledger/roster receipt','active',
 'work/foundry-playwright-harness/cl91-n3-three-proof-final-readonly-v001.page.js','2026-10-08',
 'CL91-N3-installed-SHA-3ae5572a2e6df1e2',
 'One new RegionBehavior only. Exact source SHA 3ae5572a2e6df1e2a2611630163b90e73450ba400acd0a9d38ab4d4a2e6d4cbd. No teleport, gameplay canary or ledger progression.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL91-N3-THREE-PROOF-LOGICAL-GATE-INSTALLED',
 'central-lodge',NULL,'N3 approved three-proof branch logic installed and source-verified',
 'One authorized Assistant Gamemaster create in N3 Branch Railway Region RP1jYOH738xl9hks installed enabled RegionBehavior yikneH7tFfD5zsr6, stable ID dbx:central-lodge:n3:behavior:t3-branch-three-proof-unlock-v001, tokenEnter, stored source SHA 3ae5572a2e6df1e2a2611630163b90e73450ba400acd0a9d38ab4d4a2e6d4cbd. It invokes canonical kernel gate with exactly the author-approved prerequisites puzzles.n3.departureBoardResolved===true, puzzles.n3.switchWheelInstalled===true, puzzles.n3.routeOverlay.resolved===true to write only puzzles.n3.t3BranchUnlocked=true, with no Item granting, token teleport, geometry changes or extra Notice requirements. Staged source offline 19/19 PASS, exact live no-write PREVIEW PASS, one bounded create APPLY PASS, independent source/hash/Region/ledger final read-only PASS, CL90 v008 PASS_WITH_KNOWN_BLOCKERS. Live totals 21 Scenes/202 Regions/119 behaviors (one M2 duplicate Notice disabled)/33 Items. Ledger revision2 unchanged, SHA 7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7; all N3 three proof states and t3BranchUnlocked false pending actual play. Existing N3 plate/wheel/overlay, M1 clock, M2 portrait, U2 interpretation, shared kernel and T3-to-N3 return preserved. N3-to-T3 travel not installed and remains CL50 safety-blocked; no player acceptance performed.',
 'campaign','local','active','SRC-2026-10-08-CL91-N3-THREE-PROOF-INSTALLED-FINAL',
 'N3,T3,branch,CL91,source-installed,approved,not-teleport,not-player-tested')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_metadata SET value='119' WHERE key='central_lodge_region_behavior_count' AND value='118';
UPDATE kb_open_items SET
 status='closed',
 problem='Resolved source-only N3-to-T3 logical unlock orphan: explicit author-approved strict three-proof AND gate is installed and independently verified in exact N3 Branch Railway Region, with no travel or gameplay progress.',
 next_action='Do not replay the installed N3 gate. Separate live-player gate acceptance remains pending for end-of-campaign testing; separate CL50 N3-to-T3 travel installer remains safety quarantined. See O-2026-10-08-CL91-N3-PLAYER-ACCEPTANCE.',
 evidence_needed='Installed gate source SHA, independent 119-behavior final receipt, CL90 v008 PASS, future player gate and transit receipts in separate items.',
 source_id='SRC-2026-10-08-CL91-N3-THREE-PROOF-INSTALLED-FINAL'
WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN' AND status='in_progress';

INSERT INTO kb_open_items(item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id)
VALUES('O-2026-10-08-CL91-N3-PLAYER-ACCEPTANCE','certification',
 'User final-playtest: N3 three-proof branch gate and later safe N3 to T3 transfer',
 'N3 branch gate was installed and source-verified, but no real player has completed or failed each proof combination. The state unlock and route transfer are deliberately separate. One client-owned GM executor and cross-Region state timing remain unverified in actual gameplay; CL50 N3-to-T3 teleport was not installed.',
 'During user final campaign test, check all eight proof combinations at branch entrance, repeat-entry state idempotency, missing Item conditions and Cartography revisit after last socket, ledger revision and token owner. After a separate reviewed and approved CL50 outgoing-route installer, test fixed-token-size destination, GM consent, no loop/reentry, disconnect and safe fallback. Never use the installed logical gate as permission to silently teleport.',
 'Live player/GM event receipts, authoritative ledger source rereads after permitted actions, zero foreign data drift, separate CL50 transportation acceptance and end-only user sign-off.',
 'P2','open','DiceBox Campaign Helper Foreman','SRC-2026-10-08-CL91-N3-THREE-PROOF-INSTALLED-FINAL')
ON CONFLICT(item_id) DO NOTHING;

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-CL91-N3-THREE-PROOF-LOGICAL-GATE-INSTALLED'
AND NOT EXISTS (SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL91-N3-THREE-PROOF-LOGICAL-GATE-INSTALLED');
UPDATE open_items_fts
SET problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN'),
 evidence_needed=(SELECT evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN')
WHERE item_id='O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN';
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
WHERE item_id='O-2026-10-08-CL91-N3-PLAYER-ACCEPTANCE'
AND NOT EXISTS(SELECT 1 FROM open_items_fts WHERE item_id='O-2026-10-08-CL91-N3-PLAYER-ACCEPTANCE');
