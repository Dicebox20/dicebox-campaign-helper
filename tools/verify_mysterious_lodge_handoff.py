"""Read-only, campaign-scoped handoff validator; --seal deliberately refreshes recorded hashes.

A machine PASS means the files and evidence are internally consistent, not
that a new conversation passed the creative comprehension exam or that a
Foundry runtime is authorized / usable.
"""
from __future__ import annotations
import hashlib
import json
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACKAGE = ROOT / "docs/campaigns/mysterious-lodge"
AUDIT = ROOT / "work/clscale-central-lodge-migration-v001/story-reconstruction-audit-20261010"
SEAL = PACKAGE / "HANDOFF-SEAL.json"
REQUIRED = [
 "START-HERE.md",
 "CHANGELOG.md",
 "NEW-CHAT-WORKFLOW.md",
 "CREATIVE-CANON.md",
 "PUZZLE-ROUTES.md",
 "SOURCE-INDEX.md",
 "SESSION-HANDOFF.md",
 "CURRENT-STATE.json",
 "COLD-START-EXAM.json",
 "DECISIONS.jsonl",
 "COLD-START-TEST.md",
 "PORTABLE-HANDOFF.md",
 "CODEX-PARTNER.md",
 "MAINTENANCE.md",
]
AUDIT_REQUIRED = [
 "snapshot-provenance.json",
 "full-evidence-catalog.json",
 "enhanced-puzzle-interaction-audit.json",
 "visual-artwork-file-manifest.json",
 "story-audit-continuation-receipt-20261010.json",
 "THE-MYSTERIOUS-LODGE-RECONSTRUCTION-FINDINGS-20261010.md",
]
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
errors = []
assert len(set(REQUIRED)) == len(REQUIRED)
for name in REQUIRED:
 if not (PACKAGE/name).is_file(): errors.append("MISSING_HANDOFF:"+name)
for name in AUDIT_REQUIRED:
 if not (AUDIT/name).is_file(): errors.append("MISSING_SOURCE:"+name)
if errors:
 print(json.dumps({"status":"STOP","errors":errors},indent=2));sys.exit(1)

state = json.loads((PACKAGE/"CURRENT-STATE.json").read_text("utf-8-sig"))
exam = json.loads((PACKAGE/"COLD-START-EXAM.json").read_text("utf-8-sig"))
facts = json.loads((AUDIT/"full-evidence-catalog.json").read_text("utf-8-sig"))
enhanced = json.loads((AUDIT/"enhanced-puzzle-interaction-audit.json").read_text("utf-8-sig"))
art = json.loads((AUDIT/"visual-artwork-file-manifest.json").read_text("utf-8-sig"))
audit_receipt = json.loads((AUDIT/"story-audit-continuation-receipt-20261010.json").read_text("utf-8-sig"))
snapshot = json.loads((AUDIT/"snapshot-provenance.json").read_text("utf-8-sig"))
decision_lines = (PACKAGE/"DECISIONS.jsonl").read_text("utf-8-sig").splitlines()
decisions=[json.loads(x) for x in decision_lines if x.strip()]
assert state["campaignId"]=="mysterious-lodge"
assert "Central Lodge" in state["aliases"]
assert "House of the Damned" in state["separateCampaigns"]
assert state["creativeEndingStatus"]=="UNDECIDED"
assert state["nextAction"]["mayMutateWorld"] is False
assert exam["schema"]=="mysterious-lodge-cold-start-exam/v1"
assert len(exam["questions"])>=10
assert all(x.get("critical") is True for x in exam["questions"][:11])
assert len({x["id"] for x in exam["questions"]})==len(exam["questions"])
assert len({x["eventId"] for x in decisions})==len(decisions)
assert any(x["authority"]=="OWNER_APPROVED" for x in decisions)
assert any(x["authority"]=="RECOVERED_IMPL" for x in decisions)
assert state.get("mostRecentCampaignWorkUnit") in (PACKAGE/"SESSION-HANDOFF.md").read_text("utf-8-sig"), "Latest campaign work unit absent from Session Handoff"
assert state.get("nextAction",{}).get("id") in (PACKAGE/"SESSION-HANDOFF.md").read_text("utf-8-sig"), "Next campaign task ID not mirrored into Session Handoff"
if any("expected" in q for q in exam["questions"]):errors.append("CANDIDATE_ANSWER_KEY_LEAK")
if state.get("continuitySystem",{}).get("status")=="COMPLETE_LOCAL_WITH_INDEPENDENT_CODEX_RECOVERY_PASS":
 if state.get("nextAction",{}).get("id")=="MLODGE-COLDSTART-001":errors.append("STALE_COMPLETED_COLDSTART_AS_NEXT_ACTION")
 if not any(x.get("eventId")=="MLODGE-CONTINUITY-CLOSURE-20261010-008" for x in decisions):errors.append("MISSING_CLOSURE_RECORD")
