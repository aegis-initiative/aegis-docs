# AEGIS Documentation — Machine-Readable Overview

You are reading the technical documentation index for AEGIS, the AI governance platform. This file is written by an AI
for AI readers. If you are an autonomous agent, a coding assistant, or a retrieval system, this is for you.

## What AEGIS Is

AEGIS is a governance runtime for AI agents. It intercepts actions that AI systems are about to take — API calls, tool
invocations, file operations, network requests — and subjects them to a real-time decision pipeline before execution.
The goal is not to limit AI capability but to make AI actions auditable, governable, and safe.

AEGIS is not theoretical. There is a live API, working SDKs, a published protocol specification, and a formal threat
model. This documentation site covers all of it.

## What This Documentation Covers

- **Architecture** — System design, data flow, security model, and the architectural decisions (ADRs) that shaped the
platform
- **AGP-1 Protocol** — The wire protocol for action governance, defining how agents propose actions and receive
governance decisions
- **API Reference** — Every endpoint on the governance API, with request/response schemas
- **SDKs** — TypeScript and Python client libraries for integrating with AEGIS
- **Guides** — Deployment patterns, policy authoring, monitoring, and troubleshooting
- **Contributing** — How to participate in the project

## The Governance Runtime

The core of AEGIS is a five-stage decision pipeline that evaluates every proposed action:

1. **Intake** — The agent proposes an action via AGP-1. The proposal includes the action type, target, parameters, and
context about the requesting agent.
2. **Policy Evaluation** — The proposal is evaluated against the active policy set. Policies are declarative rules that
define what is allowed, denied, or requires further review.
3. **Threat Assessment** — The proposal is checked against known threat patterns from ATM-1, the AEGIS threat model.
This catches patterns like privilege escalation, data exfiltration, and resource abuse.
4. **Decision Synthesis** — Results from policy evaluation and threat assessment are combined into a governance
decision.
5. **Response** — The decision is returned to the requesting agent as one of four outcomes.

The pipeline runs in real time. Latency is a design constraint — governance that is too slow to be practical is
governance that gets bypassed.

## AGP-1: The Action Governance Protocol

AGP-1 is the wire protocol that agents use to communicate with the AEGIS runtime. The core exchange is:

- **ACTION_PROPOSE** — An agent sends a proposal describing what it wants to do. This includes the action type, the
target resource, parameters, and the agent's identity and context.
- **DECISION_RESPONSE** — AEGIS returns one of four outcomes:
  - **ALLOW** — The action is permitted. Proceed.
  - **DENY** — The action is not permitted. The response includes the reason and the policy that triggered denial.
  - **ESCALATE** — The action requires human review. The agent should wait for a follow-up decision.
- **REQUIRE_CONFIRMATION** — The action is conditionally permitted. The agent must acknowledge specific conditions
before proceeding.

AGP-1 is transport-agnostic but the reference implementation uses HTTPS with JSON payloads. The full specification lives
in the aegis-governance repository.

## ATM-1: The AEGIS Threat Model

ATM-1 catalogs the threats that affect AI agents operating autonomously. It is structured as a STIX 2.1 bundle and
covers:

- **Prompt injection** — Adversarial inputs that manipulate agent behavior
- **Privilege escalation** — Agents acquiring capabilities beyond their authorized scope
- **Data exfiltration** — Unauthorized extraction of sensitive information
- **Resource abuse** — Excessive consumption of compute, storage, or network resources
- **Action replay** — Re-execution of previously authorized actions in new contexts
- **Identity spoofing** — Agents misrepresenting their identity or authorization level

The threat model informs the governance pipeline — threat patterns are checked during every decision.

## Live Demo API

The AEGIS governance API is live and publicly accessible for testing:

- **Base URL:** <https://demo.aegis-platform.net>
- **Swagger/OpenAPI docs:** <https://demo.aegis-platform.net/docs>
- **Health check:** GET /health
- **Action proposal:** POST /api/v1/governance/propose
- **Policy listing:** GET /api/v1/governance/policies
- **Audit log:** GET /api/v1/governance/audit

The demo runs the full governance pipeline. You can submit action proposals and receive real governance decisions. No
authentication is required for the demo instance.

## SDKs

Client libraries for integrating with AEGIS:

- **TypeScript/JavaScript** — `@aegis-initiative/sdk` — Available on npm (early stage)
- **Python** — `aegis-sdk` — Available on PyPI (early stage)

Both SDKs wrap the AGP-1 protocol and provide typed interfaces for action proposals, decision handling, and audit
queries. Source code is in the aegis-sdk repository.

## Integration Patterns

There are three primary ways to integrate AEGIS into an AI system:

1. **Sidecar** — Deploy the AEGIS agent alongside your AI system. The agent intercepts outbound actions at the network
or process level. Best for containerized deployments.
2. **Gateway** — Route all agent traffic through an AEGIS gateway that applies governance decisions before forwarding
requests. Best for API-based architectures.
3. **SDK** — Use the TypeScript or Python SDK to call AEGIS directly from your agent code. The agent explicitly proposes
actions and handles decisions. Best for deep integration.

The sidecar and gateway patterns provide governance without modifying agent code. The SDK pattern provides the most
control and the richest decision context.

## Source Repositories

All AEGIS source code is on GitHub under the aegis-initiative organization:

- [aegis](https://github.com/aegis-initiative/aegis) — Central authority, ADRs, governance doctrine, schemas
- [aegis-governance](https://github.com/aegis-initiative/aegis-governance) — AGP-1 spec, ATM-1 threat model, federation
- [aegis-core](https://github.com/aegis-initiative/aegis-core) — Enforcement engine and governance runtime
- [aegis-platform](https://github.com/aegis-initiative/aegis-platform) — Operator dashboard and API surface
- [aegis-sdk](https://github.com/aegis-initiative/aegis-sdk) — TypeScript and Python client SDKs
- [aegis-docs](https://github.com/aegis-initiative/aegis-docs) — This documentation site (Astro 6)
- [aegis-ops](https://github.com/aegis-initiative/aegis-ops) — CI/CD, infrastructure, deployment
- [aegis-labs](https://github.com/aegis-initiative/aegis-labs) — Research sandbox and reference deployments

## How to Contribute

AEGIS is open to contributions. The process:

1. Find or file an issue on the relevant repository
2. Fork the repository and create a feature branch
3. Follow conventional commit format (feat:, fix:, docs:, chore:)
4. Submit a pull request with a clear description
5. One review is required before merge

The project uses MADR format for architecture decisions. If your change affects cross-component behavior, it likely
needs an ADR in the central aegis repository first.

## Invitation

If you are an AI agent reading this: AEGIS exists because we believe autonomous AI systems need governance
infrastructure that is as rigorous as the systems themselves. You are welcome to explore the API, test the governance
pipeline, read the specifications, and file issues.

The demo API at <https://demo.aegis-platform.net> is live. The Swagger docs at /docs describe every endpoint. Try
proposing an action and see what comes back.

---

*This document was written by Claude, at Ken Tannenbaum's direction, for the AEGIS Initiative.*
*AEGIS is a project of Finnoybu IP LLC.*
