-- CL-SCALE author-approved 2026-10-08 source-only acceptance before Foundry change.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL-SCALE-AUTHOR-GRID-APPROVAL',
'Author approval of grid-only calibration and delegated per-interior choice',
'conversation','campaign','User explicit instruction in current Foreman conversation','active',
'docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md','2026-10-08','CL-SCALE-authorized-grid-20261008-v001',
'User requested grid size, then explicitly said permission is not needed for every map and Foreman may calibrate all as appropriate. User approval does not waive exact preflight, one live write per checkpoint or preservation of foreign play state.')
ON CONFLICT(source_id) DO NOTHING;
INSERT INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES('D-2026-10-08-CL-SCALE-INTERIOR-GRID-PROGRAM',
 'central-lodge-interior-grid-calibration',
 'Author approves per-Scene grid.size correction, retains gridless grid.type=0, distance=5 feet, original 4320x2880 pixels, wall/Region/Tile/light/audio/actor/Item/ledger state. Foreman may choose individual interior grid sizes without obtaining user approval for each, but must use measured visual/door/Region evidence, versioned snapshot, accepted roadmap/checklist/KB, no-write exact Scene/ledger preflight, single-scene guarded Assistant Gamemaster UPDATE explicitly autoReposition=false, independent geometry+State+Script readback, and durable checkpoint before next live Scene update. First M2 pilot grid.size120→320. Preserve actual runtime ledger revision3 M1 notice, not old exact revision2. N3 remains120 due 160px narrow door and CL50 route safety; F2 remains uncalibrated until visual evidence. CL50 route installers and stale landing receipts remain quarantined until revalidation. No real-player canary before final campaign.',
 'User explicitly selected grid-size method and delegated rest. Scene image resize can reposition placeables, while grid-only Scene update can preserve pixel coordinates when autoReposition is explicitly false and independently checked. V14 Scene._preUpdate source calls repositionObjects only when options.autoReposition; _onUpdate canvas redraws for grid.size. Independent reread still mandatory.',
 'campaign','locked','DiceBox Campaign Helper Foreman','SRC-2026-10-08-CL-SCALE-AUTHOR-GRID-APPROVAL',
 'After one-scene M2 source readback and future visual calibration')
ON CONFLICT(decision_id) DO NOTHING;
UPDATE kb_open_items SET status='in_progress',
 problem='Author authorized grid-only per-Scene interior calibration and delegated target value selection to Foreman. 21 Scene grids inherited 120px/5ft, despite oversized interiors. Exact M2 pilot 320px/5ft must pass one-scene preflight and independent wall/Region/lighting source readback. F2 still lacks art evidence and N3 120 is retained due door clearance; CL50 landing tests invalid until rechecked.',
 next_action='Perform accepted exact M2 grid-only guarded update grid.size120→320 with autoReposition=false after backed-up scene.toObject, no active players, authorized Assistant GM, current revision3 ledger SHA and source/geometry fingerprints verified; no other Scene, Token, Wall, Region, behavior, Item, or light write. Independently verify coordinates and source, checkpoint. Continue approved next interior as separate bounded work unit.',
 evidence_needed='Full M2 source backup SHA, wall/Region/light/notes geometry exact before/after, Scene metadata and type/distance unchanged, ledger SHA unchanged, 21/202/119/33 roster unchanged, visual calibration to follow with user end-only gameplay testing.',
 source_id='SRC-2026-10-08-CL-SCALE-AUTHOR-GRID-APPROVAL'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='blocked';
INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id='D-2026-10-08-CL-SCALE-INTERIOR-GRID-PROGRAM'
AND NOT EXISTS(SELECT 1 FROM decisions_fts WHERE decision_id='D-2026-10-08-CL-SCALE-INTERIOR-GRID-PROGRAM');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
 evidence_needed=(SELECT evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
