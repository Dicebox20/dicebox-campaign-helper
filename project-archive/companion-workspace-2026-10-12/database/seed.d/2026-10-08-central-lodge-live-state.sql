-- DiceBox supplemental KB seed: Central Lodge live-state reconciliation
-- 2026-10-08
-- Supersedes stale 2026-10-06 catalogue fields where exact live receipts now exist.

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
  ('central_lodge_catalog_version', '2026-10-08.live-v2'),
  ('central_lodge_catalog_scope', 'Central Lodge live project state through CL-14 B1 Waterwheel FINAL VERIFY and CL-15 E3 Behavior PREVIEW v002 PASS'),
  ('central_lodge_catalog_scene_roster_json', '[{"key":"B1","id":"0CSBwzcszPKyaB8u","name":"Central Lodge — B1 Cellar & Utility Basement","regions":11,"behaviors":4},{"key":"B2","id":"5K1uASAARnX8aZhP","name":"Central Lodge — B2 Hidden Annex & Sacrificial Preparation Area","regions":10,"behaviors":0},{"key":"C1","id":"EDdktL7VUihbpKe9","name":"Central Lodge — C1 Hidden Chapel / Shrine of Asmodeus","regions":10,"behaviors":0},{"key":"C2","id":"UNySMm7YkyYfh41x","name":"Central Lodge — C2 Cult Records & Ritual Undercroft","regions":11,"behaviors":0},{"key":"E1","id":"Zq8iXByDVhHRbA7w","name":"Central Lodge — E1 Arrival Clearing & Front Grounds","regions":6,"behaviors":0},{"key":"E2","id":"sI4YVZZChgey1qNi","name":"Central Lodge — E2 Rear Service Yard & Outbuildings","regions":9,"behaviors":5},{"key":"E3","id":"iqfCcDpEer4pwrJj","name":"Central Lodge — E3 Formal Garden & Greenhouse","regions":12,"behaviors":0},{"key":"E4","id":"DLcheEi6e5OHOYmU","name":"Central Lodge — E4 Family Graveyard & Crypt","regions":11,"behaviors":0},{"key":"M1","id":"U8S5ZrTjaPIkTUIL","name":"Central Lodge — M1 Entrance Hall & Great Room","regions":12,"behaviors":5},{"key":"M2","id":"JZkxX6lUQe8Nc8xJ","name":"Central Lodge — M2 Study, Parlor & Formal Rooms","regions":15,"behaviors":7},{"key":"M3","id":"LXTA8mx1rJ2L6e2J","name":"Central Lodge — M3 Kitchen & Service Wing","regions":10,"behaviors":0},{"key":"N1","id":"MAbLfBqG7qIVVuLN","name":"Central Lodge — N1 Underworks Hub / Lodge Railway Station","regions":11,"behaviors":0},{"key":"N2","id":"4pc5akMBieHU7GvV","name":"Central Lodge — N2 Underground Grotto / Garden Station","regions":9,"behaviors":0},{"key":"N3","id":"pHQvDUDlyWZFuNrX","name":"Central Lodge — N3 Collection Vaults / Underground Depot","regions":12,"behaviors":0},{"key":"U1","id":"if9iWDRjSwI87EeX","name":"Central Lodge — U1 Family & Guest Rooms","regions":10,"behaviors":0},{"key":"U2","id":"PVf6Gbrv9HbB88uZ","name":"Central Lodge — U2 Servants’ Quarters, Nursery & Attic","regions":11,"behaviors":6},{"key":"F1","id":"La9krMOMBhAhDLi6","name":"F1 — Ancient Infernal Threshold","regions":6,"behaviors":4},{"key":"T1","id":"ImeIdHbYb6kZKAdt","name":"T1 - Lodge ↔ Grotto Walkable Railway Tunnel","regions":6,"behaviors":2},{"key":"T2","id":"ez9MSQ8QIO4cW6zo","name":"T2 - Grotto ↔ Depot Walkable Railway Tunnel","regions":6,"behaviors":3},{"key":"T3","id":"aIKQmFiuXWipEdyb","name":"T3 - Abandoned Spur / Cult Railway Extension","regions":6,"behaviors":3},{"key":"F2","id":"HWitOe1wSid7MZ1y","name":"F2 — Final Summoning Chamber","regions":8,"behaviors":4}]'),
  ('central_lodge_catalog_phase_roster_json', '[{"id":"CL-00","status":"complete"},{"id":"CL-01","status":"complete"},{"id":"CL-02","status":"complete"},{"id":"CL-03","status":"complete"},{"id":"CL-04","status":"complete"},{"id":"CL-10","status":"complete"},{"id":"CL-10C","status":"complete"},{"id":"CL-11","status":"complete"},{"id":"CL-12","status":"complete"},{"id":"CL-13","status":"partial_deferred","summary":"Safe M1 portion installed; exact clock-setting literal remains unrecovered."},{"id":"CL-14","status":"partial_deferred","summary":"B1 Water Control Wheel recovery certified; flood/water-system/underworks states remain deferred."},{"id":"CL-15","status":"in_progress","summary":"E3 8-behavior PREVIEW v002 PASS; guarded APPLY is current gate."},{"id":"CL-16","status":"planned"},{"id":"CL-17","status":"planned"},{"id":"CL-20","status":"planned"},{"id":"CL-21","status":"planned"},{"id":"CL-22","status":"planned"},{"id":"CL-23","status":"planned"},{"id":"CL-24","status":"planned"},{"id":"CL-30","status":"planned"},{"id":"CL-31","status":"planned"},{"id":"CL-32","status":"planned"},{"id":"CL-33","status":"planned"},{"id":"CL-40","status":"planned"},{"id":"CL-41","status":"planned"},{"id":"CL-50","status":"planned"},{"id":"CL-51","status":"blocked"},{"id":"CL-52","status":"planned"},{"id":"CL-90","status":"planned"},{"id":"CL-91","status":"planned"},{"id":"CL-92","status":"planned"}]'),
  ('central_lodge_current_gate', 'CL-15 E3 Behavior APPLY'),
  ('central_lodge_current_gate_status', 'PREVIEW_PASS_APPLY_PENDING'),
  ('central_lodge_next_after_canary', 'CL-15 FINAL VERIFY then CL-16 M3 Kitchen and Service Wing'),
  ('central_lodge_scene_count', '21'),
  ('central_lodge_region_count', '202'),
  ('central_lodge_region_behavior_count', '43'),
  ('central_lodge_canonical_item_count', '33'),
  ('central_lodge_kernel_sha256', '6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814'),
  ('central_lodge_kernel_message_arbitration_version', '1.0.0'),
  ('central_lodge_kernel_message_gather_ms', '250'),
  ('central_lodge_kernel_message_cooldown_ms', '1250'),
  ('central_lodge_kernel_message_duplicate_ms', '5000'),
  ('central_lodge_authorized_automation_executor', 'Assistant Gamemaster'),
  ('central_lodge_b1_geometry_sha256', '3f25fc68ba42e7c3a3ab7a3484de7a5f87e3b1329c7f6d23d8c9596bd7cd2be5'),
  ('central_lodge_e3_geometry_sha256', 'd409885c23e5777808c5bb0964ccb3b855b2957a5e750f2b18d2a593d4c13a5d'),
  ('central_lodge_region_manifest_sha256', 'STALE-201-REGION-MANIFEST-DO-NOT-USE'),
  ('central_lodge_region_manifest_status', 'The 201-Region CL-04 manifest was superseded by the intentional B1 Waterwheel Region addition; current live count is 202 and live Region documents/stable IDs plus phase receipts are authoritative until a new full manifest hash is generated.');

