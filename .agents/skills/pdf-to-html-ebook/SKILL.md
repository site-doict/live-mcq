---
name: pdf-to-html-ebook
description: Transforms PDF chapter pages or scanned book images of competitive exam books into interactive, mobile-optimized, single-file HTML e-book chapters following verified project standards.
---

# PDF to Interactive Smart E-Book Generator Skill

Use this skill whenever the user provides a folder or set of PDF files / book page images and asks to generate interactive HTML chapters for the BCS Live MCQ e-book library.

## Operational Workflow

When given a PDF folder or PDF file:

### Step 1: Source Discovery & Planning
1. Inspect the folder and list all PDFs or images.
2. For each chapter/PDF:
   - Extract the chapter title, starting and ending page numbers.
   - Scan all theoretical sections, key figures, dates, and tables.
   - Count the exact number of MCQs present (from question 1 to end).
   - Write the `<!-- DESIGN PLAN: ... -->` block at the top of the HTML file.

### Step 2: Content Structuring (Zero Data Loss)
- Capture 100% of the book's facts, dates, definitions, names, and footnotes.
- Structure raw paragraphs into visually engaging components:
  - `.summary-grid` / `.key-cards`: High-yield facts.
  - `.table-responsive`: Comparative tables.
  - `.mnemonic-box`: Memory tricks (`💡 সহজ স্মৃতিকৌশল: ...`).
  - `.fact-check-box`: PSC/board-verified disambiguations (`💡 সন্দেহ নিরসন ও সঠিক তথ্য: ...`).

### Step 3: Two-Column Layout & Sequential MCQ Parsing
- BCS guide books are formatted in two columns:
  - Parse **Left Column** top-to-bottom, then **Right Column** top-to-bottom.
  - Never leap between columns or pages.
  - Option arrangement: Option 'ক' (top-left), 'গ' (bottom-left), 'খ' (top-right), 'ঘ' (bottom-right).
  - In linear text streams: 1st line = ক, 2nd line = গ, 3rd line = খ, 4th line = ঘ.
  - Confirm the option against the explanation text before setting the correct answer.
  - Ensure question numbering matches the exact count from 1 to N without missing any questions.

### Step 4: Strict Cleanup Checklist (Do NOT Include)
- ❌ Do NOT create a separate "বইয়ের অসঙ্গতি ও যাচাই তালিকা" (Error Audit Table). Put any verified fact corrections directly inside the content in a clean "সন্দেহ নিরসন ও সঠিক তথ্য" box.
- ❌ Do NOT generate syllabus/index page-number verification quizzes.
- ❌ Do NOT add Wikipedia citations like `[১]`, `[২]`, or artificial source links.
- ❌ Do NOT add `single-file interactive bcs` or boilerplate footer lines.
- ❌ Do NOT leave temporary/scratch files in the workspace.

### Step 5: Design & Mobile-First Typography
- Font: `'Noto Serif Bengali', serif, system-ui, sans-serif` with rem units for all sizes.
- Colors: Subject-tailored theme variables with dark mode support.
- Mobile Safeguards: `overflow-x: clip`, `.table-responsive` around all tables.
- SVG Rule: NEVER put multi-line sentences inside SVG. Use semantic HTML+CSS for flowcharts, timelines, and cards.

### Step 6: Navigation Script Integration
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

### Step 7: Saving & Verification
- Save the file directly as a single-file `.html` in the subject folder with a descriptive Bengali name.
- Verify that the HTML parses cleanly and that the interactive MCQ counter and answer-reveal scripts work properly.
