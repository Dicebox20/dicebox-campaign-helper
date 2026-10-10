import {
  DICEBOX_IMAGE_PROMPT_RESTART_POLICY,
  validateImagePromptCleanRestart,
  type ImagePromptSubmission,
} from "@dicebox/compiler";

/**
 * Single desktop preflight for any future image-provider invocation.
 * Every image provider adapter MUST call this before sending a DiceBox prompt.
 * This wrapper does not call a provider or record output itself.
 */
export function authorizeDesktopImageGeneration(input: ImagePromptSubmission) {
  const receipt = validateImagePromptCleanRestart(input);
  if (receipt.status !== "PASS") {
    throw new Error(
      `DiceBox image prompt clean restart blocked [${receipt.violations.join(", ")}] — ${DICEBOX_IMAGE_PROMPT_RESTART_POLICY}`,
    );
  }
  return receipt;
}

export const DICEBOX_DESKTOP_IMAGE_PROMPT_POLICY = DICEBOX_IMAGE_PROMPT_RESTART_POLICY;
