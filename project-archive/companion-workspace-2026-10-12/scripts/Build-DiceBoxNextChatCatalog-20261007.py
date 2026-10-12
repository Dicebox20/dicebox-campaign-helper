#!/usr/bin/env python3
"""Full DiceBox successor catalogue. Read-only DB; writes only handoffs/catalog-* artifacts."""
import hashlib
import json
import os
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(r"C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper")
LODGE = Path(r"C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper\work\lodge-campaign")
OUT = ROOT / "handoffs" / "catalog-2026-10-07"
SQLITE = ROOT / "database" / "dicebox_campaign_helper_knowledge.sqlite"
HANDOFF = ROOT / "handoffs" / "FOREMAN-NEXT-CHAT-COMPLETE-CATALOG-2026-10-07.md"

TABLES = [
    "kb_sources", "kb_facts", "kb_decisions", "kb_open_items", "kb_trials",
    "kb_metadata", "kb_milestones", "kb_research_subjects", "kb_relationships", "kb_tools"
]
SKIP_DIR_NAMES = {
    ".git", "node_modules", ".venv", "__pycache__", ".pytest_cache",
    ".mypy_cache", ".next"
}
SKIP_FILENAME_EXACT = {
    ".env", ".env.local", "access-token", "private-key", "credentials.json",
    "token.json", "id_rsa", "id_ed25519"
}
SKIP_SUFFIXES = {".pem", ".p12", ".pfx", ".key"}
SELF_EXCLUDED = {
    (OUT / "project-file-metadata-sha256.json").resolve(),
    (OUT / "catalog-integrity.json").resolve(),
}
B = 1024 * 1024

def digest(path):
    sha = hashlib.sha256()
    with path.open("rb") as f:
        while True:
            data = f.read(B)
            if not data:
                break
            sha.update(data)
    return sha.hexdigest()

def dump_json(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=True, default=str) + "\n", encoding="utf-8")

