-- Validation receipt for historical Foundry VTT evidence ingest
-- 2026-10-07

INSERT OR REPLACE INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
  'S-2026-10-07-FOUNDRY-HISTORICAL-EVIDENCE-VALIDATION',
  'Historical Foundry VTT Evidence Ingest Validation',
  'verification',
  'Deterministic validation of the historical Foundry evidence import',
  'Database rebuild, verifier pass, bounded read-only KB queries, manifest identity, and import receipt',
  'active',
  'outputs/foundry-historical-evidence-ingest-2026-10-07-receipt.json',
  '2026-10-07',
  '64a51c7d6da147eff72080bbd3a5130a90cca854ef3a5663f1ef827e91c0b8bc',
  'Initial ingest rebuild passed with integrity ok: 2158 sources, 1948 facts, 1698 decisions, 148 open items, 1276 trials, 45 subjects, 124 milestones, 254 tools, 8 seed.d deltas.'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES (
  'F-2026-10-07-FOUNDRY-HISTORICAL-EVIDENCE-VALIDATED',
  'foundry.historical.ingest',
  NULL,
  'Historical Foundry evidence ingest validated',
  'The 2026-10-07 historical Foundry evidence pass fingerprinted 166 selected legacy evidence files totaling 45,047,439 bytes across five older Codex project roots, fingerprinted 12 Castle Scene-database backup bundles without copying raw databases, indexed eight read-only Ballad world snapshots, and imported 163 historical facts, six historical trials, six historical tools, and six source records. The reproducible KB rebuilt with integrity ok and database/verify_database.py passed. Bounded rereads recovered the historical MATT/Midi-QOL 8-of-8 result, Castle teleportToken RegionBehavior pattern, DMF 16-character DND5e activity-ID evidence, and Simon Maze Scene record. No live Foundry mutation occurred and legacy direct-LevelDB mutation patterns remain historical anti-pattern evidence only.',
  'project',
  'deterministic',
  'locked',
  'S-2026-10-07-FOUNDRY-HISTORICAL-EVIDENCE-VALIDATION',
  NULL,
  'foundry historical evidence ingest validation provenance castle DMF MATT MidiQOL snapshots uuid'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-07-FOUNDRY-HISTORICAL-EVIDENCE-VALIDATED';

INSERT OR REPLACE INTO kb_relationships(
  relationship_id,from_type,from_id,relation,to_type,to_id,notes
) VALUES (
  'R-2026-10-07-FOUNDRY-HISTORICAL-INGEST-VALIDATED',
  'fact',
  'F-2026-10-07-FOUNDRY-HISTORICAL-EVIDENCE-VALIDATED',
  'validates',
  'source',
  'S-2026-10-07-FOUNDRY-HISTORICAL-EVIDENCE-INGEST',
  'Deterministic KB rebuild, verifier, manifest fingerprint, and bounded rereads validate the imported historical evidence packet without promoting it to current runtime authority.'
);
