PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS kb_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS kb_sources (
  source_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source_kind TEXT NOT NULL CHECK (source_kind IN ('canonical','project','campaign','conversation','external','verification')),
  scope TEXT NOT NULL,
  authority TEXT NOT NULL,
  status TEXT NOT NULL,
  location TEXT NOT NULL,
  captured_at TEXT,
  version_fingerprint TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS kb_facts (
  fact_id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  subject_no INTEGER,
  title TEXT NOT NULL,
  statement TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('global','project','campaign','historical')),
  evidence_class TEXT NOT NULL CHECK (evidence_class IN ('canonical','static','deterministic','created_document','safe_use','full_function','historical','blocked')),
  status TEXT NOT NULL CHECK (status IN ('locked','active','provisional','superseded','blocked')),
  source_id TEXT NOT NULL REFERENCES kb_sources(source_id),
  supersedes_fact_id TEXT REFERENCES kb_facts(fact_id),
  tags TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS kb_decisions (
  decision_id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  decision TEXT NOT NULL,
  rationale TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('global','project','campaign')),
  status TEXT NOT NULL CHECK (status IN ('locked','proposed','blocked','retired')),
  owner TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES kb_sources(source_id),
  next_review TEXT
);

CREATE TABLE IF NOT EXISTS kb_open_items (
  item_id TEXT PRIMARY KEY,
  item_class TEXT NOT NULL CHECK (item_class IN ('research','implementation','certification','defect','reconciliation','release')),
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  next_action TEXT NOT NULL,
  evidence_needed TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('P0','P1','P2','P3')),
  status TEXT NOT NULL CHECK (status IN ('open','in_progress','blocked','closed')),
  owner TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES kb_sources(source_id)
);

CREATE TABLE IF NOT EXISTS kb_trials (
  trial_id TEXT PRIMARY KEY,
  area TEXT NOT NULL,
  symptom TEXT NOT NULL,
  attempted_approach TEXT NOT NULL,
  failure_cause TEXT NOT NULL,
  correction TEXT NOT NULL,
  evidence_status TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES kb_sources(source_id)
);

CREATE TABLE IF NOT EXISTS kb_research_subjects (
  subject_no INTEGER PRIMARY KEY,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  depth TEXT NOT NULL,
  project_delta TEXT NOT NULL,
  community_research TEXT NOT NULL,
  next_step TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES kb_sources(source_id)
);

CREATE TABLE IF NOT EXISTS kb_milestones (
  milestone_id TEXT PRIMARY KEY,
  milestone TEXT NOT NULL,
  goal TEXT NOT NULL,
  deliverables TEXT NOT NULL,
  exit_gate TEXT NOT NULL,
  dependencies TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planned','ready','in_progress','blocked','complete')),
  source_id TEXT NOT NULL REFERENCES kb_sources(source_id)
);

CREATE TABLE IF NOT EXISTS kb_relationships (
  relationship_id TEXT PRIMARY KEY,
  from_type TEXT NOT NULL,
  from_id TEXT NOT NULL,
  relation TEXT NOT NULL,
  to_type TEXT NOT NULL,
  to_id TEXT NOT NULL,
  notes TEXT
);

CREATE VIRTUAL TABLE IF NOT EXISTS facts_fts USING fts5(fact_id UNINDEXED, title, statement, tags);
CREATE VIRTUAL TABLE IF NOT EXISTS decisions_fts USING fts5(decision_id UNINDEXED, topic, decision, rationale);
CREATE VIRTUAL TABLE IF NOT EXISTS open_items_fts USING fts5(item_id UNINDEXED, title, problem, next_action, evidence_needed);
CREATE VIRTUAL TABLE IF NOT EXISTS trials_fts USING fts5(trial_id UNINDEXED, area, symptom, attempted_approach, failure_cause, correction);
CREATE VIRTUAL TABLE IF NOT EXISTS research_fts USING fts5(subject_no UNINDEXED, subject, project_delta, community_research, next_step);

CREATE VIEW IF NOT EXISTS v_active_blockers AS
SELECT item_id, item_class, title, problem, next_action, evidence_needed, priority, status, owner, source_id
FROM kb_open_items WHERE status IN ('open','in_progress','blocked') ORDER BY priority, item_id;

CREATE VIEW IF NOT EXISTS v_subject_readiness AS
SELECT subject_no, subject, status, depth, project_delta, community_research, next_step
FROM kb_research_subjects ORDER BY subject_no;

CREATE VIEW IF NOT EXISTS v_project_plan AS
SELECT milestone_id, milestone, goal, deliverables, exit_gate, dependencies, status
FROM kb_milestones ORDER BY milestone_id;
