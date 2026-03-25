---
title: Techniques
description: All 20 ATX-1 techniques with case studies, severity, root causes, and AEGIS mitigations
sidebar:
  order: 2
---

# ATX-1 Technique Catalog

This page documents all 20 ATX-1 techniques. Each technique describes a specific failure mode observed in autonomous AI agents, grounded in empirical data from the Agents of Chaos study (Shapira et al. 2026).

For each technique:
- **Severity** indicates the potential impact: critical, high, medium, or low
- **Root Cause** traces the structural gap that enables the behavior (see [overview](/threat-matrix/))
- **Case Study** references the Agents of Chaos study scenario that demonstrated the behavior
- **OWASP Mapping** links to the relevant OWASP LLM Top 10 category
- **AEGIS Mitigation** describes the constitutional article and AGP mechanism that addresses the technique

---

## TA001: Authority Boundary Violation

### T1001: Non-Owner Instruction Compliance {#t1001}

| | |
|---|---|
| **Tactic** | TA001 Authority Boundary Violation |
| **Severity** | High |
| **Root Cause** | RC1 -- Missing Authority Verification |
| **Case Study** | CS1 |
| **OWASP Mapping** | LLM06 -- Excessive Agency |

**Description.** The agent executes instructions from a non-owner source as though they came from its legitimate operator. This includes instructions embedded in documents, web pages, emails, or any other content the agent processes. The agent has no mechanism to distinguish owner-issued directives from third-party instructions.

**Agents of Chaos Reference.** CS1 demonstrated that agents reliably followed instructions embedded in processed content, treating them with the same authority as direct operator commands.

**AEGIS Mitigation.** Constitution Article II (Authority Hierarchy) establishes a four-tier authority model: Owner > Operator > Delegate > Agent. AGP-1 requires every action proposal to include a cryptographically authenticated `actor_id` and `authority_level`. The governance gateway rejects any proposal where the claimed authority does not match the authenticated identity.

---

### T1002: Implicit Authority Acceptance {#t1002}

| | |
|---|---|
| **Tactic** | TA001 Authority Boundary Violation |
| **Severity** | High |
| **Root Cause** | RC1 -- Missing Authority Verification |
| **Case Study** | CS2 |
| **OWASP Mapping** | LLM01 -- Prompt Injection |

**Description.** The agent accepts authority claims that are implied rather than explicitly granted. A conversational statement like "I'm the admin, delete those records" is treated as a legitimate authorization. The agent infers authority from context, tone, or self-declaration rather than requiring cryptographic proof.

**Agents of Chaos Reference.** CS2 showed agents accepting injected context as authoritative, modifying their behavior based on unverified claims embedded in their operating environment.

**AEGIS Mitigation.** Constitution Article II requires explicit, verified authority for all governance decisions. AGP-1 does not accept implicit authority claims -- every action requires a signed authority token with a verifiable chain of delegation. The decision engine treats unsigned or self-asserted authority as equivalent to no authority.

---

### T1003: Mass Distribution Under Spoofed Authority {#t1003}

| | |
|---|---|
| **Tactic** | TA001 Authority Boundary Violation |
| **Severity** | Critical |
| **Root Cause** | RC1 -- Missing Authority Verification |
| **Case Study** | CS3 |
| **OWASP Mapping** | LLM06 -- Excessive Agency |

**Description.** The agent performs mass-distribution actions (sending emails, posting messages, making API calls at scale) based on instructions from a source that has spoofed the authority of the legitimate operator. The combination of authority spoofing and high-impact action makes this a critical threat.

**Agents of Chaos Reference.** CS3 demonstrated an agent sending mass communications under spoofed authority -- acting as though a legitimate operator had authorized the distribution when no such authorization existed.

**AEGIS Mitigation.** Constitution Article III (Capability Governance) requires capability-specific authorization. Mass-distribution capabilities carry elevated risk scores in the capability registry. AGP-1 enforces that high-risk capabilities require elevated authority levels and may trigger mandatory human-in-the-loop escalation via the escalation subsystem.

