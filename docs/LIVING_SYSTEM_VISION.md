# SAP — Living-System Vision

## The image behind the name

In a tree, sap carries water, minerals, and sugars through an interconnected living system. It does not command the tree. It helps the organism sustain growth.

**SAP — Helping intelligence grow without exhausting what sustains it.**

This is a metaphor, not a claim that ecosystems or AI systems have identical behavior. It illustrates SAP's intended role as connective tissue between existing capabilities and the consequences of using them.

## Mission

An open, voluntary, provider-neutral interoperability effort connecting environmental evidence, human-centered requirements, and economic/technical realities so AI applications can make better-informed execution choices.

Sustainability has at least three independent dimensions:

- **Planet:** electricity, emissions, water, hardware lifecycles, and ecological impacts.
- **People:** rights, dignity, privacy, autonomy, meaningful livelihoods, access, and correction.
- **Prosperity:** quality, cost, durability, access to compute, and efficient use of resources.

These dimensions are not interchangeable units; SAP must not hide human rights behind an aggregated "goodness score".

## Product principle

**Invisible by default. Transparent on demand. Actionable by choice.**

- Routine users should not be required to manually invoke SAP where their applications have integrated it.
- People should be able to inspect why a recommendation was made and exercise meaningful choices.
- A platform that has not integrated SAP is not controlled by it.
- SAP should not collect centralized personal profiles or introduce covert behavioral surveillance.

## Architectural role

MCP and existing APIs enable connection to tools. Open Source Frontier may discover capabilities and candidate execution paths. SAP proposes to transport evidence and preferences about their tradeoffs. Phewsh may preserve decisions and continuity. None of these products is required for SAP, and they must not be tightly coupled.

Integrate existing work rather than compete with it:

- Model Context Protocol / other agent communication standards — capability exchange.
- OpenTelemetry — instrumentation and operational observability.
- Green Software Foundation Impact Framework and SCI methodologies — environmental accounting.
- Existing model routers — model execution and fallbacks.
- Established privacy, security, and governance controls — permissions and accountability.

**These are planned relationships, not claims of completed integrations or endorsement.**

## Research target

Can a minimal, machine-readable "impact envelope" faithfully represent an available execution option's capability, outcome quality basis, estimated or measured environmental impacts, monetary costs, privacy requirements, temporal scope, and provenance—without forcing a central service?

The first SAP v0.2 lab only demonstrates selection over caller-supplied candidates; it does not yet define a standard envelope or measure actual impact. See docs/SAP_V02_DRAFT.md.

## How we avoid duplicating work

Before introducing any new SAP field or adapter:
1. Identify the closest existing standard and its maintained implementation.
2. Reuse its definitions and evidence where possible.
3. Define a specific interoperability gap that remains.
4. Publish a test showing the incremental benefit versus the existing approach.
5. Remove SAP-specific complexity if the older standard already solves the problem.

## Immediate experimental plan

1. Pilot a real local workload with measured energy, known task success, and reproducible cost assumptions.
2. Add a cloud or remote alternative only when comparable, appropriately scoped evidence exists.
3. Publish transparent uncertainty, data provenance, and non-equivalence of estimates.
4. Test an opt-in adapter to Open Source Frontier and a conventional routing system.
5. Invite third-party review and model-council criticism before declaring a stable specification.

The SAP Council idea remains a research proposal, not an active multi-model service in this release.
