// Foundry 14.367 read-only inspection of core Region travel handlers and executor selection.
if(game.world.id!=="the-lost-mine-of-phandalin"||game.version!=="14.367")return{status:"STOP",noWrite:true};
const m=CONFIG.RegionBehavior.dataModels.teleportToken;
const entries=Object.getOwnPropertyDescriptors(m.events??{});
const eventSources={};
for(const [name,descriptor] of Object.entries(entries)){const x=descriptor.value;eventSources[name]=typeof x==="function"?String(x).slice(0,9000):String(x).slice(0,200);}
const fn=game.users.getDesignatedUser;
const uSource=typeof fn==="function"?String(fn).slice(0,6000):null;
return{operation:"cl50.v14.teleport-core-handler",status:"PASS",noWrite:true,events:eventSources,designatedUserSource:uSource,activeGM:game.users.activeGM?.id,activeGMs:game.users.filter(u=>u.active&&u.isGM).map(u=>u.id),counts:{tokens:game.scenes.get("ImeIdHbYb6kZKAdt").tokens.size,behaviors:game.scenes.get("ImeIdHbYb6kZKAdt").regions.get("ewIAYppRLvgIV1b7").behaviors.size},caveats:["Handler presence is not authorized railway behavior","No method or hook was invoked"]};