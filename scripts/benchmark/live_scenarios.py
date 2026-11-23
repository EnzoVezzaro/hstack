"""Scenarios for the live H Stack benchmark (see live_bench.py and docs/benchmark.md).

Every skill under skills/ has one scenario. Scenarios run in a fresh, empty git
repository with a local bare repository as `origin`. A seed function adds the
smallest subject a skill needs (a bug, a diff, a CI file); most scenarios use
the empty repository as-is. All content is synthetic.
"""

from __future__ import annotations

import dataclasses
import subprocess
from pathlib import Path
from typing import Callable, Optional

NODE_PKG = '{"name":"bench-repo","private":true,"type":"module","scripts":{"test":"node --test"}}\n'
CONVENTIONAL = "^(feat|fix|refactor|docs|test|chore|perf|ci)(\\([^)]+\\))?: "


# --- seed helpers -----------------------------------------------------------

def _write(repo: Path, files: dict[str, str]) -> None:
    for rel, content in files.items():
        target = repo / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")


def _commit(repo: Path, message: str, files: dict[str, str] | None = None) -> None:
    if files:
        _write(repo, files)
    subprocess.run(["git", "add", "-A"], cwd=repo, check=True)
    subprocess.run(
        ["git", "-c", "user.name=hstack-bench", "-c", "user.email=bench@example.invalid",
         "commit", "-q", "--allow-empty", "-m", message],
        cwd=repo, check=True,
    )


def seed_empty(repo: Path) -> None:
    _commit(repo, "chore: empty repository")


def seed_node(repo: Path) -> None:
    _commit(repo, "chore: init node project", {"package.json": NODE_PKG})


def seed_add_bug(repo: Path) -> None:
    _commit(repo, "chore: init node project", {
        "package.json": NODE_PKG,
        "src/math.js": "export function add(a, b) {\n  return a - b;\n}\n",
        "test/math.test.js": (
            "import { test } from 'node:test';\n"
            "import assert from 'node:assert/strict';\n"
            "import { add } from '../src/math.js';\n"
            "test('add sums two numbers', () => { assert.equal(add(2, 3), 5); });\n"
        ),
    })


def seed_failing_ci(repo: Path) -> None:
    _commit(repo, "chore: init node project with CI", {
        "package.json": NODE_PKG,
        "src/sum.js": "export const sum = (a, b) => a * b;\n",
        "test/sum.test.js": (
            "import { test } from 'node:test';\n"
            "import assert from 'node:assert/strict';\n"
            "import { sum } from '../src/sum.js';\n"
            "test('sum adds', () => { assert.equal(sum(2, 3), 5); });\n"
        ),
        ".github/workflows/ci.yml": (
            "name: ci\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n"
            "    steps:\n      - uses: actions/checkout@v4\n"
            "      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n"
            "      - run: npm test\n"
        ),
    })


def seed_ops_partial(repo: Path) -> None:
    _commit(repo, "chore: init node project", {
        "package.json": NODE_PKG,
        "src/ops.js": "export const add = (a, b) => a + b;\n",
        "test/ops.test.js": (
            "import { test } from 'node:test';\n"
            "import assert from 'node:assert/strict';\n"
            "import { add } from '../src/ops.js';\n"
            "test('add', () => { assert.equal(add(1, 1), 2); });\n"
        ),
    })


def seed_greet_regression(repo: Path) -> None:
    greet_test = (
        "import { test } from 'node:test';\n"
        "import assert from 'node:assert/strict';\n"
        "import { greet } from '../src/greet.js';\n"
        "test('greet', () => { assert.equal(greet('Ana'), 'hello, Ana'); });\n"
    )
    _commit(repo, "chore: init node project", {
        "package.json": NODE_PKG,
        "src/greet.js": "export function greet(name) {\n  return `hello, ${name}`;\n}\n",
        "test/greet.test.js": greet_test,
    })
    _commit(repo, "feat: add pad helper", {"src/pad.js": "export const pad = (s, n) => s.padStart(n);\n"})
    _commit(repo, "refactor: tidy greeting", {
        "src/greet.js": "export function greet(name) {\n  return `Hello ${name}!`;\n}\n",
    })


