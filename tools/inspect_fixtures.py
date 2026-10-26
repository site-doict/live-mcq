import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/uttoron_bcs/50th-bcs.html', encoding='utf-8') as f:
    text = f.read()

questions = [5, 44, 61, 135, 151]
for q in questions:
    print(f'=== Question {q} ===')
    # search for id="q{q}" or class="question-card" or similar
    pattern = rf'(?:id=[\"\']q-?{q}[\"\']|class=[\"\'][^\"\']*q-?{q}[^\"\']*[\"\']|data-qid=[\"\']{q}[\"\'])'
    m = re.search(pattern, text)
    if m:
        pos = m.start()
        print(text[pos:pos+400])
    else:
        # try searching for {q}.
        m2 = re.search(rf'>\s*{q}\.\s*([^<]+)', text)
        if m2:
            print(f'Found >{q}. : {m2.group(0)}')
        else:
            print(f'Not found with standard patterns')
