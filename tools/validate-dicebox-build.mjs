import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const BUILD_CONTRACT = "dicebox-scene-injector-build/v1";

const REQUIRED_MARKERS = [
  ["build contract", /DICEBOX_BUILD_CONTRACT:\s*dicebox-scene-injector-build\/v1/i],
  ["single macro", /DICEBOX_SINGLE_MACRO:\s*true/i],
  ["scene id", /DICEBOX_SCENE_ID:\s*[^\s]+/i],
  ["art mode", /DICEBOX_ART_MODE:\s*(embedded-webp|embedded-png|verified-path)/i],
  ["workflow", /DICEBOX_WORKFLOW:\s*PREPARE\s*->\s*RENDER\s*->\s*INSPECT\s*->\s*APPROVE\s*->\s*BUILD/i],
];

const FORBIDDEN_PATTERNS = [
  ["eval", /\beval\s*\(/],
  ["new Function", /\bnew\s+Function\s*\(/],
  ["raw WebSocket", /\bnew\s+WebSocket\s*\(/],
];

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

  const artMode = macro.match(/DICEBOX_ART_MODE:\s*([^\s]+)/i)?.[1]?.toLowerCase();
  if (artMode?.startsWith("embedded-")) {
    if (!/\batob\s*\(/.test(macro)) {
      violations.push("Embedded-art BUILD macro must reassemble/decode its image payload inside the same macro.");
    }
    if (!/Uint8Array/.test(macro)) {
      violations.push("Embedded-art BUILD macro must materialize decoded bytes inside the same macro.");
    }
  }

  const outside = source.replace(/```[^\n]*\n[\s\S]*?```/g, " ");
  if (/\b(run|execute|paste)\b[\s\S]{0,40}\b(macro|part)\s*(?:#|no\.?\s*)?[2-9]\b/i.test(outside)) {
    violations.push("BUILD artifact must not instruct the user to run a second macro or part.");
  }

  return {
    status: violations.length === 0 ? "PASS" : "FAIL",
    contract: BUILD_CONTRACT,
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
