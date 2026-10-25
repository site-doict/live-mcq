import importlib.util
import sys

sys.stdout.reconfigure(encoding='utf-8')

spec = importlib.util.spec_from_file_location("fix_math", "tools/fix-math.py")
fix_math = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fix_math)

test_cases = [
    r'\(\mathrm{3+\frac32+\frac34+...{\frac3{64}}} \)',
    r'log_x324=4',
    r'3+\frac32+\frac34+...{\frac3{64}} ধারাটিতে মোট কতটি পদ আছে?'
]

for tc in test_cases:
    res, n = fix_math.fix_broken_latex_syntax(tc)
    print("Original:", tc)
    print("After syntax fix:", res)
    print("Fixes:", n)
    print("---")
