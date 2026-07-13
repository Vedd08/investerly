import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Umbrella, Target, Sparkles, Wallet, TrendingUp, Hourglass, Scale, Shield, Building, Download, Lightbulb, Calendar, Info } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import "../../styles/retirement.css";
import { addReportHeader, addReportFooter, addBarChart, addGrowthChart } from "../../utils/pdfHelper";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [returnRate, setReturnRate] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);

  const sectionRef = useRef(null);
  const resultRef = useRef(null);
  const chartRef = useRef(null);

  const result = useMemo(() => {
    const yearsToRetire = retirementAge - currentAge;
    const retirementYears = lifeExpectancy - retirementAge;
    const monthsToRetire = yearsToRetire * 12;
    const monthlyReturn = returnRate / 12 / 100;
    
    // Calculate future monthly expense considering inflation
    const futureMonthlyExpense = monthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetire);
    
    // Calculate corpus needed (considering inflation during retirement)
    let corpusNeeded = 0;
    for (let year = 0; year < retirementYears; year++) {
      const yearlyExpense = futureMonthlyExpense * 12 * Math.pow(1 + inflationRate / 100, year);
      corpusNeeded += yearlyExpense / Math.pow(1 + returnRate / 100, year);
    }
    
    // Future value of current savings
    const futureSavings = currentSavings * Math.pow(1 + returnRate / 100, yearsToRetire);
    
    // Gap to fill
    const gap = Math.max(0, corpusNeeded - futureSavings);
    
    // Monthly investment needed
    const monthlyInvestment = gap * monthlyReturn / 
      ((Math.pow(1 + monthlyReturn, monthsToRetire) - 1) * (1 + monthlyReturn));

    // Yearly projection
    const projection = [];
    let runningCorpus = currentSavings;
    for (let year = 1; year <= yearsToRetire + 5; year++) {
      if (year <= yearsToRetire) {
        // Pre-retirement: adding investments
        runningCorpus = runningCorpus * (1 + returnRate / 100) + (monthlyInvestment * 12);
        projection.push({
          year,
          type: 'accumulation',
          value: runningCorpus
        });
      } else {
        // Post-retirement: withdrawing
        const withdrawalYear = year - yearsToRetire - 1;
        if (withdrawalYear < retirementYears) {
          const yearlyWithdrawal = futureMonthlyExpense * 12 * Math.pow(1 + inflationRate / 100, withdrawalYear);
          runningCorpus = runningCorpus * (1 + returnRate / 100) - yearlyWithdrawal;
          projection.push({
            year,
            type: 'withdrawal',
            value: Math.max(0, runningCorpus)
          });
        }
      }
    }

    return {
      corpusNeeded,
      futureSavings,
      monthlyInvestment,
      monthlyIncome: futureMonthlyExpense,
      yearsToRetire,
      retirementYears,
      gap,
      projection,
      sustainability: runningCorpus > 0 ? 'Sustainable' : 'Review Needed'
    };
  }, [currentAge, retirementAge, monthlyExpense, currentSavings, returnRate, inflationRate, lifeExpectancy]);

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

      gsap.from(".metric-item", {
        scrollTrigger: {
          trigger: resultRef.current,
          start: "top 80%",
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });

      gsap.from(".projection-bar", {
        scrollTrigger: {
          trigger: chartRef.current,
          start: "top 80%",
        },
        width: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: "power2.out"
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

      await addReportHeader(doc, "Retirement Planning Report");
      
      // Personal Details
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Your Details", 20, 70);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const details = [
        ["Current Age:", `${currentAge} years`],
        ["Retirement Age:", `${retirementAge} years`],
        ["Life Expectancy:", `${lifeExpectancy} years`],
        ["Monthly Expense:", formatCurrency(monthlyExpense, true)],
        ["Current Savings:", formatLargeNumber(currentSavings, true)]
      ];
      
      let yPos = 80;
      details.forEach(([label, value]) => {
        doc.text(label, 25, yPos);
        doc.text(value, 100, yPos);
        yPos += 8;
      });
      
      // Results Summary
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Retirement Summary", 20, yPos);
      
      yPos += 10;
      
      // Results boxes
      const results = [
        { label: "Corpus Needed", value: formatLargeNumber(result.corpusNeeded, true), color: [46, 63, 86] },
        { label: "Monthly Investment", value: formatCurrency(result.monthlyInvestment, true), color: [47, 179, 74] },
        { label: "Monthly Income", value: formatCurrency(result.monthlyIncome, true), color: [47, 179, 74] }
      ];
      
      results.forEach((item, index) => {
        const xPos = 20 + (index * 65);
        
        doc.setFillColor(item.color[0], item.color[1], item.color[2]);
        doc.setGState(new doc.GState({ opacity: 0.1 }));
        doc.roundedRect(xPos, yPos, 55, 35, 3, 3, 'F');
        
        doc.setGState(new doc.GState({ opacity: 1 }));
        doc.setTextColor(item.color[0], item.color[1], item.color[2]);
        doc.setFontSize(9);
        doc.text(item.label, xPos + 5, yPos + 8);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(item.value, xPos + 5, yPos + 22);
      });
      
      // Key Metrics
      yPos += 50;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Key Metrics", 20, yPos);
      
      yPos += 10;
      const metrics = [
        ["Years to Retirement:", `${result.yearsToRetire} years`],
        ["Retirement Duration:", `${result.retirementYears} years`],
        ["Gap to Fill:", formatLargeNumber(result.gap, true)],
        ["Sustainability:", result.sustainability]
      ];
      
      metrics.forEach(([label, value], index) => {
        const rowY = yPos + (index * 8);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 124, 143);
        doc.text(label, 25, rowY);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(46, 63, 86);
        doc.text(value, 100, rowY);
      });
      
      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(107, 124, 143);
      doc.text("*This is an estimated projection. Actual returns may vary based on market conditions.", 20, doc.internal.pageSize.height - 20);
      
      
      // Add Growth Chart
      doc.addPage();
      const finalYForChart = 20;
      const chartDataForPDF = result.projection.map(item => ({
        year: item.year,
        invested: item.type === 'accumulation' ? item.value : 0,
        futureValue: item.value
      }));
      addGrowthChart(doc, chartDataForPDF, finalYForChart);
      
      addReportFooter(doc);
      doc.save(`Retirement_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <section className="calculator-section retirement-calculator" ref={sectionRef}>
      <div className="container">
        <div className="calculator-header">
          <span className="calculator-eyebrow">
            <span className="eyebrow-icon"><Umbrella size={16} /></span>
            Retirement Planning
          </span>
          <h1 className="calculator-title">
            Plan Your <span className="text-gradient">Dream Retirement</span>
          </h1>
          <p className="calculator-description">
            Calculate how much you need to save for a comfortable and stress-free retirement.
          </p>
        </div>

        <div className="calculator-grid">
          {/* INPUT PANEL */}
          <div className="calc-inputs glass-effect">
            <div className="input-header">
              <div className="input-icon pulse-animation"><Target size={24} /></div>
              <h3>Current Details</h3>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Current Age</span>
                <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span> Years</span>
                </div>
              </label>
              <input
                type="range"
                min="18"
                max="70"
                step="1"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>18 yrs</span>
                <span>45 yrs</span>
                <span>70 yrs</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Retirement Age</span>
                <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span> Years</span>
                </div>
              </label>
              <input
                type="range"
                min="45"
                max="80"
                step="1"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>45 yrs</span>
                <span>60 yrs</span>
                <span>80 yrs</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Life Expectancy</span>
                <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={lifeExpectancy}
                    onChange={(e) => setLifeExpectancy(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span> Years</span>
                </div>
              </label>
              <input
                type="range"
                min="70"
                max="100"
                step="1"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>70 yrs</span>
                <span>85 yrs</span>
                <span>100 yrs</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Monthly Expense (Current)</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={monthlyExpense}
                    onChange={(e) => setMonthlyExpense(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
              </label>
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={monthlyExpense}
                onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹10K</span>
                <span>₹2.5L</span>
                <span>₹5L</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Current Savings</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
              </label>
              <input
                type="range"
                min="0"
                max="10000000"
                step="100000"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹0</span>
                <span>₹50L</span>
                <span>₹1Cr</span>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group half">
                <label className="input-label">
                  <span>Return Rate</span>
                  <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={returnRate}
                    onChange={(e) => setReturnRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span>%</span>
                </div>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>

              <div className="input-group half">
                <label className="input-label">
                  <span>Inflation</span>
                  <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span>%</span>
                </div>
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>
            </div>

            <div className="quick-tips">
              <div className="tip-item">
                <span className="tip-icon">💡</span>
                <span className="tip-text">Adjust sliders to see real-time impact on your retirement plan</span>
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="calc-results glass-effect" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon float-animation">🎯</div>
              <h3>Your Retirement Plan</h3>
            </div>

            {/* Main Result Card */}
            <div className="main-result-card premium-card">
              <div className="card-glow"></div>
              <div className="result-label">Corpus Needed at Retirement</div>
              <div className="result-number count-animation">{formatLargeNumber(result.corpusNeeded)}</div>
              <div className="result-badge">
                <span className="badge-icon">⏱️</span>
                <span>{result.yearsToRetire} years to go</span>
              </div>
            </div>

            {/* Monthly Investment Card */}
            <div className="investment-card">
              <div className="investment-header">
                <span className="investment-icon">💰</span>
                <span className="investment-label">Monthly Investment Required</span>
              </div>
              <div className="investment-amount">{formatCurrency(result.monthlyInvestment)}</div>
              <div className="investment-progress">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(100, (result.monthlyInvestment / 100000) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">📊</div>
                <div className="metric-content">
                  <div className="metric-label">Monthly Income</div>
                  <div className="metric-value">{formatCurrency(result.monthlyIncome)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><Hourglass size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Retirement Duration</div>
                  <div className="metric-value">{result.retirementYears} years</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><Scale size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Gap to Fill</div>
                  <div className="metric-value">{formatLargeNumber(result.gap)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><Shield size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Sustainability</div>
                  <div className={`metric-value ${result.sustainability === 'Sustainable' ? 'positive' : 'warning'}`}>
                    {result.sustainability}
                  </div>
                </div>
              </div>
            </div>

            {/* Wealth Projection Chart */}
            <div className="chart-section" ref={chartRef}>
              <h4>Wealth Projection</h4>
              <div className="chart-container">
                {result.projection.slice(0, 10).map((data, index) => (
                  <div key={index} className="chart-bar-item">
                    <div className="chart-bar-label">Year {data.year}</div>
                    <div className="chart-bar-wrapper">
                      <div 
                        className={`chart-bar-fill ${data.type === 'accumulation' ? 'accumulation' : 'withdrawal'}`}
                        style={{ width: `${(data.value / result.corpusNeeded) * 100}%` }}
                      ></div>
                    </div>
                    <div className="chart-bar-value">{formatLargeNumber(data.value)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to="/contact" className="action-btn primary">
                <span className="btn-icon"><Calendar size={20} /></span>
                <span className="btn-text">Book Retirement Consultation</span>
                <span className="btn-arrow">→</span>
              </Link>
              <button onClick={downloadReport} className="action-btn secondary">
                <span className="btn-icon"><Download size={20} /></span>
                <span className="btn-text">Download Report</span>
              </button>
            </div>

            {/* Disclaimer */}
            <div className="calc-disclaimer">
              <span className="disclaimer-icon"><Info size={16} /></span>
              <span>*This is an estimated projection. Actual returns may vary based on market conditions and life expectancy.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetirementCalculator;