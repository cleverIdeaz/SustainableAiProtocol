/* SAP Core v0.2 experimental — no network, storage, tracking, or hidden model calls. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SAPCore = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const VERSION = "0.2.0-draft";
  const MODES = ["balanced", "eco", "performance"];
  const EVIDENCE = ["measured", "estimated", "provider_reported", "unknown"];
  const LOCATIONS = ["local", "remote", "hybrid", "unknown"];
  const isNumber = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;
  const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

  function metric(value, evidence, note) {
    if (value === null || value === undefined) {
      if (evidence && evidence !== "unknown") throw Error("Missing measurement cannot have known evidence");
      return { value: null, evidence: "unknown", note: note || "Not provided" };
    }
    if (!isNumber(value)) throw Error("Metric must be a finite nonnegative number");
    if (!EVIDENCE.includes(evidence) || evidence === "unknown") {
      throw Error("Metric value requires measured, estimated, or provider_reported evidence");
    }
    return { value, evidence, note: String(note || "") };
  }

  function normalizeCandidate(source) {
    if (!source || typeof source !== "object") throw Error("Candidate must be an object");
    if (typeof source.id !== "string" || !/^[a-zA-Z0-9._-]{1,64}$/.test(source.id)) {
      throw Error("Candidate requires a stable safe id");
    }
    if (!LOCATIONS.includes(source.location)) throw Error("Invalid execution location");
    if (typeof source.quality !== "number" || !Number.isFinite(source.quality) || source.quality < 0 || source.quality > 1) {
      throw Error("Quality proxy must be between 0 and 1");
    }
    if (source.costUSD !== null && source.costUSD !== undefined && !isNumber(source.costUSD)) {
      throw Error("Cost must be a finite nonnegative number or null");
    }
    if (source.latencyMs !== null && source.latencyMs !== undefined && !isNumber(source.latencyMs)) {
      throw Error("Latency must be a finite nonnegative number or null");
    }
    return {
      id: source.id,
      label: String(source.label || source.id).slice(0, 120),
      location: source.location,
      quality: source.quality,
      costUSD: source.costUSD === undefined ? null : source.costUSD,
      latencyMs: source.latencyMs === undefined ? null : source.latencyMs,
      energyKwh: metric(source.energyKwh, source.energyEvidence, source.energyNote),
      humanReview: Boolean(source.humanReview)
    };
  }

  function evaluate(candidates, options) {
    if (!Array.isArray(candidates) || candidates.length === 0) throw Error("Supply candidates");
    const policy = Object.assign({ mode: "balanced", minimumQuality: 0.75, localOnly: false, humanReview: false }, options || {});
    if (!MODES.includes(policy.mode)) throw Error("Invalid mode");
    if (typeof policy.minimumQuality !== "number" || policy.minimumQuality < 0 || policy.minimumQuality > 1) throw Error("Invalid minimum quality");
    const seen = new Set();
    const normalized = candidates.map(normalizeCandidate);
    normalized.forEach((c) => { if (seen.has(c.id)) throw Error("Duplicate candidate id"); seen.add(c.id); });
    const rejected = [];
    const eligible = normalized.filter((c) => {
      const reasons = [];
      if (c.quality < policy.minimumQuality) reasons.push("below declared quality threshold");
      if (policy.localOnly && c.location !== "local") reasons.push("local-only privacy preference");
      if (policy.humanReview && !c.humanReview) reasons.push("human review required");
      if (reasons.length) rejected.push({ id: c.id, reasons });
      return reasons.length === 0;
    });
    if (!eligible.length) {
      return { version: VERSION, policy, selected: null, provisional: true, reason: "No option meets the requirements.", eligible: [], rejected };
    }
    let metricKey = "costUSD";
    if (policy.mode === "eco") metricKey = "energyKwh";
    if (policy.mode === "performance") metricKey = "quality";
    const available = eligible.filter((c) => policy.mode === "performance" ||
      (policy.mode === "eco" ? c.energyKwh.value !== null : c.costUSD !== null));
    if (!available.length) {
      return { version: VERSION, policy, selected: null, provisional: true, reason: "Insufficient comparable evidence to recommend an option.", eligible, rejected };
    }
    const sorted = available.slice().sort((a,b) => {
      if (policy.mode === "performance") return b.quality - a.quality || (a.costUSD ?? Infinity) - (b.costUSD ?? Infinity);
      if (policy.mode === "eco") return a.energyKwh.value - b.energyKwh.value || b.quality - a.quality;
      return a.costUSD - b.costUSD || b.quality - a.quality;
    });
    const selected = sorted[0];
    const missing = eligible.length - available.length;
    const provisional = missing > 0 || (policy.mode === "eco" && available.some(c => c.energyKwh.evidence !== "measured"));
    const label = policy.mode === "eco" ? "lowest disclosed energy" : policy.mode === "performance" ? "highest declared quality" : "lowest disclosed cost";
    const reason = "Selected " + label + " among options meeting the declared requirements." +
      (missing ? " " + missing + " eligible option(s) lacked comparable data." : "") +
      (policy.mode === "eco" && available.some(c => c.energyKwh.evidence !== "measured") ? " Energy figures include estimates or provider claims." : "");
    return { version: VERSION, policy, selected, provisional, reason, eligible, rejected };
  }

  function makeReceipt(candidate, options) {
    const c = normalizeCandidate(candidate);
    const ctx = options || {};
    const status = ctx.status || "planned";
    if (!["planned", "reported", "verified", "failed", "unknown"].includes(status)) throw Error("Invalid outcome");
    if (status === "verified" && !ctx.verificationReference) throw Error("Verification needs a reference");
    return {
      schema: "sap.execution.receipt",
      version: VERSION,
      createdAt: new Date().toISOString(),
      execution: { id: c.id, location: c.location },
      outcome: { status, verificationReference: ctx.verificationReference || null },
      metrics: { energyKwh: c.energyKwh, costUSD: c.costUSD, latencyMs: c.latencyMs },
      provenance: { demo: Boolean(ctx.demo), qualityIsDeclaredProxy: true },
      privacy: { promptContentIncluded: false, transmittedBySAPCore: false }
    };
  }
  return Object.freeze({ VERSION, MODES, metric, normalizeCandidate, evaluate, makeReceipt });
});
