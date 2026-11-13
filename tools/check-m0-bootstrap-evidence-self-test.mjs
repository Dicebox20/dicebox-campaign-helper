import assert from "node:assert/strict";
import { readFile, copyFile, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkM0Evidence, evaluateM0Evidence, CRITERIA } from "./check-m0-bootstrap-evidence.mjs";

const register = JSON.parse(await readFile("docs/M0-BOOTSTRAP-EVIDENCE-REGISTER.json", "utf8"));
const card = JSON.parse(await readFile("docs/ACTIVE-PROGRAM-SLICE.json", "utf8"));
const digest = register.roadmapSha256;
const clone = (value) => structuredClone(value);

const actual = await checkM0Evidence();
assert.equal(actual.integrityStatus, "PASS");
assert.equal(actual.milestoneAcceptance, "NOT_ACCEPTED");
assert.equal(actual.verifiedCriteria, 0);
assert.equal(actual.totalCriteria, CRITERIA.length);

const wrongHash = clone(register);
wrongHash.roadmapSha256 = "0".repeat(64);
assert.equal(evaluateM0Evidence(wrongHash, card, digest).integrityStatus, "FAIL");

const missingCriterion = clone(register);
missingCriterion.criteria.pop();
assert.equal(evaluateM0Evidence(missingCriterion, card, digest).integrityStatus, "FAIL");

const fakeVerified = clone(register);
fakeVerified.criteria[0].state = "verified";
assert.equal(evaluateM0Evidence(fakeVerified, card, digest).integrityStatus, "FAIL");

const prematurePromotion = clone(register);
prematurePromotion.recordStatus = "ACCEPTED";
assert.equal(evaluateM0Evidence(prematurePromotion, card, digest).integrityStatus, "FAIL");

const prematureCard = clone(card);
prematureCard.ownerRoadmapV2.milestone0Acceptance = "ACCEPTED";
assert.equal(evaluateM0Evidence(register, prematureCard, digest).integrityStatus, "FAIL");

const unsafePath = clone(register);
unsafePath.criteria[0].state = "collecting";
unsafePath.criteria[0].receipts = [{ path: "docs/evidence/m0-bootstrap/../escape", sha256: digest }];
assert.equal(evaluateM0Evidence(unsafePath, card, digest).integrityStatus, "FAIL");

const scratch = await mkdtemp(join(tmpdir(), "dch-m0-evidence-gate-"));
try {
  const receipt = register.criteria.find((entry) => entry.id === "environment-enumeration")?.receipts?.[0];
  const paths = [...new Set(register.criteria.flatMap((entry) => (entry.receipts || []).map((r) => r.path)))];
  assert.ok(receipt?.path, "A real collecting receipt must be present in the register.");
  await mkdir(join(scratch, "docs/evidence/m0-bootstrap"), { recursive: true });
  for (const path of [
    "docs/ACTIVE-PROGRAM-SLICE.json",
    "docs/DCH-ROADMAP-v2-LIBRARY-CANONICAL.md",
    "docs/M0-BOOTSTRAP-EVIDENCE-REGISTER.json",
    ...paths,
  ]) {
    await copyFile(path, join(scratch, path));
  }
  const intact = await checkM0Evidence({ cwd: scratch });
  assert.equal(intact.integrityStatus, "PASS", "A content-addressed collecting receipt must pass.");
  assert.equal(intact.milestoneAcceptance, "NOT_ACCEPTED", "Valid receipt never accepts M0.");
  await writeFile(join(scratch, receipt.path), "TAMPERED\n");
  const tampered = await checkM0Evidence({ cwd: scratch });
  assert.equal(tampered.integrityStatus, "FAIL", "A mutated receipt must be rejected.");
  assert.ok(tampered.violations.some((v) => v.includes("receipt integrity failure")));
  await rm(join(scratch, receipt.path));
  const missing = await checkM0Evidence({ cwd: scratch });
  assert.equal(missing.integrityStatus, "FAIL", "A missing receipt must be rejected.");
} finally {
  await rm(scratch, { recursive: true, force: true });
}
process.stdout.write(JSON.stringify({ operation: "dicebox.m0.bootstrap.evidence-gate.self-test", status: "PASS", cases: 10 }) + "\n");
