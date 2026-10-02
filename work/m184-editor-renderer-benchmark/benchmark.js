import Konva from "konva";
import { Application, Container, Graphics, Sprite, Texture } from "pixi.js";

const params = new URLSearchParams(location.search);
const renderer = params.get("renderer");
const entityCount = Number(params.get("entities") ?? 4000);
const selectedCount = Number(params.get("selected") ?? 250);
const frames = Number(params.get("frames") ?? 90);
const width = 1600;
const height = 900;

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
const summarize = (samples) => {
  const sorted = [...samples].sort((a, b) => a - b);
  const percentile = (p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
  return {
    meanMs: samples.reduce((sum, value) => sum + value, 0) / samples.length,
    p50Ms: percentile(0.5),
    p95Ms: percentile(0.95),
    maxMs: sorted.at(-1)
  };
};

function makeMapCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 4096;
  canvas.height = 4096;
  const context = canvas.getContext("2d");
  context.fillStyle = "#111722";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#35445e";
  context.lineWidth = 2;
  for (let n = 0; n <= 4096; n += 128) {
    context.beginPath(); context.moveTo(n, 0); context.lineTo(n, 4096); context.stroke();
    context.beginPath(); context.moveTo(0, n); context.lineTo(4096, n); context.stroke();
  }
  return canvas;
}

function entityPosition(index) {
  return { x: (index * 73) % 3900, y: (index * 151) % 3900 };
}

async function runKonva() {
  const start = performance.now();
  const host = document.querySelector("#benchmark");
  const main = document.createElement("div");
  const preview = document.createElement("div");
  host.append(main, preview);
  const stage = new Konva.Stage({ container: main, width, height });
  const backgroundLayer = new Konva.Layer({ listening: false });
  const entityLayer = new Konva.Layer();
  stage.add(backgroundLayer, entityLayer);
  backgroundLayer.add(new Konva.Image({ image: makeMapCanvas(), width: 4096, height: 4096, listening: false }));
  const entities = [];
  for (let index = 0; index < entityCount; index += 1) {
    const { x, y } = entityPosition(index);
    const shape = new Konva.Rect({ x, y, width: 18, height: 18, fill: index < selectedCount ? "#ffb347" : "#66c2ff", name: "entity", listening: true });
    entityLayer.add(shape);
    entities.push(shape);
  }
  const previewStage = new Konva.Stage({ container: preview, width: 320, height: 180 });
  const previewLayer = new Konva.Layer({ listening: false, scaleX: 0.075, scaleY: 0.0421875 });
  previewStage.add(previewLayer);
  previewLayer.add(new Konva.Image({ image: makeMapCanvas(), width: 4096, height: 4096, listening: false }));
  for (let index = 0; index < entityCount; index += 1) {
    const { x, y } = entityPosition(index);
    previewLayer.add(new Konva.Rect({ x, y, width: 18, height: 18, fill: index < selectedCount ? "#ffb347" : "#66c2ff", listening: false }));
  }
  stage.draw(); previewStage.draw(); await nextFrame();
  const initMs = performance.now() - start;
  const panZoom = [];
  for (let frame = 0; frame < frames; frame += 1) {
    const tick = performance.now();
    entityLayer.position({ x: frame * 1.5, y: frame * 0.75 });
    entityLayer.scale({ x: 1 + frame / 1000, y: 1 + frame / 1000 });
    entityLayer.draw();
    await nextFrame();
    panZoom.push(performance.now() - tick);
  }
  const transforms = [];
  for (let frame = 0; frame < frames; frame += 1) {
    const tick = performance.now();
    for (let index = 0; index < selectedCount; index += 1) entities[index].x(entities[index].x() + (frame % 2 ? -1 : 1));
    entityLayer.draw();
    await nextFrame();
    transforms.push(performance.now() - tick);
  }
  const selectionStart = performance.now();
  let marqueeMatches = 0;
  for (const shape of entities) {
    const box = shape.getClientRect({ skipTransform: false });
    if (box.x >= 600 && box.y >= 600 && box.x <= 2400 && box.y <= 2400) marqueeMatches += 1;
  }
  return { renderer: "konva", initMs, panZoom: summarize(panZoom), transforms: summarize(transforms), marqueeMs: performance.now() - selectionStart, marqueeMatches };
}

async function runPixi() {
  const start = performance.now();
  const host = document.querySelector("#benchmark");
  const app = new Application();
  await app.init({ width, height, antialias: false, preference: "webgl", backgroundAlpha: 0 });
  host.append(app.canvas);
  app.ticker.stop();
  const world = new Container();
  app.stage.addChild(world);
  world.addChild(new Sprite(Texture.from(makeMapCanvas())));
  const entityContainer = new Container();
  world.addChild(entityContainer);
  const entities = [];
  for (let index = 0; index < entityCount; index += 1) {
    const { x, y } = entityPosition(index);
    const sprite = new Sprite(Texture.WHITE);
    sprite.position.set(x, y); sprite.width = 18; sprite.height = 18; sprite.tint = index < selectedCount ? 0xffb347 : 0x66c2ff; sprite.eventMode = "static";
    entityContainer.addChild(sprite); entities.push(sprite);
  }
  const preview = new Application();
  await preview.init({ width: 320, height: 180, antialias: false, preference: "webgl", backgroundAlpha: 0 });
  host.append(preview.canvas); preview.ticker.stop();
  const previewWorld = new Container(); previewWorld.scale.set(0.075, 0.0421875); preview.stage.addChild(previewWorld);
  previewWorld.addChild(new Sprite(Texture.from(makeMapCanvas())));
  for (let index = 0; index < entityCount; index += 1) {
    const { x, y } = entityPosition(index);
    const sprite = new Sprite(Texture.WHITE);
    sprite.position.set(x, y); sprite.width = 18; sprite.height = 18; sprite.tint = index < selectedCount ? 0xffb347 : 0x66c2ff; sprite.eventMode = "none";
    previewWorld.addChild(sprite);
  }
  app.renderer.render(app.stage); preview.renderer.render(preview.stage); await nextFrame();
  const initMs = performance.now() - start;
  const panZoom = [];
  for (let frame = 0; frame < frames; frame += 1) {
    const tick = performance.now();
    entityContainer.position.set(frame * 1.5, frame * 0.75); entityContainer.scale.set(1 + frame / 1000);
    app.renderer.render(app.stage);
    await nextFrame();
    panZoom.push(performance.now() - tick);
  }
  const transforms = [];
  for (let frame = 0; frame < frames; frame += 1) {
    const tick = performance.now();
    for (let index = 0; index < selectedCount; index += 1) entities[index].x += frame % 2 ? -1 : 1;
    app.renderer.render(app.stage);
    await nextFrame();
    transforms.push(performance.now() - tick);
  }
  const selectionStart = performance.now();
  let marqueeMatches = 0;
  for (const sprite of entities) if (sprite.x >= 600 && sprite.y >= 600 && sprite.x <= 2400 && sprite.y <= 2400) marqueeMatches += 1;
  return { renderer: "pixi", initMs, panZoom: summarize(panZoom), transforms: summarize(transforms), marqueeMs: performance.now() - selectionStart, marqueeMatches };
}

try {
  const result = renderer === "konva" ? await runKonva() : await runPixi();
  globalThis.__DICEBOX_BENCHMARK_RESULT__ = { ...result, entityCount, selectedCount, frames, background: "4096x4096", viewport: `${width}x${height}`, preview: "320x180" };
} catch (error) {
  globalThis.__DICEBOX_BENCHMARK_ERROR__ = { message: error.message, stack: error.stack };
}
