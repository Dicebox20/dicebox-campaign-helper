import { z } from "zod";
import {
  createCapabilityRegistry,
  createStableDiceBoxId,
  EvidenceReceiptSchema,
  RuntimeProfileSchema,
  SemanticRefSchema,
  StableDiceBoxIdSchema,
  TARGET_DND5E_VERSION,
  TARGET_FOUNDRY_VERSION,
  type EvidenceReceipt,
  type RuntimeProfile,
  type SemanticRef,
} from "@dicebox/core";

const managedDocumentTypes = ["JournalEntry"] as const;
const documentOperations = ["create", "update"] as const;
const reviewStatuses = ["ready", "blocked"] as const;
const findingSeverities = ["blocker", "warning"] as const;

export const managedJournalEntrySpecSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  semantic: SemanticRefSchema,
  documentType: z.literal("JournalEntry"),
  operation: z.enum(documentOperations),
  title: z.string().trim().min(1).max(200),
  content: z.string().max(100_000),
  expectedBindingGeneration: z.number().int().nonnegative(),
}).strict();

export type ManagedJournalEntrySpec = z.infer<typeof managedJournalEntrySpecSchema>;

export const reviewFindingSchema = z.object({
  code: z.string().regex(/^[A-Z][A-Z0-9_]+$/),
  severity: z.enum(findingSeverities),
  message: z.string().min(1),
});

export type ReviewFinding = z.infer<typeof reviewFindingSchema>;

export const documentPlanReviewSchema = z.object({
  status: z.enum(reviewStatuses),
  findings: z.array(reviewFindingSchema),
  checkedCapabilities: z.array(z.string()),
  checkedAuthority: z.enum(["none", "gm"]),
  checkedRuntime: RuntimeProfileSchema,
});

export type DocumentPlanReview = z.infer<typeof documentPlanReviewSchema>;

export interface DocumentPlanPreview {
  readonly plan: ManagedJournalEntrySpec;
  readonly review: DocumentPlanReview;
  readonly receipt: EvidenceReceipt;
}

function finding(code: string, severity: ReviewFinding["severity"], message: string): ReviewFinding {
  return { code, severity, message };
}

export function validateManagedJournalEntrySpec(input: unknown): ManagedJournalEntrySpec {
  return managedJournalEntrySpecSchema.parse(input);
}

export function createManagedJournalEntrySpec(input: {
  readonly planId: ManagedJournalEntrySpec["planId"];
  readonly semantic: SemanticRef;
  readonly operation: ManagedJournalEntrySpec["operation"];
  readonly title: string;
  readonly content: string;
  readonly expectedBindingGeneration?: number;
}): ManagedJournalEntrySpec {
  return managedJournalEntrySpecSchema.parse({
    schemaVersion: "0.1.0",
    planId: input.planId,
    semantic: input.semantic,
    documentType: "JournalEntry",
    operation: input.operation,
    title: input.title,
    content: input.content,
    expectedBindingGeneration: input.expectedBindingGeneration ?? (input.operation === "create" ? 0 : 1),
  });
}

function createPreviewReceipt(plan: ManagedJournalEntrySpec, authority: "none" | "gm", observedAt: string): EvidenceReceipt {
  return EvidenceReceiptSchema.parse({
    receiptId: createStableDiceBoxId("receipt", `${plan.planId.split(":").at(-1) ?? "plan"}-preview`),
    operation: "document-plan.preview",
    status: "previewed",
    evidenceClass: "deterministic",
    authority,
    semanticRefs: [plan.semantic],
    observedAt,
    notes: [
      "Preview only; no Foundry Document mutation was attempted.",
      "Runtime capability and authority gates were evaluated before any future apply step.",
    ],
  });
}

export function previewManagedJournalEntry(
  input: unknown,
  runtime: RuntimeProfile,
  options: { readonly authority?: "none" | "gm"; readonly observedAt: string },
): DocumentPlanPreview {
  const plan = validateManagedJournalEntrySpec(input);
  const parsedRuntime = RuntimeProfileSchema.parse(runtime);
  const authority = options.authority ?? "none";
  const registry = createCapabilityRegistry(parsedRuntime);
  const findings: ReviewFinding[] = [];

  if (parsedRuntime.phase !== "ready") {
    findings.push(finding("RUNTIME_NOT_READY", "blocker", "The exact Foundry runtime has not reached the ready phase."));
  }
  if (parsedRuntime.foundryVersion !== TARGET_FOUNDRY_VERSION) {
    findings.push(finding("FOUNDRY_VERSION_MISMATCH", "blocker", `Expected Foundry ${TARGET_FOUNDRY_VERSION}.`));
  }
  if (parsedRuntime.systemId !== "dnd5e" || parsedRuntime.systemVersion !== TARGET_DND5E_VERSION) {
    findings.push(finding("SYSTEM_VERSION_MISMATCH", "blocker", `Expected dnd5e ${TARGET_DND5E_VERSION}.`));
  }

  const writeCapability = registry.supports("foundry.document.write");
  if (writeCapability.state !== "available") {
    findings.push(finding("WRITE_CAPABILITY_UNAVAILABLE", "blocker", writeCapability.reason));
  }
  const readCapability = registry.supports("foundry.document.read");
  if (readCapability.state !== "available") {
    findings.push(finding("READ_CAPABILITY_UNAVAILABLE", "blocker", readCapability.reason));
  }
  const activeGmCapability = registry.supports("foundry.users.active-gm");
  if (activeGmCapability.state !== "available") {
    findings.push(finding("ACTIVE_GM_CAPABILITY_UNAVAILABLE", "blocker", activeGmCapability.reason));
  }
  if (authority !== "gm") {
    findings.push(finding("GM_AUTHORITY_REQUIRED", "blocker", "Managed document creation requires an active authorized GM."));
  }
  if (plan.operation === "update" && plan.expectedBindingGeneration < 1) {
    findings.push(finding("BINDING_REQUIRED", "blocker", "An update preview requires a known runtime binding generation."));
  }

  const review: DocumentPlanReview = {
    status: findings.some((item) => item.severity === "blocker") ? "blocked" : "ready",
    findings,
    checkedCapabilities: ["foundry.document.write", "foundry.document.read", "foundry.users.active-gm"],
    checkedAuthority: authority,
    checkedRuntime: parsedRuntime,
  };

  return {
    plan,
    review: documentPlanReviewSchema.parse(review),
    receipt: createPreviewReceipt(plan, authority, options.observedAt),
  };
}

export const managedDocumentTypesSchema = z.array(z.enum(managedDocumentTypes));
