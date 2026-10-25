import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

patterns = [
    r'সঠিক উত্তর[:\s]*[কখগঘabcdABCD]',
    r'সঠিক উত্তরটি[:\s]*(?:হলো|হল)?[:\s]*[কখগঘabcdABCD]',
    r'উত্তরঃ[:\s]*[কখগঘabcdABCD]',
    r'উত্তর[:\s]*[কখগঘabcdABCD]'
]

combined_regex = re.compile('|'.join(patterns))

total_matches = 0
file_matches = {}

for f in sorted(glob.glob('*/*.html') + glob.glob('*.html') + glob.glob('*.js')):
    if '_backup_' in f:
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    matches_in_file = []
    for l_idx, line in enumerate(lines):
        m = combined_regex.search(line)
        if m:
            matches_in_file.append((l_idx + 1, m.group(0), line.strip()[:100]))
    if matches_in_file:
        file_matches[f] = matches_in_file
        total_matches += len(matches_in_file)

print(f"Total files with answer letter patterns: {len(file_matches)}")
print(f"Total match count: {total_matches}\n")

# Show top 5 files as examples
for f in list(file_matches.keys())[:5]:
    print(f"=== {f} ({len(file_matches[f])} matches) ===")
    for line_num, match_str, line_snippet in file_matches[f][:3]:
        print(f"  Line {line_num}: [{match_str}] -> {line_snippet}")
