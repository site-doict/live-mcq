import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

data = json.load(open('exam-data.json', encoding='utf-8'))
bcs50 = [d for d in data if d.get('bcs') == '৫০তম বিসিএস']
print(f'Total 50th BCS items in exam-data: {len(bcs50)}')

for i, d in enumerate(bcs50):
    text = str(d)
    if 'x^4' in text or 'sqrt' in text or 'frac' in text or 'log' in text or 'π' in text:
        print(f"Item #{i+1} (ID: {d.get('id')}) [{d.get('s')}]: {d.get('q')[:60]}")
