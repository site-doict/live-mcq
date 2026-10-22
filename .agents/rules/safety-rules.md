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
- **Zero Fabrication Policy (নিজে থেকে তথ্য বা তত্ত্ব উদ্ভাবন সম্পূর্ণ নিষিদ্ধ):** 
  - Never fabricate, invent, or add unsolicited data, synthetic theory summaries, fictitious timeline boxes, or future/imagined exam sessions. 
  - বইয়ে মূল যে তথ্য ও প্রশ্নাবলি আছে, হুবহু তাই থাকবে। নিজে থেকে কোনো মনগড়া তত্ত্ব, সামারি বক্স বা অতিরিক্ত প্রশ্ন যোগ করা সম্পূর্ণ নিষিদ্ধ।
  - প্রতিটি অধ্যায়ের শুরুতে শুধু বইয়ের আসল "বিসিএস প্রশ্ন বিশ্লেষণ ছক" এবং মূল বইয়ের প্রশ্ন ও ব্যাখ্যা থাকবে।
- **Standard Protocol for Damaged / Ambiguous Questions (অস্পষ্ট বা বিকৃত প্রশ্ন সমাধানের বাধ্যতামূলক প্রটোকল):**
  - স্ক্যান করা পৃষ্ঠা বা OCR-এ কোনো প্রশ্ন অস্পষ্ট, অসম্পূর্ণ বা বিকৃত হলে **কখনোই নিজে থেকে অনুমান করে প্রশ্ন বা উত্তর বানিয়ে বসানো যাবে না**।
  - **বাধ্যতামূলক ৩-ধাপের সমাধান পদ্ধতি:**
    1. বইয়ের প্রশ্নের নিচে প্রদত্ত **ব্যাখ্যাটি মনোযোগ দিয়ে পড়ে** প্রশ্নটি কোন বিষয়ের তা চিহ্নিত করতে হবে।
    2. ব্যাখ্যায় উল্লেখিত বিসিএস সেশন, পরীক্ষার নাম ও সাল (যেমন: ৪২তম বিসিএস, ৩৫তম বিসিএস, ইত্যাদি) ব্যবহার করে **অনলাইনে সার্চ (search_web tool)** করতে হবে।
    3. প্রামাণ্য পরীক্ষার প্রশ্নব্যাংক (যেমন: Uttoron Academy, Live MCQ, Job Solution বা সরকারি পিএসসির প্রশ্নপত্র) থেকে আসল প্রশ্ন, অপশন ও সঠিক উত্তরটি নিশ্চিত হয়ে হুবহু এড করতে হবে।
- **No Literal or Artificial Translations (অদ্ভুত আক্ষরিক অনুবাদ নিষিদ্ধ):** 
  - Never translate international organizations, treaties, acronyms, or technical terms word-by-word into artificial, non-dictionary, or awkward Bengali (e.g., MIGA-কে 'বহুপাক্ষিক বিনিয়োগ গ্যারান্টি সংস্থা', IFC-কে 'আন্তর্জাতিক অর্থায়ন কর্পোরেশন', IDA-কে 'আন্তর্জাতিক উন্নয়ন সমিতি' ইত্যাদি বলা সম্পূর্ণ নিষিদ্ধ)।
- **Use Standard Transliteration & Conventional Exam Names (স্বীকৃত প্রতিবর্ণীকরণ ও প্রচলিত নাম):** 
  - Always use standard transliterations or officially accepted conventional names used in BCS and competitive exams in Bangladesh:
    - Transliterations: **মাল্টিল্যাটারাল ইনভেস্টমেন্ট গ্যারান্টি এজেন্সি (MIGA)**, **ইন্টারন্যাশনাল ফিন্যান্স কর্পোরেশন (IFC)**, **ইন্টারন্যাশনাল ডেভেলপমেন্ট অ্যাসোসিয়েশন (IDA)**, **ইন্টারন্যাশনাল সেন্টার ফর সেটেলমেন্ট অব ইনভেস্টমেন্ট ডিসপিউটস (ICSID)**, **অ্যামনেস্টি ইন্টারন্যাশনাল**, **ট্রান্সপারেন্সি ইন্টারন্যাশনাল**, ইত্যাদি।
    - Standard established names: **আন্তর্জাতিক পুনর্গঠন ও উন্নয়ন ব্যাংক (IBRD)**, **আন্তর্জাতিক মুদ্রা তহবিল (IMF)**, ইত্যাদি।
