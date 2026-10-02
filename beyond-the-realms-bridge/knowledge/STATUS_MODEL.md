# Status Model

These labels are intentionally non-interchangeable:

- `RUNTIME_CONFIRMED` — observed working in the target Foundry runtime.
- `PACKAGE_READY` — built and statically validated, but not live-confirmed.
- `PENDING_RUNTIME_TEST` — requires live Foundry validation.
- `EXPERIMENTAL` — design or adapter not promoted to the canonical schema.
- `FAILED_SUPERSEDED` — known failed approach with a documented replacement.

This bridge also uses `CARRIED_HANDOFF` when a claim is preserved from a
provided BTR handoff but has not been independently re-observed by this local
workspace. `CARRIED_HANDOFF` never upgrades or downgrades the source handoff's
own BTR status; it records this bridge's evidence boundary.
