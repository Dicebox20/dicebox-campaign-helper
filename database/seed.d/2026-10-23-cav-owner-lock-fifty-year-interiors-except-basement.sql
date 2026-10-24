-- Cabin in the Ashen Veil — owner-approved lodge interior art precedent after H-G06.
-- Date: 2026-10-23 Pacific.
-- THIS IS A REPRODUCIBLE KB SEED, not a claim that the on-disk KB database was rebuilt.
-- Future room rendering: owner inspect remains the acceptance gate.
INSERT INTO kb_sources
(source_id, title, source_kind, scope, authority, status, location, captured_at, version_fingerprint, notes)
VALUES
('S-2026-10-23-CAV-FIFTY-YEAR-LODGE-INTERIOR-STYLE',
 'Owner-approved aged H-G06 Great Room as above-ground cabin interior reference',
 'campaign', 'Campaign: Cabin in the Ashen Veil — interior art',
 'Owner explicit style lock after visual approval and image upload',
 'active',
 'campaign-archives/cabin-in-the-ashen-veil/visual-standards/approved-50-year-abandoned-lodge-interiors-hg06-reference-2026-10-23.md',
 '2026-10-23', 'h-g06-owner-locked-interior-reference/v001',
 'Canonical PNG original sha256 1835cc734ad75fb7d4b0eb8ca441f5d3f78d6f075d9797a4e2b33a412db2ddbe; uploaded copy pixels identical but encoding checksum different; basement excluded.');

INSERT INTO kb_decisions
(decision_id, topic, decision, rationale, scope, status, owner, source_id, next_review)
VALUES
('D-2026-10-23-CAV-AGED-INTERIOR-STYLE-EXCEPT-BASEMENT',
 'Cabin in the Ashen Veil — visual reference for all future above-ground lodge rooms',
 'Use the exact accepted 50-year-aged H-G06 Great Room PNG as the art-style reference for upcoming above-ground cabin/lodge interiors. Copy the visual age, overhead VTT readability, material/patina, neutral even baked lighting and recognizable period furniture; respect each individual room topology and canon. Require owner INSPECT PASS per render. Exclude H-B01, H-B02, H-B03 and other basement maps. This does not revise unrelated Mysterious Lodge campaign canon or overwrite installed Scene documents.',
 'Owner explicitly selected the aged H-G06 rendition after iterative visual comparison and exempted the basement from this standard.',
 'campaign', 'locked', 'Cabin in the Ashen Veil owner',
 'S-2026-10-23-CAV-FIFTY-YEAR-LODGE-INTERIOR-STYLE', NULL);

INSERT INTO kb_facts
(fact_id, domain, subject_no, title, statement, scope, evidence_class, status, source_id, supersedes_fact_id, tags)
VALUES
('F-2026-10-23-CAV-HG06-AGED-INTERIOR-STYLE-EXAMPLE',
 'cabin-ashen-veil.map-art', NULL,
 'Aged Great Room image is canonical art-style precedent, basement excluded',
 'The owner-approved H-G06 aged Great Room image, native PNG at Maps/cabin-in-the-ashen-veil/h-g06-great-room-aged-fifty-years-approved-2026-10-23.png, SHA-256 1835cc734ad75fb7d4b0eb8ca441f5d3f78d6f075d9797a4e2b33a412db2ddbe, 1199x1312 pixels, is the style reference for all future above-ground rooms of Cabin in the Ashen Veil. A conversation PNG upload has a distinct byte hash 4b5deab5e71566ede827f4702becf4e3e5372227f96138bd68e221bc7ef231f5 but verified 100 percent identical RGBA pixels. Do not substitute Great Room geometry for other rooms. Neutral baked lighting; visible 50-year abandonment cues. Basement explicitly exempt. No further scene updates authorized.',
 'campaign','created_document','active',
 'S-2026-10-23-CAV-FIFTY-YEAR-LODGE-INTERIOR-STYLE', NULL,
 'cabin ashen veil lodge fifty years abandoned art reference great room interior visual style owner lock except basement');

INSERT INTO decisions_fts (decision_id, topic, decision, rationale)
SELECT decision_id, topic, decision, rationale FROM kb_decisions
WHERE decision_id = 'D-2026-10-23-CAV-AGED-INTERIOR-STYLE-EXCEPT-BASEMENT';

INSERT INTO facts_fts (fact_id, title, statement, tags)
SELECT fact_id, title, statement, tags FROM kb_facts
WHERE fact_id = 'F-2026-10-23-CAV-HG06-AGED-INTERIOR-STYLE-EXAMPLE';
