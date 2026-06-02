---
title: MCP Integration
description: Connect AI agents to AEGIS governance through the Model Context Protocol -- transparent enforcement with no agent opt-in required.
---

# MCP Integration

AEGIS ships as a **Model Context Protocol (MCP) server**. Any MCP-compatible AI agent -- Claude Code, Cursor, VS Code
Copilot, or custom agents built on LangChain, CrewAI, or the Anthropic SDK -- can connect and have its tool calls
transparently governed.

The agent sees its tools and calls them normally. Every call passes through the AEGIS governance gateway before the
underlying tool executes. If denied, the tool never runs. The agent has no bypass path.

**Enforcement is the default.** The agent does not choose to be governed -- it is governed by the infrastructure it
connects to.

## Architecture

AEGIS provides two MCP server implementations:

| Server | Backed by | Use case |
|--------|-----------|----------|
| `aegis_core.mcp` | Local `AEGISRuntime` (in-process) | Development, testing, self-hosted |
| `mcp_bridge.py` | AEGIS Platform HTTP API | Production, managed governance |

Both expose the same MCP interface. The agent does not know or care whether governance runs locally or on the platform.

```
                  +---------------------+
MCP Client  ----> |  aegis_core.mcp     | ----> Local AEGISRuntime
(stdio)           |  (embeddable)       |       (in-process)
                  +---------------------+

                  +---------------------+
MCP Client  ----> |  mcp_bridge.py      | ----> AEGIS Platform API
(stdio)           |  (platform bridge)  |       (HTTP)
                  +---------------------+
```

## Quick Start: Local Server

### 1. Install aegis-core

```bash
pip install aegis-core
```

Or from source:

```bash
cd aegis-core/core-py
pip install -e .
```

### 2. Start the MCP server

```bash
python -m aegis_core.mcp
```

This starts a demo governance configuration that demonstrates all four outcomes:

- `file.read` on `/home/*` or `/data/*` -- **ALLOW**
- `file.write` anywhere -- **DENY**
- `network.fetch` -- **ESCALATE** (requires elevated review)
- `shell.exec` -- **REQUIRE_CONFIRMATION** (requires human approval)

### 3. Configure your MCP client

Add the AEGIS server to your client's MCP configuration.

**Claude Code** (`settings.json` or project `.claude/settings.json`):

```json
{
  "mcpServers": {
    "aegis": {
      "command": "python",
      "args": ["-m", "aegis_core.mcp"]
    }
  }
}
```

**Cursor** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "aegis": {
      "command": "python",
      "args": ["-m", "aegis_core.mcp"]
    }
  }
}
```

**VS Code** (`.vscode/mcp.json`):

```json
{
  "servers": {
    "aegis": {
      "command": "python",
      "args": ["-m", "aegis_core.mcp"]
    }
  }
}
```

### 4. Use it

Once connected, the agent can inspect governance state through three observability tools:

- `aegis_capabilities` -- list what the agent is permitted to do
- `aegis_policies` -- list the governance rules in effect
- `aegis_audit` -- query the audit trail of past decisions

These are read-only observability tools. Enforcement happens transparently on every governed tool call.

## Quick Start: Platform Bridge

For production deployments where governance runs on the hosted AEGIS Platform:

```bash
python mcp_bridge.py --api-url https://your-platform.aegis-platform.net --api-key YOUR_KEY
```

MCP client configuration:

```json
{
  "mcpServers": {
    "aegis": {
      "command": "python",
      "args": [
        "path/to/mcp_bridge.py",
        "--api-url", "https://your-platform.aegis-platform.net",
        "--api-key", "YOUR_KEY"
      ]
    }
  }
}
```

The bridge exposes the same tools as the local server, plus:

- `aegis_decisions` -- list recent governance decisions from the platform
- `aegis_health` -- check platform API health

## Registering Governed Tools

The default server exposes governance observability tools. To **wrap real tools with governance enforcement**, register
them programmatically:

```python
from aegis_core import AEGISRuntime
from aegis_core.mcp_server import AEGISMCPServer

runtime = AEGISRuntime()
# ... configure capabilities and policies ...

server = AEGISMCPServer(runtime, agent_id="my-agent")

# Register a tool -- every call goes through the governance gateway
server.register_tool(
    name="read_file",
    fn=my_read_function,
    description="Read a file from disk",
    target="/data/*",
    input_schema={
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "File path to read"}
        },
        "required": ["path"],
    },
)

server.run_stdio()
```

When the agent calls `read_file`, the server:

1. Submits the call to the governance gateway as an `ACTION_PROPOSE`
2. The gateway validates the request (replay detection, rate limiting, dangerous pattern checks)
3. The decision engine evaluates capability + policy + risk
4. If **APPROVED** -- the tool function executes and the result is returned
5. If **DENIED**, **ESCALATE**, or **REQUIRE_CONFIRMATION** -- the tool is never executed and the governance decision is
   returned as an error

The agent cannot call the underlying function directly. There is no bypass path.

## Governance Outcomes

Every tool call produces one of four outcomes:

| Outcome | Meaning | Tool executes? |
|---------|---------|----------------|
| **ALLOW** | Policy permits the action | Yes |
| **DENY** | Policy blocks the action | No |
| **ESCALATE** | Action requires elevated review | No |
| **REQUIRE_CONFIRMATION** | Action requires human approval | No |

The default posture is **deny**. If no policy explicitly permits an action, it is denied.

## Optional: Voluntary Proposal Tool

By default, the MCP server enforces governance transparently -- the agent has no choice. For operators who want
governance-aware agents to proactively check actions before attempting them, the `aegis_propose` tool can be enabled:

```python
server = AEGISMCPServer(
    runtime,
    agent_id="my-agent",
    expose_propose=True,  # opt-in
)
```

This adds an `aegis_propose` tool that lets the agent submit a governance proposal and receive a decision without
triggering enforcement. This is a pre-check, not a substitute for enforcement -- the actual tool call is still governed
regardless.

## Audit Trail

Every governance decision -- whether ALLOW, DENY, ESCALATE, or REQUIRE_CONFIRMATION -- is recorded in the immutable
audit trail. Records include:

- Agent identity and session
- Action type and target resource
- Governance decision and reason
- Policy evaluations that contributed to the decision
- HMAC-SHA256 integrity protection with hash chaining

Query the audit trail through the `aegis_audit` tool or the [Audit API](/api/audit/).

## Security Properties

The MCP server inherits all security properties from the AEGIS governance runtime:

- **Default-deny posture** -- no action proceeds without explicit capability + policy authorization
- **Replay protection** -- duplicate request IDs are rejected
- **Per-agent rate limiting** -- configurable sliding window prevents request flooding
- **Aggregate impact detection** -- bulk action patterns are escalated automatically
- **Cryptographic audit integrity** -- HMAC-SHA256 chain prevents tamper without detection
- **Atomic evaluation** -- capability, policy, and risk stages execute under a unified lock (no TOCTOU)
- **Dangerous pattern rejection** -- shell metacharacters, sensitive paths, and oversized parameters are blocked at the
  gateway

## CLI Options

```
python -m aegis_core.mcp [OPTIONS]

  --agent-id TEXT     Default agent identity (default: mcp-agent)
  --session-id TEXT   Default session identifier (default: mcp-session)
```

## Related

- [Core Concepts](/getting-started/core-concepts/) -- Capabilities, policies, and the default-deny model
- [Policy Authoring](/guides/policy-authoring/) -- Writing governance policies
- [API Reference](/api/governance/) -- HTTP API for governance proposals
- [Python SDK](/sdk/python/) -- Programmatic integration without MCP
