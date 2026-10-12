import {chromium} from "playwright-core";
const browser=await chromium.connectOverCDP("http://127.0.0.1:9223");
try {
 const pages=browser.contexts().flatMap(c=>c.pages());
 const results=[];
 for(const p of pages) {
  const u=p.url();
  if(!/127\.0\.0\.1:30005|localhost:30005/.test(u))continue;
  const data=await p.evaluate(()=>{
   const g=typeof game!=="undefined"?game:null;
   return {ready:!!g?.ready,world:g?.world?.id??null,gmName:g?.user?.name??null,
   isGM:g?.user?.isGM??null,core:g?.version??null,system:g?.system?.version??null,
   users:g?.users?.size??null,nonGMUsers:g?.users?.filter(u=>!u.isGM).length??null,
   scenes:g?.scenes?.size??null,actors:g?.actors?.size??null,
   title:document?.title,formFields:[...document.querySelectorAll("input, select")].map(el=>({type:el.type,name:el.name,id:el.id})).slice(0,12)};
  });
  results.push({url:u,identity:data});
 }
 console.log(JSON.stringify({pages:results,count:results.length,status:"READ_ONLY_BROWSER_INVENTORY"}));
}finally{await browser.close();}