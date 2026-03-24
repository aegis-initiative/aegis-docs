---
title: Installation
description: Install the AEGIS SDK and configure your development environment.
---

# Installation

This page covers installing the AEGIS SDK in your project and configuring access to the governance platform.

## SDK Installation

> **Note:** The SDK packages are not yet published to npm or PyPI. The install commands below will not work until the packages are published. In the meantime, you can build the SDKs from source -- see the [aegis-sdk repository](https://github.com/aegis-initiative/aegis-sdk) and the [Development Setup](/contributing/development-setup/) guide.

### TypeScript / JavaScript

```bash
npm install @aegis-initiative/sdk
```

Or with other package managers:

```bash
yarn add @aegis-initiative/sdk
pnpm add @aegis-initiative/sdk
```

**Requirements:** Node.js 18 or later.

### Python

```bash
pip install aegis-sdk
```

Or with a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install aegis-sdk
```

**Requirements:** Python 3.10 or later.

## Platform Access

> **Note:** The managed platform at [aegis-platform.net](https://aegis-platform.net) is coming soon and not yet available. There is no operator dashboard or API key provisioning system yet. The instructions below describe the planned setup flow.

To use the AEGIS governance platform, you need:

1. **An organization account** at [aegis-platform.net](https://aegis-platform.net)
2. **An API key** generated from the operator dashboard

### Creating an API Key

1. Sign in to the operator dashboard
2. Navigate to **Settings > API Keys**
3. Click **Create API Key**
4. Select the appropriate permission scope for your use case
5. Copy the key and store it securely

### Configuring the SDK

> **Note:** The code examples below reference `https://demo.aegis-platform.net`, which is not yet active. These examples will work once the platform is deployed and the SDK packages are published.

Set your API key as an environment variable:

```bash
export AEGIS_API_KEY="aegis_sk_live_..."
```

Then initialize the client:

```typescript
import { AegisClient } from '@aegis-initiative/sdk';

const aegis = new AegisClient({
  endpoint: 'https://demo.aegis-platform.net',
  apiKey: process.env.AEGIS_API_KEY,
});
```

```python
from aegis_sdk import AegisClient
import os

aegis = AegisClient(
    endpoint="https://demo.aegis-platform.net",
    api_key=os.environ["AEGIS_API_KEY"],
)
```

## Verifying Your Setup

> **Note:** This verification step requires the SDK packages to be published and the platform API to be deployed, neither of which is available yet.

Make a test governance call to verify connectivity:

```typescript
const decision = await aegis.propose({
  actor: { id: 'test-agent', type: 'ai-agent' },
  action: { capability: 'system.ping', parameters: {} },
});

console.log('Connected! Decision:', decision.outcome);
```

## Next Steps

- [Quick Start](/getting-started/quick-start/) -- Make your first real governance call
- [Core Concepts](/getting-started/core-concepts/) -- Understand the governance model
- [SDK Configuration](/sdk/configuration/) -- Advanced SDK configuration options

> **Note:** The AEGIS SDK packages will be published to npm and PyPI as the platform reaches general availability. See the [aegis-sdk repository](https://github.com/aegis-initiative/aegis-sdk) for current status.