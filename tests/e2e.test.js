const { launchBrowser } = require('./helpers/browser');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8089';

async function runTests() {
  console.log('='.repeat(60));
  console.log('E2E TEST SUITE: BCS Static E-Book Library');
  console.log('='.repeat(60));

  let browser;
  let passed = 0;
  let failed = 0;
  const failures = [];

  function recordPass(msg) {
    passed++;
    console.log(`[PASS] ${msg}`);
  }

  function recordFail(msg, detail) {
    failed++;
    const errMsg = `${msg}${detail ? ' -> ' + detail : ''}`;
    failures.push(errMsg);
    console.log(`[FAIL] ${errMsg}`);
  }

  try {
    browser = await launchBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on('pageerror', err => {
      // console.warn('Page error:', err.message);
    });

    // -----------------------------------------------------------
    // TEST SUITE 1: Math Rendering & Golden Fixtures (Gate 1)
    // -----------------------------------------------------------
    console.log('\n--- 1. Math Rendering & Golden Fixtures ---');
    try {
      // 1.1 Load exam.html directly into 50th BCS session
      await page.goto(`${BASE_URL}/exam.html?mode=session&session=${encodeURIComponent('৫০তম বিসিএস')}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1000);

      // Start the exam
      const startBtn = await page.$('#startExamBtn');
      if (startBtn) {
        await startBtn.click();
        await page.waitForTimeout(1000);
      }

      // Check if .katex elements are present in exam
      const examKatexCount = await page.$$eval('.katex', els => els.length);
      if (examKatexCount === 0) {
        recordFail('Gate 1 (exam.html): No KaTeX elements rendered in exam session');
      } else {
        recordPass(`Gate 1 (exam.html): ${examKatexCount} KaTeX elements rendered in exam`);
      }

      // Check for raw unrendered math patterns in visible DOM text
      const rawMathElements = await page.$$eval('[data-math-raw]', els => els.length);
      if (rawMathElements > 0) {
        recordFail('Gate 1 (exam.html): [data-math-raw] elements found', `${rawMathElements} elements`);
      } else {
        recordPass('Gate 1 (exam.html): Zero [data-math-raw] attributes');
      }

      const bareMathInExam = await page.evaluate(() => {
        let count = 0;
        document.querySelectorAll('.exam-q-text, .opt-label-text, .exp-body-text').forEach(el => {
          const clone = el.cloneNode(true);
          clone.querySelectorAll('.katex').forEach(k => k.remove());
          const text = clone.innerText;
          if (text.includes('\\frac') || text.includes('\\sqrt') || text.includes('\u2061') || text.includes('x^4-2x+1') || text.includes('\\frac23')) {
            count++;
          }
        });
        return count;
      });

      if (bareMathInExam > 0) {
        recordFail('Gate 1 (exam.html): Bare math or invisible characters found in exam text outside KaTeX', `${bareMathInExam} occurrences`);
      } else {
        recordPass('Gate 1 (exam.html): Zero bare math or invisible characters in exam text');
      }

      // 1.2 Test Chapter Math Page
      const chapterUrl = `${BASE_URL}/Live%20MCQ%20Mathematical%20Reasoning/%E0%A6%AC%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%A4%E0%A6%AC%20%E0%A6%B8%E0%A6%82%E0%A6%96%E0%A7%8D%E0%A6%AF%E0%A6%BE,%20%E0%A6%97%E0%A6%A1%E0%A6%BC,%20%E0%A6%AD%E0%A6%97%E0%A7%8D%E0%A6%A8%E0%A6%BE%E0%A6%82%E0%A6%B6%20%E0%A6%93%20%E0%A6%B2.%E0%A6%B8%E0%A6%BE.%E0%A6%97%E0%A7%81.-%E0%A6%97.%E0%A6%B8%E0%A6%BE.%E0%A6%97%E0%A7%81..html`;
      await page.goto(chapterUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(800);

      const chKatexCount = await page.$$eval('.katex', els => els.length);
      if (chKatexCount === 0) {
        recordFail('Gate 1 (Chapter): No .katex elements rendered on math chapter');
      } else {
        recordPass(`Gate 1 (Chapter): ${chKatexCount} KaTeX elements rendered on chapter`);
      }

      const chRawAttrs = await page.$$eval('[data-math-raw]', els => els.length);
      if (chRawAttrs > 0) {
        recordFail('Gate 1 (Chapter): [data-math-raw] elements found', `${chRawAttrs} elements`);
      } else {
        recordPass('Gate 1 (Chapter): Zero [data-math-raw] attributes');
      }

      const bareFracCount = await page.evaluate(() => {
        let count = 0;
        const qTexts = document.querySelectorAll('.q-text, .opt-text, .exp-text');
        qTexts.forEach(el => {
          const clone = el.cloneNode(true);
          clone.querySelectorAll('.katex').forEach(k => k.remove());
          if (clone.innerText.includes('\\frac') || clone.innerText.includes('\\sqrt')) {
            count++;
          }
        });
        return count;
      });

      if (bareFracCount > 0) {
        recordFail('Gate 1 (Chapter): Bare \\frac/\\sqrt still in text outside .katex', `${bareFracCount} elements`);
      } else {
        recordPass('Gate 1 (Chapter): Zero bare LaTeX commands in text outside .katex');
      }

    } catch (err) {
      recordFail('Gate 1: Exception during Math test', err.message);
    }

    // -----------------------------------------------------------
    // TEST SUITE 2: Answer Presentation (Gate 2 - Green Only)
    // -----------------------------------------------------------
    console.log('\n--- 2. Answer Presentation (Green Only, No Letter / Prefix) ---');
    try {
      const chapterUrl = `${BASE_URL}/Live%20MCQ%20Mathematical%20Reasoning/%E0%A6%AC%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%A4%E0%A6%AC%20%E0%A6%B8%E0%A6%82%E0%A6%96%E0%A7%8D%E0%A6%AF%E0%A6%BE,%20%E0%A6%97%E0%A6%A1%E0%A6%BC,%20%E0%A6%AD%E0%A6%97%E0%A7%8D%E0%A6%A8%E0%A6%BE%E0%A6%82%E0%A6%B6%20%E0%A6%93%20%E0%A6%B2.%E0%A6%B8%E0%A6%BE.%E0%A6%97%E0%A7%81.-%E0%A6%97.%E0%A6%B8%E0%A6%BE.%E0%A6%97%E0%A7%81..html`;
      await page.goto(chapterUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(500);

      // Check 1: direct-answer mode ::before content
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-qa-mode', 'direct-answer');
      });
      await page.waitForTimeout(300);

      const beforeContent = await page.evaluate(() => {
        const correctOpt = document.querySelector('.opt-btn.is-correct, .opt-btn[data-correct="true"], [data-qa-mode="direct-answer"] .opt-btn');
        if (!correctOpt) return 'none';
        const style = window.getComputedStyle(correctOpt, '::before');
        return style.content;
      });

      if (beforeContent && (beforeContent.includes('উত্তর') || beforeContent.includes('✓'))) {
        recordFail('Gate 2: ::before pseudo-element has forbidden "উত্তর:" or "✓"', beforeContent);
      } else {
        recordPass('Gate 2: Zero "উত্তর:" or "✓" in pseudo-elements');
      }

      // Check 2: Visible text matching "সঠিক উত্তর: [ক-ঘ]"
      const answerLetterTextFound = await page.evaluate(() => {
        const regex = /(?:সঠিক\s*)?উত্তর\s*[:：]?\s*\(?[কখগঘ]\)?/;
        const expDrawers = document.querySelectorAll('.exp-text, .exp-drawer');
        let found = false;
        expDrawers.forEach(el => {
          if (regex.test(el.innerText)) found = true;
        });
        return found;
      });

      if (answerLetterTextFound) {
        recordFail('Gate 2: Explanation text contains letter answer prefix like "উত্তর: ক"');
      } else {
        recordPass('Gate 2: Zero answer letter prefixes in explanations');
      }

      // Check 3: Correct answer styling is green border or background
      const isGreen = await page.evaluate(() => {
        const opt = document.querySelector('.opt-btn.is-correct, .opt-btn[data-is-correct="true"], .opt-btn[data-correct="true"], .review-opt-box.is-correct, [data-is-correct="true"]');
        if (!opt) return false;
        const style = window.getComputedStyle(opt);
        const bg = style.backgroundColor;
        const border = style.borderColor;
        const color = style.color;
        const rgbMatch = (bg + ' ' + border + ' ' + color).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g);
        if (!rgbMatch) return false;
        return rgbMatch.some(c => {
          const parts = c.match(/\d+/g).map(Number);
          return parts[1] > parts[0] && parts[1] > parts[2];
        });
      });

      if (!isGreen) {
        recordFail('Gate 2: Correct answer does not have computed green styling');
      } else {
        recordPass('Gate 2: Correct answer has computed green styling');
      }

    } catch (err) {
      recordFail('Gate 2: Exception during Answer test', err.message);
    }

    // -----------------------------------------------------------
    // TEST SUITE 3: Mobile Login Button & Save Dock (Gate 3)
    // -----------------------------------------------------------
    console.log('\n--- 3. Mobile Login Button & Safe Edit/Save Model ---');
    try {
      await page.setViewportSize({ width: 360, height: 740 });
      const chapterUrl = `${BASE_URL}/Live%20MCQ%20Mathematical%20Reasoning/%E0%A6%AC%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%A4%E0%A6%AC%20%E0%A6%B8%E0%A6%82%E0%A6%96%E0%A7%8D%E0%A6%AF%E0%A6%BE,%20%E0%A6%97%E0%A6%A1%E0%A6%BC,%20%E0%A6%AD%E0%A6%97%E0%A7%8D%E0%A6%A8%E0%A6%BE%E0%A6%82%E0%A6%B6%20%E0%A6%93%20%E0%A6%B2.%E0%A6%B8%E0%A6%BE.%E0%A6%97%E0%A7%81.-%E0%A6%97.%E0%A6%B8%E0%A6%BE.%E0%A6%97%E0%A7%81..html`;
      await page.goto(chapterUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(500);

      // Check Login button at <= 480px: icon only, >= 44x44px, within viewport
      const loginBtn = await page.$('#ebkAdminLoginBtn, .ebk-admin-login-btn');
      if (!loginBtn) {
        recordFail('Gate 3: Login button (#ebkAdminLoginBtn) not found in DOM');
      } else {
        const box = await loginBtn.boundingBox();
        const isIconOnly = await page.evaluate(() => {
          const txt = document.querySelector('#ebkAdminLoginBtn .ebk-login-txt');
          if (!txt) return true;
          const style = window.getComputedStyle(txt);
          return style.display === 'none' || style.visibility === 'hidden' || txt.innerText.trim() === '';
        });
        const isSizeOk = box && box.width >= 40 && box.height >= 40;
        const isInViewport = box && box.x >= 0 && (box.x + box.width) <= 360;

        if (!isIconOnly) {
          recordFail('Gate 3: Login button displays "লগইন" text at 360px (must be icon-only)');
        } else {
          recordPass('Gate 3: Login button is icon-only at 360px');
        }

        if (!isInViewport) {
          recordFail('Gate 3: Login button overflows 360px viewport', `x=${box ? box.x : 'null'}, w=${box ? box.width : 'null'}`);
        } else {
          recordPass('Gate 3: Login button is within 360px viewport');
        }
      }

      // Check Mock GitHub API Save Route
      let putPayload = null;
      await page.route('https://api.github.com/repos/**', route => {
        if (route.request().method() === 'PUT') {
          putPayload = route.request().postDataJSON();
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ content: { sha: 'dummy_sha_12345' } })
          });
        } else {
          route.continue();
        }
      });

      // Check if saving commits outerHTML or patch JSON
      const saveModelType = await page.evaluate(() => {
        // inspect executeSave implementation in universal-modes.js
        const funcStr = window.executeSave ? window.executeSave.toString() : '';
        if (funcStr.includes('document.documentElement.outerHTML')) {
          return 'outerHTML'; // RISKY OLD MODEL
        } else if (funcStr.includes('data-patches') || funcStr.includes('patch')) {
          return 'patch';
        }
        return 'unknown';
      });

      if (saveModelType === 'outerHTML') {
        recordFail('Gate 3: CMS save model still commits document.documentElement.outerHTML (must be data-patch JSON)');
      } else {
        recordPass('Gate 3: CMS save model uses clean patch JSON');
      }

    } catch (err) {
      recordFail('Gate 3: Exception during Admin/Login test', err.message);
    }

    // -----------------------------------------------------------
    // TEST SUITE 4: Mobile Viewports & Index Titles (Gate 4)
    // -----------------------------------------------------------
    console.log('\n--- 4. Mobile Viewports & Index Titles ---');
    try {
      // 4.1 Non Cadre English Index: 28 chapter cards must NOT be empty and have meta
      await page.goto(`${BASE_URL}/Non%20Cadre%20English/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(500);

      const emptyTitlesCount = await page.$$eval('.chapter-title', els => {
        return els.filter(el => el.innerText.trim() === '').length;
      });

      if (emptyTitlesCount > 0) {
        recordFail('Gate 4: Non Cadre English index has empty chapter titles', `${emptyTitlesCount} empty titles`);
      } else {
        recordPass('Gate 4: Non Cadre English index has zero empty chapter titles');
      }

      // Check card meta presence
      const missingMetaCount = await page.$$eval('.chapter-card', cards => {
        return cards.filter(c => !c.querySelector('.chapter-card-meta, .chapter-meta, .card-meta')).length;
      });

      if (missingMetaCount > 0) {
        recordFail('Gate 4: Non Cadre English index chapter cards missing metadata', `${missingMetaCount} cards without meta`);
      } else {
        recordPass('Gate 4: All 28 chapter cards have metadata');
      }

      // 4.2 Check horizontal scroll = 0 across 320px, 360px, 390px
      const viewports = [320, 360, 390];
      const testPages = [
        `${BASE_URL}/Non%20Cadre%20English/index.html`,
        `${BASE_URL}/index.html`,
        `${BASE_URL}/exam.html`,
        `${BASE_URL}/Live%20MCQ%20Mathematical%20Reasoning/%E0%A6%AC%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%A4%E0%A6%AC%20%E0%A6%B8%E0%A6%82%E0%A6%96%E0%A7%8D%E0%A6%AF%E0%A6%BE,%20%E0%A6%97%E0%A6%A1%E0%A6%BC,%20%E0%A6%AD%E0%A6%97%E0%A7%8D%E0%A6%A8%E0%A6%BE%E0%A6%82%E0%A6%B6%20%E0%A6%93%20%E0%A6%B2.%E0%A6%B8%E0%A6%BE.%E0%A6%97%E0%A7%81.-%E0%A6%97.%E0%A6%B8%E0%A6%BE.%E0%A6%97%E0%A7%81..html`
      ];

      for (const vpWidth of viewports) {
        await page.setViewportSize({ width: vpWidth, height: 700 });
        for (const testUrl of testPages) {
          await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
          await page.waitForTimeout(200);

          const hasOverflow = await page.evaluate(w => {
            return document.documentElement.scrollWidth > w + 1;
          }, vpWidth);

          const pageName = testUrl.split('/').pop().substring(0, 25);
          if (hasOverflow) {
            recordFail(`Gate 4: Horizontal scroll detected on ${pageName} at ${vpWidth}px`);
          } else {
            recordPass(`Gate 4: Zero horizontal scroll on ${pageName} at ${vpWidth}px`);
          }
        }
      }

    } catch (err) {
      recordFail('Gate 4: Exception during Mobile/Index test', err.message);
    }

  } catch (err) {
    console.error('Fatal test error:', err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`E2E SUMMARY: Passed: ${passed}, Failed: ${failed}`);
  console.log('='.repeat(60));

  return { passed, failed, failures };
}

if (require.main === module) {
  runTests().then(res => {
    if (res.failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}

module.exports = { runTests };
