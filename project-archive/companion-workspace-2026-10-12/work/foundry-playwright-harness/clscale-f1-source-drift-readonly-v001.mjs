import fs from "node:fs";
import {chromium} from "playwright-core";
const root=String.raw`C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper`;
const snap=JSON.parse(fs.readFileSync(root+"\\outputs\\foreman-checkpoints\\clscale-f1-arrival-source-readonly-v001.json","utf8"));
const old=snap.scenes.find(s=>s.id==="La9krMOMBhAhDLi6")?.source;
if(!old)throw Error("NO_F1_BASELINE");
const browser=await chromium.connectOverCDP("http://127.0.0.1:9223");
try{
 const page=browser.contexts().flatMap(c=>c.pages()).find(p=>p.url().includes("localhost:30000/game"));
 if(!page)throw Error("NO_EXACT_LIVE_VIEW");
 const now=await page.evaluate(()=>{
  if(game.world?.id!=="the-lost-mine-of-phandalin"||!game.user?.isGM)throw Error("LIVE_IDENTITY_DRIFT");
  return game.scenes.get("La9krMOMBhAhDLi6").toObject();
 });
 const changes=[];
 const walk=(a,b,at)=>{
  if(changes.length>=100)return;
  if(a===b)return;
  if(typeof a!=="object"||typeof b!=="object"||a===null||b===null||Array.isArray(a)!==Array.isArray(b)){
    changes.push({path:at,old:String(JSON.stringify(a)).slice(0,260),now:String(JSON.stringify(b)).slice(0,260)});return;
  }
  const keys=new Set([...Object.keys(a),...Object.keys(b)]);
  for(const key of keys)walk(a[key],b[key],at+"."+key);
 };
 walk(old,now,"F1");
 console.log(JSON.stringify({status:changes.length?"DRIFT_FOUND":"IDENTICAL",count:changes.length,changes}));
}finally{await browser.close();}
