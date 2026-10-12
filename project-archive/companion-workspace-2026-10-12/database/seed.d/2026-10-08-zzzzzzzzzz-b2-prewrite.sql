-- Central Lodge CL-22 B2 prewrite reconciliation
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_current_gate','CL-22 B2 Behavior PREVIEW'),
 ('central_lodge_current_gate_status','PREFLIGHT_PASS'),
 ('central_lodge_current_status','READ_ONLY_PREFLIGHT_PASS'),
 ('central_lodge_b2_geometry_sha256','585f7c4612de8bffed40d7c3938bf1f65a5d85ae506bc90c2fc27a4eda841c81');

INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-B2-PREFLIGHT','Central Lodge B2 live preflight and catalog authority','campaign','Central Lodge B2','Live Foundry Region/state manifest plus canonical CL-22 plan/item registry','active','work/foundry-playwright-harness/b2-readonly-preflight.page.js + Central Lodge catalogue','2026-10-07','B2 5K1uASAARnX8aZhP / 10 Regions / 0 behaviors / geometry 585f7c46…','Safe gameplay slice: Wing I pickup, Victim History Notice, Preparation Use Notice, Sacrifice Evidence observation, Recent Use observation. Notice DC/message literals are NEW authoring where not recovered.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-B2-SAFE-SCOPE','campaign.central-lodge.b2',NULL,'B2 safe gameplay scope','Live B2 has dedicated Regions for Infernal Cicada Wing I, Victim History Notice, Preparation Use Notice, Sacrifice Evidence, and Recent Use Evidence. CL-22 may bind exactly those five mechanics. Three lighting Regions remain deferred to CL-51/local lighting work and two transitions remain deferred to CL-50. Infernal Cicada Wing I is canonical Item eIECLKMQwEjScWG7 and later contributes to F1.','campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-B2-PREFLIGHT',NULL,'central lodge b2 cl22 cicada wing victim preparation sacrifice recent use');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-B2-SAFE-SCOPE'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
