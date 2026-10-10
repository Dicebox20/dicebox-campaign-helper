/** Approved DiceBox geometry tolerance v0.1 (2026-10-09).
 * Pure, no-write evidence classification; never implies actual Foundry movement.
 * Full-width aesthetic preferences are not mechanical minima.
 */
export const DICEBOX_GEOMETRY_TOLERANCE_PROFILE = "dicebox-geometry-tolerance/v0.1" as const;

export const DICEBOX_ROUTE_PROFILES = Object.freeze({
  "main-road": Object.freeze({ targetWidthFt: 15, preferredMinWidthFt: 10, preferredMaxWidthFt: 20 }),
  "forest-trail": Object.freeze({ targetWidthFt: 10, preferredMinWidthFt: 5, preferredMaxWidthFt: 15 }),
} as const);

export type RouteKind = keyof typeof DICEBOX_ROUTE_PROFILES | "designated-large" | "designated-huge";
export type GeometryEvidencePhase = "visual" | "blueprint" | "runtime";
export type GeometryEvidenceState = "pass" | "fail" | "unverified";
export type ToleranceFinding = Readonly<{ code: string; message: string }>;
export type GeometryToleranceVerdict = "PASS" | "PASS_WITH_DOCUMENTED_VARIANCE" | "NEEDS_RECONCILIATION" | "REDO_REQUIRED";

export type RouteClearanceEvidence = Readonly<{
  routeId: string;
  kind: RouteKind;
  phase: GeometryEvidencePhase;
  observedMinWidthFt?: number;
  measurementUncertaintyFt?: number;
  /** The largest mechanical footprint among creatures that MUST be able to use this route. */
  requiredFootprintFt: number;
  continuousWalkableSurface: "yes" | "no" | "unknown";
  /** Requires an independently approved ground-surface and obstacle trace, not image brightness. */
  groundFootprintClassification: "verified" | "uncertain" | "invalid";
  /** Required on blueprint/runtime phases, not a substitute for image evidence. */
  sweptTokenClearance?: GeometryEvidenceState;
  runtimeMovementCanary?: GeometryEvidenceState;
  intentionalBottleneck?: Readonly<{
    authored: boolean;
    reason: string;
    /** Length of the deliberate narrow segment; 10ft is a heuristic, not a mandatory cap. */
    lengthFt: number;
  }>;
}>;

export type RouteClearanceAssessment = Readonly<{
  contract: typeof DICEBOX_GEOMETRY_TOLERANCE_PROFILE;
  status: GeometryToleranceVerdict;
  routeId: string;
  evidencePhase: GeometryEvidencePhase;
  requiredFootprintFt: number;
  preferredWidthFt: Readonly<{ target: number; min: number; max: number }> | null;
  measurementIntervalFt: Readonly<{ min: number; max: number }> | null;
  findings: readonly ToleranceFinding[];
  noWrite: true;
}>;

