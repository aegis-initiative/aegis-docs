---
title: Troubleshooting
description: Diagnose and resolve common issues with AEGIS governance integrations.
---

# Troubleshooting

> **Note:** The platform API at `api.aegis-platform.net` is not yet deployed, and authentication is not yet implemented.
The troubleshooting scenarios below describe the planned integration experience and will be applicable once the platform
is available.

This guide covers common issues encountered when integrating with the AEGIS governance platform and how to resolve them.

## Connection Issues

### Cannot reach the AEGIS API

**Symptoms:** SDK throws a timeout or connection error.

**Checklist:**

1. Verify the endpoint URL is correct: `https://api.aegis-platform.net`
2. Check that your network allows outbound HTTPS (port 443)
3. If behind a corporate proxy, configure the SDK with a custom HTTP client (see [SDK
Configuration](/sdk/configuration/))
4. Test connectivity: `curl -I https://api.aegis-platform.net/health`

### Authentication failures (401)

**Symptoms:** All requests return HTTP 401.

**Checklist:**

1. Verify the API key is correct and not expired
2. Ensure the key is passed in the `Authorization: Bearer <key>` header
3. Check that the API key has not been revoked in the operator dashboard
4. If using environment variables, confirm `AEGIS_API_KEY` is set in the current environment

## Unexpected Denials

### Action denied despite having a policy that should allow it

**Symptoms:** `propose()` returns `DENY` when you expect `ALLOW`.

**Debugging steps:**

1. **Check capability registration** -- Is the capability registered? Unregistered capabilities are always denied.
2. **Check actor grants** -- Does the actor have a grant for this capability? Missing grants produce denial before
policy evaluation.
3. **Check grant constraints** -- Is the grant active? Time windows, rate limits, and other constraints may be blocking
the action.
4. **Check policy priority** -- A higher-priority DENY policy may be overriding your ALLOW policy. Review policy
precedence.
5. **Review the audit log** -- The audit entry for the decision shows exactly which checks passed or failed and which
policy matched.

```bash
curl -H "Authorization: Bearer $AEGIS_API_KEY" \
  "https://api.aegis-platform.net/api/v1/audit/log/<decision_id>"
```

### Rate limit exceeded

**Symptoms:** `propose()` returns `DENY` with a reason mentioning rate limits.

**Resolution:**

- Check the actor's grant constraints for rate limit settings
- Review the actor's recent activity volume
- Consider increasing the rate limit in the grant configuration

## Policy Issues

### Policy not taking effect

**Symptoms:** A newly created policy does not seem to influence decisions.

**Checklist:**

1. Verify the policy is enabled (`"enabled": true`)
2. Check that the policy's capability field matches the registered capability name exactly
3. Review the condition expression for syntax errors
4. Check policy priority -- a higher-priority policy may be taking precedence
5. Verify that the policy was successfully created via the API (check for error responses)

### Conflicting policies

**Symptoms:** Governance outcomes are inconsistent or surprising.

**Resolution:**

- List all active policies for the relevant capability
- Sort by priority to understand evaluation order
- Remember: when priorities are equal, the more restrictive outcome wins (`DENY > ESCALATE > REQUIRE_CONFIRMATION >
ALLOW`)
- Use the audit log to see exactly which policy matched for each decision

## Performance

### High latency on governance calls

**Symptoms:** `propose()` calls take longer than expected.

**Checklist:**

1. Check network latency to the platform API
2. Review the number of policies being evaluated -- large policy sets may increase evaluation time
3. Consider the sidecar deployment pattern to reduce network hops (see [Deployment](/guides/deployment/))
4. Check the SDK timeout and retry configuration -- retries on transient failures add latency

### SDK retry storms

**Symptoms:** High request volume to the AEGIS API during outages.

**Resolution:**

- Configure appropriate retry limits and backoff delays
- Implement circuit breaker logic in your application
- See [SDK Configuration](/sdk/configuration/) for retry settings

## Getting Help

If you are unable to resolve an issue using this guide:

- Review the [audit log](/api/audit/) for the specific decision that produced unexpected behavior
- Check the [AEGIS GitHub organization](https://github.com/aegis-initiative) for known issues
- Open an issue in the relevant repository with the decision ID and audit log entry

> **Note:** As the platform matures, this troubleshooting guide will be expanded with additional scenarios and
diagnostic tools.
