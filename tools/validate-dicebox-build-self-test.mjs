import assert from "node:assert/strict";
import { validateDiceboxBuild } from "./validate-dicebox-build.mjs";

const validMacro = `# L1-01 — Fallen Oak Junction

\`\`\`javascript
// DICEBOX_BUILD_CONTRACT: dicebox-scene-injector-build/v1
// DICEBOX_SINGLE_MACRO: true
// DICEBOX_SCENE_ID: L1-01
// DICEBOX_ART_MODE: embedded-webp
// DICEBOX_WORKFLOW: PREPARE -> RENDER -> INSPECT -> APPROVE -> BUILD
const chunks = ["UklGRg=="];
const bytes = Uint8Array.from(atob(chunks.join("")), c => c.charCodeAt(0));
console.log(bytes.length);
\`\`\`
`;

assert.equal(validateDiceboxBuild({ artifactPath: "L1-01.md", source: validMacro }).status, "PASS");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-01.zip", source: validMacro }).status, "FAIL", "ZIP regression must fail closed.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-01.md", source: `${validMacro}\n\`\`\`js\nconsole.log('second macro');\n\`\`\`` }).status, "FAIL", "Multiple macros must fail.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-01.md", source: validMacro.replace("// DICEBOX_SINGLE_MACRO: true\n", "") }).status, "FAIL", "Missing contract marker must fail.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-01.md", source: validMacro.replace("console.log(bytes.length);", "eval('1+1');") }).status, "FAIL", "eval must fail.");
assert.equal(validateDiceboxBuild({ artifactPath: "L1-01.md", source: `${validMacro}\nRun macro 2 after this one.` }).status, "FAIL", "Second-step instructions must fail.");

process.stdout.write(`${JSON.stringify({ operation: "dicebox.injector-build-contract.self-test", status: "PASS", cases: 6 })}\n`);
