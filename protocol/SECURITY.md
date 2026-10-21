# SAP Interchange Threat Model

This applies to the draft envelope, not the existing legacy Express server (which remains unaudited).

**Trust boundaries:** Issuer to receiver; decision to external execution; report to independent auditor; metadata to private context.

- **Greenwashing / data spoofing:** A syntactically valid source reference cannot establish energy, carbon, water, or operational truth. Scope and methodology must be inspected independently.
- **Unknown-to-zero laundering:** Unknown impact is explicitly null; zero is a measurement or estimate, not a substitute for missing evidence.
- **Policy bypass:** A selected offer must meet strict local-only, quality, and human-review declarations; an actual executor must also check permissions and data boundaries.
- **Prompt leakage:** Arbitrary properties are forbidden. This is not DLP: even task_class, scope, source, trace IDs, or timestamps might accidentally disclose secrets. Review and restrict all fields.
- **Replay / forged receipts:** IDs are not signatures, nonces, or authorization grants. Consumers need anti-replay, proper application authorization, and idempotent retries.
- **Untrusted references:** Never auto-fetch source or verification URLs (SSRF and exfiltration risk). Do not execute content received in envelopes.
- **Denial of service:** The JS example limits single documents to 64 KiB and each exchange to 100 records. Deploying over HTTP requires proper auth, rate limits, TLS, logging policy, and payload bounds.
- **Rights and autonomy:** The purpose of SAP is not to rank people or override their choices. Privacy and human control may be non-negotiable constraints rather than optimization variables.

Security review, environment-specific threat analysis, independent vetting of measurement sources, and documented user consent are prerequisites to a production execution integration.

Refer to top-level SECURITY.md for the historical tracked credential concern: deleting a tracked .env file does not erase its Git history.
