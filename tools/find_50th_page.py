import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

for f in sorted(glob.glob('*/*.html') + glob.glob('*.html') + glob.glob('*/*/*.html')):
    if '_backup_' in f:
        continue
    try:
        content = open(f, encoding='utf-8', errors='ignore').read()
    except Exception:
        continue

    # check if '৫০তম বিসিএস' or '50th' is in content
    if '৫০তম বিসিএস' in content or '50th' in content:
        # Check for questions like 5, 44, 61, 135, 151
        q_hits = []
        for q in [5, 44, 61, 135, 151]:
            # see if id="q5" or id="q-5" or id="q_5" or data-qid="5" or similar
            if re.search(rf'id=[\"\'][a-zA-Z_-]*0*{q}[\"\']', content) or f'data-qid="{q}"' in content or f'value="{q}"' in content or f'id="question-{q}"' in content:
                q_hits.append(q)
        if len(q_hits) >= 2 or 'exam.html' in f:
            print(f"{f} -> found {q_hits}")
