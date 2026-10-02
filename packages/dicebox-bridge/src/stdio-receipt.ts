import { z } from "zod";
import {
  RuntimeProfileSchema,
  StableDiceBoxIdSchema,
  createRuntimeFingerprint,
  createStableDiceBoxId,
  type RuntimeProfile,
} from "@dicebox/core";
import {
  bridgeTransportResponseSchema,
  type BridgeTransportResponse,
} from "./test-bridge-transport.js";
import {
  stdioServerReportSchema,
  type StdioServerReport,
} from "./stdio-server.js";

export const STDIO_RECEIPT_FOUNDRY_API = "Hooks.once(\"ready\"), game.version, game.system, game.users.activeGM, fromUuid, game.journal.get, native Document/embedded-document APIs, authoritative reread" as const;

const stdioTransportReceiptSchema = z.object({
  receiptVersion: z.literal(1),
  receiptId: StableDiceBoxIdSchema,
  operation: z.literal("bridge.stdio"),
  status: z.enum(["pass", "blocked", "unknown"]),
  evidenceClass: z.enum(["deterministic", "blocked"]),
  transport: z.literal("stdio"),
  scope: z.literal("local-safe-mode"),
  worldId: z.literal("dbx-test-world"),
  target: z.object({
    fingerprintId: StableDiceBoxIdSchema,
    foundryVersion: z.string().min(1).nullable(),
    systemId: z.string().min(1).nullable(),
    systemVersion: z.string().min(1).nullable(),
    exactTargetMatch: z.boolean(),
  }).strict(),
  foundryApi: z.string().min(1),
  foundryApiEvidence: z.literal("not-exercised"),
  requests: z.number().int().nonnegative(),
  responses: z.number().int().nonnegative(),
  protocolErrors: z.number().int().nonnegative(),
  operations: z.array(z.enum([
    "status",
    "fixture.select",
    "plan.preview",
    "plan.applyApproved",
    "snapshot.redacted",
    "reset.owned",
  ])).max(6),
  noWrite: z.literal(true),
  readOnly: z.literal(true),
  mutationEnabled: z.literal(false),
  networkEnabled: z.literal(false),
  noRawData: z.literal(true),
  observedAt: z.string().datetime({ offset: true }),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type StdioTransportReceipt = z.infer<typeof stdioTransportReceiptSchema>;
export const StdioTransportReceiptSchema = stdioTransportReceiptSchema;

export interface StdioTransportReceiptInput {
  readonly profile: RuntimeProfile;
  readonly report: StdioServerReport;
  readonly responses: readonly unknown[];
  readonly observedAt?: string;
}

function sortedUniqueOperations(responses: readonly BridgeTransportResponse[]): StdioTransportReceipt["operations"] {
  return [...new Set(responses.flatMap((response) => response.ok ? [response.value.operation] : []))]
    .sort() as StdioTransportReceipt["operations"];
}

/**
 * Compose a redacted transport receipt from a bounded local process result.
 *
 * The receipt records the exact Foundry API boundary that the eventual
 * runtime adapter must satisfy, but marks that API evidence as unexercised.
 * It never copies request payloads, response payloads, UUIDs, or stderr text.
 */
export function createStdioTransportReceipt(input: StdioTransportReceiptInput): StdioTransportReceipt {
  const profile = RuntimeProfileSchema.parse(input.profile);
  const report = stdioServerReportSchema.parse(input.report);
  const responses = input.responses.map((response) => bridgeTransportResponseSchema.parse(response));
  const fingerprint = createRuntimeFingerprint(profile);
  const countsAgree = report.requests === report.responses && report.responses === responses.length;
  const status = report.status === "completed" && countsAgree ? "pass" : report.status === "unknown" ? "unknown" : "blocked";
  const observedAt = input.observedAt ?? profile.observedAt ?? new Date(0).toISOString();
  return stdioTransportReceiptSchema.parse({
    receiptVersion: 1,
    receiptId: createStableDiceBoxId("receipt", `stdio-${fingerprint.fingerprintId.split(":").at(-1) ?? "unknown"}-${status}`),
    operation: "bridge.stdio",
    status,
    evidenceClass: status === "pass" ? "deterministic" : "blocked",
    transport: "stdio",
    scope: "local-safe-mode",
    worldId: report.worldId,
    target: {
      fingerprintId: fingerprint.fingerprintId,
      foundryVersion: profile.foundryVersion,
      systemId: profile.systemId,
      systemVersion: profile.systemVersion,
      exactTargetMatch: fingerprint.exactTargetMatch,
    },
    foundryApi: STDIO_RECEIPT_FOUNDRY_API,
    foundryApiEvidence: "not-exercised",
    requests: report.requests,
    responses: report.responses,
    protocolErrors: responses.filter((response) => !response.ok).length,
    operations: sortedUniqueOperations(responses),
    noWrite: true,
    readOnly: report.readOnly,
    mutationEnabled: report.mutationEnabled,
    networkEnabled: report.networkEnabled,
    noRawData: true,
    observedAt,
    notes: [
      "The receipt contains only bounded transport counts, operation names, and target metadata; request and response payloads are omitted.",
      "The local host uses the safe-mode profile; the named Foundry API boundary was not exercised by this receipt.",
      status === "pass" ? "Process framing completed with a response for every bounded input line." : "Transport evidence is blocked or unknown; reread before retrying and do not promote it to exact-runtime evidence.",
    ],
  });
}
