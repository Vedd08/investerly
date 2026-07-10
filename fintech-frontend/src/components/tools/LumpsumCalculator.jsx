import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wallet, Landmark, TrendingUp, Clock, Zap, Gem, Download, Info, Calendar } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import "../../styles/lumpsum.css";
import { addReportHeader, addReportFooter } from "../../utils/pdfHelper";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LumpsumCalculator = () => {
  const [investment, setInvestment] = useState(500000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  const [compounding, setCompounding] = useState('annual');

  const sectionRef = useRef(null);
  const resultRef = useRef(null);
  const chartRef = useRef(null);

  const result = useMemo(() => {
    const P = Number(investment);
    const r = Number(returnRate) / 100;
    const n = Number(years);
    
    let futureValue = 0;
    let compoundingFrequency = 1;
    
    switch(compounding) {
      case 'annual': compoundingFrequency = 1; break;
      case 'semi-annual': compoundingFrequency = 2; break;
      case 'quarterly': compoundingFrequency = 4; break;
      case 'monthly': compoundingFrequency = 12; break;
      default: compoundingFrequency = 1;
    }

    if (!P || !r || !n || isNaN(P) || isNaN(r) || isNaN(n)) {
      return { futureValue: 0, returns: 0 };
    }

    futureValue = P * Math.pow(1 + r / compoundingFrequency, compoundingFrequency * n);
    const returns = futureValue - P;

    // Yearly growth data
    const yearlyGrowth = [];
    for (let year = 1; year <= n; year++) {
      const yearValue = P * Math.pow(1 + r / compoundingFrequency, compoundingFrequency * year);
      yearlyGrowth.push({
        year,
        value: yearValue,
        growth: yearValue - P
      });
    }

    return {
      futureValue,
      returns,
      yearlyGrowth,
      cagr: (Math.pow(futureValue / P, 1 / n) - 1) * 100,
      multiplier: futureValue / P
    };
  }, [investment, returnRate, years, compounding]);

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

      gsap.from(".growth-bar", {
        scrollTrigger: {
          trigger: chartRef.current,
          start: "top 80%",
        },
        width: 0,
        duration: 1.2,
        stagger: 0.1,
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

      await addReportHeader(doc, "Lumpsum Investment Report");
      
      // Investment Details
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Investment Details", 20, 70);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const details = [
        ["Initial Investment:", formatLargeNumber(investment, true)],
        ["Expected Return:", `${returnRate}% p.a.`],
        ["Time Period:", `${years} years`],
        ["Compounding:", compounding === 'annual' ? 'Annual' : 
                       compounding === 'semi-annual' ? 'Semi-Annual' :
                       compounding === 'quarterly' ? 'Quarterly' : 'Monthly']
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
      doc.text("Investment Summary", 20, yPos);
      
      yPos += 10;
      
      // Results boxes
      const results = [
        { label: "Future Value", value: formatLargeNumber(result.futureValue, true), color: [46, 63, 86] },
        { label: "Total Returns", value: formatLargeNumber(result.returns, true), color: [47, 179, 74] },
        { label: "Wealth Ratio", value: `${result.multiplier.toFixed(2)}x`, color: [47, 179, 74] }
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
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(item.value, xPos + 5, yPos + 22);
      });
      
      // Yearly Growth Table
      yPos += 50;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Yearly Growth", 20, yPos);
      
      const tableData = result.yearlyGrowth.map(item => [
        `Year ${item.year}`,
        formatLargeNumber(item.value, true),
        formatLargeNumber(item.growth, true),
        `${((item.value / investment - 1) * 100).toFixed(2)}%`
      ]);
      
      autoTable(doc, {
        startY: yPos + 10,
        head: [['Year', 'Value', 'Growth', 'Returns %']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [46, 63, 86],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        }
      });
      
      // Key Metrics
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Key Metrics", 20, finalY);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`CAGR: ${result.cagr.toFixed(2)}%`, 25, finalY + 10);
      doc.text(`Money Multiplier: ${result.multiplier.toFixed(2)}x`, 25, finalY + 20);
      
      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(107, 124, 143);
      doc.text("*Returns are for illustration only. Actual returns may vary based on market conditions.", 20, doc.internal.pageSize.height - 20);
      
      addReportFooter(doc);
      doc.save(`Lumpsum_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <section className="calculator-section lumpsum-calculator" ref={sectionRef}>
      <div className="container">
        <div className="calculator-header">
          <span className="calculator-eyebrow">
            <span className="eyebrow-icon"><Wallet size={16} /></span>
            Investment Tool
          </span>
          <h1 className="calculator-title">
            Grow Your <span className="text-gradient">Lumpsum Investment</span>
          </h1>
          <p className="calculator-description">
            See how your one-time investment grows with the power of compounding.
          </p>
        </div>

        <div className="calculator-grid">
          {/* INPUT PANEL */}
          <div className="calc-inputs glass-effect">
            <div className="input-header">
              <div className="input-icon pulse-animation"><Landmark size={24} /></div>
              <h3>Investment Details</h3>
            </div>

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
                step="10000"
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

            <div className="input-group">
              <label className="input-label">
                <span>Expected Return (% p.a.)</span>
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
                max="30"
                step="0.5"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>1%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Time Period (Years)</span>
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
                <span>Compounding Frequency</span>
              </label>
              <div className="compounding-grid">
                {['annual', 'semi-annual', 'quarterly', 'monthly'].map((type) => (
                  <button
                    key={type}
                    className={`compounding-btn ${compounding === type ? 'active' : ''}`}
                    onClick={() => setCompounding(type)}
                  >
                    {type === 'annual' ? 'Annual' :
                     type === 'semi-annual' ? 'Semi-Annual' :
                     type === 'quarterly' ? 'Quarterly' : 'Monthly'}
                  </button>
                ))}
              </div>
            </div>

            <div className="preset-buttons">
              <button 
                className={`preset-btn ${years === 5 ? 'active' : ''}`}
                onClick={() => setYears(5)}
              >
                5 Years
              </button>
              <button 
                className={`preset-btn ${years === 10 ? 'active' : ''}`}
                onClick={() => setYears(10)}
              >
                10 Years
              </button>
              <button 
                className={`preset-btn ${years === 15 ? 'active' : ''}`}
                onClick={() => setYears(15)}
              >
                15 Years
              </button>
              <button 
                className={`preset-btn ${years === 20 ? 'active' : ''}`}
                onClick={() => setYears(20)}
              >
                20 Years
              </button>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="calc-results glass-effect" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon float-animation"><TrendingUp size={24} /></div>
              <h3>Wealth Projection</h3>
            </div>

            {/* Main Result Card */}
            <div className="main-result-card premium-card">
              <div className="card-glow"></div>
              <div className="result-label">Future Value</div>
              <div className="result-number count-animation">{formatLargeNumber(result.futureValue)}</div>
              <div className="result-badge">
                <span className="badge-icon"><Clock size={16} /></span>
                <span>After {years} years</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon"><Wallet size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Invested Amount</div>
                  <div className="metric-value">{formatLargeNumber(investment)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><TrendingUp size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Total Returns</div>
                  <div className="metric-value">{formatLargeNumber(result.returns)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><Zap size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">CAGR</div>
                  <div className="metric-value">{result.cagr.toFixed(2)}%</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><Gem size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Wealth Ratio</div>
                  <div className="metric-value">{result.multiplier.toFixed(2)}x</div>
                </div>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="growth-chart-section" ref={chartRef}>
              <h4>Year-by-Year Growth</h4>
              <div className="growth-bars">
                {result.yearlyGrowth.slice(0, 10).map((data, index) => (
                  <div key={index} className="growth-bar-item">
                    <div className="growth-bar-label">Y{data.year}</div>
                    <div className="growth-bar-container">
                      <div 
                        className="growth-bar-fill"
                        style={{ width: `${(data.value / result.futureValue) * 100}%` }}
                      ></div>
                    </div>
                    <div className="growth-bar-value">{formatLargeNumber(data.value)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to="/contact" className="action-btn primary">
                <span className="btn-icon"><Calendar size={20} /></span>
                <span className="btn-text">Get Investment Advice</span>
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
              <span>*Returns are for illustration only. Actual returns may vary based on market conditions.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LumpsumCalculator;