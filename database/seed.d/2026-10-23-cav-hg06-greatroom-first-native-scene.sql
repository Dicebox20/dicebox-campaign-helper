-- 2026-10-23 H-G06 third attempt: first successful native Foundry Scene structural shell.
-- Owner-scoped phase: no puzzle behaviors, no teleports; permanent physical scale is not approved.
INSERT INTO kb_sources (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-23-CAV-HG06-SCENE-INSTALL',
 'H-G06 Great Room native Foundry Scene installation and authoritative readback',
 'verification','campaign: Cabin in the Ashen Veil / Foundry Scene BUILDs',
 'Owner-directed install; Dicebox BUILD v2 validator PASS; elected active GM native Foundry Scene and Level/Wall/Region reread',
 'active','campaign-archives/cabin-in-the-ashen-veil/h-g06-third-attempt-live-scene-install-verified-2026-10-23.md',
 '2026-10-23','cav-hg06-foundry-build/v001',
 'Single macro SHA dac09f1548126ada4017c8cddad82e2ad29c8e1b007d9bf253060e13bb41a645; READY_WITH_WARNINGS; eight managed Walls, four unattributed native door Walls observed post-view.');

INSERT INTO kb_facts (fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-23-CAV-HG06-FIRST-FOUNDRY-SCENE',
 'cabin-ashen-veil.foundry-scene',NULL,
 'H-G06 Great Room first successful live Scene shell verified',
 'In cabin-in-the-ashen-veil under elected active Gamemaster 2, native Foundry Scene ID CAVHG06GreatRoom (Scene.CAVHG06GreatRoom) was created with exact approved art sha256 c7e5305718d5aea1ddbcd374d0374f51b714bf6d860adf0cc0aabb3a29a4f0ee, a single Ground Floor Level, gridless 120px/5ft and 840x960 tactical test canvas. The validated injector created eight stable Level-bound perimeter Walls and five named Level-bound inert Regions with exactly zero RegionBehaviors. After the Scene was viewed, Foundry reread found twelve Walls total: eight Dicebox managed Walls plus four unattributed normal door Walls across cardinal openings (preserved). GM canvas showed correct Scene and asset existed. Status READY_WITH_WARNINGS due provisional 35x40ft physical scale, unattributed door provenance, and untested gameplay/teleports. No puzzle logic was installed.',
 'campaign','created_document','active','S-2026-10-23-CAV-HG06-SCENE-INSTALL',NULL,
 'H-G06 Great Room Foundry live Scene ready with warnings native inject Walls Regions zero behavior 35x40 provisional four unowned doors');

INSERT INTO kb_open_items (item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id) VALUES
('O-2026-10-23-CAV-HG06-DOOR-PROVENANCE',
 'reconciliation','Investigate four post-install unowned H-G06 door Walls',
 'Four native ordinary door Walls spanning the north/south/west/east gaps appeared after Scene viewing; not included in exact installer roster or Dicebox ownership flags.',
 'Use read-only provenance and module/GM hooks diagnosis. Preserve the four Walls while proving origin; reconcile future management without overwrite.',
 'Exact Wall IDs, timing and source instrumentation, module hook records, read-only native current-state receipt.',
 'P1','open','Dicebox Campaign Helper Foreman','S-2026-10-23-CAV-HG06-SCENE-INSTALL');

INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-23-CAV-HG06-FIRST-FOUNDRY-SCENE';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-23-CAV-HG06-DOOR-PROVENANCE';
