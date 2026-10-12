-- Central Lodge interior token-to-room calibration read-only evidence, 2026-10-08.
-- This does NOT approve grid override values, image resizing, or runtime mutation.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL-SCALE-INTERIOR-BASELINE',
 'Central Lodge interior grid and door/Region scale read-only calibration',
 'verification','campaign',
 'Exact Foundry v14.367 Scene/Grid/Wall/Region source snapshot; earlier battlemap-120 authoring contract','active',
 'docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md',
 '2026-10-08','CL-SCALE-interior-calibration-no-write-v001',
 '21 Scenes verified gridless 4320x2880, grid size120, distance5ft; 14 interior candidates measured with smallest doors and Region spans. Candidate grid sizes are NOT visual calibration decisions or user-approved migrations.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL-SCALE-INTERIOR-BASELINE-AUDITED',
 'central-lodge',NULL,'All 21 Central Lodge Scene grids share 120px/5ft despite interior scale mismatch',
 'Source read-only Foundry 14.367 all 21 installed Central Lodge Scene images measure 4320x2880 with grid.type 0 (gridless), grid.size 120, grid.distance 5 feet and zero padding. User reports visibly tiny Actor tokens against oversized interior rooms. Existing authored battlemap-120 standard derives pixel dimensions from logical square dimensions, with lodge interior exception only when PREPARE explicitly chooses different logical footprint. Wall door sizes vary widely: M2 minimum 530px, M1 720px, U2 210px, N3 160px. A single larger grid across all Scenes would break narrow passages. Report enumerates 14 indoor candidates, 13 tentative grid size choices with >=15% simple door/Region clearance, F2 still unknown, N3 suggested unchanged. Grid-only Scene changes preserve original pixel geometry but deliberately override battlemap-120, while resampling image plus every geometric Document preserves 120px profile but needs exact coordinated transformation. Token visual texture scale must not be used to compensate. CL50 route landing previews must be invalidated and rerun after any relevant Scene change. No Foundry state was modified in this audit.',
 'campaign','local','active','SRC-2026-10-08-CL-SCALE-INTERIOR-BASELINE',
 'CL-SCALE,scene-grid,token-calibration,120px,gridless,art-footprint,read-only')
ON CONFLICT(fact_id) DO NOTHING;

INSERT INTO kb_open_items(item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id)
VALUES('O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION','implementation',
 'Approve an interior map scale method and first M2 pilot',
 'User identified undersized 1x1 tokens against interior artwork. Existing 21 Scenes uniformly use gridless 4320x2880 and grid.size=120px/5ft despite varying doorway and room dimensions. Original battlemap-120 profile forbids adjusting token art as a physical-scale repair and requires logical Scene dimensions from PREPARE. A per-scene grid override changes the authoring profile; keeping grid120 requires new asset sizes plus full pixel-coordinate transformation. Neither approach nor exact pilot value has been accepted yet. CL50 safe route placement depends on calibrated token footprint.',
 'Ask author to choose M2 per-Scene grid-only pilot (candidate grid.size 320px/5ft; preserves Scene dimensions, walls, Region and Tile coordinates) versus strict battlemap-120 pixel-resized M2 Scene+all geometry (candidate 1620x1080 with exact 0.375 transform). After approval, record locked choice, strict baseline/hashes, offline clearance and actor-position tests, no-write PREVIEW, one guarded Scene change, independent readback, and checkpoint. Do not adjust user Tokens automatically or run final player canary. Hold CL50 route installers until affected Scene footprints retested.',
 'Exact original profile and Scene art/source hashes, author-selected pilot, before/after expected token-to-room visual approval, all affected Region/wall/Item/Actor invariants, affected CL50 landing clearance rechecks, one authorized GM apply receipt and independent final verification.',
 'P1','blocked','DiceBox Campaign Helper Foreman','SRC-2026-10-08-CL-SCALE-INTERIOR-BASELINE')
ON CONFLICT(item_id) DO NOTHING;

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-CL-SCALE-INTERIOR-BASELINE-AUDITED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL-SCALE-INTERIOR-BASELINE-AUDITED');
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'
AND NOT EXISTS(SELECT 1 FROM open_items_fts WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION');
