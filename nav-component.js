/**
 * বাংলা সাহিত্য বিসিএস পূর্ণাঙ্গ প্রস্তুতি - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
 * Smart E-Book Navigation Component for GitHub Pages & Local Reading
 * 
 * Features:
 * - Top Sticky Glassmorphism Navigation Bar (ToC Drawer, Home, Current Topic, Prev/Next)
 * - Slide-in Offcanvas Table of Contents (All 5 Chapters, 31 Topics, Search, Active Highlight)
 * - Live LocalStorage Progress Sync (Checkmarks from index.html)
 * - Bottom Page-to-Page Chapter Cards
 * - Floating Quick Access Button (FAB)
 * - Keyboard Shortcuts (Alt+Left: Prev, Alt+Right: Next, Esc: Close, M: ToC)
 */

(function () {
  'use strict';

  // 1. Data Definition: 5 Chapters, 31 Topics mapped to 30 files
  const BOOK_CHAPTERS = [
    {
      id: "ch-1",
      number: "১",
      title: "বাংলা সাহিত্যের প্রাচীন যুগ",
      pages: "পৃষ্ঠা ৭৩–৭৯",
      badgeColor: "#059669",
      topics: [
        { id: "t-1-1", title: "বাংলা সাহিত্যের প্রাচীন যুগ (চর্যাপদ ও প্রাথমিক বিকাশ)", pages: "পৃষ্ঠা ৭৩–৭৯", file: "বাংলা সাহিত্যের প্রাচীন যুগ.html" }
      ]
    },
    {
      id: "ch-2",
      number: "২",
      title: "বাংলা সাহিত্যের মধ্যযুগ",
      pages: "পৃষ্ঠা ৭৯–৯৯",
      badgeColor: "#0d9488",
      topics: [
        { id: "t-2-1", title: "শ্রীকৃষ্ণকীর্তন কাব্য", pages: "পৃষ্ঠা ৭৯–৮১", file: "শ্রীকৃষ্ণকীর্তন ও মধ্যযুগীয় বৈষ্ণব পদাবলী.html" },
        { id: "t-2-2", title: "মঙ্গলকাব্য (মনসামঙ্গল, চণ্ডীমঙ্গল, অন্নদামঙ্গল ইত্যাদি)", pages: "পৃষ্ঠা ৮১–৮৩", file: "মঙ্গলকাব্য.html" },
        { id: "t-2-3", title: "বৈষ্ণব পদাবলী ও পদকর্তাগণ", pages: "পৃষ্ঠা ৮৪–৮৫", file: "বৈষ্ণব পদাবলি.html" },
        { id: "t-2-4", title: "লোকসাহিত্য (ছড়া, প্রবাদ, ধাঁধা, পালাগান)", pages: "পৃষ্ঠা ৮৫–৮৮", file: "লোকসাহিত্য.html" },
        { id: "t-2-5", title: "গীতিকা (মৈমনসিংহ গীতিকা ও অন্যান্য)", pages: "পৃষ্ঠা ৮৮–৮৯", file: "গীতিকা ও লোকসাহিত্য.html" },
        { id: "t-2-6", title: "মধ্যযুগের গুরুত্বপূর্ণ সাহিত্যকর্ম ও লেখকগণ", pages: "পৃষ্ঠা ৯০–৯৯", file: "মধ্যযুগের গুরুত্বপূর্ণ সাহিত্যকর্ম ও লেখকগণ.html" }
      ]
    },
    {
      id: "ch-3",
      number: "৩",
      title: "বাংলা সাহিত্যের আধুনিক যুগ",
      pages: "পৃষ্ঠা ১০০–১৮৮",
      badgeColor: "#2563eb",
      topics: [
        { id: "t-3-1", title: "বাংলা সাহিত্যের আধুনিক যুগের বিকাশ ও পটভূমি", pages: "পৃষ্ঠা ১০০–১০৭", file: "বাংলা সাহিত্যের আধুনিক যুগের বিকাশ.html" },
        { id: "t-3-2", title: "রবীন্দ্রনাথ ঠাকুর: জীবন ও সৃষ্টিসমগ্র", pages: "পৃষ্ঠা ১০৭–১১৪", file: "রবীন্দ্রনাথ ঠাকুর.html" },
        { id: "t-3-3", title: "কাজী নজরুল ইসলাম: বিদ্রোহী কবি ও সৃষ্টিসমগ্র", pages: "পৃষ্ঠা ১১৫–১২১", file: "কাজী নজরুল ইসলাম.html" },
        { id: "t-3-4", title: "মাইকেল মধুসূদন দত্ত", pages: "পৃষ্ঠা ১২২–১২৪", file: "মাইকেল মধুসূদন দত্ত.html" },
        { id: "t-3-5", title: "ঈশ্বরচন্দ্র বিদ্যাসাগর", pages: "পৃষ্ঠা ১২৪–১২৫", file: "ঈশ্বরচন্দ্র বিদ্যাসাগর.html" },
        { id: "t-3-6", title: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়", pages: "পৃষ্ঠা ১২৫–১২৯", file: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়.html" },
        { id: "t-3-7", title: "শরৎচন্দ্র চট্টোপাধ্যায়, কায়কোবাদ, দীনবন্ধু মিত্র", pages: "পৃষ্ঠা ১২৯–১৩১", file: "শরৎচন্দ্র চট্টোপাধ্যায়, কায়কোবাদ ও দীনবন্ধু মিত্র.html" },
        { id: "t-3-8", title: "জসীম উদ্দীন, বেগম রোকেয়া, ফররুখ আহমদ", pages: "পৃষ্ঠা ১৩২–১৩৬", file: "জসীম উদ্দীন, বেগম রোকেয়া, ফররুখ আহমেদ.html" },
        { id: "t-3-9", title: "মীর মশাররফ হোসেন, সৈয়দ মুজতবা আলী", pages: "পৃষ্ঠা ১৩৭–১৩৯", file: "মীর মশাররফ হোসেন ও সৈয়দ মুজতবা আলী.html" },
        { id: "t-3-10", title: "প্রমথ চৌধুরী, মানিক বন্দ্যোপাধ্যায়, বিভূতিভূষণ বন্দ্যোপাধ্যায়", pages: "পৃষ্ঠা ১৪০–১৪২", file: "প্রমথ চৌধুরী, মানিক বন্দ্যোপাধ্যায়, বিভূতিভূষণ বন্দ্যোপাধ্যায়.html" },
        { id: "t-3-11", title: "কল্লোল যুগ ও বাংলা সাহিত্যের পঞ্চপাণ্ডব", pages: "পৃষ্ঠা ১৪২–১৪৪", file: "কল্লোল যুগ ও বাংলা সাহিত্যের পঞ্চপাণ্ডব.html" },
        { id: "t-3-12", title: "মুসলিম সাহিত্য সমাজের সাহিত্যিকগণ", pages: "পৃষ্ঠা ১৪৫–১৪৭", file: "মুসলিম সাহিত্য সমাজ — সোজা গাইড.html" },
        { id: "t-3-13", title: "শওকত ওসমান, শামসুর রাহমান, আল মাহমুদ", pages: "পৃষ্ঠা ১৪৮–১৫১", file: "শওকত ওসমান, শামসুর রাহমান, আল মাহমুদ — সোজা গাইড.html" },
        { id: "t-3-14", title: "সৈয়দ শামসুল হক, সেলিম আল দীন, হুমায়ুন আজাদ, হুমায়ূন আহমেদ", pages: "পৃষ্ঠা ১৫২–১৫৫", file: "সৈয়দ শামসুল হক, সেলিম আল দীন, হুমায়ুন আজাদ, হুমায়ূন আহমেদ.html" },
        { id: "t-3-15", title: "সৈয়দ ওয়ালীউল্লাহ, আখতারুজ্জামান ইলিয়াস", pages: "পৃষ্ঠা ১৫৫–১৫৮", file: "ওয়ালীউল্লাহ ও ইলিয়াস.html" },
        { id: "t-3-16", title: "ড. সুনীতিকুমার, শহীদুল্লাহ, এনামুল হক ও আবদুল হাই", pages: "পৃষ্ঠা ১৫৮–১৬০", file: "ড. সুনীতিকুমার, শহীদুল্লাহ, এনামুল হক ও আবদুল হাই.html" },
        { id: "t-3-17", title: "বাংলা সাহিত্যের গুরুত্বপূর্ণ নারী লেখক", pages: "পৃষ্ঠা ১৬১–১৬৩", file: "বাংলা সাহিত্যের গুরুত্বপূর্ণ নারী লেখক.html" },
        { id: "t-3-18", title: "আধুনিক যুগের অন্যান্য লেখক ও তাঁদের সাহিত্যকর্ম", pages: "পৃষ্ঠা ১৬৩–১৭৮", file: "আধুনিক যুগের অন্যান্য লেখক ও তাদের সাহিত্যকর্ম.html" },
        { id: "t-3-19", title: "সাহিত্যিক ছদ্মনাম ও উপাধি", pages: "পৃষ্ঠা ১৭৯–১৮১", file: "সাহিত্যিক ছদ্মনাম ও উপাধি.html" },
        { id: "t-3-20", title: "পত্রিকা-সাময়িকী ও সম্পাদক", pages: "পৃষ্ঠা ১৮১–১৮৮", file: "পত্রিকা-সাময়িকী ও সম্পাদক.html" }
      ]
    },
    {
      id: "ch-4",
      number: "৪",
      title: "ভাষা আন্দোলন ও মুক্তিযুদ্ধভিত্তিক সাহিত্য",
      pages: "পৃষ্ঠা ১৮৯–১৯৫",
      badgeColor: "#e11d48",
      topics: [
        { id: "t-4-1", title: "ভাষা আন্দোলনভিত্তিক সাহিত্য (কবিতা, নাটক, গান ও উপন্যাস)", pages: "পৃষ্ঠা ১৮৯–১৯১", file: "ভাষা আন্দোলন ও মুক্তিযুদ্ধভিত্তিক সাহিত্য.html" },
        { id: "t-4-2", title: "মুক্তিযুদ্ধভিত্তিক সাহিত্য (উপন্যাস, স্মৃতিচারণ, দলিল ও নাটক)", pages: "পৃষ্ঠা ১৯১–১৯৫", file: "ভাষা আন্দোলন ও মুক্তিযুদ্ধভিত্তিক সাহিত্য.html" }
      ]
    },
    {
      id: "ch-5",
      number: "৫",
      title: "বাংলা সাহিত্যের চরিত্র, উক্তি ও সংলাপ",
      pages: "পৃষ্ঠা ১৯৬–২০২",
      badgeColor: "#d97706",
      topics: [
        { id: "t-5-1", title: "বাংলা সাহিত্যের কালজয়ী চরিত্রসমূহ", pages: "পৃষ্ঠা ১৯৬–১৯৭", file: "বাংলা সাহিত্যের চরিত্র.html" },
        { id: "t-5-2", title: "বাংলা সাহিত্যের স্মরণীয় উক্তি ও সংলাপ", pages: "পৃষ্ঠা ১৯৭–২০২", file: "বাংলা সাহিত্যের অমর উক্তি ও সংলাপ.html" }
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
  const STORAGE_KEY = 'bangla_lit_progress_data_v1';
  function getProgressState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function setProgressState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  // 2. Inject Styles
  const css = `
    /* ══════ Smart E-Book Navigation Styles ══════ */
    :root {
      --ebk-primary: #0f766e;
      --ebk-primary-hover: #115e59;
      --ebk-accent: #d97706;
      --ebk-bg-bar: rgba(255, 255, 255, 0.92);
      --ebk-bg-drawer: #ffffff;
      --ebk-text-main: #1e293b;
      --ebk-text-muted: #64748b;
      --ebk-border: #e2e8f0;
      --ebk-card-bg: #f8fafc;
      --ebk-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
      --ebk-shadow-lg: 0 10px 30px -4px rgba(0, 0, 0, 0.18);
    }

    [data-theme="dark"], body.dark {
      --ebk-primary: #14b8a6;
      --ebk-primary-hover: #2dd4bf;
      --ebk-accent: #fbbf24;
      --ebk-bg-bar: rgba(15, 23, 42, 0.92);
      --ebk-bg-drawer: #0f172a;
      --ebk-text-main: #f8fafc;
      --ebk-text-muted: #94a3b8;
      --ebk-border: #334155;
      --ebk-card-bg: #1e293b;
      --ebk-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
      --ebk-shadow-lg: 0 10px 30px -4px rgba(0, 0, 0, 0.6);
    }

    /* Fixed Top Smart Bar */
    .ebk-topbar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 52px;
      background: var(--ebk-bg-bar);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--ebk-border);
      box-shadow: var(--ebk-shadow);
      z-index: 99990;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
      font-family: 'Noto Serif Bengali', serif, system-ui, sans-serif;
      box-sizing: border-box;
      transition: transform 0.25s ease, background 0.25s ease;
    }

    .ebk-topbar * {
      box-sizing: border-box;
    }

    .ebk-bar-left, .ebk-bar-right {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .ebk-bar-center {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 0;
      padding: 0 10px;
      text-align: center;
    }

    .ebk-cur-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--ebk-text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 480px;
    }

    .ebk-cur-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      background: rgba(15, 118, 110, 0.12);
      color: var(--ebk-primary);
      border-radius: 999px;
      border: 1px solid rgba(15, 118, 110, 0.2);
      white-space: nowrap;
    }

    /* Action Buttons */
    .ebk-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: 36px;
      padding: 0 12px;
      font-size: 13px;
      font-weight: 600;
      color: var(--ebk-text-main);
      background: transparent;
      border: 1px solid var(--ebk-border);
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
      user-select: none;
    }

    .ebk-btn:hover {
      background: var(--ebk-card-bg);
      border-color: var(--ebk-primary);
      color: var(--ebk-primary);
      transform: translateY(-1px);
    }

    .ebk-btn-primary {
      background: var(--ebk-primary);
      color: #ffffff !important;
      border-color: var(--ebk-primary);
    }

    .ebk-btn-primary:hover {
      background: var(--ebk-primary-hover);
      color: #ffffff !important;
    }

    .ebk-btn-icon {
      width: 36px;
      padding: 0;
    }

    .ebk-btn:disabled, .ebk-btn.ebk-disabled {
      opacity: 0.35;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Offcanvas Sidebar Drawer */
    .ebk-drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 99995;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .ebk-drawer-overlay.ebk-open {
      opacity: 1;
      visibility: visible;
    }

    .ebk-drawer {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 380px;
      max-width: 90vw;
      background: var(--ebk-bg-drawer);
      color: var(--ebk-text-main);
      z-index: 99999;
      box-shadow: var(--ebk-shadow-lg);
      transform: translateX(-100%);
      transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      font-family: 'Noto Serif Bengali', serif, system-ui, sans-serif;
    }

    .ebk-drawer.ebk-open {
      transform: translateX(0);
    }

    .ebk-drawer-header {
      padding: 16px 18px;
      border-bottom: 1px solid var(--ebk-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--ebk-card-bg);
    }

    .ebk-drawer-title {
      font-size: 17px;
      font-weight: 800;
      color: var(--ebk-primary);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ebk-drawer-close {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid var(--ebk-border);
      background: transparent;
      color: var(--ebk-text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.15s;
    }

    .ebk-drawer-close:hover {
      background: rgba(239, 68, 68, 0.12);
      color: #ef4444;
      border-color: #ef4444;
    }

    /* Drawer Search & Stats */
    .ebk-drawer-searchbox {
      padding: 12px 16px;
      border-bottom: 1px solid var(--ebk-border);
      background: var(--ebk-bg-drawer);
    }

    .ebk-search-input {
      width: 100%;
      padding: 9px 12px 9px 36px;
      border-radius: 8px;
      border: 1px solid var(--ebk-border);
      background: var(--ebk-card-bg);
      color: var(--ebk-text-main);
      font-size: 13px;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    .ebk-search-input:focus {
      border-color: var(--ebk-primary);
      box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.15);
    }

    .ebk-search-wrap {
      position: relative;
    }

    .ebk-search-icon {
      position: absolute;
      left: 11px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--ebk-text-muted);
      pointer-events: none;
    }

    .ebk-drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 12px 14px;
      scrollbar-width: thin;
    }

    /* Chapter Accordion in Drawer */
    .ebk-chap-box {
      margin-bottom: 10px;
      border: 1px solid var(--ebk-border);
      border-radius: 10px;
      overflow: hidden;
      background: var(--ebk-card-bg);
    }

    .ebk-chap-header {
      padding: 10px 14px;
      background: var(--ebk-card-bg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      font-weight: 700;
      font-size: 13.5px;
      color: var(--ebk-text-main);
      transition: background 0.15s;
    }

    .ebk-chap-header:hover {
      background: rgba(15, 118, 110, 0.06);
    }

    .ebk-chap-badge {
      display: inline-block;
      width: 22px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      border-radius: 6px;
      background: var(--ebk-primary);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      margin-right: 8px;
    }

    .ebk-topic-list {
      list-style: none;
      padding: 0;
      margin: 0;
      border-top: 1px solid var(--ebk-border);
      background: var(--ebk-bg-drawer);
    }

    .ebk-topic-item {
      border-bottom: 1px solid rgba(226, 232, 240, 0.6);
    }

    .ebk-topic-item:last-child {
      border-bottom: none;
    }

    .ebk-topic-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 12px;
      color: var(--ebk-text-main);
      text-decoration: none;
      font-size: 13px;
      transition: all 0.15s;
      gap: 8px;
    }

    .ebk-topic-link:hover {
      background: rgba(15, 118, 110, 0.08);
      color: var(--ebk-primary);
      padding-left: 16px;
    }

    .ebk-topic-link.ebk-active {
      background: rgba(15, 118, 110, 0.14);
      color: var(--ebk-primary);
      font-weight: 700;
      border-left: 4px solid var(--ebk-primary);
    }

    .ebk-topic-check {
      cursor: pointer;
      accent-color: var(--ebk-primary);
      width: 15px;
      height: 15px;
      flex-shrink: 0;
    }

    .ebk-topic-title-span {
      flex: 1;
      min-width: 0;
      white-space: normal;
      line-height: 1.35;
    }

    .ebk-topic-page {
      font-size: 10.5px;
      color: var(--ebk-text-muted);
      background: var(--ebk-card-bg);
      padding: 1px 6px;
      border-radius: 4px;
      border: 1px solid var(--ebk-border);
      white-space: nowrap;
    }

    /* Drawer Footer */
    .ebk-drawer-footer {
      padding: 12px 16px;
      border-top: 1px solid var(--ebk-border);
      background: var(--ebk-card-bg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    /* Bottom Page-to-Page Navigator */
    .ebk-bottom-nav {
      margin: 48px auto 24px auto;
      max-width: 860px;
      padding: 16px;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 12px;
      align-items: center;
      font-family: 'Noto Serif Bengali', serif, system-ui, sans-serif;
      box-sizing: border-box;
    }

    .ebk-nav-card {
      display: flex;
      flex-direction: column;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid var(--ebk-border);
      background: var(--ebk-card-bg);
      text-decoration: none;
      color: var(--ebk-text-main);
      transition: all 0.2s ease;
      box-shadow: var(--ebk-shadow);
    }

    .ebk-nav-card:hover {
      border-color: var(--ebk-primary);
      transform: translateY(-2px);
      box-shadow: var(--ebk-shadow-lg);
    }

    .ebk-nav-card-dir {
      font-size: 11px;
      font-weight: 700;
      color: var(--ebk-primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }

    .ebk-nav-card-title {
      font-size: 13.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ebk-nav-card.ebk-prev {
      text-align: left;
    }

    .ebk-nav-card.ebk-next {
      text-align: right;
    }

    .ebk-bottom-home-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--ebk-card-bg);
      border: 1px solid var(--ebk-border);
      color: var(--ebk-text-main);
      text-decoration: none;
      font-size: 18px;
      transition: all 0.2s;
    }

    .ebk-bottom-home-btn:hover {
      background: var(--ebk-primary);
      color: #fff;
      border-color: var(--ebk-primary);
    }

    /* Floating Quick Action Button */
    .ebk-fab {
      position: fixed;
      bottom: 24px;
      left: 24px;
      z-index: 99980;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 999px;
      background: var(--ebk-primary);
      color: #ffffff;
      box-shadow: 0 6px 20px rgba(15, 118, 110, 0.4);
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 13px;
      font-weight: 700;
      font-family: 'Noto Serif Bengali', serif, system-ui, sans-serif;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      user-select: none;
    }

    .ebk-fab:hover {
      transform: scale(1.06) translateY(-2px);
      box-shadow: 0 10px 25px rgba(15, 118, 110, 0.5);
      background: var(--ebk-primary-hover);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .ebk-cur-title {
        max-width: 160px;
        font-size: 12.5px;
      }
      .ebk-cur-badge {
        display: none;
      }
      .ebk-btn-text {
        display: none;
      }
      .ebk-bottom-nav {
        grid-template-columns: 1fr;
      }
      .ebk-nav-card.ebk-next {
        text-align: left;
      }
      .ebk-fab {
        bottom: 16px;
        left: 16px;
        padding: 8px 14px;
        font-size: 12px;
      }
    }

    @media print {
      .ebk-topbar, .ebk-drawer, .ebk-drawer-overlay, .ebk-bottom-nav, .ebk-fab {
        display: none !important;
      }
    }
  `;

  // Inject Styles into Head
  const styleEl = document.createElement('style');
  styleEl.id = 'ebk-nav-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 3. Render Top Navigation Bar
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
          <span class="ebk-cur-title">বাংলা সাহিত্য পূর্ণাঙ্গ ইবুক</span>
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

  // 4. Render Slide-over Drawer
  function renderDrawer() {
    const progress = getProgressState();
    let totalCompleted = 0;
    BOOK_CHAPTERS.forEach(ch => {
      ch.topics.forEach(t => {
        if (progress[t.id]) totalCompleted++;
      });
    });

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'ebk-drawer-overlay';
    overlay.id = 'ebk-drawer-overlay';

    // Drawer container
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

      <div class="ebk-drawer-searchbox">
        <div class="ebk-search-wrap">
          <svg class="ebk-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="ebk-search-input" id="ebk-drawer-search" placeholder="টপিক বা লেখক খুঁজুন..." autocomplete="off">
        </div>
      </div>

      <div class="ebk-drawer-body" id="ebk-drawer-body">
        ${BOOK_CHAPTERS.map(ch => {
          const hasCurrentFile = ch.topics.some(t => t.file === currentFileName);
          return `
            <div class="ebk-chap-box" data-chap-id="${ch.id}">
              <div class="ebk-chap-header" onclick="ebkToggleChapter('${ch.id}')">
                <div>
                  <span class="ebk-chap-badge">${ch.number}</span>
                  <span>${ch.title}</span>
                </div>
                <span style="font-size: 11px; opacity: 0.7;">${ch.pages}</span>
              </div>
              <ul class="ebk-topic-list" id="ebk-topic-list-${ch.id}" style="${hasCurrentFile ? 'display:block;' : 'display:block;'}">
                ${ch.topics.map(t => {
                  const isActive = t.file === currentFileName;
                  const isChecked = !!progress[t.id];
                  return `
                    <li class="ebk-topic-item" data-title="${t.title.toLowerCase()}">
                      <a href="${encodeURI(t.file)}" class="ebk-topic-link ${isActive ? 'ebk-active' : ''}">
                        <input type="checkbox" class="ebk-topic-check" data-id="${t.id}" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); ebkToggleTopicCheck(this, '${t.id}');" title="পড়া সম্পন্ন হয়েছে">
                        <span class="ebk-topic-title-span">${t.title}</span>
                        <span class="ebk-topic-page">${t.pages.replace('পৃষ্ঠা ', '')}</span>
                      </a>
                    </li>
                  `;
                }).join('')}
              </ul>
            </div>
          `;
        }).join('')}
      </div>

      <div class="ebk-drawer-footer">
        <a href="index.html" class="ebk-btn ebk-btn-primary" style="flex:1;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          সূচিপত্র ড্যাশবোর্ড
        </a>
        <div style="font-size: 12px; color: var(--ebk-text-muted); font-weight: 600;">
          অগ্রগতি: <span id="ebk-drawer-progress">${toBn(totalCompleted)} / ৩১</span>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    // Event Listeners for drawer
    overlay.addEventListener('click', closeDrawer);
    document.getElementById('ebk-drawer-close-btn').addEventListener('click', closeDrawer);
    document.getElementById('ebk-open-drawer-btn').addEventListener('click', openDrawer);

    // Drawer Search Filter
    const searchInput = document.getElementById('ebk-drawer-search');
    searchInput.addEventListener('input', function (e) {
      const q = e.target.value.trim().toLowerCase();
      const items = drawer.querySelectorAll('.ebk-topic-item');
      items.forEach(item => {
        const title = item.getAttribute('data-title') || '';
        if (!q || title.includes(q)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 5. Render Bottom Page-to-Page Navigator
  function renderBottomNav() {
    const nav = document.createElement('nav');
    nav.className = 'ebk-bottom-nav';
    nav.id = 'ebk-bottom-nav';

    const prevCard = prevItem ? `
      <a href="${encodeURI(prevItem.file)}" class="ebk-nav-card ebk-prev">
        <span class="ebk-nav-card-dir">◀ পূর্ববর্তী পাঠ</span>
        <span class="ebk-nav-card-title">${prevItem.title}</span>
      </a>
    ` : `<div></div>`;

    const nextCard = nextItem ? `
      <a href="${encodeURI(nextItem.file)}" class="ebk-nav-card ebk-next">
        <span class="ebk-nav-card-dir">পরবর্তী পাঠ ▶</span>
        <span class="ebk-nav-card-title">${nextItem.title}</span>
      </a>
    ` : `<div></div>`;

    nav.innerHTML = `
      ${prevCard}
      <a href="index.html" class="ebk-bottom-home-btn" title="সূচিপত্রে ফিরে যান">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      </a>
      ${nextCard}
    `;

    document.body.appendChild(nav);
  }

  // 6. Floating Action Button (FAB)
  function renderFAB() {
    const fab = document.createElement('button');
    fab.className = 'ebk-fab';
    fab.id = 'ebk-fab';
    fab.setAttribute('title', 'সূচিপত্র খুলুন (M)');
    fab.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      <span>সূচিপত্র</span>
    `;
    fab.addEventListener('click', openDrawer);
    document.body.appendChild(fab);
  }

  // Drawer Control Functions
  function openDrawer() {
    const overlay = document.getElementById('ebk-drawer-overlay');
    const drawer = document.getElementById('ebk-drawer');
    if (overlay && drawer) {
      overlay.classList.add('ebk-open');
      drawer.classList.add('ebk-open');

      // Auto scroll to active topic
      setTimeout(() => {
        const activeLink = drawer.querySelector('.ebk-topic-link.ebk-active');
        if (activeLink) {
          activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        const searchInput = document.getElementById('ebk-drawer-search');
        if (searchInput && window.innerWidth > 768) {
          searchInput.focus();
        }
      }, 150);
    }
  }

  function closeDrawer() {
    const overlay = document.getElementById('ebk-drawer-overlay');
    const drawer = document.getElementById('ebk-drawer');
    if (overlay && drawer) {
      overlay.classList.remove('ebk-open');
      drawer.classList.remove('ebk-open');
    }
  }

  // Chapter Accordion Toggle inside Drawer
  window.ebkToggleChapter = function (chapId) {
    const list = document.getElementById(`ebk-topic-list-${chapId}`);
    if (list) {
      list.style.display = list.style.display === 'none' ? 'block' : 'none';
    }
  };

  // Toggle Topic Checkmark inside Drawer
  window.ebkToggleTopicCheck = function (checkbox, topicId) {
    const state = getProgressState();
    state[topicId] = checkbox.checked;
    setProgressState(state);

    // Update progress count
    let totalCompleted = 0;
    BOOK_CHAPTERS.forEach(ch => {
      ch.topics.forEach(t => {
        if (state[t.id]) totalCompleted++;
      });
    });
    const progressEl = document.getElementById('ebk-drawer-progress');
    if (progressEl) {
      progressEl.textContent = `${toBn(totalCompleted)} / ৩১`;
    }
  };

  // Theme Toggle Button
  function setupThemeToggle() {
    const btn = document.getElementById('ebk-theme-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      // Check if page already has its own toggleTheme function
      if (typeof window.toggleTheme === 'function') {
        window.toggleTheme();
        return;
      }

      // Default theme toggle
      const root = document.documentElement;
      const currentTheme = root.getAttribute('data-theme') || (document.body.classList.contains('dark') ? 'dark' : 'light');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      root.setAttribute('data-theme', nextTheme);
      if (nextTheme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }

      try {
        localStorage.setItem('theme', nextTheme);
      } catch (e) {}
    });
  }

  // Keyboard Shortcuts
  function setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Avoid if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        if (e.key === 'Escape') {
          closeDrawer();
        }
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

  // Initialize once DOM is ready
  function init() {
    // Avoid double injection
    if (document.getElementById('ebk-topbar')) return;

    renderTopBar();
    renderDrawer();
    renderBottomNav();
    renderFAB();
    setupThemeToggle();
    setupShortcuts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
