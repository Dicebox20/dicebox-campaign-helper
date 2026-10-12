-- M3 Scene grid calibration, independently source verified, 2026-10-08.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL-SCALE-M3-GRID240-INDEPENDENT-FINAL',
 'M3 Kitchen grid-only 120 to 240 final readback', 'verification','campaign',
 'Foundry v14.367 independent Scene source and ledger readback','active',
 'work/foundry-playwright-harness/clscale-m3-final-readonly-v001.page.js',
 '2026-10-08','CL-SCALE-M3-240-final-SHA-6604bdf5',
 'Dedicated Assistant Gamemaster Scene.update grid.size240 autoReposition:false. Normalized stored Scene source matches pre-write exact toObject; 14 walls, 10 Regions and 4 lights conserved, no game play canary.')
ON CONFLICT(source_id) DO NOTHING;
INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL-SCALE-M3-GRID240-INSTALLED',
 'central-lodge',NULL,'M3 Kitchen grid-only 240px / 5-foot calibration installed',
 'Authorized single-scene edit M3 Kitchen Scene LXTA8mx1rJ2L6e2J gridless grid.size120→240 with autoReposition:false; original 4320×2880 map image, 5ft distance, all 14 Walls 10 Regions and 4 Lights, all puzzle scripts and content preserved. Source before SHA ffdbd64f0df881239e407c1d45fef68a655698546837a50f30b7fd6255efec8f, after SHA 6604bdf528f9e6609f3fa2b53c94c1c49e5ba679f0dd90c0f2e9c32cf86eacc6; normalized full Scene source (only grid size and _stats audit time/actor restored) exactly matches original. Full backup outputs/foreman-checkpoints/clscale-m3-before-grid240-v001.json. Read-only PREVIEW PASS, one bounded APPLY PASS and independent final readback PASS. Canonical world 21 Scenes, 202 Regions, 119 behaviors, 33 Items and current revision3 ledger SHA e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9 unchanged. CL90 v010 PASS_WITH_KNOWN_BLOCKERS zero failures. M2 remains grid320, remaining 19 Scenes unchanged120 as of M3 final; visual/gameplay acceptance deferred. CL50 travel installers quarantined until landing rechecks.',
 'campaign','local','active','SRC-2026-10-08-CL-SCALE-M3-GRID240-INDEPENDENT-FINAL',
 'CL-SCALE,M3,grid-only,source-verified,geometry-unchanged,no-gameplay-test')
ON CONFLICT(fact_id) DO NOTHING;
UPDATE kb_open_items SET
 problem='User-approved grid-only interior calibration continues: M2 120→320 and M3 120→240 installed with individually backed-up, independently verified pixel geometry and revision3 ledger unchanged. Other interior candidate Scenes remain; Ret token in M1 requires safe center handling, narrow N3 and unmeasured F2 require special review. CL50 railway landing tests are stale.',
 next_action='Checkpoint verified M3 correction. Continue B2 Hidden Annex (or next token-free interior) source-first: exact baseline full scene backup, fresh revision3 ledger and canonical roster check, no-write preview, one guarded Scene.update grid.size only autoReposition false, independent normalized source/geometry readback and checkpoint. Re-evaluate affected CL50 travel paths only after calibrations; no gameplay test until final.',
 source_id='SRC-2026-10-08-CL-SCALE-M3-GRID240-INDEPENDENT-FINAL'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='in_progress';
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-08-CL-SCALE-M3-GRID240-INSTALLED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL-SCALE-M3-GRID240-INSTALLED');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
