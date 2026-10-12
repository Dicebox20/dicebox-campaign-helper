/** DiceBox project-global generation policy: fresh prompts from canonical inputs, never variations. */
export const DICEBOX_IMAGE_PROMPT_RESTART_POLICY = "dicebox-image-prompt-clean-restart/v1" as const;

export type ImagePromptHistoryEntry = Readonly<{
  attemptId: string;
  stage: string;
  prompt: string;
  approachId: string;
  archived: boolean;
  outcome: "accepted" | "rejected" | "redo";
  outputImageId?: string;
}>;

export type ImagePromptSubmission = Readonly<{
  attemptId: string;
  stage: string;
  prompt: string;
  approachId: string;
  operation: "fresh-generate" | "edit-existing";
  acceptedSourceId: string;
  independentRecompositionAttested: boolean;
  attemptedPreviousPromptVariation: boolean;
  reusedPreviousPromptAsInput: boolean;
  previousSeedAsInput: boolean;
  referenceImageIds: readonly string[];
  approvedReferenceImageIds: readonly string[];
  previousAttempts: readonly ImagePromptHistoryEntry[];
  retryOfAttemptId?: string;
}>;

export type ImagePromptGateReceipt = Readonly<{
  contract: typeof DICEBOX_IMAGE_PROMPT_RESTART_POLICY;
  status: "PASS" | "BLOCKED";
  operation: "dicebox.image-prompt.clean-restart.preflight";
  noWrite: true;
  violations: readonly string[];
  attemptId: string;
}>;

function normalized(prompt: string): string {
  return prompt.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}

function trigrams(source: string): Set<string> {
  const text = "  " + source + "  ";
  const result = new Set<string>();
  for (let i = 0; i < text.length - 2; i++) result.add(text.slice(i, i + 3));
  return result;
}

function nearCopy(first: string, second: string): boolean {
  const a = normalized(first);
  const b = normalized(second);
  if (!a || !b) return false;
  if (a === b) return true;
  // A "same ... but ..." appendix must not make the previous prompt acceptable again.
  const shortest = Math.min(a.length, b.length);
  if (shortest >= 35 && (a.includes(b) || b.includes(a))) return true;
  if (shortest < 45) return false; // too little text for a responsible similarity claim
  const as = trigrams(a), bs = trigrams(b);
  const union = new Set([...as, ...bs]);
  let overlap = 0;
  for (const token of as) if (bs.has(token)) overlap++;
  return union.size > 0 && overlap / union.size >= 0.7;
}

/**
 * Deterministic fail-closed preparation gate; MUST run before future image providers.
 * A lexical gate cannot prove independent semantic composition: the
 * independentRecompositionAttested input is a separately required review.
 * This routine never reads or writes persisted history or invokes a provider.
 */
export function validateImagePromptCleanRestart(request: ImagePromptSubmission): ImagePromptGateReceipt {
  const violations: string[] = [];
  const block = (code: string, condition: boolean) => { if (condition) violations.push(code); };
  const text = typeof request?.prompt === "string" ? request.prompt.trim() : "";
  const history = Array.isArray(request?.previousAttempts) ? request.previousAttempts : [];
  block("ATTEMPT_ID_REQUIRED", !request?.attemptId?.trim());
  block("STAGE_REQUIRED", !request?.stage?.trim());
  block("CANONICAL_SOURCE_REQUIRED", !request?.acceptedSourceId?.trim());
  block("INDEPENDENT_AUTHORING_NOT_ATTESTED", request?.independentRecompositionAttested !== true);
  block("PROMPT_REQUIRED", !text);
  block("COMPOSITION_APPROACH_ID_REQUIRED", !request?.approachId?.trim());
  block("REJECTED_PROMPT_VARIATION", request?.attemptedPreviousPromptVariation !== false);
  block("PRIOR_PROMPT_AS_INPUT", request?.reusedPreviousPromptAsInput !== false);
  block("PRIOR_SEED_AS_INPUT", request?.previousSeedAsInput !== false);
  block("HISTORY_REQUIRED", !Array.isArray(request?.previousAttempts));
  block("NEW_GENERATION_REQUIRED", request?.operation !== "fresh-generate");

  const previousIds = history.map(h => h.attemptId);
  block("REPEATED_ATTEMPT_ID", previousIds.includes(request?.attemptId));
  block("AMBIGUOUS_ATTEMPT_HISTORY", new Set(previousIds).size !== previousIds.length);
  block("UNARCHIVED_PREVIOUS_ATTEMPT", history.some(h => h.archived !== true));

  if (history.length) {
    block("RETRY_PREDECESSOR_REQUIRED", !request?.retryOfAttemptId || !previousIds.includes(request.retryOfAttemptId));
    block("REUSED_COMPOSITION_APPROACH", history.some(h => h.approachId === request.approachId));
    block("PRIOR_PROMPT_REUSED_OR_VARIATION", history.some(h => nearCopy(h.prompt, text)));
  } else {
    block("UNMATCHED_RETRY_REFERENCE", Boolean(request?.retryOfAttemptId));
  }

  // Approved canonical grayscale may be an input to the *paint* stage. Rejected
  // generations (including painterly failures) may never become retry sources.
  const approved = new Set(request?.approvedReferenceImageIds ?? []);
  const rejectedImages = new Set(history.filter(h => h.outcome !== "accepted").map(h => h.outputImageId).filter(Boolean));
  for (const ref of request?.referenceImageIds ?? []) {
    block("UNAPPROVED_IMAGE_REFERENCE", !approved.has(ref));
    block("FAILED_IMAGE_AS_INPUT", rejectedImages.has(ref));
  }
  block("IMAGE_REFERENCES_REQUIRED", !Array.isArray(request?.referenceImageIds) || !Array.isArray(request?.approvedReferenceImageIds));

  return {
    contract: DICEBOX_IMAGE_PROMPT_RESTART_POLICY,
    operation: "dicebox.image-prompt.clean-restart.preflight",
    noWrite: true,
    attemptId: request?.attemptId ?? "",
    status: violations.length ? "BLOCKED" : "PASS",
    violations
  };
}
