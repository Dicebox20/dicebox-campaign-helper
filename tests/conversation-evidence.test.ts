import { describe, expect, it } from "vitest";

/**
 * Cross-task evidence captured from the current Migration Worker conversation
 * and its two linked Codex tasks. These are test fixtures, not runtime
 * authority. Historical graph snapshots are intentionally labeled so they
 * cannot be confused with the repository's current manifest.
 */
export const conversationEvidence = {
  foremanThread: "01a0231c-57b9-76c3-ba81-12dbac16fddc",
  sourceTasks: [
    {
      id: "01a02a42-39a8-7940-901e-608ff5136930",
      title: "Migration Worker",
      evidence: "M133-M138 migration/runtime audit and current terminology handoff",
    },
    {
      id: "01a02a42-c9ef-7fb3-8683-64a43fd48943",
      title: "Geometry Worker",
      evidence: "Spatial Blueprint, Tram topology, renderer candidates, and overlay evidence",
    },
    {
      id: "01a02a43-2488-7ca0-80ae-0af1a4aed0c2",
      title: "Provenance Worker",
      evidence: "KB provenance, source/stage graph reconciliation, and runtime gate boundaries",
    },
  ],
  target: {
    worldId: "dbx-test-world",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    sceneId: "dbx:scene:fixture-tram-routing-projection",
    planId: "dbx:plan:fixture-tram-routing-projection",
  },
  m133ToM138: [
    { milestone: "M133", source: "SRC-M133", facts: ["F-209"], decisions: ["D-175"], openItems: ["O-082"], trials: ["T-180"], status: "stale-fixture-topology" },
    { milestone: "M134", source: "SRC-M134", facts: ["F-210"], decisions: ["D-176"], openItems: [], trials: ["T-181"], status: "preview-only-api-semantics" },
    { milestone: "M135", source: "SRC-M135", facts: ["F-211"], decisions: ["D-177"], openItems: ["O-083"], trials: ["T-182"], status: "source-only-tram-candidate" },
    { milestone: "M136", source: "SRC-M136", facts: ["F-212"], decisions: ["D-178"], openItems: ["O-084"], trials: ["T-183"], receipts: "R-757-R-766", status: "duplicate-import-topology" },
    { milestone: "M137", source: "SRC-M137", facts: ["F-213"], decisions: ["D-179"], openItems: ["O-085"], trials: ["T-184"], receipts: "R-767-R-776", status: "source-repaired-fixture-readback-open" },
    { milestone: "M138", source: "SRC-M138", facts: ["F-214"], decisions: ["D-180"], openItems: ["O-086"], trials: ["T-185"], receipts: "R-777-R-786", status: "paired-controller-source-correction-runtime-unproven" },
  ],
  tramTopology: {
    board: { origin: { x: 420, y: 210 }, cell: { width: 110, height: 95 }, rows: 6, columns: 6 },
    rail: { tramEast: { x: 1080, y: 447.5 }, coreWest: { x: 24, y: 447.5 }, doorOpening: { yMin: 400, yMax: 495 } },
    m135AuditTarget: {
      level: "graybox",
      walls: 11,
      doors: 3,
      canonicalTiles: 6,
      equalBoundsRegions: 6,
      canonicalCars: ["dbx:tram:x", "dbx:tram:o", "dbx:tram:q", "dbx:tram:b", "dbx:tram:c", "dbx:tram:r"],
      canonicalTileIds: ["dbx:tile:tram-x", "dbx:tile:tram-o", "dbx:tile:tram-q", "dbx:tile:tram-b", "dbx:tile:tram-c", "dbx:tile:tram-r"],
      approvedMove: { pieceId: "dbx:tram:b", delta: -1 },
    },
    currentPackageProjection: { staticVisualTiles: 5, dynamicCarTiles: 6, staticRegions: 39, footprintRegions: 6 },
  },
  graphSnapshots: {
    m136DuplicateImport: {
      label: "historical-source-and-stage-snapshot",
      manifestEntry: "entry-20260824.js",
      entryImports: ["ascendancy-installer.js?dbx=0.1.3", "foundry-live-bridge.js?dbx=0.1.3", "module.js?dbx=0.1.4"],
      moduleImports: ["ascendancy-installer.js?dbx=0.1.4", "foundry-live-bridge.js?dbx=0.1.4"],
      runtimeEffect: "unconfirmed",
    },
    m137StagedRepair: {
      label: "historical-staged-snapshot-from-linked-conversation",
      graph: ["manifest", "entry-20260825.js", "module.js?dbx=0.1.5"],
      singletonAdapterUrls: [
        "ascendancy-installer.js?dbx=0.1.5",
        "foundry-live-bridge.js?dbx=0.1.5",
        "tram-calibration-installer.js?dbx=0.1.5",
        "tram-routing-fixture-installer.js?dbx=0.1.5",
      ],
      staleUnreferencedEntries: ["entry-20260823.js", "entry-20260824.js"],
      hashes: {
        moduleJson: "38828AF425834BA8E57A55BE6CECA57ED4B406870CF7D7C865F48124FA30A7C3",
        entry: "0B3DBBCAF1FE8BBA98E5C36814F8EC2BFB39CB495FC861A945183FC16754423B",
        module: "94AF7640A3ADAFA78975FF864AD715A86CE70EE6DD4CB1A9A4E59C9CF9FA0321",
        ascendancyInstaller: "FD8A5C75B381938ECA03C24639A39B742763BFB0880F13C57BEDF41BCB0DEC67",
        foundryLiveBridge: "2B4F79997CAB9C963C7F3826BFD2BAF2B3DEC256F630970A8D7CDD983743AA87",
        tramCalibrationInstaller: "60E9BE09F4F9069F1519BA9040B7270BAB2D3831A4D1D6165E8444D0A60417A1",
        tramRoutingFixtureInstaller: "59B306B99D69D9EF90F639D035F6533FD6366FA449B334C9EB2A1F1CFF18C66A",
        staleEntry20260823: "C742B012E26653A24EBB93ACE798DC323E5621F2FFA686FD10D90A9FAC74FFD5",
        staleEntry20260824: "9C0678F3B0A0A278A9200A48461EE339292F4CCF54881C1F3A8BAF821DA619D6",
      },
    },
  },
  currentTerminology: {
    workflow: "Blueprint → Walls/doors → empty renderer → Background Objects/Regions → authoritative reread",
    backgroundObjects: "fixed visible environmental or puzzle apparatus after the renderer",
    foundryTileBoundary: "Reserve Foundry Tile/TileDocument for a native runtime document needing separate position, visibility, movement, or state.",
    authority: "No runtime authority is conveyed by a conversation, source hash, test pass, or preview.",
  },
  runtimeGate: {
    preview: ["exact target/runtime", "current active GM", "source/stage parity", "stable IDs and counts", "foreign-state fingerprint"],
    approval: "separate explicit approval using the current unexpired preview token",
    reread: ["game.scenes.get", "fromUuid fallback", "initial-Level/renderer", "Walls/doors", "Tiles/Regions", "foreign state"],
    recovery: "UNKNOWN or timeout means reread before retry; never blind-retry or broaden scope.",
    forbiddenScope: ["Ballad", "Regionwright", "progression", "reset", "unreviewed macros", "foreign documents"],
  },
} as const;

