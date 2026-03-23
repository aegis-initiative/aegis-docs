---
title: Data Flow
description: AGP-1 protocol message flow and the lifecycle of a governance decision.
---

# Data Flow

This page describes the lifecycle of an action proposal as it flows through the AEGIS governance system, following the AEGIS Governance Protocol (AGP-1).

## Protocol Overview

AGP-1 defines three primary message types:

| Message | Direction | Purpose |
|---|---|---|
| `ACTION_PROPOSE` | Client to Server | AI system proposes an action for governance evaluation |
| `DECISION_RESPONSE` | Server to Client | Governance runtime returns its decision |
| `EXECUTION_RESULT` | Server to Client | Tool proxy reports the outcome of an executed action |

## Message Lifecycle

### 1. ACTION_PROPOSE

The AI system sends an `ACTION_PROPOSE` message to the governance gateway. The message includes:

- **Actor identity** -- Who is proposing this action (authenticated)
- **Capability** -- What operation is being requested
- **Parameters** -- The specific arguments for the operation
- **Context** -- Environmental information (timestamp, session, metadata)

```
AI Agent --> ACTION_PROPOSE --> AEGIS Governance Gateway
```

### 2. Governance Evaluation

The gateway authenticates the request and routes it to the decision engine, which evaluates the proposal through the full pipeline:

```
Authentication --> Capability Check --> Authority Check --> Risk Scoring --> Policy Evaluation
```

Each stage can independently deny or escalate the request. All stages must pass for an `ALLOW` outcome.

### 3. DECISION_RESPONSE

The governance runtime returns a `DECISION_RESPONSE` with one of four outcomes:

| Outcome | Meaning |
|---|---|
| `ALLOW` | Action permitted -- proceed to execution |
| `DENY` | Action forbidden -- do not execute |
| `ESCALATE` | Requires human review before proceeding |
| `REQUIRE_CONFIRMATION` | Requires explicit user consent |

The response includes:

- The decision outcome
- Reasoning (which policies matched, what the risk score was)
- Constraints (if any -- e.g., "allowed but with reduced parameter scope")
- A unique decision ID for audit correlation

### 4. EXECUTION_RESULT

For `ALLOW` decisions, the tool proxy executes the action and reports the result:

```
Tool Proxy --> External System --> Result
Tool Proxy --> EXECUTION_RESULT --> AI Agent
```

The execution result is also recorded in the audit log, completing the full lifecycle.

## End-to-End Flow

```
AI Agent
   |
   | ACTION_PROPOSE
   v
Governance Gateway
   |
   | Authenticate + Route
   v
Decision Engine
   |
   | Capability -> Authority -> Risk -> Policy
   v
DECISION_RESPONSE
   |
   +--[DENY/ESCALATE/REQUIRE_CONFIRMATION]--> Return to Agent
   |
   +--[ALLOW]
   |
   v
Tool Proxy
   |
   | Execute against external system
   v
EXECUTION_RESULT --> Agent + Audit Log
```

## Audit Integration

Every step in the lifecycle is recorded in the immutable audit log:

- The original `ACTION_PROPOSE` (full request)
- The evaluation path (which checks passed or failed, risk score computation)
- The `DECISION_RESPONSE` (outcome and reasoning)
- The `EXECUTION_RESULT` (if applicable)

This enables full forensic reconstruction of any governance decision.

## Further Reading

- [Architecture Overview](/architecture/) -- Component overview
- [Core Concepts](/getting-started/core-concepts/) -- Governance concepts explained
- [API Reference](/api/) -- How to interact with the governance API programmatically

> **Note:** For the full AGP-1 protocol specification including wire formats, authentication, and error handling, see the [aegis-governance repository](https://github.com/aegis-initiative/aegis-governance/tree/main/aegis-core/protocol).
