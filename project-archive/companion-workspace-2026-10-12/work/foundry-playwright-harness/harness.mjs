import { chromium } from "playwright-core";
import readline from "node:readline";

const userDataDir = "C:\\Users\\rujie\\AppData\\Local\\DiceBox\\PlaywrightAssistantGM";
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const targetUrl = "http://localhost:30000/game";

const context = await chromium.launchPersistentContext(userDataDir, {
  executablePath: chromePath,
  headless: false,
  viewport: null,
  args: [
    "--remote-debugging-port=9223",
    "--window-size=1500,1000",
    "--window-position=60,60"
  ]
});

let pages = context.pages();
let page = pages[0] ?? await context.newPage();

if (!page.url() || page.url() === "about:blank") {
  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
}

async function snapshot() {
  pages = context.pages();
  return {
    pages: await Promise.all(pages.map(async (p, i) => ({
      i,
      url: p.url(),
      title: await p.title().catch(() => ""),
    }))),
    current: {
      url: page.url(),
      title: await page.title().catch(() => ""),
      text: (await page.locator("body").innerText().catch(() => "")).slice(0, 6000),
      inputs: await page.locator("input").evaluateAll(els => els.map(e => ({
        name: e.getAttribute("name"),
        type: e.getAttribute("type"),
        placeholder: e.getAttribute("placeholder"),
        value: e.value
      }))).catch(() => []),
      selects: await page.locator("select").evaluateAll(els => els.map(e => ({
        name: e.getAttribute("name"),
        value: e.value,
        options: Array.from(e.options).map(o => ({ text: o.text, value: o.value }))
      }))).catch(() => []),
      buttons: await page.locator("button").evaluateAll(els => els.map(e => ({
        text: (e.innerText || "").trim(),
        type: e.getAttribute("type")
      }))).catch(() => [])
    }
  };
}

console.log("DICEBOX_PLAYWRIGHT_READY " + JSON.stringify(await snapshot()));

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });

for await (const raw of rl) {
  const line = raw.trim();
  if (!line) continue;

  let cmd;
  try {
    cmd = JSON.parse(line);
  } catch (e) {
    console.log("DICEBOX_ERROR " + JSON.stringify({ error: "invalid-json", message: e.message }));
    continue;
  }

  try {
    if (cmd.op === "snapshot") {
      console.log("DICEBOX_RESULT " + JSON.stringify(await snapshot()));
    } else if (cmd.op === "goto") {
      await page.goto(String(cmd.url), { waitUntil: "domcontentloaded", timeout: 30000 });
      console.log("DICEBOX_RESULT " + JSON.stringify(await snapshot()));
    } else if (cmd.op === "clickText") {
      await page.getByText(String(cmd.text), { exact: cmd.exact !== false }).first().click({ timeout: 10000 });
      console.log("DICEBOX_RESULT " + JSON.stringify(await snapshot()));
    } else if (cmd.op === "select") {
      await page.locator(String(cmd.selector)).selectOption(String(cmd.value));
      console.log("DICEBOX_RESULT " + JSON.stringify(await snapshot()));
    } else if (cmd.op === "fill") {
      await page.locator(String(cmd.selector)).fill(String(cmd.value ?? ""));
      console.log("DICEBOX_RESULT " + JSON.stringify({ ok: true }));
    } else if (cmd.op === "click") {
      await page.locator(String(cmd.selector)).click({ timeout: 10000 });
      console.log("DICEBOX_RESULT " + JSON.stringify(await snapshot()));
    } else if (cmd.op === "eval") {
      const result = await page.evaluate(async (source) => {
        const fn = new Function("return (async () => {\n" + source + "\n})()");
        return await fn();
      }, String(cmd.source ?? ""));
      console.log("DICEBOX_RESULT " + JSON.stringify(result));
    } else if (cmd.op === "selectPage") {
      pages = context.pages();
      page = pages[Number(cmd.index) || 0];
      console.log("DICEBOX_RESULT " + JSON.stringify(await snapshot()));
    } else if (cmd.op === "close") {
      console.log("DICEBOX_RESULT " + JSON.stringify({ closing: true }));
      await context.close();
      process.exit(0);
    } else {
      console.log("DICEBOX_ERROR " + JSON.stringify({ error: "unknown-op", op: cmd.op }));
    }
  } catch (e) {
    console.log("DICEBOX_ERROR " + JSON.stringify({
      op: cmd.op,
      name: e?.name ?? "Error",
      message: e?.message ?? String(e)
    }));
  }
}
