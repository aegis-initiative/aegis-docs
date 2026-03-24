---
title: Authentication
description: Authentication for the AEGIS platform API -- current status and planned model.
---

# Authentication

> **Authentication is not yet implemented.** The AEGIS platform API currently accepts all requests without credentials. No API keys, JWT tokens, mTLS, or any other authentication mechanism is enforced. The content below describes the planned authentication model for future releases.

## Current Status

The API at `http://127.0.0.1:8000` accepts unauthenticated requests to all endpoints:

```bash
# No Authorization header needed -- requests are accepted as-is
curl -s http://127.0.0.1:8000/api/v1/health
curl -s http://127.0.0.1:8000/api/v1/capabilities
curl -s -X POST http://127.0.0.1:8000/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "demo-agent", "action": "file.read", "target": "file.read"}'
```

This is acceptable for local development and testing. Authentication will be required before the API is deployed to `aegissystems.live`.

---

## Planned Authentication Model

The following authentication methods are planned:

### API Key Authentication

API keys will be the primary method for server-to-server integrations and SDK usage.

```
Authorization: Bearer aegis_sk_live_...
```

**Planned scopes:**

| Scope | Permissions |
|---|---|
| `governance:propose` | Submit action proposals |
| `governance:read` | Read governance decisions |
| `audit:read` | Query audit logs |
| `capabilities:manage` | Register and modify capabilities |
| `policies:manage` | Create and update policies |
| `admin` | Full administrative access |

API keys will be provisioned through the operator dashboard at [aegissystems.live](https://aegissystems.live) once it is available.

### JWT Bearer Tokens

JWT tokens are planned for user sessions and dashboard interactions. They will be issued by the AEGIS authentication service upon login.

### Mutual TLS (mTLS)

For high-security deployments, the platform will support mutual TLS authentication where both client and server present certificates.

## Security Best Practices

Even though authentication is not yet enforced, follow these practices in preparation:

- **Never embed API keys in client-side code** -- keys should only be used server-side
- **Use environment variables** -- store keys in `AEGIS_API_KEY` rather than hardcoding
- **Use the narrowest scope possible** -- only grant permissions your integration needs

## Further Reading

- [API Overview](/api/) -- All available endpoints
- [SDK Overview](/sdk/) -- SDKs will handle authentication automatically
