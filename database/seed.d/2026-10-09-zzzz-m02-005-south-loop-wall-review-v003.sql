-- 2026-10-09 | Beyond the Realms M02 Tallcap Forest | attempt #5 v003.
-- Chronological evidence only; all prior inspection, attempts and candidate v001/v002 remain unchanged.
INSERT INTO kb_sources (
 source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
 'S-2026-10-09-M02-005-FULL-SWEEP-V003',
 'M02 attempt 005 southern-loop route reconciliation and critical wall uncertainty audit v003',
 'campaign',
 'Beyond the Realms Underdark expedition M02 Tallcap Forest attempt 005',
 'Exact unchanged grayscale attempt 005 source SHA256 878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf; independently computed Shapely source-pixel route sweep and official spatialBlueprintSchema + DiceBox Geometry Tolerance v0.1 TypeScript checks; NOT a Foundry runtime canary',
 'active',
 'https://github.com/Dicebox20/dicebox-campaign-helper/blob/maps/btr-m02-tallcap-forest-prepare-20261009/work/btr-underdark-expedition/M02-ATTEMPT5-SOUTH-LOOP-AND-WALL-ALIGNMENT-REVIEW-v003.md',
 '2026-10-09',
 'dicebox-m02-005-south-and-wall-qa/v003',
 'All 203 proposed Wall segments and 23 grounded-obstacle groups preserved. Main/north/south centerlines now non-self-crossing with provisional 5ft Medium swept clearance. Estimated ground-edge uncertainty 6 native pixels = 0.703125ft; true wall-placement error not certified, so painterly gate remains HOLD.'
);
INSERT INTO kb_facts (
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES (
 'F-2026-10-09-M02-005-FULL-SWEEP-V003',
 'campaign.beyond-the-realms',NULL,
 'M02 attempt 005 v003 three route models pass but wall-source precision blocks painting',
 'Attempt 005 original SHA256 878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf. The v002 southern centerline intersected the southeast ridge rock, and northern line self-crossed at approximate source (863.86,157.60). v003 preserves all 203 full Wall segments, 23 real-ground blocker candidates, six Regions and six anchors; removes two redundant north route waypoints and traces southern roadway around the east of ridge. All three revised centerlines are simple and satisfy modelled 5ft Medium-radius 21.333px plus assumed 6px boundary uncertainty: nearest solid distances main 48.926px, north 34.253px, south 30.431px; positive residuals 21.592px, 6.920px, 3.098px. Four branch-road connectors and six Region anchor circles pass proposed geometry tests. Official spatialBlueprintSchema v0.1.0 passes. Ground-wall accuracy at critical upper north crest, rim and lower southeast rock remains estimated plus/minus 6px = 0.703ft, in >0.5ft review band; source ground mask/upper canopy overlap remains uncertain. PAINTERLY RENDER NOT AUTHORIZED, not a new grayscale REDO, no Foundry edits.',
 'campaign','deterministic','provisional',
 'S-2026-10-09-M02-005-FULL-SWEEP-V003',NULL,
 'M02 Tallcap Forest attempt 5 grayscale geometry v003 5ft Medium clearance north south route wall precision painterly hold'
);
INSERT INTO kb_trials (
 trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id
) VALUES (
 'T-2026-10-09-M02-005-SOUTH-SWEEP-V003',
 'M02 Tallcap Forest southern rock bend and northern route simplicity',
 'Previous southern route centerline intersects real southeast standing rock. Prior northern route passed rock-distance tests but self-intersects. Critical rock and cave-edge wall positions still lack independently measured <=0.5ft accuracy.',
 'Trace the brighter southern route east around the existing ridge; run source-pixel 5ft disk route A* with conservative 30px obstacle-buffer at luminance thresholds 70 through 110; simplify to 27 source waypoints, remove north self-cross with 29-waypoint route, check route segment-versus-polygon/ellipse/cavern lines, branch connectors and six Region anchor enclosures; run canonical spatial schema and project tolerance guards.',
 'Pure obstacle clearance did not test route self-intersections or true floor classification; 6px estimated source edge location uncertainty is 0.703125ft and remains REVIEW under accepted wall placement standard.',
 'Preserve all grounded objects. Retain v003 only as candidate. Independently confirm grounded rock/upper cave boundary within 0.5ft or obtain explicit documented tolerance exception, distinguish southeast canopy from full blocker, and verify walkable floor before painterly lock.',
 'MODEL_PASS_WALL_ALIGNMENT_REVIEW_NO_LIVE_FOUNDRY',
 'S-2026-10-09-M02-005-FULL-SWEEP-V003'
);
UPDATE kb_open_items
 SET status='in_progress',
 problem='M02 attempt 005 v003 all modeled required 5ft Medium route sweeps PASS and six provisional Region anchor enclosures PASS; remaining blocker is independently uncertified rock/cave wall alignment estimated 0.703ft vs 0.5ft target and possible southeast overhead mushroom-cap footprint misclassification. PAINTERLY RENDER not yet approved.',
 next_action='Perform focused actual-ground contour audit for north upper crest rock/cavern rim and southeast standing ridge, including southeast outer rock versus mushroom canopy silhouette; establish <=0.5ft alignment confidence or user-approved documented exception. Confirm genuine continuously walkable 5ft floor on all three routes, then rerun v003 sweep/schema and issue a separate structural approval receipt before PAINTERLY RENDER. Do not make Foundry writes.',
 evidence_needed='Attempt 005 exact SHA-bounded independent floor/rock contour alignment evidence; >=5ft cleared routes, six accessible Region anchors, documented bottlenecks only when intentional, accurate full-wall classifications, and versioned structural PASS or explicit HOLD decision.'
 WHERE item_id='O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE' AND status='in_progress';
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-09-M02-005-FULL-SWEEP-V003';
INSERT INTO trials_fts (trial_id,area,symptom,attempted_approach,failure_cause,correction)
 SELECT trial_id,area,symptom,attempted_approach,failure_cause,correction FROM kb_trials
 WHERE trial_id='T-2026-10-09-M02-005-SOUTH-SWEEP-V003';
DELETE FROM open_items_fts WHERE item_id='O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
 WHERE item_id='O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE';
INSERT INTO kb_relationships (relationship_id,from_type,from_id,relation,to_type,to_id,notes)
 VALUES (
 'R-2026-10-09-M02-005-ROUTES-TO-WALL-LOCK',
 'fact','F-2026-10-09-M02-005-FULL-SWEEP-V003','requires-next',
 'open_item','O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE',
 'All provisional sweeps pass but wall/source accuracy must be independently resolved before painterly lock'
 );
