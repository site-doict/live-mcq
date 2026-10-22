/**
 * আন্তর্জাতিক বিষয়াবলি বিসিএস পূর্ণাঙ্গ প্রস্তুতি - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
 * Smart E-Book Navigation Component for International Affairs
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

  // 2. Data Definition: 5 Units, 21 Chapters / Topics
  const BOOK_CHAPTERS = [
    {
      id: "ch-1",
      number: "১",
      title: "বৈশ্বিক ইতিহাস, আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা, ভূ-রাজনীতি",
      pages: "পৃষ্ঠা ৫৮৫–৬১০",
      badgeColor: "#0F3966",
      topics: [
        { id: "t-1-1", title: "বৈশ্বিক ইতিহাস (সভ্যতা, প্রাচীন ও মধ্যযুগ ইত্যাদি)", pages: "পৃষ্ঠা ৫৮৫–৫৮৭", file: "বৈশ্বিক ইতিহাস (সভ্যতা, প্রাচীন ও মধ্যযুগ ইত্যাদি).html" },
        { id: "t-1-2", title: "আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা, ভূ-রাজনীতি", pages: "পৃষ্ঠা ৫৮৮–৫৯২", file: "আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা, ভূ-রাজনীতি.html" },
        { id: "t-1-3", title: "গুরুত্বপূর্ণ মহাদেশ, দেশ (রাজধানী, মুদ্রা), স্থান, বন্দর ইত্যাদি সম্পর্কিত", pages: "পৃষ্ঠা ৫৯২–৬০০", file: "গুরুত্বপূর্ণ মহাদেশ, দেশ (রাজধানী, মুদ্রা), স্থান, বন্দর ইত্যাদি সম্পর্কিত.html" },
        { id: "t-1-4", title: "যুদ্ধ ও বিপ্লবসমূহ", pages: "পৃষ্ঠা ৬০০–৬০৫", file: "যুদ্ধ ও বিপ্লবসমূহ.html" },
        { id: "t-1-5", title: "ইতিহাসের গুরুত্বপূর্ণ ব্যক্তি, ধর্মের অভিযাত্রা ও অন্যান্য", pages: "পৃষ্ঠা ৬০৫–৬১০", file: "ইতিহাসের গুরুত্বপূর্ণ ব্যক্তি, ধর্মের অভিযাত্রা ও অন্যান্য.html" }
      ]
    },
    {
      id: "ch-2",
      number: "২",
      title: "আন্তর্জাতিক নিরাপত্তা ও আন্তঃরাষ্ট্রীয় ক্ষমতা সম্পর্ক",
      pages: "পৃষ্ঠা ৬১১–৬৩৪",
      badgeColor: "#1E3A8A",
      topics: [
        { id: "t-2-1", title: "বৈশ্বিক দ্বন্দ্ব ও গুরুত্বপূর্ণ অঞ্চল", pages: "পৃষ্ঠা ৬১১–৬২২", file: "বৈশ্বিক দ্বন্দ্ব ও গুরুত্বপূর্ণ অঞ্চল.html" },
        { id: "t-2-2", title: "ন্যাটো ও অন্যান্য নিরাপত্তা জোট বাহিনী", pages: "পৃষ্ঠা ৬২২–৬২৪", file: "ন্যাটো ও অন্যান্য নিরাপত্তা জোট বাহিনী.html" },
        { id: "t-2-3", title: "বিভিন্ন গেরিলা ও জঙ্গি সংস্থা, বিদ্রোহী জোট এবং গোয়েন্দা", pages: "পৃষ্ঠা ৬২৫–৬২৮", file: "বিভিন্ন গেরিলা ও জঙ্গি সংস্থা, বিদ্রোহী জোট এবং গোয়েন্দা.html" },
        { id: "t-2-4", title: "নিরাপত্তা ও অন্যান্য চুক্তি এবং চুক্তি সংক্রান্ত সনদ", pages: "পৃষ্ঠা ৬২৮–৬৩৪", file: "নিরাপত্তা ও অন্যান্য চুক্তি এবং চুক্তি সংক্রান্ত সনদ.html" }
      ]
    },
    {
      id: "ch-3",
      number: "৩",
      title: "আন্তর্জাতিক পরিবেশগত ইস্যু ও কূটনীতি",
      pages: "পৃষ্ঠা ৬৩৫–৬৪৫",
      badgeColor: "#065F46",
      topics: [
        { id: "t-3-1", title: "পরিবেশগত বিভিন্ন ইস্যু", pages: "পৃষ্ঠা ৬৩৫–৬৩৬", file: "পরিবেশগত বিভিন্ন ইস্যু.html" },
        { id: "t-3-2", title: "পরিবেশ বিষয়ক সংস্থা ও জোট", pages: "পৃষ্ঠা ৬৩৭–৬৩৮", file: "পরিবেশ বিষয়ক সংস্থা ও জোট.html" },
        { id: "t-3-3", title: "পরিবেশগত বিষয়ক চুক্তি ও সম্মেলন", pages: "পৃষ্ঠা ৬৩৯–৬৪৫", file: "পরিবেশগত বিষয়ক চুক্তি ও সম্মেলন.html" }
      ]
    },
    {
      id: "ch-4",
      number: "৪",
      title: "আন্তর্জাতিক সংগঠন এবং বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠান",
      pages: "পৃষ্ঠা ৬৪৬–৬৮৭",
      badgeColor: "#7C2D12",
      topics: [
        { id: "t-4-1", title: "আন্তর্জাতিক রাজনৈতিক সংগঠন ও জোট", pages: "পৃষ্ঠা ৬৪৬–৬৪৯", file: "আন্তর্জাতিক রাজনৈতিক সংগঠন ও জোট.html" },
        { id: "t-4-2", title: "জাতিসংঘ ও জাতিসংঘ বিষয়ক তথ্য", pages: "পৃষ্ঠা ৬৫০–৬৬৪", file: "জাতিসংঘ ও জাতিসংঘ বিষয়ক তথ্য.html" },
        { id: "t-4-3", title: "আন্তর্জাতিক স্বেচ্ছাসেবী, মানবাধিকার ও দুর্নীতি বিরোধী সংস্থা", pages: "পৃষ্ঠা ৬৬৫–৬৬৮", file: "আন্তর্জাতিক স্বেচ্ছাসেবী, মানবাধিকার ও দুর্নীতি বিরোধী সংস্থা.html" },
        { id: "t-4-4", title: "আন্তর্জাতিক সহযোগিতা সংগঠন ও জোট", pages: "পৃষ্ঠা ৬৬৮–৬৭৩", file: "আন্তর্জাতিক সহযোগিতা সংগঠন ও জোট.html" },
        { id: "t-4-5", title: "বিশ্বব্যাংক ও IMF", pages: "পৃষ্ঠা ৬৭৪–৬৭৭", file: "বিশ্বব্যাংক ও IMF.html" },
        { id: "t-4-6", title: "অন্যান্য অর্থনৈতিক সংস্থা", pages: "পৃষ্ঠা ৬৭৮–৬৮৭", file: "অন্যান্য অর্থনৈতিক সংস্থা.html" }
      ]
    },
    {
      id: "ch-5",
      number: "৫",
      title: "বিশ্বের সাম্প্রতিক ও চলমান ঘটনা প্রবাহ",
      pages: "পৃষ্ঠা ৬৮৮–৬৯৮",
      badgeColor: "#4C1D95",
      topics: [
        { id: "t-5-1", title: "গুরুত্বপূর্ণ জরিপ, সমীক্ষা ও সূচক সম্পর্কিত", pages: "পৃষ্ঠা ৬৮৮–৬৯০", file: "গুরুত্বপূর্ণ জরিপ, সমীক্ষা ও সূচক সম্পর্কিত.html" },
        { id: "t-5-2", title: "আন্তর্জাতিক বিভিন্ন পুরস্কার ও খেলাধুলা সম্পর্কিত", pages: "পৃষ্ঠা ৬৯১–৬৯৬", file: "আন্তর্জাতিক বিভিন্ন পুরস্কার ও খেলাধুলা সম্পর্কিত.html" },
        { id: "t-5-3", title: "সাম্প্রতিক আন্তর্জাতিক সম্মেলন", pages: "পৃষ্ঠা ৬৯৭–৬৯৮", file: "সাম্প্রতিক আন্তর্জাতিক সম্মেলন.html" }
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
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#0F3966,#0284C7,#D97706);z-index:99999;width:0%;transition:width 0.1s;';
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

    let drawerHtml = `
      <div id="ebk-drawer-backdrop" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999990;backdrop-filter:blur(3px);"></div>
      <div id="ebk-drawer" style="position:fixed;top:0;left:0;bottom:0;width:320px;max-width:85vw;background:var(--bg-card,#fff);color:var(--text-main,#111);z-index:999991;box-shadow:4px 0 24px rgba(0,0,0,0.25);transform:translateX(-100%);transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column;font-family:'Noto Sans Bengali','Kalpurush',sans-serif;">
        
        <!-- Header -->
        <div style="padding:16px;background:linear-gradient(135deg,#0F3966,#08203E);color:#fff;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:0.8rem;opacity:0.85;font-weight:600;color:#BAE6FD;">বিসিএস পূর্ণাঙ্গ স্মার্ট ইবুক</div>
            <div style="font-size:1.15rem;font-weight:700;">🌐 আন্তর্জাতিক বিষয়াবলি</div>
          </div>
          <button id="ebk-close-drawer" style="background:rgba(255,255,255,0.2);border:none;color:#fff;font-size:1.2rem;width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
        </div>

        <!-- Subject Switcher -->
        <div style="padding:10px 14px;background:rgba(15,57,102,0.06);border-bottom:1px solid #e2e8f0;font-size:0.85rem;display:flex;align-items:center;justify-content:space-between;">
          <span style="font-weight:700;color:#0F3966;">বিষয় পরিবর্তন:</span>
          <select id="ebk-subject-switch" style="padding:4px 8px;border-radius:6px;border:1px solid #cbd5e1;background:#fff;font-family:inherit;font-size:0.85rem;cursor:pointer;">
            <option value="current" selected>🌐 আন্তর্জাতিক বিষয়াবলি</option>
            <option value="../Live MCQ Bangladesh/index.html">🇧🇩 বাংলাদেশ বিষয়াবলি</option>
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
          <a href="${encodeURI(t.file)}" class="ebk-drawer-item" style="text-decoration:none;padding:6px 10px;border-radius:6px;font-size:0.86rem;color:var(--text-main,#111);${isCurrent ? 'background:rgba(15,57,102,0.12);font-weight:700;border-left:3px solid #0F3966;' : ''}display:flex;justify-content:space-between;align-items:center;">
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
          <a href="index.html" style="flex:1;text-align:center;padding:8px;background:#0F3966;color:#fff;text-decoration:none;border-radius:6px;font-size:0.88rem;font-weight:600;">📑 সূচিপত্র</a>
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
      btn.style.cssText = 'background:rgba(15,57,102,0.12);color:inherit;border:1px solid rgba(15,57,102,0.3);padding:6px 10px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:700;';
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
