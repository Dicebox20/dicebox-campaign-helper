-- Use with Python sqlite3, sqlitebrowser, or any SQLite client.

-- Search all normalized facts.
SELECT f.fact_id, f.domain, f.title, f.statement, f.evidence_class, f.status
FROM facts_fts s JOIN kb_facts f ON f.fact_id=s.fact_id
WHERE facts_fts MATCH :query ORDER BY rank;

-- Find blockers and next actions.
SELECT * FROM v_active_blockers;

-- Inspect one subject and its next step.
SELECT * FROM v_subject_readiness WHERE subject_no=:subject_no;

-- Search trial-and-error history.
SELECT t.trial_id, t.area, t.symptom, t.failure_cause, t.correction, t.evidence_status
FROM trials_fts s JOIN kb_trials t ON t.trial_id=s.trial_id
WHERE trials_fts MATCH :query ORDER BY rank;

-- Show creation milestones in dependency order.
SELECT * FROM v_project_plan;

-- Find all sources behind a topic.
SELECT DISTINCT s.source_id, s.title, s.authority, s.location
FROM kb_sources s
JOIN kb_facts f ON f.source_id=s.source_id
WHERE f.domain=:domain ORDER BY s.source_id;

-- Readiness summary.
SELECT
  (SELECT COUNT(*) FROM kb_facts) AS facts,
  (SELECT COUNT(*) FROM kb_sources) AS sources,
  (SELECT COUNT(*) FROM kb_open_items WHERE status IN ('open','in_progress','blocked')) AS active_work,
  (SELECT COUNT(*) FROM kb_research_subjects WHERE status LIKE 'complete%') AS completed_subjects,
  (SELECT COUNT(*) FROM kb_milestones) AS milestones;
