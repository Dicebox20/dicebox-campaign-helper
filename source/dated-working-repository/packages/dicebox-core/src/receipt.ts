import { z } from "zod";
import { SemanticRefSchema } from "./identity.js";

export const evidenceClasses = ["static", "deterministic", "created_document", "safe_use", "full_function", "blocked"] as const;
export type EvidenceClass = (typeof evidenceClasses)[number];

export interface EvidenceReceipt {
  readonly receiptId: string;
  readonly operation: string;
  readonly status: "observed" | "previewed" | "committed" | "unknown" | "recovered";
  readonly evidenceClass: EvidenceClass;
  readonly authority: "none" | "gm" | "system";
  readonly semanticRefs: readonly z.infer<typeof SemanticRefSchema>[];
  readonly observedAt: string;
  readonly notes: readonly string[];
}

export const EvidenceReceiptSchema = z.object({
  receiptId: z.string().min(1),
  operation: z.string().min(1),
  status: z.enum(["observed", "previewed", "committed", "unknown", "recovered"]),
  evidenceClass: z.enum(evidenceClasses),
  authority: z.enum(["none", "gm", "system"]),
  semanticRefs: z.array(SemanticRefSchema),
  observedAt: z.string().datetime({ offset: true }),
  notes: z.array(z.string()),
});
