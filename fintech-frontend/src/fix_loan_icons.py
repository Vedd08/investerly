import os
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

def fix_file(filepath, replacements, imports_list):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Imports
    imports_str = ", ".join(imports_list)
    import_statement = f'import {{ {imports_str} }} from "lucide-react";\n'
    
    if 'lucide-react' not in content:
        content = content.replace(
            'import { Link } from "react-router-dom";\n',
            f'import {{ Link }} from "react-router-dom";\n{import_statement}'
        )
    
    for old, new_ in replacements:
        content = content.replace(old, new_)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    os.chdir('c:/Users/Vedant/Desktop/Kaam/investerly3/fintech-frontend/src')

    fix_file('components/tools/EMICalculator.jsx', [
        ('<span className="eyebrow-icon">🏦</span>', '<span className="eyebrow-icon"><Landmark size={16} /></span>'),
        ('<div className="input-icon pulse-animation">🏦</div>', '<div className="input-icon pulse-animation"><Landmark size={24} /></div>'),
        ('<span className="tip-icon">💡</span>', '<span className="tip-icon"><Lightbulb size={16} /></span>'),
        ('<div className="results-icon float-animation">📊</div>', '<div className="results-icon float-animation"><BarChart3 size={24} /></div>'),
        ('<span className="badge-icon">🏦</span>', '<span className="badge-icon"><Landmark size={16} /></span>'),
        ('<div className="metric-icon">💰</div>', '<div className="metric-icon"><Wallet size={24} /></div>'),
        ('<div className="metric-icon">📈</div>', '<div className="metric-icon"><TrendingUp size={24} /></div>'),
        ('<div className="metric-icon">💳</div>', '<div className="metric-icon"><CreditCard size={24} /></div>'),
        ('<div className="metric-icon">💎</div>', '<div className="metric-icon"><Gem size={24} /></div>'),
        ('<span className="btn-icon">📅</span>', '<span className="btn-icon"><Calendar size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span className="disclaimer-icon">ℹ️</span>', '<span className="disclaimer-icon"><Info size={16} /></span>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ], ['Landmark', 'Lightbulb', 'BarChart3', 'Wallet', 'TrendingUp', 'CreditCard', 'Gem', 'Calendar', 'Download', 'Info'])

    fix_file('components/tools/HomeLoanCalculator.jsx', [
        ('<span className="eyebrow-icon">🏠</span>', '<span className="eyebrow-icon"><Home size={16} /></span>'),
        ('<div className="input-icon pulse-animation">🏠</div>', '<div className="input-icon pulse-animation"><Home size={24} /></div>'),
        ('<div className="results-icon float-animation">🏦</div>', '<div className="results-icon float-animation"><Landmark size={24} /></div>'),
        ('<span className="badge-icon">⏱️</span>', '<span className="badge-icon"><Clock size={16} /></span>'),
        ('<div className="metric-icon">💰</div>', '<div className="metric-icon"><Wallet size={24} /></div>'),
        ('<div className="metric-icon">📈</div>', '<div className="metric-icon"><TrendingUp size={24} /></div>'),
        ('<div className="metric-icon">💳</div>', '<div className="metric-icon"><CreditCard size={24} /></div>'),
        ('<div className="metric-icon">🏠</div>', '<div className="metric-icon"><Home size={24} /></div>'),
        ('<span className="btn-icon">📅</span>', '<span className="btn-icon"><Calendar size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span className="disclaimer-icon">ℹ️</span>', '<span className="disclaimer-icon"><Info size={16} /></span>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ], ['Home', 'Landmark', 'Clock', 'Wallet', 'TrendingUp', 'CreditCard', 'Calendar', 'Download', 'Info'])

    fix_file('components/tools/CarLoanCalculator.jsx', [
        ('<span className="eyebrow-icon">🚗</span>', '<span className="eyebrow-icon"><Car size={16} /></span>'),
        ('<div className="input-icon pulse-animation">🚗</div>', '<div className="input-icon pulse-animation"><Car size={24} /></div>'),
        ('<span className="tip-icon">💡</span>', '<span className="tip-icon"><Lightbulb size={16} /></span>'),
        ('<span className="tip-icon">💰</span>', '<span className="tip-icon"><Wallet size={16} /></span>'),
        ('<div className="results-icon float-animation">🚗</div>', '<div className="results-icon float-animation"><Car size={24} /></div>'),
        ('<span className="badge-icon">⏱️</span>', '<span className="badge-icon"><Clock size={16} /></span>'),
        ('<div className="metric-icon">💰</div>', '<div className="metric-icon"><Wallet size={24} /></div>'),
        ('<div className="metric-icon">📈</div>', '<div className="metric-icon"><TrendingUp size={24} /></div>'),
        ('<div className="metric-icon">💳</div>', '<div className="metric-icon"><CreditCard size={24} /></div>'),
        ('<div className="metric-icon">🚗</div>', '<div className="metric-icon"><Car size={24} /></div>'),
        ('<span className="btn-icon">📅</span>', '<span className="btn-icon"><Calendar size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span className="disclaimer-icon">ℹ️</span>', '<span className="disclaimer-icon"><Info size={16} /></span>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ], ['Car', 'Lightbulb', 'Wallet', 'Clock', 'TrendingUp', 'CreditCard', 'Calendar', 'Download', 'Info'])

if __name__ == '__main__':
    main()
    print("Done replacing loan calculator icons!")
