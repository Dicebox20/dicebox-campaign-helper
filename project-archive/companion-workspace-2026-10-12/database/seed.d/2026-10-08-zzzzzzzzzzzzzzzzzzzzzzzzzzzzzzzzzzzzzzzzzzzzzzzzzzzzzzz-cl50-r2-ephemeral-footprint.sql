-- R2 read-only geometry research, not authorization for any live handler or installer.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CL50-R2-EPHEMERAL-FOOTPRINT',
'CL-50 R2 T1 Mouth B to N2 Tunnel A ephemeral arrival-footprint audit',
'verification','Central Lodge approved R2 railway topology and landing research',
'Accepted author mapping plus exact live Foundry 14.367 RegionDocument.spawnTokens(create:false), actual Region shapes, Walls and occupancy',
'active',
'docs/CL50-R2-N2-T1-ARRIVAL-PREFLIGHT-2026-10-07.md; work/foundry-playwright-harness/cl50-r2-readonly-arrival-diagnostics-v001.page.js',
'2026-10-07','READONLY_DIAGNOSTIC_PASS N2/T1 no writes, game system 5.3.3, ledgerRev1',
'Only exact 1x1 ephemeral landing footprint in each direction has sampled clearance; no route source handler or installer staged, no gameplay canary or live world change.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL50-R2-ARRIVAL-PREVIEW',
'campaign.central-lodge.routes',NULL,
'R2 T1 Mouth B and N2 Tunnel A 1x1 arrival footprint preview passes; 2x2 N2 fails',
'Read-only live R2 preflight verified T1 mouth B Region 91XmuJ9LGbsJY52W and N2 Tunnel A Region lYps0Z5806d0W8wX. N2 ephemeral 1x1 destination top-left (445,1480) lies outside reverse mouth, has no sampled wall/occupancy collision, and overlaps only N2 Walkable Railway Margin Notice. T1 ephemeral 1x1 destination top-left (3690,1380) lies outside reverse mouth without other Region overlaps. N2 2x2 position top-left (385,1420) collides with destination return mouth rectangle and N2 story interpretation Region despite token center-based testInsideRegion being false at mouth; full 2D bounding-box check is required. Do not install a two-square automatic route. No RegionBehavior installed, flag bound, token moved or player canary run.',
'campaign','local','active','S-2026-10-07-CL50-R2-EPHEMERAL-FOOTPRINT',NULL,
'CL50 R2 one-square arrival footprint geometry noWrite note');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT f.fact_id,f.title,f.statement,f.tags FROM kb_facts f WHERE f.fact_id='F-2026-10-07-CL50-R2-ARRIVAL-PREVIEW'
AND NOT EXISTS(SELECT 1 FROM facts_fts t WHERE t.fact_id=f.fact_id);

INSERT OR REPLACE INTO kb_trials(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id) VALUES
('TR-2026-10-07-CL50-R2-CENTER-VS-FOOTPRINT',
'central-lodge.CL50',
'Non-persistent 2x2 test token center reports not inside N2 return mouth even as physical bounding box overlaps it and N2 observation Region.',
'Compared Foundry testInsideRegion and exact rectangular token-to-Region overlap in read-only R2 ephemeral spawn preview.',
'Token-center approach is insufficient to detect full token footprint intersection with narrow station corridors.',
'Require full token bounding-box collision test before staging any automatic arrival; stage only 1x1 for R2 and send larger tokens to manual GM navigation.',
'READONLY_REPRODUCED_AND_GUARD_RECORDED',
'S-2026-10-07-CL50-R2-EPHEMERAL-FOOTPRINT');
INSERT INTO trials_fts(trial_id,area,symptom,attempted_approach,failure_cause,correction)
SELECT trial_id,area,symptom,attempted_approach,failure_cause,correction FROM kb_trials
WHERE trial_id='TR-2026-10-07-CL50-R2-CENTER-VS-FOOTPRINT'
AND NOT EXISTS(SELECT 1 FROM trials_fts t WHERE t.trial_id=kb_trials.trial_id);
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_cl50_r2_landing_status','PASS_READONLY_GEOMETRY_1X1; TWO_BY_TWO_N2_COLLIDES; NOT_INSTALLED'),
('central_lodge_cl50_r2_landing_receipt','docs/CL50-R2-N2-T1-ARRIVAL-PREFLIGHT-2026-10-07.md');
