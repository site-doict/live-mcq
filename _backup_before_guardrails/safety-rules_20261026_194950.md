# Antigravity IDE - Safety & Modification Rules

## 0. Overnight Maintenance Mode (exception to Section 1)
Active ONLY while the file `.agents/OVERNIGHT_MODE` exists in the repo root.
While active, do NOT ask for confirmation for: editing/refactoring any file inside this repository
(including authentication, login and admin-editor code), creating files/folders, running scripts and tests,
installing dev dependencies (npm/pip).
Still FORBIDDEN in this mode: git push / force-push / history rewrite / branch deletion; committing to `main`
(work only on branch `audit-overnight`); deleting anything outside the repo; deleting repo files that have no
copy in `_backup_before_audit/`; printing, logging or committing secrets (GitHub PAT `ebk_admin_pat`, tokens,
passwords); changing remote databases or policies.
Instead of asking, record every non-trivial decision in `docs/overnight-report.md`.

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

---

## 5. তথ্যের সত্যতা, জিরো ফেব্রিকেশন ও প্রামাণ্য নোট নীতি (Authentic Data & Note Synthesis Policy)
- **জিরো ফেব্রিকেশন নীতি (Zero External Fabrication Policy):**
  - মূল বই বা নির্ভরযোগ্য পরীক্ষার তথ্যের বাইরে নিজে থেকে কোনো কাল্পনিক বা মনগড়া তথ্য, মনগড়া সাল, ভিত্তিহীন ঐতিহাসিক গল্প বা অস্তিত্বহীন বিসিএস সেশন যোগ করা সম্পূর্ণ নিষিদ্ধ।
  - বইয়ের বাইরে থেকে কোনো তথ্য বানিয়ে লেখা যাবে না।
- **বাধ্যতামূলক প্রামাণ্য ইন্টারেক্টিভ নোট নীতি (Mandatory Authentic Study Note Synthesis):**
  - **প্রশ্ন ও ব্যাখ্যা হতে প্রামাণ্য নোট তৈরি বাধ্যতামূলক:** প্রতিটি অধ্যায়ের শুরুতে বইয়ের প্রশ্ন ও তাদের নিচের **বিশদ ব্যাখ্যা (Detailed Explanations)** থেকে প্রাপ্ত সমস্ত গুরুত্বপূর্ণ নিয়ম, ব্যাকরণিক সূত্র, সংজ্ঞা, সাহিত্যের যুগবৈশিষ্ট্য, সাহিত্যিকদের তুলনা, টাইমলাইন ও তথ্য সংগ্রহ করে একটি আকর্ষণীয় ও সমৃদ্ধ **"প্রামাণ্য ইন্টারেক্টিভ রিভিশন নোট ও সূত্রাবলি" (Part 1: Authentic Interactive Study Notes & Sketchnotes)** তৈরি করতে হবে।
  - এটি কোনো মনগড়া তথ্য নয়; এটি বইয়ের ব্যাখ্যায় লুকিয়ে থাকা অমূল্য তথ্যভাণ্ডারকে শিক্ষার্থীর সুবিধার্থে গোছানো ও স্টাইলিশভাবে অধ্যায়ের শুরুতে তুলে ধরা।
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
  - **বিসিএস প্রিলিমিনারি প্রশ্ন সংখ্যা মানদণ্ড (BCS 100/200 Question Rule):**
    - **৩৫তম থেকে পরবর্তী সকল বিসিএস:** বাধ্যতামূলকভাবে প্রতিটি সম্পূর্ণ বিসিএস পরীক্ষায় **২০০টি** প্রশ্ন থাকতে হবে।
    - **১০ম থেকে ৩৪তম বিসিএস:** বাধ্যতামূলকভাবে প্রতিটি সম্পূর্ণ বিসিএস পরীক্ষায় **১০০টি** প্রশ্ন থাকতে হবে।
    - **মিসিং প্রশ্ন পুনরুদ্ধার প্রটোকল:** কোনো অধ্যায়ে বা বিসিএস সেকশনে প্রশ্ন সংখ্যা কম থাকলে বাধ্যতামূলক ৩-ধাপের সমাধান পদ্ধতি ব্যবহার করে ব্যাখ্যা, সেশন ও সরকারি পিএসসি/জব সলিউশন প্রশ্নব্যাংক থেকে মূল প্রশ্ন ও সঠিক উত্তর উদ্ধার করে নির্দিষ্ট অধ্যায়ে ও বিসিএস কুইজে যুক্ত করতে হবে যাতে মোট প্রশ্ন সংখ্যা নিখুঁতভাবে মেলে।
