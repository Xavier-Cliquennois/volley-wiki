#!/usr/bin/env python3
"""PreToolUse hook (Bash): keep `main` reachable only through a dev promotion.

`main` is the production branch (see CLAUDE.md, "Deux branches").
GitHub branch protection is unavailable on this plan, so the rule is enforced here,
for every Claude Code session of the project.

Exit 2 = block the command, stderr is shown to Claude. Anything else = allow.
Fail open on a parse problem: a guard that wedges every Bash call is worse than none.
"""
import json
import re
import shlex
import subprocess
import sys

PROMOTION_HEADS = ("dev",)
HOTFIX_PREFIX = "hotfix/"


def deny(reason: str) -> None:
    print(f"BLOQUÉ : {reason}\nVoir CLAUDE.md § Deux branches : dev pour développer, main pour livrer.", file=sys.stderr)
    sys.exit(2)


def is_allowed_head(head: str) -> bool:
    return head in PROMOTION_HEADS or head.startswith(HOTFIX_PREFIX)


def run(args: list[str], cwd: str) -> str:
    try:
        return subprocess.run(args, cwd=cwd, capture_output=True, text=True, timeout=20).stdout.strip()
    except Exception:
        return ""


def current_branch(cwd: str) -> str:
    return run(["git", "branch", "--show-current"], cwd)


def option(tokens: list[str], *names: str) -> str | None:
    for i, tok in enumerate(tokens):
        for name in names:
            if tok == name and i + 1 < len(tokens):
                return tokens[i + 1]
            if tok.startswith(name + "="):
                return tok.split("=", 1)[1]
    return None


def check_push(tokens: list[str], cwd: str) -> None:
    args = [t for t in tokens[2:] if not t.startswith("-")]
    refspecs = args[1:]  # args[0] is the remote
    for spec in refspecs:
        dest = spec.split(":")[-1] if ":" in spec else spec
        dest = dest.removeprefix("+").removeprefix("refs/heads/")
        if dest == "main":
            deny("push direct vers main. Fusionne dev dans main par une PR de promotion (gh pr create --base main --head dev).")
    if not refspecs and current_branch(cwd) == "main":
        deny("push depuis la branche main. On ne développe pas sur main.")


def check_pr_create(tokens: list[str], cwd: str) -> None:
    if option(tokens, "--base", "-B") != "main":
        return
    head = option(tokens, "--head", "-H") or current_branch(cwd)
    if not is_allowed_head(head):
        deny(f"PR vers main depuis « {head} ». Seules `dev` (promotion) et `hotfix/*` (urgence) peuvent cibler main ; ouvre ta PR vers dev.")


def check_pr_merge(tokens: list[str], cwd: str) -> None:
    positional = [t for t in tokens[3:] if not t.startswith("-")]
    cmd = ["gh", "pr", "view", *positional[:1], "--json", "baseRefName,headRefName"]
    info = run(cmd, cwd)
    try:
        data = json.loads(info)
    except ValueError:
        return
    if data.get("baseRefName") == "main" and not is_allowed_head(data.get("headRefName", "")):
        deny(f"fusion d'une PR « {data['headRefName']} » dans main. Elle doit viser dev ; seule la promotion dev → main (ou un hotfix/*) fusionne dans main.")


def main() -> None:
    try:
        payload = json.load(sys.stdin)
        command = payload["tool_input"]["command"]
        cwd = payload.get("cwd") or "."
    except Exception:
        return
    for segment in re.split(r"&&|\|\||;|\n|\|", command):
        try:
            tokens = shlex.split(segment)
        except ValueError:
            continue
        if tokens[:2] == ["git", "push"]:
            check_push(tokens, cwd)
        elif tokens[:3] == ["gh", "pr", "create"]:
            check_pr_create(tokens, cwd)
        elif tokens[:3] == ["gh", "pr", "merge"]:
            check_pr_merge(tokens, cwd)


main()