- **Exact 1:1 Question Count & Badge Synchronization (প্রশ্ন সংখ্যা ও সূচিপত্রের শতভাগ মিল):**
  - বইয়ের পাতার ফিজিক্যাল প্রশ্ন সংখ্যা নিখুঁতভাবে গুনে ফাইল এবং সূচিপত্রের (index.html) ব্যাজে ১০০% মিল রাখতে হবে। বিসিএস প্রশ্ন ছকের ডুপ্লিকেট সেশন যোগ করে মনগড়া সংখ্যা বসানো যাবে না।

## 6. Mandatory Pre-Flight Execution Protocol (প্রতিটি টাস্কের শুরুতে অবশ্য পালনীয়)
- **Step 0 Checklist:** যেকোনো অধ্যায় বা ফাইল তৈরি/সংশোধনের শুরুতে এজেন্টকে অবশ্যই নিশ্চিত করতে হবে:
  1. [ ] মূল পিডিএফ ছাড়া নিজে থেকে কোনো মনগড়া তত্ত্ব/সামারি বা তথ্য যোগ করা হচ্ছে না।
  2. [ ] প্রতিটি প্রশ্নের সংখ্যা মূল পিডিএফের সাথে ১-টু-১ গুনে নিশ্চিত করা হয়েছে।
  3. [ ] অস্পষ্ট বা বিকৃত প্রশ্ন পেলে নিজে থেকে না বানিয়ে, ব্যাখ্যার সূত্র ধরে অনলাইনে প্রামাণ্য প্রশ্নব্যাংক সার্চ করে হুবহু সঠিক প্রশ্ন এড করা হয়েছে।
  4. [ ] কোনো উদ্ভট আক্ষরিক অনুবাদ নেই, প্রচলিত প্রমিত নাম ও প্রতিবর্ণীকরণ ব্যবহৃত হয়েছে।
  5. [ ] পিডিএফে আছে কিন্তু এইচটিএমএলে মিসিং এমন কোনো প্রশ্ন, অপশন বা বিশদ ব্যাখ্যা বাদ পড়েনি তো?
  6. [ ] এই অধ্যায়ের বিষয়বস্তুতে স্কেচনোট কম্পোনেন্ট কাজে লাগে কি না বিবেচনা করা হয়েছে; ব্যবহার করলে তথ্য শতভাগ মূল বই/সোর্স থেকে, কোনো মনগড়া তথ্য নেই।

## 7. World-Class Interactive Quality & Authentic Sources (বিশ্বমানের উপস্থাপনা ও প্রামাণ্য সোর্স)
- **মূল লক্ষ্য ও মিশন (Core Mission):**
  - মূল বইয়ের পিডিএফের প্রশ্ন, তাদের সঠিক উত্তর, বিশদ ও পাঠ্যপুস্তকভিত্তিক ব্যাখ্যা এবং বিষয়ভিত্তিক তত্ত্ব নিয়ে একটি **বিশ্বমানের (World-Class), প্রিমিয়াম ও হাই-কোয়ালিটি ইন্টারেক্টিভ স্মার্ট ই-বুক** তৈরি করা।
  - তথ্য অত্যন্ত গোছানো, আকর্ষণীয় এবং প্রজেক্টের রুলস অনুযায়ী (স্ট্যান্ডার্ড টাইপোগ্রাফি, রেসপনসিভ টেবিল, ইন্টারেক্টিভ কুইজ ইঞ্জিন, ডার্ক/লাইট মোড, ফন্ট স্কেলার) উপস্থাপন করতে হবে।
- **মিসিং তথ্য পুনরুদ্ধার নীতি (Missing Data Restoration):**
  - পিডিএফে প্রদত্ত কোনো প্রশ্ন, অপশন, ছক, তথ্য বা ব্যাখ্যা কোনোভাবেই বাদ দেওয়া যাবে না।
  - যদি কোনো তথ্য বা প্রশ্ন পূর্বে ফাইলে মিসিং হয়ে থাকে কিন্তু মূল পিডিএফে বিদ্যমান থাকে, তবে তা নিখুঁতভাবে ফাইলে যুক্ত করতে হবে।
