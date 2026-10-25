#!/usr/bin/env python3
"""
BCS Smart E-Book Library - Index Health and Quality Checker
Zero external dependencies. Scans all index.html files and validates design system rules.
"""

import os
import sys
import re
import urllib.parse
from html.parser import HTMLParser

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INDEX_FILES = [
    'index.html',
    'Live MCQ Bangla Language/index.html',
    'Live MCQ Bangla Literature/index.html',
    'Live MCQ Bangladesh/index.html',
    'Live MCQ Computer & IT/index.html',
    'Live MCQ English Grammar/index.html',
    'Live MCQ English Literature/index.html',
    'Live MCQ Ethics & Good Governance/index.html',
    'Live MCQ General Science/index.html',
    'Live MCQ Geography/index.html',
    'Live MCQ International/index.html',
    'Live MCQ Mathematical Reasoning/index.html',
    'Live MCQ Mental Ability/index.html',
    'Non Cadre Bangla Grammar/index.html',
    'Non Cadre Bangla Literature/index.html',
    'Non Cadre English/index.html',
    'Non Cadre General Science/index.html',
    'Non Cadre Bangladesh/index.html',
    'Non Cadre International/index.html',
    'Non Cadre Arithmetic/index.html',
    'Non Cadre Algebra/index.html'
]

REGISTERED_FOLDERS = {
    'Live MCQ Bangla Language',
    'Live MCQ Bangla Literature',
    'Live MCQ Bangladesh',
    'Live MCQ International',
    'Live MCQ English Grammar',
    'Live MCQ English Literature',
    'Live MCQ Geography',
    'Live MCQ General Science',
    'Live MCQ Computer & IT',
    'Live MCQ Mathematical Reasoning',
    'Live MCQ Mental Ability',
    'Live MCQ Ethics & Good Governance',
    'Non Cadre Bangla Grammar',
    'Non Cadre Bangla Literature',
    'Non Cadre English',
    'Non Cadre General Science',
    'Non Cadre Bangladesh',
    'Non Cadre International',
    'Non Cadre Arithmetic',
    'Non Cadre Algebra'
}

class TagBalanceParser(HTMLParser):
    VOID_TAGS = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
                 'link', 'meta', 'param', 'source', 'track', 'wbr'}
    
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        tag_lower = tag.lower()
        if tag_lower not in self.VOID_TAGS:
            self.stack.append((tag_lower, self.getpos()))

    def handle_endtag(self, tag):
        tag_lower = tag.lower()
        if tag_lower in self.VOID_TAGS:
            return
        if not self.stack:
            self.errors.append(f"Unexpected closing tag </{tag_lower}> at line {self.getpos()[0]}")
            return
        last_tag, pos = self.stack.pop()
        if last_tag != tag_lower:
            self.errors.append(f"Mismatched tag: expected </{last_tag}> (from line {pos[0]}), got </{tag_lower}> at line {self.getpos()[0]}")

