// CL50 exact version document lifecycle hook source research. No document operations.
const source=game.scenes.get("MAbLfBqG7qIVVuLN");
const dest=game.scenes.get("ImeIdHbYb6kZKAdt");
const pass=game.world.id==="the-lost-mine-of-phandalin"&&game.version==="14.367"&&game.system.version==="5.3.3"&&source?.regions.has("xsitdXO94BHJkYKX")&&dest?.regions.has("ewIAYppRLvgIV1b7");
if(!pass)return{noWrite:true,status:"BLOCKED",reason:"world/version/endpoint drift"};
const methods=["_preCreate","_onCreate","_preDelete","_onDelete","canUserModify","testUserPermission"];
const token=new foundry.documents.TokenDocument({name:"CL50 ephemeral read-only token",x:560,y:1380,width:1,height:1,actorLink:false},{parent:dest});
const docs={};
for(const k of methods){let fn=token[k];docs[k]={kind:typeof fn,source:typeof fn==="function"?String(fn).slice(0,12000):null};}
const api={modifyBatch:String(foundry.documents.modifyBatch).slice(0,2200),canCreate:game.user.can("TOKEN_CREATE"),canDelete:game.user.can("TOKEN_DELETE"),activeGMIds:game.users.filter(u=>u.active&&u.isGM).map(u=>u.id)};
const sceneCtor=token.constructor,checks={isPersisted:dest.tokens.has(token.id),instance:sceneCtor?.name,sceneTokenCount:dest.tokens.size,sourceTokens:source.tokens.size};
return{noWrite:true,operation:"cl50-token-lifecycle-method-sources-v001",status:"OBSERVED_ONLY",hooks:docs,api,checks,limitations:["Methods are client-side functions not proof of server CAS","No document preCreate or onCreate hooks were fired","No global listener registrations were modified","No batch was invoked"]};