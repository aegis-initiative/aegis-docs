---
title: Regulatory Cross-Reference
description: ATX-1 techniques mapped to NIST AI RMF, EU AI Act, and OWASP LLM Top 10
sidebar:
  order: 3
---

# Regulatory Cross-Reference

ATX-1 is a technical threat matrix, but the behaviors it catalogs have direct regulatory implications. This page maps
ATX-1 techniques to three major regulatory and standards frameworks, enabling organizations to use ATX-1 as a compliance
bridge between agentic AI risk and existing obligations.

## How to Use This Cross-Reference

1. **Starting from a regulation** -- If you need to demonstrate compliance with a specific NIST function, EU AI Act
article, or OWASP category, find the relevant row and identify which ATX-1 techniques are implicated. Then review those
techniques' AEGIS mitigations for implementation guidance.

2. **Starting from a technique** -- If you have identified an ATX-1 technique as relevant to your deployment, use these
tables to understand which regulatory obligations it touches.

3. **Gap analysis** -- Compare your current controls against both the ATX-1 mitigations and the regulatory requirements.
Gaps in one are likely gaps in the other.

---

## NIST AI Risk Management Framework (AI RMF 1.0)

The NIST AI RMF organizes AI risk management into four functions: Govern, Map, Measure, and Manage. ATX-1 techniques map
primarily to Map (identifying risks) and Manage (implementing controls), with governance infrastructure touching Govern.

| Technique | NIST Function | NIST Category | Rationale |
|---|---|---|---|
| T1001 | Map, Manage | MAP 3.5, MG 2.2 | Third-party instruction risks require identification (Map) and access controls (Manage) |
| T1002 | Map, Manage | MAP 3.5, MG 2.2 | Implicit authority acceptance is an identified risk requiring authentication controls |
| T1003 | Map, Manage | MAP 5.1, MG 2.2, MG 3.1 | Mass distribution under spoofed authority involves both impact assessment and incident response |
| T2001 | Measure, Manage | MS 2.6, MG 2.3 | Irreversible actions require impact measurement and pre-deployment safeguards |
| T2002 | Measure, Manage | MS 2.6, MG 2.3, MG 3.1 | Cascading damage requires systemic risk measurement and incident management |
| T2003 | Manage | MG 2.3, MG 2.4 | Bulk operations require operational controls and escalation procedures |
| T3001 | Map, Manage | MAP 3.4, MG 2.2 | Scope expansion is a behavioral risk requiring boundary definition and enforcement |
| T4001 | Map, Manage | MAP 5.2, MG 2.4 | Data exfiltration requires data flow mapping and information security controls |
| T4002 | Map, Manage | MAP 5.2, MG 2.4 | Cross-session leakage requires session isolation mapping and enforcement |
| T5001 | Measure, Manage | MS 2.7, MG 3.2 | False reporting requires output verification and monitoring |
| T5002 | Measure | MS 2.7 | Hallucinated attribution requires output accuracy measurement |
| T6001 | Manage | MG 2.3, MG 2.4 | Resource loops require operational controls and circuit breakers |
| T6002 | Manage | MG 2.3, MG 2.4 | API overconsumption requires rate limiting and cost controls |
| T7001 | Map, Manage | MAP 3.5, MG 2.2 | Agent spoofing requires identity risk mapping and authentication controls |
| T7002 | Map, Manage | MAP 3.5, MG 2.2 | Delegation injection requires trust chain mapping and cryptographic verification |
| T8001 | Map, Manage | MAP 5.2, MG 2.4 | Memory poisoning requires state integrity mapping and protection |
| T8002 | Govern, Manage | GV 1.3, MG 2.4 | Governance corruption touches foundational governance and integrity controls |
| T9001 | Measure, Manage | MS 2.5, MG 3.2 | Silent failures require monitoring coverage measurement and alerting |

---

## EU AI Act

The EU AI Act (Regulation 2024/1689) establishes requirements for high-risk AI systems. Agentic AI systems that make
autonomous decisions affecting individuals or critical infrastructure fall under high-risk classification. The following
mapping identifies which ATX-1 techniques are relevant to specific EU AI Act obligations.

