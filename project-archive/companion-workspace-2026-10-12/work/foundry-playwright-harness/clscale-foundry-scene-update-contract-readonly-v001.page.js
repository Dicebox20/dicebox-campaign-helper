// Read-only Foundry v14 Scene and Grid update lifecycle introspection.
const proto=game.scenes.documentClass?.prototype??foundry.documents.Scene.prototype;
const names=[];
for(let q=proto;q&&q!==Object.prototype;q=Object.getPrototypeOf(q))for(const name of Object.getOwnPropertyNames(q))
 if(/grid|scale|resize|update|dimension|transform|reposition/i.test(name)&&!names.includes(name))names.push(name);
const src={};
for(const name of ['_preUpdate','_onUpdate','_onUpdateDescendantDocuments','_repositionObjects','_scaleCanvasObjects']){
 const desc=Object.getOwnPropertyDescriptor(proto,name);
 const fn=desc?.value??proto[name];
 src[name]=typeof fn==='function'?String(fn).slice(0,11000):null;
}
return {operation:'clscale-foundry-scene-contract-v001',noWrite:true,version:game.version,methodNames:names,
methods:src,sceneGrid:game.scenes.get('JZkxX6lUQe8Nc8xJ')?.grid?.toObject?.(),hasSceneClone:typeof game.scenes.get('JZkxX6lUQe8Nc8xJ')?.clone,sceneSchemaSizeFields:Object.keys(game.scenes.documentClass?.schema?.fields??{})};