- **বইয়ের চিত্র ও ডায়াগ্রাম ক্রপিং এবং বাধ্যতামূলক এমবেডিং নীতি (Mandatory Authentic Diagram Cropping & Embedding Policy):**
  - **কোনো চিত্র বাদ দেওয়া সম্পূর্ণ নিষিদ্ধ:** মূল বই বা স্ক্যান করা পিডিএফে যেসব প্রশ্নে বা ব্যাখ্যার সমাধানে **চিত্র, ডায়াগ্রাম, জ্যামিতিক নকশা বা ভিজ্যুয়াল পাজল** রয়েছে, সেগুলো কোনো অবস্থাতেই টেক্সট দিয়ে স্কিপ বা বাদ দেওয়া যাবে না।
  - **উচ্চ রেজ্যুলিউশনে ক্রপ ও সেভ:** প্রতিটি চিত্রকে মূল পিডিএফ থেকে **উচ্চ রেজ্যুলিউশনে (কমপক্ষে 200–300 DPI)** নিখুঁত বাউন্ডিং বক্সে ক্রপ করে সংশ্লিষ্ট বিষয়ের `images/` ফোল্ডারে সেভ করতে হবে।
  - **এইচটিএমএলে বাধ্যতামূলক এমবেডিং:** সংশ্লিষ্ট প্রশ্ন বা ব্যাখ্যার ড্রয়ারের মধ্যে রেসপনসিভ কনটেইনারে (`.q-diagram-wrap` ও `.q-diagram`) চিত্রটি এমবেড করতে হবে।

---

## 6. প্রতিটি অধ্যায়ের বাধ্যতামূলক দ্বি-স্তরীয় কাঠামো (Two-Part Chapter Architecture)
প্রতিটি অধ্যায়ের এইচটিএমএল ফাইলে অবশ্যই নিচের সুনির্দিষ্ট ক্রমানুসারে উপাদানগুলো থাকবে:

1. **টপ নেভিগেশন ও হেডার (Top Navigation & Header):**
   - সূচিপত্রে ফেরার লিংক, ফন্ট সাইজ কন্ট্রোলার (`A-`, `A`, `A+`) এবং থিম টগল (`🌙`/`☀️`)।
   - দ্বিভাষিক শিরোনাম: `<h1 class="ch-title [font]">{বাংলা নাম} <span class="ch-en">({English Title})</span></h1>` (যেখানে `.ch-en`-এ অবশ্যই `font-family: 'Inter', sans-serif !important;` থাকবে)।
   - পৃষ্ঠা নম্বর ও মোট ফিজিক্যাল প্রশ্নের ব্যাজ।
2. **বিসিএস প্রশ্ন বিশ্লেষণ ছক (BCS Analysis Matrix):**
   - বইয়ের পাতার শুরুতে মুদ্রিত আসল বিসিএস ছকটি হুবহু রেসপনসিভ টেবিলে রূপান্তর।
3. **প্রথম অংশ (Part 1): প্রামাণ্য ইন্টারেক্টিভ রিভিশন নোট ও সূত্রাবলি (Authentic Interactive Notes & Sketchnotes):**
   - **অবস্থান:** বিসিএস ছকের ঠিক পরে এবং কুইজ ইঞ্জিনের আগে।
   - **তথ্যসূত্র:** উক্ত অধ্যায়ের সমস্ত প্রশ্নের নিচের বিশদ ব্যাখ্যা ও মূল বইয়ের তাত্ত্বিক আলোচনা থেকে সংকলিত।
   - **ডিজাইন ও স্টাইল:** অধ্যায়ের নির্ধারিত **বাংলা হস্তলিপি ফন্ট (`.font-[name]`)**, হ্যান্ড-ড্রন স্কেচনোট বক্স (`.sk-box`), স্টিকি নোট (`.sk-sticky`), তুলনা ছক (`.sk-compare`), ফর্মুলা কার্ড (`.sk-formula`), এবং হাইলাইটার (`.sk-mark`)।
   - **উদ্দেশ্য:** শিক্ষার্থী যেন মূল পরীক্ষায় আসা প্রশ্নের কুইজে যাওয়ার আগেই অধ্যায়ের সকল নিয়ম, সূত্র, কালজয়ী তথ্য ও ট্রিকস এক নজরে আয়ত্ত করতে পারে।
