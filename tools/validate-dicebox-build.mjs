import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const BUILD_CONTRACT = "dicebox-scene-injector-build/v2";
export const DEFAULT_SCALE_PROFILE = "battlemap-120";

const REQUIRED_MARKERS = [
  ["build contract", /DICEBOX_BUILD_CONTRACT:\s*dicebox-scene-injector-build\/v2/i],
  ["single macro", /DICEBOX_SINGLE_MACRO:\s*true/i],
  ["scene id", /DICEBOX_SCENE_ID:\s*[^\s]+/i],
  ["art mode", /DICEBOX_ART_MODE:\s*(embedded-webp|embedded-png|verified-path)/i],
  ["workflow", /DICEBOX_WORKFLOW:\s*PREPARE\s*->\s*RENDER\s*->\s*INSPECT\s*->\s*APPROVE\s*->\s*BUILD/i],
  ["scale profile", /DICEBOX_SCALE_PROFILE:\s*(battlemap-120|explicit-exception)/i],
  ["grid type", /DICEBOX_GRID_TYPE:\s*gridless/i],
  ["grid size", /DICEBOX_GRID_SIZE:\s*\d+/i],
  ["grid distance", /DICEBOX_GRID_DISTANCE:\s*\d+(?:\.\d+)?/i],
  ["grid units", /DICEBOX_GRID_UNITS:\s*[A-Za-z]+/i],
  ["logical size", /DICEBOX_LOGICAL_SIZE:\s*\d+x\d+/i],
  ["scene pixels", /DICEBOX_SCENE_PIXELS:\s*\d+x\d+/i],
  ["token footprint policy", /DICEBOX_TOKEN_FOOTPRINT_POLICY:\s*system-size/i],
  ["token art scale policy", /DICEBOX_TOKEN_ART_SCALE_POLICY:\s*visual-only/i],
];