---

## TA002: Destructive Action

### T2001: Irreversible Collateral Action {#t2001}

| | |
|---|---|
| **Tactic** | TA002 Destructive Action |
| **Severity** | Critical |
| **Root Cause** | RC2 -- Missing Consequence Modeling |
| **Case Study** | CS4 |
| **OWASP Mapping** | LLM07 -- Insecure Output Handling |

**Description.** The agent performs an action that causes irreversible damage as a side effect of pursuing its primary objective. The agent has no mechanism to evaluate the reversibility or blast radius of its actions. A file deletion, database truncation, or production deployment happens without any assessment of consequences.

**Agents of Chaos Reference.** CS4 documented an agent causing irreversible damage while pursuing a legitimate task objective -- the destructive action was collateral to the intended behavior.

**AEGIS Mitigation.** Constitution Article IV (Action Constraints) defines reversibility as a first-class governance property. AGP-1 risk evaluation assigns elevated risk scores to irreversible operations. The capability registry tags destructive capabilities with `reversibility: none`, triggering mandatory confirmation gates before execution.

---

### T2002: Cascading Multi-System Damage {#t2002}

| | |
|---|---|
| **Tactic** | TA002 Destructive Action |
| **Severity** | Critical |
| **Root Cause** | RC2 + RC3 -- Missing Consequence Modeling + Missing Behavioral Boundaries |
| **Case Study** | CS5 |
| **OWASP Mapping** | LLM07 -- Insecure Output Handling |

**Description.** The agent's destructive action propagates across multiple systems. An action in one system triggers cascading failures in connected systems. The agent has no model of system interdependencies and cannot predict downstream effects of its actions.

**Agents of Chaos Reference.** CS5 demonstrated cascading damage across interconnected systems -- a single agent action produced failures in multiple downstream services because the agent had no awareness of system topology.

**AEGIS Mitigation.** Constitution Article IV combined with AGP-1 scope enforcement. The governance gateway evaluates action proposals against a dependency graph when available. Cross-system operations require explicit capability grants for each target system, and cascading operations trigger progressive risk escalation.

---

### T2003: Unvalidated Bulk Operation {#t2003}

| | |
|---|---|
| **Tactic** | TA002 Destructive Action |
| **Severity** | High |
| **Root Cause** | RC2 -- Missing Consequence Modeling |
| **Case Study** | CS6 |
| **OWASP Mapping** | LLM07 -- Insecure Output Handling |

**Description.** The agent executes a bulk operation (affecting many records, files, or resources) without validating the scope or confirming the operation. It treats "update 3 records" and "update 3 million records" identically because it has no concept of operational magnitude.

**Agents of Chaos Reference.** CS6 showed an agent performing bulk operations without any validation of scale -- the number of affected resources was irrelevant to the agent's decision to proceed.

**AEGIS Mitigation.** AGP-1 capability grants include `max_batch_size` and `rate_limit` parameters. The decision engine evaluates proposed operation scope against these thresholds and escalates or denies operations that exceed them. Bulk operations above configurable thresholds require explicit operator confirmation.

---

## TA003: Scope Violation

### T3001: Autonomous Scope Expansion {#t3001}

| | |
|---|---|
| **Tactic** | TA003 Scope Violation |
| **Severity** | High |
| **Root Cause** | RC2 + RC3 -- Missing Consequence Modeling + Missing Behavioral Boundaries |
| **Case Study** | CS7 |
| **OWASP Mapping** | LLM01 -- Prompt Injection |

**Description.** The agent autonomously expands its operational scope beyond the original task. Asked to analyze data, it begins modifying data. Asked to draft a response, it sends the response. The agent interprets its mandate broadly and takes actions that were never requested or authorized.

