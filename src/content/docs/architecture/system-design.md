---
title: System Design
description: Detailed design of the AEGIS governance runtime components and their interactions.
---

# System Design

This page describes the internal design of the AEGIS governance runtime -- how the decision engine, capability registry, policy engine, and audit subsystem are structured and how they interact.

## Runtime Architecture

The governance runtime is composed of several cooperating subsystems:

```
                +-------------------+
                | Governance Gateway|
                +--------+----------+
                         |
                         v
                +--------+----------+
                |  Authentication   |
                |  & Actor Resolution|
                +--------+----------+
                         |
                         v
              +----------+-----------+
              |   Decision Engine    |
              |                      |
              | +------------------+ |
              | | Capability       | |
              | | Registry         | |
              | +------------------+ |
              | +------------------+ |
              | | Policy Engine    | |
              | +------------------+ |
              | +------------------+ |
              | | Risk Evaluator   | |
              | +------------------+ |
              +----------+-----------+
                         |
                    +----+----+
                    |         |
                    v         v
             +------+--+ +---+-------+
             |Tool Proxy| |Audit Log  |
             +----------+ +-----------+
```

## Capability Registry

The capability registry is the authoritative source for what operations exist in the system and which actors may use them. It maintains:

- **Capability definitions** -- Named operations with metadata (risk level, description, parameter schema)
- **Actor grants** -- Mappings between actors and the capabilities they are authorized to use
- **Constraints** -- Conditions attached to grants (time windows, rate limits, environment restrictions)

The registry enforces **default-deny**: if a capability is not registered, or if an actor does not have an explicit grant, the action is denied before policy evaluation even begins.

## Policy Engine

The policy engine evaluates a set of deterministic rules against the action context. Policies are:

- **Explicit** -- Written in a formal policy language, not natural language
- **Ordered** -- Evaluated with defined precedence (most-specific-match wins)
- **Deterministic** -- No probabilistic evaluation, no learned behavior
- **Auditable** -- The exact evaluation path is recorded for every decision

Policy types include allow rules, deny rules, escalation rules, and conditional modification rules (e.g., "allow but require confirmation if targeting production").

## Risk Evaluator

The risk evaluator computes a numerical risk score for each action proposal using deterministic algorithms. Inputs include:

- Capability base risk level
- Actor trust score
- Contextual factors (time of day, request frequency, target environment)
- Historical behavior patterns

The computed score is compared against configurable thresholds. Actions exceeding the threshold are denied or escalated regardless of what policies would otherwise permit.

## Authentication and Actor Resolution

Every incoming request is authenticated before any governance evaluation occurs. The system supports:

- API key authentication
- Mutual TLS (mTLS)
- JWT bearer tokens
- Service account credentials

The authenticated identity is resolved to an actor record that carries the actor'
