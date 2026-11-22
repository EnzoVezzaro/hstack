#!/usr/bin/env python3
"""Deterministic regressions for the keyless benchmark runner. No model calls."""

import json
import os
import pathlib
import sys
import tempfile
import unittest
from unittest import mock

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import hstack_bench as bench  # noqa: E402

ROUTER = """---
name: hstack
description: "Use when unsure which skill fits."
---

# HSTACK

| Reach for it when… | Skill |
| --- | --- |
| CI is red | [fix-ci](../fix-ci/SKILL.md) |
"""

CASES = [{"id": "ci", "expected": "fix-ci", "keywords": ["CI is red"]}]


def make_env(root, label, with_payload=True):
    home = pathlib.Path(root) / label / "home"
    home.mkdir(parents=True, exist_ok=True)
    if with_payload:
        skills = home / ".agents" / "skills"
        (skills / "hstack").mkdir(parents=True, exist_ok=True)
        (skills / "hstack" / "SKILL.md").write_text(ROUTER)
    return {"home": str(home)}


class RouteProbeTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = self.tmp.name
        self.cases = pathlib.Path(self.root) / "cases.json"
        self.cases.write_text(json.dumps(CASES))

    def tearDown(self):
        self.tmp.cleanup()

    def test_each_configuration_resolves_independently(self):
        manifests = {
            "A-baseline": {"home": str(pathlib.Path(self.root) / "A" / "home")},
            "B-skills": make_env(self.root, "B"),
            "C-skills-mcp": make_env(self.root, "C"),
            "D-full-stack": make_env(self.root, "D"),
        }
        out = bench.route_probe(manifests, str(self.cases))
        for label in bench.CONFIGS[1:]:
            self.assertEqual(out[label]["passed"], 1, label)
            self.assertNotIn("error", out[label])

    def test_missing_c_and_d_payloads_fail_explicitly(self):
        manifests = {
            "A-baseline": {"home": str(pathlib.Path(self.root) / "A" / "home")},
            "B-skills": make_env(self.root, "B"),
            "C-skills-mcp": {"home": str(pathlib.Path(self.root) / "C" / "home")},
            "D-full-stack": {},
        }
        out = bench.route_probe(manifests, str(self.cases))
        self.assertEqual(out["B-skills"]["passed"], 1)
        self.assertIn("error", out["C-skills-mcp"])
        self.assertIn("error", out["D-full-stack"])
        self.assertEqual(out["D-full-stack"]["passed"], 0)

    def test_missing_router_fails_explicitly(self):
        home = pathlib.Path(self.root) / "B" / "home"
        (home / ".agents" / "skills").mkdir(parents=True, exist_ok=True)
        out = bench.route_probe({"B-skills": {"home": str(home)}}, str(self.cases))
        self.assertIn("error", out["B-skills"])

    def test_installed_payload_reports_missing_home(self):
        payload, error = bench.installed_payload({}, "B-skills")
        self.assertIsNone(payload)
        self.assertIn("home", error)

    def test_layer_flags_are_honest_for_baseline_and_skills(self):
        self.assertEqual(bench.LAYER_FLAGS["A-baseline"], (False, False))
        self.assertEqual(bench.LAYER_FLAGS["B-skills"], (False, False))
        self.assertTrue(bench.LAYER_FLAGS["C-skills-mcp"][0])
        self.assertTrue(bench.LAYER_FLAGS["D-full-stack"][1])


class EvaluatorFailureTests(unittest.TestCase):
    def test_quality_missing_evaluator_records_failure_no_score(self):
        with tempfile.TemporaryDirectory() as tmp:
            skills = pathlib.Path(tmp) / "skills" / "demo"
            skills.mkdir(parents=True)
            (skills / "SKILL.md").write_text("---\nname: demo\ndescription: \"Use when demo.\"\n---\n")
            result = bench.quality(str(pathlib.Path(tmp) / "no-such-evaluator"), skills.parent, 0)
            self.assertEqual(result["aggregate"]["scored"], 0)
            self.assertTrue(result["failures"])
            self.assertIn("error", result["skills"][0])

    def test_harness_missing_evaluator_records_error(self):
        result = bench.harness("no-such-evaluator", pathlib.Path("."))
        self.assertIn("error", result)


class NegativeReportTests(unittest.TestCase):
    FAKE = pathlib.Path(__file__).resolve().parent / "fixtures" / "fake_evaluator.py"

    def _quality(self, mode, skills):
        with mock.patch.dict(os.environ, {"FAKE_EVAL_MODE": mode}):
            return bench.quality(str(self.FAKE), skills, 0)

    def test_passed_false_is_failure_even_with_a_score(self):
        with tempfile.TemporaryDirectory() as tmp:
            skills = pathlib.Path(tmp) / "skills" / "demo"
            skills.mkdir(parents=True)
            (skills / "SKILL.md").write_text("---\nname: demo\ndescription: \"Use when demo.\"\n---\n")
            result = self._quality("quality-failed", skills.parent)
            self.assertTrue(result["failures"])
            self.assertEqual(result["aggregate"]["scored"], 0)

    def test_empty_quality_schema_is_failure(self):
        with tempfile.TemporaryDirectory() as tmp:
            skills = pathlib.Path(tmp) / "skills" / "demo"
            skills.mkdir(parents=True)
            (skills / "SKILL.md").write_text("---\nname: demo\ndescription: \"Use when demo.\"\n---\n")
            result = self._quality("quality-empty-schema", skills.parent)
            self.assertTrue(result["failures"])

    def _harness(self, mode):
        with mock.patch.dict(os.environ, {"FAKE_EVAL_MODE": mode}):
            return bench.harness(str(self.FAKE), pathlib.Path("."))

    def test_empty_and_malformed_harness_are_failures(self):
        self.assertIn("error", self._harness("harness-empty"))
        self.assertIn("error", self._harness("harness-malformed"))

    def test_valid_harness_fixture_succeeds(self):
        self.assertNotIn("error", self._harness("harness-valid"))


class PayloadReferenceTests(unittest.TestCase):
    def test_fresh_env_requires_self_contained_references(self):
        with tempfile.TemporaryDirectory() as tmp:
            skills = pathlib.Path(tmp) / "source-skills"
            (skills / "demo").mkdir(parents=True)
            (skills / "demo" / "SKILL.md").write_text("---\nname: demo\ndescription: \"Use when demo.\"\n---\n")
            with self.assertRaises(RuntimeError):
                bench.fresh_env(tmp, "B-skills", skills, True)


if __name__ == "__main__":
    unittest.main(verbosity=2)
