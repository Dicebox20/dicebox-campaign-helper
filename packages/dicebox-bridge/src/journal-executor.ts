import {
  EvidenceReceiptSchema,
  createStableDiceBoxId,
  type EvidenceReceipt,
  type Result,
  type RuntimeBinding,
  type RuntimeProfile,
} from "@dicebox/core";
import {
  markCommittedAfterReadback,
  markUnknownOutcome,
  prepareTransaction,
  markApplying,
  previewManagedJournalEntry,
  type TransactionJournalWriter,
  type TransactionJournal,
} from "@dicebox/compiler";
import type { DocumentPlanPreview } from "@dicebox/compiler";
import type { JournalEntryAdapterPort, ManagedJournalEntryRecord } from "./journal-port.js";

export interface JournalCreateExecution {
  readonly state: "committed" | "unknown-outcome";
  readonly transaction: TransactionJournal;
  readonly binding: RuntimeBinding | null;
  readonly receipt: EvidenceReceipt;
}

function receipt(
  preview: DocumentPlanPreview,
  state: JournalCreateExecution["state"],
  observedAt: string,
  adapterId: string,
): EvidenceReceipt {
  const suffix = state === "committed" ? "committed" : "unknown";
  return EvidenceReceiptSchema.parse({
    receiptId: createStableDiceBoxId("receipt", `${preview.plan.planId.split(":").at(-1) ?? "plan"}-${suffix}`),
    operation: "document-plan.create",
    status: state === "committed" ? "committed" : "unknown",
    evidenceClass: state === "committed" ? "created_document" : "deterministic",
    authority: "gm",
    semanticRefs: [preview.plan.semantic],
    observedAt,
    notes: state === "committed"
      ? [`Adapter ${adapterId} returned a binding and authoritative read-back matched the reviewed record.`]
      : [`Adapter ${adapterId} did not produce a verifiable postcondition; outcome remains unknown and retry is forbidden.`],
  });
}

function exactRecordMatches(record: ManagedJournalEntryRecord, preview: DocumentPlanPreview, binding: RuntimeBinding): boolean {
  return record.semantic.id === preview.plan.semantic.id
    && record.planId === preview.plan.planId
    && record.binding.uuid === binding.uuid
    && record.binding.documentId === binding.documentId
    && record.title === preview.plan.title
    && record.content === preview.plan.content;
}

export async function executeApprovedJournalEntryCreate(input: {
  readonly preview: DocumentPlanPreview;
  readonly transaction: TransactionJournal;
  readonly adapter: JournalEntryAdapterPort;
  readonly observedAt: string;
  readonly currentRuntime: RuntimeProfile;
  readonly activeGmUserId: string;
  readonly journal: TransactionJournalWriter;
}): Promise<Result<JournalCreateExecution>> {
  if (input.preview.review.status !== "ready") {
    return { ok: false, error: { code: "FORBIDDEN", message: "A blocked preview cannot be executed.", retry: "never" } };
  }
  if (input.transaction.planId !== input.preview.plan.planId || input.transaction.stage !== "approved") {
    return { ok: false, error: { code: "FORBIDDEN", message: "Execution requires the exact approved transaction for this preview.", retry: "never" } };
  }
  if (input.transaction.approvedByUserId !== input.activeGmUserId) {
    return { ok: false, error: { code: "FORBIDDEN", message: "The approved GM is no longer the current active GM.", retry: "never" } };
  }
  const currentReview = previewManagedJournalEntry(input.preview.plan, input.currentRuntime, {
    authority: "gm",
    observedAt: input.observedAt,
  });
  if (currentReview.review.status !== "ready") {
    return { ok: false, error: { code: "NOT_READY", message: "Current runtime recheck blocked execution.", retry: "never" } };
  }

  const approvedJournal = await input.journal.append(input.transaction);
  if (!approvedJournal.ok) return approvedJournal;

  const applyReady = prepareTransaction(input.transaction, input.observedAt);
  if (!applyReady.ok) return applyReady;
  const applyReadyJournal = await input.journal.append(applyReady.value);
  if (!applyReadyJournal.ok) return applyReadyJournal;
  const applying = markApplying(applyReady.value, input.observedAt);
  if (!applying.ok) return applying;
  const applyingJournal = await input.journal.append(applying.value);
  if (!applyingJournal.ok) return applyingJournal;

  const created = await input.adapter.create(input.preview.plan, applying.value.idempotencyKey);
  if (!created.ok) {
    if (created.error.code === "UNKNOWN_OUTCOME") {
      const unknown = markUnknownOutcome(applying.value, input.observedAt);
      if (!unknown.ok) return unknown;
      const appended = await input.journal.append(unknown.value);
      if (!appended.ok) return appended;
      return {
        ok: true,
        value: {
          state: "unknown-outcome",
          transaction: unknown.value,
          binding: null,
          receipt: receipt(input.preview, "unknown-outcome", input.observedAt, input.adapter.adapterId),
        },
      };
    }
    return created;
  }

  const readBack = await input.adapter.read(created.value);
  if (!readBack.ok || !readBack.value || !exactRecordMatches(readBack.value, input.preview, created.value)) {
    const unknown = markUnknownOutcome(applying.value, input.observedAt);
    if (!unknown.ok) return unknown;
    const appended = await input.journal.append(unknown.value);
    if (!appended.ok) return appended;
    return {
      ok: true,
      value: {
        state: "unknown-outcome",
        transaction: unknown.value,
        binding: null,
        receipt: receipt(input.preview, "unknown-outcome", input.observedAt, input.adapter.adapterId),
      },
    };
  }
  const committed = markCommittedAfterReadback(applying.value, created.value, input.observedAt);
  if (!committed.ok) return committed;
  const committedJournal = await input.journal.append(committed.value);
  if (!committedJournal.ok) return committedJournal;
  return {
    ok: true,
    value: {
      state: "committed",
      transaction: committed.value,
      binding: created.value,
      receipt: receipt(input.preview, "committed", input.observedAt, input.adapter.adapterId),
    },
  };
}
