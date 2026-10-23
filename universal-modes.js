/**
 * ইউনিভার্সাল স্মার্ট স্টাডি ও কুইক রিভিশন ইঞ্জিন (Universal Smart Study & Revision Modes Engine)
 * Handles:
 *  - View Modes: full | notes-only | questions-only
 *  - QA Modes: quiz | show-answers | direct-answer
 *  - Floating FAB & Interactive In-Page Modal
 *  - Cross-Page LocalStorage Synchronization
 */

(function () {
  'use strict';

  // 1. Pre-DOM Execution: Apply saved modes immediately
  try {
    const savedView = localStorage.getItem('ebk_view_mode') || 'full';
    const savedQa = localStorage.getItem('ebk_qa_mode') || 'quiz';
    document.documentElement.setAttribute('data-view-mode', savedView);
    document.documentElement.setAttribute('data-qa-mode', savedQa);
  } catch (e) {}

  // 2. Inject Universal Styles for Revision Modes
  function injectStyles() {
    if (document.getElementById('ebk-universal-modes-css')) return;
    const style = document.createElement('style');
    style.id = 'ebk-universal-modes-css';
    style.textContent = `
      /* [notes-only]: শুধু প্রামাণ্য নোট ও আলোচনা মোড — প্রশ্ন ও কুইজ সম্পূর্ণ হাইড */
      [data-view-mode="notes-only"] .q-card,
      [data-view-mode="notes-only"] .quiz-card,
      [data-view-mode="notes-only"] .mcq-card,
      [data-view-mode="notes-only"] .quiz-item,
      [data-view-mode="notes-only"] article.q-card,
      [data-view-mode="notes-only"] .quiz-container,
      [data-view-mode="notes-only"] #quiz-container,
      [data-view-mode="notes-only"] #mcq-container,
      [data-view-mode="notes-only"] .quiz-section,
      [data-view-mode="notes-only"] .score-bar,
      [data-view-mode="notes-only"] .score-banner,
      [data-view-mode="notes-only"] .quiz-control-bar,
      [data-view-mode="notes-only"] .filter-wrap,
      [data-view-mode="notes-only"] .bcs-filter,
      [data-view-mode="notes-only"] .bcs-matrix-card {
        display: none !important;
      }

      /* [questions-only]: শুধু পরীক্ষার প্রশ্নব্যাংক মোড — অধ্যায়ের শুরুর আলোচনা/নোট হাইড */
      [data-view-mode="questions-only"] .part-1,
      [data-view-mode="questions-only"] .part-1-notes,
      [data-view-mode="questions-only"] .notes-section,
      [data-view-mode="questions-only"] .sk-section,
      [data-view-mode="questions-only"] .info-summary-card,
      [data-view-mode="questions-only"] .theory-box,
      [data-view-mode="questions-only"] .theory-card,
      [data-view-mode="questions-only"] .card.theory-card,
      [data-view-mode="questions-only"] .study-section:not(.quiz-section),
      [data-view-mode="questions-only"] .hero-banner,
      [data-view-mode="questions-only"] .bcs-table-card,
      [data-view-mode="questions-only"] .bcs-matrix,
      [data-view-mode="questions-only"] .bcs-stat-grid,
      [data-view-mode="questions-only"] .study-steps,
      [data-view-mode="questions-only"] .sk-box,
      [data-view-mode="questions-only"] .sk-sticky,
      [data-view-mode="questions-only"] .bcs-table-wrap {
        display: none !important;
      }

      /* [show-answers]: তাত্ক্ষণিক উত্তর ও ব্যাখ্যা ওপেন মোড */
      [data-qa-mode="show-answers"] .answer-drawer,
      [data-qa-mode="show-answers"] .exp-drawer,
      [data-qa-mode="show-answers"] .explanation-drawer,
      [data-qa-mode="show-answers"] .explanation-box,
      [data-qa-mode="show-answers"] .quiz-explanation,
      [data-qa-mode="show-answers"] .ans-drawer {
        display: block !important;
        max-height: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        animation: none !important;
      }

      /* [direct-answer]: শুধু প্রশ্ন ও সঠিক উত্তর মোড — ভুল অপশন বন্ধ */
      [data-qa-mode="direct-answer"] .options-grid,
      [data-qa-mode="direct-answer"] .quiz-options,
      [data-qa-mode="direct-answer"] .opt-grid,
      [data-qa-mode="direct-answer"] .q-options,
      [data-qa-mode="direct-answer"] .options-list,
      [data-qa-mode="direct-answer"] .mcq-options {
        display: none !important;
      }

      [data-qa-mode="direct-answer"] .answer-drawer,
      [data-qa-mode="direct-answer"] .exp-drawer,
      [data-qa-mode="direct-answer"] .explanation-drawer,
      [data-qa-mode="direct-answer"] .explanation-box,
      [data-qa-mode="direct-answer"] .quiz-explanation,
      [data-qa-mode="direct-answer"] .ans-drawer {
        display: block !important;
        max-height: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        border-top: none !important;
        background: rgba(34, 197, 94, 0.08) !important;
        border-left: 4px solid #16a34a !important;
        border-radius: 8px !important;
        padding: 10px 14px !important;
        margin-top: 8px !important;
      }

      [data-theme="dark"][data-qa-mode="direct-answer"] .answer-drawer,
      [data-theme="dark"][data-qa-mode="direct-answer"] .exp-drawer,
      [data-theme="dark"][data-qa-mode="direct-answer"] .explanation-drawer,
      [data-theme="dark"][data-qa-mode="direct-answer"] .explanation-box,
      [data-theme="dark"][data-qa-mode="direct-answer"] .quiz-explanation,
      [data-theme="dark"][data-qa-mode="direct-answer"] .ans-drawer {
        background: rgba(34, 197, 94, 0.12) !important;
        border-left-color: #22c55e !important;
      }

      [data-qa-mode="direct-answer"] .exp-toggle-btn,
      [data-qa-mode="direct-answer"] .btn-explain,
      [data-qa-mode="direct-answer"] .drawer-toggle,
      [data-qa-mode="direct-answer"] .toggle-exp-btn,
      [data-qa-mode="direct-answer"] .mcq-actions {
        display: none !important;
      }

      /* In-Page Floating FAB */
      .ebk-mode-fab {
        position: fixed;
        bottom: 82px;
        right: 16px;
        background: linear-gradient(135deg, #0f766e, #0284c7);
        color: #ffffff;
        border: 1.5px solid rgba(255, 255, 255, 0.35);
        border-radius: 999px;
        padding: 7px 13px;
        font-size: 0.8rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        z-index: 99975;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: inherit;
      }
      .ebk-mode-fab:hover {
        transform: scale(1.05);
      }
      .ebk-mode-fab span {
        font-family: inherit;
      }

      /* In-Page Modal Sheet */
      .ebk-mode-sheet-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 99998;
        display: none;
        opacity: 0;
        transition: opacity 0.22s ease;
      }
      .ebk-mode-sheet-overlay.open {
        display: block;
        opacity: 1;
      }

      .ebk-mode-sheet {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 100%);
        width: 100%;
        max-width: 480px;
        background: #ffffff;
        border-radius: 20px 20px 0 0;
        border: 1px solid #e2e8f0;
        box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.3);
        z-index: 99999;
        padding: 20px 18px 28px 18px;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        box-sizing: border-box;
        font-family: inherit;
        color: #0f172a;
      }
      [data-theme="dark"] .ebk-mode-sheet {
        background: #111827;
        border-color: #1f2937;
        color: #f8fafc;
      }
      .ebk-mode-sheet.open {
        transform: translate(-50%, 0);
      }

      .ebk-sheet-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(0,0,0,0.08);
      }
      [data-theme="dark"] .ebk-sheet-header {
        border-bottom-color: rgba(255,255,255,0.1);
      }
      .ebk-sheet-title {
        font-size: 1.05rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .ebk-sheet-close {
        background: none;
        border: none;
        font-size: 1.4rem;
        cursor: pointer;
        color: #64748b;
        line-height: 1;
      }

      .ebk-sheet-sec-label {
        font-size: 0.78rem;
        font-weight: 700;
        color: #64748b;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        display: block;
      }
      [data-theme="dark"] .ebk-sheet-sec-label {
        color: #94a3b8;
      }

      .ebk-sheet-options {
        display: grid;
        grid-template-columns: 1fr;
        gap: 6px;
        margin-bottom: 14px;
      }

      .ebk-sheet-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 9px 12px;
        border-radius: 8px;
        border: 1.5px solid #e2e8f0;
        background: #f8fafc;
        color: inherit;
        font-family: inherit;
        font-size: 0.86rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        text-align: left;
      }
      [data-theme="dark"] .ebk-sheet-btn {
        background: #1f2937;
        border-color: #374151;
      }
      .ebk-sheet-btn:hover {
        border-color: #0f766e;
      }
      .ebk-sheet-btn.active {
        border-color: #0f766e;
        background: rgba(15, 118, 110, 0.14);
        color: #0f766e;
        font-weight: 700;
      }
      [data-theme="dark"] .ebk-sheet-btn.active {
        border-color: #2dd4bf;
        background: rgba(45, 212, 191, 0.18);
        color: #2dd4bf;
      }

      /* In-page Toast */
      .ebk-quick-toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #0f172a;
        color: #f8fafc;
        padding: 9px 16px;
        border-radius: 999px;
        font-size: 0.84rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 999999;
        opacity: 0;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      }
      [data-theme="dark"] .ebk-quick-toast {
        background: #1e293b;
        border: 1px solid #334155;
      }
      .ebk-quick-toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  // 3. Global Controllers
  window.showEbkToast = function (msg) {
    let toast = document.getElementById('ebkQuickToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ebkQuickToast';
      toast.className = 'ebk-quick-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>⚡</span> <span>${msg}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  };

  window.setGlobalViewMode = function (mode) {
    document.documentElement.setAttribute('data-view-mode', mode);
    try {
      localStorage.setItem('ebk_view_mode', mode);
    } catch (e) {}

    document.querySelectorAll('.ebk-view-opt').forEach((btn) => {
      if (btn.getAttribute('data-view') === mode) {
        btn.classList.add('active');
        btn.querySelector('.ebk-check') && (btn.querySelector('.ebk-check').textContent = '✓');
      } else {
        btn.classList.remove('active');
        btn.querySelector('.ebk-check') && (btn.querySelector('.ebk-check').textContent = '');
      }
    });

    const labels = {
      full: 'পূর্ণাঙ্গ পাঠ (নোট + প্রশ্ন)',
      'notes-only': 'শুধু প্রামাণ্য রিভিশন নোট ও সূত্র',
      'questions-only': 'শুধু পরীক্ষার প্রশ্নব্যাংক',
    };
    window.showEbkToast(`অধ্যায় ভিউ: ${labels[mode] || mode}`);
  };

  window.setGlobalQaMode = function (mode) {
    document.documentElement.setAttribute('data-qa-mode', mode);
    try {
      localStorage.setItem('ebk_qa_mode', mode);
    } catch (e) {}

    document.querySelectorAll('.ebk-qa-opt').forEach((btn) => {
      if (btn.getAttribute('data-qa') === mode) {
        btn.classList.add('active');
        btn.querySelector('.ebk-check') && (btn.querySelector('.ebk-check').textContent = '✓');
      } else {
        btn.classList.remove('active');
        btn.querySelector('.ebk-check') && (btn.querySelector('.ebk-check').textContent = '');
      }
    });

    const labels = {
      quiz: 'কুইজ প্র্যাকটিস মোড',
      'show-answers': 'তাত্ক্ষণিক উত্তর ও ব্যাখ্যা ওপেন',
      'direct-answer': 'শুধু প্রশ্ন ও সঠিক উত্তর মোড',
    };
    window.showEbkToast(`প্রশ্ন-উত্তর মোড: ${labels[mode] || mode}`);
  };

  window.openEbkModeSheet = function () {
    const overlay = document.getElementById('ebkModeSheetOverlay');
    const sheet = document.getElementById('ebkModeSheet');
    if (overlay && sheet) {
      overlay.classList.add('open');
      sheet.classList.add('open');
    }
  };

  window.closeEbkModeSheet = function () {
    const overlay = document.getElementById('ebkModeSheetOverlay');
    const sheet = document.getElementById('ebkModeSheet');
    if (overlay && sheet) {
      overlay.classList.remove('open');
      sheet.classList.remove('open');
    }
  };

  // 4. Build in-page FAB & Drawer on Chapter Pages
  function buildInPageControls() {
    // Check if this is master index or paper showcase (skip on master index to avoid duplicate)
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    if (isIndex && !window.location.pathname.includes('Live MCQ')) {
      return;
    }

    if (document.getElementById('ebkModeFab')) return;

    // Create FAB
    const fab = document.createElement('button');
    fab.id = 'ebkModeFab';
    fab.className = 'ebk-mode-fab';
    fab.setAttribute('title', 'স্মার্ট স্টাডি ও রিভিশন সেটিংস');
    fab.innerHTML = `<span>⚡</span> <span>রিভিশন মোড</span>`;
    fab.onclick = window.openEbkModeSheet;
    document.body.appendChild(fab);

    // Create Sheet & Overlay
    const overlay = document.createElement('div');
    overlay.id = 'ebkModeSheetOverlay';
    overlay.className = 'ebk-mode-sheet-overlay';
    overlay.onclick = window.closeEbkModeSheet;
    document.body.appendChild(overlay);

    const sheet = document.createElement('div');
    sheet.id = 'ebkModeSheet';
    sheet.className = 'ebk-mode-sheet';

    const curView = localStorage.getItem('ebk_view_mode') || 'full';
    const curQa = localStorage.getItem('ebk_qa_mode') || 'quiz';

    sheet.innerHTML = `
      <div class="ebk-sheet-header">
        <div class="ebk-sheet-title">
          <span>⚡</span> <span>স্মার্ট স্টাডি ও রিভিশন সেটিংস</span>
        </div>
        <button class="ebk-sheet-close" onclick="closeEbkModeSheet()">&times;</button>
      </div>

      <span class="ebk-sheet-sec-label">📖 অধ্যায় কন্টেন্ট ভিউ:</span>
      <div class="ebk-sheet-options">
        <button type="button" class="ebk-sheet-btn ebk-view-opt ${curView === 'full' ? 'active' : ''}" data-view="full" onclick="setGlobalViewMode('full')">
          <span>📚 পূর্ণাঙ্গ পাঠ (নোট + প্রশ্নব্যাংক)</span>
          <span class="ebk-check">${curView === 'full' ? '✓' : ''}</span>
        </button>
        <button type="button" class="ebk-sheet-btn ebk-view-opt ${curView === 'notes-only' ? 'active' : ''}" data-view="notes-only" onclick="setGlobalViewMode('notes-only')">
          <span>📝 শুধু প্রামাণ্য রিভিশন নোট ও সূত্র</span>
          <span class="ebk-check">${curView === 'notes-only' ? '✓' : ''}</span>
        </button>
        <button type="button" class="ebk-sheet-btn ebk-view-opt ${curView === 'questions-only' ? 'active' : ''}" data-view="questions-only" onclick="setGlobalViewMode('questions-only')">
          <span>🎯 শুধু পরীক্ষার প্রশ্নব্যাংক</span>
          <span class="ebk-check">${curView === 'questions-only' ? '✓' : ''}</span>
        </button>
      </div>

      <span class="ebk-sheet-sec-label">🧩 প্রশ্ন ও উত্তর প্রদর্শন:</span>
      <div class="ebk-sheet-options">
        <button type="button" class="ebk-sheet-btn ebk-qa-opt ${curQa === 'quiz' ? 'active' : ''}" data-qa="quiz" onclick="setGlobalQaMode('quiz')">
          <span>🧩 কুইজ প্র্যাকটিস (অপশন সহ)</span>
          <span class="ebk-check">${curQa === 'quiz' ? '✓' : ''}</span>
        </button>
        <button type="button" class="ebk-sheet-btn ebk-qa-opt ${curQa === 'show-answers' ? 'active' : ''}" data-qa="show-answers" onclick="setGlobalQaMode('show-answers')">
          <span>💡 তাত্ক্ষণিক উত্তর ও ব্যাখ্যা ওপেন</span>
          <span class="ebk-check">${curQa === 'show-answers' ? '✓' : ''}</span>
        </button>
        <button type="button" class="ebk-sheet-btn ebk-qa-opt ${curQa === 'direct-answer' ? 'active' : ''}" data-qa="direct-answer" onclick="setGlobalQaMode('direct-answer')">
          <span>⚡ শুধু প্রশ্ন ও সঠিক উত্তর (ভুল অপশন বন্ধ)</span>
          <span class="ebk-check">${curQa === 'direct-answer' ? '✓' : ''}</span>
        </button>
      </div>

      <div style="text-align:center; margin-top:8px;">
        <button type="button" class="ebk-sheet-btn" style="justify-content:center; background:#0f766e; color:#fff; border:none; padding:9px;" onclick="closeEbkModeSheet()">
          ✓ সম্পন্ন
        </button>
      </div>
    `;
    document.body.appendChild(sheet);
  }

  // 5. Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectStyles();
      buildInPageControls();
    });
  } else {
    injectStyles();
    buildInPageControls();
  }
})();
