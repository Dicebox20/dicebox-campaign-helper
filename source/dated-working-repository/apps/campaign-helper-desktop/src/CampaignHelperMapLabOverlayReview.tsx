import {
  correctCampaignHelperMapLabOverlay,
  createCampaignHelperMapLabOverlayReview,
  promoteCampaignHelperMapLabOverlay,
  type CampaignHelperMapLabOverlayPromotion,
  type CampaignHelperMapLabOverlayReview,
} from "@dicebox/compiler";
import { useEffect, useState } from "react";

type CorrectionDraft = Readonly<{
  sceneX: number;
  sceneY: number;
  regionX: number;
  regionY: number;
  regionWidth: number;
  regionHeight: number;
}>;

function draftFromPrediction(prediction: CampaignHelperMapLabOverlayReview["predictions"][number]): CorrectionDraft {
  return {
    sceneX: prediction.proposedScenePosition.x,
    sceneY: prediction.proposedScenePosition.y,
    regionX: prediction.proposedSceneBounds.x,
    regionY: prediction.proposedSceneBounds.y,
    regionWidth: prediction.proposedSceneBounds.width,
    regionHeight: prediction.proposedSceneBounds.height,
  };
}

function isCompleteDraft(draft: CorrectionDraft | undefined): draft is CorrectionDraft {
  return !!draft && Object.values(draft).every((value) => Number.isFinite(value));
}

