# Cabin in the Ashen Veil — Two-Chat Split for 24 Remaining Map Targets

**Owner-directed parallel work division:** 2026-10-24. **Branch:** `codex/cabin-ashen-veil-recovery` of `Dicebox20/dicebox-campaign-helper`. **Scope:** 24 still-unapproved *base-map arts* out of 45; 21 base target arts currently owner/assistant visually approved. This assignment does NOT assert 21 scenes have been installed. This split is a coordination plan, not a transfer of campaign canon or new authority to alter a shared Foundry Scene without native preflight.

## Canonical inventory reconciliation and exclusive ownership

Verified against `all-scene-preparation-register-v2-2026-10-22.json` (56 design cards with Bathhouse/Aqueduct/Maze consolidated to 45 map targets) and superseding 2026-10-24 art approvals. The 24 IDs below are distinct, all present in the register, with no overlap. Existing H-G02 Foyer, H-G06 Great Room, H-U07 Studio, H-G05 Study plus 17 earlier accepted targets are excluded. EXT-TRAIL was always an extra map *outside* the 45.

**CHAT A — THIS FOREMAN CHAT: 12 remaining early/intermediate targets (exclusive art ownership):**

1. `H-G01` Dining Room
2. `H-G03` Kitchen
3. `H-G04` Pantry
4. `H-G09` Rear Family Room
5. `H-U02` Upper Landing
6. `H-U01` Nursery
7. `H-U03` Guest Bedroom
8. `H-U04` Parents' Bedroom
9. `H-U05` Sophia's Bedroom
10. `H-U08` Concealed Candle Workshop
11. `EXT-03` Donovan's Shack
12. `EXT-08` Rear Deck & Family Grounds

**CHAT B — NEW HELPER CHAT: 12 remaining late-game/isolated targets (exclusive art ownership):**

1. `EXT-04` Privy (quick independent starter)
2. `H-A01` Central Attic
3. `H-A02` West Attic Storage
4. `H-A03` North Attic Storage
5. `H-A04` East Attic Storage
6. `H-R01` Roof / Chimney Clock
7. `H-B01` Allen's Basement Workshop
8. `H-B03` Basement Supply Closet
9. `H-B02` Secured Keystone Vault
10. `UND-01` Undercroft Approach / Keystone Door
11. `UND-02` Donovan & Sophia's Sealed Refuge
12. `UND-03` Voss's Ritual Chamber

**Important:** The specific assigned ownership pertains to these *base-map art targets* and their local scene-prep receipts. Centralized campaign quest/item/portal integration, final global consistency review, cross-scene keys and shared Foundry writes remain coordinated by **Chat A**. Do not both build the same Scene or modify the same Repo file concurrently. Chat B should persist scene-local work in uniquely named `prepares/`, `render-prompts/`, `render-attempts/`, `builds/` receipts; re-fetch each file SHA immediately before update; send its completed status/checkpoint back to owner/Chat A. No cross-chat automatic memory or implicit Bridge session is presumed.

## Exact mandatory visual example — use on every above-ground lodge RENDER

The **owner-approved H-G06 Great Room aged fifty years** is the binding image for authentic indoor abandonment and uniform neutral lighting **except the basement**. It is an actual image, not a prompt to re-create it:

- Read [locked owner-approved image specification](../visual-standards/approved-50-year-abandoned-lodge-interiors-hg06-reference-2026-10-23.md).
- Original Foundry Data image: `Maps/cabin-in-the-ashen-veil/h-g06-great-room-aged-fifty-years-approved-2026-10-23.png`.
- Original file: `abandoned_manor_great_room_map.png`, generation `602b78d7-a171-4bc4-a5ed-02ada4f82be8`, **1199×1312 PNG**, **3,239,365 bytes**, SHA-256 **`1835cc734ad75fb7d4b0eb8ca441f5d3f78d6f075d9797a4e2b33a412db2ddbe`**. The owner's re-encoded copy is pixel-identical but hashes differently, so use the original as byte-canonical.
- When doing image generation, **visually provide/show the accepted Great Room image as a reference** when available and apply only its camera/material age/palette/neutral exposure. For any fresh chat lacking the actual image file, first retrieve the exact file via the authorized Foundry host or ask the owner to attach the existing accepted Great Room picture. Do **not** claim to have consulted a visual image when only reading its written receipt. **Never substitute its room geometry, clock, hearth or sofa** into another room.
- Outside/roof/Undercroft/Attic/other area scenes follow their specific PREPARE visual contracts, with the H-G06 reference applied as appropriate to above-ground interior finish. **Basement** is an explicit exception to the Great Room art-style requirement: use its own PREPARE and approved basement/engineering aesthetic, not forced domestic herringbone or candles.

## Hard per-turn workflow (copy into helper chat startup)

