export const CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS = 12_000;
export const CAMPAIGN_DIRECTOR_MAX_OUTPUT_TOKENS = 1_000;

const secretPatterns = [
  /\bsk-[A-Za-z0-9_-]{8,}\b/g,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{8,}\b/gi,
  /\b(access[_-]?token|refresh[_-]?token|api[_-]?key)\s*[:=]\s*[^\s,;]+/gi,
];

export function redactDirectorText(value: string): string {
  return secretPatterns.reduce((current, pattern) => current.replace(pattern, "[REDACTED]"), value);
}
