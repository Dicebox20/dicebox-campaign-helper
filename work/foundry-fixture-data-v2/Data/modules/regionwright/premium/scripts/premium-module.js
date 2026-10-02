import { MODULE_ID } from "./constants.js";
import { clearRotatingLockDoor, configureRotatingLockDoor, createRotatingLockConfig, installRotatingLockDoorControl, installRotatingLockSocket, openRotatingLockPuzzle, openRotationLockSetup, previewRotatingLock } from "./rotating-lock.js";
import { clearLaserGridDoor, configureLaserGridDoor, createLaserGridPuzzleConfig, installLaserGridDoorControl, installLaserGridSocket, openLaserGridPuzzle, openLaserGridSetup, previewLaserGrid } from "./laser-grid.js";
import { clearTimingDialDoor, configureTimingDialDoor, createTimingDialPuzzleConfig, installTimingDialDoorControl, installTimingDialSocket, openTimingDialPuzzle, openTimingDialSetup, previewTimingDial } from "./timing-dial.js";
import { clearIngredientMixing, configureIngredientMixing, createIngredientMixingPuzzleConfig, handleRegionEvent as handleIngredientMixingRegionEvent, installIngredientMixingDoorControl, installIngredientMixingSocket, installIngredientMixingTileControl, openIngredientMixingPuzzle, openIngredientMixingSetup, previewIngredientMixing } from "./ingredient-mixing.js";
import { clearSpineMosaic, configureSpineMosaic, createSpineMosaicPuzzleConfig, handleSpineMosaicRegionEvent, installSpineMosaicDoorControl, installSpineMosaicSocket, installSpineMosaicTileControl, openSpineMosaicPuzzle, openSpineMosaicSetup, previewSpineMosaic } from "./spine-mosaic.js";
import { ascendancyAPI, installAscendancySocket } from "./ascendancy.js";
import { ascendancyLiveInstaller } from "./ascendancy-live-installer.js";
import { ascendancyFixtureHarness, installAscendancyFixtureControls } from "./ascendancy-fixture-harness.js";
import { claimPremiumEntry, claimPremiumStage } from "../../scripts/premium-runtime-guard.js";

const premiumEntryOwner = claimPremiumEntry();
const api = Object.freeze({
  openSetup: openRotationLockSetup,
  rotatingLock: Object.freeze({ createConfig: createRotatingLockConfig, configureDoor: configureRotatingLockDoor, clearDoor: clearRotatingLockDoor, open: openRotatingLockPuzzle, preview: previewRotatingLock }),
  laserGrid: Object.freeze({ createConfig: createLaserGridPuzzleConfig, configureDoor: configureLaserGridDoor, clearDoor: clearLaserGridDoor, open: openLaserGridPuzzle, preview: previewLaserGrid }),
  timingDial: Object.freeze({ createConfig: createTimingDialPuzzleConfig, configureDoor: configureTimingDialDoor, clearDoor: clearTimingDialDoor, open: openTimingDialPuzzle, preview: previewTimingDial }),
  ingredientMixing: Object.freeze({ createConfig: createIngredientMixingPuzzleConfig, configure: configureIngredientMixing, clear: clearIngredientMixing, open: openIngredientMixingPuzzle, preview: previewIngredientMixing, handleRegionEvent: handleIngredientMixingRegionEvent }),
  spineMosaic: Object.freeze({ createConfig: createSpineMosaicPuzzleConfig, configure: configureSpineMosaic, clear: clearSpineMosaic, open: openSpineMosaicPuzzle, preview: previewSpineMosaic, handleRegionEvent: handleSpineMosaicRegionEvent }),
  ascendancy: Object.freeze({ ...ascendancyAPI, handoff: ascendancyLiveInstaller, fixtureHarness: ascendancyFixtureHarness })
});
function installPremiumRuntimeSockets() {
  if (!claimPremiumStage("sockets")) return;
  installRotatingLockSocket();
  installLaserGridSocket();
  installTimingDialSocket();
  installIngredientMixingSocket();
  installSpineMosaicSocket();
  installAscendancySocket();
}

/** Register safely even if Foundry evaluates this companion after ready. */
function initializePremiumRuntime() {
  installPremiumRuntimeSockets();
  installRotatingLockDoorControl();
  installLaserGridDoorControl();
  installTimingDialDoorControl();
  installIngredientMixingTileControl();
  installIngredientMixingDoorControl();
  installSpineMosaicTileControl();
  installSpineMosaicDoorControl();
  installAscendancySocket();
  const module = globalThis.game?.modules?.get?.(MODULE_ID);
  const core = module?.api;
  if (!core?.puzzles?.register) return;
  if (!claimPremiumStage("registration")) return;
  Object.assign(core.premium ?? {}, api);
  core.puzzles.register({ id: "rotation-lock", title: "Rotation Lock", hint: "A pick-and-turn lock for Doors.", icon: "fa-lock", edition: "premium", requiredType: "door", openSetup: openRotationLockSetup });
  core.puzzles.register({ id: "laser-grid", title: "Laser Grid", hint: "Turn mirrors and diodes to route a beam to its receiver.", icon: "fa-satellite-dish", edition: "premium", requiredType: "door", openSetup: openLaserGridSetup });
  core.puzzles.register({ id: "timing-dial", title: "Timing Dial", hint: "Stop the hand in the green area for each selected timing test.", icon: "fa-stopwatch", edition: "premium", requiredType: "door", openSetup: openTimingDialSetup });
  core.puzzles.register({ id: "ingredient-mixing", title: "Ingredient Mixing", hint: "Toss named ingredients into a cauldron and match the recipe.", icon: "fa-flask", edition: "premium", requiredType: "door, tile, or region", openSetup: openIngredientMixingSetup });
  core.puzzles.register({ id: "spine-mosaic", title: "Spine Mosaic", hint: "Reorder book spines until their picture is whole.", icon: "fa-book-open", edition: "premium", requiredType: "door, tile, or region", openSetup: openSpineMosaicSetup });
  core.studio?.register?.({ id: "studio", title: "Regionwright Studio", edition: "premium" });
  globalThis.Hooks?.callAll?.("regionwright.premiumReady", api);
}

if (premiumEntryOwner) {
  Hooks.once("init", () => {
    // Scene controls are constructed before ready/canvasReady in Foundry v14.
    // Register this gated hook during init so the first control render sees it.
    installAscendancyFixtureControls();
    installPremiumRuntimeSockets();
  });

  Hooks.once("ready", () => {
    initializePremiumRuntime();
  });

  Hooks.on("canvasReady", () => {
    installPremiumRuntimeSockets();
    initializePremiumRuntime();
  });

  if (globalThis.game?.ready) initializePremiumRuntime();
}