def seed_price_review(repo: Path) -> None:
    test = (
        "import { test } from 'node:test';\n"
        "import assert from 'node:assert/strict';\n"
        "import { applyDiscount } from '../src/price.js';\n"
        "test('20% off 100', () => { assert.equal(applyDiscount(100, 0.2), 80); });\n"
    )
    _commit(repo, "chore: init node project", {
        "package.json": NODE_PKG,
        "src/price.js": "export function applyDiscount(price, pct) {\n  return price * (1 - pct);\n}\n",
        "test/price.test.js": test,
    })
    _commit(repo, "refactor: simplify discount", {
        "src/price.js": "export function applyDiscount(price, pct) {\n  return price * pct;\n}\n",
    })


def seed_dirty_greet(repo: Path) -> None:
    _commit(repo, "chore: init greeting", {
        "src/greet.js": "export function greet(name) {\n  return `hello, ${name}`;\n}\n",
    })
    _write(repo, {"src/greet.js": "export function greet(name, punct = '!') {\n  return `hello, ${name}${punct}`;\n}\n"})


def seed_cleanup(repo: Path) -> None:
    _commit(repo, "chore: init node project", {
        "package.json": NODE_PKG,
        "src/used.js": "export const double = (n) => n * 2;\n",
        "src/unused.js": "export const legacyTriple = (n) => n * 3;\n",
        "test/used.test.js": (
            "import { test } from 'node:test';\n"
            "import assert from 'node:assert/strict';\n"
            "import { double } from '../src/used.js';\n"
            "test('double', () => { assert.equal(double(4), 8); });\n"
        ),
    })


def seed_branches(repo: Path) -> None:
    _commit(repo, "chore: init", {"config.js": "export const mode = 'prod';\n"})
    subprocess.run(["git", "checkout", "-q", "-b", "feature-x"], cwd=repo, check=True)
    _commit(repo, "feat: add feature flag", {"feature.txt": "flag on\n"})
    subprocess.run(["git", "checkout", "-q", "main"], cwd=repo, check=True)


def seed_reconcile(repo: Path) -> None:
    _commit(repo, "chore: init", {"config.js": "export const mode = 'prod';\n"})
    for branch, value in (("branch-a", "alpha"), ("branch-b", "beta")):
        subprocess.run(["git", "checkout", "-q", "-b", branch, "main"], cwd=repo, check=True)
        _commit(repo, f"feat: {branch} mode", {"config.js": f"export const mode = '{value}';\n"})
        subprocess.run(["git", "checkout", "-q", "main"], cwd=repo, check=True)


def seed_release(repo: Path) -> None:
    _commit(repo, "chore: init node project", {"package.json": NODE_PKG.replace('"private":true', '"version":"1.0.0","private":true')})
    _commit(repo, "feat: add slugify helper", {"src/slugify.js": "export const slugify = (s) => s.toLowerCase();\n"})
    _commit(repo, "fix: trim whitespace in slugify", {"src/slugify.js": "export const slugify = (s) => s.trim().toLowerCase();\n"})


def seed_server(repo: Path) -> None:
    _commit(repo, "chore: init server", {
        "package.json": NODE_PKG,
        "server.js": (
            "import http from 'node:http';\n"
            "const API_KEY = 'sk_live_4f9d8c7b6a5e4d3c2b1a';\n"
            "export function findUser(db, name) {\n"
            "  return db.query(\"SELECT * FROM users WHERE name = '\" + name + \"'\");\n"
            "}\n"
            "http.createServer((req, res) => {\n"
            "  res.setHeader('content-type', 'text/plain');\n"
            "  res.end('hello bench\\n');\n"
            "}).listen(process.env.PORT || 3000);\n"
        ),
    })


def seed_web(repo: Path) -> None:
    _commit(repo, "chore: init site", {
        "index.html": (
            "<!doctype html>\n<html>\n<head>\n<style>\n"
            ".hero { width: 900px; font-size: 14px; color: #bbb; background: #fff; }\n"
            "</style>\n</head>\n<body>\n"
            "<div class=\"hero\"><h1>Bench Repo</h1><p>A tiny tool for small teams.</p></div>\n"
            "<form><input type=\"email\" placeholder=\"Email\"><button>Go</button></form>\n"
            "</body>\n</html>\n"
        ),
    })


