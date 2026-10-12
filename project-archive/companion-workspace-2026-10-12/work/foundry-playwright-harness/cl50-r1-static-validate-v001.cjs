'use strict';
// Offline syntax and static safety assertions for two STAGED, uninstalled RegionBehavior scripts.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const here=__dirname;
const manifest=JSON.parse(fs.readFileSync(path.join(here,'cl50-r1-staged-sources-v001.manifest.json'),'utf8'));
assert.equal(manifest.routes.length,2);
const d=fs.mkdtempSync(path.join(os.tmpdir(),'dbx-r1-static-'));
let checks=0;
try{
 for(const [i,route] of manifest.routes.entries()){
  const txt=fs.readFileSync(path.join(here,route.file),'utf8').trimEnd();
  assert.equal(crypto.createHash('sha256').update(txt).digest('hex'),route.sha256);checks++;
  const wrapped=path.join(d,'route-'+i+'.js');
  fs.writeFileSync(wrapped,'async function diceboxRegionBehavior(event){\n'+txt+'\n}\n');
  cp.execFileSync(process.execPath,['--check',wrapped],{stdio:'pipe'});checks++;
  const required=['game.world','DialogV2.confirm','spawnTokens([__token],{create:false','teleportToken(__token','Number(__token.width)!==1','Number(__token.height)!==1','__slots.pending','cooldownUntil','__sample.testInsideRegion(__destMouth)','__toScene.pullUsers'];
  for(const frag of required){assert(txt.includes(frag),route.file+' missing '+frag);checks++;}
  for(const banned of ['eval(', 'new Function(', 'game.socket.emit(', 'deleteEmbeddedDocuments(', 'createEmbeddedDocuments(']){assert(!txt.includes(banned),route.file+' forbidden '+banned);checks++;}
  assert.equal(route.targetScene,manifest.routes[1-i].sourceScene);checks++;
  assert.equal(route.targetRegion,manifest.routes[1-i].sourceRegion);checks++;
 }
 console.log(JSON.stringify({status:'PASS_STATIC_STAGE_ONLY',checks,hashes:manifest.routes.map(r=>r.sha256),noFoundryActions:true},null,2));
}finally{fs.rmSync(d,{recursive:true,force:true});}
