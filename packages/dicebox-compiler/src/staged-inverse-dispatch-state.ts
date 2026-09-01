import { z } from "zod";
import { createStableDiceBoxId, type Result, RuntimeBindingSchema, StableDiceBoxIdSchema } from "@dicebox/core";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import { foundryInverseOperationSchema } from "./foundry-inverse-plan.js";
import {
  stagedInverseExecutionManifestSchema,
  verifyStagedInverseExecutionManifest,
  type StagedInverseExecutionManifest,
} from "./staged-inverse-execution-manifest.js";
import { validateAuthorizedStagedInverseExecutionInput, type StagedInverseExecutionInput } from "./staged-inverse-execution-contract.js";

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const at = z.string().datetime({ offset: true });
const inverseKinds = ["delete-owned-create", "restore-update-preimage"] as const;

export const stagedInverseOperationSelectionSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  manifestId: StableDiceBoxIdSchema,
  inversePlanId: StableDiceBoxIdSchema,
  sequence: z.number().int().nonnegative(),
  stableId: StableDiceBoxIdSchema,
  kind: z.enum(inverseKinds),
  idempotencyKey: StableDiceBoxIdSchema,
  operationSha256: sha256,
  dispatchOrder: z.literal("reverse-dependency-order"),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict();

export type StagedInverseOperationSelection = z.infer<typeof stagedInverseOperationSelectionSchema>;

function exactManifestOperations(input: StagedInverseExecutionInput, manifest: StagedInverseExecutionManifest): Promise<boolean> {
  const expected = [...input.inversePlan.operations]
    .sort((left, right) => left.stableId.localeCompare(right.stableId))
    .map(async (operation, sequence) => ({
      sequence,
      stableId: operation.stableId,
      kind: operation.kind,
      idempotencyKey: createStableDiceBoxId("inverse-idempotency", `${input.inversePlan.inversePlanId.split(":").at(-1)}-${String(sequence).padStart(3, "0")}`),
      operationSha256: await sha256FoundryIr(canonicalizeFoundryIr(operation)),
    }));
  return Promise.all(expected).then((rows) => rows.length === manifest.operations.length && rows.every((row, index) => {
    const actual = manifest.operations[index];
    return actual?.sequence === row.sequence
      && actual.stableId === row.stableId
      && actual.kind === row.kind
      && actual.idempotencyKey === row.idempotencyKey
      && actual.operationSha256 === row.operationSha256;
  }));
}

/** Verifies that the signed observation manifest is an exact projection of the authorized plan. */
export async function validateExactStagedInverseExecutionManifest(
  requestInput: unknown,
  manifestInput: unknown,
): Promise<{ readonly request: StagedInverseExecutionInput; readonly manifest: StagedInverseExecutionManifest }> {
  const request = await validateAuthorizedStagedInverseExecutionInput(requestInput);
  const manifest = stagedInverseExecutionManifestSchema.parse(manifestInput);
  if (!await verifyStagedInverseExecutionManifest(manifest)) throw new Error("Inverse manifest digest is invalid.");
  if (manifest.inversePlanId !== request.inversePlan.inversePlanId || manifest.authorizationId !== request.authorization.authorizationId) {
    throw new Error("Inverse manifest must bind the exact authorized plan and authorization.");
  }
  if (manifest.reverseDependencyOrder.length !== request.inversePlan.reverseDependencyOrder.length
    || manifest.reverseDependencyOrder.some((stableId, index) => stableId !== request.inversePlan.reverseDependencyOrder[index])) {
    throw new Error("Inverse manifest reverse dependency order must equal the authorized plan.");
  }
  if (!await exactManifestOperations(request, manifest)) {
    throw new Error("Inverse manifest operations must exactly match the authorized plan payloads.");
  }
  return { request, manifest };
}

/** Pure selection only: selects the first exact operation in the authorized reverse dependency order. */
export async function selectStagedInverseOperation(requestInput: unknown, manifestInput: unknown): Promise<StagedInverseOperationSelection> {
  const { request, manifest } = await validateExactStagedInverseExecutionManifest(requestInput, manifestInput);
  const stableId = manifest.reverseDependencyOrder[0];
  if (!stableId) throw new Error("Inverse reverse dependency order is empty.");
  const operation = manifest.operations.find((candidate) => candidate.stableId === stableId);
  if (!operation) throw new Error("Inverse selected operation is not present in the exact manifest.");
  if (!request.inversePlan.operations.some((candidate) => candidate.stableId === operation.stableId)) throw new Error("Inverse selected operation is not present in the exact plan.");
  return stagedInverseOperationSelectionSchema.parse({
    schemaVersion: "0.1.0",
    manifestId: manifest.manifestId,
    inversePlanId: manifest.inversePlanId,
    sequence: operation.sequence,
    stableId: operation.stableId,
    kind: operation.kind,
    idempotencyKey: operation.idempotencyKey,
    operationSha256: operation.operationSha256,
    dispatchOrder: "reverse-dependency-order",
    execution: "not-implemented",
    readyClaim: false,
  });
}

