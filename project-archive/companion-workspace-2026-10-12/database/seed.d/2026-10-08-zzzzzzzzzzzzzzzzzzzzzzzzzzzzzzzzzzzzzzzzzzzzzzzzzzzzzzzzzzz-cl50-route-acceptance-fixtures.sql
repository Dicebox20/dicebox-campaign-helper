-- CL50 route acceptance test harness and no-write eight-mouth proof.
-- Documentation and reusable local QA only, no Foundry writes and no installer source change.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CL50-ROUTE-CONTRACT-ACCEPTANCE',
'CL50 R1-R4 accepted-route offline negative-case fixtures and live eight-mouth read-only readback',
'verification','Central Lodge CL50 route contract acceptance research',
'User-approved four route pairings, accepted AGENTS/KB source precedence, frozen R1 staged SHA receipt, Node built-in test runner and authorized Foundry 14.367 read-only Scene/Region snapshots',
'active',
'docs/CL50-ROUTE-ACCEPTANCE-CONTRACT-FIXTURES-2026-10-07.md; work/foundry-playwright-harness/cl50-route-contract-acceptance-fixtures-v001.cjs; work/foundry-playwright-harness/cl50-eight-mouth-geometry-readonly-v001.page.js',
'2026-10-07','Node 24/24 offline checks PASS; 8 endpoint live noWrite PASS; 21/202/116/33 ledger rev1 at latest noWrite smoke',
'Offline tests make no claims of an installed and functioning cross-Scene travel implementation; previous installer safety block remains.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL50-ROUTE-ACCEPTANCE-FIXTURES',
'campaign.central-lodge.routes',NULL,
'R1-R4 source-only route acceptance fixtures PASS 24 and eight mouth IDs live unchanged',
'The independent offline Node fixture test suite cl50-route-contract-acceptance-fixtures-v001.cjs passed 24/24: eight accepted unique mouth Regions and four bidirectional pairings; eight 1x1 sample token footprints avoid own return mouth; two-square samples at N2 A/B collide with reverse mouth despite non-colliding centers; R4 large-size samples clear only their local geometry; frozen R1 staged source SHA digests unchanged with unsafe first-GM and unpinned preflight/commit patterns still present; synthetic acceptance guard rejects 17 fault classes such as incorrect executor, missing lease/consent/ownership, transfer uncertainty, token oversize, wall unknown, occupied/shifted landing and puzzle Region overlap. The suite uses offline fixtures only, and does not implement or validate a live teleport. Separate live Foundry read-only source confirms exact eight stable IDs and shape coordinates, all eight mouth RegionBehavior counts zero and T1/T2 unbound. R1 installer safety-block and independently blocked database verifier remain unresolved. No live gameplay state changed.',
'campaign','local','active','S-2026-10-07-CL50-ROUTE-CONTRACT-ACCEPTANCE',NULL,
'CL50 railway offline route contract fixture 24 tests source-only 8 Region IDs');
INSERT INTO facts_fts(fact_id,title,statement,tags)
 SELECT f.fact_id,f.title,f.statement,f.tags FROM kb_facts f WHERE f.fact_id='F-2026-10-07-CL50-ROUTE-ACCEPTANCE-FIXTURES'
 AND NOT EXISTS(SELECT 1 FROM facts_fts x WHERE x.fact_id=f.fact_id);

