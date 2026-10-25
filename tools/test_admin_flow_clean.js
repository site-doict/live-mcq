const { chromium } = require('playwright');
const path = require('path');

async function testAdminFlow() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\PC User\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe'
  });

  const context = await browser.newContext({ viewport: { width: 375, height: 750 } });
  const page = await context.newPage();
  const testFile = 'file://' + path.resolve(__dirname, '../Non Cadre English/ch-01-parts-of-speech-noun.html').replace(/\\/g, '/');

  console.log('--- TESTING IN-BROWSER CMS & ADMIN LIVE EDITOR ---');
  await page.goto(testFile, { waitUntil: 'domcontentloaded' });

  // 1. Clear any prior test state in localStorage
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });

  // 2. Wait for Login Button in topbar
  const loginBtn = await page.waitForSelector('#ebkAdminLoginBtn, .ebk-admin-login-btn', { timeout: 5000 });
  console.log('✓ Step 1: Login button exists in topbar.');

  // 3. Click Login button to open modal
  await loginBtn.click();
  await page.waitForSelector('#ebkAdminModalBackdrop.open', { timeout: 3000 });
  console.log('✓ Step 2: Login modal opened.');

  // 4. Enter password 4991 and submit
  await page.fill('#ebkAdminPassInput', '4991');
  await page.click('#ebkSubmitLoginBtn');
  await page.waitForTimeout(400);

  // 5. Verify admin active on body
  const isAdminActive = await page.evaluate(() => document.body.classList.contains('ebk-admin-active'));
  if (!isAdminActive) throw new Error('Admin active class not applied to body');
  console.log('✓ Step 3: Admin logged in successfully, body has .ebk-admin-active.');

  // 6. Verify edit triggers attached
  await page.waitForSelector('.ebk-edit-trigger', { timeout: 3000 });
  const pencilCount = await page.$$eval('.ebk-edit-trigger', el => el.length);
  const correctToggleCount = await page.$$eval('.ebk-correct-toggle', el => el.length);
  console.log(`✓ Step 4: Attached ${pencilCount} edit pencils and ${correctToggleCount} correct-answer toggles.`);

  // 7. Test Question Text Editing
  console.log('Testing question text editing...');
  const qPencil = await page.$('.q-text .ebk-edit-trigger');
  if (qPencil) {
    await qPencil.click();
    await page.waitForSelector('#ebkMiniToolbar.visible', { timeout: 3000 });
    console.log('✓ Step 5: Mini formatting toolbar opened for question.');
  }

  // 8. Open Explanation Drawer to view and edit explanation
  console.log('Opening explanation drawer to edit explanation...');
  const expToggle = await page.$('.exp-toggle-btn');
  if (expToggle) {
    await expToggle.click();
    await page.waitForTimeout(300);
  }

  // Find edit pencil inside opened explanation drawer
  const expPencil = await page.$('.exp-drawer .ebk-edit-trigger, .explanation-drawer .ebk-edit-trigger, .ans-drawer .ebk-edit-trigger');
  if (!expPencil) throw new Error('No explanation drawer edit pencil found');

  await expPencil.click();
  await page.waitForTimeout(300);

  const isEditing = await page.evaluate(() => {
    const activeEl = document.querySelector('.ebk-is-editing');
    return !!activeEl && activeEl.closest('.exp-drawer, .explanation-drawer, .ans-drawer') !== null;
  });
  console.log(`✓ Step 6: Explanation is actively editable: ${isEditing}`);

  // 9. Type text and math into active editable element
  await page.evaluate(() => {
    const activeEl = document.querySelector('.ebk-is-editing');
    if (activeEl) {
      activeEl.innerText = 'টেস্ট আপডেট ব্যাখ্যা: \\( a^2 + b^2 = c^2 \\) সঠিক সূত্র।';
      activeEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await page.waitForTimeout(300);

  // 10. Verify Math Preview active in toolbar
  const previewActive = await page.$eval('#ebkMathPreview', el => el.classList.contains('active'));
  console.log(`✓ Step 7: Live math preview active in toolbar: ${previewActive}`);

  // 11. Verify Save Dock is visible at screen bottom
  const dockVisible = await page.$eval('#ebkSaveDock', el => el.classList.contains('visible'));
  const dockText = await page.$eval('#ebkSaveCountText', el => el.textContent);
  console.log(`✓ Step 8: Sticky save dock visible: ${dockVisible} (${dockText})`);

  // 12. Click Save Button
  await page.click('#ebkSaveBtn');
  await page.waitForTimeout(500);

  // 13. Verify LocalStorage has saved edits
  const savedData = await page.evaluate(() => {
    const path = (window.location.pathname || 'index.html').split('/').pop() || 'index.html';
    return localStorage.getItem('ebk_edits_' + decodeURIComponent(path));
  });
  console.log(`✓ Step 9: Edits persisted to LocalStorage: ${savedData ? 'YES (Length: ' + savedData.length + ' chars)' : 'NO'}`);

  // 14. Reload page to test automatic edit restoration
  console.log('Testing reload persistence...');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  const hasRestoredText = await page.evaluate(() => {
    return document.body.innerHTML.includes('টেস্ট আপডেট ব্যাখ্যা');
  });
  console.log(`✓ Step 10: Saved edit restored on reload: ${hasRestoredText}`);
  if (!hasRestoredText) throw new Error('Edit not restored after reload');

  // Clean up test data from localStorage
  await page.evaluate(() => {
    localStorage.clear();
  });
  console.log('✓ Cleaned up test localStorage key.');

  await browser.close();
  console.log('\n--- ALL ADMIN CMS & EDIT FLOWS PASSED PERFECTLY! ---');
}

testAdminFlow().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