export function assessRouteClearance(evidence: RouteClearanceEvidence): RouteClearanceAssessment {
  const findings: ToleranceFinding[] = [];
  const record = (code: string, message: string) => { findings.push({code,message}); };
  let status: GeometryToleranceVerdict = "PASS";
  const rank: Record<GeometryToleranceVerdict,number> = {
    PASS:0, PASS_WITH_DOCUMENTED_VARIANCE:1, NEEDS_RECONCILIATION:2, REDO_REQUIRED:3,
  };
  const raise = (next:GeometryToleranceVerdict) => {if(rank[next]>rank[status])status=next;};
  const preferred = evidence.kind === "main-road" || evidence.kind === "forest-trail"
    ? DICEBOX_ROUTE_PROFILES[evidence.kind] : null;
  const finiteNonnegative = (x: unknown):x is number => typeof x === "number" && Number.isFinite(x) && x >= 0;
  const width = evidence.observedMinWidthFt;
  const uncertainty = evidence.measurementUncertaintyFt;
  let interval: {min:number;max:number} | null = null;

  if(!evidence.routeId?.trim() || !Number.isFinite(evidence.requiredFootprintFt) || evidence.requiredFootprintFt <= 0) {
    raise("NEEDS_RECONCILIATION");
    record("INVALID_ROUTE_SPEC","Route identity and positive required creature footprint are mandatory.");
  }
  if(width === undefined || !finiteNonnegative(width) || !finiteNonnegative(uncertainty)) {
    raise("NEEDS_RECONCILIATION");
    record("MEASUREMENT_UNVERIFIED","Measured width and its nonnegative uncertainty are needed before clearance approval.");
  } else {
    interval={min:Math.max(0,width-uncertainty),max:width+uncertainty};
    if(Number.isFinite(evidence.requiredFootprintFt) && evidence.requiredFootprintFt>0) {
      if(interval.max < evidence.requiredFootprintFt) {
        raise("REDO_REQUIRED");
        record("CREATURE_FOOTPRINT_BLOCKED","Even the upper-bound corridor width is less than the required token footprint.");
      } else if(interval.min < evidence.requiredFootprintFt) {
        raise("NEEDS_RECONCILIATION");
        record("CREATURE_FOOTPRINT_UNCERTAIN","Measurement uncertainty straddles the functional footprint minimum.");
      }
    }
    if(preferred && interval.min < preferred.preferredMinWidthFt) {
      raise("PASS_WITH_DOCUMENTED_VARIANCE");
      record("WIDTH_BELOW_PREFERENCE","The path narrows below its preferred aesthetic band; width above a preference is not a hard maximum.");
      if(evidence.kind === "main-road" && interval.min >= evidence.requiredFootprintFt) {
        const bottleneck=evidence.intentionalBottleneck;
        if(!bottleneck?.authored || !bottleneck.reason?.trim() ||
          !Number.isFinite(bottleneck.lengthFt) || bottleneck.lengthFt <= 0) {
          raise("NEEDS_RECONCILIATION");
          record("BOTTLENECK_INTENT_UNRECORDED","A narrow main-road constriction needs a real authored gameplay note.");
        }
      }
    }
  }

  if(evidence.continuousWalkableSurface === "no") {
    raise("REDO_REQUIRED");
    record("WALKABLE_ROUTE_MISSING","No continuous passage exists across the actual walkable surface.");
  } else if(evidence.continuousWalkableSurface !== "yes") {
    raise("NEEDS_RECONCILIATION");
    record("WALKABLE_ROUTE_UNVERIFIED","Apparent road paint or an empty centerline does not certify walkability.");
  }
  if(evidence.groundFootprintClassification === "invalid") {
    raise("REDO_REQUIRED");
    record("OBSTACLE_CLASSIFICATION_INVALID","Collision uses solid cliffs or canopy as ground in a way that obstructs required traversal.");
  } else if(evidence.groundFootprintClassification !== "verified") {
    raise("NEEDS_RECONCILIATION");
    record("OBSTACLE_CLASSIFICATION_UNVERIFIED","Solid trunks/rock boundaries must be separated from canopy and decoration.");
  }
  if(evidence.phase === "blueprint" || evidence.phase === "runtime") {
    if(evidence.sweptTokenClearance === "fail") {
      raise("REDO_REQUIRED");record("SWEPT_TOKEN_BLOCKED","The required token footprint collides along the continuous route.");
    } else if(evidence.sweptTokenClearance !== "pass") {
      raise("NEEDS_RECONCILIATION");record("SWEPT_TOKEN_NOT_TESTED","Blueprint clearance requires a swept footprint test.");
    }
  }
  if(evidence.phase === "runtime") {
    if(evidence.runtimeMovementCanary === "fail") {
      raise("REDO_REQUIRED");record("RUNTIME_CANARY_FAILED","Foundry token movement failed the required corridor.");
    } else if(evidence.runtimeMovementCanary !== "pass") {
      raise("NEEDS_RECONCILIATION");record("RUNTIME_CANARY_NOT_TESTED","Runtime readiness requires an observed Foundry movement canary.");
    }
  }
  return {contract:DICEBOX_GEOMETRY_TOLERANCE_PROFILE,status,routeId:evidence.routeId,
    evidencePhase:evidence.phase,requiredFootprintFt:evidence.requiredFootprintFt,
    preferredWidthFt:preferred ? {target:preferred.targetWidthFt,min:preferred.preferredMinWidthFt,max:preferred.preferredMaxWidthFt}:null,
    measurementIntervalFt:interval,findings,noWrite:true};
}

export type WallAlignmentEvidence = Readonly<{
  wallId: string;
  deviationFt?: number;
  sourceUncertaintyFt?: number;
  functionalError: "none" | "collision" | "sight-leak" | "false-opening" | "trapped-arrival";
  groundFeature: "solid" | "overhead-only" | "ambiguous";
}>;
export function assessWallAlignment(evidence: WallAlignmentEvidence) {
  const findings: ToleranceFinding[]=[];
  let status: "PASS" | "REVIEW" | "BLOCKED" = "PASS";
  const push=(code:string,message:string)=>findings.push({code,message});
  if(evidence.functionalError!=="none") {
    status="BLOCKED";push("FUNCTIONAL_WALL_FAILURE","Collision, sight leak, false opening or trapped arrival overrides any positional tolerance.");
  }
  if(evidence.groundFeature==="overhead-only") {
    status="BLOCKED";push("CANOPY_IS_NOT_A_WALL","Overhead caps/shadows are not ground-level collision walls.");
  } else if(evidence.groundFeature!=="solid" && status!=="BLOCKED") {
    status="REVIEW";push("GROUND_CLASS_UNCERTAIN","Unverified obstacle semantics cannot be auto-promoted.");
  }
  const dev=evidence.deviationFt, uncertainty=evidence.sourceUncertaintyFt;
  if(typeof dev!=="number"||!Number.isFinite(dev)||dev<0||typeof uncertainty!=="number"||!Number.isFinite(uncertainty)||uncertainty<0) {
    if(status!=="BLOCKED")status="REVIEW";
    push("ALIGNMENT_UNVERIFIED","Measure source-ground alignment and uncertainty; do not invent precise geometry.");
  } else if(dev>1) {
    status="BLOCKED";push("WALL_ALIGNMENT_OVER_1FT","Trace differs from approved grounded boundary by more than 1ft.");
  } else if(dev+uncertainty>0.5 && status!=="BLOCKED") {
    status="REVIEW";push("WALL_ALIGNMENT_REVIEW","Wall error or uncertainty exceeds the 0.5ft target.");
  }
  return {contract:DICEBOX_GEOMETRY_TOLERANCE_PROFILE,status,wallId:evidence.wallId,
    deviationFt:dev??null,sourceUncertaintyFt:uncertainty??null,
    findings,noWrite:true as const};
}
