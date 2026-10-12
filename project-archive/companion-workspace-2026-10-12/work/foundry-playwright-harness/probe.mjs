import { chromium } from "playwright-core";
const browser = await chromium.connectOverCDP("http://127.0.0.1:9223");
const contexts = browser.contexts();
const pages = contexts.flatMap(c => c.pages());
const page = pages.find(p => p.url().includes("localhost:30000")) ?? pages[0];
if (!page) throw new Error("No developer Chrome page found");
await page.waitForTimeout(300);
const result = await page.evaluate(() => ({
  url: location.href,
  title: document.title,
  bodyText: document.body?.innerText?.slice(0,8000) ?? "",
  username: document.querySelector('input[name="username"]')?.outerHTML ?? null,
  inputs: [...document.querySelectorAll("input")].map(e => ({
    name:e.getAttribute("name"), type:e.getAttribute("type"), value:e.value,
    list:e.getAttribute("list"), autocomplete:e.getAttribute("autocomplete")
  })),
  datalists: [...document.querySelectorAll("datalist")].map(d => ({
    id:d.id, options:[...d.querySelectorAll("option")].map(o=>({value:o.value,label:o.label,text:o.textContent}))
  })),
  allOptions: [...document.querySelectorAll("option")].map(o => ({
    value:o.value,label:o.label,text:o.textContent
  })),
  listboxes: [...document.querySelectorAll('[role="listbox"],[role="option"]')].map(e => ({
    role:e.getAttribute("role"), text:e.textContent, html:e.outerHTML.slice(0,1000)
  })),
  game: globalThis.game ? {
    ready: globalThis.game.ready,
    user: globalThis.game.user ? {id:globalThis.game.user.id,name:globalThis.game.user.name,isGM:globalThis.game.user.isGM} : null,
    users: globalThis.game.users?.map ? globalThis.game.users.map(u=>({id:u.id,name:u.name,role:u.role,isGM:u.isGM,active:u.active})) : null
  } : null
}));
console.log(JSON.stringify(result));
await browser.close();
