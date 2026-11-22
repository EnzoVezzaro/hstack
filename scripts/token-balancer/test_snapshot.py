#!/usr/bin/env python3
"""Tests for snapshot.py. Run: python3 scripts/token-balancer/test_snapshot.py"""

import json
import pathlib
import sys
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import snapshot  # noqa: E402

FIXTURE = {
    "claude": {"provider": "claude", "status": "ok", "planType": "pro", "updatedAt": 1795366851888,
               "session": {"usedPercent": 2, "resetsAt": 1795384799847},
               "weekly": {"usedPercent": 43, "resetsAt": 1795867199847},
               "usageMetadata": {"readingAccount": {"accountId": "secret-id"}}},
    "codex": {"provider": "codex", "status": "ok", "planType": "plus",
              "session": {"usedPercent": 100, "resetDescription": "12:16 PM"},
              "weekly": {"usedPercent": 83}},
    "cursor": {"provider": "cursor", "status": "ok",
               "buckets": [{"name": "Cursor Models", "usedPercent": 70}]},
    "kimi": {"provider": "kimi", "status": "unavailable", "error": "Not signed in to Kimi Code"},
    "minimaxCookieConfigured": False,
    "antigravityAccounts": [{"email": "someone@example.com"}],
}


class SnapshotTest(unittest.TestCase):
    def setUp(self):
        self.rows = {r["provider"]: r for r in snapshot.summarize(FIXTURE)}

    def test_headroom_uses_the_tightest_window(self):
        self.assertEqual(self.rows["claude"]["headroom"], 57)
        self.assertEqual(self.rows["claude"]["binding_window"], "weekly")

    def test_bands(self):
        self.assertEqual(self.rows["claude"]["band"], "ready")
        self.assertEqual(self.rows["cursor"]["band"], "tight")
        self.assertEqual(self.rows["codex"]["band"], "hold")  # a window at 100%
        self.assertEqual(self.rows["kimi"]["band"], "unknown")

    def test_non_provider_keys_are_ignored(self):
        self.assertEqual(set(self.rows), {"claude", "codex", "cursor", "kimi"})

    def test_no_identity_leaks(self):
        out = json.dumps(snapshot.summarize(FIXTURE))
        self.assertNotIn("secret-id", out)
        self.assertNotIn("@", out)

    def test_order_ready_first(self):
        self.assertEqual(snapshot.summarize(FIXTURE)[0]["provider"], "claude")


if __name__ == "__main__":
    unittest.main()
