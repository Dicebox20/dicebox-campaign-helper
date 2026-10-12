-- CL50 cross-route read-only source review: no live gameplay mutation and no new destination authority.
-- Frozen R1 hashes and historical PREVIEW results remain exact; semantic live promotion is blocked.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CL50-FOUR-ROUTE-INTEGRATION-REVIEW',
 'CL50 R1-R4 integrated landing and frozen R1 source semantic safety review',
 'verification','Central Lodge railway source-only contract and implementation blockers',
 'User-approved R1-R4 locked mapping; 4 independent live no-write footprint receipts; authoritative AGENTS executor authorization; exact Foundry 14.367 live API and current GM IDs',
 'active',
 'docs/CL50-RAILWAY-FOUR-ROUTE-INTEGRATION-REVIEW-2026-10-07.md; work/foundry-playwright-harness/cl50-r1-staged-compatibility-readonly-v001.page.js; work/foundry-playwright-harness/cl50-r1-teleport-one-source-readonly-v001.page.js',
 '2026-10-07','4/4 route landing probes; R1 stage semantic review; world 14.367 dnd5e5.3.3 ledgerRev1',
 'Explicitly no live install authority; the two frozen R1 staged sources are not safe for promotion until reviewed corrective version and supported installation workflow.');
UPDATE kb_facts SET status='superseded' WHERE fact_id='F-2026-10-07-CL50-R1-PREVIEW-PASS';
INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL50-FOUR-ROUTE-REVIEW-BLOCKED',
 'campaign.central-lodge.routes',NULL,
 'CL50 four approved route landing preflights done, R1 staged source NOT live-promotable without corrections',
 'The four user-approved bidirectional N1-T1-N2-T2-N3 railway pairings completed read-only ephemeral landing preflights. All 8 candidate destinations have sampled 1x1 footprint positions outside reverse mouth; R1, R2, R3 are limited to 1x1 for potential automatic network traversal. R2/R3 2x2 arrivals at N2 physically overlap source mouth and station interpretation despite center testInsideRegion false. R4 2x2 geometry passes both ends but does not certify the connected network. Existing notices remain intact. Frozen R1 handler hashes 0d804443760c05410678b6e1a6149da0a214758a43e8efe4ef3144b6056d2fd7 and a03569e8b8bfcc2c1b3fedc969e84b10a30b1186c680f9fa9aad46623a34124b are historically staged and previously passed limited syntax/static checks only. Independent inspection found alphabetical first-active-GM election selects Gamemaster JESWV6CcU7m07VW6, not the authorized Assistant Gamemaster executor pnTxw7VYpYR4IKWE, conflicting with current AGENTS. The staged source also preflights one spawnTokens(create:false) destination then independently invokes teleportToken which calculates destination again, so the prechecked spot is not proven to be the committed spot if runtime occupancy changes. Exact client delivery, durable cooldown and full-footprint placement not certified. R1 source and live installer generation remain blocked. No RegionBehavior was installed or player canary run.',
 'campaign','local','active','S-2026-10-07-CL50-FOUR-ROUTE-INTEGRATION-REVIEW',
 'F-2026-10-07-CL50-R1-PREVIEW-PASS',
 'Central Lodge CL50 cross route source audit blocked GM executor placement preflight commit safety');

INSERT INTO facts_fts(fact_id,title,statement,tags)
 SELECT f.fact_id,f.title,f.statement,f.tags FROM kb_facts f WHERE f.fact_id='F-2026-10-07-CL50-FOUR-ROUTE-REVIEW-BLOCKED'
 AND NOT EXISTS(SELECT 1 FROM facts_fts t WHERE t.fact_id=f.fact_id);

INSERT OR REPLACE INTO kb_trials(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id) VALUES
('TR-2026-10-07-CL50-R1-EXECUTOR-AND-COMMIT-DRIFT',
 'central-lodge.CL50',
 'Frozen R1 source passed 38 syntax/static checks, but its alphabetical GM election ignores the authorized current Assistant Gamemaster and its prechecked arrival is recalculated during teleportToken.',
 'Read exact immutable R1 staged source and inspect authorized GM identities, source API types, teleportTokens and teleportToken actual method implementations through authorized live read-only Foundry.',
 'Static string/hash checks are not contract semantics; source assumes first alphabetically sorted active GM is executor and does not bind preflight sample to actual destination choice.',
 'Do not install frozen R1 v001. Introduce a reviewed new source version with explicit single authorized executor/lease, full-token-footprint eligibility, fixed or transaction-bound destination guarantee, no-bounce and outcome-unknown controls; run independent tests through a supported non-bypassing installer workflow.',
 'REPRODUCED_READONLY_SOURCE_SEMANTIC_BLOCKERS',
 'S-2026-10-07-CL50-FOUR-ROUTE-INTEGRATION-REVIEW');
INSERT INTO trials_fts(trial_id,area,symptom,attempted_approach,failure_cause,correction)
 SELECT t.trial_id,t.area,t.symptom,t.attempted_approach,t.failure_cause,t.correction FROM kb_trials t
 WHERE t.trial_id='TR-2026-10-07-CL50-R1-EXECUTOR-AND-COMMIT-DRIFT'
 AND NOT EXISTS(SELECT 1 FROM trials_fts x WHERE x.trial_id=t.trial_id);