Each image-generating assistant turn must:
1. **Reread its room's latest PREPARE**, canonical House Layout v2, puzzle specs and superseding owner decisions **before every render**; check exact entrances, neighbors, hidden state, permanent fixtures and item/quest sequence. The old register's per-card statuses are stale; recent final PASS receipts override them.
2. Write a **completely NEW self-contained prompt** derived from source canon, with **ONLY desired, positively described visible imagery**. Explicit owner injunction: **“Never mention anything you don't want visually seen in the image.”** Abandon the old rejected renderer prompt/image as an authority. If a near-pass example is useful, pair it with actual H-G06 aged reference *for visual arrangement only*, never inherit a wrong door or secret.
3. **Render exactly ONE image maximum in that turn. Never generate or edit a second image in the same turn.** The next visual attempt requires a distinctly initiated next turn. An image edit counts as the one image render. Do the actual image's **INSPECT in that same turn**; if interrupted after generation, resume inspecting the exact image without rerendering.
4. **Hard art checks:** accurate walls/doors and room identity, main recognizable puzzle features at tabletop scale, accessible paths, exact owner-hidden secrets, 50 years of visible dust/webs/worn/tarnished/faded material for above-ground lodge, and **even neutral diffuse ambient base lighting** (Foundry handles actual light-source dynamics). **Aged does not mean every furnishing must be destroyed**—intact but demonstrably neglected furniture is acceptable. Minuscule details (Rufus's two missing eye sockets, hidden fasteners, small buttons) belong to Investigation/RegionBehavior text; don't repeatedly FAIL image art for pixels too tiny to read.
5. The owner has delegated **final art PASS/FAIL** to the assistant. After inspection save exact generation ID, image, dimensions, byte length/SHA256 if possible, prompt, story gates and verdict in versioned chronological receipts; archive exact artwork in owner-connected Drive approved/unapproved folders. **FAIL art is never installed in Foundry.** An art PASS is not native gameplay implementation or playtest.
6. Keep each work turn bounded to **20 minutes** and save the work before it ends. At the end, follow the explicit *current* verified Dicebox Bridge/Foreman session contract if one applies; do not blindly replay messages or assume a new helper chat inherited the old exact endpoints. Owner's previous continuation text, where lawfully routed, was “Turn done, please send continuation prompt”. Do not send a chat acknowledgement to Codex unless directly requested by the applicable routing contract.
7. For scene creation use the Dicebox **PREPARE → RENDER+INSPECT → BUILD → STAGE → INJECT → VERIFY → RECEIPT** progression. The owner has approved broad Foundry work, but **do not overwrite owner-made Walls and Regions**; use one unique Scene for each enclosed house room. Use verified world/version/elected GM, source image SHA and no-write preflight before any native mutation. Use GM-authoritative **RegionBehavior scripts** for player interaction (not player Macro permissions); actual non-GM test token/canaries and private player-visible text where appropriate. General hints are overhead token/thought bubbles, not shared chat leakage; action choices may use chat cards.

## Current build blockers and already-approved art to preserve

- **H-U07 Dahlia's Studio V017**: image visually PASS; source SHA-256 `67c9e5c84ff120d65600648ddb014e30a00f1ec6226c6e309e994db54aab4704`, original archived private Drive `1fk1B0uLessRYczAj9XV7y9v7z77HpksY`; the exact approved PNG **IS staged and HTTP hash-verified** on Foundry host at `Maps/cabin-in-the-ashen-veil/h-u07-dahlia-art-studio-approved-v017-2026-10-24.png`. GM-only image-only installer source at [H-U07 build](../builds/H-U07-dahlia-art-studio-v017-background-only-build-v001.md). Native Scene creation was **blocked by unauthenticated Foundry `/join`** in isolated CFT Dev browser; do not claim it exists or duplicate it.
- **H-G05 Allen's Study V003**: image visually PASS under owner's latest scale-aware and aged-but-preserved rules, source SHA-256 `c3ec08180f80d5d6304824840029bf46e4785d6ac95e01e2c0b43c32a02bd5a4`, original archived private Drive ID `17NFBP_74FEHdfp531ystCwp_-gQ_j9if`. **Not yet staged as Foundry Scene**. Eye sockets should be revealed later by Investigation text and the eye/jaw/source mechanism implemented faithfully, not demanded in the raster.
- The latest **21/45** number is **approved base-art only**, not the count of installed game Scenes or verified puzzle functionality. Earlier 19/45 and 20/45 receipts are historical. H-G02 and H-G06 were approved earlier. Keep approved images immutable.
- Global puzzle dependency names: Brass Study Key opens both H-G05 doors, Allen's `587` points to Donovan's Shack; Sophia's bear eye and Gazebo lantern eye fit Rufus and unlock his jaw/source; Studio's Ornate Mirror leads to keys and two distinct Sune prayers have separate rewards; upper Landing controls attic hatch/ladder, attic components/rewards lead roof clock; Basement engineering/Keystone and Undercroft finale are LOCK-gated. Don't reveal final puzzle secrets on public map art.

## Chronological handoff and completion

Both chats should keep a distinct per-Scene status ledger `PREPARED | RENDERED | INSPECT_PASS/FAIL | ART_ARCHIVED | BUILD_READY | STAGED | INJECT_VERIFIED | PLAYER_PLAYTESTED`. At each checkpoint record the exact image SHA, approved version, scene ID if installed, and cross-scene dependencies. Do not treat shared GitHub commits, private Drive archive, live Foundry data, and player testing as interchangeable evidence classes.

**Chat A next:** begin `H-G01` Dining, then Kitchen `H-G03`, Pantry `H-G04`, Rear Family `H-G09`, Upper Landing `H-U02`, and remaining assigned rooms. Separately resolve existing H-U07/H-G05 approved-art native installation when GM authenticated.

**Chat B next:** start with `EXT-04` Privy if desired for a short test of process, then the attic suite `H-A01→H-A02/A03/A04`, roof `H-R01`, basement `H-B01→H-B03→H-B02`, and Undercroft `UND-01→UND-02→UND-03`. No owner decisions on physical scale or unsupplied secret-state geometry should be fabricated. Final global integration and cross-scene interaction ownership stays with Chat A.
