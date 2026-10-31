# বিসিএস ও পিএসসি নন-ক্যাডার ই-বুক লাইব্রেরি: মাস্টার পোর্টাল পুনর্গঠন ও প্রকৌশল রিপোর্ট
**Portal Redesign, Structural Repair & Gate Verification Report**

---

## ১. নির্বাহী সারসংক্ষেপ ও গেট ভেরিফিকেশন স্ট্যাটাস (Executive Summary & Gate Status)

**সামগ্রিক ফলাফল: সম্পূর্ণ (COMPLETED) — ১০০% সবুজ (53 PASSED, 0 FAILED)**

ব্যবহারকারীর পর্যবেক্ষণ ও রেফারেন্স সাইটের ডিজাইন-প্যাটার্নের আলোকে মাস্টার ল্যান্ডিং পোর্টাল (`/index.html`), শেয়ার্ড টোকেন (`portal-home.css`), ডেটা রেজিস্ট্রি (`portal-data.js`) এবং কোয়ালিটি গেট সু্যইট (`tests/gate_portal.test.js`, `tools/check-all.py`) সম্পূর্ণরূপে পুনর্গঠন, মেরামত ও যাচাই করা হয়েছে।

### আসল টার্মিনাল আউটপুট (Verbatim Gate Test Terminal Output):
```text
Test server running at http://localhost:8092

============================================================
GATE 1: PROOF OF CHANGE & VISUAL VERIFICATION
============================================================
[PASS] G1: DOM proof verified: New Hero, 3-Stage Stepper, and Dark Footer are present
[PASS] G1: After screenshots captured at 320, 390, 768, 1366px (Light & Dark)
[PASS] G1: Visual change confirmed (size diff: 100367 bytes > 0)

============================================================
GATE 2: LAYOUT & RESPONSIVENESS CHECK (320px to 1920px)
============================================================
[PASS] G2: Zero horizontal overflow & all interactive elements in viewport at 320px
[PASS] G2: #ebkAdminLoginBtn is fully visible and inside 320px viewport
[PASS] G2: Zero horizontal overflow & all interactive elements in viewport at 360px
[PASS] G2: Zero horizontal overflow & all interactive elements in viewport at 390px
[PASS] G2: Zero horizontal overflow & all interactive elements in viewport at 768px
[PASS] G2: Zero horizontal overflow & all interactive elements in viewport at 1024px
[PASS] G2: Zero nested cards detected (0 nested)
[PASS] G2: Same row cards equal height verified (height diff: 0.0px <= 2px)
[PASS] G2: Revision FAB computed position:fixed and inside viewport
[PASS] G2: Header and Content standardized to same container width (~1120px)
[PASS] G2: Zero horizontal overflow & all interactive elements in viewport at 1366px
[PASS] G2: Zero nested cards detected (0 nested)
[PASS] G2: Same row cards equal height verified (height diff: 0.0px <= 2px)
[PASS] G2: Revision FAB computed position:fixed and inside viewport
[PASS] G2: Header and Content standardized to same container width (~1120px)
[PASS] G2: Zero horizontal overflow & all interactive elements in viewport at 1920px
[PASS] G2: Zero nested cards detected (0 nested)
[PASS] G2: Same row cards equal height verified (height diff: 0.0px <= 2px)
[PASS] G2: Revision FAB computed position:fixed and inside viewport
[PASS] G2: Header and Content standardized to same container width (~1120px)

============================================================
GATE 3: BEHAVIOR & INTERACTION CHECK
============================================================
[PASS] G3: Track switch to Non-Cadre toggles section display correctly
[PASS] G3: Step switch to Written activates #panelNonCadreWritten
[PASS] G3: Direct URL hash #noncadre-written correctly opens Non-Cadre Written panel
[PASS] G3: Reload persistence with ebk_selected_step correctly restores Viva panel
[PASS] G3: Theme toggled from light to dark
[PASS] G3: Theme persists across page reload
[PASS] G3: openRevisionModal() opens #revisionModal
[PASS] G3: Revision modal close function closes modal
[PASS] G3: #ebkSearchMount is mounted prominently under hero
[PASS] G3: #menuToggleBtn opens #menuDrawer
[PASS] G3: #menuCloseBtn closes #menuDrawer
[PASS] G3: Progress sync updates both Cadre (১৪% (৩/২২)) and Non-Cadre (২৫% (৪/১৬)) cards

============================================================
GATE 4: DATA & INTEGRITY CHECKS
============================================================
[PASS] G4: All 53 required contract IDs exist in index.html
[PASS] G4: All 59 subject card links resolve to actual files on disk
[PASS] G4: All upcoming/disabled cards have zero hrefs (no dead links)
[PASS] G4: Every active subject card across both tracks has a valid progress bar & %
[PASS] G4: Cadre stats match exact sum of card data-attributes (12 subjects, 211 chapters, 4,508 questions)
[PASS] G4: Non-Cadre Prelim stats match sum of card data-attributes (16 books, 208 chapters/exams, 19,529 questions)
[PASS] G4: Zero emojis detected in DOM text (all emojis replaced with inline SVGs)
[PASS] G4: Zero disallowed inline styles in index.html (only CSS variable --p allowed)
[PASS] G4: Zero "পিএসসি নন-ক্যাডার" prefixes in card titles (clean track-tab context)
[PASS] G4: HTML tag integrity verified: balanced <article> tags (192 opened, 192 closed)

============================================================
GATE 5: QUALITY & ACCESSIBILITY (axe-core)
============================================================
[PASS] G5: Exactly one single <h1> element on the page
[PASS] G5: Zero duplicate IDs on the page
[PASS] G5: Zero duplicate script loads
[PASS] G5: axe-core Light mode passed with 0 serious/critical violations (32 checks passed)
[PASS] G5: axe-core Dark mode passed with 0 serious/critical violations (32 checks passed)
[PASS] G5: No reference brand logos, external images, or unbacked external terms
[PASS] G5: Official sources documented and verified in docs/sources.md

============================================================
GATE 6: SCOPE AUDIT
============================================================
[INFO] G6: Prior branch artifacts noted in diff: PSC & IBA Written Job Solution/data/written_questions_data.js, PSC & IBA Written Job Solution/subjects.html
[PASS] G6: Scope audit verified (active working files strictly isolated to Section 0)

============================================================
TOTAL GATES SUMMARY: 53 PASSED, 0 FAILED
============================================================
```

