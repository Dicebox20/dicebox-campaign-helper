const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');
const roots=[(process.argv[2]?path.resolve(process.argv[2]):process.cwd()),path.join(os.homedir(),'Documents','Codex','DiceBox Campaign Helper')];
const canon='docs/DCH-ROADMAP-v2-LIBRARY-CANONICAL.md';
const expected='3E400D33D2EEE5B5163D9A26E4E8E7F2F199F7E6A2B2368F95ECA667825DF936';
const milestones=[
{id:'M0',label:'ChatGPT Bootstrap',state:'active_not_accepted'},
{id:'M1',label:'Conversational Desktop Interface',state:'next'},
{id:'M2',label:'Automatic Diagnostics & Repair',state:'pending'},
{id:'M3',label:'Modular Workflow Engine (Templates)',state:'pending'},
{id:'M4',label:'Complete Campaign Compiler',state:'pending'},
{id:'M5',label:'Shared Knowledge & Ecosystem',state:'pending'}];
const scope="Owner-selected Roadmap v2 is authoritative: M0 ChatGPT Bootstrap is active priority. M1 Conversational Desktop Interface, M2 Automatic Diagnostics & Repair, M3 Modular Workflow Templates, M4 Complete Campaign Compiler, M5 Shared Knowledge & Ecosystem follow. Legacy stages 0-16, including stage 12 scene-authoring-breadth, are retained as separately validated NON-CERTIFYING historical engineering gate evidence and must not override M0. ActiveLanes and steps describe that legacy gate checker only, not current program sequencing. Stage 11 remains partly blocked. M1284 manual Foundry rejoin is not replay authorization.";
const next="M0 ChatGPT Bootstrap: demonstrate authenticated ChatGPT operation of local DCH source/tools, one bounded reversible code edit, build, DCH desktop and disposable Foundry module install, diagnostics/repair, and persistent verification receipt. Reconcile the native Codex app-control source context for live Switchboard and Worker A/B delivery; never stage messages. M0 is NOT YET VERIFIED; preserve Stage 12 non-certifying receipt history.";
function once(txt,needle,value,file){
 const i=txt.indexOf(needle);
 if(i<0||txt.indexOf(needle,i+needle.length)>=0)throw Error('Exactly-one-match guard: '+file+' / '+needle.slice(0,80));
 return txt.slice(0,i)+value+txt.slice(i+needle.length);
}
for(const root of roots){
 const sha=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,canon))).digest('hex').toUpperCase();
 if(sha!==expected)throw Error('Canonical roadmap hash mismatch at '+root);
 const file=path.join(root,'docs','ACTIVE-PROGRAM-SLICE.json');
 const orig=fs.readFileSync(file,'utf8'),card=JSON.parse(orig);
 if(card.ownerRoadmapV2){if(card.ownerRoadmapV2.canonicalSha256!==expected)throw Error('Existing conflicting v2 marker');console.log('ALREADY '+file);continue;}
 const v2={
 ownerAuthority:'ChatGPT Library DiceBox Campaign Helper (DCH) Roadmap v2 Executive Summary',
 adoptedAt:'2026-11-12',
 libraryModifiedAt:'2026-10-25T19:57:44.085668Z',
 canonicalFile:canon,canonicalSha256:expected,
 roadmapPriority:'M0',milestone0Acceptance:'NOT_YET_PROVEN_END_TO_END',
 milestones:milestones,
 legacyStageTracker:'scene-authoring-breadth',
 legacyPriorNextAction:card.nextAction,
 legacyAcceptanceStatus:'NON_CERTIFYING_ENGINEERING_HISTORY',
 workerDelivery:'LIVE_ONLY_NOT_STAGED',foremanTurnLimitMinutes:20,
 unrelatedWorkingTree:'PRESERVED'
 };
 let out=orig;
 out=once(out,'  "updatedAt": '+JSON.stringify(card.updatedAt)+',','  "updatedAt": "2026-11-12",\n  "ownerRoadmapV2": '+JSON.stringify(v2,null,2).replace(/\n/g,'\n  ')+',',file);
 out=once(out,'  "scopeBoundary": '+JSON.stringify(card.scopeBoundary),'  "scopeBoundary": '+JSON.stringify(scope),file);
 out=once(out,'\n  "nextAction": '+JSON.stringify(card.nextAction),'  "nextAction": '+JSON.stringify(next),file);
 const parsed=JSON.parse(out);
 if(parsed.ownerRoadmapV2.roadmapPriority!=='M0'||parsed.activeLanes.build.join(',')!=='scene-authoring-breadth'||parsed.steps.length!==card.steps.length)throw Error('Post-write validation failed');
 const backup=file+'.pre-owner-roadmap-v2-20261112';
 fs.copyFileSync(file,backup,fs.constants.COPYFILE_EXCL);
 const temp=file+'.owner-v2.tmp';
 fs.writeFileSync(temp,out,'utf8');
 fs.renameSync(temp,file);
 if(fs.readFileSync(file,'utf8')!==out)throw Error('Readback mismatch');
 console.log('UPDATED '+file+' BACKUP '+backup+' HASH '+crypto.createHash('sha256').update(out).digest('hex').toUpperCase());
}