-- M02 explicit PREPARE restart after rejection of tollhouse-like architecture.
-- Preserve original source/geometry and grayscale as immutable historical evidence.
UPDATE kb_facts
SET status = 'superseded'
WHERE fact_id = 'F-2026-10-16-HEIST-M02-PREPARE-DRAFT' AND status = 'provisional';

INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-16-M02-GRAND-ENTRANCE-RESTART',
 'Kurth Tower M02 explicit restart at PREPARE for monumental tower interior',
 'conversation','project','explicit user instruction 2026-10-16','recorded',
 'handoffs/2026-10-16-kurth-tower-reception-m02/PREPARE-RESTART-2026-10-16.md',
 '2026-10-16','kurth-m02-grand-entrance-prepare-restart/v1',
 'User rejected small isolated tollhouse and apparent rear exterior entrance. Earlier M02 geometry/art archived, not valid source. Proposed 54x36 battlemap-120 with one west exterior M01 entrance, internal east M03 core, and three intact routes; dimensions and detailed rooms require PREPARE review before GEOMETRY AUTHOR.');

INSERT INTO kb_decisions
(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES
('D-2026-10-16-M02-RESTART-PREPARE',
 'Kurth Tower M02 restart at PREPARE after architectural rejection',
 'Restart scene 2 from PREPARE. Reject the small freestanding tollhouse and external back-door topology of prior M02 design as geometry/art authority while preserving its archival evidence. New design must represent a monumental inside-the-tower entrance with one exterior ingress, internal M03 secured progression, and three playable public/records/staff routes. New dimensions remain a review proposal and do not establish an approved Spatial Blueprint.',
 'Explicit user rejection of architectural scale and confusing apparent back entrance; no downstream geometry/render can continue from a rejected design.',
 'project','locked','DiceBox Campaign Helper Foreman',
 'SRC-2026-10-16-M02-GRAND-ENTRANCE-RESTART',NULL);

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-16-M02-GRAND-ENTRANCE-PREPARE-RESTART',
 'scene',NULL,'M02 grand entrance restart proposal: 54x36, no rear outdoor door',
 'M02 explicit PREPARE_RESTART_DRAFT_REVIEW is a new proposed monumental interior of Kurth Tower. Stable scene ID dbx.heist.kurth.m02.reception; M01 the Dark Arch west ingress, single exterior entrance; M03 Security Machinery via internal secured core to the east; ceremonial hall with accessible columns/stairs/gallery plus north records inspector route and south internal servant route. Three mandatory paths retain 10ft public and 5ft side minimum token clearances, with 15ft guarded core opening proposed. Gridless battlemap-120 54x36 logical cells, 6480x4320 pixels PROPOSED, not approved. Prior M02 40x24 geometry/grayscale rejected as authority; no new geometry/art/runtime mutation, no Ready-to-Play status. Library expanded PREPARE checksum e2dc437e36d5b832945609c935d10c73787c241042712bd99ba22d211452ddcb.',
 'project','local','provisional',
 'SRC-2026-10-16-M02-GRAND-ENTRANCE-RESTART',
 'F-2026-10-16-HEIST-M02-PREPARE-DRAFT',
 'm02,prepare,restart,grand-entrance,no-back-door,archived-old-geometry,not-approved');