4. **দ্বিতীয় অংশ (Part 2): বিগত বছরের প্রামাণ্য প্রশ্নব্যাংক ও ইন্টারঅ্যাক্টিভ কুইজ (Past Exam Question Engine):**
   - **টাইপোগ্রাফি প্রোটেকশন:** সকল প্রশ্ন, অপশন, ড্রয়ার, ব্যাজ এবং ব্যাখ্যায় বাধ্যতামূলকভাবে **`Noto Serif Bengali`** ফন্ট (`font-family: 'Noto Serif Bengali', 'Kalpurush', Georgia, serif !important;`) প্রযোজ্য হবে।
   - **ফিচারসমূহ:** লাইভ স্কোর কাউন্টার (`০ / [মোট প্রশ্ন]`), বিসিএস সেশন অনুযায়ী ফিল্টার ড্রপডাউন, অপশন সিলেকশন ফিডব্যাক (সঠিক হলে সবুজ, ভুল হলে লাল এবং সঠিকটি হাইলাইট), কুইজ রিসেট বাটন, এবং ব্যাখ্যার কলাপসিবল ড্রয়ার।
5. **প্রামাণ্য গ্রন্থপঞ্জি ও ফুটার (Bibliography & Footer):**
   - বইয়ের অধ্যায় বা বিষয়ের শেষে থাকা আসল রেফারেন্স গ্রন্থপঞ্জি এবং সর্বজনীন কপিরাইট/তথ্যসমাপ্তি ফুটার।

---

## 7. ১০টি বাস্তবসম্মত পেপার টেক্সচার ও ২১টি বাংলা হস্তলিপি ফন্টের স্বয়ংক্রিয় রোটেশন শিডিউল

### ক. স্বয়ংক্রিয় বিল্ড-টাইম রোটেশন নীতি (Automatic Deterministic Rotation):
ব্যবহারকারীকে মনে করিয়ে দেওয়া লাগবে না। এজেন্ট নতুন কোনো বিষয়ের অধ্যায় তৈরি করার সময় ক্রমানুসারে নিচের সাইক্লিক শিডিউল মেনে স্বয়ংক্রিয়ভাবে পেপার ও ফন্ট ক্লাস কন্টেইনারে যুক্ত করবে (পাশাপাশি দুটি অধ্যায়ে একই পেপার বা ফন্ট ব্যবহার কঠোরভাবে নিষিদ্ধ):

