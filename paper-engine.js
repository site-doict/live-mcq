/**
 * PaperEngine - Dynamic Font & Paper Texture Randomization Engine
 * Version: 1.0.0
 * 
 * Features:
 * 1. Randomizes authentic Bangla handwritten fonts on every page load/refresh.
 * 2. Randomizes high-fidelity paper textures (10 distinct styles).
 * 3. Injects CSS variables (--sk-font-bn, --paper-font-active) and utility classes.
 * 4. HTML5 Canvas rendering engine with font-readiness guarantees.
 * 5. Interactive Control Bar widget and developer API.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PaperEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // =========================================================================
  // 1. Registry: Authentic Bangla Handwritten Fonts (from Fonts/ directory)
  // =========================================================================
  const BANGLA_FONTS = [
    {
      id: 'nirlipta',
      name: 'Nirlipta',
      bnName: 'নির্লিপ্ত (হস্তলিপি)',
      family: 'Nirlipta',
      className: 'font-nirlipta',
      category: 'handwritten',
      description: 'স্বাভাবিক ও প্রাণবন্ত হস্তলিপি, নোট ও পয়েন্টের জন্য সেরা।'
    },
    {
      id: 'rayhan',
      name: 'FN Rayhan Hosthoshoily',
      bnName: 'রায়হান হস্তশৈলী',
      family: 'FNRayhanHosthoshoily',
      className: 'font-rayhan',
      category: 'handwritten',
      description: 'অত্যন্ত আকর্ষণীয় ও মসৃণ টানা হাতের লেখা।'
    },
    {
      id: 'durbar',
      name: 'Durbar',
      bnName: 'দুর্বার',
      family: 'Durbar',
      className: 'font-durbar',
      category: 'casual',
      description: 'বলিষ্ঠ ও গতিশীল বাংলা ফন্ট, শিরোনামে দারুণ।'
    },
    {
      id: 'begum-zia',
      name: 'Begum Zia',
      bnName: 'বেগম জিয়া',
      family: 'BegumZia',
      className: 'font-begum-zia',
      category: 'cursive',
      description: 'মার্কার পেনের মতো দৃষ্টিনন্দন বাঁকানো অক্ষরবিন্যাস।'
    },
    {
      id: 'anirban',
      name: 'Anirban',
      bnName: 'অনির্বাণ',
      family: 'Anirban',
      className: 'font-anirban',
      category: 'handwritten',
      description: 'খাতার পেন্সিলে লেখার মতো স্পষ্ট ও পরিচ্ছন্ন ফন্ট।'
    },
    {
      id: 'badhon-ador',
      name: 'FN Badhon Ador',
      bnName: 'বাঁধন আদর',
      family: 'FNBadhonAdor',
      className: 'font-badhon-ador',
      category: 'handwritten',
      description: 'স্নিগ্ধ ও মায়াবী হাতের লেখার ছন্দ।'
    },
    {
      id: 'shorif-rafid',
      name: 'FN Shorif Rafid',
      bnName: 'শরীফ রাফিদ',
      family: 'FNShorifRafid',
      className: 'font-shorif-rafid',
      category: 'handwritten',
      description: 'আধুনিক বাংলা ক্যালিগ্রাফিক ছোঁয়াযুক্ত ফন্ট।'
    },
    {
      id: 'hasan',
      name: 'FN Hasan Kolkata',
      bnName: 'হাসান কলকাতা',
      family: 'FNHasanKolkata',
      className: 'font-hasan',
      category: 'calligraphy',
      description: 'ঐতিহ্যবাহী কলকাতা ঘরানার হস্তলিপি।'
    },
    {
      id: 'ahasan',
      name: 'FN Ahasan Nilanjona',
      bnName: 'আহসান নীলাঞ্জনা',
      family: 'FNAhasanNilanjona',
      className: 'font-ahasan',
      category: 'cursive',
      description: 'কাব্যিক ও কোমল ডায়রি নোটের উপযোগী ফন্ট।'
    },
    {
      id: 'mamun',
      name: 'FN Mamun Bornolipi',
      bnName: 'মামুন বর্ণলিপি',
      family: 'FNMamunBornolipi',
      className: 'font-mamun',
      category: 'handwritten',
      description: 'ক্লাসরুমের দ্রুত নোট নেওয়ার মতো বাস্তবসম্মত ফন্ট।'
    },
    {
      id: 'gedamala',
      name: 'FN Badhon Gedamala',
      bnName: 'বাঁধন গেঁদামালা',
      family: 'FNBadhonGedamala',
      className: 'font-gedamala',
      category: 'handwritten',
      description: 'অনন্য দেশীয় নান্দনিক হস্তলিপি।'
    },
    {
      id: 'kornofuli',
      name: 'Kornofuli',
      bnName: 'কর্ণফুলী',
      family: 'Kornofuli',
      className: 'font-kornofuli',
      category: 'casual',
      description: 'নদীর তরঙ্গের মতো প্রবাহমান হস্তাক্ষর।'
    },
    {
      id: 'shadhinata',
      name: 'Li Shadhinata 2.0',
      bnName: 'স্বাধীনতা ২.০',
      family: 'LiShadhinata',
      className: 'font-shadhinata',
      category: 'bold',
      description: 'দৃঢ় ও স্বতঃস্ফূর্ত বাংলা ফন্ট।'
    },
    {
      id: 'trimohona',
      name: 'Trimohona',
      bnName: 'ত্রিমোহনা',
      family: 'Trimohona',
      className: 'font-trimohona',
      category: 'handwritten',
      description: 'সুস্পষ্ট ও পঠনযোগ্য পরিশীলিত ফন্ট।'
    },
    {
      id: 'prapti',
      name: 'Prapti MM',
      bnName: 'প্রাপ্তি',
      family: 'PraptiMM',
      className: 'font-prapti',
      category: 'handwritten',
      description: 'ছোট হস্তাক্ষরে সাজানো ব্যক্তিগত নোটবুক লুক।'
    },
    {
      id: 'abu-sayed',
      name: 'Codepotro Abu Sayed',
      bnName: 'আবু সাঈদ',
      family: 'CodepotroAbuSayed',
      className: 'font-abu-sayed',
      category: 'display',
      description: 'বিশিষ্ট প্রকাশনামুখী হস্তলিপিশৈলী।'
    },
    {
      id: 'ekush',
      name: 'Ekush',
      bnName: 'একুশ',
      family: 'Ekush',
      className: 'font-ekush',
      category: 'display',
      description: 'ভাষা দিবসের প্রেরণায় নির্মিত হস্তলিপি।'
    },
    {
      id: 'priotoma',
      name: 'FN Mahin Priotoma',
      bnName: 'প্রিয়তমা',
      family: 'FNMahinPriotoma',
      className: 'font-priotoma',
      category: 'cursive',
      description: 'রোমান্টিক ও চারুলিপিশৈলীর সংমিশ্রণ।'
    },
    {
      id: 'priotoma-2',
      name: 'FN Mahin Priotoma 2',
      bnName: 'প্রিয়তমা ২',
      family: 'FNMahinPriotoma2',
      className: 'font-priotoma-2',
      category: 'cursive',
      description: 'প্রিয়তমা ফন্টের উন্নত ও মার্জিত সংস্করণ।'
    },
    {
      id: 'dinar',
      name: 'FN Dinar AA Borna',
      bnName: 'দিনার বর্ণ',
      family: 'FNDinarAABorna',
      className: 'font-dinar',
      category: 'display',
      description: 'স্পষ্ট ও ব্যঞ্জনাময় অক্ষরবিন্যাস।'
    }
  ];

  // =========================================================================
  // 2. Registry: 10 Realistic High-Fidelity Paper Textures
  // =========================================================================
  const PAPER_TEXTURES = [
    {
      id: 'lined-notebook',
      name: 'Lined Notebook',
      bnName: 'দাগটানা খাতা',
      className: 'paper-lined-notebook',
      description: 'স্কুল-কলেজের ক্লাসিক রুলটানা খাতা, বামে লাল মার্জিন ও স্পাইরাল বাইন্ডিং।'
    },
    {
      id: 'old-aged',
      name: 'Old Aged Paper',
      bnName: 'পুরাতন কাগজ (ভিন্টেজ পার্চমেন্ট)',
      className: 'paper-old-aged',
      description: 'ঐতিহাসিক উষ্ণ সেপিয়া রঙের শতাব্দী প্রাচীন নথির অনুভূতি ও গ্রাঞ্জ গ্রেইন।'
    },
    {
      id: 'torn',
      name: 'Torn Paper',
      bnName: 'ছেঁড়া পাতা (রিপড এজ)',
      className: 'paper-torn',
      description: 'খাতা থেকে দ্রুত ছিঁড়ে নেওয়া অসমান খাঁজকাটা প্রান্ত ও সেলুলোজ ফাইবার লুক।'
    },
    {
      id: 'dot-grid',
      name: 'Dot Grid Paper',
      bnName: 'ডট গ্রিড খাতা (বুলেট জার্নাল)',
      className: 'paper-dot-grid',
      description: 'আধুনিক ও মিনিমালিস্ট বুলেট জার্নাল, ২৪ পিক্সেলের সুবিন্যস্ত ডট ম্যাট্রিক্স।'
    },
    {
      id: 'graph',
      name: 'Graph Paper',
      bnName: 'গ্রাফ পেপার (ব্লুপ্রিন্ট ও চার্ট)',
      className: 'paper-graph',
      description: 'প্রকৌশল ও পরিসংখ্যানের নীল গ্রিড লাইনযুক্ত কারিগরি খাতার পাতা।'
    },
    {
      id: 'crumpled',
      name: 'Crumpled Paper',
      bnName: 'কুঁচকানো কাগজ (৩ডি ক্রাম্পল্ড)',
      className: 'paper-crumpled',
      description: 'হাতে দুমড়ে-মুচড়ে আবার সোজা করা কাগজের বাস্তবসম্মত ৩ডি ভাঁজ ও ছায়া।'
    },
    {
      id: 'coffee-stained',
      name: 'Coffee Stained Parchment',
      bnName: 'কফি বা চায়ের দাগযুক্ত কাগজ',
      className: 'paper-coffee-stained',
      description: 'গভীর রাতে পড়তে পড়তে কফির মগের গোল দাগ ও ছিটকে পড়া ফোঁটার শৈল্পিক পরিবেশ।'
    },
    {
      id: 'legal-pad',
      name: 'Legal Pad',
      bnName: 'হলুদ আইনি প্যাড (ক্যানারি প্যাড)',
      className: 'paper-legal-pad',
      description: 'উজ্জ্বল হলুদ আইনি ড্রাফট খাতা, বামে ডাবল লাল মার্জিন ও চামড়ার হেড বাইন্ডিং।'
    },
    {
      id: 'burnt-edge',
      name: 'Burnt Edge Scroll',
      bnName: 'পোড়া কাগজের স্ক্রোল',
      className: 'paper-burnt-edge',
      description: 'আগুনের শিখায় পোড়া কালো-বাদামি সীমানা সম্বলিত প্রাচীন পাণ্ডুলিপি।'
    },
    {
      id: 'kraft',
      name: 'Kraft Paper',
      bnName: 'কার্ডবোর্ড বা ক্রাফট কাগজ',
      className: 'paper-kraft',
      description: 'অর্গানিক খসখসে বাদামি প্যাকিং কাগজ ও টেক্সচারযুক্ত ক্রাফট শিট।'
    }
  ];

  // =========================================================================
  // 3. Engine State & Default Options
  // =========================================================================
  const state = {
    activeFont: null,
    activeTexture: null,
    options: {
      autoRandomizeOnLoad: false, // Strictly false: respect static build-time HTML classes on refresh
      targetSelector: '.paper-container, .sk-page, [data-paper-randomize]',
      persistSelection: false,
      storageKey: 'paperEngine_state'
    }
  };

  // Helper: Random item picker
  function pickRandom(array) {
    if (!array || array.length === 0) return null;
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }

  // =========================================================================
  // 4. Core Actions: Apply Font & Texture
  // =========================================================================

  /**
   * Applies the chosen font to the entire document and target components.
   * Updates CSS variables: --paper-font-active, --sk-font-bn, --paper-font
   */
  function setFont(fontOrId) {
    let font = null;
    if (typeof fontOrId === 'string') {
      font = BANGLA_FONTS.find(f => f.id === fontOrId || f.name.toLowerCase() === fontOrId.toLowerCase()) || BANGLA_FONTS[0];
    } else if (fontOrId && fontOrId.family) {
      font = fontOrId;
    } else {
      font = pickRandom(BANGLA_FONTS);
    }

    state.activeFont = font;

    // Fallback font stack
    const fontStack = `'${font.family}', 'Nirlipta', 'FNRayhanHosthoshoily', 'Atma', 'Baloo Da 2', 'Hind Siliguri', cursive, sans-serif`;

    // Inject/Update CSS variables on :root
    document.documentElement.style.setProperty('--paper-font-active', fontStack);
    document.documentElement.style.setProperty('--sk-font-bn', fontStack);
    document.documentElement.style.setProperty('--paper-font', fontStack);

    // Update body classes for utility font targeting
    BANGLA_FONTS.forEach(f => document.body.classList.remove(f.className));
    document.body.classList.add(font.className);

    // Save if persistence enabled
    if (state.options.persistSelection) {
      savePersistedState();
    }

    dispatchChangeEvent();
    return font;
  }

  /**
   * Applies the chosen paper texture to all matched container elements.
   * Strips out previous paper-* classes and adds the new one.
   */
  function setTexture(textureOrId, targetSelector) {
    let texture = null;
    if (typeof textureOrId === 'string') {
      texture = PAPER_TEXTURES.find(t => t.id === textureOrId || t.className === textureOrId) || PAPER_TEXTURES[0];
    } else if (textureOrId && textureOrId.className) {
      texture = textureOrId;
    } else {
      texture = pickRandom(PAPER_TEXTURES);
    }

    state.activeTexture = texture;
    const selector = targetSelector || state.options.targetSelector;
    const targets = document.querySelectorAll(selector);

    targets.forEach(el => {
      // Remove all known paper texture classes
      PAPER_TEXTURES.forEach(t => el.classList.remove(t.className));
      // Ensure base container class
      if (!el.classList.contains('paper-container') && !el.classList.contains('sk-page')) {
        el.classList.add('paper-container');
      }
      // Add newly selected paper texture
      el.classList.add(texture.className);
    });

    if (state.options.persistSelection) {
      savePersistedState();
    }

    dispatchChangeEvent();
    return texture;
  }

  /**
   * Re-randomizes both font and paper texture simultaneously.
   */
  function randomize(options = {}) {
    const config = Object.assign({ font: true, texture: true }, options);
    let newFont = null;
    let newTexture = null;

    if (config.font) {
      newFont = setFont(pickRandom(BANGLA_FONTS));
    }
    if (config.texture) {
      newTexture = setTexture(pickRandom(PAPER_TEXTURES));
    }

    return { font: newFont || state.activeFont, texture: newTexture || state.activeTexture };
  }

  // =========================================================================
  // 5. Persistence Handlers (sessionStorage)
  // =========================================================================
  function savePersistedState() {
    try {
      const data = {
        fontId: state.activeFont ? state.activeFont.id : null,
        textureId: state.activeTexture ? state.activeTexture.id : null
      };
      sessionStorage.setItem(state.options.storageKey, JSON.stringify(data));
    } catch (e) {
      // Quiet fail if storage unavailable
    }
  }

  function loadPersistedState() {
    try {
      const raw = sessionStorage.getItem(state.options.storageKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  // =========================================================================
  // 6. Custom Event Dispatcher
  // =========================================================================
  function dispatchChangeEvent() {
    const event = new CustomEvent('paperEngineChange', {
      bubbles: true,
      detail: {
        font: state.activeFont,
        texture: state.activeTexture
      }
    });
    document.dispatchEvent(event);
  }

  // =========================================================================
  // 7. HTML5 Canvas Handwritten Rendering Helper
  // =========================================================================
  /**
   * Draws styled Bengali handwritten text onto an HTML5 Canvas,
   * guaranteeing font readiness via document.fonts.ready.
   */
  async function renderToCanvas(canvas, text, userOpts = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const opts = Object.assign({
      fontSize: 28,
      fontColor: '#1e293b',
      lineHeight: 1.6,
      padding: 30,
      font: state.activeFont ? state.activeFont.family : 'Nirlipta',
      align: 'left',
      maxWidth: canvas.width - 60
    }, userOpts);

    // Wait until fonts are loaded
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    ctx.font = `${opts.fontSize}px '${opts.font}', cursive, sans-serif`;
    ctx.fillStyle = opts.fontColor;
    ctx.textAlign = opts.align;
    ctx.textBaseline = 'top';

    // Simple line wrap for Bengali
    const words = text.split(' ');
    let line = '';
    let y = opts.padding;
    const x = opts.align === 'center' ? canvas.width / 2 : opts.padding;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > opts.maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = words[i] + ' ';
        y += opts.fontSize * opts.lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  // =========================================================================
  // 8. Interactive Control Bar (UI Widget)
  // =========================================================================
  function createControlBar(mountTarget) {
    const target = mountTarget ? (typeof mountTarget === 'string' ? document.querySelector(mountTarget) : mountTarget) : document.body;
    if (!target) return;

    // Check if already exists
    if (document.getElementById('paper-engine-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'paper-engine-bar';
    bar.style.cssText = `
      position: sticky;
      top: 10px;
      z-index: 999;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin: 10px auto 20px auto;
      max-width: 960px;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(203, 213, 225, 0.8);
      border-radius: 12px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      color: #1e293b;
      transition: all 0.3s ease;
    `;

    // Left group: Randomize Button & Badges
    const leftGroup = document.createElement('div');
    leftGroup.style.cssText = 'display: flex; align-items: center; gap: 8px; flex-wrap: wrap;';

    const randBtn = document.createElement('button');
    randBtn.type = 'button';
    randBtn.innerHTML = '🎲 <strong>র্যান্ডমাইজ করুন</strong>';
    randBtn.style.cssText = `
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      border: none;
      padding: 7px 14px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
      transition: transform 0.15s, box-shadow 0.15s;
    `;
    randBtn.onmouseenter = () => { randBtn.style.transform = 'translateY(-1px)'; randBtn.style.boxShadow = '0 4px 10px rgba(37, 99, 235, 0.4)'; };
    randBtn.onmouseleave = () => { randBtn.style.transform = 'none'; randBtn.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.3)'; };
    randBtn.onclick = () => { randomize(); };

    const fontBadge = document.createElement('span');
    fontBadge.id = 'peb-font-badge';
    fontBadge.style.cssText = 'background: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;';

    const textureBadge = document.createElement('span');
    textureBadge.id = 'peb-texture-badge';
    textureBadge.style.cssText = 'background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;';

    leftGroup.appendChild(randBtn);
    leftGroup.appendChild(fontBadge);
    leftGroup.appendChild(textureBadge);

    // Right group: Selectors & Theme Toggle
    const rightGroup = document.createElement('div');
    rightGroup.style.cssText = 'display: flex; align-items: center; gap: 8px; flex-wrap: wrap;';

    // Font select
    const fontSelect = document.createElement('select');
    fontSelect.id = 'peb-font-select';
    fontSelect.style.cssText = 'padding: 6px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 13px; background: white; color: #1e293b; cursor: pointer;';
    BANGLA_FONTS.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `🖋️ ${f.bnName}`;
      fontSelect.appendChild(opt);
    });
    fontSelect.onchange = (e) => { setFont(e.target.value); };

    // Texture select
    const textureSelect = document.createElement('select');
    textureSelect.id = 'peb-texture-select';
    textureSelect.style.cssText = 'padding: 6px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 13px; background: white; color: #1e293b; cursor: pointer;';
    PAPER_TEXTURES.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `📜 ${t.bnName}`;
      textureSelect.appendChild(opt);
    });
    textureSelect.onchange = (e) => { setTexture(e.target.value); };

    // Dark Mode Toggle
    const themeBtn = document.createElement('button');
    themeBtn.type = 'button';
    themeBtn.id = 'peb-theme-btn';
    themeBtn.innerHTML = '🌙';
    themeBtn.title = 'ডার্ক / লাইট মোড টগল';
    themeBtn.style.cssText = `
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    `;
    themeBtn.onclick = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.body.classList.contains('dark-mode');
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark-mode');
        themeBtn.innerHTML = '🌙';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        themeBtn.innerHTML = '☀️';
      }
    };

    rightGroup.appendChild(fontSelect);
    rightGroup.appendChild(textureSelect);
    rightGroup.appendChild(themeBtn);

    bar.appendChild(leftGroup);
    bar.appendChild(rightGroup);

    // Insert at top of container or body
    if (target.firstChild) {
      target.insertBefore(bar, target.firstChild);
    } else {
      target.appendChild(bar);
    }

    // Function to update control bar UI on state changes
    function updateBarUI() {
      if (state.activeFont) {
        fontBadge.textContent = `ফন্ট: ${state.activeFont.bnName}`;
        fontSelect.value = state.activeFont.id;
      }
      if (state.activeTexture) {
        textureBadge.textContent = `কাগজ: ${state.activeTexture.bnName}`;
        textureSelect.value = state.activeTexture.id;
      }
    }

    document.addEventListener('paperEngineChange', updateBarUI);
    updateBarUI();
  }

  // =========================================================================
  // 9. Engine Initialization
  // =========================================================================
  function init(customOptions = {}) {
    Object.assign(state.options, customOptions);

    // Detect statically baked classes from the DOM
    const target = document.querySelector(state.options.targetSelector);
    if (target) {
      for (const t of PAPER_TEXTURES) {
        if (target.classList.contains(t.className)) {
          state.activeTexture = t;
          break;
        }
      }
      for (const f of BANGLA_FONTS) {
        if (target.classList.contains(f.className) || document.body.classList.contains(f.className)) {
          state.activeFont = f;
          break;
        }
      }
    }

    // Only randomize if explicitly instructed via autoRandomizeOnLoad: true
    if (state.options.autoRandomizeOnLoad) {
      let initialFont = null;
      let initialTexture = null;

      if (state.options.persistSelection) {
        const persisted = loadPersistedState();
        if (persisted) {
          initialFont = BANGLA_FONTS.find(f => f.id === persisted.fontId);
          initialTexture = PAPER_TEXTURES.find(t => t.id === persisted.textureId);
        }
      }

      if (!initialFont) initialFont = pickRandom(BANGLA_FONTS);
      if (!initialTexture) initialTexture = pickRandom(PAPER_TEXTURES);

      setFont(initialFont);
      setTexture(initialTexture);
    } else {
      // Keep static authoring stable, do not alter classes on page refresh
      if (!state.activeFont) state.activeFont = BANGLA_FONTS[0];
      if (!state.activeTexture) state.activeTexture = PAPER_TEXTURES[0];
      dispatchChangeEvent();
    }

    if (state.options.renderControlBar) {
      createControlBar(state.options.controlBarMount);
    }
  }

  // Auto-run on DOM ready if in browser
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => init());
    } else {
      init();
    }
  }

  // =========================================================================
  // 10. Public API
  // =========================================================================
  return {
    init: init,
    randomize: randomize,
    setFont: setFont,
    setTexture: setTexture,
    getFonts: () => [...BANGLA_FONTS],
    getTextures: () => [...PAPER_TEXTURES],
    getCurrentState: () => ({
      font: state.activeFont,
      texture: state.activeTexture
    }),
    createControlBar: createControlBar,
    renderToCanvas: renderToCanvas
  };
}));
