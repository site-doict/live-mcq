import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

title_patterns = [
    r'<div[^>]*class=["\'][^"\']*(?:exp-title|explanation-title|ans-title|ans-label)[^"\']*["\'][^>]*>(.*?)</div>',
    r'<(?:span|div)[^>]*class=["\'][^"\']*(?:ans-badge|correct-badge|q-ans-badge|badge-ans)[^"\']*["\'][^>]*>(.*?)</(?:span|div)>'
]

title_regex = re.compile('|'.join(title_patterns))

found_titles = set()
for f in sorted(glob.glob('*/*.html') + glob.glob('*.html')):
    if '_backup_' in f:
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        text = fp.read()
    for m in title_regex.finditer(text):
        content = m.group(1) or m.group(2)
        if content:
            cleaned = re.sub(r'<[^>]+>', '', content).strip()
            if len(cleaned) < 80:
                found_titles.add(cleaned)

print(f"Unique explanation titles/badges found: {len(found_titles)}")
for t in sorted(list(found_titles))[:30]:
    print(" - ", t)
