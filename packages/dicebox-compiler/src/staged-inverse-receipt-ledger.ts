import { z } from "zod";
import { createStableDiceBoxId, type Result, StableDiceBoxIdSchema } from "@dicebox/core";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import {
  stagedInverseOperationReadbackSchema,
  stagedInverseTerminalReceiptSchema,
  validateStagedInverseOperationReadback,
  type StagedInverseTerminalReceipt,
} from "./staged-inverse-dispatch-state.js";
import { validateExactStagedInverseExecutionManifest } from "./staged-inverse-dispatch-state.js";
import { stagedInverseExecutionManifestSchema, type StagedInverseExecutionManifest } from "./staged-inverse-execution-manifest.js";
import { stagedInverseExecutionPermitSchema, verifyStagedInverseExecutionPermit, type StagedInverseExecutionPermit } from "./staged-inverse-execution-permit.js";
import { stagedInversePermitClaimStateSchema, type StagedInversePermitClaimState } from "./staged-inverse-permit-claim.js";
import type { StagedInverseExecutionInput } from "./staged-inverse-execution-contract.js";

const at = z.string().datetime({ offset: true });
const sha256 = z.string().regex(/^[0-9a-f]{64}$/);

function suffix(id: string): string {
  return id.split(":").at(-1) ?? id;
}

/** Deterministic identity for one terminal outcome under one manifest operation. */
export function deriveStagedInverseTerminalReceiptId(
  manifestId: string,
  stableId: string,
  idempotencyKey: string,
  phase: "outcome" | "recovery" = "outcome",
): string {
  return createStableDiceBoxId("inverse-receipt", `${suffix(manifestId)}-${suffix(stableId)}-${suffix(idempotencyKey)}-${phase}`);
}

/** Deterministic identity for one manifest-scoped receipt enumeration. */
export function deriveStagedInverseReceiptLedgerId(manifestId: string, permitId: string, claimId: string): string {
  return createStableDiceBoxId("inverse-receipt-ledger", `${suffix(manifestId)}-${suffix(permitId)}-${suffix(claimId)}`);
}

/** Deterministic identity for one manifest-scoped receipt query. */
export function deriveStagedInverseReceiptQueryId(manifestId: string, permitId: string, claimId: string): string {
  return createStableDiceBoxId("inverse-receipt-query", `${suffix(manifestId)}-${suffix(permitId)}-${suffix(claimId)}`);
}

export const stagedInverseReceiptLedgerEntrySchema = z.object({
  receipt: stagedInverseTerminalReceiptSchema,
  receiptSha256: sha256,
}).strict();

export const stagedInverseReceiptLedgerOperationSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  ledgerSequence: z.number().int().nonnegative(),
  stableId: StableDiceBoxIdSchema,
  operationKind: z.enum(["delete-owned-create", "restore-update-preimage"]),
  idempotencyKey: StableDiceBoxIdSchema,
  state: z.enum(["absent", "persisted", "unknown", "conflict"]),
  receipts: z.array(stagedInverseReceiptLedgerEntrySchema).max(20),
  headReceiptId: StableDiceBoxIdSchema.nullable(),
  headReceiptSha256: sha256.nullable(),
  observedAt: at,
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  const head = value.receipts.at(-1);
  if (value.state === "absent" && (value.receipts.length !== 0 || value.headReceiptId !== null || value.headReceiptSha256 !== null)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "An absent inverse ledger operation cannot expose a receipt head." });
  }
  if (value.state !== "absent" && (value.receipts.length === 0 || value.headReceiptId === null || value.headReceiptSha256 === null)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A resolved inverse ledger operation requires a receipt chain and head." });
  }
  if (head && (value.headReceiptId !== head.receipt.receiptId || value.headReceiptSha256 !== head.receiptSha256)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse ledger operation head must equal the final receipt chain entry." });
  }
  if (value.state === "persisted" && head && !["committed", "recovered"].includes(head.receipt.status)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Persisted inverse ledger state requires a committed or recovered terminal head." });
  }
  if (value.state === "unknown" && head && head.receipt.status !== "unknown") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Unknown inverse ledger state requires an unknown terminal head." });
  }
});

export const stagedInverseReceiptLedgerSnapshotSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  ledgerId: StableDiceBoxIdSchema,
  queryId: StableDiceBoxIdSchema,
  manifestId: StableDiceBoxIdSchema,
  inversePlanId: StableDiceBoxIdSchema,
  inversePlanSha256: sha256,
  permitId: StableDiceBoxIdSchema,
  claimId: StableDiceBoxIdSchema,
  source: z.literal("terminal-receipt-store-enumerate-manifest"),
  completeForManifest: z.literal(true),
  operations: z.array(stagedInverseReceiptLedgerOperationSchema).max(500),
  observedAt: at,
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict();

export const stagedInverseReceiptLedgerPersistenceStateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  receiptId: StableDiceBoxIdSchema,
  manifestId: StableDiceBoxIdSchema,
  stableId: StableDiceBoxIdSchema,
  idempotencyKey: StableDiceBoxIdSchema,
  permitId: StableDiceBoxIdSchema,
  claimId: StableDiceBoxIdSchema,
  candidateReceiptSha256: sha256.nullable(),
  observedReceiptSha256: sha256.nullable(),
  state: z.enum(["pending", "missing", "unknown", "persisted", "conflict"]),
  authoritativeReread: z.boolean(),
  retryAfter: z.enum(["never", "authoritative-reread"]),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  if (value.state === "pending" && (value.candidateReceiptSha256 !== null || value.observedReceiptSha256 !== null)) context.addIssue({ code: z.ZodIssueCode.custom, message: "A pending inverse receipt has no candidate or observed receipt digest." });
  if (value.state !== "pending" && value.candidateReceiptSha256 === null) context.addIssue({ code: z.ZodIssueCode.custom, message: "A resolved inverse receipt state requires the candidate receipt digest." });
  if (["pending", "missing", "unknown"].includes(value.state) && value.observedReceiptSha256 !== null) context.addIssue({ code: z.ZodIssueCode.custom, message: "An absent or unknown inverse receipt state cannot expose an observed receipt digest." });
  if (["persisted", "conflict"].includes(value.state) && value.observedReceiptSha256 === null) context.addIssue({ code: z.ZodIssueCode.custom, message: "A persisted or conflicting inverse receipt state requires the observed receipt digest." });
  if (value.state === "unknown" && (value.retryAfter !== "authoritative-reread" || !value.authoritativeReread)) context.addIssue({ code: z.ZodIssueCode.custom, message: "Unknown inverse receipt persistence requires authoritative reread before retry." });
  if (value.state !== "unknown" && value.retryAfter !== "never") context.addIssue({ code: z.ZodIssueCode.custom, message: "Known inverse receipt persistence states cannot request automatic retry." });
  if ((value.state === "persisted" || value.state === "conflict") && !value.authoritativeReread) context.addIssue({ code: z.ZodIssueCode.custom, message: "Resolved inverse receipt persistence requires authoritative reread evidence." });
});

export const stagedInverseReceiptAppendObservationSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  candidate: stagedInverseReceiptLedgerEntrySchema,
  writeOutcome: z.enum(["not-attempted", "committed", "unknown"]),
  rereadState: z.enum(["matched", "missing", "conflict", "unknown"]),
  reread: stagedInverseReceiptLedgerEntrySchema.nullable(),
  observedAt: at,
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  const same = value.reread !== null
    && value.reread.receipt.receiptId === value.candidate.receipt.receiptId
    && value.reread.receiptSha256 === value.candidate.receiptSha256;
  if (value.rereadState === "matched" && !same) context.addIssue({ code: z.ZodIssueCode.custom, message: "A matched inverse receipt reread must equal the candidate receipt identity and digest." });
  if ((value.rereadState === "missing" || value.rereadState === "unknown") && value.reread !== null) context.addIssue({ code: z.ZodIssueCode.custom, message: "Missing or unknown inverse receipt rereads cannot expose a receipt." });
  if (value.rereadState === "conflict" && value.reread === null) context.addIssue({ code: z.ZodIssueCode.custom, message: "A conflicting inverse receipt reread must preserve the observed receipt." });
  if (value.rereadState === "conflict" && same) context.addIssue({ code: z.ZodIssueCode.custom, message: "A conflicting inverse receipt reread cannot equal the candidate receipt." });
});

export const stagedInverseReceiptPersistenceResolutionSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  status: z.enum(["persisted", "missing", "unknown", "conflict"]),
  writeOutcome: z.enum(["not-attempted", "committed", "unknown"]),
  persistence: stagedInverseReceiptLedgerPersistenceStateSchema,
  candidate: stagedInverseReceiptLedgerEntrySchema,
  reread: stagedInverseReceiptLedgerEntrySchema.nullable(),
  observedAt: at,
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  if (value.status !== value.persistence.state) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse receipt resolution status must equal its persistence state." });
  }
  if (value.persistence.receiptId !== value.candidate.receipt.receiptId
    || value.persistence.manifestId !== value.candidate.receipt.manifestId
    || value.persistence.stableId !== value.candidate.receipt.stableId
    || value.persistence.idempotencyKey !== value.candidate.receipt.idempotencyKey
    || value.persistence.permitId !== value.candidate.receipt.permitId
    || value.persistence.claimId !== value.candidate.receipt.claimId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse receipt persistence must bind the exact candidate receipt identity." });
  }
  if (value.persistence.candidateReceiptSha256 !== value.candidate.receiptSha256) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse receipt persistence must retain the exact candidate receipt digest." });
  }
  const observedDigest = value.reread?.receiptSha256 ?? null;
  if (value.persistence.observedReceiptSha256 !== observedDigest) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse receipt persistence must retain the authoritative reread digest separately from the candidate digest." });
  }
  const exactReread = value.reread !== null
    && value.reread.receipt.receiptId === value.candidate.receipt.receiptId
    && value.reread.receiptSha256 === value.candidate.receiptSha256;
  if (value.status === "persisted" && !exactReread) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A persisted inverse receipt resolution requires an exact matching authoritative reread." });
  }
  if ((value.status === "missing" || value.status === "unknown") && value.reread !== null) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A missing or unknown inverse receipt resolution cannot expose a reread entry." });
  }
  if (value.status === "conflict" && (value.reread === null || exactReread)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A conflicting inverse receipt resolution must preserve a nonmatching authoritative reread." });
  }
});

export const stagedInverseRecoveryLineageSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  manifestId: StableDiceBoxIdSchema,
  inversePlanId: StableDiceBoxIdSchema,
  inversePlanSha256: sha256,
  permitId: StableDiceBoxIdSchema,
  claimId: StableDiceBoxIdSchema,
  stableId: StableDiceBoxIdSchema,
  idempotencyKey: StableDiceBoxIdSchema,
  unknownReceiptId: StableDiceBoxIdSchema,
  unknownReceiptSha256: sha256,
  recoveredReceiptId: StableDiceBoxIdSchema,
  recoveredReceiptSha256: sha256,
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict();

export type StagedInverseReceiptLedgerEntry = z.infer<typeof stagedInverseReceiptLedgerEntrySchema>;
export type StagedInverseReceiptLedgerSnapshot = z.infer<typeof stagedInverseReceiptLedgerSnapshotSchema>;
export type StagedInverseReceiptLedgerPersistenceState = z.infer<typeof stagedInverseReceiptLedgerPersistenceStateSchema>;
export type StagedInverseReceiptPersistenceResolution = z.infer<typeof stagedInverseReceiptPersistenceResolutionSchema>;
export type StagedInverseRecoveryLineage = z.infer<typeof stagedInverseRecoveryLineageSchema>;

