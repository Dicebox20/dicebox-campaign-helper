import { z } from "zod";
import { StableDiceBoxIdSchema } from "@dicebox/core";
import { createAscendancySignalRuneNativeDocumentPreview, type SignalRuneNativeDocumentPreviewRuntime } from "./ascendancy-signal-rune-native-document-preview.js";

const inputSchema = z.object({ runtime: z.object({ foundryVersion: z.literal("14.367"), systemId: z.literal("dnd5e"), systemVersion: z.literal("5.3.3"), activeGm: z.literal(true), sceneBindings: z.object({ signal: z.literal("AneddhKAAfk5HlsA"), rune: z.literal("p9Mbi0CJWe9KvJhH") }).strict() }).strict(), issuedAt: z.number().int().nonnegative(), nonce: z.string().min(16).max(128).regex(/^[a-zA-Z0-9_-]+$/) }).strict();

export const ascendancySignalRuneApprovalEnvelopeSchema = z.object({
  schemaVersion: z.literal("0.1.0"), operation: z.literal("dicebox.ascendancy.signal-rune.native-document.approval"), planId: StableDiceBoxIdSchema,
  previewToken: z.string().min(1), issuedAt: z.string().datetime(), expiresAt: z.string().datetime(), expiresAtEpochMs: z.number().int().nonnegative(),
  approvalRequired: z.literal(true), authoritativeRereadRequired: z.literal(true), foreignStatePreservationRequired: z.literal(true), retryAfterUnknown: z.literal(false),
  noWrite: z.literal(true), apply: z.literal(false), mutation: z.literal("disabled-until-exact-runtime-gate"), runtimeState: z.literal("not-modeled"),
}).strict();
export type AscendancySignalRuneApprovalEnvelope = z.infer<typeof ascendancySignalRuneApprovalEnvelopeSchema>;

const TOKEN_TTL_MS = 5 * 60 * 1000;

/** Issues a token for the sole M1115 plan; it intentionally has no consume/apply operation. */
export function issueAscendancySignalRuneApprovalEnvelope(input: { runtime: SignalRuneNativeDocumentPreviewRuntime; issuedAt: number; nonce: string }): AscendancySignalRuneApprovalEnvelope {
  const request = inputSchema.parse(input);
  const plan = createAscendancySignalRuneNativeDocumentPreview(request.runtime);
  const expiresAtEpochMs = request.issuedAt + TOKEN_TTL_MS;
  return ascendancySignalRuneApprovalEnvelopeSchema.parse({
    schemaVersion: "0.1.0", operation: "dicebox.ascendancy.signal-rune.native-document.approval", planId: plan.planId,
    previewToken: `m1117-${request.issuedAt.toString(36)}-${request.nonce}`, issuedAt: new Date(request.issuedAt).toISOString(), expiresAt: new Date(expiresAtEpochMs).toISOString(), expiresAtEpochMs,
    approvalRequired: true, authoritativeRereadRequired: true, foreignStatePreservationRequired: true, retryAfterUnknown: false,
    noWrite: true, apply: false, mutation: "disabled-until-exact-runtime-gate", runtimeState: "not-modeled",
  });
}

/** Read-only validity check; a caller must never treat it as execution authority. */
export function validateAscendancySignalRuneApprovalEnvelope(input: unknown, now: number): AscendancySignalRuneApprovalEnvelope {
  const envelope = ascendancySignalRuneApprovalEnvelopeSchema.parse(input);
  if (envelope.expiresAtEpochMs <= now) throw new Error("M1117 approval envelope is expired; obtain a fresh fixed preview.");
  return envelope;
}
