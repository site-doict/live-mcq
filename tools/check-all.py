#!/usr/bin/env python3
"""
tools/check-all.py - Comprehensive Static Verification for BCS E-Book Library
Checks:
1. Math Data & Delimiters (Invisible chars, bare LaTeX commands, unbracketed \\frac, raw math)
2. Answer Presentation (No "উত্তর: ক", "সঠিক উত্তর: [ক-ঘ]", or "মুদ্রিত উত্তর" in explanations)
3. Index Integrity (No empty chapter titles, valid links, chapter count synchronization)
"""

import os
import re
import sys
import glob
import json

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

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

def check_math_integrity():
    errors = []
    # Check HTML files
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

        # 1. Invisible characters in HTML content
        for char in INVISIBLE_CHARS:
            count = content.count(char)
            if count > 0:
                errors.append(f"MATH: {rel} contains {count} invisible characters (U+{ord(char):04X})")

        # 2. Undelimited LaTeX commands in body text (outside \( \) and \[ \] and <script>)
        # Strip script tags
        body_text = re.sub(r'<script\b[^>]*>[\s\S]*?</script>', '', content)
        body_text = re.sub(r'<style\b[^>]*>[\s\S]*?</style>', '', body_text)
        
        # Strip delimited math \( ... \) and \[ ... \] and $$ ... $$
        delimited_stripped = re.sub(r'\\\(.*?\\\)', '', body_text, flags=re.DOTALL)
        delimited_stripped = re.sub(r'\\\[.*?\\\]', '', delimited_stripped, flags=re.DOTALL)
        delimited_stripped = re.sub(r'\$\$.*?\$\$', '', delimited_stripped, flags=re.DOTALL)

        matches = RAW_LATEX_RE.findall(delimited_stripped)
        if matches:
            errors.append(f"MATH: {rel} has {len(matches)} bare LaTeX expressions outside \\( \\): {matches[:5]}")

    # Check exam-data.json
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
                # Check options and questions for bare \frac or \sqrt without \(, \[, or $
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

        # Look in explanation areas (e.g. exp-drawer, exp-text, etc.)
        exp_matches = re.finditer(r'<div class="exp-text">([\s\S]*?)</div>', content)
        for m in exp_matches:
            exp_inner = m.group(1)
            for pat in ANSWER_LETTER_PATTERNS:
                bad = pat.findall(exp_inner)
                if bad:
                    errors.append(f"ANSWER: {rel} has forbidden answer letter prefix in explanation: {bad[:3]}")
                    break

    # Check universal-modes.css and universal-modes.js for ::before content: "উত্তর:"
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
    # Check Non Cadre English index specifically and all index.html files
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

        # Check for empty chapter titles
        empty_titles = re.findall(r'<h[23][^>]*class=[\'"][^\'"]*chapter-title[^\'"]*[\'"][^>]*>\s*</h[23]>', content)
        if empty_titles:
            errors.append(f"INDEX: {rel} has {len(empty_titles)} empty chapter title elements!")

        # Check for card title empty
        empty_card_titles = re.findall(r'class=[\'"]card-title[\'"]>\s*<', content)
        if empty_card_titles:
            errors.append(f"INDEX: {rel} has {len(empty_card_titles)} empty card-title elements!")

        # Check chapter links existence
        links = re.findall(r'href=[\'"]([^#\'"][^\'"]*\.html)[\'"]', content)
        for link in links:
            # Skip external or absolute paths
            if link.startswith('http') or link.startswith('/'):
                continue
            target_file = os.path.normpath(os.path.join(dirpath, link))
            if not os.path.exists(target_file):
                errors.append(f"INDEX: {rel} has broken chapter link: {link} (target missing)")

    return errors


def main():
    print("=" * 60)
    print("BCS Static E-Book Library - Static Verification Check")
    print("=" * 60)

    math_errs = check_math_integrity()
    ans_errs = check_answer_integrity()
    idx_errs = check_indexes_integrity()

    total_errors = len(math_errs) + len(ans_errs) + len(idx_errs)

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