export const stagedInverseReceiptPersistenceIdentitySchema = z.object({
  receiptId: StableDiceBoxIdSchema,
  manifestId: StableDiceBoxIdSchema,
  stableId: StableDiceBoxIdSchema,
  idempotencyKey: StableDiceBoxIdSchema,
  receiptSha256: sha256,
}).strict();

export type StagedInverseReceiptPersistenceIdentity = z.infer<typeof stagedInverseReceiptPersistenceIdentitySchema>;

export interface StagedInverseReceiptPersistence {
  append(entry: StagedInverseReceiptLedgerEntry): Promise<Result<void>>;
  read(identity: StagedInverseReceiptPersistenceIdentity): Promise<Result<unknown>>;
}

export interface StagedInverseReceiptStore {
  persistTerminalReceipt(
    requestInput: unknown,
    manifestInput: unknown,
    permitInput: unknown,
    claimInput: unknown,
    candidateInput: unknown,
  ): Promise<Result<StagedInverseReceiptPersistenceResolution>>;
}

export interface StagedInverseReceiptLedgerStore {
  enumerate(identity: {
    readonly ledgerId: string;
    readonly queryId: string;
    readonly manifestId: string;
    readonly permitId: string;
    readonly claimId: string;
  }): Promise<Result<unknown>>;
  append(entry: StagedInverseReceiptLedgerEntry): Promise<Result<void>>;
  read(identity: StagedInverseReceiptPersistenceIdentity): Promise<Result<unknown>>;
}

function exactEntryIdentity(
  entry: StagedInverseReceiptLedgerEntry,
  request: StagedInverseExecutionInput,
  manifest: StagedInverseExecutionManifest,
  permit: StagedInverseExecutionPermit,
  claim: StagedInversePermitClaimState,
): string[] {
  const receipt = entry.receipt;
  const blockers: string[] = [];
  const operation = manifest.operations.find((candidate) => candidate.stableId === receipt.stableId);
  const expectedReceiptId = deriveStagedInverseTerminalReceiptId(receipt.manifestId, receipt.stableId, receipt.idempotencyKey, receipt.status === "recovered" ? "recovery" : "outcome");
  if (receipt.receiptId !== expectedReceiptId) blockers.push("Inverse receipt ID is not the deterministic identity for its manifest operation and phase.");
  if (receipt.manifestId !== manifest.manifestId || receipt.inversePlanId !== request.inversePlan.inversePlanId || receipt.inversePlanSha256 !== request.authorization.inversePlanSha256) blockers.push("Inverse receipt does not bind the exact manifest and authorized plan digest.");
  if (receipt.permitId !== permit.permitId || receipt.claimId !== claim.claimId) blockers.push("Inverse receipt does not bind the current permit and claim.");
  if (!operation) {
    blockers.push("Inverse receipt does not match one exact manifest operation.");
    return blockers;
  }
  if (receipt.sequence !== operation.sequence || receipt.operationKind !== operation.kind || receipt.idempotencyKey !== operation.idempotencyKey) blockers.push("Inverse receipt does not match one exact manifest operation.");
  const planOperation = request.inversePlan.operations.find((candidate) => candidate.stableId === operation.stableId);
  if (!planOperation) {
    blockers.push("Inverse receipt operation is absent from the authorized plan.");
  } else {
    try {
      validateStagedInverseOperationReadback(receipt.readback, planOperation, request.inversePlan.inversePlanId, request.authorization.inversePlanSha256, {
        manifestId: manifest.manifestId,
        sequence: operation.sequence,
        stableId: operation.stableId,
        idempotencyKey: operation.idempotencyKey,
        operationSha256: operation.operationSha256,
      });
    } catch (error) {
      blockers.push(error instanceof Error ? error.message : "Inverse receipt reread is invalid.");
    }
  }
  return blockers;
}

