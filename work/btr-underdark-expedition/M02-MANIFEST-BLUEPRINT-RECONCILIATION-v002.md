# M02 Tallcap Forest — Blueprint Reconciliation v002

**State:** **HOLD / NOT LOCKED / NO PAINTERLY RENDER**  
**Source:** Approved grayscale attempt 004, 1536×1024, SHA-256 `d8b171a6e697f279ef0d9d4cb51be7b0060fc3170554ae70d8de8af0e9838956`.  
**Preserved authority:** PREPARE proposes 36×24 five-foot cells (180×120ft), Gridless 120px/5ft, output 4320×2880. The scene source art, object classifications and original 161 wall segments were not changed.  
**Canonical machine artifacts:** `M02-FEATURE-MANIFEST-CANDIDATE-v002.json`, `M02-SPATIAL-BLUEPRINT-CANDIDATE-v002.json`.  
**QA:** `M02-v002-route-qa.py` / `M02-RECONCILIATION-QA-RECEIPT-v002.json`. Both route and Region checks are **candidate proxy geometry only**, not proof of actual Foundry traversal.

## Why we reconciled rather than deleting obstacles

The v001 southern centerline crossed two declared physical barriers: the ground footprint of a tallcap and a rock spire. The north route passed too close to two rock forms. We **did not delete, suppress, shrink or relabel the 161 provisional wall segments**. We instead authored alternative centerlines; widened west/east arrival Region shapes to contain spawn clearances; shifted the southern habitat's manual-hunt anchor onto an accessible candidate trail section; and tightened the candidate southern habitat Region to avoid solid mushroom footprints.

Automated comparison confirmed **161/161 wall segments unchanged**, seven Regions retained and six anchors retained. Three Region shapes and one anchor were adjusted.

## Exact observed checks (source-image pixel space)

| Route | Required clear half-width | Nearest drafted solid barrier | Nearest cave boundary | Mechanical proxy result | Final semantic result |
|---|---:|---:|---:|---|---|
| Main road | 64.00px (15ft full) | 100.13px | 72.00px | PASS | Open path still needs visual width review |
| North loop | 42.67px (10ft full) | 45.72px | 233.84px | PASS, **~3px margin** | **Not certified**; visually tight against rock/trunk bases |
| South loop | 42.67px (10ft full) | 49.12px | 96.38px | PASS in drafted geometry | **FAIL walkable-surface fidelity**: candidate corridor partly lies on rocky/cliff-side ground, not the visibly established trail |

The route-half-width distances derive from the user-proposed 36×24 physical footprint and 1536×1024 native structural raster. They are not certified pixel segmentation of every floor edge.

### Accessibility and object semantics

- **Canonical `spatialBlueprintSchema` v0.1.0: PASS** — one Level, 161 Walls, seven Regions, six anchors, valid identities/fields/bounds.
- **Proxy geometry check: PASS** — all three revised authored centerlines clear *provisional solid obstacles* and cavern wall segments at their required buffer distance.
- **Six named anchors: PASS on geometric enclosure**, with the claimed footprint circle contained inside its Region; Regionwright gameplay/permissions remain untested.
- **West/east arrival areas enlarged** to hold a representative 42-source-pixel spawn-clearance radius.
- **Southern habitat Region candidate** avoids modeled full blockers; hunting stays explicitly manual-GM-start.
- **Southern rubble Region still intersects `dbx:wall:m02-rock-s01`**. It may be an authored aggregate terrain area around a rock, but it must NOT be activated as walkable difficult terrain without separating the physically solid rock from accessible loose scree.
- **Canopy versus trunk: preserved correct classification.** Canopies/shadows remain decoration; grounded stalk footprints and major stone masses remain full blocking candidates. No cap circumference has become a Wall.
- No mining, water/fishing or auto-hunt activation was invented. Torchlight, gathering API implementation, milestone discovery rewards and unresolved eastern travel target remain deferred.

## Decision: cannot lock the blueprint for painting

The independent QA demonstrates that the candidate *wall model* admits an alternative 10-foot southern route on paper. However reviewing that route against the grayscale reveals that it moves **off the visible southern trail** into rocky/chasm-edge-looking terrain. A numerical path around model polygons is not proof that a 10-foot walkable corridor exists in the approved raster. Likewise the northern passage's tolerance is ~3 source pixels, narrower than a reliable semantic-tracing margin.

**Therefore: `FEATURE_MANIFEST_BLUEPRINT_RECONCILIATION — BLOCKED`; the v002 Blueprint must remain CANDIDATE.** Do not label the painterly render or Injector BUILD ready. The former structural visual PASS is preserved as an event, but its proposed physical-clearance acceptance cannot be promoted to a locked gameplay footprint.

## Required recovery

**NEXT: STRUCTURAL_CORRECTION / GRAYSCALE REDO #5**, unless the user explicitly revises the accepted minimum widths or a separately reviewed trail geometry demonstrates genuine 10-foot navigability. A new render uses a **completely independent image prompt from accepted M02 PREPARE**. Do not send the earlier four prompts, rejected render compositions or this obstacle overlay to the image provider as generation input. Retain prior grayscale/QA only as historical evidence and inspect a genuinely new composition for its physical corridor widths and obstacle semantics.

Expected image characteristics derive from accepted PREPARE: west-east continuous 15ft main road, clearly separated 10ft looping northern and southern routes, milestone on shoulder, navigable level forest floor, credible stalk bases and rock edges, northern foraging and southern hunting accessible, strict 90° overhead grayscale camera. Do **not** use a prior prompt as an edit template.

**Live Foundry writes:** 0. **User-visible status:** painterly render blocked.

