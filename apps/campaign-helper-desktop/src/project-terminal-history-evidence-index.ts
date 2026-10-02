import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  type TypedLocalProjectReviewApplyCommandKind,
} from "./project-review-apply-coverage.js";

export const PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectTerminalHistoryEvidenceRow = Readonly<{
  commandKind: TypedLocalProjectReviewApplyCommandKind;
  bridgeSource: string;
  focusedTest: string;
  receipt: string;
  projectionKind: "local-project-terminal-history";
  authority: "operation-specific-local-project";
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
}>;

export const PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX: readonly ProjectTerminalHistoryEvidenceRow[] = [
  {
    commandKind: "project.add-scene",
    bridgeSource: "apps/campaign-helper-desktop/src/project-add-scene-terminal-history.ts",
    focusedTest: "tests/project-add-scene-terminal-history.test.ts",
    receipt: "outputs/m717-stage11-project-add-scene-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.recovery.backup-promote",
    bridgeSource: "apps/campaign-helper-desktop/src/project-backup-promotion-terminal-history.ts",
    focusedTest: "tests/project-backup-promotion-terminal-history.test.ts",
    receipt: "outputs/m733-stage11-project-backup-promotion-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.migration.persist",
    bridgeSource: "apps/campaign-helper-desktop/src/project-migration-terminal-history.ts",
    focusedTest: "tests/project-migration-terminal-history.test.ts",
    receipt: "outputs/m735-stage11-project-migration-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.create",
    bridgeSource: "apps/campaign-helper-desktop/src/project-create-terminal-history.ts",
    focusedTest: "tests/project-create-terminal-history.test.ts",
    receipt: "outputs/m721-stage11-project-create-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.rename",
    bridgeSource: "apps/campaign-helper-desktop/src/project-rename-terminal-history.ts",
    focusedTest: "tests/project-rename-terminal-history.test.ts",
    receipt: "outputs/m715-stage11-project-rename-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.save",
    bridgeSource: "apps/campaign-helper-desktop/src/project-save-terminal-history.ts",
    focusedTest: "tests/project-save-terminal-history.test.ts",
    receipt: "outputs/m713-stage11-local-project-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.save-as",
    bridgeSource: "apps/campaign-helper-desktop/src/project-save-as-terminal-history.ts",
    focusedTest: "tests/project-save-as-terminal-history.test.ts",
    receipt: "outputs/m719-stage11-project-save-as-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.asset.register-handout",
    bridgeSource: "apps/campaign-helper-desktop/src/project-handout-asset-terminal-history.ts",
    focusedTest: "tests/project-handout-asset-terminal-history.test.ts",
    receipt: "outputs/m725-stage11-project-handout-asset-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.asset.register-audio",
    bridgeSource: "apps/campaign-helper-desktop/src/project-audio-asset-terminal-history.ts",
    focusedTest: "tests/project-audio-asset-terminal-history.test.ts",
    receipt: "outputs/m723-stage11-project-audio-asset-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.asset.register-token",
    bridgeSource: "apps/campaign-helper-desktop/src/project-token-asset-terminal-history.ts",
    focusedTest: "tests/project-token-asset-terminal-history.test.ts",
    receipt: "outputs/m727-stage11-project-token-asset-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.asset.bind",
    bridgeSource: "apps/campaign-helper-desktop/src/project-asset-binding-terminal-history.ts",
    focusedTest: "tests/project-asset-binding-terminal-history.test.ts",
    receipt: "outputs/m729-stage11-project-asset-binding-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.broken-reference.detach",
    bridgeSource: "apps/campaign-helper-desktop/src/project-broken-reference-detach-terminal-history.ts",
    focusedTest: "tests/project-broken-reference-detach-terminal-history.test.ts",
    receipt: "outputs/m741-stage11-project-broken-reference-detach-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.asset.restore",
    bridgeSource: "apps/campaign-helper-desktop/src/project-asset-restore-terminal-history.ts",
    focusedTest: "tests/project-asset-restore-terminal-history.test.ts",
    receipt: "outputs/m737-stage11-project-asset-restore-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    commandKind: "project.asset.detach",
    bridgeSource: "apps/campaign-helper-desktop/src/project-asset-detach-terminal-history.ts",
    focusedTest: "tests/project-asset-detach-terminal-history.test.ts",
    receipt: "outputs/m739-stage11-project-asset-detach-terminal-history-bridge-receipt.json",
    projectionKind: "local-project-terminal-history",
    authority: "operation-specific-local-project",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
] as const satisfies readonly ProjectTerminalHistoryEvidenceRow[];

export type ProjectTerminalHistorySupplementalProjection = Readonly<{
  projectionId: string;
  source: string;
  focusedTest: string;
  receipt: string;
  projectionKind: "in-memory-local-project-terminal-history" | "injected-inverse-terminal-history";
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
}>;

export const PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS: readonly ProjectTerminalHistorySupplementalProjection[] = [
  {
    projectionId: "project.add-scene.commit-in-memory",
    source: "apps/campaign-helper-desktop/src/project-add-scene-in-memory-terminal-history.ts",
    focusedTest: "tests/project-add-scene-in-memory-terminal-history.test.ts",
    receipt: "outputs/m731-stage11-project-add-scene-in-memory-terminal-history-bridge-receipt.json",
    projectionKind: "in-memory-local-project-terminal-history",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
  {
    projectionId: "injected.inverse.fixture",
    source: "packages/dicebox-compiler/src/staged-inverse-executor-composition.ts",
    focusedTest: "tests/staged-inverse-proof-composition-bridge.test.ts",
    receipt: "outputs/m711-stage11-inverse-lifecycle-execution-receipt.json",
    projectionKind: "injected-inverse-terminal-history",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
  },
] as const satisfies readonly ProjectTerminalHistorySupplementalProjection[];

export type ProjectTerminalHistoryEvidenceIndexInspection = Readonly<{
  status: "PASS" | "BLOCKED";
  schemaVersion: typeof PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX_SCHEMA_VERSION;
  typedOperationKindCount: number;
  indexedOperationCount: number;
  localProjectProjectionCount: number;
  supplementalProjectionCount: number;
  directProjectionCount: number;
  allTypedOperationKindsBound: boolean;
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
  operations: readonly ProjectTerminalHistoryEvidenceRow[];
  supplementalProjections: readonly ProjectTerminalHistorySupplementalProjection[];
}>;

export function inspectProjectTerminalHistoryEvidenceIndex(): ProjectTerminalHistoryEvidenceIndexInspection {
  const expectedKinds = [...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS];
  const indexedKinds = PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.map((entry) => entry.commandKind);
  const allTypedOperationKindsBound = expectedKinds.length === 14 &&
    indexedKinds.length === 14 &&
    new Set(indexedKinds).size === 14 &&
    expectedKinds.every((kind) => indexedKinds.includes(kind));

  return {
    status: allTypedOperationKindsBound ? "PASS" : "BLOCKED",
    schemaVersion: PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX_SCHEMA_VERSION,
    typedOperationKindCount: expectedKinds.length,
    indexedOperationCount: PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.length,
    localProjectProjectionCount: PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.length + 1,
    supplementalProjectionCount: PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS.length,
    directProjectionCount: PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.length + PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS.length,
    allTypedOperationKindsBound,
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
    operations: PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX,
    supplementalProjections: PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS,
  };
}
