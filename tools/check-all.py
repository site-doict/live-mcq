#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/check-all.py - Comprehensive Static Verification for BCS E-Book Library
Checks:
1. Math Data & Delimiters (Invisible chars, bare LaTeX commands, unbracketed \\frac, raw math)
2. Answer Presentation (No "উত্তর: ক", "সঠিক উত্তর: [ক-ঘ]", or "মুদ্রিত উত্তর" in explanations)
3. Index Integrity (No empty chapter titles, valid links, chapter count synchronization)
4. Portal Architecture & Quality (Tracks, panels, no nested cards, zero emojis, no disallowed styles)
5. Disk Count Synchronization & Content Integrity (Single Source of Truth match with tools/count_disk.py, SVG dimensions, stepper semantic buttons, zero forbidden promo terms)
"""

import os
import re
import sys
import glob
import json

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Add tools directory to import count_disk
sys.path.insert(0, os.path.dirname(__file__))
import count_disk

INVISIBLE_CHARS = ['\u2061', '\u2062', '\u2063', '\u200b', '\ufeff']
RAW_LATEX_PATTERNS = [
    r'\\frac\s*\{?[0-9a-zA-Z\\]+?\}?',
    r'\\sqrt\s*\{?[0-9a-zA-Z\\]+?\}?',
    r'\\log_[0-9a-zA-Z]+',
    r'\\times', r'\\div', r'\\pm', r'\\neq', r'\\approx',
    r'\\le', r'\\ge', r'\\in', r'\\subset'
]
RAW_LATEX_RE = re.compile('|'.join(RAW_LATEX_PATTERNS))

ANSWER_LETTER_PATTERNS = [
    re.compile(r'(?:সঠিক\s*)?উত্তর\s*(?:[:：]|\s+)\s*\(?[কখগঘ]\)?(?![\u0980-\u09FF])', re.IGNORECASE),
    re.compile(r'মুদ্রিত\s*উত্তর\s*(?:[:：]|\s+)\s*\(?[কখগঘ]\)?(?![\u0980-\u09FF])', re.IGNORECASE),
    re.compile(r'সঠিক\s*উত্তরটি\s*হলো\s*\(?[কখগঘ]\)?(?![\u0980-\u09FF])', re.IGNORECASE),
]

FORBIDDEN_PROMO_TERMS = [
    'লক্ষাধিক',
    '৭৬,০০০',
    'শতভাগ অফলাইন',
    'সংকলন চলছে',
    'চালু ⚡',
    '১০০% প্রস্তুত',
    'রিয়েল বোর্ড'
]

def check_math_integrity():
    errors = []
    for filepath in sorted(glob.glob(os.path.join(ROOT_DIR, '**', '*.html'), recursive=True)):
        if any(skip in filepath for skip in ['_backup_', 'node_modules', 'scratch']):
            continue
        rel = os.path.relpath(filepath, ROOT_DIR)
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception as e:
            errors.append(f"MATH: Cannot read {rel}: {e}")
            continue

        for char in INVISIBLE_CHARS:
            count = content.count(char)
            if count > 0:
                errors.append(f"MATH: {rel} contains {count} invisible characters (U+{ord(char):04X})")

        body_text = re.sub(r'<script\b[^>]*>[\s\S]*?</script>', '', content)
        body_text = re.sub(r'<style\b[^>]*>[\s\S]*?</style>', '', body_text)
        
        delimited_stripped = re.sub(r'\\\(.*?\\\)', '', body_text, flags=re.DOTALL)
        delimited_stripped = re.sub(r'\\\[.*?\\\]', '', delimited_stripped, flags=re.DOTALL)
        delimited_stripped = re.sub(r'\$\$.*?\$\$', '', delimited_stripped, flags=re.DOTALL)

        matches = RAW_LATEX_RE.findall(delimited_stripped)
        if matches:
            errors.append(f"MATH: {rel} has {len(matches)} bare LaTeX expressions outside \\( \\): {matches[:5]}")

    exam_data_path = os.path.join(ROOT_DIR, 'exam-data.json')
    if os.path.exists(exam_data_path):
        try:
            with open(exam_data_path, 'r', encoding='utf-8') as f:
                exam_data = json.load(f)
            raw_math_items = 0
            inv_count = 0
            for item in exam_data:
                item_str = json.dumps(item, ensure_ascii=False)
                for char in INVISIBLE_CHARS:
                    inv_count += item_str.count(char)
                for opt in item.get('opts', []):
                    if isinstance(opt, str) and ('\\frac' in opt or '\\sqrt' in opt):
                        if not ('\\(' in opt or '$' in opt or '\\[' in opt):
                            raw_math_items += 1
                q_text = item.get('q', '')
                if ('\\frac' in q_text or '\\sqrt' in q_text) and not ('\\(' in q_text or '$' in q_text or '\\[' in q_text):
                    raw_math_items += 1

            if inv_count > 0:
                errors.append(f"MATH: exam-data.json contains {inv_count} invisible characters")
            if raw_math_items > 0:
                errors.append(f"MATH: exam-data.json contains {raw_math_items} bare math options/questions without \\( \\)")
        except Exception as e:
            errors.append(f"MATH: Error checking exam-data.json: {e}")

    return errors


def check_answer_integrity():
    errors = []
    for filepath in sorted(glob.glob(os.path.join(ROOT_DIR, '**', '*.html'), recursive=True)):
        if any(skip in filepath for skip in ['_backup_', 'node_modules', 'scratch']):
            continue
        rel = os.path.relpath(filepath, ROOT_DIR)
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception as e:
            continue

        exp_matches = re.finditer(r'<div class="exp-text">([\s\S]*?)</div>', content)
        for m in exp_matches:
            exp_inner = m.group(1)
            for pat in ANSWER_LETTER_PATTERNS:
                bad = pat.findall(exp_inner)
                if bad:
                    errors.append(f"ANSWER: {rel} has forbidden answer letter prefix in explanation: {bad[:3]}")
                    break

    for filename in ['universal-modes.css', 'universal-modes.js']:
        path = os.path.join(ROOT_DIR, filename)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                txt = f.read()
            if 'content:"উত্তর' in txt or 'content: "উত্তর' in txt or "content:'উত্তর" in txt or "content: 'উত্তর" in txt:
                errors.append(f"ANSWER: {filename} contains CSS ::before content with 'উত্তর:'")

    return errors


def check_indexes_integrity():
    errors = []
    for filepath in sorted(glob.glob(os.path.join(ROOT_DIR, '**', 'index.html'), recursive=True)):
        if any(skip in filepath for skip in ['_backup_', 'node_modules', 'scratch']):
            continue
        rel = os.path.relpath(filepath, ROOT_DIR)
        dirpath = os.path.dirname(filepath)
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception as e:
            errors.append(f"INDEX: Cannot read {rel}: {e}")
            continue

        empty_titles = re.findall(r'<h[23][^>]*class=[\'"][^\'"]*chapter-title[^\'"]*[\'"][^>]*>\s*</h[23]>', content)
        if empty_titles:
            errors.append(f"INDEX: {rel} has {len(empty_titles)} empty chapter title elements!")

        empty_card_titles = re.findall(r'class=[\'"]card-title[\'"]>\s*<', content)
        if empty_card_titles:
            errors.append(f"INDEX: {rel} has {len(empty_card_titles)} empty card-title elements!")

        links = re.findall(r'href=[\'"]([^#\'"][^\'"]*\.html)[\'"]', content)
        for link in links:
            if link.startswith('http') or link.startswith('/'):
                continue
            target_file = os.path.normpath(os.path.join(dirpath, link))
            if not os.path.exists(target_file):
                errors.append(f"INDEX: {rel} has broken chapter link: {link} (target missing)")

    return errors


def check_portal_integrity():
    errors = []
    portal_path = os.path.join(ROOT_DIR, 'index.html')
    if not os.path.exists(portal_path):
        errors.append("PORTAL: index.html not found!")
        return errors

    try:
        with open(portal_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        errors.append(f"PORTAL: Cannot read index.html: {e}")
        return errors

    # 1. Check for 2 tracks
    required_tracks = ['cadreBookSection', 'nonCadreBookSection']
    for t in required_tracks:
        if f'id="{t}"' not in content and f"id='{t}'" not in content:
            errors.append(f"PORTAL: index.html is missing required track container #{t}")

    # 2. Check for 3 steps in both tracks (6 panels)
    required_panels = [
        'panelCadrePrelim', 'panelCadreWritten', 'panelCadreViva',
        'panelNonCadrePrelim', 'panelNonCadreWritten', 'panelNonCadreViva'
    ]
    for p in required_panels:
        if f'id="{p}"' not in content and f"id='{p}'" not in content:
            errors.append(f"PORTAL: index.html is missing required step panel #{p}")

    # 3. Check for zero disallowed inline styles in index.html (only CSS variables like --p allowed)
    tag_regex = re.compile(r'<([a-z0-9-]+)[^>]*style=([\'"])(.*?)\2[^>]*>', re.IGNORECASE)
    for m in tag_regex.finditer(content):
        tag = m.group(1)
        val = m.group(3).strip()
        parts = [p.strip() for p in val.split(';') if p.strip()]
        non_custom = [p for p in parts if not p.startswith('--')]
        if non_custom:
            errors.append(f"PORTAL: index.html contains disallowed inline style in <{tag}>: {val}")

    # 4. Check for card nesting (No nested cards allowed)
    open_count = 0
    max_depth = 0
    for tag_match in re.finditer(r'<(/?article)[^>]*>', content):
        tname = tag_match.group(1).lower()
        if tname == 'article':
            open_count += 1
            if open_count > max_depth:
                max_depth = open_count
        elif tname == '/article':
            open_count -= 1
    if max_depth > 1:
        errors.append(f"PORTAL: Detected nested <article> cards! Max depth={max_depth}")

    # 5. Check progress bar on every active subject card
    card_matches = re.finditer(r'<article\s+([^>]*)>([\s\S]*?)</article>', content)
    for i, m in enumerate(card_matches):
        attrs = m.group(1)
        cb = m.group(2)
        if 'master-subject-card' not in attrs:
            continue
        if 'aria-disabled="true"' in attrs or 'master-card-disabled' in attrs or 'btn-disabled' in cb:
            continue
        if 'class="master-card-progress"' not in cb or 'class="prog-pct"' not in cb:
            title_m = re.search(r'<h4[^>]*class=[\'"]master-card-title[\'"][^>]*>([\s\S]*?)</h4>', cb)
            c_title = title_m.group(1).strip() if title_m else f"Card #{i+1}"
            errors.append(f"PORTAL: Card '{c_title}' is missing standard progress bar!")

    # 6. Check for emojis in index.html (Strict Zero Emoji Rule)
    emoji_regex = re.compile(
        r'[\U0001F300-\U0001F64F\U0001F680-\U0001F6FF\U0001F900-\U0001F9FF'
        r'\U0001FA00-\U0001FA6F\U0001FA70-\U0001FAFF\u2600-\u26FF\u2700-\u27BF'
        r'\u2300-\u23FF\u2B50\u23F0-\u23F3\u26A1]'
    )
    emoji_found = emoji_regex.findall(content)
    if emoji_found:
        errors.append(f"PORTAL: Found {len(emoji_found)} emojis in index.html! Use inline SVGs only.")

    # 7. Check for dead links on cards
    card_links = re.findall(r"""<article[^>]*class=["'][^"']*master-subject-card[^"']*["'][^>]*>[\s\S]*?href=["']([^"']+\.html)["']""", content)
    for cl in card_links:
        if cl.startswith('http') or cl.startswith('#'):
            continue
        target_path = os.path.normpath(os.path.join(ROOT_DIR, cl.split('#')[0]))
        if not os.path.exists(target_path):
            errors.append(f"PORTAL: Dead link in card: {cl} (file does not exist on disk)")

    return errors