async function validateReceiptContext(
  requestInput: unknown,
  manifestInput: unknown,
  permitInput: unknown,
  claimInput: unknown,
): Promise<{ readonly request: StagedInverseExecutionInput; readonly manifest: StagedInverseExecutionManifest; readonly permit: StagedInverseExecutionPermit; readonly claim: StagedInversePermitClaimState }> {
  const { request, manifest } = await validateExactStagedInverseExecutionManifest(requestInput, manifestInput);
  const permit = stagedInverseExecutionPermitSchema.parse(permitInput);
  if (!await verifyStagedInverseExecutionPermit(permit, request, manifest)) throw new Error("Inverse receipt ledger permit digest or identity is invalid.");
  const claim = stagedInversePermitClaimStateSchema.parse(claimInput);
  if (claim.state !== "claimed" || !claim.authoritativeReread) throw new Error("Inverse receipt ledger requires an authoritative claimed permit reread.");
  if (claim.permitId !== permit.permitId || claim.permitSha256 !== permit.permitSha256 || claim.manifestId !== manifest.manifestId || claim.activeGmUserId !== request.activeGmUserId || claim.idempotencyKey !== request.idempotencyKey) {
    throw new Error("Inverse receipt ledger claim does not bind the exact permit, manifest, request idempotency, and active GM.");
  }
  return { request, manifest, permit, claim };
}

/** Validates a store-enumerated, manifest-scoped receipt snapshot and every canonical receipt hash. */
export async function validateStagedInverseReceiptLedgerSnapshot(
  requestInput: unknown,
  manifestInput: unknown,
  permitInput: unknown,
  claimInput: unknown,
  snapshotInput: unknown,
): Promise<{ readonly request: StagedInverseExecutionInput; readonly manifest: StagedInverseExecutionManifest; readonly permit: StagedInverseExecutionPermit; readonly claim: StagedInversePermitClaimState; readonly snapshot: StagedInverseReceiptLedgerSnapshot }> {
  const context = await validateReceiptContext(requestInput, manifestInput, permitInput, claimInput);
  const snapshot = stagedInverseReceiptLedgerSnapshotSchema.parse(snapshotInput);
  if (snapshot.ledgerId !== deriveStagedInverseReceiptLedgerId(snapshot.manifestId, snapshot.permitId, snapshot.claimId)
    || snapshot.queryId !== deriveStagedInverseReceiptQueryId(snapshot.manifestId, snapshot.permitId, snapshot.claimId)
    || snapshot.manifestId !== context.manifest.manifestId
    || snapshot.inversePlanId !== context.request.inversePlan.inversePlanId
    || snapshot.inversePlanSha256 !== context.request.authorization.inversePlanSha256
    || snapshot.permitId !== context.permit.permitId
    || snapshot.claimId !== context.claim.claimId) {
    throw new Error("Inverse receipt ledger snapshot is not bound to the exact manifest, plan, permit, or claim.");
  }
  if (snapshot.operations.length !== context.manifest.reverseDependencyOrder.length) {
    throw new Error("Inverse receipt ledger must enumerate every manifest operation exactly once.");
  }
  const seenOperations = new Set<string>();
  for (let ledgerSequence = 0; ledgerSequence < snapshot.operations.length; ledgerSequence += 1) {
    const operationEntry = snapshot.operations[ledgerSequence]!;
    const expectedStableId = context.manifest.reverseDependencyOrder[ledgerSequence];
    const manifestOperation = context.manifest.operations.find((candidate) => candidate.stableId === operationEntry.stableId);
    if (operationEntry.ledgerSequence !== ledgerSequence || operationEntry.stableId !== expectedStableId || !manifestOperation || operationEntry.operationKind !== manifestOperation.kind || operationEntry.idempotencyKey !== manifestOperation.idempotencyKey) {
      throw new Error("Inverse receipt ledger operation coverage or order is not the exact manifest projection.");
    }
    if (seenOperations.has(operationEntry.stableId)) throw new Error("Duplicate inverse receipt ledger operation identities are ambiguous.");
    seenOperations.add(operationEntry.stableId);
    const seenReceipts = new Set<string>();
    for (let receiptIndex = 0; receiptIndex < operationEntry.receipts.length; receiptIndex += 1) {
      const entry = operationEntry.receipts[receiptIndex]!;
      if (await sha256FoundryIr(canonicalizeFoundryIr(entry.receipt)) !== entry.receiptSha256) throw new Error("Inverse receipt ledger entry digest does not match its canonical receipt.");
      const blockers = exactEntryIdentity(entry, context.request, context.manifest, context.permit, context.claim);
      if (blockers.length > 0) throw new Error(blockers[0]!);
      if (seenReceipts.has(entry.receipt.receiptId)) throw new Error("Duplicate inverse receipt ledger receipt identities are ambiguous.");
      seenReceipts.add(entry.receipt.receiptId);
      if (entry.receipt.status === "recovered") {
        const predecessor = operationEntry.receipts[receiptIndex - 1];
        if (!predecessor || predecessor.receipt.status !== "unknown" || predecessor.receipt.receiptId !== entry.receipt.recoveredFromReceiptId || predecessor.receiptSha256 !== entry.receipt.recoveredFromReceiptSha256) {
          throw new Error("Recovered inverse receipt must reference the immediately preceding unknown receipt and digest.");
        }
      }
    }
  }
  return { ...context, snapshot };
}