| অধ্যায় নং | পেপার টেক্সচার ক্লাস (`paper-textures.css`) | পেপারের বিবরণ | বাংলা হস্তলিপি ফন্ট ক্লাস (`bangla-fonts.css`) | ফন্টের নাম |
|:---:|---|---|---|---|
| **Ch 01** | `.paper-old-aged` | পুরাতন সেপিয়া কাগজ | `.font-nirlipta` | নির্লিপ্ত |
| **Ch 02** | `.paper-lined-notebook` | দাগটানা খাতা (লাল মার্জিন) | `.font-rayhan` | রায়হান হস্তশৈলী |
| **Ch 03** | `.paper-torn` | ছেঁড়া পাতা (অসমান খাঁজ) | `.font-durbar` | দুর্বার |
| **Ch 04** | `.paper-dot-grid` | ডট গ্রিড বুলেট জার্নাল | `.font-begum-zia` | বেগম জিয়া |
| **Ch 05** | `.paper-graph` | ব্লুপ্রিন্ট গ্রাফ পেপার | `.font-begum-zia-curve` | বেগম জিয়া কার্ভ |
| **Ch 06** | `.paper-crumpled` | কুঁচকানো ৩ডি কাগজ | `.font-anirban` | অনির্বাণ |
| **Ch 07** | `.paper-coffee-stained` | কফির দাগযুক্ত কাগজ | `.font-badhon-ador` | বাঁধন আদর |
| **Ch 08** | `.paper-legal-pad` | হলুদ আইনি ড্রাফট প্যাড | `.font-shorif-rafid` | শরীফ রাফিদ |
| **Ch 09** | `.paper-burnt-edge` | পোড়া প্রান্তের প্রাচীন স্ক্রোল | `.font-hasan` | হাসান কলকাতা |
| **Ch 10** | `.paper-kraft` | ক্রাফট কার্ডবোর্ড কাগজ | `.font-ahasan` | আহসান নীলাঞ্জনা |
| **Ch 11** | `.paper-lined-notebook` | দাগটানা খাতা | `.font-mamun` | মামুন বর্ণলিপি |
| **Ch 12** | `.paper-old-aged` | পুরাতন কাগজ | `.font-gedamala` | বাঁধন গেঁদামাল |
| **Ch 13** | `.paper-dot-grid` | ডট গ্রিড | `.font-kornofuli` | কর্ণফুলী |
| **Ch 14** | `.paper-graph` | গ্রাফ পেপার | `.font-shadhinata` | স্বাধীনতা |
| **Ch 15** | `.paper-torn` | ছেঁড়া পাতা | `.font-trimohona` | ত্রিমোহনা |
| **Ch 16** | `.paper-crumpled` | কুঁচকানো কাগজ | `.font-prapti` | প্রাপ্তি |
| **Ch 17** | `.paper-coffee-stained` | কফি দাগযুক্ত | `.font-abu-sayed` | আবু সাঈদ |
| **Ch 18** | `.paper-legal-pad` | হলুদ আইনি প্যাড | `.font-ekush` | একুশ |
| **Ch 19** | `.paper-burnt-edge` | পোড়া প্রান্তের স্ক্রোল | `.font-priotoma` | প্রিয়তমা |
| **Ch 20** | `.paper-kraft` | ক্রাফট কাগজ | `.font-priotoma-2` | প্রিয়তমা ২ |
| **Ch 21+** | সাইকেল অনুযায়ী পুনরাবৃত্তি | ক্রম অনুযায়ী রোটেশন | `.font-dinar` ও সাইকেল | দীনার ও রোটেশন |

### খ. কার্ডের গ্লাস মরফিজম ও ট্রান্সলুসেন্সি বাধ্যতামূলক নিয়ম (Card Translucency):
- পেপারের টেক্সচার (দাগটানা লাইন, গ্রিড, পোড়া কিনারা, কফির রিং) যেন কার্ডের তলা থেকে স্পষ্টভাবে ফুটে ওঠে, সেজন্য প্রতিটি কার্ডে অবশ্যই ট্রান্সলুসেন্ট ব্যাকগ্রাউন্ড ও ব্যাকড্রপ ফিল্টার থাকতে হবে:
  ```css
  /* লাইট মোড */
  --bg-surface: rgba(255, 255, 255, 0.85);
  --bg-card: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  /* ডার্ক মোড */
  --bg-surface: rgba(28, 25, 23, 0.85); /* অথবা ডার্ক থিমের সাপেক্ষে */
  --bg-card: rgba(28, 25, 23, 0.82);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  ```
- কোনো কার্ডে নিরেট অস্বচ্ছ সাদা (`#ffffff`) বা ফ্ল্যাট রঙ ব্যবহার করা যাবে না।

### গ. ইংরেজি সাবটাইটেল ফন্ট প্রোটেকশন (`.ch-en`):
- বাংলা হস্তলিপি ফন্টে ইংরেজি হরফ বিকৃত দেখায়। তাই প্রতিটি শিরোনামের ইংরেজি অংশে অবশ্যই ইন্টার ফন্ট প্রয়োগ করতে হবে:
  ```css
  .ch-title .ch-en {
    font-family: 'Inter', sans-serif !important;
  }
  ```

