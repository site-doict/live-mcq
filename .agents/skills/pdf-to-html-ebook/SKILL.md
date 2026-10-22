---
name: pdf-to-html-ebook
description: Transforms PDF chapter pages or scanned book images of competitive exam books into interactive, mobile-optimized, single-file HTML e-book chapters following verified project standards.
---

# PDF to Interactive Smart E-Book Generator Skill

Use this skill whenever the user provides a folder or set of PDF files / book page images and asks to generate interactive HTML chapters for the BCS Live MCQ e-book library.

## Operational Workflow

When given a PDF folder or PDF file:

### Step 0: Pre-Flight Rules Verification (বাধ্যতামূলক প্রাক-চেক)
Before executing any generation or editing, you MUST verify against `GEMINI.md`:
1. **Zero Fabrication:** Never add synthetic theoretical summaries, artificial timelines, or fictitious exam tags.
2. **Authentic Source Only:** If the chapter is a question bank (e.g., Live MCQ), include only the authentic "বিসিএস প্রশ্ন বিশ্লেষণ ছক", questions, and explanations. Do NOT invent standalone theory cards before questions.
3. **No Literal Translations:** Never translate acronyms or organizations word-for-word (e.g. MIGA, IFC, IDA). Use standard exam transliterations.

### Step 1: Source Discovery, Page Counting & Planning
1. Inspect the folder and map each PDF/image to its chapter.
2. For each chapter/PDF:
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

