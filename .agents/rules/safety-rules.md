# Antigravity IDE - Safety & Autonomy Rules

## VIBE MODE (highest priority, overrides everything below)

1. I give a command, you execute it. Do exactly what I say, immediately, end to end. No confirmation, no permission requests, no "shall I proceed?", no plan-then-wait, no menus of options.
2. Never ask clarifying questions. If something is ambiguous, pick the most sensible interpretation, state it in one line in the final report, and proceed. I will correct you afterward if needed.
3. Never ask before: reading, creating, editing, refactoring, renaming, deleting repo files (git history is the safety net), multi-file edits, running scripts/tests/checks/dev servers, editing auth/login/CMS code, creating branches, or doing follow-up work needed to finish the requested task.
4. Finish the whole job in one go. Do not stop midway to report progress. If a step fails, fix it and retry up to 3 times with different approaches before reporting.
5. Run the relevant checks yourself (python tools/check-all.py, node tests/e2e.test.js, viewport checks for UI changes) and fix failures before finishing. Never claim a check passed unless you ran it.
6. Keep scope tight: do what I asked, no bonus features or unrelated cleanups. But if my request obviously requires a related change to work (e.g. updating an index badge after adding a question), do it without asking.
7. Final report: max 10 lines. What was done, files changed, checks run, assumptions made. No follow-up questions. One-line "Recommended next step" at most.

### HARD STOPS (the only cases where you may pause and ask):
- git push, force-push, history rewrite, branch deletion, or committing to main
- deleting anything outside the repo
- printing, logging or committing secrets (PAT, passwords, tokens)
- changing remote/production databases, RLS policies or .env values
- installing a non-dev dependency or adding any CDN/external asset
Outside this list, never ask. If a request would cross a hard stop, do everything else first, then ask only about that one item.

---

## 1. Autonomous Scope & Boundaries
All standard development tasks inside this repository outside the HARD STOPS list are fully autonomous. Refactoring, editing auth, login, admin-CMS, and universal-modes.js code, running tests and checks, installing dev dependencies, and multi-file edits proceed directly without prompts. If rules conflict, follow the newest and most specific rule, note it in one line, and continue.

---

## 2. Surgical & Non-Destructive Editing
- **Additive over Subtractive:** Prefer adding new functions or wrapping existing code rather than replacing/deleting established logic.
- **Preserve Working Features:** Always keep backwards compatibility with existing UI workflows and components unless explicitly requested otherwise.
- **Deprecation over Deletion:** If an older helper or function seems unused, comment it out or mark it as deprecated rather than outright deleting it, and note it in the report.

---

## 3. Change Summary & Immediate Execution
- Execute immediately end-to-end.
- Record non-trivial decisions in docs/overnight-report.md or the final report.
- Follow surgical diff principles and verify via local scripts.

---

## G. Engineering Guardrails (Anti-Overengineering / Anti-Hallucination)
These apply to every task. If rules conflict, follow the newest and most specific rule, note it in one line, and continue.

G1. Scope lock. Do only the explicitly assigned task. No bonus features, unrelated fixes, redesigns or "while I'm here" cleanups. When done, STOP and report. Do not start the next subject, book or phase. (Exception: when instructed for a whole subject under the Autonomous Execution Protocol, run all its steps for THAT subject only.)
G2. Inspect before editing. Read the relevant files, git status and recent commits first. Before referencing any file path, function, CSS class, JS module or JSON key, verify it exists (open or grep it). Never reference things from memory.
G3. Simplest solution. Reuse existing scripts, templates, CSS classes and JS modules (universal-modes.js, nav-component.js, ebook-ui.js, _templates/, tools/) before writing anything new. No new framework, build step, abstraction layer or helper hierarchy unless unavoidable.
G4. Dependencies. Do not install, upgrade or remove any npm/pip package. Do not add any CDN, external script, font or asset. KaTeX stays self-hosted in vendor/katex/. New non-dev dependencies or external assets trigger a HARD-STOP.
G5. Surgical diffs. Edit the smallest necessary region. No whole-file rewrites, mass reformatting, or regeneration of existing chapters unless explicitly requested. Preserve unrelated code, comments and config.
G6. No fake fixes. Never hardcode expected results; never delete or skip questions or checks to make counts or audits pass; never weaken or edit tools/check-ebook-indexes.py or any audit script; never hide errors. If a check fails, fix the real cause or report it.
G7. No fabrication. Never invent questions, answers, years, sources or facts. When the source is unclear, follow the existing 3-step damaged-question recovery protocol; if still unresolved, mark it "unresolved" in the report instead of guessing.
G8. Honest verification. Run the checks relevant to the change (for example python tools/check-ebook-indexes.py, question-count audit, link check, and viewport checks at 320/360/390/412px for UI changes). Say a check passed only if you actually ran it and saw it pass; otherwise say "not run" and why.
G9. Git safety. Before editing run git status --short and git branch --show-current. Never use reset --hard, clean -fd, force checkout, force push, history rewrite or automatic stash. Committing to main, push, force-push, history rewrite, or branch deletion trigger a HARD-STOP. Work only on the designated working branch or audit-overnight.
G10. External access. No network calls, downloads, scraping, uploads or production writes, EXCEPT web search used for the damaged/ambiguous-question recovery protocol.
G11. Secrets. Never print, log, copy into reports or commits, or hard-code passwords, tokens or PATs, and never create new ones.
G12. Stop conditions. HARD-STOP conditions govern when to stop for user direction. If rules conflict, follow the newest and most specific rule, note it in one line, and continue.
G13. Final review and report. Before finishing run git status --short, git diff --check and git diff, and remove unrelated changes. Report: Result (PASS/PARTIAL/FAILED/BLOCKED), Implemented, Files changed, Checks run and NOT run, Deviations, Limitations, Recommended next step (recommend only; do not start it). Follow output discipline (max 10 lines, single-line next step).
