from pathlib import Path
import json,hashlib
root=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
w=root/'work/foundry-playwright-harness'
src=root/'outputs/foreman-checkpoints/clscale-f1-arrival-source-readonly-v001.json'
out=w/'clscale-f1-t3-guard-proposed-v001.js'
contract=w/'clscale-f1-arrival-contract-v001.json'
if out.exists() or contract.exists():raise SystemExit('STOP staged proposal exists')
b=json.loads(src.read_text(encoding='utf-8'))
sc={r['id']:r for r in b['scenes']}
assert sc['aIKQmFiuXWipEdyb']['sha']=='76141690439a19d6092a2119744def0dce57c9368cd4ceaf66ccd23c1fa8eabb'
assert sc['La9krMOMBhAhDLi6']['sha']=='85ec24e6da7e5b849099fbe5b7a568693ccc71fc55842f7fefb4e584a045c235'
assert sc['HWitOe1wSid7MZ1y']['sha']=='5ad191d492195bf227bb099d9b356992aca44fe6d884ac940e085db8c2342639'
assert b['ledger']['revision']==13 and b['ledger']['sha']=='ec3f1a02887b80a342653681d217d357f7bb7f5b44fa436555d57bf12c44cfd4'
reg=next(x for x in sc['aIKQmFiuXWipEdyb']['source']['regions'] if x['_id']=='Tkg7XpsF7X1P3ZVJ')
beh=next(x for x in reg['behaviors'] if x['_id']=='tSqhDN5CtAHzccmf')
original=beh['system']['source']
sha=lambda text:hashlib.sha256(text.encode('utf-8')).hexdigest()
if sha(original)!='c179ae83855e6eb136a1225bfbb882ab9c6b7bcd3f0773df3654f82b2b23d6cb':raise SystemExit('STOP T3 source SHA drift')
body=original
def replace_one(old,new):
 global body
 if body.count(old)!=1:raise SystemExit('STOP source anchor '+old[:80])
 body=body.replace(old,new)
early="""
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
"""
replace_one('const __key = String(__actor.uuid ?? __token.id);',early+'\nconst __key = String(__actor.uuid ?? __token.id);')
late="""
  // Revalidate after the awaited GM confirmation. No action after destination drift.
  if (__nowTarget.parent!==__targetScene ||
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
"""
anchor='  let __user = game.users.get(event?.user?.id) ?? null;'
replace_one(anchor,late+'\n'+anchor)
replace_one('placement:"random",snap:false,pan:true','placement:"center",snap:false,pan:true')
out.write_text(body,encoding='utf-8')
contractData={
'kind':'F1_T3_240_GUARD_STAGED_NOT_INSTALLED',
'installed':False,'authoritativeF1SceneSha':sc['La9krMOMBhAhDLi6']['sha'],
't3SceneSha':sc['aIKQmFiuXWipEdyb']['sha'],
'f2SceneSha':sc['HWitOe1wSid7MZ1y']['sha'],
'ledgerRevision':13,'ledgerSha':b['ledger']['sha'],
't3OriginalSourceSHA':sha(original),'t3ProposedSourceSHA':sha(body),
'candidate':{'f1Grid':240,'arrivalRect':[2390,1860,280,280],
 'center1x1At':[2410,1880],'maxAutomaticTokenSize':[1,1],
 'largeToken':'FAIL_CLOSED_MANUAL_GM','placement':'center','snap':False},
'scope':{'t3BehaviorId':'tSqhDN5CtAHzccmf',
 'f1ArrivalRegionId':'zKNU1R3JGIMMt017','sceneId':'La9krMOMBhAhDLi6',
 'preserveExistingF1F2':'FElgIMZFVX5GleSy','railwayInstallers':'QUARANTINED'},
'limitations':['No persistent Scene, Region, or Behavior change',
 'No player test or committed teleport',
 'Migration must suspend T3->F1 handler before changing destination Region and grid',
 'Any actual install needs exact fresh source/ledger backup and independently verified activation',
 'Proposed 1x1 centered footprint requires live target occupancy+Wall recheck']
}
contract.write_text(json.dumps(contractData,indent=2),encoding='utf-8')
print('STAGED_PROPOSED_F1',out.name,'SOURCE_HASH',sha(body),'CONTRACT',contract.name,'ORIGINAL',sha(original))
