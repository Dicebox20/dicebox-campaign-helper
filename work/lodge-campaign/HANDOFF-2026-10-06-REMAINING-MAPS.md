# Central Lodge Remaining-Maps Handoff

Date: 2026-10-06
Workflow: PREPARE -> RENDER -> INSPECT -> BUILD -> IMPLEMENT -> VERIFY
Current exact gate: N3 -> IMPLEMENT

## Start here

N1 and N2 are installed in Foundry with user-supplied APPLY PASS receipts. N3 has an approved renderer and validated BUILD v001, but no Foundry APPLY receipt has yet been observed. Begin by implementing N3. After N3 APPLY PASS with evidenceClass created_document, advance to T1 -> PREPARE.

Do not rerun N1 or N2. Do not mark N3 installed until a created_document APPLY PASS is observed.

## Railway continuity

N1 — Underworks Hub / Lodge Railway Station
- IMPLEMENT PASS
- BUILD v001 SHA-256: b95ddb0317be8bc08d9f52ac9bc7f672111112d71e6d23385069c237f5b0c4de
- Approved render generation: 96b56cd0-0a09-4b38-9620-5a60f610acdf
- 28 Walls, 11 Regions, 5 initially-disabled station-power lights
- House Proof + Garden Proof + Rail Proof control railway authorization

N2 — Underground Grotto / Garden Station
- IMPLEMENT PASS
- BUILD v001 SHA-256: 0f1cc80451838007ef90099ec4cdf4271417076d5a603e1d0f8c9cbdd0c682b2
- Approved render generation: ebc29506-7cd1-49aa-8e1d-bf54308f6b97
- 36 Walls, 9 Regions, 4 initially-disabled lights
- Renderer is deliberately dry; flood/water flow is Foundry-owned state tied to B1

N3 — Collection Vaults / Underground Depot
- INSPECT PASS
- BUILD v001 PASS
- IMPLEMENT PENDING
- Artifact: central-lodge-n3-build-v001.md
- BUILD SHA-256: 4fe72e4a824ed8a78400c18b721a7ed0da5bdfb8adbbd966cc40ce2224f21bdd
- Approved render generation: 236c1c10-c033-48bb-af80-cd558cc8c565
- 34 Walls, 12 Regions, 5 initially-disabled depot lights
- Lower branch portal is T3
- Which east/west main-line portal binds to T2 is intentionally unresolved. Do not guess.

## Style guide

Companion handoff package contains three image references:
- N1-style.jpg: refined private-estate underground station, burgundy/dark-wood/brass passenger carriage, clean rail alignment, inactive fixtures
- N2-style.jpg: dry underground garden/grotto station, refined masonry and vegetation, readable platforms
- N3-style.jpg: collection depot, three coherent rail portals, visible turnout, workshop/storage architecture, inactive fixtures

Approved style-guide render generation IDs:
- N1: 96b56cd0-0a09-4b38-9620-5a60f610acdf
- N2: ebc29506-7cd1-49aa-8e1d-bf54308f6b97
- N3: 236c1c10-c033-48bb-af80-cd558cc8c565

Style traits:
- top-down / orthographic tactical readability with only mild isometric wall-face treatment
- realistic stone, dark wood, iron, brass, worn private-estate railway character
- architecture readable before decoration
- clean track-to-tunnel geometry
- stairs/pedestrian routes separate from rails
- obvious walkable rail margins in tunnel maps
- neutral ambient exposure with inactive fixtures
- no text, labels, grid, UI, tokens, people, creatures, Region markers, or story exposition

## Render firewall and REDO rule

Every REDO abandons the previous prompt completely. Rewrite from current-map visible physical requirements only.

Never put prior failures, forbidden neighboring content, puzzle meaning, future destinations, adjacent-map names, story interpretation, clue solutions, Region logic, or Foundry implementation details into image prompts.

Permanent architecture/terrain belongs in the background. Stateful puzzle objects, lighting, weather, sound, fog, apparitions, rail power, flooding, and ritual state belong to Foundry where practical. Mechanical image work uses ImageMagick, not Python.

## Remaining sequence

T1 — Lodge ↔ Grotto Walkable Railway Tunnel
- Cicada Wing III
- teaches physical tunnel walking
- original private-estate railway infrastructure
- one coherent track between aligned map-edge exits
- clear pedestrian-safe shoulder/walkway

T2 — Grotto ↔ Depot Walkable Railway Tunnel
- Railway Switch Wheel for N3
- black-triangle clue
- recent passage evidence
- walkable railway corridor with maintenance/service architecture

T3 — Abandoned Spur / Cult Railway Extension
- unlocked through N3 switch/Route Plate state
- Recent Route Fragment -> N3 cartography table
- invocation fragments + Measure later reinterpret as lyrics
- official estate railway gives way to older/cult-added/ancient construction
- key late idea: the railway map ends, but the tunnel does not

F1 — Ancient Infernal Threshold
- completed Infernal Cicada Body + Wings I-IV recess
- inner ward uses Measure/Ritual Rhythm logic
- encounter/ritual state owns light
- do not bake solution state into art

F2 — Final Summoning Chamber
- living preserved cultists actively summoning Fiend Machine
- Fiend Machine is incoming, not already resident
- no conventional puzzle lock
- cultists, ritual effects, summoned figures, lyrics/text, and encounter manifestations are runtime elements

## Campaign canon required for remaining maps

- The Lodge cult created/used the ancient passage to the Hells. Fiend Machine did not create it.
- Cultists in the deepest chamber are alive, impossibly preserved/sustained, and actively summoning Fiend Machine.
- Horror progression: Abandoned -> Haunted -> Sacrificial -> Active -> Summoning.
- Mystery ladder: old cult-adjacent activity -> devil worship/sacrifice -> rhythm/music-associated devils -> Fiend Machine shadow -> active cult/infernal threshold.
- Black triangles later read as guitar picks. Blood-written invocations later read as lyrics. Do not identify Fiend Machine too early.

## Foundry / BUILD standards

- Gridless Scene, logical 120 px = 5 ft where applicable.
- One Markdown file, one fenced JavaScript block, one self-contained Scene Injector macro.
- Contract: dicebox-scene-injector-build/v2.
- Known target: Foundry 14.367, D&D5e 5.3.3, world the-lost-mine-of-phandalin.
- Use Central Lodge stable IDs/flags; world ID is not campaign identity.
- PREVIEW before mutation, exact target/GM gate, asset attestation before dependent creation, authoritative reread after mutation, no blind retry of unknown writes.
- First-run injector-owned asset 404 is expected.
- APPLY PASS with evidenceClass created_document means do not rerun.
- Validate with node tools/validate-dicebox-build.mjs <artifact.md>.

## Older unresolved implementation states

Observed APPLY PASS receipts exist for E2, E4, M1, M2, M3, U1, U2, B2, C1, C2, N1, and N2.

E1 is installed but VERIFY is deferred. E3 has only a known PREVIEW PASS; do not infer installed. B1 has a validated BUILD but no observed APPLY receipt; do not infer installed.

Desktop Commander was offline during the latest work. Do not claim Windows workspace sync until connectivity is re-established.

## Immediate next action

1. IMPLEMENT N3 using central-lodge-n3-build-v001.md.
2. Expect first renderer 404 if absent.
3. Require PREVIEW PASS.
4. Require APPLY PASS with created_document.
5. Do not rerun N3 after PASS.
6. Advance to T1 -> PREPARE.
