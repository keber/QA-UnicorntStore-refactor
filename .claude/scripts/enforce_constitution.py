#!/usr/bin/env python3
"""Deterministic enforcement of the qa-automation skill's Constitution.

Adapted from `Playwright-Scaffold-AI-Assisted-Development`'s
`.claude/scripts/enforce_constitution.py` for this project's nested
automation root (`qa/07-automation/e2e/`, not the repo root) and its
existing conventions (env var names, `page-objects/` instead of `pages/`,
priority tags instead of the smoke/sanity/regression taxonomy). See
`FRAMEWORK-FIXES-qa-framework*.md` reviewed earlier in this project's setup
(no longer present in the repo) for the original provenance write-up, and
`.github/skills/qa-automation/references/constitution.md` for the
agent-facing rules this hook backstops mechanically.

Two modes:

1. PreToolUse hook (default, stdin JSON) -- blocks Write / Edit / MultiEdit
   tool calls that would introduce content forbidden by the Constitution.
   The agent-facing rules stay in the skill; this hook is the hard backstop
   for the subset of rules that can be checked mechanically with zero
   false-positive risk.

2. Scan mode (`--scan file1 file2 ...`) -- applies the same rules to whole
   files on disk and prints one line per violation:
       <rule-id>\t<path>:<line>:<matched text>
   Exit 0 = clean, 1 = violations found.

Contract (Claude Code hooks):
  stdin  -- JSON payload: {"tool_name": ..., "tool_input": {...}}
  exit 0 -- allow the tool call
  exit 2 -- block the tool call; stderr is fed back to the agent

NOT ported from the source scaffold: the "Explore Before Generate" marker
gate (`.playwright-cli/.last-explored`, touched by a `playwright-cli`
wrapper script). That wrapper (browser-cache isolation, PATH linking, etc.)
was deliberately not adopted here to avoid the devcontainer/tooling bloat
the migration was meant to trim - `@playwright/cli` is already a direct
dependency at the repo root and usable directly. The underlying rule
("explore live before writing selectors") stays as prose guidance in the
qa-automation skill; only the file-marker enforcement mechanism is missing.
"""

import json
import os
import re
import sys


def _project_root() -> str:
    """Repo root, independent of the CWD the hook was launched from.

    Claude Code sets CLAUDE_PROJECT_DIR for hook commands; when absent
    (scan mode, manual runs) fall back to this script's location —
    .claude/scripts/ is always two levels below the repo root.
    """
    env_root = os.environ.get("CLAUDE_PROJECT_DIR", "")
    if env_root and os.path.isdir(env_root):
        return env_root
    return os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    )


PROJECT_ROOT = _project_root()

# All rules below are scoped under the e2e automation root, not the repo
# root — qa/07-automation/integration/ is a separate Playwright project with
# a different architecture and is deliberately NOT covered by this hook.
E2E_ROOT = r"qa/07-automation/e2e"


def repo_rel(path: str) -> str:
    """Normalize a path to repo-root-relative with forward slashes.

    os.path.relpath against the CWD would mis-relativize paths when the
    session is launched from a subdirectory, silently disabling every
    path-scoped rule.
    """
    if os.path.isabs(path):
        rel = os.path.relpath(path, PROJECT_ROOT)
    else:
        rel = path
    return rel.replace(os.sep, "/")


SPEC_FILE = re.compile(rf"(^|/){E2E_ROOT}/tests/.+\.(spec|setup)\.ts$")
TS_FILE = re.compile(rf"(^|/){E2E_ROOT}/.+\.ts$")
UI_OR_TEST_FILE = re.compile(
    rf"(^|/){E2E_ROOT}/(page-objects|tests)/.+\.ts$"
)
STATIC_JSON = re.compile(rf"(^|/){E2E_ROOT}/test-data/static/.+\.json$")
STATIC_TS = re.compile(rf"(^|/){E2E_ROOT}/test-data/static/.+\.ts$")
# playwright.config.ts included: the single most likely home of a hardcoded
# `baseURL:` (mirrored in eslint.config.mts's URL-rule files array).
TEST_OR_FIXTURE_TS = re.compile(
    rf"(^|/){E2E_ROOT}/(tests|fixtures|page-objects)/.+\.ts$"
    rf"|(^|/){E2E_ROOT}/playwright\.config\.ts$"
)

