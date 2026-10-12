// Independent CL13 v002 post-install verifier, READ ONLY.
const ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const scenes=ids.map(id=>game.scenes.get(id)),m1=game.scenes.get("U8S5ZrTjaPIkTUIL");
const region=m1?.regions.get("3tIrR12uv8ppFkOb");
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(s)))),x=>x.toString(16).padStart(2,"0")).join("");
const expected={clock:"e669a6f7703eaada989886a6fd3058eab50df8d5661379aa27d10bc3ebedbeed",m1:"e20e2c11dc53d3901c188414dc4ae277764eb3c7d5c1c9a96fc772a7342bf42e",e4:"b7516e6f5fcd64822766fe7645d8c1462de9c318b2248fe3fcde010f28d1b93e",u1:"d37b49522da7e80c2ecbfb4ed9b031a827193620a7d315e1c1a69e3357ca45c4",kernel:"6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814"};
const named=(sid,rid,bid)=>game.scenes.get(sid)?.regions.get(rid)?.behaviors.get(bid);
const clock=region?.behaviors.contents[0],reward=m1?.regions.get("LmLxI7Ao8uFTyShb");
const results={
  uniqueScenes:scenes.length,
  missingScenes:scenes.filter(s=>!s).length,
  regions:scenes.reduce((n,s)=>n+(s?.regions.size??0),0),
  behaviors:scenes.reduce((n,s)=>n+(s?Array.from(s.regions).reduce((j,r)=>j+r.behaviors.size,0):0),0),
  items:game.items.filter(i=>i.getFlag?.("world","dicebox")?.campaignId==="central-lodge").length,
  clockRegionBehaviors:region?.behaviors.size,
  newStableId:clock?.getFlag?.("world","dicebox")?.stableId,
  clockBehaviorId:clock?.id,
  clockEvents:clock?.system?.events?Array.from(clock.system.events):null,
  clockSourceSha:await sha(clock?.system?.source??""),
  clueM1Sha:await sha(named("U8S5ZrTjaPIkTUIL","5H97UQm6VF3vw5Ru","1SyWN6w9CrUxgVhb")?.system?.source??""),
  clueU1Sha:await sha(named("if9iWDRjSwI87EeX","V1JRfiR56dgVGRa3","875pl2PyFUnEYO75")?.system?.source??""),
  clueE4Sha:await sha(named("DLcheEi6e5OHOYmU","eRjDUWAIS206MyZV","AjFHwHDxH7Pg9Vel")?.system?.source??""),
  kernelSha:await sha(game.macros.get("FHQiFYx6OntZVo9d")?.command??""),
  rewardBehaviorIds:reward?reward.behaviors.map(b=>b.id):[],
  rewardGated:reward?.behaviors.every(b=>String(b.system?.source??"").includes('puzzles.m1.clockSettingResolved'))??false,
  ledgerRevision:game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state?.revision,
  solved:game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state?.puzzles?.m1?.clockSettingResolved,
  emblem:game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state?.puzzles?.m1?.silverFamilyEmblemInstalled
};
const pass=results.missingScenes===0&&results.regions===202&&results.behaviors===117&&results.clockRegionBehaviors===1
&&results.newStableId==="dbx:central-lodge:m1:behavior:clock-setting-seventh-winter-v001"
&&results.clockEvents?.length===1&&results.clockEvents[0]==="tokenMoveIn"&&results.clockSourceSha===expected.clock
&&results.clueM1Sha===expected.m1&&results.clueU1Sha===expected.u1&&results.clueE4Sha===expected.e4
&&results.kernelSha===expected.kernel&&results.rewardBehaviorIds.length===2&&results.rewardGated
&&results.ledgerRevision===1&&results.solved===false&&results.emblem===false;
return {operation:"cl13-clock-final-readonly-v001",noWrite:true,status:pass?"PASS_SOURCE_INSTALLED_NO_PLAYER_TEST":"BLOCKED_READBACK",results};
