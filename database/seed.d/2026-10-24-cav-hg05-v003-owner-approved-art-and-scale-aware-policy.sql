-- Dicebox KB seed, 2026-10-24: Cabin in the Ashen Veil owner override.
-- Append-only source. Not applied to live KB here.
INSERT OR IGNORE INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('S-2026-10-24-CAV-HG05-SCALE-ARTPASS',
 'Owner authorizes scale-aware visual detail and H-G05 Study V003 image PASS',
 'verification','Cabin in the Ashen Veil, above-ground room art and H-G05',
 'Direct owner corrections: tiny eye sockets may be revealed via Investigation text; comparatively intact furnishings are acceptable if room is aged. Assistant final image approval is owner-delegated.',
 'active',
 'campaign-archives/cabin-in-the-ashen-veil/render-attempts/h-g05-allen-study-v003-owner-scale-aware-final-art-pass-2026-10-24.md',
 '2026-10-24','cav-hg05-v003-sha256-c3ec08180f80d5d6',
 'Approved source H-G05 V003 is 1536x1024, 2772369 bytes, SHA256 c3ec08180f80d5d6304824840029bf46e4785d6ac95e01e2c0b43c32a02bd5a4; exact private Drive file ID 17NFBP_74FEHdfp531ystCwp_-gQ_j9if. 21/45 image bases accepted. No native Foundry Scene or puzzle test evidence.');

INSERT OR IGNORE INTO kb_decisions
(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES
('D-2026-10-24-CAV-ART-SCALE-DETAIL-AND-AGED-PRESERVED',
 'Cabin map art: visible-scale details and fifty-year neglect with preserved furnishings',
 'At tactical map scale, require doors, walls, traversability and recognizable important props. Minuscule mechanics like Rufus eye sockets are revealed in appropriate player Investigation text and later implemented as actual stateful RegionBehavior/Item logic. Aged appearance requires pervasive neglect but allows recognizable, intact and fairly well-preserved furniture. Owner-approved H-G06 aged Great Room remains style reference and neutral ambient baseline. Accept exact H-G05 V003 artwork as final visual PASS; separate Foundry build and gameplay checks remain pending.',
 'Owner clarified prior assistant inspection criteria were too strict and caused unnecessary rerender attempts.',
 'campaign','locked','Cabin in the Ashen Veil owner','S-2026-10-24-CAV-HG05-SCALE-ARTPASS',NULL);

INSERT INTO decisions_fts (decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions
WHERE decision_id='D-2026-10-24-CAV-ART-SCALE-DETAIL-AND-AGED-PRESERVED';

INSERT OR IGNORE INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-24-CAV-HG05-V003-FINAL-ART-PASS',
 'cabin-ashen-veil.scene-art',NULL,
 'H-G05 Allen Study V003 visually approved; Foundry build pending',
 'The exact rendered H-G05 V003 source has final owner-delegated visual PASS after owner size-aware micro-detail and aged preserved-furniture corrections. West entrance to H-G06, north rear-exterior door, continuous east/south, recognizable Rufus and visible 587 note, aged room and balanced neutral lighting. Missing Rufus eyes are revealed by player Investigation text as later mechanic. Approved original PNG SHA256 c3ec08180f80d5d6304824840029bf46e4785d6ac95e01e2c0b43c32a02bd5a4. Image art 21/45 approved; H-G05 Foundry Scene and Rufus/Study key mechanics NOT installed/verified.',
 'campaign','created_document','active','S-2026-10-24-CAV-HG05-SCALE-ARTPASS',NULL,
 'Cabin Ashen Veil H-G05 Allen Study V003 visual approved aging Rufus eyes Investigation 587');

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-24-CAV-HG05-V003-FINAL-ART-PASS';
