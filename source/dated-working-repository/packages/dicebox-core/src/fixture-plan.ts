import { z } from "zod";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";
import { TARGET_DND5E_VERSION, TARGET_FOUNDRY_VERSION } from "./version.js";

const fixtureContextSchema = z.enum(["GM", "Player3"]);
const fixtureSeedSchema = z.object({
  fixtureId: StableDiceBoxIdSchema,
  semanticKind: z.enum(["journal", "item", "region"]),
  purpose: z.string().min(1),
  foundryApis: z.array(z.string().min(1)).min(1).max(8),
  rawPayload: z.literal(false),
  mutation: z.literal("deferred-until-exact-runtime"),
}).strict();

const fixtureApiCheckSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{2,63}$/),
  foundryApi: z.string().min(1),
  purpose: z.string().min(1),
  requiredContexts: z.array(fixtureContextSchema).min(1).max(2),
  requiredArtifactKinds: z.array(z.enum(["runtime-receipt", "redacted-json", "console", "screenshot"])).min(1).max(4),
  status: z.literal("required"),
  noWrite: z.literal(true),
}).strict();

const fixtureBlockerSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{2,63}$/),
  foundryApi: z.string().min(1),
  reason: z.string().min(1),
}).strict();

export const FoundryFixturePlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  operation: z.literal("foundry.fixture.plan"),
  status: z.literal("blocked"),
  evidenceClass: z.literal("deterministic"),
  noWrite: z.literal(true),
  mutation: z.literal("disabled"),
  target: z.object({
    foundryVersion: z.literal(TARGET_FOUNDRY_VERSION),
    systemId: z.literal("dnd5e"),
    systemVersion: z.literal(TARGET_DND5E_VERSION),
    worldId: z.literal("dbx-test-world"),
  }).strict(),
  contexts: z.array(fixtureContextSchema).length(2),
  resetPolicy: z.literal("owned-fixture-only"),
  seeds: z.array(fixtureSeedSchema).length(3),
  apiChecks: z.array(fixtureApiCheckSchema).min(10).max(20),
  blockers: z.array(fixtureBlockerSchema).min(1).max(20),
  nextGates: z.array(z.string().min(1)).min(1).max(12),
}).strict();

export type FoundryFixturePlan = z.infer<typeof FoundryFixturePlanSchema>;

const target = {
  foundryVersion: TARGET_FOUNDRY_VERSION,
  systemId: "dnd5e" as const,
  systemVersion: TARGET_DND5E_VERSION,
  worldId: "dbx-test-world" as const,
};

/**
 * Build the read-only handoff for the first exact Foundry fixture round.
 *
 * This is intentionally a blocked plan: it defines the exact target,
 * contexts, fixtures, API observations, and receipts without creating a
 * world, installing a module, or issuing a Document operation.
 */
