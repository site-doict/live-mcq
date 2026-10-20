# Antigravity IDE - Safety & Modification Rules

## 1. Core Principle: Explicit Confirmation First
- **Never delete or overwrite core functionality without asking:** You must NEVER delete, rewrite, or substantially modify core business logic, schema, or configuration files without explicit user approval.
- **Deletions require permission:** Before executing any file deletion, removing large blocks of code, dropping database tables/policies, or deleting environment variables, you MUST pause and ask:
  > *"I am planning to remove/delete [File/Function/Data]. Reason: [Why]. Do you approve of this deletion?"*

## 2. High-Risk Files & Areas (Strict Read-Only Unless Approved)
You must seek confirmation before editing or refactoring:
- Database configurations, migrations, schema files, and Supabase RLS policies / triggers.
- Environment variable definitions (`.env`, `.env.example`, `.env.local`).
- Authentication logic, route guards, and permission handlers.
- Existing working APIs and integration endpoints.
- Dependency files (`package.json`, `requirements.txt`, etc.) when removing packages.

## 3. Surgical & Non-Destructive Editing
- **Additive over Subtractive:** Prefer adding new functions or wrapping existing code rather than replacing/deleting established logic.
- **Preserve Working Features:** Always keep backwards compatibility with existing UI workflows and components unless the user explicitly requested a full redesign.
- **Deprecation over Deletion:** If an older helper or function seems unused, comment it out or mark it as deprecated rather than outright deleting it, and inform the user.

## 4. Change Summary & Intent Declaration
- Before applying any substantial multi-file edits, outline the exact plan:
  1. What files will be modified.
  2. What lines/functions are slated for deletion or overhaul.
  3. Why this change is necessary.
- Wait for user confirmation if the change touches critical structural paths.
