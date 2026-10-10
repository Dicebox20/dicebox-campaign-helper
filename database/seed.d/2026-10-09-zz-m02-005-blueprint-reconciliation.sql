-- 2026-10-09 — M02 Tallcap Forest grayscale attempt 005: Blueprint QA v001, read-only.
-- Chronological additive evidence. Does not overwrite prior image inspection receipts.
INSERT INTO kb_sources (
 source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
 'S-2026-10-09-M02-005-BLUEPRINT-CANDIDATE',
 'M02 attempt 005 fresh Feature Manifest and Spatial Blueprint with raster sensitivity audit',
 'campaign',
 'Beyond the Realms M02 Tallcap Forest scene, grayscale attempt 005',
 'Attempt-005 structural image 878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf; canonical spatial schema and DiceBox tolerance v0.1 static QA. Original M02 history retained.',
 'active',
 'https://github.com/Dicebox20/dicebox-campaign-helper/blob/maps/btr-m02-tallcap-forest-prepare-20261009/work/btr-underdark-expedition/M02-ATTEMPT5-BLUEPRINT-RECONCILIATION-v001.md',
 '2026-10-09',
 'm02-005-blueprint-reconciliation/v001',
 '193 provisional wall segments, 22 independently traced source-image solid footprints, six Region candidates, six anchors, one default semantic Level. Exact image identity verified. Geometry not locked. Painterly and Foundry writes blocked.'
);
INSERT INTO kb_facts (
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES (
 'F-2026-10-09-M02-005-BLUEPRINT-QA',
 'campaign.beyond-the-realms',NULL,
 'M02 attempt 005 has new source-bound draft geometry; north route remains classification-sensitive',
 'New attempt 005 Feature Manifest and Spatial Blueprint were prepared without reusing attempt 004 geometry: 193 wall candidates, 22 solid ground-footprint groups, six Regions and six anchors. Canonical spatialBlueprintSchema v0.1.0 passed and all six provisional anchor footprints fit their Regions without anchor-center overlap on modeled solids. Brightness-based five-foot raster route proxies passed for all 3 routes at threshold 80/85, but northern route disconnected at tighter threshold 90/95. Brightness does not prove traversable floor. Official DiceBox route tolerance assessment holds NEEDS_RECONCILIATION because real ground boundary precision, clearance uncertainty, and swept-token evidence are not certified. Do NOT advance to PAINTERLY RENDER or Injector BUILD yet. Prior M02 historical REDO intact; no Foundry writes.',
 'campaign','deterministic','provisional',
 'S-2026-10-09-M02-005-BLUEPRINT-CANDIDATE',NULL,
 'M02 attempt 5 Tallcap Forest blueprint walls Regions anchors tolerance north route threshold ground clearance'
);
INSERT INTO kb_trials (
 trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id
) VALUES (
 'T-2026-10-09-M02-005-RANGE-THRESHOLD-001',
 'M02 structural grayscale walkable-floor detection',
 'North branch-and-return route appears connected yet visual pixel-intensity classifications change the five-foot traversability result.',
 'Verify authentic attempt 005 PNG SHA, hand-trace 22 rooted solid footprints, constrain north loop against using central road, perform 5ft swept-radius raster proxy pathfinding at Gaussian-blurred luminance thresholds 80,85,90,95; use canonical blueprint and tolerance validators.',
 'A brightness-based floor mask classifies shaded ground inconsistently; north loses proxy connectivity at thresholds 90 and 95 although 80 and 85 pass. This does not establish real impassability or reliable safe movement.',
 'Hold candidate Blueprint for north ground-surface boundary review and source-ground wall precision verification. Do not invent wall movement, delete solid obstacles, regenerate the image, or authorize painting until true five-foot floor clearance is verified.',
 'PROVISIONAL_STATIC_ONLY',
 'S-2026-10-09-M02-005-BLUEPRINT-CANDIDATE'
);
UPDATE kb_open_items
 SET status='in_progress',
 problem='Fresh attempt-005-only candidate Blueprint passed schema and draft anchor checks, but north route source-raster walkability is classification-sensitive; true ground-wall alignment and five-foot swept Medium passage are not yet certified.',
 next_action='Inspect attempt 005 north route (894,173)->(988,115) and (423,282)->(510,162) against grounded rock/trunk source boundaries, not brightness alone; calibrate width uncertainty and wall alignment within the accepted tolerance; sweep-test a 5ft Medium footprint on all three valid floor routes; verify arrival Regions, then lock Blueprint and authorize PAINTERLY RENDER only on evidence-supported PASS.',
 evidence_needed='Independent ground-surface polygon evidence and contour confidence for north loop plus wall-ground 0.5ft alignment and genuine swept-token/Region QA on the exact attempt 005 source SHA, official geometry tolerance PASS with documented variance where appropriate.'
 WHERE item_id='O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE' AND status='open';
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts
 WHERE fact_id='F-2026-10-09-M02-005-BLUEPRINT-QA';
INSERT INTO trials_fts (trial_id,area,symptom,attempted_approach,failure_cause,correction)
 SELECT trial_id,area,symptom,attempted_approach,failure_cause,correction FROM kb_trials
 WHERE trial_id='T-2026-10-09-M02-005-RANGE-THRESHOLD-001';
DELETE FROM open_items_fts WHERE item_id='O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
 WHERE item_id='O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE';
INSERT INTO kb_relationships (relationship_id,from_type,from_id,relation,to_type,to_id,notes)
 VALUES (
 'R-2026-10-09-M02-005-BLUEPRINT-TRACE-GATE',
 'fact','F-2026-10-09-M02-005-BLUEPRINT-QA','requires-next',
 'open_item','O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE',
 'Painting held; next verify actual northern walkable floor and wall edge precision.'
 );