/** Resolves append-then-reread observations without writing or retrying anything. */
export function resolveStagedInverseReceiptAppendObservation(input: unknown): StagedInverseReceiptPersistenceResolution {
  const observation = stagedInverseReceiptAppendObservationSchema.parse(input);
  const status = observation.rereadState === "matched" ? "persisted" : observation.rereadState === "missing" ? "missing" : observation.rereadState === "conflict" ? "conflict" : "unknown";
  const observedDigest = status === "persisted" || status === "conflict" ? observation.reread?.receiptSha256 ?? null : null;
  const persistence = stagedInverseReceiptLedgerPersistenceStateSchema.parse({
    schemaVersion: "0.1.0",
    receiptId: observation.candidate.receipt.receiptId,
    manifestId: observation.candidate.receipt.manifestId,
    stableId: observation.candidate.receipt.stableId,
    idempotencyKey: observation.candidate.receipt.idempotencyKey,
    permitId: observation.candidate.receipt.permitId,
    claimId: observation.candidate.receipt.claimId,
    candidateReceiptSha256: observation.candidate.receiptSha256,
    observedReceiptSha256: observedDigest,
    state: status,
    authoritativeReread: true,
    retryAfter: status === "unknown" ? "authoritative-reread" : "never",
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  });
  return stagedInverseReceiptPersistenceResolutionSchema.parse({
    schemaVersion: "0.1.0",
    status,
    writeOutcome: observation.writeOutcome,
    persistence,
    candidate: observation.candidate,
    reread: observation.reread,
    observedAt: observation.observedAt,
    authoritativeReread: true,
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  });
}

type StagedInverseReceiptReadObservation =
  | { readonly state: "missing" | "unknown"; readonly entry: null }
  | { readonly state: "entry"; readonly entry: StagedInverseReceiptLedgerEntry };

function persistenceFailure(
  code: "INVALID_INPUT" | "UNKNOWN_OUTCOME",
  message: string,
  retry: "never" | "after-reread" = "never",
): Result<never> {
  return { ok: false, error: { code, message, retry } };
}

function persistenceSuccess<T>(value: T): Result<T> {
  return { ok: true, value };
}

