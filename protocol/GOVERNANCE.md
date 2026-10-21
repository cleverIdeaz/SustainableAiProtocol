# Sustainable AI Protocol — Governance and Releases (proposed)

**Open source is not the same as an official, independently governed standard.**

## Proposal process

1. File a public GitHub issue stating the interoperability gap, affected user groups, prior art, and what existing solutions fail to express.
2. Propose the narrowest viable technical primitive and its threat implications.
3. Submit a PR with normative text, machine-readable schema, positive and adversarial fixtures, and conformance tests across implementations.
4. Require CI success, meaningful maintainer review, and backward-compatibility notes. Publish unresolved objections.
5. Change sap_version for incompatible wire-format changes. Do not silently reinterpret historical records.

## Release stages

Working Draft (current) → Release Candidate (frozen and externally tested) → Stable Specification (public review, independent implementations and governance) → Optional certification procedure (only if separately established).

No official SAP certification program or independent standards body exists today. Maintainers can merge into this open repository, but that does not imply ecosystem-wide authority.

## Before ratification

Demonstrate two implementations maintained independently, actual opt-in adoption, comparative value versus reuse of existing standards without SAP, privacy and security review, multi-stakeholder governance, public conformance suite, and a deprecation/compatibility policy.

The community may decide SAP belongs as an existing standard's extension instead of a separate protocol. That would be an acceptable outcome if it best serves users.
