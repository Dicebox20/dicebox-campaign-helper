-- 2026-10-23: H-G06 Fireplace player-click Region Execute Script and Tinderbox.
-- Native Foundry documentation + gameplay test pending; seed not applied to DB in this turn.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('S-2026-10-23-CAV-HG06-FIREPLACE-SCRIPT',
 'H-G06 Fireplace clickable Tinderbox-gated Execute Script RegionBehavior',
 'verification','campaign: Cabin in the Ashen Veil / fireplace interactive Region',
 'Owner instructions for exact Region and AmbientLight; live native Foundry RegionBehavior and AmbientLight readback',
 'active','campaign-archives/cabin-in-the-ashen-veil/h-g06-fireplace-click-tinderbox-live-install-2026-10-23.md',
 '2026-10-23','cav-hg06-fireplace-click/v001',
 'Node compile and native script Behavior validated; live installed with GM socket/click listener; no player actor or token present to playtest.');

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-23-CAV-HG06-FIREPLACE-NATIVE-CLICK-SCRIPT',
 'cabin-ashen-veil.region-automation',NULL,
 'Native clickable H-G06 Fireplace Region Script installed with Tinderbox guard',
 'In Foundry 14.367 world cabin-in-the-ashen-veil, owner-directed existing Region Scene.CAVHG06GreatRoom.Region.G0HM92QQtEfyZcFi was renamed H-G06 - Fireplace. An Execute Script RegionBehavior CAV06FIRECLICK01 was installed with behaviorActivated/Viewed/Unviewed/Deactivated subscriptions and canvas pointertap hit-testing independent of region overlay visibility. Dialog offers lighting with Required: Tinderbox or extinguishing without it. Elected GM socket listener is registered to update exact AmbientLight Scene.CAVHG06GreatRoom.AmbientLight.fuWonmPqjJX2SIVG hidden state. Light starts hidden true. Region script SHA256 5819a2f2719def8d2ed5442d8b88fad651f66ec2797357fe3339b34dbda57fb9, stored with normalized trailing newline. No Macro created. Existing Walls/Regions and H-G06 - Grandfather Clock preserved. Live readback passed for script registration, Region/Light state; no Actors or Tokens available for genuine player playtest.',
 'campaign','created_document','active','S-2026-10-23-CAV-HG06-FIREPLACE-SCRIPT',NULL,
 'Cabin in Ashen Veil Foundry H-G06 Fireplace RegionBehavior executeScript Tinderbox clickable invisible region GM AmbientLight no macro');

INSERT INTO kb_open_items
(item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id)
VALUES
('O-2026-10-23-CAV-HG06-FIREPLACE-PLAYER-CANARY',
 'certification','Player test Tinderbox-gated Fireplace Region click interaction',
 'The installed click handler, native Behavior, GM listener and light-off state were verified, but world had zero character Actors and zero Tokens. Actual player dialog, inventory gate, GM socket roundtrip, fire lighting and extinguishing remain untested.',
 'Use a real non-GM player with a character token and inventory Tinderbox in Great Room. With the Region outline hidden, click to ignite, extinguish, then remove Tinderbox and verify re-ignition blocked. Also test after GM reconnect. Preserve owner-created document ids.',
 'Player-client dialog receipt, authoritative AmbientLight hidden-state after each action, item inventory pre/post, socket handler logs and Foundry document reread.',
 'P1','open','Cabin in the Ashen Veil owner / Dicebox Foreman','S-2026-10-23-CAV-HG06-FIREPLACE-SCRIPT');

INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts
 WHERE fact_id='F-2026-10-23-CAV-HG06-FIREPLACE-NATIVE-CLICK-SCRIPT';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
 WHERE item_id='O-2026-10-23-CAV-HG06-FIREPLACE-PLAYER-CANARY';
