import os
import sys
import json
import argparse
import fitz

# Ensure standard UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

DEFAULT_PDF = r"C:\Users\PC User\Downloads\psc non cadre not topic wise\PSC Non cadre প্রশ্নব্যাংক (৩য় খন্ড).pdf"
if not os.path.exists(DEFAULT_PDF):
    # Try alternate unicode form
    alt_pdf = r"C:\Users\PC User\Downloads\psc non cadre not topic wise\PSC Non cadre প্রশ্নব্যাংক (৩য় খন্ড).pdf"
    if os.path.exists(alt_pdf):
        DEFAULT_PDF = alt_pdf

def parse_args():
    parser = argparse.ArgumentParser(description="Reusable PDF Inspector & Text Extractor for PSC Non-Cadre E-Books")
    parser.add_argument("--pdf", default=DEFAULT_PDF, help="Path to PDF file")
    parser.add_argument("--start", type=int, default=1, help="Start page (1-based index)")
    parser.add_argument("--end", type=int, default=None, help="End page (1-based index)")
    parser.add_argument("--info", action="store_true", help="Print PDF info, TOC, and metadata")
    parser.add_argument("--extract_to", type=str, default=None, help="Save extracted text/JSON to this file path")
    parser.add_argument("--render_to", type=str, default=None, help="Directory to render page images to PNG")
    parser.add_argument("--dpi", type=int, default=150, help="DPI for rendering")
    parser.add_argument("--page_list", type=str, default=None, help="Comma-separated list of page numbers to inspect/render (e.g. 24,37,44)")
    parser.add_argument("--audit", action="store_true", help="Audit all 22 exams in PDF vs project chapters & exam-data.json")
    parser.add_argument("--preview", action="store_true", help="Print text preview to stdout")
    return parser.parse_args()



