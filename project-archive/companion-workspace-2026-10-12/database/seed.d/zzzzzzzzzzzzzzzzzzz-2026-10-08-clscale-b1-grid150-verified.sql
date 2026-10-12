-- B1 Cellar grid-only source-verified calibration, 2026-10-08.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL-SCALE-B1-GRID150-INDEPENDENT-FINAL',
 'B1 Cellar and Utility Basement grid-only 150px final Scene reread','verification','campaign',
 'Foundry 14.367 independent normalized full Scene source and ledger readback','active',
 'work/foundry-playwright-harness/clscale-b1-final-readonly-v001.page.js',
 '2026-10-08','CL-SCALE-B1-grid150-final-ec8637a2',
 'One authorized Assistant Gamemaster Scene grid update autoReposition false. Exact full original Scene backup and independent normalized full source readback. No player playtest.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL-SCALE-B1-GRID150-INSTALLED',
 'central-lodge',NULL,'B1 Cellar gridless grid size 120 to 150 source-installed and verified',
 'Authorized one-Scene grid-only update B1 Cellar and Utility Basement Scene 0CSBwzcszPKyaB8u: grid.size from 120 to 150 pixels per 5ft, gridless type0, original 4320x2880 map image and pixel geometry, with autoReposition:false. Full original Scene.toObject JSON snapshot outputs/foreman-checkpoints/clscale-b1-before-grid150-v001.json. Original Scene SHA c23fd9e2736cd7dbde05ade5480d078f4b760756b6988dd1fd4d048bb9fb232c, new source SHA ec8637a25258c1e3d207b0f4f4d31aa7d40da316599e0184618bcebb67c95c20. Normalization of grid size and audit _stats from new source reproduces original exact SHA, independently verified. All 24 Walls 11 Regions 3 Lights original coordinates and original Item/puzzle sources intact, zero placed Tokens. No-write exact source/canonical roster/ledger PREVIEW PASS, bounded live APPLY PASS, independent final readback PASS, CL90 v012 PASS_WITH_KNOWN_BLOCKERS zero unexpected failures. Canonical 21 scenes, 202 Regions, 119 behaviors, 33 Items; ledger revision3 SHA e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9 unchanged. Existing M2 grid320, M3 grid240, B2 grid240 preserved. CL50 railway installer quarantined, final gameplay test deferred.',
 'campaign','local','active','SRC-2026-10-08-CL-SCALE-B1-GRID150-INDEPENDENT-FINAL',
 'CL-SCALE,B1,grid,source-verified,wall-preserved,no-player-test')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items SET
 problem='User-approved grid-only interior calibration continues. Four interior Scenes now separately backed up and independently source-verified: M2 320px, M3 240px, B2 240px, B1 150px. Remaining interiors require distinct calibration. M1 has Ret token needing center/path safety; N3 narrow doors remain 120; F2 lacks reliable visual scale. CL50 landing receipts stale.',
 next_action='Checkpoint B1 before any further live update. Continue next token-free interior with source-first backup, exact canonical ledger/roster no-write PREVIEW, single guarded Assistant Gamemaster grid-only Scene.update autoReposition:false, independent normalized full Scene source readback and separate checkpoint. CL50 railway installers quarantined; no player gameplay canary.',
 source_id='SRC-2026-10-08-CL-SCALE-B1-GRID150-INDEPENDENT-FINAL'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='in_progress';

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-08-CL-SCALE-B1-GRID150-INSTALLED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL-SCALE-B1-GRID150-INSTALLED');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
