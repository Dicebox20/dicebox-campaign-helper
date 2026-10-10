-- 2026-10-09 — M02 Tallcap Forest attempt #5 north loop source-ground geometry review v002.
-- Append-only chronology; prior v001 and original REDO receipts remain unmodified.
INSERT INTO kb_sources (
 source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
 'S-2026-10-09-M02-005-NORTH-GROUND-REVIEW-V002',
 'M02 attempt 005 northern ground rock and swept-clearance geometry audit v002',
 'campaign','Beyond the Realms Underdark expedition M02 scene',
 'Exact original PNG SHA-256 878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf; source-bound v002 manifest/blueprint and reproducible geometry-tolerance audit on isolated worktree, no Foundry movement canary',
 'active',
 'https://github.com/Dicebox20/dicebox-campaign-helper/blob/maps/btr-m02-tallcap-forest-prepare-20261009/work/btr-underdark-expedition/M02-ATTEMPT5-NORTH-GROUND-BOUNDARY-REVIEW-v002.md',
 '2026-10-09','m02-attempt5-north-ground-geometry-v002',
 '203 candidate full walls (+10 for previously omitted grounded north crest rock), six Regions, six anchors, one floor. North modeled 5ft swept route candidate passes with assumed 6px boundary uncertainty; wall placement still REVIEW; south draft centerline crosses solid ridge. Painting remains blocked.'
);
INSERT INTO kb_facts (
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES (
 'F-2026-10-09-M02-005-NORTH-GROUND-QA-V002',
 'campaign.beyond-the-realms',NULL,
 'Attempt 005 north geometry refined without altering obstacles; painting gate still blocked',
 'M02 grayscale attempt 005 QA on SHA 878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf: old western north line was 17.67px from a grounded rock (<21.333px Medium half-footprint); east straight line crossed previously omitted solid rock at source x897..979,y99..157. New source-specific northern route curves around these obstacles without removing any of the original 193 full wall segments or 22 solid groups, and adds 10 Walls for the new rock (203 total). Swept modeled-solid distances: main 48.926px PASS draft, north 31.391px PASS draft, south 0px FAIL draft by intersecting southeast ridge. New north source uncertainty 6px=0.703ft exceeds 0.5ft wall alignment target; true walkable-floor evidence and Foundry movement not verified. Canonical spatialBlueprintSchema passed. Keep Blueprint and painterly render locked until southern centerline and critical walls are reconciled.',
 'campaign','deterministic','provisional',
 'S-2026-10-09-M02-005-NORTH-GROUND-REVIEW-V002',NULL,
 'M02 north loop south ridge blocker 5ft swept clearance 203 walls 23 rocks wall alignment 0.5ft'
);
INSERT INTO kb_trials (
 trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id
) VALUES (
 'T-2026-10-09-M02-005-NORTH-GEOMETRY-REVIEW-V002',
 'M02 Tallcap Forest ground-boundary mapping',
 'Existing v001 northern line grazed a grounded spire; separately the source upper bend contains a rock cluster omitted from the original collision model. Later complete-route audit reveals south centerline crosses a known rock.',
 'Visually re-examine x423,282 to x510,162 and x894,173 to x988,115; add the physically grounded upper-crest rock; revise only northern centerline; run exact polygon/segment swept-token geometry against all source-specific candidate solids and both drafted cavern boundary polylines; run canonical schema and geometry tolerance guards.',
 'The initial brightness-connected path and sparse geometry inventory did not capture all real ground obstacles; modelled clearance was not equivalent to actual floor and the south draft route had a collision.',
 'Keep 203-wall v002 candidate; verify physical ground edges within accepted 0.5ft alignment, refit south route around real rock without deletion, and run independent 5ft swept-token and Region checks before painterly approval.',
 'REVIEW_MODEL_PASS_NORTH_SOUTH_DRAFT_FAIL',
 'S-2026-10-09-M02-005-NORTH-GROUND-REVIEW-V002'
);
UPDATE kb_open_items SET status='in_progress',
 problem='M02 attempt 005 v002 north modeled obstacle sweep passes, but source-ground wall alignment remains 0.703ft uncertain and the unchanged southern loop draft centerline crosses the physical southeast ridge. Paint gate remains closed.',
 next_action='Correct southern loop centerline at source (1132,827) to (1248,728) around actual southeast ridge without deleting physical blockers. Review north upper-crest rock and cavern rim edge alignment to <=0.5ft preferred target, validate all routes as actual continuous walkable floor with 5ft Medium swept footprint and Region accessibility, and rerun spatial/geometry tests before approving PAINTERLY RENDER.',
 evidence_needed='Attempt 005 v003 source-ground boundary and revised southern route, uncertainty-controlled wall alignment, honest continuous 5ft floor sweep and Region checks, plus a new immutable structural acceptance receipt if PASS.'
 WHERE item_id='O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE' AND status IN ('open','in_progress');
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-09-M02-005-NORTH-GROUND-QA-V002';
INSERT INTO trials_fts (trial_id,area,symptom,attempted_approach,failure_cause,correction)
 SELECT trial_id,area,symptom,attempted_approach,failure_cause,correction FROM kb_trials
 WHERE trial_id='T-2026-10-09-M02-005-NORTH-GEOMETRY-REVIEW-V002';
DELETE FROM open_items_fts WHERE item_id='O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
 WHERE item_id='O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE';
INSERT INTO kb_relationships (relationship_id,from_type,from_id,relation,to_type,to_id,notes)
 VALUES (
 'R-2026-10-09-M02-005-NORTH-TO-SOUTH-QA',
 'fact','F-2026-10-09-M02-005-NORTH-GROUND-QA-V002','requires-next',
 'open_item','O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE',
 'South loop draft geometry and precise north rock/cavern boundary proof remain before painterly lock'
 );