### ঘ. পরীক্ষার প্রশ্ন ও অপশনের টাইপোগ্রাফি প্রোটেকশন:
- কুইজ সেকশনের সমস্ত উপাদান অবশ্যই প্রমিত `Noto Serif Bengali` দিয়ে সুরক্ষিত থাকবে:
  ```css
  .q-card, .q-card *, .q-text, .q-text *, .opt-btn, .opt-btn *,
  .ans-drawer, .ans-drawer *, .exp-drawer, .exp-drawer *,
  .bcs-table, .bcs-table *, .score-bar, .score-bar *, .doubt-box, .doubt-box * {
    font-family: 'Noto Serif Bengali', 'Kalpurush', Georgia, serif !important;
  }
  ```

### ঙ. বাংলা হস্তলিপি ফন্টসমূহের টাইপোগ্রাফি রিডেবিলিটি ও প্রয়োগ নীতি (Handwriting Font Readability Rule):
- **কঠোর রিডেবিলিটি নীতি:** রায়হান হস্তশৈলী (`.font-rayhan`), বেগম জিয়া কার্ভ (`.font-begum-zia-curve`), আহসান নীলাঞ্জনা (`.font-ahasan`), কর্ণফুলী (`.font-kornofuli`), ত্রিমোহনা (`.font-trimohona`), প্রাপ্তি (`.font-prapti`), আবু সাঈদ (`.font-abu-sayed`), প্রিয়তমা (`.font-priotoma`), প্রিয়তমা ২ (`.font-priotoma-2`), দীনার (`.font-dinar`), দুর্বার (`.font-durbar`), বাঁধন আদর (`.font-badhon-ador`) সহ প্রজেক্টের সমস্ত ২১টি হস্তলিপি ফন্ট অতিরিক্ত স্টাইলিশ ও টানা হাতের লেখা হওয়ায় এগুলো দিয়ে পূর্ণাঙ্গ অনুচ্ছেদ, টেবিল বা সূত্র পড়লে পাঠকের চোখে মারাত্মক ক্লান্তি আসে।
- **শুধু শিরোনাম ও টপিকের নামে হস্তলিপি ফন্ট:** প্রজেক্টের সর্বত্র হস্তলিপি ফন্ট কেবল **নোটের টপিকের নাম, সেকশন হেডিং ও প্রধান শিরোনাম** সাজানোর জন্য ব্যবহৃত হবে (যেমন: `.sk-box-title`, `.sk-title`, `.ch-title`, `.ch-subtitle`, `.sec-heading`, `h1`-`h6`, `.sk-section-header`, `.sk-sticky-title`, `.handwritten`)।
- **বর্ণনা, মূল কথা, টেবিল ও সূত্রে `Noto Serif Bengali` বাধ্যতামূলক:** নোটের যাবতীয় **বর্ণনা, বিস্তারিত আলোচনা, তুলনামূলক ছক ও টেবিল সেল (`th`, `td`), সূত্রাবলি (`.sk-formula`), স্টিকি নোটের বিবরণ, ইনফো কার্ড ও তালিকা (`ul`, `ol`, `li`)** বাধ্যতামূলকভাবে প্রমিত পঠনযোগ্য **`Noto Serif Bengali`** ফন্টে রেন্ডার হতে হবে।
- **সিএসএস আর্কিটেকচার:** `bangla-fonts.css`-এ প্রতিটি ফন্টের জন্য এই দ্বি-স্তরীয় নিয়ম স্বয়ংক্রিয়ভাবে কার্যকর করা আছে। এইচটিএমএল কোডিংয়ের সময়ও নিশ্চিত করতে হবে যেন কোনো দীর্ঘ টেক্সট ব্লকে সরাসরি হস্তলিপি ফন্ট প্রয়োগ না করা হয়।

---

## 8. সম্পূর্ণ স্বয়ংক্রিয় এক ক্লিকে এক্সিকিউশন প্রটোকল (Autonomous Execution Protocol)
ব্যবহারকারী শুধু বিষয়ের নাম, ফোল্ডারের লোকেশন এবং মূল পিডিএফ ফাইলের লোকেশন উল্লেখ করবেন। এজেন্ট কোনো বাড়তি প্রম্পট ছাড়াই সম্পূর্ণ স্বয়ংক্রিয়ভাবে নিচের ক্রমানুসারে সম্পূর্ণ সাবজেক্ট তৈরি সম্পন্ন করবে:

