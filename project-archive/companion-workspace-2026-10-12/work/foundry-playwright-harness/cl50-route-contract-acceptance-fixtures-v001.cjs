'use strict';
// CL50 R1-R4 offline route-contract acceptance fixtures. NEVER accesses live Foundry,
// performs network I/O, generates installers, or modifies campaign files.
// Evidence = deterministic acceptance examples, not proof of live teleport behavior.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {test}=require('node:test');

const root=__dirname,grid=120;
const mouth=[
 {key:'N1_E',scene:'MAbLfBqG7qIVVuLN',region:'xsitdXO94BHJkYKX',stable:'dbx:central-lodge:n1:region:n1-rail-tunnel-east',shape:[3860,1110,460,720],one:[3730,1410]},
 {key:'T1_A',scene:'ImeIdHbYb6kZKAdt',region:'ewIAYppRLvgIV1b7',stable:'dbx:central-lodge:t1:region:mouth-a',shape:[0,1180,300,520],one:[560,1380]},
 {key:'T1_B',scene:'ImeIdHbYb6kZKAdt',region:'91XmuJ9LGbsJY52W',stable:'dbx:central-lodge:t1:region:mouth-b',shape:[4020,1180,300,520],one:[3690,1380]},
 {key:'N2_A',scene:'4pc5akMBieHU7GvV',region:'lYps0Z5806d0W8wX',stable:'dbx:central-lodge:n2:region:n2-railway-tunnel-a',shape:[0,1160,430,760],one:[445,1480],two:[385,1420]},
 {key:'N2_B',scene:'4pc5akMBieHU7GvV',region:'shIAThge7cNy0JjT',stable:'dbx:central-lodge:n2:region:n2-railway-tunnel-b',shape:[3890,1160,430,760],one:[3740,1480],two:[3680,1420]},
 {key:'T2_A',scene:'ez9MSQ8QIO4cW6zo',region:'3OGR0atcJokXJo6b',stable:'dbx:central-lodge:t2:region:mouth-a',shape:[0,1030,320,560],one:[560,1210]},
 {key:'T2_B',scene:'ez9MSQ8QIO4cW6zo',region:'OOmnx3XAmw95E410',stable:'dbx:central-lodge:t2:region:mouth-b',shape:[4000,1070,320,610],one:[3650,1350],two:[3590,1290]},
 {key:'N3_W',scene:'pHQvDUDlyWZFuNrX',region:'foYsFHsLXtCbfiyR',stable:'dbx:central-lodge:n3:region:n3-main-railway-west',shape:[0,1110,470,720],one:[740,1430],two:[680,1370]}
];
const pairs=[['N1_E','T1_A'],['T1_B','N2_A'],['N2_B','T2_A'],['T2_B','N3_W']];
const rect=(xy,tiles=1)=>({x:xy[0],y:xy[1],width:grid*tiles,height:grid*tiles});
const mouthRect=m=>({x:m.shape[0],y:m.shape[1],width:m.shape[2],height:m.shape[3]});
const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
const pointInside=(pt,r)=>pt.x>=r.x&&pt.x<r.x+r.width&&pt.y>=r.y&&pt.y<r.y+r.height;
const srcHash=s=>crypto.createHash('sha256').update(s).digest('hex');

