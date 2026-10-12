# CL-50 railway mouth route proposal — live metadata + visual audit
**Work unit:** central-lodge-cl50-route-image-and-flags-v001
**Date:** 2026-10-07 PDT
**Status:** READ-ONLY SOURCE AUDIT PASS; LIVE ROUTE PAIRING NOT AUTHORIZED. No Foundry writes, no Macros executed, no Bridge communication.

## Governing evidence
- Existing canonical KB locked facts `F-2026-10-06-CENTRAL-LODGE-UNRESOLVED-GLOBALS` and `F-CATALOG-UNRESOLVED` explicitly say **T1/T2 mouth A/B orientation is unresolved and must not be guessed**.
- `docs/CL50-ROUTE-AUTHORITY-2026-10-07.md` carries the same limitation. It predates some newer installed behaviors/ledger changes, so use the latest real-time read-only smoke for counts.
- Fresh `database/verify_database.py`: integrity ok, gate CL-50, 21 Scenes / 202 Regions / 116 behaviors / 33 canonical Items.
- Fresh `cl90-progress-safety-smoke-v003.page.js` in exact Foundry world `the-lost-mine-of-phandalin` v14.367, dnd5e 5.3.3: PASS_WITH_KNOWN_BLOCKERS, zero failures, 116 enabled RegionBehaviors, ledger revision 1, kernel SHA `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`.
- New independent no-write page `work/foundry-playwright-harness/cl50-successor-route-metadata-v001.page.js` returned PASS and captured five exact Scene identities, entry Regions, scene route flags, and all associated background paths.
- Remotely read and visually inspected the original five installed Scene background WebP files under `FoundryVTT/Data/worlds/the-lost-mine-of-phandalin/assets/central-lodge/{n1,t1,n2,t2,n3}/`. Each shows a continuous left/right track, with T2 curving; N3's southern spur branches separately. This confirms physical placement only, not narrative endpoint identity.

## Candidate west-to-east topology — NOT accepted/bound
| From Scene / Region ID | To Scene / Region ID | Why a candidate | Authority |
|---|---|---|---|
| N1 East `xsitdXO94BHJkYKX` | T1 Mouth A `ewIAYppRLvgIV1b7` | N1 east track meets T1 left track in a possible forward layout | HYPOTHESIS ONLY |
| T1 Mouth B `91XmuJ9LGbsJY52W` | N2 Tunnel A `lYps0Z5806d0W8wX` | T1 right track and N2 left track appear continuations | HYPOTHESIS ONLY |
| N2 Tunnel B `shIAThge7cNy0JjT` | T2 Mouth A `3OGR0atcJokXJo6b` | N2 east track and T2 left tunnel appear continuations | HYPOTHESIS ONLY |
| T2 Mouth B `OOmnx3XAmw95E410` | N3 West `foYsFHsLXtCbfiyR` | T2 right track and N3 west track appear continuations | HYPOTHESIS ONLY |

Reciprocal traversal is a separate behavior-design decision, **not implied** by this candidate table. N1 West `h0rAVwjsaVkKLQBa` and N3 East `DfZRIL6d6onjWFAc` are not assigned destinations here. Existing T3→N3 branch travel targets N3 Branch Railway `RP1jYOH738xl9hks`, a distinct southern mouth, and must be preserved.

## Exact Foundry scene flags
- T1 Scene `ImeIdHbYb6kZKAdt` holds `flags.world.dicebox.route.topology="single-track-through-tunnel"`, `terminalA=null`, `terminalB=null`, `candidates=["dbx:central-lodge:n1","dbx:central-lodge:n2"]`, `orientationStatus="UNBOUND_DO_NOT_GUESS"`. Both transition mouth Regions have `destinationStableSceneId=null` and no RegionBehaviors.
- T2 Scene `ez9MSQ8QIO4cW6zo` similarly holds `topology="single-track-through-maintenance-tunnel"`, null terminals, candidates N2/N3, and `orientationStatus="UNBOUND_DO_NOT_GUESS"`. Both mouth Regions have no destinations or RegionBehaviors.
- N1 `MAbLfBqG7qIVVuLN`, N2 `4pc5akMBieHU7GvV`, and N3 `pHQvDUDlyWZFuNrX` currently retain railway Region anchors without travel behavior on the relevant west/east tunnel mouths.

## Implementation constraints after approved authority
1. Obtain an accepted exact map-to-map orientation decision, keyed by the above Scene and Region stable IDs. Don't promote inferred art orientation as story canon.
2. Record accepted change in roadmap/active checklist and reconcile/rebuild/verify `database/seed.sql` before writing any guarded live handler.
3. Preflight selected landing placements against physical track, Walls, Tokens, and all transition/horror/puzzle Region overlaps. Teleporting into the next active entrance Region could create a bounce; don't reuse `teleportToken(...,{placement:"random"})` blindly for two-way links.
4. Preserve primary-GM manual confirmation, player-scoped move, declines/cooldowns, no ambiguous double-trigger, exact world/version/stable-ID/source-hash guards, no item/ledger/light/foreign-state changes. Guarded PREVIEW; then at most one authorized live APPLY per unit; independent reread; finally GM+player traversal canary at the actual destination.
5. If no authorized orientation exists, **STOP**, keep T1/T2 route flags unchanged and manual GM scene navigation available. No guessed or blanket migration.

## Work unit disposition
Research audit complete. Proposed four connections are deliberately not committed or adopted into canonical KB. Existing installed T3→F1, T3→N3, and E1→M1 remain unaffected. CL-52 M1/M2 one-shot playback still requires primary GM and a real player client. The previous canceled Region deletion stays canceled.

**Next action:** request an exact primary-GM/author decision on the four candidate pairings or locate a superior authored topology source. Only then design a no-bounce landing/consent PREVIEW, not live APPLY.
