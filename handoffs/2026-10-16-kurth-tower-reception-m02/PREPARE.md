# Kurth Tower Reception — M02 of 6 — PREPARE

**Stage:** PREPARE_DRAFT_REVIEW, not geometry-approved. **Date:** 2026-10-16. **Scene key:** `dbx.heist.kurth.m02.reception`.

## Canonical heist continuity

M01 The Dark Arch → **M02 Kurth Tower Reception (Sarmenti)** → M03 Security Machinery (Grimgor) → M04 Luminary Cipher, 5×5 Lights Out (Sir Toppleton) → M05 Oathbound Chamber (Lurfaenelynn) → M06 Inner Vault (Glow). M01 highlighted Usagi.

The objective is to steal an **as-yet unnamed vault treasure** from Kurth Tower on Closeguard Island in Luskan, within Ship Kurth/Bregan D'aerthe territory, in an Acquisitions Incorporated comedy-heist setting. Six PCs travel with James Winifred “Jim” Darkmagic III, a witty non-mechanical guide; he cannot automatically solve encounters, fight, or appear as painted/token artwork. There are no automatically placed guards. This is a user-authorized continuation from M01, not a new campaign.

**M01 is user-reported working well enough to use.** Record that disposition, but runtime VERIFY/READY-to-PLAY evidence remains open. M01 downstream transition UUID is not verified.

## Scene function and dimensions

A busy ground-floor tower reception, naturally entered after M01's postgate island approach. **Sarmenti's moment** is a credential/authorization obstacle supporting bluffing, impersonation, forged paperwork, negotiation and manipulation, while preserving alternative physical approaches for other players. A failed dialogue never permanently softlocks the party.

- **Map:** 40×24 logical 5-ft spaces = 200×120 ft, Gridless, 120 pixels per 5ft, 4800×2880 pixels, zero padding.
- **Camera:** strict perpendicular 90-degree orthographic overhead; no tilt or horizon.
- **West/left:** one clear M01 arrival vestibule with a safe six-character staging surface.
- **Center:** broad visitor hall, brass-and-wood counter, roped queue, paperwork desks and a visible guarded screening line.
- **North:** permit registry, clerk archive and inspection back passage leading to the secured side.
- **South:** delivery/receiving alcove and service door, staff corridor and separate stair connecting to secured side.
- **East/right:** post-checkpoint vertical circulation vestibule with restricted lift/stair to M03 Security Machinery.
- **Art:** wet Luskan stone, dark timber, brass lamps and fixture details; humor from officious décor and impractical queue furniture, not player-facing text.

No NPCs, readable labels, painted measurements, grid, character tokens, moving hazards, or active construct enemies baked into artwork. Abstract heraldic shapes and inert construct alcoves are optional stationary décor; threats require separate GM-owned runtime Actors/Tiles.

## Conceptual floor plan (NOT an accepted Spatial Blueprint)

```text
NORTH
┌───────────────────────────┬────────────────────┬──────────────┐
│ Permit registry / records │ Inspector passage  │ Restricted   │
│ office, desk and ledger   └─────────────┬──────┤ stair / lift │
├───────────┬─────────────────────────────┤      │ to M03      │
│ M01       │ Main reception & queue      │Guard │            │
│ vestibule │ public counter / visitor    │line  │            │
│           │ hall                        │      │            │
├───────────┴────────────┬────────────────┴──────┤            │
│ delivery receiving     │ south staff/service hall → secured │
│ alcove                 │ stair and vertical vestibule       │
└────────────────────────┴─────────────────────────────────────┘
SOUTH
```

## Three required continuous routes (author and prove at GEOMETRY)