INSERT OR REPLACE INTO kb_open_items(item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id) VALUES
('O-2026-10-07-CL50-R1-FROZEN-SOURCE-SEMANTIC',
 'certification','R1 staged source semantic defects block live route promotion',
 'Frozen staged R1 RegionBehavior sources select first alphabetically active GM, excluding authorized Assistant Gamemaster in present session; preflight spawnTokens candidate differs from separate teleportToken destination computation; token center alone is not sufficient for larger footprints. The earlier installer generation was safety-blocked. Zero new handlers installed.',
 'Keep old two source hashes frozen as historical research, not runnable acceptance. After independently supported review, design a new versioned executable contract with explicit single authorized executor, actual committed fixed full-footprint landing, player owner-scoped consent/no-bounce, rollback and idempotent outcome handling. Do not retry or route around the previous tool safety block.',
 'New reviewed source and trust boundary, exact authorized executor lease, pinned destination placement guarantee, full-footprint/Wall checks, independent no-write preview, guarded installer and final verifier under allowed tooling, real GM/player canary.',
 'P1','blocked','Foreman + Approved Foundry Reviewer','S-2026-10-07-CL50-FOUR-ROUTE-INTEGRATION-REVIEW');
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
 SELECT t.item_id,t.title,t.problem,t.next_action,t.evidence_needed FROM kb_open_items t
 WHERE t.item_id='O-2026-10-07-CL50-R1-FROZEN-SOURCE-SEMANTIC'
 AND NOT EXISTS(SELECT 1 FROM open_items_fts x WHERE x.item_id=t.item_id);

UPDATE kb_open_items SET
 problem='User-approved R1-R4 route topology and all eight proposed 1x1 arrival footprints have read-only evidence, but no new route handler is installed. R1 frozen source has verified GM-election and unbound preflight-to-commit placement hazards. An earlier guarded-installer generation was safety-blocked. R2/R3 2x2 arrivals into N2 overlap return mouths and story Region.',
 next_action='Resolve source-level R1 executor and destination-placement contract through reviewed, supported procedure without bypassing tool safety refusal; preserve all frozen SHA and gameplay state. Then build independent no-write contract acceptance tests and only later consider a narrow guarded installation after a fresh exact-target/ledger/foreign-state reread and real player canary plan.',
 evidence_needed='R1 reviewed corrected version, approved executor lease, same-position validated/committed proof, full-footprint/cooldown/rollback, allowed installer and independent verifier; 1x1 end-to-end GM/player canary. Preserve R1-R4 topology and notice-state behavior.',
 source_id='S-2026-10-07-CL50-FOUR-ROUTE-INTEGRATION-REVIEW'
 WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';
DELETE FROM open_items_fts WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';

INSERT OR REPLACE INTO kb_tools(tool_id,project_id,project_name,tool_name,tool_kind,invocation,location,capability,authority,evidence_status,source_id,tags)
VALUES('TOOL-2026-10-07-CL50-R1-SEMANTIC-API-READONLY',
 'dicebox-campaign-helper','DiceBox Campaign Helper',
 'CL50 staged-R1 executor identity and teleport API live read-only inspection',
 'verifier',
 'From work/foundry-playwright-harness: node exec-page.mjs read cl50-r1-staged-compatibility-readonly-v001.page.js; node exec-page.mjs read cl50-r1-teleport-one-source-readonly-v001.page.js; node exec-page.mjs read cl50-r1-teleport-api-source-v001.page.js',
 'work/foundry-playwright-harness/',
 'Shows active exact-world GM identity election and actual RegionDocument cross-Scene teleport method source without tokens or Scene writes.',
 'Authorized Assistant Gamemaster read-only runtime. NOT an installer, executor credential or player canary.',
 'PASS_READONLY_WITH_SOURCE_SEMANTIC_BLOCKERS',
 'S-2026-10-07-CL50-FOUR-ROUTE-INTEGRATION-REVIEW',
 'CL50 R1 approved GM executor mismatch teleport double-placement');
INSERT INTO tools_fts(tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags)
 SELECT t.tool_id,t.project_id,t.project_name,t.tool_name,t.invocation,t.location,t.capability,t.authority,t.tags FROM kb_tools t
 WHERE t.tool_id='TOOL-2026-10-07-CL50-R1-SEMANTIC-API-READONLY'
 AND NOT EXISTS(SELECT 1 FROM tools_fts z WHERE z.tool_id=t.tool_id);

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_cl50_route_integrated_research','R1_R2_R3_R4_1X1_READONLY_PREFLIGHT_DONE_NO_INSTALL; R1_SOURCE_LIVE_PROMOTION_BLOCKED'),
('central_lodge_cl50_route_integrated_receipt','docs/CL50-RAILWAY-FOUR-ROUTE-INTEGRATION-REVIEW-2026-10-07.md'),
('central_lodge_cl50_r1_frozen_source_status','DO_NOT_INSTALL; LEXICAL_GM_AUTH_CONFLICT; SAMPLE_COMMIT_POSITION_NOT_BOUND; TOOL_SAFETY_BLOCK');
