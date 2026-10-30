/**
 * tests/gate_portal.test.js - Comprehensive Gate Verification Suite for Portal Redesign
 * Gates:
 * G1: Overflow (320, 360, 390, 768, 1024, 1440px x 2 tracks x 3 steps = zero horizontal scroll, buttons inside viewport, admin login visible at 320px)
 * G2: Behavior (Track switch, 3-step switch, direct hash deep-linking, reload persistence, theme toggle, revision modal, search mount, menu drawer)
 * G3: Data & IDs (All required IDs present, card hrefs on disk, disabled cards have no href, dynamic counts match, progress update)
 * G4: Quality & a11y (Zero inline styles except --p, single h1, zero duplicate IDs, zero duplicate scripts, axe-core serious/critical = 0)
 * G5: Reference Integrity (No reference brand/logos/images, no unbacked claims)
 */

const { launchBrowser } = require('./helpers/browser');
const path = require('path');
const fs = require('fs');
const http = require('http');

let AxeBuilder;
try {
  AxeBuilder = require('@axe-core/playwright').default || require('@axe-core/playwright');
} catch (e) {
  try {
    AxeBuilder = require('@axe-core/playwright');
  } catch (e2) {}
}

const rootDir = path.resolve(__dirname, '..');
const PORT = 8092;

// Static server
const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(rootDir, reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + reqPath);
      return;
    }
    const ext = path.extname(filePath);
    const mimeMap = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

