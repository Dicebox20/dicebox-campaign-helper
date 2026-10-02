import { z } from "zod";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";

const expectedGamemasterLabel = "Gamemaster [GM]";
const expectedAssistantLabel = "Assistant Gamemaster [GM]";
const defaultFoundryUrl = "http://localhost:30000/game";

const gmTabObservationSchema = z.object({
  tabId: z.string().min(1),
  providerTabId: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  accountLabel: z.string().min(1),
  lastOpened: z.string().datetime({ offset: true }).optional(),
}).strict();

const gmHarnessReceiptSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  receiptId: StableDiceBoxIdSchema,
  operation: z.literal("gm-chrome-harness.select"),
  status: z.enum(["PASS", "BLOCKED"]),
  evidenceClass: z.enum(["deterministic", "blocked"]),
  noChromeMutation: z.literal(true),
  noWorldMutation: z.literal(true),
  targetUrl: z.string().url(),
  selected: gmTabObservationSchema.nullable(),
  preserved: z.array(gmTabObservationSchema),
  blockers: z.array(z.string().min(1)),
  rules: z.array(z.string().min(1)),
}).strict();

export type GmTabObservation = z.infer<typeof gmTabObservationSchema>;
export const GmTabObservationSchema = gmTabObservationSchema;
export type GmHarnessReceipt = z.infer<typeof gmHarnessReceiptSchema>;
export const GmHarnessReceiptSchema = gmHarnessReceiptSchema;

export interface GmHarnessOptions {
  readonly targetUrl?: string;
  readonly gamemasterLabel?: string;
}

function blockedReceipt(targetUrl: string, observations: readonly GmTabObservation[], blockers: readonly string[]): GmHarnessReceipt {
  return gmHarnessReceiptSchema.parse({
    schemaVersion: "0.1.0",
    receiptId: createStableDiceBoxId("receipt", "gm-chrome-harness-selection"),
    operation: "gm-chrome-harness.select",
    status: "BLOCKED",
    evidenceClass: "blocked",
    noChromeMutation: true,
    noWorldMutation: true,
    targetUrl,
    selected: null,
    preserved: observations,
    blockers,
    rules: [
      "Use the supported user.openTabs snapshot and exact providerTabId/title/url before claiming a tab.",
      "Require the visible Gamemaster [GM] account label and exclude Assistant Gamemaster [GM].",
      "Preserve all non-selected tabs and never infer identity from numeric tab order alone.",
    ],
  });
}

/**
 * Selects exactly one visible Gamemaster tab for the supported Chrome harness.
 * This is a pure selector: it never claims, navigates, reloads, or mutates a tab.
 */
export function selectGamemasterTab(input: readonly unknown[], options: GmHarnessOptions = {}): GmHarnessReceipt {
  const targetUrl = options.targetUrl ?? defaultFoundryUrl;
  const gamemasterLabel = options.gamemasterLabel ?? expectedGamemasterLabel;
  const parsed = input.map((candidate) => gmTabObservationSchema.safeParse(candidate));
  if (parsed.some((candidate) => !candidate.success)) {
    return blockedReceipt(targetUrl, [], ["Every tab observation must include the exact tab snapshot and visible account label."]);
  }
  const observations = parsed.flatMap((candidate) => candidate.success ? [candidate.data] : []);
  const matches = observations.filter((candidate) => candidate.url === targetUrl
    && candidate.accountLabel === gamemasterLabel
    && candidate.accountLabel !== expectedAssistantLabel);
  if (matches.length !== 1) {
    return blockedReceipt(targetUrl, observations, [
      `Expected exactly one ${gamemasterLabel} tab at ${targetUrl}; observed ${matches.length}.`,
      "Do not guess between identical Foundry windows or claim a tab without the visible account label.",
    ]);
  }
  const selected = matches[0];
  if (!selected) return blockedReceipt(targetUrl, observations, ["The selected Gamemaster tab disappeared during deterministic selection."]);
  return gmHarnessReceiptSchema.parse({
    schemaVersion: "0.1.0",
    receiptId: createStableDiceBoxId("receipt", "gm-chrome-harness-selection"),
    operation: "gm-chrome-harness.select",
    status: "PASS",
    evidenceClass: "deterministic",
    noChromeMutation: true,
    noWorldMutation: true,
    targetUrl,
    selected,
    preserved: observations.filter((candidate) => candidate.providerTabId !== selected.providerTabId),
    blockers: [],
    rules: [
      "Use the supported user.openTabs snapshot and exact providerTabId/title/url before claiming a tab.",
      "Require the visible Gamemaster [GM] account label and exclude Assistant Gamemaster [GM].",
      "Preserve all non-selected tabs and never infer identity from numeric tab order alone.",
    ],
  });
}