export function createFoundryFixturePlan(): FoundryFixturePlan {
  return FoundryFixturePlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: createStableDiceBoxId("plan", "foundry-fixture-m21"),
    operation: "foundry.fixture.plan",
    status: "blocked",
    evidenceClass: "deterministic",
    noWrite: true,
    mutation: "disabled",
    target,
    contexts: ["GM", "Player3"],
    resetPolicy: "owned-fixture-only",
    seeds: [
      {
        fixtureId: createStableDiceBoxId("fixture", "journal-observation"),
        semanticKind: "journal",
        purpose: "Observe DiceBox ownership markers, page schema, and authoritative reread without exposing foreign content.",
        foundryApis: [
          "Hooks.once(\"ready\")",
          "JournalEntry.create",
          "entry.createEmbeddedDocuments(\"JournalEntryPage\", ...)",
          "fromUuid",
          "game.journal.get",
          "game.journal.contents",
        ],
        rawPayload: false,
        mutation: "deferred-until-exact-runtime",
      },
      {
        fixtureId: createStableDiceBoxId("fixture", "activity-observation"),
        semanticKind: "item",
        purpose: "Observe one D&D5e Item Activity and ownership/canUse surfaces without invoking Activity.use.",
        foundryApis: [
          "fromUuid",
          "game.items.get",
          "item.getEmbeddedDocument(\"Activity\", id)",
          "item.system.activities.contents",
          "activity.use(usage, dialog, message)",
          "dnd5e.preUseActivity",
          "dnd5e.postUseActivity",
        ],
        rawPayload: false,
        mutation: "deferred-until-exact-runtime",
      },
      {
        fixtureId: createStableDiceBoxId("fixture", "region-observation"),
        semanticKind: "region",
        purpose: "Observe one Region and RegionBehavior identity/registry/event surface without invoking behavior or writing documents.",
        foundryApis: [
          "fromUuid",
          "game.scenes.get",
          "region.getEmbeddedCollection(\"RegionBehavior\")",
          "region.getEmbeddedDocument(\"RegionBehavior\", id)",
          "CONFIG.RegionBehavior.dataModels",
          "RegionBehaviorType.events",
          "RegionDocument.shapes",
        ],
        rawPayload: false,
        mutation: "deferred-until-exact-runtime",
      },
    ],
    apiChecks: [
      apiCheck("ready-lifecycle", "Hooks.once(\"ready\")", "Confirm the installed module query is registered only after Foundry ready.", ["GM"], ["runtime-receipt"]),
      apiCheck("target-fingerprint", "game.version + game.system.id + game.system.version", "Bind every receipt to Foundry 14.367 and D&D5e 5.3.3.", ["GM", "Player3"], ["runtime-receipt", "redacted-json"]),
      apiCheck("active-gm", "game.users.activeGM / User permissions", "Observe active-GM identity and recheck authority in both client contexts.", ["GM", "Player3"], ["runtime-receipt", "redacted-json"]),
      apiCheck("runtime-evidence-query", "game.diceboxCampaignHelper.query({ kind: \"runtime-evidence\" })", "Capture the canonical profile, fingerprint, no-write probe, and redacted API observations.", ["GM"], ["runtime-receipt", "redacted-json"]),
      apiCheck("journal-observation", "fromUuid / game.journal.get / game.journal.contents", "Read owned and foreign JournalEntry state while preserving unknown content.", ["GM", "Player3"], ["runtime-receipt", "redacted-json"]),
      apiCheck("journal-schema", "JournalEntry.create / entry.createEmbeddedDocuments(\"JournalEntryPage\", ...)", "Observe factory and page schema presence without invoking a write.", ["GM"], ["runtime-receipt", "redacted-json"]),
      apiCheck("activity-observation", "fromUuid / game.items.get / item.getEmbeddedDocument(\"Activity\", id)", "Read one Item Activity and record registry/read/use surface presence without Activity.use.", ["GM", "Player3"], ["runtime-receipt", "redacted-json"]),
      apiCheck("activity-hooks", "dnd5e.preUseActivity / dnd5e.postUseActivity / Hooks", "Record hook names and reserve cancellation/order behavior for exact evidence.", ["GM"], ["runtime-receipt", "console"]),
      apiCheck("active-effect-observation", "parent.getEmbeddedCollection(\"ActiveEffect\") / parent.getEmbeddedDocument(\"ActiveEffect\", id)", "Read native ActiveEffect identity and state without create/update/delete.", ["GM", "Player3"], ["runtime-receipt", "redacted-json"]),
      apiCheck("region-observation", "fromUuid / game.scenes.get / RegionDocument.shapes / RegionDocument.behaviors", "Read one Region identity, geometry summary, and behavior summary without projection.", ["GM", "Player3"], ["runtime-receipt", "redacted-json"]),
      apiCheck("region-behavior-observation", "region.getEmbeddedCollection(\"RegionBehavior\") / CONFIG.RegionBehavior.dataModels / RegionBehaviorType.events", "Record RegionBehavior registry and event surfaces without invocation.", ["GM"], ["runtime-receipt", "redacted-json"]),
      apiCheck("authoritative-reread", "fromUuid / document collections / embedded-document getters", "Reread every observed binding after each exact adapter boundary and classify unknown outcomes.", ["GM", "Player3"], ["runtime-receipt", "redacted-json"]),
      apiCheck("cross-client", "User permissions + visible GM/Player3 clients", "Compare redacted observations and sender/authority semantics across GM and Player3 contexts.", ["GM", "Player3"], ["runtime-receipt", "screenshot", "redacted-json"]),
      apiCheck("timeout-recovery", "transaction journal + authoritative reread", "Inject bounded timeout/connection uncertainty and reread before any retry.", ["GM"], ["runtime-receipt", "redacted-json"]),
    ],
    blockers: [
      {
        id: "exact-foundry-installation",
        foundryApi: "game.version + game.system.id + game.system.version",
        reason: "A Foundry 14.367 / D&D5e 5.3.3 disposable fixture is not currently available.",
      },
      {
        id: "dicebox-module-installation",
        foundryApi: "Hooks.once(\"ready\") + game.diceboxCampaignHelper.query",
        reason: "The reviewed DiceBox module is not installed in the selected exact target fixture.",
      },
      {
        id: "authority-and-reread",
        foundryApi: "game.users.activeGM + User permissions + fromUuid",
        reason: "GM/Player3 authority, sender semantics, native operation, and authoritative reread receipts require the running disposable fixture.",
      },
    ],
    nextGates: [
      "Provide an explicit disposable Foundry 14.367 data path and dbx-test-world manifest.",
      "Stage only the reviewed module.json and src/module.js into that fixture and record hashes.",
      "Run the guarded Node/browser lane after Hooks.once(\"ready\") and capture the canonical runtime-evidence query.",
      "Audit target/fingerprint/API consistency, then retain GM/Player3, native-operation, reread, recovery, and redacted receipts separately.",
      "Keep all Document creation/update/delete, Activity.use, ActiveEffect, and RegionBehavior operations disabled until their exact gates pass.",
    ],
  });
}

function apiCheck(
  id: string,
  foundryApi: string,
  purpose: string,
  requiredContexts: readonly ("GM" | "Player3")[],
  requiredArtifactKinds: readonly ("runtime-receipt" | "redacted-json" | "console" | "screenshot")[],
) {
  return {
    id,
    foundryApi,
    purpose,
    requiredContexts,
    requiredArtifactKinds,
    status: "required" as const,
    noWrite: true as const,
  };
}
