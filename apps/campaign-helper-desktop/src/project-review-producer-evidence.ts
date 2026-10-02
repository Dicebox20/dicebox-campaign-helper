export type TypedLocalProjectProducerEvidenceStatus =
  | "closed-read-only"
  | "operation-specific-partial"
  | "bounded-slices-closed-aggregate-partial"
  | "role-specific-bounded-aggregate-partial"
  | "bounded-packaged-partial-aggregate"
  | "current-packaged-pass-aggregate-partial"
  | "test-infrastructure-only";

export type TypedLocalProjectProducerEvidenceEntry = Readonly<{
  familyId: string;
  label: string;
  evidenceStatus: TypedLocalProjectProducerEvidenceStatus;
  boundedEvidence: string;
  remainingGap: string;
  nonCertifying: true;
}>;

export const TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY: readonly TypedLocalProjectProducerEvidenceEntry[] = [
  {
    familyId: "read-only-inspection-and-compile",
    label: "Read-only inspection and compile",
    evidenceStatus: "closed-read-only",
    boundedEvidence: "Read-only inspection and compile paths are separately covered.",
    remainingGap: "Not a mutating producer; excluded from mutating lifecycle acceptance.",
    nonCertifying: true,
  },
  {
    familyId: "workspace-open-and-recent-order-metadata",
    label: "Workspace open and recent-order metadata",
    evidenceStatus: "operation-specific-partial",
    boundedEvidence: "Typed load and catalog/read paths exist.",
    remainingGap: "Generalized mutation lifecycle remains partial.",
    nonCertifying: true,
  },
  {
    familyId: "ordinary-project-persistence",
    label: "Ordinary project persistence",
    evidenceStatus: "bounded-slices-closed-aggregate-partial",
    boundedEvidence: "Bounded create, save, save-as, and rename slices are closed.",
    remainingGap: "No aggregate generic lifecycle envelope covers every persistence path.",
    nonCertifying: true,
  },
  {
    familyId: "in-memory-project-editing-and-navigation",
    label: "In-memory project editing and navigation",
    evidenceStatus: "bounded-slices-closed-aggregate-partial",
    boundedEvidence: "Bounded add-Scene and persistence slices are closed.",
    remainingGap: "Aggregate editor lifecycle and recovery remain partial.",
    nonCertifying: true,
  },
  {
    familyId: "asset-import-and-binding",
    label: "Asset import and binding",
    evidenceStatus: "role-specific-bounded-aggregate-partial",
    boundedEvidence: "Background, handout, audio, token, and selected recovery paths are role-specific.",
    remainingGap: "Shared generic history and cross-role lifecycle remain partial.",
    nonCertifying: true,
  },
  {
    familyId: "legacy-migration-persistence",
    label: "Legacy migration persistence",
    evidenceStatus: "operation-specific-partial",
    boundedEvidence: "Typed migration session and reread evidence exists.",
    remainingGap: "Generic execution acceptance remains partial.",
    nonCertifying: true,
  },
  {
    familyId: "backup-authoritative-promotion",
    label: "Backup-authoritative promotion",
    evidenceStatus: "bounded-packaged-partial-aggregate",
    boundedEvidence: "Bounded packaged lifecycle and reread evidence exists.",
    remainingGap: "Broader recovery acceptance remains partial.",
    nonCertifying: true,
  },
  {
    familyId: "missing-asset-restore",
    label: "Missing-asset restore",
    evidenceStatus: "current-packaged-pass-aggregate-partial",
    boundedEvidence: "Current packaged load, preview, approval, apply, restore, and reread evidence passes.",
    remainingGap: "Aggregate every-producer acceptance remains partial.",
    nonCertifying: true,
  },
  {
    familyId: "missing-asset-detach",
    label: "Missing-asset detach",
    evidenceStatus: "current-packaged-pass-aggregate-partial",
    boundedEvidence: "Current packaged lifecycle and authoritative reread evidence passes.",
    remainingGap: "Aggregate every-producer acceptance remains partial.",
    nonCertifying: true,
  },
  {
    familyId: "broken-scene-reference-detach",
    label: "Broken Scene-reference detach",
    evidenceStatus: "current-packaged-pass-aggregate-partial",
    boundedEvidence: "Current packaged lifecycle and authoritative reread evidence passes.",
    remainingGap: "Aggregate every-producer acceptance remains partial.",
    nonCertifying: true,
  },
  {
    familyId: "test-owned-fixture-setup-and-stage-receipts",
    label: "Test-owned fixture setup and stage receipts",
    evidenceStatus: "test-infrastructure-only",
    boundedEvidence: "Fixture and receipt infrastructure provides bounded evidence.",
    remainingGap: "Test infrastructure is not a user mutating producer.",
    nonCertifying: true,
  },
] as const satisfies readonly TypedLocalProjectProducerEvidenceEntry[];
