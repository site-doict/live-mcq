import glob
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

for idx_path in sorted(glob.glob('*/index.html')):
    if '_backup_' in idx_path:
        continue
    with open(idx_path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # check links to .html
    links = re.findall(r'<a[^>]+href=["\']([^"\']+\.html)["\']', text)
    chapter_links = [l for l in links if l != 'index.html' and not l.startswith('../')]
    
    # Check all h2, h3, h4
    h_tags = re.findall(r'<h[234][^>]*>(.*?)</h[234]>', text, re.DOTALL)
    cleaned_h = [re.sub(r'<[^>]+>', '', h).strip() for h in h_tags]
    
    print(f"{idx_path}:")
    print(f"  Internal Chapter Links: {len(chapter_links)}")
    print(f"  Headings: {len(cleaned_h)}, Empty Headings: {sum(1 for h in cleaned_h if not h)}")
    if chapter_links:
        print(f"  Sample links: {chapter_links[:2]}")
    if cleaned_h:
        print(f"  Sample headings: {cleaned_h[:3]}")
    print("---")
