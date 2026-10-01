import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");
const modeStart = appSource.indexOf('mode !== "add-scene-ui-execute"');
const modeEnd = appSource.indexOf('if (mode !== "backup-promotion-ui-execute"', modeStart);
const selfTestSource = appSource.slice(modeStart, modeEnd);

describe("M395 committed in-memory add-Scene UI self-test", () => {
  it("is explicit, test-gated, fixture-presence guarded, and drives only the existing lifecycle callbacks", () => {
    expect(modeStart).toBeGreaterThanOrEqual(0);
    expect(selfTestSource).toContain('"dbx:project:desktop-persistent-add-scene-execute-self-test-v2"');
    expect(selfTestSource).toContain("requires one pre-existing exact healthy two-Scene zero-asset fixture");
    expect(selfTestSource).toContain("it will not create, save, delete, or overwrite a project");
    expect(selfTestSource).toContain("void previewProjectAddScene()");
    expect(selfTestSource).toContain("void approveSelectedProjectProposal()");
    expect(selfTestSource).toContain("void applySelectedCommittedProjectAddScene()");
    expect(selfTestSource).toContain("void undoSelectedCommittedProjectAddScene()");
    expect(selfTestSource).toContain("Scenes 2 → 3 → 2");
    expect(selfTestSource).not.toContain("createProjectBundle(");
  });
});