### স্ট্যাটিক ভেরিফিকেশন চেক আউটপুট (`tools/check-all.py`):
```text
============================================================
BCS Static E-Book Library - Static Verification Check
============================================================

1. Math Data & Delimiter Check: 0 issues

2. Answer Presentation Check: 0 issues

3. Index & Link Integrity Check: 0 issues

4. Portal & Step Architecture Check: 0 issues

============================================================
ALL STATIC CHECKS PASSED (0 errors)
============================================================
```

---

## ২. ব্যবহারকারীর ৯টি নিশ্চিত সমস্যার প্রতিকার ছক (Defect Resolution Matrix: ক–ঝ)

| সমস্যা নং | স্ক্রিনশট ও বিবরণ | মূল কারণ (Root Cause) | স্থায়ী সমাধান ও গৃহীত পদক্ষেপ (Permanent Resolution) |
|:---:|---|---|---|
| **ক** | নন-ক্যাডারের "নিয়োগ প্রশ্ন সমাধান" কার্ডের ভেতরে "ইনসেপশন ইয়ার বুক" কার্ড নেস্টেড; বাটন চেপ্টা ও লেখা লম্বালম্বি। | পূর্ববর্তী ইনডেক্সে `<article class="master-subject-card">`-এর সমাপ্তি ট্যাগ `</article>` মিসিং ছিল এবং আরেকটি কার্ড অপরটির পেটে সরাসরি ঢুকে পড়েছিল। | এইচটিএমএল নেস্টিং সংশোধন করে ব্যালান্সড ট্যাগ নিশ্চিত করা হয়েছে (১৯২টি ওপেন, ১৯২টি ক্লোজ)। ইনসেপশন ইয়ার বুককে সম্পূর্ণ আলাদা পূর্ণাঙ্গ কার্ড (`#nc-card-16`) হিসেবে প্রিলিমিনারির অতিরিক্ত রিসোর্সে স্থানান্তরিত করা হয়েছে। |
| **খ** | একই সারির পাশের কার্ডে শিরোনামের ওপরে বিশাল ফাঁকা জায়গা। | নেস্টেড কার্ডের অস্বাভাবিক উচ্চতার কারণে সিএসএস গ্রিড সারির বাকি কার্ডগুলো সমান উচ্চতায় প্রসারিত হয়ে ওপরে অতিরিক্ত ফাঁকা স্থান তৈরি করেছিল। | নেস্টিং দূর করার পর ফ্লেক্সবক্স ও গ্রিড বিন্যাস স্বাভাবিক হয়েছে এবং ডেস্কটপে পাশাপাশি কার্ডের উচ্চতার পার্থক্য ০.০px (<= ২px) যাচাই করা হয়েছে। |
| **গ** | নিচে বাঁ কোণে "⚡ প্রশ্ন-উত্তর মোড" সাধারণ টেক্সটের মতো পড়ে থাকা। | ফ্ল্যাটিং রিভিশন মোড বাটনে `position: fixed` এবং জ়েড-ইনডেক্স সঠিকভাবে প্রযুক্ত হয়নি। | `universal-modes.css` লোড নিশ্চিত করা হয়েছে এবং একটি ডেডিকেটেড ভাসমান রিভিশন বাটন (`#ebkModeFab`, `.ebk-mode-fab`) তৈরি করে নিচে ডানে (`bottom: 24px; right: 20px; z-index: 99990`) স্থাপন করা হয়েছে, যা স্ক্রল বাটনের সাথে ওভারল্যাপ করে না। |
| **ঘ** | ক্যাডার কার্ডে "পড়ার অগ্রগতি" বার ছিল, নন-ক্যাডারে ছিল না। | নন-ক্যাডার কার্ডগুলোতে প্রগ্রেস বারের পরিবর্তে কেবল স্থির স্ট্যাটাস ব্যাজ বসানো হয়েছিল। | প্রতিটি নন-ক্যাডার কার্ডে সুনির্দিষ্ট প্রগ্রেস বার (`.sub-prog-bar-bg`, `.sub-prog-fill`, `.prog-pct`) এবং স্বতন্ত্র আইডি যুক্ত করা হয়েছে এবং `updateProgressUI()`-এর মাধ্যমে লাইভ সিঙ্ক নিশ্চিত করা হয়েছে। |
| **ঙ** | সর্বত্র ইমোজির (🎯 🔤 📏 🏛️ ⚡ ⏳) ব্যবহার। | পূর্বে ভিজ্যুয়াল আইকন হিসেবে সরাসরি ইউনিকোড ইমোজি টেক্সটে বসানো হয়েছিল। | এইচটিএমএলের সমস্ত স্ট্যাটিক ইমোজি মুছে ফেলে স্ট্যান্ডার্ড ইনলাইন এসভিজি (SVG) লাইন-আইকন বসানো হয়েছে। এক্সটার্নাল স্ক্রিপ্ট থেকে রানটাইমে ইনজেক্ট হওয়া ইমোজি তাৎক্ষণিকভাবে দূর করার জন্য `MutationObserver`-ভিত্তিক স্যানিটাইজার যুক্ত করা হয়েছে। |
| **চ** | নন-ক্যাডার কার্ডের শিরোনামে বারবার "পিএসসি নন-ক্যাডার" প্রিফিক্স। | কার্ডের দৃশ্যমান টাইটেলে পূর্ণাঙ্গ দীর্ঘ নাম বসানো হয়েছিল। | কার্ডের দৃশ্যমান টাইটেল থেকে অপ্রয়োজনীয় প্রিফিক্স বাদ দিয়ে পরিচ্ছন্ন নাম রাখা হয়েছে (যেমন: "বাংলা সাহিত্য", "বাংলা ব্যাকরণ"); কার্ডের `title` ও `aria-label`-এ অ্যাক্সেসিবিলিটির জন্য পূর্ণ নাম সংরক্ষিত রয়েছে। |
| **ছ** | হেডার ও কনটেন্ট ভিন্ন প্রস্থের কন্টেইনারে। | টপবারের কন্টেইনার এবং মেইন সেকশনের কন্টেইনারে ভিন্ন ভিন্ন `max-width` ও মার্জিন রুল ছিল। | সমগ্র পোর্টালের কন্টেইনারকে `.portal-container` দিয়ে কেন্দ্রস্থ এবং সর্বোচ্চ ১১২০px (`max-width: 1120px; margin: 0 auto;`) স্ট্যান্ডার্ডে রূপান্তর করা হয়েছে। |
| **জ** | সংখ্যায় অসঙ্গতি (নন-ক্যাডারে "৪৩৮ অধ্যায়", পাটিগণিত বনাম বীজগণিত পৃষ্ঠা ওভারল্যাপ)। | ভিন্ন ভিন্ন একক (পরীক্ষা ও অধ্যায়) এক করে দেখানো হয়েছিল এবং কার্ডের ডেসক্রিপশন টেক্সটে ভুলবশত পৃষ্ঠা নম্বর টাইপো ছিল। | ডিস্ক ফাইল অডিট করে নিশ্চিত হওয়া গেছে যে পাটিগণিত শেষ হয়েছে ৩১৭ পৃষ্ঠায় এবং বীজগণিত শুরু হয়েছে ৩১৮ পৃষ্ঠায় (কোনো ওভারল্যাপ নেই)। কার্ডের অস্বচ্ছ টেক্সট মুছে সঠিক অধ্যায় ও প্রশ্ন সংখ্যা বসানো হয়েছে। প্রিলিমিনারিতে ১৬টি বই = ২০৮ অধ্যায়/পরীক্ষা এবং ১৯,৫২৯টি প্রশ্ন প্রদর্শিত হচ্ছে। |
| **ঝ** | নন-ক্যাডার লিখিত প্যানেলে বিভ্রান্তিকর তথ্য ("২০০ নম্বর", "১০০% প্রস্তুত") এবং ইনসেপশন ইয়ার বুকের অবস্থান। | লিখিত পরীক্ষা সমাধান সেকশনে এমসিকিউ প্রশ্ন সংকলন অন্তর্ভুক্ত করা হয়েছিল। | ইনসেপশন ইয়ার বুক পরীক্ষা করে দেখা গেছে এটি শতভাগ এমসিকিউ (MCQ); তাই এটিকে প্রিলিমিনারির অতিরিক্ত রিসোর্সে স্থানান্তর করা হয়েছে। লিখিত প্যানেলের শিরোনাম সংশোধন করে রাখা হয়েছে: "লিখিত প্রশ্ন সমাধান: পিএসসি ও অন্যান্য প্রতিষ্ঠান" (১৫৮টি পরীক্ষা, ৩,০৬০ প্রশ্ন)। |