def check_file(rel_path):
    errors = []
    warnings = []
    full_path = os.path.join(ROOT_DIR, rel_path)
    file_dir = os.path.dirname(full_path)

    if not os.path.exists(full_path):
        return [f"File not found on disk: {rel_path}"], []

    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    is_master = (rel_path == 'index.html')
    folder_name = rel_path.split('/')[0] if not is_master else ''

    # 1. Subject registry verification
    if not is_master:
        if folder_name not in REGISTERED_FOLDERS:
            errors.append(f"Folder '{folder_name}' is not in the subject registry.")

    # 2. Tag balance check
    parser = TagBalanceParser()
    try:
        parser.feed(content)
        if parser.stack:
            unclosed = [f"<{t}> from line {p[0]}" for t, p in parser.stack[-5:]]
            errors.append(f"Unclosed tags at end of file: {', '.join(unclosed)}")
        if parser.errors:
            errors.extend(parser.errors[:5])
    except Exception as e:
        errors.append(f"HTML parsing exception: {str(e)}")

    # 3. Viewport & lang check
    if 'lang="bn"' not in content and "lang='bn'" not in content:
        errors.append('Missing lang="bn" attribute on <html>.')
    
    vp_match = re.search(r'<meta[^>]+name=["\']viewport["\'][^>]+content=["\']([^"\']+)["\']', content, re.I)
    if not vp_match:
        errors.append('Missing viewport meta tag.')
    else:
        vp_val = vp_match.group(1)
        if 'width=device-width' not in vp_val or 'initial-scale=1' not in vp_val:
            errors.append(f"Viewport meta must contain width=device-width, initial-scale=1: found '{vp_val}'")
        if 'maximum-scale' in vp_val or 'user-scalable=no' in vp_val:
            errors.append('Viewport restricts user zoom (maximum-scale or user-scalable=no forbidden).')

    # 4. Standard title pattern
    title_match = re.search(r'<title>([^<]+)</title>', content, re.I)
    if not title_match:
        errors.append('Missing <title> tag.')
    else:
        title_text = title_match.group(1).strip()
        if is_master:
            if 'বিসিএস স্মার্ট ই-বুক লাইব্রেরি' not in title_text:
                errors.append(f"Master title should contain 'বিসিএস স্মার্ট ই-বুক লাইব্রেরি': found '{title_text}'")
        else:
            if '| বিসিএস স্মার্ট ই-বুক লাইব্রেরি' not in title_text:
                errors.append(f"Sub-index title must end with '| বিসিএস স্মার্ট ই-বুক লাইব্রেরি': found '{title_text}'")

    # 5. Required CSS and Scripts
    css_prefix = '' if is_master else '../'
    js_prefix = '' if is_master else '../'

    if f'{css_prefix}ebook-ui.css' not in content:
        errors.append(f"Missing stylesheet link to '{css_prefix}ebook-ui.css'.")
    if f'{js_prefix}ebook-ui.js' not in content:
        errors.append(f"Missing script link to '{js_prefix}ebook-ui.js'.")
    if f'{js_prefix}universal-modes.js' not in content:
        errors.append(f"Missing script link to '{js_prefix}universal-modes.js'.")
    if f'{js_prefix}search-engine.js' not in content:
        errors.append(f"Missing script link to '{js_prefix}search-engine.js'.")

    # 6. ebkSearchMount presence
    if 'id="ebkSearchMount"' not in content and "id='ebkSearchMount'" not in content:
        errors.append('Missing required <div id="ebkSearchMount"> mount point.')

    # 7. Disallowed inline styles (only --custom-property allowed)
    inline_styles = re.findall(r'\bstyle=["\']([^"\']+)["\']', content)
    disallowed_styles = []
    for s in inline_styles:
        s_clean = s.strip()
        # Allow pure CSS custom properties like style="--p: 50%" or style="display:none;" if generated
        parts = [p.strip() for p in s_clean.split(';') if p.strip()]
        non_custom = [p for p in parts if not p.startswith('--') and not p.startswith('display:none')]
        if non_custom:
            disallowed_styles.append('; '.join(non_custom[:2]))
    if disallowed_styles:
        errors.append(f"Found {len(disallowed_styles)} disallowed inline styles (e.g. style=\"{disallowed_styles[0]}\"). Inline styles are forbidden.")

    # 8. English digits in Bengali visible text
    # Strip <script>, <style>, <tag attrs>, and URLs
    text_only = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', ' ', content, flags=re.I)
    text_only = re.sub(r'<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>', ' ', text_only, flags=re.I)
    text_only = re.sub(r'<[^>]+>', ' ', text_only)
    text_only = re.sub(r'https?://[^\s]+', ' ', text_only)
    text_only = re.sub(r'Live\s*MCQ™?', ' ', text_only, flags=re.I)
    text_only = re.sub(r'\bMCQ\b', ' ', text_only, flags=re.I)
    text_only = re.sub(r'\b(?:BCS|PSC|PDF|HTML|CSS|JS|URL|API)\b', ' ', text_only, flags=re.I)

    # Find English digits attached to Bengali letters, e.g. "538টি", "205টি", "1ম খন্ড"
    eng_digit_bn_word = re.findall(r'([0-9]+[\u0980-\u09FF]+|[\u0980-\u09FF]+[0-9]+)', text_only)
    if eng_digit_bn_word:
        errors.append(f"Found English digits mixed with Bengali words: {', '.join(set(eng_digit_bn_word[:5]))}. Must use Bengali numerals (০-৯).")

    # 9. Local hrefs verification
    hrefs = re.findall(r'href=["\']([^"\']+)["\']', content)
    for h in hrefs:
        if h.startswith('http:') or h.startswith('https:') or h.startswith('mailto:') or h.startswith('javascript:') or h.startswith('#'):
            continue
        # Split off query string and hash fragment
        clean_url = urllib.parse.urlsplit(h).path
        if not clean_url:
            continue
        decoded_path = urllib.parse.unquote(clean_url)
        target_path = os.path.normpath(os.path.join(file_dir, decoded_path))
        if not os.path.exists(target_path):
            errors.append(f"Broken href link '{h}' -> target does not exist: {target_path}")

    # 10. Exam link ?subject= parameter check
    exam_links = re.findall(r'href=["\']([^"\']*exam\.html[^"\']*)["\']', content)
    if not is_master:
        if not exam_links:
            errors.append("Sub-index is missing exam link to '../exam.html?subject=...'.")
        else:
            for el in exam_links:
                if 'subject=' not in el:
                    errors.append(f"Exam link '{el}' is missing '?subject=' query parameter.")

    # 11. ASCII slug warning for chapter files
    for h in hrefs:
        if h.endswith('.html') and not h.startswith('http') and not h.endswith('index.html') and not h.endswith('exam.html'):
            fname = os.path.basename(urllib.parse.unquote(h))
            if not re.match(r'^[a-z0-9\-]+\.html$', fname):
                warnings.append(f"Legacy non-ASCII filename in chapter link: '{fname}'")

    return errors, warnings

def main():
    print("=" * 60)
    print("BCS Smart E-Book Library - Index Quality & Health Checker")
    print("=" * 60)

    total_errors = 0
    total_warnings = 0

    for rel in INDEX_FILES:
        print(f"\nChecking: {rel}")
        errors, warnings = check_file(rel)
        if errors:
            print(f"  ❌ FAILED ({len(errors)} errors):")
            for e in errors:
                print(f"     - {e}")
            total_errors += len(errors)
        else:
            print("  ✅ PASSED all validation checks.")
        
        if warnings:
            # Show a condensed warning note
            print(f"  ⚠️  Notice: {len(warnings)} legacy chapter filenames with non-ASCII characters.")
            total_warnings += len(warnings)

    print("\n" + "=" * 60)
    print(f"Validation Summary: {total_errors} errors, {total_warnings} warnings across {len(INDEX_FILES)} index files.")
    print("=" * 60)

    if total_errors > 0:
        sys.exit(1)
    else:
        print("\nAll indexes passed with ZERO errors! 🎉")
        sys.exit(0)

if __name__ == '__main__':
    main()
