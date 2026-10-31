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
1. `python tools/check-all.py` (Zero errors across Math, Answers, Index Links, and Portal Step Architecture).
2. `node tests/gate_portal.test.js` (Zero failures across all 5 gates G1–G5 and 30 assertion checks).
3. `node tests/e2e.test.js` (Zero failures across all 4 gates and 12 viewport assertions).

---

## 6.3 পোর্টাল ও মাস্টার ইনডেক্স আর্কিটেকচার (Portal & Master Index Architecture)

### ১. ৩টি পরীক্ষার ধাপ নীতি (3 Examination Stages)
* **তিনটি ধাপ:** প্রিলিমিনারি (Preliminary), লিখিত (Written), এবং ভাইভা/মৌখিক (Viva)।
* **দ্বি-ট্র্যাক কাঠামো:** বিসিএস (ক্যাডার) ও পিএসসি নন-ক্যাডার — উভয় ট্র্যাকেই একই ৩-ধাপের কাঠামো কার্যকর থাকবে।
* **প্যানেল আইডি মানদণ্ড:**
  - ক্যাডার: `#panelCadrePrelim`, `#panelCadreWritten`, `#panelCadreViva`
  - নন-ক্যাডার: `#panelNonCadrePrelim`, `#panelNonCadreWritten`, `#panelNonCadreViva`
* **ইউআরএল হ্যাশ ও স্টেট পারসিস্টেন্স:** সরাসরি হ্যাশ লিঙ্ক সমর্থন (`#cadre-prelim`, `#cadre-written`, `#cadre-viva`, `#noncadre-prelim`, `#noncadre-written`, `#noncadre-viva`) এবং রিফ্রেশে ব্রাউজার লোকালস্টোরেজ (`selected_book`, `ebk_selected_step`) থেকে পূর্বাবস্থায় ফেরা।

### ২. টাইপোগ্রাফি ও ফন্ট বিভাজন নীতি (Dual Typography Standard)
* **পোর্টাল ল্যান্ডিং ও ইউআই উপাদান:** পোর্টাল নেভবার, হিরো ব্যানার, স্টেপার কার্ড, সিলেবাস বার, ফিচার গ্রিড এবং ফুটারসহ সমস্ত ইউআই ফন্টে বাধ্যতামূলকভাবে `'Noto Sans Bengali', 'Inter', sans-serif` প্রয়োগ করতে হবে (কমপ্যাক্ট মেট্রিক্স, হাই-ডিপিআই শার্পনেস)।
* **চ্যাপ্টার কনটেন্ট, প্রশ্নব্যাংক ও ব্যাখ্যা:** সকল চ্যাপ্টার পৃষ্ঠার প্রশ্ন, বহুনির্বাচনি অপশন, উত্তর ড্রয়ার ও প্রামাণ্য ব্যাখ্যায় বাধ্যতামূলকভাবে `'Noto Serif Bengali', 'Kalpurush', Georgia, serif` বজায় রাখতে হবে।
* **ইংরেজি হরফ প্রোটেকশন:** ইংরেজি শিরোনাম ও অ্যাক্রোনিমে `'Inter', sans-serif !important` প্রযোজ্য।

### ৩. ডিজাইন টোকেন ও লেআউট নিয়ম (Design Tokens & Layout)
* **নেভবার:** স্টিকি লাইট/ডার্ক ব্যাকগ্রাউন্ড (`rgba(255, 255, 255, 0.92)` / `rgba(17, 24, 48, 0.92)`), `backdrop-filter: blur(12px)`, ১px বর্ডার।
* **হিরো ব্যাকগ্রাউন্ড:** গাঢ় নেভি ব্লু গ্র্যাডিয়েন্ট ও নরম ব্লু রেডিয়াল গ্লো (`#0b1226` থেকে `#111a3b`), H1-এ টেক্সট গ্র্যাডিয়েন্ট (`#60a5fa` থেকে `#38bdf8`)।
* **কার্ড ও বাটন রেডিয়াস:** কার্ডে বাধ্যতামূলক ১৬px রেডিয়াস (`--portal-radius: 16px`), বাটন ও চিপে পিল শেপ (`--portal-radius-pill: 9999px`)।
* **জিরো ইনলাইন স্টাইল নীতি:** `index.html`-এ কোনো হার্ডকোডেড ইনলাইন `style` অ্যাট্রিবিউট ব্যবহার করা সম্পূর্ণ নিষিদ্ধ (শুধুমাত্র প্রগ্রেস বারের ডায়নামিক ভ্যারিয়েবল `style="--p: ...%"` অনুমোদিত)।

### ৪. ডায়নামিক হিসাব নীতি (Dynamic Stat Calculation)
* **স্বয়ংক্রিয় লাইভ গণনা:** মোট বিষয়, মোট পরিচ্ছেদ ও মোট আসল প্রশ্ন সংখ্যা কখনোই হার্ডকোড করে স্ট্যাটিক টেক্সট হিসেবে বসানো যাবে না।
* **কার্ড অ্যাট্রিবিউট ডাটা সোর্স:** প্রতিটি সাবজেক্ট কার্ডের `data-chapters` এবং `data-questions` অ্যাট্রিবিউট থেকে জাভাস্ক্রিপ্ট রানটাইমে মোট সংখ্যা গণনা করে বাংলা সংখ্যায় রূপান্তর (`toBengaliDigits()`) করে হিরো স্ট্যাটাস কার্ডে রেন্ডার করতে হবে।

### ৫. জিরো এক্সটারনাল ফেব্রিকেশন নীতি (Zero External Fabrication)
* **প্রামাণ্য তথ্যসূত্র:** বিসিএস ও পিএসসি নিয়োগ পরীক্ষার নম্বর বণ্টন, সময়কাল ও নেগেটিভ মার্কিং অবশ্যই বিপিএসসি সরকারি গেজেট ও নিয়োগ বিধিমালা অনুযায়ী হতে হবে (বিসিএস প্রিলি ২০০ নম্বর/২ ঘণ্টা/-০.৫০ কর্তন; লিখিত সাধারণ ক্যাডার ৯০০ নম্বর/পাস ৫০%; ভাইভা ২০০ নম্বর/পাস ৫০%; নন-ক্যাডার প্রিলি ১০০ নম্বর/১ ঘণ্টা; লিখিত ২০০ নম্বর/৪ ঘণ্টা; ভাইভা ৫০ নম্বর)।
* **অনুপস্থিত বিষয়ের সুরক্ষা:** যে ধাপ বা বিষয়ের ফাইল এখনো প্রজেক্টে সংকলিত হয়নি, সেখানে কখনোই ভুয়া বা কাল্পনিক লিংক দেওয়া যাবে না। সেগুলোতে `aria-disabled="true"`, নিষ্ক্রিয় বাটন এবং "শীঘ্রই আসছে ⏳" ব্যাজ রাখতে হবে (কোনো ডেড লিংক বা 404 নয়)।