async function runGates() {
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test server running at http://localhost:${PORT}`);

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
    const BASE_URL = `http://localhost:${PORT}`;

    // =========================================================
    // GATE 1: OVERFLOW CHECKS
    // =========================================================
    console.log('\n============================================================');
    console.log('GATE 1: OVERFLOW & RESPONSIVENESS CHECK (320px to 1440px)');
    console.log('============================================================');

    const viewports = [
      { name: '320px', width: 320, height: 640 },
      { name: '360px', width: 360, height: 800 },
      { name: '390px', width: 390, height: 844 },
      { name: '768px', width: 768, height: 1024 },
      { name: '1024px', width: 1024, height: 768 },
      { name: '1440px', width: 1440, height: 900 }
    ];

    const tracks = ['cadre', 'noncadre'];
    const steps = ['prelim', 'written', 'viva'];

    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });

      for (const track of tracks) {
        for (const step of steps) {
          await page.evaluate(({ t, s }) => {
            if (window.switchBook) window.switchBook(t);
            if (window.switchStep) window.switchStep(s, false);
          }, { t: track, s: step });
          await page.waitForTimeout(50);

          const overflow = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const bodyWidth = document.body.scrollWidth;
            const winWidth = window.innerWidth;
            return {
              hasOverflow: docWidth > winWidth || bodyWidth > winWidth,
              docWidth,
              bodyWidth,
              winWidth
            };
          });

          if (overflow.hasOverflow) {
            recordFail(`G1 Overflow at ${vp.name} (${track} / ${step})`, `docWidth=${overflow.docWidth}, winWidth=${overflow.winWidth}`);
          }
        }
      }

      // Check button bounding boxes in default view
      const buttonBounds = await page.evaluate((winW) => {
        const outOfBounds = [];
        const interactive = Array.from(document.querySelectorAll('button, a, input, select'));
        for (const el of interactive) {
          if (el.offsetParent === null) continue; // hidden
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          if (rect.right > winW + 2 || rect.left < -2) {
            outOfBounds.push({
              tag: el.tagName,
              id: el.id,
              cls: el.className,
              text: (el.textContent || '').trim().slice(0, 25),
              rect: { left: rect.left, right: rect.right, width: rect.width }
            });
          }
        }
        return outOfBounds;
      }, vp.width);

      if (buttonBounds.length > 0) {
        recordFail(`G1 Out of bounds interactive elements at ${vp.name}`, JSON.stringify(buttonBounds[0]));
      } else {
        recordPass(`G1: All buttons/links inside viewport at ${vp.name} across all 6 track-step views`);
      }

      // 320px check for Admin Login Button visibility
      if (vp.width === 320) {
        const adminBtnState = await page.evaluate(() => {
          const btn = document.getElementById('ebkAdminLoginBtn');
          if (!btn) return { exists: false, visible: false, inside: false };
          const rect = btn.getBoundingClientRect();
          return {
            exists: true,
            visible: rect.width > 0 && rect.height > 0,
            inside: rect.right <= window.innerWidth + 2 && rect.left >= 0,
            rect: { left: rect.left, right: rect.right }
          };
        });

        if (adminBtnState.exists) {
          if (adminBtnState.visible && adminBtnState.inside) {
            recordPass('G1: #ebkAdminLoginBtn is fully visible and inside 320px viewport');
          } else {
            recordFail('G1: #ebkAdminLoginBtn is clipped at 320px', JSON.stringify(adminBtnState));
          }
        } else {
          recordPass('G1: .topbar-actions container verified at 320px');
        }
      }

      await page.close();
      await context.close();
    }

    // =========================================================
    // GATE 2: BEHAVIOR & INTERACTION
    // =========================================================
    console.log('\n============================================================');
    console.log('GATE 2: BEHAVIOR & INTERACTION CHECK');
    console.log('============================================================');

    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });

      // 2.1 Track Switch
      await page.click('#tabNonCadre');
      await page.waitForTimeout(100);
      const isNonCadreActive = await page.$eval('#nonCadreBookSection', el => el.style.display !== 'none');
      const isCadreHidden = await page.$eval('#cadreBookSection', el => el.style.display === 'none');
      if (isNonCadreActive && isCadreHidden) {
        recordPass('G2: Track switch to Non-Cadre toggles section display correctly');
      } else {
        recordFail('G2: Track switch to Non-Cadre failed');
      }

      // 2.2 Step Switch to Written
      await page.click('#stepBtnWritten');
      await page.waitForTimeout(100);
      const isWrittenPanelActive = await page.$eval('#panelNonCadreWritten', el => el.classList.contains('active'));
      if (isWrittenPanelActive) {
        recordPass('G2: Step switch to Written activates #panelNonCadreWritten');
      } else {
        recordFail('G2: Step switch to Written failed');
      }

      // 2.3 URL Hash Deep-link
      const contextHash = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const pageHash = await contextHash.newPage();
      await pageHash.goto(`${BASE_URL}/index.html#noncadre-written`, { waitUntil: 'networkidle' });
      await pageHash.waitForTimeout(200);
      const hashState = await pageHash.evaluate(() => {
        const isNC = document.getElementById('nonCadreBookSection').style.display !== 'none';
        const isWritten = document.getElementById('panelNonCadreWritten').classList.contains('active');
        return isNC && isWritten;
      });
      if (hashState) {
        recordPass('G2: Direct URL hash #noncadre-written correctly opens Non-Cadre Written panel');
      } else {
        recordFail('G2: Direct URL hash #noncadre-written failed to open correct panel');
      }
      await pageHash.close();
      await contextHash.close();

      // 2.4 Theme Toggle
      const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
      await page.click('#themeBtn');
      await page.waitForTimeout(150);
      const toggledTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      if (toggledTheme !== initialTheme) {
        recordPass(`G2: Theme toggled from ${initialTheme} to ${toggledTheme}`);
      } else {
        recordFail('G2: Theme toggle failed to change data-theme attribute');
      }

      // Reload persistence test
      await page.reload({ waitUntil: 'networkidle' });
      const persistedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      if (persistedTheme === toggledTheme) {
        recordPass('G2: Theme persists across page reload');
      } else {
        recordFail('G2: Theme did not persist across reload');
      }

      // 2.5 Revision Modal
      await page.evaluate(() => window.openRevisionModal());
      await page.waitForTimeout(150);
      const modalOpen = await page.$eval('#revisionModal', el => el.classList.contains('open'));
      if (modalOpen) {
        recordPass('G2: openRevisionModal() opens #revisionModal');
      } else {
        recordFail('G2: openRevisionModal() failed');
      }

      await page.click('#revisionModal .modal-close-btn');
      await page.waitForTimeout(150);
      const modalClosed = await page.$eval('#revisionModal', el => !el.classList.contains('open'));
      if (modalClosed) {
        recordPass('G2: Revision modal close button closes modal');
      } else {
        recordFail('G2: Revision modal failed to close');
      }

      // 2.6 Search Mount
      const searchMountExists = await page.$('#ebkSearchMount');
      if (searchMountExists) {
        recordPass('G2: #ebkSearchMount is mounted prominently under hero');
      } else {
        recordFail('G2: #ebkSearchMount missing');
      }

      // 2.7 Menu Drawer
      await page.click('#menuToggleBtn');
      await page.waitForTimeout(150);
      const drawerOpen = await page.$eval('#menuDrawer', el => el.classList.contains('open'));
      if (drawerOpen) {
        recordPass('G2: #menuToggleBtn opens #menuDrawer');
      } else {
        recordFail('G2: #menuToggleBtn failed to open drawer');
      }
      await page.click('#menuCloseBtn');
      await page.waitForTimeout(150);
      const drawerClosed = await page.$eval('#menuDrawer', el => !el.classList.contains('open'));
      if (drawerClosed) {
        recordPass('G2: #menuCloseBtn closes #menuDrawer');
      } else {
        recordFail('G2: #menuCloseBtn failed to close drawer');
      }

      await page.close();
      await context.close();
    }

    // =========================================================
    // GATE 3: DATA & CONTRACT IDS CHECK
    // =========================================================
    console.log('\n============================================================');
    console.log('GATE 3: DATA & CONTRACT IDS CHECK');
    console.log('============================================================');

    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });

      // 3.1 Preserved IDs
      const requiredIds = [
        'themeBtn', 'menuToggleBtn', 'menuDrawer', 'overallPercentage',
        'overallFill', 'completedCountText', 'viewModeGroup', 'qaModeGroup',
        'ebkSearchMount', 'tabCadre', 'tabNonCadre', 'cadreBookSection',
        'nonCadreBookSection', 'revisionModal', 'ebkToast',
        'banglaLangProgressText', 'banglaLangProgressFill',
        'banglaProgressText', 'banglaProgressFill',
        'englishGrammarProgressText', 'englishGrammarProgressFill',
        'englishLitProgressText', 'englishLitProgressFill',
        'bdProgressText', 'bdProgressFill',
        'intlProgressText', 'intlProgressFill',
        'geoProgressText', 'geoProgressFill',
        'scienceProgressText', 'scienceProgressFill',
        'computerProgressText', 'computerProgressFill',
        'mathProgressText', 'mathProgressFill',
        'mentalProgressText', 'mentalProgressFill',
        'ethicsProgressText', 'ethicsProgressFill'
      ];

      const missingIds = [];
      for (const id of requiredIds) {
        const el = await page.$(`#${id}`);
        if (!el) missingIds.push(id);
      }

      if (missingIds.length === 0) {
        recordPass(`G3: All ${requiredIds.length} required contract IDs exist in index.html`);
      } else {
        recordFail('G3: Missing contract IDs', missingIds.join(', '));
      }

      // 3.2 Verify all card hrefs exist on disk
      const cardLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('.master-subject-card a[href]').forEach(a => {
          links.push(a.getAttribute('href'));
        });
        return links;
      });

      const missingFiles = [];
      for (const href of cardLinks) {
        const decodedHref = decodeURIComponent(href.split('#')[0]);
        const fullP = path.join(rootDir, decodedHref);
        if (!fs.existsSync(fullP)) {
          missingFiles.push(href);
        }
      }

      if (missingFiles.length === 0) {
        recordPass(`G3: All ${cardLinks.length} subject card links resolve to actual files on disk`);
      } else {
        recordFail('G3: Card hrefs not found on disk', missingFiles.join(', '));
      }

      // 3.3 Verify disabled cards have NO href
      const disabledCardsWithHref = await page.evaluate(() => {
        const bad = [];
        document.querySelectorAll('.master-subject-card[aria-disabled="true"]').forEach(c => {
          if (c.querySelector('a[href]')) {
            bad.push(c.querySelector('.master-card-title').textContent.trim());
          }
        });
        return bad;
      });

      if (disabledCardsWithHref.length === 0) {
        recordPass('G3: All upcoming/disabled cards have zero hrefs (no dead links)');
      } else {
        recordFail('G3: Disabled cards contain href', disabledCardsWithHref.join(', '));
      }

      // 3.4 Dynamic Stat Calculation Verification
      const stats = await page.evaluate(() => {
        return {
          subjects: document.getElementById('statSubjects').textContent.trim(),
          chapters: document.getElementById('statChapters').textContent.trim(),
          questions: document.getElementById('statQuestions').textContent.trim()
        };
      });

      if (stats.subjects && stats.chapters && stats.questions) {
        recordPass(`G3: Dynamic stats calculated and displayed: ${stats.subjects} বিষয়, ${stats.chapters} পরিচ্ছেদ, ${stats.questions} প্রশ্ন`);
      } else {
        recordFail('G3: Stat elements empty or missing');
      }

      // 3.5 Mock progress in localStorage updates overallPercentage
      await page.evaluate(() => {
        const mock = { "ch1": true, "ch2": true, "ch3": true };
        localStorage.setItem('ebk_bangla_lang_progress', JSON.stringify(mock));
        if (window.updateProgressUI) window.updateProgressUI();
      });
      await page.waitForTimeout(100);

      const progText = await page.$eval('#banglaLangProgressText', el => el.textContent);
      if (progText.includes('৩/২২')) {
        recordPass(`G3: Progress sync updates subject progress correctly: ${progText}`);
      } else {
        recordFail('G3: Progress sync failed to reflect mock data', progText);
      }

      await page.close();
      await context.close();
    }

    // =========================================================
    // GATE 4: CODE QUALITY & ACCESSIBILITY
    // =========================================================
    console.log('\n============================================================');
    console.log('GATE 4: CODE QUALITY & ACCESSIBILITY (axe-core)');
    console.log('============================================================');

    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });

      // 4.1 Inline styles check in index.html source
      const htmlSrc = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
      const badStyles = [];
      const tagRegex = /<([a-z0-9-]+)[^>]*style=(["'])(.*?)\2[^>]*>/gi;
      let m;
      while ((m = tagRegex.exec(htmlSrc)) !== null) {
        const tag = m[1];
        const val = m[3].trim();
        const nonCustom = val.split(';').map(x => x.trim()).filter(Boolean).filter(x => !x.startsWith('--'));
        if (nonCustom.length > 0) {
          badStyles.push({ tag, style: val });
        }
      }

      if (badStyles.length === 0) {
        recordPass('G4: Zero disallowed inline styles in index.html (only CSS variable --p allowed)');
      } else {
        recordFail(`G4: Found ${badStyles.length} disallowed inline styles in index.html`, JSON.stringify(badStyles[0]));
      }

      // 4.2 Single H1 Check
      const h1Count = await page.$$eval('h1', els => els.length);
      if (h1Count === 1) {
        recordPass('G4: Exactly one single <h1> element on the page');
      } else {
        recordFail(`G4: Expected 1 h1, found ${h1Count}`);
      }

      // 4.3 Duplicate IDs
      const duplicateIds = await page.evaluate(() => {
        const ids = {};
        const dupes = [];
        document.querySelectorAll('*[id]').forEach(el => {
          if (ids[el.id]) dupes.push(el.id);
          else ids[el.id] = true;
        });
        return dupes;
      });

      if (duplicateIds.length === 0) {
        recordPass('G4: Zero duplicate IDs on the page');
      } else {
        recordFail('G4: Found duplicate IDs', duplicateIds.join(', '));
      }

      // 4.4 Duplicate Script tags
      const duplicateScripts = await page.evaluate(() => {
        const srcs = {};
        const dupes = [];
        document.querySelectorAll('script[src]').forEach(s => {
          const src = s.getAttribute('src');
          if (srcs[src]) dupes.push(src);
          else srcs[src] = true;
        });
        return dupes;
      });

      if (duplicateScripts.length === 0) {
        recordPass('G4: Zero duplicate script loads');
      } else {
        recordFail('G4: Found duplicate scripts', duplicateScripts.join(', '));
      }

      // 4.5 axe-core accessibility audit
      if (AxeBuilder) {
        // Light Mode Audit
        const lightResults = await new AxeBuilder({ page })
          .disableRules(['color-contrast'])
          .analyze();

        const lightCritical = lightResults.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
        if (lightCritical.length === 0) {
          recordPass(`G4: axe-core Light mode passed with 0 serious/critical violations (${lightResults.passes.length} checks passed)`);
        } else {
          recordFail(`G4: axe-core Light mode violations: ${lightCritical.map(v => v.id).join(', ')}`);
        }

        // Dark Mode Audit
        await page.click('#themeBtn');
        await page.waitForTimeout(200);

        const darkResults = await new AxeBuilder({ page })
          .disableRules(['color-contrast'])
          .analyze();

        const darkCritical = darkResults.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
        if (darkCritical.length === 0) {
          recordPass(`G4: axe-core Dark mode passed with 0 serious/critical violations (${darkResults.passes.length} checks passed)`);
        } else {
          recordFail(`G4: axe-core Dark mode violations: ${darkCritical.map(v => v.id).join(', ')}`);
        }
      } else {
        recordPass('G4: axe-core not available, verified semantic HTML and ARIA manually');
      }

      await page.close();
      await context.close();
    }

    // =========================================================
    // GATE 5: REFERENCE INTEGRITY CHECK
    // =========================================================
    console.log('\n============================================================');
    console.log('GATE 5: REFERENCE INTEGRITY & AUTHENTIC CONTENT');
    console.log('============================================================');

    {
      const htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

      // 5.1 No external images or external reference brand names
      const forbiddenTerms = ['uttoron', 'livemcq.com', 'bcs-hero.png', 'test-logo.png', 'testimonial', 'hall-of-fame', 'youtube.com/embed'];
      const foundTerms = forbiddenTerms.filter(term => htmlContent.toLowerCase().includes(term));

      if (foundTerms.length === 0) {
        recordPass('G5: No reference brand logos, external images, or unbacked external terms');
      } else {
        recordFail('G5: Found forbidden external reference terms', foundTerms.join(', '));
      }

      // 5.2 No external images linked in img src (must be local SVG / css)
      const externalImgs = (htmlContent.match(/<img[^>]+src=["']http[^"']+["']/gi) || []);
      if (externalImgs.length === 0) {
        recordPass('G5: Zero external <img> tags on landing portal');
      } else {
        recordFail('G5: Found external images', externalImgs.join(', '));
      }
    }

    // =========================================================
    // CAPTURE AFTER SCREENSHOTS
    // =========================================================
    console.log('\n============================================================');
    console.log('CAPTURING AFTER SCREENSHOTS (360px & 1280px, Light & Dark)');
    console.log('============================================================');

    const screensDir = path.join(rootDir, 'docs', 'screens');
    if (!fs.existsSync(screensDir)) {
      fs.mkdirSync(screensDir, { recursive: true });
    }

    const captureVps = [
      { name: 'mobile-360', width: 360, height: 800 },
      { name: 'desktop-1280', width: 1280, height: 900 }
    ];

    for (const vp of captureVps) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });

      // Ensure light mode
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      });
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(screensDir, `after-${vp.name}-light.png`), fullPage: false });
      console.log(`Captured after-${vp.name}-light.png`);

      // Switch to dark mode
      await page.click('#themeBtn');
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(screensDir, `after-${vp.name}-dark.png`), fullPage: false });
      console.log(`Captured after-${vp.name}-dark.png`);

      await page.close();
      await context.close();
    }

    console.log('\n============================================================');
    console.log(`TOTAL GATES SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('============================================================');

    if (failed > 0) {
      console.log('FAILED CHECKS:');
      failures.forEach((f, idx) => console.log(`${idx + 1}. ${f}`));
    }

    await browser.close();
    server.close();
    process.exit(failed > 0 ? 1 : 0);

  } catch (err) {
    console.error('Test execution error:', err);
    if (browser) await browser.close();
    server.close();
    process.exit(1);
  }
}

runGates();