_TAG = r"@(?:P0|P1|P2|P3|destructive|smoke|sanity|regression|e2e|api|functional)(?![\w-])"
TAG_IN_DESCRIBE = re.compile(
    r"(?:test\s*\.\s*)?\bdescribe(?:\s*\.\s*\w+)?\s*\(\s*[`'\"][^`'\"]*" + _TAG
)
# Playwright's official options API: test.describe('t', { tag: '@x' }, fn).
# `[\s\S]{0,200}?` (not `[^}]*`): a nested object before `tag:` — e.g.
# `{ annotation: { type: 'a' }, tag: '@smoke' }` — contains a closing brace
# that `[^}]*` cannot cross; the bounded window keeps false positives out.
DESCRIBE_TAG_OPTION = re.compile(
    r"(?:test\s*\.\s*)?\bdescribe(?:\s*\.\s*\w+)?\s*\(\s*[`'\"][^`'\"\n]*[`'\"]\s*,\s*\{[\s\S]{0,200}?\btag\s*:",
    re.S,
)
# Two sanctioned tags inside ONE string literal — the "exactly one tag" rule.
# Priority tags (P0-P3) are the primary taxonomy here (tied to TC-ID
# priority, per naming-conventions.md); @destructive always wins for
# shared/global state, same semantics as the source scaffold.
_ONE_TAG = r"@(?:P0|P1|P2|P3|destructive)(?![\w-])"
MULTI_TAG_TITLE = re.compile(
    r"['\"`][^'\"`\n]*" + _ONE_TAG + r"[^'\"`\n]*" + _ONE_TAG
)
MULTI_TAG_ARRAY = re.compile(
    r"\btag\s*:\s*\[\s*['\"`]@[^\]\n]*['\"`]\s*,\s*['\"`]@"
)
# One tag in the title AND a { tag: ... } option = two tags total, split so
# each looked single. `test('... @P0', { tag: '@destructive' }, fn)`.
MULTI_TAG_TITLE_OPTION = re.compile(
    r"\btest(?:\s*\.\s*\w+)?\s*\(\s*[`'\"][^`'\"\n]*"
    + _ONE_TAG
    + r"[^`'\"\n]*[`'\"]\s*,\s*\{[\s\S]{0,200}?\btag\s*:"
)
# A runtime import in static data. Both fully-type-only forms are exempt:
# `import type { A }` AND `import { type A, type B }` — the inline-type
# specifier list erases at compile time exactly like the `import type` form.
NON_TYPE_IMPORT = re.compile(
    r"^\s*import\s+(?!type\b)"
    r"(?!\{(?:\s*type\s+[\w$]+(?:\s+as\s+[\w$]+)?\s*,?)+\s*\}\s*from)",
    re.MULTILINE,
)
# `import type { ... } from '@playwright/test'` is legitimate (types only);
# the ESLint layer exempts it too — only value imports are blocked.
PLAYWRIGHT_VALUE_IMPORT = re.compile(
    r"^\s*import\s+(?!type\b)(?:\{[^;}]*\}|[^;{\n])*?"
    r"from\s+['\"]@playwright/test['\"]",
    re.MULTILINE,
)
HARDCODED_URL = re.compile(r"""\b(url|baseUrl|baseURL)\s*:\s*['"`]https?://""", re.I)
HARDCODED_GOTO_URL = re.compile(r"""\.goto\(\s*['"`]https?://""", re.I)
HARD_WAIT = re.compile(
    r"\bwaitForTimeout\s*\(|\[\s*['\"]waitForTimeout['\"]\s*\]|\bnew\s+Promise\b[\s\S]{0,80}?\bsetTimeout\b"
)
_SELECTOR_CALL = (
    r"(?:locator|frameLocator)\(|"
    r"page\s*\.\s*(?:click|dblclick|fill|check|uncheck|hover|tap|type|"
    r"selectOption|dispatchEvent|waitForSelector|setChecked|setInputFiles|"
    r"press)\s*\("
)
XPATH_SELECTOR = re.compile(
    r"""['"`][^'"`\n]*xpath=|(?:"""
    + _SELECTOR_CALL
    + r""")\s*['"`](\s|\()*//|(?:"""
    + _SELECTOR_CALL
    + r""")\s*['"`]\.\.(?:['"`]|/)|['"`]\s*\(*(?:descendant|descendant-or-self|ancestor|ancestor-or-self|following|following-sibling|preceding|preceding-sibling|child|parent|self)::"""
)
# `new LoginPage(page)` and member forms like `new pageObjects.LoginPage(page)`.
MANUAL_INSTANTIATION = re.compile(
    r"new\s+(?:[\w$]+\s*\.\s*)*[A-Z][A-Za-z0-9_]*(?:Page|Component)\s*\("
)
INLINE_UNIVERSAL_INVALIDS = re.compile(
    r"\[\s*123\s*,\s*true\s*,\s*null\s*,\s*undefined"
)

