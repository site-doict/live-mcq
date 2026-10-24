const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(walk(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = walk('.');
const contrastIssues = [];

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  
  // Check if file has dark mode definition
  const hasDarkTheme = content.includes('data-theme="dark"') || content.includes("[data-theme='dark']") || content.includes('[data-theme="dark"]');
  const hasThemeToggle = content.includes('toggleTheme') || content.includes('theme-btn');
  
  // Check for suspicious hardcoded dark colors on elements that should be light in dark mode
  // e.g. text colors like #111, #222, #333, #000 without dark mode override
  // or dark mode styles where text color is too dark
  const darkMatches = content.match(/\[data-theme=["']dark["']\][^{]*\{([^}]+)\}/g);
  
  // Check if dark mode sets background dark but text color dark
  if (darkMatches) {
    darkMatches.forEach(dm => {
      // Check if text color inside dark mode rule has #000, #111, #222, #333, #444, #555
      if (/color\s*:\s*#(?:[0-5][0-5][0-5]|(?:[0-5]{2}){3})/i.test(dm)) {
        contrastIssues.push({ file: f, type: 'dark_text_in_dark_theme', rule: dm });
      }
    });
  }

  // Check specific known problematic patterns:
  // E.g. in card, q-text, sk-content, if inline style has dark color:
  const inlineDarkColor = content.match(/style="[^"]*?color\s*:\s*#(?:[0-3][0-3][0-3]|000|1c1917|222|333)[^"]*"/gi);
  if (inlineDarkColor && inlineDarkColor.length > 5) {
    contrastIssues.push({ file: f, type: 'hardcoded_inline_dark_colors', count: inlineDarkColor.length, sample: inlineDarkColor[0] });
  }
});

console.log('Files with potential dark mode contrast issues:', contrastIssues.length);
contrastIssues.forEach(c => {
  console.log(`\nFile: ${c.file} | Type: ${c.type}`);
  if (c.rule) console.log(`Rule:`, c.rule);
  if (c.sample) console.log(`Sample:`, c.sample, `Count:`, c.count);
});
