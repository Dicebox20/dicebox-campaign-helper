-- 2026-10-22 — explicit OWNER-PERMANENT project-wide map artwork standard.
-- Additive rule; historical rejected images remain evidence only.
INSERT INTO kb_sources (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES (
 'S-2026-10-22-REPRESENTATIVE-WALL-BATTLEMAPS',
 'Permanent project-wide representative-wall painterly battlemap standard',
 'project','All new DiceBox tactical maps, renderers, Foundry scene builds, campaigns and side campaigns',
 'Explicit owner instruction 2026-10-22 promoting community-refined art rules to universal permanent map guidance',
 'active','docs/DICEBOX-UNIVERSAL-REPRESENTATIVE-WALL-BATTLEMAP-STANDARD-2026-10-22.md',
 '2026-10-22','dicebox-representative-wall-battlemap/v1',
 'User shrine image is style evidence, not a geometry source. Existing installed art is not retroactively changed. Cabin Foyer and Studio rejected art is preserved as failed evidence.'
);
INSERT INTO kb_decisions (decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review) VALUES (
 'D-2026-10-22-REPRESENTATIVE-WALL-UNIVERSAL',
 'Universal permanent DiceBox representative-wall battlemap visual guidance',
 'All future tactical maps must be strictly overhead painterly plan-view art with representative narrow wall-top footprints and real geometry anchored to approved Spatial Blueprint. No dollhouse/full vertical-wall cutaways, perspective tilt, decorative fake portals, baked grid, tokens or unreadable features. Keep diffuse neutral background illumination; Foundry controls cinematic lights/darkness and atmosphere. Bake only permanent art; dynamic/pickable objects separate. Mandatory visible story/puzzle features from PREPARE must be identifiable. Treat violating art as FINAL_INSPECT REDO even if pretty; cosmetic variation remains acceptable where functional correctness is preserved. All REDO attempts must follow global independent prompt clean restart.',
 'Prior Cabin Foyer/Studio imagery repeatedly drifted to dollhouse cutaways and failed to match owner shrine battlemap positive reference. The owner explicitly elevated corrective guidance to universal project scope.',
 'project','locked','DiceBox Campaign Helper project owner','S-2026-10-22-REPRESENTATIVE-WALL-BATTLEMAPS',NULL
);
INSERT INTO kb_facts (fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES (
 'F-2026-10-22-REPRESENTATIVE-WALL-ART',
 'dicebox.scene-render',NULL,
 'Representative walls are top-facing visual footprints, not full wall-height cutaway',
 'The map background depicts physically legible top-facing narrow stone/timber wall-cap bands with shallow bevel and neutral contact shade, from exactly overhead. It must preserve authentic door endpoints from the authoritative semantic BP/Feature Manifest. Foundry Walls own movement/vision independent of wall art pixels. The global final inspection hard-fails dollhouse, isometric/three-quarter perspective, incorrect wall/door relationship, visible secrets, and missing consequential landmarks.',
 'project','canonical','locked','S-2026-10-22-REPRESENTATIVE-WALL-BATTLEMAPS',NULL,
 'representative walls overhead battlemap plan view cap wall semantic art 90 degrees inspect'
),(
 'F-2026-10-22-PAINTERLY-NEUTRAL-ART',
 'dicebox.scene-render',NULL,
 'Neutral painterly tactical backgrounds reserve cinematic lighting for Foundry',
 'All newly rendered DiceBox game maps default to richly textured painterly art with neutral even diffuse baked illumination, restrained contact shading, no strong baked candle/torch/fireplace/spell/color light pools or Crimson Veil red grading. Separate removable items, movable mechanisms, reveal panels and stage-dependent assets as placeables/overlays; static architecture and furnishings may be baked. Readable 3-7 key fixtures and sufficient walkable space are mandatory. Campaign fast-track can reduce PREPARE but cannot waive this global visual gate.',
 'project','canonical','locked','S-2026-10-22-REPRESENTATIVE-WALL-BATTLEMAPS',NULL,
 'painterly map neutral lighting foundry effects wall caps stateful loot interactables'
);
INSERT INTO kb_open_items (item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id) VALUES (
 'O-2026-10-22-PROJECT-INSTRUCTIONS-MAP-STYLE',
 'implementation','Synchronize universal battlemap visual standard to ChatGPT Project Instructions and image provider guidance',
 'Repository policy and KB seed do not automatically change ChatGPT Project Instructions or desktop image provider preset.',
 'Add short normative statement and canonical URI to authorized ChatGPT Project Instructions and ensure all provider adapters inherit the same wall/camera/lighting/feature validation.',
 'Project Settings readback; provider prompt/style profile and structural/final inspection test receipts for two distinct maps.',
 'P1','open','DiceBox Campaign Helper project owner','S-2026-10-22-REPRESENTATIVE-WALL-BATTLEMAPS'
),(
 'O-2026-10-22-RENDER-PROVIDER-STYLE-CERTIFICATION',
 'certification','Certify wall-cap and neutral-light policy at map provider output gate',
 'Normative repository docs do not by themselves prove the image provider consistently renders representative walls or that desktop map validators reject cutaways.',
 'Run a canary on structurally verified Cabin Foyer and Studio using accepted shrine reference and original master blueprint, inspect samples and wire hard REDO checks before bulk map production.',
 'Per-map positive style/art/geometry receipts and map-lab/Foundry build fixture. No use of prior rejected image as input.',
 'P1','open','DiceBox Campaign Helper Foreman','S-2026-10-22-REPRESENTATIVE-WALL-BATTLEMAPS'
);
INSERT INTO decisions_fts (decision_id,topic,decision,rationale)
 SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id='D-2026-10-22-REPRESENTATIVE-WALL-UNIVERSAL';
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts
 WHERE fact_id IN ('F-2026-10-22-REPRESENTATIVE-WALL-ART','F-2026-10-22-PAINTERLY-NEUTRAL-ART');
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
 WHERE item_id IN ('O-2026-10-22-PROJECT-INSTRUCTIONS-MAP-STYLE','O-2026-10-22-RENDER-PROVIDER-STYLE-CERTIFICATION');
INSERT INTO kb_relationships (relationship_id,from_type,from_id,relation,to_type,to_id,notes) VALUES (
 'R-2026-10-22-REPRESENTATIVE-DECISION-ART',
 'decision','D-2026-10-22-REPRESENTATIVE-WALL-UNIVERSAL','governs','fact','F-2026-10-22-REPRESENTATIVE-WALL-ART','Global art-first wall rule'
),(
 'R-2026-10-22-REPRESENTATIVE-DECISION-LIGHT',
 'decision','D-2026-10-22-REPRESENTATIVE-WALL-UNIVERSAL','governs','fact','F-2026-10-22-PAINTERLY-NEUTRAL-ART','Global painterly/lighting/state rule'
);
