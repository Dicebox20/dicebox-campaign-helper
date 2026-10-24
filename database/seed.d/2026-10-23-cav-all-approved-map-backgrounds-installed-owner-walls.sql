-- 2026-10-23: Owner instruction ALL ready approved map backgrounds; owner places walls.
-- Aggregate verified 18/18 new blank wall/door/Region Scene shells in Foundry.
-- This chronological delta deliberately does not promote provisional scale to canonical geometry.
INSERT INTO kb_sources (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-23-CAV-18-OWNER-WALL-SCENES',
 'Twenty campaign Scenes total after 18 background-only native installations',
 'verification','campaign: Cabin in the Ashen Veil / Foundry background-only Scene deployment',
 'Owner requested all approved Scenes installed, overriding Walls/doors to manual owner placement; native active-GM readback and individual build-v2 validation',
 'active','campaign-archives/cabin-in-the-ashen-veil/batch-background-scenes-owner-walls-install-2026-10-23.md',
 '2026-10-23','cav-18-background-only-v001',
 '18 PASS builds and post-inject native receipts; 20 campaign Scenes total; all new Scenes zero Walls, Regions and behaviors as installed.');

INSERT INTO kb_facts (fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-23-CAV-18-APPROVED-BACKGROUND-SCENES-VERIFIED',
 'cabin-ashen-veil.foundry-scene',NULL,
 'All remaining 18 approved image backgrounds installed as blank structural Scenes',
 'In Foundry world cabin-in-the-ashen-veil, elected Gamemaster 2 installed 18 separately validated native Scenes: AQ-01, BATH-UNIFIED, EXT-02 full Pond with drained source recorded but not activated, EXT-05 Gazebo, EXT-06 Greenhouse, EXT-07 Boathouse, EXT-TRAIL, FM-UNIFIED (FM01 through FM04 combined), H-G02 Foyer, and SG-01 through SG-09. Each created Scene was reread with one Level, exact approved PNG background, no Walls, no doors, no Regions and no RegionBehaviors. Gridless battlemap-120, aspect-preserving dimensions provisional until owner approval. Existing H-G06 Great Room and EXT-01 Carriage Yard were not mutated by the batch, user-added Great Room Grandfather Clock was preserved. Total Foundry Scenes after batch: 20. Individual v2 BUILD macros, hashes and runtime receipts stored with the GitHub batch handoff.',
 'campaign','created_document','active','S-2026-10-23-CAV-18-OWNER-WALL-SCENES',NULL,
 'Cabin in the Ashen Veil batch 18 native Foundry Scene backgrounds owner wall placement user visual inspection 20 total');

INSERT INTO kb_open_items (item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id) VALUES
('O-2026-10-23-CAV-BACKGROUND-SCENE-SCALE-AND-WALLS',
 'certification','Owner wall placement and final aspect-preserving scene scale certification',
 'Eighteen Scene backgrounds were installed with provisional physical footprints and intentionally no Walls or Regions, as the owner explicitly elected to place Walls and doors manually. Scene creation does not certify token or portal movement.',
 'Owner visually inspects each installed Scene, reconciles physical scale, places native Level-bound Walls and doors, then authorizes later named Region and puzzle behavior stages.',
 'Owner inspection/scale choice, Foundry Wall and geometry reread, player token canary results.',
 'P1','open','Cabin in the Ashen Veil owner','S-2026-10-23-CAV-18-OWNER-WALL-SCENES');

INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts
 WHERE fact_id='F-2026-10-23-CAV-18-APPROVED-BACKGROUND-SCENES-VERIFIED';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
 WHERE item_id='O-2026-10-23-CAV-BACKGROUND-SCENE-SCALE-AND-WALLS';
