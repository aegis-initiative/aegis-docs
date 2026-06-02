---
title: Error Reference
description: Complete reference for all AEGIS error codes with causes and resolution steps.
sidebar:
  order: 4
---

# Error Reference

Every error from the AEGIS governance runtime carries structured
metadata: a machine-readable error code, a human-readable message,
the specific cause, and a documentation URL. This page documents
all 37 error codes.

## Error Structure

All AEGIS errors include:

| Field | Type | Description |
|---|---|---|
| `error_code` | string | Machine-readable code (`AEGIS-{CAT}-{NNN}`) |
| `message` | string | Human-readable explanation |
| `cause` | string or null | The specific field, policy, or rule that triggered the error |
| `help_url` | string | Link to this documentation |
| `type` | string | Exception class name |

### Example Error Response

```json
{
  "type": "AEGISValidationError",
  "error_code": "AEGIS-VAL-002",
  "message": "agent_id is required but was empty or whitespace-only",
  "cause": "request.agent_id",
  "help_url": "https://aegis-docs.com/errors/aegis_val_002"
}
```

### Programmatic Access (Python)

```python
from aegis_core import AEGISValidationError

try:
    gateway.submit(request)
except AEGISValidationError as e:
    print(e.error_code)  # "AEGIS-VAL-002"
    print(e.cause)       # "request.agent_id"
    print(e.help_url)    # auto-generated
    print(e.to_dict())   # full structured dict
```

---

## Categories

| Prefix | Category | Exception Class | Count |
|---|---|---|---|
| `AEGIS-VAL-*` | Validation | `AEGISValidationError` | 31 |
| `AEGIS-CAP-*` | Capability | `AEGISCapabilityError` | 4 |
| `AEGIS-POL-*` | Policy | `AEGISPolicyError` | 9 |
| `AEGIS-AUD-*` | Audit | `AEGISAuditError` | 2 |

---

## Validation Errors (AEGIS-VAL)

Raised when an AGP request fails structural or semantic validation.
These are caught at the gateway before the request reaches the
decision engine.

### Gateway Validation

