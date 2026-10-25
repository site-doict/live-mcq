import glob
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

targets = [
    'Live MCQ Ethics & Good Governance',
    'Live MCQ Geography',
    'Live MCQ Mathematical Reasoning',
    'Live MCQ Mental Ability'
]

for t in targets:
    cur_idx = f"{t}/index.html"
    bak_idx = f"_backup_before_redesign/{t}/index.html"
    
    print(f"\n==========================================")
    print(f"SUBJECT: {t}")
    
    # Read backup cards
    if os.path.exists(bak_idx):
        with open(bak_idx, 'r', encoding='utf-8') as f:
            bak_text = f.read()
        # find cards in backup
        bak_cards = re.findall(r'<a[^>]+href=["\']([^"\']+\.html)["\'][^>]*>(.*?)</a>', bak_text, re.DOTALL)
        print(f"Backup cards found: {len(bak_cards)}")
        for href, card_html in bak_cards[:3]:
            title_m = re.search(r'<(?:h2|h3)[^>]*>(.*?)</(?:h2|h3)>', card_html)
            title = title_m.group(1).strip() if title_m else 'none'
            print(f"  {href} -> {title}")
    else:
        print("Backup index NOT found!")
