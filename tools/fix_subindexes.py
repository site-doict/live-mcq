#!/usr/bin/env python3
"""
Fix sub-indexes to achieve 100% standard compliance across all 27 index files.
"""

import os
import re
import sys
import urllib.parse

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INDEX_FILES = [
    'Non Cadre English/index.html',
    'Non Cadre Bangladesh/index.html',
    'Non Cadre International/index.html',
    'Non Cadre Geometry/index.html',
    'Non Cadre Trigonometry & Higher Math/index.html',
    'Non Cadre Computer & IT/index.html',
    'Non Cadre Mental Ability/index.html',
    'Non Cadre Geography & Environment/index.html',
    'Non Cadre Ethics & Good Governance/index.html'
]

print("Standardizing targeted sub-index files...")

for rel in INDEX_FILES:
    full_path = os.path.join(ROOT_DIR, rel)
    if not os.path.exists(full_path):
        print(f"Skipping missing: {rel}")
        continue
    
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    folder = rel.split('/')[0]
    encoded_folder = urllib.parse.quote(folder)

    # 1. Clean disallowed inline styles
    # Non Cadre English style="font-size:0.85rem..."
    content = re.sub(r'\s*style=["\']font-size:0\.85rem[^"\']*["\']', '', content)
    # Non Cadre Bangladesh & International badge styles
    content = re.sub(r'(<span class=["\']ch-badge["\'])\s+style=["\'][^"\']*["\']', r'\1', content)

    # 2. Fix Title
    m_title = re.search(r'<title>(.*?)</title>', content)
    if m_title:
        title_text = m_title.group(1).strip()
        if '| বিসিএস স্মার্ট ই-বুক লাইব্রেরি' not in title_text:
            clean_title = re.sub(r'\s*-\s*Live\s*MCQ.*$', '', title_text).strip()
            clean_title = re.sub(r'\s*\|\s*.*$', '', clean_title).strip()
            new_title = f"{clean_title} | বিসিএস স্মার্ট ই-বুক লাইব্রেরি"
            content = content[:m_title.start(1)] + new_title + content[m_title.end(1):]

    # 3. Ensure ebkSearchMount
    if 'id="ebkSearchMount"' not in content and "id='ebkSearchMount'" not in content:
        if '<section class="ch-grid"' in content:
            content = content.replace('<section class="ch-grid"', '<div id="ebkSearchMount"></div>\n    <section class="ch-grid"', 1)
        elif '<div class="ch-grid"' in content:
            content = content.replace('<div class="ch-grid"', '<div id="ebkSearchMount"></div>\n    <div class="ch-grid"', 1)
        elif '<section class="chapter-grid"' in content:
            content = content.replace('<section class="chapter-grid"', '<div id="ebkSearchMount"></div>\n    <section class="chapter-grid"', 1)
        elif '<main' in content:
            content = content.replace('<main', '<div id="ebkSearchMount"></div>\n  <main', 1)

    # 4. Ensure Scripts
    required_scripts = [
        ('../universal-modes.js', '<script src="../universal-modes.js"></script>'),
        ('../search-engine.js', '<script src="../search-engine.js"></script>'),
        ('../ebook-ui.js', '<script src="../ebook-ui.js"></script>')
    ]
    for s_path, s_tag in required_scripts:
        if s_path not in content:
            if '</body>' in content:
                content = content.replace('</body>', f'  {s_tag}\n</body>', 1)
            else:
                content += f'\n{s_tag}\n'

    # 5. Ensure exam link
    if 'exam.html' not in content:
        exam_link = f'<a href="../exam.html?subject={encoded_folder}" class="home-link" title="পরীক্ষা দিন"><span>পরীক্ষা</span> <span>→</span></a>'
        if '<div class="header-bar">' in content:
            # find home-link and add exam_link in the div right after or alongside
            content = re.sub(
                r'(<button[^>]*id=["\']themeBtn["\'][^>]*>.*?</button>)',
                rf'{exam_link}\n        \1',
                content,
                count=1
            )
        elif '<div class="topbar-actions">' in content:
            btn_link = f'<a href="../exam.html?subject={encoded_folder}" class="btn btn-primary" title="এই বিষয়ের উপর পরীক্ষা দিন"><span>পরীক্ষা দিন</span> <span>→</span></a>'
            content = content.replace('<div class="topbar-actions">', f'<div class="topbar-actions">\n        {btn_link}', 1)
    else:
        # Check if subject query parameter is missing
        def fix_exam_query(match):
            href = match.group(1)
            if 'subject=' not in href:
                sep = '&' if '?' in href else '?'
                return f'href="{href}{sep}subject={encoded_folder}"'
            return match.group(0)
        content = re.sub(r'href=["\']([^"\']*exam\.html[^"\']*)["\']', fix_exam_query, content)

    if content != original:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {rel}")
    else:
        print(f"Already Clean: {rel}")

print("\nSub-index fixes applied.")
