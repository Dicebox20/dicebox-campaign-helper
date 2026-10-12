const ID="central-lodge.cl51.ownership-metadata-audit.v002",IDS=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const all=[],dups=new Set(),seen=new Set(),errors=[];
for(const id of IDS){
 const s=game.scenes.get(id);if(!s){errors.push("Scene missing: "+id);continue;}
 for(const l of s.lights){
  const legacy=l.flags?.["dicebox-campaign-helper"]??null,modern=l.flags?.world?.dicebox??null,mode=legacy?"dicebox-campaign-helper":modern?"world.dicebox":"unknown";
  const stableId=legacy?.stableId??modern?.stableId??null,owner=legacy?.managed?.owner??(modern?.managed===true?"central-lodge":null);
  if(!stableId||!owner)errors.push("Fixture ownership ambiguous:"+s.name+"/"+l.name);
  if(seen.has(stableId))dups.add(stableId);else seen.add(stableId);
  const x={sceneId:id,sceneName:s.name,id:l.id,name:l.name,x:l.x,y:l.y,hidden:l.hidden,namespace:mode,stableId,owner,dayNightKey:legacy?.campaignTimeKey??null,systemStateKey:legacy?.stateKey??null,activeState:legacy?.activeState??modern?.state??null,pacingGroup:legacy?.pacingGroup??modern?.group??null,photosensitivitySafe:legacy?.photosensitivitySafe??null,animation:l.config?.animation?.type??null,speed:l.config?.animation?.speed??null,intensity:l.config?.animation?.intensity??null,bright:l.config?.bright??null,dim:l.config?.dim??null};
  all.push(x);
 }
}
const counts={};
for(const x of all){const key=x.namespace+"|"+(x.dayNightKey??x.systemStateKey??x.activeState??"none");counts[key]=(counts[key]??0)+1;}
const groups={};for(const x of all){const k=x.pacingGroup??"ungrouped";groups[k]=(groups[k]??0)+1;}
const unresolved=all.filter(x=>!x.dayNightKey&&!x.systemStateKey&&!x.activeState);
if(all.length!==86||dups.size||errors.length)errors.push("Fixture roster or ownership integrity failure");
return{operation:ID,status:errors.length?"FAIL":"PASS",noWrite:true,errors,summary:{total:all.length,uniqueStableIds:seen.size,hidden:all.filter(x=>x.hidden).length,namespaces:counts,pacingGroups:groups,unresolvedStateBindings:unresolved.length,modernWorldDicebox:all.filter(x=>x.namespace==="world.dicebox").length,legacyDiceboxCampaignHelper:all.filter(x=>x.namespace==="dicebox-campaign-helper").length},unresolved,lights:all,notes:"Metadata classification only; no strobe/LOS runtime or fixture-art alignment canary and no change to hidden flags."};