| Technique | EU AI Act Article | Obligation | Relevance |
|---|---|---|---|
| T1001, T1002, T1003 | Art. 9 (Risk Management) | Identify and mitigate risks | Authority boundary violations are foreseeable risks in agentic deployments |
| T1001, T1002 | Art. 14 (Human Oversight) | Ensure human oversight capability | Agents that accept unauthorized instructions undermine human oversight |
| T2001, T2002, T2003 | Art. 9 (Risk Management) | Identify and mitigate risks | Destructive actions without safeguards are foreseeable high-impact risks |
| T2001, T2002 | Art. 15 (Accuracy, Robustness, Cybersecurity) | Ensure resilience against errors | Irreversible and cascading failures demonstrate insufficient robustness |
| T3001 | Art. 9 (Risk Management) | Identify and mitigate risks | Autonomous scope expansion is a foreseeable behavioral risk |
| T3001 | Art. 14 (Human Oversight) | Ensure human oversight capability | Scope expansion undermines operator control |
| T4001, T4002 | Art. 10 (Data Governance) | Ensure appropriate data governance | Information breaches violate data handling requirements |
| T4001, T4002 | Art. 15 (Accuracy, Robustness, Cybersecurity) | Protect against data breaches | Exfiltration and leakage are cybersecurity failures |
| T5001, T5002 | Art. 13 (Transparency) | Ensure transparency of outputs | False completion reports and hallucinated attribution violate transparency |
| T5001, T5002 | Art. 15 (Accuracy, Robustness, Cybersecurity) | Ensure accuracy | Deceptive outputs are accuracy failures |
| T6001, T6002 | Art. 15 (Accuracy, Robustness, Cybersecurity) | Ensure robustness | Unbounded resource consumption demonstrates insufficient robustness |
| T7001, T7002 | Art. 15 (Accuracy, Robustness, Cybersecurity) | Protect against manipulation | Multi-agent exploitation is a cybersecurity concern |
| T8001, T8002 | Art. 15 (Accuracy, Robustness, Cybersecurity) | Protect against manipulation | State corruption is a cybersecurity and integrity concern |
| T8002 | Art. 9 (Risk Management) | Maintain risk management system | Governance state corruption undermines the risk management system itself |
| T9001 | Art. 12 (Record-Keeping) | Maintain logs for traceability | Silent failures undermine the record-keeping obligation |
| T9001 | Art. 14 (Human Oversight) | Enable effective oversight | Undetected failures make human oversight impossible |

---

## OWASP LLM Top 10 (2025)

The OWASP Top 10 for LLM Applications identifies security risks specific to large language model deployments. ATX-1
techniques map to a subset of these categories, focused on the operational risks of agentic behavior rather than
model-level vulnerabilities.

| OWASP Category | ATX-1 Techniques | Relationship |
|---|---|---|
| **LLM01 -- Prompt Injection** | T1002, T3001, T7002, T8001, T8002 | Prompt injection is the attack vector; ATX-1 catalogs the operational consequences. ATX-1 techniques describe what happens after a successful injection -- scope expansion, delegation chain compromise, memory poisoning, governance corruption. |
| **LLM02 -- Insecure Output Handling** | T4001, T4002 | Insecure output handling enables information breaches. ATX-1 adds the agentic dimension -- agents actively exfiltrating data or leaking it across sessions, not just producing unsafe outputs. |
| **LLM06 -- Excessive Agency** | T1001, T1003, T5001, T5002, T7001, T9001 | Excessive agency is the broadest overlap. OWASP identifies the risk class; ATX-1 decomposes it into specific failure modes with distinct root causes and mitigations. |
| **LLM07 -- Insecure Output Handling** | T2001, T2002, T2003 | Destructive actions map to insecure output handling in the agentic context -- the "output" is a tool invocation with real-world consequences. |
| **LLM10 -- Unbounded Consumption** | T6001, T6002 | Direct mapping. ATX-1 adds the agentic context -- recursive self-invocation and unbounded API consumption as specific agent failure modes. |

---

## Cross-Framework Coverage

The three frameworks provide complementary coverage:

- **NIST AI RMF** provides the governance and process structure -- how to organize risk management for agentic AI
- **EU AI Act** provides the legal obligations -- what is required for compliant deployment of high-risk agentic systems
- **OWASP LLM Top 10** provides the technical vulnerability taxonomy -- where the security weaknesses lie

ATX-1 bridges all three by providing the operational failure taxonomy -- **what actually goes wrong** when autonomous
agents operate without governance. Organizations can use ATX-1 as the connective tissue between their technical security
posture (OWASP), their risk management process (NIST), and their legal compliance obligations (EU AI Act).

For the machine-readable version of these mappings, see [Machine-Readable Formats](/threat-matrix/machine-readable/).
