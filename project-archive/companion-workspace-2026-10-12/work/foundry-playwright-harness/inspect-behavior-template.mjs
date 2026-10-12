import { chromium } from "playwright-core";
const browser = await chromium.connectOverCDP("http://127.0.0.1:9223");
const page = browser.contexts().flatMap(c=>c.pages()).find(p=>p.url().includes("localhost:30000/game"));
if (!page) throw new Error("Foundry developer page missing");
const result = await page.evaluate(() => {
  const b1=game.scenes.get("0CSBwzcszPKyaB8u");
  const rows=[
    ["pickup", b1?.regions.get("O26xv0Lx0U3zRHCI")?.behaviors.get("zU1906kEP5mhGWnH")],
    ["notice", b1?.regions.get("RQxVu52OSbYlkD9c")?.behaviors.get("UQizsoqZl2dW2yOJ")],
    ["waterwheel", b1?.regions.get("xIFjdjHmF2qn5Nij")?.behaviors.get("jL7OU30qz2hVwLI2")]
  ];
  return rows.map(([key,b])=>({key,exists:!!b,object:b?.toObject() ?? null}));
});
console.log(JSON.stringify(result));
await browser.close();