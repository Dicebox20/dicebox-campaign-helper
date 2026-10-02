import { z } from "zod";
import { type Result } from "@dicebox/core";
import { canonicalizeFoundryIr } from "./foundry-ir.js";
import {
  stagedInversePermitClaimPersistenceResolutionSchema,
  stagedInversePermitClaimStateSchema,
  type StagedInversePermitClaimPersistenceResolution,
  type StagedInversePermitClaimState,
} from "./staged-inverse-permit-claim.js";

export { stagedInversePermitClaimPersistenceResolutionSchema } from "./staged-inverse-permit-claim.js";
export type { StagedInversePermitClaimPersistenceResolution } from "./staged-inverse-permit-claim.js";

const at = z.string().datetime({ offset: true });

const storeEnvelopeSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  claim: stagedInversePermitClaimStateSchema.nullable(),
}).strict();

export type StagedInversePermitClaimStoreEnvelope = z.infer<typeof storeEnvelopeSchema>;

export const stagedInversePermitClaimPersistenceObservationSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  candidate: stagedInversePermitClaimStateSchema,
  writeOutcome: z.enum(["committed", "unknown"]),
  rereadState: z.enum(["matched", "missing", "unknown", "conflicting"]),
  reread: stagedInversePermitClaimStateSchema.nullable(),
  observedAt: at,
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  const same = value.reread !== null
    && value.reread.state === "claimed"
    && value.reread.claimId === value.candidate.claimId
    && value.reread.permitId === value.candidate.permitId
    && value.reread.permitSha256 === value.candidate.permitSha256
    && value.reread.manifestId === value.candidate.manifestId
    && value.reread.idempotencyKey === value.candidate.idempotencyKey
    && value.reread.activeGmUserId === value.candidate.activeGmUserId;
  if (value.rereadState === "matched" && !same) context.addIssue({ code: z.ZodIssueCode.custom, message: "A matched inverse claim reread must equal the exact claimed candidate identity." });
  if (value.rereadState === "missing" && value.reread !== null) context.addIssue({ code: z.ZodIssueCode.custom, message: "A missing inverse claim reread cannot expose a claim." });
  if (value.rereadState === "unknown" && value.reread !== null && value.reread.state !== "unknown") context.addIssue({ code: z.ZodIssueCode.custom, message: "An unknown inverse claim reread may expose only an unknown claim state." });
  if (value.rereadState === "conflicting" && value.reread === null) context.addIssue({ code: z.ZodIssueCode.custom, message: "A conflicting inverse claim reread must preserve the observed claim." });
  if (value.rereadState === "conflicting" && same) context.addIssue({ code: z.ZodIssueCode.custom, message: "A conflicting inverse claim reread cannot equal the candidate claim." });
});

export type StagedInversePermitClaimPersistenceObservation = z.infer<typeof stagedInversePermitClaimPersistenceObservationSchema>;

export interface StagedInversePermitClaimPersistence {
  read(): Promise<string>;
  write(serialized: string): Promise<void>;
}

export interface StagedInversePermitClaimStore {
  load(): Promise<Result<StagedInversePermitClaimState | null>>;
  claim(candidate: unknown): Promise<Result<StagedInversePermitClaimPersistenceResolution>>;
}

function failure(code: "INVALID_INPUT" | "FORBIDDEN" | "UNAVAILABLE" | "UNKNOWN_OUTCOME", message: string, retry: "never" | "after-reread" = "never"): Result<never> {
  return { ok: false, error: { code, message, retry } };
}

function success<T>(value: T): Result<T> {
  return { ok: true, value };
}

function sameClaim(left: StagedInversePermitClaimState, right: StagedInversePermitClaimState): boolean {
  return left.claimId === right.claimId
    && left.permitId === right.permitId
    && left.permitSha256 === right.permitSha256
    && left.manifestId === right.manifestId
    && left.idempotencyKey === right.idempotencyKey
    && left.activeGmUserId === right.activeGmUserId;
}

/** Purely resolves a post-write claim observation; it never writes or retries. */
export function resolveStagedInversePermitClaimPersistenceObservation(input: unknown): StagedInversePermitClaimPersistenceResolution {
  const observation = stagedInversePermitClaimPersistenceObservationSchema.parse(input);
  return stagedInversePermitClaimPersistenceResolutionSchema.parse({
    schemaVersion: "0.1.0",
    status: observation.rereadState,
    writeOutcome: observation.writeOutcome,
    candidate: observation.candidate,
    reread: observation.reread,
    observedAt: observation.observedAt,
    authoritativeReread: true,
    retryAfter: observation.rereadState === "missing" ? "safe-to-retry" : observation.rereadState === "unknown" ? "authoritative-reread" : "never",
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  });
}

