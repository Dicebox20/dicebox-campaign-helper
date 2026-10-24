-- 2026-10-23 — Cabin in the Ashen Veil: owner-scoped structural interior Scene build.
-- Chronological additive KB seed. Does not rewrite accepted canon or earlier art history.
-- No Foundry writes; strict injector and current active-GM gates remain required.

INSERT INTO kb_sources (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-23-CAV-NAMED-REGION-SHELL',
 'Cabin in the Ashen Veil — owner directive for minimal named-Region interior scenes',
 'conversation','campaign: Cabin in the Ashen Veil / Foundry Scene BUILD',
 'Owner explicit phase-scope instruction, interpreted within canonical DiceBox Injector workflow',
 'active','campaign-archives/cabin-in-the-ashen-veil/h-g02-foyer-minimal-interior-build-scope-2026-10-23.md',
 '2026-10-23','cav-interior-regions-shell/v1',
 'First test target H-G02 Foyer. Art, coordinate blueprint and elected active GM currently block live import.');

INSERT INTO kb_decisions (decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review) VALUES
('D-2026-10-23-CAV-INTERIOR-NAMED-REGION-PHASE1',
 'Cabin in the Ashen Veil interior map build phase scope',
 'Use owner-approved backgrounds, necessary native walls/doors and only essential named stable Regions with zero RegionBehaviors. Defer teleport and puzzle scripts, rolls, keys, rewards and all other interactive logic to a separately authorized Phase 2 after structural shells. Retain canonical single-Markdown/single-macro BUILD validator and exact active-GM gates.',
 'Owner explicitly requested only named necessary Regions and postponement of puzzle construction until the maps are done.',
 'campaign','locked','Dicebox Campaign Helper project owner','S-2026-10-23-CAV-NAMED-REGION-SHELL',NULL);

INSERT INTO kb_open_items (item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id) VALUES
('O-2026-10-23-CAV-FOYER-REGION-SHELL',
 'Foundry-Shell-BUILD','Create H-G02 Foyer only with four inert named Regions',
 'Approved exact Foyer raster unavailable in currently checked local paths; approved raster/blueprint scale must be reconciled. Gamemaster 2 is logged in but is not Foundry elected active GM; Scene Setup source is restricted to Regionwright test world.',
 'Recover exact approved raster and verify SHA-256; reconcile geometry, preview 4 inert Regions; use validated single-macro injector with elected active GM; verify native Foundry Scene and Region reread.',
 'Exact image byte hash, coordinate blueprints, authoritative GM authority, validated build receipt, scene/regions 4 with 0 behaviors each.',
 'P0','blocked','Dicebox Campaign Helper Foreman','S-2026-10-23-CAV-NAMED-REGION-SHELL');

INSERT INTO decisions_fts (decision_id,topic,decision,rationale)
 SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id =
 'D-2026-10-23-CAV-INTERIOR-NAMED-REGION-PHASE1';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id =
 'O-2026-10-23-CAV-FOYER-REGION-SHELL';
