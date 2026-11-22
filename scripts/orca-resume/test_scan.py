#!/usr/bin/env python3
"""Deterministic regressions for scan.py. No Orca calls, no agent resumes."""

import pathlib
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import scan  # noqa: E402


def git(path, *args):
    p = subprocess.run(["git", "-C", str(path), *args], capture_output=True, text=True)
    if p.returncode != 0:
        raise AssertionError(f"git {args} failed: {p.stderr}")
    return p.stdout.strip()


def new_repo(root, branch="main"):
    path = pathlib.Path(root) / "repo"
    path.mkdir()
    git(path, "init", "-q", "-b", branch)
    git(path, "config", "user.email", "test@example.invalid")
    git(path, "config", "user.name", "Test")
    (path / "README.md").write_text("init\n")
    git(path, "add", "README.md")
    git(path, "commit", "-qm", "init")
    return path


class GitStateTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = pathlib.Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def test_clean_repo_is_complete(self):
        repo = new_repo(self.root)
        state = scan.git_state(repo)
        self.assertEqual(state["dirty"], 0)
        self.assertEqual(state["ahead"], 0)
        self.assertEqual(state["base"], "main")
        self.assertIsNone(state["error"])
        self.assertEqual(scan.classify({"agents": []}, state, False)["group"], "complete-or-idle")

    def test_dirty_repo_is_unfinished(self):
        repo = new_repo(self.root)
        (repo / "dirty.txt").write_text("pending\n")
        state = scan.git_state(repo)
        self.assertEqual(state["dirty"], 1)
        self.assertEqual(scan.classify({"agents": []}, state, False)["group"], "unfinished")

    def test_ahead_repo_is_unfinished(self):
        repo = new_repo(self.root)
        git(repo, "checkout", "-qb", "feature")
        (repo / "new.txt").write_text("work\n")
        git(repo, "add", "new.txt")
        git(repo, "commit", "-qm", "work")
        state = scan.git_state(repo)
        self.assertEqual(state["ahead"], 1)
        self.assertEqual(state["base"], "main")
        self.assertEqual(scan.classify({"agents": []}, state, False)["group"], "unfinished")

    def test_missing_repo_is_unknown_not_complete(self):
        state = scan.git_state(self.root / "__nonexistent_repo__")
        self.assertIsNotNone(state["error"])
        self.assertIsNone(state["dirty"])
        self.assertIsNone(state["ahead"])
        result = scan.classify({"agents": []}, state, False)
        self.assertEqual(result["group"], "unknown")
        self.assertTrue(result["git_unknown"])

    def test_missing_base_never_guesses_master(self):
        repo = new_repo(self.root, branch="solo")
        state = scan.git_state(repo)
        self.assertIsNotNone(state["error"])
        self.assertIsNone(state["ahead"])
        self.assertNotEqual(state["base"], "master")
        self.assertEqual(scan.classify({"agents": []}, state, False)["group"], "unknown")

    def test_working_agent_priority(self):
        repo = new_repo(self.root)
        state = scan.git_state(repo)
        state["error"] = "simulated failed git read"
        w = {"agents": [{"state": "working"}]}
        self.assertEqual(scan.classify(w, state, False)["group"], "working")

    def test_broken_agent_priority(self):
        state = {"dirty": None, "ahead": None, "error": "simulated failure"}
        w = {"agents": [{"interrupted": True}]}
        self.assertEqual(scan.classify(w, state, False)["group"], "interrupted")

    def test_upstream_base_is_used(self):
        repo = new_repo(self.root)
        git(repo, "update-ref", "refs/remotes/origin/main", "HEAD")
        git(repo, "config", "remote.origin.url", str(repo))
        git(repo, "config", "remote.origin.fetch", "+refs/heads/*:refs/remotes/origin/*")
        git(repo, "config", "branch.main.remote", "origin")
        git(repo, "config", "branch.main.merge", "refs/heads/main")
        state = scan.git_state(repo)
        self.assertEqual(state["base"], "origin/main")


if __name__ == "__main__":
    unittest.main(verbosity=2)
