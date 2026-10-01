-- Use with Python sqlite3, sqlitebrowser, or any SQLite client.

-- Search all normalized facts.
SELECT f.fact_id, f.domain, f.title, f.statement, f.evidence_class, f.status
FROM facts_fts s JOIN kb_facts f ON f.fact_id=s.fact_id
WHERE facts_fts MATCH :query ORDER BY rank;

-- Search normalized decisions with source provenance joined by the service.
SELECT d.decision_id, d.topic, d.decision, d.rationale, d.status, d.source_id
FROM decisions_fts s JOIN kb_decisions d ON d.decision_id=s.decision_id
WHERE decisions_fts MATCH :query ORDER BY rank;

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

-- Source coverage for provenance audits.
SELECT s.source_id, s.title,
       COUNT(DISTINCT f.fact_id) AS fact_count,
       COUNT(DISTINCT d.decision_id) AS decision_count,
       COUNT(DISTINCT t.trial_id) AS trial_count
FROM kb_sources s
LEFT JOIN kb_facts f ON f.source_id=s.source_id
LEFT JOIN kb_decisions d ON d.source_id=s.source_id
LEFT JOIN kb_trials t ON t.source_id=s.source_id
GROUP BY s.source_id, s.title ORDER BY s.source_id;

-- Cross-project tool catalog. Use the bounded Python query surface for FTS terms.
SELECT tool_id, project_id, project_name, tool_name, tool_kind,
       invocation, location, capability, authority, evidence_status, source_id
FROM kb_tools
ORDER BY project_id, tool_id;
