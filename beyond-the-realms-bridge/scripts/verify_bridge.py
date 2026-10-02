#!/usr/bin/env python3
"""Read-only integrity verifier for the local Beyond the Realms bridge."""

from __future__ import annotations

import hashlib
import json
import struct
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "BRIDGE_MANIFEST.json"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def png_dimensions(path: Path) -> tuple[int, int]:
    with path.open("rb") as handle:
        signature = handle.read(8)
        length = struct.unpack(">I", handle.read(4))[0]
        chunk_type = handle.read(4)
        payload = handle.read(length)
    if signature != b"\x89PNG\r\n\x1a\n" or chunk_type != b"IHDR" or len(payload) < 8:
        raise ValueError(f"not a valid PNG/IHDR asset: {path}")
    return struct.unpack(">II", payload[:8])


def fail(message: str) -> None:
    raise SystemExit(f"FAIL: {message}")


def main() -> None:
    if not MANIFEST_PATH.is_file():
        fail("BRIDGE_MANIFEST.json is missing")
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    if manifest.get("schemaVersion") != "1.0.0":
        fail("unsupported manifest schema")
    if manifest.get("bridgeId") != "beyond-the-realms-codex-bridge":
        fail("unexpected bridge identity")

    checked = 0
    for artifact in manifest.get("artifacts", []):
        path = ROOT / artifact["path"]
        if not path.is_file():
            fail(f"missing artifact: {artifact['path']}")
        expected = artifact.get("sha256", "")
        if expected.startswith("TO-BE-FILLED"):
            fail(f"unresolved manifest hash: {artifact['path']}")
        actual = sha256(path)
        if actual != expected.replace(" ", "").upper():
            fail(f"hash mismatch for {artifact['path']}: {actual}")
        checked += 1

    png = ROOT / "assets/BTR_Prototype5_Elemental_Confluence_Player_Map.png"
    dimensions = png_dimensions(png)
    if list(dimensions) != [1448, 1086]:
        fail(f"unexpected map dimensions: {dimensions}")
    if dimensions != tuple(manifest["artifacts"][-1]["dimensions"]):
        fail("manifest/map dimensions disagree")

    required = [
        "AGENTS.md",
        "README.md",
        "knowledge/CURRENT_STATE.md",
        "knowledge/STATUS_MODEL.md",
        "knowledge/WORKFLOW.md",
        "knowledge/RUNTIME_RESULTS.md",
        "knowledge/FAILURES_AND_LESSONS.md",
        "knowledge/CANONICAL_SOURCES.md",
        "CHANGE_CARD.md",
        "ACTIVE_CHECKLIST.md",
    ]
    for relative in required:
        if not (ROOT / relative).is_file():
            fail(f"missing required bridge file: {relative}")

    print(json.dumps({
        "status": "PASS",
        "bridgeId": manifest["bridgeId"],
        "checkedArtifacts": checked,
        "mapDimensions": list(dimensions),
        "network": False,
        "runtime": False,
        "remotePublication": False,
    }, indent=2))


if __name__ == "__main__":
    main()
