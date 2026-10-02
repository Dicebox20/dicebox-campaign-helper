import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  attestApprovedAssetBytes,
  createApprovedAsset,
  createApprovedAssetManifest,
  createAssetAttestationGate,
  createCampaignHelperMapLabPackage,
  createCampaignHelperMapLabPlan,
  validateCampaignHelperMapLabPackage,
} from "@dicebox/compiler";

const root = resolve(import.meta.dirname, "..");
const assetPath = "assets/testing/campaign-helper-map-lab-v1.svg";
const assetOutput = resolve(root, assetPath);
const packageOutput = resolve(root, "packages/dicebox-compiler/campaign-helper-map-lab-package.json");
const observedAt = "2026-09-06T00:00:00.000Z";

function renderSvg(): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">',
    '  <title>Campaign Helper Map Lab</title>',
    '  <desc>Neutral renderer-only background for the Campaign Helper Map Lab; geometry and state are defined outside the image.</desc>',
    '  <rect width="1536" height="1024" fill="#111827"/>',
    '  <rect x="24" y="24" width="1488" height="976" rx="18" fill="#172033" stroke="#8aa4c8" stroke-width="8"/>',
    '  <rect x="72" y="88" width="1392" height="100" rx="16" fill="#22304a" stroke="#4f6b93" stroke-width="2"/>',
    '  <text x="768" y="132" fill="#e5edf8" font-family="sans-serif" font-size="32" font-weight="700" text-anchor="middle" letter-spacing="4">CAMPAIGN HELPER MAP LAB</text>',
    '  <text x="768" y="162" fill="#9db4d3" font-family="sans-serif" font-size="16" text-anchor="middle" letter-spacing="2">LOCAL BLUEPRINT / RENDERER SEPARATION FIXTURE</text>',
    '  <text x="768" y="300" fill="#9db4d3" font-family="sans-serif" font-size="18" text-anchor="middle" letter-spacing="3">SEQUENCE INPUTS</text>',
    '  <g fill="#263b5a" stroke="#7aa2d6" stroke-width="4">',
    '    <rect x="280" y="412" width="160" height="200" rx="16"/>',
    '    <rect x="520" y="412" width="160" height="200" rx="16"/>',
    '    <rect x="760" y="412" width="160" height="200" rx="16"/>',
    '    <rect x="1000" y="412" width="160" height="200" rx="16"/>',
    '  </g>',
    '  <g fill="#b9d8ff" font-family="sans-serif" font-size="40" font-weight="700" text-anchor="middle">',
    '    <text x="360" y="525">A</text>',
    '    <text x="600" y="525">B</text>',
    '    <text x="840" y="525">C</text>',
    '    <text x="1080" y="525">D</text>',
    '  </g>',
    '  <g fill="#172033" stroke="#d7a95d" stroke-width="5">',
    '    <rect x="1360" y="360" width="120" height="304" rx="12"/>',
    '  </g>',
    '  <text x="1420" y="492" fill="#f7dca5" font-family="sans-serif" font-size="18" font-weight="700" text-anchor="middle" transform="rotate(90 1420 492)">LOCKED GATE</text>',
    '  <circle cx="24" cy="512" r="18" fill="#79d2ad" stroke="#d4f7e6" stroke-width="4"/>',
    '  <text x="90" y="520" fill="#9db4d3" font-family="sans-serif" font-size="16">ENTRY</text>',
    '  <text x="768" y="824" fill="#7087a8" font-family="sans-serif" font-size="16" text-anchor="middle" letter-spacing="2">VISUAL LAYER ONLY — NO GRID / NO PUZZLE STATE / NO FOUNDRY IDENTITY</text>',
    '</svg>',
    '',
  ].join("\n");
}

const plan = createCampaignHelperMapLabPlan();
const svgBytes = Buffer.from(renderSvg(), "utf8");
const sha256 = createHash("sha256").update(svgBytes).digest("hex");
const asset = createApprovedAsset({
  assetId: plan.visual.assetId,
  role: "background",
  label: "Campaign Helper Map Lab neutral background",
  locator: plan.visual.assetPath,
  mimeType: plan.visual.mimeType,
  sha256,
  byteLength: svgBytes.byteLength,
  width: plan.visual.width,
  height: plan.visual.height,
  provenance: "Generated from the typed Campaign Helper Map Lab plan; visual renderer only; no external runtime code copied.",
  variants: [],
});
const assetManifest = createApprovedAssetManifest({
  manifestId: "dbx:manifest:campaign-helper-map-lab-v1",
  assets: [asset],
});
const attestation = await attestApprovedAssetBytes(asset, svgBytes, { observedAt });
const assetAttestationGate = createAssetAttestationGate({
  manifest: assetManifest,
  requiredAssetIds: [asset.assetId],
  dependentDocumentIds: [],
  attestations: [attestation],
  observedAt,
});
const packageData = createCampaignHelperMapLabPackage({ plan, assetManifest, assetAttestationGate });
validateCampaignHelperMapLabPackage(packageData);

mkdirSync(dirname(assetOutput), { recursive: true });
mkdirSync(dirname(packageOutput), { recursive: true });
writeFileSync(assetOutput, svgBytes);
writeFileSync(packageOutput, `${JSON.stringify(packageData, null, 2)}\n`, "utf8");

process.stdout.write(`${JSON.stringify({
  operation: packageData.operation,
  status: packageData.status,
  assetPath,
  assetSha256: sha256,
  assetByteLength: svgBytes.byteLength,
  packageOutput: "packages/dicebox-compiler/campaign-helper-map-lab-package.json",
  blueprintId: plan.blueprint.blueprintId,
  wallCount: plan.blueprint.walls.length,
  regionCount: plan.blueprint.regions.length,
  anchorCount: plan.blueprint.anchors.length,
  sequenceInputCount: plan.sequenceGate.inputAnchorIds.length,
  attestationStatus: assetAttestationGate.status,
  noWrite: packageData.noWrite,
  mutation: packageData.mutation,
}, null, 2)}\n`);
