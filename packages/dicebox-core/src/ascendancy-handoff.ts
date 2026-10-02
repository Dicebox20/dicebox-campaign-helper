import { z } from "zod";
import { createStableDiceBoxId, StableDiceBoxIdSchema, type StableDiceBoxId } from "./identity.js";
import { createCurrentCampaignTest } from "./campaign-test.js";

const foundryApiSchema = z.string().min(1);
const sourceFileSchema = z.object({
  path: z.string().min(1),
  role: z.string().min(1),
}).strict();

const characterSchema = z.object({
  actorId: StableDiceBoxIdSchema,
  label: z.string().min(1),
  intendedOwner: z.literal("player-role"),
  runtimeUserId: z.null(),
}).strict();

const personalPuzzleSchema = z.object({
  puzzleId: StableDiceBoxIdSchema,
  externalId: z.string().min(1),
  characterId: StableDiceBoxIdSchema,
  /** Narrative role remains stable; this allowlist governs controller access. */
  authorizedControllerCharacterIds: z.array(StableDiceBoxIdSchema).min(1),
  pairId: StableDiceBoxIdSchema,
  stageOrder: z.literal(1).or(z.literal(3)),
  owner: z.enum(["regionwright-popup", "dicebox-scene"]),
  interaction: z.enum(["regionwright-browser-minigame", "foundry-scene-controller"]),
  regionwrightEntryPoint: z.string().min(1).nullable(),
  foundryApis: z.array(foundryApiSchema).min(3),
  popup: z.boolean(),
}).strict().superRefine((value, context) => {
  if (!value.authorizedControllerCharacterIds.includes(value.characterId)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["authorizedControllerCharacterIds"], message: "The narrative puzzle character must remain an authorized controller." });
  }
  const isScene = value.owner === "dicebox-scene";
  if (isScene !== (value.interaction === "foundry-scene-controller")) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["interaction"], message: "Scene ownership and interaction must agree." });
  }
  if (isScene === value.popup) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["popup"], message: "DiceBox Scene stages cannot be popup interactions." });
  }
  if (isScene !== (value.regionwrightEntryPoint === null)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["regionwrightEntryPoint"], message: "Only Regionwright-owned personal puzzles may have a Regionwright entry point." });
  }
});

const cooperativeStageSchema = z.object({
  cooperativeId: StableDiceBoxIdSchema,
  pairId: StableDiceBoxIdSchema,
  externalId: z.string().min(1),
  stageOrder: z.literal(2),
  owner: z.literal("dicebox-foundry-region"),
  interaction: z.literal("physical-scene-region"),
  popup: z.literal(false),
  regionFlagPath: z.literal("flags.regionwright.ascendancy.region"),
  handoffApi: z.string().min(1),
  foundryApis: z.array(foundryApiSchema).min(5),
}).strict();

const roomSchema = z.object({
  roomId: StableDiceBoxIdSchema,
  label: z.string().min(1),
  assetId: StableDiceBoxIdSchema,
  spatialBlueprintId: StableDiceBoxIdSchema,
  geometryOwner: z.literal("spatial-blueprint"),
  renderer: z.literal("scene-background"),
  foundryApis: z.array(foundryApiSchema).min(4),
  canvas: z.object({ width: z.number().int().positive(), height: z.number().int().positive() }).strict().nullable(),
  logicalBoard: z.object({
    rows: z.literal(6),
    columns: z.literal(6),
    origin: z.object({ x: z.number().finite(), y: z.number().finite() }).strict(),
    cellWidth: z.number().positive(),
    cellHeight: z.number().positive(),
    anchorCount: z.literal(36),
  }).strict().nullable(),
}).strict();

const progressionEdgeSchema = z.object({
  edgeId: StableDiceBoxIdSchema,
  fromId: StableDiceBoxIdSchema,
  toId: StableDiceBoxIdSchema,
  kind: z.enum(["personal-complete-to-cooperative", "cooperative-complete-to-personal", "pair-complete-to-final", "final-complete-to-core-unlocked"]),
}).strict();

export const ascendancyRegionwrightHandoffSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  handoffId: StableDiceBoxIdSchema,
  scenarioId: StableDiceBoxIdSchema,
  source: z.object({
    regionEditorRoot: z.string().min(1),
    moduleId: z.literal("regionwright"),
    moduleVersion: z.literal("0.1.4"),
    ascendancyVersion: z.literal(1),
    files: z.array(sourceFileSchema).length(5),
    apiRoot: z.literal('game.modules.get("regionwright")?.api?.premium?.ascendancy'),
    stateFlag: z.literal("flags.regionwright.ascendancy"),
    regionFlag: z.literal("flags.regionwright.ascendancy.region"),
    mapAnchorFlag: z.literal("flags.regionwright.ascendancy.anchors"),
    hooks: z.array(z.enum(["regionwright.ascendancyPuzzleComplete", "regionwright.ascendancyCooperativeStage", "regionwright.ascendancyCoreUnlocked"])).length(3),
    runtimeCertification: z.literal("source-observed-not-live-certified"),
  }).strict(),
  characters: z.array(characterSchema).length(6),
  personalPuzzles: z.array(personalPuzzleSchema).length(6),
  cooperativeStages: z.array(cooperativeStageSchema).length(3),
  finalActivation: z.object({
    stageId: StableDiceBoxIdSchema,
    prerequisitePairIds: z.array(StableDiceBoxIdSchema).length(3),
    stationCharacterIds: z.array(StableDiceBoxIdSchema).length(6),
    owner: z.literal("dicebox-foundry-region"),
    popup: z.literal(false),
    regionFlagPath: z.literal("flags.regionwright.ascendancy.region"),
    handoffApi: z.literal('game.modules.get("regionwright")?.api?.premium?.ascendancy.activateStation'),
    completionHook: z.literal("regionwright.ascendancyCoreUnlocked"),
    roundSemantics: z.object({
      mode: z.literal("same-round"),
      roundField: z.literal("finalActivation.activationRound"),
      roundInput: z.literal("explicit activationRound supplied by the Scene station event"),
      resetOnRoundChange: z.literal(true),
      completionRequiresSameRound: z.literal(true),
    }).strict(),
    foundryApis: z.array(foundryApiSchema).min(5),
  }).strict(),
  rooms: z.array(roomSchema).length(4),
  progressionEdges: z.array(progressionEdgeSchema).min(10),
  contract: z.object({
    readOnlyProgramSource: z.literal(true),
    regionwrightMustNotDuplicateRules: z.literal(true),
    cooperativePopup: z.literal(false),
    andrewsRushHourOwner: z.literal("dicebox-scene-engine"),
    daltonRepairOwner: z.literal("regionwright-popup"),
    macroOwnership: z.object({
      mode: z.literal("none-in-current-campaign"),
      macroIds: z.array(StableDiceBoxIdSchema).length(0),
      policy: z.literal("explicit-player-owner-if-introduced"),
      inheritedPermissionsAccepted: z.literal(false),
      foundryField: z.literal("ownership.default"),
      readbackRequired: z.literal(true),
    }).strict(),
    cooperativeStageHookSemantics: z.literal("regionwright.ascendancyCooperativeStage is an entry notification only; advancement completion is read from pairs[pairId].cooperativeComplete after advanceCooperativeStage"),
    stateAuthority: z.literal("Foundry Scene state mediated by active GM; DiceBox semantic truth remains program-side"),
    runtimeBindingPolicy: z.literal("semantic IDs canonical; external IDs and UUIDs unresolved until exact runtime"),
    mutation: z.literal("disabled-until-exact-runtime-gate"),
    completionReceipt: z.array(z.string().min(1)).min(3),
    foundryApis: z.array(foundryApiSchema).min(8),
  }).strict(),
}).strict();

export type AscendancyRegionwrightHandoff = z.infer<typeof ascendancyRegionwrightHandoffSchema>;

const id = (namespace: string, localKey: string) => createStableDiceBoxId(namespace, localKey);

const regionwrightApis = [
  "Hooks.once(\"ready\")",
  "game.modules.get(\"regionwright\")?.api?.premium?.ascendancy",
  "game.users.activeGM / User permissions",
  "fromUuid | game.scenes.get",
  "scene.getFlag(\"regionwright\", \"ascendancy\")",
  "scene.update({\"flags.regionwright.ascendancy\": state})",
  "Hooks.callAll(\"regionwright.ascendancyPuzzleComplete\", ...)"
] as const;

const regionApis = [
  "Hooks.once(\"ready\")",
  "game.users.activeGM / User permissions",
  "fromUuid | game.scenes.get",
  "scene.getEmbeddedCollection(\"Region\")",
  "scene.getEmbeddedDocument(\"Region\", id)",
  "RegionDocument.shapes | RegionDocument.behaviors",
  "region.getFlag(\"regionwright\", \"ascendancy\")",
  "scene.update({\"flags.regionwright.ascendancy\": state})",
] as const;

