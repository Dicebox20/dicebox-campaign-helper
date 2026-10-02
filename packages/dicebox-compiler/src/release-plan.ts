import { z } from "zod";
import {
  capabilityIds,
  createCapabilityRegistry,
  EvidenceReceiptSchema,
  RuntimeProfileSchema,
  SemanticRefSchema,
  StableDiceBoxIdSchema,
  TARGET_DND5E_VERSION,
  TARGET_FOUNDRY_VERSION,
  createStableDiceBoxId,
  type CapabilityId,
  type EvidenceReceipt,
  type RuntimeProfile,
  type SemanticRef,
} from "@dicebox/core";

const releaseComponentKinds = [
  "journal",
  "spatial",
  "furnishing",
  "activity",
  "active-effect",
  "region-behavior",
] as const;

export const releaseFoundryBootstrap = Object.freeze({
  lifecycleHook: 'Hooks.once("ready")',
  moduleNamespace: "game.diceboxCampaignHelper",
  bootstrapFunction: "bootstrapDiceBoxCampaignHelper",
  readinessQuery: 'game.diceboxCampaignHelper.query({ kind: "readiness-report" })',
  mutation: "disabled-until-exact-runtime-gate",
} as const);

const releaseFoundryBootstrapSchema = z.object({
  lifecycleHook: z.literal('Hooks.once("ready")'),
  moduleNamespace: z.literal("game.diceboxCampaignHelper"),
  bootstrapFunction: z.literal("bootstrapDiceBoxCampaignHelper"),
  readinessQuery: z.literal('game.diceboxCampaignHelper.query({ kind: "readiness-report" })'),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

type ApiRole = "lifecycle" | "read" | "create" | "update" | "delete" | "reread";

const knownFoundryApiBindings = [
  'Hooks.once("ready")',
  "fromUuid | game.journal.get",
  "JournalEntry.create",
  'entry.createEmbeddedDocuments("JournalEntryPage", ...)',
  "JournalEntry.update",
  "fromUuid | game.scenes.get",
  "Scene.create",
  'scene.createEmbeddedDocuments("Wall", ...)',
  'scene.createEmbeddedDocuments("Region", ...)',
  "scene.walls | scene.regions",
  "FilePicker.browse(source, target, options)",
  'scene.createEmbeddedDocuments("Tile"|"Token"|"AmbientLight"|"AmbientSound"|"Drawing"|"Note", ...)',
  "scene.getEmbeddedCollection(documentName)",
  "scene.getEmbeddedDocument(documentName, id)",
  "fromUuid | game.items.get",
  'item.getEmbeddedDocument("Activity", id)',
  "item.system.activities.contents",
  "activity.use(usage, dialog, message)",
  "dnd5e.preUseActivity | dnd5e.postUseActivity",
  "fromUuid | game.actors.get | game.items.get",
  'parent.getEmbeddedCollection("ActiveEffect")',
  'parent.getEmbeddedDocument("ActiveEffect", id)',
  'parent.createEmbeddedDocuments("ActiveEffect", ...)',
  "effect.update(changed)",
  "effect.delete()",
  "fromUuid",
  'region.getEmbeddedCollection("RegionBehavior")',
  'region.getEmbeddedDocument("RegionBehavior", id)',
  "CONFIG.RegionBehavior.dataModels | RegionBehaviorType.events",
  'region.createEmbeddedDocuments("RegionBehavior", ...)',
  "behavior.update(changed)",
  "behavior.delete()",
  "fromUuid | region.getEmbeddedDocument",
] as const;
type FoundryApiBindingName = (typeof knownFoundryApiBindings)[number];

const releaseApiBindingSchema = z.object({
  role: z.enum(["lifecycle", "read", "create", "update", "delete", "reread"]),
  api: z.enum(knownFoundryApiBindings),
}).strict();

const releaseComponentSchema = z.object({
  componentId: StableDiceBoxIdSchema,
  planId: StableDiceBoxIdSchema,
  semantic: SemanticRefSchema,
  kind: z.enum(releaseComponentKinds),
  mechanicOwner: z.string().min(1),
  requiredCapabilities: z.array(z.enum(capabilityIds)),
  foundryApiFamily: z.string().min(1),
  foundryApiBindings: z.array(releaseApiBindingSchema),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

const releaseClosureSchema = z.object({
  semantic: z.literal("closed"),
  runtimeBindings: z.literal("deferred"),
  unresolved: z.array(z.enum(["foundry-runtime-bindings", "component-payloads"])),
}).strict();

export const releaseBundleSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  releaseId: StableDiceBoxIdSchema,
  releaseVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  campaign: SemanticRefSchema,
  target: z.object({
    foundryVersion: z.literal(TARGET_FOUNDRY_VERSION),
    systemId: z.literal("dnd5e"),
    systemVersion: z.literal(TARGET_DND5E_VERSION),
  }).strict(),
  bootstrap: releaseFoundryBootstrapSchema,
  components: z.array(releaseComponentSchema),
  closure: releaseClosureSchema,
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict().superRefine((value, context) => {
  if (value.campaign.kind !== "campaign") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["campaign", "kind"],
      message: "A release bundle must target a campaign semantic reference.",
    });
  }
  const componentIds = new Set<string>();
  for (const [index, component] of value.components.entries()) {
    if (componentIds.has(component.componentId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["components", index, "componentId"],
        message: "Release component IDs must be unique.",
      });
    }
    componentIds.add(component.componentId);
  }
  const sortedIds = [...componentIds].sort((left, right) => left.localeCompare(right));
  if (value.components.map((component) => component.componentId).join("\n") !== sortedIds.join("\n")) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["components"],
      message: "Release components must be sorted by stable component ID.",
    });
  }
});

