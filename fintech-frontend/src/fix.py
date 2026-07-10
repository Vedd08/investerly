import os, glob, re

path = 'c:/Users/Vedant/Desktop/investerly3/fintech-frontend/src/components/tools/*.jsx'

def replace_func(content, func_name, new_func):
    start_str = f'const {func_name} ='
    if start_str in content:
        start_idx = content.find(start_str)
        idx = content.find('{', start_idx)
        if idx == -1: return content
        brace_count = 1
        curr_idx = idx + 1
        while brace_count > 0 and curr_idx < len(content):
            if content[curr_idx] == '{':
                brace_count += 1
            elif content[curr_idx] == '}':
                brace_count -= 1
            curr_idx += 1
        if curr_idx < len(content) and content[curr_idx] == ';':
            curr_idx += 1
        return content[:start_idx] + new_func + content[curr_idx:]
    return content

for file in glob.glob(path):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    new_large = '''const formatLargeNumber = (num, forPDF = false) => {
    if (!num || isNaN(num)) return forPDF ? 'Rs. 0' : '₹0';
    const symbol = forPDF ? 'Rs. ' : '₹';
    if (num >= 10000000) return `${symbol}${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${symbol}${(num / 100000).toFixed(2)} Lac`;
    if (num >= 1000) return `${symbol}${(num / 1000).toFixed(2)} K`;
    return formatCurrency(num, forPDF);
  };'''
    content = replace_func(content, 'formatLargeNumber', new_large)

    new_curr = '''const formatCurrency = (num, forPDF = false) => {
    if (!num || isNaN(num)) return forPDF ? 'Rs. 0' : '₹0';
    const formatted = num.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
    return forPDF ? formatted.replace(/₹/g, 'Rs. ') : formatted;
  };'''
    content = replace_func(content, 'formatCurrency', new_curr)

    parts = content.split('const downloadReport = () => {')
    if len(parts) > 1:
        before = parts[0]
        sub_parts = parts[1].split('return (')
        if len(sub_parts) > 1:
            download_report_body = sub_parts[0]
            rest = 'return (' + 'return ('.join(sub_parts[1:])
            
            # replace hardcoded rupee symbols
            download_report_body = download_report_body.replace('`₹${', '`Rs. ${')
            download_report_body = download_report_body.replace('`₹`', '`Rs. `')
            download_report_body = download_report_body.replace('"₹"', '"Rs. "')
            download_report_body = download_report_body.replace("'₹'", "'Rs. '")
            
            # Ensure true is passed. We might have formatCurrency(num) or formatCurrency(num, true)
            # Remove existing true to avoid true, true
            download_report_body = re.sub(r'formatCurrency\(([^,)]+),\s*true\)', r'formatCurrency(\1)', download_report_body)
            download_report_body = re.sub(r'formatLargeNumber\(([^,)]+),\s*true\)', r'formatLargeNumber(\1)', download_report_body)
            
            # Now add it back properly
            download_report_body = re.sub(r'formatCurrency\(([^,)]+)\)', r'formatCurrency(\1, true)', download_report_body)
            download_report_body = re.sub(r'formatLargeNumber\(([^,)]+)\)', r'formatLargeNumber(\1, true)', download_report_body)

            content = before + 'const downloadReport = () => {' + download_report_body + rest

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print('Done!')
