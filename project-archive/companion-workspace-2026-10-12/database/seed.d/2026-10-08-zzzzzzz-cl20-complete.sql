-- Central Lodge CL-20 E4 completion
-- 2026-10-07

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
  ('central_lodge_catalog_version','2026-10-07.cl20-complete-v1'),
  ('central_lodge_catalog_scope','Central Lodge live project state through CL-20 E4 FINAL VERIFY PASS'),
  ('central_lodge_region_behavior_count','69'),
  ('central_lodge_current_gate','CL-21 E1 Read-Only Preflight'),
  ('central_lodge_current_gate_status','PENDING'),
  ('central_lodge_current_phase','CL-21'),
  ('central_lodge_current_scene','E1'),
  ('central_lodge_current_status','PREFLIGHT_PENDING'),
  ('central_lodge_next_installer','CL-21'),
  ('central_lodge_next_scene','E1'),
  ('central_lodge_catalog_scene_roster_json','[{"key":"B1","id":"0CSBwzcszPKyaB8u","regions":11,"behaviors":4},{"key":"B2","id":"5K1uASAARnX8aZhP","regions":10,"behaviors":0},{"key":"C1","id":"EDdktL7VUihbpKe9","regions":10,"behaviors":0},{"key":"C2","id":"UNySMm7YkyYfh41x","regions":11,"behaviors":0},{"key":"E1","id":"Zq8iXByDVhHRbA7w","regions":6,"behaviors":0},{"key":"E2","id":"sI4YVZZChgey1qNi","regions":9,"behaviors":5},{"key":"E3","id":"iqfCcDpEer4pwrJj","regions":12,"behaviors":8},{"key":"E4","id":"DLcheEi6e5OHOYmU","regions":11,"behaviors":9},{"key":"M1","id":"U8S5ZrTjaPIkTUIL","regions":12,"behaviors":5},{"key":"M2","id":"JZkxX6lUQe8Nc8xJ","regions":15,"behaviors":7},{"key":"M3","id":"LXTA8mx1rJ2L6e2J","regions":10,"behaviors":4},{"key":"N1","id":"MAbLfBqG7qIVVuLN","regions":11,"behaviors":0},{"key":"N2","id":"4pc5akMBieHU7GvV","regions":9,"behaviors":0},{"key":"N3","id":"pHQvDUDlyWZFuNrX","regions":12,"behaviors":0},{"key":"U1","id":"if9iWDRjSwI87EeX","regions":10,"behaviors":5},{"key":"U2","id":"PVf6Gbrv9HbB88uZ","regions":11,"behaviors":6},{"key":"F1","id":"La9krMOMBhAhDLi6","regions":6,"behaviors":4},{"key":"T1","id":"ImeIdHbYb6kZKAdt","regions":6,"behaviors":2},{"key":"T2","id":"ez9MSQ8QIO4cW6zo","regions":6,"behaviors":3},{"key":"T3","id":"aIKQmFiuXWipEdyb","regions":6,"behaviors":3},{"key":"F2","id":"HWitOe1wSid7MZ1y","regions":8,"behaviors":4}]');

INSERT OR REPLACE INTO kb_sources(
 source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES
(
 'S-2026-10-07-CENTRAL-LODGE-CL20-COMPLETE',
 'Central Lodge CL-20 E4 APPLY and FINAL VERIFY receipts',
 'campaign','Central Lodge E4',
 'Playwright-driven live Foundry APPLY plus independent read-only FINAL VERIFY',
 'active',
 'work/foundry-playwright-harness/e4-apply-v001.page.js + e4-final-verify-v001.page.js',
 '2026-10-07',
 '202 Regions / 69 behaviors / E4 11/9 / geometry 2c3a3508…',
 'Four-crest gate, crypt-gated recoveries, child-burial recovery, two Notices, and false-burial interpretation certified. Door remains closed before gameplay.'
);

INSERT OR REPLACE INTO kb_facts(
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES
(
 'F-2026-10-07-CENTRAL-LODGE-CL20-COMPLETE',
 'campaign.central-lodge.e4',NULL,
 'CL-20 E4 gameplay installation certified',
 'CL-20 APPLY installed nine managed behaviors and independent FINAL VERIFY passed. Canonical live baseline is 21 Scenes / 202 Regions / 69 RegionBehaviors / 33 Items. E4 is 11 Regions / 9 behaviors. The exact mausoleum crest door remains closed before gameplay, geometry/kernel/ledger are preserved, and light/transition Regions remain deferred.',
 'campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-CL20-COMPLETE',
 NULL,
 'central lodge cl20 e4 final verify 202 69'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-07-CENTRAL-LODGE-CL20-COMPLETE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_open_items(
 item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id
) VALUES
(
 'O-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-REMAINDER',
 'implementation','Complete remaining Region/puzzle installer sequence',
 'CL-20 E4 gameplay is certified; CL-13, CL-14, and CL-16 retain explicit deferred semantics. CL-21 E1 backtrack is next.',
 'Run database-backed and live read-only E1 preflight, reconcile hound/Black Garnet Eye and arrival-ground backtrack dependencies, then construct CL-21 PREVIEW before any write.',
 'E1 PREPARE authority, live Region manifest/geometry fingerprint, canonical Item/state dependencies, PREVIEW/APPLY/VERIFY receipts.',
 'P1','in_progress','DiceBox Campaign Helper Foreman','S-2026-10-07-CENTRAL-LODGE-CL20-COMPLETE'
);
