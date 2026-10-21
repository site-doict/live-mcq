/**
 * বাংলাদেশ বিষয়াবলি বিসিএস পূর্ণাঙ্গ প্রস্তুতি - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
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

  // 1. Ensure Noto Serif Bengali with display=swap is loaded for instant rendering
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
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(fontLink);
    }
  }
  ensureFontsLoaded();

  // 2. Data Definition: 5 Chapters, 31 Topics mapped to 30 files
  const BOOK_CHAPTERS = [
    {
      id: "ch-1",
      number: "১",
      title: "বাংলাদেশের জাতীয় বিষয়াবলি",
      pages: "পৃষ্ঠা ৪০১–৪৪৪",
      badgeColor: "#881337",
      topics: [
        { id: "t-1-1", title: "প্রাচীন কাল (ইতিহাস, জনপদ ও বিভিন্ন রাজবংশ)", pages: "পৃষ্ঠা ৪০১–৪০৭", file: "প্রাচীন কাল (ইতিহাস, জনপদ ও বিভিন্ন রাজবংশ).html" },
        { id: "t-1-2", title: "মধ্যযুগ (মুঘল, সুলতান ও নবাবী আমল)", pages: "পৃষ্ঠা ৪০৭–৪১৩", file: "মধ্যযুগ (মুঘল, সুলতান ও নবাবী আমল).html" },
        { id: "t-1-3", title: "ইউরোপীয়দের আগমন ও ব্রিটিশ শাসনামল", pages: "পৃষ্ঠা ৪১৪–৪২১", file: "ইউরোপীয়দের আগমন ও ব্রিটিশ শাসনামল.html" },
        { id: "t-1-4", title: "পাকিস্তান আমল ও ভাষা আন্দোলন", pages: "পৃষ্ঠা ৪২২–৪২৬", file: "পাকিস্তান আমল- ভাষা আন্দোলন.html" },
        { id: "t-1-5", title: "যুক্তফ্রন্ট নির্বাচন ও ১৯৫৬-এর শাসনতন্ত্র আন্দোলন", pages: "পৃষ্ঠা ৪২৬–৪২৭", file: "যুক্তফ্রন্ট নির্বাচন ও ১৯৫৬-এর শাসনতন্ত্র আন্দোলন.html" },
        { id: "t-1-6", title: "ছয় দফা আন্দোলন", pages: "পৃষ্ঠা ৪২৮–৪২৯", file: "ছয় দফা আন্দোলন.html" },
        { id: "t-1-7", title: "ঊনসত্তরের গণঅভ্যুত্থান থেকে মুক্তিযুদ্ধ", pages: "পৃষ্ঠা ৪৩০–৪৪৪", file: "মুক্তিযুদ্ধ_৪৩০-৪৪৪.html" }
      ]
    },
    {
      id: "ch-2",
      number: "২",
      title: "বাংলাদেশের কৃষিজ সম্পদ",
      pages: "পৃষ্ঠা ৪৪৫–৪৫৮",
      badgeColor: "#15803d",
      topics: [
        { id: "t-2-1", title: "কৃষিজ সম্পদ (ফসল, বন, প্রাণিসম্পদ, মৎস্যসম্পদ)", pages: "পৃষ্ঠা ৪৪৫–৪৫১", file: "কৃষিজ সম্পদ (ফসল, বন, প্রাণিসম্পদ, মৎস্যসম্পদ).html" },
        { id: "t-2-2", title: "ফসলের জাত", pages: "পৃষ্ঠা ৪৫০–৪৫৪", file: "ফসলের জাত.html" },
        { id: "t-2-3", title: "কৃষি সংশ্লিষ্ট প্রতিষ্ঠান", pages: "পৃষ্ঠা ৪৫৫–৪৫৬", file: "কৃষি সংশ্লিষ্ট প্রতিষ্ঠান.html" },
        { id: "t-2-4", title: "কৃষি সম্পদ (অন্যান্য বিষয়াদি)", pages: "পৃষ্ঠা ৪৫৭–৪৫৮", file: "কৃষি সম্পদ (অন্যান্য).html" }
      ]
    },
    {
      id: "ch-3",
      number: "৩",
      title: "বাংলাদেশের অর্থনীতি",
      pages: "পৃষ্ঠা ৪৫৯–৪৭২",
      badgeColor: "#b45309",
      topics: [
        { id: "t-3-1", title: "অর্থনৈতিক সমীক্ষা ও বাজেট", pages: "পৃষ্ঠা ৪৫৯–৪৬৩", file: "অর্থনৈতিক সমীক্ষা ও বাজেট.html" },
        { id: "t-3-2", title: "প্রেক্ষিত পরিকল্পনা ও পঞ্চবার্ষিক পরিকল্পনা", pages: "পৃষ্ঠা ৪৬৩–৪৬৪", file: "প্রেক্ষিত পরিকল্পনা ও পঞ্চবার্ষিক পরিকল্পনা.html" },
        { id: "t-3-3", title: "অর্থনীতি, রাজস্ব ও উন্নয়ন পরিকল্পনা", pages: "পৃষ্ঠা ৪৬৫–৪৭২", file: "বাংলাদেশ বিষয়াবলি- অর্থনীতি, রাজস্ব ও উন্নয়ন পরিকল্পনা.html" }
      ]
    },
    {
      id: "ch-4",
      number: "৪",
      title: "শিল্প, বাণিজ্য ও জনমিতিক বিষয়সমূহ",
      pages: "পৃষ্ঠা ৪৭৩–৪৯৪",
      badgeColor: "#0284c7",
      topics: [
        { id: "t-4-1", title: "বাংলাদেশের শিল্প ও বাণিজ্য শিল্প উৎপাদন", pages: "পৃষ্ঠা ৪৭৩–৪৭৭", file: "বাংলাদেশের শিল্প ও বাণিজ্য শিল্প উৎপাদন.html" },
        { id: "t-4-2", title: "শক্তি ও খনিজ সম্পদ", pages: "পৃষ্ঠা ৪৭৭–৪৭৯", file: "শক্তি ও খনিজ সম্পদ.html" },
        { id: "t-4-3", title: "পণ্য আমদানি ও রপ্তানি", pages: "পৃষ্ঠা ৪৭৯–৪৮২", file: "পণ্য আমদানি ও রপ্তানি.html" },
        { id: "t-4-4", title: "বৈদেশিক লেনদেন ও অর্থ প্রেরণ", pages: "পৃষ্ঠা ৪৮২–৪৮৩", file: "বৈদেশিক লেনদেন ও অর্থ প্রেরণ.html" },
        { id: "t-4-5", title: "বাংলাদেশের বাণিজ্য ও ব্যাংকিং ব্যবস্থা", pages: "পৃষ্ঠা ৪৮৪–৪৮৬", file: "বাংলাদেশের বাণিজ্য ও ব্যাংকিং ব্যবস্থা.html" },
        { id: "t-4-6", title: "জনমিতিক শুমারি ও জনসংখ্যা সংক্রান্ত", pages: "পৃষ্ঠা ৪৮৬–৪৮৯", file: "জনমিতিক শুমারি ও জনসংখ্যা সংক্রান্ত.html" },
        { id: "t-4-7", title: "ক্ষুদ্র নৃগোষ্ঠী", pages: "পৃষ্ঠা ৪৮৯–৪৯৩", file: "ক্ষুদ্র নৃগোষ্ঠী.html" },
        { id: "t-4-8", title: "উচ্চশিক্ষা ও স্বাস্থ্যসেবা প্রতিষ্ঠান", pages: "পৃষ্ঠা ৪৯৩–৪৯৪", file: "উচ্চশিক্ষা ও স্বাস্থ্যসেবা প্রতিষ্ঠান.html" }
      ]
    },
    {
      id: "ch-5",
      number: "৫",
      title: "সংবিধান, রাজনীতি ও সরকার ব্যবস্থা",
      pages: "পৃষ্ঠা ৪৯৫–৫২৬",
      badgeColor: "#7c3aed",
      topics: [
        { id: "t-5-1", title: "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান", pages: "পৃষ্ঠা ৪৯৫–৫১০", file: "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান.html" },
        { id: "t-5-2", title: "বাংলাদেশের রাজনৈতিক ব্যবস্থা", pages: "পৃষ্ঠা ৫১০–৫১৩", file: "বাংলাদেশের রাজনৈতিক ব্যবস্থা.html" },
        { id: "t-5-3", title: "বাংলাদেশের সরকার ব্যবস্থা", pages: "পৃষ্ঠা ৫১৪–৫২৬", file: "বাংলাদেশের সরকার ব্যবস্থা.html" }
      ]
    },
    {
      id: "ch-6",
      number: "৬",
      title: "বাংলাদেশের জাতীয় অর্জন ও অন্যান্য",
      pages: "পৃষ্ঠা ৫২৭–৫৬৪",
      badgeColor: "#c026d3",
      topics: [
        { id: "t-6-1", title: "বাংলাদেশের জাতীয় অর্জন ও অন্যান্য", pages: "পৃষ্ঠা ৫২৭–৫৩৮", file: "বাংলাদেশের_জাতীয়_অর্জন_ও_অন্যান্য.html" },
        { id: "t-6-2", title: "খেলাধুলা", pages: "পৃষ্ঠা ৫৩৮–৫৪০", file: "খেলাধুলা.html" },
        { id: "t-6-3", title: "যোগাযোগ ব্যবস্থা", pages: "পৃষ্ঠা ৫৪০–৫৪৪", file: "যোগাযোগ ব্যবস্থা.html" },
        { id: "t-6-4", title: "ভৌগোলিক বিষয়াদি", pages: "পৃষ্ঠা ৫৪৫–৫৫৬", file: "ভৌগোলিক_বিষয়াদি_পৃ৫৪৫-৫৫৬_ফাইনাল.html" },
        { id: "t-6-5", title: "সংস্কৃতি ও গণমাধ্যম", pages: "পৃষ্ঠা ৫৫৭–৫৬১", file: "সংস্কৃতি ও গণমাধ্যম.html" },
        { id: "t-6-6", title: "বাংলাদেশের ভাস্কর্য ও স্মারক স্থাপত্য", pages: "পৃষ্ঠা ৫৬২–৫৬৪", file: "বাংলাদেশের ভাস্কর্য ও স্মারক স্থাপত্য.html" }
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
  const STORAGE_KEY = 'bangladesh_affairs_progress_data_v1';
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

  // 3. Inject CSS Styles with Mobile Optimizations
  const css = `
    /* ══════ Smart E-Book Mobile & Responsive Engine ══════ */
    :root {
      --ebk-primary: #881337;
      --ebk-primary-hover: #9f1239;
      --ebk-accent: #d97706;
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
      --ebk-primary: #fb7185;
      --ebk-primary-hover: #f43f5e;
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
      font-family: 'Noto Serif Bengali', serif, system-ui, sans-serif;
      box-sizing: border-box;
      transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease;
    }

    /* Class for hiding topbar on mobile scroll down */
    .ebk-topbar.ebk-topbar-hidden {
      transform: translateY(-100%);
    }

    .ebk-topbar * {
      box-sizing: border-box;
    }

    .ebk-bar-left, .ebk-bar-right {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
    }

    .ebk-bar-center {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-width: 0;
      padding: 0 6px;
      text-align: center;
    }

    .ebk-cur-title {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--ebk-text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 440px;
    }

    .ebk-cur-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      background: rgba(136, 19, 55, 0.12);
      color: var(--ebk-primary);
      border-radius: 999px;
      border: 1px solid rgba(136, 19, 55, 0.2);
      white-space: nowrap;
    }

    /* Touch-Optimized Action Buttons */
    .ebk-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      height: 38px;
      padding: 0 11px;
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
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }

    .ebk-btn:hover {
      background: var(--ebk-card-bg);
      border-color: var(--ebk-primary);
      color: var(--ebk-primary);
    }

    .ebk-btn:active {
      transform: scale(0.96);
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
      width: 38px;
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
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 99995;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.28s ease, visibility 0.28s ease;
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
      width: 350px;
      max-width: 88vw;
      background: var(--ebk-bg-drawer);
      color: var(--ebk-text-main);
      z-index: 99999;
      box-shadow: var(--ebk-shadow-lg);
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      font-family: 'Noto Serif Bengali', serif, system-ui, sans-serif;
      padding-top: env(safe-area-inset-top, 0px);
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }

    .ebk-drawer.ebk-open {
      transform: translateX(0);
    }

    .ebk-drawer-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--ebk-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--ebk-card-bg);
    }

    .ebk-drawer-title {
      font-size: 16px;
      font-weight: 800;
      color: var(--ebk-primary);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .ebk-drawer-close {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid var(--ebk-border);
      background: transparent;
      color: var(--ebk-text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      touch-action: manipulation;
    }

    .ebk-drawer-close:active {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }

    /* Font Size Controls & Search in Drawer */
    .ebk-drawer-toolbar {
      padding: 10px 14px;
      border-bottom: 1px solid var(--ebk-border);
      background: var(--ebk-bg-drawer);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .ebk-fontsize-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 6px;
      background: var(--ebk-card-bg);
      border-radius: 8px;
      border: 1px solid var(--ebk-border);
    }

    .ebk-fs-btn {
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 6px;
      border: 1px solid var(--ebk-border);
      background: var(--ebk-bg-drawer);
      color: var(--ebk-text-main);
      cursor: pointer;
      touch-action: manipulation;
    }

    .ebk-fs-btn:active {
      background: var(--ebk-primary);
      color: #fff;
    }

    .ebk-search-wrap {
      position: relative;
      width: 100%;
    }

    .ebk-search-input {
      width: 100%;
      padding: 8px 12px 8px 34px;
      border-radius: 8px;
      border: 1px solid var(--ebk-border);
      background: var(--ebk-card-bg);
      color: var(--ebk-text-main);
      font-size: 13px;
      font-family: inherit;
      outline: none;
      box-sizing: border-box;
    }

    .ebk-search-input:focus {
      border-color: var(--ebk-primary);
      box-shadow: 0 0 0 3px rgba(136, 19, 55, 0.15);
    }

    .ebk-search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--ebk-text-muted);
      pointer-events: none;
    }

    .ebk-drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 10px 12px;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;
    }

    /* Chapter Accordion in Drawer */
    .ebk-chap-box {
      margin-bottom: 8px;
      border: 1px solid var(--ebk-border);
      border-radius: 9px;
      overflow: hidden;
      background: var(--ebk-card-bg);
    }

    .ebk-chap-header {
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      font-weight: 700;
      font-size: 13px;
      color: var(--ebk-text-main);
      touch-action: manipulation;
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
      font-size: 11.5px;
      font-weight: 800;
      margin-right: 6px;
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

    .ebk-topic-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 10px;
      color: var(--ebk-text-main);
      text-decoration: none;
      font-size: 12.5px;
      gap: 7px;
      touch-action: manipulation;
    }

    .ebk-topic-link.ebk-active {
      background: rgba(136, 19, 55, 0.14);
      color: var(--ebk-primary);
      font-weight: 700;
      border-left: 4px solid var(--ebk-primary);
    }

    .ebk-topic-check {
      cursor: pointer;
      accent-color: var(--ebk-primary);
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .ebk-topic-title-span {
      flex: 1;
      min-width: 0;
      white-space: normal;
      line-height: 1.35;
    }

    .ebk-topic-page {
      font-size: 10px;
      color: var(--ebk-text-muted);
      background: var(--ebk-card-bg);
      padding: 1px 5px;
      border-radius: 4px;
      border: 1px solid var(--ebk-border);
      white-space: nowrap;
    }

    .ebk-drawer-footer {
      padding: 10px 14px;
      border-top: 1px solid var(--ebk-border);
      background: var(--ebk-card-bg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    /* Bottom Page-to-Page Navigator */
    .ebk-bottom-nav {
      margin: 40px auto 20px auto;
      max-width: 860px;
      padding: 14px;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 10px;
      align-items: center;
      font-family: 'Noto Serif Bengali', serif, system-ui, sans-serif;
      box-sizing: border-box;
    }

    .ebk-nav-card {
      display: flex;
      flex-direction: column;
      padding: 11px 14px;
      border-radius: 10px;
      border: 1px solid var(--ebk-border);
      background: var(--ebk-card-bg);
      text-decoration: none;
      color: var(--ebk-text-main);
      transition: all 0.2s ease;
      box-shadow: var(--ebk-shadow);
    }

    .ebk-nav-card-dir {
      font-size: 10.5px;
      font-weight: 700;
      color: var(--ebk-primary);
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .ebk-nav-card-title {
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ebk-nav-card.ebk-prev { text-align: left; }
    .ebk-nav-card.ebk-next { text-align: right; }

    .ebk-bottom-home-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: var(--ebk-card-bg);
      border: 1px solid var(--ebk-border);
      color: var(--ebk-text-main);
      text-decoration: none;
      font-size: 17px;
    }

    /* Floating Quick Action Button */
    .ebk-fab {
      position: fixed;
      bottom: calc(18px + env(safe-area-inset-bottom, 0px));
      left: calc(16px + env(safe-area-inset-left, 0px));
      z-index: 99980;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 9px 15px;
      border-radius: 999px;
      background: var(--ebk-primary);
      color: #ffffff;
      box-shadow: 0 4px 18px rgba(136, 19, 55, 0.4);
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 12.5px;
      font-weight: 700;
      font-family: 'Noto Serif Bengali', serif, sans-serif;
      touch-action: manipulation;
      user-select: none;
    }

    /* Responsive Tables: ensure no table breaks viewport on mobile */
    .table-wrapper, .table-responsive, .sc, .table-container {
      width: 100% !important;
      max-width: 100% !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      touch-action: pan-x pan-y;
      margin-bottom: 1rem;
      border-radius: 8px;
    }

    /* Mobile Phone Screen Layout (Samsung Galaxy A23 ~384px-412px) */
    @media (max-width: 768px) {
      .ebk-topbar {
        padding-left: 8px;
        padding-right: 8px;
        height: 48px;
      }
      .ebk-cur-title {
        max-width: 140px;
        font-size: 12.5px;
      }
      .ebk-cur-badge {
        display: none;
      }
      .ebk-btn-text {
        display: none;
      }
      .ebk-btn {
        width: 34px;
        height: 34px;
        padding: 0;
      }
      .ebk-bottom-nav {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .ebk-nav-card.ebk-next {
        text-align: left;
      }
      .ebk-fab {
        padding: 8px 13px;
        font-size: 12px;
      }

      /* 1. Header & Controls: prevent button overflow, slim height */
      .top-control-bar, .control-bar {
        position: relative !important;
        top: 0 !important;
        padding: 6px 8px !important;
        gap: 6px !important;
      }
      .brand-badge {
        font-size: 0.8rem !important;
        max-width: 120px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      .controls, .control-group {
        gap: 4px !important;
        display: flex !important;
        align-items: center !important;
      }
      .ctrl-btn, .btn-ctrl {
        padding: 4px 7px !important;
        font-size: 0.78rem !important;
        border-radius: 6px !important;
      }
      .print-btn, .ctrl-btn[onclick*="print"], .btn-ctrl[onclick*="print"] {
        display: none !important;
      }

      /* 2. Container & Lateral Space: eliminate ~120px wasted empty margins */
      .container {
        padding-left: 8px !important;
        padding-right: 8px !important;
        padding-top: 6px !important;
        padding-bottom: 24px !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      .study-section, .section {
        padding: 14px 10px !important;
        margin-top: 16px !important;
        margin-bottom: 14px !important;
        border-radius: 12px !important;
      }
      .card, .author-card, .bcs-card, .fact-item, .info-box, .rule-card {
        padding: 12px 10px !important;
        margin-bottom: 10px !important;
        border-radius: 10px !important;
      }
      .section-header {
        padding-bottom: 8px !important;
        margin-bottom: 12px !important;
        gap: 8px !important;
      }
      .section-title {
        font-size: 1.25rem !important;
        line-height: 1.35 !important;
      }
      .section-icon {
        width: 32px !important;
        height: 32px !important;
        font-size: 16px !important;
      }
      .card-grid {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
        margin-bottom: 14px !important;
      }

      /* 3. Hero Banner & Study Flow: slim down vertical space by 60% */
      .hero, .hero-banner {
        padding: 16px 12px !important;
        margin-top: 8px !important;
        margin-bottom: 14px !important;
        border-radius: 12px !important;
      }
      .hero h1, .hero-banner h1, .hero-title {
        font-size: 1.35rem !important;
        line-height: 1.3 !important;
        margin-bottom: 6px !important;
      }
      .hero p, .hero-banner p, .hero-subtitle {
        font-size: 0.88rem !important;
        line-height: 1.45 !important;
        margin-bottom: 8px !important;
      }
      .bcs-stat-grid, .bcs-matrix {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 6px !important;
        margin-top: 8px !important;
      }
      .stat-chip, .bcs-cell {
        padding: 6px 8px !important;
        font-size: 0.78rem !important;
      }
      .stat-chip strong, .bcs-cell strong {
        font-size: 1.05rem !important;
      }
      .study-flow, .study-steps {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 6px !important;
        margin: 10px 0 !important;
      }
      .flow-step, .step-box {
        padding: 8px 10px !important;
        font-size: 0.82rem !important;
      }
      .flow-step h4, .step-box strong {
        font-size: 0.86rem !important;
        margin-bottom: 2px !important;
      }
      .flow-step p, .step-box p {
        font-size: 0.78rem !important;
        line-height: 1.35 !important;
      }

      /* 4. Tables, Callouts, Quizzes & Quotes */
      table th, table td {
        padding: 7px 6px !important;
        font-size: 0.84rem !important;
        line-height: 1.4 !important;
      }
      .options-grid, .quiz-options {
        grid-template-columns: 1fr !important;
        gap: 8px !important;
      }
      .opt-btn {
        padding: 8px 10px !important;
        font-size: 0.88rem !important;
      }
      .quote-card, .quote-box, .doubt-box, .alert-box, .fact-card {
        padding: 10px 10px !important;
        margin: 10px 0 !important;
        font-size: 0.88rem !important;
      }
    }

    @media print {
      .ebk-topbar, .ebk-drawer, .ebk-drawer-overlay, .ebk-bottom-nav, .ebk-fab, .ebk-scroll-progress-bar {
        display: none !important;
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
          <span class="ebk-cur-title">বাংলাদেশ বিষয়াবলি পূর্ণাঙ্গ ইবুক</span>
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
          <span>🇧🇩</span> সূচিপত্র ও পাঠ তালিকা
        </h3>
        <button class="ebk-drawer-close" id="ebk-drawer-close-btn" title="বন্ধ করুন (Esc)">✕</button>
      </div>

      <!-- Subject Switcher -->
      <div style="padding: 8px 14px; background: rgba(136, 19, 55, 0.08); border-bottom: 1px solid var(--ebk-border); font-size: 12px; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-weight: 700; color: var(--ebk-primary);">বিষয় পরিবর্তন:</span>
        <select onchange="if(this.value!=='current') window.location.href=this.value;" style="padding: 3px 6px; border-radius: 6px; border: 1px solid var(--ebk-border); background: var(--ebk-card-bg); color: var(--ebk-text-main); font-family: inherit; font-size: 12px; cursor: pointer;">
          <option value="current" selected>🇧🇩 বাংলাদেশ বিষয়াবলি</option>
          <option value="../Live MCQ Bangla Literature/index.html">📚 বাংলা সাহিত্য</option>
          <option value="../index.html">🏛️ মাস্টার লাইব্রেরি পোর্টাল</option>
        </select>
      </div>

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
          অগ্রগতি: <span id="ebk-drawer-progress">${toBn(totalCompleted)} / ${toBn(READING_FILES.length)}</span>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    overlay.addEventListener('click', closeDrawer);
    document.getElementById('ebk-drawer-close-btn').addEventListener('click', closeDrawer);
    document.getElementById('ebk-open-drawer-btn').addEventListener('click', openDrawer);

    const searchInput = document.getElementById('ebk-drawer-search');
    searchInput.addEventListener('input', function (e) {
      const q = e.target.value.trim().toLowerCase();
      const items = drawer.querySelectorAll('.ebk-topic-item');
      items.forEach(item => {
        const title = item.getAttribute('data-title') || '';
        item.style.display = (!q || title.includes(q)) ? 'block' : 'none';
      });
    });
  }

  // 7. Render Bottom Page-to-Page Navigator
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

  // 8. Floating Action Button (FAB)
  function renderFAB() {
    const fab = document.createElement('button');
    fab.className = 'ebk-fab';
    fab.id = 'ebk-fab';
    fab.setAttribute('title', 'সূচিপত্র খুলুন (M)');
    fab.innerHTML = `
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
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

      setTimeout(() => {
        const activeLink = drawer.querySelector('.ebk-topic-link.ebk-active');
        if (activeLink) {
          activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    let totalCompleted = 0;
    BOOK_CHAPTERS.forEach(ch => {
      ch.topics.forEach(t => {
        if (state[t.id]) totalCompleted++;
      });
    });
    const progressEl = document.getElementById('ebk-drawer-progress');
    if (progressEl) {
      progressEl.textContent = `${toBn(totalCompleted)} / ${toBn(READING_FILES.length)}`;
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

    // 1. Scale document root so ALL rem units scale proportionally
    document.documentElement.style.fontSize = (currentFontScale * 100) + '%';
    document.documentElement.style.setProperty('--font-scale', currentFontScale);

    // 2. High specificity fallback rule in head
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

    // 3. Update drawer indicator if present
    const indicator = document.getElementById('ebk-font-indicator');
    if (indicator) {
      indicator.textContent = Math.round(currentFontScale * 100) + '%';
    }
  }

  // Unified global button handlers - connect all buttons on all pages!
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

  // Immediately apply saved font scale on page load
  applyFontScale(currentFontScale);

  // Theme Toggle Button
  function setupThemeToggle() {
    const btn = document.getElementById('ebk-theme-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (typeof window.toggleTheme === 'function') {
        window.toggleTheme();
        return;
      }

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
        localStorage.setItem('bd_affairs_theme', nextTheme);
      } catch (e) {}
    });
  }

  // Scroll Behaviors: Progress Bar + Mobile Topbar Auto-Hide
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

          // Update Progress Bar
          if (progressBar && docHeight > 0) {
            const pct = Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100));
            progressBar.style.width = pct + '%';
          }

          // Mobile topbar auto-hide on scroll down, reveal on scroll up
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

  // Initialize once DOM is ready
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
