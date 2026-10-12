-- DiceBox supplemental KB seed: CL-15 E3 completion and CL-16 handoff
-- 2026-10-08

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
  ('central_lodge_catalog_version', '2026-10-08.cl15-complete-v1'),
  ('central_lodge_catalog_scope', 'Central Lodge live project state through CL-15 E3 FINAL VERIFY PASS'),
  ('central_lodge_catalog_scene_roster_json', '[{"key":"B1","id":"0CSBwzcszPKyaB8u","name":"Central Lodge — B1 Cellar & Utility Basement","regions":11,"behaviors":4},{"key":"B2","id":"5K1uASAARnX8aZhP","name":"Central Lodge — B2 Hidden Annex & Sacrificial Preparation Area","regions":10,"behaviors":0},{"key":"C1","id":"EDdktL7VUihbpKe9","name":"Central Lodge — C1 Hidden Chapel / Shrine of Asmodeus","regions":10,"behaviors":0},{"key":"C2","id":"UNySMm7YkyYfh41x","name":"Central Lodge — C2 Cult Records & Ritual Undercroft","regions":11,"behaviors":0},{"key":"E1","id":"Zq8iXByDVhHRbA7w","name":"Central Lodge — E1 Arrival Clearing & Front Grounds","regions":6,"behaviors":0},{"key":"E2","id":"sI4YVZZChgey1qNi","name":"Central Lodge — E2 Rear Service Yard & Outbuildings","regions":9,"behaviors":5},{"key":"E3","id":"iqfCcDpEer4pwrJj","name":"Central Lodge — E3 Formal Garden & Greenhouse","regions":12,"behaviors":8},{"key":"E4","id":"DLcheEi6e5OHOYmU","name":"Central Lodge — E4 Family Graveyard & Crypt","regions":11,"behaviors":0},{"key":"M1","id":"U8S5ZrTjaPIkTUIL","name":"Central Lodge — M1 Entrance Hall & Great Room","regions":12,"behaviors":5},{"key":"M2","id":"JZkxX6lUQe8Nc8xJ","name":"Central Lodge — M2 Study, Parlor & Formal Rooms","regions":15,"behaviors":7},{"key":"M3","id":"LXTA8mx1rJ2L6e2J","name":"Central Lodge — M3 Kitchen & Service Wing","regions":10,"behaviors":0},{"key":"N1","id":"MAbLfBqG7qIVVuLN","name":"Central Lodge — N1 Underworks Hub / Lodge Railway Station","regions":11,"behaviors":0},{"key":"N2","id":"4pc5akMBieHU7GvV","name":"Central Lodge — N2 Underground Grotto / Garden Station","regions":9,"behaviors":0},{"key":"N3","id":"pHQvDUDlyWZFuNrX","name":"Central Lodge — N3 Collection Vaults / Underground Depot","regions":12,"behaviors":0},{"key":"U1","id":"if9iWDRjSwI87EeX","name":"Central Lodge — U1 Family & Guest Rooms","regions":10,"behaviors":0},{"key":"U2","id":"PVf6Gbrv9HbB88uZ","name":"Central Lodge — U2 Servants’ Quarters, Nursery & Attic","regions":11,"behaviors":6},{"key":"F1","id":"La9krMOMBhAhDLi6","name":"F1 — Ancient Infernal Threshold","regions":6,"behaviors":4},{"key":"T1","id":"ImeIdHbYb6kZKAdt","name":"T1 - Lodge ↔ Grotto Walkable Railway Tunnel","regions":6,"behaviors":2},{"key":"T2","id":"ez9MSQ8QIO4cW6zo","name":"T2 - Grotto ↔ Depot Walkable Railway Tunnel","regions":6,"behaviors":3},{"key":"T3","id":"aIKQmFiuXWipEdyb","name":"T3 - Abandoned Spur / Cult Railway Extension","regions":6,"behaviors":3},{"key":"F2","id":"HWitOe1wSid7MZ1y","name":"F2 — Final Summoning Chamber","regions":8,"behaviors":4}]'),
  ('central_lodge_catalog_phase_roster_json', '[{"id":"CL-00","status":"complete"},{"id":"CL-01","status":"complete"},{"id":"CL-02","status":"complete"},{"id":"CL-03","status":"complete"},{"id":"CL-04","status":"complete"},{"id":"CL-10","status":"complete"},{"id":"CL-10C","status":"complete"},{"id":"CL-11","status":"complete"},{"id":"CL-12","status":"complete"},{"id":"CL-13","status":"partial_deferred"},{"id":"CL-14","status":"partial_deferred"},{"id":"CL-15","status":"complete","summary":"Eight E3 gameplay behaviors installed and independently verified; lighting/transitions remain deferred to CL-51/CL-50."},{"id":"CL-16","status":"in_progress","summary":"M3 read-only preflight is current."},{"id":"CL-17","status":"planned"},{"id":"CL-20","status":"planned"},{"id":"CL-21","status":"planned"},{"id":"CL-22","status":"planned"},{"id":"CL-23","status":"planned"},{"id":"CL-24","status":"planned"},{"id":"CL-30","status":"planned"},{"id":"CL-31","status":"planned"},{"id":"CL-32","status":"planned"},{"id":"CL-33","status":"planned"},{"id":"CL-40","status":"planned"},{"id":"CL-41","status":"planned"},{"id":"CL-50","status":"planned"},{"id":"CL-51","status":"blocked"},{"id":"CL-52","status":"planned"},{"id":"CL-90","status":"planned"},{"id":"CL-91","status":"planned"},{"id":"CL-92","status":"planned"}]'),
  ('central_lodge_current_gate', 'CL-16 M3 Read-Only Preflight'),
  ('central_lodge_current_gate_status', 'PENDING'),
  ('central_lodge_next_after_canary', 'Inspect M3 authority/live manifest, then CL-16 Behavior PREVIEW'),
  ('central_lodge_region_behavior_count', '51');

