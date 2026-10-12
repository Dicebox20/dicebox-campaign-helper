// Repeatable CL90 no-write progress-safety snapshot; explicit known blockers are not passes.
const failures=[],ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
let regions=0,behaviors=0,disabled=0,missingIds=0;const stableIds=new Set();
for(const id of ids){const s=game.scenes.get(id);if(!s){failures.push("Missing scene "+id);continue;}regions+=s.regions.size;for(const r of s.regions)for(const b of r.behaviors){behaviors++;if(b.disabled)disabled++;const sid=b.getFlag("world","dicebox")?.stableId;if(!sid||stableIds.has(sid))missingIds++;stableIds.add(sid);}}
if(regions!==202||behaviors!==118||disabled||missingIds||stableIds.size!==118)failures.push("Roster/stableId drift");
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(s??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const kernelHash=await sha(game.macros.get("FHQiFYx6OntZVo9d")?.command??"");
if(kernelHash!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814"||ledger.revision!==2||Object.keys(ledger.notices??{}).length!==2||ledger.puzzles?.e1?.recentUseObserved!==true)failures.push("Kernel/ledger drift");
const itemCount=game.items.filter(i=>i.getFlag("world","dicebox")?.stableId?.startsWith("dbx:central-lodge:item:")).length;
if(itemCount!==33)failures.push("Item count drift");
const m1=game.scenes.get("U8S5ZrTjaPIkTUIL")?.regions.get("3tIrR12uv8ppFkOb");
const n3=game.scenes.get("pHQvDUDlyWZFuNrX")?.regions.get("RP1jYOH738xl9hks");
if(m1?.behaviors.size!==1||n3?.behaviors.size!==0||ledger.puzzles?.m1?.clockSettingResolved!==false||ledger.puzzles?.n3?.t3BranchUnlocked!==false)failures.push("Unapproved blocked puzzle change");
const cl13behavior=m1?.behaviors.find(b=>b.getFlag("world","dicebox")?.stableId==="dbx:central-lodge:m1:behavior:clock-setting-seventh-winter-v001");
if(!cl13behavior||cl13behavior.disabled||cl13behavior.system?.events?.size!==1||!cl13behavior.system?.events?.has("tokenMoveIn")
||await sha(cl13behavior.system?.source??"")!=="5ee8f97403d5144cbacf64e57ea58862bf4daf4ec4643088531e7f27e12ac997")
failures.push("CL13 installed M1 clock behavior source/event drift");
if(ledger.puzzles?.m2?.founderPortraitOpened!==false||ledger.puzzles?.m2?.founderPortraitObserved!==false||
ledger.puzzles?.u2?.servantHistoryObserved!==false||ledger.puzzles?.u2?.servantHistoryInterpreted!==false)
 failures.push("M2/U2 additive stage schema drift");
const m2portrait=game.scenes.get("JZkxX6lUQe8Nc8xJ")?.regions.get("FRY091GwobgD2M5i")?.behaviors.get("IdriZEGhxUY9whcV");
const u2scene=game.scenes.get("PVf6Gbrv9HbB88uZ");
const u2history=u2scene?.regions.find(r=>r.behaviors.has("J11ZvQh4lqzEsvRi"))?.behaviors.get("J11ZvQh4lqzEsvRi");
if(await sha(m2portrait?.system?.source??"")!=="bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2"
 ||await sha(u2history?.system?.source??"")!=="f815c0920579b163800a7bf5548d252dad398aeb245e90c48ce5363b0defd372")
 failures.push("M2/U2 installed narrative handler source drift");
const u2r=game.scenes.get("PVf6Gbrv9HbB88uZ")?.regions.get("qa4n4o834OZTKPoV");
const u2new=u2r?.behaviors.filter(b=>b.getFlag("world","dicebox")?.stableId==="dbx:central-lodge:u2:behavior:servant-history-interpretation-v001")??[];
if(u2r?.behaviors.size!==2||u2new.length!==1||u2new[0].disabled||
 !u2new[0].system?.events?.has("tokenMoveIn")||
 await sha(u2new[0].system?.source??"")!=="11bbc0837bf1a4ccc20c62b523f8b9acc1061078a585a1f7e36de5cc303c4b32")
 failures.push("CL91 U2 interpretation source or event drift");
const m=game.macros.get("P7mgEkmAUiJXYdUD"),b=game.scenes.get("Zq8iXByDVhHRbA7w").regions.get("QS7OpvIilyyDpmLc").behaviors.get("HBtxj5OwVSOJdqnC");
if(!m||game.macros.size!==134||m.getFlag("world","dicebox")?.stableId!=="dbx:central-lodge:cl52:macro:m1-distant-footsteps-one-shot"||b?.getFlag("world","dicebox")?.stableId!=="dbx:central-lodge:e1:behavior:main-entrance-to-m1")failures.push("CL50 E1M1 or CL52 M1 macro missing");
if(game.scenes.get("U8S5ZrTjaPIkTUIL")?.getFlag("world","dicebox")?.cl52!==undefined)failures.push("M1 one-shot flag changed");
const expectedMacro="4ff5a82aa5d57f8831f47063fab893eaea4d315942d59b9fbda99a0a1a9a42b6",expectedBehavior="f144c80ca7789ea0ca246a43529bea56b53776d965b1c6471670a89abf236b0f";
if(await sha(m?.command??"")!==expectedMacro||await sha(b?.system?.source??"")!==expectedBehavior)failures.push("CL50 or CL52 source hash drift");

const piano=game.macros.get("VHVC7yVlrNS7mWGJ"),m2=game.scenes.get("JZkxX6lUQe8Nc8xJ");
if(!piano||piano.getFlag("world","dicebox")?.stableId!=="dbx:central-lodge:cl52:macro:m2-haunted-piano-one-shot"||piano.type!=="script"||await sha(piano.command)!=="c27e902c6232b946ee36a61572ac17a88cd5fca54acbe391afd7fdbf483e0e3b")failures.push("M2 haunted piano Macro source/ID drift");
if(m2?.getFlag("world","dicebox")?.cl52!==undefined)failures.push("M2 one-shot flag consumed unexpectedly");
if(Object.keys(ledger.notices??{}).sort().join("|")!=="e1|observation:e1")failures.push("E1 notice keys drift");
return{operation:"cl90.progress-safety-smoke-v006",status:failures.length?"FAIL":"PASS_WITH_KNOWN_BLOCKERS",noWrite:true,failures,baseline:{scenes:ids.length,regions,behaviors,stableIds:stableIds.size,disabled,itemCount,revision:ledger.revision,kernelHash},knownBlockers:["M1 clock installed and source-verified; actual player clock interaction and reward completion not yet tested","N3 to T3 branch unlock action not authored","M2 Founder Portrait observed/opened distinct ledger fields source-verified; separate physical player reveal untested","U2 servant-history interpretation RegionBehavior source-installed, real player evidence-gate pending"],noGameplayCanary:true};