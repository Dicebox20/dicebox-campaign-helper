-- CL-SCALE M2 one-Scene source/geometry-preserving grid-size pilot final evidence.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL-SCALE-M2-GRID320-INDEPENDENT-FINAL',
'M2 Scene grid-only 120 to 320 completed with exact source/geometry conservation',
'verification','campaign','Exact Foundry v14.367 independent read-only Scene and ledger check','active',
'work/foundry-playwright-harness/clscale-m2-grid320-final-readonly-v001.page.js','2026-10-08',
'CL-SCALE-M2-grid320-final-scene-e9663751',
'One authorized Assistant Gamemaster Scene.update grid.size320 with autoReposition false. Full before toObject backup in outputs/foreman-checkpoints, normalized delta source/geometry and unchanged runtime ledger independently verified; no gameplay canary.')
ON CONFLICT(source_id) DO NOTHING;
INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL-SCALE-M2-320-INSTALLED-VERIFIED',
'central-lodge',NULL,'M2 gridless Scene 320px per 5ft applied with all pixel geometry preserved',
'Foundry Scene JZkxX6lUQe8Nc8xJ grid.size updated 120 to 320 only, grid.type0 grid.distance5 ft, original width4320 height2880 and padding0, original artwork intact. Full original Scene source backup outputs/foreman-checkpoints/clscale-m2-before-grid320-v001.json; source SHA before c96c3026a7b5ae152871ceb5191770f3474fd9410958a1701bcff4c3c34d72d5, after e9663751ca317c5922b4ce9ae97d2c4cda1b84f79fa23599b7a56d6140f3d305, normalizing grid.size and known _stats keys exactly restores before SHA. Independent full geometry SHA e6790e102c446d20f277723855465145d588190efb16f8f5bd56bb3ca9f302e0 before/after, 12 Wall endpoints 15 Region shape collections and 6 lights untouched. No placed M2 Tokens. Other 20 Scene grid sizes still120. Canonical world 21 Scenes 202 Regions 119 RegionBehaviors (one disabled) 33 Items and ledger revision3 SHA e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9 unchanged, including new M1 notice. CL90 v009 PASS_WITH_KNOWN_BLOCKERS zero unexpected failures. Actual visual comparison/pathing and eventual player gameplay canary still pending. CL50 route transfer position receipts must be revalidated.',
'campaign','local','active','SRC-2026-10-08-CL-SCALE-M2-GRID320-INDEPENDENT-FINAL',
'CL-SCALE,M2,grid-size,source-verified,no-wall-movement,ledger3');
UPDATE kb_open_items SET
 problem='User-approved Scene-grid calibration program underway. M2 pilot successfully updated grid.size 120→320 with full source/geometry and ledger preservation and independent final verification. Remaining interior Scenes require separate bounded calibration and clearance testing; N3 stays120 due narrow door, F2 lacks art calibration, M1 contains Ret token. CL50 landing receipts remain stale in affected Scene coordinates.',
 next_action='Checkpoint M2 success before next live write. Select next interior with no placed Tokens and measured door/Region clearance (e.g., B2 at 240px or M3 at 240px). Stage original full scene backup, strict independent baseline and no-write PREVIEW, one bounded Scene grid-size update with autoReposition false, independently verify full scene diff normalized for _stats and grid, ledger unchanged, scene roster invariant, then checkpoint. Keep F2 and actual player tests deferred; CL50 routes quarantined.',
 evidence_needed='Per-scene source backups, before/after full hashes, stable wall/Region shapes, known grid pixel size and visual screenshot reference, authorized GM 1-action receipts; ledger snapshot and CL90 current baseline after each.',
 source_id='SRC-2026-10-08-CL-SCALE-M2-GRID320-INDEPENDENT-FINAL'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='in_progress';
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-08-CL-SCALE-M2-320-INSTALLED-VERIFIED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL-SCALE-M2-320-INSTALLED-VERIFIED');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
 evidence_needed=(SELECT evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
