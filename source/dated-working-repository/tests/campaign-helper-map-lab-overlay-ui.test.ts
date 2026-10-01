import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const component = readFileSync(resolve(root, "apps/campaign-helper-desktop/src/CampaignHelperMapLabOverlayReview.tsx"), "utf8");
const app = readFileSync(resolve(root, "apps/campaign-helper-desktop/src/App.tsx"), "utf8");

describe("Campaign Helper Map Lab overlay review UI contract", () => {
  it("wires the pure M1198 review, correction, and approval boundary", () => {
    expect(component).toContain("createCampaignHelperMapLabOverlayReview");
    expect(component).toContain("correctCampaignHelperMapLabOverlay");
    expect(component).toContain("promoteCampaignHelperMapLabOverlay");
    expect(component).toContain("data-map-lab-overlay-proposal-id");
    expect(component).toContain("data-map-lab-overlay-accepted-region-id");
    expect(component).toContain("local · no write · in-memory only");
    expect(component).toContain("Explicit approval");
    expect(component).toContain("reviewedBy");
    expect(component).toContain("persistence: {promotion.persistence}");
    expect(component).not.toMatch(/\b(invoke|fromUuid)\s*\(/);
  });

  it("places the overlay review beside the product-facing Map Lab preview in Inspector", () => {
    expect(app).toContain('import { CampaignHelperMapLabOverlayReview } from "./CampaignHelperMapLabOverlayReview";');
    const previewIndex = app.indexOf("<CampaignHelperMapLabPreview");
    const reviewIndex = app.indexOf("<CampaignHelperMapLabOverlayReview");
    expect(previewIndex).toBeGreaterThan(-1);
    expect(reviewIndex).toBeGreaterThan(previewIndex);
  });
});
