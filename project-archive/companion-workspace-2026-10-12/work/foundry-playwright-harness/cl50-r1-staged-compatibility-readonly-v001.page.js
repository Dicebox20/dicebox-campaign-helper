// CL50 R1 runtime compatibility and executor readback. NO writes.
const active=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id));
const stageExecutor=active[0];
const n1=game.scenes.get("MAbLfBqG7qIVVuLN"),t1=game.scenes.get("ImeIdHbYb6kZKAdt");
const r=n1.regions.get("xsitdXO94BHJkYKX"),b=t1.regions.get("ewIAYppRLvgIV1b7");
const contracts={tokenDocEventShapeAvailable:typeof foundry.documents?.TokenDocument==="function",regionTeleportTokenType:typeof b.teleportToken,regionSpawnTokensType:typeof b.spawnTokens,scenePullUsersType:typeof t1.pullUsers,dialogConfirmType:typeof foundry.applications?.api?.DialogV2?.confirm,world:"the-lost-mine-of-phandalin",activeExecutor:game.user?.id,computedFirstGm:stageExecutor?.id,GMList:active.map(u=>({id:u.id,name:u.name,isGM:u.isGM})),sameAsStagedElection:game.user?.id===stageExecutor?.id,sourceRegionBehaviors:r.behaviors.size,sourceRegionFlags:r.getFlag("world","dicebox"),destRegionBehaviors:b.behaviors.size,nonGMActive:game.users.filter(u=>u.active&&!u.isGM).length};
return{operation:"cl50.r1.staged-compatibility-readonly-v001",noWrite:true,contracts};