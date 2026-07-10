import os

def fix_sip_calculator():
    filepath = 'components/tools/SIPCalculator.jsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Imports
    if 'import { BarChart3' not in content:
        content = content.replace(
            'import { Link } from "react-router-dom";',
            'import { Link } from "react-router-dom";\nimport { BarChart3, TrendingUp, Clock, Wallet, Zap, Calendar, Download, Info } from "lucide-react";'
        )
    
    # Emojis to replace
    replacements = [
        ('<span className="note-icon">ℹ️</span>', '<span className="note-icon"><Info size={16} /></span>'),
        ('<div className="results-icon">📈</div>', '<div className="results-icon"><TrendingUp size={24} /></div>'),
        ('<div className="metric-icon">⏱️</div>', '<div className="metric-icon"><Clock size={24} /></div>'),
        ('<div className="metric-icon">📊</div>', '<div className="metric-icon"><BarChart3 size={24} /></div>'),
        ('<div className="stat-icon">📈</div>', '<div className="stat-icon"><TrendingUp size={24} /></div>'),
        ('<div className="stat-icon">💰</div>', '<div className="stat-icon"><Wallet size={24} /></div>'),
        ('<div className="stat-icon">⚡</div>', '<div className="stat-icon"><Zap size={24} /></div>'),
        ('<span className="btn-icon">📅</span>', '<span className="btn-icon"><Calendar size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ]
    
    for old, new_ in replacements:
        content = content.replace(old, new_)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)


def fix_lumpsum_calculator():
    filepath = 'components/tools/LumpsumCalculator.jsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Imports
    if 'import { Wallet' in content and 'TrendingUp' not in content:
        content = content.replace(
            'import { Wallet, Landmark } from "lucide-react";',
            'import { Wallet, Landmark, TrendingUp, Clock, Zap, Gem, Download, Info } from "lucide-react";'
        )
    
    replacements = [
        ('<div className="results-icon float-animation">📈</div>', '<div className="results-icon float-animation"><TrendingUp size={24} /></div>'),
        ('<span className="badge-icon">⏱️</span>', '<span className="badge-icon"><Clock size={16} /></span>'),
        ('<div className="metric-icon">💰</div>', '<div className="metric-icon"><Wallet size={24} /></div>'),
        ('<div className="metric-icon">📈</div>', '<div className="metric-icon"><TrendingUp size={24} /></div>'),
        ('<div className="metric-icon">⚡</div>', '<div className="metric-icon"><Zap size={24} /></div>'),
        ('<div className="metric-icon">💎</div>', '<div className="metric-icon"><Gem size={24} /></div>'),
        ('<span className="btn-icon">🏦</span>', '<span className="btn-icon"><Landmark size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span className="note-icon">ℹ️</span>', '<span className="note-icon"><Info size={16} /></span>'),
        ('<div className="info-icon">ℹ️</div>', '<div className="info-icon"><Info size={24} /></div>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ]
    
    for old, new_ in replacements:
        content = content.replace(old, new_)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)


def fix_retirement_calculator():
    filepath = 'components/tools/RetirementCalculator.jsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Imports
    if 'import { Umbrella' in content and 'TrendingUp' not in content:
        content = content.replace(
            'import { Umbrella, Target } from "lucide-react";',
            'import { Umbrella, Target, Sparkles, Wallet, TrendingUp, Hourglass, Scale, Shield, Building, Download, Lightbulb } from "lucide-react";'
        )
    
    replacements = [
        ('<div className="results-icon float-animation">🔮</div>', '<div className="results-icon float-animation"><Sparkles size={24} /></div>'),
        ('<span className="badge-icon">💰</span>', '<span className="badge-icon"><Wallet size={16} /></span>'),
        ('<div className="metric-icon">📈</div>', '<div className="metric-icon"><TrendingUp size={24} /></div>'),
        ('<div className="metric-icon">⏳</div>', '<div className="metric-icon"><Hourglass size={24} /></div>'),
        ('<div className="metric-icon">⚖️</div>', '<div className="metric-icon"><Scale size={24} /></div>'),
        ('<div className="metric-icon">🛡️</div>', '<div className="metric-icon"><Shield size={24} /></div>'),
        ('<span className="btn-icon">🏦</span>', '<span className="btn-icon"><Building size={20} /></span>'),
        ('<span className="btn-icon">📥</span>', '<span className="btn-icon"><Download size={20} /></span>'),
        ('<span className="note-icon">💡</span>', '<span className="note-icon"><Lightbulb size={16} /></span>'),
        ('<span> years</span>', '<span> Years</span>'),
        ('<span>years</span>', '<span> Years</span>'),
    ]
    
    for old, new_ in replacements:
        content = content.replace(old, new_)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)


if __name__ == "__main__":
    os.chdir('c:/Users/Vedant/Desktop/Kaam/investerly3/fintech-frontend/src')
    fix_sip_calculator()
    fix_lumpsum_calculator()
    fix_retirement_calculator()
    print("Done refactoring emojis!")
