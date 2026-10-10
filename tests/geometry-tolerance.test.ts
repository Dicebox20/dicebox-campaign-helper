import { describe, expect, it } from "vitest";
import {
  assessRouteClearance, assessWallAlignment, DICEBOX_GEOMETRY_TOLERANCE_PROFILE,
  DICEBOX_ROUTE_PROFILES, type RouteClearanceEvidence,
} from "../packages/dicebox-compiler/src/geometry-tolerance";

const main: RouteClearanceEvidence = {
  routeId: "m02-main",kind:"main-road",phase:"visual",observedMinWidthFt:15,measurementUncertaintyFt:0.2,
  requiredFootprintFt:5,continuousWalkableSurface:"yes",groundFootprintClassification:"verified",
};
const trail: RouteClearanceEvidence={...main,routeId:"m02-north",kind:"forest-trail",observedMinWidthFt:10};

const result=(x:RouteClearanceEvidence)=>assessRouteClearance(x);
const codes=(x:RouteClearanceEvidence)=>result(x).findings.map(f=>f.code);

describe("DiceBox geometry tolerance standard v0.1",()=>{
  it("keeps the policy constants",()=>{
    expect(DICEBOX_GEOMETRY_TOLERANCE_PROFILE).toBe("dicebox-geometry-tolerance/v0.1");
    expect(DICEBOX_ROUTE_PROFILES["main-road"]).toMatchObject({targetWidthFt:15,preferredMinWidthFt:10,preferredMaxWidthFt:20});
    expect(DICEBOX_ROUTE_PROFILES["forest-trail"]).toMatchObject({targetWidthFt:10,preferredMinWidthFt:5,preferredMaxWidthFt:15});
  });
  it("passes the standard primary width",()=>expect(result(main).status).toBe("PASS"));
  it("passes forest trails around 10ft",()=>expect(result(trail).status).toBe("PASS"));
  it("does not reject a 30ft widening",()=>expect(result({...main,observedMinWidthFt:30}).status).toBe("PASS"));
  it("does not reject a 22ft side trail",()=>expect(result({...trail,observedMinWidthFt:22}).status).toBe("PASS"));
  it("permits an ordinary 5ft secondary single-file path with documented width variance",()=>{
    expect(result({...trail,observedMinWidthFt:5.3,measurementUncertaintyFt:0.1}).status).toBe("PASS");
  });
  it("reviews a 5ft forest trail when measurement uncertainty crosses the functional minimum",()=>{
    expect(result({...trail,observedMinWidthFt:5.1,measurementUncertaintyFt:0.2}).status).toBe("NEEDS_RECONCILIATION");
  });
  it("flags narrow main road without authored bottleneck as reconciliation",()=>{
    expect(result({...main,observedMinWidthFt:9.4,measurementUncertaintyFt:0.3}).status).toBe("NEEDS_RECONCILIATION");
    expect(codes({...main,observedMinWidthFt:9.4,measurementUncertaintyFt:0.3})).toContain("BOTTLENECK_INTENT_UNRECORDED");
  });
  it("permits an authored 9.4ft primary chokepoint for Medium",()=>{
    expect(result({...main,observedMinWidthFt:9.4,measurementUncertaintyFt:0.3,
      intentionalBottleneck:{authored:true,reason:"natural stone pinch",lengthFt:12}}).status)
      .toBe("PASS_WITH_DOCUMENTED_VARIANCE");
  });
  it("does not impose a hard 10ft length cap on authored chokepoints",()=>{
    expect(result({...main,observedMinWidthFt:8.5,measurementUncertaintyFt:0.1,
      intentionalBottleneck:{authored:true,reason:"long authored narrow route",lengthFt:30}}).status)
      .toBe("PASS_WITH_DOCUMENTED_VARIANCE");
  });
  it("rejects unrecorded bottleneck intent",()=>{
    expect(result({...main,observedMinWidthFt:8,measurementUncertaintyFt:0.2,
      intentionalBottleneck:{authored:false,reason:"",lengthFt:0}}).status).toBe("NEEDS_RECONCILIATION");
  });
  it("blocks a genuinely sub-5ft corridor",()=>{
    expect(result({...trail,observedMinWidthFt:4.4,measurementUncertaintyFt:0.2}).status).toBe("REDO_REQUIRED");
  });
  it("reviews functional uncertainty around 5ft instead of hard fail",()=>{
    expect(result({...trail,observedMinWidthFt:5.1,measurementUncertaintyFt:0.3}).status).toBe("NEEDS_RECONCILIATION");
  });
  it("requires 10ft on explicitly Large-accessible routes",()=>{
    expect(result({...trail,kind:"designated-large",requiredFootprintFt:10,observedMinWidthFt:9.4,measurementUncertaintyFt:0.2}).status).toBe("REDO_REQUIRED");
  });
  it("requires 15ft on explicitly Huge-accessible routes",()=>{
    expect(result({...trail,kind:"designated-huge",requiredFootprintFt:15,observedMinWidthFt:14,measurementUncertaintyFt:0.2}).status).toBe("REDO_REQUIRED");
  });
  it("rejects missing width evidence",()=>{
    expect(result({...main,observedMinWidthFt:undefined}).status).toBe("NEEDS_RECONCILIATION");
  });
  it("rejects missing measurement uncertainty",()=>{
    expect(result({...main,measurementUncertaintyFt:undefined}).status).toBe("NEEDS_RECONCILIATION");
  });
  it("does not treat a proxy centerline across rock as walkable",()=>{
    expect(result({...main,continuousWalkableSurface:"no"}).status).toBe("REDO_REQUIRED");
  });
  it("holds when walkable ground continuity is unknown",()=>{
    expect(result({...trail,continuousWalkableSurface:"unknown"}).status).toBe("NEEDS_RECONCILIATION");
  });
  it("holds when mushroom trunk ground-vs-canopy is uncertain",()=>{
    expect(result({...trail,groundFootprintClassification:"uncertain"}).status).toBe("NEEDS_RECONCILIATION");
  });
  it("rejects invalid solid obstruction classification",()=>{
    expect(result({...trail,groundFootprintClassification:"invalid"}).status).toBe("REDO_REQUIRED");
  });
  it("requires swept-token footprint at Blueprint phase",()=>{
    expect(result({...trail,phase:"blueprint",sweptTokenClearance:"unverified"}).status).toBe("NEEDS_RECONCILIATION");
  });
  it("accepts verified swept footprint without claiming runtime",()=>{
    const x=result({...trail,phase:"blueprint",sweptTokenClearance:"pass"});
    expect(x.status).toBe("PASS");expect(x.evidencePhase).toBe("blueprint");expect(x.noWrite).toBe(true);
  });
  it("blocks failed swept footprint",()=>{
    expect(result({...trail,phase:"blueprint",sweptTokenClearance:"fail"}).status).toBe("REDO_REQUIRED");
  });
  it("requires actual Foundry canary for runtime acceptance",()=>{
    expect(result({...trail,phase:"runtime",sweptTokenClearance:"pass",runtimeMovementCanary:"unverified"}).status)
      .toBe("NEEDS_RECONCILIATION");
  });
  it("accepts only observed runtime canary at runtime phase",()=>{
    expect(result({...trail,phase:"runtime",sweptTokenClearance:"pass",runtimeMovementCanary:"pass"}).status).toBe("PASS");
  });
  it("blocks observed runtime collision",()=>{
    expect(result({...trail,phase:"runtime",sweptTokenClearance:"pass",runtimeMovementCanary:"fail"}).status).toBe("REDO_REQUIRED");
  });
  it("uses uncertainty to avoid invented precision",()=>{
    const x=result({...trail,observedMinWidthFt:6,measurementUncertaintyFt:1});
    expect(x.measurementIntervalFt).toEqual({min:5,max:7});
  });
  it("does not mutate source route data",()=>{
    const copy=JSON.stringify(main);result(main);expect(JSON.stringify(main)).toBe(copy);
  });
  it("passes grounded-wall trace within 0.5ft",()=>{
    expect(assessWallAlignment({wallId:"w1",deviationFt:0.3,sourceUncertaintyFt:0.1,functionalError:"none",groundFeature:"solid"}).status).toBe("PASS");
  });
  it("reviews wall trace between 0.5 and 1ft",()=>{
    expect(assessWallAlignment({wallId:"w2",deviationFt:0.7,sourceUncertaintyFt:0.1,functionalError:"none",groundFeature:"solid"}).status).toBe("REVIEW");
  });
  it("blocks wall trace outside 1ft",()=>{
    expect(assessWallAlignment({wallId:"w3",deviationFt:1.01,sourceUncertaintyFt:0,functionalError:"none",groundFeature:"solid"}).status).toBe("BLOCKED");
  });
  it("blocks an incorrect opening at any alignment precision",()=>{
    expect(assessWallAlignment({wallId:"w4",deviationFt:0,sourceUncertaintyFt:0,functionalError:"false-opening",groundFeature:"solid"}).status).toBe("BLOCKED");
  });
  it("blocks sight leak even for a perfect wall trace",()=>{
    expect(assessWallAlignment({wallId:"w5",deviationFt:0,sourceUncertaintyFt:0,functionalError:"sight-leak",groundFeature:"solid"}).status).toBe("BLOCKED");
  });
  it("blocks walling a decorative overhead cap",()=>{
    expect(assessWallAlignment({wallId:"w6",deviationFt:0.01,sourceUncertaintyFt:0,functionalError:"none",groundFeature:"overhead-only"}).status).toBe("BLOCKED");
  });
  it("reviews ambiguous ground footprints",()=>{
    expect(assessWallAlignment({wallId:"w7",deviationFt:0.3,sourceUncertaintyFt:0.1,functionalError:"none",groundFeature:"ambiguous"}).status).toBe("REVIEW");
  });
  it("reviews unknown wall alignment rather than guessing",()=>{
    expect(assessWallAlignment({wallId:"w8",functionalError:"none",groundFeature:"solid"}).status).toBe("REVIEW");
  });
  it("reviews wall uncertainty over 0.5ft target",()=>{
    expect(assessWallAlignment({wallId:"w9",deviationFt:0.4,sourceUncertaintyFt:0.2,functionalError:"none",groundFeature:"solid"}).status).toBe("REVIEW");
  });
});
