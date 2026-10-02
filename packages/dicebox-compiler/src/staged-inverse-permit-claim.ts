import { z } from "zod";
import { StableDiceBoxIdSchema } from "@dicebox/core";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import { stagedInverseExecutionManifestSchema, verifyStagedInverseExecutionManifest, type StagedInverseExecutionManifest } from "./staged-inverse-execution-manifest.js";
import { validateAuthorizedStagedInverseExecutionInput, type StagedInverseExecutionInput } from "./staged-inverse-execution-contract.js";
import { stagedInverseExecutionPermitSchema, verifyStagedInverseExecutionPermit, type StagedInverseExecutionPermit } from "./staged-inverse-execution-permit.js";

const at = z.string().datetime({ offset: true });

export const stagedInversePermitClaimStateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  claimId: StableDiceBoxIdSchema,
  permitId: StableDiceBoxIdSchema,
  permitSha256: z.string().regex(/^[0-9a-f]{64}$/),
  manifestId: StableDiceBoxIdSchema,
  idempotencyKey: StableDiceBoxIdSchema,
  activeGmUserId: z.string().trim().min(1).max(100),
  state: z.enum(["available", "claimed", "unknown"]),
  observedAt: at,
  authoritativeReread: z.boolean(),
  singleUse: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  if (value.state === "claimed" && !value.authoritativeReread) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["authoritativeReread"],
      message: "A claimed inverse permit state requires an authoritative reread.",
    });
  }
});

const stagedInversePermitClaimPostWriteEventSchema = z.object({
  kind: z.enum(["claim-committed", "claim-persistence-unknown"]),
  observedAt: at,
  authoritativeReread: z.literal(false),
}).strict();

export const stagedInversePermitClaimPersistenceResolutionSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  status: z.enum(["matched", "missing", "unknown", "conflicting"]),
  writeOutcome: z.enum(["not-attempted", "committed", "unknown"]),
  candidate: stagedInversePermitClaimStateSchema,
  reread: stagedInversePermitClaimStateSchema.nullable(),
  observedAt: at,
  authoritativeReread: z.literal(true),
  retryAfter: z.enum(["never", "authoritative-reread", "safe-to-retry"]),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  const exactMatch = value.reread !== null
    && value.reread.state === "claimed"
    && canonicalizeFoundryIr(value.reread) === canonicalizeFoundryIr(value.candidate);
  if (value.status === "matched" && !exactMatch) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["reread"], message: "A matched inverse claim resolution requires the structurally exact claimed candidate reread." });
  }
  if (value.status === "matched" && value.retryAfter !== "never") {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["retryAfter"], message: "A matched inverse claim resolution cannot authorize a retry." });
  }
  if (value.status !== "matched" && exactMatch) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["status"], message: "An exact inverse claim reread must be identified as matched." });
  }
});

const stagedInversePermitClaimClaimedRereadEventSchema = z.object({
  kind: z.literal("reread-claimed"),
  observedAt: at,
  authoritativeReread: z.literal(true),
  persistenceResolution: stagedInversePermitClaimPersistenceResolutionSchema,
}).strict();

const stagedInversePermitClaimAvailableRereadEventSchema = z.object({
  kind: z.literal("reread-available"),
  observedAt: at,
  authoritativeReread: z.literal(true),
}).strict();

export const stagedInversePermitClaimEventSchema = z.discriminatedUnion("kind", [
  stagedInversePermitClaimPostWriteEventSchema,
  stagedInversePermitClaimClaimedRereadEventSchema,
  stagedInversePermitClaimAvailableRereadEventSchema,
]);

export type StagedInversePermitClaimState = z.infer<typeof stagedInversePermitClaimStateSchema>;
export type StagedInversePermitClaimPersistenceResolution = z.infer<typeof stagedInversePermitClaimPersistenceResolutionSchema>;
export type StagedInversePermitClaimEvent = z.infer<typeof stagedInversePermitClaimEventSchema>;

function unsignedState(state: StagedInversePermitClaimState): Omit<StagedInversePermitClaimState, "readyClaim"> {
  const { readyClaim: _readyClaim, ...unsigned } = state;
  return unsigned;
}

