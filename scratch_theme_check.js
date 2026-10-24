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
const darkReports = [];

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  
  // Check if has a theme toggle button or script
  const hasToggle = content.includes('toggleTheme') || content.includes('theme-toggle') || content.includes('themeBtn');
  
  // Check what theme toggle does: does it toggle data-theme on html or body or dark-mode class?
  let toggleTarget = 'none';
  if (content.includes("document.documentElement.setAttribute('data-theme'") || content.includes('document.documentElement.setAttribute("data-theme"')) {
    toggleTarget = 'html-data-theme';
  } else if (content.includes("document.body.classList.toggle('dark-mode')") || content.includes('document.body.classList.toggle("dark")')) {
    toggleTarget = 'body-class';
  } else if (content.includes("document.body.setAttribute('data-theme'") || content.includes('document.body.setAttribute("data-theme"')) {
    toggleTarget = 'body-data-theme';
  }
  
  // Look for chapters that have data-theme="dark" styles vs what toggle changes
  // Also look for hardcoded black/dark text in tables or cards:
  const hasHardcodedDarkColor = (content.match(/color:\s*#(?:000|111|222|333|1c1917|1a2a44|1f2937|000000)/gi) || []).length;
  const hasTableDarkText = (content.match(/<t[hd][^>]*style="[^"]*color:\s*#[0-3]/gi) || []).length;
  
  // Check if body has a background that is dark in dark mode, but card or text doesn't adjust:
  if (content.includes('data-theme') || hasToggle) {
    darkReports.push({
      file: f,
      hasToggle,
      toggleTarget,
      hasHardcodedDarkColor
    });
  }
});

console.log('Checked files:', darkReports.length);
// Find files where toggleTarget is mismatched or hardcoded dark color is high
const suspicious = darkReports.filter(r => r.hasHardcodedDarkColor > 10 || r.toggleTarget === 'none' && r.hasToggle);
console.log('Suspicious files:', suspicious.length);
suspicious.forEach(s => console.log(s.file, s.toggleTarget, s.hasHardcodedDarkColor));
