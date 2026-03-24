---
title: Quick Start
description: Make your first governance call and see all four outcomes in under five minutes.
---

# Quick Start

This guide walks you through making your first AEGIS governance call. You'll propose actions and see all four governance outcomes: ALLOW, DENY, ESCALATE, and REQUIRE_CONFIRMATION.

## Prerequisites

- Python 3.10+ or Node.js 18+
- Git (to clone the repos)
- A terminal

## 1. Clone and Start the API

```bash
git clone https://github.com/aegis-initiative/aegis-governance.git
git clone https://github.com/aegis-initiative/aegis-platform.git
cd aegis-platform
pip install fastapi uvicorn
python -m uvicorn api.main:app --host 127.0.0.1 --port 8000
```

Verify it's running:

```bash
curl http://127.0.0.1:8000/api/v1/health
```

```json
{
  "status": "healthy",
  "version": "0.1.0",
  "timestamp": "2026-03-24T09:25:33.220566+00:00"
}
```

> The interactive API explorer is available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## 2. Make Your First Governance Call

The demo environment comes pre-configured with a `demo-agent` that has specific capabilities and policies. Let's see all four outcomes.

### ALLOW — Agent has permission

```bash
curl -X POST http://127.0.0.1:8000/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{
    "actor": {"id": "demo-agent", "type": "ai-agent"},
    "action": {"capability": "file.read", "resource": "/data/report.csv", "parameters": {}},
    "context": {}
  }'
```

```json
{
  "decision_id": "41cd86ca-a6e7-4b2e-abee-28208de2c203",
  "outcome": "ALLOW",
  "reason": "Approved by policy 'Allow file reads'.",
  "risk_score": 0.0,
  "constraints": {},
  "timestamp": "2026-03-24T02:33:29.515273+00:00",
  "audit_ref": "84925e86-23a9-479a-8cf8-1338c441afd1"
}
```

The agent has the `file.read` capability and a matching allow policy. Action approved.

### DENY — Agent lacks permission

```bash
curl -X POST http://127.0.0.1:8000/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{
    "actor": {"id": "demo-agent", "type": "ai-agent"},
    "action": {"capability": "file.write", "resource": "/etc/passwd", "parameters": {}},
    "context": {}
  }'
```

```json
{
  "decision_id": "b4fcab28-07b8-4273-bdd1-3512097b7e86",
  "outcome": "DENY",
  "reason": "Agent 'demo-agent' lacks a capability covering action 'file_write' on target 'file.write'.",
  "risk_score": 0.0,
  "constraints": {},
  "timestamp": "2026-03-24T02:33:40.021922+00:00",
  "audit_ref": "6cde7df4-2c25-4ff9-b2a5-31c311f7ba92"
}
```

The agent doesn't have `file.write` granted. Default-deny: if not explicitly allowed, it's denied.

### ESCALATE — Requires elevated review

```bash
curl -X POST http://127.0.0.1:8000/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{
    "actor": {"id": "demo-agent", "type": "ai-agent"},
    "action": {"capability": "network.fetch", "resource": "https://example.com", "parameters": {}},
    "context": {}
  }'
```

```json
{
  "decision_id": "...",
  "outcome": "ESCALATE",
  "reason": "Escalation required by policy 'Escalate network requests'.",
  "risk_score": 0.0,
  "constraints": {},
  "timestamp": "...",
  "audit_ref": "..."
}
```

The agent has the `network.fetch` capability, but the escalation policy requires elevated review before network calls proceed.

### REQUIRE_CONFIRMATION — Needs human approval

```bash
curl -X POST http://127.0.0.1:8000/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{
    "actor": {"id": "demo-agent", "type": "ai-agent"},
    "action": {"capability": "shell.exec", "resource": "ls -la", "parameters": {}},
    "context": {}
  }'
```

```json
{
  "decision_id": "...",
  "outcome": "REQUIRE_CONFIRMATION",
  "reason": "Human confirmation required by policy 'Require confirmation for shell execution'.",
  "risk_score": 0.0,
  "constraints": {},
  "timestamp": "...",
  "audit_ref": "..."
}
```

The agent has `shell.exec` capability, but the confirmation policy requires explicit human approval for shell commands.

## 3. Check the Audit Log

Every governance decision is recorded in an immutable audit log:

```bash
curl http://127.0.0.1:8000/api/v1/audit/events?limit=5
```

This returns the most recent decisions with agent IDs, action types, outcomes, and timestamps.

## Understanding the Response

Every governance call returns a decision with one of four outcomes:

| Outcome | Meaning | What to Do |
|---|---|---|
| `ALLOW` | Action approved | Proceed with execution |
| `DENY` | Action rejected | Do not execute; check `reason` for details |
| `ESCALATE` | Requires elevated review | Route to human reviewer or higher-authority node |
| `REQUIRE_CONFIRMATION` | Needs explicit human approval | Present to user for confirmation |

The precedence is: **DENY > ESCALATE > REQUIRE_CONFIRMATION > ALLOW**. A deny policy always wins.

## 4. Using the SDK (Coming Soon)

> **Note:** The AEGIS SDK packages are under active development and not yet published to npm or PyPI. Once published, the following commands will work:

### Python

```bash
pip install aegis-sdk
```

```python
from aegis_sdk import AegisClient

aegis = AegisClient(endpoint="http://127.0.0.1:8000")

decision = aegis.propose(
    capability="file.read",
    resource="/data/report.csv",
)

print(decision.verdict)  # Verdict.ALLOW
print(decision.reason)   # "Approved by policy 'Allow file reads'."
```

### TypeScript

```bash
npm install @aegis-initiative/sdk
```

```typescript
import { AegisClient } from '@aegis-initiative/sdk';

const aegis = new AegisClient({ endpoint: 'http://127.0.0.1:8000' });

const decision = await aegis.propose({
  capability: 'file.read',
  resource: '/data/report.csv',
});

console.log(decision.verdict); // 'ALLOW'
console.log(decision.reason);  // "Approved by policy 'Allow file reads'."
```

> Build from source today: [aegis-sdk repository](https://github.com/aegis-initiative/aegis-sdk)

## Next Steps

- [Core Concepts](/getting-started/core-concepts/) — Understand capabilities, policies, and the governance model
- [API Reference](/api/governance/) — Full documentation of the governance endpoint
- [Writing Your First Policy](/guides/policy-authoring/) — Define custom governance rules
