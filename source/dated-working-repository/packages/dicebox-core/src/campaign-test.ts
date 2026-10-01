import { z } from "zod";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";

const foundryReadApis = [
  "Hooks.once(\"ready\")",
  "game.version + game.system.id + game.system.version",
  "game.users.activeGM / User permissions",
  "fromUuid | game.scenes.get",
  "scene.getEmbeddedCollection(\"Region\")",
  "RegionDocument.shapes | RegionDocument.behaviors",
  "region.getEmbeddedCollection(\"RegionBehavior\")",
  "CONFIG.RegionBehavior.dataModels | RegionBehaviorType.events",
] as const;

const sourceSchema = z.object({
  kind: z.literal("chat-campaign-source"),
  chatUrl: z.string().url(),
  sourceFilter: z.literal("original-campaign-design-after-prime-arachnid-defeat"),
  excludedMaterial: z.array(z.string().min(1)).min(1).max(8),
}).strict();

const memberSchema = z.object({
  actorId: StableDiceBoxIdSchema,
  name: z.string().min(1),
}).strict();

const teamSchema = z.object({
  teamId: StableDiceBoxIdSchema,
  label: z.string().min(1),
  members: z.array(memberSchema).length(2),
  roomId: StableDiceBoxIdSchema,
  stageIds: z.array(StableDiceBoxIdSchema).length(3),
}).strict();

const roomSchema = z.object({
  roomId: StableDiceBoxIdSchema,
  label: z.string().min(1),
  mapRole: z.enum(["team-puzzle-room", "tram-depot", "final-control-room"]),
  teamId: StableDiceBoxIdSchema.optional(),
  assetId: StableDiceBoxIdSchema,
  spatialBlueprintId: StableDiceBoxIdSchema,
  geometryOwner: z.literal("spatial-blueprint"),
  renderer: z.literal("scene-background"),
  gridlessRenderer: z.literal(true),
  foundryApis: z.array(z.string().min(1)).min(4).max(12),
}).strict();

const stageSchema = z.object({
  stageId: StableDiceBoxIdSchema,
  teamId: StableDiceBoxIdSchema,
  roomId: StableDiceBoxIdSchema,
  ordinal: z.number().int().min(1).max(3),
  kind: z.enum(["personal", "cooperative", "scene"]),
  owner: z.enum(["regionwright-minigame", "foundry-region"]),
  label: z.string().min(1),
  objective: z.string().min(1),
  participants: z.array(StableDiceBoxIdSchema).length(2),
  finalSpec: z.object({
    status: z.literal("final-chat-spec"),
    mechanic: z.enum([
      "frequency-calibration",
      "physical-frequency-circuit-matching",
      "circuit-routing-graph",
      "tram-repair-diagnostics",
      "in-scene-tram-troubleshooting",
      "rush-hour-tram-routing",
      "rune-memory-matching",
      "in-scene-rune-order-deduction",
      "heavy-rune-force-timing",
    ]),
    requirements: z.array(z.string().min(1)).min(1).max(8),
  }).strict(),
  foundryApis: z.array(z.string().min(1)).min(4).max(12),
  failurePolicy: z.enum(["bounded-reset", "near-lethal-nonlethal", "outcome-unknown-reread"]),
}).strict().superRefine((value, context) => {
  if (value.kind === "personal" && value.owner !== "regionwright-minigame") {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["owner"], message: "Personal stages are owned by the Regionwright integration boundary." });
  }
  if ((value.kind === "cooperative" || value.kind === "scene") && value.owner !== "foundry-region") {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["owner"], message: "Cooperative and Scene stages are owned by Foundry Regions." });
  }
});

