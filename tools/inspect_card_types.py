import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

test_files = [
    'Non Cadre English/ch-01-parts-of-speech-noun.html',
    'Live MCQ Bangla Language/উপসর্গ.html',
    'Live MCQ Bangla Literature/আধুনিক যুগের অন্যান্য লেখক ও তাদের সাহিত্যকর্ম.html'
]

for tf in test_files:
    print(f"\n--- Checking {tf} ---")
    with open(tf, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Find all divs with class
    matches = re.findall(r'<div[^>]+class=["\']([^"\']+)["\']', text)
    classes = set()
    for m in matches:
        for c in m.split():
            classes.add(c)
    print("Classes in file:", sorted([c for c in classes if any(k in c for k in ['card', 'q', 'mcq', 'opt', 'exp', 'ans', 'drawer'])]))
    
    # Find first snippet of question or option
    opt_btn = re.search(r'(<button[^>]+(?:checkAnswer|opt|option)[^>]*>.*?</button>)', text, re.DOTALL)
    if opt_btn:
        print("Sample button:", opt_btn.group(1)[:200])
    
    exp_snippet = re.search(r'(<(?:div|section|aside)[^>]+class=["\'][^"\']*(?:exp|explanation|ans)[^"\']*["\'][^>]*>.*?</(?:div|section|aside)>)', text, re.DOTALL)
    if exp_snippet:
        print("Sample exp:", exp_snippet.group(1)[:300])
