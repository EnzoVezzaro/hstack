#!/usr/bin/env python3
"""Document consistency checks for V5 authorization scope. NOT a runtime test.

There is no production authorization engine in this repository. These checks
only verify that the shipped contract, skills, and acceptance document agree.
Runtime permission enforcement is NOT RUN; see docs/authorization-acceptance.md.
"""

import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


class ContractDocumentChecks(unittest.TestCase):
    def test_contract_defines_independent_scopes_not_a_total_order(self):
        text = read("docs/skill-contract.md")
        for scope in ("`inspect`", "`local`", "`push`", "`pr`", "`merge`", "`deploy`", "`release`", "`delete`"):
            self.assertIn(scope, text)
        self.assertIn("only the named", text)
        self.assertIn("Technical readiness is never an authority grant", text)
        self.assertIn("do not widen", text)

    def test_edits_are_distinct_from_local_commit(self):
        text = read("docs/skill-contract.md")
        self.assertIn("Reading and proposing are distinct from acting", text)
        self.assertIn("`commit` means `local`", text)

    def test_publish_git_uses_explicit_scopes(self):
        text = read("skills/publish-git/SKILL.md")
        self.assertIn("**Stop here for `local` scope.**", text)
        self.assertNotIn("wider authorized scope", text)
        self.assertIn("A ready PR does not authorize merging", text)
        self.assertIn("push the exact named commits", text)

    def test_standing_rules_persist_but_are_bounded(self):
        stoner = read("skills/stoner/SKILL.md")
        self.assertIn("bounded `merge` grant", stoner)
        self.assertIn("do not ask again", stoner)
        for path in ("skills/resume-all/SKILL.md", "skills/horizon/SKILL.md", "skills/deploy/SKILL.md"):
            self.assertIn("already", read(path), path)

    def test_negative_cross_scope_examples_are_documented(self):
        scenarios = read("docs/authorization-acceptance.md")
        self.assertIn("No commit, push, PR, merge, deploy, release, or deletion", scenarios)
        self.assertIn("No merge even if green", scenarios)
        self.assertIn("No release, no unrelated merge", scenarios)
        self.assertIn("runtime permission behavior is **NOT RUN**", scenarios)


class ShippedPayloadChecks(unittest.TestCase):
    def test_required_contract_is_bundled_with_publish_git(self):
        reference = read("skills/publish-git/references/skill-contract.md")
        self.assertIn("Technical readiness is never an authority grant", reference)
        self.assertIn("`delete`", reference)


if __name__ == "__main__":
    unittest.main(verbosity=2)
