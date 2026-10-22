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

## 5. Strict Prohibition on Fabricating Information & Literal Translations (স্বেচ্ছাচারী উদ্ভাবন ও আক্ষরিক অনুবাদ সম্পূর্ণ নিষিদ্ধ)
- **Zero Fabrication Policy (নিজে থেকে তথ্য উদ্ভাবন সম্পূর্ণ নিষিদ্ধ):** Never fabricate, invent, or add unsolicited data, future exam sessions (e.g., fictitious 50th, 49th, 48th BCS), or imagined facts. Only authentic, verifiable information from standard competitive exam question banks (Live MCQ, BCS, Uttoron, Job Solution) must be used.
- **No Literal or Artificial Translations (অদ্ভুত আক্ষরিক অনুবাদ নিষিদ্ধ):** Never translate international organizations, treaties, acronyms, or technical terms word-by-word into artificial, non-dictionary, or awkward Bengali (e.g., MIGA-কে 'বহুপাক্ষিক বিনিয়োগ গ্যারান্টি সংস্থা', IFC-কে 'আন্তর্জাতিক অর্থায়ন কর্পোরেশন', IDA-কে 'আন্তর্জাতিক উন্নয়ন সমিতি' ইত্যাদি বলা যাবে না)।
- **Use Standard Transliteration & Conventional Exam Names (স্বীকৃত প্রতিবর্ণীকরণ ও প্রচলিত নাম):** Always use standard transliterations or officially accepted conventional names used in BCS and competitive exams in Bangladesh:
  - Transliterations: **মাল্টিল্যাটারাল ইনভেস্টমেন্ট গ্যারান্টি এজেন্সি (MIGA)**, **ইন্টারন্যাশনাল ফিন্যান্স কর্পোরেশন (IFC)**, **ইন্টারন্যাশনাল ডেভেলপমেন্ট অ্যাসোসিয়েশন (IDA)**, **ইন্টারন্যাশনাল সেন্টার ফর সেটেলমেন্ট অব ইনভেস্টমেন্ট ডিসপিউটস (ICSID)**, **অ্যামনেস্টি ইন্টারন্যাশনাল**, **ট্রান্সপারেন্সি ইন্টারন্যাশনাল**, ইত্যাদি।
  - Standard established names: **আন্তর্জাতিক পুনর্গঠন ও উন্নয়ন ব্যাংক (IBRD)**, **আন্তর্জাতিক মুদ্রা তহবিল (IMF)**, ইত্যাদি।
- **Correction-Only Scope (শুধুমাত্র ত্রুটি সংশোধন):** Do not inject extraneous or personal opinions. Focus exclusively on fixing OCR errors, restoring genuine questions, removing junk/noise, and aligning styling with established project standards.