def check_disk_synchronization():
    """Gate G4+ & G7: Single Source of Truth Synchronization & Integrity."""
    errors = []
    portal_path = os.path.join(ROOT_DIR, 'index.html')
    try:
        with open(portal_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        errors.append(f"SYNC: Cannot read index.html: {e}")
        return errors

    # 1. Verify cards against count_disk.py Single Source of Truth
    catalog = count_disk.get_disk_counts()
    card_map = {item['id']: item for item in catalog}
    
    card_pattern = r'<article\s+class="master-subject-card"[^>]*id="([^"]+)"[^>]*data-chapters="([^"]+)"[^>]*data-questions="([^"]+)"'
    cards_found = re.findall(card_pattern, content)
    
    found_ids = set()
    for cid, ch, q in cards_found:
        found_ids.add(cid)
        if cid not in card_map:
            errors.append(f"SYNC: Card {cid} in index.html has no disk mapping in count_disk.py")
            continue
        disk_item = card_map[cid]
        if int(ch) != disk_item['chapters']:
            errors.append(f"SYNC: {cid} chapters mismatch! index.html={ch} vs disk={disk_item['chapters']}")
        if int(q) != disk_item['questions']:
            errors.append(f"SYNC: {cid} questions mismatch! index.html={q} vs disk={disk_item['questions']}")

    for cid in card_map:
        if cid not in found_ids:
            errors.append(f"SYNC: Expected card {cid} not found with data-chapters/data-questions in index.html")

    # 2. Check that all inline SVGs in index.html have explicit width and height
    svg_matches = re.finditer(r'<svg\b([^>]*)>', content, re.IGNORECASE)
    for i, m in enumerate(svg_matches):
        attrs = m.group(1)
        if 'width=' not in attrs or 'height=' not in attrs:
            errors.append(f"SYNC: Inline SVG #{i+1} lacks explicit width and height attributes: <svg {attrs[:40]}>")

    # 3. Check that stepper tabs are semantic buttons (<button type="button" class="portal-step-card ...">)
    step_buttons = ['stepBtnPrelim', 'stepBtnWritten', 'stepBtnViva']
    for sbtn in step_buttons:
        if not re.search(rf'<button\b[^>]*id="{sbtn}"[^>]*role="tab"', content):
            errors.append(f"SYNC: Stepper element #{sbtn} must be a <button type='button' role='tab'>")

    # 4. Check that #ebkAdminLoginBtn is statically placed inside topbar-actions
    if not re.search(r'<div class="topbar-actions">\s*<button type="button" id="ebkAdminLoginBtn"', content):
        errors.append("SYNC: #ebkAdminLoginBtn must be placed statically inside .topbar-actions container")

    # 5. Check for zero forbidden promo terms (C1-C5)
    for term in FORBIDDEN_PROMO_TERMS:
        if term in content:
            errors.append(f"SYNC: Found forbidden unbacked promo term in index.html: '{term}'")

    return errors


def main():
    print("=" * 60)
    print("BCS Static E-Book Library - Static Verification Check")
    print("=" * 60)

    math_errs = check_math_integrity()
    ans_errs = check_answer_integrity()
    idx_errs = check_indexes_integrity()
    portal_errs = check_portal_integrity()
    sync_errs = check_disk_synchronization()

    total_errors = len(math_errs) + len(ans_errs) + len(idx_errs) + len(portal_errs) + len(sync_errs)

    print(f"\n1. Math Data & Delimiter Check: {len(math_errs)} issues")
    for err in math_errs[:10]:
        print(f"   [FAIL] {err}")
    if len(math_errs) > 10:
        print(f"   ... and {len(math_errs) - 10} more math issues")

    print(f"\n2. Answer Presentation Check: {len(ans_errs)} issues")
    for err in ans_errs[:10]:
        print(f"   [FAIL] {err}")
    if len(ans_errs) > 10:
        print(f"   ... and {len(ans_errs) - 10} more answer issues")

    print(f"\n3. Index & Link Integrity Check: {len(idx_errs)} issues")
    for err in idx_errs[:10]:
        print(f"   [FAIL] {err}")
    if len(idx_errs) > 10:
        print(f"   ... and {len(idx_errs) - 10} more index issues")

    print(f"\n4. Portal & Step Architecture Check: {len(portal_errs)} issues")
    for err in portal_errs[:10]:
        print(f"   [FAIL] {err}")
    if len(portal_errs) > 10:
        print(f"   ... and {len(portal_errs) - 10} more portal issues")

    print(f"\n5. Disk Count Synchronization & Content Integrity: {len(sync_errs)} issues")
    for err in sync_errs[:10]:
        print(f"   [FAIL] {err}")
    if len(sync_errs) > 10:
        print(f"   ... and {len(sync_errs) - 10} more sync issues")

    print("\n" + "=" * 60)
    if total_errors == 0:
        print("ALL STATIC CHECKS PASSED (0 errors)")
        print("=" * 60)
        sys.exit(0)
    else:
        print(f"TOTAL STATIC ERRORS: {total_errors}")
        print("=" * 60)
        sys.exit(1)


if __name__ == '__main__':
    main()
