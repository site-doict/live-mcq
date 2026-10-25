import os
import shutil
import sys

sys.stdout.reconfigure(encoding='utf-8')

src = os.path.join('node_modules', 'katex', 'dist')
dst = os.path.join('vendor', 'katex')

if os.path.exists(dst):
    shutil.rmtree(dst)

os.makedirs(dst, exist_ok=True)

# Copy katex.min.js, katex.min.css, fonts, and contrib/auto-render.min.js
shutil.copy2(os.path.join(src, 'katex.min.js'), dst)
shutil.copy2(os.path.join(src, 'katex.min.css'), dst)

# Copy fonts directory
shutil.copytree(os.path.join(src, 'fonts'), os.path.join(dst, 'fonts'), dirs_exist_ok=True)

# Copy contrib
os.makedirs(os.path.join(dst, 'contrib'), exist_ok=True)
shutil.copy2(os.path.join(src, 'contrib', 'auto-render.min.js'), os.path.join(dst, 'contrib'))

print(f"KaTeX successfully copied to {dst}")
print("Files in vendor/katex:", os.listdir(dst))
print("Files in vendor/katex/contrib:", os.listdir(os.path.join(dst, 'contrib')))
print("Fonts count:", len(os.listdir(os.path.join(dst, 'fonts'))))
