import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Clock, Wallet, Zap, Calendar, Download, Info } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import { addReportHeader, addReportFooter } from "../../utils/pdfHelper";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SIPCalculator = () => {
  const [monthly, setMonthly] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  const [chartData, setChartData] = useState([]);
  
  const sectionRef = useRef(null);
  const resultRef = useRef(null);
  const chartRef = useRef(null);

  // Calculate SIP returns
  const result = useMemo(() => {
    const P = Number(monthly);
    const r = Number(returnRate) / 12 / 100;
    const n = Number(years) * 12;

    if (!P || !r || !n || isNaN(P) || isNaN(r) || isNaN(n)) {
      return { invested: 0, returns: 0, futureValue: 0 };
    }

    const futureValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = P * n;
    const returns = futureValue - invested;

    return {
      invested,
      returns,
      futureValue
    };
  }, [monthly, returnRate, years]);

  // Generate chart data for year-by-year projection
  useEffect(() => {
    const P = Number(monthly);
    const r = Number(returnRate) / 12 / 100;
    const n = Number(years) * 12;
    
    const yearlyData = [];
    for (let year = 1; year <= years; year++) {
      const months = year * 12;
      const futureValue = P * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
      const invested = P * months;
      
      yearlyData.push({
        year,
        invested,
        futureValue
      });
    }
    setChartData(yearlyData);
  }, [monthly, returnRate, years]);

  // Animation effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".calc-inputs, .calc-results", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });

      gsap.from(".result-item, .main-result-card", {
        scrollTrigger: {
          trigger: resultRef.current,
          start: "top 80%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      });

      gsap.from(".chart-bar-fill", {
        scrollTrigger: {
          trigger: chartRef.current,
          start: "top 80%",
        },
        height: 0,
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

  const handleSliderChange = (setter) => (e) => {
    setter(Number(e.target.value));
  };

  const downloadReport = async () => {
  try {
    if (!chartData || chartData.length === 0) {
      alert("Please wait for chart data to load...");
      return;
    }
    
    const doc = new jsPDF();

      await addReportHeader(doc, "SIP Investment Report");
    
    // Investment Details
    doc.setFontSize(14);
    doc.setTextColor(46, 63, 86);
    doc.setFont("helvetica", "bold");
    doc.text("Investment Details", 20, 70);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(31, 42, 54);
    
    const details = [
      ["Monthly Investment:", `Rs. ${Number(monthly).toLocaleString('en-IN')}`],
      ["Expected Return:", `${returnRate}% p.a.`],
      ["Time Period:", `${years} years`],
      ["Total Investment Months:", `${years * 12} months`]
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
    doc.setTextColor(46, 63, 86);
    doc.text("Investment Summary", 20, yPos);
    
    yPos += 10;
    
    // Results boxes
    const results = [
      { label: "Total Invested", value: formatLargeNumber(result.invested, true), color: [46, 63, 86] },
      { label: "Estimated Returns", value: formatLargeNumber(result.returns, true), color: [47, 179, 74] },
      { label: "Future Value", value: formatLargeNumber(result.futureValue, true), color: [47, 179, 74] }
    ];
    
    results.forEach((item, index) => {
      const xPos = 20 + (index * 65);
      
      // Background with opacity
      doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      doc.setGState(new doc.GState({ opacity: 0.1 }));
      doc.roundedRect(xPos, yPos, 55, 35, 3, 3, 'F');
      
      // Reset opacity for text
      doc.setGState(new doc.GState({ opacity: 1 }));
      doc.setTextColor(item.color[0], item.color[1], item.color[2]);
      doc.setFontSize(9);
      doc.text(item.label, xPos + 5, yPos + 8);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(item.value, xPos + 5, yPos + 22);
    });
    
    // Year-by-Year Table
    yPos += 50;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 63, 86);
    doc.text("Year-by-Year Growth", 20, yPos);
    
    yPos += 8;
    
    // Table data
    const tableData = chartData.map(data => [
      `Year ${data.year}`,
      formatLargeNumber(data.invested, true),
      formatLargeNumber(data.futureValue - data.invested, true),
      formatLargeNumber(data.futureValue, true)
    ]);
    
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Year', 'Invested', 'Returns', 'Future Value']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [46, 63, 86],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 }
      },
      margin: { left: 20, right: 20 }
    });
    
    // Key Metrics
    yPos = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 63, 86);
    doc.text("Key Metrics", 20, yPos);
    
    yPos += 8;
    
    const metrics = [
      ["Time to Double:", `${Math.ceil(72 / returnRate)} years`],
      ["Monthly Return:", formatLargeNumber(result.returns / (years * 12, true))],
      ["Wealth Ratio:", `${(result.futureValue / result.invested).toFixed(2)}x`],
      ["CAGR:", `${returnRate}%`]
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
    yPos = doc.lastAutoTable.finalY + 45;
    doc.setFontSize(8);
    doc.setTextColor(107, 124, 143);
    doc.text("*Returns are for illustration only. Actual returns may vary based on market conditions.", 20, yPos);
    
    // Save PDF
    addReportFooter(doc);
      doc.save(`SIP_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    
  } catch(error) {
    console.log("PDF Generation Error:", error);
    alert("PDF generation failed. Please try again.");
  }
};

  return (
    <section className="calculator-section" ref={sectionRef}>
      <div className="container">
        
        {/* Header */}
        <div className="calculator-header">
          <span className="calculator-eyebrow">Financial Planning Tool</span>
          <h1 className="calculator-title">SIP Calculator</h1>
          <p className="calculator-description">
            Plan your investments with precision. See how your monthly SIP can grow over time.
          </p>
        </div>

        <div className="calculator-grid">
          
          {/* INPUT PANEL */}
          <div className="calc-inputs animate-card">
            <div className="input-header">
              <div className="input-icon"><BarChart3 size={24} /></div>
              <h3>Investment Details</h3>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Monthly Investment</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={monthly}
                    onChange={(e) => setMonthly(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
              </label>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthly}
                onChange={handleSliderChange(setMonthly)}
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
                onChange={handleSliderChange(setReturnRate)}
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
                onChange={handleSliderChange(setYears)}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>1y</span>
                <span>15y</span>
                <span>30y</span>
              </div>
            </div>

            {/* Quick Presets */}
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

            {/* Info Note */}
            <div className="input-note">
              <span className="note-icon"><Info size={16} /></span>
              <span className="note-text">Adjust sliders to see real-time calculations</span>
            </div>
          </div>

          {/* RESULT PANEL */}
          <div className="calc-results animate-card" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon"><TrendingUp size={24} /></div>
              <h3>Your Wealth Projection</h3>
            </div>

            {/* Main Result Card */}
            <div className="main-result-card">
              <div className="result-label">Future Value</div>
              <div className="result-number">{formatLargeNumber(result.futureValue)}</div>
              <div className="result-breakdown">
                <div className="breakdown-item">
                  <span>Invested</span>
                  <strong>{formatLargeNumber(result.invested)}</strong>
                </div>
                <div className="breakdown-item">
                  <span>Returns</span>
                  <strong>{formatLargeNumber(result.returns)}</strong>
                </div>
              </div>
            </div>

            {/* Mini Chart */}
            <div className="mini-chart" ref={chartRef}>
              <div className="chart-bars">
                {chartData.slice(-5).map((data, index) => (
                  <div key={index} className="chart-bar-container">
                    <div className="chart-bar-wrapper">
                      <div 
                        className="chart-bar-fill"
                        style={{
                          height: `${(data.futureValue / result.futureValue) * 100}%`,
                          backgroundColor: index === 4 ? 'var(--color-accent)' : 'var(--color-primary)'
                        }}
                      ></div>
                    </div>
                    <span className="chart-label">Y{data.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="key-metrics">
              <div className="metric-item">
                <div className="metric-icon"><Clock size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Time to Double</div>
                  <div className="metric-value">
                    {Math.ceil(72 / returnRate)} years
                  </div>
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-icon"><BarChart3 size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Monthly Return</div>
                  <div className="metric-value">
                    {formatLargeNumber(result.returns / (years * 12))}
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Chart Title */}
            <div className="chart-title-section">
              <h4>Year-by-Year Growth</h4>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-dot invested"></span>
                  Invested
                </span>
                <span className="legend-item">
                  <span className="legend-dot returns"></span>
                  Returns
                </span>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="growth-chart">
              {chartData.map((data, index) => (
                <div key={index} className="chart-row">
                  <span className="chart-year">Year {data.year}</span>
                  <div className="chart-progress">
                    <div className="progress-invested" 
                         style={{ width: `${(data.invested / result.futureValue) * 100}%` }}>
                    </div>
                    <div className="progress-returns" 
                         style={{ width: `${((data.futureValue - data.invested) / result.futureValue) * 100}%` }}>
                    </div>
                  </div>
                  <span className="chart-amount">{formatLargeNumber(data.futureValue)}</span>
                </div>
              ))}
            </div>

            {/* Growth Statistics */}
            <div className="growth-stats">
              <div className="stat-card">
                <div className="stat-icon"><TrendingUp size={24} /></div>
                <div className="stat-content">
                  <div className="stat-label">CAGR</div>
                  <div className="stat-value">{returnRate}%</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><Wallet size={24} /></div>
                <div className="stat-content">
                  <div className="stat-label">XIRR</div>
                  <div className="stat-value">{returnRate}%</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><Zap size={24} /></div>
                <div className="stat-content">
                  <div className="stat-label">Wealth Ratio</div>
                  <div className="stat-value">
                    {(result.futureValue / result.invested).toFixed(2)}x
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - FIXED with Link and button */}
            <div className="calc-actions">
              <Link to="/contact" className="action-btn primary">
                <span className="btn-icon"><Calendar size={20} /></span>
                <span>Book Consultation</span>
              </Link>
              <button onClick={downloadReport} className="action-btn secondary">
                <span className="btn-icon"><Download size={20} /></span>
                <span>Download Report</span>
              </button>
            </div>

            {/* Disclaimer */}
            <p className="calc-disclaimer">
              *Returns are for illustration only. Actual returns may vary based on market conditions.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SIPCalculator;