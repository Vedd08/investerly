import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Landmark, Clock, Wallet, TrendingUp, CreditCard, Calendar, Download, Info } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import { addReportHeader, addReportFooter } from "../../utils/pdfHelper";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HomeLoanCalculator = () => {
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [loanTenure, setLoanTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [processingFee, setProcessingFee] = useState(0.5);
  const [propertyType, setPropertyType] = useState('residential');

  const sectionRef = useRef(null);
  const resultRef = useRef(null);

  const loanAmount = useMemo(() => {
    return Math.max(0, propertyPrice - downPayment);
  }, [propertyPrice, downPayment]);

  const result = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;

    if (!P || !r || !n || isNaN(P) || isNaN(r) || isNaN(n)) {
      return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const processingFeeAmount = P * (processingFee / 100);

    // Yearly amortization schedule
    const yearlySchedule = [];
    let balance = P;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    for (let year = 1; year <= loanTenure; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let month = 1; month <= 12; month++) {
        if (balance <= 0) break;

        const interestForMonth = balance * r;
        const principalForMonth = emi - interestForMonth;

        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        balance -= principalForMonth;
      }

      totalPrincipalPaid += yearlyPrincipal;
      totalInterestPaid += yearlyInterest;

      yearlySchedule.push({
        year,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        balance: Math.max(0, balance),
        totalPrincipal: totalPrincipalPaid,
        totalInterest: totalInterestPaid
      });
    }

    return {
      emi,
      totalInterest,
      totalPayment,
      loanAmount: P,
      downPayment,
      propertyPrice,
      processingFee: processingFeeAmount,
      totalCost: totalPayment + processingFeeAmount + downPayment,
      ltvRatio: (P / propertyPrice) * 100,
      yearlySchedule,
      principalRatio: (P / totalPayment) * 100,
      interestRatio: (totalInterest / totalPayment) * 100,
      taxBenefit: {
        principalDeduction: Math.min(150000, totalPrincipalPaid / loanTenure),
        interestDeduction: Math.min(200000, totalInterest / loanTenure)
      }
    };
  }, [loanAmount, interestRate, loanTenure, processingFee, propertyPrice, downPayment]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".calculator-header, .calc-inputs, .calc-results", {
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

      await addReportHeader(doc, "Home Loan Analysis Report");

      // Property Details
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Property & Loan Details", 20, 70);

      const details = [
        ["Property Price:", formatLargeNumber(propertyPrice, true)],
        ["Down Payment:", formatLargeNumber(downPayment, true)],
        ["Loan Amount:", formatLargeNumber(loanAmount, true)],
        ["Interest Rate:", `${interestRate}% p.a.`],
        ["Loan Tenure:", `${loanTenure} years`],
        ["Property Type:", propertyType === 'residential' ? 'Residential' : 'Commercial']
      ];

      let yPos = 80;
      details.forEach(([label, value]) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(label, 25, yPos);
        doc.text(value, 100, yPos);
        yPos += 8;
      });

      // Loan Summary
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Loan Summary", 20, yPos);

      const summaryData = [
        ["Monthly EMI:", formatCurrency(result.emi, true)],
        ["Total Interest:", formatLargeNumber(result.totalInterest, true)],
        ["Total Payment:", formatLargeNumber(result.totalPayment, true)],
        ["Processing Fee:", formatCurrency(result.processingFee, true)],
        ["Total Cost of Home:", formatLargeNumber(result.totalCost, true)]
      ];

      autoTable(doc, {
        startY: yPos + 5,
        body: summaryData,
        theme: 'striped',
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'right' }
        }
      });

      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(107, 124, 143);
      doc.text("*This is an estimate. Actual loan terms depend on bank policies and credit assessment.", 20, doc.internal.pageSize.height - 20);

      addReportFooter(doc);
      doc.save(`Home_Loan_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <section className="calculator-section home-loan-calculator" ref={sectionRef}>
      <div className="container">
        <div className="calculator-header">
          <span className="calculator-eyebrow">
            <span className="eyebrow-icon"><Home size={16} /></span>
            Home Loan Calculator
          </span>
          <h1 className="calculator-title">
            Plan Your <span className="text-gradient">Dream Home</span>
          </h1>
          <p className="calculator-description">
            Calculate EMI, check eligibility, and plan your home loan repayment.
          </p>
        </div>

        <div className="calculator-grid">
          {/* INPUT PANEL */}
          <div className="calc-inputs glass-effect">
            <div className="input-header">
              <div className="input-icon pulse-animation"><Home size={24} /></div>
              <h3>Loan Details</h3>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Property Price</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />

                </div>
              </label>
              <input
                type="range"
                min="1000000"
                max="10000000"
                step="500000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹10L</span>
                <span>₹50L</span>
                <span>₹1Cr</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Down Payment</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />

                </div>
              </label>
              <input
                type="range"
                min="0"
                max={propertyPrice * 0.5}
                step="100000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹0</span>
                <span>₹25L</span>
                <span>₹50L</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Loan Amount</span>
                <span className="input-value highlight">₹{loanAmount.toLocaleString()}</span>
              </label>
              <div className="loan-info">
                <span className="ltv-badge">LTV: {result.ltvRatio.toFixed(1)}%</span>
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
                min="6"
                max="12"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>6%</span>
                <span>9%</span>
                <span>12%</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Loan Tenure (Years)</span>
                <div className="input-value-wrapper highlight">

                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span> Years</span>
                </div>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>5y</span>
                <span>15y</span>
                <span>30y</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Property Type</label>
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${propertyType === 'residential' ? 'active' : ''}`}
                  onClick={() => setPropertyType('residential')}
                >
                  Residential
                </button>
                <button
                  className={`toggle-btn ${propertyType === 'commercial' ? 'active' : ''}`}
                  onClick={() => setPropertyType('commercial')}
                >
                  Commercial
                </button>
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="calc-results glass-effect" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon float-animation"><Landmark size={24} /></div>
              <h3>Loan Summary</h3>
            </div>

            {/* Main EMI Card */}
            <div className="main-result-card premium-card">
              <div className="card-glow"></div>
              <div className="result-label">Monthly EMI</div>
              <div className="result-number count-animation">{formatCurrency(result.emi)}</div>
              <div className="result-badge">
                <span className="badge-icon"><Clock size={16} /></span>
                <span>for {loanTenure} years</span>
              </div>
            </div>



            {/* Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon"><Wallet size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Loan Amount</div>
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
                <div className="metric-icon"><Home size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Total Home Cost</div>
                  <div className="metric-value">{formatLargeNumber(result.totalCost)}</div>
                </div>
              </div>
            </div>

            {/* Amortization Preview */}
            <div className="amortization-preview">
              <h4>Yearly Repayment Schedule</h4>
              <div className="preview-list">
                {result.yearlySchedule.slice(0, 5).map((item, index) => (
                  <div key={index} className="preview-item">
                    <span className="preview-year">Year {item.year}</span>
                    <div className="preview-bar">
                      <div
                        className="bar-principal"
                        style={{ width: `${(item.principalPaid / loanAmount) * 100}%` }}
                      ></div>
                      <div
                        className="bar-interest"
                        style={{ width: `${(item.interestPaid / loanAmount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="preview-balance">{formatLargeNumber(item.balance)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Benefits */}
            <div className="tax-benefits">
              <h4>Tax Benefits (per year)</h4>
              <div className="benefit-items">
                <div className="benefit-item">
                  <span>Principal (Sec 80C)</span>
                  <span className="benefit-value">{formatCurrency(result.taxBenefit.principalDeduction)}</span>
                </div>
                <div className="benefit-item">
                  <span>Interest (Sec 24)</span>
                  <span className="benefit-value">{formatCurrency(result.taxBenefit.interestDeduction)}</span>
                </div>
                <div className="benefit-item total">
                  <span>Total Tax Saving</span>
                  <span className="benefit-value">
                    {formatCurrency(result.taxBenefit.principalDeduction + result.taxBenefit.interestDeduction)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to="/contact" className="action-btn primary">
                <span className="btn-icon"><Calendar size={20} /></span>
                <span className="btn-text">Get Home Loan Assistance</span>
                <span className="btn-arrow">→</span>
              </Link>
              <button onClick={downloadReport} className="action-btn secondary">
                <span className="btn-icon"><Download size={20} /></span>
                <span className="btn-text">Download Report</span>
              </button>
            </div>

            <p className="calc-disclaimer">
              *This is an estimate. Actual loan terms depend on bank policies and credit assessment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeLoanCalculator;