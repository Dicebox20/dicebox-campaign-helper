import { z } from "zod";
import {
  EvidenceReceiptSchema,
  RuntimeBindingSchema,
  StableDiceBoxIdSchema,
  type DiceBoxError,
  type Result,
  type RuntimeBinding,
} from "@dicebox/core";
import {
  managedJournalEntrySpecSchema,
  type DocumentPlanPreview,
  type ManagedJournalEntrySpec,
} from "./document-plan.js";

const transactionStages = [
  "previewed",
  "approved",
  "apply-ready",
  "applying",
  "unknown-outcome",
  "committed",
  "recovered",
] as const;

const transactionResolutions = ["pending", "committed", "not-committed", "conflict"] as const;
const recoveryStatuses = ["committed", "not-committed", "conflict", "unknown"] as const;

export const approvalTokenSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  tokenId: StableDiceBoxIdSchema,
  planId: StableDiceBoxIdSchema,
  previewReceiptId: StableDiceBoxIdSchema,
  planFingerprint: z.string().regex(/^fnv1a:[0-9a-f]{8}$/),
  approvedBy: z.literal("gm"),
  approvedByUserId: z.string().trim().min(1).max(100),
  approvedAt: z.string().datetime({ offset: true }),
  expiresAt: z.string().datetime({ offset: true }),
}).strict();

export type ApprovalToken = z.infer<typeof approvalTokenSchema>;

export const transactionJournalSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  transactionId: StableDiceBoxIdSchema,
  idempotencyKey: StableDiceBoxIdSchema,
  planId: StableDiceBoxIdSchema,
  semanticId: StableDiceBoxIdSchema,
  documentType: z.literal("JournalEntry"),
  operation: z.enum(["create", "update"]),
  stage: z.enum(transactionStages),
  resolution: z.enum(transactionResolutions),
  attempt: z.number().int().nonnegative(),
  previewReceiptId: StableDiceBoxIdSchema,
  approvalTokenId: StableDiceBoxIdSchema.nullable(),
  approvedByUserId: z.string().trim().min(1).max(100).nullable(),
  binding: RuntimeBindingSchema.nullable(),
  observedAt: z.string().datetime({ offset: true }),
  notes: z.array(z.string()),
}).strict();

type TransactionJournalData = z.infer<typeof transactionJournalSchema>;
export type TransactionJournal = Omit<TransactionJournalData, "notes"> & {
  readonly notes: readonly string[];
};

export const recoveryObservationSchema = z.object({
  status: z.enum(recoveryStatuses),
  binding: RuntimeBindingSchema.nullable(),
  observedAt: z.string().datetime({ offset: true }),
  notes: z.array(z.string()),
}).strict();

export type RecoveryObservation = z.infer<typeof recoveryObservationSchema>;

function error(code: DiceBoxError["code"], message: string, retry: DiceBoxError["retry"]): Result<never> {
  return { ok: false, error: { code, message, retry } };
}

function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

/**
 * This is an identity fingerprint, not a cryptographic signature. An approval
 * token must come from an authorized review boundary; this function only
 * verifies that the token refers to the exact preview being advanced.
 */
export function fingerprintManagedJournalEntry(planInput: ManagedJournalEntrySpec): string {
  const plan = managedJournalEntrySpecSchema.parse(planInput);
  const canonical = JSON.stringify(plan);
  let hash = 2166136261;
  for (let index = 0; index < canonical.length; index += 1) {
    hash ^= canonical.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return `fnv1a:${hash.toString(16).padStart(8, "0")}`;
}

export function validateApprovalTokenForPreview(
  tokenInput: unknown,
  preview: DocumentPlanPreview,
  options: { readonly observedAt: string; readonly activeGmUserId: string },
): Result<ApprovalToken> {
  const parsedToken = approvalTokenSchema.safeParse(tokenInput);
  if (!parsedToken.success) return error("INVALID_INPUT", "Approval token does not match the strict token schema.", "never");
  if (preview.review.status !== "ready") return error("FORBIDDEN", "A blocked preview cannot be approved.", "never");

  const token = parsedToken.data;
  const observedTimestamp = Date.parse(options.observedAt);
  const approvedTimestamp = Date.parse(token.approvedAt);
  const expiresTimestamp = Date.parse(token.expiresAt);
  if (!Number.isFinite(observedTimestamp) || approvedTimestamp > observedTimestamp || observedTimestamp > expiresTimestamp) {
    return error("FORBIDDEN", "Approval token is outside its approval or expiry window.", "never");
  }
  if (token.planId !== preview.plan.planId || token.previewReceiptId !== preview.receipt.receiptId) {
    return error("FORBIDDEN", "Approval token does not bind to this exact plan and preview receipt.", "never");
  }
  if (token.approvedByUserId !== options.activeGmUserId) {
    return error("FORBIDDEN", "Approval token was not issued by the currently rechecked active GM.", "never");
  }
  if (token.planFingerprint !== fingerprintManagedJournalEntry(preview.plan)) {
    return error("FORBIDDEN", "Approval token fingerprint does not match the reviewed plan.", "never");
  }
  return ok(token);
}

export function createPreviewTransaction(preview: DocumentPlanPreview): TransactionJournal {
  return transactionJournalSchema.parse({
    schemaVersion: "0.1.0",
    transactionId: `dbx:transaction:${preview.plan.planId.split(":").at(-1) ?? "plan"}`,
    idempotencyKey: `dbx:idempotency:${preview.plan.planId.split(":").at(-1) ?? "plan"}`,
    planId: preview.plan.planId,
    semanticId: preview.plan.semantic.id,
    documentType: "JournalEntry",
    operation: preview.plan.operation,
    stage: "previewed",
    resolution: "pending",
    attempt: 0,
    previewReceiptId: preview.receipt.receiptId,
    approvalTokenId: null,
    approvedByUserId: null,
    binding: null,
    observedAt: preview.receipt.observedAt,
    notes: ["Transaction is preview-only until an authorized approval token is validated."],
  });
}

export function approveTransaction(
  transactionInput: TransactionJournal,
  preview: DocumentPlanPreview,
  tokenInput: unknown,
  options: { readonly observedAt: string; readonly activeGmUserId: string },
): Result<TransactionJournal> {
  const transaction = transactionJournalSchema.parse(transactionInput);
  if (transaction.stage !== "previewed") return error("FORBIDDEN", "Only a previewed transaction can be approved.", "never");
  const token = validateApprovalTokenForPreview(tokenInput, preview, options);
  if (!token.ok) return token;
  if (transaction.planId !== preview.plan.planId || transaction.previewReceiptId !== preview.receipt.receiptId) {
    return error("FORBIDDEN", "Transaction does not bind to the reviewed preview.", "never");
  }

  return ok(transactionJournalSchema.parse({
    ...transaction,
    stage: "approved",
    approvalTokenId: token.value.tokenId,
    approvedByUserId: token.value.approvedByUserId,
    observedAt: options.observedAt,
    notes: [...transaction.notes, "Authorized GM approval token validated for the exact preview."],
  }));
}

export function prepareTransaction(transactionInput: TransactionJournal, observedAt: string): Result<TransactionJournal> {
  const transaction = transactionJournalSchema.parse(transactionInput);
  if (transaction.stage !== "approved") return error("FORBIDDEN", "Only an approved transaction can become apply-ready.", "never");
  return ok(transactionJournalSchema.parse({
    ...transaction,
    stage: "apply-ready",
    observedAt,
    notes: [...transaction.notes, "Apply remains adapter-gated; no Foundry call was made."],
  }));
}

export function markApplying(transactionInput: TransactionJournal, observedAt: string): Result<TransactionJournal> {
  const transaction = transactionJournalSchema.parse(transactionInput);
  if (transaction.stage !== "apply-ready") return error("FORBIDDEN", "Only an apply-ready transaction can enter applying state.", "never");
  return ok(transactionJournalSchema.parse({
    ...transaction,
    stage: "applying",
    attempt: transaction.attempt + 1,
    observedAt,
    notes: [...transaction.notes, "An adapter may now attempt the exact bounded operation."],
  }));
}

export function markUnknownOutcome(transactionInput: TransactionJournal, observedAt: string): Result<TransactionJournal> {
  const transaction = transactionJournalSchema.parse(transactionInput);
  if (transaction.stage !== "applying") return error("FORBIDDEN", "Only an applying transaction can become outcome-unknown.", "never");
  return ok(transactionJournalSchema.parse({
    ...transaction,
    stage: "unknown-outcome",
    observedAt,
    notes: [...transaction.notes, "Outcome is unknown; authoritative reread is required before retry."],
  }));
}

export function markCommittedAfterReadback(
  transactionInput: TransactionJournal,
  binding: RuntimeBinding,
  observedAt: string,
  note = "Authoritative read-back matched the reviewed semantic record.",
): Result<TransactionJournal> {
  const transaction = transactionJournalSchema.parse(transactionInput);
  if (transaction.stage !== "applying" && transaction.stage !== "unknown-outcome") {
    return error("FORBIDDEN", "Only an applying or outcome-unknown transaction can be committed after read-back.", "never");
  }
  if (binding.semantic.id !== transaction.semanticId) {
    return error("FORBIDDEN", "Read-back binding does not match the reviewed semantic identity.", "never");
  }
  return ok(transactionJournalSchema.parse({
    ...transaction,
    stage: "committed",
    resolution: "committed",
    binding,
    observedAt,
    notes: [...transaction.notes, note],
  }));
}

export function recoverUnknownOutcome(
  transactionInput: TransactionJournal,
  observationInput: unknown,
): Result<TransactionJournal> {
  const transaction = transactionJournalSchema.parse(transactionInput);
  if (transaction.stage !== "unknown-outcome") return error("FORBIDDEN", "Only an outcome-unknown transaction can be recovered.", "never");
  const observation = recoveryObservationSchema.safeParse(observationInput);
  if (!observation.success) return error("INVALID_INPUT", "Recovery observation does not match the strict schema.", "never");

  if (observation.data.status === "unknown") {
    return ok(transactionJournalSchema.parse({
      ...transaction,
      observedAt: observation.data.observedAt,
      notes: [...transaction.notes, ...observation.data.notes, "Recovery remains unresolved; retry is not authorized."],
    }));
  }
  if (observation.data.status === "committed") {
    if (!observation.data.binding || observation.data.binding.semantic.id !== transaction.semanticId) {
      return error("FORBIDDEN", "Committed recovery must provide the exact reviewed semantic binding.", "never");
    }
    return ok(transactionJournalSchema.parse({
      ...transaction,
      stage: "committed",
      resolution: "committed",
      binding: observation.data.binding,
      observedAt: observation.data.observedAt,
      notes: [...transaction.notes, ...observation.data.notes, "Authoritative reread confirmed the exact committed binding."],
    }));
  }
  if (observation.data.status === "not-committed") {
    return ok(transactionJournalSchema.parse({
      ...transaction,
      stage: "recovered",
      resolution: "not-committed",
      observedAt: observation.data.observedAt,
      notes: [...transaction.notes, ...observation.data.notes, "Authoritative reread found no committed binding; create a new reviewed transaction before retry."],
    }));
  }
  return ok(transactionJournalSchema.parse({
    ...transaction,
    stage: "recovered",
    resolution: "conflict",
    binding: observation.data.binding,
    observedAt: observation.data.observedAt,
    notes: [...transaction.notes, ...observation.data.notes, "Foreign or conflicting state was preserved; retry is not authorized."],
  }));
}

export const transactionReceiptSchema = EvidenceReceiptSchema;
