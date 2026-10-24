/**
 * পিএসসি নন-ক্যাডার আন্তর্জাতিক বিষয়াবলি - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
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

  // 2. Data Definition: 12 Chapters of Non-Cadre International Affairs
  const INTL_CHAPTERS = [
    {
      id: "ch-01",
      number: "০১",
      title: "সাম্প্রতিক বিশ্ব, চলমান ঘটনাপ্রবাহ ও বৈশ্বিক ব্যক্তিত্ব",
      titleEn: "Recent World Affairs, Summits & Global Figures",
      pages: "পৃষ্ঠা ১৩৪–১৩৭",
      questions: "৪৭টি প্রশ্ন",
      qCount: 47,
      badgeColor: "#0284c7",
      file: "ch-01-recent-world.html"
    },
    {
      id: "ch-02",
      number: "০২",
      title: "আন্তর্জাতিক সম্মেলন, দিবস, সদর দপ্তর ও শীর্ষ ব্যক্তিবর্গ",
      titleEn: "International Summits, Days, Headquarters & Key Leaders",
      pages: "পৃষ্ঠা ১৩৮–১৪৭",
      questions: "৯৬টি প্রশ্ন",
      qCount: 96,
      badgeColor: "#059669",
      file: "ch-02-summits-headquarters.html"
    },
    {
      id: "ch-03",
      number: "০৩",
      title: "আন্তর্জাতিক খেলাধুলা ও কাতার বিশ্বকাপ ফুটবল ২০২২",
      titleEn: "World Sports & FIFA World Cup 2022 Qatar",
      pages: "পৃষ্ঠা ১৪৭–১৫৩",
      questions: "৭২টি প্রশ্ন",
      qCount:  72,
      badgeColor: "#16a34a",
      file: "ch-03-sports-world-cup.html"
    },
    {
      id: "ch-04",
      number: "০৪",
      title: "বৈশ্বিক অর্থনীতি, মুদ্রা ব্যবস্থা ও আন্তর্জাতিক পুরস্কার",
      titleEn: "Global Economy, Currencies & International Awards",
      pages: "পৃষ্ঠা ১৫৩–১৬০",
      questions: "৬৮টি প্রশ্ন",
      qCount:  68,
      badgeColor: "#7c3aed",
      file: "ch-04-global-economy-awards.html"
    },
    {
      id: "ch-05",
      number: "০৫",
      title: "বৈশ্বিক ইতিহাস — প্রাচীন সভ্যতা ও বিশ্বের প্রধান ধর্মসমূহ",
      titleEn: "Global History — Ancient Civilizations & Major Religions",
      pages: "পৃষ্ঠা ১৬০–১৬১",
      questions: "১৮টি প্রশ্ন",
      qCount:  18,
      badgeColor: "#d97706",
      file: "ch-05-global-history-civilizations.html"
    },
    {
      id: "ch-06",
      number: "০৬",
      title: "মহাদেশ পরিচিতি ও ভূ-রাজনীতি: এশিয়া মহাদেশ",
      titleEn: "Continents & Geopolitics: Asia (India, China, Middle East)",
      pages: "পৃষ্ঠা ১৬২–১৭১",
      questions: "৯১টি প্রশ্ন",
      qCount:  91,
      badgeColor: "#dc2626",
      file: "ch-06-asia-geopolitics.html"
    },
    {
      id: "ch-07",
      number: "০৭",
      title: "মহাদেশ পরিচিতি: ইউরোপ, আফ্রিকা, আমেরিকা ও ওশেনিয়া",
      titleEn: "Continents: Europe, Africa, Americas & Oceania",
      pages: "পৃষ্ঠা ১৭২–১৮১",
      questions: "৭২টি প্রশ্ন",
      qCount: 72,
      badgeColor: "#2563eb",
      file: "ch-07-continents-europe-africa-americas.html"
    },
    {
      id: "ch-08",
      number: "০৮",
      title: "বৈশ্বিক ভূগোল, রাজধানী, আইনসভা, সীমারেখা, সাগর ও প্রণালী",
      titleEn: "World Geography, Capitals, Parliaments, Borders & Straits",
      pages: "পৃষ্ঠা ১৮১–১৯৬",
      questions: "১৪৮টি প্রশ্ন",
      qCount:  148,
      badgeColor: "#4f46e5",
      file: "ch-08-global-geography-straits-capitals.html"
    },
    {
      id: "ch-09",
      number: "০৯",
      title: "আন্তর্জাতিক নিরাপত্তা, যুদ্ধ, সামরিক জোট, বিপ্লব ও চুক্তি-সনদ",
      titleEn: "International Security, Wars, Military Alliances, Revolutions & Treaties",
      pages: "পৃষ্ঠা ১৯৬–২০৫",
      questions: "৭৭টি প্রশ্ন",
      qCount:  77,
      badgeColor: "#0891b2",
      file: "ch-09-security-wars-treaties.html"
    },
    {
      id: "ch-10",
      number: "১০",
      title: "আন্তর্জাতিক সংগঠন ও বিশ্বব্যবস্থা: জাতিসংঘ, কমনওয়েলথ ও ন্যাম",
      titleEn: "International Organizations: United Nations, Commonwealth & NAM",
      pages: "পৃষ্ঠা ২০৫–২১২",
      questions: "৭০টি প্রশ্ন",
      qCount: 70,
      badgeColor: "#ca8a04",
      file: "ch-10-international-organizations-un.html"
    },
    {
      id: "ch-11",
      number: "১১",
      title: "আঞ্চলিক ও বৈশ্বিক রাজনৈতিক, সামরিক ও অর্থনৈতিক জোট",
      titleEn: "Regional & Global Blocs: EU, NATO, WTO, IMF, World Bank, G-7, BRICS, ASEAN, SAARC",
      pages: "পৃষ্ঠা ২১৩–২২০",
      questions: "৭১টি প্রশ্ন",
      qCount: 71,
      badgeColor: "#9333ea",
      file: "ch-11-regional-global-blocs.html"
    },
    {
      id: "ch-12",
      number: "১২",
      title: "বিবিধ আন্তর্জাতিক তথ্যপ্রবাহ, মহাশূন্য, নারী বিশ্ব ও পূর্ণরূপ",
      titleEn: "Miscellaneous World Affairs, Space, Women in World & Important Abbreviations",
      pages: "পৃষ্ঠা ২২০–২২৭",
      questions: "আসন্ন",
      qCount: 0,
      badgeColor: "#b45309",
      file: "ch-12-miscellaneous-space-abbreviations.html"
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
      const scrollPos = window.scrollY;
      const pct = Math.min(100, Math.max(0, (scrollPos / totalHeight) * 100));
      progressBar.style.width = pct + '%';
    }
  }, { passive: true });

  // 4. Inject Bottom Floating Chapter Navigation & Quick Menu
  const currentFile = window.location.pathname.split('/').pop();
  let currentIndex = INTL_CHAPTERS.findIndex(c => c.file === currentFile);
  if (currentIndex === -1) currentIndex = 0;

  const prevCh = currentIndex > 0 ? INTL_CHAPTERS[currentIndex - 1] : null;
  const nextCh = currentIndex < INTL_CHAPTERS.length - 1 ? INTL_CHAPTERS[currentIndex + 1] : null;

  const quickBar = document.createElement('aside');
  quickBar.className = 'bottom-quick-bar';
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
  barHtml += `<a href="index.html" class="qb-btn qb-index" style="color:var(--text-main, #0f172a);text-decoration:none;font-weight:700;font-size:0.88rem;display:flex;align-items:center;gap:4px;" title="সূচিপত্র"><span>📑</span> <span>সূচিপত্র (${currentIndex + 1}/${INTL_CHAPTERS.length})</span></a>`;
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
    { name: "🌐 নন-ক্যাডার আন্তর্জাতিক বিষয়াবলি (বর্তমান)", url: "index.html", current: true },
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
