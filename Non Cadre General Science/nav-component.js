/**
 * পিএসসি নন-ক্যাডার সাধারণ বিজ্ঞান - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
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

  // 2. Data Definition: 12 Chapters, 104 Pages, 1,184 Authentic Questions
  const SCIENCE_CHAPTERS = [
    {
      id: "ch-01",
      number: "১",
      title: "পদার্থবিজ্ঞানের বিকাশ, পরিমাপ ও বৈজ্ঞানিক যন্ত্রপাতি",
      titleEn: "Development of Physics, Units & Scientific Instruments",
      pages: "পৃষ্ঠা ৫৬১–৫৬৪",
      questions: "৩৭টি প্রশ্ন",
      qCount: 37,
      badgeColor: "#0284c7",
      file: "ch-01-podarthobiggan-bikash-jontropati.html"
    },
    {
      id: "ch-02",
      number: "২",
      title: "তরঙ্গ, শব্দ ও তাপগতিবিদ্যা",
      titleEn: "Waves, Sound & Thermodynamics",
      pages: "পৃষ্ঠা ৫৬৪–৫৬৯",
      questions: "৫১টি প্রশ্ন",
      qCount: 51,
      badgeColor: "#d97706",
      file: "ch-02-torongo-shobdo-tap.html"
    },
    {
      id: "ch-03",
      number: "৩",
      title: "আলোর প্রকৃতি, প্রতিফলন ও দৃষ্টি সহায়ক যন্ত্র",
      titleEn: "Nature of Light, Optics & Optical Instruments",
      pages: "পৃষ্ঠা ৫৬৯–৫৭২",
      questions: "৪০টি প্রশ্ন",
      qCount: 40,
      badgeColor: "#7c3aed",
      file: "ch-03-alor-prokriti-optics.html"
    },
    {
      id: "ch-04",
      number: "৪",
      title: "স্থির ও চল তড়িৎ, চুম্বকত্ব ও ইলেকট্রনিক্স",
      titleEn: "Static & Current Electricity, Magnetism & Electronics",
      pages: "পৃষ্ঠা ৫৭২–৫৭৮",
      questions: "৫৫টি প্রশ্ন",
      qCount: 55,
      badgeColor: "#059669",
      file: "ch-04-torit-electronics-adhunik-podarthobiggan.html"
    },
    {
      id: "ch-05",
      number: "৫",
      title: "বলবিদ্যা, গতি, কাজ, ক্ষমতা ও শক্তি",
      titleEn: "Mechanics, Motion, Work, Power & Energy",
      pages: "পৃষ্ঠা ৫৭৮–৫৮২",
      questions: "৩৬টি প্রশ্ন",
      qCount: 36,
      badgeColor: "#dc2626",
      file: "ch-05-bolobidya-goti-kaj-shokti.html"
    },
    {
      id: "ch-06",
      number: "৬",
      title: "পদার্থের অবস্থা, পর্যায় সারণি ও এসিড-ক্ষার-লবণ",
      titleEn: "States of Matter, Periodic Table, Acids, Bases & Salts",
      pages: "পৃষ্ঠা ৫৮৩–৫৯২",
      questions: "১০৪টি প্রশ্ন",
      qCount: 104,
      badgeColor: "#ea580c",
      file: "ch-06-roshayon-podartho-acid-khar-lobon.html"
    },
    {
      id: "ch-07",
      number: "৭",
      title: "ধাতু, অধাতু, খনিজ ও জৈব যৌগ",
      titleEn: "Metals, Non-metals, Minerals & Organic Chemistry",
      pages: "পৃষ্ঠা ৫৯২–৬০০",
      questions: "১০৫টি প্রশ্ন",
      qCount: 105,
      badgeColor: "#4f46e5",
      file: "ch-07-dhatu-khonij-carbon-jougo.html"
    },
    {
      id: "ch-08",
      number: "৮",
      title: "উদ্ভিদবিজ্ঞান, জিনতত্ত্ব ও অণুজীববিজ্ঞান",
      titleEn: "Botany, Genetics & Microbiology",
      pages: "পৃষ্ঠা ৬০১–৬০৯",
      questions: "৮৯টি প্রশ্ন",
      qCount: 89,
      badgeColor: "#16a34a",
      file: "ch-08-udbhidbiggan-gens-onujib.html"
    },
    {
      id: "ch-09",
      number: "৯",
      title: "মানবদেহ ও শারীরতত্ত্ব",
      titleEn: "Human Anatomy & Physiology",
      pages: "পৃষ্ঠা ৬০৯–৬২২",
      questions: "১৬৪টি প্রশ্ন",
      qCount: 164,
      badgeColor: "#b91c1c",
      file: "ch-09-manobdeho-sharirtotto.html"
    },
    {
      id: "ch-10",
      number: "১০",
      title: "খাদ্য, পুষ্টি, ভিটামিন ও পরিপাক",
      titleEn: "Food, Nutrition, Vitamins & Digestion",
      pages: "পৃষ্ঠা ৬২২–৬৩৩",
      questions: "১১৯টি প্রশ্ন",
      qCount: 119,
      badgeColor: "#ca8a04",
      file: "ch-10-khaddo-pushti-vitamin.html"
    },
    {
      id: "ch-11",
      number: "১১",
      title: "মানব রোগ, চিকিৎসা ও স্বাস্থ্যব্যবস্থা",
      titleEn: "Human Diseases, Healthcare & Treatment",
      pages: "পৃষ্ঠা ৬৩৩–৬৫৮",
      questions: "৩০২টি প্রশ্ন",
      qCount: 302,
      badgeColor: "#9333ea",
      file: "ch-11-manob-rog-chikitsa.html"
    },
    {
      id: "ch-12",
      number: "১২",
      title: "আধুনিক বিজ্ঞান, পৃথিবী, পরিবেশ ও মহাবিশ্ব",
      titleEn: "Modern Science, Earth, Environment & Universe",
      pages: "পৃষ্ঠা ৬৫৯–৬৬৪",
      questions: "৮২টি প্রশ্ন",
      qCount: 82,
      badgeColor: "#0d9488",
      file: "ch-12-adhunik-biggan-prithibi-mohakash.html"
    }
  ];

  // 3. Inject Progress Bar
  function injectProgressBar() {
    if (document.getElementById('scienceProgressBar')) return;
    const bar = document.createElement('div');
    bar.id = 'scienceProgressBar';
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      width: 0%;
      background: linear-gradient(90deg, #0284c7, #2563eb, #7c3aed, #ea580c);
      z-index: 99999;
      transition: width 0.1s linear;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const b = document.body;
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
      bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
    }, { passive: true });
  }

  // 4. Inject Styles for Drawer and Floating Toggle
  function injectStyles() {
    if (document.getElementById('scienceNavStyles')) return;
    const style = document.createElement('style');
    style.id = 'scienceNavStyles';
    style.textContent = `
      .sci-floating-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #0284c7;
        color: #ffffff !important;
        border: none;
        padding: 12px 18px;
        border-radius: 50px;
        box-shadow: 0 4px 16px rgba(2, 132, 199, 0.4);
        cursor: pointer;
        font-family: 'Noto Serif Bengali', 'Kalpurush', Georgia, serif;
        font-weight: 700;
        font-size: 0.95rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
      }
      .sci-floating-btn:hover {
        background: #0369a1;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(2, 132, 199, 0.5);
      }
      .sci-drawer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        display: none;
      }
      .sci-drawer.open {
        display: block;
      }
      .sci-drawer-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
      .sci-drawer-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 85%;
        max-width: 380px;
        height: 100%;
        background: var(--bg-surface, #ffffff);
        color: var(--text-main, #0f172a);
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        animation: sciSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      }
      @keyframes sciSlideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      .sci-drawer-header {
        padding: 18px 20px;
        background: var(--primary, #0284c7);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sci-drawer-title {
        font-size: 1.15rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Noto Serif Bengali', serif;
      }
      .sci-close-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: #ffffff;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        transition: background 0.2s;
      }
      .sci-close-btn:hover {
        background: rgba(255, 255, 255, 0.35);
      }
      .sci-search-wrap {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.1));
        background: var(--bg-card, rgba(0,0,0,0.02));
      }
      .sci-search-input {
        width: 100%;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid var(--border-color, rgba(0,0,0,0.15));
        background: var(--bg-surface, #ffffff);
        color: var(--text-main, #0f172a);
        font-family: inherit;
        font-size: 0.9rem;
        outline: none;
        box-sizing: border-box;
      }
      .sci-drawer-list {
        flex: 1;
        overflow-y: auto;
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .sci-chapter-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 12px;
        text-decoration: none;
        color: inherit;
        background: var(--bg-card, rgba(0,0,0,0.03));
        border: 1px solid var(--border-color, rgba(0,0,0,0.08));
        transition: all 0.2s ease;
      }
      .sci-chapter-item:hover {
        background: rgba(2, 132, 199, 0.08);
        border-color: #0284c7;
        transform: translateX(4px);
      }
      .sci-chapter-item.active {
        background: rgba(2, 132, 199, 0.12);
        border-color: #0284c7;
        font-weight: 700;
      }
      .sci-ch-num {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        background: #0284c7;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 0.85rem;
        flex-shrink: 0;
      }
      .sci-ch-info {
        flex: 1;
      }
      .sci-ch-title {
        font-size: 0.92rem;
        line-height: 1.4;
        margin-bottom: 4px;
        color: var(--text-main, #0f172a);
      }
      .sci-ch-meta {
        display: flex;
        gap: 8px;
        font-size: 0.78rem;
        color: var(--text-muted, #64748b);
      }
      .sci-ch-badge {
        background: rgba(2, 132, 199, 0.1);
        color: #0284c7;
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: 600;
      }
      .sci-drawer-footer {
        padding: 14px 16px;
        border-top: 1px solid var(--border-color, rgba(0,0,0,0.1));
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        background: var(--bg-card, rgba(0,0,0,0.02));
      }
      .sci-footer-link {
        color: #0284c7;
        text-decoration: none;
        font-weight: 700;
      }
    `;
    document.head.appendChild(style);
  }

  // 5. Build Drawer Element
  function buildDrawer() {
    if (document.getElementById('scienceNavDrawer')) return;

    const currentFile = decodeURIComponent(window.location.pathname.split('/').pop());

    const drawer = document.createElement('div');
    drawer.id = 'scienceNavDrawer';
    drawer.className = 'sci-drawer';
    drawer.innerHTML = `
      <div class="sci-drawer-overlay" onclick="window.toggleSciDrawer()"></div>
      <div class="sci-drawer-content">
        <div class="sci-drawer-header">
          <div class="sci-drawer-title">
            🔬 সাধারণ বিজ্ঞান সূচিপত্র
          </div>
          <button class="sci-close-btn" onclick="window.toggleSciDrawer()">✕</button>
        </div>
        
        <!-- Subject Switcher -->
        <div style="padding: 10px 16px; background: rgba(2, 132, 199, 0.08); border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.1)); font-size: 0.82rem; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-weight: 700; color: #0284c7;">বিষয় সুইচ:</span>
          <select onchange="if(this.value!=='current') window.location.href=this.value;" style="padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.15); background: var(--bg-surface, #fff); color: var(--text-main, #0f172a); font-family: inherit; font-size: 0.82rem; cursor: pointer; max-width: 65%;">
            <option value="current" selected>🔬 সাধারণ বিজ্ঞান (নন-ক্যাডার)</option>
            <option value="../Live MCQ Bangla Literature/index.html">📚 বাংলা সাহিত্য</option>
            <option value="../Live MCQ Bangla Language/index.html">✍️ বাংলা ব্যাকরণ</option>
            <option value="../Live MCQ Bangladesh/index.html">🇧🇩 বাংলাদেশ বিষয়াবলি</option>
            <option value="../Live MCQ International/index.html">🌍 আন্তর্জাতিক বিষয়াবলি</option>
            <option value="../Live MCQ Geography/index.html">🗺️ ভূগোল ও পরিবেশ</option>
            <option value="../index.html">🏛️ মূল হোম পোর্টাল</option>
          </select>
        </div>

        <div class="sci-search-wrap">
          <input type="text" id="sciDrawerSearch" class="sci-search-input" placeholder="অধ্যায় খুঁজুন..." oninput="window.filterSciDrawer(this.value)">
        </div>

        <div class="sci-drawer-list" id="sciDrawerList">
          ${SCIENCE_CHAPTERS.map(ch => {
            const isActive = currentFile === ch.file;
            return `
              <a href="${ch.file}" class="sci-chapter-item ${isActive ? 'active' : ''}">
                <div class="sci-ch-num" style="background:${ch.badgeColor};">${ch.number}</div>
                <div class="sci-ch-info">
                  <div class="sci-ch-title">${ch.title}</div>
                  <div class="sci-ch-meta">
                    <span>${ch.pages}</span>
                    <span class="sci-ch-badge" style="color:${ch.badgeColor}; background:${ch.badgeColor}18;">${ch.questions}</span>
                  </div>
                </div>
              </a>
            `;
          }).join('')}
        </div>

        <div class="sci-drawer-footer">
          <a href="index.html" class="sci-footer-link">📑 বিষয়ের মূল সূচি</a>
          <a href="../index.html" class="sci-footer-link">🏛️ মাস্টার পোর্টাল</a>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    // Floating Button
    const btn = document.createElement('button');
    btn.className = 'sci-floating-btn';
    btn.innerHTML = `<span>📑</span> <span>সূচিপত্র</span>`;
    btn.onclick = window.toggleSciDrawer;
    document.body.appendChild(btn);
  }

  // Window helper functions
  window.toggleSciDrawer = function () {
    const d = document.getElementById('scienceNavDrawer');
    if (d) {
      d.classList.toggle('open');
      if (d.classList.contains('open')) {
        setTimeout(() => {
          const inp = document.getElementById('sciDrawerSearch');
          if (inp) inp.focus();
        }, 150);
      }
    }
  };

  window.filterSciDrawer = function (query) {
    const q = query.trim().toLowerCase();
    const list = document.getElementById('sciDrawerList');
    if (!list) return;
    const items = list.getElementsByClassName('sci-chapter-item');
    for (let i = 0; i < items.length; i++) {
      const text = items[i].textContent.toLowerCase();
      items[i].style.display = text.includes(q) ? 'flex' : 'none';
    }
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    injectProgressBar();
    injectStyles();
    buildDrawer();
  });

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    injectProgressBar();
    injectStyles();
    buildDrawer();
  }
})();
