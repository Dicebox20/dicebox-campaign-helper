export interface ActiveSliceCheckResult {
  operation: "dicebox.workflow.active-slice.check";
  status: "PASS" | "FAIL";
  goalId: unknown;
  score: number;
  passedGates: number;
  totalGates: number;
  activeStage: unknown;
  evidenceLabelRequired: unknown;
  nextAction: unknown;
  activeLanes: Array<{ lane: string; stepId: unknown }>;
  failureControl: {
    runtimeClass: unknown;
    failures: number | null;
    recoveryMode: boolean;
  };
  readyClaim: boolean;
  violations: string[];
}

export function evaluateActiveSlice(card: unknown): ActiveSliceCheckResult;