const FORBIDDEN_PATTERNS = [
  ["eval", /\beval\s*\(/],
  ["new Function", /\bnew\s+Function\s*\(/],
  ["raw WebSocket", /\bnew\s+WebSocket\s*\(/],
];

function markerValue(macro, label) {
  const match = macro.match(new RegExp(`DICEBOX_${label}:\\s*([^\\n\\r]+)`, "i"));
  return match?.[1]?.trim() ?? null;
}

function parsePair(value) {
  const match = String(value ?? "").match(/^(\d+)x(\d+)$/i);
  if (!match) return null;
  return { a: Number(match[1]), b: Number(match[2]) };
}

function parseSceneScale(macro) {
  const block = macro.match(/const\s+DICEBOX_SCENE_SCALE\s*=\s*Object\.freeze\(\{([\s\S]{0,1200}?)\}\)\s*;/);
  if (!block) return null;
  const body = block[1];
  const number = key => {
    const match = body.match(new RegExp(`\\b${key}\\s*:\\s*(\\d+(?:\\.\\d+)?)\\b`));
    return match ? Number(match[1]) : null;
  };
  const string = key => {
    const match = body.match(new RegExp(`\\b${key}\\s*:\\s*["']([^"']+)["']`));
    return match?.[1] ?? null;
  };
  return {
    gridType: number("gridType"),
    gridSize: number("gridSize"),
    distance: number("distance"),
    units: string("units"),
    logicalColumns: number("logicalColumns"),
    logicalRows: number("logicalRows"),
    width: number("width"),
    height: number("height"),
  };
}

function hasScaleReferences(macro) {
  const required = [
    /\bwidth\s*:\s*DICEBOX_SCENE_SCALE\.width\b/,
    /\bheight\s*:\s*DICEBOX_SCENE_SCALE\.height\b/,
    /\btype\s*:\s*DICEBOX_SCENE_SCALE\.gridType\b/,
    /\bsize\s*:\s*DICEBOX_SCENE_SCALE\.gridSize\b/,
    /\bdistance\s*:\s*DICEBOX_SCENE_SCALE\.distance\b/,
    /\bunits\s*:\s*DICEBOX_SCENE_SCALE\.units\b/,
  ];
  return required.every(pattern => pattern.test(macro));
}

export function validateDiceboxBuild({ artifactPath, source }) {
  const violations = [];
  const ext = path.extname(artifactPath ?? "").toLowerCase();
  if (ext !== ".md") violations.push("BUILD artifact must be exactly one Markdown (.md) file.");
  if (typeof source !== "string" || source.length === 0) {
    violations.push("BUILD artifact must contain text.");
    return { status: "FAIL", contract: BUILD_CONTRACT, violations };
  }

  const blocks = [...source.matchAll(/```([^\n]*)\n([\s\S]*?)```/g)];
  if (blocks.length !== 1) {
    violations.push("BUILD artifact must contain exactly one fenced code block: the single injection macro.");
  }

  let macro = "";
  if (blocks.length === 1) {
    const language = blocks[0][1].trim().toLowerCase();
    if (!new Set(["javascript", "js"]).has(language)) {
      violations.push("The single fenced code block must be JavaScript.");
    }
    macro = blocks[0][2];
  }

  for (const [label, pattern] of REQUIRED_MARKERS) {
    if (!pattern.test(macro)) violations.push(`Missing required DiceBox ${label} marker.`);
  }
  for (const [label, pattern] of FORBIDDEN_PATTERNS) {
    if (pattern.test(macro)) violations.push(`Forbidden execution primitive detected: ${label}.`);
  }

  const artMode = markerValue(macro, "ART_MODE")?.toLowerCase();
  if (artMode?.startsWith("embedded-")) {
    if (!/\batob\s*\(/.test(macro)) {
      violations.push("Embedded-art BUILD macro must reassemble/decode its image payload inside the same macro.");
    }
    if (!/Uint8Array/.test(macro)) {
      violations.push("Embedded-art BUILD macro must materialize decoded bytes inside the same macro.");
    }
  }

  const scaleProfile = markerValue(macro, "SCALE_PROFILE")?.toLowerCase();
  const markerGridType = markerValue(macro, "GRID_TYPE")?.toLowerCase();
  const markerGridSize = Number(markerValue(macro, "GRID_SIZE"));
  const markerDistance = Number(markerValue(macro, "GRID_DISTANCE"));
  const markerUnits = markerValue(macro, "GRID_UNITS")?.toLowerCase();
  const logical = parsePair(markerValue(macro, "LOGICAL_SIZE"));
  const scenePixels = parsePair(markerValue(macro, "SCENE_PIXELS"));
  const scale = parseSceneScale(macro);

  if (markerGridType && markerGridType !== "gridless") {
    violations.push("DiceBox battle-map BUILDs must be gridless unless an explicit scale exception is approved.");
  }
  if (logical && (logical.a < 1 || logical.b < 1)) {
    violations.push("Logical map dimensions must be positive whole grid-space counts.");
  }
  if (scenePixels && (scenePixels.a < 1 || scenePixels.b < 1)) {
    violations.push("Scene pixel dimensions must be positive whole numbers.");
  }

  if (!scale) {
    violations.push("BUILD macro must define one DICEBOX_SCENE_SCALE Object.freeze constant as the scale source of truth.");
  } else {
    const numericKeys = ["gridType", "gridSize", "distance", "logicalColumns", "logicalRows", "width", "height"];
    for (const key of numericKeys) {
      if (!Number.isFinite(scale[key])) violations.push(`DICEBOX_SCENE_SCALE is missing numeric ${key}.`);
    }
    if (!scale.units) violations.push("DICEBOX_SCENE_SCALE is missing units.");

    if (scale.gridType !== 0) violations.push("DICEBOX_SCENE_SCALE.gridType must be 0 (Gridless).");
    if (markerGridSize && scale.gridSize !== markerGridSize) violations.push("Grid-size marker and DICEBOX_SCENE_SCALE.gridSize disagree.");
    if (markerDistance && scale.distance !== markerDistance) violations.push("Grid-distance marker and DICEBOX_SCENE_SCALE.distance disagree.");
    if (markerUnits && scale.units?.toLowerCase() !== markerUnits) violations.push("Grid-units marker and DICEBOX_SCENE_SCALE.units disagree.");
    if (logical && (scale.logicalColumns !== logical.a || scale.logicalRows !== logical.b)) violations.push("Logical-size marker and DICEBOX_SCENE_SCALE logical dimensions disagree.");
    if (scenePixels && (scale.width !== scenePixels.a || scale.height !== scenePixels.b)) violations.push("Scene-pixels marker and DICEBOX_SCENE_SCALE dimensions disagree.");
    if (Number.isFinite(scale.logicalColumns) && Number.isFinite(scale.gridSize) && scale.width !== scale.logicalColumns * scale.gridSize) {
      violations.push("Scene width must equal logicalColumns × gridSize.");
    }
    if (Number.isFinite(scale.logicalRows) && Number.isFinite(scale.gridSize) && scale.height !== scale.logicalRows * scale.gridSize) {
      violations.push("Scene height must equal logicalRows × gridSize.");
    }
    if (!hasScaleReferences(macro)) {
      violations.push("Scene width, height, and grid fields must reference DICEBOX_SCENE_SCALE rather than duplicate literal scale values.");
    }
  }

  if (scaleProfile === DEFAULT_SCALE_PROFILE) {
    if (markerGridType !== "gridless") violations.push("battlemap-120 requires DICEBOX_GRID_TYPE: gridless.");
    if (markerGridSize !== 120) violations.push("battlemap-120 requires DICEBOX_GRID_SIZE: 120.");
    if (markerDistance !== 5) violations.push("battlemap-120 requires DICEBOX_GRID_DISTANCE: 5.");
    if (markerUnits !== "ft") violations.push("battlemap-120 requires DICEBOX_GRID_UNITS: ft.");
    if (scale && (scale.gridType !== 0 || scale.gridSize !== 120 || scale.distance !== 5 || scale.units?.toLowerCase() !== "ft")) {
      violations.push("DICEBOX_SCENE_SCALE does not match the battlemap-120 profile.");
    }
  } else if (scaleProfile === "explicit-exception") {
    if (!/DICEBOX_SCALE_EXCEPTION_APPROVED:\s*true/i.test(macro)) {
      violations.push("Explicit scale exceptions require DICEBOX_SCALE_EXCEPTION_APPROVED: true.");
    }
    const reason = markerValue(macro, "SCALE_EXCEPTION");
    if (!reason || reason.length < 8) violations.push("Explicit scale exceptions require a meaningful DICEBOX_SCALE_EXCEPTION reason.");
  }

  const outside = source.replace(/```[^\n]*\n[\s\S]*?```/g, " ");
  if (/\b(run|execute|paste)\b[\s\S]{0,40}\b(macro|part)\s*(?:#|no\.?\s*)?[2-9]\b/i.test(outside)) {
    violations.push("BUILD artifact must not instruct the user to run a second macro or part.");
  }

  return {
    status: violations.length === 0 ? "PASS" : "FAIL",
    contract: BUILD_CONTRACT,
    scaleProfile: scaleProfile ?? null,
    sceneScale: scale,
    violations,
  };
}

async function main() {
  const artifactPath = process.argv[2];
  if (!artifactPath) {
    process.stderr.write("Usage: node tools/validate-dicebox-build.mjs <build.md>\n");
    process.exitCode = 2;
    return;
  }
  let source = "";
  try {
    source = await readFile(artifactPath, "utf8");
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
    return;
  }
  const result = validateDiceboxBuild({ artifactPath, source });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.status !== "PASS") process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
