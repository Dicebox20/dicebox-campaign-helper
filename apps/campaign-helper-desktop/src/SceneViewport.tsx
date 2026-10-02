import { Application, Container, Graphics, Text } from "pixi.js";
import { useEffect, useRef } from "react";
import { projectScene, type SceneDocument } from "@dicebox/scene";

type SceneViewportProps = Readonly<{
  document: SceneDocument;
  selectedEntityId: string;
  label: string;
  compact?: boolean;
  onSelect?: (entityId: string) => void;
}>;

export function SceneViewport({ document, selectedEntityId, label, compact = false, onSelect }: SceneViewportProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let app: Application | null = null;

    async function mount(host: HTMLDivElement) {
      const nextApp = new Application();
      await nextApp.init({ resizeTo: host, antialias: true, autoDensity: true, background: document.background.color });
      if (disposed) {
        nextApp.destroy(false, { children: true });
        return;
      }
      app = nextApp;
      host.appendChild(nextApp.canvas);

      const sceneRoot = new Container();
      nextApp.stage.addChild(sceneRoot);
      const scale = Math.min(host.clientWidth / document.width, host.clientHeight / document.height);
      sceneRoot.scale.set(scale);
      sceneRoot.position.set(
        Math.max(0, (host.clientWidth - document.width * scale) / 2),
        Math.max(0, (host.clientHeight - document.height * scale) / 2),
      );

      const grid = new Graphics();
      for (let x = 0; x <= document.width; x += document.background.gridSize) grid.moveTo(x, 0).lineTo(x, document.height);
      for (let y = 0; y <= document.height; y += document.background.gridSize) grid.moveTo(0, y).lineTo(document.width, y);
      grid.stroke({ color: 0x334155, alpha: compact ? 0.3 : 0.55, width: 1 });
      sceneRoot.addChild(grid);

      for (const entity of projectScene(document)) {
        const graphic = new Graphics()
          .rect(entity.x, entity.y, entity.width, entity.height)
          .fill({ color: entity.color, alpha: entity.kind === "region" ? 0.22 : 0.72 })
          .stroke({ color: entity.id === selectedEntityId ? 0xf8fafc : entity.color, width: entity.id === selectedEntityId ? 8 : 3, alpha: 0.95 });
        if (onSelect) {
          graphic.eventMode = "static";
          graphic.cursor = "pointer";
          graphic.on("pointertap", () => onSelect(entity.id));
        }
        sceneRoot.addChild(graphic);

        if (!compact) {
          const text = new Text({ text: entity.name, style: { fill: 0xf8fafc, fontFamily: "system-ui", fontSize: 24, fontWeight: "600" } });
          text.position.set(entity.x + 12, entity.y + 10);
          sceneRoot.addChild(text);
        }
      }
    }

    void mount(host);
    return () => {
      disposed = true;
      app?.destroy(false, { children: true });
      host.replaceChildren();
    };
  }, [compact, document, onSelect, selectedEntityId]);

  return <div className={compact ? "scene-viewport scene-viewport--preview" : "scene-viewport"} ref={hostRef} role="img" aria-label={label} />;
}