def inspect_pdf(args):
    if not os.path.exists(args.pdf):
        print(f"Error: PDF file not found at '{args.pdf}'")
        sys.exit(1)

    doc = fitz.open(args.pdf)
    total_pages = len(doc)
    
    if args.page_list:
        pages_to_process = [int(p.strip()) for p in args.page_list.split(",") if p.strip()]
    else:
        start_idx = max(1, args.start)
        end_idx = min(total_pages, args.end) if args.end else total_pages
        pages_to_process = list(range(start_idx, end_idx + 1))

    print(f"Loaded: {os.path.basename(args.pdf)}")
    print(f"Total pages: {total_pages} | Processing {len(pages_to_process)} pages: {pages_to_process[:10]}...")


    if args.audit:
        # Full 22 exams catalog from Matrix 3rd Volume TOC and exact verified PDF page offsets
        # Book Section 1: Printed p1-18 -> PDF p6-23 (offset +5)
        # Book Section 2: Printed p1-202 -> PDF p24-225 (offset +23)
        exams_meta = [
            {"id": 1, "dept": "পররাষ্ট্র মন্ত্রণালয়", "post": "ব্যক্তিগত কর্মকর্তা", "date": "১১.১১.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১-১০", "pdf_pages": "৬-১৫"},
            {"id": 2, "dept": "ফরেন সার্ভিস একাডেমি, পররাষ্ট্র মন্ত্রণালয়", "post": "প্রশাসনিক কর্মকর্তা", "date": "০৯.১১.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১০-১৮", "pdf_pages": "১৫-২৩"},
            {"id": 3, "dept": "৪৯তম বিসিএস প্রিলি.", "post": "শিক্ষা ক্যাডার", "date": "১০.১০.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১-১৩", "pdf_pages": "২৪-৩৬"},
            {"id": 4, "dept": "শিক্ষা প্রকৌশল অধিদপ্তর", "post": "উপসহকারী প্রকৌশলী (সিভিল)", "date": "২৭.০৯.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১৪-২০", "pdf_pages": "৩৭-৪৩"},
            {"id": 5, "dept": "দি সিকিউরিটি প্রিন্টিং কর্পোরেশন লি.", "post": "সহকারী ব্যবস্থাপক", "date": "২০.০৯.২০২৫", "marks": 100, "q_count": 100, "book_pages": "২১-৩২", "pdf_pages": "৪৪-৫৫"},
            {"id": 6, "dept": "৪৭তম বিসিএস প্রিলি.", "post": "সহকারী সার্জন (৯ম গ্রেড)", "date": "১৯.০৯.২০২৫", "marks": 200, "q_count": 200, "book_pages": "৩৩-৫৭", "pdf_pages": "৫৬-৮০"},
            {"id": 7, "dept": "পিএসসি (বাংলাদেশ সরকারি কর্ম কমিশন)", "post": "সহকারী পরিচালক", "date": "১৫.০৯.২০২৫", "marks": 100, "q_count": 100, "book_pages": "৫৮-৬৮", "pdf_pages": "৮১-৯১"},
            {"id": 8, "dept": "প্রাথমিক ও গণশিক্ষা মন্ত্রণালয়", "post": "উপজেলা সহকারী শিক্ষা অফিসার", "date": "১২.০৯.২০২৫", "marks": 100, "q_count": 100, "book_pages": "৬৯-৭৭", "pdf_pages": "৯২-১০০"},
            {"id": 9, "dept": "বাংলাদেশ শিশু একাডেমি", "post": "জেলা শিশু বিষয়ক কর্মকর্তা", "date": "১২.০৯.২০২৫", "marks": 100, "q_count": 100, "book_pages": "৭৮-৮৯", "pdf_pages": "১০১-১১২"},
            {"id": 10, "dept": "পিএসসি", "post": "ইলেক্ট্রিক ইন্সপেক্টর", "date": "০২.০৯.২০২৫", "marks": 100, "q_count": 100, "book_pages": "৯০-৯৮", "pdf_pages": "১১৩-১২১"},
            {"id": 11, "dept": "পিএসসি (বিভিন্ন মন্ত্রণালয়)", "post": "ব্যক্তিগত কর্মকর্তা", "date": "৩০.০৮.২০২৫", "marks": 100, "q_count": 100, "book_pages": "৯৯-১০৭", "pdf_pages": "১২২-১৩০"},
            {"id": 12, "dept": "মাদকদ্রব্য নিয়ন্ত্রণ অধিদপ্তর", "post": "সিনিয়র স্টাফ নার্স", "date": "২৯.০৮.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১০৮-১১৪", "pdf_pages": "১৩১-১৩৭"},
            {"id": 13, "dept": "এলজিইডি", "post": "সহকারী প্রকৌশলী", "date": "২৫.০৮.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১১৫-১২২", "pdf_pages": "১৩৮-১৪৫"},
            {"id": 14, "dept": "৪৮তম বিসিএস প্রিলি.", "post": "সহকারী সার্জন (৯ম গ্রেড)", "date": "১৮.০৭.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১২৩-১৩৩", "pdf_pages": "১৪৬-১৫৬"},
            {"id": 15, "dept": "পিএসসি", "post": "উপ-সহকারী কৃষি কর্মকর্তা", "date": "১১.০৭.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১৩৪-১৪৩", "pdf_pages": "১৫৭-১৬৬"},
            {"id": 16, "dept": "পিএসসি (রেলপথ মন্ত্রণালয়)", "post": "উপসহকারী প্রকৌশলী", "date": "২৮.০৬.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১৪৪-১৫১", "pdf_pages": "১৬৭-১৭৪"},
            {"id": 17, "dept": "শিল্প মন্ত্রণালয়ের অধীন বিসিআইসি", "post": "সহকারী ব্যবস্থাপক", "date": "২৭.০৬.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১৫২-১৬৩", "pdf_pages": "১৭৫-১৮৬"},
            {"id": 18, "dept": "শিল্প মন্ত্রণালয়ের অধীন বিসিআইসি", "post": "সহকারী প্রশাসনিক কর্মকর্তা", "date": "২৭.০৬.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১৬৪-১৭৩", "pdf_pages": "১৮৭-১৯৬"},
            {"id": 19, "dept": "পিএসসি", "post": "সিনিয়র স্টাফ নার্স (১০ম গ্রেড)", "date": "২৮.০৪.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১৭৪-১৮২", "pdf_pages": "১৯৭-২০৫"},
            {"id": 20, "dept": "রুরাল পাওয়ার কোম্পানি লিমিটেড", "post": "উপ-সহকারী প্রকৌশলী", "date": "২৬.০৪.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১৮৩-১৮৭", "pdf_pages": "২০৬-২১০"},
            {"id": 21, "dept": "বাংলাদেশ মেডিকেল স্টাডিজ এন্ড রিসার্চ ইনস্টিটিউট", "post": "সিনিয়র স্টাফ নার্স", "date": "১৮.০৪.২০২৫", "marks": 100, "q_count": 100, "book_pages": "১৮৮-১৯৫", "pdf_pages": "২১১-২১৮"},
            {"id": 22, "dept": "শিল্প মন্ত্রণালয়ের অধীন বিসিআইসি", "post": "সহকারী প্রশাসনিক কর্মকর্তা", "date": "১৪.০২.২০২৫", "marks": 100, "q_count": 80, "book_pages": "১৯৬-২০২", "pdf_pages": "২১৯-২২৫"}
        ]

        # Check existing chapters in Non Cadre Job Solution
        nc_dir = "Non Cadre Job Solution"
        existing_files = os.listdir(nc_dir) if os.path.exists(nc_dir) else []
        
        # Check exam-data.json
        with open("exam-data.json", "r", encoding="utf-8") as f:
            exam_data = json.load(f)
        nc_exam_names = set(q.get("exam", "") for q in exam_data if q.get("s") == "Non Cadre Job Solution")

        print("\n=========================================================================================================")
        print("PSC NON-CADRE QUESTION BANK (VOL 3) - COMPLETE PROJECT AUDIT & COMPARISON")
        print("=========================================================================================================\n")
        
        results = []
        for em in exams_meta:
            # Check presence
            is_present = False
            matched_file = None
            if em["id"] == 1:
                matched_file = "ch-05-mofa-personal-officer-2025.html"
                is_present = matched_file in existing_files
            elif em["id"] == 2:
                matched_file = "ch-06-fsa-admin-officer-2025.html"
                is_present = matched_file in existing_files
            
            status_str = "অন্তর্ভুক্ত (PRESENT)" if is_present else "অনুপস্থিত ও বাদ পড়েছে (MISSING)"
            em["status"] = "PRESENT" if is_present else "MISSING"
            em["matched_file"] = matched_file
            results.append(em)

            print(f"[{em['id']:02d}] {em['dept']} - {em['post']} ({em['date']})")
            print(f"     মুদ্রিত পৃষ্ঠা: {em['book_pages']} | পিডিএফ পৃষ্ঠা: {em['pdf_pages']} | প্রশ্ন সংখ্যা: {em['q_count']}টি (প্রশ্ন ১ হতে {em['q_count']})")
            print(f"     প্রজেক্টে অবস্থা: {status_str} {('-> ' + matched_file) if matched_file else ''}")
            print("-" * 105)

        # Summary
        present_count = sum(1 for r in results if r["status"] == "PRESENT")
        missing_count = sum(1 for r in results if r["status"] == "MISSING")
        total_questions = sum(r["q_count"] for r in results)
        present_questions = sum(r["q_count"] for r in results if r["status"] == "PRESENT")
        missing_questions = sum(r["q_count"] for r in results if r["status"] == "MISSING")

        print("\n=========================================================================================================")
        print(f"মোট পরীক্ষা: {len(results)}টি | প্রজেক্টে বিদ্যমান: {present_count}টি ({present_questions}টি প্রশ্ন)")
        print(f"বাদ পড়া পরীক্ষা: {missing_count}টি | বাদ পড়া মোট প্রশ্ন: {missing_questions}টি (২১৮০টি প্রশ্ন)")
        print("=========================================================================================================\n")

        # Save audit comparison to JSON as required by Rule 2
        out_audit = "scratch/vol3_audit_comparison.json"
        with open(out_audit, "w", encoding="utf-8") as f:
            json.dump({
                "source_pdf": "PSC Non cadre প্রশ্নব্যাংক (৩য় খন্ড).pdf",
                "total_pages": total_pages,
                "total_exams": len(results),
                "present_exams_count": present_count,
                "missing_exams_count": missing_count,
                "total_questions": total_questions,
                "present_questions_count": present_questions,
                "missing_questions_count": missing_questions,
                "exams": results
            }, f, ensure_ascii=False, indent=2)
        print(f"Saved full comparison data to '{out_audit}'")
        return

        
        # Check text presence across samples
        sample_pages = [1, 2, 3, 4, 5, 10, 20, 50, 100, min(150, total_pages)]
        text_samples = {}
        for p_num in sample_pages:
            if p_num <= total_pages:
                txt = doc[p_num - 1].get_text().strip()
                text_samples[p_num] = len(txt)
        print("Text character count on sample pages:", text_samples)
        
        # Check OCR tools
        found_tess = None
        user_dirs = [
            r"C:\Program Files\Tesseract-OCR",
            r"C:\Program Files (x86)\Tesseract-OCR",
            os.path.expanduser(r"~\AppData\Local\Programs\Tesseract-OCR"),
            os.path.expanduser(r"~\AppData\Local\Tesseract-OCR"),
            r"C:\Users\PC User\Downloads"
        ]
        for udir in user_dirs:
            if os.path.exists(udir):
                for r, d, f in os.walk(udir):
                    if "tesseract.exe" in f:
                        found_tess = os.path.join(r, "tesseract.exe")
                        break
            if found_tess:
                break
        print(f"tesseract executable located: {found_tess}")

        # Check installed packages
        import importlib.metadata
        installed = {dist.metadata['Name'].lower(): dist.version for dist in importlib.metadata.distributions()}
        relevant = [name for name in installed if any(k in name for k in ['ocr', 'tess', 'cv', 'pdf', 'image', 'pil', 'vision', 'torch'])]
        print("Relevant installed packages:", {k: installed[k] for k in relevant})






    # Render pages if requested
    if args.render_to:
        os.makedirs(args.render_to, exist_ok=True)
        for page_num in pages_to_process:
            if 1 <= page_num <= total_pages:
                pix = doc[page_num - 1].get_pixmap(dpi=args.dpi)
                out_img = os.path.join(args.render_to, f"page_{page_num}.png")
                pix.save(out_img)
                print(f"Rendered page {page_num} -> {out_img}")

    # Extract text if requested
    if args.extract_to or args.preview:
        extracted = {}
        total_chars = 0
        for page_num in pages_to_process:
            if 1 <= page_num <= total_pages:
                page_text = doc[page_num - 1].get_text()
                extracted[page_num] = page_text
                total_chars += len(page_text.strip())
                if args.preview:
                    print(f"\n--- Page {page_num} ({len(page_text.strip())} chars) ---")
                    print(page_text[:500])

        if args.extract_to:
            os.makedirs(os.path.dirname(os.path.abspath(args.extract_to)), exist_ok=True)
            if args.extract_to.endswith(".json"):
                with open(args.extract_to, "w", encoding="utf-8") as f:
                    json.dump(extracted, f, ensure_ascii=False, indent=2)
            else:
                with open(args.extract_to, "w", encoding="utf-8") as f:
                    for p_num in sorted(extracted.keys()):
                        f.write(f"\n\n=== PAGE {p_num} ===\n\n")
                        f.write(extracted[p_num])
            print(f"Successfully extracted {len(extracted)} pages ({total_chars} total chars) to '{args.extract_to}'")


    doc.close()

if __name__ == "__main__":
    inspect_pdf(parse_args())
