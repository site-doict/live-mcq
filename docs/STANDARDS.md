# BCS Static E-Book Library - Engineering & UI Standards

> **Authoritative Single Source of Truth** for code style, UI rendering, math formatting, and data architecture across the `Live MCQ Bangla Literature` repository.

---

## 1. Math Data & KaTeX Delimiter Standards

### Delimiter Rules
* **Inline Math:** MUST use `\( ... \)`.
* **Display / Block Math:** MUST use `\[ ... \]`.
* **Prohibited Delimiters:** Never use single `$` or double `$$`. Single dollar signs cause severe collision with currency, variables, and markdown tables.
* **Asset Hosting:** KaTeX must remain locally self-hosted under `/vendor/katex/` (CSS, JS, auto-render, and font files). Never load KaTeX from external CDNs.

### Dynamic Rendering & DOM Protection
* **Debounced MutationObserver:** Dynamic content updates (e.g. search mounts, exam question loading, mode changes) must use debounced MutationObservers (minimum 50ms) to prevent infinite DOM loops.
* **Math Guard Attribute:** Elements undergoing math formatting must carry `data-math-raw` during preparation and remove it cleanly once KaTeX has rendered into `.katex`.
* **Delocalized Fractions & LaTeX Braces:** Never use malformed fraction arguments (e.g. `\frac{-34}` instead of `\frac{-3}{4}`). Braces in sets and exponents must be properly escaped in JSON strings (e.g. `\{p,q\}`).

---

## 2. Answer Presentation Standards

### Visual Highlighting
* **Green-Only Indication:** Correct answers MUST be indicated exclusively by a green border (`#10b981`) and subtle background tint (`rgba(16, 185, 129, 0.12)` or `var(--correct-bg)`).
* **Single CSS Source:** All answer state styling must be centralized in `universal-modes.css`.

### Strict Prohibitions
* **No "উত্তর:" Prefix:** Pseudo-elements (`::before`, `::after`) and direct labels must NOT inject "উত্তর:", "Ans:", or "সঠিক উত্তর:".
* **No Letter Badges:** When highlighting the correct answer (in Direct Answer or Show Answers modes), option letters (ক, খ, গ, ঘ or A, B, C, D) and `.opt-lbl` badges MUST be hidden (`display: none`).
* **No Tick Marks:** Do NOT append or prepend checkmarks (`✓`, `✔`) to option text or buttons.

---

## 3. CMS & Content Editing Persistence Standards

### Data-Patches Architecture
* **Clean Patch Commits:** CMS in-browser edits (typo fixes, answer corrections, explanation updates) MUST be persisted via granular JSON patches in `data-patches/<page-identifier>.json`.
* **Prohibited Whole-Document Commits:** Never serialize and commit `document.documentElement.outerHTML` or overwrite entire HTML pages via GitHub API.
* **Sticky Save Dock:** The editing toolbar `#ebkSaveDock` must stick to the bottom of the viewport with a clear, non-blocking layout.
* **Transparent Auth Feedback:** When GitHub Personal Access Token (`ebk_admin_pat`) is not configured, the UI must display a clear, honest toast notification rather than silently failing.

---

## 4. Mobile Viewport & Accessibility Standards

### Viewport Compliance
* **Zero Horizontal Scroll:** Pages MUST NOT exhibit horizontal scroll (`document.documentElement.scrollWidth <= viewportWidth`) across mobile viewports: 320px, 360px, 390px, and 412px.
* **Touch Targets:** Interactive controls (buttons, links, toggle switches) must meet minimum touch target dimensions of 44×44px on mobile devices.
* **Header Optimization:** The Admin Login button on sticky topbars must collapse to an icon-only button on viewports `<= 480px`, remaining fully within the visible screen bounds.

### Typography Protection
* **Bengali Content:** All questions, options, badges, and explanations must strictly use `'Noto Serif Bengali', 'Kalpurush', Georgia, serif`.
* **English Text:** English terms and acronyms must use `'Inter', sans-serif !important`.

---

## 5. Index & Navigation Integrity Standards

### Link Paths & Metadata
* **Decoded UTF-8 Links:** All relative `href` links in chapter cards must be decoded UTF-8 strings matching exact filenames on disk (never leave percent-encoded paths like `%E0%A6%...`).
* **Card Metadata:** Every chapter card in an index file MUST include a `.chapter-meta` container displaying the question count (`...টি প্রশ্ন`) and original book page range (`পৃষ্ঠা ...`).
* **Hero Badges:** The top hero badge question count must equal the exact sum of questions across all chapter files in that subject.

---

## 6. Static & End-to-End Verification Gate

Every pull request and local commit must pass:
1. `python tools/check-all.py` (Zero errors across Math, Answers, and Index Links).
2. `node tests/e2e.test.js` (Zero failures across all 4 gates and 12 viewport assertions).
