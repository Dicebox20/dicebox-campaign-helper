-- Dicebox supplemental KB seed: rule conflict reconciliation and Scene semantic render workflow v2
-- 2026-10-07

INSERT OR REPLACE INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
  'S-2026-10-07-RULE-CONFLICT-RECONCILIATION-V2',
  'Rule conflict reconciliation and Scene semantic render workflow v2',
  'project',
  'Project-wide rule reconciliation plus current Scene Creation rendering workflow',
  'User-directed reconciliation against current AGENTS, workflow docs, reproducible KB, and latest accepted Scene Creation rendition',
  'active',
  'docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md',
  '2026-10-07',
  'rules-v2-scene-semantic-render-2026-10-07.2',
  'Reconciles seed.d rebuild authority, non-blocking mirror cadence, automatic final INSPECT approval, Spatial Blueprint/pixel authority, and the two-pass grayscale-to-painterly Scene workflow.'
);

UPDATE kb_facts
SET status='superseded'
WHERE fact_id IN (
  'F-2026-10-07-SCENE-SEMANTIC-PIPELINE',
  'F-222'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES
(
  'F-2026-10-07-RULE-CONFLICT-AUDIT-V2',
  'governance',
  NULL,
  'Active rule conflict audit reconciled',
  'The active rule audit found four material drifts: several current docs still required direct database/seed.sql edits despite accepted seed.d deltas; the Injector hardening doc still showed a mandatory APPROVE gate despite INSPECT PASS auto-approval; the development workflow simultaneously described shared-document mirroring as non-blocking and required it in Definition of Ready; and older map rules treated pixels as wholly non-semantic while the accepted Scene Creation workflow now uses an inspected grayscale structural render to propose features before locking them into the Feature Manifest/Spatial Blueprint. The 2026-10-07.2 reconciliation supersedes those conflicting conventions while preserving safety and authority boundaries.',
  'project',
  'deterministic',
  'locked',
  'S-2026-10-07-RULE-CONFLICT-RECONCILIATION-V2',
  NULL,
  'rules conflict reconciliation seed.d approval geometry render workflow'
),
(
  'F-2026-10-07-SCENE-SEMANTIC-PIPELINE-V2',
  'dicebox.scene-creation',
  NULL,
  'Scene Creation two-pass semantic render pipeline v2',
  'New Scene Creation uses PREPARE -> grayscale 3D STRUCTURAL_RENDER -> mandatory STRUCTURAL_INSPECT -> Feature Manifest/Spatial Blueprint reconciliation -> PAINT_RENDER -> mandatory FINAL_INSPECT -> BUILD. Only the final inspection PASS approves the painterly art. The grayscale pass is a semantic drafting surface, raw pixels are not Foundry authority, and the reconciled manifest/Blueprint owns later Foundry projection.',
  'project',
  'created_document',
  'locked',
  'S-2026-10-07-RULE-CONFLICT-RECONCILIATION-V2',
  'F-2026-10-07-SCENE-SEMANTIC-PIPELINE',
  'scene creation grayscale structural inspect manifest painterly final inspect foundry'
),
(
  'F-2026-10-07-MAP-WORKFLOW-V2',
  'governance',
  NULL,
  'Current map workflow reconciles semantic rendering with Blueprint authority',
  'The older blueprint -> walls/doors -> empty renderer -> Background Objects/Regions convention is superseded for new Scene Creation. PREPARE locks intended topology/scale; the grayscale structural pass may propose visible semantic details; structural inspection records them into a Feature Manifest; the manifest is reconciled with the Spatial Blueprint before painting; and only that reconciled deterministic record may drive Foundry Walls, Regions, lights, sounds, placeables, transitions, and interactions. Existing explicit Blueprint geometry still wins over conflicting pixels.',
  'project',
  'canonical',
  'locked',
  'S-2026-10-07-RULE-CONFLICT-RECONCILIATION-V2',
  'F-222',
  'map workflow blueprint semantic render background objects foundry authority'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id IN (
  'F-2026-10-07-RULE-CONFLICT-AUDIT-V2',
  'F-2026-10-07-SCENE-SEMANTIC-PIPELINE-V2',
  'F-2026-10-07-MAP-WORKFLOW-V2'
);

UPDATE kb_decisions
SET status='retired'
WHERE decision_id='D-2026-10-07-SCENE-SEMANTIC-RENDER-STANDARD';

INSERT OR REPLACE INTO kb_decisions(
  decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review
) VALUES
(
  'D-2026-10-07-RULE-CONFLICT-PRECEDENCE-V2',
  'Project rule conflict reconciliation',
  'Where active workflow text conflicts, the 2026-10-07 project-data rules and Scene semantic-render workflow are the latest accepted rendition. Narrow KB additions use dated seed.d deltas by default and rebuild from schema.sql + seed.sql + lexical seed.d; repository roadmap/active card is the immediate control plane; scheduled communication mirrors are non-blocking except at explicit publication boundaries; and historical roadmap/receipt wording remains provenance rather than current procedure.',
  'This removes contradictory active instructions without rewriting historical evidence and preserves the project source-precedence rule.',
  'project',
  'locked',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-07-RULE-CONFLICT-RECONCILIATION-V2',
  NULL
),
(
  'D-2026-10-07-SCENE-SEMANTIC-RENDER-V2',
  'Scene Creation rendering and semantic extraction',
  'Use a two-pass rendering workflow inside the existing PREPARE -> RENDER -> INSPECT -> BUILD API: first create and inspect a strict-overhead grayscale 3D structural render, lock a reconciled Feature Manifest/Spatial Blueprint, then create a painterly live render and inspect it again. Only FINAL_INSPECT PASS approves art. Raw pixels never directly become Foundry geometry; inspected and reconciled semantic records do.',
  'This preserves the user-approved Blender-like structural clarity and painterly material treatment while making wall types, blockers, lights, sounds, Regions, transitions, and interactables recoverable for Foundry configuration without allowing unreviewed pixel inference to become runtime authority.',
  'project',
  'locked',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-07-RULE-CONFLICT-RECONCILIATION-V2',
  NULL
);

INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions
WHERE decision_id IN (
  'D-2026-10-07-RULE-CONFLICT-PRECEDENCE-V2',
  'D-2026-10-07-SCENE-SEMANTIC-RENDER-V2'
);

UPDATE kb_open_items
SET
  status='in_progress',
  problem='The canonical two-pass Scene semantic render workflow is now specified, but the desktop app still needs a machine-readable Feature Manifest schema and deterministic mapping from inspected features to Spatial Blueprint/Foundry projection plans.',
  next_action='Define and validate the Feature Manifest schema, bind structural and final inspection receipts to render hashes, map manifest categories to deterministic Scene/Foundry plan types, and add representative fixtures/tests.',
  evidence_needed='Schema validation, representative structural/painterly fixtures, pre-color and post-color inspection receipts, stable render/hash bindings, and Foundry projection mapping tests.'
WHERE item_id='O-2026-10-07-SCENE-FEATURE-MANIFEST';

INSERT OR REPLACE INTO kb_relationships(
  relationship_id,from_type,from_id,relation,to_type,to_id,notes
) VALUES
(
  'R-2026-10-07-RULE-CONFLICT-V2-SUPERSEDES-SCENE-V1',
  'decision',
  'D-2026-10-07-SCENE-SEMANTIC-RENDER-V2',
  'supersedes',
  'decision',
  'D-2026-10-07-SCENE-SEMANTIC-RENDER-STANDARD',
  'V2 makes the two inspection stages, authority boundary, paint preservation rules, and stage-scoped REDO behavior explicit.'
),
(
  'R-2026-10-07-SCENE-V2-REQUIRES-MANIFEST',
  'decision',
  'D-2026-10-07-SCENE-SEMANTIC-RENDER-V2',
  'requires-next',
  'open_item',
  'O-2026-10-07-SCENE-FEATURE-MANIFEST',
  'The rule is canonical now; machine schema/enforcement remains implementation work.'
);
