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
      [data-qa-mode="show-answers"] .quiz-expl,
      [data-qa-mode="show-answers"] .ans-drawer {
        display: block !important;
        max-height: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        animation: none !important;
      }

      [data-qa-mode="show-answers"] [data-is-correct="true"],
      [data-qa-mode="show-answers"] .opt-btn[data-is-correct="true"],
      [data-qa-mode="show-answers"] .option-btn[data-is-correct="true"],
      [data-qa-mode="show-answers"] .q-opt[data-is-correct="true"],
      [data-qa-mode="show-answers"] .option[data-is-correct="true"] {
        background: rgba(16, 185, 129, 0.12) !important;
        border-color: #10b981 !important;
        color: #065f46 !important;
        font-weight: 700 !important;
      }

      [data-theme="dark"][data-qa-mode="show-answers"] [data-is-correct="true"],
      [data-theme="dark"][data-qa-mode="show-answers"] .opt-btn[data-is-correct="true"],
      [data-theme="dark"][data-qa-mode="show-answers"] .option-btn[data-is-correct="true"],
      [data-theme="dark"][data-qa-mode="show-answers"] .q-opt[data-is-correct="true"],
      [data-theme="dark"][data-qa-mode="show-answers"] .option[data-is-correct="true"] {
        background: rgba(16, 185, 129, 0.2) !important;
        border-color: #34d399 !important;
        color: #a7f3d0 !important;
      }

      [data-qa-mode="show-answers"] .exp-toggle-btn,
      [data-qa-mode="show-answers"] .btn-explain,
      [data-qa-mode="show-answers"] .drawer-toggle,
      [data-qa-mode="show-answers"] .toggle-exp-btn,
      [data-qa-mode="show-answers"] .exp-toggle {
        opacity: 0.6;
      }

      /* [direct-answer]: শুধু প্রশ্ন ও সঠিক উত্তর মোড — ভুল অপশন ও ব্যাখ্যা সম্পূর্ণ বন্ধ */
      [data-qa-mode="direct-answer"] .q-card,
      [data-qa-mode="direct-answer"] .quiz-card,
      [data-qa-mode="direct-answer"] .mcq-card,
      [data-qa-mode="direct-answer"] .quiz-item,
      [data-qa-mode="direct-answer"] article.q-card {
        display: block !important;
      }

      [data-qa-mode="direct-answer"] .options-grid,
      [data-qa-mode="direct-answer"] .quiz-options,
      [data-qa-mode="direct-answer"] .opt-grid,
      [data-qa-mode="direct-answer"] .opts-grid,
      [data-qa-mode="direct-answer"] .q-options,
      [data-qa-mode="direct-answer"] .options-list,
      [data-qa-mode="direct-answer"] .mcq-options {
        display: flex !important;
        flex-direction: column !important;
        gap: 0 !important;
        margin-top: 8px !important;
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
      }

      /* Hide all options that are NOT the correct answer */
      [data-qa-mode="direct-answer"] .options-grid > *:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .quiz-options > *:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .opt-grid > *:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .opts-grid > *:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .q-options > *:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .options-list > *:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .mcq-options > *:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .opt-btn:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .option-btn:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .quiz-opt-btn:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .quiz-option:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .q-opt:not([data-is-correct="true"]),
      [data-qa-mode="direct-answer"] .option:not([data-is-correct="true"]) {
        display: none !important;
      }

      /* Style ONLY the single correct option */
      [data-qa-mode="direct-answer"] [data-is-correct="true"],
      [data-qa-mode="direct-answer"] .opt-btn[data-is-correct="true"],
      [data-qa-mode="direct-answer"] .option-btn[data-is-correct="true"],
      [data-qa-mode="direct-answer"] .quiz-opt-btn[data-is-correct="true"],
      [data-qa-mode="direct-answer"] .quiz-option[data-is-correct="true"],
      [data-qa-mode="direct-answer"] .q-opt[data-is-correct="true"],
      [data-qa-mode="direct-answer"] .option[data-is-correct="true"] {
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        background: rgba(16, 185, 129, 0.12) !important;
        border: 1.5px solid #10b981 !important;
        color: #065f46 !important;
        padding: 8px 14px !important;
        border-radius: 8px !important;
        font-weight: 700 !important;
        font-size: 0.95rem !important;
        cursor: default !important;
        pointer-events: none !important;
        width: fit-content !important;
        max-width: 100% !important;
        margin: 4px 0 !important;
        box-shadow: 0 1px 4px rgba(16, 185, 129, 0.12) !important;
      }

      [data-theme="dark"][data-qa-mode="direct-answer"] [data-is-correct="true"],
      [data-theme="dark"][data-qa-mode="direct-answer"] .opt-btn[data-is-correct="true"],
      [data-theme="dark"][data-qa-mode="direct-answer"] .option-btn[data-is-correct="true"],
      [data-theme="dark"][data-qa-mode="direct-answer"] .quiz-opt-btn[data-is-correct="true"],
      [data-theme="dark"][data-qa-mode="direct-answer"] .quiz-option[data-is-correct="true"],
      [data-theme="dark"][data-qa-mode="direct-answer"] .q-opt[data-is-correct="true"],
      [data-theme="dark"][data-qa-mode="direct-answer"] .option[data-is-correct="true"] {
        background: rgba(16, 185, 129, 0.2) !important;
        border-color: #34d399 !important;
        color: #a7f3d0 !important;
      }

      /* Add the 'উত্তর: ' prefix */
      [data-qa-mode="direct-answer"] [data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-qa-mode="direct-answer"] .opt-btn[data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-qa-mode="direct-answer"] .option-btn[data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-qa-mode="direct-answer"] .quiz-opt-btn[data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-qa-mode="direct-answer"] .quiz-option[data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-qa-mode="direct-answer"] .q-opt[data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-qa-mode="direct-answer"] .option[data-is-correct="true"]:not(.ebk-no-ans-notice)::before {
        content: "উত্তর: ";
        font-weight: 800;
        color: #059669;
        flex-shrink: 0;
      }

      [data-theme="dark"][data-qa-mode="direct-answer"] [data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-theme="dark"][data-qa-mode="direct-answer"] .opt-btn[data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-theme="dark"][data-qa-mode="direct-answer"] .option-btn[data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-theme="dark"][data-qa-mode="direct-answer"] .quiz-opt-btn[data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-theme="dark"][data-qa-mode="direct-answer"] .quiz-option[data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-theme="dark"][data-qa-mode="direct-answer"] .q-opt[data-is-correct="true"]:not(.ebk-no-ans-notice)::before,
      [data-theme="dark"][data-qa-mode="direct-answer"] .option[data-is-correct="true"]:not(.ebk-no-ans-notice)::before {
        color: #34d399;
      }

      /* Notice for questions with no correct option */
      .ebk-no-ans-notice {
        display: none;
      }
      [data-qa-mode="direct-answer"] .ebk-no-ans-notice {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        background: rgba(245, 158, 11, 0.12) !important;
        border: 1.5px solid #f59e0b !important;
        color: #b45309 !important;
        padding: 8px 14px !important;
        border-radius: 8px !important;
        font-weight: 700 !important;
        font-size: 0.92rem !important;
        margin: 4px 0 !important;
      }
      [data-theme="dark"][data-qa-mode="direct-answer"] .ebk-no-ans-notice {
        background: rgba(245, 158, 11, 0.2) !important;
        border-color: #fbbf24 !important;
        color: #fde68a !important;
      }

      /* Hide explanation drawers & toggle buttons completely in direct-answer mode */
      [data-qa-mode="direct-answer"] .answer-drawer,
      [data-qa-mode="direct-answer"] .exp-drawer,
      [data-qa-mode="direct-answer"] .explanation-drawer,
      [data-qa-mode="direct-answer"] .explanation-box,
      [data-qa-mode="direct-answer"] .quiz-explanation,
      [data-qa-mode="direct-answer"] .quiz-expl,
      [data-qa-mode="direct-answer"] .ans-drawer,
      [data-qa-mode="direct-answer"] .exp-toggle-btn,
      [data-qa-mode="direct-answer"] .btn-explain,
      [data-qa-mode="direct-answer"] .drawer-toggle,
      [data-qa-mode="direct-answer"] .toggle-exp-btn,
      [data-qa-mode="direct-answer"] .exp-toggle-wrap,
      [data-qa-mode="direct-answer"] .exp-toggle,
      [data-qa-mode="direct-answer"] .mcq-actions,
      [data-qa-mode="direct-answer"] .status-indicator,
      [data-qa-mode="direct-answer"] .explanation-title,
      [data-qa-mode="direct-answer"] .exp-header,
      [data-qa-mode="direct-answer"] .exp-title,
      [data-qa-mode="direct-answer"] .exp-source {
        display: none !important;
      }

      /* Search Deep Target Glowing Pulse */
      .search-deep-target-glow {
        animation: searchDeepGlow 1.2s ease-in-out 3 alternate !important;
        border-color: #0f766e !important;
        box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.35), 0 8px 24px rgba(15, 118, 110, 0.2) !important;
        border-radius: 14px !important;
      }
      [data-theme="dark"] .search-deep-target-glow {
        border-color: #2dd4bf !important;
        box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.35), 0 8px 24px rgba(45, 212, 191, 0.25) !important;
      }
      @keyframes searchDeepGlow {
        0% { transform: scale(1); }
        100% { transform: scale(1.015); box-shadow: 0 0 0 6px rgba(15, 118, 110, 0.5), 0 10px 28px rgba(0,0,0,0.18); }
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

  // 3. Tagging Engine for Correct Answers across all chapters
  function tagAllCorrectAnswers() {
    const optMap = { 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

    // Auto-discover in-page script data arrays if not already globally exposed on window
    if (!window.quizData || !window.QUIZ_DATA || !window.mcqData || !window.questions) {
      try {
        const scripts = document.querySelectorAll('script:not([src])');
        scripts.forEach((s) => {
          const code = s.textContent || '';
          if (!window.quizData) {
            const m = code.match(/(?:const|let|var)\s+quizData\s*=\s*(\[[\s\S]*?\]);/);
            if (m) {
              try { window.quizData = new Function('return ' + m[1])(); } catch (e) {}
            }
          }
          if (!window.QUIZ_DATA) {
            const m = code.match(/(?:const|let|var)\s+QUIZ_DATA\s*=\s*(\[[\s\S]*?\]);/);
            if (m) {
              try { window.QUIZ_DATA = new Function('return ' + m[1])(); } catch (e) {}
            }
          }
          if (!window.mcqData) {
            const m = code.match(/(?:const|let|var)\s+mcqData\s*=\s*(\[[\s\S]*?\]);/);
            if (m) {
              try { window.mcqData = new Function('return ' + m[1])(); } catch (e) {}
            }
          }
          if (!window.questions) {
            const m = code.match(/(?:const|let|var)\s+questions\s*=\s*(\[[\s\S]*?\]);/);
            if (m) {
              try { window.questions = new Function('return ' + m[1])(); } catch (e) {}
            }
          }
        });
      } catch (e) {}
    }

    // Helper: tag button
    function tagBtn(btn) {
      if (btn) btn.setAttribute('data-is-correct', 'true');
    }

    // Helper: show canceled / no answer notice
    function showNoAnsNotice(card) {
      if (!card) return;
      let noAnsNote = card.querySelector('.ebk-no-ans-notice');
      if (!noAnsNote) {
        const optContainer = card.querySelector('.options-grid, .quiz-options, .opt-grid, .opts-grid, .q-options, .options-list, .mcq-options');
        if (optContainer) {
          noAnsNote = document.createElement('div');
          noAnsNote.className = 'ebk-no-ans-notice';
          noAnsNote.setAttribute('data-is-correct', 'true');
          noAnsNote.innerHTML = '<span>⚠️</span> <span>উত্তর: অপশনে সঠিক উত্তর নেই (প্রশ্নটি বাতিল/বিতর্কিত)</span>';
          optContainer.appendChild(noAnsNote);
        }
      }
    }

    // A. Inspect JS Data Arrays (quizData, QUIZ_DATA, mcqData, questions, QUESTIONS)
    const jsArrays = [window.quizData, window.QUIZ_DATA, window.mcqData, window.questions, window.QUESTIONS];
    jsArrays.forEach((arr) => {
      if (Array.isArray(arr)) {
        arr.forEach((item, idx) => {
          if (!item) return;
          const ansRaw = item.ans !== undefined ? item.ans : (item.answer !== undefined ? item.answer : -1);
          const qId = item.id !== undefined ? item.id : idx;

          // Find card container
          const card = document.getElementById(`qcard-${qId}`) ||
                       document.getElementById(`q-card-${qId}`) ||
                       document.getElementById(`q-${qId}`) ||
                       document.getElementById(`q${qId}`) ||
                       document.getElementById(`card-q${qId}`) ||
                       document.getElementById(`q-card-${idx}`) ||
                       document.getElementById(`qcard-${idx}`) ||
                       document.getElementById(`q${idx + 1}`);

          if (ansRaw === -1) {
            showNoAnsNotice(card);
            return;
          }

          // Handle single or multiple answers (e.g. 0, [0, 1], "0,1")
          let ansList = [];
          if (Array.isArray(ansRaw)) {
            ansList = ansRaw;
          } else if (typeof ansRaw === 'string' && ansRaw.includes(',')) {
            ansList = ansRaw.split(',').map(v => parseInt(v.trim(), 10)).filter(n => !isNaN(n));
          } else {
            const num = parseInt(ansRaw, 10);
            if (!isNaN(num)) ansList = [num];
          }

          ansList.forEach((ansIdx) => {
            // Target specific option button IDs
            let targetBtn = document.getElementById(`opt-${qId}-${ansIdx}`) || 
                            document.getElementById(`opt-${idx}-${ansIdx}`);
            if (targetBtn) {
              tagBtn(targetBtn);
            } else if (card) {
              const btns = card.querySelectorAll('.opt-btn, .option-btn, .q-opt, .option, .quiz-option');
              if (btns && btns[ansIdx]) {
                tagBtn(btns[ansIdx]);
              }
            }
          });

          if (card && !card.getAttribute('data-ans')) {
            card.setAttribute('data-ans', Array.isArray(ansRaw) ? ansRaw.join(',') : ansRaw);
          }
        });
      }
    });

    // B. Inspect all Question Cards on page
    const cards = document.querySelectorAll('.q-card, .quiz-card, .mcq-card, .quiz-item, article.q-card');
    cards.forEach((card) => {
      const btns = card.querySelectorAll('.opt-btn, .option-btn, .q-opt, .option, .quiz-option');
      if (!btns || btns.length === 0) return;

      // Check if already tagged
      let alreadyTagged = false;
      btns.forEach((b) => {
        if (b.getAttribute('data-is-correct') === 'true') alreadyTagged = true;
      });
      if (card.querySelector('.ebk-no-ans-notice')) alreadyTagged = true;
      if (alreadyTagged) return;

      let correctIdx = -1;

      // 1. Button attributes: data-answer="true" or data-correct="true" or data-is-correct="true"
      for (let i = 0; i < btns.length; i++) {
        if (btns[i].getAttribute('data-answer') === 'true' || btns[i].getAttribute('data-correct') === 'true' || btns[i].getAttribute('data-is-correct') === 'true') {
          correctIdx = i;
          break;
        }
      }

      // 2. Card attributes: data-correct, data-ans, data-answer
      if (correctIdx === -1) {
        const cardAns = card.getAttribute('data-correct') || card.getAttribute('data-ans') || card.getAttribute('data-answer');
        if (cardAns !== null && cardAns !== undefined) {
          const val = cardAns.trim();
          if (val === '-1' || val === '') {
            correctIdx = -99;
          } else if (val.includes(',')) {
            // Multi-answer
            const parts = val.split(',').map(p => p.trim());
            parts.forEach((p) => {
              if (optMap[p] !== undefined) {
                tagBtn(btns[optMap[p]]);
              } else if (/^\d+$/.test(p)) {
                const n = parseInt(p, 10);
                if (n >= 0 && n < btns.length) tagBtn(btns[n]);
              }
            });
            return;
          } else if (optMap[val] !== undefined) {
            // Match with data-opt on buttons
            btns.forEach((b, idx) => {
              if (b.getAttribute('data-opt') === val) correctIdx = idx;
            });
            if (correctIdx === -1) correctIdx = optMap[val];
          } else if (/^\d+$/.test(val)) {
            const num = parseInt(val, 10);
            const firstClick = btns[0].getAttribute('onclick') || '';
            // If onclick uses 0-based index: checkAnswer(1, 0)
            if (/(?:checkAnswer|handleSelect|checkAns)\([^,]+,\s*0\)/.test(firstClick)) {
              correctIdx = num;
            } else if (firstClick.includes('checkAnswer') && firstClick.match(/checkAnswer\([^,]+,\s*1\)/)) {
              correctIdx = num - 1;
            } else if (num >= 1 && num <= btns.length && btns.length === 4) {
              correctIdx = num - 1;
            } else if (num >= 0 && num < btns.length) {
              correctIdx = num;
            }
          }
        }
      }

      // 3. Onclick boolean: checkAnswer(this, true, ...) or selectOption(this, true, ...)
      if (correctIdx === -1) {
        for (let i = 0; i < btns.length; i++) {
          const oc = btns[i].getAttribute('onclick') || '';
          if (/(?:checkAnswer|selectOption)\([^)]*\btrue\b/.test(oc)) {
            correctIdx = i;
            break;
          }
        }
      }

      // 4. Onclick letters: checkAnswer(..., 'ক') or checkAns(..., 'গ')
      if (correctIdx === -1) {
        for (let i = 0; i < btns.length; i++) {
          const oc = btns[i].getAttribute('onclick') || '';
          const mLet = oc.match(/(?:checkAnswer|checkAns)\([^)]*[\'\"]([কখগঘa-dA-D])[\'\"][^)]*\)/);
          if (mLet) {
            const allLets = mLet[0].match(/[\'\"]([কখগঘa-dA-D])[\'\"]/g);
            if (allLets && allLets.length > 0) {
              const cleanLetter = allLets[allLets.length - 1].replace(/[\'\"]/g, '');
              if (optMap[cleanLetter] !== undefined) {
                btns.forEach((b, bIdx) => {
                  if (b.getAttribute('data-opt') === cleanLetter) correctIdx = bIdx;
                });
                if (correctIdx === -1) correctIdx = optMap[cleanLetter];
                break;
              }
            }
          }
        }
      }

      // 5. Onclick 4-args: checkAnswer(this, 1, 0, 2) -> 4th arg is correctIdx
      if (correctIdx === -1) {
        for (let i = 0; i < btns.length; i++) {
          const oc = btns[i].getAttribute('onclick') || '';
          const m4 = oc.match(/checkAnswer\([^,]+,\s*[^,]+,\s*[^,]+,\s*(-?\d+)\)/);
          if (m4) {
            const c = parseInt(m4[1], 10);
            if (c >= 0 && c < btns.length) {
              correctIdx = c;
              break;
            } else if (c === -1) {
              correctIdx = -99;
              break;
            }
          }
        }
      }

      // 6. Onclick 3-args: checkAnswer(qId, optIdx, correctIdx) or handleAnswer(...)
      if (correctIdx === -1) {
        for (let i = 0; i < btns.length; i++) {
          const oc = btns[i].getAttribute('onclick') || '';
          const m3 = oc.match(/(?:checkAnswer|handleAnswer|checkAns)\([^,]+,\s*[^,]+,\s*(-?\d+)\)/);
          if (m3) {
            const c = parseInt(m3[1], 10);
            if (c >= 0 && c < btns.length) {
              correctIdx = c;
              break;
            } else if (c === -1) {
              correctIdx = -99;
              break;
            }
          }
        }
      }

      // 7. Explanation text fallback
      if (correctIdx === -1) {
        const expEl = card.querySelector('.exp-content, .exp-drawer, .explanation-box, .ans-drawer, .explanation-drawer, .quiz-explanation, .quiz-expl');
        if (expEl) {
          const text = expEl.textContent || '';
          const mExp = text.match(/(?:সঠিক\s*)?উত্তর\s*[:\s]*([কখগঘa-dA-D])/);
          if (mExp && optMap[mExp[1]] !== undefined) {
            const letter = mExp[1];
            btns.forEach((b, bIdx) => {
              if (b.getAttribute('data-opt') === letter) correctIdx = bIdx;
            });
            if (correctIdx === -1) correctIdx = optMap[letter];
          }
        }
      }

      // Apply tag or fallback notice
      if (correctIdx >= 0 && correctIdx < btns.length) {
        btns[correctIdx].setAttribute('data-is-correct', 'true');
      } else if (correctIdx === -99 || card.getAttribute('data-ans') === '' || card.getAttribute('data-ans') === '-1') {
        showNoAnsNotice(card);
      }
    });
  }

  window.tagAllCorrectAnswers = tagAllCorrectAnswers;

  // 4. Global Controllers
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

    // Run tagging engine if answers need to be exposed or filtered
    if (mode === 'show-answers' || mode === 'direct-answer') {
      tagAllCorrectAnswers();
    }

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

  // 5. Global Delegated Click Listener: Auto-Open Explanation on Option Click
  function setupAutoOpenExplanation() {
    if (window._ebkAutoOpenAttached) return;
    window._ebkAutoOpenAttached = true;

    document.addEventListener('click', function (e) {
      // If user chose direct-answer mode (only question and correct answer), explanations are intentionally hidden
      if (document.documentElement.getAttribute('data-qa-mode') === 'direct-answer') return;

      const optBtn = e.target.closest('.opt-btn, .option-btn, .quiz-opt-btn, .q-opt, .option, button[data-is-correct], .mcq-option, .choice-btn');
      if (!optBtn) return;

      const card = optBtn.closest('.q-card, .quiz-card, .mcq-card, .quiz-item, article');
      if (!card) return;

      // Small delay to allow the question's native logic to mark right/wrong classes
      setTimeout(function () {
        // Expand explanation drawer inside the card
        const drawerSelectors = [
          '.exp-drawer', '.exp-content', '.ans-drawer', '.explanation-drawer',
          '.explanation-content', '.ans-box', '.explanation-box', '.exp-box',
          '.answer-drawer', '.drawer-content', '.quiz-explanation', '.quiz-expl',
          '.exp-desc', '.exp-text'
        ];
        const drawers = card.querySelectorAll(drawerSelectors.join(', '));
        drawers.forEach(function (d) {
          d.classList.add('open');
          d.classList.add('show');
          d.style.display = 'block';
        });

        // Check if explanation drawer is outside the card or identified by id
        const qId = card.id || card.getAttribute('data-id') || card.getAttribute('data-qid');
        if (qId) {
          const cleanId = qId.replace(/^(?:q-|qcard-|qCard_|card-q)/, '');
          const candidateIds = [
            `exp-${cleanId}`,
            `exp_${cleanId}`,
            `expDrawer_${cleanId}`,
            `explanation-${cleanId}`,
            `exp-${qId}`
          ];
          candidateIds.forEach(function (id) {
            const d = document.getElementById(id);
            if (d) {
              d.classList.add('open');
              d.classList.add('show');
              d.style.display = 'block';
            }
          });
        }

        // Update toggle button text if present
        const toggleSelectors = [
          '.exp-toggle-btn', '.btn-exp', '.exp-toggle', '.toggle-exp-btn',
          '.btn-exp-toggle', '.explanation-btn', '.drawer-toggle-btn',
          '.drawer-toggle', '.btn-explain'
        ];
        const toggleBtns = card.querySelectorAll(toggleSelectors.join(', '));
        toggleBtns.forEach(function (btn) {
          if (btn.tagName === 'BUTTON' || btn.tagName === 'A' || btn.classList.contains('btn-exp-toggle') || btn.classList.contains('drawer-toggle-btn')) {
            btn.innerHTML = '🔼 ব্যাখ্যা লুকান';
          }
        });
      }, 50);
    }, true);
  }

  // 6. Universal Search Hash Deep-Linking & Question Card Identification
  function registerQuestionCardAnchors() {
    const cards = document.querySelectorAll('.q-card, .quiz-card, .mcq-card, .quiz-item, article.q-card, article');
    cards.forEach((card, idx) => {
      const num = idx + 1;
      const dataId = card.getAttribute('data-id') || card.getAttribute('data-qid') || card.getAttribute('data-qindex');
      const targetNum = dataId ? dataId : String(num);

      // Register all possible anchor ID variations matching search-data.json
      const variations = [
        `q-${targetNum}`,
        `q${targetNum}`,
        `qcard-${targetNum}`,
        `qCard_${targetNum}`,
        `card-q${targetNum}`
      ];

      if (!card.id) {
        card.id = `q-${targetNum}`;
      }

      // Add alias anchor spans inside card if not present in DOM
      variations.forEach(vId => {
        if (!document.getElementById(vId)) {
          const anchor = document.createElement('span');
          anchor.id = vId;
          anchor.className = 'ebk-anchor-target';
          anchor.style.cssText = 'position:relative; top:-80px; display:block; visibility:hidden; height:0; width:0; pointer-events:none;';
          card.insertBefore(anchor, card.firstChild);
        }
      });

      card.setAttribute('data-search-id', targetNum);
    });
  }

  function handleHashDeepLink() {
    const hash = window.location.hash;
    if (!hash || hash.length <= 1) return;
    const cleanHash = decodeURIComponent(hash.replace(/^#/, '')).trim();
    if (!cleanHash) return;

    // 1. Check for Study Notes Section (e.g. #part1Notes, #part1, #notes)
    if (cleanHash.toLowerCase().includes('part1') || cleanHash.toLowerCase().includes('note')) {
      const noteTarget = document.getElementById(cleanHash) ||
                         document.getElementById('part1Notes') ||
                         document.getElementById('part1') ||
                         document.querySelector('.notes-section, .sk-container, .sketchnote-container, .part1-notes, .study-notes, .sk-notes, #sec-life, #sec-stat, .study-section, .hero-banner + section');
      if (noteTarget) {
        setTimeout(() => {
          noteTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
          noteTarget.classList.remove('search-deep-target-glow');
          void noteTarget.offsetWidth;
          noteTarget.classList.add('search-deep-target-glow');
        }, 120);
        return;
      }
    }

    // 2. Direct match by element ID or name
    let target = document.getElementById(cleanHash) || document.querySelector(`[name="${cleanHash}"]`);

    // If target is an anchor span or internal element inside a question card, resolve to parent card
    if (target && !target.matches('.q-card, .quiz-card, .mcq-card, .quiz-item, article, section, .notes-section')) {
      const parentCard = target.closest('.q-card, .quiz-card, .mcq-card, .quiz-item, article, section');
      if (parentCard) target = parentCard;
    }

    // 3. Extract question number (support Bengali digits ০-৯ and English digits 0-9)
    const bnDigits = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
    const normalizedHash = cleanHash.replace(/[০-৯]/g, d => bnDigits[d]);
    const qMatch = normalizedHash.match(/(?:q|qcard|card|status|question)[-_]?(\d+)/i) || (normalizedHash.match(/^\d+$/) ? normalizedHash.match(/^\d+$/) : null);
    const numId = qMatch ? (qMatch[1] || qMatch[0]) : null;

    if (!target && numId) {
      const selectors = [
        `#q-${numId}`,
        `#q${numId}`,
        `#qcard-${numId}`,
        `#qCard_${numId}`,
        `#qCard-${numId}`,
        `#card-q${numId}`,
        `[data-id="${numId}"]`,
        `[data-qid="${numId}"]`,
        `[data-qindex="${numId}"]`,
        `[data-search-id="${numId}"]`,
        `#exp-${numId}`,
        `#exp_${numId}`,
        `#expDrawer_${numId}`
      ];

      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          target = el.closest('.q-card, .quiz-card, .mcq-card, .quiz-item, article') || el;
          break;
        }
      }

      // Fallback: match by question index (1-based)
      if (!target) {
        const idx = parseInt(numId, 10);
        const allCards = document.querySelectorAll('.q-card, .quiz-card, .mcq-card, .quiz-item, article.q-card');
        if (allCards.length >= idx && idx > 0) {
          target = allCards[idx - 1];
        }
      }
    }

    if (target) {
      if (!target.id) target.id = cleanHash;

      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Glowing pulse highlight
        target.classList.remove('search-deep-target-glow');
        void target.offsetWidth;
        target.classList.add('search-deep-target-glow');

        // Auto expand explanation
        const drawerSelectors = [
          '.exp-drawer', '.exp-content', '.ans-drawer', '.explanation-drawer',
          '.explanation-content', '.ans-box', '.explanation-box', '.exp-box',
          '.answer-drawer', '.drawer-content', '.quiz-explanation', '.quiz-expl',
          '.exp-desc', '.exp-text'
        ];
        const expDrawers = target.querySelectorAll(drawerSelectors.join(', '));
        expDrawers.forEach(d => {
          d.classList.add('open');
          d.classList.add('show');
          d.style.display = 'block';
        });
        if (numId) {
          const expById = document.getElementById(`exp-${numId}`) || document.getElementById(`exp_${numId}`);
          if (expById) {
            expById.classList.add('open');
            expById.classList.add('show');
            expById.style.display = 'block';
          }
        }
        const toggleSelectors = [
          '.exp-toggle-btn', '.btn-exp', '.exp-toggle', '.toggle-exp-btn',
          '.btn-exp-toggle', '.explanation-btn', '.drawer-toggle-btn',
          '.drawer-toggle', '.btn-explain'
        ];
        const toggleBtns = target.querySelectorAll(toggleSelectors.join(', '));
        toggleBtns.forEach(btn => {
          if (btn.tagName === 'BUTTON' || btn.tagName === 'A' || btn.classList.contains('btn-exp-toggle') || btn.classList.contains('drawer-toggle-btn')) {
            btn.innerHTML = '🔼 ব্যাখ্যা লুকান';
          }
        });
      }, 160);
    }
  }

  // 7. Initialize on DOM ready
  function initEbkModes() {
    injectStyles();
    buildInPageControls();
    tagAllCorrectAnswers();
    setupAutoOpenExplanation();
    registerQuestionCardAnchors();
    handleHashDeepLink();
    window.addEventListener('hashchange', handleHashDeepLink);

    setTimeout(tagAllCorrectAnswers, 300);
    setTimeout(registerQuestionCardAnchors, 350);
    setTimeout(handleHashDeepLink, 380);
    setTimeout(tagAllCorrectAnswers, 1200);
    setTimeout(handleHashDeepLink, 1000);

    // Hook dynamic render functions if defined globally
    function hookDynamicRenderers() {
      ['renderQuiz', 'renderQuestions', 'generateQuiz', 'resetQuiz'].forEach(fn => {
        if (typeof window[fn] === 'function' && !window[fn]._ebkHooked) {
          const orig = window[fn];
          window[fn] = function(...args) {
            const res = orig.apply(this, args);
            tagAllCorrectAnswers();
            registerQuestionCardAnchors();
            handleHashDeepLink();
            return res;
          };
          window[fn]._ebkHooked = true;
        }
      });
    }
    hookDynamicRenderers();
    setTimeout(hookDynamicRenderers, 400);
    setTimeout(hookDynamicRenderers, 1000);

    // Watch for dynamic quiz renderers
    try {
      const observer = new MutationObserver(() => {
        tagAllCorrectAnswers();
        registerQuestionCardAnchors();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEbkModes);
  } else {
    initEbkModes();
  }
})();

