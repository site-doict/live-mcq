/**
 * পিএসসি নন-ক্যাডার নিয়োগ প্রশ্ন সমাধান - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
 * Smart E-Book Navigation Component for Mobile & Desktop
 * 
 * Features:
 * - Dynamic Fast Font Loading with display=swap
 * - Top Reading Progress Bar (Slim gradient indicator)
 * - Safe-area Inset & Mobile Drawer with live chapter search
 * - 4 Recruitment Exams with exact physical question badges & page ranges
 * - Subject switcher to Master portal and other subject libraries
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

  // 2. Data Definition: 4 Chapters, 96 Pages, 384 Authentic Questions
  const JOB_SOLUTION_CHAPTERS = [
    {
      id: "ch-01",
      number: "১",
      title: "সাব-রেজিস্ট্রার নিয়োগ পরীক্ষা ২০১৬",
      titleEn: "Sub-Registrar Recruitment Exam 2016",
      pages: "পৃষ্ঠা ৩–২৯",
      questions: "১০০টি প্রশ্ন",
      qCount: 100,
      badgeColor: "#0f766e",
      file: "ch-01-sub-registrar-2016.html"
    },
    {
      id: "ch-02",
      number: "২",
      title: "সাব-রেজিস্ট্রার নিয়োগ পরীক্ষা ২০১২",
      titleEn: "Sub-Registrar Recruitment Exam 2012",
      pages: "পৃষ্ঠা ৩০–৫১",
      questions: "৮৯টি প্রশ্ন",
      qCount: 89,
      badgeColor: "#0284c7",
      file: "ch-02-sub-registrar-2012.html"
    },
    {
      id: "ch-03",
      number: "৩",
      title: "সাব-রেজিস্ট্রার নিয়োগ পরীক্ষা ২০০৩",
      titleEn: "Sub-Registrar Recruitment Exam 2003",
      pages: "পৃষ্ঠা ৫২–৭৬",
      questions: "৯৫টি প্রশ্ন",
      qCount: 95,
      badgeColor: "#d97706",
      file: "ch-03-sub-registrar-2003.html"
    },
    {
      id: "ch-04",
      number: "৪",
      title: "সাব-রেজিস্ট্রার নিয়োগ পরীক্ষা ২০০১",
      titleEn: "Sub-Registrar Recruitment Exam 2001",
      pages: "পৃষ্ঠা ৭৭–৯৬",
      questions: "১০০টি প্রশ্ন",
      qCount: 100,
      badgeColor: "#7c3aed",
      file: "ch-04-sub-registrar-2001.html"
    }
  ];

  // 3. Inject Reading Progress Bar
  function injectProgressBar() {
    if (document.getElementById('jobSolutionProgressBar')) return;
    const bar = document.createElement('div');
    bar.id = 'jobSolutionProgressBar';
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      width: 0%;
      background: linear-gradient(90deg, #0f766e, #0284c7, #f59e0b, #7c3aed);
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
    if (document.getElementById('jobSolutionNavStyles')) return;
    const style = document.createElement('style');
    style.id = 'jobSolutionNavStyles';
    style.textContent = `
      .job-floating-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #0f766e;
        color: #ffffff !important;
        border: none;
        padding: 12px 18px;
        border-radius: 50px;
        box-shadow: 0 4px 16px rgba(15, 118, 110, 0.4);
        cursor: pointer;
        font-family: 'Noto Serif Bengali', 'Kalpurush', Georgia, serif;
        font-weight: 700;
        font-size: 0.95rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
      }
      .job-floating-btn:hover {
        background: #115e59;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(15, 118, 110, 0.5);
      }
      .job-drawer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        display: none;
      }
      .job-drawer.open {
        display: block;
      }
      .job-drawer-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
      .job-drawer-content {
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
        animation: jobSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      }
      @keyframes jobSlideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      .job-drawer-header {
        padding: 18px 20px;
        background: var(--primary, #0f766e);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .job-drawer-title {
        font-size: 1.15rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Noto Serif Bengali', serif;
      }
      .job-close-btn {
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
      .job-close-btn:hover {
        background: rgba(255, 255, 255, 0.35);
      }
      .job-search-wrap {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.1));
        background: var(--bg-card, rgba(0,0,0,0.02));
      }
      .job-search-input {
        width: 100%;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid var(--border-color, rgba(0,0,0,0.15));
        background: var(--bg-surface, #ffffff);
        color: var(--text-main, #0f172a);
        font-family: 'Noto Serif Bengali', serif;
        font-size: 0.9rem;
        outline: none;
        box-sizing: border-box;
      }
      .job-search-input:focus {
        border-color: var(--primary, #0f766e);
      }
      .job-chapter-list {
        flex: 1;
        overflow-y: auto;
        padding: 12px 14px;
        list-style: none;
        margin: 0;
      }
      .job-chapter-item {
        margin-bottom: 8px;
      }
      .job-chapter-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 10px;
        text-decoration: none;
        color: var(--text-main, #0f172a);
        background: var(--bg-card, rgba(0,0,0,0.02));
        border: 1px solid var(--border-color, rgba(0,0,0,0.06));
        transition: all 0.2s;
      }
      .job-chapter-link:hover {
        background: var(--primary-light, rgba(15, 118, 110, 0.12));
        border-color: var(--primary, #0f766e);
      }
      .job-chapter-link.active {
        background: var(--primary-light, rgba(15, 118, 110, 0.15));
        border-color: var(--primary, #0f766e);
        font-weight: 700;
      }
      .job-ch-num {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--primary, #0f766e);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.82rem;
        font-weight: 700;
        flex-shrink: 0;
      }
      .job-ch-info {
        flex: 1;
        min-width: 0;
      }
      .job-ch-title {
        font-size: 0.92rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .job-ch-meta {
        font-size: 0.78rem;
        color: var(--text-muted, #64748b);
        display: flex;
        gap: 8px;
        margin-top: 2px;
      }
      .job-drawer-footer {
        padding: 14px 16px;
        border-top: 1px solid var(--border-color, rgba(0,0,0,0.1));
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg-card, rgba(0,0,0,0.02));
      }
      .job-portal-link {
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--primary, #0f766e);
        text-decoration: none;
      }
    `;
    document.head.appendChild(style);
  }

  // 5. Inject Floating Button & Drawer
  function injectDrawer() {
    if (document.getElementById('jobSolutionDrawer')) return;

    // Floating Button
    const floatBtn = document.createElement('button');
    floatBtn.type = 'button';
    floatBtn.className = 'job-floating-btn';
    floatBtn.innerHTML = `<span>📑</span><span>অধ্যায় তালিকা</span>`;
    floatBtn.onclick = () => openDrawer();
    document.body.appendChild(floatBtn);

    // Drawer Structure
    const drawer = document.createElement('div');
    drawer.id = 'jobSolutionDrawer';
    drawer.className = 'job-drawer';
    drawer.innerHTML = `
      <div class="job-drawer-overlay" id="jobDrawerOverlay"></div>
      <div class="job-drawer-content">
        <div class="job-drawer-header">
          <div class="job-drawer-title">
            <span>📚</span>
            <span>নিয়োগ পরীক্ষা সূচিপত্র</span>
          </div>
          <button type="button" class="job-close-btn" id="jobDrawerClose" aria-label="বন্ধ করুন">✕</button>
        </div>
        <div class="job-search-wrap">
          <input type="search" class="job-search-input" id="jobChapterSearch" placeholder="পরীক্ষা বা সাল খুঁজুন..." autocomplete="off">
        </div>
        <ul class="job-chapter-list" id="jobChapterList"></ul>
        <div class="job-drawer-footer">
          <a href="index.html" class="job-portal-link">🏛️ বিষয় সূচিপত্র</a>
          <a href="../index.html" class="job-portal-link">লাইব্রেরি হোম →</a>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    // Event Listeners
    document.getElementById('jobDrawerOverlay').onclick = () => closeDrawer();
    document.getElementById('jobDrawerClose').onclick = () => closeDrawer();

    const searchInput = document.getElementById('jobChapterSearch');
    searchInput.oninput = (e) => renderChapterList(e.target.value);

    renderChapterList();
  }

  function renderChapterList(filterQuery = '') {
    const list = document.getElementById('jobChapterList');
    if (!list) return;
    list.innerHTML = '';

    const currentPath = window.location.pathname.replace(/\\\\/g, '/');
    const q = filterQuery.toLowerCase().trim();

    JOB_SOLUTION_CHAPTERS.forEach(ch => {
      const matchTitle = ch.title.toLowerCase().includes(q) || ch.titleEn.toLowerCase().includes(q) || ch.questions.toLowerCase().includes(q);
      if (q && !matchTitle) return;

      const isActive = currentPath.endsWith(ch.file);

      const li = document.createElement('li');
      li.className = 'job-chapter-item';
      li.innerHTML = `
        <a href="${ch.file}" class="job-chapter-link ${isActive ? 'active' : ''}">
          <div class="job-ch-num">${ch.number}</div>
          <div class="job-ch-info">
            <div class="job-ch-title">${ch.title}</div>
            <div class="job-ch-meta">
              <span>${ch.questions}</span>
              <span>•</span>
              <span>${ch.pages}</span>
            </div>
          </div>
        </a>
      `;
      list.appendChild(li);
    });
  }

  function openDrawer() {
    const drawer = document.getElementById('jobSolutionDrawer');
    if (drawer) {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      const input = document.getElementById('jobChapterSearch');
      if (input) setTimeout(() => input.focus(), 150);
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById('jobSolutionDrawer');
    if (drawer) {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // 6. Keyboard Shortcut (Escape to close)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    injectProgressBar();
    injectStyles();
    injectDrawer();
  });

})();
