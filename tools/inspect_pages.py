import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

files = [f for f in glob.glob('*/*.html') if not f.endswith('index.html')][:10]
for f in sorted(files):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    classes = set()
    for m in re.finditer(r'class=["\']([^"\']+)["\']', content):
        for c in m.group(1).split():
            if any(k in c for k in ['exp', 'ans', 'drawer', 'explain', 'q-', 'opt-']):
                classes.add(c)
    print(f, sorted(list(classes)))
