import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Lightbulb, GraduationCap, Clock, Wallet, TrendingUp, Gem, Zap, BarChart3, Calendar, Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import "../../styles/education.css";
import { addReportHeader, addReportFooter } from "../../utils/pdfHelper";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const EducationPlanningCalculator = () => {
  const [childAge, setChildAge] = useState(5);
  const [educationStartAge, setEducationStartAge] = useState(18);
  const [educationType, setEducationType] = useState('engineering');
  const [currentSavings, setCurrentSavings] = useState(200000);
  const [monthlySIP, setMonthlySIP] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [inflationRate, setInflationRate] = useState(8);

  // Education costs by type
  const educationCosts = {
    schooling: {
      currentCost: 200000,
      duration: 12,
      name: "School Education"
    },
    engineering: {
      currentCost: 800000,
      duration: 4,
      name: "Engineering"
    },
    medical: {
      currentCost: 1500000,
      duration: 5,
      name: "Medical"
    },
    mba: {
      currentCost: 2000000,
      duration: 2,
      name: "MBA"
    },
    studyAbroad: {
      currentCost: 4000000,
      duration: 2,
      name: "Study Abroad"
    }
  };

  const sectionRef = useRef(null);
  const resultRef = useRef(null);

  const result = useMemo(() => {
    const selectedEducation = educationCosts[educationType];
    const yearsToEducation = educationStartAge - childAge;
    const monthsToEducation = yearsToEducation * 12;

    // Future cost considering inflation
    const futureCost = selectedEducation.currentCost *
      Math.pow(1 + inflationRate / 100, yearsToEducation);

    // Future value of current savings
    const futureSavings = currentSavings * Math.pow(1 + returnRate / 100, yearsToEducation);

    // Future value of monthly SIPs
    const monthlyRate = returnRate / 12 / 100;
    const sipFutureValue = monthlySIP *
      ((Math.pow(1 + monthlyRate, monthsToEducation) - 1) / monthlyRate) * (1 + monthlyRate);

    const totalAvailable = futureSavings + sipFutureValue;
    const gap = Math.max(0, futureCost - totalAvailable);

    // Monthly investment needed
    const requiredMonthly = futureCost * monthlyRate /
      ((Math.pow(1 + monthlyRate, monthsToEducation) - 1) * (1 + monthlyRate));

    // Additional monthly investment needed
    const additionalMonthly = gap * monthlyRate /
      ((Math.pow(1 + monthlyRate, monthsToEducation) - 1) * (1 + monthlyRate));

    // Yearly breakdown
    const yearlyProjection = [];
    for (let year = 1; year <= yearsToEducation; year++) {
      const yearValue = currentSavings * Math.pow(1 + returnRate / 100, year) +
        monthlySIP * 12 * ((Math.pow(1 + returnRate / 100, year) - 1) / (returnRate / 100));
      yearlyProjection.push({
        year,
        value: yearValue
      });
    }

    return {
      educationName: selectedEducation.name,
      currentCost: selectedEducation.currentCost,
      futureCost,
      futureSavings,
      sipFutureValue,
      totalAvailable,
      gap,
      requiredMonthly,
      additionalMonthly,
      yearsToEducation,
      onTrack: totalAvailable >= futureCost,
      progress: (totalAvailable / futureCost) * 100,
      yearlyProjection,
      duration: selectedEducation.duration
    };
  }, [childAge, educationStartAge, educationType, currentSavings,
    monthlySIP, returnRate, inflationRate]);

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

      await addReportHeader(doc, "Education Planning Report");

      // Child Details
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Child's Education Details", 20, 70);

      const details = [
        ["Child's Current Age:", `${childAge} years`],
        ["Education Start Age:", `${educationStartAge} years`],
        ["Years to College:", `${result.yearsToEducation} years`],
        ["Education Type:", result.educationName],
        ["Course Duration:", `${result.duration} years`]
      ];

      let yPos = 80;
      details.forEach(([label, value]) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(label, 25, yPos);
        doc.text(value, 100, yPos);
        yPos += 8;
      });

      // Cost Summary
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Education Cost Summary", 20, yPos);

      const costData = [
        ["Current Cost:", formatLargeNumber(result.currentCost, true)],
        ["Future Cost (with inflation):", formatLargeNumber(result.futureCost, true)],
        ["Current Savings Future Value:", formatLargeNumber(result.futureSavings, true)],
        ["SIP Future Value:", formatLargeNumber(result.sipFutureValue, true)],
        ["Total Available:", formatLargeNumber(result.totalAvailable, true)],
        ["Gap to Fill:", formatLargeNumber(result.gap, true)]
      ];

      autoTable(doc, {
        startY: yPos + 5,
        body: costData,
        theme: 'striped',
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'right' }
        }
      });

      // Investment Required
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Monthly Investment Required", 20, finalY);

      doc.setFontSize(16);
      doc.setTextColor(47, 179, 74);
      doc.text(formatCurrency(result.requiredMonthly, true), 20, finalY + 10);

      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(107, 124, 143);
      doc.text("*This is an estimate. Actual education costs may vary based on institution and location.", 20, doc.internal.pageSize.height - 20);

      addReportFooter(doc);
      doc.save(`Education_Plan_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <section className="calculator-section education-calculator" ref={sectionRef}>
      <div className="container">
        <div className="calculator-header">
          <span className="calculator-eyebrow">
            <span className="eyebrow-icon"><BookOpen size={16} /></span>
            Education Planning
          </span>
          <h1 className="calculator-title">
            Secure Your Child's <span className="text-gradient">Educational Future</span>
          </h1>
          <p className="calculator-description">
            Calculate how much you need to save for your child's higher education.
          </p>
        </div>

        <div className="calculator-grid">
          {/* INPUT PANEL */}
          <div className="calc-inputs glass-effect">
            <div className="input-header">
              <div className="input-icon pulse-animation"><BookOpen size={24} /></div>
              <h3>Education Details</h3>
            </div>

            <div className="input-row">
              <div className="input-group half">
                <label className="input-label">
                  <span>Child's Age</span>
                  <div className="input-value-wrapper highlight">

                    <input
                      type="number"
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value === '' ? '' : Number(e.target.value))}
                      className="number-input"
                    />
                    <span> Years</span>
                  </div>
                </label>
                <input
                  type="range"
                  min="0"
                  max="17"
                  step="1"
                  value={childAge}
                  onChange={(e) => setChildAge(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
                <div className="slider-range">
                  <span>0y</span>
                  <span>8y</span>
                  <span>17y</span>
                </div>
              </div>

              <div className="input-group half">
                <label className="input-label">
                  <span>Education Start Age</span>
                  <div className="input-value-wrapper highlight">

                    <input
                      type="number"
                      value={educationStartAge}
                      onChange={(e) => setEducationStartAge(e.target.value === '' ? '' : Number(e.target.value))}
                      className="number-input"
                    />
                    <span> Years</span>
                  </div>
                </label>
                <input
                  type="range"
                  min="18"
                  max="25"
                  step="1"
                  value={educationStartAge}
                  onChange={(e) => setEducationStartAge(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
                <div className="slider-range">
                  <span>18y</span>
                  <span>21y</span>
                  <span>25y</span>
                </div>
              </div>
            </div>

            <div className="education-type-selector">
              <label className="input-label">Type of Education</label>
              <div className="education-grid">
                {Object.entries(educationCosts).map(([key, value]) => (
                  <button
                    key={key}
                    className={`education-btn ${educationType === key ? 'active' : ''}`}
                    onClick={() => setEducationType(key)}
                  >
                    {value.name}
                  </button>
                ))}
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
                max="2000000"
                step="50000"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹0</span>
                <span>₹10L</span>
                <span>₹20L</span>
              </div>
            </div>

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
                min="0"
                max="50000"
                step="1000"
                value={monthlySIP}
                onChange={(e) => setMonthlySIP(Number(e.target.value))}
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
                  <span>Return Rate (%)</span>
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
                <div className="slider-range">
                  <span>1%</span>
                  <span>8%</span>
                  <span>15%</span>
                </div>
              </div>

              <div className="input-group half">
                <label className="input-label">
                  <span>Education Inflation (%)</span>
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
                  min="5"
                  max="12"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
                <div className="slider-range">
                  <span>5%</span>
                  <span>8%</span>
                  <span>12%</span>
                </div>
              </div>
            </div>

            <div className="quick-tips">
              <div className="tip-item">
                <span className="tip-icon"><Lightbulb size={16} /></span>
                <span className="tip-text">Education inflation is typically higher than general inflation</span>
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="calc-results glass-effect" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon float-animation"><GraduationCap size={24} /></div>
              <h3>Education Fund</h3>
            </div>

            {/* Main Result */}
            <div className="main-result-card premium-card">
              <div className="card-glow"></div>
              <div className="result-label">Future Education Cost</div>
              <div className="result-number count-animation">
                {formatLargeNumber(result.futureCost)}
              </div>
              <div className="result-badge">
                <span className="badge-icon"><Clock size={16} /></span>
                <span>in {result.yearsToEducation} years</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-section">
              <h4>Savings Progress</h4>
              <div className="progress-container">
                <div className="progress-labels">
                  <span>Current: {formatLargeNumber(result.totalAvailable)}</span>
                  <span>Target: {formatLargeNumber(result.futureCost)}</span>
                </div>
                <div className="progress-bar-large">
                  <div
                    className={`progress-fill ${result.onTrack ? 'on-track' : 'off-track'}`}
                    style={{ width: `${Math.min(100, result.progress)}%` }}
                  >
                    {result.progress > 15 && `${result.progress.toFixed(1)}%`}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon"><Wallet size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Current Cost</div>
                  <div className="metric-value">{formatLargeNumber(result.currentCost)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><TrendingUp size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Future Cost</div>
                  <div className="metric-value">{formatLargeNumber(result.futureCost)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><Gem size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">SIP Future Value</div>
                  <div className="metric-value">{formatLargeNumber(result.sipFutureValue)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><Zap size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Gap to Fill</div>
                  <div className={`metric-value ${result.gap > 0 ? 'warning' : 'positive'}`}>
                    {formatLargeNumber(result.gap)}
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Required */}
            <div className="investment-card">
              <div className="investment-header">
                <span className="investment-icon"><BarChart3 size={16} /></span>
                <span className="investment-label">Monthly SIP Required</span>
              </div>
              <div className="investment-amount">{formatCurrency(result.requiredMonthly)}</div>
              {!result.onTrack && (
                <div className="investment-note">
                  Additional monthly SIP: {formatCurrency(result.additionalMonthly)}
                </div>
              )}
            </div>

            {/* Yearly Projection */}
            <div className="projection-section">
              <h4>Year-by-Year Growth</h4>
              <div className="growth-chart">
                {result.yearlyProjection.slice(0, 8).map((data, index) => (
                  <div key={index} className="chart-row">
                    <span className="chart-year">Year {data.year}</span>
                    <div className="chart-progress">
                      <div
                        className="progress-invested"
                        style={{ width: `${Math.min(100, (data.value / result.futureCost) * 100)}%`, borderRadius: '12px' }}
                      ></div>
                    </div>
                    <span className="chart-amount">{formatLargeNumber(data.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to="/contact" className="action-btn primary">
                <span className="btn-icon"><Calendar size={20} /></span>
                <span className="btn-text">Get Education Planning Advice</span>
                <span className="btn-arrow">→</span>
              </Link>
              <button onClick={downloadReport} className="action-btn secondary">
                <span className="btn-icon"><Download size={20} /></span>
                <span className="btn-text">Download Report</span>
              </button>
            </div>

            <p className="calc-disclaimer">
              *This is an estimate. Actual education costs may vary based on institution and location.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationPlanningCalculator;