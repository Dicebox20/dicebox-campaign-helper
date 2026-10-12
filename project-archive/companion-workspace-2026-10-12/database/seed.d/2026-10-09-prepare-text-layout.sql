-- 2026-10-09 accepted PREPARE text-layout rule; standalone additive seed.
INSERT OR IGNORE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES ('S-2026-10-09-PREPARE-TEXT-LAYOUT','DiceBox PREPARE text layout hard rule','project','Map PREPARE packets across DiceBox campaigns','User explicit approval on 2026-10-09','active','docs/DICEBOX-PREPARE-TEXT-LAYOUT-RULE-2026-10-09.md','2026-10-09','prepare-text-diagram-v1','This approval affects only the PREPARE diagram requirement, not the experimental map workflow v3.1.');

INSERT OR IGNORE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES ('F-2026-10-09-PREPARE-TEXT-LAYOUT','dicebox.map-preparation',NULL,'Textual spatial diagram is required in every map PREPARE','Every DiceBox map PREPARE packet must include a monospaced top-down text-based map diagram with cardinal directions, approximate ingress and egress positions, primary paths and branches, landmarks, obstacles, and applicable gathering areas. A legend and location table disambiguate symbols. Review the schematic before rendering; preserve it as a comparison artifact. It is a review aid, not exact Foundry Wall geometry; the Spatial Blueprint remains authoritative.','project','created_document','locked','S-2026-10-09-PREPARE-TEXT-LAYOUT',NULL,'prepare ascii text map sketch diagram topology grayscale spatial blueprint');

INSERT OR IGNORE INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES ('D-2026-10-09-PREPARE-TEXT-LAYOUT','Required map PREPARE spatial text diagram','Make a top-down monospaced text layout mandatory in PREPARE before rendering; use it to review physical arrangement and routes alongside, but never instead of, the authoritative Spatial Blueprint.','M01 Forgotten Road text layout was especially helpful to the user and was expressly approved for permanent use; avoid silently promoting the separate experimental v3.1 rendering pipeline.','project','locked','DiceBox Campaign Helper Foreman','S-2026-10-09-PREPARE-TEXT-LAYOUT',NULL);

INSERT OR IGNORE INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-09-PREPARE-TEXT-LAYOUT';
INSERT OR IGNORE INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id='D-2026-10-09-PREPARE-TEXT-LAYOUT';
