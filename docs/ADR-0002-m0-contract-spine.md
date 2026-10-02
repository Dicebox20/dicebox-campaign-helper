# ADR-0002: M0 Contract Spine and No-Op Foundry Package

Status: accepted for M0.

## Context

The foundation requires a repository boundary that can be tested before an exact Foundry 14.367 / D&D5e 5.3.3 runtime is available. Stable DiceBox identity must remain distinct from Foundry bindings, and an unprobed runtime must not be treated as ready.

## Decision

M0 is split into four packages: core contracts, a runtime-neutral compiler, a readiness-gated bridge, and a Foundry package. Core owns canonical IDs, schemas, capability/result/receipt types, target versions, and read-only knowledge-base source metadata. The compiler may describe only validated semantic plans. The bridge exposes describe/supports/query/health contracts but returns `NOT_READY` for execution and binding resolution. The original M0 Foundry bootstrap loaded as an isolated ES module and performed no world mutation.

Runtime names, document IDs, and UUIDs are represented only as `RuntimeBinding` data attached to a `SemanticRef`; they cannot serve as semantic identity. The local SQLite knowledge base remains a reproducible, read-only development source.

The original M0 bootstrap was side-effect-free. ADR-0003 supersedes that import-time detail for the M1/M2 slice: the module may schedule a read-only probe at `ready` and expose diagnostics, but it still performs no world mutation and keeps write capabilities unavailable.

## Consequences

- M0 can prove contract and packaging boundaries without claiming live Foundry evidence.
- Later adapters must be added behind exact-version capability discovery and readiness gates.
- No raw document patch type, arbitrary code execution path, or public execute-as-GM surface exists in this skeleton.
- The M0 gate must pass before document mutation, campaign compilation, live sync, or automation work begins.
