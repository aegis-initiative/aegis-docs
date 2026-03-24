---
title: SDK Configuration
description: Advanced configuration options for the AEGIS TypeScript and Python SDKs.
---

# SDK Configuration

> **Note:** The SDK packages are not yet published to npm or PyPI, and the platform API at `api.aegissystems.live` is not yet deployed. The configuration options and code examples below describe the intended SDK behavior and will be usable once the packages are published. You can build and test the SDKs from source today -- see the [aegis-sdk repository](https://github.com/aegis-initiative/aegis-sdk).

Both AEGIS SDKs support a range of configuration options for customizing behavior, handling retries, and integrating with different deployment environments.

## Environment Variables

Both SDKs respect the following environment variables:

| Variable | Description |
|---|---|
| `AEGIS_API_KEY` | API key for authentication |
| `AEGIS_ENDPOINT` | Platform API URL (overrides constructor argument) |
| `AEGIS_TIMEOUT` | Request timeout (milliseconds for TS, seconds for Python) |
| `AEGIS_RETRIES` | Number of retry attempts |
| `AEGIS_LOG_LEVEL` | Logging verbosity: `debug`, `info`, `warn`, `error` |

When both an environment variable and a constructor argument are provided, the constructor argument takes precedence.

## Retry Configuration

Both SDKs implement automatic retries for transient failures (network errors, timeouts, 5xx responses). Governance decisions (including `DENY`) are never retried -- only transport-level failures trigger retries.

### TypeScript

```typescript
const aegis = new AegisClient({
  endpoint: 'https://api.aegissystems.live',
  apiKey: process.env.AEGIS_API_KEY,
  retries: 3,
  retryDelay: 1000,   // Base delay in ms (exponential backoff)
});
```

### Python

```python
aegis = AegisClient(
    endpoint="https://api.aegissystems.live",
    api_key=os.environ["AEGIS_API_KEY"],
    retries=3,
    retry_delay=1.0,   # Base delay in seconds (exponential backoff)
)
```

Retry delays use exponential backoff: the delay doubles with each attempt (1s, 2s, 4s, etc.) with a small amount of jitter to avoid thundering herd effects.

## Timeout Configuration

Timeouts apply to individual HTTP requests, not to the overall `propose()` call (which may include retries).

| SDK | Default | Unit |
|---|---|---|
| TypeScript | 30000 | milliseconds |
| Python | 30.0 | seconds |

For latency-sensitive applications, consider reducing the timeout and increasing the retry count.

## Logging

Both SDKs emit structured logs that can help diagnose integration issues.

### TypeScript

```typescript
const aegis = new AegisClient({
  endpoint: 'https://api.aegissystems.live',
  apiKey: process.env.AEGIS_API_KEY,
  logLevel: 'debug',
});
```

### Python

```python
import logging
logging.basicConfig(level=logging.DEBUG)

aegis = AegisClient(
    endpoint="https://api.aegissystems.live",
    api_key=os.environ["AEGIS_API_KEY"],
)
```

## Custom HTTP Client

For advanced use cases (custom TLS configuration, proxy support, request interceptors), both SDKs allow injecting a custom HTTP client.

### TypeScript

```typescript
import { AegisClient } from '@aegis-initiative/sdk';

const aegis = new AegisClient({
  endpoint: 'https://api.aegissystems.live',
  apiKey: process.env.AEGIS_API_KEY,
  httpClient: customFetchImplementation,
});
```

### Python

```python
import httpx

custom_client = httpx.Client(
    verify="/path/to/custom-ca.pem",
    proxy="http://proxy.internal:8080",
)

aegis = AegisClient(
    endpoint="https://api.aegissystems.live",
    api_key=os.environ["AEGIS_API_KEY"],
    http_client=custom_client,
)
```

## Multi-Environment Setup

For organizations running multiple AEGIS environments (development, staging, production), configure separate clients:

```typescript
const aegisDev = new AegisClient({
  endpoint: 'https://api.dev.aegissystems.live',
  apiKey: process.env.AEGIS_API_KEY_DEV,
});

const aegisProd = new AegisClient({
  endpoint: 'https://api.aegissystems.live',
  apiKey: process.env.AEGIS_API_KEY_PROD,
});
```

## Further Reading

- [TypeScript SDK](/sdk/javascript/) -- Language-specific guide
- [Python SDK](/sdk/python/) -- Language-specific guide
- [Authentication](/api/authentication/) -- API key management and scopes

> **Note:** Configuration options may expand as the SDKs mature. See the [aegis-sdk repository](https://github.com/aegis-initiative/aegis-sdk) for the latest configuration reference.