# Enforcement infrastructure: agent Write/Edit here would rewrite the rules
# or the hook wiring — the [protected-path] gate blocks it. Repo-root
# relative regardless of E2E_ROOT nesting. Humans edit these files normally;
# hooks only run on agent tool calls.
PROTECTED_PATH = re.compile(r"^(?:\.claude/scripts/|\.claude/settings\.json$)")

# (rule id, path predicate, content predicate or None, message)
# content predicate None => the write itself is forbidden for matching paths.
RULES = [
    (
        "no-playwright-test-import",
        lambda p: SPEC_FILE.search(p),
        lambda c: PLAYWRIGHT_VALUE_IMPORT.search(c),
        "Spec/setup files must import `test`/`expect` from "
        "`qa/07-automation/e2e/fixtures/pom/test-options.ts`, never from "
        "`@playwright/test` (`import type` is fine) (Constitution MUST: Imports).",
    ),
    (
        "no-hard-wait",
        lambda p: TS_FILE.search(p),
        lambda c: HARD_WAIT.search(c),
        "`waitForTimeout()` (and `new Promise(... setTimeout ...)` sleeps) are forbidden "
        "everywhere in qa/07-automation/e2e/. Use web-first assertions, e.g. "
        "`expect(locator).toBeVisible()` (Constitution WON'T: No Hard Waits).",
    ),
    (
        "no-xpath",
        lambda p: UI_OR_TEST_FILE.search(p),
        lambda c: XPATH_SELECTOR.search(c),
        "XPath selectors are forbidden. Use getByRole > getByLabel > getByPlaceholder > "
        "getByText > getByTestId (Constitution WON'T: No XPath).",
    ),
    (
        "no-json-static-data",
        lambda p: STATIC_JSON.search(p),
        None,
        "Files under `test-data/static/` must be TypeScript (`.ts` with `as const` exports). "
        "JSON is forbidden (Constitution WON'T: No JSON Static Data).",
    ),
    (
        "no-functional-tag",
        lambda p: SPEC_FILE.search(p),
        lambda c: re.search(r"@functional(?![\w-])", c),
        "The `@functional` tag is forbidden. Use exactly one of @P0, @P1, @P2, "
        "@P3, or @destructive (Constitution WON'T: No Multiple Tags).",
    ),
    (
        "no-multiple-tags",
        lambda p: SPEC_FILE.search(p),
        lambda c: MULTI_TAG_TITLE.search(c) or MULTI_TAG_ARRAY.search(c) or MULTI_TAG_TITLE_OPTION.search(c),
        "Multiple tags on one test — each test has exactly ONE tag: @P0, @P1, "
        "@P2, @P3, or @destructive (@destructive always wins for shared/global state) "
        "(Constitution WON'T: No Multiple Tags).",
    ),
    (
        "no-tags-on-describe",
        lambda p: SPEC_FILE.search(p),
        lambda c: TAG_IN_DESCRIBE.search(c) or DESCRIBE_TAG_OPTION.search(c),
        "Tags belong on individual tests, never in `test.describe()` titles or "
        "its `{ tag: ... }` option (Constitution WON'T: No Tags on Describe).",
    ),
    (
        "no-manual-instantiation",
        lambda p: SPEC_FILE.search(p),
        lambda c: MANUAL_INSTANTIATION.search(c),
        "Never `new PageObject(page)` inside test files — use the fixtures from "
        "`qa/07-automation/e2e/fixtures/pom/test-options.ts` (Constitution MUST: "
        "Dependency Injection / WON'T: No Manual Instantiation).",
    ),
    (
        "no-runtime-code-in-static-data",
        lambda p: STATIC_TS.search(p),
        lambda c: re.search(r"\bfaker\.", c) or NON_TYPE_IMPORT.search(c),
        "Files under `test-data/static/` may only export literal values (`as const`). "
        "No Faker calls, no runtime imports (`import type` is fine) — dynamic data "
        "belongs in `test-data/factories/` (data-strategy reference, three-tier rule).",
    ),
    (
        "no-hardcoded-url",
        lambda p: TEST_OR_FIXTURE_TS.search(p),
        lambda c: HARDCODED_URL.search(c),
        "URL literals are forbidden in tests/fixtures/page-objects — base URLs come "
        "from `process.env.QA_BASE_URL` (declared in .env.example) "
        "(Constitution MUST: Sources of Truth).",
    ),
    (
        "no-hardcoded-goto-url",
        lambda p: TEST_OR_FIXTURE_TS.search(p),
        lambda c: HARDCODED_GOTO_URL.search(c),
        "`page.goto()` with a URL literal is forbidden — navigate with "
        "`process.env.QA_BASE_URL` + a relative route "
        "(Constitution MUST: Sources of Truth).",
    ),
    (
        "no-inline-universal-invalids",
        lambda p: SPEC_FILE.search(p),
        lambda c: INLINE_UNIVERSAL_INVALIDS.search(c),
        "Do not redefine the universal invalid-value arrays inline. Import "
        "`INVALID_*` from `test-data/static/util/invalid-values.ts` "
        "(data-strategy reference: universal arrays are imported, never redefined).",
    ),
]


