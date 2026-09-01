import { describe, expect, it } from "vitest";
import { createStagedInverseExecutionAuthorization, verifyStagedInverseExecutionAuthorization } from "@dicebox/compiler";

const id = "dbx:inverse-plan:authorization";
const plan = { schemaVersion: "0.1.0", inversePlanId: id, originalPlanId: "dbx:plan:authorization", originalPlanSha256: "a".repeat(64), approvedByUserId: "gm", requiredActiveGm: true, reverseDependencyOrder: ["dbx:scene:authorization"], operations: [{ kind: "delete-owned-create", stableId: "dbx:scene:authorization", binding: { semantic: { id: "dbx:scene:authorization", kind: "scene" }, runtime: "foundry", documentType: "Scene", documentId: "s", uuid: "Scene.s", generation: 1 }, expectedOwnership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:scene:authorization", mode: "managed" } }], createdAt: "2026-08-30T20:00:00.000Z", execution: "not-implemented", readyClaim: false };

describe("staged inverse execution authorization", () => {
  it("binds one exact non-executing inverse plan to an active-GM authorization digest", async () => {
    const authorization = await createStagedInverseExecutionAuthorization({ authorizationId: "dbx:inverse-authorization:contract", inversePlan: plan, authorizedByActiveGmUserId: "gm", authorizedAt: "2026-08-30T20:01:00.000Z" });
    expect(authorization.execution).toBe("not-implemented");
    expect(authorization.requiredCurrentActiveGmRecheck).toBe(true);
    await expect(verifyStagedInverseExecutionAuthorization(authorization, plan)).resolves.toBe(true);
  });

  it("fails closed for authorization-time GM drift, inverse-plan drift, and digest tampering", async () => {
    await expect(createStagedInverseExecutionAuthorization({ authorizationId: "dbx:inverse-authorization:contract", inversePlan: plan, authorizedByActiveGmUserId: "other", authorizedAt: "2026-08-30T20:01:00.000Z" })).rejects.toThrow("approved GM");
    const authorization = await createStagedInverseExecutionAuthorization({ authorizationId: "dbx:inverse-authorization:contract", inversePlan: plan, authorizedByActiveGmUserId: "gm", authorizedAt: "2026-08-30T20:01:00.000Z" });
    await expect(verifyStagedInverseExecutionAuthorization(authorization, { ...plan, originalPlanSha256: "b".repeat(64) })).resolves.toBe(false);
    await expect(verifyStagedInverseExecutionAuthorization({ ...authorization, authorizationSha256: "c".repeat(64) }, plan)).resolves.toBe(false);
  });
});