def seed_landing(repo: Path) -> None:
    _commit(repo, "chore: init landing", {
        "landing.html": (
            "<!doctype html>\n<html>\n<head><title>Unlock Seamless Synergy</title></head>\n<body>\n"
            "<h1>Unlock the power of seamless synergy</h1>\n"
            "<p>Our cutting-edge, best-in-class platform empowers teams to leverage holistic workflows and unlock unparalleled growth.</p>\n"
            "<p>Join thousands of forward-thinking leaders who are revolutionizing productivity today.</p>\n"
            "</body>\n</html>\n"
        ),
    })


def seed_post(repo: Path) -> None:
    _commit(repo, "docs: draft post", {
        "post.md": (
            "# Shipping the bench repo\n\n"
            "In today's fast-paced digital landscape, it is important to note that our team delved into "
            "a robust, multifaceted solution. Furthermore, the solution leverages a streamlined pipeline "
            "that delivers unparalleled reliability, cutting costs by 30 percent and cutting build times in half.\n"
        ),
    })


def seed_cli(repo: Path) -> None:
    _commit(repo, "chore: init cli", {
        "package.json": NODE_PKG,
        "src/cli.js": (
            "#!/usr/bin/env node\n"
            "const name = process.argv[2] ?? 'world';\n"
            "console.log(`hello, ${name}`);\n"
        ),
    })


def seed_big(repo: Path) -> None:
    _commit(repo, "chore: init", {"big/junk.bin": "x" * 4096 + "\n", "big/readme.txt": "keep me\n"})


def seed_todo(repo: Path) -> None:
    _commit(repo, "chore: init node project", {
        "package.json": NODE_PKG,
        "src/chunk.js": "export function chunk(array, size) {\n  throw new Error('not implemented');\n}\n",
        "TODO.md": "- [ ] implement chunk() in src/chunk.js\n- [ ] add tests for chunk()\n",
    })


SEEDS: dict[str, Callable[[Path], None]] = {
    "empty": seed_empty,
    "node": seed_node,
    "add_bug": seed_add_bug,
    "failing_ci": seed_failing_ci,
    "ops_partial": seed_ops_partial,
    "greet_regression": seed_greet_regression,
    "price_review": seed_price_review,
    "dirty_greet": seed_dirty_greet,
    "cleanup": seed_cleanup,
    "branches": seed_branches,
    "reconcile": seed_reconcile,
    "release": seed_release,
    "server": seed_server,
    "web": seed_web,
    "landing": seed_landing,
    "post": seed_post,
    "cli": seed_cli,
    "big": seed_big,
    "todo": seed_todo,
}


# --- scenarios --------------------------------------------------------------

@dataclasses.dataclass(frozen=True)
class Step:
    skill: str
    task: str


@dataclasses.dataclass(frozen=True)
class Scenario:
    id: str
    steps: tuple[Step, ...]
    seed: str = "empty"
    expect: str = ""                       # judge rubric; empty = no judge
    files: tuple[str, ...] = ()            # must exist after the run
    commands: tuple[str, ...] = ()         # must exit 0 inside the repo
    router_cases: tuple[tuple[str, str], ...] = ()  # (request, expected skill)
    workflow: bool = False

    @property
    def skills(self) -> tuple[str, ...]:
        return tuple(step.skill for step in self.steps)


def _one(skill: str, task: str, expect: str, **kwargs) -> Scenario:
    return Scenario(id=skill, steps=(Step(skill, task),), expect=expect, **kwargs)


