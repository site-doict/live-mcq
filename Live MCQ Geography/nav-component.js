/**
 * ভূগোল (বাংলাদেশ ও বিশ্ব), পরিবেশ ও দুর্যোগ ব্যবস্থাপনা
 * বিসিএস প্রিলিমিনারি স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
 * 
 * Features:
 * - Dynamic Fast Font Loading with display=swap
 * - Top Reading Progress Bar (Slim gradient indicator)
 * - Safe-area Inset & Mobile Drawer with live topic search
 * - Chapter trees & physical question badges
 * - LocalStorage sync for reading completion checkmarks
 */

(function () {
  'use strict';

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
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Serif+Bengali:wght@400;600;700&display=swap';
      document.head.appendChild(fontLink);
    }
  }
  ensureFontsLoaded();

  const GEO_CHAPTERS = [
    {
      id: "ch-1",
      number: "১",
      title: "বাংলাদেশ ও বৈশ্বিক ভৌগোলিক অঞ্চল, সীমানা, পারিবেশিক, আর্থ-সামাজিক ও ভূ-রাজনীতির গুরুত্ব",
      titleEn: "Bangladesh & Global Geographic Regions, Boundaries & Geopolitics",
      pages: "পৃষ্ঠা ৬৯৯–৭০৮",
      questions: "২৯টি প্রশ্ন",
      badgeColor: "#0284c7",
      file: "বাংলাদেশ ও বৈশ্বিক ভৌগোলিক অঞ্চল, সীমানা, পারিবেশিক, আর্থ-সামাজিক ও ভূ-রাজনীতির গুরুত্ব.html"
    },
    {
      id: "ch-2",
      number: "২",
      title: "অঞ্চলভিত্তিক ভৌত পরিবেশ, সম্পদের বণ্টন ও গুরুত্ব",
      titleEn: "Region-based Physical Environment, Resource Distribution & Importance",
      pages: "পৃষ্ঠা ৭০৮–৭১৫",
      questions: "২৮টি প্রশ্ন",
      badgeColor: "#d97706",
      file: "অঞ্চলভিত্তিক ভৌত পরিবেশ, সম্পদের বণ্টন ও গুরুত্ব.html"
    },
    {
      id: "ch-3",
      number: "৩",
      title: "বাংলাদেশ ও বৈশ্বিক পরিবেশ: প্রকৃতি ও সম্পদ বণ্টনের প্রধান চ্যালেঞ্জসমূহ",
      titleEn: "Bangladesh and Global Environment: Nature & Resource Distribution Challenges",
      pages: "পৃষ্ঠা ৭১৬–৭২২",
      questions: "২৪টি প্রশ্ন",
      badgeColor: "#dc2626",
      file: "বাংলাদেশ ও বৈশ্বিক পরিবেশ: প্রকৃতি ও সম্পদ বণ্টনের প্রধান চ্যালেঞ্জসমূহ.html"
    },
    {
      id: "ch-4",
      number: "৪",
      title: "প্রাকৃতিক দুর্যোগ ও ব্যবস্থাপনা: দুর্যোগের ধরন, প্রকৃতি ও ব্যবস্থাপনা",
      titleEn: "Natural Disasters & Management: Types, Nature & Management",
      pages: "পৃষ্ঠা ৭২৩–৭৩৪",
      questions: "৪১টি প্রশ্ন",
      badgeColor: "#059669",
      file: "প্রাকৃতিক দুর্যোগ ও ব্যবস্থাপনা: দুর্যোগের ধরন, প্রকৃতি ও ব্যবস্থাপনা.html"
    }
  ];

  function buildDrawer() {
    if (document.getElementById('geoNavDrawer')) return;

    const currentFile = decodeURIComponent(window.location.pathname.split('/').pop());

    const drawer = document.createElement('div');
    drawer.id = 'geoNavDrawer';
    drawer.className = 'geo-drawer';
    drawer.innerHTML = `
      <div class="geo-drawer-overlay" onclick="toggleGeoDrawer()"></div>
      <div class="geo-drawer-content">
        <div class="geo-drawer-header">
          <div class="geo-drawer-title">
            <i class="fas fa-globe-asia"></i> ভূগোল ও পরিবেশ সূচিপত্র
          </div>
          <button class="geo-close-btn" onclick="toggleGeoDrawer()"><i class="fas fa-times"></i></button>
        </div>
        <!-- Subject Switcher -->
        <div style="padding: 8px 14px; background: rgba(2, 132, 199, 0.08); border-bottom: 1px solid var(--border-color, #e2e8f0); font-size: 12px; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-weight: 700; color: #0284c7;">বিষয় পরিবর্তন:</span>
          <select onchange="if(this.value!=='current') window.location.href=this.value;" style="padding: 3px 6px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.15); background: var(--bg-card, #fff); color: var(--text-main, #0f172a); font-family: inherit; font-size: 12px; cursor: pointer; max-width: 65%;">
          <option value="../Live MCQ Bangla Language/index.html">✍️ বাংলা ভাষা ও ব্যাকরণ</option>
          <option value="../Live MCQ Bangla Literature/index.html">📚 বাংলা সাহিত্য</option>
          <option value="../Live MCQ English Grammar/index.html">🔤 English Grammar</option>
          <option value="../Live MCQ English Literature/index.html">🎭 English Literature</option>
          <option value="../Live MCQ Bangladesh/index.html">🇧🇩 বাংলাদেশ বিষয়াবলি</option>
          <option value="../Live MCQ International/index.html">🌐 আন্তর্জাতিক বিষয়াবলি</option>
          <option value="current" selected>🗺️ ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা</option>
          <option value="../Live MCQ General Science/index.html">🔬 সাধারণ বিজ্ঞান</option>
          <option value="../Live MCQ Computer & IT/index.html">💻 কম্পিউটার ও তথ্য প্রযুক্তি</option>
          <option value="../Live MCQ Mathematical Reasoning/index.html">📐 গাণিতিক যুক্তি</option>
          <option value="../Live MCQ Mental Ability/index.html">🧩 মানসিক দক্ষতা</option>
          <option value="../Live MCQ Ethics & Good Governance/index.html">⚖️ নৈতিকতা, মূল্যবোধ ও সুশাসন</option>
          <option value="../index.html">🏛️ মাস্টার লাইব্রেরি পোর্টাল</option>
          </select>
        </div>
        <div class="geo-search-box">
          <input type="text" id="geoTopicSearch" placeholder="অধ্যায় খুঁজুন..." oninput="filterGeoTopics()">
        </div>
        <div class="geo-chapter-list" id="geoChapterList">
          ${GEO_CHAPTERS.map(ch => `
            <a href="${ch.file}" class="geo-ch-item ${ch.file === currentFile ? 'active' : ''}">
              <div class="geo-ch-num" style="background:${ch.badgeColor}">${ch.number}</div>
              <div class="geo-ch-info">
                <div class="geo-ch-title">${ch.title}</div>
                <div class="geo-ch-meta">
                  <span><i class="fas fa-file-alt"></i> ${ch.pages}</span>
                  <span><i class="fas fa-question-circle"></i> ${ch.questions}</span>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
        <div class="geo-drawer-footer">
          <a href="index.html" class="geo-footer-link"><i class="fas fa-th-large"></i> ভূগোল পোর্টাল</a>
          <a href="../index.html" class="geo-footer-link"><i class="fas fa-home"></i> লাইব্রেরি</a>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    // Floating Button
    const fab = document.createElement('button');
    fab.className = 'geo-nav-fab';
    fab.title = 'সূচিপত্র খুলুন';
    fab.onclick = toggleGeoDrawer;
    fab.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(fab);

    // Reading Progress
    const bar = document.createElement('div');
    bar.className = 'geo-reading-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', function() {
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (h > 0) {
        const pct = (window.scrollY / h) * 100;
        bar.style.width = pct + '%';
      }
    });

    // Inject Styles
    const style = document.createElement('style');
    style.textContent = `
      .geo-nav-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #0284c7;
        color: #fff;
        border: none;
        box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
        cursor: pointer;
        z-index: 9990;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, background 0.2s;
      }
      .geo-nav-fab:hover {
        transform: scale(1.08);
        background: #0369a1;
      }
      .geo-reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #0284c7, #10b981, #f59e0b);
        z-index: 9999;
        width: 0%;
        transition: width 0.1s linear;
      }
      .geo-drawer {
        position: fixed;
        inset: 0;
        z-index: 9995;
        visibility: hidden;
        transition: visibility 0.3s;
      }
      .geo-drawer.open {
        visibility: visible;
      }
      .geo-drawer-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.5);
        opacity: 0;
        transition: opacity 0.3s;
      }
      .geo-drawer.open .geo-drawer-overlay {
        opacity: 1;
      }
      .geo-drawer-content {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 380px;
        background: #fff;
        box-shadow: -4px 0 20px rgba(0,0,0,0.15);
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      [data-theme="dark"] .geo-drawer-content {
        background: #18181b;
        color: #f4f4f5;
      }
      .geo-drawer.open .geo-drawer-content {
        transform: translateX(0);
      }
      .geo-drawer-header {
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(0,0,0,0.08);
      }
      [data-theme="dark"] .geo-drawer-header {
        border-bottom-color: rgba(255,255,255,0.1);
      }
      .geo-drawer-title {
        font-weight: 700;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #0284c7;
      }
      .geo-close-btn {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #71717a;
      }
      .geo-search-box {
        padding: 12px 16px;
      }
      .geo-search-box input {
        width: 100%;
        padding: 9px 12px;
        border-radius: 8px;
        border: 1px solid rgba(0,0,0,0.15);
        background: rgba(0,0,0,0.03);
        color: inherit;
        font-size: 0.92rem;
        outline: none;
      }
      [data-theme="dark"] .geo-search-box input {
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.12);
      }
      .geo-chapter-list {
        flex: 1;
        overflow-y: auto;
        padding: 8px 16px;
      }
      .geo-ch-item {
        display: flex;
        gap: 12px;
        padding: 12px;
        margin-bottom: 8px;
        border-radius: 8px;
        text-decoration: none;
        color: inherit;
        background: rgba(0,0,0,0.02);
        border: 1px solid rgba(0,0,0,0.06);
        transition: background 0.2s;
      }
      [data-theme="dark"] .geo-ch-item {
        background: rgba(255,255,255,0.03);
        border-color: rgba(255,255,255,0.08);
      }
      .geo-ch-item:hover, .geo-ch-item.active {
        background: rgba(2, 132, 199, 0.1);
        border-color: #0284c7;
      }
      .geo-ch-num {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.95rem;
        flex-shrink: 0;
      }
      .geo-ch-title {
        font-size: 0.92rem;
        font-weight: 600;
        line-height: 1.4;
      }
      .geo-ch-meta {
        display: flex;
        gap: 10px;
        font-size: 0.8rem;
        color: #71717a;
        margin-top: 4px;
      }
      .geo-drawer-footer {
        padding: 14px 20px;
        border-top: 1px solid rgba(0,0,0,0.08);
        display: flex;
        justify-content: space-around;
      }
      [data-theme="dark"] .geo-drawer-footer {
        border-top-color: rgba(255,255,255,0.1);
      }
      .geo-footer-link {
        font-size: 0.9rem;
        font-weight: 600;
        color: #0284c7;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 6px;
      }
    `;
    
      /* Universal Button Safeguards */

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

document.head.appendChild(style);
  }

  window.toggleGeoDrawer = function() {
    const drawer = document.getElementById('geoNavDrawer');
    if (drawer) drawer.classList.toggle('open');
  };

  window.filterGeoTopics = function() {
    const val = (document.getElementById('geoTopicSearch').value || '').toLowerCase();
    const items = document.querySelectorAll('.geo-ch-item');
    items.forEach(item => {
      const txt = item.textContent.toLowerCase();
      item.style.display = txt.includes(val) ? 'flex' : 'none';
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildDrawer);
  } else {
    buildDrawer();
  }
})();


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

  // Theme Toggle Button Setup
  function setupThemeToggle() {
    const btn = document.getElementById('ebk-theme-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        window.toggleTheme();
      });
    }
    syncTheme();
  }

