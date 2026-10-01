import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS,
} from "./project-review-apply-coverage";
import { TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE } from "./project-review-terminal-state-evidence";
import { TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE } from "./project-review-applying-unknown-evidence";
import { TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE } from "./project-review-recovery-result-evidence";
import { TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE } from "./project-review-undo-redo-evidence";

export type ProjectStage11PerProducerAcceptanceReceipt = Readonly<{
  status: "PASS";
  commandCount: 14;
  lifecycleStatesPerCommand: Readonly<{ terminal: 3; applyingUnknown: 3; recovery: 4; undoRedo: 2 }>;
  readOnly: true;
  nonCertifying: true;
  noGenericExecutor: true;
  noExecutionAuthority: true;
  stage11Accepted: false;
  stage12Started: false;
  readyClaim: false;
}>;

export class ProjectStage11PerProducerAcceptanceValidationError extends Error {
  constructor(message: string) { super(message); this.name = "ProjectStage11PerProducerAcceptanceValidationError"; }
}

function requireCount(entries: readonly { commandKind: string }[], commandKind: string, count: number, label: string): void {
  if (entries.filter((entry) => entry.commandKind === commandKind).length !== count) {
    throw new ProjectStage11PerProducerAcceptanceValidationError(`${commandKind} must have ${count} ${label} entries.`);
  }
}

export function validateProjectStage11PerProducerAcceptance(): ProjectStage11PerProducerAcceptanceReceipt {
  for (const commandKind of TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS) {
    const contract = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[commandKind];
    if (!contract || contract.reviewAuthority !== "human-review" || contract.targetAuthority !== "local-project" || contract.applyAuthority !== "operation-specific" || contract.noGenericExecutor !== true) {
      throw new ProjectStage11PerProducerAcceptanceValidationError(`${commandKind} lacks the exact bounded operation contract.`);
    }
    requireCount(TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE, commandKind, 3, "terminal-state");
    requireCount(TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE, commandKind, 3, "applying/unknown");
    requireCount(TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE, commandKind, 4, "recovery-result");
    requireCount(TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE, commandKind, 2, "undo/redo");
  }
  return Object.freeze({ status: "PASS", commandCount: 14, lifecycleStatesPerCommand: Object.freeze({ terminal: 3, applyingUnknown: 3, recovery: 4, undoRedo: 2 }), readOnly: true, nonCertifying: true, noGenericExecutor: true, noExecutionAuthority: true, stage11Accepted: false, stage12Started: false, readyClaim: false });
}
