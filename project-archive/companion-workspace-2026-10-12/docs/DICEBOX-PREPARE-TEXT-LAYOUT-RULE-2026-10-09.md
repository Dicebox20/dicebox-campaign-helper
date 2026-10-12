# DiceBox PREPARE Text-Layout Rule — 2026-10-09

Status: user-approved permanent rule for all DiceBox map PREPARE packets.
Scope: Map preparation ONLY. The larger experimental v3.1 grayscale/analyze/painterly workflow is NOT promoted by this decision.

Before any map art generation, PREPARE **must include a monospaced, top-down textual spatial diagram** (ASCII/Unicode) representing the proposed physical arrangement of the map.

Requirements:
1. Mark cardinal directions, intended ingress/egress at the map edges, primary routes, branch paths, and important physical landmarks; show the approximate relative positions of obstacles, walls/voids, navigable areas, and resource habitats where applicable.
2. Include an accompanying legend and location table so diagram characters are unambiguous. The diagram is a spatial communication and review aid; it is not itself scaled geometry or a Foundry wall/Region dataset.
3. Distinguish approved geometry from merely schematic proportions; for any exact implementation, separately freeze the authoritative Spatial Blueprint with coordinate assumptions, clearances, stable anchors and route keys.
4. PREPARE inspection must explicitly review the textual diagram for route consistency, coherent topology, accessible exploration spaces, landmarks and resource placement. Do not render until PREPARE is accepted.
5. The diagram may guide grayscale rendering, but the render prompt receives only the physically visible features on the current map. Exclude campaign destination names, mechanics, and cross-scene route logic.
6. If the schematic and the Spatial Blueprint disagree, reconcile before rendering; the Spatial Blueprint remains geometry authority.
7. Keep a copy of the accepted diagram in the map's PREPARE packet for later structural inspection and build checks.

Acceptance: an M01 Forgotten Road textual map in PREPARE helped the user assess its spatial design; on 2026-10-09 the user expressly requested permanent database adoption. No grayscale-to-painterly workflow stages are being permanently changed in this record.
