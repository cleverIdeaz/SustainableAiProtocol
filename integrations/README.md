# SAP working interoperability pilot (draft v0.3)

This is a code-level integration with existing standards, not a public claim of measured environmental impact or any organization's endorsement.

## Connected components

1. App A (ollama-producer.cjs): actually invokes a locally installed Ollama model using a fixed benign prompt. The official OpenTelemetry JS SDK records a GenAI client span and exports OTLP/HTTP JSON to App B. Provider token counts and instrumented elapsed time are forwarded, NOT prompts or generated content.
2. App B (receiver.cjs): on local loopback 127.0.0.1:4319, receives OTLP JSON spans. It creates privacy-minimized SAP observations using real timing and available reported tokens. Energy and carbon deliberately remain UNKNOWN.
3. GSF Impact Framework (impact-framework.cjs): outputs an executable official IF manifest. Given an independently sourced energy-kWh number and grid carbon intensity (gCO2e/kWh), the IF builtin Multiply calculates operational carbon. When independently sourced embodied emissions are ALSO available, IF builtin Sum and Sci calculate carbon per user-facing request. We do not invent missing energy, grid, or lifecycle values.

### Actual instrumented local inference

Requirements: Node 22, an installed Ollama model, and local Ollama running.

Terminal A:
    node integrations/receiver.cjs

Terminal B:
    cd integrations
    npm install
    SAP_OLLAMA_MODEL=your-installed-model npm run pilot

Read the observations:
    curl http://127.0.0.1:4319/observations

Only the fixed text "Reply with only the word ready." is passed to Ollama locally. No prompt content is sent in OTLP telemetry. Inference content is not logged.

### Run official Impact Framework

You must obtain actual measured whole-inference energy and appropriate grid intensity from separate, trusted, documented sources, then POST an observation ID and those values to http://127.0.0.1:4319/impact-manifest. The resulting JSON contains a YAML manifest string. Save that manifest as input.yml and run:

    npm install -g @grnsft/if
    if-run --manifest input.yml

A legitimate full-life-cycle SCI estimate additionally requires scoped embodied emissions and a defensible functional unit, not merely operational electricity. The adapter does not independently verify user-supplied sources.

### Tests

    node --test integrations/test-interop.cjs
    cd integrations && npm install && node --test test-otel-sdk.cjs

With GSF IF CLI installed:

    node integrations/test-gsf-if.cjs

The IF CI test intentionally uses FICTIONAL numbers (0.002 kWh, 300 gCO2e/kWh, 0.2 g embodied, one request) to verify real IF plugin operation and 0.8 gCO2e/request math. It proves compatibility only, NOT measured emissions.

### Scope and security

- OTLP JSON spans only. This receiver is NOT an OpenTelemetry Collector and does not accept protobuf.
- Loopback-only, 256 KiB request limit, small memory buffer, explicit metadata allowlist. Trace IDs can still identify transactions; keep private.
- No remotely accessible service, no persistent logging, no real power meter or grid feed, and no OSF/MCP integration shipped in this pilot.
- Do not expose receiver directly to the public internet.
- Older SAP Express server is not part of this integration and remains unaudited.

Upstream OpenTelemetry GenAI conventions: https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/
Upstream GSF Impact Framework: https://if.greensoftware.foundation/
Upstream GSF SCI for AI standard: https://greensoftware.foundation/standards/sci-ai/
