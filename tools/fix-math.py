import glob
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

INVISIBLE_CHARS = ['\u2061', '\u2062', '\u2063', '\u200b', '\ufeff']

def clean_invisible_characters(text):
    count = 0
    for ch in INVISIBLE_CHARS:
        c = text.count(ch)
        if c > 0:
            count += c
            text = text.replace(ch, '')
    return text, count

def fix_broken_latex_syntax(text):
    # 1. \frac32 -> \frac{3}{2}
    # \frac followed by single digit numerator and single digit denominator
    text, n1 = re.subn(r'\\frac\s*([0-9a-zA-Z])\s*([0-9a-zA-Z])(?![0-9a-zA-Z{])', r'\\frac{\1}{\2}', text)
    
    # 2. \frac3{64} -> \frac{3}{64}
    text, n2 = re.subn(r'\\frac\s*([0-9a-zA-Z])\s*\{([^}]+)\}', r'\\frac{\1}{\2}', text)
    
    # 3. \frac{3}2 -> \frac{3}{2}
    text, n3 = re.subn(r'\\frac\s*\{([^}]+)\}\s*([0-9a-zA-Z])(?![0-9a-zA-Z{])', r'\\frac{\1}{\2}', text)
    
    # 4. log_x324 -> \log_{x} 324 or log_{x}324
    # e.g. log_x324=4
    text, n4 = re.subn(r'(?<!\\)log_([a-zA-Z0-9])([0-9]+)', r'\\log_{\1} \2', text)
    text, n5 = re.subn(r'\\log_([a-zA-Z0-9])([0-9]+)', r'\\log_{\1} \2', text)
    text, n6 = re.subn(r'(?<!\\)log_([a-zA-Z0-9]+)', r'\\log_{\1}', text)
    
    # 5. Fix extra brackets like ...{\frac3{64}} -> ... + \frac{3}{64}
    text, n7 = re.subn(r'\.\.\.\s*\{\s*\\frac\s*\{?([^}]+)\}?\s*\{([^}]+)\}\s*\}', r'\\cdots + \\frac{\1}{\2}', text)
    
    # 6. Dots in series e.g. +...+ -> + \cdots +
    text, n8 = re.subn(r'\+\s*\.\.\.\s*\+', r'+ \\cdots +', text)
    
    # 7. Chemistry formulas subscript conversion outside tags
    chem_subs = [
        (r'\bCO2\b', 'CO₂'),
        (r'\bH2O\b', 'H₂O'),
        (r'\bO2\b', 'O₂'),
        (r'\bN2\b', 'N₂'),
        (r'\bH2SO4\b', 'H₂SO₄'),
        (r'\bCaCO3\b', 'CaCO₃'),
        (r'\bCH4\b', 'CH₄'),
        (r'\bNH3\b', 'NH₃'),
        (r'\bSO2\b', 'SO₂'),
        (r'\bNO2\b', 'NO₂')
    ]
    n_chem = 0
    for pat, rep in chem_subs:
        text, cnt = re.subn(pat, rep, text)
        n_chem += cnt
    
    total_fixes = n1 + n2 + n3 + n4 + n5 + n6 + n7 + n8 + n_chem
    return text, total_fixes

def wrap_undelimited_math(text, math_review_list, filename):
    # Match expressions with LaTeX commands that are not inside \( ... \) or \[ ... \]
    # We will search within text nodes (outside HTML tags)
    
    # Pattern to identify candidate LaTeX formula chunks:
    # e.g. \frac{...}{...}, \sqrt{...}, \log_{...}, \pm, \approx, etc.
    # We want to match the whole formula like: "3 + \frac{3}{2} + \frac{3}{4} + \cdots + \frac{3}{64}"
    
    parts = re.split(r'(<[^>]+>|\\\(.*?\\\)|\\\[.*?\\\]|\$\$.*?\$\$)', text, flags=re.DOTALL)
    
    wrapped_count = 0
    new_parts = []
    
    # LaTeX formula indicators
    has_latex = re.compile(r'\\(?:frac|sqrt|log|cdots|times|div|pm|approx|le|ge|neq|pi|theta|alpha|beta|sigma|sum|int|infty)')
    
    for part in parts:
        if not part:
            continue
        # If it's an HTML tag or already delimited math, leave as is
        if part.startswith('<') or part.startswith(r'\(') or part.startswith(r'\[') or part.startswith('$$'):
            new_parts.append(part)
            continue
            
        if has_latex.search(part):
            # Check if this entire segment or parts of it should be wrapped
            # Split by lines or punctuation or sentence boundaries
            # In questions/explanations, formulas often appear inline
            # e.g.: "ধারাটিতে \frac{3}{2} হলো" -> "ধারাটিতে \( \frac{3}{2} \) হলো"
            # Match continuous math tokens
            math_token_pattern = re.compile(
                r'((?:[0-9a-zA-Z\s\+\-\*\/=\(\)\^_{}\.]*?\\(?:frac|sqrt|log|cdots|times|div|pm|approx|le|ge|neq|pi|theta|alpha|beta|sigma|sum|int)[0-9a-zA-Z\s\+\-\*\/=\(\)\^_{}\.\\]*))'
            )
            
            def replacer(m):
                nonlocal wrapped_count
                formula = m.group(1).strip()
                # Clean edges: remove leading/trailing Bengali or standard sentence punctuation
                # If formula ends with ? or । or : or comma, don't include that in math
                trailing = ''
                while formula and formula[-1] in '।?:,;!':
                    trailing = formula[-1] + trailing
                    formula = formula[:-1].strip()
                    
                if not formula:
                    return m.group(1)
                    
                wrapped_count += 1
                math_review_list.append((filename, formula, f"\\( {formula} \\)"))
                return f"\\( {formula} \\){trailing}"
                
            updated_part = math_token_pattern.sub(replacer, part)
            new_parts.append(updated_part)
        else:
            new_parts.append(part)
            
    return ''.join(new_parts), wrapped_count

def process_file(filepath, dry_run=True, math_review_list=None):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    orig_content = content
    
    # 1. Clean invisible characters
    content, inv_count = clean_invisible_characters(content)
    
    # 2. Fix broken LaTeX syntax
    content, fix_count = fix_broken_latex_syntax(content)
    
    # 3. Wrap undelimited math
    content, wrap_count = wrap_undelimited_math(content, math_review_list, filepath)
    
    is_modified = (content != orig_content)
    if is_modified and not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
    return is_modified, inv_count, fix_count, wrap_count

def main():
    dry_run = '--apply' not in sys.argv
    print(f"=== Math & Typography Standardization Engine (dry_run={dry_run}) ===")
    
    files = sorted(glob.glob('*/*.html') + glob.glob('*.html'))
    html_files = [f for f in files if '_backup_' not in f]
    
    total_modified = 0
    total_inv = 0
    total_fixes = 0
    total_wraps = 0
    math_review_list = []
    
    for f in html_files:
        mod, inv, fix, wrap = process_file(f, dry_run=dry_run, math_review_list=math_review_list)
        if mod:
            total_modified += 1
            total_inv += inv
            total_fixes += fix
            total_wraps += wrap
            if inv > 0 or fix > 0 or wrap > 0:
                print(f"[{f}]: inv={inv}, syntax_fixes={fix}, wrapped_math={wrap}")
                
    print(f"\n==========================================")
    print(f"Summary:")
    print(f"  Files modified: {total_modified} / {len(html_files)}")
    print(f"  Invisible characters removed: {total_inv}")
    print(f"  LaTeX syntax issues repaired: {total_fixes}")
    print(f"  Formulas wrapped in \\( ... \\): {total_wraps}")
    print(f"==========================================")
    
    # Write review documentation
    review_path = os.path.join('docs', 'math-review.md')
    os.makedirs('docs', exist_ok=True)
    with open(review_path, 'w', encoding='utf-8') as rf:
        rf.write("# Math Formula Transformation Review Log\n\n")
        rf.write(f"Total formulas processed: {len(math_review_list)}\n\n")
        rf.write("| ক্রম | ফাইল | মূল রাশি | রূপান্তরিত KaTeX রাশি |\n")
        rf.write("|:---:|---|---|---|\n")
        for i, (fn, orig, trans) in enumerate(math_review_list[:200], 1):
            clean_orig = orig.replace('|', '\\|')
            clean_trans = trans.replace('|', '\\|')
            rf.write(f"| {i} | `{fn}` | `{clean_orig}` | `{clean_trans}` |\n")
            
    print(f"Written review log to {review_path}")

if __name__ == '__main__':
    main()
