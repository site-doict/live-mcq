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

      /* Smart Scroll Navigation Dock (Up / Down) */
      .ebk-scroll-dock {
        position: fixed;
        bottom: 26px;
        right: 18px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 99980;
        opacity: 0;
        transform: translateY(10px) scale(0.92);
        pointer-events: none;
        transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      }
      body:has(.ebk-mode-fab) .ebk-scroll-dock,
      .has-mode-fab .ebk-scroll-dock,
      body:has(.ebk-floating-bar) .ebk-scroll-dock {
        bottom: 136px;
      }
      .ebk-scroll-dock.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      .ebk-scroll-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        color: #0f172a;
        border: 1px solid rgba(0, 0, 0, 0.12);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.15rem;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        outline: none;
        user-select: none;
        padding: 0;
      }
      .ebk-scroll-btn:hover {
        background: #0284c7;
        color: #ffffff;
        border-color: #0284c7;
        transform: scale(1.12);
        box-shadow: 0 6px 20px rgba(2, 132, 199, 0.38);
      }
      .ebk-scroll-btn:active {
        transform: scale(0.94);
      }
      [data-theme="dark"] .ebk-scroll-btn,
      .dark .ebk-scroll-btn {
        background: rgba(30, 41, 59, 0.92);
        color: #f8fafc;
        border-color: rgba(255, 255, 255, 0.15);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
      }
      [data-theme="dark"] .ebk-scroll-btn:hover,
      .dark .ebk-scroll-btn:hover {
        background: #38bdf8;
        color: #0f172a;
        border-color: #38bdf8;
      }
      @media (max-width: 600px) {
        .ebk-scroll-dock {
          right: 14px;
          bottom: 20px;
          gap: 6px;
        }
        body:has(.ebk-mode-fab) .ebk-scroll-dock,
        .has-mode-fab .ebk-scroll-dock,
        body:has(.ebk-floating-bar) .ebk-scroll-dock {
          bottom: 126px;
        }
        .ebk-scroll-btn {
          width: 38px;
          height: 38px;
          font-size: 1rem;
        }
      }

      /* Question & Option Diagrams */
      .q-diagram-opt {
        display: inline-block;
        max-height: 85px;
        max-width: 140px;
        height: auto;
        object-fit: contain;
        vertical-align: middle;
        border-radius: 6px;
        background: #ffffff !important;
        padding: 3px 6px;
        border: 1px solid var(--border-color, #e2e8f0);
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      }
      [data-theme="dark"] .q-diagram-opt {
        background: #ffffff !important;
        border-color: #475569 !important;
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

      /* Admin Login & Live Mini Editor System */
      .ebk-admin-login-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 12px;
        font-size: 0.82rem;
        font-weight: 700;
        border-radius: 999px;
        border: 1px solid var(--border-color, #cbd5e1);
        background: rgba(255, 255, 255, 0.85);
        color: #0f172a;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        text-decoration: none;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
      }
      [data-theme="dark"] .ebk-admin-login-btn,
      .dark .ebk-admin-login-btn {
        background: rgba(30, 41, 59, 0.85);
        color: #f8fafc;
        border-color: #334155;
      }
      .ebk-admin-login-btn:hover {
        border-color: #0284c7;
        color: #0284c7;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);
      }
      .ebk-admin-login-btn.ebk-admin-active-badge {
        background: linear-gradient(135deg, #0284c7, #0ea5e9);
        color: #ffffff !important;
        border-color: #0284c7;
        box-shadow: 0 0 12px rgba(2, 132, 199, 0.45);
      }
      .ebk-admin-floating-btn {
        position: fixed;
        top: 14px;
        right: 18px;
        z-index: 99970;
      }

      /* Admin Modal */
      .ebk-admin-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 999990;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .ebk-admin-modal-backdrop.open {
        opacity: 1;
        pointer-events: auto;
      }
      .ebk-admin-modal {
        background: #ffffff;
        color: #0f172a;
        border-radius: 18px;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
        border: 1px solid #e2e8f0;
        width: 100%;
        max-width: 440px;
        padding: 24px;
        transform: scale(0.92);
        transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
      }
      [data-theme="dark"] .ebk-admin-modal,
      .dark .ebk-admin-modal {
        background: #0f172a;
        color: #f8fafc;
        border-color: #1e293b;
      }
      .ebk-admin-modal-backdrop.open .ebk-admin-modal {
        transform: scale(1);
      }
      .ebk-admin-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
      }
      .ebk-admin-modal-title {
        font-size: 1.12rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ebk-modal-close-btn {
        background: transparent;
        border: none;
        font-size: 1.5rem;
        color: inherit;
        cursor: pointer;
        line-height: 1;
        opacity: 0.6;
        transition: opacity 0.15s;
      }
      .ebk-modal-close-btn:hover {
        opacity: 1;
      }
      .ebk-modal-intro {
        font-size: 0.92rem;
        line-height: 1.55;
        color: var(--text-muted, #64748b);
        margin-bottom: 14px;
      }
      .ebk-form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .ebk-label {
        font-size: 0.86rem;
        font-weight: 700;
      }
      .ebk-input {
        width: 100%;
        padding: 10px 14px;
        border-radius: 10px;
        border: 1.5px solid #cbd5e1;
        font-size: 0.95rem;
        background: var(--bg-surface, #ffffff);
        color: inherit;
        font-family: inherit;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.2s ease;
      }
      [data-theme="dark"] .ebk-input,
      .dark .ebk-input {
        background: #1e293b;
        border-color: #334155;
      }
      .ebk-input:focus {
        border-color: #0284c7;
      }
      .ebk-input.error {
        border-color: #ef4444;
      }
      .ebk-error-msg {
        font-size: 0.82rem;
        color: #ef4444;
        font-weight: 600;
      }
      .ebk-help-text {
        font-size: 0.78rem;
        color: var(--text-muted, #64748b);
        line-height: 1.45;
      }
      .ebk-modal-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }
      .ebk-btn {
        padding: 8px 16px;
        border-radius: 10px;
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        border: none;
        font-family: inherit;
        transition: transform 0.15s ease, background 0.15s ease;
      }
      .ebk-btn-primary {
        background: #0284c7;
        color: #ffffff;
      }
      .ebk-btn-primary:hover {
        background: #0369a1;
      }
      .ebk-btn-danger {
        background: #ef4444;
        color: #ffffff;
      }
      .ebk-btn-danger:hover {
        background: #dc2626;
      }
      .ebk-btn-outline {
        background: transparent;
        border: 1.5px solid #cbd5e1;
        color: inherit;
      }
      [data-theme="dark"] .ebk-btn-outline,
      .dark .ebk-btn-outline {
        border-color: #334155;
      }

      /* In-Line Edit Triggers (Only visible when ebk-admin-active is on body) */
      .ebk-edit-trigger {
        display: none;
      }
      .ebk-admin-active .ebk-edit-trigger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #0284c7;
        color: #ffffff;
        border: none;
        cursor: pointer;
        font-size: 0.8rem;
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.4);
        transition: transform 0.15s ease, background 0.15s ease;
        margin-left: 8px;
        vertical-align: middle;
        user-select: none;
      }
      .ebk-admin-active .ebk-edit-trigger:hover {
        transform: scale(1.18);
        background: #0369a1;
      }
      .ebk-is-editing {
        outline: 2px dashed #0284c7 !important;
        outline-offset: 4px !important;
        border-radius: 6px !important;
        background: rgba(2, 132, 199, 0.05) !important;
      }

      /* Mini 1-Line Floating Toolbar */
      .ebk-mini-toolbar {
        position: fixed;
        display: flex;
        align-items: center;
        gap: 3px;
        background: #0f172a;
        color: #f8fafc;
        border-radius: 999px;
        padding: 5px 12px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
        z-index: 999995;
        border: 1px solid #334155;
        opacity: 0;
        pointer-events: none;
        transform: translateY(6px);
        transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
      .ebk-mini-toolbar.visible {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }
      .ebk-tb-btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: transparent;
        color: #f8fafc;
        border: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: 700;
        font-size: 0.92rem;
        transition: background 0.15s ease, transform 0.1s ease;
      }
      .ebk-tb-btn:hover {
        background: #334155;
      }
      .ebk-tb-btn:active {
        transform: scale(0.92);
      }
      .ebk-tb-sep {
        width: 1px;
        height: 18px;
        background: #475569;
        margin: 0 3px;
      }
      .ebk-color-picker-wrap {
        position: relative;
      }
      .ebk-color-popover {
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 6px 8px;
        display: none;
        gap: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      }
      .ebk-color-popover.open {
        display: flex;
      }
      .ebk-color-dot {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        cursor: pointer;
        transition: transform 0.15s ease;
      }
      .ebk-color-dot:hover {
        transform: scale(1.25);
      }
      .ebk-tb-done-btn {
        width: auto !important;
        padding: 4px 10px;
        border-radius: 999px !important;
        background: #10b981 !important;
        color: #ffffff !important;
        font-size: 0.8rem;
      }
      .ebk-tb-done-btn:hover {
        background: #059669 !important;
      }

      /* Floating Bottom Save Dock */
      .ebk-save-dock {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #0f172a;
        color: #ffffff;
        border-radius: 999px;
        padding: 8px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
        border: 1.5px solid #0284c7;
        z-index: 999980;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
      .ebk-save-dock.visible {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
        pointer-events: auto;
      }
      .ebk-save-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.86rem;
        font-weight: 600;
      }
      .ebk-save-status .dot.live-pulse {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f59e0b;
        box-shadow: 0 0 8px #f59e0b;
        animation: saveDotPulse 1.4s infinite ease-in-out;
      }
      @keyframes saveDotPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.4); opacity: 0.6; }
      }
      .ebk-save-btn {
        background: linear-gradient(135deg, #10b981, #059669);
        color: #ffffff;
        border: none;
        padding: 7px 16px;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.88rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 2px 10px rgba(16, 185, 129, 0.35);
        transition: transform 0.15s ease;
      }
      .ebk-save-btn:hover {
        transform: scale(1.04);
      }
      .ebk-save-btn:active {
        transform: scale(0.96);
      }
      .ebk-save-btn-outline {
        background: transparent;
        color: #94a3b8;
        border: 1px solid #475569;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 0.82rem;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .ebk-save-btn-outline:hover {
        color: #ffffff;
        border-color: #94a3b8;
      }
      .ebk-save-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 1.1rem;
        cursor: pointer;
        line-height: 1;
        transition: color 0.15s;
      }
      .ebk-save-close:hover {
        color: #ffffff;
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

  // 6.5. Smart Scroll Navigation Dock (Up / Down)
  function setupSmartScrollDock() {
    if (document.getElementById('ebk-scroll-dock')) return;

    const dock = document.createElement('div');
    dock.id = 'ebk-scroll-dock';
    dock.className = 'ebk-scroll-dock';
    dock.innerHTML = `
      <button class="ebk-scroll-btn ebk-scroll-btn-top" title="উপরে যান (Scroll to Top)" aria-label="Scroll to Top">
        <span>▲</span>
      </button>
      <button class="ebk-scroll-btn ebk-scroll-btn-bottom" title="নিচে যান (Scroll to Bottom)" aria-label="Scroll to Bottom">
        <span>▼</span>
      </button>
    `;
    document.body.appendChild(dock);

    const btnTop = dock.querySelector('.ebk-scroll-btn-top');
    const btnBottom = dock.querySelector('.ebk-scroll-btn-bottom');

    btnTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnBottom.addEventListener('click', (e) => {
      e.preventDefault();
      const maxScroll = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      window.scrollTo({ top: maxScroll, behavior: 'smooth' });
    });

    let hideTimer = null;
    function showDock() {
      dock.classList.add('visible');
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop < 100) {
        btnTop.style.opacity = '0.35';
        btnTop.style.pointerEvents = 'none';
      } else {
        btnTop.style.opacity = '1';
        btnTop.style.pointerEvents = 'auto';
      }

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        btnBottom.style.opacity = '0.35';
        btnBottom.style.pointerEvents = 'none';
      } else {
        btnBottom.style.opacity = '1';
        btnBottom.style.pointerEvents = 'auto';
      }

      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        dock.classList.remove('visible');
      }, 2500);
    }

    window.addEventListener('scroll', showDock, { passive: true });
    window.addEventListener('touchstart', showDock, { passive: true });
    window.addEventListener('pointerdown', showDock, { passive: true });
    dock.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    dock.addEventListener('mouseleave', () => {
      hideTimer = setTimeout(() => dock.classList.remove('visible'), 2000);
    });
  }

  // 7. Admin Live Editor & In-Browser CMS Engine (Password: 4991)
  function setupAdminLiveEditor() {
    const ADMIN_PASS = '4991';
    let activeEditableEl = null;
    let unsavedCount = 0;

    function getPageKey() {
      const path = (window.location.pathname || 'index.html').split('/').pop() || 'index.html';
      return 'ebk_edits_' + decodeURIComponent(path);
    }

    function isAdminLoggedIn() {
      try {
        return localStorage.getItem('ebk_admin_pass') === ADMIN_PASS;
      } catch (e) {
        return false;
      }
    }

    function applyAdminModeUI() {
      if (isAdminLoggedIn()) {
        document.body.classList.add('ebk-admin-active');
        document.documentElement.classList.add('ebk-admin-active');
        updateLoginButton(true);
        attachEditPencils();
      } else {
        document.body.classList.remove('ebk-admin-active');
        document.documentElement.classList.remove('ebk-admin-active');
        updateLoginButton(false);
        removeEditPencils();
      }
    }

    function updateLoginButton(isLoggedIn) {
      document.querySelectorAll('.ebk-admin-login-btn').forEach(btn => {
        if (isLoggedIn) {
          btn.classList.add('ebk-admin-active-badge');
          btn.innerHTML = `<span>✏️ এডিট মোড</span>`;
          btn.title = 'অ্যাডমিন সক্রিয় (ক্লিক করে সেটিংস বা লগআউট)';
        } else {
          btn.classList.remove('ebk-admin-active-badge');
          btn.innerHTML = `<span>🔐 লগইন</span>`;
          btn.title = 'অ্যাডমিন লগইন (পাসওয়ার্ড দিন)';
        }
      });
    }

    // 7.1. Create Topbar Button if not present
    function injectLoginButtons() {
      if (document.querySelector('.ebk-admin-login-btn')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ebk-admin-login-btn';
      btn.innerHTML = `<span>🔐 লগইন</span>`;
      btn.title = 'অ্যাডমিন লগইন (পাসওয়ার্ড দিন)';
      btn.addEventListener('click', openAdminModal);

      // Try inserting into page headers
      const headerActions = document.querySelector('.topbar-actions, .top-action-bar, .app-topbar .topbar-actions, header .font-controls, .brand-wrap');
      if (headerActions) {
        headerActions.appendChild(btn);
      } else {
        btn.classList.add('ebk-admin-floating-btn');
        document.body.appendChild(btn);
      }
    }

    // 7.2. Admin Modal Component
    function buildAdminModal() {
      if (document.getElementById('ebkAdminModalBackdrop')) return;

      const backdrop = document.createElement('div');
      backdrop.id = 'ebkAdminModalBackdrop';
      backdrop.className = 'ebk-admin-modal-backdrop';
      backdrop.innerHTML = `
        <div class="ebk-admin-modal">
          <div class="ebk-admin-modal-header">
            <div class="ebk-admin-modal-title">
              <span class="modal-icon">🔐</span>
              <span id="ebkModalTitleText">অ্যাডমিন লগইন (লাইভ এডিটর)</span>
            </div>
            <button type="button" class="ebk-modal-close-btn" id="ebkAdminModalCloseBtn">&times;</button>
          </div>
          
          <div class="ebk-admin-modal-body" id="ebkAdminModalBody">
            <!-- Dynamically populated based on login state -->
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);

      backdrop.querySelector('#ebkAdminModalCloseBtn').addEventListener('click', closeAdminModal);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeAdminModal();
      });

      // Keyboard Shortcut: Ctrl + Shift + E opens admin modal!
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
          e.preventDefault();
          openAdminModal();
        }
      });
    }

    function openAdminModal() {
      buildAdminModal();
      const backdrop = document.getElementById('ebkAdminModalBackdrop');
      const body = document.getElementById('ebkAdminModalBody');
      const title = document.getElementById('ebkModalTitleText');
      if (!backdrop || !body) return;

      const isLoggedIn = isAdminLoggedIn();
      if (isLoggedIn) {
        if (title) title.textContent = 'অ্যাডমিন ও এডিটর সেটিংস';
        const currentPat = localStorage.getItem('ebk_admin_pat') || '';
        body.innerHTML = `
          <div style="background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:12px; display:flex; gap:10px; align-items:center; margin-bottom:14px;">
            <span style="font-size:1.5rem;">✅</span>
            <div style="font-size:0.88rem; line-height:1.5;">
              <strong style="color:#10b981;">অ্যাডমিন মোড সক্রিয় রয়েছে!</strong><br>
              যেকোনো প্রশ্ন, ব্যাখ্যা বা নোটের পাশে থাকা ✏️ বাটনে চাপ দিয়ে সরাসরি ব্রাউজারেই এডিট ও ফরম্যাট করতে পারবেন।
            </div>
          </div>

          <div class="ebk-form-group">
            <label class="ebk-label">GitHub Personal Access Token (ঐচ্ছিক):</label>
            <input type="password" id="ebkGitHubPatInput" class="ebk-input" placeholder="ghp_... বা github_pat_..." value="${currentPat}">
            <div class="ebk-help-text">
              গিটহাবে সরাসরি পরিবর্তন সেভ করার জন্য টোকেন দিয়ে "টোকেন সেভ করুন" চাপুন। না দিলেও লোকাল ব্রাউজারে পরিবর্তন সংরক্ষিত থাকবে।
            </div>
          </div>

          <div class="ebk-modal-actions" style="margin-top:18px;">
            <button type="button" class="ebk-btn ebk-btn-primary" id="ebkSavePatBtn">টোকেন সংরক্ষণ</button>
            <button type="button" class="ebk-btn ebk-btn-danger" id="ebkAdminLogoutBtn">🔓 লগআউট করুন</button>
          </div>
        `;

        body.querySelector('#ebkSavePatBtn').addEventListener('click', () => {
          const val = (body.querySelector('#ebkGitHubPatInput').value || '').trim();
          if (val) {
            localStorage.setItem('ebk_admin_pat', val);
            showToast('✅ GitHub টোকেন ব্রাউজারে সংরক্ষিত হয়েছে!');
          } else {
            localStorage.removeItem('ebk_admin_pat');
            showToast('ℹ️ GitHub টোকেন রিমুভ করা হয়েছে।');
          }
          closeAdminModal();
        });

        body.querySelector('#ebkAdminLogoutBtn').addEventListener('click', () => {
          localStorage.removeItem('ebk_admin_pass');
          applyAdminModeUI();
          showToast('অ্যাডমিন মোড থেকে লগআউট করা হয়েছে।');
          closeAdminModal();
        });
      } else {
        if (title) title.textContent = 'অ্যাডমিন লগইন (লাইভ এডিটর)';
        body.innerHTML = `
          <p class="ebk-modal-intro">
            পড়ার সময় সরাসরি টেক্সট কালার, আন্ডারলাইন, বোল্ড ও ভুলত্রুটি এডিট করতে পাসওয়ার্ড দিন:
          </p>
          <div class="ebk-form-group">
            <label class="ebk-label">পাসওয়ার্ড লিখুন:</label>
            <input type="password" id="ebkAdminPassInput" class="ebk-input" placeholder="পাসওয়ার্ড লিখুন..." autofocus>
            <div id="ebkPassError" class="ebk-error-msg" style="display:none; margin-top:4px;">ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।</div>
          </div>
          <div class="ebk-modal-actions" style="margin-top:16px;">
            <button type="button" class="ebk-btn ebk-btn-primary" id="ebkSubmitLoginBtn">লগইন করুন</button>
            <button type="button" class="ebk-btn ebk-btn-outline" onclick="window.ebkCloseAdminModal()">বাতিল</button>
          </div>
        `;

        const passInput = body.querySelector('#ebkAdminPassInput');
        const submitBtn = body.querySelector('#ebkSubmitLoginBtn');
        const errDiv = body.querySelector('#ebkPassError');

        function doLogin() {
          const pass = (passInput.value || '').trim();
          if (pass === ADMIN_PASS) {
            localStorage.setItem('ebk_admin_pass', ADMIN_PASS);
            applyAdminModeUI();
            showToast('🎉 স্বাগতম! অ্যাডমিন এডিট মোড সক্রিয় হয়েছে।');
            closeAdminModal();
          } else {
            if (errDiv) errDiv.style.display = 'block';
            passInput.classList.add('error');
            passInput.focus();
          }
        }

        submitBtn.addEventListener('click', doLogin);
        passInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') doLogin();
        });
        setTimeout(() => passInput.focus(), 150);
      }

      backdrop.classList.add('open');
    }

    function closeAdminModal() {
      const backdrop = document.getElementById('ebkAdminModalBackdrop');
      if (backdrop) backdrop.classList.remove('open');
    }

    window.ebkOpenAdminModal = openAdminModal;
    window.ebkCloseAdminModal = closeAdminModal;

    // 7.3. Mini Inline Floating Toolbar
    function buildMiniToolbar() {
      if (document.getElementById('ebkMiniToolbar')) return;

      const tb = document.createElement('div');
      tb.id = 'ebkMiniToolbar';
      tb.className = 'ebk-mini-toolbar';
      tb.innerHTML = `
        <button type="button" class="ebk-tb-btn" data-cmd="bold" title="বোল্ড (Ctrl+B)"><b>B</b></button>
        <button type="button" class="ebk-tb-btn" data-cmd="italic" title="ইটালিক (Ctrl+I)"><i>I</i></button>
        <button type="button" class="ebk-tb-btn" data-cmd="underline" title="আন্ডারলাইন (Ctrl+U)"><u>U</u></button>
        <span class="ebk-tb-sep"></span>
        <div class="ebk-color-picker-wrap">
          <button type="button" class="ebk-tb-btn" id="ebkColorDropdownBtn" title="টেক্সট কালার">🎨</button>
          <div class="ebk-color-popover" id="ebkColorPopover">
            <span class="ebk-color-dot" data-color="#10b981" style="background:#10b981;" title="সবুজ"></span>
            <span class="ebk-color-dot" data-color="#0284c7" style="background:#0284c7;" title="নীল"></span>
            <span class="ebk-color-dot" data-color="#ef4444" style="background:#ef4444;" title="লাল"></span>
            <span class="ebk-color-dot" data-color="#f59e0b" style="background:#f59e0b;" title="হলুদ"></span>
            <span class="ebk-color-dot" data-color="#8b5cf6" style="background:#8b5cf6;" title="বেগুনি"></span>
            <span class="ebk-color-dot" data-color="inherit" style="background:#0f172a; border-color:#94a3b8;" title="ডিফল্ট"></span>
          </div>
        </div>
        <button type="button" class="ebk-tb-btn" id="ebkHighlightBtn" title="হলুদ হাইলাইট">🖍️</button>
        <button type="button" class="ebk-tb-btn" data-cmd="removeFormat" title="ফরম্যাটিং মুছুন">🧹</button>
        <span class="ebk-tb-sep"></span>
        <button type="button" class="ebk-tb-btn ebk-tb-done-btn" id="ebkDoneEditBtn" title="সম্পাদনা শেষ করুন">✓ শেষ</button>
      `;
      document.body.appendChild(tb);

      // Formatting commands
      tb.querySelectorAll('[data-cmd]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const cmd = btn.getAttribute('data-cmd');
          document.execCommand(cmd, false, null);
          markUnsavedEdit();
        });
      });

      // Color Palette click
      const popover = tb.querySelector('#ebkColorPopover');
      tb.querySelector('#ebkColorDropdownBtn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        popover.classList.toggle('open');
      });

      popover.querySelectorAll('.ebk-color-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          const color = dot.getAttribute('data-color');
          document.execCommand('foreColor', false, color);
          popover.classList.remove('open');
          markUnsavedEdit();
        });
      });

      // Highlight Marker click
      tb.querySelector('#ebkHighlightBtn').addEventListener('click', (e) => {
        e.preventDefault();
        document.execCommand('hiliteColor', false, '#fef08a');
        markUnsavedEdit();
      });

      // Done editing button
      tb.querySelector('#ebkDoneEditBtn').addEventListener('click', (e) => {
        e.preventDefault();
        finishEditing();
      });

      document.addEventListener('click', (e) => {
        if (!tb.contains(e.target)) popover.classList.remove('open');
      });
    }

    function positionToolbar(targetEl) {
      const tb = document.getElementById('ebkMiniToolbar');
      if (!tb || !targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      const tbWidth = 270;
      let top = rect.top - 46;
      let left = rect.left + (rect.width / 2) - (tbWidth / 2);

      if (top < 10) top = rect.bottom + 10;
      if (left < 10) left = 10;
      if (left + tbWidth > window.innerWidth - 10) left = window.innerWidth - tbWidth - 10;

      tb.style.top = `${Math.round(top)}px`;
      tb.style.left = `${Math.round(left)}px`;
      tb.classList.add('visible');
    }

    function hideToolbar() {
      const tb = document.getElementById('ebkMiniToolbar');
      if (tb) tb.classList.remove('visible');
    }

    function startEditing(targetEl) {
      buildMiniToolbar();
      if (activeEditableEl && activeEditableEl !== targetEl) {
        finishEditing();
      }

      activeEditableEl = targetEl;
      targetEl.setAttribute('contenteditable', 'true');
      targetEl.classList.add('ebk-is-editing');
      targetEl.focus();

      positionToolbar(targetEl);

      targetEl.addEventListener('input', markUnsavedEdit);
    }

    function finishEditing() {
      if (!activeEditableEl) return;
      activeEditableEl.removeAttribute('contenteditable');
      activeEditableEl.classList.remove('ebk-is-editing');
      hideToolbar();
      activeEditableEl = null;
    }

    // 7.4. Attach Edit Pencils to Question Text, Options, Explanations, Notes
    function attachEditPencils() {
      if (!isAdminLoggedIn()) return;

      const editSelectors = [
        '.q-text',
        '.question-text',
        '.review-q-text',
        '.opt-label-text',
        '.opt-txt',
        '.opt-text',
        '.option-text',
        '.exp-body-text',
        '.exp-content-box',
        '.exp-desc',
        '.exp-content',
        '.explanation-desc',
        '.sk-box',
        '.sk-sticky',
        '.sk-formula',
        '.sk-compare'
      ];

      const targets = document.querySelectorAll(editSelectors.join(', '));
      targets.forEach((el, idx) => {
        if (el.querySelector('.ebk-edit-trigger') || el.closest('.ebk-no-edit')) return;

        if (!el.getAttribute('data-ebk-eid')) {
          el.setAttribute('data-ebk-eid', `e_${idx}`);
        }

        const pencil = document.createElement('button');
        pencil.type = 'button';
        pencil.className = 'ebk-edit-trigger';
        pencil.title = 'টেক্সট বা কালার এডিট করুন';
        pencil.innerHTML = `✏️`;
        pencil.setAttribute('contenteditable', 'false');

        pencil.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          startEditing(el);
        });

        el.appendChild(pencil);
      });
    }

    function removeEditPencils() {
      document.querySelectorAll('.ebk-edit-trigger').forEach(p => p.remove());
      finishEditing();
    }

    // 7.5. Unsaved Edits Tracker & Floating Save Dock
    function markUnsavedEdit() {
      unsavedCount++;
      showSaveDock();
    }

    function buildSaveDock() {
      if (document.getElementById('ebkSaveDock')) return;

      const dock = document.createElement('div');
      dock.id = 'ebkSaveDock';
      dock.className = 'ebk-save-dock';
      dock.innerHTML = `
        <span class="ebk-save-status">
          <span class="dot live-pulse"></span>
          <span id="ebkSaveCountText">১টি সম্পাদনা অসংরক্ষিত</span>
        </span>
        <button type="button" class="ebk-save-btn" id="ebkSaveBtn">
          <span>💾 সেভ করুন</span>
        </button>
        <button type="button" class="ebk-save-btn-outline" id="ebkDownloadHtmlBtn" title="আপডেট করা HTML ফাইল ডাউনলোড করুন">
          <span>📥 ডাউনলোড</span>
        </button>
        <button type="button" class="ebk-save-close" id="ebkSaveDismissBtn" title="লুকান">✕</button>
      `;
      document.body.appendChild(dock);

      dock.querySelector('#ebkSaveBtn').addEventListener('click', executeSave);
      dock.querySelector('#ebkDownloadHtmlBtn').addEventListener('click', downloadCurrentHtml);
      dock.querySelector('#ebkSaveDismissBtn').addEventListener('click', () => {
        dock.classList.remove('visible');
      });
    }

    function showSaveDock() {
      buildSaveDock();
      const dock = document.getElementById('ebkSaveDock');
      const countText = document.getElementById('ebkSaveCountText');
      if (countText) {
        countText.textContent = `${unsavedCount}টি সম্পাদনা অসংরক্ষিত`;
      }
      if (dock) dock.classList.add('visible');
    }

    function hideSaveDock() {
      const dock = document.getElementById('ebkSaveDock');
      if (dock) dock.classList.remove('visible');
      unsavedCount = 0;
    }

    // 7.6. Save Execution (LocalStorage + GitHub API Commit)
    async function executeSave() {
      finishEditing();
      const saveBtn = document.getElementById('ebkSaveBtn');
      if (saveBtn) saveBtn.innerHTML = `<span>⏳ সেভ হচ্ছে...</span>`;

      // 1. Gather all edited nodes
      const editedElements = document.querySelectorAll('[data-ebk-eid]');
      const editSnapshot = {};
      editedElements.forEach(el => {
        const id = el.getAttribute('data-ebk-eid');
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.ebk-edit-trigger').forEach(p => p.remove());
        clone.removeAttribute('contenteditable');
        clone.classList.remove('ebk-is-editing');
        editSnapshot[id] = clone.innerHTML;
      });

      // Save locally for instant persistence
      try {
        localStorage.setItem(getPageKey(), JSON.stringify(editSnapshot));
      } catch (e) {}

      // 2. Check GitHub PAT for live commit to repository
      const pat = (localStorage.getItem('ebk_admin_pat') || '').trim();
      if (!pat) {
        if (saveBtn) saveBtn.innerHTML = `<span>💾 সেভ করুন</span>`;
        hideSaveDock();
        showToast('✅ ব্রাউজারে সফলভাবে সেভ হয়েছে! (গিটহাবে পুশ করতে লগইন ডায়ালগে টোকেন দিন)');
        return;
      }

      // Live GitHub API Commit
      try {
        const repo = 'site-doict/live-mcq';
        let rawPath = window.location.pathname.replace(/^\/+/, '');
        if (rawPath.startsWith('live-mcq/')) rawPath = rawPath.replace('live-mcq/', '');
        if (!rawPath || rawPath.endsWith('/')) rawPath += 'index.html';

        showToast('🚀 গিটহাবে পুশ করা হচ্ছে...');

        const getUrl = `https://api.github.com/repos/${repo}/contents/${rawPath}`;
        const getRes = await fetch(getUrl, {
          headers: {
            'Authorization': `token ${pat}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!getRes.ok) {
          throw new Error('গিটহাব থেকে ফাইল তথ্য পাওয়া যায়নি (' + getRes.status + ')');
        }

        const fileData = await getRes.json();
        const sha = fileData.sha;

        const docClone = document.documentElement.cloneNode(true);
        docClone.classList.remove('ebk-admin-active');
        docClone.querySelectorAll('.ebk-edit-trigger, #ebkMiniToolbar, #ebkSaveDock, #ebkAdminModalBackdrop').forEach(e => e.remove());
        docClone.querySelectorAll('[contenteditable]').forEach(e => {
          e.removeAttribute('contenteditable');
          e.classList.remove('ebk-is-editing');
        });

        const newContent = '<!DOCTYPE html>\n' + docClone.outerHTML;
        const b64Content = btoa(unescape(encodeURIComponent(newContent)));

        const putRes = await fetch(getUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${pat}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `docs: update ${rawPath} via live admin editor`,
            content: b64Content,
            sha: sha,
            branch: 'main'
          })
        });

        if (!putRes.ok) {
          const errBody = await putRes.json().catch(() => ({}));
          throw new Error(errBody.message || 'GitHub Commit Failed: ' + putRes.status);
        }

        showToast('🎉 গিটহাবে সফলভাবে সেভ ও পুশ সম্পন্ন হয়েছে! ১ মিনিটের মধ্যে লাইভ হবে।');
        hideSaveDock();
      } catch (err) {
        console.error('GitHub API Save Error:', err);
        showToast('⚠️ লোকাল সেভ হয়েছে, তবে গিটহাব পুশে সমস্যা: ' + err.message);
      } finally {
        if (saveBtn) saveBtn.innerHTML = `<span>💾 সেভ করুন</span>`;
      }
    }

    // 7.7. Offline HTML File Download Backup
    function downloadCurrentHtml() {
      finishEditing();
      const docClone = document.documentElement.cloneNode(true);
      docClone.classList.remove('ebk-admin-active');
      docClone.querySelectorAll('.ebk-edit-trigger, #ebkMiniToolbar, #ebkSaveDock, #ebkAdminModalBackdrop').forEach(e => e.remove());
      docClone.querySelectorAll('[contenteditable]').forEach(e => {
        e.removeAttribute('contenteditable');
        e.classList.remove('ebk-is-editing');
      });

      const blob = new Blob(['<!DOCTYPE html>\n' + docClone.outerHTML], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      const filename = (window.location.pathname.split('/').pop() || 'index.html');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('📥 ফাইলটি সফলভাবে ডাউনলোড হয়েছে!');
    }

    // 7.8. Restore Saved Edits on Page Load
    function restoreSavedEdits() {
      try {
        const raw = localStorage.getItem(getPageKey());
        if (!raw) return;
        const edits = JSON.parse(raw);
        Object.keys(edits).forEach(id => {
          const el = document.querySelector(`[data-ebk-eid="${id}"]`);
          if (el) {
            el.innerHTML = edits[id];
          }
        });
      } catch (e) {}
    }

    // Initialize Admin Editor Engine
    injectLoginButtons();
    restoreSavedEdits();
    applyAdminModeUI();
  }

  // 8. Initialize on DOM ready
  function initEbkModes() {
    injectStyles();
    buildInPageControls();
    setupSmartScrollDock();
    setupAdminLiveEditor();
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

