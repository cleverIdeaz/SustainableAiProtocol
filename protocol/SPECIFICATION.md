# Sustainable AI Protocol — Working Interchange Draft 2026-10-21

**Status: PUBLIC WORKING DRAFT. Not ratified, independently certified, or endorsed by MCP, OpenTelemetry, Green Software Foundation, or any other standards body.**

SAP is proposed as a lightweight, transport-independent, evidence-preserving interchange format for AI execution choices and consequences. Its mission covers people, planet, and prosperity. Unlike an environmental calculator, agent transport, or router, SAP seeks to carry the relevant declarations, constraints, and evidence **between** those systems without changing their algorithms.

## 1. Scope and conformance language

The JSON Schema 2020-12 at [schema/envelope-2026-10-21.schema.json](schema/envelope-2026-10-21.schema.json) is authoritative for document syntax and field values. MUST, MUST NOT, SHOULD, MAY describe interoperability requirements of **this draft**, not statements of external legal compliance.

The exact sap_version is 2026-10-21-draft. Receivers MUST reject unknown versions. This identifier is not a stable spec promise; breaking changes during the working draft are expected to create a new identifier.

Records MUST NOT be described as externally certified or as proof of actual electricity savings simply because their schema validates.

## 2. Message flow

SAP v0.3 draft describes three kinds of record, under the same exchange_id and generic operation task_class:

1. **sap.offer:** a source declares one available execution option, processing locality, human-review capability, and quantified metrics with provenance.
2. **sap.decision:** a host or authorized human identifies a selected offer (or no selection), the declared policy constraints, a reason code, and whether evidence remains provisional.
3. **sap.receipt:** after external execution, an issuer reports what is known about outcome and measured or estimated metrics, including a verification reference only if claiming verified status.

These are portable DATA OBJECTS, not an executable transport protocol, a central permission service, or a new way to call models. They MAY move as JSON files, HTTP bodies, MCP resources/tools, or in existing workflow storage. A proposed adapter is not the same as official MCP extension status.

## 3. Required metadata

All records carry sap_version, kind, id, exchange_id, created_at, operation (task_class and sensitivity), and a phase-specific payload. IDs are opaque correlators, never raw prompts or user identifiers. A valid timestamp is a record creation timestamp, NOT independently verified task duration.

An offer identifies option_id; locality is on_device, on_prem, remote, hybrid, or unknown; human_review_available is a declaration, not proof of a person approving anything.

## 4. Metric contract

Offers and receipts MUST include energy_kwh (kWh), carbon_gco2e (gCO2e), cost_usd (USD), latency_ms (ms), and quality_proxy (ratio 0 to 1). Each metric consists of value, unit, basis, source, and scope.

- UNKNOWN: basis unknown REQUIRES value:null and source:null. Missing evidence MUST NOT be converted to zero.
- MEASURED: a numeric value plus source reference to instrument, method, or record. This is self-declared and is not guaranteed true.
- ESTIMATED: a numeric value plus methodology or source reference. Assumptions and boundary MUST be disclosed in scope or linked documentation.
- PROVIDER_REPORTED: numeric data claimed by a provider. The host SHOULD verify its applicability and origin before relying on it.

All other metric forms MUST be rejected. Units MUST match the field definition. An energy figure covering only one device MUST NOT be compared without caveat to another figure that includes an entire data center. End-to-end comparability requires compatible workload, geography, duration, functional unit, system boundary, and source credibility.

Measurement, carbon accounting, and lifecycle models SHOULD reuse established Green Software Foundation and instrumentation methodologies; SAP MUST NOT silently invent conversions from tokens to power or equate local inference with lower carbon impact.

Human rights, dignity, livelihoods, and autonomous judgment are **not** assigned a universal numeric wellbeing score by SAP. Existing human authorization and governance boundaries remain primary.

## 5. Decision constraints and agency

Policy modes balanced, eco, and performance are preferences and **do not define a global ethical scoring function**. Mandatory constraints include min_quality (0–1), local_only, and human_review_required. A host that commits to honoring them MUST verify the referenced offer exists and satisfies those restrictions. Unknown and hybrid location MUST NOT satisfy local_only; only confirmed on_device or on_prem options may satisfy the reference constraint, and a real host must independently verify that data stays within its intended local boundary.

If no eligible offer is available, selected_offer_id MUST be null and the reason MUST represent no_eligible_offer or insufficient_evidence. A valid selection does not grant authority to perform the task. Tool authorization, actual human approval, and transactional side-effect protections MUST remain enforced by the executing host.

## 6. Receipts and verification

Status must be planned, attempted, reported, verified, failed, or unknown. Only verified MAY contain a non-null verification object, consisting of method and reference, and verified MUST carry it. A reference can be fabricated; validation is not an independent audit. Planned is not executed. Reported is not verified. Unknown is not failed or completed.

Issuers MUST NOT inflate unknown outcomes to success. Retries of actions with external side effects require application-level idempotency and authorization.

## 7. Privacy and security

The schema prohibits arbitrary additional fields, prompts, response content, or raw user profiles. Opaque IDs, operation categories, source strings, and timestamps can still be linkable; implementations SHOULD minimize, sanitize, and restrict them and use appropriate consent and retention safeguards. Consumers MUST treat all incoming JSON and evidence references as untrusted data and MUST NOT automatically dereference URLs.

Schema validation is NOT a network security boundary and does NOT enforce execution policy. See [SECURITY.md](SECURITY.md).

## 8. Compatibility and extensions

This draft rejects unknown top-level and nested keys to prevent silent semantic changes and accidental content ingestion. New concepts require explicit versioning or a future negotiated profile. Neither a general-purpose note field nor a catchall arbitrary metadata bag is part of the required core.

## 9. Normative conformance tests

The repo includes a two-language validation suite, with valid and intentionally invalid JSON fixtures. Run:

    npm --prefix protocol install
    node protocol/validate.cjs --fixtures

Independent Python implementation:

    python -m pip install jsonschema
    python protocol/validate.py

The JS implementation additionally checks cross-record exchange consistency, reference integrity, strict policy requirements, and ID uniqueness. Passing these tests means the implementation passes this **limited draft conformance suite**, not that an external authority certified the product.

## 10. What must happen before a stable release

- Two truly independent producer/consumer implementations, not just two schema validators.
- Cross-provider test vectors, malicious-input review, and auth/consent review.
- Real comparable workload measurements with independently checked environmental boundaries.
- Quantified incremental utility beyond combining an existing router, OpenTelemetry, and Impact Framework directly.
- Named multi-party governance and version/deprecation policies.

## Existing standards deliberately reused

- MCP: https://modelcontextprotocol.io/specification/2026-07-28
- OpenTelemetry GenAI: https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/
- Green Software Foundation Impact Framework: https://if.greensoftware.foundation/
- W3C PROV: https://www.w3.org/TR/prov-o/
- JSON Schema 2020-12: https://json-schema.org/draft/2020-12

Referenced organizations have not endorsed or joined SAP merely by being named.
