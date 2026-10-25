import glob
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

index_files = sorted(glob.glob('*/index.html'))
print(f"Total sub-indexes found: {len(index_files)}")

issues = {}

for idx_path in index_files:
    with open(idx_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    folder = os.path.dirname(idx_path)
    
    # Find all chapter cards / links
    # Look for cards with chapter-title
    card_titles = re.findall(r'<h2[^>]*class=["\'][^"\']*chapter-title[^"\']*["\'][^>]*>(.*?)</h2>', content, re.DOTALL)
    card_links = re.findall(r'<a[^>]+href=["\']([^"\']+\.html)["\'][^>]*class=["\'][^"\']*(?:chapter-card|card)[^"\']*', content)
    
    empty_titles = [i for i, t in enumerate(card_titles) if not re.sub(r'<[^>]+>', '', t).strip()]
    
    # Check if cards exist in folder
    html_in_dir = [f for f in os.listdir(folder) if f.endswith('.html') and f != 'index.html']
    
    if empty_titles or len(card_titles) != len(html_in_dir):
        issues[idx_path] = {
            'total_cards': len(card_titles),
            'empty_titles': len(empty_titles),
            'html_files_on_disk': len(html_in_dir)
        }

print("\n--- SUB-INDEX AUDIT FINDINGS ---")
for p, info in issues.items():
    print(f"{p}:")
    print(f"  Cards: {info['total_cards']}, Empty Titles: {info['empty_titles']}, Files on disk: {info['html_files_on_disk']}")
