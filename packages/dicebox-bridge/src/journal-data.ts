import { z } from "zod";
import {
  managedJournalEntrySpecSchema,
  type ManagedJournalEntrySpec,
} from "@dicebox/compiler";
import { StableDiceBoxIdSchema } from "@dicebox/core";

export const DICEBOX_JOURNAL_FLAG_SCOPE = "dicebox-campaign-helper" as const;

export const managedJournalEntryFlagSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  semanticId: StableDiceBoxIdSchema,
  planId: StableDiceBoxIdSchema,
}).strict();

export const managedJournalEntryFlagsSchema = z.object({
  [DICEBOX_JOURNAL_FLAG_SCOPE]: managedJournalEntryFlagSchema,
}).strict();

/**
 * The smallest Foundry-native JournalEntry create shape supported by M3.
 * `pageType` and `textFormat` are supplied by the exact runtime probe; this
 * mapper never guesses a CONST value from documentation alone.
 */
export const foundryJournalEntryPageDataSchema = z.object({
  name: z.string().trim().min(1).max(200),
  type: z.string().trim().min(1).max(100),
  text: z.object({
    content: z.string().max(100_000),
    format: z.number().int().nonnegative(),
  }).strict(),
}).strict();

export const foundryJournalEntryCreateDataSchema = z.object({
  name: z.string().trim().min(1).max(200),
  pages: z.array(foundryJournalEntryPageDataSchema).length(1),
  flags: managedJournalEntryFlagsSchema,
}).strict();

export type FoundryJournalEntryPageData = z.infer<typeof foundryJournalEntryPageDataSchema>;
export type FoundryJournalEntryCreateData = z.infer<typeof foundryJournalEntryCreateDataSchema>;

export function mapManagedJournalEntryCreateData(input: {
  readonly plan: ManagedJournalEntrySpec;
  readonly pageType: string;
  readonly textFormat: number;
}): FoundryJournalEntryCreateData {
  const plan = managedJournalEntrySpecSchema.parse(input.plan);
  if (plan.operation !== "create") {
    throw new Error("M3 create mapping requires a create plan; update mapping requires a known JournalEntryPage binding.");
  }
  return foundryJournalEntryCreateDataSchema.parse({
    name: plan.title,
    pages: [{
      name: plan.title,
      type: input.pageType,
      text: {
        content: plan.content,
        format: input.textFormat,
      },
    }],
    flags: {
      [DICEBOX_JOURNAL_FLAG_SCOPE]: {
        schemaVersion: "0.1.0",
        semanticId: plan.semantic.id,
        planId: plan.planId,
      },
    },
  });
}
