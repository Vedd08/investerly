import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, BarChart3, Lightbulb, Calendar, Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import "../../styles/sip-performance.css";
import { addReportHeader, addReportFooter, addGrowthChart } from "../../utils/pdfHelper";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SIPPerformanceCalculator = () => {
  const [monthlySIP, setMonthlySIP] = useState(5000);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(10); // Annual step-up percentage
  const [scenario, setScenario] = useState('moderate'); // 'conservative', 'moderate', 'aggressive'
  const [lumpsumInvestment, setLumpsumInvestment] = useState(100000);
  const [showLumpsum, setShowLumpsum] = useState(false);

  const sectionRef = useRef(null);
  const resultRef = useRef(null);
  const chartRef = useRef(null);

  // Market scenarios
  const marketScenarios = {
    conservative: {
      name: 'Conservative',
      returns: 10,
      volatility: 5,
      color: '#3498db',
      description: 'Lower risk, stable returns'
    },
    moderate: {
      name: 'Moderate',
      returns: 12,
      volatility: 8,
      color: '#2FB34A',
      description: 'Balanced risk-reward'
    },
    aggressive: {
      name: 'Aggressive',
      returns: 15,
      volatility: 12,
      color: '#e67e22',
      description: 'Higher risk, potential for higher returns'
    }
  };

  const result = useMemo(() => {
    const selectedScenario = marketScenarios[scenario];
    const monthlyRate = selectedScenario.returns / 12 / 100;
    const months = years * 12;
    
    // Calculate SIP with step-up
    let sipValues = [];
    let sipTotal = 0;
    let sipFutureValue = 0;
    let currentSIP = monthlySIP;
    
    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        sipFutureValue = (sipFutureValue + currentSIP) * (1 + monthlyRate);
        sipTotal += currentSIP;
      }
      sipValues.push({
        year,
        sip: currentSIP,
        total: sipTotal,
        value: sipFutureValue
      });
      currentSIP *= (1 + stepUp / 100);
    }

    // Calculate lumpsum if enabled
    let lumpsumFutureValue = 0;
    if (showLumpsum) {
      lumpsumFutureValue = lumpsumInvestment * Math.pow(1 + selectedScenario.returns / 100, years);
    }

    const totalFutureValue = sipFutureValue + lumpsumFutureValue;
    const totalInvested = sipTotal + (showLumpsum ? lumpsumInvestment : 0);
    const totalReturns = totalFutureValue - totalInvested;
    const xirr = (Math.pow(totalFutureValue / totalInvested, 1 / years) - 1) * 100;

    // Generate volatility-adjusted scenarios (Monte Carlo simulation simplified)
    const scenarios = {
      optimistic: totalFutureValue * (1 + selectedScenario.volatility / 100),
      expected: totalFutureValue,
      pessimistic: totalFutureValue * (1 - selectedScenario.volatility / 100)
    };

    // Yearly breakdown for chart
    const yearlyData = [];
    let runningValue = lumpsumInvestment;
    let runningSIP = monthlySIP;
    
    for (let year = 1; year <= years; year++) {
      if (showLumpsum) {
        runningValue = runningValue * (1 + selectedScenario.returns / 100);
      }
      
      // Add SIP for the year
      for (let month = 1; month <= 12; month++) {
        runningValue = (runningValue + runningSIP) * (1 + monthlyRate);
      }
      
      yearlyData.push({
        year,
        value: runningValue,
        invested: (sipTotal / years) * year + (showLumpsum ? lumpsumInvestment : 0)
      });
      
      runningSIP *= (1 + stepUp / 100);
    }

    return {
      sipFutureValue,
      lumpsumFutureValue,
      totalFutureValue,
      totalInvested,
      totalReturns,
      xirr,
      scenarios,
      yearlyData,
      sipValues,
      stepUpSIP: currentSIP / (1 + stepUp / 100),
      finalSIP: currentSIP,
      selectedScenario,
      wealthRatio: totalFutureValue / totalInvested,
      annualizedReturn: selectedScenario.returns
    };
  }, [monthlySIP, years, stepUp, scenario, lumpsumInvestment, showLumpsum]);

  useEffect(() => {
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

      gsap.from(".scenario-card, .yearly-bar", {
        scrollTrigger: {
          trigger: resultRef.current,
          start: "top 80%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const formatCurrency = (num, forPDF = false) => {
    if (!num || isNaN(num)) return forPDF ? 'Rs. 0' : '₹0';
    const formatted = num.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
    return forPDF ? formatted.replace(/₹/g, 'Rs. ') : formatted;
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

      await addReportHeader(doc, "SIP Performance Report");
      
      // Investment Details
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Investment Details", 20, 70);
      
      const details = [
        ["Monthly SIP:", formatCurrency(monthlySIP, true)],
        ["Investment Period:", `${years} years`],
        ["Annual Step-Up:", `${stepUp}%`],
        ["Market Scenario:", result.selectedScenario.name],
        ["Expected Returns:", `${result.selectedScenario.returns}% p.a.`],
        ["Lumpsum Investment:", showLumpsum ? formatCurrency(lumpsumInvestment, true) : 'Not Included']
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
        ["Final Value:", formatLargeNumber(result.totalFutureValue, true)],
        ["Total Returns:", formatLargeNumber(result.totalReturns, true)],
        ["XIRR:", `${result.xirr.toFixed(2)}%`],
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
      
      // Scenario Analysis
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Scenario Analysis", 20, finalY);
      
      const scenarioData = [
        ["Optimistic:", formatLargeNumber(result.scenarios.optimistic, true)],
        ["Expected:", formatLargeNumber(result.scenarios.expected, true)],
        ["Pessimistic:", formatLargeNumber(result.scenarios.pessimistic, true)]
      ];
      
      autoTable(doc, {
        startY: finalY + 5,
        body: scenarioData,
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
      doc.text("*This is a simulated performance. Actual returns may vary based on market conditions.", 20, doc.internal.pageSize.height - 20);
      
      
            // Add Growth Chart
      doc.addPage();
      const finalYForChart = 20;
      if (result && result.yearlyData) {
        const chartDataForPDF = result.yearlyData.map(item => ({
          year: item.year,
          invested: item.invested,
          futureValue: item.value
        }));
        addGrowthChart(doc, chartDataForPDF, finalYForChart);
      }
      
      addReportFooter(doc);
      doc.save(`SIP_Performance_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <section className="calculator-section sip-performance-calculator" ref={sectionRef}>
      <div className="container">
        <div className="calculator-header">
          <span className="calculator-eyebrow">
            <span className="eyebrow-icon"><TrendingUp size={16} /></span>
            SIP Performance Analyzer
          </span>
          <h1 className="calculator-title">
            Analyze Your <span className="text-gradient">SIP Performance</span>
          </h1>
          <p className="calculator-description">
            Project your SIP growth with step-up options and different market scenarios.
          </p>
        </div>

        <div className="calculator-grid">
          {/* INPUT PANEL */}
          <div className="calc-inputs glass-effect">
            <div className="input-header">
              <div className="input-icon pulse-animation"><BarChart3 size={24} /></div>
              <h3>SIP Details</h3>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Monthly SIP Amount</span>
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

            <div className="input-group">
              <label className="input-label">
                <span>Investment Period (Years)</span>
                <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span> Years</span>
                </div>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>1y</span>
                <span>15y</span>
                <span>30y</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Annual Step-Up (%)</span>
                <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={stepUp}
                    onChange={(e) => setStepUp(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span>%</span>
                </div>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={stepUp}
                onChange={(e) => setStepUp(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>0%</span>
                <span>10%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Market Scenarios */}
            <div className="scenario-selector">
              <label className="input-label">Market Scenario</label>
              <div className="scenario-grid">
                {Object.entries(marketScenarios).map(([key, value]) => (
                  <button
                    key={key}
                    className={`scenario-card ${scenario === key ? 'active' : ''}`}
                    onClick={() => setScenario(key)}
                    style={{ '--scenario-color': value.color }}
                  >
                    <span className="scenario-name">{value.name}</span>
                    <span className="scenario-return">{value.returns}%</span>
                    <span className="scenario-desc">{value.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lumpsum Toggle */}
            <div className="lumpsum-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showLumpsum}
                  onChange={(e) => setShowLumpsum(e.target.checked)}
                />
                <span className="toggle-text">Include Lumpsum Investment</span>
              </label>
            </div>

            {showLumpsum && (
              <div className="input-group">
                <label className="input-label">
                  <span>Lumpsum Amount</span>
                  <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={lumpsumInvestment}
                    onChange={(e) => setLumpsumInvestment(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="50000"
                  value={lumpsumInvestment}
                  onChange={(e) => setLumpsumInvestment(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
                <div className="slider-range">
                  <span>₹10K</span>
                  <span>₹50L</span>
                  <span>₹1Cr</span>
                </div>
              </div>
            )}

            <div className="quick-tips">
              <div className="tip-item">
                <span className="tip-icon"><Lightbulb size={16} /></span>
                <span className="tip-text">Step-up SIP helps beat inflation and build larger corpus</span>
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="calc-results glass-effect" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon float-animation"><TrendingUp size={24} /></div>
              <h3>Performance Analysis</h3>
            </div>

            {/* Main Result Card */}
            <div className="main-result-card premium-card">
              <div className="card-glow"></div>
              <div className="result-label">Projected Corpus</div>
              <div className="result-number count-animation">{formatLargeNumber(result.totalFutureValue)}</div>
              <div className="result-badge">
                <span className="badge-icon"><BarChart3 size={16} /></span>
                <span>XIRR: {result.xirr.toFixed(2)}%</span>
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

            {/* SIP Growth Timeline */}
            <div className="growth-timeline" ref={chartRef}>
              <h4>SIP Growth Timeline</h4>
              <div className="timeline-bars">
                {result.yearlyData.slice(0, 8).map((data, index) => (
                  <div key={index} className="timeline-item">
                    <span className="timeline-year">Y{data.year}</span>
                    <div className="timeline-bar-container">
                      <div 
                        className="timeline-bar-fill"
                        style={{ 
                          width: `${(data.value / result.totalFutureValue) * 100}%`,
                          backgroundColor: marketScenarios[scenario].color
                        }}
                      ></div>
                    </div>
                    <span className="timeline-value">{formatLargeNumber(data.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-Up Progression */}
            <div className="stepup-progression">
              <h4>SIP Step-Up Progression</h4>
              <div className="progression-cards">
                <div className="progression-card">
                  <span className="card-label">Starting SIP</span>
                  <span className="card-value">{formatCurrency(monthlySIP)}</span>
                </div>
                <div className="progression-card">
                  <span className="card-label">Final SIP</span>
                  <span className="card-value highlight">{formatCurrency(result.finalSIP)}</span>
                </div>
                <div className="progression-card">
                  <span className="card-label">Average SIP</span>
                  <span className="card-value">{formatCurrency((monthlySIP + result.finalSIP) / 2)}</span>
                </div>
              </div>
            </div>

            {/* Scenario Analysis */}
            <div className="scenario-analysis">
              <h4>Scenario Analysis</h4>
              <div className="scenario-results">
                <div className="scenario-result optimistic">
                  <span className="scenario-label">Optimistic</span>
                  <span className="scenario-value">{formatLargeNumber(result.scenarios.optimistic)}</span>
                  <span className="scenario-diff">+{((result.scenarios.optimistic / result.scenarios.expected - 1) * 100).toFixed(1)}%</span>
                </div>
                <div className="scenario-result expected">
                  <span className="scenario-label">Expected</span>
                  <span className="scenario-value">{formatLargeNumber(result.scenarios.expected)}</span>
                </div>
                <div className="scenario-result pessimistic">
                  <span className="scenario-label">Pessimistic</span>
                  <span className="scenario-value">{formatLargeNumber(result.scenarios.pessimistic)}</span>
                  <span className="scenario-diff negative">{((result.scenarios.pessimistic / result.scenarios.expected - 1) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to="/contact" className="action-btn primary">
                <span className="btn-icon"><Calendar size={20} /></span>
                <span className="btn-text">Get Expert Advice</span>
                <span className="btn-arrow">→</span>
              </Link>
              <button onClick={downloadReport} className="action-btn secondary">
                <span className="btn-icon"><Download size={20} /></span>
                <span className="btn-text">Download Report</span>
              </button>
            </div>

            <p className="calc-disclaimer">
              *This is a simulated performance based on historical market trends. Actual returns may vary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SIPPerformanceCalculator;