---
title: Policy Authoring
description: How to write governance policies for the AEGIS platform -- from capability registration to policy deployment.
---

# Writing Governance Policies

This guide walks through the process of defining governance policies for the AEGIS platform. By the end, you will
understand how to register capabilities, write policy rules, and test them before deployment.

## Overview

Governance in AEGIS is defined through two layers:

1. **Capabilities** -- What operations exist and who can use them
2. **Policies** -- The rules that determine when and how capabilities may be exercised

Both layers follow a **default-deny** model: if an operation is not explicitly registered and permitted, it is denied.

## Step 1: Register Capabilities

Before you can write policies for an operation, the operation must be registered as a capability.

```json
{
  "name": "database.query",
  "description": "Execute a read-only database query",
  "risk_level": "low",
  "parameter_schema": {
    "type": "object",
    "required": ["query"],
    "properties": {
      "query": { "type": "string" },
      "database": { "type": "string", "enum": ["staging", "production"] }
    }
  }
}
```

Key considerations:

- **Name** -- Use a dot-separated namespace (`domain.operation`)
- **Risk level** -- Assign an appropriate base risk (`low`, `medium`, `high`, `critical`)
- **Parameter schema** -- Define the expected parameters using JSON Schema

Register the capability via the [Enforcement API](/api/enforcement/) or the operator dashboard. *(The operator dashboard
is not yet available; the Enforcement API endpoints for creating capabilities and policies are not yet implemented.)*

## Step 2: Grant Capabilities to Actors

Once a capability is registered, grant it to the actors that should be able to use it:

```json
{
  "capability": "database.query",
  "constraints": {
    "time_window": { "start": "09:00", "end": "17:00", "timezone": "UTC" },
    "rate_limit": { "max_requests": 100, "window_seconds": 3600 }
  }
}
```

Grants can include constraints that limit when and how often the capability can be used.

## Step 3: Write Policy Rules

Policies add conditional logic on top of capability grants. A policy can modify the outcome based on contextual factors:

```json
{
  "name": "production-query-confirmation",
  "description": "Require confirmation for queries against production databases",
  "rules": [
    {
      "capability": "database.query",
      "condition": "parameters.database == 'production'",
      "outcome": "REQUIRE_CONFIRMATION",
      "priority": 100
    }
  ],
  "enabled": true
}
```

### Policy Rule Fields

| Field | Description |
|---|---|
| `capability` | The capability this rule applies to |
| `condition` | A deterministic expression evaluated against the action context |
| `outcome` | The decision to return if the condition matches (`ALLOW`, `DENY`, `ESCALATE`, `REQUIRE_CONFIRMATION`) |
| `priority` | Numeric priority -- higher values take precedence |

### Condition Expressions

Conditions are evaluated against the full action context, including:

- `parameters.*` -- The action parameters
- `actor.id` -- The requesting actor's identifier
- `actor.type` -- The actor type (`ai-agent`, `ai-copilot`, etc.)
- `context.*` -- Contextual metadata
- `time.hour` -- Current hour (UTC)
- `time.day_of_week` -- Current day (0 = Monday)

## Step 4: Policy Precedence

When multiple policies match a given action, the policy with the highest priority wins. If two policies have the same
priority, the more restrictive outcome takes precedence:

```
DENY > ESCALATE > REQUIRE_CONFIRMATION > ALLOW
```

This ensures that safety-critical policies always override permissive ones.

## Step 5: Test Your Policies

> **Note:** The code example below requires the SDK packages to be published and the platform API to be deployed,
neither of which is available yet. The governance runtime can be tested locally using the
[aegis-governance/aegis-runtime](https://github.com/aegis-initiative/aegis-governance) Python package (176 tests
passing).

Before deploying policies to production, test them using the governance API with test actor credentials:

```python
# Submit a test proposal
decision = aegis.propose(
    actor={"id": "test-agent", "type": "ai-agent"},
    action={
        "capability": "database.query",
        "parameters": {"query": "SELECT 1", "database": "production"},
    },
)

# Verify the expected outcome
assert decision.outcome == "REQUIRE_CONFIRMATION"
```

Review the audit log entry for the decision to verify that the correct policies were evaluated and matched.

## Common Patterns

### Time-Based Restrictions

```json
{
  "capability": "infrastructure.deploy",
  "condition": "time.hour < 9 or time.hour > 17",
  "outcome": "DENY",
  "priority": 200
}
```

### Actor-Specific Overrides

```json
{
  "capability": "email.send",
  "condition": "actor.id == 'marketing-bot' and parameters.recipient_count > 1000",
  "outcome": "ESCALATE",
  "priority": 150
}
```

### Environment Gating

```json
{
  "capability": "infrastructure.deploy",
  "condition": "parameters.environment == 'production'",
  "outcome": "REQUIRE_CONFIRMATION",
  "priority": 100
}
```

## Next Steps

- [Deployment Guide](/guides/deployment/) -- Deploy your governance configuration
- [Monitoring](/guides/monitoring/) -- Monitor policy evaluation in real time
- [Enforcement API](/api/enforcement/) -- Manage capabilities and policies via API

> **Note:** The policy language and configuration format are under active development. This guide reflects the current
design direction. See the [aegis-governance repository](https://github.com/aegis-initiative/aegis-governance) for the
latest specifications.
