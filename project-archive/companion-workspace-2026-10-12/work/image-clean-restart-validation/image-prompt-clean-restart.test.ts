import { describe, expect, it } from "vitest";
import { validateImagePromptCleanRestart, type ImagePromptSubmission } from "../packages/dicebox-compiler/src/image-prompt-clean-restart";

const original = "A grayscale orthographic map of a forest road through giant mushrooms with a wide road and two loops around trunks.";
const alternate = "An overhead architectural graybox of subterranean fungal forest terrain. Broad paved central artery links western and eastern tunnels; paired clearings connect by navigable side circuits. Static solid pillars stand outside all walkable corridors.";
const first: ImagePromptSubmission = {
  attemptId: "scene-01", stage: "structural",
  prompt: original, approachId: "mushroom-spokes-01",
  operation: "fresh-generate", acceptedSourceId: "M02-PREPARE-accepted",
  independentRecompositionAttested: true, attemptedPreviousPromptVariation: false,
  reusedPreviousPromptAsInput: false, previousSeedAsInput: false,
  referenceImageIds: [], approvedReferenceImageIds: [], previousAttempts: []
};
const history = [{
  attemptId: "scene-01", stage: "structural", prompt: original,
  approachId: "mushroom-spokes-01", archived: true as const,
  outcome: "rejected" as const, outputImageId: "failed-image-01"
}];
const retry: ImagePromptSubmission = {
  ...first, attemptId: "scene-02", prompt: alternate,
  approachId: "new-structural-geometry-02", previousAttempts: history,
  retryOfAttemptId: "scene-01"
};
const gate = (candidate: ImagePromptSubmission) => validateImagePromptCleanRestart(candidate);
function blocks(candidate: ImagePromptSubmission, code: string) {
  const result = gate(candidate);
  expect(result.status).toBe("BLOCKED");
  expect(result.violations).toContain(code);
  expect(result.noWrite).toBe(true);
}

describe("DiceBox global image prompt clean-restart gate", () => {
  it("permits an initial generation from accepted inputs", () => {
    expect(gate(first)).toMatchObject({status:"PASS",noWrite:true,violations:[]});
  });
  it("permits an independently composed second prompt", () => {
    expect(gate(retry)).toMatchObject({status:"PASS",violations:[]});
  });
  it("rejects verbatim prompt reuse", () => blocks({...retry,prompt:original},"PRIOR_PROMPT_REUSED_OR_VARIATION"));
  it("rejects case/punctuation variants", () => blocks({...retry,prompt:"  "+original.toUpperCase()+"! "},"PRIOR_PROMPT_REUSED_OR_VARIATION"));
  it("rejects appended corrective instructions", () => blocks({...retry,prompt:original+" But move the milestone and widen the path."},"PRIOR_PROMPT_REUSED_OR_VARIATION"));
  it("rejects a recycled composition ID", () => blocks({...retry,approachId:first.approachId},"REUSED_COMPOSITION_APPROACH"));
  it("rejects an edit of the failed image", () => blocks({...retry,operation:"edit-existing"},"NEW_GENERATION_REQUIRED"));
  it("rejects direct reuse of previous prompt as input", () => blocks({...retry,reusedPreviousPromptAsInput:true},"PRIOR_PROMPT_AS_INPUT"));
  it("rejects previous seed reuse", () => blocks({...retry,previousSeedAsInput:true},"PRIOR_SEED_AS_INPUT"));
  it("rejects admitted derivative prompts", () => blocks({...retry,attemptedPreviousPromptVariation:true},"REJECTED_PROMPT_VARIATION"));
  it("rejects missing attestation", () => blocks({...retry,independentRecompositionAttested:false},"INDEPENDENT_AUTHORING_NOT_ATTESTED"));
  it("rejects missing accepted specification", () => blocks({...retry,acceptedSourceId:""},"CANONICAL_SOURCE_REQUIRED"));
  it("requires previous prompt archive", () => blocks({...retry,previousAttempts:[{...history[0],archived:false}]},"UNARCHIVED_PREVIOUS_ATTEMPT"));
  it("requires retry lineage", () => blocks({...retry,retryOfAttemptId:undefined},"RETRY_PREDECESSOR_REQUIRED"));
  it("rejects repeated attempt IDs", () => blocks({...retry,attemptId:"scene-01"},"REPEATED_ATTEMPT_ID"));
  it("rejects a failed image as generation reference", () => blocks({...retry,referenceImageIds:["failed-image-01"],approvedReferenceImageIds:["failed-image-01"]},"FAILED_IMAGE_AS_INPUT"));
  it("rejects unapproved reference images", () => blocks({...retry,referenceImageIds:["unknown-image"]},"UNAPPROVED_IMAGE_REFERENCE"));
  it("allows an approved grayscale as painterly-stage source", () => {
    const accepted=[{...history[0],outcome:"accepted" as const,outputImageId:"approved-grayscale"}];
    const candidate={...retry,stage:"painterly",previousAttempts:accepted,
      referenceImageIds:["approved-grayscale"],approvedReferenceImageIds:["approved-grayscale"]};
    expect(gate(candidate).status).toBe("PASS");
  });
  it("does not mutate attempts", () => {
    const before = structuredClone(retry);
    gate(retry);
    expect(retry).toEqual(before);
  });
});
