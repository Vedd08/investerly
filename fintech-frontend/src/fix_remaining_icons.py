import os
import re

def fix_file(filepath, replacements, imports_list):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Imports
    imports_str = ", ".join(imports_list)
    import_statement = f'import {{ {imports_str} }} from "lucide-react";\n'
    
    # Simple insertion
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

    fix_file('components/tools/LifeInsuranceCalculator.jsx', [
        ('<span className="eyebrow-icon">🛡️</span>', '<span className="eyebrow-icon"><Shield size={16} /></span>'),
        ('<div className="input-icon pulse-animation">🛡️</div>', '<div className="input-icon pulse-animation"><Shield size={24} /></div>'),
        ('<div className="results-icon float-animation">🎯</div>', '<div className="results-icon float-animation"><Target size={24} /></div>'),
        ('<span className="badge-icon">💰</span>', '<span className="badge-icon"><Wallet size={16} /></span>'),
        ('<div className="need-icon">💰</div>', '<div className="need-icon"><Wallet size={24} /></div>'),
        ('<div className="need-icon">🏦</div>', '<div className="need-icon"><Landmark size={24} /></div>'),
        ('<div className="need-icon">📚</div>', '<div className="need-icon"><BookOpen size={24} /></div>'),
        ('<span className="btn-icon">📅</span>', '<span className="btn-icon"><Calendar size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ], ['Shield', 'Target', 'Wallet', 'Landmark', 'BookOpen', 'Calendar', 'Download'])

    fix_file('components/tools/MarriagePlanningCalculator.jsx', [
        ('<span className="eyebrow-icon">💒</span>', '<span className="eyebrow-icon"><Heart size={16} /></span>'),
        ('<div className="input-icon pulse-animation">💒</div>', '<div className="input-icon pulse-animation"><Heart size={24} /></div>'),
        ('<div className="results-icon float-animation">🎯</div>', '<div className="results-icon float-animation"><Target size={24} /></div>'),
        ('<span className="badge-icon">⏱️</span>', '<span className="badge-icon"><Clock size={16} /></span>'),
        ('<div className="metric-icon">💰</div>', '<div className="metric-icon"><Wallet size={24} /></div>'),
        ('<div className="metric-icon">📈</div>', '<div className="metric-icon"><TrendingUp size={24} /></div>'),
        ('<div className="metric-icon">💎</div>', '<div className="metric-icon"><Gem size={24} /></div>'),
        ('<div className="metric-icon">⚡</div>', '<div className="metric-icon"><Zap size={24} /></div>'),
        ('<span className="investment-icon">📊</span>', '<span className="investment-icon"><BarChart3 size={16} /></span>'),
        ('<span className="btn-icon">📅</span>', '<span className="btn-icon"><Calendar size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ], ['Heart', 'Target', 'Clock', 'Wallet', 'TrendingUp', 'Zap', 'BarChart3', 'Calendar', 'Download'])

    fix_file('components/tools/EducationPlanningCalculator.jsx', [
        ('<span className="eyebrow-icon">📚</span>', '<span className="eyebrow-icon"><BookOpen size={16} /></span>'),
        ('<div className="input-icon pulse-animation">📚</div>', '<div className="input-icon pulse-animation"><BookOpen size={24} /></div>'),
        ('<span className="tip-icon">💡</span>', '<span className="tip-icon"><Lightbulb size={16} /></span>'),
        ('<div className="results-icon float-animation">🎓</div>', '<div className="results-icon float-animation"><GraduationCap size={24} /></div>'),
        ('<span className="badge-icon">⏱️</span>', '<span className="badge-icon"><Clock size={16} /></span>'),
        ('<div className="metric-icon">💰</div>', '<div className="metric-icon"><Wallet size={24} /></div>'),
        ('<div className="metric-icon">📈</div>', '<div className="metric-icon"><TrendingUp size={24} /></div>'),
        ('<div className="metric-icon">💎</div>', '<div className="metric-icon"><Gem size={24} /></div>'),
        ('<div className="metric-icon">⚡</div>', '<div className="metric-icon"><Zap size={24} /></div>'),
        ('<span className="investment-icon">📊</span>', '<span className="investment-icon"><BarChart3 size={16} /></span>'),
        ('<span className="btn-icon">📅</span>', '<span className="btn-icon"><Calendar size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ], ['BookOpen', 'Lightbulb', 'GraduationCap', 'Clock', 'Wallet', 'TrendingUp', 'Gem', 'Zap', 'BarChart3', 'Calendar', 'Download'])

    fix_file('components/tools/TaxCalculator.jsx', [
        ('<span className="eyebrow-icon">🧾</span>', '<span className="eyebrow-icon"><Receipt size={16} /></span>'),
        ('<div className="input-icon pulse-animation">🧾</div>', '<div className="input-icon pulse-animation"><Receipt size={24} /></div>'),
        ('<span className="regime-icon">📜</span>', '<span className="regime-icon"><FileText size={24} /></span>'),
        ('<span className="regime-icon">🆕</span>', '<span className="regime-icon"><Sparkles size={24} /></span>'),
        ('<span className="tip-icon">💡</span>', '<span className="tip-icon"><Lightbulb size={16} /></span>'),
        ('<span className="tip-icon">💰</span>', '<span className="tip-icon"><Wallet size={16} /></span>'),
        ('<div className="results-icon float-animation">💰</div>', '<div className="results-icon float-animation"><Wallet size={24} /></div>'),
        ('<span className="badge-icon">📊</span>', '<span className="badge-icon"><BarChart3 size={16} /></span>'),
        ('<span className="btn-icon">📅</span>', '<span className="btn-icon"><Calendar size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ], ['Receipt', 'FileText', 'Sparkles', 'Lightbulb', 'Wallet', 'BarChart3', 'Calendar', 'Download'])

    fix_file('components/tools/SIPPerformanceCalculator.jsx', [
        ('<span className="eyebrow-icon">📈</span>', '<span className="eyebrow-icon"><TrendingUp size={16} /></span>'),
        ('<div className="input-icon pulse-animation">📊</div>', '<div className="input-icon pulse-animation"><BarChart3 size={24} /></div>'),
        ('<span className="tip-icon">💡</span>', '<span className="tip-icon"><Lightbulb size={16} /></span>'),
        ('<div className="results-icon float-animation">📈</div>', '<div className="results-icon float-animation"><TrendingUp size={24} /></div>'),
        ('<span className="badge-icon">📊</span>', '<span className="badge-icon"><BarChart3 size={16} /></span>'),
        ('<span className="btn-icon">📅</span>', '<span className="btn-icon"><Calendar size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ], ['TrendingUp', 'BarChart3', 'Lightbulb', 'Calendar', 'Download'])

    fix_file('components/tools/FundPerformanceCalculator.jsx', [
        ('<span className="eyebrow-icon">📊</span>', '<span className="eyebrow-icon"><BarChart3 size={16} /></span>'),
        ('<div className="input-icon pulse-animation">📊</div>', '<div className="input-icon pulse-animation"><BarChart3 size={24} /></div>'),
        ('<span className="tip-icon">💡</span>', '<span className="tip-icon"><Lightbulb size={16} /></span>'),
        ('<div className="results-icon float-animation">📊</div>', '<div className="results-icon float-animation"><BarChart3 size={24} /></div>'),
        ('<span className="badge-icon">📈</span>', '<span className="badge-icon"><TrendingUp size={16} /></span>'),
        ('<span className="btn-icon">📅</span>', '<span className="btn-icon"><Calendar size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ], ['BarChart3', 'Lightbulb', 'TrendingUp', 'Calendar', 'Download'])

if __name__ == '__main__':
    main()
    print("Done replacing remaining calculator icons!")
