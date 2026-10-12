import {chromium} from "playwright-core";import fs from "node:fs/promises";import crypto from "node:crypto";import path from "node:path";
const ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const browser=await chromium.connectOverCDP("http://127.0.0.1:9223");try{
 const page=browser.contexts().flatMap(c=>c.pages()).find(p=>p.url().includes("localhost:30000/game"));if(!page)throw Error("Foundry tab absent");
 const data=await page.evaluate(ids=>{
  const sceneData=ids.map(id=>{const s=game.scenes.get(id);if(!s)throw Error("Missing scene:"+id);return{sceneId:s.id,name:s.name,sceneStableId:s.getFlag("world","dicebox")?.stableId??null,regions:Array.from(s.regions).map(r=>r.toObject())}});
  return{snapshotType:"dicebox/central-lodge/region-backup-v001",world:game.world.id,foundry:game.version,system:game.system.id,systemVersion:game.system.version,executor:game.user.id,sceneData};
 },ids);
 if(data.world!=="the-lost-mine-of-phandalin"||data.foundry!=="14.367"||data.executor!=="pnTxw7VYpYR4IKWE"||data.sceneData.length!==21)throw Error("Identity mismatch");
 const regions=data.sceneData.flatMap(s=>s.regions),behaviors=regions.reduce((n,r)=>n+(r.behaviors?.length??0),0);
 if(regions.length!==202||behaviors!==115)throw Error("Baseline count mismatch:"+regions.length+"/"+behaviors);
 const allIds=regions.map(r=>r._id);if(new Set(allIds).size!==202)throw Error("Region UUID collision");
 const dir=path.join("receipts","region-cleanup-2026-10-07");await fs.mkdir(dir,{recursive:true});
 const snapshot=path.join(dir,"all-21-scenes-all-202-regions-full-backup-v001.json"),content=JSON.stringify(data,null,2)+"\n",hash=crypto.createHash("sha256").update(content).digest("hex");
 await fs.writeFile(snapshot,content,{flag:"wx"});
 const manifest={snapshotType:data.snapshotType,relativePath:snapshot,sha256:hash,bytes:Buffer.byteLength(content),sceneCount:data.sceneData.length,regionCount:regions.length,behaviorCount:behaviors,zeroBehaviorRegions:regions.filter(r=>(r.behaviors?.length??0)===0).length,world:data.world,executor:data.executor,capturedAt:new Date().toISOString(),behaviorIds:regions.flatMap(r=>(r.behaviors??[]).map(b=>b._id))};
 await fs.writeFile(path.join(dir,"manifest-v001.json"),JSON.stringify(manifest,null,2)+"\n",{flag:"wx"});
 console.log("REGION_BACKUP_PASS "+JSON.stringify({path:snapshot,manifest:dir+"/manifest-v001.json",sha256:hash,sceneCount:21,regionCount:regions.length,behaviorCount:behaviors,zeroBehaviorRegions:manifest.zeroBehaviorRegions,bytes:manifest.bytes}));
}finally{await browser.close()}