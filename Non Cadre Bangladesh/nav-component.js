/**
 * পিএসসি নন-ক্যাডার বাংলাদেশ বিষয়াবলি - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
 * Smart E-Book Navigation Component for Mobile & Desktop
 * 
 * Features:
 * - Dynamic Fast Font Loading with display=swap
 * - Top Reading Progress Bar (Slim gradient indicator)
 * - Safe-area Inset & Mobile Drawer with live chapter search
 * - 15 Chapters with exact physical question badges & page ranges
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

  // 2. Data Definition: 15 Chapters of Non-Cadre Bangladesh Affairs
  const BANGLADESH_CHAPTERS = [
    {
      id: "ch-01",
      number: "০১",
      title: "সাম্প্রতিক বাংলাদেশ ও মেগা প্রকল্পসমূহ",
      titleEn: "Contemporary Bangladesh & Mega Projects",
      pages: "পৃষ্ঠা ১–৯",
      questions: "৭৩টি প্রশ্ন",
      qCount: 73,
      badgeColor: "#0284c7",
      file: "ch-01-shamprotik-bangladesh.html"
    },
    {
      id: "ch-02",
      number: "০২",
      title: "বাংলাদেশ পরিচিতি, ভূ-প্রকৃতি, সীমানা ও নদ-নদী",
      titleEn: "Geography, Borders, Rivers & Physical Features",
      pages: "পৃষ্ঠা ৯–২০",
      questions: "১১১টি প্রশ্ন",
      qCount: 111,
      badgeColor: "#059669",
      file: "ch-02-bhougolik-porichiti-simana-nod-nodi.html"
    },
    {
      id: "ch-03",
      number: "০৩",
      title: "কৃষিজ, খনিজ, শক্তি ও পরিবেশ-বনজ সম্পদ",
      titleEn: "Agriculture, Minerals, Energy & Forest Resources",
      pages: "পৃষ্ঠা ২১–৩১",
      questions: "৯৮টি প্রশ্ন",
      qCount: 98,
      badgeColor: "#16a34a",
      file: "ch-03-krishi-khonij-bonojo-shompod.html"
    },
    {
      id: "ch-04",
      number: "০৪",
      title: "জনসংখ্যা, আদমশুমারি ও ক্ষুদ্র নৃগোষ্ঠী",
      titleEn: "Demographics, Census & Ethnic Communities",
      pages: "পৃষ্ঠা ৩২–৩৬",
      questions: "৫২টি প্রশ্ন",
      qCount: 52,
      badgeColor: "#7c3aed",
      file: "ch-04-jonoshongkha-khudro-nrigoshthi.html"
    },
    {
      id: "ch-05",
      number: "০৫",
      title: "বাংলাদেশের অর্থনীতি, বাজেট ও জাতীয় পরিকল্পনা",
      titleEn: "Economy, Budget, Taxation & National Plans",
      pages: "পৃষ্ঠা ৩৭–৪১",
      questions: "৫৫টি প্রশ্ন",
      qCount: 55,
      badgeColor: "#d97706",
      file: "ch-05-orthoniti-budget-unnoyon-porikolpona.html"
    },
    {
      id: "ch-06",
      number: "০৬",
      title: "শিল্প, বাণিজ্য, ইপিজেড, ব্যাংকিং ও মুদ্রা ব্যবস্থা",
      titleEn: "Industry, Trade, Banking & Currency System",
      pages: "পৃষ্ঠা ৪২–৪৪",
      questions: "৪৮টি প্রশ্ন",
      qCount: 48,
      badgeColor: "#dc2626",
      file: "ch-06-shilpo-banijjo-banking-mudra.html"
    },
    {
      id: "ch-07",
      number: "০৭",
      title: "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান ও সংশোধনীসমূহ",
      titleEn: "Constitution of Bangladesh & Amendments",
      pages: "পৃষ্ঠা ৪৫–৫৪",
      questions: "১১০টি প্রশ্ন",
      qCount: 110,
      badgeColor: "#2563eb",
      file: "ch-07-shongbidhan-o-shongshodhoni.html"
    },
    {
      id: "ch-08",
      number: "০৮",
      title: "সরকার ব্যবস্থা, প্রশাসন, সংসদ ও বিচার বিভাগ",
      titleEn: "Government System, Legislature & Judiciary",
      pages: "পৃষ্ঠা ৫৫–৬২",
      questions: "৭৮টি প্রশ্ন",
      qCount: 78,
      badgeColor: "#4f46e5",
      file: "ch-08-shorkar-proshashon-bichar-bibhag.html"
    },
    {
      id: "ch-09",
      number: "০৯",
      title: "জাতীয় অর্জন, প্রতীক, শিক্ষা ও শীর্ষ প্রতিষ্ঠান",
      titleEn: "National Symbols, Education & Key Institutions",
      pages: "পৃষ্ঠা ৬৩–৭৩",
      questions: "৯৪টি প্রশ্ন",
      qCount: 94,
      badgeColor: "#0891b2",
      file: "ch-09-jatiyo-orjon-shikkha-shongstha.html"
    },
    {
      id: "ch-10",
      number: "১০",
      title: "যোগাযোগ ব্যবস্থা, বন্দর ও টেলিযোগাযোগ",
      titleEn: "Transportation, Ports & Telecommunication",
      pages: "পৃষ্ঠা ৭৪–৭৭",
      questions: "৪৪টি প্রশ্ন",
      qCount: 44,
      badgeColor: "#ca8a04",
      file: "ch-10-jogajog-totthoprojukti.html"
    },
    {
      id: "ch-11",
      number: "১১",
      title: "প্রতিরক্ষা, স্থাপত্য, ভাস্কর্য, সংস্কৃতি ও গণমাধ্যম",
      titleEn: "Defense, Heritage, Architecture, Media & Sports",
      pages: "পৃষ্ঠা ৭৭–১০২",
      questions: "১৪৬টি প্রশ্ন",
      qCount: 146,
      badgeColor: "#9333ea",
      file: "ch-11-protirokkha-sthapotto-shongskriti-kheladhula.html"
    },
    {
      id: "ch-12",
      number: "১২",
      title: "বাংলার প্রাচীন ইতিহাস, জনপদ, রাজবংশ ও সুলতানি-মুঘল শাসন",
      titleEn: "Ancient & Medieval Bengal (Janapadas to Nawabs)",
      pages: "পৃষ্ঠা ১০৩–১০৮",
      questions: "৬৪টি প্রশ্ন",
      qCount: 64,
      badgeColor: "#b45309",
      file: "ch-12-prachin-o-modhyojugiyo-bangla.html"
    },
    {
      id: "ch-13",
      number: "১৩",
      title: "ইউরোপীয় আগমন, ব্রিটিশ শাসন ও পাকিস্তানি শাসন",
      titleEn: "Colonial Rule, Anti-British Movements & Pakistan Era",
      pages: "পৃষ্ঠা ১০৮–১১১",
      questions: "৫২টি প্রশ্ন",
      qCount: 52,
      badgeColor: "#e11d48",
      file: "ch-13-europiyo-agomon-british-o-pakistan-amol.html"
    },
    {
      id: "ch-14",
      number: "১৪",
      title: "ভাষা আন্দোলন, ৬ দফা, গণঅভ্যুত্থান ও মহান মুক্তিযুদ্ধ",
      titleEn: "Language Movement to 1971 Liberation War",
      pages: "পৃষ্ঠা ১১১–১২৭",
      questions: "১৮২টি প্রশ্ন",
      qCount: 182,
      badgeColor: "#15803d",
      file: "ch-14-muktijuddho-shadhinota-shonggram.html"
    },
    {
      id: "ch-15",
      number: "১৫",
      title: "আন্তর্জাতিক সংস্থায় বাংলাদেশ ও বঙ্গবন্ধু শেখ মুজিবুর রহমান",
      titleEn: "Bangladesh in Global Arena & Bangabandhu",
      pages: "পৃষ্ঠা ১২৮–১৩৩",
      questions: "৬২টি প্রশ্ন",
      qCount: 62,
      badgeColor: "#0369a1",
      file: "ch-15-ontorjatik-angone-bangladesh-o-bangabandhu.html"
    }
  ];

  // 3. Inject Slim Reading Progress Bar at the top of the window
  const progressBar = document.createElement('div');
  progressBar.id = 'readingProgressBar';
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3.5px;width:0%;background:linear-gradient(90deg, #059669, #10b981, #34d399);z-index:99999;transition:width 0.1s ease;pointer-events:none;';
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
  let currentIndex = BANGLADESH_CHAPTERS.findIndex(c => c.file === currentFile);
  if (currentIndex === -1) currentIndex = 0;

  const prevCh = currentIndex > 0 ? BANGLADESH_CHAPTERS[currentIndex - 1] : null;
  const nextCh = currentIndex < BANGLADESH_CHAPTERS.length - 1 ? BANGLADESH_CHAPTERS[currentIndex + 1] : null;

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
    barHtml += `<a href="${prevCh.file}" class="qb-btn qb-prev" style="color:var(--primary, #059669);text-decoration:none;font-weight:700;font-size:0.86rem;display:flex;align-items:center;gap:4px;" title="পূর্ববর্তী অধ্যায়: ${prevCh.title}"><span>←</span> <span>পূর্ববর্তী</span></a>`;
  } else {
    barHtml += `<span style="opacity:0.35;font-size:0.86rem;font-weight:700;">← পূর্ববর্তী</span>`;
  }

  barHtml += `<span style="color:var(--border-color, #cbd5e1);margin:0 4px;">|</span>`;
  barHtml += `<a href="index.html" class="qb-btn qb-index" style="color:var(--text-main, #0f172a);text-decoration:none;font-weight:700;font-size:0.88rem;display:flex;align-items:center;gap:4px;" title="সূচিপত্র"><span>📑</span> <span>সূচিপত্র (${currentIndex + 1}/${BANGLADESH_CHAPTERS.length})</span></a>`;
  barHtml += `<span style="color:var(--border-color, #cbd5e1);margin:0 4px;">|</span>`;

  if (nextCh) {
    barHtml += `<a href="${nextCh.file}" class="qb-btn qb-next" style="color:var(--primary, #059669);text-decoration:none;font-weight:700;font-size:0.86rem;display:flex;align-items:center;gap:4px;" title="পরবর্তী অধ্যায়: ${nextCh.title}"><span>পরবর্তী</span> <span>→</span></a>`;
  } else {
    barHtml += `<span style="opacity:0.35;font-size:0.86rem;font-weight:700;">পরবর্তী →</span>`;
  }

  quickBar.innerHTML = barHtml;
  document.body.appendChild(quickBar);

  // 5. Subject Dropdown Options Population (12 Subjects + Master Portal)
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
    { name: "🇧🇩 নন-ক্যাডার বাংলাদেশ বিষয়াবলি (বর্তমান)", url: "index.html", current: true },
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
