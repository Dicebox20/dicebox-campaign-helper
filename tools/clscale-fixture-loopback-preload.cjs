"use strict";
/**
 * Disposable DiceBox fixture network guard. Loaded with NODE_OPTIONS=--require.
 * Only targets exact Foundry dbx-test-world TCP 30005, or a named probe.
 * No production process ever opts into this preload.
 */
const net=require("node:net");
const path=require("node:path");
const port=30005;
const mode=process.env.DICEBOX_LOOPBACK_GUARD_MODE;
const argv=process.argv.map(v=>String(v).replaceAll("/","\\").toLowerCase());
const asPath=v=>path.win32.normalize(String(v)).toLowerCase();
const fixturePath=asPath("C:\\Users\\rujie\\Documents\\Codex\\2026-08-20\\dicebox-campaign-helper\\work\\foundry-fixture-data-permanent");
const entry=asPath("C:\\Program Files\\Foundry Virtual Tabletop\\resources\\app\\main.js");
const probe=asPath("C:\\Users\\rujie\\Documents\\Codex\\2026-08-20\\dicebox-campaign-helper\\work\\clscale-loopback-probe-v001.cjs");
const file=argv[1]??"";
if(file.includes("foundry-fixture-supervisor.mjs")){
  // Supervisor doesn't listen itself; its explicitly spawned Foundry child will.
}else if(mode==="fixture"){
  const right=asPath(process.argv[1]??"")===entry &&
   argv.includes("--datapath="+fixturePath) &&
   argv.includes("--world=dbx-test-world") && argv.includes("--port=30005");
  if(!right)throw Error("FIXTURE_LOOPBACK_GUARD_WRONG_EXECUTABLE_OR_WORLD");
  install();
}else if(mode==="probe"){
  const right=asPath(process.argv[1]??"")===probe &&
   argv.includes("--port=30005");
  if(!right)throw Error("FIXTURE_LOOPBACK_GUARD_WRONG_PROBE");
  install();
}else{
  throw Error("FIXTURE_LOOPBACK_GUARD_NOT_AUTHORIZED");
}
function install(){
 const original=net.Server.prototype.listen;
 if(original.__clscaleGuard)throw Error("DUPLICATE_LISTENER_GUARD");
 const wrapper=function(...args){
   const first=args[0];
   let selected=null,options={};
   if(Number.isInteger(first)){selected=first;}
   else if(first && typeof first==="object" && !Array.isArray(first)){
     if(!Number.isInteger(first.port))throw Error("FIXTURE_NON_TCP_LISTENER_FORBIDDEN");
     selected=first.port;options={...first};
   }else throw Error("FIXTURE_UNRECOGNIZED_LISTEN_SIGNATURE");
   if(selected!==port)throw Error("FIXTURE_WRONG_PORT_LISTENER_FORBIDDEN "+selected);
   options.port=port;
   options.host="127.0.0.1";
   options.exclusive=true;
   delete options.path;delete options.fd;
   const cb=args.findLast(x=>typeof x==="function");
   if(cb)return original.call(this,options,cb);
   return original.call(this,options);
 };
 Object.defineProperty(wrapper,"__clscaleGuard",{value:true});
 net.Server.prototype.listen=wrapper;
 process.stderr.write("[DiceBox fixture] loopback TCP30005 guard installed\\n");
}
