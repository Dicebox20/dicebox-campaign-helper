-- 2026-10-09: Author-reviewed F2 visual 240px source install with expected derived Region membership.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-09-CL-SCALE-F2-GRID240-INDEPENDENT-FINAL',
'F2 Final Summoning Chamber 240px grid-only independent final source and derivation receipt',
'verification','campaign','Authorized Foundry Assistant Gamemaster independent readback and corrected Unicode complete original source','active',
'outputs/foreman-checkpoints/clscale-ref-f2-grid240-v001-original-source-recovered.json',
'2026-10-09','CL-SCALE-F2-final-5ad191d4',
'Initial final source comparison flagged a derived token Region-membership change. Independently proven to result from changed token footprint entering behavior-free F2 arrival Region. Original full browser source SHA normalized exactly, no retry. Source-level not gameplay.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-09-CL-SCALE-F2-GRID240-INSTALLED','central-lodge',NULL,
'F2 Final Summoning Chamber grid120 to240 installed with independent expected derived Region-membership verification',
'Owner accepted visually. Foundry Scene HWitOe1wSid7MZ1y gridless original 120px per5ft to240px per5ft one authorized guarded Assistant Gamemaster Scene.update grid.size240 autoReposition:false. No active nonGM players, 1x1 Meow reference token ID0bla5bPSctNDRT6s x2101 y2267 remained unchanged. F2 arrival Region pplHOCmUZOqFymOy rectangle x1680 y2350 960x500 allows candidate1x1 240 and 2x2 480, tested 625 out of 625 sampled points no Wall intersections. Full source backup outputs/foreman-checkpoints/clscale-ref-f2-grid240-v001-before.json included Windows cp1252 encoding of source names, so independent normalized entire full Scene recovered correct Unicode original to outputs/foreman-checkpoints/clscale-ref-f2-grid240-v001-original-source-recovered.json, verified exact browser pre-grid original source SHA f2b20ebe6b1ccd788fd77f16f8a6887459a978a968259d838c2902aa4fd04680. Guarded no-write PREVIEW PASS and one APPLY PASS. Independent final initially BLOCKED_DRIFT until identified automatic token._regions membership from empty to F2 arrival Region IDpplHOCmUZOqFymOy after grid resizing, arrival Region contains zero behaviors; normalizing only intended grid/audit fields and this exactly identified derived membership restores entire original source SHA. Final stable full Scene SHA5ad191d492195bf227bb099d9b356992aca44fe6d884ac940e085db8c2342639. All43 Walls,8 Regions,8 AmbientLights, art and 1 reference token retained. Sovereign ledger revision13 SHA ec3f1a02887b80a342653681d217d357f7bb7f5b44fa436555d57bf12c44cfd4 unchanged. CL90 v014 PASS_WITH_KNOWN_BLOCKERS zero failures. No CL50 route install or teleport, no real player gameplay; F1 arrival still unsafe at 320 and 2x2 at240.',
'campaign','local','active','SRC-2026-10-09-CL-SCALE-F2-GRID240-INDEPENDENT-FINAL',
'clscale,f2,grid240,verified,derived-region-membership,token-preserved,no-player-test')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items SET
 problem='Eleven calibrated interior Scenes individually full-backed-up and independently readback source verified: M2 320 M3 240 B2 240 B1 150 C1 240 C2 160 U1 180 U2 160 N1 150 N2 160 F2 240. F2 token membership automatically changed to behavior-free arrival Region, independently accounted in entire source SHA. M1 is already grid320 with protected Ret; N3 remains120 narrow door. Cleanup of measuring actor Region-trigger records source-verified; current sovereign ledger revision13 and CL90 v014 PASS. Remaining F1 candidate320 infeasible due inbound y2640 Wall; candidate240 lacks 2x2 inbound footprint. CL50 installers quarantined.',
 next_action='Read-only F1 design and route safety audit: consider grid240 only with proven 2x2 fail-closed/manual-GM fallback for T3 to F1 installed GM-confirmed transition and preserve F1 to F2 binding, puzzle scripts, ledger and wall geometry. No live F1 write until this gate, exact source snapshot, no-write preview and 1x1 plus 2x2 proof. Do not rewrite M1, N3 or prior completed Rooms, do not activate CL50 R1-R4 installers; defer final actual-player tests.',
 source_id='SRC-2026-10-09-CL-SCALE-F2-GRID240-INDEPENDENT-FINAL'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='in_progress';

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-09-CL-SCALE-F2-GRID240-INSTALLED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-09-CL-SCALE-F2-GRID240-INSTALLED');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