describe("conversation evidence fixture", () => {
  it("keeps the three source tasks distinct from the Foreman", () => {
    expect(conversationEvidence.sourceTasks).toHaveLength(3);
    expect(new Set(conversationEvidence.sourceTasks.map((task) => task.id)).size).toBe(3);
    const sourceTaskIds: readonly string[] = conversationEvidence.sourceTasks.map((task) => task.id);
    expect(sourceTaskIds.includes(conversationEvidence.foremanThread)).toBe(false);
  });

  it("preserves the exact fixture target and M135 Tram audit invariants", () => {
    expect(conversationEvidence.target).toMatchObject({ worldId: "dbx-test-world", foundryVersion: "14.367", systemVersion: "5.3.3" });
    expect(conversationEvidence.tramTopology.m135AuditTarget).toMatchObject({ level: "graybox", walls: 11, doors: 3, canonicalTiles: 6, equalBoundsRegions: 6 });
    expect(conversationEvidence.tramTopology.m135AuditTarget.approvedMove).toEqual({ pieceId: "dbx:tram:b", delta: -1 });
    expect(conversationEvidence.tramTopology.m135AuditTarget.canonicalCars).toHaveLength(6);
    expect(conversationEvidence.tramTopology.m135AuditTarget.canonicalTileIds).toHaveLength(6);
  });

  it("records M133-M138 as non-certifying provenance milestones", () => {
    expect(conversationEvidence.m133ToM138.map((record) => record.milestone)).toEqual(["M133", "M134", "M135", "M136", "M137", "M138"]);
    expect(conversationEvidence.m133ToM138.every((record) => record.status.includes("runtime") || record.status.includes("source") || record.status.includes("topology") || record.status.includes("api"))).toBe(true);
  });

  it("distinguishes the M136 duplicate graph from the M137 repaired staged snapshot", () => {
    const duplicate = conversationEvidence.graphSnapshots.m136DuplicateImport;
    const repaired = conversationEvidence.graphSnapshots.m137StagedRepair;
    expect(duplicate.entryImports).toContain("ascendancy-installer.js?dbx=0.1.3");
    expect(duplicate.moduleImports).toContain("ascendancy-installer.js?dbx=0.1.4");
    expect(repaired.graph).toEqual(["manifest", "entry-20260825.js", "module.js?dbx=0.1.5"]);
    expect(repaired.staleUnreferencedEntries).toEqual(["entry-20260823.js", "entry-20260824.js"]);
    expect(new Set(repaired.singletonAdapterUrls).size).toBe(repaired.singletonAdapterUrls.length);
  });

  it("validates all captured graph hashes as SHA-256 values", () => {
    const hashes = Object.values(conversationEvidence.graphSnapshots.m137StagedRepair.hashes);
    expect(hashes.every((hash) => /^[A-F0-9]{64}$/.test(hash))).toBe(true);
  });

  it("keeps the current terminology and runtime safety boundary explicit", () => {
    expect(conversationEvidence.currentTerminology.workflow).toContain("Background Objects/Regions");
    expect(conversationEvidence.currentTerminology.authority).toContain("No runtime authority");
    expect(conversationEvidence.runtimeGate.preview).toContain("exact target/runtime");
    expect(conversationEvidence.runtimeGate.reread).toContain("game.scenes.get");
    expect(conversationEvidence.runtimeGate.recovery).toContain("never blind-retry");
    expect(conversationEvidence.runtimeGate.forbiddenScope).toEqual(expect.arrayContaining(["Ballad", "Regionwright", "progression", "reset"]));
  });
});
