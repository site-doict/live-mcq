import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

text = open('scratch/uttoron_bcs/50th-bcs.html', encoding='utf-8').read()

fixtures = [
    "x^4-2x+1",
    r"\frac x2",
    r"\fracπ6",
    r"\frac{2π3 }",
    r"\frac23",
    r"\frac32",
    r"8\sqrt3",
    r"16\sqrt3",
    r"\{p,q\}",
    r"x^2-(p+q)x+pq=0",
    "log_x",
    r"\frac3{64}"
]

print("=== Fixtures in 50th-bcs.html ===")
for fix in fixtures:
    pos = text.find(fix)
    if pos != -1:
        # find closest question number around pos
        start = max(0, pos - 200)
        end = min(len(text), pos + 200)
        # look for question number
        q_match = re.findall(r'question_([0-9]+)', text[max(0, pos-1000):pos+1000])
        print(f"Fixture: {fix} -> found near questions {set(q_match)}")
    else:
        print(f"Fixture: {fix} -> NOT directly found by exact string")
