import glob, re
path = 'c:/Users/Vedant/Desktop/investerly3/fintech-frontend/src/components/tools/*.jsx'

contents = set()
for file in glob.glob(path):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.findall(r'<span className="input-value[^"]*">(.*?)</span>', content)
    for m in matches:
        contents.add(m)

for c in contents:
    print(c.encode('ascii', 'ignore').decode('ascii'))
