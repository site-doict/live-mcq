# Items Pending Official Verification or Clarification

This document logs specific examinations, syllabi, metadata clarifications, or post-dependent variations investigated during the Portal Redesign.

---

## 1. Non-Cadre Arithmetic vs Algebra Printed Metadata
- **Observed Discrepancy:** The previous index.html card metadata displayed overlapping page numbers: পাটিগণিত (২২৮–৩২৫) and বীজগণিত (৩১৮–৪৪২).
- **Physical Disk Audit Result:**
  - Audited `Non Cadre Arithmetic/` chapter HTML files: The 13 chapters cover up to page 317.
  - Audited `Non Cadre Algebra/` chapter HTML files: The 12 chapters begin from page 318 (Ch 01 begins at p. 318).
  - Therefore, the underlying physical files do NOT have overlapping content; the overlap was strictly a typo in the old landing card description string.
- **Conservative Action:**
  - Removed misleading page range strings from card display.
  - Retained verified exact chapter and question counts: পাটিগণিত (১৩টি অধ্যায় · ৬৪০টি প্রশ্ন) and বীজগণিত (১২টি অধ্যায় · ৭৩৯টি প্রশ্ন).

---

## 2. Inception Year Book (2025-2026) Structural Placement
- **Investigation:** Examined `Inception Year Book 2025-2026/ch-01-bangla-bhasha.html` and other chapter files.
- **Finding:** The book contains 10 chapters and 6,227 questions, all rendered with 4-option multiple-choice quiz cards (`.q-card` with option buttons and `checkAnswer()`). It is 100% MCQ format.
- **Action Taken:**
  - Relocated from the Written panel to the Preliminary stage under a dedicated "অতিরিক্ত রিসোর্স ও বিশেষ প্রশ্নব্যাংক" section as a separate, standard subject card (`#nc-card-16`).
  - Completely unnested from the "নিয়োগ প্রশ্ন সমাধান" card.

---

## 3. Non-Cadre Departmental & Technical Post Variations
- **Issue:** Unlike BCS Cadre (statutory 200 MCQ / 900 Written / 200 Viva structure under BCS Recruitment Rules 2014), PSC Non-Cadre 9th–13th grade examinations vary in total marks and exam stages based on:
  - Recruitment Rules of the requisitioning Ministry or Department.
  - Technical engineering/medical/statistical posts allocate 40–80 marks to professional core subjects.
- **Action Taken:**
  - Standardized the syllabus and marks cards to reflect official general non-cadre guidelines (Prelim 100 marks, Written 200 marks, Viva 50 marks).
  - Added cautionary notes and links to [bpsc.gov.bd](http://www.bpsc.gov.bd).

---

## 4. Cadre Written and Viva Modules
- **Status:** Currently, written solutions in the codebase are contained in `PSC & IBA Written Job Solution` (158 exams, 3,060 questions). Direct BCS Cadre 900-mark written questions will be added in subsequent expansions. Until then, Cadre Written and Viva display non-clickable "শীঘ্রই আসছে" (Coming Soon) placeholder cards with `aria-disabled="true"` without dead links.