export type ReleaseComponentKind = (typeof releaseComponentKinds)[number];
export type ReleaseBundle = z.infer<typeof releaseBundleSchema>;

export interface ReleaseBundleInput {
  readonly releaseId: ReleaseBundle["releaseId"];
  readonly releaseVersion: string;
  readonly campaign: SemanticRef;
  readonly components: readonly {
    readonly componentId: ReleaseBundle["components"][number]["componentId"];
    readonly planId: ReleaseBundle["components"][number]["planId"];
    readonly semantic: SemanticRef;
    readonly kind: ReleaseComponentKind;
  }[];
}

export interface ReleaseBundleReview {
  readonly status: "ready" | "blocked";
  readonly findings: readonly {
    readonly code: string;
    readonly severity: "blocker" | "warning";
    readonly message: string;
  }[];
  readonly checkedCapabilities: readonly CapabilityId[];
  readonly checkedAuthority: "none" | "gm";
  readonly checkedRuntime: RuntimeProfile;
  readonly exactTargetMatch: boolean;
  readonly noWrite: true;
}

export interface ReleaseBundlePreview {
  readonly bundle: ReleaseBundle;
  readonly review: ReleaseBundleReview;
  readonly receipt: EvidenceReceipt;
}

interface ReleaseComponentCatalogEntry {
  readonly expectedKinds: readonly SemanticRef["kind"][];
  readonly mechanicOwner: string;
  readonly foundryApiFamily: string;
  readonly requiredCapabilities: readonly CapabilityId[];
  readonly foundryApiBindings: readonly { readonly role: ApiRole; readonly api: FoundryApiBindingName }[];
}