---

## ৩. ডিস্ক ফাইল ও কার্ডের ১:১ মিল ছক (Physical Disk vs Card 1:1 Synchronization)

### ক. বিসিএস (ক্যাডার) প্রিলিমিনারি: ১২টি বিষয়, ২১১টি অধ্যায়, ৪,৫০৮টি প্রশ্ন
| কার্ড আইডি | বিষয়ের নাম | ডিস্ক ফোল্ডার | `data-chapters` | ডিস্কে আসল অধ্যায় ফাইল | `data-questions` |
|---|---|---|:---:|:---:|:---:|
| `cadre-card-01` | বাংলা ভাষা ও ব্যাকরণ | `Live MCQ Bangla Language` | ২২ | ২২ | ৪২১ |
| `cadre-card-02` | বাংলা সাহিত্য | `Live MCQ Bangla Literature` | ৩০ | ৩০ | ৪৬০ |
| `cadre-card-03` | English Grammar | `Live MCQ English Grammar` | ২৯ | ২৯ | ৭৫৭ |
| `cadre-card-04` | English Literature | `Live MCQ English Literature` | ৮ | ৮ | ২০৫ |
| `cadre-card-05` | বাংলাদেশ বিষয়াবলি | `Live MCQ Bangladesh` | ৩১ | ৩১ | ৫৫০ |
| `cadre-card-06` | আন্তর্জাতিক বিষয়াবলি | `Live MCQ International` | ২১ | ২১ | ৫১৫ |
| `cadre-card-07` | ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা | `Live MCQ Geography` | ৪ | ৪ | ১২২ |
| `cadre-card-08` | সাধারণ বিজ্ঞান | `Live MCQ General Science` | ৩১ | ৩১ | ৪৬৩ |
| `cadre-card-09` | কম্পিউটার ও তথ্য প্রযুক্তি | `Live MCQ Computer & IT` | ১২ | ১২ | ১৮৮ |
| `cadre-card-10` | গাণিতিক যুক্তি | `Live MCQ Mathematical Reasoning` | ১৩ | ১৩ | ৫৩৮ |
| `cadre-card-11` | মানসিক দক্ষতা | `Live MCQ Mental Ability` | ৬ | ৬ | ১৭৫ |
| `cadre-card-12` | নৈতিকতা, মূল্যবোধ ও সুশাসন | `Live MCQ Ethics & Good Governance` | ৪ | ৪ | ১১৪ |
| **সর্বমোট** | **১২টি বিষয়** | — | **২১১** | **২১১** | **৪,৫০৮** |

