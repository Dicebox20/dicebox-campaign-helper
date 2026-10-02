import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { deflateSync } from "node:zlib";
import { ASCENDANCY_TRAM_BOARD, ASCENDANCY_TRAM_CORE_RAIL } from "@dicebox/compiler";

const root = resolve(".");
const outputDirectory = join(root, "outputs", "m115-tram-graybox");
const svgOutput = join(outputDirectory, "ascendancy-tram-depot-v4-graybox.svg");
const pngOutput = join(outputDirectory, "ascendancy-tram-depot-v4-graybox.png");
const fixtureAssetOutput = join(root, "assets", "maps", "ascendancy-tram-calibration-graybox-v1.png");
const { origin, cellWidth, cellHeight, columns, rows } = ASCENDANCY_TRAM_BOARD;
const boardWidth = cellWidth * columns;
const boardHeight = cellHeight * rows;
const east = origin.x + boardWidth;
const south = origin.y + boardHeight;
const gateHalfHeight = 47.5;
const gateTop = ASCENDANCY_TRAM_CORE_RAIL.exit.y - gateHalfHeight;
const gateBottom = ASCENDANCY_TRAM_CORE_RAIL.exit.y + gateHalfHeight;

const gridLines = [
  ...Array.from({ length: columns + 1 }, (_, index) => `<line x1="${origin.x + index * cellWidth}" y1="${origin.y}" x2="${origin.x + index * cellWidth}" y2="${south}"/>`),
  ...Array.from({ length: rows + 1 }, (_, index) => `<line x1="${origin.x}" y1="${origin.y + index * cellHeight}" x2="${east}" y2="${origin.y + index * cellHeight}"/>`),
].join("\n    ");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
  <rect width="1536" height="1024" fill="#111214"/>
  <rect x="24" y="24" width="1488" height="976" rx="26" fill="#1f2225" stroke="#9a7434" stroke-width="18"/>
  <rect x="${origin.x}" y="${origin.y}" width="${boardWidth}" height="${boardHeight}" fill="#2d3134" stroke="#c79844" stroke-width="18"/>
  <g stroke="#8b6a36" stroke-width="9" fill="none">${gridLines}</g>
  <g stroke="#dbc078" stroke-width="10" fill="none" opacity="0.92">
    <line x1="${east}" y1="${ASCENDANCY_TRAM_CORE_RAIL.exit.y}" x2="${ASCENDANCY_TRAM_CORE_RAIL.outerDoor.x}" y2="${ASCENDANCY_TRAM_CORE_RAIL.outerDoor.y}"/>
    <line x1="${origin.x}" y1="${origin.y}" x2="${east}" y2="${origin.y}"/>
    <line x1="${origin.x}" y1="${south}" x2="${east}" y2="${south}"/>
    <line x1="${origin.x}" y1="${origin.y}" x2="${origin.x}" y2="${gateTop}"/>
    <line x1="${origin.x}" y1="${gateBottom}" x2="${origin.x}" y2="${south}"/>
    <line x1="${east}" y1="${origin.y}" x2="${east}" y2="${gateTop}"/>
    <line x1="${east}" y1="${gateBottom}" x2="${east}" y2="${south}"/>
  </g>
  <rect x="1120" y="120" width="300" height="220" rx="18" fill="#2b2622" stroke="#a97935" stroke-width="10"/>
  <rect x="1120" y="640" width="300" height="220" rx="18" fill="#2b2622" stroke="#a97935" stroke-width="10"/>
  <path d="M1512 ${gateTop}V${gateBottom}" stroke="#c79844" stroke-width="18"/>
