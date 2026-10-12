-- CL-SCALE U1 independently verified source receipt, 2026-10-08.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL-SCALE-U1-GRID180-INDEPENDENT-FINAL','U1 Family and Guest Rooms 180px grid-only independent Foundry verification','verification','campaign','Foundry 14.367 Assistant Gamemaster independent complete Scene/ledger normalized readback','active',
'work/foundry-playwright-harness/clscale-u1-final-readonly-v001.page.js','2026-10-08','CL-SCALE-U1-grid180-final-d4f032b1',
'Only grid.size updated 120 to 180 with autoReposition:false after exact original backup and no-write preview. Source-level and geometry-level evidence only, no gameplay or visual-fit canary.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL-SCALE-U1-GRID180-INSTALLED','central-lodge',NULL,'U1 Family and Guest Rooms gridless 120 to 180 source-installed and independently verified',
'Foundry 14.367 dnd5e 5.3.3 the-lost-mine-of-phandalin exact authorized Assistant Gamemaster bounded U1 Scene if9iWDRjSwI87EeX single grid.size update 120 to 180 with autoReposition:false and zero active non-GM players. Original 4320x2880 gridless image, grid.distance 5ft, all 22 Walls, 10 Regions, 5 AmbientLights and zero Tokens preserved. Five door widths 240/260/260/240/250px and smallest Region span 340px passed conservative 15% clearance gate for 180px. Exact full original Scene.toObject snapshot outputs/foreman-checkpoints/clscale-u1-before-grid180-v001.json source SHA256 1b2413041b0c09f58c82613850e66ce078a356802a7f508d5527182b905c7201. Guarded no-write preview PASS, one APPLY PASS, independent final readback PASS after source SHA256 d4f032b127a26b8ea0beb9263a815179b0eebc5816defd74277a09669328ee0b. Restoring only approved grid and Scene audit _stats yields exact original complete source SHA. No changes to current revision3 campaign ledger SHA256 e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9, scripts, Items or other Scenes. Canonical 21 Scenes/202 Regions/119 behaviors including one disabled Notice/33 Items verified by CL90 v013 PASS_WITH_KNOWN_BLOCKERS zero unexpected failures. CL50 railway installers remain quarantined, no final player test, no story/audio or teleport triggers.',
'campaign','local','active','SRC-2026-10-08-CL-SCALE-U1-GRID180-INDEPENDENT-FINAL','CL-SCALE,U1,grid-only,geometry-preserved,no-player-test')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items SET
 problem='Seven interiors now independently source backed up and verified: M2=320 M3=240 B2=240 B1=150 C1=240 C2=160 U1=180. Remaining rooms still need separate guards. M1 contains Ret token, N3 narrow doors remain 120, F2 needs art evidence, CL50 transfer placement evidence is stale after grid changes.',
 next_action='Checkpoint U1 source-verified before another live Scene write. Next bounded candidate U2 Servants and Attic Scene PVf6Gbrv9HbB88uZ grid120 to 160, conditional on fresh executor, no nonGM players, wall/Region clearance, whole Scene backup, exact no-write preview and sovereign ledger plus U2 servant-history behavior/source checks. If clear, one Scene.update autoReposition:false, independent entire Scene and campaign reread, CL90, KB and checkpoint. Keep CL50 quarantined; gameplay testing deferred.',
 source_id='SRC-2026-10-08-CL-SCALE-U1-GRID180-INDEPENDENT-FINAL'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='in_progress';

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-08-CL-SCALE-U1-GRID180-INSTALLED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL-SCALE-U1-GRID180-INSTALLED');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
