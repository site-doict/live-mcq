import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Find sample chapter files from various folders
subdirs = [
    'Live MCQ Bangla Language',
    'Live MCQ Bangla Literature',
    'Live MCQ Mathematical Reasoning',
    'Non Cadre English',
    'Non Cadre Arithmetic'
]

for sub in subdirs:
    html_files = [f for f in glob.glob(f'{sub}/*.html') if not f.endswith('index.html')]
    if not html_files:
        continue
    sample_file = html_files[0]
    with open(sample_file, 'r', encoding='utf-8') as f:
        text = f.read()
    
    print(f"\n==========================================")
    print(f"FILE: {sample_file}")
    
    # Find question cards
    q_matches = re.findall(r'<div[^>]*class=["\'][^"\']*(?:q-card|mcq-card)[^"\']*["\'][^>]*>.*?(?:</div>\s*</div>)', text, re.DOTALL)
    print(f"Total q-cards found: {len(q_matches)}")
    if q_matches:
        # print first 600 chars of first question
        first_q = q_matches[0]
        # find explanation inside or following
        print("SAMPLE QUESTION SNIPPET:")
        print(first_q[:800])
