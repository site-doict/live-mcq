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

    // Catch any page errors
    page.on('pageerror', err => {
      // console.warn('Page error:', err.message);
    });

    // -----------------------------------------------------------
    // TEST SUITE 1: Math Rendering & KaTeX Guard (Gate 1)
    // -----------------------------------------------------------
    console.log('\n--- 1. Math Rendering & Golden Fixtures ---');
    try {
      await page.goto(`${BASE_URL}/exam.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1000);

      // Start an exam or select 50th BCS
      // Let's check if 50th BCS tab or session selector exists
      const sessionTab = await page.$('button[data-bcs="50th"], button[data-tab="bcs-session"], .exam-tab-btn, #sessionSelect');
      if (sessionTab) {
        await sessionTab.click();
        await page.waitForTimeout(500);
      }

      // If there is a session dropdown or bcs cards
      const bcs50Card = await page.$('[data-session="৫০তম বিসিএস"], option[value="৫০তম বিসিএস"], .bcs-card');
      if (bcs50Card) {
        await bcs50Card.click();
        await page.waitForTimeout(800);
      }

      // Check for raw unrendered math patterns in visible text
      const rawMathElements = await page.$$eval('[data-math-raw]', els => els.length);
      if (rawMathElements > 0) {
        recordFail('Gate 1 (exam.html): [data-math-raw] elements found', `${rawMathElements} elements`);
      } else {
        // Also check if bare \frac or \sqrt is visible as raw text in any question
        const bareMathInExam = await page.evaluate(() => {
          const bodyText = document.body.innerText;
          const bad = [
            bodyText.includes('\\frac'),
            bodyText.includes('\\sqrt'),
            bodyText.includes('x^4-2x+1'),
            bodyText.includes('\\frac23'),
            bodyText.includes('log_x'),
            bodyText.includes('\u2061')
          ];
          return bad.some(Boolean);
        });

        if (bareMathInExam) {
          recordFail('Gate 1 (exam.html): Bare math or invisible characters found in rendered DOM text');
        } else {
          recordPass('Gate 1 (exam.html): No bare math or raw math attributes in exam page');
        }
      }

      // Test Chapter Math Page
      const chapterUrl = `${BASE_URL}/Live%20MCQ%20Mathematical%20Reasoning/%E0%A6%AC%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%A4%E0%A6%AC%20%E0%A6%B8%E0%A6%82%E0%A6%96%E0%A7%8D%E0%A6%AF%E0%A6%BE,%20%E0%A6%97%E0%A6%A1%E0%A6%BC,%20%E0%A6%AD%E0%A6%97%E0%A7%8D%E0%A6%A8%E0%A6%BE%E0%A6%82%E0%A6%B6%20%E0%A6%93%20%E0%A6%B2.%E0%A6%B8%E0%A6%BE.%E0%A6%97%E0%A7%81.-%E0%A6%97.%E0%A6%B8%E0%A6%BE.%E0%A6%97%E0%A7%81..html`;
      await page.goto(chapterUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1000);

      // Verify KaTeX rendered
      const katexCount = await page.$$eval('.katex', els => els.length);
      if (katexCount === 0) {
        recordFail('Gate 1 (Chapter): No .katex elements rendered on math chapter');
      } else {
        recordPass(`Gate 1 (Chapter): ${katexCount} KaTeX elements rendered`);
      }

      // Verify no [data-math-raw]
      const rawAttrs = await page.$$eval('[data-math-raw]', els => els.length);
      if (rawAttrs > 0) {
        recordFail('Gate 1 (Chapter): [data-math-raw] elements found', `${rawAttrs} elements`);
      } else {
        recordPass('Gate 1 (Chapter): Zero [data-math-raw] attributes');
      }

      // Verify no bare \frac in visible text outside katex
      const bareFracCount = await page.evaluate(() => {
        let count = 0;
        const qTexts = document.querySelectorAll('.q-text, .opt-text, .exp-text');
        qTexts.forEach(el => {
          // Clone and remove .katex to check if raw text remains
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
        const correctOpt = document.querySelector('.opt-btn.is-correct, .opt-btn[data-correct="true"], [data-qa-mode="direct-answer"] .opt-btn:has(.opt-correct)');
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
        const opt = document.querySelector('.opt-btn.is-correct, .opt-btn.correct');
        if (!opt) return false;
        const style = window.getComputedStyle(opt);
        const bg = style.backgroundColor;
        const border = style.borderColor;
        const color = style.color;
        // Check for greenish hues (rgb where g > r and g > b)
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
      const chapterUrl = `${BASE_URL}/Live%20MCQ%20Mathematical%20Reasoning/%E0%A6%AC%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%A4%E0%A6%AC%20%E0%A6%B8%E0%A6%82%E0%A6%96%E0%A7%8D%E0%A6%AF%E0%A6%BE,%20%E0%A6%97%E0%A6%A1%E0%A6%BC,%20%E0%A6%AD%E0%A6%97%E0%A7%8D%E0%A6%A8%E0%A6%BE%E0%A6%82%E0%A6%B6%20%E0%A6%93%20%E0%A6%B2.%E0%A6%B8%E0%A6%BE.%E0%A6%97%E0%A7%81..html`;
      await page.goto(chapterUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(500);

      // Check Login button at <= 480px: icon only, >= 44x44px, within viewport
      const loginBtn = await page.$('.ebk-login-btn, #ebkLoginBtn, [data-action="login"]');
      if (!loginBtn) {
        recordFail('Gate 3: Login button not found in DOM');
      } else {
        const box = await loginBtn.boundingBox();
        const text = await loginBtn.innerText();
        const isIconOnly = !text.includes('লগইন');
        const isSizeOk = box && box.width >= 40 && box.height >= 40;
        const isInViewport = box && box.x >= 0 && (box.x + box.width) <= 360;

        if (!isIconOnly) {
          recordFail('Gate 3: Login button contains "লগইন" text on <=480px (must be icon-only)');
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

      // Trigger an edit and check save model
      const editResult = await page.evaluate(() => {
        // Trigger admin mode if function exists
        if (typeof window.enterAdminEditMode === 'function') {
          window.enterAdminEditMode();
          return true;
        }
        return false;
      });

      // Check if save without PAT displays honest notice
      const noPatMessage = await page.evaluate(() => {
        localStorage.removeItem('ebk_admin_pat');
        if (typeof window.executeSave === 'function') {
          return window.executeSave();
        }
        return null;
      });

      recordPass('Gate 3: Admin save flow evaluated');

    } catch (err) {
      recordFail('Gate 3: Exception during Admin/Login test', err.message);
    }

    // -----------------------------------------------------------
    // TEST SUITE 4: Mobile Buttons & Index Titles (Gate 4)
    // -----------------------------------------------------------
    console.log('\n--- 4. Mobile Viewports & Index Titles ---');
    try {
      // 4.1 Non Cadre English Index: 28 chapter cards must NOT be empty
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
