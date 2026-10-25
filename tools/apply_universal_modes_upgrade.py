import sys

with open('universal-modes.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. New CSS for Admin, Topbars, and Sticky Save Dock
new_css = r'''      /* Admin Login & Live Mini Editor System */
      .ebk-admin-login-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 44px;
        min-width: 44px;
        padding: 0 14px;
        font-size: 0.84rem;
        font-weight: 700;
        border-radius: 999px;
        border: 1px solid var(--border-color, #cbd5e1);
        background: rgba(255, 255, 255, 0.9);
        color: #0f172a;
        cursor: pointer;
        position: relative;
        flex-shrink: 0;
        touch-action: manipulation;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
      [data-theme="dark"] .ebk-admin-login-btn,
      .dark .ebk-admin-login-btn {
        background: rgba(30, 41, 59, 0.9);
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
      @media (max-width: 640px) {
        .ebk-admin-login-btn {
          width: 44px !important;
          height: 44px !important;
          min-width: 44px !important;
          min-height: 44px !important;
          padding: 0 !important;
          border-radius: 50% !important;
        }
        .ebk-admin-login-btn .ebk-login-txt {
          display: none !important;
        }
      }
      .ebk-login-dot {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        border: 1.5px solid #ffffff;
        box-shadow: 0 0 6px #10b981;
      }
      .ebk-admin-floating-btn {
        position: fixed;
        bottom: 20px;
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

      /* Mini 1-Line Floating Toolbar with Math Preview */
      .ebk-mini-toolbar {
        position: fixed;
        display: flex;
        flex-direction: column;
        gap: 6px;
        background: #0f172a;
        color: #f8fafc;
        border-radius: 14px;
        padding: 6px 10px;
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
      .ebk-tb-row {
        display: flex;
        align-items: center;
        gap: 3px;
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
      .ebk-tb-math-preview {
        display: none;
        background: rgba(30, 41, 59, 0.9);
        border: 1px solid #475569;
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 0.84rem;
        max-width: 320px;
        overflow-x: auto;
      }
      .ebk-tb-math-preview.active {
        display: block;
      }

      /* Sticky Bottom Save Dock with Safe Area Support */
      .ebk-save-dock {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        max-width: 100vw;
        box-sizing: border-box;
        transform: translateY(120%);
        background: rgba(15, 23, 42, 0.96);
        color: #ffffff;
        border-top: 2px solid #0284c7;
        border-radius: 16px 16px 0 0;
        padding: 10px 18px max(14px, env(safe-area-inset-bottom, 12px));
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.45);
        z-index: 999990;
        opacity: 0;
        pointer-events: none;
        transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      .ebk-save-dock.visible {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
      }
      .ebk-save-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.88rem;
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
        min-height: 44px;
        padding: 10px 20px;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.9rem;
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
        min-height: 44px;
        padding: 8px 16px;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
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

      /* In-Line Correct Option Toggle */
      .ebk-correct-toggle {
        display: none;
      }
      .ebk-admin-active .ebk-correct-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #10b981;
        color: #ffffff;
        border: 2px solid #ffffff;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 900;
        margin-left: auto;
        box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
        transition: transform 0.15s ease, background 0.15s ease;
      }
      .ebk-admin-active .ebk-correct-toggle:hover {
        transform: scale(1.15);
        background: #059669;
      }

      /* KaTeX Mobile Display Overflow */
      .katex-display {
        overflow-x: auto !important;
        overflow-y: hidden !important;
        -webkit-overflow-scrolling: touch !important;
        padding: 4px 0 !important;
        max-width: 100% !important;
      }

      /* Universal Mobile Topbar Safeguards across all chapter architectures */
      @media (max-width: 640px) {
        .top-nav, .top-control-bar, .score-bar {
          padding: 8px 10px !important;
          gap: 6px !important;
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: 100vw !important;
        }
        .top-nav .nav-left, .top-nav .nav-back {
          max-width: 120px !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-overflow: ellipsis !important;
          font-size: 0.82rem !important;
        }
        .top-nav .nav-left span, .top-nav .back-btn span {
          font-size: 0.8rem !important;
        }
        .top-nav .nav-actions, .top-nav .nav-controls {
          gap: 3px !important;
          flex-shrink: 0 !important;
        }
        .top-nav .btn-tool, .top-nav .ctrl-btn {
          padding: 4px 6px !important;
          min-width: 28px !important;
          height: 34px !important;
          font-size: 0.8rem !important;
        }
      }
      @media (max-width: 390px) {
        .top-nav .nav-left, .top-nav .nav-back {
          max-width: 90px !important;
        }
        .top-nav .btn-tool#btnFontReset,
        .top-nav .ctrl-btn:nth-child(2) {
          display: none !important;
        }
      }
      @media (max-width: 320px) {
        .top-nav .nav-left, .top-nav .nav-back {
          max-width: 65px !important;
        }
      }'''

# 2. New setupAdminLiveEditor code
new_admin = r'''  // 7. Admin Live Editor & In-Browser CMS Engine (Password: 4991)
  function setupAdminLiveEditor() {
    const ADMIN_PASS = '4991';
    let activeEditableEl = null;
    let unsavedCount = 0;

    // Safety beforeunload warning for unsaved changes
    window.addEventListener('beforeunload', function(e) {
      if (unsavedCount > 0) {
        e.preventDefault();
        e.returnValue = 'আপনার অসংরক্ষিত সম্পাদনা রয়েছে। পেজ ছাড়লে তা হারিয়ে যেতে পারে।';
        return e.returnValue;
      }
    });

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
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg><span class="ebk-login-dot"></span><span class="ebk-login-txt">এডিট মোড</span>`;
          btn.title = 'অ্যাডমিন সক্রিয় (ক্লিক করে সেটিংস বা লগআউট)';
        } else {
          btn.classList.remove('ebk-admin-active-badge');
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg><span class="ebk-login-txt">লগইন</span>`;
          btn.title = 'অ্যাডমিন লগইন (পাসওয়ার্ড দিন)';
        }
      });

      // Also update drawer secondary buttons
      document.querySelectorAll('.ebk-drawer-login-btn').forEach(btn => {
        if (isLoggedIn) {
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> ✏️ এডিট মোড সক্রিয় (লগআউট / সেটিংস)`;
        } else {
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> 🔐 অ্যাডমিন লগইন`;
        }
      });
    }

    // 7.1. Create Topbar & Drawer Buttons
    function injectLoginButtons() {
      // Topbar injection
      let btn = document.getElementById('ebkAdminLoginBtn');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'ebkAdminLoginBtn';
        btn.className = 'ebk-admin-login-btn';
        btn.setAttribute('aria-label', 'লগইন ও অ্যাডমিন মোড');
        btn.title = 'অ্যাডমিন লগইন (পাসওয়ার্ড দিন)';
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg><span class="ebk-login-txt">লগইন</span>`;
        btn.addEventListener('click', openAdminModal);

        // Targeted priority order: action button groups first, then top-level bars
        const headerActions = document.querySelector('.nav-actions, .nav-controls, .topbar-actions, .ebk-bar-right, .top-action-bar, .app-topbar .topbar-actions, header .font-controls, .brand-wrap, .quiz-toolbar, .topbar-inner, .top-nav, header');
        if (headerActions) {
          headerActions.appendChild(btn);
        } else {
          btn.classList.add('ebk-admin-floating-btn');
          document.body.appendChild(btn);
        }
      }

      // Drawer Secondary Injection
      const drawerMenu = document.querySelector('#menuDrawer, .menu-drawer, #ebk-drawer, .ebk-drawer, .drawer-content, .offcanvas-body');
      if (drawerMenu && !drawerMenu.querySelector('.ebk-drawer-login-item')) {
        const item = document.createElement('div');
        item.className = 'menu-group ebk-drawer-login-item';
        item.style.marginTop = '16px';
        item.style.paddingTop = '12px';
        item.style.borderTop = '1px solid var(--border, rgba(255,255,255,0.1))';
        item.innerHTML = `
          <div class="menu-label" style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-subtle, #94a3b8); margin-bottom:6px;">প্রশাসনিক নিয়ন্ত্রণ:</div>
          <button type="button" class="btn btn-secondary btn-block ebk-drawer-login-btn" style="width:100%; min-height:44px; font-weight:600; display:flex; align-items:center; justify-content:center; gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span class="ebk-drawer-login-txt">🔐 অ্যাডমিন লগইন</span>
          </button>
        `;
        item.querySelector('.ebk-drawer-login-btn').addEventListener('click', () => {
          if (window.closeMenu) window.closeMenu();
          const ebkClose = document.getElementById('ebk-drawer-close');
          if (ebkClose) ebkClose.click();
          openAdminModal();
        });
        drawerMenu.appendChild(item);
      }

      updateLoginButton(isAdminLoggedIn());
    }

    // 7.2. Admin Modal Component
    function buildAdminModal() {
      if (document.getElementById('ebkAdminModalBackdrop')) return;

      const backdrop = document.createElement('div');
      backdrop.id = 'ebkAdminModalBackdrop';
      backdrop.className = 'ebk-admin-modal-backdrop';
      backdrop.innerHTML = `
        <div class="ebk-admin-modal" role="dialog" aria-modal="true" aria-labelledby="ebkModalTitleText">
          <div class="ebk-admin-modal-header">
            <div class="ebk-admin-modal-title">
              <span id="ebkModalTitleIcon">🔐</span>
              <span id="ebkModalTitleText">অ্যাডমিন কন্ট্রোল সেন্টার</span>
            </div>
            <button type="button" class="ebk-modal-close-btn" id="ebkAdminModalCloseBtn">&times;</button>
          </div>

          <div class="ebk-admin-modal-body" id="ebkAdminModalBody">
            <!-- Dynamic Content -->
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);

      backdrop.querySelector('#ebkAdminModalCloseBtn').addEventListener('click', closeAdminModal);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeAdminModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAdminModal();
      });
    }

    function openAdminModal() {
      buildAdminModal();
      const backdrop = document.getElementById('ebkAdminModalBackdrop');
      const body = document.getElementById('ebkAdminModalBody');
      const title = document.getElementById('ebkModalTitleText');
      const icon = document.getElementById('ebkModalTitleIcon');

      const isLoggedIn = isAdminLoggedIn();
      const currentPat = localStorage.getItem('ebk_admin_pat') || '';

      if (isLoggedIn) {
        icon.textContent = '✏️';
        title.textContent = 'লাইভ এডিটর সক্রিয়';
        body.innerHTML = `
          <div class="ebk-modal-intro">
            আপনি বর্তমানে <strong>অ্যাডমিন মোডে</strong> আছেন। পেজের যেকোনো প্রশ্ন, অপশন, <strong>বিশদ ব্যাখ্যা</strong> এবং অধ্যায়ের নোটের পাশে পেনসিল (✏️) আইকনে ক্লিক করে সরাসরি এডিট করতে পারবেন। এছাড়া অপশনের পাশে থাকা (✓) চিহ্নে ক্লিক করে সঠিক উত্তর পরিবর্তন করতে পারবেন।
          </div>

          <div class="ebk-form-group" style="margin-bottom: 14px;">
            <label class="ebk-label" for="ebkGitHubPatInput">GitHub Personal Access Token (ঐচ্ছিক):</label>
            <input type="password" id="ebkGitHubPatInput" class="ebk-input" placeholder="ghp_xxxxxxxxxxxx" value="${currentPat}">
            <span class="ebk-help-text">টোকেন দিলে আপনার করা প্রতিটি সেভ সরাসরি গিটহাব রিপোজিটরিতে (<code style="background:rgba(148,163,184,0.15); padding:2px 4px; border-radius:4px;">site-doict/live-mcq</code>) কমিট হয়ে লাইভ হয়ে যাবে। টোকেন না থাকলে ব্রাউজারের লোকাল স্টোরেজে সংরক্ষিত থাকবে।</span>
          </div>

          <div class="ebk-modal-actions">
            <button type="button" class="ebk-btn ebk-btn-outline" id="ebkSavePatBtn">টোকেন সংরক্ষণ</button>
            <button type="button" class="ebk-btn ebk-btn-danger" id="ebkLogoutBtn">লগআউট</button>
          </div>
        `;

        body.querySelector('#ebkSavePatBtn').addEventListener('click', () => {
          const val = (body.querySelector('#ebkGitHubPatInput').value || '').trim();
          if (val) {
            localStorage.setItem('ebk_admin_pat', val);
            showToast('✅ GitHub টোকেন সংরক্ষিত হয়েছে!');
          } else {
            localStorage.removeItem('ebk_admin_pat');
            showToast('ℹ️ GitHub টোকেন মুছে ফেলা হয়েছে।');
          }
        });

        body.querySelector('#ebkLogoutBtn').addEventListener('click', () => {
          localStorage.removeItem('ebk_admin_pass');
          applyAdminModeUI();
          closeAdminModal();
          showToast('👋 সফলভাবে লগআউট করা হয়েছে।');
        });
      } else {
        icon.textContent = '🔐';
        title.textContent = 'অ্যাডমিন লগইন';
        body.innerHTML = `
          <div class="ebk-modal-intro">
            প্রশ্নব্যাংক, অপশন ও বিশদ ব্যাখ্যা সংশোধন করতে অ্যাডমিন পাসওয়ার্ড প্রদান করুন।
          </div>

          <div class="ebk-form-group" style="margin-bottom: 14px;">
            <label class="ebk-label" for="ebkAdminPassInput">মাস্টার পাসওয়ার্ড:</label>
            <input type="password" id="ebkAdminPassInput" class="ebk-input" placeholder="পাসওয়ার্ড লিখুন..." autocomplete="current-password">
            <span class="ebk-error-msg" id="ebkPassError" style="display: none;">ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।</span>
          </div>

          <div class="ebk-modal-actions">
            <button type="button" class="ebk-btn ebk-btn-outline" id="ebkCancelLoginBtn">বাতিল</button>
            <button type="button" class="ebk-btn ebk-btn-primary" id="ebkSubmitLoginBtn">লগইন করুন</button>
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
            closeAdminModal();
            showToast('🎉 সফলভাবে অ্যাডমিন হিসেবে লগইন হয়েছে! এখন যেকোনো ব্যাখ্যা বা প্রশ্ন এডিট করুন।');
          } else {
            passInput.classList.add('error');
            errDiv.style.display = 'block';
            passInput.focus();
          }
        }

        submitBtn.addEventListener('click', doLogin);
        passInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') doLogin();
        });
        body.querySelector('#ebkCancelLoginBtn').addEventListener('click', closeAdminModal);
        setTimeout(() => passInput.focus(), 100);
      }

      backdrop.classList.add('open');
    }

    function closeAdminModal() {
      const backdrop = document.getElementById('ebkAdminModalBackdrop');
      if (backdrop) backdrop.classList.remove('open');
    }

    // 7.3. Mini Floating Formatting Toolbar with KaTeX Math Live Preview
    function buildMiniToolbar() {
      if (document.getElementById('ebkMiniToolbar')) return;

      const tb = document.createElement('div');
      tb.id = 'ebkMiniToolbar';
      tb.className = 'ebk-mini-toolbar';
      tb.innerHTML = `
        <div class="ebk-tb-row">
          <button type="button" class="ebk-tb-btn" data-cmd="bold" title="বোল্ড (Ctrl+B)"><b>B</b></button>
          <button type="button" class="ebk-tb-btn" data-cmd="italic" title="ইটালিক (Ctrl+I)"><i>I</i></button>
          <button type="button" class="ebk-tb-btn" data-cmd="underline" title="আন্ডারলাইন (Ctrl+U)"><u>U</u></button>
          <span class="ebk-tb-sep"></span>
          <div class="ebk-color-picker-wrap">
            <button type="button" class="ebk-tb-btn" id="ebkColorTriggerBtn" title="রং পরিবর্তন">🎨</button>
            <div class="ebk-color-popover" id="ebkColorPopover">
              <span class="ebk-color-dot" style="background:#ef4444;" data-color="#ef4444" title="লাল"></span>
              <span class="ebk-color-dot" style="background:#10b981;" data-color="#10b981" title="সবুজ"></span>
              <span class="ebk-color-dot" style="background:#0284c7;" data-color="#0284c7" title="নীল"></span>
              <span class="ebk-color-dot" style="background:#f59e0b;" data-color="#f59e0b" title="হলুদ"></span>
              <span class="ebk-color-dot" style="background:#8b5cf6;" data-color="#8b5cf6" title="বেগুনি"></span>
              <span class="ebk-color-dot" style="background:#0f172a;" data-color="#0f172a" title="ডিফল্ট"></span>
            </div>
          </div>
          <button type="button" class="ebk-tb-btn" data-cmd="removeFormat" title="ফরম্যাট বাতিল">✕</button>
          <span class="ebk-tb-sep"></span>
          <button type="button" class="ebk-tb-btn ebk-tb-done-btn" id="ebkDoneEditingBtn">সম্পন্ন</button>
        </div>
        <div class="ebk-tb-math-preview" id="ebkMathPreview"></div>
      `;
      document.body.appendChild(tb);

      tb.querySelectorAll('[data-cmd]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const cmd = btn.getAttribute('data-cmd');
          document.execCommand(cmd, false, null);
          markUnsavedEdit();
        });
      });

      const colorBtn = tb.querySelector('#ebkColorTriggerBtn');
      const popover = tb.querySelector('#ebkColorPopover');
      colorBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        popover.classList.toggle('open');
      });

      popover.querySelectorAll('.ebk-color-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const color = dot.getAttribute('data-color');
          document.execCommand('foreColor', false, color);
          popover.classList.remove('open');
          markUnsavedEdit();
        });
      });

      tb.querySelector('#ebkDoneEditingBtn').addEventListener('click', finishEditing);
    }

    function updateMathPreview(targetEl) {
      const preview = document.getElementById('ebkMathPreview');
      if (!preview || !targetEl) return;
      const text = targetEl.innerText || targetEl.textContent || '';
      if (text.includes('\\(') || text.includes('\\[') || text.includes('\\frac') || text.includes('\\sqrt') || text.includes('^') || text.includes('_')) {
        preview.classList.add('active');
        preview.innerHTML = `<strong>গণিত প্রিভিউ:</strong> <span>${text}</span>`;
        if (typeof window.renderMathEverywhere === 'function') {
          window.renderMathEverywhere(preview);
        }
      } else {
        preview.classList.remove('active');
        preview.innerHTML = '';
      }
    }

    function positionToolbar(targetEl) {
      const tb = document.getElementById('ebkMiniToolbar');
      if (!tb || !targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      const tbWidth = 280;
      let top = rect.top - 60;
      let left = rect.left + (rect.width / 2) - (tbWidth / 2);

      if (top < 10) top = rect.bottom + 10;
      if (left < 10) left = 10;
      if (left + tbWidth > window.innerWidth - 10) left = window.innerWidth - tbWidth - 10;

      tb.style.top = `${top}px`;
      tb.style.left = `${left}px`;
      tb.classList.add('visible');
    }

    function hideToolbar() {
      const tb = document.getElementById('ebkMiniToolbar');
      if (tb) tb.classList.remove('visible');
    }

    function startEditing(targetEl) {
      if (activeEditableEl && activeEditableEl !== targetEl) {
        finishEditing();
      }

      // Automatically expand collapsed drawer if editing an explanation
      const parentDrawer = targetEl.closest('.exp-drawer, .explanation-drawer, .explanation-box, .ans-drawer');
      if (parentDrawer) {
        parentDrawer.style.display = 'block';
        parentDrawer.style.maxHeight = 'none';
        parentDrawer.style.opacity = '1';
        parentDrawer.classList.add('open');
      }

      activeEditableEl = targetEl;
      targetEl.setAttribute('contenteditable', 'true');
      targetEl.classList.add('ebk-is-editing');
      targetEl.focus();

      buildMiniToolbar();
      positionToolbar(targetEl);
      updateMathPreview(targetEl);

      targetEl.oninput = () => {
        markUnsavedEdit();
        updateMathPreview(targetEl);
      };
    }

    function finishEditing() {
      if (!activeEditableEl) return;
      activeEditableEl.removeAttribute('contenteditable');
      activeEditableEl.classList.remove('ebk-is-editing');
      hideToolbar();
      // Re-render math inside active editable element
      if (typeof window.renderMathEverywhere === 'function') {
        window.renderMathEverywhere(activeEditableEl);
      }
      activeEditableEl = null;
    }

    const editSelectors = [
        '.q-text',
        '.question-text',
        '.review-q-text',
        '.mcq-text',
        '.opt-label-text',
        '.opt-txt',
        '.opt-text',
        '.option-text',
        '.exp-body-text',
        '.exp-content-box',
        '.exp-desc',
        '.exp-content',
        '.explanation-desc',
        '.exp-drawer',
        '.exp-drawer p',
        '.explanation-drawer',
        '.explanation-drawer p',
        '.explanation-box',
        '.explanation-box p',
        '.ans-drawer',
        '.ans-text',
        '.quiz-explanation',
        '.quiz-expl',
        '.sk-box',
        '.sk-sticky',
        '.sk-formula',
        '.sk-compare',
        '.theory-box',
        '.theory-card'
      ];

    function ensureElementEids() {
      const targets = document.querySelectorAll(editSelectors.join(', '));
      targets.forEach((el, idx) => {
        if (!el.getAttribute('data-ebk-eid')) {
          el.setAttribute('data-ebk-eid', e_);
        }
      });
    }

    // 7.4. Attach Edit Pencils to Question Text, Options, Explanations, Notes
    function attachEditPencils() {
      if (!isAdminLoggedIn()) return;
      ensureElementEids();

      const _dummy = [
        '.q-text',
        '.question-text',
        '.review-q-text',
        '.mcq-text',
        '.opt-label-text',
        '.opt-txt',
        '.opt-text',
        '.option-text',
        '.exp-body-text',
        '.exp-content-box',
        '.exp-desc',
        '.exp-content',
        '.explanation-desc',
        '.exp-drawer',
        '.exp-drawer p',
        '.explanation-drawer',
        '.explanation-drawer p',
        '.explanation-box',
        '.explanation-box p',
        '.ans-drawer',
        '.ans-text',
        '.quiz-explanation',
        '.quiz-expl',
        '.sk-box',
        '.sk-sticky',
        '.sk-formula',
        '.sk-compare',
        '.theory-box',
        '.theory-card'
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

      // Attach correct answer radio/toggle to options in edit mode
      document.querySelectorAll('.opt-btn, .option-btn, .q-opt, .review-opt-box').forEach(opt => {
        if (opt.querySelector('.ebk-correct-toggle')) return;
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'ebk-correct-toggle';
        toggleBtn.title = 'এই অপশনটিকে সঠিক উত্তর হিসেবে নির্বাচন করুন';
        toggleBtn.innerHTML = '✓';
        toggleBtn.setAttribute('contenteditable', 'false');
        toggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const container = opt.closest('.opt-grid, .options-grid, .options, .review-options') || opt.parentElement;
          if (container) {
            container.querySelectorAll('.opt-btn, .option-btn, .q-opt, .review-opt-box').forEach(s => {
              s.removeAttribute('data-is-correct');
              s.classList.remove('is-correct');
            });
          }
          opt.setAttribute('data-is-correct', 'true');
          opt.classList.add('is-correct');
          markUnsavedEdit();
          showToast('🎯 সঠিক উত্তর আপডেট করা হয়েছে!');
        });
        opt.appendChild(toggleBtn);
      });
    }

    function removeEditPencils() {
      document.querySelectorAll('.ebk-edit-trigger, .ebk-correct-toggle').forEach(p => p.remove());
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
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="ebk-save-btn" id="ebkSaveBtn">
            <span>💾 সেভ করুন</span>
          </button>
          <button type="button" class="ebk-save-btn-outline" id="ebkCancelEditsBtn" title="বাতিল করুন ও রিলোড দিন">
            <span>বাতিল</span>
          </button>
          <button type="button" class="ebk-save-close" id="ebkSaveDismissBtn" title="লুকান">✕</button>
        </div>
      `;
      document.body.appendChild(dock);

      dock.querySelector('#ebkSaveBtn').addEventListener('click', executeSave);
      dock.querySelector('#ebkCancelEditsBtn').addEventListener('click', () => {
        if (confirm('অসংরক্ষিত পরিবর্তন বাতিল করে পেজ পুনরায় লোড করতে চান?')) {
          unsavedCount = 0;
          window.location.reload();
        }
      });
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
        clone.querySelectorAll('.ebk-edit-trigger, .ebk-correct-toggle').forEach(p => p.remove());
        clone.removeAttribute('contenteditable');
        clone.classList.remove('ebk-is-editing');
        editSnapshot[id] = clone.innerHTML;
      });

      // Save locally for instant persistence
      try {
        localStorage.setItem(getPageKey(), JSON.stringify(editSnapshot));
      } catch (e) {
        console.error('LocalStorage write error:', e);
      }

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
        docClone.querySelectorAll('.ebk-edit-trigger, .ebk-correct-toggle, #ebkMiniToolbar, #ebkSaveDock, #ebkAdminModalBackdrop').forEach(e => e.remove());
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

        showToast('🎉 গিটহাবে সফলভাবে সেভ ও পুশ সম্পন্ন হয়েছে!');
        hideSaveDock();
      } catch (err) {
        console.error('GitHub API Save Error:', err);
        showToast('⚠️ লোকাল সেভ হয়েছে, তবে গিটহাব পুশে সমস্যা: ' + err.message);
      } finally {
        if (saveBtn) saveBtn.innerHTML = `<span>💾 সেভ করুন</span>`;
      }
    }

    // 7.7. Restore Saved Edits on Page Load
    function restoreSavedEdits() {
      try {
        const raw = localStorage.getItem(getPageKey());
        if (!raw) return;
        const edits = JSON.parse(raw);
        let restoredCount = 0;
        Object.keys(edits).forEach(id => {
          const el = document.querySelector(`[data-ebk-eid="${id}"]`);
          if (el) {
            el.innerHTML = edits[id];
            restoredCount++;
          }
        });
        if (restoredCount > 0) {
          console.log(`[EBook Admin] Restored ${restoredCount} saved edits for ${getPageKey()}`);
          if (typeof window.renderMathEverywhere === 'function') {
            window.renderMathEverywhere();
          }
        }
      } catch (e) {
        console.warn('Error restoring saved edits:', e);
      }
    }

    // Initialize Admin Editor Engine
    ensureElementEids();
    buildAdminModal();
    injectLoginButtons();
    restoreSavedEdits();
    applyAdminModeUI();
  }'''

# Replace CSS
css_start_marker = '      /* Admin Login & Live Mini Editor System */'
css_end_marker = '    `;\n    document.head.appendChild(style);'

c_start = code.find(css_start_marker)
c_end = code.find(css_end_marker)

if c_start != -1 and c_end != -1:
    code = code[:c_start] + new_css + '\n' + code[c_end:]
    print("Replaced CSS successfully.")
else:
    print(f"CSS markers not found: c_start={c_start}, c_end={c_end}")
    sys.exit(1)

# Replace setupAdminLiveEditor
admin_start_marker = '  // 7. Admin Live Editor & In-Browser CMS Engine (Password: 4991)'
admin_end_marker = '  // 8. Initialize on DOM ready'

a_start = code.find(admin_start_marker)
a_end = code.find(admin_end_marker)

if a_start != -1 and a_end != -1:
    code = code[:a_start] + new_admin + '\n\n' + code[a_end:]
    print("Replaced setupAdminLiveEditor successfully.")
else:
    print(f"Admin markers not found: a_start={a_start}, a_end={a_end}")
    sys.exit(1)

with open('universal-modes.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved universal-modes.js successfully.")
