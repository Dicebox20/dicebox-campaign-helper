# ADR-0003: Read-only Runtime Probe and Diagnostics Surface

Status: accepted for the M1/M2 implementation slice.

## Context

The module must learn the exact Foundry/system/module environment before any semantic plan can be promoted to a world operation. Documentation and source/API existence are not live capability evidence, and a module import must not accidentally touch world state.

## Decision

The Foundry package will schedule a read-only probe at `ready`. The probe records the Foundry version, system identity/version, active module IDs, document type surface, and conservative capability states. It publishes a frozen `game.diceboxCampaignHelper` diagnostics API only when the property is not already owned by another runtime object.

`foundry.document.write` remains unavailable. Active-GM election and D&D5e Activity hook behavior remain `unknown` until exact-stack fixtures exercise them. The TypeScript bridge mirrors the same profile and readiness gate for host-side tests.

## Consequences

- The package advances beyond a no-op import while preserving the no-world-mutation M0 safety boundary.
- Capability snapshots become evidence inputs for later adapters instead of implicit permission to write.
- The exact Foundry 14.367 / D&D5e 5.3.3 probe and two-client authority fixture remain required before M3.
