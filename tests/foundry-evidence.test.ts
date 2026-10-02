import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FoundryRuntimeEvidenceAuditSchema,
  FoundryRuntimeEvidenceSchema,
  auditFoundryRuntimeEvidence,
} from "@dicebox/core";
import { createBridgeApi } from "@dicebox/bridge";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const cli = resolve(root, "tools/audit-foundry-evidence.ts");
const tsxCli = resolve(root, "node_modules/tsx/dist/cli.mjs");

async function safeEvidence() {
  const result = await createBridgeApi().query({ kind: "runtime-evidence" });
  if (!result.ok) throw new Error(result.error.message);
  return FoundryRuntimeEvidenceSchema.parse(result.value);
}

describe("Foundry runtime-evidence boundary", () => {
  it("validates the program/module wire shape without turning it into certification", async () => {
    const evidence = await safeEvidence();
    const audit = auditFoundryRuntimeEvidence(evidence);

    expect(audit).toMatchObject({
      status: "reviewable",
      inputReadinessStatus: "blocked",
      exactTargetMatch: false,
      foundryApiEvidence: "structured-only",
      noWrite: true,
      readyClaim: false,
    });
  });

  it("blocks a fingerprint mismatch and never repairs the supplied evidence", async () => {
    const evidence = await safeEvidence();
    const tampered = {
      ...evidence,
      runtimeFingerprint: {
        ...evidence.runtimeFingerprint,
        fingerprintId: "dbx:fingerprint:tampered",
      },
    };
    const audit = auditFoundryRuntimeEvidence(tampered);

    expect(audit.status).toBe("blocked");
    expect(audit.readyClaim).toBe(false);
    expect(audit.blockers.map((blocker) => blocker.id)).toContain("fingerprint-integrity");
  });

  it("audits a real JSON process handoff and emits only non-certifying output", async () => {
    const evidence = await safeEvidence();
    const result = spawnSync(process.execPath, [tsxCli, cli], {
      cwd: root,
      input: JSON.stringify(evidence),
      encoding: "utf8",
      windowsHide: true,
    });

    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    const audit = FoundryRuntimeEvidenceAuditSchema.parse(JSON.parse(result.stdout));
    expect(audit).toMatchObject({ status: "reviewable", readyClaim: false, noWrite: true });
    expect(result.stdout).not.toContain("allowedOperations");
    expect(result.stderr).toBe("");
  });

  it("returns a bounded blocked result for malformed input without echoing it", () => {
    const result = spawnSync(process.execPath, [tsxCli, cli], {
      cwd: root,
      input: '{"secret":"do-not-copy"}',
      encoding: "utf8",
      windowsHide: true,
    });

    expect(result.status).toBe(2);
    const audit = FoundryRuntimeEvidenceAuditSchema.parse(JSON.parse(result.stdout));
    expect(audit).toMatchObject({ status: "blocked", readyClaim: false, noWrite: true });
    expect(result.stdout).not.toContain("do-not-copy");
  });
});
