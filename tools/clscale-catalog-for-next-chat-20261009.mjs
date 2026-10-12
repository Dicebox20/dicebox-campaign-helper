/** Read-only inventories of source project and companion checkpoint workspace.
 * Writes only to a NEW handoff folder. Excludes dependency caches, VCS internals,
 * the handoff itself and local Bridge secrets/payloads.
 */
import {readdir,stat,lstat,mkdir,writeFile,open,readFile} from "node:fs/promises";
import {createReadStream} from "node:fs";
import {createHash} from "node:crypto";
import {join,relative,dirname,basename,resolve} from "node:path";
import {spawnSync} from "node:child_process";
const root=String.raw`C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper`;
const companion=String.raw`C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper`;
const handoff=join(root,"handoffs","2026-10-09-foreman-full-catalog");
const excludeDirs=new Set(["node_modules",".git",".turbo",".next","target","dist",".cache"]);
const workspaces=[{label:"source-repository",path:root},{label:"companion-foreman-workspace",path:companion}];
const all=[],excluded=[],errors=[];
const maxEntries=175000;
const recordedPaths=new Set();
const risk=(s)=>/^[a-z]:\\users\\[^\\]+\\appdata\\local\\codex\\dicebox-bridge/i.test(s);
const relName=(base,path)=>relative(base,path).replaceAll("\\","/");
const writeAtomic=async(name,content)=>{const f=join(handoff,name);await writeFile(f,content,{flag:"wx"});return f};
async function recurse(base,dir,label){
 const rel=relName(base,dir);
 if(dir===handoff||dir.startsWith(handoff+"\\"))return;
 if(all.length>=maxEntries){errors.push({scope:label,path:rel,error:"MAX_ENTRIES_REACHED"});return;}
 let children;try{children=await readdir(dir,{withFileTypes:true});}catch(e){errors.push({scope:label,path:rel,error:e.code??String(e)});return;}
 children.sort((a,b)=>a.name.localeCompare(b.name));
 for(const child of children){
  const full=join(dir,child.name);
  const path=relName(base,full);
  if(child.isSymbolicLink()){excluded.push({scope:label,path,reason:"SYMLINK_NOT_FOLLOWED"});continue;}
  if(child.isDirectory()){
   if(excludeDirs.has(child.name)||
      (full===handoff||full.startsWith(handoff+"\\"))){
     excluded.push({scope:label,path,reason:"BUILD_CACHE_VCS_OR_HANDOFF_EXCLUDED"});continue;
   }
   await recurse(base,full,label);continue;
  }
  if(!child.isFile()){excluded.push({scope:label,path,reason:"NOT_REGULAR_FILE"});continue;}
  if(all.length>=maxEntries){errors.push({scope:label,path,error:"MAX_ENTRIES_REACHED"});return;}
  try{
   const s=await stat(full);
   const fingerprint=label+":"+path;
   if(recordedPaths.has(fingerprint))continue;
   recordedPaths.add(fingerprint);
   all.push({scope:label,path,bytes:s.size,modifiedUtc:s.mtime.toISOString(),createdUtc:s.birthtime.toISOString(),
    sha256:null});
  }catch(e){errors.push({scope:label,path,error:e.code??String(e)});}
 }
}
await mkdir(handoff,{recursive:true});
if((await readdir(handoff)).length!==0)throw Error("HANDOFF_FOLDER_NOT_EMPTY_REFUSE_REPLAY");
for(const w of workspaces)await recurse(w.path,w.path,w.label);
const index=new Map(workspaces.map(x=>[x.label,x.path]));
// All regular project files receive streaming SHA-256, including existing
// fixture leveldb files; no file content goes into the handoff.
let hashed=0,totalBytes=0;
for(const rec of all){
 const p=join(index.get(rec.scope),rec.path);
 try{
  const sha=await new Promise((resolve,reject)=>{
   const h=createHash("sha256"),st=createReadStream(p);
   st.on("data",chunk=>h.update(chunk));st.on("end",()=>resolve(h.digest("hex")));st.on("error",reject);
  });
  rec.sha256=sha;hashed++;totalBytes+=rec.bytes;
 }catch(e){rec.hashError=e.code??String(e);errors.push({scope:rec.scope,path:rec.path,error:"HASH_FAILED_"+rec.hashError});}
}
const git=(args)=>{const r=spawnSync("git",["-C",root,...args],{encoding:"utf8",windowsHide:true,timeout:45000,maxBuffer:32*1024*1024});
 return {ok:r.status===0,text:r.status===0?r.stdout:String(r.stderr??"").slice(0,4000)};};
const head=git(["rev-parse","HEAD"]),branch=git(["branch","--show-current"]);
const statuses=git(["status","--porcelain=v1","-uall"]);
const diffstat=git(["diff","--stat"]);
const statusesList=statuses.ok?statuses.text.split(/\r?\n/).filter(Boolean):[];
const mod=statusesList.filter(x=>!x.startsWith("??")).length;
const untracked=statusesList.filter(x=>x.startsWith("??")).length;
await writeAtomic("ALL-FILES-SHA256.jsonl",all.map(r=>JSON.stringify(r)).join("\n")+"\n");
await writeAtomic("GIT-STATUS-PORCELAIN.txt",statuses.text);
await writeAtomic("GIT-DIFF-STAT.txt",diffstat.text);
const byScope=Object.fromEntries(workspaces.map(w=>[w.label,{
 files:all.filter(f=>f.scope===w.label).length,
 bytes:all.filter(f=>f.scope===w.label).reduce((n,f)=>n+f.bytes,0)
}]));
const byTop={};
for(const f of all){
 const group=f.scope+":"+f.path.split("/")[0];const k=byTop[group]??{files:0,bytes:0};
 k.files++;k.bytes+=f.bytes;byTop[group]=k;
}
const summary={status:errors.length?"CATALOG_COMPLETE_WITH_WARNINGS":"CATALOG_COMPLETE",
 generatedUtc:new Date().toISOString(),handoffFolder:handoff,roots:workspaces,
 totalFiles:all.length,hashedFiles:hashed,totalBytes,
 byScope,byTop,
 git:{branch:branch.text.trim()||null,head:head.text.trim()||null,
  statusAvailable:statuses.ok,modifiedOrDeleted:mod,untracked:untracked,
  note:"Working tree is NOT assumed clean. Do not discard unrelated changes."},
 excludedDirectoryRules:[...excludeDirs],excludedEntries:excluded,
 errors,consistency:"NON_ATOMIC_LIVE_FILE_SCAN: timestamps/hashes may vary if another process writes during scan",
 confidentiality:"SHA256 metadata and relative project paths only; no Bridge token, message body, or secret content copied"};
await writeAtomic("CATALOG-SUMMARY.json",JSON.stringify(summary,null,2)+"\n");
const folders=[...Object.keys(byTop)].sort().map(k=>({name:k,...byTop[k]}));
await writeAtomic("FOLDER-SUMMARY.json",JSON.stringify(folders,null,2)+"\n");
console.log(JSON.stringify({status:summary.status,folder:handoff,totalFiles:all.length,
 hashedFiles:hashed,totalBytes,byScope,git:summary.git,excludedEntries:excluded.length,
 errors:errors.slice(0,12),errorCount:errors.length},null,2));
