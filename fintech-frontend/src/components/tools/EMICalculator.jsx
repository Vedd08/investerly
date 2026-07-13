import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Landmark, Lightbulb, BarChart3, Wallet, TrendingUp, CreditCard, Gem, Calendar, Download, Info } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import "../../styles/emi.css";
import { addReportHeader, addReportFooter, addAmortizationChart } from "../../utils/pdfHelper";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(5);
  const [tenureType, setTenureType] = useState('years');
  const [processingFee, setProcessingFee] = useState(0.5);

  const sectionRef = useRef(null);
  const resultRef = useRef(null);
  const chartRef = useRef(null);

  const result = useMemo(() => {
    const P = Number(loanAmount);
    const r = Number(interestRate) / 12 / 100;
    const n = tenureType === 'years' ? Number(tenure) * 12 : Number(tenure);
    const fee = P * (processingFee / 100);

    if (!P || !r || !n || isNaN(P) || isNaN(r) || isNaN(n)) {
      return { emi: 0, totalInterest: 0, totalPayment: 0, processingFee: fee };
    }

    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Year-wise breakdown
    const yearlyBreakdown = [];
    let remainingPrincipal = P;
    
    for (let year = 1; year <= (tenureType === 'years' ? tenure : Math.ceil(n/12)); year++) {
      const monthsInYear = Math.min(12, n - (year - 1) * 12);
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 0; month < monthsInYear; month++) {
        const interestForMonth = remainingPrincipal * r;
        const principalForMonth = emi - interestForMonth;
        
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingPrincipal -= principalForMonth;
      }
      
      yearlyBreakdown.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance: Math.max(0, remainingPrincipal)
      });
    }

    return {
      emi,
      totalInterest,
      totalPayment,
      processingFee: fee,
      totalCost: totalPayment + fee,
      yearlyBreakdown,
      principalRatio: (P / totalPayment) * 100,
      interestRatio: (totalInterest / totalPayment) * 100
    };
  }, [loanAmount, interestRate, tenure, tenureType, processingFee]);

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

      gsap.from(".metric-card", {
        scrollTrigger: {
          trigger: resultRef.current,
          start: "top 80%",
        },
        scale: 0.8,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });

      gsap.from(".pie-segment", {
        scrollTrigger: {
          trigger: chartRef.current,
          start: "top 80%",
        },
        scale: 0,
        duration: 1,
        stagger: 0.2,
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

      await addReportHeader(doc, "Loan EMI Report");
      
      // Loan Details
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Loan Details", 20, 70);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const details = [
        ["Loan Amount:", formatLargeNumber(loanAmount, true)],
        ["Interest Rate:", `${interestRate}% p.a.`],
        ["Tenure:", `${tenure} ${tenureType}`],
        ["Processing Fee:", `${processingFee}% (${formatCurrency(result.processingFee, true)})`]
      ];
      
      let yPos = 80;
      details.forEach(([label, value]) => {
        doc.text(label, 25, yPos);
        doc.text(value, 100, yPos);
        yPos += 8;
      });
      
      // EMI Summary
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("EMI Summary", 20, yPos);
      
      yPos += 10;
      
      // Results boxes
      const results = [
        { label: "Monthly EMI", value: formatCurrency(result.emi, true), color: [46, 63, 86] },
        { label: "Total Interest", value: formatLargeNumber(result.totalInterest, true), color: [47, 179, 74] },
        { label: "Total Payment", value: formatLargeNumber(result.totalPayment, true), color: [47, 179, 74] }
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
      
      // Yearly Breakdown Table
      yPos += 50;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Yearly Breakdown", 20, yPos);
      
      const tableData = result.yearlyBreakdown.map(item => [
        `Year ${item.year}`,
        formatLargeNumber(item.principal, true),
        formatLargeNumber(item.interest, true),
        formatLargeNumber(item.balance, true)
      ]);
      
      autoTable(doc, {
        startY: yPos + 10,
        head: [['Year', 'Principal Paid', 'Interest Paid', 'Balance']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [46, 63, 86],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        }
      });
      
      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(107, 124, 143);
      doc.text("*EMI calculations are approximate. Final terms depend on lender's policies.", 20, doc.internal.pageSize.height - 20);
      
      
      
      // Add Amortization Chart
      doc.addPage();
      const finalYForChart = 20;
      if (result && result.yearlyBreakdown) {
        const mappedSchedule = result.yearlyBreakdown.map(item => ({
          year: item.year,
          principalPaid: item.principal,
          interestPaid: item.interest
        }));
        addAmortizationChart(doc, mappedSchedule, finalYForChart);
      }

      
      addReportFooter(doc);
      doc.save(`EMI_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <section className="calculator-section emi-calculator" ref={sectionRef}>
      <div className="container">
        <div className="calculator-header">
          <span className="calculator-eyebrow">
            <span className="eyebrow-icon"><Landmark size={16} /></span>
            Loan Calculator
          </span>
          <h1 className="calculator-title">
            Calculate Your <span className="text-gradient">Monthly EMI</span>
          </h1>
          <p className="calculator-description">
            Plan your loan repayment with detailed EMI breakdown and total interest calculations.
          </p>
        </div>

        <div className="calculator-grid">
          {/* INPUT PANEL */}
          <div className="calc-inputs glass-effect">
            <div className="input-header">
              <div className="input-icon pulse-animation"><Landmark size={24} /></div>
              <h3>Loan Details</h3>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Loan Amount</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
              </label>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹1L</span>
                <span>₹50L</span>
                <span>₹1Cr</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Interest Rate (% p.a.)</span>
                <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span>%</span>
                </div>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>1%</span>
                <span>10%</span>
                <span>20%</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Processing Fee (%)</span>
                <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={processingFee}
                    onChange={(e) => setProcessingFee(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span>%</span>
                </div>
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={processingFee}
                onChange={(e) => setProcessingFee(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>0%</span>
                <span>1%</span>
                <span>2%</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Loan Tenure</span>
                <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span>  {tenureType}</span>
                </div>
              </label>
              <div className="toggle-group">
                <button 
                  className={`toggle-btn ${tenureType === 'years' ? 'active' : ''}`}
                  onClick={() => setTenureType('years')}
                >
                  Years
                </button>
                <button 
                  className={`toggle-btn ${tenureType === 'months' ? 'active' : ''}`}
                  onClick={() => setTenureType('months')}
                >
                  Months
                </button>
              </div>
              <input
                type="range"
                min={tenureType === 'years' ? "1" : "12"}
                max={tenureType === 'years' ? "30" : "360"}
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>{tenureType === 'years' ? '1y' : '12m'}</span>
                <span>{tenureType === 'years' ? '15y' : '180m'}</span>
                <span>{tenureType === 'years' ? '30y' : '360m'}</span>
              </div>
            </div>

            <div className="quick-tips">
              <div className="tip-item">
                <span className="tip-icon"><Lightbulb size={16} /></span>
                <span className="tip-text">Lower tenure = Higher EMI but less total interest</span>
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="calc-results glass-effect" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon float-animation"><BarChart3 size={24} /></div>
              <h3>Loan Summary</h3>
            </div>

            {/* Main EMI Card */}
            <div className="main-result-card premium-card">
              <div className="card-glow"></div>
              <div className="result-label">Monthly EMI</div>
              <div className="result-number count-animation">{formatCurrency(result.emi)}</div>
              <div className="result-badge">
                <span className="badge-icon"><Landmark size={16} /></span>
                <span>For {tenure} {tenureType}</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon"><Wallet size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Principal Amount</div>
                  <div className="metric-value">{formatLargeNumber(loanAmount)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><TrendingUp size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Total Interest</div>
                  <div className="metric-value">{formatLargeNumber(result.totalInterest)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><CreditCard size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Processing Fee</div>
                  <div className="metric-value">{formatCurrency(result.processingFee)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><Gem size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Total Cost</div>
                  <div className="metric-value">{formatLargeNumber(result.totalCost)}</div>
                </div>
              </div>
            </div>

            {/* Ratio Chart */}
            <div className="ratio-chart" ref={chartRef}>
              <h4>Principal vs Interest</h4>
              <div className="pie-chart" style={{ '--percentage': result.principalRatio }}>
              </div>
              <div className="ratio-labels">
                <div className="ratio-label">
                  <span className="color-dot principal"></span>
                  <span>Principal: {result.principalRatio.toFixed(1)}%</span>
                </div>
                <div className="ratio-label">
                  <span className="color-dot interest"></span>
                  <span>Interest: {result.interestRatio.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Yearly Breakdown */}
            <div className="breakdown-section">
              <h4>Yearly Payment Schedule</h4>
              <div className="breakdown-list">
                {result.yearlyBreakdown.slice(0, 5).map((item, index) => (
                  <div key={index} className="breakdown-item">
                    <div className="breakdown-year">Year {item.year}</div>
                    <div className="breakdown-bars">
                      <div className="breakdown-bar">
                        <div 
                          className="bar-fill principal"
                          style={{ width: `${(item.principal / loanAmount) * 100}%` }}
                        ></div>
                      </div>
                      <div className="breakdown-values">
                        <span className="principal-value">P: {formatLargeNumber(item.principal)}</span>
                        <span className="interest-value">I: {formatLargeNumber(item.interest)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to="/contact" className="action-btn primary">
                <span className="btn-icon"><Calendar size={20} /></span>
                <span className="btn-text">Get Loan Assistance</span>
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
              <span>*EMI calculations are approximate. Final terms depend on lender's policies.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EMICalculator;
