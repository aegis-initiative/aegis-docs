---
title: ATX-1 Threat Matrix
description: AEGIS Threat Matrix — a structured adversarial knowledge base for agentic AI behavior
---

<!-- cspell:ignore unvalidated Unvalidated exfiltrates exfiltrating exfiltrated exfiltration chokepoint homoglyphs metacharacters Metacharacter -->

# ATX-1 v2.3: AEGIS Threat Matrix

ATX-1 is a structured adversarial knowledge base that catalogs the ways autonomous AI agents fail, misbehave, or are
exploited in real-world deployments. It fills a critical gap between two existing frameworks:

- **MITRE ATT&CK** -- Models human adversaries attacking computer systems. It does not address AI agents as threat
actors or victims.
- **MITRE ATLAS** -- Models adversarial attacks against ML models (evasion, poisoning, extraction). It does not address
the operational behavior of autonomous agents acting in the world.

Neither framework addresses what happens when an AI agent with legitimate tool access causes harm -- not because the
model was attacked, but because nothing governed what it was allowed to do. ATX-1 exists for that space.

## The Authority-Capability Distinction

ATX-1 is built on a foundational insight: **the ability to perform an action (capability) is not the same as the right
to perform it (authority)**. Most agent failures stem from this conflation. An agent that can delete files is not
necessarily authorized to delete files. An agent that can read a database is not necessarily authorized to read every
table.

Traditional security models enforce this distinction for human users through access control. No equivalent exists for
autonomous AI agents -- until AEGIS.

## Structural Root Causes

Every ATX-1 technique traces back to one or more of four structural root causes. These are not bugs to fix but
architectural gaps that require governance infrastructure:

| ID | Root Cause | Description |
|---|---|---|
| **RC1** | Missing Authority Verification | The agent has no mechanism to verify whether an instruction source has the right to issue that instruction. It cannot distinguish its owner from a stranger, or a legitimate directive from an injected one. |
| **RC2** | Missing Consequence Modeling | The agent has no way to evaluate the impact of its actions before executing them. It treats "delete one file" and "delete the production database" as equivalent operations. |
| **RC3** | Missing Behavioral Boundaries | The agent has no defined scope of permitted behavior. Without explicit boundaries, any action that appears to serve the stated goal is considered valid -- including actions far outside the original task. |
| **RC4** | Missing State Integrity Protection | The agent has no mechanism to ensure its own context, memory, or governance state has not been tampered with. Poisoned context is indistinguishable from legitimate context. |
| **RC5** | No Environment Model | The governance layer operates on an abstraction of the execution environment but lacks a complete model of what the environment actually does with permitted actions. A file write may be a network connection; a permitted command may execute deferred code. |

## Governance Primitives

ATX-1 v2.3 maps each tactic to one or more governance primitives -- the fundamental control surfaces that must be
present in any agent governance system:

| Primitive | Description | Tactics |
|---|---|---|
| **Authority/Identity** | Verification of who issued an instruction and whether they have the right to do so | TA001, TA007 |
| **Delegation/Objective Control** | Constraining what the agent is allowed to do and ensuring task scope is maintained | TA002 |
| **State/Environment** | Protecting the integrity of systems the agent interacts with | TA003 |
| **Memory/Context/Data Boundaries** | Controlling information flow across sessions, contexts, and trust domains | TA004 |
| **State/Observability** | Ensuring accurate reporting and attribution of agent actions | TA005 |
| **Resource Control** | Bounding the computational and financial resources an agent may consume | TA006 |
| **Coordination/Identity** | Governing multi-agent interactions, delegation chains, and collective behavior | TA007 |
| **Memory/Governance State** | Protecting the agent's persistent memory and governance configuration from corruption | TA008 |
| **Observability/Control Planes** | Ensuring all agent behavior is visible to operators and oversight systems | TA009 |
| **Environment Model** | Maintaining a complete model of what the execution environment actually does with permitted actions | TA010 |

## Structure

ATX-1 v2.3 organizes adversarial behaviors into a three-level hierarchy:

- **10 Tactics** -- Categories of ungoverned behavior (the "why" -- what the agent is doing wrong)
- **29 Techniques** -- Specific failure modes within each tactic (the "how" -- the concrete behavior)
- **29 Mitigations** -- AEGIS governance mechanisms that address each technique (the "fix" -- constitutional articles
and AGP protocol mechanisms)

## Empirical Foundation

ATX-1 is grounded in two empirical sources:

1. **Agents of Chaos** (Shapira et al., 2026) -- Systematic testing of autonomous AI agents across 13 case studies
involving real-world tool use. Techniques T1001–T9002 map to observed failures from this study.

2. **RFC-0006 Adversarial Testing** (AEGIS Initiative, 2026-03-26) -- Five rounds of white-box adversarial testing
against the AEGIS Claude Code Plugin governance enforcement layer. This testing discovered a novel tactic class (TA010:
Act Beyond Governance Interpretation) and 4 techniques (T10001–T10004) that are only visible when a governance layer
exists and is adversarially tested against the execution environment.

## Pages in This Section

- [Tactics](/threat-matrix/tactics/) -- The ten ATX-1 tactics and their descriptions
- [Techniques](/threat-matrix/techniques/) -- Full catalog of 29 techniques with case studies, root causes, and mitigations
- [Regulatory Cross-Reference](/threat-matrix/regulatory-crossref/) -- Mapping to NIST AI RMF, EU AI Act, and OWASP LLM
Top 10
- [Machine-Readable Formats](/threat-matrix/machine-readable/) -- STIX 2.1 bundles, JSON Schema, and programmatic access
