/**
 * BCS Smart Exam & Mock Test Engine
 * Live MCQ Bangla Literature & BCS Library
 * Zero External Fabrication & Authentic Past Exam Evaluation
 */

(function(window) {
  'use strict';

  // Bengali Digit Utilities
  const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  function toBn(n) {
    if (n === null || n === undefined) return '';
    return n.toString().replace(/\d/g, d => BN_DIGITS[d]);
  }

  // Subject Metadata & BCS Syllabus Marks
  const SUBJECT_CONFIG = {
    'Bangla Language': {
      name: 'বাংলা ভাষা ও ব্যাকরণ',
      short: 'বাংলা ভাষা',
      icon: '📖',
      logo: 'Live MCQ Bangla Language/logo.png',
      bcsMarks: 20
    },
    'Bangla Literature': {
      name: 'বাংলা সাহিত্য',
      short: 'বাংলা সাহিত্য',
      icon: '📜',
      logo: 'Live MCQ Bangla Literature/logo.png',
      bcsMarks: 15
    },
    'English Grammar': {
      name: 'ইংরেজি ভাষা ও ব্যাকরণ',
      short: 'ইংরেজি ভাষা',
      icon: '🔤',
      logo: 'Live MCQ English Grammar/logo.png',
      bcsMarks: 20
    },
    'English Literature': {
      name: 'ইংরেজি সাহিত্য',
      short: 'ইংরেজি সাহিত্য',
      icon: '🎭',
      logo: 'Live MCQ English Literature/logo.png',
      bcsMarks: 15
    },
    'Bangladesh': {
      name: 'বাংলাদেশ বিষয়াবলি',
      short: 'বাংলাদেশ',
      icon: '🇧🇩',
      logo: 'Live MCQ Bangladesh/logo.png',
      bcsMarks: 30
    },
    'International': {
      name: 'আন্তর্জাতিক বিষয়াবলি',
      short: 'আন্তর্জাতিক',
      icon: '🌐',
      logo: 'Live MCQ International/logo.png',
      bcsMarks: 20
    },
    'Geography': {
      name: 'ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা',
      short: 'ভূগোল ও পরিবেশ',
      icon: '🗺️',
      logo: 'Live MCQ Geography/logo.png',
      bcsMarks: 10
    },
    'General Science': {
      name: 'সাধারণ বিজ্ঞান',
      short: 'সাধারণ বিজ্ঞান',
      icon: '🔬',
      logo: 'Live MCQ General Science/logo.png',
      bcsMarks: 15
    },
    'Computer & IT': {
      name: 'কম্পিউটার ও তথ্যপ্রযুক্তি',
      short: 'কম্পিউটার ও আইটি',
      icon: '💻',
      logo: 'Live MCQ Computer & IT/logo.png',
      bcsMarks: 15
    },
    'Mathematical Reasoning': {
      name: 'গাণিতিক যুক্তি',
      short: 'গণিত',
      icon: '📐',
      logo: 'Live MCQ Mathematical Reasoning/logo.png',
      bcsMarks: 15
    },
    'Mental Ability': {
      name: 'মানসিক দক্ষতা',
      short: 'মানসিক দক্ষতা',
      icon: '🧠',
      logo: 'Live MCQ Mental Ability/logo.png',
      bcsMarks: 15
    },
    'Ethics & Good Governance': {
      name: 'নৈতিকতা, মূল্যবোধ ও সুশাসন',
      short: 'নৈতিকতা ও সুশাসন',
      icon: '⚖️',
      logo: 'Live MCQ Ethics & Good Governance/logo.png',
      bcsMarks: 10
    },
    'Non Cadre English': {
      name: 'নন-ক্যাডার ইংরেজি ভাষা ও সাহিত্য',
      short: 'নন-ক্যাডার ইংরেজি',
      icon: '🔤',
      logo: 'Non Cadre English/logo.png',
      bcsMarks: 20
    },
    'Non Cadre General Science': {
      name: 'নন-ক্যাডার সাধারণ বিজ্ঞান',
      short: 'নন-ক্যাডার বিজ্ঞান',
      icon: '🔬',
      logo: 'Non Cadre General Science/logo.png',
      bcsMarks: 20
    },
    'Non Cadre Arithmetic': {
      name: 'নন-ক্যাডার পাটিগণিত',
      short: 'নন-ক্যাডার পাটিগণিত',
      icon: '🔢',
      logo: 'Non Cadre Arithmetic/logo.png',
      bcsMarks: 20
    },
    'Non Cadre Algebra': {
      name: 'নন-ক্যাডার বীজগণিত',
      short: 'নন-ক্যাডার বীজগণিত',
      icon: '📐',
      logo: 'Non Cadre Algebra/logo.png',
      bcsMarks: 20
    }
  };

  const OPT_LABELS = ['ক', 'খ', 'গ', 'ঘ'];

  // Main Exam Engine State
  const ExamEngine = {
    allQuestions: [],
    sessionMap: {},
    subjectMap: {},
    isDataLoaded: false,

    // Setup state
    activeMode: 'session', // 'session', 'subject', 'random', 'mock200'
    selectedSession: '৪৯তম বিসিএস',
    selectedSessionSubjects: new Set(),
    selectedCustomSubjects: new Set(Object.keys(SUBJECT_CONFIG)),
    customQuestionCount: 20,
    useAutoTime: true,
    customDurationMinutes: '',
    applyNegativeMarking: true,

    // In-Exam State
    examQuestions: [],
    userAnswers: [], // index -> selected option index (0..3) or null
    timeRemaining: 0,
    totalTimeSeconds: 0,
    timerInterval: null,
    activeSubjectFilter: 'all', // 'all' or subject key
    showSourceTags: typeof localStorage !== 'undefined' ? (localStorage.getItem('exam_show_source_tags') !== 'false') : true,

    // Results State
    results: null,
    activeReviewFilter: 'all', // 'all', 'wrong', 'correct', 'skipped'

    init: async function() {
      try {
        const resp = await fetch('exam-data.json');
        if (!resp.ok) throw new Error('Failed to load exam data');
        this.allQuestions = await resp.json();
        this.buildIndices();
        this.isDataLoaded = true;

        // URL Deep-linking parameters
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const modeParam = urlParams.get('mode');
          const sessionParam = urlParams.get('session');
          const subjectParam = urlParams.get('subject');

          if (modeParam && ['session', 'subject', 'random', 'mock200'].includes(modeParam)) {
            this.activeMode = modeParam;
          }

          if (sessionParam && this.sessionMap[sessionParam]) {
            this.selectedSession = sessionParam;
            this.activeMode = 'session';
          }

          if (subjectParam && SUBJECT_CONFIG[subjectParam]) {
            this.selectedCustomSubjects = new Set([subjectParam]);
            this.activeMode = 'subject';
          }
        } catch(e) {}

        // Initialize session subjects for default session (49th BCS)
        this.initDefaultSession();
        this.renderSetupView();
      } catch (err) {
        console.error('Error initializing Exam Engine:', err);
        const container = document.getElementById('examApp');
        if (container) {
          container.innerHTML = `
            <div class="alert-box error" style="margin:40px auto; max-width:600px; text-align:center;">
              <h3>⚠️ পরীক্ষার প্রশ্নব্যাংক লোড হতে সমস্যা হয়েছে</h3>
              <p>দয়া করে পৃষ্ঠাটি রিফ্রেশ করুন অথবা লোকাল সার্ভার সচল আছে কি না নিশ্চিত করুন।</p>
              <button onclick="location.reload()" class="btn-primary" style="margin-top:14px;">পুনরায় চেষ্টা করুন</button>
            </div>
          `;
        }
      }
    },

    buildIndices: function() {
      this.sessionMap = {};
      this.subjectMap = {};

      for (const q of this.allQuestions) {
        // By Session
        if (q.bcs) {
          if (!this.sessionMap[q.bcs]) this.sessionMap[q.bcs] = [];
          this.sessionMap[q.bcs].push(q);
        }
        // By Subject
        if (!this.subjectMap[q.s]) this.subjectMap[q.s] = [];
        this.subjectMap[q.s].push(q);
      }
    },

    initDefaultSession: function() {
      // Pick 49th BCS if available, else first top session
      if (!this.sessionMap[this.selectedSession]) {
        const sortedSessions = Object.keys(this.sessionMap).sort((a,b) => this.sessionMap[b].length - this.sessionMap[a].length);
        this.selectedSession = sortedSessions[0] || '';
      }
      this.resetSessionSubjectsToAll();
    },

    resetSessionSubjectsToAll: function() {
      this.selectedSessionSubjects.clear();
      const list = this.sessionMap[this.selectedSession] || [];
      for (const q of list) {
        this.selectedSessionSubjects.add(q.s);
      }
    },

    // ==========================================
    // TIME CALCULATION POLICY
    // ==========================================
    calculateDuration: function(questionsList) {
      const total = questionsList.length;
      if (total === 0) return { seconds: 0, text: '০ মিনিট', rule: 'কোনো প্রশ্ন নেই' };

      // User custom time
      if (!this.useAutoTime && this.customDurationMinutes && !isNaN(this.customDurationMinutes) && Number(this.customDurationMinutes) > 0) {
        const sec = Math.round(Number(this.customDurationMinutes) * 60);
        return {
          seconds: sec,
          text: `${toBn(Number(this.customDurationMinutes))} মিনিট`,
          rule: `ইউজারের ইচ্ছানুযায়ী নির্ধারিত সময় (${toBn(Number(this.customDurationMinutes))} মিনিট)`
        };
      }

      // Full BCS Mock Test (200 marks) = 120 minutes
      if (this.activeMode === 'mock200' || total === 200) {
        return {
          seconds: 120 * 60,
          text: '১২০ মিনিট (২ ঘণ্টা)',
          rule: 'বিসিএস অফিসিয়াল সিলেবাস অনুযায়ী পূর্ণাঙ্গ মডেল টেস্ট সময়: ১২০ মিনিট'
        };
      }

      // Math & Mental questions ratio
      const mathCount = questionsList.filter(q => q.s === 'Mathematical Reasoning' || q.s === 'Mental Ability').length;
      const mathRatio = mathCount / total;

      let secPerQ = 45;
      let ruleDesc = 'সাধারণ বিষয়: প্রতি প্রশ্নে ৪৫ সেকেন্ড';

      if (mathCount === total) {
        secPerQ = 90;
        ruleDesc = 'শুধু গণিত ও মানসিক দক্ষতা: প্রতি প্রশ্নে ৯০ সেকেন্ড (১.৫ মিনিট)';
      } else if (mathRatio >= 0.30) {
        secPerQ = 60;
        ruleDesc = `গণিত ও মানসিক দক্ষতা ${toBn((mathRatio * 100).toFixed(0))}% (৩০% এর বেশি): প্রতি প্রশ্নে ৬০ সেকেন্ড (১ মিনিট)`;
      }

      const totalSec = total * secPerQ;
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      const formatted = secs > 0 ? `${toBn(mins)} মিনিট ${toBn(secs)} সেকেন্ড` : `${toBn(mins)} মিনিট`;

      return {
        seconds: totalSec,
        secPerQ: secPerQ,
        text: formatted,
        rule: `${ruleDesc} হিসেবে মোট ${formatted}`
      };
    },

    // ==========================================
    // SETUP SCREEN RENDERING
    // ==========================================
    renderSetupView: function() {
      const container = document.getElementById('examApp');
      if (!container) return;

      // Available sessions sorted with count
      const sortedSessions = Object.keys(this.sessionMap).sort((a,b) => {
        // sort by number in session name if possible
        const getNum = str => {
          const m = str.match(/([০-৯]+)/);
          if (m) {
            const bnToEn = m[1].split('').map(c => BN_DIGITS.indexOf(c)).join('');
            return parseInt(bnToEn, 10);
          }
          return 0;
        };
        return getNum(b) - getNum(a);
      });

      // Quick popular badges
      const popularSessions = ['৪৯তম বিসিএস', '৪৭তম বিসিএস', '৪৬তম বিসিএস', '৪৫তম বিসিএস', '৪৪তম বিসিএস', '৪৩তম বিসিএস', '৪১তম বিসিএস', '৪০তম বিসিএস', '৩৮তম বিসিএস', '৩৭তম বিসিএস', '৩৫তম বিসিএস', '১০ম বিসিএস'];

      container.innerHTML = `
        <div class="exam-setup-wrapper">
          <!-- Setup Header -->
          <div class="setup-header">
            <div class="setup-badge">⚡ বিসিএস লাইভ এক্সাম প্ল্যাটফর্ম</div>
            <h1 class="setup-title">বিসিএস রিয়েল-টাইম এক্সাম ও মডেল টেস্ট</h1>
            <p class="setup-subtitle">বিসিএস পরীক্ষার প্রশ্নব্যাংক হতে সেশন ভিত্তিক, বিষয়ভিত্তিক কাস্টম ও পূর্ণাঙ্গ ২০০ নম্বরের মডেল টেস্ট দিন</p>
          </div>

          <!-- Mode Selector Tabs -->
          <div class="mode-tabs">
            <button class="mode-tab-btn ${this.activeMode === 'session' ? 'active' : ''}" onclick="ExamEngine.switchMode('session')">
              <span class="tab-icon">🏛️</span>
              <span class="tab-label">বিসিএস সেশন পরীক্ষা</span>
            </button>
            <button class="mode-tab-btn ${this.activeMode === 'subject' ? 'active' : ''}" onclick="ExamEngine.switchMode('subject')">
              <span class="tab-icon">📚</span>
              <span class="tab-label">বিষয়ভিত্তিক কাস্টম</span>
            </button>
            <button class="mode-tab-btn ${this.activeMode === 'random' ? 'active' : ''}" onclick="ExamEngine.switchMode('random')">
              <span class="tab-icon">🎲</span>
              <span class="tab-label">র‍্যান্ডম কুইক টেস্ট</span>
            </button>
            <button class="mode-tab-btn ${this.activeMode === 'mock200' ? 'active' : ''}" onclick="ExamEngine.switchMode('mock200')">
              <span class="tab-icon">🏆</span>
              <span class="tab-label">পূর্ণাঙ্গ মডেল টেস্ট (২০০)</span>
            </button>
          </div>

          <!-- Mode Content Card -->
          <div class="setup-card">
            ${this.renderActiveModeContent(sortedSessions, popularSessions)}
          </div>

          <!-- Exam Parameters & Start Banner -->
          <div class="setup-card settings-card" id="timeSettingsCard">
            ${this.renderTimeSettingsCard()}
          </div>
        </div>
      `;

      this.updateDynamicCalculations();
    },

    switchMode: function(mode) {
      this.activeMode = mode;
      this.renderSetupView();
    },

    renderActiveModeContent: function(sortedSessions, popularSessions) {
      if (this.activeMode === 'session') {
        const sessionQs = this.sessionMap[this.selectedSession] || [];
        const totalSessionCount = sessionQs.length;

        // Group by subject in this session
        const sessionSubCounts = {};
        for (const q of sessionQs) {
          sessionSubCounts[q.s] = (sessionSubCounts[q.s] || 0) + 1;
        }

        return `
          <div class="mode-session-panel">
            <div class="section-label">১. বিসিএস পরীক্ষার সেশন নির্বাচন করুন:</div>
            
            <!-- Quick Session Badges -->
            <div class="quick-chips-row">
              ${popularSessions.map(sess => `
                <button type="button" class="chip-btn ${this.selectedSession === sess ? 'active' : ''}" onclick="ExamEngine.changeSession('${sess}')">
                  ${sess}
                </button>
              `).join('')}
            </div>

            <!-- Session Dropdown -->
            <div class="form-row" style="margin-top: 14px;">
              <label for="sessionSelect" class="form-label">অথবা সকল বিসিএস সেশন তালিকা থেকে বেছে নিন:</label>
              <select id="sessionSelect" class="custom-select" onchange="ExamEngine.changeSession(this.value)">
                ${sortedSessions.map(sess => `
                  <option value="${sess}" ${this.selectedSession === sess ? 'selected' : ''}>
                    ${sess} (${toBn(this.sessionMap[sess].length)} টি প্রশ্ন)
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Dynamic Question Announcement Box -->
            <div class="announcement-box" id="sessionAnnouncement">
              <div class="announcement-icon">📢</div>
              <div class="announcement-body">
                <div class="announcement-title">
                  <strong>${this.selectedSession}</strong>-এ সর্বমোট <strong><span id="annTotal">${toBn(totalSessionCount)}</span>টি</strong> প্রশ্ন পাওয়া গেছে।
                </div>
                <div class="announcement-desc" id="annFilteredText">
                  আপনি সকল বিষয়ে অথবা নিচে নির্দিষ্ট বিষয়ের চেকবক্স নির্বাচন করে পরীক্ষা দিতে পারেন।
                </div>
              </div>
            </div>

            <!-- Subject Filter Checkboxes for this BCS -->
            <div class="subject-selection-header">
              <div class="section-label" style="margin-bottom:0;">২. কোন কোন বিষয়ের উপর পরীক্ষা দিবেন নির্বাচন করুন:</div>
              <div class="toggle-all-box">
                <button type="button" class="btn-text-action" onclick="ExamEngine.toggleAllSessionSubjects(true)">সব বিষয় নির্বাচন</button>
                <span class="sep">|</span>
                <button type="button" class="btn-text-action" onclick="ExamEngine.toggleAllSessionSubjects(false)">সব মুছুন</button>
              </div>
            </div>

            <div class="subject-checkboxes-grid" id="sessionSubjectsGrid">
              ${Object.keys(sessionSubCounts).map(subKey => {
                const conf = SUBJECT_CONFIG[subKey] || { name: subKey, icon: '📄' };
                const count = sessionSubCounts[subKey];
                const isChecked = this.selectedSessionSubjects.has(subKey);
                return `
                  <label class="subject-check-card ${isChecked ? 'checked' : ''}">
                    <input type="checkbox" value="${subKey}" ${isChecked ? 'checked' : ''} onchange="ExamEngine.toggleSessionSubject('${subKey}', this.checked)">
                    <div class="check-content">
                      <span class="sub-icon">${conf.icon}</span>
                      <div class="sub-meta">
                        <span class="sub-name">${conf.name}</span>
                        <span class="sub-count-badge">${toBn(count)}টি প্রশ্ন</span>
                      </div>
                    </div>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        `;
      } else if (this.activeMode === 'subject') {
        return `
          <div class="mode-subject-panel">
            <div class="subject-selection-header">
              <div class="section-label" style="margin-bottom:0;">১. যে বিষয়গুলোর উপর পরীক্ষা দিতে চান বেছে নিন:</div>
              <div class="toggle-all-box">
                <button type="button" class="btn-text-action" onclick="ExamEngine.toggleAllCustomSubjects(true)">সব বিষয় নির্বাচন</button>
                <span class="sep">|</span>
                <button type="button" class="btn-text-action" onclick="ExamEngine.toggleAllCustomSubjects(false)">সব মুছুন</button>
              </div>
            </div>

            <div class="subject-checkboxes-grid">
              ${Object.keys(SUBJECT_CONFIG).map(subKey => {
                const conf = SUBJECT_CONFIG[subKey];
                const count = (this.subjectMap[subKey] || []).length;
                const isChecked = this.selectedCustomSubjects.has(subKey);
                return `
                  <label class="subject-check-card ${isChecked ? 'checked' : ''}">
                    <input type="checkbox" value="${subKey}" ${isChecked ? 'checked' : ''} onchange="ExamEngine.toggleCustomSubject('${subKey}', this.checked)">
                    <div class="check-content">
                      <span class="sub-icon">${conf.icon}</span>
                      <div class="sub-meta">
                        <span class="sub-name">${conf.name}</span>
                        <span class="sub-count-badge">${toBn(count)}টি প্রশ্ন</span>
                      </div>
                    </div>
                  </label>
                `;
              }).join('')}
            </div>

            <!-- Question Count Setting -->
            <div class="form-row" style="margin-top: 20px;">
              <div class="section-label">২. কতটি প্রশ্নে পরীক্ষা দিতে চান?</div>
              <div class="quick-chips-row">
                ${[10, 20, 30, 50, 100].map(cnt => `
                  <button type="button" class="chip-btn ${this.customQuestionCount === cnt ? 'active' : ''}" onclick="ExamEngine.setCustomQuestionCount(${cnt})">
                    ${toBn(cnt)}টি প্রশ্ন
                  </button>
                `).join('')}
              </div>
              <div style="margin-top:12px; display:flex; align-items:center; gap:10px;">
                <label for="customCountInput" class="form-label" style="margin:0;">বা নিজের ইচ্ছেমতো সংখ্যা লিখুন:</label>
                <input type="number" id="customCountInput" class="custom-input" min="5" max="500" value="${this.customQuestionCount}" oninput="ExamEngine.setCustomQuestionCount(this.value)" style="width:110px;">
              </div>
            </div>
          </div>
        `;
      } else if (this.activeMode === 'random') {
        return `
          <div class="mode-random-panel">
            <div class="announcement-box info">
              <div class="announcement-icon">🎲</div>
              <div class="announcement-body">
                <div class="announcement-title"><strong>সম্পূর্ণ বই থেকে র‍্যান্ডম কুইক পরীক্ষা</strong></div>
                <div class="announcement-desc">১২টি বিষয়ের ৩,৯৭১টি প্রামাণ্য প্রশ্ন হতে স্বয়ংক্রিয়ভাবে নিরপেক্ষ প্রশ্ন নির্বাচন করা হবে।</div>
              </div>
            </div>

            <div class="form-row" style="margin-top: 20px;">
              <div class="section-label">কতটি প্রশ্নে পরীক্ষা দিতে চান?</div>
              <div class="quick-chips-row">
                ${[10, 20, 30, 50, 100].map(cnt => `
                  <button type="button" class="chip-btn ${this.customQuestionCount === cnt ? 'active' : ''}" onclick="ExamEngine.setCustomQuestionCount(${cnt})">
                    ${toBn(cnt)}টি প্রশ্ন
                  </button>
                `).join('')}
              </div>
              <div style="margin-top:12px; display:flex; align-items:center; gap:10px;">
                <label for="randomCountInput" class="form-label" style="margin:0;">বা নিজের ইচ্ছেমতো সংখ্যা লিখুন:</label>
                <input type="number" id="randomCountInput" class="custom-input" min="5" max="200" value="${this.customQuestionCount}" oninput="ExamEngine.setCustomQuestionCount(this.value)" style="width:110px;">
              </div>
            </div>
          </div>
        `;
      } else if (this.activeMode === 'mock200') {
        return `
          <div class="mode-mock-panel">
            <div class="announcement-box gold">
              <div class="announcement-icon">🏆</div>
              <div class="announcement-body">
                <div class="announcement-title"><strong>বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ ২০০ নম্বরের মডেল টেস্ট</strong></div>
                <div class="announcement-desc">বাংলাদেশ সরকারি কর্ম কমিশন (BPSC) এর অফিসিয়াল সিলেবাস ও মানবণ্টন অনুযায়ী ২০০টি প্রশ্ন ও ১২০ মিনিট (২ ঘণ্টা)।</div>
              </div>
            </div>

            <div class="section-label" style="margin-top:18px;">বিসিএস সিলেবাস ও মানবণ্টন রূপরেখা:</div>
            <div class="syllabus-grid">
              <div class="syl-card"><span class="syl-name">📖 বাংলা ভাষা ও ব্যাকরণ</span><span class="syl-mark">২০ মার্ক</span></div>
              <div class="syl-card"><span class="syl-name">📜 বাংলা সাহিত্য</span><span class="syl-mark">১৫ মার্ক</span></div>
              <div class="syl-card"><span class="syl-name">🔤 ইংরেজি ভাষা ও ব্যাকরণ</span><span class="syl-mark">২০ মার্ক</span></div>
              <div class="syl-card"><span class="syl-name">🎭 ইংরেজি সাহিত্য</span><span class="syl-mark">১৫ মার্ক</span></div>
              <div class="syl-card"><span class="syl-name">🇧🇩 বাংলাদেশ বিষয়াবলি</span><span class="syl-mark">৩০ মার্ক</span></div>
              <div class="syl-card"><span class="syl-name">🌐 আন্তর্জাতিক বিষয়াবলি</span><span class="syl-mark">২০ মার্ক</span></div>
              <div class="syl-card"><span class="syl-name">🔬 সাধারণ বিজ্ঞান</span><span class="syl-mark">১৫ মার্ক</span></div>
              <div class="syl-card"><span class="syl-name">💻 কম্পিউটার ও তথ্যপ্রযুক্তি</span><span class="syl-mark">১৫ মার্ক</span></div>
              <div class="syl-card"><span class="syl-name">📐 গাণিতিক যুক্তি</span><span class="syl-mark">১৫ মার্ক</span></div>
              <div class="syl-card"><span class="syl-name">🧠 মানসিক দক্ষতা</span><span class="syl-mark">১৫ মার্ক</span></div>
              <div class="syl-card"><span class="syl-name">🗺️ ভূগোল ও পরিবেশ</span><span class="syl-mark">১০ মার্ক</span></div>
              <div class="syl-card"><span class="syl-name">⚖️ নৈতিকতা ও সুশাসন</span><span class="syl-mark">১০ মার্ক</span></div>
            </div>
            <div class="mock-summary-bar">
              <span>সর্বমোট প্রশ্ন: <strong>২০০টি</strong></span>
              <span>সময়: <strong>১২০ মিনিট</strong></span>
              <span>ভুল উত্তরের জন্য: <strong>-০.৫০</strong></span>
            </div>
          </div>
        `;
      }
    },

    renderTimeSettingsCard: function() {
      return `
        <div class="time-settings-inner">
          <div class="settings-left">
            <h3 class="settings-title">⏱️ সময় ও নেগেটিভ মার্কিং নীতিমালা</h3>
            
            <div class="rule-indicator-box" id="ruleIndicator">
              <!-- Dynamically populated -->
            </div>

            <div class="time-override-row">
              <label class="custom-checkbox-label">
                <input type="checkbox" id="autoTimeCheck" ${this.useAutoTime ? 'checked' : ''} onchange="ExamEngine.toggleAutoTime(this.checked)">
                <span>স্বয়ংক্রিয় বুদ্ধিমান সময় নির্ধারণ নীতি অনুসরণ করুন</span>
              </label>
              
              <div id="customTimeBox" class="custom-time-input-wrap ${this.useAutoTime ? 'disabled' : ''}">
                <span class="label-txt">বা নির্দিষ্ট সময় দিন:</span>
                <input type="number" id="customMinutesInput" class="custom-input" min="1" max="180" placeholder="মিনিট" value="${this.customDurationMinutes}" oninput="ExamEngine.setCustomDuration(this.value)">
                <span class="unit-txt">মিনিট</span>
              </div>
            </div>

            <div class="negative-marking-row" style="margin-top:12px;">
              <label class="custom-checkbox-label">
                <input type="checkbox" id="negMarkCheck" ${this.applyNegativeMarking ? 'checked' : ''} onchange="ExamEngine.toggleNegativeMarking(this.checked)">
                <span>বিসিএস নেগেটিভ মার্কিং কার্যকর (-০.৫০ প্রতি ভুল উত্তরে)</span>
              </label>
            </div>
          </div>

          <div class="settings-right">
            <div class="exam-summary-card">
              <div class="summary-line">
                <span>নির্বাচিত প্রশ্ন:</span>
                <strong id="summaryQCount">০টি</strong>
              </div>
              <div class="summary-line">
                <span>ধার্যকৃত সময়:</span>
                <strong id="summaryDuration">০ মিনিট</strong>
              </div>
              <div class="summary-line">
                <span>পূর্ণমান:</span>
                <strong id="summaryFullMark">০ মার্ক</strong>
              </div>
              <button type="button" class="btn-start-exam" id="startExamBtn" onclick="ExamEngine.startExam()">
                <span>🚀 পরীক্ষা শুরু করুন</span>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    // Handlers for Setup
    changeSession: function(sessionName) {
      this.selectedSession = sessionName;
      this.resetSessionSubjectsToAll();
      this.renderSetupView();
    },

    toggleSessionSubject: function(subKey, checked) {
      if (checked) {
        this.selectedSessionSubjects.add(subKey);
      } else {
        this.selectedSessionSubjects.delete(subKey);
      }
      this.updateDynamicCalculations();
      // Update check card style
      const cards = document.querySelectorAll('#sessionSubjectsGrid .subject-check-card');
      cards.forEach(c => {
        const input = c.querySelector('input');
        if (input && input.value === subKey) {
          if (checked) c.classList.add('checked');
          else c.classList.remove('checked');
        }
      });
    },

    toggleAllSessionSubjects: function(enableAll) {
      const sessionQs = this.sessionMap[this.selectedSession] || [];
      if (enableAll) {
        for (const q of sessionQs) this.selectedSessionSubjects.add(q.s);
      } else {
        this.selectedSessionSubjects.clear();
      }
      this.renderSetupView();
    },

    toggleCustomSubject: function(subKey, checked) {
      if (checked) {
        this.selectedCustomSubjects.add(subKey);
      } else {
        this.selectedCustomSubjects.delete(subKey);
      }
      this.updateDynamicCalculations();
      // Update styling
      document.querySelectorAll('.mode-subject-panel .subject-check-card').forEach(c => {
        const input = c.querySelector('input');
        if (input && input.value === subKey) {
          if (checked) c.classList.add('checked');
          else c.classList.remove('checked');
        }
      });
    },

    toggleAllCustomSubjects: function(enableAll) {
      if (enableAll) {
        this.selectedCustomSubjects = new Set(Object.keys(SUBJECT_CONFIG));
      } else {
        this.selectedCustomSubjects.clear();
      }
      this.renderSetupView();
    },

    setCustomQuestionCount: function(cnt) {
      let num = parseInt(cnt, 10);
      if (isNaN(num) || num < 1) num = 10;
      this.customQuestionCount = num;
      // sync chips & input
      document.querySelectorAll('.quick-chips-row .chip-btn').forEach(btn => {
        const textNum = btn.textContent.replace(/\D/g, '');
        if (parseInt(textNum, 10) === num) btn.classList.add('active');
        else btn.classList.remove('active');
      });
      const input = document.getElementById('customCountInput') || document.getElementById('randomCountInput');
      if (input && parseInt(input.value, 10) !== num) input.value = num;
      this.updateDynamicCalculations();
    },

    toggleAutoTime: function(checked) {
      this.useAutoTime = checked;
      const box = document.getElementById('customTimeBox');
      if (box) {
        if (checked) box.classList.add('disabled');
        else box.classList.remove('disabled');
      }
      this.updateDynamicCalculations();
    },

    setCustomDuration: function(val) {
      this.customDurationMinutes = val;
      this.updateDynamicCalculations();
    },

    toggleNegativeMarking: function(checked) {
      this.applyNegativeMarking = checked;
    },

    // ==========================================
    // DYNAMIC POOL & SUMMARY CALCULATION
    // ==========================================
    getSelectedQuestionsPool: function() {
      if (this.activeMode === 'session') {
        const list = this.sessionMap[this.selectedSession] || [];
        return list.filter(q => this.selectedSessionSubjects.has(q.s));
      } else if (this.activeMode === 'subject') {
        const pool = [];
        for (const subKey of this.selectedCustomSubjects) {
          if (this.subjectMap[subKey]) pool.push(...this.subjectMap[subKey]);
        }
        return pool;
      } else if (this.activeMode === 'random') {
        return this.allQuestions;
      } else if (this.activeMode === 'mock200') {
        // Will assemble 200 questions according to syllabus
        return this.allQuestions;
      }
      return [];
    },

    updateDynamicCalculations: function() {
      let count = 0;
      let durationObj = { seconds: 0, text: '০ মিনিট', rule: '' };

      if (this.activeMode === 'session') {
        const pool = this.getSelectedQuestionsPool();
        count = pool.length;
        durationObj = this.calculateDuration(pool);

        // Update announcement text
        const annFilteredText = document.getElementById('annFilteredText');
        if (annFilteredText) {
          const totalSession = (this.sessionMap[this.selectedSession] || []).length;
          if (count === totalSession) {
            annFilteredText.innerHTML = `সকল বিষয়ের উপর সর্বমোট <strong>${toBn(count)}টি</strong> প্রশ্নে পরীক্ষা অনুষ্ঠিত হবে।`;
          } else {
            const subNames = Array.from(this.selectedSessionSubjects).map(s => (SUBJECT_CONFIG[s] ? SUBJECT_CONFIG[s].short : s));
            annFilteredText.innerHTML = `নির্বাচিত বিষয়ে সর্বমোট <strong>${toBn(count)}টি</strong> প্রশ্ন রয়েছে (${subNames.join(', ')} ইত্যাদি)।`;
          }
        }
      } else if (this.activeMode === 'subject') {
        const pool = this.getSelectedQuestionsPool();
        count = Math.min(this.customQuestionCount, pool.length);
        // Estimate sample questions
        const sampleSlice = pool.slice(0, count);
        durationObj = this.calculateDuration(sampleSlice);
      } else if (this.activeMode === 'random') {
        count = Math.min(this.customQuestionCount, this.allQuestions.length);
        const sampleSlice = this.allQuestions.slice(0, count);
        durationObj = this.calculateDuration(sampleSlice);
      } else if (this.activeMode === 'mock200') {
        count = 200;
        durationObj = this.calculateDuration(new Array(200).fill({ s: 'General Science' }));
      }

      // Update rule indicator box
      const ruleIndicator = document.getElementById('ruleIndicator');
      if (ruleIndicator) {
        ruleIndicator.innerHTML = `
          <div class="rule-icon">💡</div>
          <div class="rule-text"><strong>সময় নির্ধারণ:</strong> ${durationObj.rule || 'স্বয়ংক্রিয় নীতি'}</div>
        `;
      }

      // Update Summary Card
      const summaryQCount = document.getElementById('summaryQCount');
      if (summaryQCount) summaryQCount.textContent = `${toBn(count)}টি`;

      const summaryDuration = document.getElementById('summaryDuration');
      if (summaryDuration) summaryDuration.textContent = durationObj.text;

      const summaryFullMark = document.getElementById('summaryFullMark');
      if (summaryFullMark) summaryFullMark.textContent = `${toBn(count)} মার্ক`;

      const startBtn = document.getElementById('startExamBtn');
      if (startBtn) {
        if (count === 0) {
          startBtn.disabled = true;
          startBtn.innerHTML = `<span>⚠️ অন্তত একটি বিষয় বা প্রশ্ন নির্বাচন করুন</span>`;
        } else {
          startBtn.disabled = false;
          startBtn.innerHTML = `<span>🚀 পরীক্ষা শুরু করুন • ${toBn(count)}টি প্রশ্ন (${durationObj.text})</span>`;
        }
      }
    },

    // ==========================================
    // EXAM EXECUTION & TIMERS
    // ==========================================
    shuffleArray: function(array) {
      const copy = array.slice();
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },

    startExam: function() {
      let finalQuestions = [];

      if (this.activeMode === 'session') {
        const pool = this.getSelectedQuestionsPool();
        if (pool.length === 0) {
          alert('অনুগ্রহ করে অন্তত একটি বিষয় নির্বাচন করুন।');
          return;
        }
        finalQuestions = this.shuffleArray(pool);
      } else if (this.activeMode === 'subject') {
        const pool = this.getSelectedQuestionsPool();
        if (pool.length === 0) {
          alert('অনুগ্রহ করে অন্তত একটি বিষয় নির্বাচন করুন।');
          return;
        }
        const shuffled = this.shuffleArray(pool);
        finalQuestions = shuffled.slice(0, Math.min(this.customQuestionCount, shuffled.length));
      } else if (this.activeMode === 'random') {
        const shuffled = this.shuffleArray(this.allQuestions);
        finalQuestions = shuffled.slice(0, Math.min(this.customQuestionCount, shuffled.length));
      } else if (this.activeMode === 'mock200') {
        // Strict official syllabus distribution:
        const targets = {
          'Bangla Language': 20,
          'Bangla Literature': 15,
          'English Grammar': 20,
          'English Literature': 15,
          'Bangladesh': 30,
          'International': 20,
          'Geography': 10,
          'General Science': 15,
          'Computer & IT': 15,
          'Mathematical Reasoning': 15,
          'Mental Ability': 15,
          'Ethics & Good Governance': 10
        };

        finalQuestions = [];
        for (const [subKey, reqCount] of Object.entries(targets)) {
          const avail = this.subjectMap[subKey] || [];
          const sampled = this.shuffleArray(avail).slice(0, reqCount);
          finalQuestions.push(...sampled);
        }
      }

      if (finalQuestions.length === 0) {
        alert('পরীক্ষার প্রশ্ন প্রস্তুত করা সম্ভব হয়নি।');
        return;
      }

      this.examQuestions = finalQuestions;
      this.userAnswers = new Array(finalQuestions.length).fill(null);

      // Calculate time
      const durObj = this.calculateDuration(finalQuestions);
      this.totalTimeSeconds = durObj.seconds;
      this.timeRemaining = durObj.seconds;
      this.activeSubjectFilter = 'all';

      this.renderExamHallView();
      this.startTimer();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    startTimer: function() {
      if (this.timerInterval) clearInterval(this.timerInterval);

      this.timerInterval = setInterval(() => {
        this.timeRemaining--;

        if (this.timeRemaining <= 0) {
          clearInterval(this.timerInterval);
          this.timeRemaining = 0;
          this.updateTimerDisplay();
          this.autoSubmitOnTimeout();
        } else {
          this.updateTimerDisplay();
        }
      }, 1000);
    },

    updateTimerDisplay: function() {
      const timerBadge = document.getElementById('examTimerBadge');
      if (!timerBadge) return;

      const hrs = Math.floor(this.timeRemaining / 3600);
      const mins = Math.floor((this.timeRemaining % 3600) / 60);
      const secs = this.timeRemaining % 60;

      let timeStr = '';
      if (hrs > 0) {
        timeStr = `${toBn(hrs)}:${toBn(mins < 10 ? '0' + mins : mins)}:${toBn(secs < 10 ? '0' + secs : secs)}`;
      } else {
        timeStr = `${toBn(mins < 10 ? '0' + mins : mins)}:${toBn(secs < 10 ? '0' + secs : secs)}`;
      }

      timerBadge.innerHTML = `⏱️ <span class="time-num">${timeStr}</span>`;

      // Warning styling
      if (this.timeRemaining <= 60) {
        timerBadge.classList.add('danger-pulse');
        timerBadge.classList.remove('warning');
      } else if (this.timeRemaining <= 300) {
        timerBadge.classList.add('warning');
        timerBadge.classList.remove('danger-pulse');
      } else {
        timerBadge.classList.remove('warning', 'danger-pulse');
      }
    },

    autoSubmitOnTimeout: function() {
      // Show auto-submit modal/toast
      const app = document.getElementById('examApp');
      const overlay = document.createElement('div');
      overlay.className = 'timeout-modal-overlay';
      overlay.innerHTML = `
        <div class="timeout-modal-box">
          <div class="timeout-icon">⏰</div>
          <h2>সময় সমাপ্ত!</h2>
          <p>আপনার পরীক্ষার নির্ধারিত সময় শেষ হয়েছে। উত্তরপত্রটি স্বয়ংক্রিয়ভাবে মূল্যায়নের জন্য জমা নেওয়া হচ্ছে...</p>
          <div class="loading-spinner"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      setTimeout(() => {
        overlay.remove();
        this.finishExamAndEvaluate();
      }, 2000);
    },

    confirmSubmitManual: function() {
      const answeredCount = this.userAnswers.filter(a => a !== null).length;
      const total = this.examQuestions.length;
      const skipped = total - answeredCount;

      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.id = 'submitConfirmModal';
      overlay.innerHTML = `
        <div class="modal-box" style="max-width:440px;">
          <div class="modal-header">
            <h3>📝 পরীক্ষা জমা দিন</h3>
            <button class="modal-close-btn" onclick="document.getElementById('submitConfirmModal').remove()">&times;</button>
          </div>
          <div style="padding:16px 0;">
            <p style="margin-bottom:14px; font-size:1.02rem;">আপনি কি নিশ্চিতভাবে আপনার পরীক্ষাটি জমা দিতে চান?</p>
            <div class="submit-summary-grid">
              <div class="sub-stat-item">
                <span class="lbl">মোট প্রশ্ন:</span>
                <strong>${toBn(total)}টি</strong>
              </div>
              <div class="sub-stat-item answered">
                <span class="lbl">উত্তর দেওয়া হয়েছে:</span>
                <strong>${toBn(answeredCount)}টি</strong>
              </div>
              <div class="sub-stat-item skipped">
                <span class="lbl">বাদ দেওয়া হয়েছে:</span>
                <strong>${toBn(skipped)}টি</strong>
              </div>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px;">
            <button type="button" class="btn-secondary" onclick="document.getElementById('submitConfirmModal').remove()">পরীক্ষা চালিয়ে যান</button>
            <button type="button" class="btn-primary" onclick="ExamEngine.executeManualSubmit()">হ্যাঁ, জমা দিন</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    },

    executeManualSubmit: function() {
      const modal = document.getElementById('submitConfirmModal');
      if (modal) modal.remove();
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.finishExamAndEvaluate();
    },

    // ==========================================
    // EXAM HALL UI & REAL-TIME SUBJECT SWITCHER
    // ==========================================
    renderExamHallView: function() {
      const container = document.getElementById('examApp');
      if (!container) return;

      // Extract unique subjects in this exam with counts
      const subjectCounts = {};
      for (const q of this.examQuestions) {
        subjectCounts[q.s] = (subjectCounts[q.s] || 0) + 1;
      }
      const uniqueSubjects = Object.keys(subjectCounts);

      container.innerHTML = `
        <div class="exam-hall-wrapper ${this.showSourceTags ? '' : 'hide-exam-sources'}">
          <!-- Sticky Exam Topbar -->
          <div class="exam-topbar">
            <div class="exam-topbar-left">
              <button class="exam-btn-back" onclick="ExamEngine.cancelExamConfirm()" title="পরীক্ষা বাতিল করে ফিরুন">✕ প্রস্থান</button>
              <div class="exam-topbar-title">
                <span class="exam-title-badge">${this.getModeBadgeTitle()}</span>
              </div>
            </div>

            <div class="exam-topbar-controls">
              <button type="button" class="exam-btn-source-toggle ${this.showSourceTags ? 'active' : ''}" id="examSourceToggleBtn" onclick="ExamEngine.toggleSourceTags()" title="পরীক্ষার উৎস (বিসিএস/চাকরির নাম) প্রদর্শন চালু বা বন্ধ করুন">
                <span class="source-icon">${this.showSourceTags ? '👁️' : '🙈'}</span>
                <span class="source-label">উৎস: ${this.showSourceTags ? 'চালু' : 'বন্ধ'}</span>
              </button>
            </div>

            <div class="exam-topbar-center">
              <div class="exam-timer-badge" id="examTimerBadge">
                ⏱️ <span class="time-num">০০:০০</span>
              </div>
            </div>

            <div class="exam-topbar-right">
              <div class="exam-progress-badge" id="examProgressBadge">
                উত্তর: <strong>০ / ${toBn(this.examQuestions.length)}</strong>
              </div>
              <button class="btn-submit-exam" onclick="ExamEngine.confirmSubmitManual()">
                ✓ পরীক্ষা জমা দিন
              </button>
            </div>
          </div>

          <!-- Subject Switcher Bar (MANDATORY USER FEATURE) -->
          <div class="subject-switcher-container">
            <div class="subject-switcher-scroll">
              <button type="button" class="subject-tab-chip ${this.activeSubjectFilter === 'all' ? 'active' : ''}" onclick="ExamEngine.switchExamSubjectFilter('all')">
                <span class="chip-icon">📑</span>
                <span class="chip-name">সকল বিষয়</span>
                <span class="chip-count" id="chipCount_all">০ / ${toBn(this.examQuestions.length)}</span>
              </button>
              ${uniqueSubjects.map(subKey => {
                const conf = SUBJECT_CONFIG[subKey] || { short: subKey, icon: '📄' };
                const count = subjectCounts[subKey];
                return `
                  <button type="button" class="subject-tab-chip ${this.activeSubjectFilter === subKey ? 'active' : ''}" id="tabChip_${subKey.replace(/[^a-zA-Z0-9]/g, '_')}" onclick="ExamEngine.switchExamSubjectFilter('${subKey}')">
                    <span class="chip-icon">${conf.icon}</span>
                    <span class="chip-name">${conf.short}</span>
                    <span class="chip-count" id="chipCount_${subKey.replace(/[^a-zA-Z0-9]/g, '_')}">০ / ${toBn(count)}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Main Layout: Question Stream + Floating Palette -->
          <div class="exam-main-layout">
            <!-- Left/Center: Questions Cards -->
            <div class="exam-questions-stream" id="examQuestionsStream">
              ${this.renderQuestionsList()}
            </div>

            <!-- Right Sidebar: Question Palette (OMR Navigator) -->
            <aside class="exam-palette-sidebar">
              <div class="palette-card">
                <div class="palette-header">
                  <div class="palette-title">📋 ওএমআর ও প্রশ্ন তালিকা</div>
                  <div class="palette-legend">
                    <span class="legend-item"><span class="dot done"></span> উত্তর দেওয়া</span>
                    <span class="legend-item"><span class="dot unans"></span> বাকি</span>
                  </div>
                </div>
                <div class="palette-grid" id="paletteGrid">
                  ${this.examQuestions.map((q, idx) => `
                    <button type="button" class="palette-btn" id="paletteBtn_${idx}" onclick="ExamEngine.jumpToQuestion(${idx})">
                      ${toBn(idx + 1)}
                    </button>
                  `).join('')}
                </div>
              </div>
            </aside>
          </div>
        </div>
      `;

      this.updateTimerDisplay();
      this.updateProgressCounters();
    },

    cleanExamQuestionText: function(qText, hideSource) {
      if (!qText) return '';
      // Strip leading original book question numbers like "৫৯. ", "৫. ", "২. ", "৫৮- ", "১০) "
      let cleaned = qText.replace(/^\s*(?:[\d]+|[০-৯]+)[\.\-\)]\s*/, '');
      if (hideSource) {
        // Strip trailing exam names/sessions like "২০তম বিসিএস", "২৬তম/১৭তম বিসিএস", "- ৪৪তম বিসিএস", "[সহকারী পরিচালক...]"
        cleaned = cleaned.replace(/(?:[\s\-\–—\(\[]*(?:[০-৯\d]+(?:তম)?(?:\/[০-৯\d]+)?(?:তম|th|st|nd|rd)?)?(?:\s*(?:বিশেষ|বাতিল|প্রিলি))?\s*(?:বিসিএস|BCS|নন[\-\s]?ক্যাডার|পিএসসি|নিয়োগ|মন্ত্রণালয়)[^)\]]*[\)\]]?)+\s*$/i, '');
      }
      return cleaned;
    },

    cleanOptText: function(text) {
      if (!text) return '';
      // Strip duplicate leading prefixes like "(ক) ", "(খ) ", "ক. ", "(a) ", "A. "
      return text.replace(/^\s*[\(\[]?(?:[কখগঘ]|[abcdABCD])[\)\]\.\-:\s]\s*/, '');
    },

    toggleSourceTags: function() {
      this.showSourceTags = !this.showSourceTags;
      localStorage.setItem('exam_show_source_tags', this.showSourceTags);

      const wrapper = document.querySelector('.exam-hall-wrapper');
      if (wrapper) {
        wrapper.classList.toggle('hide-exam-sources', !this.showSourceTags);
      }

      const btn = document.getElementById('examSourceToggleBtn');
      if (btn) {
        btn.classList.toggle('active', this.showSourceTags);
        btn.innerHTML = `
          <span class="source-icon">${this.showSourceTags ? '👁️' : '🙈'}</span>
          <span class="source-label">উৎস: ${this.showSourceTags ? 'চালু' : 'বন্ধ'}</span>
        `;
      }

      // Dynamically update question texts
      this.examQuestions.forEach((q, idx) => {
        const qEl = document.querySelector(`#examQCard_${idx} .exam-q-text`);
        if (qEl) {
          qEl.innerHTML = this.cleanExamQuestionText(q.q, !this.showSourceTags);
        }
      });
    },

    getModeBadgeTitle: function() {
      if (this.activeMode === 'session') return this.selectedSession;
      if (this.activeMode === 'subject') return 'বিষয়ভিত্তিক কাস্টম পরীক্ষা';
      if (this.activeMode === 'random') return 'র‍্যান্ডম কুইক টেস্ট';
      if (this.activeMode === 'mock200') return 'বিসিএস পূর্ণাঙ্গ মডেল টেস্ট';
      return 'বিসিএস পরীক্ষা';
    },

    renderQuestionsList: function() {
      return this.examQuestions.map((q, idx) => {
        const conf = SUBJECT_CONFIG[q.s] || { short: q.s, icon: '📄' };
        const isHidden = this.activeSubjectFilter !== 'all' && this.activeSubjectFilter !== q.s;
        const selectedOpt = this.userAnswers[idx];
        const displayQuestionText = this.cleanExamQuestionText(q.q, !this.showSourceTags);

        return `
          <div class="exam-q-card ${selectedOpt !== null ? 'answered' : ''} ${isHidden ? 'subject-filtered-out' : ''}" id="examQCard_${idx}" data-subject="${q.s}">
            <div class="exam-q-header">
              <div class="exam-q-num-badge">প্রশ্ন ${toBn(idx + 1)}</div>
              <div class="exam-q-tags">
                <span class="q-sub-badge">${conf.icon} ${conf.short}</span>
                ${q.bcs ? `<span class="q-bcs-badge">${q.bcs}</span>` : ''}
              </div>
            </div>

            <div class="exam-q-text">${displayQuestionText}</div>

            <div class="exam-options-grid">
              ${q.opts.map((optText, optIdx) => `
                <button type="button" class="exam-opt-btn ${selectedOpt === optIdx ? 'selected' : ''}" onclick="ExamEngine.selectAnswer(${idx}, ${optIdx})">
                  <span class="opt-key">${OPT_LABELS[optIdx]}</span>
                  <span class="opt-label-text">${this.cleanOptText(optText)}</span>
                </button>
              `).join('')}
            </div>

            <div class="exam-q-footer">
              <button type="button" class="btn-clear-opt ${selectedOpt !== null ? 'visible' : ''}" id="clearBtn_${idx}" onclick="ExamEngine.clearAnswer(${idx})">
                ✕ উত্তর মুছুন (Clear)
              </button>
            </div>
          </div>
        `;
      }).join('');
    },

    switchExamSubjectFilter: function(subKey) {
      this.activeSubjectFilter = subKey;
      
      // Update Tab Chip Active State
      document.querySelectorAll('.subject-switcher-scroll .subject-tab-chip').forEach(chip => {
        chip.classList.remove('active');
      });
      if (subKey === 'all') {
        const chip = document.querySelector('.subject-tab-chip:first-child');
        if (chip) chip.classList.add('active');
      } else {
        const chipId = `tabChip_${subKey.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const chip = document.getElementById(chipId);
        if (chip) chip.classList.add('active');
      }

      // Filter Question Cards
      const cards = document.querySelectorAll('.exam-q-card');
      let firstVisible = null;
      cards.forEach(card => {
        const cardSub = card.getAttribute('data-subject');
        if (subKey === 'all' || cardSub === subKey) {
          card.classList.remove('subject-filtered-out');
          if (!firstVisible) firstVisible = card;
        } else {
          card.classList.add('subject-filtered-out');
        }
      });

      // Scroll to top of questions or first card
      if (firstVisible) {
        firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }
    },

    selectAnswer: function(qIndex, optIndex) {
      this.userAnswers[qIndex] = optIndex;

      // Update Card Visuals
      const card = document.getElementById(`examQCard_${qIndex}`);
      if (card) {
        card.classList.add('answered');
        card.querySelectorAll('.exam-opt-btn').forEach((btn, idx) => {
          if (idx === optIndex) btn.classList.add('selected');
          else btn.classList.remove('selected');
        });
        const clearBtn = document.getElementById(`clearBtn_${qIndex}`);
        if (clearBtn) clearBtn.classList.add('visible');
      }

      // Update Palette
      const pBtn = document.getElementById(`paletteBtn_${qIndex}`);
      if (pBtn) pBtn.classList.add('answered');

      this.updateProgressCounters();
    },

    clearAnswer: function(qIndex) {
      this.userAnswers[qIndex] = null;

      const card = document.getElementById(`examQCard_${qIndex}`);
      if (card) {
        card.classList.remove('answered');
        card.querySelectorAll('.exam-opt-btn').forEach(btn => btn.classList.remove('selected'));
        const clearBtn = document.getElementById(`clearBtn_${qIndex}`);
        if (clearBtn) clearBtn.classList.remove('visible');
      }

      const pBtn = document.getElementById(`paletteBtn_${qIndex}`);
      if (pBtn) pBtn.classList.remove('answered');

      this.updateProgressCounters();
    },

    jumpToQuestion: function(idx) {
      // If question is hidden by subject filter, switch to that subject or 'all'
      const targetQ = this.examQuestions[idx];
      if (this.activeSubjectFilter !== 'all' && this.activeSubjectFilter !== targetQ.s) {
        this.switchExamSubjectFilter('all');
      }

      setTimeout(() => {
        const card = document.getElementById(`examQCard_${idx}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('highlight-pulse');
          setTimeout(() => card.classList.remove('highlight-pulse'), 1500);
        }
      }, 50);
    },

    updateProgressCounters: function() {
      const total = this.examQuestions.length;
      const answered = this.userAnswers.filter(a => a !== null).length;

      // Topbar Badge
      const progressBadge = document.getElementById('examProgressBadge');
      if (progressBadge) {
        progressBadge.innerHTML = `উত্তর: <strong>${toBn(answered)} / ${toBn(total)}</strong>`;
      }

      // Total Chip count
      const chipAll = document.getElementById('chipCount_all');
      if (chipAll) chipAll.textContent = `${toBn(answered)} / ${toBn(total)}`;

      // Individual Subject chips count
      const subjectAnsCounts = {};
      const subjectTotalCounts = {};
      this.examQuestions.forEach((q, idx) => {
        subjectTotalCounts[q.s] = (subjectTotalCounts[q.s] || 0) + 1;
        if (this.userAnswers[idx] !== null) {
          subjectAnsCounts[q.s] = (subjectAnsCounts[q.s] || 0) + 1;
        }
      });

      for (const [subKey, tot] of Object.entries(subjectTotalCounts)) {
        const ans = subjectAnsCounts[subKey] || 0;
        const chipId = `chipCount_${subKey.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const chipEl = document.getElementById(chipId);
        if (chipEl) chipEl.textContent = `${toBn(ans)} / ${toBn(tot)}`;
      }
    },

    cancelExamConfirm: function() {
      if (confirm('আপনি কি নিশ্চিত যে পরীক্ষাটি বাতিল করে প্রস্থান করতে চান? আপনার প্রদত্ত উত্তর সংরক্ষিত হবে না।')) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.renderSetupView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    // ==========================================
    // EVALUATION & RESULTS VIEW
    // ==========================================
    finishExamAndEvaluate: function() {
      const timeSpentSec = Math.max(0, this.totalTimeSeconds - this.timeRemaining);
      const totalQ = this.examQuestions.length;
      let correctCount = 0;
      let wrongCount = 0;
      let skippedCount = 0;

      const evaluatedItems = [];

      this.examQuestions.forEach((q, idx) => {
        const userChoice = this.userAnswers[idx];
        const isAnswered = userChoice !== null;
        let isCorrect = false;

        if (!isAnswered) {
          skippedCount++;
        } else if (userChoice === q.ans) {
          correctCount++;
          isCorrect = true;
        } else {
          wrongCount++;
        }

        evaluatedItems.push({
          q: q,
          index: idx,
          userChoice: userChoice,
          isAnswered: isAnswered,
          isCorrect: isCorrect
        });
      });

      // Score Formula: Correct * 1.0 - (Wrong * 0.50 if negative marking enabled)
      const penaltyPerWrong = this.applyNegativeMarking ? 0.50 : 0.0;
      const penalty = wrongCount * penaltyPerWrong;
      const netScore = Math.max(0, correctCount * 1.0 - penalty);
      const accuracy = (correctCount + wrongCount) > 0 ? (correctCount / (correctCount + wrongCount)) * 100 : 0;
      const percentage = (netScore / totalQ) * 100;

      this.results = {
        totalQ,
        correctCount,
        wrongCount,
        skippedCount,
        penalty,
        penaltyPerWrong,
        netScore: Number(netScore.toFixed(2)),
        percentage: Number(percentage.toFixed(1)),
        accuracy: Number(accuracy.toFixed(1)),
        timeSpentSec,
        evaluatedItems
      };

      this.activeReviewFilter = 'all';
      this.renderResultsView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    renderResultsView: function() {
      const container = document.getElementById('examApp');
      if (!container || !this.results) return;

      const r = this.results;
      const minsSpent = Math.floor(r.timeSpentSec / 60);
      const secsSpent = r.timeSpentSec % 60;
      const timeSpentFormatted = secsSpent > 0 ? `${toBn(minsSpent)} মিনিট ${toBn(secsSpent)} সেকেন্ড` : `${toBn(minsSpent)} মিনিট`;

      // Pass/Cutoff Evaluation
      let statusClass = 'pass';
      let statusTitle = 'চমৎকার প্রস্তুতি! 🎉';
      let statusDesc = 'বিসিএস প্রিলিমিনারি পরীক্ষায় এই স্কোর আপনাকে সুরক্ষিত তালিকায় রাখতে সাহায্য করবে।';

      if (r.percentage < 45) {
        statusClass = 'danger';
        statusTitle = 'আরও অনুশীলনের সুযোগ রয়েছে 📚';
        statusDesc = 'ভুল হওয়া প্রশ্নগুলোর প্রামাণ্য ব্যাখ্যা পড়ে নিয়মিত রিভিশন সম্পন্ন করুন।';
      } else if (r.percentage < 60) {
        statusClass = 'warning';
        statusTitle = 'সন্তোষজনক প্রস্তুতি! 💡';
        statusDesc = 'ভুল উত্তরের সংখ্যা হ্রাস করে নেগেটিভ মার্কিং এড়াতে আরও মনোযোগী হোন।';
      }

      container.innerHTML = `
        <div class="results-wrapper">
          <!-- Hero Score Banner -->
          <div class="result-hero-card ${statusClass}">
            <div class="result-badge-top">ফলাফল ও মূল্যায়ন রিপোর্ট</div>
            <div class="score-display">
              <span class="score-main">${toBn(r.netScore.toFixed(2))}</span>
              <span class="score-divider">/</span>
              <span class="score-total">${toBn(r.totalQ)}</span>
            </div>
            <div class="result-status-title">${statusTitle}</div>
            <p class="result-status-desc">${statusDesc}</p>
            ${r.penaltyPerWrong > 0 ? `
              <div class="formula-caption">
                হিসাব: সঠিক (${toBn(r.correctCount)} × ১.০) - ভুল (${toBn(r.wrongCount)} × ০.৫০) = ${toBn(r.netScore.toFixed(2))} মার্ক
              </div>
            ` : ''}
          </div>

          <!-- Metrics Grid -->
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">🎯</div>
              <div class="metric-val">${toBn(r.totalQ)}</div>
              <div class="metric-lbl">মোট প্রশ্ন</div>
            </div>
            <div class="metric-card answered">
              <div class="metric-icon">✍️</div>
              <div class="metric-val">${toBn(r.correctCount + r.wrongCount)}</div>
              <div class="metric-lbl">উত্তর দিয়েছেন</div>
            </div>
            <div class="metric-card skipped">
              <div class="metric-icon">⏭️</div>
              <div class="metric-val">${toBn(r.skippedCount)}</div>
              <div class="metric-lbl">বাদ দিয়েছেন</div>
            </div>
            <div class="metric-card correct">
              <div class="metric-icon">✅</div>
              <div class="metric-val">${toBn(r.correctCount)}</div>
              <div class="metric-lbl">সঠিক (+১.০০)</div>
            </div>
            <div class="metric-card wrong">
              <div class="metric-icon">❌</div>
              <div class="metric-val">${toBn(r.wrongCount)}</div>
              <div class="metric-lbl">ভুল (-০.৫০)</div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">📈</div>
              <div class="metric-val">${toBn(r.accuracy)}%</div>
              <div class="metric-lbl">এক্যুরেসি রেট</div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">⏱️</div>
              <div class="metric-val" style="font-size:1.05rem;">${timeSpentFormatted}</div>
              <div class="metric-lbl">ব্যয়িত সময়</div>
            </div>
          </div>

          <!-- In-Depth Question Review Section -->
          <div class="review-section">
            <div class="review-header">
              <h2>🔍 উত্তরপত্র ও বিশদ প্রামাণ্য ব্যাখ্যা পর্যালোচনা</h2>
              <div class="review-filter-pills">
                <button type="button" class="filter-pill ${this.activeReviewFilter === 'all' ? 'active' : ''}" onclick="ExamEngine.filterReviewItems('all', this)">
                  সকল প্রশ্ন (${toBn(r.totalQ)})
                </button>
                <button type="button" class="filter-pill wrong ${this.activeReviewFilter === 'wrong' ? 'active' : ''}" onclick="ExamEngine.filterReviewItems('wrong', this)">
                  ভুল উত্তর (${toBn(r.wrongCount)})
                </button>
                <button type="button" class="filter-pill correct ${this.activeReviewFilter === 'correct' ? 'active' : ''}" onclick="ExamEngine.filterReviewItems('correct', this)">
                  সঠিক উত্তর (${toBn(r.correctCount)})
                </button>
                <button type="button" class="filter-pill skipped ${this.activeReviewFilter === 'skipped' ? 'active' : ''}" onclick="ExamEngine.filterReviewItems('skipped', this)">
                  বাদ দেওয়া (${toBn(r.skippedCount)})
                </button>
              </div>
            </div>

            <div class="review-cards-list" id="reviewCardsList">
              ${this.renderReviewItemsList()}
            </div>
          </div>

          <!-- Action Footer -->
          <div class="results-footer-bar">
            <button type="button" class="btn-primary" onclick="ExamEngine.startExam()">
              🔄 একই বিষয়ে পুনরায় পরীক্ষা দিন
            </button>
            <button type="button" class="btn-secondary" onclick="ExamEngine.renderSetupView()">
              ⚙️ নতুন পরীক্ষা সেটআপ
            </button>
            <a href="index.html" class="btn-secondary" style="text-decoration:none;">
              🏛️ মূল লাইব্রেরিতে ফিরুন
            </a>
          </div>
        </div>
      `;
    },

    filterReviewItems: function(filterType, btnEl) {
      this.activeReviewFilter = filterType;
      document.querySelectorAll('.review-filter-pills .filter-pill').forEach(btn => {
        btn.classList.remove('active');
      });
      if (btnEl) {
        btnEl.classList.add('active');
      }
      const container = document.getElementById('reviewCardsList');
      if (container) {
        container.innerHTML = this.renderReviewItemsList();
      }
    },

    renderReviewItemsList: function() {
      if (!this.results) return '';

      const items = this.results.evaluatedItems.filter(item => {
        if (this.activeReviewFilter === 'wrong') return item.isAnswered && !item.isCorrect;
        if (this.activeReviewFilter === 'correct') return item.isAnswered && item.isCorrect;
        if (this.activeReviewFilter === 'skipped') return !item.isAnswered;
        return true;
      });

      if (items.length === 0) {
        return `
          <div class="empty-review-box">
            <p>এই ফিল্টারে কোনো প্রশ্ন নেই।</p>
          </div>
        `;
      }

      return items.map(item => {
        const q = item.q;
        const conf = SUBJECT_CONFIG[q.s] || { short: q.s, icon: '📄' };
        
        let cardStatusClass = 'skipped';
        let badgeText = 'বাদ দেওয়া হয়েছে';
        if (item.isAnswered) {
          if (item.isCorrect) {
            cardStatusClass = 'correct';
            badgeText = '✓ সঠিক উত্তর (+১)';
          } else {
            cardStatusClass = 'wrong';
            badgeText = '✕ ভুল উত্তর (-০.৫০)';
          }
        }

        return `
          <div class="review-card ${cardStatusClass}">
            <div class="review-card-top">
              <div class="q-meta-left">
                <span class="q-idx-badge">প্রশ্ন ${toBn(item.index + 1)}</span>
                <span class="q-sub-badge">${conf.icon} ${conf.short}</span>
                ${q.bcs ? `<span class="q-bcs-badge review-card-bcs">${q.bcs}</span>` : ''}
              </div>
              <div class="q-status-badge ${cardStatusClass}">${badgeText}</div>
            </div>

            <div class="review-q-text">${this.cleanExamQuestionText(q.q, !this.showSourceTags)}</div>

            <div class="review-options-grid">
              ${q.opts.map((optText, optIdx) => {
                const isRealCorrect = (optIdx === q.ans);
                const isUserChosen = (item.userChoice === optIdx);

                let optClass = '';
                let marker = '';

                if (isRealCorrect) {
                  optClass = 'is-correct';
                  marker = '<span class="opt-tag correct">সঠিক উত্তর ✓</span>';
                }
                if (isUserChosen && !isRealCorrect) {
                  optClass = 'is-wrong-chosen';
                  marker = '<span class="opt-tag wrong">আপনার উত্তর ✕</span>';
                }
                if (isUserChosen && isRealCorrect) {
                  optClass = 'is-correct-chosen';
                  marker = '<span class="opt-tag correct">আপনার উত্তর ✓</span>';
                }

                return `
                  <div class="review-opt-box ${optClass}">
                    <span class="opt-key">${OPT_LABELS[optIdx]}</span>
                    <span class="opt-text">${this.cleanOptText(optText)}</span>
                    ${marker}
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Authentic Collapsible Explanation Drawer -->
            <div class="review-exp-container">
              <button type="button" class="btn-toggle-exp" onclick="ExamEngine.toggleExplanationDrawer(${item.index})">
                <span>💡 বিশদ প্রামাণ্য ব্যাখ্যা ও নোট</span>
                <span class="exp-arrow" id="expArrow_${item.index}">▼</span>
              </button>
              <div class="review-exp-drawer" id="expDrawer_${item.index}">
                <div class="exp-content-box">
                  <div class="exp-answer-row">
                    <strong>সঠিক উত্তর:</strong> <span class="ans-label">${OPT_LABELS[q.ans]} (${q.opts[q.ans]})</span>
                  </div>
                  <div class="exp-body-text">
                    ${q.exp ? q.exp : 'এই প্রশ্নের জন্য কোনো অতিরিক্ত ব্যাখ্যা মুদ্রিত নেই।'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    },

    toggleExplanationDrawer: function(qIndex) {
      const drawer = document.getElementById(`expDrawer_${qIndex}`);
      const arrow = document.getElementById(`expArrow_${qIndex}`);
      if (!drawer) return;

      if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        if (arrow) arrow.textContent = '▼';
      } else {
        drawer.classList.add('open');
        if (arrow) arrow.textContent = '▲';
      }
    }
  };

  window.ExamEngine = ExamEngine;

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    ExamEngine.init();
  });

})(window);
