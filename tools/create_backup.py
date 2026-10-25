import os, shutil, sys

sys.stdout.reconfigure(encoding='utf-8')

src_dir = '.'
dst_dir = '_backup_before_audit'
os.makedirs(dst_dir, exist_ok=True)

extensions = ('.html', '.js', '.css', '.json')
exclude_dirs = {'.git', 'node_modules', 'scratch', '_backup_before_redesign', '_backup_before_audit', '.agents'}

copied_count = 0
total_size = 0

for root, dirs, files in os.walk(src_dir):
    # filter dirs
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    rel_root = os.path.relpath(root, src_dir)
    
    for f in files:
        if f.lower().endswith(extensions):
            src_file = os.path.join(root, f)
            dst_subdir = os.path.join(dst_dir, rel_root) if rel_root != '.' else dst_dir
            os.makedirs(dst_subdir, exist_ok=True)
            dst_file = os.path.join(dst_subdir, f)
            
            shutil.copy2(src_file, dst_file)
            copied_count += 1
            total_size += os.path.getsize(src_file)

print(f"Backup complete: {copied_count} files ({total_size / (1024*1024):.2f} MB) copied to {dst_dir}")
