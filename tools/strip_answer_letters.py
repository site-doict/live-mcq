import glob
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def clean_answer_letters(text, review_list, filepath):
    orig = text
    
    # 1. Clean exp-title with redundant letters
    # e.g.: 💡 সঠিক উত্তর: খ | ব্যাখ্যা: -> 💡 বিশদ সমাধান ও ব্যাখ্যা:
    text, n1 = re.subn(r'💡\s*সঠিক উত্তর[:\s]*[ক-ঘa-dA-D]\s*\|\s*ব্যাখ্যা:', '💡 বিশদ সমাধান ও ব্যাখ্যা:', text)
    text, n2 = re.subn(r'💡\s*সঠিক উত্তর[:\s]*[ক-ঘa-dA-D]', '💡 বিশদ সমাধান:', text)
    
    # 2. Clean badges like (সঠিক উত্তর: ক) in explanation titles
    text, n3 = re.subn(r'\(\s*সঠিক উত্তর[:\s]*[ক-ঘa-dA-D](?:\s*ও\s*[ক-ঘa-dA-D])*\s*\)', '', text)
    
    # 3. Clean ans-label rows
    text, n4 = re.subn(r'<div class="ans-label"><strong>সঠিক উত্তর:</strong>\s*[ক-ঘa-dA-D]</div>', '<div class="ans-label"><strong>💡 বিশদ সমাধান:</strong></div>', text)
    
    # 4. Clean leading 'সঠিক উত্তর: খ।' or 'সঠিক উত্তরটি হলো খ।' at start of explanation paragraph
    # <p>সঠিক উত্তর: খ। ...</p>
    def p_replacer(m):
        full = m.group(0)
        p_content = m.group(1)
        cleaned = re.sub(r'^(?:সঠিক উত্তর[:\s]*[ক-ঘa-dA-D][।\.\s]*|সঠিক উত্তরটি[:\s]*(?:হলো|হল)?[:\s]*[ক-ঘa-dA-D][।\.\s]*)', '', p_content).strip()
        if cleaned != p_content:
            review_list.append((filepath, p_content[:80], cleaned[:80]))
            return f"<p>{cleaned}</p>"
        return full

    text, n5 = re.subn(r'<p>([^\n<]+(?:সঠিক উত্তর)[^\n<]+)</p>', p_replacer, text)
    
    total = n1 + n2 + n3 + n4 + n5
    return text, total

def main():
    dry_run = '--apply' not in sys.argv
    print(f"=== Answer Letters Sanitization Engine (dry_run={dry_run}) ===")
    
    files = sorted(glob.glob('*/*.html') + glob.glob('*.html'))
    html_files = [f for f in files if '_backup_' not in f]
    
    review_list = []
    total_mod = 0
    total_subs = 0
    
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as fp:
            content = fp.read()
        cleaned, count = clean_answer_letters(content, review_list, f)
        if cleaned != content:
            total_mod += 1
            total_subs += count
            if not dry_run:
                with open(f, 'w', encoding='utf-8') as fp:
                    fp.write(cleaned)
            print(f"[{f}]: {count} replacements")
            
    print(f"\n==========================================")
    print(f"Summary:")
    print(f"  Files modified: {total_mod} / {len(html_files)}")
    print(f"  Replacements applied: {total_subs}")
    print(f"==========================================")
    
    # Write review documentation
    review_path = os.path.join('docs', 'answer-letter-review.md')
    os.makedirs('docs', exist_ok=True)
    with open(review_path, 'w', encoding='utf-8') as rf:
        rf.write("# Answer Letter Sanitization Review Log\n\n")
        rf.write(f"Total paragraph items reviewed and cleaned: {len(review_list)}\n\n")
        rf.write("| ক্রম | ফাইল | মূল টেক্সট | সংশোধিত টেক্সট |\n")
        rf.write("|:---:|---|---|---|\n")
        for i, (fn, orig, trans) in enumerate(review_list[:250], 1):
            clean_orig = orig.replace('|', '\\|')
            clean_trans = trans.replace('|', '\\|')
            rf.write(f"| {i} | `{fn}` | `{clean_orig}` | `{clean_trans}` |\n")
            
    print(f"Written review log to {review_path}")

if __name__ == '__main__':
    main()
