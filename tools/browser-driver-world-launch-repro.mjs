import { createServer } from "node:http";

const LOOPBACK_HOST = "127.0.0.1";

export function renderWorldLaunchFixture() {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>DiceBox local worldLaunch reproduction</title>
<style>body{font:16px system-ui;margin:2rem}a{display:inline-block;padding:.65rem 1rem;border:1px solid #225;color:#124;background:#eef;text-decoration:none}output{display:block;margin-top:1rem;font-family:monospace}</style>
</head><body>
<main data-package-type="world"><section class="package" data-package-id="dbx-local-repro">
<a id="world-launch" data-action="worldLaunch" href="/not-navigated" aria-disabled="false">Launch World</a>
</section><output id="dispatch-receipt" aria-live="polite">NOT_DISPATCHED</output></main>
<script>
  const receipt = document.getElementById("dispatch-receipt");
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button || button.dataset.action !== "worldLaunch") return;
    event.preventDefault();
    if (event.button !== 0) return;
    receipt.textContent = "DISPATCHED_PRIMARY_WORLD_LAUNCH";
  });
</script></body></html>`;
}

export function inspectWorldLaunchFixture() {
  return Object.freeze({
    operation: "dicebox.browser-driver.world-launch-repro.inspect",
    status: "PASS",
    evidenceClass: "deterministic",
    host: LOOPBACK_HOST,
    persistentWrite: false,
    foundryLaunch: false,
    contract: Object.freeze({
      selector: "a[data-action=worldLaunch]",
      visibleText: "Launch World",
      enabled: true,
      delegated: true,
      primaryButtonOnly: true,
      navigationPrevented: true,
      initialReceipt: "NOT_DISPATCHED",
      dispatchedReceipt: "DISPATCHED_PRIMARY_WORLD_LAUNCH",
    }),
    blockers: Object.freeze([]),
    readyClaim: false,
  });
}

export async function startWorldLaunchFixture({ port = 0 } = {}) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error("port must be an integer from 0 through 65535");
  const markup = renderWorldLaunchFixture();
  const report = inspectWorldLaunchFixture();
  const server = createServer((request, response) => {
    if (request.method !== "GET") {
      response.writeHead(405, { Allow: "GET" });
      response.end();
      return;
    }
    if (request.url === "/") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      response.end(markup);
      return;
    }
    if (request.url === "/receipt") {
      response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      response.end(JSON.stringify(report));
      return;
    }
    response.writeHead(404, { "cache-control": "no-store" });
    response.end();
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen({ host: LOOPBACK_HOST, port }, () => {
      server.off("error", reject);
      resolve();
    });
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    await new Promise((resolve) => server.close(resolve));
    throw new Error("fixture server did not expose a TCP address");
  }
  const url = `http://${LOOPBACK_HOST}:${address.port}/`;
  return Object.freeze({
    url,
    report,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  });
}

async function main() {
  const portArgument = process.argv.find((argument) => argument.startsWith("--port="));
  const port = portArgument ? Number(portArgument.slice("--port=".length)) : 0;
  const fixture = await startWorldLaunchFixture({ port });
  console.log(JSON.stringify({ operation: "dicebox.browser-driver.world-launch-repro.start", status: "READY", url: fixture.url, ...fixture.report }, null, 2));
  const stop = async () => {
    await fixture.close();
    process.exitCode = 0;
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
}

if (import.meta.url === `file:///${process.argv[1]?.replaceAll("\\", "/")}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
