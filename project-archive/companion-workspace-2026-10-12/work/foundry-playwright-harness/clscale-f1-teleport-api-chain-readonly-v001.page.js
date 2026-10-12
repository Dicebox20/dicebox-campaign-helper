const region=game.scenes.get("La9krMOMBhAhDLi6")?.regions.get("zKNU1R3JGIMMt017");
if (!region || !game.ready) throw Error("SOURCE_MISSING");
const methods=["teleportTokens","teleportToken","spawnTokens","_createToken","_getTokenDestinations","_getShapeBounds"];
const fns=Object.fromEntries(methods.map(n=>[n,typeof region[n]==="function"?String(region[n]):null]));
const s=game.scenes.get("La9krMOMBhAhDLi6");
return{readOnly:true,foundry:game.version,scene:s.id,grid:s.grid.size,sourceMethods:fns,sceneCreate:String(s.createEmbeddedDocuments),regionConstructor:region.constructor?.name,tokenDocumentConstructor:TokenDocument.implementation.name};