| Code | Description | Cause | Resolution |
|---|---|---|---|
| AEGIS-VAL-001 | Request object is None | `request` | Pass a valid AGPRequest object |
| AEGIS-VAL-002 | agent_id is empty or whitespace | `request.agent_id` | Provide a non-empty agent identifier |
| AEGIS-VAL-003 | agent_id exceeds 256 characters | `request.agent_id` | Shorten agent_id to 256 chars max |
| AEGIS-VAL-004 | agent_id contains invalid characters | `request.agent_id` | Use only `[a-zA-Z0-9._-]` |
| AEGIS-VAL-005 | Action is None | `request.action` | Include an AGPAction in the request |
| AEGIS-VAL-006 | Action type is None | `request.action.type` | Set action type to a valid ActionType |
| AEGIS-VAL-007 | Action type is not a valid enum | `request.action.type` | Use ActionType enum values |
| AEGIS-VAL-008 | Action target is empty | `request.action.target` | Provide a non-empty target string |
| AEGIS-VAL-009 | Action target exceeds 1024 chars | `request.action.target` | Shorten target to 1024 chars max |
| AEGIS-VAL-010 | Parameters is None | `request.action.parameters` | Pass an empty dict `{}` if no params |
| AEGIS-VAL-011 | Parameters is not a dict | `request.action.parameters` | Pass a dict, not a list or string |
| AEGIS-VAL-012 | Parameters contains a None key | `request.action.parameters` | Remove None keys from parameters |
| AEGIS-VAL-013 | Parameters cannot be serialized | `request.action.parameters` | Ensure all values are JSON-serializable |
| AEGIS-VAL-014 | Parameters exceed 1 MB (T6002) | `request.action.parameters` | Reduce parameter payload size |
| AEGIS-VAL-015 | Context is None | `request.context` | Include an AGPContext in the request |
| AEGIS-VAL-016 | Session ID is empty | `request.context.session_id` | Provide a non-empty session identifier |
| AEGIS-VAL-017 | Session ID exceeds 256 chars | `request.context.session_id` | Shorten session_id to 256 chars max |
| AEGIS-VAL-018 | Timestamp is None | `request.context.timestamp` | Include a UTC timestamp |
| AEGIS-VAL-019 | Metadata is None | `request.context.metadata` | Pass an empty dict `{}` if no metadata |
| AEGIS-VAL-020 | Request ID is empty | `request.request_id` | Provide a non-empty request identifier |
| AEGIS-VAL-021 | Duplicate request ID (T1002) | `request.request_id` | Generate a unique ID per request (UUID4) |
| AEGIS-VAL-022 | Shell metacharacters in target (T10004) | `request.action.target` | Remove `;` `\|` `&` `` ` `` `$` `(` `)` `<` `>` from target |
| AEGIS-VAL-023 | Sensitive path write (T10002/T10003) | `request.action.target` | Do not write to agent instruction files or auto-execution paths |

### Engine Defense-in-Depth

These duplicate gateway checks at the decision engine layer.
You should not see these in normal operation — they indicate
the request bypassed the gateway.

| Code | Description |
|---|---|
| AEGIS-VAL-050 | Engine received None request |
| AEGIS-VAL-051 | Engine received request without agent_id |
| AEGIS-VAL-052 | Engine received request without request_id |
| AEGIS-VAL-053 | Engine received request with None action |
| AEGIS-VAL-054 | Engine received invalid action type |
| AEGIS-VAL-055 | Engine received empty action target |
| AEGIS-VAL-056 | Engine received None context |
| AEGIS-VAL-057 | Engine received empty session_id |

---

## Capability Errors (AEGIS-CAP)

Raised when capability registry operations fail.

| Code | Description | Cause | Resolution |
|---|---|---|---|
| AEGIS-CAP-001 | Invalid seal token | Seal token mismatch | Use the correct token returned by `freeze()` |
| AEGIS-CAP-002 | Registry is frozen | Mutation on frozen registry | Call `unseal(token)` before modifying |
| AEGIS-CAP-003 | Registry at capacity | Max 10,000 capabilities | Remove unused capabilities before adding |
| AEGIS-CAP-004 | Unknown capability ID | Referenced ID not registered | Register the capability first with `register()` |

---

## Policy Errors (AEGIS-POL)

Raised when policy engine operations fail.

| Code | Description | Cause | Resolution |
|---|---|---|---|
| AEGIS-POL-001 | Invalid seal token | Seal token mismatch | Use the correct token returned by `freeze()` |
| AEGIS-POL-002 | Engine is frozen | Mutation on frozen engine | Call `unseal(token)` before modifying |
| AEGIS-POL-003 | Policy ID is empty | `policy.id` | Provide a non-empty policy identifier |
| AEGIS-POL-004 | Policy name is empty | `policy.name` | Provide a non-empty policy name |
| AEGIS-POL-005 | Invalid policy effect | `policy.effect` | Use a valid PolicyEffect enum value |
| AEGIS-POL-006 | Conditions is not a list | `policy.conditions` | Pass a list of PolicyCondition objects |
| AEGIS-POL-007 | Condition is not callable | `condition.evaluate` | Ensure evaluate is a callable function |
| AEGIS-POL-008 | Condition description empty | `condition.description` | Provide a non-empty description |
| AEGIS-POL-009 | Condition raised exception | `condition.evaluate` | Fix the condition function — it threw an error during evaluation |

---

## Audit Errors (AEGIS-AUD)

Raised when the audit system cannot persist a decision record.
These are critical — audit failure means the governance decision
was made but not recorded.

| Code | Description | Cause | Resolution |
|---|---|---|---|
| AEGIS-AUD-001 | Failed to persist audit record | Database error | Check SQLite database path, permissions, and disk space |
| AEGIS-AUD-002 | Failed to persist batch records | Database error | Check database connectivity; batch will be rolled back |

---

## ATX-1 Traceability

Some validation errors map directly to ATX-1 techniques:

| Error Code | ATX-1 Technique | Description |
|---|---|---|
| AEGIS-VAL-014 | T6002 | Resource exhaustion via oversized parameters |
| AEGIS-VAL-021 | T1002 | Replay attack via duplicate request ID |
| AEGIS-VAL-022 | T10004 | Parser divergence via shell metacharacters |
| AEGIS-VAL-023 | T10002 / T10003 | Persistence via auto-execution path or agent instruction file |
