import { z } from "zod";
import { StableDiceBoxIdSchema } from "@dicebox/core";
import {
  createAscendancySignalRuneNativeDocumentPreview,
  type SignalRuneNativeDocumentPreviewRuntime,
} from "./ascendancy-signal-rune-native-document-preview.js";
import {
  validateAscendancySignalRuneApprovalEnvelope,
  type AscendancySignalRuneApprovalEnvelope,
} from "./ascendancy-signal-rune-approval-envelope.js";

const operationByIntentKind = {
  "scene-renderer": "scene.initialLevel.update(background.src)",
  wall: 'scene.createEmbeddedDocuments("Wall", adapter-owned-schema)',
  region: 'scene.createEmbeddedDocuments("Region", adapter-owned-schema)',
  tile: 'scene.createEmbeddedDocuments("Tile", adapter-owned-schema)',
  token: 'scene.createEmbeddedDocuments("Token", adapter-owned-schema)',
  ambientLight: 'scene.createEmbeddedDocuments("AmbientLight", adapter-owned-schema)',
  ambientSound: 'scene.createEmbeddedDocuments("AmbientSound", adapter-owned-schema)',
  drawing: 'scene.createEmbeddedDocuments("Drawing", adapter-owned-schema)',
  note: 'scene.createEmbeddedDocuments("Note", adapter-owned-schema)',
} as const;

const allowlistedOperationSchema = z.object({
  roomId: StableDiceBoxIdSchema,
  sceneId: StableDiceBoxIdSchema,
  sceneIdRuntime: z.string().min(1),
  intentId: StableDiceBoxIdSchema,
  kind: z.enum(["scene-renderer", "wall", "region", "tile", "token", "ambientLight", "ambientSound", "drawing", "note"]),
  count: z.number().int().positive(),
  foundryApi: z.enum([
    "scene.initialLevel.update(background.src)",
    'scene.createEmbeddedDocuments("Wall", adapter-owned-schema)',
    'scene.createEmbeddedDocuments("Region", adapter-owned-schema)',
    'scene.createEmbeddedDocuments("Tile", adapter-owned-schema)',
    'scene.createEmbeddedDocuments("Token", adapter-owned-schema)',
    'scene.createEmbeddedDocuments("AmbientLight", adapter-owned-schema)',
    'scene.createEmbeddedDocuments("AmbientSound", adapter-owned-schema)',
    'scene.createEmbeddedDocuments("Drawing", adapter-owned-schema)',
    'scene.createEmbeddedDocuments("Note", adapter-owned-schema)',
  ]),
  payload: z.literal("not-materialized"),
  dispatch: z.literal("disabled"),
  authoritativeReread: z.literal("required-before-and-after-future-operation"),
  foreignState: z.literal("preserve"),
  retryAfterUnknown: z.literal(false),
}).strict();

export const ascendancySignalRuneNativeOperationAllowlistSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.native-document.operation-allowlist"),
  planId: z.literal("dbx:plan:m1115-signal-rune-native-document-preview"),
  previewToken: z.string().min(1),
  approvalRequired: z.literal(true),
  noWrite: z.literal(true),
  apply: z.literal(false),
  dispatch: z.literal("disabled"),
  payload: z.literal("not-materialized"),
  operations: z.array(allowlistedOperationSchema).length(18),
  excluded: z.tuple([z.literal("dbx:room:ascendancy-tram-depot"), z.literal("dbx:room:central-core-control-chamber")]),
  runtimeState: z.literal("not-modeled"),
}).strict();

export type AscendancySignalRuneNativeOperationAllowlist = z.infer<typeof ascendancySignalRuneNativeOperationAllowlistSchema>;

/**
 * Declares only the reviewed API categories for M1115's fixed intents. This
 * produces neither a native payload nor a callable Foundry dispatch path.
 */
export function createAscendancySignalRuneNativeOperationAllowlist(input: {
  readonly runtime: SignalRuneNativeDocumentPreviewRuntime;
  readonly approvalEnvelope: AscendancySignalRuneApprovalEnvelope;
  readonly now: number;
}): AscendancySignalRuneNativeOperationAllowlist {
  const envelope = validateAscendancySignalRuneApprovalEnvelope(input.approvalEnvelope, input.now);
  const plan = createAscendancySignalRuneNativeDocumentPreview(input.runtime);
  if (envelope.planId !== plan.planId) throw new Error("M1119 approval envelope does not bind the fixed M1115 plan.");
  return ascendancySignalRuneNativeOperationAllowlistSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.native-document.operation-allowlist",
    planId: plan.planId,
    previewToken: envelope.previewToken,
    approvalRequired: envelope.approvalRequired,
    noWrite: true,
    apply: false,
    dispatch: "disabled",
    payload: "not-materialized",
    operations: plan.rooms.flatMap((room) => room.documents.map((intent) => ({
      roomId: room.roomId,
      sceneId: room.sceneId,
      sceneIdRuntime: room.sceneIdRuntime,
      intentId: intent.intentId,
      kind: intent.kind,
      count: intent.count,
      foundryApi: operationByIntentKind[intent.kind],
      payload: "not-materialized",
      dispatch: "disabled",
      authoritativeReread: "required-before-and-after-future-operation",
      foreignState: room.foreignState,
      retryAfterUnknown: false,
    }))),
    excluded: plan.excluded,
    runtimeState: "not-modeled",
  });
}
