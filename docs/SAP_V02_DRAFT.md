# SAP v0.2 research draft — not a ratified standard

**Mission:** Keep AI sustainable for the planet, human agency, and long-term economics.

**Design:** Invisible by default; transparent on demand; actionable by choice.

## Narrow first experiment

Can one provider-neutral data model compare ways to complete a task, maintain minimum quality/privacy requirements, and preserve uncertainty rather than inventing sustainability savings?

SAP Core exposes \`evaluate(candidates, policy)\`, \`normalizeCandidate(candidate)\`, and \`makeReceipt(candidate, context)\`. It has no accounts, network calls, automatic prompt tracking, global ledger, or enforcement over third-party AI platforms. An application decides where to execute and remains responsible for honoring user choices.

The policy supports \`balanced\`, \`eco\`, and \`performance\` preferences, minimum quality, local-only processing, and required human review. Local-only and human-review preferences are filtering constraints, not weighted suggestions.

Candidate metrics have explicit evidence classifications: \`measured\`, \`estimated\`, \`provider_reported\`, or \`unknown\`. Unknown values are never treated as zero. Quality scores are application-supplied proxies and not verified by this protocol. An energy estimate must describe its assumptions and provenance before it can support a real-world claim.

## Draft contract

\`\`\`json
{
  "id": "local_small",
  "label": "On-device inference",
  "location": "local",
  "quality": 0.86,
  "costUSD": 0.01,
  "latencyMs": 250,
  "energyKwh": null,
  "energyEvidence": "unknown",
  "energyNote": "No meter available",
  "humanReview": false
}
\`\`\`

\`\`\`js
const SAP = require("./sap-core");
const plan = SAP.evaluate(candidates, {
  mode: "balanced",
  minimumQuality: 0.8,
  localOnly: false
});
if (plan.selected) {
  // The host application chooses whether to perform the operation.
  // A plan is not proof of execution, savings, truth, or verification.
  const receipt = SAP.makeReceipt(plan.selected, { status: "planned" });
}
\`\`\`

## What we refuse to claim

- An API event count is **not** a measurement of electricity, carbon, or water.
- A preference selector is **not** enforcement over ChatGPT, Claude, or remote providers.
- A generated receipt is **not** independently verified evidence.
- Local inference is **not** automatically greener than shared infrastructure.
- A quality number is **not** objective task success without an external evaluation.
- These records should **never** contain raw user prompts or a personal behavioral profile.

## Next empirical steps

1. Instrument a real, consented local inference with power measurement and task-level outcome tests.
2. Collect directly measured or explicitly estimated comparable cloud data; preserve uncertainty if unavailable.
3. Evaluate total energy, costs, data exposure, and task success (including embodied hardware impact when feasible).
4. Test developer integration overhead and baseline alternatives.
5. Ask independent participants whether existing standards can express the same information before calling SAP a new standard.

## Independent integrations

Designed to complement—not replace—MCP (tools), OpenTelemetry (observability), and published environmental-accounting methods. A future MCP adapter could advertise SAP evidence, but the core must also work with ordinary non-MCP inference.

## Security and data minimization

The experimental library makes **no network requests and writes no browser storage**. Public examples are simulated and labeled accordingly. Do not ship secrets in a public repo. Review past Git history for any credentials accidentally committed and rotate affected keys; deleting a tracked .env file does not erase its historical contents.
