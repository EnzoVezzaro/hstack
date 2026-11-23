"""Keyless tests for the live benchmark harness. Run: python3 -m pytest scripts/benchmark -q"""

import pathlib
import subprocess
import sys
import tempfile

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import live_bench as lb  # noqa: E402
import live_scenarios as sc  # noqa: E402

FIXTURE = HERE / "fixtures" / "opencode_run_sample.jsonl"


def test_parse_events_reads_real_opencode_stream():
    info = lb.parse_events(FIXTURE.read_text(encoding="utf-8"))
    assert len(info["tools"]) == 6
    assert info["tokens"]["input"] > 0 and info["tokens"]["output"] > 0
    assert info["errors"] == []
    assert "Done" in info["final"]


def test_parse_events_records_errors_and_empty_final():
    stream = '{"type":"error","error":{"message":"quota exhausted"}}\n'
    info = lb.parse_events(stream)
    assert info["errors"] == ["quota exhausted"]
    assert info["final"] == ""


def test_parse_events_ignores_non_json_lines():
    info = lb.parse_events("PONG\nnot json\n")
    assert info["final"] == "" and info["tools"] == []


def test_extract_json_object_handles_fenced_reply():
    reply = 'Here you go:\n```json\n{"1": "implement-feature"}\n```'
    assert lb.extract_json_object(reply) == {"1": "implement-feature"}
    assert lb.extract_json_object("no json here") is None


def test_router_accuracy_scores_matches_and_misses():
    cases = (("a", "fix-ci"), ("b", "publish-git"))
    accuracy, detail = lb.router_accuracy('{"1": "fix-ci", "2": "release"}', cases)
    assert accuracy == 0.5
    assert "2:release!=publish-git" in detail
    assert lb.router_accuracy("nothing", cases)[0] == 0.0


def test_every_skill_has_a_scenario():
    skills = {p.name for p in lb.SKILLS_DIR.iterdir() if (p / "SKILL.md").is_file()}
    assert skills == sc.covered_skills()


def test_scenario_seeds_and_ids_are_valid():
    ids = [s.id for s in sc.all_scenarios()]
    assert len(ids) == len(set(ids))
    for scenario in sc.all_scenarios():
        assert scenario.seed in sc.SEEDS


def test_prompt_contains_skill_references_and_task():
    scenario = next(s for s in sc.all_scenarios() if s.id == "implement-feature")
    prompt = lb.build_prompt(scenario, scenario.steps[0])
    assert "# H Stack skill under test: implement-feature" in prompt
    assert "skill-contract.md" in prompt
    assert scenario.steps[0].task in prompt
    assert lb.PREAMBLE.splitlines()[0] in prompt
    assert "{repo}" not in lb.build_prompt(scenario, scenario.steps[0], "/x/repo")


def test_prompt_names_the_only_working_directory():
    scenario = next(s for s in sc.all_scenarios() if s.id == "implement-feature")
    prompt = lb.build_prompt(scenario, scenario.steps[0], "/scratch/repo")
    assert "Working directory: /scratch/repo" in prompt


def test_escaped_tool_calls_flags_only_outside_workdirs():
    repo = pathlib.Path("/scratch/run/repo")
    tools = [
        {"tool": "shell", "workdir": "/scratch/run/repo"},
        {"tool": "shell", "workdir": None},
        {"tool": "shell", "workdir": "/Users/someone/Desktop/Github/other"},
    ]
    escaped = lb.escaped_tool_calls(tools, repo)
    assert escaped == ["shell: /Users/someone/Desktop/Github/other"]


def test_parse_events_keeps_tool_workdir():
    stream = ('{"type":"tool_use","part":{"tool":"shell","state":{"status":"completed",'
              '"input":{"command":"pwd","workdir":"/scratch/repo"},"output":"x"}}}\n')
    info = lb.parse_events(stream)
    assert info["tools"][0]["workdir"] == "/scratch/repo"


