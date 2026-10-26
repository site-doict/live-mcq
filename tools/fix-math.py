import glob
import os
import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

INVISIBLE_CHARS = ['\u2061', '\u2062', '\u2063', '\u200b', '\ufeff']

# Ambiguous formulas to flag for manual review
AMBIGUOUS_PATTERNS = [
    r'\\frac\{3x2\}',
    r'\\frac\{2π3\s*\}',
]

def clean_invisible_characters(text):
    count = 0
    for ch in INVISIBLE_CHARS:
        c = text.count(ch)
        if c > 0:
            count += c
            text = text.replace(ch, '')
    return text, count

def fix_broken_latex_syntax(text):
    fixes = 0

    # 0. TeX \over -> \frac{num}{den} (e.g., 3\over 11 -> \frac{3}{11})
    text, n0 = re.subn(r'([0-9a-zA-Z]+)\s*\\over\s*([0-9a-zA-Z]+)', r'\\frac{\1}{\2}', text)
    fixes += n0

    # 1. \frac with single chars: \frac32 -> \frac{3}{2}, \frac12 -> \frac{1}{2}, \frac 12 -> \frac{1}{2}
    text, n1 = re.subn(r'\\frac\s*([0-9a-zA-Z])\s*([0-9a-zA-Z])(?![0-9a-zA-Z{])', r'\\frac{\1}{\2}', text)
    fixes += n1

    # 1b. \frac with Greek or multi-char numerator: \fracπ6 -> \frac{\pi}{6}, \frac{2π3 } -> \frac{2\pi}{3}
    text, n1b = re.subn(r'\\frac\s*π\s*([0-9]+)', r'\\frac{\\pi}{\1}', text)
    text, n1c = re.subn(r'\\frac\s*\{\s*2π3\s*\}', r'\\frac{2\\pi}{3}', text)
    fixes += n1b + n1c

    # 2. \frac3{64} -> \frac{3}{64}
    text, n2 = re.subn(r'\\frac\s*([0-9a-zA-Z])\s*\{([^}]+)\}', r'\\frac{\1}{\2}', text)
    fixes += n2

    # 3. \frac{3}2 -> \frac{3}{2}
    text, n3 = re.subn(r'\\frac\s*\{([^}]+)\}\s*([0-9a-zA-Z])(?![0-9a-zA-Z{])', r'\\frac{\1}{\2}', text)
    fixes += n3

    # 3b. \frac x2 -> \frac{x}{2}
    text, n3b = re.subn(r'\\frac\s+([a-zA-Z0-9])\s*([0-9a-zA-Z])(?![0-9a-zA-Z{])', r'\\frac{\1}{\2}', text)
    fixes += n3b

    # 4. Unbracketed \sqrt: \sqrt3 -> \sqrt{3}, \sqrt 2 -> \sqrt{2}, 8\sqrt3 -> 8\sqrt{3}
    text, n4 = re.subn(r'\\sqrt\s*([0-9a-zA-Z])(?![0-9a-zA-Z{])', r'\\sqrt{\1}', text)
    fixes += n4

    # 5. log_x324 -> \log_{x} 324 or log_{x}324 (handle both bare and \log)
    text, n5 = re.subn(r'(?<!\\)log_([a-zA-Z0-9])([0-9]+)', r'\\log_{\1} \2', text)
    text, n6 = re.subn(r'\\log_([a-zA-Z0-9])([0-9]+)', r'\\log_{\1} \2', text)
    text, n7 = re.subn(r'(?<!\\)log_([a-zA-Z0-9]+)', r'\\log_{\1}', text)
    fixes += n5 + n6 + n7

    # 6. Fix extra brackets like ...{\frac3{64}} -> ... + \frac{3}{64}
    text, n8 = re.subn(r'\.\.\.\s*\{\s*\\frac\s*\{?([^}]+)\}?\s*\{([^}]+)\}\s*\}', r'\\dots + \\frac{\1}{\2}', text)
    # Fix standard dots in series
    text, n9 = re.subn(r'\+\s*\.\.\.\s*\+', r'+ \\dots +', text)
    fixes += n8 + n9

    return text, fixes

def clean_dollar_artifacts(text):
    # 1. Remove nested $\( and \)$
    text = re.sub(r'\$\s*\\\(\s*', r'\\(', text)
    text = re.sub(r'\s*\\\)\s*\$', r'\\)', text)
    # 2. Convert single $...$ containing math to \( ... \)
    def convert_single_dollar(m):
        inner = m.group(1).strip()
        if re.search(r'\\[a-zA-Z]+|[=+\-*/^_{}]|\b[a-zA-Z]\b', inner):
            return f"\\( {inner} \\)"
        return m.group(0)
    text = re.sub(r'(?<!\$)\$(?!\$)(.*?)(?<!\$)\$(?!\$)', convert_single_dollar, text)
    return text