function sameReceiptEntry(left: StagedInverseReceiptLedgerEntry, right: StagedInverseReceiptLedgerEntry): boolean {
  return left.receipt.receiptId === right.receipt.receiptId
    && left.receipt.manifestId === right.receipt.manifestId
    && left.receipt.stableId === right.receipt.stableId
    && left.receipt.idempotencyKey === right.receipt.idempotencyKey
    && left.receiptSha256 === right.receiptSha256;
}

/** Reads one exact receipt identity and treats malformed/unavailable storage as outcome-unknown. */
async function readStagedInverseReceipt(
  persistence: StagedInverseReceiptPersistence,
  identity: StagedInverseReceiptPersistenceIdentity,
): Promise<StagedInverseReceiptReadObservation> {
  let result: Result<unknown>;
  try {
    result = await persistence.read(identity);
  } catch {
    return { state: "unknown", entry: null };
  }
  if (!result.ok || result.value === null) return result.ok ? { state: "missing", entry: null } : { state: "unknown", entry: null };
  const entry = stagedInverseReceiptLedgerEntrySchema.safeParse(result.value);
  if (!entry.success) return { state: "unknown", entry: null };
  if (await sha256FoundryIr(canonicalizeFoundryIr(entry.data.receipt)) !== entry.data.receiptSha256) return { state: "unknown", entry: null };
  return { state: "entry", entry: entry.data };
}

/**
 * Serialized terminal-receipt persistence boundary. It pre-reads the deterministic receipt,
 * appends at most once, and always performs one authoritative post-append reread. It never
 * retries, invokes an adapter, dispatches Foundry work, or mutates runtime state.
 */
export function createStagedInverseReceiptStore(persistence: StagedInverseReceiptPersistence): StagedInverseReceiptStore {
  let queue: Promise<unknown> = Promise.resolve();
  const serialized = <T>(operation: () => Promise<Result<T>>): Promise<Result<T>> => {
    const next = queue.then(operation, operation);
    queue = next.then(() => undefined, () => undefined);
    return next;
  };

  return {
    persistTerminalReceipt: (requestInput, manifestInput, permitInput, claimInput, candidateInput) => serialized(async () => {
      let context: Awaited<ReturnType<typeof validateReceiptContext>>;
      try {
        context = await validateReceiptContext(requestInput, manifestInput, permitInput, claimInput);
      } catch {
        return persistenceFailure("INVALID_INPUT", "Inverse terminal receipt persistence context is invalid; no append is authorized.");
      }

      const candidateResult = stagedInverseReceiptLedgerEntrySchema.safeParse(candidateInput);
      if (!candidateResult.success) return persistenceFailure("INVALID_INPUT", "Inverse terminal receipt candidate is malformed; no append is authorized.");
      const candidate = candidateResult.data;
      if (await sha256FoundryIr(canonicalizeFoundryIr(candidate.receipt)) !== candidate.receiptSha256) {
        return persistenceFailure("INVALID_INPUT", "Inverse terminal receipt candidate digest does not match its canonical receipt; no append is authorized.");
      }
      const blockers = exactEntryIdentity(candidate, context.request, context.manifest, context.permit, context.claim);
      if (blockers.length > 0) return persistenceFailure("INVALID_INPUT", blockers[0]!);

      const identity = stagedInverseReceiptPersistenceIdentitySchema.parse({
        receiptId: candidate.receipt.receiptId,
        manifestId: candidate.receipt.manifestId,
        stableId: candidate.receipt.stableId,
        idempotencyKey: candidate.receipt.idempotencyKey,
        receiptSha256: candidate.receiptSha256,
      });
      const observe = (writeOutcome: "not-attempted" | "committed" | "unknown", reread: StagedInverseReceiptReadObservation) => {
        const rereadState = reread.state === "entry"
          ? sameReceiptEntry(candidate, reread.entry) ? "matched" : "conflict"
          : reread.state;
        return resolveStagedInverseReceiptAppendObservation({
          schemaVersion: "0.1.0",
          candidate,
          writeOutcome,
          rereadState,
          reread: reread.state === "entry" && (rereadState === "matched" || rereadState === "conflict") ? reread.entry : null,
          observedAt: candidate.receipt.observedAt,
          authoritativeReread: true,
          foreignStatePreserved: true,
          execution: "not-implemented",
          readyClaim: false,
        });
      };

      const before = await readStagedInverseReceipt(persistence, identity);
      if (before.state === "unknown") return persistenceSuccess(observe("not-attempted", before));
      if (before.state === "entry") return persistenceSuccess(observe("not-attempted", before));

      let writeOutcome: "committed" | "unknown" = "committed";
      try {
        const appendResult = await persistence.append(candidate);
        if (!appendResult.ok) writeOutcome = "unknown";
      } catch {
        writeOutcome = "unknown";
      }
      const after = await readStagedInverseReceipt(persistence, identity);
      return persistenceSuccess(observe(writeOutcome, after));
    }),
  };
}

