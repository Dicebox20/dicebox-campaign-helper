INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL-SCALE-B2-GRID240-INDEPENDENT-FINAL','B2 Hidden Annex grid-only 240px final Scene readback','verification','campaign','Foundry 14.367 read-only normalized full Scene readback','active',
'work/foundry-playwright-harness/clscale-b2-final-readonly-v001.page.js','2026-10-08','CL-SCALE-B2-240-final-SHA-53e20ace',
'After one authorized Scene grid change autoReposition false, restored original grid and Scene audit _stats exactly reproduce backup source SHA. No player canary.')
ON CONFLICT(source_id) DO NOTHING;
INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL-SCALE-B2-GRID240-INSTALLED',
'central-lodge',NULL,'B2 Hidden Annex gridless grid-size 120 to 240 installed and independently verified',
'Authorized Assistant Gamemaster one Scene.update grid.size from120 to240 in B2 Hidden Annex Scene 5K1uASAARnX8aZhP, explicitly autoReposition:false. Map artwork remains4320x2880, grid.type0 distance5ft. Exact full original scene.toObject backup outputs/foreman-checkpoints/clscale-b2-before-grid240-v001.json. Original full source SHA 9302b0144902eff5223c0904451b72790c7a6864c81b7066e604155f22435db3; after SHA 53e20aceaa543608212bf5e33034a47ea47ddfd34f49d8cef8e0c456f203d581; normalizing only grid size and Scene update metadata matches original exactly. All 22 walls, 10 Regions and 3 lights preserved, no placed Tokens. No-write PREVIEW PASS, APPLY PASS, independent readback PASS, CL90 v011 PASS_WITH_KNOWN_BLOCKERS no failures. Canonical 21 scenes/202 Regions/119 behaviors/33 Items; ledger revision3 SHA e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9 unchanged. M2 grid320 and M3 grid240 retained. CL50 railway landing installations quarantined; no actual player testing performed.',
'campaign','local','active','SRC-2026-10-08-CL-SCALE-B2-GRID240-INDEPENDENT-FINAL',
'CL-SCALE,B2,grid,source-verified,geometry-preserved,no-player-test')
ON CONFLICT(fact_id) DO NOTHING;
UPDATE kb_open_items SET
problem='Author-approved per-interior grid-only calibration continues. M2 grid320, M3 grid240, and B2 Hidden Annex grid240 have separate exact full backups and verified normalized Scene source/geometry conservation. Remaining interior grids require individual audit; M1 contains Ret token, N3 remains120 due narrow door, F2 lacks calibrated door evidence. CL50 landing receipts stale.',
next_action='Checkpoint verified B2. Continue next token-free interior candidate with fresh exact source and ledger capture, no-write PREVIEW, one authorized autoReposition false Scene grid update, independent normalized full source/geometry readback and checkpoint. Preserve ledger revision3 and CL90 v011 until fresh change, no CL50 route installs or player canaries.',
source_id='SRC-2026-10-08-CL-SCALE-B2-GRID240-INDEPENDENT-FINAL'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='in_progress';
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-08-CL-SCALE-B2-GRID240-INSTALLED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL-SCALE-B2-GRID240-INSTALLED');
UPDATE open_items_fts SET problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
