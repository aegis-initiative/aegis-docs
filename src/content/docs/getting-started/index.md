---
title: Introduction
description: What is AEGIS, who it is for, and how to get started with governed AI systems.
---

# Introduction to AEGIS

**AEGIS** (Architectural Enforcement & Governance of Intelligent Systems)
is a governance architecture that enforces deterministic constitutional
governance over AI-generated actions before they interact with
infrastructure.

> **Capability without constraint is not intelligence™**

## The Problem

Modern AI safety mechanisms primarily influence **model behavior** through alignment training, moderation systems, and
policy controls. While these approaches help guide model outputs, they do not guarantee control over what AI systems
**do** when interacting with operational infrastructure.

An AI agent that can reason well but execute without oversight is a liability. Prompt injection, jailbreaks, and
misalignment can all lead to unsafe operational outcomes -- regardless of how well the model was trained.

## The AEGIS Solution

AEGIS introduces a **governance runtime** that sits between AI reasoning and operational execution. Every action an AI
system proposes is evaluated against deterministic policies before it is allowed to proceed.

- **AI systems propose actions** via the AEGIS Governance Protocol (AGP)
- **AEGIS evaluates those actions** against capability registries, policies, and risk thresholds
- **Only approved actions are allowed to execute**

This architecture ensures that incorrect reasoning or adversarial manipulation cannot directly produce unsafe
operational outcomes.

## Who Is AEGIS For?

AEGIS is designed for organizations that deploy AI systems in operational contexts:

- **Platform engineers** building AI-assisted infrastructure automation
- **Security teams** governing AI copilots and autonomous agents in SOC environments
- **Enterprise architects** integrating AI into workflow systems with compliance requirements
- **AI developers** who want built-in governance without building it from scratch

## The AEGIS Ecosystem

| Component | Purpose |
|---|---|
| [aegis-governance](https://github.com/aegis-initiative/aegis-governance) | Architecture specifications, protocol definitions, and threat model |
| [aegis-platform](https://github.com/aegis-initiative/aegis-platform) | FastAPI governance API *(operator dashboard and hosted runtime not yet available)* |
| [aegis-sdk](https://github.com/aegis-initiative/aegis-sdk) | TypeScript and Python client libraries |
| [aegis-constitution](https://github.com/aegis-initiative/aegis-constitution) | Public governance charter |
| [aegis-ops](https://github.com/aegis-initiative/aegis-ops) | CI/CD pipelines and infrastructure-as-code |

## Next Steps

- [Quick Start](/getting-started/quick-start/) -- Install the SDK and make your first governance call *(SDK packages not
yet published; see the quick start page for details)*
- [Core Concepts](/getting-started/core-concepts/) -- Understand the governance runtime, capabilities, policies, and
risk scoring
- [Architecture Overview](/architecture/) -- See how the components fit together