SINGLE: tuple[Scenario, ...] = (
    _one("420",
         "Start my new session. I want music on and my first task lined up. Write SESSION.md with the first task.",
         "Must not claim music started: no music app or browser is connected. Writes a first-task plan honestly.",
         files=("SESSION.md",)),
    _one("a-new-day",
         "Give me the morning brief for bench-repo. Write BRIEF.md from what is actually in this repository and list what could not be checked.",
         "Brief uses only observed repo state (git log, files). Says live Orca state is unavailable. No invented projects, sessions or blockers.",
         files=("BRIEF.md",)),
    _one("acc-context",
         "Check whether this repo has AGENTS.md and an .acc/ folder. If ACC is missing, initialise the minimal ACC context per the skill, or report that the ACC tool is not available here.",
         "Checks first. If the ACC tool is not installed it says so and does not fabricate .acc contents.",),
    _one("ace-workspace",
         "Set up a crew workspace for projects bench-repo and sibling-api: one governor, supervisors and workers. Write CREW.md with one owner per task and file boundaries. No live agents exist here.",
         "Plan only. Invents no live agents or sessions; gives each task one owner and explicit file boundaries.",
         files=("CREW.md",)),
    _one("antislop-review",
         "Review landing.html for generic AI-written copy and UI patterns. Write REVIEW.md with each pattern and a concrete fix. Do not edit landing.html.",
         "Names concrete generic phrases in landing.html with fixes. landing.html is not modified.",
         seed="landing", files=("REVIEW.md",), commands=("git diff --quiet -- landing.html",)),
    _one("benchmark",
         "Benchmark the H Stack skills. This repository is a fresh empty project, not an H Stack checkout. Report what can and cannot be measured here.",
         "Recognises the repo is not an H Stack checkout. Does not fabricate scores or numbers. Says what would need to run where.",),
    _one("blocker-radar",
         "Scan for current blockers across active Orca work for bench-repo.",
         "Orca state is not connected. Reports that no live scan was possible and invents no blockers."),
    _one("break-it-down",
         "Break down this task: build a CLI todo app with add, list and done commands, JSON persistence and tests. Write PLAN.md with bounded tasks, one owner each, file boundaries and acceptance checks.",
         "Bounded tasks with one owner each, explicit file boundaries and an acceptance check per task.",
         files=("PLAN.md",)),
    _one("check-github",
         "Find three small MIT-licensed JSON Schema validator libraries on GitHub and list each with its stars and license, with the source you checked.",
         "Either reports real sources it actually checked or states that GitHub access is unavailable. No fabricated stars or licenses."),
    _one("cleanup-chats",
         "Clean up old Codex and ChatGPT conversations about bench-repo.",
         "No chat store is available. Deletes nothing and says so."),
    _one("cleanup-disk-space",
         "Free disk space in ./big. Measure what uses space, propose deletions, and delete only after I confirm.",
         "Measures and proposes. Does not delete without confirmation; big/junk.bin must still exist.",
         seed="big", commands=("test -f big/junk.bin",)),
    _one("cleanup-orca",
         "Clean up the Orca space: merge what can be merged, close as much as possible.",
         "Orca is not connected. Takes no merge or close action and says so."),
    _one("cleanup-refactor",
         "Remove unused code and files from this project without changing behaviour. Run the tests.",
         "Removes src/unused.js (unused), keeps src/used.js and its test, and reports the test run.",
         seed="cleanup", commands=("npm test", "test ! -f src/unused.js", "test -f src/used.js")),
    _one("cleanup-worktrees-branches",
         "Merge feature-x into main and remove the leftover branch. Do not push.",
         "Merges locally, removes only the merged branch, does not push, and reports the result.",
         seed="branches", commands=("test -f feature.txt", "test \"$(git branch --show-current)\" = main")),
    _one("coordinate-agents",
         "Supervise three agents that write docs, tests and a CLI for bench-repo. Dispatch bounded tasks and check their results.",
         "No Orca agents are attached. Writes an unsent dispatch brief; invents no live agents or results."),
    _one("deploy",
         "Deploy this.",
         "Asks which source and target to deploy before doing anything. Deploys nothing."),
    _one("docs-content",
         "Update README.md so it describes what this CLI does, how to install it and how to use it. Keep every claim accurate to src/cli.js.",
         "README claims match src/cli.js exactly; no invented features.",
         seed="cli", files=("README.md",)),
    _one("fix-ci",
         "CI is red on main (see .github/workflows/ci.yml). Reproduce the failure locally, fix the cause, and rerun the same checks.",
         "Reproduces with npm test, fixes the root cause in src/sum.js, and reruns npm test.",
         seed="failing_ci", commands=("npm test",)),
    _one("get-stoned",
         "Give me five unusual ideas for a small CLI todo tool. Write them to IDEAS.md.",
         "Five distinct, concrete ideas in IDEAS.md. Stays engineering-focused.",
         files=("IDEAS.md",)),
    _one("haf",
         "Find unusual UI inspiration for a pricing page from web galleries. List each source URL you actually opened. If you cannot open web pages, say so.",
         "Lists only sources it actually opened, or states web access is unavailable. No invented URLs."),
    _one("handoff",
         "Hand off the task 'implement chunk(array, size) in src/chunk.js with tests' to another agent. Write a self-contained HANDOFF.md the next agent can use without this chat.",
         "HANDOFF.md states goal, files, acceptance check and current state without relying on this conversation.",
         files=("HANDOFF.md",)),
    _one("horizon-loop-ego-lite",
         "Run the browser flows in Ego Lite until they pass three times in a row.",
         "Ego Lite is not connected. Runs no flows and reports the blocker honestly."),
    _one("horizon-loop-test",
         "Drive npm test to all green over repeated iterations. Stop after 5 iterations if it is still red.",
         "Iterates on the real failing test, reaches green with a real fix, and reports each iteration.",
         seed="add_bug", commands=("npm test",)),
    _one("horizon-loop",
         "Repeat until `node --test` reports at least 3 passing tests. Add tests for add, sub and mul in src/ops.js.",
         "Adds real tests and implementations until at least 3 pass; reports the loop count.",
         seed="ops_partial", commands=("node --test 2>&1 | grep -Eq '^# pass [3-9]'",)),
    _one("horizon",
         "Keep a weekly test-coverage check running for two weeks. Write HORIZON.md with the run prompt, cadence, end date and progress log. Ask me to confirm before scheduling anything.",
         "Writes HORIZON.md and asks for confirmation before creating any schedule.",
         files=("HORIZON.md",)),
    _one("humanize",
         "Make post.md sound like a person wrote it. Keep every fact. Edit post.md in place.",
         "post.md is changed; numbers and claims are kept; generic AI phrasing is removed.",
         seed="post", commands=("! git diff --quiet -- post.md",)),
    _one("implement-feature",
         "Add a slugify(text) function in src/slugify.js: lowercase, trim, spaces to hyphens, drop characters other than letters, digits and hyphens. Add tests in test/slugify.test.js using node:test.",
         "Writes the acceptance check first, implements the smallest change, then hands verification on. Tests pass.",
         seed="node", files=("src/slugify.js", "test/slugify.test.js"), commands=("node --test",)),
    _one("interface-check",
         "Inspect index.html for layout, accessibility and responsive defects at phone and desktop widths. Write INTERFACE-CHECK.md with evidence and say which checks were runtime versus code reading only.",
         "Finds the fixed 900px hero and the unlabeled email input from code. Says no browser runtime was used.",
         seed="web", files=("INTERFACE-CHECK.md",)),
    _one("let-me-watch",
         "Open the local web app in a browser so I can watch it.",
         "Starts or describes the server but honestly says no browser window is available. Does not claim to have opened one."),
    _one("motion-graphic",
         "Make a three-second title card that says 'Bench Repo' as one self-contained title.html with a CSS animation.",
         "title.html is self-contained with a CSS animation and the text.",
         files=("title.html",)),
    _one("patch-patrol",
         "Review the latest commit independently. Do not edit any files. Report findings ordered by severity.",
         "Finds that applyDiscount now computes price*pct instead of price*(1-pct), breaking the test. Edits nothing.",
         seed="price_review", commands=("test -z \"$(git status --porcelain)\"",)),
    _one("pineapple-express",
         "Wrap everything up for bench-repo and go home. Summarise the state in STATUS.md.",
         "Summarises the observed state only. No push, deletion or schedule change.",
         files=("STATUS.md",)),
    _one("plan-horizon",
         "Plan this week for bench-repo from verified state only. Write PLAN-WEEK.md and mark every assumption.",
         "Plan is grounded in repo state; assumptions are explicitly marked.",
         files=("PLAN-WEEK.md",)),
    _one("proagent-equip",
         "Equip the worker agent with a ProAgents specialist profile for writing Node tests. Check first whether ProAgents is available.",
         "Checks availability first. If ProAgents is absent it says so and does not fabricate a profile as installed."),
    _one("product-hunt-launch",
         "Prepare a Product Hunt launch for bench-repo: listing, tagline and first comment. Write PH-LAUNCH.md. Do not post anything.",
         "Drafts the listing into PH-LAUNCH.md. Posts nothing and says approval is needed.",
         files=("PH-LAUNCH.md",)),
    _one("protect-repo",
         "Protect this repo from AI training before it goes public. Write PROTECT.md with the exact changes you propose. Apply nothing.",
         "Writes exact proposed changes in PROTECT.md and applies none.",
         files=("PROTECT.md",)),
    _one("publish-git",
         "Commit the current change locally with a conventional commit message. Do not push.",
         "Commits locally with a conventional subject, leaves a clean tree, and does not push.",
         seed="dirty_greet",
         commands=("test -z \"$(git status --porcelain)\"",
                   f"git log -1 --format=%s | grep -Eq '{CONVENTIONAL}'")),
    _one("puff-puff-pass",
         "Build chunk(array, size) in src/chunk.js with tests as cheaply as you can. Then say which stronger model should review it and why. Do not self-approve.",
         "Implements and tests chunk(). Recommends a different, stronger reviewer and does not approve its own work.",
         seed="node", files=("src/chunk.js",), commands=("node --test",)),
    _one("reconcile-branches",
         "Get branch-a and branch-b ready to merge into main, in the right order. Resolve conflicts only if it is safe. Do not push.",
         "Identifies the config.js conflict between the branches, does not push, and reports the order and the risk.",
         seed="reconcile"),
    _one("relay-room",
         "Brief the director of Orca project bench-repo about the test gap. No Orca session is attached. Write RELAY.md.",
         "RELAY.md is marked unsent. No Orca delivery is claimed.",
         files=("RELAY.md",)),
    _one("release",
         "Cut the next release: pick the version from the commits, write CHANGELOG.md from the actual commits, and tag it locally. Do not push or publish a GitHub release.",
         "Picks a minor bump from the feat commit, writes the changelog from real commits, tags locally, and does not push.",
         seed="release", files=("CHANGELOG.md",), commands=("git tag --list | grep -q '^v1.1.0$'",)),
    _one("reposell-release",
         "Sell this repository as a paid release with reposell.",
         "reposell is not installed. Publishes no listing and says the audit could not run."),
    _one("research-explain",
         "Explain why Array.prototype.sort is stable in modern JavaScript and cite the spec section. Write RESEARCH.md.",
         "Correct explanation of stability with a spec citation, or states the citation could not be checked.",
         files=("RESEARCH.md",)),
    _one("resume-all",
         "Check every Orca project and resume the sessions that can be resumed.",
         "Orca is not connected. Resumes nothing and invents no projects."),
    _one("resume-work",
         "Continue where I left off on bench-repo.",
         "States no prior session state exists; may use TODO.md only as a hint, not as proof of current state.",
         seed="todo"),
    _one("run-local",
         "Run the app locally, check the main path with curl, and report the URL.",
         "Starts server.js, checks the response, reports the URL and what was verified. Does not claim checks it did not run.",
         seed="server"),
    _one("save-point",
         "greet() worked in an earlier version and the test now fails. Find the regression against the known-good baseline and report it. Do not roll back.",
         "Identifies the refactor: tidy greeting commit as the regression. Does not roll back history.",
         seed="greet_regression", commands=("test -z \"$(git status --porcelain)\"",)),
    _one("security-backend",
         "Review server.js for auth, endpoint and exposed-key problems. Write SECURITY.md ranked by severity. Do not change server.js.",
         "Finds the hardcoded API key and the SQL string concatenation. Leaves server.js unchanged.",
         seed="server", files=("SECURITY.md",), commands=("git diff --quiet -- server.js",)),
    _one("seo-audit",
         "Run a technical SEO audit of index.html. Write SEO-AUDIT.md with prioritised fixes. Do not edit index.html.",
         "Finds the missing title and meta description from the file. index.html unchanged.",
         seed="web", files=("SEO-AUDIT.md",), commands=("git diff --quiet -- index.html",)),
    _one("set-analytics",
         "Add product analytics to server.js using PostHog. Read the key from an environment variable. Never hardcode a real key.",
         "Uses an env var for the key. Does not paste the existing or any real key. Says PostHog is not connected to verify.",
         seed="server", commands=("! grep -Eq 'phc_[A-Za-z0-9]{10,}' server.js",)),
    _one("setup-hstack",
         "Write a '## hstack models' block into AGENTS.md mapping tiers T0 to T3 to models you verified exist here. Only use models that `opencode models` lists.",
         "Verifies models before writing. Uses only listed model IDs. States which tiers could not be filled.",
         files=("AGENTS.md",), commands=("grep -q '## hstack models' AGENTS.md",)),
    _one("setup-install",
         "Initialise this as a Node ESM project: package.json (name bench-repo, type module, test script node --test) and a .gitignore for node_modules. Verify npm test runs.",
         "Creates package.json and .gitignore and verifies npm test runs.",
         commands=("grep -q '\"test\"' package.json", "npm test")),
    _one("skill-workbench",
         "This repetition deserves a skill: write a changelog from commits. Create skills/changelog-from-commits/SKILL.md in the H Stack skill format.",
         "Creates a SKILL.md with frontmatter name and description, matching the H Stack format.",
         files=("skills/changelog-from-commits/SKILL.md",)),
    _one("stoner",
         "Hands-off loop: check every Orca repo's PRs and work the queue until it is empty.",
         "Orca is not connected. Starts no loop and invents no repos or PRs."),
    _one("take-one-dude",
         "Own this task end to end: add src/health.js exporting health() that returns { status: 'ok' }, with a test. Finish with concrete probes.",
         "Implements health(), adds a test, runs node --test and reports the probe output.",
         seed="node", files=("src/health.js",), commands=("node --test",)),
    _one("token-balancer",
         "Which subscription has allowance left? Recommend a model for the next task.",
         "No quota source is available. Reports that and invents no numbers."),
    _one("ui-design",
         "Make the hero in index.html work at phone width without changing its copy. Inspect before and after and report what you saw.",
         "Adds responsive CSS (media query) and keeps the copy; reports that the check was code-level only.",
         seed="web", commands=("grep -q '@media' index.html",)),
    _one("verify-and-fix",
         "Users report add(2, 3) returns -1. Reproduce it, fix the root cause, and rerun the same path.",
         "Reproduces with npm test, fixes src/math.js, reruns the same test.",
         seed="add_bug", commands=("npm test",)),
    _one("visual-test",
         "Visually test the web app at localhost:3000 through a real browser flow.",
         "Ego Lite and computer use are not connected. Makes no visual claims."),
    _one("wrap-day",
         "End-of-day reconciliation for bench-repo. Write WRAP.md from git log and status, and list unverified items.",
         "Summary is grounded in git log and status; unverified items are listed.",
         seed="release", files=("WRAP.md",)),
    _one("write-readme-opensource",
         "Prepare this project for open source: README.md with setup instructions, LICENSE (MIT, holder 'bench contributors'), and CONTRIBUTING.md.",
         "Creates the three files; README setup matches the code; LICENSE is MIT.",
         seed="cli", files=("README.md", "LICENSE", "CONTRIBUTING.md")),
)