const componentCatalog: Readonly<Record<ReleaseComponentKind, ReleaseComponentCatalogEntry>> = {
  journal: {
    expectedKinds: ["journal"],
    mechanicOwner: "native-foundry-journal-entry",
    foundryApiFamily: "JournalEntry and JournalEntryPage",
    requiredCapabilities: ["foundry.document.read", "foundry.document.write", "foundry.users.active-gm"],
    foundryApiBindings: [
      { role: "lifecycle", api: releaseFoundryBootstrap.lifecycleHook },
      { role: "read", api: "fromUuid | game.journal.get" },
      { role: "create", api: "JournalEntry.create" },
      { role: "create", api: 'entry.createEmbeddedDocuments("JournalEntryPage", ...)' },
      { role: "update", api: "JournalEntry.update" },
      { role: "reread", api: "fromUuid | game.journal.get" },
    ],
  },
  spatial: {
    expectedKinds: ["scene"],
    mechanicOwner: "native-foundry-scene-region",
    foundryApiFamily: "Scene, Wall, and Region documents",
    requiredCapabilities: ["foundry.scene.read", "foundry.scene.write", "foundry.region.read", "foundry.region.write", "foundry.users.active-gm"],
    foundryApiBindings: [
      { role: "lifecycle", api: releaseFoundryBootstrap.lifecycleHook },
      { role: "read", api: "fromUuid | game.scenes.get" },
      { role: "create", api: "Scene.create" },
      { role: "create", api: 'scene.createEmbeddedDocuments("Wall", ...)' },
      { role: "create", api: 'scene.createEmbeddedDocuments("Region", ...)' },
      { role: "reread", api: "fromUuid | game.scenes.get" },
      { role: "reread", api: "scene.walls | scene.regions" },
    ],
  },
  furnishing: {
    expectedKinds: ["scene"],
    mechanicOwner: "native-foundry-scene-placeables",
    foundryApiFamily: "Scene embedded placeable documents",
    requiredCapabilities: ["foundry.scene.placeable.read", "foundry.scene.placeable.write", "foundry.media.deploy", "foundry.users.active-gm"],
    foundryApiBindings: [
      { role: "lifecycle", api: releaseFoundryBootstrap.lifecycleHook },
      { role: "read", api: "fromUuid | game.scenes.get" },
      { role: "read", api: "FilePicker.browse(source, target, options)" },
      { role: "create", api: 'scene.createEmbeddedDocuments("Tile"|"Token"|"AmbientLight"|"AmbientSound"|"Drawing"|"Note", ...)' },
      { role: "reread", api: "scene.getEmbeddedCollection(documentName)" },
      { role: "reread", api: "scene.getEmbeddedDocument(documentName, id)" },
    ],
  },
  activity: {
    expectedKinds: ["item"],
    mechanicOwner: "native-dnd5e-activity",
    foundryApiFamily: "D&D5e Item Activity",
    requiredCapabilities: ["foundry.document.read", "dnd5e.activities", "dnd5e.activity-hooks", "foundry.users.active-gm"],
    foundryApiBindings: [
      { role: "lifecycle", api: releaseFoundryBootstrap.lifecycleHook },
      { role: "read", api: "fromUuid | game.items.get" },
      { role: "read", api: 'item.getEmbeddedDocument("Activity", id)' },
      { role: "read", api: "item.system.activities.contents" },
      { role: "update", api: "activity.use(usage, dialog, message)" },
      { role: "lifecycle", api: "dnd5e.preUseActivity | dnd5e.postUseActivity" },
      { role: "reread", api: "fromUuid | game.items.get" },
    ],
  },
  "active-effect": {
    expectedKinds: ["actor", "item"],
    mechanicOwner: "native-foundry-active-effect",
    foundryApiFamily: "Actor/Item ActiveEffect embedded documents",
    requiredCapabilities: ["foundry.document.read", "foundry.document.write", "foundry.users.active-gm"],
    foundryApiBindings: [
      { role: "lifecycle", api: releaseFoundryBootstrap.lifecycleHook },
      { role: "read", api: "fromUuid | game.actors.get | game.items.get" },
      { role: "read", api: 'parent.getEmbeddedCollection("ActiveEffect")' },
      { role: "read", api: 'parent.getEmbeddedDocument("ActiveEffect", id)' },
      { role: "create", api: 'parent.createEmbeddedDocuments("ActiveEffect", ...)' },
      { role: "update", api: "effect.update(changed)" },
      { role: "delete", api: "effect.delete()" },
      { role: "reread", api: "fromUuid | game.actors.get | game.items.get" },
    ],
  },
  "region-behavior": {
    expectedKinds: ["region"],
    mechanicOwner: "native-foundry-region-behavior",
    foundryApiFamily: "RegionDocument and RegionBehavior",
    requiredCapabilities: ["foundry.region.read", "foundry.region.write", "foundry.users.active-gm"],
    foundryApiBindings: [
      { role: "lifecycle", api: releaseFoundryBootstrap.lifecycleHook },
      { role: "read", api: "fromUuid" },
      { role: "read", api: 'region.getEmbeddedCollection("RegionBehavior")' },
      { role: "read", api: 'region.getEmbeddedDocument("RegionBehavior", id)' },
      { role: "read", api: "CONFIG.RegionBehavior.dataModels | RegionBehaviorType.events" },
      { role: "create", api: 'region.createEmbeddedDocuments("RegionBehavior", ...)' },
      { role: "update", api: "behavior.update(changed)" },
      { role: "delete", api: "behavior.delete()" },
      { role: "reread", api: "fromUuid | region.getEmbeddedDocument" },
    ],
  },
};

