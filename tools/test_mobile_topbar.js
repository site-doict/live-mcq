const { chromium } = require('playwright');
const path = require('path');

const viewports = [
  { width: 320, height: 600, name: '320px (iPhone SE 1st / Ultra Small)' },
  { width: 360, height: 740, name: '360px (Galaxy A12/A20)' },
  { width: 390, height: 844, name: '390px (iPhone 13/14/15)' },
  { width: 412, height: 915, name: '412px (Pixel / Galaxy S21+)' }
];

const testPages = [
  'index.html',
  'exam.html',
  'Non Cadre English/index.html',
  'Live MCQ Bangla Literature/আধুনিক যুগের অন্যান্য লেখক ও তাদের সাহিত্যকর্ম.html',
  'Non Cadre English/ch-01-parts-of-speech-noun.html',
  'Live MCQ Mathematical Reasoning/অনুপাত, সমানুপাত ও অংশীদারি কারবার.html'
];

async function runTest() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\PC User\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe'
  });
  console.log('Testing Mobile Topbars across viewports...\n');

  for (const pageRel of testPages) {
    const fullPath = 'file://' + path.resolve(__dirname, '..', pageRel).replace(/\\/g, '/');
    console.log(`========================================`);
    console.log(`PAGE: ${pageRel}`);

    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      try {
        await page.goto(fullPath, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(500);

        // Check horizontal scroll on page
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        const hasHorizontalScroll = scrollWidth > clientWidth;

        // Check login button existence & visibility
        const loginBtnInfo = await page.evaluate(() => {
          const btn = document.getElementById('ebkAdminLoginBtn');
          if (!btn) return { exists: false };
          const rect = btn.getBoundingClientRect();
          const style = window.getComputedStyle(btn);
          const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
          return {
            exists: true,
            visible: isVisible,
            rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height },
            parentClass: btn.parentElement ? btn.parentElement.className : 'null',
            isFloating: btn.classList.contains('ebk-admin-floating-btn')
          };
        });

        // Check topbar overflow
        const topbarInfo = await page.evaluate(() => {
          const tb = document.querySelector('.topbar, .ebk-topbar, header, .nav-bar');
          if (!tb) return { exists: false };
          const rect = tb.getBoundingClientRect();
          const items = Array.from(tb.querySelectorAll('button, a, select, input, .topbar-brand, .ebk-btn')).map(el => {
            const r = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              text: (el.textContent || '').trim().slice(0, 15),
              right: r.right,
              left: r.left,
              width: r.width
            };
          });
          return {
            exists: true,
            scrollWidth: tb.scrollWidth,
            clientWidth: tb.clientWidth,
            isOverflowing: tb.scrollWidth > tb.clientWidth,
            itemCount: items.length,
            offscreenItems: items.filter(i => i.right > window.innerWidth || i.left < 0)
          };
        });

        console.log(`[${vp.name}]:`);
        console.log(`  Horiz Scroll: ${hasHorizontalScroll ? `YES (${scrollWidth}px vs ${clientWidth}px)` : 'No (clean)'}`);
        console.log(`  Login Button: exists=${loginBtnInfo.exists}, visible=${loginBtnInfo.visible}, floating=${loginBtnInfo.isFloating}, w=${loginBtnInfo.rect ? Math.round(loginBtnInfo.rect.width) : 0}px, right=${loginBtnInfo.rect ? Math.round(loginBtnInfo.rect.right) : 0}px`);
        if (topbarInfo.exists) {
          console.log(`  Topbar: overflow=${topbarInfo.isOverflowing}, items=${topbarInfo.itemCount}, offscreen=${topbarInfo.offscreenItems.length}`);
          if (topbarInfo.offscreenItems.length > 0) {
            console.log(`    Offscreen:`, topbarInfo.offscreenItems.map(i => `${i.tag}:${i.text}(r=${Math.round(i.right)})`).join(', '));
          }
        }
      } catch (err) {
        console.log(`  Error on ${vp.name}: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
}

runTest();
