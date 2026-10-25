with open('universal-modes.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
print("Line 1730 to 1800:")
for i in range(1729, min(len(lines), 1800)):
    print(f"{i+1}: {lines[i]}", end='')
