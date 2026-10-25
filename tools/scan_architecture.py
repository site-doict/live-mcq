import glob, os, re, json, sys

sys.stdout.reconfigure(encoding='utf-8')

print("=== 1. Searching for Auth, Login, Supabase, Firebase, Roles ===")
auth_keywords = ['supabase', 'firebase', 'login', 'লগিন', 'লগইন', 'signin', 'auth', 'session', 'isadmin', 'role', 'editmode', 'edit_mode']

files_to_check = ['universal-modes.js', 'universal-modes.css', 'ebook-ui.js', 'ebook-ui.css', 'exam-engine.js', 'search-engine.js', 'index.html', 'exam.html']

for f in files_to_check:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            txt = fp.read()
        matches = {}
        for kw in auth_keywords:
            hits = len(re.findall(re.escape(kw), txt, re.I))
            if hits:
                matches[kw] = hits
        if matches:
            print(f"[{f}] matches: {matches}")

# Also search for supabase / firebase across all js files
all_js = glob.glob('*.js') + glob.glob('*/*.js')
for j in all_js:
    if 'node_modules' in j or '_backup' in j or 'scratch' in j: continue
    with open(j, 'r', encoding='utf-8', errors='ignore') as fp:
        txt = fp.read()
    if 'supabase' in txt.lower():
        print(f"SUPABASE FOUND IN: {j}")
    if 'firebase' in txt.lower():
        print(f"FIREBASE FOUND IN: {j}")
