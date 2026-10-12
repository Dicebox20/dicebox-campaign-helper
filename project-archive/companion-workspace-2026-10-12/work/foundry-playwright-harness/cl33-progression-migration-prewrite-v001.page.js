// CL-33 no-write progression migration safety gate: existing document integrity + incompatibility classification.
const test=[
 {scene:"T1",sceneId:"ImeIdHbYb6kZKAdt",regionId:"4faM8b9bJkKVYGjL",behaviorId:"uIUnGXarsob4WQub",hash:"2424223932f3f85f200909df4e5b8cf17576cd2e74723394e3e52b2457fe77f7",key:"cicada-wing-iii",role:"notice-without-recovery"},
 {scene:"T2",sceneId:"ez9MSQ8QIO4cW6zo",regionId:"vmWCcb1mGibdl5Xv",behaviorId:"6s7f7pxMVLNNRBZR",hash:"97ed0a14c13d0fa1f2b734216366fe3a9eb3397da8310151ba41ec5aca25c054",key:"railway-switch-wheel",role:"actor-flag-without-item"},
 {scene:"T3",sceneId:"aIKQmFiuXWipEdyb",regionId:"0105bbMLlC1Inzhb",behaviorId:"sY1XXM7Xz6Jj9gmR",hash:"25a3b32572e3fce1b080f95153def4e7c635d431987f3427e0efb18b1e212367",key:"recent-route-fragment",role:"actor-flag-without-item"}
];
const sha=async x=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(x??""))),b=>b.toString(16).padStart(2,"0")).join("");
const failures=[],rows=[];
for(const x of test){
 const s=game.scenes.get(x.sceneId),r=s?.regions.get(x.regionId),b=r?.behaviors.get(x.behaviorId),src=b?.system?.source??"",canonical=game.items.filter(i=>i.getFlag("world","dicebox")?.stableId==="dbx:central-lodge:item:"+x.key);
 const h=await sha(src);
 if(h!==x.hash||canonical.length!==1||b?.disabled!==false)failures.push(x.scene+" source/item drift");
 const writesLegacyFlag=src.includes("actor.update(")&&src.includes("flags.world.dicebox.centralLodge.");
 const hasCanonicalGrant=src.includes("createEmbeddedDocuments")||src.includes("action:\"pickup\"")||src.includes("action: 'pickup'");
 const hasNoticeOnly=x.scene==="T1"&&src.includes("noticeRolled")&&!src.includes("actor.update(");
 const incompatible=x.scene==="T1"?hasNoticeOnly: (writesLegacyFlag&&!hasCanonicalGrant);
 rows.push({...x,sourceHash:h,canonicalItemId:canonical[0]?.id??null,writesLegacyFlag,hasCanonicalGrant,noticeOnly:hasNoticeOnly,incompatibleWithKernelPickup:incompatible});
 if(!incompatible)failures.push(x.scene+" expected mismatch not reproduced");
}
const st=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{},recovered=test.filter(x=>st.items?.[x.key]?.recovered!==false).map(x=>x.key);
if(recovered.length)failures.push("Already recovered canonical state: "+recovered.join(","));
return{operation:"central-lodge.cl33.tunnel.progression-migration-prewrite",noWrite:true,status:failures.length?"BLOCKED_DRIFT":"BLOCKED_DEPENDENCY_RECONCILIATION",failures,baseline:{ledgerRevision:st.revision,noticeCount:Object.keys(st.notices??{}).length},rows,dependencyBlockers:["T1 hidden Wing III notice does not grant canonical Item and cannot satisfy F1 recovery without governed migration.","T2 Switch Wheel and T3 Route Fragment pickups record only Actor flags; N3 canonical socket checks actual embedded Item ownership.","Actor/token event ownership and primary-GM kernel dispatch must be reconciled before replacing legacy RegionBehaviors.","Do not bind T1/T2 mouth orientations, T3 far destination, or t3BranchUnlocked on presumed topology."],allowedNextSteps:["Write nonmutating migration contract PREVIEW and/or inspect F1/F2 dependencies.","No CL-33 mutation until guarded patch, explicit owner/arbitration test strategy, and independent verify design."]};