INSERT OR REPLACE INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES
(
  'S-2026-10-08-CENTRAL-LODGE-LIVE-STATE',
  'Central Lodge live-state reconciliation through CL-15 preview',
  'campaign',
  'Central Lodge',
  'User-supplied Foundry FINAL VERIFY receipts plus Playwright developer-harness readback',
  'active',
  'handoffs/CENTRAL-LODGE-REGION-INSTALL-2026-10-06.md + work/foundry-playwright-harness',
  '2026-10-08',
  'Foundry 14.367 / dnd5e 5.3.3 / kernel 6264c467… / 202 Regions / 43 behaviors',
  'Chronologically supersedes stale CL-10C catalogue values. No CL-15 write is claimed here; only PREVIEW v002 PASS.'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES
(
  'F-2026-10-08-CENTRAL-LODGE-LIVE-BASELINE',
  'campaign.central-lodge.runtime',NULL,
  'Central Lodge certified live baseline before CL-15 APPLY',
  'The live certified baseline is 21 Scenes, 202 Regions, 43 RegionBehaviors, and 33 canonical Items. B1 is 11 Regions / 4 behaviors; E3 is 12 / 0 before CL-15 APPLY.',
  'campaign','full_function','locked','S-2026-10-08-CENTRAL-LODGE-LIVE-STATE',NULL,
  'central lodge live baseline 202 regions 43 behaviors cl15'
),
(
  'F-2026-10-08-CENTRAL-LODGE-KERNEL',
  'campaign.central-lodge.runtime',NULL,
  'Central Lodge message-arbitrating runtime kernel',
  'Runtime kernel Macro.FHQiFYx6OntZVo9d has SHA-256 6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814 and certified message arbitration v1.0.0: 250ms gather, 1250ms visible-card cooldown, 5000ms semantic duplicate suppression, per-actor coalescing, recipient isolation, and immediate gameplay writes.',
  'campaign','full_function','locked','S-2026-10-08-CENTRAL-LODGE-LIVE-STATE',NULL,
  'central lodge kernel message arbitration anti spam'
),
(
  'F-2026-10-08-CENTRAL-LODGE-CL14',
  'campaign.central-lodge.plan',NULL,
  'CL-14 B1 Waterwheel direction certified',
  'CL-14 B1 Waterwheel FINAL VERIFY passed. Water Control Wheel is recovered in B1 and used at E3. B1 is 11 Regions / 4 behaviors. Water Control Spindle, Flood State, and Underworks Access State remain intentionally behavior-free/deferred.',
  'campaign','full_function','locked','S-2026-10-08-CENTRAL-LODGE-LIVE-STATE',NULL,
  'central lodge cl14 b1 water control wheel e3'
),
(
  'F-2026-10-08-CENTRAL-LODGE-CL15-PREVIEW',
  'campaign.central-lodge.plan',NULL,
  'CL-15 E3 behavior preview certified',
  'Playwright-driven CL-15 E3 Behavior PREVIEW v002 passed read-only against the Assistant Gamemaster developer session. Eight behavior sources matched their approved hashes and E3 geometry hash d409885c23e5777808c5bb0964ccb3b855b2957a5e750f2b18d2a593d4c13a5d. APPLY is the current gate.',
  'campaign','staged','active','S-2026-10-08-CENTRAL-LODGE-LIVE-STATE',NULL,
  'central lodge cl15 e3 preview playwright'
),
(
  'F-2026-10-08-CENTRAL-LODGE-AUTOMATION',
  'campaign.central-lodge.tooling',NULL,
  'Assistant Gamemaster Playwright developer harness',
  'A dedicated isolated Chrome profile controlled through Playwright/CDP is connected to http://localhost:30000/game as Assistant Gamemaster [GM]. It is an explicitly authorized project executor under D-441 and may run guarded DiceBox writes with exact target/hash/PREVIEW/rollback/reread gates.',
  'campaign','full_function','locked','S-2026-10-08-CENTRAL-LODGE-LIVE-STATE',NULL,
  'central lodge playwright assistant gamemaster developer harness'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags
FROM kb_facts
WHERE fact_id IN (
  'F-2026-10-08-CENTRAL-LODGE-LIVE-BASELINE',
  'F-2026-10-08-CENTRAL-LODGE-KERNEL',
  'F-2026-10-08-CENTRAL-LODGE-CL14',
  'F-2026-10-08-CENTRAL-LODGE-CL15-PREVIEW',
  'F-2026-10-08-CENTRAL-LODGE-AUTOMATION'
)
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_open_items(
  item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id
) VALUES
(
  'O-2026-10-06-CENTRAL-LODGE-CL10C-RUNTIME-CANARY',
  'certification','Run controlled E2 runtime canary',
  'Resolved: representative E2 runtime behavior was certified and the installer sequence advanced through CL-14.',
  'No further CL-10C action.',
  'Historical live receipt retained in project catalogue.',
  'P0','closed','DiceBox Campaign Helper Foreman','S-2026-10-08-CENTRAL-LODGE-LIVE-STATE'
),
(
  'O-2026-10-06-CENTRAL-LODGE-CL11-U2',
  'implementation','Install CL-11 U2 behaviors',
  'Resolved: U2 has 6 certified managed behaviors.',
  'No further CL-11 action unless a later compatibility audit finds drift.',
  'CL-11 APPLY/VERIFY receipts and current live count.',
  'P1','closed','DiceBox Campaign Helper Foreman','S-2026-10-08-CENTRAL-LODGE-LIVE-STATE'
),
(
  'O-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-REMAINDER',
  'implementation','Complete remaining Region/puzzle installer sequence',
  'CL-10 through CL-14 have advanced; CL-13 and CL-14 retain explicit deferred state work. CL-15 E3 PREVIEW v002 passed and APPLY is pending.',
  'Execute guarded CL-15 E3 APPLY through the authorized Assistant Gamemaster Playwright harness, run independent FINAL VERIFY, then continue CL-16.',
  'CL-15 APPLY/VERIFY receipts, preserved geometry/kernel/ledger, then per-phase receipts through closure.',
  'P1','in_progress','DiceBox Campaign Helper Foreman','S-2026-10-08-CENTRAL-LODGE-LIVE-STATE'
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
  'Region/puzzle foundation complete; CL-10C passed. Current gate is CL-15 APPLY.',
  'in_progress',
  'S-2026-10-08-CENTRAL-LODGE-LIVE-STATE'
);

INSERT OR REPLACE INTO kb_tools(
  tool_id,project_id,project_name,tool_name,tool_kind,invocation,location,capability,authority,evidence_status,source_id,tags
) VALUES
(
  'T-CATALOG-CENTRAL-LODGE-LEDGER',
  'dicebox-campaign-helper','DiceBox Campaign Helper','Central Lodge Runtime State Ledger','runtime',
  'Resolve JournalEntry by stable ID dbx:central-lodge:state','JournalEntry.xhlXv6CCH34HVga3',
  'Persistent cross-Scene puzzle, Item recovery, Notice, route, and railway state.',
  'State storage only; guarded writes occur through the authorized runtime executor path.',
  'CL-02 VERIFY plus current revision-0 preservation checks PASS',
  'S-2026-10-08-CENTRAL-LODGE-LIVE-STATE','central lodge ledger runtime state'
),
(
  'T-CATALOG-CENTRAL-LODGE-KERNEL',
  'dicebox-campaign-helper','DiceBox Campaign Helper','Central Lodge Runtime Kernel','runtime',
  'Execute Macro resolved by stable ID dbx:central-lodge:macro:runtime','Macro.FHQiFYx6OntZVo9d',
  'Shared Notice, observe, pickup, socket, gate, transition, readState, and message-arbitration runtime.',
  'Live state mutation requires an explicitly authorized GM/project executor and exact runtime gates; Assistant Gamemaster developer automation is authorized under D-441. The kernel does not own Region geometry.',
  'Kernel arbitration FINAL VERIFY PASS; SHA-256 6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814',
  'S-2026-10-08-CENTRAL-LODGE-LIVE-STATE','central lodge runtime kernel notice pickup socket gate transition anti spam'
),
(
  'T-CATALOG-CENTRAL-LODGE-REGION-MANIFEST',
  'dicebox-campaign-helper','DiceBox Campaign Helper','Central Lodge Region Manifest','source',
  'Use live Foundry Region documents and stable IDs; regenerate a complete manifest hash after the intentional B1 Waterwheel addition.',
  'Live Foundry world',
  'Current topology contains 202 Regions; old CL-04 201-Region hash is historical only.',
  'Live Foundry Regions and per-phase verification receipts are authoritative until a new 202-Region manifest hash is generated.',
  '202-Region live baseline certified; full replacement manifest hash pending',
  'S-2026-10-08-CENTRAL-LODGE-LIVE-STATE','central lodge regions manifest 202 stable ids'
);

INSERT INTO tools_fts(tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags)
SELECT tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags
FROM kb_tools
WHERE tool_id IN (
  'T-CATALOG-CENTRAL-LODGE-LEDGER',
  'T-CATALOG-CENTRAL-LODGE-KERNEL',
  'T-CATALOG-CENTRAL-LODGE-REGION-MANIFEST'
)
AND NOT EXISTS (SELECT 1 FROM tools_fts t WHERE t.tool_id=kb_tools.tool_id);
