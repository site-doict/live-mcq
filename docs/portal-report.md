# BCS & PSC Non-Cadre E-Book Library Portal Redesign (v2 Fix-Pass) — Engineering Report

**তারিখ:** ২০২৬-১০-৩১  
**ব্রাঞ্চ:** `portal-redesign`  
**বেসলাইন কমিট ($BASE):** `8affb28624ac8f35a64e0653317fa16b7cb71347`  
**প্রজেক্ট স্কোপ:** স্ট্যাটিক ই-বুক লাইব্রেরি মাস্টার পোর্টাল (`/index.html`) রিডিজাইন ও আর্কিটেকচারাল ফিক্স-পাস  
**স্ট্যাটাস:** **সম্পন্ন (COMPLETED — 100% GREEN VERIFIED)**

---

## ১. প্রারম্ভিক পরিবেশ ও গিট টার্মিনাল স্টেট (Baseline Git State)

```text
--- BRANCH ---
portal-redesign

--- LOG ---
8affb28 fix(portal): resolve 9 landing defects, unnest inception yearbook, add progress bars, sanitize emojis, pass 53 gate tests
c0d279e feat(portal): add 158 written exams directory and offline subject questions showcase to non-cadre written
eb5ae9f docs: stage 8 - final comprehensive portal redesign report
d41f24b docs: stage 7 - update standards, checklist, and tools/check-all for portal architecture
76d407f test: stage 5 - all 30 gate checks 100% green and after screenshots captured
b5fb0b1 feat(portal): stage 3 & 4 - 3-stage architecture, dynamic stats calculation, hash routing and verified syllabus
41cb70f feat(css): stage 2 - design tokens and portal components in ebook-ui.css and portal-home.css
4af2e88 docs: stage 1 - portal redesign plan, official sources, and before screenshots

--- REMOTE ---
origin	https://github.com/site-doict/live-mcq.git (fetch)
origin	https://github.com/site-doict/live-mcq.git (push)

--- BASE COMMIT ---
$BASE = 8affb28624ac8f35a64e0653317fa16b7cb71347
```

---

## ২. ফিক্স-পাসের আগে ও পরের ভিজ্যুয়াল প্রমাণ (Screenshots)

### ক. পূর্ববর্তী অবস্থার স্ক্রিনশট (Before Screenshots)
- **ডেস্কটপ (১২৮০px):** [`docs/screens/before-desktop-1280-light.png`](screens/before-desktop-1280-light.png)
- **মোবাইল (৩৭৫px):** [`docs/screens/before-mobile-375-light.png`](screens/before-mobile-375-light.png)

### খ. নতুন ফিক্স-পাস (v2) ভেরিফাইড স্ক্রিনশট (After Screenshots)
- **৩২০px (Ultra-Compact Mobile):**
  - লাইট মোড: [`docs/screens/after-320-light.png`](screens/after-320-light.png)
  - ডার্ক মোড: [`docs/screens/after-320-dark.png`](screens/after-320-dark.png)
- **৩৯০px (Standard Mobile / iPhone):**
  - লাইট মোড: [`docs/screens/after-390-light.png`](screens/after-390-light.png)
  - ডার্ক মোড: [`docs/screens/after-390-dark.png`](screens/after-390-dark.png)
- **৭৬৮px (Tablet Portrait / iPad):**
  - লাইট মোড: [`docs/screens/after-768-light.png`](screens/after-768-light.png)
  - ডার্ক মোড: [`docs/screens/after-768-dark.png`](screens/after-768-dark.png)
- **১৩৬৬px (Standard Desktop / Laptop):**
  - লাইট মোড: [`docs/screens/after-1366-light.png`](screens/after-1366-light.png)
  - ডার্ক মোড: [`docs/screens/after-1366-dark.png`](screens/after-1366-dark.png)

---

## ৩. সমস্যা, মূল কারণ ও সমাধান রেজোলিউশন মেট্রিক্স (Root Cause & Resolution Matrix)

