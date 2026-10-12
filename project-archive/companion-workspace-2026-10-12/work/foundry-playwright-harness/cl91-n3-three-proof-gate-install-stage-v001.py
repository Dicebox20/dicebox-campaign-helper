from pathlib import Path
import json,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
source=(r/'cl91-n3-three-proof-gate-source-v001.js').read_text(encoding='utf-8').rstrip('\r\n')
sha=lambda s:hashlib.sha256(s.encode('utf-8')).hexdigest()
assert 'teleportToken' not in source and 'pullUsers' not in source and 'createEmbeddedDocuments' not in source
assert source.count('statePath:"puzzles.n3.t3BranchUnlocked"')==1
head="""// CL91 N3 exact-hash, no-player three-proof source installation. No teleport.
const sha=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(x??'')))),b=>b.toString(16).padStart(2,'0')).join('');
if(game.version!=="14.367"||game.world.id!=="the-lost-mine-of-phandalin"||game.system?.id!=="dnd5e"
 ||game.system.version!=="5.3.3"||!game.user.isGM||game.user.name!=="Assistant Gamemaster"||
 game.users.some(x=>x.active&&!x.isGM))throw Error("N3_STACK_OR_EXECUTOR_DRIFT");
const scene=game.scenes.get("pHQvDUDlyWZFuNrX"),region=scene?.regions.get("RP1jYOH738xl9hks");
if(!region||region.behaviors.size!==0||region.getFlag("world","dicebox")?.stableId!=="dbx:central-lodge:n3:region:n3-branch-railway")
 throw Error("N3_BRANCH_REGION_DRIFT_OR_ALREADY_INSTALLED");
const shape=region.shapes?.[0];
if(region.shapes?.length!==1||shape.type!=="rectangle"||shape.x!==2310||shape.y!==2380||
 shape.width!==620||shape.height!==500||shape.rotation!==0||shape.hole!==false)throw Error("N3_BRANCH_GEOMETRY_DRIFT");
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state;
if(ledger?.revision!==2||await sha(JSON.stringify(ledger))!=="7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7"
 ||ledger?.puzzles?.n3?.departureBoardResolved!==false||ledger.puzzles.n3.switchWheelInstalled!==false
 ||ledger.puzzles.n3.routeOverlay?.resolved!==false||ledger.puzzles.n3.t3BranchUnlocked!==false)
 throw Error("N3_LEDGER_STATE_DRIFT");
const proofs=[
 ["eNrbnN68TYvMaBcT","XItPpdHkojcs2C3v","dbx:central-lodge:n3:behavior:departure-board-route-plate","063b00971b8576c5c4d6dda2ae56171e2126b2ae527c0637cae0f1bcd466234c"],
 ["7el4eN3Uwzxy7Wmi","6C5fkKasc9DWK1Sa","dbx:central-lodge:n3:behavior:railway-switch-wheel-install","5210cb20045f8d93724dc14eebeb006f41a533298661d158cccabbff173d1c3b"],
 ["VE8p4CvgzqvhihuF","CAGlvXbm6uLupoRw","dbx:central-lodge:n3:behavior:cartography-route-overlay","e55af15f2d7ac960e283519f4fae3ed97748d7fcd3f7e0f598843b7be05753c0"]];
for(const [rid,bid,stableId,expectedSHA] of proofs){
 const b=scene.regions.get(rid)?.behaviors.get(bid);
 if(!b||b.disabled||b.getFlag("world","dicebox")?.stableId!==stableId||await sha(b.system?.source)!==expectedSHA)
  throw Error("N3_EXISTING_PROOF_SOURCE_DRIFT:"+rid);
}
if(await sha(game.macros.get("FHQiFYx6OntZVo9d")?.command)!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")
throw Error("N3_KERNEL_DRIFT");
const scenes=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"].map(i=>game.scenes.get(i));
const baseline={scene:scenes.length,missing:scenes.filter(x=>!x).length,
 regions:scenes.reduce((n,x)=>n+(x?.regions.size??0),0),
 behaviors:scenes.reduce((n,x)=>n+(x?[...x.regions].reduce((v,r)=>v+r.behaviors.size,0):0),0),
 disabled:scenes.reduce((n,x)=>n+(x?[...x.regions].reduce((v,r)=>v+r.behaviors.filter(b=>b.disabled).length,0):0),0),
 items:game.items.filter(i=>i.getFlag("world","dicebox")?.stableId?.startsWith("dbx:central-lodge:item:")).length};
if(baseline.missing||baseline.regions!==202||baseline.behaviors!==118||baseline.disabled!==1||baseline.items!==33)
 throw Error("N3_CAMPAIGN_ROSTER_DRIFT");
const stableId="dbx:central-lodge:n3:behavior:t3-branch-three-proof-unlock-v001";
if(game.scenes.some(s=>s.regions.some(r=>r.behaviors.some(b=>b.getFlag("world","dicebox")?.stableId===stableId))))
throw Error("N3_DUPLICATE_INSTALLED");
"""
header=head+"const source="+json.dumps(source,ensure_ascii=False)+";\nconst expectedSha="+json.dumps(sha(source))+";\n"
header+='''if(await sha(source)!==expectedSha||source.includes("teleportToken")||source.includes("pullUsers"))
 throw Error("N3_STAGED_SOURCE_DRIFT_OR_TRAVEL_FORBIDDEN");
const payload={name:"DiceBox N3 — three-proof hidden spur unlock",type:"executeScript",disabled:false,
 system:{events:["tokenEnter"],source},
 flags:{world:{dicebox:{stableId,sourceHash:expectedSha,owner:"central-lodge",version:"cl91-n3-three-proof-v001"}}}};
'''
preview=header+"""return {operation:"cl91-n3-three-proof-preview-v001",noWrite:true,status:"PASS_STAGED_NOT_INSTALLED",
 expectedBehaviorCountAfter:119,baseline,sourceSha:expectedSha,regionId:region.id,ledgerRevision:ledger.revision,
 permittedAction:"create one RegionBehavior without teleport",playerCanary:false};
"""
apply=header+"""const created=await region.createEmbeddedDocuments("RegionBehavior",[payload]);
if(created?.length!==1)throw Error("N3_CREATE_OUTCOME_UNKNOWN_DO_NOT_RETRY");
const installed=game.scenes.get(scene.id)?.regions.get(region.id)?.behaviors.filter(
 b=>b.getFlag("world","dicebox")?.stableId===stableId)??[];
if(installed.length!==1||installed[0].disabled||!installed[0].system.events?.has("tokenEnter")||
 await sha(installed[0].system.source)!==expectedSha||installed[0].getFlag("world","dicebox")?.sourceHash!==expectedSha)
throw Error("N3_POST_CREATE_OUTCOME_UNKNOWN_DO_NOT_RETRY");
return {operation:"cl91-n3-three-proof-apply-v001",status:"PASS",noWrite:false,behaviorId:installed[0].id,
 sourceSha:expectedSha,regionId:region.id,ledgerRevision:ledger.revision,expectedTotalBehaviors:119};
"""
for name,body in [('cl91-n3-three-proof-preview-v001.page.js',preview),('cl91-n3-three-proof-apply-v001.page.js',apply)]:
 p=r/name
 if p.exists():raise SystemExit('STOP installer already exists')
 p.write_bytes(body.encode('utf-8'))
 print('STAGED',name,sha(body))
print('EXPECTED_GATE_SOURCE_SHA',sha(source),'SOURCE_BYTES',len(source.encode('utf-8')))
