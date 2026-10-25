import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

files = [
    'Live MCQ Bangla Language/উপসর্গ.html',
    'Live MCQ Bangla Literature/ch-01-ancient-period.html',
    'Live MCQ Arithmetic/01_বাস্তব_সংখ্যা.html',
    'Non Cadre English/ch-01-parts-of-speech-noun.html'
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            content = fp.read()
        m = re.search(r'(<div[^>]*class=["\'][^"\']*(?:explanation|exp-)[^"\']*["\'][^>]*>.*?</div>\s*</div>)', content, re.DOTALL)
        if m:
            print(f"=== {f} ===")
            print(m.group(0)[:500])
            print("...")
        else:
            print(f"No match for {f}")
    except Exception as e:
        print(f"Error {f}: {e}")
