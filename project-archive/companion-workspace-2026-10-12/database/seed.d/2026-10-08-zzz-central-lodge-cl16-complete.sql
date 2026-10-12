-- Central Lodge CL-16 M3 safe-slice completion
-- 2026-10-08

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
  ('central_lodge_catalog_version', '2026-10-08.cl16-partial-v1'),
  ('central_lodge_catalog_scope', 'Central Lodge live project state through CL-16 M3 safe FINAL VERIFY PASS'),
  ('central_lodge_region_behavior_count', '55'),
  ('central_lodge_current_gate', 'CL-17 U1 Read-Only Preflight'),
  ('central_lodge_current_gate_status', 'PENDING'),
  ('central_lodge_current_phase', 'CL-17'),
  ('central_lodge_current_scene', 'U1'),
  ('central_lodge_current_status', 'PREFLIGHT_PENDING'),
  ('central_lodge_next_installer', 'CL-17'),
  ('central_lodge_next_scene', 'U1'),
  ('central_lodge_catalog_phase_roster_json', '[{"id":"CL-00","status":"complete"},{"id":"CL-01","status":"complete"},{"id":"CL-02","status":"complete"},{"id":"CL-03","status":"complete"},{"id":"CL-04","status":"complete"},{"id":"CL-10","status":"complete"},{"id":"CL-10C","status":"complete"},{"id":"CL-11","status":"complete"},{"id":"CL-12","status":"complete"},{"id":"CL-13","status":"partial_deferred"},{"id":"CL-14","status":"partial_deferred"},{"id":"CL-15","status":"complete"},{"id":"CL-16","status":"partial_deferred","summary":"Bell Board Notice, Servant Bell Pull fitting, Recent Use Notice, and Bell Crest gated recovery certified; literal Bell Board correct-operation sequence and service-route unlock remain deferred."},{"id":"CL-17","status":"in_progress","summary":"U1 read-only preflight current."},{"id":"CL-20","status":"planned"},{"id":"CL-21","status":"planned"},{"id":"CL-22","status":"planned"},{"id":"CL-23","status":"planned"},{"id":"CL-24","status":"planned"},{"id":"CL-30","status":"planned"},{"id":"CL-31","status":"planned"},{"id":"CL-32","status":"planned"},{"id":"CL-33","status":"planned"},{"id":"CL-40","status":"planned"},{"id":"CL-41","status":"planned"},{"id":"CL-50","status":"planned"},{"id":"CL-51","status":"blocked"},{"id":"CL-52","status":"planned"},{"id":"CL-90","status":"planned"},{"id":"CL-91","status":"planned"},{"id":"CL-92","status":"planned"}]');

INSERT OR REPLACE INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES
(
  'S-2026-10-08-CENTRAL-LODGE-CL16-COMPLETE',
  'Central Lodge CL-16 M3 safe APPLY and FINAL VERIFY receipts',
  'campaign','Central Lodge M3',
  'Playwright-driven live Foundry APPLY plus independent read-only FINAL VERIFY under authorized Assistant Gamemaster executor',
  'active',
  'work/foundry-playwright-harness/m3-safe-apply-v001.page.js + m3-safe-final-verify-v001.page.js',
  '2026-10-08',
  '202 Regions / 55 behaviors / M3 10/4 / geometry 8473a9fe…',
  'Bell Board literal solve and service-route unlock deliberately deferred because exact operation is unrecovered.'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES
(
  'F-2026-10-08-CENTRAL-LODGE-CL16-COMPLETE',
  'campaign.central-lodge.m3',NULL,
  'CL-16 M3 safe gameplay slice certified',
  'CL-16 safe APPLY installed four behaviors and FINAL VERIFY passed: Bell Board Notice, Servant Bell Pull socket, Recent Use Notice, and Bell Crest recovery gated behind puzzles.m3.bellBoardResolved. Canonical live baseline is 21 Scenes / 202 Regions / 55 RegionBehaviors / 33 Items. M3 is 10 Regions / 4 behaviors. Bell Board Mechanism, Service Route State, lights, and transitions remain behavior-free/deferred.',
  'campaign','full_function','locked','S-2026-10-08-CENTRAL-LODGE-CL16-COMPLETE',
  'F-2026-10-08-CENTRAL-LODGE-M3-DEFERRED-OPERATION',
  'central lodge cl16 m3 final verify bell board deferred'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-CENTRAL-LODGE-CL16-COMPLETE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_open_items(
  item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id
) VALUES
(
  'O-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-REMAINDER',
  'implementation','Complete remaining Region/puzzle installer sequence',
  'CL-16 M3 safe slice is certified; CL-13, CL-14, and CL-16 retain explicit deferred semantics. CL-17 U1 is next.',
  'Run database-backed and live read-only U1 preflight, reconcile House Proof, Crown Crest, family records/story dependencies, then construct CL-17 PREVIEW before any write.',
  'U1 PREPARE authority, live Region manifest/geometry fingerprint, canonical Item/state dependencies, PREVIEW/APPLY/VERIFY receipts.',
  'P1','in_progress','DiceBox Campaign Helper Foreman','S-2026-10-08-CENTRAL-LODGE-CL16-COMPLETE'
);
