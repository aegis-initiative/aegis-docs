---
title: Authentication
description: How to authenticate with the AEGIS platform API using API keys, JWT tokens, and mutual TLS.
---

# Authentication

> **Note:** Authentication is under active development and not yet available. There is no authentication system implemented today -- no API keys, no JWT tokens, no mTLS, and no operator dashboard. The content below describes the planned authentication model. Check back soon.

All AEGIS platform API requests require authentication. This page covers the supported authentication methods and how to configure them.

## API Key Authentication

API keys are the most common authentication method for server-to-server integrations and SDK usage.

### Obtaining an API Key

1. Sign in to the operator dashboard at [aegissystems.live](https://aegissystems.live) *(coming soon -- the operator dashboard is not yet available)*
2. Navigate to **Settings > API Keys**
3. Click **Create API Key**
4. Assign a name and select the appropriate permission scope
5. Copy the generated key -- it will only be shown once

### Using an API Key

Include the API key in the `Authorization` header of every request:

```bash
curl -H "Authorization: Bearer aegis_sk_live_abc123..." \
  https://api.aegissystems.live/api/v1/governance/propose \
  -X POST -d '...'
```

With the SDK:

```typescript
const aegis = new AegisClient({
  endpoint: 'https://api.aegissystems.live',
  apiKey: process.env.AEGIS_API_KEY,
});
```

### API Key Scopes

API keys can be scoped to limit their permissions:

| Scope | Permissions |
|---|---|
| `governance:propose` | Submit action proposals |
| `governance:read` | Read governance decisions |
| `audit:read` | Query audit logs |
| `capabilities:manage` | Register and modify capabilities |
| `policies:manage` | Create and update policies |
| `admin` | Full administrative access |

## JWT Bearer Tokens

JWT tokens are used for user sessions and dashboard interactions. They are issued by the AEGIS authentication service upon login.

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

JWT tokens include claims for the authenticated user, their organization, and their roles. Token expiration and refresh are handled automatically by the dashboard and SDKs.

## Mutual TLS (mTLS)

For high-security deployments, the platform supports mutual TLS authentication. Both the client and server present certificates, providing cryptographic proof of identity.

mTLS is recommended for:

- Production deployments with strict compliance requirements
- Service mesh integrations
- Environments where API keys alone are insufficient

Contact the AEGIS team for mTLS certificate provisioning.

## Security Best Practices

- **Never embed API keys in client-side code** -- API keys should only be used in server-side environments
- **Use environment variables** -- Store keys in `AEGIS_API_KEY` rather than hardcoding them
- **Rotate keys regularly** -- Generate new keys periodically and revoke old ones
- **Use the narrowest scope possible** -- Only grant the permissions your integration needs
- **Monitor key usage** -- Review API key activity in the operator dashboard

## Further Reading

- [API Overview](/api/) -- Full API endpoint reference
- [SDK Overview](/sdk/) -- SDKs handle authentication automatically
