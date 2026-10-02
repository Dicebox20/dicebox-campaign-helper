import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const python = process.env.DICEBOX_PYTHON ?? "python";
const queryScript = resolve(root, "database", "query_knowledge.py");
const database = resolve(root, "database", "dicebox_campaign_helper_knowledge.sqlite");

function query(...args: string[]) {
  return JSON.parse(execFileSync(python, [queryScript, "--database", database, ...args], {
    cwd: root,
    encoding: "utf8",
  }));
}

describe("read-only knowledge-base query service", () => {
  it("returns a deterministic summary from the compiled database", () => {
    const result = query("--kind", "summary");
    expect(result).toMatchObject({ schemaVersion: "0.1.0", mode: "read-only", kind: "summary" });
      expect(result.rows[0]).toMatchObject({ sources: 2083, facts: 1658, decisions: 1678, trials: 1260, research_subjects: 41, milestones: 117 });
  });

  it("returns the M227 fixed-root cross-process mutation-exclusion authorization", () => {
    const facts = query("--kind", "facts", "--term", "advisory lease", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "fixed-root cross-process", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "mutation-exclusion-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-301", source_id: "SRC-M227-FIXED-ROOT-CROSS-PROCESS-MUTATION-EXCLUSION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-261", source_id: "SRC-M227-FIXED-ROOT-CROSS-PROCESS-MUTATION-EXCLUSION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-274", source_id: "SRC-M227-FIXED-ROOT-CROSS-PROCESS-MUTATION-EXCLUSION" }));
  });

  it("returns the M240 explicit close and persisted reopen closure", () => {
    const facts = query("--kind", "facts", "--term", "M240 explicit close", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close M240 explicit", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "project-close-reopen-packaged-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-320", source_id: "SRC-M240-PROJECT-CLOSE-REOPEN-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-280", source_id: "SRC-M240-PROJECT-CLOSE-REOPEN-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-293", source_id: "SRC-M240-PROJECT-CLOSE-REOPEN-CLOSURE" }));
  });

  it("returns the M241 exact-one broken-reference repair authorization", () => {
    const facts = query("--kind", "facts", "--term", "exact-one repair", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "selected broken Scene/background", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "broken-reference-detach-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-321", source_id: "SRC-M241-BROKEN-REFERENCE-DETACH-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-281", source_id: "SRC-M241-BROKEN-REFERENCE-DETACH-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-294", source_id: "SRC-M241-BROKEN-REFERENCE-DETACH-AUTHORIZATION" }));
  });

  it("returns the M241 exact-one broken-reference repair closure", () => {
    const facts = query("--kind", "facts", "--term", "M241 exact-one broken-reference repair", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "exact-one broken-reference repair", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "broken-reference-detach-packaged-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-322", source_id: "SRC-M241-BROKEN-REFERENCE-DETACH-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-282", source_id: "SRC-M241-BROKEN-REFERENCE-DETACH-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-295", source_id: "SRC-M241-BROKEN-REFERENCE-DETACH-CLOSURE" }));
  });

  it("returns the M242 supported-legacy migration persistence authorization", () => {
    const facts = query("--kind", "facts", "--term", "supported legacy migration", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "supported-legacy migration persistence", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "supported-legacy-migration-persistence-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-323", source_id: "SRC-M242-SUPPORTED-LEGACY-MIGRATION-PERSISTENCE-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-283", source_id: "SRC-M242-SUPPORTED-LEGACY-MIGRATION-PERSISTENCE-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-296", source_id: "SRC-M242-SUPPORTED-LEGACY-MIGRATION-PERSISTENCE-AUTHORIZATION" }));
  });

  it("returns the M242 supported-legacy migration persistence closure", () => {
    const facts = query("--kind", "facts", "--term", "M242 supported legacy migration persistence", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close M242 supported-legacy migration persistence", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "supported-legacy-migration-persistence-packaged-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-324", source_id: "SRC-M242-SUPPORTED-LEGACY-MIGRATION-PERSISTENCE-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-284", source_id: "SRC-M242-SUPPORTED-LEGACY-MIGRATION-PERSISTENCE-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-297", source_id: "SRC-M242-SUPPORTED-LEGACY-MIGRATION-PERSISTENCE-CLOSURE" }));
  });

  it("returns the M243 audio asset role authorization", () => {
    const facts = query("--kind", "facts", "--term", "non-scene audio asset role", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "strict non-scene audio", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "audio-asset-role-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-325", source_id: "SRC-M243-AUDIO-ASSET-ROLE-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-285", source_id: "SRC-M243-AUDIO-ASSET-ROLE-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-298", source_id: "SRC-M243-AUDIO-ASSET-ROLE-AUTHORIZATION" }));
  });

  it("returns the M243 audio asset role closure", () => {
    const facts = query("--kind", "facts", "--term", "M243 audio asset role", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close M243", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "audio-asset-role-packaged-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-326", source_id: "SRC-M243-AUDIO-ASSET-ROLE-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-286", source_id: "SRC-M243-AUDIO-ASSET-ROLE-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-299", source_id: "SRC-M243-AUDIO-ASSET-ROLE-CLOSURE" }));
  });

  it("returns the M244 backup-authoritative recovery promotion authorization", () => {
    const facts = query("--kind", "facts", "--term", "missing-primary promotion", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "backup-authoritative promotion", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "backup-authoritative-recovery-promotion-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-327", source_id: "SRC-M244-BACKUP-AUTHORITATIVE-RECOVERY-PROMOTION-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-287", source_id: "SRC-M244-BACKUP-AUTHORITATIVE-RECOVERY-PROMOTION-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-300", source_id: "SRC-M244-BACKUP-AUTHORITATIVE-RECOVERY-PROMOTION-AUTHORIZATION" }));
  });

  it("returns the M244 backup-authoritative recovery promotion closure", () => {
    const facts = query("--kind", "facts", "--term", "M244 backup-authoritative recovery promotion", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close M244 backup-authoritative", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "backup-authoritative-recovery-promotion-packaged-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-328", source_id: "SRC-M244-BACKUP-AUTHORITATIVE-RECOVERY-PROMOTION-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-288", source_id: "SRC-M244-BACKUP-AUTHORITATIVE-RECOVERY-PROMOTION-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-301", source_id: "SRC-M244-BACKUP-AUTHORITATIVE-RECOVERY-PROMOTION-CLOSURE" }));
  });

  it("returns the M245 token asset role authorization", () => {
    const facts = query("--kind", "facts", "--term", "non-scene token asset role", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "non-scene token", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "token-asset-role-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-329", source_id: "SRC-M245-TOKEN-ASSET-ROLE-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-289", source_id: "SRC-M245-TOKEN-ASSET-ROLE-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-302", source_id: "SRC-M245-TOKEN-ASSET-ROLE-AUTHORIZATION" }));
  });

  it("returns the M245 token asset role closure", () => {
    const facts = query("--kind", "facts", "--term", "M245 token asset role", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close M245 token", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "token-asset-role-packaged-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-330", source_id: "SRC-M245-TOKEN-ASSET-ROLE-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-290", source_id: "SRC-M245-TOKEN-ASSET-ROLE-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-303", source_id: "SRC-M245-TOKEN-ASSET-ROLE-CLOSURE" }));
  });

  it("returns the M246 Stage 8 workspace checklist audit closure", () => {
    const facts = query("--kind", "facts", "--term", "M246 closes the Stage 8", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close Stage 8 workspace acceptance", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage8-workspace-checklist-audit-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-332", source_id: "SRC-M246-STAGE8-WORKSPACE-CHECKLIST-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-292", source_id: "SRC-M246-STAGE8-WORKSPACE-CHECKLIST-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-305", source_id: "SRC-M246-STAGE8-WORKSPACE-CHECKLIST-CLOSURE" }));
  });

  it("returns the M247 typed Foundry IR authorization", () => {
    const facts = query("--kind", "facts", "--term", "typed runtime-neutral Foundry IR", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 typed Foundry IR", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "typed-foundry-ir-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-333", source_id: "SRC-M247-STAGE9-TYPED-FOUNDRY-IR-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-293", source_id: "SRC-M247-STAGE9-TYPED-FOUNDRY-IR-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-306", source_id: "SRC-M247-STAGE9-TYPED-FOUNDRY-IR-AUTHORIZATION" }));
  });

  it("returns the M247 typed Foundry IR closure", () => {
    const facts = query("--kind", "facts", "--term", "M247 closes the typed", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close the Stage 9 typed Foundry IR", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "typed-foundry-ir-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-334", source_id: "SRC-M247-STAGE9-TYPED-FOUNDRY-IR-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-294", source_id: "SRC-M247-STAGE9-TYPED-FOUNDRY-IR-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-307", source_id: "SRC-M247-STAGE9-TYPED-FOUNDRY-IR-CLOSURE" }));
  });

  it("returns the M248 asset-byte attestation authorization", () => {
    const facts = query("--kind", "facts", "--term", "no-write asset-byte attestation gate", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 asset-byte attestation", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-asset-byte-attestation-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-335", source_id: "SRC-M248-STAGE9-ASSET-ATTESTATION-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-295", source_id: "SRC-M248-STAGE9-ASSET-ATTESTATION-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-308", source_id: "SRC-M248-STAGE9-ASSET-ATTESTATION-AUTHORIZATION" }));
  });

  it("returns the M248 asset-byte attestation closure", () => {
    const facts = query("--kind", "facts", "--term", "M248 closes the no-write", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close the Stage 9 no-write asset", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-asset-byte-attestation-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-336", source_id: "SRC-M248-STAGE9-ASSET-ATTESTATION-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-296", source_id: "SRC-M248-STAGE9-ASSET-ATTESTATION-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-309", source_id: "SRC-M248-STAGE9-ASSET-ATTESTATION-CLOSURE" }));
  });

  it("returns the M249 canonical installer/verifier expectation authorization", () => {
    const facts = query("--kind", "facts", "--term", "canonical installer/verifier expectation", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 canonical installer/verifier", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-canonical-installer-verifier-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-337", source_id: "SRC-M249-STAGE9-INSTALLER-VERIFIER-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-297", source_id: "SRC-M249-STAGE9-INSTALLER-VERIFIER-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-310", source_id: "SRC-M249-STAGE9-INSTALLER-VERIFIER-AUTHORIZATION" }));
  });

  it("returns the M249 canonical installer/verifier expectation closure", () => {
    const facts = query("--kind", "facts", "--term", "M249 closes the canonical installer/verifier", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close the Stage 9 canonical installer/verifier", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-canonical-installer-verifier-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-338", source_id: "SRC-M249-STAGE9-INSTALLER-VERIFIER-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-298", source_id: "SRC-M249-STAGE9-INSTALLER-VERIFIER-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-311", source_id: "SRC-M249-STAGE9-INSTALLER-VERIFIER-CLOSURE" }));
  });

  it("returns the M250 RuntimeProfile scanner/profile-diff authorization", () => {
    const facts = query("--kind", "facts", "--term", "RuntimeProfile scanner and profile-diff", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 RuntimeProfile scanner", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-runtime-profile-scan-diff-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-339", source_id: "SRC-M250-STAGE9-RUNTIME-PROFILE-DIFF-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-299", source_id: "SRC-M250-STAGE9-RUNTIME-PROFILE-DIFF-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-312", source_id: "SRC-M250-STAGE9-RUNTIME-PROFILE-DIFF-AUTHORIZATION" }));
  });

  it("returns the M250 RuntimeProfile scanner/profile-diff closure", () => {
    const facts = query("--kind", "facts", "--term", "M250 closes the RuntimeProfile scanner", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close the Stage 9 RuntimeProfile scanner", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-runtime-profile-scan-diff-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-340", source_id: "SRC-M250-STAGE9-RUNTIME-PROFILE-DIFF-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-300", source_id: "SRC-M250-STAGE9-RUNTIME-PROFILE-DIFF-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-313", source_id: "SRC-M250-STAGE9-RUNTIME-PROFILE-DIFF-CLOSURE" }));
  });

  it("returns the M251 staged executor authorization", () => {
    const facts = query("--kind", "facts", "--term", "staged executor with persisted bindings", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 runtime-neutral staged executor", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-staged-executor-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-341", source_id: "SRC-M251-STAGE9-STAGED-EXECUTOR-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-301", source_id: "SRC-M251-STAGE9-STAGED-EXECUTOR-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-314", source_id: "SRC-M251-STAGE9-STAGED-EXECUTOR-AUTHORIZATION" }));
  });

  it("returns the M251 staged executor closure", () => {
    const facts = query("--kind", "facts", "--term", "M251 closes the runtime-neutral staged executor", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close the Stage 9 runtime-neutral staged executor", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-staged-executor-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-342", source_id: "SRC-M251-STAGE9-STAGED-EXECUTOR-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-302", source_id: "SRC-M251-STAGE9-STAGED-EXECUTOR-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-315", source_id: "SRC-M251-STAGE9-STAGED-EXECUTOR-CLOSURE" }));
  });

  it("returns the M252 Iggwilv legacy-fixture evidence authorization", () => {
    const facts = query("--kind", "facts", "--term", "Iggwilv legacy-fixture evidence envelope", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 Iggwilv legacy-fixture evidence", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-iggwilv-legacy-fixture-evidence-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-343", source_id: "SRC-M252-STAGE9-IGGWILV-LEGACY-FIXTURE-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-303", source_id: "SRC-M252-STAGE9-IGGWILV-LEGACY-FIXTURE-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-316", source_id: "SRC-M252-STAGE9-IGGWILV-LEGACY-FIXTURE-AUTHORIZATION" }));
  });

  it("returns the M252 Iggwilv legacy-fixture evidence closure", () => {
    const facts = query("--kind", "facts", "--term", "M252 closes the runtime-neutral Iggwilv", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close the Stage 9 runtime-neutral Iggwilv", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-iggwilv-legacy-fixture-evidence-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-344", source_id: "SRC-M252-STAGE9-IGGWILV-LEGACY-FIXTURE-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-304", source_id: "SRC-M252-STAGE9-IGGWILV-LEGACY-FIXTURE-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-317", source_id: "SRC-M252-STAGE9-IGGWILV-LEGACY-FIXTURE-CLOSURE" }));
  });

  it("returns the M253 disposable harness authorization", () => {
    const facts = query("--kind", "facts", "--term", "event-driven disposable-harness session contract", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 runtime-neutral disposable event-driven harness", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-disposable-event-driven-harness-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-345", source_id: "SRC-M253-STAGE9-EXACT-STACK-HARNESS-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-305", source_id: "SRC-M253-STAGE9-EXACT-STACK-HARNESS-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-318", source_id: "SRC-M253-STAGE9-EXACT-STACK-HARNESS-AUTHORIZATION" }));
  });

  it("returns the M253 disposable harness closure", () => {
    const facts = query("--kind", "facts", "--term", "M253 closes the runtime-neutral disposable-harness", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close the Stage 9 runtime-neutral disposable-harness", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-disposable-event-driven-harness-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-346", source_id: "SRC-M253-STAGE9-EXACT-STACK-HARNESS-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-306", source_id: "SRC-M253-STAGE9-EXACT-STACK-HARNESS-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-319", source_id: "SRC-M253-STAGE9-EXACT-STACK-HARNESS-CLOSURE" }));
  });

  it("returns the M254 live-lane reconciliation authorization and closure", () => {
    const facts = query("--kind", "facts", "--term", "M254 live lane reconciliation", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 no-write live-lane reconciliation", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-live-lane-reconciliation-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-347", source_id: "SRC-M254-STAGE9-LIVE-LANE-RECONCILIATION-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-307", source_id: "SRC-M254-STAGE9-LIVE-LANE-RECONCILIATION-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-320", source_id: "SRC-M254-STAGE9-LIVE-LANE-RECONCILIATION-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M254 closes the no-write live-lane reconciliation", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close the Stage 9 no-write live-lane reconciliation", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-live-lane-reconciliation-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-348", source_id: "SRC-M254-STAGE9-LIVE-LANE-RECONCILIATION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-308", source_id: "SRC-M254-STAGE9-LIVE-LANE-RECONCILIATION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-321", source_id: "SRC-M254-STAGE9-LIVE-LANE-RECONCILIATION-CLOSURE" }));
  });

  it("returns the M255 fresh fixture-provisioning authorization", () => {
    const facts = query("--kind", "facts", "--term", "M255 authorizes fresh isolated fixture-data provisioning", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize one fresh isolated Stage 9 fixture-data provisioning run", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-fresh-fixture-provisioning-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-349", source_id: "SRC-M255-STAGE9-FRESH-FIXTURE-PROVISIONING-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-309", source_id: "SRC-M255-STAGE9-FRESH-FIXTURE-PROVISIONING-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-322", source_id: "SRC-M255-STAGE9-FRESH-FIXTURE-PROVISIONING-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M255 closes fresh isolated fixture-data provisioning", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M255 at the isolated fixture-data provisioning layer only", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-fresh-fixture-provisioning-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-350", source_id: "SRC-M255-STAGE9-FRESH-FIXTURE-PROVISIONING-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-310", source_id: "SRC-M255-STAGE9-FRESH-FIXTURE-PROVISIONING-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-323", source_id: "SRC-M255-STAGE9-FRESH-FIXTURE-PROVISIONING-CLOSURE" }));
  });

  it("returns the M256 fresh-fixture runtime-readiness authorization", () => {
    const facts = query("--kind", "facts", "--term", "M256 authorizes fresh-fixture runtime readiness", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 supervisor-owned fixture runtime readiness", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-fresh-fixture-runtime-readiness-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-351", source_id: "SRC-M256-STAGE9-FIXTURE-RUNTIME-READINESS-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-311", source_id: "SRC-M256-STAGE9-FIXTURE-RUNTIME-READINESS-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-324", source_id: "SRC-M256-STAGE9-FIXTURE-RUNTIME-READINESS-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M256 closes fresh-fixture runtime readiness as a blocked observation", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M256 at the supervisor-owned runtime-readiness observation layer only", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-fresh-fixture-runtime-readiness-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-352", source_id: "SRC-M256-STAGE9-FIXTURE-RUNTIME-READINESS-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-312", source_id: "SRC-M256-STAGE9-FIXTURE-RUNTIME-READINESS-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-325", source_id: "SRC-M256-STAGE9-FIXTURE-RUNTIME-READINESS-CLOSURE" }));
  });

  it("returns the M257 supervisor UNKNOWN-stop recovery authorization", () => {
    const facts = query("--kind", "facts", "--term", "M257 authorizes exact-owner UNKNOWN-stop recovery", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 exact-owner supervisor recovery under UNKNOWN readiness", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-supervisor-unknown-stop-recovery-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-353", source_id: "SRC-M257-STAGE9-SUPERVISOR-UNKNOWN-STOP-RECOVERY-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-313", source_id: "SRC-M257-STAGE9-SUPERVISOR-UNKNOWN-STOP-RECOVERY-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-326", source_id: "SRC-M257-STAGE9-SUPERVISOR-UNKNOWN-STOP-RECOVERY-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M257 closes exact-owner UNKNOWN-stop recovery", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M257 at exact-owner UNKNOWN-stop recovery only", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-supervisor-unknown-stop-recovery-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-354", source_id: "SRC-M257-STAGE9-SUPERVISOR-UNKNOWN-STOP-RECOVERY-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-314", source_id: "SRC-M257-STAGE9-SUPERVISOR-UNKNOWN-STOP-RECOVERY-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-327", source_id: "SRC-M257-STAGE9-SUPERVISOR-UNKNOWN-STOP-RECOVERY-CLOSURE" }));

  });

  it("returns the M258 fixture-license staging authorization", () => {
    const facts = query("--kind", "facts", "--term", "M258 authorizes exact fixture-license staging", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 exact fixture-license staging", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-fixture-license-staging-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-355", source_id: "SRC-M258-STAGE9-FIXTURE-LICENSE-STAGING-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-315", source_id: "SRC-M258-STAGE9-FIXTURE-LICENSE-STAGING-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-328", source_id: "SRC-M258-STAGE9-FIXTURE-LICENSE-STAGING-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M258 closes exact fixture-license staging", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M258 at exact fixture-license staging only", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-fixture-license-staging-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-356", source_id: "SRC-M258-STAGE9-FIXTURE-LICENSE-STAGING-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-316", source_id: "SRC-M258-STAGE9-FIXTURE-LICENSE-STAGING-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-329", source_id: "SRC-M258-STAGE9-FIXTURE-LICENSE-STAGING-CLOSURE" }));
  });

  it("returns the M259 fresh-runtime readiness authorization", () => {
    const facts = query("--kind", "facts", "--term", "M259 authorizes fresh exact-runtime readiness", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 fresh-runtime readiness after license preparation", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-fresh-runtime-readiness-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-357", source_id: "SRC-M259-STAGE9-FRESH-RUNTIME-READINESS-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-317", source_id: "SRC-M259-STAGE9-FRESH-RUNTIME-READINESS-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-330", source_id: "SRC-M259-STAGE9-FRESH-RUNTIME-READINESS-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M259 closes bounded server/process readiness", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M259 at bounded server/process readiness only", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-fresh-runtime-readiness-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-358", source_id: "SRC-M259-STAGE9-FRESH-RUNTIME-READINESS-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-318", source_id: "SRC-M259-STAGE9-FRESH-RUNTIME-READINESS-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-331", source_id: "SRC-M259-STAGE9-FRESH-RUNTIME-READINESS-CLOSURE" }));
  });

  it("returns the M260 loaded-runtime read-only probe authorization", () => {
    const facts = query("--kind", "facts", "--term", "M260 authorizes a read-only loaded-runtime probe", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 loaded-runtime read-only probe", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-loaded-runtime-readonly-probe-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-359", source_id: "SRC-M260-STAGE9-LOADED-RUNTIME-READONLY-PROBE-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-319", source_id: "SRC-M260-STAGE9-LOADED-RUNTIME-READONLY-PROBE-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-332", source_id: "SRC-M260-STAGE9-LOADED-RUNTIME-READONLY-PROBE-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M260 closes blocked read-only client probe", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M260 at blocked read-only join-surface observation only", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-loaded-runtime-readonly-probe-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-360", source_id: "SRC-M260-STAGE9-LOADED-RUNTIME-READONLY-PROBE-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-320", source_id: "SRC-M260-STAGE9-LOADED-RUNTIME-READONLY-PROBE-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-333", source_id: "SRC-M260-STAGE9-LOADED-RUNTIME-READONLY-PROBE-CLOSURE" }));
  });

  it("returns the M261 stopped-fixture lock-recovery authorization", () => {
    const facts = query("--kind", "facts", "--term", "M261 authorizes exact stopped-fixture lock recovery", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 exact stopped-fixture lock recovery", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-stopped-fixture-lock-recovery-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-361", source_id: "SRC-M261-STAGE9-STOPPED-FIXTURE-LOCK-RECOVERY-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-321", source_id: "SRC-M261-STAGE9-STOPPED-FIXTURE-LOCK-RECOVERY-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-334", source_id: "SRC-M261-STAGE9-STOPPED-FIXTURE-LOCK-RECOVERY-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M261 closes exact stopped-fixture lock recovery", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M261 at exact stopped-fixture lock recovery only", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-stopped-fixture-lock-recovery-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-362", source_id: "SRC-M261-STAGE9-STOPPED-FIXTURE-LOCK-RECOVERY-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-322", source_id: "SRC-M261-STAGE9-STOPPED-FIXTURE-LOCK-RECOVERY-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-335", source_id: "SRC-M261-STAGE9-STOPPED-FIXTURE-LOCK-RECOVERY-CLOSURE" }));
  });

  it("returns the M262 served-worker parity authorization and closure", () => {
    const facts = query("--kind", "facts", "--term", "M262 authorizes a no-write served-worker parity audit", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 served-worker parity audit", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-served-worker-parity-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-363", source_id: "SRC-M262-STAGE9-SERVED-WORKER-PARITY-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-323", source_id: "SRC-M262-STAGE9-SERVED-WORKER-PARITY-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-336", source_id: "SRC-M262-STAGE9-SERVED-WORKER-PARITY-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M262 closes served-worker observation with canonical drift", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M262 at served/source parity with canonical drift and runtime-owned transition", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-served-worker-parity-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-364", source_id: "SRC-M262-STAGE9-SERVED-WORKER-PARITY-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-324", source_id: "SRC-M262-STAGE9-SERVED-WORKER-PARITY-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-337", source_id: "SRC-M262-STAGE9-SERVED-WORKER-PARITY-CLOSURE" }));
  });

  it("returns the M263 post-probe lock-recovery authorization and closure", () => {
    const facts = query("--kind", "facts", "--term", "M263 authorizes exact post-probe lock recovery", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 exact post-probe lock recovery", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-post-probe-lock-recovery-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-365", source_id: "SRC-M263-STAGE9-POST-PROBE-LOCK-RECOVERY-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-325", source_id: "SRC-M263-STAGE9-POST-PROBE-LOCK-RECOVERY-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-338", source_id: "SRC-M263-STAGE9-POST-PROBE-LOCK-RECOVERY-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M263 closes exact post-probe lock recovery", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M263 at exact post-probe lock recovery only", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-post-probe-lock-recovery-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-366", source_id: "SRC-M263-STAGE9-POST-PROBE-LOCK-RECOVERY-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-326", source_id: "SRC-M263-STAGE9-POST-PROBE-LOCK-RECOVERY-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-339", source_id: "SRC-M263-STAGE9-POST-PROBE-LOCK-RECOVERY-CLOSURE" }));
  });

  it("returns the M264 optional-module staging authorization and closure", () => {
    const facts = query("--kind", "facts", "--term", "M264 authorizes isolated optional-module staging", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize Stage 9 isolated optional-module staging", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-optional-module-staging-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-367", source_id: "SRC-M264-STAGE9-OPTIONAL-MODULE-STAGING-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-327", source_id: "SRC-M264-STAGE9-OPTIONAL-MODULE-STAGING-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-340", source_id: "SRC-M264-STAGE9-OPTIONAL-MODULE-STAGING-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M264 closes isolated optional-module staging", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M264 at isolated package staging", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-optional-module-staging-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-368", source_id: "SRC-M264-STAGE9-OPTIONAL-MODULE-STAGING-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-328", source_id: "SRC-M264-STAGE9-OPTIONAL-MODULE-STAGING-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-341", source_id: "SRC-M264-STAGE9-OPTIONAL-MODULE-STAGING-CLOSURE" }));
  });

  it("returns the M265 disposable client/session authorization", () => {
    const facts = query("--kind", "facts", "--term", "M265 authorizes one synthetic disposable client/session observation", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize M265 disposable synthetic client/session observation", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-disposable-client-session-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-369", source_id: "SRC-M265-STAGE9-DISPOSABLE-CLIENT-SESSION-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-329", source_id: "SRC-M265-STAGE9-DISPOSABLE-CLIENT-SESSION-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-342", source_id: "SRC-M265-STAGE9-DISPOSABLE-CLIENT-SESSION-AUTHORIZATION" }));
  });

  it("returns the M265 synthetic client/session closure and M266 lock-recovery authorization", () => {
    const closureFacts = query("--kind", "facts", "--term", "M265 closes blocked synthetic client/session observation", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M265 at synthetic join blocker and exact-owner cleanup", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-disposable-client-session-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-370", source_id: "SRC-M265-STAGE9-DISPOSABLE-CLIENT-SESSION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-330", source_id: "SRC-M265-STAGE9-DISPOSABLE-CLIENT-SESSION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-343", source_id: "SRC-M265-STAGE9-DISPOSABLE-CLIENT-SESSION-CLOSURE" }));

    const recoveryFacts = query("--kind", "facts", "--term", "M266 authorizes exact post-M265 lock recovery", "--limit", "10");
    const recoveryDecisions = query("--kind", "decisions", "--term", "Authorize M266 exact post-M265 stopped-fixture lock recovery", "--limit", "10");
    const recoveryTrials = query("--kind", "trials", "--term", "stage9-post-m265-lock-recovery-authorization", "--limit", "10");
    expect(recoveryFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-371", source_id: "SRC-M266-STAGE9-POST-M265-LOCK-RECOVERY-AUTHORIZATION" }));
    expect(recoveryDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-331", source_id: "SRC-M266-STAGE9-POST-M265-LOCK-RECOVERY-AUTHORIZATION" }));
    expect(recoveryTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-344", source_id: "SRC-M266-STAGE9-POST-M265-LOCK-RECOVERY-AUTHORIZATION" }));

    const recoveryClosureFacts = query("--kind", "facts", "--term", "M266 closes exact post-M265 lock recovery", "--limit", "10");
    const recoveryClosureDecisions = query("--kind", "decisions", "--term", "Close M266 at supervisor-only lock recovery", "--limit", "10");
    const recoveryClosureTrials = query("--kind", "trials", "--term", "stage9-post-m265-lock-recovery-closure", "--limit", "10");
    expect(recoveryClosureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-372", source_id: "SRC-M266-STAGE9-POST-M265-LOCK-RECOVERY-CLOSURE" }));
    expect(recoveryClosureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-332", source_id: "SRC-M266-STAGE9-POST-M265-LOCK-RECOVERY-CLOSURE" }));
    expect(recoveryClosureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-345", source_id: "SRC-M266-STAGE9-POST-M265-LOCK-RECOVERY-CLOSURE" }));
  });

  it("returns the M228 fixed-root mutation-exclusion closure and M229 batched shared-file schedule authorization", () => {
    const closures = query("--kind", "facts", "--term", "fixed-root process lease excludes", "--limit", "10");
    const schedules = query("--kind", "decisions", "--term", "batched shared-file", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "communication capacity", "--limit", "10");
    expect(closures.rows).toContainEqual(expect.objectContaining({ fact_id: "F-302", source_id: "SRC-M228-FIXED-ROOT-CROSS-PROCESS-MUTATION-EXCLUSION-CLOSURE" }));
    expect(schedules.rows).toContainEqual(expect.objectContaining({ decision_id: "D-263", source_id: "SRC-M229-BATCHED-SHARED-FILE-SYNCHRONIZATION-SCHEDULE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-276", source_id: "SRC-M229-BATCHED-SHARED-FILE-SYNCHRONIZATION-SCHEDULE" }));
  });

  it("returns the M230 non-blocking shared-mirror correction", () => {
    const facts = query("--kind", "facts", "--term", "communication mirrors cannot block", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Correct shared-mirror cadence", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "nonblocking-shared-mirror", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-304", source_id: "SRC-M230-NONBLOCKING-SHARED-MIRROR-CORRECTION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-264", source_id: "SRC-M230-NONBLOCKING-SHARED-MIRROR-CORRECTION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-277", source_id: "SRC-M230-NONBLOCKING-SHARED-MIRROR-CORRECTION" }));
  });

  it("returns the M231 non-blocking shared-mirror implementation closure", () => {
    const facts = query("--kind", "facts", "--term", "M230 non-blocking shared-mirror rule", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close M230 non-blocking", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "nonblocking-shared-mirror-correction-implementation", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-305", source_id: "SRC-M231-NONBLOCKING-SHARED-MIRROR-IMPLEMENTATION-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-265", source_id: "SRC-M231-NONBLOCKING-SHARED-MIRROR-IMPLEMENTATION-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-278", source_id: "SRC-M231-NONBLOCKING-SHARED-MIRROR-IMPLEMENTATION-CLOSURE" }));
  });

  it("returns the M232 integrated Stage 8 workspace-acceptance authorization", () => {
    const facts = query("--kind", "facts", "--term", "integrated ordinary-user workspace", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "integrated Stage 8 workspace", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage8-integrated-workspace-acceptance", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-306", source_id: "SRC-M232-STAGE8-INTEGRATED-WORKSPACE-ACCEPTANCE-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-266", source_id: "SRC-M232-STAGE8-INTEGRATED-WORKSPACE-ACCEPTANCE-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-279", source_id: "SRC-M232-STAGE8-INTEGRATED-WORKSPACE-ACCEPTANCE-AUTHORIZATION" }));
  });

  it("returns the M233 integrated Stage 8 workspace-acceptance closure", () => {
    const facts = query("--kind", "facts", "--term", "fixed test-owned project ID", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close the M232 integrated", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "workspace-acceptance-packaged-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-307", source_id: "SRC-M233-STAGE8-INTEGRATED-WORKSPACE-ACCEPTANCE-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-267", source_id: "SRC-M233-STAGE8-INTEGRATED-WORKSPACE-ACCEPTANCE-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-280", source_id: "SRC-M233-STAGE8-INTEGRATED-WORKSPACE-ACCEPTANCE-CLOSURE" }));
  });

  it("returns the M234 read-only pending-artifact inspection authorization", () => {
    const facts = query("--kind", "facts", "--term", "Owned staged pending artifacts", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "pending-artifact inspection", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "pending-artifact-inspection-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-308", source_id: "SRC-M234-STAGE8-PENDING-ARTIFACT-INSPECTION-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-268", source_id: "SRC-M234-STAGE8-PENDING-ARTIFACT-INSPECTION-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-281", source_id: "SRC-M234-STAGE8-PENDING-ARTIFACT-INSPECTION-AUTHORIZATION" }));
  });

  it("returns the M235 packaged pending-artifact inspection closure", () => {
    const facts = query("--kind", "facts", "--term", "pending-artifact inspection is packaged", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close the M234", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "pending-artifact-inspection-packaged-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-309", source_id: "SRC-M235-STAGE8-PENDING-ARTIFACT-INSPECTION-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-269", source_id: "SRC-M235-STAGE8-PENDING-ARTIFACT-INSPECTION-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-282", source_id: "SRC-M235-STAGE8-PENDING-ARTIFACT-INSPECTION-CLOSURE" }));
  });

  it("returns the closed M223 missing-background detach packaged-recovery evidence", () => {
    const facts = query("--kind", "facts", "--term", "bounded detach recovery", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "M223 exact-one", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "packaged recovery closure", "--limit", "50");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-300", source_id: "SRC-M226-MISSING-BACKGROUND-DETACH-PACKAGED-RECOVERY-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-260", source_id: "SRC-M226-MISSING-BACKGROUND-DETACH-PACKAGED-RECOVERY-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-273", source_id: "SRC-M226-MISSING-BACKGROUND-DETACH-PACKAGED-RECOVERY-CLOSURE" }));
  });

  it("returns the implemented shared chat and versioned knowledge-base bridge closure", () => {
    const facts = query("--kind", "facts", "--term", "versioned knowledge-base bridge", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Accept D-250", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "timestamp", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-291", source_id: "SRC-M217-SHARED-CHAT-KB-BRIDGE-IMPLEMENTATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-251", source_id: "SRC-M217-SHARED-CHAT-KB-BRIDGE-IMPLEMENTATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-264", source_id: "SRC-M217-SHARED-CHAT-KB-BRIDGE-IMPLEMENTATION" }));
  });

  it("returns the synchronized and implemented selected-project migration explanation authority", () => {
    const facts = query("--kind", "facts", "--term", "migration recovery explanation", "--limit", "20");
    const decisions = query("--kind", "decisions", "--term", "selected project migration", "--limit", "20");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-288", source_id: "SRC-M214-SELECTED-PROJECT-MIGRATION-EXPLANATION" }));
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-289", source_id: "SRC-M215-SELECTED-PROJECT-MIGRATION-EXPLANATION-IMPLEMENTATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-248", source_id: "SRC-M214-SELECTED-PROJECT-MIGRATION-EXPLANATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-249", source_id: "SRC-M215-SELECTED-PROJECT-MIGRATION-EXPLANATION-IMPLEMENTATION" }));
  });

  it("returns the M276 setup-only route closure", () => {
    const facts = query("--kind", "facts", "--term", "M276 proves exact v4 setup-only route and stopped recovery", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close M276 as a verified setup-only route boundary", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-fresh-setup-only-route-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-394", source_id: "SRC-M276-STAGE9-FRESH-SETUP-ONLY-ROUTE-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-354", source_id: "SRC-M276-STAGE9-FRESH-SETUP-ONLY-ROUTE-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-367", source_id: "SRC-M276-STAGE9-FRESH-SETUP-ONLY-ROUTE-CLOSURE" }));
  });

  it("returns the M277 fresh administrator/session boundary authorization", () => {
    const facts = query("--kind", "facts", "--term", "M277 requires a fresh redacted v4 administrator/session boundary", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize M277 fresh v4 administrator/session boundary", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-fresh-admin-session-boundary-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-395", source_id: "SRC-M277-STAGE9-FRESH-ADMIN-SESSION-BOUNDARY-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-355", source_id: "SRC-M277-STAGE9-FRESH-ADMIN-SESSION-BOUNDARY-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-368", source_id: "SRC-M277-STAGE9-FRESH-ADMIN-SESSION-BOUNDARY-AUTHORIZATION" }));
  });

  it("returns the M277 fresh administrator/session boundary closure and M278 authorization", () => {
    const closureFacts = query("--kind", "facts", "--term", "M277 proves a redacted v4 administrator and Gamemaster session boundary", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M277 as a redacted fixture administrator/session boundary", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-fresh-admin-session-boundary-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-396", source_id: "SRC-M277-STAGE9-FRESH-ADMIN-SESSION-BOUNDARY-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-356", source_id: "SRC-M277-STAGE9-FRESH-ADMIN-SESSION-BOUNDARY-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-369", source_id: "SRC-M277-STAGE9-FRESH-ADMIN-SESSION-BOUNDARY-CLOSURE" }));

    const profileFacts = query("--kind", "facts", "--term", "M278 requires a read-only loaded-runtime and RuntimeProfile observation", "--limit", "10");
    const profileDecisions = query("--kind", "decisions", "--term", "Authorize M278 read-only loaded-runtime/profile observation", "--limit", "10");
    const profileTrials = query("--kind", "trials", "--term", "stage9-fresh-loaded-runtime-profile-authorization", "--limit", "10");
    expect(profileFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-397", source_id: "SRC-M278-STAGE9-FRESH-LOADED-RUNTIME-PROFILE-AUTHORIZATION" }));
    expect(profileDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-357", source_id: "SRC-M278-STAGE9-FRESH-LOADED-RUNTIME-PROFILE-AUTHORIZATION" }));
    expect(profileTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-370", source_id: "SRC-M278-STAGE9-FRESH-LOADED-RUNTIME-PROFILE-AUTHORIZATION" }));
  });

  it("returns the blocked M278 loaded-runtime closure and M279 module-activation authorization", () => {
    const closureFacts = query("--kind", "facts", "--term", "M278 closes as a blocked loaded-runtime/profile observation", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M278 as blocked loaded-runtime/profile observation", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-fresh-loaded-runtime-profile-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-398", source_id: "SRC-M278-STAGE9-FRESH-LOADED-RUNTIME-PROFILE-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-358", source_id: "SRC-M278-STAGE9-FRESH-LOADED-RUNTIME-PROFILE-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-371", source_id: "SRC-M278-STAGE9-FRESH-LOADED-RUNTIME-PROFILE-CLOSURE" }));

    const activationFacts = query("--kind", "facts", "--term", "M279 authorizes DiceBox-only native module activation", "--limit", "10");
    const activationDecisions = query("--kind", "decisions", "--term", "Authorize M279 DiceBox-only native module activation", "--limit", "10");
    const activationTrials = query("--kind", "trials", "--term", "stage9-fresh-module-activation-authorization", "--limit", "10");
    expect(activationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-399", source_id: "SRC-M279-STAGE9-FRESH-MODULE-ACTIVATION-AUTHORIZATION" }));
    expect(activationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-359", source_id: "SRC-M279-STAGE9-FRESH-MODULE-ACTIVATION-AUTHORIZATION" }));
    expect(activationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-372", source_id: "SRC-M279-STAGE9-FRESH-MODULE-ACTIVATION-AUTHORIZATION" }));
  });

  it("returns the M279 DiceBox-only activation closure", () => {
    const facts = query("--kind", "facts", "--term", "M279 closes DiceBox-only native module activation", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close M279 DiceBox-only native module activation", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-fresh-module-activation-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-400", source_id: "SRC-M279-STAGE9-FRESH-MODULE-ACTIVATION-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-360", source_id: "SRC-M279-STAGE9-FRESH-MODULE-ACTIVATION-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-373", source_id: "SRC-M279-STAGE9-FRESH-MODULE-ACTIVATION-CLOSURE" }));
  });

  it("returns the M280 served-worker closure and M281 diagnostic closure", () => {
    const servedFacts = query("--kind", "facts", "--term", "M280 closes exact v4 served-worker parity", "--limit", "10");
    const servedDecisions = query("--kind", "decisions", "--term", "Close M280 exact v4 served-worker parity", "--limit", "10");
    const servedTrials = query("--kind", "trials", "--term", "stage9-fresh-served-worker-attestation-closure", "--limit", "10");
    expect(servedFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-403", source_id: "SRC-M280-STAGE9-FRESH-SERVED-WORKER-ATTESTATION-CLOSURE" }));
    expect(servedDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-363", source_id: "SRC-M280-STAGE9-FRESH-SERVED-WORKER-ATTESTATION-CLOSURE" }));
    expect(servedTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-376", source_id: "SRC-M280-STAGE9-FRESH-SERVED-WORKER-ATTESTATION-CLOSURE" }));

    const diagnosticFacts = query("--kind", "facts", "--term", "M281 closes the redacted RuntimeProfile diagnostic surface observation", "--limit", "10");
    const diagnosticDecisions = query("--kind", "decisions", "--term", "Close M281 redacted RuntimeProfile diagnostic surface", "--limit", "10");
    const diagnosticTrials = query("--kind", "trials", "--term", "stage9-fresh-runtime-profile-surface-closure", "--limit", "10");
    expect(diagnosticFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-404", source_id: "SRC-M281-STAGE9-FRESH-RUNTIME-PROFILE-SURFACE-CLOSURE" }));
    expect(diagnosticDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-364", source_id: "SRC-M281-STAGE9-FRESH-RUNTIME-PROFILE-SURFACE-CLOSURE" }));
    expect(diagnosticTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-377", source_id: "SRC-M281-STAGE9-FRESH-RUNTIME-PROFILE-SURFACE-CLOSURE" }));
  });

  it("returns the M282 detail-readable diagnostic authorization and blocked closure", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M282 authorizes detail-readable redacted RuntimeProfile evidence", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "Authorize M282 detail-readable redacted RuntimeProfile evidence", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "stage9-fresh-runtime-profile-detail-authorization", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-405", source_id: "SRC-M282-STAGE9-FRESH-RUNTIME-PROFILE-DETAIL-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-365", source_id: "SRC-M282-STAGE9-FRESH-RUNTIME-PROFILE-DETAIL-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-378", source_id: "SRC-M282-STAGE9-FRESH-RUNTIME-PROFILE-DETAIL-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M282 detail-readable diagnostic observation is blocked by browser reconnect failure", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M282 as blocked detail-readable diagnostic observation", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-fresh-runtime-profile-detail-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-406", source_id: "SRC-M282-STAGE9-FRESH-RUNTIME-PROFILE-DETAIL-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-366", source_id: "SRC-M282-STAGE9-FRESH-RUNTIME-PROFILE-DETAIL-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-379", source_id: "SRC-M282-STAGE9-FRESH-RUNTIME-PROFILE-DETAIL-CLOSURE" }));
  });

  it("returns the M283 fresh-tab recovery authorization and closure", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M283 authorizes a local fresh-tab recovery proof", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "Authorize M283 local fresh-tab browser recovery", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "stage9-browser-fresh-tab-recovery-authorization", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-407", source_id: "SRC-M283-STAGE9-BROWSER-FRESH-TAB-RECOVERY-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-367", source_id: "SRC-M283-STAGE9-BROWSER-FRESH-TAB-RECOVERY-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-380", source_id: "SRC-M283-STAGE9-BROWSER-FRESH-TAB-RECOVERY-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M283 closes the local fresh-tab recovery proof", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M283 local fresh-tab browser recovery", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-browser-fresh-tab-recovery-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-408", source_id: "SRC-M283-STAGE9-BROWSER-FRESH-TAB-RECOVERY-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-368", source_id: "SRC-M283-STAGE9-BROWSER-FRESH-TAB-RECOVERY-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-381", source_id: "SRC-M283-STAGE9-BROWSER-FRESH-TAB-RECOVERY-CLOSURE" }));
  });

  it("returns the M284 exact-v4 fresh-tab diagnostic authorization and closure", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M284 authorizes one fresh-tab exact-v4 diagnostic retry", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "Authorize M284 one-fresh-tab exact-v4 diagnostic retry", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "stage9-fresh-tab-runtime-profile-retry-authorization", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-409", source_id: "SRC-M284-STAGE9-FRESH-TAB-RUNTIME-PROFILE-RETRY-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-369", source_id: "SRC-M284-STAGE9-FRESH-TAB-RUNTIME-PROFILE-RETRY-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-382", source_id: "SRC-M284-STAGE9-FRESH-TAB-RUNTIME-PROFILE-RETRY-AUTHORIZATION" }));

    const closureFacts = query("--kind", "facts", "--term", "M284 closes exact-v4 detail-readable RuntimeProfile observation", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M284 exact-v4 detail-readable RuntimeProfile observation", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-fresh-tab-runtime-profile-retry-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-410", source_id: "SRC-M284-STAGE9-FRESH-TAB-RUNTIME-PROFILE-RETRY-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-370", source_id: "SRC-M284-STAGE9-FRESH-TAB-RUNTIME-PROFILE-RETRY-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-383", source_id: "SRC-M284-STAGE9-FRESH-TAB-RUNTIME-PROFILE-RETRY-CLOSURE" }));
  });

  it("returns the M285 redacted Activity and RegionBehavior surface-detail authorization", () => {
    const facts = query("--kind", "facts", "--term", "M285 authorizes redacted Activity and RegionBehavior surface details", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize M285 redacted Activity and RegionBehavior surface detail", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-redacted-api-surface-detail-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-411", source_id: "SRC-M285-STAGE9-REDACTED-API-SURFACE-DETAIL-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-371", source_id: "SRC-M285-STAGE9-REDACTED-API-SURFACE-DETAIL-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-384", source_id: "SRC-M285-STAGE9-REDACTED-API-SURFACE-DETAIL-AUTHORIZATION" }));
  });

  it("returns the M285 redacted Activity and RegionBehavior surface-detail closure", () => {
    const facts = query("--kind", "facts", "--term", "M285 isolates exact-v4 Activity and RegionBehavior missing surfaces", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Close M285 redacted Activity and RegionBehavior surface detail", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-redacted-api-surface-detail-closure", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-412", source_id: "SRC-M285-STAGE9-REDACTED-API-SURFACE-DETAIL-CLOSURE" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-372", source_id: "SRC-M285-STAGE9-REDACTED-API-SURFACE-DETAIL-CLOSURE" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-385", source_id: "SRC-M285-STAGE9-REDACTED-API-SURFACE-DETAIL-CLOSURE" }));
  });

  it("returns the M286 exact-source probe-contract correction authorization", () => {
    const facts = query("--kind", "facts", "--term", "Exact source proves M285 three-field probe mismatch", "--limit", "10");
    const decisions = query("--kind", "decisions", "--term", "Authorize M286 exact-source probe-contract correction", "--limit", "10");
    const trials = query("--kind", "trials", "--term", "stage9-exact-source-probe-contract-correction-authorization", "--limit", "10");
    expect(facts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-413", source_id: "SRC-M286-STAGE9-EXACT-SOURCE-PROBE-CONTRACT-CORRECTION-AUTHORIZATION" }));
    expect(decisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-373", source_id: "SRC-M286-STAGE9-EXACT-SOURCE-PROBE-CONTRACT-CORRECTION-AUTHORIZATION" }));
    expect(trials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-386", source_id: "SRC-M286-STAGE9-EXACT-SOURCE-PROBE-CONTRACT-CORRECTION-AUTHORIZATION" }));
  });

  it("returns the M286 probe correction closure and M287 declaration repair authorization", () => {
    const closureFacts = query("--kind", "facts", "--term", "M286 closes exact-source probe correction with declaration blockers preserved", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M286 probe correction and preserve declaration blockers", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-exact-source-probe-contract-correction-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-414", source_id: "SRC-M286-STAGE9-EXACT-SOURCE-PROBE-CONTRACT-CORRECTION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-374", source_id: "SRC-M286-STAGE9-EXACT-SOURCE-PROBE-CONTRACT-CORRECTION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-387", source_id: "SRC-M286-STAGE9-EXACT-SOURCE-PROBE-CONTRACT-CORRECTION-CLOSURE" }));

    const repairFacts = query("--kind", "facts", "--term", "M287 authorizes exact local declaration parity repair", "--limit", "10");
    const repairDecisions = query("--kind", "decisions", "--term", "Authorize M287 declaration-only tool parity repair", "--limit", "10");
    const repairTrials = query("--kind", "trials", "--term", "stage9-local-tool-declaration-parity-authorization", "--limit", "10");
    expect(repairFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-415", source_id: "SRC-M287-STAGE9-LOCAL-TOOL-DECLARATION-PARITY-AUTHORIZATION" }));
    expect(repairDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-375", source_id: "SRC-M287-STAGE9-LOCAL-TOOL-DECLARATION-PARITY-AUTHORIZATION" }));
    expect(repairTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-388", source_id: "SRC-M287-STAGE9-LOCAL-TOOL-DECLARATION-PARITY-AUTHORIZATION" }));
  });

  it("returns the M287 declaration repair closure and M288 exact-v4 observation authorization", () => {
    const closureFacts = query("--kind", "facts", "--term", "M287 closes declaration parity with full validation pass", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M287 declaration-only tool parity repair", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-local-tool-declaration-parity-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-416", source_id: "SRC-M287-STAGE9-LOCAL-TOOL-DECLARATION-PARITY-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-376", source_id: "SRC-M287-STAGE9-LOCAL-TOOL-DECLARATION-PARITY-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-389", source_id: "SRC-M287-STAGE9-LOCAL-TOOL-DECLARATION-PARITY-CLOSURE" }));

    const observationFacts = query("--kind", "facts", "--term", "M288 authorizes one corrected exact-v4 diagnostic observation", "--limit", "10");
    const observationDecisions = query("--kind", "decisions", "--term", "Authorize M288 corrected-probe exact-v4 read-only observation", "--limit", "10");
    const observationTrials = query("--kind", "trials", "--term", "stage9-corrected-probe-exact-v4-observation-authorization", "--limit", "10");
    expect(observationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-417", source_id: "SRC-M288-STAGE9-CORRECTED-PROBE-EXACT-V4-OBSERVATION-AUTHORIZATION" }));
    expect(observationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-377", source_id: "SRC-M288-STAGE9-CORRECTED-PROBE-EXACT-V4-OBSERVATION-AUTHORIZATION" }));
    expect(observationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-390", source_id: "SRC-M288-STAGE9-CORRECTED-PROBE-EXACT-V4-OBSERVATION-AUTHORIZATION" }));
  });

  it("returns the M288 corrected observation closure and M289 harness hardening authorization", () => {
    const closureFacts = query("--kind", "facts", "--term", "M288 closes corrected exact-v4 API observation with one behavior blocker", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M288 corrected-probe exact-v4 observation", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-corrected-probe-exact-v4-observation-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-418", source_id: "SRC-M288-STAGE9-CORRECTED-PROBE-EXACT-V4-OBSERVATION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-378", source_id: "SRC-M288-STAGE9-CORRECTED-PROBE-EXACT-V4-OBSERVATION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-391", source_id: "SRC-M288-STAGE9-CORRECTED-PROBE-EXACT-V4-OBSERVATION-CLOSURE" }));

    const hardeningFacts = query("--kind", "facts", "--term", "M289 authorizes local representative Scene harness hardening", "--limit", "10");
    const hardeningDecisions = query("--kind", "decisions", "--term", "Authorize M289 local representative Scene harness hardening", "--limit", "10");
    const hardeningTrials = query("--kind", "trials", "--term", "stage9-representative-scene-harness-hardening-authorization", "--limit", "10");
    expect(hardeningFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-419", source_id: "SRC-M289-STAGE9-REPRESENTATIVE-SCENE-HARNESS-HARDENING-AUTHORIZATION" }));
    expect(hardeningDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-379", source_id: "SRC-M289-STAGE9-REPRESENTATIVE-SCENE-HARNESS-HARDENING-AUTHORIZATION" }));
    expect(hardeningTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-392", source_id: "SRC-M289-STAGE9-REPRESENTATIVE-SCENE-HARNESS-HARDENING-AUTHORIZATION" }));
  });

  it("returns the M289 harness closure and M290 Player3 preparation authorization", () => {
    const closureFacts = query("--kind", "facts", "--term", "M289 closes representative Scene harness hardening with full validation", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M289 representative Scene harness hardening", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage9-representative-scene-harness-hardening-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-420", source_id: "SRC-M289-STAGE9-REPRESENTATIVE-SCENE-HARNESS-HARDENING-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-380", source_id: "SRC-M289-STAGE9-REPRESENTATIVE-SCENE-HARNESS-HARDENING-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-393", source_id: "SRC-M289-STAGE9-REPRESENTATIVE-SCENE-HARNESS-HARDENING-CLOSURE" }));

    const prepFacts = query("--kind", "facts", "--term", "M290 authorizes exact package staging and native Player3 preparation", "--limit", "10");
    const prepDecisions = query("--kind", "decisions", "--term", "Authorize M290 exact-v4 package staging and Player3 preparation", "--limit", "10");
    const prepTrials = query("--kind", "trials", "--term", "stage9-exact-v4-player3-preparation-authorization", "--limit", "10");
    expect(prepFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-421", source_id: "SRC-M290-STAGE9-EXACT-V4-PLAYER3-PREPARATION-AUTHORIZATION" }));
    expect(prepDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-381", source_id: "SRC-M290-STAGE9-EXACT-V4-PLAYER3-PREPARATION-AUTHORIZATION" }));
    expect(prepTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-394", source_id: "SRC-M290-STAGE9-EXACT-V4-PLAYER3-PREPARATION-AUTHORIZATION" }));
  });

  it("returns the M316 input recovery closure and M317 lifecycle authorization", () => {
    const closureFacts = query("--kind", "facts", "--term", "M316 closes the exact packaged input-layer recovery", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Close M316 packaged project-proposal input recovery", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "stage11-project-proposal-input-recovery-closure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-476", source_id: "SRC-M316-STAGE11-PROJECT-PROPOSAL-INPUT-RECOVERY-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-436", source_id: "SRC-M316-STAGE11-PROJECT-PROPOSAL-INPUT-RECOVERY-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-449", source_id: "SRC-M316-STAGE11-PROJECT-PROPOSAL-INPUT-RECOVERY-CLOSURE" }));

    const authorizationFacts = query("--kind", "facts", "--term", "M317 authorizes packaged project-recovery lifecycle", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "Authorize M317 packaged project-recovery lifecycle", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "stage11-packaged-project-recovery-lifecycle-authorization", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-477", source_id: "SRC-M317-STAGE11-PACKAGED-PROJECT-RECOVERY-LIFECYCLE-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-437", source_id: "SRC-M317-STAGE11-PACKAGED-PROJECT-RECOVERY-LIFECYCLE-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-450", source_id: "SRC-M317-STAGE11-PACKAGED-PROJECT-RECOVERY-LIFECYCLE-AUTHORIZATION" }));
  });

  it("returns the M1272 approved v5 four-Scene apply closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1272 closes with the approved v5 four-Scene apply and reread", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "Accept the exact approved v5 four-Scene apply as fixture-runtime evidence", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Approved v5 four-Scene apply", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1272-STAGE12-FRESH-V5-FOUR-SCENE-APPLY-CLOSURE", source_id: "SRC-M1272-STAGE12-FRESH-V5-FOUR-SCENE-APPLY-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1272-STAGE12-FRESH-V5-FOUR-SCENE-APPLY-CLOSURE", source_id: "SRC-M1272-STAGE12-FRESH-V5-FOUR-SCENE-APPLY-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1272-STAGE12-FRESH-V5-FOUR-SCENE-APPLY-CLOSURE", source_id: "SRC-M1272-STAGE12-FRESH-V5-FOUR-SCENE-APPLY-CLOSURE" }));
  });

  it("returns the M1273 post-apply reconciliation authorization", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M1273 authorizes read-only post-apply evidence reconciliation", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "M1273 post-apply reconciliation gate", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "Post-M1272 evidence reconciliation", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-AUTHORIZATION" }));
  });

  it("returns the M1273 post-apply reconciliation closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1273 closes without promoting later evidence layers", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1273 reconciliation closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Post-M1273 read-only reconciliation", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-CLOSURE", source_id: "SRC-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-CLOSURE", source_id: "SRC-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-CLOSURE", source_id: "SRC-M1273-STAGE12-POST-M1272-EVIDENCE-RECONCILIATION-CLOSURE" }));
  });

  it("returns the M1274 Region Controls exposure authorization", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M1274 authorizes exact-v5 Region Controls exposure only", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "M1274 Region Controls exposure gate", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "Exact-v5 Region Controls exposure", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-AUTHORIZATION", source_id: "SRC-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-AUTHORIZATION", source_id: "SRC-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-AUTHORIZATION", source_id: "SRC-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-AUTHORIZATION" }));
  });

  it("returns the M1274 Region Controls exposure closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1274 confirms loaded v5 Region Controls exposure", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1274 Region Controls exposure closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Exact-v5 Region Controls exposure", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-CLOSURE", source_id: "SRC-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-CLOSURE", source_id: "SRC-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-CLOSURE", source_id: "SRC-M1274-STAGE12-V5-REGION-CONTROLS-EXPOSURE-READBACK-CLOSURE" }));
  });

  it("returns the M1275 Regionwright handoff preview authorization", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M1275 authorizes exact-v5 Regionwright handoff preview only", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "M1275 Regionwright handoff preview gate", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "Exact-v5 Regionwright handoff preview", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-AUTHORIZATION", source_id: "SRC-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-AUTHORIZATION", source_id: "SRC-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-AUTHORIZATION", source_id: "SRC-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-AUTHORIZATION" }));
  });

  it("returns the M1275 Regionwright handoff preview closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1275 closes at a cancelled exact-v5 no-write handoff preview", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1275 Regionwright handoff preview closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Exact-v5 Regionwright handoff preview", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-CLOSURE", source_id: "SRC-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-CLOSURE", source_id: "SRC-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-CLOSURE", source_id: "SRC-M1275-STAGE12-V5-REGIONWRIGHT-HANDOFF-PREVIEW-CLOSURE" }));
  });

  it("returns the M1276 post-M1275 evidence-reconciliation authorization", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M1276 authorizes post-M1275 evidence reconciliation", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "M1276 evidence reconciliation gate", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "Post-M1275 evidence reconciliation", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-AUTHORIZATION" }));
  });

  it("returns the M1276 evidence-reconciliation closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1276 reconciles preview and retained evidence without promotion", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1276 evidence reconciliation closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Post-M1276 evidence reconciliation", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-CLOSURE", source_id: "SRC-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-CLOSURE", source_id: "SRC-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-CLOSURE", source_id: "SRC-M1276-STAGE12-POST-M1275-EVIDENCE-RECONCILIATION-CLOSURE" }));
  });

  it("returns the M1277 exact-v5 Regionwright audit authorization", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M1277 authorizes exact-v5 Regionwright handoff audit observation", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "M1277 Regionwright audit gate", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "Exact-v5 Regionwright handoff audit", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-AUTHORIZATION", source_id: "SRC-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-AUTHORIZATION", source_id: "SRC-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-AUTHORIZATION", source_id: "SRC-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-AUTHORIZATION" }));
  });

  it("returns the M1277 typed Regionwright audit blocker closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1277 blocks on typed exact-v5 Regionwright audit drift", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1277 Regionwright audit blocker closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Exact-v5 Regionwright handoff audit", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-CLOSURE", source_id: "SRC-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-CLOSURE", source_id: "SRC-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-CLOSURE", source_id: "SRC-M1277-STAGE12-V5-REGIONWRIGHT-HANDOFF-AUDIT-OBSERVATION-CLOSURE" }));
  });

  it("returns the M1278 local Regionwright audit-contract reconciliation closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1278 reconciles v5 audit expectation with canonical 61-region package", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1278 audit contract reconciliation closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Regionwright audit contract drift", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1278-REGIONWRIGHT-AUDIT-CONTRACT-RECONCILIATION-LOCAL-CLOSURE", source_id: "SRC-M1278-REGIONWRIGHT-AUDIT-CONTRACT-RECONCILIATION-LOCAL-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1278-REGIONWRIGHT-AUDIT-CONTRACT-RECONCILIATION-LOCAL-CLOSURE", source_id: "SRC-M1278-REGIONWRIGHT-AUDIT-CONTRACT-RECONCILIATION-LOCAL-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1278-REGIONWRIGHT-AUDIT-CONTRACT-RECONCILIATION-LOCAL-CLOSURE", source_id: "SRC-M1278-REGIONWRIGHT-AUDIT-CONTRACT-RECONCILIATION-LOCAL-CLOSURE" }));
  });

  it("returns the M1279 exact-v5 source identity recovery authorization", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M1279 authorizes exact-v5 source identity recovery", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "M1279 source identity recovery gate", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "Exact-v5 source identity recovery", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1279-V5-SOURCE-IDENTITY-RECOVERY-AUTHORIZATION", source_id: "SRC-M1279-V5-SOURCE-IDENTITY-RECOVERY-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1279-V5-SOURCE-IDENTITY-RECOVERY-AUTHORIZATION", source_id: "SRC-M1279-V5-SOURCE-IDENTITY-RECOVERY-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1279-V5-SOURCE-IDENTITY-RECOVERY-AUTHORIZATION", source_id: "SRC-M1279-V5-SOURCE-IDENTITY-RECOVERY-AUTHORIZATION" }));
  });

  it("returns the M1279 exact-v5 source identity recovery closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1279 closes with served parity and loaded-client exposure", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1279 source identity recovery closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Exact-v5 source identity recovery", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1279-V5-SOURCE-IDENTITY-RECOVERY-CLOSURE", source_id: "SRC-M1279-V5-SOURCE-IDENTITY-RECOVERY-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1279-V5-SOURCE-IDENTITY-RECOVERY-CLOSURE", source_id: "SRC-M1279-V5-SOURCE-IDENTITY-RECOVERY-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1279-V5-SOURCE-IDENTITY-RECOVERY-CLOSURE", source_id: "SRC-M1279-V5-SOURCE-IDENTITY-RECOVERY-CLOSURE" }));
  });

  it("returns the M1280 Regionwright loaded-identity reconciliation authorization", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M1280 authorizes Regionwright premium loaded-identity reconciliation", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "M1280 loaded identity reconciliation gate", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "Regionwright premium loaded identity reconciliation", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-AUTHORIZATION" }));
  });

  it("returns the M1280 Regionwright loaded-identity reconciliation closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1280 reconciled the existing identity surfaces locally", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1280 loaded identity reconciliation closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Regionwright premium loaded identity", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-CLOSURE", source_id: "SRC-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-CLOSURE", source_id: "SRC-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-CLOSURE", source_id: "SRC-M1280-REGIONWRIGHT-LOADED-IDENTITY-RECONCILIATION-CLOSURE" }));
  });

  it("returns the M1281 Regionwright premium loaded-identity attestation authorization", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M1281 authorizes a local v5 Regionwright premium loaded-identity attestation", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "M1281 premium loaded identity attestation gate", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "Regionwright premium loaded identity attestation", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-AUTHORIZATION", source_id: "SRC-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-AUTHORIZATION", source_id: "SRC-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-AUTHORIZATION", source_id: "SRC-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-AUTHORIZATION" }));
  });

  it("returns the M1281 Regionwright premium loaded-identity attestation closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1281 added a strict v5 Regionwright premium installer loaded-identity readback", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1281 premium loaded identity attestation closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Regionwright premium loaded identity attestation", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-CLOSURE", source_id: "SRC-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-CLOSURE", source_id: "SRC-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-CLOSURE", source_id: "SRC-M1281-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-ATTESTATION-CLOSURE" }));
  });

  it("returns the M1282 exact-v5 Regionwright premium loaded-identity observation authorization", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M1282 authorizes one exact-v5 Regionwright premium loaded-identity observation", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "M1282 loaded identity observation gate", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "Regionwright premium loaded identity", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-AUTHORIZATION", source_id: "SRC-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-AUTHORIZATION", source_id: "SRC-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-AUTHORIZATION", source_id: "SRC-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-AUTHORIZATION" }));
  });

  it("returns the M1282 exact-v5 Regionwright premium loaded-identity observation closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1282 blocked on loaded identity control exposure", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1282 loaded control exposure blocker closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Regionwright loaded control registration", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-CLOSURE", source_id: "SRC-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-CLOSURE", source_id: "SRC-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-CLOSURE", source_id: "SRC-M1282-V5-REGIONWRIGHT-PREMIUM-LOADED-IDENTITY-OBSERVATION-CLOSURE" }));
  });

  it("returns the M1283 Regionwright loaded-control registration reconciliation authorization", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M1283 authorizes read-only loaded-control registration reconciliation", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "M1283 registration reconciliation gate", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "Regionwright loaded control registration", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-AUTHORIZATION", source_id: "SRC-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-AUTHORIZATION" }));
  });

  it("returns the M1283 Regionwright loaded-control registration reconciliation closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1283 repaired the v5 cache-consistent Regionwright entry topology", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1283 registration reconciliation closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "Regionwright loaded control registration", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-CLOSURE", source_id: "SRC-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-CLOSURE", source_id: "SRC-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-CLOSURE", source_id: "SRC-M1283-REGIONWRIGHT-LOADED-CONTROL-REGISTRATION-RECONCILIATION-CLOSURE" }));
  });

  it("returns the M1284 exact-v5 Regionwright loaded-identity control observation authorization", () => {
    const authorizationFacts = query("--kind", "facts", "--term", "M1284 authorizes one exact-v5 loaded identity-control observation", "--limit", "10");
    const authorizationDecisions = query("--kind", "decisions", "--term", "M1284 loaded identity control observation gate", "--limit", "10");
    const authorizationTrials = query("--kind", "trials", "--term", "Regionwright loaded identity control", "--limit", "10");
    expect(authorizationFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-AUTHORIZATION", source_id: "SRC-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-AUTHORIZATION" }));
    expect(authorizationDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-AUTHORIZATION", source_id: "SRC-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-AUTHORIZATION" }));
    expect(authorizationTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-AUTHORIZATION", source_id: "SRC-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-AUTHORIZATION" }));
  });

  it("returns the M1284 exact-v5 Regionwright loaded-identity control observation closure", () => {
    const closureFacts = query("--kind", "facts", "--term", "M1284 stopped at the manual Gamemaster rejoin gate", "--limit", "10");
    const closureDecisions = query("--kind", "decisions", "--term", "M1284 manual rejoin boundary closure", "--limit", "10");
    const closureTrials = query("--kind", "trials", "--term", "manual Gamemaster join tab 14", "--limit", "10");
    expect(closureFacts.rows).toContainEqual(expect.objectContaining({ fact_id: "F-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-CLOSURE", source_id: "SRC-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-CLOSURE" }));
    expect(closureDecisions.rows).toContainEqual(expect.objectContaining({ decision_id: "D-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-CLOSURE", source_id: "SRC-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-CLOSURE" }));
    expect(closureTrials.rows).toContainEqual(expect.objectContaining({ trial_id: "T-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-CLOSURE", source_id: "SRC-M1284-V5-REGIONWRIGHT-LOADED-IDENTITY-CONTROL-OBSERVATION-CLOSURE" }));
  });

  it("returns fact search results with source provenance", () => {
    const result = query("--kind", "facts", "--term", "Activity Foundry");
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0]).toHaveProperty("source_id");
    expect(result.rows[0]).toHaveProperty("source_title");
    expect(result.rows[0]).toHaveProperty("source_location");
  });

  it("returns source coverage without allowing arbitrary SQL", () => {
    const result = query("--kind", "coverage", "--limit", "100");
    expect(result.rows.length).toBe(100);
    expect(result.rows.some((row: { source_id: string }) => row.source_id === "SRC-FOUNDRY-API-MATRIX")).toBe(true);
    const blocked = spawnSync(python, [queryScript, "--database", database, "--kind", "facts", "--term", "' OR 1=1 --"], {
      cwd: root,
      encoding: "utf8",
    });
    expect(blocked.status).toBe(0);
    expect(JSON.parse(blocked.stdout).mode).toBe("read-only");
  });

  it("returns active blockers with source provenance", () => {
    const result = query("--kind", "blockers", "--limit", "100");
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0]).toHaveProperty("source_id");
    expect(result.rows[0]).toHaveProperty("source_title");
    expect(result.rows.some((row: { item_id: string }) => row.item_id === "O-003")).toBe(true);
  });

  it("opens the database read-only and does not create a sidecar write artifact", () => {
    const before = statSync(database).mtimeMs;
    query("--kind", "subject", "--subject-no", "40");
    const after = statSync(database).mtimeMs;
    expect(after).toBe(before);
    expect(readFileSync(queryScript, "utf8")).toContain("mode=ro");
  });
});
