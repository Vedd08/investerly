import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Target, Wallet, Landmark, BookOpen, Calendar, Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import "../../styles/life-insurance.css";
import { addReportHeader, addReportFooter } from "../../utils/pdfHelper";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LifeInsuranceCalculator = () => {
  const [age, setAge] = useState(30);
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [existingCoverage, setExistingCoverage] = useState(0);
  const [dependents, setDependents] = useState(2);
  const [loanOutstanding, setLoanOutstanding] = useState(5000000);
  const [childrenEducation, setChildrenEducation] = useState(2000000);
  const [inflationRate, setInflationRate] = useState(6);

  const sectionRef = useRef(null);
  const resultRef = useRef(null);

  const result = useMemo(() => {
    // Human Life Value Method
    const workingYearsLeft = 60 - age;
    const futureIncome = annualIncome * ((1 - Math.pow(1 + inflationRate / 100, workingYearsLeft)) / (1 - (1 + inflationRate / 100)));

    // Expense Method
    const annualExpenses = monthlyExpenses * 12;
    const expensesNeeded = annualExpenses * 20; // 20 years coverage

    // Liability Method
    const totalLiabilities = loanOutstanding + childrenEducation;

    // Calculate using different methods
    const hlvCoverage = futureIncome * 0.7; // 70% of future income
    const expenseCoverage = expensesNeeded;
    const liabilityCoverage = totalLiabilities;
    const incomeReplacement = annualIncome * 15; // 15 years income

    // Recommended coverage (average of methods, adjusted for existing coverage)
    const recommendedCoverage = Math.max(
      hlvCoverage,
      expenseCoverage,
      liabilityCoverage,
      incomeReplacement
    ) - existingCoverage;

    // Monthly premium estimate (assuming term insurance)
    const premiumRate = 0.001; // Approximate premium rate
    const monthlyPremium = (recommendedCoverage * premiumRate) / 12;

    // Family needs analysis
    const familyNeeds = {
      incomeReplacement: incomeReplacement,
      debtClearance: loanOutstanding,
      education: childrenEducation,
      emergency: annualIncome * 0.5
    };

    return {
      recommendedCoverage: Math.max(0, recommendedCoverage),
      monthlyPremium,
      hlvCoverage,
      expenseCoverage,
      liabilityCoverage,
      incomeReplacement,
      familyNeeds,
      coverageGap: Math.max(0, recommendedCoverage - existingCoverage),
      protectionRatio: (existingCoverage / (recommendedCoverage + existingCoverage)) * 100
    };
  }, [age, annualIncome, monthlyExpenses, existingCoverage, dependents,
    loanOutstanding, childrenEducation, inflationRate]);

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

      await addReportHeader(doc, "Life Insurance Needs Analysis");

      // Personal Details
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Personal Details", 20, 70);

      const details = [
        ["Age:", `${age} years`],
        ["Annual Income:", formatCurrency(annualIncome, true)],
        ["Monthly Expenses:", formatCurrency(monthlyExpenses, true)],
        ["Dependents:", dependents.toString()],
        ["Existing Coverage:", formatLargeNumber(existingCoverage, true)]
      ];

      let yPos = 80;
      details.forEach(([label, value]) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(label, 25, yPos);
        doc.text(value, 100, yPos);
        yPos += 8;
      });

      // Recommended Coverage
      yPos += 10;
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(47, 179, 74);
      doc.text(`Recommended Coverage: ${formatLargeNumber(result.recommendedCoverage, true)}`, 20, yPos);

      yPos += 15;

      // Family Needs Breakdown
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Family Needs Analysis", 20, yPos);

      const needsData = Object.entries(result.familyNeeds).map(([key, value]) => [
        key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        formatLargeNumber(value, true)
      ]);

      autoTable(doc, {
        startY: yPos + 5,
        head: [['Need', 'Amount Required']],
        body: needsData,
        theme: 'striped',
        headStyles: {
          fillColor: [46, 63, 86],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        }
      });

      // Premium Estimate
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Monthly Premium Estimate", 20, finalY);

      doc.setFontSize(14);
      doc.setTextColor(47, 179, 74);
      doc.text(formatCurrency(result.monthlyPremium, true), 20, finalY + 10);

      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(107, 124, 143);
      doc.text("*This is an estimate. Actual premiums may vary based on health and policy terms.", 20, doc.internal.pageSize.height - 20);

      addReportFooter(doc);
      doc.save(`Life_Insurance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <section className="calculator-section life-insurance-calculator" ref={sectionRef}>
      <div className="container">
        <div className="calculator-header">
          <span className="calculator-eyebrow">
            <span className="eyebrow-icon"><Shield size={16} /></span>
            Life Insurance
          </span>
          <h1 className="calculator-title">
            Protect Your <span className="text-gradient">Family's Future</span>
          </h1>
          <p className="calculator-description">
            Calculate the right life insurance coverage to secure your loved ones financially.
          </p>
        </div>

        <div className="calculator-grid">
          {/* INPUT PANEL */}
          <div className="calc-inputs glass-effect">
            <div className="input-header">
              <div className="input-icon pulse-animation"><Shield size={24} /></div>
              <h3>Personal Information</h3>
            </div>

            <div className="input-row">
              <div className="input-group half">
                <label className="input-label">
                  <span>Your Age</span>
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
                  max="60"
                  step="1"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>

              <div className="input-group half">
                <label className="input-label">
                  <span>Dependents</span>
                  <div className="input-value-wrapper highlight">

                    <input
                      type="number"
                      value={dependents}
                      onChange={(e) => setDependents(e.target.value === '' ? '' : Number(e.target.value))}
                      className="number-input"
                    />

                  </div>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={dependents}
                  onChange={(e) => setDependents(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>
            </div>

            <div className="input-group">
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
                step="100000"
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

            <div className="input-group">
              <label className="input-label">
                <span>Monthly Expenses</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />

                </div>
              </label>
              <input
                type="range"
                min="10000"
                max="300000"
                step="5000"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹10K</span>
                <span>₹1.5L</span>
                <span>₹3L</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Existing Coverage</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={existingCoverage}
                    onChange={(e) => setExistingCoverage(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />

                </div>
              </label>
              <input
                type="range"
                min="0"
                max="10000000"
                step="500000"
                value={existingCoverage}
                onChange={(e) => setExistingCoverage(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹0</span>
                <span>₹50L</span>
                <span>₹1Cr</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Outstanding Loans</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={loanOutstanding}
                    onChange={(e) => setLoanOutstanding(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />

                </div>
              </label>
              <input
                type="range"
                min="0"
                max="10000000"
                step="500000"
                value={loanOutstanding}
                onChange={(e) => setLoanOutstanding(Number(e.target.value))}
                className="slider-input styled-slider"
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Children Education</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={childrenEducation}
                    onChange={(e) => setChildrenEducation(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />

                </div>
              </label>
              <input
                type="range"
                min="0"
                max="5000000"
                step="100000"
                value={childrenEducation}
                onChange={(e) => setChildrenEducation(Number(e.target.value))}
                className="slider-input styled-slider"
              />
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="calc-results glass-effect" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon float-animation"><Target size={24} /></div>
              <h3>Coverage Analysis</h3>
            </div>

            {/* Main Result */}
            <div className="main-result-card premium-card">
              <div className="card-glow"></div>
              <div className="result-label">Recommended Coverage</div>
              <div className="result-number count-animation">
                {formatLargeNumber(result.recommendedCoverage)}
              </div>
              <div className="result-badge">
                <span className="badge-icon"><Wallet size={16} /></span>
                <span>Monthly Premium: {formatCurrency(result.monthlyPremium)}</span>
              </div>
            </div>

            {/* Coverage Gap Meter */}
            <div className="coverage-meter">
              <h4>Coverage Gap Analysis</h4>
              <div className="meter-container">
                <div className="meter-label">
                  <span>Existing: {formatLargeNumber(existingCoverage)}</span>
                  <span>Needed: {formatLargeNumber(result.recommendedCoverage + existingCoverage)}</span>
                </div>
                <div className="meter-bar">
                  <div
                    className="meter-fill existing"
                    style={{ width: `${result.protectionRatio}%` }}
                  >
                    {result.protectionRatio > 15 && `${result.protectionRatio.toFixed(0)}%`}
                  </div>
                  <div
                    className="meter-fill gap"
                    style={{ width: `${100 - result.protectionRatio}%` }}
                  >
                    {100 - result.protectionRatio > 15 && `Gap: ${(100 - result.protectionRatio).toFixed(0)}%`}
                  </div>
                </div>
              </div>
            </div>

            {/* Family Needs Grid */}
            <div className="needs-grid">
              <h4>Family Needs Breakdown</h4>
              <div className="needs-cards">
                <div className="need-card">
                  <div className="need-icon"><Wallet size={24} /></div>
                  <div className="need-content">
                    <span className="need-label">Income Replacement</span>
                    <span className="need-value">{formatLargeNumber(result.familyNeeds.incomeReplacement)}</span>
                  </div>
                </div>

                <div className="need-card">
                  <div className="need-icon"><Landmark size={24} /></div>
                  <div className="need-content">
                    <span className="need-label">Debt Clearance</span>
                    <span className="need-value">{formatLargeNumber(result.familyNeeds.debtClearance)}</span>
                  </div>
                </div>

                <div className="need-card">
                  <div className="need-icon"><BookOpen size={24} /></div>
                  <div className="need-content">
                    <span className="need-label">Education Fund</span>
                    <span className="need-value">{formatLargeNumber(result.familyNeeds.education)}</span>
                  </div>
                </div>


              </div>
            </div>

            {/* Calculation Methods */}
            <div className="methods-section">
              <h4>Coverage Calculation Methods</h4>
              <div className="method-items">
                <div className="method-item">
                  <span className="method-name">Human Life Value</span>
                  <span className="method-value">{formatLargeNumber(result.hlvCoverage)}</span>
                </div>
                <div className="method-item">
                  <span className="method-name">Expense Method</span>
                  <span className="method-value">{formatLargeNumber(result.expenseCoverage)}</span>
                </div>
                <div className="method-item">
                  <span className="method-name">Liability Method</span>
                  <span className="method-value">{formatLargeNumber(result.liabilityCoverage)}</span>
                </div>
                <div className="method-item">
                  <span className="method-name">Income Replacement</span>
                  <span className="method-value">{formatLargeNumber(result.incomeReplacement)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to="/contact" className="action-btn primary">
                <span className="btn-icon"><Calendar size={20} /></span>
                <span className="btn-text">Get Insurance Quote</span>
                <span className="btn-arrow">→</span>
              </Link>
              <button onClick={downloadReport} className="action-btn secondary">
                <span className="btn-icon"><Download size={20} /></span>
                <span className="btn-text">Download Report</span>
              </button>
            </div>

            <p className="calc-disclaimer">
              *This is an estimate. Actual coverage needs may vary based on individual circumstances.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifeInsuranceCalculator;