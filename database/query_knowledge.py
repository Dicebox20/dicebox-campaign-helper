"""Bounded, read-only queries over the reproducible DiceBox knowledge base."""

from __future__ import annotations

import argparse
import json
import re
import sqlite3
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent
DEFAULT_DATABASE = ROOT / "dicebox_campaign_helper_knowledge.sqlite"
KINDS = (
    "facts",
    "decisions",
    "trials",
    "blockers",
    "subject",
    "plan",
    "sources",
    "coverage",
    "tools",
    "summary",
)


def safe_limit(value: int) -> int:
    if value < 1 or value > 100:
        raise ValueError("limit must be between 1 and 100")
    return value


def fts_terms(value: str) -> str:
    """Turn user text into a conservative FTS5 phrase query.

    FTS syntax is deliberately not exposed. Only alphanumeric and underscore
    tokens are retained and each token is quoted. Punctuation is separated so
    that a user-facing identifier such as "broken-reference" matches FTS5's
    independently tokenized "broken" and "reference" terms.
    """

    tokens = re.findall(r"[A-Za-z0-9_]+", value.strip())
    if not tokens:
        raise ValueError("term must contain at least one searchable token")
    return " AND ".join('"' + token.replace('"', '""') + '"' for token in tokens)


def rows(connection: sqlite3.Connection, statement: str, parameters: tuple[Any, ...] = ()) -> list[dict[str, Any]]:
    connection.row_factory = sqlite3.Row
    return [dict(row) for row in connection.execute(statement, parameters).fetchall()]


