/**
 * পিএসসি নন-ক্যাডার বীজগণিত - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
 * Smart E-Book Navigation Component for Mobile & Desktop
 * 
 * Features:
 * - Dynamic Fast Font Loading with display=swap
 * - Top Reading Progress Bar (Slim gradient indicator)
 * - Safe-area Inset & Mobile Drawer with live chapter search
 * - 12 Chapters with exact physical question badges & page ranges
 * - Subject switcher to other portals
 * - Active chapter highlighting & completion tracking
 */

(function () {
  'use strict';

  // 1. Ensure Noto Serif Bengali and Inter fonts are loaded
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
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(fontLink);
    }
  }
  ensureFontsLoaded();

  // 2. Data Definition: 12 Chapters of Non-Cadre Algebra (বীজগণিত)
  const ALGEBRA_CHAPTERS = [
    {
      id: "ch-01",
      number: "০১",
      title: "বীজগাণিতিক রাশিমালা, যোগ-বিয়োগ ও সরলীকরণ",
      titleEn: "Algebraic Expressions, Operations & Simplification",
      pages: "পৃষ্ঠা ৩১৮–৩৩৮",
      questions: "১৫১টি MCQ (সম্পূর্ণ)",
      qCount: 151,
      completed: true,
      badgeColor: "#0284c7",
      file: "ch-01-expressions.html"
    },
    {
      id: "ch-02",
      number: "০২",
      title: "মান নির্ণয় ও বীজগাণিতিক সূত্রাবলি",
      titleEn: "Algebraic Formulae & Value Finding",
      pages: "পৃষ্ঠা ৩৩৮–৩৫৭",
      questions: "১১৫টি MCQ (সম্পূর্ণ)",
      qCount: 115,
      completed: true,
      badgeColor: "#0d9488",
      file: "ch-02-formulas.html"
    },
    {
      id: "ch-03",
      number: "০৩",
      title: "বহুপদী উৎপাদক ও উৎপাদকের বিশ্লেষণ",
      titleEn: "Polynomial Factorization",
      pages: "পৃষ্ঠা ৩৫৭–৩৬২",
      questions: "৪৭টি MCQ (সম্পূর্ণ)",
      qCount: 47,
      completed: true,
      badgeColor: "#16a34a",
      file: "ch-03-factors.html"
    },
    {
      id: "ch-04",
      number: "০৪",
      title: "ল.সা.গু ও গ.সা.গু",
      titleEn: "HCF & LCM of Algebraic Expressions",
      pages: "পৃষ্ঠা ৩৬২–৩৬৪",
      questions: "১১টি MCQ (সম্পূর্ণ)",
      qCount: 11,
      completed: true,
      badgeColor: "#7c3aed",
      file: "ch-04-hcf-lcm.html"
    },
    {
      id: "ch-05",
      number: "০৫",
      title: "ফাংশন",
      titleEn: "Functions & Relations",
      pages: "পৃষ্ঠা ৩৬৪–৩৬৫",
      questions: "১২টি MCQ (সম্পূর্ণ)",
      qCount: 12,
      completed: true,
      badgeColor: "#0284c7",
      file: "ch-05-functions.html"
    },
    {
      id: "ch-06",
      number: "০৬",
      title: "সমীকরণ ও অসমতা",
      titleEn: "Equations & Inequalities",
      pages: "পৃষ্ঠা ৩৬৫–৩৯২",
      questions: "১২৬টি MCQ (সম্পূর্ণ)",
      qCount: 126,
      completed: true,
      badgeColor: "#4f46e5",
      file: "ch-06-equations.html"
    },
    {
      id: "ch-07",
      number: "০৭",
      title: "সূচক",
      titleEn: "Exponents & Indices",
      pages: "পৃষ্ঠা ৩৯৩–৪০৩",
      questions: "৮৩টি MCQ (সম্পূর্ণ)",
      qCount: 83,
      completed: true,
      badgeColor: "#92400e",
      file: "ch-07-exponents.html"
    },
    {
      id: "ch-08",
      number: "০৮",
      title: "লগারিদম",
      titleEn: "Logarithms",
      pages: "পৃষ্ঠা ৪০৬–৪১১",
      questions: "৪০+ MCQ",
      qCount: 40,
      completed: false,
      badgeColor: "#0891b2",
      file: "ch-08-logarithms.html"
    },
    {
      id: "ch-09",
      number: "০৯",
      title: "সমান্তর ও গুণোত্তর অনুক্রম ও ধারা",
      titleEn: "Arithmetic & Geometric Sequences & Series",
      pages: "পৃষ্ঠা ৪১২–৪২০",
      questions: "৫০+ MCQ",
      qCount: 50,
      completed: false,
      badgeColor: "#4f46e5",
      file: "ch-09-sequences-series.html"
    },
    {
      id: "ch-10",
      number: "১০",
      title: "সেট",
      titleEn: "Set Theory",
      pages: "পৃষ্ঠা ৪২০–৪২৭",
      questions: "৩৫+ MCQ",
      qCount: 35,
      completed: false,
      badgeColor: "#ca8a04",
      file: "ch-10-sets.html"
    },
    {
      id: "ch-11",
      number: "১১",
      title: "বিন্যাস ও সমাবেশ",
      titleEn: "Permutations & Combinations",
      pages: "পৃষ্ঠা ৪২৮–৪৩৫",
      questions: "৪৫+ MCQ",
      qCount: 45,
      completed: false,
      badgeColor: "#b45309",
      file: "ch-11-permutations-combinations.html"
    },
    {
      id: "ch-12",
      number: "১২",
      title: "সম্ভাব্যতা",
      titleEn: "Probability",
      pages: "পৃষ্ঠা ৪৩৬–৪৪২",
      questions: "৩০+ MCQ",
      qCount: 30,
      completed: false,
      badgeColor: "#9333ea",
      file: "ch-12-probability.html"
    }
  ];

  // 3. Inject Slim Reading Progress Bar at the top of the window
  const progressBar = document.createElement('div');
  progressBar.id = 'readingProgressBar';
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3.5px;width:0%;background:linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);z-index:99999;transition:width 0.1s ease;pointer-events:none;';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function () {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }
  }, { passive: true });

  // 4. Floating Quick Chapter Switcher Bar
  const currentPath = window.location.pathname.split('/').pop();
  const currentIndex = ALGEBRA_CHAPTERS.findIndex(c => c.file === currentPath);

  const prevCh = currentIndex > 0 ? ALGEBRA_CHAPTERS[currentIndex - 1] : null;
  const nextCh = currentIndex >= 0 && currentIndex < ALGEBRA_CHAPTERS.length - 1 ? ALGEBRA_CHAPTERS[currentIndex + 1] : null;

  const quickBar = document.createElement('nav');
  quickBar.className = 'quick-nav-bar';
  quickBar.setAttribute('aria-label', 'অধ্যায় ন্যাভিগেশন বার');
  quickBar.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:8px 18px;border-radius:30px;box-shadow:0 8px 24px rgba(0,0,0,0.12);border:1px solid rgba(226,232,240,0.85);z-index:9000;font-family:var(--font-base, "Noto Serif Bengali", serif);';

  // Dark mode awareness for quickBar
  function updateQuickBarTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.classList.contains('dark');
    if (isDark) {
      quickBar.style.background = 'rgba(30, 41, 59, 0.92)';
      quickBar.style.borderColor = 'rgba(51, 65, 85, 0.85)';
      quickBar.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
    } else {
      quickBar.style.background = 'rgba(255,255,255,0.92)';
      quickBar.style.borderColor = 'rgba(226,232,240,0.85)';
      quickBar.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    }
  }
  updateQuickBarTheme();
  const themeObserver = new MutationObserver(updateQuickBarTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });

  let barHtml = '';
  if (prevCh) {
    barHtml += `<a href="${prevCh.file}" class="qb-btn qb-prev" style="color:var(--primary, #6366f1);text-decoration:none;font-weight:700;font-size:0.86rem;display:flex;align-items:center;gap:4px;" title="পূর্ববর্তী অধ্যায়: ${prevCh.title}"><span>←</span> <span>পূর্ববর্তী</span></a>`;
  } else {
    barHtml += `<span style="opacity:0.35;font-size:0.86rem;font-weight:700;">← পূর্ববর্তী</span>`;
  }

  barHtml += `<span style="color:var(--border-color, #cbd5e1);margin:0 4px;">|</span>`;
  barHtml += `<a href="index.html" class="qb-btn qb-index" style="color:var(--text-main, #0f172a);text-decoration:none;font-weight:700;font-size:0.88rem;display:flex;align-items:center;gap:4px;" title="সূচিপত্র"><span>📑</span> <span>সূচিপত্র (${currentIndex + 1}/${ALGEBRA_CHAPTERS.length})</span></a>`;
  barHtml += `<span style="color:var(--border-color, #cbd5e1);margin:0 4px;">|</span>`;

  if (nextCh) {
    barHtml += `<a href="${nextCh.file}" class="qb-btn qb-next" style="color:var(--primary, #6366f1);text-decoration:none;font-weight:700;font-size:0.86rem;display:flex;align-items:center;gap:4px;" title="পরবর্তী অধ্যায়: ${nextCh.title}"><span>পরবর্তী</span> <span>→</span></a>`;
  } else {
    barHtml += `<span style="opacity:0.35;font-size:0.86rem;font-weight:700;">পরবর্তী →</span>`;
  }

  quickBar.innerHTML = barHtml;
  document.body.appendChild(quickBar);

  // 5. Subject Dropdown Options Population
  const subjectSelects = document.querySelectorAll('.subject-select, .subject-nav-select');
  const SUBJECTS = [
    { name: "✍️ বাংলা ভাষা ও ব্যাকরণ (ক্যাডার)", url: "../Live MCQ Bangla Language/index.html" },
    { name: "📚 বাংলা সাহিত্য (ক্যাডার)", url: "../Live MCQ Bangla Literature/index.html" },
    { name: "🔤 English Grammar (ক্যাডার)", url: "../Live MCQ English Grammar/index.html" },
    { name: "🎭 English Literature (ক্যাডার)", url: "../Live MCQ English Literature/index.html" },
    { name: "🇧🇩 বাংলাদেশ বিষয়াবলি (ক্যাডার)", url: "../Live MCQ Bangladesh/index.html" },
    { name: "🌐 আন্তর্জাতিক বিষয়াবলি (ক্যাডার)", url: "../Live MCQ International/index.html" },
    { name: "🗺️ ভূগোল ও দুর্যোগ ব্যবস্থাপনা (ক্যাডার)", url: "../Live MCQ Geography/index.html" },
    { name: "🔬 সাধারণ বিজ্ঞান (ক্যাডার)", url: "../Live MCQ General Science/index.html" },
    { name: "💻 কম্পিউটার ও তথ্য প্রযুক্তি (ক্যাডার)", url: "../Live MCQ Computer & IT/index.html" },
    { name: "📐 গাণিতিক যুক্তি (ক্যাডার)", url: "../Live MCQ Mathematical Reasoning/index.html" },
    { name: "🧩 মানসিক দক্ষতা (ক্যাডার)", url: "../Live MCQ Mental Ability/index.html" },
    { name: "⚖️ নৈতিকতা ও সুশাসন (ক্যাডার)", url: "../Live MCQ Ethics & Good Governance/index.html" },
    { name: "📖 নন-ক্যাডার বাংলা সাহিত্য", url: "../Non Cadre Bangla Literature/index.html" },
    { name: "📖 নন-ক্যাডার বাংলা ব্যাকরণ", url: "../Non Cadre Bangla Grammar/index.html" },
    { name: "📖 নন-ক্যাডার English", url: "../Non Cadre English/index.html" },
    { name: "🔬 নন-ক্যাডার সাধারণ বিজ্ঞান", url: "../Non Cadre General Science/index.html" },
    { name: "🇧🇩 নন-ক্যাডার বাংলাদেশ বিষয়াবলি", url: "../Non Cadre Bangladesh/index.html" },
    { name: "🌐 নন-ক্যাডার আন্তর্জাতিক বিষয়াবলি", url: "../Non Cadre International/index.html" },
    { name: "🔢 নন-ক্যাডার পাটিগণিত", url: "../Non Cadre Arithmetic/index.html" },
    { name: "📐 নন-ক্যাডার বীজগণিত (বর্তমান)", url: "index.html", current: true },
    { name: "🏛️ মাস্টার লাইব্রেরি পোর্টাল", url: "../index.html" }
  ];

  subjectSelects.forEach(sel => {
    sel.innerHTML = '';
    SUBJECTS.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.url;
      opt.textContent = sub.name;
      if (sub.current) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', function () {
      if (this.value) window.location.href = this.value;
    });
  });

  window.ALGEBRA_CHAPTERS = ALGEBRA_CHAPTERS;
})();