function sortedUniqueCapabilities(kinds: readonly ReleaseComponentKind[]): CapabilityId[] {
  return [...new Set(kinds.flatMap((kind) => componentCatalog[kind].requiredCapabilities))]
    .sort((left, right) => left.localeCompare(right));
}

function createComponent(input: ReleaseBundleInput["components"][number]): ReleaseBundle["components"][number] {
  const catalog = componentCatalog[input.kind];
  if (!catalog.expectedKinds.includes(input.semantic.kind)) {
    throw new Error(`Release component ${input.componentId} of kind ${input.kind} requires semantic kind ${catalog.expectedKinds.join(" or ")}.`);
  }
  return {
    componentId: input.componentId,
    planId: input.planId,
    semantic: input.semantic,
    kind: input.kind,
    mechanicOwner: catalog.mechanicOwner,
    requiredCapabilities: [...catalog.requiredCapabilities].sort((left, right) => left.localeCompare(right)),
    foundryApiFamily: catalog.foundryApiFamily,
    foundryApiBindings: catalog.foundryApiBindings.map((binding) => ({ ...binding })),
    mutation: "disabled-until-exact-runtime-gate",
  };
}

export function createReleaseBundle(input: ReleaseBundleInput): ReleaseBundle {
  const components = input.components
    .map(createComponent)
    .sort((left, right) => left.componentId.localeCompare(right.componentId));
  return releaseBundleSchema.parse({
    schemaVersion: "0.1.0",
    releaseId: input.releaseId,
    releaseVersion: input.releaseVersion,
    campaign: input.campaign,
    target: {
      foundryVersion: TARGET_FOUNDRY_VERSION,
      systemId: "dnd5e",
      systemVersion: TARGET_DND5E_VERSION,
    },
    bootstrap: releaseFoundryBootstrap,
    components,
    closure: {
      semantic: "closed",
      runtimeBindings: "deferred",
      unresolved: ["foundry-runtime-bindings", "component-payloads"],
    },
    mutation: "disabled-until-exact-runtime-gate",
  });
}

function assertCatalogIntegrity(bundle: ReleaseBundle): void {
  for (const component of bundle.components) {
    const catalog = componentCatalog[component.kind];
    if (!catalog.expectedKinds.includes(component.semantic.kind)) {
      throw new Error(`Release component ${component.componentId} has an incompatible semantic kind.`);
    }
    const expectedCapabilities = [...catalog.requiredCapabilities].sort((left, right) => left.localeCompare(right));
    if (JSON.stringify(component.requiredCapabilities) !== JSON.stringify(expectedCapabilities)) {
      throw new Error(`Release component ${component.componentId} has a tampered capability contract.`);
    }
    if (component.mechanicOwner !== catalog.mechanicOwner || component.foundryApiFamily !== catalog.foundryApiFamily) {
      throw new Error(`Release component ${component.componentId} has a tampered ownership or API-family contract.`);
    }
    if (JSON.stringify(component.foundryApiBindings) !== JSON.stringify(catalog.foundryApiBindings)) {
      throw new Error(`Release component ${component.componentId} has a tampered Foundry API binding contract.`);
    }
  }
  if (bundle.closure.runtimeBindings !== "deferred"
    || JSON.stringify(bundle.closure.unresolved) !== JSON.stringify(["foundry-runtime-bindings", "component-payloads"])) {
    throw new Error("Release closure must preserve deferred runtime bindings and component payload markers.");
  }
}

