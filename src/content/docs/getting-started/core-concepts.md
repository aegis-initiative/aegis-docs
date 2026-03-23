---
title: Core Concepts
description: Understand the foundational concepts of AEGIS -- governance runtime, capabilities, policies, risk scoring, and audit.
---

# Core Concepts

AEGIS is built on a set of interlocking concepts that together provide deterministic governance over AI system actions. This page introduces each concept and how they relate.

## Governance Runtime

The governance runtime is the central enforcement layer in the AEGIS architecture. It receives action proposals from AI systems, evaluates them against registered capabilities and active policies, and returns a deterministic decision.

The runtime is **not** a model -- it does not learn, predict, or use probabilistic reasoning. It executes explicit rules deterministically:

- Same request + same policies = same decision, every time
- Failures result in denial, never implicit approval (fail-closed)
- Every decision is fully attributable and auditable

The runtime can be self-hosted or accessed as a managed service via the [AEGIS platform](https://aegissystems.live).

## Capabilities

A **capability** is a named operation that an AI system may be authorized to perform. Capabilities are registered in a structured registry before they can be used.

Examples of capabilities:

- `database.query` -- Execute a read-only database query
- `email.send` -- Send an email message
- `infrastructure.deploy` -- Deploy a service to production
- `file.write` -- Write to the filesystem

Capabilities follow a **default-deny** model: if a capability is not explicitly registered and granted to an actor, any action referencing it will be denied.

## Policies

**Policies** are the rules that determine when and how capabilities may be exercised. They are written in an unambiguous, deterministic policy language -- not natural language, not learned models.

A policy might specify:

- Agent `agent-001` may use `database.query` only during business hours
- Any `infrastructure.deploy` action requires `REQUIRE_CONFIRMATION` if targeting production
- `email.send` is denied for all actors when the recipient count exceeds 100

Policies are evaluated in a deterministic order with explicit precedence rules. There are no hidden decision paths.

## Risk Scoring

Every action proposal receives a **risk score** computed from deterministic algorithms. The risk score considers:

- The inherent risk level of the requested capability
- The context of the request (time, frequency, target environment)
- The trust level of the requesting actor
- Historical patterns for the actor and capability

Risk thresholds are configured per policy. An action that falls within acceptable risk proceeds to policy evaluation; an action that exceeds the threshold is denied or escalated regardless of policy.

Risk scoring uses deterministic algorithms -- no randomness, no learned models. The exact computation path is captured in the audit trail.

## Actors

An **actor** is any entity that proposes actions through AEGIS. Actors are authenticated and typed:

| Actor Type | Description |
|---|---|
| `ai-agent` | An autonomous AI system |
| `ai-copilot` | An AI assistant operating alongside a human |
| `automation` | A non-AI automated process |
| `human` | A human operator (for governance-wrapped manual actions) |

Every request must include an authenticated actor identity. This enables complete attribution -- every governance decision can be traced back to the entity that requested it.

## Audit Trail

AEGIS maintains an **immutable audit log** of every governance decision. The audit trail captures:

- The full action proposal (actor, capability, parameters, context)
- The policies that were evaluated
- The risk score computation
- The final decision and reasoning
- Timestamps and cryptographic integrity markers

Audit logs are append-only and hash-chained to prevent tampering. They are designed to satisfy compliance requirements (SOX, HIPAA, and similar frameworks) and support forensic analysis of incidents.

## The Governance Protocol (AGP)

The **AEGIS Governance Protocol (AGP-1)** is the wire protocol that standardizes communication between AI systems and the governance runtime. It defines:

- How actions are proposed (`ACTION_PROPOSE`)
- How decisions are returned (`DECISION_RESPONSE`)
- How execution results are reported (`EXECUTION_RESULT`)
- Authentication, message formats, and error handling

For the full protocol specification, see the [aegis-governance repository](https://github.com/aegis-initiative/aegis-governance/tree/main/aegis-core/protocol).

## How It All Fits Together

```
AI Agent
   |
   v
ACTION_PROPOSE (via AGP-1)
   |
   v
AEGIS Governance Runtime
   |-- Capability Authorization: Is this capability registered? Does this actor have it?
   |-- Policy Evaluation: Do active policies allow this action in this context?
   |-- Risk Scoring: Is the computed risk within acceptable thresholds?
   |
   v
DECISION_RESPONSE (ALLOW / DENY / ESCALATE / REQUIRE_CONFIRMATION)
   |
   v
Audit Log (immutable, hash-chained)
```

## Next Steps

- [Architecture Overview](/architecture/) -- See the full system architecture
- [AGP-1 Protocol](/architecture/data-flow/) -- Understand the governance protocol in detail
- [Quick Start](/getting-started/quick-start/) -- Try it yourself
