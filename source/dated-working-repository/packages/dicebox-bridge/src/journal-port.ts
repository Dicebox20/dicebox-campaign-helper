import type {
  ManagedJournalEntrySpec,
} from "@dicebox/compiler";
import type {
  Result,
  RuntimeBinding,
  SemanticRef,
  StableDiceBoxId,
} from "@dicebox/core";

/**
 * Exact adapter seam for the first managed document family. Implementations
 * must bind the reviewed semantic plan to one Foundry JournalEntry and return
 * an authoritative runtime binding. There is deliberately no generic patch
 * or arbitrary document method here.
 */
export interface ManagedJournalEntryRecord {
  readonly semantic: SemanticRef;
  /** The owning creation plan recorded in the managed Foundry flag. */
  readonly planId: StableDiceBoxId;
  readonly binding: RuntimeBinding;
  readonly title: string;
  readonly content: string;
}

export interface JournalEntryAdapterPort {
  readonly adapterId: string;
  readonly runtime: "foundry" | "fixture";
  readonly foundryApi: {
    readonly read: "fromUuid" | "game.journal.get";
    readonly create: "JournalEntry.create";
    readonly createPage: "entry.createEmbeddedDocuments";
    readonly update: "JournalEntry.update";
  };
  read(binding: RuntimeBinding): Promise<Result<ManagedJournalEntryRecord | null>>;
  create(plan: ManagedJournalEntrySpec, idempotencyKey: StableDiceBoxId): Promise<Result<RuntimeBinding>>;
  update(plan: ManagedJournalEntrySpec, binding: RuntimeBinding, idempotencyKey: StableDiceBoxId): Promise<Result<RuntimeBinding>>;
}

export interface JournalEntryAdapter extends JournalEntryAdapterPort {
  readonly runtime: "foundry";
}

export interface JournalEntryFixtureAdapter extends JournalEntryAdapterPort {
  readonly runtime: "fixture";
}
