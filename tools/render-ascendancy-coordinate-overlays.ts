import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { createCurrentCampaignPackage } from "@dicebox/compiler";

const root = resolve(".");
const tramRendererArgument = process.argv.find((argument) => argument.startsWith("--tram-renderer="));
const candidateTramRenderer = tramRendererArgument?.slice("--tram-renderer=".length) ?? null;
const coreRendererArgument = process.argv.find((argument) => argument.startsWith("--core-renderer="));
const candidateCoreRenderer = coreRendererArgument?.slice("--core-renderer=".length) ?? null;
if (candidateTramRenderer && candidateCoreRenderer) throw new Error("Choose one candidate renderer per overlay invocation.");
const candidateRenderer = candidateTramRenderer ?? candidateCoreRenderer;
const candidateRoomId = candidateTramRenderer ? "dbx:room:ascendancy-tram-depot" : candidateCoreRenderer ? "dbx:room:central-core-control-chamber" : null;
const candidateKey = candidateRenderer
  ? basename(candidateRenderer).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()
  : null;
const outputDirectory = join(root, "outputs", candidateKey ? `m128-tram-renderer-grid-fit-${candidateKey}` : "m110-ascendancy-coordinate-overlays");
const packageData = createCurrentCampaignPackage();
const reviewOnlyRenderers = new Map([
  ["dbx:room:ascendancy-tram-depot", "assets/maps/ascendancy-tram-depot-v3.png"],
  // This is intentionally an overlay-only comparison of the old Core image.
  // It makes the missing west rail entry visible without promoting it.
  ["dbx:room:central-core-control-chamber", "assets/maps/ascendancy-central-core-control-chamber-v2.png"],
]);

const xml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const colorFor = (interaction: string) => ({
  "popup-personal": "#e8b4ff",
  "physical-cooperative": "#ffd166",
  "scene-controller": "#69dbff",
  "final-station": "#40c9a2",
  "teleport-entry": "#6bcBef",
  "teleport-exit": "#ff922b",
  "tram-anchor": "#748ffc",
}[interaction] ?? "#ffffff");

function overlaySvg(input: {
  readonly title: string;
  readonly imageData: string;
  readonly blueprint: (typeof packageData.spatialBlueprints)[number];
  readonly regions: (typeof packageData.regionPlans)[number];
}) {
  const walls = input.blueprint.walls.map((wall) => `<line x1="${wall.a.x}" y1="${wall.a.y}" x2="${wall.b.x}" y2="${wall.b.y}" stroke="#ff4d6d" stroke-width="8" opacity="0.86"/>`).join("");
  const anchors = input.blueprint.anchors.map((anchor) => {
    const stroke = anchor.kind === "door" ? "#00e5ff" : "#f8f9fa";
    const radius = Math.max(12, anchor.clearance / 2);
    return `<circle cx="${anchor.position.x}" cy="${anchor.position.y}" r="${radius}" fill="none" stroke="${stroke}" stroke-width="4" opacity="0.9"/><circle cx="${anchor.position.x}" cy="${anchor.position.y}" r="5" fill="${stroke}"/>`;
  }).join("");
  const regions = input.regions.regions.map((region) => `<rect x="${region.bounds.x}" y="${region.bounds.y}" width="${region.bounds.width}" height="${region.bounds.height}" fill="${colorFor(region.interaction)}" fill-opacity="0.13" stroke="${colorFor(region.interaction)}" stroke-width="3" stroke-dasharray="9 6"/>`).join("");
  const tram = input.regions.roomId === "dbx:room:ascendancy-tram-depot"
    ? `<rect x="420" y="210" width="660" height="570" fill="none" stroke="#00e5ff" stroke-width="5"/>
       ${Array.from({ length: 5 }, (_, index) => `<line x1="${420 + (index + 1) * 110}" y1="210" x2="${420 + (index + 1) * 110}" y2="780" stroke="#00e5ff" stroke-width="2" opacity="0.75"/>`).join("")}
       ${Array.from({ length: 5 }, (_, index) => `<line x1="420" y1="${210 + (index + 1) * 95}" x2="1080" y2="${210 + (index + 1) * 95}" stroke="#00e5ff" stroke-width="2" opacity="0.75"/>`).join("")}
       <line x1="1080" y1="447.5" x2="1512" y2="447.5" stroke="#00e5ff" stroke-width="6" opacity="0.9"/>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
  <title>${xml(input.title)} coordinate overlay</title>
  <image href="data:image/png;base64,${input.imageData}" x="0" y="0" width="1536" height="1024"/>
  ${regions}${walls}${anchors}${tram}
</svg>`;
}

await mkdir(outputDirectory, { recursive: true });
const receipt: Array<Record<string, unknown>> = [];
const roomsToOverlay = candidateRoomId
  ? packageData.campaign.rooms.filter((room) => room.roomId === candidateRoomId)
  : packageData.campaign.rooms;
for (const room of roomsToOverlay) {
  const asset = packageData.assets.bound.find((candidate) => candidate.roomId === room.roomId);
  const blueprint = packageData.spatialBlueprints.find((candidate) => candidate.blueprintId === room.spatialBlueprintId);
  const regions = packageData.regionPlans.find((candidate) => candidate.roomId === room.roomId);
  const renderer = candidateRenderer ?? asset?.path ?? reviewOnlyRenderers.get(room.roomId);
  if (!asset || !renderer || !blueprint || !regions) throw new Error(`Missing overlay input for ${room.roomId}.`);
  const rendererPath = resolve(root, renderer);
  const rendererBuffer = await readFile(rendererPath);
  const imageData = rendererBuffer.toString("base64");
  const file = join(outputDirectory, `${room.roomId.split(":").at(-1)}-overlay.svg`);
  await writeFile(file, overlaySvg({ title: room.label, imageData, blueprint, regions }), "utf8");
  receipt.push({ roomId: room.roomId, renderer, rendererPath, rendererSha256: createHash("sha256").update(rendererBuffer).digest("hex"), rendererStatus: candidateRenderer ? "candidate-unbound" : asset.status, rendererReviewOnly: candidateRenderer !== null || asset.path === null, overlay: file, walls: blueprint.walls.length, doors: blueprint.anchors.filter((anchor) => anchor.kind === "door").length, regions: regions.regions.length });
}
await writeFile(join(outputDirectory, "receipt.json"), `${JSON.stringify({ operation: "ascendancy.coordinate-overlay", status: "STATIC_REVIEW", packageId: packageData.packageId, candidateTramRenderer, candidateCoreRenderer, noWrite: true, rooms: receipt }, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify({ outputDirectory, rooms: receipt.length, noWrite: true })}\n`);
