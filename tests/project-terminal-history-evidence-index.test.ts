import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  inspectProjectTerminalHistoryEvidenceIndex,
  PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX,
  PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS,
} from "../apps/campaign-helper-desktop/src/project-terminal-history-evidence-index.js";
import { TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS } from "../apps/campaign-helper-desktop/src/project-review-apply-coverage.js";

const repositoryRoot = resolve(import.meta.dirname, "..");
const indexSource = readFileSync(
  resolve(repositoryRoot, "apps", "campaign-helper-desktop", "src", "project-terminal-history-evidence-index.ts"),
  "utf8",
);
const appSource = readFileSync(resolve(repositoryRoot, "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");

describe("M743 terminal-history evidence index", () => {
  it("binds every typed local-project operation to exact direct artifacts", () => {
    expect(PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX).toHaveLength(14);
    expect(PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.map((entry) => entry.commandKind)).toEqual([
      ...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
    ]);
    expect(new Set(PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.map((entry) => entry.commandKind)).size).toBe(14);

    for (const entry of PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX) {
      expect(entry).toMatchObject({
        projectionKind: "local-project-terminal-history",
        authority: "operation-specific-local-project",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
        noTransitionAuthority: true,
        noGenericExecutor: true,
      });
      expect(existsSync(resolve(repositoryRoot, entry.bridgeSource))).toBe(true);
      expect(existsSync(resolve(repositoryRoot, entry.focusedTest))).toBe(true);
      expect(existsSync(resolve(repositoryRoot, entry.receipt))).toBe(true);
    }
  });

  it("reports sixteen direct projections and stays metadata-only", () => {
    const inspection = inspectProjectTerminalHistoryEvidenceIndex();
    expect(inspection).toMatchObject({
      status: "PASS",
      typedOperationKindCount: 14,
      indexedOperationCount: 14,
      localProjectProjectionCount: 15,
      supplementalProjectionCount: 2,
      directProjectionCount: 16,
      allTypedOperationKindsBound: true,
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noGenericExecutor: true,
    });
    expect(PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS.map((entry) => entry.projectionId)).toEqual([
      "project.add-scene.commit-in-memory",
      "injected.inverse.fixture",
    ]);
    expect(indexSource).not.toContain("executeGenericProjectTerminalHistory");
    expect(indexSource).not.toContain("applyGenericProjectTerminalHistory");
    expect(indexSource).not.toContain("transitionGenericProjectTerminalHistory");
    expect(appSource).toContain("inspectProjectTerminalHistoryEvidenceIndex");
    expect(appSource).toContain("Terminal-history evidence index:");
    expect(appSource).toContain('data-testid="terminal-history-evidence-index"');
    expect(appSource).toContain("does not transition history, execute, persist, recover, or add authority");
    expect(appSource).not.toContain("executeGenericProjectTerminalHistory");
    expect(appSource).not.toContain("applyGenericProjectTerminalHistory");
  });
});
