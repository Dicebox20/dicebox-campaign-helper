-- CL-33 read-only tunnel preflight, legacy-source audit, and migration safety gate (2026-10-07).
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-CL33-PREFLIGHT','CL-33 T1 T2 T3 live read-only source and progression compatibility audits','verification','Central Lodge T1/T2/T3','Playwright Assistant Gamemaster read-only preflight + legacy source audit + progression-migration prewrite','active','work/foundry-playwright-harness/tunnels-preflight-v001.page.js; tunnels-legacy-source-audit-v001.page.js; cl33-legacy-state-audit-v001.page.js; cl33-progression-migration-prewrite-v001.page.js','2026-10-07','21/202/112/33; 8 existing tunnel behaviors; 3 progression mismatches','CL-33 preflight PASS, blocked for mutations due legacy Actor-flag-only T2/T3 pickups and T1 hidden Wing III notice without grant. No tokens placed on T1-T3, no Actor recovery flags or canonical embedded item copies in inspected Actor population; ledger revision 0, 0 notices. Kernel GM ownership gate needs verified runtime migration strategy. T1/T2 mouth orientation unresolved; T3 far destination null.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CENTRAL-LODGE-CL33-PREFLIGHT','campaign.central-lodge.tunnels',NULL,'CL-33 tunnel live read-only preflight and dependency mismatch','Live T1 is 6 Regions/2 existing RegionBehaviors (geometry SHA af259bcba633d5c90822622b3090c70b7e0ea5d1d0bce856554f0c9f578c22bd); T2 6/3 (SHA a1533208d558f2a88a1ea68c427b632dde511a03accfb779c569b095563ad84f); T3 6/3 (SHA e372066d468469936ce90a6065a567c0dff0d8fff6d5a48fb07404e1e0ceeead). At global 21/202/112/33 baseline and unchanged ledger revision 0, T1 Cicada Wing III currently only provides hidden Notice without canonical grant, while T2 Railway Switch Wheel and T3 Recent Route Fragment pickup scripts set Actor flags instead of creating canonical item copies; this mismatches N3 canonical kernel sockets. Eight old behaviors remain live, with no T1/T2 orientation binding or T3 far destination. CL-33 migration APPLY is blocked pending code, ownership and canary contracts.','campaign','static','locked','S-2026-10-07-CENTRAL-LODGE-CL33-PREFLIGHT',NULL,'central lodge cl33 t1 t2 t3 legacy progression migration 8 behaviors blockers');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CENTRAL-LODGE-CL33-PREFLIGHT'
AND NOT EXISTS(SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_open_items(item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id) VALUES
('O-2026-10-07-CL33-CANONICAL-PICKUP-MIGRATION','reconciliation','CL-33 T1/T2/T3 canonical progression Item recovery mismatch','T1 Cicada Wing III lacks a canonical recovery behavior; T2 switch-wheel and T3 route-fragment recoveries only write Actor flags. N3/F1 use canonical embedded Items and central ledger; migrating without primary-GM event arbitration may cause double grants or softlocks.','Design guarded in-place migration or supplemental behavior PREVIEW preserving player consent, non-softlock hidden notice, source hashes, and existing Event user/primary GM ownership. Verify no duplicate triggers, ensure canonical Item copy and ledger only after successful grant, provide rollback and independent final verify. Do not perform gameplay canary in live campaign without separate authorization.','Original 8 behavior sources and hashes, primary GM dispatch mechanism, exact actor event contract, migrated PREVIEW/rollback, independent read-only FINAL VERIFY.','P0','blocked','Foreman','S-2026-10-07-CENTRAL-LODGE-CL33-PREFLIGHT'),
('O-2026-10-07-CL33-ROUTE-TOPOLOGY','reconciliation','CL-33 Tunnel scene transitions and T3 branch topology unbound','T1/T2 mouths have candidate endpoints but no authoritative orientation. T3 far destination null and N3 t3BranchUnlocked semantics unresolved; guessing destinations or gates risks bad transitions.','Reconcile scene art/original design and physical mouth endpoint orientation plus N3 switch/cartography access semantics; defer actual transition installation to CL-50.','Authoritative topology/map inspection and source storyline; no inferred endpoint assignment.','P1','blocked','Foreman','S-2026-10-07-CENTRAL-LODGE-CL33-PREFLIGHT');
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id IN ('O-2026-10-07-CL33-CANONICAL-PICKUP-MIGRATION','O-2026-10-07-CL33-ROUTE-TOPOLOGY')
AND NOT EXISTS(SELECT 1 FROM open_items_fts f WHERE f.item_id=kb_open_items.item_id);

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_catalog_version','2026-10-07.cl33-preflight-blocked-v001'),
('central_lodge_current_gate','CL-33 T1/T2/T3 Runtime Contract Migration PREVIEW'),
('central_lodge_current_gate_status','BLOCKED_DEPENDENCY_RECONCILIATION'),
('central_lodge_current_phase','CL-33'),
('central_lodge_current_scene','T1/T2/T3'),
('central_lodge_current_status','READ_ONLY_PREFLIGHT_PASS_WITH_BLOCKERS'),
('central_lodge_next_installer','CL-33'),
('central_lodge_next_scene','T1'),
('central_lodge_t1_geometry_sha256','af259bcba633d5c90822622b3090c70b7e0ea5d1d0bce856554f0c9f578c22bd'),
('central_lodge_t2_geometry_sha256','a1533208d558f2a88a1ea68c427b632dde511a03accfb779c569b095563ad84f'),
('central_lodge_t3_geometry_sha256','e372066d468469936ce90a6065a567c0dff0d8fff6d5a48fb07404e1e0ceeead'),
('central_lodge_cl33_preflight_status','PASS; APPLY BLOCKED_DEPENDENCY_RECONCILIATION'),
('central_lodge_cl33_legacy_behavior_count','8');
