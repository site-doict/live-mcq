import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('Non Cadre English/ch-01-parts-of-speech-noun.html', 'r', encoding='utf-8') as f:
    text = f.read()

# find first occurrence of class="q- or class="mcq- or id="q
for m in re.finditer(r'<([a-zA-Z0-9]+)\s+([^>]*?(?:class=["\'][^"\']*(?:q-|mcq-|card)[^"\']*["\']|id=["\']q\d+["\'])[^>]*)>', text):
    tag, attrs = m.group(1), m.group(2)
    start = m.start()
    snippet = text[start:start+400]
    print("Found tag:", tag)
    print("Attrs:", attrs)
    print("Snippet:", snippet)
    print("="*40)
    break
