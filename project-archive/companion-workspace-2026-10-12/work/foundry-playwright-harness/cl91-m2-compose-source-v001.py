from pathlib import Path
import subprocess,json,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
p=subprocess.run(['node','exec-page.mjs','read','cl91-m2-notice-vs-signet-geometry-readonly-v001.page.js'],cwd=r,capture_output=True,encoding='utf-8',timeout=60)
if p.returncode:raise SystemExit('STOP Foundry read-only source fetch failed: '+p.stderr[:1000])
j=json.loads(p.stdout)
if j.get('status')!='PASS' or j.get('identity',{}).get('worldId')!='the-lost-mine-of-phandalin':raise SystemExit('STOP wrong Foundry context')
reg={x['role']:x for x in j['result']['regions']}
orig={k:v['source'] for k,v in reg.items()}
sha=lambda s:hashlib.sha256(s.encode('utf-8')).hexdigest()
exp={'notice':'49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46',
'signet':'bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2'}
for key in exp:
 if sha(orig[key])!=exp[key] or orig[key].count('return await k.execute')!=1:
  raise SystemExit('STOP '+key+' live source changed; preserve pending work')
 if (r/('cl91-m2-'+key+'-original-v001.js')).exists():raise SystemExit('STOP original already saved')
 (r/('cl91-m2-'+key+'-original-v001.js')).write_text(orig[key],encoding='utf-8')
source=r'''// CL91 M2 Founder Portrait: single serialized Notice -> observation -> Signet pickup.
// Existing Notice and Signet source bodies below are embedded verbatim from actual Foundry.
// Replaces only original outer Signet RegionBehavior source; inner Notice is disabled separately.
// Gameplay behavior not certified until the user runs final campaign acceptance.
if(event?.name&&event.name!=="tokenEnter")return;
if(event?.region?.id&&event.region.id!=="FRY091GwobgD2M5i")return;
const gm=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];
if(!game.user?.isGM||gm?.id!==game.user.id)return;
const scene=game.scenes.get("JZkxX6lUQe8NcJ");
const token=event?.data?.token??event?.token??null,actor=token?.actor??null;
if(!token||!actor||token.parent?.id!=="JZkxX6lUQe8Nc8xJ")return;
const requestingUser=event?.user??null;
if(requestingUser&&!requestingUser.isGM&&!actor.testUserPermission(requestingUser,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER))return;
const ledger=game.journal.get("xhlXv6CCH34HVga3");
const getState=()=>ledger?.getFlag("world","dicebox")?.state??null;
if(!ledger||!getState()||typeof game.macros.find!=="function")return;
const controller=globalThis.__diceboxM2FounderPortraitQueue??={tail:Promise.resolve()};
const previous=controller.tail;
let release;
controller.tail=new Promise(resolve=>release=resolve);
await previous.catch(()=>{});
try {
 const state=getState();
 if(state?.puzzles?.m2?.founderPortraitObserved!==true&&state?.puzzles?.m2?.founderPortraitObserved!==false)return;
 const originalNotice=async()=>{
// BEGIN ORIGINAL M2 PORTRAIT NOTICE SOURCE (unchanged)
'''+orig['notice']+r'''
// END ORIGINAL M2 PORTRAIT NOTICE SOURCE
 };
 const noticeResult=await originalNotice();
 if(!["PASS","ALREADY_ATTEMPTED"].includes(noticeResult?.status))return;
 if(getState()?.puzzles?.m2?.founderPortraitObserved===false){
  const k=game.macros.find(m=>m.getFlag?.("world","dicebox")?.stableId==="dbx:central-lodge:macro:runtime");
  if(!k)return;
  const observed=await k.execute({actor,token,event,speaker:{dicebox:{
   contract:"dicebox-region-behavior/v1",action:"observe",trigger:"TOKEN_ENTER",
   observationKey:"m2.founder-portrait-examined",oncePerActor:false,
   statePath:"puzzles.m2.founderPortraitObserved",value:true,
   message:"<p>You study the founder’s stern expression and the workmanship of the frame. Some details seem intentionally altered, although their purpose is not yet clear.</p>"
  }}});
  if(observed?.status!=="PASS"||getState()?.puzzles?.m2?.founderPortraitObserved!==true)return;
 }
 const originalSignet=async()=>{
// BEGIN ORIGINAL M2 SIGNET PICKUP SOURCE (unchanged)
'''+orig['signet']+r'''
// END ORIGINAL M2 SIGNET PICKUP SOURCE
 };
 return await originalSignet();
}finally{release();}
'''
# No trailing LF, which Foundry will otherwise normalize.
source=source.rstrip('\n')
# Neither staged script should use invalid scene IDs; compare all literal scene IDs
source=source.replace('const scene=game.scenes.get("JZkxX6lUQe8NcJ");','const scene=game.scenes.get("JZkxX6lUQe8Nc8xJ");')
if source.count(orig['notice'])!=1 or source.count(orig['signet'])!=1:
 raise SystemExit('STOP original action body not exactly nested')
target=r/'cl91-m2-founder-portrait-serialized-source-v001.js'
if target.exists():raise SystemExit('STOP source already exists')
target.write_text(source,encoding='utf-8')
print('VERBATIM_NOTICE_SHA',sha(orig['notice']))
print('VERBATIM_SIGNET_SHA',sha(orig['signet']))
print('COMPOSED_SHA',sha(source),'LEN',len(source),'SOURCE_FILE',target.name)
