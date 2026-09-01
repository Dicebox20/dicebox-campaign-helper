import { z } from "zod";

export const errorCodes = [
  "NOT_READY",
  "UNAVAILABLE",
  "INVALID_INPUT",
  "FORBIDDEN",
  "UNKNOWN_OUTCOME",
] as const;

export type ErrorCode = (typeof errorCodes)[number];
export type RetryAdvice = "never" | "after-reread" | "safe-to-retry";

export interface DiceBoxError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly retry: RetryAdvice;
}

export type Result<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: DiceBoxError };

export const DiceBoxErrorSchema = z.object({
  code: z.enum(errorCodes),
  message: z.string().min(1),
  retry: z.enum(["never", "after-reread", "safe-to-retry"]),
});

export const ResultSchema = <T extends z.ZodTypeAny>(valueSchema: T) => z.union([
  z.object({ ok: z.literal(true), value: valueSchema }),
  z.object({ ok: z.literal(false), error: DiceBoxErrorSchema }),
]);

export const notReady = (message: string): DiceBoxError => ({
  code: "NOT_READY",
  message,
  retry: "never",
});
