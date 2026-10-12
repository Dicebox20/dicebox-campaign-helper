# CL-33 — T1/T2/T3 Canonical Item Migration Design v001

Status: **prewrite reconciliation BLOCKED_DEPENDENCY**. This is a design and no-write evidence document, NOT an APPLY authorization or live runtime proof.
Captured: 2026-10-07, Foundry 14.367, dnd5e 5.3.3, world `the-lost-mine-of-phandalin`.

## Ground truth and hard guards

- Independently verified live global baseline: 21 scenes / 202 Regions / 112 RegionBehaviors / 33 canonical Items.
- Shared kernel: `Macro.FHQiFYx6OntZVo9d`, SHA256 `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`.
- State Journal `xhlXv6CCH34HVga3`, revision 0, notices empty, all three involved Items unrecovered.
- T1: `ImeIdHbYb6kZKAdt`, 6 Regions / 2 legacy behaviors, geometry `af259bcba633d5c90822622b3090c70b7e0ea5d1d0bce856554f0c9f578c22bd`.
- T2: `ez9MSQ8QIO4cW6zo`, 6/3, geometry `a1533208d558f2a88a1ea68c427b632dde511a03accfb779c569b095563ad84f`.
- T3: `aIKQmFiuXWipEdyb`, 6/3, geometry `e372066d468469936ce90a6065a567c0dff0d8fff6d5a48fb07404e1e0ceeead`.
- Read-only legacy-state audit: 2,392 game Actors examined, **no recovered Actor flags or embedded canonical Item copies**. No placed tokens in T1/T2/T3. No gameplay canary conducted.

## Exact mismatches

| Scene | Live Region / Behavior | Existing code SHA256 | Item | Failure |
|---|---|---|---|---|
| T1 | `4faM8b9bJkKVYGjL` / `uIUnGXarsob4WQub` | `2424223932f3f85f200909df4e5b8cf17576cd2e74723394e3e52b2457fe77f7` | Wing III `6FS6ydZku6EJSpF2` | Hidden DC8 notice updates Token flags but never grants canonical Item or ledger recovery. |
| T2 | `vmWCcb1mGibdl5Xv` / `6s7f7pxMVLNNRBZR` | `97ed0a14c13d0fa1f2b734216366fe3a9eb3397da8310151ba41ec5aca25c054` | Railway Switch Wheel `JrDy7pZP0QkLWaFy` | Confirmation writes Actor flag `centralLodge.railwaySwitchWheel`; N3 socket expects canonical embedded Item. |
| T3 | `0105bbMLlC1Inzhb` / `sY1XXM7Xz6Jj9gmR` | `25a3b32572e3fce1b080f95153def4e7c635d431987f3427e0efb18b1e212367` | Recent Route Fragment `pCRasmemswNMNrEX` | Confirmation writes Actor flag `centralLodge.routeOverlay.recentRouteFragment`; N3 overlay socket expects canonical embedded Item. |

Old T1/T2/T3 behaviors are live, so **do not duplicate them blindly or rerun scene builds**.

## Migration contract to design and PREVIEW

1. Preserve authored discovery and user consent: Wing III hidden Notice DC8, player-directed search/fallback recovery; T2/T3 dialogs with Leave/Take; failure/cancel always retains the physical pickup. Do not auto-award Wing III just for walking through its Region.
2. For each successful pickup, use the canonical `dbx:central-lodge:item:...` world Item as a controlled Actor embedded copy with appropriate provenance, and record `state.items[itemKey].recovered` in the canonical ledger only after confirmed grant.
3. Resolve the **primary active GM vs event.user execution contract**. Shared kernel `runPickup` returns `IGNORED_NON_PRIMARY_GM` on nonprimary clients; legacy code runs when `game.user.id === event.user.id`. A simple replacement with `k.execute(... pickup ...)` could silently fail, especially on player/client movement. Test authoritative routing before writing.
4. Enforce idempotency across concurrent clients/reentry. Require explicit exact state/Item checks, expected source hashes, geometry/kernel/ledger guards, no hidden duplicate grants and a clean rollback strategy for partial Actor-Item/ledger failures.
5. Prefer in-place updates of T2/T3 owned RegionBehaviors only after a certified migration PREVIEW and before/after hashes. T1 likely needs a separate recovery behavior or a carefully gated in-place composite; decide only after documenting the discoverability and no-softlock path. Count is **not** preauthorized to change from 112.
6. Preserve T3 invocation scrap behavior and older narrative observations until their own audited migration; avoid merging unreconciled `t3BranchUnlocked` semantics.
7. Do not bind T1/T2 mouth orientations from candidate names. T3 ancient far destination is null. N3 branch unlock remains false and unresolved. Transitions are CL-50 work. Lighting requires CL-51 explicit trigger and stays untouched.
8. Build PREVIEW with exact code hashes and noWrite true, then guarded APPLY, independent FINAL VERIFY and a separate deliberately authorized gameplay canary. A source-lint-only PREVIEW is insufficient to prove GM routing.

## Downstream F1/F2 context

- F1 `La9krMOMBhAhDLi6`, 6 Regions / 4 legacy behaviors, geometry SHA `6aa46295e7c4ba743246763116772ab67051de2ad7e9444012413922ffe714b5`.
- F2 `HWitOe1wSid7MZ1y`, 8 / 4, geometry SHA `b2001545ca35276b6a34799945e55f03648e326bd119f2f741619d9e5f6e2eca`.
- F1 Cicada Assembly currently searches participating PC character inventories by **item name**, including Wing III, and updates its Scene flag. Therefore a properly named canonical Wing III Actor copy appears compatible with its inventory check. Confirm that the recovered Actor is one of the PCs referenced by `user.character` before canary.
- Existing F1 → F2 transition destination is explicitly bound to `Scene.HWitOe1wSid7MZ1y.Region.pplHOCmUZOqFymOy`; do not replace it without evidence.
- F1/F2 still contain older Scene/Actor-flag logic not yet reconciled to central ledger; no runtime canary and no patch have occurred in this turn.

## Evidence files (read-only)

`tunnels-preflight-v001.page.js`, `tunnels-legacy-source-audit-v001.page.js`, `cl33-legacy-state-audit-v001.page.js`, `cl33-progression-migration-prewrite-v001.page.js`, `cl33-kernel-contract-audit-v001.page.js`, `cl40-cl41-readonly-intake-v001.page.js`, `cl40-cl41-semantic-contract-audit-v001.page.js` in `work/foundry-playwright-harness`.

Status at this checkpoint: CL-32 N3 **complete**; CL-33 read-only preflight **PASS** but code migration **BLOCKED_DEPENDENCY_RECONCILIATION**; F1/F2 intake **read-only**. Knowledge-base metadata and verifier gate: `CL-33 T1/T2/T3 Runtime Contract Migration PREVIEW`.
