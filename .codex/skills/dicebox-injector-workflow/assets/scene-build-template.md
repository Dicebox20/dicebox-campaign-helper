# <SCENE_ID> — <SCENE_NAME>

```javascript
// DICEBOX_BUILD_CONTRACT: dicebox-scene-injector-build/v2
// DICEBOX_SINGLE_MACRO: true
// DICEBOX_SCENE_ID: <SCENE_ID>
// DICEBOX_ART_MODE: embedded-webp
// DICEBOX_WORKFLOW: PREPARE -> RENDER -> INSPECT -> APPROVE -> BUILD
// DICEBOX_SCALE_PROFILE: battlemap-120
// DICEBOX_GRID_TYPE: gridless
// DICEBOX_GRID_SIZE: 120
// DICEBOX_GRID_DISTANCE: 5
// DICEBOX_GRID_UNITS: ft
// DICEBOX_LOGICAL_SIZE: <COLUMNS>x<ROWS>
// DICEBOX_SCENE_PIXELS: <WIDTH>x<HEIGHT>
// DICEBOX_TOKEN_FOOTPRINT_POLICY: system-size
// DICEBOX_TOKEN_ART_SCALE_POLICY: visual-only
// DICEBOX_DISCOVERY_CONTRACT: dicebox-discovery/v1
// DICEBOX_DISCOVERY_COUNT: 0
// DICEBOX_DISCOVERY_DENSITY: ordinary
// DICEBOX_DISCOVERY_VISIBLE_ANCHORS: true
// DICEBOX_DISCOVERY_NOTICE_POLICY: flat-d20-no-modifiers
// DICEBOX_DISCOVERY_NOTICE_STATE: per-character-once-until-reset

const DICEBOX_SCENE_SCALE = Object.freeze({
  gridType: 0,
  gridSize: 120,
  distance: 5,
  units: "ft",
  logicalColumns: <COLUMNS>,
  logicalRows: <ROWS>,
  width: <WIDTH>,
  height: <HEIGHT>
});

(async () => {
  // One complete self-contained DiceBox Scene Injector macro goes here.
  // Scene width/height/grid fields must reference DICEBOX_SCENE_SCALE.
})();
```
