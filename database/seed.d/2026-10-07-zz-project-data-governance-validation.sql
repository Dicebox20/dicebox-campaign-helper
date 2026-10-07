-- Dicebox supplemental KB seed: validation receipt for 2026-10-07 project-data governance
-- 2026-10-07

INSERT OR REPLACE INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
  'S-2026-10-07-PROJECT-DATA-GOVERNANCE-VERIFY',
  'Project Data Governance Validation Receipt',
  'verification',
  'Reproducible KB rebuild and verification after project-data governance adoption',
  'Deterministic build_database.py and verify_database.py execution against canonical repository commit 2dde2e0695ab6f5bda1bbf41ab6978c2b64dc464',
  'active',
  'outputs/2026-10-07-project-data-governance-validation-receipt.json',
  '2026-10-07',
  'kb-governance-validation-v1',
  'Integrity ok; 2150 sources, 1781 facts, 1696 decisions, 148 open items, 1269 trials, 45 subjects, 124 milestones, 248 tools, 5 seed deltas.'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES (
  'F-2026-10-07-PROJECT-DATA-GOVERNANCE-VALIDATED',
  'project.data-governance',
  NULL,
  'Project data governance KB rebuild validated',
  'The canonical repository knowledge base rebuilt successfully with the 2026-10-07 project-data governance delta and passed database/verify_database.py. SQLite integrity was ok and the existing Central Lodge verification invariants remained satisfied.',
  'project',
  'deterministic',
  'locked',
  'S-2026-10-07-PROJECT-DATA-GOVERNANCE-VERIFY',
  NULL,
  'data governance validation kb rebuild integrity chronology'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-07-PROJECT-DATA-GOVERNANCE-VALIDATED';

INSERT OR REPLACE INTO kb_relationships(
  relationship_id,from_type,from_id,relation,to_type,to_id,notes
) VALUES (
  'R-2026-10-07-PROJECT-DATA-GOVERNANCE-VALIDATION',
  'fact',
  'F-2026-10-07-PROJECT-DATA-GOVERNANCE-VALIDATED',
  'validates',
  'decision',
  'D-2026-10-07-NEW-DATA-IMPLEMENTATION-RULE',
  'The deterministic KB rebuild and verifier receipt validate that the governance records integrate cleanly with the reproducible knowledge base.'
);