function checkIntent(c){
 const faults=[];
 if(!c?.authorizedExecutor||!c.singleExecutorLease)faults.push('EXECUTOR_AUTHORITY');
 if(!c.gmConsent||!c.playerActorAuthorized)faults.push('CONSENT_OR_OWNER');
 if(!c.routeBoundExact)faults.push('ROUTE_NOT_BOUND');
 if(c.inFlight||!c.noUnresolvedTransfer||!c.reconnectSafe)faults.push('DUPLICATE_OR_UNKNOWN');
 if(c.size!==1)faults.push('TOKEN_SIZE');
 if(!c.preflightVerified||!c.pinnedCommitPosition||!c.placementAtomic)faults.push('PLACEMENT_NOT_PROVEN');
 if(!c.preflightBox||!c.commitBox||JSON.stringify(c.preflightBox)!==JSON.stringify(c.commitBox))faults.push('PLACEMENT_CHANGED');
 if(c.mouthBox&&c.commitBox&&overlap(c.mouthBox,c.commitBox))faults.push('RETURN_MOUTH_COLLISION');
 if(c.forbiddenStateBoxes?.some(b=>c.commitBox&&overlap(b,c.commitBox)))faults.push('STORY_OR_PUZZLE_COLLISION');
 if(c.currentOccupiedBoxes?.some(b=>c.commitBox&&overlap(b,c.commitBox)))faults.push('OCCUPIED');
 if(c.blockingWallsKnownClear!==true)faults.push('WALL_OR_NAV_UNKNOWN');
 return {pass:faults.length===0,faults};
}
const candidate=mouth.find(m=>m.key==='N2_A');
const baseline={
 authorizedExecutor:true,singleExecutorLease:true,gmConsent:true,playerActorAuthorized:true,routeBoundExact:true,
 inFlight:false,noUnresolvedTransfer:true,reconnectSafe:true,size:1,preflightVerified:true,
 pinnedCommitPosition:true,placementAtomic:true,preflightBox:rect(candidate.one),
 commitBox:rect(candidate.one),mouthBox:mouthRect(candidate),forbiddenStateBoxes:[],
 currentOccupiedBoxes:[],blockingWallsKnownClear:true
};
const tests=[
 ['unapproved executor', {authorizedExecutor:false},'EXECUTOR_AUTHORITY'],
 ['two GMs without lease', {singleExecutorLease:false},'EXECUTOR_AUTHORITY'],
 ['missing GM consent', {gmConsent:false},'CONSENT_OR_OWNER'],
 ['missing actor ownership', {playerActorAuthorized:false},'CONSENT_OR_OWNER'],
 ['unbound terminal', {routeBoundExact:false},'ROUTE_NOT_BOUND'],
 ['in-flight operation', {inFlight:true},'DUPLICATE_OR_UNKNOWN'],
 ['unknown prior outcome', {noUnresolvedTransfer:false},'DUPLICATE_OR_UNKNOWN'],
 ['unsafe reconnect state', {reconnectSafe:false},'DUPLICATE_OR_UNKNOWN'],
 ['two-square token', {size:2},'TOKEN_SIZE'],
 ['no preflight', {preflightVerified:false},'PLACEMENT_NOT_PROVEN'],
 ['unfixed committed coordinate', {pinnedCommitPosition:false},'PLACEMENT_NOT_PROVEN'],
 ['no atomic placement guarantee', {placementAtomic:false},'PLACEMENT_NOT_PROVEN'],
 ['preflight/commit drift', {commitBox:rect([565,1480])},'PLACEMENT_CHANGED'],
 ['return mouth collision', {preflightBox:rect([385,1480]),commitBox:rect([385,1480])},'RETURN_MOUTH_COLLISION'],
 ['story writer overlap', {forbiddenStateBoxes:[rect(candidate.one)]},'STORY_OR_PUZZLE_COLLISION'],
 ['occupied destination', {currentOccupiedBoxes:[rect(candidate.one)]},'OCCUPIED'],
 ['unknown Wall clearance', {blockingWallsKnownClear:false},'WALL_OR_NAV_UNKNOWN']
];
test('Eight accepted endpoints have unique IDs, canonical route pairings and safe 1x1 mouth footprints',()=>{
 assert.equal(mouth.length,8);
 assert.equal(new Set(mouth.map(m=>m.region)).size,8);
 assert.equal(new Set(mouth.map(m=>m.stable)).size,8);
 assert.equal(pairs.length,4);
 for(const [a,b]of pairs){assert(mouth.some(m=>m.key===a));assert(mouth.some(m=>m.key===b));}
 for(const m of mouth)assert.equal(overlap(rect(m.one),mouthRect(m)),false,m.key+' 1x1');
});
test('Two-square N2 A and B samples overlap their return mouths, despite center test being outside',()=>{
 for(const key of ['N2_A','N2_B']){const m=mouth.find(x=>x.key===key),body=rect(m.two,2);
  assert.equal(overlap(body,mouthRect(m)),true,key+' physical collision');
  const center={x:body.x+grid,y:body.y+grid};
  assert.equal(pointInside(center,mouthRect(m)),false,key+' center-only misses collision');
 }
});
test('R4 2x2 sample geometry has no return-mouth collision at either end, but still not network-cleared',()=>{
 for(const key of ['T2_B','N3_W']){const m=mouth.find(x=>x.key===key);assert.equal(overlap(rect(m.two,2),mouthRect(m)),false);}
 assert.equal(checkIntent({...baseline,size:2}).pass,false);
});
test('Authoritatively accepted GM differs from frozen alphabetical-first active-GM election',()=>{
 const actors=['pnTxw7VYpYR4IKWE','JESWV6CcU7m07VW6'].sort((a,b)=>a.localeCompare(b));
 assert.equal(actors[0],'JESWV6CcU7m07VW6');
 assert.notEqual(actors[0],'pnTxw7VYpYR4IKWE');
});
test('Frozen R1 source SHAs unchanged and unsafe patterns remain blocked as historical evidence',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'cl50-r1-staged-sources-v001.manifest.json'),'utf8'));
 assert.equal(manifest.routes.length,2);
 for(const r of manifest.routes){
  const source=fs.readFileSync(path.join(root,r.file),'utf8').trimEnd();
  assert.equal(srcHash(source),r.sha256);
  assert(source.includes('sort((a,b)=>a.id.localeCompare(b.id))[0]'),r.key+' first-GM assumption');
  assert(source.includes('spawnTokens([__token],{create:false'),r.key+' preview');
  assert(source.includes('teleportToken(__token,{placement:"center"'),r.key+' independent placement');
  assert(!source.includes('pinnedCommitPosition'),r.key+' no proof of pinned commit');
 }
});
test('Synthetic all-positive *contract fixture* passes, not a live implementation certification',()=>{
 assert.deepEqual(checkIntent(baseline),{pass:true,faults:[]});
});
for(const [name,change,expectedFault] of tests){
 test('Guard rejects '+name,()=>{const r=checkIntent({...baseline,...change});assert.equal(r.pass,false);assert(r.faults.includes(expectedFault),JSON.stringify(r));});
}
test('Geometric notice overlap is not treated as permission to suppress observation or puzzle behaviors',()=>{
 assert.equal(checkIntent({...baseline,forbiddenStateBoxes:[rect(candidate.one)]}).pass,false);
 assert.equal(checkIntent({...baseline,forbiddenStateBoxes:[]}).pass,true);
});
console.log('CL50 offline fixture suite: STATIC CONTRACT TESTS ONLY. No Foundry runtime changes.');