| ক্যাটাগরি | আইডি | চিহ্নিত সমস্যা | মূল কারণ (Root Cause) | গৃহীত স্থায়ী সমাধান (Permanent Fix) | স্ট্যাটাস |
|:---|:---:|:---|:---|:---|:---:|
| **Visual** | **V1** | হিরো ব্যাজের SVG আইকন বিশাল ও অসামঞ্জস্যপূর্ণ | ইনলাইন SVG ট্যাগে সাইজ এট্রিবিউট (`width`/`height`) এবং কনটেইনারের ফ্লেক্স সাইজ রুল ছিল না | সমস্ত ইনলাইন SVG-তে স্পষ্ট `width="16" height="16"` যুক্ত করা হয়েছে এবং CSS-এ `.portal-hero-badge svg { width:16px; height:16px; flex:none; }` নিশ্চিত করা হয়েছে। ৩২০px-এ ব্যাজ উচ্চতা ≤ ৫৬px। | **VERIFIED** |
| **Visual** | **V2** | লগইন বাটন হেডারের নিচে আলাদা সারিতে বামে বিচ্ছিন্ন ছিল | `universal-modes.js` দ্বারা ইনজেক্টেড বাটন নেভবারের বাইরে মাউন্ট হতো এবং হেডারে কোনো স্ট্যাটিক বাটন প্লেসমেন্ট ছিল না | নেভবারের `.portal-nav-actions` / `.topbar-actions`-এর ভেতরে স্ট্যাটিক `#ebkAdminLoginBtn` প্লেস করা হয়েছে; ব্র‍্যান্ড ও একশন একক সারিতে লক করা হয়েছে (উচ্চতা ৫৪–৬০px, কোনো আলাদা লাইন নেই)। | **VERIFIED** |
| **Visual** | **V3** | পরীক্ষা দিন পিল বাটনে ডলার ($) চিহ্ন প্রদর্শিত হতো | SVG পাথে ফাইন্যান্সিয়াল আইকন কোড ছিল | সরকারি ও প্রমিত ক্লিপবোর্ড-চেক আইকন SVG দ্বারা প্রতিস্থাপন করা হয়েছে। | **VERIFIED** |
| **Visual** | **V4** | হেডারে ৪৫px-এর অপ্রয়োজনীয় ঝাপসা ছাই রঙের বার | অতিরিক্ত প্যাডিং, মার্জিন ও ভুল লেআউট স্ট্যাকিং | নেভবার একক সারিতে ফ্লেক্সিবল ও পরিষ্কার করা হয়েছে; ব্যাকগ্রাউন্ড গ্লাস মরফিজম ব্যাকড্রপ ফিল্টার সহ থিম ভ্যারিয়েবলে সীমাবদ্ধ। | **VERIFIED** |
| **Visual** | **V5** | স্টেপার কার্ডগুলো অ্যাক্সেসিবল ছিল না (সাধারণ `div`) | সিম্যান্টিক বোতাম ও কীবোর্ড নেভিগেশনের অনুপস্থিতি | প্রতিটি স্টেপ কার্ডকে `<button type="button" role="tab" class="portal-step-card ...">`-এ রূপান্তর করা হয়েছে এবং `ArrowRight`/`ArrowLeft`/`Home`/`End` কী দ্বারা রোভিং ট্যাব-ইনডেক্স সাপোর্ট যুক্ত করা হয়েছে। | **VERIFIED** |
| **Numbers** | **N1** | ক্যাডার প্রিলিমিনারি প্রশ্ন সংখ্যায় বিভ্রান্তি | মেটা স্ট্রিং ও ডিস্কের মধ্যে মিলের অভাব | `tools/count_disk.py` দ্বারা ১২টি বিষয়ের ২১১টি অধ্যায়ের মোট ৪,৯৬১টি প্রশ্ন গুনে কার্ডে ও স্ট্যাট কাউন্টারে সিঙ্ক করা হয়েছে। | **VERIFIED** |
| **Numbers** | **N2** | নন-ক্যাডার প্রিলিমিনারিতে ইনসেপশন ইয়ারবুক নেস্টেড থাকা ও সংখ্যা অমিল | নিয়োগ প্রশ্ন সমাধান কার্ডের ভেতরে ইয়ারবুক নেস্টেড ছিল | ইয়ারবুককে সম্পূর্ণ আননেস্ট করে আলাদা কার্ড হিসেবে কার্ড ১৬-তে যুক্ত করা হয়েছে; ১৬টি বইয়ের ২০৮টি অধ্যায়/পরীক্ষায় মোট ২১,৮২৬টি প্রশ্ন শতভাগ নির্ভুলভাবে সিঙ্ক করা হয়েছে। | **VERIFIED** |
| **Numbers** | **N3** | লিখিত পরীক্ষার অবাস্তব ৫-বিষয় সাব-ব্রেকডাউন ও পৃষ্ঠা সংখ্যা | বইয়ের বাইরে থেকে অনুমান করা পৃষ্ঠা সংখ্যা (১–৮৭২) | ১৫৮টি লিখিত পরীক্ষার আসল কর্তৃপক্ষভিত্তিক সাব-ব্রেকডাউন (PSC Gen 43, PSC Tech 47, IBA 13, BUET 12, FBS/Arts 9, Other 34 = 158 পরীক্ষা, ৩,০৬০ প্রশ্ন) যুক্ত করা হয়েছে। | **VERIFIED** |
| **Numbers** | **N4** | পাটিগণিত ও বীজগণিতের ওভারল্যাপিং পৃষ্ঠা বিভ্রান্তি (২২৮–৩২৫ বনাম ৩১৮–৪৪২) | কার্ডের বর্ণনামূলক টেক্সটে টাইপো | ফিজিক্যাল ফাইল অডিট করে নিশ্চিত হওয়া গেছে পাটিগণিত ৩১৭ পৃষ্ঠায় শেষ এবং বীজগণিত ৩১৮ থেকে শুরু। কার্ড থেকে বিভ্রান্তিকর পৃষ্ঠা সীমা বাদ দিয়ে আসল অধ্যায় ও প্রশ্ন সংখ্যা নির্ধারণ করা হয়েছে। | **VERIFIED** |
| **Claims** | **C1** | অতিরঞ্জিত সংখ্যা দাবি ("লক্ষাধিক", "৭৬,০০০+") | অনির্ভরযোগ্য অনুমিত মার্কেটিং টেক্সট | সমস্ত মার্কেটিং সংখ্যা বাদ দিয়ে শুধুমাত্র ডিস্কের আসল ২৯,৮৪৭ প্রশ্ন সংখ্যা উপস্থাপন করা হয়েছে। | **VERIFIED** |
| **Claims** | **C2** | "শতভাগ অফলাইন" ও "১০০% প্রস্তুত" ইত্যাদি ফাঁপা দাবি | অপ্রমাণিত মার্কেটিং শব্দাবলি | সমস্ত অতিরঞ্জিত শব্দ মুছে খাঁটি অ্যাকাডেমিক তথ্য স্থাপন করা হয়েছে। | **VERIFIED** |
| **Claims** | **C3** | "সংকলন চলছে" বা ভবিষ্যৎ সেশন সংক্রান্ত ভিত্তিহীন অনুমান | অনুমানের আশ্রয় | সম্পূর্ণ তথ্যহীন অনুমান অপসারণ করা হয়েছে। | **VERIFIED** |
| **Claims** | **C4** | "চালু ⚡" বা "রিয়েল বোর্ড" মার্কেটিং শব্দাবলি | অপ্রয়োজনীয় ইমোজি ও স্লোগান | সমস্ত টেক্সট ইমোজি বাদ দিয়ে প্রমিত বাংলা পরিভাষা প্রয়োগ করা হয়েছে। | **VERIFIED** |
| **Claims** | **C5** | শীঘ্রই আসছে কার্ডগুলোতে খালি প্রোগ্রেস বার ও ভাঙা লিংক | অসম্পূর্ণ কার্ডের ভুল স্ট্রাকচার | সমস্ত কামিং সুন কার্ডে শুধুমাত্র শিরোনাম + "শীঘ্রই আসছে" ব্যাজ + মিউটেড আইকন রাখা হয়েছে (কোনো ডেড লিংক বা প্রোগ্রেস বার নেই)। | **VERIFIED** |
| **Sources** | **S1** | ক্যাডার প্রিলিমিনারি পরীক্ষা কাঠামো ও নেগেটিভ মার্কিং | অস্পষ্ট উদ্ধৃতি | বিসিএস পরীক্ষা বিধিমালা, ২০১৪ অনুযায়ী ২০০ MCQ, ২ ঘণ্টা, প্রতি ভুল উত্তরে ০.৫০ কর্তন লিপিবদ্ধ করা হয়েছে। | **VERIFIED** |
| **Sources** | **S2** | ক্যাডার লিখিত পাস নম্বর ও বিষয় বণ্টন | অস্পষ্ট নিয়ম | সাধারণ ক্যাডার ৯০০ নম্বর, গড়ে ৫০% পাস নম্বর (যেকোনো বিষয়ে ৩০%-এর কম পেলে শূন্য) সুনির্দিষ্টভাবে উল্লেখ করা হয়েছে। | **VERIFIED** |
| **Sources** | **S3** | ক্যাডার ভাইভা পাস নম্বর ও চূড়ান্ত মেধা নির্ধারণ | সাধারণ ভুল ধারণা | ২০০ নম্বরের মৌখিক পরীক্ষায় ন্যূনতম ৫০% (১০০ নম্বর) প্রাপ্তি বাধ্যতামূলক এবং লিখিত+ভাইভা (১১০০) ভিত্তিতে মেধা নির্ধারণ স্পষ্ট করা হয়েছে। | **VERIFIED** |
| **Sources** | **S4** | প্রতিষ্ঠানের প্রচলিত প্রতিবর্ণীকরণ | অসংগত নাম | গণপ্রজাতন্ত্রী বাংলাদেশ সংবিধান ও সরকারি গেজেট অনুযায়ী "বাংলাদেশ সরকারি কর্ম কমিশন (BPSC)" প্রমিত প্রতিবর্ণীকরণ নিশ্চিত করা হয়েছে। | **VERIFIED** |

---

## ৪. ডিস্ক লাইব্রেরি ও প্রশ্ন সংখ্যার একক উৎস (`tools/count_disk.py` Single Source of Truth)

`tools/count_disk.py` সরাসরি ফাইলসিস্টেমের প্রতিটি চ্যাপ্টার ও প্রশ্ন গুনে আউটপুট দেয়:

```text
| Card ID | বিভাগ / বিষয় | ফোল্ডার | ডিস্ক পরিচ্ছেদ / পরীক্ষা | ডিস্ক প্রশ্ন |
|:---|:---|:---|:---:|:---:|
| `cadre-card-01` | Cadre Prelim | `Live MCQ Bangla Language` | 22 | 421 |
| `cadre-card-02` | Cadre Prelim | `Live MCQ Bangla Literature` | 30 | 494 |
| `cadre-card-03` | Cadre Prelim | `Live MCQ English Grammar` | 29 | 757 |
| `cadre-card-04` | Cadre Prelim | `Live MCQ English Literature` | 8 | 205 |
| `cadre-card-05` | Cadre Prelim | `Live MCQ Bangladesh` | 31 | 770 |
| `cadre-card-06` | Cadre Prelim | `Live MCQ International` | 21 | 714 |
| `cadre-card-07` | Cadre Prelim | `Live MCQ Geography` | 4 | 122 |
| `cadre-card-08` | Cadre Prelim | `Live MCQ General Science` | 31 | 463 |
| `cadre-card-09` | Cadre Prelim | `Live MCQ Computer & IT` | 12 | 188 |
| `cadre-card-10` | Cadre Prelim | `Live MCQ Mathematical Reasoning` | 13 | 538 |
| `cadre-card-11` | Cadre Prelim | `Live MCQ Mental Ability` | 6 | 175 |
| `cadre-card-12` | Cadre Prelim | `Live MCQ Ethics & Good Governance` | 4 | 114 |
| `nc-card-01` | Non-Cadre Prelim | `Non Cadre Bangla Literature` | 16 | 1,407 |
| `nc-card-02` | Non-Cadre Prelim | `Non Cadre Bangla Grammar` | 19 | 1,153 |
| `nc-card-03` | Non-Cadre Prelim | `Non Cadre English` | 28 | 3,327 |
| `nc-card-04` | Non-Cadre Prelim | `Non Cadre General Science` | 12 | 1,184 |
| `nc-card-05` | Non-Cadre Prelim | `Non Cadre Bangladesh` | 15 | 1,107 |
| `nc-card-06` | Non-Cadre Prelim | `Non Cadre International` | 12 | 906 |
| `nc-card-07` | Non-Cadre Prelim | `Non Cadre Arithmetic` | 13 | 640 |
| `nc-card-08` | Non-Cadre Prelim | `Non Cadre Algebra` | 12 | 739 |
| `nc-card-09` | Non-Cadre Prelim | `Non Cadre Geometry` | 9 | 329 |
| `nc-card-10` | Non-Cadre Prelim | `Non Cadre Trigonometry & Higher Math` | 4 | 95 |
| `nc-card-11` | Non-Cadre Prelim | `Non Cadre Mental Ability` | 2 | 45 |
| `nc-card-12` | Non-Cadre Prelim | `Non Cadre Geography & Environment` | 2 | 60 |
| `nc-card-13` | Non-Cadre Prelim | `Non Cadre Computer & IT` | 5 | 203 |
| `nc-card-14` | Non-Cadre Prelim | `Non Cadre Ethics & Good Governance` | 1 | 4 |
| `nc-card-15` | Non-Cadre Prelim | `Non Cadre Job Solution` | 48 | 4,400 |
| `nc-card-16` | Non-Cadre Prelim | `Inception Year Book 2025-2026` | 10 | 6,227 |
| `nc-written-01` | Non-Cadre Written | `PSC & IBA Written Job Solution` | 158 | 3,060 |
| **ক্যাডার প্রিলিমিনারি মোট** | **১২টি বিষয়** | - | **211** | **4,961** |
| **নন-ক্যাডার প্রিলিমিনারি মোট** | **১৬টি বই/বিষয়** | - | **208** | **21,826** |
| **নন-ক্যাডার লিখিত মোট** | **লিখিত প্রশ্নব্যাংক** | - | **158 পরীক্ষা** | **3,060** |
| **সর্বমোট লাইব্রেরি সংগ্রহ** | **২৯টি কার্ড** | - | **577** | **29,847** |
```

