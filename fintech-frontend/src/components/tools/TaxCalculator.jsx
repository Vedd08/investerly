import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Receipt, FileText, Sparkles, Lightbulb, Wallet, BarChart3, Calendar, Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import "../../styles/tax.css";
import { addReportHeader, addReportFooter } from "../../utils/pdfHelper";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TaxCalculator = () => {
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [age, setAge] = useState(30);
  const [regime, setRegime] = useState('new'); // 'old' or 'new'

  // Deductions (Old Regime)
  const [section80C, setSection80C] = useState(150000);
  const [section80D, setSection80D] = useState(25000);
  const [hra, setHra] = useState(120000);
  const [lta, setLta] = useState(30000);
  const [homeLoanInterest, setHomeLoanInterest] = useState(200000);
  const [nps, setNps] = useState(50000);
  const [educationLoan, setEducationLoan] = useState(0);
  const [donations, setDonations] = useState(0);

  // New Regime specific
  const [standardDeduction, setStandardDeduction] = useState(100000);

  const sectionRef = useRef(null);
  const resultRef = useRef(null);

  // Tax slabs based on age and regime
  const getTaxSlabs = useMemo(() => {
    if (regime === 'new') {
      // New Tax Regime (FY 2024-25)
      return [
        { limit: 400000, rate: 0 },
        { limit: 800000, rate: 5 },
        { limit: 1200000, rate: 10 },
        { limit: 1600000, rate: 15 },
        { limit: 2000000, rate: 20 },
        { limit: 2400000, rate: 25 },
        { limit: Infinity, rate: 30 }
      ];
    } else {
      // Old Tax Regime
      if (age < 60) {
        return [
          { limit: 250000, rate: 0 },
          { limit: 500000, rate: 5 },
          { limit: 1000000, rate: 20 },
          { limit: Infinity, rate: 30 }
        ];
      } else if (age < 80) {
        return [
          { limit: 300000, rate: 0 },
          { limit: 500000, rate: 5 },
          { limit: 1000000, rate: 20 },
          { limit: Infinity, rate: 30 }
        ];
      } else {
        return [
          { limit: 500000, rate: 0 },
          { limit: 1000000, rate: 20 },
          { limit: Infinity, rate: 30 }
        ];
      }
    }
  }, [age, regime]);

  // Calculate tax
  const result = useMemo(() => {
    // Calculate taxable income for old regime
    let oldRegimeTaxable = annualIncome;
    let oldRegimeDeductions = 0;

    if (regime === 'old') {
      // Section 80C (max 1.5L)
      oldRegimeDeductions += Math.min(section80C, 150000);

      // Section 80D (max based on age)
      const max80D = age < 60 ? 25000 : 50000;
      oldRegimeDeductions += Math.min(section80D, max80D);

      // HRA (actual rent paid - 10% of salary)
      // Simplified calculation
      oldRegimeDeductions += Math.min(hra, annualIncome * 0.4);

      // LTA (actual)
      oldRegimeDeductions += lta;

      // Home Loan Interest (max 2L for self-occupied)
      oldRegimeDeductions += Math.min(homeLoanInterest, 200000);

      // NPS (additional 50K under 80CCD)
      oldRegimeDeductions += Math.min(nps, 50000);

      // Education Loan Interest (no max limit)
      oldRegimeDeductions += educationLoan;

      // Donations (simplified)
      oldRegimeDeductions += donations;

      // Standard Deduction
      oldRegimeDeductions += standardDeduction;

      oldRegimeTaxable = Math.max(0, annualIncome - oldRegimeDeductions);
    }

    // Calculate tax for selected regime
    const taxableIncome = regime === 'old' ? oldRegimeTaxable : annualIncome - standardDeduction;

    let tax = 0;
    let remainingIncome = taxableIncome;
    let previousLimit = 0;
    const slabBreakdown = [];

    for (const slab of getTaxSlabs) {
      const slabLimit = slab.limit;
      if (remainingIncome > 0) {
        const taxableInSlab = Math.min(remainingIncome, slabLimit - previousLimit);
        const slabTax = (taxableInSlab * slab.rate) / 100;
        tax += slabTax;

        slabBreakdown.push({
          slab: `₹${previousLimit.toLocaleString()} - ₹${slabLimit === Infinity ? 'Above' : slabLimit.toLocaleString()}`,
          rate: `${slab.rate}%`,
          amount: taxableInSlab,
          tax: slabTax
        });

        remainingIncome -= taxableInSlab;
        previousLimit = slabLimit;
      } else {
        break;
      }
    }

    // Add cess
    const cess = tax * 0.04;
    const totalTax = tax + cess;

    // Calculate effective tax rate
    const effectiveRate = (totalTax / annualIncome) * 100;

    // Calculate savings between regimes
    // For comparison, calculate tax in both regimes
    const calculateOtherRegimeTax = () => {
      if (regime === 'old') {
        // Calculate new regime tax
        const newRegimeTaxable = annualIncome - 100000; // Only standard deduction
        let newTax = 0;
        let remainingNew = newRegimeTaxable;
        let prevLimit = 0;

        const newSlabs = [
          { limit: 400000, rate: 0 },
          { limit: 800000, rate: 5 },
          { limit: 1200000, rate: 10 },
          { limit: 1600000, rate: 15 },
          { limit: 2000000, rate: 20 },
          { limit: 2400000, rate: 25 },
          { limit: Infinity, rate: 30 }
        ];

        for (const slab of newSlabs) {
          if (remainingNew > 0) {
            const taxable = Math.min(remainingNew, slab.limit - prevLimit);
            newTax += (taxable * slab.rate) / 100;
            remainingNew -= taxable;
            prevLimit = slab.limit;
          }
        }
        return newTax + (newTax * 0.04);
      } else {
        // Calculate old regime tax
        let oldDeductions = Math.min(section80C, 150000) +
          Math.min(section80D, age < 60 ? 25000 : 50000) +
          standardDeduction; // Standard deduction
        const oldTaxable = Math.max(0, annualIncome - oldDeductions);
        let oldTax = 0;
        let remainingOld = oldTaxable;
        let prevLimit = 0;

        const oldSlabs = age < 60 ? [
          { limit: 250000, rate: 0 },
          { limit: 500000, rate: 5 },
          { limit: 1000000, rate: 20 },
          { limit: Infinity, rate: 30 }
        ] : [
          { limit: 300000, rate: 0 },
          { limit: 500000, rate: 5 },
          { limit: 1000000, rate: 20 },
          { limit: Infinity, rate: 30 }
        ];

        for (const slab of oldSlabs) {
          if (remainingOld > 0) {
            const taxable = Math.min(remainingOld, slab.limit - prevLimit);
            oldTax += (taxable * slab.rate) / 100;
            remainingOld -= taxable;
            prevLimit = slab.limit;
          }
        }
        return oldTax + (oldTax * 0.04);
      }
    };

    const otherRegimeTax = calculateOtherRegimeTax();
    const savings = Math.abs(totalTax - otherRegimeTax);
    const betterRegime = totalTax < otherRegimeTax ? regime : (regime === 'old' ? 'new' : 'old');

    return {
      grossIncome: annualIncome,
      taxableIncome,
      totalDeductions: regime === 'old' ? oldRegimeDeductions : standardDeduction,
      tax,
      cess,
      totalTax,
      effectiveRate,
      slabBreakdown,
      monthlyTax: totalTax / 12,
      otherRegimeTax,
      savings,
      betterRegime,
      regime
    };
  }, [annualIncome, age, regime, section80C, section80D, hra, lta,
    homeLoanInterest, nps, educationLoan, donations, standardDeduction, getTaxSlabs]);

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

      gsap.from(".tax-slab-item", {
        scrollTrigger: {
          trigger: resultRef.current,
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

      await addReportHeader(doc, "Tax Calculation Report");

      // Income Details
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Income Details", 20, 70);

      const details = [
        ["Annual Income:", formatCurrency(annualIncome, true)],
        ["Age:", `${age} years`],
        ["Tax Regime:", regime === 'old' ? 'Old Regime' : 'New Regime'],
        ["Taxable Income:", formatCurrency(result.taxableIncome, true)],
        ["Total Deductions:", formatCurrency(result.totalDeductions, true)]
      ];

      let yPos = 80;
      details.forEach(([label, value]) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(label, 25, yPos);
        doc.text(value, 100, yPos);
        yPos += 8;
      });

      // Tax Summary
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Tax Summary", 20, yPos);

      const summaryData = [
        ["Income Tax:", formatCurrency(result.tax, true)],
        ["Health & Education Cess (4%):", formatCurrency(result.cess, true)],
        ["Total Tax Payable:", formatCurrency(result.totalTax, true)],
        ["Effective Tax Rate:", `${result.effectiveRate.toFixed(2)}%`],
        ["Monthly Tax:", formatCurrency(result.monthlyTax, true)]
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

      // Regime Comparison
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Regime Comparison", 20, finalY);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Tax in ${regime === 'old' ? 'New' : 'Old'} Regime: ${formatCurrency(result.otherRegimeTax, true)}`, 25, finalY + 10);
      doc.text(`You can save: ${formatCurrency(result.savings, true)}`, 25, finalY + 18);
      doc.text(`Better Regime: ${result.betterRegime === 'old' ? 'Old Regime' : 'New Regime'}`, 25, finalY + 26);

      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(107, 124, 143);
      doc.text("*This is an estimate. Consult a tax advisor for accurate planning.", 20, doc.internal.pageSize.height - 20);

      addReportFooter(doc);
      doc.save(`Tax_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <section className="calculator-section tax-calculator" ref={sectionRef}>
      <div className="container">
        <div className="calculator-header">
          <span className="calculator-eyebrow">
            <span className="eyebrow-icon"><Receipt size={16} /></span>
            Tax Calculator
          </span>
          <h1 className="calculator-title">
            Calculate Your <span className="text-gradient">Income Tax</span>
          </h1>
          <p className="calculator-description">
            Compare old and new tax regimes, calculate deductions, and plan your taxes efficiently.
          </p>
        </div>

        <div className="calculator-grid">
          {/* INPUT PANEL */}
          <div className="calc-inputs glass-effect">
            <div className="input-header">
              <div className="input-icon pulse-animation"><Receipt size={24} /></div>
              <h3>Income & Deductions</h3>
            </div>

            {/* Basic Info */}
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
                  min="300000"
                  max="5000000"
                  step="50000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
                <div className="slider-range">
                  <span>₹3L</span>
                  <span>₹25L</span>
                  <span>₹50L</span>
                </div>
              </div>

              <div className="input-group half">
                <label className="input-label">
                  <span>Age</span>
                  <div className="input-value-wrapper highlight">

                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                      className="number-input"
                    />
                    <span> Years</span>
                  </div>
                </label>
                <input
                  type="range"
                  min="18"
                  max="100"
                  step="1"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
                <div className="slider-range">
                  <span>18</span>
                  <span>60</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* Regime Selector */}
            <div className="regime-selector">
              <label className="input-label">Tax Regime</label>
              <div className="regime-buttons">
                <button
                  className={`regime-btn ${regime === 'old' ? 'active' : ''}`}
                  onClick={() => setRegime('old')}
                >
                  <span className="regime-icon"><FileText size={24} /></span>
                  <span className="regime-name">Old Regime</span>
                  <span className="regime-desc">With Deductions</span>
                </button>
                <button
                  className={`regime-btn ${regime === 'new' ? 'active' : ''}`}
                  onClick={() => setRegime('new')}
                >
                  <span className="regime-icon"><Sparkles size={24} /></span>
                  <span className="regime-name">New Regime</span>
                  <span className="regime-desc">Lower Rates</span>
                </button>
              </div>
            </div>

            {/* Deductions - Only show for Old Regime */}
            {regime === 'old' && (
              <div className="deductions-section">
                <h4>Deductions (Section 80C, 80D, etc.)</h4>

                <div className="input-group">
                  <label className="input-label">
                    <span>Section 80C (PPF, ELSS, LIC, etc.)</span>
                    <div className="input-value-wrapper highlight">
                      <span>₹</span>
                      <input
                        type="number"
                        value={section80C}
                        onChange={(e) => setSection80C(e.target.value === '' ? '' : Number(e.target.value))}
                        className="number-input"
                      />

                    </div>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="5000"
                    value={section80C}
                    onChange={(e) => setSection80C(Number(e.target.value))}
                    className="slider-input styled-slider"
                  />
                  <div className="slider-range">
                    <span>₹0</span>
                    <span>₹75K</span>
                    <span>₹1.5L</span>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <span>Section 80D (Health Insurance)</span>
                    <div className="input-value-wrapper highlight">
                      <span>₹</span>
                      <input
                        type="number"
                        value={section80D}
                        onChange={(e) => setSection80D(e.target.value === '' ? '' : Number(e.target.value))}
                        className="number-input"
                      />

                    </div>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={age < 60 ? "25000" : "50000"}
                    step="5000"
                    value={section80D}
                    onChange={(e) => setSection80D(Number(e.target.value))}
                    className="slider-input styled-slider"
                  />
                  <div className="slider-range">
                    <span>₹0</span>
                    <span>₹25K</span>
                    <span>₹50K</span>
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group half">
                    <label className="input-label">
                      <span>HRA</span>
                      <div className="input-value-wrapper highlight">
                        <span>₹</span>
                        <input
                          type="number"
                          value={hra}
                          onChange={(e) => setHra(e.target.value === '' ? '' : Number(e.target.value))}
                          className="number-input"
                        />

                      </div>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={annualIncome * 0.5}
                      step="10000"
                      value={hra}
                      onChange={(e) => setHra(Number(e.target.value))}
                      className="slider-input styled-slider"
                    />
                  </div>

                  <div className="input-group half">
                    <label className="input-label">
                      <span>LTA</span>
                      <div className="input-value-wrapper highlight">
                        <span>₹</span>
                        <input
                          type="number"
                          value={lta}
                          onChange={(e) => setLta(e.target.value === '' ? '' : Number(e.target.value))}
                          className="number-input"
                        />

                      </div>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="5000"
                      value={lta}
                      onChange={(e) => setLta(Number(e.target.value))}
                      className="slider-input styled-slider"
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group half">
                    <label className="input-label">
                      <span>Home Loan Interest</span>
                      <div className="input-value-wrapper highlight">
                        <span>₹</span>
                        <input
                          type="number"
                          value={homeLoanInterest}
                          onChange={(e) => setHomeLoanInterest(e.target.value === '' ? '' : Number(e.target.value))}
                          className="number-input"
                        />

                      </div>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="10000"
                      value={homeLoanInterest}
                      onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
                      className="slider-input styled-slider"
                    />
                  </div>

                  <div className="input-group half">
                    <label className="input-label">
                      <span>NPS (80CCD)</span>
                      <div className="input-value-wrapper highlight">
                        <span>₹</span>
                        <input
                          type="number"
                          value={nps}
                          onChange={(e) => setNps(e.target.value === '' ? '' : Number(e.target.value))}
                          className="number-input"
                        />

                      </div>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="5000"
                      value={nps}
                      onChange={(e) => setNps(Number(e.target.value))}
                      className="slider-input styled-slider"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* New Regime - Standard Deduction */}
            {regime === 'new' && (
              <div className="deductions-section">
                <h4>Standard Deduction</h4>
                <div className="input-group">
                  <label className="input-label">
                    <span>Standard Deduction</span>
                    <div className="input-value-wrapper highlight">
                      <span>₹</span>
                      <input
                        type="number"
                        value={standardDeduction}
                        onChange={(e) => setStandardDeduction(e.target.value === '' ? '' : Number(e.target.value))}
                        className="number-input"
                      />

                    </div>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="5000"
                    value={standardDeduction}
                    onChange={(e) => setStandardDeduction(Number(e.target.value))}
                    className="slider-input styled-slider"
                  />
                </div>
              </div>
            )}

            <div className="quick-tips">
              <div className="tip-item">
                <span className="tip-icon"><Lightbulb size={16} /></span>
                <span className="tip-text">Old regime is better if you have significant deductions (80C, 80D, HRA)</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon"><Wallet size={16} /></span>
                <span className="tip-text">New regime offers lower tax rates but fewer deductions</span>
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="calc-results glass-effect" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon float-animation"><Wallet size={24} /></div>
              <h3>Tax Calculation</h3>
            </div>

            {/* Main Tax Card */}
            <div className="main-result-card premium-card">
              <div className="card-glow"></div>
              <div className="result-label">Total Tax Payable</div>
              <div className="result-number count-animation">{formatCurrency(result.totalTax)}</div>
              <div className="result-badge">
                <span className="badge-icon"><BarChart3 size={16} /></span>
                <span>Effective Rate: {result.effectiveRate.toFixed(2)}%</span>
              </div>
            </div>

            {/* Income Summary */}
            <div className="income-summary">
              <div className="summary-row">
                <span>Gross Income:</span>
                <span>{formatCurrency(result.grossIncome)}</span>
              </div>
              <div className="summary-row">
                <span>Total Deductions:</span>
                <span className="deduction">{formatCurrency(result.totalDeductions)}</span>
              </div>
              <div className="summary-row taxable">
                <span>Taxable Income:</span>
                <span>{formatCurrency(result.taxableIncome)}</span>
              </div>
            </div>

            {/* Tax Slab Breakdown */}
            <div className="slab-breakdown">
              <h4>Tax Slab Breakdown</h4>
              {result.slabBreakdown.map((slab, index) => (
                slab.amount > 0 && (
                  <div key={index} className="tax-slab-item">
                    <div className="slab-header">
                      <div className="slab-info">
                        <span className="slab-range">{slab.slab}</span>
                        <span className="slab-rate">{slab.rate}</span>
                      </div>
                      <div className="slab-amount">
                        <span className="amount-label">Taxable: {formatCurrency(slab.amount)}</span>
                        <span className="tax-value">Tax: {formatCurrency(slab.tax)}</span>
                      </div>
                    </div>
                    <div className="slab-progress">
                      <div
                        className="progress-fill"
                        style={{ width: `${(slab.amount / result.taxableIncome) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Tax Components */}
            <div className="tax-components">
              <div className="component">
                <span>Income Tax:</span>
                <span>{formatCurrency(result.tax)}</span>
              </div>
              <div className="component">
                <span>Health & Education Cess (4%):</span>
                <span>{formatCurrency(result.cess)}</span>
              </div>
              <div className="component total">
                <span>Total Tax:</span>
                <span>{formatCurrency(result.totalTax)}</span>
              </div>
            </div>

            {/* Regime Comparison */}
            <div className="regime-comparison">
              <h4>Regime Comparison</h4>
              <div className="comparison-row">
                <span className={regime === 'old' ? 'current' : 'other'}>
                  Old Regime: {formatCurrency(regime === 'old' ? result.totalTax : result.otherRegimeTax)}
                </span>
                <span className={regime === 'new' ? 'current' : 'other'}>
                  New Regime: {formatCurrency(regime === 'new' ? result.totalTax : result.otherRegimeTax)}
                </span>
              </div>
              <div className="savings-note">
                {result.savings > 0 ? (
                  <p className="savings-positive">
                    ✨ You can save {formatCurrency(result.savings)} by choosing {result.betterRegime === 'old' ? 'Old' : 'New'} Regime
                  </p>
                ) : (
                  <p className="savings-neutral">Both regimes give similar tax liability</p>
                )}
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="monthly-breakdown">
              <h4>Monthly Tax Liability</h4>
              <div className="monthly-amount">{formatCurrency(result.monthlyTax)}</div>
              <p className="monthly-note">per month</p>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to="/contact" className="action-btn primary">
                <span className="btn-icon"><Calendar size={20} /></span>
                <span className="btn-text">Get Tax Consultation</span>
                <span className="btn-arrow">→</span>
              </Link>
              <button onClick={downloadReport} className="action-btn secondary">
                <span className="btn-icon"><Download size={20} /></span>
                <span className="btn-text">Download Report</span>
              </button>
            </div>

            <p className="calc-disclaimer">
              *This is an estimate. Consult a tax advisor for accurate planning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaxCalculator;