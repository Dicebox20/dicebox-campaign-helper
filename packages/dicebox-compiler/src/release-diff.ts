import { z } from "zod";
import {
  createCapabilityRegistry,
  EvidenceReceiptSchema,
  RuntimeProfileSchema,
  SemanticRefSchema,
  StableDiceBoxIdSchema,
  TARGET_DND5E_VERSION,
  TARGET_FOUNDRY_VERSION,
  createStableDiceBoxId,
  type CapabilityId,
  type EvidenceReceipt,
  type RuntimeProfile,
} from "@dicebox/core";
import {
  releaseBundleSchema,
  validateReleaseBundle,
  type ReleaseBundle,
} from "./release-plan.js";

const runtimeObservationStates = ["missing", "managed", "foreign", "unknown"] as const;
const diffActions = [
  "create-candidate",
  "reread-managed",
  "preserve-foreign",
  "preserve-unknown",
  "preserve-runtime-only",
] as const;

export const releaseRuntimeObservationSchema = z.object({
  componentId: StableDiceBoxIdSchema,
  semantic: SemanticRefSchema,
  state: z.enum(runtimeObservationStates),
  bindingGeneration: z.number().int().nonnegative().optional(),
  bindingFingerprint: z.string().regex(/^[a-f0-9]{64}$/).optional(),
}).strict().superRefine((value, context) => {
  if (value.state === "managed" && (value.bindingGeneration === undefined || value.bindingFingerprint === undefined)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bindingGeneration"],
      message: "A managed runtime observation requires a generation and redacted binding fingerprint.",
    });
  }
  if (value.state !== "managed" && (value.bindingGeneration !== undefined || value.bindingFingerprint !== undefined)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["state"],
      message: "Binding evidence is only valid for a managed runtime observation.",
    });
  }
});

export type ReleaseRuntimeObservation = z.infer<typeof releaseRuntimeObservationSchema>;

