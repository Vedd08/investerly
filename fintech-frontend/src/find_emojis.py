import os
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

files = [
    'components/tools/LifeInsuranceCalculator.jsx',
    'components/tools/MarriagePlanningCalculator.jsx',
    'components/tools/EducationPlanningCalculator.jsx',
    'components/tools/TaxCalculator.jsx',
    'components/tools/SIPPerformanceCalculator.jsx',
    'components/tools/FundPerformanceCalculator.jsx'
]

os.chdir('c:/Users/Vedant/Desktop/Kaam/investerly3/fintech-frontend/src')

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    print(f"--- {file} ---")
    for i, line in enumerate(lines):
        if 'icon' in line.lower() and re.search(r'[^\x00-\x7F]', line):
            print(f"{i+1}: {line.strip()}")
