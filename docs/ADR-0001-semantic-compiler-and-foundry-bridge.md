# ADR-0001: Semantic Compiler and Foundry Bridge

Status: accepted for M0.

## Context

DiceBox must turn campaign intent into Foundry content while preserving runtime state, permissions, foreign content, and exact-stack behavior. Direct player writes, untested macros, package drift, and image-first geometry create avoidable failures.

## Decision

DiceBox exposes semantic commands and queries through a readiness-gated bridge. The compiler creates typed plans; deterministic validators resolve capabilities, references, authority, scope, and ownership; Foundry adapters perform supported operations; receipts record read-back and recovery state.

The public bridge does not expose arbitrary document patches, raw sockets, live mutable Documents, generated executable code, or execute-as-GM. Native/declarative implementations are selected before optional modules or fixed adapters.

## Consequences

- M0 can be implemented and tested without meaningful world mutation.
- Exact Foundry/D&D5e/module calls remain isolated and versioned.
- Unknown runtime facts become capability probes and open work rather than guesses.
- The system requires explicit schemas and evidence, but avoids silent state corruption and permission failures.