const inverseReadbackCommon = {
  schemaVersion: z.literal("0.1.0"),
  inversePlanId: StableDiceBoxIdSchema,
  inversePlanSha256: sha256,
  manifestId: StableDiceBoxIdSchema,
  sequence: z.number().int().nonnegative(),
  stableId: StableDiceBoxIdSchema,
  idempotencyKey: StableDiceBoxIdSchema,
  operationSha256: sha256,
  observedAt: at,
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
} as const;

export const stagedInverseDeleteReadbackSchema = z.object({
  ...inverseReadbackCommon,
  operationKind: z.literal("delete-owned-create"),
  status: z.enum(["owned-absent", "foreign-conflict", "unknown"]),
  binding: RuntimeBindingSchema.nullable(),
}).strict().superRefine((value, context) => {
  if (value.status === "owned-absent" && value.binding !== null) context.addIssue({ code: z.ZodIssueCode.custom, message: "A confirmed inverse delete must reread exact owned absence." });
  if (value.status === "foreign-conflict" && value.binding === null) context.addIssue({ code: z.ZodIssueCode.custom, message: "A foreign inverse delete conflict must preserve the observed binding." });
});

export type StagedInverseDeleteReadback = z.infer<typeof stagedInverseDeleteReadbackSchema>;

export const stagedInverseRestoreReadbackSchema = z.object({
  ...inverseReadbackCommon,
  operationKind: z.literal("restore-update-preimage"),
  status: z.enum(["preimage-matched", "not-found", "foreign-conflict", "unknown"]),
  binding: RuntimeBindingSchema.nullable(),
  expectedPreimageSha256: sha256,
  observedPayloadSha256: sha256.nullable(),
}).strict().superRefine((value, context) => {
  if (value.status === "preimage-matched" && value.binding === null) context.addIssue({ code: z.ZodIssueCode.custom, message: "A confirmed inverse restore must reread its exact runtime binding." });
  if (value.status === "preimage-matched" && value.observedPayloadSha256 !== value.expectedPreimageSha256) context.addIssue({ code: z.ZodIssueCode.custom, message: "A confirmed inverse restore must reread a payload digest equal to the exact expected preimage digest." });
  if (value.status === "not-found" && (value.binding !== null || value.observedPayloadSha256 !== null)) context.addIssue({ code: z.ZodIssueCode.custom, message: "A not-found inverse restore must reread no runtime binding or payload digest." });
  if (value.status === "foreign-conflict" && value.binding === null) context.addIssue({ code: z.ZodIssueCode.custom, message: "A foreign inverse restore conflict must preserve the observed binding." });
  if (value.status === "unknown" && value.observedPayloadSha256 !== null) context.addIssue({ code: z.ZodIssueCode.custom, message: "An unknown inverse restore cannot assert an observed payload digest." });
});

export type StagedInverseRestoreReadback = z.infer<typeof stagedInverseRestoreReadbackSchema>;

export const stagedInverseOperationReadbackSchema = z.union([stagedInverseDeleteReadbackSchema, stagedInverseRestoreReadbackSchema]);
export type StagedInverseOperationReadback = z.infer<typeof stagedInverseOperationReadbackSchema>;

export interface StagedInverseOperationReadbackExpectation {
  readonly manifestId: string;
  readonly sequence: number;
  readonly stableId: string;
  readonly idempotencyKey: string;
  readonly operationSha256: string;
}