def added_content(tool_name: str, tool_input: dict) -> str:
    """Return only the text this tool call would add to the file."""
    if tool_name == "Write":
        return tool_input.get("content", "")
    if tool_name == "Edit":
        return tool_input.get("new_string", "")
    if tool_name == "MultiEdit":
        return "\n".join(
            edit.get("new_string", "") for edit in tool_input.get("edits", [])
        )
    return ""


def scan(paths: "list[str]") -> int:
    """Apply RULES to whole files on disk. Prints rule-id\tpath:line:text."""
    found = False
    for path in paths:
        rel_path = repo_rel(path)
        if not os.path.isfile(path):
            continue
        try:
            content = open(path, encoding="utf-8", errors="replace").read()
        except OSError:
            continue
        for rule_id, path_match, content_match, _message in RULES:
            if not path_match(rel_path):
                continue
            if content_match is None:
                print(f"{rule_id}\t{rel_path}:1:(forbidden file type)")
                found = True
                continue
            if not content_match(content):
                continue
            hit_lines = [
                (i, line.strip())
                for i, line in enumerate(content.splitlines(), 1)
                if content_match(line)
            ]
            if not hit_lines:
                m = content_match(content)
                lineno = content[: m.start()].count("\n") + 1 if hasattr(m, "start") else 1
                hit_lines = [(lineno, "(multiline match)")]
            for lineno, text in hit_lines:
                print(f"{rule_id}\t{rel_path}:{lineno}:{text}")
                found = True
    return 1 if found else 0


def hook() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0  # malformed payload: never block on hook infrastructure errors

    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "")
    if not file_path or tool_name not in ("Write", "Edit", "MultiEdit"):
        return 0

    rel_path = repo_rel(file_path)
    content = added_content(tool_name, tool_input)

    if PROTECTED_PATH.search(rel_path):
        print(
            f"BLOCKED by Constitution enforcement hook ({rel_path}):\n"
            "  - [protected-path] Enforcement infrastructure (.claude/scripts/, "
            ".claude/settings.json) is not agent-writable — an agent must not "
            "rewrite its own gates. Changes here belong to the human: describe "
            "the change and ask them to apply it.",
            file=sys.stderr,
        )
        return 2

    violations = []
    for rule_id, path_match, content_match, message in RULES:
        if not path_match(rel_path):
            continue
        if content_match is None or content_match(content):
            violations.append(f"[{rule_id}] {message}")

    if violations:
        print(
            f"BLOCKED by Constitution enforcement hook ({rel_path}):\n"
            + "\n".join(f"  - {v}" for v in violations),
            file=sys.stderr,
        )
        return 2
    return 0


def main() -> int:
    # Canary hook: prove the fail-closed guard below actually blocks. Set
    # this only when deliberately testing the hook's own failure mode.
    if os.environ.get("_ENFORCE_SELFTEST_CRASH"):
        raise RuntimeError("selftest: forced crash to verify the fail-closed guard")
    if len(sys.argv) > 1 and sys.argv[1] == "--scan":
        return scan(sys.argv[2:])
    return hook()


if __name__ == "__main__":
    # Fail CLOSED on any unexpected crash. A bug in a single rule regex or an
    # os error must BLOCK the write (exit 2), never let it through silently
    # (a bare traceback exits 1, which PreToolUse treats as non-blocking —
    # the exact fail-open hole this layer exists to remove). A malformed
    # payload is handled separately inside hook() and stays fail-open, because
    # that is Claude Code hook-infra noise, not the agent's change.
    #
    # This guard only reaches crashes AFTER module import; a module-level
    # syntax error or a missing python3 exits 1/127 before it runs — that is
    # covered one layer up: settings.json wraps the hook command with
    # `|| exit 2`, mapping ANY non-zero exit to a block.
    try:
        code = main()
    except Exception as exc:  # noqa: BLE001 -- deliberate catch-all, fail closed
        import traceback

        print(
            "BLOCKED — Constitution enforcement hook crashed (failing closed):\n"
            f"  {type(exc).__name__}: {exc}\n"
            "  The write was blocked because enforcement could not run. This is "
            "a bug in the hook, not your change — fix the hook, then retry.",
            file=sys.stderr,
        )
        traceback.print_exc()
        code = 2
    sys.exit(code)
