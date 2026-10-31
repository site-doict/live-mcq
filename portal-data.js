/**
 * portal-data.js - Official Registry for BCS & PSC Non-Cadre Written and Viva Items
 * 
 * Future items: To add a new written exam or viva module, simply append an entry here.
 * Structure:
 *   track: 'cadre' | 'noncadre'
 *   step: 'prelim' | 'written' | 'viva'
 *   title: Display title
 *   badge: Short order or acronym badge (e.g., 'WR', 'VV')
 *   meta: Dot-separated metadata string
 *   href: URL string (or '' / null if upcoming)
 *   progressId: Base ID for progress bar sync (e.g., 'writtenBangla')
 *   status: 'available' | 'soon'
 *   badgeLabel: Status pill label (e.g., 'প্রস্তুত', 'শীঘ্রই আসছে')
 *   description: Optional detail
 */

(function(window) {
  'use strict';

  var PORTAL_REGISTRY = {
    // ==========================================
    // BCS Cadre Track: Written Stage Items
    // ==========================================
    cadreWritten: [
      {
        id: 'cadre-wr-01',
        track: 'cadre',
        step: 'written',
        badge: 'WR',
        title: 'বিসিএস লিখিত বাংলা (১ম ও ২য় পত্র)',
        meta: 'বিষয়ভিত্তিক রচনামূলক ও ব্যাকরণ',
        href: '',
        progressId: 'cadreWrittenBangla',
        status: 'soon',
        badgeLabel: 'শীঘ্রই আসছে',
        dataChapters: 0,
        dataQuestions: 0
      },
      {
        id: 'cadre-wr-02',
        track: 'cadre',
        step: 'written',
        badge: 'WR',
        title: 'বিসিএস লিখিত English (Paper I & II)',
        meta: 'Comprehension, Essay, Translation & Grammar',
        href: '',
        progressId: 'cadreWrittenEnglish',
        status: 'soon',
        badgeLabel: 'শীঘ্রই আসছে',
        dataChapters: 0,
        dataQuestions: 0
      },
      {
        id: 'cadre-wr-03',
        track: 'cadre',
        step: 'written',
        badge: 'WR',
        title: 'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি',
        meta: 'সংবিধান, পররাষ্ট্রনীতি, অর্থনীতি ও আন্তর্জাতিক বিষয়াবলি',
        href: '',
        progressId: 'cadreWrittenAffairs',
        status: 'soon',
        badgeLabel: 'শীঘ্রই আসছে',
        dataChapters: 0,
        dataQuestions: 0
      },
      {
        id: 'cadre-wr-04',
        track: 'cadre',
        step: 'written',
        badge: 'WR',
        title: 'গাণিতিক যুক্তি ও সাধারণ বিজ্ঞান',
        meta: 'গাণিতিক যুক্তি ও সাধারণ বিজ্ঞান',
        href: '',
        progressId: 'cadreWrittenMathSci',
        status: 'soon',
        badgeLabel: 'শীঘ্রই আসছে',
        dataChapters: 0,
        dataQuestions: 0
      }
    ],

    // ==========================================
    // BCS Cadre Track: Viva Stage Items
    // ==========================================
    cadreViva: [
      {
        id: 'cadre-vv-01',
        track: 'cadre',
        step: 'viva',
        badge: 'VV',
        title: 'বিসিএস ভাইভা অভিজ্ঞতা ও প্রশ্ন সম্ভার',
        meta: 'বোর্ডভিত্তিক মূল্যায়ন ও পরিস্থিতিগত বিচার',
        href: '',
        progressId: 'cadreVivaExp',
        status: 'soon',
        badgeLabel: 'শীঘ্রই আসছে',
        dataChapters: 0,
        dataQuestions: 0
      }
    ],

    // ==========================================
    // Non-Cadre Track: Written Stage Items
    // ==========================================
    nonCadreWritten: [
      {
        id: 'nc-wr-01',
        track: 'noncadre',
        step: 'written',
        badge: 'WR',
        title: 'লিখিত প্রশ্ন সমাধান: পিএসসি ও অন্যান্য প্রতিষ্ঠান',
        fullTitle: 'আইবিএ, বুয়েট ও পিএসসি লিখিত জব সলিউশন',
        meta: '১৫৮টি সম্পূর্ণ লিখিত পরীক্ষা · ৩,০৬০টি প্রামাণ্য প্রশ্ন',
        href: 'PSC & IBA Written Job Solution/ch-001-psc-ad-2022.html',
        indexHref: 'PSC & IBA Written Job Solution/index.html',
        progressId: 'writtenJobSol',
        status: 'available',
        badgeLabel: 'প্রস্তুত',
        dataChapters: 158,
        dataQuestions: 3060,
        breakdown: {
          pscGeneral: 43,
          pscTechnical: 47,
          iba: 13,
          buet: 12,
          fbs: 6,
          arts: 3,
          others: 34,
          totalExams: 158,
          totalQuestions: 3060
        }
      }
    ],

    // ==========================================
    // Non-Cadre Track: Viva Stage Items
    // ==========================================
    nonCadreViva: [
      {
        id: 'nc-vv-01',
        track: 'noncadre',
        step: 'viva',
        badge: 'VV',
        title: 'নন-ক্যাডার ভাইভা প্রশ্ন ও প্রস্তুতি গাইড',
        meta: 'পদভিত্তিক মৌখিক পরীক্ষার প্রস্তুতি · ৯ম-১৩তম গ্রেড স্পেশাল গাইডলাইন',
        href: '',
        progressId: 'ncVivaGuide',
        status: 'soon',
        badgeLabel: 'শীঘ্রই আসছে',
        dataChapters: 0,
        dataQuestions: 0
      }
    ]
  };

  // Helper method to get items
  PORTAL_REGISTRY.getItems = function(track, step) {
    if (track === 'cadre') {
      if (step === 'written') return PORTAL_REGISTRY.cadreWritten;
      if (step === 'viva') return PORTAL_REGISTRY.cadreViva;
    } else if (track === 'noncadre') {
      if (step === 'written') return PORTAL_REGISTRY.nonCadreWritten;
      if (step === 'viva') return PORTAL_REGISTRY.nonCadreViva;
    }
    return [];
  };

  // Export to window
  window.PORTAL_DATA = PORTAL_REGISTRY;

})(typeof window !== 'undefined' ? window : this);

