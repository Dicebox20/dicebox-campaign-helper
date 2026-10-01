import { describe, expect, it } from "vitest";
import type { StagedExecutionAdapter, StagedInverseAdapter } from "@dicebox/compiler";

describe("separate staged inverse adapter contract", () => {
  it("requires inverse-specific delete, restore, and reread methods without changing normal execution", () => {
    const inverseMethods: Array<keyof StagedInverseAdapter> = ["adapterId", "deleteOwnedCreate", "restoreUpdatePreimage"];
    const normalMethods: Array<keyof StagedExecutionAdapter> = ["adapterId", "create", "update", "read"];
    expect(inverseMethods).toEqual(["adapterId", "deleteOwnedCreate", "restoreUpdatePreimage"]);
    expect(normalMethods).toEqual(["adapterId", "create", "update", "read"]);
  });
});
