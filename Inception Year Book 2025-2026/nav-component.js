/**
 * ইনসেপশন ইয়ার বুক (২০২৫-২০২৬) - স্মার্ট ইবুক ন্যাভিগেশন কম্পোনেন্ট
 * Smart E-Book Navigation Component for Mobile & Desktop
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
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(fontLink);
    }
  }
  ensureFontsLoaded();

  const YEAR_BOOK_CHAPTERS = [
  {
    "id": "ch-01",
    "title": "বাংলা ভাষা ও ব্যাকরণ",
    "enTitle": "Bangla Language & Grammar",
    "count": 788,
    "page": "১ – ৭২",
    "file": "ch-01-bangla-bhasha.html"
  },
  {
    "id": "ch-02",
    "title": "বাংলা সাহিত্য",
    "enTitle": "Bangla Literature",
    "count": 478,
    "page": "৭৩ – ১৩১",
    "file": "ch-02-bangla-sahitya.html"
  },
  {
    "id": "ch-03",
    "title": "ইংরেজি ভাষা ও ব্যাকরণ",
    "enTitle": "English Language & Grammar",
    "count": 1087,
    "page": "১৩২ – ২৫৩",
    "file": "ch-03-english-language.html"
  },
  {
    "id": "ch-04",
    "title": "ইংরেজি সাহিত্য",
    "enTitle": "English Literature",
    "count": 132,
    "page": "২৫৪ – ২৭৫",
    "file": "ch-04-english-literature.html"
  },
  {
    "id": "ch-05",
    "title": "বাংলাদেশ বিষয়াবলি",
    "enTitle": "Bangladesh Affairs",
    "count": 749,
    "page": "২৭৬ – ৩৪৯",
    "file": "ch-05-bangladesh-affairs.html"
  },
  {
    "id": "ch-06",
    "title": "আন্তর্জাতিক বিষয়াবলি",
    "enTitle": "International Affairs",
    "count": 791,
    "page": "৩৫০ – ৪৩৭",
    "file": "ch-06-international-affairs.html"
  },
  {
    "id": "ch-07",
    "title": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
    "enTitle": "Mathematical Reasoning & Mental Ability",
    "count": 1364,
    "page": "৪৩৮ – ৬৬৮",
    "file": "ch-07-mathematical-reasoning.html"
  },
  {
    "id": "ch-08",
    "title": "সাধারণ বিজ্ঞান",
    "enTitle": "General Science",
    "count": 462,
    "page": "৬৬৯ – ৭২৩",
    "file": "ch-08-general-science.html"
  },
  {
    "id": "ch-09",
    "title": "কম্পিউটার ও তথ্যপ্রযুক্তি",
    "enTitle": "Computer & Information Technology",
    "count": 330,
    "page": "৭২৪ – ৭৭০",
    "file": "ch-09-computer-information-technology.html"
  },
  {
    "id": "ch-10",
    "title": "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
    "enTitle": "Geography, Environment & Disaster Management",
    "count": 47,
    "page": "৭৭১ – ৭৭৮",
    "file": "ch-10-geography-environment.html"
  }
];

  function injectNavDrawer() {
    const currentFile = window.location.pathname.split('/').pop() || 'ch-01-bangla-bhasha.html';
    
    // Top Progress Bar
    if (!document.getElementById('readingProgressBar')) {
      const pBar = document.createElement('div');
      pBar.id = 'readingProgressBar';
      pBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#0f766e,#2dd4bf);width:0%;z-index:9999;transition:width 0.1s;';
      document.body.prepend(pBar);

      window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        pBar.style.width = scrolled + '%';
      }, { passive: true });
    }

    // Side Drawer Container
    const drawer = document.createElement('div');
    drawer.id = 'chapterNavDrawer';
    drawer.style.cssText = 'position:fixed;top:0;right:-320px;width:300px;height:100vh;background:var(--bg-surface,#ffffff);border-left:1px solid var(--border-color,#e2e8f0);box-shadow:-4px 0 20px rgba(0,0,0,0.1);z-index:10000;transition:right 0.3s ease;display:flex;flex-direction:column;font-family:var(--font-base,sans-serif);';

    let listItems = '';
    YEAR_BOOK_CHAPTERS.forEach(ch => {
      const isActive = currentFile === ch.file;
      listItems += `
        <a href="${ch.file}" style="display:block;padding:0.75rem 1rem;border-bottom:1px solid var(--border-color,#e2e8f0);text-decoration:none;color:var(--text-main,#0f172a);${isActive ? 'background:rgba(15,118,110,0.1);font-weight:700;border-left:4px solid #0f766e;' : ''}">
          <div style="font-size:0.95rem;">${ch.title}</div>
          <div style="font-size:0.8rem;color:var(--text-muted,#64748b);display:flex;justify-content:space-between;margin-top:0.25rem;">
            <span>পৃষ্ঠা: ${ch.page}</span>
            <span style="background:rgba(15,118,110,0.1);padding:0.1rem 0.4rem;border-radius:4px;color:#0f766e;font-weight:600;">${ch.count}টি প্রশ্ন</span>
          </div>
        </a>`;
    });

    drawer.innerHTML = `
      <div style="padding:1rem;border-bottom:1px solid var(--border-color,#e2e8f0);display:flex;justify-content:space-between;align-items:center;background:rgba(15,118,110,0.05);">
        <h3 style="font-size:1.1rem;margin:0;color:#0f766e;">📖 অধ্যায় তালিকা</h3>
        <button id="closeDrawerBtn" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-main,#0f172a);">&times;</button>
      </div>
      <div style="flex:1;overflow-y:auto;">
        ${listItems}
      </div>
      <div style="padding:0.85rem;border-top:1px solid var(--border-color,#e2e8f0);background:var(--bg-base,#f8fafc);">
        <label style="font-size:0.8rem;color:var(--text-muted,#64748b);display:block;margin-bottom:0.35rem;">অন্যান্য বিষয়ের ই-বুক:</label>
        <select class="subject-nav-select" onchange="if(this.value && this.value !== 'current') window.location.href=this.value;" style="width:100%;padding:0.4rem;border-radius:4px;border:1px solid var(--border-color,#cbd5e1);font-size:0.85rem;">
          <option value="current" selected>📚 ইনসেপশন ইয়ার বুক (২০২৫-২৬)</option>
          <option value="../Non Cadre Job Solution/index.html">📋 নন-ক্যাডার জব সলিউশন</option>
          <option value="../Non Cadre Bangladesh/index.html">🇧🇩 নন-ক্যাডার বাংলাদেশ বিষয়াবলি</option>
          <option value="../Non Cadre Bangla Grammar/index.html">✍️ নন-ক্যাডার বাংলা ব্যাকরণ</option>
          <option value="../Non Cadre Bangla Literature/index.html">📚 নন-ক্যাডার বাংলা সাহিত্য</option>
          <option value="../Non Cadre English/index.html">🔤 নন-ক্যাডার English</option>
          <option value="../Non Cadre General Science/index.html">🔬 নন-ক্যাডার সাধারণ বিজ্ঞান</option>
          <option value="../Non Cadre Computer & IT/index.html">💻 নন-ক্যাডার কম্পিউটার ও আইটি</option>
          <option value="../index.html">🏛️ মাস্টার লাইব্রেরি পোর্টাল</option>
        </select>
      </div>`;

    document.body.appendChild(drawer);

    // Toggle button on page
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'chapterDrawerTrigger';
    toggleBtn.innerHTML = '📑 সূচি';
    toggleBtn.title = 'অধ্যায় সূচি দেখুন';
    toggleBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#0f766e;color:#ffffff;border:none;padding:0.6rem 1rem;border-radius:9999px;font-size:0.95rem;font-weight:700;box-shadow:0 4px 12px rgba(15,118,110,0.3);cursor:pointer;z-index:9998;display:flex;align-items:center;gap:0.35rem;';
    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
      drawer.style.right = '0px';
    });

    drawer.querySelector('#closeDrawerBtn').addEventListener('click', () => {
      drawer.style.right = '-320px';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavDrawer);
  } else {
    injectNavDrawer();
  }
})();
