import glob, re
path = 'c:/Users/Vedant/Desktop/investerly3/fintech-frontend/src/components/tools/*.jsx'
for file in glob.glob(path):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.findall(r'<label className="input-label">.*?</label>\s*<input[^>]+type="range"[^>]+>', content, re.DOTALL)
    if matches:
        print(f'--- {file} ---')
        for m in matches[:2]:
            print(m)
