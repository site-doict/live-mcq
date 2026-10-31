#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/count_disk.py
Single Source of Truth for physical file and question counts on disk.
Counts exact chapters/exams and questions for each card across the library.
Supports human-readable terminal output, markdown table, and JSON format.
"""

import os
import glob
import re
import sys
import json
import argparse

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

CARD_DEFINITIONS = [
    # Cadre Prelim
    ('cadre-card-01', 'Live MCQ Bangla Language', 'Cadre Prelim'),
    ('cadre-card-02', 'Live MCQ Bangla Literature', 'Cadre Prelim'),
    ('cadre-card-03', 'Live MCQ English Grammar', 'Cadre Prelim'),
    ('cadre-card-04', 'Live MCQ English Literature', 'Cadre Prelim'),
    ('cadre-card-05', 'Live MCQ Bangladesh', 'Cadre Prelim'),
    ('cadre-card-06', 'Live MCQ International', 'Cadre Prelim'),
    ('cadre-card-07', 'Live MCQ Geography', 'Cadre Prelim'),
    ('cadre-card-08', 'Live MCQ General Science', 'Cadre Prelim'),
    ('cadre-card-09', 'Live MCQ Computer & IT', 'Cadre Prelim'),
    ('cadre-card-10', 'Live MCQ Mathematical Reasoning', 'Cadre Prelim'),
    ('cadre-card-11', 'Live MCQ Mental Ability', 'Cadre Prelim'),
    ('cadre-card-12', 'Live MCQ Ethics & Good Governance', 'Cadre Prelim'),
    # Non-Cadre Prelim
    ('nc-card-01', 'Non Cadre Bangla Literature', 'Non-Cadre Prelim'),
    ('nc-card-02', 'Non Cadre Bangla Grammar', 'Non-Cadre Prelim'),
    ('nc-card-03', 'Non Cadre English', 'Non-Cadre Prelim'),
    ('nc-card-04', 'Non Cadre General Science', 'Non-Cadre Prelim'),
    ('nc-card-05', 'Non Cadre Bangladesh', 'Non-Cadre Prelim'),
    ('nc-card-06', 'Non Cadre International', 'Non-Cadre Prelim'),
    ('nc-card-07', 'Non Cadre Arithmetic', 'Non-Cadre Prelim'),
    ('nc-card-08', 'Non Cadre Algebra', 'Non-Cadre Prelim'),
    ('nc-card-09', 'Non Cadre Geometry', 'Non-Cadre Prelim'),
    ('nc-card-10', 'Non Cadre Trigonometry & Higher Math', 'Non-Cadre Prelim'),
    ('nc-card-11', 'Non Cadre Mental Ability', 'Non-Cadre Prelim'),
    ('nc-card-12', 'Non Cadre Geography & Environment', 'Non-Cadre Prelim'),
    ('nc-card-13', 'Non Cadre Computer & IT', 'Non-Cadre Prelim'),
    ('nc-card-14', 'Non Cadre Ethics & Good Governance', 'Non-Cadre Prelim'),
    ('nc-card-15', 'Non Cadre Job Solution', 'Non-Cadre Prelim'),
    ('nc-card-16', 'Inception Year Book 2025-2026', 'Non-Cadre Prelim'),
    # Non-Cadre Written
    ('nc-written-01', 'PSC & IBA Written Job Solution', 'Non-Cadre Written')
]

EXCLUDED_FILES = {
    'index.html',
    'subjects.html',
    'analysis-non-cadre-questions.html',
    'guide-sub-registrar-2026.html'
}

def count_questions_in_file(filepath):
    """Accurately count questions in an HTML chapter file."""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    
    # Priority 1: JS question array with opts / options
    opts_matches = len(re.findall(r'[\'"]?(?:opts|options)[\'"]?\s*:\s*\[', c))
    if opts_matches > 0:
        return opts_matches
    
    # Priority 2: totalQuestions variable in script
    tq = re.findall(r'totalQuestions\s*[:=]\s*(\d+)', c)
    if tq:
        return int(tq[0])
    
    # Priority 3: HTML question cards (q-card, mcq-card, quiz-card)
    cards = len(re.findall(r'<[a-z0-9]+\s+[^>]*class="[^"]*(?:\bq-card\b|\bmcq-card\b|\bquiz-card\b)', c, re.IGNORECASE))
    if cards > 0:
        return cards
    
    # Priority 4: count distinct question containers or number headers
    q_num = len(re.findall(r'class="[^"]*(?:\bq-num\b|\bq-number\b|\bq-header\b)', c, re.IGNORECASE))
    if q_num > 0:
        return q_num
        
    # Priority 5: distinct data-correct="true"
    dc_true = len(re.findall(r'data-correct=[\'"]true[\'"]', c, re.IGNORECASE))
    if dc_true > 0:
        return dc_true
        
    return 0

def get_disk_counts():
    """Retrieve full catalog of disk counts."""
    catalog = []
    
    for cid, folder_name, section in CARD_DEFINITIONS:
        fpath = os.path.join(ROOT_DIR, folder_name)
        all_html = sorted(glob.glob(os.path.join(fpath, '*.html')))
        clean_files = [f for f in all_html if os.path.basename(f) not in EXCLUDED_FILES]
        
        if cid == 'nc-written-01':
            data_file = os.path.join(fpath, 'data', 'written_questions_data.js')
            with open(data_file, 'r', encoding='utf-8') as df:
                txt = df.read()
            idx = txt.find('[')
            q_count = len(json.loads(txt[idx:].strip().rstrip(';')))
            ch_count = 158 # 158 distinct exams in data
        else:
            ch_count = len(clean_files)
            q_count = 0
            for f in clean_files:
                q_count += count_questions_in_file(f)
        
        catalog.append({
            'id': cid,
            'folder': folder_name,
            'section': section,
            'chapters': ch_count,
            'questions': q_count
        })
        
    return catalog

def format_markdown_table(catalog):
    md = []
    md.append("| Card ID | বিভাগ / বিষয় | ফোল্ডার | ডিস্ক পরিচ্ছেদ / পরীক্ষা | ডিস্ক প্রশ্ন |")
    md.append("|:---|:---|:---|:---:|:---:|")
    for item in catalog:
        md.append(f"| `{item['id']}` | {item['section']} | `{item['folder']}` | {item['chapters']} | {item['questions']:,} |")
    
    cadre_ch = sum(x['chapters'] for x in catalog if x['section'] == 'Cadre Prelim')
    cadre_q = sum(x['questions'] for x in catalog if x['section'] == 'Cadre Prelim')
    nc_ch = sum(x['chapters'] for x in catalog if x['section'] == 'Non-Cadre Prelim')
    nc_q = sum(x['questions'] for x in catalog if x['section'] == 'Non-Cadre Prelim')
    w_ch = sum(x['chapters'] for x in catalog if x['section'] == 'Non-Cadre Written')
    w_q = sum(x['questions'] for x in catalog if x['section'] == 'Non-Cadre Written')
    total_ch = cadre_ch + nc_ch + w_ch
    total_q = cadre_q + nc_q + w_q
    
    md.append(f"| **ক্যাডার প্রিলিমিনারি মোট** | **১২টি বিষয়** | - | **{cadre_ch}** | **{cadre_q:,}** |")
    md.append(f"| **নন-ক্যাডার প্রিলিমিনারি মোট** | **১৬টি বই/বিষয়** | - | **{nc_ch}** | **{nc_q:,}** |")
    md.append(f"| **নন-ক্যাডার লিখিত মোট** | **লিখিত প্রশ্নব্যাংক** | - | **{w_ch} পরীক্ষা** | **{w_q:,}** |")
    md.append(f"| **সর্বমোট লাইব্রেরি সংগ্রহ** | **২৯টি কার্ড** | - | **{total_ch}** | **{total_q:,}** |")
    return "\n".join(md)

def main():
    parser = argparse.ArgumentParser(description="Calculate exact disk counts for static e-book portal.")
    parser.add_argument('--json', action='store_true', help="Output JSON format")
    parser.add_argument('--markdown', action='store_true', help="Output Markdown table")
    args = parser.parse_args()
    
    catalog = get_disk_counts()
    
    if args.json:
        print(json.dumps(catalog, indent=2, ensure_ascii=False))
        return
        
    if args.markdown:
        print(format_markdown_table(catalog))
        return
        
    print(f"{'Card ID':<15} | {'Section':<18} | {'Folder':<36} | {'Disk Ch':<7} | {'Disk Q':<7}")
    print("-" * 92)
    for item in catalog:
        print(f"{item['id']:<15} | {item['section']:<18} | {item['folder']:<36} | {item['chapters']:<7} | {item['questions']:<7}")
    print("-" * 92)
    cadre_ch = sum(x['chapters'] for x in catalog if x['section'] == 'Cadre Prelim')
    cadre_q = sum(x['questions'] for x in catalog if x['section'] == 'Cadre Prelim')
    nc_ch = sum(x['chapters'] for x in catalog if x['section'] == 'Non-Cadre Prelim')
    nc_q = sum(x['questions'] for x in catalog if x['section'] == 'Non-Cadre Prelim')
    w_ch = sum(x['chapters'] for x in catalog if x['section'] == 'Non-Cadre Written')
    w_q = sum(x['questions'] for x in catalog if x['section'] == 'Non-Cadre Written')
    print(f"Cadre Prelim Total:     {cadre_ch:>4} chapters, {cadre_q:>6} questions")
    print(f"Non-Cadre Prelim Total: {nc_ch:>4} chapters, {nc_q:>6} questions")
    print(f"Non-Cadre Written:      {w_ch:>4} exams,    {w_q:>6} questions")
    print(f"Total Disk Library:     {cadre_ch+nc_ch+w_ch:>4} items,     {cadre_q+nc_q+w_q:>6} questions")

if __name__ == '__main__':
    main()