---

## ৫. টেস্ট ও ভেরিফিকেশন গেট রিপোর্ট (Test & Verification Gate Report)

### ক. স্ট্যাটিক অডিট: `python tools/check-all.py` (Verbatim Output)
```text
============================================================
BCS Static E-Book Library - Static Verification Check
============================================================

1. Math Data & Delimiter Check: 0 issues

2. Answer Presentation Check: 0 issues

3. Index & Link Integrity Check: 0 issues

4. Portal & Step Architecture Check: 0 issues

5. Disk Count Synchronization & Content Integrity: 0 issues

============================================================
ALL STATIC CHECKS PASSED (0 errors)
============================================================
```

### খ. প্লে-রাইট এন্ড-টু-এন্ড অটোমেটেড গেট: `node tests/gate_portal.test.js` (Verbatim Output)
```text
Test server running at http://localhost:8092

============================================================
GATE 1: PROOF OF CHANGE & VISUAL VERIFICATION
============================================================
[PASS] G1: DOM proof verified: New Hero, 3-Stage Stepper, and Dark Footer are present
[PASS] G1: After screenshots captured at 320, 390, 768, 1366px (Light & Dark)
[PASS] G1: Visual change confirmed (size diff: 112243 bytes > 0)

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
[PASS] G2+: All inline SVGs strictly bounded (max rendered SVG dimension: 28.0px <= 64px)
[PASS] G2+: Hero badge SVG strictly sized (16.0x16.0px)
[PASS] G2+: Navbar strictly single-row (height: 61px) with #ebkAdminLoginBtn on brand row
[PASS] G2+: Exam pill displays clipboard-check icon (dollar sign removed)
[PASS] G2: Zero horizontal overflow & all interactive elements in viewport at 1366px
[PASS] G2: Zero nested cards detected (0 nested)
[PASS] G2: Same row cards equal height verified (height diff: 0.0px <= 2px)
[PASS] G2: Revision FAB computed position:fixed and inside viewport
[PASS] G2: Header and Content standardized to same container width (~1120px)
[PASS] G2+: All inline SVGs strictly bounded (max rendered SVG dimension: 28.0px <= 64px)
[PASS] G2+: Hero badge SVG strictly sized (16.0x16.0px)
[PASS] G2+: Navbar strictly single-row (height: 61px) with #ebkAdminLoginBtn on brand row
[PASS] G2+: Exam pill displays clipboard-check icon (dollar sign removed)
[PASS] G2: Zero horizontal overflow & all interactive elements in viewport at 1920px
[PASS] G2: Zero nested cards detected (0 nested)
[PASS] G2: Same row cards equal height verified (height diff: 0.0px <= 2px)
[PASS] G2: Revision FAB computed position:fixed and inside viewport
[PASS] G2: Header and Content standardized to same container width (~1120px)
[PASS] G2+: All inline SVGs strictly bounded (max rendered SVG dimension: 28.0px <= 64px)
[PASS] G2+: Hero badge SVG strictly sized (16.0x16.0px)
[PASS] G2+: Navbar strictly single-row (height: 61px) with #ebkAdminLoginBtn on brand row
[PASS] G2+: Exam pill displays clipboard-check icon (dollar sign removed)

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
[PASS] G3+: Stepper keyboard navigation (ArrowRight -> Written) updates aria-selected, roving tabindex, and panel
[PASS] G3+: Stepper keyboard navigation (Home -> Prelim) restores initial tab

============================================================
GATE 4: DATA & INTEGRITY CHECKS
============================================================
[PASS] G4: All 53 required contract IDs exist in index.html
[PASS] G4: All 59 subject card links resolve to actual files on disk
[PASS] G4: All upcoming/disabled cards have zero hrefs (no dead links)
[PASS] G4: Every active subject card across both tracks has a valid progress bar & %
[PASS] G4: Cadre stats match exact sum of card data-attributes (12 subjects, 211 chapters, 4,961 questions)
[PASS] G4: Non-Cadre Prelim stats match sum of card data-attributes (16 books, 208 chapters/exams, 21,826 questions)
[PASS] G4+: All 29 cards 100% match tools/count_disk.py Single Source of Truth
[PASS] G4: Zero emojis detected in DOM text (all emojis replaced with inline SVGs)
[PASS] G4: Zero disallowed inline styles in index.html (only CSS variable --p allowed)
[PASS] G4: Zero "পিএসসি নন-ক্যাডার" prefixes in card titles (clean track-tab context)
[PASS] G4: HTML tag integrity verified: balanced <article> tags (34 opened, 34 closed)

============================================================
GATE 5: QUALITY & ACCESSIBILITY (axe-core)
============================================================
[PASS] G5: Exactly one single <h1> element on the page
[PASS] G5: Zero duplicate IDs on the page
[PASS] G5: Zero duplicate script loads
[PASS] G5: axe-core Light mode passed with 0 serious/critical violations (31 checks passed)
[PASS] G5: axe-core Dark mode passed with 0 serious/critical violations (31 checks passed)
[PASS] G5: No reference brand logos, external images, or unbacked external terms
[PASS] G5: Official sources documented and verified in docs/sources.md

============================================================
GATE 6: SCOPE AUDIT
============================================================
[INFO] G6: Prior branch artifacts noted in diff: PSC & IBA Written Job Solution/data/written_questions_data.js, PSC & IBA Written Job Solution/subjects.html
[PASS] G6: Scope audit verified (active working files strictly isolated to Section 0)

============================================================
GATE 7: CONTENT INTEGRITY & CITATIONS CHECK
============================================================
[PASS] G7: Zero forbidden unbacked promo terms found in index.html
[PASS] G7: Standard government transliteration: বাংলাদেশ সরকারি কর্ম কমিশন (BPSC)
[PASS] G7: All 5 coming soon cards are clean (only title + শীঘ্রই আসছে + muted icon)
[PASS] G7: All 14 internal footer links resolve to existing files on disk

============================================================
TOTAL GATES SUMMARY: 72 PASSED, 0 FAILED
============================================================
```

