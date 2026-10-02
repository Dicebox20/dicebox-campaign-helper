import { z } from "zod";
import { SemanticRefSchema, StableDiceBoxIdSchema, createStableDiceBoxId, type SemanticRef } from "@dicebox/core";

export const semanticPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  title: z.string().min(1),
  intent: z.string().min(1),
  references: z.array(SemanticRefSchema),
  steps: z.array(z.object({
    stepId: StableDiceBoxIdSchema,
    kind: z.literal("read-only-observation"),
    description: z.string().min(1),
  })),
});

export type SemanticPlan = z.infer<typeof semanticPlanSchema>;

export function validateSemanticPlan(input: unknown): SemanticPlan {
  return semanticPlanSchema.parse(input);
}

export function createReadOnlyPlan(input: {
  readonly planId: SemanticPlan["planId"];
  readonly title: string;
  readonly intent: string;
  readonly references?: readonly SemanticRef[];
}): SemanticPlan {
  return {
    schemaVersion: "0.1.0",
    planId: input.planId,
    title: input.title,
    intent: input.intent,
    references: [...(input.references ?? [])],
    steps: [{
      stepId: createStableDiceBoxId("step", `${input.planId.split(":").at(-1) ?? "plan"}-observe`),
      kind: "read-only-observation",
      description: "Observe readiness and declared capabilities without changing runtime state.",
    }],
  };
}
