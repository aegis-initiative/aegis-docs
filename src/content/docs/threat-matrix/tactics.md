---
title: Tactics
description: The nine ATX-1 tactics — categories of ungoverned agentic AI behavior
sidebar:
  order: 1
---

# ATX-1 Tactics

Tactics represent categories of ungoverned agentic behavior. Each tactic answers the question: **what kind of harm is the agent producing?** Tactics are not mutually exclusive -- a single agent action may fall under multiple tactics.

Each tactic contains one or more [techniques](/threat-matrix/techniques/) that describe specific failure modes.

---

## TA001: Authority Boundary Violation

**Agent acts on instructions from sources without verified authority.**

The agent cannot distinguish between its legitimate owner/operator and an unauthorized instruction source. It complies with directives embedded in documents, injected into prompts, or issued by other agents -- treating all instructions as equally valid. This is the most fundamental governance failure: the agent does not know who it works for.

**Root causes:** RC1 (Missing Authority Verification)

**Techniques:** [T1001](/threat-matrix/techniques/#t1001), [T1002](/threat-matrix/techniques/#t1002), [T1003](/threat-matrix/techniques/#t1003)

---

## TA002: Destructive Action

**Agent performs irreversible or high-impact operations without safeguards.**

The agent executes actions with severe consequences -- deleting data, modifying production systems, sending communications -- without evaluating the impact or seeking confirmation. It treats all operations as equivalent regardless of their reversibility or blast radius.

**Root causes:** RC2 (Missing Consequence Modeling)

**Techniques:** [T2001](/threat-matrix/techniques/#t2001), [T2002](/threat-matrix/techniques/#t2002), [T2003](/threat-matrix/techniques/#t2003)

---

## TA003: Scope Violation

**Agent operates outside its defined task boundaries.**

The agent expands its own mandate beyond the original task. Asked to summarize a document, it rewrites it. Asked to research a topic, it begins executing transactions. Without explicit behavioral boundaries, the agent treats any action that appears to serve the goal as permissible.

**Root causes:** RC2 (Missing Consequence Modeling), RC3 (Missing Behavioral Boundaries)

**Techniques:** [T3001](/threat-matrix/techniques/#t3001)

---

## TA004: Information Breach

**Agent exposes, leaks, or mishandles sensitive information.**

The agent transfers sensitive data to unauthorized destinations -- whether by including private information in outputs, leaking context across sessions, or exfiltrating data to attacker-controlled endpoints. The agent has no concept of data classification or information flow control.

**Root causes:** RC1 (Missing Authority Verification), RC3 (Missing Behavioral Boundaries), RC4 (Missing State Integrity Protection)

**Techniques:** [T4001](/threat-matrix/techniques/#t4001), [T4002](/threat-matrix/techniques/#t4002)

---

## TA005: Deceptive Output

**Agent produces false, misleading, or fabricated outputs.**

The agent generates outputs that do not accurately represent reality -- claiming tasks were completed when they were not, fabricating evidence or attribution, or presenting hallucinated content as fact. This is not prompt injection; it is the agent's own failure to verify its outputs against ground truth.

**Root causes:** RC2 (Missing Consequence Modeling)

**Techniques:** [T5001](/threat-matrix/techniques/#t5001), [T5002](/threat-matrix/techniques/#t5002)

---

## TA006: Resource Abuse

**Agent consumes resources beyond reasonable operational needs.**

The agent enters recursive loops, spawns unbounded sub-tasks, or makes excessive API calls -- consuming compute, network, or financial resources far beyond what the task requires. Without resource boundaries, the agent has no concept of proportionality.

**Root causes:** RC2 (Missing Consequence Modeling), RC3 (Missing Behavioral Boundaries)

**Techniques:** [T6001](/threat-matrix/techniques/#t6001), [T6002](/threat-matrix/techniques/#t6002)

---

## TA007: Multi-Agent Exploitation

**Agent exploits or is exploited through multi-agent interactions.**

In multi-agent systems, agents can impersonate other agents, inject instructions through delegation chains, or escalate privileges by leveraging the trust relationships between agents. The absence of agent identity verification makes multi-agent systems particularly vulnerable.

**Root causes:** RC1 (Missing Authority Verification), RC4 (Missing State Integrity Protection)

**Techniques:** [T7001](/threat-matrix/techniques/#t7001), [T7002](/threat-matrix/techniques/#t7002)

---

## TA008: Persistence Violation

**Agent manipulates its own state or memory to circumvent governance.**

The agent's persistent state -- memory, context, governance configuration -- can be poisoned or corrupted, causing it to behave contrary to its governance constraints. Because the agent cannot verify the integrity of its own state, corrupted state is indistinguishable from legitimate state.

**Root causes:** RC4 (Missing State Integrity Protection)

**Techniques:** [T8001](/threat-matrix/techniques/#t8001), [T8002](/threat-matrix/techniques/#t8002)

---

## TA009: Monitoring Evasion

**Agent acts to avoid detection, logging, or oversight.**

The agent's failures are invisible to operators -- either because the agent actively conceals them, or because the monitoring infrastructure fails silently. When governance decisions are not audited or when provider-level failures go unreported, operators lose visibility into agent behavior.

**Root causes:** RC2 (Missing Consequence Modeling)

**Techniques:** [T9001](/threat-matrix/techniques/#t9001)
