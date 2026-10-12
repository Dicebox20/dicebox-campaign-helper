-- C1 Hidden Chapel user-approved grid-only calibration, independent Foundry readback 2026-10-08.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL-SCALE-C1-GRID240-INDEPENDENT-FINAL',
 'C1 Hidden Chapel grid-only 240px final Scene readback',
 'verification','campaign','Foundry 14.367 independent normalized full Scene and sovereign ledger readback','active',
 'work/foundry-playwright-harness/clscale-c1-final-readonly-v001.page.js',
 '2026-10-08','CL-SCALE-C1-grid240-final-80ce2a89',
 'One authorized Assistant Gamemaster Scene grid update with autoReposition false, exact backup and independent full source/geometry verification; no gameplay testing.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL-SCALE-C1-GRID240-INSTALLED',
 'central-lodge',NULL,'C1 Hidden Chapel gridless 120 to 240 pixels per 5 feet installed and source verified',
 'Authorized Assistant Gamemaster single-Scene grid-only correction C1 Hidden Chapel / Shrine of Asmodeus Scene EDdktL7VUihbpKe9: grid.size 120→240 px per 5ft, grid.type0, original 4320x2880 pixels with autoReposition:false. Complete pre-update Scene.toObject backup outputs/foreman-checkpoints/clscale-c1-before-grid240-v001.json with original SHA 664816c5ff2c42521682f9bcdc5ec5ac7b1e52cc5760a75174f84d5c538d3fc1; new source SHA 80ce2a899ad5304103c6e14b8b84ad4b3fc6d9e8962534990890489df82d3c7a. Independent source readback and normalization restoring only grid.size and Scene _stats reproduces exact original SHA. All 21 Walls 10 Regions 3 Lights, original puzzle scripts and all other Scene data identical, no placed tokens. Guarded no-write PREVIEW PASS, bounded APPLY PASS, independent final verifier PASS, CL90 v013 PASS_WITH_KNOWN_BLOCKERS with zero failures. Canonical 21 Scenes/202 Regions/119 behaviors/33 Items, ledger revision3 SHA e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9 unchanged. Previously verified M2 320, M3 240, B2 240 and B1 150 remain. No CL50 railway installer nor final gameplay test.',
 'campaign','local','active','SRC-2026-10-08-CL-SCALE-C1-GRID240-INDEPENDENT-FINAL',
 'CL-SCALE,C1,grid-only,geometry-preserved,source-verified,no-player-test')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items SET
 problem='User-approved grid-only interior calibration continues. Five interiors now independently backed up and verified: M2 grid320, M3 grid240, B2 grid240, B1 grid150, C1 grid240. Remaining Scenes require distinct safeguards; M1 contains Ret token needing center/path safety, N3 narrow doors remain120, F2 needs art calibration. CL50 landing receipts stale for affected Scene grids.',
 next_action='Checkpoint source-verified C1 before any further live Scene write. Continue C2 Cult Undercroft candidate 120→160 with exact no-token/source/door/Region preflight, full backup, one guarded grid-only update and independent normalized source/ledger readback, CL90 updated regression and new checkpoint. Keep CL50 quarantined and player gameplay testing deferred.',
 source_id='SRC-2026-10-08-CL-SCALE-C1-GRID240-INDEPENDENT-FINAL'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='in_progress';

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-CL-SCALE-C1-GRID240-INSTALLED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL-SCALE-C1-GRID240-INSTALLED');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
