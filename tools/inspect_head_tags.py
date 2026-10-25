import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

samples = [
    'index.html',
    'exam.html',
    'Live MCQ Bangla Language/উপসর্গ.html',
    'Live MCQ Mathematical Reasoning/অনুপাত, সমানুপাত ও অংশীদারি কারবার.html',
    'Non Cadre English/ch-01-parts-of-speech-noun.html',
    'Non Cadre Arithmetic/ch-01-real-numbers.html'
]

for s in samples:
    print(f"=== {s} ===")
    with open(s, 'r', encoding='utf-8') as f:
        content = f.read()
    links = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]*>', content)
    for l in links:
        print("  ", l)
    scripts = re.findall(r'<script[^>]+src=["\'][^"\']+["\'][^>]*>', content)
    for sc in scripts:
        print("  ", sc)