1. **Step 1: সোর্স অডিট ও প্ল্যানিং:** মূল পিডিএফ থেকে অধ্যায়গুলোর পৃষ্ঠা সীমা ও ফিজিক্যাল প্রশ্ন সংখ্যা নিখুঁতভাবে গণনা।
2. **Step 2: চ্যাপ্টার কোডিং (দ্বি-স্তরীয় আর্কিটেকচার):**
   - রোটেশন শিডিউল অনুযায়ী নির্দিষ্ট পেপার ও ফন্ট ক্লাসে `<div class="container paper-container paper-[style] font-[style]">` তৈরি।
   - ব্যাখ্যা ও তত্ত্ব থেকে প্রামাণ্য ইন্টারেক্টিভ নোট (Part 1) সংকলন।
   - প্রামাণ্য কুইজ ইঞ্জিন ও প্রশ্নাবলি (Part 2) সংযোজন।
3. **Step 3: বিষয়ভিত্তিক পোর্টাল সূচিপত্র (`[Subject]/index.html`):**
   - উক্ত বিষয়ের সকল অধ্যায়ের কার্ড, সঠিক প্রশ্ন সংখ্যা ও পৃষ্ঠা রেঞ্জ সম্বলিত পৃথক সূচিপত্র তৈরি।
4. **Step 4: মাস্টার পোর্টাল (`index.html`) আপডেট:**
   - মূল লাইব্রেরি ড্যাশবোর্ডে নতুন বিষয়ের কার্ড, ক্যাটাগরি ফিল্টার এবং লাইভ সার্চে চ্যাপ্টারগুলো নিবন্ধন।
5. **Step 5: স্বয়ংক্রিয় অডিট ও নিশ্চয়তা:**
   - স্ক্রিপ্ট রান করে প্রতিটি ফাইলের প্রশ্ন সংখ্যা, পেপার ক্লাস, ফন্ট ক্লাস ও নেভিগেশন লিংক শতভাগ ভেরিফাই করা।

---

## 9. বারোটি বিষয়ের ড্রপডাউন ন্যাভিগেশন ও কুইজ অপশন সুরক্ষা নীতি (12-Subject Dropdown Navigation & Quiz Option Safeguards)

### ক. সার্বজনীন ড্রপডাউন স্ট্যান্ডার্ড:
- **আংশিক বাটন নিষিদ্ধ:** কোনো বিষয়ের পোর্টাল পেজে বা রিডিং ড্রয়ারে আংশিক বাটন ক্লাস্টার রাখা যাবে না।
- **১২টি বিষয়ের ড্রপডাউন সিলেক্টর:** সকল বিষয় পোর্টাল হেডার এবং চ্যাপ্টার রিডিং ড্রয়ারে `<div class="subject-dropdown-wrap"><select class="subject-nav-select">` ড্রপডাউন থাকতে হবে, যাতে ১২টি বিষয় এবং মাস্টার পোর্টাল সুনির্দিষ্ট ক্রমে অন্তর্ভুক্ত থাকবে।

### খ. কুইজ ইঞ্জিন ও সরাসরি উত্তর মোড সুরক্ষা:
- অপশন বাটনে `data-is-correct="true"`, `data-correct="true"`, বা `checkAnswer(this, 1)` নিশ্চিত করতে হবে।
- সরাসরি উত্তর মোড (`direct-answer`) ও তাত্ক্ষণিক উত্তর মোডে (`show-answers`) কোনো অবস্থাতেই প্রশ্ন ফাঁকা বা অপশনহীন থাকবে না। সঠিক উত্তরটি সবুজ বর্ডার ও `উত্তর: ` প্রিফিক্সসহ দৃশ্যমান থাকবে।

---

## 10. খাঁটি গাণিতিক টাইপোগ্রাফি, আনুভূমিক ভগ্নাংশ রেখা ও KaTeX ইঞ্জিন স্ট্যান্ডার্ড (Authentic Math Typography & KaTeX Standards)

