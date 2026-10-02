import { MODULE_ID } from "./constants.js";
import { clearRotatingLockDoor, configureRotatingLockDoor, createRotatingLockConfig, installRotatingLockDoorControl, installRotatingLockSocket, openRotatingLockPuzzle, openRotationLockSetup, previewRotatingLock } from "./rotating-lock.js";

const api = Object.freeze({
  openSetup: openRotationLockSetup,
  rotatingLock: Object.freeze({ createConfig: createRotatingLockConfig, configureDoor: configureRotatingLockDoor, clearDoor: clearRotatingLockDoor, open: openRotatingLockPuzzle, preview: previewRotatingLock })
});

function installPremiumRuntimeSockets() {
  installRotatingLockSocket();
}

Hooks.once("init", () => {
  installPremiumRuntimeSockets();
});

Hooks.once("ready", () => {
  installPremiumRuntimeSockets();
  installRotatingLockDoorControl();
  const module = game.modules.get(MODULE_ID);
  if (module) module.premiumApi = api;
  const core = module?.api;
  core?.puzzles?.register?.({ id: "rotation-lock", title: "Rotation Lock", hint: "A pick-and-turn lock for Doors.", icon: "fa-lock", edition: "premium", requiredType: "door", openSetup: openRotationLockSetup });
  core?.studio?.register?.({ id: "studio", title: "Regionwright Studio", edition: "premium" });
  Hooks.callAll("regionwright.premiumReady", api);
});

Hooks.on("canvasReady", () => {
  installPremiumRuntimeSockets();
  installRotatingLockDoorControl();
});
