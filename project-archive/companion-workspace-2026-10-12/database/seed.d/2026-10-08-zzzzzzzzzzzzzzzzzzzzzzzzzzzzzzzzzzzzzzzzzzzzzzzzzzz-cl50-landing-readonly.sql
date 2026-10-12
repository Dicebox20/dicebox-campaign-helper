-- CL-50 2026-10-07 read-only landing preflight and trigger overlap.
-- Documentary KB reconciliation only. No Foundry / game mutation authority granted.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CL50-RAILWAY-LANDING-READONLY',
 'CL-50 eight railway landing-zone candidate and RegionBehavior overlap read-only audit',
 'verification','Central Lodge T1/T2/N1/N2/N3 railway travel planning',
 'Exact installed Foundry Scene and Region objects, source routines, governed CL-50 topology policy, no-write runtime execution',
 'active',
 'docs/CL50-RAILWAY-LANDING-OVERLAP-READONLY-2026-10-07.md; work/foundry-playwright-harness/cl50-railway-landing-readonly-v001.page.js; work/foundry-playwright-harness/cl50-railway-overlap-readonly-v001.page.js',
 '2026-10-07','Foundry14.367 dnd5e5.3.3 21/202/116/33, ledgerRev1',
 'Owned no-write research evidence; does not authorize a destination binding, automatic teleport or bypass for story/gate Region behavior.');
INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL50-RAILWAY-ARRIVAL-OVERLAP',
 'campaign.central-lodge.routes',NULL,
 'CL-50 eight candidate arrival centers and overlapping gates preflight source-verified',
 'Live no-write landing PREVIEW inspected eight Region anchors in N1/T1/N2/T2/N3. Four points did not overlap other rectangular Regions. Four candidate centers overlapped existing Regions, with zero nearby token-center collisions and zero direct approach wall crossings observed. N1 East candidate (3620,1470) intersects the Three-Proof Station Power TOKEN_ENTER gate and a notice; N2 tunnel A/B (670,1540)/(3650,1540) intersect a story observation that targets puzzles.n2.grottoStationInterpreted, a notice and passive lighting; N3 West (710,1470) intersects a notice and passive lighting. No overlapping behavior source contains teleportToken, but this does not prove no bounce once new transit behavior is installed. The 4 hypothesized N1-T1-N2-T2-N3 pairings are NOT approved; T1/T2 orientation remains UNBOUND_DO_NOT_GUESS. No GM/player canary because only the two GM clients were connected. The result is candidate-center research, not full token-footprint/navmesh/runtime proof.',
 'campaign','local','active','S-2026-10-07-CL50-RAILWAY-LANDING-READONLY',NULL,
 'CL50 railway landing arrival trigger overlap gate notice no-bounce preliminary research');
INSERT INTO facts_fts(fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts
 WHERE fact_id='F-2026-10-07-CL50-RAILWAY-ARRIVAL-OVERLAP'
 AND NOT EXISTS(SELECT 1 FROM facts_fts ff WHERE ff.fact_id=kb_facts.fact_id);
INSERT OR REPLACE INTO kb_trials(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id) VALUES
('TR-2026-10-07-CL50-LANDING-OVERLAP-CLASSIFICATION',
 'central-lodge.CL50',
 'Four of eight inward-offset candidate arrival centers overlap existing RegionBehaviors despite no token or wall intersection.',
 'Read-only two-grid inward arrival-center and rectangular Region overlap classification; second audit read exact overlapping sources.',
 'A point-position no-wall check alone misses possible TOKEN_ENTER gate and story observation side effects. Rectangular overlap is not equivalent to token footprint or full navigability.',
 'Distinguish candidate geometry from accepted route authority. Explicitly identify N1 rail-power gate, N2 interpretation observer and railway notices; retain approval/footprint/canary blockers instead of calling them harmless.',
 'PASS_READONLY_WITH_REVIEW_NO_LIVE_CANARY',
 'S-2026-10-07-CL50-RAILWAY-LANDING-READONLY');
INSERT INTO trials_fts(trial_id,area,symptom,attempted_approach,failure_cause,correction)
 SELECT trial_id,area,symptom,attempted_approach,failure_cause,correction
 FROM kb_trials WHERE trial_id='TR-2026-10-07-CL50-LANDING-OVERLAP-CLASSIFICATION'
 AND NOT EXISTS(SELECT 1 FROM trials_fts t WHERE t.trial_id=kb_trials.trial_id);
INSERT OR REPLACE INTO kb_tools(tool_id,project_id,project_name,tool_name,tool_kind,invocation,location,capability,authority,evidence_status,source_id,tags) VALUES
('TOOL-2026-10-07-CL50-LANDING-READONLY',
 'dicebox-campaign-helper','DiceBox Campaign Helper',
 'CL-50 railway arrival and behavior overlap read-only audits','verifier',
 'From work/foundry-playwright-harness: node exec-page.mjs read cl50-railway-landing-readonly-v001.page.js; node exec-page.mjs read cl50-railway-overlap-readonly-v001.page.js',
 'work/foundry-playwright-harness/',
 'Inspects original installed Scene/Region/Wall/Token candidates and source snippets, returns labeled risks without mutations.',
 'Exact authorized Assistant Gamemaster read-only world browser; no canon destination decision or execution authority.',
 'PASS_NO_WRITE_PREVIEW_WITH_REVIEW','S-2026-10-07-CL50-RAILWAY-LANDING-READONLY','CL50 railway preflight no-bounce');
INSERT INTO tools_fts(tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags)
 SELECT tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags
 FROM kb_tools WHERE tool_id='TOOL-2026-10-07-CL50-LANDING-READONLY'
 AND NOT EXISTS(SELECT 1 FROM tools_fts t WHERE t.tool_id=kb_tools.tool_id);
UPDATE kb_open_items
 SET problem='T3 ancient passage to F1 and T3 N3 branch return were source-certified previously. T1/T2 mouth orientation remains UNBOUND_DO_NOT_GUESS. Read-only eight-point landing preflight found 4 candidate centers overlapping incidental station/railway Regions, including N1 Three-Proof Station Power and N2 Interpretation TOKEN_ENTER state writer; no token or straight wall collision at sampled centers.',
     next_action='Obtain explicit original-canon or primary-GM exact T1/T2 mouth orientation approval, then review candidate landing side effects, selected token footprints, walls, owner scope, no-bounce/decline guard and source behavior before writing single guarded transit slice. Confirm real player canary when available.',
     evidence_needed='Exact approved Scene/Region stableId destination mapping and optional reciprocal semantics; player token footprint/door/Wall collision check; approved gate/notice behavior on teleport arrival; independent PREVIEW/FINAL VERIFY and controlled primary-GM/player canary.',
     source_id='S-2026-10-07-CL50-RAILWAY-LANDING-READONLY'
 WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';
DELETE FROM open_items_fts WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_cl50_railway_landing_preflight','PASS_READONLY_WITH_REVIEW; 8 centers; 4 overlapping other Regions incl N1 gate/N2 state observe; approved orientation absent; no player canary'),
('central_lodge_cl50_landing_preflight_receipt','docs/CL50-RAILWAY-LANDING-OVERLAP-READONLY-2026-10-07.md');
