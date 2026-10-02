import { z } from "zod";
import {
  RuntimeProfileSchema,
  RuntimeBindingSchema,
  StableDiceBoxIdSchema,
  createRuntimeFingerprint,
  createRuntimeProbeReceipt,
  type Result,
  type RuntimeBinding,
  type RuntimeProfile,
} from "@dicebox/core";
import {
  approvalTokenSchema,
  managedJournalEntrySpecSchema,
  previewManagedJournalEntry,
  type ApprovalToken,
  type ManagedJournalEntrySpec,
} from "@dicebox/compiler";

export const FIXED_TEST_WORLD_ID = "dbx-test-world" as const;
const schemaVersion = z.literal("0.1.0");

const requestBase = {
  schemaVersion,
  requestId: StableDiceBoxIdSchema,
  worldId: z.literal(FIXED_TEST_WORLD_ID),
};

export const fixedOperationRequestSchema = z.discriminatedUnion("operation", [
  z.object({ ...requestBase, operation: z.literal("status") }).strict(),
  z.object({
    ...requestBase,
    operation: z.literal("fixture.select"),
    fixtureId: StableDiceBoxIdSchema,
    idempotencyKey: StableDiceBoxIdSchema,
  }).strict(),
  z.object({
    ...requestBase,
    operation: z.literal("plan.preview"),
    plan: managedJournalEntrySpecSchema,
    authority: z.enum(["none", "gm"]),
    observedAt: z.string().datetime({ offset: true }),
    idempotencyKey: StableDiceBoxIdSchema,
  }).strict(),
  z.object({
    ...requestBase,
    operation: z.literal("plan.applyApproved"),
    plan: managedJournalEntrySpecSchema,
    previewReceiptId: StableDiceBoxIdSchema,
    approvalToken: approvalTokenSchema,
    activeGmUserId: z.string().trim().min(1).max(100),
    observedAt: z.string().datetime({ offset: true }),
    idempotencyKey: StableDiceBoxIdSchema,
  }).strict(),
  z.object({
    ...requestBase,
    operation: z.literal("snapshot.redacted"),
    fixtureId: StableDiceBoxIdSchema,
    observedAt: z.string().datetime({ offset: true }),
    idempotencyKey: StableDiceBoxIdSchema,
  }).strict(),
  z.object({
    ...requestBase,
    operation: z.literal("reset.owned"),
    fixtureId: StableDiceBoxIdSchema,
    approvalToken: approvalTokenSchema,
    activeGmUserId: z.string().trim().min(1).max(100),
    observedAt: z.string().datetime({ offset: true }),
    idempotencyKey: StableDiceBoxIdSchema,
  }).strict(),
]);

export type FixedOperationRequest = z.infer<typeof fixedOperationRequestSchema>;

