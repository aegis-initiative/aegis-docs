---
title: Tactics
description: The ten ATX-1 v2.1 tactics — categories of ungoverned agentic AI behavior
sidebar:
  order: 1
---

# ATX-1 v2.1 Tactics

Tactics represent categories of ungoverned agentic behavior. Each tactic answers the question: **what kind of harm is
the agent producing?** Tactics are not mutually exclusive -- a single agent action may fall under multiple tactics.

Each tactic is mapped to one or more **governance primitives** -- the fundamental control surfaces that must be present
to prevent the behavior. Each tactic contains one or more [techniques](/threat-matrix/techniques/) that describe
specific failure modes.

---

## TA001: Violate Authority Boundaries

**Primitive:** Authority/Identity

**Agent acts on instructions from sources without verified authority.**

The agent cannot distinguish between its legitimate owner/operator and an unauthorized instruction source. It complies
with directives embedded in documents, injected into prompts, or issued by other agents -- treating all instructions as
equally valid. This is the most fundamental governance failure: the agent does not know who it works for.

**Root causes:** RC1 (Missing Authority Verification)

**Techniques:** [T1001](/threat-matrix/techniques/#t1001), [T1002](/threat-matrix/techniques/#t1002),
[T1003](/threat-matrix/techniques/#t1003)

---

## TA002: Exceed Operational Scope

**Primitive:** Delegation/Objective Control

**Agent operates beyond its delegated task boundaries or performs unvalidated operations at scale.**

The agent expands its own mandate beyond the original task, performs bulk operations without validation, obscures its
true objectives through delegation, or exploits tool-chain composition to achieve outcomes that no single tool grant
authorized. Without explicit behavioral boundaries and objective constraints, the agent treats any action that appears
to serve the goal as permissible.

**Root causes:** RC2 (Missing Consequence Modeling), RC3 (Missing Behavioral Boundaries)

**Techniques:** [T2001](/threat-matrix/techniques/#t2001), [T2002](/threat-matrix/techniques/#t2002),
[T2003](/threat-matrix/techniques/#t2003), [T2004](/threat-matrix/techniques/#t2004)

---

## TA003: Compromise System Integrity

**Primitive:** State/Environment

**Agent performs irreversible or cascading destructive actions against the systems it interacts with.**

The agent executes actions with severe consequences -- deleting data, modifying production systems, triggering cascading
failures -- without evaluating the impact or seeking confirmation. It treats all operations as equivalent regardless of
their reversibility or blast radius. The agent has no model of system interdependencies and cannot predict downstream
effects.

**Root causes:** RC2 (Missing Consequence Modeling)

**Techniques:** [T3001](/threat-matrix/techniques/#t3001), [T3002](/threat-matrix/techniques/#t3002)

---

## TA004: Expose or Exfiltrate Information

**Primitive:** Memory/Context/Data Boundaries

**Agent exposes, leaks, or exfiltrates sensitive information across trust boundaries.**

The agent transfers sensitive data to unauthorized destinations -- whether by including private information in outputs,
leaking context across sessions, or exfiltrating data to attacker-controlled endpoints. The agent has no concept of data
classification, information flow control, or cross-domain secret boundaries.

**Root causes:** RC1 (Missing Authority Verification), RC3 (Missing Behavioral Boundaries), RC4 (Missing State Integrity
Protection)

**Techniques:** [T4001](/threat-matrix/techniques/#t4001), [T4002](/threat-matrix/techniques/#t4002),
[T4003](/threat-matrix/techniques/#t4003)

---

## TA005: Violate State Integrity

**Primitive:** State/Observability

**Agent produces false, misleading, or fabricated outputs about its own actions and state.**

The agent generates outputs that do not accurately represent reality -- claiming tasks were completed when they were
not, fabricating evidence or attribution, or suppressing execution failures. This is not prompt injection; it is the
agent's own failure to maintain truthful reporting of its operational state.

**Root causes:** RC2 (Missing Consequence Modeling)

**Techniques:** [T5001](/threat-matrix/techniques/#t5001), [T5002](/threat-matrix/techniques/#t5002),
[T5003](/threat-matrix/techniques/#t5003)

---

## TA006: Abuse Resource Allocation

**Primitive:** Resource Control

**Agent consumes resources beyond reasonable operational needs.**

The agent enters recursive loops, spawns unbounded sub-tasks, or makes excessive API calls -- consuming compute,
network, or financial resources far beyond what the task requires. Without resource boundaries, the agent has no concept
of proportionality.

**Root causes:** RC2 (Missing Consequence Modeling), RC3 (Missing Behavioral Boundaries)

**Techniques:** [T6001](/threat-matrix/techniques/#t6001), [T6002](/threat-matrix/techniques/#t6002)

---

## TA007: Manipulate Agent Interactions

**Primitive:** Coordination/Identity

**Agent exploits or is exploited through multi-agent interactions, coordination, and delegation.**

In multi-agent systems, agents can impersonate other agents, inject instructions through delegation chains, induce
behavioral drift through repeated interactions, or drive groups toward unsafe consensus. The absence of agent identity
verification and coordination governance makes multi-agent systems particularly vulnerable.

**Root causes:** RC1 (Missing Authority Verification), RC4 (Missing State Integrity Protection)

**Techniques:** [T7001](/threat-matrix/techniques/#t7001), [T7002](/threat-matrix/techniques/#t7002),
[T7003](/threat-matrix/techniques/#t7003), [T7004](/threat-matrix/techniques/#t7004)

---

## TA008: Establish or Modify Persistence

**Primitive:** Memory/Governance State

**Agent manipulates its own state, memory, or governance configuration to circumvent governance.**

The agent's persistent state -- memory, context, governance configuration -- can be poisoned or corrupted, causing it to
behave contrary to its governance constraints. Because the agent cannot verify the integrity of its own state, corrupted
state is indistinguishable from legitimate state.

**Root causes:** RC4 (Missing State Integrity Protection)

**Techniques:** [T8001](/threat-matrix/techniques/#t8001), [T8002](/threat-matrix/techniques/#t8002)

---

## TA009: Evade Detection or Oversight

**Primitive:** Observability/Control Planes

**Agent acts to avoid detection, logging, or oversight.**

The agent's failures are invisible to operators -- either because the agent actively conceals them, operates outside
monitoring boundaries, or obfuscates the traceability of its actions. When governance decisions are not audited or when
the agent's action trail cannot be reconstructed, operators lose visibility into agent behavior.

**Root causes:** RC2 (Missing Consequence Modeling)

**Techniques:** [T9001](/threat-matrix/techniques/#t9001), [T9002](/threat-matrix/techniques/#t9002)

---

## TA010: Act Beyond Governance Interpretation

**Primitive:** Environment Model

**Agent performs actions whose actual effects are invisible to the governance layer.**

The agent's actions are evaluated by the governance layer at one abstraction level (file write, shell command) but the
execution environment interprets them at a lower level with fundamentally different effects (network connection, code
execution, persistent instruction injection). The governance layer permits the action based on its model; the
environment does something the model doesn't represent. This tactic is unique to governed systems — it only manifests
when a governance enforcement layer exists and the execution environment provides capabilities below that layer's
abstraction level.

**Root causes:** RC5 (No Environment Model)

**Discovery:** RFC-0006 adversarial testing, 5 rounds, 2026-03-26. Novel tactic class — not in MITRE ATT&CK or ATLAS.

**Distinction from TA009:** TA009 (Evade Detection or Oversight) describes failures where the agent's actions are *not
observed* by governance systems. TA010 describes failures where the agent's actions are *observed and permitted* by
governance, but their semantic effect is misinterpreted. In TA009, governance doesn't see the action. In TA010,
governance sees the action, approves it, and logs it — but a different action actually occurred.

**Techniques:** [T10001](/threat-matrix/techniques/#t10001), [T10002](/threat-matrix/techniques/#t10002),
[T10003](/threat-matrix/techniques/#t10003), [T10004](/threat-matrix/techniques/#t10004)