const diffEntrySchema = z.object({
  componentId: StableDiceBoxIdSchema,
  semantic: SemanticRefSchema,
  observedState: z.enum(runtimeObservationStates),
  action: z.enum(diffActions),
  foundryApi: z.string().min(1).nullable(),
  bindingGeneration: z.number().int().nonnegative().optional(),
  reason: z.string().min(1),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

const runtimeOnlyEntrySchema = z.object({
  componentId: StableDiceBoxIdSchema,
  semantic: SemanticRefSchema,
  observedState: z.enum(runtimeObservationStates),
  action: z.literal("preserve-runtime-only"),
  reason: z.string().min(1),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

export const releaseDiffPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  releaseId: StableDiceBoxIdSchema,
  entries: z.array(diffEntrySchema),
  runtimeOnly: z.array(runtimeOnlyEntrySchema),
  cleanup: z.literal("disabled"),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

export type ReleaseDiffPlan = z.infer<typeof releaseDiffPlanSchema>;

export interface ReleaseDiffReview {
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

export interface ReleaseDiffPreview {
  readonly plan: ReleaseDiffPlan;
  readonly review: ReleaseDiffReview;
  readonly receipt: EvidenceReceipt;
}

function finding(code: string, severity: "blocker" | "warning", message: string) {
  return { code, severity, message } as const;
}

function bindingFor(component: ReleaseBundle["components"][number], role: "create" | "reread"): string | null {
  return component.foundryApiBindings.find((binding) => binding.role === role)?.api ?? null;
}

function assertObservationIdentity(
  component: ReleaseBundle["components"][number],
  observation: ReleaseRuntimeObservation,
): void {
  if (observation.semantic.id !== component.semantic.id || observation.semantic.kind !== component.semantic.kind) {
    throw new Error(`Runtime observation ${observation.componentId} does not match release component ${component.componentId}.`);
  }
}

function createEntry(
  component: ReleaseBundle["components"][number],
  observation: ReleaseRuntimeObservation | undefined,
): ReleaseDiffPlan["entries"][number] {
  if (!observation) {
    return {
      componentId: component.componentId,
      semantic: component.semantic,
      observedState: "unknown",
      action: "preserve-unknown",
      foundryApi: null,
      reason: "No runtime observation is not proof of absence; preserve the unresolved state until reread.",
      mutation: "disabled-until-exact-runtime-gate",
    };
  }
  assertObservationIdentity(component, observation);
  if (observation.state === "missing") {
    return {
      componentId: component.componentId,
      semantic: component.semantic,
      observedState: observation.state,
      action: "create-candidate",
      foundryApi: bindingFor(component, "create"),
      reason: "Explicitly observed missing; create remains a review candidate and is not executed.",
      mutation: "disabled-until-exact-runtime-gate",
    };
  }
  if (observation.state === "managed") {
    return {
      componentId: component.componentId,
      semantic: component.semantic,
      observedState: observation.state,
      action: "reread-managed",
      foundryApi: bindingFor(component, "reread"),
      bindingGeneration: observation.bindingGeneration,
      reason: "DiceBox-owned state requires authoritative reread before any update candidate.",
      mutation: "disabled-until-exact-runtime-gate",
    };
  }
  return {
    componentId: component.componentId,
    semantic: component.semantic,
    observedState: observation.state,
    action: observation.state === "foreign" ? "preserve-foreign" : "preserve-unknown",
    foundryApi: null,
    reason: observation.state === "foreign"
      ? "Foreign runtime state is preserved and cannot be overwritten or cleaned up."
      : "Uncertain runtime state is preserved; reread is required before any retry or repair.",
    mutation: "disabled-until-exact-runtime-gate",
  };
}

function assertDiffIntegrity(plan: ReleaseDiffPlan, bundle: ReleaseBundle): void {
  if (plan.releaseId !== bundle.releaseId || plan.cleanup !== "disabled") {
    throw new Error("Release diff identity or cleanup boundary was tampered.");
  }
  const components = new Map(bundle.components.map((component) => [component.componentId, component]));
  const seen = new Set<string>();
  for (const entry of plan.entries) {
    const component = components.get(entry.componentId);
    if (!component) throw new Error(`Release diff contains an unknown component ${entry.componentId}.`);
    if (seen.has(entry.componentId)) throw new Error(`Release diff contains a duplicate component ${entry.componentId}.`);
    seen.add(entry.componentId);
    if (entry.semantic.id !== component.semantic.id || entry.semantic.kind !== component.semantic.kind) {
      throw new Error(`Release diff semantic identity mismatch for ${entry.componentId}.`);
    }
    const expectedApi = entry.action === "create-candidate"
      ? bindingFor(component, "create")
      : entry.action === "reread-managed" ? bindingFor(component, "reread") : null;
    if (entry.foundryApi !== expectedApi) throw new Error(`Release diff API binding mismatch for ${entry.componentId}.`);
  }
  if (seen.size !== bundle.components.length) throw new Error("Release diff must retain an entry for every desired component.");
}

export function createReleaseDiffPlan(input: {
  readonly bundle: unknown;
  readonly observations: readonly unknown[];
}): ReleaseDiffPlan {
  const bundle = validateReleaseBundle(input.bundle);
  const observations = input.observations.map((observation) => releaseRuntimeObservationSchema.parse(observation));
  const observationById = new Map<string, ReleaseRuntimeObservation>();
  for (const observation of observations) {
    if (observationById.has(observation.componentId)) throw new Error(`Duplicate runtime observation ${observation.componentId}.`);
    observationById.set(observation.componentId, observation);
  }
  const desiredIds = new Set(bundle.components.map((component) => component.componentId));
  const entries = bundle.components.map((component) => createEntry(component, observationById.get(component.componentId)));
  const runtimeOnly = observations
    .filter((observation) => !desiredIds.has(observation.componentId))
    .map((observation) => ({
      componentId: observation.componentId,
      semantic: observation.semantic,
      observedState: observation.state,
      action: "preserve-runtime-only" as const,
      reason: "Runtime observation is not in this release; preserve it and do not infer cleanup.",
      mutation: "disabled-until-exact-runtime-gate" as const,
    }))
    .sort((left, right) => left.componentId.localeCompare(right.componentId));
  const plan = releaseDiffPlanSchema.parse({
    schemaVersion: "0.1.0",
    releaseId: bundle.releaseId,
    entries,
    runtimeOnly,
    cleanup: "disabled",
    mutation: "disabled-until-exact-runtime-gate",
  });
  assertDiffIntegrity(plan, bundle);
  return plan;
}

export function validateReleaseDiffPlan(input: unknown, bundleInput: unknown): ReleaseDiffPlan {
  const bundle = validateReleaseBundle(bundleInput);
  const plan = releaseDiffPlanSchema.parse(input);
  assertDiffIntegrity(plan, bundle);
  return plan;
}

function createDiffReceipt(plan: ReleaseDiffPlan, authority: "none" | "gm", observedAt: string): EvidenceReceipt {
  return EvidenceReceiptSchema.parse({
    receiptId: createStableDiceBoxId("receipt", `${plan.releaseId.split(":").at(-1) ?? "release"}-diff`),
    operation: "release-diff.preview",
    status: "previewed",
    evidenceClass: "deterministic",
    authority,
    semanticRefs: [...plan.entries, ...plan.runtimeOnly].map((entry) => entry.semantic),
    observedAt,
    notes: [
      "Preview only; no Foundry create, update, delete, cleanup, or retry was attempted.",
      "Foreign and unknown runtime observations are preserved; absent observations are not treated as missing.",
      "Create candidates require an exact runtime, active GM, native API adapter, authoritative reread, and separate approval.",
    ],
  });
}

export function previewReleaseDiff(
  planInput: unknown,
  bundleInput: unknown,
  runtime: RuntimeProfile,
  options: { readonly authority?: "none" | "gm"; readonly observedAt: string },
): ReleaseDiffPreview {
  const bundle = validateReleaseBundle(bundleInput);
  const plan = validateReleaseDiffPlan(planInput, bundle);
  const parsedRuntime = RuntimeProfileSchema.parse(runtime);
  const authority = options.authority ?? "none";
  const registry = createCapabilityRegistry(parsedRuntime);
  const findings: ReturnType<typeof finding>[] = [];
  const createEntries = plan.entries.filter((entry) => entry.action === "create-candidate");
  const unknownEntries = plan.entries.filter((entry) => entry.action === "preserve-unknown");
  const requiredCapabilities = [...new Set(bundle.components
    .filter((component) => plan.entries.some((entry) => entry.componentId === component.componentId && entry.action !== "preserve-foreign"))
    .flatMap((component) => component.requiredCapabilities))]
    .sort((left, right) => left.localeCompare(right));

  if (parsedRuntime.phase !== "ready") findings.push(finding("RUNTIME_NOT_READY", "blocker", "The exact Foundry runtime has not reached the ready phase."));
  if (parsedRuntime.foundryVersion !== TARGET_FOUNDRY_VERSION) findings.push(finding("FOUNDRY_VERSION_MISMATCH", "blocker", `Expected Foundry ${TARGET_FOUNDRY_VERSION}.`));
  if (parsedRuntime.systemId !== "dnd5e" || parsedRuntime.systemVersion !== TARGET_DND5E_VERSION) findings.push(finding("SYSTEM_VERSION_MISMATCH", "blocker", `Expected dnd5e ${TARGET_DND5E_VERSION}.`));
  for (const capabilityId of requiredCapabilities) {
    const support = registry.supports(capabilityId);
    if (support.state !== "available") findings.push(finding(`${capabilityId.toUpperCase().replaceAll(".", "_")}_UNAVAILABLE`, "blocker", support.reason));
  }
  if (createEntries.length > 0 && authority !== "gm") findings.push(finding("GM_AUTHORITY_REQUIRED", "blocker", "Create candidates require an active authorized GM."));
  if (unknownEntries.length > 0) findings.push(finding("UNKNOWN_RUNTIME_STATE", "blocker", "Unknown runtime state remains preserved until authoritative reread resolves it."));
  if (createEntries.length > 0) findings.push(finding("CREATE_CANDIDATE_DISABLED", "blocker", "Create candidates remain disabled until the exact native adapter and reread gate pass."));

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
    receipt: createDiffReceipt(plan, authority, options.observedAt),
  };
}