</svg>`;

const width = 1536;
const height = 1024;
const pixels = new Uint8Array(width * height * 4);

function color(hex: string): readonly [number, number, number, number] {
  return [Number.parseInt(hex.slice(1, 3), 16), Number.parseInt(hex.slice(3, 5), 16), Number.parseInt(hex.slice(5, 7), 16), 255];
}

function fillRect(x: number, y: number, rectWidth: number, rectHeight: number, fill: readonly number[]): void {
  const startX = Math.max(0, Math.floor(x));
  const startY = Math.max(0, Math.floor(y));
  const endX = Math.min(width, Math.ceil(x + rectWidth));
  const endY = Math.min(height, Math.ceil(y + rectHeight));
  for (let row = startY; row < endY; row += 1) {
    for (let column = startX; column < endX; column += 1) {
      const offset = (row * width + column) * 4;
      pixels.set(fill, offset);
    }
  }
}

function strokeRect(x: number, y: number, rectWidth: number, rectHeight: number, strokeWidth: number, stroke: readonly number[]): void {
  fillRect(x, y, rectWidth, strokeWidth, stroke);
  fillRect(x, y + rectHeight - strokeWidth, rectWidth, strokeWidth, stroke);
  fillRect(x, y, strokeWidth, rectHeight, stroke);
  fillRect(x + rectWidth - strokeWidth, y, strokeWidth, rectHeight, stroke);
}

function writeUint32(buffer: Buffer, offset: number, value: number): void {
  buffer.writeUInt32BE(value >>> 0, offset);
}

function crc32(buffer: Buffer): number {
  let value = 0xffffffff;
  for (const byte of buffer) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit += 1) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
  }
  return (value ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuffer = Buffer.from(type, "ascii");
  const chunk = Buffer.alloc(12 + data.length);
  writeUint32(chunk, 0, data.length);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  writeUint32(chunk, 8 + data.length, crc32(Buffer.concat([typeBuffer, data])));
  return chunk;
}

const charcoal = color("#111214");
const room = color("#1f2225");
const brass = color("#9a7434");
const board = color("#2d3134");
const grid = color("#8b6a36");
const rail = color("#dbc078");
const bay = color("#2b2622");
const bayStroke = color("#a97935");

fillRect(0, 0, width, height, charcoal);
fillRect(24, 24, 1488, 976, room);
strokeRect(24, 24, 1488, 976, 18, brass);
fillRect(origin.x, origin.y, boardWidth, boardHeight, board);
strokeRect(origin.x, origin.y, boardWidth, boardHeight, 18, color("#c79844"));
for (let column = 0; column <= columns; column += 1) fillRect(origin.x + column * cellWidth - 4, origin.y, 9, boardHeight, grid);
for (let row = 0; row <= rows; row += 1) fillRect(origin.x, origin.y + row * cellHeight - 4, boardWidth, 9, grid);
fillRect(east, gateTop, ASCENDANCY_TRAM_CORE_RAIL.outerDoor.x - east, 10, rail);
fillRect(origin.x, origin.y, boardWidth, 10, rail);
fillRect(origin.x, south - 10, boardWidth, 10, rail);
fillRect(origin.x, origin.y, 10, gateTop - origin.y, rail);
fillRect(origin.x, gateBottom, 10, south - gateBottom, rail);
fillRect(east - 10, origin.y, 10, gateTop - origin.y, rail);
fillRect(east - 10, gateBottom, 10, south - gateBottom, rail);
fillRect(1120, 120, 300, 220, bay);
strokeRect(1120, 120, 300, 220, 10, bayStroke);
fillRect(1120, 640, 300, 220, bay);
strokeRect(1120, 640, 300, 220, 10, bayStroke);
fillRect(1512 - 9, gateTop, 18, gateBottom - gateTop, color("#c79844"));

const scanlines = Buffer.alloc((width * 4 + 1) * height);
for (let row = 0; row < height; row += 1) {
  const pngOffset = row * (width * 4 + 1);
  scanlines[pngOffset] = 0;
  Buffer.from(pixels.buffer, pixels.byteOffset + row * width * 4, width * 4).copy(scanlines, pngOffset + 1);
}
const header = Buffer.alloc(13);
writeUint32(header, 0, width);
writeUint32(header, 4, height);
header.set([8, 6, 0, 0, 0], 8);
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk("IHDR", header), pngChunk("IDAT", deflateSync(scanlines)), pngChunk("IEND", Buffer.alloc(0))]);

await mkdir(outputDirectory, { recursive: true });
await writeFile(svgOutput, svg, "utf8");
await writeFile(pngOutput, png);
await mkdir(dirname(fixtureAssetOutput), { recursive: true });
await writeFile(fixtureAssetOutput, png);
process.stdout.write(`${JSON.stringify({ operation: "tram-graybox", status: "STATIC_REVIEW", outputs: { svg: svgOutput, png: pngOutput, fixtureAsset: fixtureAssetOutput }, canvas: { width, height }, board: { origin, cellWidth, cellHeight, columns, rows }, noWrite: true })}\n`);
