"use strict";
/**
 * Narrow OpenTelemetry OTLP/HTTP JSON span adapter.
 * Whitelists metadata; never copies prompts, content, or arbitrary attributes.
 */
const HEX = /^[0-9a-f]{16,32}$/i;
const SAFE = /^[\w.\/-]{1,128}$/;
function attributes(items) {
  const out = Object.create(null);
  for (const a of Array.isArray(items) ? items : []) {
    if (!a || typeof a.key !== "string" || !a.value) continue;
    const v = a.value;
    if (typeof v.stringValue === "string") out[a.key] = v.stringValue;
    else if (v.intValue !== undefined && /^\d+$/.test(String(v.intValue))) out[a.key] = Number(v.intValue);
  }
  return out;
}
function ns(n) {
  if (typeof n !== "string" || !/^\d{14,20}$/.test(n)) throw Error("Invalid OTLP timestamp");
  return BigInt(n);
}
function fromOtlpTraces(payload) {
  if (!payload || !Array.isArray(payload.resourceSpans)) throw Error("Expected OTLP resourceSpans");
  if (payload.resourceSpans.length > 50) throw Error("Too many resourceSpans");
  const out = [];
  for (const resourceSpan of payload.resourceSpans) {
    const service = attributes(resourceSpan?.resource?.attributes)["service.name"] || "unknown";
    const scopes = resourceSpan?.scopeSpans || [];
    if (!Array.isArray(scopes) || scopes.length > 50) throw Error("Too many scopeSpans");
    for (const scope of scopes) {
      if (!Array.isArray(scope.spans) || scope.spans.length > 200) throw Error("Too many spans");
      for (const span of scope.spans) {
        const a = attributes(span?.attributes);
        const op = a["gen_ai.operation.name"];
        const model = a["gen_ai.request.model"];
        if (typeof op !== "string" || typeof model !== "string") continue;
        if (!SAFE.test(op) || !SAFE.test(model) || !SAFE.test(service)) throw Error("Unsafe GenAI metadata");
        if (!HEX.test(span.traceId || "") || !HEX.test(span.spanId || "")) throw Error("Invalid trace id");
        const start = ns(span.startTimeUnixNano);
        const end = ns(span.endTimeUnixNano);
        if (end < start) throw Error("End before start");
        const input = a["gen_ai.usage.input_tokens"];
        const output = a["gen_ai.usage.output_tokens"];
        if (input !== undefined && !(Number.isSafeInteger(input) && input >= 0)) throw Error("Invalid tokens");
        if (output !== undefined && !(Number.isSafeInteger(output) && output >= 0)) throw Error("Invalid tokens");
        const latency = Number(end - start) / 1e6;
        if (!Number.isFinite(latency)) throw Error("Invalid latency");
        out.push({
          schema: "sap.observation.v0.3-draft",
          id: span.traceId + ":" + span.spanId,
          observedAt: new Date(Number(start / 1000000n)).toISOString(),
          service, operation: op, model,
          provider: typeof a["gen_ai.provider.name"] === "string" && SAFE.test(a["gen_ai.provider.name"]) ? a["gen_ai.provider.name"] : "unknown",
          source: "opentelemetry.otlp.traces.v1",
          measurements: {
            durationMs: { value: latency, evidence: "measured", scope: "instrumented client wall-clock" },
            inputTokens: { value: input ?? null, evidence: input === undefined ? "unknown" : "provider_reported" },
            outputTokens: { value: output ?? null, evidence: output === undefined ? "unknown" : "provider_reported" },
            energyKwh: { value: null, evidence: "unknown", scope: "complete inference" },
            carbonGco2e: { value: null, evidence: "unknown" }
          },
          privacy: { promptContentIncluded: false, responseContentIncluded: false },
          limitations: ["No full-system energy measurement", "Provider token data is not independently verified"]
        });
        if (out.length > 500) throw Error("Too many GenAI spans");
      }
    }
  }
  return out;
}
module.exports = { fromOtlpTraces, attributes };
