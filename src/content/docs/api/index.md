---
title: API Overview
description: Overview of the AEGIS platform API -- endpoints, authentication, and integration patterns.
---

# API Reference

> **Note:** The API is not yet deployed to a public URL. There is no GraphQL endpoint. The only implemented endpoints today are: `POST /api/v1/governance/propose`, `GET /api/v1/health`, `GET /api/v1/capabilities`, and `GET /api/v1/audit/events` (in `aegis-platform/api/main.py`). Authentication (API keys, JWT, mTLS) is not yet implemented. The content below describes the planned API surface. Check back soon.

The AEGIS platform exposes a REST API for governance operations, policy management, audit queries, and system administration. This API is the programmatic interface consumed by the [AEGIS SDK](/sdk/) and third-party integrations.

## Base URL

```
https://api.aegissystems.live/api/v1/
```

> **Note:** The base URL `api.aegissystems.live` is coming soon and not yet active.

All API routes are versioned under `/api/v1/`. OpenAPI specifications are maintained in the [aegis-platform repository](https://github.com/aegis-initiative/aegis-platform).

## Authentication

All API requests require authentication. The platform supports:

| Method | Use Case |
|---|---|
| API Key | Server-to-server integrations, SDK usage |
| Bearer Token (JWT) | User sessions, dashboard interactions |
| Mutual TLS | High-security deployments, service mesh integrations |

API keys will be provisioned through the operator dashboard at [aegissystems.live](https://aegissystems.live) *(coming soon -- the operator dashboard and authentication system are not yet available)*. Include the key in the `Authorization` header:

```
Authorization: Bearer <your-api-key>
```

## Core Endpoints

### Governance

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/governance/propose` | Submit an action proposal for governance evaluation |
| `GET` | `/api/v1/governance/decisions/:id` | Retrieve a specific governance decision by ID |
| `GET` | `/api/v1/governance/decisions` | List recent governance decisions (paginated) |

### Capabilities

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/capabilities` | List registered capabilities |
| `POST` | `/api/v1/capabilities` | Register a new capability |
| `GET` | `/api/v1/capabilities/:id` | Get capability details |

### Policies

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/policies` | List active policies |
| `POST` | `/api/v1/policies` | Create a new policy |
| `PUT` | `/api/v1/policies/:id` | Update an existing policy |

### Audit

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/audit/log` | Query the audit log (paginated, filterable) |
| `GET` | `/api/v1/audit/log/:decision_id` | Get full audit trail for a specific decision |

## Response Format

All responses use JSON. Governance decisions follow a consistent structure:

```json
{
  "decision_id": "dec_abc123",
  "outcome": "ALLOW",
  "reason": "Policy 'default-allow-read' matched",
  "risk_score": 0.12,
  "constraints": {},
  "timestamp": "2026-03-23T12:00:00Z"
}
```

## Rate Limits

> **Note:** Rate limiting is under active development and not yet available. The model below describes the planned design.

API rate limits are configured per API key and depend on the subscription tier. Rate limit headers are included in every response:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 997
X-RateLimit-Reset: 1711195200
```

## SDKs

Rather than calling the API directly, most integrations should use the official SDKs:

- [TypeScript / JavaScript SDK](/sdk/javascript/)
- [Python SDK](/sdk/python/)

The SDKs handle authentication, retries, error handling, and response parsing.

## Further Reading

- [Governance Endpoint](/api/governance/) -- Detailed documentation for the governance proposal endpoint
- [Authentication](/api/authentication/) -- Full authentication guide
- [Audit API](/api/audit/) -- Querying the audit log

> **Note:** The AEGIS platform API is under active development. Endpoint signatures may evolve as the platform approaches general availability. See the [aegis-platform repository](https://github.com/aegis-initiative/aegis-platform) for current status.
