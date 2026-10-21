#!/usr/bin/env python3
"""Independent Python JSON Schema 2020-12 validator for SAP conformance fixtures."""
import json
import pathlib
import sys
from jsonschema import Draft202012Validator, FormatChecker

ROOT = pathlib.Path(__file__).resolve().parent
schema = json.loads((ROOT / "schema" / "envelope-2026-10-21.schema.json").read_text())
Draft202012Validator.check_schema(schema)
validator = Draft202012Validator(schema, format_checker=FormatChecker())

def main():
    count = 0
    for name, should_accept in [("valid", True), ("invalid", False)]:
        for path in sorted((ROOT / "conformance" / name).glob("*.json")):
            payload = json.loads(path.read_text())
            accepted = validator.is_valid(payload)
            if accepted != should_accept:
                errors = list(validator.iter_errors(payload))
                raise AssertionError(f"{path}: expected {should_accept}, got {accepted}: {errors[:1]}")
            count += 1
            print(("VALID " if accepted else "REJECTED ") + path.name)
    print(f"PASS: independent Python validator agrees on {count} vectors")

if __name__ == "__main__":
    try: main()
    except Exception as e:
        print(f"FAIL: {e}",file=sys.stderr)
        sys.exit(1)
