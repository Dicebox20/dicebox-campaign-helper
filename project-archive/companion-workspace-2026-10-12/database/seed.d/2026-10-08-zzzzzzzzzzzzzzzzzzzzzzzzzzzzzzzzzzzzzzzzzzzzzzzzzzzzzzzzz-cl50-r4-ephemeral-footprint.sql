-- CL-50 R4 read-only footprint preflight. Documentary SQLite only: no live Foundry route authority.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('S-2026-10-07-CL50-R4-EPHEMERAL-FOOTPRINT',
'CL-50 R4 T2 Mouth B to N3 West exact endpoint and ephemeral landing footprint preflight',
'verification','Central Lodge approved R4 railway topology, no-write geometry',
'User-locked exact R4 mapping and no-write Foundry 14.367/dnd5e5.3.3 Scene, Region, Wall, Token, RegionBehavior and spawnTokens(create:false) readback',
'active','docs/CL50-R4-T2-N3-ARRIVAL-PREFLIGHT-2026-10-07.md; work/foundry-playwright-harness/cl50-r4-endpoint-readonly-v001.page.js; work/foundry-playwright-harness/cl50-r4-arrival-footprint-readonly-v001.page.js',
'2026-10-07','R4 READONLY_DIAGNOSTIC_PASS; T2 and N3 tokens=0; ledgerRev1',
'Simulated geometry only, no approved arrival-coordinate installation, no route behavior written, no real player canary.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES('F-2026-10-07-CL50-R4-ARRIVAL-PREVIEW',
'campaign.central-lodge.routes',NULL,
'R4 T2 Mouth B to N3 West ephemeral 1x1 and 2x2 arrivals clear return-mouth in read-only geometry',
'User-approved R4 is T2 Mouth B Scene ez9MSQ8QIO4cW6zo Region OOmnx3XAmw95E410 (stable dbx:central-lodge:t2:region:mouth-b) paired with N3 West Scene pHQvDUDlyWZFuNrX Region foYsFHsLXtCbfiyR (stable dbx:central-lodge:n3:region:n3-main-railway-west). Read-only ephemeral token rectangles returned T2 top-left 1x1 (3650,1350), 2x2 (3590,1290) with no other Region overlap; N3 top-left 1x1 (740,1430), 2x2 (680,1370) overlapping only existing N3 railway notice and passive Depot Lighting, not story/puzzle Regions. All four sampled rectangles were in Scene bounds, unoccupied, free of return-mouth footprint overlap and free of sampled straight-line movement Wall intersections. Both source Regions remained without travel RegionBehaviors, and T2 Mouth B was still UNBOUND_DO_NOT_GUESS. Actual token-sized pathfinding/navmesh and player canary not certified. R1/R2/R3 narrow landing limits still require fail-closed larger-token handling for an end-to-end railway trip. No live world mutation or token teleport.',
'campaign','local','active','S-2026-10-07-CL50-R4-EPHEMERAL-FOOTPRINT',NULL,
'CL50 R4 railway 1x1 2x2 ephemeral landing proof source-only nonpersistent geometry');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT f.fact_id,f.title,f.statement,f.tags FROM kb_facts f
WHERE f.fact_id='F-2026-10-07-CL50-R4-ARRIVAL-PREVIEW'
AND NOT EXISTS(SELECT 1 FROM facts_fts t WHERE t.fact_id=f.fact_id);

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_cl50_r4_landing_status','READONLY_DIAGNOSTIC_PASS_1X1_AND_2X2_BOTH_DIRECTIONS; N3_NOTICE_PRESERVED; NOT_INSTALLED'),
('central_lodge_cl50_r4_landing_receipt','docs/CL50-R4-T2-N3-ARRIVAL-PREFLIGHT-2026-10-07.md'),
('central_lodge_cl50_four_route_landing_preflight','R1_R2_R3_R4_READONLY_CANDIDATES_COMPLETE; R1_R2_R3_NARROW_1X1; R4_1X1_2X2; NO_NEW_ROUTES_INSTALLED');
