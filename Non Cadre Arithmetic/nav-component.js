/**
 * পিএসসি নন-ক্যাডার পাটিগণিত - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
 * Smart E-Book Navigation Component for Mobile & Desktop
 * 
 * Features:
 * - Dynamic Fast Font Loading with display=swap
 * - Top Reading Progress Bar (Slim gradient indicator)
 * - Safe-area Inset & Mobile Drawer with live chapter search
 * - 13 Chapters with exact physical question badges & page ranges
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

  // 2. Data Definition: 13 Chapters of Non-Cadre Arithmetic
  const ARITHMETIC_CHAPTERS = [
    {
      id: "ch-01",
      number: "০১",
      title: "বাস্তব সংখ্যা ও প্রাথমিক আলোচনা",
      titleEn: "Real Numbers & Basic Arithmetic Concepts",
      pages: "পৃষ্ঠা ২২৮–২৪১",
      questions: "১০৭টি MCQ (সম্পূর্ণ)",
      qCount: 107,
      completed: true,
      badgeColor: "#0284c7",
      file: "ch-01-real-numbers.html"
    },
    {
      id: "ch-02",
      number: "০২",
      title: "গ.সা.গু ও ল.সা.গু",
      titleEn: "HCF & LCM",
      pages: "পৃষ্ঠা ২৪১–২৫০",
      questions: "৬৩টি MCQ (সম্পূর্ণ)",
      qCount: 63,
      completed: true,
      badgeColor: "#059669",
      file: "ch-02-hcf-lcm.html"
    },
    {
      id: "ch-03",
      number: "০৩",
      title: "ভগ্নাংশ ও দশমিক সংখ্যা",
      titleEn: "Fractions & Decimals",
      pages: "পৃষ্ঠা ২৫০–২৬০",
      questions: "৭৫টি MCQ (সম্পূর্ণ)",
      qCount: 75,
      completed: true,
      badgeColor: "#16a34a",
      file: "ch-03-fractions-decimals.html"
    },
    {
      id: "ch-04",
      number: "০৪",
      title: "বর্গ, বর্গমূল, ঘন ও ঘনমূল",
      titleEn: "Squares, Square Roots & Cube Roots",
      pages: "পৃষ্ঠা ২৬০–২৬২",
      questions: "১৩টি MCQ (সম্পূর্ণ)",
      qCount: 13,
      completed: true,
      badgeColor: "#7c3aed",
      file: "ch-04-square-roots.html"
    },
    {
      id: "ch-05",
      number: "০৫",
      title: "ঐকিক নিয়ম",
      titleEn: "Unitary Method",
      pages: "পৃষ্ঠা ২৬২–২৬৪",
      questions: "১৫টি MCQ (সম্পূর্ণ)",
      qCount: 15,
      completed: true,
      badgeColor: "#d97706",
      file: "ch-05-unitary-method.html"
    },
    {
      id: "ch-06",
      number: "০৬",
      title: "সময় ও কাজ, নল ও চৌবাচ্চা",
      titleEn: "Time & Work, Pipes & Cisterns",
      pages: "পৃষ্ঠা ২৬৪–২৬৮",
      questions: "২৮টি MCQ (সম্পূর্ণ)",
      qCount: 28,
      completed: true,
      badgeColor: "#0284c7",
      file: "ch-06-time-work-pipes.html"
    },
    {
      id: "ch-07",
      number: "০৭",
      title: "গতিবেগ, দূরত্ব, ট্রেন ও নৌকা-স্রোত",
      titleEn: "Speed, Distance, Trains & Boats-Streams",
      pages: "পৃষ্ঠা ২৬৮–২৭০",
      questions: "৭টি MCQ (সম্পূর্ণ)",
      qCount: 7,
      completed: true,
      badgeColor: "#92400e",
      file: "ch-07-speed-distance-trains.html"
    },
    {
      id: "ch-08",
      number: "০৮",
      title: "গড়",
      titleEn: "Average",
      pages: "পৃষ্ঠা ২৭০–২৭৪",
      questions: "৩১টি MCQ (সম্পূর্ণ)",
      qCount: 31,
      completed: true,
      badgeColor: "#0891b2",
      file: "ch-08-average.html"
    },
    {
      id: "ch-09",
      number: "০৯",
      title: "অনুপাত, সমানুপাত, মিশ্রণ ও বয়স",
      titleEn: "Ratio, Proportion, Mixture & Age",
      pages: "পৃষ্ঠা ২৭৪–২৮৩",
      questions: "৬৬টি MCQ (সম্পূর্ণ)",
      qCount: 66,
      completed: true,
      badgeColor: "#4f46e5",
      file: "ch-09-ratio-proportion.html"
    },
    {
      id: "ch-10",
      number: "১০",
      title: "শতকরা",
      titleEn: "Percentage",
      pages: "পৃষ্ঠা ২৮২–২৯৪",
      questions: "৭৭টি MCQ (সম্পূর্ণ)",
      qCount: 77,
      completed: true,
      badgeColor: "#ca8a04",
      file: "ch-10-percentage.html"
    },
    {
      id: "ch-11",
      number: "১১",
      title: "সরল ও যৌগিক মুনাফা (সুদকষা)",
      titleEn: "Simple & Compound Interest",
      pages: "পৃষ্ঠা ২৯৫–৩০৩",
      questions: "৫২টি MCQ (সম্পূর্ণ)",
      qCount: 52,
      completed: true,
      badgeColor: "#b45309",
      file: "ch-11-interest.html"
    },
    {
      id: "ch-12",
      number: "১২",
      title: "লাভ ও ক্ষতি",
      titleEn: "Profit & Loss",
      pages: "পৃষ্ঠা ৩০৩–৩১৩",
      questions: "৫৮টি MCQ (সম্পূর্ণ)",
      qCount: 58,
      completed: true,
      badgeColor: "#9333ea",
      file: "ch-12-profit-loss.html"
    },
    {
      id: "ch-13",
      number: "১৩",
      title: "পরিমাপ, একক ও বিবিধ পাটিগণিত",
      titleEn: "Measurements, Units & Miscellaneous Arithmetic",
      pages: "পৃষ্ঠা ৩১৩–৩১৭",
      questions: "৪৮টি MCQ (সম্পূর্ণ)",
      qCount: 48,
      completed: true,
      badgeColor: "#059669",
      file: "ch-13-measurements-misc.html"
    }
  ];

  // 3. Inject Slim Reading Progress Bar at the top of the window
  const progressBar = document.createElement('div');
  progressBar.id = 'readingProgressBar';
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3.5px;width:0%;background:linear-gradient(90deg, #0284c7, #06b6d4, #3b82f6);z-index:99999;transition:width 0.1s ease;pointer-events:none;';
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
  const currentIndex = ARITHMETIC_CHAPTERS.findIndex(c => c.file === currentPath);

  const prevCh = currentIndex > 0 ? ARITHMETIC_CHAPTERS[currentIndex - 1] : null;
  const nextCh = currentIndex >= 0 && currentIndex < ARITHMETIC_CHAPTERS.length - 1 ? ARITHMETIC_CHAPTERS[currentIndex + 1] : null;

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
    barHtml += `<a href="${prevCh.file}" class="qb-btn qb-prev" style="color:var(--primary, #0284c7);text-decoration:none;font-weight:700;font-size:0.86rem;display:flex;align-items:center;gap:4px;" title="পূর্ববর্তী অধ্যায়: ${prevCh.title}"><span>←</span> <span>পূর্ববর্তী</span></a>`;
  } else {
    barHtml += `<span style="opacity:0.35;font-size:0.86rem;font-weight:700;">← পূর্ববর্তী</span>`;
  }

  barHtml += `<span style="color:var(--border-color, #cbd5e1);margin:0 4px;">|</span>`;
  barHtml += `<a href="index.html" class="qb-btn qb-index" style="color:var(--text-main, #0f172a);text-decoration:none;font-weight:700;font-size:0.88rem;display:flex;align-items:center;gap:4px;" title="সূচিপত্র"><span>📑</span> <span>সূচিপত্র (${currentIndex + 1}/${ARITHMETIC_CHAPTERS.length})</span></a>`;
  barHtml += `<span style="color:var(--border-color, #cbd5e1);margin:0 4px;">|</span>`;

  if (nextCh) {
    barHtml += `<a href="${nextCh.file}" class="qb-btn qb-next" style="color:var(--primary, #0284c7);text-decoration:none;font-weight:700;font-size:0.86rem;display:flex;align-items:center;gap:4px;" title="পরবর্তী অধ্যায়: ${nextCh.title}"><span>পরবর্তী</span> <span>→</span></a>`;
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
    { name: "🔢 নন-ক্যাডার পাটিগণিত (বর্তমান)", url: "index.html", current: true },
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

})();
