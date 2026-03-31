---
title: Deployment
description: Deploy the AEGIS governance runtime in your infrastructure.
---

# Deployment Guide

> **Note:** The managed platform, operator dashboard, container images, and deployment tooling described on this page
are under active development and not yet available. There is no running service at `aegis-platform.net` today. The
content below describes the planned deployment model. Check back soon.

This guide covers deployment options for integrating AEGIS governance into your infrastructure. AEGIS can be consumed as
a managed service or self-hosted.

## Deployment Options

### Managed Platform (Recommended)

The simplest path to production. The managed platform at [aegis-platform.net](https://aegis-platform.net) provides:

- Hosted governance runtime with high availability
- Operator dashboard for policy management and monitoring
- Managed audit log storage with compliance-grade retention
- Automatic updates and security patches

To get started:

1. Create an organization at [aegis-platform.net](https://aegis-platform.net)
2. Configure capabilities and policies through the dashboard
3. Generate API keys for your AI agents
4. Integrate using the [SDK](/sdk/) or [API](/api/)

### Self-Hosted

For organizations that require on-premises deployment or have data residency requirements, AEGIS can be self-hosted. The
self-hosted runtime provides the same governance capabilities as the managed platform.

Self-hosted deployment details will be published as the runtime implementation matures. See the [aegis-governance
repository](https://github.com/aegis-initiative/aegis-governance) for architecture specifications.

## Integration Architecture

### Sidecar Pattern

Deploy the AEGIS gateway as a sidecar alongside your AI agent:

```
+-------------------+     +-------------------+
|   AI Agent        |---->|  AEGIS Gateway    |----> External Systems
|   (your code)     |<----|  (sidecar)        |
+-------------------+     +-------------------+
```

Best for: Kubernetes deployments, microservice architectures.

### Gateway Pattern

Deploy AEGIS as a centralized gateway that all AI agents route through:

```
AI Agent A ----+
               |     +-------------------+
AI Agent B ----+---->|  AEGIS Gateway    |----> External Systems
               |     |  (centralized)    |
AI Agent C ----+     +-------------------+
```

Best for: Multi-agent environments, centralized governance policy management.

### SDK-Only Pattern

Use the SDK to call the managed platform API directly from your agent code. No additional infrastructure required:

```
AI Agent (with SDK) ----> AEGIS Platform API ----> Decision
```

Best for: Quick integration, teams that prefer managed infrastructure.

## CI/CD Integration

Governance policies can be managed as code and deployed through your existing CI/CD pipeline:

1. Define capabilities and policies in version-controlled configuration files
2. Validate policies in CI (schema validation, conflict detection)
3. Deploy policy updates via the [Enforcement API](/api/enforcement/)
4. Monitor rollout through the operator dashboard

The [aegis-ops repository](https://github.com/aegis-initiative/aegis-ops) contains reference CI/CD workflows for policy
deployment.

## Network Requirements

The AEGIS governance gateway requires:

- Outbound HTTPS (443) to the AEGIS platform API (for managed deployments)
- Inbound connections from AI agents (configurable port)
- Outbound connections to target external systems (for the tool proxy layer)

AI agents should be configured to route all external operations through the governance gateway. Direct access to
external systems should be blocked at the network level.

## Next Steps

- [Monitoring](/guides/monitoring/) -- Monitor governance activity after deployment
- [Policy Authoring](/guides/policy-authoring/) -- Define governance rules
- [Troubleshooting](/guides/troubleshooting/) -- Diagnose deployment issues

> **Note:** Deployment tooling and container images are under active development. This guide reflects the target
deployment model. See the [aegis-ops repository](https://github.com/aegis-initiative/aegis-ops) for current status.
