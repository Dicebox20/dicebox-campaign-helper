-- 2026-10-09 — DiceBox M02 consolidated, source-indexed Foreman handoff.
-- Additive catalogue metadata; historical v001/v002/v003 inspections and decisions unchanged.
INSERT INTO kb_sources (
 source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
 'S-2026-10-09-M02-005-V003-FOREMAN-HANDOFF',
 'M02 Tallcap Forest attempt #5 consolidated v003 Foreman handoff and 16-file metadata catalogue',
 'campaign',
 'Beyond the Realms Underdark expedition, M02 grayscale attempt 005, spatial blueprint v003 and next Foreman shift',
 'Consolidates separately verified immutable source-bound M02 candidate files, passed geometrical preview tests, accepted DiceBox v0.1 tolerance and 20-minute work-turn cap; not a new structural PASS or Foundry runtime certification',
 'active',
 'https://github.com/Dicebox20/dicebox-campaign-helper/blob/maps/btr-m02-tallcap-forest-prepare-20261009/work/btr-underdark-expedition/M02-ATTEMPT5-V003-FOREMAN-HANDOFF-2026-10-09.md',
 '2026-10-09',
 'm02-attempt005-foreman-handoff-v003/20261009',
 'Machine-readable index: work/btr-underdark-expedition/M02-ATTEMPT5-V003-METADATA-CATALOGUE-2026-10-09.json, listing 16 verified GitHub artifacts and git blob identifiers; original image SHA256 878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf is not a GitHub binary. Main KB already contains detailed v001/v002/v003 evidence, PR 11/12/13. Do not duplicate those sources, facts or trials.'
);
INSERT INTO kb_facts (
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES (
 'F-2026-10-09-M02-005-V003-HANDOFF-INDEX',
 'campaign.beyond-the-realms',NULL,
 'M02 attempt #5 v003 consolidated checkpoint and recovery references',
 'Detailed Foreman handoff and machine-readable 16-file metadata catalogue saved on maps/btr-m02-tallcap-forest-prepare-20261009 branch. Exact source image grayscale_mushroom_cavern_map.png SHA256 878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf, 1536x1024, 3984274 bytes; original binary not confirmed in GitHub. Latest v003 Blueprint candidate 203 Wall segments, 23 solid groups, six Regions, six anchors and one default floor. Main, northern and southern 5ft Medium sweeps pass authored polygon model only, with +21.592px, +6.920px, +3.098px residual clearance after 21.333px token radius and estimated 6px boundary uncertainty. The image does not yet supply independently verified actual-ground confidence, and 6px uncertainty=0.703125ft exceeds preferred 0.5ft wall placement target. PAINTERLY RENDER, Foundry BUILD and INJECT are unauthorized. User-approved 20-minute work-turn cap is active; next task is critical north crest/cavern rim/southeast ridge and canopy-vs-solid precision review. Historical candidate v001/v002, original attempt #5 REDO, prior SQL migrations and no-write boundary are preserved.',
 'campaign','created_document','active',
 'S-2026-10-09-M02-005-V003-FOREMAN-HANDOFF',NULL,
 'handoff M02 Tallcap Forest metadata catalogue grayscale attempt5 v003 wall precision blocked painterly twenty minute cap'
);
INSERT INTO kb_open_items (
 item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id
) VALUES (
 'O-2026-10-09-M02-005-SOURCE-ART-ASSET-STAGING',
 'reconciliation',
 'Make original M02 grayscale attempt #5 source image durably retrievable by content hash',
 'GitHub has authoritative source SHA256 and geometry documents but not a verified committed original 1536x1024 PNG asset. Future chat sessions and desktop app must not assume container-local image paths or invented GitHub URLs exist.',
 'On the next authorized image review session locate original grayscale_mushroom_cavern_map.png, compute SHA256 and compare with 878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf; then stage it to a user-approved immutable repo/storage location or record a verified retrieval identifier, without editing pixels. If unavailable, ask user for upload before reviewing visual ground contours.',
 'Exact original raster bytes with matching SHA256, verifiable persistent path/URL, provenance and no-edit receipt.',
 'P1','open',
 'DiceBox Campaign Helper Foreman',
 'S-2026-10-09-M02-005-V003-FOREMAN-HANDOFF'
);
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts
 WHERE fact_id='F-2026-10-09-M02-005-V003-HANDOFF-INDEX';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
 WHERE item_id='O-2026-10-09-M02-005-SOURCE-ART-ASSET-STAGING';
INSERT INTO kb_relationships (relationship_id,from_type,from_id,relation,to_type,to_id,notes)
 VALUES (
 'R-2026-10-09-M02-005-HANDOFF-TO-TRACE',
 'fact','F-2026-10-09-M02-005-V003-HANDOFF-INDEX','requires-next',
 'open_item','O-2026-10-09-M02-ATTEMPT5-BLUEPRINT-TRACE',
 'Source-bound actual-floor and critical wall/canopy review blocks painterly approval.'
 ),(
 'R-2026-10-09-M02-005-HANDOFF-TO-ART',
 'fact','F-2026-10-09-M02-005-V003-HANDOFF-INDEX','requires-next',
 'open_item','O-2026-10-09-M02-005-SOURCE-ART-ASSET-STAGING',
 'Original raster must be accessible and hash-confirmed before further visual inspection.'
 );
