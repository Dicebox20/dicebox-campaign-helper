# CONTINUATION HANDOFF — Cabin in the Ashen Veil (map art and workflow)
**Handoff identifier:** CAV-CHAT-2026-10-23-MAP-ART-GREAT-ROOM-LIMIT-01
**Campaign:** Cabin in the Ashen Veil, an independent horror side campaign inside Dicebox Campaign Helper.
**Date:** 2026-10-23 Los Angeles local / archived 2026-10-24 UTC.
**Source repository:** Dicebox20/dicebox-campaign-helper
**Working branch:** codex/cabin-ashen-veil-recovery
**Authority:** User-directed handoff; preserving, not modifying, current owner-approved architecture or release state.

## READ THIS FIRST
The latest owner instruction is an archival handoff, **not authorization to render another Great Room**. The owner rejected two freeform Great Room generations and requested community AI battlemap research and another review of Tom Cartos’s map library. That research has been recorded, and the NEXT TASK is a **measured geometry-first Great Room solution**, not image generation.

**Status at the boundary:** 56 semantic design cards; 45 grouped base-map targets; 18 exact owner-approved base maps; 27 remain = 21 cabin room/roof maps + 3 estate maps + 3 Undercroft/finale. Rejected Great Room candidates do not enter these totals. The most recent approved complete art archive is **ashen_veil_approved_maps_2026-10-23_v10_foyer_approved.zip**, containing exact accepted Foyer attempt 3. Archives are current-chat downloadable ZIP files, not committed repository PNG binaries; GitHub holds receipt documentation.

## Owner mandates and scope firewall
- Each enclosed room of Blackwood Cabin gets its own battlemap/Foundry Scene; outside the cabin, use area-scale maps, except existing explicit approved map splits/merges.
- Universal map style: **strict orthographic 90-degree overhead**, moderate painterly aging/haunting, **thin top-facing REPRESENTATIVE wall caps**, physically coherent doors, readable feature silhouettes, enough Medium-token walkable floor, and **neutral diffuse background illumination**. Foundry owns active light, movement/vision walls, stage alterations, pickups and scripted rewards.
- **INCLUSION-ONLY IMAGE PROMPTS**: every noun named in renderer-facing directions must be an approved desired visible feature. Do not place unwanted objects into even negative prompt text; maintain exclusions in internal QA only. The entire rejected prompt/image must be **ABANDONED** on REDO. Independently author a new direction from current PREPARE and accepted layout. See AGENTS.md, universal representative wall standard and clean-restart rule.
- PREPARE → deterministic structural evidence / inspect → fixture manifest / geometry lock → controlled painterly rendering → final inspect PASS or REDO → archive only approved image → later BUILD/INJECT/VERIFY with actual Foundry authority. Campaign FAST exception permits deterministic graybox instead of a fresh generated grayscale pass, NOT skipping dimensional or portal proof.
- This side-campaign canon must not silently be merged into Beyond the Realms or global Dicebox campaign state.

## Immediate blocker — H-G06 Great Room
- Latest approved Gondian house blueprint BWE-027 labels Great Room **14 feet east-west by 16 feet north-south**, Foyer 6×6 ft, Family Area 14×8 ft. At 5-ft occupied token spaces, the Great Room is ~9 nominal grid squares before a staircase, mantle, family furniture and quest fixtures: inadequate for owner’s intended vast double-height hub.
- The owner rejected Great Room gen **a7c8bbde-a17c-4329-9997-bf7eea9c4069** (too small) and **f4150872-49e3-4a7a-ac4a-d5d2ceb01ff3** (another failure). There is also a documented intermediate oversize trial **d2e018d9-14f3-41eb-a687-7b002dc3b765** in master scene notes; do not invent its unseen conversation wording. Neither rejected image is a valid style/input reference.
- Existing H-G06 must-see: broad main upper-floor staircase (east), real hearth, Grandfather Clock (Hour Hand behind Brass Tiny Key), inspectable family architectural blueprint table, distinct 027 lockbox (water-filled Dust of Dryness pellet earned through locked box), recognizable main family seating and clear paths.
- **Five links:** S Foyer H-G02, W Dining H-G01, E Study H-G05 with Brass Study Key, N separate Rear Family Room H-G09, internal east/up stairs to Upper Landing H-U02. Ensure the hearth does not block north Family passage and study door does not collide with stairs. Old pre-House-v2 designs that put Studio in the ground floor or upstairs stair in Foyer are superseded.
- The exact revised room size remains **unapproved**. Do NOT silently rescale one room, crop/zoom the raster, shrink token Scale Ratio, or alter approved Foyer source pixels as a proxy for physical size. Coherently adjust adjoining room plan and portals, or obtain owner-approved quantified abstract Foundry scale if that is ultimately preferred.
- Community research proposed comparing **30×35ft** and **35×40ft** Great Room study footprints as preliminary trials, NOT canon; first produce a deterministic ground-floor adjacency/scale drawing, with 5ft-tokens and all fixture/door footprints. Preserve as design alternatives for user choice only when a real measured comparison exists.