const finaleSchema = z.object({
  stageId: StableDiceBoxIdSchema,
  roomId: StableDiceBoxIdSchema,
  label: z.literal("Six-person simultaneous activation"),
  participantIds: z.array(StableDiceBoxIdSchema).length(6),
  activationCount: z.literal(6),
  objective: z.string().min(1),
  foundryApis: z.array(z.string().min(1)).min(4).max(12),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

export const currentCampaignTestSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  scenarioId: StableDiceBoxIdSchema,
  title: z.literal("Ballad of Chauser Bill — Prime Arachnid aftermath test"),
  status: z.literal("read-only-test-fixture"),
  source: sourceSchema,
  teams: z.array(teamSchema).length(3),
  rooms: z.array(roomSchema).length(4),
  stages: z.array(stageSchema).length(9),
  finale: finaleSchema,
  foundryApis: z.array(z.string().min(1)).min(5).max(16),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict().superRefine((value, context) => {
  const unique = (values: readonly string[]) => new Set(values).size === values.length;
  if (!unique(value.teams.map((team) => team.teamId))) context.addIssue({ code: z.ZodIssueCode.custom, path: ["teams"], message: "Team IDs must be unique." });
  if (!unique(value.rooms.map((room) => room.roomId))) context.addIssue({ code: z.ZodIssueCode.custom, path: ["rooms"], message: "Room IDs must be unique." });
  if (!unique(value.stages.map((stage) => stage.stageId))) context.addIssue({ code: z.ZodIssueCode.custom, path: ["stages"], message: "Stage IDs must be unique." });

  const teamIds = new Set(value.teams.map((team) => team.teamId));
  const roomIds = new Set(value.rooms.map((room) => room.roomId));
  const stageIds = new Set(value.stages.map((stage) => stage.stageId));
  const actorIds = value.teams.flatMap((team) => team.members.map((member) => member.actorId));
  const actorIdSet = new Set(actorIds);
  if (actorIds.length !== 6 || actorIdSet.size !== actorIds.length) context.addIssue({ code: z.ZodIssueCode.custom, path: ["teams"], message: "The test fixture must contain six distinct player actors." });

  for (const [index, team] of value.teams.entries()) {
    if (!roomIds.has(team.roomId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["teams", index, "roomId"], message: "Team room must be declared." });
    for (const stageId of team.stageIds) if (!stageIds.has(stageId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["teams", index, "stageIds"], message: "Team stage must be declared." });
  }
  for (const [index, room] of value.rooms.entries()) {
    if (room.teamId !== undefined && !teamIds.has(room.teamId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["rooms", index, "teamId"], message: "Room team must be declared." });
  }
  for (const [index, stage] of value.stages.entries()) {
    if (!teamIds.has(stage.teamId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["stages", index, "teamId"], message: "Stage team must be declared." });
    if (!roomIds.has(stage.roomId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["stages", index, "roomId"], message: "Stage room must be declared." });
    if (stage.participants.some((actorId) => !actorIdSet.has(actorId))) context.addIssue({ code: z.ZodIssueCode.custom, path: ["stages", index, "participants"], message: "Stage participants must be declared player actors." });
  }
  if (!roomIds.has(value.finale.roomId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["finale", "roomId"], message: "Finale room must be declared." });
  if (value.finale.participantIds.some((actorId) => !actorIdSet.has(actorId))) context.addIssue({ code: z.ZodIssueCode.custom, path: ["finale", "participantIds"], message: "Finale participants must be declared player actors." });
});

export type CurrentCampaignTest = z.infer<typeof currentCampaignTestSchema>;

const id = (namespace: string, localKey: string) => createStableDiceBoxId(namespace, localKey);

const regionApis = [...foundryReadApis];

export function createCurrentCampaignTest(): CurrentCampaignTest {
  const rooms = {
    signal: id("room", "signal-frequency-chamber"),
    tram: id("room", "ascendancy-tram-depot"),
    rune: id("room", "rune-mechanism-chamber"),
    core: id("room", "central-core-control-chamber"),
  } as const;
  const teams = {
    aleisterSprocket: id("team", "aleister-sprocket"),
    daltonAndrew: id("team", "dalton-andrew"),
    lawsonTactal: id("team", "lawson-tactal"),
  } as const;
  const actors = {
    aleister: id("actor", "aleister"),
    sprocket: id("actor", "sprocket"),
    dalton: id("actor", "dalton"),
    andrew: id("actor", "andrew-mcconaughey"),
    lawson: id("actor", "lawson-burnheart"),
    tactal: id("actor", "tactal"),
  } as const;
  const stages = {
    frequency: id("stage", "aleister-frequency-calibration"),
    matching: id("stage", "aleister-sprocket-frequency-circuit-matching"),
    wireGrid: id("stage", "sprocket-wire-grid"),
    repair: id("stage", "dalton-tram-repair"),
    troubleshoot: id("stage", "dalton-andrew-troubleshooting"),
    logistics: id("stage", "andrew-tram-logistics"),
    memory: id("stage", "lawson-rune-memory"),
    order: id("stage", "lawson-tactal-rune-order"),
    slotting: id("stage", "tactal-heavy-slotting"),
  } as const;

  return currentCampaignTestSchema.parse({
    schemaVersion: "0.1.0",
    scenarioId: id("campaign-test", "chauser-bill-prime-arachnid-aftermath"),
    title: "Ballad of Chauser Bill — Prime Arachnid aftermath test",
    status: "read-only-test-fixture",
    source: {
      kind: "chat-campaign-source",
      chatUrl: "https://chatgpt.com/c/6a2dbc07-5518-83e8-ae7a-7ac6065acefe",
      sourceFilter: "original-campaign-design-after-prime-arachnid-defeat",
      excludedMaterial: [
        "later Regionwright setup notes not present in the original campaign design section",
        "cinematic/video reference images and their airlock/industrial-bay map studies",
      ],
    },
    teams: [
      { teamId: teams.aleisterSprocket, label: "Aleister + Sprocket", members: [{ actorId: actors.aleister, name: "Aleister" }, { actorId: actors.sprocket, name: "Sprocket" }], roomId: rooms.signal, stageIds: [stages.frequency, stages.matching, stages.wireGrid] },
      { teamId: teams.daltonAndrew, label: "Dalton + Andrew", members: [{ actorId: actors.dalton, name: "Dalton" }, { actorId: actors.andrew, name: "Andrew McConaughey" }], roomId: rooms.tram, stageIds: [stages.repair, stages.troubleshoot, stages.logistics] },
      { teamId: teams.lawsonTactal, label: "Lawson + Tactal", members: [{ actorId: actors.lawson, name: "Lawson Burnheart" }, { actorId: actors.tactal, name: "Tactal" }], roomId: rooms.rune, stageIds: [stages.memory, stages.order, stages.slotting] },
    ],
    rooms: [
      { roomId: rooms.signal, label: "Signal / Frequency Chamber", mapRole: "team-puzzle-room", teamId: teams.aleisterSprocket, assetId: id("asset", "map-signal-frequency-chamber"), spatialBlueprintId: id("blueprint", "signal-frequency-chamber"), geometryOwner: "spatial-blueprint", renderer: "scene-background", gridlessRenderer: true, foundryApis: regionApis },
      { roomId: rooms.tram, label: "Ascendancy Tram Depot", mapRole: "tram-depot", teamId: teams.daltonAndrew, assetId: id("asset", "map-ascendancy-tram-depot"), spatialBlueprintId: id("blueprint", "ascendancy-tram-depot"), geometryOwner: "spatial-blueprint", renderer: "scene-background", gridlessRenderer: true, foundryApis: regionApis },
      { roomId: rooms.rune, label: "Rune Mechanism Chamber", mapRole: "team-puzzle-room", teamId: teams.lawsonTactal, assetId: id("asset", "map-rune-mechanism-chamber"), spatialBlueprintId: id("blueprint", "rune-mechanism-chamber"), geometryOwner: "spatial-blueprint", renderer: "scene-background", gridlessRenderer: true, foundryApis: regionApis },
      { roomId: rooms.core, label: "Central Core Control Chamber", mapRole: "final-control-room", assetId: id("asset", "map-central-core-control-chamber"), spatialBlueprintId: id("blueprint", "central-core-control-chamber"), geometryOwner: "spatial-blueprint", renderer: "scene-background", gridlessRenderer: true, foundryApis: regionApis },
    ],
    stages: [
      { stageId: stages.frequency, teamId: teams.aleisterSprocket, roomId: rooms.signal, ordinal: 1, kind: "personal", owner: "regionwright-minigame", label: "Frequency Calibration", objective: "Aleister tunes all four frequency generators until each current waveform matches its target.", participants: [actors.aleister, actors.sprocket], finalSpec: { status: "final-chat-spec", mechanic: "frequency-calibration", requirements: ["Four separate generators.", "Discrete frequency 1–5, phase 1–5, and amplitude 1–3 controls.", "A correct station locks and reveals a unique signal signature for the physical cooperative puzzle.", "This stage does not perform station-to-circuit matching."] }, foundryApis: regionApis, failurePolicy: "bounded-reset" },
      { stageId: stages.matching, teamId: teams.aleisterSprocket, roomId: rooms.signal, ordinal: 2, kind: "cooperative", owner: "foundry-region", label: "Frequency-to-Circuit Matching", objective: "The pair uses visible logic clues before physically connecting calibrated stations to circuit boards; wrong guesses cause catastrophic resonance feedback sufficient to down, but not kill, a character.", participants: [actors.aleister, actors.sprocket], finalSpec: { status: "final-chat-spec", mechanic: "physical-frequency-circuit-matching", requirements: ["Calibrated stations and circuit boards are physical Scene objects.", "Regions handle the physical connections.", "The matching must not collapse into safe process of elimination.", "Wrong connections are visibly telegraphed and use bounded near-lethal nonlethal damage."] }, foundryApis: regionApis, failurePolicy: "near-lethal-nonlethal" },
      { stageId: stages.wireGrid, teamId: teams.aleisterSprocket, roomId: rooms.signal, ordinal: 3, kind: "personal", owner: "regionwright-minigame", label: "Circuit Routing", objective: "Sprocket routes the selected circuit as an actual graph from source to destination.", participants: [actors.aleister, actors.sprocket], finalSpec: { status: "final-chat-spec", mechanic: "circuit-routing-graph", requirements: ["Approximately 5×5 rotatable board.", "Component rotations expose active ports.", "Validation traverses compatible adjacent ports from SOURCE.", "DESTINATION must be reached and prohibited shorts/branches rejected."] }, foundryApis: regionApis, failurePolicy: "bounded-reset" },
      { stageId: stages.repair, teamId: teams.daltonAndrew, roomId: rooms.tram, ordinal: 1, kind: "personal", owner: "regionwright-minigame", label: "Tram Repair", objective: "Dalton repairs the disabled trams required for the depot puzzle.", participants: [actors.dalton, actors.andrew], finalSpec: { status: "final-chat-spec", mechanic: "tram-repair-diagnostics", requirements: ["The six trams are tram-B, tram-C, tram-O, tram-Q, tram-R, and tram-X.", "The diagnostic has POWER, CONTROL, BRAKES, and DRIVE subsystems.", "Each tram has roughly three faults and a component tray.", "Repairing a tram immediately makes it operational and available to Andrew."] }, foundryApis: regionApis, failurePolicy: "bounded-reset" },
      { stageId: stages.troubleshoot, teamId: teams.daltonAndrew, roomId: rooms.tram, ordinal: 2, kind: "cooperative", owner: "foundry-region", label: "In-Scene Tram Troubleshooting", objective: "Dalton and Andrew troubleshoot the repaired tram physically in the Scene; no unconfirmed popup minigame is introduced.", participants: [actors.dalton, actors.andrew], finalSpec: { status: "final-chat-spec", mechanic: "in-scene-tram-troubleshooting", requirements: ["The interaction remains physically around the tram.", "Dalton reads diagnostics while Andrew performs the retained percussive-maintenance interaction.", "The exact Region event sequence must be observed against the installed Foundry/Regionwright runtime before implementation."] }, foundryApis: regionApis, failurePolicy: "outcome-unknown-reread" },
      { stageId: stages.logistics, teamId: teams.daltonAndrew, roomId: rooms.tram, ordinal: 3, kind: "scene", owner: "foundry-region", label: "Tram Routing Controller", objective: "Andrew solves the logical Rush Hour tram-routing board in the Foundry Scene; Foundry Tiles are only its visual projection.", participants: [actors.dalton, actors.andrew], finalSpec: { status: "final-chat-spec", mechanic: "rush-hour-tram-routing", requirements: ["Canonical logical board is 6×6 and is represented by Scene rail geometry, Tiles, and Regions.", "Only repaired trams are selectable and legal movement follows axis, occupancy, and board bounds.", "The chat-authored six-move list is retained as provenance, but its R-left-1 step is geometrically illegal before Q-down-2 on the declared board.", "The engine's verified six-move solution must be generated by BFS and accepted only when every move is legal before Tile animation.", "The Scene canvas bounds and logical board footprint must be recorded together so anchors and Tiles cannot drift from the created map."] }, foundryApis: regionApis, failurePolicy: "bounded-reset" },
      { stageId: stages.memory, teamId: teams.lawsonTactal, roomId: rooms.rune, ordinal: 1, kind: "personal", owner: "regionwright-minigame", label: "Rune Memory", objective: "Lawson discovers the five duplicated rune designs in the memory board.", participants: [actors.lawson, actors.tactal], finalSpec: { status: "final-chat-spec", mechanic: "rune-memory-matching", requirements: ["Twenty cards arranged approximately 5×4.", "Five matching rune pairs plus ten unique decoy runes.", "Matching pairs remain face-up and emit the five rune IDs.", "Shuffle occurs once at initialization; reopening cannot reshuffle the board."] }, foundryApis: regionApis, failurePolicy: "bounded-reset" },
      { stageId: stages.order, teamId: teams.lawsonTactal, roomId: rooms.rune, ordinal: 2, kind: "cooperative", owner: "foundry-region", label: "Rune Order Deduction", objective: "Lawson and Tactal use environmental clues to determine the correct order of the five physical rune objects.", participants: [actors.lawson, actors.tactal], finalSpec: { status: "final-chat-spec", mechanic: "in-scene-rune-order-deduction", requirements: ["The five discovered IDs correspond to physical Scene objects.", "The pair determines the correct order in-scene.", "This is not converted into a JavaScript popup puzzle.", "The resolved order is the input to Tactal's slotting stage."] }, foundryApis: regionApis, failurePolicy: "outcome-unknown-reread" },
      { stageId: stages.slotting, teamId: teams.lawsonTactal, roomId: rooms.rune, ordinal: 3, kind: "personal", owner: "regionwright-minigame", label: "Heavy Rune Slotting", objective: "Tactal inserts the five heavy runes in the agreed order using a force/timing challenge.", participants: [actors.lawson, actors.tactal], finalSpec: { status: "final-chat-spec", mechanic: "heavy-rune-force-timing", requirements: ["Five heavy rune objects, five receiving sockets, and a force apparatus.", "The next rune must match the agreed order.", "Each rune takes approximately two successful force applications in the optimal timing zone.", "Bad timing costs progress on the current insertion but does not remove completed runes; wrong rune selection is rejected without a full reset."] }, foundryApis: regionApis, failurePolicy: "bounded-reset" },
    ],
    finale: {
      stageId: id("stage", "six-person-simultaneous-activation"),
      roomId: rooms.core,
      label: "Six-person simultaneous activation",
      participantIds: [actors.aleister, actors.sprocket, actors.dalton, actors.andrew, actors.lawson, actors.tactal],
      activationCount: 6,
      objective: "All six players activate their stations together to unlock the Core Security Room; no additional deduction is required.",
      foundryApis: regionApis,
      mutation: "disabled-until-exact-runtime-gate",
    },
    foundryApis: [
      "Hooks.once(\"ready\")",
      "game.version + game.system.id + game.system.version",
      "game.users.activeGM / User permissions",
      "fromUuid | game.scenes.get",
      "scene.getEmbeddedCollection(\"Region\")",
      "scene.getEmbeddedDocument(\"Region\", id)",
      "RegionDocument.shapes | RegionDocument.behaviors",
      "region.getEmbeddedCollection(\"RegionBehavior\")",
      "CONFIG.RegionBehavior.dataModels | RegionBehaviorType.events",
      "authoritative reread through fromUuid / embedded-document getters",
    ],
    mutation: "disabled-until-exact-runtime-gate",
  });
}

export function validateCurrentCampaignTest(input: unknown): CurrentCampaignTest {
  return currentCampaignTestSchema.parse(input);
}