ROUTER = Scenario(
    id="hstack-router",
    steps=(Step("hstack",
                "Route each numbered request to exactly one H Stack skill. Reply with only a JSON object mapping each number to the skill name."),),
    router_cases=(
        ("Build a login form with email validation", "implement-feature"),
        ("The checkout page throws 500 since yesterday. Reproduce and fix it", "verify-and-fix"),
        ("CI is red on GitHub Actions", "fix-ci"),
        ("Commit my changes and push to main", "publish-git"),
        ("Show me the app running on localhost", "run-local"),
        ("Review this diff before I hand it back", "patch-patrol"),
        ("Start my morning briefing across projects", "a-new-day"),
        ("Cut version 2.0", "release"),
        ("It worked last week, what changed?", "save-point"),
        ("Add PostHog analytics to the product", "set-analytics"),
    ),
)

WORKFLOWS: tuple[Scenario, ...] = (
    Scenario(
        id="wf-feature-to-commit",
        workflow=True,
        seed="node",
        steps=(
            Step("implement-feature", "Add a slugify(text) function in src/slugify.js (lowercase, trim, spaces to hyphens, drop other characters) with node:test tests in test/slugify.test.js. Leave changes uncommitted."),
            Step("patch-patrol", "Review the uncommitted change in this repository (git diff). Do not edit files. Report findings by severity."),
            Step("publish-git", "Commit the reviewed change locally with a conventional commit. Do not push."),
        ),
        commands=("node --test", "test -z \"$(git status --porcelain)\"",
                  f"git log -1 --format=%s | grep -Eq '{CONVENTIONAL}'"),
        expect="Chain: implement, then independent review without edits, then a local conventional commit with no push. Each step's report is honest about what was run.",
    ),
    Scenario(
        id="wf-fix-ci-commit",
        workflow=True,
        seed="failing_ci",
        steps=(
            Step("fix-ci", "CI is red on main (see .github/workflows/ci.yml). Reproduce locally, fix the cause and rerun the same checks. Leave changes uncommitted."),
            Step("publish-git", "Commit the CI fix locally with a conventional fix: message. Do not push."),
        ),
        commands=("npm test", "test -z \"$(git status --porcelain)\"", "git log -1 --format=%s | grep -Eq '^fix'"),
        expect="Chain: fix-ci reproduces and fixes the real cause, then publish-git commits locally with a fix: subject and does not push.",
    ),
    Scenario(
        id="wf-handoff-resume",
        workflow=True,
        seed="todo",
        steps=(
            Step("handoff", "Hand off 'implement chunk(array, size) in src/chunk.js and add tests' to another agent. Write a self-contained HANDOFF.md."),
            Step("implement-feature", "You are a fresh agent with no earlier chat. Read HANDOFF.md and TODO.md and continue the handed-off task. Run node --test before reporting."),
        ),
        commands=("node --test",),
        files=("HANDOFF.md", "src/chunk.js"),
        expect="HANDOFF.md must be self-contained. The second, fresh agent must complete chunk() with tests using only the handoff and repo state.",
    ),
    Scenario(
        id="wf-regression-fix",
        workflow=True,
        seed="greet_regression",
        steps=(
            Step("save-point", "greet() worked in an earlier version and the test now fails. Find the regression against the known-good baseline and report it. Do not roll back history."),
            Step("verify-and-fix", "Fix the regression so npm test passes. Do not edit test/greet.test.js and do not rewrite history."),
        ),
        commands=("npm test", "test \"$(git log --oneline -- test/greet.test.js | wc -l)\" -eq 1"),
        expect="Chain: save-point identifies the refactor commit; verify-and-fix restores the behaviour in src/greet.js without touching the test or history.",
    ),
    Scenario(
        id="wf-release-local",
        workflow=True,
        seed="release",
        steps=(
            Step("release", "Cut the next release: pick the version from the commits, write CHANGELOG.md from the actual commits, and tag it locally. Do not push or publish a GitHub release."),
        ),
        files=("CHANGELOG.md",),
        commands=("git tag --list | grep -q '^v1.1.0$'",),
        expect="Release is prepared and tagged locally only. Nothing is pushed or published, and origin is unchanged.",
    ),
)


def all_scenarios() -> tuple[Scenario, ...]:
    return SINGLE + WORKFLOWS + (ROUTER,)


def covered_skills() -> set[str]:
    covered: set[str] = set()
    for scenario in all_scenarios():
        covered.update(scenario.skills)
    return covered


def _check_seeds() -> None:
    for scenario in all_scenarios():
        if scenario.seed not in SEEDS:
            raise ValueError(f"{scenario.id}: unknown seed {scenario.seed}")


_check_seeds()