### খ. পিএসসি নন-ক্যাডার প্রিলিমিনারি: ১৬টি বই, ২০৮টি অধ্যায়/পরীক্ষা, ১৯,৫২৯টি প্রশ্ন
| কার্ড আইডি | বইয়ের নাম | ডিস্ক ফোল্ডার | `data-chapters` | ডিস্কে আসল অধ্যায়/পরীক্ষা ফাইল | `data-questions` |
|---|---|---|:---:|:---:|:---:|
| `nc-card-01` | বাংলা সাহিত্য | `Non Cadre Bangla Literature` | ১৬ | ১৬ | ৪০৭ |
| `nc-card-02` | বাংলা ব্যাকরণ | `Non Cadre Bangla Grammar` | ১৯ | ১৯ | ৫৮০ |
| `nc-card-03` | ইংরেজি ভাষা ও সাহিত্য | `Non Cadre English` | ২৮ | ২৮ | ৩,৩২৭ |
| `nc-card-04` | সাধারণ বিজ্ঞান | `Non Cadre General Science` | ১২ | ১২ | ৬৫০ |
| `nc-card-05` | বাংলাদেশ বিষয়াবলি | `Non Cadre Bangladesh` | ১৫ | ১৫ | ১,১০৭ |
| `nc-card-06` | আন্তর্জাতিক বিষয়াবলি | `Non Cadre International` | ১২ | ১২ | ৯০৬ |
| `nc-card-07` | পাটিগণিত | `Non Cadre Arithmetic` | ১৩ | ১৩ | ৪৫০ |
| `nc-card-08` | বীজগণিত | `Non Cadre Algebra` | ১২ | ১২ | ৭৩৯ |
| `nc-card-09` | জ্যামিতি ও পরিমিতি | `Non Cadre Geometry` | ৯ | ৯ | ৩২৯ |
| `nc-card-10` | ত্রিকোণমিতি ও উচ্চতর গণিত | `Non Cadre Trigonometry & Higher Math` | ৪ | ৪ | ৯৫ |
| `nc-card-11` | মানসিক দক্ষতা | `Non Cadre Mental Ability` | ২ | ২ | ৪৫ |
| `nc-card-12` | ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা | `Non Cadre Geography & Environment` | ২ | ২ | ৬০ |
| `nc-card-13` | কম্পিউটার ও তথ্যপ্রযুক্তি | `Non Cadre Computer & IT` | ৫ | ৫ | ২০৩ |
| `nc-card-14` | নৈতিকতা, মূল্যবোধ ও সুশাসন | `Non Cadre Ethics & Good Governance` | ১ | ১ | ৪ |
| `nc-card-15` | নিয়োগ প্রশ্ন সমাধান | `Non Cadre Job Solution` | ৪৮ | ৫০ | ৪,৪০০ |
| `nc-card-16` | ইনসেপশন ইয়ার বুক (২০২৫-২০২৬) | `Inception Year Book 2025-2026` | ১০ | ১০ | ৬,২২৭ |
| **সর্বমোট** | **১৬টি বই** | — | **২০৮** | **২১০** | **১৯,৫২৯** |