- **প্রামাণ্য মূল পিডিএফ ফাইলসমূহের নির্দিষ্ট অবস্থান:**
  - **বাংলা সাহিত্য:** `C:\Users\PC User\Downloads\Live MCQ\3. বাংলা_সাহিত্য_.pdf`
  - **বাংলাদেশ বিষয়াবলি:** `C:\Users\PC User\Downloads\Live MCQ\6. বাংলাদেশ_বিষয়াবলি_.pdf`
  - **আন্তর্জাতিক বিষয়াবলি:** `C:\Users\PC User\Downloads\Live MCQ\7. আন্তর্জাতিক_বিষয়াবলি_.pdf`
  - **বাংলা ভাষা ও ব্যাকরণ:** `C:\Users\PC User\Documents\Live MCQ Banlga Language\`

## 8. Sketchnote Visual Notes (Hand-drawn Callouts) - ঐচ্ছিক ও প্রসঙ্গনির্ভর ডিজাইন টুলকিট
- **কাজের ধরন ও মূল দর্শন:**
  - এটি একটি **ঐচ্ছিক, প্রসঙ্গনির্ভর ডিজাইন টুলকিট**। প্রতিটি অধ্যায়ে এটি যোগ করতেই হবে এমন কোনো কোটা বা ন্যূনতম সংখ্যা নেই।
  - যে অধ্যায়ের বিষয়বস্তুতে সূত্র, গুরুত্বপূর্ণ তুলনা, ধাপে ধাপে প্রক্রিয়া, সময়ক্রম বা মনে রাখার মতো বিশেষ পয়েন্ট বিদ্যমান রয়েছে, কেবল সেখানেই এটি মিতব্যয়ীভাবে ব্যবহার করতে হবে।
  - শুধুমাত্র MCQ-নির্ভর বা অনুপযোগী অধ্যায়ে এটি জোর করে যোগ করা যাবে না।
- **জিরো ফেব্রিケーション নীতি (Zero Fabrication Policy):**
  - স্কেচনোট বক্সে শুধুমাত্র অধ্যায়ে ইতিমধ্যে বিদ্যমান তথ্য, সূত্র, তালিকা, ছক বা ব্যাখ্যা পুনর্বিন্যাস করে নান্দনিকভাবে উপস্থাপন করা যাবে।
  - নিজে থেকে কোনো নতুন তথ্য, তত্ত্ব, সাল, উদাহরণ বা প্রশ্ন উদ্ভাবন সম্পূর্ণ নিষিদ্ধ।
  - রেফারেন্স ডিজাইনের (ChatGPT, পিথাগোরাস, ইথানল, জমি দখল, জিআর-সিআর ইত্যাদি) বিষয়বস্তু কেবল ডিজাইনের বাহ্যিক কাঠামোগত উদাহরণ, এর কোনো টেক্সট বা তথ্য বইয়ে ব্যবহার করা যাবে না।
- **কোর ইঞ্জিনের নিরাপত্তা ও অ্যাডিটিভ নীতি:**
  - কোনো প্রশ্ন, অপশন, উত্তর, বিশদ ব্যাখ্যা বা বিসিএস প্রশ্ন বিশ্লেষণ ছক মুছে বা প্রতিস্থাপন করে স্কেচনোট বসানো যাবে না। স্কেচনোট হবে সম্পূর্ণ অতিরিক্ত ভিজ্যুয়াল স্তর (Additive Layer)।
  - মূল `.q-card` কুইজ ইঞ্জিন, প্রশ্নসংখ্যা, সূচিপত্র ব্যাজ এবং `nav-component.js`-এর কার্যকারিতা শতভাগ অপরিবর্তিত থাকবে।
- **প্রযুক্তিগত বৈশিষ্ট্য:**
  - Pure HTML + Pure CSS (কোনো জাভাস্ক্রিপ্ট নির্ভরতা নেই)।
  - সমস্ত ক্লাস `sk-` প্রিফিক্সযুক্ত (যেমন: `.sk-page`, `.sk-box`, `.sk-sticky`, `.sk-mark`, `.sk-flow`, `.sk-table`, `.sk-compare`, `.sk-remember`)।
  - ডার্ক মোড ও লাইট মোড শতভাগ সমর্থিত এবং রেসপনসিভ (`overflow-x: clip`, `.table-responsive`)।
