-- 2026-10-23 — H-G06 Great Room exact art transfer to Foundry Data.
-- Owners approved Great Room creative raster; transfer is not a Scene BUILD or runtime verification.
INSERT INTO kb_sources (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-23-CAV-HG06-IMAGE-TRANSFER',
 'H-G06 approved Great Room PNG transferred to campaign Foundry Maps',
 'verification','campaign: Cabin in the Ashen Veil / H-G06 asset deployment',
 'Owner-approved ChatGPT map art, private temporary staging and Dicebox Bridge SHA-256/HTTP verification',
 'active','campaign-archives/cabin-in-the-ashen-veil/h-g06-approved-art-foundry-data-transfer-verified-2026-10-23.md',
 '2026-10-23','cav-hg06-image-transfer/v1',
 '2,800,071-byte image, 1173x1341, exact hash verified. Stage copy cleaned up. No world document changes.');
INSERT INTO kb_facts (fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-23-CAV-HG06-IMAGE-IN-FOUNDRY-DATA',
 'cabin-ashen-veil.map-art',NULL,
 'Owner-approved Great Room PNG is available as a Foundry-served background file',
 'H-G06 approved Great Room image at Maps/cabin-in-the-ashen-veil/h-g06-great-room-owner-approved.png was transferred into Foundry Data with SHA-256 c7e5305718d5aea1ddbcd374d0374f51b714bf6d860adf0cc0aabb3a29a4f0ee (2,800,071 bytes; 1173x1341 pixels). Verified Foundry HTTP 200 image/png and final Maps folder census 21 playable PNGs, with H-G02 unchanged. The temporary private Drive relay copy was deleted. This certifies file deployment only, not Foundry Scene, Wall, Region or gameplay installation.',
 'campaign','created_document','active','S-2026-10-23-CAV-HG06-IMAGE-TRANSFER',NULL,
 'great room H-G06 approved exact art file maps path checksum private staging deleted 21 png');
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-23-CAV-HG06-IMAGE-IN-FOUNDRY-DATA';