### ক. অফলাইন KaTeX লাইব্রেরি ও পাথ রেজল্যুশন (Self-Hosted KaTeX & Paths):
- সকল অধ্যায়ে KaTeX লাইব্রেরি অফলাইনে রুটের `vendor/katex/` বা সাব-ডিরেক্টরির ক্ষেত্রে `../vendor/katex/` থেকে লোড হতে হবে (`katex.min.css`, `katex.min.js`, `contrib/auto-render.min.js`)।
- কোনো সিডিএন (CDN) নির্ভরতা রাখা যাবে না।

### খ. জিরো র' ল্যাটেক্স ও জিরো র' `\frac` নীতি (Zero Raw LaTeX & Zero Raw `\frac`):
- ব্রাউজারে শিক্ষার্থীর চোখে কাঁচা কোড যেমন `\frac`, `\sqrt`, `\theta`, `\alpha`, `\implies` বা আনরেন্ডারড `$$` / `$` টেক্সট হিসেবে কোনো অবস্থাতেই উন্মুক্ত থাকা কঠোরভাবে নিষিদ্ধ।
- বইয়ের মতোই প্রতিটি সূত্র, ভগ্নাংশ ও প্রতীক নিখুঁতভাবে রেন্ডার হয়ে খাঁটি গাণিতিক রূপে প্রদর্শিত হতে হবে।

### গ. আনুভূমিক ভগ্নাংশ রেখা নীতি ও স্লাশ বর্জন (Textbook Horizontal Fraction Line & No Slashes):
- প্রতিটি ভগ্নাংশের লব ও হরের মাঝে সুস্পষ্ট আনুভূমিক রেখা (Horizontal division line) বিদ্যমান থাকতে হবে।
- সাধারণ কীবোর্ড স্লাশ (`/`) দিয়ে ভগ্নাংশ লেখা সম্পূর্ণ নিষিদ্ধ (যেমন: `π/10`, `(sin θ + cos θ)/(sin θ - cos θ)`, `১/২`, `৫/৩` ইত্যাদির বদলে উল্লম্ব স্ট্যাকড ভগ্নাংশ `\frac{\pi}{10}`, `\frac{\sin\theta + \cos\theta}{\sin\theta - \cos\theta}`, `\frac{১}{২}` রেন্ডার করতে হবে)।
- KaTeX-এর `.katex .frac-line` সিএসএস রুল দিয়ে সুরক্ষিত থাকবে: `border-bottom-width: 0.09em !important; border-color: currentColor !important;`।

### ঘ. মাল্টি-ডেলিমিটার সমর্থন ও অটো-রেন্ডার কনফিগারেশন:
- চার প্রকার ডেলিমিটারই সমর্থন করতে হবে: `$$...$$` (display: true), `\[...\]` (display: true), `\(...\)` (display: false), `$...$` (display: false)।
- KaTeX কনফিগারেশনে `strict: false`, `throwOnError: false`, `trust: true` বাধ্যতামূলক।
- `universal-modes.js`-এ প্রাক-প্রক্রিয়াকরণ করে ভাঙা ডেলিমিটার মেরামত করতে হবে।

### ঙ. ম্যাথ মোডের ভেতরে এইচটিএমএল এনটিটি বর্জন (Zero HTML Entities inside Math Mode):
- গণিতের ফরমুলার ভেতর `&rArr;`, `&times;`, `&deg;`, `&ang;`, `&plusmn;`, `&minus;`, `&ndash;`, `&hellip;` ইত্যাদি থাকা নিষিদ্ধ; এদের যথাক্রমে `\implies`, `\times`, `^\circ`, `\angle`, `\pm`, `-`, `-`, `\dots` দিয়ে প্রতিস্থাপন করতে হবে।

### চ. পিওর এইচটিএমএল/সিএসএস আনুভূমিক ভগ্নাংশ ফলব্যাক (`.math-frac` Fallback):
- KaTeX ছাড়া সাধারণ টেক্সটে ভগ্নাংশ দেখাতে হলে `<span class="math-frac"><span class="num">লব</span><span class="den">হর</span></span>` কাঠামো ব্যবহার করতে হবে যাতে আনুভূমিক বিভাজন রেখা স্পষ্ট থাকে।

