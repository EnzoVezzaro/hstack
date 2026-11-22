#!/usr/bin/env python3
"""Document consistency checks for V5 handoff and process lifecycle. NOT runtime.

No toy state machines or fake process helpers are defined here. These checks
verify that the shipped skills and acceptance document agree. Runtime delivery
and process behavior are NOT RUN; see docs/handoff-process-acceptance.md.
"""

import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


class DocumentConsistencyChecks(unittest.TestCase):
    def test_handoff_defines_delivery_states(self):
        text = read("skills/handoff/SKILL.md")
        for label in ("prepared", "NOT SENT", "delivered", "accepted", "completed"):
            self.assertIn(label, text)
        self.assertIn("Never name a session from a document or old title", text)
        self.assertIn("no duplicate", text)
        self.assertIn("A delivery receipt alone is not acceptance or completion", text)

    def test_run_local_defaults_to_leaving_the_app_usable(self):
        text = read("skills/run-local/SKILL.md")
        self.assertIn("caller-owned", text)
        self.assertIn("how to stop", text)
        self.assertIn("Never kill by name or pattern", text)
        self.assertIn("explicitly temporary", text)

    def test_visual_test_preserves_the_caller_server(self):
        text = read("skills/visual-test/SKILL.md")
        self.assertIn("must stay up through your browser work", text)
        self.assertIn("only the exact PID", text)

    def test_acceptance_scenarios_are_documented_as_not_run(self):
        text = read("docs/handoff-process-acceptance.md")
        self.assertIn("runtime behavior is **NOT RUN**", text)
        self.assertIn("App left running, URL and how to stop it reported", text)
        self.assertIn("Server stays up through the visual pass", text)


class ShippedPayloadChecks(unittest.TestCase):
    def test_required_contract_is_bundled_with_handoff(self):
        reference = read("skills/handoff/references/skill-contract.md")
        self.assertIn("unsent", reference.lower())
        self.assertIn("one active owner", reference)


if __name__ == "__main__":
    unittest.main(verbosity=2)