def wrap_undelimited_math(text, math_review_list, filename):
    # Splits by existing tags, scripts, and math blocks
    parts = re.split(r'(<[^>]+>|\\\(.*?\\\)|\\\[.*?\\\]|\$\$.*?\$\$)', text, flags=re.DOTALL)
    wrapped_count = 0
    new_parts = []

    # Patterns that indicate mathematical expressions that need \( ... \)
    has_latex = re.compile(r'\\(?:frac|sqrt|log|cdots|dots|times|div|pm|approx|le|ge|neq|pi|theta|alpha|beta|sigma|sum|int|infty|in|subset)')
    # Specific known math golden fixtures outside tags
    math_exprs = [
        (re.compile(r'x\^4-2x\+1'), r'x^4-2x+1'),
        (re.compile(r'x\s*–\s*3'), r'x - 3'),
        (re.compile(r'x\^2-\(p\+q\)x\+pq=0'), r'x^2-(p+q)x+pq=0'),
        (re.compile(r'\\?\{p\s*,\s*q\\?\}'), r'\{p,q\}'),
        (re.compile(r'\\log_x\s*324=4'), r'\log_x 324 = 4'),
    ]

    for part in parts:
        if not part:
            continue
        if part.startswith('<') or part.startswith(r'\(') or part.startswith(r'\[') or part.startswith('$$'):
            new_parts.append(part)
            continue

        # Check for specific unbracketed expressions first
        for pat, rep in math_exprs:
            if pat.search(part):
                def replace_expr(m):
                    nonlocal wrapped_count
                    wrapped_count += 1
                    return f"\\( {rep} \\)"
                part = pat.sub(replace_expr, part)

        if has_latex.search(part):
            math_token_pattern = re.compile(
                r'((?:[0-9a-zA-Z\s\+\-\*\/=\(\)\^_{}\.]*?\\(?:frac|sqrt|log|cdots|dots|times|div|pm|approx|le|ge|neq|pi|theta|alpha|beta|sigma|sum|int)[0-9a-zA-Z\s\+\-\*\/=\(\)\^_{}\.\\]*))'
            )

            def replacer(m):
                nonlocal wrapped_count
                formula = m.group(1).strip()
                trailing = ''
                while formula and formula[-1] in '।?:,;!':
                    trailing = formula[-1] + trailing
                    formula = formula[:-1].strip()

                if not formula:
                    return m.group(1)

                # Check if ambiguous
                for amb in AMBIGUOUS_PATTERNS:
                    if re.search(amb, formula):
                        math_review_list.append((filename, "AMBIGUOUS", formula, f"\\( {formula} \\) (হস্তচালিত যাচাই প্রয়োজন)"))
                        return m.group(1)

                wrapped_count += 1
                math_review_list.append((filename, "WRAPPED", formula, f"\\( {formula} \\)"))
                return f"\\( {formula} \\){trailing}"

            part = math_token_pattern.sub(replacer, part)

            # Wrap remaining bare LaTeX commands like \le, \in, \times, etc.
            def wrap_single_latex(m):
                nonlocal wrapped_count
                cmd = m.group(0).strip()
                for amb in AMBIGUOUS_PATTERNS:
                    if re.search(amb, cmd):
                        math_review_list.append((filename, "AMBIGUOUS", cmd, f"\\( {cmd} \\) (হস্তচালিত যাচাই প্রয়োজন)"))
                        return cmd
                wrapped_count += 1
                return f"\\( {cmd} \\)"

            part = re.sub(r'\\frac\s*\{[^}]*\}\s*\{[^}]*\}|\\sqrt\s*\{[^}]*\}|\\log_[0-9a-zA-Z]+|\\(?:times|div|pm|neq|approx|le|ge|in|subset)', wrap_single_latex, part)

        new_parts.append(part)

    return ''.join(new_parts), wrapped_count

def process_html_file(filepath, dry_run=True, math_review_list=None):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    orig = content
    content, inv_count = clean_invisible_characters(content)
    content, fix_count = fix_broken_latex_syntax(content)
    content = clean_dollar_artifacts(content)
    content, wrap_count = wrap_undelimited_math(content, math_review_list, filepath)

    is_modified = (content != orig)
    if is_modified and not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    return is_modified, inv_count, fix_count, wrap_count