/** Verifies that a recovered terminal receipt is derived from one exact persisted unknown receipt. */
export async function validateStagedInverseRecoveryLineage(
  requestInput: unknown,
  manifestInput: unknown,
  permitInput: unknown,
  claimInput: unknown,
  unknownEntryInput: unknown,
  recoveredEntryInput: unknown,
): Promise<StagedInverseRecoveryLineage> {
  const context = await validateReceiptContext(requestInput, manifestInput, permitInput, claimInput);
  const unknownEntry = stagedInverseReceiptLedgerEntrySchema.parse(unknownEntryInput);
  const recoveredEntry = stagedInverseReceiptLedgerEntrySchema.parse(recoveredEntryInput);
  for (const entry of [unknownEntry, recoveredEntry]) {
    if (await sha256FoundryIr(canonicalizeFoundryIr(entry.receipt)) !== entry.receiptSha256) throw new Error("Inverse recovery receipt digest does not match its canonical receipt.");
    const blockers = exactEntryIdentity(entry, context.request, context.manifest, context.permit, context.claim);
    if (blockers.length > 0) throw new Error(blockers[0]!);
  }
  const unknown = unknownEntry.receipt;
  const recovered = recoveredEntry.receipt;
  if (unknown.status !== "unknown" || unknown.dispatchStatus !== "unknown" || unknown.recoveredFromUnknown || unknown.recoveredFromReceiptId !== null || unknown.recoveredFromReceiptSha256 !== null || unknown.readback.status !== "unknown") {
    throw new Error("Inverse recovery lineage requires an exact prior unknown terminal receipt.");
  }
  if (recovered.status !== "recovered" || recovered.dispatchStatus !== "unknown" || !recovered.recoveredFromUnknown || recovered.recoveredFromReceiptId !== unknown.receiptId || recovered.recoveredFromReceiptSha256 !== unknownEntry.receiptSha256 || recovered.readback.status === "unknown" || recovered.retryState.state !== "retry-forbidden") {
    throw new Error("Inverse recovery receipt does not prove the exact prior unknown operation lineage.");
  }
  return stagedInverseRecoveryLineageSchema.parse({
    schemaVersion: "0.1.0",
    manifestId: context.manifest.manifestId,
    inversePlanId: context.request.inversePlan.inversePlanId,
    inversePlanSha256: context.request.authorization.inversePlanSha256,
    permitId: context.permit.permitId,
    claimId: context.claim.claimId,
    stableId: unknown.stableId,
    idempotencyKey: unknown.idempotencyKey,
    unknownReceiptId: unknown.receiptId,
    unknownReceiptSha256: unknownEntry.receiptSha256,
    recoveredReceiptId: recovered.receiptId,
    recoveredReceiptSha256: recoveredEntry.receiptSha256,
    authoritativeReread: true,
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  });
}
