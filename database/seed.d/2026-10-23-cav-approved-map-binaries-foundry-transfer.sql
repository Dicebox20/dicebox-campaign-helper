-- 2026-10-23 owner-authorized live file transfer: approved PNGs from Downloads to Foundry Data.
-- Adds verified filesystem/HTTP evidence, not a claim of live Scene installation.
INSERT INTO kb_sources (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-23-CAV-APPROVED-MAPS-TRANSFER',
 'Verified 20 playable maps installed into Foundry Data/Maps/cabin-in-the-ashen-veil',
 'verification','campaign: Cabin in the Ashen Veil / approved playable art deployment',
 'Owner requested movement of Downloads approved map ZIP; Dicebox Bridge PowerShell integrity checks and HTTP asset readback',
 'active','campaign-archives/cabin-in-the-ashen-veil/approved-battlemaps-foundry-data-transfer-receipt-2026-10-23.md',
 '2026-10-23','cav-approved-image-transfer/v1',
 '20 exact approved PNGs, aggregate 77184238 bytes; manifest copied; ZIP original retained; Foundry Scenes unchanged.');

INSERT INTO kb_facts (fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-23-CAV-PLAYABLE-MAPS-IN-FOUNDRY-DATA',
 'cabin-ashen-veil.map-art',NULL,
 'Twenty owner-approved map binaries copied, rehashed and served in Foundry Data',
 'Owner-supplied Downloads archive Cabin_in_the_Ashen_Veil_ALL_APPROVED_BATTLEMAPS_2026-10-23.zip, SHA-256 eadc36fed5d73ec458791ad752fce10b32817fc8fa3990ea0f5601de99af1ab3, supplied 20 playable PNG image entries. Exactly 20 were copied to Maps/cabin-in-the-ashen-veil; all SHA-256, byte length and PNG pixel dimensions matched the manifest and every installed file was rehashed from destination. Folder reread saw 20 images and an approved-playable-manifest.json; sampled H-G02 Foyer and SG-05 HTTP static paths returned 200 image/png. The original ZIP was preserved, no Foundry Scene documents were modified, and Great Room H-G06 was not in this archive.',
 'campaign','created_document','active','S-2026-10-23-CAV-APPROVED-MAPS-TRANSFER',
 'F-2026-10-23-CAV-MAPS-DIRECTORY',
 'foundry maps approved images installed 20 png zip SHA256 safe transfer Foyer Grove Great Room pending');

INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-23-CAV-PLAYABLE-MAPS-IN-FOUNDRY-DATA';