/** Binds an authoritative inverse reread to the exact plan operation and expected preimage. */
export function validateStagedInverseOperationReadback(
  input: unknown,
  operationInput: unknown,
  inversePlanId: string,
  inversePlanSha256: string,
  expectation: StagedInverseOperationReadbackExpectation,
): StagedInverseOperationReadback {
  const readback = stagedInverseOperationReadbackSchema.parse(input);
  const operation = foundryInverseOperationSchema.parse(operationInput);
  if (readback.inversePlanId !== StableDiceBoxIdSchema.parse(inversePlanId)
    || readback.inversePlanSha256 !== sha256.parse(inversePlanSha256)
    || readback.manifestId !== StableDiceBoxIdSchema.parse(expectation.manifestId)
    || readback.sequence !== expectation.sequence
    || readback.stableId !== operation.stableId
    || readback.stableId !== StableDiceBoxIdSchema.parse(expectation.stableId)
    || readback.idempotencyKey !== StableDiceBoxIdSchema.parse(expectation.idempotencyKey)
    || readback.operationSha256 !== sha256.parse(expectation.operationSha256)
    || readback.operationKind !== operation.kind) {
    throw new Error("Inverse reread must bind the exact inverse plan, operation, and digest.");
  }
  if (operation.kind === "restore-update-preimage" && readback.operationKind === "restore-update-preimage" && readback.expectedPreimageSha256 !== operation.preimageSha256) {
    throw new Error("Inverse restore reread must match the exact authorized preimage digest.");
  }
  return readback;
}

export const stagedInverseRetryStateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operationKind: z.enum(inverseKinds),
  stableId: StableDiceBoxIdSchema,
  state: z.enum(["retry-forbidden", "reread-required"]),
  reason: z.enum(["owned-absence-confirmed", "preimage-confirmed", "not-found", "foreign-conflict", "unknown-outcome"]),
  authoritativeReread: z.literal(true),
  retryAfter: z.enum(["never", "authoritative-reread"]),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  if (value.reason === "unknown-outcome" && (value.state !== "reread-required" || value.retryAfter !== "authoritative-reread")) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Unknown inverse outcomes require authoritative reread before retry." });
  }
  if (value.reason !== "unknown-outcome" && (value.state !== "retry-forbidden" || value.retryAfter !== "never")) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Known inverse outcomes are terminal and cannot be retried automatically." });
  }
});

export type StagedInverseRetryState = z.infer<typeof stagedInverseRetryStateSchema>;

/** Pure readback classification; it never retries or invokes a runtime dependency. */
export function classifyStagedInverseRetryState(input: unknown): StagedInverseRetryState {
  const readback = stagedInverseOperationReadbackSchema.parse(input);
  const unknown = readback.status === "unknown";
  const reason = readback.operationKind === "delete-owned-create"
    ? readback.status === "owned-absent" ? "owned-absence-confirmed" : readback.status === "foreign-conflict" ? "foreign-conflict" : "unknown-outcome"
    : readback.status === "preimage-matched" ? "preimage-confirmed" : readback.status === "not-found" ? "not-found" : readback.status === "foreign-conflict" ? "foreign-conflict" : "unknown-outcome";
  return stagedInverseRetryStateSchema.parse({
    schemaVersion: "0.1.0",
    operationKind: readback.operationKind,
    stableId: readback.stableId,
    state: unknown ? "reread-required" : "retry-forbidden",
    reason,
    authoritativeReread: true,
    retryAfter: unknown ? "authoritative-reread" : "never",
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  });
}

export const stagedInverseTerminalReceiptSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  receiptId: StableDiceBoxIdSchema,
  manifestId: StableDiceBoxIdSchema,
  inversePlanId: StableDiceBoxIdSchema,
  inversePlanSha256: sha256,
  permitId: StableDiceBoxIdSchema,
  claimId: StableDiceBoxIdSchema,
  sequence: z.number().int().nonnegative(),
  stableId: StableDiceBoxIdSchema,
  operationKind: z.enum(inverseKinds),
  idempotencyKey: StableDiceBoxIdSchema,
  dispatchStatus: z.enum(["accepted", "unknown", "blocked"]),
  status: z.enum(["blocked", "unknown", "committed", "recovered"]),
  recoveredFromUnknown: z.boolean(),
  recoveredFromReceiptId: StableDiceBoxIdSchema.nullable(),
  recoveredFromReceiptSha256: sha256.nullable(),
  readback: stagedInverseOperationReadbackSchema,
  retryState: stagedInverseRetryStateSchema,
  blockers: z.array(z.string().min(1)).max(100),
  receiptPersistence: z.literal("terminal"),
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
  observedAt: at,
}).strict().superRefine((value, context) => {
  if (value.operationKind !== value.readback.operationKind || value.operationKind !== value.retryState.operationKind || value.stableId !== value.readback.stableId || value.stableId !== value.retryState.stableId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse terminal receipt must bind one exact operation, reread, and retry state." });
  }
  if (value.inversePlanId !== value.readback.inversePlanId || value.inversePlanSha256 !== value.readback.inversePlanSha256) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse terminal receipt must bind the exact reread plan and digest." });
  }
  if (value.readback.status === "unknown" && (value.status !== "unknown" || value.dispatchStatus !== "unknown")) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Unknown inverse reread requires unknown terminal and dispatch status." });
  }
  if (value.dispatchStatus === "unknown" && !["unknown", "recovered"].includes(value.status)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Unknown inverse dispatch status requires unknown or recovered terminal status." });
  }
  if ((value.readback.status === "foreign-conflict" || value.readback.status === "not-found") && value.status !== "blocked") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Foreign inverse reread requires blocked terminal status." });
  }
  if ((value.readback.status === "owned-absent" || value.readback.status === "preimage-matched") && !["committed", "recovered"].includes(value.status)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A matching inverse reread requires committed or recovered terminal status." });
  }
  if (value.status === "recovered" && (!value.recoveredFromUnknown || value.dispatchStatus !== "unknown")) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Recovered inverse status requires a prior unknown operation outcome." });
  }
  if (value.status === "recovered" && value.recoveredFromReceiptId === null) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Recovered inverse status requires the exact prior unknown receipt identity." });
  }
  if (value.status === "recovered" && value.recoveredFromReceiptSha256 === null) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Recovered inverse status requires the exact prior unknown receipt digest." });
  }
  if (value.status === "committed" && value.recoveredFromUnknown) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Committed inverse status cannot claim recovery from an unknown outcome." });
  }
  if (value.status === "committed" && value.recoveredFromReceiptId !== null) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Committed inverse status cannot carry a recovery receipt identity." });
  }
  if (value.status !== "recovered" && (value.recoveredFromReceiptId !== null || value.recoveredFromReceiptSha256 !== null)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Only recovered inverse status may carry a recovery receipt identity or digest." });
  }
});

export type StagedInverseTerminalReceipt = z.infer<typeof stagedInverseTerminalReceiptSchema>;

export interface StagedInverseTerminalReceiptPersistence {
  append(receipt: StagedInverseTerminalReceipt): Promise<Result<void>>;
  read(receiptId: string): Promise<Result<StagedInverseTerminalReceipt | null>>;
}

export const stagedInverseReceiptPersistenceStateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  receiptId: StableDiceBoxIdSchema,
  manifestId: StableDiceBoxIdSchema,
  stableId: StableDiceBoxIdSchema,
  idempotencyKey: StableDiceBoxIdSchema,
  state: z.enum(["pending", "unknown", "persisted", "conflict"]),
  authoritativeReread: z.boolean(),
  retryAfter: z.enum(["never", "authoritative-reread"]),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  if (value.state === "unknown" && (value.retryAfter !== "authoritative-reread" || !value.authoritativeReread)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Uncertain inverse receipt persistence requires authoritative reread before retry." });
  }
  if (value.state !== "unknown" && value.retryAfter !== "never") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Known inverse receipt persistence states cannot request an automatic retry." });
  }
  if (value.state === "persisted" && !value.authoritativeReread) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Persisted inverse receipt state requires authoritative reread evidence." });
  }
  if (value.state === "conflict" && !value.authoritativeReread) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Conflicting inverse receipt state requires authoritative reread evidence." });
  }
});

export type StagedInverseReceiptPersistenceState = z.infer<typeof stagedInverseReceiptPersistenceStateSchema>;

export interface StagedInverseTerminalReceiptStore {
  append(receipt: StagedInverseTerminalReceipt): Promise<Result<void>>;
  read(identity: {
    readonly receiptId: string;
    readonly manifestId: string;
    readonly stableId: string;
    readonly idempotencyKey: string;
  }): Promise<Result<StagedInverseTerminalReceipt | null>>;
}

export const stagedInverseOperationSelectionResultSchema = z.union([
  z.object({
    schemaVersion: z.literal("0.1.0"),
    status: z.literal("selected"),
    selection: stagedInverseOperationSelectionSchema,
    precedingStableIds: z.array(StableDiceBoxIdSchema),
    execution: z.literal("not-implemented"),
    readyClaim: z.literal(false),
  }).strict(),
  z.object({
    schemaVersion: z.literal("0.1.0"),
    status: z.literal("complete"),
    execution: z.literal("not-implemented"),
    readyClaim: z.literal(false),
  }).strict(),
  z.object({
    schemaVersion: z.literal("0.1.0"),
    status: z.literal("blocked"),
    blockers: z.array(z.string().min(1)).min(1).max(100),
    execution: z.literal("not-implemented"),
    readyClaim: z.literal(false),
  }).strict(),
]);