## Newly learned research — transfer practical principles
- Community reports from Stable Diffusion/ControlNet and Dungeondraft/Donjon: creators establish spatial layout first and apply conditioned detail/image-to-image/lineart conversion to it; geometry preservation is NOT guaranteed and requires structural verification. Uncontrolled text-to-image has repeatedly invented external surroundings, wrong doors and poor usable scale.
- Tom Cartos examples: Essenheim Manor, Gothic Mansion, Manor House and modular Build-A-Bastion Gothic Manor emphasize rationally sized room shapes, logical circulation, and **clean/furnished variants**. His art is hand-drawn in Photoshop and layered. Draw from *general techniques only*, not his actual artwork/assets: current licensing restricts AI-content usages and training; obtain appropriate permission before using assets in an AI workflow.
- If provider geometry-conditioning/control tools are actually available, test them on accepted measured structure and compare geometry drift; otherwise construct authored original wall/floor/fixture layers deterministically and use AI only for isolated textures/dressing under original/licensed assets. Do NOT claim ControlNet/ComfyUI access or render success without evidence.

## Next bounded execution sequence (not yet performed)
1. REREAD repository AGENTS.md; database KB; master structured scene PREPARE and exact H-G06; owner BWE-027 ground-floor plan; accepted H-G02 Foyer artifact; October 23 research/scale audit; global image-prompt and scale standards. Confirm which layout metadata is latest.
2. Create a measured **house-wide geometry revision candidate** with at least two clear Great Room physical footprints. Reconcile south Foyer, west Dining, east Study, north Family Area and upstairs Landing entrances, plus floor/door/stair footprint and roof/upper-floor coherence. Preserve current accepted Foyer art bytes, testing portal scaling separately.
3. For each candidate, render a **deterministic flat graybox** from vector/scaled wall segments and show 5ft token circles/clearance, independently readable quest anchors and large realistic stairs. Check ALL five transitions, distinct clock/blueprint/027/hearth, token circulation and inaccessible space. Do not use generative art at this stage.
4. Present structural comparison and documented trade-offs for owner approval of house physical geometry. Owner may also approve a different scaling mechanism. Do not mark proposed sizes approved prematurely.
5. Only after geometry approval: record revised BWE-027-derived semantic blueprint and full-source links, execute fresh per-map PREPARE, author a **wholly original inclusion-only image direction**, generate ONE render and inspect. Stop on REDO/PASS; preserve immutable provenance.
6. Later, build authoritatively in Foundry using established scene/region/wall workflows; no current images have received runtime certification. Exact input and environment validation required.

## Other map tasks and approved specifics
- Remaining estate maps EXT-03 Donovan’s Shack, EXT-04 Privy, EXT-08 Rear Deck & Family Grounds. Greenhouse EXT-06 separate room interior approved; Gazebo EXT-05 approved and Northwest Forest Maze FM-01..04 visually unified.
- Pond EXT-02 FULL/DRAINED pair both approved. Final hydrology: north-flowing river, southern sluice diverting through eastern bypass and exposing Aqueduct gate when pond drains. Bathhouse water level synchronized. Boathouse EXT-07 edited final approved AS-IS with water foliage remaining, short dock/clearing and conditional vegetation blockade. Sophie’s Favorite Doll optional buried item, worn +1 attack rolls and +1 saving throws (rarity and attunement proposals not owner-confirmed).
- Northwestern Forest Maze central Well is FM-04; Gazebo NW and Greenhouse NE are interior maze landmark portals to separate gameplay Scenes; Sune Grove nine independent accepted images with distinct corner busts, NOT a duplicate forest Well.
- Bathhouse unified surface owner-approved with separately staged lower Rosewater Reliquary; safe Boiler return. Original seven surface semantic zones still part of logical register.

## Primary exact authority paths
- AGENTS.md
- docs/DICEBOX-UNIVERSAL-REPRESENTATIVE-WALL-BATTLEMAP-STANDARD-2026-10-22.md
- docs/DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md
- docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md
- docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md
- campaign-archives/cabin-in-the-ashen-veil/all-scene-preparation-register-v2-2026-10-22.json
- campaign-archives/cabin-in-the-ashen-veil/README.md
- campaign-archives/cabin-in-the-ashen-veil/great-room-scale-and-inclusion-only-prompt-audit-2026-10-23.md
- campaign-archives/cabin-in-the-ashen-veil/community-ai-battlemap-and-tom-cartos-library-workflow-audit-2026-10-23.md
- campaign-archives/cabin-in-the-ashen-veil/approved-map-archive-v10-foyer-receipt-2026-10-23.md
- campaign-archives/cabin-in-the-ashen-veil/chat-archives/2026-10-23-map-production-available-transcript.md

## Integrity and nonclaims
**Verified:** repository references fetched; owner approvals captured in dated exact-image receipts; latest register = 18/45 owner-approved and H-G06 currently REDO+research; artifact ZIP accessible in previous tool session.
**Not verified:** full lossless chat transcript, any new dimension/house scale, image-generation provider’s exact hidden prompt, Foundry wall collision/Region transitions/puzzle scripts, SQLite full KB rebuild until separately executed. No automatic product stage promotion, no world writes.
**STOP CONDITION:** The next operator should take a geometry/KB/owner decision step, not paint a third unverified Great Room.
