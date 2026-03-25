---
title: ATX-1 Threat Matrix
description: AEGIS Threat Matrix — a structured adversarial knowledge base for agentic AI behavior
---

# ATX-1: AEGIS Threat Matrix

ATX-1 is a structured adversarial knowledge base that catalogs the ways autonomous AI agents fail, misbehave, or are exploited in real-world deployments. It fills a critical gap between two existing frameworks:

- **MITRE ATT&CK** -- Models human adversaries attacking computer systems. It does not address AI agents as threat actors or victims.
- **MITRE ATLAS** -- Models adversarial attacks against ML models (evasion, poisoning, extraction). It does not address the operational behavior of autonomous agents acting in the world.

Neither framework addresses what happens when an AI agent with legitimate tool access causes harm -- not because the model was attacked, but because nothing governed what it was allowed to do. ATX-1 exists for that space.

## The Authority-Capability Distinction

ATX-1 is built on a foundational insight: **the ability to perform an action (capability) is not the same as the right to perform it (authority)**. Most agent failures stem from this conflation. An agent that can delete files is not necessarily authorized to delete files. An agent that can read a database is not necessarily authorized to read every table.

Traditional security models enforce this distinction for human users through access control. No equivalent exists for autonomous AI agents -- until AEGIS.

## Structural Root Causes

Every ATX-1 technique traces back to one or more of four structural root causes. These are not bugs to fix but architectural gaps that require governance infrastructure:

| ID | Root Cause | Description |
|---|---|---|
| **RC1** | Missing Authority Verification | The agent has no mechanism to verify whether an instruction source has the right to issue that instruction. It cannot distinguish its owner from a stranger, or a legitimate directive from an injected one. |
| **RC2** | Missing Consequence Modeling | The agent has no way to evaluate the impact of its actions before executing them. It treats "delete one file" and "delete the production database" as equivalent operations. |
| **RC3** | Missing Behavioral Boundaries | The agent has no defined scope of permitted behavior. Without explicit boundaries, any action that appears to serve the stated goal is considered valid -- including actions far outside the original task. |
| **RC4** | Missing State Integrity Protection | The agent has no mechanism to ensure its own context, memory, or governance state has not been tampered with. Poisoned context is indistinguishable from legitimate context. |

## Structure

ATX-1 organizes adversarial behaviors into a three-level hierarchy:

- **9 Tactics** -- Categories of ungoverned behavior (the "why" -- what the agent is doing wrong)
- **20 Techniques** -- Specific failure modes within each tactic (the "how" -- the concrete behavior)
- **20 Mitigations** -- AEGIS governance mechanisms that address each technique (the "fix" -- constitutional articles and AGP protocol mechanisms)

## Empirical Foundation

ATX-1 is not a theoretical exercise. Its techniques are grounded in empirical observations from the **Agents of Chaos** study by Shapira et al. (2026), which systematically tested autonomous AI agents across 13 case studies involving real-world tool use. Every ATX-1 technique maps to at least one observed failure from that study.

The study demonstrated that current AI agents, when given tool access, reliably produce harmful outcomes -- not because of adversarial attacks on the model, but because of the absence of governance infrastructure between the agent and the tools it uses.

## Pages in This Section

- [Tactics](/threat-matrix/tactics/) -- The nine ATX-1 tactics and their descriptions
- [Techniques](/threat-matrix/techniques/) -- Full catalog of 20 techniques with case studies, severity, and mitigations
- [Regulatory Cross-Reference](/threat-matrix/regulatory-crossref/) -- Mapping to NIST AI RMF, EU AI Act, and OWASP LLM Top 10
- [Machine-Readable Formats](/threat-matrix/machine-readable/) -- STIX 2.1 bundles, JSON Schema, and programmatic access
