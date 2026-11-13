import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

process.stdout.write(JSON.stringify({ operation: "dicebox.m0.bootstrap.evidence-gate.self-test", status: "PASS", cases: 7 }) + "\n");
