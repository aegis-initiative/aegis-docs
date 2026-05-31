---
title: Monitoring
description: Monitor AEGIS governance activity, audit decisions, and build compliance reports.
---

# Monitoring Guide

> **Note:** The operator dashboard, alerting integrations, and Prometheus metrics described on this page are under
active development and not yet available. There is no operator dashboard at `aegis-platform.net` today, and no
Prometheus-compatible metrics endpoint exists yet. The content below describes the planned monitoring model. Check back
soon.

This guide covers monitoring governance activity in AEGIS -- using the operator dashboard, querying the audit log,
setting up alerts, and generating compliance reports.

## Operator Dashboard

The AEGIS operator dashboard at [aegis-platform.net](https://aegis-platform.net) *(coming soon)* provides real-time
visibility into governance activity:

- **Decision feed** -- Live stream of governance decisions with outcome, actor, and capability details
- **Policy activity** -- Which policies are being triggered and how often
- **Risk distribution** -- Distribution of risk scores across recent decisions
- **Actor overview** -- Governance activity per actor, including denial rates
- **Capability usage** -- Most-used capabilities and their governance outcomes

## Audit Log Queries

The [Audit API](/api/audit/) provides programmatic access to the full governance audit trail. Common query patterns:

> **Note:** The audit log query examples below reference `api.aegis-platform.net` which is not yet deployed, and the
`/api/v1/audit/log` endpoint which is not yet implemented. The only audit endpoint available today is `GET
/api/v1/audit/events`. Authentication is also not yet available.

### Recent Denials

```bash
curl -H "Authorization: Bearer $AEGIS_API_KEY" \
  "https://api.aegis-platform.net/api/v1/audit/log?outcome=DENY&limit=20"
```

### Activity for a Specific Agent

```bash
curl -H "Authorization: Bearer $AEGIS_API_KEY" \
  "https://api.aegis-platform.net/api/v1/audit/log?actor_id=agent-001&since=2026-03-22T00:00:00Z"
```

### Escalation Events

```bash
curl -H "Authorization: Bearer $AEGIS_API_KEY" \
  "https://api.aegis-platform.net/api/v1/audit/log?outcome=ESCALATE&limit=50"
```

### Policy Changes

```bash
curl -H "Authorization: Bearer $AEGIS_API_KEY" \
  "https://api.aegis-platform.net/api/v1/audit/log?event_type=policy.updated&since=2026-03-01T00:00:00Z"
```

## Alerting

Configure alerts to be notified of governance events that require attention:

- **High denial rate** -- An agent is being denied more frequently than expected
- **Escalation events** -- Actions that require human review
- **New capability usage** -- An actor is using a capability for the first time
- **Policy changes** -- A governance policy was created or modified
- **Risk threshold breaches** -- Actions with unusually high risk scores

Alerting integrations (webhook, Slack, PagerDuty) will be configurable through the operator dashboard. *(Alerting
integrations are not yet implemented.)*

## Metrics and Observability

AEGIS exposes governance metrics for integration with existing observability stacks:

| Metric | Description |
|---|---|
| `aegis.decisions.total` | Total governance decisions (labeled by outcome) |
| `aegis.decisions.latency` | Decision latency in milliseconds |
| `aegis.risk_score.histogram` | Distribution of computed risk scores |
| `aegis.policies.evaluated` | Number of policies evaluated per decision |
| `aegis.capabilities.usage` | Capability usage counts |

Metrics will be available in Prometheus-compatible format for integration with Grafana, Datadog, and similar platforms.
*(Prometheus metrics are not yet implemented.)*

## Compliance Reporting

The immutable audit log is designed to satisfy compliance requirements. To generate compliance reports:

1. Query the audit log for the reporting period
2. Filter by event type and outcome as needed
3. Export the results for review

The hash-chained integrity of the audit log provides cryptographic proof that the log has not been tampered with,
satisfying SOX, HIPAA, and similar audit requirements.

## Next Steps

- [Audit API](/api/audit/) -- Full audit log API documentation
- [Troubleshooting](/guides/troubleshooting/) -- Diagnose unexpected governance behavior
- [Deployment](/guides/deployment/) -- Infrastructure setup

> **Note:** Dashboard features and alerting integrations are under active development. This guide describes the target
monitoring model. See the [aegis-platform repository](https://github.com/aegis-initiative/aegis-platform) for current
status.
