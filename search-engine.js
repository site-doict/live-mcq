/**
 * Live MCQ BCS Smart E-Book Library - Universal Deep Search Engine
 * Zero external fabrication, authentic full-text search across all 12 subjects,
 * 211 chapters, past exam questions, options, explanations & study notes.
 */

(function() {
  'use strict';

  // --- Bangla Digit Helper ---
  function toBnNum(n) {
    var bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n).replace(/[0-9]/g, function(d) { return bn[+d]; });
  }

  // --- Subject Color Mapping & Bengali Display Names ---
  var SUBJECT_METAS = {
    'Bangla Language': { bg: 'rgba(15,118,110,0.12)', text: '#0f766e', name: 'বাংলা ভাষা ও ব্যাকরণ' },
    'Bangla Literature': { bg: 'rgba(15,118,110,0.12)', text: '#0f766e', name: 'বাংলা সাহিত্য' },
    'Bangladesh': { bg: 'rgba(136,19,55,0.12)', text: '#881337', name: 'বাংলাদেশ বিষয়াবলি' },
    'International': { bg: 'rgba(2,132,199,0.12)', text: '#0284c7', name: 'আন্তর্জাতিক বিষয়াবলি' },
    'English Grammar': { bg: 'rgba(30,58,138,0.12)', text: '#1e3a8a', name: 'English Grammar' },
    'English Literature': { bg: 'rgba(133,77,14,0.12)', text: '#854d0e', name: 'English Literature' },
    'General Science': { bg: 'rgba(5,150,105,0.12)', text: '#059669', name: 'সাধারণ বিজ্ঞান' },
    'Computer & IT': { bg: 'rgba(37,99,235,0.12)', text: '#2563eb', name: 'কম্পিউটার ও তথ্যপ্রযুক্তি' },
    'Geography': { bg: 'rgba(2,132,199,0.12)', text: '#0284c7', name: 'ভূগোল ও দুর্যোগ ব্যবস্থাপনা' },
    'Ethics & Good Governance': { bg: 'rgba(13,148,136,0.12)', text: '#0d9488', name: 'নৈতিকতা, মূল্যবোধ ও সুশাসন' },
    'Mathematical Reasoning': { bg: 'rgba(79,70,229,0.12)', text: '#4f46e5', name: 'গাণিতিক যুক্তি' },
    'Mental Ability': { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6', name: 'মানসিক দক্ষতা' },
    'Non Cadre Bangla Grammar': { bg: 'rgba(15,118,110,0.12)', text: '#0f766e', name: 'নন-ক্যাডার বাংলা ব্যাকরণ' },
    'Non Cadre Bangla Literature': { bg: 'rgba(15,118,110,0.12)', text: '#0f766e', name: 'নন-ক্যাডার বাংলা সাহিত্য' },
    'Non Cadre English': { bg: 'rgba(30,58,138,0.12)', text: '#1e3a8a', name: 'নন-ক্যাডার ইংরেজি' },
    'Non Cadre General Science': { bg: 'rgba(2,132,199,0.12)', text: '#0284c7', name: 'নন-ক্যাডার সাধারণ বিজ্ঞান' },
    'Non Cadre Bangladesh': { bg: 'rgba(136,19,55,0.12)', text: '#881337', name: 'নন-ক্যাডার বাংলাদেশ বিষয়াবলি' },
    'Non Cadre International': { bg: 'rgba(2,132,199,0.12)', text: '#0284c7', name: 'নন-ক্যাডার আন্তর্জাতিক বিষয়াবলি' },
    'Non Cadre Arithmetic': { bg: 'rgba(79,70,229,0.12)', text: '#4f46e5', name: 'নন-ক্যাডার পাটিগণিত' },
    'Non Cadre Algebra': { bg: 'rgba(8,145,178,0.12)', text: '#0891b2', name: 'নন-ক্যাডার বীজগণিত' }
  };

  var TYPE_BADGES = {
    'title': { text: '📖 অধ্যায়ের নাম', bg: 'rgba(136,19,55,0.1)', color: '#881337' },
    'topic': { text: '📑 টপিকের নাম', bg: 'rgba(124,58,237,0.1)', color: '#7c3aed' },
    'q': { text: '🎯 বিগত বছরের প্রশ্ন', bg: 'rgba(15,118,110,0.1)', color: '#0f766e' },
    'exp': { text: '💡 বিশদ ব্যাখ্যা', bg: 'rgba(217,119,6,0.12)', color: '#b45309' },
    'opt': { text: '📋 অপশনসমূহ', bg: 'rgba(100,116,139,0.1)', color: '#475569' },
    'note': { text: '📝 প্রামাণ্য রিভিশন নোট', bg: 'rgba(37,99,235,0.1)', color: '#1d4ed8' }
  };

  // --- Global State & Subject Detection ---
  var searchData = [];
  var isDataLoaded = false;

  var normPath = decodeURIComponent(window.location.pathname).replace(/\\/g, '/');
  var pathSegments = normPath.split('/').filter(Boolean);
  var currentSubject = '';
  var isMasterPage = true;

  for (var pi = 0; pi < pathSegments.length; pi++) {
    var seg = pathSegments[pi];
    if (seg.startsWith('Live MCQ ')) {
      currentSubject = seg.replace('Live MCQ ', '').trim();
      isMasterPage = false;
      break;
    } else if (seg.startsWith('Non Cadre ')) {
      currentSubject = seg.trim();
      isMasterPage = false;
      break;
    }
  }

  // Configuration options (Synced via localStorage)
  function getSearchConfig() {
    return {
      scope: localStorage.getItem('ebk_search_scope') || 'all',
      matchType: localStorage.getItem('ebk_search_match') || 'all_words',
      minLen: parseInt(localStorage.getItem('ebk_search_min_len') || '5', 10),
      // Default to subject-only search when on a subject page, unless toggled off
      onlyCurrentSub: localStorage.getItem('ebk_search_only_sub') !== null 
        ? localStorage.getItem('ebk_search_only_sub') === 'true' 
        : true
    };
  }

  function setSearchConfig(key, val) {
    localStorage.setItem(key, val);
  }

  // --- Resolve Airtight Clickable Hrefs Across All Subjects ---
  function resolveItemHref(item) {
    var rawFile = item.f || '';
    var basename = rawFile.indexOf('/') !== -1 ? rawFile.split('/').pop() : rawFile;
    var anchor = item.a || '';

    // Determine target folder name
    var folderName = '';
    if (rawFile.indexOf('/') !== -1) {
      folderName = rawFile.split('/')[0];
    } else if (item.s.startsWith('Non Cadre ') || item.s.startsWith('Live MCQ ')) {
      folderName = item.s;
    } else {
      folderName = 'Live MCQ ' + item.s;
    }

    if (isMasterPage) {
      return folderName + '/' + basename + anchor;
    } else {
      // Inside a subject directory
      var thisFolder = currentSubject.startsWith('Non Cadre ') ? currentSubject : ('Live MCQ ' + currentSubject);
      if (thisFolder.toLowerCase() === folderName.toLowerCase()) {
        return basename + anchor;
      } else {
        return '../' + folderName + '/' + basename + anchor;
      }
    }
  }

  // --- Load Search Index Data ---
  function loadSearchData(callback) {
    if (isDataLoaded && searchData.length > 0) {
      if (callback) callback();
      return;
    }

    var config = getSearchConfig();
    // If on subject index and onlyCurrentSub is true, try to load subject-specific data first
    var jsonUrl = (isMasterPage || !config.onlyCurrentSub) 
      ? (isMasterPage ? 'search-data.json' : '../search-data.json')
      : 'search-data.json';

    fetch(jsonUrl)
      .then(function(res) {
        if (!res.ok) throw new Error('Local search index not found');
        return res.json();
      })
      .then(function(data) {
        searchData = data;
        isDataLoaded = true;
        console.log('[SearchEngine] Loaded', searchData.length, 'search items from', jsonUrl);
        if (callback) callback();
      })
      .catch(function(err) {
        // Fallback: try root search-data.json
        var fallbackUrl = isMasterPage ? 'search-data.json' : '../search-data.json';
        fetch(fallbackUrl)
          .then(function(res) { return res.json(); })
          .then(function(data) {
            searchData = data;
            isDataLoaded = true;
            console.log('[SearchEngine] Fallback loaded', searchData.length, 'items');
            if (callback) callback();
          })
          .catch(function(e) { console.error('Failed to load search data:', e); });
      });
  }

  // --- Matching Engine ---
  function executeSearch(query, config) {
    if (!query) return { total: 0, items: [], message: '' };

    var cleanQuery = query.trim();
    var pureChars = cleanQuery.replace(/\s+/g, '');
    if (pureChars.length < config.minLen) {
      return {
        total: 0,
        items: [],
        tooShort: true,
        needed: config.minLen,
        current: pureChars.length,
        message: 'কমপক্ষে ' + toBnNum(config.minLen) + 'টি অক্ষর প্রয়োজন (বর্তমানে ' + toBnNum(pureChars.length) + '/' + toBnNum(config.minLen) + ' অক্ষর)'
      };
    }

    var qLower = cleanQuery.toLowerCase();
    var tokens = cleanQuery.toLowerCase().split(/\s+/).filter(Boolean);
    var results = [];

    for (var i = 0; i < searchData.length; i++) {
      var item = searchData[i];

      // 1. Subject filter (if on subject index and onlyCurrentSub is active)
      if (!isMasterPage && config.onlyCurrentSub && currentSubject) {
        if (item.s.toLowerCase() !== currentSubject.toLowerCase()) {
          continue;
        }
      }

      // 2. Scope filter
      var t = item.t;
      if (config.scope === 'questions' && t !== 'q') continue;
      if (config.scope === 'questions_options' && t !== 'q' && t !== 'opt') continue;
      if (config.scope === 'explanations' && t !== 'exp') continue;
      if (config.scope === 'notes' && t !== 'note') continue;

      var textLower = item.txt.toLowerCase();

      // 3. Match type filter
      var matched = false;
      if (config.matchType === 'exact_phrase') {
        // পর্যায়ক্রমিক / হুবহু শব্দক্রম
        if (textLower.indexOf(qLower) !== -1) {
          matched = true;
        }
      } else if (config.matchType === 'any_word') {
        // যেকোনো একটি শব্দ
        for (var j = 0; j < tokens.length; j++) {
          if (textLower.indexOf(tokens[j]) !== -1) {
            matched = true;
            break;
          }
        }
      } else {
        // Default: all_words (সব শব্দ বাক্যের যেকোনো স্থানে থাকলেই মিলবে)
        var allFound = true;
        for (var k = 0; k < tokens.length; k++) {
          if (textLower.indexOf(tokens[k]) === -1) {
            allFound = false;
            break;
          }
        }
        matched = allFound;
      }

      if (matched) {
        results.push(item);
      }
    }

    // --- Search Priority & Relevance Ranking ---
    // User-Specified Strict Sequence:
    // 1. অধ্যায়ের নাম (Chapter Title / Name)
    // 2. টপিকের নাম (Topic / Section heading)
    // 3. প্রশ্নের লাইন (Question line)
    // 4. ব্যাখ্যা ও অপশনসমূহ (Explanations & Options)
    // 5. নিজের তৈরি ব্যাখ্যা হতে তৈরি নোট (Synthesized Study Notes / Sketchnotes)
    function getItemPriority(it) {
      var itType = it.t;
      if (itType === 'title') return 1;
      if (itType === 'topic') return 2;
      if (itType === 'q') return 3;
      if (itType === 'exp') return 4;
      if (itType === 'opt') return 5;
      if (itType === 'note') return 6;
      return 7;
    }

    function getItemScore(it) {
      var txtLower = (it.txt || '').toLowerCase();
      var score = 0;
      if (txtLower === qLower) {
        score += 1000;
      } else if (txtLower.startsWith(qLower)) {
        score += 500;
      }
      var phraseIdx = txtLower.indexOf(qLower);
      if (phraseIdx !== -1) {
        score += Math.max(0, 300 - phraseIdx);
      }
      for (var k = 0; k < tokens.length; k++) {
        var tokenIdx = txtLower.indexOf(tokens[k]);
        if (tokenIdx !== -1) {
          score += 50;
          if (tokenIdx === 0) score += 30;
        }
      }
      return score;
    }

    // Sort matching results: strict priority tier first, then secondary score
    results.sort(function(a, b) {
      var pA = getItemPriority(a);
      var pB = getItemPriority(b);
      if (pA !== pB) {
        return pA - pB;
      }
      var sA = getItemScore(a);
      var sB = getItemScore(b);
      return sB - sA;
    });

    return { total: results.length, items: results, tooShort: false };
  }

  // --- Snippet Generator with Highlighting ---
  function createHighlightedSnippet(text, query, matchType) {
    if (!text) return '';
    var tokens = matchType === 'exact_phrase' ? [query.trim()] : query.trim().split(/\s+/).filter(Boolean);
    
    var lower = text.toLowerCase();
    var firstIdx = -1;
    for (var i = 0; i < tokens.length; i++) {
      var pos = lower.indexOf(tokens[i].toLowerCase());
      if (pos !== -1 && (firstIdx === -1 || pos < firstIdx)) {
        firstIdx = pos;
      }
    }

    var start = Math.max(0, firstIdx - 60);
    var end = Math.min(text.length, firstIdx + 120);
    var snippet = text.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    for (var j = 0; j < tokens.length; j++) {
      var token = tokens[j];
      if (token.length > 1) {
        var escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp('(' + escaped + ')', 'gi');
        snippet = snippet.replace(regex, '<mark class="search-highlight">$1</mark>');
      }
    }

    return snippet;
  }

  // --- Local Page Chapter Filter Helper ---
  function filterLocalChapterCards(query) {
    var q = query.toLowerCase().trim();
    var cards = document.querySelectorAll('.chapter-card, .searchable-row, .chapter-item, .card-grid > .card');
    if (!cards.length) return;

    cards.forEach(function(c) {
      if (!q) {
        c.style.display = '';
      } else {
        var text = c.textContent.toLowerCase();
        c.style.display = text.indexOf(q) !== -1 ? '' : 'none';
      }
    });
  }

  // --- UI Injections and Styles ---
  function injectStyles() {
    if (document.getElementById('ebk-search-styles')) return;
    var style = document.createElement('style');
    style.id = 'ebk-search-styles';
    style.textContent = `
      .ebk-search-container {
        position: relative;
        max-width: 840px;
        margin: 0 auto 24px auto;
        width: 100%;
        z-index: 40;
      }

      .ebk-search-bar {
        display: flex;
        align-items: center;
        background: var(--bg-surface, #ffffff);
        border: 2px solid var(--border-color, #e2e8f0);
        border-radius: 14px;
        padding: 5px 8px 5px 14px;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        gap: 8px;
      }

      [data-theme="dark"] .ebk-search-bar {
        background: var(--bg-card, #151f32);
        border-color: #2a374f;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
      }

      .ebk-search-bar:focus-within {
        border-color: #0f766e;
        box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.15), 0 8px 24px rgba(0,0,0,0.08);
      }

      .ebk-search-icon {
        font-size: 1.15rem;
        color: var(--text-muted, #64748b);
        display: flex;
        align-items: center;
        user-select: none;
      }

      .ebk-search-input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        font-family: inherit;
        font-size: 1rem;
        color: var(--text-main, #0f172a);
        padding: 8px 4px;
        line-height: 1.5;
        min-width: 0;
      }

      .ebk-search-input::placeholder {
        color: var(--text-muted, #94a3b8);
        font-size: 0.92rem;
      }

      .ebk-search-clear-btn {
        background: transparent;
        border: none;
        color: var(--text-muted, #94a3b8);
        cursor: pointer;
        padding: 6px;
        font-size: 1rem;
        line-height: 1;
        border-radius: 50%;
        display: none;
        transition: color 0.2s;
      }
      .ebk-search-clear-btn:hover {
        color: #ef4444;
      }

      .ebk-search-action-btn {
        background: linear-gradient(135deg, #0f766e, #0d9488);
        color: #ffffff;
        border: none;
        padding: 8px 16px;
        border-radius: 10px;
        font-family: inherit;
        font-size: 0.88rem;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        transition: all 0.2s;
        box-shadow: 0 2px 8px rgba(15, 118, 110, 0.25);
      }
      .ebk-search-action-btn:hover {
        opacity: 0.92;
        transform: translateY(-1px);
      }

      .ebk-search-settings-btn {
        background: var(--bg-base, #f8fafc);
        border: 1.5px solid var(--border-color, #e2e8f0);
        color: var(--text-main, #0f172a);
        padding: 8px 12px;
        border-radius: 10px;
        font-family: inherit;
        font-size: 0.84rem;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
        transition: all 0.2s;
      }
      .ebk-search-settings-btn:hover {
        background: var(--border-color, #e2e8f0);
      }
      [data-theme="dark"] .ebk-search-settings-btn {
        background: #1e293b;
        border-color: #334155;
        color: #f8fafc;
      }

      /* Active Filters Chips Bar */
      .ebk-filter-pills-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        margin-top: 8px;
        padding: 0 4px;
        font-size: 0.78rem;
      }

      .ebk-filter-pill-tag {
        background: rgba(15, 118, 110, 0.08);
        color: #0f766e;
        border: 1px solid rgba(15, 118, 110, 0.2);
        padding: 2px 8px;
        border-radius: 6px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      [data-theme="dark"] .ebk-filter-pill-tag {
        background: rgba(45, 212, 191, 0.12);
        color: #2dd4bf;
        border-color: rgba(45, 212, 191, 0.25);
      }

      /* Live Suggestion Dropdown */
      .ebk-suggest-box {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        background: var(--bg-surface, #ffffff);
        border: 1.5px solid var(--border-color, #e2e8f0);
        border-radius: 12px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        z-index: 100;
        max-height: 420px;
        overflow-y: auto;
        display: none;
      }
      [data-theme="dark"] .ebk-suggest-box {
        background: #111827;
        border-color: #1e293b;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5);
      }

      .ebk-suggest-header {
        padding: 8px 14px;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-muted, #64748b);
        border-bottom: 1px solid var(--border-color, #e2e8f0);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg-base, #f8fafc);
        border-radius: 11px 11px 0 0;
      }
      [data-theme="dark"] .ebk-suggest-header {
        background: #172033;
        border-color: #23304a;
      }

      .ebk-suggest-item {
        padding: 10px 14px;
        border-bottom: 1px solid var(--border-color, #f1f5f9);
        cursor: pointer;
        text-decoration: none;
        color: var(--text-main, #0f172a);
        display: block;
        transition: background 0.15s ease;
      }
      .ebk-suggest-item:hover, .ebk-suggest-item:focus {
        background: rgba(15, 118, 110, 0.06);
      }
      [data-theme="dark"] .ebk-suggest-item {
        border-color: #1e293b;
        color: #f8fafc;
      }
      [data-theme="dark"] .ebk-suggest-item:hover {
        background: rgba(45, 212, 191, 0.08);
      }

      .ebk-suggest-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
        font-size: 0.75rem;
      }

      .ebk-suggest-title {
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--text-main, #0f172a);
        line-height: 1.4;
      }

      .ebk-suggest-snippet {
        font-size: 0.82rem;
        color: var(--text-muted, #64748b);
        line-height: 1.45;
        margin-top: 3px;
      }

      /* Search Highlight */
      mark.search-highlight {
        background: #fef08a !important;
        color: #854d0e !important;
        padding: 1px 3px;
        border-radius: 3px;
        font-weight: 700;
      }
      [data-theme="dark"] mark.search-highlight {
        background: rgba(245, 158, 11, 0.3) !important;
        color: #fef08a !important;
      }

      /* Full Search Results Section */
      .ebk-results-panel {
        background: var(--bg-surface, #ffffff);
        border: 1.5px solid var(--border-color, #e2e8f0);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 28px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        display: none;
      }
      [data-theme="dark"] .ebk-results-panel {
        background: var(--bg-card, #151f32);
        border-color: #1e293b;
      }

      .ebk-results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid var(--border-color, #e2e8f0);
        padding-bottom: 12px;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 10px;
      }

      .ebk-results-title {
        font-size: 1.15rem;
        font-weight: 800;
        color: var(--text-main, #0f172a);
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
      }

      .ebk-results-count {
        background: rgba(15, 118, 110, 0.12);
        color: #0f766e;
        padding: 3px 10px;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.82rem;
      }
      [data-theme="dark"] .ebk-results-count {
        background: rgba(45, 212, 191, 0.18);
        color: #2dd4bf;
      }

      .ebk-results-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .ebk-result-card {
        background: var(--bg-base, #f8fafc);
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 12px;
        padding: 14px 16px;
        text-decoration: none;
        color: inherit;
        display: block;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
      }
      [data-theme="dark"] .ebk-result-card {
        background: #111827;
        border-color: #1e293b;
      }
      .ebk-result-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        border-color: #0f766e;
      }

      .ebk-card-meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
        flex-wrap: wrap;
      }

      .ebk-card-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main, #0f172a);
        line-height: 1.4;
      }

      .ebk-card-snippet {
        font-size: 0.88rem;
        color: var(--text-muted, #475569);
        line-height: 1.6;
        margin-top: 6px;
      }
      [data-theme="dark"] .ebk-card-snippet {
        color: #94a3b8;
      }

      .ebk-card-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px dashed var(--border-color, #e2e8f0);
        font-size: 0.8rem;
        font-weight: 700;
        color: #0f766e;
      }
      [data-theme="dark"] .ebk-card-footer {
        border-color: #1e293b;
        color: #2dd4bf;
      }

      /* Search Settings Modal */
      .ebk-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 16px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .ebk-modal-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      .ebk-modal-box {
        background: var(--bg-surface, #ffffff);
        border: 1.5px solid var(--border-color, #e2e8f0);
        border-radius: 18px;
        max-width: 540px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 24px;
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.25);
        transform: scale(0.95);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      [data-theme="dark"] .ebk-modal-box {
        background: #111827;
        border-color: #1e293b;
      }
      .ebk-modal-overlay.open .ebk-modal-box {
        transform: scale(1);
      }

      .ebk-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid var(--border-color, #e2e8f0);
        padding-bottom: 12px;
        margin-bottom: 16px;
      }
      .ebk-modal-header h3 {
        font-size: 1.2rem;
        font-weight: 800;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ebk-modal-close-btn {
        background: transparent;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-muted, #64748b);
        line-height: 1;
        padding: 4px;
      }
      .ebk-modal-close-btn:hover {
        color: #ef4444;
      }

      .ebk-setting-section {
        margin-bottom: 20px;
      }
      .ebk-setting-title {
        font-size: 0.86rem;
        font-weight: 700;
        color: var(--text-muted, #64748b);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        display: block;
      }

      .ebk-radio-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .ebk-radio-label {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1.5px solid var(--border-color, #e2e8f0);
        background: var(--bg-base, #f8fafc);
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.9rem;
      }
      [data-theme="dark"] .ebk-radio-label {
        background: #172033;
        border-color: #23304a;
      }
      .ebk-radio-label:hover {
        border-color: #0f766e;
      }
      .ebk-radio-label.active {
        border-color: #0f766e;
        background: rgba(15, 118, 110, 0.08);
        font-weight: 700;
      }
      [data-theme="dark"] .ebk-radio-label.active {
        border-color: #2dd4bf;
        background: rgba(45, 212, 191, 0.12);
      }

      .ebk-radio-input {
        margin-top: 3px;
        accent-color: #0f766e;
        cursor: pointer;
      }

      .ebk-radio-desc {
        display: block;
        font-size: 0.78rem;
        color: var(--text-muted, #64748b);
        font-weight: normal;
        margin-top: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  // --- Render Search Markup ---
  function renderSearchUI(containerEl) {
    if (!containerEl) return;
    injectStyles();

    var config = getSearchConfig();
    var subDisplay = SUBJECT_METAS[currentSubject] ? SUBJECT_METAS[currentSubject].name : currentSubject;
    var placeholderText = isMasterPage
      ? 'পুরো বইয়ের ১২টি বিষয়ের যেকোনো তথ্য খুঁজুন (যেমন: বাংলাদেশের সংবিধান, উপসর্গ, ক্লজ, পৃথিবী গোল)...'
      : (subDisplay ? subDisplay + '-এর যেকোনো প্রশ্ন বা তথ্য খুঁজুন...' : 'যেকোনো তথ্য খুঁজুন...');

    containerEl.innerHTML = `
      <div class="ebk-search-container">
        <div class="ebk-search-bar">
          <span class="ebk-search-icon">🔍</span>
          <input type="text" class="ebk-search-input" id="ebkSearchInput" placeholder="${placeholderText}" autocomplete="off">
          <button type="button" class="ebk-search-clear-btn" id="ebkClearBtn" title="মুছে ফেলুন">✕</button>
          <button type="button" class="ebk-search-action-btn" id="ebkSearchBtn">
            <span>সার্চ</span>
          </button>
          <button type="button" class="ebk-search-settings-btn" id="ebkSettingsBtn" title="সার্চ সেটিংস পরিবর্তন করুন">
            <span>⚙️</span>
            <span>সেটিংস</span>
          </button>
        </div>

        <div class="ebk-filter-pills-bar" id="ebkFilterPillsBar">
          <!-- Active filter pills rendered dynamically -->
        </div>

        <!-- Real-time Suggestion Dropdown -->
        <div class="ebk-suggest-box" id="ebkSuggestBox"></div>
      </div>

      <!-- Full Results Panel -->
      <section class="ebk-results-panel" id="ebkResultsPanel">
        <div class="ebk-results-header">
          <h3 class="ebk-results-title">
            <span>🔎 অনুসন্ধান ফলাফল</span>
            <span class="ebk-results-count" id="ebkResultsBadge">০টি ফলাফল</span>
          </h3>
          <button type="button" class="ebk-search-settings-btn" onclick="document.getElementById('ebkResultsPanel').style.display='none'">
            <span>✕ বন্ধ করুন</span>
          </button>
        </div>
        <div class="ebk-results-grid" id="ebkResultsGrid"></div>
      </section>

      <!-- Search Settings Modal -->
      <div class="ebk-modal-overlay" id="ebkSearchModal" onclick="if(event.target===this)window.closeEbkSearchModal()">
        <div class="ebk-modal-box">
          <div class="ebk-modal-header">
            <h3>⚙️ সার্চ সিস্টেম কনফিগারেশন</h3>
            <button class="ebk-modal-close-btn" onclick="window.closeEbkSearchModal()">&times;</button>
          </div>

          <p style="font-size:0.86rem; color:var(--text-muted, #64748b); margin-bottom:16px;">
            সার্চের পরিধি, শব্দক্রম ও ন্যূনতম অক্ষর সীমা নির্ধারণ করুন। এই সেটিংস মাস্টার ইনডেক্স ও সকল সাবজেক্টে কার্যকর থাকবে।
          </p>

          <!-- 1. Search Scope -->
          <div class="ebk-setting-section">
            <span class="ebk-setting-title">১. অনুসন্ধানের পরিধি (Search Scope):</span>
            <div class="ebk-radio-group" id="scopeRadioGroup">
              <label class="ebk-radio-label ${config.scope === 'all' ? 'active' : ''}">
                <input type="radio" name="search_scope" value="all" class="ebk-radio-input" ${config.scope === 'all' ? 'checked' : ''}>
                <div>
                  <strong>পুরো বইয়ের যেকোনো জায়গায় (All Content)</strong>
                  <span class="ebk-radio-desc">বিগত বছরের প্রশ্ন, অপশন, ব্যাখ্যা, রিভিশন নোট ও সূত্রাবলি — সবকিছুতে খুঁজবে।</span>
                </div>
              </label>

              <label class="ebk-radio-label ${config.scope === 'questions' ? 'active' : ''}">
                <input type="radio" name="search_scope" value="questions" class="ebk-radio-input" ${config.scope === 'questions' ? 'checked' : ''}>
                <div>
                  <strong>শুধুমাত্র বিগত বছরের প্রশ্নের বাক্যে (Questions Only)</strong>
                  <span class="ebk-radio-desc">শুধুমাত্র MCQ মূল প্রশ্নের বাক্যের মধ্যে মিললে রেজাল্ট দেখাবে।</span>
                </div>
              </label>

              <label class="ebk-radio-label ${config.scope === 'questions_options' ? 'active' : ''}">
                <input type="radio" name="search_scope" value="questions_options" class="ebk-radio-input" ${config.scope === 'questions_options' ? 'checked' : ''}>
                <div>
                  <strong>প্রশ্নের বাক্য ও অপশন সহ (Questions + Options)</strong>
                  <span class="ebk-radio-desc">প্রশ্ন এবং ৪টি অপশনের লেখার ভেতর খুঁজবে।</span>
                </div>
              </label>

              <label class="ebk-radio-label ${config.scope === 'explanations' ? 'active' : ''}">
                <input type="radio" name="search_scope" value="explanations" class="ebk-radio-input" ${config.scope === 'explanations' ? 'checked' : ''}>
                <div>
                  <strong>শুধুমাত্র বিশদ ব্যাখ্যায় (Explanations Only)</strong>
                  <span class="ebk-radio-desc">প্রশ্নের নিচের বিশদ ব্যাখ্যা ড্রয়ারে খুঁজবে।</span>
                </div>
              </label>

              <label class="ebk-radio-label ${config.scope === 'notes' ? 'active' : ''}">
                <input type="radio" name="search_scope" value="notes" class="ebk-radio-input" ${config.scope === 'notes' ? 'checked' : ''}>
                <div>
                  <strong>রিভিশন নোট ও সূত্রাবলিতে (Part 1 Notes & Formulas)</strong>
                  <span class="ebk-radio-desc">অধ্যায়ের শুরুর প্রামাণ্য ইন্টারেক্টিভ নোট ও সূত্রের ভেতর খুঁজবে।</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 2. Matching Strategy -->
          <div class="ebk-setting-section">
            <span class="ebk-setting-title">২. শব্দ মেলানোর ধরন (Matching Strategy):</span>
            <div class="ebk-radio-group" id="matchRadioGroup">
              <label class="ebk-radio-label ${config.matchType === 'all_words' ? 'active' : ''}">
                <input type="radio" name="search_match" value="all_words" class="ebk-radio-input" ${config.matchType === 'all_words' ? 'checked' : ''}>
                <div>
                  <strong>যেকোনো অবস্থানে সব শব্দ থাকা (All Words / Flexible)</strong>
                  <span class="ebk-radio-desc">উদা: 'পৃথিবী গোল' লিখলে 'পৃথিবী কমলা লেবুর মত গোল' মিলবে। শব্দগুলো বাক্যের যেকোনো স্থানে থাকলেই হবে।</span>
                </div>
              </label>

              <label class="ebk-radio-label ${config.matchType === 'exact_phrase' ? 'active' : ''}">
                <input type="radio" name="search_match" value="exact_phrase" class="ebk-radio-input" ${config.matchType === 'exact_phrase' ? 'checked' : ''}>
                <div>
                  <strong>পর্যায়ক্রমিক / হুবহু শব্দক্রম (Exact Phrase / Sequential)</strong>
                  <span class="ebk-radio-desc">উদা: 'পৃথিবী গোল' লিখলে পরপর দুটো শব্দ থাকলেই কেবল মিলবে, মাঝে অন্য শব্দ থাকলে মিলবে না।</span>
                </div>
              </label>

              <label class="ebk-radio-label ${config.matchType === 'any_word' ? 'active' : ''}">
                <input type="radio" name="search_match" value="any_word" class="ebk-radio-input" ${config.matchType === 'any_word' ? 'checked' : ''}>
                <div>
                  <strong>যেকোনো একটি শব্দ মিললেই হবে (Any Word)</strong>
                  <span class="ebk-radio-desc">সার্চের যেকোনো একটি শব্দ মিললেও ফলাফল প্রদর্শন করবে।</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 3. Minimum Character Threshold -->
          <div class="ebk-setting-section">
            <span class="ebk-setting-title">৩. ন্যূনতম অক্ষর সীমা (Minimum Character Limit):</span>
            <div class="ebk-radio-group" id="minLenRadioGroup">
              <label class="ebk-radio-label ${config.minLen === 5 ? 'active' : ''}">
                <input type="radio" name="search_min_len" value="5" class="ebk-radio-input" ${config.minLen === 5 ? 'checked' : ''}>
                <div>
                  <strong>কমপক্ষে ৫টি অক্ষর (ডিফল্ট - বিসিএস স্ট্যান্ডার্ড)</strong>
                  <span class="ebk-radio-desc">যেমন: 'সংবিধান', 'উপসর্গ', 'সাহিত্য', 'প্লাজমা'। অপ্রয়োজনীয় ছোট শব্দের ভিড় কমায়।</span>
                </div>
              </label>

              <label class="ebk-radio-label ${config.minLen === 6 ? 'active' : ''}">
                <input type="radio" name="search_min_len" value="6" class="ebk-radio-input" ${config.minLen === 6 ? 'checked' : ''}>
                <div>
                  <strong>কমপক্ষে ৬টি অক্ষর (সর্বোচ্চ নিখুঁত ফিল্টারিং)</strong>
                  <span class="ebk-radio-desc">শুধুমাত্র ৬ বা ততোধিক অক্ষরের নির্দিষ্ট শব্দে সার্চ হবে।</span>
                </div>
              </label>

              <label class="ebk-radio-label ${config.minLen === 3 ? 'active' : ''}">
                <input type="radio" name="search_min_len" value="3" class="ebk-radio-input" ${config.minLen === 3 ? 'checked' : ''}>
                <div>
                  <strong>কমপক্ষে ৩টি অক্ষর (ছোট শব্দের জন্য)</strong>
                  <span class="ebk-radio-desc">যেমন: 'সন্ধি', 'শব্দ', 'ক্লজ', 'আইন' ইত্যাদি ছোট শব্দ খুঁজতে উপযোগী।</span>
                </div>
              </label>
            </div>
          </div>

          ${!isMasterPage && currentSubject ? `
          <!-- 4. Subject Scope Toggle for Subject Index -->
          <div class="ebk-setting-section">
            <span class="ebk-setting-title">৪. সাবজেক্ট ফিল্টার:</span>
            <div class="ebk-radio-group">
              <label class="ebk-radio-label ${config.onlyCurrentSub ? 'active' : ''}">
                <input type="checkbox" id="onlyCurrentSubCheck" class="ebk-radio-input" ${config.onlyCurrentSub ? 'checked' : ''}>
                <div>
                  <strong>শুধু '${subDisplay}' বিষয়ে অনুসন্ধান সীমাবদ্ধ রাখুন</strong>
                  <span class="ebk-radio-desc">আনচেক করলে পুরো লাইব্রেরির ১২টি বিষয়ের সব তথ্যে সার্চ হবে।</span>
                </div>
              </label>
            </div>
          </div>
          ` : ''}

          <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center;">
            <button type="button" class="ebk-search-settings-btn" onclick="window.resetEbkSearchSettings()">
              🔄 ডিফল্টে ফিরুন
            </button>
            <button type="button" class="ebk-search-action-btn" onclick="window.closeEbkSearchModal()">
              ✓ সংরক্ষণ করুন ও বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    `;

    bindSearchEvents();
    updateFilterPills();
  }

  // --- Update Filter Pills Bar ---
  function updateFilterPills() {
    var bar = document.getElementById('ebkFilterPillsBar');
    if (!bar) return;
    var config = getSearchConfig();

    var scopeLabels = {
      'all': 'সব জায়গায়',
      'questions': 'শুধু বিগত প্রশ্ন',
      'questions_options': 'প্রশ্ন + অপশন',
      'explanations': 'শুধু বিশদ ব্যাখ্যা',
      'notes': 'শুধু রিভিশন নোট'
    };

    var matchLabels = {
      'all_words': 'সব শব্দ (যেকোনো ক্রমে)',
      'exact_phrase': 'হুবহু শব্দক্রম',
      'any_word': 'যেকোনো শব্দ'
    };

    var subDisplay = SUBJECT_METAS[currentSubject] ? SUBJECT_METAS[currentSubject].name : currentSubject;

    var html = `
      <span class="ebk-filter-pill-tag">🎯 পরিধি: ${scopeLabels[config.scope] || config.scope}</span>
      <span class="ebk-filter-pill-tag">🔤 ধরন: ${matchLabels[config.matchType] || config.matchType}</span>
      <span class="ebk-filter-pill-tag">📏 অক্ষর সীমা: ${toBnNum(config.minLen)}+</span>
    `;

    if (!isMasterPage && currentSubject) {
      html += `<span class="ebk-filter-pill-tag" style="background:rgba(217,119,6,0.1); color:#b45309; border-color:rgba(217,119,6,0.25);">
        📚 ${config.onlyCurrentSub ? 'শুধু ' + subDisplay : 'সকল বিষয়'}
      </span>`;
    }

    bar.innerHTML = html;
  }

  // --- Render Suggestion Dropdown ---
  function renderSuggestions(res, query, config) {
    var box = document.getElementById('ebkSuggestBox');
    if (!box) return;

    if (res.tooShort) {
      box.innerHTML = `
        <div class="ebk-suggest-header">
          <span>💡 সার্চ সহায়িকা</span>
          <span>${toBnNum(res.current)}/${toBnNum(res.needed)} অক্ষর</span>
        </div>
        <div style="padding:14px; font-size:0.88rem; color:var(--text-muted,#64748b); text-align:center;">
          ${res.message}
        </div>
      `;
      box.style.display = 'block';
      return;
    }

    if (res.total === 0) {
      box.innerHTML = `
        <div class="ebk-suggest-header">
          <span>🔎 ফলাফল</span>
          <span>০টি মিল</span>
        </div>
        <div style="padding:16px; font-size:0.88rem; color:var(--text-muted,#64748b); text-align:center;">
          কোনো তথ্য খুঁজে পাওয়া যায়নি। অনুসন্ধানের পরিধি বা শব্দক্রম পরিবর্তন করে দেখুন।
        </div>
      `;
      box.style.display = 'block';
      return;
    }

    var topHits = res.items.slice(0, 6);
    var html = `
      <div class="ebk-suggest-header">
        <span>⚡ তাৎক্ষণিক সাজেশন (${toBnNum(res.total)}টি মিল পাওয়া গেছে)</span>
        <span style="font-size:0.75rem; color:#0f766e; cursor:pointer;" onclick="document.getElementById('ebkSearchBtn').click()">সবগুলো দেখুন ▾</span>
      </div>
    `;

    topHits.forEach(function(item) {
      var subMeta = SUBJECT_METAS[item.s] || { bg: 'rgba(15,118,110,0.1)', text: '#0f766e', name: item.s };
      var typeBadge = TYPE_BADGES[item.t] || { text: 'তথ্য', bg: 'rgba(0,0,0,0.06)', color: '#334155' };
      var href = resolveItemHref(item);
      var snippet = createHighlightedSnippet(item.txt, query, config.matchType);

      html += `
        <a class="ebk-suggest-item" href="${href}">
          <div class="ebk-suggest-meta">
            <span style="background:${subMeta.bg}; color:${subMeta.text}; padding:1px 6px; border-radius:4px; font-weight:700;">
              ${subMeta.name}
            </span>
            <span style="background:${typeBadge.bg}; color:${typeBadge.color}; padding:1px 6px; border-radius:4px; font-weight:600;">
              ${typeBadge.text}
            </span>
          </div>
          <div class="ebk-suggest-title">${item.c}</div>
          <div class="ebk-suggest-snippet">${snippet}</div>
        </a>
      `;
    });

    if (res.total > 6) {
      html += `
        <div style="padding:10px; text-align:center; background:var(--bg-base, #f8fafc); border-top:1px solid var(--border-color, #e2e8f0); border-radius:0 0 11px 11px;">
          <button type="button" class="ebk-search-action-btn" style="padding:6px 14px; font-size:0.82rem;" onclick="document.getElementById('ebkSearchBtn').click()">
            সম্পূর্ণ ${toBnNum(res.total)}টি ফলাফল দেখুন →
          </button>
        </div>
      `;
    }

    box.innerHTML = html;
    box.style.display = 'block';
  }

  // --- Render Full Results Panel ---
  function renderFullResults(res, query, config) {
    var panel = document.getElementById('ebkResultsPanel');
    var grid = document.getElementById('ebkResultsGrid');
    var badge = document.getElementById('ebkResultsBadge');
    var suggestBox = document.getElementById('ebkSuggestBox');
    if (suggestBox) suggestBox.style.display = 'none';

    if (!panel || !grid) return;

    if (res.tooShort) {
      badge.innerText = 'অক্ষর কম';
      grid.innerHTML = `
        <div style="padding:24px; text-align:center; color:var(--text-muted,#64748b); font-size:0.95rem;">
          ⚠️ ${res.message}
        </div>
      `;
      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (res.total === 0) {
      badge.innerText = '০টি ফলাফল';
      grid.innerHTML = `
        <div style="padding:32px 16px; text-align:center; color:var(--text-muted,#64748b);">
          <div style="font-size:2rem; margin-bottom:8px;">🔍</div>
          <h4 style="font-size:1.05rem; margin-bottom:6px; color:var(--text-main,#0f172a);">কোনো ফলাফল পাওয়া যায়নি</h4>
          <p style="font-size:0.88rem; max-width:440px; margin:0 auto 14px auto;">
            '${query}' এর সাথে মিলে এমন কোনো তথ্য পাওয়া যায়নি। আপনি কি 'সার্চ সেটিংস' থেকে পরিধি 'পুরো বইয়ের যেকোনো জায়গায়' এবং ধরন 'সব শব্দ (যেকোনো ক্রমে)' দিয়ে দেখতে চান?
          </p>
          <button type="button" class="ebk-search-settings-btn" onclick="window.openEbkSearchModal()">
            ⚙️ সেটিংস পরিবর্তন করুন
          </button>
        </div>
      `;
      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    badge.innerText = `${toBnNum(res.total)}টি ফলাফল`;

    var displayedHits = res.items.slice(0, 50);
    var html = '';

    displayedHits.forEach(function(item) {
      var subMeta = SUBJECT_METAS[item.s] || { bg: 'rgba(15,118,110,0.1)', text: '#0f766e', name: item.s };
      var typeBadge = TYPE_BADGES[item.t] || { text: 'তথ্য', bg: 'rgba(0,0,0,0.06)', color: '#334155' };
      var href = resolveItemHref(item);
      var snippet = createHighlightedSnippet(item.txt, query, config.matchType);

      html += `
        <a class="ebk-result-card" href="${href}">
          <div class="ebk-card-meta-row">
            <span style="background:${subMeta.bg}; color:${subMeta.text}; padding:2px 8px; border-radius:6px; font-weight:700; font-size:0.78rem;">
              📚 ${subMeta.name}
            </span>
            <span style="background:${typeBadge.bg}; color:${typeBadge.color}; padding:2px 8px; border-radius:6px; font-weight:700; font-size:0.76rem;">
              ${typeBadge.text}
            </span>
          </div>

          <div class="ebk-card-title">
            <span>📖</span> <span>${item.c}</span>
          </div>

          <div class="ebk-card-snippet">
            ${snippet}
          </div>

          <div class="ebk-card-footer">
            <span>সরাসরি অধ্যায়ে পড়ুন ↗</span>
          </div>
        </a>
      `;
    });

    if (res.total > 50) {
      html += `
        <div style="padding:14px; text-align:center; color:var(--text-muted,#64748b); font-size:0.86rem;">
          (প্রথম ৫০টি ফলাফল প্রদর্শিত হচ্ছে, আরও সুনির্দিষ্ট ফলাফলের জন্য আরও কিছু শব্দ যোগ করুন)
        </div>
      `;
    }

    grid.innerHTML = html;
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // --- Bind Event Listeners ---
  function bindSearchEvents() {
    var input = document.getElementById('ebkSearchInput');
    var clearBtn = document.getElementById('ebkClearBtn');
    var searchBtn = document.getElementById('ebkSearchBtn');
    var settingsBtn = document.getElementById('ebkSettingsBtn');
    var suggestBox = document.getElementById('ebkSuggestBox');

    if (!input) return;

    var debounceTimer = null;

    // Real-time suggestions on typing + local card filter
    input.addEventListener('input', function(e) {
      var val = e.target.value;
      if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';

      // Also filter local chapter cards on this page if any
      filterLocalChapterCards(val);

      clearTimeout(debounceTimer);
      if (!val.trim()) {
        if (suggestBox) suggestBox.style.display = 'none';
        return;
      }

      debounceTimer = setTimeout(function() {
        loadSearchData(function() {
          var config = getSearchConfig();
          var res = executeSearch(val, config);
          renderSuggestions(res, val, config);
        });
      }, 180);
    });

    // Enter key submits full search
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (searchBtn) searchBtn.click();
      } else if (e.key === 'Escape') {
        if (suggestBox) suggestBox.style.display = 'none';
      }
    });

    // Search button click
    if (searchBtn) {
      searchBtn.addEventListener('click', function() {
        var val = input.value;
        if (!val.trim()) return;
        loadSearchData(function() {
          var config = getSearchConfig();
          var res = executeSearch(val, config);
          renderFullResults(res, val, config);
        });
      });
    }

    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        input.value = '';
        clearBtn.style.display = 'none';
        if (suggestBox) suggestBox.style.display = 'none';
        var panel = document.getElementById('ebkResultsPanel');
        if (panel) panel.style.display = 'none';
        filterLocalChapterCards('');
        input.focus();
      });
    }

    // Settings button
    if (settingsBtn) {
      settingsBtn.addEventListener('click', function() {
        window.openEbkSearchModal();
      });
    }

    // Hide suggest box on outside click
    document.addEventListener('click', function(e) {
      var container = document.querySelector('.ebk-search-container');
      if (container && !container.contains(e.target)) {
        if (suggestBox) suggestBox.style.display = 'none';
      }
    });

    // Modal Radio events
    bindModalRadios();
  }

  // --- Modal Events and Save ---
  function bindModalRadios() {
    function setupRadioGroup(groupId, storageKey) {
      var group = document.getElementById(groupId);
      if (!group) return;
      var labels = group.querySelectorAll('.ebk-radio-label');
      labels.forEach(function(label) {
        var radio = label.querySelector('input[type="radio"]');
        if (!radio) return;
        label.addEventListener('click', function() {
          labels.forEach(function(l) { l.classList.remove('active'); });
          label.classList.add('active');
          radio.checked = true;
          setSearchConfig(storageKey, radio.value);
          updateFilterPills();
          retriggerActiveSearch();
        });
      });
    }

    setupRadioGroup('scopeRadioGroup', 'ebk_search_scope');
    setupRadioGroup('matchRadioGroup', 'ebk_search_match');
    setupRadioGroup('minLenRadioGroup', 'ebk_search_min_len');

    var subCheck = document.getElementById('onlyCurrentSubCheck');
    if (subCheck) {
      subCheck.addEventListener('change', function(e) {
        setSearchConfig('ebk_search_only_sub', e.target.checked ? 'true' : 'false');
        var lbl = subCheck.closest('.ebk-radio-label');
        if (lbl) {
          if (e.target.checked) lbl.classList.add('active');
          else lbl.classList.remove('active');
        }
        updateFilterPills();
        // If toggled off, make sure we reload full searchData from master
        loadSearchData(function() {
          retriggerActiveSearch();
        });
      });
    }
  }

  function retriggerActiveSearch() {
    var input = document.getElementById('ebkSearchInput');
    if (input && input.value.trim()) {
      var config = getSearchConfig();
      var res = executeSearch(input.value, config);
      var panel = document.getElementById('ebkResultsPanel');
      if (panel && panel.style.display === 'block') {
        renderFullResults(res, input.value, config);
      } else {
        renderSuggestions(res, input.value, config);
      }
    }
  }

  // --- Modal Window Helpers ---
  window.openEbkSearchModal = function() {
    var modal = document.getElementById('ebkSearchModal');
    if (modal) modal.classList.add('open');
  };

  window.closeEbkSearchModal = function() {
    var modal = document.getElementById('ebkSearchModal');
    if (modal) modal.classList.remove('open');
  };

  window.resetEbkSearchSettings = function() {
    setSearchConfig('ebk_search_scope', 'all');
    setSearchConfig('ebk_search_match', 'all_words');
    setSearchConfig('ebk_search_min_len', '5');
    setSearchConfig('ebk_search_only_sub', 'true');

    var modal = document.getElementById('ebkSearchModal');
    if (modal) {
      modal.querySelectorAll('.ebk-radio-label').forEach(function(l) { l.classList.remove('active'); });
      var allRadio = modal.querySelector('input[value="all"]');
      if (allRadio) { allRadio.checked = true; allRadio.closest('.ebk-radio-label').classList.add('active'); }
      var matchRadio = modal.querySelector('input[value="all_words"]');
      if (matchRadio) { matchRadio.checked = true; matchRadio.closest('.ebk-radio-label').classList.add('active'); }
      var minRadio = modal.querySelector('input[value="5"]');
      if (minRadio) { minRadio.checked = true; minRadio.closest('.ebk-radio-label').classList.add('active'); }
      var subCheck = modal.querySelector('#onlyCurrentSubCheck');
      if (subCheck) { subCheck.checked = true; subCheck.closest('.ebk-radio-label').classList.add('active'); }
    }
    updateFilterPills();
    retriggerActiveSearch();
  };

  // --- Auto-Initialize on DOMContentLoaded ---
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      loadSearchData();
    }, 250);

    var mountPoint = document.getElementById('ebkSearchMount') || document.querySelector('.search-wrapper');
    if (mountPoint) {
      renderSearchUI(mountPoint);
    }
  });

  // Expose engine API globally
  window.EbkSearchEngine = {
    load: loadSearchData,
    search: executeSearch,
    getConfig: getSearchConfig,
    setConfig: setSearchConfig,
    renderUI: renderSearchUI
  };

})();
