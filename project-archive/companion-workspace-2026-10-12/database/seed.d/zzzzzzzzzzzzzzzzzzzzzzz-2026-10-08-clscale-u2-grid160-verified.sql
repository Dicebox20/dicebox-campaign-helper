-- CL-SCALE U2 independently verified source receipt, 2026-10-08.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL-SCALE-U2-GRID160-INDEPENDENT-FINAL',
'U2 Servants Nursery and Attic grid160 independent Foundry normalized source verification',
'verification','campaign','Authorized Foundry v14.367 Assistant Gamemaster exact Scene/ledger final readback','active',
'work/foundry-playwright-harness/clscale-u2-final-readonly-v001.page.js',
'2026-10-08','CL-SCALE-U2-grid160-final-3a2b935e',
'One grid.size only update with autoReposition:false after original snapshot and guarded preview. Story RegionBehavior sources included in complete source hash. Gameplay and visual-fit untested.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL-SCALE-U2-GRID160-INSTALLED','central-lodge',NULL,
'U2 Servants Quarters Nursery Attic gridless 120 to 160 source-installed and independently verified',
'Authorized Assistant Gamemaster completed one bounded Scene.update grid.size from120 to160 with autoReposition:false for U2 Scene PVf6Gbrv9HbB88uZ, Foundry14.367 dnd5e5.3.3 world the-lost-mine-of-phandalin, no non-GM players and no Tokens. Exact source backup outputs/foreman-checkpoints/clscale-u2-before-grid160-v001.json original entire Scene SHA256 7704c598700d576af0548dc9b57f0753038356627f066e04e13029d6b45484cb. All eight door spans250/310/270/250/250/210/250/250px and minimum Region span420px pass conservative grid160 clearance. No-write exact PREVIEW PASS, single bounded APPLY PASS, independently reread entire Scene and normalized only grid.size and expected _stats back to exact original SHA. New source SHA256 3a2b935e13c3b8785072e53a3f4c16598d411acca9d64300184c150a0c4c0e3d. All 28 Walls, 11 Regions, 3 Lights, 4320x2880 original image, Region scripts including servant-history behavior J11ZvQh4lqzEsvRi and interpretation behavior WOiGF1WlGZM3fO8I retained. U2 servant-history noticed and interpreted flags remain false. Current sovereign ledger revision3 SHA256 e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9 unchanged. Canonical 21 Scenes 202 Regions 119 behaviors including one intentionally disabled M2 Notice and 33 Items, CL90 v013 PASS_WITH_KNOWN_BLOCKERS zero unexpected failures. No CL50 installation, no audio/teleport triggers, no final player/GM gameplay or visual-fit acceptance.',
'campaign','local','active','SRC-2026-10-08-CL-SCALE-U2-GRID160-INDEPENDENT-FINAL',
'CL-SCALE,U2,grid-only,script-preserved,puzzle-state-preserved,no-player-test')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items SET
 problem='Eight interiors individually backed up/source-verified after grid-only calibration: M2=320 M3=240 B2=240 B1=150 C1=240 C2=160 U1=180 U2=160. Pending F1 has installed travel and needs dedicated landing recheck, N1/N2 are CL50 railway mouths with stale footprints, M1 contains Ret token, N3 door160 stays grid120, F2 lacks adequate art evidence.',
 next_action='Checkpoint U2 before any additional Scene write. Next read-only F1 Infernal Threshold Scene La9krMOMBhAhDLi6 candidate grid120 to320 assessment: inspect door/Region/teleport arrival geometry and current authorized executor, puzzle ledger and source. Do not install until independent arrival-clearance impact and coordinate invariants are understood; N1/N2 station changes need fresh CL50 route review. No CL50 installers; final gameplay testing remains deferred.',
 source_id='SRC-2026-10-08-CL-SCALE-U2-GRID160-INDEPENDENT-FINAL'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='in_progress';

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-08-CL-SCALE-U2-GRID160-INSTALLED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL-SCALE-U2-GRID160-INSTALLED');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
