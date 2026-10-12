// Independent CL91 M2/U2 additive-migration FINAL VERIFY: no state write.
const HASH=async s=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(s)))),b=>b.toString(16).padStart(2,"0")).join("");
const state=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state;
const m2=game.scenes.get("JZkxX6lUQe8Nc8xJ")?.regions.get("FRY091GwobgD2M5i")?.behaviors.get("IdriZEGhxUY9whcV");
const u2scene=game.scenes.get("PVf6Gbrv9HbB88uZ");
const u2=u2scene?.regions.find(r=>r.behaviors.has("J11ZvQh4lqzEsvRi"))?.behaviors.get("J11ZvQh4lqzEsvRi");
const ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"].map(x=>game.scenes.get(x));
const baseline={scenes:ids.length,missing:ids.filter(s=>!s).length,regions:ids.reduce((n,s)=>n+(s?.regions.size??0),0),
 behaviors:ids.reduce((n,s)=>n+(s?[...s.regions].reduce((m,r)=>m+r.behaviors.size,0):0),0),
 items:game.items.filter(i=>i.getFlag("world","dicebox")?.stableId?.startsWith("dbx:central-lodge:item:")).length};
const actual={
 sha:await HASH(JSON.stringify(state??{})),revision:state?.revision,
 portraitOpened:state?.puzzles?.m2?.founderPortraitOpened,
 portraitObserved:state?.puzzles?.m2?.founderPortraitObserved,
 servantObserved:state?.puzzles?.u2?.servantHistoryObserved,
 servantInterpreted:state?.puzzles?.u2?.servantHistoryInterpreted,
 clockSolved:state?.puzzles?.m1?.clockSettingResolved,
 branchUnlocked:state?.puzzles?.n3?.t3BranchUnlocked,
 oldEstateSurveyRecovered:state?.items?.["old-estate-survey"]?.recovered,
 m2Hash:await HASH(m2?.system?.source??""),u2Hash:await HASH(u2?.system?.source??""),
 kernelHash:await HASH(game.macros.get("FHQiFYx6OntZVo9d")?.command??""),
 clockHash:await HASH(game.scenes.get("U8S5ZrTjaPIkTUIL")?.regions.get("3tIrR12uv8ppFkOb")?.behaviors.contents[0]?.system?.source??"")
};
const ok=actual.sha==="7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7"
 &&actual.revision===2&&actual.portraitOpened===false&&actual.portraitObserved===false&&actual.servantObserved===false&&actual.servantInterpreted===false
 &&actual.clockSolved===false&&actual.branchUnlocked===false&&actual.oldEstateSurveyRecovered===false
 &&actual.m2Hash==="bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2"
 &&actual.u2Hash==="f815c0920579b163800a7bf5548d252dad398aeb245e90c48ce5363b0defd372"
 &&actual.kernelHash==="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814"
 &&actual.clockHash==="5ee8f97403d5144cbacf64e57ea58862bf4daf4ec4643088531e7f27e12ac997"
 &&baseline.missing===0&&baseline.regions===202&&baseline.behaviors===117&&baseline.items===33;
return {operation:"cl91-m2-u2-additive-final-readonly-v001",noWrite:true,status:ok?"PASS_SCHEMA_ONLY_NO_PLAYER_TEST":"BLOCKED_UNEXPECTED_STATE",baseline,actual};