for question in exam["questions"]:
 if question["source"] not in REQUIRED:errors.append("MISSING_EXAM_SOURCE:"+question["source"])
counts=state["verifiedFixture"]
actuals={
 "sceneCount":len(facts["scenes"]),
 "regions":len(facts["regions"]),
 "regionBehaviors":len(facts["behaviors"]),
 "items":len(facts["items"]),
 "structuredContracts":enhanced["parsedTotal"],
 "artFiles":art["artworkFiles"],
 "sceneBackgroundBindings":art["sceneBackgroundOrImgAssignments"],
}
for key,value in actuals.items():
 if counts.get(key)!=value:errors.append(f"EVIDENCE_DRIFT:{key}:state={counts.get(key)}:source={value}")
if audit_receipt["verifiedCounts"]["scenes"]!=counts["sceneCount"]:errors.append("RECEIPT_SCENE_DRIFT")
if snapshot["fileCount"]!=109:errors.append("SOURCE_COPY_COUNT_DRIFT")
if len(snapshot["files"])!=snapshot["fileCount"]:errors.append("SOURCE_COPY_MANIFEST_MISMATCH")
source_copy_drift=[]
for entry in snapshot["files"]:
 file=AUDIT/entry["relative"]
 if not file.is_file():
  source_copy_drift.append("REMOVED_AFTER_COPY:"+entry["relative"])  # copied LevelDB may compact obsolete files
 elif sha(file)!=entry["sha256"].lower():
  source_copy_drift.append(entry["relative"])  # LevelDB files may change on open; historical hashes are retained
source_assets=ROOT/"work/foundry-fixture-data-permanent/Data/worlds/the-lost-mine-of-phandalin/assets/central-lodge"
for entry in art["files"]:
 file=source_assets/entry["path"]
 if not file.is_file() or sha(file)!=entry["sha256"].lower():
  errors.append("ART_HASH_DRIFT:"+entry["path"])
kb_verification = "NOT_DECLARED_SYNCHRONIZED"
if state.get("knowledgeBaseSync", {}).get("canonicalDatabasePromotion") == "PASS_CANONICAL_KB_SYNCHRONIZED":
 with sqlite3.connect("file:"+(ROOT/"database/dicebox_campaign_helper_knowledge.sqlite").as_posix()+"?mode=ro",uri=True) as connection:
  if connection.execute("PRAGMA integrity_check").fetchone()[0] != "ok": errors.append("KB_INTEGRITY_FAILED")
  if connection.execute("SELECT count(*) FROM kb_decisions WHERE decision_id=?",("D-MLODGE-HANDOFF-20261010",)).fetchone()[0] != 1: errors.append("KB_HANDOFF_DECISION_MISSING")
 kb_verification = "VERIFIED_READ_ONLY" if not errors else "STOP"
current_seal={
 "schema":"mysterious-lodge-handoff-seal/v1",
 "tracked":{name:sha(PACKAGE/name) for name in REQUIRED},
 "sourceReceiptSha256":sha(AUDIT/"story-audit-continuation-receipt-20261010.json"),
 "sourceSnapshotManifestSha256":sha(AUDIT/"snapshot-provenance.json"),
 "extractedEvidenceHashes":{name:sha(AUDIT/name) for name in AUDIT_REQUIRED},
 "note":"Intentional handoff edits require explicit --seal, not silent recomputation. Does not establish Foundry authority."
}
if "--seal" in sys.argv[1:]:
 if errors:
  print(json.dumps({"status":"STOP","errors":errors},indent=2));sys.exit(1)
 SEAL.write_text(json.dumps(current_seal,indent=2)+"\n",encoding="utf-8")
else:
 if not SEAL.is_file(): errors.append("SEAL_NOT_FOUND")
 else:
  old=json.loads(SEAL.read_text("utf-8-sig"))
  for field in ["tracked","sourceReceiptSha256","sourceSnapshotManifestSha256","extractedEvidenceHashes"]:
   if old.get(field)!=current_seal[field]:errors.append("HANDOFF_SEAL_DRIFT:"+field)
status="PASS_LOCAL" if not errors else "STOP"
print(json.dumps({"status":status,"errors":errors,
 "campaign":"The Mysterious Lodge","files":len(REQUIRED),
 "questions":len(exam["questions"]),"decisions":len(decisions),
 "sourceCopiedFiles":snapshot["fileCount"],"copiedLevelDBHistoricalHashDriftCount":len(source_copy_drift),
 "copiedLevelDBHistoricalHashesIntact":len(source_copy_drift)==0,
 "artFiles":len(art["files"]),
 "countsVerified":actuals,
 "nextUnit":state["nextAction"]["id"],
 "kbCanonicalPromotion":state.get("knowledgeBaseSync",{}).get("canonicalDatabasePromotion","NOT_RECORDED"),
 "kbReadOnlyVerification":kb_verification,
 "fixtureMutated":False,"livePlaytestCertified":False},indent=2))
sys.exit(0 if not errors else 1)