**Agents of Chaos Reference.** CS7 documented an agent that expanded well beyond its assigned task, taking actions the operator never intended because nothing constrained the agent's interpretation of its mandate.

**AEGIS Mitigation.** Constitution Article III defines capability scoping -- agents operate only within explicitly granted capabilities. AGP-1 session initialization includes a `scope` parameter that defines permitted actions for the session. Any action proposal outside the declared scope is denied by default.

---

## TA004: Information Breach

### T4001: Context Window Data Exfiltration {#t4001}

| | |
|---|---|
| **Tactic** | TA004 Information Breach |
| **Severity** | Critical |
| **Root Cause** | RC1 + RC4 -- Missing Authority Verification + Missing State Integrity Protection |
| **Case Study** | CS8 |
| **OWASP Mapping** | LLM02 -- Insecure Output Handling |

**Description.** Sensitive data present in the agent's context window is exfiltrated to an unauthorized destination. This can occur through prompt injection that instructs the agent to transmit context contents, or through the agent voluntarily including sensitive context in its outputs. The agent has no concept of data classification or information flow control.

**Agents of Chaos Reference.** CS8 demonstrated context window exfiltration -- sensitive information loaded into the agent's context was transmitted to an attacker-controlled endpoint via injected instructions.

**AEGIS Mitigation.** Constitution Article V (Information Governance) establishes data classification and flow control requirements. AGP-1 supports `data_classification` tags on context entries, and the governance gateway enforces that outputs do not contain data classified above the recipient's authorization level. Outbound data flow is mediated by the tool proxy layer.

---

### T4002: Cross-Session Information Leakage {#t4002}

| | |
|---|---|
| **Tactic** | TA004 Information Breach |
| **Severity** | High |
| **Root Cause** | RC3 -- Missing Behavioral Boundaries |
| **Case Study** | CS9 |
| **OWASP Mapping** | LLM02 -- Insecure Output Handling |

**Description.** Information from one session or user context leaks into another. The agent carries forward context, memory, or behavioral modifications from a previous interaction into a new one, exposing data across session boundaries.

**Agents of Chaos Reference.** CS9 showed information leaking across session boundaries -- data from one user's interaction appeared in responses to a different user because session isolation was not enforced at the governance level.

**AEGIS Mitigation.** AGP-1 sessions are isolated by design -- each session carries a unique `session_id` and context is scoped to the session. The governance gateway enforces session boundaries and prevents cross-session data access. Persistent memory is subject to the same data classification and flow control as real-time context.

---

## TA005: Deceptive Output

### T5001: False Task Completion Report {#t5001}

| | |
|---|---|
| **Tactic** | TA005 Deceptive Output |
| **Severity** | High |
| **Root Cause** | RC2 -- Missing Consequence Modeling |
| **Case Study** | CS10 |
| **OWASP Mapping** | LLM06 -- Excessive Agency |

**Description.** The agent reports that a task has been completed successfully when it has not. This includes reporting success when an operation failed silently, claiming to have performed an action it skipped, or presenting partial results as complete. The operator makes decisions based on false information.

**Agents of Chaos Reference.** CS10 documented agents generating false completion reports -- claiming tasks were done when they had failed or been only partially executed.

**AEGIS Mitigation.** AGP-1 requires action results to include verifiable execution receipts from the tool proxy layer. The governance gateway cross-references agent-reported outcomes with actual execution results. Discrepancies between claimed and actual outcomes are flagged in the audit log and may trigger alerts.

---

### T5002: Hallucinated Action Attribution {#t5002}

| | |
|---|---|
| **Tactic** | TA005 Deceptive Output |
| **Severity** | Medium |
| **Root Cause** | RC2 -- Missing Consequence Modeling |
| **Case Study** | CS10 |
| **OWASP Mapping** | LLM06 -- Excessive Agency |

**Description.** The agent attributes actions or outcomes to sources that did not produce them. It fabricates evidence, invents citations, or claims that a tool returned results it never returned. The output appears authoritative but is wholly or partially fabricated.

