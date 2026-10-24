-- Dicebox reproducible KB seed for Cabin in the Ashen Veil H-U07 V017 visual approval.
-- Record date 2026-10-24 PT; not executed against live DB by this turn.
-- The owner delegated FINAL art visual PASS/FAIL to assistant; source art is exact PNG, no Foundry injection.
INSERT OR IGNORE INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('S-2026-10-24-CAV-HU07-V017-ARTPASS',
 'H-U07 Dahlia Art Studio V017 — delegated final art INSPECT PASS',
 'verification','Campaign: Cabin in the Ashen Veil, H-U07 image only',
 'Owner delegated final visual PASS/FAIL in 2026-10-24 campaign owner rules; current room PREPARE and approved fifty-year-aged H-G06 visual standard',
 'active',
 'campaign-archives/cabin-in-the-ashen-veil/render-attempts/h-u07-single-render-v017-final-art-pass-2026-10-24.md',
 '2026-10-24','cav-hu07-v017-final-art-pass-sha256-67c9e5c84ff120d6',
 'Exact image: 1536x1024, 2888738 bytes, SHA256 67c9e5c84ff120d65600648ddb014e30a00f1ec6226c6e309e994db54aab4704. Private approved PNG at https://drive.google.com/file/d/1fk1B0uLessRYczAj9XV7y9v7z77HpksY/view. Native Foundry BUILD/INJECT not performed; read-only CDP harness refused at 127.0.0.1:9224.');

INSERT OR IGNORE INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-24-CAV-HU07-ART-V017-APPROVED',
 'cabin-ashen-veil.scene-art',NULL,
 'H-U07 V017 approved original art; Foundry scene not yet installed',
 'Dahlia upper-floor Art Studio H-U07 V017 passed the owner-delegated final visual INSPECT: one west entrance to H-U02, continuous south/east boundaries, vacant velvet-lined Ornate Mirror fitting, a framed painting depicting an iron-banded chest and legible 027 clue plaque within the same picture, distinct Sune rose shrine, fifty years of neglect and diffuse neutral light. Exact PNG sha256 67c9e5c84ff120d65600648ddb014e30a00f1ec6226c6e309e994db54aab4704. 20 of 45 base target arts now visually accepted (25 missing), plus extra trail Scene outside census. H-U07 Foundry build, Items, Regions, portal behavior and real player playtest remain NOT IMPLEMENTED; most recently attempted native harness connection to 127.0.0.1:9224 failed.',
 'campaign','created_document','active','S-2026-10-24-CAV-HU07-V017-ARTPASS',NULL,
 'Cabin Ashen Veil Dahlia Studio H-U07 approved map aged 50 years owner visual pass 20 45 build blocked');

INSERT OR IGNORE INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-24-CAV-HU07-ART-V017-APPROVED';