export type StagedInverseOperationSelectionResult = z.infer<typeof stagedInverseOperationSelectionResultSchema>;

function manifestOperation(manifest: StagedInverseExecutionManifest, stableId: string) {
  return manifest.operations.find((operation) => operation.stableId === stableId);
}

/** Pure scheduling contract: predecessor receipts must be terminal before the next inverse operation is selected. */
export async function selectNextStagedInverseOperation(
  requestInput: unknown,
  manifestInput: unknown,
  receiptsInput: unknown,
): Promise<StagedInverseOperationSelectionResult> {
  const { request, manifest } = await validateExactStagedInverseExecutionManifest(requestInput, manifestInput);
  const receipts = z.array(stagedInverseTerminalReceiptSchema).max(500).parse(receiptsInput);
  const byStableId = new Map<string, StagedInverseTerminalReceipt>();
  for (const receipt of receipts) {
    if (receipt.manifestId !== manifest.manifestId || receipt.inversePlanId !== request.inversePlan.inversePlanId || receipt.inversePlanSha256 !== request.authorization.inversePlanSha256) {
      return { schemaVersion: "0.1.0", status: "blocked", blockers: ["Inverse receipt is bound to a different plan or manifest."], execution: "not-implemented", readyClaim: false };
    }
    const operation = manifestOperation(manifest, receipt.stableId);
    if (!operation || operation.sequence !== receipt.sequence || operation.kind !== receipt.operationKind || operation.idempotencyKey !== receipt.idempotencyKey) {
      return { schemaVersion: "0.1.0", status: "blocked", blockers: ["Inverse receipt does not match one exact manifest operation."], execution: "not-implemented", readyClaim: false };
    }
    const planOperation = request.inversePlan.operations.find((candidate) => candidate.stableId === receipt.stableId);
    if (!planOperation) return { schemaVersion: "0.1.0", status: "blocked", blockers: ["Inverse receipt operation is absent from the authorized plan."], execution: "not-implemented", readyClaim: false };
    try {
      validateStagedInverseOperationReadback(receipt.readback, planOperation, request.inversePlan.inversePlanId, request.authorization.inversePlanSha256, {
        manifestId: manifest.manifestId,
        sequence: operation.sequence,
        stableId: operation.stableId,
        idempotencyKey: operation.idempotencyKey,
        operationSha256: operation.operationSha256,
      });
    } catch (error) {
      return { schemaVersion: "0.1.0", status: "blocked", blockers: [error instanceof Error ? error.message : "Inverse receipt reread is invalid."], execution: "not-implemented", readyClaim: false };
    }
    if (byStableId.has(receipt.stableId)) return { schemaVersion: "0.1.0", status: "blocked", blockers: ["Duplicate inverse terminal receipts are ambiguous."], execution: "not-implemented", readyClaim: false };
    byStableId.set(receipt.stableId, receipt);
    if (receipt.status === "blocked" || receipt.status === "unknown") {
      return { schemaVersion: "0.1.0", status: "blocked", blockers: [`Inverse operation ${receipt.stableId} is ${receipt.status}; reread/recovery is required before selection.`], execution: "not-implemented", readyClaim: false };
    }
  }
  for (let index = 0; index < manifest.reverseDependencyOrder.length; index += 1) {
    const stableId = manifest.reverseDependencyOrder[index]!;
    const receipt = byStableId.get(stableId);
    if (!receipt) {
      const operation = manifestOperation(manifest, stableId);
      if (!operation) return { schemaVersion: "0.1.0", status: "blocked", blockers: ["Reverse dependency order references no manifest operation."], execution: "not-implemented", readyClaim: false };
      return { schemaVersion: "0.1.0", status: "selected", selection: stagedInverseOperationSelectionSchema.parse({ schemaVersion: "0.1.0", manifestId: manifest.manifestId, inversePlanId: manifest.inversePlanId, sequence: operation.sequence, stableId: operation.stableId, kind: operation.kind, idempotencyKey: operation.idempotencyKey, operationSha256: operation.operationSha256, dispatchOrder: "reverse-dependency-order", execution: "not-implemented", readyClaim: false }), precedingStableIds: manifest.reverseDependencyOrder.slice(0, index), execution: "not-implemented", readyClaim: false };
    }
  }
  return { schemaVersion: "0.1.0", status: "complete", execution: "not-implemented", readyClaim: false };
}