export function CampaignHelperMapLabOverlayReview() {
  const [review, setReview] = useState<CampaignHelperMapLabOverlayReview | null>(null);
  const [promotion, setPromotion] = useState<CampaignHelperMapLabOverlayPromotion | null>(null);
  const [drafts, setDrafts] = useState<Record<string, CorrectionDraft>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void createCampaignHelperMapLabOverlayReview()
      .then((nextReview) => {
        if (!active) return;
        setReview(nextReview);
        setDrafts(Object.fromEntries(nextReview.predictions.map((prediction) => [prediction.anchorId, draftFromPrediction(prediction)])));
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Map Lab overlay review could not be created.");
      });
    return () => {
      active = false;
    };
  }, []);

  const updateDraft = (anchorId: string, field: keyof CorrectionDraft, value: string) => {
    const numericValue = value.trim() === "" ? Number.NaN : Number(value);
    setDrafts((current) => ({
      ...current,
      [anchorId]: { ...current[anchorId], [field]: numericValue },
    } as Record<string, CorrectionDraft>));
  };

  const reviewCorrection = async (prediction: CampaignHelperMapLabOverlayReview["predictions"][number]) => {
    if (!review) return;
    const draft = drafts[prediction.anchorId];
    if (!isCompleteDraft(draft)) {
      setError(`Complete every numeric correction field for ${prediction.anchorId} before reviewing it.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const nextReview = await correctCampaignHelperMapLabOverlay(review, {
        anchorId: prediction.anchorId,
        targetRegionId: prediction.targetRegionId,
        sceneBounds: { x: draft.regionX, y: draft.regionY, width: draft.regionWidth, height: draft.regionHeight },
        scenePosition: { x: draft.sceneX, y: draft.sceneY },
        reviewedBy: "desktop Map Lab reviewer",
      });
      setReview(nextReview);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "The overlay correction was rejected.");
    } finally {
      setBusy(false);
    }
  };

  const approvePromotion = async () => {
    if (!review) return;
    setBusy(true);
    setError(null);
    try {
      const nextPromotion = await promoteCampaignHelperMapLabOverlay(review, {
        approved: true,
        approvedBy: "desktop Map Lab reviewer",
        approvedAt: new Date().toISOString(),
      });
      setPromotion(nextPromotion);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Blueprint promotion was rejected.");
    } finally {
      setBusy(false);
    }
  };

  if (error && !review) {
    return <section className="map-lab-overlay-review" aria-labelledby="map-lab-overlay-review-heading"><h2 id="map-lab-overlay-review-heading">Overlay review unavailable</h2><p role="alert">{error}</p></section>;
  }

  if (!review) {
    return <section className="map-lab-overlay-review" aria-labelledby="map-lab-overlay-review-heading"><h2 id="map-lab-overlay-review-heading">Campaign Helper overlay review</h2><p>Preparing the local Map Lab proposal review…</p></section>;
  }

  return (
    <section className="map-lab-overlay-review" aria-labelledby="map-lab-overlay-review-heading" data-map-lab-overlay-status={promotion ? "promoted-local" : review.reviewStatus}>
      <div className="map-lab-overlay-review__heading">
        <h2 id="map-lab-overlay-review-heading">Overlay review</h2>
        <span>local · no write · in-memory only</span>
      </div>
      <p className="map-lab-overlay-review__identity">
        <strong>{review.mapId}</strong> · Blueprint {review.blueprintId} · {review.sourceRenderer.assetId} · {review.sourceRenderer.byteLength} bytes
      </p>
      <p className="map-lab-overlay-review__meta">
        Transform: {review.transform.scene.width}×{review.transform.scene.height} · scale {review.transform.scale.x}/{review.transform.scale.y} · offset {review.transform.offset.x}/{review.transform.offset.y} · grid {review.transform.grid.size}px/{review.transform.grid.unitsPerCell} units · prediction digest {review.predictionDigest}
      </p>
      <p className="map-lab-overlay-review__authority">Geometry: Blueprint · Renderer: background only · Runtime: not modeled · Persistence: in-memory only · Mutation: disabled</p>
      <div className="map-lab-overlay-review__proposal-list" aria-label="Map Lab overlay proposals">
        {review.predictions.map((prediction) => {
          const corrected = review.corrections.some((correction) => correction.anchorId === prediction.anchorId);
          const draft = drafts[prediction.anchorId];
          return (
            <fieldset key={prediction.anchorId} className={corrected ? "map-lab-overlay-review__proposal map-lab-overlay-review__proposal--reviewed" : "map-lab-overlay-review__proposal"} data-map-lab-overlay-proposal-id={prediction.anchorId}>
              <legend>{prediction.anchorId} → {prediction.targetRegionId}</legend>
              <p>Confidence: <strong>{prediction.confidence}</strong> · {corrected ? "reviewed" : "needs review"}</p>
              <div className="map-lab-overlay-review__fields">
                {(["sceneX", "sceneY", "regionX", "regionY", "regionWidth", "regionHeight"] as const).map((field) => (
                  <label key={field}>
                    {field}
                    <input
                      type="number"
                      step="1"
                      value={draft && Number.isFinite(draft[field]) ? draft[field] : ""}
                      disabled={corrected || busy}
                      onChange={(event) => updateDraft(prediction.anchorId, field, event.target.value)}
                    />
                  </label>
                ))}
              </div>
              <button type="button" disabled={corrected || busy || !isCompleteDraft(draft)} onClick={() => void reviewCorrection(prediction)}>
                {corrected ? "Correction reviewed" : "Review correction"}
              </button>
            </fieldset>
          );
        })}
      </div>
      {error ? <p className="map-lab-overlay-review__error" role="alert">{error}</p> : null}
      <div className="map-lab-overlay-review__approval">
        <p>Status: <strong>{promotion ? "promoted-local" : review.reviewStatus}</strong></p>
        <button type="button" disabled={busy || !!promotion || review.reviewStatus !== "ready-for-approval"} onClick={() => void approvePromotion()}>
          Explicit approval: promote in-memory Blueprint
        </button>
      </div>
      {promotion ? (
        <div className="map-lab-overlay-review__promotion" data-map-lab-overlay-promotion="promoted-local">
          <p><strong>Promoted Blueprint digest:</strong> {promotion.blueprintDigest}</p>
          <p>Accepted Regions reread from promoted Blueprint: {review.predictions.length}</p>
          <ul>
            {review.predictions.map((prediction) => {
              const region = promotion.blueprint.regions.find((candidate) => candidate.regionId === prediction.targetRegionId);
              const shape = region?.shapes[0];
              return <li key={prediction.targetRegionId} data-map-lab-overlay-accepted-region-id={prediction.targetRegionId}>{prediction.targetRegionId}: {shape?.kind === "rectangle" ? `${shape.x},${shape.y} ${shape.width}×${shape.height}` : "unsupported shape"}</li>;
            })}
          </ul>
          <p>noWrite: true · persistence: {promotion.persistence} · foreign/runtime state: preserved</p>
        </div>
      ) : null}
    </section>
  );
}
