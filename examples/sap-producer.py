#!/usr/bin/env python3
"""A minimal, standalone, local-only Python SAP offer producer (no model calls)."""
import argparse
import json
import uuid
from datetime import datetime, timezone

def unknown(unit):
    return {"value": None, "unit": unit, "basis": "unknown",
            "source": None, "scope": "not measured"}

def make_offer(locality="on_device", option="local", exchange="demo-exchange", quality=None):
    metrics = {
        "energy_kwh": unknown("kWh"),
        "carbon_gco2e": unknown("gCO2e"),
        "cost_usd": unknown("USD"),
        "latency_ms": unknown("ms"),
        "quality_proxy": unknown("ratio"),
    }
    if quality is not None:
        if not 0 <= quality <= 1:
            raise ValueError("Illustrative quality must be between 0 and 1")
        metrics["quality_proxy"] = {
            "value": quality, "unit": "ratio", "basis": "estimated",
            "source": "example:unvalidated-user-assumption",
            "scope": "illustrative; no independent quality benchmark",
        }
    return {
        "sap_version": "2026-10-21-draft",
        "kind": "sap.offer",
        "id": "offer-" + uuid.uuid4().hex,
        "exchange_id": exchange,
        "created_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "operation": {"task_class": "text.summarization", "sensitivity": "confidential"},
        "payload": {
            "option_id": option,
            "locality": locality,
            "human_review_available": True,
            "metrics": metrics,
        },
    }

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--locality", required=True, choices=["on_device", "on_prem", "remote", "hybrid", "unknown"])
    p.add_argument("--option", required=True)
    p.add_argument("--exchange", default="demo-exchange")
    p.add_argument("--illustrative-quality", type=float)
    args = p.parse_args()
    print(json.dumps(make_offer(args.locality, args.option, args.exchange, args.illustrative_quality), indent=2))

if __name__ == "__main__":
    main()