export const bridgeReceiptSchema = z.object({
  schemaVersion,
  receiptId: StableDiceBoxIdSchema,
  requestId: StableDiceBoxIdSchema,
  operation: z.enum([
    "status",
    "fixture.select",
    "plan.preview",
    "plan.applyApproved",
    "snapshot.redacted",
    "reset.owned",
  ]),
  status: z.enum(["PASS", "BLOCKED", "UNKNOWN", "NOT_TESTED"]),
  evidenceClass: z.enum(["deterministic", "static", "blocked", "full_function"]),
  worldId: z.literal(FIXED_TEST_WORLD_ID),
  observedAt: z.string().datetime({ offset: true }),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type BridgeReceipt = z.infer<typeof bridgeReceiptSchema>;

export const redactedSnapshotSchema = z.object({
  schemaVersion,
  worldId: z.literal(FIXED_TEST_WORLD_ID),
  fixtureId: StableDiceBoxIdSchema,
  observedAt: z.string().datetime({ offset: true }),
  runtime: z.object({
    phase: z.enum(["m0", "runtime-probe", "ready"]),
    foundryVersion: z.string().nullable(),
    systemId: z.string().nullable(),
    systemVersion: z.string().nullable(),
    fingerprintId: StableDiceBoxIdSchema,
    exactTargetMatch: z.boolean(),
  }).strict().nullable(),
  managedDocuments: z.array(z.object({
    semanticId: StableDiceBoxIdSchema,
    documentType: z.literal("JournalEntry"),
    generation: z.number().int().nonnegative(),
    bindingFingerprint: z.string().regex(/^redacted:[0-9a-f]{8}$/),
  }).strict()).max(500),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type RedactedSnapshot = z.infer<typeof redactedSnapshotSchema>;

export const bridgeResponseSchema = z.object({
  schemaVersion,
  requestId: StableDiceBoxIdSchema,
  operation: z.enum([
    "status",
    "fixture.select",
    "plan.preview",
    "plan.applyApproved",
    "snapshot.redacted",
    "reset.owned",
  ]),
  status: z.enum(["PASS", "BLOCKED", "UNKNOWN", "NOT_TESTED"]),
  receipt: bridgeReceiptSchema,
  payload: z.unknown(),
}).strict();

export type BridgeResponse = z.infer<typeof bridgeResponseSchema>;

export interface BridgeSnapshotSource {
  readonly fixtureId: string;
  readonly runtime: RuntimeProfile | null;
  readonly bindings: readonly RuntimeBinding[];
}

export interface FixedOperationBridgeHandlers {
  readonly selectFixture?: (fixtureId: string) => Promise<Result<{ readonly fixtureId: string; readonly selected: true }>>;
  readonly snapshot?: (fixtureId: string) => Promise<Result<BridgeSnapshotSource>>;
}

export interface FixedOperationBridgeOptions {
  readonly runtime: RuntimeProfile;
  readonly handlers?: FixedOperationBridgeHandlers;
  /** Must remain false until an exact runtime and approval route are proven. */
  readonly mutationEnabled?: boolean;
}

function failure<T>(code: "INVALID_INPUT" | "FORBIDDEN" | "NOT_READY" | "UNKNOWN_OUTCOME", message: string): Result<T> {
  return { ok: false, error: { code, message, retry: code === "UNKNOWN_OUTCOME" ? "after-reread" : "never" } };
}

function fnv1a(input: string): string {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return `redacted:${hash.toString(16).padStart(8, "0")}`;
}

export function redactSnapshot(source: BridgeSnapshotSource, observedAt: string): RedactedSnapshot {
  const runtime = source.runtime ? RuntimeProfileSchema.parse(source.runtime) : null;
  const fingerprint = runtime ? createRuntimeFingerprint(runtime) : null;
  const bindings = source.bindings.map((binding) => RuntimeBindingSchema.parse(binding));
  if (bindings.some((binding) => binding.documentType !== "JournalEntry" || binding.semantic.kind !== "journal")) {
    throw new Error("Redacted JournalEntry snapshots cannot include non-JournalEntry bindings.");
  }
  return redactedSnapshotSchema.parse({
    schemaVersion: "0.1.0",
    worldId: FIXED_TEST_WORLD_ID,
    fixtureId: StableDiceBoxIdSchema.parse(source.fixtureId),
    observedAt,
    runtime: runtime ? {
      phase: runtime.phase,
      foundryVersion: runtime.foundryVersion,
      systemId: runtime.systemId,
      systemVersion: runtime.systemVersion,
      fingerprintId: fingerprint?.fingerprintId,
      exactTargetMatch: fingerprint?.exactTargetMatch,
    } : null,
    managedDocuments: bindings.map((binding) => ({
      semanticId: binding.semantic.id,
      documentType: "JournalEntry" as const,
      generation: binding.generation,
      bindingFingerprint: fnv1a(`${binding.uuid}|${binding.documentId}`),
    })),
    notes: ["Only semantic IDs, document types, generations, and hashed bindings are exposed."],
  });
}

function receipt(
  request: FixedOperationRequest,
  status: BridgeReceipt["status"],
  evidenceClass: BridgeReceipt["evidenceClass"],
  observedAt: string,
  notes: readonly string[],
): BridgeReceipt {
  return bridgeReceiptSchema.parse({
    schemaVersion: "0.1.0",
    receiptId: `dbx:receipt:bridge-${request.requestId.split(":").at(-1) ?? "request"}`,
    requestId: request.requestId,
    operation: request.operation,
    status,
    evidenceClass,
    worldId: FIXED_TEST_WORLD_ID,
    observedAt,
    notes: [...notes],
  });
}

function response(
  request: FixedOperationRequest,
  status: BridgeResponse["status"],
  payload: unknown,
  bridgeReceipt: BridgeReceipt,
): BridgeResponse {
  return bridgeResponseSchema.parse({
    schemaVersion: "0.1.0",
    requestId: request.requestId,
    operation: request.operation,
    status,
    receipt: bridgeReceipt,
    payload,
  });
}

export interface FixedOperationBridge {
  handle(input: unknown): Promise<Result<BridgeResponse>>;
}

export function createFixedOperationBridge(options: FixedOperationBridgeOptions): FixedOperationBridge {
  const runtime = RuntimeProfileSchema.parse(options.runtime);
  const handlers = options.handlers ?? {};
  const mutationEnabled = options.mutationEnabled ?? false;
  const idempotency = new Map<string, { readonly fingerprint: string; readonly result: Result<BridgeResponse> }>();

  return {
    async handle(input) {
      const parsed = fixedOperationRequestSchema.safeParse(input);
      if (!parsed.success) return failure("INVALID_INPUT", "Bridge request failed the strict fixed-operation schema.");
      const request = parsed.data;
      const idempotencyKey = "idempotencyKey" in request ? request.idempotencyKey : null;
      const fingerprint = JSON.stringify(request);
      if (idempotencyKey) {
        const prior = idempotency.get(idempotencyKey);
        if (prior) {
          return prior.fingerprint === fingerprint
            ? prior.result
            : failure("FORBIDDEN", "An idempotency key cannot be reused for a different fixed operation.");
        }
      }

      let result: Result<BridgeResponse>;
      if (request.operation === "status") {
        const observedAt = runtime.observedAt ?? new Date(0).toISOString();
          result = {
          ok: true,
          value: response(request, "PASS", {
            worldId: FIXED_TEST_WORLD_ID,
            readOnly: true,
            mutationEnabled,
            runtimePhase: runtime.phase,
            runtimeFingerprint: createRuntimeFingerprint(runtime),
            probeReceipt: createRuntimeProbeReceipt(runtime, "fixture"),
            allowedOperations: ["status", "fixture.select", "plan.preview", "plan.applyApproved", "snapshot.redacted", "reset.owned"],
          }, receipt(request, "PASS", "deterministic", observedAt, ["Fixed-operation bridge status is schema-validated and read-only by default."])),
        };
      } else if (request.operation === "fixture.select") {
        if (!handlers.selectFixture) {
          result = failure("NOT_READY", "Fixture selection is unavailable until a reviewed harness is connected.");
        } else {
          const selected = await handlers.selectFixture(request.fixtureId);
          result = selected.ok
            ? selected.value.fixtureId !== request.fixtureId
              ? failure("FORBIDDEN", "Fixture handler returned a different fixture identity.")
              : { ok: true, value: response(request, "PASS", selected.value, receipt(request, "PASS", "deterministic", runtime.observedAt ?? new Date(0).toISOString(), ["Fixture selection used the bounded handler seam."])) }
            : selected;
        }
      } else if (request.operation === "plan.preview") {
        const preview = previewManagedJournalEntry(request.plan, runtime, {
          authority: request.authority,
          observedAt: request.observedAt,
        });
        const status = preview.review.status === "ready" ? "PASS" : "BLOCKED";
        result = {
          ok: true,
          value: response(request, status, { preview }, receipt(request, status, "deterministic", request.observedAt, ["Preview only; no Foundry Document mutation was attempted."])),
        };
      } else if (request.operation === "snapshot.redacted") {
        if (!handlers.snapshot) {
          result = failure("NOT_READY", "Redacted snapshots are unavailable until a reviewed harness is connected.");
        } else {
          const snapshot = await handlers.snapshot(request.fixtureId);
          if (!snapshot.ok) {
            result = snapshot;
          } else if (snapshot.value.fixtureId !== request.fixtureId) {
            result = failure("FORBIDDEN", "Snapshot handler returned a different fixture identity.");
          } else {
            try {
              result = { ok: true, value: response(request, "PASS", { snapshot: redactSnapshot(snapshot.value, request.observedAt) }, receipt(request, "PASS", "deterministic", request.observedAt, ["Snapshot was redacted before leaving the bridge."])) };
            } catch {
              result = failure("INVALID_INPUT", "Snapshot data failed the bounded redaction contract.");
            }
          }
        }
      } else {
        const approval: ApprovalToken | undefined = "approvalToken" in request ? request.approvalToken : undefined;
        if (!approval) {
          result = failure("FORBIDDEN", "Mutation operations require an approval token.");
        } else if (request.operation === "plan.applyApproved"
          && (approval.planId !== request.plan.planId
            || approval.previewReceiptId !== request.previewReceiptId
            || approval.approvedByUserId !== request.activeGmUserId)) {
          result = failure("FORBIDDEN", "Approval token does not match the reviewed plan, preview receipt, and active GM.");
        } else if (!mutationEnabled) {
          result = failure("NOT_READY", "Approved apply and owned reset remain disabled until exact-runtime and authority gates pass.");
        } else {
          result = failure("NOT_READY", "No live mutation handler is installed in this deterministic bridge.");
        }
      }

      if (idempotencyKey) idempotency.set(idempotencyKey, { fingerprint, result });
      return result;
    },
  };
}
