import { describe, expect, it } from "vitest";
import { createAscendancyMapBlueprints } from "@dicebox/compiler";

function doorSides(blueprint: ReturnType<typeof createAscendancyMapBlueprints>[number]) {
  return blueprint.anchors
    .filter((anchor) => anchor.kind === "door")
    .map((anchor) => anchor.anchorId.split(":").at(-1)?.split("-").at(-1))
    .sort();
}

describe("Ascendancy map-specific Spatial Blueprints", () => {
  it("uses the declared route topology instead of one generic four-door room", () => {
    const blueprints = createAscendancyMapBlueprints();
    const blueprint = (id: string) => blueprints.find((candidate) => candidate.blueprintId === id)!;

    expect(doorSides(blueprint("dbx:blueprint:signal-frequency-chamber"))).toEqual(["north", "south"]);
    expect(doorSides(blueprint("dbx:blueprint:rune-mechanism-chamber"))).toEqual(["north", "south"]);
    expect(doorSides(blueprint("dbx:blueprint:central-core-control-chamber"))).toEqual(["north", "south", "west"]);
    expect(doorSides(blueprint("dbx:blueprint:ascendancy-tram-depot"))).toEqual(["east", "exit", "ingress"]);
  });

  it("encloses the tram routing yard and aligns its single Core rail", () => {
    const tram = createAscendancyMapBlueprints().find((blueprint) => blueprint.blueprintId === "dbx:blueprint:ascendancy-tram-depot")!;
    const exit = tram.anchors.find((anchor) => anchor.anchorId === "dbx:anchor:tram-door-east");
    const ingress = tram.anchors.find((anchor) => anchor.anchorId === "dbx:anchor:tram-yard-ingress");
    const yardExit = tram.anchors.find((anchor) => anchor.anchorId === "dbx:anchor:tram-yard-exit");

    expect(exit).toMatchObject({ kind: "door", position: { x: 1512, y: 447.5 }, clearance: 47.5 });
    expect(ingress).toMatchObject({ kind: "door", position: { x: 420, y: 447.5 }, clearance: 47.5 });
    expect(yardExit).toMatchObject({ kind: "door", position: { x: 1080, y: 447.5 }, clearance: 47.5 });
    expect(tram.walls).toHaveLength(11);
    expect(tram.walls.map((wall) => wall.wallId)).toEqual(expect.arrayContaining([
      "dbx:wall:tram-yard-north", "dbx:wall:tram-yard-south",
      "dbx:wall:tram-yard-west-north", "dbx:wall:tram-yard-west-south",
      "dbx:wall:tram-yard-east-north", "dbx:wall:tram-yard-east-south",
    ]));
  });

  it("centers Core anchors on the six visible console locations", () => {
    const core = createAscendancyMapBlueprints().find((blueprint) => blueprint.blueprintId === "dbx:blueprint:central-core-control-chamber")!;
    expect(core.anchors.filter((anchor) => anchor.kind === "interaction").map((anchor) => anchor.position)).toEqual([
      { x: 384, y: 365 }, { x: 768, y: 365 }, { x: 1152, y: 365 },
      { x: 384, y: 670 }, { x: 768, y: 670 }, { x: 1152, y: 670 },
    ]);
  });

  it("pairs the eastbound Tram rail with a Core west-wall door on the same centerline", () => {
    const blueprints = createAscendancyMapBlueprints();
    const tram = blueprints.find((blueprint) => blueprint.blueprintId === "dbx:blueprint:ascendancy-tram-depot")!;
    const core = blueprints.find((blueprint) => blueprint.blueprintId === "dbx:blueprint:central-core-control-chamber")!;
    const tramDoor = tram.anchors.find((anchor) => anchor.anchorId === "dbx:anchor:tram-door-east");
    const coreDoor = core.anchors.find((anchor) => anchor.anchorId === "dbx:anchor:core-door-west");

    expect(tramDoor).toMatchObject({ kind: "door", position: { x: 1512, y: 447.5 }, clearance: 47.5 });
    expect(coreDoor).toMatchObject({ kind: "door", position: { x: 24, y: 447.5 }, clearance: 47.5 });
  });
});
