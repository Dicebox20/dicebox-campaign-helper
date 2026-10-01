import { z } from "zod";

export interface KnowledgeBaseSource {
  readonly mode: "read-only";
  readonly databasePath: string;
  readonly schemaPath: string;
  readonly seedPath: string;
  readonly queriesPath: string;
}

export const knowledgeQueryKindSchema = z.enum([
  "facts",
  "decisions",
  "trials",
  "blockers",
  "subject",
  "plan",
  "sources",
  "coverage",
  "summary",
]);

export type KnowledgeQueryKind = z.infer<typeof knowledgeQueryKindSchema>;

export const knowledgeQueryRequestSchema = z.object({
  kind: knowledgeQueryKindSchema,
  term: z.string().trim().min(1).max(256).optional(),
  subjectNo: z.number().int().positive().optional(),
  domain: z.string().trim().min(1).max(64).optional(),
  limit: z.number().int().min(1).max(100).default(20),
}).strict();

export type KnowledgeQueryRequest = z.input<typeof knowledgeQueryRequestSchema>;

export interface KnowledgeQueryResponse {
  readonly schemaVersion: "0.1.0";
  readonly mode: "read-only";
  readonly kind: KnowledgeQueryKind;
  readonly databasePath: string;
  readonly rows: readonly Record<string, string | number | null>[];
}

export function describeKnowledgeBase(sourceRoot: string): KnowledgeBaseSource {
  return {
    mode: "read-only",
    databasePath: `${sourceRoot}/database/dicebox_campaign_helper_knowledge.sqlite`,
    schemaPath: `${sourceRoot}/database/schema.sql`,
    seedPath: `${sourceRoot}/database/seed.sql`,
    queriesPath: `${sourceRoot}/database/queries.sql`,
  };
}
