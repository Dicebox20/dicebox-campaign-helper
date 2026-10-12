-- Central Lodge CL-17 U1 completion
-- 2026-10-08

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
  ('central_lodge_catalog_version', '2026-10-08.cl17-complete-v1'),
  ('central_lodge_catalog_scope', 'Central Lodge live project state through CL-17 U1 FINAL VERIFY PASS'),
  ('central_lodge_region_behavior_count', '60'),
  ('central_lodge_current_gate', 'CL-20 E4 Read-Only Preflight'),
  ('central_lodge_current_gate_status', 'PENDING'),
  ('central_lodge_current_phase', 'CL-20'),
  ('central_lodge_current_scene', 'E4'),
  ('central_lodge_current_status', 'PREFLIGHT_PENDING'),
  ('central_lodge_next_installer', 'CL-20'),
  ('central_lodge_next_scene', 'E4'),
  ('central_lodge_catalog_phase_roster_json', '[{"id":"CL-00","status":"complete"},{"id":"CL-01","status":"complete"},{"id":"CL-02","status":"complete"},{"id":"CL-03","status":"complete"},{"id":"CL-04","status":"complete"},{"id":"CL-10","status":"complete"},{"id":"CL-10C","status":"complete"},{"id":"CL-11","status":"complete"},{"id":"CL-12","status":"complete"},{"id":"CL-13","status":"partial_deferred"},{"id":"CL-14","status":"partial_deferred"},{"id":"CL-15","status":"complete"},{"id":"CL-16","status":"partial_deferred"},{"id":"CL-17","status":"complete","summary":"U1 two Notices, House Proof, Crown Crest, and family-record interpretation certified; lights/transitions deferred."},{"id":"CL-20","status":"in_progress","summary":"E4 read-only preflight current."},{"id":"CL-21","status":"planned"},{"id":"CL-22","status":"planned"},{"id":"CL-23","status":"planned"},{"id":"CL-24","status":"planned"},{"id":"CL-30","status":"planned"},{"id":"CL-31","status":"planned"},{"id":"CL-32","status":"planned"},{"id":"CL-33","status":"planned"},{"id":"CL-40","status":"planned"},{"id":"CL-41","status":"planned"},{"id":"CL-50","status":"planned"},{"id":"CL-51","status":"blocked"},{"id":"CL-52","status":"planned"},{"id":"CL-90","status":"planned"},{"id":"CL-91","status":"planned"},{"id":"CL-92","status":"planned"}]');

INSERT OR REPLACE INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES
(
  'S-2026-10-08-CENTRAL-LODGE-CL17-COMPLETE',
  'Central Lodge CL-17 U1 APPLY and FINAL VERIFY receipts',
  'campaign','Central Lodge U1',
  'Playwright-driven live Foundry APPLY plus independent read-only FINAL VERIFY under authorized Assistant Gamemaster executor',
  'active',
  'work/foundry-playwright-harness/u1-apply-v001.page.js + u1-final-verify-v001.page.js',
  '2026-10-08',
  '202 Regions / 60 behaviors / U1 10/5 / geometry 51c37b02…',
  'U1 gameplay installed; lighting and transitions intentionally deferred.'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES
(
  'F-2026-10-08-CENTRAL-LODGE-CL17-COMPLETE',
  'campaign.central-lodge.u1',NULL,
  'CL-17 U1 gameplay installation certified',
  'CL-17 APPLY installed five managed behaviors and FINAL VERIFY passed: Family Records Notice, Guest Room Absence Notice, House Proof recovery, Crown Crest recovery, and Family Records interpretation. Canonical live baseline is 21 Scenes / 202 Regions / 60 RegionBehaviors / 33 Items. U1 is 10 Regions / 5 behaviors. Lights and transitions remain behavior-free/deferred.',
  'campaign','full_function','locked','S-2026-10-08-CENTRAL-LODGE-CL17-COMPLETE',
  'F-2026-10-08-CENTRAL-LODGE-U1-LIVE-MANIFEST',
  'central lodge cl17 u1 final verify 202 60'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-CENTRAL-LODGE-CL17-COMPLETE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_open_items(
  item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id
) VALUES
(
  'O-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-REMAINDER',
  'implementation','Complete remaining Region/puzzle installer sequence',
  'CL-17 U1 gameplay is certified; CL-13, CL-14, and CL-16 retain explicit deferred semantics. CL-20 E4 is next.',
  'Run database-backed and live read-only E4 preflight, reconcile four-crest mausoleum and E4 item/reveal dependencies, then construct CL-20 PREVIEW before any write.',
  'E4 PREPARE authority, live Region manifest/geometry fingerprint, canonical Item/state dependencies, PREVIEW/APPLY/VERIFY receipts.',
  'P1','in_progress','DiceBox Campaign Helper Foreman','S-2026-10-08-CENTRAL-LODGE-CL17-COMPLETE'
);
