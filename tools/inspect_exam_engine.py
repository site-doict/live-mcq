import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('exam-engine.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.finditer(r'সঠিক উত্তর[^\n]{0,80}', text)
for m in matches:
    print(m.group(0))
