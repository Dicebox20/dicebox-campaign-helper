-- Owner-approved Foundry Data Maps/cabin-in-the-ashen-veil/ storage designation.
-- Directory was created/read back via Dicebox Bridge; no images transferred; no Foundry world writes.
INSERT INTO kb_sources (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-23-CAV-MAP-STORAGE',
 'CAV campaign-specific Foundry approved-map storage directory',
 'verification','campaign: Cabin in the Ashen Veil / image asset storage',
 'Owner direction plus Dicebox Bridge PowerShell readback',
 'active','campaign-archives/cabin-in-the-ashen-veil/approved-map-storage-directory-receipt-2026-10-23.md',
 '2026-10-23','cav-map-storage/v1','Created directory at Maps/cabin-in-the-ashen-veil; empty at last readback.');
INSERT INTO kb_facts (fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-23-CAV-MAPS-DIRECTORY',
 'cabin-ashen-veil.map-art',NULL,
 'Approved raster storage location exists in Foundry Data',
 'The owner selected FoundryVTT/Data/Maps as the destination for approved campaign maps. A dedicated Maps/cabin-in-the-ashen-veil directory was created and verified empty (0 contents) through Dicebox Bridge. Approved image binaries have not yet been transferred or certified as served Foundry backgrounds.',
 'campaign','created_document','active','S-2026-10-23-CAV-MAP-STORAGE',NULL,
 'maps storage created empty pending transfer sha256');
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-23-CAV-MAPS-DIRECTORY';