def query(connection: sqlite3.Connection, kind: str, *, term: str | None = None,
          subject_no: int | None = None, domain: str | None = None,
          project_id: str | None = None,
          limit: int = 20) -> list[dict[str, Any]]:
    limit = safe_limit(limit)
    if kind == "facts":
        if not term:
            raise ValueError("facts requires --term")
        return rows(connection, """
            SELECT f.fact_id, f.domain, f.title, f.statement, f.evidence_class,
                   f.status, f.source_id, s.title AS source_title,
                   s.location AS source_location, s.captured_at AS source_captured_at
            FROM facts_fts AS search
            JOIN kb_facts AS f ON f.fact_id = search.fact_id
            JOIN kb_sources AS s ON s.source_id = f.source_id
            WHERE facts_fts MATCH ?
            ORDER BY rank, f.fact_id
            LIMIT ?
        """, (fts_terms(term), limit))
    if kind == "decisions":
        if not term:
            raise ValueError("decisions requires --term")
        return rows(connection, """
            SELECT d.decision_id, d.topic, d.decision, d.rationale, d.scope,
                   d.status, d.owner, d.source_id, s.title AS source_title,
                   s.location AS source_location, s.captured_at AS source_captured_at
            FROM decisions_fts AS search
            JOIN kb_decisions AS d ON d.decision_id = search.decision_id
            JOIN kb_sources AS s ON s.source_id = d.source_id
            WHERE decisions_fts MATCH ?
            ORDER BY rank, d.decision_id
            LIMIT ?
        """, (fts_terms(term), limit))
    if kind == "trials":
        if not term:
            raise ValueError("trials requires --term")
        return rows(connection, """
            SELECT t.trial_id, t.area, t.symptom, t.failure_cause, t.correction,
                   t.evidence_status, t.source_id, s.title AS source_title,
                   s.location AS source_location, s.captured_at AS source_captured_at
            FROM trials_fts AS search
            JOIN kb_trials AS t ON t.trial_id = search.trial_id
            JOIN kb_sources AS s ON s.source_id = t.source_id
            WHERE trials_fts MATCH ?
            ORDER BY rank, t.trial_id
            LIMIT ?
        """, (fts_terms(term), limit))
    if kind == "blockers":
        return rows(connection, """
            SELECT b.item_id, b.item_class, b.title, b.problem, b.next_action,
                   b.evidence_needed, b.priority, b.status, b.owner,
                   b.source_id, s.title AS source_title, s.location AS source_location
            FROM v_active_blockers AS b
            JOIN kb_sources AS s ON s.source_id = b.source_id
            ORDER BY CASE b.priority WHEN 'P0' THEN 0 WHEN 'P1' THEN 1 WHEN 'P2' THEN 2 ELSE 3 END,
                     b.item_id
            LIMIT ?
        """, (limit,))
    if kind == "subject":
        if subject_no is None or subject_no < 1:
            raise ValueError("subject requires --subject-no")
        return rows(connection, """
            SELECT r.subject_no, r.subject, r.status, r.depth, r.project_delta,
                   r.community_research, r.next_step, r.source_id,
                   s.title AS source_title, s.location AS source_location
            FROM kb_research_subjects AS r
            JOIN kb_sources AS s ON s.source_id = r.source_id
            WHERE r.subject_no = ?
        """, (subject_no,))
    if kind == "plan":
        return rows(connection, """
            SELECT milestone_id, milestone, goal, deliverables, exit_gate,
                   dependencies, status, source_id
            FROM kb_milestones
            ORDER BY milestone_id
            LIMIT ?
        """, (limit,))
    if kind == "sources":
        if domain:
            return rows(connection, """
                SELECT DISTINCT s.source_id, s.title, s.authority, s.location,
                                s.captured_at, s.version_fingerprint
                FROM kb_sources AS s
                JOIN kb_facts AS f ON f.source_id = s.source_id
                WHERE f.domain = ?
                ORDER BY s.source_id
                LIMIT ?
            """, (domain, limit))
        return rows(connection, """
            SELECT source_id, title, authority, location, captured_at,
                   version_fingerprint
            FROM kb_sources
            ORDER BY source_id
            LIMIT ?
        """, (limit,))
    if kind == "coverage":
        return rows(connection, """
            SELECT s.source_id, s.title, s.captured_at,
                   COUNT(DISTINCT f.fact_id) AS fact_count,
                   COUNT(DISTINCT d.decision_id) AS decision_count,
                   COUNT(DISTINCT t.trial_id) AS trial_count,
                   COUNT(DISTINCT o.item_id) AS open_item_count,
                   COUNT(DISTINCT r.relationship_id) AS relationship_count
            FROM kb_sources AS s
            LEFT JOIN kb_facts AS f ON f.source_id = s.source_id
            LEFT JOIN kb_decisions AS d ON d.source_id = s.source_id
            LEFT JOIN kb_trials AS t ON t.source_id = s.source_id
            LEFT JOIN kb_open_items AS o ON o.source_id = s.source_id
            LEFT JOIN kb_relationships AS r ON r.from_id = s.source_id OR r.to_id = s.source_id
            GROUP BY s.source_id, s.title, s.captured_at
            ORDER BY s.source_id
            LIMIT ?
        """, (limit,))
    if kind == "tools":
        select = """
            SELECT t.tool_id, t.project_id, t.project_name, t.tool_name,
                   t.tool_kind, t.invocation, t.location, t.capability,
                   t.authority, t.evidence_status, t.source_id, t.tags,
                   s.title AS source_title, s.location AS source_location,
                   s.captured_at AS source_captured_at
            FROM tools_fts AS search
            JOIN kb_tools AS t ON t.tool_id = search.tool_id
            JOIN kb_sources AS s ON s.source_id = t.source_id
        """
        if term and project_id:
            return rows(connection, select + """
                WHERE tools_fts MATCH ? AND t.project_id = ?
                ORDER BY rank, t.project_id, t.tool_id
                LIMIT ?
            """, (fts_terms(term), project_id, limit))
        if term:
            return rows(connection, select + """
                WHERE tools_fts MATCH ?
                ORDER BY rank, t.project_id, t.tool_id
                LIMIT ?
            """, (fts_terms(term), limit))
        if project_id:
            return rows(connection, select + """
                WHERE t.project_id = ?
                ORDER BY t.project_id, t.tool_id
                LIMIT ?
            """, (project_id, limit))
        return rows(connection, select + """
            ORDER BY t.project_id, t.tool_id
            LIMIT ?
        """, (limit,))
    if kind == "summary":
        return rows(connection, """
            SELECT
              (SELECT COUNT(*) FROM kb_sources) AS sources,
              (SELECT COUNT(*) FROM kb_facts) AS facts,
              (SELECT COUNT(*) FROM kb_decisions) AS decisions,
              (SELECT COUNT(*) FROM kb_open_items WHERE status IN ('open','in_progress','blocked')) AS active_work,
              (SELECT COUNT(*) FROM kb_trials) AS trials,
              (SELECT COUNT(*) FROM kb_research_subjects) AS research_subjects,
              (SELECT COUNT(*) FROM kb_milestones) AS milestones
        """)
    raise ValueError(f"unsupported query kind: {kind}")


def run(args: argparse.Namespace) -> dict[str, Any]:
    database = Path(args.database).resolve()
    if not database.exists():
        raise ValueError(f"database does not exist: {database}")
    # URI mode=ro is a second safety boundary: this service cannot create WAL,
    # FTS, or migration files even if a future query is accidentally changed.
    uri = f"file:{database.as_posix()}?mode=ro"
    with sqlite3.connect(uri, uri=True) as connection:
        result_rows = query(
            connection,
            args.kind,
            term=args.term,
            subject_no=args.subject_no,
            domain=args.domain,
            project_id=args.project_id,
            limit=args.limit,
        )
    return {
        "schemaVersion": "0.1.0",
        "mode": "read-only",
        "kind": args.kind,
        "databasePath": str(database),
        "rows": result_rows,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", default=str(DEFAULT_DATABASE))
    parser.add_argument("--kind", choices=KINDS, required=True)
    parser.add_argument("--term")
    parser.add_argument("--subject-no", type=int)
    parser.add_argument("--domain")
    parser.add_argument("--project-id")
    parser.add_argument("--limit", type=int, default=20)
    args = parser.parse_args()
    try:
        print(json.dumps(run(args), indent=2, sort_keys=True))
    except (sqlite3.Error, ValueError) as error:
        print(json.dumps({"schemaVersion": "0.1.0", "mode": "read-only", "status": "BLOCKED", "error": str(error)}))
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
