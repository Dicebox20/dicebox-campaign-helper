const { spawn } = require("node:child_process");
const { writeFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { chromium } = require("C:/Users/rujie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = __dirname;
const server = spawn(process.env.ComSpec ?? "C:/Windows/System32/cmd.exe", ["/d", "/s", "/c", "npm run serve"], { cwd: root, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
const sleep = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { if ((await fetch("http://127.0.0.1:4179")).ok) return; } catch {}
    await sleep(250);
  }
  throw new Error("Benchmark server did not become ready.");
}

(async () => {
  try {
    await waitForServer();
    const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader"] });
    const results = [];
    for (const renderer of ["konva", "pixi"]) {
      const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
      await page.goto(`http://127.0.0.1:4179/?renderer=${renderer}&entities=4000&selected=250&frames=90`, { waitUntil: "networkidle" });
      await page.waitForFunction(() => globalThis.__DICEBOX_BENCHMARK_RESULT__ || globalThis.__DICEBOX_BENCHMARK_ERROR__, null, { timeout: 120000 });
      const outcome = await page.evaluate(() => globalThis.__DICEBOX_BENCHMARK_RESULT__ ?? { error: globalThis.__DICEBOX_BENCHMARK_ERROR__ });
      results.push(outcome);
      await page.close();
    }
    const receipt = {
      operation: "m184.editor-renderer-benchmark",
      status: results.some((result) => result.error) ? "BLOCKED" : "PASS",
      evidenceClass: "local-benchmark",
      environment: { os: process.platform, node: process.version, browser: await browser.version(), gpuMode: "headless Chrome SwiftShader" },
      workload: { background: "4096x4096", semanticEntitiesPerViewport: 4000, simultaneousPreviewEntities: 4000, selectedTransformsPerFrame: 250, panZoomFrames: 90, transformFrames: 90 },
      results,
      limits: ["Single Windows/SwiftShader run; does not certify macOS/Linux system WebViews.", "Measures renderer scene cost, not Rust geometry or accessibility."],
      timestamp: new Date().toISOString()
    };
    writeFileSync(resolve(root, "../../outputs/m184-editor-renderer-benchmark.json"), `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
    process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
    await browser.close();
  } finally {
    server.kill();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
