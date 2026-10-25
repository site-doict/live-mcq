import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

invisible_chars = ['\u2061', '\u2062', '\u2063', '\u200b', '\ufeff']

total_invisible = 0
total_raw_latex = 0
invisible_files = []
raw_latex_files = []

# Raw LaTeX indicators
latex_cmds = [r'\\frac', r'\\sqrt', r'\\log', r'\\cdots', r'\\times', r'\\div', r'\\pm', r'\\approx', r'\\le', r'\\ge', r'\\neq', r'\\pi', r'\\theta']
pattern = re.compile('|'.join(latex_cmds))

for f in sorted(glob.glob('*/*.html') + glob.glob('*.html')):
    if '_backup_' in f:
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        text = fp.read()
    
    # Check invisible chars
    inv_count = sum(text.count(c) for c in invisible_chars)
    if inv_count > 0:
        total_invisible += inv_count
        invisible_files.append((f, inv_count))
        
    matches = pattern.findall(text)
    if matches:
        # Check how many are NOT inside \( or \[
        undelimited = 0
        for m in pattern.finditer(text):
            start = max(0, m.start() - 30)
            end = min(len(text), m.end() + 30)
            window = text[start:end]
            if '\\(' not in window and '\\[' not in window and '$$' not in window:
                undelimited += 1
        if undelimited > 0:
            total_raw_latex += undelimited
            raw_latex_files.append((f, undelimited))

print(f"Total invisible characters found: {total_invisible} across {len(invisible_files)} files")
for f, cnt in invisible_files[:5]:
    print(f"  {f}: {cnt} invisible chars")

print(f"\nTotal undelimited LaTeX commands found: {total_raw_latex} across {len(raw_latex_files)} files")
for f, cnt in raw_latex_files[:10]:
    print(f"  {f}: {cnt} undelimited commands")
