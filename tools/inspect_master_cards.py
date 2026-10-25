import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# find master-card or cards linking to subjects
cards = re.findall(r'<div[^>]*class=["\'][^"\']*master-card[^"\']*["\'][^>]*>(.*?)</div>\s*</div>', text, re.DOTALL)
print(f"Master cards found: {len(cards)}")

links = re.findall(r'<a[^>]+href=["\']([^"\']+/index\.html)["\']', text)
print(f"Subject links found on master: {len(links)}")
for l in sorted(links):
    print("  ", l)
