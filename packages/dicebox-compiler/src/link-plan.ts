import {
  RuntimeBindingSchema,
  SemanticRefSchema,
  StableDiceBoxIdSchema,
  type RuntimeBinding,
  type SemanticRef,
  type StableDiceBoxId,
} from "@dicebox/core";
import { z } from "zod";

/** A reviewed, exact-identity link between two semantic DiceBox records. */
export const exactDocumentLinkPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  linkId: StableDiceBoxIdSchema,
  source: SemanticRefSchema,
  target: SemanticRefSchema,
  targetBinding: RuntimeBindingSchema,
  label: z.string().min(1),
}).strict().superRefine((value, context) => {
  if (value.targetBinding.semantic.id !== value.target.id
    || value.targetBinding.semantic.kind !== value.target.kind) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["targetBinding", "semantic"],
      message: "The runtime target binding must match the reviewed semantic target.",
    });
  }
});

export type ExactDocumentLinkPlan = z.infer<typeof exactDocumentLinkPlanSchema>;

export function createExactDocumentLinkPlan(input: {
  readonly linkId: StableDiceBoxId;
  readonly source: SemanticRef;
  readonly target: SemanticRef;
  readonly targetBinding: RuntimeBinding;
  readonly label: string;
}): ExactDocumentLinkPlan {
  return exactDocumentLinkPlanSchema.parse({
    schemaVersion: "0.1.0",
    linkId: input.linkId,
    source: input.source,
    target: input.target,
    targetBinding: input.targetBinding,
    label: input.label,
  });
}

export function validateExactDocumentLinkPlan(input: unknown): ExactDocumentLinkPlan {
  return exactDocumentLinkPlanSchema.parse(input);
}
