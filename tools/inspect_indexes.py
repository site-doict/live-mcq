import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

for f in sorted(glob.glob('*/index.html') + glob.glob('index.html')):
    c = open(f, encoding='utf-8', errors='ignore').read()
    # Check for empty h2 or missing title or meta
    empty_h2 = re.findall(r'<h2[^>]*class=[\'"][^\'"]*chapter-title[^\'"]*[\'"][^>]*>\s*</h2>', c)
    # Check if cards lack meta tags (e.g. question count, page number)
    cards = re.findall(r'<a[^>]*class=[\'"][^\'"]*chapter-card[^\'"]*[\'"][^>]*>([\s\S]*?)</a>', c)
    cards_without_meta = [card for card in cards if 'chapter-meta' not in card and 'card-meta' not in card and 'meta' not in card]
    if empty_h2 or cards_without_meta:
        print(f"{f}: empty_h2={len(empty_h2)}, cards_without_meta={len(cards_without_meta)} / {len(cards)}")
