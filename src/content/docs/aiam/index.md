---
title: "AIAM-1: Identity & Access Management for AI Agents"
description: The AEGIS specification for governing AI agent identity, intent, authority, delegation, and accountability.
sidebar:
  order: 0
---

# AIAM-1: Identity & Access Management for AI Agents

AIAM-1 is the first specification for **identity and access management for AI agents (aIAM)** -- a new category within the IAM discipline designed for the agent actor class.

## The Problem

Existing IAM was built for two actor classes: **humans** and **service accounts**. AI agents are a third actor class that violates the assumptions underlying both:

- Their identity is durable but their **intent is not**
- Their authorization cannot be static because their **goals shift** within a single session
- Their actions are not discrete -- they are **composed chains** where each step conditions the next
- **Accountability** cannot rest on the agent itself

Attempting to govern AI agents with existing IAM primitives results in agents that are either over-scoped or under-scoped. Neither outcome is governance.

## What AIAM-1 Defines

### Intent-Bound Access Control (IBAC)

AIAM-1 introduces **IBAC** -- an authorization model where every access decision is evaluated as a function of three inputs:

```
Authorization Decision = f(Identity, Action, Intent Context)
```

| Model | Decision Inputs | Agent Suitability |
|---|---|---|
| **RBAC** | Identity + role | Insufficient -- roles are too coarse for dynamic goals |
| **ABAC** | Attributes + environment | Partial -- intent is not a first-class attribute |
| **IBAC** | Identity + action + intent | Designed for agents -- intent is structured, validated, and attested |

IBAC generalizes RBAC and ABAC: an RBAC policy is an IBAC triple with wildcard intent.

### Composite Identity

A four-dimensional identity claim:

| Dimension | Question it answers |
|---|---|
| **Model provenance** | What reasoning engine powers this agent? |
| **Orchestration layer** | What framework and runtime environment? |
| **Goal context** | Why was this agent instantiated? |
| **Principal** | On whose behalf does it act? Who is accountable? |

### Principal Chains

When Agent A delegates to Agent B, the delegation creates an explicit, attested accountability chain. Authority narrows monotonically. The principal at the top -- always a human, organization, or legal entity -- remains accountable for all actions anywhere in the chain.

### Session Governance

Sessions are first-class governance boundaries bounded by four dimensions: goal context, time window, capability envelope, and accountability chain. No silent session escalation is permitted.

## Specification Suite

AIAM-1 is a 12-chapter normative specification with 80+ enumerated requirements:

| Chapter | Content |
|---|---|
| **Identity** | Four-dimensional composite identity model |
| **Intent** | Structured intent claims, goal alignment validation |
| **Authority** | IBAC formal definition, policy format, decision flow |
| **Capabilities** | Composition governance, non-transitivity |
| **Delegation** | Principal chains, monotonic narrowing, depth limits |
| **Sessions** | Four-dimensional governance boundaries |
| **Attestation** | Action-level tamper-evident records |
| **Revocation** | Kill-switch, delegation cascade |
| **Interoperability** | OAuth 2.1, OIDC, SCIM, SAML mappings |
| **Threat Model** | Seven threat classes specific to agent IAM |
| **Conformance** | Full requirements checklist |

## Standalone Design

AIAM-1 is designed to be implemented independently of any specific governance runtime. While it integrates with AGP-1, ATX-1, ATM-1, and GFN-1 within the AEGIS ecosystem, **conformance to AIAM-1 does not require adoption of any other AEGIS specification**.

## Interoperability

AIAM-1 agents authenticate via standard **OAuth 2.1** flows with JWT bearer tokens extended with `aiam_` prefixed claims. Existing identity providers do not need to natively understand AIAM-1 -- the governance gateway resolves AIAM-1 identity depth.

| Standard | Integration |
|---|---|
| **OAuth 2.1 / OIDC** | Authentication and token transport |
| **SCIM** | Agent lifecycle management (provisioning, deprovisioning) |
| **SAML** | Federated identity for legacy environments |

## Threat Model

AIAM-1 addresses seven threat classes specific to agent IAM:

1. **Intent spoofing** -- false intent claims masking malicious actions
2. **Capability composition attacks** -- authorized capabilities composed into unauthorized effects
3. **Authority inheritance exploitation** -- sub-agents abusing delegated authority
4. **Principal chain obscuration** -- hiding accountability
5. **Attestation forgery** -- fabricating governance decision records
6. **Revocation evasion** -- racing against credential revocation
7. **Governance visibility exploitation** -- probing policy boundaries to evade detection

## Resources

- **Full specification**: [aegis-governance/aiam/](https://github.com/aegis-initiative/aegis-governance/tree/main/aiam)
- **Position paper**: [AIAM-1-position-paper-v0.1.md](https://github.com/aegis-initiative/aegis-governance/blob/main/docs/position-papers/aiam/AIAM-1-position-paper-v0.1.md)
- **RFC-0019**: [RFC-0019-AIAM-1](https://github.com/aegis-initiative/aegis-governance/blob/main/rfc/RFC-0019-AIAM-1-Identity-Access-Management-AI-Agents.md)
- **JSON schemas**: canonical shared schemas live in [`aegis/schemas/`](https://github.com/aegis-initiative/aegis/tree/main/schemas); the current AIAM-specific schemas remain documented in [`aegis-governance/aegis-core/schemas/aiam/`](https://github.com/aegis-initiative/aegis-governance/tree/main/aegis-core/schemas/aiam)

---

*AIAM-1 v0.1 -- Draft*
