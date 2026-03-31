---
title: Architecture Overview
description: System architecture of the AEGIS governance ecosystem -- how components fit together.
---

# Architecture Overview

AEGIS separates **AI reasoning** from **operational execution** through a governance mediation layer. This page provides
a high-level view of the system architecture and how components interact.

## Architectural Model

```
AI Agent
   |
   v
AEGIS Governance Gateway
   |
   v
Decision Engine
 +- Capability Authorization
 +- Authority Verification
 +- Risk Evaluation
 +- Policy Enforcement
   |
   v
Tool Proxy Layer
   |
   v
External Systems
```

This architecture ensures that **incorrect reasoning or adversarial manipulation cannot directly produce unsafe
operational outcomes**. The AI system never interacts with external infrastructure directly -- every action passes
through the governance gateway first.

## Key Components

### Governance Gateway

The entry point for all action proposals. The gateway receives AGP-1 protocol messages from AI systems, authenticates
the requesting actor, and routes proposals to the decision engine.

### Decision Engine

The core evaluation pipeline that determines whether an action should be allowed. It runs four checks in sequence:

1. **Capability Authorization** -- Is the requested capability registered in the system? Does the actor have a grant for
it?
2. **Authority Verification** -- Does the actor have the required authority level for this capability in this context?
3. **Risk Evaluation** -- Does the computed risk score fall within acceptable thresholds?
4. **Policy Enforcement** -- Do active policies permit this action given the full context?

If any check fails, the action is denied or escalated. All checks must pass for an `ALLOW` decision.

### Tool Proxy Layer

For approved actions, the tool proxy layer handles execution against external systems. It provides:

- Execution isolation (the AI system never has direct access)
- Result capture and reporting back through AGP-1
- Timeout and circuit-breaker protections

### Audit Subsystem

Every governance decision -- whether allowed, denied, or escalated -- is persisted to an immutable, hash-chained audit
log. The audit subsystem operates independently to ensure that governance failures do not compromise the audit trail.

## Platform Components

The AEGIS ecosystem is distributed across several repositories, each with a distinct responsibility:

| Component | Repository | Role |
|---|---|---|
| Governance Specs | [aegis-governance](https://github.com/aegis-initiative/aegis-governance) | Architecture, protocol (AGP-1), threat model, federation spec |
| Platform | [aegis-platform](https://github.com/aegis-initiative/aegis-platform) | FastAPI wrapper with governance and audit endpoints *(operator dashboard and GraphQL are not yet implemented)* |
| Client SDKs | [aegis-sdk](https://github.com/aegis-initiative/aegis-sdk) | TypeScript and Python client libraries |
| Operations | [aegis-ops](https://github.com/aegis-initiative/aegis-ops) | CI/CD pipelines, infrastructure-as-code, deployment configs |
| Constitution | [aegis-constitution](https://github.com/aegis-initiative/aegis-constitution) | Public governance charter |
| Documentation | [aegis-docs](https://github.com/aegis-initiative/aegis-docs) | This documentation site |

## Design Principles

The architecture is grounded in several non-negotiable principles:

- **Deterministic governance** -- Identical requests with identical policies always produce identical decisions
- **Default-deny** -- Absence of explicit authorization yields denial
- **Complete attribution** -- Every request includes authenticated actor identity
- **Immutable audit** -- Every decision is persisted permanently and cannot be modified
- **Fail-closed semantics** -- All subsystem failures result in denial or escalation, never implicit allow

For detailed exploration of each principle, see the [AGP-1 Protocol
Overview](https://github.com/aegis-initiative/aegis-governance/blob/main/aegis-core/protocol/AEGIS_AGP1_OVERVIEW.md).

## Next Steps

- [System Design](/architecture/system-design/) -- Detailed component design and interactions
- [Security Model](/architecture/security-model/) -- Threat model and security architecture
- [Data Flow](/architecture/data-flow/) -- AGP-1 protocol flow and message lifecycle
