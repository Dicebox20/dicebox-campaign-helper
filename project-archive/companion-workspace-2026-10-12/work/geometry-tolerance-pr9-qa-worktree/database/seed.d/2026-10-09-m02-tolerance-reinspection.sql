-- 2026-10-09 — independent reinspection of M02 attempt #5 after acceptance of DiceBox geometry tolerance v0.1.
-- Historical attempt #5 REDO remains immutable; this receipt changes interpretation, not past evidence.
INSERT INTO kb_sources (
 source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
 'S-2026-10-09-M02-ATTEMPT5-TOLERANCE-REINSPECTION',
 'M02 Tallcap Forest attempt five, independent structural tolerance reinspection',
 'campaign',
 'Beyond the Realms Underdark Expedition M02 attempt 005 structural stage',
 'Versioned grayscale attempt 005 with verified SHA256 and user-approved dicebox-geometry-tolerance/v0.1; static visual evidence not an installed or swept movement test',
 'active',
 'https://github.com/Dicebox20/dicebox-campaign-helper/blob/maps/btr-m02-tallcap-forest-prepare-20261009/work/btr-underdark-expedition/M02-ATTEMPT5-GEOMETRY-TOLERANCE-REINSPECT-2026-10-09.md',
 '2026-10-09',
 'm02-attempt-005-sha256-878b465f-reinspect-v01',
 'Same immutable grayscale image SHA-256 878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf; dated additive report and JSON receipt on M02 draft branch. Original REDO is preserved.'
);
INSERT INTO kb_facts (
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES (
 'F-2026-10-09-M02-ATTEMPT5-REINSPECT',
 'campaign.beyond-the-realms',NULL,
 'M02 attempt five width-based REDO replaced with walkable-geometry reconciliation hold',
 'Under the approved DiceBox geometry tolerance v0.1, the M02 attempt #5 originally estimated 80-110 source-pixel main-road widths correspond to approximately 9.4-12.9ft in a 36x24 five-foot layout. This is not automatically disqualifying; main road and loop topology appear viable. However uninterrupted true 5ft Medium walkability, ground rock/trunk footprints, intentional bottlenecks and Region clearance remain unverified. New internal verdict NEEDS_RECONCILIATION, no automatic grayscale REDO, no painterly or build approval; original REDO receipt unchanged. Attempt 4 Blueprint data is NOT transferable to attempt 5 image without retracing.',
 'campaign','local','provisional',
 'S-2026-10-09-M02-ATTEMPT5-TOLERANCE-REINSPECTION',NULL,
 'M02 Tallcap Forest grayscale reinspection attempt 5 tolerance blueprint walkability hold'
);
UPDATE kb_open_items SET status='closed',
 next_action='New M02 attempt #5 reinspection completed; next action transferred to O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE. See SHA-256-bound source receipt.'
 WHERE item_id='O-2026-10-09-M02-TOLERANCE-REINSPECTION' AND status='open';
INSERT INTO kb_open_items (
 item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id
) VALUES (
 'O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE',
 'reconciliation',
 'M02 attempt five: trace Medium-passable floor and prepare new Blueprint',
 'Tolerance reinspection removed the old 15ft/10ft absolute visual-width failure but does not certify actual continuous 5ft ground passage on both loops; earlier Blueprint v002 was traced against a different grayscale image.',
 'Use archived attempt 005 PNG at exact SHA-256, trace real walkable floor and grounded solid obstacles; author a fresh attempt-005 Feature Manifest/Blueprint. Confirm full 5ft swept Medium route from west to east and both loop branches, author any narrow main-road bottlenecks, validate Regions and canonical spatial schema; only then promote structural PASS and painterly readiness.',
 'New attempt-005 SHA-256-bound Blueprint, loop width and swept-clearance evidence, Region access, no invented Foundry movements; final structural approval receipt.',
 'P1','open','DiceBox Campaign Helper Foreman',
 'S-2026-10-09-M02-ATTEMPT5-TOLERANCE-REINSPECTION'
);
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-09-M02-ATTEMPT5-REINSPECT';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE';
DELETE FROM open_items_fts WHERE item_id='O-2026-10-09-M02-TOLERANCE-REINSPECTION';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-09-M02-TOLERANCE-REINSPECTION';
INSERT INTO kb_relationships (relationship_id,from_type,from_id,relation,to_type,to_id,notes)
 VALUES (
 'R-2026-10-09-M02-REINSPECT-TO-BLUEPRINT',
 'fact','F-2026-10-09-M02-ATTEMPT5-REINSPECT','requires-next',
 'open_item','O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE',
 'No new image or Foundry writes; exact image hash and historical REDO remain unchanged.'
 );
