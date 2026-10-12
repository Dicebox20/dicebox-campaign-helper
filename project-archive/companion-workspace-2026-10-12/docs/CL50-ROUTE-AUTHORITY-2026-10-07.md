# CL-50 known-route binder — authority matrix (2026-10-07)

**Live certified baseline:** 21 Scenes / 202 Regions / 115 RegionBehaviors / 33 canonical Items. Foundry 14.367 / dnd5e 5.3.3. Kernel SHA `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`. Ledger revision 0.

## Verified named edges

| Origin | Destination | Evidence | Implementation | Status |
|---|---|---|---|---|
| F1 inner threshold `iuoEHBXWtXgzYmMh` | F2 arrival `pplHOCmUZOqFymOy` | Explicit destination UUID in existing live F1 behavior | `FElgIMZFVX5GleSy` pre-existing | Source-present, no gameplay canary |
| T3 ancient passage mouth `Tkg7XpsF7X1P3ZVJ` | F1 `t3-arrival` Region `zKNU1R3JGIMMt017` | F1 Scene flag says T3 arrival anchor created; exact Region stableId `dbx:central-lodge:f1:region:transition:t3-arrival` | `tSqhDN5CtAHzccmf`, SHA `c179ae83855e6eb136a1225bfbb882ab9c6b7bcd3f0773df3654f82b2b23d6cb` | PREVIEW, 8/8 mock, guarded APPLY, independent FINAL VERIFY PASS |
| T3 N3 branch mouth `YElrtisbXN3DJ2Sw` | N3 Branch Railway `RP1jYOH738xl9hks` | T3 mouth already names N3 Scene stableId; N3 branch Region exact stableId | `pZpcYXFn517t6L5U`, SHA `051c669835aaed94f0497ebe6e54590d37df97eceb271b611b0263ca95b8f963` | PREVIEW, 8/8 mock, guarded APPLY, independent FINAL VERIFY PASS |

The two new T3 exits require primary GM confirmation. They are one-way safe slices; do not add reciprocal arrival-on-enter behaviors that bounce tokens indefinitely. F1→T3 return remains unbound and requires explicit design. No live player canaries were conducted.

## Unresolved route questions

- T1 Mouth A/B candidates N1/N2, but entrance orientation not authorized; no destination binding.
- T2 Mouth A/B candidates N2/N3, orientation not authorized.
- N3→T3 requires `puzzles.n3.t3BranchUnlocked` semantics and the cartography/switch state policy; do not invent it or change the flag from false.
- Other 21-scene travel anchors (exits, stairs, service/crypt/chapel entrances) were counted in the CL-50 global source scan but are not automatically authoritative destination pairs. Match to geospatial authored source before implementing.
- CL-51 global night trigger undecided, 86 lights all hidden; do not blanket-toggle lighting.
- CL-52 horror/story pacing and CL-90 final runtime QA remain pending.

## Additional QA

CL-90 preparatory read-only audit `cl90-preaudit-readonly-v001.page.js` PASS_WITH_DEFERRED_QA; 115 enabled, nonempty behavior sources and 115 unique stable IDs confirmed by independent `cl90-stableid-coverage-readonly-v001.page.js`. Eight Tokens are placed across the Lodge. This is not final gameplay audit.

CL-51 light inventory `cl51-lighting-inventory-readonly-v001.page.js` saw 86 AmbientLights / 86 hidden, F1/F2 14 explicitly grouped; 72 remaining ownership markers were not established by the lightweight classifier. A missing flag is not proof of foreign ownership. Night trigger not selected.

**Next work:** Continue CL-50 with evidence-backed route matrix, controlled canary plan, and CL-51 explicit GM trigger choice/fixture ownership reconciliation. Do not repeat completed CL-33/CL-40/CL-50 safe-slice installers.