---

## 11. অপশন লেটার ও মুদ্রিত উত্তর বর্জন নীতি (Option Letter & Printed Answer Sanitization Policy)

### ক. অতিরিক্ত অক্ষরের ব্যাজ ও মুদ্রিত উত্তর নিষিদ্ধ:
- অপশন লেটার (যেমন: "সঠিক উত্তর: ক", "উত্তর: খ", "Answer: C", "(গ)") বা "মুদ্রিত উত্তর অমুক" ইত্যাদি ব্যাজ, টুলটিপ, টাইটেল বা ব্যাখ্যার ড্রয়ারের ভেতর অপ্রয়োজনীয় পুনরাবৃত্তি করা যাবে না।
- প্রশ্নব্যাংক শাফলিং বা অপশন রি-অর্ডারিংয়ের সময় অপশন লেটার বিভ্রান্তি সৃষ্টি করে।

### খ. প্রমিত সঠিক উত্তর ও পরিচ্ছন্ন ব্যাখ্যা:
- সঠিক উত্তরটি কুইজ ইন্টারফেসে সুস্পষ্ট সবুজ বর্ডার/ব্যাকগ্রাউন্ড এবং অ্যাক্সেসিবল টিকচিহ্ন (`✓`) দিয়ে স্বয়ংক্রিয়ভাবে চিহ্নিত হবে।
- বিশদ ব্যাখ্যার শিরোনাম সর্বদা একীভূত প্রমিত রূপে প্রদর্শিত হবে: `💡 বিশদ সমাধান ও বিশ্লেষণ:` এবং তার নিচে কোনো অপশন লেটারের পুনরাবৃত্তি ছাড়াই সরাসরি সমাধান ও বৈজ্ঞানিক/গাণিতিক ধাপসমূহ থাকবে।

---

## 12. ইন-ব্রাউজার লাইভ সিএমএস ও অ্যাডমিন এডিটর আর্কিটেকচার (In-Browser Live CMS & Admin Editor Standards)

### ক. মাস্টার পাসওয়ার্ড অথেন্টিকেশন:
- ইন-ব্রাউজার লাইভ এডিটর মোডটি মাস্টার পাসওয়ার্ড **`4991`** দ্বারা সুরক্ষিত থাকবে।
- সাধারণ পাঠকরা কোনো পাসওয়ার্ড ছাড়া অবাধে পড়তে পারবেন। অথেনটিকেশন সফল হলে অ্যাডমিন এডিটর মোড সক্রিয় হবে।

### খ. উপাদান সনাক্তকরণ ও ইনলাইন এডিটিং (`data-ebk-eid`):
- প্রতিটি প্রশ্নের মূল বাক্য, প্রতিটি অপশন, ব্যাখ্যা ড্রয়ার এবং প্রামাণ্য নোট উপাদানে পেজ লোড হওয়ার সময় একটি নির্দিষ্ট ও ইউনিক ডিটারমিনিস্টিক আইডি যুক্ত থাকবে (`data-ebk-eid="e_{idx}"`)।
- অ্যাডমিন সক্রিয় হলে প্রতিটি উপাদানের পাশে এডিট পেন্সিল বাটন (`.ebk-edit-trigger`) এবং অপশনের পাশে কারেক্ট-টগল বাটন (`.ebk-correct-toggle` `✓`) দৃশ্যমান হবে।

### গ. লাইভ KaTeX ম্যাথ প্রিভিউ ও স্টিকি সেভ ডক:
- এডিটর প্যানেলে টাইপ করার সাথে সাথে রিয়েল-টাইমে ফর্মুলা রেন্ডার করে দেখানোর জন্য লাইভ KaTeX প্রিভিউ কন্টেইনার বিদ্যমান থাকবে।
- যেকোনো এডিটের পর স্ক্রিনের নিচে ফ্লোটিং স্টিকি ডক (`#ebkSaveDock`) দৃশ্যমান হবে, যাতে লাইভ আনসেভড কাউন্টার ও সেভ বাটন থাকবে। পরিবর্তনসমূহ লোকালস্টোরেজ এবং গিটহাবে সেভ করা যাবে।

