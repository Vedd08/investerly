import os, glob, re

path = 'c:/Users/Vedant/Desktop/Kaam/investerly3/fintech-frontend/src/components/tools/*.jsx'

for file in glob.glob(path):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'downloadReport' not in content: continue

    # 1. Import helper if not present
    if 'pdfHelper' not in content:
        imports_end = content.rfind("import ")
        if imports_end != -1:
            next_newline = content.find("\n", imports_end)
            content = content[:next_newline+1] + 'import { addReportHeader, addReportFooter } from "../../utils/pdfHelper";\n' + content[next_newline+1:]
        else:
            content = 'import { addReportHeader, addReportFooter } from "../../utils/pdfHelper";\n' + content

    # 2. Change to async
    content = content.replace('const downloadReport = () => {', 'const downloadReport = async () => {')

    # 3. Replace header logic
    def repl(m):
        block = m.group(0)
        title_match = re.search(r'doc\.text\("([^"]+)", 20, 25\);', block)
        title = title_match.group(1) if title_match else "Report"
        return f'const doc = new jsPDF();\n\n      await addReportHeader(doc, "{title}");'

    pattern = r'(?s)const doc = new jsPDF\(\);.*?20, 50\);'
    content = re.sub(pattern, repl, content, count=1)

    # 4. Add Footer before doc.save()
    if 'addReportFooter(doc);' not in content:
        content = content.replace('doc.save(', 'addReportFooter(doc);\n      doc.save(')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Refactored all PDFs.")
