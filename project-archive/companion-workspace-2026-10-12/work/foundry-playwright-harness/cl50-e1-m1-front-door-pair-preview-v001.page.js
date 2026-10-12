const ID="central-lodge.cl50.e1-m1.front-entrance-source-preview.v001",S="Zq8iXByDVhHRbA7w",D="U8S5ZrTjaPIkTUIL",A="QS7OpvIilyyDpmLc",B="4b8vfvKAKXBS6kfW",errors=[];
const s=game.scenes.get(S),d=game.scenes.get(D),a=s?.regions.get(A),b=d?.regions.get(B),sf=a?.getFlag("world","dicebox")??{},df=b?.getFlag("world","dicebox")??{};
const required=["dbx:central-lodge:e1:region:e1-lodge-entrance","dbx:central-lodge:m1:region:m1-transition-main-door"];
if(sf.stableId!==required[0]||df.stableId!==required[1])errors.push("StableID mismatch");
if(sf.regionClass!=="transition"||df.regionClass!=="transition")errors.push("Not transition");
if(a.behaviors.size!==0||b.behaviors.size!==0)errors.push("Route behavior present, re-audit");
const ao=a?.toObject()?.shapes?.[0],bo=b?.toObject()?.shapes?.[0];
if(ao?.type!=="rectangle"||bo?.type!=="rectangle")errors.push("Non-rect entrance geometry");
const as=s?.getFlag("world","dicebox")??{},ds=d?.getFlag("world","dicebox")??{};
const actorStates=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(actorStates.revision!==0)errors.push("Ledger drift");
return{operation:ID,status:errors.length?"BLOCKED":"PASS_SOURCE_PAIR_CANDIDATE",noWrite:true,errors,
source:{sceneId:S,sceneName:s.name,regionId:a.id,regionName:a.name,regionStableId:sf.stableId,behaviorCount:a.behaviors.size,shape:ao},
destination:{sceneId:D,sceneName:d.name,regionId:b.id,regionName:b.name,regionStableId:df.stableId,behaviorCount:b.behaviors.size,shape:bo},
approvedRouteState:"CANDIDATE_NOT_APPLIED",behaviorPlan:"one-way primary-GM-confirmed enter lodge, no reciprocal automatic return, no source travel unlock",constraint:"Names and prepare files establish front-door physical pairing; still must PREVIEW source hash/geometry with no-bounce tests and guarded APPLY before claiming live transition."};