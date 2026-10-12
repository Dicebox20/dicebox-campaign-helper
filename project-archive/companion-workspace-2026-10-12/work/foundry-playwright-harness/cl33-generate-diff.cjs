const fs=require("node:fs");const s=fs.readFileSync("cl33-migration-preview-v001.page.js","utf8"),idx=s.lastIndexOf("\nreturn{operation:OPERATION");fs.writeFileSync("cl33-model-difference-v001.page.js",s.slice(0,idx)+`
const differences=[];
for(const x of SPECS){
const r=game.scenes.get(x.sceneId).regions.get(x.regionId),model=new (CONFIG.RegionBehavior.documentClass)({name:x.behaviorName,type:"executeScript",system:{events:x.events,source:x.source}},{parent:r});
const a=x.source,b=model.system?.source??"";let i=0;while(i<Math.min(a.length,b.length)&&a[i]===b[i])i++;
differences.push({key:x.itemKey,inputLength:a.length,normalizedLength:b.length,firstDiff:i,aroundInput:a.slice(Math.max(0,i-70),i+140),aroundModel:b.slice(Math.max(0,i-70),i+140),inputEnd:a.slice(-130),modelEnd:b.slice(-130),inputHash:await sha(a),modelHash:await sha(b)});
}
return{operation:"cl33-foundry-source-normalization",noWrite:true,differences};
`);