export function createAscendancyRegionwrightHandoff(): AscendancyRegionwrightHandoff {
  const campaign = createCurrentCampaignTest();
  const actors = {
    aleister: id("actor", "aleister"),
    sprocket: id("actor", "sprocket"),
    dalton: id("actor", "dalton"),
    andrew: id("actor", "andrew-mcconaughey"),
    lawson: id("actor", "lawson-burnheart"),
    tactal: id("actor", "tactal"),
  } as const;
  const pairs = {
    aleisterSprocket: id("pair", "aleister-sprocket"),
    daltonAndrew: id("pair", "dalton-andrew"),
    lawsonTactal: id("pair", "lawson-tactal"),
  } as const;
  const rooms = {
    signal: id("room", "signal-frequency-chamber"),
    tram: id("room", "ascendancy-tram-depot"),
    rune: id("room", "rune-mechanism-chamber"),
    core: id("room", "central-core-control-chamber"),
  } as const;
  const personal = {
    frequency: id("puzzle", "aleister-frequency"),
    circuit: id("puzzle", "sprocket-circuit"),
    repair: id("puzzle", "dalton-tram-repair"),
    routing: id("puzzle", "andrew-tram-routing"),
    memory: id("puzzle", "lawson-rune-memory"),
    slotting: id("puzzle", "tactal-rune-slotting"),
  } as const;
  const cooperative = {
    signal: id("cooperative", "aleister-sprocket-frequency-circuit"),
    tram: id("cooperative", "dalton-andrew-tram-troubleshooting"),
    rune: id("cooperative", "lawson-tactal-rune-order"),
  } as const;
  const finalStage = id("stage", "six-person-simultaneous-activation");
  const campaignRoom = (roomId: typeof rooms.signal) => {
    const room = campaign.rooms.find((candidate) => candidate.roomId === roomId);
    if (!room) throw new Error(`Campaign fixture is missing handoff room ${roomId}.`);
    return room;
  };

  const popup = (puzzleId: typeof personal.frequency, externalId: string, characterId: typeof actors.aleister, pairId: typeof pairs.aleisterSprocket, stageOrder: 1 | 3, authorizedControllerCharacterIds: readonly StableDiceBoxId[]) => ({
    puzzleId, externalId, characterId, authorizedControllerCharacterIds, pairId, stageOrder, owner: "regionwright-popup" as const,
    interaction: "regionwright-browser-minigame" as const,
    regionwrightEntryPoint: 'game.modules.get("regionwright")?.api?.premium?.ascendancy.open',
    foundryApis: [...regionwrightApis], popup: true,
  });
  const scenePersonal = ({ puzzleId, externalId, characterId, pairId, authorizedControllerCharacterIds }: { puzzleId: typeof personal.routing; externalId: string; characterId: typeof actors.andrew; pairId: typeof pairs.daltonAndrew; authorizedControllerCharacterIds: readonly StableDiceBoxId[] }) => ({
    puzzleId, externalId, characterId, authorizedControllerCharacterIds, pairId, stageOrder: 3 as const, owner: "dicebox-scene" as const,
    interaction: "foundry-scene-controller" as const, regionwrightEntryPoint: null, foundryApis: [...regionApis], popup: false,
  });

  return ascendancyRegionwrightHandoffSchema.parse({
    schemaVersion: "0.1.0",
    handoffId: id("handoff", "ascendancy-regionwright"),
    scenarioId: campaign.scenarioId,
    source: {
      regionEditorRoot: "C:\\Users\\rujie\\Documents\\Region Editor",
      moduleId: "regionwright",
      moduleVersion: "0.1.4",
      ascendancyVersion: 1,
      files: [
        { path: "premium/scripts/ascendancy-engine.js", role: "deterministic personal and progression engine" },
        { path: "premium/scripts/ascendancy.js", role: "Foundry adapter, flags, sockets, Regions, and API" },
        { path: "premium/scripts/premium-module.js", role: "module API registration" },
        { path: "premium/styles/ascendancy.css", role: "personal minigame presentation" },
        { path: "tests/ascendancy.test.mjs", role: "Regionwright engine and integration evidence" },
      ],
      apiRoot: 'game.modules.get("regionwright")?.api?.premium?.ascendancy',
      stateFlag: "flags.regionwright.ascendancy",
      regionFlag: "flags.regionwright.ascendancy.region",
      mapAnchorFlag: "flags.regionwright.ascendancy.anchors",
      hooks: ["regionwright.ascendancyPuzzleComplete", "regionwright.ascendancyCooperativeStage", "regionwright.ascendancyCoreUnlocked"],
      runtimeCertification: "source-observed-not-live-certified",
    },
    characters: [
      { actorId: actors.aleister, label: "Aleister", intendedOwner: "player-role", runtimeUserId: null },
      { actorId: actors.sprocket, label: "Sprocket", intendedOwner: "player-role", runtimeUserId: null },
      { actorId: actors.dalton, label: "Dalton", intendedOwner: "player-role", runtimeUserId: null },
      { actorId: actors.andrew, label: "Andrew McConaughey", intendedOwner: "player-role", runtimeUserId: null },
      { actorId: actors.lawson, label: "Lawson Burnheart", intendedOwner: "player-role", runtimeUserId: null },
      { actorId: actors.tactal, label: "Tactal", intendedOwner: "player-role", runtimeUserId: null },
    ],
    personalPuzzles: [
      popup(personal.frequency, "aleister-frequency", actors.aleister, pairs.aleisterSprocket, 1, [actors.aleister]),
      popup(personal.circuit, "sprocket-circuit", actors.sprocket, pairs.aleisterSprocket, 3, [actors.sprocket]),
      // Dalton remains the narrative/final-station role. Andrew's player is
      // additionally authorized for this weekend's absent-player repair run.
      popup(personal.repair, "dalton-tram-repair", actors.dalton, pairs.daltonAndrew, 1, [actors.dalton, actors.andrew]),
      scenePersonal({ puzzleId: personal.routing, externalId: "andrew-tram-routing", characterId: actors.andrew, pairId: pairs.daltonAndrew, authorizedControllerCharacterIds: [actors.andrew] }),
      popup(personal.memory, "lawson-rune-memory", actors.lawson, pairs.lawsonTactal, 1, [actors.lawson]),
      popup(personal.slotting, "tactal-rune-slotting", actors.tactal, pairs.lawsonTactal, 3, [actors.tactal]),
    ],
    cooperativeStages: [
      { cooperativeId: cooperative.signal, pairId: pairs.aleisterSprocket, externalId: "aleister-sprocket", stageOrder: 2, owner: "dicebox-foundry-region", interaction: "physical-scene-region", popup: false, regionFlagPath: "flags.regionwright.ascendancy.region", handoffApi: 'game.modules.get("regionwright")?.api?.premium?.ascendancy.advanceCooperativeStage', foundryApis: [...regionApis] },
      { cooperativeId: cooperative.tram, pairId: pairs.daltonAndrew, externalId: "dalton-andrew", stageOrder: 2, owner: "dicebox-foundry-region", interaction: "physical-scene-region", popup: false, regionFlagPath: "flags.regionwright.ascendancy.region", handoffApi: 'game.modules.get("regionwright")?.api?.premium?.ascendancy.advanceCooperativeStage', foundryApis: [...regionApis] },
      { cooperativeId: cooperative.rune, pairId: pairs.lawsonTactal, externalId: "lawson-tactal", stageOrder: 2, owner: "dicebox-foundry-region", interaction: "physical-scene-region", popup: false, regionFlagPath: "flags.regionwright.ascendancy.region", handoffApi: 'game.modules.get("regionwright")?.api?.premium?.ascendancy.advanceCooperativeStage', foundryApis: [...regionApis] },
    ],
    finalActivation: {
      stageId: finalStage,
      prerequisitePairIds: [pairs.aleisterSprocket, pairs.daltonAndrew, pairs.lawsonTactal],
      stationCharacterIds: [actors.aleister, actors.sprocket, actors.dalton, actors.andrew, actors.lawson, actors.tactal],
      owner: "dicebox-foundry-region", popup: false, regionFlagPath: "flags.regionwright.ascendancy.region",
      handoffApi: 'game.modules.get("regionwright")?.api?.premium?.ascendancy.activateStation',
      completionHook: "regionwright.ascendancyCoreUnlocked",
      roundSemantics: { mode: "same-round", roundField: "finalActivation.activationRound", roundInput: "explicit activationRound supplied by the Scene station event", resetOnRoundChange: true, completionRequiresSameRound: true },
      foundryApis: [...regionApis, "Hooks.callAll(\"regionwright.ascendancyCoreUnlocked\", ...)"],
    },
    rooms: [
      { roomId: rooms.signal, label: "Signal / Frequency Chamber", assetId: campaignRoom(rooms.signal).assetId, spatialBlueprintId: campaignRoom(rooms.signal).spatialBlueprintId, geometryOwner: "spatial-blueprint", renderer: "scene-background", foundryApis: [...regionApis], canvas: null, logicalBoard: null },
      { roomId: rooms.tram, label: "Ascendancy Tram Depot", assetId: campaignRoom(rooms.tram).assetId, spatialBlueprintId: campaignRoom(rooms.tram).spatialBlueprintId, geometryOwner: "spatial-blueprint", renderer: "scene-background", foundryApis: [...regionApis, "scene.getEmbeddedCollection(\"Tile\")", "scene.getEmbeddedCollection(\"Region\")", "scene.updateEmbeddedDocuments(\"Tile\", ...)", "scene.updateEmbeddedDocuments(\"Region\", ...)"], canvas: { width: 1536, height: 1024 }, logicalBoard: { rows: 6, columns: 6, origin: { x: 420, y: 210 }, cellWidth: 110, cellHeight: 95, anchorCount: 36 } },
      { roomId: rooms.rune, label: "Rune Mechanism Chamber", assetId: campaignRoom(rooms.rune).assetId, spatialBlueprintId: campaignRoom(rooms.rune).spatialBlueprintId, geometryOwner: "spatial-blueprint", renderer: "scene-background", foundryApis: [...regionApis], canvas: null, logicalBoard: null },
      { roomId: rooms.core, label: "Central Core Control Chamber", assetId: campaignRoom(rooms.core).assetId, spatialBlueprintId: campaignRoom(rooms.core).spatialBlueprintId, geometryOwner: "spatial-blueprint", renderer: "scene-background", foundryApis: [...regionApis], canvas: null, logicalBoard: null },
    ],
    progressionEdges: [
      { edgeId: id("edge", "frequency-to-signal-cooperative"), fromId: personal.frequency, toId: cooperative.signal, kind: "personal-complete-to-cooperative" },
      { edgeId: id("edge", "signal-cooperative-to-circuit"), fromId: cooperative.signal, toId: personal.circuit, kind: "cooperative-complete-to-personal" },
      { edgeId: id("edge", "repair-to-tram-cooperative"), fromId: personal.repair, toId: cooperative.tram, kind: "personal-complete-to-cooperative" },
      { edgeId: id("edge", "tram-cooperative-to-routing"), fromId: cooperative.tram, toId: personal.routing, kind: "cooperative-complete-to-personal" },
      { edgeId: id("edge", "memory-to-rune-cooperative"), fromId: personal.memory, toId: cooperative.rune, kind: "personal-complete-to-cooperative" },
      { edgeId: id("edge", "rune-cooperative-to-slotting"), fromId: cooperative.rune, toId: personal.slotting, kind: "cooperative-complete-to-personal" },
      { edgeId: id("edge", "aleister-sprocket-pair-to-final"), fromId: pairs.aleisterSprocket, toId: finalStage, kind: "pair-complete-to-final" },
      { edgeId: id("edge", "dalton-andrew-pair-to-final"), fromId: pairs.daltonAndrew, toId: finalStage, kind: "pair-complete-to-final" },
      { edgeId: id("edge", "lawson-tactal-pair-to-final"), fromId: pairs.lawsonTactal, toId: finalStage, kind: "pair-complete-to-final" },
      { edgeId: id("edge", "final-to-core-unlocked"), fromId: finalStage, toId: rooms.core, kind: "final-complete-to-core-unlocked" },
    ],
    contract: {
      readOnlyProgramSource: true,
      regionwrightMustNotDuplicateRules: true,
      cooperativePopup: false,
      andrewsRushHourOwner: "dicebox-scene-engine",
      daltonRepairOwner: "regionwright-popup",
      macroOwnership: { mode: "none-in-current-campaign", macroIds: [], policy: "explicit-player-owner-if-introduced", inheritedPermissionsAccepted: false, foundryField: "ownership.default", readbackRequired: true },
      cooperativeStageHookSemantics: "regionwright.ascendancyCooperativeStage is an entry notification only; advancement completion is read from pairs[pairId].cooperativeComplete after advanceCooperativeStage",
      stateAuthority: "Foundry Scene state mediated by active GM; DiceBox semantic truth remains program-side",
      runtimeBindingPolicy: "semantic IDs canonical; external IDs and UUIDs unresolved until exact runtime",
      mutation: "disabled-until-exact-runtime-gate",
      completionReceipt: ["regionwright.ascendancyPuzzleComplete", "regionwright.ascendancyCooperativeStage", "regionwright.ascendancyCoreUnlocked"],
      foundryApis: [...regionApis, "Hooks.callAll(\"regionwright.ascendancyCoreUnlocked\", ...)", "authoritative reread through fromUuid / embedded-document getters"],
    },
  });
}

export function validateAscendancyRegionwrightHandoff(input: unknown): AscendancyRegionwrightHandoff {
  return ascendancyRegionwrightHandoffSchema.parse(input);
}
