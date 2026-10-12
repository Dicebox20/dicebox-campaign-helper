// CL91 N3→T3: approved three-proof *logical unlock only*, no scene travel.
// May enter again after obtaining missing evidence. The shared kernel owns state mutation.
if(event?.name && event.name!=="tokenEnter")return;
const scene=game.scenes.get("pHQvDUDlyWZFuNrX");
const region=scene?.regions.get("RP1jYOH738xl9hks");
if(!scene||!region||event?.region?.id!=="RP1jYOH738xl9hks")return;
const token=event?.data?.token??event?.token??null;
const actor=token?.actor??null;
if(!actor||token?.parent?.id!=="pHQvDUDlyWZFuNrX")return;
const requestingUser=event?.user??null;
if(requestingUser&&!requestingUser.active)return;
if(requestingUser&&!requestingUser.isGM&&!actor.testUserPermission(requestingUser,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER))return;
const kernel=game.macros.find(m=>m.getFlag?.("world","dicebox")?.stableId==="dbx:central-lodge:macro:runtime");
if(!kernel||typeof kernel.execute!=="function")return;
return await kernel.execute({actor,token,event,speaker:{dicebox:{
 contract:"dicebox-region-behavior/v1",
 action:"gate",
 trigger:"TOKEN_ENTER",
 statePath:"puzzles.n3.t3BranchUnlocked",
 requirements:[
  {type:"state",path:"puzzles.n3.departureBoardResolved",equals:true},
  {type:"state",path:"puzzles.n3.switchWheelInstalled",equals:true},
  {type:"state",path:"puzzles.n3.routeOverlay.resolved",equals:true}
 ],
 incompleteMessage:"<p>The branch switch will not engage. The route remains incomplete.</p>",
 successMessage:"<p>The restored board, railway switch, and completed route overlay agree. With a heavy mechanical click, the concealed spur becomes available for inspection.</p>"
}}});
