# Antigravity IDE - Safety & Autonomy Rules

## 0. Autonomy Policy (default mode, overrides Sections 1, 2, 4 and G12)

A. DEFAULT = ACT, DON'T ASK. Never ask permission for: reading or searching files; creating or editing files inside this repo; refactoring; running scripts, tests and checks (python tools/check-all.py, node tests/e2e.test.js, tools/*.py); editing auth, login, admin-CMS and universal-modes.js code when the task requires it; multi-file edits; deleting files you created yourself this session; deleting repo files that have a copy in _backup_before_audit/ or git history; and creating or switching to a working branch (never main).
B. Do not post a plan and wait. Write a 3-line plan, then execute immediately. Record non-trivial decisions in docs/overnight-report.md or the final report.
C. Do not ask clarifying questions when a reasonable assumption exists. Pick the most conservative sensible assumption, state it in one line, proceed.
D. Run commands without approval prompts where the IDE allows it.
E. The overnight-mode exception becomes the permanent default. The OVERNIGHT_MODE flag file is no longer required.
F. Output discipline: Final report max 15 lines. Do not ask follow-up questions at the end. Put 'Recommended next step' as a single line only.

---

## 1. HARD-STOP List (The only conditions that may pause for the user)

Only these 5 conditions may pause for the user:
1. git push, force-push, history rewrite, branch deletion, or committing to main.
2. Deleting files outside the repo, or repo files with no backup or git history.
3. Printing, logging or committing secrets (GitHub PAT, passwords, tokens).
4. Changing remote or production databases, RLS policies or .env values.
5. Installing a new non-dev dependency or adding any CDN or external asset.

Everything else is autonomous.

---

## 2. Autonomous Scope & Boundaries
All development and maintenance tasks within the repository outside the HARD-STOP list are fully autonomous. Refactoring, editing auth, login, admin-CMS, and universal-modes.js code, running tests and checks, installing dev dependencies, and multi-file edits proceed directly without prompts. If rules conflict, follow the newest and most specific rule, note it in one line, and continue.

---

## 3. Surgical & Non-Destructive Editing
- **Additive over Subtractive:** Prefer adding new functions or wrapping existing code rather than replacing/deleting established logic.
- **Preserve Working Features:** Always keep backwards compatibility with existing UI workflows and components unless explicitly requested otherwise.
- **Deprecation over Deletion:** If an older helper or function seems unused, comment it out or mark it as deprecated rather than outright deleting it, and note it in the report.

---

## 4. Change Summary & Immediate Execution
- State a concise 3-line plan of intent, then execute immediately.
- Record non-trivial decisions in docs/overnight-report.md or the final report.
- Follow surgical diff principles and verify with local test scripts.

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
G13. Final review and report. Before finishing run git status --short, git diff --check and git diff, and remove unrelated changes. Report: Result (PASS/PARTIAL/FAILED/BLOCKED), Implemented, Files changed, Checks run and NOT run, Deviations, Limitations, Recommended next step (recommend only; do not start it). Follow output discipline (max 15 lines, single-line next step).