def test_router_prompt_lists_requests():
    scenario = sc.ROUTER
    prompt = lb.build_prompt(scenario, scenario.steps[0])
    assert "1. Build a login form" in prompt
    assert f"{len(scenario.router_cases)}. " in prompt


def test_sanitize_hides_home_and_work_paths():
    home = str(pathlib.Path.home())
    work = pathlib.Path("/tmp/example-work")
    text = f"{home}/x and {work}/repo"
    assert lb.sanitize(text, work) == "~/x and <work>/repo"


def _repo_with(seed_name: str) -> pathlib.Path:
    base = pathlib.Path(tempfile.mkdtemp(prefix="live-bench-test-"))
    scenario = sc.Scenario(id="t", steps=(sc.Step("implement-feature", "x"),), seed=seed_name)
    return lb.init_repo(base, scenario)


def test_init_repo_creates_empty_repo_with_origin():
    repo = _repo_with("empty")
    assert subprocess.run(["git", "remote", "get-url", "origin"], cwd=repo, capture_output=True, text=True).returncode == 0
    assert (repo / ".git").is_dir()
    assert lb.git(repo, "ls-files").stdout == ""


def test_run_checks_detects_missing_file_and_failing_command():
    repo = _repo_with("node")
    scenario = sc.Scenario(
        id="t", steps=(sc.Step("verify-and-fix", "x"),), seed="node",
        files=("src/absent.js",), commands=("false",),
    )
    before = lb.git(repo, "ls-remote", "origin").stdout
    checks = {c.name: c.ok for c in lb.run_checks(repo, scenario, before, "")}
    assert checks["file:src/absent.js"] is False
    assert checks["cmd:false"] is False
    assert checks["origin-unchanged"] is True


def test_origin_change_is_detected():
    repo = _repo_with("node")
    scenario = sc.Scenario(id="t", steps=(sc.Step("publish-git", "x"),), seed="node")
    before = lb.git(repo, "ls-remote", "origin").stdout
    sc._commit(repo, "feat: new work")
    lb.git(repo, "push", "-q", "origin", "main")
    checks = {c.name: c.ok for c in lb.run_checks(repo, scenario, before, "")}
    assert checks["origin-unchanged"] is False


def test_router_check_is_part_of_run_checks():
    repo = _repo_with("empty")
    before = lb.git(repo, "ls-remote", "origin").stdout
    checks = lb.run_checks(repo, sc.ROUTER, before, '{"1":"x"}')
    names = [c.name for c in checks]
    assert "router-accuracy" in names


def test_every_workflow_has_multiple_steps_or_is_release():
    for workflow in sc.WORKFLOWS:
        assert workflow.workflow
        assert workflow.steps
        for step in workflow.steps:
            assert (lb.SKILLS_DIR / step.skill / "SKILL.md").is_file()


def test_host_actions_flags_app_control_and_host_paths():
    tools = [
        {"tool": "shell", "input": "osascript -e 'tell application \"Music\" to play'"},
        {"tool": "shell", "input": "npm test && open -a ChatGPT"},
        {"tool": "shell", "input": "cat /Users/mac/.npm/_npx/config.json"},
        {"tool": "shell", "input": "orca worktree ps --json"},
        {"tool": "shell", "input": "npm test && node --test"},
        {"tool": "write", "input": "/Users/mac/.hstack/sessions/2026-11-22.md"},
    ]
    hits = lb.host_actions(tools)
    assert len(hits) == 4
    assert all("host command" in h or "host path" in h for h in hits)
    assert not any("npm test && node --test" in h for h in hits)


def test_prompt_forbids_host_app_control():
    scenario = next(s for s in sc.all_scenarios() if s.id == "420")
    prompt = lb.build_prompt(scenario, scenario.steps[0], "/scratch/repo")
    assert "Forbidden: controlling any app on this machine" in prompt
    assert "osascript" in prompt and "orca" in prompt
