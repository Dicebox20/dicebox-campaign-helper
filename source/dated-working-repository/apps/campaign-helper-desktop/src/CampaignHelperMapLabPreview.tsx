import mapLabSvg from "../../../assets/testing/campaign-helper-map-lab-v1.svg?raw";
import { useMemo } from "react";
import { createCampaignHelperMapLabDesktopPreview } from "./campaign-helper-map-lab-preview";

type CampaignHelperMapLabPreviewProps = Readonly<{
  selectedAnchorId: string | null;
  onSelectAnchor: (anchorId: string) => void;
}>;

const mapLabAssetUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(mapLabSvg)}`;

export function CampaignHelperMapLabPreview({ selectedAnchorId, onSelectAnchor }: CampaignHelperMapLabPreviewProps) {
  const preview = useMemo(() => createCampaignHelperMapLabDesktopPreview(), []);
  return (
    <section className="map-lab-preview" aria-labelledby="map-lab-preview-heading">
      <div className="map-lab-preview__heading">
        <h2 id="map-lab-preview-heading">Campaign Helper Map Lab</h2>
        <span>local · no write</span>
      </div>
      <div className="map-lab-preview__canvas" role="img" aria-label="Campaign Helper generated map with Blueprint-owned geometry overlays">
        <img src={mapLabAssetUrl} alt="Generated Campaign Helper Map Lab renderer background" draggable={false} />
        <svg viewBox={`0 0 ${preview.canvas.width} ${preview.canvas.height}`} aria-hidden="true" focusable="false">
          {preview.regions.map((region) => (
            <rect key={region.regionId} data-map-lab-region-id={region.regionId} x={region.x} y={region.y} width={region.width} height={region.height} />
          ))}
          {preview.walls.map((wall) => (
            <line key={wall.wallId} data-map-lab-wall-id={wall.wallId} x1={wall.x1} y1={wall.y1} x2={wall.x2} y2={wall.y2} />
          ))}
        </svg>
        <div className="map-lab-preview__anchors" aria-label="Map Lab interaction anchors">
          {preview.anchors.map((anchor) => (
            <button
              key={anchor.anchorId}
              className={anchor.anchorId === selectedAnchorId ? "map-lab-anchor map-lab-anchor--selected" : "map-lab-anchor"}
              type="button"
              data-map-lab-anchor-id={anchor.anchorId}
              style={{ left: `${(anchor.x / preview.canvas.width) * 100}%`, top: `${(anchor.y / preview.canvas.height) * 100}%` }}
              aria-label={`${anchor.kind} anchor ${anchor.anchorId}`}
              aria-pressed={anchor.anchorId === selectedAnchorId}
              onClick={() => onSelectAnchor(anchor.anchorId)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
      <p className="map-lab-preview__meta">
        <strong>{preview.blueprintId}</strong> · {preview.walls.length} Walls · {preview.regions.length} Regions · {preview.anchors.length} anchors · {preview.assetByteLength} bytes
      </p>
      <p className="map-lab-preview__authority">Geometry: Blueprint · Renderer: background only · Runtime: not modeled · Mutation: disabled</p>
    </section>
  );
}
