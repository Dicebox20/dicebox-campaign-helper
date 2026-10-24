-- 2026-10-23 owner-directed EXT-01 Carriage Yard / cabin front native structural-only Scene BUILD.
-- Image used was owner-accepted older archive visual-pass, not newer approved fresh image.
-- Geometry and user visual inspection remain pending; zero puzzle RegionBehaviors.
INSERT INTO kb_sources (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-23-CAV-EXT01-SCENE-INSTALL',
 'EXT-01 Front Carriage Yard native Foundry structural shell installation and reread',
 'runtime-receipt','campaign: Cabin in the Ashen Veil / EXT-01 exterior Scene',
 'Owner-directed Scene build, canonical Dicebox BUILD v2 validator PASS, elected active GM native Foundry readback',
 'active','campaign-archives/cabin-in-the-ashen-veil/ext-01-front-estate-first-live-structural-scene-install-2026-10-23.md',
 '2026-10-23','cav-ext01-structural-shell/v001',
 'Scene CAVEXT01Yard0001; earlier owner-accepted archive image SHA d957... vs separately newer approved render SHA 5284... not locally deployed. Provisional 300x200ft.');
INSERT INTO kb_facts (fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-23-CAV-EXT01-FIRST-FOUNDRY-SCENE',
 'cabin-ashen-veil.foundry-scene',NULL,
 'EXT-01 Carriage Yard front cabin Scene native shell created and verified',
 'In cabin-in-the-ashen-veil, elected active GM Gamemaster 2 created Scene.CAVEXT01Yard0001, EXT-01 - Carriage Yard and Cabin Front. Validated one macro BUILD SHA256 20ce2d7147102e9646ea77440a9153c5b07eab583f43937fa71184c53a9eec96. Exact installed v10 archival visual-pass art SHA256 d957783eeedfe640da78c8f1eeadda5135c66da05c0f3f04c9eb952f9ab34d1c; older than a separately approved fresh image SHA256 5284a039c2e990f65bb116e1167e0d9bc918a9a1eb895e9c2be95a33ed6cf4f8 which was not deployed. World readback showed two scenes, one Level, gridless 120px/5ft, provisional 7200x4800 Scene, 21 Level-bound Walls (one closed Foyer door and one locked forest gate), eight named inert Level-bound Regions, zero RegionBehaviors. Source served and GM canvas loaded; user inspects visually. Grandfather Clock Region in existing H-G06 preserved. READY_WITH_WARNINGS, no puzzle/teleport/loot scripts.',
 'campaign','runtime-receipt','active','S-2026-10-23-CAV-EXT01-SCENE-INSTALL',NULL,
 'EXT-01 Carriage Yard cabin front estate native Scene Foundry structural installation walls door gate Regions no behaviors owner visual inspection pending');
INSERT INTO kb_open_items (item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id) VALUES
('O-2026-10-23-CAV-EXT01-ART-EDITION',
 'art-provenance','Reconcile archived EXT-01 image with later owner-approved carriage yard rendition',
 'EXT-01 installed the earlier owner-accepted archival visual-pass d957... because the later exact 5284... image was absent from local Foundry files. Do not silently claim latest accepted render installed.',
 'Recover later exact PNG only if desired, verify SHA256 and owner approval, then reconcile runtime art and source-specific Wall/Region geometry using established workflow.',
 'Source 5284... image with approved original identity; owner visual selection/decision; reconciled pixel-level geometry.',
 'P1','open','Dicebox Campaign Helper Foreman','S-2026-10-23-CAV-EXT01-SCENE-INSTALL');
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-23-CAV-EXT01-FIRST-FOUNDRY-SCENE';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-23-CAV-EXT01-ART-EDITION';
