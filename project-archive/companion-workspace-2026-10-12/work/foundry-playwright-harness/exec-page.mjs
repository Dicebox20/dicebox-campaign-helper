import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";

const [mode, sourcePath] = process.argv.slice(2);
if (!["read","write"].includes(mode) || !sourcePath) {
  console.error("usage: node exec-page.mjs <read|write> <source-file>");
  process.exit(2);
}

const browser = await chromium.connectOverCDP("http://127.0.0.1:9223");
const pages = browser.contexts().flatMap(c => c.pages());
const page = pages.find(p => p.url().includes("localhost:30000/game"));
if (!page) throw new Error("No Foundry /game page in DiceBox developer Chrome");

const identity = await page.evaluate(() => {
  const activeGMs = Array.from(game.users ?? [])
    .filter(u => u.active && u.isGM)
    .sort((a,b) => a.id.localeCompare(b.id));
  return {
    ready: game.ready,
    foundry: game.version,
    systemId: game.system?.id,
    systemVersion: game.system?.version,
    worldId: game.world?.id,
    user: game.user ? { id:game.user.id, name:game.user.name, isGM:game.user.isGM } : null,
    primaryGM: activeGMs[0] ? { id:activeGMs[0].id, name:activeGMs[0].name } : null,
    activeGMs: activeGMs.map(u => ({id:u.id,name:u.name}))
  };
});

const blockers = [];
if (!identity.ready) blockers.push("Foundry game is not ready.");
if (identity.foundry !== "14.367") blockers.push(`Foundry drift: ${identity.foundry}`);
if (identity.systemId !== "dnd5e" || identity.systemVersion !== "5.3.3") blockers.push(`System drift: ${identity.systemId} ${identity.systemVersion}`);
if (identity.worldId !== "the-lost-mine-of-phandalin") blockers.push(`World drift: ${identity.worldId}`);
if (!identity.user?.isGM) blockers.push("Developer Chrome user is not GM.");
if (identity.user?.name !== "Assistant Gamemaster") blockers.push(`Developer Chrome user is ${identity.user?.name}; expected explicitly authorized Assistant Gamemaster.`);
if (mode === "write" && identity.user?.name === "Assistant Gamemaster" && identity.user?.isGM) {
  // D-441 / D-444: this isolated developer session is an explicitly authorized project executor.
}

if (blockers.length) {
  console.log(JSON.stringify({operation:"dicebox.playwright.exec",status:"BLOCKED",mode,identity,blockers}));
  await browser.close();
  process.exit(3);
}

const source = await fs.readFile(path.resolve(sourcePath), "utf8");
const result = await page.evaluate(async ({source}) => {
  const fn = new Function("return (async () => {\n" + source + "\n})()");
  return await fn();
}, {source});

console.log(JSON.stringify({operation:"dicebox.playwright.exec",status:"PASS",mode,identity,result}));
await browser.close();