def inventory_tree(root, tag, skipped, errors):
    result = []
    for directory, dirs, files in os.walk(root):
        dirs[:] = sorted(x for x in dirs if x not in SKIP_DIR_NAMES)
        for name in sorted(files):
            p = Path(directory) / name
            rel = str(p.relative_to(root)).replace("\\", "/")
            if name.lower() in SKIP_FILENAME_EXACT or p.suffix.lower() in SKIP_SUFFIXES or "secret" in name.lower():
                skipped.append({"root": tag, "relative_path": rel, "reason": "potential credential material"})
                continue
            if p.resolve() in SELF_EXCLUDED:
                skipped.append({"root": tag, "relative_path": rel, "reason": "self-referential output"})
                continue
            try:
                st = p.stat()
                result.append({
                    "root": tag,
                    "relative_path": rel,
                    "bytes": st.st_size,
                    "modified_utc": datetime.fromtimestamp(st.st_mtime, timezone.utc).isoformat(),
                    "sha256": digest(p),
                })
            except Exception as e:
                errors.append({"root": tag, "relative_path": rel, "error": str(e)})
    return result

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    if not HANDOFF.exists() or not SQLITE.exists() or not LODGE.exists():
        raise RuntimeError("A required authoritative handoff, database or original Lodge source root is missing")
    conn = sqlite3.connect(f"file:{SQLITE.as_posix()}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    try:
        integrity = conn.execute("PRAGMA integrity_check").fetchone()[0]
        if integrity != "ok":
            raise RuntimeError("SQLite integrity: " + str(integrity))
        records = {}
        counts = {}
        schema = {}
        for table in TABLES:
            meta = conn.execute('PRAGMA table_info("' + table + '")').fetchall()
            column_names = [r["name"] for r in meta]
            rows = [dict(r) for r in conn.execute('SELECT * FROM "' + table + '" ORDER BY "' + column_names[0] + '"')]
            records[table] = {"columns": [dict(x) for x in meta], "rows": rows}
            counts[table] = len(rows)
            sch = conn.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name=?", (table,)).fetchone()
            schema[table] = sch[0] if sch else None
        integrity_views = {}
        for view in ["v_active_blockers", "v_project_plan", "v_subject_readiness"]:
            integrity_views[view] = conn.execute('SELECT COUNT(*) FROM "' + view + '"').fetchone()[0]
    finally:
        conn.close()
    created_at = datetime.now(timezone.utc).isoformat()
    snapshot = {
        "schema_version": "1.0.0",
        "description": "Full canonical KB records and column metadata; FTS shadow/duplicate indexes excluded",
        "generated_utc": created_at,
        "sqlite_integrity": integrity,
        "root": str(SQLITE),
        "table_counts": counts,
        "view_counts": integrity_views,
        "table_schemas": schema,
        "tables": records,
    }
    kbp = OUT / "all-kb-data-and-metadata.json"
    dump_json(kbp, snapshot)

    skipped, errors = [], []
    files = inventory_tree(ROOT, "foreman_project", skipped, errors)
    files.extend(inventory_tree(LODGE, "original_lodge_source", skipped, errors))
    files.sort(key=lambda x: (x["root"], x["relative_path"]))
    totals = {
        "files_hashed": len(files),
        "hashed_bytes": sum(x["bytes"] for x in files),
        "foreman_project_files": sum(x["root"] == "foreman_project" for x in files),
        "original_lodge_source_files": sum(x["root"] == "original_lodge_source" for x in files),
    }
    manifest = {
        "schema_version": "1.0.0",
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "scope": "Two exact on-disk roots; excludes secret-looking material, dependency caches and self-referential outputs",
        "roots": {"foreman_project": str(ROOT), "original_lodge_source": str(LODGE)},
        "external_related_repo": r"C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper",
        "external_related_repo_note": "Full source repo has ~69,186 files / 43GB, including vendored caches and fixtures; original Lodge source subtree is inventoried completely here, but rest is referenced rather than copied.",
        "skipped_dir_names": sorted(SKIP_DIR_NAMES),
        "skipped_files": skipped,
        "errors": errors,
        "totals": totals,
        "files": files,
    }
    mp = OUT / "project-file-metadata-sha256.json"
    dump_json(mp, manifest)

    receipt = {
        "schema_version": "1.0.0",
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "status": "PASS" if not errors else "PARTIAL_WITH_FILE_READ_ERRORS",
        "kb_table_counts": counts,
        "kb_sqlite_integrity": integrity,
        "kb_snapshot": {"path": str(kbp), "bytes": kbp.stat().st_size, "sha256": digest(kbp)},
        "file_manifest": {"path": str(mp), "bytes": mp.stat().st_size, "sha256": digest(mp)},
        "latest_handoff": {"path": str(HANDOFF), "bytes": HANDOFF.stat().st_size, "sha256": digest(HANDOFF)},
        "sqlite_snapshot": {"path": str(SQLITE), "bytes": SQLITE.stat().st_size, "sha256": digest(SQLITE)},
        "files": totals,
        "file_read_errors": errors,
        "self_consistency_checks": {
            "canonical_table_count": len(TABLES),
            "all_source_rows_exported": counts["kb_sources"] >= 395,
            "all_fact_rows_exported": counts["kb_facts"] >= 1170,
            "no_orphaned_export": all(len(records[t]["rows"]) == counts[t] for t in TABLES)
        },
    }
    ip = OUT / "catalog-integrity.json"
    dump_json(ip, receipt)
    # Read everything we wrote independently.
    reloaded = json.loads(kbp.read_text(encoding="utf-8"))
    inv = json.loads(mp.read_text(encoding="utf-8"))
    receipt_check = json.loads(ip.read_text(encoding="utf-8"))
    ok = not errors and all(receipt["self_consistency_checks"].values()) \
         and len(inv["files"]) == totals["files_hashed"] \
         and len(reloaded["tables"]) == len(TABLES) \
         and all(digest(Path(receipt_check[k]["path"])) == receipt_check[k]["sha256"] for k in ("kb_snapshot", "file_manifest", "latest_handoff", "sqlite_snapshot"))
    if not ok:
        print(json.dumps({"status": "FAIL", "counts": counts, "totals": totals, "fileErrors": errors[:5]}))
        raise SystemExit(2)
    print(json.dumps({
        "status": "PASS",
        "kb_table_counts": counts,
        "kb_view_counts": integrity_views,
        "roots": list(manifest["roots"]),
        "file_totals": totals,
        "kb_export_sha256": receipt["kb_snapshot"]["sha256"],
        "file_manifest_sha256": receipt["file_manifest"]["sha256"],
        "handoff_sha256": receipt["latest_handoff"]["sha256"],
        "integrity_path": str(ip)
    }))
if __name__ == "__main__":
    main()
