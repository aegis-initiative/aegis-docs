---
title: Security Model
description: Threat model and security architecture of the AEGIS governance system.
---

# Security Model

AEGIS is designed to be a security-critical component -- the last line of defense between AI reasoning and operational
execution. This page summarizes the security architecture and the threat model it addresses.

## Threat Model Overview

The AEGIS Threat Model (ATM-1) identifies and addresses threats across several categories:

### Bypass Threats

Attempts by AI systems or adversaries to circumvent the governance layer entirely:

- **Direct infrastructure access** -- AI system attempts to reach external systems without going through the governance
gateway
- **Protocol manipulation** -- Malformed or crafted AGP-1 messages designed to confuse the decision engine
- **Proxy circumvention** -- Attempts to interact with the tool proxy layer directly, bypassing governance

**Mitigation:** Network-level enforcement ensures AI systems can only reach the governance gateway. The tool proxy layer
is not directly addressable by AI agents.

### Manipulation Threats

Attempts to influence governance decisions through crafted inputs:

- **Parameter injection** -- Hiding harmful operations within seemingly benign parameters
- **Capability confusion** -- Requesting a low-risk capability but encoding a high-risk operation in parameters
- **Context spoofing** -- Falsifying contextual information to manipulate risk scores

**Mitigation:** Parameter schemas are validated against registered capability definitions. Risk scoring considers the
full action context, not just the capability name.

### Escalation Threats

Attempts to gain unauthorized capabilities or elevated privileges:

- **Grant escalation** -- Exploiting grant inheritance or delegation to access unauthorized capabilities
- **Trust inflation** -- Manipulating trust scores through repeated benign actions before attempting a harmful one
- **Policy gap exploitation** -- Finding combinations of policies that produce unintended allow decisions

**Mitigation:** Grants are explicit (no implicit inheritance). Trust scores are computed from long-term patterns with
decay. Policy evaluation uses deterministic precedence rules.

### Audit Threats

Attempts to compromise the integrity of the audit trail:

- **Log tampering** -- Modifying or deleting audit entries after the fact
- **Decision replay** -- Reusing a previous allow decision for a new, different action
- **Attribution spoofing** -- Falsifying actor identity to misattribute actions

**Mitigation:** Audit logs are append-only and hash-chained. Each decision includes a unique nonce. Actor identity is
cryptographically verified.

## Security Principles

1. **Defense in depth** -- Multiple independent checks (capability, authority, risk, policy) must all pass
2. **Fail-closed** -- Any failure in any subsystem results in denial, never implicit allow
3. **Zero trust for AI agents** -- AI systems are treated as untrusted by default; every action requires explicit
authorization
4. **Cryptographic integrity** -- Audit trails, actor identity, and message integrity are cryptographically enforced

## Further Reading

- [Architecture Overview](/architecture/) -- System component overview
- [Data Flow](/architecture/data-flow/) -- Protocol message lifecycle and security boundaries

> **Note:** For the full ATM-1 threat model specification, see the [aegis-governance repository](https://github.com/aegis-initiative/aegis-governance/tree/main/aegis-core/threat-model).