---

## ৬. নিয়ন্ত্রিত নেগেটিভ টেস্টের প্রামাণ্য রিপোর্ট (Controlled Negative Gate Failure Verification)

গেটের নির্ভরযোগ্যতা ও অন্ধ না হওয়ার চূড়ান্ত প্রমাণ হিসেবে `index.html`-এর `cadre-card-01`-এ ইচ্ছাকৃতভাবে ভুল প্রশ্ন সংখ্যা বসিয়ে পরীক্ষা চালানো হয়:

1. **ইচ্ছাকৃত পরিবর্তন (Tamper):**
   `index.html`-এ `cadre-card-01`-এর `data-questions="421"` সাময়িকভাবে পরিবর্তন করে `data-questions="9999"` করা হয়।
2. **টার্মিনাল আউটপুট (Gate Caught Failure):**
   ```text
   ============================================================
   BCS Static E-Book Library - Static Verification Check
   ============================================================

   1. Math Data & Delimiter Check: 0 issues

   2. Answer Presentation Check: 0 issues

   3. Index & Link Integrity Check: 0 issues

   4. Portal & Step Architecture Check: 0 issues

   5. Disk Count Synchronization & Content Integrity: 1 issues
      [FAIL] SYNC: cadre-card-01 questions mismatch! index.html=9999 vs disk=421

   ============================================================
   TOTAL STATIC ERRORS: 1
   ============================================================
   Command exited with code 1.
   ```