export function validateReleaseBundle(input: unknown): ReleaseBundle {
  const bundle = releaseBundleSchema.parse(input);
  assertCatalogIntegrity(bundle);
  return bundle;
}

function finding(code: string, severity: "blocker" | "warning", message: string) {
  return { code, severity, message } as const;
}

function createPreviewReceipt(bundle: ReleaseBundle, authority: "none" | "gm", observedAt: string): EvidenceReceipt {
  return EvidenceReceiptSchema.parse({
    receiptId: createStableDiceBoxId("receipt", `${bundle.releaseId.split(":").at(-1) ?? "release"}-preview`),
    operation: "release-bundle.preview",
    status: "previewed",
    evidenceClass: "deterministic",
    authority,
    semanticRefs: [bundle.campaign, ...bundle.components.map((component) => component.semantic)],
    observedAt,
    notes: [
      "Preview only; no Hooks.once(\"ready\") callback or Foundry Document API was invoked.",
      "The manifest names official Foundry API bindings but keeps runtime bindings, payloads, and mutation disabled.",
      "A runtime binding and authoritative reread receipt are required before a release can be applied.",
    ],
  });
}

export function previewReleaseBundle(
  input: unknown,
  runtime: RuntimeProfile,
  options: { readonly authority?: "none" | "gm"; readonly observedAt: string },
): ReleaseBundlePreview {
  const bundle = validateReleaseBundle(input);
  const parsedRuntime = RuntimeProfileSchema.parse(runtime);
  const authority = options.authority ?? "none";
  const registry = createCapabilityRegistry(parsedRuntime);
  const findings: ReturnType<typeof finding>[] = [];
  const requiredCapabilities = sortedUniqueCapabilities(bundle.components.map((component) => component.kind));

  if (parsedRuntime.phase !== "ready") {
    findings.push(finding("RUNTIME_NOT_READY", "blocker", "The exact Foundry runtime has not reached the ready phase."));
  }
  if (parsedRuntime.foundryVersion !== TARGET_FOUNDRY_VERSION) {
    findings.push(finding("FOUNDRY_VERSION_MISMATCH", "blocker", `Expected Foundry ${TARGET_FOUNDRY_VERSION}.`));
  }
  if (parsedRuntime.systemId !== "dnd5e" || parsedRuntime.systemVersion !== TARGET_DND5E_VERSION) {
    findings.push(finding("SYSTEM_VERSION_MISMATCH", "blocker", `Expected dnd5e ${TARGET_DND5E_VERSION}.`));
  }
  for (const capabilityId of requiredCapabilities) {
    const support = registry.supports(capabilityId);
    if (support.state !== "available") {
      findings.push(finding(
        `${capabilityId.toUpperCase().replaceAll(".", "_")}_UNAVAILABLE`,
        "blocker",
        support.reason,
      ));
    }
  }
  if (authority !== "gm") {
    findings.push(finding("GM_AUTHORITY_REQUIRED", "blocker", "A release apply candidate requires an active authorized GM."));
  }
  if (bundle.closure.runtimeBindings === "deferred") {
    findings.push(finding("RUNTIME_BINDINGS_DEFERRED", "blocker", "Foundry UUID/document bindings require exact-runtime resolution and authoritative reread."));
  }
  if (bundle.closure.unresolved.length > 0) {
    findings.push(finding("RELEASE_CLOSURE_INCOMPLETE", "blocker", "Component payloads and runtime bindings are not part of this static manifest."));
  }

  return {
    bundle,
    review: {
      status: findings.some((item) => item.severity === "blocker") ? "blocked" : "ready",
      findings,
      checkedCapabilities: requiredCapabilities,
      checkedAuthority: authority,
      checkedRuntime: parsedRuntime,
      exactTargetMatch: parsedRuntime.phase === "ready"
        && parsedRuntime.foundryVersion === TARGET_FOUNDRY_VERSION
        && parsedRuntime.systemId === "dnd5e"
        && parsedRuntime.systemVersion === TARGET_DND5E_VERSION,
      noWrite: true,
    },
    receipt: createPreviewReceipt(bundle, authority, options.observedAt),
  };
}
