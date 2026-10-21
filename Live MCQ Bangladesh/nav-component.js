/**
 * বাংলাদেশ বিষয়াবলি বিসিএস পূর্ণাঙ্গ প্রস্তুতি - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
 * Smart E-Book Navigation Component for Bangladesh Affairs
 * Specialized for mobile viewing (Samsung Galaxy A23, Android, iOS & Desktop)
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
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(fontLink);
    }
  }
  ensureFontsLoaded();

  // 2. Data Definition: 6 Chapters, 31 Files
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

  // 3. Central Font Scaler Engine
  let currentFontScale = parseFloat(localStorage.getItem('ebk_font_scale')) || 1.0;
  function applyFontScale(scale) {
    currentFontScale = Math.min(1.4, Math.max(0.8, scale));
    document.documentElement.style.fontSize = (currentFontScale * 100) + '%';
    localStorage.setItem('ebk_font_scale', currentFontScale.toFixed(2));
  }
  applyFontScale(currentFontScale);

  window.adjustFontSize = function (delta) {
    applyFontScale(currentFontScale + (delta > 0 ? 0.08 : -0.08));
  };
  window.changeFontSize = function (delta) {
    if (delta === 0) applyFontScale(1.0);
    else applyFontScale(currentFontScale + (delta > 0 ? 0.08 : -0.08));
  };
  window.adjustFont = window.adjustFontSize;

  // 4. Reading Progress Bar (Top)
  const progressBar = document.createElement('div');
  progressBar.id = 'ebk-reading-bar';
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#881337,#e11d48,#f59e0b);z-index:99999;width:0%;transition:width 0.1s;';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const sTop = document.documentElement.scrollTop || document.body.scrollTop;
    const sHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight;
    if (sHeight > 0) {
      const pct = Math.min(100, Math.max(0, (sTop / sHeight) * 100));
      progressBar.style.width = pct + '%';
    }
  });

  // 5. Drawer Toggle & Injection
  function buildDrawer() {
    const current = getCurrentFileName();
    let isIndex = current.includes('index.html') || current === "";

    let drawerHtml = `
      <div id="ebk-drawer-backdrop" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999990;backdrop-filter:blur(3px);"></div>
      <div id="ebk-drawer" style="position:fixed;top:0;left:0;bottom:0;width:320px;max-width:85vw;background:var(--bg-surface,#fff);color:var(--text-main,#111);z-index:999991;box-shadow:4px 0 24px rgba(0,0,0,0.25);transform:translateX(-100%);transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column;font-family:'Noto Serif Bengali',serif;">
        
        <!-- Header -->
        <div style="padding:16px;background:linear-gradient(135deg,#881337,#9f1239);color:#fff;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:0.8rem;opacity:0.85;font-weight:600;">বিসিএস পূর্ণাঙ্গ স্মার্ট ইবুক</div>
            <div style="font-size:1.15rem;font-weight:700;">🇧🇩 বাংলাদেশ বিষয়াবলি</div>
          </div>
          <button id="ebk-close-drawer" style="background:rgba(255,255,255,0.2);border:none;color:#fff;font-size:1.2rem;width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
        </div>

        <!-- Subject Switcher -->
        <div style="padding:10px 14px;background:rgba(136,19,55,0.06);border-bottom:1px solid #e2e8f0;font-size:0.85rem;display:flex;align-items:center;justify-content:space-between;">
          <span style="font-weight:700;color:#881337;">বিষয় পরিবর্তন:</span>
          <select id="ebk-subject-switch" style="padding:4px 8px;border-radius:6px;border:1px solid #cbd5e1;background:#fff;font-family:inherit;font-size:0.85rem;cursor:pointer;">
            <option value="current" selected>🇧🇩 বাংলাদেশ বিষয়াবলি</option>
            <option value="../index.html">📚 বাংলা সাহিত্য</option>
            <option value="../Master Portal Index.html">🏛️ মাস্টার পোর্টাল</option>
          </select>
        </div>

        <!-- Search in Drawer -->
        <div style="padding:10px 14px;border-bottom:1px solid #e2e8f0;">
          <input type="text" id="ebk-drawer-search" placeholder="অধ্যায় বা টপিক খুঁজুন..." style="width:100%;box-sizing:border-box;padding:8px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:0.9rem;font-family:inherit;outline:none;">
        </div>

        <!-- Chapter List -->
        <div id="ebk-drawer-list" style="flex:1;overflow-y:auto;padding:10px;">
    `;

    BOOK_CHAPTERS.forEach(ch => {
      drawerHtml += `
        <div style="margin-bottom:12px;">
          <div style="font-weight:700;font-size:0.92rem;color:${ch.badgeColor};padding:6px 8px;background:rgba(0,0,0,0.03);border-radius:6px;margin-bottom:4px;display:flex;justify-content:space-between;">
            <span>${ch.title}</span>
            <span style="font-size:0.75rem;opacity:0.8;">${ch.pages}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;padding-left:6px;">
      `;

      ch.topics.forEach(t => {
        const isCurrent = current === t.file || decodeURIComponent(current) === t.file;
        drawerHtml += `
          <a href="${encodeURI(t.file)}" class="ebk-drawer-item" style="text-decoration:none;padding:6px 10px;border-radius:6px;font-size:0.86rem;color:var(--text-main,#111);${isCurrent ? 'background:rgba(136,19,55,0.12);font-weight:700;border-left:3px solid #881337;' : ''}display:flex;justify-content:space-between;align-items:center;">
            <span>${t.title}</span>
            <span style="font-size:0.72rem;opacity:0.7;">${t.pages.replace('পৃষ্ঠা ', '')}</span>
          </a>
        `;
      });

      drawerHtml += `</div></div>`;
    });

    drawerHtml += `
        </div>

        <!-- Footer Buttons -->
        <div style="padding:12px;border-top:1px solid #e2e8f0;display:flex;gap:8px;">
          <a href="বাংলাদেশ বিষয়াবলি (৪০১-৫৬৪) index.html" style="flex:1;text-align:center;padding:8px;background:#881337;color:#fff;text-decoration:none;border-radius:6px;font-size:0.88rem;font-weight:600;">📑 সূচিপত্র</a>
          <button id="ebk-reset-font" style="padding:8px 12px;background:#f1f5f9;border:1px solid #cbd5e1;border-radius:6px;font-size:0.88rem;cursor:pointer;">ফন্ট ১০০%</button>
        </div>
      </div>
    `;

    const wrap = document.createElement('div');
    wrap.innerHTML = drawerHtml;
    document.body.appendChild(wrap);

    const drawer = document.getElementById('ebk-drawer');
    const backdrop = document.getElementById('ebk-drawer-backdrop');

    window.openEbookDrawer = function () {
      backdrop.style.display = 'block';
      setTimeout(() => {
        drawer.style.transform = 'translateX(0)';
      }, 10);
    };

    window.closeEbookDrawer = function () {
      drawer.style.transform = 'translateX(-100%)';
      setTimeout(() => {
        backdrop.style.display = 'none';
      }, 300);
    };

    document.getElementById('ebk-close-drawer').onclick = window.closeEbookDrawer;
    backdrop.onclick = window.closeEbookDrawer;

    document.getElementById('ebk-reset-font').onclick = () => {
      applyFontScale(1.0);
    };

    document.getElementById('ebk-subject-switch').onchange = (e) => {
      if (e.target.value !== 'current') {
        window.location.href = e.target.value;
      }
    };

    // Live search inside drawer
    document.getElementById('ebk-drawer-search').oninput = (e) => {
      const q = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll('.ebk-drawer-item');
      items.forEach(it => {
        it.style.display = it.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
      });
    };
  }

  // Inject or upgrade Topbar controls
  function ensureDrawerButton() {
    const ctrlBar = document.querySelector('.top-control-bar, .control-bar, header');
    if (ctrlBar && !document.getElementById('ebk-drawer-btn')) {
      const btn = document.createElement('button');
      btn.id = 'ebk-drawer-btn';
      btn.className = 'btn-ctrl';
      btn.style.cssText = 'background:rgba(136,19,55,0.12);color:inherit;border:1px solid rgba(136,19,55,0.3);padding:6px 10px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:700;';
      btn.innerHTML = '📑 সূচি ও অধ্যায়';
      btn.onclick = () => window.openEbookDrawer();
      ctrlBar.prepend(btn);
    }
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      buildDrawer();
      ensureDrawerButton();
    });
  } else {
    buildDrawer();
    ensureDrawerButton();
  }
})();
