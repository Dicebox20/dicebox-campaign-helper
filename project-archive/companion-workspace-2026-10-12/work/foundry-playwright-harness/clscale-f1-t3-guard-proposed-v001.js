// CL-50 approved T3 ancient passage → F1 arrival; single GM-authoritative confirmation, no auto-teleport.
const __primary = game.users.filter(u => u.active && u.isGM).sort((a,b) => a.id.localeCompare(b.id))[0];
if (!__primary || !game.user?.isGM || game.user.id !== __primary.id) return;
const __token = event?.data?.token ?? event?.token ?? null;
const __actor = __token?.actor ?? null;
const __source = event?.region?.parent ?? game.scenes.get("aIKQmFiuXWipEdyb");
if (!__token || !__actor || __source?.id !== "aIKQmFiuXWipEdyb") return;
const __sourceRegion = __source.regions.get("Tkg7XpsF7X1P3ZVJ");
const __destination = game.scenes.get("La9krMOMBhAhDLi6")?.regions.get("zKNU1R3JGIMMt017");
if (__sourceRegion?.getFlag("world","dicebox")?.destinationStableSceneId !== "dbx:central-lodge:f1") return;
if (!__destination || __destination.getFlag("world","dicebox")?.stableId !== "dbx:central-lodge:f1:region:transition:t3-arrival") return;

const __targetScene = __destination?.parent;
const __arrivalShape = [...(__destination?.shapes ?? [])].find(q =>
 q.type === "rectangle" && q.x===2390 && q.y===1860 &&
 q.width===280 && q.height===280 && (q.rotation ?? 0)===0
);
if (Number(__token.width)!==1 || Number(__token.height)!==1 ||
 __targetScene?.id!=="La9krMOMBhAhDLi6" ||
 __targetScene.grid?.size!==240 || __targetScene.grid?.type!==0 ||
 __targetScene.grid?.distance!==5 || __targetScene.grid?.units!=="ft" ||
 __targetScene.regions.size!==6 || __targetScene.walls.size!==27 ||
 __destination.behaviors.size!==0 || !__arrivalShape) {
 ui.notifications?.warn("F1 automatic passage permits only verified 1x1 tokens. Larger creatures or changed destination require GM manual handling.");
 return;
}

const __key = String(__actor.uuid ?? __token.id);
const __slots = globalThis.__diceboxCl50T3F1Transition ??= { pending:new Set(), declinedUntil:new Map() };
if (__slots.pending.has(__key) || Date.now() < (__slots.declinedUntil.get(__key) ?? 0)) return;
__slots.pending.add(__key);
try {
  const __go = await foundry.applications.api.DialogV2.confirm({
    window:{ title:"Ancient Passage — GM Travel Confirmation" },
    content:"<p>The abandoned railway has ended; the older passage continues beyond it.</p><p>Confirm the character intends to proceed into the <strong>Ancient Infernal Threshold (F1)</strong>. This is not an automatic forced move.</p>",
    yes:{label:"Proceed to F1"},no:{label:"Remain in T3"},modal:true,rejectClose:false
  });
  if (!__go) {
    __slots.declinedUntil.set(__key,Date.now()+15000);
    return;
  }
  const __updated = __source.regions.get("Tkg7XpsF7X1P3ZVJ");
  if (__updated?.getFlag("world","dicebox")?.destinationStableSceneId !== "dbx:central-lodge:f1") return;
  const __nowTarget = game.scenes.get("La9krMOMBhAhDLi6")?.regions.get("zKNU1R3JGIMMt017");
  if (!__nowTarget || __nowTarget.getFlag("world","dicebox")?.stableId !== "dbx:central-lodge:f1:region:transition:t3-arrival") return;

  // Revalidate after the awaited GM confirmation. No action after destination drift.
  if (game.user?.id!==__primary.id || !game.user?.isGM ||
      game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0]?.id!==__primary.id ||
      Number(__token.width)!==1 || Number(__token.height)!==1 ||
      __token.actor?.uuid!==__actor.uuid ||
      __nowTarget.parent!==__targetScene ||
    __targetScene.grid.size!==240 || __targetScene.regions.size!==6 ||
    __targetScene.walls.size!==27 || __nowTarget.behaviors.size!==0 ||
    ![...__nowTarget.shapes].some(q=>q.type==="rectangle"&&
      q.x===2390&&q.y===1860&&q.width===280&&q.height===280&&(q.rotation??0)===0)) {
    ui.notifications?.warn("F1 arrival changed during confirmation. No travel occurred.");
    return;
  }
  const __landing={x:2410,y:1880,w:240,h:240};
  const __touches=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  const __occupied=[...__targetScene.tokens].some(t=>
    __touches(__landing,{x:t.x,y:t.y,w:t.width*240,h:t.height*240}));
  const __blockedByWall=w=>{
    if(w.move===0||(w.door>0&&w.ds===1))return false;
    const [x1,y1,x2,y2]=w.c,{x,y}=__landing,maxX=x+240,maxY=y+240;
    if((x1>=x&&x1<=maxX&&y1>=y&&y1<=maxY)||
       (x2>=x&&x2<=maxX&&y2>=y&&y2<=maxY))return true;
    const dx=x2-x1,dy=y2-y1;
    let t0=0,t1=1;
    for(const [p,q] of [[-dx,x1-x],[dx,maxX-x1],[-dy,y1-y],[dy,maxY-y1]]){
      if(p===0){if(q<0)return false;continue;}
      const t=q/p;
      if(p<0){if(t>t1)return false;t0=Math.max(t0,t);}
      else{if(t<t0)return false;t1=Math.min(t1,t);}
    }
    return t0<=t1;
  };
  if(__occupied||[...__targetScene.walls].some(__blockedByWall)){
    ui.notifications?.warn("F1 landing occupied or Wall-blocked. Ask GM to handle travel manually.");
    return;
  }

  let __user = game.users.get(event?.user?.id) ?? null;
  if (!__user || __user.isGM) {
    __user = game.users.find(u => u.active && !u.isGM && u.character?.id === __actor.id) ?? null;
  }
  if (!__user) {
    const __owners = game.users.filter(u => u.active && !u.isGM && __actor.testUserPermission(u,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER));
    if (__owners.length === 1) __user=__owners[0];
  }
  await __nowTarget.teleportToken(__token,{placement:"center",snap:false,pan:true});
  if (__user) await __nowTarget.parent.pullUsers([__user.id]);
} catch(__error) {
  console.error("[DiceBox CL-50 T3→F1] Travel failed; GM can use normal Scene navigation.",__error);
  ui.notifications?.warn("Travel was not confirmed. Ask the GM to navigate manually if needed.");
} finally {
  __slots.pending.delete(__key);
}