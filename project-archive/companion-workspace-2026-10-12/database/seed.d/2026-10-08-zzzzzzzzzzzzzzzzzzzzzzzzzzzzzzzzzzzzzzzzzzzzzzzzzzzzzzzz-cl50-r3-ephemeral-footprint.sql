-- R3 source-verified, no-write geometric evidence only; neither behavior nor live route binding installed.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('S-2026-10-07-CL50-R3-EPHEMERAL-FOOTPRINT',
'CL-50 R3 N2 Tunnel B to T2 Mouth A simulated ephemeral token footprint preflight',
'verification','Central Lodge R3 approved railway topology, no-write arrival preflight',
'User-approved exact Scene/Region mapping and installed Foundry 14.367 / D&D5e 5.3.3 live Region, Walls and temporary spawnTokens create:false geometry',
'active',
'docs/CL50-R3-N2-T2-ARRIVAL-PREFLIGHT-2026-10-07.md; work/foundry-playwright-harness/cl50-r3-endpoint-readonly-v001.page.js; work/foundry-playwright-harness/cl50-r3-arrival-footprint-readonly-v001.page.js',
'2026-10-07','READONLY_DIAGNOSTIC_PASS N2/T2, exact live region IDs and stable IDs, ledger rev1',
'No token saved, Region added, code installed, teleport performed, or playback triggered; real GM/player canary and supported exact-target installer separate.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES('F-2026-10-07-CL50-R3-ARRIVAL-PREVIEW',
'campaign.central-lodge.routes',NULL,
'R3 N2 Tunnel B and T2 Mouth A 1x1 simulated arrival positions safe in read-only geometry; 2x2 collides at N2',
'R3 bidirectional topology approved by user: N2 Tunnel B Scene 4pc5akMBieHU7GvV Region shIAThge7cNy0JjT stable dbx:central-lodge:n2:region:n2-railway-tunnel-b; T2 Mouth A Scene ez9MSQ8QIO4cW6zo Region 3OGR0atcJokXJo6b stable dbx:central-lodge:t2:region:mouth-a. Foundry nonpersistent 1x1 arrival top-left N2 (3740,1480) and T2 (560,1210) had no reverse-mouth intersection, other active observation, sampled straight move-wall crossing, or occupied target. N2 1x1 overlaps only informational margin notice. N2 2x2 top-left (3680,1420) overlaps return mouth, passive lighting and N2 Grotto Station Interpretation story Region, even though point-center testInsideRegion returns false. T2 2x2 top-left (500,1150) had no sampled conflict, but initial reciprocal travel must fail closed for all >1x1 pending a safe N2 counterpart. No live RegionBehavior installed or gameplay canary attempted. Temporary tokens never persisted.',
'campaign','local','active','S-2026-10-07-CL50-R3-EPHEMERAL-FOOTPRINT',NULL,
'central lodge CL50 R3 railway ephemeral noWrite footprint preview token collision');
INSERT INTO facts_fts(fact_id,title,statement,tags) SELECT f.fact_id,f.title,f.statement,f.tags FROM kb_facts f
WHERE f.fact_id='F-2026-10-07-CL50-R3-ARRIVAL-PREVIEW'
AND NOT EXISTS(SELECT 1 FROM facts_fts t WHERE t.fact_id=f.fact_id);

INSERT OR REPLACE INTO kb_trials(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id)
VALUES('TR-2026-10-07-CL50-R3-2X2-RETURN-COLLISION',
'central-lodge.CL50',
'R3 N2 Tunnel B 2x2 center test missed a return-mouth footprint collision and overlap with story observation despite Wall crossing and token occupancy both clear.',
'Compared exact Region polygon rectangle to ephemeral token whole bounding box for 1x1 and 2x2 in live no-write Foundry scene.',
'Center-only testInsideRegion is not sufficient for body-sized arrival and bounce avoidance when two triggered Regions border a narrow tunnel corridor.',
'Restrict initial R3 proposal to 1x1, require full token-footprint collision/owner state check in later guarded installer and preserve existing story/notice Regions; manual GM fallback for larger tokens.',
'READONLY_REPRODUCED_GEOMETRY_GUARD_DOCUMENTED',
'S-2026-10-07-CL50-R3-EPHEMERAL-FOOTPRINT');
INSERT INTO trials_fts(trial_id,area,symptom,attempted_approach,failure_cause,correction)
SELECT t.trial_id,t.area,t.symptom,t.attempted_approach,t.failure_cause,t.correction FROM kb_trials t
WHERE t.trial_id='TR-2026-10-07-CL50-R3-2X2-RETURN-COLLISION'
AND NOT EXISTS(SELECT 1 FROM trials_fts f WHERE f.trial_id=t.trial_id);

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_cl50_r3_landing_status','READONLY_DIAGNOSTIC_PASS; 1X1_ONLY; 2X2_N2_COLLIDES; NOT_INSTALLED'),
('central_lodge_cl50_r3_landing_receipt','docs/CL50-R3-N2-T2-ARRIVAL-PREFLIGHT-2026-10-07.md');