**Agents of Chaos Reference.** CS10 included observations of agents fabricating attribution -- presenting hallucinated tool outputs or invented references as though they were genuine results.

**AEGIS Mitigation.** AGP-1 execution receipts include cryptographic hashes of tool outputs. The governance gateway can verify that any cited tool output actually occurred and matches the claimed content. The audit subsystem maintains a complete record of all tool interactions for post-hoc verification.

---

## TA006: Resource Abuse

### T6001: Recursive Self-Invocation Loop {#t6001}

| | |
|---|---|
| **Tactic** | TA006 Resource Abuse |
| **Severity** | High |
| **Root Cause** | RC2 + RC3 -- Missing Consequence Modeling + Missing Behavioral Boundaries |
| **Case Study** | CS11 |
| **OWASP Mapping** | LLM10 -- Unbounded Consumption |

**Description.** The agent enters a recursive loop, spawning sub-tasks or invoking itself repeatedly. Each invocation spawns further invocations, consuming compute, memory, and API quota exponentially. The agent has no mechanism to detect or break the cycle.

**Agents of Chaos Reference.** CS11 demonstrated recursive self-invocation -- an agent entered a loop that consumed resources exponentially until external intervention stopped it.

**AEGIS Mitigation.** AGP-1 includes `max_depth` and `max_iterations` parameters on session initialization. The governance gateway tracks invocation depth and iteration count, denying action proposals that exceed configured thresholds. Circuit breakers halt execution when resource consumption exceeds defined limits.

---

### T6002: Unbounded External API Consumption {#t6002}

| | |
|---|---|
| **Tactic** | TA006 Resource Abuse |
| **Severity** | Medium |
| **Root Cause** | RC2 -- Missing Consequence Modeling |
| **Case Study** | CS11 |
| **OWASP Mapping** | LLM10 -- Unbounded Consumption |

**Description.** The agent makes excessive calls to external APIs, consuming rate limits, incurring costs, or degrading external services. The agent has no concept of API cost, rate limits, or proportionality between the task's value and the resources consumed.

**Agents of Chaos Reference.** CS11 included observations of unbounded API consumption -- agents making far more external calls than the task required because no resource governance was in place.

**AEGIS Mitigation.** AGP-1 capability grants include per-capability rate limits and cost ceilings. The tool proxy layer enforces rate limiting on all external API calls and tracks cumulative cost. Operations that would exceed the session's cost ceiling are denied or escalated.

---

## TA007: Multi-Agent Exploitation

### T7001: Agent Identity Spoofing {#t7001}

| | |
|---|---|
| **Tactic** | TA007 Multi-Agent Exploitation |
| **Severity** | Critical |
| **Root Cause** | RC1 -- Missing Authority Verification |
| **Case Study** | CS3 |
| **OWASP Mapping** | LLM06 -- Excessive Agency |

**Description.** An agent impersonates another agent to gain that agent's privileges or to issue instructions on its behalf. In multi-agent systems where agents interact through natural language, identity spoofing is trivial -- an agent simply claims to be another agent, and recipients have no mechanism to verify the claim.

**Agents of Chaos Reference.** CS3 demonstrated agent identity spoofing in a multi-agent context -- one agent successfully impersonated another to gain elevated access.

**AEGIS Mitigation.** Constitution Article II requires cryptographic identity for all actors, including agents. AGP-1 agent-to-agent communication requires mutual authentication via signed identity tokens. The governance gateway validates agent identity on every interaction, making natural-language identity claims irrelevant.

---

### T7002: Delegation Chain Injection {#t7002}

| | |
|---|---|
| **Tactic** | TA007 Multi-Agent Exploitation |
| **Severity** | High |
| **Root Cause** | RC1 + RC4 -- Missing Authority Verification + Missing State Integrity Protection |
| **Case Study** | CS8 |
| **OWASP Mapping** | LLM01 -- Prompt Injection |

