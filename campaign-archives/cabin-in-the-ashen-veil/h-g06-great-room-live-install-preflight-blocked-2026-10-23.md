# H-G06 Great Room — attempted live Scene BUILD, preflight blocker receipt

**Campaign:** Cabin in the Ashen Veil (independent side campaign)
**Date:** 2026-10-23 America/Los_Angeles
**Owner request:** “Alright, lets test out how well we can do this. Install the great room map.”
**Requested scope:** Phase 1 structural shell — approved background, necessary Walls/doors and named inert Regions; no puzzle logic or RegionBehavior.

## Direct runtime observation (Dicebox Bridge → PowerShell → Playwright CDP read-only)
- Foundry origin: `http://127.0.0.1:30000` / world `cabin-in-the-ashen-veil`.
- Foundry: `14.367`; D&D5e `5.3.3`.
- Chrome Dev user `Gamemaster 2`: `isGM:true`, **`isElectedActiveGM:false`**.
- Elected active GM: **Gamemaster 1**, online; **two connected GMs**.
- Dicebox Campaign Helper module enabled; `regionwright` module not active; `CONFIG.Scene.documentClass.create` surface present but never invoked for this attempt.
- World Scene count: **0** at this preflight.
- Result: **No Foundry mutation permitted under canonical current-active-GM and exact-target BUILD gate.** Presence of a generic Scene.create API or harness macro operation is not authority.

## Image evidence
- Conversation artifact identified as `cozy_great_room_interior_map.png`, native **1173 × 1341 RGB PNG**, **2,800,071 bytes**, SHA-256 **`c7e5305718d5aea1ddbcd374d0374f51b714bf6d860adf0cc0aabb3a29a4f0ee`**.
- The current conversation's continuity describes the latest H-G06 owner-inspected PASS generation ID as `b1496161-c305-46a1-9425-e9253033160a`, approved art in latest creative work. The direct binary-to-generation-ID link has not been separately attested by provider-side metadata in this tool pass; preserve that evidence qualifier.
- An identical-byte, renamed copy was prepared in this chat's downloadable artifact workspace as `h-g06-great-room-owner-approved.png`; original and copy share exact SHA-256 above.
- The documented prior rejected H-G06 image `top_down_cozy_manor_great_room.png`, SHA `ecd8c401f6dc13cfc8306bfaa5b29d29d904b846691214a377ffd85811cb8a88`, must **never** be substituted for this acceptance.
- Owner-selected storage `FoundryVTT/Data/Maps/cabin-in-the-ashen-veil/` existed as an empty created directory before this attempt. **The Great Room image was not transferred to the user machine's Foundry Data by this attempt.** The Bridge provides local PowerShell control but not a verified direct binary transfer from ChatGPT artifact workspace.

## Blueprint/build gates still open
- The accepted Great Room art uses approximately the 35:40 proportions of prepared proposed Candidate B, **35 ft east/west × 40 ft north/south**, yielding nominal `7×8` 5-ft logical cells / **840×960** scene pixels at `battlemap-120`; the proposed physical enlargement has **not yet been owner-approved as a measured whole-house blueprint**. Approval of painterly art is not inherently approval of revised physical dimensions.
- Four cardinal passageways: S→H-G02 Foyer, W→H-G01 Dining, E→locked H-G05 Study, N→H-G09 Family Room. East staircase reaches upper Landing H-U02. Need source-reconciled door segments, clearances, Level and named Regions.
- Candidate minimal inert Region anchors (uninstalled): `H-G06 — Foyer Doorway`, `H-G06 — Dining Doorway`, `H-G06 — Study Doorway`, `H-G06 — Family Room Doorway`, `H-G06 — Upstairs Staircase`. Optional clock, plan table and 027 lockbox semantic anchors require geometry review before inclusion; all **zero RegionBehaviors** at Phase 1.
- BUILD requires one self-contained Markdown/single-JavaScript macro, exact approved image/path hash, accepted logical coordinates, BUILD v2 validator PASS, exact world and current active-GM authority, preview, no foreign data mutation, native dry-run, authoritative reread and durable receipt.
- **No macro generated or validated by this attempt; no STAGE, INJECT or runtime VERIFY.**
- During read-only search for a local BUILD validator, a filesystem-recursive Bridge PowerShell call timed out; its durable receipt reported `outcome-unknown` for that *read-only search*, and it was **not retried**. It is unrelated to any Foundry write; do not interpret that search as build validation.

## Exact next actions
1. Transfer the accepted source PNG into `Maps/cabin-in-the-ashen-veil/` and verify SHA-256 **`c7e5305718d5aea1ddbcd374d0374f51b714bf6d860adf0cc0aabb3a29a4f0ee`**, check direct server URL from the same Foundry origin.
2. Obtain approved logical Scene size/coordinates consistent with the accepted image and linked house layout.
3. Let `Gamemaster 2` become Foundry's elected active GM through ordinary supported session control (e.g. primary `Gamemaster 1` logoff); do not forcibly change elected authority through JS or run from non-active GM.
4. Complete canonical BUILD macro and validator, then run reviewed bounded injection and reread Scene, Level, Walls, inert named Regions.

**Disposition:** `BLOCKED_PRE_INJECTION`; no Scene created and no world documents changed. Owner's original install request remains OPEN.
