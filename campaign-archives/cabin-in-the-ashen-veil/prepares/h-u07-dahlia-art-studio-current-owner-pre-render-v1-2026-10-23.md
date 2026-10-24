# H-U07 Dahlia's Art Studio — Canon-Reconciled PREPARE v1 (candidate artwork only)

**Recorded:** 2026-10-23 Pacific / continuation start.  
**Status:** **READY_FOR_BOUNDED_RENDER_CANDIDATE; OWNER_ART_INSPECT_PENDING.** No output art, Scene, Wall, Region, item reward or teleport has been created by this PREPARE.  
**Track:** FAST (owner's campaign-only exception); preserve original `PREPARE→RENDER→owner INSPECT→BUILD→STAGE→INJECT→VERIFY→RECEIPT` gates.

## 1. Source and authority

Use current [all-scene PREPARE v2 ledger](../all-scene-preparation-register-v2-2026-10-22.json) card `H-U07`, [owner's House Layout v2](../blueprints/house-layout-revision-v2-2026-10-22.md), [Spine/candle-room correction](../blueprints/spine-mosaic-compartment-owner-correction-2026-10-22.md), [puzzle LOCK-03, LOCK-10 and LOCK-12](../authoritative-puzzle-design-and-foundry-implementation-spec-v1-2026-10-22.md), and the [owner-locked fifty-year-abandoned Great Room visual standard](../visual-standards/approved-50-year-abandoned-lodge-interiors-hg06-reference-2026-10-23.md).

**Critical supersession:** Historical `H-G07 Art Studio ground floor`, eastward direct doorway from Great Room and old House Master v1 `x=52..76,y=16..52` are **obsolete**. Current Studio ID **`H-U07`** is on the **UPPER EAST** of the house and normally reached from the **central Upper Landing `H-U02`**. The physical secret **`H-U08` Candle Workshop** adjoins the Studio and is inaccessible and visually concealed until Prayer of Protection. No exact dimensioned House Master v2 or pixel portal anchors have been formally approved; do not translate stale v1 coordinates into Walls.

## 2. Visual map preparation — owner PASS criteria
**Room:** Single self-contained upstairs Art Studio, domestic lived-in old lodge space, strict 90° overhead orthographic battlemap, strong representative wall-cap outline, navigable clear floor, no tokens, labels, grid, projected light sources or baked interactive rewards.  
**West/left wall:** One clear ordinary doorway serving the central Upper Landing, usable early before Brass Study Key or Sophia's Old Iron Key. The actual drawn door's wall position and door width remain visually owner-inspectable and provisional pending house-scale survey.  
**East/right wall:** Intact, plausible *ordinary* wall and decorated domestic devotional anchor; a **concealed H-U08 workshop** exists beyond this wall only in GM canon. Painted base must present no open eastern threshold, no glowing seam and no reward Wick. Later mechanically separate concealed passage activation will use native hidden-door state/overlay and explicit Prayer of Protection.  
**Distinct essential fixtures, with unobstructed token approach:**
- Vanity and clearly recognizable **empty fitting/mount for an Ornate Mirror**. Placing a later retrieved Mirror is a separate scripted action; the painting should not show a successfully mounted mirror or pre-open drawers.
- Noticeable old **painted portrait/painting of a small numbered chest** containing a distinctive **027 combination-code clue**; the physical `027` lockbox itself is in **H-G06 Great Room**, not in Studio. Use a later inspectable player Journal/chat card for truly legible clue digits if necessary rather than relying on tiny raster text.
- Private, quiet **Sune devotional shrine** distinct from vanity and code painting, along the Studio's wall. Explicit separate interaction anchors for **Prayer of Protection** (Workshop entry) and **Prayer of Devotion** (one Sune emblem half) must remain visible and approachable without prematurely exposing either reward.
- Domestic artist's **easel**, faded canvases, paints/brushes, worktables and small family mementos. A room inhabited long ago by an artist, not a torture chamber or library.

**Styling:** Copy the **approved final H-G06 aged Great Room look**—earthy timber/stone, dark muted greens and burgundy, 50 years of uninhabited dust, small cobwebs and worn plaster, frayed fabrics, dry scattered papers, old pigments and neglected foliage; no interior light shafts, active fire glow or dramatic dynamic stage-effect paint. Readable floor plan and distinct anchor silhouettes win over decorative clutter; house's neglect should be obvious at normal battlemap zoom.

**Scale/layout:** No measured v2 Room dimensions are binding. Choose a readable single-room aspect ratio based on content and north-up 90° overhead only. Do not assert measured feet or portal coordinates from this generated canvas. Owner will inspect and place Walls/doors manually.

## 3. Puzzle/interaction dependency contract (for future Region, Item and Journal build)

| Stable action | Prerequisite | State effect/reward | Spoiler, softlock and ownership rule |
|---|---|---|---|
| Mount Ornate Mirror on Vanity | Retrieved mirror from Pond; active PC explicit item use | Unlock/open vanity, expose **Carriage Key** and **Brass Tiny Key #1** independently | One-time player claims; keys not painted present in base; no auto-award on Region enter |
| Inspect numbered chest painting | Viewing/explicit click | Player-facing readable **027** clue for H-G06 lockbox | May use a clear chat card or Journal; no global spoiler hint chat |
| Use Prayer of Protection at shrine | Distinct prayer legitimately recovered from Parents' Hope Chest/Music Box | Reveal/open **separate physical H-U08 Candle Workshop** entry | Keep hidden until prayer; locked or hidden Wall state and reciprocal return; no automatically granted Wick |
| Use Prayer of Devotion at shrine | Distinct prayer recovered from far Boathouse late chain | Reveal/claim **Sune emblem half** | Independent from Protection; single physical claim; no interchangeable reward |
| Optional exploration hint | Character perceives inspection site via approved trigger | Private, fleeting **token-overhead thought bubble** on appropriate player's client | Native `canvas.hud.bubbles.say(token, text, {pan:false})` read-only verified in Foundry 14.367; avoid persistent `ChatMessage.create` for hidden hints |

**Never** place secret room, Wick, Vanity keys, Sune half or Great Room lockbox directly into base art as already obtained/revealed. Prayer, Mirror and clue delivery remain later script/Tile/Journal stages.

## 4. Immediate next action and exit gates

1. Generate **one** bounded `H-U07` **art candidate** after this PREPARE, using only the affirmative *wanted* visible features above. Use exact owner-approved H-G06 image as image/style reference, not old failed Studio drafts. Avoid old H-G07 route prompts.
2. Owner does visual **INSPECT PASS or REDO**, specifically validating west doorway, intact east concealed-wall appearance, independent vanity/painting/Sune shrine and 50-year-abandonment strength. No automatic approval.
3. Only after PASS, archive exact PNG and checksum, create new versioned H-U07 Foundry Scene with background and a single Level. Preserve manual owner Walls and any existing map assets. Owner places Walls and doors; gameplay scripts require separately verified geometry, Items and chosen player-display modes.
4. H-G05 Study follows the current render queue; its earlier illustrator “soft pass” does not count as owner approval.

## 5. Technical hint-channel canary evidence

Read-only Foundry 14.367 native API inspection on the existing H-G06 test token confirmed `canvas.hud.bubbles.say(token, message, {cssClasses,requireVisible,pan})` exists. That local API shows an ephemeral overhead bubble, subject to core `chatBubbles` setting; it does not by itself create a persistent chat log. For actual non-GM recipients, execute only on their selected client, not solely on elected GM. Avoid showing private hint text to everyone via `game.socket` broadcast. A real player-client proof remains pending.


## 6. Subsequent owner-approved workflow and visual gates (2026-10-24)

**Latest owner overrides supersede the older acceptance wording above, without changing this room's story canon.** Before **each** H-U07 or other Cabin map RENDER, re-read this PREPARE and its house-v2 portal/puzzle dependencies. The assistant now has owner-delegated **FINAL art PASS/FAIL** authority after immediate same-turn RENDER+INSPECT, and no second owner image signoff is required for a passing map. The 20-minute limit and proof/receipts remain.

Every new image render uses a **newly written affirmative-only prompt**, referencing only features desired in the image. Rejected prompts/images cannot supply the next prompt. However, a *near-pass* rejected image may serve as **a visual arrangement exemplar**, alongside the **exact owner-approved H-G06 Great Room as the binding 50-year abandonment/neutral-light style exemplar**. The near-pass is never authority for architecture or item reveal. Later final image PASS cannot override H-U07's required WEST doorway to Upper Landing, continuous SOUTH boundary, EAST disguised workshop boundary, vacant Ornate Mirror mount, painted chest clue `027`, and separate Sune shrine/prayer gating. A generated SOUTH opening does **not** represent access to H-U08 and must be rejected.

**2026-10-24 PREPARE reread checkpoint:** Verified this document's upper-floor and east-workshop location, normal western Studio entry and separate prayer-gated H-U08 reveal against the owner directive. The latest near-pass is the upright Studio with clearly legible 027 chest portrait and east rose shrine, gen `82087a56-2adc-4846-b5ed-a91dc4a95b6f`, but it failed due a south doorway and unqualified lighting. Use only its useful room fixture composition as an image example; all design requirements remain from this PREPARE and the aged Great Room.
