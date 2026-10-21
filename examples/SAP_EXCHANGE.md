# Portable Python → JavaScript SAP exchange

These two reference applications only share the draft wire format. They do not invoke a model, enforce permissions in other programs, or create environmental measurements. Both programs live in the same repository, so this is NOT independent third-party adoption.

Requirements: Node 22+, Python 3 and JavaScript JSON Schema validator dependencies.

    npm --prefix protocol install
    python3 examples/sap-producer.py --locality on_device --option local --exchange demo --illustrative-quality 0.80 > /tmp/sap-local.json
    python3 examples/sap-producer.py --locality remote --option cloud --exchange demo --illustrative-quality 0.95 > /tmp/sap-cloud.json
    node examples/sap-consumer.cjs --local-only --mode=performance /tmp/sap-local.json /tmp/sap-cloud.json

The consumer emits a structurally valid SAP decision pointing to the local option, explicitly marked provisional. The claimed quality values are user-entered *illustrative* proxies, not proven model benchmarks.

Run the cross-language application test:

    node --test examples/sap-exchange.test.cjs

For ecosystem integration rather than invented carbon metrics, see the real OpenTelemetry and GSF Impact Framework adapters under integrations/. The next external adoption milestone is for a separate team to implement and test a producer or consumer without copying this code.