3. **অবিলম্বে রিভার্ট (Revert):**
   `scratch/revert_test.py` চালিয়ে সংখ্যাটি পুনরায় সঠিক `data-questions="421"`-এ ফিরিয়ে আনা হয় এবং `python tools/check-all.py` পুনরায় রান করে নিশ্চিত হওয়া হয় যে ত্রুটি শূন্য (০) এবং গেট ১০০% সবুজ।

---

## ৭. লোকাল সার্ভার থেকে ম্যানুয়াল যাচাই পদ্ধতি (Local Inspection Procedure)

প্রজেক্টটি কোনো থার্ড-পার্টি ফ্রেমওয়ার্ক বা বিল্ড টুল ছাড়া পিওর HTML/CSS/JS আর্কিটেকচারে পরিচালিত। লোকাল পরিবেশে যাচাই করতে:

1. টার্মিনালে লোকাল সার্ভার চালু করুন:
   ```powershell
   python -m http.server 8000
   ```
2. ব্রাউজারে প্রবেশ করুন:
   - হোম পোর্টাল: `http://localhost:8000/index.html`
   - ক্যাডার প্রিলিমিনারি: `http://localhost:8000/index.html#cadre-prelim`
   - নন-ক্যাডার লিখিত: `http://localhost:8000/index.html#noncadre-written`
   - নন-ক্যাডার ভাইভা: `http://localhost:8000/index.html#noncadre-viva`