function parseEnvelope(raw: string): Result<StagedInversePermitClaimState | null> {
  try {
    const envelope = storeEnvelopeSchema.parse(raw ? JSON.parse(raw) : { schemaVersion: "0.1.0", claim: null });
    return success(envelope.claim);
  } catch {
    return failure("INVALID_INPUT", "Inverse permit claim store is malformed; no claim was exposed.");
  }
}

/** Serialized persistence boundary; it never calls an adapter and never dispatches an inverse operation. */
export function createStagedInversePermitClaimStore(persistence: StagedInversePermitClaimPersistence): StagedInversePermitClaimStore {
  let queue: Promise<unknown> = Promise.resolve();
  const serialized = <T>(operation: () => Promise<Result<T>>): Promise<Result<T>> => {
    const next = queue.then(operation, operation);
    queue = next.then(() => undefined, () => undefined);
    return next;
  };

  const loadUnlocked = async (): Promise<Result<StagedInversePermitClaimState | null>> => {
    let raw: string;
    try {
      raw = await persistence.read();
    } catch {
      return failure("UNAVAILABLE", "Inverse permit claim store could not be read; no dispatch is authorized.", "after-reread");
    }
    return parseEnvelope(raw);
  };

  const preReadResolution = (
    candidate: StagedInversePermitClaimState,
    reread: StagedInversePermitClaimState,
  ): StagedInversePermitClaimPersistenceResolution => {
    const status = reread.state === "claimed" && sameClaim(reread, candidate)
      ? "matched"
      : reread.state === "unknown"
        ? "unknown"
        : "conflicting";
    return stagedInversePermitClaimPersistenceResolutionSchema.parse({
      schemaVersion: "0.1.0",
      status,
      writeOutcome: "not-attempted",
      candidate,
      reread,
      observedAt: candidate.observedAt,
      authoritativeReread: true,
      retryAfter: status === "unknown" ? "authoritative-reread" : "never",
      foreignStatePreserved: true,
      execution: "not-implemented",
      readyClaim: false,
    });
  };

  return {
    load: () => serialized(loadUnlocked),
    claim: (candidateInput) => serialized(async () => {
      const candidate = stagedInversePermitClaimStateSchema.safeParse(candidateInput);
      if (!candidate.success || candidate.data.state !== "claimed") return failure("INVALID_INPUT", "Only a validated claimed inverse permit state may be persisted before dispatch.");
      const existing = await loadUnlocked();
      if (!existing.ok) return { ok: false, error: existing.error };
      if (existing.value) {
        if (!sameClaim(existing.value, candidate.data)) return failure("FORBIDDEN", "A different inverse permit claim already exists; foreign or conflicting state is preserved.");
        if (existing.value.state === "unknown") return failure("UNKNOWN_OUTCOME", "The same inverse permit claim has uncertain persistence; reread before retry.", "after-reread");
        if (existing.value.state !== "claimed") return failure("FORBIDDEN", "An existing inverse permit claim is not in the required claimed state; foreign or conflicting state is preserved.");
        return success(preReadResolution(candidate.data, existing.value));
      }
      const serializedEnvelope = canonicalizeFoundryIr({ schemaVersion: "0.1.0", claim: candidate.data });
      let writeOutcome: "committed" | "unknown" = "committed";
      try {
        await persistence.write(serializedEnvelope);
      } catch {
        writeOutcome = "unknown";
      }
      const reread = await loadUnlocked();
      const rereadState = !reread.ok
        ? "unknown"
        : reread.value === null
          ? "missing"
          : sameClaim(reread.value, candidate.data) && reread.value.state === "claimed"
            ? "matched"
            : reread.value.state === "unknown"
              ? "unknown"
              : "conflicting";
      const resolution = resolveStagedInversePermitClaimPersistenceObservation({
        schemaVersion: "0.1.0",
        candidate: candidate.data,
        writeOutcome,
        rereadState,
        reread: reread.ok ? reread.value : null,
        observedAt: candidate.data.observedAt,
        authoritativeReread: true,
        foreignStatePreserved: true,
        execution: "not-implemented",
        readyClaim: false,
      });
      return success(resolution);
    }),
  };
}
