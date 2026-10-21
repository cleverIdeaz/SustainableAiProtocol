# Sustainable AI Protocol · SAP

**Helping intelligence grow without exhausting what sustains it.**

SAP is an open, experimental connective layer for sustainable intelligence—not a replacement for existing standards, and not a ratified industry protocol.

The **living system** metaphor gives the project its name: sap transports the materials that sustain a growing tree. Similarly, SAP aims to connect evidence and execution choices across three sustainability dimensions—**people, planet, and prosperity**—without becoming a central authority or collecting private prompts.

**Current live pages:** [SAP home](https://phewsh.com/sustainableaiprotocol/), [interactive lab](https://phewsh.com/sustainableaiprotocol/lab.html), and [developer quick start](https://phewsh.com/sustainableaiprotocol/integrate.html).

**Vision:** [Living System Vision](docs/LIVING_SYSTEM_VISION.md). **Technical draft:** [SAP v0.2](docs/SAP_V02_DRAFT.md). **Earlier telemetry approach:** [Archived documentation](docs/legacy-telemetry.html).

> Lab numbers are fictional. The library makes no model calls, environmental measurements, or implicit enforcement. OpenTelemetry and Impact Framework code-level integration tests now pass; real environmental measurement and independent adoption remain future work.

---

**Sustainable intelligence for the planet, people, and the economics of computing.**

**Principle:** Invisible by default · transparent on demand · actionable by choice.

SAP is an **experimental, open-source effort**, not an industry-ratified protocol. We are exploring an interoperable language for the tradeoffs surrounding AI execution: quality, resource usage, privacy, human agency, and cost.

**Try the [interactive SAP Lab](./lab.html)** — a fully local, zero-account demo comparing hypothetical execution alternatives under Balanced, Eco, and Performance preferences. The sample numbers are **fictional**, not real-world benchmarks.

## Working interchange draft — wire format and conformance

SAP now has a **public, machine-readable interchange draft** (2026-10-21-draft) with three messages: offer, decision, and receipt. It carries explicit metric evidence, non-negotiable host policy constraints, and outcome-verification status across unrelated applications.

- **[Published protocol docs](protocol/)** · **[Normative working draft](protocol/SPECIFICATION.md)** · **[JSON Schema 2020-12](protocol/schema/envelope-2026-10-21.schema.json)** · **[Security threat model](protocol/SECURITY.md)**
- **[Adversarial conformance vectors](protocol/conformance/)** — 5 accepted and 9 rejected fixtures independently checked in JavaScript and Python.
- **[Cross-language exchange](examples/SAP_EXCHANGE.md)** — standalone Python offer producer and JS decision consumer. No model inference is faked.
- **[Proposed governance](protocol/GOVERNANCE.md)** · **[Verified vs. missing status](docs/PROTOCOL_STATUS.md)**

Run the conformance checks:

    npm --prefix protocol install
    node protocol/validate.cjs --fixtures
    python -m pip install jsonschema
    python protocol/validate.py
    node --test examples/sap-exchange.test.cjs

This is a **working draft**, not a ratified standard, implementation certification, guaranteed policy enforcement, or evidence of real carbon savings. Independent maintainers and field data are needed before stable release.

## Verified standards interoperability pilot

An independent-app proof is available at [integrations/](integrations/README.md):

- **OpenTelemetry:** Real SDK instrumentation and OTLP/HTTP JSON transport from a local-model producer into a privacy-minimizing SAP receiver. Provider tokens and client duration are carried forward; energy remains unknown.
- **Green Software Foundation Impact Framework:** An executable manifest invokes the official IF Multiply, Sum and Sci plugins. CI runs the real IF engine on **fictional** energy/grid/embodied inputs to verify compatibility, not actual AI emissions.
- **No hosted API or measured impact claim:** Actual Ollama inference can be run locally by a developer. Grid feeds, power meters, full SCI for AI lifecycle coverage, and OSF integration remain unconnected.

These adapters complement existing standards rather than redefine them. This does not imply endorsement by OpenTelemetry or the Green Software Foundation.
## Current implementation

- \`sap-core.js\`: dependency-free, side-effect-free evaluation of declared execution alternatives, explicit unknown metrics, and draft execution receipts.
- \`lab.html\`: standalone human-facing demo; all decisions run within your browser with no backend.
- \`test-sap-core.js\`: regression tests for policy constraints, uncertainty, and privacy guarantees (\`node --test test-sap-core.js\`).
- \`docs/SAP_V02_DRAFT.md\`: evolving draft semantics and limits.
- \`index.html\`: living-system landing page (people, planet, prosperity).
- \`integrate.html\`: developer on-ramp.
- \`sap-mark.svg\`: open vector identity.
- \`docs/legacy-telemetry.html\`: preserved historical telemetry prototype documentation with archival disclaimer.
- \`sap-server.js\`, \`sap-mcp-server.js\`, \`sap-sdk.js\`: older prototypes **not yet production-security audited** and not included in the v0.2 experiment.

## Scope and truthfulness

This experiment **does not** measure actual data-center energy or water usage, automatically intercept model calls, enforce policies on third-party platforms, or confirm actions occurred. Real integrations would need explicit model/runtime adapters, reliable measurements and user-consented data handling.

We do **not** want to create centralized behavioral telemetry in the name of sustainability. The v0.2 core sends nothing and does not store prompts.

## Run

\`\`\`sh
node --test test-sap-core.js
# Serve the repository directory with any static HTTP server,
# then visit /lab.html (opening the file directly also works).
\`\`\`

The demo has no dependency installation requirement. Legacy Express files may require \`npm install\`.

## Responsible development

A historical \`.env\` file was tracked in this public repository. Even when removed from the current branch, secrets may persist in Git history. Review and rotate **any credentials** that were real before production use. See \`SECURITY.md\`.

## Contribute

Open issues and proposals at https://github.com/cleverIdeaz/SustainableAiProtocol/issues. Challenge the need for a new standard, bring evidence, and propose smaller existing-standard alternatives. The specification is not settled.

MIT-licensed; see LICENSE.