INSERT OR REPLACE INTO kb_trials(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id) VALUES
('TR-2026-10-07-CL50-OFFLINE-ACCEPTANCE-NEGATIVES',
'central-lodge.CL50',
'Legacy 38 static R1 checks passed without detecting unsafe GM election or independent commit placement, and whole-body collisions at N2 were invisible to center membership tests.',
'Documented exact endpoint fixture map from live read-only Foundry, built deterministic offline synthetic contract checks with 17 intentionally rejected unsafe inputs and immutable frozen source SHA checks.',
'The earlier source verification checked selected strings and syntax rather than the negative-case semantics required for safe reciprocal travel.',
'Require one reviewed executor lease, real consent/ownership and source binding, one pinned actual-commit safe token-sized destination, no in-flight/unknown state, return mouth and puzzle Region avoidance. Preserve original staged scripts as known-bad evidence; do not promote before independently supported full runtime test.',
'PASS_OFFLINE_TESTS_24_ZERO_LIVE_WRITES',
'S-2026-10-07-CL50-ROUTE-CONTRACT-ACCEPTANCE');
INSERT INTO trials_fts(trial_id,area,symptom,attempted_approach,failure_cause,correction)
 SELECT t.trial_id,t.area,t.symptom,t.attempted_approach,t.failure_cause,t.correction FROM kb_trials t
 WHERE t.trial_id='TR-2026-10-07-CL50-OFFLINE-ACCEPTANCE-NEGATIVES'
 AND NOT EXISTS(SELECT 1 FROM trials_fts x WHERE x.trial_id=t.trial_id);

INSERT OR REPLACE INTO kb_tools(tool_id,project_id,project_name,tool_name,tool_kind,invocation,location,capability,authority,evidence_status,source_id,tags) VALUES
('TOOL-2026-10-07-CL50-OFFLINE-ACCEPTANCE',
'dicebox-campaign-helper','DiceBox Campaign Helper',
'CL50 R1-R4 offline synthetic route acceptance fixtures and frozen R1 SHA checks',
'verifier',
'From work/foundry-playwright-harness: node --test cl50-route-contract-acceptance-fixtures-v001.cjs; for separate world read-only evidence, node exec-page.mjs read cl50-eight-mouth-geometry-readonly-v001.page.js',
'work/foundry-playwright-harness/',
'Offline 24-test table of eight approved routes, token footprints, intentional wrong-GM, placement drift and state negative fixtures; separate noWrite live mouth identity readback.',
'Offline/research only, not a Foundry installer, native transport or gameplay canary; exact staged SHA files must remain unmodified.',
'PASS_OFFLINE_24_AND_LIVE_ENDPOINT_NO_WRITE',
'S-2026-10-07-CL50-ROUTE-CONTRACT-ACCEPTANCE',
'CL50 route test harness noInstall noWrite');
INSERT INTO tools_fts(tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags)
 SELECT t.tool_id,t.project_id,t.project_name,t.tool_name,t.invocation,t.location,t.capability,t.authority,t.tags FROM kb_tools t
 WHERE t.tool_id='TOOL-2026-10-07-CL50-OFFLINE-ACCEPTANCE'
 AND NOT EXISTS(SELECT 1 FROM tools_fts x WHERE x.tool_id=t.tool_id);

UPDATE kb_open_items SET
 next_action='R1-R4 offline route contract acceptance fixtures 24/24 pass as SYNTHETIC only. Next independently research exact-version Foundry cross-Scene fixed destination pinning and atomicity guarantees, plus approved GM/player event identity. Keep prior R1 source hashes frozen; draft a reviewed new version only when safety-blocked installer route is resolved without bypass. No player canary yet.',
 evidence_needed='Proven same checked-and-committed token-sized landing guarantee under dynamic occupants/door changes, deterministic one-authorized-GM executor, real token owner consent and no-bounce across refresh; supported guarded installer path and independent GM/player acceptance.',
 source_id='S-2026-10-07-CL50-ROUTE-CONTRACT-ACCEPTANCE'
 WHERE item_id='O-2026-10-07-CL50-R1-FROZEN-SOURCE-SEMANTIC';
DELETE FROM open_items_fts WHERE item_id='O-2026-10-07-CL50-R1-FROZEN-SOURCE-SEMANTIC';
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
 SELECT i.item_id,i.title,i.problem,i.next_action,i.evidence_needed FROM kb_open_items i
 WHERE i.item_id='O-2026-10-07-CL50-R1-FROZEN-SOURCE-SEMANTIC';

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_cl50_acceptance_suite','PASS_OFFLINE_24_24; READONLY_EIGHT_MOUTHS; NOT_INSTALLED'),
('central_lodge_cl50_acceptance_receipt','docs/CL50-ROUTE-ACCEPTANCE-CONTRACT-FIXTURES-2026-10-07.md');