INSERT OR REPLACE INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES
(
  'S-2026-10-08-CENTRAL-LODGE-CL15-COMPLETE',
  'Central Lodge CL-15 E3 APPLY and FINAL VERIFY receipts',
  'campaign','Central Lodge',
  'Playwright-driven live Foundry APPLY plus independent read-only FINAL VERIFY under authorized Assistant Gamemaster executor',
  'active',
  'work/foundry-playwright-harness/e3-apply-v001.page.js + e3-final-verify-v001.page.js',
  '2026-10-08',
  'Foundry 14.367 / dnd5e 5.3.3 / 202 Regions / 51 behaviors / E3 12/8',
  'CL-15 E3 gameplay installed; lighting and transitions intentionally deferred.'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES
(
  'F-2026-10-08-CENTRAL-LODGE-CL15-COMPLETE',
  'campaign.central-lodge.plan',NULL,
  'CL-15 E3 gameplay installation certified',
  'CL-15 E3 APPLY created eight managed behaviors and independent FINAL VERIFY passed. Canonical live baseline is 21 Scenes / 202 Regions / 51 RegionBehaviors / 33 Items. E3 is 12 Regions / 8 behaviors. Kernel hash 6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814, E3 geometry hash d409885c23e5777808c5bb0964ccb3b855b2957a5e750f2b18d2a593d4c13a5d, ledger revision 0/notices empty were preserved.',
  'campaign','full_function','locked','S-2026-10-08-CENTRAL-LODGE-CL15-COMPLETE',
  'F-2026-10-08-CENTRAL-LODGE-CL15-PREVIEW',
  'central lodge cl15 e3 apply final verify 202 51'
),
(
  'F-2026-10-08-B1-WATERWHEEL-METADATA-CLEANUP',
  'campaign.central-lodge.behavior',NULL,
  'B1 Waterwheel recovery metadata owner corrected',
  'The Water Control Wheel recovery behavior jL7OU30qz2hVwLI2 retained its certified source hash and live Region binding while flags.world.dicebox.regionStableId was corrected from the Rail Proof stable ID to dbx:central-lodge:b1:region:b1-water-control-wheel.',
  'campaign','full_function','locked','S-2026-10-08-CENTRAL-LODGE-CL15-COMPLETE',
  NULL,
  'central lodge b1 waterwheel metadata cleanup regionstableid'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id IN (
  'F-2026-10-08-CENTRAL-LODGE-CL15-COMPLETE',
  'F-2026-10-08-B1-WATERWHEEL-METADATA-CLEANUP'
)
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_open_items(
  item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id
) VALUES
(
  'O-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-REMAINDER',
  'implementation','Complete remaining Region/puzzle installer sequence',
  'CL-15 E3 gameplay is certified; CL-13 and CL-14 retain explicit deferred state work. CL-16 M3 is next.',
  'Run database-backed and live read-only M3 preflight, reconcile exact puzzle/item dependencies, then construct CL-16 PREVIEW before any write.',
  'M3 authority sources, live Region manifest/geometry fingerprint, canonical Item/state dependencies, PREVIEW/APPLY/VERIFY receipts.',
  'P1','in_progress','DiceBox Campaign Helper Foreman','S-2026-10-08-CENTRAL-LODGE-CL15-COMPLETE'
);

INSERT OR REPLACE INTO kb_milestones(
  milestone_id,milestone,goal,deliverables,exit_gate,dependencies,status,source_id
) VALUES
(
  'M-2026-10-06-CENTRAL-LODGE-PHASE1',
  'Central Lodge Phase 1 early acquisition and local mechanisms',
  'Install and certify CL-10 through CL-17 while preserving explicitly deferred unresolved mechanics.',
  'E2, U2, M2, M1 safe portion, B1 safe portion/Waterwheel correction, E3, M3, and U1 installers plus independent verifiers.',
  'CL-17 VERIFY PASS with dependency paths intact and deferred mechanics explicitly carried.',
  'CL-15 complete. Current gate is CL-16 M3 read-only preflight.',
  'in_progress',
  'S-2026-10-08-CENTRAL-LODGE-CL15-COMPLETE'
);
