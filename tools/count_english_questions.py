import glob
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

english_files = sorted([f for f in glob.glob('Non Cadre English/*.html') if not f.endswith('index.html')])
print(f"Total English chapter files found: {len(english_files)}")

total_q_count = 0
chapter_q_counts = []

for f in english_files:
    with open(f, 'r', encoding='utf-8') as fp:
        text = fp.read()
    
    # Questions are typically <article class="q-card" ...> or <div class="q-card" ...> or <div class="mcq-card" ...>
    q_cards = re.findall(r'<(?:article|div)[^>]+class=["\'][^"\']*(?:q-card|mcq-card)[^"\']*', text)
    count = len(q_cards)
    
    # Also check if there's a badge or stat in the file
    badge_match = re.search(r'(\d+)\s*টি\s*প্রশ্ন', text)
    badge_count = badge_match.group(1) if badge_match else 'none'
    
    total_q_count += count
    chapter_q_counts.append((os.path.basename(f), count, badge_count))

print(f"\nExact physical questions counted across all {len(english_files)} chapters: {total_q_count}")
print("\nSample chapter question counts:")
for fname, physical_count, badge_cnt in chapter_q_counts[:10]:
    print(f"  {fname}: physical={physical_count}, badge in chapter={badge_cnt}")
