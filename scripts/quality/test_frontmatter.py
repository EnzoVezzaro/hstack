#!/usr/bin/env python3
"""Fixture regressions for the real YAML frontmatter validator. No model calls."""

import pathlib
import subprocess
import unittest

ROOT = pathlib.Path(__file__).resolve().parent
CHECKER = ROOT / "check_frontmatter.py"
FIXTURES = ROOT / "fixtures"


def check(name):
    p = subprocess.run(
        ["python3", str(CHECKER), "--validate-file", str(FIXTURES / name)],
        capture_output=True, text=True,
    )
    return p.returncode, (p.stdout + p.stderr).strip()


class FrontmatterFixtureTests(unittest.TestCase):
    def test_valid_string_metadata_accepted(self):
        code, out = check("valid.md")
        self.assertEqual(code, 0, out)
        self.assertEqual(out, "VALID")

    def test_nested_list_metadata_rejected(self):
        code, out = check("nested-list-metadata.md")
        self.assertEqual(code, 1)
        self.assertIn("metadata.tags must be a string", out)

    def test_malformed_yaml_rejected(self):
        code, out = check("malformed.md")
        self.assertEqual(code, 1)
        self.assertIn("malformed YAML", out)


if __name__ == "__main__":
    unittest.main(verbosity=2)