1. **Public credentials:** M01 arrival → visitor hall → credential counter → guarded screening line (15-ft intended opening) → post-checkpoint lift/stair → M03. Minimum 10-ft clear Large footprint across this primary route; reception circulation preferably 15–20ft.
2. **Staff logistics:** M01 arrival → hall → receiving alcove → staff door → southern back-of-house passage → **post-checkpoint** staff stair/vestibule → M03. Medium 5-ft minimum, prefer 10ft; door access may require disguise, stealing a key, force or distraction.
3. **Inspector records:** M01 arrival → hall → permit office → north back passage → **post-checkpoint** restricted access → M03. Medium 5-ft minimum, prefer 10ft; no invented Region teleport.

All side routes must terminate on the secured side of the central screening barrier, not loop only to public reception. Exact doors, widths, elevations, obstacles and swept token footprints are pending deterministic geometry tests. Violence or brute force through the guarded main line is a GM-adjudicated method of route 1, not a required fight.

## Credential mechanic — design proposal, not locked puzzle canon

The visitor-facing authorization procedure checks three understandable fields: **visit purpose, authorized sponsor, and entry clearance**. Sarmenti can deceive, bargain, impersonate, borrow or forge authorization; other PCs can provide distractions, overhear clerk dialogue, inspect books, handle physical passage or solve administrative inconsistencies. Aim for roughly three to five meaningful exchanges, **not** 3–5 mandatory rolls. No specific password, fixed answer, unapproved skill DC, or arbitrary mandatory card matching.

GM-controlled security posture may progress **Quiet → Suspicious → Alarm**. Failure can cost time, increase scrutiny, close a door or summon GM-chosen guards, but must not automatically end the heist. A call bell, inactive sentry plinth and off-map barracks access can supply environmental affordances; automated patrols/reinforcements are out of scope.

## Planned Region and runtime ownership

- `dbx.heist.m02.arrival.reception` — hidden GM-owned arrival area for M01.
- `dbx.heist.m02.check.credentials` — guard/reception approach cue; no forced automatic skill checks.
- `dbx.heist.m02.access.staff` — staff threshold cue; no duplicate spam.
- `dbx.heist.m02.transition.security-machinery` — **M03 exit only after the secured-side landing**.

All Regions are *proposals*: position, size, UUID, script/behavior and precise destination remain unresolved. **Discovery count 0**. Administrative clues are regular visible objects/roleplay, not chance-based hidden discovery Regions. The GM supplies guards/Jim if desired; no baked actors, no mandatory NPC count.

Walls, doors, vision/lighting logic and Region behaviors belong to native Foundry documents and verified adapters. Purely static furniture may be included in art; any actively movable/usable prop must not also be baked into the art.

## Required scene-creation gates

**PREPARE (now):** Lock intended spaces, entrances, secured exit, three functional routes, clearance, actors/props and restrictions. This is a design draft awaiting review.

**GEOMETRY AUTHOR → INSPECT:** Author typed Spatial Blueprint polygons/doors/walls with stable IDs, 10-ft primary route and 5-ft side clearance, actual post-screening endpoints, and independently validated all-route reachability. Geometry preview is not artistic map artwork.

**EMBOSSED GRAYSCALE RENDER → STRUCTURAL INSPECT:** strict overhead grayscale 3D structural form; reconcile static features with the Blueprint, never infer Walls from pixels.

**STRUCTURAL BUILD → PAINTERLY RENDER → FINAL INSPECT:** build offline walls/regions from grayscale-approved geometry, then render painterly background; FINAL_INSPECT PASS approves the exact painted art.

**FINAL INJECTION ASSEMBLY → STAGE → INJECT → VERIFY → RECEIPT:** canonical **one Markdown, one self-contained JS macro**; Foundry world auto-detected through `game.world.id` (not retyped), exact active-GM and runtime checks, one native preview, no writes on cancel, upload verification, authoritative Scene/Level/Wall/Region reread and runtime movement canaries.

## Unresolved before next gate

M01→M02 and M02→M03 Region UUID/bindings, exact credential rule content, any guards and the treasure identity are **not yet verified**. The current product active-stage checker still reports a retired O-112 fixture failure; no product-stage promotion is claimed. No Foundry world modification is authorized by this PREPARE.
