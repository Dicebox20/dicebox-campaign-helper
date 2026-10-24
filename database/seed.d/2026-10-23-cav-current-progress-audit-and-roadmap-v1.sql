-- Reproducible KB index for 2026-10-23 PT Cabin in the Ashen Veil read-only progress audit.
-- INTENTIONALLY NOT EXECUTED against any live SQLite DB in this task.
-- Newer than 18/45 base art status in prior ledger; 19/45 accounts for approved H-G06.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('S-2026-10-23-CAV-LIVE-AUDIT-ROADMAP-V1',
 'Cabin in the Ashen Veil read-only Foundry world audit and execution roadmap',
 'verification','Campaign: Cabin in the Ashen Veil only',
 'Native Foundry 14.367 world inspection, latest owner-accepted image receipts, versioned campaign prep/role workflow and puzzle design archives',
 'active','campaign-archives/cabin-in-the-ashen-veil/roadmaps/cav-campaign-execution-roadmap-and-live-audit-2026-10-23-v1.md',
 '2026-10-23','cav-live-audit-roadmap/v001',
 'Live read-only 2026-10-24T06:32:50Z, target world cabin-in-the-ashen-veil; zero Foundry writes. A new owner change may supersede these counts.');

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-23-CAV-MAP-INVENTORY-19-45-20-SCENES',
 'cabin-ashen-veil.campaign-progress',NULL,
 '19 of 45 base-map images approved, 26 missing; 20 native Foundry Scenes',
 'Latest grouped base-map count 45: 19 owner-approved after aged H-G06 PASS; 26 unrendered = 20 cabin room/roof targets, 3 Estate EXTs and 3 Undercroft targets. One additional separately approved EXT-TRAIL map sits outside the 45 target census, resulting in 20 installed Foundry Scenes. Native read-only 2026-10-24T06:32:50Z: H-G06 25 Walls, 4 door Walls, 7 Regions, 1 Execute Script RegionBehavior, 1 Light, 1 placed Token; EXT-01 7 Walls, 1 door Wall, 8 Regions; other 18 Scenes 0 Walls/Regions; 1 Actor, 0 world Items, 0 Journals, 0 Macros. One recently installed H-G06 Fireplace Tinderbox script is pending non-GM player canary. Manual owner Walls/doors remain protected. Historic prep statuses showing 18/45 or NOT_INSTALLED are stale and not current authoritative state.',
 'campaign','created_document','active','S-2026-10-23-CAV-LIVE-AUDIT-ROADMAP-V1',NULL,
 'cabin ashen veil current audit roadmap 19 of 45 26 maps missing 20 foundry scenes owner walls playtest fireplace');

INSERT INTO kb_milestones
(milestone_id,milestone,goal,deliverables,exit_gate,dependencies,status,source_id)
VALUES
('M-2026-10-23-CAV-BASE-ART-REMAINING-26',
 'Cabin in the Ashen Veil: complete remaining 26 base-map renders',
 'Finish every missing individually approved logical house room and remaining Estate/Undercroft targets, keeping owner visual approval and correct grouped-scene count',
 'Owner-passed separate H-G01/03/04/05/09, H-U01/02/03/04/05/07/08, H-A01/02/03/04, H-R01, H-B01/02/03, EXT-03/04/08 and UND-01/02/03 map art; hash and source receipt per acceptance; final chamber owner design last',
 '45 of 45 target backgrounds have owner art PASS; extra variants counted separately; owner wall geometry unaffected',
 'Latest owner canon, individual room PREPARE, above-ground aged H-G06 visual reference with basement exception, protected manual owner INSPECT',
 'planned','S-2026-10-23-CAV-LIVE-AUDIT-ROADMAP-V1'),
('M-2026-10-23-CAV-FIREPLACE-PLAYER-CANARY',
 'H-G06 Fireplace: first non-GM Region click / Tinderbox canary',
 'Certify first owner-directed Execute Script RegionBehavior no player macro permissions and exact AmbientLight toggle',
 'Player real click, dialog, missing Tinderbox reject, Tinderbox present fire activation, extinguish and reconnect repeat proof; native document receipts',
 'Non-GM canary and elected GM live Light hidden state match behavior with no duplicate script/macros or owner geometry changes',
 'Character Token and Tinderbox, non-GM session connected, GM listener bootstrapped',
 'ready','S-2026-10-23-CAV-LIVE-AUDIT-ROADMAP-V1'),
('M-2026-10-23-CAV-PLAYABLE-REGION-CHAIN',
 'Cabin in the Ashen Veil: full navigation, puzzle, state and finale checks',
 'Make approved Scenes genuinely traversable and puzzle-safe without overwriting owner placed Walls/doors',
 'Owner geometries; portal contracts; native Items, Journals, scene interactions and state machines; staged art; canary receipts and rollback',
 'PLAYTESTED end-to-end non-GM route and item/puzzle return/restart/Veil/Undercroft outcomes with no stranded players',
 'Owner-complete geometry, accepted source artwork, puzzle canon LOCK-01 onward, fireplace canary and verified GM-authoritative Region script architecture',
 'planned','S-2026-10-23-CAV-LIVE-AUDIT-ROADMAP-V1');

INSERT INTO facts_fts (fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-23-CAV-MAP-INVENTORY-19-45-20-SCENES';
