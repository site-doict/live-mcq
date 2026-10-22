---
name: pdf-to-html-ebook
description: Transforms PDF chapter pages or scanned book images of competitive exam books into interactive, mobile-optimized, single-file HTML e-book chapters following verified project standards.
---

# PDF to Interactive Smart E-Book Generator Skill

Use this skill whenever the user provides a folder or set of PDF files / book page images and asks to generate interactive HTML chapters for the BCS Live MCQ e-book library.

## Operational Workflow

When given a PDF folder or PDF file:

### Step 0: Pre-Flight Rules Verification & Core Mission (বাধ্যতামূলক প্রাক-চেক)
Before executing any generation or editing, you MUST verify against `GEMINI.md`:
1. **World-Class Vision:** Transform authentic book PDFs into a world-class, premium, and high-quality interactive smart e-book with elegant presentation, responsive tables, and interactive quiz mechanics.
2. **Zero Fabrication:** Never add synthetic theoretical summaries, artificial timelines, or fictitious exam tags.
3. **Missing Data Restoration:** Compare files with the authentic PDF. If any question, option, table, footnote, or explanation is present in the PDF but missing in the HTML, faithfully extract and add it.
4. **Authentic Source Only:** If the chapter is a question bank (e.g., Live MCQ), include only the authentic "বিসিএস প্রশ্ন বিশ্লেষণ ছক", questions, and explanations. Do NOT invent standalone theory cards before questions.
5. **No Literal Translations:** Never translate acronyms or organizations word-for-word (e.g. MIGA, IFC, IDA). Use standard exam transliterations.
6. **Authentic Source Repositories:**
   - **বাংলা সাহিত্য:** `C:\Users\PC User\Downloads\Live MCQ\3. বাংলা_সাহিত্য_.pdf`
   - **বাংলাদেশ বিষয়াবলি:** `C:\Users\PC User\Downloads\Live MCQ\6. বাংলাদেশ_বিষয়াবলি_.pdf`
   - **আন্তর্জাতিক বিষয়াবলি:** `C:\Users\PC User\Downloads\Live MCQ\7. আন্তর্জাতিক_বিষয়াবলি_.pdf`
   - **বাংলা ভাষা ও ব্যাকরণ:** `C:\Users\PC User\Documents\Live MCQ Banlga Language\`
7. **Sketchnote Visual Notes (ঐচ্ছিক ও প্রসঙ্গনির্ভর):** অধ্যায়ের বিষয়বস্তুতে সূত্র, গুরুত্বপূর্ণ তুলনা, প্রক্রিয়া বা মনে রাখার মতো তথ্য থাকলেই কেবল মিতব্যয়ীভাবে ব্যবহারযোগ্য। মূল বইয়ের তথ্য শতভাগ অক্ষত রেখে উপস্থাপনা করতে হবে, নিজে থেকে কোনো মনগড়া তথ্য/তত্ত্ব যোগ সম্পূর্ণ নিষিদ্ধ।

### Step 1: Source Discovery, Page Counting & Planning
1. Inspect the source PDF for the target subject and identify the page range of the chapter.
2. For each chapter:
   - Extract the chapter title, starting and ending page numbers.
   - Physically count the EXACT number of distinct MCQs on the pages (from Question 1 to end).
   - **Warning on Analysis Matrix:** Do NOT sum numbers from the "বিসিএস প্রশ্ন বিশ্লেষণ ছক" to determine question counts; multiple BCS tags on a single question cause inflated counts. Physically count the distinct questions.
   - Synchronize the exact count with `index.html` badges.

### Step 2: Content Structuring (Zero Data Loss & Zero Fabrication)
- Capture 100% of the book's genuine facts, dates, definitions, names, and footnotes.
- Never invent external facts or imaginary exam sessions.
- In chapters with theoretical texts: structure raw paragraphs into clean `.table-responsive` tables and concise key-points.
- In question-bank chapters: transition directly from the BCS question analysis table to the interactive MCQ `.q-card` engine.

### Step 3: Two-Column Layout & Sequential MCQ Parsing
- BCS guide books are formatted in two columns:
  - Parse **Left Column** top-to-bottom, then **Right Column** top-to-bottom.
  - Never leap between columns or pages.
  - Option arrangement: Option 'ক' (top-left), 'গ' (bottom-left), 'খ' (top-right), 'ঘ' (bottom-right).
  - In linear text streams: 1st line = ক, 2nd line = গ, 3rd line = খ, 4th line = ঘ.
  - Confirm the option against the explanation text before setting the correct answer.

### Step 4: Mandatory Protocol for Damaged/Ambiguous Questions (অনলাইন সার্চ প্রটোকল)
If any question, option, or answer is illegible, torn, corrupted by OCR, or ambiguous:
1. **Do NOT guess or fabricate:** Never invent a question, options, or facts.
2. **Analyze the Explanation:** Carefully read the explanation provided below the question in the book to understand the topic and context.
3. **Identify the Exam Session:** Note the specific BCS session or exam year/name (e.g., ২৪তম বিসিএস, ৩৫তম বিসিএস, প্রাথমিক সহকারী শিক্ষক নিয়োগ, ইত্যাদি).
4. **Search Online:** Execute a web search (`search_web`) using the topic and exam tag to locate authentic question banks (e.g., Uttoron Academy, Live MCQ, Job Solution, PSC archive).
5. **Add Verified Question:** Insert the authentic question, options, and verified answer verbatim.

### Step 5: Strict Cleanup Checklist (Do NOT Include)
- ❌ Do NOT create a separate "বইয়ের অসঙ্গতি ও যাচাই তালিকা" (Error Audit Table). Put any verified fact corrections directly inside the content in a clean "সন্দেহ নিরসন ও সঠিক তথ্য" box.
- ❌ Do NOT generate syllabus/index page-number verification quizzes.
- ❌ Do NOT add Wikipedia citations like `[১]`, `[২]`, or artificial source links.
- ❌ Do NOT add `single-file interactive bcs` or boilerplate footer lines.
- ❌ Do NOT leave temporary/scratch files in the workspace.

### Step 6: Design & Mobile-First Typography
- Font: `'Noto Serif Bengali', serif, system-ui, sans-serif` with rem units for all sizes.
- Colors: Subject-tailored theme variables with dark mode support.
- Mobile Safeguards: `overflow-x: clip`, `.table-responsive` around all tables.
- SVG Rule: NEVER put multi-line sentences inside SVG. Use semantic HTML+CSS for flowcharts, timelines, and cards.

### Step 6.1: Sketchnote Visual Notes Toolkit (Hand-drawn Callouts)
- **উদ্দেশ্য:** ঐচ্ছিক ও প্রসঙ্গনির্ভর ডিজাইন স্তর। যে অধ্যায়ের বিষয়বস্তুতে সূত্র, তুলনা, প্রক্রিয়া, তালিকা বা মনে রাখার মতো পয়েন্ট রয়েছে সেখানে মিতব্যয়ীভাবে ব্যবহারের জন্য।
- **কঠোর নিয়ম (Zero Fabrication):**
  - শুধু অধ্যায়ের বিদ্যমান তথ্যই ব্যবহার করা যাবে। কোনো নতুন তথ্য, তত্ত্ব, সাল বা উদাহরণ বানানো যাবে না।
  - কোনো প্রশ্ন, অপশন, উত্তর, ব্যাখ্যা বা বিসিএস প্রশ্ন ছক প্রতিস্থাপন করা যাবে না; এটি সম্পূর্ণ অতিরিক্ত (additive) ভিজ্যুয়াল স্তর।
- **কম্পোনেন্ট লাইব্রেরি (`sketchnote.css`, সব ক্লাস `sk-` প্রিফিক্সে):**
  1. **পেজ র‍্যাপার:** `.sk-page` (রুলড পেপার), `.sk-page--grid` (গ্রিড পেপার), `.sk-page--spiral` (স্পাইরাল কয়েল মার্জিন), `.sk-theme-parchment` (পুরোনো পার্চমেন্ট পেপার ও নেভি-সোনালি থিম)।
  2. **হ্যান্ড-ড্রন বক্স:** `.sk-box` (অসম বর্ডার রেডিয়াস, পেন্সিল স্ট্রোক); ভ্যারিয়েন্ট: `--blue`, `--green`, `--orange`, `--purple`, `--red`, `--dashed`।
  3. **শিরোনাম ও সেকশন হেড:** `.sk-title` (ডাবল আন্ডারলাইন), `.sk-section-head` (পেন্সিল আইকন ও দুই পাশে রঙিন লাইন), `.sk-numbered` (রঙিন সংখ্যা ব্যাজ)।
  4. **স্টিকি নোট:** `.sk-sticky--yellow`, `.sk-sticky--blue` (ঘোরানো কোণ, নরম শ্যাডো), উপরে `.sk-pin` পুশপিন বা সেলোটেপ।
  5. **হাইলাইটার ও রঙ:** `<mark class="sk-mark sk-mark--yellow|pink|green|blue">`, `.sk-underline`, কালার ক্লাস: `.sk-c-blue`, `.sk-c-green`, `.sk-c-orange`, `.sk-c-purple`, `.sk-c-red`।
  6. **চেকলিস্ট ও তীর-তালিকা:** `.sk-checklist` (হাতে আঁকা অসম চারকোনা বক্স + টিক), `.sk-arrow-list` (রঙিন তীর বুলেট)।
  7. **টেবিল:** `.sk-table` (মার্কার হেডার, ড্যাশড লাইন), `.sk-table--long` (রিভিশন ছক), `.sk-compare` (তুলনামূলক ছক) — অবশ্যই `.table-responsive` র‍্যাপারে।
  8. **সূত্র ও সমীকরণ:** `.sk-formula` (বড় নীল বক্স), `.sk-equation` (A + B = C), `.sk-defbox` (ড্যাশড লেজেন্ড), `.sk-pill` (ক্যাপসুল ভ্যালু ব্যাজ)।
  9. **কি-পয়েন্ট ও মনে রাখুন:** `.sk-keypoint`, `.sk-keystrip` (বাল্ব আইকন + ৩টি টিক পয়েন্ট), `.sk-remember` (হলুদ ব্যাকগ্রাউন্ড, তারা/হৃদয় ডুডল), `.sk-conclusion` (সারসংক্ষেপ)।
  10. **ফ্লো:** `.sk-flow` + `.sk-flow__step` + `.sk-arrow`, `.sk-flow--chips` (মোবাইলে স্বয়ংক্রিয়ভাবে উল্লম্ব রূপান্তর)।
  11. **ডুডল ও ব্যাজ:** `.sk-star`, `.sk-pin`, `.sk-badge`, `.sk-def-card`।
- **প্রযুক্তিগত বৈশিষ্ট্য:**
  - Pure HTML + Pure CSS (কোনো জাভাস্ক্রিপ্ট নেই)।
  - CSS ভেরিয়েবল ও ডার্ক মোড সাপোর্ট (`--sk-paper`, `--sk-ink`, `--sk-line`, `--sk-blue` ইত্যাদি)।
  - ফন্ট শুধুমাত্র `.sk-*` ব্লকের অভ্যন্তরে প্রযোজ্য (`--sk-font-bn`, `--sk-font-en`)।

### Step 7: Navigation Script Integration
Always add the following line immediately before `</body>`:
```html
<script src="nav-component.js"></script>
```
This automatically provides:
- Topbar (`.ebk-topbar`) with `[ ☰ সূচিপত্র ]` and `[ 🏠 হোম ]` (linking to `index.html`)
- Reading progress bar
- Slide-out drawer with search & reading checkboxes
- A- / A+ font scale engine
- Previous / Next chapter links

### Step 8: Saving & Verification
- Save the file directly as a single-file `.html` in the subject folder with a descriptive Bengali name.
- Verify that the HTML parses cleanly and that the interactive MCQ counter, option selection feedback, and explanation drawer work properly.