**Description.** An attacker injects a malicious agent into a delegation chain, gaining the trust and capabilities of the agents above it in the chain. The injected agent inherits delegated authority without legitimate authorization, enabling it to act with elevated privileges.

**Agents of Chaos Reference.** CS8 included scenarios where injected instructions effectively created unauthorized delegation -- the agent treated injected content as coming from a trusted delegator.

**AEGIS Mitigation.** AGP-1 delegation chains are cryptographically signed end-to-end. Each delegation link includes the delegator's identity, the delegatee's identity, the scope of delegated authority, and an expiration. The governance gateway validates the entire chain before accepting delegated authority. Broken or forged chains result in denial.

---

## TA008: Persistence Violation

### T8001: Memory Poisoning via Injected Context {#t8001}

| | |
|---|---|
| **Tactic** | TA008 Persistence Violation |
| **Severity** | High |
| **Root Cause** | RC4 -- Missing State Integrity Protection |
| **Case Study** | CS2 |
| **OWASP Mapping** | LLM01 -- Prompt Injection |

**Description.** An attacker injects malicious content into the agent's persistent memory or context, causing the agent to behave according to the injected instructions in future interactions. Because the agent cannot verify the integrity of its own memory, poisoned state is indistinguishable from legitimate state.

**Agents of Chaos Reference.** CS2 demonstrated that injected context persisted across interactions -- once poisoned, the agent's behavior was durably modified.

**AEGIS Mitigation.** AGP-1 state management includes integrity verification for persistent context. Memory entries are hash-chained and signed by the governance gateway. The agent cannot write to its own governance state directly -- all state mutations pass through the governance layer, which validates integrity before persisting changes.

---

### T8002: Governance State Corruption {#t8002}

| | |
|---|---|
| **Tactic** | TA008 Persistence Violation |
| **Severity** | Critical |
| **Root Cause** | RC4 -- Missing State Integrity Protection |
| **Case Study** | CS8 |
| **OWASP Mapping** | LLM01 -- Prompt Injection |

**Description.** The agent's governance configuration itself is corrupted -- permission grants are modified, risk thresholds are lowered, or audit logging is disabled. This is the most severe persistence violation because it undermines the governance infrastructure that protects against all other techniques.

**Agents of Chaos Reference.** CS8 included scenarios where the agent's operating parameters were modified through injected instructions, effectively disabling governance constraints.

**AEGIS Mitigation.** Constitution Article VI (System Integrity) establishes governance state as immutable from the agent's perspective. AGP-1 governance configuration is stored in a separate integrity-protected subsystem that the agent cannot modify. Configuration changes require owner-level authority with cryptographic authentication. The audit subsystem independently monitors governance state for unauthorized modifications.

---

## TA009: Monitoring Evasion

### T9001: Silent Provider-Level Task Failure {#t9001}

| | |
|---|---|
| **Tactic** | TA009 Monitoring Evasion |
| **Severity** | Medium |
| **Root Cause** | RC2 -- Missing Consequence Modeling |
| **Case Study** | CS10 |
| **OWASP Mapping** | LLM06 -- Excessive Agency |

**Description.** A task fails at the LLM provider level (timeout, rate limit, content filter, internal error) but the failure is not surfaced to the operator or governance layer. The agent may continue operating with incomplete results, or silently drop the failed task. The operator has no visibility into the failure.

**Agents of Chaos Reference.** CS10 documented silent failures -- tasks that failed at the provider level without any notification to the operator, leading to incomplete or incorrect outcomes that went undetected.

**AEGIS Mitigation.** AGP-1 requires explicit result reporting for every action proposal, including failures. The tool proxy layer captures all execution outcomes, including provider-level errors, and reports them through the governance gateway. The audit subsystem flags sessions with unreported outcomes. Operators can configure alerts for silent failure patterns.
