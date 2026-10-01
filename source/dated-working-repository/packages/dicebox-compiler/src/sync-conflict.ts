import { z } from "zod";
import {
  createCapabilityRegistry,
  EvidenceReceiptSchema,
  RuntimeProfileSchema,
  StableDiceBoxIdSchema,
  TARGET_DND5E_VERSION,
  TARGET_FOUNDRY_VERSION,
  createStableDiceBoxId,
  type CapabilityId,
  type EvidenceReceipt,
  type RuntimeProfile,
} from "@dicebox/core";
import {
  validateReleaseBundle,
  type ReleaseBundle,
} from "./release-plan.js";

const fieldObservationStates = ["equal", "managed-drift", "runtime-owned", "foreign", "unknown"] as const;
const conflictActions = [
  "no-op",
  "repair-candidate",
  "preserve-managed-drift",
  "preserve-runtime",
  "preserve-foreign",
  "preserve-unknown",
] as const;

export const managedFieldSpecSchema = z.object({
  fieldId: StableDiceBoxIdSchema,
  componentId: StableDiceBoxIdSchema,
  owner: z.literal("dicebox"),
  repairPolicy: z.enum(["managed-only", "observe-only"]),
}).strict();

export type ManagedFieldSpec = z.infer<typeof managedFieldSpecSchema>;

export const syncFieldObservationSchema = z.object({
  fieldId: StableDiceBoxIdSchema,
  state: z.enum(fieldObservationStates),
  desiredFingerprint: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  observedFingerprint: z.string().regex(/^[a-f0-9]{64}$/).optional(),
}).strict().superRefine((value, context) => {
  if ((value.state === "equal" || value.state === "managed-drift")
    && (value.desiredFingerprint === undefined || value.observedFingerprint === undefined)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["desiredFingerprint"],
      message: "Equal or managed-drift observations require redacted desired and observed fingerprints.",
    });
  }
  if (value.state !== "equal" && value.state !== "managed-drift"
    && (value.desiredFingerprint !== undefined || value.observedFingerprint !== undefined)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["state"],
      message: "Fingerprints are only accepted for equal or managed-drift observations.",
    });
  }
  if (value.state === "equal" && value.desiredFingerprint !== value.observedFingerprint) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["observedFingerprint"],
      message: "An equal observation requires matching fingerprints.",
    });
  }
});

export type SyncFieldObservation = z.infer<typeof syncFieldObservationSchema>;

