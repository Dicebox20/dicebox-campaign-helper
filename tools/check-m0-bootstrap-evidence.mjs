import { readFile, realpath } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

export const CRITERIA = Object.freeze([
  "authenticated-chatgpt-control",
  "environment-enumeration",
  "isolated-dev-branch",
  "chatgpt-initiated-edit-and-build",
  "automated-build-and-install",
  "automated-tests",
  "diagnose-and-repair-loop",
  "self-contained-provenance",
]);

const HEX_64 = /^[a-f0-9]{64}$/i;
const RECEIPT_DIR = "docs/evidence/m0-bootstrap/";
const SHA256 = (bytes) => createHash("sha256").update(bytes).digest("hex").toUpperCase();

export function evaluateM0Evidence(register, card, roadmapDigest) {
  const violations = [];
  if (register?.schemaVersion !== "1.0.0") violations.push("register schemaVersion must be 1.0.0");
  if (register?.programMilestone !== "M0") violations.push("programMilestone must be M0");
  if (register?.recordStatus !== "NOT_ACCEPTED") violations.push("register must not claim owner acceptance");
  if (register?.roadmapFile !== "docs/DCH-ROADMAP-v2-LIBRARY-CANONICAL.md") violations.push("roadmap path drift");
  if (card?.ownerRoadmapV2?.roadmapPriority !== "M0") violations.push("active program priority is not M0");
  if (card?.ownerRoadmapV2?.milestone0Acceptance !== "NOT_YET_PROVEN_END_TO_END") {
    violations.push("active program acceptance is not pending; reconcile through explicit owner review");
  }
  const expectedDigest = card?.ownerRoadmapV2?.canonicalSha256;
  if (!HEX_64.test(register?.roadmapSha256 || "") ||
      register.roadmapSha256.toUpperCase() !== String(expectedDigest || "").toUpperCase() ||
      register.roadmapSha256.toUpperCase() !== String(roadmapDigest || "").toUpperCase()) {
    violations.push("canonical roadmap SHA256 mismatch");
  }
  if (register?.evidenceRoot !== "docs/evidence/m0-bootstrap") violations.push("evidence root drift");
  const criteria = Array.isArray(register?.criteria) ? register.criteria : [];
  if (criteria.length !== CRITERIA.length ||
      criteria.some((criterion, index) => criterion?.id !== CRITERIA[index])) {
    violations.push("M0 criteria IDs or order drift");
  }
  let verified = 0;
  const receiptEntries = [];
  for (const criterion of criteria) {
    if (!["missing", "collecting", "verified"].includes(criterion?.state)) {
      violations.push("invalid evidence state for " + (criterion?.id || "(unknown)"));
      continue;
    }
    if (!Array.isArray(criterion.receipts)) {
      violations.push("receipts must be an array for " + criterion.id);
      continue;
    }
    if (criterion.state === "verified") {
      verified += 1;
      if (criterion.receipts.length === 0) violations.push("verified criterion lacks a receipt: " + criterion.id);
    } else if (criterion.receipts.length && criterion.state === "missing") {
      violations.push("missing criterion cannot list receipts: " + criterion.id);
    }
    for (const receipt of criterion.receipts) {
      if (typeof receipt?.path !== "string" || !receipt.path.startsWith(RECEIPT_DIR) ||
          receipt.path.includes("..") || receipt.path.includes("\\") ||
          !HEX_64.test(receipt.sha256 || "")) {
        violations.push("invalid receipt path or hash for " + criterion.id);
      } else {
        receiptEntries.push({ criterionId: criterion.id, path: receipt.path, sha256: receipt.sha256.toUpperCase() });
      }
    }
  }
  return {
    operation: "dicebox.m0.bootstrap.evidence-gate",
    integrityStatus: violations.length ? "FAIL" : "PASS",
    milestoneAcceptance: "NOT_ACCEPTED",
    evidenceReview: verified === CRITERIA.length && violations.length === 0
      ? "READY_FOR_INDEPENDENT_REVIEW" : "INCOMPLETE",
    verifiedCriteria: verified,
    totalCriteria: CRITERIA.length,
    violations,
    receiptEntries,
  };
}

export async function checkM0Evidence({
  cwd = process.cwd(),
  registerPath = "docs/M0-BOOTSTRAP-EVIDENCE-REGISTER.json",
  cardPath = "docs/ACTIVE-PROGRAM-SLICE.json",
} = {}) {
  const register = JSON.parse(await readFile(resolve(cwd, registerPath), "utf8"));
  const card = JSON.parse(await readFile(resolve(cwd, cardPath), "utf8"));
  const digest = SHA256(Buffer.from((await readFile(resolve(cwd, "docs/DCH-ROADMAP-v2-LIBRARY-CANONICAL.md"), "utf8")).replace(/\r\n/g, "\n"), "utf8"));
  const result = evaluateM0Evidence(register, card, digest);
  for (const entry of result.receiptEntries) {
    try {
      const p = await realpath(resolve(cwd, entry.path));
      const allowed = await realpath(resolve(cwd, "docs/evidence/m0-bootstrap")) + sep;
      if (!p.startsWith(allowed)) throw new Error("outside evidence root");
      const actual = SHA256(await readFile(p));
      if (actual !== entry.sha256) throw new Error("SHA256 mismatch");
    } catch (error) {
      result.violations.push("receipt integrity failure " + entry.criterionId + ": " + entry.path +
        " (" + String(error.code || error.message).slice(0,80) + ")");
    }
  }
  result.integrityStatus = result.violations.length ? "FAIL" : "PASS";
  if (result.integrityStatus !== "PASS") result.evidenceReview = "INCOMPLETE";
  delete result.receiptEntries;
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const output = await checkM0Evidence();
    process.stdout.write(JSON.stringify(output) + "\n");
    if (output.integrityStatus !== "PASS") process.exitCode = 1;
  } catch (error) {
    process.stdout.write(JSON.stringify({
      operation: "dicebox.m0.bootstrap.evidence-gate",
      integrityStatus: "FAIL",
      milestoneAcceptance: "NOT_ACCEPTED",
      error: String(error.code || error.message),
    }) + "\n");
    process.exitCode = 1;
  }
}
