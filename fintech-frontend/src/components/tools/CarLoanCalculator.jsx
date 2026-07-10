import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Car, Lightbulb, Wallet, Clock, TrendingUp, CreditCard, Calendar, Download, Info } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import { addReportHeader, addReportFooter } from "../../utils/pdfHelper";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CarLoanCalculator = () => {
  const [exShowroomPrice, setExShowroomPrice] = useState(800000);
  const [downPayment, setDownPayment] = useState(200000);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(9.5);
  const [processingFee, setProcessingFee] = useState(1);
  const [annualIncome, setAnnualIncome] = useState(600000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [insuranceCost, setInsuranceCost] = useState(30000);
  const [rtoCharges, setRtoCharges] = useState(80000);
  const [creditScore, setCreditScore] = useState(750);

  const sectionRef = useRef(null);
  const resultRef = useRef(null);
  const chartRef = useRef(null);

  // Calculate on-road price
  const onRoadPrice = useMemo(() => {
    return exShowroomPrice + insuranceCost + rtoCharges;
  }, [exShowroomPrice, insuranceCost, rtoCharges]);

  // Calculate loan amount
  const loanAmount = useMemo(() => {
    return Math.max(0, onRoadPrice - downPayment);
  }, [onRoadPrice, downPayment]);

  // Calculate EMI and loan details
  const result = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;

    if (!P || !r || !n || isNaN(P) || isNaN(r) || isNaN(n)) {
      return { 
        emi: 0, 
        totalInterest: 0, 
        totalPayment: 0,
        processingFeeAmount: 0,
        totalCost: 0
      };
    }

    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const processingFeeAmount = P * (processingFee / 100);
    
    // Calculate eligibility
    const maxEMI = annualIncome * 0.4 / 12 - existingEMI; // 40% of monthly income
    const eligibleLoan = maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    
    // Interest rate adjustment based on credit score
    let adjustedRate = interestRate;
    if (creditScore >= 750) adjustedRate = interestRate - 0.25;
    else if (creditScore < 650) adjustedRate = interestRate + 0.5;
    
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
      onRoadPrice,
      exShowroomPrice,
      processingFee: processingFeeAmount,
      totalCost: totalPayment + processingFeeAmount + downPayment,
      ltvRatio: (P / onRoadPrice) * 100,
      eligibility: {
        eligible: eligibleLoan >= P,
        eligibleLoan: Math.max(0, eligibleLoan),
        maxEMI,
        shortfall: Math.max(0, P - eligibleLoan)
      },
      adjustedRate,
      yearlySchedule,
      principalRatio: (P / totalPayment) * 100,
      interestRatio: (totalInterest / totalPayment) * 100,
      monthlyIncome: annualIncome / 12,
      emiToIncomeRatio: (emi / (annualIncome / 12)) * 100
    };
  }, [loanAmount, interestRate, loanTenure, processingFee, annualIncome, 
      existingEMI, onRoadPrice, downPayment, exShowroomPrice, creditScore]);

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
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });

      gsap.from(".yearly-bar", {
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

      await addReportHeader(doc, "Car Loan Analysis Report");
      
      // Vehicle Details
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Vehicle & Loan Details", 20, 70);
      
      const details = [
        ["Ex-Showroom Price:", formatCurrency(exShowroomPrice, true)],
        ["Insurance:", formatCurrency(insuranceCost, true)],
        ["RTO Charges:", formatCurrency(rtoCharges, true)],
        ["On-Road Price:", formatCurrency(onRoadPrice, true)],
        ["Down Payment:", formatCurrency(downPayment, true)],
        ["Loan Amount:", formatCurrency(loanAmount, true)],
        ["Interest Rate:", `${interestRate}% p.a.`],
        ["Loan Tenure:", `${loanTenure} years`]
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
        ["Total Interest:", formatCurrency(result.totalInterest, true)],
        ["Total Payment:", formatCurrency(result.totalPayment, true)],
        ["Processing Fee:", formatCurrency(result.processingFee, true)],
        ["Total Cost of Car:", formatCurrency(result.totalCost, true)]
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
      
      // Eligibility
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Loan Eligibility", 20, finalY);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Eligible Loan Amount: ${formatCurrency(result.eligibility.eligibleLoan, true)}`, 25, finalY + 10);
      doc.text(`Maximum EMI you can afford: ${formatCurrency(result.eligibility.maxEMI, true)}`, 25, finalY + 18);
      doc.text(`EMI to Income Ratio: ${result.emiToIncomeRatio.toFixed(1)}%`, 25, finalY + 26);
      doc.text(`Status: ${result.eligibility.eligible ? '✓ Eligible' : '✗ Review Needed'}`, 25, finalY + 34);
      
      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(107, 124, 143);
      doc.text("*This is an estimate. Actual loan terms depend on bank policies and credit assessment.", 20, doc.internal.pageSize.height - 20);
      
      addReportFooter(doc);
      doc.save(`Car_Loan_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <section className="calculator-section car-loan-calculator" ref={sectionRef}>
      <div className="container">
        <div className="calculator-header">
          <span className="calculator-eyebrow">
            <span className="eyebrow-icon"><Car size={16} /></span>
            Car Loan Calculator
          </span>
          <h1 className="calculator-title">
            Drive Your <span className="text-gradient">Dream Car</span>
          </h1>
          <p className="calculator-description">
            Calculate EMI, on-road price, and check your eligibility for a car loan.
          </p>
        </div>

        <div className="calculator-grid">
          {/* INPUT PANEL */}
          <div className="calc-inputs glass-effect">
            <div className="input-header">
              <div className="input-icon pulse-animation"><Car size={24} /></div>
              <h3>Car & Loan Details</h3>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Ex-Showroom Price</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={exShowroomPrice}
                    onChange={(e) => setExShowroomPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
              </label>
              <input
                type="range"
                min="300000"
                max="3000000"
                step="50000"
                value={exShowroomPrice}
                onChange={(e) => setExShowroomPrice(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹3L</span>
                <span>₹15L</span>
                <span>₹30L</span>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group half">
                <label className="input-label">
                  <span>Insurance</span>
                  <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={insuranceCost}
                    onChange={(e) => setInsuranceCost(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="5000"
                  value={insuranceCost}
                  onChange={(e) => setInsuranceCost(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>

              <div className="input-group half">
                <label className="input-label">
                  <span>RTO Charges</span>
                  <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={rtoCharges}
                    onChange={(e) => setRtoCharges(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
                </label>
                <input
                  type="range"
                  min="20000"
                  max="200000"
                  step="5000"
                  value={rtoCharges}
                  onChange={(e) => setRtoCharges(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>
            </div>

            <div className="input-group highlight-group">
              <label className="input-label">
                <span>On-Road Price</span>
                <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={onRoadPrice}
                    onChange={(e) => setDownPayment(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
              </label>
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
                max={onRoadPrice * 0.5}
                step="50000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹0</span>
                <span>₹7.5L</span>
                <span>₹15L</span>
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
                min="7"
                max="14"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>7%</span>
                <span>10.5%</span>
                <span>14%</span>
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
                min="1"
                max="7"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>1y</span>
                <span>4y</span>
                <span>7y</span>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group half">
                <label className="input-label">
                  <span>Annual Income</span>
                  <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
                </label>
                <input
                  type="range"
                  min="240000"
                  max="2400000"
                  step="50000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>

              <div className="input-group half">
                <label className="input-label">
                  <span>Credit Score</span>
                  <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={creditScore}
                    onChange={(e) => setCreditScore(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
                </label>
                <input
                  type="range"
                  min="300"
                  max="900"
                  step="10"
                  value={creditScore}
                  onChange={(e) => setCreditScore(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>
            </div>

            <div className="quick-tips">
              <div className="tip-item">
                <span className="tip-icon"><Lightbulb size={16} /></span>
                <span className="tip-text">Lower tenure = Higher EMI but less total interest</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon"><Wallet size={16} /></span>
                <span className="tip-text">20-30% down payment is recommended for better loan terms</span>
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="calc-results glass-effect" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon float-animation"><Car size={24} /></div>
              <h3>Car Loan Summary</h3>
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

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>Ex-Showroom:</span>
                <span>{formatCurrency(exShowroomPrice)}</span>
              </div>
              <div className="breakdown-row">
                <span>Insurance + RTO:</span>
                <span>{formatCurrency(insuranceCost + rtoCharges)}</span>
              </div>
              <div className="breakdown-row total">
                <span>On-Road Price:</span>
                <span>{formatCurrency(onRoadPrice)}</span>
              </div>
              <div className="breakdown-row">
                <span>Down Payment:</span>
                <span className="down-payment">{formatCurrency(downPayment)}</span>
              </div>
              <div className="breakdown-row loan">
                <span>Loan Amount:</span>
                <span>{formatCurrency(loanAmount)}</span>
              </div>
            </div>

            {/* Eligibility Indicator */}
            <div className="eligibility-card">
              <h4>Loan Eligibility</h4>
              <div className="eligibility-meter">
                <div className="meter-label">
                  <span>Required: {formatCurrency(loanAmount)}</span>
                  <span>Eligible: {formatCurrency(result.eligibility.eligibleLoan)}</span>
                </div>
                <div className="meter-bar">
                  <div 
                    className={`meter-fill ${result.eligibility.eligible ? 'eligible' : 'not-eligible'}`}
                    style={{ width: `${(result.eligibility.eligibleLoan / loanAmount) * 100}%` }}
                  ></div>
                </div>
                <div className="eligibility-stats">
                  <div className="stat">
                    <span className="stat-label">EMI/Income Ratio</span>
                    <span className={`stat-value ${result.emiToIncomeRatio > 40 ? 'warning' : 'good'}`}>
                      {result.emiToIncomeRatio.toFixed(1)}%
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Max EMI You Can Afford</span>
                    <span className="stat-value">{formatCurrency(result.eligibility.maxEMI)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon"><Wallet size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Loan Amount</div>
                  <div className="metric-value">{formatCurrency(loanAmount)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><TrendingUp size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Total Interest</div>
                  <div className="metric-value">{formatCurrency(result.totalInterest)}</div>
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
                <div className="metric-icon"><Car size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Total Car Cost</div>
                  <div className="metric-value">{formatCurrency(result.totalCost)}</div>
                </div>
              </div>
            </div>

            {/* Yearly Repayment Schedule */}
            <div className="amortization-preview" ref={chartRef}>
              <h4>Yearly Repayment Schedule</h4>
              <div className="preview-list">
                {result.yearlySchedule.slice(0, 5).map((item, index) => (
                  <div key={index} className="preview-item">
                    <span className="preview-year">Year {item.year}</span>
                    <div className="preview-bar">
                      <div 
                        className="bar-principal yearly-bar"
                        style={{ width: `${(item.principalPaid / loanAmount) * 100}%` }}
                      ></div>
                      <div 
                        className="bar-interest yearly-bar"
                        style={{ width: `${(item.interestPaid / loanAmount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="preview-balance">{formatCurrency(item.balance)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="quick-tips-results">
              <h4>Car Buying Tips</h4>
              <ul className="tips-list">
                <li>✓ Maintain credit score above 750 for best rates</li>
                <li>✓ Compare offers from multiple banks</li>
                <li>✓ Consider shorter tenure to save on interest</li>
                <li>✓ Check for special festive discounts</li>
              </ul>
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

            <p className="calc-disclaimer">
              *This is an estimate. Actual loan terms depend on bank policies and credit assessment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarLoanCalculator;