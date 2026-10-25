import glob
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def to_bn_num(number):
    bn_digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    return ''.join(bn_digits[int(d)] if d.isdigit() else d for d in str(number))

def count_questions_in_file(filepath):
    if not os.path.exists(filepath):
        return 0
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    # Match questions
    cards = re.findall(r'<(?:article|div)[^>]+class=["\'][^"\']*(?:q-card|mcq-card)[^"\']*', text)
    return len(cards)

def get_h1_and_title(filepath):
    if not os.path.exists(filepath):
        return '', ''
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    t_match = re.search(r'<title>(.*?)</title>', text)
    title = t_match.group(1).strip() if t_match else ''
    
    h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', text, re.DOTALL)
    h1 = ''
    if h1_match:
        # Clean tags
        h1 = re.sub(r'<span[^>]*class=["\']ch-en["\'][^>]*>.*?</span>', '', h1_match.group(1))
        h1 = re.sub(r'<[^>]+>', ' ', h1).strip()
    return title, h1

def fix_subindexes(dry_run=True):
    print(f"=== Sub-Index Restoration Script (dry_run={dry_run}) ===")
    
    targets = [
        'Non Cadre English',
        'Live MCQ Mathematical Reasoning',
        'Live MCQ Geography',
        'Live MCQ Ethics & Good Governance',
        'Live MCQ Mental Ability'
    ]
    
    total_restored = 0
    
    for subj in targets:
        cur_idx_path = os.path.join(subj, 'index.html')
        bak_idx_path = os.path.join('_backup_before_redesign', subj, 'index.html')
        
        if not os.path.exists(cur_idx_path):
            print(f"Skipping {subj}: {cur_idx_path} not found")
            continue
            
        with open(cur_idx_path, 'r', encoding='utf-8') as f:
            cur_html = f.read()
            
        bak_cards_map = {}
        if os.path.exists(bak_idx_path):
            with open(bak_idx_path, 'r', encoding='utf-8') as f:
                bak_html = f.read()
            # Extract cards from backup
            for m in re.finditer(r'<a[^>]+href=["\']([^"\']+\.html)["\'][^>]*>(.*?)</a>', bak_html, re.DOTALL):
                href = m.group(1)
                card_body = m.group(2)
                # extract title, bn, q-count, pages
                title_m = re.search(r'<(?:h2|h3)[^>]*class=["\'][^"\']*(?:card-title|title)[^"\']*["\'][^>]*>(.*?)</(?:h2|h3)>', card_body)
                title = title_m.group(1).strip() if title_m else ''
                
                bn_m = re.search(r'<p[^>]*class=["\'][^"\']*card-bn[^"\']*["\'][^>]*>(.*?)</p>', card_body)
                bn_title = bn_m.group(1).strip() if bn_m else ''
                
                sub_m = re.search(r'<div[^>]*class=["\'][^"\']*card-subtitle[^"\']*["\'][^>]*>(.*?)</div>', card_body)
                sub_title = sub_m.group(1).strip() if sub_m else ''
                
                qs_m = re.search(r'(\d+)\s*টি\s*প্রশ্ন', card_body)
                qs_cnt = qs_m.group(1) if qs_m else ''
                
                pg_m = re.search(r'পৃষ্ঠা[:\s]*([০-৯0-9\s–-]+)', card_body)
                pg_info = pg_m.group(1).strip() if pg_m else ''
                
                bak_cards_map[href] = {
                    'title': title,
                    'bn_title': bn_title,
                    'sub_title': sub_title,
                    'qs_cnt': qs_cnt,
                    'pg_info': pg_info
                }
        
        # Now find cards in cur_html
        new_html = cur_html
        
        # Regex to match card in current HTML
        # <a href="filename.html" class="chapter-card" ...> ... </a>
        card_pattern = re.compile(r'(<a[^>]+href=["\']([^"\']+\.html)["\'][^>]*class=["\'][^"\']*chapter-card[^"\']*["\'][^>]*>)(.*?)(</a>)', re.DOTALL)
        
        def replace_card(match):
            nonlocal total_restored
            opening_tag = match.group(1)
            href = match.group(2)
            card_inner = match.group(3)
            closing_tag = match.group(4)
            
            # Check if title is empty
            title_m = re.search(r'<h2[^>]*class=["\'][^"\']*chapter-title[^"\']*["\'][^>]*>(.*?)</h2>', card_inner)
            existing_title = title_m.group(1).strip() if title_m else ''
            
            # Target file on disk
            target_file_path = os.path.join(subj, href)
            disk_q_count = count_questions_in_file(target_file_path)
            title_tag, h1_tag = get_h1_and_title(target_file_path)
            
            bak_info = bak_cards_map.get(href, {})
            
            # Determine best title
            resolved_title = ''
            if bak_info.get('title'):
                resolved_title = bak_info['title']
                if bak_info.get('bn_title'):
                    resolved_title = f"{resolved_title} <span class=\"ch-sub-title\" style=\"font-size:0.85rem; font-weight:500; display:block; opacity:0.85; margin-top:2px;\">{bak_info['bn_title']}</span>"
            elif h1_tag:
                resolved_title = h1_tag
            elif title_tag:
                resolved_title = title_tag.split('-')[0].split('|')[0].strip()
            else:
                # Format from filename
                resolved_title = href.replace('ch-', '').replace('.html', '').replace('-', ' ').title()
                
            # Determine question count
            final_q_count = disk_q_count if disk_q_count > 0 else (int(bak_info.get('qs_cnt', 0)) if bak_info.get('qs_cnt') else 0)
            bn_q_text = f"{to_bn_num(final_q_count)}টি প্রশ্ন" if final_q_count > 0 else ""
            
            # Determine page info
            pg_info = bak_info.get('pg_info', '')
            bn_pg_text = f"📄 পৃষ্ঠা {pg_info}" if pg_info else ""
            
            # Update title in card_inner
            updated_inner = card_inner
            if title_m:
                old_h2 = title_m.group(0)
                new_h2 = f'<h2 class="chapter-title">{resolved_title}</h2>'
                updated_inner = updated_inner.replace(old_h2, new_h2)
            else:
                # Insert title
                updated_inner = f'<h2 class="chapter-title">{resolved_title}</h2>\n' + updated_inner
                
            # Update question count badge if present or add
            if bn_q_text:
                if '<span class="chapter-meta-item">' in updated_inner or '<span class="qs-badge">' in updated_inner:
                    updated_inner = re.sub(r'(\d+|[০-৯]+)\s*টি\s*প্রশ্ন', bn_q_text, updated_inner)
                else:
                    # check if card-meta exists
                    if '<div class="chapter-meta">' in updated_inner:
                        updated_inner = updated_inner.replace('<div class="chapter-meta">', f'<div class="chapter-meta"><span class="chapter-meta-item">🎯 {bn_q_text}</span>')
                    elif '<div class="chapter-card-header">' in updated_inner:
                        updated_inner = updated_inner.replace('<div class="chapter-card-header">', f'<div class="chapter-card-header"><span class="badge-pill">🎯 {bn_q_text}</span>')
                        
            # Update page badge if available
            if bn_pg_text and 'পৃষ্ঠা' not in updated_inner:
                if '<div class="chapter-meta">' in updated_inner:
                    updated_inner = updated_inner.replace('</div>\n    </a>', f'  <span class="chapter-meta-item">{bn_pg_text}</span>\n    </div>\n    </a>')
                elif '<div class="card-footer">' in updated_inner:
                    updated_inner = updated_inner.replace('<div class="card-footer">', f'<div class="card-footer"><span class="page-info">{bn_pg_text}</span>')
            
            total_restored += 1
            return f"{opening_tag}{updated_inner}{closing_tag}"
            
        new_html = card_pattern.sub(replace_card, cur_html)
        
        print(f"[{subj}]: Processed cards. Modified={new_html != cur_html}")
        
        if not dry_run and new_html != cur_html:
            with open(cur_idx_path, 'w', encoding='utf-8') as f:
                f.write(new_html)
            print(f"  -> Written updated {cur_idx_path}")

    print(f"\nTotal chapter cards restored: {total_restored}")

if __name__ == '__main__':
    dry_run = '--apply' not in sys.argv
    fix_subindexes(dry_run=dry_run)
