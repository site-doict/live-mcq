const { chromium } = require('playwright');

async function launchBrowser(options = {}) {
  try {
    return await chromium.launch({ headless: true, ...options });
  } catch (err) {
    // Fallback to installed Microsoft Edge on Windows
    try {
      return await chromium.launch({ headless: true, channel: 'msedge', ...options });
    } catch (edgeErr) {
      throw new Error(`Browser launch failed: Chromium (${err.message}), Edge (${edgeErr.message})`);
    }
  }
}

module.exports = { launchBrowser };
