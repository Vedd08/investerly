import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Lightbulb, TrendingUp, Calendar, Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import "../../styles/fund-performance.css";
import { addReportHeader, addReportFooter, addGrowthChart } from "../../utils/pdfHelper";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FundPerformanceCalculator = () => {
  const [investment, setInvestment] = useState(500000);
  const [fundType, setFundType] = useState('parag_parikh_flexi');
  const [timePeriod, setTimePeriod] = useState(5);
  const [investmentType, setInvestmentType] = useState('sip'); // 'sip' or 'lumpsum'
  const [monthlySIP, setMonthlySIP] = useState(10000);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fund categories with historical returns
  const [fundCategories, setFundCategories] = useState({
    parag_parikh_flexi: {
      name: 'Parag Parikh Flexi Cap',
      schemeCode: '122639',
      returns: { '1': 38.5, '3': 22.1, '5': 24.8, '10': 20.2 },
      risk: 'Very High',
      expense: 0.75,
      alpha: 4.2,
      beta: 0.85,
      sharpe: 1.15,
      color: '#3498db',
      description: 'A popular flexi cap fund with international equity exposure.'
    },
    nippon_small_cap: {
      name: 'Nippon India Small Cap',
      schemeCode: '118778',
      returns: { '1': 54.2, '3': 35.8, '5': 31.4, '10': 26.5 },
      risk: 'Very High',
      expense: 0.68,
      alpha: 8.5,
      beta: 1.12,
      sharpe: 1.45,
      color: '#e74c3c',
      description: 'One of the largest small cap funds with highly diversified holdings.'
    },
    sbi_small_cap: {
      name: 'SBI Small Cap Fund',
      schemeCode: '125497',
      returns: { '1': 42.1, '3': 28.5, '5': 26.2, '10': 24.8 },
      risk: 'Very High',
      expense: 0.71,
      alpha: 5.4,
      beta: 1.05,
      sharpe: 1.25,
      color: '#e67e22',
      description: 'Invests in highly growth-oriented small cap companies.'
    },
    hdfc_mid_cap: {
      name: 'HDFC Mid-Cap Opportunities',
      schemeCode: '118989',
      returns: { '1': 48.5, '3': 30.2, '5': 25.8, '10': 21.5 },
      risk: 'High',
      expense: 0.85,
      alpha: 4.8,
      beta: 0.98,
      sharpe: 1.20,
      color: '#f39c12',
      description: 'Focuses on fundamentally strong mid-cap companies.'
    },
    icici_bluechip: {
      name: 'ICICI Pru Bluechip',
      schemeCode: '120586',
      returns: { '1': 28.5, '3': 18.2, '5': 16.5, '10': 15.2 },
      risk: 'Moderate',
      expense: 0.95,
      alpha: 2.1,
      beta: 0.92,
      sharpe: 0.95,
      color: '#2FB34A',
      description: 'Consistent large cap performer investing in top 100 bluechip stocks.'
    },
    quant_active: {
      name: 'Quant Active Fund',
      schemeCode: '120823',
      returns: { '1': 45.2, '3': 32.5, '5': 29.8, '10': 22.4 },
      risk: 'Very High',
      expense: 0.77,
      alpha: 6.5,
      beta: 1.15,
      sharpe: 1.35,
      color: '#9b59b6',
      description: 'Dynamic asset allocation using VLRT framework for high growth.'
    },
    mirae_tax_saver: {
      name: 'Mirae Asset Tax Saver',
      schemeCode: '135781',
      returns: { '1': 32.5, '3': 20.8, '5': 18.5, '10': 17.8 },
      risk: 'High',
      expense: 0.65,
      alpha: 3.2,
      beta: 0.95,
      sharpe: 1.05,
      color: '#1abc9c',
      description: 'Tax saving ELSS fund with a 3-year lock-in period.'
    },
    sbi_magnum_gilt: {
      name: 'SBI Magnum Gilt',
      schemeCode: '119598',
      returns: { '1': 8.2, '3': 7.5, '5': 7.8, '10': 8.5 },
      risk: 'Low',
      expense: 0.45,
      alpha: 1.2,
      beta: 0.35,
      sharpe: 0.85,
      color: '#7f8c8d',
      description: 'Invests predominantly in government securities.'
    }
  });

  const sectionRef = useRef(null);
  const resultRef = useRef(null);
  const compareRef = useRef(null);

  const result = useMemo(() => {
    const fund = fundCategories[fundType];
    const annualReturn = fund.returns[timePeriod.toString()] || fund.returns['5'];
    const monthlyRate = annualReturn / 12 / 100;
    const months = timePeriod * 12;

    let futureValue = 0;
    let totalInvested = 0;

    if (investmentType === 'lumpsum') {
      totalInvested = investment;
      futureValue = investment * Math.pow(1 + annualReturn / 100, timePeriod);
    } else {
      totalInvested = monthlySIP * months;
      futureValue = monthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    }

    const totalReturns = futureValue - totalInvested;
    // For lumpsum, (FV/PV)^(1/n)-1 equals annualReturn. 
    // For SIP, using (FV/TotalInvested)^(1/n)-1 is mathematically incorrect as it calculates absolute return annualized rather than IRR.
    // The true CAGR/IRR is simply the annualReturn.
    const cagr = annualReturn;
    
    // Calculate risk metrics
    const sharpeRatio = fund.sharpe || ((annualReturn - 6) / (fund.risk === 'Very High' ? 18 : 
                       fund.risk === 'High' ? 15 : 
                       fund.risk === 'Moderate' ? 12 : 8));
    
    const alpha = fund.alpha || (annualReturn - 12); // Assuming benchmark returns 12%
    const beta = fund.beta || (fund.risk === 'Very High' ? 1.3 : 
                fund.risk === 'High' ? 1.2 : 
                fund.risk === 'Moderate' ? 1.0 : 0.7);

    // Comparison with other fund types
    const comparison = Object.entries(fundCategories).map(([key, f]) => ({
      name: f.name,
      returns: f.returns[timePeriod.toString()] || f.returns['5'],
      risk: f.risk,
      color: f.color
    })).sort((a, b) => b.returns - a.returns);

    // Yearly breakdown
    const yearlyBreakdown = [];
    let runningValue = investmentType === 'lumpsum' ? investment : 0;
    
    for (let year = 1; year <= timePeriod; year++) {
      if (investmentType === 'lumpsum') {
        runningValue = runningValue * (1 + annualReturn / 100);
        yearlyBreakdown.push({
          year,
          value: runningValue,
          invested: investment
        });
      } else {
        const yearMonths = year * 12;
        runningValue = monthlySIP * ((Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate) * (1 + monthlyRate);
        yearlyBreakdown.push({
          year,
          value: runningValue,
          invested: monthlySIP * yearMonths
        });
      }
    }

    return {
      futureValue,
      totalInvested,
      totalReturns,
      cagr,
      sharpeRatio,
      alpha,
      beta,
      expenseRatio: fund.expense,
      expenseImpact: totalInvested * (fund.expense / 100) * timePeriod,
      postExpenseReturns: futureValue - (totalInvested * (fund.expense / 100) * timePeriod),
      comparison,
      yearlyBreakdown,
      fund,
      returnsRatio: (totalReturns / totalInvested) * 100,
      wealthRatio: futureValue / totalInvested
    };
  }, [fundType, timePeriod, investment, investmentType, monthlySIP, fundCategories]);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const promises = Object.entries(fundCategories).map(async ([key, fund]) => {
          if (!fund.schemeCode) return { key, returns: fund.returns };
          
          try {
            const res = await fetch(`https://api.mfapi.in/mf/${fund.schemeCode}`);
            const json = await res.json();
            const data = json.data;
            
            if (!data || data.length === 0) return { key, returns: fund.returns };

            const calculateReturn = (yearsAgo) => {
              const today = new Date();
              const targetDate = new Date();
              targetDate.setFullYear(today.getFullYear() - yearsAgo);
              
              let oldNav = null;
              for (let i = 0; i < data.length; i++) {
                const parts = data[i].date.split('-');
                const dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
                if (dateObj <= targetDate) {
                  oldNav = parseFloat(data[i].nav);
                  break;
                }
              }
              if (!oldNav) oldNav = parseFloat(data[data.length - 1].nav);
              
              const currentNav = parseFloat(data[0].nav);
              const cagr = (Math.pow(currentNav / oldNav, 1 / yearsAgo) - 1) * 100;
              return parseFloat(cagr.toFixed(2));
            };

            return {
              key,
              returns: {
                '1': calculateReturn(1),
                '3': calculateReturn(3),
                '5': calculateReturn(5),
                '10': calculateReturn(10)
              }
            };
          } catch (e) {
            console.error(`Failed to fetch for ${fund.name}`, e);
            return { key, returns: fund.returns };
          }
        });

        const results = await Promise.all(promises);
        
        setFundCategories(prev => {
          const updated = { ...prev };
          results.forEach(({ key, returns }) => {
            updated[key] = { ...updated[key], returns };
          });
          return updated;
        });
      } catch (e) {
        console.error("Error updating live returns", e);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchLiveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoadingData) return;
    const ctx = gsap.context(() => {
      gsap.from(".calculator-header", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(".calc-inputs, .calc-results", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });

      gsap.from(".comparison-item", {
        scrollTrigger: {
          trigger: compareRef.current,
          start: "top 80%",
        },
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [isLoadingData]);

  const formatCurrency = (num, forPDF = false) => {
    if (!num || isNaN(num)) return forPDF ? 'Rs. 0' : '₹0';
    const formatted = num.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
    return forPDF ? formatted.replace(/₹/g, 'Rs. ') : formatted;
  };

  const formatPercentage = (num) => {
    if (!num || isNaN(num)) return "0%";
    return `${num.toFixed(2)}%`;
  };

  const formatLargeNumber = (num, forPDF = false) => {
    if (!num || isNaN(num)) return forPDF ? 'Rs. 0' : '₹0';
    const symbol = forPDF ? 'Rs. ' : '₹';
    if (num >= 10000000) return `${symbol}${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${symbol}${(num / 100000).toFixed(2)} Lac`;
    if (num >= 1000) return `${symbol}${(num / 1000).toFixed(2)} K`;
    return formatCurrency(num, forPDF);
  };

  const downloadReport = async () => {
    try {
      const doc = new jsPDF();

      await addReportHeader(doc, "Fund Performance Report");
      
      // Fund Details
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Fund Details", 20, 70);
      
      const details = [
        ["Mutual Fund:", result.fund.name],
        ["Category:", result.fund.category || "Equity"],
        ["Investment Type:", investmentType === 'lumpsum' ? 'Lumpsum' : 'SIP'],
        ["Investment Amount:", investmentType === 'lumpsum' ? formatCurrency(investment, true) : formatCurrency(monthlySIP, true) + '/month'],
        ["Time Period:", `${timePeriod} years`],
        ["Expected Returns:", `${result.fund.returns[timePeriod.toString()]}% p.a.`],
        ["Risk Level:", result.fund.risk]
      ];
      
      let yPos = 80;
      details.forEach(([label, value]) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(label, 25, yPos);
        doc.text(value, 100, yPos);
        yPos += 8;
      });
      
      // Performance Summary
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Performance Summary", 20, yPos);
      
      const summaryData = [
        ["Total Invested:", formatLargeNumber(result.totalInvested, true)],
        ["Future Value:", formatLargeNumber(result.futureValue, true)],
        ["Total Returns:", formatLargeNumber(result.totalReturns, true)],
        ["CAGR:", `${result.cagr.toFixed(2)}%`],
        ["Wealth Ratio:", `${result.wealthRatio.toFixed(2)}x`]
      ];
      
      autoTable(doc, {
        startY: yPos + 5,
        body: summaryData,
        theme: 'striped',
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'right' }
        },
        margin: { left: 20, right: 20, bottom: 30 }
      });
      
      // Risk Metrics
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Risk Metrics", 20, finalY);
      
      const riskData = [
        ["Sharpe Ratio:", result.sharpeRatio.toFixed(2)],
        ["Alpha:", `${result.alpha.toFixed(2)}%`],
        ["Beta:", result.beta.toFixed(2)],
        ["Expense Ratio:", `${result.expenseRatio}%`]
      ];
      
      autoTable(doc, {
        startY: finalY + 5,
        body: riskData,
        theme: 'striped',
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'right' }
        },
        margin: { left: 20, right: 20, bottom: 30 }
      });
      
      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(107, 124, 143);
      doc.text("*Past performance does not guarantee future returns. Mutual fund investments are subject to market risks.", 20, doc.internal.pageSize.height - 20);
      
      
            // Add Growth Chart
      doc.addPage();
      const finalYForChart = 20;
      if (result && result.yearlyBreakdown) {
        const chartDataForPDF = result.yearlyBreakdown.map(item => ({
          year: item.year,
          invested: item.invested,
          futureValue: item.value
        }));
        addGrowthChart(doc, chartDataForPDF, finalYForChart);
      }
      
      addReportFooter(doc);
      doc.save(`Fund_Performance_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <section className="calculator-section fund-performance-calculator" ref={sectionRef}>
      <div className="container">
        <div className="calculator-header">
          <span className="calculator-eyebrow">
            <span className="eyebrow-icon"><BarChart3 size={16} /></span>
            Fund Performance Analyzer
          </span>
          <h1 className="calculator-title">
            Compare <span className="text-gradient">Mutual Fund</span> Performance
          </h1>
          <p className="calculator-description">
            Analyze and compare different fund categories with risk metrics and historical returns.
          </p>
        </div>

        <div className="calculator-grid">
          {isLoadingData ? (
             <div className="loading-container" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                <div className="pulse-animation" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  <BarChart3 size={48} />
                </div>
                <h3>Fetching Live Market Data...</h3>
                <p>Please wait while we calculate real-time returns.</p>
             </div>
          ) : (
            <>
              {/* INPUT PANEL */}
              <div className="calc-inputs glass-effect">
            <div className="input-header">
              <div className="input-icon pulse-animation"><BarChart3 size={24} /></div>
              <h3>Fund Selection</h3>
            </div>

            {/* Fund Category */}
            <div className="fund-selector">
              <label className="input-label">Select Mutual Fund</label>
              <div className="fund-grid">
                {Object.entries(fundCategories)
                  .sort(([, a], [, b]) => b.returns[timePeriod.toString()] - a.returns[timePeriod.toString()])
                  .map(([key, fund]) => (
                  <button
                    key={key}
                    className={`fund-card ${fundType === key ? 'active' : ''}`}
                    onClick={() => setFundType(key)}
                    style={{ '--fund-color': fund.color }}
                  >
                    <span className="fund-name">{fund.name}</span>
                    <span className="fund-risk">{fund.risk}</span>
                    <span className="fund-return">{fund.returns[timePeriod.toString()]}% ({timePeriod}Y)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Type */}
            <div className="investment-type">
              <label className="input-label">Investment Type</label>
              <div className="type-buttons">
                <button
                  className={`type-btn ${investmentType === 'lumpsum' ? 'active' : ''}`}
                  onClick={() => setInvestmentType('lumpsum')}
                >
                  Lumpsum
                </button>
                <button
                  className={`type-btn ${investmentType === 'sip' ? 'active' : ''}`}
                  onClick={() => setInvestmentType('sip')}
                >
                  SIP
                </button>
              </div>
            </div>

            {/* Investment Amount */}
            {investmentType === 'lumpsum' ? (
              <div className="input-group">
                <label className="input-label">
                  <span>Investment Amount</span>
                  <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="50000"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
                <div className="slider-range">
                  <span>₹10K</span>
                  <span>₹50L</span>
                  <span>₹1Cr</span>
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label className="input-label">
                  <span>Monthly SIP</span>
                  <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={monthlySIP}
                    onChange={(e) => setMonthlySIP(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
                </label>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlySIP}
                  onChange={(e) => setMonthlySIP(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
                <div className="slider-range">
                  <span>₹500</span>
                  <span>₹50K</span>
                  <span>₹1L</span>
                </div>
              </div>
            )}

            {/* Time Period */}
            <div className="input-group">
              <label className="input-label">
                <span>Time Period</span>
                <span className="input-value highlight">{timePeriod} years</span>
              </label>
              <div className="period-buttons">
                {[1, 3, 5, 10].map((period) => (
                  <button
                    key={period}
                    className={`period-btn ${timePeriod === period ? 'active' : ''}`}
                    onClick={() => setTimePeriod(period)}
                  >
                    {period}Y
                  </button>
                ))}
              </div>
            </div>

            <div className="quick-tips">
              <div className="tip-item">
                <span className="tip-icon"><Lightbulb size={16} /></span>
                <span className="tip-text">Higher returns usually come with higher risk</span>
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="calc-results glass-effect" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon float-animation"><BarChart3 size={24} /></div>
              <h3>Fund Analysis</h3>
            </div>

            {/* Main Result Card */}
            <div className="main-result-card premium-card">
              <div className="card-glow"></div>
              <div className="result-label">Future Value</div>
              <div className="result-number count-animation">{formatLargeNumber(result.futureValue)}</div>
              <div className="result-badge">
                <span className="badge-icon"><TrendingUp size={16} /></span>
                <span>CAGR: {result.cagr.toFixed(2)}%</span>
              </div>
            </div>

            {/* Investment Summary */}
            <div className="investment-summary">
              <div className="summary-item">
                <span className="summary-label">Total Invested</span>
                <span className="summary-value">{formatLargeNumber(result.totalInvested)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Returns</span>
                <span className="summary-value returns">{formatLargeNumber(result.totalReturns)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Wealth Ratio</span>
                <span className="summary-value ratio">{result.wealthRatio.toFixed(2)}x</span>
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="risk-metrics">
              <h4>Risk Analysis</h4>
              <div className="metrics-grid">
                <div className="metric-box">
                  <span className="metric-label">Sharpe Ratio</span>
                  <span className="metric-value">{result.sharpeRatio.toFixed(2)}</span>
                  <span className="metric-desc">Risk-adjusted return</span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Alpha</span>
                  <span className="metric-value">{result.alpha.toFixed(2)}%</span>
                  <span className="metric-desc">Excess return over benchmark</span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Beta</span>
                  <span className="metric-value">{result.beta.toFixed(2)}</span>
                  <span className="metric-desc">Market sensitivity</span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Expense Ratio</span>
                  <span className="metric-value">{result.expenseRatio}%</span>
                  <span className="metric-desc">Annual fund cost</span>
                </div>
              </div>
            </div>

            {/* Fund Comparison */}
            <div className="fund-comparison" ref={compareRef}>
              <h4>Category Comparison ({timePeriod}Y Returns)</h4>
              <div className="comparison-list">
                {result.comparison.map((fund, index) => (
                  <div key={index} className="comparison-item">
                    <span className="comp-name">{fund.name}</span>
                    <div className="comp-bar-container">
                      <div 
                        className="comp-bar"
                        style={{ 
                          width: `${(fund.returns / Math.max(25, result.comparison[0].returns)) * 100}%`,
                          backgroundColor: fund.color
                        }}
                      ></div>
                    </div>
                    <span className="comp-value">{fund.returns}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Yearly Growth */}
            <div className="yearly-growth">
              <h4>Year-by-Year Growth</h4>
              <div className="growth-list">
                {result.yearlyBreakdown.map((data, index) => (
                  <div key={index} className="growth-item">
                    <span className="growth-year">Year {data.year}</span>
                    <div className="growth-bar-container">
                      <div 
                        className="growth-bar"
                        style={{ 
                          width: `${(data.value / result.futureValue) * 100}%`,
                          backgroundColor: result.fund.color
                        }}
                      ></div>
                    </div>
                    <span className="growth-value">{formatLargeNumber(data.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fund Details */}
            <div className="fund-details">
              <h4>Fund Details</h4>
              <p className="fund-description">{result.fund.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to="/contact" className="action-btn primary">
                <span className="btn-icon"><Calendar size={20} /></span>
                <span className="btn-text">Get Fund Advice</span>
                <span className="btn-arrow">→</span>
              </Link>
              <button onClick={downloadReport} className="action-btn secondary">
                <span className="btn-icon"><Download size={20} /></span>
                <span className="btn-text">Download Report</span>
              </button>
            </div>

            <p className="calc-disclaimer">
              *Past performance does not guarantee future returns. Mutual fund investments are subject to market risks.
            </p>
          </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FundPerformanceCalculator;