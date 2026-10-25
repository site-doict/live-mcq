import re, sys

sys.stdout.reconfigure(encoding='utf-8')

with open('universal-modes.js', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if any(k in line.lower() for k in ['login', 'লগইন', 'admin', 'editmode', 'auth', 'save', 'modal', 'storage']):
        print(f"L{i+1}: {line.strip()[:100]}")
