-- Dicebox supplemental KB seed: project data architecture and chronological intake rule
-- 2026-10-07

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
  ('project_data_architecture_version','2026-10-07.v1'),
  ('new_data_implementation_rule_version','2026-10-07.v1'),
  ('canonical_project_repository','Dicebox20/dicebox-campaign-helper'),
  ('project_data_inventory_snapshot','10949 files; 966561098 Git blob bytes observed 2026-10-07');

INSERT OR REPLACE INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
  'S-2026-10-07-PROJECT-DATA-GOVERNANCE',
  'Project Data Architecture and New Data Implementation Rule',
  'project',
  'Dicebox Campaign Helper project-wide data governance',
  'User-accepted project governance reconciled against current repository authority and inspected project data',
  'active',
  'docs/PROJECT-DATA-ARCHITECTURE-2026-10-07.md',
  '2026-10-07',
  'project-data-governance-v1',
  'Companion rule: docs/NEW-DATA-IMPLEMENTATION-RULE-2026-10-07.md; inventory: docs/PROJECT-DATA-INVENTORY-2026-10-07.md.'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES
(
  'F-2026-10-07-REPOSITORY-DATA-INVENTORY','project.data-governance',NULL,
  'Repository data inventory snapshot',
  'The canonical repository contained 10,949 files and approximately 966.6 MB of Git blob data when inspected. Work and outputs dominate volume, especially duplicated Foundry fixture directories, and are evidence/work classes rather than authority by location alone.',
  'project','created_document','active','S-2026-10-07-PROJECT-DATA-GOVERNANCE',NULL,
  'inventory chronology provenance work outputs fixtures'
),
(
  'F-2026-10-07-LEGACY-LOCAL-WORKSPACE','project.data-governance',NULL,
  'Legacy Windows workspace is migration input',
  'The historical local DiceBox Campaign Helper workspace contains useful database backups, Regionwright work, campaign records, handoffs, checkpoints, and fixtures, but current authority is repository-first and local-only material requires explicit reconciliation before promotion.',
  'project','created_document','locked','S-2026-10-07-PROJECT-DATA-GOVERNANCE',NULL,
  'legacy local migration provenance github canonical'
),
(
  'F-2026-10-07-SCENE-SEMANTIC-PIPELINE','dicebox.scene-creation',NULL,
  'Scene creation uses inspected structural-to-painted semantic pipeline',
  'Scene creation for the Dicebox Campaign Helper desktop app uses a top-down 3D grayscale structural render, semantic inspection and feature manifest, corrections before coloring, a painterly live render that preserves structural semantics, and a second semantic inspection before Foundry build/injection.',
  'project','created_document','locked','S-2026-10-07-PROJECT-DATA-GOVERNANCE',NULL,
  'scene creation grayscale blender painterly inspect feature manifest foundry'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id IN (
 'F-2026-10-07-REPOSITORY-DATA-INVENTORY',
 'F-2026-10-07-LEGACY-LOCAL-WORKSPACE',
 'F-2026-10-07-SCENE-SEMANTIC-PIPELINE'
);

INSERT OR REPLACE INTO kb_decisions(
  decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review
) VALUES
(
  'D-2026-10-07-PROJECT-DATA-AUTHORITY',
  'Project data authority and organization',
  'GitHub reproducible sources are canonical. Generated databases, outputs, work fixtures, local workspaces, chats, and historical artifacts remain derivatives/evidence until explicitly promoted. Existing data is organized logically before physical migration.',
  'This preserves chronology and provenance while avoiding path/hash breakage and resolves older local-authority wording against the later project-unification decision.',
  'project','locked','DiceBox Campaign Helper Foreman','S-2026-10-07-PROJECT-DATA-GOVERNANCE',NULL
),
(
  'D-2026-10-07-NEW-DATA-IMPLEMENTATION-RULE',
  'Organized implementation of new project data',
  'Every consequential datum follows CAPTURE -> CLASSIFY -> RECONCILE -> CATALOGUE -> VALIDATE INPUT -> IMPLEMENT -> REREAD/TEST -> RECEIPT -> CLOSE OR CARRY FORWARD.',
  'The sequence prevents chat-only knowledge, silent scope promotion, lost provenance, unverified implementation, and discontinuity between development sessions.',
  'project','locked','DiceBox Campaign Helper Foreman','S-2026-10-07-PROJECT-DATA-GOVERNANCE',NULL
),
(
  'D-2026-10-07-SCENE-SEMANTIC-RENDER-STANDARD',
  'Scene creation map rendering standard',
  'The desktop app Scene Creation process treats the grayscale 3D render as a semantic structural source, requires inspection and a feature manifest before coloring, then requires a second semantic inspection of the painterly live map before Foundry implementation.',
  'The Scene Creation workflow is being refined until map features can be recognized and translated into wall types, lights, regions, blockers, sounds, transitions, and other Foundry configuration without guesswork.',
  'project','locked','DiceBox Campaign Helper Foreman','S-2026-10-07-PROJECT-DATA-GOVERNANCE',NULL
);

INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions
WHERE decision_id IN (
 'D-2026-10-07-PROJECT-DATA-AUTHORITY',
 'D-2026-10-07-NEW-DATA-IMPLEMENTATION-RULE',
 'D-2026-10-07-SCENE-SEMANTIC-RENDER-STANDARD'
);

INSERT OR REPLACE INTO kb_open_items(
  item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id
) VALUES
(
  'O-2026-10-07-LEGACY-DATA-MIGRATION','reconciliation',
  'Reconcile local-only legacy project data',
  'The Windows legacy workspace contains useful historical/campaign/workflow material that is not guaranteed to be represented in the canonical repository.',
  'Inventory local-only high-value records chronologically, fingerprint them, reconcile duplicates/conflicts, and promote only reviewed material into canonical docs/KB.',
  'Per-record provenance, original timestamp, source fingerprint, scope classification, conflict disposition, and import receipt.',
  'P2','open','DiceBox Campaign Helper Foreman','S-2026-10-07-PROJECT-DATA-GOVERNANCE'
),
(
  'O-2026-10-07-PHYSICAL-DATA-CLEANUP','implementation',
  'Plan safe physical cleanup of fixtures and generated artifacts',
  'The repository contains large duplicated fixture and output histories whose paths may be referenced by tests, hashes, or receipts.',
  'Perform dependency/path audit and design a non-destructive archive/deduplication migration without changing authority or provenance.',
  'Path-reference audit, retained-source manifest, before/after size/count report, validation suite, and migration receipt.',
  'P3','open','DiceBox Campaign Helper Foreman','S-2026-10-07-PROJECT-DATA-GOVERNANCE'
),
(
  'O-2026-10-07-SCENE-FEATURE-MANIFEST','implementation',
  'Formalize Scene Creation semantic feature manifest',
  'The new inspected grayscale-to-painted map workflow needs a machine-readable manifest for walls, doors, windows, blockers, lighting, sound, terrain, elevation, regions, hazards, transitions, interactables, overhead features, and uncertainty.',
  'Define the manifest schema and integrate it into the desktop Scene Creation workflow between grayscale inspection and painterly rendering, then verify the final render against the same manifest.',
  'Schema validation, representative map fixtures, pre-color and post-color inspection receipts, and Foundry projection mapping tests.',
  'P1','open','DiceBox Campaign Helper Foreman','S-2026-10-07-PROJECT-DATA-GOVERNANCE'
);

INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
WHERE item_id IN (
 'O-2026-10-07-LEGACY-DATA-MIGRATION',
 'O-2026-10-07-PHYSICAL-DATA-CLEANUP',
 'O-2026-10-07-SCENE-FEATURE-MANIFEST'
);

INSERT OR REPLACE INTO kb_relationships(
  relationship_id,from_type,from_id,relation,to_type,to_id,notes
) VALUES
(
 'R-2026-10-07-DATA-RULE-GOVERNS-MIGRATION',
 'decision','D-2026-10-07-NEW-DATA-IMPLEMENTATION-RULE','governs','open_item','O-2026-10-07-LEGACY-DATA-MIGRATION',
 'Legacy imports must use the same capture/classify/reconcile/catalogue/validate sequence.'
),
(
 'R-2026-10-07-SCENE-DECISION-REQUIRES-MANIFEST',
 'decision','D-2026-10-07-SCENE-SEMANTIC-RENDER-STANDARD','requires-next','open_item','O-2026-10-07-SCENE-FEATURE-MANIFEST',
 'The accepted visual workflow requires a machine-readable feature manifest before app implementation is complete.'
);