function assertClaimInputs(request: StagedInverseExecutionInput, manifest: StagedInverseExecutionManifest, permit: StagedInverseExecutionPermit): void {
  if (permit.inversePlanId !== request.inversePlan.inversePlanId
    || permit.manifestId !== manifest.manifestId || permit.manifestSha256 !== manifest.manifestSha256
    || permit.authorizationId !== request.authorization.authorizationId || permit.adapterId !== manifest.adapterId
    || permit.issuedByActiveGmUserId !== request.activeGmUserId) {
    throw new Error("Inverse permit claim must bind the exact authorized request and manifest.");
  }
}

/** Pure claim-state constructor; it records no store write and cannot dispatch an inverse operation. */
export async function createStagedInversePermitClaimState(
  requestInput: unknown,
  manifestInput: unknown,
  permitInput: unknown,
  claimId: string,
  idempotencyKey: string,
  observedAt: string,
): Promise<StagedInversePermitClaimState> {
  const request = await validateAuthorizedStagedInverseExecutionInput(requestInput);
  const manifest = stagedInverseExecutionManifestSchema.parse(manifestInput);
  const permit = stagedInverseExecutionPermitSchema.parse(permitInput);
  if (!await verifyStagedInverseExecutionManifest(manifest) || !await verifyStagedInverseExecutionPermit(permit, request, manifest)) {
    throw new Error("Inverse permit claim requires verified authorization, manifest, and permit records.");
  }
  assertClaimInputs(request, manifest, permit);
  return stagedInversePermitClaimStateSchema.parse({
    schemaVersion: "0.1.0",
    claimId: StableDiceBoxIdSchema.parse(claimId),
    permitId: permit.permitId,
    permitSha256: permit.permitSha256,
    manifestId: manifest.manifestId,
    idempotencyKey: StableDiceBoxIdSchema.parse(idempotencyKey),
    activeGmUserId: request.activeGmUserId,
    state: "available",
    observedAt: at.parse(observedAt),
    authoritativeReread: false,
    singleUse: true,
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  });
}

/** Pure fail-closed state transition; a real store must persist the result before any future dispatch. */
export function transitionStagedInversePermitClaim(input: unknown, eventInput: unknown): StagedInversePermitClaimState {
  const state = stagedInversePermitClaimStateSchema.parse(input);
  const event = stagedInversePermitClaimEventSchema.parse(eventInput);
  if (state.state === "claimed") throw new Error("A claimed inverse permit is terminal and cannot be reused.");
  if (state.state === "available" && event.kind !== "claim-committed" && event.kind !== "claim-persistence-unknown") {
    throw new Error("An available inverse permit requires a claim result before reread resolution.");
  }
  if (state.state === "unknown" && event.kind !== "reread-claimed" && event.kind !== "reread-available") {
    throw new Error("An unknown inverse permit claim requires an authoritative reread.");
  }
  if (event.kind === "reread-claimed") {
    const resolution = event.persistenceResolution;
    if (resolution.status !== "matched" || resolution.reread === null) {
      throw new Error("A claimed inverse permit transition requires a matched persistence-resolution witness.");
    }
    if (event.observedAt !== resolution.observedAt) {
      throw new Error("A claimed inverse permit transition must preserve the persistence-resolution observation time.");
    }
    const candidate = resolution.candidate;
    if (candidate.claimId !== state.claimId
      || candidate.permitId !== state.permitId
      || candidate.permitSha256 !== state.permitSha256
      || candidate.manifestId !== state.manifestId
      || candidate.idempotencyKey !== state.idempotencyKey
      || candidate.activeGmUserId !== state.activeGmUserId) {
      throw new Error("A claimed inverse permit transition requires a persistence witness for the exact pending claim identity.");
    }
    return stagedInversePermitClaimStateSchema.parse(resolution.reread);
  }
  const nextState = event.kind === "reread-available" ? "available" : "unknown";
  return stagedInversePermitClaimStateSchema.parse({ ...state, state: nextState, observedAt: event.observedAt, authoritativeReread: event.authoritativeReread });
}

export function verifyStagedInversePermitClaimState(input: unknown): boolean {
  try {
    const state = stagedInversePermitClaimStateSchema.parse(input);
    return state.singleUse && state.foreignStatePreserved && !state.readyClaim && state.execution === "not-implemented";
  } catch {
    return false;
  }
}