def process_exam_data(filepath, dry_run=True, math_review_list=None):
    if not os.path.exists(filepath):
        return False, 0, 0, 0

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total_inv = 0
    total_fixes = 0
    total_wraps = 0
    modified = False

    def clean_and_wrap_str(s, field_name, item_id):
        nonlocal total_inv, total_fixes, total_wraps, modified
        if not isinstance(s, str):
            return s
        orig = s
        s, inv = clean_invisible_characters(s)
        total_inv += inv
        s, fix = fix_broken_latex_syntax(s)
        total_fixes += fix
        s = clean_dollar_artifacts(s)

        # Check if option or question contains math indicators
        has_math = ('\\frac' in s or '\\sqrt' in s or '\\log' in s or '\\times' in s or
                    '\\pm' in s or '\\approx' in s or '\\pi' in s or 'x^4' in s or '324=4' in s or
                    '\\le' in s or '\\ge' in s or '\\in' in s or '\\div' in s or '\\neq' in s)

        if has_math:
            # Check if ambiguous
            is_amb = any(re.search(pat, s) for pat in AMBIGUOUS_PATTERNS)
            if is_amb:
                math_review_list.append((f"exam-data.json (ID {item_id})", "AMBIGUOUS", s, "হস্তচালিত যাচাই প্রয়োজন"))
            elif not ('\\(' in s or '$' in s or '\\[' in s):
                if field_name == 'opts':
                    s = f"\\({s.strip()}\\)"
                    total_wraps += 1
                else:
                    s, wraps = wrap_undelimited_math(s, math_review_list, f"exam-data.json (ID {item_id})")
                    total_wraps += wraps
            else:
                # Might have partial bare commands even if some \( exists
                s, wraps = wrap_undelimited_math(s, math_review_list, f"exam-data.json (ID {item_id})")
                total_wraps += wraps

        if s != orig:
            modified = True
        return s

    for item in data:
        item_id = item.get('id', '?')
        # clean question text
        if 'q' in item:
            item['q'] = clean_and_wrap_str(item['q'], 'q', item_id)
        # clean options
        if 'opts' in item and isinstance(item['opts'], list):
            new_opts = []
            for opt in item['opts']:
                new_opts.append(clean_and_wrap_str(opt, 'opts', item_id))
            item['opts'] = new_opts
        # clean explanation
        if 'exp' in item and item['exp']:
            item['exp'] = clean_and_wrap_str(item['exp'], 'exp', item_id)

    if modified and not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    return modified, total_inv, total_fixes, total_wraps

def main():
    dry_run = '--apply' not in sys.argv
    print(f"=== Math Standardization Engine (dry_run={dry_run}) ===")

    math_review_list = []
    total_files_mod = 0
    total_inv = 0
    total_syntax = 0
    total_wraps = 0

    # 1. Process exam-data.json
    exam_data_path = 'exam-data.json'
    mod_exam, inv_exam, fix_exam, wrap_exam = process_exam_data(exam_data_path, dry_run=dry_run, math_review_list=math_review_list)
    if mod_exam:
        total_files_mod += 1
        total_inv += inv_exam
        total_syntax += fix_exam
        total_wraps += wrap_exam
        print(f"[exam-data.json]: inv={inv_exam}, syntax={fix_exam}, wrapped={wrap_exam}")

    # 2. Process all HTML files
    all_html = sorted(glob.glob('**/*.html', recursive=True))
    target_html = [f for f in all_html if not any(skip in f for skip in ['_backup_', 'node_modules', 'scratch'])]

    for f in target_html:
        mod, inv, fix, wrap = process_html_file(f, dry_run=dry_run, math_review_list=math_review_list)
        if mod:
            total_files_mod += 1
            total_inv += inv
            total_syntax += fix
            total_wraps += wrap
            if inv > 0 or fix > 0 or wrap > 0:
                print(f"[{f}]: inv={inv}, syntax={fix}, wrapped={wrap}")

    print("\n" + "=" * 50)
    print(f"Summary (dry_run={dry_run}):")
    print(f"  Files modified: {total_files_mod}")
    print(f"  Invisible characters removed: {total_inv}")
    print(f"  Syntax fixes: {total_syntax}")
    print(f"  Formulas wrapped in \\( \\): {total_wraps}")
    print("=" * 50)

    # Write review documentation
    review_path = os.path.join('docs', 'math-review.md')
    os.makedirs('docs', exist_ok=True)
    with open(review_path, 'w', encoding='utf-8') as rf:
        rf.write("# Math Formula Transformation Review Log\n\n")
        rf.write(f"Total transformation events: {len(math_review_list)}\n\n")
        rf.write("## Ambiguous or OCR-Damaged Cases (Preserved for Human Review)\n\n")
        ambiguous = [item for item in math_review_list if item[1] == 'AMBIGUOUS']
        rf.write(f"Found {len(ambiguous)} ambiguous cases:\n\n")
        for fn, typ, orig, trans in ambiguous:
            rf.write(f"- **File:** `{fn}` | **Original:** `{orig}` | **Note:** {trans}\n")

        rf.write("\n## Sample Transformed Math Expressions\n\n")
        rf.write("| ক্রম | ফাইল | ধরন | মূল রাশি | রূপান্তরিত KaTeX রাশি |\n")
        rf.write("|:---:|---|:---:|---|---|\n")
        wrapped = [item for item in math_review_list if item[1] != 'AMBIGUOUS']
        for i, (fn, typ, orig, trans) in enumerate(wrapped[:100], 1):
            clean_orig = orig.replace('|', '\\|')
            clean_trans = trans.replace('|', '\\|')
            rf.write(f"| {i} | `{fn}` | {typ} | `{clean_orig}` | `{clean_trans}` |\n")

    print(f"Written review log to {review_path}")

if __name__ == '__main__':
    main()
