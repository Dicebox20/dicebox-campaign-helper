#!/usr/bin/env node
import { test } from "node:test";
import assert from "node:assert/strict";
import { assessPinConsistency } from "./check-m0-foundry-pin-consistency.mjs";

function sample() {
  const m1217 = { canonicalSpecification: { artifacts: [
    { kind: "package", sha256: "package-hash" },
    { kind: "installer", sha256: "old-installer-hash" },
  ] } };
  const m1259 = {
    canonicalSpecification: { specId: "current-spec", artifacts: [
      { kind: "adapter", sha256: "adapter-hash" },
      { kind: "installer", sha256: "new-installer-hash" },
      { kind: "package", sha256: "package-hash" },
      { kind: "worker", sha256: "worker-hash" },
    ] },
    verifierExpectation: { verifierId: "current-verifier" },
  };
  const sidecar = { specId: "current-spec", verifierId: "current-verifier", moduleSha256: "module-hash", moduleBytes: 120 };
  const observed = {
    adapter: { sha256: "adapter-hash", bytes: 20 },
    installer: { sha256: "new-installer-hash", bytes: 30 },
    package: { sha256: "package-hash", bytes: 40 },
    worker: { sha256: "worker-hash", bytes: 50 },
    module: { sha256: "module-hash", bytes: 120 },
  };
  return { m1217, m1259, sidecar, observed };
}

test("matching saved pins remain non-certifying", () => {
  const result = assessPinConsistency(sample());
  assert.equal(result.status, "CONSISTENT_WITH_SAVED_PINS");
  assert.equal(result.driftCount, 0);
  assert.equal(result.noWrite, true);
  assert.equal(result.readyClaim, false);
  assert.equal(result.milestoneAcceptance, "NOT_ACCEPTED");
});
test("a changed package is blocked", () => {
  const fixture = sample();
  fixture.observed.package.sha256 = "foreign-package";
  const result = assessPinConsistency(fixture);
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.checks.find((check) => check.id === "package-hash-vs-m1259")?.status, "DRIFT");
});
test("module byte and hash drift are detected separately", () => {
  const fixture = sample();
  fixture.observed.module.bytes += 1;
  fixture.observed.module.sha256 = "foreign-module";
  const result = assessPinConsistency(fixture);
  assert.equal(result.driftCount, 2);
  assert.ok(result.checks.filter((check) => check.status === "DRIFT").every((check) => check.id.startsWith("module-")));
});
test("a sidecar with mismatched saved spec cannot pass", () => {
  const fixture = sample();
  fixture.sidecar.specId = "old-spec";
  assert.equal(assessPinConsistency(fixture).checks.find((check) => check.id === "sidecar-spec-vs-m1259")?.status, "DRIFT");
});
test("a divergent M1217/M1259 package lineage cannot pass", () => {
  const fixture = sample();
  fixture.m1217.canonicalSpecification.artifacts[0].sha256 = "different-predecessor";
  assert.equal(assessPinConsistency(fixture).checks.find((check) => check.id === "m1217-to-m1259-package-unchanged")?.status, "DRIFT");
});