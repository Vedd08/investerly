import glob, re

path = 'c:/Users/Vedant/Desktop/investerly3/fintech-frontend/src/components/tools/*.jsx'

def process_file(file):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = ""
    last_end = 0
    
    for match in re.finditer(r'<span className="input-value([^"]*)">(.*?)</span>', content):
        span_str = match.group(0)
        classes = match.group(1)
        inner = match.group(2)
        
        # Look ahead for the next <input type="range"
        lookahead = content[match.end():match.end()+1000]
        input_match = re.search(r'<input[^>]+onChange=\{([^}]+)\}[^>]*>', lookahead)
        if not input_match:
            new_content += content[last_end:match.end()]
            last_end = match.end()
            continue
            
        onchange_inner = input_match.group(1)
        
        # extract setter name
        setter_match = re.search(r'(set[A-Z][a-zA-Z0-9_]*)', onchange_inner)
        if not setter_match:
            new_content += content[last_end:match.end()]
            last_end = match.end()
            continue
            
        setter = setter_match.group(1)
        
        # Extract variable from inner
        var_match = re.search(r'\{(?:Number\()??([a-zA-Z0-9_]+)(?:\)\.toLocaleString\([^)]*\))??\}|\{formatCurrency\(([a-zA-Z0-9_]+)\)\}|\{([a-zA-Z0-9_]+)\}', inner)
        var_name = ""
        if var_match:
            var_name = var_match.group(1) or var_match.group(2) or var_match.group(3)
            
        if not var_name:
            new_content += content[last_end:match.end()]
            last_end = match.end()
            continue
            
        brace_part = re.search(r'\{[^\}]+\}', inner)
        if not brace_part:
            new_content += content[last_end:match.end()]
            last_end = match.end()
            continue
        
        brace_part = brace_part.group(0)
        parts = inner.split(brace_part, 1)
        prefix = parts[0]
        suffix = parts[1] if len(parts) > 1 else ""
        
        if "{tenureType}" in suffix:
            suffix = suffix.replace("{tenureType}", " {tenureType}")
            
        # build replacement
        replacement = f'''<div className="input-value-wrapper{classes}">
                  {f'<span>{prefix}</span>' if prefix.strip() else ''}
                  <input
                    type="number"
                    value={{{var_name}}}
                    onChange={{(e) => {setter}(e.target.value === '' ? '' : Number(e.target.value))}}
                    className="number-input"
                  />
                  {f'<span>{suffix}</span>' if suffix.strip() else ''}
                </div>'''
                
        replacement = re.sub(r'<span>\s*</span>', '', replacement)
        
        new_content += content[last_end:match.start()] + replacement
        last_end = match.end()
        
    new_content += content[last_end:]
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file}')

for f in glob.glob(path):
    process_file(f)