3. ব্রাউজার কনসোলে স্বয়ংক্রিয় স্ট্যাটাস ও প্রোগ্রেস সিঙ্ক পরীক্ষা করুন:
   - ক্যাডারের ১২টি বিষয়ে ২১১টি অধ্যায় ও ৪,৯৬১টি প্রশ্ন প্রদর্শিত হচ্ছে।
   - নন-ক্যাডারের ১৬টি বইয়ে ২০৮টি অধ্যায় ও ২১,৮২৬টি প্রশ্ন প্রদর্শিত হচ্ছে।
   - লিখিত প্যানেলে ১৫৮টি পরীক্ষার কর্তৃত্বভিত্তিক সংকলন ও ৩,০৬০টি প্রশ্ন প্রদর্শিত হচ্ছে।

---

## ৮. চূড়ান্ত স্ট্যাটাস ঘোষণা (Final Declaration)

**ঘোষণা: সম্পন্ন (COMPLETED)**
- તમામ 7টি গেট (G1 থেকে G7) Playwright E2E টেস্টে শতভাগ উত্তীর্ণ (**72 PASSED, 0 FAILED**)।
- স্ট্যাটিক চেকার `tools/check-all.py`-তে সকল ৫টি অডিট শতভাগ উত্তীর্ণ (**0 issues**)।
- কোনো অনুমিত তথ্য বা রেফারেন্স সাইটের কপি নেই; প্রতিটি সংখ্যা ও নীতি সরকারি গেজেট ও ডিস্কের তথ্যের সাথে ১:১ সিঙ্কড।
