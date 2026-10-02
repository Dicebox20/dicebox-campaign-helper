import { describe, expect, it } from "vitest";
import { createReadOnlyPlan, validateSemanticPlan } from "@dicebox/compiler";
import { createStableDiceBoxId } from "@dicebox/core";

describe("M0 compiler boundary", () => {
  it("creates and validates a runtime-neutral read-only plan", () => {
    const plan = createReadOnlyPlan({
      planId: createStableDiceBoxId("plan", "m0-health"),
      title: "M0 health observation",
      intent: "Inspect declared readiness without changing runtime state.",
    });

    expect(validateSemanticPlan(plan)).toEqual(plan);
    expect(plan.steps[0]?.kind).toBe("read-only-observation");
  });

  it("rejects a plan that attempts a raw runtime mutation", () => {
    expect(() => validateSemanticPlan({
      schemaVersion: "0.1.0",
      planId: createStableDiceBoxId("plan", "unsafe"),
      title: "Unsafe plan",
      intent: "mutate",
      references: [],
      steps: [{
        stepId: createStableDiceBoxId("step", "unsafe"),
        kind: "document-patch",
        description: "update whatever Foundry accepts",
      }],
    })).toThrow();
  });
});
