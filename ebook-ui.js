/**
 * BCS Smart E-Book Library - Unified Modern Design System Script
 * Shared script for Master index & all subject sub-indexes.
 */

(function () {
  'use strict';

  // ─── 1. Canonical Subject Registry ───
  const SUBJECT_REGISTRY = [
    // ক্যাডার প্রশ্নব্যাংক (১২টি বিষয়)
    {
      id: 'bangla-language',
      folder: 'Live MCQ Bangla Language',
      bnName: 'বাংলা ভাষা ও ব্যাকরণ',
      enName: 'Bangla Language',
      group: 'cadre',
      examSubject: 'Bangla Language'
    },
    {
      id: 'bangla-literature',
      folder: 'Live MCQ Bangla Literature',
      bnName: 'বাংলা সাহিত্য',
      enName: 'Bangla Literature',
      group: 'cadre',
      examSubject: 'Bangla Literature'
    },
    {
      id: 'bangladesh',
      folder: 'Live MCQ Bangladesh',
      bnName: 'বাংলাদেশ বিষয়াবলি',
      enName: 'Bangladesh Affairs',
      group: 'cadre',
      examSubject: 'Bangladesh'
    },
    {
      id: 'international',
      folder: 'Live MCQ International',
      bnName: 'আন্তর্জাতিক বিষয়াবলি',
      enName: 'International Affairs',
      group: 'cadre',
      examSubject: 'International'
    },
    {
      id: 'english-grammar',
      folder: 'Live MCQ English Grammar',
      bnName: 'English Grammar',
      enName: 'English Grammar',
      group: 'cadre',
      examSubject: 'English Grammar'
    },
    {
      id: 'english-literature',
      folder: 'Live MCQ English Literature',
      bnName: 'English Literature',
      enName: 'English Literature',
      group: 'cadre',
      examSubject: 'English Literature'
    },
    {
      id: 'geography',
      folder: 'Live MCQ Geography',
      bnName: 'ভূগোল ও দুর্যোগ ব্যবস্থাপনা',
      enName: 'Geography',
      group: 'cadre',
      examSubject: 'Geography'
    },
    {
      id: 'general-science',
      folder: 'Live MCQ General Science',
      bnName: 'সাধারণ বিজ্ঞান',
      enName: 'General Science',
      group: 'cadre',
      examSubject: 'General Science'
    },
    {
      id: 'computer-it',
      folder: 'Live MCQ Computer & IT',
      bnName: 'কম্পিউটার ও তথ্যপ্রযুক্তি',
      enName: 'Computer & IT',
      group: 'cadre',
      examSubject: 'Computer & IT'
    },
    {
      id: 'mathematical-reasoning',
      folder: 'Live MCQ Mathematical Reasoning',
      bnName: 'গাণিতিক যুক্তি',
      enName: 'Mathematical Reasoning',
      group: 'cadre',
      examSubject: 'Mathematical Reasoning'
    },
    {
      id: 'mental-ability',
      folder: 'Live MCQ Mental Ability',
      bnName: 'মানসিক দক্ষতা',
      enName: 'Mental Ability',
      group: 'cadre',
      examSubject: 'Mental Ability'
    },
    {
      id: 'ethics-governance',
      folder: 'Live MCQ Ethics & Good Governance',
      bnName: 'নৈতিকতা, মূল্যবোধ ও সুশাসন',
      enName: 'Ethics & Good Governance',
      group: 'cadre',
      examSubject: 'Ethics & Good Governance'
    },
    // নন-ক্যাডার প্রশ্নব্যাংক (১৪টি বিষয়)
    {
      id: 'non-cadre-bangla-grammar',
      folder: 'Non Cadre Bangla Grammar',
      bnName: 'পিএসসি নন-ক্যাডার বাংলা ব্যাকরণ',
      enName: 'Non Cadre Bangla Grammar',
      group: 'non-cadre',
      examSubject: 'Non Cadre Bangla Grammar'
    },
    {
      id: 'non-cadre-bangla-literature',
      folder: 'Non Cadre Bangla Literature',
      bnName: 'পিএসসি নন-ক্যাডার বাংলা সাহিত্য',
      enName: 'Non Cadre Bangla Literature',
      group: 'non-cadre',
      examSubject: 'Non Cadre Bangla Literature'
    },
    {
      id: 'non-cadre-english',
      folder: 'Non Cadre English',
      bnName: 'পিএসসি নন-ক্যাডার ইংরেজি',
      enName: 'Non Cadre English',
      group: 'non-cadre',
      examSubject: 'Non Cadre English'
    },
    {
      id: 'non-cadre-bangladesh',
      folder: 'Non Cadre Bangladesh',
      bnName: 'পিএসসি নন-ক্যাডার বাংলাদেশ বিষয়াবলি',
      enName: 'Non Cadre Bangladesh Affairs',
      group: 'non-cadre',
      examSubject: 'Non Cadre Bangladesh'
    },
    {
      id: 'non-cadre-international',
      folder: 'Non Cadre International',
      bnName: 'পিএসসি নন-ক্যাডার আন্তর্জাতিক বিষয়াবলি',
      enName: 'Non Cadre International Affairs',
      group: 'non-cadre',
      examSubject: 'Non Cadre International'
    },
    {
      id: 'non-cadre-general-science',
      folder: 'Non Cadre General Science',
      bnName: 'পিএসসি নন-ক্যাডার সাধারণ বিজ্ঞান',
      enName: 'Non Cadre General Science',
      group: 'non-cadre',
      examSubject: 'Non Cadre General Science'
    },
    {
      id: 'non-cadre-computer-it',
      folder: 'Non Cadre Computer & IT',
      bnName: 'পিএসসি নন-ক্যাডার কম্পিউটার ও আইটি',
      enName: 'Non Cadre Computer & IT',
      group: 'non-cadre',
      examSubject: 'Non Cadre Computer & IT'
    },
    {
      id: 'non-cadre-arithmetic',
      folder: 'Non Cadre Arithmetic',
      bnName: 'পিএসসি নন-ক্যাডার পাটিগণিত',
      enName: 'Non Cadre Arithmetic',
      group: 'non-cadre',
      examSubject: 'Non Cadre Arithmetic'
    },
    {
      id: 'non-cadre-algebra',
      folder: 'Non Cadre Algebra',
      bnName: 'পিএসসি নন-ক্যাডার বীজগণিত',
      enName: 'Non Cadre Algebra',
      group: 'non-cadre',
      examSubject: 'Non Cadre Algebra'
    },
    {
      id: 'non-cadre-geometry',
      folder: 'Non Cadre Geometry',
      bnName: 'পিএসসি নন-ক্যাডার জ্যামিতি',
      enName: 'Non Cadre Geometry',
      group: 'non-cadre',
      examSubject: 'Non Cadre Geometry'
    },
    {
      id: 'non-cadre-trigonometry',
      folder: 'Non Cadre Trigonometry & Higher Math',
      bnName: 'পিএসসি নন-ক্যাডার ত্রিকোণমিতি ও উচ্চতর গণিত',
      enName: 'Non Cadre Trigonometry & Higher Math',
      group: 'non-cadre',
      examSubject: 'Non Cadre Trigonometry & Higher Math'
    },
    {
      id: 'non-cadre-mental-ability',
      folder: 'Non Cadre Mental Ability',
      bnName: 'পিএসসি নন-ক্যাডার মানসিক দক্ষতা',
      enName: 'Non Cadre Mental Ability',
      group: 'non-cadre',
      examSubject: 'Non Cadre Mental Ability'
    },
    {
      id: 'non-cadre-geography',
      folder: 'Non Cadre Geography & Environment',
      bnName: 'পিএসসি নন-ক্যাডার ভূগোল ও পরিবেশ',
      enName: 'Non Cadre Geography & Environment',
      group: 'non-cadre',
      examSubject: 'Non Cadre Geography & Environment'
    },
    {
      id: 'non-cadre-ethics',
      folder: 'Non Cadre Ethics & Good Governance',
      bnName: 'পিএসসি নন-ক্যাডার নৈতিকতা ও সুশাসন',
      enName: 'Non Cadre Ethics & Good Governance',
      group: 'non-cadre',
      examSubject: 'Non Cadre Ethics & Good Governance'
    },
    {
      id: 'non-cadre-job-solution',
      folder: 'Non Cadre Job Solution',
      bnName: 'পিএসসি নন-ক্যাডার নিয়োগ প্রশ্ন সমাধান',
      enName: 'Non Cadre Job Solution',
      group: 'non-cadre',
      examSubject: 'Non Cadre Job Solution'
    }
  ];

  // ─── 2. Helpers ───
  function toBnNum(num) {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, function (d) { return bnDigits[+d]; });
  }

  function detectContext() {
    const pathname = decodeURIComponent(window.location.pathname).replace(/\\/g, '/');
    const segments = pathname.split('/').filter(Boolean);
    let currentFolder = '';
    let isMaster = true;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg.startsWith('Live MCQ ') || seg.startsWith('Non Cadre ')) {
        currentFolder = seg;
        isMaster = false;
        break;
      }
    }
    return { isMaster, currentFolder };
  }

  // ─── 3. Unified Theme Management ───
  function getTheme() {
    try {
      return localStorage.getItem('theme') ||
             localStorage.getItem('ebk_portal_theme') ||
             localStorage.getItem('bcs_theme') ||
             'light';
    } catch (e) {
      return 'light';
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      localStorage.setItem('theme', theme);
      localStorage.setItem('ebk_portal_theme', theme);
      localStorage.setItem('bcs_theme', theme);
      // Clean up legacy disjointed keys
      localStorage.removeItem('bd_affairs_theme');
      localStorage.removeItem('cit_portal_theme');
    } catch (e) {}

    updateThemeUI(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const target = current === 'dark' ? 'light' : 'dark';
    setTheme(target);
  }

  function updateThemeUI(theme) {
    const themeBtn = document.getElementById('themeBtn') || document.querySelector('.theme-toggle-btn');
    if (!themeBtn) return;

    const sunSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
    const moonSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

    const iconSpan = themeBtn.querySelector('.theme-icon') || themeBtn;
    if (theme === 'dark') {
      iconSpan.innerHTML = sunSvg;
      themeBtn.setAttribute('title', 'লাইট মোডে পরিবর্তন করুন');
      themeBtn.setAttribute('aria-label', 'লাইট মোডে পরিবর্তন করুন');
    } else {
      iconSpan.innerHTML = moonSvg;
      themeBtn.setAttribute('title', 'ডার্ক মোডে পরিবর্তন করুন');
      themeBtn.setAttribute('aria-label', 'ডার্ক মোডে পরিবর্তন করুন');
    }
  }

  // ─── 4. Font Size Scale Management ───
  function getFontScale() {
    try {
      const val = parseFloat(localStorage.getItem('ebk_font_scale'));
      return (!isNaN(val) && val >= 0.85 && val <= 1.25) ? val : 1.0;
    } catch (e) {
      return 1.0;
    }
  }

  function setFontScale(scale) {
    const clamped = Math.min(Math.max(scale, 0.85), 1.25);
    document.documentElement.style.setProperty('--font-scale', clamped.toString());
    try {
      localStorage.setItem('ebk_font_scale', clamped.toFixed(2));
    } catch (e) {}
  }

  function changeFontScale(delta) {
    if (delta === 0) {
      setFontScale(1.0);
    } else {
      const cur = getFontScale();
      setFontScale(cur + delta);
    }
  }

  // ─── 5. Subject Select Dropdown Generator ───
  function initSubjectDropdown() {
    const select = document.getElementById('subjectNavSelect') || document.querySelector('.subject-select');
    if (!select) return;

    const { isMaster, currentFolder } = detectContext();
    select.innerHTML = '';

    // Master Option
    const masterOpt = document.createElement('option');
    masterOpt.value = isMaster ? 'current' : '../index.html';
    masterOpt.textContent = '🏛️ লাইব্রেরি হোম (মাস্টার সূচিপত্র)';
    if (isMaster) masterOpt.selected = true;
    select.appendChild(masterOpt);

    // Cadre Group
    const cadreGroup = document.createElement('optgroup');
    cadreGroup.label = 'ক্যাডার প্রশ্নব্যাংক (বিসিএস প্রিলিমিনারি)';
    
    // Non-Cadre Group
    const nonCadreGroup = document.createElement('optgroup');
    nonCadreGroup.label = 'নন-ক্যাডার প্রশ্নব্যাংক (পিএসসি জব সলিউশন)';

    SUBJECT_REGISTRY.forEach(sub => {
      const opt = document.createElement('option');
      const prefix = isMaster ? `./${sub.folder}/index.html` : `../${sub.folder}/index.html`;
      
      const isCurrent = (currentFolder === sub.folder);
      opt.value = isCurrent ? 'current' : prefix;
      opt.textContent = sub.bnName;
      if (isCurrent) opt.selected = true;

      if (sub.group === 'cadre') {
        cadreGroup.appendChild(opt);
      } else {
        nonCadreGroup.appendChild(opt);
      }
    });

    select.appendChild(cadreGroup);
    select.appendChild(nonCadreGroup);

    select.addEventListener('change', function () {
      if (this.value && this.value !== 'current') {
        window.location.href = this.value;
      }
    });
  }

  // ─── 6. Real-time Local Chapter Filter ───
  function initChapterFilter() {
    const filterInput = document.getElementById('chapterFilter') || document.getElementById('ch-search') || document.getElementById('searchInput') || document.getElementById('chapterSearch');
    if (!filterInput) return;

    const feedback = document.getElementById('filterFeedback');
    const cards = document.querySelectorAll('.chapter-card, .chapter-item, .topic-card');

    filterInput.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      let matchCount = 0;

      cards.forEach(card => {
        const text = (card.textContent || '').toLowerCase();
        if (!q || text.includes(q)) {
          card.style.display = '';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (feedback) {
        if (!q) {
          feedback.textContent = '';
        } else if (matchCount === 0) {
          feedback.textContent = 'কোনো অধ্যায় বা পরিচ্ছেদ খুঁজে পাওয়া যায়নি।';
        } else {
          feedback.textContent = `${toBnNum(matchCount)}টি অধ্যায় প্রদর্শিত হচ্ছে।`;
        }
      }
    });
  }

  // ─── 7. Mobile Menu Drawer Controls ───
  function initMobileMenu() {
    const menuBtn = document.getElementById('menuToggleBtn') || document.querySelector('.menu-toggle-btn');
    const backdrop = document.getElementById('menuBackdrop');
    const drawer = document.getElementById('menuDrawer');
    const closeBtn = document.getElementById('menuCloseBtn');

    if (!menuBtn || !drawer) return;

    function openMenu() {
      if (backdrop) backdrop.classList.add('open');
      drawer.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      if (backdrop) backdrop.classList.remove('open');
      drawer.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }

    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (drawer.classList.contains('open')) closeMenu();
      else openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // ─── 8. DOM Ready Initializations ───
  document.addEventListener('DOMContentLoaded', function () {
    // Apply saved theme & font scale
    setTheme(getTheme());
    setFontScale(getFontScale());

    // Initialize UI components
    initSubjectDropdown();
    initChapterFilter();
    initMobileMenu();

    // Attach global font-size buttons if present
    document.querySelectorAll('[data-font-scale]').forEach(btn => {
      btn.addEventListener('click', function () {
        const val = this.getAttribute('data-font-scale');
        if (val === 'reset') changeFontScale(0);
        else if (val === 'inc') changeFontScale(0.05);
        else if (val === 'dec') changeFontScale(-0.05);
      });
    });

    // Theme toggle button click
    const themeBtn = document.getElementById('themeBtn') || document.querySelector('.theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }
  });

  // Expose namespace to window
  window.EbookUI = {
    SUBJECT_REGISTRY,
    toBnNum,
    getTheme,
    setTheme,
    toggleTheme,
    getFontScale,
    setFontScale,
    changeFontScale
  };

  // Backwards compatibility aliases
  window.togglePortalTheme = toggleTheme;
})();