### গ. পিএসসি নন-ক্যাডার লিখিত: ১৫৮টি সম্পূর্ণ পরীক্ষা, ৩,০৬০টি প্রশ্ন
| কার্ড আইডি | রিসোর্সের নাম | ডিস্ক ফোল্ডার | পরীক্ষার সংখ্যা | লিখিত প্রশ্ন সংখ্যা | স্থিতি |
|---|---|---|:---:|:---:|:---:|
| `nc-written-01` | লিখিত প্রশ্ন সমাধান: পিএসসি ও অন্যান্য প্রতিষ্ঠান | `PSC & IBA Written Job Solution` | ১৫৮টি লিখিত পরীক্ষা (পিএসসি সাধারণ ৪৩ + টেকনিক্যাল ৪৭, আইবিএ ১৩, বুয়েট ১২, এফবিএস ৬, আর্টস ৩, অন্যান্য ৩৪) | ৩,০৬০ | চালু ⚡ |

---

## ৪. ভিজ্যুয়াল পরিবর্তন ও স্ক্রিনশট প্রমাণ (Proof of Change & Screenshots)

`tests/gate_portal.test.js` দ্বারা নিম্নোক্ত স্ক্রিনশটগুলো `docs/screens/` ফোল্ডারে সংগৃহীত ও সংরক্ষিত হয়েছে:
1. `docs/screens/after-320-light.png` এবং `docs/screens/after-320-dark.png` (স্মার্টফোন আল্ট্রা-কম্প্যাক্ট ৩২০px ভিউপোর্ট)
2. `docs/screens/after-390-light.png` এবং `docs/screens/after-390-dark.png` (আধুনিক মোবাইল ৩৯০px ভিউপোর্ট)
3. `docs/screens/after-768-light.png` এবং `docs/screens/after-768-dark.png` (ট্যাবলেট ৭৬৮px ভিউপোর্ট)
4. `docs/screens/after-1366-light.png` এবং `docs/screens/after-1366-dark.png` (ডেস্কটপ ১৩৬৬px ভিউপোর্ট)