const conflictEntrySchema = z.object({
  fieldId: StableDiceBoxIdSchema,
  componentId: StableDiceBoxIdSchema,
  observedState: z.enum(fieldObservationStates),
  action: z.enum(conflictActions),
  foundryApi: z.string().min(1).nullable(),
  reason: z.string().min(1),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

export const syncConflictPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  releaseId: StableDiceBoxIdSchema,
  fields: z.array(managedFieldSpecSchema),
  entries: z.array(conflictEntrySchema),
  rawPayload: z.literal("absent"),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

export type SyncConflictPlan = z.infer<typeof syncConflictPlanSchema>;

export interface SyncConflictReview {
  readonly status: "ready" | "blocked";
  readonly findings: readonly {
    readonly code: string;
    readonly severity: "blocker" | "warning";
    readonly message: string;
  }[];
  readonly checkedCapabilities: readonly CapabilityId[];
  readonly checkedAuthority: "none" | "gm";
  readonly checkedRuntime: RuntimeProfile;
  readonly exactTargetMatch: boolean;
  readonly noWrite: true;
}

export interface SyncConflictPreview {
  readonly plan: SyncConflictPlan;
  readonly review: SyncConflictReview;
  readonly receipt: EvidenceReceipt;
}

function finding(code: string, severity: "blocker" | "warning", message: string) {
  return { code, severity, message } as const;
}

function updateApi(component: ReleaseBundle["components"][number]): string | null {
  return component.foundryApiBindings.find((binding) => binding.role === "update")?.api ?? null;
}

function createEntry(
  field: ManagedFieldSpec,
  component: ReleaseBundle["components"][number],
  observation: SyncFieldObservation | undefined,
): SyncConflictPlan["entries"][number] {
  if (!observation) {
    return {
      fieldId: field.fieldId,
      componentId: field.componentId,
      observedState: "unknown",
      action: "preserve-unknown",
      foundryApi: null,
      reason: "No field observation is not proof of equality or drift; preserve until authoritative reread.",
      mutation: "disabled-until-exact-runtime-gate",
    };
  }
  if (observation.state === "equal") {
    return {
      fieldId: field.fieldId,
      componentId: field.componentId,
      observedState: observation.state,
      action: "no-op",
      foundryApi: null,
      reason: "Desired and observed fingerprints match; no repair intent is emitted.",
      mutation: "disabled-until-exact-runtime-gate",
    };
  }
  if (observation.state === "managed-drift") {
    if (field.repairPolicy === "managed-only" && updateApi(component) !== null) {
      return {
        fieldId: field.fieldId,
        componentId: field.componentId,
        observedState: observation.state,
        action: "repair-candidate",
        foundryApi: updateApi(component),
        reason: "DiceBox-owned drift may be reviewed for native repair after current-state reread and approval.",
        mutation: "disabled-until-exact-runtime-gate",
      };
    }
    return {
      fieldId: field.fieldId,
      componentId: field.componentId,
      observedState: observation.state,
      action: "preserve-managed-drift",
      foundryApi: null,
      reason: "Managed drift is preserved because this field is observe-only or has no reviewed native update surface.",
      mutation: "disabled-until-exact-runtime-gate",
    };
  }
  return {
    fieldId: field.fieldId,
    componentId: field.componentId,
    observedState: observation.state,
    action: observation.state === "runtime-owned" ? "preserve-runtime" : observation.state === "foreign" ? "preserve-foreign" : "preserve-unknown",
    foundryApi: null,
    reason: observation.state === "runtime-owned"
      ? "Runtime-owned state is sovereign and is not overwritten by a release repair."
      : observation.state === "foreign"
        ? "Foreign state is preserved and cannot be claimed or cleaned up."
        : "Unknown state is preserved until an authoritative reread resolves it.",
    mutation: "disabled-until-exact-runtime-gate",
  };
}

function assertPlanIntegrity(plan: SyncConflictPlan, bundle: ReleaseBundle): void {
  if (plan.releaseId !== bundle.releaseId || plan.rawPayload !== "absent") {
    throw new Error("Sync conflict identity or raw-payload boundary was tampered.");
  }
  const components = new Map(bundle.components.map((component) => [component.componentId, component]));
  const fields = new Map<string, ManagedFieldSpec>();
  for (const field of plan.fields) {
    if (fields.has(field.fieldId)) throw new Error(`Duplicate managed field ${field.fieldId}.`);
    if (!components.has(field.componentId)) throw new Error(`Managed field ${field.fieldId} targets an unknown component.`);
    fields.set(field.fieldId, field);
  }
  const entries = new Set<string>();
  for (const entry of plan.entries) {
    const field = fields.get(entry.fieldId);
    const component = components.get(entry.componentId);
    if (!field || !component || field.componentId !== entry.componentId) throw new Error(`Sync conflict identity mismatch for ${entry.fieldId}.`);
    if (entries.has(entry.fieldId)) throw new Error(`Duplicate sync conflict entry ${entry.fieldId}.`);
    entries.add(entry.fieldId);
    const expectedApi = entry.action === "repair-candidate" ? updateApi(component) : null;
    if (entry.foundryApi !== expectedApi) throw new Error(`Sync conflict API binding mismatch for ${entry.fieldId}.`);
  }
  if (entries.size !== fields.size) throw new Error("Sync conflict plan must retain every managed field.");
}

export function createSyncConflictPlan(input: {
  readonly bundle: unknown;
  readonly fields: readonly unknown[];
  readonly observations: readonly unknown[];
}): SyncConflictPlan {
  const bundle = validateReleaseBundle(input.bundle);
  const fields = input.fields.map((field) => managedFieldSpecSchema.parse(field))
    .sort((left, right) => left.fieldId.localeCompare(right.fieldId));
  const observations = input.observations.map((observation) => syncFieldObservationSchema.parse(observation));
  const observationById = new Map<string, SyncFieldObservation>();
  for (const observation of observations) {
    if (observationById.has(observation.fieldId)) throw new Error(`Duplicate field observation ${observation.fieldId}.`);
    observationById.set(observation.fieldId, observation);
  }
  const components = new Map(bundle.components.map((component) => [component.componentId, component]));
  const entries = fields.map((field) => {
    const component = components.get(field.componentId);
    if (!component) throw new Error(`Managed field ${field.fieldId} targets an unknown component.`);
    return createEntry(field, component, observationById.get(field.fieldId));
  });
  const plan = syncConflictPlanSchema.parse({
    schemaVersion: "0.1.0",
    releaseId: bundle.releaseId,
    fields,
    entries,
    rawPayload: "absent",
    mutation: "disabled-until-exact-runtime-gate",
  });
  assertPlanIntegrity(plan, bundle);
  return plan;
}

export function validateSyncConflictPlan(input: unknown, bundleInput: unknown): SyncConflictPlan {
  const bundle = validateReleaseBundle(bundleInput);
  const plan = syncConflictPlanSchema.parse(input);
  assertPlanIntegrity(plan, bundle);
  return plan;
}

function createConflictReceipt(plan: SyncConflictPlan, authority: "none" | "gm", observedAt: string): EvidenceReceipt {
  return EvidenceReceiptSchema.parse({
    receiptId: createStableDiceBoxId("receipt", `${plan.releaseId.split(":").at(-1) ?? "release"}-conflict`),
    operation: "sync-conflict.preview",
    status: "previewed",
    evidenceClass: "deterministic",
    authority,
    semanticRefs: [],
    observedAt,
    notes: [
      "Preview only; no Foundry update, cleanup, socket, or raw field payload was emitted or attempted.",
      "Runtime-owned, foreign, managed-drift-without-repair, and unknown fields remain preserved.",
      "Repair candidates require exact runtime, active GM, native API adapter, authoritative reread, approval, and recovery evidence.",
    ],
  });
}

export function previewSyncConflictPlan(
  planInput: unknown,
  bundleInput: unknown,
  runtime: RuntimeProfile,
  options: { readonly authority?: "none" | "gm"; readonly observedAt: string },
): SyncConflictPreview {
  const bundle = validateReleaseBundle(bundleInput);
  const plan = validateSyncConflictPlan(planInput, bundle);
  const parsedRuntime = RuntimeProfileSchema.parse(runtime);
  const authority = options.authority ?? "none";
  const registry = createCapabilityRegistry(parsedRuntime);
  const findings: ReturnType<typeof finding>[] = [];
  const repairEntries = plan.entries.filter((entry) => entry.action === "repair-candidate");
  const unresolvedEntries = plan.entries.filter((entry) => ["preserve-managed-drift", "preserve-unknown"].includes(entry.action));
  const requiredCapabilities = [...new Set(bundle.components
    .filter((component) => plan.fields.some((field) => field.componentId === component.componentId)
      && plan.entries.some((entry) => entry.componentId === component.componentId && entry.action === "repair-candidate"))
    .flatMap((component) => component.requiredCapabilities))]
    .sort((left, right) => left.localeCompare(right));

  if (parsedRuntime.phase !== "ready") findings.push(finding("RUNTIME_NOT_READY", "blocker", "The exact Foundry runtime has not reached the ready phase."));
  if (parsedRuntime.foundryVersion !== TARGET_FOUNDRY_VERSION) findings.push(finding("FOUNDRY_VERSION_MISMATCH", "blocker", `Expected Foundry ${TARGET_FOUNDRY_VERSION}.`));
  if (parsedRuntime.systemId !== "dnd5e" || parsedRuntime.systemVersion !== TARGET_DND5E_VERSION) findings.push(finding("SYSTEM_VERSION_MISMATCH", "blocker", `Expected dnd5e ${TARGET_DND5E_VERSION}.`));
  for (const capabilityId of requiredCapabilities) {
    const support = registry.supports(capabilityId);
    if (support.state !== "available") findings.push(finding(`${capabilityId.toUpperCase().replaceAll(".", "_")}_UNAVAILABLE`, "blocker", support.reason));
  }
  if (repairEntries.length > 0 && authority !== "gm") findings.push(finding("GM_AUTHORITY_REQUIRED", "blocker", "Repair candidates require an active authorized GM."));
  if (repairEntries.length > 0) findings.push(finding("REPAIR_CANDIDATE_DISABLED", "blocker", "Repair candidates remain disabled until the native adapter and authoritative reread gate pass."));
  if (unresolvedEntries.length > 0) findings.push(finding("UNRESOLVED_FIELD_STATE", "blocker", "Managed drift or unknown field state remains unresolved and must be preserved until reread."));

  return {
    plan,
    review: {
      status: findings.some((item) => item.severity === "blocker") ? "blocked" : "ready",
      findings,
      checkedCapabilities: requiredCapabilities,
      checkedAuthority: authority,
      checkedRuntime: parsedRuntime,
      exactTargetMatch: parsedRuntime.phase === "ready"
        && parsedRuntime.foundryVersion === TARGET_FOUNDRY_VERSION
        && parsedRuntime.systemId === "dnd5e"
        && parsedRuntime.systemVersion === TARGET_DND5E_VERSION,
      noWrite: true,
    },
    receipt: createConflictReceipt(plan, authority, options.observedAt),
  };
}
