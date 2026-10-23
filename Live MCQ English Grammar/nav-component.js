/**
 * ইংরেজি ভাষা ও ব্যাকরণ (English Grammar) বিসিএস পূর্ণাঙ্গ প্রস্তুতি - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
 * Smart E-Book Navigation Component for Mobile & Desktop
 * Specialized for mobile viewing (Samsung Galaxy A23, Android, iOS & Desktop)
 * 
 * Features:
 * - Dynamic Fast Font Loading with display=swap (Instant text rendering)
 * - Top Reading Progress Bar (Slim gradient indicator)
 * - Auto-Hiding Topbar on mobile scroll down, instant reveal on scroll up
 * - Safe-area Inset support for notches and gesture navigation bars
 * - Full-height Slide-in Drawer with live search & Chapter trees
 * - Font Size Controls (A- / A+ / Reset) for reading comfort
 * - Mobile Table & Layout safeguards (No horizontal page wobble)
 * - Touch-optimized buttons (touch-action: manipulation)
 * - LocalStorage sync for reading completion checkmarks
 */

(function () {
  'use strict';

  // 1. Ensure Noto Serif Bengali with display=swap is loaded
  function ensureFontsLoaded() {
    if (!document.querySelector('link[href*="Noto+Serif+Bengali"]')) {
      const p1 = document.createElement('link');
      p1.rel = 'preconnect';
      p1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(p1);

      const p2 = document.createElement('link');
      p2.rel = 'preconnect';
      p2.href = 'https://fonts.gstatic.com';
      p2.crossOrigin = 'anonymous';
      document.head.appendChild(p2);

      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap';
      document.head.appendChild(fontLink);
    }
  }
  ensureFontsLoaded();

  // 2. Data Definition: 9 Sections, 29 Topics (পৃষ্ঠা ২০৩–৩৪৪)
  const BOOK_CHAPTERS = [
    {
      id: "ch-1",
      number: "১",
      title: "Noun, Pronoun, Number and Gender",
      pages: "পৃষ্ঠা ২০৩–২০৯",
      badgeColor: "#4338ca",
      topics: [
        { id: "t-1-1", title: "Noun and Pronoun", pages: "পৃষ্ঠা ২০৩–২০৫", file: "Noun and Pronoun.html" },
        { id: "t-1-2", title: "Number and Gender", pages: "পৃষ্ঠা ২০৬–২০৯", file: "Number and Gender.html" }
      ]
    },
    {
      id: "ch-2",
      number: "২",
      title: "Verb",
      pages: "পৃষ্ঠা ২১০–২৩০",
      badgeColor: "#2563eb",
      topics: [
        { id: "t-2-1", title: "Classification of Verb, Gerund, Participle and Infinitive", pages: "পৃষ্ঠা ২১০–২১৬", file: "Classification of Verb, Gerund, Participle and Infinitive.html" },
        { id: "t-2-2", title: "Right form of Verbs", pages: "পৃষ্ঠা ২১৬–২২১", file: "Right form of Verbs.html" },
        { id: "t-2-3", title: "Tense", pages: "পৃষ্ঠা ২২২–২২৩", file: "Tense.html" },
        { id: "t-2-4", title: "Subject-Verb Agreement", pages: "পৃষ্ঠা ২২৪–২২৭", file: "Subject-Verb Agreement.html" },
        { id: "t-2-5", title: "Adjective and Adverb", pages: "পৃষ্ঠা ২২৮–২৩০", file: "Adjective and Adverb.html" }
      ]
    },
    {
      id: "ch-3",
      number: "৩",
      title: "Preposition and Conjunction",
      pages: "পৃষ্ঠা ২৩১–২৪৯",
      badgeColor: "#0d9488",
      topics: [
        { id: "t-3-1", title: "Appropriate Preposition", pages: "পৃষ্ঠা ২৩১–২৪০", file: "Appropriate Preposition.html" },
        { id: "t-3-2", title: "Conjunction", pages: "পৃষ্ঠা ২৪১–২৪২", file: "Conjunction.html" },
        { id: "t-3-3", title: "Article and Determiners", pages: "পৃষ্ঠা ২৪২–২৪৪", file: "Article and Determiners.html" },
        { id: "t-3-4", title: "Same Word used and Different Parts of Speech", pages: "পৃষ্ঠা ২৪৫–২৪৮", file: "Same Word used and Different Parts of Speech.html" },
        { id: "t-3-5", title: "Interchange of Parts of Speech", pages: "পৃষ্ঠা ২৪৮–২৪৯", file: "Interchange of Parts of Speech.html" }
      ]
    },
    {
      id: "ch-4",
      number: "৪",
      title: "Sentence",
      pages: "পৃষ্ঠা ২৫০–২৫৬",
      badgeColor: "#0284c7",
      topics: [
        { id: "t-4-1", title: "Type of Sentence", pages: "পৃষ্ঠা ২৫০–২৫৩", file: "Type of Sentence.html" },
        { id: "t-4-2", title: "Clause", pages: "পৃষ্ঠা ২৫৪–২৫৬", file: "Clause.html" }
      ]
    },
    {
      id: "ch-5",
      number: "৫",
      title: "Sentence Transformation",
      pages: "পৃষ্ঠা ২৫৭–২৬৬",
      badgeColor: "#7c3aed",
      topics: [
        { id: "t-5-1", title: "Voice", pages: "পৃষ্ঠা ২৫৭–২৬২", file: "Voice.html" },
        { id: "t-5-2", title: "Degree", pages: "পৃষ্ঠা ২৬২–২৬৩", file: "Degree.html" },
        { id: "t-5-3", title: "Narration", pages: "পৃষ্ঠা ২৬৪–২৬৬", file: "Narration.html" },
        { id: "t-5-4", title: "Translation", pages: "পৃষ্ঠা ২৬৬", file: "Translation.html" }
      ]
    },
    {
      id: "ch-6",
      number: "৬",
      title: "Sentence Correction and Fill in the blanks",
      pages: "পৃষ্ঠা ২৬৭–২৮২",
      badgeColor: "#b45309",
      topics: [
        { id: "t-6-1", title: "Sentence Correction", pages: "পৃষ্ঠা ২৬৭–২৭২", file: "Sentence Correction.html" },
        { id: "t-6-2", title: "Fill in the blanks", pages: "পৃষ্ঠা ২৭৩–২৭৯", file: "Fill in the blanks.html" },
        { id: "t-6-3", title: "Conditionals", pages: "পৃষ্ঠা ২৮০–২৮২", file: "Conditionals.html" }
      ]
    },
    {
      id: "ch-7",
      number: "৭",
      title: "Vocabulary",
      pages: "পৃষ্ঠা ২৮২–৩৩৪",
      badgeColor: "#be185d",
      topics: [
        { id: "t-7-1", title: "Word Meaning and Spelling", pages: "পৃষ্ঠা ২৮২–৩০৩", file: "Word Meaning and Spelling.html" },
        { id: "t-7-2", title: "Synonym and Antonym", pages: "পৃষ্ঠা ৩০৪–৩১৩", file: "Synonym and Antonym.html" },
        { id: "t-7-3", title: "One Word Substitution", pages: "পৃষ্ঠা ৩১৩–৩১৫", file: "One Word Substitution.html" },
        { id: "t-7-4", title: "Idioms and Phrases", pages: "পৃষ্ঠা ৩১৫–৩৩১", file: "Idioms and Phrases.html" },
        { id: "t-7-5", title: "Proverbs", pages: "পৃষ্ঠা ৩৩১–৩৩২", file: "Proverbs.html" },
        { id: "t-7-6", title: "Classification of Phrases", pages: "পৃষ্ঠা ৩৩২–৩৩৪", file: "Classification of Phrases.html" }
      ]
    },
    {
      id: "ch-8",
      number: "৮",
      title: "Composition",
      pages: "পৃষ্ঠা ৩৩৪–৩৩৬",
      badgeColor: "#059669",
      topics: [
        { id: "t-8-1", title: "Letters, Applications, Paragraph Related and Others", pages: "পৃষ্ঠা ৩৩৪–৩৩৬", file: "Letters, Applications, Paragraph Related and Others.html" }
      ]
    },
    {
      id: "ch-9",
      number: "৯",
      title: "Miscellaneous",
      pages: "পৃষ্ঠা ৩৩৭–৩৪৪",
      badgeColor: "#64748b",
      topics: [
        { id: "t-9-1", title: "Miscellaneous", pages: "পৃষ্ঠা ৩৩৭–৩৪৪", file: "Miscellaneous.html" }
      ]
    }
  ];

  // Helper: Flatten unique reading sequence of files
  const READING_FILES = [];
  const seenFiles = new Set();
  BOOK_CHAPTERS.forEach(ch => {
    ch.topics.forEach(t => {
      if (!seenFiles.has(t.file)) {
        seenFiles.add(t.file);
        READING_FILES.push({
          file: t.file,
          title: t.title,
          pages: t.pages,
          chapterTitle: ch.title,
          chapterNumber: ch.number,
          topicId: t.id
        });
      }
    });
  });

  // Current file determination
  function getCurrentFileName() {
    try {
      const pathParts = window.location.pathname.split('/');
      let name = pathParts.pop() || pathParts.pop();
      if (!name) return "";
      return decodeURIComponent(name);
    } catch (e) {
      return "";
    }
  }

  const currentFileName = getCurrentFileName();
  const currentIndex = READING_FILES.findIndex(item => item.file === currentFileName);
  const currentItem = currentIndex >= 0 ? READING_FILES[currentIndex] : null;

  const prevItem = currentIndex > 0 ? READING_FILES[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < READING_FILES.length - 1 ? READING_FILES[currentIndex + 1] : null;

  // Bengali Number Converter
  const toBn = n => String(n).replace(/[0-9]/g, d => "০১২৩৪৫৬৭৮৯"[d]);

  // Read progress from LocalStorage
  const STORAGE_KEY = 'english_grammar_progress_data_v1';
  function getProgressState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || JSON.parse(localStorage.getItem('ebk_english_grammar_progress')) || {};
    } catch (e) {
      return {};
    }
  }

  function setProgressState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem('ebk_english_grammar_progress', JSON.stringify(state));
    } catch (e) {}
  }

  // 3. Inject CSS Styles with Mobile Optimizations
  const css = `
    /* ══════ Smart E-Book Mobile & Responsive Engine ══════ */
    :root {
      --ebk-primary: #4338ca;
      --ebk-primary-hover: #3730a3;
      --ebk-accent: #f59e0b;
      --ebk-bg-bar: rgba(255, 255, 255, 0.94);
      --ebk-bg-drawer: #ffffff;
      --ebk-text-main: #1e293b;
      --ebk-text-muted: #64748b;
      --ebk-border: #e2e8f0;
      --ebk-card-bg: #f8fafc;
      --ebk-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
      --ebk-shadow-lg: 0 10px 30px -4px rgba(0, 0, 0, 0.18);
    }

    [data-theme="dark"], body.dark {
      --ebk-primary: #818cf8;
      --ebk-primary-hover: #a5b4fc;
      --ebk-accent: #fbbf24;
      --ebk-bg-bar: rgba(15, 23, 42, 0.94);
      --ebk-bg-drawer: #0f172a;
      --ebk-text-main: #f8fafc;
      --ebk-text-muted: #94a3b8;
      --ebk-border: #334155;
      --ebk-card-bg: #1e293b;
      --ebk-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
      --ebk-shadow-lg: 0 10px 30px -4px rgba(0, 0, 0, 0.6);
    }

    /* Universal Mobile Safeguards: prevent horizontal page shake */
    html {
      overflow-x: clip;
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }

    body {
      overflow-x: clip;
      width: 100%;
      min-width: 0;
      margin: 0;
      font-family: 'Noto Serif Bengali', serif, system-ui, sans-serif;
      line-height: 1.7;
    }

    /* Scroll Reading Progress Bar at the absolute top */
    .ebk-scroll-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: linear-gradient(90deg, var(--ebk-primary), var(--ebk-accent));
      z-index: 99999;
      transition: width 0.12s ease-out;
      pointer-events: none;
    }

    /* Fixed Top Smart Bar with notch safe-area support */
    .ebk-topbar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 52px;
      padding-top: env(safe-area-inset-top, 0px);
      background: var(--ebk-bg-bar);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--ebk-border);
      box-shadow: var(--ebk-shadow);
      z-index: 99990;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: max(12px, env(safe-area-inset-left, 0px));
      padding-right: max(12px, env(safe-area-inset-right, 0px));
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease;
      box-sizing: border-box;
    }

    .ebk-topbar-hidden {
      transform: translateY(-100%);
    }

    .ebk-bar-left, .ebk-bar-right {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .ebk-bar-center {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 8px;
      flex: 1;
      justify-content: center;
      min-width: 0;
    }

    .ebk-cur-badge {
      font-size: 11px;
      font-weight: 700;
      background: var(--ebk-primary);
      color: #ffffff;
      padding: 2px 7px;
      border-radius: 999px;
      flex-shrink: 0;
      letter-spacing: 0.3px;
    }

    .ebk-cur-title {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--ebk-text-main);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ebk-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      height: 34px;
      padding: 0 11px;
      border-radius: 8px;
      border: 1px solid var(--ebk-border);
      background: var(--ebk-card-bg);
      color: var(--ebk-text-main);
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      user-select: none;
      touch-action: manipulation;
      transition: all 0.18s ease;
    }

    .ebk-btn:hover {
      background: var(--ebk-border);
      color: var(--ebk-primary);
      border-color: var(--ebk-primary);
    }

    .ebk-btn-primary {
      background: var(--ebk-primary);
      color: #ffffff !important;
      border-color: var(--ebk-primary);
    }

    .ebk-btn-primary:hover {
      background: var(--ebk-primary-hover);
    }

    .ebk-btn-icon {
      width: 34px;
      padding: 0;
    }

    .ebk-disabled {
      opacity: 0.35;
      pointer-events: none;
      cursor: default;
    }

    /* ══════ Full-Height Slide-over Drawer ══════ */
    .ebk-drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 99998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s ease, visibility 0.25s ease;
    }

    .ebk-drawer-overlay.ebk-open {
      opacity: 1;
      visibility: visible;
    }

    .ebk-drawer {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      width: 380px;
      max-width: 90vw;
      background: var(--ebk-bg-drawer);
      color: var(--ebk-text-main);
      box-shadow: var(--ebk-shadow-lg);
      z-index: 99999;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .ebk-drawer.ebk-open {
      transform: translateX(0);
    }

    .ebk-drawer-header {
      padding: 16px 16px 12px 16px;
      border-bottom: 1px solid var(--ebk-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-shrink: 0;
    }

    .ebk-drawer-title {
      font-size: 16px;
      font-weight: 800;
      color: var(--ebk-primary);
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }

    .ebk-drawer-close {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid var(--ebk-border);
      background: var(--ebk-card-bg);
      color: var(--ebk-text-muted);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.15s ease;
    }

    .ebk-drawer-close:hover {
      background: #ef4444;
      color: #ffffff;
      border-color: #ef4444;
    }

    .ebk-drawer-toolbar {
      padding: 12px 16px;
      border-bottom: 1px solid var(--ebk-border);
      background: var(--ebk-card-bg);
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex-shrink: 0;
    }

    .ebk-search-wrap {
      position: relative;
      width: 100%;
    }

    .ebk-search-input {
      width: 100%;
      height: 36px;
      padding: 0 12px 0 34px;
      border-radius: 8px;
      border: 1px solid var(--ebk-border);
      background: var(--ebk-bg-drawer);
      color: var(--ebk-text-main);
      font-family: inherit;
      font-size: 13px;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.15s ease;
    }

    .ebk-search-input:focus {
      border-color: var(--ebk-primary);
    }

    .ebk-search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--ebk-text-muted);
      pointer-events: none;
    }

    .ebk-fontsize-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .ebk-fs-btn {
      flex: 1;
      height: 30px;
      border-radius: 6px;
      border: 1px solid var(--ebk-border);
      background: var(--ebk-bg-drawer);
      color: var(--ebk-text-main);
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }

    .ebk-fs-btn:hover {
      border-color: var(--ebk-primary);
      color: var(--ebk-primary);
    }

    .ebk-drawer-content {
      padding: 12px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      flex: 1;
    }

    .ebk-chapter-group {
      margin-bottom: 12px;
      border: 1px solid var(--ebk-border);
      border-radius: 10px;
      overflow: hidden;
      background: var(--ebk-bg-drawer);
    }

    .ebk-chapter-head {
      padding: 10px 12px;
      background: var(--ebk-card-bg);
      border-bottom: 1px solid var(--ebk-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 12.5px;
      font-weight: 700;
      color: var(--ebk-text-main);
    }

    .ebk-topic-list {
      list-style: none;
      margin: 0;
      padding: 4px;
    }

    .ebk-topic-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      border-radius: 7px;
      margin-bottom: 2px;
      text-decoration: none;
      color: var(--ebk-text-main);
      font-size: 12.5px;
      transition: background 0.15s ease;
      gap: 8px;
    }

    .ebk-topic-item:hover {
      background: var(--ebk-card-bg);
    }

    .ebk-topic-item.ebk-active {
      background: var(--ebk-primary);
      color: #ffffff !important;
      font-weight: 700;
    }

    .ebk-topic-item.ebk-active .ebk-topic-pages {
      color: rgba(255, 255, 255, 0.85);
    }

    .ebk-topic-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ebk-topic-pages {
      font-size: 11px;
      color: var(--ebk-text-muted);
      flex-shrink: 0;
    }

    .ebk-check-box {
      width: 17px;
      height: 17px;
      border-radius: 4px;
      border: 1.5px solid var(--ebk-border);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      background: var(--ebk-bg-drawer);
      transition: all 0.15s ease;
    }

    .ebk-check-box.checked {
      background: #10b981;
      border-color: #10b981;
      color: white;
    }

    .ebk-check-box svg {
      width: 12px;
      height: 12px;
      stroke-width: 3;
    }

    .ebk-drawer-footer {
      padding: 12px 16px;
      border-top: 1px solid var(--ebk-border);
      background: var(--ebk-card-bg);
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    /* ══════ Bottom Fixed Chapter Navigation Bar ══════ */
    .ebk-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 52px;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      background: var(--ebk-bg-bar);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-top: 1px solid var(--ebk-border);
      box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: max(8px, env(safe-area-inset-left, 0px));
      padding-right: max(8px, env(safe-area-inset-right, 0px));
      gap: 6px;
      z-index: 99980;
      box-sizing: border-box;
    }

    .ebk-nav-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      height: 36px;
      padding: 0 10px;
      border-radius: 8px;
      border: 1px solid var(--ebk-border);
      background: var(--ebk-card-bg);
      color: var(--ebk-text-main);
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.18s ease;
      flex: 1 1 0;
      min-width: 0;
      max-width: 42%;
      overflow: hidden;
      box-sizing: border-box;
    }

    .ebk-nav-link:hover {
      background: var(--ebk-primary);
      color: #ffffff;
      border-color: var(--ebk-primary);
    }

    .ebk-nav-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
      flex: 1;
      text-align: center;
      font-family: inherit;
    }

    .ebk-nav-arrow {
      flex-shrink: 0;
      font-size: 13px;
      line-height: 1;
    }

    .ebk-nav-meta {
      text-align: center;
      font-size: 11px;
      color: var(--ebk-text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 4px;
      flex-shrink: 0;
    }

    /* Universal In-Page Chapter Footer Button Safeguards (Image 3 fix) */
    .footer-nav, .chapter-footer-nav {
      display: flex !important;
      justify-content: space-between !important;
      gap: 8px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }

    .footer-btn, .nav-btn-link, a.footer-btn, a.nav-btn {
      flex: 1 1 0 !important;
      min-width: 0 !important;
      max-width: 50% !important;
      padding: 0.65rem 0.5rem !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
      text-align: center !important;
      line-height: 1.35 !important;
      font-size: 0.82rem !important;
      box-sizing: border-box !important;
      white-space: normal !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    /* Floating Action Buttons (Back to Top) */
    .ebk-fab {
      position: fixed;
      right: max(16px, env(safe-area-inset-right, 16px));
      bottom: calc(64px + env(safe-area-inset-bottom, 0px));
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--ebk-primary);
      color: #ffffff;
      border: none;
      box-shadow: var(--ebk-shadow-lg);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99970;
      opacity: 0;
      transform: scale(0.8);
      pointer-events: none;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ebk-fab.ebk-show {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }

    .ebk-fab:hover {
      background: var(--ebk-primary-hover);
      transform: scale(1.08);
    }

    /* ══════ Samsung A23 & Mobile Optimization Engine ══════ */
    @media (max-width: 600px) {
      .ebk-btn-text {
        display: none !important;
      }
      .ebk-btn {
        padding: 0 8px !important;
      }
      .ebk-cur-badge {
        display: none !important;
      }
      .ebk-cur-title {
        font-size: 12px !important;
        max-width: 140px !important;
      }
      .container {
        padding: 6px 8px 30px 8px !important;
      }
      .options-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  // Inject Styles into Head
  const styleEl = document.createElement('style');
  styleEl.id = 'ebk-nav-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 4. Render Scroll Reading Progress Bar
  function renderProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'ebk-scroll-progress-bar';
    bar.id = 'ebk-scroll-progress';
    document.body.prepend(bar);
  }

  // 5. Render Top Navigation Bar
  function renderTopBar() {
    const topBar = document.createElement('header');
    topBar.className = 'ebk-topbar';
    topBar.id = 'ebk-topbar';

    const prevHref = prevItem ? encodeURI(prevItem.file) : '#';
    const nextHref = nextItem ? encodeURI(nextItem.file) : '#';

    topBar.innerHTML = `
      <div class="ebk-bar-left">
        <button class="ebk-btn ebk-btn-primary" id="ebk-open-drawer-btn" title="সূচিপত্র খুলুন (শর্টকাট: M)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          <span class="ebk-btn-text">সূচিপত্র</span>
        </button>
        <a href="index.html" class="ebk-btn" title="সূচিপত্র ড্যাশবোর্ডে ফিরে যান">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span class="ebk-btn-text">হোম</span>
        </a>
      </div>

      <div class="ebk-bar-center">
        ${currentItem ? `
          <span class="ebk-cur-badge">অধ্যায় ${currentItem.chapterNumber}</span>
          <span class="ebk-cur-title" title="${currentItem.title}">${currentItem.title}</span>
          <span class="ebk-cur-badge">${currentItem.pages}</span>
        ` : `
          <span class="ebk-cur-title">English Grammar পূর্ণাঙ্গ ইবুক</span>
        `}
      </div>

      <div class="ebk-bar-right">
        <a href="${prevHref}" class="ebk-btn ${!prevItem ? 'ebk-disabled' : ''}" title="${prevItem ? 'পূর্ববর্তী: ' + prevItem.title : 'প্রথম পাঠ'}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span class="ebk-btn-text">আগের</span>
        </a>
        <a href="${nextHref}" class="ebk-btn ${!nextItem ? 'ebk-disabled' : ''}" title="${nextItem ? 'পরবর্তী: ' + nextItem.title : 'শেষ পাঠ'}">
          <span class="ebk-btn-text">পরের</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </a>
        <button class="ebk-btn ebk-btn-icon" id="ebk-theme-btn" title="থিম পরিবর্তন">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>
      </div>
    `;

    document.body.prepend(topBar);
  }

  // 6. Render Slide-over Drawer
  function renderDrawer() {
    const progress = getProgressState();
    let totalCompleted = 0;
    BOOK_CHAPTERS.forEach(ch => {
      ch.topics.forEach(t => {
        if (progress[t.id]) totalCompleted++;
      });
    });

    const overlay = document.createElement('div');
    overlay.className = 'ebk-drawer-overlay';
    overlay.id = 'ebk-drawer-overlay';

    const drawer = document.createElement('aside');
    drawer.className = 'ebk-drawer';
    drawer.id = 'ebk-drawer';

    drawer.innerHTML = `
      <div class="ebk-drawer-header">
        <h3 class="ebk-drawer-title">
          <span>📚</span> সূচিপত্র ও পাঠ তালিকা
        </h3>
        <button class="ebk-drawer-close" id="ebk-drawer-close-btn" title="বন্ধ করুন (Esc)">✕</button>
      </div>

      <!-- Subject Switcher -->
      <div style="padding: 8px 14px; background: rgba(67, 56, 202, 0.08); border-bottom: 1px solid var(--ebk-border); font-size: 12px; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-weight: 700; color: var(--ebk-primary);">বিষয় পরিবর্তন:</span>
        <select onchange="if(this.value!=='current') window.location.href=this.value;" style="padding: 3px 6px; border-radius: 6px; border: 1px solid var(--ebk-border); background: var(--ebk-card-bg); color: var(--ebk-text-main); font-family: inherit; font-size: 12px; cursor: pointer; max-width: 65%;">
          <option value="current" selected>📗 English Grammar</option>
          <option value="../Live MCQ English Literature/index.html">🎭 English Literature</option>
          <option value="../Live MCQ Bangla Language/index.html">✍️ বাংলা ভাষা ও ব্যাকরণ</option>
          <option value="../Live MCQ Bangla Literature/index.html">📚 বাংলা সাহিত্য</option>
          <option value="../Live MCQ Bangladesh/index.html">🇧🇩 বাংলাদেশ বিষয়াবলি</option>
          <option value="../Live MCQ International/index.html">🌐 আন্তর্জাতিক বিষয়াবলি</option>
          <option value="../index.html">🏛️ মাস্টার লাইব্রেরি পোর্টাল</option>
        </select>
      </div>

      <div class="ebk-drawer-toolbar">
        <div class="ebk-fontsize-bar">
          <span style="font-size:12px; font-weight:600; opacity:0.85;">ফন্ট সাইজ:</span>
          <div style="display:flex; gap:6px;">
            <button class="ebk-fs-btn" onclick="ebkAdjustFontSize(-0.08)" title="লেখা ছোট করুন">A-</button>
            <button class="ebk-fs-btn" onclick="ebkResetFontSize()" title="স্বাভাবিক সাইজ">রিসেট</button>
            <button class="ebk-fs-btn" onclick="ebkAdjustFontSize(0.08)" title="লেখা বড় করুন">A+</button>
          </div>
        </div>

        <div class="ebk-search-wrap">
          <span class="ebk-search-icon">🔍</span>
          <input type="text" class="ebk-search-input" id="ebk-drawer-search" placeholder="টপিক বা অধ্যায় খুঁজুন...">
        </div>
      </div>

      <div class="ebk-drawer-content" id="ebk-drawer-list">
        ${renderDrawerTree(progress)}
      </div>

      <div class="ebk-drawer-footer">
        <span>সম্পন্ন হয়েছে: <strong id="ebk-drawer-progress" style="color:var(--ebk-primary);">${toBn(totalCompleted)} / ২৯</strong></span>
        <a href="index.html" style="color:var(--ebk-primary); font-weight:700; text-decoration:none;">মাস্টার সূচিপত্র →</a>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    // Event Bindings
    document.getElementById('ebk-open-drawer-btn').addEventListener('click', openDrawer);
    document.getElementById('ebk-drawer-close-btn').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Search Filtering
    const searchInput = document.getElementById('ebk-drawer-search');
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      const items = drawer.querySelectorAll('.ebk-topic-item');
      items.forEach(item => {
        const text = item.getAttribute('data-title').toLowerCase();
        if (text.includes(q)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  function renderDrawerTree(progress) {
    return BOOK_CHAPTERS.map(ch => `
      <div class="ebk-chapter-group">
        <div class="ebk-chapter-head">
          <span>${ch.number}. ${ch.title}</span>
          <span style="font-size:11px; opacity:0.8;">${ch.pages}</span>
        </div>
        <ul class="ebk-topic-list">
          ${ch.topics.map(t => {
            const isActive = t.file === currentFileName;
            const isChecked = !!progress[t.id];
            return `
              <li>
                <div class="ebk-topic-item ${isActive ? 'ebk-active' : ''}" data-title="${t.title}">
                  <span class="ebk-check-box ${isChecked ? 'checked' : ''}" data-tid="${t.id}" onclick="window.ebkToggleCheck('${t.id}', event)">
                    ${isChecked ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                  </span>
                  <a href="${encodeURI(t.file)}" class="ebk-topic-title" style="color:inherit; text-decoration:none;">${t.title}</a>
                  <span class="ebk-topic-pages">${t.pages}</span>
                </div>
              </li>
            `;
          }).join('')}
        </ul>
      </div>
    `).join('');
  }

  // 7. Render Bottom Floating Chapter Navigation Bar
  function renderBottomNav() {
    if (!currentItem) return;

    const nav = document.createElement('nav');
    nav.className = 'ebk-bottom-nav';

    const prevHref = prevItem ? encodeURI(prevItem.file) : '#';
    const nextHref = nextItem ? encodeURI(nextItem.file) : '#';

    nav.innerHTML = `
      <a href="${prevHref}" class="ebk-nav-link ${!prevItem ? 'ebk-disabled' : ''}" title="${prevItem ? prevItem.title : 'প্রথম পাঠ'}">
        <span class="ebk-nav-arrow">←</span>
        <span class="ebk-nav-text">${prevItem ? prevItem.title : 'প্রথম পাঠ'}</span>
      </a>
      <div class="ebk-nav-meta">
        ${currentItem.pages}
      </div>
      <a href="${nextHref}" class="ebk-nav-link ${!nextItem ? 'ebk-disabled' : ''}" title="${nextItem ? nextItem.title : 'পরবর্তী বিষয়'}">
        <span class="ebk-nav-text">${nextItem ? nextItem.title : 'পরবর্তী বিষয়'}</span>
        <span class="ebk-nav-arrow">→</span>
      </a>
    `;

    document.body.appendChild(nav);
  }

  // 8. Render Floating Action Button (Back to Top)
  function renderFAB() {
    const fab = document.createElement('button');
    fab.className = 'ebk-fab';
    fab.id = 'ebk-back-to-top';
    fab.title = 'উপরে ফিরে যান';
    fab.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>`;

    fab.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(fab);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        fab.classList.add('ebk-show');
      } else {
        fab.classList.remove('ebk-show');
      }
    }, { passive: true });
  }

  // Drawer Controls
  function openDrawer() {
    document.getElementById('ebk-drawer-overlay').classList.add('ebk-open');
    document.getElementById('ebk-drawer').classList.add('ebk-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const activeEl = document.querySelector('.ebk-topic-item.ebk-active');
      if (activeEl) activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 100);
  }

  function closeDrawer() {
    const overlay = document.getElementById('ebk-drawer-overlay');
    const drawer = document.getElementById('ebk-drawer');
    if (overlay) overlay.classList.remove('ebk-open');
    if (drawer) drawer.classList.remove('ebk-open');
    document.body.style.overflow = '';
  }

  // Toggle Read Checkbox
  window.ebkToggleCheck = function (tid, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const state = getProgressState();
    state[tid] = !state[tid];
    setProgressState(state);

    const box = document.querySelector(`.ebk-check-box[data-tid="${tid}"]`);
    if (box) {
      if (state[tid]) {
        box.classList.add('checked');
        box.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      } else {
        box.classList.remove('checked');
        box.innerHTML = '';
      }
    }

    let totalCompleted = 0;
    BOOK_CHAPTERS.forEach(ch => {
      ch.topics.forEach(t => {
        if (state[t.id]) totalCompleted++;
      });
    });
    const progressEl = document.getElementById('ebk-drawer-progress');
    if (progressEl) {
      progressEl.textContent = `${toBn(totalCompleted)} / ২৯`;
    }
  };

  // Universal Font Size Controller
  let currentFontScale = parseFloat(localStorage.getItem('ebk_font_scale')) || 1.0;
  if (isNaN(currentFontScale) || currentFontScale < 0.75 || currentFontScale > 1.5) {
    currentFontScale = 1.0;
  }

  function applyFontScale(scale) {
    currentFontScale = Math.min(1.4, Math.max(0.8, Math.round(scale * 100) / 100));
    try {
      localStorage.setItem('ebk_font_scale', currentFontScale);
    } catch (e) {}

    document.documentElement.style.fontSize = (currentFontScale * 100) + '%';
    document.documentElement.style.setProperty('--font-scale', currentFontScale);

    let styleEl = document.getElementById('ebk-font-scale-override');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'ebk-font-scale-override';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      :root {
        --font-scale: ${currentFontScale};
        font-size: ${currentFontScale * 100}% !important;
      }
    `;
  }

  window.adjustFontSize = function (delta) {
    const step = delta > 0 ? 0.08 : -0.08;
    applyFontScale(currentFontScale + step);
  };

  window.changeFontSize = function (delta) {
    if (delta === 0) {
      applyFontScale(1.0);
    } else {
      const step = delta > 0 ? 0.08 : -0.08;
      applyFontScale(currentFontScale + step);
    }
  };

  window.ebkAdjustFontSize = function (delta) {
    applyFontScale(currentFontScale + delta);
  };

  window.ebkResetFontSize = function () {
    applyFontScale(1.0);
  };

  applyFontScale(currentFontScale);

  // Universal Theme Setter & Synchronizer
  function syncTheme() {
    try {
      const savedTheme = localStorage.getItem('theme') || localStorage.getItem('ebk_portal_theme') || localStorage.getItem('bcs_theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (savedTheme === 'dark') {
        document.body && document.body.classList.add('dark');
      } else {
        document.body && document.body.classList.remove('dark');
      }
      const themeBtns = document.querySelectorAll('#themeBtn, #ebk-theme-btn, .theme-toggle-btn');
      themeBtns.forEach(btn => {
        const icon = btn.querySelector('#themeIcon') || btn;
        if (icon) icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        const text = btn.querySelector('#themeText');
        if (text) text.textContent = savedTheme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড';
      });
    } catch(e) {}
  }

  window.setGlobalTheme = function(nextTheme) {
    try {
      document.documentElement.setAttribute('data-theme', nextTheme);
      if (nextTheme === 'dark') {
        document.body && document.body.classList.add('dark');
      } else {
        document.body && document.body.classList.remove('dark');
      }
      localStorage.setItem('theme', nextTheme);
      localStorage.setItem('ebk_portal_theme', nextTheme);
      localStorage.setItem('bcs_theme', nextTheme);
      syncTheme();
    } catch (e) {}
  };

  window.toggleTheme = function() {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    window.setGlobalTheme(next);
  };
  window.togglePortalTheme = window.toggleTheme;

  // Theme Toggle Setup
  function setupThemeToggle() {
    const btn = document.getElementById('ebk-theme-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        window.toggleTheme();
      });
    }
    syncTheme();
  }

  // Scroll Behaviors
  function setupScrollInteractions() {
    const topBar = document.getElementById('ebk-topbar');
    const progressBar = document.getElementById('ebk-scroll-progress');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;

          if (progressBar && docHeight > 0) {
            const pct = Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100));
            progressBar.style.width = pct + '%';
          }

          if (topBar && window.innerWidth <= 768) {
            if (currentScrollY > 60 && currentScrollY > lastScrollY + 12) {
              topBar.classList.add('ebk-topbar-hidden');
            } else if (currentScrollY < lastScrollY - 12 || currentScrollY <= 20) {
              topBar.classList.remove('ebk-topbar-hidden');
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Keyboard Shortcuts
  function setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        if (e.key === 'Escape') closeDrawer();
        return;
      }

      if (e.key === 'Escape') {
        closeDrawer();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const drawer = document.getElementById('ebk-drawer');
        if (drawer && drawer.classList.contains('ebk-open')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      } else if (e.altKey && e.key === 'ArrowLeft' && prevItem) {
        window.location.href = encodeURI(prevItem.file);
      } else if (e.altKey && e.key === 'ArrowRight' && nextItem) {
        window.location.href = encodeURI(nextItem.file);
      }
    });
  }

  function init() {
    if (document.getElementById('ebk-topbar')) return;

    renderProgressBar();
    renderTopBar();
    renderDrawer();
    renderBottomNav();
    renderFAB();
    setupThemeToggle();
    setupScrollInteractions();
    setupShortcuts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