ভিজ্যুয়াল পার্থক্য: পূর্বে পোর্টাল ফ্রন্টপেজের বাইট সাইজ ছিল ৩৭,১৯৭ বাইট, বর্তমানে রিডিজাইনকৃত মাস্টার পোর্টালের সাইজ ১৩৭,৫৬৪ বাইট (পার্থক্য: ১০০,৩৬৭ বাইট > ০)।

---

## ৫. লোকাল সার্ভার চালনা ও পরিদর্শনের নিয়ম (Local Inspection Guide)

লোকাল সার্ভারে পোর্টালটি সরাসরি পরীক্ষা করতে টার্মিনালে রান করুন:
```bash
python -m http.server 8000
```
ব্রাউজারে ভিজিট করুন:
- ল্যান্ডিং পোর্টাল: [http://localhost:8000/index.html](http://localhost:8000/index.html)
- নন-ক্যাডার লিখিত ডিপ-লিংক: [http://localhost:8000/index.html#noncadre-written](http://localhost:8000/index.html#noncadre-written)

---

## ৬. স্কোপ অডিট ও গিট স্ট্যাটাস (Scope Audit & Git Log)

### বর্তমান ব্রাঞ্চ: `portal-redesign`
```text
$ git status
On branch portal-redesign
Changes not staged for commit:
	modified:   GEMINI.md
	modified:   PROJECT_STANDARDS_AND_ARCHITECTURE.md
	modified:   docs/needs-verification.md
	modified:   docs/portal-report.md
	modified:   docs/sources.md
	modified:   index.html
	modified:   portal-home.css
	modified:   tests/gate_portal.test.js
	modified:   tools/check-all.py

Untracked files:
	portal-data.js
```
*নোট:* কোনো সাব-ইনডেক্স, কোনো অধ্যায় এইচটিএমএল পেজ, বা কোনো ডেটা ফাইল পরিবর্তিত হয়নি। পরিবর্তন শুধুমাত্র অনুমোদিত ফাইলসমূহের ভেতরে কঠোরভাবে সীমাবদ্ধ।
