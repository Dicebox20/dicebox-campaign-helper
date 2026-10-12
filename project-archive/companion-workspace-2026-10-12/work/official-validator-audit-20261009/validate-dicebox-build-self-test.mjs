import assert from "node:assert/strict";
import { validateDiceboxBuild } from "./validate-dicebox-build.mjs";

const validMacro = `# L1-04 — Cedar Crown Clearing

\`\`\`javascript
// DICEBOX_BUILD_CONTRACT: dicebox-scene-injector-build/v2
// DICEBOX_SINGLE_MACRO: true
// DICEBOX_SCENE_ID: L1-04
// DICEBOX_ART_MODE: embedded-webp
// DICEBOX_WORKFLOW: PREPARE -> RENDER -> INSPECT(PASS=APPROVED) -> BUILD
// DICEBOX_SCALE_PROFILE: battlemap-120
// DICEBOX_GRID_TYPE: gridless
// DICEBOX_GRID_SIZE: 120
// DICEBOX_GRID_DISTANCE: 5
// DICEBOX_GRID_UNITS: ft
// DICEBOX_LOGICAL_SIZE: 36x24
// DICEBOX_SCENE_PIXELS: 4320x2880
// DICEBOX_TOKEN_FOOTPRINT_POLICY: system-size
// DICEBOX_TOKEN_ART_SCALE_POLICY: visual-only
// DICEBOX_DISCOVERY_CONTRACT: dicebox-discovery/v1
// DICEBOX_DISCOVERY_COUNT: 1
// DICEBOX_DISCOVERY_DENSITY: ordinary
// DICEBOX_DISCOVERY_VISIBLE_ANCHORS: true
// DICEBOX_DISCOVERY_NOTICE_POLICY: flat-d20-no-modifiers
// DICEBOX_DISCOVERY_NOTICE_STATE: per-character-once-until-reset
const DICEBOX_SCENE_SCALE = Object.freeze({ gridType: 0, gridSize: 120, distance: 5, units: "ft", logicalColumns: 36, logicalRows: 24, width: 4320, height: 2880 });
const sceneData = {
  width: DICEBOX_SCENE_SCALE.width,
  height: DICEBOX_SCENE_SCALE.height,
  grid: {
    type: DICEBOX_SCENE_SCALE.gridType,
    size: DICEBOX_SCENE_SCALE.gridSize,
    distance: DICEBOX_SCENE_SCALE.distance,
    units: DICEBOX_SCENE_SCALE.units
  }
};
const chunks = ["UklGRg=="];
const bytes = Uint8Array.from(atob(chunks.join("")), c => c.charCodeAt(0));
console.log(sceneData, bytes.length);
\`\`\`
`;

const approvedException = validMacro
  .replace("// DICEBOX_SCALE_PROFILE: battlemap-120", "// DICEBOX_SCALE_PROFILE: explicit-exception\n// DICEBOX_SCALE_EXCEPTION_APPROVED: true\n// DICEBOX_SCALE_EXCEPTION: user-approved regional map scale")
  .replace("// DICEBOX_GRID_SIZE: 120", "// DICEBOX_GRID_SIZE: 100")
  .replace("// DICEBOX_GRID_DISTANCE: 5", "// DICEBOX_GRID_DISTANCE: 10")
  .replace("// DICEBOX_LOGICAL_SIZE: 36x24", "// DICEBOX_LOGICAL_SIZE: 40x30")
  .replace("// DICEBOX_SCENE_PIXELS: 4320x2880", "// DICEBOX_SCENE_PIXELS: 4000x3000")
  .replace('gridSize: 120, distance: 5, units: "ft", logicalColumns: 36, logicalRows: 24, width: 4320, height: 2880',
           'gridSize: 100, distance: 10, units: "ft", logicalColumns: 40, logicalRows: 30, width: 4000, height: 3000');

assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: validMacro }).status, "PASS");
const legacyApprovalMarker = validMacro.replace("INSPECT(PASS=APPROVED) -> BUILD", "INSPECT -> APPROVE -> BUILD");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: legacyApprovalMarker }).status, "PASS", "Legacy explicit-approval BUILD marker must remain backward compatible.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.zip", source: validMacro }).status, "FAIL", "ZIP regression must fail closed.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: `${validMacro}\n\`\`\`js\nconsole.log('second macro');\n\`\`\`` }).status, "FAIL", "Multiple macros must fail.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: validMacro.replace("// DICEBOX_SINGLE_MACRO: true\n", "") }).status, "FAIL", "Missing contract marker must fail.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: validMacro.replace("console.log(sceneData, bytes.length);", "eval('1+1');") }).status, "FAIL", "eval must fail.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: `${validMacro}\nRun macro 2 after this one.` }).status, "FAIL", "Second-step instructions must fail.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: validMacro.replace(/DICEBOX_GRID_SIZE: 120/g, "DICEBOX_GRID_SIZE: 50") }).status, "FAIL", "battlemap-120 must reject 50px grid size.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: validMacro.replace(/DICEBOX_SCENE_PIXELS: 4320x2880/g, "DICEBOX_SCENE_PIXELS: 1800x1200") }).status, "FAIL", "Scene-pixel mismatch must fail.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: validMacro.replace(/const DICEBOX_SCENE_SCALE[\s\S]*?\);\n/, "") }).status, "FAIL", "Missing scale source-of-truth constant must fail.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: validMacro.replace("width: DICEBOX_SCENE_SCALE.width", "width: 4320") }).status, "FAIL", "Literal scene dimensions must fail when they bypass the scale source of truth.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: approvedException }).status, "PASS", "Approved explicit scale exception should pass.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: approvedException.replace("// DICEBOX_SCALE_EXCEPTION_APPROVED: true\n", "") }).status, "FAIL", "Unapproved scale exception must fail.");


const ordinaryOverDensity = validMacro.replace("// DICEBOX_DISCOVERY_COUNT: 1", "// DICEBOX_DISCOVERY_COUNT: 3");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: ordinaryOverDensity }).status, "FAIL", "ordinary discovery over-density must fail.");

const approvedDiscoveryDense = validMacro
  .replace("// DICEBOX_DISCOVERY_COUNT: 1", "// DICEBOX_DISCOVERY_COUNT: 4")
  .replace("// DICEBOX_DISCOVERY_DENSITY: ordinary", "// DICEBOX_DISCOVERY_DENSITY: special\n// DICEBOX_DISCOVERY_DENSITY_APPROVED: true\n// DICEBOX_DISCOVERY_DENSITY_REASON: user-approved excavation scene");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: approvedDiscoveryDense }).status, "PASS", "approved discovery-dense special scene should pass.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: approvedDiscoveryDense.replace("// DICEBOX_DISCOVERY_DENSITY_APPROVED: true\n", "") }).status, "FAIL", "unapproved discovery-dense special scene must fail.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: validMacro.replace("// DICEBOX_DISCOVERY_NOTICE_POLICY: flat-d20-no-modifiers", "// DICEBOX_DISCOVERY_NOTICE_POLICY: actor-perception-roll") }).status, "FAIL", "modified Perception discovery policy must fail.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-04.md", source: validMacro.replace("// DICEBOX_DISCOVERY_NOTICE_STATE: per-character-once-until-reset", "// DICEBOX_DISCOVERY_NOTICE_STATE: reroll-on-enter") }).status, "FAIL", "reroll-farming discovery state must fail.");

process.stdout.write(`${JSON.stringify({ operation: "dicebox.injector-build-contract.self-test", status: "PASS", contract: "v2", cases: 18 })}\n`);
